import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { store, type ProductSortKey } from "@/lib/shopify";
import { FilterBar } from "@/components/category/FilterBar";
import { CategoryListing } from "@/components/category/CategoryListing";

const PAGE_SIZE = 12;
const VALID_SORTS: ProductSortKey[] = ["NEWEST", "PRICE_ASC", "PRICE_DESC"];

/** Pre-render a route for each category. New categories are picked up here. */
export async function generateStaticParams() {
  const collections = await store.getCollections();
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const collection = await store.getCollection(params.handle);
  if (!collection) return { title: "Kategori hittades inte" };
  return {
    title: collection.title,
    description: collection.description,
  };
}

function parseSort(value?: string): ProductSortKey {
  return VALID_SORTS.includes(value as ProductSortKey)
    ? (value as ProductSortKey)
    : "NEWEST";
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams: { sort?: string; maxPrice?: string };
}) {
  const collection = await store.getCollection(params.handle);
  if (!collection) notFound();

  const sort = parseSort(searchParams.sort);
  const maxPriceRaw = Number(searchParams.maxPrice);
  const maxPrice =
    Number.isFinite(maxPriceRaw) && maxPriceRaw > 0 ? maxPriceRaw : undefined;

  const { products, totalCount, hasNextPage } = await store.getProducts({
    collection: params.handle,
    sort,
    maxPrice,
    page: 1,
    pageSize: PAGE_SIZE,
  });

  // Keying CategoryListing on the filter signature resets pagination on change.
  const filterKey = `${sort}|${maxPrice ?? "all"}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 sm:py-12">
      <nav className="mb-4 text-body italic text-ink-label" aria-label="Brödsmulor">
        <Link href="/" className="transition hover:text-ink">
          Hem
        </Link>
        <span className="mx-1.5" aria-hidden>
          /
        </span>
        <span className="text-ink">{collection.title}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-heading font-light text-ink">{collection.title}</h1>
        <p className="mt-2 max-w-2xl text-body text-ink-muted">{collection.description}</p>
      </header>

      <FilterBar totalCount={totalCount} sort={sort} maxPrice={maxPrice} />

      {products.length === 0 ? (
        <p className="py-16 text-center text-body italic text-ink-label">
          Inga fynd matchar filtret just nu.
        </p>
      ) : (
        <CategoryListing
          key={filterKey}
          collection={params.handle}
          initialProducts={products}
          initialHasNextPage={hasNextPage}
          pageSize={PAGE_SIZE}
          sort={sort}
          maxPrice={maxPrice}
        />
      )}
    </div>
  );
}
