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
 * Limited-time sale countdown (renders nothing once the date has passed).
 * Edit endsAt/label to run a new sale; set enabled: false to hide.
 */
export const COUNTDOWN = {
  enabled: true,
  endsAt: "2026-07-31T21:59:59+02:00",
  label: "Sommarfynden slutar om",
};

export const EMAIL_POPUP = {
  enabled: true,
  discountPercentage: STOREWIDE_DISCOUNT_PERCENTAGE,
  code: STOREWIDE_DISCOUNT_CODE,
  heading: "Häng med på skattjakten",
  subheading: `Skriv upp dig och få ${STOREWIDE_DISCOUNT_PERCENTAGE}% på din första beställning. Först till kvarn, lagret är begränsat.`,
};
