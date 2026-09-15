# Worklog — 0388

Build step, spawned by `fkit-sprint-ship-loop` (fkit-lead driver, Sprint 9) as the Build worker under the
declared-approval marker. Approved plan: `plan.md` in this folder (blob `f41968552d5e297517b9aa205e818f7671bf832b`,
checked with `git hash-object` before starting). Owner rulings: set A (mutations 35–38), one task, Item A as
design A2 (tests E1–E4 + mutation 39), Item B = B1. Build ends at plan §7; review not requested (driver note).

⚠️ Item B rule applied to this file: no `ai-agents/sprints/*.md:N` or task-record `.md:N` coordinates. Text is
quoted instead.

## 2026-09-14

### §1 Baselines (before any edit)

- `git status --porcelain` snapshot: 10 entries, all pre-existing — `architecture.md`, `sprints/backlog.md`,
  `sprints/sprint-9.md`, 0388's `brief.md`, 0393's `brief.md` (modified); 0392's brief rename to `done/`; untracked
  0388 `plan.md` and 0392 `plan.md`, `review.md`, `worklog.md`.
- `npm run test:unit`: **963 tests, 963 pass, 0 fail, 0 skipped**, 24 suites, exit 0 (~94 s).
- `time bash test/prove-red.sh`: **exit 0, 641 s**, all 34 mutations `red`.

### §2 By-hand measurement (scratch copies, before editing `prove-red.sh`)

| # | Suite | Measured reds | Expected (plan §2) |
|---|---|---|---|
| 35 | mover-exemption-step (24 tests) | `S2`, `S4` | `S2` (and `S4`) — match |
| 36 | dashboard-contract (176 tests, pre-E) | `successor S6` only | match |
| 37 | dashboard-contract | `successor S3`, `successor S4` | match |
| 38 | dashboard-contract | `successor S4`, `successor S7` | match |
| 39 | dashboard-contract (180 tests, with E1–E4) | `emitter map E2` only | E2 — match |

No mutation stayed green; no named assertion changed.

### §3 Anchor uniqueness (`grep -cF` on unmutated files)

- `'Backlog'|'In progress') ;;` = 1 (also 1 as a whole line, `grep -cx`)
- `identity_gt "$_i" "$2" || continue` = 1 (1 as a 4-space line prefix, by awk `index`)
- `mode_successor() {` = 1
- `|| identity_gt "$_best_id" "$_i"; then` = 2 (successor and select-active)
- `../../cancelled/X` = 1, `../../done/X` = 0 in `fkit-sprint-cancelled/SKILL.md`
- ``for `drift ambiguous-plan-identity`, which names`` = 1, ``for `drift ambiguous-active-sprint`, which names`` = 0
  in `fkit-sprint-done/SKILL.md`
- `! identity_gt "$_i" "$_best_id"` = 2 in `dashboard.sh` (both comments) — so mutation 36 counts its marker instead.

### §4–§6 Changes

- `test/prove-red.sh`: mutations 35–39 appended after 34 (four checks + named check each; heredoc/getline
  replacements for 36–38; 36 scoped to `mode_successor` by awk range, with an in-function survivor count and a
  whole-file count of 1). Header `THIRTY-FOUR` → `THIRTY-NINE`; five index lines; 0i now names mutations 14 and
  36-39, 0o names 33-35.
- `test/dashboard-contract.test.js`: block appended at the end — `emitter map E1`–`E4`, each with a PROSE half
  (whitespace-normalized exactly-once match, read from `REPO`) and a BEHAVIOUR half. No existing assertion edited.

### §7 Verification

1. `sh -n` and `bash -n` on `test/prove-red.sh`: both OK.
2. `time bash test/prove-red.sh`: **exit 0, 667 s**. 35–39 each print `red`; zero lines matching *wrong reason*,
   *NO-OP*, *DID NOT LAND*, *WRONG TARGET* or `✗`; lines 0a–34 identical to the baseline run.
   - ⚠️ Runtime: whole-gate delta is only **+26 s** (641 → 667), below the expected 85–145 s. The new block timed
     on its own (a scratch copy holding only the helpers and mutations 35–39) took **88 s**, inside the range. So
     the +26 s is run-to-run noise in the rest of the gate (~60 s variance on one pair of runs), not a cheaper
     block. Single dashboard suite run: ~23 s; mover suite: under 1 s.
3. Self-checks on a scratch copy of `prove-red.sh` (never the real file):
   - mutation 36's awk start anchor broken (`mode_successor_NOPE`) → `✗ MUTATION WAS A NO-OP` fired, then the
     suite was green and "did NOT catch" fired; exit 1.
   - mutation 37's named check pointed at `successor S5:` → `✗ suite went red but NOT at successor S3 — red for
     the wrong reason` fired; exit 1.
4. Changed files vs the §1 snapshot (`git status --porcelain` and `git diff --name-only`): new entries are only
   `test/dashboard-contract.test.js` (161 insertions, 0 deletions), `test/prove-red.sh` (252 insertions, 3
   deletions: the header count and the 0i/0o messages) and this `worklog.md`. `plan.md` blob unchanged. Nothing else.
5. `npm run test:unit`: **967 tests, 967 pass, 0 fail, 0 skipped**, exit 0 — baseline 963 plus exactly the four
   E-tests.
6. `node --test test/reference-integrity.test.js`: 22 pass, **0 broken**, 7 named-exempt; the file itself is
   unmodified (no `NAMED_EXEMPT` entry added). `node --test test/coordination-citation-policy.test.js`: 21 pass,
   `L2 live corpus: RESIDUAL is 0` green, with this worklog on disk.

Extra, not in the plan's list: each E-test's two halves were checked to go red on their own, on scratch copies —
prose halves of E1, E3 (`fkit-sprint-cancelled` wording), E4 (render entry renamed); behaviour halves of E2/E4
(render's `sibling_claimants` call blanked), E1 (select-active's `In progress` filter removed) and E3 (`identity`
printing an extra `drift` line). All went red at the named half.

## Decision log

Calls made without asking, under the standing approval (verified-correct, localized, inside the approved plan's
intent). Each names what it answers, what changed, and why it qualified.

1. **E3's prose site differs per mover.** *Answers:* plan §5 lists E3's sentence — "step 1 calls `identity` and
   step 2 calls `successor`, and both answer with a value and no drift" — as present in both sprint movers.
   Measured: it is only in `fkit-sprint-done/SKILL.md`. `fkit-sprint-cancelled` has no successor step, and its
   sentence for the same claim reads "step 1 calls `identity` and nothing else reads siblings". *Changed:* E3
   pins each mover on its own sentence (a per-skill needle map), and the block header says why this is not drift.
   *Why it qualified:* obvious winner within intent. The plan's own rule is "if prose broke, do not edit the
   constant to go green", and pinning a sentence that does not exist would be red at baseline. The claim being
   pinned (the value modes carry no collision report) is the same. No SKILL.md was edited.
2. **E3 uses `In progress` twins, not `Backlog` twins.** *Answers:* plan §2's expected reds for mutation 37
   (`S3` and `S4`). With Backlog twins, E3's `successor` call would also depend on the status filter and would
   add a red to mutation 37 that belongs to S3. *Changed:* E3's fixture banner. *Why it qualified:* localized, keeps
   the measured red sets the plan predicted, and E3's claim (no drift from a value mode) does not depend on status.
3. **E4's prose needles carry the neighbouring words that tie each record to its mode.** *Answers:* plan §5 E4,
   which names the two record entries. *Changed:* the select-active needle includes "— two plans claim the **same**
   identity."; the render needle includes "↑ the board you rendered shares its sprint identity with a sibling file.
   The render path's counterpart to `ambiguous-active-sprint`". *Why it qualified:* within intent (the test is
   "listed under the mode that emits it"); both needles measured exactly once.
4. **0i's list names 14 and 36-39, not 32.** Mutation 32 also rides 0i's seam and was already missing from that
   message before this task. Left as found — adding it is outside plan §6 ("name the new mutations"). Recorded so
   a reviewer can pick it up.

### Process review, round 1 (fkit-sprint-ship-loop Process-review worker, 2026-09-14)

Fixes applied without per-fix owner approval, under the standing plan approval. Each was first verified on the
code and, where it is a test gap, reproduced green on a scratch copy before the fix and red after it.

5. **R1 — E2's needle pinned the record, not the mode.** *Changed:* `E2_PROSE` in
   `test/dashboard-contract.test.js` now starts at "render the board — `bash claude/skills/fkit-status/dashboard.sh
   ai-agents/sprints/<basename>` — and read its", plus a short comment. *Why it qualified:* verified `CORRECT`
   (reviewer's wrong-mode rewrite reproduced green, then red at E2's PROSE half); one constant; inside plan §5's
   E2 claim. Mutation 39's anchor sits inside the widened needle, so 39's named test is unchanged.
6. **R2 — E4's select-active needle carried no mode.** *Changed:* `E4_SELECT_PROSE` now starts at
   "**it has no roll-up**: `⟦FACTS⟧` **is** its complete output", the lead-in true only of `select-active`.
   "five kinds" left out on purpose, so a new record kind does not red E4. *Why it qualified:* verified `CORRECT`
   (bullet moved under the render's list: green before, red after); one constant; inside plan §5's E4 claim
   ("lists each record under the mode that emits it"). Obvious winner over a new position-based assertion,
   which would add a second matching mechanism for one claim.
7. **R3 — E3's needles left out the lead clause.** *Changed:* both `E3_PROSE` needles now read "This skill
   runs no mode that reports it — … So the collision is silent on this path". *Why it qualified:* verified
   `CORRECT` (lead inverted: green before; red after, for both movers and for `fkit-sprint-cancelled` alone);
   two constants; inside plan §5's E3 claim.
8. **R4 — mutation 35 lacked a survivor check.** *Changed:* `test/prove-red.sh` mutation 35 gains
   `grep -c '\.\./\.\./cancelled/X'` = 0, WRONG TARGET message, mirroring 39. *Why it qualified:* owner
   ruling "Fix in 35 (Rec)"; plan §4 already names four checks; one `elif`. Synthetic two-anchors-on-one-line
   file: old checks pass, new check fires.
9. **R5 — 0i's list omitted mutation 32.** *Changed:* 0i message now "mutations 14, 32 and 36-39". *Why it
   qualified:* verified 32 rides `make_repo_copy` + `run_dashboard_suite`; message text only; inside plan §6
   (0i's list kept in step). Reverses decision-log item 4, which left it for review.
10. **R6 — no change.** Owner ruling "File follow-up brief (Rec)": `.github/workflows/test.yml` untouched;
    recorded in the ledger as `won't fix (frontier)` with an accepted residual.

No obvious-winner call beyond item 6's choice of needle over a position check.

Post-fix verification: `sh -n` / `bash -n test/prove-red.sh` exit 0 / 0. `bash test/prove-red.sh` (own exit,
no pipe) **exit 0**; 35–39 each `red`, 39/39 numbered mutation lines `red`, zero *wrong reason* / *NO-OP* /
*DID NOT LAND* / *WRONG TARGET* / `✗` lines, `✓ hard gate PASSED`. `node --test test/dashboard-contract.test.js`
exit 0, 180/180. `node --test test/*.test.js` exit 0, 967 tests, 967 pass, 0 fail. `node --test
test/coordination-citation-policy.test.js` exit 0, 21/21, L2 green.

## Verify

Independent re-run after Build (fkit-sprint-ship-loop Verify step, 2026-09-14). No source touched.

- `node --test test/*.test.js` (exit of node itself) → **exit 0**; tests 967, suites 24, pass 967, fail 0,
  cancelled 0, skipped 0, todo 0.
- `bash test/prove-red.sh > <scratch log> 2>&1; echo exit=$?` → **exit 0** in 627 s. 39/39 numbered mutation
  lines end `... red`; mutations 35, 36, 37, 38, 39 each `red`. Grep for `wrong reason` / `NO-OP` /
  `DID NOT LAND` / `WRONG TARGET` / `✗` → no matches. Final line: `✓ hard gate PASSED`.
- `git status --short` after both runs: same modified/untracked set as before (harness left no residue).
