# Worklog — task 0182: the closed-rank immutability guard

Build unit run 2026-08-06 by a spawned `fkit-coder` worker under the `fkit-sprint-ship-loop`
declared-approval marker (plan approved by the owner via `AskUserQuestion` in the live lead session,
2026-08-06; the four rulings — approve / state-the-gap / full-file fixtures / ratify-both-readings —
are recorded in `plan.md`'s Approval record).

## What changed

- **NEW `test/closed-rank-immutability.test.js`** — the whole guard in one file, following
  `test/task-id-uniqueness.test.js`'s precedent: masking-aware Status-table parser (fail-loud on
  every malformation, naming board and row), the pure per-board comparator `findRankViolations`
  (join on folder ID within one basename; rank never a key), basename-keyed board discovery over
  `ai-agents/sprints/` + `ai-agents/sprints/done/` (backlog.md excluded by construction — unranked
  by design), two live git legs (working tree vs HEAD; HEAD vs HEAD^) with skip-with-stated-reason
  environment gates and a derived non-zero closed-row vacuous-pass assertion, the 0174 fixture
  replay, and the in-suite red proof against a throwaway tmpdir git repo. Picked up by the existing
  `node --test test/*.test.js` glob — **no `package.json` change**.
- **NEW `test/fixtures/closed-rank-0174-before.md`** — byte-exact
  `git show ba3619658e0f95116dd2134aa5d5b0953ffd76f2:ai-agents/sprints/sprint-2.md` (322,634 bytes;
  blob `218cc621d4886ef7bca717da15ee142274bc1662`, verified equal to the original by
  `git hash-object`).
- **NEW `test/fixtures/closed-rank-0174-after.md`** — byte-exact
  `git show 8540d0315547619611bd7cc8bb8ee94f7f7408fd:ai-agents/sprints/sprint-2.md` (350,035 bytes;
  blob `8555fdab378a6f6b28a921a998107a41478737e2`, verified equal). Provenance recorded in the test
  file's header, never inside the fixture bytes.
- **Touched nothing else.** No board, no skill, no `prove-red.sh`, no devDependency, no wiki, no
  commit.

## ⚠️ The prove-red gap, stated (owner ruled 2026-08-06: "State the gap")

`prove-red.sh` gains **no** mutation for this suite. None of its mutations may reach the real
`ai-agents/` boards, and a copied-tree seam has no `.git`, so this guard would *skip* in a copy, not
go red. Named-assertion mutation coverage arrives if/when tasks 0214/0215 land. Until then the red
proof for this guard lives **inside the suite**: the 0174 fixture replay (exactly the eight
historical violations, with the measured old→new ranks) and the tmp-git-repo breach test (a working
tree that re-ranks a closed row yields exactly that violation). This paragraph is to be restated in
the close report.

## Re-taken measurements (2026-08-06, at build — plan sequencing step 4)

- Header row `| Status | Priority | Task | Brief |`: exactly 1 in each of `sprint-3.md`,
  `backlog.md`, `done/sprint-1.md`, `done/sprint-2.md` — no movement.
- `done/sprint-2.md`: 189 Status-table rows, 189 closed, 0 open (the plan's re-measure already
  recorded `0185`'s closure) — no further movement.
- Row-level pipe measurements (the plan's "re-taken at build" item): `done/sprint-2.md` Status table
  has **7 rows containing escaped `\|`** and **1 row with a bare `|` inside a backtick code span**
  (the `0169` row) — both match the plan's values. Also measured: `backlog.md` 6 escaped + 1
  code-span row (excluded from the guard by construction); `sprint-3.md` 1 escaped-pipe row.
- Fixtures parse: before = 148 rows / 124 closed; after = 154 rows / 124 closed; comparator yields
  exactly `0151, 0147, 0150, 0157, 0161, 0148, 0159, 0160` with the measured ranks — no ninth.
- Live leg 1 at build time: **green** (the uncommitted Sprint-3 rollover moves boards but changes no
  closed row's rank). Live leg 2 (HEAD vs HEAD^): **green**.

## Decision log

- **Obvious-winner call (recorded per ADR-019's audit obligation): the rank grammar was widened
  beyond the plan's `^P\d+$` sketch.** Finding it answers: at build, `done/sprint-1.md`'s Priority
  cells turned out to be the board's first-era forms — bare `1`..`14`, one of them annotated
  (`8 (optional)`) — which the plan's re-measured facts table had not captured (it measured only the
  header count on that board). What changed: the parser accepts `P?<digits>` with one optional
  parenthesized annotation; comparison stays **verbatim string equality**. Why it qualified: the
  plan's own requirements — every `sprint-*.md` board watched (including `done/sprint-1.md` by
  name-shape) AND live legs green — are jointly unsatisfiable with the `^P\d+$` throw, so accepting
  the first-era forms is the only reading that keeps both, and verbatim comparison preserves the
  invariant unweakened (any movement, `1`→`2` or `P1`→`P2` or stripping the annotation, still
  flags — the fail-safe direction). `—` / empty / prose still throw. Recorded in the test file's
  header ("ONE DELIBERATE WIDENING") and covered by a dedicated unit test.
- **No other autonomous fixes or calls.** Everything else implements the approved plan as written.

### Process-review unit (2026-08-06, spawned fkit-coder under the sprint-ship-loop marker)

Round-1 findings from `review.md`, all verified firsthand, all fixes **owner-ruled** in the live
lead session 2026-08-06 (R1 "Fix before close"; R2+R3 "Fix both") — none of the three was an
autonomous obvious-winner call; each was applied under the owner's explicit per-finding ruling:

- **R1 (medium, owner-ruled fix):** finding — a table row with leading whitespace silently
  terminated the parse (that row and every later row dropped from the watch; an entirely indented
  later table read as deletion and passed green). Changed — the row loop consumes any `/^\s*\|/`
  line and THROWS on leading whitespace, naming board and row; two regression tests added
  (mid-table indented row; fully indented table). Qualified — owner-ruled.
- **R2 (low, owner-ruled fix):** finding — the masking sentinels (U+0000/U+0001) were assumed
  absent, so raw-NUL cell bytes could unmask into `\|` and compare equal to a real change.
  Changed — any table row containing U+0000/U+0001 throws before masking; regression test covers
  both characters. Qualified — owner-ruled.
- **R3 (low, owner-ruled fix):** finding — non-`-z` `git ls-tree` C-quotes non-ASCII filenames,
  which then fail both discovery filters and drop from the HEAD side silently. Changed —
  `revBoards` passes `-z` and splits on NUL; regression test commits a `sprint-é.md` and asserts it
  is watched. Qualified — owner-ruled.
- **Autonomous calls this unit: none.**

Result after fixes: suite **34/34 pass, 0 skipped** (was 30; +4 regression tests), both live legs
green; the file remains free of literal control bytes (sentinel characters appear only as `\uXXXX`
escapes). Full `npm test` left to the driver's re-verify.

## Noted (not a change): the plan's step-5 grep vs the frozen fixtures

The plan's sequencing step 5 (`grep -E '\.md:[0-9]'` over changed files must return nothing) hits
the two fixture files: they are byte-exact historical board revisions and contain 45 / 46 legacy
`.md:<n>` strings in their frozen prose. The owner's fixture ruling ("full files, byte-exact")
forbids editing them, so the grep is clean over the **authored** files (the test file and this
worklog) and necessarily non-clean over the frozen fixture bytes. Surfaced in the build report
rather than resolved silently.

## Verification

- `node --test test/closed-rank-immutability.test.js`: **30/30 pass, 0 skipped**, ~1.2s (cheap
  enough for prove-red's ~4 whole-suite re-runs, which this file rides along in unmutated — it
  ignores `FKIT_LAUNCHER` and reads the real repo, staying green there by construction).
- Full `npm test` (unit glob + prove-red hard gate): run started at build; result reported in the
  build return. The driver's Verify unit re-runs it regardless.

## Verification (VERIFY unit, 2026-08-06 — spawned fkit-coder verifier under fkit-sprint-ship-loop)

Re-run from scratch because a cosmetic edit touched the test file after the builder's full-suite run.

- **Full `npm test`, fresh: 597/597 pass, 0 fail, 0 skipped** (17 suites, ~32s). **prove-red hard
  gate PASSED** — real launcher + all unmutated copies green; each of the 14 mutations red at its
  named assertion.
- New file alone: 30/30 pass, 0 skipped (~1.1s). The 0174 replay flags **exactly**
  `0151 P123→P124, 0147 P125→P126, 0150 P126→P127, 0157 P130→P131, 0161 P131→P132, 0148 P132→P133,
  0159 P140→P141, 0160 P141→P142` — asserted via `deepEqual` on the full array, so no ninth and no
  miss. The in-suite red proof passes: a tmp-repo working tree re-ranking a closed row (P1→P5)
  yields exactly `{0001, sprint-9.md, P1→P5}` at leg 1.
- Fixtures byte-exact: `git hash-object` gives `218cc62…` (before) / `8555fda…` (after), equal to
  `ba36196:ai-agents/sprints/sprint-2.md` / `8540d03:ai-agents/sprints/sprint-2.md`; sizes
  322,634 / 350,035 bytes as recorded.
- `package.json` and `test/prove-red.sh`: **byte-untouched** (empty `git diff HEAD`, clean status).
- Vacuous-pass assertions on both live legs are **derived** (`closedRows > 0` computed from the
  parsed earlier revision); only the frozen-fixture row counts (148/154/124) are hardcoded, which
  the test comments justify (frozen bytes cannot move).
- Skip paths demonstrated firsthand: a scratch copy of the suite run **outside** the repo (in the
  session scratchpad, repo untouched) reports both live legs as
  `﹣ … # not inside a git work tree — …` — skipped with the stated reason, never a silent pass;
  the single-commit tmp-repo test covers the leg-2-only (`HEAD^` absent) skip.
- `grep -E '\.md:[0-9]'` over the AUTHORED files (test file, worklog, plan): **zero matches**. The
  frozen fixtures contain 45 (before) / 46 (after) historical `.md:<n>` strings — frozen bytes the
  owner's full-file ruling forbids editing; a count, not a failure.
- **Builder's recorded obvious-winner call (rank-grammar widening) verified:** `done/sprint-1.md`'s
  Priority cells confirmed on disk as first-era bare `1`–`14` with one `8 (optional)`; the dedicated
  unit test ("first-era rank forms are accepted") exists and passes; live leg 1 parses that board
  green (a `^P\d+$` throw would have crashed it). Frozen-cell mutation proven flagging via two
  scratch-copy experiments (appended only to the scratchpad copy, repo file untouched): a closed
  first-era `4`→`5` re-rank flags, and stripping the annotation `8 (optional)`→`8` flags — verbatim
  comparison holds, the fail-safe direction. The call stays within the approved plan's intent.
- prove-red gap: restated per the owner's ruling — `prove-red.sh` gains no mutation for this suite;
  red evidence lives in-suite (0174 replay + tmp-repo breach test) until 0214/0215 land.

**Re-verification (post-review fixes R1–R3) — 2026-08-06, sprint-ship-loop RE-VERIFY unit.**
Fresh full `npm test`: **601/601 pass, 0 fail, 0 skipped** (17 suites, unit leg ~29s); prove-red
**hard gate PASSED** — baselines 0a–0i green, all 14 mutations red at their named assertions; total
wall time 2m35s (exit 0). Standalone `node --test test/closed-rank-immutability.test.js`: **34/34**
(~19s). The four review-regression tests exist and pass by name (2×R1 leading-whitespace fail-loud,
1×R2 NUL-sentinel assert, 1×R3 `ls-tree -z` non-ASCII filename): 4/4 via `--test-name-pattern`.
Test file is plain UTF-8 text — zero literal C0 control characters (`grep -cP` count 0).
`git diff HEAD -- package.json test/prove-red.sh`: both empty, status clean.
`grep -E '\.md:[0-9]'` over the test file and this worklog: zero matches. No source written.
