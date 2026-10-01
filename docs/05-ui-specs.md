# 05. UI specifications

## Header

Desktop:
- sticky optional, only if it does not jump on scroll;
- logo «СЕЗОН» left;
- nav center/right;
- cart count always visible.

Mobile:
- 56–64 px height;
- menu and cart have >=44x44 hit area;
- drawer closes by Escape and after navigation.

## Hero

Desktop:
- two-part editorial composition, not symmetric marketing split;
- headline max 3–4 lines;
- 1 primary CTA + 1 secondary;
- 1–2 large images or one large image + close detail;
- no text overlay on visually noisy petals unless contrast is guaranteed.

Mobile:
- title → copy → CTA → image;
- do not preserve desktop overlap if it hurts reading.

## Product grid

Card states:
- default;
- hover/focus;
- low/demo unavailable variant hint;
- image loading;
- broken/missing image fallback in development.

No quick-add in MVP: variant selection happens on product page. This avoids wrong-size cart items.

## Filters

Desktop: horizontal summary + sidebar or compact panel.
Mobile: «Фильтры» opens drawer.

Required behavior:
- selected count;
- clear all;
- individual removal;
- query state may sync to URL search params for shareable catalog state;
- no full-page reload.

## Product detail

Desktop layout:
- left 7/12 gallery;
- right 5/12 sticky info card/block, sticky only within content boundaries.

Info order:
1. collection eyebrow;
2. H1;
3. short description;
4. price;
5. size selector;
6. palette selector when needed;
7. availability message;
8. add-to-cart;
9. seasonal note;
10. delivery link;
11. details accordion/list.

Selector behavior:
- radio semantics;
- visible labels S/M/L + approximate diameter/height;
- unavailable remains discoverable;
- price changes without layout jump.

## Gallery

Desktop:
- 3–4 images in scroll/grid composition.

Mobile:
- horizontally paged carousel or vertical stack;
- pagination text/dots accessible;
- no mandatory swipe-only controls.

## Cart

Line item:
- thumbnail;
- name;
- size/palette;
- price;
- qty control;
- remove.

Qty control must prevent 0 via decrement; removal is explicit.

Summary:
- subtotal;
- note that delivery calculated in demo checkout;
- primary CTA.

Empty:
- short copy;
- «Перейти к букетам».

## Checkout

Persistent top disclosure:
**Демонстрация магазина. Заказ и оплата не выполняются.**

Fields:
- delivery method;
- date;
- slot;
- recipient name;
- phone/email example (format validation only);
- address when delivery;
- greeting card message if enabled;
- optional comment.

No payment fields.

Final button:
**Завершить демонстрацию**

Success:
- «Демонстрация завершена»;
- summary optional;
- CTA back to catalog/portfolio;
- no fake order number.

## About

Explain concept and design approach, not fake company history. Can include process imagery labelled as conceptual/illustrative when necessary.

## Delivery & care

Sections:
- demo delivery methods;
- seasonal substitutions;
- packaging;
- bouquet care;
- FAQ 4–6 items maximum.

## Error/empty states

Must exist for:
- no catalog results;
- product slug not found;
- invalid persisted cart item;
- unavailable selected variant;
- empty cart;
- invalid checkout field;
- date/slot unavailable in demo data;
- failed client hydration/storage read (degrade safely).
