# Write `plan.md` at plan approval in the sprint loop, and add the artifact table it lacks

## ID
0202

## Sprint
Sprint 2

## Priority
180

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Follow-up 1 of [`0162`'s decision report](../../../knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md)**
(§10 row 1, §9, §0.1). **This is the fix for a confirmed live production failure, not a tidy-up** — see
`R4b` below.

`/fkit-sprint-ship-loop` writes `plan.md` in the **Build** row of its step table
(`claude/skills/fkit-sprint-ship-loop/SKILL.md@2026-08-02:103` — *"implement the **approved** plan; write
source + `plan.md`/`worklog.md`"*). Its sibling `/fkit-task-ship-loop` writes it **at plan approval**
instead (`claude/skills/fkit-task-ship-loop/SKILL.md@2026-08-02:142-143` — step 4, *"On approval … write
the approved plan to `<task-folder>/plan.md` — the durable autonomy boundary"*), and declares it in an
**artifact table** (`:100-104`, the `<task-folder>/plan.md` | *at plan approval* row at `:102`).

**`fkit-sprint-ship-loop` has no artifact table at all.** Verified 2026-08-02: `grep -n -i "artifact"
claude/skills/fkit-sprint-ship-loop/SKILL.md` returns **zero hits**.

### Two consequences, both established firsthand on `0162`

**F2 — the plan does not exist when it is supposed to be carried.** The sprint loop's own rule
(`fkit-sprint-ship-loop/SKILL.md@2026-08-02:110-116`) requires the Build **and** Process-review spawn
prompts to carry the approved plan verbatim, and `0162`'s ruling makes that a **copy operation over a
durable artifact** — a byte-exact read of a file, plus a path + `git hash-object` pointer. But the loop
does not write `plan.md` until the **Build** step, so **at the moment of the Build spawn there is no file
to point at.** The approved construction is unavailable at the exact moment it is required. `0162`'s
report §0.1 records this happening on `0162`'s own Build spawn.

**⚠️ `R4b` — a CONFIRMED LIVE PRODUCTION FAILURE, dated and evidenced.** Asked to supply the path/hash
pointer the owner had just approved, the driver found that
`ai-agents/tasks/done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/plan.md`
**is not the approved plan.** The Build worker **authored a re-rendering** of it rather than **copying**
the approved bytes: two of three distinctive strings from the approved text are absent, and
`git hash-object` on that file gives `2458a57eda55ca774884110e76dee1bf91b6d6e0`. This is the
recall-versus-copy failure `0162` diagnosed, **one layer down** — and it happened **on the task that
defined it, within hours of defining it.** It is why the owner ruled this task ranked now.

### ⛔ What this task closes, and what it does NOT — state this in the plan and the worklog

- **It closes the *reconstruction route*.** Writing `plan.md` from the approved text **at approval, before
  any worker is spawned**, means **no worker is ever asked to reconstruct the plan**. That is the route
  `R4b` took.
- **It does NOT close the `carried-not-approved` class.** A hash pins *which bytes were carried*, not
  *which bytes were approved*. A driver that writes a `plan.md` the owner never approved, carries it
  faithfully and hashes it correctly still produces a green result over bytes the owner never saw. This
  is **structural, not provisional** — approval is granted in a session channel that leaves no artifact
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md);
  `claude/askuserquestion-marker-hook.sh` writes an **empty** marker, and no session transcripts exist in
  this repo). It is an **accepted residual**, recorded with a re-raise condition in `0162`'s review ledger
  under `carried-not-approved`. **Fixing the likely route is not fixing the class, and this brief does not
  claim otherwise.**

## What to build

Two edits to `claude/skills/fkit-sprint-ship-loop/SKILL.md`, and nothing else.

1. **Move the `plan.md` write from the Build row to plan approval.** The Build row must stop claiming to
   write `plan.md`; the plan-approval gate (the driver's own `AskUserQuestion` approve/reject step, the
   row above Build) must write `<task-folder>/plan.md` **from the approved text, before the Build worker
   is spawned**. Mirror `fkit-task-ship-loop`'s step 4 wording rather than inventing a new one — the two
   loops should not diverge on the same artifact.
2. **Add the artifact table the sprint loop lacks entirely**, mirroring
   `fkit-task-ship-loop/SKILL.md@2026-08-02:100-104`, with at minimum a `<task-folder>/plan.md` |
   *at plan approval* row. Keep `worklog.md` and `review.md` rows consistent with what the sprint loop
   actually does — **do not copy the sibling's rows unchecked**; the two loops differ (the sprint loop's
   review ledger is written by a spawned reviewer, and its close is producer-spawned per ADR-033).

**Also record, in the rule text or a note beside it, that this write is what makes follow-ups 2 and 3
possible** — so a later reader does not delete it as redundant.

⛔ **Out of scope:** the *"Rules that make this honor the ADRs"* bullet itself (that is `0203`), any hook
(that is `0204`), `claude/agents/fkit-coder.md`, condition **(b)** (it stands byte-unchanged), and
`ai-agents/wiki-vault/`.

⚠️ **Coordination — this file is contended.** `0164` edits the **Build row** of this same file, and
`0203` edits the *"Rules that make this honor the ADRs"* bullet in it. Regions do not overlap, but
**do not work them in parallel**; whichever lands second re-verifies its coordinates.

⚠️ **This brief's `path@date:line` coordinates were verified 2026-08-02 against a tree several concurrent
workers were editing. Re-verify every one at implementation time.**

## Verification steps

1. `grep -n -i "artifact" claude/skills/fkit-sprint-ship-loop/SKILL.md` returns a table, where it
   returned zero hits before.
2. The artifact table contains a `<task-folder>/plan.md` row whose "written by the loop" cell reads **at
   plan approval** (or equivalent), not "at Build".
3. The **Build** row of the step table no longer says the worker writes `plan.md`.
4. The plan-approval step says the **driver** writes `<task-folder>/plan.md` from the approved text
   **before** spawning the Build worker.
5. The rule text or an adjacent note states that this task closes the **reconstruction route only**, not
   the `carried-not-approved` class.
6. **Change surface is exactly one file** — `git status` and `git diff --stat` show
   `claude/skills/fkit-sprint-ship-loop/SKILL.md` and nothing else. No agent definition, no hook, no test,
   no ADR, no `wiki-vault/`.
7. **Frontmatter guard still green:** `node --test test/skill-frontmatter.test.js` passes (this edit
   touches the body, not the frontmatter — a red here means the frontmatter was disturbed).
8. **The suite is still green:** `npm test` passes. Record the pass/fail/suite counts.

## Notes

- **Depends on:** nothing.
- **Blocks:** `0203`, `0204`.
- **⚠️ Priority 180 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly above `0154`** — i.e. at the very top of the open board — because it is
  the only open row repairing a control with a **dated, evidenced, live production failure** against it
  (`R4b`), and it is the hard prerequisite for two other filed rows. Filed by a spawned producer with no
  owner channel, which never re-ranks (ADR-035). **Append rank and merit diverge by roughly fifty
  places** — stated plainly, as required.
- **⚠️ The owner has already ruled the sequencing** — `AskUserQuestion`, live `fkit-lead` session,
  2026-08-02, on `0162`'s OQ-4: **rank now, drive this sprint.** The owner weighed the mid-flight hazard
  (editing the driver's own step table while that table is executing) and rejected the "after Sprint 2"
  argument on the ground that this is **prose in a step table, not running code**. **That ruling is a
  sequencing decision; it is not authority to renumber the board** — hence the append rank above and the
  merit flag. The owner confirms the rank.
- **⚠️ Mid-flight hazard, recorded not planned around.** This changes `/fkit-sprint-ship-loop` while that
  loop is driving Sprint 2. A driver that resumes mid-task after this lands may find `plan.md` absent
  where the new table says it should exist. The implementer should say in the worklog what a resuming
  driver should do in that window.
- **Source:** `0162`'s decision report §10 row 1, §9, §0.1, and §11 (OQ-4's ruling).
