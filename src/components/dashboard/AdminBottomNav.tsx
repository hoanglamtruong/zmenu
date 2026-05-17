type AdminTab = "overview" | "approvals" | "reports" | "settings";

type Props = {
  active: AdminTab;
  locale: string;
  labels: {
    overview: string;
    approvals: string;
    reports: string;
    settings: string;
  };
};

export function AdminBottomNav({ active, locale, labels }: Props) {
  const items: Array<{ key: AdminTab; href: string; label: string }> = [
    {
      key: "overview",
      href: `/${locale}/dashboard/overview`,
      label: labels.overview,
    },
    {
      key: "approvals",
      href: `/${locale}/dashboard/approvals`,
      label: labels.approvals,
    },
    {
      key: "reports",
      href: `/${locale}/dashboard/reports`,
      label: labels.reports,
    },
    {
      key: "settings",
      href: `/${locale}/dashboard/settings`,
      label: labels.settings,
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-[430px] items-stretch">
        {items.map((it) => (
          <a
            key={it.key}
            href={it.href}
            className={
              "flex-1 py-3 text-center text-[11px] font-semibold transition " +
              (active === it.key ? "text-navy" : "text-ink3")
            }
          >
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
