# Refresh architecture.md for the lead conductor + fix the stale §5.2 lock description

## ID
0115

## Sprint
Sprint 2

## Priority
97

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

Two architecture.md fixes bundled because they touch the same file and the same subject (the lead
role and the lock mechanism). From the approved design
[`2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../../../knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
§1.1 (the stale-lock correction), §9.5 (doc-drift), and §11 (T6 architect half + the §5.2 fix folded
in).

**(a) Lead's role/nature.** ADR-031 makes lead the conductor; the architecture doc's lead role
description and skill row must reflect it (nature changed, count unchanged — still seven, ADR-028).

**(b) The independent stale-lock fix (design §1.1 — do not skip).** `architecture.md:184-228` (§5.2)
still describes the role lock as a `skillOverrides` "off" list plus a `CONSULT_SKILLS` exception —
the **pre-ADR-018 mechanism, retired**. The live lock is a `PreToolUse` skill-ownership hook
(`fkit-claude.sh:257-265`, `build_settings()`) keyed on the real invoking agent's `agent_type` at any
spawn depth (`skill-ownership-hook.sh:110-136`). This stale description is the exact fact that decided
the feasibility answer, so correcting it is not cosmetic. **Fold this fix into this task.**

## What to build

Edit `ai-agents/knowledge-base/architecture.md` (confirm live line numbers before editing):

1. **Lead role/skill description** — describe lead as the orchestrating conductor (spawns/drives
   roles, holds the owner channel, relays owner decisions live) while retaining routing; reflect the
   new `fkit-sprint-ship-loop` skill on lead's row. **Do not change the role count** (seven live;
   eighth decided-not-built).
2. **§5.2 stale-lock fix** — replace the `skillOverrides`/`CONSULT_SKILLS` description with the live
   ADR-018 `PreToolUse` skill-ownership hook mechanism (keyed on the real caller's `agent_type` at any
   spawn depth). Cite ADR-018.

## Verification steps

1. architecture.md describes lead as the conductor with the `fkit-sprint-ship-loop` skill; no "router
   / does no work itself" framing remains for lead.
2. §5.2 no longer describes `skillOverrides`/`CONSULT_SKILLS`; it describes the ADR-018 `PreToolUse`
   skill-ownership hook, correctly keyed on the invoking agent's `agent_type`.
3. Role count unchanged (seven live; eighth still decided-not-built).
4. No source-code change (docs only).

## Notes

- **Owner:** fkit-architect (architecture.md is the architect's document; the product brief half is
  0114, owner fkit-producer).
- **Depends on:** 0110 (evolved lead) and 0112 (wiring). Design §11: `T6` depends on T2 + T4.
- **⚠️ Coordinate with 0112 on architecture.md** — 0112 updates the `skills_for_role` *mirror row* for
  lead in the same file; this task updates the lead *prose* + §5.2. 0115 runs after 0112 (dependency
  above), so land on top of 0112's mirror edit without reverting it.
- **The §5.2 stale-lock fix is independent of the lead change** but folded here per design §9.5 —
  do not drop it.
- No commit — leave the edit in the working tree.
