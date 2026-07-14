import type { Metadata } from "next";
import { store } from "@/lib/shopify";
import { getSiteContent } from "@/lib/content";
import { BundleBuilder } from "@/components/bundle/BundleBuilder";
import { JEWELRY_COLLECTION_HANDLES } from "@/lib/config/categories";

export const metadata: Metadata = {
  title: "Skapa ditt eget paket",
  description:
    "Välj dina favoritpjäser, samla dem i din bricka och få allt i en presentask till ett fast paketpris.",
};

export default async function BundlePage() {
  const [allProducts, allCollections, content] = await Promise.all([
    store.getAllProducts(),
    store.getCollections(),
    getSiteContent(),
  ]);
  const { bundle } = content;

  // Only real vintage pieces go in the bundle, not the accessory add-ons
  // (smyckeshållare, rengöring, presentförpackning).
  const collections = allCollections.filter((c) =>
    JEWELRY_COLLECTION_HANDLES.includes(c.handle),
  );
  const products = allProducts.filter((p) =>
    p.collections.some((c) => JEWELRY_COLLECTION_HANDLES.includes(c)),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <header className="mb-10 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-8">
        <h1 className="text-heading font-light text-ink">Skapa ditt eget paket</h1>
        <p className="text-body italic text-ink-label">Fyll lådan, ett fast pris</p>
      </header>

      <BundleBuilder products={products} collections={collections} bundle={bundle} />
    </div>
  );
}
