import type {
  StoreClient,
  ProductQueryOptions,
  ProductConnection,
  ProductSortKey,
} from "../client";
import type {
  BlogArticle,
  Cart,
  CartLine,
  Collection,
  Image,
  Money,
  Product,
  ProductVariant,
  StorePage,
} from "../types";
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  COLLECTION_PRODUCTS_QUERY,
  PAGE_BY_HANDLE_QUERY,
  BLOG_ARTICLES_QUERY,
  CART_CREATE,
  CART_QUERY,
  CART_LINES_ADD,
  CART_LINES_UPDATE,
  CART_LINES_REMOVE,
  CART_DISCOUNT_CODES_UPDATE,
} from "./queries";

/** The store's single blog handle (see lib/shopify/README.md). */
const BLOG_HANDLE = "news";

/**
 * ============================================================================
 * LIVE Storefront API client
 * ============================================================================
 * Selected when NEXT_PUBLIC_USE_MOCK=false. This module must stay
 * SERVER-ONLY: `store` is imported only from Server Components, Server
 * Actions, and generateMetadata/generateStaticParams, never from a "use
 * client" file. Do not import it (as a value, not just a type) from a client
 * component, doing so would bundle this file's env reads into client-side
 * JS and ship the token to every visitor's browser.
 *
 * Env (both names read for compatibility; either works):
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN / SHOPIFY_STORE_DOMAIN
 *     your-store.myshopify.com
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN / SHOPIFY_STOREFRONT_API_TOKEN
 *     Storefront API public access token
 *   SHOPIFY_STOREFRONT_API_VERSION
 *     defaults to 2026-07
 *
 * Note on the NEXT_PUBLIC_ names: despite the prefix, the token never reaches
 * the browser AS LONG AS this file is only ever imported server-side (see
 * above), Next.js only inlines NEXT_PUBLIC_ vars into bundles that actually
 * reference them, and none of the client components in this app do. Using
 * SHOPIFY_STOREFRONT_API_TOKEN (no prefix) instead removes any doubt and is
 * recommended if you're setting this up fresh; both are supported here so
 * either Vercel configuration works without code changes.
 *
 * Field names follow the 2026-07 Storefront schema (see ./queries). If Shopify
 * renames a field in a future version, adjust it there + the mappers below;
 * nothing else changes.
 * ============================================================================
 */

const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-07";

const STORE_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || process.env.SHOPIFY_STOREFRONT_API_TOKEN;

function endpoint(): string {
  if (!STORE_DOMAIN) {
    throw new Error(
      "No Shopify store domain set. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN (or SHOPIFY_STORE_DOMAIN) or use NEXT_PUBLIC_USE_MOCK=true.",
    );
  }
  return `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;
}

async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!STOREFRONT_TOKEN) {
    throw new Error(
      "No Shopify Storefront token set. Set NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN (or SHOPIFY_STOREFRONT_API_TOKEN) or use NEXT_PUBLIC_USE_MOCK=true.",
    );
  }

  const res = await fetch(endpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    // Cache product/collection reads briefly; cart mutations pass no-store.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Storefront API HTTP ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) {
    throw new Error(`Storefront API errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}

/* ------------------------------- mappers -------------------------------- */

function mapMoney(m: { amount: string; currencyCode: string } | null): Money | null {
  return m ? { amount: m.amount, currencyCode: m.currencyCode } : null;
}

function requireMoney(m: { amount: string; currencyCode: string }): Money {
  return { amount: m.amount, currencyCode: m.currencyCode };
}

function mapImage(img: RawImage | null): Image | null {
  if (!img) return null;
  return {
    url: img.url,
    altText: img.altText ?? null,
    width: img.width ?? 0,
    height: img.height ?? 0,
  };
}

/** Parse a Shopify "money" metafield value (JSON or a plain decimal). */
function parseMoneyMetafield(value: string | undefined | null): Money | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as { amount?: string; currency_code?: string };
    if (parsed && parsed.amount) {
      return { amount: parsed.amount, currencyCode: parsed.currency_code ?? "SEK" };
    }
  } catch {
    // not JSON, fall through to decimal parse
  }
  const n = Number(value);
  return Number.isFinite(n) ? { amount: n.toFixed(2), currencyCode: "SEK" } : null;
}

function metafieldValue(mf: { value: string } | null | undefined): string | null {
  return mf?.value ?? null;
}

function mapVariant(v: RawVariant): ProductVariant {
  return {
    id: v.id,
    title: v.title,
    availableForSale: v.availableForSale,
    quantityAvailable: v.quantityAvailable ?? 0,
    selectedOptions: v.selectedOptions ?? [],
    price: requireMoney(v.price),
    compareAtPrice: mapMoney(v.compareAtPrice),
    image: mapImage(v.image),
  };
}

function mapProduct(p: RawProduct): Product {
  const images = (p.images?.nodes ?? []).map((i) => mapImage(i)!).filter(Boolean);
  const featuredImage =
    mapImage(p.featuredImage) ?? images[0] ?? {
      url: "",
      altText: p.title,
      width: 0,
      height: 0,
    };

  const originalRetail =
    parseMoneyMetafield(metafieldValue(p.originalRetail)) ??
    mapMoney(p.compareAtPriceRange?.minVariantPrice ?? null);

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description ?? "",
    descriptionHtml: p.descriptionHtml ?? "",
    availableForSale: p.availableForSale,
    featuredImage,
    images: images.length > 0 ? images : [featuredImage],
    // Shopify represents a single-variant product with one synthetic option
    // named "Title" whose only value is "Default Title". Drop it so those
    // products render with no option selector (matching the mock catalog),
    // rather than a pointless "Title: Default Title" picker. `values` is
    // deprecated on ProductOption, so read the values off `optionValues`.
    options: (p.options ?? [])
      .map((o) => ({ id: o.id, name: o.name, values: o.optionValues.map((v) => v.name) }))
      .filter((o) => !(o.values.length === 1 && o.values[0] === "Default Title")),
    variants: (p.variants?.nodes ?? []).map(mapVariant),
    priceRange: {
      minVariantPrice: requireMoney(p.priceRange.minVariantPrice),
      maxVariantPrice: requireMoney(p.priceRange.maxVariantPrice),
    },
    compareAtPriceRange: {
      minVariantPrice: mapMoney(p.compareAtPriceRange?.minVariantPrice ?? null),
      maxVariantPrice: mapMoney(p.compareAtPriceRange?.maxVariantPrice ?? null),
    },
    collections: (p.collections?.nodes ?? []).map((c) => c.handle),
    tags: p.tags ?? [],
    createdAt: p.createdAt,
    vintageBlurb: metafieldValue(p.vintageBlurb) ?? "",
    originalRetail,
    isDropship: metafieldValue(p.isDropship) === "true",
    customsNote: metafieldValue(p.customsNote),
    sourceLot: metafieldValue(p.sourceLot),
  };
}

function mapPage(p: RawPage): StorePage {
  return { handle: p.handle, title: p.title, bodyHtml: p.body };
}

function mapArticle(a: RawArticle): BlogArticle {
  return {
    handle: a.handle,
    title: a.title,
    bodyHtml: a.contentHtml,
    summaryHtml: a.excerptHtml ?? "",
    publishedAt: a.publishedAt,
  };
}

function mapCollection(c: RawCollection): Collection {
  return {
    id: c.id,
    handle: c.handle,
    title: c.title,
    description: c.description ?? "",
    image: mapImage(c.image),
  };
}

function mapCart(c: RawCart): Cart {
  const lines: CartLine[] = (c.lines?.nodes ?? []).map((l) => {
    const m = l.merchandise;
    return {
      id: l.id,
      quantity: l.quantity,
      merchandise: {
        variantId: m.id,
        productHandle: m.product?.handle ?? "",
        productTitle: m.product?.title ?? "",
        variantTitle: m.title,
        selectedOptions: m.selectedOptions ?? [],
        price: requireMoney(m.price),
        compareAtPrice: mapMoney(m.compareAtPrice),
        image: mapImage(m.image),
        quantityAvailable: m.quantityAvailable ?? 0,
      },
    };
  });

  const subtotal = requireMoney(c.cost.subtotalAmount);
  const total = requireMoney(c.cost.totalAmount);
  const appliedCode = (c.discountCodes ?? []).find((d) => d.applicable)?.code ?? null;
  const sub = Number(subtotal.amount);
  const tot = Number(total.amount);
  const discount =
    appliedCode && sub > tot
      ? {
          code: appliedCode,
          percentage: Math.round(((sub - tot) / sub) * 100),
          title: appliedCode,
        }
      : null;

  return {
    id: c.id,
    lines,
    subtotal,
    total,
    discount,
    totalQuantity: c.totalQuantity,
    checkoutUrl: c.checkoutUrl,
  };
}

/* ------------------------------ sort mapping ---------------------------- */

function productsSort(sort: ProductSortKey): { sortKey: string; reverse: boolean } {
  switch (sort) {
    case "PRICE_ASC":
      return { sortKey: "PRICE", reverse: false };
    case "PRICE_DESC":
      return { sortKey: "PRICE", reverse: true };
    case "NEWEST":
    default:
      return { sortKey: "CREATED_AT", reverse: true };
  }
}

function collectionSort(sort: ProductSortKey): { sortKey: string; reverse: boolean } {
  switch (sort) {
    case "PRICE_ASC":
      return { sortKey: "PRICE", reverse: false };
    case "PRICE_DESC":
      return { sortKey: "PRICE", reverse: true };
    case "NEWEST":
    default:
      return { sortKey: "CREATED", reverse: true };
  }
}

/* ------------------------------ the client ------------------------------ */

export const liveClient: StoreClient = {
  async getCollections(): Promise<Collection[]> {
    const data = await storefront<{ collections: { nodes: RawCollection[] } }>(
      COLLECTIONS_QUERY,
      { first: 50 },
    );
    return data.collections.nodes.map(mapCollection);
  },

  async getCollection(handle: string): Promise<Collection | null> {
    const all = await this.getCollections();
    return all.find((c) => c.handle === handle) ?? null;
  },

  async getProducts(options: ProductQueryOptions = {}): Promise<ProductConnection> {
    const {
      collection,
      sort = "NEWEST",
      minPrice,
      maxPrice,
      page = 1,
      pageSize = 12,
    } = options;

    // The interface is page-based; the Storefront API is cursor-based. Walk
    // cursors until we have enough items for the requested page.
    const needed = page * pageSize;
    const collected: Product[] = [];
    let after: string | null = null;
    let hasNextPage = true;

    while (collected.length < needed && hasNextPage) {
      const take = Math.min(50, needed - collected.length);
      if (collection) {
        const { sortKey, reverse } = collectionSort(sort);
        const data: { collection: { products: RawProductConnection } | null } =
          await storefront(COLLECTION_PRODUCTS_QUERY, {
            handle: collection,
            first: take,
            sortKey,
            reverse,
            after,
          });
        const conn: RawProductConnection | undefined = data.collection?.products;
        if (!conn) break;
        collected.push(...conn.nodes.map(mapProduct));
        hasNextPage = conn.pageInfo.hasNextPage;
        after = conn.pageInfo.endCursor;
      } else {
        const { sortKey, reverse } = productsSort(sort);
        const data: { products: RawProductConnection } = await storefront(PRODUCTS_QUERY, {
          first: take,
          sortKey,
          reverse,
          after,
        });
        collected.push(...data.products.nodes.map(mapProduct));
        hasNextPage = data.products.pageInfo.hasNextPage;
        after = data.products.pageInfo.endCursor;
      }
    }

    // Price filters are applied client-side (Storefront query filters are
    // limited); keeps behaviour identical to the mock.
    let filtered = collected;
    if (typeof minPrice === "number") {
      filtered = filtered.filter((p) => Number(p.priceRange.minVariantPrice.amount) >= minPrice);
    }
    if (typeof maxPrice === "number") {
      filtered = filtered.filter((p) => Number(p.priceRange.minVariantPrice.amount) <= maxPrice);
    }

    const start = (page - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    return {
      products: pageItems,
      totalCount: filtered.length,
      page,
      pageSize,
      hasNextPage: hasNextPage || filtered.length > start + pageSize,
    };
  },

  async getProduct(handle: string): Promise<Product | null> {
    const data = await storefront<{ product: RawProduct | null }>(PRODUCT_BY_HANDLE_QUERY, {
      handle,
    });
    return data.product ? mapProduct(data.product) : null;
  },

  async getProductsByHandles(handles: string[]): Promise<Product[]> {
    const results = await Promise.all(handles.map((h) => this.getProduct(h)));
    return results.filter((p): p is Product => p !== null);
  },

  async getLatestProducts(limit = 10): Promise<Product[]> {
    const { products } = await this.getProducts({ sort: "NEWEST", page: 1, pageSize: limit });
    return products;
  },

  async getAllProducts(): Promise<Product[]> {
    const all: Product[] = [];
    let page = 1;
    // Walk pages until exhausted (cap to avoid runaway on huge catalogs).
    for (let i = 0; i < 40; i += 1) {
      const conn = await this.getProducts({ page, pageSize: 50 });
      all.push(...conn.products);
      if (!conn.hasNextPage) break;
      page += 1;
    }
    return all;
  },

  /* --- static content: pages + blog --- */

  async getPage(handle: string): Promise<StorePage | null> {
    const data = await storefront<{ page: RawPage | null }>(PAGE_BY_HANDLE_QUERY, { handle });
    return data.page ? mapPage(data.page) : null;
  },

  async getBlogArticles(): Promise<BlogArticle[]> {
    const data = await storefront<{ blog: { articles: { nodes: RawArticle[] } } | null }>(
      BLOG_ARTICLES_QUERY,
      { handle: BLOG_HANDLE, first: 50 },
    );
    return (data.blog?.articles.nodes ?? []).map(mapArticle);
  },

  async getBlogArticle(handle: string): Promise<BlogArticle | null> {
    const all = await this.getBlogArticles();
    return all.find((a) => a.handle === handle) ?? null;
  },

  /* --- cart --- */

  async createCart(): Promise<Cart> {
    const data = await storefront<{ cartCreate: { cart: RawCart } }>(CART_CREATE);
    return mapCart(data.cartCreate.cart);
  },

  async getCart(cartId: string): Promise<Cart | null> {
    const data = await storefront<{ cart: RawCart | null }>(CART_QUERY, { id: cartId });
    return data.cart ? mapCart(data.cart) : null;
  },

  async addLine(cartId: string, variantId: string, quantity: number): Promise<Cart> {
    const data = await storefront<{ cartLinesAdd: { cart: RawCart } }>(CART_LINES_ADD, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    });
    return mapCart(data.cartLinesAdd.cart);
  },

  async updateLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
    const data = await storefront<{ cartLinesUpdate: { cart: RawCart } }>(CART_LINES_UPDATE, {
      cartId,
      lines: [{ id: lineId, quantity }],
    });
    return mapCart(data.cartLinesUpdate.cart);
  },

  async removeLine(cartId: string, lineId: string): Promise<Cart> {
    const data = await storefront<{ cartLinesRemove: { cart: RawCart } }>(CART_LINES_REMOVE, {
      cartId,
      lineIds: [lineId],
    });
    return mapCart(data.cartLinesRemove.cart);
  },

  async applyDiscount(cartId: string, code: string): Promise<Cart> {
    const data = await storefront<{ cartDiscountCodesUpdate: { cart: RawCart } }>(
      CART_DISCOUNT_CODES_UPDATE,
      { cartId, codes: code ? [code] : [] },
    );
    return mapCart(data.cartDiscountCodesUpdate.cart);
  },
};

/* --------------------------- raw response types ------------------------- */

interface RawImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}
interface RawMoney {
  amount: string;
  currencyCode: string;
}
interface RawVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: { name: string; value: string }[];
  price: RawMoney;
  compareAtPrice: RawMoney | null;
  image: RawImage | null;
}
interface RawProduct {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  descriptionHtml: string | null;
  availableForSale: boolean;
  createdAt: string;
  tags: string[];
  featuredImage: RawImage | null;
  images: { nodes: RawImage[] } | null;
  options: { id: string; name: string; optionValues: { name: string }[] }[];
  priceRange: { minVariantPrice: RawMoney; maxVariantPrice: RawMoney };
  compareAtPriceRange: { minVariantPrice: RawMoney | null; maxVariantPrice: RawMoney | null } | null;
  collections: { nodes: { handle: string }[] } | null;
  variants: { nodes: RawVariant[] } | null;
  vintageBlurb: { value: string } | null;
  originalRetail: { value: string } | null;
  isDropship: { value: string } | null;
  customsNote: { value: string } | null;
  sourceLot: { value: string } | null;
}
interface RawPage {
  handle: string;
  title: string;
  body: string;
}
interface RawArticle {
  handle: string;
  title: string;
  contentHtml: string;
  excerptHtml: string | null;
  publishedAt: string;
}
interface RawProductConnection {
  nodes: RawProduct[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}
interface RawCollection {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  image: RawImage | null;
}
interface RawCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: RawMoney; totalAmount: RawMoney };
  discountCodes: { code: string; applicable: boolean }[];
  lines: {
    nodes: {
      id: string;
      quantity: number;
      merchandise: RawVariant & { product: { handle: string; title: string } | null };
    }[];
  } | null;
}
