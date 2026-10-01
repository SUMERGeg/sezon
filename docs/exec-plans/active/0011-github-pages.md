# ExecPlan 0011 — GitHub Pages

## Goal / Context
Подготовить бесплатную публикацию demo-storefront через GitHub Pages: отдельный static export и GitHub Actions. Текущие Node/dev команды сохраняются. Контекст: next.config.ts, image-assets, pastel.css, metadata, каталог/useSearchParams, README.

## Scope / State / UI
Без push, создания remote или публикации из текущей сессии. State/storage/checkout contract не меняется, новый UI не добавляется. Responsive/keyboard/motion сохраняются.

## Acceptance / Steps
- [x] Static export поддерживает root и repository basePath; все slugs и metadata экспортируются.
- [x] Изображения/декор оптимизируются при сборке, без runtime image endpoint; ссылки учитывают basePath.
- [x] Workflow автоматически определяет Pages origin/basePath, собирает и публикует out; README объясняет настройку Pages.
- [x] Static build с непустым basePath, relevant unit/E2E на 390/1440: фильтры, direct reload, keyboard flow, фото/декор, ошибки сети/console/privacy.

## Decisions / Risks
Выбран отдельный build:pages, чтобы сохранить обычный dev/Node hosting. Next Link учитывает basePath автоматически; public assets и metadata требуют явного префикса. Картинки генерируются Sharp в ignored public/images/static, исходники не изменяются. Статическому каталогу нужен Suspense для browser query. Проверка использует настоящий файловый HTTP-сервер без SPA fallback, чтобы обнаружить ошибки вложенных URL.

## Outcome
2026-10-02: подготовлена публикация в SUMERGeg/sezon. Origin подключён, push/commit/deploy не выполнялись. build:pages создаёт 162 адаптивных WebP и static export в out; Node/dev режим сохранён. Metadata/ссылки/декор учитывают /sezon, workflow получает настройки Pages автоматически, публикует после успешных tests:pages. Каталог сохраняет полную сетку в SSR fallback. Settings → Pages → Source: GitHub Actions остаётся действием владельца репозитория.

Проверки: static build с /sezon и SITE_URL=https://sumergeg.github.io (включая TypeScript), lint и дополнительный lint последних изменений, 11 deployment/metadata unit tests; 6 static browser scenarios 390/1440 — успешно. Проверены 23 публичных/cart/checkout HTML маршрута, direct reload, responsive assets, metadata/robots/sitemap, history/query, mobile dialogs, клавиатурный flow и отсутствие запросов отправки PII, console/network errors/overflow. Root path отдельно покрыт unit-тестами. Скриншоты обоих размеров проверены.

Ruling: export distDir у Next означает папку результата, а не изоляцию intermediate build; оставлен стандартный out. На Windows Next16.3.8 экспортировал вложенные segment folders вместо ожидаемых router dot filenames: build:pages после export копирует их в правильные имена. Linux/Actions этот workaround не требует. HEAD navigation checks разрешены в privacy-тесте: это read-only запросы Next, не отправка формы.
