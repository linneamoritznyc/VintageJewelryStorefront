import Link from "next/link";
import { store } from "@/lib/shopify";
import { getSiteContent } from "@/lib/content";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { EmailCaptureBlock } from "@/components/marketing/EmailCaptureBlock";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { ArchivePlaceholder } from "@/components/ui/ArchivePlaceholder";
import { formatPrice, formatLot } from "@/lib/utils/format";

export default async function HomePage() {
  const [collections, latest, newest, allProducts, content] = await Promise.all([
    store.getCollections(),
    store.getLatestProducts(8),
    store.getLatestProducts(16).then((ps) => ps.slice(8)),
    store.getAllProducts(),
    getSiteContent(),
  ]);
  const { hero, brandStory, bundle } = content;

  const totalCount = allProducts.length;
  const lastLot = formatLot(totalCount) ?? `LOT ${totalCount}`;
  const countByCategory = new Map<string, number>();
  for (const p of allProducts) {
    const cat = p.collections[0];
    if (cat) countByCategory.set(cat, (countByCategory.get(cat) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-rule">
        <div className="relative">
          <ArchivePlaceholder
            label="HERO-BILD · ERSÄTT MED FOTO"
            className="aspect-[4/5] w-full sm:aspect-[16/9]"
          />
          <div className="absolute inset-x-0 top-0 p-4 sm:p-6">
            <p className="meta text-ink-faint">
              LOT 001-{lastLot.replace("LOT ", "")} · {hero.badge.toUpperCase()}
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8">
            <h1 className="max-w-md font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
              {hero.heading}
            </h1>
            <p className="mt-3 max-w-sm text-ink-muted sm:text-lg">
              {hero.subheading}
            </p>
            <Link
              href="/kategori/orhangen"
              className="mt-5 inline-block bg-ink px-6 py-3 font-mono text-xs uppercase tracking-meta text-paper transition hover:bg-ink-muted"
            >
              Se hela lagret
            </Link>
          </div>
        </div>
      </section>

      {/* USP row */}
      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
          {[
            "I originalskick",
            "Fri frakt över 400 kr",
            "14 dagars ångerrätt",
            "Ett exemplar av det mesta",
          ].map((usp, i) => (
            <div
              key={usp}
              className={`border-rule px-4 py-4 text-center font-mono text-[11px] uppercase tracking-meta text-ink-muted sm:text-xs ${
                i % 2 === 0 ? "border-r sm:border-r-0" : ""
              } ${i < 2 ? "border-b sm:border-b-0" : ""} ${
                i > 0 ? "sm:border-l" : ""
              }`}
            >
              {usp}
            </div>
          ))}
        </div>
      </section>

      {/* Countdown, only shown when a genuine timed drop is configured. */}
      {content.saleCountdownEndsAt && (
        <section className="mx-auto w-full max-w-6xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 border border-rule bg-paper-raised px-6 py-5 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="meta">Släppet stänger</p>
              <p className="mt-1 font-display text-lg text-ink">
                Sista chansen på det här släppet
              </p>
            </div>
            <CountdownTimer endsAt={content.saleCountdownEndsAt} />
          </div>
        </section>
      )}

      {/* Latest finds carousel */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <div className="mb-4 flex items-end justify-between border-b border-rule pb-3">
          <div>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">
              Senaste fynden
            </h2>
            <p className="meta mt-1">Nyss inregistrerat i lagret</p>
          </div>
          <Link
            href="/kategori/orhangen"
            className="font-mono text-xs uppercase tracking-meta text-ink-muted transition hover:text-ink"
          >
            Visa fler
          </Link>
        </div>
        <ProductCarousel products={latest} />
      </section>

      {/* Story block: the deadstock narrative. Give it room. */}
      <section className="border-y border-rule bg-paper-raised">
        <div className="mx-auto grid max-w-6xl items-center gap-0 sm:grid-cols-2">
          <ArchivePlaceholder
            label="ARKIVBILD · ERSÄTT MED FOTO"
            className="aspect-square sm:aspect-auto sm:h-full sm:min-h-[420px]"
          />
          <div className="px-4 py-10 sm:px-12 sm:py-16">
            <p className="meta">{brandStory.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              {brandStory.heading}
            </h2>
            <div className="mt-5 space-y-3 text-ink-muted">
              {brandStory.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p className="text-ink">{brandStory.closingLine}</p>
            </div>
            <Link
              href="/om-oss"
              className="mt-5 inline-block font-mono text-xs uppercase tracking-meta text-ink underline underline-offset-4 transition hover:text-ink-muted"
            >
              Läs hela historien
            </Link>
          </div>
        </div>
      </section>

      {/* Category tiles, honest per-category counts */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="mb-4 border-b border-rule pb-3 font-display text-2xl text-ink sm:text-3xl">
          Kategorier
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {collections.map((c) => {
            const count = countByCategory.get(c.handle) ?? 0;
            return (
              <Link key={c.handle} href={`/kategori/${c.handle}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden border border-rule">
                  <ArchivePlaceholder label="BILD" className="h-full w-full" />
                  <div className="absolute inset-x-0 bottom-0 bg-ink/85 px-3 py-3 text-center">
                    <span className="font-display text-lg text-paper">{c.title}</span>
                  </div>
                </div>
                <p className="meta mt-2 text-center">
                  {c.title.toUpperCase()} · {count} STYCKEN
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bundle builder entry point, full-bleed, the flagship. */}
      <section className="border-y border-rule bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
          <p className="meta text-paper/60">Flaggskeppet</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Skapa ditt eget paket
          </h2>
          <p className="mt-3 max-w-md text-paper/80">
            Välj {bundle.size} fynd, vilken mix du vill. Vi packar dem i en{" "}
            {bundle.packageName.toLowerCase()} och skickar iväg, för{" "}
            <span className="mono">{formatPrice(bundle.pricePerBundle)}</span>.
          </p>
          <Link
            href="/paket"
            className="mt-5 inline-block bg-paper px-6 py-3 font-mono text-xs uppercase tracking-meta text-ink transition hover:bg-paper-sunk"
          >
            Skapa ditt paket
          </Link>
        </div>
      </section>

      {/* Second carousel */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <div className="mb-4 flex items-end justify-between border-b border-rule pb-3">
          <div>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Nya fynd</h2>
            <p className="meta mt-1">Mer ur samma parti</p>
          </div>
          <Link
            href="/kategori/halsband"
            className="font-mono text-xs uppercase tracking-meta text-ink-muted transition hover:text-ink"
          >
            Visa fler
          </Link>
        </div>
        <ProductCarousel products={newest} />
      </section>

      {/* Email capture */}
      <div className="pb-16">
        <EmailCaptureBlock content={content.emailPopup} />
      </div>
    </div>
  );
}
