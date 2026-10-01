# ExecPlan 0009 — M6 визуальная доводка и motion

## Goal / Context
Сохранить пастельный цветочный стиль и добавить сдержанные конечные реакции. Главная: однократное появление нижних секций при прокрутке. Карточки: обрезанный по мягкому радиусу кадр, небольшой zoom и подчёркивание названия на hover/focus. Controls: короткие реакции и появление popup/dialog.

## State / UI / Non-goals
Без новых библиотек, изменений бизнес-логики/storage/форм. Server content остаётся видимым без JavaScript; небольшой client observer подключается только на главной и отмечает лишь секции ниже viewport. Нет постоянного движения/scroll-jacking. Keyboard focus сразу показывает секцию. Reduced motion выключает эффекты, включая переключение настройки во время просмотра.

## Steps / Acceptance
- [x] Реализовать observer/CSS и подключить home/card UI.
- [x] Проверить once-only reveal, no-JS/reduced-motion/focus, отсутствие overflow/изменения размеров; 390/1440 визуальная проверка.
- [x] Build/lint/typecheck и relevant E2E; краткое read-only review, отметить M6.

## Risks / Decisions
Не анимировать hero/LCP и не скрывать контент до гидрации. Использовать IntersectionObserver, не scroll listener; сразу disconnect при reduced motion. Transform/opacity не меняют размеры сетки. Commerce forms/summary не участвуют в scroll reveal.

## Outcome
2026-10-01: M6 выполнен. HomeMotion отмечает только нижние секции; 480ms/12px finite reveal, hero статичен. Карточки имеют media wrapper с мягким радиусом, clipped zoom 1.015 и подчёркивание названия; кнопки, popup/dialog получили короткие реакции. Состояние focus permanently clears reveal; observer игнорирует уже снятое pending, в том числе queued callbacks. Без JS/IntersectionObserver и при reduced motion контент видим; переключение настройки отключает observer. Print показывает все секции.

Build/lint/typecheck успешны. 19 relevant E2E прошли (1 ожидаемый skip): страницы, responsive/AX/contrast, полный keyboard flow, modal/reduced motion и новые motion сценарии. После read-only review исправлен подтверждённый P2: focus-within/blur мог повторно запускать entrance animation. Regression сначала упал, затем все 8 final motion tests прошли на 390/1440. Скриншоты catalog focus и final home просмотрены на обоих размерах. Reveal/hover не меняют размеры блоков, page overflow отсутствует. Бизнес-логика и demo-ограничения неизменны. Web Vitals/performance release pass остаётся M7.
