import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { PriceTag } from "@/components/ui/PriceTag";
import { StockBadge } from "@/components/ui/StockBadge";
import { productStockStatus } from "@/lib/utils/stock";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const stock = productStockStatus(product.variants);

  return (
    <Link
      href={`/produkt/${product.handle}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-brand"
    >
      <div className="relative aspect-square">
        <ProductImage
          image={product.featuredImage}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />
        {stock.label && (
          <div className="absolute left-2 top-2">
            <StockBadge status={stock} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 font-display text-base leading-tight text-ink">
          {product.title}
        </h3>
        <div className="mt-auto">
          <PriceTag
            price={product.priceRange.minVariantPrice}
            compareAtPrice={product.compareAtPriceRange.minVariantPrice}
            size="sm"
          />
        </div>
      </div>
    </Link>
  );
}
