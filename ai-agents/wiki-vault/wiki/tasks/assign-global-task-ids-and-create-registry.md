# Assign a global task ID to every brief and write down the allocation procedure

**Source**: `ai-agents/tasks/done/assign-global-task-ids-and-create-registry.md`
**Status**: done — ⚠️ **`(agent-closed — not owner-verified)`**
**Sprint/Tag**: Sprint 2 · ID **0017** · priority 75 · owner fkit-coder

## Goal
Stamp an `## ID` field onto every brief and record the allocation procedure — **without moving a single file.**

**That separation is the point of the task.** ID assignment is the one part of the folder migration that is **permanent and unrecoverable if wrong** — a collision or a reused number cannot be cleanly undone once links point at it — while the file moves are mechanical and reversible. Shipping IDs first makes them reviewable on their own, against an unchanged tree.

**Rescoped mid-flight:** the brief's title and scope named a **registry file**; the owner ruled against one ([[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] Decision 8), so **none was created**. *(The filename still says `-and-create-registry`; left alone so inbound links keep resolving — task 76 renames it.)*

## Key Changes
**The corpus is pinned to a commit SHA, and that pin is the task's central safeguard.** The brief states the failure plainly: the corpus went 89 → 94 → 95 in days, *"twice while a brief describing it was being written."* Derive the assignment at whatever moment the work runs and **two people applying the same rule get different IDs** — failing the exact bar the design was built to meet, and failing it **silently**.

- **Pin:** `e62b4f5` (2026-07-19), recorded **before** any ID was assigned, working tree clean.
- **Measured at the pin:** 100 briefs, all 100 slugs unique — so the `LC_ALL=C` sort is a total order with no tie-break case.
- **Counting stays live; only the *assignment* is pinned.**

⚠️ **A shipped-tool trap was found and documented — worth reading before reusing any snippet from a spec.** Task 74's design §3.4 printed a derivation command using `\|` alternation inside a **basic** regex. **BSD sed — what macOS ships and what this project is developed on — does not support it: the command matches nothing and exits 0**, so the pipeline returns an empty corpus and the task looks like it ran against an empty repo rather than a broken command. **GNU sed accepts it, so the bug is invisible on Linux.** Verified at the pin: the old form returned **0** rows where the corrected form returns **100**. The brief adds the guard rule: *"an empty result means a broken command, not an empty corpus — if the count is not 100, stop."*

## Outcome
Done. **Independently re-verified by the wiki on 2026-07-20 rather than taken from the brief:**

- **101 briefs, 101 carrying `## ID`** — every brief has exactly one.
- **Zero duplicate IDs.**
- **The backfill reproduces exactly.** Re-deriving the assignment from the rule against the pinned SHA and joining it to the stamped IDs yields **0 mismatches across all 100 pinned briefs** — `0001 add-backlog-board-default-for-unsprinted-task-briefs` … `0100 wiki-sync-task-plan-rename`.
- **The post-pin rule held under its first real test.** Exactly one brief was created after the pin (`assert-task-ids-are-unique-in-the-test-suite`); it correctly took `1 + max` = **0101**, and **no brief in the pinned set was renumbered** — the permanent, unrecoverable failure the pin exists to prevent did not occur.

**Two carriers now exist by design** — the `## ID` field and (post-migration) the folder name — reconciled by a planned `id-mismatch` drift check. **The mechanical duplicate-ID guard is not built**: it is task 85, and the owner ruled 2026-07-20 that it **must land before task 76** despite its append-rank priority.

## Related
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the scheme this implements; Decision 4 (the SHA pin) and Decision 8 (no registry)
- [[tasks/design-task-folder-structure-and-id-scheme]] — task 74, the design this depends on hard
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the artifact dirs the ID keys together
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — `dashboard.sh`, which gains the `id-mismatch` drift kind and whose `## Status` parsing this task had to leave undisturbed
- [[decisions/adr-014-how-fkit-tests-itself]] — where the duplicate-ID assertion must fit
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]] · [[systems/knowledge-base-structure]]
