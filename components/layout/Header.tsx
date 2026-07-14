"use client";

import Link from "next/link";
import { useState } from "react";
import type { Collection } from "@/lib/shopify/types";
import { useCart } from "@/lib/cart/CartContext";

export function Header({ collections }: { collections: Collection[] }) {
  const { cart, openCart, isReady } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const count = cart.totalQuantity;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-6 py-4">
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="flex items-center justify-center p-1.5 text-ink lg:hidden"
            aria-label="Öppna meny"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d={menuOpen ? "M5 5l14 14M19 5L5 19" : "M4 7h16M4 12h16M4 17h16"}
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Kategorier">
            {collections.map((c) => (
              <Link
                key={c.handle}
                href={`/kategori/${c.handle}`}
                className="text-body italic text-ink-label transition hover:text-ink"
              >
                {c.title}
              </Link>
            ))}
          </nav>
        </div>

        <Link
          href="/"
          className="wordmark text-center text-ink"
          onClick={() => setMenuOpen(false)}
        >
          Fyndlådan
        </Link>

        <div className="flex items-center justify-end gap-5">
          <Link
            href="/paket"
            className="hidden border border-accent bg-accent px-4 py-2 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover lg:inline-block"
          >
            Skapa ditt paket
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="flex items-center gap-1.5 p-1.5 text-ink transition hover:text-accent"
            aria-label={`Öppna varukorg${count > 0 ? `, ${count} varor` : ""}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 8h12l-1 11a2 2 0 01-2 1.8H9a2 2 0 01-2-1.8L6 8z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <path
                d="M9 8a3 3 0 016 0"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            {isReady && count > 0 && (
              <span className="mono text-body text-accent">{count}</span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-line bg-bg px-6 py-3 lg:hidden"
          aria-label="Kategorier (mobil)"
        >
          <ul className="flex flex-col gap-1">
            {collections.map((c) => (
              <li key={c.handle}>
                <Link
                  href={`/kategori/${c.handle}`}
                  className="block border-b border-line py-2.5 text-body italic text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/paket"
                className="mt-2 block border border-accent bg-accent px-3 py-2.5 text-center text-body text-bg"
                onClick={() => setMenuOpen(false)}
              >
                Skapa ditt paket
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
