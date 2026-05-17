"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  IcArrow,
  IcBack,
  IcCard,
  IcCheck,
  IcPin,
  IcPlus,
  ItemPh,
} from "@/components/mockup/icons";

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
  hue: number;
  ph: string;
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
        // fall through
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
    let i = 0;
    for (const [id, quantity] of Object.entries(cart)) {
      const p = products.find((x) => x.id === id);
      if (!p) {
        i += 1;
        continue;
      }
      out.push({
        id,
        name: locale === "en" ? p.name_en || p.name_vi : p.name_vi || p.name_en,
        price: Number(p.price),
        image_url: p.image_url,
        quantity,
        hue: i % 4,
        ph: String.fromCharCode(65 + (i % 26)),
      });
      i += 1;
    }
    return out;
  }, [cart, products, locale]);

  const subtotal = lineItems.reduce(
    (s, it) => s + it.price * it.quantity,
    0
  );
  const serviceFee = 0;
  const promo = 0;
  const total = subtotal + serviceFee - promo;

  function changeQty(id: string, delta: number) {
    setCart((c) => {
      const next: Cart = { ...c };
      const cur = next[id] ?? 0;
      const after = cur + delta;
      if (after <= 0) delete next[id];
      else next[id] = after;
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

  const locationDisplay = tableId ? `[${tableId}]` : "[Mã vị trí]";
  const isCartEmpty = cartReady && !loadingProducts && lineItems.length === 0;

  if (isCartEmpty) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ice p-8 font-body text-ink">
        <div className="max-w-xs text-center">
          <p className="mb-4 text-sm text-ink2">{t("empty")}</p>
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
    <main className="relative min-h-screen bg-ice pb-40 font-body text-ink">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-ice px-3.5 pb-3 pt-1.5">
        <a
          href={menuHref(locale, tenantId, tableId)}
          aria-label={t("backToMenu")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white"
        >
          <IcBack />
        </a>
        <div className="font-heading text-[16px] font-bold text-ink">
          {t("title")}
        </div>
        <div className="h-9 w-9" />
      </div>

      <section className="px-4">
        {/* Items list card */}
        <div className="rounded-2xl bg-white p-1 shadow-[0_1px_2px_rgba(1,64,109,0.04),0_4px_16px_rgba(1,64,109,0.05)]">
          {lineItems.map((it, i) => (
            <div
              key={it.id}
              className={
                "flex items-center gap-3 p-3 " +
                (i ? "border-t border-line" : "")
              }
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                {it.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.image_url}
                    alt={it.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ItemPh label={it.ph} height={56} hue={it.hue} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold text-ink">
                  {it.name}
                </div>
                <div className="mt-0.5 text-[11.5px] text-ink2">
                  {t("standardOption")}
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-full border border-line bg-ice px-1.5 py-1">
                <button
                  type="button"
                  onClick={() => changeQty(it.id, -1)}
                  aria-label="Decrease"
                  className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-line bg-white text-sm font-bold text-ink2 active:scale-95"
                >
                  −
                </button>
                <div className="min-w-[12px] text-center text-[13px] font-bold">
                  {it.quantity}
                </div>
                <button
                  type="button"
                  onClick={() => changeQty(it.id, 1)}
                  aria-label="Increase"
                  className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-navy active:scale-95"
                >
                  <IcPlus size={12} />
                </button>
              </div>
              <div className="min-w-[60px] text-right font-heading text-[13.5px] font-bold text-ink">
                {formatVnd(it.price * it.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Location code */}
        <div className="mt-4">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="text-[12.5px] font-semibold text-ink2">
              {t("locationCode")}
            </div>
            <div className="text-[10px] italic text-ink3">
              {t("locationHint")}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-line bg-white px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E0F6F7]">
                <IcPin size={14} />
              </div>
              <div className="font-heading text-[16px] font-bold text-navy">
                {locationDisplay}
              </div>
            </div>
            <div className="rounded-full bg-[#E0F6F7] px-2 py-1 text-[10.5px] font-semibold text-teal">
              {t("locationAuto")}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-3.5">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="text-[12.5px] font-semibold text-ink2">
              {t("noteLabel")}
            </div>
            <div className="text-[11px] text-ink3">{t("noteOptional")}</div>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder={t("notePlaceholder")}
            className="min-h-[64px] w-full rounded-xl border border-line bg-white px-3.5 py-3 text-[13px] text-ink placeholder:text-ink3 focus:outline-none"
          />
        </div>

        {/* Payment: COD */}
        <div className="mt-3.5">
          <div className="mb-2 text-[12.5px] font-semibold text-ink2">
            {t("payment")}
          </div>
          <div className="flex items-center gap-3 rounded-xl border-[1.5px] border-teal bg-white p-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#E0F6F7]">
              <IcCard size={20} />
            </div>
            <div className="flex-1">
              <div className="font-heading text-[14px] font-bold text-ink">
                {t("codTitle")}
              </div>
              <div className="mt-0.5 text-[11.5px] text-ink2">
                {t("codSub")}
              </div>
            </div>
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-teal">
              <IcCheck size={13} />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-2xl border border-line bg-white px-4 py-3.5">
          <SummaryRow
            label={t("subtotalLabel", { count: lineItems.length })}
            value={formatVnd(subtotal)}
          />
          <SummaryRow label={t("serviceFee")} value={formatVnd(serviceFee)} />
          {promo > 0 && (
            <SummaryRow
              label={t("promo")}
              value={`−${formatVnd(promo)}`}
              tone="teal"
            />
          )}
          <div className="my-2.5 h-px bg-line" />
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] text-ink2">{t("total")}</span>
            <span className="font-heading text-[22px] font-bold text-orange">
              {formatVnd(total)}
            </span>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-center text-sm text-orange">{t("error")}</p>
        )}
      </section>

      {/* Fixed CTA */}
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-white px-4 pb-[30px] pt-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || lineItems.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-navy py-[15px] font-heading text-[15.5px] font-bold text-white shadow-[0_10px_24px_rgba(1,64,109,0.28)] disabled:opacity-50"
        >
          {submitting
            ? t("submitting")
            : `${t("orderNow")} · ${formatVnd(total)}`}
          {!submitting && <IcArrow size={15} />}
        </button>
      </div>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "teal";
}) {
  const color = tone === "teal" ? "text-teal" : "text-ink2";
  return (
    <div className={`flex justify-between py-1 text-[13px] ${color}`}>
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
