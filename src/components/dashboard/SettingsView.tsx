"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AdminBottomNav } from "./AdminBottomNav";

type Settings = {
  display_name?: string | null;
  tagline_vi?: string | null;
  tagline_en?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  opening_hours?: string | null;
  phone?: string | null;
  address?: string | null;
};

const DEFAULT_FORM: Settings = {
  primary_color: "#01406D",
  secondary_color: "#01B4BA",
};

export function SettingsView({ locale }: { locale: string }) {
  const t = useTranslations("AdminSettings");
  const [form, setForm] = useState<Settings>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Settings>;
      })
      .then((data) => {
        setForm({
          ...DEFAULT_FORM,
          ...Object.fromEntries(
            Object.entries(data ?? {}).filter(([, v]) => v != null)
          ),
        });
      })
      .catch(() => {
        // keep defaults
      })
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const r = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        setError(t("saveError"));
      } else {
        setSaved(true);
      }
    } catch {
      setError(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  const primary = form.primary_color || "#01406D";

  return (
    <main className="min-h-screen bg-ice pb-32">
      <header className="bg-navy">
        <div className="mx-auto max-w-[430px] px-4 py-5">
          <h1 className="font-heading text-lg font-semibold text-white">
            {t("title")}
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-[430px] space-y-4 px-4 py-4">
        <div
          className="rounded-2xl border-2 bg-white p-4"
          style={{ borderColor: primary }}
        >
          <p className="text-[11px] font-semibold uppercase text-ink3">
            {t("preview")}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl text-white"
              style={{ backgroundColor: primary }}
            >
              {form.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.logo_url}
                  alt="logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-heading text-base font-bold">
                  {(form.display_name ?? "Z").slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate font-heading text-base font-semibold"
                style={{ color: primary }}
              >
                {form.display_name || t("displayNamePlaceholder")}
              </p>
              <p className="truncate text-xs text-ink2">
                {form.tagline_vi || t("taglinePlaceholder")}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label={t("displayName")}>
            <input
              type="text"
              value={form.display_name ?? ""}
              onChange={(e) => update("display_name", e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </Field>

          <Field label={t("taglineVi")}>
            <input
              type="text"
              value={form.tagline_vi ?? ""}
              onChange={(e) => update("tagline_vi", e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </Field>

          <Field label={t("taglineEn")}>
            <input
              type="text"
              value={form.tagline_en ?? ""}
              onChange={(e) => update("tagline_en", e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </Field>

          <Field label={t("logoUrl")}>
            <input
              type="url"
              value={form.logo_url ?? ""}
              onChange={(e) => update("logo_url", e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("primaryColor")}>
              <ColorInput
                value={form.primary_color ?? "#01406D"}
                onChange={(v) => update("primary_color", v)}
              />
            </Field>
            <Field label={t("secondaryColor")}>
              <ColorInput
                value={form.secondary_color ?? "#01B4BA"}
                onChange={(v) => update("secondary_color", v)}
              />
            </Field>
          </div>

          <Field label={t("openingHours")}>
            <input
              type="text"
              value={form.opening_hours ?? ""}
              onChange={(e) => update("opening_hours", e.target.value)}
              placeholder='{"mon":"08:00-22:00",...}'
              className="w-full rounded-xl border border-line bg-white px-3 py-2 font-mono text-xs focus:border-navy focus:outline-none"
            />
          </Field>

          <Field label={t("phone")}>
            <input
              type="tel"
              value={form.phone ?? ""}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </Field>

          <Field label={t("address")}>
            <textarea
              rows={2}
              value={form.address ?? ""}
              onChange={(e) => update("address", e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </Field>

          {error && <p className="text-sm text-orange">{error}</p>}
          {saved && <p className="text-sm text-teal">{t("saved")}</p>}

          <button
            type="submit"
            disabled={saving || loading}
            className="w-full rounded-2xl bg-navy py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? t("saving") : t("btnSave")}
          </button>
        </form>
      </section>

      <AdminBottomNav
        active="settings"
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

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-semibold uppercase text-ink3">
        {label}
      </span>
      {children}
    </label>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 cursor-pointer rounded border border-line"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-xl border border-line bg-white px-2 py-2 text-xs focus:border-navy focus:outline-none"
      />
    </div>
  );
}
