# ADR-026: No mutation-testing library is adopted — `prove-red.sh` stays hand-rolled, and ADR-014 Decision 4 stands unamended

**Date**: 2026-07-19
**Status**: accepted

> **What this ADR decides, in one line:** the mutation-testing-library question was investigated and **closed** — no candidate fits a shell SUT tested as a black-box subprocess, so there is nothing to trade ADR-014's zero-devDeps principle *for*.

## Context
`test/prove-red.sh` is fkit's hand-rolled negative-case check: it mutates a copy of the shell sources with `sed`, runs the suite against the mutant, and asserts the suite goes **red**. The task-43 review's finding **R2** found two ways it had failed silently — the baseline went red for the **wrong reason** (a hardcoded absolute path), and a `sed` mutation silently became a **no-op** because its target had moved files. **Neither was caught by tooling — only by a manual audit.** The owner's instinct: *"it looks like we need a proper library for this type of test."*

### Why no library fits — the SUT decides it
- **The product is POSIX shell** (`install.sh`, `fkit-claude.sh`, `fkit-claude-init.sh`, `skill-ownership-hook.sh`), exercised as a **black-box subprocess** with a `node --test` oracle ([[decisions/adr-014-how-fkit-tests-itself]]).
- **Mutation-testing libraries mutate source in a language they parse.** The closest candidate, **Stryker**, mutates JS/TS — **it cannot mutate shell**. It would happily mutate `bin/release.mjs` and the test files, i.e. everything except the product.
- Adopting any candidate breaks ADR-014 Decision 4 (zero devDependencies, no lockfile, no `node_modules`) — to buy a tool that still would not understand the product.

**The ADR-014 tension therefore does not need resolving: it never arises.**

### The real defect R2 exposed was not hand-rolling
Verified: `prove-red.sh` is **not in `npm test`**, and there is **no `.github/workflows/` in the tree at all**. **It runs only when a human types `test/prove-red.sh`.** That is why R2's failures were caught by manual audit and nothing else — a **gating** problem, not a **tooling-sophistication** problem. No library would have fixed it.

## Decision
1. **No mutation-testing library is adopted.** `prove-red.sh` stays hand-rolled — no dependency, no lockfile, no `node_modules`.
2. **ADR-014 Decision 4 stands unamended** — not because the principle beat a contender, but because there was no contender.
3. **This is a tombstone.** *"Just use Stryker"* should not be re-proposed without clearing the re-raise bar.
4. **One interim hardening approved: wire `prove-red.sh` into an automated gate** (owner ruling, 2026-07-19). Converts *"caught only by manual audit"* into *"caught on every run"*. **Sizing is the coder's call** — it makes full `claude/` copies and runs the suite several times, so it plausibly belongs in a `test:full` / CI lane rather than the inner-loop `npm test`. Producer to scope the brief.
5. **The second proposed hardening — assert each mutation actually changed the file — was NOT selected.** A ~3-line, zero-dep guard closing R2's **second** failure mode structurally. Recorded as **offered and not taken**, not rejected on merit. **R2's no-op failure mode therefore remains open**, and Decision 4's gate does not help it — a no-op mutation produces a passing suite either way. Re-offer cheaply if the owner wants it.

## Consequences
- Zero devDependencies, no lockfile — ADR-014's posture intact; the question is closed with its reasoning on record; and the real defect is correctly identified and being fixed.
- **Negative:** `prove-red.sh` remains bespoke shell — no upstream maintenance, its correctness resting on fkit's own tests. **R2's no-op-mutation failure mode is still open** — a mutation whose `sed` target has moved silently produces a passing suite and reads as a healthy check. **This is the known, unmitigated residue.** And **automated gating is a promise, not a fact, until Decision 4's brief ships** — today `prove-red.sh` still runs only when a human types it.
- **Re-raise only if:** a maintained tool appears that genuinely **mutates POSIX shell** and drives a process-level oracle (then an ADR-014 amendment is required **before** implementation — the trigger has not fired); `prove-red.sh` grows beyond a small shell loop; or a **third** silent-failure mode is found (two were tolerable; a pattern is evidence it is under-engineered). Do **not** re-raise *"use a proper mutation-testing library"* without naming a tool that **mutates shell**, or *"prove-red.sh isn't automated"* as a defect against this ADR — that is Decision 4, already approved and awaiting its brief.

## Related
- [[decisions/adr-014-how-fkit-tests-itself]] — **unamended.** Decision 3 already rejected bats/shellspec on the same "no tool fits this shape" finding, reached independently; Decision 4 is the zero-devDeps posture upheld here.
- [[decisions/adr-003-ci-runs-validate-bundles]] — the CI posture whose subject died with the Omnigent removal; **no `.github/workflows/` exists today**, which is why Decision 4's gate has no CI lane to land in yet
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the sibling ruling of the same week: turn a manual audit into an automated gate
- [[systems/testing-and-verification]] — fkit's verification posture, of which `prove-red.sh` is part
- [[tasks/implement-pretooluse-skill-ownership-hook]] — task 43, whose review finding R2 triggered this investigation
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[systems/knowledge-base-structure]]
