import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getCollections } from "@/lib/shopify";
import { CartProvider } from "@/lib/cart/CartContext";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { EmailPopup } from "@/components/marketing/EmailPopup";

export const metadata: Metadata = {
  title: {
    default: "Vintageskatten — oanvända vintagesmycken till fyndpris",
    template: "%s · Vintageskatten",
  },
  description:
    "Oanvända vintagesmycken från ett tömt lager. Aldrig burna, alltid långt under ursprungspris. Örhängen, halsband, armband och mer — fynd så länge lagret räcker.",
  openGraph: {
    title: "Vintageskatten",
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
  // Categories drive nav + footer. Fetched once at the layout level.
  const collections = await getCollections();

  return (
    <html lang="sv">
      <body>
        <CartProvider>
          <AnnouncementBanner />
          <Header collections={collections} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer collections={collections} />
          <CartDrawer />
          <EmailPopup />
        </CartProvider>
      </body>
    </html>
  );
}
