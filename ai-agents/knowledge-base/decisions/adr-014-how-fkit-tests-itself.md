# ADR-014: How fkit tests itself — black-box process contract, zero devDeps; runner deliberately left open

- **Status:** **accepted** on the settled points below — **with one named open question** (the test
  *runner*), which the owner has **explicitly declined to settle** until task 23 is picked up. The
  runner is **not** decided by this ADR and must not be read as decided.
- **Date:** 2026-07-13
- **Deciders:** owner (Mark Dolbyrev), relayed via fkit-producer; analysis and recording by
  fkit-architect (two consults, 2026-07-13 — the second overturning the first on the owner's challenge)

> **Why this ADR exists.** Not to pre-empt the runner conversation — to make it **short**. Two
> independent consults on the same day re-derived the same arguments from scratch, one of them from a
> **false premise** (see "The fact that kills the dependency argument"). This ADR records the facts and
> the rejected options so that the discussion at task-23 time starts from here instead of from zero.
> Everything under "Settled" is closed. The one thing under "Open" is genuinely open.

## Context

fkit has **zero automated verification** — no CI, no test suite, no `.github/`. Its only automated
check was `omnigent/validate-bundles.sh` ([ADR-003](adr-003-ci-runs-validate-bundles.md)), which
validated *Omnigent bundle structure* and correctly died with the runtime it checked
([ADR-009](adr-009-claude-code-native-is-the-only-runtime.md)). There has never been an equivalent for
the Claude flavor.

Three forces make this a real decision rather than a chore:

1. **fkit's failure mode is *silent-wrong*, not crash.** `fkit --resume` at `HEAD` does not error — it
   hands you a working session with the **wrong role's authority**. A skill missing from
   `skills_for_role()` (`claude/fkit-claude.sh:230-241`) does not crash — the role just quietly cannot
   do its job. Silent-wrong is exactly the class a human misses by eyeballing.

2. **fkit is not an LLM product from a test-harness point of view — it is a shell product that
   launches an LLM.** `exec claude …` (`claude/fkit-claude.sh:389`, and `:337` for the fresh-project
   producer branch) is a clean boundary. Everything on fkit's side of it is a **pure function** of
   (argv, project state, env) → (exit code, the argv handed to `claude`, the files written). Stub
   `claude` on `PATH` and the entire role-lock contract falls out as text in milliseconds — no model,
   no auth, no cost, no flake.

3. **The role lockdown is the crown jewel and it is a JSON artifact.** `build_settings()`
   (`claude/fkit-claude.sh:257-267`) writes `.fkit/settings/<role>.json` containing a `skillOverrides`
   map — 21 skills × 7 roles. That map **is** the session lock ([ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md),
   [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md)) — the property reviewer
   independence rests on.

### The fact that kills the dependency argument — verified, load-bearing

`install.sh:43` is:

```sh
cp -R "$TMP/src/claude" "$SHARE/claude"
```

The installer copies **only `claude/`**. Not the repo root, not `package.json`, not `test/`.
**Repo-root test infrastructure is physically incapable of reaching a consuming project.**

Therefore: **"no dependencies protects the `curl | sh` story" is a false premise.** It was never at
risk. This is the single most load-bearing fact in the whole analysis and the one most likely to be
re-litigated from the wrong assumption — the first of the day's two consults reasoned from it and
reached a different conclusion. It is recorded here precisely so that cannot happen a third time. The
only real cost of a test dependency is **contributor friction**, and that is the cost that must be
argued — not consumer install weight.

## Decision — what is SETTLED

### 1. Test infrastructure never ships to consumers

Tests live at the **repo root** (`test/`), outside `claude/`. Per `install.sh:43` this is structural,
not a convention to be careful about: the installer cannot copy them. Any future proposal to test
fkit's *consumer-side* behavior must justify itself separately — it is not this decision.

### 2. Scope = the black-box process contract, and it stays this size

In scope, exactly two things:

- **the argv fkit hands to `claude`** — including *whether it exec'd at all*, which is the assertion
  that catches `--resume` (green exit, broken invariant);
- **the `skillOverrides` map in `.fkit/settings/<role>.json`** — the 7×21 lockdown matrix.

Out of scope, deliberately: **shell internals** (no sourcing/mocking individual functions) and **LLM
behavior** (no model, no auth, no network — seconds, not minutes). `exec claude …` is the boundary and
the suite asserts up to it, never past it.

### 3. bats-core and shellspec are rejected

Both are shell-***internals*** harnesses; their value is mocking and sourcing shell functions in
isolation — **a problem fkit does not have** (see scope above). They cost an install step and the
`bats-assert` / `bats-support` submodule tax, and bats gives you a process runner with **no JSON
parser**, which is the one thing the crown-jewel assertion actually needs. **Do not re-argue these.**

### 4. Zero devDependencies, no lockfile, no `node_modules` — whichever runner wins

The repo has none today (`package.json` has no `dependencies` or `devDependencies` field; no
`package-lock.json`; no `node_modules/`) and must still have none afterwards. **Adding a lockfile would
be the actual regression.** The suite must run on a fresh clone with **no install step**. This
constraint binds *both* candidate runners and is therefore settled independently of the runner
question. It is consistent with [ADR-011](adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md),
which keeps `package.json` for `scripts` + versioning and adds no install surface.

### 5. The expected 7×21 matrix is HARD-CODED in the test — never derived from `skills_for_role()`

**A test whose oracle is the implementation tests nothing.** Derive the expectations from
`skills_for_role()` and breaking the matrix breaks the test's expectations in lockstep — it still
passes. The hard-coded copy **is the contract.** Forcing a deliberate test edit when a role's skills
change is not a maintenance burden — **it is the ratchet.**

This **reverses** the instruction in the earlier brief and in
`ai-agents/tasks/backlog/add-e2e-smoke-script-for-fkit-itself.md:65-67`, which both said to drive the
matrix from `skills_for_role()`. That instruction is wrong; this ADR overrides it.

It also makes the test the one **enforcing** mirror among the three hand-maintained copies of
`skills_for_role()` flagged at `claude/fkit-claude.sh:222-228` — a drift that has already bitten once
(task 14 added `fkit-task-plan` to the function and the producer's agent file but not to fkit-team's
roster; `/fkit-team` under-reported the producer's primary procedure for two days).

## OPEN QUESTION — the runner. Not decided. To be settled when task 23 is picked up.

> **`node --test` vs plain `sh` + a documented assert helper.**
>
> The owner was asked directly whether *"shell tool, shell tests"* is a value he wants to hold, and
> ruled: **"I don't know — leave it as an open question that needs additional investigation and
> discussion at the time the task is going to be done."**
>
> **An ADR that locked `node:test` here would be recording a decision the owner did not make.** It is
> therefore recorded as open, with both cases stated fairly — including the parts that cut against the
> architect's own preference — and with the criteria that would settle it.

### Case for `node --test`

- **The crown-jewel assertion is a JSON assertion.** In `sh` you assert the `skillOverrides` map with
  `grep '"fkit-review":"off"'` — a substring match against a JSON blob, **an assertion that can pass
  for the wrong reason**. In node it is `JSON.parse` plus a set comparison. That is the difference
  between testing the invariant and testing a string.
- **Test isolation and per-test failure output.** One failing assertion does not hide the other eight.
- **Costs zero devDeps** — built into Node ≥20.
- **Node is already a de facto fkit prerequisite:** fkit's own installer tells the user to
  `npm install -g @openai/codex` (`install.sh:131`), and the repo's release flow is
  `node bin/release.mjs` (`package.json:5-8`).
- Nine hand-rolled `sh` assertions with usable failure output require an `assert_eq()`, a temp-dir
  `trap`, a pass/fail counter and an exit roll-up — **that is a framework**, just an undocumented,
  untested, single-user one, with no place for test #10.

### Case for plain `sh` + a documented assert helper

- **A shell tool tested in shell.** fkit's product surface is a POSIX script; a suite in the same
  language is inspectable by anyone who can read the thing under test, with no second toolchain in the
  contributor's head.
- **No Node requirement for a contributor who only edits skill markdown** — the majority of fkit's
  content is `claude/skills/**/SKILL.md` and `claude/agents/*.md`. "Node is a *de facto* prerequisite"
  is true for a *user running fkit*; it is a weaker claim for a *contributor editing a markdown file*,
  and that gap is the honest cost.
- The assert-helper objection above is a fair hit, but it is an argument for **documenting and owning**
  the helper, not automatically for importing a runner.

### What would settle it — decide on evidence, not taste

Settle at task-23 time on these, in order:

1. **Write assertion #8 (the 7×21 `skillOverrides` matrix) both ways, for one role, and compare.** This
   is the decisive artifact. If the `sh` version cannot express "turns off every non-owned skill and
   **none** it owns (nor any `CONSULT_SKILLS` — `fkit-claude.sh:252`)" without becoming a JSON parser
   in `grep`, `node --test` wins on the merits and the discussion is over. If a small, honest helper
   *can* express it, the `sh` case is live and #2–#3 decide.
2. **Does the owner want "shell tool, shell tests" as a stated project value?** If yes, that is
   dispositive and `sh` wins — but it must then be an **explicit choice with its cost accepted**, not a
   default that survives because nobody re-examined it.
3. **Contributor-friction check:** is there a realistic contributor who edits only skill markdown and
   has no Node? If nobody can name one, the friction argument is theoretical and stops carrying weight.

**Both candidates already satisfy every settled point above** (repo-root, black-box scope, zero devDeps,
hard-coded matrix). The runner choice therefore changes **only** the assertion ergonomics — it cannot
reopen anything in the Decision section.

## Deferred — Sprint 3, do not build under task 23

- **The static drift check across the three hand-maintained mirrors of `skills_for_role()`** —
  `claude/fkit-claude.sh:230-241` (source of truth), `claude/skills/fkit-team/SKILL.md:50`, and
  `claude/README.md:43`. Verified **currently in sync**, but they use **three different naming
  conventions** (`fkit-task-plan` vs `/fkit-task-plan` vs `task-plan`), so the check needs a
  **normalizer** — real work, correctly deferred. Task 23's hard-coded matrix (settled point 5) covers
  the *behavioral* mirror; this covers the *documentation* mirrors.
- `install.sh` e2e in CI, and a GitHub Actions workflow.

## Options considered

- **Black-box process contract, repo-root, zero devDeps, hard-coded matrix; runner left open
  (chosen)** — records what is actually settled, at full strength, without inventing an owner decision
  that was explicitly withheld. Costs: task 23 opens with a 20-minute decision instead of zero.
- **Lock `runner = node:test` now** — **rejected, and this is the point of the ADR.** It was the
  architect's recommendation and remains the architect's preference, but the owner declined to settle
  it. Recording it as accepted would be recording a decision that was not made, which is the one thing
  an ADR must never do.
- **Mark the whole ADR `proposed`** — rejected: it would leave five genuinely settled points (above all
  the `install.sh:43` fact) formally open, and they are precisely the ones being re-litigated. Half-open
  is not a status; being honest about *which half* is.
- **Write no ADR; let task 23 decide everything** — rejected by the owner ("yes, write the ADR"), and
  rightly: two consults in one day re-derived the same arguments from scratch, one from a false premise.
  Without this record, the third does it again.
- **bats-core / shellspec** — rejected on the merits (settled point 3).

## Consequences

- **Positive:** the false "dependencies break `curl | sh`" premise is killed with a citation and cannot
  return. The scope, the rejected harnesses, the zero-devDeps constraint and the hard-coded-matrix
  ratchet are closed. The runner conversation at task-23 time starts from a stated decision criterion
  instead of from first principles.
- **Negative / costs:** task 23 cannot begin with the runner presumed; the coder (or the owner) must
  spend the criterion-1 spike first. This is a deliberate, owner-chosen cost.
- **A live inconsistency this ADR creates:** the current brief
  `ai-agents/tasks/backlog/add-launcher-contract-smoke-script.md` states **"Runner: `node --test`"** as
  settled and adds `"engines"` to `package.json`. **That brief is now ahead of the actual decision** and
  must be corrected to point at this ADR's open question. **fkit-producer owns that edit** — the
  architect does not touch task briefs.
- **Residual risks / "re-raise only if":**
  - **we ever need to assert on shell *internals* in isolation** (source a function, mock a command
    inside the script) — that is the exact thing bats/shellspec are for, and **shellspec becomes live
    again**. Nothing in the current scope needs it;
  - **Node stops being a de facto prerequisite** — i.e. the reviewer's Codex dependency
    (`install.sh:131`) goes away or stops being installed via npm. That removes the strongest leg of
    the `node --test` case;
  - **test infrastructure ever becomes something a consuming project installs** — that inverts the
    `install.sh:43` fact this ADR rests on, and every conclusion here must be re-derived.

## Related

- `claude/fkit-claude.sh:222-228` (the three-mirror warning), `:230-241` (`skills_for_role()` — source
  of truth), `:252` (`CONSULT_SKILLS`), `:257-267` (`build_settings()` → `skillOverrides`), `:337`,
  `:389` (`exec claude` — the test boundary).
- `install.sh:43` (copies only `claude/` — the load-bearing fact), `install.sh:131` (Codex via npm).
- `package.json` (no `dependencies`/`devDependencies`; `scripts` per ADR-011).
- [ADR-003](adr-003-ci-runs-validate-bundles.md) — the dead Omnigent-era check this replaces.
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md),
  [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) — the lockdown invariant
  the crown-jewel assertion protects.
- [ADR-011](adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md) — `package.json` scope.
- `ai-agents/tasks/backlog/add-launcher-contract-smoke-script.md` (task 23 — needs correcting, see
  Consequences), `ai-agents/tasks/backlog/remove-fkit-resume-passthrough.md` (task 18 — lands first),
  `ai-agents/tasks/backlog/add-e2e-smoke-script-for-fkit-itself.md:65-67` (overridden by settled point 5).
- `ai-agents/knowledge-base/reports/2026-07-13-tester-agent-evaluation.md` — the tester-agent question
  is **separate** and must not be bundled into task 23.
