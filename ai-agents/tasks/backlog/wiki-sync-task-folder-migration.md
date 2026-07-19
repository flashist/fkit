# Wiki sync after the task-folder migration

## Sprint
Sprint 2

## Priority
78

## Status
🔲 Backlog

## Context

The task-folder migration ([task 76](migrate-tasks-to-folder-structure-and-update-tooling.md)) changes
the path shape of all 89 task briefs. `ai-agents/wiki-vault/` holds roughly **96 references** to the
old `ai-agents/tasks/<board>/<slug>.md` form — the single largest concentration of task links anywhere
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
- **The new concepts ingested**: the global task ID, the ID registry, and the folder layout, from
  task 74's design spec and ADR.

## Verification steps

- A sweep of `ai-agents/wiki-vault/` for `tasks/(backlog|done|cancelled)/[a-z0-9-]+\.md` returns
  nothing, or only entries a lint pass confirms are intentional historical citations.
- Every relative link in the touched vault pages resolves — checked against each file's own directory,
  not by filename alone.
- No vault page still describes a task as a single `.md` file.
- The global task ID and the registry are findable in the vault: a `/fkit-query` for "task ID" returns
  the new structure, not silence.
- `/fkit-wiki-lint` runs clean over the vault, or its remaining findings are listed and explained.

## Notes

- **Owner: fkit-wiki** — the exclusive write gateway for `ai-agents/wiki-vault/`.
- **Depends on: task 76 — hard.**
- **Runs in parallel with task 77** — disjoint file sets, different write authorities.
- **Sequencing flag for the owner:** six wiki-syncs are already queued (45, 51, 66, 69, 71, 73), all
  unblocked and all concerning task-board mechanics. If they run **after** task 76 they will document a
  structure that changed underneath them. **The producer's recommendation is to run those six before
  task 76 lands**, leaving this task as a clean delta rather than a rewrite of six freshly-written
  pages. That ordering is the owner's call and is recorded in task 74's design.
- **This is not batchable with those six** — they are content syncs against unchanged structure; this
  one re-describes the structure itself.
