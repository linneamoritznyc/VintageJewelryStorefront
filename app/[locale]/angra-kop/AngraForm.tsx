"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Choice = "cash" | "credit";

/**
 * "Ångra ditt köp" flow (mandated cancellation right, June 19 2026 law).
 * No login wall: order number + email is enough. Both refund paths get equal
 * visual weight; cash is the default selection and is never subordinate to
 * store credit. Stubbed submit (no live order lookup yet), marked below.
 */
export function AngraForm() {
  const t = useTranslations("cancelPurchase");
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"lookup" | "choose" | "done">("lookup");
  const [choice, setChoice] = useState<Choice>("cash");
  const [error, setError] = useState<string | null>(null);

  function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t("formError"));
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
      <div className="mt-8 border border-line bg-bg-panel p-6">
        <p className="meta">{t("confirmedLabel")}</p>
        <p className="mt-2 text-sub text-ink">
          {choice === "cash" ? t("cashDoneTitle") : t("creditDoneTitle")}
        </p>
        <p className="mt-2 text-body text-ink-muted">
          {choice === "cash" ? t("cashDoneBody") : t("creditDoneBody")}
        </p>
      </div>
    );
  }

  if (step === "choose") {
    return (
      <form onSubmit={confirm} className="mt-8">
        <p className="meta">{t("order", { number: orderNumber })}</p>
        <p className="mt-2 text-body text-ink-muted">{t("chooseRefund")}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label
            className={`block cursor-pointer border p-4 transition ${
              choice === "cash" ? "border-2 border-accent bg-bg-selected" : "border-line"
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="choice"
                value="cash"
                checked={choice === "cash"}
                onChange={() => setChoice("cash")}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sub text-ink">{t("cashTitle")}</span>
            </span>
            <span className="mt-2 block text-body text-ink-muted">{t("cashDescription")}</span>
          </label>

          <label
            className={`block cursor-pointer border p-4 transition ${
              choice === "credit" ? "border-2 border-accent bg-bg-selected" : "border-line"
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="choice"
                value="credit"
                checked={choice === "credit"}
                onChange={() => setChoice("credit")}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sub text-ink">{t("creditTitle")}</span>
            </span>
            <span className="mt-2 block text-body text-ink-muted">{t("creditDescription")}</span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-5 w-full border border-accent bg-accent px-6 py-3.5 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover sm:w-auto"
        >
          {t("confirm")}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={lookup}
      noValidate
      className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="order" className="meta">
          {t("orderNumber")}
        </label>
        <input
          id="order"
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="#1234"
          className="mt-1 w-full border border-input-border bg-bg px-4 py-2.5 text-ink placeholder:text-placeholder focus:border-accent focus:outline-none"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="email" className="meta">
          {t("email")}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@epost.se"
          className="mt-1 w-full border border-input-border bg-bg px-4 py-2.5 text-ink placeholder:text-placeholder focus:border-accent focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="border border-ink px-6 py-2.5 text-body text-ink transition hover:bg-ink hover:text-bg"
      >
        {t("continue")}
      </button>
      {error && <p className="text-small italic text-error sm:basis-full">{error}</p>}
    </form>
  );
}
