# Worklog — Report the Backlog board in `/fkit-status` on request only

**Task:** [`report-backlog-board-in-fkit-status-on-request-only.md`](./brief.md)
· **Sprint 2, priority 68** · **Plan:** [`plans/report-backlog-board-in-fkit-status-on-request-only.md`](./plan.md)
· **Ledger:** [`reviews/report-backlog-board-in-fkit-status-on-request-only.md`](./review.md)

**Status: 🔄 In progress — READY FOR DONE.** Implemented, reviewed (round 1, all 7 findings resolved),
re-verified green. Awaiting the owner's `/fkit-task-done`; this loop never sets `✅ Done`.

---

## The headline: I introduced a regression, and the review caught it

Giving `backlog.md` a `Backlog` plan identity — which fixed a false `unresolved-plan-sprint` drift —
**silently activated drift rule 1's skip.** A brief reading `## Sprint: Sprint 2` while its row still
sat on the backlog board **was reported as drift before my change and was silent after it.**

That is the backlog board's single most valuable finding: *scheduled, but never moved off the
unscheduled board.* Worse, it **contradicted skill text I wrote in the same task**, which tells the
reader that an in-progress backlog row is "a finding, not a status" — the script was guaranteeing the
skill would never see one.

**I told the reviewer the opposite.** My review request claimed *"I claim only drift rule 1 is
affected, and that the effect is correct."* Both halves were wrong: three consumers changed, and the
rule-1 effect was a loss, not a gain. I asked them to challenge it, they did, and they were right. I
reproduced the A/B myself before accepting it.

**The lesson, stated plainly:** I reasoned about rule 1 instead of running it. The repo already has a
convention for this — [`evidence-before-assertion`](../../../knowledge-base/conventions/evidence-before-assertion.md) —
and this is the second time in this sprint's lineage that a claim about shell behavior was asserted
rather than executed.

## Owner-decision log

### Questions put to the owner

| # | Question | Owner's answer |
|---|---|---|
| 1 | Approve the plan (batch approval covering all six planned tasks) | **Approved**, 2026-07-18 |
| 2 | Every FACTS record keys `?` on the backlog board (`—` priorities), collapsing distinct drifted rows into one unattributable entry — stem, `?`, or row ordinal? | **Brief filename stem** |
| 3 | **R1**: rule 1's skip now hides scheduled-but-on-backlog drift — suppress the skip, add a dedicated fact kind, both, or accept? | **Suppress rule 1's skip on the backlog board** |
| 4 | **R4**: backlog identity matched on basename only — accept as intentional, or tighten to the canonical path? | **Accept basename-only as intentional** |

### Obvious winners chosen without asking

| Choice | Why it was a winner |
|---|---|
| Sanitising the stem to `[A-Za-z0-9._-]` (R2) | Preserves the owner's stem ruling exactly; the ruling was stem-vs-`?`-vs-ordinal, not "don't sanitise it". A defect fix, not a re-decision. |
| Adding `set -f` | `$DRIFT_TASKS` is word-split unquoted, so the legacy `?` sentinel could expand to a 1-char filename beside the caller and report drift on a task named after an unrelated file. One line, no intentional globbing in this script. **Disclosed rather than buried — it changes global shell behavior.** |
| Rewriting moot-beats 1 and 4 to be groundable (R3) rather than widening the source set | Widening would reverse `SKILL.md:71-83`, a change of direction. Making the asks groundable stays inside the plan. |
| Fixing R6 by correcting the comment, not strengthening the test | A fixture genuinely cannot guarantee the live tree's briefs. Removing a false claim beats faking coverage. |

---

## What changed

| File | Change |
|---|---|
| `claude/skills/fkit-status/SKILL.md` | `Backlog` as a third argument target, with the one-skill-one-output reasoning recorded; moot-beats table for the backlog board (beats 1 and 4 groundable per R3); `⟦FACTS⟧` grammar mirror gains the third `drift disagreement` shape and the note that `<task>` is not always a number |
| `claude/skills/fkit-status/dashboard.sh` | `backlog.md` → `Backlog` identity (basename-matched, R4); a dedicated rule-1-suppressing arm for the backlog board (R1); FACTS id falls back to a **sanitised** brief filename stem (R2); `set -f` |
| `test/dashboard-contract.test.js` | backlog fixture helper + 11 cases total, incl. two R1 regression guards and the rule-1-still-works mirror |

**Not touched:** launcher, `skills-for-role.sh`, scaffold, wiki. No task-file move, no commit.

## Verification evidence

From the run after the final change.

```
$ npm test
ℹ tests 362   ℹ pass 362   ℹ fail 0

$ bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md   → exit 0
$ bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md  → exit 0, output unchanged, still keyed by number
```

**Both refuted claims re-proved after fixing:**

| | Before fix | After fix |
|---|---|---|
| R1 — brief says `Sprint 2`, row on backlog board | *(silent)* | `drift disagreement a … brief_sprint="Sprint 2" location="backlog/"` |
| R2 — briefs named `my task.md`, `re[a]d.md` | `drift on tasks my, re[a]d, task` (3 names, 1 phantom) | `drift on tasks my-task, re-a-d` (2 names) |

**Mutation checks** (before the review round): removing the backlog identity → 2 failures; removing the
stem fallback → 2 failures.

## The brief's verification steps, walked

| Criterion | Result |
|---|---|
| `/fkit-status` (no arg) byte-equivalent in board choice — active sprint only | ✅ met — `backlog.md` is outside the `sprint-*.md` glob **by construction** |
| `/fkit-status Backlog` renders the board with non-applicable beats marked moot, not invented | ⚠️ **skill text verified by read, not by a live run** — the beats are LLM-executed prose. R3 showed why this matters: two beats *instructed a fabrication* and only a careful read caught it. Flagged, not claimed. |
| `/fkit-status Backlog` with no board reports absence, creates nothing | ⚠️ same — specified in the skill text, read-verified only |
| Test suite green including backlog fixtures | ✅ met — 362/362 |

## Problems encountered

- **The R1 regression** — above.
- **The stem fallback was unsafe as first written.** I told the reviewer I believed stems were always
  single tokens and asked them to attack it; they broke it in one attempt. A filename with a space
  produced a phantom task in the roll-up.
- **The reviewer could not write its own ledger** (harness subagent file-write restriction) and returned
  its findings as text for me to transcribe. I created the ledger and **recorded the provenance
  explicitly**, because a reader must be able to tell a transcribed reviewer finding from a
  coder-authored one. The transcription is verbatim and unedited.

## Lessons learned

- **"Only X is affected" is a claim to enumerate, not to assert.** There were three consumers of
  `PLAN_SPRINT`; I named one. Grepping the variable would have taken seconds.
- **Giving something an identity turns on every rule that was dormant because it had none.** The
  identity fixed one thing and silently armed another. Any change that makes a previously-empty value
  non-empty deserves a walk of every guard that tests it for emptiness.
- **Asking the reviewer to attack a specific claim works.** Both refutations came from questions I
  posed about my own weakest reasoning. Naming your uncertainty is cheaper than defending it later.

## Open questions / residuals

- **None blocking.**
- **Accepted residuals** (recorded in the ledger): `Backlog` is a target selector not an output
  variant; the identity is basename-matched.
- **Named for the producer, not filed by me:** `gate-read-side-symlink-hazard-in-init.md` still has no
  `## Status` section — independently confirmed by the reviewer as real, pre-existing data drift.
- **Follow-up already scoped:** task 69 (wiki sync) hard-depends on 67 **and** 68, both now ready.

## Commit state

**Nothing committed.** All edits left in the working tree for the owner.
