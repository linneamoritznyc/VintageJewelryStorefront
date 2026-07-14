"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type {
  Cart,
  CartLine,
  CartLineMerchandise,
  Money,
  AppliedDiscount,
} from "@/lib/shopify/types";
import { findCoupon } from "@/lib/config/coupons";

/**
 * Client-side cart state. Models the Storefront API Cart shape (lines,
 * subtotal, discount, total, checkoutUrl) so that swapping in real Shopify
 * cart mutations later is a change to the action implementations only, the
 * component-facing API (addLine, updateQuantity, removeLine, applyDiscount…)
 * stays the same.
 *
 * Persistence: the line set is stored in localStorage so a refresh keeps the
 * cart. When live, the Shopify cart id would be persisted instead and lines
 * re-fetched from Shopify.
 */

const STORAGE_KEY = "vjs-cart-v1";
const CURRENCY = "SEK";

interface CartState {
  lines: CartLine[];
  discountCode: string | null;
}

type Action =
  | { type: "HYDRATE"; state: CartState }
  | { type: "ADD"; merchandise: CartLineMerchandise; quantity: number }
  | { type: "UPDATE_QTY"; lineId: string; quantity: number }
  | { type: "REMOVE"; lineId: string }
  | { type: "SET_DISCOUNT"; code: string | null }
  | { type: "CLEAR" };

let lineCounter = 0;
function nextLineId(): string {
  lineCounter += 1;
  return `line-${lineCounter}-${lineCounter * 2654435761 % 1000000}`;
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "ADD": {
      const { merchandise, quantity } = action;
      // Bundles are always distinct lines (each is a unique fixed-price set).
      if (!merchandise.isBundle) {
        const existing = state.lines.find(
          (l) => l.merchandise.variantId === merchandise.variantId,
        );
        if (existing) {
          const capped = Math.min(
            existing.quantity + quantity,
            Math.max(1, merchandise.quantityAvailable),
          );
          return {
            ...state,
            lines: state.lines.map((l) =>
              l.id === existing.id ? { ...l, quantity: capped } : l,
            ),
          };
        }
      }
      const line: CartLine = {
        id: nextLineId(),
        quantity,
        merchandise,
      };
      return { ...state, lines: [...state.lines, line] };
    }

    case "UPDATE_QTY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          lines: state.lines.filter((l) => l.id !== action.lineId),
        };
      }
      return {
        ...state,
        lines: state.lines.map((l) => {
          if (l.id !== action.lineId) return l;
          const cap = l.merchandise.isBundle
            ? action.quantity
            : Math.min(action.quantity, Math.max(1, l.merchandise.quantityAvailable));
          return { ...l, quantity: cap };
        }),
      };
    }

    case "REMOVE":
      return {
        ...state,
        lines: state.lines.filter((l) => l.id !== action.lineId),
      };

    case "SET_DISCOUNT":
      return { ...state, discountCode: action.code };

    case "CLEAR":
      return { lines: [], discountCode: null };

    default:
      return state;
  }
}

function money(amount: number): Money {
  return { amount: amount.toFixed(2), currencyCode: CURRENCY };
}

function computeCart(state: CartState): Cart {
  const subtotalAmount = state.lines.reduce(
    (sum, l) => sum + Number(l.merchandise.price.amount) * l.quantity,
    0,
  );

  let discount: AppliedDiscount | null = null;
  if (state.discountCode) {
    const coupon = findCoupon(state.discountCode);
    if (coupon) {
      discount = {
        code: coupon.code,
        percentage: coupon.percentage,
        title: coupon.title,
      };
    }
  }

  const totalAmount = discount
    ? subtotalAmount * (1 - discount.percentage / 100)
    : subtotalAmount;

  const totalQuantity = state.lines.reduce((sum, l) => sum + l.quantity, 0);

  return {
    id: null,
    lines: state.lines,
    subtotal: money(subtotalAmount),
    total: money(totalAmount),
    discount,
    totalQuantity,
    // Stubbed until credentials exist, see checkout page. When live, this is
    // Shopify's cart.checkoutUrl and the checkout button redirects to it.
    checkoutUrl: null,
  };
}

interface CartContextValue {
  cart: Cart;
  isReady: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addLine: (merchandise: CartLineMerchandise, quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  /** Returns true if the code was valid and applied. */
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_STATE: CartState = { lines: [], discountCode: null };

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE);
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (parsed && Array.isArray(parsed.lines)) {
          // Keep lineCounter ahead of any restored ids.
          lineCounter = parsed.lines.length + 1;
          dispatch({ type: "HYDRATE", state: parsed });
        }
      }
    } catch {
      // Corrupt storage, start fresh.
    }
    setIsReady(true);
  }, []);

  // Persist on change (after initial hydration).
  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full / unavailable, non-fatal.
    }
  }, [state, isReady]);

  const cart = useMemo(() => computeCart(state), [state]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isReady,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addLine: (merchandise, quantity = 1) => {
        dispatch({ type: "ADD", merchandise, quantity });
        setIsOpen(true);
      },
      updateQuantity: (lineId, quantity) =>
        dispatch({ type: "UPDATE_QTY", lineId, quantity }),
      removeLine: (lineId) => dispatch({ type: "REMOVE", lineId }),
      applyDiscount: (code) => {
        const coupon = findCoupon(code);
        if (!coupon) return false;
        dispatch({ type: "SET_DISCOUNT", code: coupon.code });
        return true;
      },
      removeDiscount: () => dispatch({ type: "SET_DISCOUNT", code: null }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [cart, isReady, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
}
