import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { store } from "@/lib/shopify";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductCarousel } from "@/components/home/ProductCarousel";

export async function generateMetadata({
  params,
}: {
  params: { handle: string; locale: string };
}): Promise<Metadata> {
  const product = await store.getProduct(params.handle);
  if (!product) {
    const t = await getTranslations({ locale: params.locale, namespace: "product" });
    return { title: t("notFoundTitle") };
  }
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string; locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("product");
  const tBread = await getTranslations("breadcrumb");
  const product = await store.getProduct(params.handle);
  if (!product) notFound();

  const primaryCollection = product.collections[0];
  const [collection, related] = await Promise.all([
    primaryCollection ? store.getCollection(primaryCollection) : Promise.resolve(null),
    primaryCollection
      ? store.getProducts({ collection: primaryCollection, pageSize: 12 })
      : Promise.resolve(null),
  ]);

  const relatedProducts =
    related?.products.filter((p) => p.handle !== product.handle).slice(0, 8) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 sm:py-12">
      <nav className="mb-4 text-body italic text-ink-label" aria-label={tBread("label")}>
        <Link href="/" className="transition hover:text-ink">
          {tBread("home")}
        </Link>
        {collection && (
          <>
            <span className="mx-1.5" aria-hidden>
              /
            </span>
            <Link href={`/kategori/${collection.handle}`} className="transition hover:text-ink">
              {collection.title}
            </Link>
          </>
        )}
        <span className="mx-1.5" aria-hidden>
          /
        </span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} title={product.title} />

        <div className="flex flex-col gap-6">
          <h1 className="text-heading font-light text-ink">{product.title}</h1>

          {/* Ångerrätt-badge, synlig FÖRE köpknappen (aldrig gömd i texten) */}
          {product.angerratt && (
            <div className="border border-line bg-bg-panel px-4 py-3 text-body text-ink-muted">
              {product.angerratt}
            </div>
          )}

          <ProductPurchasePanel product={product} />

          {product.description && (
            <div className="border-t border-line pt-5">
              <h2 className="text-sub text-ink">{t("description")}</h2>
              <p className="mt-2 text-body text-ink-muted">{product.description}</p>
            </div>
          )}

          {/* Per-product vintage story */}
          {product.vintageBlurb && (
            <div className="border border-line bg-bg-panel p-5">
              <h2 className="text-sub text-ink">{t("vintageStory")}</h2>
              <p className="mt-2 text-body text-ink-muted">{product.vintageBlurb}</p>
            </div>
          )}

          {/* Dropshipped accessories ship direct from supplier, disclosed here. */}
          {product.isDropship && product.customsNote && (
            <p className="text-small italic text-ink-label">{product.customsNote}</p>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-line pt-10">
          <h2 className="mb-6 text-heading font-light text-ink">
            {t("moreIn", { category: collection?.title ?? t("sameCategory") })}
          </h2>
          <ProductCarousel products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
