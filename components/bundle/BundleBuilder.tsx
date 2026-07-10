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

/**
 * "Skapa ditt eget paket" — the flagship. Pick a fixed number of pieces across
 * any categories, watch them collect in a visual tray alongside the physical
 * package, then drop the whole thing in the cart as one fixed-price bundle
 * line. Built to feel fast and fun, not like a form.
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

  const filtered = useMemo(() => {
    const inStock = products.filter((p) => p.availableForSale);
    if (activeCategory === "all") return inStock;
    return inStock.filter((p) => p.collections.includes(activeCategory));
  }, [products, activeCategory]);

  const isFull = picks.length >= size;
  const remaining = size - picks.length;

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
      // Unique per built bundle. Maps to a Shopify bundle variant + line
      // attributes once live.
      variantId: `bundle:${Date.now()}`,
      productHandle: "paket",
      productTitle: `Vintage-paket (${size} delar)`,
      variantTitle: bundle.packageName,
      selectedOptions: [],
      price: {
        amount: bundle.pricePerBundle.toFixed(2),
        currencyCode: bundle.currencyCode,
      },
      compareAtPrice: null,
      image: { url: "mock:bundle:290", altText: "Vintage-paket", width: 800, height: 800 },
      quantityAvailable: 99,
      isBundle: true,
      bundleContents: contents,
    };

    addLine(merchandise, 1);
    setPicks([]);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2500);
  }

  const ctaLabel = justAdded
    ? "✓ Paketet är i varukorgen!"
    : isFull
      ? "Lägg paketet i varukorgen"
      : `Välj ${remaining} till`;

  return (
    <div className="grid gap-8 pb-24 lg:grid-cols-[1fr_360px] lg:pb-0">
      {/* Picker */}
      <div>
        {/* Category tabs */}
        <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1">
          <CategoryTab
            label="Alla"
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((product) => {
            const pickedCount = picks.filter(
              (p) => p.product.handle === product.handle,
            ).length;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => addPick(product)}
                disabled={isFull}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-card transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="relative aspect-square">
                  <ProductImage
                    image={product.featuredImage}
                    className="h-full w-full"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  {pickedCount > 0 && (
                    <span className="absolute right-2 top-2 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-fuchsia-brand px-1.5 text-xs font-bold text-white">
                      {pickedCount}×
                    </span>
                  )}
                  {!isFull && (
                    <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/80 text-lg text-cream opacity-0 transition group-hover:opacity-100">
                      +
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="line-clamp-2 text-sm font-semibold text-ink">
                    {product.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bundle tray */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border-2 border-dashed border-fuchsia-brand/40 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">
              Din bricka
            </h2>
            <span className="rounded-pill bg-sand px-3 py-1 text-sm font-bold text-plum">
              {picks.length} / {size}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-3 h-2 overflow-hidden rounded-pill bg-sand">
            <div
              className="h-full rounded-pill bg-fuchsia-brand transition-all duration-300"
              style={{ width: `${(picks.length / size) * 100}%` }}
            />
          </div>

          {/* Slots */}
          <ul className="mt-4 space-y-2">
            {Array.from({ length: size }).map((_, i) => {
              const pick = picks[i];
              if (!pick) {
                return (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-sand px-3 py-2.5 text-plum-soft/70"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand/50 text-xl">
                      ✧
                    </span>
                    <span className="text-sm">Ledig plats — välj en pjäs</span>
                  </li>
                );
              }
              return (
                <li
                  key={i}
                  className="flex animate-pop-in items-center gap-3 rounded-2xl bg-sand/40 px-3 py-2.5"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
                    <ProductImage
                      image={pick.variant.image ?? pick.product.featuredImage}
                      className="h-full w-full"
                    />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-ink">
                    {pick.product.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePick(i)}
                    aria-label={`Ta bort ${pick.product.title}`}
                    className="text-plum-soft/70 transition hover:text-fuchsia-deep"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M4 4l8 8M12 4l-8 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Physical package — a marketing asset, always shown */}
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-gold-soft/25 px-3 py-2.5">
            <span aria-hidden className="text-2xl">
              🎁
            </span>
            <div>
              <p className="text-sm font-bold text-plum">
                + {bundle.packageName}
              </p>
              <p className="text-xs text-plum-soft">Ingår alltid i paketet</p>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="mt-5 border-t border-sand pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-plum-soft">Paketpris</span>
              <span className="font-display text-2xl font-extrabold text-ink">
                {formatPrice(bundle.pricePerBundle)}
              </span>
            </div>
            <button
              type="button"
              onClick={addBundleToCart}
              disabled={!isFull}
              className="mt-3 w-full rounded-pill bg-fuchsia-brand px-6 py-3.5 font-bold text-white transition hover:bg-fuchsia-deep disabled:cursor-not-allowed disabled:bg-plum-soft/40"
            >
              {ctaLabel}
            </button>
            {picks.length > 0 && (
              <button
                type="button"
                onClick={() => setPicks([])}
                className="mt-2 w-full text-center text-xs text-plum-soft underline transition hover:text-ink"
              >
                Töm brickan
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Sticky mobile action bar — keeps progress + CTA in reach while
          scrolling the picker on phones (the flagship should feel fast). */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-cream/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold text-ink">
                {picks.length}/{size}
              </span>
              <span aria-hidden className="text-lg">
                🎁
              </span>
            </div>
            <span className="text-xs font-semibold text-plum-soft">
              {formatPrice(bundle.pricePerBundle)}
            </span>
          </div>
          <button
            type="button"
            onClick={addBundleToCart}
            disabled={!isFull}
            className="flex-1 rounded-pill bg-fuchsia-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-fuchsia-deep disabled:cursor-not-allowed disabled:bg-plum-soft/40"
          >
            {ctaLabel}
          </button>
        </div>
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
      className={`whitespace-nowrap rounded-pill px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-ink text-cream" : "bg-white text-ink hover:bg-sand"
      }`}
    >
      {label}
    </button>
  );
}
