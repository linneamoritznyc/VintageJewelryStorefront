import type { Money } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/utils/format";

/**
 * Plain price display, mono, the record voice.
 *
 * These pieces were never price-marked before liquidation, so there is no
 * documented former retail price to compare against. Per the design brief
 * (Prisinformationslagen + the EU Omnibus Directive) an invented "was" price
 * is illegal, so this deliberately never renders a struck-through price or a
 * percentage-off badge. Just the real price.
 */
export function PriceTag({
  price,
  size = "md",
}: {
  price: Money;
  size?: "sm" | "md" | "lg";
}) {
  const priceSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";

  return (
    <span className={`mono font-medium text-ink ${priceSize}`}>
      {formatMoney(price)}
    </span>
  );
}
