# Worklog — 0495: Make every sprint-placement question state which tasks would then wait on that sprint

Build worker: spawned `fkit-coder`, caller `fkit-sprint-ship-loop` (Sprint 10), 2026-10-08. Approved
plan carried verbatim with its blob pointer (`git hash-object` of `plan.md` re-checked equal at start:
`04bd4575…`). Owner approval as relayed by the driver: "Approve (Recommended)"; plan Q1 (where the rule
lives) "New convention page (Recommended)"; plan Q2 (scope) "Always (Recommended)" — all
`AskUserQuestion`, `fkit-lead` session, 2026-10-08 (the session date rolled from 2026-10-07 around the
answer). `plan.md` not touched. No commit, no push, no wiki-vault write.

**`claude/fkit-claude-init.sh .` was NOT run** — on the driver's instruction, the driver refreshes
`.claude/` once both parallel builds (0492, 0495) land. The installed `.claude/` copies therefore do
not yet carry these pointers.

## Step 0 — snapshot
- Scratchpad folder `0495-snap/` (new): copies of the 11 existing target files plus `SHA256SUMS`. The
  two new convention files were absent at snapshot (diffed against nothing).
- Hashes were re-checked before each group of writes; none had changed (no concurrent edit to any of
  my targets).
- Manifest baseline: `node bin/generate-structure-manifest.mjs --stdout` diffed equal to the on-disk
  manifest before any edit, so the +2/−0 check below measures only this change.

## Change surface (13 files)
- **New** `ai-agents/knowledge-base/conventions/placement-questions-state-the-knock-on.md` and its
  byte-identical twin under `claude/scaffold/ai-agents/knowledge-base/conventions/` (`cmp` equal). The
  owner's Q2 scope ruling fills the plan's placeholder, quoted with its date.
- Both `conventions/README.md` copies: new "What's here" row; live footnote "Three … byte-identical" →
  "Four", naming the new file; scaffold "Nine conventions ship" → "Ten".
- `claude/structure-spec.md`: Table B row (alphabetical slot); "ten files … nine conventions" →
  "eleven … ten".
- `claude/structure-manifest.tsv`: regenerated, +2/−0 (below).
- Pointers (one each): `claude/agents/fkit-lead.md` ("Hold the owner channel" bullet, with the relay
  check), `claude/agents/fkit-producer.md` ("Flag dependencies and conflicts proactively"),
  `claude/agents/fkit-coder.md` (Output format §3, a bullet after the two interview bullets),
  `claude/skills/fkit-task-brief/SKILL.md` (step 3 "Flag dependencies and conflicts", naming steps 1
  and 5), `claude/skills/fkit-sprint-ship-loop/SKILL.md` (§3: rule + spawn-prompt instruction after the
  envelope paragraph; relay check in step 1), `claude/skills/fkit-task-ship-loop/SKILL.md` (one
  paragraph after the "STOP for the owner" list).
- `CHANGELOG.md`: one appended line under `## Unreleased`.
- Not touched: `fkit-status` (0492's), the rules block, any test, any ADR, `plan.md`, `.claude/`.

## Manifest
`npm run generate:manifest` in the live tree → 87 entries. `diff` vs the snapshot: exactly 2 added, 0
removed — `915c8d22…` for `ai-agents/knowledge-base/conventions/README.md` (equals the sha256 of the
new scaffold README) and `e2aeb368…` for the new convention (equals its sha256).

## Verification
- V1/V4 (diff review, `diff -u` snapshot vs current, not `git diff`): prose only, plus the 2 generated
  manifest lines. 11 changed files, 55 insertions, 8 deletions; 2 new files.
- V2: `grep -l placement-questions-state-the-knock-on` over the 6 home files → 6 of 6. Relative links
  resolved from an agent and a skill both exist.
- V3: the convention holds the example form (1 hit), `NEEDS-DECISION` (1), "(Recommended)" (3) and
  "(Rec)" (1).
- Line references into my files that live `claude/` and `test/` cite (coder 28, 98, 165; task loop 8;
  task-brief 70) show the same text before and after — every insertion sits below them.
- Full suite: **red as built (1 failure)** — see "Full suite" below.

## Full suite — RED on the tree as built (1 failure, mine); green with one out-of-plan count bump
- **Run 1 — the tree as built.** Scratch copy `0495-run/` (rsync incl. `.git`), 2026-10-08
  12:34:20 → 12:36:54, load ~5.1–5.9. `npm test` exit 1 at the unit stage (so `prove-red.sh` did not
  run): 1072 tests, **1071 pass, 1 fail** — `test/structure-check.test.js` "scaffold-verbatim
  project: every row conforming, exit 0, zero mutation": `51 !== 50`. The test pins the spec's row
  count (`EXPECTED_ROWS = 50`, and `conforming=50` in the summary regex); its own message says
  *"or the spec grew: update EXPECTED_ROWS deliberately with it"*. My new Table B row makes it 51.
  **The plan missed this file.**
- **Attribution.** The same test on a scratch copy restored to the pre-edit snapshot: 28/28 pass. The
  failure is this change, not a parallel task's.
- **Run 2 — copy `0495-bump/` with only that pin bumped** (50→51 in both places; scratch only, real
  tree untouched): 12:37:50 → 13:18:33 (~41 min), load ~4.7–6.2. **Exit 0**: unit 1072/1072 pass;
  `prove-red.sh` "hard gate PASSED", 43/43 mutations red. Dashboard tests were green in both runs.
- Named tests, run separately in copy 1, all green: `reference-integrity` 22/22, `task-id-uniqueness`
  42/42, `rules-block-budget` 3/3, `dual-home-parity` 9/9, `structure-spec` 7/7,
  `structure-manifest` 5/5, `plan-review-switch` 14/14, `spawned-write-marker` 9/9.
- `cmp` of copy 1 vs the real tree after the run: all 13 changed files, `worklog.md`, `plan.md` and
  `test/structure-check.test.js` identical (the real tree was not edited during the run; this
  section was written afterwards).
- **Not applied to the real tree:** the pin bump touches a file outside the approved plan (a test
  file, where the brief says "no test behaviour" changes), so it was returned to the driver as
  `NEEDS-DECISION` rather than made. Precedent: the same pin was bumped 48→49 and 49→50 when the
  spec grew before.

## Decision log
No review fixes were applied (Build worker; no review in this step). Build calls made unattended,
each inside the approved plan's intent:
1. **Task-brief pointer names step 5 as "an append rank flagged for owner confirmation"**, not the
   plan's "placement". Step 5 is about priority rank, not sprint choice; the plan's wording would have
   mis-described it. Precision only; the pointer still covers steps 1, 3 and 5 as the plan says.
2. **Convention wording finalised** (the plan's draft said "wording finalised at build"): dropped the
   draft's "(Generic incident.)" note; the Q2 scope ruling is stated in the header quote and as a
   "What to say" bullet, with one line of reason ("a same-sprint wait still orders the work"); the
   "Where it is enforced" section says plainly that nothing tests whether askers follow it.
3. **Lead pointer adds "and say you added it"** to the relay check — the convention's own relayer rule,
   carried into the pointer so the lead does not need to open the page to get it right.
4. **Producer pointer also names "an open question you return when spawned"** — the plan's home table
   gives the producer that channel; the convention already covers it.
5. **Not decided — returned as `NEEDS-DECISION`:** bump `test/structure-check.test.js`'s row-count pin
   (50→51) to match the new Table B row. Outside the approved plan's file list, so not made.
6. **Resolved — row-count pin bumped 50→51 (Build continuation, 2026-10-08).** Finding: the full suite
   was red only because `test/structure-check.test.js` pins the spec inventory at 50 rows; the new
   convention's Table B row makes it 51 (item 5 above). Change: `const EXPECTED_ROWS = 50;` → `51`,
   and the summary regex `conforming=50` → `conforming=51`; nothing else in that file or anywhere.
   Snapshot first: `0495-snap/structure-check.test.js.pre-bump` (sha256 `41fdf429…febb0`, equal to the
   real file before the edit). Owner ruling, 2026-10-08, `AskUserQuestion` in the fkit lead session,
   relayed by the `fkit-sprint-ship-loop` driver — question: "0495's new rules page makes one test fail
   only because it hard-codes the file count (50; it's now 51). May the coder change 50 to 51 in
   test/structure-check.test.js?" — selected, verbatim: "Bump the count (Recommended)" (option text:
   "Change 50→51 in 2 places in that one test file; nothing else changes. Already proven green in a
   scratch copy (full suite passes). Same as the earlier 48→49 and 49→50 bumps."). Why it qualified:
   owner-approved scope, mechanical, two literals. Verified on the real tree: `node --test` of
   `structure-check`, `structure-spec`, `structure-manifest`, `dual-home-parity` — 49/49 pass. Full
   suite on the real tree not run here (the driver runs it after 0492's pending fix lands).

## Process-review round 1 (spawned `fkit-coder`, Process-review worker, 2026-10-08)
Caller `fkit-sprint-ship-loop` (Sprint 10). Standing approval: the approved plan (blob `04bd4575…`,
carried verbatim), plus the owner's round-1 ruling on R5 — `AskUserQuestion`, fkit lead session,
2026-10-08, selected verbatim: "Keep scope; drop 'a cancel' (Recommended)". Method: all steps 0–7 of
`fkit-process-stateful-review`, no per-round owner gate. No accepted residuals and no ADR in scope
matched any finding (no closeouts). Severity derived per finding (in the ledger's *Coder response*).

- **Snapshot:** scratchpad `0495-r1snap/` — the 6 files touched this round, with `SHA256SUMS`. The
  manifest generator's `--stdout` equalled the on-disk manifest before any edit.
- **Line discipline:** every edit to `fkit-lead.md`, both loop skills and `CHANGELOG.md` rewraps in
  place — line counts unchanged (158 / 479 / 328 / 86), so no line-cited text moves. The convention
  (cited by line nowhere in `claude/` or `test/`) grew; its twin was re-copied and `cmp`-equal.
- **Manifest:** `npm run generate:manifest` → 87 entries; vs the 0495 build snapshot still +2/−0; vs
  the round snapshot exactly one line changed — the convention's hash `e2aeb368…` → `674d5b9e…`
  (equals the sha256 of the new file).

### Decision log — round 1
Each fix below was applied without asking under the standing approval. Each qualified as
verified-`CORRECT`, prose-only and localized, and inside the approved plan (the plan's convention,
pointer and CHANGELOG items; R5 additionally by the owner's ruling above). No obvious-winner call
outside the plan was made.
1. **R1 (search starts from the wrong set).** Changed: the convention's *How to find them* now starts
   from the briefs as they would stand once the option is applied; start set = each open task whose
   `Depends on:` would then name the placed task, plus the task whose `Depends on:` line an
   add/remove/re-point changes; it names the incident shape; *What to say* points at the start set and
   gives the removal wording ("would no longer wait on"); header zero case reworded. Why: verified —
   the old search ran on the briefs as they stood, so the incident shape found nothing; the fix
   completes the plan's own covered list (add/remove/re-point), touching one file and its twin.
2. **R2 ("not Moved").** Changed: "Open" = not Done or Cancelled in any form (linking
   `task-status-vocabulary.md`); a `Moved` row is not a closed task. Why: verified against the
   vocabulary ("Not dead, not done — relocated"); one bullet.
3. **R3 (checked-zero vs forgotten).** Changed: worker writes `knock-on: none (checked)` on a
   placement option with nothing waiting; relayer drops it when asking and treats "neither" as
   missing — in the convention, the lead pointer and the sprint loop (spawn-prompt line and relay
   step 1). The owner-facing option is unchanged, as the finding and the driver's unit required. Why:
   verified — the old relay check could not tell the two apart; envelope-only change, no line shift.
4. **R4 (relay sourcing dropped).** Changed: both relay clauses say "from the briefs, checked this
   turn". Why: verified the omission; restores the convention's own wording in the pointer.
5. **R5 ("a cancel").** Changed: dropped "a cancel," from the task loop's pointer list. Why: verified
   the convention never covered cancels; owner ruling (above) chose exactly this.
6. **R6 (CHANGELOG).** Changed: "now says" → "must now say". Why: verified enforcement is prose only;
   one-word, one-line.

### Verification — round 1
- Targeted, real tree: `coordination-citation-policy`, `dual-home-parity`, `structure-manifest`,
  `structure-spec`, `spawned-write-marker`, `plan-review-switch`, `reference-integrity` — 88/88 pass.
- **Full `npm test`, green.** Scratch copy `0495-r1run/` (fresh rsync incl. `.git`), 14:40:48 →
  15:19:03 (~38 min), load ~5.0–6.7. Exit 0: unit 1085/1085 pass (the count grew from 1072 with
  other tasks' tests); `prove-red.sh` "hard gate PASSED", 43/43 mutations red.
- `cmp` of the copy vs the real tree after the run: the 7 changed files plus this task's `review.md`,
  `worklog.md` and `plan.md` all identical (the real tree was not edited during the run; this section
  was written afterwards). `plan.md` blob still `04bd4575…`.
- `claude/fkit-claude-init.sh` not run (the driver refreshes `.claude/`).

## Process-review round 2 (spawned `fkit-coder`, Process-review worker, 2026-10-08)
Caller `fkit-sprint-ship-loop` (Sprint 10), continuing the round-1 spawn. Same approved plan: carried
verbatim in the original spawn, and `plan.md` re-checked at blob `04bd4575…` (unchanged). Same owner
rulings; no new ruling needed. Method: all steps 0–7, no per-round gate. No accepted residuals and no
ADR in scope matched R7 or R8 (no closeouts).

- **Snapshot:** scratchpad `0495-r2snap/` (the convention, its twin, `fkit-lead.md`, the sprint-loop
  skill and the manifest, with `SHA256SUMS`). The live files were unchanged since the round-1 run copy,
  and the manifest generator's `--stdout` equalled the on-disk file before any edit.
- **Line discipline:** the `fkit-lead.md` and sprint-loop edits rewrap in place — 158 / 479 lines, as
  before — so no citation moves. (A first draft of the lead edit added a line; it was rewrapped back to
  two lines before anything ran.)
- **Manifest:** `npm run generate:manifest` → 87 entries. Vs the 0495 build snapshot still +2/−0; vs
  the round-2 snapshot exactly one line changed — the convention's hash `674d5b9e…` → `243d428d…`
  (equals the sha256 of the new file).

### Decision log — round 2
Both fixes were applied without asking under the standing approval. Each qualified as verified-
`CORRECT` (R8 partially), prose-only and localized, and inside the approved plan (its convention and
pointer items). No obvious-winner call outside the plan was made.
1. **R7 (the relay pointers never say to drop the note).** Changed: `fkit-lead.md`'s relay sentence
   adds "(drop that note when you ask)"; the sprint loop's relay step 1 says it "drops each
   `knock-on: none (checked)` note". Why: verified — the drop lived only in the convention, and step 1
   says to ask "with the returned options"; the fix carries the convention's own rule into both
   pointers.
2. **R8 (a re-point's removed half).** Changed: the convention's *What to say* adds "A re-point removes
   one link and adds another, so its option says both." Why: verified partially — a plain reading
   already covers it, but one sentence removes the literal-reader gap; the twin was re-copied and
   `cmp`-equal.
- **Ledger:** both rows `✅ done`; nothing blocking remains, so the header `Status:` is set to
  `closed-out`. The reviewer has not re-read the R7/R8 text.

### Verification — round 2 (RED, not attributed to 0495)
- Targeted, real tree, before the runs: `coordination-citation-policy`, `dual-home-parity`,
  `structure-manifest`, `structure-spec`, `spawned-write-marker`, `plan-review-switch`,
  `reference-integrity` — 88/88 pass.
- **Full run 1** — copy `0495-r2run/`, 15:28:28 → 15:38:33, load ~5.9 → 8.3. Exit 1 at the unit
  stage: 1088 tests, 1087 pass, **1 fail** — `test/board-root.test.js` "R3: a bad --root exits 2 …":
  `null !== 2` with empty stderr, i.e. the test's 20 s `spawnSync` timeout killed the board CLI (that
  test took 35 s). `prove-red.sh` did not run. Re-run of that file alone in the same copy: 9/9 pass in
  2.4 s (load ~14).
- **Full run 2** (a second, explicit run — not a silent retry) — fresh copy `0495-r2run2/`, 15:39:10 →
  16:18:10 (~39 min), load ~13.4 at start, ~5.4 at end. Exit 1: unit 1088/1088 pass; `prove-red.sh`
  mutations 1–43 all red as required, steps 0b–0p green, but **step 0a (baseline re-run of the real
  suite) red** on the same `board-root` R3 test (45 s; same `null !== 2`).
- **Attribution:** not this change. That test drives the board reader CLI on temp fixtures and reads
  none of the files 0495 touched; it passed in round 1's full run (load ~5–6), passes alone (9/9, run
  in the copy and on the real tree), and failed only under heavy machine load. `test/board-root.test.js`
  itself carries another task's uncommitted edits (0492's worklog and review name it) — not fixed here,
  per the driver's instruction.
- `cmp` of each copy vs the real tree after its run: the 5 changed files plus `review.md`,
  `worklog.md` and `plan.md` identical (no real-tree edit during either run; this section was written
  afterwards). `plan.md` blob still `04bd4575…`.

## Process-review round 3 (spawned `fkit-coder`, Process-review worker, 2026-10-09)
Caller `fkit-sprint-ship-loop` (Sprint 10), continuing the same spawn; the task folder is now under
`done/` (agent-closed) with its ledger reopened. Same approved plan (`plan.md` re-checked at blob
`04bd4575…`) and owner rulings. Method steps 0–7 on R9 only; no residual or ADR matched it. The
machine restarted, so the earlier scratch snapshots are gone; fresh snapshot `0495-r3snap/` of the two
files (with `SHA256SUMS`) taken before editing.

### Decision log — round 3
1. **R9 (R7's rewrap dropped R4's timing words).** Changed: "before you ask" restored in
   `fkit-lead.md`'s relay sentence; "before it asks" restored in the sprint loop's relay step 1. Why it
   qualified: verified-`CORRECT` (my round-2 record says I folded those words away), a two-phrase
   in-line insertion, inside the approved plan — it restores my own round-1 R4 fix, the reviewer's
   option (a). Line counts unchanged (158 / 479).

### Verification — round 3
- Real tree: `spawned-write-marker`, `plan-review-switch`, `coordination-citation-policy`,
  `reference-integrity` — 67/67 pass. Manifest generator `--stdout` equals the on-disk file (neither
  touched file is in the manifest).
- **Full suite not run this round, on the driver's instruction.** The next full run is 0493's Build,
  which edits the same sprint-loop file and runs once after this fix; the driver will `cmp` both files
  against that run's copy so it covers these bytes.
- Ledger: R9 `✅ done`, nothing blocking → header `Status:` set to `closed-out`. The reviewer has not
  re-read the R9 text.
