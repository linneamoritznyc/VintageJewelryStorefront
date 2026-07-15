"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Product, ProductVariant, CartLineMerchandise } from "@/lib/shopify/types";
import { useCart } from "@/lib/cart/CartContext";
import { PriceTag } from "@/components/ui/PriceTag";
import { StockBadge } from "@/components/ui/StockBadge";
import { stockStatus } from "@/lib/utils/stock";

/**
 * Purchase panel: variant selection, quantity, live stock status and
 * add-to-cart. Built to handle variants generically even though most pieces in
 * this catalog have a single default variant (mostly 1-of-1 deadstock); the
 * option UI only appears when a product actually has options (e.g. a ring with
 * size variants added in Shopify admin).
 */
export function ProductPurchasePanel({ product }: { product: Product }) {
  const t = useTranslations("product");
  const { addLine } = useCart();
  const hasOptions = product.options.length > 0;

  // Track a selected value per option name.
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const opt of product.options) {
      // Default to the first in-stock value, else the first value.
      const firstAvailable = opt.values.find((value) =>
        product.variants.some(
          (v) =>
            v.selectedOptions.some((o) => o.name === opt.name && o.value === value) &&
            v.availableForSale,
        ),
      );
      initial[opt.name] = firstAvailable ?? opt.values[0];
    }
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const activeVariant: ProductVariant | undefined = useMemo(() => {
    if (!hasOptions) return product.variants[0];
    return product.variants.find((v) =>
      v.selectedOptions.every((o) => selected[o.name] === o.value),
    );
  }, [product.variants, selected, hasOptions]);

  const stock = stockStatus(activeVariant);
  const maxQty = Math.max(1, stock.quantity);
  const canAdd = stock.inStock && !!activeVariant;

  function handleAdd() {
    if (!activeVariant || !stock.inStock) return;
    const merchandise: CartLineMerchandise = {
      variantId: activeVariant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: activeVariant.title,
      selectedOptions: activeVariant.selectedOptions,
      price: activeVariant.price,
      compareAtPrice: activeVariant.compareAtPrice,
      image: activeVariant.image ?? product.featuredImage,
      quantityAvailable: activeVariant.quantityAvailable,
    };
    addLine(merchandise, Math.min(quantity, maxQty));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  const displayPrice = activeVariant?.price ?? product.priceRange.minVariantPrice;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <PriceTag price={displayPrice} size="lg" />
        <StockBadge status={stock} />
      </div>

      {hasOptions &&
        product.options.map((opt) => (
          <div key={opt.id}>
            <p className="meta mb-2">{opt.name}</p>
            <div className="flex flex-wrap gap-2">
              {opt.values.map((value) => {
                const variantForValue = product.variants.find((v) =>
                  v.selectedOptions.some((o) => o.name === opt.name && o.value === value),
                );
                const soldOut = !variantForValue?.availableForSale;
                const isActive = selected[opt.name] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelected((s) => ({ ...s, [opt.name]: value }))}
                    aria-pressed={isActive}
                    className={`border px-4 py-2 text-body transition ${
                      isActive
                        ? "border-ink bg-ink text-bg"
                        : "border-input-border bg-bg text-ink hover:border-ink"
                    } ${soldOut ? "opacity-40" : ""}`}
                  >
                    {value}
                    {soldOut && <span className="ml-1 italic">{t("optionSoldOut")}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      {/* Quantity + add to cart */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center justify-between border border-input-border bg-bg sm:justify-start">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label={t("decreaseQty")}
            className="px-4 py-2.5 text-sub text-ink transition hover:text-accent disabled:opacity-30"
          >
            −
          </button>
          <span className="mono min-w-[2rem] text-center text-body">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={quantity >= maxQty}
            aria-label={t("increaseQty")}
            className="px-4 py-2.5 text-sub text-ink transition hover:text-accent disabled:opacity-30"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="flex-1 border border-accent bg-accent px-6 py-3.5 text-center text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-line disabled:bg-bg-tile disabled:text-ink-label"
        >
          {!canAdd ? t("soldOut") : added ? t("added") : t("addToCart")}
        </button>
      </div>

      <p className="text-small italic text-ink-label">{t("freeShippingNote")}</p>
    </div>
  );
}
