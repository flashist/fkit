# Review — 0103-implement-task-folder-name-scheme-change

Task: `ai-agents/tasks/backlog/0103-implement-task-folder-name-scheme-change/brief.md`
File(s) under review: `claude/skills/fkit-status/dashboard.sh` · `claude/skills/fkit-status/SKILL.md` ·
`claude/skills/fkit-task-brief/SKILL.md` · `test/dashboard-contract.test.js` ·
`ai-agents/sprints/sprint-2.md` · `ai-agents/sprints/backlog.md` ·
`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` (new, dual-homed) ·
`ai-agents/knowledge-base/conventions/README.md` (+ both scaffold twins) ·
`ai-agents/tasks/backlog/0103-…/plan.md`, `worklog.md`
Status: in-review

Reviewers, round 1: **fkit-reviewer (Claude)** + **Codex adversarial pass** (`codex-cli 0.145.0`,
exit 0) — **full model-diverse coverage, not degraded.** Codex's own test run was blocked by its
read-only sandbox (`mkdtemp` EPERM); the reviewer executed the suite and the red-proof independently,
so behavioral evidence is complete.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md:6` (and the byte-identical scaffold twin) | The page uses bare `ADR-029` / report citations by owner ruling, but carries **no note saying so**. The only warning lives in `worklog.md:306-307` — a task-folder artifact that archives with the task. The page's one surviving *link* (`task-status-vocabulary.md`) makes the bare citations read as an oversight, so a future author "fixes" them and either ships dead links into every scaffolded project or breaks dual-home byte-parity. Raised **independently by both reviewers**. |
| R2 | 1     | medium | `ai-agents/tasks/backlog/0103-implement-task-folder-name-scheme-change/plan.md:47` | `plan.md` is frozen at phase 1: it documents steps 1, 3, 5, 2a only, while its own step order lists `0 → 1 → 3 → 5 → 2a → 2b → 6 → 4 → 7 → 8`. Steps 2b, 4, 6, 7 and 8 have **no plan text on disk**. The worklog then cites *"Plan §10's prescribed replacement text"* (`worklog.md:229`) and *"the plan's `:294`"* (`:243`) — **neither exists in `plan.md`**. The owner-ratified wording deviation (`"was the Priority number"` → `"was the board's rank number"`) therefore cannot be verified by an absent auditor: the conflict, the prescribed text, and the "three words only" scope are all unrecorded. |
| R3 | 1     | low    | `ai-agents/knowledge-base/conventions/status-report-format.md:47` (and `claude/scaffold/…/status-report-format.md:49`) | A **dual-homed convention shipped to every project** still states `\| **#** \| Priority number, matching the sprint plan. \|` and `\| **Filename** \| The brief's filename, linked to its path \|`. Both are now false: the `#` cell renders `P<n>` and the Filename label is the **folder name** on 130/130 sprint-2 rows and 16/16 backlog rows after this task's normalisation. Same narration class as §8 item 4, in the sibling file of the new convention page. The author's E11 grep was scoped to `fkit-status/SKILL.md` alone, so it could not catch this. |
| R4 | 1     | low    | `claude/skills/fkit-status/SKILL.md:299` | The block asserts *"The **Priority cell is mutable board rank and is never the id**"* and then, at `:310`, *"Two fallbacks survive … the **priority number**"*. The first sentence is unconditionally false as written — ladder arm 2 (`dashboard.sh:581`) does emit the priority as the id. A maintainer reading `:299` literally could delete arm 2 as contradictory dead code. Raised by **Codex**. |
| R5 | 1     | low    | `ai-agents/tasks/backlog/0103-implement-task-folder-name-scheme-change/worklog.md:187` | The worklog records **results but not the instruments**: the awk admission-window program, the label-normalisation regex, and the exact commands are all absent, and Proof C's baseline was *"my own pre-edit copy"* which no longer exists. Every substantive claim was independently re-proved by this review (see below), so this is an auditability gap rather than a correctness one — **except** the claim *"mirroring `extract_rows`' grammar"*, which is unverifiable because the program is gone. Raised by **Codex**. |

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

Round 1 processed 2026-07-27. **Every finding was verified against the actual files before any edit**
— all five confirmed accurate as written. **Zero code defects**: R1/R3/R4 are narration, R2 is the
record, R5 is auditability. No finding was disputed, and none re-litigates a settled decision.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect (documentation) | Added a `⚠️` note to the page's Provenance section stating the bare citations are deliberate, why (dual-home byte-parity vs never-synced `decisions/`/`reports/`), the 2026-07-27 owner ruling, and the test to apply before adding any link. Applied to **both homes**; byte-identity re-proved (SHA-256 `340ab5cb…`). | **Fixed** |
| R2 | **CORRECT** | Defect (record / ADR-032 A2) | Back-filled `plan.md` with steps **0, 2b, 6, 4, 7, 8** under an explicit *"BACK-FILLED 2026-07-27"* banner marking what was added and when, reconstructed from the owner-approved plan carried verbatim in the phase-1 prompt. Records §10's prescribed text **verbatim**, the E11 conflict, the three-word scope, and the owner's 2026-07-27 ratification — plus the **second** departure (R4). Line-number mismatch fixed: the approved plan's `:294` vs the actual `:287` are **both** recorded, and `worklog.md:229,244` now cite the back-filled sections explicitly. | **Fixed** |
| R3 | **CORRECT** | Defect (documentation, shipped to every project) | Rewrote the `#` and `Filename` rows of `status-report-format.md`'s board-columns table in **both homes**, identically. `#` = the Priority cell rendered verbatim (`P<n>` / `—`), rank not identity; `Filename` = the **task-folder name**, not `brief.md`. Table rows byte-identical across homes; the **pre-existing header divergence was NOT reconciled** (task 0132/0133) and is byte-for-byte unchanged. | **Fixed** |
| R4 | **CORRECT** | Defect (documentation) | `SKILL.md:301` no longer says the Priority cell *"is never the id"*. It now reads *"mutable board rank, **not identity** — it is never what a task is, and it keys a record only as the fallback described below, when the href yields no folder ID."* Intent preserved, contradiction with ladder arm 2 (`dashboard.sh:581`) removed, and trap A's `grep 'Priority number'` end-state stays clean. | **Fixed** |
| R5 | **CORRECT** | Frontier (auditability, not correctness) | **Accepted as residual on the owner's ruling — instruments deliberately NOT back-filled.** Recorded below with the one claim a future reader cannot re-run from the record alone. | **Accepted residual** |

## Accepted residuals (shared, do-not-re-litigate)

- **Bare citations in `priority-is-rank-not-identity.md`** — What: the page cites `ADR-029` and the
  decision report as plain text, not links, in both homes · Why (structural):
  `dual-home-parity.md:41` requires `knowledge-base/conventions/*.md` byte-identical while `:47`
  classifies `knowledge-base/{decisions,reports}/` **⛔ never-sync** and `.gitkeep`-only, so any
  byte-identical convention linking an ADR is guaranteed dead in every scaffolded project; owner ruled
  **Option A** on 2026-07-27; precedent `task-owner-vocabulary.md` already cites bare · Re-raise only
  if: the scaffold begins shipping `decisions/`/`reports/` content, or `dual-home-parity.md` drops the
  byte-identical requirement for conventions. **R1 is not this — R1 asks only that the page say so.**
- **`sprints/done/sprint-1.md` keeps bare integer priorities** — What: byte-untouched, 14 rows keep
  bare integers while live sprint boards render `P<n>` · Why (structural): owner ruling D1
  (2026-07-26); a closed plan's claims stay byte-identical, and the new convention's *"What NOT to
  rewrite"* records it · Re-raise only if: a closed plan is reopened for editing on other grounds.
- **`P<n>` is the rank token** — What: `P103`, not `#103` / `rank 103` / dropping the integer · Why
  (structural): owner ruling D4 (2026-07-26); report §11 recommended it as the confirmed
  parser-compatible minimal form · Re-raise only if: `P<n>` is shown to break a live parser.
- **Movers are *indifferent* to the Priority cell, not *verified compatible* with `P<n>`** — What: the
  producer's literal `/fkit-task-done` + `/fkit-task-cancelled` run passed because neither mover parses
  column 2 at all · Why (structural): recorded loudly and correctly at `worklog.md:164-168` with three
  named unreached edges (git-tree assumption, no repo-root guard, ADR-018 deny path untested) · Re-raise
  only if: a mover gains a parse of the Priority column.
- **The step-2b/step-6 instruments are not recorded, only their results** — What: `worklog.md` records
  the outcomes of the awk admission-window pass and the label-normalisation regex, but not the programs
  themselves, nor the exact commands; Proof C's baseline was the coder's own pre-edit copies under
  `/tmp`, which no longer exist · Why (owner ruling 2026-07-27, review R5): **every substantive claim
  was independently re-executed by the reviewer** and cleared, so this is an auditability gap, not a
  correctness one; back-filling instruments after the fact would be reconstruction presented as
  evidence · **What a future reader genuinely cannot re-run from the record alone:** the claim that the
  awk window *"mirrors `extract_rows`' grammar"* — the program is gone, so that specific equivalence is
  unverifiable from the artifacts, though the reviewer confirmed the **window itself** (separator at
  `sprint-2.md:32`, rows 33-162, close at 163) matches `extract_rows` · Re-raise only if: the board
  files need re-normalising and the same transform must be reproduced, or a defect is traced to the
  window's bounds.
- **No `test/dual-home-parity.test.js` and no link-checking test** — What: the new page's byte-parity
  and every link are held by manual verification, not by a test · Why (structural): the parity test is
  **task 0133**, gated behind **task 0132**; out of this task's scope by the brief · Re-raise only if:
  0132/0133 ship and the coverage is still absent. **Rot risk noted once; not this task's defect.**

## Independently verified — cleared, do not chase

Recorded so the coder is not asked to re-derive them. Every item below was executed by this review,
not read off the worklog.

- **The numeric-only guard is sufficient.** `folder_id_prefix()` (`dashboard.sh:498-503`) rejects
  `0042 alpha` (space), `""`, `-foo`, `backlog`, `extract` and admits `0042`, `0102-decide-…`. `LC_ALL=C`
  makes `[!0-9]` safe; `case` subjects are not glob-expanded, so `set -f` is orthogonal.
- **All four ladder arms are correct and arm 3 is live, not dead.** The `:1743` fixture's third row
  (`raw name` → `raw-name`) reaches arm 3 and exercises the sanitiser for real.
- **No new id collisions.** sprint-2's 130 board rows resolve to **130 distinct folders**, all 4-digit
  prefixed, zero duplicates. Leading zeros do not defeat `sort -n | uniq`: byte-identical ids still
  collapse, distinct ids survive.
- **The red-proof is genuine and two-directional.** Reverting the ladder **in an isolated copy** (source
  untouched) reds **50 tests**, including 3 of the 5 task-0103 tests under a minimal arm-swap; the
  author's *4 of 5* is consistent with the fuller revert he describes (restoring the old folder-**name**
  fallback also reds the `—`-priority test). Leg 2 — *hold the folder, move the priority*, plus
  `doesNotMatch(/drift nonconformance 9 /)` — is the decisive arm and it reds. **Not satisfiable by
  coincidence.** The 5th test staying green is correctly disclosed and correctly explained.
- **Widening `:1735` to `drift (nonconformance|missing-brief)` did NOT weaken it.** The count assertion
  is still exact (3), the safe-token regex still applies to every id, the roll-up count is still exact,
  and a new load-bearing assertion (`ids.includes('raw-name')`) can only pass if arm 3's sed ran.
  **Strictly stronger than before.** `:1634` and `:1691` are correct re-points, squarely inside §8 item 3.
- **The awk admission window agrees with `extract_rows`.** Separator at `sprint-2.md:32`, rows 33-162,
  window closes at the blank line 163 — exactly `extract_rows`'s grammar. All 130 changes are confined
  to 33-162; the re-rank rationale tables at 164+ and 254+ are untouched; the only other diff hunk
  (`:257`) is the pre-existing out-of-scope 0119 path fix.
- **The label normalisation never rebuilds an href.** All 133 sprint-2 and 16 backlog link targets are
  byte-identical against `HEAD`, sole exception the out-of-scope 0119 `backlog/`→`done/` move.
  Label == its own href's folder segment on **130/130** and **16/16** rows. Column-level diff of the 130
  rewritten rows: only column 2 (Priority, all exactly `n`→`P<n>`) and column 4 (Brief, 86 rows)
  changed; the Task-description column changed on **zero** rows. The two Status-cell changes are the
  0119 close and 0103's own row, neither from the rewriter.
- **`P<n>` is inert to the parser and rendered verbatim.** `task_id("P103")` → `103`;
  `BOARD_ROWS` (`:868`) emits `${pr}` untouched, so the `#` column reads `P104`. `dashboard.sh` on
  sprint-2 and backlog: exit 0, `⟦fkit-dashboard v1⟧`, **zero drift**.
- **Byte-parity of the dual-homed page holds today.** `diff` empty; SHA-256
  `d1f756af928dc919d17a4e7ae0527f68c2be771a5e91090af81085a773bb9fb3` on both copies — matching the
  worklog's claim. `task-status-vocabulary.md` resolves in both trees. Both new SKILL.md links resolve.
- **The `.claude/` mirror is in sync** for all three touched files — no false-green hazard.
- **`node --test test/dashboard-contract.test.js`: 109/109 pass, 0 fail.**
- **The mover qualifier is recorded honestly** — `worklog.md:164-168` states the movers are
  *"**indifferent** to the cell's content, not **compatible** with the new token"* and *"would step over
  `P42`, `42`, `banana`, or an empty cell alike"*, with three named unreached edges. Exemplary; the
  opposite of the failure mode the brief asked about.

## Re-litigates settled decisions (suppressed)

None. No round-1 finding matches an accepted residual or an ADR re-raise condition.
