# 13. Security & privacy

## Threat surface in MVP

No backend dramatically reduces risk, but browser inputs and third-party assets still matter.

## Checkout privacy

Strict rules:
- no real payment details;
- no card number fields;
- no POST/analytics event containing phone, email, name, address or greeting text;
- checkout fields are not persisted to localStorage/sessionStorage;
- success state may keep only non-personal order summary in memory until navigation.

## LocalStorage

Persist only cart IDs/options/quantity. Treat storage as untrusted input on every read.

Validate:
- object shape;
- known product/variant IDs;
- bounded integer quantities;
- known booleans/enums.

## Rendering user text

Greeting/comment fields are plain text. Never render via `dangerouslySetInnerHTML`. If displayed in success preview, React escaping is sufficient by default.

## External links/assets

- avoid hotlinking unknown image hosts;
- use licensed/local assets;
- external links with new tab use safe rel attributes;
- no third-party chat/payment widgets in concept MVP.

## Analytics

If analytics are added for portfolio usage:
- track page/interaction events, not checkout PII;
- document provider;
- do not include form field values;
- respect applicable consent requirements for actual deployment jurisdiction.

## Secrets

MVP should require no secrets. If a later service is added, keep credentials server-only and outside repository.

## Dependency security

- minimize dependency count;
- lock dependencies;
- review major upgrades;
- run package audit/security tooling as appropriate;
- remove unused packages before release.
