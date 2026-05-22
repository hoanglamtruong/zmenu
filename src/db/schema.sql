-- ===========================================================
-- Zmenu — Postgres schema v1.1
-- Target DB: zmenu_db (PostgreSQL 14+)
-- Idempotent: safe to re-run.
-- Apply with: psql "$DATABASE_URL" -f src/db/schema.sql
-- ===========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------
-- 1. tenants
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- 2. users (staff, admin, optional customer)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  full_name       TEXT,
  role            TEXT NOT NULL DEFAULT 'staff'
                    CHECK (role IN ('customer','staff','admin')),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE SET NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- 3. categories
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name_vi         TEXT NOT NULL,
  name_en         TEXT,
  display_order   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- 4. products
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  name_vi         TEXT NOT NULL,
  name_en         TEXT,
  price           NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  image_url       TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','active','inactive')),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_flash_deal   BOOLEAN NOT NULL DEFAULT FALSE,
  flash_name      TEXT,
  flash_qty       INT,
  flash_ends_at   TIMESTAMPTZ,
  display_order   INT NOT NULL DEFAULT 0,
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- 5. tables (QR-bound seats)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS tables (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  table_number    TEXT NOT NULL,
  qr_code         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, table_number)
);

-- -----------------------------------------------------------
-- 6. orders
--    table_id is TEXT (matches end-user URL param) so that QR
--    flows without a pre-seeded `tables` row still work.
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  table_id        TEXT,
  customer_note   TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN (
                      'pending','confirmed','preparing',
                      'ready','completed','cancelled'
                    )),
  channel         TEXT NOT NULL DEFAULT 'qr',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- 7. order_items (price snapshotted at insert time)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id              BIGSERIAL PRIMARY KEY,
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity        INT NOT NULL CHECK (quantity > 0),
  price           NUMERIC(12,2) NOT NULL CHECK (price >= 0)
);

-- -----------------------------------------------------------
-- 8. tenant_settings (white-label config; 1:1 with tenants)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenant_settings (
  tenant_id         UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  display_name      TEXT,
  tagline_vi        TEXT,
  tagline_en        TEXT,
  logo_url          TEXT,
  primary_color     TEXT,
  secondary_color   TEXT,
  opening_hours     TEXT,
  phone             TEXT,
  address           TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================================
-- Indexes
-- ===========================================================
CREATE INDEX IF NOT EXISTS idx_users_tenant
  ON users(tenant_id);

CREATE INDEX IF NOT EXISTS idx_categories_tenant_order
  ON categories(tenant_id, display_order);

CREATE INDEX IF NOT EXISTS idx_products_tenant_status
  ON products(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_products_tenant_order
  ON products(tenant_id, display_order);

CREATE INDEX IF NOT EXISTS idx_products_category
  ON products(category_id);

CREATE INDEX IF NOT EXISTS idx_tables_tenant
  ON tables(tenant_id);

CREATE INDEX IF NOT EXISTS idx_orders_tenant_status
  ON orders(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_orders_tenant_created
  ON orders(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order
  ON order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_order_items_product
  ON order_items(product_id);

-- ===========================================================
-- LISTEN/NOTIFY for SSE order stream
--   Channel: order_change
--   Payload: { order_id, tenant_id, status, table_id, action }
-- ===========================================================
CREATE OR REPLACE FUNCTION notify_order_change() RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'order_change',
    json_build_object(
      'order_id',  NEW.id,
      'tenant_id', NEW.tenant_id,
      'status',    NEW.status,
      'table_id',  NEW.table_id,
      'action',    TG_OP
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_notify ON orders;
CREATE TRIGGER trg_orders_notify
AFTER INSERT OR UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_order_change();

-- ===========================================================
-- updated_at auto-touch (shared trigger function)
-- ===========================================================
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_touch ON products;
CREATE TRIGGER trg_products_touch
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_orders_touch ON orders;
CREATE TRIGGER trg_orders_touch
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_tenant_settings_touch ON tenant_settings;
CREATE TRIGGER trg_tenant_settings_touch
BEFORE UPDATE ON tenant_settings
FOR EACH ROW
EXECUTE FUNCTION touch_updated_at();

-- ===========================================================
-- Seed: demo tenant
-- ===========================================================
INSERT INTO tenants (slug, name)
VALUES ('demo-fnb', 'Demo F&B')
ON CONFLICT (slug) DO NOTHING;
