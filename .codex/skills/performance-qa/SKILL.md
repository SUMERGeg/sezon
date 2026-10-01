---
name: performance-qa
description: Review the SEZON storefront for photo-heavy performance risks, client-component overuse, hydration issues, layout shift, font loading, image loading strategy, and testable Web Vitals regressions.
---

Use for page completion, image changes, animation additions, dependency additions, and pre-release audits.

## Priorities

1. Identify actual LCP candidate and ensure only it is prioritized.
2. Inspect image dimensions, responsive sizes, formats and lazy loading.
3. Check second hover images are not eagerly fetched for the whole grid.
4. Reduce unnecessary client boundaries and global providers.
5. Check price/variant/gallery state does not cause layout shift.
6. Check font count/weights and fallback behavior.
7. Prefer CSS for simple visual transitions.
8. Measure before proposing major visual removal.

Return measurable risks and a verification method for each high-impact recommendation.
