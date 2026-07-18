# ADR-026: No mutation-testing library is adopted — `prove-red.sh` stays hand-rolled, and ADR-014 Decision 4 stands unamended

- **Status:** accepted
- **Date:** 2026-07-19
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Evidence:** [`reports/2026-07-18-mutation-testing-library-adoption.md`](../reports/2026-07-18-mutation-testing-library-adoption.md)
  (task 46). Investigation triggered by the owner's reaction to review finding **R2** on task 43 —
  *"it looks like we need to use a proper library for auto-tests, which handles this specific type of
  tests 'testing negative cases'."*

> **What this ADR decides, in one line:** the mutation-testing library question was investigated and
> **closed** — no candidate fits a shell SUT tested as a black-box subprocess, so there is nothing to
> trade ADR-014's zero-devDeps principle *for*.

## Context

`test/prove-red.sh` is fkit's hand-rolled negative-case check: it mutates a copy of the shell sources
with `sed`, runs the suite against the mutant, and asserts the suite goes **red**. R2 found two ways it
had failed silently (task-43 review):

- the baseline went red for the **wrong reason** (a hardcoded absolute path);
- a `sed` mutation silently became a **no-op** because its target had moved files.

**Neither was caught by tooling — only by a manual audit.** The owner's instinct was that a proper
library would handle this class of test.

### Why no library fits — the SUT decides it

The investigation named the system under test precisely, because that is what settles the question:

- **The product is POSIX shell** (`install.sh`, `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`,
  `claude/skill-ownership-hook.sh`), exercised as a **black-box subprocess** with a Node `node --test`
  oracle ([ADR-014](adr-014-how-fkit-tests-itself.md) Decisions 1–2).
- **Mutation-testing libraries mutate source in a language they parse.** The closest candidate,
  **Stryker**, mutates JavaScript/TypeScript — **it cannot mutate shell**, which is the only code
  `prove-red.sh` mutates. It would happily mutate `bin/release.mjs` and the test files, i.e. everything
  except the product.
- Adopting any candidate breaks **[ADR-014](adr-014-how-fkit-tests-itself.md) Decision 4** (zero
  devDependencies, no lockfile, no `node_modules`) — to buy a tool that still would not understand the
  product.

**The ADR-014 tension therefore does not need resolving: it never arises.** There is no candidate to
weigh against the principle. **ADR-014 Decision 4 stands unamended.**

### The real defect R2 exposed was not hand-rolling

Verified: `prove-red.sh` is **not in `npm test`** (`package.json:5` = `node --test test/*.test.js`), and
there is **no `.github/workflows/` in the tree at all** — `prove-red` appears in no CI config. **It runs
only when a human types `test/prove-red.sh`.**

That is why R2's two failures were caught by manual audit and nothing else. It is a **gating** problem,
not a **tooling-sophistication** problem, and no library would have fixed it.

## Decision

1. **No mutation-testing library is adopted.** `prove-red.sh` stays hand-rolled. No dependency, no
   lockfile, no `node_modules`.
2. **ADR-014 Decision 4 stands unamended.** Not because the principle beat a contender — because there
   was no contender.
3. **This is a tombstone.** *"Just use Stryker"* (or any mutation-testing library) should not be
   re-proposed without first clearing the bar in "re-raise only if".
4. **One interim hardening is approved: wire `prove-red.sh` into an automated gate** (owner ruling,
   2026-07-19). It converts *"caught only by manual audit"* into *"caught on every run"* — the property
   whose absence R2 cost us. **Sizing is the coder's call:** `prove-red.sh` makes full `claude/` copies
   and runs the suite several times, so it plausibly belongs in a `test:full` / CI lane rather than the
   inner-loop `npm test`. *(Producer to scope the brief; owner: fkit-coder. Not authorized by the
   investigation brief and not authorized here.)*
5. **The second proposed hardening — assert each mutation actually changed the file — was NOT
   selected.** It is a ~3-line, zero-dep guard that closes R2's **second** failure mode (the silent
   no-op mutation) **structurally**. Recorded as **offered and not taken**, not as rejected on merit:
   it was one of two options and only the first was chosen. **R2's no-op failure mode therefore remains
   open**, mitigated only in that Decision 4's gate would run the check more often — which surfaces a
   *no-op* mutation no better than today, since a no-op mutation produces a passing suite either way.
   Re-offer this cheaply if the owner wants it.

## Options considered

- **Stay hand-rolled; adopt no library (chosen).** The only option consistent with the SUT. Zero cost,
  zero deps, preserves ADR-014.
- **Adopt Stryker.** The closest fit and still not one: it **cannot mutate shell**. Rejected on
  capability first, ADR-014 Decision 4 second. Rejecting it on the ADR alone would have been the weaker
  and slightly dishonest framing — it fails before the principle is even reached.
- **Adopt a general mutation framework and hand-write shell mutators.** Rejected: that is
  `prove-red.sh` with a dependency and a plugin API bolted on — more machinery for the same hand-rolled
  mutation logic, plus a devDependency and a lockfile.
- **Amend ADR-014 Decision 4 to permit devDeps for testing.** Rejected as premature and unmotivated:
  an amendment should be bought by a concrete tool worth having. None exists.

## Consequences

- **Positive:**
  - **Zero devDependencies, no lockfile, no `node_modules`** — ADR-014's posture intact.
  - **The question is closed with its reasoning on record**, so the next person who reaches for Stryker
    finds *why it cannot work here* rather than re-running the survey.
  - **The real defect is correctly identified and being fixed** (Decision 4) — the gap was *nothing runs
    the check*, not *the check is unsophisticated*.

- **Negative / costs:**
  - **`prove-red.sh` remains bespoke shell** — no upstream maintenance, no community mutators, and its
    correctness rests on fkit's own tests. Accepted: it is small, and the alternative does not exist.
  - **R2's no-op-mutation failure mode is still open** (Decision 5). A mutation whose `sed` target has
    moved silently produces a passing suite and reads as a healthy check. **This is the known,
    unmitigated residue of this decision.**
  - **Automated gating is a promise, not a fact, until Decision 4's brief actually ships.** Today
    `prove-red.sh` still runs only when a human types it.

- **Residual risks / "re-raise only if":**
  - **A maintained tool appears that genuinely mutates POSIX shell** and drives an external
    process-level oracle. That is the only shape that fits. **Then, and only then**, an
    **ADR-014 amendment or superseding decision** — architect-owned, owner present — is required
    **before** any implementation. The trigger has not fired.
  - **`prove-red.sh` grows beyond a small shell loop** — if its mutation logic becomes complex enough to
    need its own tests, the build-vs-buy calculus changes and this should be re-run.
  - **A third silent-failure mode is found in `prove-red.sh`.** Two (R2) were tolerable; a pattern is
    evidence the hand-rolled approach is under-engineered for its job. Reopen.
  - Do **not** re-raise *"we should use a proper mutation-testing library"* without naming a tool that
    **mutates shell**. The survey's finding is a capability fact, not a preference.
  - Do **not** re-raise *"prove-red.sh isn't automated"* as a defect against this ADR — that is
    Decision 4, already approved and awaiting its brief.

## Related

- [`reports/2026-07-18-mutation-testing-library-adoption.md`](../reports/2026-07-18-mutation-testing-library-adoption.md)
  — the investigation: the SUT definition, the candidate survey, §4 the two interim hardenings, §5 the
  ADR-014 tension left open for this ruling.
- [ADR-014](adr-014-how-fkit-tests-itself.md) — **unamended.** Decisions 1–2 (black-box process
  contract), Decision 3 (bats/shellspec already rejected — the same "no tool fits this shape" finding,
  reached independently), **Decision 4 (zero devDeps / no lockfile / no `node_modules`)**, Decision 5
  (hard-coded oracle).
- [ADR-003](adr-003-ci-runs-validate-bundles.md) — the CI posture whose subject died with the Omnigent
  removal. **No `.github/workflows/` exists today**, which is why Decision 4's gate has no CI lane to
  land in yet; the sizing call interacts with this.
- Task 43 review: [`ai-agents/reviews/implement-pretooluse-skill-ownership-hook.md`](../../reviews/implement-pretooluse-skill-ownership-hook.md)
  — finding **R2**, fixed within task 43. This ADR is the forward-looking library question only.
- Code, verified: `test/prove-red.sh` (the shell-mutation loop); `package.json:5` (`npm test` — does
  **not** include `prove-red.sh`).
- **Wiki:** **fkit-wiki** should ingest this ADR if the vault records fkit's testing posture — an
  architect never writes the vault.
