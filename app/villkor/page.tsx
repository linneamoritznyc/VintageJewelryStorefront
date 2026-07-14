import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Köpvillkor",
  description: "Allmänna köpvillkor för Fyndlådan.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <h1 className="text-heading font-light text-ink">Köpvillkor</h1>
      <div className="mt-6 space-y-6 text-body text-ink-muted">
        <section>
          <h2 className="text-sub text-ink">Priser</h2>
          <p className="mt-2">
            Alla priser anges i svenska kronor (SEK) inklusive moms. Vi
            reserverar oss för eventuella pris- och lagerfel.
          </p>
        </section>
        <section>
          <h2 className="text-sub text-ink">Beställning</h2>
          <p className="mt-2">
            Ett köpavtal ingås när din beställning bekräftas i kassan. Eftersom
            lagret är begränsat kan en vara ta slut innan beställningen slutförs.
          </p>
        </section>
        <section>
          <h2 className="text-sub text-ink">Betalning</h2>
          <p className="mt-2">
            Betalning sker säkert via Shopifys checkout med de betalmetoder som
            visas i kassan.
          </p>
        </section>
        <section>
          <h2 className="text-sub text-ink">Rabattkoder</h2>
          <p className="mt-2">
            En rabattkod kan användas per beställning om inget annat anges.
            Rabattkoder kan inte kombineras och gäller under angiven period.
          </p>
        </section>
      </div>
    </div>
  );
}
