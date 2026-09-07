# Worklog — 0359: the throughput counter (created vs closed per ISO week, plus the record-repair share)

## 2026-09-07 — Build step (spawned `fkit-coder` Build worker, driver `fkit-sprint-ship-loop`)

**Role:** `fkit-coder`, Build worker, spawned by `fkit-sprint-ship-loop`.

Ran under the declared-approval marker: the owner approved `plan.md` in a live `fkit lead` session,
option label verbatim **"Approve as written (Rec)"**, with rulings **W0–W6** in the plan's
§ *⭐ OWNER RULINGS* appendix. Implemented `plan.md` § *9. Sequencing*, steps 1–9. Stopped at step 9 —
no review requested (the driver spawns that separately).

### Carry verification

Verified the plan file myself rather than trusting the paste. `git hash-object` →
`2de62acad863854d43a51fa472ea0619baaf8aaf`, `wc -c` → `24846` bytes, both matching the pointer in the
spawn prompt. Read the file's opening sections back and compared against the pasted text — identical.
HEAD confirmed as `cf289c26394526ff2601800aa8f40d1873f370ba`. The file and the paste agree, so no
"file wins" correction was needed.

### What changed — four files, none of them `dashboard.sh`

1. **`claude/skills/fkit-status/throughput.mjs`** — new. The counter. Pure functions (`classify`,
   `isoWeek`, `foldTransitions`, `briefIdentity`, `parseArgs`) exported for unit testing; `--repo`
   and `--at` as the injection seams; `--list` for the per-row audit. Its own markers
   (`⟦fkit-throughput v1⟧` / `⟦WEEKS⟧` / `⟦REPAIR⟧` / `⟦END⟧`), so nothing that parses the board sees
   a new token.
2. **`claude/skills/fkit-status/SKILL.md`** — amended. The Backlog board's beat-1 headline cell, per
   the plan's § *7* draft. The ban survives in the first clause; what is lifted is narrow and
   conditional.
3. **`test/throughput-counter.test.js`** — new. 25 tests: pure-function units, an `os.tmpdir()` git
   fixture, the pinned `--at a9c2709` baseline, and live-corpus reads as `t.diagnostic` only.
4. **`test/prove-red.sh`** — one new runner, one new baseline step (`0n`), one new mutation (`29`).

⛔ `claude/skills/fkit-status/dashboard.sh` is byte-unchanged — `git diff --quiet` on it returns
clean. ⛔ Nothing written under `ai-agents/wiki-vault/`. ⛔ No task folder moved, no `## Status`
touched, no board row flipped. ⛔ No commit, no push. ⛔ The gitignored `.claude/` mirror was not
edited, and **no `claude/` change in this session is live** — init has not been re-run.

### Verification, measured this turn

| Check | Result |
|---|---|
| `node claude/skills/fkit-status/throughput.mjs --at a9c2709` | exit 0, open **129** |
| `node --test test/throughput-counter.test.js` | **25/25 pass** |
| `bash test/prove-red.sh` | **29 mutations, hard gate PASSED** |
| `node --test test/coordination-citation-policy.test.js` | **21/21 pass** |
| `node --test test/reference-integrity.test.js` | **20/20 pass**, 0 broken, 7 named-exempt |
| `dashboard.sh` byte-unchanged | confirmed, no diff |

### ⭐ The reconciliation the plan asked for — the residual is ZERO, not 2

The plan's § *11* expected a residual of 2 against the 228 done folders and asked that it be
reconciled exactly rather than rounded away. Measured, it closes exactly and there is no residual:

| Transition class | Count |
|---|---|
| `backlog/<id>/brief.md` → `done/<id>/brief.md` | 132 |
| flat `backlog/<slug>.md` → `done/<id>/brief.md` | 1 |
| born-closed: `A` under `done/<id>/brief.md` | 16 |
| migration reshape `done/<slug>.md` → `done/<id>/brief.md` | 79 |
| **total** | **228** = done folders at HEAD |

The plan's § *3* table read 133 and 18 for the first and third rows; measured they are 132 (+1 flat)
and 16. The counter's own invariant confirms it independently at **two** revisions: created − closed
equals the open row count exactly, 351 − 222 = 129 at `a9c2709` and 375 − 242 = 133 at HEAD, and
closed equals done + cancelled folders at both (222 = 210 + 12; 242 = 228 + 14).

### Decision log — calls made unattended under the standing approval

Recorded per the ship-loop audit obligation. Each entry names the finding it answers, what changed,
and why it qualified.

**D1 — the verb set is NINE, not eight; the baseline is 46/43, not the brief's 45/42.**
*Answers:* the plan's § *0.4*, which flagged that two different eight-verb sets each reproduce 45 and
mandated settling it by reading the rows rather than matching the count.
*What changed:* both `gloss` and `reconcile` are pinned, giving 46 at the anchor revision.
*Why it qualified:* this is the plan's § *4* method executed as written — "pinned by walking all 129
rows and reading each title, not by curve-fitting to 45". Read at the anchor: row `0279` glosses an
undefined term inside a format document, and row `0317` reconciles a stale vault flag with a landed
close. Both subjects are the project's own written record, so both verbs are in. Admitting exactly
one to reach 45 is the curve-fitting the plan forbids by name, and the brief pre-rules the outcome:
*"If it matches neither, that is a finding to report, not a number to adjust."*
⚠️ **This changes figures quoted in ruling W4** and is surfaced to the owner rather than settled here.
It does not change W4's *conclusion* — the sprint misses its 10% target by a wider margin, not a
narrower one. Reversing it is a one-line edit to the pinned list.

**D2 — the `/fkit-status` draft ships with `bash` corrected to `node`, everything else verbatim.**
*Answers:* the plan's § *7* draft, which instructs `bash .claude/skills/fkit-status/throughput.mjs`.
*What changed:* one word. The clause structure, the surviving ban, the sourcing requirement and the
wording are the plan's, unaltered.
*Why it qualified:* obvious winner. Measured — `bash` on a `.mjs` file exits **2** with
`const: command not found`, so the draft as literally written prints a command that cannot run. The
plan's own stated *reason* for naming an interpreter (the installer chmods a hardcoded list of two
filenames, and this file is not on it) is satisfied identically by `node`. Ruling W6's substance —
"the teeth survive", no rewrite that merely deletes the ban — is fully honoured.

**D3 — fixed a silent no-output bug in the script's direct-invocation guard.**
*Answers:* found by running the command, not by review. The first mutation probe produced **zero
bytes and exit 0**.
*What changed:* the guard now compares `import.meta.url` against
`pathToFileURL(realpathSync(process.argv[1])).href` instead of a hand-built `file://` string.
*Why it qualified:* mechanical, localized, inside the plan's own deliverable. The naive form fails on
any symlinked path — on macOS `/tmp` is a symlink, so a copy run from there printed nothing and
exited successfully — and on any path containing a space. A status run quoting a silently empty
counter is the worst available failure mode.

**D4 — corrected the plan's "false spike of ~79 closes" claim, and retargeted the mutation.**
*Answers:* the plan's § *3*, which asserts that without the same-segment exclusion the migration week
reports a false spike of ~78 closes.
*What changed:* the claim is corrected in the script's header comment and in the test's inline
comment; mutation 29 targets the unit fixture rather than the week counts.
*Why it qualified:* measured false by execution. Deleting the segment guard leaves this repo's
per-week counts **byte-identical**, because the counter carries a task's identity across a rename and
every reshaped task was already closed under its flat name, so first-close-wins refuses the double
count. What actually breaks is the narrative: 100 spurious `re-closed` records and a shape-change
count of 0. The guard still earns its place as defence in depth for a shallow or grafted history
where the carry cannot fire — which is exactly the case the unit fixture pins, so that is where the
mutation points. Mutating against the week counts would have been a gate that proves nothing.

**D5 — added prove-red step `0n` alongside the single mutation the plan named.**
*What changed:* an unmutated-copy-green baseline check for the throughput suite.
*Why it qualified:* mechanical, and it is the file's own established discipline (`0i` does exactly
this for the dashboard suite). It has a specific job here: the prove-red copy has no `.git`, so the
suite's pinned-baseline and live-corpus tests skip there, and `0n` confirms the other 23 tests really
ran rather than the suite passing vacuously.

**D6 — no obvious-winner call was made on anything else.** The classification of every open row
follows the pinned rule mechanically; the three source-defect exceptions are the plan's, unchanged.

### Findings to report, not fixed here

**F1 — the rule misclassifies row `0344`, and the class is 3 rows wide.** The brief asks for five
hand spot-checks and for any the rule gets wrong. Of five checked (`0121`, `0234`, `0279`, `0317`,
`0344`), four are right and `0344` is wrong: its brief's H1 begins *"Repair the citation drift…"* but
its folder slug begins `refresh`, because the title was edited after the folder was named. Measured
across all 129 rows, slug and title disagree on 8 rows, and on **3** of them the classification would
flip — `0331`, `0344`, `0348`, all toward record-repair. Reading the H1 instead of the slug would give
**49**, not 46. The plan pins the slug, and the slug is the stabler key (a title can be edited freely;
a folder name is the task's identity), but the brief's own baseline table says *"Rows whose title's
leading verb"*. The gap is 3 rows and it is stated rather than closed.

**F2 — the counter cannot see the uncommitted closes, by design.** Ruling W5's sequence stands: the
owner commits Sprint 7's closes, then the counter is run, then `0360` reads it. Run today it reports
HEAD, which understates the sprint by ignoring the folders that have moved on disk only.

## 2026-09-07 — Process-review step, round 1 (spawned `fkit-coder`, driver `fkit-sprint-ship-loop`)

**Role:** `fkit-coder`, Process-review worker, spawned by `fkit-sprint-ship-loop`.

Applied `fkit-process-stateful-review`, steps 0–7, to this task folder's `review.md`. Ten findings,
all novel (the *Coder response* table was empty). **All ten verdicts: CORRECT** — I verified each
against the code by execution before acting, and none was disproven. Six fixed, four recorded as
accepted residuals. Owner rulings **X1–X4** were relayed by the driver from a live `AskUserQuestion`
session; **R4 and R5 were not ruled and were mine to disposition by the method.**

⭐ **The figures did not move.** The pinned baseline reads `created 351 closed 222`, `open 129`,
`repair 46` (35.7%), `repair-excluding-source-defects 43` (33.3%) — identical before and after. The
fixes made the numbers **robust**, not different. `0360`'s banner figures are unchanged.

### Decision log — round 1

**D7 — R4 fixed, not recorded (my call, unruled).** *What changed:* `readOpenRows` now lists both
eras — folders and flat `<slug>.md` stems — instead of `ls-tree -d`. *Why it qualified:* verified
myself that `--at 331f298~1` reported `open 0` / `repair-pct 0.0` at exit 0 for a board holding 11
briefs. Ruling W2 put that era in scope, so a fabricated zero there is the same silent-wrongness
class as R1 and R3, and the fix is one function. Severity **medium**, not high: it needs a deliberate
pre-migration `--at`, so it cannot fire on a default run. Measured after: `open 11`, `repair 3`,
27.3%, reconciliation `11 = 11`.

**D8 — R5 fixed, not recorded (my call, unruled).** *What changed:* the header comment's `100`
corrected to `90`, with the arithmetic that explains the difference. *Why it qualified:* reproduced
exactly — deleting the guard yields 90 `re-closed` records; 100 is the *shape-change* count, which
splits 79 `done` + 11 `cancelled` + 10 `backlog`, and only the 90 in a closed segment reach the
re-close branch. This is my own **D4** entry above being off by 10 — a measured number stated wrongly
in the file whose whole purpose is not doing that. One word, no behaviour change.

**D9 — the reconciliation invariant is now evaluated, not merely documented.** Beyond forcing
`--find-renames`, the report emits `reconciliation created-minus-closed N open M` and **throws, exit
1, printing no report** when they disagree. *Why it qualified:* the driver named it explicitly, and
it converts a whole class of external corruption — a reader's gitconfig, a future reopen (R6) — from
silent to loud. Covered by a test that deletes a brief to force the mismatch.

**D10 — no other unattended call.** R6, R7, R8 and R10 got no code change, per X2/X3.
