# ADR-029: A task is a folder, keyed by a permanent global ID

**Date**: 2026-07-19
**Status**: accepted

> **What this ADR decides, in one line:** a task stops being a file and becomes a **folder**
> `ai-agents/tasks/<board>/<NNNN>-<slug>/` holding the brief and every artifact, keyed by a **permanent
> four-digit global ID** that is never reused and never renumbered.

⚠️ **Decided, not built.** As of ingest this is a ruling plus a design; the migration is task 76 and the
tree is still one-file-per-task.

⚠️ **Number collision, repaired 2026-07-19.** This number was briefly held by the `Stop`-hook ADR, now
[[decisions/adr-030-stop-hook-enforces-turn-completion-contract]]. Any reference to "ADR-029" written
before 2026-07-19 means the stop hook, not this page.

## Context

A task is one file, `ai-agents/tasks/<board>/<slug>.md`, while everything it produces lives in three
other top-level directories keyed by the same mutable slug — `plans/`, `worklogs/`, `reviews/`. Four
homes, one task, joined by a name that can change: rename the slug and the artifacts orphan silently.

There is also **no task identity**. The numbers used on the boards are *sprint-scoped priority* and are
not unique — Sprint 1 and Sprint 2 each have a task 46 — so nothing in the project can name a task
unambiguously across sprints. [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] §6 already
recorded the per-task folder as the intended end state; this ADR executes it.

### What the investigation found that the brief did not

The design was expected to be a naming exercise. It found **three mechanisms that break without
erroring**, one of which destroys data:

1. **`dashboard.sh:535` derives a task's board from its parent directory.** Under folders the parent is
   the task folder, so the location cross-check at `:667,681` can never succeed — every row on every
   board reports false drift, which also defeats the open-work filter. The script still exits 0.
2. **Link-rot recovery (`dashboard.sh:536-546`) keys on the brief's filename.** Every brief becomes
   `brief.md`, so the recovery loop never matches and every stale href reports `missing-brief`.
3. **The review-ledger key is "the task file's basename without extension"** (`reviews/README.md:24-30`).
   Under folders that is `brief` for **every task**, so every ledger collapses onto
   `ai-agents/reviews/brief.md` and overwrites the others. Both agents derive it identically, so they
   agree perfectly on the wrong file. **This is data loss** — and the reason the brief-filename decision
   could not be made in isolation.

The brief's other stated facts were stale too: **95 briefs, not 89**; **21 tooling files, not 13**; and
task 64, which the brief says to sequence against, **is already Done**.

## Decision

1. **A task is a folder** — `ai-agents/tasks/<board>/<NNNN>-<slug>/` holding `brief.md` (required),
   plus optional `plan.md`, `worklog.md`, `review.md`, `assets/`. Those names are reserved. A folder
   without `brief.md` is malformed and reported as drift.
2. **The board stays in the path**, not ADR-020 §6's flat `<task-id>/`. The board directory **is** the
   task's status in the data model; a flat layout would delete the location↔status cross-check that
   drift rule 3 depends on.
3. **The ID is four digits, zero-padded, allocated as `1 + max` across all three boards, never reused
   and never renumbered.** Scanning all boards is load-bearing — a cancelled task keeps its ID forever.
   **The cross-branch race is accepted, not eliminated:** two branches can each allocate `0095` and merge
   cleanly with no textual conflict. Mitigation is **detection** — a duplicate-ID assertion in the
   `node --test` suite ([[decisions/adr-014-how-fkit-tests-itself]]).
4. **Existing tasks are numbered by slug, `LC_ALL=C`-sorted, board-blind**, from a **commit SHA pinned
   in task 75's brief before work starts**. The pin was added in revision 2 after the adversarial pass:
   the corpus moved 94 → 95 *while the design was being written*, so without it two people applying the
   rule a day apart get different IDs. **Only the backfill is pinned; no assigned ID is ever recomputed.**
5. **`## ID` is a brief field and the folder name is authoritative** — two carriers, reconciled by a new
   **`id-mismatch`** drift kind, the same carry-both-and-lint answer fkit already uses for `## Status`.
6. **`## Priority` survives as board rank only.** Identity and rank are different; this also lets
   `dashboard.sh` drop ~24 lines that reverse-engineer an identifier out of the Priority cell.
7. **`reviews/`, `plans/` and `worklogs/` are all absorbed.** The ledger-key rules change so rules 1, 2
   and 3 resolve to a **folder**, not a string; rule 3's branch-derived ledger moves to
   `ai-agents/sprints/reviews/<branch-slug>.md`, as do the two sprint-keyed ledgers. **Both stateful-review
   skills must change in the same commit or the ledger forks.**
8. **There is no registry file.** The brief asked for "an ID plus a registry"; the architect raised a
   finding and **the owner ruled to drop it**. Two carriers, no third — a generated index is a third
   thing that can drift.
9. **The scaffold is unchanged**; a task folder always holds `brief.md`, so `.gitkeep` never arises and
   ADR-027 parity holds for free.
10. **Sequencing:** there is **no ordering against task 64** — it is Done and the collision the brief
    describes does not exist. **The six queued wiki-syncs (45, 51, 66, 69, 71, 73) wait and batch into
    task 78.**
11. **Rollback is a git tag the owner creates** before task 76, on a **clean** tree. Agents never commit
    unprompted, so if that step is skipped the rollback story does not exist. **The revert window closes
    when 77/78 land** — after that only a destructive `reset --hard` is coherent, and it discards their
    work too.

## Consequences

**Gained:** one home per task, so a rename can no longer orphan artifacts; a permanent unambiguous handle
across sprints and boards; link-rot recovery keyed on an immutable ID instead of a mutable slug; the
movers get better (`git mv` on the folder carries plan, worklog and ledger as one unit — today the brief
moves and three artifacts stay behind); `dashboard.sh` loses its most defect-prone path; three top-level
directories disappear.

**Paid, stated plainly:**
- **The largest single structural change in the project's history** — 94 folders, 138 file moves, ~309
  link rewrites.
- **~21 tooling files plus 4 test files change together.** Task 76 is **atomic by necessity**: the moment
  files move, `dashboard.sh` stops finding briefs and both movers stop finding rows.
- **Every historical path reference in the repo becomes wrong at once.** The **wiki's 98 refs are repaired
  by a separate role** (the write-gateway hard rule), so **there is a window where this vault is stale** —
  and per Decision 10 that staleness turns from *missing* to *actively wrong* after task 76, which is why
  task 78 cannot also wait.
- **The cross-branch ID race is a residual accepted risk**, not an eliminated one.
- **The rollback story depends on the owner** performing a commit and tag the agent cannot do.

**Deferred, deliberately and on the record:** **consuming projects are not migrated by this change**
(owner ruling). A project that already ran fkit keeps the old layout, because
[[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] converges `ai-agents/`
additively and never rewrites what exists. The owner first ruled to solve it inside the migration, then
**changed the ruling to deferral** on the finding that doing so would reopen ADR-015 — so **ADR-015 is not
reopened by this ADR**. The accepted cost, named so it is a decision rather than a discovery: while the
follow-up is open, a project installing fkit gets skills expecting the new layout against a tree in the
old one.

**Re-raise only if:** the folder layout is proposed to change again (Decisions 1, 2 and 7 are settled);
the ID format or never-reuse rule is questioned — and the one thing that justifies that is **a duplicate
ID actually occurring**, which would be evidence Decision 3's accepted risk was mispriced; or a registry
is proposed again **with a concrete consumer** that must read an index the tree cannot answer. Do **not**
re-raise the dual-format transition, content-hash IDs, numbering only open tasks, or the task-64 ordering.

## Related
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — §6 recorded this folder as the intended end
  state; this ADR executes it and absorbs all three of its top-level directories
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the additive invariant that
  forced the consuming-project migration into a **separate, deferred** decision rather than this one
- [[decisions/adr-014-how-fkit-tests-itself]] — where the duplicate-ID assertion lands; detection is the
  whole mitigation for the accepted cross-branch race
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the movers this migration rewrites;
  task 64's output is accepted **without owner verification**, a named accepted risk here
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — the ADR that briefly held this
  number; unrelated in substance
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — parity holds for free
  (Decision 9); the scaffold does not change
- [[systems/fkit]] — the `ai-agents/` data model this restructures
- [[tasks/sprint-2-remove-omnigent]] — the sprint carrying the migration cluster (74–78)
- Source: `knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md`;
  evidence `knowledge-base/reports/2026-07-19-design-task-folder-structure-and-id-scheme.md` (revision 2,
  post-adversarial); code cited `claude/dashboard.sh:111-126,308-313,535-546,667,681`,
  `ai-agents/reviews/README.md:24-30`, `claude/skills/fkit-stateful-review/SKILL.md:23-33`
