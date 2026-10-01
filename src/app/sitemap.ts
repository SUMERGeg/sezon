import type { MetadataRoute } from "next";
import { catalog } from "../data/catalog";
import { getSiteUrl } from "../lib/site-metadata";
import { sitePath } from "../lib/deployment";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  if (!base) return [];
  return ["/", "/shop", "/about", "/delivery-care", ...catalog.products.map((product) => `/shop/${product.slug}`), ...catalog.collections.map((collection) => `/collections/${collection.slug}`)]
    .map((path) => ({ url: new URL(sitePath(path), base).href }));
}
