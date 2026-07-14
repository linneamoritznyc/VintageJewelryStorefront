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
        className="absolute inset-0 animate-fade-in bg-ink/40"
        onClick={dismiss}
      />

      <div className="relative w-full max-w-md border border-line bg-bg">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Stäng"
          className="absolute right-3 top-3 z-10 p-1.5 text-ink-muted transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M4.5 4.5l9 9M13.5 4.5l-9 9"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="border-b border-line px-6 py-8 text-center">
          <p className="meta">Bli medlem</p>
          <p className="mono mt-1 text-hero text-accent" style={{ fontSize: "clamp(40px, 6vw, 56px)" }}>
            {content.discountPercentage}%
          </p>
          <p className="text-body text-ink-muted">på din första beställning</p>
        </div>

        <div className="px-6 py-6">
          {submitted ? (
            <div className="text-center">
              <h3 className="font-light text-heading text-ink">Välkommen</h3>
              <p className="mt-2 text-body text-ink-muted">
                Din kod för {content.discountPercentage}% rabatt i kassan:
              </p>
              <p className="mono mt-3 inline-block border border-line px-5 py-2 text-sub font-medium text-ink">
                {content.code}
              </p>
              <button
                type="button"
                onClick={dismiss}
                className="mt-5 block w-full border border-accent bg-accent px-5 py-3 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover"
              >
                Se hela lagret
              </button>
            </div>
          ) : (
            <>
              <h3 id="email-popup-title" className="text-center font-light text-heading text-ink">
                {content.heading}
              </h3>
              <p className="mt-2 text-center text-body text-ink-muted">
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
                  className="w-full border border-input-border bg-bg px-4 py-3 text-body text-ink placeholder:text-placeholder focus:border-accent focus:outline-none"
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
                <label className="mt-3 flex items-start gap-2 text-small text-ink-muted">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      setError(null);
                    }}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 border-input-border accent-accent"
                  />
                  Jag vill få nyhetsbrev med erbjudanden och nya fynd. Jag kan
                  avregistrera mig när som helst.
                </label>
                {error && <p className="mt-1.5 text-small italic text-error">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-3 w-full border border-accent bg-accent px-5 py-3 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover disabled:opacity-60"
                >
                  {submitting ? "Skickar" : "Bli medlem"}
                </button>
              </form>
              <button
                type="button"
                onClick={dismiss}
                className="mt-3 block w-full text-center text-small italic text-ink-muted underline underline-offset-2 transition hover:text-ink"
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
