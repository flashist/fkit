# Testing & Verification

**Layer**: shared
**Key files**: `test/harness.mjs`, `test/launcher-contract.test.js`, `test/skill-ownership-hook.test.js`, `test/dashboard-contract.test.js`, `test/converge-contract.test.js`, `test/orphan-cleanup.test.js`, `test/rules-block-budget.test.js`, `test/prove-red.sh`, `package.json` (`"test": "node --test test/*.test.js && bash test/prove-red.sh"`), `claude/fkit-claude.sh` (the subject), `install.sh:43`

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
2. **The settings written to `.fkit/settings/<role>.json`.** ⚠️ **What this asserts changed at task 43 / [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]** *(corrected 2026-07-19 — this page previously described the retired shape as current)*. The per-role `skillOverrides` "off" list — **the "7×21 lockdown matrix"** — and the `CONSULT_SKILLS` exception list are **RETIRED**. Both were session-scoped: they governed what the *launching process* could see, not who was actually calling, which **is the bug class task 43 fixed.** Group B now owns a much narrower, **role-independent** question: does `build_settings()` wire the hook into every role's settings? Same hook, same matcher, every role — so there is nothing role-shaped left in this file to hard-code.
3. **The per-role/per-skill matrix still exists — it moved.** It lives in `test/skill-ownership-hook.test.js`, which tests the hook as a pure function of (PreToolUse JSON payload) → (exit code, stderr): fixtures-in, exit-code-out, no model or network. Its deny assertions **pin the exact JSON shape**, not just the exit code — an owner decision after the JSON route was live-verified to **silently fail OPEN** when a required `hookEventName` field was omitted. Pinning the exit code alone would not have caught the very mistake that motivated the shape.

[[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]] rule 4 **widens the fence** further: the **stdout contract of a shipped skill executable** (`test/dashboard-contract.test.js`).

**The suite has grown past ADR-014's "exactly two things… and it stays this size".** Seven files now sit under `test/`: the launcher contract, the hook contract, the dashboard contract, plus `converge-contract`, `orphan-cleanup`, `rules-block-budget` and `prove-red.sh`. Each addition traces to a decision (ADR-017, ADR-018, the convergence and orphan-cleanup work), so this is **growth by ruling, not drift** — but ADR-014's size claim no longer describes the tree.

**Out of scope, deliberately:** shell internals (no sourcing/mocking individual functions — which is why bats-core and shellspec were rejected) and LLM behavior (no model, no auth, no network).

### The two load-bearing rules

- **Test infrastructure never ships to consumers.** `install.sh:43` copies **only `claude/`** — so repo-root `test/` is **physically incapable** of reaching a consuming project. This also killed the *"no dependencies protects `curl | sh`"* premise: it was defending a threat that does not exist. The only real cost of a test dependency is **contributor friction**.
- **The expected matrix is HARD-CODED, never derived from `skills_for_role()`.** *A test whose oracle is the implementation tests nothing* — derive the expectations and breaking the matrix breaks the expectations in lockstep, and it still passes. **The hard-coded copy *is* the contract**, and forcing a deliberate test edit is **the ratchet**, not a burden. **The principle survived task 43; only its address changed** — the hard-coded per-role/per-skill oracle now lives in `test/skill-ownership-hook.test.js`, not in the launcher suite.
- **But one thing must NOT be hard-coded, and that is a real lesson:** the launcher suite derives the hook path from *the launcher actually under test*, never from this checkout's repo root. `prove-red.sh` runs the suite against **full mutant copies of `claude/`** under a temp dir, which generate their own correctly-different absolute paths; a hard-coded path would never match a copy's settings and would fail even the "unmutated copy must be green" baseline.

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
- ✅ **`prove-red.sh` IS gated — ADR-026 Decision 4 has shipped** *(corrected 2026-07-19; this page briefly claimed the opposite)*. `package.json` reads `"test": "node --test test/*.test.js && bash test/prove-red.sh"` — the mutation check runs on **every `npm test`**, in the inner loop rather than the `test:full`/CI lane ADR-026 floated. It landed in commit `0ad055a`, **2026-07-18 21:34**.
  > **LINT WARNING — the ADR's own premise was already false when it was written, and the wiki repeated it.** ADR-026 is dated **2026-07-19** and asserts, as a verified fact, that `prove-red.sh` is *"not in `npm test`"* and *"runs only when a human types it"* — but the wiring had landed **the previous evening**. Decision 4 therefore reads as approving future work that was already done. **Two failures, not one:** the ADR asserted a code fact without re-checking it, and this wiki page then **repeated that claim as current without verifying it** — an `evidence-before-assertion` violation on the librarian's side, found only by this lint. The ADR is architect-owned and needs its Context and Decision 4 revisited. **What is genuinely still open is R2's no-op-mutation mode** (below) — that part of ADR-026 stands.
- **This is why the sync filter's blind spot matters:** `package.json` lives outside `ai-agents/`, so a delta sync scoped to `ai-agents/` **cannot see product-code changes that falsify a knowledge-base claim.** The gate shipped inside the very window that was synced, and the sync had no way to notice.
- ⚠️ **R2's no-op-mutation failure mode is still open — and now it is the *only* unmitigated half.** ADR-026 Decision 5 records a ~3-line zero-dep guard (assert each mutation actually changed the file) as **offered and not taken** — one of two hardenings, only the first chosen. **Decision 4's gate, now shipped, does not help it**: a no-op mutation produces a passing suite either way, so it still reads as a healthy check *and now does so on every `npm test`*. Cheap to re-offer.
- **Still uncovered, and named:** `install.sh` e2e (the `curl | sh` entry point — *it cannot be verified by reading a diff*), a CI workflow (there is no `.github/`), and the **static drift check** across the three hand-maintained mirrors of `skills_for_role()`, which needs a **normalizer** because they use three different naming conventions. All deferred to Sprint 3.
- **Not the tester-agent question.** *"Building the script will teach us almost nothing about whether the tester earns its seat."* The two must not be bundled.
  > **The tester question is now RULED — and the separation above held.** [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] (2026-07-19) authorizes an eighth **tester** seat on **sandbox authority**, over the architect's and producer's recommendation. It was decided on its own merits, **not** as a conclusion drawn from the smoke script — exactly as the producer insisted. **What the two questions genuinely share is sequencing:** ADR-028 Decision 7 puts fkit's own regression gate **first**, *"the bigger risk and it's cheap — full stop, not as an experiment."*
  > **Verified 2026-07-19, and the picture is better than ADR-028 assumed:** the task it sequenced against, [[tasks/add-e2e-smoke-script-for-fkit-itself]], is **cancelled** — superseded by task 23, which is **Done**. **The two things the tester actually waits behind are the two named on this page:** ADR-026 Decision 4's automated gate *(shipped 2026-07-18 — see above; ADR-028 did not know this either)* and **the still-absent `.github/` workflow** ([[decisions/adr-003-ci-runs-validate-bundles]]).
  > ⚠️ **And this page is where the tester's own limit is recorded:** per [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] a tester **subagent cannot verify fkit's session lockdown** — it inherits the caller's overrides and would green the caller's settings. **On fkit's single most important invariant, an agent is strictly worse than a script.**

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
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the tester seat, sequenced **behind** this page's remaining gaps
- [[tasks/investigate-mutation-testing-library-adoption]] — task 46, the investigation behind ADR-026
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]] — task 49, the investigation behind ADR-027
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-029-stop-hook-enforces-turn-completion-contract]] — a second hook whose session-scoped behaviour fkit **cannot fully test itself**; automated coverage reaches its script logic against synthetic payloads only
