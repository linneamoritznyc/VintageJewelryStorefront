"use client";

import { useState } from "react";
import type { EmailPopupContent } from "@/lib/content/types";

/**
 * Inline email-capture block for the homepage. Offers the same storewide code
 * as the popup (single source in the content layer). Consent is unchecked by
 * default; submits to /api/lead, which fans the address out to every
 * configured sink (Shopify customer list, Google Sheet).
 */
export function EmailCaptureBlock({ content }: { content: EmailPopupContent }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify({ email, consent, company, source: "inline" }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Något gick fel. Försök igen om en stund.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="border border-rule bg-ink px-6 py-10 text-center text-paper sm:px-12 sm:py-14">
        <p className="meta text-paper/70">Bli medlem</p>
        <h2 className="mt-2 font-display text-2xl text-paper sm:text-3xl">
          {content.heading}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-paper/80">
          Nya medlemmar får {content.discountPercentage}% på första
          beställningen. Vi mejlar när nya fynd släpps ur lagret.
        </p>

        {submitted ? (
          <div className="mx-auto mt-6 max-w-sm">
            <p className="text-paper/90">
              Din kod:{" "}
              <span className="mono border border-paper/40 px-3 py-1 font-medium tracking-wide">
                {content.code}
              </span>
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            noValidate
            className="mx-auto mt-6 max-w-sm text-left"
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="din@epost.se"
                aria-label="E-postadress"
                className="min-w-0 flex-1 border border-transparent bg-paper px-5 py-3 text-ink placeholder:text-ink-faint focus:border-paper focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-paper px-6 py-3 font-mono text-xs uppercase tracking-meta text-ink transition hover:bg-paper-sunk disabled:opacity-60"
              >
                {submitting ? "Skickar" : "Bli medlem"}
              </button>
            </div>
            {/* Honeypot: hidden from real users. */}
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <label className="mt-3 flex items-start gap-2 text-xs text-paper/80">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  setError(null);
                }}
                className="mt-0.5 h-4 w-4 flex-shrink-0 border-paper/40 accent-paper"
              />
              Jag vill få nyhetsbrev med erbjudanden och nya fynd. Jag kan
              avregistrera mig när som helst.
            </label>
          </form>
        )}
        {error && <p className="mt-2 text-sm text-signal">{error}</p>}
      </div>
    </section>
  );
}
