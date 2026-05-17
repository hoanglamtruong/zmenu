"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  IcBell,
  IcCheck,
  IcCog,
  IcHome,
  IcCatalog,
  IcChart,
  ItemPh,
  NAVY,
  INK3,
} from "@/components/mockup/icons";

type SeriesPoint = {
  bucket: string;
  revenue: number;
  order_count: number;
};

type PendingProduct = {
  id: string;
  name_vi: string;
  name_en: string | null;
  price: number;
  image_url: string | null;
  created_at: string;
  staff_name: string | null;
  staff_email: string | null;
};

type BestSeller = {
  name_vi: string | null;
  name_en: string | null;
  qty: number;
};

type OverviewData = {
  revenue_today: number;
  orders_today: number;
  pending_count: number;
  best_seller: BestSeller | null;
  series: SeriesPoint[];
  pending_products: PendingProduct[];
};

function formatVnd(n: number | string) {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

function formatMillionShort(n: number): { value: string; unit: string } {
  if (n >= 1_000_000) return { value: (n / 1_000_000).toFixed(2), unit: "M đ" };
  if (n >= 1000) return { value: (n / 1000).toFixed(1), unit: "K đ" };
  return { value: String(Math.round(n)), unit: "đ" };
}

const DAY_LABELS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const DAY_LABELS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function OverviewView({ locale }: { locale: string }) {
  const t = useTranslations("AdminOverview");
  const intlLocale = useLocale();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/overview", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<OverviewData>;
      })
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const series = data?.series ?? [];
  const max = useMemo(() => {
    let m = 0;
    for (const s of series) if (s.revenue > m) m = s.revenue;
    return m;
  }, [series]);

  const totalWeek = useMemo(() => {
    return series.reduce((s, p) => s + Number(p.revenue), 0);
  }, [series]);

  const today = new Date();
  const dateLabel = new Intl.DateTimeFormat(
    intlLocale === "en" ? "en-US" : "vi-VN",
    { weekday: "long", day: "numeric", month: "numeric", year: "numeric" }
  ).format(today);

  const revenueFmt = formatMillionShort(data?.revenue_today ?? 0);
  const totalWeekFmt = formatMillionShort(totalWeek);

  const stats = [
    {
      label: t("statRevenue"),
      value: data ? revenueFmt.value : "—",
      unit: data ? revenueFmt.unit : "",
      sub: t("statRevenueSub"),
      primary: true,
    },
    {
      label: t("statOrders"),
      value: data ? String(data.orders_today) : "—",
      unit: "",
      sub: t("statOrdersSub", { n: data?.orders_today ?? 0 }),
      tone: "teal" as const,
    },
    {
      label: data?.best_seller ? t("statBestSeller") : t("statPending"),
      value: data?.best_seller
        ? String(data.best_seller.qty)
        : String(data?.pending_count ?? "—"),
      unit: data?.best_seller ? t("countUnit") : "",
      sub: data?.best_seller
        ? (intlLocale === "en"
            ? data.best_seller.name_en ?? data.best_seller.name_vi ?? "—"
            : data.best_seller.name_vi ?? data.best_seller.name_en ?? "—")
        : t("statPendingSub"),
      tone: "orange" as const,
    },
  ];

  return (
    <main className="relative min-h-screen bg-ice pb-24 font-body text-ink">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-3.5 pt-1.5">
        <div>
          <div className="text-[11.5px] font-semibold text-ink2">
            {t("overview")}
          </div>
          <div className="mt-0.5 font-heading text-[18px] font-bold text-ink">
            {dateLabel}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white">
            <IcBell size={18} />
            {(data?.pending_count ?? 0) > 0 && (
              <div className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-orange" />
            )}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-heading text-[13px] font-bold text-white">
            AD
          </div>
        </div>
      </div>

      {/* Stat cards 1.2fr / 1fr / 1fr */}
      <div
        className="grid gap-2.5 px-4"
        style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}
      >
        {stats.map((s, i) => {
          const accent =
            s.tone === "teal"
              ? "var(--color-teal)"
              : s.tone === "orange"
                ? "var(--color-orange)"
                : "var(--color-navy)";
          const isPrimary = s.primary;
          return (
            <div
              key={i}
              className={
                "relative overflow-hidden rounded-[14px] p-3 " +
                (isPrimary
                  ? "bg-navy text-white"
                  : "border border-line bg-white text-ink")
              }
            >
              <div
                className={
                  "text-[10.5px] font-semibold " +
                  (isPrimary ? "text-white/70" : "text-ink2")
                }
              >
                {s.label}
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <div
                  className={
                    "font-heading font-bold leading-none " +
                    (isPrimary ? "text-[22px] text-white" : "text-[20px] text-ink")
                  }
                >
                  {s.value}
                </div>
                {s.unit && (
                  <span
                    className={
                      "text-[11px] " +
                      (isPrimary ? "text-white/70" : "opacity-70")
                    }
                  >
                    {s.unit}
                  </span>
                )}
              </div>
              <div
                className="mt-1.5 truncate text-[10px] font-semibold"
                style={{ color: isPrimary ? "rgba(255,255,255,0.7)" : accent }}
              >
                {s.sub}
              </div>
              {!isPrimary && (
                <div
                  className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full"
                  style={{ background: accent }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 7-day bar chart */}
      <div className="mx-4 mt-3.5 rounded-2xl border border-line bg-white px-3.5 pb-2.5 pt-3.5">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="font-heading text-[14px] font-bold">
              {t("revenueWeek")}
            </div>
            <div className="mt-0.5 text-[11px] text-ink2">
              7 {t("days")} ·{" "}
              <strong className="text-ink">
                {totalWeekFmt.value}
                {totalWeekFmt.unit}
              </strong>
            </div>
          </div>
        </div>

        <div className="mt-3.5 flex items-end gap-2 px-0.5" style={{ height: 110 }}>
          {(series.length > 0
            ? series
            : Array.from({ length: 7 }, (_, i) => ({
                bucket: `placeholder-${i}`,
                revenue: 0,
                order_count: 0,
              }))
          ).map((b, i, arr) => {
            const isToday = i === arr.length - 1;
            const heightPct =
              max > 0 ? Math.max(8, Math.round((b.revenue / max) * 100)) : 8;
            const color = isToday ? "var(--color-orange)" : "var(--color-teal)";
            const dateObj = new Date(b.bucket);
            const dayIdx = Number.isNaN(dateObj.getTime())
              ? 0
              : dateObj.getDay();
            const dayLabel =
              intlLocale === "en"
                ? DAY_LABELS_EN[dayIdx]
                : DAY_LABELS_VI[dayIdx];
            const sumFmt = formatMillionShort(b.revenue);
            return (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <div className="relative w-full" style={{ height: "100%" }}>
                  <div
                    className="absolute bottom-0 w-full rounded-md"
                    style={{
                      height: `${heightPct}%`,
                      background: color,
                      opacity: isToday ? 1 : 0.85,
                    }}
                  >
                    {isToday && b.revenue > 0 && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[5px] bg-ink px-1.5 py-[3px] text-[9.5px] font-bold text-white"
                        style={{ top: -22 }}
                      >
                        {sumFmt.value}
                        {sumFmt.unit}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={
                    "text-[10px] " +
                    (isToday
                      ? "font-bold text-orange"
                      : "font-semibold text-ink2")
                  }
                >
                  {dayLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending products */}
      <div className="mt-4 px-4">
        <div className="flex items-baseline justify-between">
          <div className="font-heading text-[15px] font-bold">
            {t("pendingTitle")}{" "}
            {(data?.pending_count ?? 0) > 0 && (
              <span className="text-orange">· {data?.pending_count}</span>
            )}
          </div>
          <a
            href={`/${locale}/dashboard/approvals`}
            className="text-[12px] font-semibold text-teal"
          >
            {t("seeAll")}
          </a>
        </div>

        <div className="mt-2 flex flex-col gap-2.5">
          {loading && (
            <p className="py-4 text-center text-sm text-ink3">
              {t("loading")}
            </p>
          )}
          {!loading && (data?.pending_products ?? []).length === 0 && (
            <p className="py-4 text-center text-sm text-ink3">
              {t("noPending")}
            </p>
          )}
          {(data?.pending_products ?? []).map((p, i) => {
            const who = p.staff_name ?? p.staff_email ?? "[Staff]";
            return (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-[14px] border border-line bg-white p-3"
              >
                <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-xl">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url}
                      alt={p.name_vi}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ItemPh
                      label={`NEW · ${String.fromCharCode(71 + i)}`}
                      height={52}
                      hue={i}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-heading text-[13.5px] font-bold">
                    {p.name_vi}
                  </div>
                  <div className="mt-1 text-[11px] text-ink2">
                    {who} · {formatVnd(p.price)}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => approve(p.id)}
                    className="inline-flex items-center gap-1 rounded-[10px] bg-teal px-3.5 py-2 font-heading text-[12px] font-bold text-white"
                  >
                    <IcCheck size={12} />
                    {t("btnApprove")}
                  </button>
                  <a
                    href={`/${locale}/dashboard/approvals`}
                    className="rounded-[10px] border border-line px-3.5 py-1.5 text-center text-[11px] font-semibold text-ink2"
                  >
                    {t("btnView")}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-4 border-t border-line bg-white px-4 pb-7 pt-2">
        <NavLink href={`/${locale}/dashboard/overview`} label={t("navOverview")} active>
          <IcHome size={22} color={NAVY} />
        </NavLink>
        <NavLink href={`/${locale}/dashboard/approvals`} label={t("navApprovals")}>
          <IcCatalog size={22} color={INK3} />
        </NavLink>
        <NavLink href={`/${locale}/dashboard/reports`} label={t("navReports")}>
          <IcChart size={22} color={INK3} />
        </NavLink>
        <NavLink href={`/${locale}/dashboard/settings`} label={t("navSettings")}>
          <IcCog size={22} color={INK3} />
        </NavLink>
      </nav>
    </main>
  );

  async function approve(id: string) {
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "active" }),
      });
      // refetch
      const r = await fetch("/api/admin/overview", { cache: "no-store" });
      if (r.ok) setData((await r.json()) as OverviewData);
    } catch {
      // ignore
    }
  }
}

function NavLink({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={
        "flex flex-col items-center gap-[3px] " +
        (active ? "text-navy" : "text-ink3")
      }
    >
      {children}
      <span className={"text-[10px] " + (active ? "font-bold" : "font-semibold")}>
        {label}
      </span>
    </a>
  );
}
