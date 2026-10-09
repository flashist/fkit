# Worklog: 0494 — warn when filing or re-pointing puts a blocker in a later sprint than its dependents

## 2026-10-09 — Build (spawned `fkit-coder`, Build worker, under `fkit-sprint-ship-loop`'s declared-approval marker)

Approved plan: `plan.md` in this folder (owner approval 2026-10-09 via the lead session's
`AskUserQuestion`, "Approve as written (Recommended)"; Q1 "Yes, add moves", Q2 "Not now; follow-up
brief", Q3 "Accept, name it in the step").

### Change surface
- `claude/skills/fkit-task-brief/SKILL.md` — step 3's knock-on sentence gains "and step 9 (the
  placement warning)"; new `### 9. Check where the dependencies landed — warn, never refuse`;
  `Never` → step 10, `Report` → step 11; one sentence added to the write-surface paragraph; a
  **Placement check (step 9)** bullet added to the report.
- `claude/agents/fkit-producer.md` — one Behavioral-rules bullet after "Flag dependencies and
  conflicts proactively" (with the Q1 move clause).
- `CHANGELOG.md` — one line under `## Unreleased`.
- Not touched (as planned): both convention files, `dashboard.sh`, `fkit-lead.md`,
  `fkit-sprint-ship-loop`, `.claude/` copies, `claude/structure-manifest.tsv`.
- Step 9 came out at 68 lines including its 11-line command block — longer than the plan's
  35–45-line estimate. Every line maps to a §2/§3 item; nothing was added outside the plan.

### Fixture walk-through (verification 1, 2)
Fixture script and output live in the session scratchpad (`0494-fx/`), not in the repo. It extracts
step 9's command block from the canonical SKILL.md byte-for-byte and runs it in each fixture.
Base: Sprint 6 🔄 (0008 depends on 0001); Sprint 7 🔄 (0001 depends on nothing; 0002 on 0001;
0003–0006 on 0002); Sprint 8 🔲; Backlog board; 0009 ✅ Done.

| Fixture | Edit | Touched | Concerning records | Result |
|---|---|---|---|---|
| F1 | file 0010 into Sprint 8, re-point 0001 → 0010 | 0010, 0001 | `0001 blocker=0010 Sprint 8 not-started` (+5 `via`) | warning |
| F5 | F1's filing, checked **before** the re-point | 0010 | none | `none (checked: sprint-6, sprint-7, sprint-8)` |
| F2 | file 0010 into Sprint 7 (same sprint), re-point | 0010, 0001 | none | none |
| F3 | re-point 0001 → 0009 (✅ Done) | 0001 | none | none |
| F4 | file 0010 on the Backlog board, re-point | 0010, 0001 | `0001 blocker=0010 Backlog backlog-board` (+5 `via`) | warning |
| F6 | re-point 0001 with a decorated `**⚠️ Depends on 0010**` | 0001 | `depends-unparseable 0001` | `not fully checked: 0001's Depends on: line is unreadable` |
| F7 | F1 + a board with no resolvable identity | 0010, 0001 | as F1 | as F1, plus `placement check not run: …plan-misc.md — identity unresolved (exit 3)` |
| F8 | [Q1] move 0001 from Sprint 7 to Sprint 8 (pull procedure) | 0002, 0008 | `0002 blocker=0001 not-started` (+4 `via`); `0008 blocker=0001 not-started` (Sprint 6) | warning |

In every fixture Sprint 6 also carries `0008 blocker="0001" reason="later-sprint"` (Sprint 6 🔄 waits
on Sprint 7 🔄). It is a wait that existed before the edit; 0008 is not touched in F1–F7, so the
touched filter leaves it out — which is the point of the filter. The Backlog board is never rendered
(identity `Backlog`). F1's loop was also run under `zsh`: same output.

#### F1 — the warning as step 9 produces it (session form)

> **Placement check: 0010 is in a sprint not started yet (Sprint 8).**
> 0001 (Sprint 7, in progress) now depends on 0010, which is in Sprint 8 — a sprint not started yet.
> Waiting with it: 0002 waits through 0001; 0003, 0004, 0005 and 0006 wait through 0002 (all Sprint 7).
> 6 open tasks stand behind 0001: 0002–0006 on Sprint 7, and 0008 on Sprint 6.
>
> Options:
> 1. **Move 0001 to Sprint 8** — 0001 then waits on 0010 inside Sprint 8. Knock-on: 0002 and 4 tasks
>    behind it (Sprint 7), and 0008 (Sprint 6), would then wait on Sprint 8.
> 2. **Place 0010 earlier — in Sprint 7** (or Sprint 6). Knock-on: 0001 and 6 tasks behind it would
>    then wait on Sprint 7 (a same-sprint wait for 0001–0006; 0008 on Sprint 6 keeps waiting on 0001 in
>    Sprint 7).
> 3. **Accept it and record why** — a line in 0001's `## Notes` and in Sprint 8's dated addendum.
>    Knock-on: 0001 and 6 tasks behind it keep waiting on Sprint 8.
> 4. *Explain more, then ask again* — the owner's own question rule adds this; it carries no knock-on.
>
> (No recommendation marked — step 9 does not pick one.)

Counts checked: the *How to find them* search from 0001 finds 0002 and 0008, then 0003–0006 from
0002, nothing from the others — 6. All five `via` records (0002–0006) are inside that count.

#### F1 — the spawned form

```
NEEDS-DECISION
question: 0001 (Sprint 7, in progress) now depends on 0010, filed into Sprint 8, which has not
  started. 0002–0006 (Sprint 7) and 0008 (Sprint 6) stand behind 0001 — 6 open tasks. Keep this
  placement?
options:
  1. Move 0001 to Sprint 8 — knock-on: 0002 and 4 tasks behind it (Sprint 7), and 0008 (Sprint 6),
     would then wait on Sprint 8.
  2. Place 0010 earlier, in Sprint 7 (or Sprint 6) — knock-on: 0001 and 6 tasks behind it would then
     wait on Sprint 7 (same-sprint wait for 0001–0006).
  3. Accept and record why (0001's Notes + Sprint 8's addendum) — knock-on: 0001 and 6 tasks behind it
     keep waiting on Sprint 8.
recommendation: none marked
context: drift depends-on-later-sprint 0001 blocker="0010" blocker_sprint="Sprint 8"
  reason="not-started", plus 5 via records; checked sprint-6, sprint-7, sprint-8 this turn. Nothing
  was asked, moved or recorded.
```

### Decision log
Calls made inside the approved plan's intent, without asking (the obvious-winner / in-plan record
ADR-019's audit duty asks for). Each names what changed and why it qualified.

1. **Touched filter** — implemented as plan §2a: a record concerns the run only when its dependent is a
   touched task. Fixture F1/F5 show the pre-existing Sprint 6 record being left out. In-plan.
2. **All-boards render** — every top-level board except identity `Backlog`, as §2b. In-plan.
3. **Unresolved-identity board → `placement check not run`** (F7). §2b/§2c did not say what to do with
   a board whose `identity` probe exits 3. 0492's record never runs on such a board, so the plan's own
   "a check that did not run is never a pass" decides it: report it as not run. Obvious winner within
   intent; it only adds a loud line, never a silent pass.
4. **Already-ruled clause** — kept, as the owner approved the plan with it.
5. **Q1 = yes** — the move clause is in step 9's touched-task bullet and in the fkit-producer rule. F8
   exercises it.
6. **Q2 = not now** — `dependency-declaration-form.md` not edited; the soft-marking sentence is in step
   9's limits bullet. Manifest checksum unchanged (below).
7. **Q3 = accept** — the cross-board-chain limit is stated in step 9's limits bullet; no code.
8. **`ambiguous-plan-identity` passed on** — the loop greps that drift kind too, so §6's "passed on"
   risk is covered by the same command. In-plan (§6).
9. **Step length** — 68 lines vs the 35–45 estimate; no content outside §2/§3. Recorded, not a scope
   change.

No review fix was applied (this is the Build step, not Process-review).

### Checks
Run one at a time in a scratch copy of the repo (with `.git`), taken after all edits; the three edited
files in the copy were byte-identical to the live ones afterwards.
- `npm run test:unit` — 1088 pass, 0 fail.
- `npm run test:docs` — 389 pass, 0 fail (includes this worklog and `plan.md`).
- `node --test test/reference-integrity.test.js test/task-id-uniqueness.test.js` — 64 pass, 0 fail
  (verification 5). No test pins the step list; nothing outside the skill cites steps 9–11.
- `claude/structure-manifest.tsv` sha256 unchanged before/after (`46743be2…`).
- Skipped: full `npm test` (plan §5 — no scaffold, non-`.md`, test or prove-red-named change); a new
  automated test (plan §5). **Unverified until first real use:** that a real producer follows step 9;
  the walk-through above is the coder following the prose by hand, with the loop itself run for real.
- `CHANGELOG.md` — the added line carries no links; checked by eye.

## 2026-10-09 — Review round 1 (spawned `fkit-coder`, Process-review worker, under the declared-approval marker)

Driver: `fkit-sprint-ship-loop`. Same approved plan (blob `b0936946…`, re-checked this turn). New owner
rulings relayed 2026-10-09 via the lead session's `AskUserQuestion`: R2 "Yes, cover it (Recommended)",
R3 "Yes, if it stated this knock-on (Recommended)". Snapshot before any edit: session scratchpad
`0494-r1snap/` (SKILL.md, fkit-producer.md, CHANGELOG.md, review.md, worklog.md + sha256).

### Decision log — fixes applied without per-fix owner approval
Each: finding · what changed · why it qualified.

- **R1** · step 9's touched filter now treats direct and indirect records separately; an indirect
  record concerns the run when its `via` chain reaches a touched task. · Verified `CORRECT` against
  F1's own output (`via` records carry the downstream task as first field); localized to one bullet;
  in-plan (§2c already required the `via` records in the warning). **Obvious-winner call inside it:**
  follow the chain rather than the reviewer's "blocker has a concerning direct record on the same
  board" — the chain keeps §2a's rule (no waits the edit did not cause) when an untouched direct
  dependent of the same blocker already exists.
- **R2** · the touched set and the fkit-producer.md rule now cover any move between boards (pull,
  carry-forward, de-scope, any other sprint), touching the moved task itself as well as the tasks
  naming it. · Wider than the approved Q1 wording, so applied under the owner's R2 ruling (quoted
  above), not as an in-plan fix.
- **R3** · *Already ruled* now covers a ruling relayed to a spawned producer, only if the quoted
  option stated this same knock-on; that producer returns no `NEEDS-DECISION`, moves nothing, records
  way 3 only in files this run already writes, and says what it left unrecorded. *Who asks* names the
  exception. · Applied under the owner's R3 ruling (quoted above).
- **R4** · way 3 names the board: the sprint board this run edited; the dependent's sprint board when
  the run edited the Backlog board (no addendum, step 8) or no board. *Carrying out* now says "brief or
  board". · Verified `CORRECT` (step 8 gives the Backlog board no addendum); localized; in-plan (§2c's
  "a note outside the write surface is a producer edit"). **Obvious-winner call:** the dependent's
  sprint board over "brief notes only", because the plan asked for a board addendum and the dependent's
  board is the only sprint board left in that case.
- **R5** · "Pass on any `ambiguous-plan-identity`" replaced by: relay it, and that sprint's result is
  `not fully checked`, never a pass (with the first-claimant reason). · Verified `CORRECT`
  (`later_board_status` stops at the first identity match); wording only; in-plan (§2c, §6).
- **R6** · `|| true` on the loop's `grep`. · Verified `CORRECT` by reading the loop (its exit status is
  the last `grep`'s); one token; in-plan.
- **R7** · the 0494 CHANGELOG line now also names moving a task between boards; 0493's line is
  untouched. · Verified `CORRECT` (the line understated the Q1/R2 trigger); one line; in-plan. Applied
  after the driver released CHANGELOG.md (0493's full `npm test` done).

### Round-1 checks
Run one at a time; tests in a fresh scratch copy of the repo (with `.git`) taken after all round-1
edits, with the final review.md and worklog.md copied in before `test:docs`.
- Fixtures F1–F9 (F9 = the R2 pull fixture) re-run with step 9's loop extracted from the edited
  SKILL.md: same records as the Build round for F1–F8; F9 gives
  `0007 blocker="0011" blocker_sprint="Backlog" reason="backlog-board"` with 0007 touched under R2.
  **Every run exits 0** (R6), including the clean F2/F3/F5, and F1/F2 under `zsh`.
- `npm run test:unit` — 1094 pass, 0 fail.
- `npm run test:docs` — 389 pass, 0 fail.
- `node --test test/reference-integrity.test.js test/task-id-uniqueness.test.js` — run last, on this
  final worklog; result in the round-1 report to the driver.
- `claude/structure-manifest.tsv` sha256 unchanged (`46743be2…`).

## 2026-10-09 — Review round 2 (spawned `fkit-coder`, Process-review worker, under the declared-approval marker)

Driver: `fkit-sprint-ship-loop`; plan carried verbatim this time (blob `b0936946…`, re-checked). No new
owner ruling — R8 and R9 are plain defects. Snapshot before any edit: session scratchpad `0494-r2snap/`.

### Decision log — fixes applied without per-fix owner approval
- **R8** · step 9's indirect-record rule: "its `via` chain reaches a touched task" became "its dependent
  **or any task on its `via` chain** is touched". · Verified `CORRECT` on the reviewer's G1/G2 (a
  touched task that is itself an indirect dependent was dropped — a false `none`); this was a
  regression from my own R1 fix. One clause; in-plan (§2a: a record concerns the edit when its task is
  touched — the fix restores exactly that, and R1's chain-following stays for the downstream records).
- **R9** · way 3: when the run edited more than one sprint board (a move between sprints), the
  addendum line goes on the direct dependent's sprint board. · Verified `CORRECT` (a sprint-to-sprint
  move edits two boards, so "the sprint board this run edited" was not unique); one clause; in-plan —
  it reuses R4's existing fallback rather than a new rule. **Obvious-winner call:** that board, over
  "the destination board", because the dependent's board is where the wait sits and R4 already sends
  the other non-unique cases there.

### Round-2 checks
- Fixtures F1–F9 plus G1/G2 (rebuilt from the reviewer's `0494-r2fx/r2.sh`), loop extracted from the
  edited SKILL.md; all 13 runs exit 0. The round-2 filter, applied by script (`0494-fx/filter.py`), gives:
  F1 0001→0010 + 5 via · F5 none · F2 none · F3 none · F4 0001→0010 backlog-board + 5 via · F6 none +
  `depends-unparseable 0001` (not fully checked) · F7 as F1 + `not run: plan-misc.md` · F8 0008→0001,
  0002→0001 + 4 via · F9 0007→0011 · G1 0012→0010 via 0003 · G2 0007→0010 via 0006.
- Tests, one at a time, in a fresh scratch copy taken after all round-2 edits (edited files
  byte-identical to live): `npm run test:unit` 1096 pass / 0 fail. `npm run test:docs`: the first run
  had **1 failure**, `board-root` "R1: with no --root the root resolves exactly as before…", at
  20031 ms against about 1.2 s when it passes. The machine load average was about 5. The test is not
  touched by this change (only `.md` prose changed). It passed on two further runs, the last
  389 pass / 0 fail, so I read it as a load timeout — not proven. Named tests
  (`reference-integrity`, `task-id-uniqueness`): 64 pass / 0 fail.
- `claude/structure-manifest.tsv` sha256 unchanged (`46743be2…`). fkit-producer.md and CHANGELOG.md
  not edited this round.

## 2026-10-09 — Review round 3 (spawned `fkit-coder`, Process-review worker, under the declared-approval marker)

Driver: `fkit-sprint-ship-loop`; plan carried verbatim (blob `b0936946…`, re-checked). Owner ruling
2026-10-09, lead session `AskUserQuestion`, selected verbatim: "Fix both, quick final check
(Recommended)". Snapshot before any edit: session scratchpad `0494-r3snap/` (with `SKILL.diff`).

### Decision log — fixes applied without per-fix owner approval
- **R10** · one sentence appended to step 9's warning bullet: a blocker with no concerning direct
  record has its touched indirect dependents count as its direct dependents, in the warning and all
  three ways out, each still naming the task it waits through. · Verified `CORRECT` (G1/G2's groups
  hold only an indirect concerning record, so "each direct dependent" named nobody, or a pre-existing
  waiter); one sentence; applied under the owner's ruling above. The R8 filter is not touched.
- **R11** · way 3's fallback: "the direct dependent's sprint board" → "each direct dependent's sprint
  board … (one line per board)". · Verified `CORRECT` (direct dependents of one blocker can sit on
  different sprint boards); one clause; applied under the same ruling. The over-long line R9 left is
  rewrapped in the same sentence.

### G1 / G2 walked by hand against the round-3 wording
- **G1** — this run files 0012 into Sprint 7 (`Depends on: 0003`); it edits the Sprint 7 board.
  Touched: 0012. Concerning: `0012 → 0010 backlog-board via 0003`. The 0010 group has no concerning
  direct record, so **0012 stands in as the dependent**. Warning names 0012 (Sprint 7), "waits through
  0003", and 0010 on the Backlog board; 0 open tasks behind 0012. Way 3 targets: **`## Notes` of 0012**
  (a brief this run created — inside the skill's write surface); **addendum on Sprint 7** (the one
  sprint board this run edited). 0001 is not noted: its wait predates this run.
- **G2** — a producer edit pulls 0007 from the Backlog board into Sprint 7 (`Depends on: 0006`); it
  edits the Backlog board and Sprint 7. Touched: 0007 (no brief names 0007). Concerning:
  `0007 → 0010 backlog-board via 0006`. **0007 stands in as the dependent**, "waits through 0006"; 0
  behind it. Way 3 targets: **`## Notes` of 0007** (a producer edit — not a brief created by the
  skill); **addendum on Sprint 7** — the only sprint board edited, and also 0007's own board under the
  fallback, so both readings agree.

### Round-3 checks
- In a fresh scratch copy of the repo; the edited files were byte-identical to the live ones.
  `coordination-citation-policy` + `reference-integrity`: 44 pass / 0 fail, run while 0493's full
  run was in progress. `npm run test:unit`: 1096 pass / 0 fail, started only after that full run had
  exited.
- `claude/structure-manifest.tsv` sha256 unchanged (`46743be2…`). This round edited only SKILL.md
  (the two sentences above), review.md (Coder response) and this worklog.

## 2026-10-09 — Review round 4 (spawned `fkit-coder`, Process-review worker, under the declared-approval marker)

Driver: `fkit-sprint-ship-loop`; plan carried verbatim (blob `b0936946…`, re-checked). Owner ruling
2026-10-09, lead session `AskUserQuestion`, selected verbatim: "One-clause fix, no more rounds
(Recommended)". Snapshot before any edit: session scratchpad `0494-r4snap/` (with `SKILL.diff`).

### Decision log — fixes applied without per-fix owner approval
- **R12** · R10's sentence ("a blocker with no concerning direct record: its touched indirect
  dependents count as its direct dependents") replaced by the ruled clause: a touched indirect
  dependent counts as a direct dependent whenever no other touched task sits on its `via` chain; a
  touched task behind another touched task stays behind it. · Verified `CORRECT` on the reviewer's G3
  (one 0010 group holding direct `0013` and indirect `0012 via 0003`: the group gate never fired, so
  0012 got no note and was not moved). One clause; applied under the owner's ruling above. The R8
  filter and the R11 board wording are untouched.

### G1 / G2 / G3 walked by hand against the round-4 wording
Blocker 0010 is on the Backlog board in all three, so way 1 means de-scoping the dependents.
- **G1** — touched 0012 (filed, Sprint 7). `0012 via 0003`; chain 0003→0002→0001 holds no touched task
  → 0012 counts as direct. Notes: **0012** (created this run). Way 1 moves: **0012**. Addendum:
  **Sprint 7** (the one sprint board edited).
- **G2** — touched 0007 (pulled into Sprint 7). `0007 via 0006`; chain untouched → direct. Notes:
  **0007** (a producer edit). Way 1 moves: **0007** (back to the Backlog board). Addendum: **Sprint 7**.
- **G3** — touched 0013 and 0012 (both filed into Sprint 7 this run). `0013` is a direct record;
  `0012 via 0003` has an untouched chain (0003, 0002, 0001) → 0012 also counts as direct, still shown
  as "waits through 0003". Notes: **0013 and 0012** (both created this run — inside the skill's write
  surface). Way 1 moves: **0013 and 0012**. Addendum: **Sprint 7**, one line (one board). 0001's wait
  predates the run: never noted, never moved.
- Not in a fixture, by the wording: a decomposition chain (0014 filed behind touched 0013) keeps 0014
  behind 0013 — it is named "waits through 0013", not noted or moved on its own.

### Round-4 checks
- Fresh scratch copy of the repo; the edited files were byte-identical to the live ones. No full run
  was in progress (checked first). `coordination-citation-policy` + `reference-integrity`: 44 pass /
  0 fail. `npm run test:unit`: 1096 pass / 0 fail. No full `npm test` — the driver's joint re-verify
  covers it, per the ruling.
- `claude/structure-manifest.tsv` sha256 unchanged (`46743be2…`). This round edited only SKILL.md (one
  clause), review.md (Coder response row R12 and the `Status:` line) and this worklog.
- Ledger set to `Status: closed-out`, citing the owner's ruling: R1–R12 are all done, and the ruling
  calls for no further review round.
