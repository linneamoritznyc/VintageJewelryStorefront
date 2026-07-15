"use client";

import { useRouter, usePathname } from "next/navigation";
import type { ProductSortKey } from "@/lib/shopify";

const SORT_OPTIONS: { value: ProductSortKey; label: string }[] = [
  { value: "NEWEST", label: "Nyast" },
  { value: "PRICE_ASC", label: "Pris: lågt till högt" },
  { value: "PRICE_DESC", label: "Pris: högt till lågt" },
];

/** Matches the real "Under 100 kr" Shopify collection threshold. */
const PRICE_FILTERS: { label: string; max?: number }[] = [
  { label: "Alla priser", max: undefined },
  { label: "Under 100 kr", max: 99 },
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

    const nextMax = next.maxPrice === undefined ? maxPrice : (next.maxPrice ?? undefined);
    if (typeof nextMax === "number") params.set("maxPrice", String(nextMax));

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1">
        {PRICE_FILTERS.map((f) => {
          const active = (f.max ?? undefined) === maxPrice;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => update({ maxPrice: f.max ?? null })}
              className={`whitespace-nowrap border-b pb-0.5 text-body italic transition ${
                active ? "border-ink text-ink" : "border-transparent text-ink-label hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-body italic text-ink-label sm:inline">{totalCount} fynd</span>
        <label className="sr-only" htmlFor="sort">
          Sortera
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => update({ sort: e.target.value as ProductSortKey })}
          className="border border-input-border bg-bg px-4 py-2 text-body text-ink focus:border-accent focus:outline-none"
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
