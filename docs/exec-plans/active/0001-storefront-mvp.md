# ExecPlan 0001 — Storefront MVP

## Goal

Собрать полностью проходимый demo-storefront «СЕЗОН»: главная, каталог, товар, корзина и демонстрационный checkout с качественным адаптивом.

## Context

Read when needed:
- product: `docs/00-product-brief.md`;
- UI: `docs/05-ui-specs.md`;
- architecture: `docs/06-technical-architecture.md`;
- data: `docs/07-data-model.md`;
- state: `docs/08-state-and-business-rules.md`;
- DoD: `docs/15-definition-of-done.md`.

## Non-goals

- real payment;
- backend/database;
- authentication;
- CMS;
- delivery API;
- admin panel;
- reviews;
- promo codes.

## Acceptance criteria

- all MVP routes exist;
- 12+ products render from validated data;
- catalog filters/sort work;
- product variant updates price/availability;
- cart persists reload;
- checkout calculates demo delivery and never sends data;
- full flow works at 390 and 1440;
- keyboard can complete critical flow;
- production build and critical Playwright suite pass.

## Milestones

- [x] M0 project scaffold and tokens
- [x] M1 catalog schemas/data/domain tests
- [x] M2 home/catalog/product UI
- [x] M3 cart store + persistence
- [x] M4 demo checkout
- [x] M5 responsive + a11y
- [x] M6 motion/visual polish
- [x] M7 E2E/performance/release pass

## Tests

Unit:
- filter/sort;
- variant selection;
- cart merge/total/storage validation.

E2E:
- add → reload → cart;
- unavailable variant;
- courier checkout;
- pickup checkout;
- mobile menu and filters.

## Risks

- image payload dominates performance;
- visual polish may introduce fragile overlaps on mobile;
- hydration mismatch around localStorage;
- catalog filter state may become duplicated between URL/store.

## Decisions

Use URL as catalog filter state source where practical; use dedicated browser store only for cart.

## Progress notes

2026-10-01: M0 выполнен по `0002-foundation.md`. Созданы Next.js App Router + strict TypeScript, ESLint, CSS-токены, локальные Lora/Manrope, общий layout, базовые маршруты и 404. Настроены npm scripts, lockfile, GitHub Actions и Playwright smoke. Успешны `npm run lint`, `npm run typecheck`, `npm run build` и 6 browser tests на 390/1440. Каталог/корзина/checkout остаются следующими этапами.

## Outcome

2026-10-01: M7 выполнен по `0010-release-pass.md`. Production build/lint/TypeScript, 58 unit, 52 E2E (2 ожидаемых skips), 3 performance сценария успешны. Добавлены Firefox/WebKit smoke, исправлен WebKit touch-выбор списка, уменьшен мобильный payload декора на 77%, подготовлен SEO с SITE_URL и preview noindex. M0–M7 завершены; результаты/ограничения в `docs/release-report.md`. Hosting и домен ещё не выбраны, публикация не выполнялась.

2026-10-01: M6 выполнен по `0009-motion-polish.md`: однократный scroll reveal на home, мягкие photo corners и hover/focus карточек, конечные реакции controls/dialogs. Progressive enhancement/reduced motion/focus/геометрия проверены. Build/lint/typecheck успешны; 19 relevant E2E (1 skip) и 8 final motion E2E после исправления review finding прошли. Далее M7 E2E/performance/release pass.

2026-10-01: M5 выполнен по `0008-responsive-accessibility.md`: адаптивность 9 страниц на 6 ширинах, contrast/AX names/touch targets, keyboard-only product → cart → checkout и reduced motion. Исправлена потеря focus на границе native modal Tab sequence; обе границы Tab/Shift+Tab проверены. Build/lint/typecheck и 12 relevant E2E успешны (2 ожидаемых skips); краткое независимое ревью без существенных замечаний. Далее M6 motion/visual polish.

2026-10-01: M1 выполнен по `0003-catalog-domain.md`: 14 товаров, 3 коллекции, Zod-валидация при импорте, pure selectors/filters/sort/money, базовые страницы с metadata и static params. Проверки: 26 unit tests, 10 browser tests, lint/typecheck/build — успешно. Изображения временные, полноценные UI-controls остаются в M2.

2026-10-01: M2 выполнен по `0004-storefront-ui.md`: редакционная главная, 15 AI-изображений WebP, URL-controls каталога, mobile dialogs, галерея и варианты. Проверки: 28 unit tests, 15 browser tests (1 desktop skip мобильного сценария), lint/typecheck/build; независимый review без P0/P1. Рабочая корзина — M3.

2026-10-01: M3 выполнен по `0005-cart.md`: cart domain/storage/browser store, product add/live feedback, header count и адаптивная корзина с quantity/remove/subtotal. Persistence `season-cart:v1` валидируется, цены/контакты не сохраняются; corrupt/stale/blocked storage и синхронизация вкладок проверены. Успешны lint/typecheck/build, 36 unit и 13 relevant browser tests (1 skip мобильного dialog на desktop); keyboard/console/overflow 390/1440 и screenshots. Независимое ревью без P0/P1. Checkout-форма — M4.

2026-10-01: M4 выполнен по `0006-demo-checkout.md`: demo courier/pickup, будущие даты/интервалы, ephemeral поля и валидация, актуальный итог, local success и явная очистка корзины. PII не сохраняются/не отправляются/не показываются в success. Проверки: build/typecheck/lint, 50 unit tests, 14 relevant cart/checkout E2E на 390/1440; keyboard/focus/privacy/console/overflow и screenshots; независимый review без P0/P1. Далее M5 responsive + a11y.
