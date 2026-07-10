/**
 * ============================================================================
 * STOREFRONT DATA, THE SINGLE SWAP POINT
 * ============================================================================
 *
 * Every component/page imports the `store` object from here and calls
 * `store.getProducts()`, `store.getProduct()`, etc. Nothing imports Shopify or
 * the mock directly.
 *
 * The implementation is chosen by an env flag:
 *   NEXT_PUBLIC_USE_MOCK=true   → mock data (default; no credentials needed)
 *   NEXT_PUBLIC_USE_MOCK=false  → live Storefront API (lib/shopify/live/client)
 *
 * Going live is therefore: implement `live/client.ts`, set the flag to false,
 * and provide credentials in `.env` (SHOPIFY_STORE_DOMAIN,
 * SHOPIFY_STOREFRONT_API_TOKEN, SHOPIFY_STOREFRONT_API_VERSION=2026-07).
 * Component code does not change.
 * ============================================================================
 */
import type { StoreClient } from "./client";
import { mockClient } from "./mock/client";
import { liveClient } from "./live/client";

// Default to mock unless explicitly disabled, so a fresh checkout "just works".
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export const store: StoreClient = USE_MOCK ? mockClient : liveClient;

export * from "./types";
export type {
  StoreClient,
  ProductSortKey,
  ProductQueryOptions,
  ProductConnection,
} from "./client";
