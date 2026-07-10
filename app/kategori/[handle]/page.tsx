import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCollection,
  getCollections,
  getProducts,
  type ProductSortKey,
} from "@/lib/shopify";
import { FilterBar } from "@/components/category/FilterBar";
import { CategoryListing } from "@/components/category/CategoryListing";

const PAGE_SIZE = 12;
const VALID_SORTS: ProductSortKey[] = ["NEWEST", "PRICE_ASC", "PRICE_DESC"];

/** Pre-render a route for each category. New categories are picked up here. */
export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.handle);
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
  const collection = await getCollection(params.handle);
  if (!collection) notFound();

  const sort = parseSort(searchParams.sort);
  const maxPriceRaw = Number(searchParams.maxPrice);
  const maxPrice =
    Number.isFinite(maxPriceRaw) && maxPriceRaw > 0 ? maxPriceRaw : undefined;

  const { products, totalCount, hasNextPage } = await getProducts({
    collection: params.handle,
    sort,
    maxPrice,
    page: 1,
    pageSize: PAGE_SIZE,
  });

  // Keying CategoryListing on the filter signature resets pagination on change.
  const filterKey = `${sort}|${maxPrice ?? "all"}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <nav className="mb-3 text-sm text-plum-soft" aria-label="Brödsmulor">
        <Link href="/" className="transition hover:text-fuchsia-brand">
          Hem
        </Link>
        <span className="mx-1.5" aria-hidden>
          /
        </span>
        <span className="text-ink">{collection.title}</span>
      </nav>

      <header className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          {collection.title}
        </h1>
        <p className="mt-2 max-w-2xl text-plum-soft">{collection.description}</p>
      </header>

      <FilterBar totalCount={totalCount} sort={sort} maxPrice={maxPrice} />

      {products.length === 0 ? (
        <p className="py-16 text-center text-plum-soft">
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
