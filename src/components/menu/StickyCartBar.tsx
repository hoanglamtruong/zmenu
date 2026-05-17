"use client";

type Props = {
  itemCount: number;
  total: number;
  onCheckout: () => void;
  itemsLabel: string;
  checkoutLabel: string;
};

function formatVnd(n: number | string): string {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

export function StickyCartBar({
  itemCount,
  total,
  onCheckout,
  itemsLabel,
  checkoutLabel,
}: Props) {
  if (itemCount <= 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-[430px] px-4 pb-3">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-navy px-4 py-3 text-white shadow-lg">
          <div className="flex flex-col">
            <span className="text-xs opacity-80">{itemsLabel}</span>
            <span className="text-base font-semibold">{formatVnd(total)}</span>
          </div>
          <button
            type="button"
            onClick={onCheckout}
            className="rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 active:scale-95"
          >
            {checkoutLabel} →
          </button>
        </div>
      </div>
    </div>
  );
}
