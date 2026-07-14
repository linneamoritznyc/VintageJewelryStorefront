"use client";

import { useEffect, useState } from "react";
import type { EmailPopupContent } from "@/lib/content/types";

/**
 * Once-per-session email-capture popup offering the storewide discount (same
 * code as the announcement banner, kept consistent via the content layer).
 * Shows a few seconds after load, at most once per browser session.
 *
 * Consent is unchecked by default (pre-checked consent is invalid under
 * GDPR). Submits to /api/lead, which fans the address out to every
 * configured sink (Shopify customer list, Google Sheet); both are optional
 * and the request always succeeds from the customer's point of view.
 */
const SESSION_KEY = "vjs-email-popup-seen";
const SHOW_DELAY_MS = 6000;

export function EmailPopup({ content }: { content: EmailPopupContent }) {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
      setError("Kryssa i samtycket för att bli medlem.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, company, source: "popup" }),
      });
      if (!res.ok) throw new Error();
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setSubmitted(true);
    } catch {
      setError("Något gick fel. Försök igen om en stund.");
    } finally {
      setSubmitting(false);
    }
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

      <div className="relative w-full max-w-md border border-rule bg-paper">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Stäng"
          className="absolute right-3 top-3 z-10 p-1.5 text-ink/70 transition hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M4.5 4.5l9 9M13.5 4.5l-9 9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="border-b border-rule bg-ink px-6 py-6 text-center text-paper">
          <p className="meta text-paper/70">Bli medlem</p>
          <p className="mono mt-1 text-4xl font-medium">
            {content.discountPercentage}%
          </p>
          <p className="text-sm text-paper/85">på din första beställning</p>
        </div>

        <div className="px-6 py-6">
          {submitted ? (
            <div className="text-center">
              <h3 className="font-display text-xl text-ink">Välkommen</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Din kod för {content.discountPercentage}% rabatt i kassan:
              </p>
              <p className="mono mt-3 inline-block border border-rule px-5 py-2 text-lg font-medium tracking-wide text-ink">
                {content.code}
              </p>
              <button
                type="button"
                onClick={dismiss}
                className="mt-5 block w-full bg-ink px-5 py-3 font-mono text-xs uppercase tracking-meta text-paper transition hover:bg-ink-muted"
              >
                Se hela lagret
              </button>
            </div>
          ) : (
            <>
              <h3 id="email-popup-title" className="text-center font-display text-xl text-ink">
                {content.heading}
              </h3>
              <p className="mt-2 text-center text-sm text-ink-muted">
                {content.subheading}
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
                  className="w-full border border-rule bg-paper-raised px-5 py-3 text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
                />
                {/* Honeypot: hidden from real users, bots tend to fill any field. */}
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />
                <label className="mt-3 flex items-start gap-2 text-xs text-ink-muted">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      setError(null);
                    }}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 border-rule accent-ink"
                  />
                  Jag vill få nyhetsbrev med erbjudanden och nya fynd. Jag kan
                  avregistrera mig när som helst.
                </label>
                {error && <p className="mt-1.5 text-xs text-signal">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-3 w-full bg-ink px-5 py-3 font-mono text-xs uppercase tracking-meta text-paper transition hover:bg-ink-muted disabled:opacity-60"
                >
                  {submitting ? "Skickar" : "Bli medlem"}
                </button>
              </form>
              <button
                type="button"
                onClick={dismiss}
                className="mt-3 block w-full text-center text-xs text-ink-faint underline underline-offset-2 transition hover:text-ink"
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
