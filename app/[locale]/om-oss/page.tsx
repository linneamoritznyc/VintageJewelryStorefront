import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "about" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("about");
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <h1 className="text-heading font-light text-ink">{t("title")}</h1>
      <div className="mt-6 space-y-5 text-body text-ink-muted">
        <p>{t("paragraph1")}</p>
        <p>{t("paragraph2")}</p>
        <p className="text-ink">{t("closingLine")}</p>
      </div>
      <Link
        href="/kategori/orhangen"
        className="mt-8 inline-block border border-accent bg-accent px-6 py-3 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover"
      >
        {t("seeAll")}
      </Link>
    </div>
  );
}
