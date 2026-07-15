"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { ProductImage } from "@/components/ui/ProductImage";
import { ArchivePlaceholder } from "@/components/ui/ArchivePlaceholder";
import { formatMoney } from "@/lib/utils/format";
import type { CartLine } from "@/lib/shopify/types";

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeLine, applyDiscount, removeDiscount } =
    useCart();

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
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in-right flex-col border-l border-line bg-bg">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-sub text-ink">
            Din varukorg{" "}
            {cart.totalQuantity > 0 && (
              <span className="text-ink-muted">({cart.totalQuantity})</span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Stäng"
            className="p-1.5 text-ink-muted transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-body italic text-ink-label">Din varukorg är tom.</p>
            <Link
              href="/kategori/orhangen"
              onClick={closeCart}
              className="border border-accent bg-accent px-5 py-2.5 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover"
            >
              Utforska fynden
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-3">
              {cart.lines.map((line) => (
                <CartLineRow
                  key={line.id}
                  line={line}
                  onUpdate={updateQuantity}
                  onRemove={removeLine}
                />
              ))}
            </ul>

            <div className="border-t border-line px-5 py-4">
              <CouponRow
                appliedCode={cart.discount?.code ?? null}
                appliedTitle={cart.discount?.title ?? null}
                onApply={applyDiscount}
                onRemove={removeDiscount}
              />

              {/* 14-day right of withdrawal, disclosed here before purchase. */}
              <p className="mt-4 text-small italic text-ink-label">
                14 dagars ångerrätt enligt distansavtalslagen.
              </p>

              <dl className="mt-3 space-y-1.5 text-body">
                <div className="flex justify-between text-ink-muted">
                  <dt>Delsumma</dt>
                  <dd className="mono">{formatMoney(cart.subtotal)}</dd>
                </div>
                {cart.discount && (
                  <div className="flex justify-between italic text-accent">
                    <dt>Rabatt ({cart.discount.percentage}%)</dt>
                    <dd className="mono">
                      −
                      {formatMoney({
                        amount: (Number(cart.subtotal.amount) - Number(cart.total.amount)).toFixed(
                          2,
                        ),
                        currencyCode: cart.total.currencyCode,
                      })}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between pt-1 text-sub text-ink">
                  <dt>Att betala</dt>
                  <dd className="mono">{formatMoney(cart.total)}</dd>
                </div>
              </dl>

              <Link
                href="/kassa"
                onClick={closeCart}
                className="mt-4 block border border-accent bg-accent px-5 py-3 text-center text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover"
              >
                Till kassan
              </Link>
              <p className="mt-2 text-center text-small italic text-ink-label">
                Frakt och betalning beräknas i nästa steg.
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
  const hasVariant = m.variantTitle && m.variantTitle !== "Default Title" && !m.isBundle;

  return (
    <li className="flex gap-3 border-b border-line py-3 last:border-b-0">
      {m.isBundle ? (
        <ArchivePlaceholder label="Ask" className="h-20 w-20 flex-shrink-0" />
      ) : (
        m.image && (
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden border border-line">
            <ProductImage image={m.image} className="h-full w-full" />
          </div>
        )
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <div>
            {m.isBundle ? (
              <p className="text-body text-ink">{m.productTitle}</p>
            ) : (
              <Link
                href={`/produkt/${m.productHandle}`}
                className="text-body text-ink transition hover:text-accent"
              >
                {m.productTitle}
              </Link>
            )}
            {hasVariant && <p className="text-small italic text-ink-label">{m.variantTitle}</p>}
            {m.isBundle && m.bundleContents && (
              <ul className="mt-1 space-y-0.5 text-small italic text-ink-label">
                {m.bundleContents.map((item, i) => (
                  <li key={i}>{item.productTitle}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(line.id)}
            aria-label={`Ta bort ${m.productTitle}`}
            className="h-6 text-ink-label transition hover:text-ink"
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

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center border border-input-border">
            <button
              type="button"
              onClick={() => onUpdate(line.id, line.quantity - 1)}
              aria-label="Minska antal"
              className="px-2.5 py-1 text-ink transition hover:text-accent"
            >
              −
            </button>
            <span className="mono min-w-[1.5rem] text-center text-body">{line.quantity}</span>
            <button
              type="button"
              onClick={() => onUpdate(line.id, line.quantity + 1)}
              disabled={!m.isBundle && line.quantity >= Math.max(1, m.quantityAvailable)}
              aria-label="Öka antal"
              className="px-2.5 py-1 text-ink transition hover:text-accent disabled:opacity-30"
            >
              +
            </button>
          </div>
          <span className="mono text-body text-ink">
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
  onApply,
  onRemove,
}: {
  appliedCode: string | null;
  appliedTitle: string | null;
  onApply: (code: string) => boolean;
  onRemove: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between border border-line px-3 py-2.5">
        <p className="text-body italic text-accent">
          {appliedCode}
          {appliedTitle && <span className="text-ink-muted">, {appliedTitle}</span>}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="text-small italic text-ink-muted underline underline-offset-2 hover:text-ink"
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
      setError("Ogiltig kod.");
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="coupon" className="meta">
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
          placeholder="T.ex. LÅDAN10"
          autoCapitalize="characters"
          className="min-w-0 flex-1 border border-input-border bg-bg px-4 py-2 text-body uppercase text-ink placeholder:normal-case placeholder:text-placeholder focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="border border-ink px-4 py-2 text-body text-ink transition hover:bg-ink hover:text-bg"
        >
          Använd
        </button>
      </div>
      {error && <p className="mt-1.5 text-small italic text-error">{error}</p>}
    </form>
  );
}
