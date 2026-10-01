import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl, pageMetadata } from "../../src/lib/site-metadata";
import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";

afterEach(() => vi.unstubAllEnvs());

describe("deployment metadata", () => {
  it("preview не выдумывает domain и не индексируется", () => {
    vi.stubEnv("SITE_URL", "");
    expect(getSiteUrl()).toBeUndefined();
    expect(pageMetadata("/shop").alternates).toBeUndefined();
    expect(pageMetadata("/shop").robots).toEqual({ index: false, follow: false });
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    expect(sitemap()).toEqual([]);
  });
  it("canonical/OG/sitemap используют заданный origin; cart/checkout не входят в sitemap", () => {
    vi.stubEnv("SITE_URL", "https://season.example");
    const metadata = pageMetadata("/shop", "Букеты");
    expect(metadata.alternates).toEqual({ canonical: "https://season.example/shop" });
    expect(metadata.openGraph).toMatchObject({ title: "Букеты — СЕЗОН", siteName: "СЕЗОН · концепт", url: new URL("https://season.example/shop") });
    expect(robots().sitemap).toBe("https://season.example/sitemap.xml");
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toHaveLength(21);
    expect(urls).toContain("https://season.example/shop/first-light");
    expect(urls).toContain("https://season.example/collections/morning-garden");
    expect(urls).not.toContain("https://season.example/cart");
    expect(urls).not.toContain("https://season.example/checkout");
  });
  it.each(["not-a-url", "ftp://season.example", "https://user:password@season.example", "https://season.example/subpath", "https://season.example/?preview=1", "https://season.example/#fragment"])("некорректный origin %s отклоняется", (value) => {
    vi.stubEnv("SITE_URL", value);
    expect(getSiteUrl).toThrow("SITE_URL");
  });
});
