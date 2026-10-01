# 02. Information architecture

## Sitemap

```text
/
├── /shop
│   └── /shop/[slug]
├── /collections/[slug]
├── /about
├── /delivery-care
├── /cart
└── /checkout
```

## Global navigation

Desktop:
- Букеты
- Коллекции
- О мастерской
- Доставка и уход
- Корзина (count)

Mobile:
- logo/name;
- cart icon/count;
- menu button;
- раскрываемая навигация с теми же пунктами.

## Home `/`

1. Header.
2. Hero: текст + крупная фотокомпозиция/букет.
3. Избранные букеты: 4 товара.
4. Коллекции/настроения: 3 editorial cards.
5. «Собрано по сезону»: объяснение сезонности и подхода.
6. Большая история одного букета/коллекции.
7. Практический блок: доставка, упаковка, уход.
8. About teaser.
9. CTA к каталогу.
10. Footer + concept disclosure.

## Catalog `/shop`

Desktop:
- title + results count;
- controls row;
- sidebar/drawer filters depending on width;
- product grid;
- empty state.

Фильтры:
- тип;
- повод;
- гамма;
- цена;
- наличие demo-варианта.

Сортировка:
- рекомендуемые;
- цена ↑;
- цена ↓;
- новинки коллекции (демонстрационный порядок, не реальная дата).

## Product `/shop/[slug]`

1. Breadcrumbs.
2. Gallery.
3. Product summary.
4. Size selection.
5. Palette selection if applicable.
6. Price/availability.
7. Optional card toggle.
8. Add to cart.
9. Seasonal substitution note.
10. Delivery teaser.
11. Characteristics.
12. Related products.

## Collection `/collections/[slug]`

Editorial intro + 4–8 related products. Не дублировать весь каталог.

## Cart `/cart`

- line items;
- selected variant;
- quantity;
- optional greeting card indicator;
- remove;
- subtotal;
- demo delivery note;
- CTA checkout.

## Checkout `/checkout`

Порядок:
1. Demo disclosure.
2. Delivery method.
3. Date.
4. Time slot.
5. Recipient/contact fields.
6. Delivery address when needed.
7. Greeting card text when selected.
8. Order summary.
9. Final total.
10. «Завершить демонстрацию».

Платёжных полей нет.

## Footer

- Букеты;
- Коллекции;
- О мастерской;
- Доставка и уход;
- concept status;
- portfolio/copyright metadata if needed.
