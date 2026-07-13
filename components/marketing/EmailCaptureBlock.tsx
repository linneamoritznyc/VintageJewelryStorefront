"use client";

import { useState } from "react";
import Link from "next/link";
import type { EmailPopupContent } from "@/lib/content/types";
import { CONSENT_TEXT } from "@/components/marketing/EmailPopup";

/**
 * Inline email-capture block for the homepage. Offers the same storewide code
 * as the popup and banner (single source in the content layer). Same GDPR
 * handling as the popup: unchecked consent checkbox, honeypot, submission to
 * the shared /api/subscribe endpoint (Shopify is the system of record).
 */
export function EmailCaptureBlock({ content }: { content: EmailPopupContent }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          source: "footer-block",
          website: honeypot,
        }),
      });
    } catch {
      // Non-fatal: still show the code so the visitor gets their discount.
    }
    setSubmitted(true);
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4">
      <div className="border-y border-ink/10 px-4 py-12 text-center sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-plum-soft">
          Nyhetsbrev
        </p>
        <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          {content.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-plum-soft">
          Få {content.discountPercentage}% på din första beställning och var
          först när nya fynd släpps.
        </p>

        {submitted ? (
          <div className="mx-auto mt-8 max-w-sm">
            <p className="text-plum-soft">Tack! Din kod:</p>
            <p className="mt-3 inline-block border border-ink px-6 py-2 font-display text-xl tracking-[0.14em] text-ink">
              {content.code}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mx-auto mt-8 max-w-sm">
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
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="Din e-postadress"
                aria-label="E-postadress"
                className="min-w-0 flex-1 border-b border-ink/30 bg-transparent px-1 py-3 text-ink placeholder:text-plum-soft/60 focus:border-ink focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-pill bg-ink px-7 py-3 text-sm font-semibold text-cream transition hover:bg-plum"
              >
                Häng på
              </button>
            </div>
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
            {error && <p className="mt-2 text-xs text-fuchsia-deep">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
