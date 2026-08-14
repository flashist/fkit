# Design the post-update structure check against a shipped structure-spec `.md` — the sanctioned ADR-015 re-raise

**Source**: `ai-agents/tasks/done/0241-design-the-post-update-structure-check-against-a-shipped-spec/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-06
**Sprint/Tag**: Sprint 3 P3 · ID `0241` · owner fkit-architect
**Report**: `ai-agents/knowledge-base/reports/2026-08-06-design-post-update-structure-check.md`

## Goal

An owner-ruled product capability, filed and designed on **named verbatim rulings** (all
`AskUserQuestion`, live `fkit lead` session, 2026-08-06): the board (*"Sprint 3 (Recommended)"*); the
shape (verbatim, in full in brief and report — after an update, fkit checks whether the project
structure fits the installed version's requirements against a shipped explanatory `.md`, and updates
it where needed); the rank (*"Move to merit P3 (Recommended)"*); and scope (*"In scope
(Recommended)"* — stale `CLAUDE.md`/`AGENTS.md` refresh is **in**, one coherent capability). The
problem: a consuming project on an old fkit keeps drifted `ai-agents/` scaffold files and a stale
root-file body **forever** — ADR-015's create-if-absent invariant is exactly what forbids fixing them
unattended. **Design only**: nothing implemented, no spec written, ADR-015 not edited, no briefs filed
by the design itself.

## Key Changes

- **The re-raise, done properly.** The owner's *"if needed updated the structure"* fires ADR-015's own
  `Re-raise only if` trigger 1 (**on the proposal**), and the design measured **trigger 2 fired too**:
  **seven** fkit-authored files drift in this repo (≥ 3). Licence options put to the owner with **(b)
  recommended**: a **new companion ADR** scoping a consent-gated repair, with the unattended path's
  invariant **unchanged and in force** (amending ADR-015 is for evidence, not changed rulings;
  superseding it would retire a record still in force).
- **The hybrid is the design:** the **structure-spec `.md`** declares *what should exist* and each
  path's class (structural dir / fkit-authored reference file / owner-authored seed / wiki-authored
  living file / placeholder / root context file — check and repair semantics differ by class); the
  **hash manifest** (ADR-015's recorded deferred alternative, weighed as recorded, not re-derived)
  decides *touched-or-not* by byte-matching against **every blob fkit ever shipped per path** across
  the scaffold's three historical homes, CRLF-normalized both sides. Neither alone suffices.
- **Home: the install share**, beside the scaffold — a project-local spec copy is **self-defeating**
  (create-if-absent steps over it forever, so it would describe a stale version — the exact trap it
  exists to fix); the share is refreshed wholesale so it is by construction the installed sha's spec.
  Hand-authored prose guarded by a mechanical scaffold-inventory drift test.
- **Consent model: propose-then-apply, owner present, never stored** — check produces a per-file
  conformance report (conforming / missing / **untouched-stale** / **owner-edited** / wrong-type /
  wiki-routed); the agent proposes the full change list with diffs; the owner approves via
  `AskUserQuestion`; apply is gated by an **apply-time freshness re-hash** (a file edited between
  propose and apply is refused). **v1 scope recommended narrow:** replace untouched-stale only; report
  owner-edited with diffs, touch nothing; **no move, no rename, no delete**. Forbidden shapes named
  and shown absent: silent auto-update; an unattended agent executing natural-language items.
- **Trigger: on-demand check (the repair's only entry point) + a read-only launch-time stderr notice**,
  with per-path **intent-file** suppression ("this path is mine; stop telling me") — intent, not
  progress, so not the rejected cursor; the share-stamp "since last look" candidate is flagged as
  cursor-reopening and not recommended.
- **ADR-005 preserved under every branch:** the vault's rows are existence-only checks; `schema.md`
  content-check is report-only; **any repair under `wiki-vault/` routes to `fkit-wiki`**, and the spec
  itself must carry that routing note.
- **Root files:** the fkit-managed rules block is already self-healing; the repair target is the
  **owner-side body**, hashed with the marker region elided; malformed markers → refuse to classify,
  report-only; absent markers → owner-edited, report-only.

## Outcome

Delivered as the design report with **seven decision points, three genuinely open and returned to the
owner** (licence Q1, consent granularity Q2, launch-notice/intent-file Q4; role Q5, spec-maintenance
Q6 and manifest-fold Q7 carry recommendations; Q3 already ruled in-scope) — **all subsequently ruled
by the owner 2026-08-06**, and the producer filed the proposed seven-unit split as **eight follow-up
briefs `0242`–`0249` on the Backlog board**: the companion ADR (`0242`), spec + drift test (`0243`),
manifest generator + completeness test (`0244`), the producer-owned check skill (`0245`), the
consent-gated repair path (`0246`), the launch notice + suppression (`0247`), docs (`0248`), and the
wiki ingest of report + companion ADR (`0249`). **The companion ADR is not yet recorded** — until
`0242` lands, ADR-015 remains the last word on disk. The 2026-08-06 driver run also applied ADR-038
live: this task's Build step spawned `@fkit-architect`, its Process-review step `@fkit-coder`.

> *✅ Dated update 2026-08-07 (recorded by the `0249` ingest; text above byte-identical):* `0242`
> landed — **the companion ADR is now recorded as
> [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]]**
> (accepted, filed 2026-08-07; all six rulings dated 2026-08-06). ADR-015 is no longer the last
> word on content drift; its invariant stays in force for the unattended launch path. ⚠️ The six
> rulings' **verbatim wording lives on the ADR-039 page** (cross-linked, not duplicated here) —
> and note the numbering trap: this page's §Outcome counts in **report §10's numbering** (where
> "Q3" is the pre-ruled in-scope item and the manifest fold is "Q7"); ADR-039 numbers the six
> **Q1–Q6 as put to the owner**, mapping to report §10 items 1, 2, 4, 5, 6, 7.

## Related
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — the companion ADR this design recommended, recorded 2026-08-07 (`0242`): carries the six rulings verbatim
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the locked decision this design re-raises by its own sanctioned trigger; invariant kept in force for the unattended path
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — vault write exclusivity, preserved structurally under every branch
- [[tasks/sprint-3-close-the-rank-integrity-loop]] — the board (P3, owner-ruled merit rank)
- [[tasks/converge-ai-agents-additively-on-launch]] — the existing convergence pass this capability complements, never replaces
- [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] — the measured proof that drift can be deliberate adaptation, which is why the manifest decides touched-or-not by bytes, never by an LLM's judgement
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — corroborating practice: this task's steps were routed by skill, not authorship
- ✅ **Dated update 2026-08-13 (the `0263` resync):** **all eight follow-ups `0242`–`0249` are BUILT and CLOSED**, on [[tasks/sprint-4-ship-the-use-ready-self-healing-update]] — a board opened 2026-08-07 for exactly this chain and archived 2026-08-10. ⚠️ **Every one closed `(agent-closed — not owner-verified)` and the board was archived UNVERIFIED by owner ruling: nothing this design produced has been exercised outside this repo.** The pages: [[tasks/record-the-companion-adr-licensing-the-consent-gated-structure-repair]] · [[tasks/author-the-structure-spec-and-its-scaffold-inventory-drift-test]] · [[tasks/build-the-hash-manifest-generator-and-completeness-test]] · [[tasks/build-the-producer-owned-structure-check-skill]] · [[tasks/build-the-consent-gated-repair-path-inside-the-check-skill]] · [[tasks/add-the-launch-time-structure-notice-and-intent-file-suppression]] · [[tasks/update-the-docs-for-the-structure-check-capability]] · [[tasks/wiki-ingest-of-the-structure-check-design-report-and-companion-adr]]
- [[systems/launch-convergence-and-init]] · [[systems/install-and-self-update]] · [[systems/fkit]]
- [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]] — ⚠️ this design contains **zero** `.claude` matches; ADR-043 rules that absence **decided, not an oversight**
- [[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] — the task that found the gap and closed it as a ruling rather than an implementation
