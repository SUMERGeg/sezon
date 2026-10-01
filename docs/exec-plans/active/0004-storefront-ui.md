# ExecPlan 0004 — M2: интерфейс магазина

## Goal / Context
Реализовать интерфейс выбора букета: редакционная главная, фотокарточки, интерактивный каталог, галерея и выбор размера. Пользователь разрешил этап 3 после M0/M1. Источники: `docs/04-design-system.md`, `docs/05-ui-specs.md`, `docs/08-state-and-business-rules.md`.

## Non-goals
Рабочая корзина/persistence (M3), checkout (M4), оплата/backend. CTA товара честно объясняет, что demo-корзина пока не подключена; не имитировать успешное добавление.

## Architecture / Data-state impact
Server Components сохраняют контент, metadata и seed selection. Client islands: mobile menu, catalog controls, product options/gallery. Единственный источник фильтров — URL; `history.pushState` обновляет query без document reload, back/forward восстанавливают выбор. Pure functions M1 переиспользуются. Native dialog обеспечивает modal focus/Escape; закрытие возвращает focus к trigger. Значения поля цены — целые рубли, domain — копейки. UI state товара не персистится.

## Acceptance criteria
- Главная содержит hero, 4 избранных товара, 3 коллекции, сезонную историю/практические блоки/CTA и footer demo disclosure.
- Каталог: категории/поводы/гаммы/диапазон цены/наличие, sort, selected count/chips, отдельное удаление и clear-all; неизвестные и несвязанные query не мешают, clear сохраняет чужие params.
- Mobile menu/filter dialog: 44px targets, keyboard entry/trap/Escape/return; navigation закрывает меню.
- Товар: radio-выбор размера меняет цену и доступность, unavailable остаётся видимым/выбираемым с объяснением; открытка как ephemeral option; gallery controls не требуют swipe/hover.
- Изображения локальные, имеют размеры/responsive sizes; только hero LCP preload; нет выдуманных коммерческих обещаний. AI-иллюстрации обозначены как концептуальные.
- Relevant unit/E2E, lint/typecheck/build проходят; keyboard, 390/1440, reduced motion/overflow/console проверены.

## Steps / Progress
- [x] Подготовить иллюстративные фото и browser tests для новых interactions (red).
- [x] Реализовать menu/dialog, URL-controls, gallery/options и страницы.
- [x] Интегрировать фото, адаптив и accessibility states.
- [x] Проверить сборку/тесты, screenshots и независимый read-only review; обновить M2/README.

## Tests
Unit: сохранить M1 suite, URL write/remove/clear сохраняют unrelated params. E2E: фильтры/chips/sort/back без reload; menu/filter Escape/focus; unavailable размер/цена; gallery controls; семантика и overflow на 390/1440. Используется отдельный production-порт 3001.

## Risks / Decisions
Фото-ассеты могут потребовать длительной генерации. Motion ограничен CSS; modal поведение нативное, без новой UI-библиотеки. Demo-cart disabled до M3 — согласованный границей этапа честный placeholder, не fake success.

## Outcome
2026-10-01: M2 готов. 15 WebP созданы встроенным imagegen, точные промпты/пути в `docs/image-prompts.md`. Галерея честно обозначает фото как иллюстрации; detail — увеличение основного снимка, context — настроение коллекции. Успешны lint, typecheck, production build, 28 unit tests и 15 browser tests (1 skip: мобильный dialog на desktop). Проверены keyboard, 390/1440, console/overflow и screenshots. Независимое read-only ревью не нашло P0/P1. CTA подключения корзины остаётся границей M3.
