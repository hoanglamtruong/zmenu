import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OrderItemInput = {
  product_id: string;
  quantity: number;
};

type OrderBody = {
  tenant_id?: string;
  table_id?: string | null;
  customer_note?: string | null;
  items?: OrderItemInput[];
};

export async function POST(request: NextRequest) {
  let body: OrderBody;
  try {
    body = (await request.json()) as OrderBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const tenantSlug = body.tenant_id?.trim();
  const tableId = body.table_id ?? null;
  const customerNote = body.customer_note?.trim() || null;
  const items = Array.isArray(body.items) ? body.items : [];

  if (!tenantSlug) {
    return NextResponse.json(
      { error: "tenant_id is required" },
      { status: 400 }
    );
  }
  if (items.length === 0) {
    return NextResponse.json(
      { error: "items must not be empty" },
      { status: 400 }
    );
  }
  for (const it of items) {
    if (!it.product_id || !Number.isInteger(it.quantity) || it.quantity <= 0) {
      return NextResponse.json(
        { error: "Each item needs product_id and positive integer quantity" },
        { status: 400 }
      );
    }
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const tenantRes = await client.query<{ id: string }>(
      "SELECT id FROM tenants WHERE slug = $1",
      [tenantSlug]
    );
    if (tenantRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }
    const tenantPgId = tenantRes.rows[0].id;

    const orderRes = await client.query<{ id: string }>(
      `INSERT INTO orders
         (tenant_id, table_id, customer_note, status, channel, created_at)
       VALUES ($1, $2, $3, 'pending', 'qr', NOW())
       RETURNING id`,
      [tenantPgId, tableId, customerNote]
    );
    const orderId = orderRes.rows[0].id;

    for (const it of items) {
      const insertItem = await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         SELECT $1, $2, $3, p.price
         FROM products p
         WHERE p.id = $2 AND p.tenant_id = $4`,
        [orderId, it.product_id, it.quantity, tenantPgId]
      );
      if (insertItem.rowCount === 0) {
        throw new Error(
          `Product ${it.product_id} not found in tenant ${tenantSlug}`
        );
      }
    }

    await client.query("COMMIT");
    return NextResponse.json({ order_id: orderId }, { status: 201 });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // ignore
    }
    console.error("[/api/orders] failed:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
