# 17. Decision log

Коротко фиксируй решения, которые сложно вывести из кода.

## D001 — Concept store, no backend
**Status:** accepted

MVP использует static data + browser state. Реальные заказы, оплаты и база данных не нужны, потому что цель — портфолио-демонстрация UX и frontend execution.

## D002 — Server Components by default
**Status:** accepted

Контентные страницы и товарные данные рендерятся на сервере/статически. Client boundary вводится только для interaction state.

## D003 — Persist cart references only
**Status:** accepted

В localStorage хранятся IDs/quantity/options. Цена и контент гидратируются из текущего каталога; PII checkout не хранится.

## D004 — No quick add from catalog
**Status:** accepted

У товара есть варианты размера/гаммы, поэтому выбор происходит на product detail. Это уменьшает ошибочные позиции корзины и сохраняет чистую карточку.

## D005 — Editorial home, systematic commerce pages
**Status:** accepted

Главная может быть асимметричной и журнальной. Каталог/товар/cart/checkout — более регулярные, чтобы эстетика не снижала понятность.

## D006 — No fake social proof
**Status:** accepted

Доверие создаётся через ясность продукта, фото, UX и implementation quality, а не вымышленными отзывами/метриками.

## D007 — Foundation dependencies and fonts
**Status:** accepted

M0 использует Next.js 16.3.8 + React 19.3.0, TypeScript 5.9.3 и npm lockfile. Next.js/ESLint настроены по [официальной инструкции установки](https://nextjs.org/docs/app/getting-started/installation) и [документации ESLint](https://nextjs.org/docs/app/api-reference/config/eslint); версии проверены в npm registry при реализации.

CSS variables реализуют исходные дизайн-токены без дополнительной styling-библиотеки. Variable-шрифты Lora/Manrope поставляются локально через Fontsource, включая кириллицу; production build не обращается к Google Fonts. Playwright нужен для smoke-проверки маршрутов, клавиатуры и responsive-каркаса. Zod, store и Motion откладываются до этапов, где используются.

## Template

### DXXX — Title
**Status:** proposed/accepted/superseded

Context:

Decision:

Consequences:
