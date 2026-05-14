type Props = {
  active: "orders" | "products";
  locale: string;
  ordersLabel: string;
  productsLabel: string;
};

export function StaffBottomNav({
  active,
  locale,
  ordersLabel,
  productsLabel,
}: Props) {
  const itemClass = (isActive: boolean) =>
    "flex-1 py-3 text-center text-xs font-semibold transition " +
    (isActive ? "text-navy" : "text-ink3");
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-[430px] items-stretch">
        <a
          href={`/${locale}/staff/orders`}
          className={itemClass(active === "orders")}
        >
          {ordersLabel}
        </a>
        <a
          href={`/${locale}/staff/products`}
          className={itemClass(active === "products")}
        >
          {productsLabel}
        </a>
      </div>
    </nav>
  );
}
