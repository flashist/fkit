# Plan — `0415` Keep a closed sprint's tasks attached when its board is named `plan-sprint-N.md`

> **Provenance.** Written by a spawned `fkit-coder` on 2026-09-26: a **plan-only** spawn from
> `fkit-lead`, with no owner channel (ADR-021). No source or tests were written. This file and a
> `worklog.md` entry are the only writes. **Not approved yet.** The owner approves the plan in the
> lead's session.
>
> **Owner ruling that started it** (2026-09-26, live `AskUserQuestion` in the lead session; ⚠️ this
> is the **selected option text, not the owner's own prose**): *"Yes, I drive it now — Producer writes
> a brief, the coder plans, you approve the plan here, then build, review and close, like 0412. Small
> change to fkit's board reader; geoconflict isn't touched."*

## Summary

- **Small, as the brief hoped.** One line of real logic in `bin/fkit-board.mjs` (`boardIdFromFile()`),
  plus a short comment and **one new test file**. No new subprocess, no new file read, no new export,
  and the snapshot shape does not change.
- **Recommendation: (a), the file-name prefix.** Treat `plan-sprint-N.md` like `sprint-N.md`. This is
  **the same rule `dashboard.sh` already uses** for file names: its allowlist has exactly one entry,
  `plan-`, under ADR-040 §3.
- **(b), parsing the H1 heading: rejected.** It would be a second copy of the sprint-identity grammar
  (ADR-040 §2), which ADR-041 §5 says must have only one implementation, in `dashboard.sh`. The brief
  says the "one grammar" rule covers only status banners; ADR-041 §5 applies the same rule to
  identity.
- **(c), asking `dashboard.sh` for archived boards too: offered, not recommended.** It is the most
  correct option, but it costs about 270–320 ms more per full re-read (measured). That is roughly 3–4×
  today's 116 ms on fkit's own tree.
- **Simulated (a) on both trees (read-only, from a scratch script).** Sibling project: S-004 gets its
  **110 tasks (105 done, 5 cancelled)**, S-4b gets 4 and S-4c gets 8. S-001/S-002/S-003 get **0**,
  because **no brief in that project names Sprint 1, 2 or 3**. fkit's own tree: **every id
  unchanged**, 0 unattached tasks, 0 collisions.
- **A fourth oddity turned up that the brief does not list:** **12 sibling tasks** have the sprint
  value `Sprint backlog — …` (lowercase `b`). They map to `S-backlog`, which no board has. Classified
  **out of scope** (§5), and flagged as a decision.
- **aiboard does show Done sprints.** Nothing hides them. Where to look: §7.

---

## 1. What exists today (read, not assumed)

- `bin/fkit-board.mjs:218`:
  ```js
  function boardIdFromFile(file) {
    const stem = basename(file, '.md');
    if (stem === 'backlog') return 'BACKLOG';
    return boardId(stem.replace(/^sprint-/, 'Sprint ')) || `S-${stem}`;
  }
  ```
  `readBoards()` (`:367`) calls it for **every archived board**, and for any **open** board that
  `dashboard.sh` gave no identity:
  `const id = (identity && boardId(identity)) || boardIdFromFile(f.name);`
- **`dashboard.sh`'s own identity ladder** (`claude/skills/fkit-status/dashboard.sh:98-190`):
  1. an H1 segment (ADR-040 §2);
  2. else the file-name rung `^(plan-)?sprint-(N[a-z]?)$` (ADR-040 §3, owner-ruled 2026-08-10:
     *"Include `plan-`"*);
  3. else `backlog.md` → `Backlog`.

  So **open** `plan-sprint-5.md` already resolves to `Sprint 5` → `S-005`. Only the reader's fallback
  for **archived** boards lacks `plan-`. That gap is the whole bug.
- **Identities measured read-only** (`dashboard.sh identity <file>`) against each board's H1 and file
  name:

  | Tree | Boards | H1 and file name agree? |
  |---|---|---|
  | fkit | 11 (9 archived `sprint-N.md`, `sprint-11.md`, `backlog.md`) | yes, all 11 |
  | sibling | 12 (`plan-sprint-1..4c`, `plan-sprint-5/6`, `backlog.md`, `sprint-backlog.md`, `plan-index.md`, `done/hotfix-post-sprint2.md`) | yes wherever either one resolves; `plan-index` and `hotfix-post-sprint2` resolve to nothing on both rungs |

- **Baseline reader output over the sibling tree** (exported `makeReader`, read-only). Seven archived
  boards all carry `S-<stem>` ids with 0 tasks each. The unattached tasks are:

  | Sprint id | Tasks | Why |
  |---|---|---|
  | `S-004` | 110 | the bug |
  | `S-4c` | 8 | the bug |
  | `S-4b` | 4 | the bug |
  | `S-backlog` | 12 | the oddity in §5 |
  | `S-3.` | 1 | the oddity in §5 |
  | none (`null`) | 59 | 58 briefs have no `## Sprint` field; 1 has a value with no sprint in it |

  `/api/check` gives one warning, the existing `BACKLOG` one (`backlog.md` + `sprint-backlog.md`).
- **The 0411 source-grep contract** (`test/board-reader.test.js`, assertions C and E2). It bans three
  banner markers, the blockquoted-heading prefix and the in-progress literal. It also bans three
  structural regexes (a `[…]` class holding both `>` and `#`, `lines[2]`, `split('\n')[2]`). It
  pins the `node:fs` import list and requires exactly two `spawnSync(` call sites. **(a) touches
  none of these.** The new regex holds no `>` or `#`, and the new comment will quote no banned token.

## 2. The derivation choice — (a), and why

**In plain words for the owner.** A closed sprint's board gets its name tag from its **file name**.
Today the reader knows `sprint-4.md` means "Sprint 4" but not `plan-sprint-4.md`, which is your other
project's older naming. The fix teaches it that one extra prefix. That is exactly the one extra prefix
fkit's status tool already accepts, so the board keeps the tag it had while it was open.

| | (a) File-name prefix **(Rec)** | (b) Read the H1 heading | (c) Ask `dashboard.sh` for archived boards too |
|---|---|---|---|
| Change | `/^sprint-/` → `/^(?:plan-)?sprint-/`, 1 line | new H1 segment parser in the reader | call the existing `selectActive()` on `sprints/done/` and `sprints/cancelled/` too |
| Matches what the board had while open? | yes, whenever H1 and file name agree (true for all 23 real boards measured) | yes, but only if the parser is a faithful copy | **yes, always**: the very same code |
| One-grammar rule (ADR-041 §5) | extends the reader's existing small copy of the file-name rung by one prefix; that copy stays in step with `dashboard.sh`'s one-entry allowlist | ❌ a **second implementation** of ADR-040 §2's segment grammar (split on `—`, `–`, `:`, ` - `, and treat `Sprint Backlog` as `Backlog`), which is exactly what §5 forbids | ✅ no copy at all |
| Cost per full re-read | 0 | about 0 | **+270–320 ms** (measured `select-active` on each archive dir; fkit's full re-read is 116 ms today) |
| New subprocess? | no | no | yes, 1–2 more runs (still two `spawnSync(` call sites, so E2 stays green) |
| Risk to fkit's own output | none (no `plan-` board in fkit's tree) | parser drift | README/0411 "one subprocess per snapshot" design changes |

**What (b)/(c) would catch that (a) does not.** An archived board whose **heading and file name
disagree**. Examples: `hotfix.md` headed `… — Sprint 7`, or `sprint-4.md` headed `… — Sprint 4b`.
While such a board is open, `dashboard.sh` goes by the heading. Once it is archived, (a) goes by the
file name, so its id would **change on close**, which is the same symptom as this bug. **Measured
occurrence: zero** in both trees. If it ever happens, it usually shows up the way this bug did: a
board with 0 tasks, and tasks whose sprint id has no board. If another board already owns the
file-name id, the 0412 collision warning fires. It is not guaranteed to be loud in every case.

**Why not (c) now.** It is the principled end state. But it multiplies by 3–4 the cost of a full
re-read, and it changes a design point that 0411 recorded deliberately: "no extra subprocess is spent"
on archived boards. The brief asks for small. Offered as a follow-up in NEEDS-DECISION 1.

**A detail of (a), my call.** `plan-` is stripped only when `sprint-` follows it. So `plan-index.md`
stays `S-plan-index`, and any stem that is not a sprint keeps `S-<stem>` exactly as today. After the
prefix, the reader is **exactly as loose as it already is for `sprint-`**: for example,
`plan-sprint-4-old.md` → `S-4-old`. Tightening both to `dashboard.sh`'s `N[a-z]?` grammar would
change fkit's existing behaviour for `sprint-` stems, which is out of scope.

## 3. Behaviour after the change

| File (in `sprints/done/` or `sprints/cancelled/`) | Before | After |
|---|---|---|
| `plan-sprint-4.md` | `S-plan-sprint-4` | **`S-004`** |
| `plan-sprint-4b.md` | `S-plan-sprint-4b` | **`S-4b`** |
| `sprint-4.md` | `S-004` | `S-004` (unchanged) |
| `backlog.md` | `BACKLOG` | `BACKLOG` (unchanged) |
| `plan-index.md`, `hotfix-post-sprint2.md` | `S-<stem>` | `S-<stem>` (unchanged) |

- Open boards are untouched whenever `dashboard.sh` resolves them, which it always does for
  `plan-sprint-N`. The only open-board effect is in the **fallback** path, when `dashboard.sh`'s
  answer is unusable (the marker is missing, it cannot be run, or there is no candidate record). In
  that case an open `plan-sprint-5.md` now falls back to `S-005` instead of `S-plan-sprint-5`, which
  is the correct direction. The status still shows `unresolved` as before.
- **Collisions.** 0412's `/api/check` warning already groups every board by id. An archived
  `done/plan-sprint-4.md` next to an open `sprint-4.md` now **both claim `S-004`**, and that is
  **warned, not merged**, by the existing code, with no change to it. A test pins it (T5). Neither
  real tree has such a pair: the sibling's ids after the fix contain only the existing `BACKLOG`
  duplicate, and fkit's contain no duplicate.

## 4. Changes, file by file

### 4.1 `bin/fkit-board.mjs`, `boardIdFromFile()` only

```js
return boardId(stem.replace(/^(?:plan-)?sprint-/, 'Sprint ')) || `S-${stem}`;
```

Add a 3–4 line comment saying:
- `plan-sprint-N.md` is an older board-naming convention;
- `dashboard.sh`'s file-name rung accepts exactly this one prefix (ADR-040 §3);
- so an archived board keeps the id it had while open;
- the H1 is deliberately not read here (ADR-041 §5, one identity grammar).

The comment must avoid every token test C bans; it quotes no banner text. **Nothing else in the file
changes.** No `cacheKey()` edit (0413's function), no import change, no new `spawnSync(`.

### 4.2 `test/board-archived-id.test.js` (new)

This is a new file rather than an addition to 0411's contract file or 0412's `--root` file. Both of
those have a header scope statement that this would break. The rules:
- same law as the rest of the suite: `node --test`, zero devDependencies (ADR-014);
- **temp-dir fixtures only** (`os.tmpdir()`): never the sibling project, never fkit's live tree
  changed, no machine path in the file;
- driven through the exported `makeReader`, plus `startServer` on port 0 for `/api/check`, the same
  pattern as 0412's `checkOf`. That makes it black-box: `boardIdFromFile` stays private.
- fixture briefs use sibling-shaped values such as `Sprint 4 — note`, `Sprint 4b — note` and
  `Backlog`, so the prose after the value is exercised too.

| # | Asserts | Red on today's code? |
|---|---|---|
| T1 | `done/plan-sprint-4.md` → id `S-004`, status `Done`; its 3 tasks (2 done, 1 cancelled) are attached; `progress.counts` right | **yes** (id is `S-plan-sprint-4`, 0 tasks) |
| T2 | `done/plan-sprint-4b.md` → `S-4b` (suffix unpadded); its tasks attached | **yes** |
| T3 | `cancelled/plan-sprint-7.md` → `S-007`, `cancelled/plan-sprint-7c.md` → `S-7c`, status `Cancelled`, tasks attached | **yes** |
| T4 | unchanged mappings: `done/sprint-3.md` → `S-003`, `done/backlog.md` → `BACKLOG`, `done/plan-index.md` → `S-plan-index`, `done/hotfix-post-sprint2.md` → `S-hotfix-post-sprint2` | ⚠️ **no, green on both by design.** It is the regression guard; it can only go red if the fix over-reaches. |
| T5 | open `sprint-4.md` + `done/plan-sprint-4.md` → `/api/check` `warnings` has one `S-004` entry naming `sprint-4.md` and `done/plan-sprint-4.md`; `ok: true`; `problems: []`. A tree with only `plan-sprint-N` archives → `warnings: []` | **yes** (no collision today) |

⚠️ **One deviation from the brief, stated up front.** Brief verification 1 says *"each new test fails
against the current `boardIdFromFile()`"*. T4 cannot: it pins behaviour that must **not** change. T1,
T2, T3 and T5 will be shown red. If the owner wants the brief's wording kept literally, T4's
assertions can be folded into T1, but that hides which half failed. My pick is to keep T4 separate.

### 4.3 No other file

README: the reader section does not describe id mapping, so there is nothing to correct. No
knowledge-base or wiki edit (wiki writes are fkit-wiki's). `dashboard.sh` is untouched.

## 5. The oddities: in or out

| Oddity (sibling project) | Count | Class | Why |
|---|---|---|---|
| sprint value `Sprint 3. Replaces …` → `S-3.` | 1 task | **OUT** | A data typo in that project. `dashboard.sh`'s grammar rejects it too. Fixing it means the reader tidying up the **task** side's sprint text, which would be a new grammar decision, and the ⛔ sibling is not edited. After the fix, `S-003` exists but this task stays unattached. |
| no sprint (`null`) | 59 tasks (58 have no `## Sprint` field at all) | **OUT** | Correct as is. aiboard already lists them under its **"No sprint"** filter. |
| two backlog boards → `BACKLOG` | 2 boards | **OUT** | Already warned on `/api/check` by 0412 (owner ruling: warn, don't merge). Still warned after the fix. |
| ⭐ **new, not in the brief:** sprint value `Sprint backlog — no sprint home yet …` → `S-backlog` | **12 tasks** | **OUT (recommended)** | `boardId()`'s `Backlog` check is case-sensitive and anchored at the start, so this value maps to `S-backlog`, which no board has. These 12 tasks are invisible under every sprint filter, just as Sprint 4 was, although they still show under "All tasks". Fixing it changes `boardId()`, which also maps **every** task in fkit's own tree, so it is not the one-line archived-board fix. See NEEDS-DECISION 2. |

## 6. Sequencing and verification

0. **Snapshot the original first.** Copy `bin/fkit-board.mjs` to the session scratchpad as
   `fkit-board.orig.mjs`. Every before/after comparison runs **the two versions back-to-back against
   the same tree at the same moment**. ⚠️ Both trees are live: the sibling's boards were being edited
   during planning, and its S-005 done count moved from 4 to 5 between two of my read-only runs. A
   plain "before today, after tomorrow" diff would therefore blame the fix for the owner's own edits.
1. **Write T1–T5 first and run them against the unchanged reader.** Expect T1, T2, T3 and T5 red and
   T4 green. Record the failing assertion names and messages in the worklog. That is the brief's red
   run, taken before the edit instead of by revert-and-restore; the proof is the same and the tree is
   never left half-edited.
2. **Apply §4.1.** Re-run the new file (all green), then `npm test`. That is the full suite, **including
   `test/prove-red.sh`**, and `test/board-reader.test.js` with its assertions **unedited**
   (verification 5). ⚠️ `npm test` also picks up the untracked, unrelated `test/board-narrow.test.js`
   (someone else's work in progress). It is green today (baseline run: 36/36 across the three board
   files). If it goes red later for its own reasons, that is reported, not fixed.
3. **fkit's own tree unchanged (verification 2).** From a scratch script, dump the snapshot of fkit's
   tree through `orig` and `new`, normalized to boards (id, folder, status, task ids) plus tasks (id,
   sprint) plus `warnings`, and with `generated` dropped. Show `diff` output in the worklog; it must
   be **empty**. `--bench`'s corpus line (tasks and boards) goes before and after too. Timings are
   noise and are not compared.
4. **Sibling tree, read-only (verifications 3 and 4).** Hash every file under the sibling's
   `ai-agents/`, then run `orig` and `new` snapshots back-to-back, then hash again. Record in the
   worklog **without machine paths**:
   - the per-board id and task counts, old versus new (expected: S-004 110 = 105 done + 5 cancelled;
     S-4b 4; S-4c 8; S-001/002/003 0);
   - the `warnings` for each version (expected: only the existing `BACKLOG` line on both);
   - whether the hash matched. If it did not, the reader did not write it (it has no write path, and
     test E2 proves that), so the changed files are listed with their mtimes to show they are the
     owner's own concurrent edits.
   ⚠️ This correction to the brief goes in the worklog: verification 3's *"done Sprints 1, 2, 3 … with
   their tasks attached"* means **0 tasks** for S-001/002/003, because no brief names those sprints.
5. **Worklog.** The aiboard finding (§7) is already written there at plan time (brief item 5). Add the
   decision log for the build.

**Size check:** about 1 changed code line, about 4 comment lines, and a test file of roughly 150
lines. Small. If building finds otherwise, stop and say so.

## 7. aiboard's page: does it show Done sprints, and where? (read-only, brief item 5)

Read `aiboard/web/index.html` in the sibling aiboard repo (unmodified, HEAD `df554b9`). **Nothing
filters out Done or Cancelled sprints.** A closed sprint appears in three places:

1. **The "Sprints" tab.** It is the button at the top right, next to "Board". Every board the reader
   sends is a card: `S-004 · <title>`, a progress bar, and `N/M done · … cancelled`.
2. **The sprint drop-down beside it** (visible on the Board tab only). Each board is listed as
   `S-004 · <title> (Done)`. Picking it filters the Board to that sprint's tasks. Closed tasks sit in
   the greyed-out **done** and **cancelled** columns.
3. **"All tasks" on the Board tab.** Each done task shows an `S-004` chip. Clicking the chip opens
   the sprint drawer.

**What the owner saw before the fix, and why.** The Sprint 4 card was still there, but labelled
`S-plan-sprint-4 · Geoconflict — Sprint 4 — …` and reading **0/0 done**. Picking it in the drop-down
showed no tasks. The 110 tasks still carried an `S-004` chip, but no board has that id, so `S-004` was
**not in the drop-down**, and clicking the chip asks for a sprint that does not exist. (By the code,
that gives an error flash; I did not render the page to see it.) **After the fix**, the card and the
drop-down read `S-004`, with 105/110 done and 5 cancelled.

**Two display quirks on aiboard's side.** Both are out of scope (⛔ no aiboard change) and already
known from 0411, which settled them as cosmetic. They are relayed so the owner is not surprised.
- **Order.** aiboard sorts cards by a lowercase status key, but fkit sends the status verbatim (for
  example `Done`), so the key misses. Cards therefore sort **by id only**, and Done boards are not
  grouped at the end. Sprint 4 sits between S-003 and S-005.
- **Badge colour.** aiboard colours the status badge only for lowercase names. By the CSS, a `Done`
  badge gets white text and no background colour on a white card, so it may look blank. This comes
  from reading the stylesheet; **not confirmed by rendering**.
- **Also:** aiboard remembers the last drop-down choice in browser storage. If `S-004` was selected
  when it vanished, the page quietly fell back to "All tasks", so the owner must re-pick it after the
  fix.

## 8. Risks and edge cases

- **Collision with 0413** (same file, `cacheKey()`). The two tasks touch different functions, so
  whichever lands second rebases trivially. 0413's rename tests could later also cover a board renamed
  to or from `plan-sprint-N.md` (brief note). Not done here.
- **Heading and file name disagree** (§2): an id changes on close. Measured zero today. It is usually visible, but not guaranteed to be. (c) is the cure if it ever appears.
- **`plan-sprint-backlog.md`** would now map to `S-backlog` instead of `S-plan-sprint-backlog`. It is
  hypothetical: no such file exists in either tree. It mirrors today's `sprint-backlog.md` fallback,
  which is `S-backlog` when `dashboard.sh` gives no identity.
- **Live trees** (§6 step 0): handled by the back-to-back comparison.
- **The 0411 grep trap:** the comment is written to avoid every banned token, and test C runs in
  `npm test` to prove it.

## NEEDS-DECISION (for the plan gate)

1. **Which derivation?** Options:
   - (a) file-name prefix **(Rec)**;
   - (b) heading parse (not recommended: it breaks ADR-041 §5);
   - (c) ask `dashboard.sh` about archived boards too (most correct, about 3–4× slower on a full
     re-read);
   - (a) now, and file (c) as a Backlog follow-up.
2. **The 12 `Sprint backlog — …` tasks** (new oddity). Options:
   - leave them out and do nothing;
   - leave them out and have the producer file a follow-up brief **(Rec)**;
   - widen 0415 to cover them (not recommended: it changes `boardId()`, which maps every fkit task).
3. **Red-run wording.** Options:
   - keep T4 as a separate guard that is green on both versions **(Rec)**;
   - fold it into T1 so every test is literally red first.
