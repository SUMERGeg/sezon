# 06. Technical architecture

## 1. Goal

Архитектура должна выглядеть production-minded, но оставаться разумной для портфолио-концепта без backend.

## 2. Recommended runtime model

- Next.js App Router;
- TypeScript strict mode;
- Server Components по умолчанию;
- Client Components только для catalog filters, variant selectors, cart, drawers, checkout form;
- static product/collection data validated at build/dev time;
- no database in MVP;
- no payment provider;
- no order API.

## 3. Proposed structure

```text
src/
├── app/
│   ├── (store)/
│   │   ├── page.tsx
│   │   ├── shop/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── collections/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── about/page.tsx
│   │   └── delivery-care/page.tsx
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/
│   ├── layout/
│   ├── catalog/
│   ├── product/
│   ├── cart/
│   └── checkout/
├── data/
│   ├── products.ts
│   ├── collections.ts
│   ├── delivery.ts
│   └── schemas.ts
├── domain/
│   ├── catalog/
│   ├── cart/
│   └── checkout/
├── store/
│   └── cart-store.ts
├── lib/
│   ├── money.ts
│   ├── storage.ts
│   ├── seo.ts
│   └── cn.ts
└── types/
```

## 4. Layer boundaries

### `data/`
Демонстрационный контент. Никакой UI-логики.

### `domain/`
Pure business functions:
- resolve variant;
- calculate line total;
- merge cart items;
- calculate subtotal/delivery/total;
- catalog filtering/sorting;
- sanitize persisted cart references.

### `store/`
Оркестрация browser state. Не содержит форматирования цен или React markup.

### `components/`
Представление и interaction composition.

### `app/`
Routing, metadata, server data selection, page composition.

## 5. Rendering strategy

Home/catalog/product/collection content should be statically renderable.

Product pages:
- `generateStaticParams()` from catalog;
- server-rendered core content;
- client island for variant selection/add-to-cart.

Catalog:
- initial full product data from server;
- client filter UI can derive visible results;
- optionally sync filter state to URL `searchParams` without needing server API.

Cart/checkout:
- client-driven because state lives in browser;
- render stable shell before hydration to avoid misleading totals.

## 6. State ownership

Server owns:
- catalog truth;
- product metadata;
- price definitions;
- demo availability definitions.

Browser store owns:
- cart references;
- selected UI options;
- non-sensitive checkout session state only during current page/session.

Never trust persisted price or product title from localStorage.

## 7. Images

Use `next/image` or equivalent image pipeline:
- explicit dimensions/aspect ratios;
- responsive `sizes`;
- hero preload only for actual LCP candidate;
- AVIF/WebP where pipeline supports;
- avoid loading second hover image eagerly for every catalog card.

## 8. Styling

Preferred:
- Tailwind CSS 4 with theme tokens mapped from design system, or CSS variables + utility classes.

Rules:
- semantic design tokens first;
- no random hex values in page components;
- avoid giant one-off class strings repeated across pages;
- extract components only after repeat emerges.

## 9. Animation

Motion dependency isolated behind small components/hooks. Most UI transitions should be CSS. JS animation is reserved for:
- gallery transition;
- menu/drawer;
- selected hero reveal if desired.

## 10. Forms

Checkout is client-only demo. Use controlled/uncontrolled form with schema validation. No POST to external service. No server action that writes contact data.

## 11. Error handling

- invalid product slug → Next `notFound()`;
- corrupt localStorage → discard invalid rows, keep valid rows;
- missing variant → never crash page, select first available or require explicit selection;
- image missing in dev → fallback visual, fail QA before release.

## 12. Dependency policy

Before adding package:
1. identify exact problem;
2. check platform/native React/CSS capability;
3. prefer maintained focused dependency;
4. document non-trivial dependency in decision log;
5. do not add CMS/database/auth/payment to portfolio MVP.
