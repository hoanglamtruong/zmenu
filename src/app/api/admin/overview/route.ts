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

    const pendingCountRes = await pool.query<{ count: number }>(
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

    const pendingProductsRes = await pool.query(
      `SELECT
         p.id, p.name_vi, p.name_en,
         (p.price)::float8 AS price,
         p.image_url, p.created_at,
         u.full_name AS staff_name,
         u.email AS staff_email
       FROM products p
       LEFT JOIN users u ON u.id = p.created_by
       WHERE p.tenant_id = $1 AND p.status = 'pending'
       ORDER BY p.created_at DESC NULLS LAST
       LIMIT 3`,
      [tenantPgId]
    );

    const bestSellerRes = await pool.query<{
      name_vi: string | null;
      name_en: string | null;
      qty: number;
    }>(
      `SELECT p.name_vi, p.name_en, SUM(oi.quantity)::int AS qty
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE o.tenant_id = $1 AND o.status = 'completed'
         AND o.created_at >= CURRENT_DATE
       GROUP BY p.id, p.name_vi, p.name_en
       ORDER BY qty DESC NULLS LAST
       LIMIT 1`,
      [tenantPgId]
    );

    return NextResponse.json({
      revenue_today: todayRes.rows[0]?.revenue_today ?? 0,
      orders_today: todayRes.rows[0]?.orders_today ?? 0,
      pending_count: pendingCountRes.rows[0]?.count ?? 0,
      best_seller: bestSellerRes.rows[0] ?? null,
      series: seriesRes.rows,
      recent_orders: recentRes.rows,
      pending_products: pendingProductsRes.rows,
    });
  } catch (err) {
    console.error("[/api/admin/overview] error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
