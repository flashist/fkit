# ADR-027: Dual-home parity is solved at development time with a convention + a parity test — the consuming-project content-drift decision stays deferred

**Date**: 2026-07-19
**Status**: accepted

> **What this ADR decides, in one line:** the two `ai-agents/` trees inside **this repo** are kept in step by a **convention plus a mechanical test**, and the **separate, deferred** question of pushing content corrections into **consuming projects** stays deferred — even though its re-raise trigger has fired.

## Context
fkit stores some documents twice: `ai-agents/…` (the tree fkit dogfoods on itself) and `claude/scaffold/ai-agents/…` (the template a consuming project receives at init). Edits landed in the live copies during development; the scaffold copies were never brought along.

**Verified 2026-07-19 (`diff -rq`): six fkit-authored files are out of step** — `README.md` (63 diff-lines), `conventions/one-skill-one-output.md` (55), `conventions/evidence-before-assertion.md` (50), `conventions/task-status-vocabulary.md` (28), `conventions/README.md` (24), `conventions/status-report-format.md` (14). `reviews/README.md` and `wiki-vault/schema.md` are in step. *(Task 49's report found five; the re-run also caught `ai-agents/README.md`, the largest.)*

**Four prior point-fixes have already been needed for this same class of drift.** It is recurring, not incidental.

### The two seams are different, and conflating them is the trap
| | **This ADR's seam** | **The deferred seam** |
|---|---|---|
| Where | Inside the fkit repo, at **development time** | Into **consuming projects**, at launch time |
| Problem | Two copies of one document diverge as we edit | A project initialized months ago holds an old copy |
| Fixable? | Yes, cheaply — both copies are in one working tree | **Not by launch-time convergence** — [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] makes convergence **additive by invariant**, so it cannot rewrite content a project already has |
| Mechanism needed | A convention + a `diff` in a test | A hash manifest / migration mechanism — deferred |

**The Sprint 2 addendum's deferred content-drift decision set its re-raise trigger at *"a third fkit-authored file starts drifting."* Six have. The trigger has fired.** But it governs the **second** seam, and firing it is **not** a reason to reopen it now.

## Decision
1. **Adopt the process layer.** `conventions/dual-home-parity.md` is the standing rule: **an fkit-authored file living in both trees is edited in both, in the same change.** It carries the **fkit-authored vs project-specific** litmus, so `PROJECT.md`, `wiki-vault/index.md` and `wiki-vault/log.md` — where the scaffold copy is deliberately a **placeholder** — are named as paths that must **never** be synced. Copying those would ship fkit's own project data into someone else's repo. `/fkit-task-brief` gains a scoping check: a brief touching a dual-homed path must name **both** copies.
2. **Then build the mechanical parity test** — `test/dual-home-parity.test.js` under ADR-014 (`node --test`, zero devDeps), asserting every fkit-authored dual-homed file is byte-identical, with an explicit exception list. **Preceded by a reconciliation change** that byte-aligns the six drifted files — without it the test fails on day one.
3. **Order matters and is part of the decision:** convention first, then reconciliation, then the test. Building the test first just produces a red suite nobody can act on.
4. **The deferred consuming-project content-drift decision is NOT reopened**, notwithstanding its fired trigger. It is a genuinely separate, larger ADR-level call and nothing in Decisions 1–3 depends on it.
5. **The convention is itself fkit-repo-only and deliberately not dual-homed** — a consuming project has no `claude/scaffold/` tree, so the rule would govern directories it does not have. The parity test's exception list must include it, along with `conventions/README.md`'s index table, which necessarily lists each home's actual contents.

## Consequences
- New projects stop receiving stale fkit-authored documents once the reconciliation lands; **drift becomes a test failure instead of an audit finding** (the same shift ADR-026 Decision 4 makes for `prove-red.sh`); the placeholder paths are named, closing a real hazard — a naive "sync everything" fix would have shipped fkit's own `PROJECT.md` and wiki catalog into consuming projects; and the two seams are now distinguished in writing.
- **Negative:** every dual-homed edit costs a second edit (small, recurring, and the point); **until the reconciliation and test land this is advisory only — six files are drifted right now**; the exception list is a maintenance surface where the test can go stale or be weakened; and **consuming projects initialized before the reconciliation keep their stale copies forever** — the deferred seam, untouched, a real unfixed gap.
- **Re-raise only if:** a consuming project is **materially harmed** by a stale fkit-authored document (**the trigger having fired is not itself the reopen condition — harm to a real project is**); drift recurs after the parity test ships (a defect against Decision 2, not a reason to revisit the approach); or the dual-home structure itself is replaced (retire the convention via a superseding ADR and **delete** it). Do **not** re-raise *"six conventions files are drifted"* (this ADR's Context, reconciliation already scoped) or *"the trigger fired, so build the hash manifest"* (weighed here and deliberately deferred).

## Related
- [[systems/knowledge-base-structure]] — where `conventions/dual-home-parity.md`, the fifth convention, is filed; it is the **first fkit-repo-only** convention
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — launch-time convergence is **additive by invariant**, which is *why* the consuming-project seam is a separate decision
- [[decisions/adr-014-how-fkit-tests-itself]] — the parity test's constraints: `node --test`, zero devDeps, repo root
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — *delivery structural, compliance advisory*, the claim level of the process layer before the test exists
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — the sibling ruling: turn a manual audit into an automated gate
- [[systems/launch-convergence-and-init]] — the launch-time seam this ADR deliberately does not touch
- [[tasks/ship-one-skill-one-output-convention-in-scaffold]] · [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] · [[tasks/fix-scaffold-knowledge-base-folders]] · [[tasks/bake-architecture-pointer-into-scaffold-templates]] — the four prior point-fixes this ADR generalizes
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[systems/testing-and-verification]]
- [[tasks/add-speak-in-simple-terms-output-style]]
- [[tasks/filter-fkit-status-board-to-open-tasks]]
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]] — task 49, the investigation that produced this ruling (**Done**)
- [[tasks/refresh-architecture-docs-for-tool-relaxation]] — task 58; the fifth convention is among what `architecture.md` still does not record
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — parity holds for free (its Decision 9): the scaffold and its `.gitkeep` files do not change under the task-folder migration
