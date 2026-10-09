# Worklog — `0477` Find why prove-red step 0a sometimes goes red, and make it deterministic

## 2026-10-04 — Build (spawned `fkit-coder`, Build worker of `fkit-sprint-ship-loop`)

> **Who wrote this.** A spawned `fkit-coder`, driven by `fkit-lead`'s `fkit-sprint-ship-loop`, under
> its declared-approval marker: the owner approved `plan.md` (blob `7506627`) via `AskUserQuestion` in
> the lead session on 2026-10-04, with rulings OQ1 = fix the three tests, OQ2 = keep the single-read
> checks strict (residual R-a), OQ3 = reproduce only in a scratch copy, OQ4 = no new permanent
> prove-red mutations, one-off reverted proof only. This worker has no owner channel (ADR-021).
> `plan.md` was not edited. No task status was changed. Nothing was committed.

**What was built (plan Steps 1, 3, 4).** Five files, nothing under `claude/` or `bin/`:

- `test/prove-red.sh` — Step 1. A `step <label>` call is the first statement of each of the 55 step
  blocks (labels `0a`…`0o`, `1`…`40`). `step` keeps the previous step's output if it failed, resets
  `fail=0`, and points `$out` at the new step's own file. Kept output goes to a
  `fkit-prove-red-kept.XXXXXX` dir under `$TMPDIR`, created on the first failure only. All 14
  `run_*()` functions refuse to overwrite an existing `$out` and echo `reused` (1b). The `EXIT` trap is
  now `on_exit`, which keeps the running step's output as `<label>-aborted.txt` on a non-zero exit
  (1d). `step end` finishes step 40; the verdict reads `any_fail`; the `✗` line names the failed steps
  and the kept dir. Header gains "HOW TO READ A RED" (1e).
  - Audit: 55 `step` calls, 55 step headers, 55 `run_*suite "` calls, exactly one run call and one
    `step` per block (the last block also holds `step end`); the 183 original `fail=1` sites are
    unchanged and none sits before `step 0a`. `sh -n` and `dash -n` clean.
- `test/harness.mjs` — Step 3a. `liveTaskFolders(root)`: sorted `board/name` of every `NNNN-`
  directory with a stat-able `brief.md` (the reader's `listTaskDirs` rule).
- `test/board-reader.test.js` — 3b: A brackets the snapshot with two listings (dropped / invented /
  duplicate-id checks; exact equality with no writer). 3d: E crawls a private `git init`ed copy of
  `ai-agents/` under `os.tmpdir()` and asserts an EMPTY `git status --porcelain --untracked-files=all`.
  Header and E2 notes updated. The test NAMES are unchanged (0411's review and this plan cite them).
- `test/board-root.test.js` — 3c: R1 brackets `--bench`'s count, `|before ∩ after| ≤ N ≤ |before ∪
  after|`; its local `isTask` is replaced by the helper.
- `CONTRIBUTING.md` — Step 4, one line under the test commands.
- Brief item 4 (`.claude/` refresh): **n/a** — nothing under `claude/` changed.

### Step 2 — reproduction, before the fix (all in a scratch copy, OQ3)

- Scratch copy: `cp -R` of the working tree including `.git`, taken after Step 1 was in place and
  before Step 3 (`repo-before`). The real `ai-agents/` was never written by any helper.
- **No-writer control** in the copy: `node --test test/*.test.js` → **1017 / 1017 pass**.
- **Static states re-confirmed** (helper `static` mode, one unit run each, cleaned after each):

  | State | Result |
  |---|---|
  | S6 brief + row (finished filing) | **green** 1017/0 — so the probe brief/row are well-formed |
  | S7done (finished move) | **green** 1017/0 |
  | S2 row, no folder | red 1016/1: `L2 live corpus: BROKEN is 0` |
  | S3 lone folder, no `brief.md` | red 1016/1: board-reader **A** |
  | S7 folder in `done/`, board not updated | red 1016/1: `L2 live corpus: BROKEN is 0` |

- **A finding the plan did not have: the race is phase-locked to the writer.** With writer and test
  run started at the same instant, the run was green every time — 1 full prove-red (`before1`, 0a and
  0b green, exit 0 in 705 s) and 3 plain unit runs (`u1`–`u3`, all 1017/0). The suite's schedule is
  nearly the same on every run, so a writer started with it lands its writes at the same offsets
  every time. Starting the run 1–3 s AFTER the writer (a real agent's writes have no relation to
  when a test starts):

  | Run | Writer | Offset | Result |
  |---|---|---|---|
  | u4 | filing loop | 1 s | green 1017/0 |
  | u5 | filing loop | 2 s | **red 1016/1 — R1** |
  | u6 | filing loop | 3 s | **red 1016/1 — R1** |
  | m1 | mover | 1 s | green 1017/0 |
  | m3 | mover | 3 s | red 1016/1 — **L2** (the S7 state; single-read, residual R-a) |

- **The before-fix prove-red run (`before2`, filing writer, 3 s offset): 0a RED, R1 only.** Relevant
  lines, verbatim except the temp prefix shown as `$TMPDIR`:

  ```text
  0a. baseline — real launcher should be green ... red
     ✗ baseline is not green; fix the suite before trusting the gate.
     ↳ kept this step's output: $TMPDIR/fkit-prove-red-kept.AvYaGx/0a.txt
  0b. unmutated full copy should be green (rules out red-via-setup-failure) ... green
  …
  ✗ hard gate FAILED — see above. Failed step(s): 0a
     each failed step's own suite output is kept in: $TMPDIR/fkit-prove-red-kept.AvYaGx
  prove-red exit=1 after 732s
  ```

  From the kept `0a.txt`: `ℹ tests 1017` / `ℹ pass 1016` / `ℹ fail 1`;
  `✖ R1: with no --root the root resolves exactly as before, and no --root line is printed`;
  `AssertionError [ERR_ASSERTION]: no flag reads fkit's own tree, every task folder of it` —
  `expected: /^corpus: 483 tasks, /m`, while `--bench` printed `corpus: 484 tasks` (a probe filed
  between R1's count and `--bench`). The kept dir held only `0a.txt`; every mutation step after it
  still passed, which also shows the per-step reset working on a real red.
- **Gate (plan Step 2): passed, no stop.** The only failing test under the filing writer was R1, a
  "two reads at different moments" test on the plan's list. **A and E did not go red in any of my
  runs** (10 before-fix runs with a writer: `before1`, `before2`, `u1`–`u6`, `m1`, `m3`). Their exposure rests on plan F1's runs and on the same two-read
  shape; I did not reproduce it. The mover's L2 red is the plan's known S7 class (F2), ruled strict by
  the owner (OQ2), not a new exposure.
- **Two-read grep** of the other live-tree tests (count-then-run, before/after): no other instance.
  The `before`/`after` pairs found are all on `os.tmpdir()` fixtures, or (board-narrow F) on
  `claude/skills/fkit-status/dashboard.sh`, which no `ai-agents/` writer touches. The live-corpus
  guards (reference-integrity, coordination-citation-policy, task-id-uniqueness,
  adr-number-uniqueness) each scan once at module load — single-read, R-a.

### Step 3f — the new assertions can still fail (scratch copy `repo-after`, every mutant reverted)

- **Reader drops one task** (`listTaskDirs` skips `0101-`): `board-reader` + `board-root` → 23 pass /
  **2 fail: A** (`every task folder present throughout the snapshot is rendered` — actual
  `['done/0101-assert-task-ids-are-unique-in-the-test-suite']`) and **R1** (`bench counted 481,
  expected 482..482`).
- **Server writes one file under its root** (`startServer` writes `ai-agents/e-probe.txt`):
  `board-reader` → 14 pass / **2 fail: E** (`the reader changed ai-agents/ …`, porcelain
  ` M ai-agents/e-probe.txt`) and E2 (the static guard, as expected — the mutant imports
  `writeFileSync`).
  - ⚠️ My first try wrote a constant `'x'` and **E stayed green**: test D's server (on the copy's
    real tree) wrote the file first, E's private copy then contained it, and rewriting identical bytes
    is invisible to git. E sees any write that CHANGES bytes, not a same-byte rewrite. The old E had
    the same limit. The mutant was redone with unique content.
- **No writer:** full unit suite in `repo-after` → **1017 / 1017 pass** (A 0.76 s, E 3.05 s, R1
  3.25 s).
- Every mutant was reverted with a byte copy of the original; `git status` of `bin/` in the copy was
  empty afterwards. No prove-red mutation was added (OQ4).

### Informal after-fix exposure (NOT the Verify step's five prove-red runs)

- `repo-after`, filing writer, offsets 2 s and 3 s (the offsets that reddened R1 before the fix):
  **both 1017 / 1017 green.**
- `repo-after`, mover, 3 s offset: 1016 / 1 — **L2**, the single-read S7 state. This is residual
  R-a, expected and owner-ruled, and it will recur in any run with a mover writer.

### Smoke check on the real tree (after the build)

- `npm test` on the real working tree, once: unit suites **1017 / 1017 pass, 0 fail**; prove-red
  `0a … green`, `0b … green`, final line `✓ hard gate PASSED — real + unmutated copy green; each
  mutation reds its NAMED assertion.`; exit 0. No kept dir was created by this green run.
- This is a smoke check only. The plan's Verification section (kept-output checks, the five
  after-fix prove-red runs with a writer, the diff check) is the separate Verify step.

### Residuals (plan §Risks, restated)

- **R-a** Single-read live-corpus checks (L2, task-id-uniqueness, board-narrow D/D2/F) stay strict:
  a close in progress (S7) or a row before its folder (S2) is still a true red. Seen again in `m3`
  and `am3`.
- **R-b** A or E could still catch a microsecond partial write. Not seen.
  - A's `no task id is rendered twice` check can also red if a folder is moved between the reader's
    `backlog/` and `done/` directory reads (microseconds). The plan asked for this check. Not seen.
- **R-c** Reader read-gap in `bin/fkit-board.mjs` (`listTaskDirs` stats, `readTask` reads later):
  out of scope, not seen.
- **R-d** Run time: E now takes about 2.3–3 s (it copies and commits ~1,400 files). A full prove-red
  took 705–732 s in the copy.
- **R-e** The 2026-10-02 incident's failing test is still unproven (its output was lost).
- **New: phase-locking.** A writer started together with the run hides the race. The Verify step's
  five prove-red runs should start prove-red a few seconds after the writer (`race-prove-red.sh`
  takes the offset as its 4th argument), or they can show green for the wrong reason.

### Decision log (autonomous calls, with which finding/step each answers and why it qualified)

1. **E's fixture copy retries `cpSync` on `ENOENT`, at most 3 tries** (Step 3d). A folder moved by
   another agent mid-copy makes `cpSync` throw. That is a race in BUILDING the fixture, not in the
   check. Qualified as an obvious winner inside the plan's intent ("E uses a private copy", so E is
   not exposed to outside writes). It does not retry the assertion, so OQ2's "no wait-and-retry"
   (which is about the single-read checks) is untouched.
2. **E asserts the private copy starts clean** (`sanity:` line before the crawl). Mechanical: it makes
   "empty afterwards" mean something. In-plan.
3. **E's porcelain uses `--untracked-files=all`.** Mechanical: without it a new file inside a new
   directory folds into one `??` line. Still empty when nothing is written. In-plan ("sees any write
   under the root").
4. **Kept-dir path strips a trailing `/` from `$TMPDIR`** (macOS sets one). Cosmetic, mechanical.
5. **A step that failed before its suite ran prints "there is no suite output to keep"** instead of
   keeping nothing silently. Mechanical, inside Step 1a's intent.
6. **Test names of A, E and R1 unchanged**, and the unused `readdirSync` / `statSync` imports removed
   from the two test files my change left them unused in. Mechanical.
7. **The reproduction used a phase offset (1–3 s) between writer and run.** Not in the plan's text.
   Without it the race could not show (see the phase-locking finding). It changes only how the
   scratch helper is started, not any committed file. Obvious winner within the plan's intent
   ("reproduce on purpose").

No other autonomous call was made. No fix outside the approved plan was applied.

### Appendix A — the reproduction helper, full text (`race-writer.sh`, not committed)

```sh
#!/bin/sh
# race-writer.sh — task 0477's reproduction helper. NOT committed; its full text is in the worklog.
# Models agents writing into ai-agents/ while a test run reads it. Writes ONLY under the scratch copy
# named as $1, and refuses any root that is not under a scratchpad / tmp dir.
#
#   race-writer.sh <copy-root> file   <seconds> <first-id>   filing loop: brief (folder+file in one
#                                                            step), then ~2 s later a non-atomic
#                                                            rewrite of backlog.md adding its row;
#                                                            one brief every ~4 s
#   race-writer.sh <copy-root> move   <seconds> <first-id>   mover loop: file a probe (brief + row),
#                                                            settle 3 s, `mv` it to done/, then ~5 s
#                                                            later update the brief status + board link
#   race-writer.sh <copy-root> static S2|S3|S6|S7|S7done <id> freeze one intermediate state and exit
#   race-writer.sh <copy-root> cleanup                       remove every probe, restore backlog.md
set -eu
root="$1"; mode="$2"
case "$root" in
  */scratchpad/*|/tmp/*|/private/tmp/*) ;;
  *) echo "race-writer: refusing $root — not a scratch copy" >&2; exit 2 ;;
esac
[ -d "$root/.git" ] && [ -d "$root/ai-agents/tasks/backlog" ] || { echo "race-writer: $root is not a repo copy" >&2; exit 2; }
tasks="$root/ai-agents/tasks"
board="$root/ai-agents/sprints/backlog.md"
stage="$root/.race-stage"
mkdir -p "$stage"
[ -f "$stage/backlog.md.orig" ] || cp "$board" "$stage/backlog.md.orig"

name() { echo "$1-race-probe"; }

brief_text() {   # <id> <status>
  printf '# Race probe %s\n\n## ID\n%s\n\n## Sprint\nBacklog\n\n## Priority\n—\n\n## Status\n%s\n\n## Owner\nfkit-coder\n\n## Goal\nA throwaway probe for task 0477. Lives only in a scratch copy.\n' "$1" "$1" "$2"
}

write_brief() {   # <id> — the folder AND brief.md appear in ONE step (rename from a staging dir)
  d="$stage/$(name "$1")"
  mkdir -p "$d"
  brief_text "$1" '🔲 Backlog' > "$d/brief.md"
  mv "$d" "$tasks/backlog/"
}

# Rewrite backlog.md NON-atomically (compute, then truncate-and-write in place), the way an editor or a
# plain `>` redirect does. <awk-program-args...> are passed to awk over (board, board).
rewrite_board() {
  awk "$@" "$board" "$board" > "$stage/board.new"
  cat "$stage/board.new" > "$board"
}

add_row() {   # <id> — append the probe's row after the Status table's last row
  row="| 🔲 Backlog | — | Race probe $1 | [\`$(name "$1")\`](../tasks/backlog/$(name "$1")/brief.md) |"
  rewrite_board -v row="$row" '
    NR == FNR { if (/^## Addendum/) stop = 1; if (!stop && /^\|/) last = FNR; next }
    { print } FNR == last { print row }'
}

finish_move() {   # <id> — what the mover does AFTER the folder move: brief status, then board row
  b="$tasks/done/$(name "$1")/brief.md"
  brief_text "$1" '✅ Done (agent-closed — not owner-verified)' > "$stage/brief.new"
  cat "$stage/brief.new" > "$b"
  rewrite_board -v id="$1" '
    NR == FNR { next }
    index($0, "](../tasks/backlog/" id "-race-probe/brief.md)") {
      sub(/^\| 🔲 Backlog \|/, "| ✅ Done (agent-closed — not owner-verified) |")
      sub("../tasks/backlog/" id "-race-probe/", "../tasks/done/" id "-race-probe/")
    }
    { print }'
}

now() { date +%s; }

case "$mode" in
  file)
    secs="$3"; id="$4"; end=$(( $(now) + secs ))
    while [ "$(now)" -lt "$end" ]; do
      write_brief "$id"; echo "$(date +%T) filed brief $id"
      sleep 2
      add_row "$id"; echo "$(date +%T) added row $id"
      sleep 2
      id=$(( id + 1 ))
    done ;;
  move)
    secs="$3"; id="$4"; end=$(( $(now) + secs ))
    while [ "$(now)" -lt "$end" ]; do
      write_brief "$id"; add_row "$id"
      sleep 3
      mv "$tasks/backlog/$(name "$id")" "$tasks/done/"; echo "$(date +%T) moved $id to done/"
      sleep 5
      finish_move "$id"; echo "$(date +%T) board + brief updated for $id"
      sleep 1
      id=$(( id + 1 ))
    done ;;
  static)
    state="$3"; id="$4"
    case "$state" in
      S2) add_row "$id" ;;                                         # row, no folder
      S3) mkdir "$tasks/backlog/$(name "$id")" ;;                  # lone folder, no brief.md
      S6) write_brief "$id"; add_row "$id" ;;                      # finished filing
      S7) write_brief "$id"; add_row "$id"; mv "$tasks/backlog/$(name "$id")" "$tasks/done/" ;;  # mid-move
      S7done) write_brief "$id"; add_row "$id"; mv "$tasks/backlog/$(name "$id")" "$tasks/done/"; finish_move "$id" ;;
      *) echo "race-writer: unknown state $state" >&2; exit 2 ;;
    esac
    echo "froze $state with id $id" ;;
  cleanup)
    for d in "$tasks"/backlog/[0-9][0-9][0-9][0-9]-race-probe "$tasks"/done/[0-9][0-9][0-9][0-9]-race-probe; do
      [ -e "$d" ] && rm -rf "$d"
    done
    cat "$stage/backlog.md.orig" > "$board"
    rm -rf "$stage"
    echo "cleaned" ;;
  *) echo "race-writer: unknown mode $mode" >&2; exit 2 ;;
esac
```

### Appendix B — the three run wrappers, full text (not committed; scratch path shown as `$SCRATCH`)

`race-unit.sh`:

```sh
#!/bin/sh
# One plain unit run (`node --test test/*.test.js`, the first half of `npm test`) in a scratch copy with a
# writer running alongside; prints pass/fail and the failing test names; cleans the probes up after.
SP=$SCRATCH
R="$1"; mode="$2"; tag="$3"; first="$4"
"$SP/race-writer.sh" "$R" "$mode" 75 "$first" > "$SP/writer-$tag.log" 2>&1 &
wpid=$!
sleep "${5:-0}"   # phase offset: start the run this many seconds AFTER the writer
( cd "$R" && node --test test/*.test.js > "$SP/unit-$tag.txt" 2>&1 )
wait $wpid
"$SP/race-writer.sh" "$R" cleanup >> "$SP/writer-$tag.log" 2>&1
printf '%s [%s]: %s %s | failing: ' "$tag" "$mode" "$(grep '^ℹ pass' "$SP/unit-$tag.txt")" "$(grep '^ℹ fail' "$SP/unit-$tag.txt")"
awk '/^✖ failing tests:/{f=1;next} f && /^test at /{getline; print}' "$SP/unit-$tag.txt" | sed 's/ ([0-9.]*ms)$//' | sort -u | tr '\n' ';'
echo
echo "  git status after cleanup: $(git -C "$R" status --porcelain -- ai-agents/ | md5)"
```

`race-prove-red.sh`:

```sh
#!/bin/sh
# Run the copy's prove-red with the filing-loop writer alongside 0a (+0b), then clean the probes up.
SP=$SCRATCH
R="$1"; tag="$2"; first="$3"
"$SP/race-writer.sh" "$R" file 150 "$first" > "$SP/writer-$tag.log" 2>&1 &
wpid=$!
sleep "${4:-0}"   # phase offset: start prove-red this many seconds AFTER the writer
start=$(date +%s)
sh "$R/test/prove-red.sh" > "$SP/prove-red-$tag.txt" 2>&1
echo "prove-red exit=$? after $(( $(date +%s) - start ))s" >> "$SP/prove-red-$tag.txt"
wait $wpid
"$SP/race-writer.sh" "$R" cleanup >> "$SP/writer-$tag.log" 2>&1
git -C "$R" status --porcelain -- ai-agents/ | md5 >> "$SP/writer-$tag.log"
```

`static-run.sh`:

```sh
#!/bin/sh
# Freeze each state in the scratch copy, run the unit suite once, record pass/fail and failing test names.
SP=$SCRATCH
R="$1"; shift
cd "$R" || exit 1
for st in "$@"; do
  "$SP/race-writer.sh" "$R" static "$st" 9901 >/dev/null
  node --test test/*.test.js > "$SP/static-$st.txt" 2>&1
  printf '%s: %s %s | failing: ' "$st" "$(grep '^ℹ pass' "$SP/static-$st.txt")" "$(grep '^ℹ fail' "$SP/static-$st.txt")"
  grep -E '^✖ ' "$SP/static-$st.txt" | sed -n '/failing tests:/,$p' >/dev/null
  awk '/^✖ failing tests:/{f=1;next} f && /^test at /{getline; print}' "$SP/static-$st.txt" | sed 's/ ([0-9.]*ms)$//' | sort -u | tr '\n' ';'
  echo
  "$SP/race-writer.sh" "$R" cleanup >/dev/null
  git -C "$R" status --porcelain -- ai-agents/ | md5
done
```

## 2026-10-04 — Verify (spawned `fkit-coder`, Verify step of `fkit-sprint-ship-loop`)

> **Who wrote this.** A spawned `fkit-coder`, VERIFY ONLY: no source, test or doc was written; this
> section is the only repo write. Every deliberate breakage ran in a fresh `cp -R` (incl. `.git`) of the
> current working tree under the session scratchpad (`$SCRATCH/verify/repo-v`, byte-identical to the
> real tree at copy time — `diff -rq --exclude=.git` empty). Temp paths shown as `$TMPDIR`. Nothing committed.

**Plan Verification 1 (before-fix red):** recorded above by Build (`before2`: 0a red at R1, kept
`0a.txt` path and lines quoted). Not redone.

### Verification 2 — output kept on red (scratch copy; its `test/prove-red.sh` restored by byte copy after each variant, `cmp` clean)

| Variant | Edit (copy only) | Result |
|---|---|---|
| 2a | mutation 5's `grep -Eq` pattern gets ` BROKEN-0477` appended | exit 1 (679 s). `Failed step(s): 5`. Kept dir held **only `5.txt`** — the marker-hook suite (`ℹ tests 7`, `ℹ fail 1`, `✖ a non-AskUserQuestion tool → writes NO marker`). **No `0a.txt`** (0a, 0b green). |
| 2b | mutations 5 **and** 27 broken the same way | exit 1 (658 s). `Failed step(s): 5 27`. Kept dir held `5.txt` (marker-hook suite, 7 tests, 0 R5 lines) and `27.txt` (wiki-flag suite, `ℹ tests 10`, `✖ all three: the R5 clause …`, 0 marker-hook lines) — each its own suite's output: per-step reset works. |
| 2c | bare `false` inserted mid-step 1 (after its suite ran) | `set -e` abort, exit 1 (177 s). `↳ kept this step's output: …/1-aborted.txt` — the hook suite (`ℹ tests 260`, `✖ reviewer owns fkit-review -> allow`). |

- Each red run created exactly one new `fkit-prove-red-kept.*` dir and left **no** new `$TMPDIR/tmp.*`
  (`$work`) dir (listing diff before/after empty).
- **Green-run check:** across the 5 green prove-red runs below the `fkit-prove-red-kept.*` count stayed
  4→4 every time, and the `tmp.*` listing after all of Verification 3 had **0** new entries vs. its
  start (v3p1's `$work` dir was confirmed gone). Same for the real-tree `npm test` (Verification 4):
  kept dirs unchanged, 0 new `tmp.*`.

### Verification 3 — after the fix, filing-loop writer (`race-prove-red.sh` / `race-unit.sh`, Appendix B), run started N s AFTER the writer, one at a time

| Run | Kind | Offset | Result |
|---|---|---|---|
| v3p1 | full prove-red | 3 s | 0a green, 0b green, `✓ hard gate PASSED`, exit 0 (655 s) |
| v3p2 | full prove-red | 2 s | 0a green, 0b green, PASSED, exit 0 (656 s) |
| v3p3 | full prove-red | 1 s | 0a green, 0b green, PASSED, exit 0 (653 s) |
| v3p4 | full prove-red | 3 s | 0a green, 0b green, PASSED, exit 0 (653 s) |
| v3p5 | full prove-red | 2 s | 0a green, 0b green, PASSED, exit 0 (654 s) |
| v3u1 | `node --test test/*.test.js` | 2 s | 1017 / 0 |
| v3u2 | unit | 3 s | 1017 / 0 |
| v3u3 | unit | 1 s | 1017 / 0 |
| v3u4 | unit | 2 s | 1017 / 0 |
| v3u5 | unit | 3 s | 1017 / 0 |

- **10 / 10 green.** Writer filed 37 briefs per prove-red run (150 s) and 18–19 per unit run (75 s).
- After every run the writer's cleanup restored the copy: `git status --porcelain -- ai-agents/` md5
  equal to the baseline taken before the first run.
- ⚠️ **Evidence, not proof.** Before the fix the same harness went red in 3 of 5 filing-loop runs at
  1–3 s offsets (`u5`, `u6`, `before2`; `u4` at 1 s was green). 10 green after-fix runs make a
  surviving race on A/E/R1 unlikely, not impossible. Only the filing writer was used; the mover writer
  still reds L2 (residual R-a, owner-ruled strict) and was not re-run.

### Verification 4 — quiet tree, real working tree

- `npm test`: exit 0 in 894 s. Unit suites **`ℹ tests 1017` / `ℹ pass 1017` / `ℹ fail 0`** (same count
  as before, no tests added). prove-red `0a … green`, `0b … green`, final line
  `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`
- `git status --porcelain` md5 identical before and after the run: the run wrote nothing in the tree.

### Verification 5 — no stray changes (real tree, `git diff --stat` + `git status --porcelain`)

- **This task's changes:** `CONTRIBUTING.md` (+2), `test/board-reader.test.js` (147 lines),
  `test/board-root.test.js` (35), `test/harness.mjs` (30), `test/prove-red.sh` (149) — exactly the 5 Scope
  files — plus untracked `plan.md` and `worklog.md` in this task folder. Nothing under `claude/` or `bin/`.
- **Pre-existing, not this task's** (producer bookkeeping earlier this session): `ai-agents/sprints/backlog.md`,
  untracked `ai-agents/sprints/sprint-10.md`, and the `brief.md` of 0172, 0394, 0395, 0396, 0472, 0473,
  0474, 0475, 0476, 0477 (Sprint/Priority/Status pull-in lines only), 0479, 0480, 0481, 0482.
- **Machine-path grep:** the diff's added lines match none of `/Users/`, `/home/`, `/private/`,
  `/var/folders` (grep exit 1). In the untracked `plan.md`/`worklog.md` the only hit is the
  race-writer's safety glob `*/scratchpad/*|/tmp/*|/private/tmp/*` (Appendix A) — a generic guard
  pattern, not a machine-specific path.

**Verify verdict: pass.** No fix was applied and no autonomous call was made in this step (decision log: none).

## 2026-10-04 — Process review, round 1 (spawned `fkit-coder`, Process-review worker of `fkit-sprint-ship-loop`)

> **Who wrote this.** A spawned `fkit-coder` under the loop's declared-approval marker (owner approved
> `plan.md`, blob `7506627`, via `AskUserQuestion` in the lead session, 2026-10-04). It ran
> `fkit-process-stateful-review`'s method on `review.md` with no per-fix owner gate (standing approval).
> No owner channel here (ADR-021). Nothing committed; no task status changed; `plan.md` not edited.

- **R1 (temp-dir leak in E's `privateCopy()`): CORRECT, defect, low — fixed.** No accepted residual or
  ADR covered it (checked R-a, the no-new-mutations residual, ADR-014, ADR-026, ADR-045).
- **Proof of the fix** (scratch copy of `test/ bin/ claude/ ai-agents/ package.json`; git env
  `core.hooksPath` pointed at a `pre-commit` that exits 1; `TMPDIR` pointed at an empty scratch dir; E
  only): unfixed → E fails, **1** `fkit-board-e-*` dir left; fixed → E fails, **0** left.
- **Real tree:** `node --test test/board-reader.test.js test/board-root.test.js` → 25/25, `git status
  --porcelain` md5 identical before/after. `npm test` → `ℹ tests 1017` / `ℹ pass 1017` / `ℹ fail 0`;
  prove-red `0a … green`, `0b … green`, final line `✓ hard gate PASSED — real + unmutated copy green;
  each mutation reds its NAMED assertion.`; exit 0 in 920 s. The ledger and this worklog were written
  only after that run finished, so they were not a concurrent write into the tree it read.
- **Ledger:** *Coder response* row R1 `✅ done`; *Accepted residuals* gained R-b, R-c, R-d, R-e (owner
  ruling 2026-10-04: record all four; R-c's follow-up task is the producer's to file, not this
  worker's); header `Status: closed-out`. *Reviewer findings* and `Coverage:` untouched.

### Decision log (this step)

1. **Answers R1.** Changed: `test/board-reader.test.js` `privateCopy()` — the three
   `execFileSync('git', …)` calls now sit in `try { … } catch (e) { rmSync(dir, …); throw e; }`, plus a
   two-line comment naming review R1. Why it qualified: verified `CORRECT` at the cited code;
   mechanical and localized (one function, the same cleanup shape as the `cpSync` loop just above it,
   no change to what E asserts); inside the approved plan (plan.md § Steps, "3d. E — a private copy" —
   "Remove the copy"). No obvious-winner call was made; no other fix was applied.
