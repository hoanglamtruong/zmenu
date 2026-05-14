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
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const tenantPgId = session.user.tenant_id;
  if (!tenantPgId) {
    return NextResponse.json({ error: "no tenant" }, { status: 400 });
  }

  try {
    const todayRes = await pool.query<{
      revenue_today: number;
      orders_today: number;
    }>(
      `SELECT
         COALESCE(SUM(oi.price * oi.quantity), 0)::float8 AS revenue_today,
         COUNT(DISTINCT o.id)::int AS orders_today
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.tenant_id = $1
         AND o.status = 'completed'
         AND o.created_at >= CURRENT_DATE`,
      [tenantPgId]
    );

    const pendingRes = await pool.query<{ count: number }>(
      `SELECT COUNT(*)::int AS count
       FROM products
       WHERE tenant_id = $1 AND status = 'pending'`,
      [tenantPgId]
    );

    const seriesRes = await pool.query(
      `WITH days AS (
         SELECT generate_series(
           CURRENT_DATE - INTERVAL '6 days',
           CURRENT_DATE,
           INTERVAL '1 day'
         )::date AS day
       )
       SELECT
         d.day::text AS bucket,
         COALESCE(SUM(oi.price * oi.quantity), 0)::float8 AS revenue,
         COUNT(DISTINCT o.id)::int AS order_count
       FROM days d
       LEFT JOIN orders o
         ON o.created_at::date = d.day
         AND o.tenant_id = $1
         AND o.status = 'completed'
       LEFT JOIN order_items oi ON oi.order_id = o.id
       GROUP BY d.day
       ORDER BY d.day`,
      [tenantPgId]
    );

    const recentRes = await pool.query(
      `SELECT
         o.id, o.table_id, o.status, o.created_at,
         COALESCE(SUM(oi.quantity), 0)::int AS item_count,
         COALESCE(SUM(oi.price * oi.quantity), 0)::float8 AS total
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.tenant_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC NULLS LAST
       LIMIT 5`,
      [tenantPgId]
    );

    return NextResponse.json({
      revenue_today: todayRes.rows[0]?.revenue_today ?? 0,
      orders_today: todayRes.rows[0]?.orders_today ?? 0,
      pending_count: pendingRes.rows[0]?.count ?? 0,
      series: seriesRes.rows,
      recent_orders: recentRes.rows,
    });
  } catch (err) {
    console.error("[/api/admin/overview] error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
