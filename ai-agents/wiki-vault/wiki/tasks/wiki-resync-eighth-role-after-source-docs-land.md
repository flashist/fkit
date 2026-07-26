# Wiki resync for the eighth role — after the source docs land

**Source**: `ai-agents/tasks/done/0092-wiki-resync-eighth-role-after-source-docs-land/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · ID 0092 · priority 84 · owner `fkit-wiki`

## Goal

Reconcile the vault against the *corrected* source docs once tasks 82, 83 and 81-D landed — not, as originally requested, to fix a vault that asserted the wrong role count.

## Key Changes

**The brief's own premise was wrong, and the brief says so first.** It was requested as *"the vault asserts seven roles while the docs assert eight — resync it."* Checked before scoping: **the vault was already correct**, and had been since the 2026-07-19 sync — `index.md` read *"seven roles built, an eighth authorized"*, and [[systems/fkit]] carried a full ⚠️ callout with *"Seven is the tree; eight is the plan."*

**Where the false premise came from is the durable lesson.** [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] named those vault pages as stale and *"not the architect's to fix"* — **true when ADR-028 was written**; the wiki synced afterwards and fixed them. The ADR was read as a live status board rather than a dated record. Two of the three handed-over line numbers were also wrong.

> **A decision record tells you what was true when it was decided; only the artifact tells you what is true now.** Logged as a **new sub-variant** of the `evidence-before-assertion` failure class — the fifth instance in one day, and the first where the stale source was *an ADR used as current state*.

**The real work was the mirror image:** [[systems/fkit]] carried a live *tracking* claim — *"`PROJECT.md:8`, `architecture.md:4,:82` and a launcher literal still assert seven and are now false."* That sentence was accurate then and **became false the moment tasks 82/83/81-D landed**. A stale claim in the vault propagates into every agent that grounds itself there.

## Outcome

**Done.** Discharged in substance by the 2026-07-22 sync, which corrected the tracking note once the source docs landed; the brief was later closed on the board. Its verification contract — count `claude/agents/*.md` on the run rather than copying the previous number, and never let a well-meaning count update flatten *"decided, not built"* into *"eight roles"* — is now standing practice in the vault. **Re-verified this sync (2026-07-26): `claude/agents/` still holds seven files.**

## Related
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]]
- [[tasks/refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role]] · [[tasks/amend-project-brief-for-the-eighth-role]] · [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — the three dependencies
- [[tasks/teach-dashboard-to-resolve-notes-dependencies]] — **this brief's dependency line is the fixture** for that task: its decorated `- **⚠️ Depends on…**` form was unparseable and misreported as `ready` for seven status runs
- [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] — the sibling "the board can't see the record" defect
- [[systems/fkit]]
