import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "legal.terms" });
  return { title: t("title"), description: t("description") };
}

export default async function TermsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("legal.terms");
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <h1 className="text-heading font-light text-ink">{t("title")}</h1>
      <div className="mt-6 space-y-6 text-body text-ink-muted">
        <section>
          <h2 className="text-sub text-ink">{t("pricesHeading")}</h2>
          <p className="mt-2">{t("pricesBody")}</p>
        </section>
        <section>
          <h2 className="text-sub text-ink">{t("orderHeading")}</h2>
          <p className="mt-2">{t("orderBody")}</p>
        </section>
        <section>
          <h2 className="text-sub text-ink">{t("paymentHeading")}</h2>
          <p className="mt-2">{t("paymentBody")}</p>
        </section>
        <section>
          <h2 className="text-sub text-ink">{t("couponsHeading")}</h2>
          <p className="mt-2">{t("couponsBody")}</p>
        </section>
      </div>
    </div>
  );
}
