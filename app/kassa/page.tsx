"use client";

import Link from "next/link";
import { useState } from "react";
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
      setStatus(result.message ?? "Kassan är inte tillgänglig än.");
    }
  }

  if (isReady && cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <span aria-hidden className="text-5xl">
          🧺
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">
          Din varukorg är tom
        </h1>
        <p className="mt-2 text-plum-soft">
          Fyll den med fynd innan du går till kassan.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-pill bg-fuchsia-brand px-6 py-3 font-bold text-white transition hover:bg-fuchsia-deep"
        >
          Till startsidan
        </Link>
      </div>
    );
  }

  const discountAmount =
    Number(cart.subtotal.amount) - Number(cart.total.amount);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
        Kassa
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Line items */}
        <ul className="divide-y divide-sand rounded-2xl bg-white p-4 shadow-card">
          {cart.lines.map((line) => {
            const m = line.merchandise;
            const hasVariant = m.variantTitle && m.variantTitle !== "Default Title";
            return (
              <li key={line.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                {m.image && (
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                    <ProductImage image={m.image} className="h-full w-full" />
                  </div>
                )}
                <div className="flex flex-1 flex-col">
                  <p className="font-semibold text-ink">{m.productTitle}</p>
                  {hasVariant && (
                    <p className="text-xs text-plum-soft">{m.variantTitle}</p>
                  )}
                  {m.bundleId && (
                    <span className="mt-1 inline-block w-fit rounded-pill bg-gold-soft/40 px-2 py-0.5 text-[11px] font-semibold text-plum">
                      🎁 Del av ditt paket
                    </span>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-pill border border-sand">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        aria-label="Minska antal"
                        className="px-2.5 py-1 text-ink transition hover:text-fuchsia-brand"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        disabled={line.quantity >= Math.max(1, m.quantityAvailable)}
                        aria-label="Öka antal"
                        className="px-2.5 py-1 text-ink transition hover:text-fuchsia-brand disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-ink">
                        {formatMoney({
                          amount: (
                            Number(m.price.amount) * line.quantity
                          ).toFixed(2),
                          currencyCode: m.price.currencyCode,
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        aria-label={`Ta bort ${m.productTitle}`}
                        className="text-plum-soft/70 transition hover:text-fuchsia-deep"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path
                            d="M4 4l8 8M12 4l-8 8"
                            stroke="currentColor"
                            strokeWidth="2"
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
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">
              Sammanfattning
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-plum-soft">
                <dt>Delsumma</dt>
                <dd>{formatMoney(cart.subtotal)}</dd>
              </div>
              {cart.discount && (
                <div className="flex justify-between font-semibold text-fuchsia-deep">
                  <dt>Rabatt ({cart.discount.code || cart.discount.title})</dt>
                  <dd>
                    −
                    {formatMoney({
                      amount: discountAmount.toFixed(2),
                      currencyCode: cart.total.currencyCode,
                    })}
                  </dd>
                </div>
              )}
              <div className="flex justify-between text-plum-soft">
                <dt>Frakt</dt>
                <dd>Beräknas i kassan</dd>
              </div>
              <div className="flex justify-between border-t border-sand pt-2 text-base font-extrabold text-ink">
                <dt>Att betala</dt>
                <dd>{formatMoney(cart.total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={pending}
              className="mt-5 w-full rounded-pill bg-fuchsia-brand px-6 py-3.5 font-bold text-white transition hover:bg-fuchsia-deep disabled:opacity-60"
            >
              {pending ? "Öppnar kassan…" : "Betala säkert via Shopify"}
            </button>

            {status && (
              <div className="mt-3 rounded-xl bg-gold-soft/30 px-4 py-3 text-sm text-plum">
                {status}
              </div>
            )}

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-plum-soft">
              <span aria-hidden>🔒</span> Betalning, frakt och moms hanteras
              säkert av Shopify.
            </p>
          </div>

          <Link
            href="/"
            className="mt-3 block text-center text-sm text-plum-soft underline transition hover:text-ink"
          >
            Fortsätt handla
          </Link>
        </aside>
      </div>
    </div>
  );
}
