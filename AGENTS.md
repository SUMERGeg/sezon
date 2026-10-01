# AGENTS.md — «СЕЗОН»

Этот файл — карта проекта, а не энциклопедия. Читай только документы, относящиеся к текущей задаче.

## Product contract

Это концептуальный интернет-магазин цветов для портфолио. Он должен выглядеть как реальный коммерческий продукт, но не должен притворяться реально работающим магазином.

Нельзя:
- принимать оплату;
- создавать или отправлять реальные заказы;
- сохранять контактные данные checkout между посещениями;
- придумывать отзывы, награды, количество клиентов, «осталось 2 букета» без данных;
- использовать фальшивые старые цены и искусственный дефицит;
- скрывать demo-статус checkout.

Можно:
- хранить корзину локально в браузере;
- использовать статический каталог и демонстрационные цены/остатки;
- показывать realistic UI состояния и validation;
- проектировать интерфейс так, будто он готов к подключению реального backend позже.

## Source of truth

- Product: `docs/00-product-brief.md`
- Copy/brand: `docs/01-brand-and-content.md`
- IA: `docs/02-information-architecture.md`
- User flows: `docs/03-user-flows.md`
- Design: `docs/04-design-system.md`, `docs/05-ui-specs.md`
- Architecture: `docs/06-technical-architecture.md`
- Data: `docs/07-data-model.md`
- Business rules: `docs/08-state-and-business-rules.md`
- Testing: `docs/10-testing-qa.md`
- Accessibility: `docs/11-accessibility.md`
- Performance/SEO: `docs/12-performance-seo.md`
- Security/privacy: `docs/13-security-privacy.md`
- Seed catalog: `docs/14-content-seed-catalog.md`
- Done: `docs/15-definition-of-done.md`
- Codex orchestration: `docs/16-codex-workflow.md`

## Architecture rules

1. Server Components по умолчанию. Client Components только там, где есть browser state/interaction.
2. Данные каталога отделены от UI и проходят schema validation.
3. Корзина хранит только `productId`, `variantId`, `quantity` и безопасные товарные опции. Контакты и адрес не персистятся.
4. Бизнес-правила не дублировать по компонентам: вынести в pure functions/selectors.
5. UI-компоненты не должны напрямую знать формат localStorage.
6. Интерактивы должны работать с клавиатуры и respect `prefers-reduced-motion`.
7. Не тащить библиотеку ради одного тривиального компонента.
8. Не оптимизировать абстракции раньше, чем появится повторяющийся паттерн.

## Visual rules

Визуальная цель: «редакционный цветочный бренд + понятный магазин».

- светлая, тёплая база;
- глубокий зелёный как структурный цвет;
- винно-ягодный/лепестковый акцент дозированно;
- выразительная serif для display + нейтральный sans для интерфейса;
- крупная флористическая фотография;
- сетка каталога регулярная, главная более редакционная;
- мягкая геометрия без SaaS/pill/glassmorphism;
- motion сдержанный, органичный, не постоянный.

## ExecPlans

Для новой страницы, нового крупного flow, изменения data model, state model или архитектуры используй ExecPlan по `.agent/PLANS.md`. Для локального исправления текста/стиля план не нужен.

## Before finishing any task

Проверь минимум:
- TypeScript/lint;
- целевой тест или relevant test suite;
- клавиатурный сценарий затронутого интерактива;
- mobile 390 и desktop 1440 для UI-изменений;
- отсутствие console errors;
- отсутствие новых layout shifts/overflow;
- demo-ограничения не нарушены.

## Multi-agent

Для независимых исследований/ревью можно делегировать субагентам. Не поручай двум агентам одновременно менять одни и те же файлы. Ролевые спецификации лежат в `.codex/agents/`.

