"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useOrderStream } from "@/hooks/useOrderStream";
import {
  IcBell,
  IcCatalog,
  IcCheck,
  IcPin,
  IcReceipt,
  IcUser,
  NAVY,
  TEAL,
  ORANGE,
  INK3,
} from "@/components/mockup/icons";

type Item = {
  name_vi: string | null;
  name_en: string | null;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  table_id: string | null;
  status: string;
  customer_note: string | null;
  created_at: string;
  total: number;
  item_count: number;
  items: Item[];
};

type Tab = "new" | "cooking" | "done";

type Props = {
  tenantSlug: string;
  locale: string;
};

const NEW_STATUSES = new Set(["pending", "confirmed"]);
const COOKING_STATUSES = new Set(["preparing", "ready"]);
const DONE_STATUSES = new Set(["completed"]);

function formatVnd(n: number | string) {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

function classifyTab(status: string): Tab | "other" {
  if (NEW_STATUSES.has(status)) return "new";
  if (COOKING_STATUSES.has(status)) return "cooking";
  if (DONE_STATUSES.has(status)) return "done";
  return "other";
}

function nextStatusFor(status: string): string | null {
  if (status === "pending") return "confirmed";
  if (status === "confirmed") return "preparing";
  if (status === "preparing") return "ready";
  if (status === "ready") return "completed";
  return null;
}

export function StaffOrdersView({ tenantSlug, locale }: Props) {
  const t = useTranslations("StaffOrders");
  const intlLocale = useLocale();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("new");

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

  const counts = useMemo(() => {
    let n = 0, c = 0, d = 0;
    for (const o of orders) {
      const t = classifyTab(o.status);
      if (t === "new") n += 1;
      else if (t === "cooking") c += 1;
      else if (t === "done") d += 1;
    }
    return { new: n, cooking: c, done: d };
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter((o) => classifyTab(o.status) === tab);
  }, [orders, tab]);

  async function advance(id: string, status: string) {
    const next = nextStatusFor(status);
    if (!next) return;
    try {
      await fetch(`/api/orders/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      void refresh();
    } catch {
      // ignore
    }
  }

  function timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    if (!Number.isFinite(diffMs) || diffMs < 0) return t("justNow");
    const min = Math.floor(diffMs / 60_000);
    if (min < 1) return t("justNow");
    if (min < 60) return t("minutesAgo", { m: min });
    const h = Math.floor(min / 60);
    return t("hoursAgo", { h });
  }

  const today = new Date();
  const weekday = new Intl.DateTimeFormat(
    intlLocale === "en" ? "en-US" : "vi-VN",
    { weekday: "long" }
  ).format(today);
  const todayLabel = `${t("todayPrefix")} · ${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`;

  return (
    <main className="relative min-h-screen bg-ice pb-24 font-body text-ink">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-3.5 pt-1.5">
        <div>
          <div className="text-[11.5px] font-semibold text-ink2">
            {todayLabel}
          </div>
          <div className="mt-0.5 flex items-center gap-2 font-heading text-[20px] font-bold text-ink">
            {t("title")}
            {counts.new > 0 && (
              <span className="rounded-full bg-orange px-2 py-[3px] text-[11px] font-bold text-white">
                {t("newCount", { n: counts.new })}
              </span>
            )}
          </div>
        </div>
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white">
          <IcBell size={18} />
          {counts.new > 0 && (
            <div className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-orange" />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4">
        <TabPill
          label={t("tabNew")}
          count={counts.new}
          active={tab === "new"}
          onClick={() => setTab("new")}
        />
        <TabPill
          label={t("tabCooking")}
          count={counts.cooking}
          active={tab === "cooking"}
          onClick={() => setTab("cooking")}
        />
        <TabPill
          label={t("tabDone")}
          count={counts.done}
          active={tab === "done"}
          onClick={() => setTab("done")}
        />
      </div>

      {/* Order list */}
      <section className="flex flex-col gap-3 px-4 pb-24 pt-3.5">
        {loading && (
          <p className="py-12 text-center text-sm text-ink3">{t("loading")}</p>
        )}
        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-ink3">
            {t("noOrders")}
          </p>
        )}
        {filtered.map((o) => {
          const group = classifyTab(o.status);
          const isNew = group === "new";
          const isCooking = group === "cooking";
          const next = nextStatusFor(o.status);
          const badgeBg = isNew
            ? "bg-[#FFEFDD] text-orange"
            : isCooking
              ? "bg-[#E0F6F7] text-teal"
              : "bg-line text-ink3";
          const badgeLabel = isNew
            ? t("statusNew")
            : isCooking
              ? t("statusCooking")
              : t("statusDone");
          const iconBg = isNew ? "#FFEFDD" : isCooking ? "#E0F6F7" : "#F0F0F0";
          const iconColor = isNew ? ORANGE : isCooking ? TEAL : INK3;
          const locDisplay = o.table_id ? `[${o.table_id}]` : "[Mã vị trí]";
          return (
            <div
              key={o.id}
              className="rounded-2xl border border-line bg-white p-3.5 shadow-[0_1px_2px_rgba(1,64,109,0.04)]"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-[11px]"
                  style={{ background: iconBg }}
                >
                  <IcPin size={20} color={iconColor} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <div className="font-heading text-[14.5px] font-bold">
                      {locDisplay}
                    </div>
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink2">
                    {timeAgo(o.created_at)} · {t("itemCount", { count: o.item_count })}
                  </div>
                </div>
                <div
                  className={
                    "rounded-full px-2.5 py-1 text-[10.5px] font-bold " + badgeBg
                  }
                >
                  {badgeLabel}
                </div>
              </div>

              {o.items.length > 0 && (
                <div className="mt-3 rounded-[10px] bg-ice px-3 py-2.5">
                  {o.items.map((it, j) => {
                    const name =
                      (intlLocale === "en" ? it.name_en : it.name_vi) ??
                      it.name_vi ??
                      it.name_en ??
                      "—";
                    return (
                      <div
                        key={j}
                        className="flex items-baseline justify-between py-[3px] text-[12.5px]"
                      >
                        <span className="text-ink">
                          <span
                            className="mr-1.5 font-bold text-navy"
                            style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}
                          >
                            ×{it.quantity}
                          </span>
                          {name}
                        </span>
                        <span className="font-semibold text-ink2">
                          {formatVnd(it.price * it.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {o.customer_note && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#FFEFDD] px-2.5 py-1.5 text-[11.5px] font-semibold text-orange">
                  <span className="text-[13px]">⚠</span>
                  {t("noteLabel", { note: o.customer_note })}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="font-heading text-[15px] font-bold text-orange">
                  {formatVnd(o.total)}
                </div>
                {next && (
                  <button
                    type="button"
                    onClick={() => advance(o.id, o.status)}
                    className={
                      "inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 font-heading text-[13px] font-bold text-white " +
                      (isNew
                        ? "bg-teal shadow-[0_2px_6px_rgba(1,180,186,0.3)]"
                        : "bg-navy shadow-[0_2px_6px_rgba(1,64,109,0.25)]")
                    }
                  >
                    <IcCheck size={13} />
                    {isNew ? t("btnConfirm") : t("btnDone")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-3 border-t border-line bg-white px-4 pb-7 pt-2">
        <NavItem label={t("navOrders")} active badge={counts.new || undefined}>
          <IcReceipt size={22} color={NAVY} />
        </NavItem>
        <NavItem label={t("navCatalog")}>
          <IcCatalog size={22} />
        </NavItem>
        <NavItem label={t("navAccount")} href={`/${locale}/auth/login?role=staff`}>
          <IcUser size={22} />
        </NavItem>
      </nav>
    </main>
  );
}

function TabPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2.5 " +
        (active
          ? "bg-navy text-white"
          : "border border-line bg-white text-ink")
      }
    >
      <span
        className={
          "text-[11.5px] font-semibold " +
          (active ? "text-white/75" : "text-ink2")
        }
      >
        {label}
      </span>
      <span className="font-heading text-[18px] font-bold">{count}</span>
    </button>
  );
}

function NavItem({
  label,
  active,
  badge,
  href,
  children,
}: {
  label: string;
  active?: boolean;
  badge?: number;
  href?: string;
  children: React.ReactNode;
}) {
  const cls =
    "flex flex-col items-center gap-[3px] " + (active ? "text-navy" : "text-ink3");
  const inner = (
    <>
      <div className="relative">
        {children}
        {badge && (
          <div className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full border-2 border-white bg-orange px-1 text-[9px] font-bold text-white">
            {badge}
          </div>
        )}
      </div>
      <div
        className={
          "text-[10px] " + (active ? "font-bold" : "font-semibold")
        }
      >
        {label}
      </div>
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}
