"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  useOrderStream,
  type OrderStreamPayload,
} from "@/hooks/useOrderStream";
import {
  IcBack,
  IcMsg,
  IcPlus,
  NAVY,
  TEAL,
} from "@/components/mockup/icons";

type OrderDetail = {
  id: string;
  table_id: string | null;
  customer_note: string | null;
  status: string;
  channel: string;
  created_at: string;
  tenant_slug: string;
};

type OrderItem = {
  product_id: string;
  quantity: number;
  price: number;
  name_vi: string | null;
  name_en: string | null;
  image_url: string | null;
};

type Props = { orderId: string };

const STEP_MAP: Record<string, { idx: number; ratio: number }> = {
  pending: { idx: 0, ratio: 0 },
  confirmed: { idx: 0, ratio: 0 },
  preparing: { idx: 1, ratio: 0.5 },
  ready: { idx: 1, ratio: 0.5 },
  completed: { idx: 2, ratio: 1 },
};

function formatVnd(n: number | string) {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

function menuHref(locale: string, tenantSlug: string, tableId: string | null) {
  const qs = new URLSearchParams({ tenant_id: tenantSlug });
  if (tableId) qs.set("table_id", tableId);
  return `/${locale}/menu?${qs.toString()}`;
}

export function OrderStatusView({ orderId }: Props) {
  const t = useTranslations("OrderStatus");
  const intlLocale = useLocale();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    fetch(`/api/orders/${encodeURIComponent(orderId)}`)
      .then(async (r) => {
        if (r.status === 404) {
          if (!cancelled) setNotFound(true);
          return null;
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ order: OrderDetail; items: OrderItem[] }>;
      })
      .then((data) => {
        if (cancelled || !data) return;
        setOrder(data.order);
        setItems(data.items);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handleStreamUpdate = useCallback((payload: OrderStreamPayload) => {
    if (typeof payload.status === "string") {
      const nextStatus = payload.status;
      setOrder((o) => (o ? { ...o, status: nextStatus } : o));
    }
  }, []);

  useOrderStream(order?.tenant_slug ?? "", orderId, handleStreamUpdate);

  if (!orderId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ice p-8 font-body">
        <p className="text-sm text-ink2">{t("missing")}</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ice p-8 font-body">
        <p className="text-sm text-ink2">{t("loading")}</p>
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ice p-8 font-body">
        <div className="max-w-xs text-center">
          <p className="mb-4 text-sm text-ink2">{t("notFound")}</p>
          <a
            href={`/${intlLocale}/menu`}
            className="inline-block rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white"
          >
            {t("orderMore")}
          </a>
        </div>
      </main>
    );
  }

  const step = STEP_MAP[order.status] ?? STEP_MAP.pending;
  const total = items.reduce((s, it) => s + Number(it.price) * it.quantity, 0);
  const orderShort = order.id.slice(0, 4).toUpperCase();
  const tenantDisplay = order.tenant_slug
    ? `[${order.tenant_slug}]`
    : "[Tên Cửa Hàng]";
  const locDisplay = order.table_id ? `[${order.table_id}]` : "[Mã vị trí]";

  const steps = [
    {
      key: "step1",
      label: t("step1"),
      sub: new Intl.DateTimeFormat(intlLocale === "en" ? "en-US" : "vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(order.created_at)),
      done: step.idx >= 0,
      current: step.idx === 0,
    },
    {
      key: "step2",
      label: t("step2"),
      sub: t("step2Sub"),
      done: step.idx >= 1,
      current: step.idx === 1,
    },
    {
      key: "step3",
      label: t("step3"),
      sub: t("step3Sub"),
      done: step.idx >= 2,
      current: step.idx === 2,
    },
  ];

  const stepPillLabel =
    step.idx === 2 ? t("statePillDone") : step.idx === 1 ? t("statePillCooking") : t("statePillReceived");
  const heroTitle =
    step.idx === 2 ? t("heroDone") : step.idx === 1 ? t("heroCooking") : t("heroReceived");

  return (
    <main className="relative min-h-screen bg-ice pb-12 font-body text-ink">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3.5 pb-3 pt-1.5">
        <a
          href={menuHref(intlLocale, order.tenant_slug, order.table_id)}
          aria-label={t("orderMore")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white"
        >
          <IcBack />
        </a>
        <div className="text-center">
          <div className="font-heading text-[15px] font-bold">
            {t("orderHash", { n: orderShort })}
          </div>
          <div className="mt-0.5 text-[10.5px] text-ink2">
            {tenantDisplay} · {locDisplay}
          </div>
        </div>
        <div className="h-9 w-9" />
      </div>

      <section className="px-4">
        {/* Navy hero with progress */}
        <div className="relative overflow-hidden rounded-[18px] bg-navy px-[18px] py-5 text-white">
          <div
            className="absolute rounded-full"
            style={{
              top: -40,
              right: -40,
              width: 140,
              height: 140,
              background: "rgba(1,180,186,0.15)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: -30,
              right: 30,
              width: 80,
              height: 80,
              background: "rgba(255,122,15,0.10)",
            }}
          />
          <div className="relative">
            <div
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-bold uppercase"
              style={{
                background: "rgba(1,180,186,0.25)",
                borderColor: "rgba(1,180,186,0.5)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: TEAL,
                  boxShadow: "0 0 0 4px rgba(1,180,186,0.35)",
                }}
              />
              {stepPillLabel}
            </div>
            <div className="mt-3 font-heading text-[22px] font-bold leading-tight">
              {heroTitle}
            </div>
            <div className="mt-1 text-[12.5px] text-white/75">
              {t("etaPrefix")}{" "}
              <strong className="text-white">{t("etaValue")}</strong>
            </div>

            <div className="mt-[22px]">
              <div
                className="relative rounded-full"
                style={{ height: 4, background: "rgba(255,255,255,0.15)" }}
              >
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${step.ratio * 100}%`,
                    background: TEAL,
                    boxShadow: "0 0 12px rgba(1,180,186,0.6)",
                  }}
                />
                {[0, 50, 100].map((p, i) => {
                  const done = i < step.idx;
                  const cur = i === step.idx;
                  return (
                    <div
                      key={i}
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        left: `${p}%`,
                        top: "50%",
                        width: cur ? 16 : 12,
                        height: cur ? 16 : 12,
                        background: done || cur ? TEAL : "rgba(255,255,255,0.25)",
                        border: cur ? "3px solid #fff" : "none",
                        boxShadow: cur ? "0 0 0 4px rgba(1,180,186,0.3)" : "none",
                      }}
                    />
                  );
                })}
              </div>
              <div className="mt-3.5 grid grid-cols-3 gap-1">
                {steps.map((s, i) => (
                  <div
                    key={s.key}
                    className={
                      i === 0
                        ? "text-left"
                        : i === 1
                          ? "text-center"
                          : "text-right"
                    }
                  >
                    <div
                      className="font-heading text-[11px] font-bold"
                      style={{
                        color: s.current
                          ? TEAL
                          : s.done
                            ? "#fff"
                            : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {s.label}
                    </div>
                    <div className="mt-0.5 text-[9.5px] text-white/60">
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Items list */}
        <div className="mt-4 flex items-baseline justify-between">
          <div className="font-heading text-[14px] font-bold">
            {t("itemsTitle")}
          </div>
          <div className="text-[11px] text-ink3">
            {t("itemsCount", { count: items.length })} · {formatVnd(total)}
          </div>
        </div>
        <div className="mt-2 rounded-[14px] border border-line bg-white px-3.5 py-1">
          {items.map((it, i) => {
            const name =
              (intlLocale === "en" ? it.name_en : it.name_vi) ??
              it.name_vi ??
              it.name_en ??
              "—";
            return (
              <div
                key={i}
                className={
                  "flex items-baseline justify-between py-[11px] text-[13px] " +
                  (i ? "border-t border-line" : "")
                }
              >
                <span>
                  <span
                    className="mr-2 font-bold text-navy"
                    style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}
                  >
                    ×{it.quantity}
                  </span>
                  {name}
                </span>
                <span className="font-semibold text-ink2">
                  {formatVnd(Number(it.price) * it.quantity)}
                </span>
              </div>
            );
          })}
        </div>

        {/* COD card */}
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-[#E0F6F7] px-3.5 py-3">
          <div className="flex-1">
            <div className="text-[11px] font-semibold text-navy">
              {t("codLabel")}
            </div>
            <div className="mt-0.5 font-heading text-[16px] font-bold text-navy">
              {formatVnd(total)} · COD
            </div>
          </div>
          <div className="rounded-full bg-white px-2.5 py-[5px] text-[10.5px] font-bold text-teal">
            {t("atPickup")}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          <a
            href={menuHref(intlLocale, order.tenant_slug, order.table_id)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-navy bg-white px-3 py-3 font-heading text-[13px] font-bold text-navy"
          >
            <IcPlus size={13} color={NAVY} />
            {t("orderMore")}
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-teal bg-white px-3 py-3 font-heading text-[13px] font-bold text-teal"
          >
            <IcMsg size={13} />
            {t("contactStaff")}
          </button>
        </div>
      </section>
    </main>
  );
}
