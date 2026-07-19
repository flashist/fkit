# Design the task-folder structure and the global task-ID scheme

## Sprint
Sprint 2

## Priority
74

## Status
🔲 Backlog

## Context

Today a task **is** a single file: `ai-agents/tasks/<backlog|done|cancelled>/<kebab-slug>.md`. Every
other artifact a task produces lives somewhere else entirely — the plan is transient, the worklog does
not exist, reviews live in `ai-agents/reviews/<task-id>.md`, and reference assets have no home at all.

The owner's decision (2026-07-19) is to make a task a **folder**: `ai-agents/tasks/<board>/<ID>-<slug>/`
holding `brief.md` and every related artifact (plan, worklog, review, assets).

**Three owner rulings are already locked and are inputs to this design, not open questions:**

1. **A new global sequential ID.** Tasks have **no ID today** — the numbers in conversation (46, 63)
   are *sprint-scoped priority* and are **not unique across sprints** (Sprint 1 and Sprint 2 each have
   a 46). This design introduces a permanent project-wide ID plus a registry.
2. **All 89 briefs migrate in one pass** — 12 backlog, 66 done, 11 cancelled. No dual-format period.
3. **Wiki-vault links are repaired by a separate `fkit-wiki` task**, because only that role may write
   `ai-agents/wiki-vault/`.

**Measured blast radius (2026-07-19):**

| Surface | Count |
|---|---|
| Briefs to migrate | 89 (12 backlog · 66 done · 11 cancelled) |
| Product source files constructing/parsing task paths | 13 under `claude/` |
| Inbound refs — `ai-agents/sprints/` | ~94 |
| Inbound refs — `ai-agents/wiki-vault/` | ~96 |
| Inbound refs — `ai-agents/knowledge-base/` | ~59 |
| Inbound refs — `ai-agents/reviews/` | ~40 |
| Inbound refs — `ai-agents/tasks/` (brief↔brief) | ~11 |

The 13 product files: `fkit-claude-init.sh`, `agents/fkit-coder.md`, `agents/fkit-producer.md`, and the
skills `fkit-initiate-project`, `fkit-plan-task`, `fkit-status` (SKILL.md **and** `dashboard.sh`),
`fkit-task-brief`, `fkit-task-done`, `fkit-task-cancelled`, `fkit-task-ship-loop`, `fkit-wiki-ingest`,
`fkit-wiki-sync`.

**Conflicts this design must resolve, not plan around:**

- **Task 64** (`implement-spawned-invocation-for-task-movers.md`) rewrites **the same two mover
  skills** this change rewrites. Two tasks editing `fkit-task-done` and `fkit-task-cancelled` will
  collide. The design must state the ordering.
- **Six wiki-syncs are queued** (45, 51, 66, 69, 71, 73) whose subject matter is task-board mechanics.
  If they run *after* the migration they document a structure that changed underneath them.
- **[ADR-027](../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
  (dual-home parity)** — `claude/scaffold/ai-agents/tasks/` ships `backlog/`, `done/`, `cancelled/`
  with `.gitkeep`s. The scaffold must land the same structure or parity breaks on the next check.
- **`ai-agents/reviews/<task-id>.md`** already uses a "task-id" naming convention that is really the
  **slug**. Folding reviews into the task folder either supersedes that convention or duplicates it.

## What to build

A design spec in `ai-agents/knowledge-base/reports/`, plus an **ADR** recording the structure as a
locked decision. The spec must settle, at minimum:

- **The ID format and its allocation rule** — width, prefix, zero-padding, and what guarantees
  uniqueness. **An ID collision is permanent and unrecoverable**, so the rule matters more than the
  format.
- **The registry** — its path, its shape, whether it is generated or hand-maintained, and how a new
  brief obtains the next ID without racing another session.
- **How IDs are assigned to the 89 existing tasks** — the ordering rule (chronological? board then
  alphabetical?) and whether closed tasks are numbered at all.
- **The folder layout** — the exact filename of the brief inside the folder, which artifact filenames
  are reserved, and what happens to a folder with only a brief in it.
- **Whether `## ID` becomes a brief field**, or the folder name is the sole carrier.
- **How `dashboard.sh` and both movers locate a brief** under the new layout — today they follow the
  sprint row's href to a file. State the new contract precisely; this is the part that silently breaks.
- **Whether `ai-agents/reviews/` is absorbed** into task folders or stays put, and the consequence for
  the stateful-review skills.
- **The `.gitkeep` question** — an empty task folder is not representable in git the way an empty
  directory is; say what the scaffold ships.
- **The sequencing ruling** against task 64 and the six pending wiki-syncs.
- **The rollback story** — 89 `git mv`s plus ~300 link rewrites is the largest single structural change
  in the project's history. State how it is undone if it goes wrong.

## Verification steps

- A design spec exists under `ai-agents/knowledge-base/reports/` and an ADR under
  `ai-agents/knowledge-base/decisions/`, both linked from this brief's row on the sprint board.
- The spec answers **every** bullet in "What to build" — a reader can tell, for each one, what was
  decided and why.
- The ID allocation rule is stated precisely enough that two people applying it to the same 89 tasks
  produce **identical** IDs.
- The spec names the ordering against **task 64** and against the six queued wiki-syncs explicitly.
- The spec states the scaffold change required by ADR-027 parity.
- The rollback procedure is written down and does not depend on an uncommitted working tree.

## Notes

- **Owner: fkit-architect.** An adversarial pass is recommended before the design is approved — this
  change is irreversible in practice once 89 files have moved and ~300 links have been rewritten.
- **Depends on: nothing.** This is the investigation-first gate.
- **Blocks: tasks 75, 76, 77, 78** — no implementation starts until this design is approved by the
  owner and the ADR is recorded.
- The three owner rulings in `## Context` are **decided, not open** — the design implements them, it
  does not re-litigate them. If the architect believes a ruling is technically unworkable, that comes
  back to the owner as a finding rather than a silent substitution.
- **Open question deliberately left to this design:** whether the `## Priority` field survives at all
  once a stable ID exists, or whether priority stays purely a board concern. Not pre-judged here.
