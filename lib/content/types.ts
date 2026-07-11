/**
 * Types for OWNER-EDITABLE site content.
 *
 * This is the marketing/copy layer the non-technical owner controls WITHOUT a
 * developer. Today it is served from code defaults (see `mock.ts`, which reads
 * `lib/config/*`). When live, `getSiteContent()` reads the same shape from
 * **Shopify metaobjects**, so the owner edits banner text, the sale end-date,
 * the bundle price and homepage copy directly in Shopify admin, no code, no
 * redeploy. See `index.ts` for the metaobject definitions and swap point.
 */

export interface AnnouncementContent {
  enabled: boolean;
  message: string;
  /** Discount code shown in the banner. Kept consistent with the popup. */
  code: string;
}

export interface EmailPopupContent {
  enabled: boolean;
  heading: string;
  subheading: string;
  code: string;
  discountPercentage: number;
}

export interface HeroContent {
  badge: string;
  heading: string;
  subheading: string;
}

export interface BrandStoryContent {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  closingLine: string;
}

export interface BundleContent {
  /** Number of pieces to complete a bundle. */
  size: number;
  pricePerBundle: number;
  currencyCode: string;
  packageName: string;
  packageBlurb: string;
}

export interface SiteContent {
  announcement: AnnouncementContent;
  emailPopup: EmailPopupContent;
  /** ISO end-time for the homepage limited-time-sale countdown. */
  saleCountdownEndsAt: string;
  hero: HeroContent;
  brandStory: BrandStoryContent;
  bundle: BundleContent;
}
