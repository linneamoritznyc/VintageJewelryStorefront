import { cache } from "react";
import type { SiteContent } from "./types";
import { getMockSiteContent } from "./mock";

/**
 * ============================================================================
 * SITE CONTENT, OWNER-EDITABLE, SINGLE SWAP POINT
 * ============================================================================
 *
 * Marketing copy and campaign settings the owner controls without a developer.
 * The whole app reads content from THIS function. Today it returns code
 * defaults; when live it reads **Shopify metaobjects** so the owner edits
 * everything in Shopify admin.
 *
 * `cache()` dedupes the call within a single server render (layout + page both
 * call it, one fetch).
 *
 * ---------------------------------------------------------------------------
 * GOING LIVE, create these metaobjects in Shopify admin
 *   (Settings → Custom data → Metaobjects), then read them here via the
 *   Storefront API.
 *
 *   Metaobject `site_settings` (single entry):
 *     announcement_enabled     boolean
 *     announcement_message     single line text
 *     discount_code            single line text     (shared banner/popup code)
 *     discount_percentage      integer
 *     popup_enabled            boolean
 *     popup_heading            single line text
 *     popup_subheading         multi line text
 *     sale_countdown_ends_at   date and time
 *
 *   Metaobject `homepage` (single entry):
 *     hero_badge               single line text
 *     hero_heading             single line text
 *     hero_subheading          multi line text
 *     story_eyebrow            single line text
 *     story_heading            single line text
 *     story_paragraphs         multi line text   (one paragraph per line)
 *     story_closing_line       single line text
 *
 *   Metaobject `bundle` (single entry):
 *     size                     integer
 *     price                    money / decimal
 *     package_name             single line text
 *     package_blurb            multi line text
 *
 *   Shop-level metafield (not a metaobject, set on the Shop itself under
 *   Settings → Custom data → Shop metafields):
 *     custom.angerratt_notice   single line text   (maps to `angerrattNotice`)
 *
 * Then implement `getShopifySiteContent()` to query these and map to
 * `SiteContent`, and swap the return below. Component code does not change.
 * The `code` field must match a real Shopify discount code (see coupons).
 * ============================================================================
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  // return getShopifySiteContent();   // <-- enable once metaobjects exist
  return getMockSiteContent();
});

export * from "./types";
