# Update the docs for the structure-check capability — architecture.md, README, scaffold pointers

## ID
0248

## Sprint
Sprint 4

## Priority
Sprint 4 P7

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Implementation unit 7 of the `0241` design (docs half)** — report
[`2026-08-06-design-post-update-structure-check.md`](../../../knowledge-base/reports/2026-08-06-design-post-update-structure-check.md)
§11. Filed as part of the owner-authorized `0241` follow-up batch (all six design questions ruled via
`AskUserQuestion`, live `fkit lead` session, **2026-08-06**; filing authorized verbatim: *"spawn the
producer to file the 0241 follow-ups (companion ADR task + the implementation split)"*).

**⚠️ Boundary adjustment, stated openly:** report §11's unit 7 bundles these docs with *"fkit-wiki
ingests this report and the ADR"*. Those two halves have different exclusive write authorities —
docs are coder work, the vault write is `fkit-wiki`'s alone
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
— and a brief carries a single mandatory `## Owner`. The wiki half is therefore its own brief,
[`0249`](../0249-wiki-ingest-of-the-structure-check-design-report-and-companion-adr/brief.md). This
is the only place the filing departs from §11's unit boundaries, and this is its recorded cause.

## What to build

Once units 1–5 have landed, document the capability where the repo already documents such things:

1. **`ai-agents/knowledge-base/architecture.md`** — the structure-check capability: spec + manifest
   (determination layer) in the install share, the producer-owned check skill, the consent-gated
   repair path and its v1 scope, the launch notice + intent-file suppression (if `0247` has landed;
   otherwise document the on-demand check only and say the notice is filed), and the governing
   records (ADR-015 unchanged for the unattended path; the `0242` companion ADR).
2. **`README.md`** — the user-facing story: how an owner learns whether their project matches the
   installed fkit, and how repair works (in-session, consent-gated, never silent).
3. **Scaffold docs pointers** — wherever the scaffold's own docs describe launch convergence and its
   deliberate content-drift residual, add the pointer to the new sanctioned path. ⚠️ Scaffold files
   are dual-homed (ADR-027): a change to a must-match file lands in **both** copies.

### ⛔ Out of scope

- ⛔ **Any `ai-agents/wiki-vault/` write** — that is `0249`, `fkit-wiki` only (ADR-005).
- ⛔ Any behavior change anywhere — docs only.
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. `architecture.md` describes the capability consistently with the `0242` ADR (spot-check the v1
   scope wording: untouched-stale only, no move/rename/delete, never announce-only, never stored).
2. `README.md` names the check and the consent-gated repair; no doc anywhere describes a silent
   auto-update.
3. Any touched dual-homed scaffold file is byte-aligned in both homes (`npm test` — the dual-home
   parity test — green).
4. Every claim written cites what shipped, not the design's proposals — where a unit (e.g. `0247`)
   has not landed, the docs say what exists today.
5. `git status --porcelain` shows nothing under `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** `0242`, `0243`, `0244`, `0245`, `0246` — report §11's "1–5". (`0247` is *not* a
  dependency; if unlanded, it is documented as filed, per verification step 4.)
- **Blocks:** nothing.
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board — no sprint named by the owner;
  no re-rank (ADR-035).
