import Link from "next/link";
import { getCollections, getLatestProducts } from "@/lib/shopify";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { EmailCaptureBlock } from "@/components/marketing/EmailCaptureBlock";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { BUNDLE_CONFIG } from "@/lib/config/bundle";
import { SALE_COUNTDOWN_ENDS_AT } from "@/lib/config/promotions";
import { formatPrice } from "@/lib/utils/format";

const CATEGORY_EMOJI: Record<string, string> = {
  orhangen: "💎",
  halsband: "📿",
  armband: "🔗",
  ovrigt: "✨",
};

export default async function HomePage() {
  const [collections, latest] = await Promise.all([
    getCollections(),
    getLatestProducts(10),
  ]);

  return (
    <div className="flex flex-col gap-14 py-6 sm:gap-20 sm:py-10">
      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-brand via-fuchsia-deep to-plum px-6 py-12 text-cream sm:px-12 sm:py-20">
          <div className="absolute -right-8 -top-8 text-[10rem] opacity-10" aria-hidden>
            ✧
          </div>
          <div className="relative max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-cream/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
              <span aria-hidden>✦</span> Deadstock · aldrig burna
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-6xl">
              Skattjakt bland
              <br />
              vintagesmycken
            </h1>
            <p className="mt-4 max-w-md text-cream/85 sm:text-lg">
              Oanvända smycken från ett tömt lager — räddade, aldrig burna och
              långt under ursprungspris. När de är slut är de slut.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/kategori/orhangen"
                className="rounded-pill bg-cream px-6 py-3 font-bold text-plum transition hover:bg-white"
              >
                Börja fynda
              </Link>
              <Link
                href="/paket"
                className="rounded-pill border-2 border-cream/60 px-6 py-3 font-bold text-cream transition hover:bg-cream/10"
              >
                Skapa ditt paket
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Limited-time sale countdown */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gold-soft bg-white px-6 py-5 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-display text-lg font-bold text-ink">
              ⏳ Fyndkväll pågår
            </p>
            <p className="text-sm text-plum-soft">
              Extra fynd så länge lagret räcker — passa på innan tiden rinner ut.
            </p>
          </div>
          <CountdownTimer endsAt={SALE_COUNTDOWN_ENDS_AT} />
        </div>
      </section>

      {/* Latest finds carousel */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Senaste fynden
            </h2>
            <p className="text-sm text-plum-soft">Nyss framgrävt ur lagret.</p>
          </div>
        </div>
        <ProductCarousel products={latest} />
      </section>

      {/* Category navigation */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <h2 className="mb-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Utforska kategorier
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {collections.map((c) => (
            <Link
              key={c.handle}
              href={`/kategori/${c.handle}`}
              className="group flex flex-col items-center gap-2 rounded-2xl bg-white p-6 text-center shadow-card transition-transform hover:-translate-y-1"
            >
              <span aria-hidden className="text-4xl">
                {CATEGORY_EMOJI[c.handle] ?? "✨"}
              </span>
              <span className="font-display text-lg font-bold text-ink group-hover:text-fuchsia-brand">
                {c.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="grid items-center gap-6 rounded-3xl bg-sand/60 p-6 sm:grid-cols-2 sm:p-10">
          <div>
            <span className="inline-flex rounded-pill bg-fuchsia-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-fuchsia-deep">
              Vår historia
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
              Räddat ur ett tömt lager
            </h2>
            <div className="mt-4 space-y-3 text-plum-soft">
              <p>
                När ett svenskt smyckesmärke lade ner blev hela lagret över:
                lådvis med smycken som aldrig hann ut i butik. Oanvända, oburna,
                fortfarande i sina originalförpackningar.
              </p>
              <p>
                Istället för att låta dem samla damm har vi räddat dem — och
                säljer dem vidare långt under ursprungspris. Varje pjäs är ett
                litet stycke vintage som väntar på sin första ägare.
              </p>
              <p className="font-semibold text-ink">
                Lagret är begränsat. När ett fynd är borta kommer det inte
                tillbaka.
              </p>
            </div>
            <Link
              href="/om-oss"
              className="mt-5 inline-block rounded-pill bg-ink px-5 py-2.5 font-bold text-cream transition hover:bg-plum"
            >
              Läs hela historien
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: "100%", l: "Oanvänt & aldrig buret" },
              { n: "−60%", l: "Ofta mot ursprungspris" },
              { n: "1 av 1", l: "Ofta bara ett kvar" },
              { n: "🇸🇪", l: "Svenskt lager" },
            ].map((stat) => (
              <div
                key={stat.l}
                className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center shadow-card"
              >
                <span className="font-display text-2xl font-extrabold text-fuchsia-brand">
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
        <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-fuchsia-brand/40 bg-white p-6 sm:p-10">
          <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-flex rounded-pill bg-gold-soft/60 px-3 py-1 text-xs font-bold uppercase tracking-wide text-plum">
                Flaggskeppet
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                Skapa ditt eget paket
              </h2>
              <p className="mt-2 max-w-md text-plum-soft">
                Välj {BUNDLE_CONFIG.size} valfria pjäser från vilka kategorier
                du vill, samla dem i din bricka och få allt i en fin{" "}
                {BUNDLE_CONFIG.packageName.toLowerCase()} — för bara{" "}
                {formatPrice(BUNDLE_CONFIG.pricePerBundle)}.
              </p>
              <Link
                href="/paket"
                className="mt-5 inline-block rounded-pill bg-fuchsia-brand px-6 py-3 font-bold text-white transition hover:bg-fuchsia-deep"
              >
                Bygg ditt paket →
              </Link>
            </div>
            <div className="hidden text-8xl sm:block" aria-hidden>
              🎁
            </div>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <EmailCaptureBlock />
    </div>
  );
}
