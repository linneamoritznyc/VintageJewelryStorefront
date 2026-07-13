"use server";

import { store } from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";

/**
 * ============================================================================
 * CHECKOUT HANDOFF, SINGLE INTEGRATION POINT
 * ============================================================================
 * Checkout is owned by Shopify. This Server Action builds a REAL Shopify cart
 * from the local (client-side) cart, one line at a time via the same
 * StoreClient the rest of the app uses (lib/shopify/index.ts, mock or live
 * depending on NEXT_PUBLIC_USE_MOCK), applies the manually-entered discount
 * code if any (the automatic bundle discount needs no code, Shopify applies
 * it on its own once the real cart has 3+ items), and returns Shopify's
 * hosted `checkoutUrl`. Payments, shipping and taxes are all handled there.
 *
 * "use server" keeps this on the server: the Storefront token never reaches
 * the browser even though it's called directly from a client component.
 *
 * In mock mode `store.createCart()` never has a real checkoutUrl (there is no
 * real Shopify cart to redirect to), so this correctly falls through to the
 * "not ready yet" message below, unchanged mock behavior.
 * ============================================================================
 */

export interface CheckoutResult {
  ready: boolean;
  checkoutUrl: string | null;
  /** Message to show when checkout isn't ready (empty cart, live API error, or still in mock mode). */
  message?: string;
}

export async function startCheckout(cart: Cart): Promise<CheckoutResult> {
  if (cart.lines.length === 0) {
    return { ready: false, checkoutUrl: null, message: "Varukorgen är tom." };
  }

  try {
    let shopifyCart = await store.createCart();
    for (const line of cart.lines) {
      shopifyCart = await store.addLine(
        shopifyCart.id ?? "",
        line.merchandise.variantId,
        line.quantity,
      );
    }
    if (cart.discount && !cart.discount.isAutomatic && cart.discount.code) {
      shopifyCart = await store.applyDiscount(shopifyCart.id ?? "", cart.discount.code);
    }
    if (shopifyCart.checkoutUrl) {
      return { ready: true, checkoutUrl: shopifyCart.checkoutUrl };
    }
  } catch (err) {
    console.error("startCheckout failed:", err);
    return {
      ready: false,
      checkoutUrl: null,
      message: "Kunde inte öppna kassan just nu. Försök igen om en liten stund.",
    };
  }

  return {
    ready: false,
    checkoutUrl: null,
    message:
      "Kassan kopplas till Shopifys säkra checkout så snart butiken är live. Din varukorg är sparad.",
  };
}
