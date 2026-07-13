import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mina beställningar",
  description: "Se dina beställningar och ångra ditt köp direkt online.",
};

const ACCOUNT_URL = "https://shopify.com/102317621595/account";

export default async function MinaBestallningarPage() {
  const content = await getSiteContent();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
        Mina beställningar
      </h1>
      <p className="mt-4 leading-relaxed text-plum-soft">
        Logga in på ditt konto för att se dina beställningar, spåra en leverans
        eller ångra ditt köp. Du behöver inte kontakta kundtjänst, hela
        processen sker direkt online.
      </p>
      <div className="mt-6 rounded-2xl border border-plum-soft/25 bg-white px-5 py-4 text-sm text-plum">
        <p className="font-semibold">{content.angerrattNotice}</p>
      </div>
      <a
        href={ACCOUNT_URL}
        className="mt-6 inline-block rounded-pill bg-fuchsia-brand px-6 py-3.5 text-center font-bold text-white transition hover:bg-fuchsia-deep"
      >
        Ångra ditt köp
      </a>
      <p className="mt-4 text-sm text-plum-soft">
        Du kan välja kontant återbetalning (förvalt) eller, som ett frivilligt
        alternativ, 110 % av ordervärdet i butikskredit. Läs mer på vår{" "}
        <Link href="/angerratt" className="font-semibold text-fuchsia-brand underline">
          ångerrätt-sida
        </Link>
        .
      </p>
    </div>
  );
}
