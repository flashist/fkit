# Add the launcher-contract test suite

## ID
0006

## Sprint
Sprint 2

## Priority
23

## Status
✅ Done

## Owner
fkit-coder

## Context

**fkit has zero automated verification.** No CI, no test suite, no `.github/`. Its only automated check
was `omnigent/validate-bundles.sh`, which validated *Omnigent bundle structure* and correctly died with
the runtime it checked. There has never been an equivalent for the Claude flavor.

Task 7's release gate passed — but it was **a one-off manual run by a human**. Nothing stops the next
change silently breaking `curl | sh`.

**Why this is cheap:** *fkit is not an LLM product from a test-harness point of view — it is a **shell
product that launches an LLM**.* `exec claude …` (`claude/fkit-claude.sh:389`) is a clean boundary, and
everything on fkit's side of it is a **pure function** of (argv, project state, env) → (exit code, the
argv handed to `claude`, the files written). Stub `claude` on `PATH` and the whole role-lock contract
falls out as text in milliseconds — no model, no auth, no cost, no flake.

**Why it matters more here than in most projects: fkit's failure mode is *silent-wrong*, not crash.**
`fkit --resume` at `HEAD` does not error — it hands you a working session **with the wrong role's
authority**. A skill missing from `skills_for_role()` does not crash — the role just quietly cannot do
its job. Silent-wrong is exactly the class a human misses by eyeballing and a test catches trivially.

## ⚠️ Rewritten 2026-07-13 — the vehicle changed, the scope did not

**This brief originally specified one hand-rolled POSIX `sh` script**, with the instruction *"resist
growing this into a test framework — no bats, no node, no devDependencies."* **The owner challenged
that and was right.** fkit-architect re-evaluated and overturned it.

The original instruction confused a **policy** (keep the assertion set small) with a **mechanism** (use
a bad runner so it's unpleasant to grow). Those are separable, and choosing a worse tool to enforce
discipline never works — the discipline gets abandoned *and* you are stuck with the worse tool. Nine
hand-rolled assertions with usable failure output require an `assert_eq()`, a temp-dir `trap`, a
pass/fail counter and an exit roll-up: **that is a framework**, just an undocumented, untested,
single-user one. It also has no test isolation (one failure hides the rest), no "run just this one",
and — the real problem — **no place for test #10**, so the next person appends until there are 400
lines nobody wants to port.

**The "no dependencies" argument was defending a threat that does not exist.** `install.sh:43` is
`cp -R "$TMP/src/claude" "$SHARE/claude"` — the installer copies **only `claude/`**. Not the repo root,
not `package.json`, not `test/`. **Test infrastructure at the repo root cannot reach a consuming project
by construction.** The `curl | sh` promise was never at risk. The only real cost is contributor
friction.

## What to build

**Governed by [ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md) — read it
first.** It records what is settled and what is deliberately still open. **Do not re-derive either.**

### Settled — these are locked (ADR-014)

- **Zero devDependencies. No lockfile. No `node_modules`.** The repo has none today and must still have
  none afterwards — **adding a lockfile would be the actual regression.** This binds *both* candidate
  runners, so it is settled independently of the runner choice.
- **Scope = black-box process contract.** The argv fkit hands to `claude` (including **whether it
  exec'd at all**), and the `skillOverrides` map in `.fkit/settings/<role>.json`. **Not** shell
  internals. **Not** LLM behavior.
- **bats-core and shellspec are rejected.** Shell-*internals* harnesses — their value is mocking and
  sourcing shell functions in isolation, which nothing here needs. bats notably ships a process runner
  and **no JSON parser**, which is the one thing the crown-jewel assertion actually requires.
- **Test infra never ships to consumers.** `install.sh:43` copies **only `claude/`** — so repo-root
  tests cannot reach a consuming project by construction. *(This is why "no dependencies" is **not** an
  argument here: it was defending the `curl | sh` story from a threat that does not exist. Do not
  resurrect it.)*
- **The 7×21 matrix is hard-coded in the test** — see Group B.

### ⚠️ OPEN — the runner is NOT decided. Settle it when you pick this task up.

> **Owner ruling (2026-07-13):** *"I don't know — leave it as an open question that needs additional
> investigation and discussion at the time the task is going to be done."*
>
> **An earlier draft of this brief stated "Runner: `node --test`" as settled. That was wrong** — it
> asserted exactly the decision the owner declined to make. Corrected.

**The two candidates, fairly:**

| | For | Against |
|---|---|---|
| **`node --test`** | Built into Node ≥20 — **zero devDeps**, no lockfile, `npm test` works on a fresh clone with no install step. Node is already in the toolchain (`bin/release.mjs`) and already a de facto fkit prerequisite (`install.sh:131` tells users to `npm install -g @openai/codex`). **Real JSON assertions** (`JSON.parse` + set comparison), test isolation, per-test failure diffs. | A shell tool tested from JavaScript. A contributor who only edits skill markdown now needs Node to run the suite. |
| **plain `sh` + a documented assert helper** | Shell tool, shell tests. No Node needed by any contributor. | You write the assert helper, the temp-dir trap, the pass/fail counter and the exit roll-up anyway — **that is a framework**, just an undocumented one. No test isolation. And the crown-jewel assertion becomes `grep '"fkit-review":"off"'` — **a substring match against a JSON blob, which can pass for the wrong reason.** |

**Decision criteria, in ADR-014's order — do these, don't argue from taste:**

1. **Write assertion #8 both ways for one role and compare.** If `sh` cannot express *"off for every
   non-owned skill, off for **none** it owns, nor any `CONSULT_SKILLS`"* without becoming a JSON parser
   built out of `grep`, **node wins on merits.** This is the dispositive experiment — run it.
2. **Ask the owner whether *"shell tool, shell tests"* is a stated value.** Dispositive if yes.
3. **Can anyone name a real Node-less contributor?** If not, the objection is hypothetical.

**Both candidates already satisfy every settled point above**, so the runner choice **cannot reopen
anything in that list.**

### Scope — unchanged, and it stays this size

Stub `claude` and `codex` on `PATH` (print `$*`). Temp project dir. **No network, no model, no auth,
seconds not minutes.**

**Group A — the argv contract** *(assert the argv fkit exec's, **not** the exit code)*

| # | Assertion |
|---|---|
| 1 | Each of the 7 roles → exactly `--agent fkit-<role> --settings .fkit/settings/<role>.json`; the `adv` / `adversarial` aliases → `fkit-adversarial-reviewer`. |
| 2 | `fkit --resume` → non-zero **and `claude` was never exec'd**. |
| 3 | An arbitrary unknown first arg → same. |
| 4 | `fkit --help` → exit 0, no exec. |
| 5 | `fkit update` is **not** swallowed by the usage-error branch (it exits at `:107-121`, above the guard). Task 18's brief flags exactly this regression risk. |
| 6 | `fkit coder --debug` → passthrough after a **named role** still works. |
| 7 | No-args, no-tty, **initiated** project → `--agent fkit-lead`. |

**Assertion 2 is why exit codes are not enough.** At `HEAD`, `fkit --resume` **exits 0** and launches a
session — green exit, broken invariant. *"`claude` was never exec'd"* is the assertion that catches it.

**Group B — the lockdown matrix** *(the crown jewel; needs no LLM)*

| # | Assertion |
|---|---|
| 8 | For each of the 7 roles, `JSON.parse(.fkit/settings/<role>.json)` turns **off** every non-owned `fkit-*` skill and turns off **none** it owns (nor any `CONSULT_SKILLS`). |
| 9 | Negative control: `coder.json` sets `"fkit-review": "off"` and does **not** disable `fkit-plan-task`. |

> **⚠️ Hard-code the 7×21 matrix in the test. Do NOT derive it from `skills_for_role()`.**
>
> **This reverses an instruction in the earlier brief and in
> [`add-e2e-smoke-script-for-fkit-itself.md`](../../cancelled/0004-add-e2e-smoke-script-for-fkit-itself/brief.md):65-67**, which
> both said to drive the expected matrix from `skills_for_role()` rather than hard-code a second copy.
> That is wrong, and it is the classic testing error: **a test whose oracle is the implementation tests
> nothing** — break the matrix and the test's expectations break with it, in lockstep, and it still
> passes.
>
> The hard-coded matrix **is the contract.** Forcing a deliberate test edit when a role's skills change
> is not a maintenance burden — **it is the ratchet**, and it makes the test the one *enforcing* mirror
> among the three hand-maintained ones flagged at `fkit-claude.sh:222-228` (the drift that has
> [already bitten once](../../../../claude/fkit-claude.sh)).

### The hard gate — do not skip it

**Break one `skills_for_role()` entry and confirm the suite goes red.** A test that has never failed has
not been tested. **Demonstrate the red run**, don't just report the green one.

### Environment gotchas — get these wrong and the suite tests the wrong thing

- **`FKIT_NO_SELF_HOST=1`** — `fkit-claude.sh:39-46` otherwise re-execs into the checkout.
- **`FKIT_NO_UPDATE_CHECK=1`** — `:124`.
- The temp project's `PROJECT.md` must **not** read as fresh, or `:337` **hijacks every role into
  `producer`**.
- **`FKIT_SETUP_ONLY=1` exits at `:286`, before `build_settings()` runs (`:257`)** — so the
  settings-file assertions require actually reaching `exec claude`, with the stub on `PATH`.

## Verification steps

- `npm test` exits 0 on a clean tree, in seconds, with **no network and no real `claude` on `PATH`**.
- It exits **non-zero** when a `skills_for_role()` entry is deliberately broken. **Show this.**
- It exits **non-zero** against `HEAD`'s `fkit --resume` behavior (exit 0 + session launched) — i.e. it
  would have caught the bug task 18 removes. **This is the proof the assertions are the right ones.**
- **`git status` is clean after a run** — nothing written outside temp dirs. Run it twice.
- **No `node_modules/`, no lockfile, no devDependencies** appear in the repo.
- `npm test` works on a **fresh clone with no install step**.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 18** (`remove-fkit-resume-passthrough`) — it rewrites the exact argv surface this
  suite asserts against, and its brief warns the two "collide." **Land 18 first, then pin it here.** If
  the coder is already in `fkit-claude.sh` for 18, doing both in one pass turns 18's six manual
  verification steps into a durable artifact.
- **Deferred to Sprint 3** (do **not** build here): `install.sh` e2e in CI, a GitHub Actions workflow,
  and the **static drift check** across the three hand-maintained mirrors of `skills_for_role()`
  (`fkit-claude.sh:230-241`, `skills/fkit-team/SKILL.md:50`, `claude/README.md:43`). They are currently
  in sync but use **three different naming conventions** (`fkit-task-plan` vs `task-plan`), so that
  check needs a normalizer — real work, correctly deferred.
- **Not the tester-agent question.** Per
  [`2026-07-13-tester-agent-evaluation.md`](../../../knowledge-base/reports/2026-07-13-tester-agent-evaluation.md):
  *"building the script will teach us almost nothing about whether the tester earns its seat."* **Do
  not bundle them.**
- Technical picture: **fkit-architect** (2026-07-13, two consults — the second overturning the first on
  the owner's challenge).
- Risk: **low.** New files, no production-code change, no runtime behavior change.
- **The tradeoff, stated plainly:** a contributor who only edits skill markdown now has a suite they
  cannot run without Node. Given fkit's own installer already requires npm, that cost is judged ~zero —
  but it is the cost.

## Open questions for the owner

1. **Fresh-project routing must be pinned.** On a *fresh* project with no args and no tty the launcher
   routes to **producer** with a seed prompt, not `lead` (`fkit-claude.sh:337` — the fresh branch has no
   tty check). Probably intended, but **the test must pin one behavior**, so someone has to rule.
2. **Record an ADR for "how fkit tests itself"?** fkit-architect recommends one — *runner = `node:test`,
   zero devDeps, tests never ship to consumers, scope = black-box process contract* — with a
   **re-raise-only-if**: we need to assert on shell *internals* in isolation (→ shellspec), or Node
   stops being a de facto prerequisite. **Without it, this decision gets re-argued every sprint.**
3. **Does a red suite gate `Done`?** Advisory, or a release gate? It changes how much the coder invests
   in failure output.
4. **Is *"shell tool, shell tests"* a value you want to hold?** It is the only argument left for plain
   `sh` once the consumer-cost argument is gone. If yes, say so and this gets re-scoped to `sh` + a
   documented assert helper — but then it should be an **explicit choice**, not a default.
