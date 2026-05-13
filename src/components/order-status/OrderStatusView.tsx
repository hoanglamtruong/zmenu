"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  useOrderStream,
  type OrderStreamPayload,
} from "@/hooks/useOrderStream";

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

const STATUS_FLOW: Array<{ keys: string[]; labelKey: string }> = [
  { keys: ["pending", "confirmed"], labelKey: "step1" },
  { keys: ["preparing"], labelKey: "step2" },
  { keys: ["ready"], labelKey: "step3" },
  { keys: ["completed"], labelKey: "step4" },
];

function statusIndex(status: string): number {
  const idx = STATUS_FLOW.findIndex((s) => s.keys.includes(status));
  return idx === -1 ? 0 : idx;
}

function formatVnd(n: number | string): string {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

function menuHref(
  locale: string,
  tenantSlug: string,
  tableId: string | null
) {
  const qs = new URLSearchParams({ tenant_id: tenantSlug });
  if (tableId) qs.set("table_id", tableId);
  return `/${locale}/menu?${qs.toString()}`;
}

type Props = { orderId: string };

export function OrderStatusView({ orderId }: Props) {
  const t = useTranslations("OrderStatus");
  const locale = useLocale();

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
      <main className="flex min-h-screen items-center justify-center bg-ice p-8">
        <p className="text-sm text-ink2">{t("missing")}</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ice p-8">
        <p className="text-sm text-ink2">{t("loading")}</p>
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ice p-8">
        <div className="max-w-xs text-center">
          <p className="mb-4 text-sm text-ink2">{t("notFound")}</p>
          <a
            href={`/${locale}/menu`}
            className="inline-block rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white"
          >
            {t("orderMore")}
          </a>
        </div>
      </main>
    );
  }

  const currentIdx = statusIndex(order.status);
  const total = items.reduce(
    (s, it) => s + Number(it.price) * it.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-ice pb-12">
      <header className="bg-navy text-white">
        <div className="mx-auto max-w-[430px] px-4 py-5">
          <p className="text-[11px] uppercase tracking-wide opacity-70">
            {t("orderNo")}
          </p>
          <h1 className="font-heading text-lg font-semibold">
            #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-xs opacity-80">
            {order.table_id
              ? t("table", { table: order.table_id })
              : t("tableNone")}
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[430px] px-4 py-6">
        <ol className="space-y-0">
          {STATUS_FLOW.map((step, idx) => {
            const done = idx <= currentIdx;
            const isActive = idx === currentIdx;
            const connectorActive = idx < currentIdx;
            return (
              <li key={step.labelKey} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold " +
                      (done ? "bg-teal text-white" : "bg-line text-ink3")
                    }
                  >
                    {done ? "✓" : idx + 1}
                  </div>
                  {idx < STATUS_FLOW.length - 1 && (
                    <div
                      className={
                        "my-1 h-6 w-0.5 " +
                        (connectorActive ? "bg-teal" : "bg-line")
                      }
                    />
                  )}
                </div>
                <div className="pb-3 pt-1.5">
                  <p
                    className={
                      "text-sm " +
                      (isActive
                        ? "font-semibold text-navy"
                        : done
                          ? "text-ink"
                          : "text-ink3")
                    }
                  >
                    {t(step.labelKey)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mx-auto max-w-[430px] space-y-4 px-4">
        <div className="space-y-3 rounded-2xl border border-line bg-white p-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-ink3">
            {t("items")}
          </h2>
          {items.map((it, i) => {
            const name =
              (locale === "en" ? it.name_en : it.name_vi) ??
              it.name_vi ??
              it.name_en ??
              `#${it.product_id}`;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ice">
                  {it.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.image_url}
                      alt={name}
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
                    {name}
                  </p>
                  <p className="text-xs text-ink2">× {it.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-orange">
                  {formatVnd(Number(it.price) * it.quantity)}
                </p>
              </div>
            );
          })}
          <div className="mt-3 flex justify-between border-t border-line pt-3">
            <span className="text-sm text-ink2">{t("total")}</span>
            <span className="text-base font-bold text-orange">
              {formatVnd(total)}
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-ink2">{t("codNote")}</p>

        <a
          href={menuHref(locale, order.tenant_slug, order.table_id)}
          className="block w-full rounded-2xl bg-navy py-3 text-center text-base font-semibold text-white"
        >
          {t("orderMore")}
        </a>
      </section>
    </main>
  );
}
