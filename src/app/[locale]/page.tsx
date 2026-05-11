import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Home");

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl w-full text-center space-y-4">
        <h1 className="font-heading text-4xl font-bold text-navy">
          {t("title")}
        </h1>
        <p className="text-ink2 text-lg">{t("tagline")}</p>
        <p className="text-ink3 text-sm">{t("welcome")}</p>
      </div>
    </main>
  );
}
