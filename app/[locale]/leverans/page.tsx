import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Leverans och retur",
  description: "Information om frakt, leveranstid och returer hos Fyndlådan.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <h1 className="text-heading font-light text-ink">Leverans och retur</h1>
      <div className="mt-6 space-y-6 text-body text-ink-muted">
        <section>
          <h2 className="text-sub text-ink">Frakt</h2>
          <p className="mt-2">
            Vi skickar med spårbar leverans inom Sverige. Fraktkostnad och leveransalternativ visas
            i kassan, som hanteras säkert via Shopify.
          </p>
        </section>
        <section>
          <h2 className="text-sub text-ink">Leveranstid</h2>
          <p className="mt-2">
            Beställningar packas normalt inom 1 till 3 arbetsdagar. Därefter tillkommer postens
            leveranstid.
          </p>
        </section>
        <section>
          <h2 className="text-sub text-ink">Retur och ångerrätt</h2>
          <p className="mt-2">
            Du har 14 dagars ångerrätt enligt distansavtalslagen. Varan ska returneras i oanvänt
            skick.
          </p>
          <p className="mt-3">
            <Link
              href="/angra-kop"
              className="text-ink underline underline-offset-2 hover:text-accent"
            >
              Ångra ditt köp
            </Link>
          </p>
        </section>
        <p className="text-small italic text-ink-label">
          Har du frågor? Mejla oss på{" "}
          <a href="mailto:hej@fyndladan.se" className="text-ink underline hover:text-accent">
            hej@fyndladan.se
          </a>
          .
        </p>
      </div>
    </div>
  );
}
