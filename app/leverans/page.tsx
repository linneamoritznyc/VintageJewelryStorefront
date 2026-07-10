import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leverans & retur",
  description: "Information om frakt, leveranstid och returer hos Fyndlådan.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
        Leverans &amp; retur
      </h1>
      <div className="mt-6 space-y-6 text-plum-soft">
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Frakt</h2>
          <p className="mt-2 leading-relaxed">
            Vi skickar med spårbar leverans inom Sverige. Fraktkostnad och
            leveransalternativ visas i kassan, som hanteras säkert via Shopify.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Leveranstid</h2>
          <p className="mt-2 leading-relaxed">
            Beställningar packas normalt inom 1–3 arbetsdagar. Därefter tillkommer
            postens leveranstid.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Retur &amp; ångerrätt</h2>
          <p className="mt-2 leading-relaxed">
            Du har 14 dagars ångerrätt enligt distansavtalslagen. Kontakta oss så
            hjälper vi dig med din retur. Varan ska returneras i oanvänt skick.
          </p>
        </section>
        <p className="text-sm">
          Har du frågor? Mejla oss på{" "}
          <a
            href="mailto:hej@fyndladan.se"
            className="font-semibold text-fuchsia-brand underline"
          >
            hej@fyndladan.se
          </a>
          .
        </p>
      </div>
    </div>
  );
}
