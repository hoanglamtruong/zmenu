import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { pool } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
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

  try {
    const { rows } = await pool.query(
      `SELECT
         o.id,
         o.table_id,
         o.status,
         o.created_at,
         COALESCE(SUM(oi.quantity), 0)::int AS item_count,
         COALESCE(SUM(oi.price * oi.quantity), 0)::float8 AS total
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.tenant_id = $1
         AND o.status NOT IN ('completed', 'cancelled')
       GROUP BY o.id
       ORDER BY o.created_at DESC NULLS LAST`,
      [tenantPgId]
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[/api/staff/orders] error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
