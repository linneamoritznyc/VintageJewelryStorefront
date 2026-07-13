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
      className="group flex flex-col focus-visible:outline-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-sand/50 ring-1 ring-ink/5 transition group-hover:ring-ink/15 group-focus-visible:ring-2 group-focus-visible:ring-fuchsia-brand">
        <ProductImage
          image={product.featuredImage}
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />
        {stock.label && (
          <div className="absolute left-2 top-2">
            <StockBadge status={stock} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink">
          {product.title}
        </h3>
        <PriceTag
          price={product.priceRange.minVariantPrice}
          compareAtPrice={product.compareAtPriceRange.minVariantPrice}
          size="sm"
        />
      </div>
    </Link>
  );
}
