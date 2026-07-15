import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "legal.shipping" });
  return { title: t("title"), description: t("description") };
}

export default async function ShippingPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("legal.shipping");
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <h1 className="text-heading font-light text-ink">{t("title")}</h1>
      <div className="mt-6 space-y-6 text-body text-ink-muted">
        <section>
          <h2 className="text-sub text-ink">{t("shippingHeading")}</h2>
          <p className="mt-2">{t("shippingBody")}</p>
        </section>
        <section>
          <h2 className="text-sub text-ink">{t("timeHeading")}</h2>
          <p className="mt-2">{t("timeBody")}</p>
        </section>
        <section>
          <h2 className="text-sub text-ink">{t("returnHeading")}</h2>
          <p className="mt-2">{t("returnBody")}</p>
          <p className="mt-3">
            <Link
              href="/angra-kop"
              className="text-ink underline underline-offset-2 hover:text-accent"
            >
              {t("cancelLink")}
            </Link>
          </p>
        </section>
        <p className="text-small italic text-ink-label">
          {t("questions")}{" "}
          <a href="mailto:hej@fyndladan.se" className="text-ink underline hover:text-accent">
            hej@fyndladan.se
          </a>
          .
        </p>
      </div>
    </div>
  );
}
