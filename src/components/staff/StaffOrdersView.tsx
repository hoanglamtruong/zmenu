"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useOrderStream } from "@/hooks/useOrderStream";
import { StaffBottomNav } from "./StaffBottomNav";

type Order = {
  id: string;
  table_id: string | null;
  status: string;
  created_at: string;
  total: number;
  item_count: number;
};

type Props = {
  tenantSlug: string;
  locale: string;
};

const STATUS_FLOW_NEXT: Record<string, { next: string; labelKey: string }> = {
  pending: { next: "confirmed", labelKey: "btnConfirm" },
  confirmed: { next: "preparing", labelKey: "btnPreparing" },
  preparing: { next: "ready", labelKey: "btnReady" },
  ready: { next: "completed", labelKey: "btnCompleted" },
};

const STATUS_LABEL: Record<string, string> = {
  pending: "statusPending",
  confirmed: "statusConfirmed",
  preparing: "statusPreparing",
  ready: "statusReady",
  completed: "statusCompleted",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-orange/15 text-orange",
  confirmed: "bg-teal/15 text-teal",
  preparing: "bg-navy/15 text-navy",
  ready: "bg-emerald-500/15 text-emerald-600",
  completed: "bg-line text-ink3",
  cancelled: "bg-red-500/15 text-red-600",
};

function formatVnd(n: number | string) {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

export function StaffOrdersView({ tenantSlug, locale }: Props) {
  const t = useTranslations("StaffOrders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/staff/orders", { cache: "no-store" });
      if (!r.ok) return;
      const data = (await r.json()) as Order[];
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const onStreamUpdate = useCallback(() => {
    void refresh();
  }, [refresh]);

  useOrderStream(tenantSlug, "", onStreamUpdate);

  async function updateStatus(id: string, nextStatus: string) {
    try {
      await fetch(`/api/orders/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      void refresh();
    } catch {
      // ignore for MVP
    }
  }

  function timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diffMs / 60_000);
    if (min < 1) return t("justNow");
    return t("minutesAgo", { m: min });
  }

  return (
    <main className="min-h-screen bg-ice pb-24">
      <header className="bg-navy">
        <div className="mx-auto max-w-[430px] px-4 py-5">
          <h1 className="font-heading text-lg font-semibold text-white">
            {t("title")}
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-[430px] space-y-3 px-4 py-4">
        {loading && (
          <p className="py-12 text-center text-sm text-ink3">
            {t("loading")}
          </p>
        )}
        {!loading && orders.length === 0 && (
          <p className="py-12 text-center text-sm text-ink3">
            {t("noOrders")}
          </p>
        )}
        {orders.map((o) => {
          const transition = STATUS_FLOW_NEXT[o.status];
          const labelKey = STATUS_LABEL[o.status] ?? "statusPending";
          const color = STATUS_COLOR[o.status] ?? "bg-line text-ink3";
          return (
            <div
              key={o.id}
              className="rounded-2xl border border-line bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-heading font-semibold text-ink">
                    {o.table_id
                      ? t("table", { table: o.table_id })
                      : t("tableNone")}
                  </p>
                  <p className="mt-0.5 text-xs text-ink2">
                    {t("items", { count: o.item_count })} ·{" "}
                    {formatVnd(o.total)}
                  </p>
                  <p className="mt-1 text-[10px] text-ink3">
                    {timeAgo(o.created_at)}
                  </p>
                </div>
                <span
                  className={
                    "rounded-full px-2 py-1 text-[10px] font-semibold uppercase " +
                    color
                  }
                >
                  {t(labelKey)}
                </span>
              </div>
              {transition && (
                <button
                  type="button"
                  onClick={() => updateStatus(o.id, transition.next)}
                  className="mt-3 w-full rounded-xl bg-navy py-2 text-sm font-semibold text-white active:scale-[0.99]"
                >
                  {t(transition.labelKey)}
                </button>
              )}
            </div>
          );
        })}
      </section>

      <StaffBottomNav
        active="orders"
        locale={locale}
        ordersLabel={t("navOrders")}
        productsLabel={t("navProducts")}
      />
    </main>
  );
}
