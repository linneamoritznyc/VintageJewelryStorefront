/**
 * "Skapa ditt eget paket" (create-your-own-bundle) configuration.
 *
 * All bundle rules are data here so the flagship feature can be re-tuned
 * without code changes. Once live, each tier's `pricePerBundle` should
 * reconcile with a Shopify bundle product / cart transform so checkout
 * charges the flat tier price regardless of which real items (39-139 kr
 * each) the customer picked.
 */
export interface BundleTier {
  /** Stable id, used as the selected-tier key. */
  id: string;
  /** "Liten låda" / "Stor låda". */
  label: string;
  /** Exact number of pieces to complete this tier. */
  size: number;
  /** Flat price for a completed bundle at this tier, in the store currency. */
  pricePerBundle: number;
}

export const BUNDLE_TIERS: BundleTier[] = [
  { id: "liten", label: "Liten låda", size: 3, pricePerBundle: 249 },
  { id: "stor", label: "Stor låda", size: 5, pricePerBundle: 379 },
];

export const BUNDLE_CURRENCY = "SEK";

/** Copy for the included physical package (a marketing asset). */
export const BUNDLE_PACKAGE_NAME = "Presentask";
export const BUNDLE_PACKAGE_BLURB = "Levereras ihopsatt i originalask, redo att ge bort.";
