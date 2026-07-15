import type { Money } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/utils/format";

/**
 * Plain price display, tabular numerals in the one house serif.
 *
 * These pieces were never price-marked before liquidation, so there is no
 * documented former retail price to compare against. Per the brand's legal
 * constraints (Prisinformationslagen + the EU Omnibus Directive) an invented
 * "was" price is illegal, so this deliberately never renders a struck-through
 * price or a percentage-off badge. Just the real price, read from Shopify.
 */
export function PriceTag({ price, size = "md" }: { price: Money; size?: "sm" | "md" | "lg" }) {
  const priceSize = size === "lg" ? "text-numeral" : size === "sm" ? "text-body" : "text-sub";

  return <span className={`mono font-normal text-ink ${priceSize}`}>{formatMoney(price)}</span>;
}
