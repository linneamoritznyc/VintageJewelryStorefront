/**
 * Promotional surfaces configuration: the storewide announcement banner and
 * the reusable countdown/limited-time-sale settings.
 *
 * The end-time is stored as a fixed ISO string so the countdown is
 * deterministic and easy for a non-developer owner to edit. Update the date to
 * run a new limited-time sale.
 */
import { STOREWIDE_DISCOUNT_CODE, STOREWIDE_DISCOUNT_PERCENTAGE } from "./coupons";

export const ANNOUNCEMENT = {
  enabled: true,
  discountPercentage: STOREWIDE_DISCOUNT_PERCENTAGE,
  code: STOREWIDE_DISCOUNT_CODE,
  message: `Fyndkväll! ${STOREWIDE_DISCOUNT_PERCENTAGE}% på allt med koden`,
};

/**
 * Countdown for a GENUINE drop deadline only. Off by default: there is no real
 * deadline right now, and a countdown on a non-genuine deadline is forbidden
 * (both legally and by the design brief). To run a real timed drop, set
 * enabled: true and endsAt to the true end time; it renders nothing once the
 * date has passed.
 */
export const COUNTDOWN = {
  enabled: false,
  endsAt: "",
  label: "Släppet stänger om",
};

export const EMAIL_POPUP = {
  enabled: true,
  discountPercentage: STOREWIDE_DISCOUNT_PERCENTAGE,
  code: STOREWIDE_DISCOUNT_CODE,
  heading: "Häng med på skattjakten",
  subheading: `Skriv upp dig och få ${STOREWIDE_DISCOUNT_PERCENTAGE}% på din första beställning. Först till kvarn, lagret är begränsat.`,
};
