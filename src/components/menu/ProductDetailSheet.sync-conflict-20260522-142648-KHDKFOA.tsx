"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  IcCheck,
  IcClose,
  IcMinus,
  IcPlus,
  IcTag,
  ItemPh,
} from "@/components/mockup/icons";

export type DetailProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  is_flash_deal: boolean;
  flash_name: string | null;
  hue: number;
  ph: string;
};

type Props = {
  product: DetailProduct | null;
  open: boolean;
  onClose: () => void;
  onAdd: (id: string, quantity: number) => void;
};

function formatVnd(n: number | string): string {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

export function ProductDetailSheet({ product, open, onClose, onAdd }: Props) {
  const t = useTranslations("ProductDetail");
  const tMenu = useTranslations("Menu");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (open) setQty(1);
  }, [open, product?.id]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!product) return null;

  const total = product.price * qty;

  return (
    <div
      aria-hidden={!open}
      className={
        "fixed inset-0 z-40 transition-opacity duration-200 " +
        (open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")
      }
    >
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/45"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={
          "absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[24px] bg-ice pb-[calc(env(safe-area-inset-bottom)+16px)] shadow-[0_-12px_40px_rgba(1,64,109,0.18)] transition-transform duration-300 ease-out " +
          (open ? "translate-y-0" : "translate-y-full")
        }
      >
        {/* drag handle */}
        <div className="flex justify-center pb-2 pt-2.5">
          <div className="h-1 w-10 rounded-full bg-line" />
        </div>

        {/* close pill */}
        <button
          type="button"
          aria-label={t("close")}
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white"
        >
          <IcClose size={16} />
        </button>

        {/* hero image */}
        <div className="px-4">
          <div className="relative">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt={product.name}
                className="h-[200px] w-full rounded-2xl object-cover"
              />
            ) : (
              <ItemPh label={product.ph} height={200} hue={product.hue} />
            )}
            {product.is_flash_deal && (
              <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-orange px-2 py-1 text-[10.5px] font-bold uppercase text-white shadow-[0_2px_6px_rgba(255,122,15,0.4)]">
                <IcTag size={11} />
                {product.flash_name?.trim() || tMenu("flashDefault")}
              </div>
            )}
          </div>
        </div>

        {/* name + price */}
        <div className="px-4 pt-4">
          <div className="font-heading text-[18px] font-bold leading-tight text-ink">
            {product.name}
          </div>
          <div className="mt-1 text-[12.5px] leading-[1.4] text-ink2">
            {t("description")}
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="font-heading text-[22px] font-bold text-orange">
              {formatVnd(product.price)}
            </div>
            <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink3">
              {t("perUnit")}
            </div>
          </div>
        </div>

        {/* options */}
        <div className="px-4 pt-4">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="text-[12.5px] font-semibold text-ink2">
              {t("optionsLabel")}
            </div>
            <div className="text-[10px] italic text-ink3">{t("required")}</div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border-[1.5px] border-teal bg-white p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#E0F6F7] font-heading text-[13px] font-bold text-teal">
              {tMenu("flashDefault").slice(0, 1).toUpperCase()}
              <span className="sr-only">A</span>
            </div>
            <div className="flex-1">
              <div className="font-heading text-[14px] font-bold text-ink">
                {t("standardOption")}
              </div>
              <div className="mt-0.5 text-[11.5px] text-ink2">
                {t("standardOptionSub")}
              </div>
            </div>
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-teal">
              <IcCheck size={13} />
            </div>
          </div>
        </div>

        {/* stepper + CTA */}
        <div className="mt-5 flex items-center gap-3 px-4">
          <div className="flex items-center gap-2 rounded-full border border-line bg-white px-2 py-1.5">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label={t("decrease")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink2 active:scale-95"
            >
              <IcMinus size={14} />
            </button>
            <div className="min-w-[20px] text-center font-heading text-[15px] font-bold text-ink">
              {qty}
            </div>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              aria-label={t("increase")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-navy active:scale-95"
            >
              <IcPlus size={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              onAdd(product.id, qty);
              onClose();
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-navy px-4 py-[14px] font-heading text-[14.5px] font-bold text-white shadow-[0_10px_24px_rgba(1,64,109,0.28)] active:scale-[0.98]"
          >
            <span>{t("addToCart")}</span>
            <span className="opacity-80">·</span>
            <span>{formatVnd(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
