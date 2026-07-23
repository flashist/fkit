# Wiki ingest — ADR-031/032, the design report, and the evolved lead role

## ID
0117

## Sprint
Sprint 2

## Priority
99

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

The wiki vault must ingest the lead-conductor change so its synthesized knowledge stays current. From
the approved design
[`2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../../../knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
§11 (T8). Only the `fkit-wiki` agent may write `ai-agents/wiki-vault/` — this brief tasks that role;
the producer/architect never write the vault.

## What to build

Via `/fkit-wiki-ingest` (or `/fkit-wiki-sync`), update `ai-agents/wiki-vault/`:

- **Ingest [ADR-031](../../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
  and [ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md).**
  ⚠️ **ADR-032 is amended by [ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)**
  (2026-07-23 — the orchestrator now **spawns the producer to close**, it does not close directly).
  Ingest the **amended** ADR-032, not its as-first-written close posture. ADR-033 itself and the
  ADR-025-reversal vault pages are owned by **task 0126** (do not duplicate that scope here).
- **Ingest the design report**
  (`ai-agents/knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`).
- **Update the lead-role description in `wiki/systems/fkit.md`** to the evolved conductor nature (and
  the new `fkit-sprint-ship-loop` skill), keeping the role count accurate (seven live; eighth still
  decided-not-built).

## Verification steps

1. ADR-031 and ADR-032 are represented in the vault (decision pages / index).
2. The design report is ingested.
3. `wiki/systems/fkit.md` describes lead as the conductor and lists the `fkit-sprint-ship-loop` skill;
   role count unchanged.
4. `/fkit-wiki-lint` is clean (no broken links / template drift introduced).

## Notes

- **Owner:** fkit-wiki (exclusive vault write authority).
- **Depends on:** T1 (ADR-031/032 — Done) and 0110 (evolved lead). Design §11: `T8` depends on T1 + T2.
- **Recommended sequencing:** run **after** the doc tasks 0114 (PROJECT.md) and 0115 (architecture.md)
  land, so the vault ingests the final source-doc state rather than mid-flight drift — the established
  "wiki sync genuinely last" precedent (sprint-2 tasks 78/84). Not a hard dependency in the design, but
  the wiser order.
- No commit — leave the vault edits in the working tree.
