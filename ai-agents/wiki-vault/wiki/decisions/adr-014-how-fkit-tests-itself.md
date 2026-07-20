# ADR-014: How fkit tests itself — black-box process contract, zero devDeps

**Date**: 2026-07-13
**Status**: accepted — on its settled points. One named question (the test **runner**) was left open *by the ADR*, and settled later at implementation time. See "The runner" below.

## Context

fkit had **zero automated verification** — no CI, no test suite, no `.github/`. Its only automated check was `omnigent/validate-bundles.sh` ([[decisions/adr-003-ci-runs-validate-bundles]]), which validated *Omnigent bundle structure* and correctly died with the runtime it checked ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]).

Three facts made this a real decision rather than a chore:

1. **fkit's failure mode is *silent-wrong*, not crash.** `fkit --resume` at the time did not error — it handed you a working session with the **wrong role's authority**. A skill missing from `skills_for_role()` does not crash; the role just quietly cannot do its job. Silent-wrong is exactly the class a human misses by eyeballing.
2. **fkit is a shell product that launches an LLM**, not an LLM product. `exec claude …` is a clean boundary; everything on fkit's side is a pure function of (argv, project state, env) → (exit code, the argv handed to `claude`, the files written). Stub `claude` on `PATH` and the whole role-lock contract falls out as text in milliseconds — no model, no auth, no cost, no flake.
3. **The lockdown is the crown jewel and it is a JSON artifact.** `build_settings()` writes a `skillOverrides` map — 7 roles × 21 skills. That map **is** the session lock ([[decisions/adr-010-role-locked-sessions-and-skill-lockdown]], [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]).

### The fact that killed the dependency argument

`install.sh:43` is `cp -R "$TMP/src/claude" "$SHARE/claude"` — the installer copies **only `claude/`**. Not the repo root, not `package.json`, not `test/`. **Repo-root test infrastructure is physically incapable of reaching a consuming project**, so *"no dependencies protects the `curl | sh` story"* was a **false premise** — it was never at risk. The only real cost of a test dependency is **contributor friction**.

This is the single most load-bearing fact in the analysis, and the one most likely to be re-litigated from the wrong assumption: the first of the day's two consults reasoned from it and reached a different conclusion.

## Decision

**Settled — five points:**

1. **Test infrastructure never ships to consumers.** Tests live at the repo root (`test/`), outside `claude/`. Structural, not a convention to be careful about.
2. **Scope = the black-box process contract, and it stays this size.** Exactly two things: the argv fkit hands to `claude` (*including whether it exec'd at all* — the assertion that catches a green exit on a broken invariant), and the `skillOverrides` map. Out of scope deliberately: shell internals and LLM behavior.
3. **bats-core and shellspec are rejected.** Shell-*internals* harnesses; their value is mocking and sourcing shell functions — a problem fkit does not have. bats notably ships a process runner and **no JSON parser**, the one thing the crown-jewel assertion needs.
4. **Zero devDependencies, no lockfile, no `node_modules`** — whichever runner wins. **Adding a lockfile would be the actual regression.** Consistent with [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]].
5. **The expected 7×21 matrix is HARD-CODED in the test — never derived from `skills_for_role()`.** *A test whose oracle is the implementation tests nothing.* Forcing a deliberate test edit when a role's skills change is **the ratchet**, not a maintenance burden. This **reverses** the instruction in [[tasks/add-e2e-smoke-script-for-fkit-itself]].

> **⚠️ Decisions 3 and 5 describe a subject that no longer exists.** The **7×21 `skillOverrides` matrix was RETIRED** at task 43 / [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — it was session-scoped, governing what the launching process could see rather than who was actually calling, **which is precisely the bug class ADR-018 fixed**. **The hard-coded-oracle *principle* (Decision 5) survives intact and is still honored** — it simply lives in `test/skill-ownership-hook.test.js` now, where the genuine per-role/per-skill matrix moved. The launcher suite's Group B asserts only the role-independent hook wiring. ADR-014 itself is not superseded; **this one factual referent moved.** *(Recorded by lint, 2026-07-19.)*
>
> **⚠️ Decision 2's "exactly two things… and it stays this size" no longer describes the tree** — `test/` now holds seven files (launcher, hook, dashboard, converge, orphan-cleanup, rules-block-budget, `prove-red.sh`). Each traces to a ruling (ADR-017, ADR-018, the convergence and cleanup work), so this is **growth by decision, not drift** — but the size claim is stale. See [[systems/testing-and-verification]].

### The runner — left open by the ADR, settled at implementation

The ADR deliberately **declined to pick the runner**, on the owner's explicit ruling: *"leave it as an open question that needs additional investigation and discussion at the time the task is going to be done."* Recording `node:test` as accepted would have been **recording a decision the owner did not make** — which the ADR names as the one thing an ADR must never do.

**Resolved in practice by [[tasks/add-launcher-contract-smoke-script]]: the runner is `node --test`** (`package.json` `"test": "node --test test/*.test.js"`; the suite is `test/launcher-contract.test.js`). ⚠️ The ADR's own text still presents the runner as open — see Consequences.

## Consequences

- **Positive:** the false "dependencies break `curl | sh`" premise is killed with a citation and cannot return. Scope, rejected harnesses, zero-devDeps and the hard-coded-matrix ratchet are closed. The hard-coded matrix also makes the test the one **enforcing** mirror among the three hand-maintained copies of `skills_for_role()` — a drift that has already bitten once (`/fkit-team` under-reported the producer's primary procedure for two days).
- **Cost:** task 23 could not begin with the runner presumed — a deliberate, owner-chosen cost.
- ⚠️ **The ADR is now behind its own implementation.** It presents the runner as an open question; `node --test` is shipped and wired to `npm test`. The ADR has not been amended to record the resolution. Flagged for the architect — the wiki records the verified state.
- **Re-raise only if:** shell *internals* ever need asserting in isolation (shellspec becomes live again); **Node stops being a de facto prerequisite** (removing the strongest leg of the `node --test` case); or **test infrastructure ever becomes something a consuming project installs** — that inverts the `install.sh:43` fact everything here rests on.

## Related
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]]
- [[tasks/implement-pretooluse-skill-ownership-hook]]
- [[tasks/task-done-flips-brief-own-status-header]]
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]] — **widens §2's fence** from two things to three; rests on the same `install.sh:43` fact, inverted by design
- [[decisions/adr-003-ci-runs-validate-bundles]] — the dead Omnigent-era check this replaces
- [[tasks/add-ci-validate-bundles]] — the cancelled task that first named the gap this ADR's suite partly closes
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]]
- [[tasks/add-launcher-contract-smoke-script]] — the implementation; settled the runner
- [[tasks/add-e2e-smoke-script-for-fkit-itself]] — overridden by settled point 5, then cancelled
- [[tasks/remove-fkit-resume-passthrough]] — the bug the suite exists to catch
- [[systems/testing-and-verification]]
- [[systems/role-locked-sessions]]
- [[tasks/fix-headless-menu-guard-crash]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/design-deterministic-dashboard-for-fkit-status]]
- [[systems/install-and-self-update]]
- [[systems/fkit]]
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — Decision 4 upheld **unamended**; no mutation-testing library can mutate shell
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the parity test scoped under these constraints
- [[tasks/add-dumb-down-skill-for-six-roles]]
- [[tasks/filter-fkit-status-board-to-open-tasks]]
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the eighth-role tester, sequenced behind this ADR's remaining gaps
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]] — task 49, whose parity test is scoped but unbuilt
- [[tasks/investigate-mutation-testing-library-adoption]] — task 46: its Decision 4 stands **unamended**; no library mutates shell
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — adds a **duplicate-ID assertion** to this suite; detection here is the entire mitigation for its accepted cross-branch ID race
- [[tasks/design-task-folder-structure-and-id-scheme]] — task 74; the duplicate-ID guard it defers must fit this ADR's constraints
- [[tasks/assign-global-task-ids-and-create-registry]] — task 75; its guard is filed as task 85 against this suite
