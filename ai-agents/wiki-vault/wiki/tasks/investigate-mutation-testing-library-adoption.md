# Investigate adopting a proper mutation-testing library, replacing hand-rolled `prove-red.sh`

**Source**: `ai-agents/tasks/done/0058-investigate-mutation-testing-library-adoption/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · priority 46 · owner fkit-architect · investigation-first

## Goal
Answer the owner's verbatim reaction to review finding **R2** on task 43: *"it looks like we need to use a proper library for auto-tests, which handles this specific type of tests 'testing negative cases'."*

**Investigation only** — explicitly *not* R2's fix, which was already done and verified inside task 43's own scope, and explicitly not "add Stryker". The brief forbade adding any dependency, lockfile or `node_modules`, and forbade touching `test/`.

**What R2 exposed.** `test/prove-red.sh` — fkit's hand-rolled mutation gate ([[decisions/adr-014-how-fkit-tests-itself]], *"a test that has never failed has not been tested"*) — was broken **silently, in two ways**, by task 43's refactor: it went red at its own **unmutated baseline** (a new assertion hardcoded an absolute path matching only the original checkout, not the temp-dir copy it deliberately runs against), and separately one `sed`-based mutation targeted a function that had **moved to another file**, quietly becoming a **no-op** that would have proven nothing even without the first bug. **Nothing caught either break** until a manual audit during review.

## Key Changes
No code changed — the deliverable is `knowledge-base/reports/2026-07-18-mutation-testing-library-adoption.md`, now the evidence record rather than a live recommendation.

The survey had to reconcile with ADR-014's settled points: **zero devDependencies, no lockfile, no `node_modules`** (Decision 4), the **hard-coded oracle** (Decision 5), and the by-name rejection of `bats-core`/`shellspec` (Decision 3). The brief was careful **not** to pre-decide that tension — it named the ADR-014 conflict as an open question **for the architect**, not something the producer could settle.

## Outcome
**Ruled 2026-07-19 → [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]**, a tombstone so *"just use Stryker"* is not re-proposed.

- **No library fits.** The finding is structural, not a cost judgment: mutation-testing frameworks instrument a project's **own JS/TS source**; `prove-red.sh` mutates a **separate shell codebase run as a subprocess**. **No library mutates shell.** So the zero-devDeps tradeoff never even had to be weighed.
- **[[decisions/adr-014-how-fkit-tests-itself]] Decision 4 stands unamended** — no candidate exists to trade the principle for.
- **Of the two interim hardenings offered, only one was selected:** wire `prove-red.sh` into an automated gate. **The no-op-mutation guard was NOT selected** — recorded as offered-and-not-taken rather than rejected on merit, so **R2's second failure mode remains open** (ADR-026 Decision 5).
- ⚠️ **The ADR's own Context was falsified by the tree.** It asserts `prove-red.sh` is *"not in `npm test`"*; the gate had in fact shipped the previous evening (commit `0ad055a`, 2026-07-18 21:34), so **Decision 4 was already implemented when it was written.** Caught by the 2026-07-19 lint, not by the sync — see the LINT WARNING on [[systems/testing-and-verification]]. **The architect owns ADR-026; the wiki does not edit it.**

## Related
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — the ruling this task produced
- [[decisions/adr-014-how-fkit-tests-itself]] — the standing decision it had to reconcile with, left unamended
- [[tasks/implement-pretooluse-skill-ownership-hook]] — task 43, where R2 was found and fixed
- [[tasks/add-launcher-contract-smoke-script]] — task 23, which built `prove-red.sh`
- [[systems/testing-and-verification]] · [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — ADR-026 Decision 4 is one of the two unfinished pieces of the gate the tester seat waits behind
- [[systems/fkit]] — the `prove-red` gap recorded as a standing gap
