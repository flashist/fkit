# Investigate dual-home parity — keeping the dogfood tree and the scaffold in step

**Source**: `ai-agents/tasks/done/0057-investigate-dual-home-parity-live-vs-scaffold/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · priority 49 · owner fkit-architect · investigation-first

## Goal
Address the **cause** of a recurring defect class, not another instance of it. fkit-authored artifacts live in **two homes** — this repo's live `ai-agents/` (the dogfood tree) and `claude/scaffold/ai-agents/` (the template every consuming project receives) — and **nothing enforced that a change landed in both**.

**Four shipped instances preceded this**, each fix closing one instance without touching the cause: the scaffold not shipping the KB folders its own README promised; the Architecture pointer existing live but not in the scaffold; the conventions README diverging; and task 47/48, where `one-skill-one-output.md` was written into the live conventions only and needed its own follow-up task. The owner's ask (2026-07-17): *"if we apply some changes to the way fkit works, the changes are applied both to the current dogfood version and to the version that will be shipped to the end users."*

**Three standing constraints it had to reconcile with, not silently override:** the **deferred consuming-project content-drift decision** (with its re-raise trigger *"when a third fkit-authored file starts drifting"*); [[decisions/adr-014-how-fkit-tests-itself]]'s zero-devDeps / `node --test` limits; and the fact that **known, deliberate drift already exists** — so a naive parity checker is **red from birth**.

## Key Changes
No implementation — the deliverable is `knowledge-base/reports/2026-07-18-dual-home-parity-live-vs-scaffold.md`. The brief required the enumeration to be **evidence-based, produced by comparing the actual trees**, per `conventions/evidence-before-assertion.md`.

**That requirement paid off, and against the report itself.** A `diff -rq` re-run on 2026-07-19 corrected the report's own §1: it had enumerated **five** drifted `conventions/*` files; the re-run found **six** fkit-authored files out of step — the five plus **`ai-agents/README.md`, the largest of them**. `reviews/README.md` and `wiki-vault/schema.md` are in step. **The reconciliation is scoped to six files, not five.**

## Outcome
**Ruled 2026-07-19 → [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]**, which creates the standing rule `conventions/dual-home-parity.md` — the **fifth** convention and the **first fkit-repo-only** one.

- **The owner adopted the recommended combination in the recommended order:** the process layer first, then the mechanical parity test. Both are **scoped but unbuilt** — so the rule is currently enforced only by reading it.
- **The re-raise ruling went the other way, knowingly.** The owner ruled **do not reopen** the deferred consuming-project content-drift decision **notwithstanding its fired trigger** — on the grounds that it governs a **different seam** (mutating consuming projects, versus keeping two copies inside this repo in step at development time). ADR-027 Decision 4.
- ⚠️ **Consuming projects have not received the `status-report-format` amendment or the newer conventions.** Six files, 234 diff-lines, verified 2026-07-19. **Not a wiki defect** — recorded so the gap stays visible.
- Nothing in `ai-agents/wiki-vault/` was touched by the investigation, as its verification steps required.

## Related
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the ruling this task produced
- [[decisions/adr-014-how-fkit-tests-itself]] — the constraint the mechanical layer must fit
- [[tasks/ship-one-skill-one-output-convention-in-scaffold]] — task 48, the fourth instance; deliberately did **not** wait for this investigation
- [[tasks/fix-scaffold-knowledge-base-folders]] · [[tasks/bake-architecture-pointer-into-scaffold-templates]] · [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] — the earlier instances
- [[systems/knowledge-base-structure]] · [[systems/launch-convergence-and-init]] · [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — why launch-time convergence cannot fix content drift by invariant
- [[systems/fkit]] — the dual-home drift recorded as a standing gap
- [[systems/testing-and-verification]] — where the parity test this investigation scoped would live; **scoped, not built**
