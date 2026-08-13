# Wiki ingest of the structure-check design report and companion ADR

**Source**: `ai-agents/tasks/done/0249-wiki-ingest-of-the-structure-check-design-report-and-companion-adr/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 4 P8 · task `0249` · owner `fkit-wiki`

## Goal

Ingest the `0241` design report and the `0242` companion ADR into the vault — **the wiki half of the
design's unit 7**, split from [[tasks/update-the-docs-for-the-structure-check-capability]] on stated
cause: [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] makes the vault write
`fkit-wiki`'s exclusively, and a brief carries a single mandatory `## Owner`.

## Key Changes

Run 2026-08-07. Created
[[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] carrying the
one-line decision, **the six owner rulings verbatim**, the consent model, the trigger, the owning role
and its ADR-005 routing, spec maintenance and the manifest fold-in.

⚠️ **The numbering trap was stated on the page rather than smoothed over:** the rulings are numbered
**Q1–Q6 as put to the owner** and map to report §10 items **1, 2, 4, 5, 6, 7** — §10.3 was pre-ruled
settled scope and is **not one of the six**. The `0241` page's own outcome counts in the *report's*
numbering, not the ADR's.

Dated corrections were appended to
[[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] and
[[tasks/design-the-post-update-structure-check]], both of which had said the companion ADR was *"not
yet recorded"* — **text above left byte-identical**, correction placed **below the claim**.

**The report half was already ingested** by an earlier sync into
[[tasks/design-the-post-update-structure-check]] — verified and **topped up, not re-ingested; no
duplicate page created.**

## Outcome

### ⚠️ The run's own additions carried three false status claims, caught in review

Review round 1 found that the ingest's `index.md` row and a back-link bullet claimed the capability
(`0243`–`0247`) was **"not yet built" — false at write time**: all five briefs were in `tasks/done/`
and the artifacts were on disk. **The clauses were the ingest's own additions, not the source ADR's,
and were deleted.** Two further wording drifts were corrected in the same pass.

The correction was itself appended as a **new dated `log.md` entry** — never an in-place edit —
because *`log.md` is append-only, no exceptions* (owner ruling 2026-08-03, task `0211`). The ingest
entry above it is left byte-identical.

**This is the third consecutive instance of the chain's most reliable finding:** *a completeness claim
made by the run that would benefit from it has been wrong every time.*

### The scope ruling that was honored rather than widened

Four Sprint-3-archival stale spots flagged by the archival producer were ruled **out of this ingest's
scope** — they stem from a different source delta and belong to a later sync. **Nothing this run wrote
described Sprint 3 as active.** That restraint is the same one the owner later praised when refusing
to widen `0238` into `0263`.

⚠️ Closed `(agent-closed — not owner-verified)`; Sprint 4 archived unverified.

## Related
- [[tasks/sprint-4-ship-the-use-ready-self-healing-update]]
- [[tasks/update-the-docs-for-the-structure-check-capability]] — the other half of unit 7
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — the page this created
- [[tasks/design-the-post-update-structure-check]] — the report half, topped up not re-ingested
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — the stated cause of the split
- [[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]] — the append-only `log.md` ruling this run obeyed
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]
- [[systems/knowledge-base-structure]]
- [[tasks/record-the-companion-adr-licensing-the-consent-gated-structure-repair]] — `0242`, whose ADR this ingested
