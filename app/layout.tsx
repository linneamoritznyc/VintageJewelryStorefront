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
import { CartProvider } from "@/lib/cart/CartContext";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { EmailPopup } from "@/components/marketing/EmailPopup";

export const metadata: Metadata = {
  title: {
    default: "Fyndlådan, oanvända vintagesmycken till fyndpris",
    template: "%s · Fyndlådan",
  },
  description:
    "Oanvända vintagesmycken från ett tömt lager. Aldrig burna, alltid långt under ursprungspris. Örhängen, halsband, armband och mer, fynd så länge lagret räcker.",
  openGraph: {
    title: "Fyndlådan",
    description:
      "Oanvända vintagesmycken från ett tömt lager. Fynd så länge lagret räcker.",
    locale: "sv_SE",
    type: "website",
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
        <CartProvider>
          <AnnouncementBanner content={content.announcement} />
          <Header collections={navCollections} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer collections={navCollections} />
          <CartDrawer />
          <EmailPopup content={content.emailPopup} />
        </CartProvider>
      </body>
    </html>
  );
}
