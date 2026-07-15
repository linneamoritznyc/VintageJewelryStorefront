import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AngraForm } from "./AngraForm";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "cancelPurchase" });
  return { title: t("title"), description: t("description") };
}

export default async function AngraKopPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("cancelPurchase");
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <h1 className="text-heading font-light text-ink">{t("title")}</h1>
      <p className="mt-4 text-body text-ink-muted">{t("intro")}</p>
      <AngraForm />
    </div>
  );
}
