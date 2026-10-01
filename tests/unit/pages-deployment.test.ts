import { afterEach, expect, it, vi } from "vitest";
import { assetPath, sitePath } from "../../src/lib/deployment";
import loader from "../../src/lib/static-image-loader";
import { staticDecorStyle } from "../../src/lib/static-decor";
import { pageMetadata } from "../../src/lib/site-metadata";
import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";

afterEach(() => vi.unstubAllEnvs());

it.each(["", "/sezon"])("Pages assets and metadata use basePath %s", (prefix) => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", prefix);
  vi.stubEnv("NEXT_PUBLIC_STATIC_EXPORT", "1");
  vi.stubEnv("SITE_URL", "https://sumergeg.github.io");
  expect(assetPath("/images/flowers/hero.webp")).toBe(`${prefix}/images/flowers/hero.webp`);
  expect(sitePath("/")).toBe(`${prefix}/`);
  expect(loader({ src: "/images/flowers/first-light.webp", width: 384 })).toBe(`${prefix}/images/static/flowers/first-light-384.webp`);
  expect(pageMetadata("/shop").alternates).toEqual({ canonical: `https://sumergeg.github.io${prefix}/shop/` });
  expect(pageMetadata("/shop").openGraph).toMatchObject({ images: [{ url: `https://sumergeg.github.io${prefix}/images/flowers/hero.webp` }] });
  expect(robots().sitemap).toBe(`https://sumergeg.github.io${prefix}/sitemap.xml`);
  expect(robots().rules).toEqual({ userAgent: "*", allow: `${prefix}/`, disallow: [`${prefix}/cart`, `${prefix}/checkout`] });
  expect(sitemap().map(entry => entry.url)).toContain(`https://sumergeg.github.io${prefix}/shop/first-light/`);
  const style = staticDecorStyle();
  expect(style).toMatchObject({ "--decor-climber-mobile": expect.stringContaining(`${prefix}/images/static/decor/rose-climber-128.webp`), "--decor-trail-desktop": expect.stringContaining(`${prefix}/images/static/decor/meadow-trail-1920.webp`) });
  expect(JSON.stringify(style)).not.toContain("/_next/image");
});

it("Node mode retains existing root paths and runtime decoration", () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
  vi.stubEnv("NEXT_PUBLIC_STATIC_EXPORT", "0");
  expect(sitePath("/shop")).toBe("/shop");
  expect(staticDecorStyle()).toBeUndefined();
});
