# ExecPlan 0010 — M7 production/performance/release pass

## Goal / Context
Подтвердить готовность demo-storefront к публикации: production build, полный текущий unit/E2E набор, основной flow в Firefox/WebKit и измеримые lab performance результаты. Источники: docs/10-testing-qa.md, docs/12-performance-seo.md, docs/15-definition-of-done.md.

## Non-goals / State
Не публиковать сайт, не создавать backend/заказы/оплату и не менять persisted state. Исправлять только подтверждённые проблемы текущего release pass. Домен не задан: не придумывать production canonical URL.

## Acceptance / Steps
- [x] Production lab measurements home/catalog/product: LCP/CLS, ресурсы и image loading; оценить реальные проблемы.
- [x] Cross-browser smoke Chromium/Firefox/WebKit: основной demo flow и mobile dialogs.
- [x] Исправить подтверждённые blockers/performance issues; проверить связанные regression cases.
- [x] Build/lint/typecheck, full unit/E2E один финальный проход; release report и актуальные roadmap/README/CI.

## Tests / Risks
Lab: cold browser cache, Chromium 390px/DPR2, CPU×4, network 1.6Mbps/150ms; явно отличать lab от field Web Vitals. Проверить CLS при variant/cart state changes, no external PII requests и console errors. Существующие keyboard/responsive/reduced-motion suites остаются проверкой UX. Возможные ограничения: browser downloads, неизвестный hosting/domain, localhost measurements не моделируют реальную географию CDN.

## Outcome
2026-10-01: M7 завершён. Build/lint/TypeScript успешны, 58 unit, 52 E2E (2 ожидаемых skips), 3 mobile lab сценария прошли. Декор оптимизирован через адаптивные image-set URL Next optimizer; первое фото каталога eager, главное фото товара preload. Исправлен touch-выбор CustomSelect в WebKit; тест reload ожидает перехода в cart. Финальные LCP home/catalog/product: 1.364/1.008/2.108 с, CLS <0.004. SEO зависит от SITE_URL, неизвестный домен не выдуман; preview noindex. README/CI обновлены, подробности и ограничения — в docs/release-report.md. Независимое целевое ревью без существенных замечаний. Публикация не выполнялась.
