# 10. Testing & QA

## Test pyramid for this project

### Unit/domain
Cover deterministic logic heavily:
- money;
- filters;
- sort;
- variant lookup;
- cart identity/merge;
- quantity clamps;
- totals;
- persisted state validation.

### Component
Target behavior-heavy UI:
- variant selector;
- filter group;
- quantity stepper;
- checkout conditional fields;
- menu/drawer focus behavior.

### E2E Playwright
Critical flows:
1. homepage → product → add to cart;
2. filter catalog → clear filters;
3. unavailable variant cannot add;
4. cart persists reload;
5. same variant merges;
6. different size is separate line;
7. courier checkout shows address and fee;
8. pickup hides address and fee;
9. invalid form errors are associated with fields;
10. complete demo and clear cart;
11. mobile menu + keyboard Escape;
12. empty cart and empty catalog result states.

## Browser matrix

At minimum:
- Chromium desktop;
- WebKit mobile emulation;
- Firefox smoke for critical flow.

## Viewports

Primary visual checks:
- 390x844;
- 768x1024;
- 1024x768;
- 1440x1000.

Also spot-check 320 width for catastrophic overflow.

## Visual regression

Stable screenshot targets:
- home hero;
- catalog normal;
- catalog filtered;
- product selected variant;
- cart with 2 lines;
- checkout courier;
- checkout errors;
- mobile menu.

Avoid snapshots for animation mid-state.

## Accessibility smoke

Automated checks help, but manual checks required:
- tab order;
- visible focus;
- Escape behavior;
- form labels/errors;
- screen-reader announcement for add-to-cart;
- zoom 200%;
- reduced motion.

## Content QA

Check:
- no ceramic language remains;
- no fake testimonials/metrics;
- no accidental «оплатить» CTA;
- demo disclosure present on checkout;
- product sizes and prices match data;
- seasonal substitution note is understandable.

## Performance QA

Check:
- LCP hero image not duplicated/eager-loaded unnecessarily;
- product grid images lazy load;
- hover second images do not explode network usage;
- no hydration warnings;
- no layout shift when price/variant changes.

## Release blocker severity

P0:
- app does not build;
- core flow impossible;
- checkout sends data externally;
- payment-like UX appears.

P1:
- cart totals wrong;
- mobile overflow blocks UI;
- keyboard cannot use critical control;
- unavailable variant can be ordered;
- concept status missing on checkout.

P2:
- visual inconsistency;
- minor copy issue;
- non-critical animation defect.
