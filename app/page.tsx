import Link from "next/link";
import { store } from "@/lib/shopify";
import { getSiteContent } from "@/lib/content";
import { isNavCollectionHandle } from "@/lib/config/navigation";
import { COUNTDOWN } from "@/lib/config/promotions";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { EmailCaptureBlock } from "@/components/marketing/EmailCaptureBlock";
import { Countdown } from "@/components/ui/Countdown";

/* Soft duotone tiles per category, stand-ins until real photography lands
   (the label bar mirrors the reference sites' image tiles). */
const CATEGORY_TILE: Record<string, string> = {
  orhangen: "linear-gradient(150deg, #F3E7D8, #E4CDB4)",
  halsband: "linear-gradient(150deg, #EDE3D2, #D8C6AC)",
  armband: "linear-gradient(150deg, #F1E4D3, #DECBB8)",
  ovrigt: "linear-gradient(150deg, #EFE6DA, #DCCDBB)",
};

/** Curated collection the homepage carousel pulls from. */
const FEATURED_COLLECTION = "manadens-fynd";

export default async function HomePage() {
  const [allCollections, featured, content] = await Promise.all([
    store.getCollections(),
    store.getProducts({ collection: FEATURED_COLLECTION, pageSize: 10 }),
    getSiteContent(),
  ]);
  const collections = allCollections.filter((c) => isNavCollectionHandle(c.handle));
  const { hero, brandStory, bundle } = content;

  return (
    <div className="flex flex-col gap-16 pb-16 sm:gap-24">
      {/* Hero: light, editorial, type-led */}
      <section className="border-b border-ink/10 bg-cream">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 sm:grid-cols-[1.2fr_1fr] sm:gap-12 sm:py-20">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-fuchsia-deep">
              {hero.badge}
            </span>
            <h1 className="mt-4 font-display text-4xl font-normal leading-[1.05] tracking-tight text-ink sm:text-6xl">
              {hero.heading}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-plum-soft sm:text-lg">
              {hero.subheading}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/kategori/orhangen"
                className="rounded-pill bg-ink px-7 py-3 text-sm font-semibold text-cream transition hover:bg-plum"
              >
                Börja fynda
              </Link>
              <Link
                href="/paket"
                className="rounded-pill border border-ink/25 px-7 py-3 text-sm font-semibold text-ink transition hover:border-ink"
              >
                Skapa ditt paket
              </Link>
            </div>
            {COUNTDOWN.enabled && (
              <Countdown
                endsAt={COUNTDOWN.endsAt}
                label={COUNTDOWN.label}
                className="mt-8"
              />
            )}
          </div>
          {/* Campaign image slot: real photography pending from client */}
          <div
            className="relative hidden aspect-[4/5] overflow-hidden rounded-xl sm:block"
            style={{ background: "linear-gradient(160deg, #F2E6D6, #DFC9AE)" }}
            aria-hidden
          >
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-ink">
              Från 69 kr
            </span>
            <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wide text-ink/40">
              Plats för kampanjbild
            </span>
          </div>
        </div>
      </section>

      {/* Featured finds carousel, sourced from the "Månadens fynd" collection */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-6 flex items-end justify-between border-b border-ink/10 pb-4">
          <div>
            <h2 className="font-display text-2xl font-normal text-ink sm:text-3xl">
              Månadens fynd
            </h2>
            <p className="mt-1 text-sm text-plum-soft">
              Handplockat ur lagret just nu.
            </p>
          </div>
          <Link
            href="/kategori/under-100-kr"
            className="hidden text-xs font-medium uppercase tracking-[0.18em] text-ink underline-offset-4 hover:underline sm:block"
          >
            Visa alla
          </Link>
        </div>
        <ProductCarousel products={featured.products} />
      </section>

      {/* Category navigation: image tiles with white label bar */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {collections.map((c) => (
            <Link
              key={c.handle}
              href={`/kategori/${c.handle}`}
              className="group relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg ring-1 ring-ink/5"
              style={{
                background:
                  CATEGORY_TILE[c.handle] ??
                  "linear-gradient(150deg, #EFE6DA, #DCCDBB)",
              }}
            >
              <span className="bg-white px-5 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition group-hover:bg-ink group-hover:text-cream">
                {c.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 sm:grid-cols-2 sm:py-16">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-fuchsia-deep">
              {brandStory.eyebrow}
            </span>
            <h2 className="mt-3 font-display text-2xl font-normal text-ink sm:text-4xl">
              {brandStory.heading}
            </h2>
            <div className="mt-5 space-y-3 leading-relaxed text-plum-soft">
              {brandStory.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p className="font-medium text-ink">{brandStory.closingLine}</p>
            </div>
            <Link
              href="/om-oss"
              className="mt-6 inline-block text-xs font-medium uppercase tracking-[0.18em] text-ink underline underline-offset-4 hover:text-fuchsia-deep"
            >
              Läs hela historien
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-ink/10 ring-1 ring-ink/10">
            {[
              { n: "100%", l: "Oanvänt & aldrig buret" },
              { n: "−60%", l: "Ofta mot ursprungspris" },
              { n: "1 av 1", l: "Ofta bara ett kvar" },
              { n: "SE", l: "Svenskt lager" },
            ].map((stat) => (
              <div
                key={stat.l}
                className="flex flex-col items-center justify-center bg-cream p-6 text-center"
              >
                <span className="font-display text-3xl text-fuchsia-deep">
                  {stat.n}
                </span>
                <span className="mt-1 text-xs text-plum-soft">{stat.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle CTA */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="grid items-center gap-6 rounded-xl bg-sand/60 p-8 ring-1 ring-ink/5 sm:grid-cols-[1fr_auto] sm:p-12">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-fuchsia-deep">
              Flaggskeppet
            </span>
            <h2 className="mt-3 font-display text-2xl font-normal text-ink sm:text-4xl">
              Skapa ditt eget paket
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-plum-soft">
              Välj {bundle.size} pjäser från {bundle.size} olika kategorier,
              samla dem i din bricka och få allt i en{" "}
              {bundle.packageName.toLowerCase()}, med automatiskt{" "}
              {bundle.discountPercentage}% paketrabatt i kassan.
            </p>
            <Link
              href="/paket"
              className="mt-6 inline-block rounded-pill bg-ink px-7 py-3 text-sm font-semibold text-cream transition hover:bg-plum"
            >
              Bygg ditt paket
            </Link>
          </div>
          {/* Physical vintage-ask slot: real packshot pending from client */}
          <div
            className="hidden h-44 w-44 items-center justify-center rounded-lg sm:flex"
            style={{ background: "linear-gradient(150deg, #EADDC9, #D6BFA0)" }}
            aria-hidden
          >
            <span className="bg-white px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
              Vintage-ask
            </span>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <EmailCaptureBlock content={content.emailPopup} />
    </div>
  );
}
