"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EmailPopupContent } from "@/lib/content/types";

/**
 * Once-per-session email-capture popup offering the storewide discount (same
 * code as the announcement banner, kept consistent via the content layer).
 *
 * GDPR: explicit consent checkbox, unchecked by default; the exact consent
 * wording lives in CONSENT_TEXT and is sent with the submission so the
 * system of record (Shopify) stores what was agreed to. A hidden honeypot
 * field filters bots server-side.
 */
const SESSION_KEY = "vjs-email-popup-seen";
const SHOW_DELAY_MS = 6000;

export const CONSENT_TEXT =
  "Jag vill få nyhetsbrev med erbjudanden och nya fynd från Fyndlådan. Jag kan avregistrera mig när som helst.";

export function EmailPopup({ content }: { content: EmailPopupContent }) {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!content.enabled) return;
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    const id = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [content.enabled]);

  const dismiss = () => {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError("Ange en giltig e-postadress.");
      return;
    }
    if (!consent) {
      setError("Kryssa i rutan för att prenumerera.");
      return;
    }
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          consent: true,
          consentText: CONSENT_TEXT,
          source: "popup",
          website: honeypot,
        }),
      });
    } catch {
      // Non-fatal: still reveal the code so the visitor gets their discount.
    }
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
        className="absolute inset-0 animate-fade-in bg-ink/40"
        onClick={dismiss}
      />

      <div className="relative w-full max-w-md animate-pop-in bg-white px-6 py-10 shadow-pop sm:px-10">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Stäng"
          className="absolute right-3 top-3 z-10 p-2 text-ink/50 transition hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M4.5 4.5l9 9M13.5 4.5l-9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-plum-soft">
              Välkommen till jakten
            </p>
            <h3 className="mt-3 font-display text-3xl text-ink">
              Din kod är här
            </h3>
            <p className="mt-3 text-sm text-plum-soft">
              Använd koden i kassan för {content.discountPercentage}% rabatt:
            </p>
            <p className="mt-4 inline-block border border-ink px-6 py-2 font-display text-xl tracking-[0.14em] text-ink">
              {content.code}
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-6 block w-full rounded-pill bg-ink px-5 py-3 text-sm font-semibold text-cream transition hover:bg-plum"
            >
              Börja fynda
            </button>
          </div>
        ) : (
          <>
            <p className="meta text-center text-ink-faint">
              Bli medlem · {content.discountPercentage}% rabatt
            </p>
            <h3
              id="email-popup-title"
              className="mt-3 text-center font-display text-4xl text-ink"
            >
              {content.heading}
            </h3>
            <p className="mt-3 text-center text-sm leading-relaxed text-plum-soft">
              {content.subheading}
            </p>
            <form onSubmit={submit} noValidate className="mt-6">
              {/* Honeypot: hidden from real users, bots fill it */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-px w-px opacity-0"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="Din e-postadress"
                aria-label="E-postadress"
                className="w-full border-b border-ink/30 bg-transparent px-1 py-3 text-center text-ink placeholder:text-plum-soft/60 focus:border-ink focus:outline-none"
              />
              <label className="mt-4 flex items-start gap-2.5 text-left text-xs leading-relaxed text-plum-soft">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    setError(null);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
                />
                <span>
                  {CONSENT_TEXT}{" "}
                  <Link
                    href="/integritetspolicy"
                    className="underline underline-offset-2 hover:text-ink"
                  >
                    Läs mer i vår integritetspolicy.
                  </Link>
                </span>
              </label>
              {error && (
                <p className="mt-2 text-xs text-fuchsia-deep">{error}</p>
              )}
              <button
                type="submit"
                className="mt-5 w-full rounded-pill bg-ink px-5 py-3 text-sm font-semibold text-cream transition hover:bg-plum"
              >
                Ge mig rabatten
              </button>
            </form>
            <button
              type="button"
              onClick={dismiss}
              className="mt-4 block w-full text-center text-xs text-plum-soft underline underline-offset-2 transition hover:text-ink"
            >
              Nej tack, jag betalar fullt pris
            </button>
          </>
        )}
      </div>
    </div>
  );
}
