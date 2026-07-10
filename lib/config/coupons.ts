/**
 * Coupon-code configuration.
 *
 * Codes live here as pure data so marketing can add/edit them WITHOUT touching
 * component code. Validation in the cart reads from this list.
 *
 * These are intentionally structured to line up 1:1 with Shopify discount codes
 * once live: `code` is the Shopify code, `percentage` is the percentage-off
 * value. When credentials exist, cart discount application will call Shopify's
 * `cartDiscountCodesUpdate` mutation and Shopify becomes the source of truth;
 * this list can then act as a lightweight client-side pre-check (or be removed).
 */

export interface CouponDefinition {
  /** The code the customer types. Matching is case-insensitive. */
  code: string;
  /** Percentage discount, e.g. 10 for 10% off. */
  percentage: number;
  /** Human-readable label shown in the cart once applied. */
  title: string;
  /** Optional: hide from any "current offers" UI while still valid. */
  hidden?: boolean;
}

/**
 * The storewide 10% code. Shared by the announcement banner and the
 * email-capture popup so the two surfaces stay logically consistent, both
 * offer THIS code. Keeping it in one constant is the single source of truth.
 */
export const STOREWIDE_DISCOUNT_CODE = "VINTAGE10";
export const STOREWIDE_DISCOUNT_PERCENTAGE = 10;

export const COUPONS: CouponDefinition[] = [
  {
    code: STOREWIDE_DISCOUNT_CODE,
    percentage: STOREWIDE_DISCOUNT_PERCENTAGE,
    title: "10% på hela beställningen",
  },
  {
    code: "FYND20",
    percentage: 20,
    title: "20% fyndrabatt",
  },
  {
    code: "PAKET15",
    percentage: 15,
    title: "15% på ditt paket",
  },
];

/**
 * Validate a typed coupon code. Returns the matching definition or null.
 * Case-insensitive, trims whitespace.
 */
export function findCoupon(input: string): CouponDefinition | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;
  return (
    COUPONS.find((c) => c.code.toLowerCase() === normalized) ?? null
  );
}
