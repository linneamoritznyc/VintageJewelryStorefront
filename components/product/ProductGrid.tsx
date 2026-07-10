import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "./ProductCard";

/**
 * Responsive, mobile-first product grid. 2 columns on phones, scaling up. No
 * assumptions about how many products it receives.
 */
export function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: Product[];
  /** How many leading cards should load their image eagerly (above the fold). */
  priorityCount?: number;
}) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-plum-soft">
        Inga fynd här just nu — kika in i en annan kategori.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < priorityCount}
        />
      ))}
    </div>
  );
}
