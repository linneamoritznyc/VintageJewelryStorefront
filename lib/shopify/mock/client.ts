import type {
  StoreClient,
  ProductQueryOptions,
  ProductConnection,
  ProductSortKey,
} from "../client";
import type { Cart, CartLine, Collection, Money, Product } from "../types";
import { findCoupon } from "@/lib/config/coupons";
import { MOCK_PRODUCTS } from "./products";
import { MOCK_COLLECTIONS } from "./collections";

/**
 * Mock implementation of StoreClient. Reads from the fixtures and keeps carts
 * in memory. Returns the same shapes the live Storefront client will, so the
 * app behaves identically once `lib/shopify/index.ts` swaps to the live client.
 */

const CURRENCY = "SEK";

function money(amount: number): Money {
  return { amount: amount.toFixed(2), currencyCode: CURRENCY };
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
      return copy.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }
}

/** variantId -> product+variant, for cart line construction. */
const VARIANT_INDEX = new Map<string, { product: Product; variantId: string }>();
for (const product of MOCK_PRODUCTS) {
  for (const variant of product.variants) {
    VARIANT_INDEX.set(variant.id, { product, variantId: variant.id });
  }
}

/* --- in-memory carts --- */
interface StoredCart {
  id: string;
  lines: CartLine[];
  discountCode: string | null;
}
const CARTS = new Map<string, StoredCart>();
let cartSeq = 0;
let lineSeq = 0;

function computeCart(stored: StoredCart): Cart {
  const subtotal = stored.lines.reduce(
    (sum, l) => sum + Number(l.merchandise.price.amount) * l.quantity,
    0,
  );
  const coupon = stored.discountCode ? findCoupon(stored.discountCode) : null;
  const discount = coupon
    ? { code: coupon.code, percentage: coupon.percentage, title: coupon.title }
    : null;
  const total = discount ? subtotal * (1 - discount.percentage / 100) : subtotal;
  return {
    id: stored.id,
    lines: stored.lines,
    subtotal: money(subtotal),
    total: money(total),
    discount,
    totalQuantity: stored.lines.reduce((n, l) => n + l.quantity, 0),
    // Mock has no real hosted checkout; the checkout page shows a clear stub.
    checkoutUrl: null,
  };
}

function requireCart(cartId: string): StoredCart {
  const cart = CARTS.get(cartId);
  if (!cart) throw new Error(`Mock cart not found: ${cartId}`);
  return cart;
}

export const mockClient: StoreClient = {
  async getCollections(): Promise<Collection[]> {
    return MOCK_COLLECTIONS;
  },

  async getCollection(handle: string): Promise<Collection | null> {
    return MOCK_COLLECTIONS.find((c) => c.handle === handle) ?? null;
  },

  async getProducts(options: ProductQueryOptions = {}): Promise<ProductConnection> {
    const { collection, sort = "NEWEST", minPrice, maxPrice, page = 1, pageSize = 12 } = options;

    let filtered = MOCK_PRODUCTS;
    if (collection) filtered = filtered.filter((p) => p.collections.includes(collection));
    if (typeof minPrice === "number") filtered = filtered.filter((p) => priceOf(p) >= minPrice);
    if (typeof maxPrice === "number") filtered = filtered.filter((p) => priceOf(p) <= maxPrice);

    const sorted = applySort(filtered, sort);
    const totalCount = sorted.length;
    const start = (page - 1) * pageSize;
    const pageItems = sorted.slice(start, start + pageSize);

    return {
      products: pageItems,
      totalCount,
      page,
      pageSize,
      hasNextPage: start + pageSize < totalCount,
    };
  },

  async getProduct(handle: string): Promise<Product | null> {
    return MOCK_PRODUCTS.find((p) => p.handle === handle) ?? null;
  },

  async getProductsByHandles(handles: string[]): Promise<Product[]> {
    const set = new Set(handles);
    return MOCK_PRODUCTS.filter((p) => set.has(p.handle));
  },

  async getLatestProducts(limit = 10): Promise<Product[]> {
    return applySort(MOCK_PRODUCTS, "NEWEST").slice(0, limit);
  },

  async getAllProducts(): Promise<Product[]> {
    return MOCK_PRODUCTS;
  },

  /* --- cart --- */

  async createCart(): Promise<Cart> {
    cartSeq += 1;
    const id = `mock-cart-${cartSeq}`;
    const stored: StoredCart = { id, lines: [], discountCode: null };
    CARTS.set(id, stored);
    return computeCart(stored);
  },

  async getCart(cartId: string): Promise<Cart | null> {
    const cart = CARTS.get(cartId);
    return cart ? computeCart(cart) : null;
  },

  async addLine(cartId: string, variantId: string, quantity: number): Promise<Cart> {
    const cart = requireCart(cartId);
    const entry = VARIANT_INDEX.get(variantId);
    if (!entry) throw new Error(`Unknown variant: ${variantId}`);
    const { product } = entry;
    const variant = product.variants.find((v) => v.id === variantId)!;

    const existing = cart.lines.find((l) => l.merchandise.variantId === variantId);
    if (existing) {
      existing.quantity = Math.min(
        existing.quantity + quantity,
        Math.max(1, variant.quantityAvailable),
      );
    } else {
      lineSeq += 1;
      cart.lines.push({
        id: `mock-line-${lineSeq}`,
        quantity: Math.min(quantity, Math.max(1, variant.quantityAvailable)),
        merchandise: {
          variantId: variant.id,
          productHandle: product.handle,
          productTitle: product.title,
          variantTitle: variant.title,
          selectedOptions: variant.selectedOptions,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          image: variant.image ?? product.featuredImage,
          quantityAvailable: variant.quantityAvailable,
        },
      });
    }
    return computeCart(cart);
  },

  async updateLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
    const cart = requireCart(cartId);
    if (quantity <= 0) {
      cart.lines = cart.lines.filter((l) => l.id !== lineId);
    } else {
      const line = cart.lines.find((l) => l.id === lineId);
      if (line) {
        const cap = line.merchandise.isBundle
          ? quantity
          : Math.min(quantity, Math.max(1, line.merchandise.quantityAvailable));
        line.quantity = cap;
      }
    }
    return computeCart(cart);
  },

  async removeLine(cartId: string, lineId: string): Promise<Cart> {
    const cart = requireCart(cartId);
    cart.lines = cart.lines.filter((l) => l.id !== lineId);
    return computeCart(cart);
  },

  async applyDiscount(cartId: string, code: string): Promise<Cart> {
    const cart = requireCart(cartId);
    const coupon = findCoupon(code);
    cart.discountCode = coupon ? coupon.code : null;
    return computeCart(cart);
  },
};
