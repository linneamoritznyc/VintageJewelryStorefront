import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk } from "next/font/google";
import "./globals.css";

const grotesk = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});
import { store } from "@/lib/shopify";
import { getSiteContent } from "@/lib/content";
import { isNavCollectionHandle } from "@/lib/config/navigation";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TAGLINE } from "@/lib/config/site";
import { CartProvider } from "@/lib/cart/CartContext";
import { ConsentProvider } from "@/lib/consent/ConsentContext";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { EmailPopup } from "@/components/marketing/EmailPopup";
import { Analytics } from "@/components/marketing/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "sv_SE",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF6EE",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Categories drive nav + footer; content drives the marketing surfaces.
  // store.getCollections() returns every Shopify collection (including
  // system/curated ones not meant for primary nav), filter to the four
  // jewelry categories, see lib/config/navigation.ts.
  const [allCollections, content] = await Promise.all([
    store.getCollections(),
    getSiteContent(),
  ]);
  const navCollections = allCollections.filter((c) => isNavCollectionHandle(c.handle));

  return (
    <html lang="sv" className={grotesk.variable}>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <ConsentProvider>
          <CartProvider>
            <AnnouncementBanner content={content.announcement} />
            <Header collections={navCollections} />
            <main className="min-h-[60vh]">{children}</main>
            <Footer collections={navCollections} />
            <CartDrawer />
            <EmailPopup content={content.emailPopup} />
            <CookieConsent />
            <Analytics />
          </CartProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
