# Fyndlådan — Headless Shopify Storefront

Swedish-language, mobile-first storefront for **unused vintage (deadstock)
jewelry**. This is the customer-facing **frontend only**; Shopify owns the
backend (products, inventory, pricing, checkout, payments, orders) via the
**Storefront API**. It is a custom **Next.js** build, not a Shopify Liquid
theme.

The brand hook is the deadstock/liquidation origin story — smycken räddade ur
ett tömt lager, i originalskick, långt under ursprungspris — surfaced as a
"treasure hunt" + "last chance" experience.

For the non-technical store owner's handoff guide (what you edit yourself in
Shopify vs. what needs a developer, and the go-live checklist), see
**[`ÖVERLÄMNING.md`](./ÖVERLÄMNING.md)** (Swedish).

---

## Prerequisites

- **Node.js 20+** and npm
- No Shopify account or credentials required for local development — the app
  runs on mock data out of the box

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # TypeScript, no emit
npm run lint       # ESLint (next/core-web-vitals)
npm run format     # Prettier, writes changes
```

## Environment variables

See [`.env.example`](./.env.example) for the full annotated list. None are
required to run locally.

| Variable                                                                                                          | Purpose                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_USE_MOCK`                                                                                              | `true` (default) serves the built-in mock catalog. `false` requests live Shopify data — see the fallback note below.        |
| `SHOPIFY_STORE_DOMAIN`                                                                                              | `your-store.myshopify.com`. Required for live data.                                                                        |
| `SHOPIFY_STOREFRONT_API_TOKEN`                                                                                      | Storefront API public access token (Headless sales channel or a custom app). Required for live data. Server-side only.    |
| `SHOPIFY_STOREFRONT_API_VERSION`                                                                                    | Defaults to `2026-07`.                                                                                                     |
| `SHOPIFY_ADMIN_API_TOKEN`                                                                                           | Separate token (Admin API, `write_customers` scope), used only by the optional lead-capture sink in `lib/leads/shopify.ts`. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`                                                        | Analytics, loaded only after cookie consent.                                                                               |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SHEETS_SHEET_NAME` | Optional Google Sheets lead-capture sink.                                                                                  |

**Important — the live/mock switch has a safety net, not a hard failure.**
`lib/shopify/index.ts` only serves live Shopify data when
`NEXT_PUBLIC_USE_MOCK=false` **and** `SHOPIFY_STORE_DOMAIN` +
`SHOPIFY_STOREFRONT_API_TOKEN` are both present. If the flag is flipped to
live without both credentials set, the app silently falls back to mock data
(with a console warning) instead of crashing the build. **When wiring this up
in Vercel, the variable names must match exactly** —
`SHOPIFY_STORE_DOMAIN` / `SHOPIFY_STOREFRONT_API_TOKEN`, no `NEXT_PUBLIC_`
prefix. A misnamed variable fails this check silently and the site keeps
serving mock data with no visible error.

---

## Architecture — where things live

```
app/                     Routes (App Router)
  page.tsx               Homepage (hero, latest finds, brand story, bundle CTA, email capture)
  kategori/[handle]/     Category listing (sort + price filter + load-more)
  produkt/[handle]/      Product detail (gallery, variants, add-to-cart, vintage story)
  paket/                 "Skapa ditt eget paket" — the flagship bundle builder
  kassa/                 Checkout summary + Shopify handoff (stubbed until live)
  angra-kop/             Right-of-withdrawal (ångerrätt) flow
  om-oss, leverans, villkor, integritet   Static Swedish content
  api/lead/              Lead-capture endpoint (email popup / forms)

components/               UI, product, cart, bundle, marketing, layout components
lib/
  shopify/               COMMERCE DATA LAYER — the single swap point
    types.ts             Storefront API-shaped types (the only types components use)
    client.ts            StoreClient interface (the data contract)
    index.ts             Exports `store` = mock or live, chosen by env flag (see above)
    mock/                Fixture catalog + mock StoreClient (no credentials needed)
    live/                Live Storefront API client + GraphQL queries (2026-07)
  content/               OWNER CONTENT LAYER — the single swap point for marketing
                         copy (banner, countdown, bundle price, homepage text).
                         Still mock today; the Shopify metaobject schema it will
                         read is documented in lib/content/index.ts, not yet built.
  checkout/index.ts      Single checkout handoff point. Returns the cart's real
                         `checkoutUrl` once the live client is active; otherwise
                         a stubbed "coming soon" message.
  cart/CartContext.tsx   Client cart state (mirrors Storefront Cart shape) + localStorage
  leads/                 Lead-capture sinks (Shopify Admin API customer + Google
                         Sheets), both independently optional and no-op without
                         credentials
  config/                coupons, bundle, promotions — code-level defaults read
                         by the content layer
  utils/                 money formatting, stock/low-stock logic
```

Two independent swap points, both isolated to `lib/`:

- **`lib/shopify/index.ts`** — commerce data (products, collections, cart).
  Mock vs. live is chosen by `NEXT_PUBLIC_USE_MOCK` plus credential presence
  (see the environment variables section above). The live client
  (`lib/shopify/live/client.ts`) is fully implemented, not a stub.
- **`lib/content/index.ts`** — owner-editable marketing content. Once live
  this is meant to read **Shopify metaobjects**, so the non-technical owner
  edits banner text, the sale end-date, the bundle price and homepage copy in
  Shopify admin with no code and no redeploy. The exact metaobject field
  definitions are documented in that file's header comment, but the
  Shopify-reading implementation (`getShopifySiteContent()`) does not exist
  yet — this layer always serves the code-level mock content
  (`lib/content/mock.ts`, `lib/config/*`) regardless of the commerce data
  layer's mock/live state.

### Swapping in live Shopify data

1. Create the Shopify store, add the **Headless** sales channel, generate a
   Storefront API token.
2. Set `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_TOKEN`,
   `SHOPIFY_STOREFRONT_API_VERSION` in your environment (locally in `.env`,
   in production in Vercel's project settings) — **exact names, no
   `NEXT_PUBLIC_` prefix**.
3. Set `NEXT_PUBLIC_USE_MOCK=false`.
4. Upload products in Shopify with the category tags `orhangen`, `halsband`,
   `armband`, `ovrigt`. The per-product vintage story and a few other fields
   are read from metafields — see the `Raw*` types and mappers in
   `lib/shopify/live/client.ts` for the exact metafield keys expected.

No component code changes for any of this — see the header comments in
`lib/shopify/index.ts` for the full mechanism.

### Known gaps (accurate as of this cleanup pass)

- **Content metaobjects are not wired up.** `getShopifySiteContent()` is
  documented but not implemented; see `lib/content/index.ts`.
- **SEO/crawler infrastructure was removed, not just unbuilt.** `app/robots.ts`,
  `app/sitemap.ts` and `app/llms.txt` existed at one point and were dropped in
  a later full visual reskin. The site currently ships no sitemap, no
  `robots.txt`, and no structured data.

---

## The catalog scales freely

Nothing hardcodes product counts or per-category assumptions. Adding a
product is a single new entry in `lib/shopify/mock/products.ts` today, or a
new product in Shopify admin once live. Categories live in
`lib/shopify/mock/collections.ts`.

## Editing marketing content (no code needed, today)

- **Discount codes:** `lib/config/coupons.ts`
- **Storewide banner + email popup + sale countdown end time:**
  `lib/config/promotions.ts`
- **Bundle size / price / package copy:** `lib/config/bundle.ts`

These will move into Shopify metaobjects once the content layer is wired up
(see "Known gaps" above) — at that point the owner edits them directly in
Shopify admin instead.

## Notes

- Everything is in **Swedish** — UI, copy, errors, legal text.
- Product images use gradient placeholders in development; live images come
  from the Shopify CDN with no component changes.
- Code style is enforced by Prettier (`.prettierrc.json`,
  `prettier-plugin-tailwindcss` for class sorting) and ESLint
  (`next/core-web-vitals`). Run `npm run format` before committing.
