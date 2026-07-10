import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description: "Så hanterar Vintageskatten dina personuppgifter.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
        Integritetspolicy
      </h1>
      <div className="mt-6 space-y-6 text-plum-soft">
        <p className="leading-relaxed">
          Vi värnar om din integritet och behandlar dina personuppgifter i
          enlighet med GDPR. Nedan beskriver vi kortfattat hur vi hanterar din
          data.
        </p>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">
            Vilka uppgifter vi samlar in
          </h2>
          <p className="mt-2 leading-relaxed">
            Vid köp samlar vi in de uppgifter som behövs för att behandla din
            beställning, t.ex. namn, adress och kontaktuppgifter. Vid
            nyhetsbrevsregistrering sparar vi din e-postadress.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">
            Hur vi använder uppgifterna
          </h2>
          <p className="mt-2 leading-relaxed">
            Uppgifterna används för att hantera dina köp, ge dig kundservice och
            – om du valt det – skicka erbjudanden. Betalning och orderhantering
            sker via Shopify.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Dina rättigheter</h2>
          <p className="mt-2 leading-relaxed">
            Du har rätt att begära utdrag, rättelse eller radering av dina
            uppgifter. Kontakta oss på{" "}
            <a
              href="mailto:hej@vintageskatten.se"
              className="font-semibold text-fuchsia-brand underline"
            >
              hej@vintageskatten.se
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
