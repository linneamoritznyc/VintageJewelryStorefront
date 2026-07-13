import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/shopify";
import { RichContent } from "@/components/content/RichContent";

export const metadata: Metadata = {
  title: "Skapa ditt eget paket",
  description: "Så funkar Fyndlådans paketbyggare, och varför du ska prova den.",
  alternates: { canonical: "/skapa-ditt-eget-paket" },
};

export default async function SkapaDittEgetPaketPage() {
  const page = await store.getPage("skapa-ditt-eget-paket");
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{page.title}</h1>
      <RichContent html={page.bodyHtml} className="mt-6" />
      <Link
        href="/paket"
        className="mt-8 inline-block rounded-pill bg-fuchsia-brand px-6 py-3 font-bold text-white transition hover:bg-fuchsia-deep"
      >
        Öppna paketbyggaren →
      </Link>
    </div>
  );
}
