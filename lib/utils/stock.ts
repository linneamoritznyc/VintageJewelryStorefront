import type { ProductVariant } from "@/lib/shopify/types";

/**
 * Threshold below which a variant is considered "low stock" and shows the
 * scarcity indicator (e.g. "Endast 1 kvar"). Driven entirely by the stock
 * field, no one-of-a-kind special-casing.
 */
export const LOW_STOCK_THRESHOLD = 3;

export interface StockStatus {
  inStock: boolean;
  isLow: boolean;
  quantity: number;
  /** Swedish label, or null when nothing scarcity-worthy to say. */
  label: string | null;
  /** Terse mono-line form for the inventory voice, e.g. "1 KVAR". */
  shortLabel: string | null;
}

function shortForm(inStock: boolean, quantity: number): string | null {
  if (!inStock) return "SLUTSÅLD";
  if (quantity <= LOW_STOCK_THRESHOLD) return `${quantity} KVAR`;
  return null;
}

export function stockStatus(variant: ProductVariant | undefined): StockStatus {
  const quantity = variant?.quantityAvailable ?? 0;
  const inStock = Boolean(variant?.availableForSale) && quantity > 0;

  if (!inStock) {
    return {
      inStock: false,
      isLow: false,
      quantity,
      label: "Slutsåld",
      shortLabel: shortForm(false, quantity),
    };
  }
  if (quantity <= LOW_STOCK_THRESHOLD) {
    const label =
      quantity === 1 ? "Endast 1 kvar" : `Endast ${quantity} kvar`;
    return {
      inStock: true,
      isLow: true,
      quantity,
      label,
      shortLabel: shortForm(true, quantity),
    };
  }
  return {
    inStock: true,
    isLow: false,
    quantity,
    label: null,
    shortLabel: null,
  };
}

/** Aggregate stock across a product's variants (for grid cards). */
export function productStockStatus(
  variants: ProductVariant[],
): StockStatus {
  const total = variants.reduce(
    (sum, v) => sum + Math.max(0, v.quantityAvailable),
    0,
  );
  const inStock = variants.some((v) => v.availableForSale && v.quantityAvailable > 0);

  if (!inStock) {
    return {
      inStock: false,
      isLow: false,
      quantity: 0,
      label: "Slutsåld",
      shortLabel: shortForm(false, 0),
    };
  }
  if (total <= LOW_STOCK_THRESHOLD) {
    const label = total === 1 ? "Endast 1 kvar" : `Endast ${total} kvar`;
    return {
      inStock: true,
      isLow: true,
      quantity: total,
      label,
      shortLabel: shortForm(true, total),
    };
  }
  return {
    inStock: true,
    isLow: false,
    quantity: total,
    label: null,
    shortLabel: null,
  };
}
