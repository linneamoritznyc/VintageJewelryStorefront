"use client";

import { useState } from "react";

type Choice = "cash" | "credit";

/**
 * "Ångra ditt köp" flow (mandated cancellation right, June 19 2026 law).
 * No login wall: order number + email is enough. Both refund paths get equal
 * visual weight; cash is the default selection and is never subordinate to
 * store credit. Stubbed submit (no live order lookup yet), marked below.
 */
export function AngraForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"lookup" | "choose" | "done">("lookup");
  const [choice, setChoice] = useState<Choice>("cash");
  const [error, setError] = useState<string | null>(null);

  function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Ange ordernummer och en giltig e-postadress.");
      return;
    }
    setError(null);
    // TODO(live): look up the order via the Shopify Admin API and confirm it
    // falls within the 14-day window before advancing to the choice step.
    setStep("choose");
  }

  function confirm(e: React.FormEvent) {
    e.preventDefault();
    // TODO(live): create the refund (cash) or store-credit gift card via the
    // Shopify Admin API against the looked-up order.
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="mt-8 border border-rule bg-paper-raised p-6">
        <p className="meta">Bekräftat</p>
        <p className="mt-2 font-display text-xl text-ink">
          {choice === "cash" ? "Pengarna är på väg" : "Ditt tillgodo är klart"}
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          {choice === "cash"
            ? "Hela beloppet betalas tillbaka till samma kort eller konto inom några bankdagar."
            : "Ditt tillgodo på 110 procent av beloppet är redo att användas i kassan."}
        </p>
      </div>
    );
  }

  if (step === "choose") {
    return (
      <form onSubmit={confirm} className="mt-8">
        <p className="meta">Order {orderNumber}</p>
        <p className="mt-2 text-sm text-ink-muted">Välj hur du vill ha ersättningen.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label
            className={`block cursor-pointer border p-4 transition ${
              choice === "cash" ? "border-2 border-ink" : "border-rule"
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="choice"
                value="cash"
                checked={choice === "cash"}
                onChange={() => setChoice("cash")}
                className="h-4 w-4 accent-ink"
              />
              <span className="font-display text-lg text-ink">Pengarna tillbaka</span>
            </span>
            <span className="mt-2 block text-sm text-ink-muted">
              Vi betalar tillbaka hela beloppet till samma kort eller konto.
            </span>
          </label>

          <label
            className={`block cursor-pointer border p-4 transition ${
              choice === "credit" ? "border-2 border-ink" : "border-rule"
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="choice"
                value="credit"
                checked={choice === "credit"}
                onChange={() => setChoice("credit")}
                className="h-4 w-4 accent-ink"
              />
              <span className="font-display text-lg text-ink">Tillgodo hos oss</span>
            </span>
            <span className="mt-2 block text-sm text-ink-muted">
              Du får 110 procent av beloppet att handla för.
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-5 w-full bg-ink px-6 py-3.5 font-mono text-sm uppercase tracking-meta text-paper transition hover:bg-ink-muted sm:w-auto"
        >
          Bekräfta
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={lookup} noValidate className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="order" className="meta">
          Ordernummer
        </label>
        <input
          id="order"
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="#1234"
          className="mt-1 w-full border border-rule bg-paper-raised px-4 py-2.5 text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="email" className="meta">
          E-postadress
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@epost.se"
          className="mt-1 w-full border border-rule bg-paper-raised px-4 py-2.5 text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-ink px-6 py-2.5 font-mono text-sm uppercase tracking-meta text-paper transition hover:bg-ink-muted"
      >
        Fortsätt
      </button>
      {error && <p className="text-sm text-signal sm:basis-full">{error}</p>}
    </form>
  );
}
