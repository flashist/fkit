# Worklog — Add a Backlog board, the default home for unsprinted task briefs

**Task:** [`add-backlog-board-default-for-unsprinted-task-briefs.md`](../tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md)
· **Sprint 2, priority 67** · **Plan:** [`plans/add-backlog-board-default-for-unsprinted-task-briefs.md`](../plans/add-backlog-board-default-for-unsprinted-task-briefs.md)
· **Ledger:** `ai-agents/reviews/add-backlog-board-default-for-unsprinted-task-briefs.md`

**Status: 🔄 In progress — READY FOR DONE.** Implemented, reviewed (round 1, all findings resolved),
re-verified green. Awaiting the owner's `/fkit-task-done`; this loop never sets `✅ Done`.

## Review — round 1, all findings resolved

**Ledger:** [`reviews/add-backlog-board-default-for-unsprinted-task-briefs.md`](../reviews/add-backlog-board-default-for-unsprinted-task-briefs.md)
· **Verdict: changes requested — 8 defects, 1 high.**

**✅ Codex coverage FULL — `codex-cli 0.144.4` completed.** Genuinely model-diverse; no degradation.

All 8 verified against the code before acting; **all 8 CORRECT, none disputed, all 8 fixed.** Four
(R2, R5, R6, R7) needed an owner ruling and were escalated rather than applied. The reviewer's summary
holds: **the core mechanism is sound** — the filename-outside-the-glob design, the backfill, and the
"designed exception" wording all survived adversarial reading. **Every defect was in the prose around
the board, not the board itself.**

### R1 (high) — the one I got wrong, and the reason a review exists

My pull-into-a-sprint convention said: add the sprint row, flip the backlog row to `➡️ Moved`. It
**never said to update the brief's own `## Sprint`**. `dashboard.sh`'s drift rule 2 compares a moved
row's target against exactly that field — so following my own instruction produced
`drift disagreement`, and because a drifted row **always renders** (task 65's safety valve, working
correctly), the row would never leave the board. **Every task ever pulled into a sprint would have
left a permanent drifted row behind.**

Both reviewers found it; I reproduced it independently on a scratch tree before accepting it, and
re-ran the repro after fixing: no drift, row correctly hidden. The convention is now **three mandatory
edits** with the forgettable one called out.

**The irony is worth recording:** the defect was only *visible* because task 65 made drifted rows
unhideable. Under the old show-everything board it would have been invisible noise among 70 other rows.

### The other seven

| # | Caught | Disposition |
|---|---|---|
| R2 | Moved marker omitted the mandatory `— priority M` | **owner: follow the vocabulary** — added, with `M` = the priority in the destination sprint |
| R3 | "Copy the existing board" is impossible on a fresh project's first run | required structure now carried **inline** in the skill |
| R4 | Step 8 still called the board write "optional" | rewritten — a board edit is mandatory |
| R5 | Both movers still taught "an unsprinted task has no board row" | **owner: fix now** — zero references is now itself worth reporting |
| R6 | **A 6th phantom site I missed** | **owner: fix now** — see below |
| R7 | Skill mandated `## Sprint: Backlog`; all 5 briefs said `Backlog (unsprinted)` | **owner: normalize the briefs** |
| R8 | Board claimed every brief reads exactly `Unscheduled`; one has a suffix | corrected |

**R6 is a correction to something I told the owner.** I reported the `sprint-backlog.md` phantom as
**5 sites** and asked for a ruling on that basis. There were **6** — both movers also listed
`Sprint backlog` as a `## Sprint` example. The owner's ruling was sound but was given on a number I
got wrong. Recorded rather than quietly folded in.

**R7 has a consequence beyond this task.** The reviewer flagged that once task 68 gives the board a
sprint identity, drift rule 1 starts comparing it to each brief's `## Sprint` — and a mismatch there
takes rule 1's **silent skip**, hiding real status drift on every backlog row. Normalizing the briefs
now is what prevents that. **Carried into 68.**

---

## Owner-decision log

### Questions put to the owner

| # | Question | Owner's answer |
|---|---|---|
| 1 | Approve the plan (batch approval covering all six planned tasks) | **Approved**, 2026-07-18 |
| 2 | The `sprint-backlog.md` phantom is referenced in 5 live places, outside my plan's file scope — fix now, fix the movers only, or defer? | **Fix all 5 now**, inside task 67 |
| 3 | An empty scaffold board template makes `dashboard.sh` exit 1 (false "malformed plan") — drop the template, or keep it and fix the empty case in task 68? | **Drop the template**; rely on the skill's create-if-absent |

### Obvious winners chosen without asking

| Choice | Why it was a winner |
|---|---|
| Re-derived the unsprinted list at build time rather than trusting the brief's list | The brief explicitly instructed this; it also caught a brief with a missing `## Status` the list didn't mention. |
| Board table format kept **byte-identical** to a sprint plan's | It is the entire reason `dashboard.sh` and both movers need no special-casing. Any "improvement" here costs parser compatibility. |
| Reported the malformed brief rather than repairing it | Brief content is producer territory, and "report drift, never repair it" is the standing rule. |
| Renamed step 7's heading ("only if a sprint was named" → "every brief gets a row, always") | The old heading became false the moment the no-sprint path also wrote a board. Leaving it would be drift shipped in the same commit that created it. |

---

## What changed

| File | Change |
|---|---|
| `ai-agents/sprints/backlog.md` | **NEW** — persistent unranked board; 5 backfilled rows; header documents the filename rule, the `—` priority rule, and how work moves on/off |
| `claude/skills/fkit-task-brief/SKILL.md` | no-sprint path files to the board; the designed exception to "never invent a sprint" stated explicitly and **scoped to exactly one filename**; Moved-on-pull convention recorded as the producer's act; step-7 heading corrected; frontmatter + two body references updated |
| `claude/skills/fkit-task-done/SKILL.md` | 2 × phantom `sprint-backlog.md` → `backlog.md` |
| `claude/skills/fkit-task-cancelled/SKILL.md` | 1 × phantom `sprint-backlog.md` → `backlog.md` |
| `ai-agents/README.md` · `claude/scaffold/ai-agents/README.md` | phantom reference corrected, **byte-identical in both homes** |

**Deliberately NOT done:** no scaffold board template (owner ruling 3); no `dashboard.sh` change (task
68's scope); no task-file move; no wiki write; no commit.

## The `sprint-backlog.md` phantom — the find of this task

The brief told me to keep the filename outside the `sprint-*.md` glob and *"do not name it
`sprint-backlog.md`"*. Grepping to confirm nothing already assumed that name turned up **5 live
references to it** — a file that has **never existed** in this tree:

- `claude/skills/fkit-task-done/SKILL.md:65, :143`
- `claude/skills/fkit-task-cancelled/SKILL.md:76`
- `ai-agents/README.md:9` and `claude/scaffold/ai-agents/README.md:8` — **the scaffold copy ships to
  every consuming project**

It was **already known and already deferred**: `tasks/done/add-task-plan-skill-to-producer.md:44`
recorded *"`ai-agents/README.md` references a `sprint-backlog.md` that doesn't exist in the tree. Not
[in scope]"*. Harmless while it was merely a phantom — **actively harmful the moment this task shipped
a real backlog board**, because it names the one filename that would match the glob and turn
unscheduled work into the reported active sprint. Escalated (outside plan scope) and fixed on the
owner's ruling.

## Verification evidence

From the run after the final change.

```
$ bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md
exit=0   — 5 rows rendered, roll-up `5 backlog  —  of 5`

$ ls ai-agents/sprints/sprint-*.md
ai-agents/sprints/sprint-2.md          ← backlog.md is NOT matched; default status run unaffected

$ npm test
ℹ pass 351   ℹ fail 0
```

- **Backfill cross-check:** all 26 backlog briefs enumerated by `## Sprint` field; exactly 5 read
  `Backlog (unsprinted)`; all 5 have a row; no sprint-assigned brief has one.
- **Mover compatibility (dry-read evidence, as the brief permits):** both movers sweep
  `ai-agents/sprints/*.md` **and** `grep -rn … ai-agents/sprints/` recursively. `backlog.md` matches
  both. The movers are owner-invoked, so no live run was performed — this is stated as a dry-read, not
  claimed as an execution.
- **Dual-home parity:** the changed README line is byte-identical in both homes (`diff` clean).
- **No residual `sprint-backlog.md`** outside the two deliberate warnings (the task brief's own
  instruction, and the board header's "do not normalize this name").

## The brief's verification steps, walked

| Criterion | Result |
|---|---|
| `backlog.md` exists, one row per unsprinted brief; no sprint-assigned brief has a row | ✅ met |
| Fresh `/fkit-task-brief` with no sprint → `## Sprint: Backlog` + a `backlog.md` row; a Sprint-2 run touches it not at all | ⚠️ **skill text verified by read, not by a live run.** The skill is LLM-executed prose; exercising it needs a producer session. Flagged, not claimed. |
| `/fkit-status` (no arg) resolves the active sprint exactly as before | ✅ met — `backlog.md` is outside the `sprint-*.md` glob **by construction** |
| Mover-compatibility check recorded | ✅ met — above, as a dry-read |

## Problems encountered

- **The scaffold template hard-failed the dashboard.** Shipping an empty board is not neutral: an empty
  table is indistinguishable from a malformed one to `dashboard.sh`, so a brand-new project's first
  `/fkit-status Backlog` would report a false "malformed plan". The brief's instruction to ship a
  template did not anticipate this; escalated, and the owner ruled it out in favour of create-if-absent.
- **A brief with no `## Status` section.** `gate-read-side-symlink-hazard-in-init.md` goes Sprint →
  Priority → Context. Its board row therefore reports `brief-missing-status` drift. **Reported, not
  repaired** — and it is a good first demonstration that the new board surfaces exactly the drift a
  board is for.

## Lessons learned

- **A "do not use name X" instruction is a reason to grep for X.** The brief said not to name the file
  `sprint-backlog.md`; it did not occur to the brief that five places already did. The instruction to
  avoid a name and the discovery that the name is already load-bearing elsewhere are one grep apart.
- **Shipping an empty instance of a new format is a decision, not a default.** Whether the empty case
  is representable at all is a question worth asking *before* shipping the empty case.

## Open questions / residuals

- **None blocking.**
- **Named for the producer, not filed by me:** `gate-read-side-symlink-hazard-in-init.md` needs a
  `## Status` section. Its board row will keep reporting drift until it gets one.
- **Carried into task 68 (its declared scope, not defects here):** rendering the backlog board emits
  `drift unresolved-plan-sprint` (the board has no `Sprint N` identity, so drift rule 1 is inert), and
  the `—` Priority cells make `task_id()` key every `⟦FACTS⟧` record as `?`. Neither breaks rendering;
  both need a decision in 68.
- **Follow-up already scoped:** task 68 (status read-side), task 69 (wiki sync). Both depend on this.

## Commit state

**Nothing committed.** All edits left in the working tree for the owner.
