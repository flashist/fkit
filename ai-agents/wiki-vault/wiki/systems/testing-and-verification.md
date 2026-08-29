# Testing & Verification

**Layer**: shared
**Key files**: `test/harness.mjs`, `test/prove-red.sh`, `test/*.test.js` (**20 files, measured 2026-08-13** — the seven this line named until now, plus `adr-number-uniqueness`, `askuserquestion-marker-hook`, `closed-rank-immutability`, `dual-home-parity`, `shiploop-marker-hook`, `skill-frontmatter`, `structure-check`, `structure-manifest`, `structure-notice`, `structure-repair`, `structure-spec`, `task-id-uniqueness`, `turn-completion-hook`, `update-banner`), `test/dual-home-parity-exceptions.mjs`, `package.json` (`"test": "node --test test/*.test.js && bash test/prove-red.sh"`), **`.github/workflows/test.yml`** *(added 2026-08-12, task `0256`)*, `bin/release.mjs` (the in-release gate), `claude/fkit-claude.sh` (the subject), `install.sh`

> ⚠️ **LINT 2026-08-13 — this `**Key files**` line was stale and has been rewritten in place** (a living systems page, per the 2026-08-06 lint precedent). It named **7 of the then-20** `*.test.js` files and neither of the two gates. The **enumerated count is the risk this line carries**: it goes stale on the next test file, and nothing checks it.
>
> ⚠️ **And it went stale on the next test file, exactly as predicted — 2026-08-14, one day later.** `test/release-summary.test.js` landed with task `0288`: **21 `*.test.js` files**, measured on disk this sync. ⛔ **The count above is left byte-identical as the record of the prediction**; the current number is here. *Nothing detected the drift — a sync noticed it.*

> ⚠️ **LINT 2026-08-29 — stale a THIRD time, and the count is now the one this page has predicted twice.** ⛔ **Both counts above are left byte-identical**; the live figures, measured on disk this run, are here. **`test/*.test.js` = 25 files** (20 → 21 → **25**): Sprint 6 added `init-intake-guard` (`0046`), `init-claude-refresh-guard` (`0327`), `carry-check-hook` (`0204`) and `wiki-flag-convention` (`0154`). ⛔ **`test/prove-red.sh`'s header now declares TWENTY-EIGHT mutations, not the TWENTY-TWO recorded below** — 23–24 from `0204`, 25 from `0300`, 27–28 from `0154`; **28 numbered rows in its own index, counted this run.** ⭐ **This is the third consecutive time an enumerated count on this page went stale and nothing detected it — a sync or a lint noticed it, every time.** ⛔ **The counts are recorded here as a dated measurement, not re-pinned into the `**Key files**` line**, for the reason that line already states.

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

**The suite has grown past ADR-014's "exactly two things… and it stays this size".** *(Re-counted against the tree 2026-07-26: **eleven `*.test.js` files** plus `harness.mjs` and `prove-red.sh` — thirteen files in `test/`. Corrected by the 2026-07-26 lint: this line read "twelve", which contradicted its own enumeration below and `ls test/*.test.js`.)* The launcher, hook, dashboard and convergence contracts; `orphan-cleanup`; `rules-block-budget`; the `adr-number-uniqueness` and `task-id-uniqueness` guards; and **three hook-script suites** — `turn-completion-hook`, `askuserquestion-marker-hook` and `shiploop-marker-hook`. Each addition traces to a decision (ADR-017, ADR-018, ADR-029, ADR-030, the convergence and orphan-cleanup work), so this is **growth by ruling, not drift** — but ADR-014's size claim describes the tree less every sprint.

**Measured suite sizes, as the tasks reported them:** 494 pass ([[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]]) → 511 pass ([[tasks/transcript-independent-ship-loop-skip-signal]]) → **521 tests + the `prove-red.sh` hard gate**, the figure the 2026-07-25 launcher work measured. `prove-red.sh` now carries **seven mutations**.

> ✅ **Extended 2026-08-02.** 523 pass ([[tasks/reclaim-rules-block-budget-headroom]], task `0130`) → 551 pass / 17 suites ([[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]], task `0132` — **which added no test by design**) → **560 pass / 17 suites** ([[tasks/build-dual-home-parity-test]], task `0133`). `prove-red.sh` now carries **thirteen mutations**, and `0133` added a **disarm proof**: six variants that each shout `MUTATION WAS A NO-OP` and fail the gate. ⚠️ **That is R2's long-open no-op-mutation hole closed for these mutations specifically — not in general.** **Two new `*.test.js` files** since the 2026-07-26 count of eleven: `dual-home-parity.test.js` (task `0133`) and `skill-frontmatter.test.js` ([[tasks/convert-skill-descriptions-to-block-scalars-and-guard]], task `0136`) — **thirteen `*.test.js` files**, plus `harness.mjs`, `prove-red.sh` and `dual-home-parity-exceptions.mjs`. **ADR-014's "it stays this size" describes the tree less every sprint**, and every addition still traces to a ruling.
>
> ⚠️ **`skill-frontmatter.test.js` is the first thing in this repo that ever parsed a `SKILL.md`** — and it reads **frontmatter only**. **A `SKILL.md`'s body, the procedure itself, remains untested by anything.** Do not read its green as coverage of skill behaviour.

> ✅ **Extended 2026-08-05 — `567 pass / 0 fail / 17 suites`, `prove-red.sh` gate PASSED with FOURTEEN mutations** (thirteen at `0133`, plus one added by [[tasks/specify-and-support-the-reverse-move-sprint-to-backlog]]'s review). Measured identically before and after by three separate tasks in one run — [[tasks/add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules]] (`0191`), [[tasks/amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction]] (`0203`) and [[tasks/add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop]] (`0208`). **No new test file was added by any of them, by design** — all three edit `SKILL.md` bodies, which nothing can test.
>
> ⛔ **The untested-body gap was re-measured three times in that run and it is the run's own headline caveat.** `skill-frontmatter.test.js`'s `splitFrontmatter()` returns `lines.slice(1, i)` — **everything after the closing `---` is discarded** — and `/usr/bin/grep -rln` for the edited sections' terms across all 16 test files **exits 1**. **All three tasks stated, in their own words, that a green 567 proves only that they broke nothing.** The proof each offered instead was **content greps and a read-back**, never the suite. ⚠️ **`0203` additionally checked that mutation 9 — which de-indents a `description: >-` continuation in the very file it edited — still reports red**, i.e. it verified its edit had not silently disarmed an existing mutation. **That check is the pattern worth copying**; it is not required by anything.

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

### The parity test — BUILT 2026-08-02 *(this section's heading read "scoped, not built" until then)*
[[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] adds a **fourth** thing in scope: `test/dual-home-parity.test.js` asserting every fkit-authored dual-homed file is byte-identical across `ai-agents/` and `claude/scaffold/ai-agents/`, with an explicit exception list for the deliberately project-specific paths. Same constraints (`node --test`, zero devDeps, repo root). **Order is part of the decision — convention, then a reconciliation of the six drifted files, then the test**; building the test first just produces a red suite nobody can act on. **Step 1 of 3 is built; steps 2 and 3 are not** — `ai-agents/knowledge-base/conventions/dual-home-parity.md` exists (approved 2026-07-19, the fifth convention — see [[systems/knowledge-base-structure]]), while the **reconciliation of the drifted files** and `test/dual-home-parity.test.js` itself are both still absent from the tree. *(Corrected by the 2026-07-26 lint: this line read "None of it is built yet", contradicting [[systems/knowledge-base-structure]] and [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]], which both record the convention as filed.)*

> ✅ **Updated 2026-08-02 — ALL THREE STEPS ARE NOW BUILT**, in the order ADR-027 §Decision 3 makes binding. The paragraph above is left byte-identical as the record of the 2026-07-26 state. **Step 2** — [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] (task `0132`, 2026-08-01) — produced `test/dual-home-parity-exceptions.mjs`, **26 entries each with its own specific reason**, mapping **456 of 456** `diff -rq` lines with **0 unmatched and 0 dead entries**. **Step 3** — [[tasks/build-dual-home-parity-test]] (task `0133`, 2026-08-02) — is `test/dual-home-parity.test.js`, iterating the **union** of both trees so a missing-from-scaffold file fails too.
>
> ⚠️ **The reconciliation disproved the ADR's premise, and the byte-align half was overruled.** The drifted scaffold `conventions/*` files are **audience-adapted rewrites**, not stale copies, and byte-aligning them is **rejected as a product regression** (owner ruling 2026-08-01, Option B). **`decisions/` and `reports/` are outside the surface — no ADR is ever a drift event.**
>
> ⚠️ **Two findings about the test's own guards, both worth keeping.** Task `0132` handed over **R1**: the 10 **directory** exception entries match bidirectionally, so a dual-homed file later added under one would **silently escape** enforcement — closed by a tripwire asserting *no directory exception may cover a non-`.gitkeep` file present in both homes*. Then review round 2 found **R8** by the same species of defect **inside the fix**: voiding the promotion's byte-comparison left **all nine tests green**, so the tripwire's promise that *"the two copies were compared above"* pinned nothing. **The new pin was falsified rather than trusted** — with the comparison voided it reds 8/1. *An unpinned promise was not replaced by an unpinned test.*

### CI and the release gate — BOTH LANDED 2026-08-12 *(task `0256`)*

⚠️ **This reverses the owner's earlier `"No CI planned."` ruling.** For most of fkit's life *nothing*
ran the suite automatically. **Two gates now do, and neither replaces the other** — the reasoning is
recorded in the workflow file itself:

| Gate | What it is | Why the other one cannot replace it |
|---|---|---|
| **`.github/workflows/test.yml`** | `npm test` on every push to `main`, every PR, plus `workflow_dispatch`. `ubuntu-latest`, Node 24, `timeout-minutes: 20` | `install.sh` defaults to `main`'s HEAD, so the default `curl \| sh` install and self-update **track `main`, not a tag**. **The release gate alone would protect the artifact almost nobody installs by default.** |
| **The `npm test` gate in `bin/release.mjs`** | Runs before the bump; **blocks on red, no warn-and-continue**. `--no-test` is loud and *"never a default"* | CI's verdict is **asynchronous**, and **CI never sees the working tree that `git add -A` actually ships.** |

⚠️ **Two implementation facts that are load-bearing, not tidiness:**

- **`fetch-depth: 0` is mandatory.** `test/structure-manifest.test.js` **hard-refuses a shallow clone**
  — its walk reads git history ∪ the working tree — so the default depth-1 checkout would kill the
  suite at module load **on every run**.
- **The release gate sits immediately before the first mutating line.** A red suite is then a clean
  abort with the tree exactly as the user left it. **Gating any later would leave `VERSION` and
  `package.json` bumped and dirty, and the next default run would bump again — silently skipping a
  version.** It also **deliberately does not require a clean tree**, because both `npm test` and
  `git add -A` read the working tree.

**Suite runtime: roughly 6–8 minutes, machine-dependent.** The cost is a short unit-test phase plus
`prove-red.sh` re-running the suites against every mutant and clean baseline. **That is the cost the
owner accepted, stated rather than implied.**

> ⚠️ **CORRECTED IN PLACE 2026-08-14 by the post-`0288` sync — this paragraph carried BOTH defects
> `0291` and `0297` were about, and `0297`'s sweep did not reach this page.** It read *"Measured suite
> runtime: **~5m30s–6m20s** (328 / 380 / 347 / 344 s, same machine)… against **15 mutants and 9 clean
> baselines**"*.
>
> - **The figure was superseded** by the owner's ruling of 2026-08-13, verbatim ***"Range: 'roughly
>   6–8 minutes, machine-dependent'"***, which **overrode an earlier `~6 min` ruling of the owner's
>   own**. Live wording: `RELEASING.md:128`.
> - ⛔ **The four-run tally was a per-run duration list, which `0291` BARRED** — a 2026-08-13 sweep
>   could not reproduce the set from disk, and that unreproducibility became a standing constraint:
>   **echo the ruled range, cite evidence by anchor, never publish a set.** ⛔ It was **not** replaced
>   with fresher numbers; that would be the same defect with better data.
> - **The mutant/baseline counts were stale too.** Measured on disk 2026-08-14: `test/prove-red.sh`'s
>   header declares **TWENTY-TWO mutations**, and ⚠️ **mutations 18–22 are the first in the file's
>   history to target `bin/` rather than a copied launcher tree** (task `0288`). The counts are
>   deliberately left out of the sentence above rather than re-pinned — an enumerated count on a
>   living page is what went stale here twice.
> - ⚠️ **`0288` increased this cost and the owner accepted a measured ~+40%** (verbatim *"Accept the
>   +40%"*). ⛔ **No measured absolute figure is written here:** three wall-clock figures exist for the
>   same code and **every worker that reported one said it was moving with MACHINE LOAD** (last
>   recorded load average **8.72** on 14 cores); ⛔ **no new range was derived by applying the
>   percentage to the ruled figure.** **A clean idle-machine measurement is still owed**, and ⚠️ **the
>   ruled range predates `0288`, so it may now understate** — ⛔ **reported, not fixed**, because
>   `RELEASING.md` is outside this vault and re-ruling it is the owner's act.

**fkit's first-ever CI run went RED and found a real defect** — Actions run `31634593615`, **708/709,
1 fail**. A **test** defect, not a product defect: an assertion that was really asserting *"the
filesystem folded case for me"*, invisible on macOS. Fixed by
[[tasks/make-the-lockdown-guard-case-test-filesystem-independent]] (`0283`). ⚠️ **`prove-red.sh` also
went red on a case-sensitive filesystem, at two baselines, from the same single root cause — hidden in
the CI run because `package.json`'s `&&` short-circuited past it.**

⚠️ **What CI does NOT close:** `install.sh` still has **zero automated coverage** and was explicitly
out of `0256`'s scope, as its own brief — along with `shellcheck`. **CI landing is not the e2e gap
closing.**

## Gotchas / Known Issues

- **Environment traps that make the suite test the wrong thing:** `FKIT_NO_SELF_HOST=1` (the launcher otherwise re-execs into the checkout); `FKIT_NO_UPDATE_CHECK=1`; the temp project's `PROJECT.md` must **not** read as fresh, or the launcher **hijacks every role into `producer`**; `FKIT_SETUP_ONLY=1` exits **before** `build_settings()` runs, so settings-file assertions require actually reaching `exec claude` with the stub on `PATH`.
- ⚠️ **A completeness sweep run with bare `grep` is not complete — in this environment `grep` is a shell wrapper, not `/usr/bin/grep`.** `type grep` reports *"grep is a shell function from `~/.claude/shell-snapshots/snapshot-zsh-….sh`"*. **Measured 2026-07-30 over this repo:** the same recursive query returned **96 files through the wrapper and 119 through `/usr/bin/grep`** — **23 files silently absent, no warning, exit 0.** Independently reproduced the same day by a producer on its own close sweep (**3 files via the wrapper, 6 via `/usr/bin/grep`**). **Remedy: invoke `/usr/bin/grep` explicitly in any sweep whose result you intend to report as exhaustive — or qualify the result. Never report an unqualified "zero hits."**
  > **The mechanism is `.gitignore`, not hidden directories** *(this finding arrived framed as "silently skips hidden directories"; that framing is falsified by measurement and is corrected here)*. All 23 missing files are gitignored — `.gitignore:8` (`.fkit/`) and `.gitignore:17` (`.claude/skills/fkit-*/`) — while `.claude/skills-for-role.sh`, which is **hidden but not ignored**, came back from the wrapper, as did a synthetic hidden non-ignored directory created as a control. ⚠️ **Not fully isolated:** this repo contains no non-hidden ignored path to test against, so the evidence **disproves** the hidden-directory rule and is **consistent with** a `.gitignore`-honoring matcher **without proving it**. Why the distinction is load-bearing: a gitignore-honoring sweep also skips build output and vendored trees, which are not hidden at all.
  > **Sibling to — and a different mechanism from — the wrapped-grep warning** recorded in `log.md` on 2026-07-29. That one is the *phrasing* straddling a newline; this one is the *matcher* narrowing its scope. **Same consequence: a sweep that reads falsely clean.** Both are instances of the standing finding *a grep for one phrasing is not an inventory*.
  > **How it was found, which generalizes further than the finding itself:** a coder's fail-closed check **passed for the wrong reason interactively, then failed for a third reason in a script**. The durable rule — **a verification command typed into the interactive shell and the same command in a script are not the same command.**
- **The suite is what caught a real launcher defect.** Assertion 7 (no-args, no-tty, initiated → `fkit-lead`) went red on being made enforcing, exposing [[tasks/fix-headless-menu-guard-crash]] — a dead lead-default on any normal system.
- ⚠️ **`architecture.md` §9.1 is behind the code.** It still names *"zero automated verification"* as the top structural risk and states both high-blast-radius files are *"POSIX shell with no coverage of any kind."* **`claude/fkit-claude.sh` now has coverage** — argv contract + the lockdown matrix. **`install.sh` genuinely still has none**, so the risk is *reduced, not closed*. Flagged for the architect.
- ⚠️ **ADR-014 still presents the runner as an open question**, though `node --test` is shipped and wired to `npm test`. The ADR has not been amended.
- ✅ **`prove-red.sh` IS gated — ADR-026 Decision 4 has shipped** *(corrected 2026-07-19; this page briefly claimed the opposite)*. `package.json` reads `"test": "node --test test/*.test.js && bash test/prove-red.sh"` — the mutation check runs on **every `npm test`**, in the inner loop rather than the `test:full`/CI lane ADR-026 floated. It landed in commit `0ad055a`, **2026-07-18 21:34**.
  > **LINT WARNING — the ADR's own premise was already false when it was written, and the wiki repeated it.** ADR-026 is dated **2026-07-19** and asserts, as a verified fact, that `prove-red.sh` is *"not in `npm test`"* and *"runs only when a human types it"* — but the wiring had landed **the previous evening**. Decision 4 therefore reads as approving future work that was already done. **Two failures, not one:** the ADR asserted a code fact without re-checking it, and this wiki page then **repeated that claim as current without verifying it** — an `evidence-before-assertion` violation on the librarian's side, found only by this lint. The ADR is architect-owned and needs its Context and Decision 4 revisited. **What is genuinely still open is R2's no-op-mutation mode** (below) — that part of ADR-026 stands.
- **This is why the sync filter's blind spot matters:** `package.json` lives outside `ai-agents/`, so a delta sync scoped to `ai-agents/` **cannot see product-code changes that falsify a knowledge-base claim.** The gate shipped inside the very window that was synced, and the sync had no way to notice.
- ⚠️ **R2's no-op-mutation failure mode is still open — and now it is the *only* unmitigated half.** ADR-026 Decision 5 records a ~3-line zero-dep guard (assert each mutation actually changed the file) as **offered and not taken** — one of two hardenings, only the first chosen. **Decision 4's gate, now shipped, does not help it**: a no-op mutation produces a passing suite either way, so it still reads as a healthy check *and now does so on every `npm test`*. Cheap to re-offer.
- **Still uncovered, and named:** `install.sh` e2e (the `curl | sh` entry point — *it cannot be verified by reading a diff*), a CI workflow (there is no `.github/`), and the **static drift check** across the three hand-maintained mirrors of `skills_for_role()`, which needs a **normalizer** because they use three different naming conventions. All deferred to Sprint 3.

  > ✅ **Dated correction 2026-08-13 (the `0282` resync; the bullet above is left byte-identical).** **The CI item is DISCHARGED — `.github/workflows/test.yml` exists**, landed by [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] (`0256`, closed 2026-08-12): `npm test` on every push to `main`, every pull request, and `workflow_dispatch`; `ubuntu-latest`, Node 24, 20-minute timeout. See §"CI and the release gate" above. ⚠️ **The other two items are UNCHANGED and still open** — `install.sh` was **explicitly out of `0256`'s scope** as its own brief, and still has zero automated coverage.
- **Not the tester-agent question.** *"Building the script will teach us almost nothing about whether the tester earns its seat."* The two must not be bundled.
  > **The tester question is now RULED — and the separation above held.** [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] (2026-07-19) authorizes an eighth **tester** seat on **sandbox authority**, over the architect's and producer's recommendation. It was decided on its own merits, **not** as a conclusion drawn from the smoke script — exactly as the producer insisted. **What the two questions genuinely share is sequencing:** ADR-028 Decision 7 puts fkit's own regression gate **first**, *"the bigger risk and it's cheap — full stop, not as an experiment."*
  > **Verified 2026-07-19, and the picture is better than ADR-028 assumed:** the task it sequenced against, [[tasks/add-e2e-smoke-script-for-fkit-itself]], is **cancelled** — superseded by task 23, which is **Done**. **The two things the tester actually waits behind are the two named on this page:** ADR-026 Decision 4's automated gate *(shipped 2026-07-18 — see above; ADR-028 did not know this either)* and **the still-absent `.github/` workflow** ([[decisions/adr-003-ci-runs-validate-bundles]]).
  > ✅ **Dated correction 2026-08-13 (the `0282` resync; the line above is left byte-identical).** **The `.github/` workflow is no longer absent** — `.github/workflows/test.yml` landed with `0256` on 2026-08-12 (§"CI and the release gate"). **So both of the two things ADR-028 sequenced the tester behind are now discharged.** ⚠️ **That does not mean the tester's own case changed:** ADR-028 remains **decided, not built**, and the `install.sh` e2e gap it was partly about is still open — CI runs the suite, and the suite does not cover `install.sh`.
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
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the parity test, **built 2026-08-02**; its byte-align premise **overruled**
- [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] — task `0132`, the exception-list module and the sweep that disproved ADR-027's premise
- [[tasks/build-dual-home-parity-test]] — task `0133`, the test itself, and the R1→R8 chain of unpinned promises
- [[tasks/convert-skill-descriptions-to-block-scalars-and-guard]] — task `0136`, the first frontmatter reader; **eliminates the hazard class rather than testing one instance of it**
- [[tasks/reclaim-rules-block-budget-headroom]] — task `0130`, the rules-block cap, its 92% warning gate, and the owner's ≥400 B standing headroom target. ⚠️ **`RULES_MAX` is 4352, not 4096, since `0190`**
- [[tasks/add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block]] — task `0190` — ⚠️ **the ≥ 400 B target is enforced by NO assertion**; it lives only in a header comment, and the `<= 92 %` gate is relative to `RULES_MAX`, so the signed bump moved the warning line outward too. Silent-growth headroom **219 B → 189 B**. Fix filed as `0219`
- [[tasks/add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules]] · [[tasks/amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction]] · [[tasks/add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop]] — tasks `0191` / `0203` / `0208`, three `SKILL.md`-body edits in one run, **each proving its own landing by grep and read-back because the suite structurally cannot**
- [[tasks/decide-what-the-sprint-driver-does-when-a-spawned-worker-dies]] — task `0167` — ⚠️ **`git status` is not a landing detector for an untracked path**, and **a structural probe cannot answer a content question**: a driver's four real disk reads all returned true answers about the wrong things
- [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]] — the next hand-rolled guard, **not yet built**: a declared site registry plus a completeness tripwire. ⚠️ **It makes the inventory mechanical, NOT the sweep** — a registered site whose prose goes false still ships false
- [[tasks/investigate-the-skill-ownership-fact-inventory-gap]] — task `0142`, which found `test/skill-ownership-hook.test.js` to be an **undeclared fifth mirror** that says so about itself
- [[systems/knowledge-base-structure]] — the conventions the parity test would enforce
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the tester seat, sequenced **behind** this page's remaining gaps
- [[tasks/investigate-mutation-testing-library-adoption]] — task 46, the investigation behind ADR-026
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]] — task 49, the investigation behind ADR-027
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — a second hook whose session-scoped behaviour fkit **cannot fully test itself**; automated coverage reaches its script logic against synthetic payloads only
- [[tasks/transcript-independent-ship-loop-skip-signal]] — the hook's skip signal moved off the transcript onto an authoritative `UserPromptExpansion` `command_name` marker; **511 pass, mutation-proven**. ⚠️ It fixed a residual that had made the Stop hook **effectively non-enforcing in this dogfooding repo** — the transcript scan matched the command text as *content*, which fkit-self-maintenance sessions routinely read
- [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] — 0 defects, and the reviewer **mutation-proved** the new test is a real gate
- [[tasks/revert-task-movers-to-producer-only]] — ⚠️ its verification sweep's **path gap and phrasing gap** each shipped a real defect: *a grep is a smoke test, never an inventory*. The by-hand sweep and an independent reviewer pass are the real evidence
- [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] — ⚠️ shipped claiming the **ADR-027 dual-home parity test passed; that test does not exist**. An unrunnable verification step, corrected later in [[tasks/revert-task-movers-to-producer-only]]'s brief. ✅ *Updated 2026-08-02:* the test now exists — **and its surface can never cover that task**, so the owner's "re-verify once `0133` lands" ruling is **permanently undischargeable as written**. `0133` **refused to report a pass** rather than launder an unrunnable step into a runnable-looking green; a substitute check passed 5/5, which is **a signal, not a discharge**. Producer task `0187` is open to name a covering check
- [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] — the launcher-contract suite asserts roles **by name, never by menu number**, which is why a full menu renumber needed no test edit
- [[tasks/build-fkit-sprint-ship-loop-skill]] · [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the sprint loop, whose live-relay path is likewise hand-verified only
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — ⚠️ **the orchestration design named TWO binary probes; only one was ever answered.** Probe 1 (*a spawned `@fkit-coder` can plan **and write source***) came back **NO** — `fkit-coder.md` refuses spawned implementation — and was resolved by a prose **declared-approval-marker carve-out**, itself settled by a reviewer **reading a contract file**, never measured against the running binary. **Probe 2 — the `NEEDS-DECISION` → driver → `AskUserQuestion` round-trip — has no record of being run anywhere in the vault or the 0109/0110/0111 task artifacts.** It is the load-bearing mechanism of the whole orchestration design, and it rests on reasoning from the ADRs, not a measurement. **This is a named, outstanding verification obligation, not a closed one**
- [[tasks/build-adr-030-stop-hook]] — task 0127, the build that proved that limit live: `node --test` (493 pass) + `prove-red.sh` cover the script logic and real marker files, but the live `AskUserQuestion`→marker→block path stayed hand-verified (ADR-021)
- [[tasks/decide-whether-fkit-needs-a-tester-agent]] — the decision task that closed the tester question (ID 0024); the static-review gap it names is recorded on this page
- [[tasks/assert-task-ids-are-unique-in-the-test-suite]] — task 85, the duplicate-ID guard
- [[tasks/compress-universal-rules-output-style-section]] — task 79, the universal-rules compression
- [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]] — task 76, the folder migration
- [[tasks/repair-stale-adr-029-stop-hook-links-in-the-vault]] — task 80, the ADR-029/030 vault link repair
- [[tasks/decide-whether-to-drop-the-numeric-prefix-from-task-folder-names]] — task 0102: `test/dashboard-contract.test.js:1655-1664` must be **deliberately re-pointed** by task 0103, and going red there is the change working
- [[tasks/wiki-ingest-lead-conductor-and-adrs-031-032]] — task 0117, which filed probe 2 here as an outstanding obligation
- [[tasks/fix-sprint-ship-loop-skill-owner-banner-format]] — task 0120, whose follow-up `0152` would close the **entirely untested `SKILL.md`-content surface**
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162` — the precise test-surface split: the **frontmatter** of every skill and agent file is machine-checked over a pinned corpus (25 skills, 7 agents); the **body** of none of them is, and that is where every rule at issue lives
- [[tasks/specify-and-support-the-reverse-move-sprint-to-backlog]] — task `0210` — ⚠️ **a portability hole no test could see**: BSD `sed` rejects BRE `\|` alternation by matching nothing and **exiting 0**, so the broken and patched scripts produced byte-identical output. Its review also **refuted the plan's own justification** for skipping prove-red coverage, and wired the mutation anyway
- [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] — task `0200` — ⚠️ **it corrects its own approved plan on a test's value:** a test asserting each loop-table row's role owns that row's skill **passes today and would have passed on the day of the defect** — the row and `skills_for_role()` never disagreed. **Kept and re-scoped honestly:** it guards a *future* edit orphaning the row, not a driver departure. ⚠️ It also records that **the ADR-036 site registry still has no tooling** (`test/skill-ownership-sites.mjs` absent), so every surface count in its report is a hand grep
- [[tasks/build-the-closed-rank-immutability-guard]] — task `0182` (2026-08-06) — `test/closed-rank-immutability.test.js`, the suite's first board-history guard: scope = the transition in progress (`HEAD` vs working tree, plus `HEAD`↔`HEAD^`), header-anchored parser, fail-loud on field count. ⛔ **Not continuous protection** — no CI runs it, and a breach committed with no test run in the window is never caught. ⚠️ Its prove-red mutation seam waits on `0214`/`0215` (prove-red must never edit the real boards)
  - ✅ **Dated correction 2026-08-13 (the `0282` resync; the line above is left byte-identical).** **"No CI runs it" is now false** — it is a `test/*.test.js` file, so `npm test` runs it, and `.github/workflows/test.yml` runs `npm test` on every push to `main` and every PR (`0256`, 2026-08-12). ⚠️ **But the `⛔ Not continuous protection` verdict SURVIVES, on a narrower and still-correct reading**: the guard's leg 2 compares **`HEAD` against `HEAD^` only**, so a CI run over a **multi-commit push** inspects **one** transition and a breach in a middle commit is still never caught. **CI closed the "nobody ran it" hole; it did not widen the guard's scope.**
- **The 2026-08-13 sync — the suite's newest surfaces:** [[tasks/add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename]] (`0259` — ⚠️ **the finding that outlives it: the old R8 test was *green for a fixture-shaped reason***) · [[tasks/implement-adr-040s-identity-grammar-in-dashboard-sh]] and [[tasks/implement-adr-041s-dashboard-half]] (`0264`/`0265`, the T1–T11 and S1–S8 sets; ⚠️ **a `sed` H1 split silently produces one un-split segment on macOS and works on Linux CI**) · [[tasks/author-the-structure-spec-and-its-scaffold-inventory-drift-test]] and [[tasks/build-the-hash-manifest-generator-and-completeness-test]] (`0243`/`0244`, the drift and completeness tests, **both run red first**) · [[tasks/fix-the-version-labeled-sha-triggered-update-banner]] (`0257`, `test/update-banner.test.js` — closing a gap measured as **zero** coverage) · [[tasks/sprint-5-fix-what-a-real-project-found]] (the board)
- **The 2026-08-14 sync — `bin/` enters the suite for the first time:** [[tasks/fix-the-post-release-verify-lines-failing-and-false-green-cases]] (`0288`) added `test/release-summary.test.js` (**seven named assertions**, every fixture a throwaway clone with a **local bare origin**) and prove-red mutations **18–22** — ⚠️ **the first mutations in this project's history to target `bin/` rather than a copied launcher tree**. ⚠️ Its owner-ruled residuals are testing residuals as much as product ones: **mutation isolation is documented, not gated**; two assertions have **no mutation at all**; and **mutation 22 has no wrong-target guard**, saved today only by a two-space indent. ⚠️ It also measured a cost the plan under-estimated — `prove-red.sh`'s `run_suite()` runs the **whole** `node --test` glob and is called four times, so a new test file is executed **eleven** times per `npm test`
- [[tasks/correct-the-superseded-runtime-figure-on-the-gate-releases-page]] — ⚠️ *Added 2026-08-14:* task `0297`, whose incidental sweep for the superseded runtime figure **did not reach this page**; the occurrence it missed — and the barred four-run duration list beside it — were corrected above by the post-`0288` sync
- [[tasks/the-2026-08-14-retroactive-review-corrections]] — ⚠️ *Back-link added by the 2026-08-14 lint:* tasks `0291` and `0295`, the two retroactive-review rows. `0291`'s **report-don't-fix** boundary is why the superseded runtime figure and the barred duration list survived **on this page** until the post-`0288` sync corrected them — ⚠️ *a sweep is only as wide as the command that ran it, and a qualified negative must stay qualified*
- [[tasks/verify-the-codex-half-of-the-comment-stripping-canary]] — ⚠️ *Added 2026-08-22:* task `0177` (2026-08-16) — the rules-block wrapper measured against **`codex-cli 0.145.0`, which does NOT strip HTML comments from `AGENTS.md`**. Emitted block **3837 B**, `RULES_MAX` **4352**, free **515 B**, wrapper **404 B**, ≥400 B target **MET**. ⛔ **Its `canary.sh` is covered by no test suite at all** — a green `npm test` is not evidence about that script
- [[tasks/repair-0177s-stale-cap-and-byte-figures]] — ⚠️ *Added 2026-08-22:* task `0218` (2026-08-16) — ⭐ **a snapshot is not a criterion**: the absolute byte figures are a dated measurement that expires, the **≥400 B standing headroom target** is the owner-set criterion that does not
- [[tasks/rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint]] — ⚠️ *Added 2026-08-22:* task `0280` (2026-08-15) — the **"no CI" class outside the vault**, in `/fkit-wiki-lint`'s shipped `SKILL.md`, plus ⛔ **a fabricated `architecture.md` citation deleted rather than repaired** because that file's `:NNN` anchors are demonstrably drifting
- [[tasks/build-the-pretooluse-task-carry-check-hook-and-its-tests]] — *added 2026-08-29:* `0204`, prove-red mutations **23–24**
- [[tasks/release-mjs-with-branch-other-commits-and-tags-head-but-pushes-a-different-ref]] — *added 2026-08-29:* `0300`, mutation **25**
- [[tasks/build-wiki-flag-convention-test]] — *added 2026-08-29:* `0154`, mutations **27–28** and the `FKIT_WIKI_FLAG_ROOT` seam. ⭐ **The first test in the suite that reads a `SKILL.md` body at all** — until it landed, skill-file *content* was a wholly untested surface
- [[tasks/gate-symlink-escape-in-init-intake-write]] — *added 2026-08-29:* `0046`; ⛔ **prove-red still cannot reach `fkit-claude-init.sh`** — `test/harness.mjs` hardcodes `INIT` with no env seam, so the red-first proof for both init guards (`0046`, `0327`) is **manual, not mechanized**. That seam is open task `0037`'s
- [[tasks/refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim]] — *added 2026-08-29:* `0327`, whose red-first proof is likewise **manual, not mechanized**, for the same missing init seam
