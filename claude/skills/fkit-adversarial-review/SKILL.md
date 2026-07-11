---
name: fkit-adversarial-review
description: Get a standalone adversarial second opinion on a diff via the fkit-adversarial-reviewer agent — an independent hostile pass (run on Codex for model diversity, with a flagged Claude fallback) that returns findings only. Optional arguments — a base ref / scope and a focus area (e.g. "concentrate on concurrency").
---

# Adversarial Review (dispatch to the fkit-adversarial-reviewer agent)

Get an independent adversarial pass over a diff — findings only, from a deliberately different
perspective (Codex when available).

**Argument:** `$ARGUMENTS` — optional: a base ref or scope description, and a focus area.

## Steps

1. Invoke the **fkit-adversarial-reviewer** agent (via the Agent tool) with the scope and focus
   from `$ARGUMENTS` (default: the working tree).
2. **Relay its findings to the owner verbatim** — including the coverage line that says which mode
   ran (`[codex]` or `[claude-fallback — NOT model-diverse]`). Do not filter, soften, or pre-answer
   the findings: you are the coder whose work is under review.
3. Findings are inputs to evaluate, not orders. If the owner wants them dispositioned and acted on,
   that is `/fkit-process-review` (paste the findings), under its own verification and approval
   gates — never a silent consequence of this skill.

## Rules

- Never edit code in this skill; do not commit anything.
- If the pass ran as the Claude fallback, keep that flag loud — the owner should know the second
  opinion was not model-diverse.
