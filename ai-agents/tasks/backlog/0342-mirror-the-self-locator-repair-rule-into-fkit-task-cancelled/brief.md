# Mirror the self-locator repair rule into `/fkit-task-cancelled`

## ID
0342

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### 🔒 OWNER RULING, 2026-08-26 — this task exists because of it

Ruled live via `AskUserQuestion` in an `fkit lead` session driving `/fkit-sprint-ship-loop`, on
task `0325`'s plan question **Q3** (*"The identical gap in `fkit-task-cancelled` step 5 — follow-up
brief or fold in now?"*). **Verbatim option label:**

> **"Follow-up brief (Recommended)"**

Recorded in `0325`'s plan (`ai-agents/tasks/backlog/0325-…/plan.md`, §4 *Owner rulings*, Q3): *"this
task edits `fkit-task-done` only; the mirror is a producer-filed follow-up."* This brief is that
follow-up. Filed by a spawned producer with no owner channel; nothing here re-ranks a board.

### What `0325` adds, and what this task mirrors

`0325` adds a **self-locator repair rule** to `claude/skills/fkit-task-done/SKILL.md`'s reference
sweep — four insertions, no existing bullet changed in meaning:

1. **Step 4** — one clause on the `**ai-agents/tasks/** itself` bullet: the folder-name grep also
   returns the moved folder's *own* record files, which point at themselves; step 5 rules that case.
2. **Step 5** — a new bullet, **"The moved folder's OWN self-locators"**, placed directly after the
   sibling-outbound bullet. It defines a self-locator **by role, never by string** (a named header
   field above the first `## ` heading whose value is a path into this same folder), carries **two
   ⛔ freeze prohibitions** (never rewrite the old path where it is evidence; this is not a
   `backlog/`→`done/` search-and-replace), and the **`0250` worked example** — six occurrences,
   2 repair / 4 freeze.
3. **Step 5 "Then prove it"** — one sentence: every re-pointed self-locator must name a file that
   now exists; most are code spans, so the link check does not reach them — test the path.
4. **Step 7 report** — a new bullet, **"Self-locators repaired, and self-hits left frozen"**, listing
   both the repaired locators and the evidence hits deliberately left byte-identical, with a reason.

⚠️ **Do not take the wording from this brief. Take it from the landed skill.** The authoritative
text is whatever `0325` ships in `claude/skills/fkit-task-done/SKILL.md`; its plan at
`ai-agents/tasks/backlog/0325-…/plan.md` §*Steps* items 2–5 holds the proposed text, and the review
may have amended it. Read the landed file, not the plan, when `0325` is closed.

### The gap in `/fkit-task-cancelled`, verified on disk 2026-08-26

`claude/skills/fkit-task-cancelled/SKILL.md` step 5 (*"Update each tracked location to
'Cancelled'"*) carries the sibling-outbound bullet **"The moved folder's OWN outbound links"** as a
word-for-word mirror of task-done's — a `diff` of the two bullets on 2026-08-26 shows the only
content difference is the board token (`done/` ↔ `cancelled/`). Like task-done before `0325`, it is
scoped to **sibling** links and says nothing about the folder pointing at *itself*. The gap is
identical; the fix is the same rule with the board token flipped.

**The two movers have been kept as mirrors since `0050`** (wiki:
`wiki/tasks/harden-task-movers-against-closed-sprint-link-rot.md` — one fix landed in both;
likewise `task-done-flips-brief-own-status-header` / `task-cancelled-flips-brief-own-status-header`).
A rule added to one and not the other is drift the next reader will not expect.

### Zero instances today — this is a text-only gap

Measured 2026-08-26 (and independently by `0325`'s planner the same day):
`ai-agents/tasks/cancelled/` holds **11 folders and zero `plan.md` / `review.md` / `worklog.md`**.
No stale self-locator exists on that board. The condition is reachable — any task cancelled after
planning or review will carry record files — so the rule is owed, but there is nothing to sweep.
`0168`'s brief recorded the same `11 / 0` on 2026-07-31; the count has not moved.

### Step numbering differs between the two skills — map, do not copy positions

`fkit-task-cancelled` has **eight** steps; `fkit-task-done` has seven. Measured 2026-08-26:

| task-done | task-cancelled | Region |
|---|---|---|
| step 4 `**ai-agents/tasks/** itself` bullet | step 4, same bullet | folder-name grep list |
| step 5 sibling-outbound bullet → insert after | step 5, same bullet (`:186`, *"The moved folder's OWN outbound links"*) → insert after | before *"Make the **minimal** edit"* |
| step 5 **"Then prove it."** | step 5 **"Then prove it."** (`:240`) | end of step 5 |
| step 7 *Report*, after **"Re-pointed links"** | **step 8** *Report*, after **"Re-pointed links"** (`:304`) | report shape |

Task-cancelled's steps 6 (*Flag downstream dependents*) and 7 (*Handle ambiguity*) have no
counterpart in this change and are not touched.

### Neighbours editing the same file

Check firsthand before planning; measured 2026-08-26 by folder name, not exhaustively:
`0341` (build the sprint movers) cites task-done's line ranges as a *model* and edits neither task
mover. No open task was found that edits `fkit-task-cancelled/SKILL.md` step 4/5/8. Re-verify with a
grep for `fkit-task-cancelled` over `ai-agents/tasks/backlog/*/brief.md` at plan time.

## What to build

1. **Mirror all four insertions** from the landed `fkit-task-done` rule into
   `claude/skills/fkit-task-cancelled/SKILL.md`, at the mapped positions in the table above: the
   step-4 clause, the step-5 **"The moved folder's OWN self-locators"** bullet (both ⛔ freeze
   prohibitions and the `0250` worked example included), the step-5 "Then prove it" sentence, and
   the step-**8** report bullet.

2. **Flip only the board token.** Where the task-done text says the locator's board segment is
   re-pointed `tasks/backlog/` → `tasks/done/`, the mirror says → `tasks/cancelled/`, *"or from
   whichever board it left"* stays as written. The idempotency clause (*a locator that already names
   the destination board is left byte-identical*) names `cancelled/`. Nothing else in the wording
   changes — the same discipline the existing sibling-outbound bullet already follows.

3. **Keep `0250` as the worked example, unchanged.** It is the only measured specimen and its 2/4
   split is the point; that it closed to `done/` rather than `cancelled/` does not change which
   lines are locators and which are evidence. Do not invent a cancelled specimen — none exists.

4. **State the freeze cases as hard prohibitions**, in the ⛔ register step 5 already uses — same as
   `0325` item 4. A mirror that softens them into prose is not a mirror.

5. **Do not change any existing bullet's meaning.** Pure insertion, provable by `git diff -U0`.

6. **No test**, matching `0325`'s Q1 ruling (*"No test (Recommended)"*, 2026-08-26) — unless `0325`
   landed a guard test, in which case extend that test to cover this file rather than adding a
   second one. Say which in the worklog.

⛔ **Out of scope:**
- Any edit to `claude/skills/fkit-task-done/SKILL.md` — that is `0325`'s file, landed.
- Sweeping `ai-agents/tasks/cancelled/` — there are zero record files there (above).
- Remediating the existing stale self-locators under `done/` — `0168` (44 `review.md` headers) and
  `0343` (`0248`'s `plan.md`, `0218`'s `worklog.md`).
- Durable-form self-locators at write time — `0326`.
- Any write to `ai-agents/wiki-vault/` (ADR-005). Re-ranking any board (ADR-035).

## Verification steps

1. **`0325` is closed** (`ai-agents/tasks/done/0325-…/` exists) before the plan is written. This
   task mirrors landed text; mirroring a proposal that the review later changes lands two different
   rules.

2. **Diff the mirrored regions against task-done.** Extract the new step-5 bullet, the "Then prove
   it" sentence, the step-4 clause, and the report bullet from **both** skills and `diff` them: the
   only differences are the board token (`done/` ↔ `cancelled/`) and the report step number. Paste
   the diff into the worklog.

3. **Read task-cancelled step 5 end to end** and confirm it still reads as one procedure — the new
   bullet sits beside the sibling-outbound bullet and contradicts nothing.

4. **Walk the rule against `0250`'s folder as it stood before its 2026-08-23 repair** (the same
   acceptance case `0325` uses): it must select exactly `plan.md` `Brief:` and `review.md` `Task:`,
   and reject the four evidence sites. Re-measure the `:NNN` coordinates; do not trust the brief's.

5. **`git diff --numstat`** shows exactly one file; **`git diff -U0`** shows four hunks (steps 4, 5,
   5-prove, 8) and nothing in steps 1–3, 6, 7.

6. **Manifest:** `claude/structure-manifest.tsv` carried **0** `skills/` rows on 2026-08-26 — no
   regeneration expected. Re-check; regenerate only if the repo's own rule requires it (`0188` is an
   open manifest task — do not regen speculatively).

7. **`npm test`** green; state the count.

## Notes

- **Depends on:** 0325
- **Blocks:** nothing
- **Sequencing:** ready the moment `0325` closes. Small — one file, four insertions of already-reviewed
  text.
- **Filed on the owner's Q3 ruling of 2026-08-26**, relayed through the `/fkit-sprint-ship-loop`
  driver to a spawned producer. Filed on the Backlog board because no sprint was named; the owner may
  pull it into Sprint 6 beside `0325` if they want the two movers to stop diverging this sprint.
- **Related, not this task's:** the two stale self-locators outside `0168`'s scope — `0248`'s
  `plan.md` `**Task:**` line and `0218`'s `worklog.md` `**Plan:**` line — are `0343`. The corpus test
  `0325`'s plan named (*no `done/*/` record carries a stale self-locator*, red on day one, gated on
  `0168`) is **not filed** by this producer — flagged in the filing report for the owner.
- **Cite tasks by folder ID, never by board rank** —
  [`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md).
