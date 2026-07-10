"use client";

import { useEffect, useState } from "react";
import { EMAIL_POPUP } from "@/lib/config/promotions";

/**
 * Once-per-session email-capture popup offering the storewide 10% (same code
 * as the announcement banner — kept consistent via config/promotions). Shows a
 * few seconds after load, at most once per browser session.
 *
 * The submit is a stubbed capture: it just reveals the code. Wire this to a
 * real list (Shopify customer / Klaviyo / etc.) at the marked TODO.
 */
const SESSION_KEY = "vjs-email-popup-seen";
const SHOW_DELAY_MS = 6000;

export function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!EMAIL_POPUP.enabled) return;
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    const id = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  const dismiss = () => {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError("Ange en giltig e-postadress.");
      return;
    }
    // TODO(live): POST the email to the marketing list / Shopify customer API.
    window.sessionStorage.setItem(SESSION_KEY, "1");
    setSubmitted(true);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-popup-title"
    >
      <button
        type="button"
        aria-label="Stäng"
        className="absolute inset-0 animate-fade-in bg-ink/50"
        onClick={dismiss}
      />

      <div className="relative w-full max-w-md animate-pop-in overflow-hidden rounded-3xl bg-cream shadow-pop">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Stäng"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/70 p-1.5 text-ink/70 transition hover:bg-white hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M4.5 4.5l9 9M13.5 4.5l-9 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="bg-gradient-to-br from-fuchsia-brand to-plum px-6 py-8 text-center text-white">
          <span aria-hidden className="text-4xl">
            ✧
          </span>
          <p className="mt-1 text-4xl font-extrabold">
            {EMAIL_POPUP.discountPercentage}%
          </p>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
            på din första beställning
          </p>
        </div>

        <div className="px-6 py-6">
          {submitted ? (
            <div className="text-center">
              <h3 className="font-display text-xl font-bold text-ink">
                Välkommen till jakten! 🎉
              </h3>
              <p className="mt-2 text-sm text-plum-soft">
                Använd koden i kassan för {EMAIL_POPUP.discountPercentage}% rabatt:
              </p>
              <p className="mt-3 inline-block rounded-pill bg-gold-soft/60 px-5 py-2 text-lg font-extrabold tracking-wider text-plum">
                {EMAIL_POPUP.code}
              </p>
              <button
                type="button"
                onClick={dismiss}
                className="mt-5 block w-full rounded-pill bg-ink px-5 py-3 font-bold text-cream transition hover:bg-plum"
              >
                Börja fynda
              </button>
            </div>
          ) : (
            <>
              <h3
                id="email-popup-title"
                className="text-center font-display text-xl font-bold text-ink"
              >
                {EMAIL_POPUP.heading}
              </h3>
              <p className="mt-2 text-center text-sm text-plum-soft">
                {EMAIL_POPUP.subheading}
              </p>
              <form onSubmit={submit} noValidate className="mt-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="din@epost.se"
                  aria-label="E-postadress"
                  className="w-full rounded-pill border border-sand bg-white px-5 py-3 text-ink placeholder:text-plum-soft/60 focus:border-fuchsia-brand focus:outline-none"
                />
                {error && (
                  <p className="mt-1.5 text-xs text-fuchsia-deep">{error}</p>
                )}
                <button
                  type="submit"
                  className="mt-3 w-full rounded-pill bg-fuchsia-brand px-5 py-3 font-bold text-white transition hover:bg-fuchsia-deep"
                >
                  Ge mig rabatten
                </button>
              </form>
              <button
                type="button"
                onClick={dismiss}
                className="mt-3 block w-full text-center text-xs text-plum-soft underline transition hover:text-ink"
              >
                Nej tack, jag betalar fullt pris
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
