# Tasks

Every task is a **folder** under one of three boards — `backlog/`, `done/`, `cancelled/`:

```
ai-agents/tasks/<board>/<NNNN>-<slug>/
├── brief.md      REQUIRED — the task brief. Always present.
├── plan.md       optional — the approved implementation plan   (ADR-020)
├── worklog.md    optional — the ship-loop worklog               (ADR-020)
├── review.md     optional — the two-party review ledger
└── assets/       optional — reference material, fixtures, screenshots
```

`brief.md`, `plan.md`, `worklog.md`, `review.md`, `assets/` are **reserved names**. A folder holding
only `brief.md` is the normal case; a folder **without** `brief.md` is malformed and reported as drift
(ADR-029 Decision 1). The four-digit **ID** is permanent and global — the folder name carries it, and
the brief's `## ID` field is the redundant second carrier, reconciled by the `id-mismatch` drift check
(ADR-029 Decision 5). Task folders move between boards only via `/fkit-task-done` and
`/fkit-task-cancelled`, never by hand. See ADR-029 and the task-folder design spec for the full model.

---

# Review ledgers

Per-task **review ledgers** — one shared file per task under review, at `<task-folder>/review.md`. The
file is a **two-party document**: the reviewer (`fkit-reviewer`) and the coder (`fkit-coder`) each own
a section and round-trip in place.

## Why this exists

External reviewers (Codex, GitHub, CI) are **stateless** — each pass re-examines the current code
with no memory of which tradeoffs were already weighed and deliberately accepted. That causes review
*loops*: a fix for finding N introduces the cost that finding N+2 then flags, and round after round
just relocates a cost around an unavoidable tradeoff (a Pareto frontier) instead of fixing a defect.

The ledger gives every round — and every reviewer — the decision state, so settled tradeoffs are not
re-litigated. `fkit-reviewer`'s `stateful-review` writes the findings; `fkit-coder`'s
`process-stateful-review` writes the verdicts/actions; the shared *Accepted residuals* are the
loop-prevention memory both read first.

## The ledger key — one rule, both agents (or the ledger forks)

Both agents MUST derive the ledger path the same way; if they don't, they write to two different files
and the loop-prevention memory splits. Since the ledger now lives **inside the task folder**, the key
resolves to a **folder**, not a bare string. Canonical rule:

1. Explicit task-id in the invocation → the task whose **ID prefix or folder name** it matches; its
   folder's `review.md`. An explicit id matching no folder → rule 4 (never an orphan).
2. Else the task **folder name** (`ai-agents/tasks/**/<NNNN>-<slug>/` → `<NNNN>-<slug>`); its
   `review.md`.
3. Else the current **git branch name**, slugified → `ai-agents/sprints/reviews/<branch-slug>.md`. A
   review not tied to a task belongs with the sprint artifacts, not inside an arbitrary task folder.
4. If none resolves unambiguously → **stop and ask the owner.** Never invent one.

The ledger is created only once the key is resolved by 1–3 or confirmed by the owner — never
auto-created from a guess.

## Classifying a finding (before acting)

- **Defect** — wrong behavior or a real regression → fix it, in any round.
- **Frontier-move** — the current point on an unavoidable tradeoff has a downside → it's a *decision*,
  made once, not a re-fix. Tell-tale: if "fixing" finding N would recreate a condition a prior finding
  flagged, it's oscillation, not progress.

A round budget (e.g. "max 2 rounds") is a proxy, not the rule. Act on genuine new defects in any
round; stop when findings re-raise accepted residuals.

## File structure

Each `review.md` has three sections with **explicit ownership**:

1. **Reviewer findings** — *reviewer-owned*. One row per finding: id (`R1`, `R2`, …), round, severity,
   `file:line`, claim. The coder reads these and never edits them.
2. **Coder response** — *coder-owned*. One row per finding (same id): verdict, defect/frontier, action,
   status. The reviewer reads these for context and never writes them.
3. **Accepted residuals (shared, do-not-re-litigate)** — either party may add (with owner approval).
   Each entry: **What** (chosen behavior), **Why (structural)** (reason + rejected alternatives),
   **Re-raise only if** (the condition that reopens it). A finding matching an accepted residual is
   **closeout**, not a new defect — unless its "Re-raise only if" is met.

Settled **ADRs** under `ai-agents/knowledge-base/decisions/` are a second source of do-not-re-litigate
decisions: both agents treat an ADR's "Re-raise only if" exactly like an accepted residual.

## Template

```
# Review — <NNNN>-<slug>

Task: <path to the task folder's brief.md>
File(s) under review: <paths>
Status: in-review | closed-out

## Reviewer findings        ← reviewer-owned
| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | high | a.ts:12   | …     |

## Coder response           ← coder-owned
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect            | fix X  | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)
- <short name> — What: <chosen behavior> · Why (structural): <reason + rejected alternatives> · Re-raise only if: <condition>
```

Coder-response Status vocabulary: `pending approval` · `✅ done` · `won't fix (frontier)` ·
`disproven` · `closeout (re-litigation)` · `blocked`.
