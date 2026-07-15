"use client";

import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart/CartContext";
import { startCheckout } from "@/lib/checkout";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatMoney } from "@/lib/utils/format";

/**
 * Checkout / order-summary page. Payment, shipping and taxes are handled by
 * Shopify's hosted checkout; this page is the local summary + the single
 * handoff point (`startCheckout`). Until credentials exist it renders a clear
 * "coming soon" state instead of redirecting.
 */
export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const { cart, isReady, updateQuantity, removeLine } = useCart();
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleCheckout() {
    setPending(true);
    const result = await startCheckout(cart);
    setPending(false);
    if (result.ready && result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
    } else {
      setStatus(t("notReadyFallback"));
    }
  }

  if (isReady && cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-heading font-light text-ink">{t("emptyTitle")}</h1>
        <p className="mt-2 text-body italic text-ink-label">{t("emptySubtitle")}</p>
        <Link
          href="/"
          className="mt-6 inline-block border border-accent bg-accent px-6 py-3 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover"
        >
          {t("backToHome")}
        </Link>
      </div>
    );
  }

  const discountAmount = Number(cart.subtotal.amount) - Number(cart.total.amount);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <h1 className="text-heading font-light text-ink">{t("title")}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Line items */}
        <ul className="divide-y divide-line border border-line bg-bg p-4">
          {cart.lines.map((line) => {
            const m = line.merchandise;
            const hasVariant = m.variantTitle && m.variantTitle !== "Default Title" && !m.isBundle;
            return (
              <li key={line.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                {m.image && (
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden border border-line">
                    <ProductImage image={m.image} className="h-full w-full" />
                  </div>
                )}
                <div className="flex flex-1 flex-col">
                  <p className="text-body text-ink">{m.productTitle}</p>
                  {hasVariant && (
                    <p className="text-small italic text-ink-label">{m.variantTitle}</p>
                  )}
                  {m.isBundle && m.bundleContents && (
                    <ul className="mt-1 space-y-0.5 text-small italic text-ink-label">
                      {m.bundleContents.map((item, i) => (
                        <li key={i}>{item.productTitle}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center border border-input-border">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        aria-label={tCommon("decreaseQty")}
                        className="px-2.5 py-1 text-ink transition hover:text-accent"
                      >
                        −
                      </button>
                      <span className="mono min-w-[1.5rem] text-center text-body">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        disabled={!m.isBundle && line.quantity >= Math.max(1, m.quantityAvailable)}
                        aria-label={tCommon("increaseQty")}
                        className="px-2.5 py-1 text-ink transition hover:text-accent disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="mono text-body text-ink">
                        {formatMoney({
                          amount: (Number(m.price.amount) * line.quantity).toFixed(2),
                          currencyCode: m.price.currencyCode,
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        aria-label={t("remove", { title: m.productTitle })}
                        className="text-ink-label transition hover:text-ink"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path
                            d="M4 4l8 8M12 4l-8 8"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line bg-bg-panel p-5">
            <h2 className="text-sub text-ink">{t("summary")}</h2>
            <dl className="mt-4 space-y-2 text-body">
              <div className="flex justify-between text-ink-muted">
                <dt>{t("subtotal")}</dt>
                <dd className="mono">{formatMoney(cart.subtotal)}</dd>
              </div>
              {cart.discount && (
                <div className="flex justify-between italic text-accent">
                  <dt>{t("discount", { code: cart.discount.code })}</dt>
                  <dd className="mono">
                    −
                    {formatMoney({
                      amount: discountAmount.toFixed(2),
                      currencyCode: cart.total.currencyCode,
                    })}
                  </dd>
                </div>
              )}
              <div className="flex justify-between text-ink-muted">
                <dt>{t("shipping")}</dt>
                <dd>{t("shippingCalculated")}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-sub text-ink">
                <dt>{t("toPay")}</dt>
                <dd className="mono">{formatMoney(cart.total)}</dd>
              </div>
            </dl>

            {/* 14-day right of withdrawal, disclosed before purchase. */}
            <p className="mt-3 text-small italic text-ink-label">{t("withdrawalNote")}</p>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={pending}
              className="mt-5 w-full border border-accent bg-accent px-6 py-3.5 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover disabled:opacity-60"
            >
              {pending ? t("opening") : t("payButton")}
            </button>

            {status && (
              <div className="mt-3 border border-line bg-bg px-4 py-3 text-body italic text-ink-muted">
                {status}
              </div>
            )}

            <p className="mt-3 text-center text-small italic text-ink-label">
              {t("securePaymentNote")}
            </p>
          </div>

          <Link
            href="/"
            className="mt-3 block text-center text-small italic text-ink-muted underline underline-offset-2 transition hover:text-ink"
          >
            {t("continueShopping")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
