"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { StaffBottomNav } from "./StaffBottomNav";

type Product = {
  id: string;
  name_vi: string;
  name_en: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  status: string;
  is_flash_deal: boolean;
  flash_name: string | null;
  flash_qty: number | null;
  flash_ends_at: string | null;
  is_active: boolean;
  category_name_vi: string | null;
};

type Filter = "all" | "active" | "pending" | "hidden";

type Props = { locale: string };

function formatVnd(n: number | string) {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

type FormState = {
  name_vi: string;
  name_en: string;
  price: string;
  category_id: string;
  image_url: string;
  is_flash_deal: boolean;
  flash_name: string;
  flash_qty: string;
  flash_ends_at: string;
};

const EMPTY_FORM: FormState = {
  name_vi: "",
  name_en: "",
  price: "",
  category_id: "",
  image_url: "",
  is_flash_deal: false,
  flash_name: "",
  flash_qty: "",
  flash_ends_at: "",
};

export function StaffProductsView({ locale }: Props) {
  const t = useTranslations("StaffProducts");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/staff/products", { cache: "no-store" });
      if (!r.ok) return;
      const data = (await r.json()) as Product[];
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filter === "all") return true;
      if (filter === "active") return p.is_active && p.status === "active";
      if (filter === "pending") return p.status === "pending";
      if (filter === "hidden") return !p.is_active;
      return true;
    });
  }, [products, filter]);

  async function toggleActive(p: Product) {
    try {
      await fetch("/api/staff/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, is_active: !p.is_active }),
      });
      void refresh();
    } catch {
      // ignore
    }
  }

  function onImageFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === "string") {
        setForm((f) => ({ ...f, image_url: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  }

  async function submitProduct(e: FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const r = await fetch("/api/staff/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_vi: form.name_vi.trim(),
          name_en: form.name_en.trim() || null,
          price: Number(form.price) || 0,
          category_id: form.category_id.trim() || null,
          image_url: form.image_url || null,
          is_flash_deal: form.is_flash_deal,
          flash_name: form.flash_name.trim() || null,
          flash_qty: form.flash_qty ? Number(form.flash_qty) : null,
          flash_ends_at: form.flash_ends_at || null,
        }),
      });
      if (!r.ok) {
        setSaveError(t("saveError"));
        setSaving(false);
        return;
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
      void refresh();
    } catch {
      setSaveError(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-ice pb-24">
      <header className="bg-navy">
        <div className="mx-auto flex max-w-[430px] items-center justify-between px-4 py-5">
          <h1 className="font-heading text-lg font-semibold text-white">
            {t("title")}
          </h1>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-full bg-orange px-3 py-1.5 text-xs font-semibold text-white"
          >
            + {t("btnAdd")}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[430px] overflow-x-auto px-4 py-3">
        <div className="flex w-max gap-2">
          {(["all", "active", "pending", "hidden"] as const).map((f) => {
            const labelKey =
              f === "all"
                ? "filterAll"
                : f === "active"
                  ? "filterActive"
                  : f === "pending"
                    ? "filterPending"
                    : "filterHidden";
            const isSelected = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={
                  "shrink-0 rounded-full px-4 py-2 text-xs font-medium " +
                  (isSelected
                    ? "bg-navy text-white"
                    : "border border-navy bg-white text-navy")
                }
              >
                {t(labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      <section className="mx-auto max-w-[430px] space-y-3 px-4 pb-4">
        {loading && (
          <p className="py-12 text-center text-sm text-ink3">
            {t("loading")}
          </p>
        )}
        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-ink3">
            {t("empty")}
          </p>
        )}
        {filtered.map((p) => {
          const statusKey =
            p.status === "pending"
              ? "statusPending"
              : !p.is_active
                ? "statusHidden"
                : "statusActive";
          const statusColor =
            p.status === "pending"
              ? "bg-orange/15 text-orange"
              : !p.is_active
                ? "bg-line text-ink3"
                : "bg-teal/15 text-teal";
          return (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ice">
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
                <span
                  className={
                    "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " +
                    statusColor
                  }
                >
                  {t(statusKey)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleActive(p)}
                className="rounded-xl border border-navy px-3 py-1.5 text-xs font-semibold text-navy"
              >
                {p.is_active ? t("btnHide") : t("btnShow")}
              </button>
            </div>
          );
        })}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40">
          <form
            onSubmit={submitProduct}
            className="w-full max-w-[430px] space-y-3 rounded-t-3xl bg-white p-5 pb-[env(safe-area-inset-bottom)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-ink">
                {t("formTitle")}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-2xl leading-none text-ink3"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <label className="block space-y-1">
              <span className="text-[11px] font-semibold uppercase text-ink3">
                {t("formImage")}
              </span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => onImageFile(e.target.files?.[0] ?? null)}
                className="block w-full text-xs text-ink2"
              />
              {form.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image_url}
                  alt="preview"
                  className="mt-2 h-24 w-24 rounded-xl object-cover"
                />
              )}
            </label>

            <label className="block space-y-1">
              <span className="text-[11px] font-semibold uppercase text-ink3">
                {t("formName")}
              </span>
              <input
                type="text"
                required
                value={form.name_vi}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name_vi: e.target.value }))
                }
                className="w-full rounded-xl border border-line bg-ice px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-[11px] font-semibold uppercase text-ink3">
                {t("formPrice")}
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                required
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                className="w-full rounded-xl border border-line bg-ice px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-[11px] font-semibold uppercase text-ink3">
                {t("formCategory")}
              </span>
              <input
                type="text"
                value={form.category_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category_id: e.target.value }))
                }
                placeholder="category_id"
                className="w-full rounded-xl border border-line bg-ice px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_flash_deal}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_flash_deal: e.target.checked }))
                }
              />
              <span className="text-sm font-medium text-ink">
                {t("formFlashDeal")}
              </span>
            </label>

            {form.is_flash_deal && (
              <div className="space-y-3 rounded-xl border border-orange/30 bg-orange/5 p-3">
                <label className="block space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-ink3">
                    {t("formFlashName")}
                  </span>
                  <input
                    type="text"
                    value={form.flash_name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, flash_name: e.target.value }))
                    }
                    className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-ink3">
                    {t("formFlashQty")}
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={form.flash_qty}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, flash_qty: e.target.value }))
                    }
                    className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-ink3">
                    {t("formFlashEnds")}
                  </span>
                  <input
                    type="datetime-local"
                    value={form.flash_ends_at}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, flash_ends_at: e.target.value }))
                    }
                    className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none"
                  />
                </label>
              </div>
            )}

            {saveError && (
              <p className="text-sm text-orange">{saveError}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-ink2"
              >
                {t("btnCancel")}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-navy py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? t("saving") : t("btnSubmit")}
              </button>
            </div>
          </form>
        </div>
      )}

      <StaffBottomNav
        active="products"
        locale={locale}
        ordersLabel={t("navOrders")}
        productsLabel={t("navProducts")}
      />
    </main>
  );
}
