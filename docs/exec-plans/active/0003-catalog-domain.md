# ExecPlan 0003 — M1: каталог и бизнес-логика

## Goal
Подключить 14 демонстрационных товаров и 3 коллекции к базовым страницам. Проверять целостность каталога и предоставить чистые функции фильтрации, сортировки, выбора варианта и форматирования денег.

## Context
Спецификация: `docs/07-data-model.md`, `docs/08-state-and-business-rules.md`, `docs/14-content-seed-catalog.md`. Этап M1 общего плана `0001-storefront-mvp.md`; пользователь разрешил переход к следующему этапу после M0.

## Non-goals
Финальные фотографии/галерея, интерактивные фильтры и селекторы (M2), корзина, checkout, backend, оплата. Не добавлять неподтверждённые коммерческие сведения.

## Architecture / interfaces
- `src/data/schemas.ts`: Zod-схемы товара/варианта/коллекции/каталога; `catalogSchema.parse` проверяет числовые поля, уникальность IDs/slugs и двусторонние ссылки.
- `src/data/products.ts`, `collections.ts`, `catalog.ts`: seed-данные, единая валидация при импорте в build/dev.
- `src/domain/catalog/`: типы фильтров, AND между группами/OR внутри группы, сортировка по минимальной цене вариантов, lookup товара/коллекции/варианта. Входы не мутируются.
- `src/lib/money.ts`: RUB из integer minor units через Intl.
- `/shop`, `/shop/[slug]`, `/collections/[slug]`: Server Components; статические динамические страницы через generateStaticParams, metadata и 404. Query params каталога нормализуются, неизвестные значения игнорируются; полноценные controls отложены до M2.

## Acceptance criteria
- Все seed-товары/коллекции проходят схему; повреждённые данные и ссылки отвергаются.
- Младший доступный в ассортименте размер использует базовую цену seed; для S/M/L — S base, M +1400, L +3200; для M/L — M base, L +1800. Цены хранятся в копейках.
- Фильтры категория/повод/гамма/цена/наличие и сортировки recommended/price-asc/price-desc/newest корректны и стабильны.
- Unavailable-вариант остаётся в данных; lookup никогда не подменяет неизвестный variantId.
- Из каталога можно открыть товар и коллекцию; unknown slug даёт 404; валютные суммы и demo-статус видны.
- Unit tests, typecheck/lint, build и целевой browser smoke проходят.

## Data/state impact
Новые статические модели; browser store/persistence отсутствует. По одному локальному placeholder-изображению на товар, честно обозначенному как подготовка фото; полный набор фото — следующий UI/visual этап.

## UI/accessibility impact
Базовая сетка текстовых карточек, semantic links/list, таблица размеров, meaningful headings, focus и responsive на 390/1440. Нет quick-add/платежных полей и ложных real-stock обещаний.

## Steps / Progress
- [x] Установить Zod и Vitest; написать domain/schema тесты и увидеть red.
- [x] Реализовать модели, seed и чистые функции; добиться green.
- [x] Подключить данные к маршрутам и добавить browser smoke.
- [x] Проверить relevant suite, lint/typecheck/build, 390/1440; обновить README и M1.

## Tests
Unit: повреждённый каталог/ссылки/цены/stock, AND/OR/price/availability, все сортировки, отсутствие мутаций, variant lookup, money. Browser: 14 товаров, переход товар/коллекция клавиатурой, данные вариантов, query/empty state и 404; overflow/console на 390/1440.

## Risks / Decisions
- Placeholder не изображает реальный букет; он используется только до финальных фото.
- Новизна — обратный seed-порядок, без выдуманных дат поступления.
- Наличие фильтруется по подходящим вариантам: гамма, цена и stock должны выполняться одним вариантом.
- Работа в текущем checkout; изменения ограничены M1.

## Outcome
2026-10-01: M1 реализован. Seed (14 товаров, 3 коллекции) проходит Zod-схему, включая уникальность и двусторонние ссылки. Деньги — целые копейки. Чистые функции покрывают фильтры, сортировку, нормализацию URL и варианты. Товар/коллекция используют generateStaticParams и metadata, неизвестные slugs дают HTTP 404.

Проверки: `npm test` — 26 passed; `npm run lint`, `npm run typecheck`, `npm run build` — exit 0; `npm run test:e2e` — 10 passed на 390/1440. Просмотрены screenshots каталога и товара; нет page overflow. Browser console errors на каталоге/товаре/коллекции отсутствуют; переходы клавиатурой, unavailable M, цены, query и empty state проверены. `npm ci --dry-run --ignore-scripts` прошёл. Первоначальный unit run подтвердил отсутствие модулей до реализации; последующий — green.

Playwright запускает production на отдельном порту 3001, без переиспользования dev-сервера. Финальные фотографии и интерактивные controls сознательно отложены в M2; корзина/checkout не менялись. Нерешённых существенных проблем M1 нет.
