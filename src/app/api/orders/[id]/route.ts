import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: { id: string };
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const orderId = params.id;
  if (!orderId) {
    return NextResponse.json(
      { error: "order id is required" },
      { status: 400 }
    );
  }

  try {
    const orderRes = await pool.query(
      `SELECT
         o.id,
         o.table_id,
         o.customer_note,
         o.status,
         o.channel,
         o.created_at,
         t.slug AS tenant_slug
       FROM orders o
       JOIN tenants t ON t.id = o.tenant_id
       WHERE o.id = $1`,
      [orderId]
    );
    if (orderRes.rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const itemsRes = await pool.query(
      `SELECT
         oi.product_id,
         oi.quantity,
         (oi.price)::float8 AS price,
         p.name_vi,
         p.name_en,
         p.image_url
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1
       ORDER BY oi.id`,
      [orderId]
    );

    return NextResponse.json({
      order: orderRes.rows[0],
      items: itemsRes.rows,
    });
  } catch (err) {
    console.error("[/api/orders/[id]] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
