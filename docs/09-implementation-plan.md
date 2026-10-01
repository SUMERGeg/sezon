# 09. Implementation plan

## Phase 0 — foundation

Deliverables:
- create Next.js + TS project;
- strict lint/typecheck;
- global fonts and CSS tokens;
- route skeleton;
- data schemas and seed catalog;
- basic CI scripts.

Gate:
- app builds;
- no placeholder framework landing page;
- tokens exist before page-specific styling.

## Phase 1 — catalog domain

- product/collection schemas;
- catalog selectors;
- filter/sort pure functions;
- money formatting;
- static product/collection pages;
- `not-found` behavior.

Tests:
- schema validation;
- filters;
- sort;
- variant resolution.

## Phase 2 — storefront UI

- header/footer;
- home sections;
- catalog grid;
- filter controls;
- product gallery;
- variant selector;
- responsive layouts 390/768/1024/1440.

Gate:
- keyboard can navigate catalog and product variants;
- no horizontal overflow.

## Phase 3 — cart

- store + versioned persistence;
- add/merge/update/remove;
- cart page;
- subtotal;
- invalid storage recovery;
- add-to-cart feedback.

Tests:
- cart pure logic;
- local storage hydration;
- reload E2E.

## Phase 4 — demo checkout

- disclosure;
- delivery method/date/slot;
- ephemeral fields;
- form validation;
- total calculation;
- local success state;
- clear-on-completion.

Gate:
- no network request sends personal data;
- no payment fields.

## Phase 5 — visual polish

- real final image set;
- art-direction passes;
- hover/focus states;
- motion + reduced motion;
- typographic refinements;
- image crops by breakpoint.

Do visual polish only after core flows work.

## Phase 6 — quality

- Playwright critical flows;
- accessibility audit;
- visual regression snapshots;
- Lighthouse/Web Vitals pass;
- metadata/OG/sitemap;
- 404 and empty states;
- console/network clean pass.

## Phase 7 — portfolio handoff

- capture desktop/mobile screens;
- document case narrative;
- confirm concept status visible;
- remove test artifacts and unused dependencies;
- final README with run/build/test commands.
