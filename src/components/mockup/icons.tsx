// SVG icon set lifted from design/Zmenu PWA Mockups v4.html
// Sizes and colors are caller-controlled to match the mockup exactly.

import type { ReactNode } from "react";

type IconProps = { size?: number; color?: string };

export const NAVY = "#01406D";
export const TEAL = "#01B4BA";
export const ORANGE = "#FF7A0F";
export const ICE = "#F5FEFE";
export const INK = "#0E1B26";
export const INK2 = "#5A6B78";
export const INK3 = "#92A1AE";
export const LINE = "#E3EEF1";
export const GREEN = "#16A34A";
export const GREEN_BG = "#E8F8EE";
export const RED = "#C2272D";
export const RED_BG = "#FCE4E4";
export const TEAL_BG = "#E0F6F7";
export const ORANGE_BG = "#FFEFDD";

export function IcSearch({ size = 18, color = INK2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IcBack({ size = 22, color = INK }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 5l-7 7 7 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcPlus({ size = 16, color = "#fff" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function IcCart({ size = 18, color = "#fff" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 4h2.5l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 1.95-1.55L21 8H6.2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill={color} />
      <circle cx="17" cy="20" r="1.4" fill={color} />
    </svg>
  );
}

export function IcArrow({ size = 16, color = "#fff" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IcTag({ size = 12, color = "#fff" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M3 12V4h8l10 10-8 8z" opacity="0.9" />
      <circle cx="7.5" cy="7.5" r="1.5" fill={NAVY} />
    </svg>
  );
}

export function IcQr({ size = 14, color = INK2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.6" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.6" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.6" />
      <path d="M14 14h3v3M21 14v3M14 21h7M17 17h4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IcPin({ size = 14, color = TEAL }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

export function IcCheck({ size = 14, color = "#fff" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcReceipt({ size = 22, color = INK3 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IcCatalog({ size = 22, color = INK3 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="14" y="4" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

export function IcUser({ size = 22, color = INK3 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IcHome({ size = 22, color = INK3 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IcChart({ size = 22, color = INK3 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IcCog({ size = 22, color = INK3 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
      <path
        d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IcBell({ size = 18, color = INK }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 8a6 6 0 0 1 12 0v4l1.5 3h-15L6 12z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 0 0 4 0" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

export function IcWarn({ size = 16, color = ORANGE }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l10 18H2z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10v5M12 18.5v.1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IcMsg({ size = 14, color = TEAL }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16v12H8l-4 4z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="9" cy="11" r="1" fill={color} />
      <circle cx="13" cy="11" r="1" fill={color} />
      <circle cx="17" cy="11" r="1" fill={color} />
    </svg>
  );
}

export function IcCard({ size = 20, color = TEAL }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke={color} strokeWidth="1.8" />
      <circle cx="12" cy="12.5" r="2.5" stroke={color} strokeWidth="1.8" />
      <path d="M3 10h18" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

export function ZLogo({
  width = 88,
  dark = false,
  color,
}: {
  width?: number;
  dark?: boolean;
  color?: string;
}) {
  const text = color ?? (dark ? "#F5FEFE" : NAVY);
  const bar = color ?? (dark ? "#F5FEFE" : NAVY);
  return (
    <svg
      width={width}
      height={width * (24 / 92)}
      viewBox="0 0 92 24"
      fill="none"
    >
      <rect x="0" y="3" width="14" height="3" rx="1" fill={TEAL} />
      <rect x="0" y="9" width="19" height="3" rx="1" fill={bar} />
      <rect x="0" y="15" width="11" height="3" rx="1" fill={bar} />
      <circle cx="22" cy="16.5" r="1.4" fill={ORANGE} />
      <text
        x="28"
        y="18"
        fontFamily="Be Vietnam Pro, sans-serif"
        fontWeight="700"
        fontSize="16"
        letterSpacing="-0.5"
        fill={text}
      >
        Zmenu
      </text>
    </svg>
  );
}

// Striped diagonal placeholder used by the mockup wherever a real image
// is missing. 4 hue palettes mirror the mockup exactly.
const ITEM_PH_PALETTES: Array<[string, string, string]> = [
  ["#DCEAF3", "#C5DBEA", NAVY],
  ["#D6F3F4", "#BDEAEC", TEAL],
  ["#FFE6D1", "#FFD2AE", ORANGE],
  ["#E8F2F4", "#D4E8EB", NAVY],
];

export function ItemPh({
  label,
  height = 130,
  hue = 0,
  badge,
}: {
  label: string;
  height?: number;
  hue?: number;
  badge?: ReactNode;
}) {
  const [a, b, c] = ITEM_PH_PALETTES[hue % ITEM_PH_PALETTES.length];
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{
        height,
        background: `repeating-linear-gradient(135deg, ${a} 0 10px, ${b} 10px 20px)`,
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center px-2 text-center uppercase"
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 9.5,
          letterSpacing: 0.4,
          color: c,
          opacity: 0.7,
        }}
      >
        {label}
      </div>
      {badge}
    </div>
  );
}
