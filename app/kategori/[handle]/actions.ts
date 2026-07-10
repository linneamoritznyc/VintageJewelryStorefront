"use server";

import { store, type ProductSortKey } from "@/lib/shopify";

/**
 * Server action backing the category "Ladda fler" (load more) button. Keeping
 * data fetching on the server means the live Storefront API token never reaches
 * the client, and it goes through the same `store` swap point.
 */
export async function loadMoreProductsAction(input: {
  collection: string;
  sort: ProductSortKey;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  pageSize: number;
}) {
  const result = await store.getProducts(input);
  return {
    products: result.products,
    hasNextPage: result.hasNextPage,
    page: result.page,
  };
}
