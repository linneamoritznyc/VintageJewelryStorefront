import type { ProductVariant } from "@/lib/shopify/types";

/**
 * Threshold below which a variant is considered "low stock" and shows the
 * scarcity indicator (e.g. "Only 1 left"). Driven entirely by the stock
 * field, no one-of-a-kind special-casing.
 */
export const LOW_STOCK_THRESHOLD = 3;

export interface StockStatus {
  inStock: boolean;
  isLow: boolean;
  quantity: number;
  /**
   * Which message to show, or null when nothing scarcity-worthy to say.
   * Locale-neutral on purpose: StockBadge resolves the actual copy via
   * useTranslations, so this type carries no language.
   */
  labelKey: "soldOut" | "lowStock" | null;
}

export function stockStatus(variant: ProductVariant | undefined): StockStatus {
  const quantity = variant?.quantityAvailable ?? 0;
  const inStock = Boolean(variant?.availableForSale) && quantity > 0;

  if (!inStock) {
    return { inStock: false, isLow: false, quantity, labelKey: "soldOut" };
  }
  if (quantity <= LOW_STOCK_THRESHOLD) {
    return { inStock: true, isLow: true, quantity, labelKey: "lowStock" };
  }
  return { inStock: true, isLow: false, quantity, labelKey: null };
}

/** Aggregate stock across a product's variants (for grid cards). */
export function productStockStatus(variants: ProductVariant[]): StockStatus {
  const total = variants.reduce((sum, v) => sum + Math.max(0, v.quantityAvailable), 0);
  const inStock = variants.some((v) => v.availableForSale && v.quantityAvailable > 0);

  if (!inStock) {
    return { inStock: false, isLow: false, quantity: 0, labelKey: "soldOut" };
  }
  if (total <= LOW_STOCK_THRESHOLD) {
    return { inStock: true, isLow: true, quantity: total, labelKey: "lowStock" };
  }
  return { inStock: true, isLow: false, quantity: total, labelKey: null };
}
