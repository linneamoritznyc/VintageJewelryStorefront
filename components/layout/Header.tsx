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
    <header className="sticky top-0 z-40 border-b border-sand bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Mobile menu button */}
        <button
          type="button"
          className="flex items-center justify-center rounded-lg p-1.5 text-ink lg:hidden"
          aria-label="Öppna meny"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d={menuOpen ? "M5 5l14 14M19 5L5 19" : "M4 7h16M4 12h16M4 17h16"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-baseline gap-1 font-display text-xl font-bold text-ink sm:text-2xl"
          onClick={() => setMenuOpen(false)}
        >
          <span aria-hidden className="text-fuchsia-brand">
            ✧
          </span>
          Vintageskatten
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Kategorier">
          {collections.map((c) => (
            <Link
              key={c.handle}
              href={`/kategori/${c.handle}`}
              className="text-sm font-semibold text-ink/80 transition hover:text-fuchsia-brand"
            >
              {c.title}
            </Link>
          ))}
          <Link
            href="/paket"
            className="rounded-pill bg-plum px-3 py-1.5 text-sm font-bold text-cream transition hover:bg-plum-soft"
          >
            Skapa ditt paket
          </Link>
        </nav>

        {/* Cart button */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex items-center justify-center rounded-lg p-1.5 text-ink transition hover:text-fuchsia-brand"
          aria-label={`Öppna varukorg${count > 0 ? `, ${count} varor` : ""}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 8h12l-1 11a2 2 0 01-2 1.8H9a2 2 0 01-2-1.8L6 8z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9 8a3 3 0 016 0"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          {isReady && count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-fuchsia-brand px-1 text-[11px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <nav
          className="border-t border-sand bg-cream px-4 py-3 lg:hidden"
          aria-label="Kategorier (mobil)"
        >
          <ul className="flex flex-col gap-1">
            {collections.map((c) => (
              <li key={c.handle}>
                <Link
                  href={`/kategori/${c.handle}`}
                  className="block rounded-lg px-3 py-2.5 font-semibold text-ink transition hover:bg-sand"
                  onClick={() => setMenuOpen(false)}
                >
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/paket"
                className="mt-1 block rounded-lg bg-plum px-3 py-2.5 font-bold text-cream"
                onClick={() => setMenuOpen(false)}
              >
                ✦ Skapa ditt eget paket
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
