# 16. Codex workflow

## Principle

Главный агент отвечает за целостность решения. Субагенты используются для независимых исследований и ревью, а не как способ одновременно править одни и те же файлы.

## Recommended roles

Ролевые промпты:
- `.codex/agents/art-director.md`
- `.codex/agents/commerce-ux.md`
- `.codex/agents/frontend-architect.md`
- `.codex/agents/implementation-engineer.md`
- `.codex/agents/qa-accessibility.md`
- `.codex/agents/performance-seo.md`
- `.codex/agents/content-integrity.md`

## Orchestration pattern for a large feature

### 1. Main agent scopes
- reads relevant source-of-truth docs;
- creates/updates ExecPlan;
- identifies independent questions.

### 2. Parallel read-only subagents
Good parallel tasks:
- art direction review of current page;
- UX edge-case review;
- accessibility review;
- performance review;
- architecture review.

Expected output from each:
- findings grouped by severity;
- exact files/components affected if known;
- acceptance checks;
- no speculative redesign outside brief.

### 3. Main agent synthesizes
Resolve conflicts against source-of-truth docs. Do not blindly merge every recommendation.

### 4. Editing ownership
Preferred: one implementation owner for a related file set.

If multiple editing agents are used:
- split by non-overlapping directories/files;
- agree on shared interfaces first;
- main agent integrates and reruns tests.

### 5. Verification agents
After implementation, run independent QA/accessibility and visual-quality review. Reviewers should not be the same role that authored the change when possible.

## Skills

Skills live in `.codex/skills/<skill>/SKILL.md`. Use them when task matches their description:
- `codex-orchestration` — split complex work and coordinate reviewers;
- `storefront-ux` — e-commerce flow and state review;
- `visual-quality` — art-direction/UI polish;
- `accessibility-audit` — keyboard/semantics/forms/motion;
- `performance-qa` — images, client boundaries, Web Vitals risks;
- `content-integrity` — prevent fake commercial claims and concept leakage.

## Prompt patterns

### Implement page
“Implement the product detail page according to docs/05-ui-specs.md and docs/08-state-and-business-rules.md. Use an ExecPlan. Before editing, ask commerce-ux and art-director subagents for read-only review of the proposed page states. After implementation, ask qa-accessibility to review the finished diff.”

### Review current site
“Use codex-orchestration. Spawn independent visual-quality, commerce-ux, accessibility, and performance reviews. Do not edit until findings are synthesized. Then fix only P0/P1 issues and document deferred P2 items.”

### Refactor
“Read docs/06-technical-architecture.md. Create an ExecPlan. Keep behavior unchanged. Ask frontend-architect to identify boundary risks, then implement with focused tests.”

## What not to do

- do not make every task multi-agent;
- do not spawn reviewers for a one-line text change;
- do not let an art-direction agent rewrite business rules;
- do not let performance review delete intentional visual content without measurement;
- do not read every doc before every task;
- do not duplicate source-of-truth content into prompts.
