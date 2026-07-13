/**
 * Type definitions that mirror the Shopify Storefront API (GraphQL) response
 * shapes. Components consume ONLY these types, never the mock module directly.
 *
 * When live credentials arrive, the mock client in `mock/index.ts` is replaced
 * by real Storefront API queries that return these same shapes, so component
 * code does not change. See `lib/shopify/index.ts` for the single swap point.
 *
 * Field names and nesting intentionally follow the Storefront API so the
 * mapping later is close to 1:1. A few storefront-specific pieces of content
 * (the per-product vintage story) map to Shopify **metafields** and are noted
 * inline.
 */

export interface Money {
  /** Decimal string, e.g. "90.00", matches Storefront API `MoneyV2.amount`. */
  amount: string;
  /** ISO currency code, e.g. "SEK". */
  currencyCode: string;
}

export interface Image {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductOption {
  id: string;
  name: string;
  /** Distinct values available for this option, e.g. ["Guld", "Silver"]. */
  values: string[];
}

export interface ProductVariant {
  id: string;
  /** Stock-keeping unit, e.g. "ORH-001". Used in Product structured data. */
  sku: string;
  title: string;
  availableForSale: boolean;
  /** Storefront API `quantityAvailable`. Drives the low-stock indicator. */
  quantityAvailable: number;
  selectedOptions: SelectedOption[];
  price: Money;
  /** Original retail (deadstock hook). `null` when no compare-at is set. */
  compareAtPrice: Money | null;
  image: Image | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  /** Brand / Shopify vendor, e.g. "Vintage Fynd". Used in structured data. */
  vendor: string;
  /** Plain-text description. */
  description: string;
  /** HTML description as returned by the Storefront API. */
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: Image;
  images: Image[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money | null;
    maxVariantPrice: Money | null;
  };
  /** Collection handles this product belongs to. */
  collections: string[];
  tags: string[];
  /** ISO timestamp used for "newest" sort and latest-finds carousel. */
  createdAt: string;

  /* --- custom metafields (flattened onto the product so components do not
     need to know these come from metafields). In live Shopify these are
     product metafields in namespace `custom`, each exposed to the Storefront
     API. See lib/shopify/live/queries.ts. --- */

  /** "Om denna vintage-pärla" copy. Metafield `custom.vintage_blurb`. */
  vintageBlurb: string;
  /**
   * Original retail price for honest "was/now" comparison. Metafield
   * `custom.original_retail`. `null` when unknown, in which case NO original
   * price is shown (honesty rule). Mirrors the standard compareAtPrice fields.
   */
  originalRetail: Money | null;
  /** Dropshipped accessory (from Asia). Metafield `custom.is_dropship`. */
  isDropship: boolean;
  /** Customs note shown on dropship products. Metafield `custom.customs_note`. */
  customsNote: string | null;
  /** Optional source lot/parti the piece came from. Metafield `custom.source_lot`. */
  sourceLot: string | null;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
}

/* ------------------------------------------------------------------ */
/* Static content: Shopify Pages and the Blog                          */
/* ------------------------------------------------------------------ */

/** A static Shopify Page (Storefront API `page(handle:)`). */
export interface StorePage {
  handle: string;
  title: string;
  bodyHtml: string;
}

/** A published blog article (Storefront API `blog(handle:) { articles }`). */
export interface BlogArticle {
  handle: string;
  title: string;
  bodyHtml: string;
  summaryHtml: string;
  /** ISO timestamp. */
  publishedAt: string;
}

/* ------------------------------------------------------------------ */
/* Cart shapes (mirror Storefront API Cart / CartLine / CartLineInput)  */
/* ------------------------------------------------------------------ */

export interface CartLineMerchandise {
  variantId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
  quantityAvailable: number;
  /**
   * Set when this line was added via "Skapa ditt eget paket". Each piece is a
   * REAL product variant line (real price, real stock), the automatic
   * 15%-off-3-or-more discount applies the same way it would to any 3+ item
   * cart. `bundleId` is purely a display tag (groups the pieces visually in
   * the cart), not a pricing mechanism, once live this maps to a Shopify
   * cart line attribute.
   */
  bundleId?: string;
}

export interface CartLine {
  /** Client-side line id. Maps to Storefront API `CartLine.id` once live. */
  id: string;
  quantity: number;
  merchandise: CartLineMerchandise;
}

export interface AppliedDiscount {
  /** Empty string for the automatic discount (no customer-entered code). */
  code: string;
  /** Percentage off, e.g. 10 for 10%. */
  percentage: number;
  title: string;
  /**
   * True for the automatic "3+ items" bundle discount (no code, cannot be
   * manually removed by the customer). False for a code the customer typed.
   */
  isAutomatic?: boolean;
}

export interface Cart {
  id: string | null;
  lines: CartLine[];
  /** Sum of line prices before discount. */
  subtotal: Money;
  /** Total after applied discount. */
  total: Money;
  discount: AppliedDiscount | null;
  /** Total number of individual items (sum of quantities). */
  totalQuantity: number;
  /** Populated once a Shopify cart exists; the hosted-checkout redirect URL. */
  checkoutUrl: string | null;
}
