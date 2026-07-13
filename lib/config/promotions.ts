/**
 * Promotional surfaces configuration: the storewide announcement bar, the
 * email-capture offer, the free-shipping threshold and the (genuine-only)
 * countdown.
 *
 * All of these are real facts. Per the design brief there is NO fabricated
 * urgency: the countdown renders only when `SALE_COUNTDOWN.genuine` is true AND
 * a real `endsAt` is set. With no genuine drop deadline configured it renders
 * nothing at all, not a zeroed timer.
 */
import { STOREWIDE_DISCOUNT_CODE, STOREWIDE_DISCOUNT_PERCENTAGE } from "./coupons";

/** Free-shipping threshold in whole kronor. Shown as a real fact (USP + bar). */
export const FREE_SHIPPING_THRESHOLD = 400;

export const ANNOUNCEMENT = {
  enabled: true,
  discountPercentage: STOREWIDE_DISCOUNT_PERCENTAGE,
  code: STOREWIDE_DISCOUNT_CODE,
  // Affirmative facts only (påståendeform, no negations).
  message: `I originalskick. Fri frakt över ${FREE_SHIPPING_THRESHOLD} kr.`,
};

export const EMAIL_POPUP = {
  enabled: true,
  discountPercentage: STOREWIDE_DISCOUNT_PERCENTAGE,
  code: STOREWIDE_DISCOUNT_CODE,
  heading: "Först till kvarn",
  subheading:
    "Vi mejlar när nya fynd släpps ur lagret. Nya medlemmar får tio procent.",
};

/**
 * Countdown configuration. A countdown may ONLY run against a genuine deadline
 * (a real drop closing). Keep `genuine: false` and there is no countdown, which
 * is the honest default. To run a real timed drop, set a future `endsAt` and
 * flip `genuine` to true.
 */
export const SALE_COUNTDOWN: {
  genuine: boolean;
  endsAt: string | null;
} = {
  genuine: false,
  endsAt: null,
};

/** Resolved end-time for the countdown, or null when there is no genuine one. */
export const SALE_COUNTDOWN_ENDS_AT: string | null =
  SALE_COUNTDOWN.genuine && SALE_COUNTDOWN.endsAt ? SALE_COUNTDOWN.endsAt : null;
