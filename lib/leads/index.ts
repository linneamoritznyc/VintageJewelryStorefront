import type { LeadSubmission } from "./types";
import { pushLeadToShopify } from "./shopify";
import { pushLeadToSheet } from "./sheets";

/**
 * Fans a lead submission out to every configured sink. Each sink is
 * independently gated by its own env vars and never throws, so a misconfigured
 * or down integration never blocks the other, and the customer-facing request
 * always resolves. Errors are logged server-side for operator visibility.
 */
export async function recordLead(lead: LeadSubmission): Promise<void> {
  const [shopify, sheet] = await Promise.all([
    pushLeadToShopify(lead),
    pushLeadToSheet(lead),
  ]);

  if (!shopify.ok) {
    console.error("[leads] Shopify write failed:", shopify.error);
  }
  if (!sheet.ok) {
    console.error("[leads] Google Sheets write failed:", sheet.error);
  }
}

export type { LeadSubmission } from "./types";
