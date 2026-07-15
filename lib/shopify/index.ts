/**
 * ============================================================================
 * STOREFRONT DATA, THE SINGLE SWAP POINT
 * ============================================================================
 *
 * Every component/page imports the `store` object from here and calls
 * `store.getProducts()`, `store.getProduct()`, etc. Nothing imports Shopify or
 * the mock directly.
 *
 * The implementation is chosen by an env flag, with a safety net:
 *   NEXT_PUBLIC_USE_MOCK=true   → mock data (default; no credentials needed)
 *   NEXT_PUBLIC_USE_MOCK=false  → live Storefront API, BUT only when the
 *                                 credentials actually exist. If the flag is
 *                                 flipped to live without a token, we fall back
 *                                 to mock instead of crashing the build/runtime.
 *
 * Going live is therefore: implement `live/client.ts`, set the flag to false,
 * and provide credentials in `.env` (SHOPIFY_STORE_DOMAIN,
 * SHOPIFY_STOREFRONT_API_TOKEN, SHOPIFY_STOREFRONT_API_VERSION=2026-07). The
 * store upgrades to live data automatically once those are present. Component
 * code does not change.
 * ============================================================================
 */
import type { StoreClient } from "./client";
import { mockClient } from "./mock/client";
import { liveClient } from "./live/client";

// Live is used ONLY when explicitly enabled AND the Storefront credentials are
// present. Otherwise mock, so a missing token can never fail the build (which
// runs generateStaticParams) or 500 the live site, it just serves mock data.
const liveRequested = process.env.NEXT_PUBLIC_USE_MOCK === "false";
const hasLiveCredentials = Boolean(
  process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_API_TOKEN,
);
const useLive = liveRequested && hasLiveCredentials;

if (liveRequested && !hasLiveCredentials) {
  console.warn(
    "[shopify] NEXT_PUBLIC_USE_MOCK=false but SHOPIFY_STORE_DOMAIN / " +
      "SHOPIFY_STOREFRONT_API_TOKEN are not set. Falling back to mock data. " +
      "Add the credentials in your environment to serve live Shopify data.",
  );
}

export const store: StoreClient = useLive ? liveClient : mockClient;

export * from "./types";
export type { StoreClient, ProductSortKey, ProductQueryOptions, ProductConnection } from "./client";
