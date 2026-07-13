import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { store } from "@/lib/shopify";
import { RichContent } from "@/components/content/RichContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "FAQ: Vanliga frågor om vintage och second hand-smycken",
  description:
    "Vanliga frågor om Fyndlådan: är smyckena verkligen aldrig burna, varför priserna är låga, äkta silver eller guld, leverans, ångerrätt och betalning.",
  alternates: { canonical: "/faq" },
};

/**
 * Turn the FAQ page HTML (h2 question, following block = answer) into
 * question/answer pairs for FAQPage structured data. Answers are plain text.
 */
function parseFaq(html: string): { question: string; answer: string }[] {
  const items: { question: string; answer: string }[] = [];
  const parts = html.split(/<h2[^>]*>/i).slice(1);
  for (const part of parts) {
    const end = part.indexOf("</h2>");
    if (end === -1) continue;
    const question = part.slice(0, end).replace(/<[^>]+>/g, "").trim();
    const answer = part
      .slice(end + 5)
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (question && answer) items.push({ question, answer });
  }
  return items;
}

export default async function FaqPage() {
  const page = await store.getPage("faq");
  if (!page) notFound();

  const faqItems = parseFaq(page.bodyHtml);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      {faqItems.length > 0 && <JsonLd data={faqSchema(faqItems)} />}
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{page.title}</h1>
      <RichContent html={page.bodyHtml} className="mt-6" />
    </div>
  );
}
