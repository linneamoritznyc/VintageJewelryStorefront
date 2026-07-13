"use client";

import Link from "next/link";
import { useConsent } from "@/lib/consent/ConsentContext";

/**
 * GDPR cookie-consent banner. Shows once, at the bottom, until the visitor
 * chooses. "Endast nödvändiga" is a real, equally prominent option (no dark
 * pattern, no pre-ticked analytics). Nothing tracking loads until the visitor
 * picks "Acceptera alla", see components/marketing/Analytics.tsx.
 */
export function CookieConsent() {
  const { status, ready, accept, reject } = useConsent();

  // Hidden until hydrated and only while the choice is still open.
  if (!ready || status !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-samtycke"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-cream/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-plum-soft">
          Vi använder nödvändiga cookies för att sajten ska fungera, och med ditt
          samtycke även cookies för analys och marknadsföring. Läs mer i vår{" "}
          <Link href="/integritetspolicy" className="font-semibold text-fuchsia-brand underline">
            integritetspolicy
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-pill border border-sand bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-fuchsia-brand"
          >
            Endast nödvändiga
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-pill bg-fuchsia-brand px-4 py-2 text-sm font-bold text-white transition hover:bg-fuchsia-deep"
          >
            Acceptera alla
          </button>
        </div>
      </div>
    </div>
  );
}
