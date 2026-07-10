import type {
  StoreClient,
  ProductQueryOptions,
  ProductConnection,
} from "../client";
import type { Cart, Collection, Product } from "../types";

/**
 * ============================================================================
 * LIVE Storefront API client, STUB (fill in when credentials exist)
 * ============================================================================
 *
 * This is the ONLY file to implement to go live. The env flag in
 * `lib/shopify/index.ts` (NEXT_PUBLIC_USE_MOCK) selects mock vs live; when
 * `false`, the app uses this client. Until then every method throws a clear
 * error so a misconfiguration is obvious rather than silent.
 *
 * Implementation notes:
 *  - Use SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_API_TOKEN and
 *    SHOPIFY_STOREFRONT_API_VERSION (2026-07) from the environment.
 *  - POST GraphQL from `./queries` to
 *    https://{domain}/api/{version}/graphql.json with header
 *    `X-Shopify-Storefront-Access-Token`.
 *  - Map responses to the types in `../types`, flattening the metafields
 *    (vintage_story → vintageBlurb, original_retail → originalRetail, etc.).
 *  - CART METHODS MUST RUN SERVER-SIDE so the token never reaches the browser.
 *    Invoke them from server actions / route handlers, not client components.
 * ============================================================================
 */

const NOT_CONFIGURED =
  "Live Shopify client is not implemented yet. Set NEXT_PUBLIC_USE_MOCK=true to use mock data, or implement lib/shopify/live/client.ts with real Storefront API credentials.";

function notConfigured(): never {
  throw new Error(NOT_CONFIGURED);
}

export const liveClient: StoreClient = {
  async getCollections(): Promise<Collection[]> {
    return notConfigured();
  },
  async getCollection(): Promise<Collection | null> {
    return notConfigured();
  },
  async getProducts(_options?: ProductQueryOptions): Promise<ProductConnection> {
    return notConfigured();
  },
  async getProduct(): Promise<Product | null> {
    return notConfigured();
  },
  async getProductsByHandles(): Promise<Product[]> {
    return notConfigured();
  },
  async getLatestProducts(): Promise<Product[]> {
    return notConfigured();
  },
  async getAllProducts(): Promise<Product[]> {
    return notConfigured();
  },
  async createCart(): Promise<Cart> {
    return notConfigured();
  },
  async getCart(): Promise<Cart | null> {
    return notConfigured();
  },
  async addLine(): Promise<Cart> {
    return notConfigured();
  },
  async updateLine(): Promise<Cart> {
    return notConfigured();
  },
  async removeLine(): Promise<Cart> {
    return notConfigured();
  },
  async applyDiscount(): Promise<Cart> {
    return notConfigured();
  },
};
