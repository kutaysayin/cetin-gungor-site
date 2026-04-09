/**
 * Kok duzen bileseni
 * Tum sayfalar icin ortak HTML iskeleti, ust menu (Header) ve alt bolum (Footer) icerir.
 */

import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import CookieConsent from "@/components/ui/CookieConsent";
import SessionProvider from "@/components/providers/SessionProvider";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Cetin Gungor - Manisa Insaat Malzemecileri Dernegi",
    default: "Cetin Gungor - Manisa Insaat Malzemecileri Dernegi",
  },
  description:
    "Manisa Insaat Malzemecileri Dernegi — sektorun sesi, uyelerin gucu. Haberler, etkinlikler ve uye hizmetleri icin resmi web sitemizi ziyaret edin.",
  keywords: [
    "Manisa insaat malzemeleri",
    "insaat dernegi",
    "Manisa dernek",
    "yapi malzemeleri",
    "Cetin Gungor",
  ],
  authors: [{ name: "Cetin Gungor" }],
  creator: "Cetin Gungor - Manisa Insaat Malzemecileri Dernegi",
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  themeColor: "#1a2744",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Cetin Gungor - Manisa Insaat Malzemecileri Dernegi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
          <CookieConsent />
          <ServiceWorkerRegister />
        </SessionProvider>
      </body>
    </html>
  );
}
