import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/shopify";
import { RichContent } from "@/components/content/RichContent";

export const metadata: Metadata = {
  title: "Leverans",
  description: "Frakt, leveranstid och fraktkostnad hos Fyndlådan.",
};

export default async function ShippingPage() {
  const page = await store.getPage("leverans");
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{page.title}</h1>
      <RichContent html={page.bodyHtml} className="mt-6" />
      <div className="mt-6 rounded-2xl border border-plum-soft/25 bg-white px-5 py-4">
        <p className="text-sm text-plum-soft">
          Fundera på en retur? Läs om vår{" "}
          <Link href="/angerratt" className="font-semibold text-fuchsia-brand underline">
            14 dagars ångerrätt
          </Link>
          , eller starta den direkt:
        </p>
        <a
          href="https://shopify.com/102317621595/account"
          className="mt-3 inline-block rounded-pill bg-fuchsia-brand px-5 py-2.5 font-bold text-white transition hover:bg-fuchsia-deep"
        >
          Ångra ditt köp
        </a>
      </div>
    </div>
  );
}
