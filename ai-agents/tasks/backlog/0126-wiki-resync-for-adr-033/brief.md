# Wiki resync for ADR-033 — ingest the ADR and resync vault pages asserting the ADR-025 "any role may close" rule

## ID
0126

## Sprint
Sprint 2

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

[ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
reverses ADR-025: the task movers are producer-only again. Its §"Wiki" directs **fkit-wiki** to ingest
the ADR and resync any vault page that still asserts the ADR-025 *"any role may close"* rule — an
architect (or anyone else) never writes the vault, so the resync is this role's alone.

The vault currently carries ADR-025's posture as verified knowledge (e.g. wherever it describes who may
run the movers). Left unsynced, the vault would contradict the live, reverted behavior.

## What to build

Via `/fkit-wiki-ingest` (or `/fkit-wiki-sync`), update `ai-agents/wiki-vault/`:

- **Ingest ADR-033** so the decision is represented in the vault (decision pages / index).
- **Resync every vault page asserting the ADR-025 "any role but the adversarial reviewer may run the
  movers" rule** to the ADR-033 reality: **producer-only** movers; every other role (wiki, coder,
  reviewer, architect, lead) routes closes through the producer. Note ADR-025's grant is now reversed.
- Reflect the coupled consequences already in the vault where relevant: the coder ship-loop no longer
  self-closes (routes to the producer), and the orchestrator spawns the producer to close.

## Verification steps

1. ADR-033 is represented in the vault (decision page / index).
2. No vault page still asserts the ADR-025 "any role may close/run the movers" rule as current; each now
   describes producer-only movers with closes routed through the producer.
3. `/fkit-wiki-lint` is clean (no broken links / template drift introduced).

## Notes

- **Owner:** fkit-wiki (exclusive vault write authority).
- **Depends on:** 0124.
- **Why:** resync only after the mover-authority revert lands, so the vault ingests the final reverted
  state, not mid-flight drift — the "wiki sync genuinely last" precedent.
- **Scope boundary vs 0117:** 0117 ingests the lead-conductor arc (ADR-031/032 + design report).
  ADR-032 is *amended* by ADR-033 — 0117 must ingest the amended ADR-032 (cross-noted there); **this**
  task owns ADR-033 itself and the ADR-025-reversal pages, to avoid overlap.
- No commit — leave the vault edits in the working tree.
