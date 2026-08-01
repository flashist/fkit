# Wiki resync for ADR-033 — ingest the reversal and clear the ADR-025 posture from the vault

**Source**: `ai-agents/tasks/done/0126-wiki-resync-for-adr-033/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0126` · owner `fkit-wiki`

## Goal

Ingest [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] and resync every vault page still asserting the **ADR-025 "any role may close"** rule as current. Left unsynced, the vault would carry a reverted posture as verified knowledge.

Filed as its own task because **`ai-agents/wiki-vault/` is written by the `fkit-wiki` role and nobody else** ([[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]) — an architect who writes the ADR cannot resync the copy.

**Deliberately ordered last**, after `0124` landed the revert, so the vault ingested the final reverted state rather than mid-flight drift.

## Key Changes

Recorded in the vault's own `log.md` entry of **2026-07-29**:

- ADR-033 represented in the vault as a decision page, with the index gloss.
- Every page describing who may run the movers re-pointed to **producer-only**, with the coupled consequences: the coder's ship-loop no longer self-closes, and the orchestrator spawns a producer to close.
- Scope boundary held against two sibling wiki tasks: `0117` owned ADR-031/032 and the design report; `0148` owned the 2026-07-22 autonomy amendment. **This task owned ADR-033 and the reversal pages only.**

## Outcome

Done, **agent-closed — not owner-verified**.

⚠️ **The brief's own completeness claim was wrong, and this is the finding worth keeping.** The brief said its work was largely done. **Six stale pages remained, and a reviewer found a seventh.** The vault's `log.md` records this as the first of three consecutive instances of the same shape — *a completeness claim made by the run that would benefit from it has been wrong every time*, three for three across `0126`, [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] (`0141`) and [[tasks/wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner]] (`0148`). **In each case the claim was checkable by running one command, and nobody ran it until the task that inherited the claim did.**

The task's own review also had to correct its survivor list, a citation, and a wording — the second recurring pattern the chain recorded: **the vault's content passed every review; the record of that content kept carrying unrun commands and shifted citations.**

## Related

- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the decision ingested
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the grant it reverses
- [[tasks/revert-task-movers-to-producer-only]] — `0124`, the structural revert this follows
- [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] — `0141`, the second link in the wiki chain
- [[tasks/wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner]] — `0148`, the third
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why only this role may do it
