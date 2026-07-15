import type { Metadata, Viewport } from "next";
import { Cormorant } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";

// One typeface, everywhere: headings, body, labels, prices, the wordmark.
// Weights 300/400/500 plus italics, per the brand design guide.
const cormorant = Cormorant({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
import { store } from "@/lib/shopify";
import { getSiteContent } from "@/lib/content";
import { CartProvider } from "@/lib/cart/CartContext";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { EmailPopup } from "@/components/marketing/EmailPopup";
import { JEWELRY_COLLECTION_HANDLES } from "@/lib/config/categories";
import { SITE_URL } from "@/lib/config/site";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const TITLES: Record<string, { title: string; description: string }> = {
  sv: {
    title: "Fyndlådan, vintagesmycken i originalskick",
    description:
      "Vintagesmycken från ett svenskt varuhus, i originalskick. Örhängen, halsband, armband och mer, ett exemplar av det mesta.",
  },
  en: {
    title: "Fyndlådan, vintage jewelry in original condition",
    description:
      "Vintage jewelry from a closed-down Swedish department store, in original condition. Earrings, necklaces, bracelets and more, one of most pieces.",
  },
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const copy = TITLES[locale] ?? TITLES.sv;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: copy.title,
      template: "%s · Fyndlådan",
    },
    description: copy.description,
    alternates: {
      languages: {
        sv: `${SITE_URL}/`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title: "Fyndlådan",
      description: copy.description,
      locale: locale === "en" ? "en_US" : "sv_SE",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#F6F4EE",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);

  // Categories drive nav + footer; content drives the marketing surfaces.
  // Nav stays scoped to the four jewelry categories, keeping the accessory
  // and curated collections out of the primary nav clutter.
  const [allCollections, content, messages] = await Promise.all([
    store.getCollections(),
    getSiteContent(),
    getMessages(),
  ]);
  const collections = allCollections.filter((c) => JEWELRY_COLLECTION_HANDLES.includes(c.handle));

  return (
    <html lang={locale} className={cormorant.variable}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <AnnouncementBanner content={content.announcement} />
            <Header collections={collections} />
            <main className="min-h-[60vh]">{children}</main>
            <Footer collections={collections} />
            <CartDrawer />
            <EmailPopup content={content.emailPopup} />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
