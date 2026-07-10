"use client";

import { useState } from "react";
import { EMAIL_POPUP } from "@/lib/config/promotions";

/**
 * Inline email-capture block for the homepage. Offers the same storewide code
 * as the popup and banner (single source in config/promotions). Stubbed submit
 * — wire to the real list at the marked TODO.
 */
export function EmailCaptureBlock() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError("Ange en giltig e-postadress.");
      return;
    }
    // TODO(live): POST the email to the marketing list / Shopify customer API.
    setSubmitted(true);
  };

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="overflow-hidden rounded-3xl bg-plum px-6 py-10 text-center text-cream sm:px-12 sm:py-14">
        <span aria-hidden className="text-3xl">
          ✧
        </span>
        <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
          {EMAIL_POPUP.heading}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-cream/80">
          Få {EMAIL_POPUP.discountPercentage}% på din första beställning och var
          först när nya fynd släpps.
        </p>

        {submitted ? (
          <div className="mx-auto mt-6 max-w-sm">
            <p className="text-cream/90">
              Tack! Din kod:{" "}
              <span className="rounded-pill bg-cream/20 px-3 py-1 font-bold tracking-wide">
                {EMAIL_POPUP.code}
              </span>
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            noValidate
            className="mx-auto mt-6 flex max-w-sm flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="din@epost.se"
              aria-label="E-postadress"
              className="min-w-0 flex-1 rounded-pill border border-transparent bg-cream px-5 py-3 text-ink placeholder:text-plum-soft/60 focus:border-fuchsia-hot focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-pill bg-fuchsia-brand px-6 py-3 font-bold text-white transition hover:bg-fuchsia-hot"
            >
              Häng på
            </button>
          </form>
        )}
        {error && <p className="mt-2 text-sm text-fuchsia-hot">{error}</p>}
      </div>
    </section>
  );
}
