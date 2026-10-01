---
name: codex-orchestration
description: Coordinate complex work on the SEZON flower storefront by splitting independent reviews across subagents, synthesizing findings, assigning non-overlapping edits, and verifying the integrated result.
---

Use this skill for multi-page features, architecture changes, broad audits, or tasks that benefit from independent design/UX/quality review.

## Workflow

1. Read only the source-of-truth documents relevant to the task.
2. Create/update an ExecPlan when required by `AGENTS.md`.
3. Separate questions into independent review tracks.
4. Delegate read-only review to the smallest useful set of roles from `.codex/agents/`.
5. Require each subagent to return:
   - concrete findings;
   - severity P0/P1/P2;
   - evidence from current code/docs;
   - exact acceptance checks.
6. Synthesize. Reject suggestions that conflict with product brief or create scope creep.
7. Assign edits so two agents do not modify the same files concurrently.
8. Integrate, typecheck, test, and inspect the resulting UI.
9. Run at least one independent verification pass for material UI work.

## Good delegation

Parallel:
- art direction review;
- commerce flow review;
- accessibility audit;
- performance audit.

Keep in main agent:
- dependent implementation steps;
- small fixes;
- final architectural tradeoffs;
- merging conflicting recommendations.

Do not use multi-agent orchestration merely to appear thorough.
