"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { OrderSummary } from "./OrderSummary";

type Product = {
  id: string;
  name_vi: string;
  name_en: string;
  price: number;
  image_url: string | null;
};

type LineItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

type Cart = Record<string, number>;

type Props = {
  tenantId: string;
  tableId: string | null;
};

const CART_STORAGE_PREFIX = "zmenu_cart";

function formatVnd(n: number | string): string {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

function menuHref(locale: string, tenantId: string, tableId: string | null) {
  const qs = new URLSearchParams({ tenant_id: tenantId });
  if (tableId) qs.set("table_id", tableId);
  return `/${locale}/menu?${qs.toString()}`;
}

export function CheckoutView({ tenantId, tableId }: Props) {
  const t = useTranslations("Checkout");
  const locale = useLocale();

  const [cart, setCart] = useState<Cart>({});
  const [cartReady, setCartReady] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    setLoadingProducts(true);
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
      .catch(() => {
        // fallback handled by empty product state
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tenantId]);

  const lineItems = useMemo<LineItem[]>(() => {
    const out: LineItem[] = [];
    for (const [id, quantity] of Object.entries(cart)) {
      const p = products.find((x) => x.id === id);
      if (!p) continue;
      out.push({
        id,
        name: locale === "en" ? p.name_en || p.name_vi : p.name_vi || p.name_en,
        price: Number(p.price),
        image_url: p.image_url,
        quantity,
      });
    }
    return out;
  }, [cart, products, locale]);

  const total = lineItems.reduce((s, it) => s + it.price * it.quantity, 0);

  function changeQty(id: string, delta: number) {
    setCart((c) => {
      const next: Cart = { ...c };
      const cur = next[id] ?? 0;
      const after = cur + delta;
      if (after <= 0) {
        delete next[id];
      } else {
        next[id] = after;
      }
      return next;
    });
  }

  async function handleSubmit() {
    if (lineItems.length === 0 || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenantId,
          table_id: tableId,
          customer_note: note.trim() || null,
          items: lineItems.map((it) => ({
            product_id: it.id,
            quantity: it.quantity,
          })),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { order_id: string };
      window.localStorage.removeItem(`${CART_STORAGE_PREFIX}:${tenantId}`);
      window.location.assign(
        `/${locale}/order-status?order_id=${encodeURIComponent(data.order_id)}`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  }

  const isCartEmpty = cartReady && !loadingProducts && lineItems.length === 0;

  if (isCartEmpty) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ice p-8">
        <div className="max-w-xs text-center">
          <p className="mb-4 text-ink2">{t("empty")}</p>
          <a
            href={menuHref(locale, tenantId, tableId)}
            className="inline-block rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white"
          >
            {t("backToMenu")}
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ice pb-32">
      <header className="sticky top-0 z-20 border-b border-line bg-white">
        <div className="mx-auto flex max-w-[430px] items-center gap-3 px-4 py-3">
          <a
            href={menuHref(locale, tenantId, tableId)}
            aria-label={t("backToMenu")}
            className="text-2xl leading-none text-navy"
          >
            ←
          </a>
          <h1 className="flex-1 font-heading text-base font-semibold text-ink">
            {t("title")}
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-[430px] space-y-4 px-4 py-4">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink3">
            {t("tableLabel")}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            {tableId ? t("table", { table: tableId }) : t("tableNone")}
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-line bg-white p-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-ink3">
            {t("items")}
          </h2>
          {loadingProducts && lineItems.length === 0 ? (
            <p className="py-4 text-center text-sm text-ink3">
              {t("loading")}
            </p>
          ) : (
            lineItems.map((it) => (
              <div key={it.id} className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ice">
                  {it.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.image_url}
                      alt={it.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-ink3">
                      —
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-ink">
                    {it.name}
                  </p>
                  <p className="text-sm font-semibold text-orange">
                    {formatVnd(it.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => changeQty(it.id, -1)}
                    aria-label="Decrease"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-navy text-base leading-none text-navy active:scale-95"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold tabular-nums">
                    {it.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeQty(it.id, 1)}
                    aria-label="Increase"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-base leading-none text-white active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-4">
          <label
            htmlFor="customer-note"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-ink3"
          >
            {t("noteLabel")}
          </label>
          <textarea
            id="customer-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder={t("notePlaceholder")}
            className="w-full rounded-xl border border-line bg-ice px-3 py-2 text-sm placeholder:text-ink3 focus:border-navy focus:outline-none"
          />
        </div>

        <OrderSummary
          items={lineItems.map((it) => ({
            name: it.name,
            quantity: it.quantity,
            price: it.price,
          }))}
          total={total}
          subtotalLabel={t("subtotal")}
          totalLabel={t("total")}
        />

        <p className="text-center text-xs text-ink2">{t("codNote")}</p>

        {error && (
          <p className="text-center text-sm text-orange">{t("error")}</p>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-[430px] px-4 pb-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || lineItems.length === 0}
            className="w-full rounded-2xl bg-orange py-3 text-base font-semibold text-white shadow-lg transition active:scale-[0.99] disabled:opacity-50"
          >
            {submitting
              ? t("submitting")
              : `${t("submit")} · ${formatVnd(total)} →`}
          </button>
        </div>
      </div>
    </main>
  );
}
