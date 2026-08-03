# Ingest the faithful-carry decision report into the wiki

## ID
0206

## Sprint
Sprint 2

## Priority
184

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

**Follow-up 8 of [`0162`'s decision report](../../../knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md)**
(§10 row 8).

`0162` produced a decision report at
`ai-agents/knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md`. It rules on what
*"carry the approved plan verbatim"* must mean across `/fkit-sprint-ship-loop`, and it interacts with
ADR-021, ADR-031, ADR-032 and ADR-037. That is synthesized knowledge not derivable from the code, which is
what the vault is for.

**Only `fkit-wiki` writes `ai-agents/wiki-vault/`**
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)) — so
this is a row of its own, not something folded into another task.

## What to build

Run `/fkit-wiki-ingest` against
`ai-agents/knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md`.

**Two things the ingest must preserve, because the report's value collapses without them:**

1. **The evidence separation.** The report's §0 divides its claims into **checkable** (verified firsthand
   against live files) and **testimony** (a driver's self-report, not verifiable from disk — no session
   transcripts exist in this repo). **A vault page that flattens the two has lost the report's central
   discipline.** Carry the distinction across.
2. **The accepted residual `carried-not-approved`** (§9, §11) — the hash pins which bytes were *carried*,
   not which were *approved*; it is structural, not provisional; and **follow-up 1 (`0202`) closes only the
   reconstruction route, not the class.** A vault page implying the gap is closed would be worse than no
   page.

⚠️ **Also flag, do not silently repair:** `0162`'s task folder moved to
`ai-agents/tasks/done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/` on
2026-08-02. If any existing vault page links to the old `backlog/` path, that is the wiki role's repair —
the task movers deliberately do not touch the vault (ADR-005).

## Verification steps

1. A vault page (or pages) covering the report exists, and `/fkit-query` on *"what is a faithful carry of
   an approved plan"* returns it.
2. The page carries the **checkable vs testimony** distinction explicitly.
3. The page states the **`carried-not-approved`** residual and that `0202` does **not** close it.
4. The page back-links the report and `0162`'s brief at its **current** path under `tasks/done/`.
5. Any pre-existing vault link to `0162`'s old `backlog/` path is repaired or reported.
6. `/fkit-wiki-lint` reports no new broken links or template drift introduced by this ingest.
7. Change surface is confined to `ai-agents/wiki-vault/`. No `claude/`, no `test/`, no task brief.

## Notes

- **Depends on:** nothing. The report is already on disk and its content is settled — the owner ruled all
  four of its open questions on 2026-08-02.
- **Blocks:** nothing.
- **⚠️ Priority 184 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0205`** — it records knowledge rather than changing behaviour,
  and it reads best once the corrections above it are settled. It could equally be batched with `0199`
  (ADR-010's vault resync) in a single wiki session; that is a scheduling convenience, **not** a merge —
  the two cover different sources.
- **Source:** `0162`'s decision report §10 row 8.
