# Wiki sync after the task-folder migration

## ID
0099

## Sprint
Sprint 2

## Priority
78

## Status
✅ Done

## Context

The task-folder migration ([task 76](../0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md)) changes
the path shape of **every** task brief — derive how many with
`ls ai-agents/tasks/{backlog,done,cancelled}/*.md | wc -l` rather than trusting a figure written down
anywhere. `ai-agents/wiki-vault/` holds roughly **96 references** (2026-07-19 snapshot — re-measure) to
the old `ai-agents/tasks/<board>/<slug>.md` form — the single largest concentration of task links anywhere
in the project, larger than the sprint boards.

**Only the `fkit-wiki` role may write `ai-agents/wiki-vault/`.** That is why this is its own task
rather than part of task 77: the coder repairing those links would violate the vault's write-authority
boundary. This is a hard rule, not a preference.

This is also **more than a link repair**. The vault carries synthesized pages describing how tasks are
organized — the board mechanics, the lifecycle, the mover procedures. Those pages become factually
wrong at the moment task 76 lands, not merely stale in their hrefs.

## What to build

- **Every vault reference to a task brief re-pointed** to its post-migration path, with correct
  relative depth.
- **Every vault page whose *content* describes the one-file-per-task structure updated** to describe
  the folder structure — the task lifecycle, the board mechanics, and the mover procedures.
- **The new concepts ingested**: the global task ID, the `## ID` brief field, and the folder layout,
  from task 74's design spec and ADR-029. **There is no ID registry** — the owner ruled against a stored
  registry file (design spec §3.6); authority is the folder name plus the brief's `## ID`. Do not
  describe a registry in the vault.
- **The three absorbed directories re-described.** `ai-agents/plans/`, `ai-agents/worklogs/` and
  `ai-agents/reviews/` no longer exist; their contents are `plan.md`, `worklog.md` and `review.md`
  inside the task folder. Any vault page describing those directories, the review-ledger key, or ADR-020's
  separate-directory arrangement is now **wrong**, not stale.
- **The six batched syncs' subject matter** (below) written in the same pass.

## Verification steps

- A sweep of `ai-agents/wiki-vault/` for `tasks/(backlog|done|cancelled)/[a-z0-9-]+\.md` returns
  nothing, or only entries a lint pass confirms are intentional historical citations.
- Every relative link in the touched vault pages resolves — checked against each file's own directory,
  not by filename alone.
- No vault page still describes a task as a single `.md` file.
- The global task ID and the folder layout are findable in the vault: a `/fkit-query` for "task ID"
  returns the new structure, not silence.
- **No vault page describes an ID registry file** — it was ruled out and never built.
- No vault page still describes `ai-agents/plans/`, `ai-agents/worklogs/` or `ai-agents/reviews/` as
  live directories.
- The six batched syncs' subjects are each present in the vault — checked one by one, by name, not
  assumed covered.
- `/fkit-wiki-lint` runs clean over the vault, or its remaining findings are listed and explained.

## Notes

- **⚠️ Scope reduced 2026-07-19 — the ADR-029/ADR-030 link repair is NOT this task's work.** Ten vault
  pages linking the renumbered `adr-029-stop-hook-…` slug were **pulled forward into
  [task 80](../0078-repair-stale-adr-029-stop-hook-links-in-the-vault/brief.md)** by owner ruling, because the stale
  links fail silently and this task waits out the whole migration (tasks 75 and 76). **Do not repeat
  that repair here.** If `grep -rn "adr-029-stop-hook" ai-agents/wiki-vault/` still returns hits when
  this task runs, task 80 did not finish — say so rather than quietly absorbing it.
- **Owner: fkit-wiki** — the exclusive write gateway for `ai-agents/wiki-vault/`.
- **Depends on: task 76 — hard.**
- **Runs in parallel with task 77** — disjoint file sets, different write authorities.
- **⚠️ Owner ruled 2026-07-19: the six queued wiki-syncs (45, 51, 66, 69, 71, 73) wait for task 76 and
  batch into THIS task's run.** Design spec §9.2. **This reverses the recommendation previously recorded
  here** — an earlier version of this brief advised running those six *before* task 76. It was wrong:
  running them first makes the wiki role write those pages twice, and the vault would carry a
  *verified-knowledge* description of a structure about to change. Sprint 2's own task 11 taught this.
  **This task therefore absorbs their scope: its run must cover all six subjects as well as the
  structural re-description.** The accepted tradeoff is that the vault stays stale on six landed changes
  for the whole migration window — staleness is *missing recent features*, not *actively wrong*.
