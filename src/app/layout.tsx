import type { Metadata } from "next";
import { getSiteUrl, pageMetadata, siteTitle } from "@/lib/site-metadata";
import { staticDecorStyle } from "@/lib/static-decor";
import "./globals.css";
import "./storefront.css";
import "./cart.css";
import "./checkout.css";
import "./pastel.css";
import "./custom-controls.css";
import "./motion.css";

export const metadata: Metadata = {
  ...pageMetadata("/"),
  metadataBase: getSiteUrl(),
  title: {
    default: siteTitle,
    template: "%s — СЕЗОН",
  },
  description: "Концептуальный интернет-магазин букетов и сезонных цветочных композиций. Заказы и оплата не выполняются.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" style={staticDecorStyle()}>
      <body>{children}</body>
    </html>
  );
}
