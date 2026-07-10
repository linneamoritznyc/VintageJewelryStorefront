import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProduct,
  getProducts,
  getCollection,
} from "@/lib/shopify";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductCarousel } from "@/components/home/ProductCarousel";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product) return { title: "Produkt hittades inte" };
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
  params: { handle: string };
}) {
  const product = await getProduct(params.handle);
  if (!product) notFound();

  const primaryCollection = product.collections[0];
  const [collection, related] = await Promise.all([
    primaryCollection ? getCollection(primaryCollection) : Promise.resolve(null),
    primaryCollection
      ? getProducts({ collection: primaryCollection, pageSize: 12 })
      : Promise.resolve(null),
  ]);

  const relatedProducts =
    related?.products.filter((p) => p.handle !== product.handle).slice(0, 8) ??
    [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
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

          {/* Per-product vintage story */}
          {product.vintageStory && (
            <div className="rounded-2xl bg-gradient-to-br from-sand/70 to-cream p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-plum">
                <span aria-hidden>✧</span> Om denna vintage-pärla
              </h2>
              <p className="mt-2 leading-relaxed text-ink/80">
                {product.vintageStory}
              </p>
            </div>
          )}
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
