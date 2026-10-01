import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/site-metadata";
import { assetPath, sitePath } from "../lib/deployment";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: base ? { userAgent: "*", allow: sitePath("/"), disallow: [assetPath("/cart"), assetPath("/checkout")] } : { userAgent: "*", disallow: "/" },
    sitemap: base ? new URL(assetPath("/sitemap.xml"), base).href : undefined,
  };
}
