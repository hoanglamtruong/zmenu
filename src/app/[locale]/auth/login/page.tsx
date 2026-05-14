"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Login");

  const locale =
    typeof params?.locale === "string" ? params.locale : "vi";
  const role = searchParams?.get("role") ?? "staff";
  const callbackUrl =
    role === "admin" ? `/${locale}/dashboard` : `/${locale}/staff`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });
      if (!res || res.error) {
        setError(t("error"));
        setSubmitting(false);
        return;
      }
      router.push(res.url ?? callbackUrl);
    } catch {
      setError(t("error"));
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-ice">
      <header className="bg-navy">
        <div className="mx-auto max-w-[430px] px-4 py-8">
          <h1 className="font-heading text-xl font-semibold text-white">
            {t("title")}
          </h1>
          <p className="mt-1 text-xs text-white/80">{t("subtitle")}</p>
        </div>
      </header>

      <section className="mx-auto max-w-[430px] px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-line bg-white p-5"
        >
          <div className="space-y-1">
            <label
              htmlFor="login-email"
              className="text-[11px] font-semibold uppercase tracking-wide text-ink3"
            >
              {t("email")}
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-ice px-3 py-2.5 text-sm focus:border-navy focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="login-password"
              className="text-[11px] font-semibold uppercase tracking-wide text-ink3"
            >
              {t("password")}
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-ice px-3 py-2.5 text-sm focus:border-navy focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-orange">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-navy py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? t("submitting") : t("submit")}
          </button>
        </form>
      </section>
    </main>
  );
}
