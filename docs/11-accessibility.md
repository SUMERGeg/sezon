# 11. Accessibility

Target: strong WCAG 2.2 AA-oriented implementation for key flows.

## Semantics

- one meaningful H1 per page;
- heading order logical, not chosen for font size;
- navigation uses `nav`;
- catalog uses list semantics when appropriate;
- buttons for actions, links for navigation;
- fieldset/legend for grouped variant/filter radios where helpful.

## Keyboard

Every critical action reachable without pointer:
- open/close menu;
- filter drawer;
- select size/palette;
- gallery controls;
- add to cart;
- update/remove cart line;
- checkout fields and submit.

Drawers/dialogs:
- focus moves in;
- focus constrained while modal;
- Escape closes;
- focus returns to trigger.

## Focus

Never remove outline without replacement. Focus ring must contrast on milk, green and image-adjacent surfaces.

## Product variants

Color choices require text names. Unavailable states use text/icon/disabled semantics, not opacity alone.

## Forms

- visible labels preferred;
- placeholders are not labels;
- errors tied with `aria-describedby`;
- invalid state has text explanation;
- error summary optional for checkout, but field-level error mandatory.

## Live updates

Add-to-cart feedback should use polite live region. Quantity/total updates must remain understandable; avoid announcing every keystroke noisily.

## Images

Meaningful product images: useful alt.
Repeated secondary views: alt can be concise and distinguish angle/detail.
Pure decoration: empty alt.

## Motion

`prefers-reduced-motion: reduce`:
- disable decorative parallax/scale;
- keep drawers functional with minimal/no animation;
- no essential information encoded only in movement.

## Touch

Primary interactive target >=44 CSS px where practical, especially mobile header, quantity, drawer controls and gallery arrows.

## Zoom/reflow

At 200% zoom desktop UI should reflow without horizontal page scroll for normal reading and interaction.

## Contrast

Check actual token combinations in tooling. Do not assume dark green + berry automatically passes for small text.

## Checklist before release

- [x] keyboard-only product purchase flow
- [x] keyboard-only checkout flow
- [ ] screen reader spot-check main landmarks/forms
- [x] focus visible in critical keyboard flow
- [x] color not sole state cue in critical controls
- [x] reduced motion
- [x] 200% effective viewport reflow
- [x] targeted automated semantics/contrast scan on critical pages

## M5 validation — 2026-10-01

`tests/e2e/accessibility.spec.ts` covers 9 routes at 320/390/768/1024/1440/720 CSS px, nonempty cart/checkout, text/control bounds, touch targets, computed text contrast, Chromium AX control names and field error references. 720×500 models the effective viewport of 1440×1000 at 200% zoom; actual browser zoom gesture and manual NVDA/VoiceOver were not tested. Screenshots reviewed at 390/768/1440. Keyboard flow covers gallery/variants/card/add/cart quantity/checkout errors and success; modal boundaries explicitly wrap in both directions and Escape restores trigger focus. This is targeted verification, not a full WCAG conformance audit.
