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
      className="group flex flex-col border border-line bg-bg transition-colors hover:border-ink focus-visible:border-ink focus-visible:outline-none"
    >
      <div className="relative aspect-[4/5] bg-bg-tile">
        <ProductImage
          image={product.featuredImage}
          className="h-full w-full transition-transform duration-200 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3 py-3">
        <h3 className="line-clamp-2 text-body leading-tight text-ink">{product.title}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <PriceTag price={product.priceRange.minVariantPrice} size="sm" />
          <StockBadge status={stock} />
        </div>
      </div>
    </Link>
  );
}
