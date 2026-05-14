"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminBottomNav } from "./AdminBottomNav";

type SeriesPoint = {
  bucket: string;
  revenue: number;
  order_count: number;
};

type RecentOrder = {
  id: string;
  table_id: string | null;
  status: string;
  created_at: string;
  item_count: number;
  total: number;
};

type OverviewData = {
  revenue_today: number;
  orders_today: number;
  pending_count: number;
  series: SeriesPoint[];
  recent_orders: RecentOrder[];
};

const STATUS_KEY: Record<string, string> = {
  pending: "statusPending",
  confirmed: "statusConfirmed",
  preparing: "statusPreparing",
  ready: "statusReady",
  completed: "statusCompleted",
  cancelled: "statusCancelled",
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

function shortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function OverviewView({ locale }: { locale: string }) {
  const t = useTranslations("AdminOverview");
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/overview", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<OverviewData>;
      })
      .then((d) => setData(d))
      .catch(() => {
        // leave data null → renders dashes
      })
      .finally(() => setLoading(false));
  }, []);

  const chartData = useMemo(
    () =>
      (data?.series ?? []).map((s) => ({
        name: shortDate(s.bucket),
        revenue: Number(s.revenue),
      })),
    [data]
  );

  return (
    <main className="min-h-screen bg-ice pb-24">
      <header className="bg-navy">
        <div className="mx-auto max-w-[430px] px-4 py-5">
          <h1 className="font-heading text-lg font-semibold text-white">
            {t("title")}
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-[430px] space-y-4 px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            label={t("revenueToday")}
            value={data ? formatVnd(data.revenue_today) : "—"}
            color="text-orange"
          />
          <StatCard
            label={t("orders")}
            value={data ? String(data.orders_today) : "—"}
            color="text-navy"
          />
          <StatCard
            label={t("pending")}
            value={data ? String(data.pending_count) : "—"}
            color="text-teal"
          />
        </div>

        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[11px] font-semibold uppercase text-ink3">
            {t("last7Days")}
          </p>
          <div className="mt-2 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  fontSize={10}
                  stroke="#92A1AE"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  fontSize={10}
                  stroke="#92A1AE"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
                  }
                />
                <Tooltip formatter={(v) => formatVnd(Number(v))} />
                <Bar dataKey="revenue" fill="#01406D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-line bg-white p-4">
          <p className="text-[11px] font-semibold uppercase text-ink3">
            {t("recentOrders")}
          </p>
          {loading && (
            <p className="py-4 text-center text-sm text-ink3">
              {t("loading")}
            </p>
          )}
          {!loading && (data?.recent_orders ?? []).length === 0 && (
            <p className="py-4 text-center text-sm text-ink3">
              {t("noOrders")}
            </p>
          )}
          {(data?.recent_orders ?? []).map((o) => {
            const labelKey = STATUS_KEY[o.status] ?? "statusPending";
            const color = STATUS_COLOR[o.status] ?? "bg-line text-ink3";
            return (
              <div
                key={o.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">
                    {o.table_id
                      ? t("table", { table: o.table_id })
                      : t("tableNone")}
                  </p>
                  <p className="text-[10px] text-ink2">
                    {t("items", { count: o.item_count })} ·{" "}
                    {formatVnd(o.total)}
                  </p>
                </div>
                <span
                  className={
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " +
                    color
                  }
                >
                  {t(labelKey)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <AdminBottomNav
        active="overview"
        locale={locale}
        labels={{
          overview: t("navOverview"),
          approvals: t("navApprovals"),
          reports: t("navReports"),
          settings: t("navSettings"),
        }}
      />
    </main>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-3">
      <p className="text-[10px] uppercase tracking-wide text-ink3">{label}</p>
      <p className={`mt-1 font-heading text-base font-semibold ${color}`}>
        {value}
      </p>
    </div>
  );
}
