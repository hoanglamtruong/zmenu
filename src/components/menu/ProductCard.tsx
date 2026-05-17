"use client";

import { useEffect, useState } from "react";

type Props = {
  id: string;
  name_vi: string;
  name_en: string;
  price: number;
  image_url: string | null;
  is_flash_deal: boolean;
  flash_name: string | null;
  flash_ends_at: string | null;
  locale: string;
  flashFallbackLabel: string;
  onAdd: (id: string) => void;
};

function formatVnd(n: number | string): string {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

function FlashCountdown({ endsAt }: { endsAt: string }) {
  const target = new Date(endsAt).getTime();
  const [diff, setDiff] = useState(() => Math.max(0, target - Date.now()));
  useEffect(() => {
    const id = setInterval(() => {
      setDiff(Math.max(0, target - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return (
    <span className="font-mono text-[10px] tabular-nums">
      {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
      {String(s).padStart(2, "0")}
    </span>
  );
}

export function ProductCard({
  id,
  name_vi,
  name_en,
  price,
  image_url,
  is_flash_deal,
  flash_name,
  flash_ends_at,
  locale,
  flashFallbackLabel,
  onAdd,
}: Props) {
  const name = locale === "en" ? name_en || name_vi : name_vi || name_en;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="relative aspect-square w-full bg-ice">
        {image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image_url}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-ink3">
            —
          </div>
        )}
        {is_flash_deal && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-orange px-2 py-0.5 text-white shadow-sm">
            <span className="text-[10px]" aria-hidden>
              🔥
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              {flash_name ?? flashFallbackLabel}
            </span>
            {flash_ends_at && (
              <span className="ml-1 rounded bg-white/20 px-1">
                <FlashCountdown endsAt={flash_ends_at} />
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium text-ink">{name}</p>
          <p className="mt-1 text-base font-semibold text-orange">
            {formatVnd(price)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAdd(id)}
          aria-label="Add to cart"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-xl leading-none text-white transition hover:opacity-90 active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  );
}
