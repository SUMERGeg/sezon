# 12. Performance & SEO

## Performance budget mindset

The site is photo-heavy, so image discipline matters more than micro-optimizing JavaScript.

Targets as guidance, measured on production-like build:
- LCP ideally <2.5s on representative mobile connection/device;
- CLS <0.1;
- INP <200ms where practical;
- no multi-megabyte above-the-fold image payload.

## Images

- explicit width/height or stable aspect-ratio;
- responsive `sizes`;
- only true LCP image gets priority/preload;
- catalog images lazy load, except the first visible candidate for LCP;
- provide mobile-friendly crops if art direction requires;
- avoid full-resolution originals for thumbnails;
- secondary hover image loads opportunistically, not eagerly for 16 cards.

## Fonts

- self-host or framework-optimized loading when licensing permits;
- subset Cyrillic/Latin as appropriate;
- avoid 8 weights;
- set fallback metrics where possible to reduce layout shift.

## JavaScript

- keep home mostly server-rendered;
- no global client wrapper unless required;
- dynamic import expensive non-critical interactions;
- prefer CSS transition for simple hover/reveal;
- avoid heavy carousel library for 4 images if small custom accessible gallery suffices.

## SEO scope

Because this is a portfolio concept, SEO must not misrepresent it as a real florist.

Implement:
- page titles/descriptions;
- canonical URLs for deployed domain;
- Open Graph images;
- sitemap;
- robots policy chosen for deployment context;
- meaningful headings and links.

Avoid e-commerce structured data that could misleadingly imply real purchasable inventory if the public deployment is explicitly a concept. If later converted to a real store, add Product/Offer schema using verified data.

## Metadata examples

Home title:
`СЕЗОН — концепт цветочного магазина`

Description:
`Концептуальный интернет-магазин букетов и сезонных цветочных композиций: каталог, выбор варианта, корзина и демонстрационное оформление.`

## URL hygiene

- stable slugs;
- lowercase Latin slugs preferred for technical consistency;
- invalid query params ignored;
- filters do not generate uncontrolled indexable URL explosion.

## M7 verification

Run `npm run test:perf` for the dedicated production mobile lab profile. Botanical CSS decorations use density-aware image-set URLs through the Next image optimizer; original illustration files remain unchanged. The first catalog photo loads eagerly and the initial product gallery photo receives preload. Final measurements, browser coverage, deployment configuration and limitations are recorded in [release-report.md](release-report.md).

Set `SITE_URL` to the public origin before the deployment build. Without it, previews remain noindex with a disallow-all robots policy and empty sitemap. Cart and checkout remain noindex with or without a configured domain.
