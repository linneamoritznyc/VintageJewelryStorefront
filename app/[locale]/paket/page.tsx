import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { store } from "@/lib/shopify";
import { getSiteContent } from "@/lib/content";
import { BundleBuilder } from "@/components/bundle/BundleBuilder";
import { JEWELRY_COLLECTION_HANDLES } from "@/lib/config/categories";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "bundlePage" });
  return { title: t("title"), description: t("description") };
}

export default async function BundlePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("bundlePage");
  const [allProducts, allCollections, content] = await Promise.all([
    store.getAllProducts(),
    store.getCollections(),
    getSiteContent(params.locale),
  ]);
  const { bundle } = content;

  // Only real vintage pieces go in the bundle, not the accessory add-ons
  // (smyckeshållare, rengöring, presentförpackning).
  const collections = allCollections.filter((c) => JEWELRY_COLLECTION_HANDLES.includes(c.handle));
  const products = allProducts.filter((p) =>
    p.collections.some((c) => JEWELRY_COLLECTION_HANDLES.includes(c)),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <header className="mb-10 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-8">
        <h1 className="text-heading font-light text-ink">{t("title")}</h1>
        <p className="text-body italic text-ink-label">{t("subheading")}</p>
      </header>

      <BundleBuilder products={products} collections={collections} bundle={bundle} />
    </div>
  );
}
