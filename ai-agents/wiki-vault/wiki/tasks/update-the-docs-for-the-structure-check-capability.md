# Update the docs for the structure-check capability — architecture.md, README, scaffold pointers

**Source**: `ai-agents/tasks/done/0248-update-the-docs-for-the-structure-check-capability/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 4 P7 · task `0248` · owner `fkit-coder`

## Goal

Document the shipped capability where the repo already documents such things: `architecture.md` (spec
+ manifest in the install share, the producer-owned check skill, the consent-gated repair and its v1
scope, the launch notice and its intent-file suppression, and the governing records), `README.md`
(the user-facing story), and the scaffold's own docs pointers.

## Key Changes

- **`architecture.md`** — verified against the `0242` ADR's own wording, including the v1 scope:
  *untouched-stale only, no move/rename/delete, never announce-only, never stored.*
- **`README.md`** — how an owner learns whether their project matches the installed fkit, and how
  repair works: **in-session, consent-gated, never silent.** The verification step is blunt about the
  bar: ***no doc anywhere describes a silent auto-update.***
- **Scaffold docs pointers** — ⚠️ scaffold files are dual-homed
  ([[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]), so a change to a
  must-match file lands in **both** copies and the parity test is the check.

## Outcome

### ⚠️ The boundary adjustment, stated openly rather than silently

The design's unit 7 bundled these docs with *"fkit-wiki ingests this report and the ADR"*. **Those two
halves have different exclusive write authorities** — docs are coder work, the vault write is
`fkit-wiki`'s alone ([[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]) — **and a
brief carries a single mandatory `## Owner`.** So the wiki half became its own brief, `0249`.

**This is the only place the `0241` filing departed from the design's unit boundaries, and the brief
records its cause rather than leaving a reader to infer one.** It is the same split that
[[tasks/wiki-ingest-of-the-structure-check-design-report-and-companion-adr]] exists to close.

The task depends on units 1–5; `0247` is explicitly **not** a dependency — if the notice had not
landed, it would have been documented as filed.

⚠️ Closed `(agent-closed — not owner-verified)`; Sprint 4 archived unverified.

⚠️ **`architecture.md` has since drifted again on an unrelated axis** — it states the Codex sandbox
flag three times, including inside its runtime diagram, and those three sites are **outside** the
scope of the task that changes the flag. See
[[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]].

## Related
- [[tasks/sprint-4-ship-the-use-ready-self-healing-update]]
- [[tasks/wiki-ingest-of-the-structure-check-design-report-and-companion-adr]] — the half that split off, and why
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — the stated cause of the split
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the dual-homed scaffold constraint
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — the wording the docs were checked against
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — a later, unrelated `architecture.md` drift
- [[tasks/build-the-producer-owned-structure-check-skill]]
- [[tasks/build-the-consent-gated-repair-path-inside-the-check-skill]]
- [[systems/knowledge-base-structure]]
- [[tasks/design-the-post-update-structure-check]] — the design whose unit 7 this is the docs half of
