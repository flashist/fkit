# Widen `/fkit-task-done` to repair a brief whose `## Status` contradicts a landed close

**Source**: `ai-agents/tasks/done/0229-widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P17` · ID 0229 · owner `fkit-coder` · two review rounds, 2026-08-27

## Goal

Tasks `0021` and `0041` have briefs reading `🔲 Backlog` while their folders sit in `ai-agents/tasks/done/` and `sprint-1.md` reads `✅ Done`. ⛔ **There was NO legitimate mechanism to correct them — both doors were shut:**

| Door | Why shut |
|---|---|
| `/fkit-task-done` | Step 1 stops when the folder is already in `done/`. Its one exception requires the brief to **already read** `✅ Done (agent-closed — not owner-verified)`. Both read `🔲 Backlog`, so ⛔ **the skill stops for the owner too.** |
| Hand-editing | Barred by `task-status-vocabulary.md` — `Done` may only be set by the movers, ⛔ *"never by hand-editing a file"*. |

⭐⭐ **The sharp detail: the skill already contains the branch that would do the right thing.** Step 5's *"Reads anything else? Replace it with `✅ Done`"* is exactly this case. **Step 1 stops the run before it is ever reached.** ⛔ **The repair logic is present and unreachable — a gating defect, not a missing capability.**

⚠️ **A dated correction inside the brief caught its own mis-citation**: the branch is in **step 5**, not step 6 as first written. ⭐ **The correction states plainly that the scope consequence is NONE and that the brief is not smaller than it describes** — *"reported plainly rather than claiming a saving that is not there."*

⚠️ **Until this shipped, `0021` and `0041` stayed drifted in every `/fkit-status Sprint 1` run** — an owner-acknowledged cost, ⛔ **and not a reason for any later reader to "just fix the briefs by hand."**

### ⭐ The overlap the producer refused to settle alone

`0134` (an ADR on the sanctioned repair path) and `0135` (the wider producer-only reconcile mode) both claim adjacent ground, and `0135` edits **this same step-1 branch**. ⛔ **The producer put three options to the owner rather than choosing.** Owner ruled **option 1, verbatim *"Ship 0229 standalone"*** — because `0134` has no scheduled date and the drift is visible now. ⭐ **The three options were left byte-identical so the road not taken stays readable.**

⚠️ **The accepted tradeoff is recorded honestly: `0135` will edit the very same branch again, later.** ⛔ *"It is not a licence for `0135` to silently overwrite this branch"* — the second edit must read what this one wrote and say what happened to this ruling.

## Key Changes

**One file**, `claude/skills/fkit-task-done/SKILL.md`, +32/−5. The existing exception is **byte-unchanged**; the label became `First exception:`.

A **second, owner-only exception** firing when all hold: the folder is already in `done/`; the brief's `## Status` contradicts a landed close; **a board row for this task already reads plain `✅ Done`**; and **the owner is present**. It **skips the move** and resolves to plain `✅ Done` — no agent-closed marker — so brief and board converge.

**Four must-nevers, in the skill's own prose**, so a later reader cannot reconstruct them wrongly: never fire with no landed close; never for a non-owner identity; never upgrade an existing agent-closed value (that is the *other* exception's job); never move a folder.

⛔ **The task did not run the mover on `0021`/`0041`, and did not hand-edit them "to get ahead"** — that run is the owner's act. ✅ **Verified and stated: both are still drifted at the end of this task.**

## Outcome

Two rounds, three findings, all fixed or ruled. Reviewers: own pass + Codex (`codex exec --sandbox read-only`), **full coverage both rounds**; round 2 Codex returned *"NO NEW FINDINGS"* and the verdict was **✅ converged**. `node --test test/*.test.js` → **774 pass, 0 fail.**

- **R1 (raised by both; medium → re-priced low by the coder):** ⭐⭐ **the fire test's discriminator was left implicit.** Step 4's grep keys on the folder name — **which also appears inside OTHER tasks' row descriptions.** A cold owner-present reader taking *"grep hit + status-table row + leading cell `✅ Done`"* as the test would fire on a **foreign task's row that merely cites this one**, writing an owner-verified `✅ Done` with no landed close. ⭐ **No live specimen exists — all 81 plain `✅ Done` rows under `sprints/` were scanned** — so it is **latent**. Fixed by naming the discriminator: ⭐ **the row's Brief (last) cell must link this task's folder**; a prose mention or a quoted specimen row is not a landed close.
- **R2 (low):** must-never 1 said *"reads `✅ Done`"* where the fire sentence says **plain** `✅ Done`. ⭐ **The outcome was already right; the STOP MESSAGE a cold reader would give was wrong** for an agent-closed row beside an open-work brief. Fixed, and the wrong attribution in the worklog's own decision log was corrected too.
- **R3 (low, frontier, residual):** three pre-existing sentences (*"the re-run and owner-upgrade paths"*, *"the file you just moved into `done/`"*) do not name the new third no-move path. ⭐ **Holds in effect and was NOT edited** — the approved plan settles the point and `0135` re-edits this branch, so a widening now would be **an out-of-plan edit `0135` would re-touch anyway.** Owner: *"Record as residual (Recommended)"*.

### ⭐ What the reviewers proved by walking real specimens rather than reasoning

- `0021` → `sprints/done/sprint-1.md:45`, one hit, plain `✅ Done`, Brief cell links its own folder → **fires**, resolves plain `✅ Done`.
- `0014` → one hit, `backlog.md:239`, a **foreign** `🔲 Backlog` row → **must-never 1 → stops.** *This is the R1 hazard's exact shape, with a leading cell that happens not to be `✅ Done`.*
- ✅ **No plain `✅ Done` row under `sprints/` carries a stale `tasks/backlog/` href for a folder now in `done/`** — so *"links this task's folder"* has no path-form ambiguity to bite on today.
- ✅ A spawned producer **is an agent** and stops; ADR-033's grant was not widened as a side effect; the `.claude/` mirror `diff`s identical.

### ⚠️ Two limits stated, not glossed

- ⛔ **The green suite proves no regression, NOT the change** — **no test reads `SKILL.md` body prose at runtime** (established by `0123`; `0136`'s guard covers frontmatter only).
- **Residual:** both ship-loops still say the mover has *"one exception"*, which is now **false as a count**. ⭐ Left as written by owner ruling because **each loop's conclusion — *no agent can repair this; it is the owner's* — stays TRUE**, the second exception being owner-only too. Re-raise if a loop's conclusion becomes false, or `0135` closes without touching them.

## Related
- [[tasks/repair-the-moved-folders-own-self-locators-in-task-done]] — `0325`, the other Sprint 6 edit to this same skill (a different region)
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the producer-only grant this must not widen, and §5's spawned-producer-is-an-agent rule
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] — why the worklog attribution slip was noted, not made a finding
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the outside-plan-means-stop rule that kept R3 unedited
- [[systems/knowledge-base-structure]] — the task-status vocabulary that bars hand-editing
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
