import type { Metadata } from "next";
import imageAssets from "../data/image-assets.json";
import { assetPath, sitePath } from "./deployment";

export const siteTitle = "СЕЗОН — концепт цветочного магазина";
export const siteDescription = "Концептуальный интернет-магазин букетов и сезонных цветочных композиций. Заказы и оплата не выполняются.";

export function getSiteUrl(): URL | undefined {
  const value = process.env.SITE_URL?.trim();
  if (!value) return undefined;
  let url: URL;
  try { url = new URL(value); } catch { throw new Error("SITE_URL должен содержать абсолютный HTTP(S) origin."); }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL должен содержать HTTP(S) origin без пути, credentials, query и hash.");
  }
  return url;
}

export function pageMetadata(path: string, title?: string, description = siteDescription): Metadata {
  const base = getSiteUrl();
  const url = base ? new URL(sitePath(path), base) : undefined;
  return {
    title,
    description,
    alternates: url ? { canonical: url.href } : undefined,
    robots: { index: Boolean(base), follow: Boolean(base) },
    openGraph: {
      title: title ? `${title} — СЕЗОН` : siteTitle,
      description,
      siteName: "СЕЗОН · концепт",
      locale: "ru_RU",
      type: "website",
      url,
      images: base ? [{ url: new URL(assetPath(imageAssets.hero.src), base).href, width: imageAssets.hero.width, height: imageAssets.hero.height, alt: "Сезонная композиция — иллюстрация концепта СЕЗОН" }] : [],
    },
  };
}
