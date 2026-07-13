import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/shopify";
import { getSiteContent } from "@/lib/content";
import { primaryCategoryHandle } from "@/lib/config/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { productSchema, breadcrumbSchema } from "@/lib/seo/structured-data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductCarousel } from "@/components/home/ProductCarousel";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await store.getProduct(params.handle);
  if (!product) return { title: "Produkt hittades inte" };
  const canonical = `/produkt/${product.handle}`;
  const ogImage = product.images.find((i) => /^https?:\/\//.test(i.url))?.url;
  const description =
    product.description ||
    `${product.title}, oanvänt vintage-smycke från ${product.priceRange.minVariantPrice.amount} kr. 14 dagars ångerrätt.`;
  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: product.title,
      description,
      url: canonical,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await store.getProduct(params.handle);
  if (!product) notFound();

  const primaryCollection = primaryCategoryHandle(product.collections);
  const [collection, related, content] = await Promise.all([
    primaryCollection ? store.getCollection(primaryCollection) : Promise.resolve(null),
    primaryCollection
      ? store.getProducts({ collection: primaryCollection, pageSize: 12 })
      : Promise.resolve(null),
    getSiteContent(),
  ]);

  const relatedProducts =
    related?.products.filter((p) => p.handle !== product.handle).slice(0, 8) ??
    [];

  const breadcrumbs = [
    { name: "Hem", path: "/" },
    ...(collection ? [{ name: collection.title, path: `/kategori/${collection.handle}` }] : []),
    { name: product.title, path: `/produkt/${product.handle}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <JsonLd
        data={[
          productSchema(product, collection?.title),
          breadcrumbSchema(breadcrumbs),
        ]}
      />
      <nav className="mb-4 text-sm text-plum-soft" aria-label="Brödsmulor">
        <Link href="/" className="transition hover:text-fuchsia-brand">
          Hem
        </Link>
        {collection && (
          <>
            <span className="mx-1.5" aria-hidden>
              /
            </span>
            <Link
              href={`/kategori/${collection.handle}`}
              className="transition hover:text-fuchsia-brand"
            >
              {collection.title}
            </Link>
          </>
        )}
        <span className="mx-1.5" aria-hidden>
          /
        </span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} title={product.title} />

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              {product.title}
            </h1>
            {product.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-pill bg-sand px-2.5 py-1 text-xs font-medium text-plum-soft"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Ångerrätt-badge, synlig FÖRE köpknappen (aldrig gömd i texten) */}
          <div className="flex items-start gap-2 rounded-2xl border border-plum-soft/25 bg-white px-4 py-3 text-sm text-plum">
            <span aria-hidden className="mt-0.5 text-base">
              ↩
            </span>
            <p className="font-medium leading-snug">{content.angerrattNotice}</p>
          </div>

          <ProductPurchasePanel product={product} />

          {product.description && (
            <div className="border-t border-sand pt-5">
              <h2 className="font-display text-lg font-bold text-ink">
                Beskrivning
              </h2>
              <p className="mt-2 leading-relaxed text-plum-soft">
                {product.description}
              </p>
            </div>
          )}

          {/* Per-product vintage story. Falls back to the description when the
              vintage_blurb metafield isn't set, so this section is never empty. */}
          <div className="rounded-2xl bg-gradient-to-br from-sand/70 to-cream p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-plum">
              <span aria-hidden>✧</span> Om denna vintage-pärla
            </h2>
            {product.vintageBlurb ? (
              <p className="mt-2 leading-relaxed text-ink/80">{product.vintageBlurb}</p>
            ) : (
              <div
                className="mt-2 space-y-2 leading-relaxed text-ink/80"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 font-display text-2xl font-bold text-ink">
            Fler fynd i {collection?.title ?? "samma kategori"}
          </h2>
          <ProductCarousel products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
