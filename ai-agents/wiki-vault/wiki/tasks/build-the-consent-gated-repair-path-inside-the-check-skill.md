# Build the consent-gated repair path inside the check skill — propose-then-apply, v1 scope

**Source**: `ai-agents/tasks/done/0246-build-the-consent-gated-repair-path-inside-the-check-skill/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 4 P5 · task `0246` · owner `fkit-coder`

## Goal

**The genuinely new capability the whole design exists to license**: repairing *existing* content —
exactly what [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]'s invariant
forbids the unattended script to do.

⛔ **Hard-gated: this task must not start before `0242` lands.** Stated cause — *a repair capability
built before its licence is recorded is the "mechanism built around the record" the design exists to
prevent.*

## Key Changes

The four-step consent model:

1. **In-session, owner present.** The check's conformance report is the input; repair is reachable
   **only** from a live session.
2. **Propose:** the full change list — per file the action, and for replacements the **diff**. Nothing
   applied yet. ***Announce does not substitute for consent on this path.***
3. **Consent** (owner ruling Q2, verbatim *"Plan-level approval (Recommended)"*): approval via
   `AskUserQuestion` of **the exact enumerated per-file list with diffs in view**. **Never
   announce-only. Never stored** — consent is per-run, in the session where it is given. *(The
   orphan-cleanup record's reason: "a stored decision cannot survive a clone either.")*
4. **Apply exactly what was approved — behind the apply-time freshness re-check.** Immediately before
   each replacement, re-hash the on-disk file; **if it no longer matches the state the proposal
   showed, that item is refused and reported, never applied.** Then announce per path **what actually
   happened**.

**v1 scope, binding:** replace **untouched-stale** fkit-authored files with the installed version.
**Owner-edited files are report-only with diffs, touched never. No move, no rename, no delete.**
`CLAUDE.md`/`AGENTS.md` body repair under the same consent model — only an untouched-stale body
(markers elided) is eligible, and **markers plus the current fkit-managed block are preserved through
the rewrite**.

## Outcome

**Where the brief and the recorded ADR could be read apart, the brief itself says the ADR governs.**
That instruction is unusual and worth noting: the task deliberately subordinated its own text to the
record it was built behind.

The forbidden shapes are enforced as fixtures, not intentions: **no code path can move, rename or
delete anything** (grep + fixture), **a repair run against a nonconforming `wiki-vault/` writes
nothing under it**, and **no consent is persisted anywhere — no file, no config, no env.** Repair
never lives in init or the launcher — *a silent auto-update is exactly what the record forbids.*

⚠️ Closed `(agent-closed — not owner-verified)`. **This is one of the two rows the owner's 2026-08-08
note said were being personally verified; that verification never completed**, and Sprint 4 was
archived unverified. The promise is carried and discharged by task `0262`, which is **deliberately
unscheduled and not a release gate** — *until it runs, the promise is assigned, not met.*

## Related
- [[tasks/sprint-4-ship-the-use-ready-self-healing-update]]
- [[tasks/record-the-companion-adr-licensing-the-consent-gated-structure-repair]] — the licence, and the hard gate
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — the record that governs this task's own text
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the invariant this capability sits beside, unchanged for the unattended path
- [[tasks/build-the-producer-owned-structure-check-skill]] — the skill this phase lives inside
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — vault repairs routed away, asserted by fixture
- [[tasks/design-the-post-update-structure-check]]
- [[systems/launch-convergence-and-init]]
- [[tasks/update-the-docs-for-the-structure-check-capability]] — `0248`, which documents this repair path and its v1 scope
- [[systems/install-and-self-update]] — the install share this repair replaces files from
- [[systems/fkit]] — the repair phase of the producer-owned `fkit-heal` skill
