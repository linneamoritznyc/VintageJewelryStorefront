import type { Metadata } from "next";
import { store } from "@/lib/shopify";
import { getSiteContent } from "@/lib/content";
import { BundleBuilder } from "@/components/bundle/BundleBuilder";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Skapa ditt eget paket",
  description:
    "Välj dina favoritpjäser, samla dem i din bricka och få allt i en fin vintage-ask till ett fast paketpris.",
};

export default async function BundlePage() {
  const [products, collections, content] = await Promise.all([
    store.getAllProducts(),
    store.getCollections(),
    getSiteContent(),
  ]);
  const { bundle } = content;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-8 max-w-2xl border-b border-rule pb-8">
        <p className="meta">Flaggskeppet</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          Skapa ditt eget paket
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          Välj {bundle.size} pjäser ur lagret, vilken mix du vill. Vi packar
          allt i en {bundle.packageName.toLowerCase()} med silkespapper, för{" "}
          <span className="mono text-ink">
            {formatPrice(bundle.pricePerBundle)}
          </span>
          . Fyll brickan, lägg i korgen, klart.
        </p>
      </header>

      <BundleBuilder
        products={products}
        collections={collections}
        bundle={bundle}
      />
    </div>
  );
}
