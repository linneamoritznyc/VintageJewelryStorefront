"use client";

import { useMemo, useState } from "react";
import type { Product, ProductVariant, CartLineMerchandise } from "@/lib/shopify/types";
import { useCart } from "@/lib/cart/CartContext";
import { PriceTag } from "@/components/ui/PriceTag";
import { StockBadge } from "@/components/ui/StockBadge";
import { stockStatus } from "@/lib/utils/stock";

/**
 * Purchase panel: variant selection, quantity, live stock status and
 * add-to-cart. Built to handle variants generically even though most mock
 * products have a single default variant, the option UI only appears when
 * the product actually has options.
 */
export function ProductPurchasePanel({ product }: { product: Product }) {
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
  const displayCompareAt =
    activeVariant?.compareAtPrice ?? product.compareAtPriceRange.minVariantPrice;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <PriceTag price={displayPrice} compareAtPrice={displayCompareAt} size="lg" />
        <div className="mt-2">
          <StockBadge status={stock} />
        </div>
      </div>

      {hasOptions &&
        product.options.map((opt) => (
          <div key={opt.id}>
            <p className="mb-2 text-sm font-semibold text-ink">{opt.name}</p>
            <div className="flex flex-wrap gap-2">
              {opt.values.map((value) => {
                const variantForValue = product.variants.find((v) =>
                  v.selectedOptions.some(
                    (o) => o.name === opt.name && o.value === value,
                  ),
                );
                const soldOut = !variantForValue?.availableForSale;
                const isActive = selected[opt.name] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setSelected((s) => ({ ...s, [opt.name]: value }))
                    }
                    aria-pressed={isActive}
                    className={`rounded-pill border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-fuchsia-brand bg-fuchsia-brand text-white"
                        : "border-sand bg-white text-ink hover:border-fuchsia-brand"
                    } ${soldOut ? "opacity-40" : ""}`}
                  >
                    {value}
                    {soldOut && <span className="ml-1 text-xs">(slut)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      {/* Quantity + add to cart */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center justify-between rounded-pill border border-sand bg-white sm:justify-start">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Minska antal"
            className="px-4 py-2.5 text-lg text-ink transition hover:text-fuchsia-brand disabled:opacity-30"
          >
            −
          </button>
          <span className="min-w-[2rem] text-center font-semibold tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={quantity >= maxQty}
            aria-label="Öka antal"
            className="px-4 py-2.5 text-lg text-ink transition hover:text-fuchsia-brand disabled:opacity-30"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="flex-1 rounded-pill bg-fuchsia-brand px-6 py-3.5 text-center font-bold text-white transition hover:bg-fuchsia-deep disabled:cursor-not-allowed disabled:bg-plum-soft/40"
        >
          {!canAdd ? "Slutsåld" : added ? "Tillagd i varukorgen" : "Lägg i varukorg"}
        </button>
      </div>

      <p className="meta text-ink-faint">
        Säker betalning via Shopify · Begränsat lager
      </p>
    </div>
  );
}
