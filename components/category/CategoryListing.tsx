"use client";

import { useState, useTransition } from "react";
import type { Product } from "@/lib/shopify/types";
import type { ProductSortKey } from "@/lib/shopify";
import { ProductGrid } from "@/components/product/ProductGrid";
import { loadMoreProductsAction } from "@/app/kategori/[handle]/actions";

/**
 * Client wrapper that renders the initial (server-fetched) product page and
 * progressively appends more via a server action. The parent keys this
 * component by the active filter signature, so changing sort/price resets it
 * to a fresh page 1.
 */
export function CategoryListing({
  collection,
  initialProducts,
  initialHasNextPage,
  pageSize,
  sort,
  maxPrice,
}: {
  collection: string;
  initialProducts: Product[];
  initialHasNextPage: boolean;
  pageSize: number;
  sort: ProductSortKey;
  maxPrice?: number;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(initialHasNextPage);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    const nextPage = page + 1;
    startTransition(async () => {
      const result = await loadMoreProductsAction({
        collection,
        sort,
        maxPrice,
        page: nextPage,
        pageSize,
      });
      setProducts((prev) => [...prev, ...result.products]);
      setPage(result.page);
      setHasNext(result.hasNextPage);
    });
  }

  return (
    <div className="mt-6">
      <ProductGrid products={products} priorityCount={4} />

      {hasNext && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={isPending}
            className="border border-ink px-8 py-3 text-body text-ink transition hover:bg-ink hover:text-bg disabled:opacity-60"
          >
            {isPending ? "Laddar" : "Ladda fler fynd"}
          </button>
        </div>
      )}
    </div>
  );
}
