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
import type { BundleContent } from "@/lib/content/types";
import { formatPrice, formatLot } from "@/lib/utils/format";
import { productStockStatus } from "@/lib/utils/stock";

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

/** Roman numeral for the empty specimen slots (I, II, III ...). */
function roman(n: number): string {
  const map: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  let rest = n;
  for (const [value, sym] of map) {
    while (rest >= value) {
      out += sym;
      rest -= value;
    }
  }
  return out;
}

/** Swedish number word for small counts, used in affirmative CTA copy. */
function numberWord(n: number): string {
  return ["noll", "ett", "två", "tre", "fyra", "fem", "sex"][n] ?? String(n);
}

/** Placeholder image for the physical ask shown in the tray. */
const PACKAGE_IMAGE = {
  url: "mock:giftbox:32",
  altText: "Ask",
  width: 800,
  height: 800,
};

/**
 * "Skapa ditt eget paket", the flagship. Pick a fixed number of pieces from the
 * archive, watch them drop into a specimen tray alongside the ask, then add the
 * whole thing to the cart as one flat-price bundle line.
 *
 * Design goals (per brief): fast and fun, not a form. So: any pieces in any mix
 * (no per-category quota), one tap to add with a slot-in animation, a
 * persistent tray, and the physical ask shown as its own tile. Copy is
 * affirmative and price is shown plainly, no struck prices or discount framing.
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
  const { addLine } = useCart();
  const size = bundle.size;

  const [picks, setPicks] = useState<Pick[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [justAdded, setJustAdded] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);

  const filtered = useMemo(() => {
    const inStock = products.filter((p) => p.availableForSale);
    if (activeCategory === "all") return inStock;
    return inStock.filter((p) => p.collections.includes(activeCategory));
  }, [products, activeCategory]);

  const isFull = picks.length >= size;
  const remaining = size - picks.length;

  // Honest value: the REAL running sum of the exact pieces in the tray vs the
  // flat bundle price. Never a schablon/assumed figure, so the saving is always
  // the true difference for these specific picks.
  const piecesSum = useMemo(
    () => picks.reduce((sum, p) => sum + Number(p.variant.price.amount), 0),
    [picks],
  );
  const saving = Math.max(0, Math.round(piecesSum - bundle.pricePerBundle));

  function addPick(product: Product) {
    if (isFull) return;
    const variant = pickVariant(product);
    if (!variant) return;
    setPicks((prev) => [...prev, { product, variant }]);
  }

  function removePick(index: number) {
    setPicks((prev) => prev.filter((_, i) => i !== index));
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
      variantId: `bundle:${picks.map((p) => p.product.handle).join("+")}`,
      productHandle: "paket",
      productTitle: `Paket, ${size} fynd`,
      variantTitle: bundle.packageName,
      selectedOptions: [],
      price: {
        amount: bundle.pricePerBundle.toFixed(2),
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
    setTrayOpen(false);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2500);
  }

  const ctaLabel = justAdded
    ? "Paketet ligger i varukorgen"
    : isFull
      ? "Lägg i varukorgen"
      : remaining === size
        ? `Välj ${numberWord(size)} fynd`
        : `Välj ${numberWord(remaining)} fynd till`;

  return (
    <div className="grid gap-8 pb-28 lg:grid-cols-[1fr_340px] lg:pb-0">
      {/* Picker */}
      <div>
        {/* Category filter, mono catalogue tabs */}
        <div className="no-scrollbar -mx-1 mb-5 flex gap-4 overflow-x-auto border-b border-rule px-1">
          <CategoryTab
            label="Allt"
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {collections.map((c) => (
            <CategoryTab
              key={c.handle}
              label={c.title}
              active={activeCategory === c.handle}
              onClick={() => setActiveCategory(c.handle)}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
          {filtered.map((product) => {
            const pickedIndex = picks.findIndex(
              (p) => p.product.handle === product.handle,
            );
            const picked = pickedIndex >= 0;
            const disabled = isFull && !picked;
            const stock = productStockStatus(product.variants);
            const lot = formatLot(product.lotNumber);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() =>
                  picked ? removePick(pickedIndex) : addPick(product)
                }
                disabled={disabled}
                aria-pressed={picked}
                className="group flex flex-col text-left transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <div
                  className={`relative aspect-square overflow-hidden bg-paper-sunk transition ${
                    picked ? "border-2 border-ink" : "border border-rule"
                  }`}
                >
                  <ProductImage
                    image={product.featuredImage}
                    className="h-full w-full transition-transform duration-200 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  {/* Add / picked affordance. Ink, never signal (red = scarcity). */}
                  <span
                    className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center border border-ink text-sm transition ${
                      picked
                        ? "bg-ink text-paper"
                        : "bg-paper/90 text-ink opacity-0 group-hover:opacity-100"
                    }`}
                    aria-hidden
                  >
                    {picked ? "✓" : "+"}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  {lot && <span className="meta">{lot}</span>}
                  {stock.isLow && (
                    <span className="mono text-[11px] uppercase tracking-meta text-signal">
                      {stock.quantity} kvar
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 font-display text-[15px] leading-tight text-ink">
                  {product.title}
                </p>
                <p className="mono mt-1 text-sm text-ink-muted">
                  {formatPrice(Number(product.priceRange.minVariantPrice.amount))}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tray, desktop sticky rail */}
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <Tray
          size={size}
          picks={picks}
          bundle={bundle}
          piecesSum={piecesSum}
          saving={saving}
          isFull={isFull}
          ctaLabel={ctaLabel}
          onRemove={removePick}
          onClear={() => setPicks([])}
          onSubmit={addBundleToCart}
        />
      </aside>

      {/* Tray, mobile pinned bar + expandable sheet */}
      <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
        {trayOpen && (
          <>
            <button
              type="button"
              aria-label="Stäng bricka"
              className="fixed inset-0 animate-fade-in bg-ink/40"
              onClick={() => setTrayOpen(false)}
            />
            <div className="relative max-h-[80vh] overflow-y-auto border-t border-rule bg-paper px-4 pb-4 pt-3">
              <Tray
                size={size}
                picks={picks}
                bundle={bundle}
                piecesSum={piecesSum}
                saving={saving}
                isFull={isFull}
                ctaLabel={ctaLabel}
                onRemove={removePick}
                onClear={() => setPicks([])}
                onSubmit={addBundleToCart}
              />
            </div>
          </>
        )}
        {!trayOpen && (
          <div className="border-t border-rule bg-paper px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Mini slots */}
              <button
                type="button"
                onClick={() => setTrayOpen(true)}
                className="flex flex-1 items-center gap-2"
                aria-label="Öppna din bricka"
              >
                {Array.from({ length: size }).map((_, i) => {
                  const pick = picks[i];
                  return (
                    <span
                      key={i}
                      className={`flex h-9 w-9 items-center justify-center overflow-hidden text-xs ${
                        pick
                          ? "border-2 border-ink bg-paper-sunk"
                          : "border border-dashed border-rule text-ink-faint"
                      }`}
                    >
                      {pick ? (
                        <ProductImage
                          image={pick.variant.image ?? pick.product.featuredImage}
                          className="h-full w-full"
                        />
                      ) : (
                        <span className="font-display">{roman(i + 1)}</span>
                      )}
                    </span>
                  );
                })}
                <span className="mono ml-1 text-sm font-medium text-ink">
                  {formatPrice(bundle.pricePerBundle)}
                </span>
              </button>
              <button
                type="button"
                onClick={isFull ? addBundleToCart : () => setTrayOpen(true)}
                disabled={justAdded}
                className="flex-shrink-0 bg-ink px-4 py-3 font-mono text-xs uppercase tracking-meta text-paper transition hover:bg-ink-muted disabled:opacity-60"
              >
                {isFull ? "Lägg i korg" : `Välj ${numberWord(remaining)} till`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Tray({
  size,
  picks,
  bundle,
  piecesSum,
  saving,
  isFull,
  ctaLabel,
  onRemove,
  onClear,
  onSubmit,
}: {
  size: number;
  picks: Pick[];
  bundle: BundleContent;
  piecesSum: number;
  saving: number;
  isFull: boolean;
  ctaLabel: string;
  onRemove: (index: number) => void;
  onClear: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="border border-rule bg-paper-raised">
      <div className="flex items-baseline justify-between border-b border-rule px-4 py-3">
        <h2 className="font-display text-lg text-ink">Din bricka</h2>
        <span className="mono text-sm text-ink-faint">
          {picks.length} / {size}
        </span>
      </div>

      {/* Specimen slots + the ask, one tray */}
      <ul className="grid grid-cols-4 gap-2 p-4">
        {Array.from({ length: size }).map((_, i) => {
          const pick = picks[i];
          if (!pick) {
            return (
              <li
                key={i}
                className="flex aspect-square flex-col items-center justify-center border border-dashed border-rule text-ink-faint"
              >
                <span className="font-display text-xl leading-none">
                  {roman(i + 1)}
                </span>
              </li>
            );
          }
          const lot = formatLot(pick.product.lotNumber);
          return (
            <li
              key={i}
              className="relative aspect-square animate-slot-in overflow-hidden border-2 border-ink bg-paper-sunk"
            >
              <ProductImage
                image={pick.variant.image ?? pick.product.featuredImage}
                className="h-full w-full"
              />
              {lot && (
                <span className="absolute inset-x-0 bottom-0 bg-ink/75 px-1 py-0.5 text-center font-mono text-[8px] uppercase tracking-meta text-paper">
                  {lot}
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label={`Ta bort ${pick.product.title}`}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center bg-paper/90 text-ink transition hover:bg-paper"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path
                    d="M2 2l6 6M8 2l-6 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          );
        })}
        {/* The ask, its own tile so it is visible while you build. */}
        <li className="relative flex aspect-square flex-col items-center justify-center border border-rule bg-paper-sunk/60">
          <div className="h-3/5 w-3/5">
            <ProductImage image={PACKAGE_IMAGE} className="h-full w-full" />
          </div>
          <span className="meta mt-0.5 text-[9px]">Ask</span>
        </li>
      </ul>

      <p className="meta -mt-1 px-4 pb-3 normal-case tracking-normal text-ink-faint">
        {bundle.packageBlurb}
      </p>

      {/* Price + CTA. Real running sum vs the flat price, honest saving. */}
      <div className="border-t border-rule px-4 py-4">
        {picks.length > 0 && (
          <div className="mb-1.5 flex items-baseline justify-between text-sm text-ink-muted">
            <span>
              Styckvis{picks.length < size ? ` (${picks.length}/${size})` : ""}
            </span>
            <span className="mono">{formatPrice(piecesSum)}</span>
          </div>
        )}
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-ink-muted">Paketpris</span>
          <span className="mono text-2xl font-medium text-ink">
            {formatPrice(bundle.pricePerBundle)}
          </span>
        </div>
        {isFull && saving > 0 && (
          <p className="mt-1.5 border-t border-rule pt-1.5 text-right text-sm font-medium text-ink">
            Du sparar {formatPrice(saving)}
          </p>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!isFull}
          className="mt-4 w-full bg-ink px-6 py-3.5 font-mono text-sm uppercase tracking-meta text-paper transition hover:bg-ink-muted disabled:cursor-not-allowed disabled:bg-ink-faint/40 disabled:text-ink-faint"
        >
          {ctaLabel}
        </button>
        {picks.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="mt-2 w-full text-center text-xs text-ink-faint underline underline-offset-2 transition hover:text-ink"
          >
            Töm brickan
          </button>
        )}
      </div>
    </div>
  );
}

function CategoryTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`-mb-px whitespace-nowrap border-b-2 px-1 py-2.5 font-mono text-xs uppercase tracking-meta transition ${
        active
          ? "border-ink text-ink"
          : "border-transparent text-ink-faint hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
