import type { Money } from "@/lib/shopify/types";

/**
 * Format a Money value as Swedish currency, e.g. "90 kr".
 * Prices are whole-krona in this catalog, so no decimals are shown unless the
 * amount actually has öre.
 */
export function formatMoney(money: Money): string {
  const amount = Number(money.amount);
  const hasOre = Math.round(amount * 100) % 100 !== 0;
  const formatted = new Intl.NumberFormat("sv-SE", {
    minimumFractionDigits: hasOre ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
  // Store currency is SEK; render the Swedish "kr" suffix.
  return money.currencyCode === "SEK" ? `${formatted} kr` : `${formatted} ${money.currencyCode}`;
}

/** Format a plain number of the store currency (SEK) as "199 kr". */
export function formatPrice(amount: number, currencyCode = "SEK"): string {
  return formatMoney({ amount: amount.toFixed(2), currencyCode });
}

/**
 * Percentage saved vs. the original (compare-at) price, rounded. Returns null
 * when there is no valid discount to show.
 */
export function discountPercentage(
  price: Money,
  compareAt: Money | null,
): number | null {
  if (!compareAt) return null;
  const now = Number(price.amount);
  const was = Number(compareAt.amount);
  if (!(was > now) || was <= 0) return null;
  return Math.round(((was - now) / was) * 100);
}
