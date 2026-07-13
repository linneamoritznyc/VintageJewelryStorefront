import type { Money } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/utils/format";

/**
 * Price display in the inventory voice: mono, so it reads as a record rather
 * than a marketing number.
 *
 * No struck-through "original" price is ever shown. Swedish Prisinformationslag
 * and the EU Omnibus Directive make invented before-prices illegal, and no
 * documented former retail price exists for this deadstock, so the figure is
 * omitted entirely. The `compareAtPrice` prop is accepted for call-site
 * compatibility but intentionally not rendered.
 */
export function PriceTag({
  price,
  size = "md",
}: {
  price: Money;
  compareAtPrice?: Money | null;
  size?: "sm" | "md" | "lg";
  showSaving?: boolean;
}) {
  const priceSize =
    size === "lg" ? "text-xl" : size === "sm" ? "text-sm" : "text-base";

  return (
    <span className={`font-mono font-medium tabular-nums text-ink ${priceSize}`}>
      {formatMoney(price)}
    </span>
  );
}
