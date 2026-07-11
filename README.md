# Fyndlådan — Headless Shopify Storefront

Swedish-language, mobile-first storefront for **unused vintage (deadstock)
jewelry**. This is the customer-facing **frontend only**; Shopify owns the
backend (products, inventory, pricing, checkout, payments, orders) via the
**Storefront API**. It is a custom **Next.js** build, not a Shopify Liquid
theme.

The brand hook is the deadstock/liquidation origin story — smycken räddade ur
ett tömt lager, aldrig burna, långt under ursprungspris — surfaced as a
"treasure hunt" + "last chance" experience.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for the design system
- **Mock data layer** mirroring the Shopify Storefront API — no credentials
  needed to run

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```

The app runs fully on mock data out of the box. No `.env` is required for
development.

---

## Architecture — where things live

```
app/                     Routes (App Router)
  page.tsx               Homepage (hero, latest finds, brand story, bundle CTA, email capture)
  kategori/[handle]/     Category listing (sort + price filter + load-more)
  produkt/[handle]/      Product detail (gallery, variants, add-to-cart, vintage story)
  paket/                 "Skapa ditt eget paket" — the flagship bundle builder
  kassa/                 Checkout summary + Shopify handoff (stubbed)
  om-oss, leverans, villkor, integritet   Static Swedish content

components/               UI, product, cart, bundle, marketing, layout components
lib/
  shopify/               DATA LAYER — the single swap point (see below)
    types.ts             Storefront API-shaped types (the only types components use)
    client.ts            StoreClient interface (the data contract)
    index.ts             Exports `store` = mock or live, chosen by env flag
    mock/                Fixtures (products/collections) + mock StoreClient
    live/                Live StoreClient stub + GraphQL queries (2026-07)
  content/               OWNER CONTENT LAYER — the single swap point for
                         marketing copy (banner, countdown, bundle price,
                         homepage text). Mock today, Shopify metaobjects later.
  cart/CartContext.tsx   Client cart state (mirrors Storefront Cart shape) + localStorage
  checkout/index.ts      Single checkout handoff point (stubbed)
  config/                coupons, bundle, promotions — code-level defaults read
                         by the content layer
  utils/                 money formatting, stock/low-stock logic
```

Two independent swap points, both isolated to `lib/`:

- **`lib/shopify/index.ts`** — commerce data (products, collections, cart) via
  the `store` object. Mock vs live is chosen by `NEXT_PUBLIC_USE_MOCK`; going
  live means implementing `lib/shopify/live/client.ts` and flipping the flag.
- **`lib/content/index.ts`** — owner-editable marketing content. Once live this
  reads **Shopify metaobjects**, so the non-technical owner edits banner text,
  the sale end-date, the bundle price and homepage copy in Shopify admin with no
  code and no redeploy. The exact metaobject field definitions are documented in
  that file.

**Handoff to a non-technical owner:** see **`ÖVERLÄMNING.md`** (Swedish) for the
owner-vs-developer responsibility split, the go-live checklist, and what to
transfer.

### Swapping in live Shopify data

Everything reads commerce data from **`lib/shopify/index.ts`** and nowhere
else. To go live:

1. Implement the same function signatures against the real Storefront API in
   `lib/shopify/storefront-client.ts` (returning the types in `types.ts`).
2. Change the re-export in `lib/shopify/index.ts` to point at that file.
3. Map the per-product vintage story from a Shopify **metafield**
   (`story.body`).
4. Wire real cart mutations in `lib/cart/` and return the real
   `cart.checkoutUrl` from `lib/checkout/index.ts`.

Component code does not change. See the header comments in
`lib/shopify/index.ts` and `lib/checkout/index.ts` for the full checklist.
Credentials go in `.env` (see `.env.example`).

### The catalog scales freely

Nothing hardcodes product counts or per-category assumptions. Adding a product
is a single new entry in `lib/shopify/mock/products.ts` today, or a new product
in Shopify admin once live. Categories live in
`lib/shopify/mock/collections.ts`.

---

## Feature map (from the brief)

| Requirement | Where |
| --- | --- |
| Homepage hero / latest carousel / brand story / category nav / bundle entry / email capture | `app/page.tsx` |
| Category grid + scalable listing + sort/filter | `app/kategori/[handle]/`, `components/category/` |
| Product detail: gallery, variants, add-to-cart, stock, vintage story | `app/produkt/[handle]/`, `components/product/` |
| Cart: slide-out, qty, remove, subtotal, coupon input | `components/cart/CartDrawer.tsx` |
| Create-your-own-bundle + visual tray + physical package | `app/paket/`, `components/bundle/BundleBuilder.tsx` |
| Storewide 10% banner + once-per-session email popup (shared code) | `components/layout/AnnouncementBanner.tsx`, `components/marketing/EmailPopup.tsx`, `lib/config/promotions.ts` |
| Reusable configurable countdown | `components/ui/CountdownTimer.tsx` |
| Coupon codes (config-driven, Shopify-aligned) | `lib/config/coupons.ts`, cart |
| Checkout handoff (single stubbed integration point) | `lib/checkout/index.ts`, `app/kassa/` |

## Editing marketing content (no code needed)

- **Discount codes:** `lib/config/coupons.ts`
- **Storewide banner + email popup + sale countdown end time:**
  `lib/config/promotions.ts`
- **Bundle size / price / package copy:** `lib/config/bundle.ts`

## Notes

- Everything is in **Swedish** — UI, copy, errors, legal text.
- Product images use gradient placeholders in development; live images come
  from the Shopify CDN with no component changes.
