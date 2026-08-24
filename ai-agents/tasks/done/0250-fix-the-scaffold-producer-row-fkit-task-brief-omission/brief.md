# Fix the scaffold producer-row mirror omission — add `/fkit-task-brief` + regenerate the manifest

## ID
0250

## Sprint
Sprint 6

## Priority
Sprint 6 P9

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Pre-existing defect surfaced as finding R10 of the `0245` stateful review**
([review ledger](../../done/0245-build-the-producer-owned-structure-check-skill/review.md), R10:
`claude/scaffold/CLAUDE.md:23`, verified pre-existing vs HEAD — it predates `0245`, which edited the
same line to add `/fkit-heal` but correctly did not widen its scope to fix it). Owner ruling relayed
2026-08-07 (`AskUserQuestion`, live `fkit lead` session, verbatim **"File as own task
(Recommended)"**).

The producer's skill set is declared canonically in `skills_for_role()`
(`claude/skills-for-role.sh`) and mirrored in the four human checklist mirrors. Verified on disk
2026-08-07: `claude/skills-for-role.sh:51`, `claude/README.md:47` (short-form `task-brief`),
`ai-agents/knowledge-base/architecture.md`, and `claude/skills/fkit-team/SKILL.md` all carry
`/fkit-task-brief` — **only the scaffold's producer row omits it**, so every consuming project
scaffolded from it ships a false role table (the same stale-mirror class the wiki records against
prior mirror drift).

**Why the manifest regen is in-scope and inseparable:** `claude/scaffold/CLAUDE.md` is a
manifest-hashed file. Any content edit without regenerating `claude/structure-manifest.tsv`
(`npm run generate:manifest`, the `0244` generator) turns `test/structure-manifest.test.js` red —
the two edits cannot ship separately, which is why this is one task, not two.

## What to build

1. **One mirror-line edit:** add `/fkit-task-brief` to the producer row of the role table in
   `claude/scaffold/CLAUDE.md` (line ~23), in the same list position/format the canonical
   `skills_for_role()` order implies (between `/fkit-initiate-project` and `/fkit-task-done`,
   matching the source-of-truth ordering).
2. **Regenerate `claude/structure-manifest.tsv`** via `npm run generate:manifest` in the same
   change.

### ⛔ Out of scope

- ⛔ Any other content change to `claude/scaffold/CLAUDE.md` — this is the R10 line only.
- ⛔ Edits to the other three mirrors or `skills_for_role()` — verified correct on disk; nothing to
  change there.
- ⛔ No commit, no wiki-vault write.

## Verification steps

1. `grep` the producer row of `claude/scaffold/CLAUDE.md`: it lists `/fkit-task-brief`; `git diff`
   shows exactly one content line changed in that file.
2. All five carriers now agree on the producer's skill set: `claude/skills-for-role.sh`,
   `claude/README.md`, `ai-agents/knowledge-base/architecture.md`,
   `claude/skills/fkit-team/SKILL.md`, `claude/scaffold/CLAUDE.md`.
3. `npm test` is green — in particular `test/structure-manifest.test.js` passes against the
   regenerated manifest (and would have failed without the regen: verifiable by running the test
   before regenerating).
4. The manifest diff touches only the row(s) for `claude/scaffold/CLAUDE.md` (plus any
   generator-appended history rows for that path) — no unrelated manifest churn.

## Notes

- **Depends on:** nothing
- **Sequencing note, not a dependency:** `0248` (structure-check docs) also plans scaffold edits;
  whichever lands second regenerates the manifest on top of the other — no conflict, but the
  coder of the second should expect a manifest diff already present.
- **Source of truth:** `0245`'s `review.md` finding R10 and its verdict row ("routed (new task)");
  the four-mirror convention is recorded in the wiki
  (`wiki/tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors`).
