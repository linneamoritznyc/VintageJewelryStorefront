import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/shopify";
import { RichContent } from "@/components/content/RichContent";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const article = await store.getBlogArticle(params.handle);
  if (!article) return { title: "Inlägget hittades inte" };
  return { title: article.title };
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" }).format(new Date(iso));
}

export default async function BlogArticlePage({
  params,
}: {
  params: { handle: string };
}) {
  const article = await store.getBlogArticle(params.handle);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <nav className="mb-4 text-sm text-plum-soft" aria-label="Brödsmulor">
        <Link href="/blogg" className="transition hover:text-fuchsia-brand">
          Blogg
        </Link>
        <span className="mx-1.5" aria-hidden>
          /
        </span>
        <span className="text-ink">{article.title}</span>
      </nav>
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-plum-soft/70">
        {formatDate(article.publishedAt)}
      </p>
      <RichContent html={article.bodyHtml} className="mt-6" />
    </div>
  );
}
