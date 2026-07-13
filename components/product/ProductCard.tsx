import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { PriceTag } from "@/components/ui/PriceTag";
import { StockBadge } from "@/components/ui/StockBadge";
import { productStockStatus } from "@/lib/utils/stock";
import { formatLot } from "@/lib/utils/format";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const stock = productStockStatus(product.variants);
  const lot = formatLot(product.lotNumber);

  return (
    <Link
      href={`/produkt/${product.handle}`}
      className="group flex flex-col border border-rule bg-paper-raised transition-colors hover:border-ink focus-visible:border-ink focus-visible:outline-none"
    >
      <div className="relative aspect-square bg-paper-sunk">
        <ProductImage
          image={product.featuredImage}
          className="h-full w-full transition-transform duration-200 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-rule p-3">
        <div className="flex items-baseline justify-between gap-2">
          {lot && <span className="meta">{lot}</span>}
          <StockBadge status={stock} />
        </div>
        <h3 className="line-clamp-2 font-display text-base leading-tight text-ink">
          {product.title}
        </h3>
        <div className="mt-auto pt-1">
          <PriceTag price={product.priceRange.minVariantPrice} size="sm" />
        </div>
      </div>
    </Link>
  );
}
