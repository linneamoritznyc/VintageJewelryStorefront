import type { Collection, Product } from "../types";
import { MOCK_PRODUCTS } from "./products";
import { MOCK_COLLECTIONS } from "./collections";

/**
 * Mock implementation of the storefront data API. Every function is async and
 * returns the same shapes the real Storefront API client will return, so
 * `lib/shopify/index.ts` can swap this module out without touching callers.
 *
 * A tiny artificial delay is included so loading states behave realistically in
 * development.
 */

export type ProductSortKey = "NEWEST" | "PRICE_ASC" | "PRICE_DESC";

export interface ProductQueryOptions {
  /** Collection handle to filter by. Omit for the whole catalog. */
  collection?: string;
  sort?: ProductSortKey;
  minPrice?: number;
  maxPrice?: number;
  /** 1-based page number. */
  page?: number;
  /** Items per page. */
  pageSize?: number;
}

export interface ProductConnection {
  products: Product[];
  /** Total matching products (before pagination). Drives page counts. */
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

const MOCK_LATENCY_MS = 0;

function delay<T>(value: T): Promise<T> {
  if (MOCK_LATENCY_MS <= 0) return Promise.resolve(value);
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

function priceOf(product: Product): number {
  return Number(product.priceRange.minVariantPrice.amount);
}

function applySort(products: Product[], sort: ProductSortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case "PRICE_ASC":
      return copy.sort((a, b) => priceOf(a) - priceOf(b));
    case "PRICE_DESC":
      return copy.sort((a, b) => priceOf(b) - priceOf(a));
    case "NEWEST":
    default:
      return copy.sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      );
  }
}

export async function getCollections(): Promise<Collection[]> {
  return delay(MOCK_COLLECTIONS);
}

export async function getCollection(
  handle: string,
): Promise<Collection | null> {
  return delay(MOCK_COLLECTIONS.find((c) => c.handle === handle) ?? null);
}

export async function getProducts(
  options: ProductQueryOptions = {},
): Promise<ProductConnection> {
  const {
    collection,
    sort = "NEWEST",
    minPrice,
    maxPrice,
    page = 1,
    pageSize = 12,
  } = options;

  let filtered = MOCK_PRODUCTS;

  if (collection) {
    filtered = filtered.filter((p) => p.collections.includes(collection));
  }
  if (typeof minPrice === "number") {
    filtered = filtered.filter((p) => priceOf(p) >= minPrice);
  }
  if (typeof maxPrice === "number") {
    filtered = filtered.filter((p) => priceOf(p) <= maxPrice);
  }

  const sorted = applySort(filtered, sort);
  const totalCount = sorted.length;
  const start = (page - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  return delay({
    products: pageItems,
    totalCount,
    page,
    pageSize,
    hasNextPage: start + pageSize < totalCount,
  });
}

export async function getProduct(handle: string): Promise<Product | null> {
  return delay(MOCK_PRODUCTS.find((p) => p.handle === handle) ?? null);
}

export async function getProductsByHandles(
  handles: string[],
): Promise<Product[]> {
  const set = new Set(handles);
  return delay(MOCK_PRODUCTS.filter((p) => set.has(p.handle)));
}

/** Latest arrivals across the whole catalog, for the homepage carousel. */
export async function getLatestProducts(limit = 10): Promise<Product[]> {
  const sorted = applySort(MOCK_PRODUCTS, "NEWEST");
  return delay(sorted.slice(0, limit));
}

/** All products, unpaginated — used by the bundle builder. */
export async function getAllProducts(): Promise<Product[]> {
  return delay(MOCK_PRODUCTS);
}
