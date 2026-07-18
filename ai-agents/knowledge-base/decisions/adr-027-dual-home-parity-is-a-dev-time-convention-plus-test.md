# ADR-027: Dual-home parity is solved at development time with a convention + a parity test — the consuming-project content-drift decision stays deferred

- **Status:** accepted
- **Date:** 2026-07-19
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Evidence:** [`reports/2026-07-18-dual-home-parity-live-vs-scaffold.md`](../reports/2026-07-18-dual-home-parity-live-vs-scaffold.md)
  (task 49), plus a `diff -rq` re-run on 2026-07-19 recorded in
  [`conventions/dual-home-parity.md`](../conventions/dual-home-parity.md).

> **What this ADR decides, in one line:** the two `ai-agents/` trees inside **this repo** are kept in
> step by a **convention plus a mechanical test**, and the **separate, deferred** question of pushing
> content corrections into **consuming projects** stays deferred — even though its re-raise trigger has
> fired.

## Context

fkit stores some documents twice: `ai-agents/…` (the tree fkit dogfoods on itself) and
`claude/scaffold/ai-agents/…` (the template a consuming project receives at init). Edits landed in the
live copies during development and the scaffold copies were never brought along.

**Verified 2026-07-19 (`diff -rq ai-agents/ claude/scaffold/ai-agents/`): six fkit-authored files are
out of step** — `README.md` (63 diff-lines), `conventions/one-skill-one-output.md` (55),
`conventions/evidence-before-assertion.md` (50), `conventions/task-status-vocabulary.md` (28),
`conventions/README.md` (24), `conventions/status-report-format.md` (14). `reviews/README.md` and
`wiki-vault/schema.md` are in step. *(Task 49's report found five; the re-run also caught
`ai-agents/README.md`, the largest. The reconciliation is scoped to **six** files.)*

Four prior **point-fixes** have already been needed for this same class of drift
(`fix-scaffold-knowledge-base-folders`, `bake-architecture-pointer-into-scaffold-templates`,
`align-conventions-readme-enforcement-item-live-vs-scaffold`, tasks 47/48). Drift is recurring, not
incidental.

### The two seams are different, and conflating them is the trap

| | **This ADR's seam** | **The deferred seam** |
|---|---|---|
| Where | Inside the fkit repo, at **development time** | Into **consuming projects**, at launch time |
| Problem | Two copies of one document diverge as we edit | A project initialized months ago holds an old copy |
| Fixable? | Yes, cheaply — both copies are in one working tree | **Not by launch-time convergence** — [ADR-015](adr-015-additive-launch-convergence-no-migration-mechanism.md) makes convergence **additive by invariant**, so it cannot rewrite content a project already has |
| Mechanism needed | A convention + a `diff` in a test | A hash manifest / migration mechanism — deferred |

**The Sprint 2 addendum's deferred content-drift decision set its re-raise trigger at *"a third
fkit-authored file starts drifting."* Six have. The trigger has fired.** But it governs the **second**
seam, and firing it is **not** a reason to reopen it now: this ADR's seam is the tractable one, and
fixing it needs no consuming-project mechanism at all.

## Decision

1. **Adopt the process layer.** [`conventions/dual-home-parity.md`](../conventions/dual-home-parity.md)
   is the standing rule: **an fkit-authored file living in both trees is edited in both, in the same
   change.** Written and in force as of this ADR.
   - It carries the **fkit-authored vs project-specific** litmus, so `PROJECT.md`, `wiki-vault/index.md`
     and `wiki-vault/log.md` — where the scaffold copy is deliberately a **placeholder** — are named as
     paths that must **never** be synced. Copying those would ship fkit's own project data into someone
     else's repo.
   - `/fkit-task-brief` gains a scoping check: a brief touching a dual-homed path must name **both**
     copies. *(Producer-scoped brief, owner: fkit-coder.)*
2. **Then build the mechanical parity test.** `test/dual-home-parity.test.js` under
   [ADR-014](adr-014-how-fkit-tests-itself.md) (`node --test`, zero devDeps): assert every fkit-authored
   dual-homed file is byte-identical, with an explicit exception list. **Preceded by a reconciliation
   change** that byte-aligns the **six** drifted files — without it the test fails on day one.
   *(Two producer-scoped briefs, owner: fkit-coder.)*
3. **Order matters and is part of the decision:** convention first, then reconciliation, then the test.
   The test is the enforcement; the convention is what it enforces. Building the test first just
   produces a red suite nobody can act on.
4. **The deferred consuming-project content-drift decision is NOT reopened**, notwithstanding its fired
   trigger. It is a genuinely separate, larger call (ADR-level, owner + architect) and nothing in
   Decisions 1–3 depends on it.
5. **The convention is itself fkit-repo-only and deliberately not dual-homed** — a consuming project has
   no `claude/scaffold/` tree, so the rule would govern directories it does not have. The parity test's
   exception list must include it, along with `conventions/README.md`'s index table, which necessarily
   lists each home's actual contents.

## Options considered

- **Process layer, then parity test (chosen).** Cheap, immediate, and it makes the recurring class of
  drift mechanically detectable. The convention alone would be advisory; the test alone would be
  unactionable. Together they are prevention plus detection at the seam where both are affordable.
- **Process layer only.** Rejected as insufficient on its own evidence: this drift recurred **four**
  times under a regime that already relied on authors remembering. A rule that asks people to remember
  is the claim level [ADR-016](adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md) §6
  warns about — delivery structural, compliance advisory.
- **Mechanical parity test only.** Rejected: without the convention there is nothing written down that
  the test is enforcing, and a failing parity test with no stated rule reads as a broken test.
- **Reopen the deferred hash-manifest / content-drift decision now.** Rejected for this task: it
  addresses a different seam (consuming projects), it cannot be solved by launch-time convergence
  (ADR-015), and it is far more machinery than keeping two in-repo copies in step. **Deliberately left
  open** — see "re-raise only if".
- **Accept the drift; keep point-fixing.** Rejected: four point-fixes already, and the scaffold is what
  every new project receives, so drift ships silently to users rather than staying an internal annoyance.

## Consequences

- **Positive:**
  - **New projects stop receiving stale fkit-authored documents** once the reconciliation lands.
  - **Drift becomes a test failure instead of an audit finding** — the same shift ADR-026 Decision 4
    makes for `prove-red.sh`, and for the same reason.
  - **The placeholder paths are named**, closing a real hazard: a naive "sync everything" fix would have
    shipped fkit's own `PROJECT.md` and wiki catalog into consuming projects.
  - **The two seams are now distinguished in writing**, so a fired trigger on one is no longer mistaken
    for a mandate on the other.

- **Negative / costs:**
  - **Every dual-homed edit costs a second edit.** Small, recurring, and the point.
  - **Until the reconciliation and test land, this is advisory only** — enforced by reading the
    convention. **Six files are drifted right now.**
  - **The exception list is a maintenance surface.** Each entry (`dual-home-parity.md`,
    `conventions/README.md`'s index, the placeholder paths) is a place the test can go stale or be
    weakened by someone silencing a legitimate failure.
  - **Consuming projects initialized before the reconciliation keep their stale copies forever.** That
    is the deferred seam, untouched by this ADR, and it is a real unfixed gap.

- **Residual risks / "re-raise only if":**
  - **A consuming project is materially harmed by a stale fkit-authored document** — that is the
    deferred content-drift decision becoming concrete, and it should be reopened as an ADR-level call
    with the owner. **The trigger having fired is not itself the reopen condition** (Decision 4); harm
    to a real project is.
  - **Drift recurs after the parity test ships.** That means the test's exception list is too broad or
    the check is being silenced — a defect against Decision 2, not a reason to revisit the approach.
  - **The dual-home structure itself is replaced** (e.g. the scaffold generated from the live tree
    rather than stored as a copy). That would make this convention obsolete; retire it via a superseding
    ADR and **delete** the convention, per `conventions/README.md`'s lifecycle rule.
  - Do **not** re-raise *"five/six conventions files are drifted"* as a new finding — that is this ADR's
    Context, with the reconciliation already scoped.
  - Do **not** re-raise *"the content-drift trigger has fired, so we must build the hash manifest"* —
    weighed here and deliberately deferred (Decision 4).

## Related

- [`reports/2026-07-18-dual-home-parity-live-vs-scaffold.md`](../reports/2026-07-18-dual-home-parity-live-vs-scaffold.md)
  — the investigation: the dual-home enumeration, the fired trigger, the recommended combination.
- [`conventions/dual-home-parity.md`](../conventions/dual-home-parity.md) — **the convention this ADR
  creates.** Per `conventions/README.md`, an ADR may create a convention but never *is* one; the rule
  lives there, the reasoning lives here.
- [ADR-015](adr-015-additive-launch-convergence-no-migration-mechanism.md) — launch-time convergence is
  **additive by invariant**, which is *why* the consuming-project seam cannot be solved the same way and
  is a separate decision.
- [ADR-014](adr-014-how-fkit-tests-itself.md) — the parity test's constraints: `node --test`, zero
  devDeps, repo root.
- [ADR-016](adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md) §6 — *delivery
  structural, compliance advisory*, the claim level of the process layer before the test exists.
- [ADR-026](adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md) — the sibling ruling of
  the same day: turn a manual audit into an automated gate.
- Sprint 2 addendum (tasks 25–28) — the deferred content-drift decision and its "third drifting file"
  trigger.
- Evidence: `diff -rq ai-agents/ claude/scaffold/ai-agents/` (2026-07-19). Prior point-fixes: tasks
  47/48 and the three named scaffold-alignment fixes.
- **Wiki:** **fkit-wiki** should ingest this ADR and the new convention — an architect never writes the
  vault.
