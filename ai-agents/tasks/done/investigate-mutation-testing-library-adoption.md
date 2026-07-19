# Investigate adopting a proper mutation-testing library, replacing hand-rolled `prove-red.sh`

## Sprint
Sprint 2

## Priority
46

## Status
✅ Done

## Context

**The owner's ask, verbatim, raised in response to a review finding on task 43:** *"it looks like we
need to use a proper library for auto-tests, which handles this specific type of tests 'testing
negative cases'."*

**What triggered it:** [`ai-agents/reviews/implement-pretooluse-skill-ownership-hook.md`](../../reviews/implement-pretooluse-skill-ownership-hook.md),
finding **R2**. `test/prove-red.sh` — this project's hand-rolled mutation-testing hard gate (task 23 /
[ADR-014](../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md), *"a test that has never
failed has not been tested"*) — was broken by task 43's refactor, silently, in two ways that were easy
to miss:

- it went red even at its own **unmutated baseline** (supposed to rule out "red for the wrong reason")
  because a new assertion hardcoded an absolute path that only matched the original checkout, not the
  temp-dir copy `prove-red.sh` deliberately runs against;
- separately, one of its `sed`-based mutations targeted a function that had moved to a different file
  in the same refactor, so the mutation quietly became a no-op — it would have proven nothing even if
  the path bug above hadn't existed.

Nothing caught either break until a manual, deliberate audit during review — `prove-red.sh` isn't wired
into `npm test`. **R2 has already been fixed and verified inside task 43's own scope.** This task is
**not** about re-fixing R2 — it is the forward-looking question the owner raised in response to it: is
hand-rolling this class of test still the right call, or does it need a real library underneath it.

### The problem, named plainly

fkit currently hand-rolls "negative case" / mutation testing: `test/prove-red.sh` manually crafts
broken copies of `claude/` and greps/asserts specific failure signatures out of the result, rather than
using an established mutation-testing framework or library. That approach is exactly as fragile as R2
demonstrated — every mutation point and every expected-failure assertion is a hand-maintained string
that a refactor can silently invalidate, with no structural mechanism (only a human audit) to notice.

### Relevant background — this is not a green field

- **[ADR-014](../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)** is the standing
  decision that governs this area. It settles, among other things: **zero devDependencies, no
  lockfile, no `node_modules`** (Decision 4) and **the expected matrix/oracle is hard-coded in the test,
  never derived from the implementation** (Decision 5 — *"a test whose oracle is the implementation
  tests nothing"*). It also rejects `bats-core`/`shellspec` by name (Decision 3).
- **Task 23** (`add-launcher-contract-smoke-script.md`, done) built the current suite, including
  `prove-red.sh`, under those constraints, on `node --test` with zero devDeps.
- **Any library adoption would have to reconcile with ADR-014's settled principles** — most sharply,
  zero-devDependencies-with-no-install-step versus a mutation-testing library, which by nature depends
  on a package (and typically a language/ecosystem-specific mutation engine: e.g. Stryker for
  JS/TS-shaped mutation testing — the actual applicable stack here is **plain Node.js, `node --test`**,
  not TypeScript, which narrows what's even applicable). **This task does not decide that tradeoff.**
  Whether it's worth breaking ADR-014's zero-devDeps stance — or whether a library even exists that fits
  a zero-devDep, `sh`/`node --test`-based black-box process-contract suite — is an open question for
  **fkit-architect**, not something to settle unilaterally in this brief or by the producer.

## What to build

**An investigation and a recommendation — not an implementation.** Do not add a dependency, and do not
change `prove-red.sh` or `test/` structure as part of this task.

1. **Survey what "a proper library for negative-case / mutation testing" would mean for this stack.**
   fkit's test suite is plain Node.js (`node --test`), zero devDependencies, testing a shell product
   as a black-box process contract (ADR-014 Decisions 1–2). Identify what mutation-testing tooling
   exists that could plausibly apply here (e.g. Stryker Mutator's Node.js/command runner, or a
   lighter-weight alternative) — and be honest about tools that don't apply (most mutation-testing
   frameworks are built for testing a project's *own* JS/TS source via instrumentation, not for
   mutating and asserting against a separate shell codebase run as a subprocess, which is what
   `prove-red.sh` actually does).
2. **State the real tradeoff, not a hypothetical one**: zero-devDependencies / no-install-step (ADR-014
   Decision 4) vs. whatever the candidate library costs (an install step, a lockfile, node_modules,
   contributor friction — the same axis ADR-014 already weighed once for the runner choice). Name what
   ADR-014 principle(s) a candidate would violate, if any, and whether that's a reason to reject it or
   a reason to reopen ADR-014.
3. **If something is worth adopting, propose exactly one candidate** with its cost stated plainly — not
   a menu of options. If nothing fits without violating ADR-014's settled points, say so and explain
   why hand-rolled stays the pragmatic choice, with a recommendation for how to make the hand-rolled
   approach less fragile in the interim (e.g. wiring `prove-red.sh` into `npm test` so a break like R2
   is caught automatically rather than only by manual audit — flag as a possible cheap independent fix
   regardless of the library question, but don't scope it here).
4. **Flag the ADR-014 conflict explicitly as an open question for the architect** — do not resolve it
   in this brief. If the investigation concludes a library is worth it, the next step is an ADR-014
   amendment (or a superseding decision), owned by fkit-architect, before any implementation task is
   written.

## Verification steps

- A dated findings write-up exists (`ai-agents/knowledge-base/reports/`) naming: the candidate(s)
  surveyed, whether any genuinely fits this stack (plain Node.js / zero-devDeps / black-box process
  contract), the concrete cost of adopting one, and a single recommendation (adopt one named library,
  or stay hand-rolled with a named mitigation).
- The ADR-014 tension is stated explicitly, not glossed over, and left as an open question for the
  owner/architect rather than pre-decided.
- No dependency, lockfile, or `node_modules` is added as part of this task.
- No changes to `test/prove-red.sh` or any other test file — this is scoping-only, not R2's fix (which
  is already done, in task 43's scope).

## Notes

- **Owner: fkit-architect** — this is a feasibility/tooling-fit question against a standing
  architectural decision (ADR-014), the same class of call as the runner question ADR-014 itself left
  open at task-23 time.
- **Depends on: nothing.** Not blocking any other Sprint 2 task; task 43 (where R2 was found and fixed)
  proceeds independently.
- **This is investigation-first, on purpose** — per the same pattern as tasks 20/29/39: findings and an
  owner/architect review come before any implementation brief is scoped. Do not skip to "add Stryker" or
  any other concrete change without that review.
- **Scope boundary — not a re-litigation of R2.** R2 (the specific breakage) is fixed and verified in
  task 43. This task is only the forward-looking library question the owner raised in response to it.
- **Provenance:** owner request via `/fkit-task-plan`, relayed by fkit-coder mid-implementation of task
  43 (2026-07-16), from the owner's verbatim reaction to review finding R2.
