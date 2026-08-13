# Worklog — Task 0254: fix the unrunnable verify command `bin/release.mjs` prints

**Step:** Build (spawned `fkit-coder` worker under `/fkit-sprint-ship-loop`)
**Date:** 2026-08-13
**Plan:** [`plan.md`](plan.md) — approved by the owner 2026-08-13 via `AskUserQuestion` in the `fkit lead`
driver session, with all three open questions answered (see the plan's driver-appended section).

Every command below was **run**, and its output is pasted **verbatim** — nothing here is asserted from
memory or inference (`ai-agents/knowledge-base/conventions/evidence-before-assertion.md`).

---

## 1. The change

**One line, one file** — `bin/release.mjs:276`, exactly as plan §2 specifies.

```diff
diff --git a/bin/release.mjs b/bin/release.mjs
index 0552f18..aea561f 100644
--- a/bin/release.mjs
+++ b/bin/release.mjs
@@ -273,5 +273,5 @@ if (dryRun) {
   console.log(`\n${"─".repeat(48)}\nDry run — nothing was changed. Re-run without --dry-run to release.`);
 } else {
   console.log(`\n${"─".repeat(48)}\n✓ Released ${tag}`);
-  console.log(`  Verify: npx github:flashist/fkit#${tag} --version`);
+  console.log(`  Verify tag on origin: git ls-remote --exit-code --tags origin ${tag}`);
 }
```

Nothing else in the file was touched. No `bin` field added to `package.json` (⛔ ADR-011). No second
printed line about installs tracking `main` (owner answer 2 — *"No — leave it out"*).

---

## 2. Verification — plan §3

**Environment:** `git version 2.50.1 (Apple Git-155)`, `node v24.13.0`.

### Step 1 — the replacement command, positive case ✅

```
$ git ls-remote --exit-code --tags origin v0.2.1 ; echo "exit=$?"
18595e808f9798d1e26cd3a2f8203f25e0df21a8	refs/tags/v0.2.1
exit=0
```

⚠️ **Correction to plan §5's "annotated-tag peeled refs" edge case.** The plan expected **two** lines
(`refs/tags/v0.2.1` and the peeled `refs/tags/v0.2.1^{}`). Only **one** line prints. The peeled ref
exists on origin — it is visible in an unfiltered listing — but a pattern argument matches against the
ref-path tail, and `refs/tags/v0.2.1^{}` does not tail-match `v0.2.1`. Cosmetic; the exit code is
unaffected. Recorded so the plan's expectation is not read as an unmet one.

### Step 2 — the replacement command, negative case ✅ (the load-bearing one)

This is the case that would have caught the original defect, so it was run.

```
$ git ls-remote --exit-code --tags origin v99.99.99 ; echo "exit=$?"
exit=2
```

No output, `exit=2`. **`--exit-code` behaves as the man page states on this git build** — the printed
command can genuinely fail, which is the whole point of the fix. Network reach to `origin` was
available, so the plan's `BLOCKED` contingency did not fire.

### Step 2b — prefix matching (plan §5, resolved empirically rather than argued)

The plan flagged a risk that `v0.2.1` might spuriously match `v0.2.10`. `origin` carries both `v0.1.1`
and `v0.1.10`–`v0.1.17`, which is an exact natural experiment for the same question:

```
$ git ls-remote --exit-code --tags origin v0.1.1 ; echo "exit=$?"
d7df6f1f146eea4fd4b284e28076895bde28e739	refs/tags/v0.1.1
exit=0
```

Matches **only** `refs/tags/v0.1.1` — not `v0.1.10` through `v0.1.17`. **No prefix-matching problem.**
The plan's contingency (switching the printed pattern to a fully qualified `refs/tags/${tag}`) is
therefore **not** taken, and the shipped line stays as planned.

### Step 3 — the rendered string, proven byte-identical ✅

The changed line is unreachable in `--dry-run` (see the honesty note below), so the emitted string was
rendered directly and compared byte-for-byte against the command actually executed in step 1:

```
$ node -e 'const tag="v0.2.1"; console.log(`  Verify tag on origin: git ls-remote --exit-code --tags origin ${tag}`)'
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.1
```

`diff` of the rendered command (label stripped) against the executed command → **identical, exit 0**.
The rendered text was then executed verbatim through `sh -c`:

```
$ sh -c "$(cat rendered.txt)"; echo "exit=$?"
18595e808f9798d1e26cd3a2f8203f25e0df21a8	refs/tags/v0.2.1
exit=0
```

**The exact string the script will print is a working, copy-pasteable command.**

### Step 4 — `--dry-run` + full `npm test` ✅ RUN AND GREEN (Verify worker, 2026-08-13)

Filled by the spawned **Verify** worker under `/fkit-sprint-ship-loop`. The driver split plan §3
step 4 out of the Build step so the multi-minute suite did not run inside the build context; **the plan
licenses that split** (§3 step 4). The split option was **not** taken — `node bin/release.mjs --dry-run`
was run **as a single combined run**, which is the stronger of the two forms the plan allows, so no
separate standalone `npm test` was owed.

**Run once. Not retried, not re-run to obtain a greener result.** Full log retained at
`scratchpad/dryrun.log` (852 lines).

#### 4a. Pre-run safety audit — `--dry-run` is honored on every mutating path ✅

Required before running, since a mis-guarded path would bump a version, write a tag, or push. Audited
from the source, not assumed:

| Mutating operation | Line | Guard |
|---|---|---|
| `writeFileSync(versionPath, …)` | 204 | inside `if (!dryRun)` at 203 |
| `writeFileSync(pkgPath, …)` | 206 | inside `if (!dryRun)` at 203 |
| `git add -A` | 239 | inside the `else` of `if (dryRun)` at 234 |
| `git commit -m` | 244 | `if (!dryRun)` inline |
| `git push origin <branch>` | 252 | `if (!dryRun)` inline |
| `git tag -a` | 260 | `if (!dryRun)` inline |
| `git push origin <tag>` | 263 | `if (!dryRun)` inline |

Every remaining `git` call is read-only (`rev-parse`, `remote`, `tag --list`, `ls-remote --tags`,
`status --short`). **No unguarded mutating path** → cleared to run; no `BLOCKED` was owed.

#### 4b. Measured runtime

```
$ time node bin/release.mjs --dry-run
RELEASE_EXIT=0
WALL_CLOCK_SECONDS=463
```

**463 s wall clock (7 min 43 s).** Measured, not estimated. ⚠️ **This exceeds the plan's and the
script's own "~6 min" figure by ~28%** — recorded as-is rather than rounded to the documented estimate.
The `npm test` phase alone was `duration_ms 78542.77` for the unit suite, with the remainder in
`prove-red.sh`. No action taken: the estimate lives in `bin/release.mjs:71` and `:190`, and correcting
it would be a second-file… in fact a second-*line* change outside the approved plan (⛔).

#### 4c. `npm test` result — full suite, green

Unit suite (`node --test test/*.test.js`), verbatim summary:

```
ℹ tests 723
ℹ suites 17
ℹ pass 723
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 78542.77325
```

`prove-red.sh` hard gate, verbatim final lines:

```
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
✓ npm test green
```

All **17** mutation cases went red on their named assertion as required (`grep -c "should go RED ... red"`
→ `17`), and the two baselines (`0a` real launcher, `0b` unmutated full copy) were green.

**Zero failures anywhere in the log:** `grep -cE "^✖|^not ok"` → `0`.

#### 4d. `test/structure-manifest.test.js` — MEASURED green ✅

Plan §5's scope risk. §3 below predicted green but did **not** measure it; this measures it. All five
tests, verbatim from this run (log lines 690–694):

```
✔ A — the committed manifest is byte-exactly what the generator produces today (1393.911833ms)
✔ B — multi-era coverage: ai-agents/README.md carries a shipped hash from every home (49.2965ms)
✔ C — CRLF contract: an ending-only variant of a shipped file matches; a content edit does not (0.257917ms)
✔ D — elision contract: block-only drift in a root file matches; body drift or deleted markers do not (32.176125ms)
✔ E — marker recognition carries marker_lines' contract: whole-line equality, [ \t\r] trimmed (0.445917ms)
```

**Test A is the staleness guard** — byte-equality between the committed manifest and what the generator
produces today. Green means editing `bin/release.mjs` did **not** stale
`claude/structure-manifest.tsv`. **Plan §5's `NEEDS-DECISION` trigger did not fire**, and the manifest
was **not** regenerated (⛔ boundary held).

Independently corroborated from the generator's source: `bin/generate-structure-manifest.mjs`
`WALK_PATHS` (`:81`) derives from `HOME_PREFIXES` (`:69-71` — `generic/ai-agents/`,
`omnigent/scaffold/ai-agents/`, `claude/scaffold/ai-agents/`) plus `ROOT_FILES` (`:74-79` —
`{omnigent,claude}/scaffold/{CLAUDE,AGENTS}.md`). **`bin/` is not a covered path.** §3's prediction is
therefore now discharged by measurement, not merely by argument.

#### 4e. The `--dry-run` plan output, verbatim

```
• [dry-run] bump version 0.2.1 → 0.2.2 (VERSION + package.json)

fkit release → v0.2.2  (branch: main)

working-tree changes:
M ai-agents/sprints/sprint-5.md
 M ai-agents/tasks/backlog/0254-fix-the-unrunnable-verify-command-release-mjs-prints/brief.md
 M bin/release.mjs
?? ai-agents/tasks/backlog/0254-fix-the-unrunnable-verify-command-release-mjs-prints/plan.md
?? ai-agents/tasks/backlog/0254-fix-the-unrunnable-verify-command-release-mjs-prints/worklog.md

• [dry-run] commit: "Release v0.2.2"
• [dry-run] push origin main
• [dry-run] create annotated tag v0.2.2
• [dry-run] push origin v0.2.2

────────────────────────────────────────────────
Dry run — nothing was changed. Re-run without --dry-run to release.
```

Every step carries the `[dry-run]` prefix; the script ran to completion and exited `0`.
**Brief step 1, first half, satisfied: `node bin/release.mjs --dry-run` runs clean.**

⚠️ **Incidental observation, NOT a finding and NOT acted on.** The first line of the
`working-tree changes:` block prints as `M ai-agents/…` while every later line prints ` M ai-agents/…`
— the leading space is lost because `git()` returns `.out` trimmed (`:97`) and the block is printed
raw (`:225`). Purely cosmetic, **pre-existing**, entirely unrelated to this task's line, and outside
the approved plan. Recorded because it is visible in the evidence above and should not be mistaken
later for something this change introduced.

#### 4f. The dry run mutated nothing — measured before and after

| | Before | After |
|---|---|---|
| `VERSION` | `0.2.1` | `0.2.1` |
| `package.json` version | `0.2.1` | `0.2.1` |
| local tag count | `32` | `32` |
| `git tag --list v0.2.2` | *(absent)* | *(absent)* |
| `HEAD` | `1c82cbf6cb549a8a8cc97d2d4416acc9bb8f0a95` | `1c82cbf6cb549a8a8cc97d2d4416acc9bb8f0a95` |
| `git status --short` | 3 modified, 2 untracked | 3 modified, 2 untracked (identical) |

No bump, no commit, no tag, no push. A mid-run check (taken while `prove-red.sh` was still executing)
showed the same state, so `npm test` did not mutate the tree either.

#### 4g. ⚠️ Honesty note — this run does NOT exercise the changed line

`--dry-run` takes the **`if (dryRun)`** branch of the summary block (`:272-277`) and printed
*"Dry run — nothing was changed."* The edited line lives in the **`else`** branch. **It never
executed in this run.**

What §4 proves: the script still parses, runs end-to-end, and exits `0` with the edit in place, and the
full suite is green against the edited tree. **What it does not prove: the edited branch firing.** Do
not read "dry-run clean + tests green" as end-to-end coverage of the changed line — see §4. ⚠️ §4's
*conclusion* was **corrected 2026-08-13** (review finding R3): the branch is not unverifiable, it was
merely never verified here. The coverage caveat in this §4g is unaffected and still holds.

#### 4h. Verify worker's ADR-019 / ADR-032 audit entry

**Fixes applied without asking: `none`. Obvious-winner calls: `none`.** No source file was touched in
this step; the only file written is this `worklog.md` §2 step 4. No `NEEDS-DECISION` was withheld —
the one boundary that could have forced one (plan §5's structure manifest, §4d above) was measured and
did not fire.

**Superseded — the parse check the Build worker ran while step 4 was deferred:**

```
$ node --check bin/release.mjs ; echo "exit=$?"
exit=0
```

This proves the file still **parses**. It does **not** prove the script runs, and it does not discharge
step 4.

### Step 5 — old `npx` string is gone ✅

```
$ grep -n "npx github:flashist" bin/release.mjs ; echo "exit=$?"
exit=1
```

No hit (`exit=1` is grep's no-match). Brief step 1, second half, satisfied.

### Step 6 — no `bin` field in `package.json` ✅ (⛔ boundary held)

```
$ grep -n '"bin"' package.json ; echo "exit=$?"
exit=1
```

No hit. ADR-011 boundary intact — same result the driver measured before approval.

### Step 7 — `git diff --stat` ⚠️ PASSES ONLY WHEN SCOPED — read this one carefully

```
$ git diff --stat
 ai-agents/sprints/sprint-5.md                                           | 2 +-
 .../0254-fix-the-unrunnable-verify-command-release-mjs-prints/brief.md  | 2 +-
 bin/release.mjs                                                         | 2 +-
 3 files changed, 3 insertions(+), 3 deletions(-)
```

```
$ git diff --stat -- bin/
 bin/release.mjs | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

```
$ git status --short
 M ai-agents/sprints/sprint-5.md
 M ai-agents/tasks/backlog/0254-…-release-mjs-prints/brief.md
 M bin/release.mjs
?? ai-agents/tasks/backlog/0254-…-release-mjs-prints/plan.md
```

**Brief verification step 3 says `git diff --stat` must show exactly one file. Unscoped, it shows
three.** The honest reading:

- **My change surface is exactly one file — `bin/release.mjs`.** Scoped to `bin/`, step 3 passes
  literally.
- The other two tracked modifications are the **driver's own bookkeeping**, present **before I edited
  anything** — `git status --short` was captured at the start of this step and already showed both.
  Each is a single-line status flip `🔲 Backlog` → `🔄 In progress` (in `sprint-5.md:165` and the
  brief's `## Status`). I did not make them and, per owner answer 3, did not touch them.
- `plan.md` and this `worklog.md` are **untracked**, so they stay invisible to `git diff --stat` —
  which is exactly the reading the owner accepted in answer 1.

The owner's answer 1 anticipated the **untracked** files. It did not anticipate the driver's **tracked**
status flips. This is surfaced rather than silently scoped away; it changes nothing about what was
built.

### Extra check — no test depends on the changed string ✅

Confirms plan §5's claim rather than trusting it:

```
$ grep -rn "npx github" test/ ; echo "exit=$?"
exit=1
```

The `ls-remote` matches inside `test/update-banner.test.js` are stubs for the **launcher's update
banner**, an unrelated subsystem; `test/prove-red.sh:739` is a comment. **No test asserts on the release
summary line**, so no test needed updating — consistent with ⛔ "no added test gate".

Remaining repo-wide references to the old `npx` string live **only** in `brief.md`, `plan.md`,
`sprint-5.md:165`, and `backlog.md:181` — all task/sprint documents, all explicitly out of scope
(owner answer 3). No shipped artifact (`README.md`, `install.sh`, `claude/`) references it.

---

## 3. Plan §5's structure-manifest risk — checked, does NOT materialize

The plan flagged that `bin/release.mjs` might be covered by the structure manifest, and that a red
`structure-manifest.test.js` would be a **scope question**, not a silent second-file fix. Checked:

```
$ grep -n "release" claude/structure-manifest.tsv ; echo "exit=$?"
exit=1

$ grep -n "bin" claude/structure-manifest.tsv
2:# Generated by bin/generate-structure-manifest.mjs — DO NOT EDIT BY HAND.
```

The only `bin` occurrence is the generator's own path inside a **comment**. The manifest is
`<sha256>\t<path>`, 85 lines, and its path column covers exactly three top-level entries:

```
$ grep -v '^#' claude/structure-manifest.tsv | awk -F'\t' 'NF>1{split($2,a,"/"); print a[1]}' | sort -u
AGENTS.md
CLAUDE.md
ai-agents
```

**`bin/` is not a covered path.** So editing `bin/release.mjs` cannot stale the manifest, and no
`NEEDS-DECISION` was owed on that boundary. ⚠️ **Predicted green, not measured green** — the empirical
confirmation is `test/structure-manifest.test.js` inside the Verify worker's `npm test` run.

---

## 4. Honesty note that must survive into the ship report

**`--dry-run` does not exercise the changed line.** The summary block is
`if (dryRun) { …"Dry run — nothing was changed"… } else { …the Verify line… }` (`bin/release.mjs:272-277`),
so the edited branch executes only on a **real, non-dry release**, which this task does not perform.

What is proven: the exact string the branch will emit (step 3), that the string is a working command in
both the success and failure cases (steps 1, 2), that the file parses (`node --check`), and — pending
the Verify worker — that the script still runs and the suite is green (step 4).

**What remains unverified by the Build and Verify steps: the branch actually firing.** "Dry-run clean
+ tests green" must not be read as end-to-end coverage of this line — `--dry-run` takes the other
branch, so the repo's own suite never executes `:276`. **That limitation stands and is real.**

> ⚠️ **CORRECTED 2026-08-13 — review finding R3, owner-ruled *"Yes — correct it before close"*.**
> This paragraph previously ended: *"It cannot be, by construction."* **That claim was false**, and
> it is withdrawn.
>
> The branch **can** be executed, cheaply and with zero risk to the real repo or remote — a `git
> clone` into a throwaway plus `node bin/release.mjs --no-test --no-push` runs it in about ten
> seconds. The reviewer did exactly that, and the **first execution of this line in its whole life**
> happened during review, not during Build. It immediately surfaced two defects (R1: the verify line
> prints even when the tag was skipped or not pushed — including under `--no-tag` alone, which does
> publish commits; R2: `--no-bump` over an existing origin tag verifies **green** against a tag
> naming a different commit). Both are invisible to reading the line and fall out of the first run.
>
> **The true statement is the weaker one:** the branch was **not** verified during Build or Verify,
> and that was a gap in method, not a property of the code. The caveat above it — that `--dry-run`
> and the test suite do not cover this line — is unaffected and still applies.
>
> Full verification and dispositions: [`review.md`](review.md) § *Coder response*, R3.

---

## 5. Decision log — ADR-019 / ADR-032 audit obligation

Per ADR-019 (`:96`) and ADR-020's worklog decision log, carried onto a spawned worker by ADR-032: every
fix applied without asking, and every obvious-winner call, recorded with which point it answers, what
changed, and why it qualified.

| # | What | Which point it answers | Why it qualified |
|---|---|---|---|
| 1 | Applied the one-line edit at `bin/release.mjs:276` | Plan §2, the task's entire deliverable | **Verbatim in the approved plan** — not an unattended judgement call at all. The plan specifies the exact replacement string; I typed it. |
| 2 | Did **not** switch the printed pattern to `refs/tags/${tag}` | Plan §5's prefix-matching contingency | **Obvious winner, inside the plan's intent.** The plan says to switch *"if verification step 1 shows otherwise"*. It did not: `v0.1.1` matches only `refs/tags/v0.1.1`, never `v0.1.10`–`v0.1.17` (measured, §2 step 2b). The contingency's own trigger did not fire, so not switching **is** the plan. |
| 3 | Ran `node --check bin/release.mjs`, an extra command not in the plan | Partially offsets the deferred step 4 | **Mechanical, localized, read-only.** Adds evidence, changes no file, and is labelled in §2 as explicitly **not** a substitute for step 4. Withholding a cheap parse check while step 4 is deferred would have made the record weaker, not more faithful. |
| 4 | Recorded the peeled-ref correction (one line, not two) rather than treating it as a failure | Plan §5's annotated-tag edge case | **Mechanical/localized, no code impact.** Exit code is what the fix turns on and it is unaffected. Correcting the record is required by `evidence-before-assertion.md`; it changes nothing shipped. |
| 5 | Scoped step 7 to `bin/` **and** reported the unscoped three-file result | Brief verification step 3 vs. the driver's pre-existing status flips | **Not applied as a fix — surfaced instead.** No file was touched to make step 3 pass. Both results are recorded so the owner sees the literal failure and its cause. Editing or reverting the driver's flips would have breached owner answer 3 (⛔ nothing outside `bin/release.mjs` and this worklog). |

**No `NEEDS-DECISION` was withheld.** The two boundaries that could have forced one — the structure
manifest (§3) and prefix matching (§2 step 2b) — were both checked empirically and neither fired. No
frontier-move, no behavior-changing fix beyond the approved line, nothing outside the approved plan.

### 5b. Process-review step — ADR-019 / ADR-032 audit entry (2026-08-13)

Spawned `fkit-coder` **Process-review** worker under `/fkit-sprint-ship-loop`, applying
`fkit-process-stateful-review` to Round 1 of [`review.md`](review.md).

**Fixes applied to source without asking: `none`. Obvious-winner calls: `none`.**

**⚠️ "No source fix" is the expected outcome of this step, not a step skipped.** The owner ruled on
every finding *before* this worker was spawned, and every ruling either defers the fix (R1, R2 → a
follow-up task) or declines it (R4 → *"Unactioned — pre-existing"*). `bin/release.mjs` is
**byte-unchanged** by this step; the diff is still the single line from §1. Nothing in the ledger was
fixable inside the brief's ⛔ *"no other change to `bin/release.mjs`"* anyway — R1 needs a guard, R2
needs a stronger check, and both exceed the approved plan.

| # | What | Which finding it answers | Why it qualified |
|---|---|---|---|
| 1 | Corrected §4's *"It cannot be, by construction"* to the true, weaker statement; kept the `--dry-run` coverage caveat intact | **R3** | **Not an unattended judgement call** — the owner ruled it directly, verbatim option label *"Yes — correct it before close"*, and the spawn prompt bounded the shape (correct the claim, do not delete the caveat). Record-only; no source touched. |
| 2 | Updated §4g's stale cross-reference (*"see §4, which stands unchanged"*) | **R3** | **Mechanical/localized.** R3 names *"§4, §4g"*. §4g's own caveat is correct and was preserved verbatim; only the pointer asserting §4 was unchanged became false once §4 was corrected. Leaving it would have created a new false claim while fixing an old one. |
| 3 | Recorded R1 as **broader than the ledger reported** — `--no-tag` *alone* (a pushing release) also prints a failing verify | **R1** | **Not a fix — a verification result, surfaced.** Found by independent re-measurement, which `CLAUDE.md` §Review Notes requires. Widens what the follow-up brief must cover; changes nothing shipped. |
| 4 | Recorded a **correction to R5's table wording** — exit 2 and 128 are distinct and the unreachable case is not silent, so *"conflates"* is overstated | **R5** | **Not a fix — a correction to the record.** The reviewer's R5 *body* already says the codes distinguish; only the one-line table claim overstates. Recording a false finding as CORRECT would be worse than no ledger. The substantive half (tag-absent is silent on both streams) is confirmed and stands. |
| 5 | **Did not** fold R5 into the R1/R2 follow-up, and **did not** drop it — returned `NEEDS-DECISION` | **R5** | **Explicitly NOT an obvious winner.** It is a scope call on a task not yet filed, and the owner ruled the *other* frontier-move (R4) explicitly out of that follow-up — so either reading is a judgement. Escalated rather than settled. ✅ **Resolved 2026-08-13 by owner ruling — folded into the R1/R2 follow-up task; see [`review.md`](review.md) § *Coder response*, R5.** (Pointer only — the escalation record above stands as written, as the audit record of the unattended act.) |

**Verification method, for the audit trail:** R1, R2, R4, R5 re-measured by execution in **throwaway
clones** (`scratchpad/r254/`) whose `origin` was a **local bare clone**, never `flashist/fkit`; R3 by
counter-example. No network contact, no push, no tag created or deleted on the real origin. Real-repo
integrity re-checked after: `HEAD 1c82cbf6…`, 32 local tags, `VERSION 0.2.1`, `git status --porcelain`
all identical to the pre-step snapshot. The 463 s `--dry-run` + suite (§2 step 4) was **not** re-run —
neither by me nor by the reviewer; both of us take that result from this worklog.

**Write surface of this step: exactly two files** — [`review.md`](review.md) (*Coder response* section
only; the *Reviewer findings* section was not edited) and this `worklog.md` (§4, §4g, §5b). No commit,
no push, no task-file move, no `wiki-vault/` write, no follow-up task filed (the producer's).

---

## 6. Boundaries held

- ⛔ No `bin` field in `package.json` — verified, §2 step 6.
- ⛔ No other change to `bin/release.mjs` — no bump logic, no tag logic, no added test gate. Diff is one line.
- ⛔ No `ai-agents/wiki-vault/` write. No commit. No push. No task-file move.
- ⛔ Nothing edited outside `bin/release.mjs` and this `worklog.md` — `brief.md`, `sprint-5.md`, and
  `backlog.md` untouched by me (owner answer 3; their pre-existing modifications are the driver's).
- `plan.md` was neither re-authored nor edited. Its blob hash was independently re-computed as a carry
  check: `git hash-object` → `530731b8fedce5b325092c172aef90f9b1f97766`, `wc -c` → `16752` — **both
  match the driver's declared values**.
