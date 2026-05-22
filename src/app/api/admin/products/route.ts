import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { pool } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "unauthorized" as const, status: 401 };
  if (session.user.role !== "admin") {
    return { error: "forbidden" as const, status: 403 };
  }
  const tenantPgId = session.user.tenant_id;
  if (!tenantPgId) return { error: "no tenant" as const, status: 400 };
  return { tenantPgId };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status") ?? "pending";

  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.name_vi, p.name_en,
              (p.price)::float8 AS price,
              p.image_url, p.category_id, p.status,
              p.created_at, p.created_by,
              u.full_name AS staff_name,
              u.email AS staff_email
       FROM products p
       LEFT JOIN users u ON u.id = p.created_by
       WHERE p.tenant_id = $1 AND p.status = $2
       ORDER BY p.created_at DESC NULLS LAST, p.id`,
      [auth.tenantPgId, statusFilter]
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[/api/admin/products] GET error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

const ALLOWED_PRODUCT_STATUSES = new Set(["pending", "active", "inactive"]);

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: { id?: string; status?: string };
  try {
    body = (await request.json()) as { id?: string; status?: string };
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const id = body.id?.trim();
  const status = body.status?.trim();
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  if (!status || !ALLOWED_PRODUCT_STATUSES.has(status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  try {
    const result = await pool.query<{ id: string; status: string }>(
      `UPDATE products
       SET status = $2, updated_at = NOW()
       WHERE id = $1 AND tenant_id = $3
       RETURNING id, status`,
      [id, status, auth.tenantPgId]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("[/api/admin/products] PATCH error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
