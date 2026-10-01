# ExecPlan 0006 — M4: демонстрационное оформление

## Goal / Context
Пользователь разрешил следующий этап после M3. Завершить flow товар → корзина → оформление → локальный результат. Источники: Checkout в `docs/05-ui-specs.md`, flows E/F/G в `docs/03-user-flows.md`, `docs/08-state-and-business-rules.md`, `docs/13-security-privacy.md`. Cart store и текущие цены каталога переиспользуются.

## Non-goals
Оплата, отправка заказа/API/analytics, backend, фактическая доставка/адрес мастерской, сохранение контактов, глобальный аудит.

## Architecture / Data-state impact
Валидированные demo delivery methods: courier 500 ₽, pickup 0 ₽; интервалы-примеры, один отключён. Pure domain: 7 будущих локальных дат начиная с завтра, проверка method/date/slot/name/phone/optional email/courier address/card message/comment и расчёт subtotal + delivery в копейках. Форму показывать только после cart hydration и при непустой корзине. Поля живут в DOM текущей формы, выбор способа — локальный UI state; данные формы не попадают в store/storage/URL. Итог success содержит только количество/способ/дату/интервал/сумму без PII. После явного валидного submit очистить форму и корзину; уход до завершения сохраняет корзину. Existing cart storage schema не меняется.

## UI / Accessibility
Постоянное заметное disclosure «Демонстрация магазина. Заказ и оплата не выполняются». Form labels, native radios/selects, ошибки с aria-invalid/aria-describedby, общий alert и focus первой ошибки. Самовывоз скрывает и очищает адрес; поле открытки только при соответствующей опции в корзине, лимит 180 символов; комментарий 500. Сводка товаров/доставки/итога обновляется от cart truth. Финальная кнопка «Завершить демонстрацию». Success focus на heading, пояснение что ничего не отправлено, возврат в каталог. Empty/loading состояния честные. Нет payment fields, выдуманного order number или обещаний доставки.

## Acceptance criteria / Tests
- Courier требует адрес; pickup не требует и стоит 0; дата/интервал обязательны, past/unknown/disabled не проходят.
- Невалидная форма не очищает корзину; первая ошибка получает focus.
- Валидное завершение не отправляет network request с данными, очищает корзину/форму, показывает только неперсональный итог.
- Reload/уход со страницы не сохраняет поля; уход до submit сохраняет корзину.
- Изменённая/опустевшая в другой вкладке корзина не допускает устаревшего завершения.
- Unit validation/dates/money, E2E courier/pickup/errors/privacy/empty/cart change, keyboard, 390/1440 screenshots/overflow/console, lint/typecheck/build.

## Steps / Progress
- [x] Написать unit/E2E для правил и оформления (red).
- [x] Реализовать demo data/domain, cart clear и форму/итог.
- [x] Проверить целевой flow и обновить README/M4.

## Risks / Decisions
Дата строится client-side после hydration, проверяется повторно при submit. Submission синхронный local UI переход без async/network. Контактные данные никогда не сохраняются и не показываются в success. Demo-тариф 500 ₽ — пример, а не коммерческое обещание. Обновить только связанные заглушки/тесты.

## Outcome
2026-10-01: M4 готов. Валидированные delivery data, pure dates/validation/total, client checkout form и неперсональный local result. Состояния loading/empty/errors/success, keyboard focus первой ошибки и результата. Courier требует адрес; pickup скрывает его и не берёт доплату; greeting text условный/180, comment/500. Завершение очищает форму и safe cart, не делает network submission. Уход/перезагрузка сбрасывают поля, незавершённая корзина сохраняется. Связанные заглушки cart/delivery-care обновлены.

Проверки: production build и typecheck exit 0, lint без ошибок, 50 unit tests (14 checkout), 14 relevant E2E cart + checkout (все passed). Browser подтвердил courier/pickup totals, field errors/focus, disabled slot, empty/cart change из другой вкладки, уход/reload без сохранения полей, отсутствие отправки данных и PII в storage/success. Screenshots на 390/1440 просмотрены, console/overflow без ошибок. Независимый read-only review не нашёл доказуемых P0/P1. Следующий этап M5 — responsive/accessibility; реальные заказы и оплата отсутствуют по product contract.
