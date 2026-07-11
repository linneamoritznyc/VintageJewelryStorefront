"use client";

import { useRouter, usePathname } from "next/navigation";
import type { ProductSortKey } from "@/lib/shopify";

const SORT_OPTIONS: { value: ProductSortKey; label: string }[] = [
  { value: "NEWEST", label: "Nyast" },
  { value: "PRICE_ASC", label: "Pris: lågt–högt" },
  { value: "PRICE_DESC", label: "Pris: högt–lågt" },
];

const PRICE_FILTERS: { label: string; max?: number }[] = [
  { label: "Alla priser", max: undefined },
  { label: "Under 90 kr", max: 89 },
  { label: "Under 110 kr", max: 109 },
];

/**
 * Sort + basic price filter for category pages. Updates URL query params so the
 * server re-renders a filtered page 1 (SEO-friendly, shareable, back-button
 * safe). Mobile-first: sort as a native select, price as scrollable chips.
 */
export function FilterBar({
  totalCount,
  sort,
  maxPrice,
}: {
  totalCount: number;
  sort: ProductSortKey;
  maxPrice?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function update(next: { sort?: ProductSortKey; maxPrice?: number | null }) {
    const params = new URLSearchParams();
    const nextSort = next.sort ?? sort;
    if (nextSort && nextSort !== "NEWEST") params.set("sort", nextSort);

    const nextMax =
      next.maxPrice === undefined ? maxPrice : next.maxPrice ?? undefined;
    if (typeof nextMax === "number") params.set("maxPrice", String(nextMax));

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-3 border-b border-sand pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {PRICE_FILTERS.map((f) => {
          const active = (f.max ?? undefined) === maxPrice;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => update({ maxPrice: f.max ?? null })}
              className={`whitespace-nowrap rounded-pill px-3.5 py-1.5 text-sm font-semibold transition ${
                active
                  ? "bg-ink text-cream"
                  : "bg-white text-ink hover:bg-sand"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-plum-soft sm:inline">
          {totalCount} fynd
        </span>
        <label className="sr-only" htmlFor="sort">
          Sortera
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => update({ sort: e.target.value as ProductSortKey })}
          className="rounded-pill border border-sand bg-white px-4 py-1.5 text-sm font-semibold text-ink focus:border-fuchsia-brand focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Sortera: {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
