"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminBottomNav } from "./AdminBottomNav";

type Period = "day" | "week" | "month";

type SeriesPoint = {
  bucket: string;
  revenue: number;
  order_count: number;
};

type TopProduct = {
  id: string | null;
  name_vi: string | null;
  name_en: string | null;
  quantity: number;
  revenue: number;
};

type ReportData = {
  period: Period;
  series: SeriesPoint[];
  current_revenue: number;
  previous_revenue: number;
  top_products: TopProduct[];
};

function formatVnd(n: number | string) {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

function bucketLabel(iso: string, period: Period): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  if (period === "day") return `${d.getDate()}/${d.getMonth() + 1}`;
  if (period === "week") {
    return `T${Math.ceil(d.getDate() / 7)}/${d.getMonth() + 1}`;
  }
  return `${d.getMonth() + 1}/${d.getFullYear() % 100}`;
}

export function ReportsView({ locale }: { locale: string }) {
  const t = useTranslations("AdminReports");
  const [period, setPeriod] = useState<Period>("day");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/reports?period=${period}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<ReportData>;
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  const chartData = useMemo(
    () =>
      (data?.series ?? []).map((s) => ({
        name: bucketLabel(s.bucket, period),
        revenue: Number(s.revenue),
      })),
    [data, period]
  );

  const pct = useMemo(() => {
    if (!data) return 0;
    if (data.previous_revenue <= 0) {
      return data.current_revenue > 0 ? 100 : 0;
    }
    return (
      ((data.current_revenue - data.previous_revenue) / data.previous_revenue) *
      100
    );
  }, [data]);
  const trendUp = pct >= 0;

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
        <div className="flex rounded-xl border border-line bg-white p-1">
          {(["day", "week", "month"] as const).map((p) => {
            const labelKey =
              p === "day"
                ? "periodDay"
                : p === "week"
                  ? "periodWeek"
                  : "periodMonth";
            const isActive = period === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={
                  "flex-1 rounded-lg py-2 text-sm font-semibold transition " +
                  (isActive ? "bg-navy text-white" : "text-ink2")
                }
              >
                {t(labelKey)}
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[11px] font-semibold uppercase text-ink3">
            {t("revenue")}
          </p>
          <p className="mt-1 font-heading text-2xl font-semibold text-ink">
            {data ? formatVnd(data.current_revenue) : "—"}
          </p>
          <p
            className={
              "mt-1 text-xs font-semibold " +
              (trendUp ? "text-teal" : "text-orange")
            }
          >
            {trendUp ? "↑" : "↓"} {Math.abs(pct).toFixed(1)}% {t("vsPrevious")}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[11px] font-semibold uppercase text-ink3">
            {t("trend")}
          </p>
          <div className="mt-2 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#E3EEF1"
                  strokeDasharray="3 3"
                  vertical={false}
                />
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
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#01B4BA"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-line bg-white p-4">
          <p className="text-[11px] font-semibold uppercase text-ink3">
            {t("topProducts")}
          </p>
          {loading && (
            <p className="py-4 text-center text-sm text-ink3">
              {t("loading")}
            </p>
          )}
          {!loading && (data?.top_products ?? []).length === 0 && (
            <p className="py-4 text-center text-sm text-ink3">
              {t("emptyTop")}
            </p>
          )}
          {(data?.top_products ?? []).map((p, i) => {
            const name =
              (locale === "en" ? p.name_en : p.name_vi) ??
              p.name_vi ??
              p.name_en ??
              "—";
            return (
              <div
                key={`${p.id ?? "x"}-${i}`}
                className="flex items-center gap-3"
              >
                <span className="w-5 text-center text-sm font-semibold text-navy">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-ink">
                    {name}
                  </p>
                  <p className="text-[10px] text-ink3">
                    {t("qty", { q: p.quantity })}
                  </p>
                </div>
                <p className="text-sm font-semibold text-orange">
                  {formatVnd(p.revenue)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <AdminBottomNav
        active="reports"
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
