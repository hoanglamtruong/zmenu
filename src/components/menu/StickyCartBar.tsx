"use client";

import { useTranslations } from "next-intl";
import { IcArrow, IcCart } from "@/components/mockup/icons";

type Props = {
  itemCount: number;
  total: number;
  onCheckout: () => void;
};

function formatVnd(n: number | string): string {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

// S03 — Sticky bottom cart bar
// Navy floating card · always visible while scrolling · count + total + CTA
export function StickyCartBar({ itemCount, total, onCheckout }: Props) {
  const t = useTranslations("Menu");
  if (itemCount <= 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 pb-[max(env(safe-area-inset-bottom),12px)]">
      <div className="pointer-events-auto mx-auto max-w-[430px] px-3">
        <div className="flex items-center justify-between rounded-2xl bg-navy px-3.5 py-3 text-white shadow-[0_10px_30px_rgba(1,64,109,0.35)]">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/10">
              <IcCart size={18} />
              <div className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange px-1 text-[10px] font-bold text-white">
                {itemCount}
              </div>
            </div>
            <div>
              <div className="text-[11px] leading-none opacity-70">
                {t("cartItems", { count: itemCount })}
              </div>
              <div className="mt-0.5 font-heading text-[16px] font-bold">
                {formatVnd(total)}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onCheckout}
            className="flex items-center gap-1.5 rounded-xl bg-orange px-3.5 py-2.5 text-[13.5px] font-bold text-white active:scale-[0.97]"
          >
            {t("viewCart")}
            <IcArrow size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
