import type { SiteContent } from "./types";
import { ANNOUNCEMENT, EMAIL_POPUP, SALE_COUNTDOWN_ENDS_AT } from "@/lib/config/promotions";
import { BUNDLE_CONFIG } from "@/lib/config/bundle";

/**
 * Default site content, assembled from the code-level config in `lib/config/*`
 * plus the homepage copy below. This is the "mock" implementation of the
 * content layer, the values a developer can edit in code today, and the exact
 * fields the owner will edit in Shopify metaobjects once live.
 */
export function getMockSiteContent(): SiteContent {
  return {
    announcement: {
      enabled: ANNOUNCEMENT.enabled,
      message: ANNOUNCEMENT.message,
      code: ANNOUNCEMENT.code,
    },
    emailPopup: {
      enabled: EMAIL_POPUP.enabled,
      heading: EMAIL_POPUP.heading,
      subheading: EMAIL_POPUP.subheading,
      code: EMAIL_POPUP.code,
      discountPercentage: EMAIL_POPUP.discountPercentage,
    },
    saleCountdownEndsAt: SALE_COUNTDOWN_ENDS_AT,
    hero: {
      badge: "Aktuellt lager",
      heading: "Direkt ur lagret.",
      subheading:
        "Vintagesmycken från ett svenskt varuhus, i originalskick. Nittio kronor styck.",
    },
    brandStory: {
      eyebrow: "Vår historia",
      heading: "Ett svenskt varuhus lade ner.",
      paragraphs: [
        "Smyckena stod kvar på lagret. Kartonger med örhängen, halsband och armband i originalförpackning, i originalskick.",
        "Vi köpte hela partiet.",
      ],
      closingLine:
        "Det är den enda leveransen som kommer. När ett smycke är slut går det till någon annan.",
    },
    bundle: {
      size: BUNDLE_CONFIG.size,
      pricePerBundle: BUNDLE_CONFIG.pricePerBundle,
      currencyCode: BUNDLE_CONFIG.currencyCode,
      packageName: BUNDLE_CONFIG.packageName,
      packageBlurb: BUNDLE_CONFIG.packageBlurb,
    },
  };
}
