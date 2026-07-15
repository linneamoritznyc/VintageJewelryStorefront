"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { EmailPopupContent } from "@/lib/content/types";

/**
 * Inline email-capture block for the homepage. Offers the same storewide code
 * as the popup (single source in the content layer). Consent is unchecked by
 * default; submits to /api/lead, which fans the address out to every
 * configured sink (Shopify customer list, Google Sheet).
 */
export function EmailCaptureBlock({ content }: { content: EmailPopupContent }) {
  const t = useTranslations("emailCapture");
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
      setError(t("invalidEmail"));
      return;
    }
    if (!consent) {
      setError(t("consentRequired"));
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
      setError(t("genericError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="grid items-center gap-8 border-y border-line py-14 sm:grid-cols-2 sm:gap-14">
        <div className="max-w-md">
          <p className="meta">{t("eyebrow")}</p>
          <h2 className="mt-3 text-heading font-light text-ink">{content.heading}</h2>
        </div>
        <div>
          {submitted ? (
            <p className="text-body text-ink">
              {t("yourCode")}{" "}
              <span className="mono border border-line px-3 py-1 font-medium">{content.code}</span>
            </p>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="flex flex-wrap gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder={t("emailPlaceholder")}
                  aria-label={t("emailLabel")}
                  className="min-w-[220px] flex-1 border border-input-border bg-bg px-4 py-3 text-body text-ink placeholder:text-placeholder focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="whitespace-nowrap border border-accent bg-accent px-6 py-3 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover disabled:opacity-60"
                >
                  {submitting ? t("sending") : t("submit")}
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
                {t("consent")}
              </label>
            </form>
          )}
          {error && <p className="mt-2 text-small italic text-error">{error}</p>}
        </div>
      </div>
    </section>
  );
}
