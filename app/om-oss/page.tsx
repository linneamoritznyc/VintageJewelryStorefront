import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/shopify";
import { RichContent } from "@/components/content/RichContent";

export const metadata: Metadata = {
  title: "Vår historia",
  alternates: { canonical: "/om-oss" },
  description:
    "Historien bakom Fyndlådan, oanvända smycken räddade ur tomma varuhuslager.",
};

export default async function AboutPage() {
  const page = await store.getPage("om-oss");
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{page.title}</h1>
      <RichContent html={page.bodyHtml} className="mt-6" />
      <Link
        href="/kategori/orhangen"
        className="mt-8 inline-block rounded-pill bg-fuchsia-brand px-6 py-3 font-bold text-white transition hover:bg-fuchsia-deep"
      >
        Börja fynda
      </Link>
    </div>
  );
}
