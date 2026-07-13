import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { store } from "@/lib/shopify";
import { RichContent } from "@/components/content/RichContent";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description: "Så hanterar Fyndlådan dina personuppgifter.",
  alternates: { canonical: "/integritetspolicy" },
};

export default async function PrivacyPage() {
  const page = await store.getPage("integritetspolicy");
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{page.title}</h1>
      <RichContent html={page.bodyHtml} className="mt-6" />
    </div>
  );
}
