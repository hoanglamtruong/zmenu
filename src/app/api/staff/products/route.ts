import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { pool } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireStaff() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "unauthorized" as const, status: 401 };
  const role = session.user.role;
  if (role !== "staff" && role !== "admin") {
    return { error: "forbidden" as const, status: 403 };
  }
  const tenantPgId = session.user.tenant_id;
  if (!tenantPgId) return { error: "no tenant" as const, status: 400 };
  return { tenantPgId, role };
}

export async function GET(request: NextRequest) {
  const auth = await requireStaff();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  try {
    const params: Array<string> = [auth.tenantPgId];
    let where = "WHERE p.tenant_id = $1";
    if (statusFilter && statusFilter !== "all") {
      params.push(statusFilter);
      where += ` AND p.status = $${params.length}`;
    }

    const { rows } = await pool.query(
      `SELECT
         p.id, p.name_vi, p.name_en,
         (p.price)::float8 AS price,
         p.image_url, p.category_id, p.status,
         p.is_flash_deal, p.flash_name, p.flash_qty, p.flash_ends_at,
         p.is_active, p.created_at,
         c.name_vi AS category_name_vi
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ${where}
       ORDER BY p.created_at DESC NULLS LAST, p.id`,
      params
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[/api/staff/products] GET error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

type CreateBody = {
  name_vi?: string;
  name_en?: string;
  price?: number | string;
  image_url?: string | null;
  category_id?: string | null;
  is_flash_deal?: boolean;
  flash_name?: string | null;
  flash_qty?: number | null;
  flash_ends_at?: string | null;
};

export async function POST(request: NextRequest) {
  const auth = await requireStaff();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const name_vi = body.name_vi?.trim();
  if (!name_vi) {
    return NextResponse.json(
      { error: "name_vi required" },
      { status: 400 }
    );
  }
  const price = Number(body.price);
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "invalid price" }, { status: 400 });
  }

  try {
    const { rows } = await pool.query<{ id: string }>(
      `INSERT INTO products (
         tenant_id, name_vi, name_en, price, image_url, category_id,
         is_flash_deal, flash_name, flash_qty, flash_ends_at,
         status, is_active, created_at
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', true, NOW()
       ) RETURNING id`,
      [
        auth.tenantPgId,
        name_vi,
        body.name_en?.trim() || null,
        price,
        body.image_url ?? null,
        body.category_id ?? null,
        Boolean(body.is_flash_deal),
        body.flash_name?.trim() || null,
        body.flash_qty ?? null,
        body.flash_ends_at ?? null,
      ]
    );
    return NextResponse.json({ id: rows[0].id }, { status: 201 });
  } catch (err) {
    console.error("[/api/staff/products] POST error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

type PatchBody = {
  id?: string;
  is_active?: boolean;
};

export async function PATCH(request: NextRequest) {
  const auth = await requireStaff();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  if (typeof body.is_active !== "boolean") {
    return NextResponse.json(
      { error: "is_active boolean required" },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      `UPDATE products
       SET is_active = $2, updated_at = NOW()
       WHERE id = $1 AND tenant_id = $3
       RETURNING id, is_active`,
      [id, body.is_active, auth.tenantPgId]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("[/api/staff/products] PATCH error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
