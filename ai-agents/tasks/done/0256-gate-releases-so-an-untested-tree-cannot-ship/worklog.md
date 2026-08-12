# Worklog — task 0256

Gate releases so an untested tree cannot ship.

**Worker:** coder, spawned as the Build worker by `/fkit-sprint-ship-loop` (lead session), under the
declared-approval marker. Plan approved by the owner 2026-08-12 via `AskUserQuestion` in the driver
session; plan body at `plan.md` in this folder (read this turn, never re-authored).

**Date:** 2026-08-12

---

## What was done

Implemented the approved plan in its own order — gate, `--no-test`, CI, docs, worklog. **Two source
files touched, one created.**

### 1. In-release test gate — `bin/release.mjs`

`runTests()` added, and called **immediately before line 144** — the `if (target !== version)` bump
block whose `writeFileSync` at the old `:148` is the script's first mutating line.

```js
function runTests() {
  const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
  const r = spawnSync(npmBin, ["test"], { cwd: KIT, stdio: "inherit" });
  if (r.error) fail(`could not run \`npm test\`: ${r.error.message}`);
  if (r.status !== 0) {
    fail(
      `npm test failed (exit ${r.status}) — refusing to release an untested tree.\n` +
        `  Nothing was changed: no bump, no commit, no tag.\n` +
        `  Fix the suite and re-run. To release anyway: --no-test (ships unverified).`,
    );
  }
}
```

Properties the plan required, and how each is met:

- **No warn-and-continue path exists in the code at all.** `fail()` already `process.exit(1)`s. The
  requirement is met by construction, not by a flag's default.
- **Position is the design, not a detail.** At that point nothing is written, staged, committed or
  tagged, so a red suite is a clean abort with the tree exactly as the user left it. Gating any later
  would leave `VERSION`/`package.json` bumped and dirty, and the next default run would bump *again*
  (0.2.2 → 0.2.3), silently skipping a version. That failure mode is removed rather than documented.
- **It runs under `--dry-run`** and exits 1 on failure — required by the brief's verification step 1.
  No `--dry-run` contract is broken: `harness.mjs:9` states *"Nothing here writes into the repo"* and
  `prove-red.sh` works entirely under `mktemp -d`. Only the exit code changes.
- **`stdio: "inherit"`** so the suite streams live — 5+ minutes of silence reads as a hang.
- **It does not require, and must not require, a clean tree.** `npm test` reads the working tree, the
  manifest walk is history ∪ on-disk `claude/scaffold/`, and `git add -A` stages the working tree —
  all three see the same bytes, so the gate tests exactly what is about to be committed.
- **`-h/--help` exits before the gate** (at `:67`, unchanged) — help stays instant.

`spawnSync` was already imported; no new import, no new dependency.

### 2. `--no-test` escape hatch — owner ruling 3, "include it, loud"

`const doTest = !has("--no-test");` alongside the existing flag parses. When set, an unconditional
multi-line **stderr** banner prints where the gate would have run:

```
⚠ --no-test: releasing WITHOUT running the suite.
⚠ The tree about to ship is UNVERIFIED — nothing has checked it.
```

Documented in **both** required places: the header comment block (Options list) and the `--help`
text, each reading `--no-test   Skip the test gate — SHIPS AN UNVERIFIED TREE`. Never a default.

No flag collision with the existing `--no-tag` / `--no-push` / `--no-bump`: `has()` is an exact
`argv.includes`, not a prefix match.

### 3. CI — `.github/workflows/test.yml` (new file; `.github/` did not exist)

`ubuntu-latest` per owner ruling 2, Node 24, `run: npm test`, triggers `push` to `main` +
`pull_request`, `timeout-minutes: 20`.

- **`fetch-depth: 0` is mandatory, not tidiness.** `test/structure-manifest.test.js:60-67` hard-refuses
  a shallow clone (`git rev-parse --is-shallow-repository`) and `actions/checkout` defaults to
  `fetch-depth: 1`. Without it the suite dies at module load on every run.
- **No `cache: npm`, no `npm ci`** — zero dependencies, no lockfile (ADR-014 §4). Nothing to install.
- `timeout-minutes: 20` against a measured **328 s** run leaves headroom while stopping a hung
  `prove-red.sh` from burning a runner. (Later runs measured up to **380 s** — see the superseding
  note below; 20 minutes still leaves ample headroom, and the runner is a different machine anyway.)

### 4. Docs — `ai-agents/knowledge-base/architecture.md`

Per owner ruling 4, **the CI sentences only**:

| Site | Change |
|---|---|
| Overview `:31` | *"but **no CI to run it**"* → records CI on push/PR + the in-release gate |
| §9.1 heading `:475` | → `### 9.1 The suite now runs automatically — CI plus an in-release gate; install.sh is still uncovered` |
| §9.1 opening `:477` | *"There is a test suite; there is no CI."* → two mechanisms now run it |
| §9.1 `- **No CI.**` bullet | replaced by three bullets: CI landed, gate landed, neither observed green yet |
| §9.1 closing residual paragraph | residual **narrowed** (automation closed) but not shut — `install.sh` coverage remains |
| §11 OQ2 | → closed pointer in OQ1's `~~strikethrough~~ — RESOLVED` pattern |

⛔ **The suite-inventory count was NOT touched** — `:480-482` still reads *"eight `node --test`
contract suites"* with the same eight names. That is task `0251`'s. I also deliberately did **not**
reflow lines 479-480, to keep the count line byte-identical for `0251`'s edit; the cost is one
slightly short line, which renders identically in markdown.

`architecture.md` is **`live-only`** (`test/dual-home-parity-exceptions.mjs:92`) — the scaffold ships
no copy — so there is no twin to edit and no manifest regeneration is implied.

---

## Verification run here (build-time sanity only)

The driver scoped this spawn to cheap checks and routed full verification to a separate spawn.

| Check | Result |
|---|---|
| `node --check bin/release.mjs` | ✅ syntax OK |
| `node bin/release.mjs --help` | ✅ renders, `--no-test` + gate paragraph present, exits 0 |
| `node bin/release.mjs --dry-run --no-test` | ✅ banner on stderr, then normal dry-run plan, nothing written |
| `.github/workflows/test.yml` parses as YAML | ✅ (`ruby -ryaml`) |
| `git diff --stat` over my two edited paths | ✅ exactly 2 files, `+53` release.mjs / `+38 −19` architecture.md |
| `git status --porcelain test/ bin/generate-structure-manifest.mjs install.sh` | ✅ empty — none touched |

⛔ **NOT run here, and therefore NOT claimed green:** the full `npm test` (target 709/709) and the
`prove-red.sh` hard gate — explicitly excluded by the spawn to avoid burning 5.5 minutes. ⛔ The
plan's verification step 1 (deliberately break a `claude/scaffold/` file → prove `--dry-run` refuses
→ revert and diff porcelain against baseline) was **not** performed here; it is the separate verify
spawn's job. **The gate has therefore never been observed actually refusing.** Its refusal path is
argued from code, not demonstrated.

⚠️ **CI has never run.** This loop does not commit or push, so the workflow is verified by static
review only. A live run happens when the owner pushes. It is not claimed green.

**Measured cost, as a number (brief requirement §2): `npm test` = 328 s wall** (5 m 28 s;
`user 163.27 / sys 355.22`). Unit portion `duration_ms 55751.87` (55.8 s); `prove-red.sh` ≈ 272 s
(4 m 32 s), which re-runs the suites against 15 mutants plus 9 clean-copy baselines. Measured at plan
time on darwin, `node v24.13.0`; **not re-measured this turn.** That 328 s is now the per-release
cost of `npm run release`, paid on every release that does not pass `--no-test`.

> **📌 Superseded as the headline figure — read with the verify and fix sections below.** The suite
> has now been timed **four** times on the same machine, same darwin, same `node v24.13.0`, with the
> suite unchanged between them:
>
> | Run | Wall | Where |
> |---|---|---|
> | plan pass | **328 s** (5 m 28 s) | `plan.md`, and this section above |
> | verify pass | **380 s** (6 m 20 s) | verify section below |
> | fix pass, run 1 | **346.89 s** (5 m 47 s) | fix section at the end |
> | fix pass, run 2 | **343.77 s** (5 m 44 s) | fix section at the end |
>
> **All four are real measurements — none is wrong.** The spread is machine load, not a regression.
> The honest per-release cost is a **range of about 5 m 30 s – 6 m 20 s**, and the prose in
> `bin/release.mjs` now says **"~6 min"** so it does not under-state what a blocking gate costs
> (owner ruling, 2026-08-12). ⚠️ Note "~6 min" is still ~20 s under the **observed maximum** of 380 s;
> it is an approximation (`~`) sitting near the top of the range, not a ceiling.

---

## Decision log — decisions taken without asking

Four, all judged verified-`CORRECT` + mechanical/localized + inside the approved plan, or
obvious-winner within the plan's intent. None is a frontier-move.

1. **`permissions: contents: read` added to the workflow.** Answers no finding; the plan enumerated
   triggers, runner, checkout, setup-node, run and timeout, and did not mention permissions.
   **Obvious winner within plan intent:** a workflow whose only step is `npm test` needs no write
   scope, and GitHub's default token is broader. Zero effect on whether the tests run. Reversible by
   deleting two lines.
2. **The `--help` text gained a short paragraph describing the gate itself**, not just the `--no-test`
   line the plan asked for. **Mechanical/localized, in-plan intent:** the plan requires the flag be
   documented in `--help`; a flag that says "skip the test gate" is unreadable to someone who does not
   know a gate exists. Text only.
3. **§9.1's opening sentence (`:477`, *"There is a test suite; there is no CI."*) was corrected**,
   though owner ruling 4 enumerated the heading, the `- **No CI.**` bullet, `:31`, and the closing
   paragraph — not this sentence. **Judged inside the ruling:** it is literally a CI sentence, it is
   now false, and leaving it would have the section open by contradicting its own new heading. This is
   the one place I read past the literal enumeration; flagging it explicitly so it is easy to reverse
   if the owner meant the list as exhaustive.
4. **The single `- **No CI.**` bullet became three bullets**, rather than one replacement bullet.
   **In-plan:** ruling 4 says correct that bullet; the correction has three distinct facts to carry
   (CI landed, gate landed, neither proven on a runner) and the third is a caveat that must not be
   dropped. Same list, same position.

**No fix was applied outside the approved plan, and nothing was fixed that the plan did not name.**

---

## Scope kept — what was deliberately not touched

- ⛔ **No portability repair.** Owner ruling 2 accepts the dash risk knowingly. Nothing in
  `claude/fkit-claude.sh` (`#!/bin/sh`), `claude/fkit-claude-init.sh` (`#!/usr/bin/env bash`), or any
  test was adjusted for `ubuntu-latest`. A red first run is information to report, not to pre-empt.
- ⛔ **`architecture.md`'s suite-inventory count** — untouched, reserved for `0251`.
- ⛔ No new dependency; `package.json` unedited.
- ⛔ No test file, no `bin/generate-structure-manifest.mjs`, no `claude/structure-manifest.tsv` edit.
  (`structure-manifest.tsv` shows modified in `git status` — that is task `0268`'s pre-existing `+1`
  row, present before this spawn began, not mine.)
- ⛔ No `shellcheck` job, no `install.sh` smoke install, **no `install.sh` edit at all**.
- ⛔ `ai-agents/wiki-vault/` — never written.
- ⛔ Nothing committed or pushed. `npm run release` was never run for real — only `--dry-run --no-test`.
- ⛔ `plan.md` read, never re-authored.

The working tree also holds tasks 0266/0267/0268's shipped work, task folders `0276`–`0279`, an edited
`ai-agents/sprints/backlog.md` / `sprint-5.md`, and the driver's `🔄 In progress` marks. **None of
that is this task's** and none of it was modified here.

---

## Ripples this task creates elsewhere — surfaced, not fixed

Landing CI falsifies claims in four other files. **None was edited** — three are task briefs
(producer-owned) and one is a skill playbook outside this plan's step 4.

1. **`claude/skills/fkit-wiki-lint/SKILL.md:184-185`** — now false: *"this project has no CI"* and
   *"there is no `.github/`"*. Its citation was **already** stale before this task: it quotes
   `architecture.md:390` as saying *"There is no CI and no test suite"*, and no such text exists
   anywhere in `architecture.md` today. Two defects, one pre-existing, one caused here.
2. **`ai-agents/tasks/backlog/0251-…/brief.md:58`** — instructs *"Keep §9.1's thesis intact — the
   section's point is 'a suite exists, no CI runs it'."* **That premise is now false**, and `0251`
   executed as written would re-break §9.1. This is a direct collision with the task whose scope
   ruling 4 protected.
3. **`ai-agents/tasks/backlog/0252-…/brief.md:60,90`** — *"there is no CI"* and *"run `npm test` …
   because nothing else will"*. Anticipated by the plan's "what 0252 can assert once this lands"
   section, but the brief still carries the false premise.
4. **`ai-agents/tasks/backlog/0240-…/brief.md:26,83,132`** — records the owner's **2026-08-06 ruling
   *"No CI planned"*** as a load-bearing, dated **premise for an ADR**. The owner reversed that ruling
   on 2026-08-08 and approved CI at full scope on 2026-08-12. **`0240` would bake a reversed ruling
   into an ADR** if run unchanged. Highest-consequence of the four.

## Latent issue noted, not in scope

`node_modules/` is **not** in `.gitignore` and `release.mjs` does `git add -A`. Harmless today — the
directory is empty and git ignores empty directories — but the day anything is installed, `git add -A`
commits it. Flagged only; scope was not widened to fix it.

---

# Verification run — separate Verify worker

**Worker:** coder, spawned as the **Verify worker** by `/fkit-sprint-ship-loop` (lead session).
Verification only — no implementation. **Nothing was fixed, because nothing verified broken.**
**Date:** 2026-08-12. `plan.md` read with `cat`, never re-authored. Nothing committed or pushed.
`npm run release` was **never** run for real — `--dry-run` only. `ai-agents/wiki-vault/` never written.

## Result table

| # | Check | Result |
|---|---|---|
| 1 | **Gate demonstrably REFUSES** (the brief's headline requirement) | ✅ **PASS — observed, not argued** |
| 2 | Gate is not vacuous — green tree proceeds past it | ✅ PASS |
| 3 | `--no-test` skips the suite + loud stderr banner + no flag collision | ✅ PASS |
| 4 | `--help` documents the gate and `--no-test` | ✅ PASS |
| 5 | `npm test` full suite, real exit code | ✅ PASS — 709/709, exit 0 |
| 6 | CI workflow static review | ✅ PASS on review — ⚠️ **CI is UNPROVEN; it has never run** |
| 7 | No change to reserved files | ✅ PASS |
| 8 | Build worker's flagged §9.1 over-reach | ✅ Judged **inside** ruling 4's intent; inventory count **byte-identical** — ⚠️ but **two** unenumerated edits exist, only **one** was flagged |

## 1. The demonstrated block — the gate was watched refusing

**Baseline first.** The tree is already dirty with 0266/0267/0268's shipped work plus new task
folders, so "clean" is the wrong assertion. `git status --porcelain` captured to a file: **33 entries**.

**Deliberate break.** `claude/scaffold/ai-agents/knowledge-base/conventions/one-skill-one-output.md`
was clean at baseline; one HTML comment line appended, **manifest deliberately NOT regenerated**.

Assertion A went red on its own first:

```
✖ A — the committed manifest is byte-exactly what the generator produces today (338.574334ms)
  AssertionError: claude/structure-manifest.tsv is STALE — it is not what
  bin/generate-structure-manifest.mjs produces from the repo as it stands.
    → fix: npm run generate:manifest   (then commit the manifest together with the change)
    sizes: committed 7805 bytes, regenerated 7931 bytes
ℹ tests 5  ℹ pass 4  ℹ fail 1
```

**`node bin/release.mjs --dry-run` → REFUSED.**

```
REAL_EXIT_CODE=1
```

stdout began:
```
• running `npm test` before release v0.2.2 (~5m30s; includes prove-red.sh)
```
…ran the suite, which failed (`ℹ fail 1` at stdout line 829), and stderr carried the refusal:
```
✗ npm test failed (exit 1) — refusing to release an untested tree.
  Nothing was changed: no bump, no commit, no tag.
  Fix the suite and re-run. To release anyway: --no-test (ships unverified).
```

`prove-red.sh` never ran — `npm test` is `node --test … && bash test/prove-red.sh`, so the `&&`
short-circuits. The refusal cost ~1 minute, not 5.5.

**No bump was written.** After the refusal:
```
$ cat VERSION                        → 0.2.1
$ shasum VERSION package.json
177bbfa1230aed3c965a514a3dc48116b6422126  VERSION
c5e466e7dbaccfd3860b857fe18e085b2fa08f7b  package.json     (both identical to pre-run)
$ git status --porcelain VERSION package.json   → empty
$ git tag -l 'v0.2.2'                → empty
```
No `bump version` / `commit` / `push` / `tag` step line appears anywhere in the output. The abort is
clean, exactly as the position argument claimed.

**Revert proved against the baseline, not against "clean".**
```
$ git checkout -- claude/scaffold/.../one-skill-one-output.md
$ diff baseline.txt after-revert.txt
DIFF_EXIT=0                    ← byte-identical porcelain
$ grep -c one-skill-one-output after-revert.txt  → 0     ← the break is gone
$ wc -l < after-revert.txt     → 33                      ← still dirty, NOT empty
```

## 2. Not vacuous in the other direction

Same command on the green tree:
```
• running `npm test` before release v0.2.2 (~5m30s; includes prove-red.sh)
ℹ tests 709   ℹ suites 17   ℹ pass 709   ℹ fail 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
✓ npm test green
• [dry-run] bump version 0.2.1 → 0.2.2 (VERSION + package.json)
• [dry-run] commit: "Release v0.2.2"
• [dry-run] push origin main
• [dry-run] create annotated tag v0.2.2
• [dry-run] push origin v0.2.2
Dry run — nothing was changed. Re-run without --dry-run to release.
REAL_EXIT_CODE=0        (real 369.97 / user 177.54 / sys 412.82)
```
`VERSION`/`package.json` shasums unchanged afterwards — `--dry-run` still wrote nothing with the gate
in front of it.

**Gate position re-verified in source:** gate call site `bin/release.mjs:186-195`; first
`writeFileSync` at `:201`. Nothing mutates before it.

## 3. `--no-test`

```
$ node bin/release.mjs --dry-run --no-test
EXIT=0
stderr:
⚠ --no-test: releasing WITHOUT running the suite.
⚠ The tree about to ship is UNVERIFIED — nothing has checked it.
```
Suite provably skipped: `grep -c "running \`npm test\`|tests 709|prove-red"` → **0** in both streams.
Banner is on **stderr**, unconditional, and prints before any plan output.

**No flag collision.** `bin/release.mjs:46` — `const has = (n) => argv.includes(n);` — exact array
element match, not a prefix test, so `--no-test` cannot be read as `--no-tag`/`--no-push`/`--no-bump`.
Demonstrated: `--dry-run --no-test --no-tag --no-push` produced all three effects independently —
banner, plus `• [dry-run] skip branch push (--no-push)` and `• [dry-run] skip tag (--no-tag)`.

## 4. `--help`

Exits 0, before the gate. Contains `--no-test   Skip the test gate — SHIPS AN UNVERIFIED TREE` and
the gate paragraph ("Every run runs `npm test` first (~5m30s) and refuses to release if it fails —
including under --dry-run…"). Both required documentation sites present (header block `:16-18`,
`:34`; help text `:68`, `:70-73`).

## 5. `npm test` — full suite, standalone

```
ℹ tests 709   ℹ suites 17   ℹ pass 709   ℹ fail 0   ℹ cancelled 0   ℹ skipped 0   ℹ todo 0
ℹ duration_ms 60280.954541
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
NPM_TEST_REAL_EXIT_CODE=0
real 380.28   user 171.25   sys 389.01
```

**Runtime vs the plan's recorded 328 s: measured 380 s (6 m 20 s) — ~16 % slower.** Same machine,
same darwin, `node v24.13.0`. Unit portion 60.3 s here vs 55.8 s at plan time. Nothing changed in the
suite; the difference is machine load, not a regression. **But it means the "~5m30s" figure written
into `--help`, the header block and the console line under-states the cost this run measured.** Not
fixed — it is an approximation in prose, not a proven defect, and correcting it is a judgment call
outside the verify remit.

## 6. CI — static review only. ⚠️ **CI IS UNPROVEN AND HAS NEVER RUN.**

This loop does not commit or push, so **no claim of green is made or implied.** What was checked:

| Requirement | Result |
|---|---|
| Valid YAML | ✅ parses (`ruby -ryaml`), exit 0 |
| `fetch-depth: 0` present | ✅ `fetch-depth: 0` on `actions/checkout@v4` |
| No `npm ci` / no `cache: npm` | ✅ — the only textual hits are inside an explanatory **comment** (line 43); neither appears as a key |
| `timeout-minutes` present | ✅ `20` |

Parsed structure:
```
top keys: ["name", true, "permissions", "jobs"]     # `on` → YAML-1.1 boolean key; normal, GitHub parses it correctly
on: {"push"=>{"branches"=>["main"]}, "pull_request"=>nil}
permissions: {"contents"=>"read"}
runs-on: "ubuntu-latest"   timeout-minutes: 20
step: {"uses"=>"actions/checkout@v4", "with"=>{"fetch-depth"=>0}}
step: {"uses"=>"actions/setup-node@v4", "with"=>{"node-version"=>"24"}}
step: {"run"=>"npm test"}
```
`fetch-depth: 0` confirmed load-bearing against the real guard at `test/structure-manifest.test.js`
(`git rev-parse --is-shallow-repository` → throws unless `false`).

**Unproven and stated plainly:** the workflow has never executed; the dash-vs-bash portability risk
the plan accepted is untested; a first run could legitimately go red.

## 7. Reserved files — untouched

`git status --porcelain` over `test/`, `bin/generate-structure-manifest.mjs`, `install.sh`,
`package.json`, `VERSION`, `ai-agents/wiki-vault/` → **all empty.** ✅

**`claude/structure-manifest.tsv` attribution — verified, not assumed.** Exactly `1 file changed,
1 insertion(+)`; the added row is
`145b38c0…	ai-agents/knowledge-base/conventions/task-status-vocabulary.md`. Proof it is **0268's**:
`shasum -a 256 claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md` →
`145b38c0b1250d955a4ba28f78a05902cfd8959202311cb51d97c511f6e2e6c3`, and `0268`'s worklog line 319
records that same hash as its own. **Not 0256's.**

`README.md` is likewise not this task's — its diff is `0267`'s ADR-041 glob prose, with zero mentions
of CI, the gate, or `--no-test`.

**0256's own change surface:** `bin/release.mjs` `+53`, `ai-agents/knowledge-base/architecture.md`
`+38 −19`, plus untracked `.github/workflows/test.yml`. Matches the build worklog exactly.

### ⚠️ The tree changed under verification — by a different worker, not by this one

Three files drifted from baseline **during** this run, all task-brief prose written by a concurrent
producer worker amending the ripples 0256 surfaced:
```
> M ai-agents/tasks/backlog/0240-…/brief.md   (15:30)
> M ai-agents/tasks/backlog/0251-…/brief.md   (15:31)
> M ai-agents/tasks/backlog/0252-…/brief.md
```
Nothing else drifted. This worker wrote no file except this worklog append. The step-1 revert proof
was captured **before** that drift and diffed clean (exit 0), so it is unaffected; the step-5 `npm
test` ran **after** it and was green anyway.

## 8. The flagged over-reach — §9.1's opening sentence

**(a) Is it genuinely a CI sentence this task falsified? — YES.**
The original read, in full: **`**There is a test suite; there is no CI.**`** Its entire second clause
is a CI claim, and `.github/workflows/test.yml` now exists on disk, so it is false as written.
Leaving it would have opened the section by contradicting its own new heading — a heading owner ruling
4 **did** authorize changing. Text-only, one sentence, trivially reversible. **Judged inside ruling
4's intent**, and the build worker flagged it rather than hiding it.

**(b) Does it touch the inventory count reserved for 0251? — NO. Byte-identical, and not reflowed.**
```
$ git show HEAD:…/architecture.md | grep -n "eight \`node --test\` contract"
478:established how fkit tests itself, and `test/` now holds a real one: **eight `node --test` contract
$ grep -n "eight \`node --test\` contract" …/architecture.md
480:established how fkit tests itself, and `test/` now holds a real one: **eight `node --test` contract
```
Same text, line number shifted only by the two lines added above it. The whole inventory paragraph
extracted from `HEAD` and from the working tree diffs **clean (exit 0)** and shares one checksum:
`b30f5296cc732b8f64fd6e4fa8eddbe1a64c07c1` on both sides. A 7-line window around the count also
matches (`c90f71a4…` both). **Confirmed byte-identical and unreflowed.**

### ⚠️ A SECOND unenumerated edit exists, and it was NOT flagged

The build worker's decision log names the opening sentence as *"the one place I read past the literal
enumeration."* That is not quite right — there is a second:
```
-**What the suite does not cover, and what that leaves at risk:**
+**What runs it, and what that still leaves at risk:**
```
This list lead-in is not in ruling 4's enumeration and is not literally a CI sentence. It is arguably
forced by the bullet rewrite ruling 4 **did** authorize — a list headed "what the suite does not
cover" cannot introduce two "landed" bullets — so it is very likely inside the ruling's intent, same
as the opening sentence. **Surfaced, not fixed:** whether the ruling's enumeration was exhaustive is
the owner's call, not a verify worker's.

### ⚠️ One wording nuance worth the owner's eye — not fixed

The corrected prose asserts CI **runs**, while CI has in fact **never run**:
- `:31` overview — *"since task 0256 it runs **automatically** — GitHub Actions on every push to
  `main`…"* — carries **no caveat at that site**.
- §9.1 opening — *"two mechanisms run it without anyone remembering to."*

§9.1 does carry the caveat three bullets later (*"Neither has been observed green on a runner yet"*),
so the section as a whole is honest. The standalone overview line at `:31` is the weaker spot. **Not
changed** — it is a judgment call about wording, not a proven defect, and it is outside the verify
remit.

## Ripple confirmed (surfaced by the build worker, verified here — not fixed)

`claude/skills/fkit-wiki-lint/SKILL.md:184-185` is now false in a **shipped** artifact:
*"this project has no CI"* and *"there is no `.github/`"*. Its citation was already stale before this
task — `grep -n "There is no CI and no test suite" ai-agents/knowledge-base/architecture.md` returns
**nothing**, so `architecture.md:390` does not say what the skill quotes. Two defects, one
pre-existing, one caused here. Out of this plan's scope; needs its own brief.

## Brief verification steps 5 and 6 — checked directly

- `grep -n "No CI\|no CI" ai-agents/knowledge-base/architecture.md` → **no matches** (exit 1).
  Correct: the brief required the bullet to survive *only if* CI did not land. CI landed.
- §11 OQ2 is a closed pointer in OQ1's `~~strikethrough~~ — RESOLVED` pattern, at `:593`, recording
  the ruling and its 2026-08-08 date, and stating the `shellcheck` / `install.sh` smoke install were
  **not** taken. No stale anchor links to the old §9.1 heading exist anywhere in the repo.

---

# Fix pass — separate Fix worker (bounded)

**Worker:** coder, spawned as a bounded **Fix worker** by `/fkit-sprint-ship-loop` (lead session),
under the declared-approval marker. **Date:** 2026-08-12. `plan.md` read with `cat` (blob
`e58aad6f516f32937d05304783a670521d2801fb`, 14599 bytes), never re-authored. Nothing committed or
pushed. `npm run release` never run for real. `ai-agents/wiki-vault/` never written.

**Three fresh owner rulings**, taken by the driver 2026-08-12 via `AskUserQuestion` **after** the
verify pass, in answer to the three wording concerns the verify worker surfaced but did not fix.
**All three applied. Nothing else was touched.**

## Decision log — the three rulings and what each changed

1. **Ruling: "Add the caveat at `:31` (Recommended)."** — answers the verify pass's *"One wording
   nuance worth the owner's eye"*: the overview line asserted *"since task 0256 it runs
   **automatically**"* with **no caveat at that site**, while **CI has never executed** (this loop does
   not commit or push, so the workflow is verified by static review only). §9.1 carried the caveat
   three bullets down, but `:31` is read standalone.
   **Changed** — `ai-agents/knowledge-base/architecture.md`, appended to the existing sentence
   (2 lines added, nothing removed, nothing reflowed):
   > ⚠️ **The CI half has never actually run**: the workflow is verified by review, not by a run. The
   > release gate *has* been watched refusing a red tree.
   **Why it qualifies:** verified-`CORRECT` (CI genuinely has no run; the gate genuinely was observed
   refusing — verify §1), text-only, one site, inside the approved plan's step 4 (`:31` is one of the
   four sites owner ruling 4 enumerated). The split wording is deliberate: the gate's caveat and CI's
   caveat are **not** the same claim, and flattening them into "neither has run" would have been false
   about the gate.

2. **Ruling: "Keep it (Recommended)."** — the §9.1 list lead-in the verify worker flagged as a second
   unenumerated edit (*"What the suite does not cover…"* → *"What runs it, and what that still leaves
   at risk"*). **NO ACTION — confirmed, not reverted.** Verified still present at `architecture.md:491`.

3. **Ruling: "Widen to \"~6 min\" (Recommended)."** — measured `npm test` is **380 s (6 m 20 s)**
   while both prose sites said **"~5m30s"**, a ~16 % under-statement of what a *blocking* gate costs.
   **Changed** — `bin/release.mjs`, the two prose sites the ruling named, text only:

   | Site | Before | After |
   |---|---|---|
   | console line printed before the suite runs (`:187`) | ``• running `npm test` before release v${target} (~5m30s; includes prove-red.sh)`` | ``…(~6 min; includes prove-red.sh)`` |
   | `--help` text (`:71`) | ``Every run runs `npm test` first (~5m30s) and refuses…`` | ``Every run runs `npm test` first (~6 min) and refuses…`` |

   **Why it qualifies:** mechanical, localized, prose-only, and inside the plan (the plan itself
   specifies this console line's wording). **⚠️ Neither measurement is wrong** — 328 s and 380 s are
   both real, same machine, same darwin, same `node v24.13.0`, unchanged suite; the spread is machine
   load. The point of the change is that the printed figure must not *under-state*. The headline
   figure in the "Measured cost" paragraph above now carries a superseding note recording both
   numbers and the ~5.5–6.5 min range.

   **Not changed, deliberately:** the header comment block carries **no** time figure (it was checked —
   only `--help` and the console line do, so "both sites" is exactly two). The code comment at `:186`
   (*"5+ minutes of silence reads as a hang"*) remains true at 6 m 20 s and does not under-state.
   Historical transcripts quoted in the build/verify sections above still read `~5m30s`; **those are
   evidence of what actually printed at the time and were left byte-intact rather than retro-edited.**

**No fix was applied outside these three rulings, and no obvious-winner call was made beyond them.**

## Scope kept

- ⛔ **`architecture.md`'s suite-inventory count — untouched, re-proved.** The inventory paragraph
  extracted from `HEAD` and from the working tree diffs **clean (exit 0)** and shares one checksum
  (`76a200e0c1e724446adb8d52078d88d284fc9251` on both sides). Its line number shifted 478 → 482 (two
  lines from the build pass, two from this one); the text is byte-identical and **unreflowed**. Still
  `0251`'s.
- ⛔ `git status --porcelain` over `test/`, `bin/generate-structure-manifest.mjs`, `install.sh`,
  `package.json`, `VERSION`, `ai-agents/wiki-vault/` → **all empty.**
- ⛔ `claude/structure-manifest.tsv` still `1 file changed, 1 insertion(+)` — **0268's** row, not
  touched here.
- ⛔ The gate's behavior, its call site, and `--no-test`'s semantics are **unchanged** — prose only.
  Re-checked: `node bin/release.mjs --dry-run --no-test` still prints the stderr banner, skips the
  suite, and proceeds to the dry-run plan.
- ⛔ Nothing committed or pushed; no task file moved; `plan.md` never re-authored.

## ⚠️ A THIRD "~5m30s" site exists — surfaced, deliberately NOT fixed

Ruling 3 named *"both sites in `bin/release.mjs`"*, and there are exactly two there — both changed.
But a **third** occurrence of the figure lives outside that file:

`.github/workflows/test.yml:26` (a comment justifying `timeout-minutes: 20`):
> ``# `npm test` measured at ~5m30s locally (55s unit + ~4m30s prove-red.sh, which re-runs the``
> `# suites against 15 mutants plus 9 clean-copy baselines). 20 minutes leaves generous headroom…`

**Left unchanged, for three reasons — but the owner may disagree, so it is flagged rather than
silently kept:**
1. It is **outside the ruling's named file** and outside this spawn's stated bounds (*"prose only in
   `release.mjs`"*).
2. It is a statement about a **past measurement** (*"measured at ~5m30s locally"*), which is **true** —
   328 s was really measured. It is incomplete, not false. That is the same reasoning under which the
   historical transcripts elsewhere in this worklog were left byte-intact.
3. Nothing turns on it: it justifies a **20-minute** timeout, and 6 m 20 s leaves that argument
   untouched. Unlike the two changed sites, it is not a cost figure shown to a releaser at the moment
   they are asked to wait.

**If the owner wants it consistent, it is a one-line comment edit.** Not taken here because reading
past an explicit enumeration is exactly what drew a finding twice already on this task.

## Verification of this fix pass

| # | Check | Result |
|---|---|---|
| 1 | `npm test` full suite, **real exit code captured** | ✅ **exit 0** — 709/709, 17 suites, `fail 0`, `✓ hard gate PASSED` |
| 2 | `node bin/release.mjs --help` renders the widened figure, exits 0 | ✅ `Every run runs \`npm test\` first (~6 min) and refuses to release if it fails —` |
| 3 | Gate behavior / call site / `--no-test` semantics unchanged | ✅ `--dry-run --no-test` → stderr banner, suite skipped, dry-run plan printed, nothing written |
| 4 | Inventory count byte-identical vs `HEAD` | ✅ diff exit 0, `76a200e0c1e724446adb8d52078d88d284fc9251` both sides |
| 5 | Reserved files untouched | ✅ `git status --porcelain` over `test/`, `bin/generate-structure-manifest.mjs`, `install.sh`, `package.json`, `VERSION`, `ai-agents/wiki-vault/` → all empty |
| 6 | §9.1 list lead-in kept (ruling 2) | ✅ present at `architecture.md:491` |

**Two full runs in this pass**, both green:

```
run 1:  ℹ tests 709  ℹ suites 17  ℹ pass 709  ℹ fail 0
        ✓ hard gate PASSED
        real 346.89   user 167.85   sys 371.86
        ⚠️ exit code NOT captured — the ${PIPESTATUS[0]} capture came back empty under zsh.

run 2:  ℹ tests 709  ℹ suites 17  ℹ pass 709  ℹ fail 0
        ✓ hard gate PASSED
        real 343.77   user 166.22   sys 366.23
        NPM_TEST_REAL_EXIT_CODE=0        ← measured, not inferred
```

Run 2 exists **only** because run 1's exit code was not actually measured. Rather than infer exit 0
from `fail 0` + `hard gate PASSED`, the suite was re-run with the status captured directly. Run 2 also
covers the **final** tree, including this worklog — which removes an ordering caveat that would
otherwise apply to run 1: run 1 was started after all *source* edits but before the worklog appends.
(That caveat was weak anyway — `worklog.md` content is not an input to any suite; the six test files
that mention "worklog" all do so **in comments only**, verified by grep.)

⚠️ **Still not proven, unchanged by this pass: CI has never executed.** This loop does not commit or
push. The workflow remains verified by static review only, and the dash-vs-bash portability risk the
owner knowingly accepted is still untested. That is exactly what the new `:31` caveat now says at the
site where the claim is made.

---

# Process-review pass — separate Process-review worker (bounded)

**Worker:** coder, spawned as the bounded **Process-review worker** by `/fkit-sprint-ship-loop` (lead
session), under the declared-approval marker. **Date:** 2026-08-12. `plan.md` read with `cat` (blob
`e58aad6f516f32937d05304783a670521d2801fb`, 14599 bytes) and **never re-authored**. Nothing committed
or pushed. `npm run release` never run for real — `--dry-run --no-test` only.
`ai-agents/wiki-vault/` never written. The reviewer's *Reviewer findings* section was **read only,
never edited**.

Applied the `fkit-process-stateful-review` method against `review.md`'s findings R1–R5: each verified
against the code before any edit, classified, given a verdict, and written into the coder-owned
*Coder response* table. **Six fresh owner rulings** (taken by the driver via `AskUserQuestion` after
the review) were folded in and **not re-asked**. Full verification detail lives in `review.md`; this
section is the audit record of what was changed unattended and why each change qualified.

## Decision log — every fix applied without asking

Six changes across three files. Five are direct owner rulings; **one is an obvious-winner call that
went past a ruling's literal enumeration and is flagged as such.**

1. **R1 — hedged the false-exactness prose at `bin/release.mjs:169-173`.**
   **What changed:** *"All three see the same bytes — so gating here tests exactly what is about to be
   committed"* → *"Both read the working tree — so gating here tests the tree **as it stood when the
   suite started**, uncommitted and untracked work included. **NOT the exact committed bytes**: the
   bump below writes VERSION and package.json after the suite, and ~6 min separate this gate from
   `git add -A`."*
   **Why it qualifies:** verified-`CORRECT` (gate call site `:185-195`; first `writeFileSync` `:201`;
   `git add -A` `:236` — the divergence is real and re-derived from the source, not taken on report),
   **mechanical/localized** (one comment block, text only), and an **explicit owner ruling** (*"Hedge
   the prose in both sites (Recommended)"*). ⛔ **No enforcement added** — the owner explicitly
   declined a `git status --porcelain` snapshot/refuse and reserved it as its own brief. The gate's
   behavior is untouched.

2. **R1 — same hedge at `ai-agents/knowledge-base/architecture.md:499-504`.**
   **What changed:** *"it sits immediately before `git add -A`, so it tests the exact bytes about to be
   committed"* → *"it tests the tree **as it stood when the suite started**… **Not the exact committed
   bytes**: the version bump writes `VERSION` and `package.json` after the suite, and ~6 min separate
   the gate from `git add -A`."*
   **Why it qualifies:** same ruling, same verified defect, second of the two enumerated sites. Prose
   only; the *"**CI structurally cannot do this**"* contrast the bullet exists to make is preserved
   verbatim. Inside the approved plan's step 4 (§9.1 CI sentences).

3. **⚠️ R1 — a THIRD site, `bin/release.mjs:71-73` (`--help` text). Past the ruling's literal "both
   sites" — flagged, not buried.**
   **What changed:** *"The suite reads the working tree, so it checks exactly what `git add -A` is
   about to commit."* → *"…so it checks the tree **as it stood when the suite started** — uncommitted
   and untracked work included, **but not the version bump written after it**."*
   **Why it qualifies — obvious winner within the ruling's intent:** it is the **identical** false
   claim the ruling exists to remove, and it sits in the **most user-facing** of the three places —
   `--help` output a releaser actually reads, versus two source comments they do not. R1 named two
   sites because the reviewer had not looked in `--help`; the owner ruled on the review's enumeration.
   Hedging the two comments while leaving the false sentence the tool **prints** would invert the
   ruling's purpose. Verified-`CORRECT` on the same evidence as items 1–2, text-only, one sentence,
   **reversible in a single edit** if the owner meant the enumeration as exhaustive.
   **Precedent, not licence:** ruling 3 of this same batch did exactly this — ruled a third site of a
   corrected figure **in** for consistency after an earlier worker left it out on enumeration grounds.
   **Also checked and deliberately NOT changed:** the header comment block (`:16-18`) makes no
   exactness claim (*"It runs before the first write, and under `--dry-run` too"*), so "three sites"
   is exactly three.

4. **R2 — corrected the misquoted `install.sh:19` line at both cited sites.**
   **What changed:** `` FKIT_REF="${FKIT_REF:-main}" `` → `` REF="${FKIT_REF:-main}" `` in
   `ai-agents/knowledge-base/architecture.md:497` and `.github/workflows/test.yml:4`.
   **Why it qualifies:** verified-`CORRECT` **against the file itself** as the ruling required —
   `install.sh:19` reads `REF="${FKIT_REF:-main}"`; `FKIT_REF` appears there only as the env override
   inside the expansion, and by name in the comment at `:15`. Mechanical, two one-line quotations,
   direct owner ruling. ⛔ **`install.sh` was not touched** — it was never wrong.

5. **Ruling 3 — widened the third `~5m30s` site, `.github/workflows/test.yml:26`.**
   **What changed:** *"`npm test` measured at ~5m30s locally (55s unit + ~4m30s prove-red.sh…). 20
   minutes leaves **generous** headroom…"* → *"`npm test` measured locally at **~5m30s-6m20s across
   four runs (328 / 380 / 347 / 344 s** — same machine, unchanged suite; the spread is machine load,
   not a regression), i.e. the **"~6 min"** quoted elsewhere. … 20 minutes leaves **~3x headroom over
   the slowest local run**…"*
   **Why it qualifies:** direct owner ruling, reversing an earlier worker's deliberate omission.
   Mechanical, comment-only, inside the file this task created. **The past measurement was NOT
   falsified** — the requirement the ruling set: the comment now carries the range *and every
   constituent number*, so *"328 s was really measured"* survives intact rather than being overwritten.
   **Consequential one-word change, recorded because it was not separately ruled:** the same sentence's
   *"generous headroom"* became the measured *"~3x headroom"*. That word was the wording half of **R5**,
   whose *value* half (raise the timeout) the owner **declined**. `timeout-minutes: 20` is
   **unchanged**; only the justification's arithmetic was made honest, and it had to move because the
   figure it was derived from moved.

6. **R4 — added `workflow_dispatch:` to `.github/workflows/test.yml`.**
   **What changed:** one trigger line plus one explanatory comment line under `on:`.
   **Why it qualifies:** direct owner ruling (*"Add `workflow_dispatch:` (Recommended)"*), one line as
   specified, verified-`CORRECT` in purpose — plan-gate ruling 2 bought *"a red first run is
   information"*, and with only `push: [main]` + `pull_request` that information required pushing to
   `main` or opening a PR. The extra comment line matches the file's existing
   comment-every-non-obvious-choice style. ⚠️ It gives CI a manual trigger; **it does not make CI
   proven.**

**No fix was applied outside these six**, and no other obvious-winner call was made. **R3 and R5 were
deliberately NOT fixed** — both are owner-ruled residuals, recorded in `review.md`'s *Accepted
residuals* with full What / Why (structural) / Re-raise-only-if. ⛔ **R3's follow-up brief was NOT
filed here** — the driver routes filing.

## Scope kept

- ⛔ **The gate's behavior, call site, and `--no-test` semantics are unchanged.** Every edit above is
  prose or a single workflow trigger line. Re-confirmed by running the tool, not by reading it (see
  verification 3 below).
- ⛔ No `test/`, `bin/generate-structure-manifest.mjs`, `install.sh`, `package.json`, `VERSION` or
  `claude/structure-manifest.tsv` edit. (`structure-manifest.tsv`'s single `+1` row remains **0268's**.)
- ⛔ No architecture.md suite-inventory edit — still `0251`'s.
- ⛔ The reviewer's *Reviewer findings* section: read, never edited. Only the coder-owned *Coder
  response* and the shared *Accepted residuals* were written.
- ⛔ Nothing committed or pushed; no task file moved; `plan.md` never re-authored;
  `ai-agents/wiki-vault/` never written.

## Verification of this pass

| # | Check | Result |
|---|-------|--------|
| 1 | `node --check bin/release.mjs` | ✅ syntax OK |
| 2 | `.github/workflows/test.yml` parses as YAML, `workflow_dispatch` present | ✅ see below |
| 3 | Gate behavior / call site / `--no-test` semantics unchanged | ✅ see below |
| 4 | `node bin/release.mjs --help` renders the hedged paragraph, exits 0 | ✅ `HELP_EXIT=0` |
| 5 | `npm test` full suite, **real exit code captured** | ✅ see below |

**2 — YAML.** `ruby -ryaml` parse, exit 0:
```
on: {"push"=>{"branches"=>["main"]}, "pull_request"=>nil, "workflow_dispatch"=>nil}
permissions: {"contents"=>"read"}   runs-on: ubuntu-latest   timeout-minutes: 20
steps: checkout@v4 (fetch-depth: 0) · setup-node@v4 (node-version "24") · run: npm test
```
`workflow_dispatch` is present as a top-level `on:` key; `fetch-depth: 0` and `timeout-minutes: 20`
are untouched. (`on` parses as YAML-1.1 boolean `true` — normal, and GitHub parses it correctly.)

**3 — the gate, exercised rather than argued.** `node bin/release.mjs --dry-run --no-test` →
`DRYRUN_EXIT=0`; the stderr banner printed unchanged (*"⚠ --no-test: releasing WITHOUT running the
suite."*); the suite was **provably skipped** — `grep -cE 'running .npm test.|tests 709|prove-red'`
returned **0** on both streams; the dry-run plan printed normally. `shasum VERSION package.json`
**identical** before and after. Gate call site re-read in source at `bin/release.mjs:185-195`, first
`writeFileSync` still at `:201` — nothing mutates before it.

## Surfaced, deliberately NOT fixed

**`architecture.md:493` now describes CI's triggers incompletely.** The bullet reads *"runs `npm test`
on every push to `main` and every pull request"* — after R4, there is also a manual
`workflow_dispatch` trigger.

**Left alone on a deliberate boundary: I fixed what was FALSE, and surfaced what is merely
INCOMPLETE.** The sentence is still true — CI does run on every push to `main` and every PR — and the
bullet's subject is what runs **automatically**, which a manual trigger is not. That is a different
case from R1's third site, which was an actively **false** claim in user-facing output. Having already
made one obvious-winner call past a ruling's enumeration (decision 3 above), a second on weaker
grounds would dilute the flag rather than sharpen it. **One clause if the owner wants it.**

**Unchanged from the verify pass, and not re-flagged as new:** the four ripple files landing CI
falsifies (`claude/skills/fkit-wiki-lint/SKILL.md:184-185`, and briefs `0251` / `0252` / `0240`), and
the latent `node_modules/` + `git add -A` note. Three of the four briefs were amended by a concurrent
producer worker during the verify pass. ⚠️ **One further ripple, new this pass:**
`ai-agents/tasks/backlog/0252-…/brief.md:35` states *"`bin/release.mjs` itself prints as `~5m30s`"* —
**now false**, since the earlier fix pass widened both printed sites to `~6 min`. Producer-owned; not
edited here.

## `npm test` — full suite on the final tree, real exit code measured

```
ℹ tests 709   ℹ suites 17   ℹ pass 709   ℹ fail 0   ℹ cancelled 0   ℹ skipped 0   ℹ todo 0
ℹ duration_ms 59037.374667
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
NPM_TEST_REAL_EXIT_CODE=0        ← measured, not inferred
real 343.43   user 166.66   sys 369.21
```

**The exit code was captured properly.** `/usr/bin/time -p npm test > out 2> time; echo $? >> time`
— redirection, **no pipe**, so the zsh `PIPESTATUS` trap that bit two earlier workers does not apply.
`0` is the process's own status, not an inference from `fail 0`.

**This is the fifth timing of the suite on this machine** (328 / 380 / 346.9 / 343.8 / **343.4 s**),
unchanged suite throughout. At 5 m 43 s it falls **inside** the `~5m30s-6m20s` range the new
`test.yml:28-32` comment states, so that comment needed no further update — and the `~6 min` in
`bin/release.mjs` still does not under-state.

⚠️ **Ordering caveat, stated precisely.** The run began after **every source and `architecture.md`
edit** was final, but before the `review.md` / `worklog.md` appends. Those are task-folder markdown
and **are not an input to any suite** — re-verified this pass: the six test files matching
`worklog|review\.md` (`dashboard-contract`, `structure-check`, `structure-spec`,
`closed-rank-immutability`, `dual-home-parity-exceptions`, `structure-manifest`) match **in comments
only**, with zero non-comment hits. No re-run was needed to cover them.

## Reserved-file proof, re-run after all edits

- `git status --porcelain test/ bin/generate-structure-manifest.mjs install.sh package.json VERSION
  ai-agents/wiki-vault/` → **empty.** ✅
- `claude/structure-manifest.tsv` → still `1 file changed, 1 insertion(+)` — **0268's** row. ✅
- **Suite-inventory count re-proved byte-identical vs `HEAD`**: the whole paragraph checksums
  `76a200e0c1e724446adb8d52078d88d284fc9251` on **both** sides; the line moved 478 → 482 by additions
  above it only, text unreflowed. Still `0251`'s. ✅
- **0256's change surface:** `bin/release.mjs` `+56`, `ai-agents/knowledge-base/architecture.md`
  `+60 −19`, plus untracked `.github/workflows/test.yml`. (Both counts include the earlier build/fix
  passes; this pass added prose only.)

⚠️ **Unchanged and still true: CI has never executed.** `workflow_dispatch:` gives it a manual
trigger; it does not run it. The workflow remains verified by static review only, and the
dash-vs-bash portability risk the owner knowingly accepted is still untested.

---

# Pass: one-clause trigger-enumeration fix (`architecture.md` §9.1 CI bullet)

## Decision log — the one ruling and what it changed

**One change, one file, one clause. No other edit was made in this pass.**

1. **Owner ruling, 2026-08-12, verbatim option label "Add the clause (Recommended)" — the §9.1 CI
   bullet's trigger enumeration was incomplete.**
   **Which ruling it answers:** this task added `workflow_dispatch:` to `.github/workflows/test.yml`,
   but `architecture.md`'s §9.1 CI bullet still enumerated only two triggers — *"on every push to
   `main` and every pull request"*. An enumeration missing a member reads as authoritative and wrong.
   **What changed** (`ai-agents/knowledge-base/architecture.md`, the `- **CI — landed (task 0256).**`
   bullet):
   *"…runs `npm test` on every push to `main` and every pull request, on `ubuntu-latest`, Node 24…"*
   → *"…runs `npm test` on every push to `main` and every pull request, **plus a manual
   `workflow_dispatch` trigger**, on `ubuntu-latest`, Node 24…"*
   **Why it qualifies:** verified-`CORRECT` against the workflow itself (`.github/workflows/test.yml`
   declares `push: branches: [main]`, `pull_request:`, and `workflow_dispatch:` — read this pass, not
   taken on report), **mechanical/localized** (one clause inserted; the remaining words of the bullet
   are unchanged, only re-wrapped where the insertion pushed the hard wrap), and an **explicit owner
   ruling** naming exactly this edit.
   **Line number re-verified, not trusted:** the ruling cited `:493`; the sentence was found at `:493`
   in the current tree and read there before editing.
   **⚠️ Deliberately NOT a claim that CI works.** The wording says the workflow *has* a manual
   trigger — it does not assert an observed run. CI has still never executed; the §9.1 bullet three
   items down (*"Neither has been observed green on a runner yet"*) is untouched and still governs.

## Reserved-file proof for this pass

- **Suite-inventory count (`0251`'s) re-proved byte-identical across this edit.** The paragraph
  (*"eight `node --test` contract suites"* + its eight-name list, `:482-490`) checksums
  `76a200e0c1e724446adb8d52078d88d284fc9251` (sha1) **both before and after** this pass, and the same
  value over the corresponding `HEAD` lines `478-486`. Unreflowed, unmoved by this edit — the edit is
  entirely **below** it.
- `git diff` for this pass touches **only** the §9.1 CI bullet. `bin/release.mjs`,
  `.github/workflows/test.yml`, `test/`, `install.sh`, `package.json`, `VERSION`, and
  `claude/structure-manifest.tsv` were not opened for writing.
- Nothing committed or pushed. `ai-agents/wiki-vault/` untouched. `plan.md` untouched.

## Test coverage of `architecture.md` — checked, not assumed

**No test asserts `architecture.md`'s content**, so no suite run was required for this prose edit.
Checked directly: `grep -rn "architecture\.md" test/` returns three kinds of hit, none of them an
assertion on the live file's text —
1. `test/dual-home-parity-exceptions.mjs:91-99` lists `knowledge-base/architecture.md` as a
   **`live-only` exception**, i.e. `test/dual-home-parity.test.js` explicitly **subtracts** it from
   the byte-parity set (the scaffold ships no copy at all);
2. `test/fixtures/closed-rank-0174-{before,after}.md` mention the path in **fixture prose** (frozen
   dashboard text), never reading the real file;
3. no other test file references it.
