# Worklog — 0381 give the task movers a step for the `NAMED_EXEMPT` keys a move invalidates

Built by a spawned `fkit-coder` **Build worker** under `/fkit-sprint-ship-loop` (ADR-032 Decision 3),
on the driver's declared-approval marker. `plan.md` (blob `bb5e11afe0c22ae3c70e12679f9bfe8a983019ef`,
17072 bytes, verified against disk with `git hash-object` before the first edit) **is the autonomy
boundary**. Implemented against `HEAD` = `9943dcf13633e576761f7b76dd4a4b30c754de00`.

⚠️ **THE STEP SHIPPED HERE IS NOT YET IN FORCE IN THIS REPO.** Ruling **AF4**: `0381` ships
**canonical only** (`claude/skills/…`). The gitignored `.claude/` mirror that a mover actually reads
in this repo was **byte-identical** to canonical before this change and **diverges the moment it
lands**. A mover invoked here today still reads the OLD text, with no exemption step. The refresh
(`claude/fkit-claude-init.sh .`) is the **owner's, after committing** — it is deliberately not done
here and is not a defect to file.

## Owner-decision log

- **Plan gate (2026-09-11, `AskUserQuestion` in the driver session):** approved via **AF1–AF4**,
  appended to `plan.md` verbatim. Summary of what each bound:
  - **AF1 — "Both — manual repro + durable arms (Rec)"**: do the one-shot manual repro *and* extract
    `staleExemptions(root, keys)` with fixture arms. Both delivered; see below.
  - **AF2 — "Extend step 5's tail (Rec)"**: no new numbered step, no renumbering; bolded lead-in.
  - **AF3 — "Out of scope — file a row (Rec)"**: `fkit-task-cancelled`'s missing `OWN self-locators`
    block is NOT this task's. Named in the return instead. ⭐ **See the finding below — a row already
    exists.**
  - **AF4 — "You refresh after committing (Rec)"**: canonical only; state the not-in-force caveat
    loudly. Stated at the head of this file and in the return.

- **Fixes applied unattended, without asking (ADR-019 audit obligation):** `none`. No review round ran
  in this spawn; every edit came from the approved plan's Sequencing steps 1–7.

- **Obvious-winner calls made unattended:** **three**, recorded below.

  1. **The new fixture arms are numbered `M5`/`M6`, not `M4`/`M5` as ruling AF1 wrote them.**
     **Why it qualified:** `M4` was **already taken** in `test/reference-integrity.test.js` — the
     wiki-vault-skip arm (`M4 mutation: a broken link under ai-agents/wiki-vault/ is skipped and never
     scanned`), measured on disk before writing. Two arms sharing a number would break the one thing
     `test/prove-red.sh` depends on: grepping a red run for a **NAMED** assertion. One option
     (renumber to the next free slots) clearly dominates, and it changes nothing AF1 asked for —
     one arm per direction, orphaned and healed, against `os.tmpdir()`. **The plan's text was written
     before that collision was checked; the intent is unchanged.** Recorded in the test file's own
     header comment too, so the discrepancy with the plan is findable from either side.

  2. **Mutation 34 targets the BOARD WORD and carries no injected marker.** The plan said only "one
     [mutation] per mover". **Why it qualified:** mutation 33 already covers clause *content* (it
     inverts the delete rule). Mutation 34's job is the *uniformity* half, and the realistic drift
     there is a paste between movers that forgets the one word that legitimately differs. An injected
     marker would have reddened `T11` for the **wrong reason** (a reworded sentence, not a wrong
     board), so the wrong board word **is** the marker — `../../done/X` was measured to occur **zero**
     times in the unmutated `fkit-task-cancelled/SKILL.md`, making its presence afterwards
     unambiguous. Mechanical, localized, inside the plan's P2. **This is also the trap task `0341`
     walks into**, which is the plan's stated merit argument for shape.

  3. **The clause's exact prose.** The plan specified its six required contents (run unconditionally;
     the three directions; instances-not-keys; the authority gate; attribution + idempotence) but not
     the sentences. Written to be byte-identical in both movers **modulo the board word**, verified
     mechanically. Inside the plan's intent; nothing added beyond the six.

## What was done, in the plan's sequence

### 1. Baseline, re-measured at `HEAD 9943dcf`

| Measurement | Plan's value | **Re-measured** |
|---|---|---|
| `npm run test:unit` | 895 / 895 pass | **895 / 895 pass, 0 fail** · 73.5 s |
| `reference-integrity` | 896 files, 3492 targets, 0 broken, 7 named-exempt, 20 tests | **897 files**, 3492 targets, **0 broken, 7 named-exempt**, 20 tests |

⚠️ **One drift from the plan's table: 897 scanned files, not 896.** The tree gained a file between
plan time and build time. It is not this task's change (nothing was written before this measurement),
and `broken` and `named-exempt` are unmoved.

### 2. Red-first reproduction — AF1(a), both directions

Method: `cp` the pristine `test/reference-integrity.test.js` aside, plant a key into `NAMED_EXEMPT`,
run the guard, restore. Restored state verified with `git diff --quiet` (**empty**) and a re-run
(**20/20 green**). Nothing was left behind.

**Direction 1 — `missingCiter`** (citer path does not exist). Planted
`…/0381-…/NO-SUCH-FILE.md::../x.md`. Result: **`L4` RED**, 19 pass / 1 fail, with the guard's own
message naming the key and the action:

> `NAMED_EXEMPT keys whose CITING FILE no longer exists — it was renamed, moved between boards, or deleted. The exemption now suppresses nothing and hides the next rot at its new path:`

**Direction 2 — `targetIsBack`** (citer exists, target resolves). Planted `…/0381-…/plan.md::brief.md`
— `brief.md` is a real sibling, so the link resolves. Result: **`L4` RED**, 19 pass / 1 fail:

> `NAMED_EXEMPT keys whose TARGET now resolves — the link is no longer broken, so the exemption is dead weight and must be removed (and the L3 count lowered with it):`

⭐ **Two measured facts the plan did not anticipate, both recorded in code comments:**

- **The two arms are sequential `assert.deepEqual`s in one test, and the first failure MASKS the
  second.** With both keys planted at once, only `missingCiter` was reported. This is not a defect
  (the repair order is repoint → re-run anyway, which is what the movers' clause now says), but it
  **is** why the durable arms exercise each direction alone rather than trusting one live red to name
  both. Noted in `L4`'s body.
- **A stale key is INVISIBLE to `L3`.** Both plants left the count at `7 named-exempt`, because a key
  that suppresses nothing is never counted. Only `L4` sees it. That is the whole argument for `L4`
  being an equality arm rather than a ceiling, confirmed by measurement.

### 3. The clause, in both movers

Extends step 5's existing `**Then prove it.**` tail (**AF2**: no new numbered step, no renumbering),
with the bolded lead-in `**Then check the exemption keys this move may have invalidated.**`.
**30 lines**, inserted in both movers, **byte-identical modulo the board word** (`done` ⇄
`cancelled`) — verified mechanically, and now pinned by `T12`.

It names **one** path (`test/reference-integrity.test.js`) and **no assertion internals**: the design
insight the plan turned on is that the guard already computes all three directions and its own failure
messages already state the right action, so the clause tells a mover to **run the guard and obey what
it says**. The grep-first early exit was **rejected** as planned, and `T5` now pins the unconditional
run so it cannot be re-introduced quietly.

### 4. `test/mover-exemption-step.test.js` (new) — 16 tests

Copies `test/wiki-flag-convention.test.js`'s *method*, not its code (that file names the method
reusable and says "Copy the method; do not grow this file into an instrument"): two named paths,
hand-written constants derived from disk, no shared extractor.

- **Two match modes** — byte-exact whole-line for the two single-line contract subjects (`T2` the
  invocation, `T3` the delete rule); whitespace-normalized for every wrapping prose subject. ⚠️ That
  file **measured six false negatives** from raw-matching wrapped prose; the split here is drawn to
  avoid the same trap.
- **Extract-and-GATE** — anchors found, exactly-once on both, ordered, and a `MIN_BLOCK_LINES = 22`
  floor (the live block is 30). `T15` proves all six refusal paths **throw** rather than pass, with a
  positive control so they are not all throwing for an unrelated reason.
- **`FKIT_MOVER_STEP_ROOT`** env seam with the stderr announcement, mirroring `FKIT_WIKI_FLAG_ROOT`.
- **`T0` roster pin.** ⚠️ **Discovery is by SIGNATURE (`### 3. Move the task FOLDER to`), not by name
  prefix** — measured: `claude/skills/` holds **four** `fkit-task-*` directories, and
  `fkit-task-brief` / `fkit-task-ship-loop` are **not** movers. A prefix pin would have reported two
  false movers and had to be loosened. The signature matches **exactly two** files across every skill.
- **`T1` closes the rot loop** — asserts the path the clause names **exists**, and does so against the
  real `REPO`, never `FKIT_MOVER_STEP_ROOT`, so a mutant `claude/` copy cannot make it pass.
- **`T14` pins placement** — the clause sits **after** the `Then prove it.` paragraph (a heal is only
  observable after step 5's repairs) and with **no `### ` heading between**, which is AF2's
  no-renumbering ruling made checkable.
- ⛔ **No `path:NNN` anchors anywhere**, per `conventions/durable-citation-anchors.md`.

### 5. `test/reference-integrity.test.js` — AF1(b), the durable half

- **`staleExemptions(root, keys) → {missingCiter, targetIsBack}`** extracted from `L4`'s body,
  **behaviour-preserving**. `root` and `keys` are parameters for the same reason `scan()`'s `root` is
  one: it is the whole fixture strategy, and it keeps every proof under `os.tmpdir()`.
- **`L4` is now the call plus its two original assertions**, whose **messages are byte-identical** to
  what they were inline — verified by diff: **zero** removed lines match any of the message strings.
  ⚠️ That fidelity is load-bearing now in a way it was not before: **those messages are what carry the
  rule to a mover operator**, because the clause deliberately quotes no assertion internals.
- **`M5` (orphaned) / `M6` (healed)** fixture arms, each proving one direction **and** its
  non-vacuity control (the same key, un-staled, is reported in neither direction). Both under
  `os.tmpdir()`; the repo's own `NAMED_EXEMPT` set is never touched.

### 6. `test/prove-red.sh` — mutations 33 and 34

- `run_mover_step_suite()` added beside `run_wiki_flag_suite()`; gate **`0o`** added beside `0m` (an
  unmutated copy must be green first, or a red below would be red-via-setup).
- **Mutation 33** — inverts the `targetIsBack` delete rule in `fkit-task-done` to
  `**Repoint the key (mutation: delete rule inverted).**`, which is the **documented failure mode**
  written out as plausible-but-wrong prose. Must red at **`T3`**. Carries an **injected marker** and
  counts **that**, never the natural text (the round-2 R11 discipline), plus the four standard guard
  branches (no-op / wrong-target / did-not-land / landed-more-than-once).
- **Mutation 34** — leaves `fkit-task-cancelled`'s board word un-swapped (`../../cancelled/X` →
  `../../done/X`). Must red at **`T11`**. See obvious-winner call 2 for why it carries no injected
  marker.
- ⚠️ **Index count updated: `THIRTY-TWO` → `THIRTY-FOUR`**, plus the two index rows. That index
  **has read stale before** (`0136` round-1 review R5) in the one file whose whole thesis is that an
  unexercised gate hides drift.
- ⛔ **`0271`'s uncommitted hunks in this file were left alone** (mutation 32 and its index row).

### 7. Verification — measured, not asserted

| Gate | Result |
|---|---|
| `npm run test:unit` (baseline, before any edit) | **895 / 895 pass, 0 fail** · 73.5 s |
| `node --test test/reference-integrity.test.js` (baseline) | **20 / 20 pass** · 0 broken, 7 named-exempt |
| Red-first, direction 1 (`missingCiter`) | **19 pass / 1 fail** — red at `L4`, message quoted above |
| Red-first, direction 2 (`targetIsBack`) | **19 pass / 1 fail** — red at `L4`, message quoted above |
| Repro reverted | `git diff --quiet` **empty**; **20 / 20 pass** |
| `node --test test/mover-exemption-step.test.js` | **16 / 16 pass** |
| `node --test test/reference-integrity.test.js` (after) | **22 / 22 pass** (20 + `M5` + `M6`) · 0 broken, **7** named-exempt |
| `npm run test:unit` (after) | **913 / 913 pass, 0 fail** — 895 + 16 + 2, exactly the expected delta |
| `node --test` over the three guards (after) | **71 / 71 pass** (69 baseline + `M5` + `M6`) · 898 files, **0 broken, 7 named-exempt** |
| `bash -n test/prove-red.sh` | syntax OK |
| `sh test/prove-red.sh` | **✓ hard gate PASSED**, exit **0** — **34 mutations red, 15 baseline gates green (`0a`–`0o`), zero `✗`** |
| ↳ mutation **33** | **red**, at the named assertion `T3 … targetIsBack delete rule` |
| ↳ mutation **34** | **red**, at the named assertion `T11 … board-dependent sentences` |
| ↳ gate **`0o`** (new) | **green** — an unmutated copy's mover-exemption-step suite passes, so 33/34's reds are not red-via-setup |

⭐ **The guard counts are worth reading as this task's own dogfood**: adding a 30-line clause to two
movers and a new worklog to `ai-agents/` left `reference-integrity` at **0 broken, 7 named-exempt** —
which is exactly the "green → record the measured `named-exempt: N` and stop" no-op path the clause
now tells a mover to expect on a clean close.

⛔ **`npm test` chains into `prove-red`** (`package.json`), so the hard gate was run directly rather
than twice.

## Findings for the driver

### ⭐ AF3 — the row it asks a producer to file **already exists**

Ruling AF3 noted the planner checked only `0341` and `0386` and told the producer to **look first**.
**Looked. It exists:**

`ai-agents/tasks/backlog/0342-mirror-the-self-locator-repair-rule-into-fkit-task-cancelled/brief.md`
— *"Mirror the self-locator repair rule into `/fkit-task-cancelled`"*, `🔲 Backlog`, Owner
`fkit-coder`. Filed **2026-08-26** by a spawned producer under a prior owner ruling on task `0325`'s
Q3 (verbatim label **"Follow-up brief (Recommended)"**).

⛔ **So no new row should be filed** — filing one would duplicate `0342`. The gap AF3 describes and
the gap `0342` owns are the same gap.

### ⚠️ Pre-existing stale claim, NOT repaired — flagged, not fixed

`test/reference-integrity.test.js` and `test/coordination-citation-policy.test.js` each carry a
`WHY THERE IS NO test/prove-red.sh ENTRY` note asserting **"All 28 prove-red mutations…"**. That count
was **already stale before this task** (the file held **32**), and this change makes it **34**.

⛔ **Deliberately not repaired.** The same stale number sits in `coordination-citation-policy.test.js`,
which is **outside this task's fence**; fixing one copy and not the other would leave a worse state
than fixing neither. ⭐ **The owner rulings those notes record are NOT affected** — both say
reference-integrity takes no prove-red entry, and this task added none: mutations 33/34 target
`mover-exemption-step.test.js` through its own env seam, not `reference-integrity.test.js`.

### ⚠️ One caution to hand task `0341`, not acted on here

The sprint movers **invert** the order (repoint, then `git mv` — ADR-047 §4), but the exemption step
must still run **AFTER** the move, because a heal is only observable at the new path. ⛔ **A
copy-paste that preserves POSITION instead of preserving AFTER-THE-MOVE is wrong.** `T14` pins
after-the-move for the **task** movers only; the sprint movers are deliberately outside `T0`'s roster
(they move a sprint plan, not a task folder, so the signature does not match them). Both points are
written into the new test file's header so `0341`'s author meets them there.

## Fence — what was and was not touched

**Touched (6, exactly the plan's change surface):**
- `claude/skills/fkit-task-done/SKILL.md`
- `claude/skills/fkit-task-cancelled/SKILL.md`
- `test/mover-exemption-step.test.js` *(new)*
- `test/prove-red.sh`
- `test/reference-integrity.test.js`
- this file *(new)*

⛔ **Not touched:** the `.claude/` mirror, `ai-agents/sprints/**`, ADR-047, any other task's records,
`ai-agents/wiki-vault/`, `claude/skills/fkit-status/**`. **No commit, no push, no folder moved, no
board row flipped, no re-rank, no mover invoked, no vault write.**
