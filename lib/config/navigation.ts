/**
 * Primary navigation, restricted to the four jewelry-type collections.
 *
 * `store.getCollections()` returns EVERY Shopify collection, including the
 * built-in "frontpage" system collection and curated marketing collections
 * (e.g. "perfekta-presenter", "manadens-fynd") that exist for other purposes.
 * Header nav, the footer "Handla" list, the homepage category grid, and the
 * bundle builder's category tabs all use ONLY these four, so the primary nav
 * doesn't show a "Home page" link or non-category collections. Any real
 * collection is still reachable directly at /kategori/<handle> regardless of
 * this list, this only controls what's linked to from primary navigation.
 */
export const NAV_COLLECTION_HANDLES = ["orhangen", "halsband", "armband", "ovrigt"] as const;

/**
 * Shopify's built-in "frontpage" collection is not real customer-facing
 * content, exclude it from anywhere collections are listed generically
 * (e.g. static pre-rendering of /kategori/<handle>).
 */
export const SYSTEM_COLLECTION_HANDLES = ["frontpage"] as const;

export function isNavCollectionHandle(handle: string): boolean {
  return (NAV_COLLECTION_HANDLES as readonly string[]).includes(handle);
}

/**
 * A product's jewelry-type category (örhängen/halsband/armband/övrigt).
 * A live product can belong to several Shopify collections at once (e.g. also
 * "manadens-fynd"), and collection order in the API response is not
 * guaranteed, so `product.collections[0]` is NOT safe to treat as "the"
 * category. Use this instead everywhere a single category is needed (bundle
 * builder, breadcrumbs).
 */
export function primaryCategoryHandle(collectionHandles: string[]): string | null {
  return collectionHandles.find(isNavCollectionHandle) ?? null;
}
