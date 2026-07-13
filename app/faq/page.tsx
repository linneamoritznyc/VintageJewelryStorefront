import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { store } from "@/lib/shopify";
import { RichContent } from "@/components/content/RichContent";

export const metadata: Metadata = {
  title: "FAQ: Vanliga frågor",
  description: "Vanliga frågor om Fyndlådan, leverans, ångerrätt och betalning.",
};

export default async function FaqPage() {
  const page = await store.getPage("faq");
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{page.title}</h1>
      <RichContent html={page.bodyHtml} className="mt-6" />
    </div>
  );
}
