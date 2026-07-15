import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description: "Så hanterar Fyndlådan dina personuppgifter.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <h1 className="text-heading font-light text-ink">Integritetspolicy</h1>
      <div className="mt-6 space-y-6 text-body text-ink-muted">
        <p>
          Vi värnar om din integritet och behandlar dina personuppgifter i enlighet med GDPR. Nedan
          beskriver vi kortfattat hur vi hanterar din data.
        </p>
        <section>
          <h2 className="text-sub text-ink">Vilka uppgifter vi samlar in</h2>
          <p className="mt-2">
            Vid köp samlar vi in de uppgifter som behövs för att behandla din beställning, till
            exempel namn, adress och kontaktuppgifter. Vid nyhetsbrevsregistrering sparar vi din
            e-postadress.
          </p>
        </section>
        <section>
          <h2 className="text-sub text-ink">Hur vi använder uppgifterna</h2>
          <p className="mt-2">
            Uppgifterna används för att hantera dina köp, ge dig kundservice och, om du valt det,
            skicka erbjudanden. Betalning och orderhantering sker via Shopify.
          </p>
        </section>
        <section>
          <h2 className="text-sub text-ink">Dina rättigheter</h2>
          <p className="mt-2">
            Du har rätt att begära utdrag, rättelse eller radering av dina uppgifter. Kontakta oss
            på{" "}
            <a href="mailto:hej@fyndladan.se" className="text-ink underline hover:text-accent">
              hej@fyndladan.se
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
