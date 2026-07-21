# ADR-029: A task is a folder, keyed by a permanent global ID

- **Status:** **accepted** — owner-approved 2026-07-19, on design revision 2. Both acceptance gates were
  clear at approval: the adversarial pass had **run** (18 findings, all evaluated and incorporated), and
  the ADR-015 collision was **resolved by deferral**.
- **Deciders:** owner (Mark Dolbyrev); recorded by fkit-architect; fkit-producer consulted for
  sequencing/decomposition; adversarial review by Codex via fkit-adversarial-reviewer.
- **Revisions:** 2026-07-19 — Decision 8 inverted (registry dropped), Decision 7 confirmed
  (`plans/`+`worklogs/` absorbed), consuming-project migration deferred; then **revision 2**, post
  adversarial pass: the ID backfill is **pinned to a commit SHA** (Decision 4), the ledger key resolves
  to a **folder** (Decision 7), and the **rollback window** is bounded (Consequences).
- **Date:** 2026-07-19
- **Evidence:** [`reports/2026-07-19-design-task-folder-structure-and-id-scheme.md`](../reports/2026-07-19-design-task-folder-structure-and-id-scheme.md)
  — the full design, including the measured blast radius and the three silent-break mechanisms.
- **Task:** [`design-task-folder-structure-and-id-scheme.md`](../../tasks/done/0030-design-task-folder-structure-and-id-scheme/brief.md) (Sprint 2, priority 74)
- **Implements:** [ADR-020](adr-020-per-task-plan-and-worklog-artifacts.md) §Decision 6 — the per-task
  folder it recorded as the intended future direction.

> **What this ADR decides, in one line:** a task stops being a file and becomes a **folder**
> `ai-agents/tasks/<board>/<NNNN>-<slug>/` holding the brief and every artifact, keyed by a **permanent
> four-digit global ID** that is never reused and never renumbered.

## Context

A task is one file: `ai-agents/tasks/<board>/<slug>.md`. Everything else it produces lives in a
different top-level directory keyed by a different identifier — `plans/<slug>.md`,
`worklogs/<slug>.md`, `reviews/<slug>.md` — and reference assets have no home at all. Four homes, one
task, joined by a **slug that can change**. Rename the slug and the artifacts orphan silently.

There is also **no task identity today**. The numbers used in conversation and on the boards are
*sprint-scoped priority*, and they are not unique: Sprint 1 and Sprint 2 each have a task 46. Nothing
in the project can name a task unambiguously across sprints.

ADR-020 already recorded the fix as the intended end state (§Decision 6: *"collapse the brief, plan,
worklog, and review ledger into a single per-task folder … Today's separate top-level dirs are a known
stepping stone toward that"*). This ADR executes it.

### What the investigation found that the task brief did not

The design was expected to be a naming exercise. It is not. Three mechanisms break **without erroring**,
and one destroys data:

1. **`dashboard.sh:535` derives a task's board from its parent directory.** Under folders the parent is
   the task folder, not the board, so the location cross-check at `dashboard.sh:667,681` can never
   succeed again — **every row on every board reports false drift**, and because drift forces a row to
   render, the open-work filter is defeated too. The script still exits 0.
2. **Link-rot recovery (`dashboard.sh:536-546`) keys on the brief's filename.** Under folders every
   brief is `brief.md`, so the recovery loop never matches and every stale href reports `missing-brief`
   instead of relocating — silently disabling two sprint tasks' worth of repair machinery.
3. **The review-ledger key (`reviews/README.md:24-30`) is "the task file's basename without
   extension."** Under folders that is `brief` for **every task in the project**, so every ledger
   collapses onto `ai-agents/reviews/brief.md` and overwrites the others. Both agents derive it
   identically, so they agree perfectly on the wrong file. **This is data loss, and it is the reason
   the brief filename decision could not be made in isolation.**

The brief's other stated facts were also stale: **95 briefs, not 89** (94 when the design was drafted hours earlier — see Decision 4 on why a moving corpus is more than a stale count); **21 tooling files, not 13**; and
**task 64 — which the brief instructs this design to sequence against — is already Done.**

## Decision

### 1. A task is a folder

```
ai-agents/tasks/<board>/<NNNN>-<slug>/
├── brief.md          REQUIRED — always present
├── plan.md           optional  (ADR-020)
├── worklog.md        optional  (ADR-020)
├── review.md         optional  — the two-party ledger
└── assets/           optional
```

`brief.md`, `plan.md`, `worklog.md`, `review.md`, `assets/` are **reserved names**. A folder containing
only `brief.md` is the normal case and needs no marker. A folder **without** `brief.md` is malformed and
is reported as drift.

### 2. The board stays in the path

`<board>/<ID>-<slug>/`, not ADR-020 §6's flat `<task-id>/`. The board-as-directory **is** the task's
status in the data model: `expected_dir()` and drift rule 3 cross-check the brief's `## Status` against
its **location**, catching a brief edited without being moved. A flat layout deletes that cross-check
and makes status single-sourced to a text field.

### 3. The ID: four digits, zero-padded, allocated as `1 + max`, never reused

`0001`…`9999`. Zero-padded so lexical sort equals numeric sort.

> **Next ID = 1 + the highest ID that has ever existed, across all three boards. Never reused, never
> renumbered, never recycled from a cancelled task.**

Scanning all three boards is load-bearing: a cancelled task keeps its ID forever and its inbound links
still reference it.

**The cross-branch race is accepted, not eliminated.** Two branches can each allocate `0095` and merge
cleanly — different folder names, no textual conflict, and git will not catch it. A lock protocol is
real machinery for a single-owner prototype and a stale lock is the worse failure. Mitigation is
**detection**: a duplicate-ID assertion in the `node --test` suite (ADR-014). IDs are cheap to renumber
*before* anything links to them, which is exactly the window a merge exposes.

### 4. Existing tasks are numbered by slug, `LC_ALL=C`-sorted, board-blind

> Take every brief path **as of a commit SHA pinned in task 75's brief before work starts**. Sort by
> **slug alone**, ascending, under `LC_ALL=C`. Assign `0001`… in that order. Board membership is ignored.

The bar the brief set is that two people applying the rule produce **identical** IDs, which excludes any
rule requiring judgment. Chronological ordering needs git archaeology and ties; sprint+priority is the
collision being fixed; board-then-alphabetical disagrees the moment a task moves mid-assignment.
Verified precondition: all slugs are unique, so the sort is total with no tie-break case — **re-checked
against the pinned SHA**, since uniqueness is a property of the corpus, not a permanent truth.

**The SHA pin is load-bearing and was added in revision 2 after the adversarial pass.** Numbering a
sorted corpus `0001…N` means one new brief shifts every alphabetically-later ID — and the corpus moved
**94 → 95 while this design was being written**. Without the pin, two people applying the rule *a day
apart* get different IDs, which fails the very bar this decision is built to meet. **Only the one-time
backfill is pinned**; the steady-state `1 + max` rule in Decision 3 is append-only and cannot be
perturbed.

**Post-pin rule — never re-derive.** A brief created after the pin is not in the backfill; it takes
`1 + max` on creation and triggers **no** re-derivation. No assigned ID is ever recomputed. Stated
explicitly because "pin the assignment" alongside "the corpus keeps moving" can be read as *re-pin when
the next brief lands* — which would renumber tasks that already have IDs, the exact permanent failure
this decision exists to prevent. **The ID sequence is allocation order, not alphabetical order**; the
sort makes the one-time backfill reproducible and then stops applying.

**All tasks are numbered, including closed ones** — their artifacts are keyed by the same identifier.

### 5. `## ID` is a brief field; the folder name is authoritative

Not a preference — **forced by the decomposition**. Task 75 assigns IDs with *no file moves*, so the
folders do not yet exist; if the folder name were the sole carrier, task 75 could not record an ID
anywhere.

Two carriers can drift, and fkit's established answer to that is not "pick one" but **carry both and
lint the disagreement** — exactly as `## Status` duplicates the board's status cell and drift rule 3
reconciles them. `dashboard.sh` therefore gains an **`id-mismatch`** drift kind.

### 6. `## Priority` survives, as board rank only

Identity and rank are different concepts. The ID is permanent; priority is mutable by design
(re-ranking a sprint), and the Backlog board already writes `Unscheduled`/`—` — tasks with identity but
no rank.

The gain is a simplification: `dashboard.sh` currently reverse-engineers an identifier out of the
**Priority cell** with a filename-stem fallback and a `?` sentinel (~24 lines, each clause paid for by a
defect). Reading the ID from the folder name collapses that to one unambiguous lookup.

### 7. `reviews/`, `plans/` and `worklogs/` are all absorbed

Three top-level directories disappear. The brief asked only about `reviews/`, but ADR-020 keys all three
identically — answering for one would leave two directories slug-keyed while briefs are ID-keyed,
installing the two-grammar problem fresh. ADR-020 §6 pre-authorizes all four artifacts.

The ledger-key rule (`reviews/README.md`) changes so that **rules 1, 2 and 3 resolve to a folder, not a
string** — because the ledger now lives *inside* a task folder, an id alone is no longer enough. Rule 2
becomes "the task folder name". Rule 1 accepts an ID prefix or folder name, and an explicit id matching
no folder falls through to rule 4 rather than creating an orphan. Rule 3's branch-derived id has no task
folder at all, so its ledger goes to `ai-agents/sprints/reviews/<branch-slug>.md`. Rule 4 is untouched.
Both stateful-review skills must change in the same commit or the ledger forks.

*(Revision 2: rev 1 claimed "only rule 2 changes." The adversarial pass showed rules 1 and 3 resolve ids
without identifying a folder — `fkit-stateful-review/SKILL.md:23-33` explicitly permits the branch path —
leaving a valid review with nowhere to write.)*

**Two ledgers are sprint-keyed, not task-keyed** (`sprint2-scaffold-launcher-hardening.md`,
`sprint2-shared-instructions-delivery.md`) and have no task folder to fold into. They move to
**`ai-agents/sprints/reviews/`** — the same principle applied consistently: an artifact lives with the
thing it describes, and these describe a sprint. `ai-agents/reviews/` still disappears.

### 8. There is no registry file

The task brief's ruling 1 named "a permanent project-wide ID **plus a registry**." The architect raised
a finding against the stored registry rather than substituting silently, and **the owner ruled to drop
it** (2026-07-19). The ID itself is unchanged.

> **Two carriers, no third.** The **folder name** (post-migration) and the brief's **`## ID`** field,
> reconciled by the `id-mismatch` drift check. Nothing else stores an ID.

The reasoning that carried the finding:

- The tree already answers every question a registry would. Allocation (`1 + max`) is one `ls`; lookup
  is one `grep`.
- A generated, committed index is a **third carrier that can drift** — a lesson this project has paid
  for at least three times (ADR-018's skill-ownership source-of-truth reconciliation; `dashboard.sh`'s
  "there is ONE grammar" comments at `:111-126` and `:308-313`, each written after a defect caused by
  two sources answering one question).
- **Nothing in the design reads a registry.** It would have existed only to be maintained.

**Consequence:** task 75 shrinks to *"add `## ID` to all 94 briefs and write down the allocation
procedure"* — it now creates no file at all.

### 9. The scaffold is unchanged; `.gitkeep` never arises

A task folder always contains `brief.md`, so it is never empty and never needs a keep.
`claude/scaffold/ai-agents/tasks/{backlog,done,cancelled}/.gitkeep` stay exactly as they are — the three
board directories still ship empty. ADR-027 parity holds for free, and
`test/converge-contract.test.js` needs no change (its keep list is derived from the scaffold manifest,
not hardcoded).

### 10. Sequencing

- **Against task 64: there is no ordering.** It is already Done; the collision the brief describes does
  not exist. Two stale warnings asserting otherwise are being corrected before implementation
  (producer-owned, owner-ruled 2026-07-19). **Task 64 itself is accepted without owner verification**
  (owner ruling) — an accepted risk, since its output is two of the mover skills this migration
  rewrites.
- **The six queued wiki-syncs (45, 51, 66, 69, 71, 73) wait and batch into task 78.** Their subject is
  task-board mechanics; running them first means writing those pages twice and having the vault carry a
  *verified-knowledge* description of a structure about to change. Sprint 2 task 11 established this
  precedent explicitly. **Tradeoff:** the vault stays stale for the migration window — acceptable
  because the staleness is *missing features*, not *actively wrong*; after task 76 it becomes actively
  wrong, which is why 78 cannot also wait.

### 11. Rollback is a git tag the owner creates

```
BEFORE task 76:  owner commits (CLEAN tree), then `git tag pre-task-folder-migration`
TASK 76:         all moves via `git mv`; owner commits as ONE commit
ROLLBACK:        git revert <sha>                      ← ONLY while 76 is the tip
            or   git reset --hard pre-task-folder-migration   ← after 77/78, the only option
```

**Agents never commit unprompted (universal hard rule), so the owner must create the rollback point
before the agent starts.** If that step is skipped the rollback story does not exist — the change would
live entirely in an uncommitted tree, which the brief explicitly forbids.

**The revert window closes when tasks 77/78 land** (revision 2). Their commits target the new layout, so
reverting 76 alone leaves folders gone and ~310 links plus the whole vault still pointing at them. After
that, only the destructive reset is coherent — and it discards their work too. The pre-migration commit
must be **clean**, not merely tagged: `reset --hard` does not remove untracked files.

## Options considered

- **A task is a folder, keyed by a permanent global ID (chosen).** Fixes identity and cohesion together.
  Expensive once — 94 folders, 138 file moves, ~309 link rewrites — and then permanent.
- **Keep one file per task; add an ID prefix to the filename** (`0042-build-thing.md`). Rejected as
  insufficient: solves identity but not cohesion — plan/worklog/ledger stay in three other directories,
  which is the problem the owner asked to fix. **Genuinely cheaper, and the fallback if the folder move
  proves too risky in review.**
- **Flat `tasks/<ID>-<slug>/` with board as a brief field** (ADR-020 §6's own sketch). Rejected: deletes
  the location↔status cross-check drift rule 3 depends on.
- **A dual-format transition period.** Rejected by owner ruling 2, and correctly — every tool would have
  to handle both layouts, doubling the surface where the silent breaks can hide.
- **Content-hash IDs.** Rejected: not sequential (violates ruling 1), unreadable, no ordering.
- **Defer; fix only the artifact scatter.** Rejected: leaves the slug as the join key, so a rename still
  orphans artifacts. Treats the symptom.

## Consequences

**Gained**
- One home per task; a rename can no longer orphan artifacts.
- A permanent, unambiguous handle for every task, across sprints and boards.
- Link-rot recovery gets *stronger* — the recovery key becomes the immutable ID rather than a mutable
  slug.
- The movers become better: `git mv` on the folder moves the brief **and** its plan, worklog and ledger
  as one unit. Today the brief moves and three artifacts stay behind.
- `dashboard.sh` loses its most defect-prone code path (the Priority-cell id derivation).
- Three top-level directories disappear.

**Paid**
- The largest single structural change in the project's history: 94 folders, 138 files, ~309 links.
- ~21 tooling files plus 4 test files change together; task 76 is **atomic by necessity** — the moment
  files move, `dashboard.sh` stops finding briefs and both movers stop finding rows.
- Every historical path reference in the repo becomes wrong at once. The wiki's 98 refs are repaired by
  a separate role (hard rule), so there is a window where the vault is stale.
- The cross-branch ID race is a **residual accepted risk**, not an eliminated one.
- The rollback story depends on the **owner** performing a commit and tag the agent cannot do.

**Deferred, deliberately and on the record**
- **Consuming projects are not migrated by this change** (owner ruling, 2026-07-19). A project that
  already ran fkit has tasks in the old layout, and
  [ADR-015](adr-015-additive-launch-convergence-no-migration-mechanism.md) decided that launch converges
  `ai-agents/` **additively** — creating what is missing, **never rewriting what exists**.

  The owner first ruled to solve this inside the migration; on the finding that doing so would reopen
  ADR-015, the ruling was **changed to deferral**. It becomes **its own task and its own ADR**, scoped
  immediately after this migration lands. **ADR-015 is therefore not reopened by this ADR.**

  **The accepted cost:** while that follow-up is open, a project installing fkit gets skills expecting
  the new layout against a tree in the old one. Named here so it is a decision, not a discovery.

## Re-raise only if

- **The folder layout is proposed to change again** (e.g. flattening the board out of the path, or
  renaming a reserved artifact filename). Decisions 1, 2 and 7 are settled; reopening them re-litigates
  the location↔status cross-check that drift rule 3 depends on.
- **The ID format or the never-reuse rule is questioned.** Settled. The one thing that would justify
  reopening is a **duplicate ID actually occurring in practice** — that is evidence the accepted risk in
  Decision 3 was mispriced, and it warrants revisiting prevention over detection.
- **A registry file is proposed again.** Decision 8 dropped it on a stated finding, and the owner ruled.
  Reopening needs a concrete consumer — something that must *read* an index the tree cannot answer. "It
  would be convenient" is not that.
- **Do not re-raise** the dual-format transition, content-hash IDs, or numbering only open tasks. All
  three were weighed and rejected on stated grounds.
- **Do not re-raise** the task-64 ordering. It is Done; there is no collision.
