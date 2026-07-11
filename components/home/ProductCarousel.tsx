import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/ProductCard";

/**
 * Horizontal, scroll-snapping carousel of products, mobile-first (swipe on
 * touch, scrolls on desktop). Scales to any number of products.
 */
export function ProductCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:gap-4">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="w-40 flex-shrink-0 snap-start sm:w-52"
        >
          <ProductCard product={product} priority={i < 4} />
        </div>
      ))}
    </div>
  );
}
