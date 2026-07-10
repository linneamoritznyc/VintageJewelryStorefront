import type { SiteContent } from "./types";
import { ANNOUNCEMENT, EMAIL_POPUP, SALE_COUNTDOWN_ENDS_AT } from "@/lib/config/promotions";
import { BUNDLE_CONFIG } from "@/lib/config/bundle";

/**
 * Default site content, assembled from the code-level config in `lib/config/*`
 * plus the homepage copy below. This is the "mock" implementation of the
 * content layer — the values a developer can edit in code today, and the exact
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
      badge: "Deadstock · aldrig burna",
      heading: "Skattjakt bland vintagesmycken",
      subheading:
        "Oanvända smycken från ett tömt lager — räddade, aldrig burna och långt under ursprungspris. När de är slut är de slut.",
    },
    brandStory: {
      eyebrow: "Vår historia",
      heading: "Räddat ur ett tömt lager",
      paragraphs: [
        "När ett svenskt smyckesmärke lade ner blev hela lagret över: lådvis med smycken som aldrig hann ut i butik. Oanvända, oburna, fortfarande i sina originalförpackningar.",
        "Istället för att låta dem samla damm har vi räddat dem — och säljer dem vidare långt under ursprungspris. Varje pjäs är ett litet stycke vintage som väntar på sin första ägare.",
      ],
      closingLine:
        "Lagret är begränsat. När ett fynd är borta kommer det inte tillbaka.",
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
