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

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
         display_name, tagline_vi, tagline_en, logo_url,
         primary_color, secondary_color, opening_hours,
         phone, address
       FROM tenant_settings
       WHERE tenant_id = $1`,
      [auth.tenantPgId]
    );
    return NextResponse.json(rows[0] ?? {});
  } catch (err) {
    console.error("[/api/admin/settings] GET error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

type SettingsBody = {
  display_name?: string | null;
  tagline_vi?: string | null;
  tagline_en?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  opening_hours?: string | null;
  phone?: string | null;
  address?: string | null;
};

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: SettingsBody;
  try {
    body = (await request.json()) as SettingsBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO tenant_settings (
         tenant_id, display_name, tagline_vi, tagline_en, logo_url,
         primary_color, secondary_color, opening_hours, phone, address, updated_at
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
       )
       ON CONFLICT (tenant_id) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         tagline_vi = EXCLUDED.tagline_vi,
         tagline_en = EXCLUDED.tagline_en,
         logo_url = EXCLUDED.logo_url,
         primary_color = EXCLUDED.primary_color,
         secondary_color = EXCLUDED.secondary_color,
         opening_hours = EXCLUDED.opening_hours,
         phone = EXCLUDED.phone,
         address = EXCLUDED.address,
         updated_at = NOW()
       RETURNING display_name, tagline_vi, tagline_en, logo_url,
                 primary_color, secondary_color, opening_hours, phone, address`,
      [
        auth.tenantPgId,
        body.display_name?.toString().trim() || null,
        body.tagline_vi?.toString().trim() || null,
        body.tagline_en?.toString().trim() || null,
        body.logo_url?.toString().trim() || null,
        body.primary_color?.toString().trim() || null,
        body.secondary_color?.toString().trim() || null,
        body.opening_hours?.toString().trim() || null,
        body.phone?.toString().trim() || null,
        body.address?.toString().trim() || null,
      ]
    );
    return NextResponse.json(rows[0] ?? {});
  } catch (err) {
    console.error("[/api/admin/settings] PATCH error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
