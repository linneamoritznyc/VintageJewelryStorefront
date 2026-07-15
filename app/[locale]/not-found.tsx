import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-heading font-light text-ink">{t("title")}</h1>
      <p className="mt-2 text-body text-ink-muted">{t("body")}</p>
      <Link
        href="/"
        className="mt-6 inline-block border border-accent bg-accent px-6 py-3 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover"
      >
        {t("backToHome")}
      </Link>
    </div>
  );
}
