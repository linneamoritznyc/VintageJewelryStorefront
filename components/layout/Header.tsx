"use client";

import Link from "next/link";
import { useState } from "react";
import type { Collection } from "@/lib/shopify/types";
import { useCart } from "@/lib/cart/CartContext";
import { RingMark } from "@/components/ui/RingMark";

export function Header({ collections }: { collections: Collection[] }) {
  const { cart, openCart, isReady } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const count = cart.totalQuantity;

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3">
        {/* Left: menu (mobile) + nav (desktop) */}
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
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Kategorier">
            {collections.map((c) => (
              <Link
                key={c.handle}
                href={`/kategori/${c.handle}`}
                className="meta text-ink-muted transition hover:text-ink"
              >
                {c.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: wordmark */}
        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 font-display text-xl text-ink sm:text-2xl"
          onClick={() => setMenuOpen(false)}
        >
          <RingMark className="text-ink" size={20} />
          Fyndlådan
        </Link>

        {/* Right: bundle link (desktop) + cart */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/paket"
            className="meta hidden text-ink-muted transition hover:text-ink lg:block"
          >
            Skapa paket
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center justify-center p-1.5 text-ink transition hover:text-ink-muted"
            aria-label={`Öppna varukorg${count > 0 ? `, ${count} varor` : ""}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 8h12l-1 11a2 2 0 01-2 1.8H9a2 2 0 01-2-1.8L6 8z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M9 8a3 3 0 016 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            {isReady && count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center bg-ink px-1 font-mono text-[10px] font-medium text-paper">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <nav
          className="border-t border-rule bg-paper px-4 py-3 lg:hidden"
          aria-label="Kategorier (mobil)"
        >
          <ul className="flex flex-col">
            {collections.map((c) => (
              <li key={c.handle}>
                <Link
                  href={`/kategori/${c.handle}`}
                  className="block border-b border-rule py-3 font-display text-lg text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/paket"
                className="meta mt-3 block bg-ink px-4 py-3 text-center font-medium text-paper"
                onClick={() => setMenuOpen(false)}
              >
                Skapa ditt eget paket
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
