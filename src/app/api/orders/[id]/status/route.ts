import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { pool } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set([
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);

type RouteContext = {
  params: { id: string };
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const role = session.user.role;
  if (role !== "staff" && role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const tenantPgId = session.user.tenant_id;
  if (!tenantPgId) {
    return NextResponse.json({ error: "no tenant" }, { status: 400 });
  }

  const orderId = params.id;
  if (!orderId) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = (await request.json()) as { status?: string };
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const status = body.status?.trim();
  if (!status || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  try {
    const result = await pool.query<{ id: string; status: string }>(
      `UPDATE orders
       SET status = $2, updated_at = NOW()
       WHERE id = $1 AND tenant_id = $3
       RETURNING id, status`,
      [orderId, status, tenantPgId]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("[/api/orders/[id]/status] error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
