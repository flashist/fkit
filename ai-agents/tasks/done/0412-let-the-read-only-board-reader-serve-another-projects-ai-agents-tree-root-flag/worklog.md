# Worklog — `0412` Let the read-only board reader serve another project's `ai-agents/` tree

## 2026-09-23 — plan written (plan-only spawn, no source touched)

> **Who wrote this.** A spawned `fkit-coder`, plan-only, driven by `fkit-lead`. No owner channel
> (ADR-021). Wrote only `plan.md` and this file.

**Grounding done (read-only):**
- Read `bin/fkit-board.mjs`, `test/board-reader.test.js`, README board section, 0411's review ledger
  (accepted residuals R10 + the no-`Host`-check residual). Wiki has no page on the reader.
- Snapshot of fkit's own tree via the exported library: 412 tasks, 11 boards, `problems: []`, **zero
  board-id collisions**.
- Scratch fixture (in the session scratchpad, deleted after) with `backlog.md` + `sprint-backlog.md`
  both headed `Backlog`: both map to id `BACKLOG`, `/api/check`-equivalent `problems` is empty — the
  collision is silent today. Reproduces the sibling project's shape.
- ⚠️ **Found in the same probe:** with a **relative** dashboard path the reader failed on the fixture
  (every open board "no candidate record"), because `dashboard.sh` is spawned with `cwd: root`. On a
  target that has its own copy at the same relative path, it would silently run **the target's**
  copy. Plan §3.1 forces an absolute path from fkit's own checkout; test R4 pins it.

**Decisions in the plan (for the gate):**
- `FKIT_BOARD_ROOT` not built (lead left it to the plan; reasons in plan §3.4).
- Collision reported as a new `warnings` array on `/api/check`; `ok` unchanged — offered at the gate
  as the one open question.
- 0411's residual R10 ("re-raise only if a live collision appears"): condition met on the sibling
  project; owner ruling 2 (2026-09-23) is its disposition — warn, don't merge. 0411's closed ledger is
  not edited.

**Decision log (unattended fixes / obvious-winner calls):** none — plan only.

## 2026-09-23 — built + verified (spawned `fkit-coder`, driven by `fkit-lead`)

> **Who wrote this.** A spawned `fkit-coder`, BUILD + VERIFY per the approved `plan.md`. Owner rulings
> relayed by the lead (selected option text, not the owner's prose): *"Approve"* (the plan as
> written); `/api/check` collision shape *"Separate 'warnings' list"*. No owner channel here (ADR-021).
> Nothing committed; task folder not moved; no sprint board edited.

**What changed (plan §4 order, suite run after each step):**
1. `bin/fkit-board.mjs` — new export `resolveRoot({ flag, home })` (isDirectory checks; names every
   missing piece; `code = 'ROOT_UNRESOLVED'`; never falls back). `main()`: refuses `--root=<x>` and a
   trailing `--root`; `home = findRoot()`; dashboard is **always `resolve(findDashboard(home))`**;
   aiboard's sibling default resolves from `home`; probe / `--bench` / server read `root`. Banner and
   `--bench` add `tree … (--root)` + `status … (fkit's own …)` only under `--root`; a `note` line only
   when the target carries a `dashboard.sh` of its own (existsSync — a stat, no read) that is not the
   same file. Header comment: the "tools from home, data from root" rule.
   → existing `board-reader.test.js` 16/16; no-flag banner identical to the pre-change capture except
   the random port; `--bench` output shape identical.
2. Collision warning in `readBoards()` → `warnings` on the snapshot cache, `reader.warnings()`, and
   `/api/check` = `{ ok, problems, warnings }`; `ok` unchanged in meaning. fkit's own tree:
   `warnings: []`, `problems: []`. → `board-reader.test.js` 16/16.
3. `test/board-root.test.js` (new) — R1, R2, R3, R4/R8, R6, R7 (R5 covered by R4, as planned).
   6/6 green. **Mutation check** (each applied then restored; restore confirmed with `cmp`):
   dashboard from target root → R2 + R4 red; `--root=` guard removed → R3 red; warnings disabled →
   R6 red; bad root allowed to pass → R3 red.
4. `README.md` — `--root` usage lines (placeholder `<other-project>`), a paragraph on validation /
   relative paths, the dashboard line, `warnings`, the ADR-051-trial caveat. Diff grep for `/Users/`,
   `/home/`, `C:\` and the sibling's name: none.

**Budget checks held:** `spawnSync(` count still 2; `node:fs` import list unchanged; no `import(` /
`require(`; test C (whole-file banner-token + structural grep) green.

**Full `npm test`:** exit 0. Unit phase 1009 tests, 1009 pass, 0 fail, 0 skipped; `prove-red.sh`:
40 mutations, each red on its named assertion — "hard gate PASSED".

**Manual check on the sibling fkit-using project (read-only; path in no artifact):**
- `--bench --root <sibling>`: `corpus: 290 tasks, 12 boards`. Lead's 2026-09-23 figure was 289: the
  sibling has one **untracked** task folder (`0297`) whose brief was written late on 2026-09-23 —
  most likely created after the lead's count. Not proven, stated as likely.
- Short-lived server on a free non-default port, then stopped (port confirmed released): banner shows
  `tree … (--root)`, fkit's own `status`, and the `note` line (the sibling carries its own copy).
  `/api/check`: `ok: true`, 0 problems, 1 warning —
  `board id BACKLOG is claimed by 2 files (backlog.md, sprint-backlog.md) …`. `/api/board`: 290
  tasks / 12 boards. `POST /api/board` → 405.
- Sibling's `git status --porcelain` hash identical before and after the server run; a second
  `--bench` run bracketed by a byte-level hash of every file under its `ai-agents/`: identical.
- Snapshot time: first `--bench` ran while `npm test` loaded the machine (3.8–7.6 s — not
  representative); re-run idle: **246–257 ms full recompute, ~2 ms cache hit** — matches the lead's
  ~250 ms. (Payload grew 180 bytes between the two runs: the sibling's tree was being edited by
  someone else meanwhile — not by the reader, per the byte-level hash.)
- Board statuses on the sibling with fkit's current dashboard: `plan-sprint-4` In progress,
  `plan-sprint-5`/`-6` Backlog, archived boards Done, `backlog.md` / `sprint-backlog.md` /
  `plan-index.md` unresolved. (The brief expected open sprints to read `unresolved`; with this
  dashboard they resolve. This is *this* fkit's reading — ruling 1.)

**Deviations from plan.md:**
- Size only: `bin/fkit-board.mjs` is +116/−9 (plan guessed ~+50) — mostly comments and banner text.
- `note` line additionally suppressed when the target's copy *is* fkit's own file (i.e. `--root`
  pointed at fkit itself) — otherwise the note would claim a copy "is NOT used" when it is the one
  in use. Within the plan's intent; recorded here as an obvious-winner call.

**Decision log (unattended fixes / obvious-winner calls):**
- Obvious-winner: `note` suppressed when target copy === fkit's own dashboard (above). Qualifies:
  one condition, no behaviour change on any real foreign tree, keeps the banner truthful.
- Unattended review fixes: none (no review yet).

## 2026-09-23 — review round 1 processed (spawned `fkit-coder`, driven by `fkit-lead`)

> **Who wrote this.** A spawned `fkit-coder` running `/fkit-process-stateful-review` on `review.md`
> round 1 (R1–R6). Driven by `fkit-lead` as conductor — **not** `fkit-sprint-ship-loop`. No owner
> channel (ADR-021). Nothing committed; task folder not moved; no board edited; the other task's
> uncommitted files (0405, `bin/board-narrow.mjs`, `test/board-narrow.test.js`) not touched.

**Owner rulings relied on** (2026-09-23, live `AskUserQuestion` in the lead's session, relayed by the
lead — ⚠️ selected option text, not the owner's prose): R1 *"Fix: refuse >1 --root"*; R3 + R4 *"Add in
this round"* (test-only); R5 *"Separate backlog task"* (no `cacheKey` change); R2 / R6 relayed as plain
test fixes with no owner objection (lead's relay, not an owner ruling in its own words).

**What changed:**
- `bin/fkit-board.mjs` `main()` — a second `--root` exits 2 (*"--root given more than once …"*),
  checked before the `--root=` and trailing-`--root` guards. (R1)
- `test/board-root.test.js` — R3 gains `--root A --root B`, `--root A --root`, and `ai-agents/tasks`
  as a FILE (R1, R4c); the fake `dashboard.sh` leaves a sentinel and R4 asserts it absent after
  `--bench` and after serving (R3); R6's tautology replaced by `ok === true` + `problems` deep-equals
  `[]` (R2); R1 counts only `NNNN-` directories holding a `brief.md` (R6); two new tests — aiboard's
  sibling default resolves beside fkit's checkout, never beside the target (R4a), and a relative
  `--root` is resolved (R4b). `makeFixture` gained a `dir` option for the first.
- R5: no change (owner ruling) — deferred to a follow-up task, filed separately.

**Verification:**
- `node --test test/board-root.test.js`: 8/8 pass.
- Mutation probes (each applied to the reader, then restored; restore confirmed with `cmp`):
  duplicate-`--root` guard removed → R3 red; target's copy run first then fall back → R4/R8 red
  (sentinel); aiboard default from target → R9a red; `resolve()` dropped on `--root` → R9b red;
  `!== 'dir'` → `=== 'missing'` → R3 red; collision pushed into `problems` under other wording → R6 red.
  6/6 caught.
- Full `npm test`: unit phase 1011 tests, 1011 pass, 0 fail, 0 skipped (1009 before + 2 new).
  `prove-red.sh`: 40 mutations, each red on its named assertion — "hard gate PASSED". `npm test` exit 0.

**Decision log (unattended fixes / obvious-winner calls):**
- **Collision recorded (ADR-037 §2) — COMPLY AND FLAG.** Rule departed from: `fkit-coder.md`'s refusal
  of a spawned "implement" outside `/fkit-task-ship-loop` / `/fkit-sprint-ship-loop`, and the skill's
  "explicit approval in this turn" fix gate. Instruction followed: the lead's spawn, which names owner
  rulings (what, when, on what — the fix set above). Authority: ADR-037 §1 (a named owner ruling
  displaces a skill rule) + ADR-031 Decision 3 (conductor spawns the coder to implement after owner
  approval). Departed: yes.
- Fixes applied under that relayed approval, each verified `CORRECT` against the code first:
  R1 — `arg()` returns the first `--root`, trailing check keyed on it; fix is one guard, in the
  approved set. R2 — assertion restated the server's expression; test-only. R3 — fake had no side
  effect; test-only. R4 — three survivors confirmed by mutation; test-only. R6 — test counted names,
  reader counts dirs with a brief; test-only.
- Obvious-winner calls: none beyond the approved set. `makeFixture({ dir })` is test scaffolding for
  R4a, not a behaviour change.
- ⚠️ **Flag, not resolved here:** ADR-045 routes an in-flight finding about a file under review to the
  ledger, not a new task. R5 cites `bin/fkit-board.mjs` (under review) but is pre-existing 0411 code;
  the owner ruled *"Separate backlog task"*. Owner ruling followed; noted so nobody reads the follow-up
  task as an ADR-045 breach unannounced.

## 2026-09-23 — review round 2 processed (spawned `fkit-coder`, driven by `fkit-lead`)

> **Who wrote this.** A spawned `fkit-coder` running `/fkit-process-stateful-review` on `review.md`
> round 2 (R7–R9). Driven by `fkit-lead` as conductor — **not** `fkit-sprint-ship-loop`. No owner
> channel (ADR-021). Nothing committed; task folder not moved; no board edited; 0405's files,
> `bin/board-narrow.mjs`, `test/board-narrow.test.js` and task 0413 not touched.

**Owner rulings relied on** (2026-09-23, live `AskUserQuestion` in the lead's session, relayed by the
lead — ⚠️ selected option text, not the owner's prose): R7 *"Fix: check it can be read"*; R9 *"Accept
as residual"*. R8: relayed by the lead as a plain test fix, no owner decision needed (lead's relay, not
an owner ruling in its own words).

**What changed:**
- `bin/fkit-board.mjs` `resolveRoot` — after the `missing:` checks pass, lists (`readdirSync`, already
  imported) `ai-agents/tasks/` + each task board it holds, and `ai-agents/sprints/` + `done/` /
  `cancelled/`; any failure → refused as `unreadable: <dir>/ (<code>)`, same "not a readable fkit
  project tree … does not fall back" message. (R7)
- `test/board-root.test.js` — new test *R3: an unreadable --root tree …* (chmod 000 on `tasks`,
  `tasks/backlog`, `sprints/done`; measures that chmod blocks reads first and skips if not, e.g. as
  root; restores mode in `finally`); header R3 line updated; `chmodSync` added to the test's import.
  R7 test restructured to one outer `finally` owning both temp dirs. (R7, R8)
- `review.md` — Coder response rows R7–R9, round-2 notes, R9 accepted residual.

**0411 contract held:** reader's `node:fs` import list unchanged (`existsSync, readFileSync,
readdirSync, statSync`); `spawnSync(` count still 2; `test/board-reader.test.js` untouched, 16/16.

**Verification:**
- Before the fix (scratch fixtures): `tasks/` mode 000 → `--bench --root` exit 0, empty corpus;
  `tasks/backlog/` mode 000 → `EACCES … scandir`, exit 1. After: both exit 2 naming the directory;
  mode restored → `corpus: 1 tasks, 1 boards`.
- `node --test test/board-root.test.js test/board-reader.test.js`: 25/25 pass, 0 skipped.
- Mutation probes on the reader (each applied in place, test run, restored, restore confirmed with
  `cmp`): tasks probe dropped → red (`ai-agents/tasks: exit 2`); child probes dropped → red
  (`ai-agents/tasks/backlog`); sprints probe dropped → red (`ai-agents/sprints/done`); `unreadable`
  left out of the refusal condition → red. 4/4 caught.
- R8 forced-red check (test edited in place, restored, `cmp`): failing assertion in the crawl, then in
  the byte comparison → `fkit-board-root-*` dirs in tmpdir 0 before, 0 after, both times.
- Full `npm test` (exit 0): unit 1012 tests, 1012 pass, 0 fail, 0 skipped (1011 + the new unreadable test); `prove-red.sh` 40 mutations, "hard gate PASSED". Unit phase re-run after the ledger/worklog edits: 1012/1012.

**Decision log (unattended fixes / obvious-winner calls):**
- **Collision recorded (ADR-037 §2) — COMPLY AND FLAG.** Rule departed from: `fkit-coder.md`'s refusal
  of a spawned "implement" outside `/fkit-task-ship-loop` / `/fkit-sprint-ship-loop`, and the skill's
  "explicit approval in this turn" fix gate. Instruction followed: the lead's spawn, which names the
  owner rulings above (what, when, on what). Authority: ADR-037 §1 + ADR-031 Decision 3. Departed: yes.
- R7 — verified `CORRECT` (both cases reproduced); fix is the approved "readability check" and stays in
  `resolveRoot`. R8 — verified `CORRECT` by reading; test-only.
- Obvious-winner calls: (1) probing the sprints subfolders too, not only the two reproduced task
  paths — same failure class (`listBoardFiles` does `existsSync` then `readdirSync`), inside "an
  unreadable tree is refused"; (2) side effect stated, not hidden: a `tasks/<board>` or
  `sprints/done|cancelled` that is a FILE is now refused as `(ENOTDIR)` — at HEAD it crashed the reader.
- Not done, stated: a directory with `r` but no `x` bit still passes (it lists); its entries are then
  dropped silently by the reader's per-entry `statSync`. Outside the approved fix; noted in `review.md`.

## 2026-09-23 — review round 3 processed (spawned `fkit-coder`, driven by `fkit-lead`)

> **Who wrote this.** A spawned `fkit-coder` running `/fkit-process-stateful-review` on `review.md`
> round 3 (R10, R11) plus the reviewer's README note. Driven by `fkit-lead` as conductor — **not**
> `fkit-sprint-ship-loop`. No owner channel (ADR-021). Nothing committed; task folder not moved; no
> board edited; 0405's files, `bin/board-narrow.mjs`, `test/board-narrow.test.js` and task 0413 not
> touched. No `.mjs` / `.js` changed.

**Owner rulings relied on** (2026-09-23, live `AskUserQuestion` in the lead's session, relayed by the
lead — ⚠️ selected option text, not the owner's prose): R10 *"Accept as residual — A rare permission
mistake, outside your 'check it can be read' ruling. Raise it again only if a real project hits it."*;
R11 *"Accept as residual — The code is correct for all 7, and the check is one loop over a list of
folders."*; README *"Yes — A one-line docs fix the coder makes before the task is closed, so the README
matches what the code does."*

**What changed:**
- `README.md`, board section, `--root` paragraph — one added sentence after *"never falls back to
  fkit's own tree"*: *"A tree whose boards cannot be read (a permission error) is refused the same way,
  naming the unreadable directory."* Matches `resolveRoot`'s `unreadable:` refusal (exit 2, names the
  dir, no fall-back).
- `review.md` — Coder response rows R10, R11 (both CORRECT, Frontier, `won't fix (frontier)`), round-3
  coder notes, Accepted residuals R10 and R11. Header `Status:` left `in-review` (README line not yet
  seen by the reviewer).

**Verification:** R10 and R11 verified by reading (probe = list only, per-entry `statSync` swallowed in
`listTaskDirs`; test `cases` = 3 of 7 dirs). Full `npm test` exit 0 — unit 1012/1012 pass, 0 fail, 0 skipped; `prove-red.sh` 40/40 red, "hard gate PASSED". Unit phase re-run after the ledger/worklog edits: 1012/1012.

**Decision log (unattended fixes / obvious-winner calls):**
- **Collision recorded (ADR-037 §2) — COMPLY AND FLAG.** Rule departed from: the skill's "explicit
  approval in this turn" gate — the approval here is the owner's rulings relayed by the lead's spawn
  (what, when, on what). Authority: ADR-037 §1 + ADR-031 Decision 3. Departed: yes.
- README line — answers the reviewer's round-3 note (not a row); owner-approved docs fix; one sentence.
- Obvious-winner calls: none. Unattended code fixes: none.
- Adding the R10/R11 Accepted residuals myself, not leaving them to the reviewer: the skill's Step 6
  has the coder record owner-confirmed tradeoffs; same as R9 in round 2.

## 2026-09-23 — close, by a spawned `fkit-producer` (no owner channel, ADR-021)

Closed via `/fkit-task-done` as **`✅ Done (agent-closed — not owner-verified)`** (ADR-033 §5), driven
by `fkit-lead`. **The owner has not personally verified the build.**

Evidence, read by this producer in `review.md` and this worklog (not taken on relay alone):
- **Review converged.** Ledger header `Status: closed-out`; phase-2 close-out paragraph reads *"No open
  finding … Ledger closed out."* ⚠️ The lead relayed a final verdict *"✅ Ready to merge"*; that string
  does **not** appear in `review.md` — it came from the reviewer's reply to the lead, not the ledger.
- **Coverage.** Both reviewers (Claude + Codex) measured through round 3. Phase 2 was a README-only
  check by the Claude reviewer alone, no Codex pass (per the skill's Step 6).
- **Findings.** R1–R4, R6–R8 fixed and verified. R9, R10, R11 accepted residuals (owner). **R5**
  (snapshot cache misses board-file renames — pre-existing `0411` code) **deferred to `0413`**, which
  depends on `0412`: 0412 closes with that known staleness in place.
- **Tests — the coder's run, not re-run by the reviewer in phase 2:** `npm test` exit 0, unit
  1012/1012, `prove-red.sh` 40/40. ⚠️ prove-red holds no board-reader mutations; the reviewer's own
  mutation probes (round 3: 7 probes, 5 caught, 2 survived → R11) are the only mutation evidence for
  this change.
- **Out of scope, pre-existing:** the startup `spawnSync` dashboard probe passes no timeout.
- **Owner rulings** throughout were given live via `AskUserQuestion` in the lead's session, 2026-09-23
  — ⚠️ selected option text, not the owner's prose.
- **Manual step 3** (brief's verification) — run by the **coder**, not the owner: `--root <sibling>`
  served 290 tasks / 12 boards vs the lead's 289 (one untracked sibling task folder, likely created
  later — stated as likely, not proven); sibling tree byte-identical before/after; `POST` → 405.

Move note: the folder was **untracked** (never committed), so it was moved with plain `mv`, not
`git mv` — no history to keep. Nothing committed.
