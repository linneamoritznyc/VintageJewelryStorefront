/**
 * "Skapa ditt eget paket" (create-your-own-bundle) configuration.
 *
 * The discount is a real Shopify AUTOMATIC discount ("Paketrabatt: 15 % på 3
 * eller fler smycken", verified live 2026-07-13), not a fixed bundle price
 * and not a code. It applies to any cart with `size` or more items, however
 * they got there, the "3 different categories" rule below is our own UI
 * curation for the bundle-builder page, not a condition of the discount
 * itself. Keeping the real percentage/size here (rather than a fabricated
 * flat price) means the number shown in the UI always matches what Shopify
 * actually charges once live.
 */
export interface BundleConfig {
  /** Minimum items in the cart for the automatic discount to apply. */
  size: number;
  /** The real automatic discount's percentage off. */
  discountPercentage: number;
  currencyCode: string;
  /** Copy for the included physical package (a marketing asset, not billed separately). */
  packageName: string;
  packageBlurb: string;
}

export const BUNDLE_CONFIG: BundleConfig = {
  size: 3,
  discountPercentage: 15,
  currencyCode: "SEK",
  packageName: "Vintage-ask",
  packageBlurb:
    "Ditt paket levereras i vår handplockade vintage-ask med silkespapper, redo att ge bort eller unna dig själv.",
};
