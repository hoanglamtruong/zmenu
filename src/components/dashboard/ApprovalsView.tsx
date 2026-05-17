"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminBottomNav } from "./AdminBottomNav";

type PendingProduct = {
  id: string;
  name_vi: string;
  name_en: string | null;
  price: number;
  image_url: string | null;
  status: string;
  created_at: string;
  staff_name: string | null;
  staff_email: string | null;
};

function formatVnd(n: number | string) {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

export function ApprovalsView({ locale }: { locale: string }) {
  const t = useTranslations("AdminApprovals");
  const [items, setItems] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/products?status=pending", {
        cache: "no-store",
      });
      if (!r.ok) return;
      const data = (await r.json()) as PendingProduct[];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  function timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    if (!Number.isFinite(diffMs) || diffMs < 0) return t("justNow");
    const min = Math.floor(diffMs / 60_000);
    if (min < 1) return t("justNow");
    if (min < 60) return t("minutesAgo", { m: min });
    const h = Math.floor(min / 60);
    if (h < 24) return t("hoursAgo", { h });
    const d = Math.floor(h / 24);
    return t("daysAgo", { d });
  }

  async function decide(id: string, status: "active" | "inactive") {
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      void refresh();
    } catch {
      // ignore
    }
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
        {!loading && items.length === 0 && (
          <p className="py-12 text-center text-sm text-ink3">{t("empty")}</p>
        )}
        {items.map((p) => {
          const who = p.staff_name ?? p.staff_email;
          return (
            <div
              key={p.id}
              className="space-y-3 rounded-2xl border border-line bg-white p-4"
            >
              <div className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ice">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url}
                      alt={p.name_vi}
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
                    {p.name_vi}
                  </p>
                  <p className="text-sm font-semibold text-orange">
                    {formatVnd(p.price)}
                  </p>
                  <p className="mt-1 text-[10px] text-ink3">
                    {who ? t("by", { who }) : t("byUnknown")}
                  </p>
                  <p className="text-[10px] text-ink3">
                    {timeAgo(p.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => decide(p.id, "inactive")}
                  className="flex-1 rounded-xl border border-line py-2 text-sm font-semibold text-ink2"
                >
                  {t("btnReject")}
                </button>
                <button
                  type="button"
                  onClick={() => decide(p.id, "active")}
                  className="flex-1 rounded-xl bg-teal py-2 text-sm font-semibold text-white"
                >
                  ✓ {t("btnApprove")}
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <AdminBottomNav
        active="approvals"
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
