import type { Cart } from "@/lib/shopify/types";

/**
 * ============================================================================
 * CHECKOUT HANDOFF — SINGLE INTEGRATION POINT (STUBBED)
 * ============================================================================
 *
 * Checkout is owned by Shopify. When live, this function creates/updates a
 * Shopify cart from the local cart, applies the discount code via
 * `cartDiscountCodesUpdate`, and returns `cart.checkoutUrl` — the hosted
 * checkout the customer is redirected to (payments, taxes, shipping and
 * discounts are all Shopify-managed there).
 *
 * Until Storefront API credentials exist, this returns a stub result so the UI
 * can render the handoff clearly. Everything below is the ONLY place that needs
 * to change to go live.
 * ============================================================================
 */

export interface CheckoutResult {
  ready: boolean;
  checkoutUrl: string | null;
  /** Message to show when checkout is not yet wired to live Shopify. */
  message?: string;
}

export async function startCheckout(cart: Cart): Promise<CheckoutResult> {
  // --- LIVE IMPLEMENTATION (enable once credentials exist) -----------------
  // 1. const shopifyCart = await createShopifyCart(cart.lines)
  // 2. if (cart.discount) await applyShopifyDiscount(shopifyCart.id, cart.discount.code)
  // 3. return { ready: true, checkoutUrl: shopifyCart.checkoutUrl }
  // ------------------------------------------------------------------------

  if (cart.checkoutUrl) {
    return { ready: true, checkoutUrl: cart.checkoutUrl };
  }

  return {
    ready: false,
    checkoutUrl: null,
    message:
      "Kassan kopplas till Shopifys säkra checkout så snart butiken är live. Din varukorg är sparad.",
  };
}
