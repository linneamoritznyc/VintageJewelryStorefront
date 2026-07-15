import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "legal.privacy" });
  return { title: t("title"), description: t("description") };
}

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("legal.privacy");
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <h1 className="text-heading font-light text-ink">{t("title")}</h1>
      <div className="mt-6 space-y-6 text-body text-ink-muted">
        <p>{t("intro")}</p>
        <section>
          <h2 className="text-sub text-ink">{t("collectHeading")}</h2>
          <p className="mt-2">{t("collectBody")}</p>
        </section>
        <section>
          <h2 className="text-sub text-ink">{t("useHeading")}</h2>
          <p className="mt-2">{t("useBody")}</p>
        </section>
        <section>
          <h2 className="text-sub text-ink">{t("rightsHeading")}</h2>
          <p className="mt-2">
            {t("rightsBody")}{" "}
            <a href="mailto:hej@fyndladan.se" className="text-ink underline hover:text-accent">
              hej@fyndladan.se
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
