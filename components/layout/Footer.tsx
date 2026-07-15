import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Collection } from "@/lib/shopify/types";

export function Footer({ collections }: { collections: Collection[] }) {
  const t = useTranslations("footer");
  return (
    <footer className="mt-16 border-t border-line bg-bg">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="wordmark text-ink">Fyndlådan</p>
        </div>

        <div>
          <h3 className="text-body italic text-ink-label">{t("shopHeading")}</h3>
          <ul className="mt-3 space-y-2 text-body">
            {collections.map((c) => (
              <li key={c.handle}>
                <Link
                  href={`/kategori/${c.handle}`}
                  className="text-ink-muted transition hover:text-ink"
                >
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/paket" className="text-ink-muted transition hover:text-ink">
                {t("bundleLink")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-body italic text-ink-label">{t("aboutHeading")}</h3>
          <ul className="mt-3 space-y-2 text-body">
            <li>
              <Link href="/om-oss" className="text-ink-muted transition hover:text-ink">
                {t("ourStory")}
              </Link>
            </li>
            <li>
              <Link href="/leverans" className="text-ink-muted transition hover:text-ink">
                {t("shippingReturns")}
              </Link>
            </li>
            <li>
              <Link href="/angra-kop" className="text-ink-muted transition hover:text-ink">
                {t("cancelPurchase")}
              </Link>
            </li>
            <li>
              <a
                href="https://shopify.com/102317621595/account"
                className="text-ink-muted transition hover:text-ink"
              >
                {t("myAccount")}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-body italic text-ink-label">{t("termsHeading")}</h3>
          <ul className="mt-3 space-y-2 text-body">
            <li>
              <Link href="/villkor" className="text-ink-muted transition hover:text-ink">
                {t("purchaseTerms")}
              </Link>
            </li>
            <li>
              <Link href="/integritet" className="text-ink-muted transition hover:text-ink">
                {t("privacyPolicy")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-6 py-4">
        <p className="mx-auto max-w-6xl text-center text-small text-ink-muted">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
