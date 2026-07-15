"use client";

import { useMemo, useState } from "react";
import type {
  Product,
  Collection,
  ProductVariant,
  CartLineMerchandise,
  BundleContentItem,
} from "@/lib/shopify/types";
import { useCart } from "@/lib/cart/CartContext";
import { ProductImage } from "@/components/ui/ProductImage";
import { ArchivePlaceholder } from "@/components/ui/ArchivePlaceholder";
import type { BundleContent } from "@/lib/content/types";
import { formatPrice } from "@/lib/utils/format";

interface Pick {
  product: Product;
  variant: ProductVariant;
}

/** First available (in-stock) variant, else the first variant. */
function pickVariant(product: Product): ProductVariant | null {
  return (
    product.variants.find((v) => v.availableForSale && v.quantityAvailable > 0) ??
    product.variants[0] ??
    null
  );
}

const PACKAGE_IMAGE = {
  url: "mock:giftbox:80",
  altText: "Presentask",
  width: 800,
  height: 800,
};

/**
 * "Skapa ditt eget paket", the flagship. Choose a tier (fixed piece count,
 * fixed flat price), tap real vintage pieces into a visual tray, get the
 * whole thing shipped assembled in the presentask. Fast and tactile, not a
 * form: one tap adds or removes, a full tray lets you swap rather than
 * silently refusing a new pick, and the price row shows the real sum of the
 * pieces you actually chose against the flat tier price, never an invented
 * comparison.
 */
export function BundleBuilder({
  products,
  collections,
  bundle,
}: {
  products: Product[];
  collections: Collection[];
  bundle: BundleContent;
}) {
  const { addLine, applyDiscount, removeDiscount, cart } = useCart();
  const [tierId, setTierId] = useState(bundle.tiers[0]?.id);
  const tier = bundle.tiers.find((t) => t.id === tierId) ?? bundle.tiers[0];
  const categoryTitle = useMemo(() => {
    const map = new Map(collections.map((c) => [c.handle, c.title]));
    return (handle: string | undefined) => (handle && map.get(handle)) || "Fynd";
  }, [collections]);

  const [picks, setPicks] = useState<Pick[]>([]);
  const [justAdded, setJustAdded] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);

  const available = useMemo(() => products.filter((p) => p.availableForSale), [products]);

  const size = tier.size;
  const isFull = picks.length >= size;
  const remaining = size - picks.length;

  const piecesSum = useMemo(
    () => picks.reduce((sum, p) => sum + Number(p.variant.price.amount), 0),
    [picks],
  );
  const saving = Math.max(0, Math.round(piecesSum - tier.pricePerBundle));

  function selectTier(id: string) {
    setTierId(id);
    setPicks([]);
  }

  function togglePick(product: Product) {
    const index = picks.findIndex((p) => p.product.handle === product.handle);
    if (index >= 0) {
      setPicks((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    const variant = pickVariant(product);
    if (!variant) return;
    setPicks((prev) => {
      // A full tray lets you swap: drop the oldest pick, add the new one,
      // rather than silently refusing the tap.
      const next = prev.length >= size ? prev.slice(1) : prev;
      return [...next, { product, variant }];
    });
  }

  function addBundleToCart() {
    if (!isFull) return;

    const contents: BundleContentItem[] = picks.map((p) => ({
      productHandle: p.product.handle,
      productTitle: p.product.title,
      variantTitle: p.variant.title,
      image: p.variant.image ?? p.product.featuredImage,
    }));

    const merchandise: CartLineMerchandise = {
      variantId: `bundle:${tier.id}:${picks.map((p) => p.product.handle).join("+")}`,
      productHandle: "paket",
      productTitle: `${tier.label} (${size} delar)`,
      variantTitle: bundle.packageName,
      selectedOptions: [],
      price: {
        amount: tier.pricePerBundle.toFixed(2),
        currencyCode: bundle.currencyCode,
      },
      compareAtPrice: null,
      image: PACKAGE_IMAGE,
      quantityAvailable: 99,
      isBundle: true,
      bundleContents: contents,
    };

    addLine(merchandise, 1);
    setPicks([]);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2500);
  }

  function submitCoupon(e: React.FormEvent) {
    e.preventDefault();
    const ok = applyDiscount(couponInput);
    if (ok) {
      setCouponInput("");
      setCouponError(null);
    } else {
      setCouponError("Ogiltig kod.");
    }
  }

  const ctaLabel = justAdded
    ? "Paketet ligger i varukorgen"
    : isFull
      ? "Lägg i varukorgen"
      : `Välj ${remaining} till`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
      {/* Tray */}
      <div className="border border-line bg-bg-panel p-6">
        <div className="flex items-baseline justify-between">
          <p className="text-body italic text-ink-label">{bundle.packageName}, ingår</p>
          <p className="mono text-body text-ink-muted">
            {picks.length} av {size}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-px bg-line">
          {Array.from({ length: size }).map((_, i) => {
            const pick = picks[i];
            if (!pick) {
              return (
                <div
                  key={i}
                  className="flex aspect-square flex-col items-center justify-center gap-2 border border-dashed border-line bg-bg-tile text-ink-label"
                >
                  <span className="text-body italic">Tom plats</span>
                  <span className="text-body leading-none">+</span>
                </div>
              );
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => togglePick(pick.product)}
                aria-label={`Ta bort ${pick.product.title}`}
                className="relative aspect-square animate-slot-in overflow-hidden border border-accent bg-bg"
              >
                <ProductImage
                  image={pick.variant.image ?? pick.product.featuredImage}
                  className="h-full w-full"
                />
              </button>
            );
          })}
          {/* The presentask, its own visible tile alongside the picks. */}
          <ArchivePlaceholder label="Ask" className="aspect-square" />
        </div>

        <p className="mt-4 text-small italic text-ink-label">{bundle.packageBlurb}</p>
      </div>

      {/* Picker + price */}
      <div>
        {/* Tier selector */}
        <div className="grid grid-cols-2 gap-px bg-line">
          {bundle.tiers.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTier(t.id)}
              aria-pressed={t.id === tier.id}
              className={`border p-5 text-left transition ${
                t.id === tier.id ? "border-accent bg-bg-selected" : "border-line bg-bg"
              }`}
            >
              <span className="block text-sub text-ink">{t.label}</span>
              <span className="block text-body italic text-ink-label">{t.size} delar</span>
            </button>
          ))}
        </div>

        <p className="mt-6 text-body italic text-ink-label">Tryck för att lägga i lådan</p>

        <div className="mt-3 grid grid-cols-2 gap-px bg-line">
          {available.map((product) => {
            const picked = picks.some((p) => p.product.handle === product.handle);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => togglePick(product)}
                aria-pressed={picked}
                className={`flex items-start justify-between gap-3 border p-4 text-left transition ${
                  picked ? "border-accent bg-bg-selected" : "border-line bg-bg hover:border-ink"
                }`}
              >
                <span>
                  <span className="block text-body italic text-ink-label">
                    {categoryTitle(product.collections[0])}
                  </span>
                  <span className="block text-sub text-ink">{product.title}</span>
                </span>
                <span className="mt-1 flex-shrink-0 text-sub text-ink-label">
                  {picked ? "−" : "+"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Coupon */}
        <div className="mt-6 border-t border-line pt-6">
          {cart.discount ? (
            <div className="flex items-center justify-between">
              <p className="text-body italic text-accent">{cart.discount.code} tillagd</p>
              <button
                type="button"
                onClick={removeDiscount}
                className="text-small italic text-ink-muted underline underline-offset-2 hover:text-ink"
              >
                Ta bort
              </button>
            </div>
          ) : (
            <form onSubmit={submitCoupon} className="flex gap-3">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponError(null);
                }}
                placeholder="Rabattkod"
                aria-label="Rabattkod"
                className="min-w-0 flex-1 border border-input-border bg-bg px-4 py-3 text-body uppercase text-ink placeholder:normal-case placeholder:text-placeholder focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="border border-ink px-6 py-3 text-body text-ink transition hover:bg-ink hover:text-bg"
              >
                Lägg till
              </button>
            </form>
          )}
          {couponError && <p className="mt-1.5 text-small italic text-error">{couponError}</p>}
        </div>

        {/* Price + CTA */}
        <div className="mt-6 border-t border-line pt-6">
          {/* The pieces you have picked, listed once more so the selection is
              easy to double-check. Each row removes that piece. */}
          {picks.length > 0 && (
            <ul className="mb-4 space-y-1.5">
              {picks.map((p, i) => (
                <li
                  key={p.product.handle}
                  className="flex items-baseline justify-between gap-3 text-body"
                >
                  <span className="flex items-baseline gap-2 text-ink">
                    <span className="mono text-ink-label">{i + 1}.</span>
                    {p.product.title}
                  </span>
                  <span className="flex items-baseline gap-3">
                    <span className="mono text-ink-muted">
                      {formatPrice(Number(p.variant.price.amount))}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePick(p.product)}
                      aria-label={`Ta bort ${p.product.title}`}
                      className="text-body italic text-ink-label underline underline-offset-2 hover:text-ink"
                    >
                      Ta bort
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {picks.length > 0 && (
            <div className="flex items-baseline justify-between border-t border-line pt-4 text-body text-ink-muted">
              <span>
                Ordinarie ({picks.length} av {size})
              </span>
              <span className="mono">{formatPrice(piecesSum)}</span>
            </div>
          )}
          <div className="mt-1 flex items-end justify-between">
            <div>
              <span className="mono block text-numeral font-light text-ink">
                {formatPrice(tier.pricePerBundle)}
              </span>
              <span className="text-body italic text-ink-label">paketpris</span>
            </div>
            <button
              type="button"
              onClick={addBundleToCart}
              disabled={!isFull}
              className="border border-accent bg-accent px-6 py-3.5 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-line disabled:bg-bg-tile disabled:text-ink-label"
            >
              {ctaLabel}
            </button>
          </div>
          {isFull && saving > 0 && (
            <p className="mt-2 text-right text-body italic text-accent">
              Du sparar {formatPrice(saving)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
