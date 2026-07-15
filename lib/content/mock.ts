import type { SiteContent } from "./types";
import { ANNOUNCEMENT, EMAIL_POPUP, SALE_COUNTDOWN_ENDS_AT } from "@/lib/config/promotions";
import {
  BUNDLE_TIERS,
  BUNDLE_CURRENCY,
  BUNDLE_PACKAGE_NAME,
  BUNDLE_PACKAGE_BLURB,
} from "@/lib/config/bundle";

/**
 * English copy for the marketing/campaign text below. Kept alongside the
 * Swedish source (not in messages/*.json) because this whole layer is
 * documented as moving to Shopify metaobjects once live (see index.ts) —
 * metaobjects will carry their own per-market translations via Shopify
 * Translate & Adapt, so this English block is a stopgap for the mock
 * implementation only, not meant to grow into a second i18n system.
 */
const EN_COPY = {
  announcementMessage: "In original condition. Free shipping over 400 kr.",
  emailPopupHeading: "First come, first served",
  emailPopupSubheading: "We'll email you when new finds hit the stockroom. New members get ten percent off.",
  heroBadge: "Currently in stock",
  heroHeading: "Straight",
  heroHeadingAccent: "from the stockroom",
  heroSubheading: "Vintage jewelry from a closed-down Swedish department store, in original condition.",
  storyEyebrow: "Our story",
  storyHeading: "A Swedish department store closed down.",
  storyParagraphs: [
    "The jewelry was still sitting in the stockroom. Boxes of earrings, necklaces and bracelets in their original packaging, in original condition.",
    "We bought the whole lot.",
  ],
  storyClosingLine:
    "It's the only shipment that's coming. Once a piece is gone, it's gone to someone else.",
  bundlePackageName: "Gift box",
  bundlePackageBlurb: "Delivered assembled in the original box, ready to give.",
};

/**
 * Default site content, assembled from the code-level config in `lib/config/*`
 * plus the homepage copy below. This is the "mock" implementation of the
 * content layer, the values a developer can edit in code today, and the exact
 * fields the owner will edit in Shopify metaobjects once live.
 */
export function getMockSiteContent(locale: string = "sv"): SiteContent {
  const en = locale === "en";
  return {
    announcement: {
      enabled: ANNOUNCEMENT.enabled,
      message: en ? EN_COPY.announcementMessage : ANNOUNCEMENT.message,
      code: ANNOUNCEMENT.code,
    },
    emailPopup: {
      enabled: EMAIL_POPUP.enabled,
      heading: en ? EN_COPY.emailPopupHeading : EMAIL_POPUP.heading,
      subheading: en ? EN_COPY.emailPopupSubheading : EMAIL_POPUP.subheading,
      code: EMAIL_POPUP.code,
      discountPercentage: EMAIL_POPUP.discountPercentage,
    },
    saleCountdownEndsAt: SALE_COUNTDOWN_ENDS_AT,
    hero: {
      badge: en ? EN_COPY.heroBadge : "Aktuellt lager",
      heading: en ? EN_COPY.heroHeading : "Direkt",
      headingAccent: en ? EN_COPY.heroHeadingAccent : "ur lagret",
      subheading: en
        ? EN_COPY.heroSubheading
        : "Vintagesmycken från ett svenskt varuhus, i originalskick.",
    },
    brandStory: {
      eyebrow: en ? EN_COPY.storyEyebrow : "Vår historia",
      heading: en ? EN_COPY.storyHeading : "Ett svenskt varuhus lade ner.",
      paragraphs: en
        ? EN_COPY.storyParagraphs
        : [
            "Smyckena stod kvar på lagret. Kartonger med örhängen, halsband och armband i originalförpackning, i originalskick.",
            "Vi köpte hela partiet.",
          ],
      closingLine: en
        ? EN_COPY.storyClosingLine
        : "Det är den enda leveransen som kommer. När ett smycke är slut går det till någon annan.",
    },
    bundle: {
      tiers: BUNDLE_TIERS,
      currencyCode: BUNDLE_CURRENCY,
      packageName: en ? EN_COPY.bundlePackageName : BUNDLE_PACKAGE_NAME,
      packageBlurb: en ? EN_COPY.bundlePackageBlurb : BUNDLE_PACKAGE_BLURB,
    },
  };
}
