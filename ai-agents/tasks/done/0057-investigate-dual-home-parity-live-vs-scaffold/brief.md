# Investigate dual-home parity — keeping the dogfood tree and the scaffold in step

## ID
0057

## Sprint
Sprint 2

## Priority
49

## Status
✅ Done

## Context

**fkit-authored artifacts live in two homes, and nothing enforces that a change lands in both:** this
repo's live `ai-agents/` (the dogfood instance the team works against) and
`claude/scaffold/ai-agents/` (the template every consuming project receives at init and via task-28
launch-time convergence).

**This is a recurring class, not a one-off — four shipped instances:**
1. `fix-scaffold-knowledge-base-folders` — the scaffold didn't ship the KB folders its own README
   promised (100% of new projects affected).
2. `bake-architecture-pointer-into-scaffold-templates` — the Architecture pointer existed live, not in
   the scaffold.
3. `align-conventions-readme-enforcement-item-live-vs-scaffold` — the conventions README diverged
   between the two homes.
4. Task 47/48 (2026-07-17) — `one-skill-one-output.md` written into the live conventions only; the
   scaffold copy needed its own follow-up task (48).

Each fix closed one instance without touching the cause. **The owner has now asked for the cause to be
addressed** (2026-07-17): *"if we apply some changes to the way fkit works, the changes are applied
both to the current dogfood version and to the version that will be shipped to the end users."*

**⚠️ Standing decisions this must reconcile with — not silently override:**
- **The deferred content-drift decision** (Sprint 2 addendum, tasks 25–28, owner-ratified): launch-time
  convergence in *consuming projects* cannot fix content drift, by invariant; the hash-manifest design
  that would fix it was costed and deferred, with the re-raise trigger *"when a third fkit-authored
  file starts drifting."* **This investigation is about a different seam** — keeping the two copies
  inside *this repo* in step at development time, not mutating consuming projects — but the file
  enumeration below is evidence for whether that re-raise trigger has fired, and the findings must say
  so explicitly either way.
- **ADR-014 (how fkit tests itself):** zero devDependencies, `node --test` at repo root — any
  mechanical check must fit it.
- **Known accepted drift exists and would trip a naive checker on day one:** this repo's live
  `ai-agents/README.md` has drifted from the scaffold's *in both directions, deliberately* (recorded in
  the Sprint 2 addendum). A parity check with no exception mechanism is red from birth.

## What to build

An **investigation with findings, not an implementation.** Deliverable: a dated report in
`ai-agents/knowledge-base/reports/` answering:

1. **Enumerate the dual-home files.** Which paths exist in both the live `ai-agents/` and
   `claude/scaffold/ai-agents/`? For each: currently identical, acceptably divergent (and why), or
   drifted-by-accident. This table is the ground truth everything else builds on.
2. **The must-match manifest question.** Should parity be defined by an explicit manifest (which
   files are canonical pairs, which divergence is accepted), by directory convention, or by exclusion
   list? How does the answer avoid becoming its own second source of drift?
3. **The process layer.** Spec the change to `/fkit-task-brief` (a mandatory scoping check: work
   touching an fkit-authored artifact that ships in the scaffold must scope the scaffold counterpart
   or state its omission) and a short `knowledge-base/conventions/` entry recording the dual-home
   rule. Note: prose asking agents to behave — advisory, same claim level as the shared-instructions
   work (Sprint 2, tasks 30–32: "delivery structural, compliance advisory").
4. **The mechanical layer.** Spec a parity test under ADR-014's constraints (`node --test`, zero
   devDeps): what it compares, how accepted drift is excepted, where it runs, and what red means for
   a developer. Include the honest cost of the exception mechanism.
5. **The re-raise ruling.** Does the file enumeration show the deferred content-drift decision's
   "third drifting file" trigger has fired? State it as a yes/no with evidence; the decision to reopen
   is the owner's.
6. **Recommendation:** one recommended combination (process only / mechanical only / both, and in what
   order) with its main tradeoff stated.

**Recommended for an adversarial pass before owner review** — the task-20 and task-29 precedent: both
of those rev-1 recommendations did not survive Codex review intact.

## Verification steps

- A dated report exists in `ai-agents/knowledge-base/reports/` covering all six items above.
- The dual-home enumeration is evidence-based — produced by comparing the actual trees, not recalled
  (per [`conventions/evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)).
- The report explicitly addresses the deferred content-drift decision and states whether the re-raise
  trigger has fired, with the file list as evidence.
- Any mechanical-check proposal states its ADR-014 fit (or the conflict, if one exists).
- No implementation is shipped; no task brief for implementation exists until the owner has reviewed
  the findings.
- Nothing in `ai-agents/wiki-vault/` is touched.

## Notes

- **Owner: fkit-architect** — the manifest/exception design and the ADR-014 fit are architecture
  calls.
- **Depends on: nothing. Blocks: all implementation of dual-home parity** — implementation briefs are
  scoped only after the owner reviews the findings (the task-20/29/39 investigation-first pattern).
- **Task 48 does not wait for this** — it closes the current instance independently.
- The findings may spawn: a `/fkit-task-brief` skill edit (fkit-coder), a conventions entry
  (fkit-architect), a parity test (fkit-coder), and possibly a reopening of the content-drift
  decision (owner). None of these is authorized by this brief.
