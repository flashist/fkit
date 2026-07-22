# Repair the knowledge-base path references in product source (ADR-013 fallout)

## ID
0077

## Sprint
Sprint 2

## Priority
19

## Status
✅ Done

## Owner
fkit-coder

## Context

[ADR-013](../../../knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md)
restructured `ai-agents/knowledge-base/`: the root now holds **only** `PROJECT.md` and
`architecture.md`, and everything else is filed by kind into `decisions/`, `conventions/`,
`incidents/`, `reports/`, `history/`. Task 9 executed the folder side of that — including moving the
two standing conventions into `conventions/`.

**Product source under `claude/` still points at the old paths, and two shipped skills are broken by
it right now.** They will silently mis-behave rather than fail loudly: a skill that cannot find its
contract document falls back to its own inline copy, which is the drift this sprint has spent itself
removing.

This is not a cleanup task. **Until it lands, the ADR-013 move is a regression** — it is the
half-landed-change failure mode, the same one that left the installed launcher saying "Six roles"
while the docs said seven.

## What to build

**A. Unbreak the two shipped skills** *(both point at files that no longer exist)*

| File:line | Change |
|---|---|
| `claude/skills/fkit-status/SKILL.md:34-35` | both paths → `ai-agents/knowledge-base/conventions/status-report-format.md` and `.../conventions/task-status-vocabulary.md` |
| `claude/skills/fkit-task-plan/SKILL.md:94` | → `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` |

**B. Bring two skills into ADR-013 compliance** *(they write new files to the now-illegal root)*

| File:line | Change |
|---|---|
| `claude/skills/fkit-evaluate-approach/SKILL.md:62` | writes `knowledge-base/eval-<topic-slug>.md` → must write `knowledge-base/reports/YYYY-MM-DD-eval-<topic-slug>.md` |
| `claude/skills/fkit-design-spec/SKILL.md:44` | writes `knowledge-base/design-<feature-slug>.md` → must write `knowledge-base/reports/YYYY-MM-DD-design-<feature-slug>.md` |

**These two are the highest-value items in the task.** Every other fix here repairs damage already
done; these two stop the damage *regenerating*. Left as-is, the very next evaluation or design spec
drops an undated file at the root and re-breaks the rule on the day it was made.

> **Owner decision (2026-07-13):** design specs route to `reports/`, not to a new folder.
> `reports/` already holds *plans*, and a design spec is a plan for a chunk of work. A separate
> `specs/` folder would split plans across two homes and put a seam in the routing test exactly where
> it is hardest to judge. This is interpretation within ADR-013 — **not a new decision, and not open
> for re-litigation.**

**C. The scaffold ships the conventions** *(owner decision, 2026-07-13)*

Today a fresh fkit project gets **no `conventions/` folder and no `task-status-vocabulary.md`** — the
scaffold's `ai-agents/README.md` *inlines* the vocabulary instead (`:14-49`). So `/fkit-status`'s
contract (*"read the project's convention and defer to it — it is the project's law"*) has nothing to
read in a new project. **The owner has ruled: ship them.**

- `claude/scaffold/ai-agents/knowledge-base/conventions/` ships `status-report-format.md` and
  `task-status-vocabulary.md`.
- `claude/scaffold/ai-agents/README.md` **stops duplicating the vocabulary** (`:14-49`) and points at
  the shipped convention instead. Two copies of the same law is precisely the drift this sprint
  removed everywhere else — do not leave a second copy behind.
- `claude/scaffold/ai-agents/README.md:11` names the five KB subfolders.

**D. Re-run init**

`claude/fkit-claude-init.sh .` — this repo's own `.claude/agents/` and `.claude/skills/` are
gitignored copies regenerated from `claude/`. **Until it is re-run, this session's own `/fkit-status`
still carries the broken paths.**

## Verification steps

- `grep -rn "knowledge-base/status-report-format\|knowledge-base/task-status-vocabulary" claude/`
  returns **nothing** — every surviving reference names `conventions/`.
- `grep -rn "knowledge-base/eval-\|knowledge-base/design-" claude/` returns **nothing**.
- Every path named in any `claude/` skill or agent **resolves to a file that exists**. A skill whose
  contract document is missing must not be able to fall back silently — check this by following each
  path, not by reading the diff.
- Scaffold a **fresh** project into a scratch dir and confirm `ai-agents/knowledge-base/conventions/`
  arrives with both files, and that `ai-agents/README.md` no longer carries a second copy of the
  vocabulary.
- In a producer session, `/fkit-status` reads the convention **from `conventions/`** and defers to it.
- ADR-013's acceptance test still holds in this repo: `ls ai-agents/knowledge-base/*.md` returns
  exactly `PROJECT.md` and `architecture.md`. *(Task 10 is what makes this true; if it has not landed
  yet, this check belongs to it, not here.)*

## Notes

- **Owner: fkit-coder.** All of it is product source under `claude/` — outside the architect's and the
  producer's write authority.
- **Depends on:** task 9 (the folders and ADR-013 must exist first). **Independent of task 10** — task
  10 moves the *reports*; this task fixes the *conventions* paths and the skills. They touch different
  files and can land in either order.
- **Do not settle anything new here.** Both product decisions in scope (design specs → `reports/`; the
  scaffold ships the conventions) are already made above. If a third question surfaces, report it —
  do not decide it in passing.
- Inventory by fkit-architect (2026-07-13). It also confirmed, against an earlier producer assumption,
  that `claude/agents/fkit-producer.md`, `claude/skills/fkit-task-done/SKILL.md` and
  `claude/skills/fkit-task-cancelled/SKILL.md` reference `ai-agents/README.md` rather than the KB
  paths — **they are not broken and need no change.**
- Risk: **low-to-moderate.** Mechanical path edits, but one of them (`fkit-status`) is the contract of
  a skill the producer runs constantly, and the scaffold change ships to every new project.
