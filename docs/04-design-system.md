# 04. Design system

## 1. Visual thesis

**Предметный журнал о цветах, внутри которого работает понятный магазин.**

Главная страница — более редакционная и эмоциональная. Каталог, товар и checkout — системные, спокойные, предсказуемые.

## 2. Palette

Актуальные токены после запроса пользователя от 2026-10-01: пастельные зелёные и розовые акценты, более нежная подача.

```text
--bg:            #FAF9F5   // светлый молочный
--surface:       #EDF2E8   // мягкий шалфейный
--surface-2:     #DCE6D5
--ink:           #35483C   // читаемый ботанический зелёный
--muted:         #637166
--line:          #D4DFD1
--pine:          #49634F   // структурный зелёный
--petal:         #CFA7B4   // пудровый акцент
--wine:          #845568   // контрастный розовый для текста/focus
--white:         #FFFDFB
--sage-soft:     #E6EFE2
--sage-accent:   #D5E5CE   // основные кнопки, тёмный текст
--sage-line:     #B8CCB1
--rose-soft:     #F3E7EB
--rose-line:     #DDC6CE
--danger:        #A33A35
--success:       #356244
```

Акцентные цвета не использовать для длинного текста.

Декор после уточнения пользователя: заметные свободно растущие побеги, разные виды цветочных линий вдоль краёв и между секциями. Не использовать одинаковые угловые рамки. Ветви могут выходить за границы цветного блока; текст и controls остаются свободными. На mobile пересобирать размеры. Три оригинальных assets/prompts: `docs/botanical-growth.md`; реализация: `src/app/pastel.css`.

## 3. Typography

Две роли:

**Display serif**
- hero/headlines;
- collection titles;
- editorial quotes.

**Neutral sans-serif**
- navigation;
- product names/prices;
- filters;
- controls;
- forms;
- utility text.

Требования:
- качественная кириллица;
- не более 2 гарнитур;
- 2–3 веса на семейство максимум;
- display не превращать в декоративную каллиграфию.

Пример type scale desktop:
- Display XL: clamp(56px, 7vw, 112px), line-height 0.92–1.0;
- H1: 56–72;
- H2: 40–52;
- H3: 28–36;
- Body L: 18–20;
- Body: 16–18;
- UI: 14–16;
- Caption: 12–14.

На 390px не уменьшать mechanically — пересобрать line breaks.

## 4. Grid

Desktop 1440:
- content max-width ≈ 1280;
- outer gutters 48–64;
- 12-column logical grid;
- product grid 3 columns, иногда 4 только если фото/названия не страдают.

Tablet 768–1024:
- 8 columns;
- product grid 2–3.

Mobile 390:
- 4 columns;
- product grid 2 columns при достаточной читаемости, иначе 1;
- outer gutters 16–20.

## 5. Spacing

Базовый ритм 4/8 px, но editorial sections используют крупные интервалы.

Token suggestion:
`4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.

## 6. Radius

- cards/images: 0–12 px;
- controls: 8–12 px;
- buttons: 10–14 px;
- chips: не делать всё pill-shaped; фильтр chips допустимы только как компактные статусы выбора.

## 7. Photography

Нужны типы:
1. hero/editorial — букет или группа цветов в контексте;
2. catalog — чистый продукт, единый свет;
3. detail — фактура лепестков, стеблей, упаковки;
4. scale — букет в руках/на столе;
5. process — руки флориста без вымышленной биографии;
6. packaging — как выглядит передача/перевозка.

Фото одной коллекции должны совпадать по свету и color grading.

## 8. Product card

Не делать тяжёлую карточку-контейнер.

Состав:
- image;
- collection/category optional eyebrow;
- name;
- price from;
- available palettes/size hint optional;
- availability only when materially useful.

Hover:
- secondary image or subtle crop shift;
- name/arrow state;
- не использовать 3D tilt на каталоге.

## 9. Buttons

Primary:
- pine background / light text;
- clear hover/focus/disabled.

Secondary:
- transparent + border or text action.

Danger destructive только для remove confirmation при необходимости.

## 10. Motion

Allowed:
- fade/translate 8–20 px on enter;
- image crossfade;
- subtle scale 1.01–1.03;
- drawer/menu transitions;
- cart count micro-feedback.

Avoid:
- endless floating petals;
- cursor particles;
- heavy parallax;
- scroll-jacking;
- auto-playing hero carousel;
- bounce.

Reduced motion: remove transform-based decorative motion and keep state change instant/crossfade minimal.

M6 implementation: home sections below the initial viewport enter once with a 12px/480ms fade-translate; hero remains static. The client observer is confined to home and the server markup stays visible without JavaScript. Focus permanently clears entrance animation, preventing a restart on blur. Cards use a clipped 1.015 image zoom plus title underline; popup/dialog entrances take 160/220ms. Reduced motion disables these effects, and changing the preference reveals all sections immediately. Styles: `src/app/motion.css`; observer: `src/components/ui/home-motion.tsx`.

## 11. Focus and states

Focus ring must be visually strong on all backgrounds. Color alone is never the only signal for selected/unavailable/error.
