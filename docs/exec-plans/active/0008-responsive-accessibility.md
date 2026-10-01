# ExecPlan 0008 — M5 адаптивность и доступность

## Goal / Context
Основные страницы и путь товар → корзина → demo checkout доступны на узком экране и с клавиатуры. Источники: docs/11-accessibility.md, текущие CSS/components и E2E.

## Non-goals / State
Не менять каталог, бизнес-правила, storage, дизайн-направление или demo-ограничения. Новые runtime зависимости не нужны. Только подтверждённые проблемы адаптива/доступности.

## Acceptance / UI
Нет обрезанного текста/контролов и горизонтальной прокрутки на 320/390/768/1024/1440. Reflow при эффективной ширине 720 (desktop 1440 при 200%). Основной flow проходит Tab/стрелками/Enter/Space, ошибки связаны с полями и получают focus. Modal удерживает focus и возвращает его после Escape. Критические touch targets ≥44px, reduced motion соблюдается, контролы имеют доступные имена.

## Steps / Tests
- [x] Целевые browser проверки responsive/семантики/контраста; screenshot 390/768/1440.
- [x] Исправить выявленные существенные проблемы, добавить regression assertions.
- [x] Build/lint/typecheck и relevant E2E; краткое read-only review.

## Risks / Decisions
Декоративный overflow: clip может скрывать ошибки сетки, поэтому проверять границы текста/контролов, а не только scrollWidth. Увеличение проверять через эффективный CSS viewport, как при browser zoom. AX tree spot-check — автоматическая проверка семантики, не ручное тестирование экранным диктором.

## Progress / Outcome
2026-10-01: M5 выполнен. Подтверждённая проблема: native dialog после последнего пункта отпускал focus в browser chrome (document.activeElement=body). В общем ModalDialog добавлен boundary wrap Tab/Shift+Tab для текущих enabled/visible controls. Escape и return focus сохранены.

Проверки: 9 страниц × 320/390/768/1024/1440/720, включая две карточки товара, коллекцию и непустые cart/checkout. Проверены границы текста/контролов (включая Range rects), отсутствие overflow/console errors, touch targets ≥44px, actual text contrast, accessible names через Chromium AX tree и ссылки на labels/errors. Скриншоты home/product/checkout просмотрены на 390/768/1440. 720×500 проверяет reflow эффективного desktop viewport при 200%, а не реальный жест zoom браузера.

Build/lint/typecheck успешны; 12 relevant E2E прошли (2 ожидаемых skips). После уточнения теста обеих границ Tab/Shift+Tab отдельно прошли ещё 2 modal scenarios. Полный flow выполнен клавиатурой; invalid/success focus и reduced motion проверены. Read-only review не выявил существенных ошибок. Ручное тестирование NVDA/VoiceOver не выполнялось; AX tree — автоматический spot-check.
