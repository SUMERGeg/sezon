# Codex setup notes

## AGENTS.md

`AGENTS.md` is the persistent repository instruction map. Keep it short enough to remain useful and point to deeper docs contextually.

## Skills

Each folder in `.codex/skills/` is a standard skill bundle with exactly one `SKILL.md` and `name`/`description` front matter.

Depending on how Codex/Agents is launched, skill directories may need to be explicitly registered/mounted as capability directories or exposed by the surrounding tool. If automatic project-local discovery is not available in your environment, point Codex at `.codex/skills` or invoke a named skill explicitly in the task prompt.

Do not copy all skill bodies into `AGENTS.md`; that defeats progressive disclosure.

## Subagents

The files in `.codex/agents/` are reusable role prompts, not a claim that every Codex surface auto-discovers that folder.

When multi-agent orchestration is available:
1. main agent reads `docs/16-codex-workflow.md`;
2. main agent chooses one or more role specs;
3. it delegates a narrow independent task to a subagent with that role;
4. reviewers return findings to the main agent;
5. main agent integrates and verifies.

If your Codex surface has no explicit multi-agent controls, the same files can still be used as sequential review prompts.

## Suggested first prompt

> Read AGENTS.md and docs/exec-plans/active/0001-storefront-mvp.md. Use the codex-orchestration skill. Prepare the project scaffold and seed catalog only (Milestones M0–M1). Ask the frontend-architect subagent to review the proposed boundaries before implementation. Do not start visual polish yet.
