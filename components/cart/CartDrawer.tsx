"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatMoney } from "@/lib/utils/format";
import { lotNumber } from "@/lib/utils/lot";
import type { AppliedDiscount, CartLine } from "@/lib/shopify/types";

export function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    updateQuantity,
    removeLine,
    applyDiscount,
    removeDiscount,
  } = useCart();

  // Lock body scroll while open.
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const isEmpty = cart.lines.length === 0;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Varukorg">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Stäng varukorg"
        className="absolute inset-0 animate-fade-in bg-ink/40"
        onClick={closeCart}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in-right flex-col border-l border-rule bg-paper">
        <div className="flex items-center justify-between border-b border-rule px-4 py-4">
          <h2 className="font-display text-xl text-ink">
            Din varukorg{" "}
            {cart.totalQuantity > 0 && (
              <span className="meta text-ink-faint">({cart.totalQuantity})</span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Stäng"
            className="p-1.5 text-ink/60 transition hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="meta text-ink-faint">Tom bricka</p>
            <p className="text-ink-muted">
              Din varukorg är tom. Dags att börja skattjakten.
            </p>
            <Link
              href="/kategori/orhangen"
              onClick={closeCart}
              className="meta bg-ink px-5 py-3 font-medium text-paper transition hover:bg-ink-muted"
            >
              Utforska fynden
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-4 py-3">
              {cart.lines.map((line) => (
                <CartLineRow
                  key={line.id}
                  line={line}
                  onUpdate={updateQuantity}
                  onRemove={removeLine}
                />
              ))}
            </ul>

            <div className="border-t border-sand px-4 py-4">
              <CouponRow
                appliedCode={cart.discount?.code ?? null}
                appliedTitle={cart.discount?.title ?? null}
                automaticDiscount={cart.discount?.isAutomatic ? cart.discount : null}
                onApply={applyDiscount}
                onRemove={removeDiscount}
              />

              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-plum-soft">
                  <dt>Delsumma</dt>
                  <dd>{formatMoney(cart.subtotal)}</dd>
                </div>
                {cart.discount && (
                  <div className="flex justify-between font-semibold text-fuchsia-deep">
                    <dt>Rabatt ({cart.discount.percentage}%)</dt>
                    <dd>
                      −
                      {formatMoney({
                        amount: (
                          Number(cart.subtotal.amount) - Number(cart.total.amount)
                        ).toFixed(2),
                        currencyCode: cart.total.currencyCode,
                      })}
                    </dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-rule pt-2 text-ink">
                  <dt className="font-medium">Att betala</dt>
                  <dd className="font-mono text-base font-medium tabular-nums">
                    {formatMoney(cart.total)}
                  </dd>
                </div>
              </dl>

              {/* 14-day right of withdrawal, disclosed before purchase (law).
                  Visible line, never buried in a footer link. */}
              <p className="mt-4 border-t border-rule pt-3 text-xs leading-snug text-ink-muted">
                14 dagars ångerrätt på alla köp. Du kan ångra köpet direkt online,
                ingen kundtjänst behövs.{" "}
                <Link
                  href="/angerratt"
                  onClick={closeCart}
                  className="underline underline-offset-2 hover:text-ink"
                >
                  Läs om ångerrätten
                </Link>
                .
              </p>

              <Link
                href="/kassa"
                onClick={closeCart}
                className="meta mt-4 block bg-ink px-5 py-3.5 text-center font-medium text-paper transition hover:bg-ink-muted"
              >
                Till kassan
              </Link>
              <p className="meta mt-2 text-center text-ink-faint">
                Frakt och betalning i nästa steg
              </p>
              <p className="mt-1 text-center text-[11px] text-ink-faint">
                Betalning via Swish. Testnummer 123123123 (platshållare)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CartLineRow({
  line,
  onUpdate,
  onRemove,
}: {
  line: CartLine;
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const m = line.merchandise;
  const hasVariant = m.variantTitle && m.variantTitle !== "Default Title";

  return (
    <li className="flex gap-3 border-b border-rule py-3 last:border-b-0">
      {m.image && (
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-paper-sunk ring-1 ring-rule">
          <ProductImage image={m.image} className="h-full w-full" />
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <div>
            <p className="meta text-ink-faint">LOT {lotNumber(m.productHandle)}</p>
            <Link
              href={`/produkt/${m.productHandle}`}
              className="font-display text-ink transition hover:underline hover:underline-offset-4"
            >
              {m.productTitle}
            </Link>
            {hasVariant && (
              <p className="text-xs text-ink-faint">{m.variantTitle}</p>
            )}
            {m.bundleId && (
              <span className="meta mt-1 inline-block text-ink-muted ring-1 ring-rule px-2 py-0.5">
                Del av ditt paket
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(line.id)}
            aria-label={`Ta bort ${m.productTitle}`}
            className="h-6 text-plum-soft/70 transition hover:text-fuchsia-deep"
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

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center border border-rule">
            <button
              type="button"
              onClick={() => onUpdate(line.id, line.quantity - 1)}
              aria-label="Minska antal"
              className="px-2.5 py-1 text-ink transition hover:bg-paper-sunk"
            >
              −
            </button>
            <span className="min-w-[1.5rem] text-center font-mono text-sm tabular-nums">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdate(line.id, line.quantity + 1)}
              disabled={line.quantity >= Math.max(1, m.quantityAvailable)}
              aria-label="Öka antal"
              className="px-2.5 py-1 text-ink transition hover:bg-paper-sunk disabled:opacity-30"
            >
              +
            </button>
          </div>
          <span className="font-mono text-sm font-medium tabular-nums text-ink">
            {formatMoney({
              amount: (Number(m.price.amount) * line.quantity).toFixed(2),
              currencyCode: m.price.currencyCode,
            })}
          </span>
        </div>
      </div>
    </li>
  );
}

function CouponRow({
  appliedCode,
  appliedTitle,
  automaticDiscount,
  onApply,
  onRemove,
}: {
  appliedCode: string | null;
  appliedTitle: string | null;
  automaticDiscount: AppliedDiscount | null;
  onApply: (code: string) => boolean;
  onRemove: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-mint/15 px-3 py-2.5">
        <div className="text-sm">
          <span className="font-bold text-mint">✓ {appliedCode}</span>
          {appliedTitle && (
            <span className="ml-1 text-plum-soft">,  {appliedTitle}</span>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-semibold text-plum-soft underline transition hover:text-fuchsia-deep"
        >
          Ta bort
        </button>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onApply(value);
    if (ok) {
      setValue("");
      setError(null);
    } else {
      setError("Ogiltig kod. Dubbelkolla och försök igen.");
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      {automaticDiscount && (
        <p className="mb-2 text-xs font-semibold text-mint">
          ✓ {automaticDiscount.title} tillämpad automatiskt (−{automaticDiscount.percentage}%)
        </p>
      )}
      <label htmlFor="coupon" className="text-xs font-semibold text-plum-soft">
        Rabattkod
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id="coupon"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder="T.ex. FYND10"
          autoCapitalize="characters"
          className="min-w-0 flex-1 rounded-pill border border-sand bg-white px-4 py-2 text-sm uppercase tracking-wide text-ink placeholder:normal-case placeholder:tracking-normal placeholder:text-plum-soft/60 focus:border-fuchsia-brand focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-pill bg-ink px-4 py-2 text-sm font-bold text-cream transition hover:bg-plum"
        >
          Använd
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-fuchsia-deep">{error}</p>}
    </form>
  );
}
