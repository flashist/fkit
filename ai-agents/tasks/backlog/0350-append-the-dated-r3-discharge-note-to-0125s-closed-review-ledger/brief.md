# Append the dated R3 discharge note to `0125`'s closed review ledger — the gate is satisfied and the residual still reads as standing

## ID
0350

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-reviewer

## Context

### Authority

**Owner ruling 2026-08-28**, given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` over task `0154`'s stateful review, and relayed to this spawned producer at
`0154`'s close — **the option label is the verbatim text: "File a task to append a dated discharge
note, gated on R1 (Recommended)"**.

⭐ **THE R1 GATE IS SATISFIED, so this note carries NO exception clause.** `0154`'s R1 (the
`extractBlock()` first-match hole) was fixed and proven red-first across two review rounds, and
`0154` closed the same day as
[`0154-build-wiki-flag-convention-test`](../../done/0154-build-wiki-flag-convention-test/brief.md)
(`✅ Done (agent-closed — not owner-verified)`). Nothing about this note is conditional any more.

⚠️ **Filed UNRANKED by a SPAWNED producer with no owner channel** (`AskUserQuestion` is absent in a
consult —
[ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
This row **appends** to the Backlog board and renumbers nothing; a mid-board insertion is not the
owner-ruled re-rank exception
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
The Backlog board is unranked by design, so no merit position is stated.

### The gap

`0125`'s review ledger records **R3** as a standing accepted residual — *"`plan.md` check 4 stays
fail-open in shape (R3)"* — whose `What actually closes it` field names *"the already-named
`test/wiki-flag-convention.test.js` follow-up, for the producer to file."* **That follow-up has now
been filed, built, reviewed over two rounds, and closed** (`0154`). A reader of `0125`'s ledger sees
none of that: the residual reads exactly as it did on 2026-07-27.

### Measured firsthand 2026-08-28 — dated observations, not permanent facts

⛔ **Re-measure every figure below before acting.** Line numbers are the most perishable thing here.

| Coordinate | Measured | Content |
|---|---|---|
| `ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/review.md:109-116` | 2026-08-28 | the R3 residual bullet, inside `## Accepted residuals (shared, do-not-re-litigate)` (heading at `:95`); the file is 126 lines and ends with `## Re-litigates settled decisions (suppressed)` |
| `ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/plan.md:127-133` | 2026-08-28 | R3's literal subject — check 4, **unchanged**, still `sed 's/^ *//'` + `diff && diff && echo "UNIFORM"` |
| `test/wiki-flag-convention.test.js:275` | 2026-08-28 | `function dedent(block)` — removes **one uniform minimum** per block, never a per-line strip |
| `test/wiki-flag-convention.test.js:487` | 2026-08-28 | T8 — rejects a broken relative indent, and carries the control asserting a blanket strip is blind to exactly that bug |
| `test/wiki-flag-convention.test.js:507` | 2026-08-28 | T9 — a whole-block uniform shift still passes (the fix does not over-pin) |
| `test/wiki-flag-convention.test.js:408` | 2026-08-28 | T6 — extraction fails closed; `extractBlock()` carries **six** `throw new Error` exits |
| `test/prove-red.sh:1252` | 2026-08-28 | mutation 28 — keeps the uniformity assertion permanently exercised |

**Both halves of R3 are discharged**, and the `0154` reviewer verified both independently:

1. *"`sed 's/^ *//'` erases relative nesting, so a broken list-item indent is invisible to it"* →
   `dedent()` is a uniform-minimum dedent, T8 proves the broken indent is rejected **and** proves by
   control that a blanket strip would miss it.
2. *"`diff && diff && echo UNIFORM` still prints `UNIFORM` on an empty extraction"* → `extractBlock()`
   **throws** — missing START anchor, missing END anchor, duplicated anchors, reversed anchors, and a
   sub-floor extraction — six throws, each naming the file.

### ⛔ Two things this note must state precisely, or the discharge is over-read

1. **Check 4 itself is UNCHANGED and still fail-open in shape — deliberately, and it is NOT re-raised
   here.** The owner ruled that on **2026-07-27** (SUBSUME): *"a real test beats a better one-shot
   grep"*, and that ruling **named `test/wiki-flag-convention.test.js` as what closes it**. What is
   discharged is the residual's *subject matter* — the two fail-open behaviours now have a real gate —
   **not** check 4's own shell text, which nobody promised to harden. ⛔ **Do not "fix" check 4. Do not
   file a task to fix check 4. Do not word the note in a way that reads as a promise to.**
2. **`0125` IS NOT REOPENED, RE-STATUSED OR MOVED.** It stays `✅ Done (agent-closed — not
   owner-verified)` at `ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/`. Only an
   **appended** dated note is in scope. A closed ledger stays closed —
   [ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)
   is the bar that keeps it closed, and its own *"do not re-raise merely because a closed ledger is
   found to contain a low-severity defect in its own record"* clause applies to anything else you
   notice in there while working. Same shape as
   [`0318`](../0318-append-a-dated-correction-note-to-0238s-closed-brief/brief.md),
   [`0324`](../../done/0324-record-that-0250-discharged-0188s-d1-and-warn-off-the-reordering/brief.md)
   and [`0346`](../0346-append-a-dated-correction-note-to-adr-038s-step-table-claim-scoped-to-build/brief.md).

## What to build

1. **Re-verify the premise before touching anything.** Does the R3 residual bullet still exist, still
   read as standing, and has no other run already annotated it? ⛔ **If it is already annotated, stop,
   record that, and do not write a second note.** Re-verify the discharge itself from disk — `dedent()`
   is a uniform-minimum dedent, T8/T9 exist with T8's control, `extractBlock()` throws on all five
   anchor/floor conditions, and mutation 28 is present in `test/prove-red.sh`. ⛔ **If any of that is
   absent, STOP — the note would be false.** *"Not checked"* is not an outcome: record the exact
   commands and their output
   ([`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)).

2. **Use the dated correction-note form, not a rewrite.** The form is
   [`claude/skills/fkit-record-decision/SKILL.md`](../../../../claude/skills/fkit-record-decision/SKILL.md),
   section **"Correcting an accepted ADR — the dated correction note"** (`:170`). The binding parts:
   - **The residual bullet stays byte-identical.** The note is **appended next to** it, never written
     over it.
   - **The note goes BELOW the bullet** — the form's *"Placement — below the claim, deliberately"*
     (`:226`).
   - **Indentation matches the block it annotates** — the form's *"Indentation follows the claim it
     annotates"* (`:245`). The R3 bullet is a top-level list item, so the note takes that item's
     continuation indent.

3. **The marker is ⚠️, not ⛔.** The form admits exactly two markers and no third: ⚠️ = *a fact that
   drifted (the decision is untouched)*; ⛔ = *a decision that was overturned (do not follow it)*.
   **Nothing here was overturned** — the 2026-07-27 SUBSUME ruling stands and was carried out. A
   defect was discharged. ⛔ **Marking this ⛔ would tell every reader that a standing decision must not
   be followed, which is false.**

4. **What the note must say — five facts, all of them:**
   - **(a) R3 is discharged**, by `0154` (name it by folder ID, per
     [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)),
     with `0154`'s close date and the note's own measurement date.
   - **(b) Which mechanism discharges which half** — the uniform-minimum `dedent()` plus T8's control
     for the nesting-blind half; `extractBlock()`'s throws plus T6 for the `UNIFORM`-on-empty half.
   - **(c) ⛔ THE LOAD-BEARING SENTENCE, and the one a summariser will drop: check 4 itself is
     UNCHANGED and still fail-open in shape, deliberately.** It must say, in the note and not by
     reference, that the 2026-07-27 SUBSUME ruling (*"a real test beats a better one-shot grep"*)
     stands, that it named `test/wiki-flag-convention.test.js` as what closes this, and that **check 4
     is not to be re-raised or hardened**. ⛔ **A note that records the discharge but not this has
     failed this task**, even though it is factually true.
   - **(d) The residual's `Re-raise only if` field is now spent** — its condition was *"that follow-up
     is dropped, or a third party relies on check 4 as a gate rather than as a one-shot aid"*. The
     first arm can no longer fire; **the second arm stays live**, and the note must say so rather than
     declaring the residual dead outright.
   - **(e) A pointer to this task** (`0350`) as the note's authority, and to the owner ruling's date
     and verbatim label.

5. **Prove it is additions-only.** `0125`'s folder was **clean** (fully committed) at filing, measured
   2026-08-28 — so the form's exact pair applies:
   `git diff --numstat -- <file>` → expect `N  0  <file>`, and
   `git diff -U0 -- <file> | grep '^-' | grep -v '^---'` → expect **no output**. ⚠️ **Use that deletion
   filter exactly** — the shorter `grep '^-[^-]'` is wrong and misses deleted list lines. ⚠️ **If the
   folder is no longer clean at implementation time, snapshot before editing** and prove it with
   `git diff --no-index --numstat <snapshot> <file>` and `diff <snapshot> <file> | grep '^<'`. Say
   which proof shape you used.

## Verification steps

1. `ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/review.md` contains **exactly one** new
   dated note, sitting below the R3 residual bullet, at that bullet's continuation indent, carrying
   the ⚠️ marker.
2. The R3 bullet itself is **byte-identical** to its pre-edit text — proved by the additions-only pair
   (or the snapshot pair) in *What to build* step 5, with the command output recorded.
3. The note carries all five facts (a)–(e). **Read fact (c) back out loud against the note**: a reader
   who reads only the note must come away knowing check 4 is unchanged, fail-open by design, and not
   to be hardened.
4. `0125`'s `## Status` still reads `✅ Done (agent-closed — not owner-verified)`, its folder is still
   under `ai-agents/tasks/done/`, and no task file was moved — `git status --porcelain
   ai-agents/tasks/` shows `0125`'s folder as modified only, with no rename.
5. Every relative link written into the note resolves from
   `ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/`.
6. Nothing under `ai-agents/wiki-vault/` was written. Nothing was committed or pushed.

## Notes

- **Why `fkit-reviewer` owns this.** The repo's pattern for a dated correction note is *the role that
  owns the target artifact's write surface*: `0318` (a closed **brief**) → `fkit-producer`; `0346` (an
  **ADR**) → `fkit-architect`. The target here is a task folder's **`review.md` ledger**, which is the
  reviewer's write surface (*"writes only review ledgers"*), and the content is a residual
  disposition — a reviewer's ledger act.
- ⚠️ **This row is NOT `fkit-coder`-owned, and `/fkit-sprint-ship-loop` does not read `## Owner`** — it
  spawns `@fkit-coder`. **Check this brief before spawning a worker.** The rule was decided by
  [`0270`](../../done/0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row/brief.md) →
  [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
  (*Build role follows the deliverable's skill*), but **carrying it into the loop's own text is still
  an open backlog row** —
  [`0345`](../0345-carry-adr-044s-build-and-plan-role-rule-into-the-ship-loop-and-agent-text/brief.md).
  Until `0345` lands, the blind spawn is live.
- **Adjacent residual, deliberately NOT in scope.** `0125`'s sibling residual *"The convention is
  prose-only and unenforced"* had the re-raise condition *"that follow-up is dropped rather than
  filed"* — satisfied by filing `0154`, so it cannot fire either. Its **substance** is now partly
  answered too, but only partly: `0154` reads **one block in three files**, and every other skill body
  in the repo remains unread by anything. ⛔ **Do not annotate that residual under this task** — the
  owner's ruling named R3. If you think it warrants its own note, **report it; do not widen this
  task.**
- ⚠️ **Observed at filing, out of scope, do NOT fix here:** `0125`'s `review.md:6` header reads
  `Status: in-review` while the task is closed. Report it at close so the owner can decide; correcting
  it is a rewrite, not an append, and was not ruled.
- **Companion task filed from the same close:** `0351` (the `test/prove-red.sh` `0k`/`0l` wording).
  **No dependency in either direction** — different files, different roles, independently shippable.
- ⛔ **No wiki write.** If `ai-agents/wiki-vault/` carries a page citing `0125`'s R3 as standing, that
  repair is `fkit-wiki`'s
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  This brief did not look and asserts nothing about it.
