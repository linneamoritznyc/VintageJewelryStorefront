import Link from "next/link";
import { store } from "@/lib/shopify";
import { getSiteContent } from "@/lib/content";
import { isNavCollectionHandle } from "@/lib/config/navigation";
import { COUNTDOWN } from "@/lib/config/promotions";
import { padLot } from "@/lib/utils/lot";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { UspRow } from "@/components/home/UspRow";
import { EmailCaptureBlock } from "@/components/marketing/EmailCaptureBlock";
import { Countdown } from "@/components/ui/Countdown";

/** Curated collection the homepage carousels pull from. */
const FEATURED_COLLECTION = "manadens-fynd";

export default async function HomePage() {
  const [allCollections, featured, latest, content] = await Promise.all([
    store.getCollections(),
    store.getProducts({ collection: FEATURED_COLLECTION, pageSize: 8 }),
    store.getProducts({ sort: "NEWEST", pageSize: 8 }),
    getSiteContent(),
  ]);
  const navCollections = allCollections.filter((c) =>
    isNavCollectionHandle(c.handle),
  );

  // Honest counts: total catalogue span for the hero lot line, and a real
  // per-category count for the tiles. Derived from the data, so adding
  // product #500 needs no code change.
  const [total, ...counts] = await Promise.all([
    store.getProducts({ pageSize: 1 }).then((c) => c.totalCount),
    ...navCollections.map((c) =>
      store
        .getProducts({ collection: c.handle, pageSize: 1 })
        .then((r) => r.totalCount),
    ),
  ]);
  const categoryCount = new Map(
    navCollections.map((c, i) => [c.handle, counts[i]]),
  );

  const { hero, brandStory, bundle } = content;

  return (
    <div className="flex flex-col">
      {/* Hero: full-bleed image slot, one message, one CTA, lot overlay */}
      <section
        className="relative flex min-h-[70vh] items-end bg-paper-sunk"
        style={{ background: "linear-gradient(160deg, #E9E2D3, #D8C9B2)" }}
      >
        <span className="absolute bottom-2 right-3 meta text-ink/30">
          Plats för kampanjbild
        </span>
        <div className="relative mx-auto w-full max-w-[1280px] px-4 pb-12 pt-24 sm:pb-20">
          <p className="meta text-ink-muted">
            LOT 001-{padLot(total)} · AKTUELLT LAGER
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
            {hero.heading}
          </h1>
          <p className="mt-4 max-w-md text-ink-muted sm:text-lg">
            {hero.subheading}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/kategori/orhangen"
              className="meta bg-ink px-7 py-3.5 font-medium text-paper transition hover:bg-ink-muted"
            >
              Se hela lagret
            </Link>
            {COUNTDOWN.enabled && COUNTDOWN.endsAt && (
              <Countdown endsAt={COUNTDOWN.endsAt} label={COUNTDOWN.label} />
            )}
          </div>
        </div>
      </section>

      {/* USP row */}
      <UspRow />

      {/* Senaste fynden */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:py-24">
        <div className="mb-6 flex items-end justify-between border-b border-rule pb-4">
          <div>
            <p className="meta text-ink-faint">Ur lagret</p>
            <h2 className="mt-1 font-display text-2xl text-ink sm:text-3xl">
              Senaste fynden
            </h2>
          </div>
          <Link
            href="/kategori/orhangen"
            className="meta text-ink underline-offset-4 hover:underline"
          >
            Visa fler
          </Link>
        </div>
        <ProductCarousel products={featured.products} />
      </section>

      {/* Story block: the strongest asset, given room */}
      <section className="border-y border-rule bg-paper-raised">
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-4 py-16 sm:grid-cols-2 sm:py-24">
          <div>
            <p className="meta text-ink-faint">{brandStory.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
              {brandStory.heading}
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-ink-muted">
              {brandStory.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p className="font-medium text-ink">{brandStory.closingLine}</p>
            </div>
            <Link
              href="/om-oss"
              className="meta mt-6 inline-block text-ink underline underline-offset-4 hover:text-ink-muted"
            >
              Läs hela historien
            </Link>
          </div>
          <dl className="grid grid-cols-2 border-l border-t border-rule">
            {[
              { n: "100%", l: "Oanvänt & aldrig buret" },
              { n: padLot(total), l: "Fynd i lagret just nu" },
              { n: "1 av 1", l: "Ofta bara ett kvar" },
              { n: "SE", l: "Svenskt lager" },
            ].map((stat) => (
              <div
                key={stat.l}
                className="border-b border-r border-rule bg-paper p-6"
              >
                <dt className="font-display text-3xl text-ink">{stat.n}</dt>
                <dd className="meta mt-1 text-ink-faint">{stat.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Category tiles with honest counts */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:py-24">
        <div className="mb-6 border-b border-rule pb-4">
          <p className="meta text-ink-faint">Kategorier</p>
          <h2 className="mt-1 font-display text-2xl text-ink sm:text-3xl">
            Utforska lagret
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {navCollections.map((c) => (
            <Link
              key={c.handle}
              href={`/kategori/${c.handle}`}
              className="group relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-paper-sunk ring-1 ring-rule"
              style={{ background: "linear-gradient(160deg, #E9E2D3, #D3C3AB)" }}
            >
              <span className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/5" />
              <span className="relative z-10 text-center">
                <span className="block font-display text-xl text-ink">
                  {c.title}
                </span>
                <span className="meta mt-1 block text-ink-muted">
                  {categoryCount.get(c.handle) ?? 0} stycken
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bundle builder entry point */}
      <section className="border-y border-rule bg-paper-raised">
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-8 px-4 py-16 sm:grid-cols-[1fr_auto] sm:py-20">
          <div>
            <p className="meta text-ink-faint">Flaggskeppet</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Skapa ditt eget paket
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-muted">
              Välj {bundle.size} pjäser från {bundle.size} olika kategorier,
              samla dem i din bricka och få allt i en{" "}
              {bundle.packageName.toLowerCase()}, med automatiskt{" "}
              {bundle.discountPercentage}% paketrabatt i kassan.
            </p>
            <Link
              href="/paket"
              className="meta mt-6 inline-block bg-ink px-7 py-3.5 font-medium text-paper transition hover:bg-ink-muted"
            >
              Bygg ditt paket
            </Link>
          </div>
          <div
            className="hidden aspect-square w-52 items-center justify-center ring-1 ring-rule sm:flex"
            style={{ background: "linear-gradient(150deg, #EADDC9, #D3BC9C)" }}
          >
            <span className="meta bg-paper-raised px-3 py-1.5 text-ink">
              Vintage-ask
            </span>
          </div>
        </div>
      </section>

      {/* Nya fynd: second carousel to give the catalogue depth */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:py-24">
        <div className="mb-6 flex items-end justify-between border-b border-rule pb-4">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Nya fynd
          </h2>
        </div>
        <ProductCarousel products={latest.products} />
      </section>

      {/* Email capture */}
      <EmailCaptureBlock content={content.emailPopup} />
    </div>
  );
}
