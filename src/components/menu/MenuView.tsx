"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  IcPlus,
  IcQr,
  IcSearch,
  IcTag,
  ItemPh,
  ZLogo,
} from "@/components/mockup/icons";
import { StickyCartBar } from "@/components/menu/StickyCartBar";
import {
  ProductDetailSheet,
  type DetailProduct,
} from "@/components/menu/ProductDetailSheet";
import { CheckoutSheet } from "@/components/menu/CheckoutSheet";

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

function formatVnd(n: number | string): string {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

export function MenuView({ tenantId, tableId }: Props) {
  const t = useTranslations("Menu");
  const locale = useLocale();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);
  const [cart, setCart] = useState<Cart>({});
  const [cartReady, setCartReady] = useState(false);
  const [detailFor, setDetailFor] = useState<DetailProduct | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

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
    setCartReady(true);
  }, [tenantId]);

  useEffect(() => {
    if (!cartReady) return;
    try {
      window.localStorage.setItem(
        `${CART_STORAGE_PREFIX}:${tenantId}`,
        JSON.stringify(cart)
      );
    } catch {
      // ignore
    }
  }, [cart, tenantId, cartReady]);

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

  function addToCart(id: string, qty = 1) {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + qty }));
  }

  function openDetail(p: Product, index: number) {
    const name =
      locale === "en" ? p.name_en || p.name_vi : p.name_vi || p.name_en;
    setDetailFor({
      id: p.id,
      name,
      price: Number(p.price),
      image_url: p.image_url,
      is_flash_deal: p.is_flash_deal,
      flash_name: p.flash_name,
      hue: index % 4,
      ph: `PRODUCT · ${String.fromCharCode(65 + (index % 26))}`,
    });
    setDetailOpen(true);
  }

  function onOrderSubmitted(orderId: string) {
    setCart({});
    setCheckoutOpen(false);
    try {
      window.localStorage.removeItem(`${CART_STORAGE_PREFIX}:${tenantId}`);
    } catch {
      // ignore
    }
    window.location.assign(
      `/${locale}/order-status?order_id=${encodeURIComponent(orderId)}`
    );
  }

  // White-label placeholders match the v4 mockup until tenant data is wired.
  const tenantDisplay = tenantId || "[Tên Cửa Hàng]";
  const locationDisplay = tableId ? `[${tableId}]` : "[Mã vị trí]";

  return (
    <main className="relative min-h-screen bg-ice pb-32 font-body text-ink">
      {/* S01 Header (navy curved bottom) */}
      <header className="rounded-b-[22px] bg-navy px-4 pb-3.5 pt-2.5 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex items-center rounded-lg bg-white px-2 py-1.5">
              <ZLogo width={66} />
            </div>
            <div className="min-w-0">
              <div className="truncate font-heading text-[14px] font-bold leading-tight">
                {tenantDisplay}
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F8EE] px-2 py-[2px] text-[10.5px] font-semibold text-[#16A34A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                  {t("open")}
                </span>
                <span className="inline-flex items-center gap-1 text-[10.5px] text-white/70">
                  <IcQr size={11} color="rgba(255,255,255,0.7)" />
                  {locationDisplay}
                </span>
              </div>
            </div>
          </div>
          <div className="flex rounded-full border border-white/20 bg-white/15 p-[3px]">
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-navy">
              VI
            </span>
            <a
              href={`/${locale === "vi" ? "en" : "vi"}/menu?tenant_id=${encodeURIComponent(
                tenantId
              )}${tableId ? `&table_id=${encodeURIComponent(tableId)}` : ""}`}
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white/85"
            >
              {locale === "vi" ? "EN" : "VI"}
            </a>
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5">
          <IcSearch size={16} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="flex-1 bg-transparent text-[13.5px] text-ink placeholder:text-ink3 focus:outline-none"
          />
        </div>
      </header>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1.5 pt-3.5">
        <CategoryChip
          label={t("all")}
          active={activeCategory === ALL_CATEGORY}
          onClick={() => setActiveCategory(ALL_CATEGORY)}
        />
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            label={c.label}
            active={activeCategory === c.id}
            onClick={() => setActiveCategory(c.id)}
          />
        ))}
      </div>

      {/* Section header */}
      <div className="flex items-baseline justify-between px-4 pb-2.5 pt-3.5">
        <h2 className="font-heading text-[17px] font-bold text-ink">
          {t("popular")}
        </h2>
        <span className="text-[12px] font-semibold text-teal">
          {t("seeAll")}
        </span>
      </div>

      {/* Product grid */}
      <section className="px-4 pb-2">
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
            {visible.map((p, i) => {
              const name =
                locale === "en"
                  ? p.name_en || p.name_vi
                  : p.name_vi || p.name_en;
              const flashLabel = p.flash_name?.trim() || t("flashDefault");
              return (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openDetail(p, i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDetail(p, i);
                    }
                  }}
                  className="cursor-pointer rounded-2xl bg-white p-2 text-left shadow-[0_1px_2px_rgba(1,64,109,0.04),0_4px_16px_rgba(1,64,109,0.05)] transition active:scale-[0.98]"
                >
                  <div className="relative">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image_url}
                        alt={name}
                        loading="lazy"
                        className="h-[120px] w-full rounded-xl object-cover"
                      />
                    ) : (
                      <ItemPh
                        label={`PRODUCT · ${String.fromCharCode(
                          65 + (i % 26)
                        )}`}
                        height={120}
                        hue={i}
                      />
                    )}
                    {p.is_flash_deal && (
                      <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-orange px-1.5 py-[3px] text-[10px] font-bold uppercase text-white shadow-[0_2px_6px_rgba(255,122,15,0.4)]">
                        <IcTag size={10} />
                        {flashLabel}
                      </div>
                    )}
                  </div>
                  <div className="px-1 pb-1 pt-2">
                    <div className="line-clamp-2 min-h-[34px] text-[13.5px] font-semibold leading-tight text-ink">
                      {name}
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <div className="font-heading text-[14.5px] font-bold text-orange">
                        {formatVnd(p.price)}
                      </div>
                      <button
                        type="button"
                        aria-label="Add to cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p.id, 1);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-navy shadow-[0_2px_6px_rgba(1,64,109,0.25)] active:scale-95"
                      >
                        <IcPlus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* S03 — Sticky cart bar */}
      <StickyCartBar
        itemCount={itemCount}
        total={total}
        onCheckout={() => setCheckoutOpen(true)}
      />

      {/* S02 — Product detail bottom sheet */}
      <ProductDetailSheet
        product={detailFor}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onAdd={addToCart}
      />

      {/* S04 — Checkout bottom sheet */}
      <CheckoutSheet
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        tenantId={tenantId}
        tableId={tableId}
        products={products}
        cart={cart}
        onChangeCart={setCart}
        onSubmitted={onOrderSubmitted}
      />
    </main>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition " +
        (active
          ? "bg-navy text-white"
          : "border border-line bg-white text-ink")
      }
    >
      {label}
    </button>
  );
}
