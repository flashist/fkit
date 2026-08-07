# Wiki ingest of the structure-check design report and the companion ADR

## ID
0249

## Sprint
Sprint 4

## Priority
Sprint 4 P8

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-wiki

## Context

**Implementation unit 7 of the `0241` design (wiki half)** — report
[`2026-08-06-design-post-update-structure-check.md`](../../../knowledge-base/reports/2026-08-06-design-post-update-structure-check.md)
§11: *"fkit-wiki ingests this report and the ADR."* Filed as part of the owner-authorized `0241`
follow-up batch (all six design questions ruled via `AskUserQuestion`, live `fkit lead` session,
**2026-08-06**).

**Why this is its own brief and not a step of
[`0248`](../0248-update-the-docs-for-the-structure-check-capability/brief.md):** §11's unit 7 bundles
docs and ingest, but
[ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)
makes the vault write **`fkit-wiki`'s exclusively** while the docs are coder work — a brief carries
one `## Owner`, so the halves split. `0248` records the same cause on its side. Precedent: the
existing wiki-resync rows `0238`/`0239` are separate `fkit-wiki` tasks for the same reason.

The report itself closes with the routing: *"If it should live in the wiki, fkit-wiki ingests it —
this role does not write the vault."*

## What to build

Via `/fkit-wiki-ingest`, run by `fkit-wiki`:

1. **Ingest the design report** —
   `ai-agents/knowledge-base/reports/2026-08-06-design-post-update-structure-check.md` — so the
   vault carries the capability's design: the spec/manifest hybrid, the consent model, the trigger,
   the v1 scope, and the six owner rulings of 2026-08-06 with their verbatim wording.
2. **Ingest the `0242` companion ADR** once it exists on disk — the licence, and its relationship to
   ADR-015 (invariant unchanged for the unattended path). If ADR-015's vault page exists, it gains
   the cross-reference; do not let the vault present ADR-015 as the last word on content drift once
   the companion ADR is recorded.
3. Follow the wiki skill's own linking/backlink and `log.md` conventions — they, not this brief,
   govern page shape.

### ⛔ Out of scope

- ⛔ Any edit outside `ai-agents/wiki-vault/`.
- ⛔ Ingesting the implementation units' outcomes (`0243`–`0247`) — those land via the normal
  post-ship syncs once they exist; this task covers the report + ADR pair.
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. The vault carries a page (or updated pages) for the structure-check design, citing the report by
   path, with the six rulings dated 2026-08-06 and the channel named.
2. The `0242` ADR has a vault decisions page; ADR-015's page (if present) points at it.
3. `ai-agents/wiki-vault/log.md` carries the dated ingest entry per the wiki skill's convention.
4. `git status --porcelain` shows changes under `ai-agents/wiki-vault/` only.

## Notes

- **Depends on:** `0242` — the ADR must exist on disk to be ingested (the report exists today).
- **Blocks:** nothing.
- **Best run after `0248`** so one pass sees the settled docs too — an ordering preference, not a
  dependency.
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board — no sprint named by the owner;
  no re-rank (ADR-035).
