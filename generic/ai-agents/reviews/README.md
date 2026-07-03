# Reviews

Per-task review ledgers. One file per task under review, named after the task ID
(e.g. `my-task.md` for `ai-agents/tasks/.../my-task-*.md`).

## Why this exists

External reviewers (Codex, GitHub, CI) are **stateless** — each pass re-examines the
current code with no memory of which tradeoffs were already weighed and deliberately
accepted. That causes review *loops*: a fix for finding N introduces the cost that
finding N+2 then flags, and round after round just relocates a cost around an
unavoidable tradeoff (a Pareto frontier) instead of fixing a defect.

A review ledger gives every round — and every reviewer — the decision state, so
settled tradeoffs are not re-litigated.

## How it's used

- `process-review` **loads** the task's ledger at the start, **checks** each new
  finding against the Accepted residuals, **flags re-litigation loudly** instead of
  silently re-fixing, and **appends** its verdicts + decisions at the end.
- When handing a diff to an external reviewer, **point them at this file** so they
  start from the decision state instead of re-deriving it blind.

## Classifying a finding (before acting)

- **Defect** — wrong behavior or a real regression → fix it, in any round.
- **Frontier-move** — the current point on an unavoidable tradeoff has a downside →
  it's a *decision*, made once, not a re-fix. Tell-tale: if "fixing" finding N would
  recreate a condition a prior finding flagged, it's oscillation, not progress.

A round budget (e.g. "max 2 rounds") is a proxy, not the rule. Act on genuine new
defects in any round; stop when findings re-raise accepted residuals.

## File structure

Each `<task-id>.md` has three sections:

1. **Accepted residuals (do-not-re-litigate)** — tradeoffs weighed and deliberately
   accepted. Each entry states **What** (the chosen behavior), **Why (structural)**
   (the reason, and which alternatives were rejected), and **Re-raise only if** (the
   new condition that would justify reopening it). A finding matching an accepted
   residual is **closeout**, not a new defect — unless its "Re-raise only if" is met.
2. **Decision log** — chronological, one row per round: finding → verdict → action,
   **including reversals and why**. Makes oscillation visible at a glance.
3. **Open / actionable** — genuine defects still to fix. Empty = nothing blocking.

## Template

```
# Review ledger — <task-id>

Task: <path to task file>
File(s) under review: <paths>
Status: <in-review | closed-out>

## Accepted residuals (do-not-re-litigate)

- **<short name>** — What: … Why (structural): … Re-raise only if: …

## Decision log

| Round | Finding | Verdict | Action |
|-------|---------|---------|--------|
| 1 | … | CORRECT / PARTIALLY CORRECT / INCORRECT / INCOMPLETE | … |

## Open / actionable

- (none)
```
