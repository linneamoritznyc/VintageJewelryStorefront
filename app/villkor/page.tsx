import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Köpvillkor",
  description: "Allmänna köpvillkor för Fyndlådan.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
        Köpvillkor
      </h1>
      <div className="mt-6 space-y-6 text-plum-soft">
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Priser</h2>
          <p className="mt-2 leading-relaxed">
            Alla priser anges i svenska kronor (SEK) inklusive moms. Vi
            reserverar oss för eventuella pris- och lagerfel.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Beställning</h2>
          <p className="mt-2 leading-relaxed">
            Ett köpavtal ingås när din beställning bekräftas i kassan. Eftersom
            lagret är begränsat kan en vara ta slut innan beställningen slutförs.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Betalning</h2>
          <p className="mt-2 leading-relaxed">
            Betalning sker säkert via Shopifys checkout med de betalmetoder som
            visas i kassan.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Rabattkoder</h2>
          <p className="mt-2 leading-relaxed">
            En rabattkod kan användas per beställning om inget annat anges.
            Rabattkoder kan inte kombineras och gäller under angiven period.
          </p>
        </section>
      </div>
    </div>
  );
}
