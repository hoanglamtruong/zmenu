type Item = {
  name: string;
  quantity: number;
  price: number;
};

type Props = {
  items: Item[];
  total: number;
  subtotalLabel: string;
  totalLabel: string;
};

function formatVnd(n: number | string): string {
  const num = typeof n === "number" ? n : Number(n);
  return `${new Intl.NumberFormat("vi-VN").format(num)}đ`;
}

export function OrderSummary({
  items,
  total,
  subtotalLabel,
  totalLabel,
}: Props) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <ul className="space-y-2 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex justify-between gap-2">
            <span className="flex-1 truncate text-ink">
              {it.name}{" "}
              <span className="text-ink3">× {it.quantity}</span>
            </span>
            <span className="text-ink2">
              {formatVnd(it.price * it.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 space-y-1 border-t border-line pt-3">
        <div className="flex justify-between text-sm text-ink2">
          <span>{subtotalLabel}</span>
          <span>{formatVnd(total)}</span>
        </div>
        <div className="flex justify-between text-base font-bold">
          <span className="text-ink">{totalLabel}</span>
          <span className="text-orange">{formatVnd(total)}</span>
        </div>
      </div>
    </div>
  );
}
