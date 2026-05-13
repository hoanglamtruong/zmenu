"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CategoryChip } from "./CategoryChip";
import { ProductCard } from "./ProductCard";
import { StickyCartBar } from "./StickyCartBar";

type Product = {
  id: string;
  name_vi: string;
  name_en: string;
  price: number;
  image_url: string | null;
  category_id: string | null;
  category_name_vi: string | null;
  category_name_en: string | null;
  is_flash_deal: boolean;
  flash_name: string | null;
  flash_ends_at: string | null;
};

type Cart = Record<string, number>;

type Props = {
  tenantId: string;
  tableId: string | null;
};

const CART_STORAGE_PREFIX = "zmenu_cart";
const ALL_CATEGORY = "__all__";

export function MenuView({ tenantId, tableId }: Props) {
  const t = useTranslations("Menu");
  const locale = useLocale();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);
  const [cart, setCart] = useState<Cart>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(
      `/api/products?tenant_id=${encodeURIComponent(tenantId)}&status=active`
    )
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Product[]>;
      })
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tenantId]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(
        `${CART_STORAGE_PREFIX}:${tenantId}`
      );
      if (raw) setCart(JSON.parse(raw) as Cart);
    } catch {
      // ignore
    }
  }, [tenantId]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        `${CART_STORAGE_PREFIX}:${tenantId}`,
        JSON.stringify(cart)
      );
    } catch {
      // ignore
    }
  }, [cart, tenantId]);

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; label: string }>();
    for (const p of products) {
      if (!p.category_id) continue;
      const label =
        (locale === "en" ? p.category_name_en : p.category_name_vi) ??
        p.category_name_vi ??
        p.category_name_en ??
        "—";
      if (!map.has(p.category_id)) {
        map.set(p.category_id, { id: p.category_id, label });
      }
    }
    return Array.from(map.values());
  }, [products, locale]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCategory !== ALL_CATEGORY && p.category_id !== activeCategory)
        return false;
      if (!q) return true;
      return (
        p.name_vi.toLowerCase().includes(q) ||
        p.name_en.toLowerCase().includes(q)
      );
    });
  }, [products, search, activeCategory]);

  const { itemCount, total } = useMemo(() => {
    let count = 0;
    let sum = 0;
    for (const [id, qty] of Object.entries(cart)) {
      count += qty;
      const p = products.find((x) => x.id === id);
      if (p) sum += Number(p.price) * qty;
    }
    return { itemCount: count, total: sum };
  }, [cart, products]);

  function addToCart(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }

  function handleCheckout() {
    const qs = new URLSearchParams({ tenant_id: tenantId });
    if (tableId) qs.set("table_id", tableId);
    window.location.assign(`/${locale}/checkout?${qs.toString()}`);
  }

  return (
    <main className="min-h-screen bg-ice pb-28">
      <header className="sticky top-0 z-20 border-b border-line bg-white">
        <div className="mx-auto flex max-w-[430px] items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy font-heading font-bold text-white">
            {tenantId.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-semibold text-ink">
              {tenantId}
            </p>
            <p className="text-[11px] text-ink2">
              {tableId ? t("table", { table: tableId }) : t("tableNone")}
            </p>
          </div>
          <span className="rounded-full bg-teal/10 px-2 py-1 text-[10px] font-semibold uppercase text-teal">
            ● {t("open")}
          </span>
        </div>

        <div className="mx-auto max-w-[430px] px-4 pb-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-xl border border-line bg-ice px-4 py-2.5 text-sm placeholder:text-ink3 focus:border-navy focus:outline-none"
          />
        </div>

        <div className="mx-auto max-w-[430px] overflow-x-auto px-4 pb-3">
          <div className="flex w-max gap-2">
            <CategoryChip
              name={t("all")}
              isSelected={activeCategory === ALL_CATEGORY}
              onClick={() => setActiveCategory(ALL_CATEGORY)}
            />
            {categories.map((c) => (
              <CategoryChip
                key={c.id}
                name={c.label}
                isSelected={activeCategory === c.id}
                onClick={() => setActiveCategory(c.id)}
              />
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[430px] px-4 py-4">
        {loading && (
          <p className="py-12 text-center text-sm text-ink3">{t("loading")}</p>
        )}
        {error && (
          <p className="py-12 text-center text-sm text-orange">{t("error")}</p>
        )}
        {!loading && !error && visible.length === 0 && (
          <p className="py-12 text-center text-sm text-ink3">{t("empty")}</p>
        )}
        {!loading && !error && visible.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {visible.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name_vi={p.name_vi}
                name_en={p.name_en}
                price={p.price}
                image_url={p.image_url}
                is_flash_deal={p.is_flash_deal}
                flash_name={p.flash_name}
                flash_ends_at={p.flash_ends_at}
                locale={locale}
                flashFallbackLabel={t("flashDefault")}
                onAdd={addToCart}
              />
            ))}
          </div>
        )}
      </section>

      <StickyCartBar
        itemCount={itemCount}
        total={total}
        onCheckout={handleCheckout}
        itemsLabel={t("cartItems", { count: itemCount })}
        checkoutLabel={t("checkout")}
      />
    </main>
  );
}
