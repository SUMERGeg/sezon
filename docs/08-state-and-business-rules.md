# 08. State & business rules

## Cart identity

Уникальная строка корзины определяется как:

`productId + variantId + greetingCard`

Если эти поля совпадают — quantity увеличивается. Иначе создаётся новая строка.

## Quantity

- minimum 1;
- maximum в demo может быть `min(9, demoStock)`;
- кнопка decrement при 1 не переводит в 0;
- удаление — отдельное действие;
- если stock стал меньше persisted quantity после reload, quantity clamp до допустимого значения и показать мягкое уведомление.

## Pricing

Line total:
`currentVariant.price * quantity`

Cart subtotal:
`sum(lineTotals)`

Checkout total:
`subtotal + selectedDelivery.price`

Все значения берутся из текущих данных каталога.

## Variant selection

- selected variant обязан существовать;
- unavailable variant виден;
- add-to-cart disabled when `demoStock <= 0`;
- изменение size/palette может менять цену;
- UI не должен использовать цвет swatch без текстового имени.

## Filters

Фильтры разных групп комбинируются через AND.
Значения внутри одной multi-select группы — OR.

Пример:
`category=author AND occasion=(birthday OR date) AND palette=light`

Sort применяется после filter.

## URL state

Рекомендуется отражать catalog filters в query params:
`/shop?occasion=birthday&palette=light&sort=price-asc`

Требования:
- unknown params игнорируются;
- URL остаётся shareable;
- clear-all очищает только catalog params, не ломая route.

## Local storage

Key with version:
`season-cart:v1`

На read:
1. parse safely;
2. validate shape;
3. remove unknown products/variants;
4. clamp quantity;
5. hydrate current prices/content.

На schema change — bump version. Миграция optional; для concept можно очистить incompatible old state.

## Greeting card

Boolean option may be persisted in cart. Actual text is entered in checkout and never persisted.

## Checkout

Checkout cannot complete when:
- cart empty;
- required delivery/date/slot missing;
- contact validation failed;
- courier selected without address.

Completion result is local UI state only. No network request.

## Dates

Because this is demo:
- generate a small rolling set of future dates client-side or from deterministic helper;
- exclude past dates;
- never imply real florist availability;
- label delivery schedule as example in checkout.

## Seasonal substitution

No exact substitution engine in MVP. It is product copy/business disclosure, not a variant calculation.

## Cart after demo completion

Recommended: clear cart only after the user explicitly completes demo checkout. If they navigate away before completion, keep cart.

## Notifications

Use non-blocking live region/toast for add-to-cart. Do not steal focus unless an error requires intervention.
