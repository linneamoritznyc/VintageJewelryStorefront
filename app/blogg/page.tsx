import type { Metadata } from "next";
import Link from "next/link";
import { store } from "@/lib/shopify";
import { RichContent } from "@/components/content/RichContent";

export const metadata: Metadata = {
  title: "Blogg",
  description: "Nyheter, guider och historier från Fyndlådan.",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" }).format(new Date(iso));
}

export default async function BlogIndexPage() {
  const articles = await store.getBlogArticles();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Blogg</h1>
      <div className="mt-8 space-y-8">
        {articles.map((article) => (
          <article key={article.handle} className="border-b border-sand pb-8 last:border-none">
            <Link href={`/blogg/${article.handle}`} className="group">
              <h2 className="font-display text-xl font-bold text-ink transition group-hover:text-fuchsia-brand">
                {article.title}
              </h2>
            </Link>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-plum-soft/70">
              {formatDate(article.publishedAt)}
            </p>
            <RichContent html={article.summaryHtml} className="mt-2 space-y-0" />
            <Link
              href={`/blogg/${article.handle}`}
              className="mt-3 inline-block text-sm font-bold text-fuchsia-brand transition hover:text-fuchsia-deep"
            >
              Läs mer →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
