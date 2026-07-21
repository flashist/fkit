# Add the launcher-contract test suite

**Source**: `ai-agents/tasks/done/0006-add-launcher-contract-smoke-script/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 23

## Goal
Give fkit its **first automated verification**. Stub `claude` and `codex` on `PATH`, drive the launcher in a temp project, and assert the **black-box process contract** — no model, no auth, no network, seconds not minutes. Governed by [[decisions/adr-014-how-fkit-tests-itself]].

## Key Changes

**Rewritten 2026-07-13 — the vehicle changed, the scope did not.** The brief originally specified one hand-rolled POSIX `sh` script with the instruction *"resist growing this into a test framework."* **The owner challenged that and was right.** The instruction confused a **policy** (keep the assertion set small) with a **mechanism** (use a bad runner so it's unpleasant to grow) — and *choosing a worse tool to enforce discipline never works: the discipline gets abandoned **and** you are stuck with the worse tool.* Nine hand-rolled assertions with usable failure output need an `assert_eq()`, a temp-dir `trap`, a pass/fail counter and an exit roll-up — **that is a framework**, just an undocumented one with **no place for test #10**.

**The "no dependencies" argument was defending a threat that does not exist** — `install.sh:43` copies only `claude/`, so repo-root tests **cannot reach a consuming project by construction**.

- **Group A — the argv contract** (7 assertions): each role → `--agent fkit-<role> --settings …`; `fkit --resume` → **non-zero and `claude` never exec'd**; unknown first arg → same; `--help` → exit 0, no exec; `fkit update` not swallowed by the usage-error branch; `fkit coder --debug` passthrough still works; **no-args, no-tty, initiated → `fkit-lead`**.
- **Group B — the lockdown matrix** (the crown jewel): `JSON.parse` each `.fkit/settings/<role>.json`; every non-owned skill **off**, none it owns (nor any `CONSULT_SKILLS`) off. Plus a negative control.
- **Runner: `node --test`** — the open question ADR-014 deliberately left for pickup time, settled here. Wired to `npm test`; zero devDeps, no lockfile.
- **The 7×21 matrix is hard-coded**, reversing the guidance in [[tasks/add-e2e-smoke-script-for-fkit-itself]]. *(⚠️ As-built, 2026-07-15. **That matrix was retired at task 43** — [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — because it was session-scoped. The hard-coded-oracle principle survives; the matrix moved to `test/skill-ownership-hook.test.js`. Recorded by lint 2026-07-19.)*

**Assertion 2 is why exit codes are not enough.** `fkit --resume` **exited 0** and launched a session — green exit, broken invariant. *"`claude` was never exec'd"* is the assertion that catches it.

## Outcome
**Done.** `test/harness.mjs`, `test/launcher-contract.test.js`, `test/prove-red.sh`; `npm test` = `node --test test/*.test.js`. Zero devDependencies, no lockfile, no `node_modules` — runs on a fresh clone with no install step.

**It immediately earned its seat:** making **assertion 7** enforcing turned the suite **red** and exposed a live launcher defect — the headless lead-default was dead code on any normal system ([[tasks/fix-headless-menu-guard-crash]]).
**Deferred to Sprint 3, explicitly:** `install.sh` e2e, a CI workflow, and the static drift check across the three `skills_for_role()` mirrors (it needs a **normalizer** — they use three different naming conventions).

**Open questions raised:** fresh-project headless routing (producer vs lead) must be pinned by someone — reserved as the task's **open question 1**; and whether a red suite gates `Done`.

## Related
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]
- [[tasks/add-e2e-smoke-script-for-fkit-itself]]
- [[tasks/remove-fkit-resume-passthrough]]
- [[tasks/fix-headless-menu-guard-crash]]
- [[systems/testing-and-verification]]
- [[systems/role-locked-sessions]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/add-ci-validate-bundles]]
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the suite whose remaining gaps gate the tester seat
- [[tasks/investigate-mutation-testing-library-adoption]] — task 23 built `prove-red.sh`; task 46 found the real gap was gating it
