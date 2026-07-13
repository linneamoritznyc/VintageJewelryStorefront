import type { Money } from "@/lib/shopify/types";
import { formatMoney, discountPercentage } from "@/lib/utils/format";

/**
 * Price display with optional original (compare-at) price struck through, the
 * deadstock "original vs. current" credibility hook. The saving is shown in
 * kronor (concrete beats percent), only when compare-at data is genuine.
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
  const savedKr =
    compareAtPrice && saving !== null
      ? Math.round(parseFloat(compareAtPrice.amount) - parseFloat(price.amount))
      : null;

  const priceSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";
  const wasSize = size === "lg" ? "text-base" : "text-xs";

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`font-sans font-semibold text-ink ${priceSize}`}>
        {formatMoney(price)}
      </span>
      {compareAtPrice && savedKr !== null && savedKr > 0 && (
        <>
          <span className={`text-plum-soft/70 line-through ${wasSize}`}>
            {formatMoney(compareAtPrice)}
          </span>
          {showSaving && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-fuchsia-deep">
              Spara {savedKr} kr
            </span>
          )}
        </>
      )}
    </div>
  );
}
