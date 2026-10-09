# Worklog — 0492: Flag a sprint task that hard-depends on an open later-sprint task

Build worker: spawned `fkit-coder`, caller `fkit-sprint-ship-loop` (Sprint 10), 2026-10-08. Approved
plan carried verbatim with its blob pointer (`git hash-object` of `plan.md` re-checked equal at start:
`342a8a79…`). Owner approval as relayed by the driver, all `AskUserQuestion` in the `fkit-lead`
session: "Approve (Recommended)" (2026-10-07); Q1 "Planner's rule (Recommended)"; Q2 "Flag them all
(Recommended)"; Q3 "No new flag (Recommended)"; Q4 "Allow it (Recommended)" (second call, session date
rolled to 2026-10-08). `plan.md` not touched. No commit, no push, no wiki-vault write.

**`claude/fkit-claude-init.sh .` was NOT run** — on the driver's instruction; the driver refreshes
`.claude/` once both parallel builds (0492, 0495) land. The installed `.claude/` copy of
`fkit-status/` therefore does not yet carry this change.

## Step 0 — snapshot
- Scratchpad folder `0492-snap/` (new): the 3 target files plus `SHA256SUMS`. All 3 were clean
  against `HEAD` at build start (`git diff --quiet HEAD` on the 3 paths).
- The diff for review is `diff -u <snapshot> <current>` on these 3 files, not `git diff` (the worktree
  carries other tasks' edits).

## Change surface (3 files)
- `claude/skills/fkit-status/dashboard.sh`:
  - header CONTRACT block: the second widened read (Q4), with the owner's ruling quoted and dated;
  - `depends_raw` gains an opt-in `tail` mode (decision 5 below); its default output is unchanged;
  - new helpers beside `folder_id_prefix`: `dep_hard_ids` (awk; reads only depends_raw's text),
    `blocker_lookup`, `later_board_status` (lazy, built once, called directly — never in `$( )`),
    `later_sprint_reason` (the plan's §2 table, verbatim order);
  - `LS_CHECK` switch (eligible `Sprint N` identity only) and a per-row collector after the Next-step
    block, before the open-work filter;
  - a post-loop block after the sprint-level drift rules, before the drift clause: direct records, the
    §4 within-board propagation, then `add_fact` + `mark_drift` per record.
- `claude/skills/fkit-status/SKILL.md`: one entry in the `⟦FACTS⟧` grammar block, after
  `depends-unparseable`. The "unknown kind → report as-is" rule is unchanged.
- `test/dashboard-contract.test.js`: a new `0492/…` block (13 tests: 12, plus `P8` after the decision-5 ruling) appended; no existing test edited.
- Not touched: `dependency-declaration-form.md` (both copies), `test/prove-red.sh`, `.claude/`, every
  0493/0494/0495 file, `plan.md`. Version marker stays `⟦fkit-dashboard v2⟧`.

## Verification
- **Prove-red** (scratch copy, snapshot's `dashboard.sh` + `SKILL.md`, new test file): 10 of 12 new
  tests red — P1–P7, `cycle`, `cycle-self`, `skill-grammar` — each with `actual: []` (no record) or the
  prose-half message; the 2 green are `negatives` and `unparseable`, which pass on the old code by
  definition and prove nothing alone.
- **Anti-vacuity mutations** (scratch copy): each negative case was checked to red under a mutation of
  the guard it relies on — table always fires → "same sprint"; lookup always open → "blocker ✅";
  check on every board → "Backlog board"; closed rows collected → "dependent row closed"; own-ID guard
  removed → "own ID"; row 7 ordering removed → "lower in-progress sprint"; row 6 ordering removed →
  "Q1 exemption"; B-waits-on-B guard removed → `cycle-self`.
- **Live smoke** (real tree, read-only): `sprint-10.md` → 0 new records; output byte-identical to the
  old script. `backlog.md` → byte-identical to the old script. A trace confirmed the check ran on 3
  live Sprint 10 rows (0474→0473, 0493→0492, 0494→0492), all same-sprint or closed blockers.
- **Full suite, first run (before decision 5)**: `npm test` in a scratch copy of the whole repo **including `.git`**, started 12:41
  (load ~7.1). Stage 1 (`node --test test/*.test.js`): **1084 tests, 1083 pass, 1 fail**, 236 s.
  Because the stages are chained with `&&`, stage 2 never started, so `prove-red.sh` was run on its own
  in the same copy afterwards: exit 1 after 2077 s (load ~4.9–7.6). **All 43 mutation steps went red as
  required**, and baselines 0c–0p are green; **0a and 0b went red from the same single failure.**
  - **The one failure is not 0492's:** `structure-check.test.js` "scaffold-verbatim project: every row
    conforming" — `expected 50 inventory rows, got 51`. 0495 added the row for
    `placement-questions-state-the-knock-on.md` to `claude/structure-spec.md` (and the manifest);
    `EXPECTED_ROWS` in that test was not raised. Attributed by re-running that test in the copy with my
    3 files put back to the snapshot: still red, identical message. Not fixed (0495's surface).
  - `dashboard-contract`, `board-reader`, `reference-integrity` and `task-id-uniqueness` all ran inside
    stage 1, green. Existing `dashboard-contract` tests passed unchanged.
  - `cmp` after the runs: the copy's 3 files are byte-equal to the real tree's.
- **Full suite, joint re-verify (after decision 5; 0495's `EXPECTED_ROWS = 51` confirmed in the real
  tree first)**: `npm test` in a fresh scratch copy
  including `.git`, 13:56:20 → 14:25:48 (about 29.5 min; load 5.5 at start, 5.3–6.0 at end). Exit 0.
  Stage 1: **1085 tests, 1085 pass, 0 fail** (148 s). Stage 2 `prove-red.sh`: **hard gate PASSED** —
  baselines 0a and 0b green, all 43 mutation steps red. No failure to attribute, in either build.
  `cmp` after the run: the copy's 3 files are byte-equal to the real tree's.

## Decision log
Fixes applied without asking / obvious-winner calls (Build worker, under the approved plan):
1. **Own-ID negative made non-vacuous** (test only). Finding: mutation "own-ID guard removed" stayed
   green, because the fixture's brief sat on Sprint 1, where the §2 table already says none. Change:
   the fixture's brief now says `Sprint 2`, so only the own-ID guard keeps it quiet. Qualified:
   verified by the mutation going red after; test-only; inside plan §5.3 ("dependency on its own ID").
2. **"B never waits on B" guard in §4 propagation + test `0492/cycle-self`.** Finding: a row whose own
   brief sits on a later sprint, in a cycle with another row, would get the record "waits on itself"
   via propagation. Change: one `continue` in the propagation loop; one test (red under mutation H).
   Qualified: obvious winner within plan §4's intent ("a dependency cycle is safe"; the own-ID skip of
   §2 applied to the indirect path); localized.
3. **A blocker folder with no readable `brief.md`** → treated as open with an empty `## Sprint`, so it
   lands on `sprint-unresolved`. Plan silent; chosen because the plan's fallback rule is "loud, never
   guesses" (§1 `sprint-unresolved`). Untested edge; localized to `blocker_lookup`.
4. **Duplicate (dependent, blocker) pairs** — e.g. one task linked by two rows — are emitted once
   (`ls_has`). Qualified: plan §1 "one record per (dependent, final blocker) pair"; mechanical.

Returned to the driver as NEEDS-DECISION, then RULED and applied:
5. **The convention's canonical soft form was read as hard.** `dependency-declaration-form.md`'s own
   example is `- **Depends on: task 0072** — soft, not hard.` (BI form); `depends_raw` cuts BI content
   at the closing `**`, so the mark never reached the soft/hard check (the plan's §3 example had
   claimed it reads soft). **Owner ruling, 2026-10-08, AskUserQuestion in the `fkit-lead` session,
   relayed by the sprint driver — selected, verbatim: "Fix it now (Recommended)"** (option text: "Give
   the line reader an opt-in mode that also returns the text after the bold, used only by the new
   soft/hard check; the board's displayed text stays byte-identical. Add a test, re-run the suite.
   Small, but it touches the shared line reader.").
   - **What changed:** `depends_raw <brief> tail` (opt-in, `-v tailmode`) emits
     `<form>␟<content>␟<tail>`; `<tail>` is the text after a BI declaration's closing bold, empty for
     every other form. The four print sites go through one `emit()`; the default call prints exactly
     what it did. `dep_hard_ids <content> [<tail>]` reads the tail for soft/hard ONLY — an ID that
     appears only in the tail is never returned, though it still ends the segment before it. The
     collector is the only caller of the tail mode. The script comment's BI known-miss bullet is gone.
   - **Proof the board text did not move:** all 12 boards under `ai-agents/sprints/` (live, `done/`,
     `cancelled/`) render byte-identical, exit codes included, under the pre-change and the new script.
     `backlog.md` is also identical to the original pre-0492 script's capture; `sprint-10.md` gained a
     row (0498) since that capture, and the original script re-run on today's board is byte-identical
     to the new one.
   - **Test `0492/P8`:** BI soft → no record; BI hard twin → record; BI soft with a different ID in the
     tail → no record (and that ID is not a dependency); a plain BI line → record; the `derive` record
     stays `depends="task 0005"` for all four. Red on the pre-change script (it flagged the two soft
     lines, 0001 and 0003); red under two mutations (tail IDs counted; tail emptied).
   - SKILL.md: no change needed — its "an ID the line marks soft is skipped" is now true for this form.
   - Qualified: owner-ruled scope, exactly option (B); stays inside the 3 files.

Review round 1 — Process-review worker (spawned `fkit-coder`, caller `fkit-sprint-ship-loop`,
2026-10-08), standing approval = the approved plan plus the round-1 owner rulings, all AskUserQuestion
in the `fkit-lead` session, 2026-10-08, selected verbatim: R1 "Whole words only (Recommended)"; R2 "Add
the missing tests (Recommended)"; R3 "Keep it; document it (Recommended)". Pre-round snapshot of the 3
files in the scratchpad folder `0492-r1snap/` (with `SHA256SUMS`). Obvious-winner calls: none — every
change below is exactly the ruled scope.
6. **R1 — soft/hard read as whole words** (answers review.md R1: `software`/`Microsoft` silently
   dropped a hard record). Changed: `dep_hard_ids` gains an awk `wpos()` (first WHOLE-word position;
   neighbours not `[a-z0-9_]`; portable to BSD awk, no `\<`/`\b`) and uses it instead of `index()`; its
   comment says so. Test `0492/P9`. Qualified: verified `CORRECT` (reproduced on the pre-fix script);
   mechanical, one function; the owner's ruled option. Red-proof: P9 red on the pre-fix script (actual
   only `0005` — the `harden` line); red under 3 mutations (revert to `index()`; drop the trailing
   boundary; drop the leading boundary). Live re-sweep (`LC_ALL=C`, as the script runs): 468
   `Depends on` lines, old vs new `dep_hard_ids`, **0 differences** (195 lines carry hard IDs).
7. **R2 — the unresolved-Nst arms and the no-brief blocker pinned** (answers review.md R2). Changed:
   tests only — `0492/unresolved-board` (rendered board's banner malformed: Mst 🔄 → `later-sprint`, the
   row-7 arm; Mst 🔲 → `not-started`, row 6) and `0492/no-brief` (folder with no `brief.md` →
   `blocker_sprint=""`, `sprint-unresolved`; closes decision 3's "Untested edge"). Qualified: verified
   `CORRECT` (the reviewer's mutation reproduced); test-only, no behaviour change; the owner's ruled
   option. Red-proof by mutation: row 7 `|unresolved` dropped → red (`[]`); row 6 treating an
   unresolved Nst as Backlog → red (`later-sprint`); `blocker_lookup` returning `none` for a folder
   with no brief → red (`[]`). Both green on the pre-fix script, as they pin existing behaviour.
8. **R3 — archived closed sprint reads `sprint-unresolved`: kept, documented** (answers review.md R3).
   Changed: one sentence in `fkit-status/SKILL.md`'s `depends-on-later-sprint` entry (the next
   sentence re-wrapped); no code change. Ledger: `won't fix (frontier)` + an Accepted-residuals entry
   quoting the ruling. Qualified: the owner's ruled option, doc only.
   - **Render proof for 6–8:** all 12 boards (`backlog.md`, `sprint-10.md`, the 10 in `done/`) render
     byte-identical, exit codes included, under the pre-round snapshot script and the new one; 0
     `depends-on-later-sprint` records on any of them.
   - `node --test test/dashboard-contract.test.js test/board-reader.test.js` on the real tree: 221/221
     (the `0492/…` block is now 16 tests).
   - **Full suite after 6–8:** `npm test` in a fresh scratch copy including `.git` (`0492-r1full/`),
     15:03:56 → 15:49:03 (about 45 min; load 6.8 at start, 4.9–7.5 at end). **Exit 1.** Stage 1:
     **1088 tests, 1088 pass, 0 fail** (308 s). Stage 2 `prove-red.sh`: **hard gate FAILED on step 0b
     only** — 0a and 0c–0p green, all 43 mutation steps red. The 0b red is one test,
     `board-root.test.js` "R3: a bad --root exits 2 …": the board CLI was killed by that test's own
     20 s `spawnSync` timeout (`status null`, empty stderr; the test took 43 s) under load. Not 0492's:
     the same test passed in stage 1 of the same copy, and re-ran green 2/2 in the copy afterwards;
     `board-root.test.js` and the board CLI are outside 0492's 3 files. Not fixed. `cmp` after the
     run: the copy's 3 files are byte-equal to the real tree's.

Review round 2 — Process-review worker (same spawn, caller `fkit-sprint-ship-loop`, 2026-10-08), same
approved plan and rulings. Obvious-winner calls: none. Snapshot of `SKILL.md` before the edit in the
scratchpad folder `0492-r2snap/`.
9. **R4 — the R3 doc sentence now names both archive folders** (answers review.md R4: it named only
   `sprints/done/`, but `/fkit-sprint-cancelled` archives to `sprints/cancelled/`, which the
   one-level-deep board read also never sees). Changed: one phrase in `fkit-status/SKILL.md` — "archived
   to `sprints/done/` or `sprints/cancelled/`" (the line re-wrapped); no code or test change. Now
   matches the accepted residual's What. Qualified: verified `CORRECT`; doc-only, one phrase; completes
   R3 inside the owner's ruling "Keep it; document it (Recommended)".
   - **Checks:** `test/prove-red.sh` does NOT name `claude/skills/fkit-status/SKILL.md` (grep: 0
     hits), so CONTRIBUTING's row for this edit is `npm run test:unit`: **1088/1088 pass** (201 s, real
     tree). Plus `node --test test/dashboard-contract.test.js`: **205/205**. The full `npm test` is not
     required for this row and was not run.

## Residuals (named in the script)
- Chains across boards are not followed (plan §4).
- The plan's accepted known misses (§3), plus: a task-folder slug inside a link is part of the
  soft/hard segment, so a slug carrying `soft` would read soft (quiet). Live: no slug contains `soft`;
  7 contain `hard`/`harden` (loud direction).
