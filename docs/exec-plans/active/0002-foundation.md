# ExecPlan 0002 — M0: основа приложения

## Goal
Создать запускаемый каркас «СЕЗОН» с Next.js App Router, strict TypeScript, общими шрифтами и дизайн-токенами. Пользователь разрешил реализацию первого этапа; работаем в текущей папке, сохраняя существующие документы.

## Context
- Спецификация: `docs/00-product-brief.md`, `docs/04-design-system.md`, `docs/06-technical-architecture.md`.
- Общий план: `docs/exec-plans/active/0001-storefront-mvp.md`, milestone M0.

## Non-goals
Каталог и схемы данных (M1), финальный интерфейс (M2), корзина, формы checkout, фотографии, backend, платежи и реальные заказы.

## Architecture and dependencies
Server Components для страниц и общего layout. CSS variables вместо дополнительной styling-библиотеки. Локальные variable-шрифты Lora и Manrope с кириллицей из Fontsource. npm и lockfile фиксируют зависимости. Playwright проверяет маршруты и базовую доступность каркаса.

## Acceptance criteria
- `npm run dev`, `npm run build`, `npm start` запускают приложение.
- Strict TypeScript и ESLint проходят; команды описаны в README.
- Есть каркас `/`, `/shop`, `/shop/[slug]`, `/collections/[slug]`, `/cart`, `/checkout`, `/about`, `/delivery-care` и 404.
- До появления каталога произвольные товары/коллекции дают 404; интерфейс не имитирует готовую корзину или оформленный заказ.
- Токены соответствуют дизайн-системе; шрифты загружаются локально.
- Навигация работает клавиатурой; нет overflow и console errors на 390 и 1440.
- Demo-статус виден в footer и на checkout; нет платежных форм или сохранения контактов.

## Data/state impact
На M0 нет каталога, store, localStorage и форм. Динамические маршруты возвращают 404 до M1.

## UI/accessibility impact
Русский язык документа, один H1, semantic landmarks, skip-link, видимый focus, ссылки с доступными размерами, reflow и reduced motion. Страницы содержат честный базовый контент вместо framework-заглушки.

## Implementation steps / Progress
- [x] Настроить package.json, Next.js, TypeScript, ESLint, ignore и CI.
- [x] Добавить токены, локальные шрифты, общий layout и каркас маршрутов.
- [x] Проверить build/typecheck/lint и минимальный browser smoke; обновить README и M0.

## Tests
`npm run lint`, `npm run typecheck`, `npm run build`; Playwright smoke для маршрутов, demo disclosure, 404, клавиатурного перехода и overflow/console на 390 и 1440.

## Risks
Доступ к npm и установка браузера могут требовать выхода из sandbox. Шрифты устанавливаются вместе с зависимостями и не требуют сети при сборке. Не заменять существующую документацию генератором приложения.

## Decisions
- Используем текущую папку: исходники пока отсутствуют, документы ещё не закоммичены.
- M0 ограничен каркасом; seed-каталог и его схемы остаются в M1, несмотря на более широкий пункт Phase 0 в `docs/09-implementation-plan.md`.
- Не устанавливаем store, Zod, Motion или компонентные библиотеки до задач, которым они нужны.
- `agentRules: false` отключает автоматическое дописывание инструкций Next.js в существующий `AGENTS.md` при запуске dev-сервера.

## Outcome
2026-10-01: M0 реализован. Основные файлы: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `src/app/`, `src/components/`, `playwright.config.ts`, `tests/e2e/foundation.spec.ts`, `.github/workflows/ci.yml`, `README.md`.

Проверки: lint (exit 0), typecheck (exit 0), production build (exit 0), Playwright (6 passed). Просмотрены screenshots главной и checkout на 390 и 1440: overflow и очевидных проблем верстки нет. Проверены HTTP 404 для неизвестных страниц/товаров/коллекций, локальная загрузка шрифтов, skip-link и переход к каталогу клавиатурой. Console errors на базовых страницах отсутствуют. Формы, платежи и browser persistence не добавлялись.

Sandbox блокировал дочерний процесс TypeScript (`spawn EPERM`); та же сборка успешно завершилась вне sandbox. Первый browser run выявил только неоднозначный селектор ссылки в тесте 404; после `exact: true` все проверки прошли. Существенных нерешённых проблем M0 нет. M1–M7 не реализованы.
