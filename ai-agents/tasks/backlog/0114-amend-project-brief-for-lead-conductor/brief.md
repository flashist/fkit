# Amend PROJECT.md for the evolved `fkit-lead` conductor

## ID
0114

## Sprint
Sprint 2

## Priority
96

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

The product brief describes `fkit-lead` under its old router-only nature. From the approved design
[`2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../../../knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
§9.5 (doc-drift blast radius) and §11 (T6, split by owner: **producer owns the PROJECT.md half**,
architect owns the architecture.md half — that is 0115).

ADR-031 changes lead's *nature*, not the role *count* (design §3.4 C6, §11): no new role, still seven
today. The "does no work itself" / "router" framing for lead across the docs goes stale and must be
corrected. This brief is the **product-document** half only — the product brief is the producer's, not
the architect's (the same split precedent as tasks 82/83 for the eighth role).

## What to build

Update the `fkit-lead` description in `ai-agents/knowledge-base/PROJECT.md` (confirm the live line(s)
before editing):

- Describe lead as the **single-point-of-interaction conductor** that spawns and drives roles and
  relays owner decisions live, while retaining its routing remit — replacing any "router / does no
  work itself" framing.
- **Do not change the role count** — lead's nature changed, the count did not (still seven; the
  eighth role remains decided-but-not-built, ADR-028). Do not introduce a new role.
- Product-brief altitude only — leave the technical/architecture description to 0115.

## Verification steps

1. `PROJECT.md`'s lead description reflects the conductor nature + retained routing; no "does no work
   itself" framing remains for lead.
2. The role count is unchanged (seven live; eighth still decided-not-built).
3. No architecture.md / source change in this task (that is 0115 / 0112).

## Notes

- **Owner:** fkit-producer (the product brief is the producer's document).
- **Depends on:** 0110 (evolved lead) and 0112 (wiring — so the described skill actually exists).
  Design §11: `T6` depends on T2 + T4.
- **Sibling:** 0115 (architecture.md half, owner fkit-architect). Split by owner + file per design
  §11; both descend from the same T6.
- **⚠️ Needs owner sign-off on the stance wording** — reversing a deliberately-stated product stance
  ("lead does no work itself") is a stance restatement, like task 83 for the eighth role; put the
  wording to the owner.
- No commit — leave the edit in the working tree.
