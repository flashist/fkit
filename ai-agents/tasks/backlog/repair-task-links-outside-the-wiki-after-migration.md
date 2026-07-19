# Repair the task links in reviews and knowledge-base after the migration

## Sprint
Sprint 2

## Priority
77

## Status
🔲 Backlog

## Context

The migration ([task 76](migrate-tasks-to-folder-structure-and-update-tooling.md)) repairs the
**executable** references — the sprint-board hrefs `dashboard.sh` and the movers actually follow. It
deliberately leaves the **documentation** references, which are numerous but which nothing executes:

| Area | Approx. refs |
|---|---|
| `ai-agents/knowledge-base/` | ~59 |
| `ai-agents/reviews/` | ~40 |
| `ai-agents/tasks/` (brief ↔ brief cross-links) | ~11 |

That is roughly **110 links** to `ai-agents/tasks/<board>/<slug>.md` paths that no longer resolve.
Separating them is what makes task 76 reviewable: the structural change is judged on whether the tools
work, not buried under a hundred mechanical href edits.

**This task must not touch `ai-agents/wiki-vault/`** — that is task 78's, and only the `fkit-wiki` role
may write there.

**Two categories that are not the same edit, and must not be conflated:**

- **A link** — a pointer. Re-point it. A pointer to a file that is not there is rot, not history.
- **A prose claim** — e.g. a review ledger citing `tasks/backlog/foo.md:58` as *where a finding was
  observed at review time*, or a brief calling another task "also live". Those are **historical
  claims** and are **not** repaired by this task. Changing them rewrites the record.

## What to build

- Every **link** under `ai-agents/knowledge-base/`, `ai-agents/reviews/`, and brief-to-brief
  cross-links inside `ai-agents/tasks/` re-pointed to its post-migration path.
- **Relative-depth correctness**, not just filename correctness: a brief now sits one directory deeper
  than it used to, so a sibling link that was `](other-task.md)` is not simply renamed — its `../`
  depth changes. This is the error the migration is most likely to leave behind.
- **A list, in the task's worklog, of every prose claim deliberately left alone**, so the next reader
  can tell "not repaired" from "missed".

## Verification steps

- A mechanical sweep for `tasks/(backlog|done|cancelled)/[a-z0-9-]+\.md` across
  `ai-agents/knowledge-base/`, `ai-agents/reviews/`, and `ai-agents/tasks/` returns **only** the prose
  claims on the deliberately-left-alone list — nothing else.
- **Every relative markdown link in the swept files resolves to a real file**, checked by resolving
  each link against its containing file's directory. Filename-only checking is insufficient and will
  pass on a wrong `../` depth.
- The deliberately-left-alone list exists and every entry on it is genuinely a claim about the past,
  not a live pointer.
- `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` emits no new drift.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 76 — hard.**
- **Runs in parallel with task 78** — disjoint file sets, different write authorities. Neither blocks
  the other.
- **Scope boundary, hard: `ai-agents/wiki-vault/` is out of scope**, including its ~96 refs. Task 78.
- The link/claim distinction is the same one the task movers already encode ("a link is not a claim;
  it is a pointer") — this task applies that existing rule at scale rather than inventing a new one.
