# Assert task IDs are unique in the test suite — the ADR-029 duplicate-ID guard

**Source**: `ai-agents/tasks/done/0101-assert-task-ids-are-unique-in-the-test-suite/brief.md`
**Status**: done — ⚠️ **`(agent-closed — not owner-verified)`**
**Sprint/Tag**: Sprint 2 · ID **0101** · priority 85 — **but ran BEFORE task 76** · owner fkit-coder

## Goal
Build the **one mitigation** [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] Decision 3 named and never shipped. The cross-branch ID race is *detected, not prevented*: two branches can each read `max=0100`, each allocate `0101`, and **merge cleanly** — different folder names, no textual conflict, git catches nothing. The ADR's answer, verbatim: *"detection: a duplicate-ID assertion in the `node --test` suite."*

**It existed nowhere.** Task 75 stamped 100 IDs and documented the allocation procedure but added no test; **101 IDs were live with no automated uniqueness guard.** The stateful review of task 75 caught this as finding **R3** and deferred it here.

## Key Changes
- A `node --test` assertion over the whole corpus: every task's ID appears exactly once. Fits [[decisions/adr-014-how-fkit-tests-itself]]'s constraints (zero devDeps, hard-coded oracle).
- **R3 is not a re-raise of the accepted residual** — the ledger records "detect, don't prevent" as settled; this builds the agreed mitigation. It must **not** reopen lock files, reservation protocols, content-derived IDs, or a registry — all four rejected on the record.
- **Discovers briefs in BOTH shapes** — flat `<board>/<slug>.md` and folder `<board>/<NNNN>-<slug>/brief.md` — deliberately, so the migration (task 76) could not silently disable it. **A uniqueness check over zero discovered briefs passes green while guarding nothing.**

## Outcome
Done, agent-closed. **Owner-ruled to land BEFORE task 76** despite its append-rank priority of 85 — its value is entirely **pre-merge**: task 76 is exactly the long-lived branch the accepted race needs, and a collision caught before the merge costs a rename while one caught after means renumbering an ID things already link to (the permanent unrecoverable failure).

## Related
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — Decision 3's accepted race and its named mitigation, built here
- [[decisions/adr-014-how-fkit-tests-itself]] — the suite this assertion joins
- [[tasks/assign-global-task-ids-and-create-registry]] — task 75, where R3 was raised and deferred here
- [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]] — task 76, the merge this guards, gated to wait for this
- [[systems/testing-and-verification]] · [[tasks/sprint-2-remove-omnigent]]
