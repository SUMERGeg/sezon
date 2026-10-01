# ExecPlan 0007 — выпадающие списки в стиле сайта

## Goal / Context
Пользователь просит заменить системные выпадающие меню из скриншота кастомными в пастельном стиле сайта. Три select: catalog sort, checkout date/slot.

## Architecture / State
Один небольшой client CustomSelect без новой зависимости: select-only combobox + listbox в portal (не обрезается декоративным overflow). Controlled value остаётся в URL для sort и в ephemeral checkout state для date/slot. Hidden input передаёт только выбранное значение в FormData. Контакты не персистятся, cart/domain неизменны.

## UI / Acceptance
Пастельный popup, зелёный selected/check и розовый hover, disabled options. Keyboard: arrows/Home/End, Enter/Space commit/open, Escape cancel, Tab commit/continue, typeahead; focus остаётся на trigger, aria-expanded/controls/activedescendant/selected. Click outside закрывает. Popup помещается в viewport и реагирует на scroll/resize. Labels/errors/required работают в checkout; первый invalid select получает focus trigger.

## Steps / Tests
- [x] Browser tests нового keyboard/popup поведения (red), адаптировать существующие tests к кастомному UI.
- [x] Реализовать компонент/CSS и подключить 3 controls.
- [x] Build/lint/typecheck, relevant storefront/checkout E2E, 390/1440 screenshots/console/overflow.

## Non-goals / Risks
Не менять бизнес-правила, не заменять text/phone inputs/checkboxes, не вводить UI library. Главные риски — portal positioning/focus и FormData integration.

## Outcome
Готово: сортировка, дата и интервал используют общий CustomSelect. Build/lint/typecheck успешны; 11 storefront/checkout E2E и 2 custom-select E2E прошли на mobile/desktop (один desktop-only skip мобильного dialog). Кириллический typeahead проверяется keydown: Playwright keyboard.press не поддерживает ключ «н». Скриншоты popup просмотрены на 390/1440; keyboard/console/overflow и demo/privacy сценарии успешны. Краткое read-only ревью не выявило существенных ошибок.
