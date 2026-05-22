import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenant_id");
  const status = searchParams.get("status") ?? "active";

  if (!tenantId) {
    return NextResponse.json(
      { error: "tenant_id is required" },
      { status: 400 }
    );
  }

  try {
    const { rows } = await pool.query(
      `SELECT
         p.id,
         p.name_vi,
         p.name_en,
         (p.price)::float8 AS price,
         p.image_url,
         p.category_id,
         c.name_vi AS category_name_vi,
         c.name_en AS category_name_en,
         p.is_flash_deal,
         p.flash_name,
         p.flash_ends_at
       FROM products p
       JOIN tenants t ON t.id = p.tenant_id
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE t.slug = $1 AND p.status = $2
       ORDER BY c.display_order NULLS LAST,
                p.display_order NULLS LAST,
                p.id`,
      [tenantId, status]
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[/api/products] db error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
