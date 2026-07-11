import type { Money } from "@/lib/shopify/types";
import { formatMoney, discountPercentage } from "@/lib/utils/format";

/**
 * Price display with optional original (compare-at) price struck through, the
 * deadstock "original vs. current" credibility hook. Shows a saved-percentage
 * chip when there's a genuine discount.
 */
export function PriceTag({
  price,
  compareAtPrice,
  size = "md",
  showSaving = true,
}: {
  price: Money;
  compareAtPrice?: Money | null;
  size?: "sm" | "md" | "lg";
  showSaving?: boolean;
}) {
  const saving = discountPercentage(price, compareAtPrice ?? null);

  const priceSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";
  const wasSize = size === "lg" ? "text-base" : "text-xs";

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`font-sans font-extrabold text-ink ${priceSize}`}>
        {formatMoney(price)}
      </span>
      {compareAtPrice && saving !== null && (
        <>
          <span className={`text-plum-soft/70 line-through ${wasSize}`}>
            {formatMoney(compareAtPrice)}
          </span>
          {showSaving && (
            <span className="rounded-pill bg-fuchsia-brand px-2 py-0.5 text-[11px] font-bold text-white">
              −{saving}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
