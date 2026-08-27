# Review — 0256

Task: 0256 — [brief](./brief.md)
File(s) under review: `bin/release.mjs` · `.github/workflows/test.yml` (new, untracked) ·
`ai-agents/knowledge-base/architecture.md`
Status: closed-out

**Verdict (round 2 — CLOSED): ✅ Approved. Both fixed defects re-verified by measurement, the gate
re-demonstrated in both directions post-fix, both residuals defensible. ⚠️ CI has still never
executed.**

**Verdict (round 1): ⚠️ Changes requested — 2 low defects (none blocking), 3 low observations.**

**Coverage: reasoning-only second opinion (ADR-042 D1).** Codex ran (`codex-cli 0.145.0`,
`gpt-5.6-sol`) under `--sandbox read-only`, so it **read and reasoned but measured nothing** — it
could not run `npm test`, `prove-red.sh`, or the release script. **All execution evidence in this
ledger is the Claude reviewer's or the coder's.** This is the normal, expected state under the
current sandbox flag, not a degradation event. ADR-042 D2 (move to `workspace-write`) is recorded
but not yet implemented in `claude/skills/fkit-stateful-review/SKILL.md:95`.

---

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | low | `bin/release.mjs:166-171`, `ai-agents/knowledge-base/architecture.md:499-503` | The "tests the **exact bytes** about to be committed" claim is false as written: the suite runs **before** the version bump (`:201-203`) and ~6 min before `git add -A` (`:236`), so the committed tree differs from the tested tree by `VERSION` + `package.json`, plus anything edited during the run. The gate's design is sound; the absolute wording is not. Raised by **both** reviewers (Codex called it High). |
| R2 | 1 | low | `ai-agents/knowledge-base/architecture.md:498`, `.github/workflows/test.yml:4` | Both new/changed docs cite `install.sh:19` as `` FKIT_REF="${FKIT_REF:-main}" ``. The actual line 19 is `` REF="${FKIT_REF:-main}" ``. The *meaning* (env override `FKIT_REF`, default `main`) is right; the backticked line is not what the file says. |
| R3 | 1 | low | `bin/release.mjs:46,83` | `has()` ignores argument **boundaries**, so a flag name appearing as another flag's *value* is read as the flag. `npm run release -- --message --no-test` sets the commit message to `--no-test` **and** skips the gate. ⚠️ **Pre-existing parser property, not introduced here** — the identical collision already exists for `--no-tag`, `--no-push`, `--no-bump`, `--dry-run`; `--no-test` only joins the set. The loud stderr banner still fires, so it is not silent. |
| R4 | 1 | low | `.github/workflows/test.yml:15-18` | No `workflow_dispatch:` trigger. Owner ruling 2 explicitly bought "a red first run is information" — but with only `push: [main]` and `pull_request`, that information can be obtained *only* by pushing to `main` or opening a PR. A one-line `workflow_dispatch:` would let the first (possibly dash-red) run happen on demand. Frontier-move, not a defect. |
| R5 | 1 | low | `.github/workflows/test.yml:26-29` | `timeout-minutes: 20` may be thinner headroom than its own comment argues. The comment reasons from "~5m30s locally", but the observed local range is **328–380 s** and the cost is dominated by process/filesystem work (`sys 355–389 s` vs `user 163–171 s`) over 15 mutants + 9 baselines — the shape that degrades most on a 2-core `ubuntu-latest` runner. Margin is ~3.2×, not "generous". ⚠️ **Speculative — I cannot measure a runner, and Codex explicitly judged the timeout correct.** |

### Disproven / explicitly cleared — do not chase these

The four highest-value questions were checked against the code, and all four came back clean. Both
reviewers agree on every one.

1. **The gate cannot fail open.** `r.error` → `fail()` (`:175`); `r.status !== 0` → `fail()` (`:176`).
   A **signal kill yields `status === null`, and `null !== 0` is `true`, so it aborts** — null is
   *not* treated as success. `npm` missing from PATH → `ENOENT` → `r.error` → abort. `npm test` is
   `node --test test/*.test.js && bash test/prove-red.sh`; the `&&` plus `prove-red.sh`'s `set -eu`
   and explicit `exit 1` (`test/prove-red.sh:55,695`) propagate red. No warn-and-continue path exists
   in the file. Cosmetic only: a signal kill prints `exit null`.
2. **The gate is genuinely before every mutating operation** — verified against the code, not the
   comment. Everything above `:185` only reads: help (`:52-78`), preflight `git rev-parse` /
   `git remote` (`:107-112`), `readFileSync` (`:116-117`), version arithmetic (`:122-153`). Every
   mutation is below: `writeFileSync` (`:201,203`), `git add -A` (`:236`), `commit` (`:241`), `push`
   (`:249`), `tag` (`:257`), tag push (`:260`).
3. **`--dry-run` still writes nothing into the repo**, now that it runs the suite. Verified
   independently of the plan's claim: `test/harness.mjs:9,46` builds every fixture under
   `os.tmpdir()`; `test/prove-red.sh:59-60` works entirely in `mktemp -d` with an EXIT trap; every
   `cpSync`/`cp -R` naming `REPO` copies **out of** the repo, never in. All `git` calls in `test/`
   are read-only (`log`, `show`, `ls-tree`, `rev-parse`); the only `git init`/`commit` runs in a temp
   dir with an explicit identity (`test/closed-rank-immutability.test.js:343-355`).
4. **CI workflow — correct on review; NOT claimed green, it has never run.** `fetch-depth: 0` is
   present and load-bearing (`test/structure-manifest.test.js:59-67` throws on a shallow clone). No
   test anywhere in `test/` depends on a branch name or `origin/main`, so `pull_request`'s detached
   HEAD is fine. Full history + tags satisfy the `git log --full-history` / `git show <sha>` fixtures
   in `structure-check`, `structure-repair`, `closed-rank-immutability`. `permissions: contents:
   read` is sufficient. No lockfile → omitting `npm ci` is right. **A runner with no global git
   identity is safe** — the one committing test supplies `-c user.name/-c user.email` itself.
   `.github/` is not gitignored, so the workflow will actually ship.
5. **Brief acceptance criteria 5 and 6 hold.** `grep -n "No CI\|no CI" architecture.md` → no hits
   (correct: CI landed). `git status --porcelain` over `test/`, `bin/generate-structure-manifest.mjs`,
   `install.sh`, `package.json`, `VERSION`, `ai-agents/wiki-vault/` → **all empty**.

### Observations — outside the three reviewed paths, or unverifiable here

- **The win32 branch in `runTests()` is almost certainly dead.** `bin/release.mjs:173` picks
  `npm.cmd`, but `spawnSync` without `shell: true` refuses to launch `.cmd` on current Node (the
  CVE-2024-27980 hardening) — so on Windows the gate would set `r.error` and abort, blocking every
  release rather than running the suite. It **fails closed**, and Windows is not a supported platform
  (`install.sh:1` is `#!/bin/sh`). ⚠️ **Unverified — I have no Windows host.** Flagged only so the
  branch is not mistaken for working Windows support.
- **`ADR-003:3-7` now contradicts `architecture.md`.** Its status line still reads *"the need it
  identified (fkit has no automated verification) is still unmet and still open"*. Task 0256 met it.
  **Out of scope here** (ADR-003 is not one of the three reviewed paths) — a follow-up brief.
- **`node_modules/` is still absent from `.gitignore`** while `release.mjs` does `git add -A`.
  Already flagged by the coder in `plan.md` as latent; unchanged. Out of scope.

---

## Re-litigates settled decisions (suppressed) — listed, not dropped

| Suppressed claim | Settled by | Why suppressed |
|---|---|---|
| dash-vs-bash portability on `ubuntu-latest`; suite has only run on darwin | `plan.md` owner ruling 2 | Knowingly accepted; a red first run is the information being bought; the port is a separate brief |
| `--no-test` should not exist / should be harder to reach | `plan.md` owner ruling 3 | "Include it, loud" — the banner at `:191-194` is the required shape |
| §9.1's suite-inventory count ("eight contract suites" vs 19 `test/*.test.js`) | `plan.md` owner ruling 4; task `0251` | Reserved for `0251`; byte-identical and unreflowed here (checksum-proven twice). **Not verified by me, deliberately.** |
| Should have shipped only the gate, or only CI | `plan.md` owner ruling 1 | Full scope was the ruling |
| No `shellcheck` job, no `install.sh` smoke install | `brief.md` ⛔ Out of scope; ruling 1 | Their own briefs |
| "The workflow is unproven / has never run" | `plan.md` ruling 5; documented at `architecture.md:31` and §9.1 | Known, caveated in the doc, and stated in my verdict — not a finding |
| The stale "~5m30s" figure at `.github/workflows/test.yml:26` | Ruling 7's boundary | **Already surfaced by the coder** as an explicit open owner question in `worklog.md` ("A THIRD ~5m30s site exists"). R5 above is a *different* point — the timeout margin — that happens to land on the same lines. |

---

## Convergence call

**Round 1 — act, do not close out.** Nothing here re-litigates an accepted residual: the two reviewers
converged on one novel defect (R1), and R2 is new to this pass. No prior *Coder response* history
exists, so no regression check applies. R1 and R2 are **documentation-accuracy defects in a task
whose deliverable is substantially documentation accuracy** — cheap to settle, and settling them is
what closes the round. R3–R5 are frontier-moves or risk flags for the owner to dispose of, not
required changes.

No open confirmed defect touches the gate's *behavior*. The gate does what the brief asked: it
refuses, it fails closed, and it sits before the first write.

## Coder response

_(coder-owned — untouched by the reviewer)_

**Round 1 response.** Written by the coder spawned as the **Process-review worker** by
`/fkit-sprint-ship-loop`, under the declared-approval marker, 2026-08-12. Every finding was
re-verified against the code before any edit; **all six dispositions below are owner rulings** taken
by the driver via `AskUserQuestion` after the review, not choices I made.

**Document Status deliberately left `in-review`, not `closed-out`.** The skill closes a document out
when every novel finding is closeout / disproven / accepted; here **three were FIXED** (R1, R2, R4),
and a fix is the reviewer's to verify, not mine to declare converged. R3 and R5 are settled as
residuals below and should not be re-litigated. **Nothing blocking remains on my side.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** — re-derived from the source, not taken on report | **Defect** (doc accuracy) | **FIXED — prose hedged.** "the exact bytes about to be committed" → "the tree as it stood when the suite started", plus an explicit note of what diverges. Applied at **three** sites, not two — see below | ✅ done |
| R2 | **CORRECT** — checked against `install.sh` itself | **Defect** (doc accuracy) | **FIXED.** `` FKIT_REF="${FKIT_REF:-main}" `` → `` REF="${FKIT_REF:-main}" `` at both cited sites | ✅ done |
| R3 | **CORRECT** — reproduced from the parser source | **Defect**, but **pre-existing**, not introduced by 0256 | **No fix here** — owner-ruled accepted residual, its own brief later. Recorded below | won't fix (frontier) |
| R4 | **CORRECT** | **Frontier-move** (the reviewer classed it so; I concur) | **FIXED** — `workflow_dispatch:` added; owner ruled it in | ✅ done |
| R5 | **PARTIALLY CORRECT** — the arithmetic holds; the runner inference is unmeasurable, as the reviewer itself flagged | **Frontier-move** | **`timeout-minutes: 20` left as-is** (owner declined the raise). The *"generous headroom"* wording R5 also challenged **was** corrected, as a side effect of the ruling on the stale `~5m30s` figure in the same comment | won't fix (frontier) |

### R1 — verified, and hedged at three sites

**Re-derived, not accepted on report.** The gate call site is `bin/release.mjs:185-195`; the first
mutating line is `writeFileSync(versionPath, …)` at **`:201`**, and `git add -A` is at **`:236`**.
So between the suite finishing and the commit being staged, the tree gains a bumped `VERSION` and
`package.json`, and ~6 minutes elapse in which anything on the laptop can change. **"The exact bytes
about to be committed" is false as written.** The gate's *design* is untouched by this — it is
still the only mechanism that sees the working tree at all — but the absolute wording overclaims.

**The gate's behavior, call site, and `--no-test` semantics are unchanged. This finding was answered
with prose only**, per the owner's ruling. ⛔ **No enforcement was added** — no
`git status --porcelain` snapshot, no refuse-on-drift. The owner explicitly declined that and
reserved it as its own brief.

New wording, per site:

| Site | New text |
|---|---|
| `bin/release.mjs:169-173` (gate comment) | *"…and so does `git add -A` below. Both read the working tree — so gating here tests the tree **as it stood when the suite started**, uncommitted and untracked work included. **NOT the exact committed bytes**: the bump below writes VERSION and package.json after the suite, and ~6 min separate this gate from `git add -A`."* |
| `ai-agents/knowledge-base/architecture.md:499-504` | *"**The gate is what covers the working tree** — it tests the tree **as it stood when the suite started**, uncommitted and untracked work included. **Not the exact committed bytes**: the version bump writes `VERSION` and `package.json` after the suite, and ~6 min separate the gate from `git add -A`."* |
| ⚠️ `bin/release.mjs:71-73` (`--help` text) — **a third site, not in R1's enumeration** | *"The suite reads the working tree, so it checks the tree **as it stood when the suite started** — uncommitted and untracked work included, **but not the version bump written after it**."* |

⚠️ **The third site is an obvious-winner call past the ruling's literal "both sites", and is flagged
rather than buried.** It carried the identical false claim (*"it checks exactly what `git add -A` is
about to commit"*) in the **most user-facing** place of the three — `--help` output, versus two source
comments. The review named it because the review had not looked there; the owner ruled on the
review's enumeration. Hedging the two comments a releaser never reads while leaving the false
sentence the tool actually prints would invert the ruling's purpose. **Text-only, one sentence,
reversible in one edit if the owner meant the enumeration as exhaustive.**

Also checked and **correctly left alone**: the header comment block (`:16-18`) says only *"It runs
before the first write, and under `--dry-run` too"* — accurate, no exactness claim, no change needed.

### R2 — verified against the file, then corrected

`install.sh:19` reads, verbatim:

```sh
REF="${FKIT_REF:-main}"
```

`FKIT_REF` appears on that line only as the **environment override inside the expansion**, and by
name in the comment at `:15`. The reviewer is exactly right: the *meaning* both docs assert (env
override `FKIT_REF`, default `main`) is correct, the backticked quotation was not. Corrected at
`ai-agents/knowledge-base/architecture.md:497` and `.github/workflows/test.yml:4`. **`install.sh`
itself was not touched** — it was never wrong.

### R3 — correct, reproduced, and deliberately not fixed here

`bin/release.mjs:46` is `const has = (n) => argv.includes(n);` and `:86` is
`getArg("-m", getArg("--message", null))`, where `getArg` returns `argv[i + 1]` unconditionally. So
`--message --no-test` does set the commit message to the literal string `--no-test` **and** satisfy
`has("--no-test")`. The reviewer's reproduction is accurate.

**Not fixed, by owner ruling — and the reasoning is the reviewer's own:** the collision is a property
of the parser, identical today for `--no-tag`, `--no-push`, `--no-bump` and `--dry-run`. 0256 did not
introduce it; `--no-test` only joins an existing set. A real fix is an argument-boundary-aware parser
— a behavior change to flag parsing, which is outside this task's approved plan and larger than any
of its edits. Recorded as an accepted residual below; **the follow-up brief is the driver's to route,
not mine to file.**

Mitigating fact, verified: the loud `--no-test` stderr banner still fires on that path, so the skip
is never silent.

### R4 — added

```yaml
on:
  push:
    branches: [main]
  pull_request:
  # So the first (possibly dash-red) run can be triggered on demand, without pushing to main.
  workflow_dispatch:
```

This is the trigger the reviewer argued for: owner ruling 2 at the plan gate bought *"a red first run
is information"*, and without `workflow_dispatch` that information could only be obtained by pushing
to `main` or opening a PR. One trigger line plus one comment line, in the file's existing
comment-every-non-obvious-choice style. ⚠️ **It does not make CI proven** — see the standing caveat.

### R5 — timeout left at 20; the wording half was corrected anyway

`timeout-minutes: 20` is **unchanged** — the owner did not select the raise, and I record it as
considered-and-declined rather than dropping it.

On the merits, my verdict is **PARTIALLY CORRECT** and I want the split on record:

- **The arithmetic is right.** The suite has now been timed **five** times on this machine, all with
  the suite unchanged: 328 / 380 / 346.9 / 343.8 s at plan/verify/fix time, plus this pass's run.
  Against the slowest (380 s), 20 minutes is **~3.2×**, not the "generous" the comment claimed. The
  reviewer's cost-shape point is also sound: `sys` dominates `user` (355–389 s vs 163–171 s), and
  process/filesystem-heavy work over 15 mutants + 9 baselines is what degrades most on a small runner.
- **The inference is unmeasurable from here**, which the reviewer flagged itself, and Codex read the
  same timeout as correct. I cannot time an `ubuntu-latest` runner without pushing, and this loop does
  not push.

The `~5m30s` comment at `.github/workflows/test.yml:26` was rewritten under a **separate** owner
ruling (the "third `~5m30s` site", ruled in for consistency after an earlier worker left it out).
Because that rewrite replaced the very sentence R5 challenged, the **"generous headroom"** judgment
went with it, replaced by the measured ratio:

> ``# `npm test` measured locally at ~5m30s-6m20s across four runs (328 / 380 / 347 / 344 s — same``
> ``# machine, unchanged suite; the spread is machine load, not a regression), i.e. the "~6 min"``
> ``# quoted elsewhere. … 20 minutes leaves ~3x headroom over the slowest local run while stopping a``
> ``# hung prove-red.sh from burning a runner for six hours.``

**The past measurement was not falsified** — the comment now states the range and every constituent
number, so "328 s was really measured" survives intact. **The timeout value did not change.**

### What was NOT touched

⛔ Gate behavior, call site, `--no-test` semantics — **unchanged**; re-confirmed by running
`node bin/release.mjs --dry-run --no-test` (stderr banner, suite provably skipped, dry-run plan
printed, `VERSION`/`package.json` shasums identical before and after). ⛔ No `test/`,
`bin/generate-structure-manifest.mjs`, `install.sh`, `package.json`, `VERSION` or
`claude/structure-manifest.tsv` edit. ⛔ No architecture.md suite-inventory edit (still `0251`'s).
⛔ Nothing committed or pushed; `npm run release` never run for real; `ai-agents/wiki-vault/` never
written; `plan.md` never re-authored.

⚠️ **Standing, unchanged by this round: CI has never executed.** Adding `workflow_dispatch:` gives it
a manual trigger; it does not run it. The workflow is still verified by static review only, and the
dash-vs-bash portability risk the owner knowingly accepted is still untested.

## Accepted residuals (shared, do-not-re-litigate)

- **`has()` is exact `includes`, so a flag name used as another flag's value is read as the flag.**
  · **What:** `bin/release.mjs:46` (`argv.includes`) plus `getArg`'s unconditional `argv[i + 1]` means
  `npm run release -- --message --no-test` both sets the commit message to `--no-test` and skips the
  test gate. Left exactly as-is by task 0256.
  · **Why (structural):** the collision is a **pre-existing property of the argument parser**, already
  true for `--no-tag`, `--no-push`, `--no-bump` and `--dry-run`; `--no-test` only joined the set, so
  0256 neither introduced nor widened it. Repairing it means teaching the parser argument boundaries —
  a behavior change to flag parsing, outside 0256's approved plan (whose every other edit is prose or a
  single workflow trigger line) and touching flags this task never owned. Owner-ruled 2026-08-12
  (*"Accept as residual, brief separately (Recommended)"*): it gets **its own brief**, filed by the
  driver, not folded in here. The exposure is bounded — the loud `--no-test` stderr banner still fires,
  so the skip is never silent, and every colliding flag requires the operator to have typed that flag
  name themselves.
  · **Re-raise only if:** the boundary-aware-parser brief has landed and the collision survives it; or
  a **new** flag is added whose collision is silent (no banner / no visible effect); or the exact-match
  `has()` is shown to misfire without the operator having typed the colliding flag name at all.

- **`timeout-minutes: 20` stays, on a ~3.2× margin, deliberately.** · **What:**
  `.github/workflows/test.yml` keeps a 20-minute job timeout, against a local range of 328–380 s.
  · **Why (structural):** the raise was **considered and declined** by the owner 2026-08-12 after R5
  argued the margin is thinner than its comment claimed. The finding's arithmetic was accepted — and
  the overstated *"generous headroom"* wording **was** corrected to the measured `~3x` — but the
  operative inference (that a 2-core `ubuntu-latest` runner degrades enough to exceed 20 minutes) is
  **not measurable without pushing**, which this loop does not do; Codex independently read the timeout
  as correct. A timeout is cheap to raise **once there is a real runner measurement**, and raising it
  now on speculation would trade a bounded, loud failure (a job killed at 20 min, visible in the
  Actions log) for an unbounded one.
  · **Re-raise only if:** a real CI run is observed exceeding ~10 minutes, or is killed by this
  timeout; or the suite's cost grows materially (new mutants/baselines in `prove-red.sh`, or unit
  runtime past ~2 min).

---

## Reviewer closeout — round 2 (re-verification by measurement)

_(reviewer-owned. Written by the Review-closeout worker spawned by `/fkit-sprint-ship-loop`,
2026-08-12. The driver folded the post-fix re-verification into this pass instead of spawning a coder
verify pass — see the sufficiency judgement at the end.)_

**Closing verdict: ✅ Approved — closed out.** The three fixes (R1, R2, R4) are verified; the two
residuals (R3, R5) are defensible to close on; nothing new was found that blocks.

### Re-verification — measured, not taken on report

Every number below is this reviewer's own measurement, taken **after** the fixes landed. Exit codes
were captured by redirection into a file, never through a pipe.

| What | How measured | Result |
|---|---|---|
| `npm test` on the real tree | `npm test > log 2>&1; echo $? > exitfile` | **exit 0**, `tests 709 / pass 709 / fail 0`, `✓ hard gate PASSED`, **5:44.25 total** (344.25 s) |
| Workflow YAML parses | `ruby -ryaml` safe_load | **parses**; all **three** triggers present (`push: [main]`, `pull_request`, `workflow_dispatch`), `permissions: contents: read`, `timeout-minutes: 20`, `fetch-depth: 0`, `node-version: '24'`, one step `npm test` |
| **Gate refuses on a red tree** | full repo copy in scratch; one byte appended to a dual-homed scaffold copy; `node bin/release.mjs --dry-run` | **exit 1**, exact refusal text (*"npm test failed (exit 1) — refusing to release an untested tree. / Nothing was changed: no bump, no commit, no tag."*), **`VERSION` + `package.json` shasums unchanged**, HEAD and tags unchanged |
| **Gate proceeds on a green tree** | same copy restored byte-for-byte to the real working tree (`git status --porcelain` diff → identical, 37 entries); `node bin/release.mjs --dry-run` | **exit 0**; gate runs **first** (`• running \`npm test\`` at stdout line 2) → `709/709` → `✓ hard gate PASSED` → `✓ npm test green` → **only then** `• [dry-run] bump version 0.2.1 → 0.2.2`; plan printed; **nothing written**, HEAD/tags/dirty-count unchanged |
| `--dry-run --no-test` still behaves | same copy | **exit 0**, loud stderr banner fires, **zero** occurrences of the suite in stdout (provably skipped), plan printed, nothing written |
| Suite-inventory paragraph untouched | `sed -n '482,490p' architecture.md \| shasum` | **`76a200e0c1e724446adb8d52078d88d284fc9251`** — matches the coder's reported sha1. Still `0251`'s. |
| Reserved files untouched | `git status --porcelain` over `test/`, `bin/generate-structure-manifest.mjs`, `install.sh`, `package.json`, `VERSION`, `ai-agents/wiki-vault/` | **all empty** |

⚠️ **One correction to the round-1 bookkeeping.** `claude/structure-manifest.tsv` **is** modified in the
working tree, so the coder's *"no `claude/structure-manifest.tsv` edit"* is not literally true of the
tree — but it **is** true of task 0256. The single added row hashes
`ai-agents/knowledge-base/conventions/task-status-vocabulary.md`, which belongs to a **different
sprint-5 task** sharing this working tree. 0256 did not touch it. Recorded so the next reader is not
misled by the porcelain output.

**⛔ The order of operations was re-demonstrated, not re-argued.** The prose edits landed around the
gate since it was last shown working; the green run above proves the gate still fires before the first
mutating line, and the red run proves it still aborts clean.

### R1 — do the hedges make the claims true? **Yes.**

All three sites read, and the divergence enumeration checked against the code rather than the comment.
Between the gate call site (`bin/release.mjs:185-195`) and `git add -A` (`:236`) the **only** writes
are `writeFileSync(versionPath…)` at `:201` and `writeFileSync(pkgPath…)` at `:203`. Every other
operation in that span is read-only git (`rev-parse`, `tag --list`, `ls-remote`, `status --short`).
So *"the bump below writes VERSION and package.json after the suite"* is a **complete** enumeration of
the divergence, not a partial one.

| Site | Verdict |
|---|---|
| `bin/release.mjs:169-173` (gate comment) | **Accurate.** The false *"exact bytes about to be committed"* is gone; *"NOT the exact committed bytes"* plus the complete divergence list replaces it. |
| `ai-agents/knowledge-base/architecture.md:502-504` | **Accurate**, same shape. |
| `bin/release.mjs:71-74` (`--help`) — the third site, owner-ruled KEPT | **Accurate**, and correctly the most user-facing. *"…but not the version bump written after it."* No exactness claim survives anywhere in the printed help. |

**No under-claim introduced.** All three still assert the load-bearing thing — the gate is the only
mechanism that sees the working tree at all, which CI structurally cannot do. That claim is true.

**Two nits, deliberately NOT raised as findings** (recorded so they are not re-discovered as new):
*(a)* *"as it stood when the suite started"* implies a snapshot the suite does not take — it reads
files over ~6 min, so a mid-run edit is seen by whatever reads it later. The adjacent *"~6 min separate
this gate from `git add -A`"* already warns the reader. *(b)* the bump is conditional (`--no-bump`
writes nothing), phrased unconditionally. Neither restores the false claim; neither is worth a round.

### R2 — the replacement quote is right

`install.sh:19` read directly, verbatim: `REF="${FKIT_REF:-main}"`. Both citing sites now match it
exactly — `architecture.md:498` and `.github/workflows/test.yml:4`. `install.sh` itself untouched,
correctly.

### `architecture.md:493-494` — enumeration complete, and it does not claim CI ran

*"…on every push to `main` and every pull request, plus a manual `workflow_dispatch` trigger"* covers
**all three** triggers in the file, with none missing and none invented. It describes **configuration**,
not execution, and the bullet at `:507` still states *"Neither has been observed green on a runner
yet."* **No green claim anywhere.** (Nit, not a finding: bare `pull_request` means the default event
types, not literally every PR event. Standard shorthand.)

### The two accepted residuals — both defensible to close on

- **R3 (parser collision) — defensible.** Pre-existing and unwidened: the identical collision already
  holds for `--no-tag`, `--no-push`, `--no-bump`, `--dry-run`. The skip is never silent (banner
  re-observed firing this pass). Owner-ruled to its own brief. Closing 0256 on it does not ship a new
  defect.
- **R5 (timeout margin) — defensible.** Considered and declined by the owner. The overstated *"generous
  headroom"* wording **was** corrected to the measured `~3x`, and the past measurement was not
  falsified — my run today (344.25 s) falls inside the comment's stated 328–380 s range. The operative
  inference (a 2-core runner exceeding 20 min) remains **unmeasurable without pushing**. Re-raise
  conditions are recorded above.

### ⚠️ Two routing debts the driver still owes — flagged, not blocking

Checked this turn, not assumed: **neither follow-up brief has been filed.** `ls
ai-agents/tasks/backlog/` runs to `0279`, and a grep for the parser/boundary topic hits only 0256's own
files.

1. **R3's argument-boundary-parser brief** — the ledger records it as *"the driver's to route"*. Not
   in the backlog.
2. **The `ADR-003:3-7` contradiction** (its status line still says fkit's automated-verification need
   *"is still unmet and still open"*; 0256 met it) — flagged in round 1 as out of scope, needing a
   follow-up. Not in the backlog.

Closing 0256 is correct either way; these are separate work items that will be silently lost if not
filed now.

### Standing caveat, unchanged

⚠️ **CI has never executed.** `workflow_dispatch:` gives the workflow a manual trigger; it does not
run it. The workflow is verified by **static review plus a YAML parse only**. The suite has still only
ever run on **darwin**; the dash-vs-bash risk on `ubuntu-latest` is knowingly accepted and untested.
Nothing in this verdict says otherwise.

### Convergence call — round 2: CLOSE

Round 2 surfaced **no new defect**. The two round-1 defects were doc-accuracy defects and are now
accurate at every site, including one past the enumeration that the owner ruled in. The gate's
behavior — this task's actual deliverable — was re-demonstrated in **both** directions after the prose
landed. Both residuals are settled with explicit re-raise conditions. **Further review rounds would
re-litigate settled tradeoffs, not find defects.** Closed out.
