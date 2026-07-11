---
name: fkit-review
description: Run an independent one-shot code review via the fkit-reviewer agent — its own pass plus a Codex adversarial second opinion, deduped, verified, reported with a one-line decision verdict. Ephemeral (no persistent file). Optional arguments — --base <ref>, --scope <auto|working-tree|branch>, and a focus area. REVIEW-ONLY — no code is edited.
---

# Review (dispatch to the fkit-reviewer agent)

Run an independent, two-perspective review of the current diff. The review itself runs in the
**fkit-reviewer** agent — a fresh, coder-untainted context; that independence is the point. You (the
lead session) are the coder here: you dispatch, then relay.

**Argument:** `$ARGUMENTS` — optional scope flags `--base <ref>`, `--scope
<auto|working-tree|branch>`, and any focus area. Default: working tree / `auto`.

## Steps

1. Invoke the **fkit-reviewer** agent (via the Agent tool) with:
   - mode: **review** (ephemeral — no ledger),
   - the scope flags and focus from `$ARGUMENTS` (or "working tree, scope auto" if none).
2. When it returns, **relay its report to the owner verbatim** — the verdict line, the findings
   table, the suppressed list, and the convergence call. Do not soften the verdict, drop findings,
   or pre-answer them: **you are the coder whose work is under review; the report is addressed to
   the owner, not to you.**
3. Do not apply any fix as a consequence of this review. If the owner wants findings acted on,
   that is a separate step — `/fkit-process-review` with the findings, under its own approval gate.

## Rules

- Never edit code in this skill; never let the reviewer's findings turn into silent edits.
- If the reviewer reports partial coverage (Codex unavailable), keep that flag loud in what you
  relay — never summarize it away.
- Do not commit anything.
