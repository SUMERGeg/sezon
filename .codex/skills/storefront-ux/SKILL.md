---
name: storefront-ux
description: Design or review commerce flows for the SEZON flower shop, including catalog filters, product variants, cart behavior, demo checkout, empty states, and florist-specific seasonal constraints.
---

Use this skill whenever changing product discovery, product detail, cart, checkout, or associated state.

## Review order

1. Identify user goal and current route.
2. Trace happy path end to end.
3. Enumerate edge states:
   - unavailable variant;
   - empty results;
   - empty cart;
   - stale persisted item;
   - delivery vs pickup;
   - invalid fields;
   - seasonal substitution disclosure.
4. Check that price, size, availability and next action remain obvious.
5. Check mobile separately; do not approve a scaled-down desktop composition by default.
6. Check keyboard and no-hover use.
7. Confirm demo constraints: no payment, no real order, no persisted PII.

## Output format

- User goal
- Current friction
- Required behavior
- Edge cases
- Acceptance criteria
- Out-of-scope ideas
