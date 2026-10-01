---
name: accessibility-audit
description: Audit SEZON storefront changes for keyboard access, semantics, focus management, forms, variant controls, screen-reader feedback, contrast, touch targets, zoom, and reduced motion.
---

Use after implementing interactive UI and before considering a commerce flow complete.

## Critical checks

- semantic button/link distinction;
- logical heading/landmark structure;
- visible focus on every surface;
- drawer/dialog focus entry, trap, Escape, return;
- variant selectors expose text labels and unavailable state;
- form labels and field-linked errors;
- add-to-cart feedback available to assistive tech;
- 44px-ish mobile target size for critical controls;
- no information conveyed only by color/hover/motion;
- reduced-motion mode;
- 200% zoom/reflow;
- keyboard-only product → cart → checkout journey.

Report blockers first. Distinguish automated findings from manual interaction findings.
