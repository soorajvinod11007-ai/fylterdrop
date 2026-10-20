import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { AdminProvider } from "@/context/AdminContext";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Fylter",
    "aesthetic stationery",
    "cute novelty gifts",
    "smart everyday finds",
    "kids gifts",
    "lifestyle accessories",
    "curated gifts India",
  ],
  authors: [{ name: "Fylter" }],
  creator: "Fylter",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/assets/fylter-logo.jpeg",
        width: 1200,
        height: 630,
        alt: "FYLTER — Little finds, big happy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/assets/fylter-logo.jpeg"],
  },
  icons: {
    icon: "/assets/fylter-logo.jpeg",
    apple: "/assets/fylter-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-fylter-offWhite text-fylter-darkText">
        <AdminProvider>
          <LayoutShell>{children}</LayoutShell>
        </AdminProvider>
      </body>
    </html>
  );
}
