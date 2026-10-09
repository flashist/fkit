# Plan — 0492: flag a sprint task that hard-depends on an open later-sprint task (`drift depends-on-later-sprint`)

**Approving this plan is the owner's "specific word" the brief asks for.** Nothing is built before that approval.

## 0. Goal
`dashboard.sh <plan>` (board mode) gets a new record kind for when an open row on a real sprint board hard-depends on an open task that sprint N cannot count on (it is on the Backlog board, on a sprint not started yet, on a later sprint, on a closed sprint, or its sprint can't be worked out). `/fkit-status` lists the kind as an owner decision for beat 6. The record makes the problem visible. It never blocks anything.

## 1. The record (what 0493 and 0494 will read)
```
drift depends-on-later-sprint <task> blocker="<D>" blocker_sprint="<M>" reason="<r>" [via="<X>"]
```
- `<task>`: the dependent's folder ID, the same way every other per-task record names it.
- `blocker`: the open task outside this sprint at the end of the chain. `blocker_sprint`: D's `## Sprint` value as written, escaped with `fact_value`.
- `reason`, one of:
  - `backlog-board`: the blocker is on the Backlog board.
  - `not-started`: the blocker's sprint is still 🔲.
  - `later-sprint`: both sprints are in the same phase, and the blocker's sprint number is higher.
  - `sprint-closed`: the blocker's sprint is ✅ or ⛔, but the blocker is still open.
  - `sprint-unresolved`: no live board has that identity, its banner is missing or malformed, or the brief's `## Sprint` is not `Backlog` or an exact `Sprint N`. This is the loud fallback; the check never guesses.
- `via` appears only on an indirect record (Q2): `<task>` waits on `<X>`, an open row on **this** board, which itself waits on the blocker. `via` names the next step in the chain.
- One record per (dependent, final blocker) pair. Each one calls `mark_drift`, so the row joins `DRIFT_TASKS` and the roll-up's drift clause. Open rows already render, so nothing new has to be shown on the board.
- **It does not change the row's Next step.** It is neither disagreement nor nonconformance: the record is consistent, the schedule is not. The `⟨derive: …⟩` placeholder text (design report §4.2/§9) is untouched.
- **What 0493 needs:** count records by `blocker=` ("N of this sprint's open rows wait on it"); `reason` gives the wording; the records already exist when the board is read in step 1, so nothing has to be worked out again by hand.
- **What 0494 needs:** render the **dependent's** sprint board, not the Backlog board, to get the record. Records without `via` are the direct dependents; the count with `via` is "how many stand behind it".
- The version marker stays `⟦fkit-dashboard v2⟧`. The envelope's shape doesn't change, only a new kind inside FACTS, which SKILL.md already says to report as-is if unknown. Same reasoning task 0409 used to keep v2; this is my call, not an owner ruling.

## 2. When it fires (the brief's question 1, "what later means")
The check runs only when the plan's identity is an eligible `Sprint N`. So it never runs on the Backlog board, and never on an unresolved identity (that already emits `unresolved-plan-sprint`). The dependent row counts as open when its **plan cell** is 🔲/🔄/🚧.

For each hard dependency ID D (§3), skip it if it is the row's own ID, has no task folder, or is closed: its folder is in `tasks/done/` or `tasks/cancelled/`, or its brief's `## Status` is ✅, ⛔ or ➡️ (read with `marker_key`). Otherwise read `M = D's ## Sprint`. `Nst` is this board's line-3 status, `Mst` is M's:

| # | Condition | Result |
|---|---|---|
| 1 | M == N | no record |
| 2 | M == `Backlog` | `backlog-board` |
| 3 | M is not an exact `Sprint N` token (same one grammar, `is_eligible`) | `sprint-unresolved` |
| 4 | M's board not found among the live boards, or its banner is missing or malformed | `sprint-unresolved` |
| 5 | Mst is Done or Cancelled | `sprint-closed` |
| 6 | Mst is 🔲 Backlog | if Nst is also 🔲: `later-sprint` only when `identity_gt M N`, otherwise none. If Nst is anything else: `not-started` |
| 7 | Mst is 🔄 In progress | `later-sprint` only when Nst is In progress or unresolved **and** `identity_gt M N`; otherwise none |

**Finding M's board:** look one level deep in `ai-agents/sprints/*.md` (`$AGENTS/sprints`, so archived renders work too). Take the first file in byte order whose identity (`resolve_identity`) equals M, and read its status with `plan_status_raw`. That is the same first-match tie-break ADR-041 §1.5 uses. The table is built **once**, and only when some row needs it. No new grammar: it reuses `resolve_identity`, `plan_status_raw`, `is_eligible`, `identity_gt`, `marker_key`, `field_value` and `depends_raw`.

**Where this differs from the producer's recommendation, said plainly (Q1):** the only difference is row 6 when both sprints are 🔲. Example: Sprint 12 (not started) depends on Sprint 11 (not started). The producer's rule flags this; this plan does not, because it is ordinary forward planning, and lowest number first is the only ordering the selector and `successor` use for unstarted sprints. Second, minor: an unresolved Nst counts as In progress in row 7 (the louder direction). Every case the brief lists in its verification steps comes out exactly as the brief expects.

## 3. Hard vs soft, and reading IDs (the brief's question 2)
- **Source text:** the content part of `depends_raw`'s output, which is the same text the `derive` record carries. The single "where is the Depends-on line" grammar is untouched. A new small awk function, `dep_hard_ids`, only interprets the text it returns. ⚠️ That is a new interpretation step on top of the "never interpreted" raw text; the placeholder itself still stays raw.
- **ID token:** exactly 4 digits. The character before it must not be a letter, digit or `-`. The character after it must not be a digit or `-<digit>`. That rules out dates like `2026-09-13`, `ADR-0xx`, `T-023` and longer numbers, while `../0331-slug/` and `` `0331` `` still count. IDs are de-duplicated, keeping the order they first appear in. An ID with no task folder (a year, a stray number) is dropped when the folder lookup fails.
- **Soft or hard:** an occurrence's segment is the text from that ID up to the next *different* ID. In that segment, the first match of `soft` or `hard` (any case) decides; no match means hard. An ID is soft only if **every** one of its occurrences is soft. Checked against real lines:
  - `task 0072** — soft, not hard` → soft
  - `— hard, not soft` → hard
  - `HARD. Not a soft-follow.` (0333) → hard
  - `0110 (hard) and 0112 — soft` → only 0112 is soft
- **Known misses, deliberately accepted** (all in the direction of flagging *more*, except the last two):
  - The soft/hard word written *before* the ID (`soft: 0110`) is treated as hard.
  - A negated `(not soft)` reads as soft. This one goes the quiet way.
  - Ranges like `0485–0491` are not expanded.
  - Prose IDs that `depends_raw` pulls in by over-including are counted (e.g. 0189's `` `0142` `` mention).
  - A mistyped ID that has no folder is silently skipped.
- **A line the script cannot read stays loud:** the U-form path still emits `depends-unparseable` (unchanged). A line it can read but that has no 4-digit ID produces no new record (Q3); the `derive` cell still shows the raw text.

## 4. Indirect dependents (verification step 4, Q2)
Recommended: flag them, **within this board only**. After the main row loop:
1. Work out the direct records.
2. Repeat until nothing changes: if open row B hard-depends on row A of this board, and A has a record for blocker V, and B has none for V yet, add (B, V, A's `blocker_sprint`, A's `reason`, `via=A`).

It always ends, because the set only grows and has a size limit; a dependency cycle is safe. Indirect paths across boards are **not** followed, e.g. through a task on an earlier, in-progress Sprint 9 board. That is a residual, written down in the script comment. For the geoconflict shape (A→V, plus 5 tasks →A) this gives 6 records, and the roll-up names all 6 tasks.

## 5. Files and changes
1. **`claude/skills/fkit-status/dashboard.sh`** (canonical copy)
   - **Header CONTRACT block:** add the widened reads (Q4). In board mode on a Sprint board only, the script now also reads (a) the briefs named by an open row's hard dependency IDs (located by globbing `tasks/{backlog,done,cancelled}/<ID>-*`), and (b) the first line and line 3 of `ai-agents/sprints/*.md` (one level deep). It still writes nothing, makes no network calls, and doesn't touch git. Record the owner's ruling and date there.
   - **New helpers, next to the existing ones** (`set +f`/`set -f` around every glob, as `sibling_claimants` does; bash 3.2; no apostrophes inside the single-quoted awk):
     - `dep_hard_ids`
     - `blocker_lookup <id>` → `closed` | `none` | `open<TAB><## Sprint>`
     - a lazy live-board table builder and lookup (`identity<TAB>status`)
     - `later_sprint_reason <Nst> <M> <Mst>` (the §2 table)
   - **In the main loop**, after the Next-step block and before the open-rows filter: when the check is on, the plan cell is open and the brief path is known, append `tid<TAB>hard-ids` to a collector string. This calls `depends_raw` again for that row (cheap; only sprint boards, about 20 rows; the 182-row Backlog board does no extra work).
   - **After the loop**, placed after `PLAN_STATUS` is computed and before the drift clause: work out the direct records, run the §4 propagation, then for each record call `add_fact` and `tid=…; mark_drift`. Order: direct records in row order and ID order, then indirect records in the order they are found. Deterministic.
2. **`claude/skills/fkit-status/SKILL.md`:** add the kind to the "What to do with `⟦FACTS⟧`" grammar block, after `depends-unparseable`. It gets one short entry saying: what it means; what each `reason` value means and what `via` means; that the row keeps its Next step (a scheduling finding, not disagreement or nonconformance); that it is **an owner decision in beat 6** with three ways out (move the dependents forward, move the blocker earlier, or accept it and record why); and that only 4-digit IDs are read and soft-marked ones are skipped. The "unknown kind → report as-is" rule is unchanged.
3. **`test/dashboard-contract.test.js`:** a new `0492/…` block, using the existing `sprintsFixture` / `brief({extra})` / `BANNER` helpers. Folder IDs are assigned in insertion order, so the `Depends on` lines refer to `0001`… directly.
   - **Positive cases:**
     - **P1:** the brief's verification step 1 (N 🔄, blocker on a 🔲 Sprint 2): exactly one record with all fields, the row renders, and the roll-up clause names it.
     - **P2:** blocker on the Backlog board → `backlog-board`.
     - **P3:** both sprints 🔄 and M is higher → `later-sprint`.
     - **P4:** M's board is ✅ → `sprint-closed`. M has no board → `sprint-unresolved`. Blocker's `## Sprint` is garbage → `sprint-unresolved`.
     - **P5:** the geoconflict shape: 1 direct record plus 5 with `via=`, plus one deeper chain whose `via` names the next step.
     - **P6:** soft/hard. `— soft, not hard` gives none; `— hard, not soft` gives a record; a mixed line flags only the hard ID.
     - **P7:** a link form with the ID twice produces one record.
   - **Negative cases** (the brief's verification step 3, plus extras):
     - blocker ✅ (folder in `done/`, and also ✅ status while still in `backlog/`)
     - blocker ⛔
     - blocker on the same sprint
     - blocker on a lower-numbered 🔄 sprint
     - dependent row closed
     - rendering `backlog.md`
     - both sprints 🔲 with the blocker lower (the Q1 exemption)
     - dependency on its own ID
     - an ID with no folder (e.g. `9999`)
     - a dependency cycle (still ends, no duplicate records)
     - a U-form line: `depends-unparseable` still fires and no new record appears
   - **SKILL.md wording pin:** an `expectProseOnce`-style test that the new grammar entry appears exactly once in `fkit-status/SKILL.md`, alongside the matching behaviour assertion. There is no full list-vs-script mirror test today (only E4 pins its two entries), so this pins the new one.
   - **No edits to existing tests.** None of the existing fixtures puts a 4-digit ID in a `Depends on` line (checked with grep), so none of them can start emitting the new record.
4. **Not edited, on purpose:**
   - `dependency-declaration-form.md`: both copies. The scaffold copy is hashed in `structure-manifest.tsv`, so editing it means regenerating the manifest and causes a `/fkit-heal` churn for users of fkit. The rules are recorded in SKILL.md and the script instead. A follow-up can carry them, possibly via 0494.
   - `test/prove-red.sh`: already modified by another task; prove-red is done by hand instead (§7).
   - The `.claude/` copies.
   - Everything 0493/0494/0495 own (the ship-loop SKILL.md, fkit-task-brief, agent prompts).

## 6. Sequencing
1. Snapshot first. Copy `dashboard.sh`, `fkit-status/SKILL.md` and `dashboard-contract.test.js` to `<scratchpad>/0492-snap/` with their sha256. All three are clean against HEAD today; re-check with `git status --porcelain` on those 3 paths at build start. The worktree is full of other tasks' edits, so **the diff shown for review is `diff -u snapshot current` on these 3 files, not `git diff`**.
2. Write the new tests first. Run them against the **unchanged** script inside a scratch copy (prove-red, §7).
3. Implement `dashboard.sh`, then SKILL.md.
4. Make the tests pass, then run the full set of checks (§7) in a scratch copy.
5. Smoke-test on the live tree: render `ai-agents/sprints/sprint-10.md` and `backlog.md`, and record the new-record count. Expected: 0 on Sprint 10, and the Backlog board's facts unchanged. Compare against the old script's output from the snapshot; the only allowed difference is new `depends-on-later-sprint` lines.
6. Decision-log entries go in `worklog.md`.

## 7. Checks (CONTRIBUTING.md "What to run for a change")
- **`npm test`** (full, about 12 min, includes prove-red). Required: `dashboard.sh` is a non-`.md` file under `claude/`, and the test machinery changes. That is the heaviest row; it covers the `fkit-status/SKILL.md` row (`test:unit`) too.
- **`node --test test/reference-integrity.test.js test/task-id-uniqueness.test.js`** run explicitly, as the brief's verification step 7 asks. `test/dashboard-contract.test.js` and `test/board-reader.test.js` must pass with no changes to existing tests (verification step 6).
- **Where they run:** a scratch copy of the whole repo **including `.git`**, because `closed-rank-immutability` reads git history. That keeps other agents' writes from landing mid-run and keeps the live tree untouched.
- **Prove-red:** the new positive tests (P1–P7 and the SKILL.md wording pin) must fail against the snapshot's `dashboard.sh` and SKILL.md, with output captured. Negative tests pass on the old code by definition, so they don't count as proof. The report will say that.
- **Skipped:** a new `prove-red.sh` mutation. Not required by the brief; the manual prove-red covers verification step 6.

## 8. Risks and edge cases (covered above, collected here)
- Bash 3.2 traps: no `declare -A`; split fields with `%%`/`#` rather than `read` with a tab IFS; `set +f` around every glob; no apostrophes in awk comments.
- Fields are escaped with `fact_value`. A garbage blocker sprint can't break the `key="value"` format. IDs are digits only, so they are safe to word-split out of `DRIFT_TASKS`.
- Two live boards with one identity: the first in byte order wins, and the board-level `ambiguous-plan-identity` record already covers that problem.
- The `$AGENTS/sprints` folder is missing: every numbered-sprint blocker becomes `sprint-unresolved` (loud).
- Cost: on a Sprint board, about 20 rows × a few IDs × a prefix glob, plus building the table once. The Backlog board does no extra work.
- **0451 overlap (ADR-052 phase 5):** 0451 rewrites this reader over the board's JSON store. Whichever lands second must bring along the kind name, the fields, the §2 table and these tests (the tests are the behaviour spec to port).
- **0495:** no shared files. 0493/0494 consume the record only.
