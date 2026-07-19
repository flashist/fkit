# Testing & Verification

**Layer**: shared
**Key files**: `test/harness.mjs`, `test/launcher-contract.test.js`, `test/prove-red.sh`, `package.json` (`"test": "node --test test/*.test.js"`), `claude/fkit-claude.sh` (the subject), `install.sh:43`

## Summary

How fkit checks itself. For most of its life the answer was **nothing** — no CI, no test suite, no `.github/`. The only automated check was `omnigent/validate-bundles.sh`, which validated *Omnigent bundle structure* and correctly died with the runtime it checked ([[decisions/adr-003-ci-runs-validate-bundles]]).

Sprint 2 closed the largest part of that gap with a **launcher-contract suite** ([[tasks/add-launcher-contract-smoke-script]]), governed by [[decisions/adr-014-how-fkit-tests-itself]]. It is deliberately small, deliberately black-box, and deliberately incapable of reaching a consuming project.

## Architecture

### Why testing fkit is cheap — the insight the whole design rests on

**fkit is not an LLM product from a test-harness point of view — it is a shell product that launches an LLM.** `exec claude …` is a clean boundary. Everything on fkit's side of it is a **pure function** of (argv, project state, env) → (exit code, the argv handed to `claude`, the files written).

**Stub `claude` on `PATH` and the entire role-lock contract falls out as text in milliseconds** — no model, no auth, no network, no cost, no flake. Seconds, not minutes.

### Why it matters more here than in most projects

**fkit's failure mode is *silent-wrong*, not crash.** `fkit --resume` did not error — it handed you a working session with **the wrong role's authority** ([[tasks/remove-fkit-resume-passthrough]]). A skill missing from `skills_for_role()` does not crash; the role just quietly cannot do its job. **Silent-wrong is exactly the class a human misses by eyeballing and a test catches trivially.**

### Scope — two things, now three

Settled by ADR-014 §2 (*"exactly two things… and it stays this size"*):

1. **The argv fkit hands to `claude`** — *including whether it exec'd at all*. This is the assertion that catches a **green exit on a broken invariant**, which is why exit codes alone are not enough.
2. **The `skillOverrides` map** in `.fkit/settings/<role>.json` — the **7 × 21 lockdown matrix**, the crown jewel ([[systems/role-locked-sessions]]).

[[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]] rule 4 **widens the fence to a third**: the **stdout contract of a shipped skill executable**.

**Out of scope, deliberately:** shell internals (no sourcing/mocking individual functions — which is why bats-core and shellspec were rejected) and LLM behavior (no model, no auth, no network).

### The two load-bearing rules

- **Test infrastructure never ships to consumers.** `install.sh:43` copies **only `claude/`** — so repo-root `test/` is **physically incapable** of reaching a consuming project. This also killed the *"no dependencies protects `curl | sh`"* premise: it was defending a threat that does not exist. The only real cost of a test dependency is **contributor friction**.
- **The 7×21 matrix is HARD-CODED, never derived from `skills_for_role()`.** *A test whose oracle is the implementation tests nothing* — derive the expectations and breaking the matrix breaks the expectations in lockstep, and it still passes. **The hard-coded copy *is* the contract**, and forcing a deliberate test edit is **the ratchet**, not a burden.

### The runner

ADR-014 deliberately **declined to choose**, on the owner's explicit ruling to settle it at implementation time. Resolved then to **`node --test`** — built into Node ≥20, **zero devDeps**, and it gives real `JSON.parse` + set-comparison assertions where plain `sh` would reduce the crown-jewel assertion to `grep '"fkit-review":"off"'`, **a substring match against a JSON blob that can pass for the wrong reason**.

### The hard gate
**Break one `skills_for_role()` entry and confirm the suite goes red.** *A test that has never failed has not been tested* — hence `test/prove-red.sh`, and the requirement to **demonstrate the red run**, not just report the green one.

`prove-red.sh` mutates a copy of the shell sources with `sed`, runs the suite against the mutant, and asserts it goes red. **The mutation-testing-library question it raises is settled and closed** — [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]: **no library fits, because the SUT decides it.** Mutation-testing libraries mutate source in a language they parse; the closest candidate, Stryker, mutates JS/TS and **cannot mutate shell** — it would mutate `bin/release.mjs` and the test files, i.e. everything except the product. So ADR-014's zero-devDeps principle was never actually put in tension: **there was no contender to trade it for.** Do not re-propose a mutation-testing library without naming one that **mutates shell**.

### The parity test — scoped, not built
[[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] adds a **fourth** thing in scope: `test/dual-home-parity.test.js` asserting every fkit-authored dual-homed file is byte-identical across `ai-agents/` and `claude/scaffold/ai-agents/`, with an explicit exception list for the deliberately project-specific paths. Same constraints (`node --test`, zero devDeps, repo root). **Order is part of the decision — convention, then a reconciliation of the six drifted files, then the test**; building the test first just produces a red suite nobody can act on. **None of it is built yet.**

## Gotchas / Known Issues

- **Environment traps that make the suite test the wrong thing:** `FKIT_NO_SELF_HOST=1` (the launcher otherwise re-execs into the checkout); `FKIT_NO_UPDATE_CHECK=1`; the temp project's `PROJECT.md` must **not** read as fresh, or the launcher **hijacks every role into `producer`**; `FKIT_SETUP_ONLY=1` exits **before** `build_settings()` runs, so settings-file assertions require actually reaching `exec claude` with the stub on `PATH`.
- **The suite is what caught a real launcher defect.** Assertion 7 (no-args, no-tty, initiated → `fkit-lead`) went red on being made enforcing, exposing [[tasks/fix-headless-menu-guard-crash]] — a dead lead-default on any normal system.
- ⚠️ **`architecture.md` §9.1 is behind the code.** It still names *"zero automated verification"* as the top structural risk and states both high-blast-radius files are *"POSIX shell with no coverage of any kind."* **`claude/fkit-claude.sh` now has coverage** — argv contract + the lockdown matrix. **`install.sh` genuinely still has none**, so the risk is *reduced, not closed*. Flagged for the architect.
- ⚠️ **ADR-014 still presents the runner as an open question**, though `node --test` is shipped and wired to `npm test`. The ADR has not been amended.
- ⚠️ **`prove-red.sh` is not gated by anything — it runs only when a human types it.** Verified 2026-07-19: it is **not in `npm test`**, and there is **no `.github/workflows/` in the tree at all**. That is why the task-43 review's finding **R2** — two silent failures, a baseline going red for the *wrong* reason and a `sed` mutation that had become a **no-op** because its target moved files — was caught by manual audit and nothing else. ADR-026 identifies this correctly as a **gating** problem, not a tooling-sophistication one, and **approves wiring it into an automated gate** (sizing is the coder's call; it plausibly belongs in a `test:full` / CI lane rather than the inner loop). **The brief has not shipped — automated gating is a promise, not a fact.**
- ⚠️ **R2's no-op-mutation failure mode is still open.** ADR-026 Decision 5 records a ~3-line zero-dep guard (assert each mutation actually changed the file) as **offered and not taken** — one of two hardenings, only the first chosen. **Decision 4's gate does not help it**: a no-op mutation produces a passing suite either way, so it still reads as a healthy check. Cheap to re-offer.
- **Still uncovered, and named:** `install.sh` e2e (the `curl | sh` entry point — *it cannot be verified by reading a diff*), a CI workflow (there is no `.github/`), and the **static drift check** across the three hand-maintained mirrors of `skills_for_role()`, which needs a **normalizer** because they use three different naming conventions. All deferred to Sprint 3.
- **Not the tester-agent question.** *"Building the script will teach us almost nothing about whether the tester earns its seat."* The two must not be bundled.

## Related
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]]
- [[tasks/implement-pretooluse-skill-ownership-hook]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]
- [[decisions/adr-003-ci-runs-validate-bundles]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- [[tasks/add-launcher-contract-smoke-script]]
- [[tasks/add-e2e-smoke-script-for-fkit-itself]]
- [[tasks/add-ci-validate-bundles]]
- [[tasks/fix-headless-menu-guard-crash]]
- [[tasks/remove-fkit-resume-passthrough]]
- [[tasks/design-deterministic-dashboard-for-fkit-status]]
- [[systems/role-locked-sessions]]
- [[systems/install-and-self-update]]
- [[systems/fkit]]
- [[tasks/wiki-sync-post-omnigent]]
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — the closed library question and the approved gating fix
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the scoped-but-unbuilt parity test
- [[systems/knowledge-base-structure]] — the conventions the parity test would enforce
- [[tasks/sprint-2-remove-omnigent]]
