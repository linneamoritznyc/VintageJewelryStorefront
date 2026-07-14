import Link from "next/link";
import { store } from "@/lib/shopify";
import { getSiteContent } from "@/lib/content";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { EmailCaptureBlock } from "@/components/marketing/EmailCaptureBlock";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { ArchivePlaceholder } from "@/components/ui/ArchivePlaceholder";
import { formatPrice } from "@/lib/utils/format";
import { JEWELRY_COLLECTION_HANDLES } from "@/lib/config/categories";

export default async function HomePage() {
  const [allCollections, recentJewelry, allProducts, content] = await Promise.all([
    store.getCollections(),
    // Over-fetch, then filter to jewelry only (accessories are more recently
    // added in the mock data and would otherwise crowd out the carousels).
    store.getLatestProducts(40),
    store.getAllProducts(),
    getSiteContent(),
  ]);
  const { hero, brandStory, bundle } = content;

  const collections = allCollections.filter((c) =>
    JEWELRY_COLLECTION_HANDLES.includes(c.handle),
  );
  const jewelryOnly = recentJewelry.filter((p) =>
    p.collections.some((c) => JEWELRY_COLLECTION_HANDLES.includes(c)),
  );
  const latest = jewelryOnly.slice(0, 8);
  const newest = jewelryOnly.slice(8, 16);
  const countByCategory = new Map<string, number>();
  for (const p of allProducts) {
    const cat = p.collections[0];
    if (cat) countByCategory.set(cat, (countByCategory.get(cat) ?? 0) + 1);
  }
  const cheapestTier = [...bundle.tiers].sort((a, b) => a.pricePerBundle - b.pricePerBundle)[0];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-line">
        <div className="relative">
          <ArchivePlaceholder
            label="Hero, ersätt med foto"
            className="aspect-[4/5] w-full sm:aspect-[16/9]"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12">
            <p className="meta">{hero.badge}</p>
            <h1 className="mt-2 max-w-lg text-hero font-light leading-[0.94] text-ink">
              {hero.heading} <em className="font-normal italic">{hero.headingAccent}</em>
            </h1>
            <p className="mt-4 max-w-sm text-body text-ink-muted">{hero.subheading}</p>
            <Link
              href="/kategori/orhangen"
              className="mt-6 inline-block border-b border-ink pb-[3px] text-body text-ink transition hover:text-accent"
            >
              Se allt →
            </Link>
          </div>
        </div>
      </section>

      {/* USP row */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
          {[
            "I originalskick",
            "Fri frakt över 400 kr",
            "14 dagars ångerrätt",
            "Ett exemplar av det mesta",
          ].map((usp, i) => (
            <div
              key={usp}
              className={`border-line px-4 py-5 text-center text-body italic text-ink-label ${
                i % 2 === 0 ? "border-r sm:border-r-0" : ""
              } ${i < 2 ? "border-b sm:border-b-0" : ""} ${i > 0 ? "sm:border-l" : ""}`}
            >
              {usp}
            </div>
          ))}
        </div>
      </section>

      {/* Countdown, only shown when a genuine timed drop is configured. */}
      {content.saleCountdownEndsAt && (
        <div className="border-b border-line py-3 text-center">
          <span className="text-body italic text-ink-muted">
            Lagerrensning, slutar om{" "}
            <CountdownTimer endsAt={content.saleCountdownEndsAt} compact className="text-ink" />
          </span>
        </div>
      )}

      {/* Latest finds carousel */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
        <div className="mb-6 flex items-end justify-between border-b border-line pb-4">
          <div>
            <h2 className="text-heading font-light text-ink">Senaste fynden</h2>
            <p className="meta mt-1">Nyss inregistrerat i lagret</p>
          </div>
          <Link href="/kategori/orhangen" className="text-body italic text-ink-label transition hover:text-ink">
            Visa fler
          </Link>
        </div>
        <ProductCarousel products={latest} />
      </section>

      {/* Story block: the deadstock narrative. Give it room. */}
      <section className="border-y border-line bg-bg-panel">
        <div className="mx-auto grid max-w-6xl items-center gap-0 sm:grid-cols-2">
          <ArchivePlaceholder
            label="Arkivbild, ersätt med foto"
            className="aspect-square sm:aspect-auto sm:h-full sm:min-h-[420px]"
          />
          <div className="px-6 py-14 sm:px-16">
            <p className="meta">{brandStory.eyebrow}</p>
            <h2 className="mt-3 text-heading font-light text-ink">{brandStory.heading}</h2>
            <div className="mt-5 space-y-3 text-body text-ink-muted">
              {brandStory.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p className="text-ink">{brandStory.closingLine}</p>
            </div>
            <Link
              href="/om-oss"
              className="mt-5 inline-block border-b border-ink pb-[3px] text-body text-ink transition hover:text-accent"
            >
              Läs hela historien
            </Link>
          </div>
        </div>
      </section>

      {/* Category tiles, honest per-category counts */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
        <h2 className="mb-6 border-b border-line pb-4 text-heading font-light text-ink">
          Kategorier
        </h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {collections.map((c) => {
            const count = countByCategory.get(c.handle) ?? 0;
            return (
              <Link key={c.handle} href={`/kategori/${c.handle}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden border border-line">
                  <ArchivePlaceholder label="Bild" className="h-full w-full" />
                </div>
                <p className="mt-2 text-sub text-ink">{c.title}</p>
                <p className="text-body italic text-ink-label">{count} styck</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bundle builder entry point, the flagship. */}
      <section className="border-y border-line bg-bg-panel">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <p className="meta">Flaggskeppet</p>
          <h2 className="mt-3 text-heading font-light text-ink">Skapa ditt eget paket</h2>
          <p className="mt-3 max-w-md text-body text-ink-muted">
            Välj en låda, tryck fram dina fynd och få allt skickat i en{" "}
            {bundle.packageName.toLowerCase()}. Från{" "}
            <span className="mono text-ink">{formatPrice(cheapestTier.pricePerBundle)}</span>.
          </p>
          <Link
            href="/paket"
            className="mt-6 inline-block border border-accent bg-accent px-6 py-3 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover"
          >
            Skapa ditt paket
          </Link>
        </div>
      </section>

      {/* Second carousel */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
        <div className="mb-6 flex items-end justify-between border-b border-line pb-4">
          <div>
            <h2 className="text-heading font-light text-ink">Nya fynd</h2>
            <p className="meta mt-1">Mer ur samma parti</p>
          </div>
          <Link href="/kategori/halsband" className="text-body italic text-ink-label transition hover:text-ink">
            Visa fler
          </Link>
        </div>
        <ProductCarousel products={newest} />
      </section>

      {/* Email capture */}
      <div className="pb-20">
        <EmailCaptureBlock content={content.emailPopup} />
      </div>
    </div>
  );
}
