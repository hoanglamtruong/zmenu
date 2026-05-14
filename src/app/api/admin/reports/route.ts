import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { pool } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PeriodKey = "day" | "week" | "month";

const PERIOD_CONFIG: Record<
  PeriodKey,
  { trunc: "day" | "week" | "month"; interval: string; buckets: number }
> = {
  day: { trunc: "day", interval: "1 day", buckets: 7 },
  week: { trunc: "week", interval: "1 week", buckets: 8 },
  month: { trunc: "month", interval: "1 month", buckets: 12 },
};

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
  const rawPeriod = searchParams.get("period") ?? "day";
  const period = (Object.keys(PERIOD_CONFIG) as PeriodKey[]).includes(
    rawPeriod as PeriodKey
  )
    ? (rawPeriod as PeriodKey)
    : "day";
  const cfg = PERIOD_CONFIG[period];

  try {
    const seriesQuery = `
      WITH buckets AS (
        SELECT generate_series(
          date_trunc('${cfg.trunc}', NOW()) - ($2 - 1) * INTERVAL '${cfg.interval}',
          date_trunc('${cfg.trunc}', NOW()),
          INTERVAL '${cfg.interval}'
        )::date AS bucket
      )
      SELECT
        b.bucket::text AS bucket,
        COALESCE(SUM(oi.price * oi.quantity), 0)::float8 AS revenue,
        COUNT(DISTINCT o.id)::int AS order_count
      FROM buckets b
      LEFT JOIN orders o
        ON date_trunc('${cfg.trunc}', o.created_at) = b.bucket
        AND o.tenant_id = $1
        AND o.status = 'completed'
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY b.bucket
      ORDER BY b.bucket
    `;
    const seriesRes = await pool.query(seriesQuery, [
      auth.tenantPgId,
      cfg.buckets,
    ]);

    const currentQuery = `
      SELECT COALESCE(SUM(oi.price * oi.quantity), 0)::float8 AS revenue
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.tenant_id = $1 AND o.status = 'completed'
        AND o.created_at >= date_trunc('${cfg.trunc}', NOW()) - ($2 - 1) * INTERVAL '${cfg.interval}'
    `;
    const currentRes = await pool.query(currentQuery, [
      auth.tenantPgId,
      cfg.buckets,
    ]);

    const previousQuery = `
      SELECT COALESCE(SUM(oi.price * oi.quantity), 0)::float8 AS revenue
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.tenant_id = $1 AND o.status = 'completed'
        AND o.created_at >= date_trunc('${cfg.trunc}', NOW()) - (2 * $2 - 1) * INTERVAL '${cfg.interval}'
        AND o.created_at < date_trunc('${cfg.trunc}', NOW()) - ($2 - 1) * INTERVAL '${cfg.interval}'
    `;
    const previousRes = await pool.query(previousQuery, [
      auth.tenantPgId,
      cfg.buckets,
    ]);

    const topQuery = `
      SELECT
        p.id, p.name_vi, p.name_en,
        SUM(oi.quantity)::int AS quantity,
        SUM(oi.price * oi.quantity)::float8 AS revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE o.tenant_id = $1 AND o.status = 'completed'
        AND o.created_at >= date_trunc('${cfg.trunc}', NOW()) - ($2 - 1) * INTERVAL '${cfg.interval}'
      GROUP BY p.id, p.name_vi, p.name_en
      ORDER BY revenue DESC NULLS LAST
      LIMIT 5
    `;
    const topRes = await pool.query(topQuery, [auth.tenantPgId, cfg.buckets]);

    return NextResponse.json({
      period,
      series: seriesRes.rows,
      current_revenue: currentRes.rows[0]?.revenue ?? 0,
      previous_revenue: previousRes.rows[0]?.revenue ?? 0,
      top_products: topRes.rows,
    });
  } catch (err) {
    console.error("[/api/admin/reports] error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
