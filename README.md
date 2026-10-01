# «СЕЗОН» — development pack для концептуального цветочного магазина

## Запуск приложения

Реализован storefront MVP: Next.js App Router + strict TypeScript, локальные шрифты Lora/Manrope, валидированный каталог (14 товаров, 3 коллекции), редакционная главная и 15 локальных AI-иллюстраций. Работают URL-фильтры, сортировка, мобильное меню, галерея, выбор размера/открытки и корзина: добавление, объединение позиций, количество, удаление и итоги. Выбор сохраняется в браузере и синхронизируется между вкладками; недоступный storage оставляет рабочую корзину в памяти. Реализован demo-checkout: получение, даты/интервалы, тестовые контакты, проверка полей и локальное завершение. Бизнес-правила вынесены в чистые функции. Неизвестные slugs возвращают 404. Промпты и пути изображений: `docs/image-prompts.md`.

Пастельные зелёно-розовые акценты, разные ботанические орнаменты, кастомные списки и однократный motion учитывают keyboard/reduced motion. Декор использует Next image optimizer через responsive CSS image-set; первому фото каталога и основному фото товара назначена приоритетная загрузка. Проверки релиза и ограничения: `docs/release-report.md`.

Требуется Node.js >=20.9.0 (для разработки/CI используется Node.js 22) и npm.

```sh
npm ci
npm run dev
```

Открыть `http://localhost:3000`.

Проверка и production-запуск:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Browser smoke (после сборки; Playwright сам запускает production-сервер):

```sh
npx playwright install chromium firefox webkit
npm run test:e2e
```

Unit tests проверяют схемы, ссылки каталога, фильтры AND/OR, цены/наличие, сортировку, варианты, деньги, правила корзины, даты/интервалы, checkout validation и deployment metadata. Chromium проходит полный набор на 390/1440; Firefox и WebKit mobile — отдельный release smoke, включая tap кастомных списков в WebKit. Проверяются keyboard flow, responsive 320/390/720/768/1024/1440, reduced motion/no-JS, console errors, storage recovery/sync и отсутствие отправки/сохранения PII. Тестовый production-сервер использует порт 3001, отдельно от dev-сервера на 3000. В CI выполняются те же функциональные проверки. Production-сборка не требует Google Fonts или секретов.

Локальный performance pass (после сборки, отдельно от E2E):

```sh
npm run test:perf
```

Он измеряет home/catalog/product на Chromium 390px/DPR2, CPU×4, 1.6Mbps/150ms с холодным browser cache. JSON-результаты — в attachments `test-results/`; LCP/CLS и sample interaction latency являются lab evidence, не полевыми Web Vitals. Performance suite не входит в обычный CI.

## Публикация

### GitHub Pages — бесплатно для публичного репозитория

Подготовлен репозиторий `https://github.com/SUMERGeg/sezon`. Стандартный адрес публикации: `https://sumergeg.github.io/sezon/`.

1. В репозитории открыть **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Отправить исходники в ветку `main` (или `master`). Workflow `Publish GitHub Pages` соберёт проект, проверит статический сайт и опубликует его. Повторный запуск доступен через **Actions → Publish GitHub Pages → Run workflow**.
3. Дождаться успешного deploy в Actions. После настройки следующие push автоматически обновляют сайт.

Workflow получает origin и basePath из настроек Pages, поэтому поддерживает также корневой адрес `username.github.io` или настроенный в Pages собственный домен. Покупать домен не требуется. GitHub Pages предназначен здесь для портфолио-демо, реальные заказы/оплата не подключены.

Локальная проверка той же сборки в PowerShell:

```powershell
$env:PAGES_BASE_PATH = '/sezon'
$env:SITE_URL = 'https://sumergeg.github.io'
npm run build:pages
npm run test:pages
npm run preview:pages
```

Открыть `http://127.0.0.1:3002/sezon/`. Для публикации в корне задать пустой `PAGES_BASE_PATH`. `SITE_URL` всегда содержит только origin, путь репозитория задаётся отдельно.

`build:pages` заранее генерирует адаптивные WebP через Sharp и экспортирует HTML/CSS/JS в `out/`. Изображения и декор работают без Node-сервера и `/_next/image`; generated файлы игнорируются Git и заново создаются в CI. Фото, фильтры, галерея, localStorage-корзина и demo-checkout сохранены. `npm start` не обслуживает static export — для него используется `preview:pages` или Pages.

### Обычный Node.js hosting

`npm run dev`, `npm run build` и `npm start` сохраняют обычный Next.js режим с runtime image optimizer. Для него нужен hosting с Node.js/Next.js. Перед `npm run build` задайте публичный HTTP(S) origin в `SITE_URL` через `.env.local` или настройки hosting; пример — `.env.example`. Используйте то же значение при запуске.

В обоих режимах canonical/OG URLs и sitemap строятся из `SITE_URL` с учётом пути публикации; фильтры канонизируются на каталог, cart/checkout не индексируются и не входят в sitemap. Без `SITE_URL` действует preview с noindex и пустым sitemap. Из текущей локальной сессии сайт не опубликован.

Исходники: `src/app/` — маршруты и токены, `src/components/` — UI, `src/data/catalog.ts` — единственная точка входа валидированного каталога, `src/domain/catalog/` и `src/domain/cart/` — бизнес-логика, `src/store/cart-store.ts` — browser state, `src/lib/cart-storage.ts` — безопасный storage, `src/lib/money.ts` — валюта. Документы ниже остаются спецификацией дальнейшей разработки.

Корзина использует `season-cart:v1`, envelope `{version: 1, items}`. Сохраняются только `productId`, `variantId`, `quantity`, `greetingCard`; цены и контент берутся из текущего каталога. Контакты/адрес/текст открытки не сохраняются. Старые или повреждённые строки удаляются, количество корректируется с уведомлением. Реальные заказы и оплата отсутствуют.

Checkout `/checkout` доступен при непустой корзине. Доставка 500 ₽ и самовывоз 0 ₽ — demo-тарифы; 7 будущих локальных дат и интервалы — примеры расписания. Контакты/адрес/текст открытки/комментарий существуют только в текущей форме. «Завершить демонстрацию» проверяет данные, очищает форму и корзину, показывает неперсональный итог; network submission и payment fields отсутствуют. Уход до завершения сохраняет только корзину. После reload успех не восстанавливается.

Интерактивные фильтры каталога используют URL-параметры, например `/shop?occasion=birthday&palette=light&sort=price-asc`. Для категорий: `author`, `mono`, `arrangement`, `seasonal`; для сортировки: `recommended`, `price-asc`, `price-desc`, `newest`. Повторяемые `category`, `occasion`, `palette` задают OR внутри группы. `minPrice`/`maxPrice` — целые рубли, `available=true` исключает недоступные подходящие варианты. Незнакомые значения игнорируются. «Новинки» — обратный seed-порядок, без реальных дат поступления.

Этот архив — рабочий контекст для проектирования и разработки портфолио-проекта: современного интернет-магазина цветов «СЕЗОН». Он собран так, чтобы новый разработчик или Codex мог быстро понять продукт, визуальное направление, бизнес-правила, архитектуру и критерии качества без повторного разбора исходного брифа.

## Что строим

«СЕЗОН» — небольшой русскоязычный магазин букетов и цветочных композиций с редакционной подачей, сильной предметной фотографией и понятным сценарием покупки. Это концептуальный проект для портфолио: реальная оплата, реальные заказы и неподтверждённые коммерческие обещания отсутствуют.

Основной пользовательский сценарий:

`главная → каталог → карточка букета → размер/гамма/опции → корзина → демонстрационное оформление`

Ключевые особенности предметной области:
- букеты, монобукеты и композиции вместо керамики;
- фильтры по типу, поводу, гамме, цене и наличию;
- варианты размера S/M/L и сезонные составы;
- открытка и подпись к букету как опциональные поля;
- дата и интервал доставки в demo-checkout;
- честное объяснение сезонных замен цветов;
- отсутствие фиктивных отзывов, таймеров дефицита и «реальных» заказов.

## Рекомендуемый стек

- Next.js App Router + TypeScript;
- Tailwind CSS 4 или эквивалентная токенизированная CSS-система;
- Motion for React — только для ограниченного интерфейсного движения;
- Zod для схем данных и валидации;
- Zustand или небольшой локальный store для корзины;
- Vitest + Testing Library для unit/component tests;
- Playwright для end-to-end, accessibility smoke и visual regression.

Версии зависимостей фиксируются при старте разработки в `package.json`; не хардкодить версии из этого документа.

## Как читать архив

1. Начать с `AGENTS.md` — это карта репозитория и правила для Codex.
2. Для продукта: `docs/00-product-brief.md`.
3. Для UX: `docs/02-information-architecture.md` и `docs/03-user-flows.md`.
4. Для дизайна: `docs/04-design-system.md` и `docs/05-ui-specs.md`.
5. Для реализации: `docs/06-technical-architecture.md`, `docs/07-data-model.md`, `docs/08-state-and-business-rules.md`.
6. Для выполнения: `docs/09-implementation-plan.md` и `docs/exec-plans/active/0001-storefront-mvp.md`.
7. Для качества: `docs/10-testing-qa.md` — `docs/13-security-privacy.md`.
8. Для работы с Codex: `docs/16-codex-workflow.md`, `.codex/skills/`, `.codex/agents/`.

## Главный критерий

Сайт должен одновременно быть:
- коммерчески понятным;
- визуально сильным;
- аккуратно реализованным;
- доступным;
- быстрым;
- честным как концептуальный проект.

Если эффект не помогает понять товар, выбрать букет, доверять интерфейсу или совершить действие — его следует убрать.
