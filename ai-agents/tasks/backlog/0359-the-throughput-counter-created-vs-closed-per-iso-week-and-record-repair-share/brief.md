# The throughput counter — created vs closed per ISO week from git, plus the record-repair share, AND the `/fkit-status` line that currently forbids the claim

## ID
0359

## Sprint
Sprint 7

## Priority
P11

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Why this exists: Sprint 7's success criterion is unmeasurable without it

**Owner ruling, 2026-08-29, `AskUserQuestion`, live `fkit lead` session — option label, verbatim:
"Cap record repair, not process work (Rec)".** Sprint 7's stated success criterion is
**record-repair rows under 10% of open work**, down from **33% today**. ⛔ **Nothing in this repo can
compute that number.** This task builds the thing that can — otherwise the sprint ends with an
unfalsifiable claim about whether it worked.

⭐ **Note what the ruling did NOT say: there is no cap on process work at all.** A counter that
reports process work as if it were over budget has misread the ruling.

### The baseline this must be able to reproduce — measured 2026-08-29

| Measure | Value |
|---|---|
| Open task folders in `ai-agents/tasks/backlog/` | **129** |
| Rows whose title's leading verb marks a record repair | **45** (**34.9%**) |
| …excluding the three that repair genuine **source** defects (`0215`, `0234`, `0334`) | **42** (**32.6%**) |
| Target, per the owner's ruling | **under 10%** |

⚠️ **The two readings differ by three rows because the rule is not written down** — and writing that
rule down is half of this task's deliverable. **Do not treat 42 or 45 as given.** The script's rule is
the definition, and the close report must state which figure it reproduces and why
([`evidence-before-assertion`](../../../knowledge-base/conventions/evidence-before-assertion.md)).

### ⛔ THE HALF THAT GETS FORGOTTEN — the skill currently FORBIDS the claim this script makes

`claude/skills/fkit-status/SKILL.md`, in the Backlog board's beat-1 headline row, currently reads:

> *"**Do not say whether the backlog is growing or shrinking** — you are reading one snapshot, and the
> source set has no history to ground a trend in."*

⛔ **That line is correct today and becomes wrong the moment this script exists.** Its stated reason —
*"the source set has no history"* — is precisely what this task supplies. **Ship the script without
amending the line and the project has a tool it has forbidden itself to quote.** The two edits are one
unit; a close that lands only the script has half-shipped.

⭐ **The amendment is narrow.** The prohibition is lifted **only** where a measurement backs the claim.
Reading a snapshot and asserting a trend stays banned — that is the actual error the line was written
against, and it must survive the edit.

## What to build

**Two things, in one task, because neither is correct without the other.**

### 1. The counter script

- **Counts created vs closed per ISO week, derived from git history** — not from a snapshot. Creation
  is when a task folder first appears; closure is when it moves into `done/` or `cancelled/`. ⚠️ **Task
  folders were introduced by a migration** ([ADR-029](../../../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md)
  and its task-0103 rename): history before that point has a different shape. **Say what the script
  does with it** — a stated horizon is fine, silently wrong counts are not.
- **Reports the record-repair share of open work**, by **a rule written into the script** — not a
  heuristic applied by hand at report time. The rule must be readable, and the script must be able to
  list which rows it classified each way, so a disputed row can be checked.
- **Deterministic and dependency-free.** ⛔ No new devDependency (ADR-014). Machine-readable output in
  the shape `dashboard.sh` already uses, so a status run can quote it rather than re-derive it.
- **⚠️ Where the file lives is a real decision, not a detail.** A new file under `claude/` engages the
  install share's **structure-spec and hash manifest** — `test/structure-spec.test.js`,
  `test/structure-manifest.test.js` and `claude/skills/fkit-heal/check.sh` all have to learn about it,
  and `/fkit-heal` will report it. A file under `bin/` does not. **Decide deliberately, state the
  reason, and if it goes under `claude/`, update every consumer in the same task.**

### 2. The `/fkit-status` amendment

- Amend the quoted line in `claude/skills/fkit-status/SKILL.md` so a **measured** growth/shrink claim
  is permitted **and sourced**, while an **unmeasured** one stays forbidden.
- ⛔ **Keep the original prohibition's teeth.** The amended line must still forbid asserting a trend
  from a snapshot. A rewrite that simply deletes the ban has failed this task.
- Say **where** the status run gets the number from — name the script — so the permission and its
  source are one sentence, not two.

⛔ **Constraints:**

- **⛔ Do not change what `dashboard.sh` outputs or how it parses a board.** It is a contract with
  `test/dashboard-contract.test.js` and both task movers. The counter is a **new** producer of facts,
  not a change to the existing one.
- **⛔ Do not change any task's `## Status`, and do not move any task folder** (ADR-033). This script
  **counts**; it never closes.
- **⛔ Do not write `ai-agents/wiki-vault/`** (ADR-005).
- **⛔ No `path:NNN` citations** in the script, its comments, or the skill edit — anchor on quoted text
  ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  ⚠️ This matters more than usual here: `0344` is on the board because `bin/release.mjs`'s fenced
  summary block accumulated exactly this drift.
- **⛔ Do not invent a cap on process work.** The ruling caps record repair only.

## Verification steps

1. The script runs from a clean checkout with `node`/`bash` only — **no `package.json` change, no new
   dependency**. Show the run.
2. **It reproduces the 2026-08-29 baseline**: report its record-repair share against **45 / 129
   (34.9%)** and **42 / 129 (32.6%)**, say which it matches, and explain the difference. ⛔ If it
   matches neither, that is a finding to report, not a number to adjust.
3. The classification rule is **in the script**, and the script can **list the rows on each side**.
   Show the list; spot-check five rows by hand against it and report any it gets wrong.
4. The per-ISO-week created/closed counts are **derived from git**, and the script's behaviour at the
   pre-task-folder history horizon is stated and demonstrated.
5. **`git diff` shows `claude/skills/fkit-status/SKILL.md` modified.** ⛔ A diff without it has
   half-shipped this task — state this explicitly in the close report.
6. The amended line **still forbids an unmeasured trend claim**. Quote the before and after text side
   by side in the close report.
7. If the script landed under `claude/`: `test/structure-spec.test.js`, `test/structure-manifest.test.js`
   and `claude/skills/fkit-heal/check.sh` all pass and account for it. If under `bin/`: say so and show
   the structure tests unchanged.
8. `test/dashboard-contract.test.js` passes **unchanged** — prove `dashboard.sh`'s contract was not
   touched.
9. `npm test` passes, including `test/prove-red.sh`'s hard gate, and mutating the counter makes it
   fail. **Report the red run, not only the green one.**
10. `git diff --stat` shows zero files modified under `ai-agents/wiki-vault/` and no task folder moved.

## Notes

- **Depends on:** nothing. ⭐ **Independent of the whole `0353`→`0358` chain** — it may run at any
  point in Sprint 7 and does not wait on the guards.
- **Blocks:** `0360` in practice, not by rule — `0360` cuts the release and hand-archives Sprint 7, and
  the archived board's success-criterion line is checkable only if this script exists. **Sequence it
  before `0360`; treat it as soft.**
- ⭐ **This is the row that makes Sprint 7 falsifiable.** Without it the sprint can be declared a
  success by assertion. Say so in the close report.
- ⚠️ **Two deliverables, one task, and that is deliberate** — it is the one exception to the
  smallest-shippable split here, because a script whose claim the skill forbids is not independently
  shippable. Stated so a later reader does not read it as a missed decomposition.
- **Priority `P11` is a rank on Sprint 7's board, assigned in the same act that ranked the board on the
  owner's ruling of 2026-08-29** — see [`sprint-7.md`](../../../sprints/sprint-7.md) §"⭐ THIS BOARD IS
  RANKED". Rank is board position, never identity
  ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
- **Source:** Sprint 7 scope, owner rulings *"Approve all 12 as proposed (Rec)"* and *"Cap record
  repair, not process work (Rec)"*, both 2026-08-29, `AskUserQuestion`, live `fkit lead` session.
</content>
