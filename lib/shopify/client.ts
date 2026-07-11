import type { Cart, Collection, Product } from "./types";

/**
 * The commerce data contract. NO component imports Shopify (or the mock)
 * directly, everything goes through a `StoreClient`. `lib/shopify/index.ts`
 * picks the mock or live implementation from an env flag, so going live is a
 * change to the flag + `live/client.ts`, nothing in component code.
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
  /** Total matching products (before pagination). */
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface StoreClient {
  /* --- catalog reads --- */
  getCollections(): Promise<Collection[]>;
  getCollection(handle: string): Promise<Collection | null>;
  getProducts(options?: ProductQueryOptions): Promise<ProductConnection>;
  getProduct(handle: string): Promise<Product | null>;
  getProductsByHandles(handles: string[]): Promise<Product[]>;
  getLatestProducts(limit?: number): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;

  /* --- cart (mirrors Storefront API cart mutations) ---
     In live Shopify these run server-side (the token must never reach the
     browser) and return a Cart whose `checkoutUrl` is the hosted checkout. */
  createCart(): Promise<Cart>;
  getCart(cartId: string): Promise<Cart | null>;
  addLine(cartId: string, variantId: string, quantity: number): Promise<Cart>;
  updateLine(cartId: string, lineId: string, quantity: number): Promise<Cart>;
  removeLine(cartId: string, lineId: string): Promise<Cart>;
  applyDiscount(cartId: string, code: string): Promise<Cart>;
}
