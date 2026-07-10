/**
 * ============================================================================
 * STOREFRONT DATA API — THE SINGLE SWAP POINT
 * ============================================================================
 *
 * The entire app imports its commerce data from THIS module and nowhere else.
 * Today it re-exports the mock implementation. When live Shopify Storefront API
 * credentials exist, implement the same function signatures against the real
 * GraphQL API (in e.g. `./storefront-client.ts`) and change the re-export below
 * to point at it. Component code does not change.
 *
 * Environment variables the live client will need (see `.env.example`):
 *   SHOPIFY_STORE_DOMAIN          e.g. your-store.myshopify.com
 *   SHOPIFY_STOREFRONT_API_TOKEN  Storefront API public access token
 *   SHOPIFY_STOREFRONT_API_VERSION e.g. 2025-01
 *
 * Migration checklist:
 *   1. Implement getProducts/getProduct/getCollection(s)/getLatestProducts/
 *      getAllProducts/getProductsByHandles against the Storefront API, returning
 *      the types in `./types.ts`.
 *   2. Map the per-product vintage story from the `story.body` metafield.
 *   3. Wire real cart mutations (cartCreate / cartLinesAdd / cartLinesUpdate /
 *      cartLinesRemove / cartDiscountCodesUpdate) in `lib/cart/` — the cart
 *      context already models the Storefront Cart shape.
 *   4. Point `checkoutUrl` at the real `cart.checkoutUrl` from Shopify.
 * ============================================================================
 */

export * from "./types";
export type {
  ProductSortKey,
  ProductQueryOptions,
  ProductConnection,
} from "./mock";

export {
  getCollections,
  getCollection,
  getProducts,
  getProduct,
  getProductsByHandles,
  getLatestProducts,
  getAllProducts,
} from "./mock";

// When live, replace the line above with:
// export { ... } from "./storefront-client";
