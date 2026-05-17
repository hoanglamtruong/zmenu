"use client";

type Props = {
  name: string;
  isSelected: boolean;
  onClick: () => void;
};

export function CategoryChip({ name, isSelected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition " +
        (isSelected
          ? "bg-navy text-white shadow-sm"
          : "border border-navy bg-white text-navy hover:bg-navy/5")
      }
    >
      {name}
    </button>
  );
}
