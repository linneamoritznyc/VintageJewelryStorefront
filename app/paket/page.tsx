import type { Metadata } from "next";
import { getAllProducts, getCollections } from "@/lib/shopify";
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
    getAllProducts(),
    getCollections(),
    getSiteContent(),
  ]);
  const { bundle } = content;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <header className="mb-8 text-center">
        <span className="inline-flex rounded-pill bg-gold-soft/60 px-3 py-1 text-xs font-bold uppercase tracking-wide text-plum">
          Flaggskeppet
        </span>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Skapa ditt eget paket
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-plum-soft">
          Välj {bundle.size} valfria pjäser från vilka kategorier du vill. Vi
          packar allt fint i en {bundle.packageName.toLowerCase()} — för{" "}
          {formatPrice(bundle.pricePerBundle)}. Perfekt att ge bort eller unna
          dig själv.
        </p>
      </header>

      <BundleBuilder
        products={products}
        collections={collections}
        bundle={bundle}
      />

      <p className="mt-6 text-center text-sm text-plum-soft">
        {bundle.packageBlurb}
      </p>
    </div>
  );
}
