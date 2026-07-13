import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { PriceTag } from "@/components/ui/PriceTag";
import { productStockStatus } from "@/lib/utils/stock";
import { lotNumber } from "@/lib/utils/lot";

/**
 * Product card in the "Lagret" catalogue format: square image on sunk paper,
 * a 1px rule, then a stock record. The lot line carries the inventory voice;
 * "N KVAR" turns red (signal) only when genuinely low. Serif name, mono price,
 * a quiet "Aldrig buren" condition line. No struck price, no ratings.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const stock = productStockStatus(product.variants);
  const lot = lotNumber(product.handle);

  return (
    <Link
      href={`/produkt/${product.handle}`}
      className="group block focus-visible:outline-none"
    >
      <div className="relative aspect-square overflow-hidden bg-paper-sunk ring-1 ring-rule">
        <ProductImage
          image={product.featuredImage}
          className="h-full w-full transition-transform duration-200 ease-out group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />
      </div>
      <div className="border-t border-rule pt-2">
        <p className="meta text-ink-faint">
          LOT {lot}
          {stock.shortLabel && (
            <span
              className={stock.isLow ? "text-signal" : "text-ink-faint"}
            >
              {" · "}
              {stock.shortLabel}
            </span>
          )}
        </p>
        <h3 className="mt-1.5 font-display text-base leading-snug text-ink group-hover:underline group-hover:decoration-rule group-hover:underline-offset-4">
          {product.title}
        </h3>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <PriceTag price={product.priceRange.minVariantPrice} size="sm" />
          <span className="text-xs text-ink-faint">Aldrig buren</span>
        </div>
      </div>
    </Link>
  );
}
