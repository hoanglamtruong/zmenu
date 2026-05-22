"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  IcArrow,
  IcCard,
  IcCheck,
  IcClose,
  IcMinus,
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

type Cart = Record<string, number>;

type Props = {
  open: boolean;
  onClose: () => void;
  tenantId: string;
  tableId: string | null;
  products: Product[];
  cart: Cart;
  onChangeCart: (next: Cart) => void;
  onSubmitted: (orderId: string) => void;
};

type StreamState = "idle" | "connecting" | "live" | "error";

function formatVnd(n: number | string): string {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

// S04 — Checkout bottom sheet
// List items · note · COD · summary · SSE realtime indicator · "Đặt ngay" CTA
export function CheckoutSheet({
  open,
  onClose,
  tenantId,
  tableId,
  products,
  cart,
  onChangeCart,
  onSubmitted,
}: Props) {
  const t = useTranslations("Checkout");
  const locale = useLocale();

  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<StreamState>("idle");
  const esRef = useRef<EventSource | null>(null);

  // Open/close side effects
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // SSE connection — live indicator for realtime channel
  useEffect(() => {
    if (!open || !tenantId) {
      esRef.current?.close();
      esRef.current = null;
      setStream("idle");
      return;
    }
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }
    setStream("connecting");
    const es = new EventSource(
      `/api/orders/stream?tenant_id=${encodeURIComponent(tenantId)}`
    );
    esRef.current = es;
    es.onopen = () => setStream("live");
    es.onerror = () => setStream("error");
    return () => {
      es.close();
      esRef.current = null;
    };
  }, [open, tenantId]);

  const lineItems = useMemo(() => {
    const out: Array<{
      id: string;
      name: string;
      price: number;
      image_url: string | null;
      quantity: number;
      hue: number;
      ph: string;
    }> = [];
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

  const subtotal = lineItems.reduce((s, it) => s + it.price * it.quantity, 0);
  const serviceFee = 0;
  const total = subtotal + serviceFee;

  function changeQty(id: string, delta: number) {
    const next: Cart = { ...cart };
    const after = (next[id] ?? 0) + delta;
    if (after <= 0) delete next[id];
    else next[id] = after;
    onChangeCart(next);
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
      onSubmitted(data.order_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  }

  const locationDisplay = tableId ? `[${tableId}]` : "[Mã vị trí]";

  const streamLabel =
    stream === "live"
      ? t("liveLive")
      : stream === "connecting"
      ? t("liveConnecting")
      : stream === "error"
      ? t("liveError")
      : t("liveIdle");
  const streamColor =
    stream === "live"
      ? "#16A34A"
      : stream === "error"
      ? "#C2272D"
      : "#92A1AE";

  return (
    <div
      aria-hidden={!open}
      className={
        "fixed inset-0 z-40 transition-opacity duration-200 " +
        (open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0")
      }
    >
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/45"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={
          "absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-[24px] bg-ice shadow-[0_-12px_40px_rgba(1,64,109,0.18)] transition-transform duration-300 ease-out " +
          (open ? "translate-y-0" : "translate-y-full")
        }
      >
        {/* drag handle */}
        <div className="flex shrink-0 justify-center pb-1.5 pt-2.5">
          <div className="h-1 w-10 rounded-full bg-line" />
        </div>

        {/* sheet header: title + SSE indicator + close */}
        <div className="relative flex shrink-0 items-center justify-between gap-2 px-4 pb-3 pt-1">
          <div
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[10.5px] font-semibold"
            aria-live="polite"
          >
            <span
              className={
                "h-1.5 w-1.5 rounded-full " +
                (stream === "live" ? "animate-pulse" : "")
              }
              style={{ background: streamColor }}
            />
            <span style={{ color: streamColor }}>{streamLabel}</span>
          </div>
          <div className="font-heading text-[16px] font-bold text-ink">
            {t("title")}
          </div>
          <button
            type="button"
            aria-label={t("close")}
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white"
          >
            <IcClose size={16} />
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {/* Items card */}
          <div className="rounded-2xl bg-white p-1 shadow-[0_1px_2px_rgba(1,64,109,0.04),0_4px_16px_rgba(1,64,109,0.05)]">
            {lineItems.length === 0 ? (
              <div className="px-4 py-6 text-center text-[13px] text-ink3">
                {t("empty")}
              </div>
            ) : (
              lineItems.map((it, i) => (
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
                    <div className="truncate text-[13.5px] font-semibold text-ink">
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
                      aria-label={t("decrease")}
                      className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-line bg-white active:scale-95"
                    >
                      <IcMinus size={12} />
                    </button>
                    <div className="min-w-[12px] text-center text-[13px] font-bold">
                      {it.quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => changeQty(it.id, 1)}
                      aria-label={t("increase")}
                      className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-navy active:scale-95"
                    >
                      <IcPlus size={12} />
                    </button>
                  </div>
                  <div className="min-w-[60px] text-right font-heading text-[13.5px] font-bold text-ink">
                    {formatVnd(it.price * it.quantity)}
                  </div>
                </div>
              ))
            )}
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
            <div className="flex justify-between py-1 text-[13px] text-ink2">
              <span>
                {t("subtotalLabel", { count: lineItems.length })}
              </span>
              <span className="font-semibold">{formatVnd(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 text-[13px] text-ink2">
              <span>{t("serviceFee")}</span>
              <span className="font-semibold">{formatVnd(serviceFee)}</span>
            </div>
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

          <div className="h-3" />
        </div>

        {/* CTA */}
        <div className="shrink-0 border-t border-line bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || lineItems.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-navy py-[15px] font-heading text-[15.5px] font-bold text-white shadow-[0_10px_24px_rgba(1,64,109,0.28)] disabled:opacity-50"
          >
            {submitting ? (
              <span>{t("submitting")}</span>
            ) : (
              <>
                <span>{t("submit")}</span>
                <span className="opacity-80">·</span>
                <span>{formatVnd(total)}</span>
                <IcArrow size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
