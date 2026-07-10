/**
 * "Skapa ditt eget paket" (create-your-own-bundle) configuration.
 *
 * All bundle rules are data here so the flagship feature can be re-tuned
 * without code changes. Once live, `pricePerBundle` should reconcile with a
 * Shopify bundle product / discount so checkout charges the bundle price.
 */
export interface BundleConfig {
  /** Exact number of pieces the customer collects to complete a bundle. */
  size: number;
  /** Flat price for a completed bundle, in the store currency. */
  pricePerBundle: number;
  currencyCode: string;
  /** Copy for the included physical package (a marketing asset). */
  packageName: string;
  packageBlurb: string;
}

export const BUNDLE_CONFIG: BundleConfig = {
  size: 3,
  pricePerBundle: 199,
  currencyCode: "SEK",
  packageName: "Vintage-ask",
  packageBlurb:
    "Ditt paket levereras i vår handplockade vintage-ask med silkespapper — redo att ge bort eller unna dig själv.",
};
