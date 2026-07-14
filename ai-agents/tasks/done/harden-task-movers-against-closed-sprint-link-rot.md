# Stop the task movers from rotting links in closed sprint plans

## Sprint
Sprint 2

## Priority
22

## Status
✅ Done — **the owner ruled 2026-07-13 for the producer's recommendation** (re-point the href, never
the prose; the movers may write into `sprints/done/`). Implemented by fkit-coder.

## Context

Fixing the 6 broken links in Sprint 1 ([task 21](../done/repair-broken-links-in-closed-sprint-plans.md)) is a
one-off. **The recurrence is the real bug**, and it is a defect in fkit's own product source.

`/fkit-task-done` and `/fkit-task-cancelled` move a brief `backlog/` → `done/`/`cancelled/` and update
the **active** sprint plan. They do **not** re-point inbound links in a **closed** sprint plan under
`sprints/done/`. So **every future `/fkit-task-done` on a task carried over from an older sprint
silently breaks one more link in that older sprint's plan.** Sprint 1 has 5 such tasks and 6 such links
today; the count only grows.

**The gap is precise, and narrower than it looks.** `claude/skills/fkit-task-done/SKILL.md` step 4
already greps **recursively**:

```
grep -rn "<file>.md" ai-agents/sprints/ ai-agents/tasks/
```

That grep **already finds** the closed-sprint reference. It is step 5 that drops it: step 5 only knows
how to **flip a status marker**, and a `➡️ Moved` row has no status to flip — the row is
*historically correct*. So the reference is surfaced and then silently discarded. The skill is not
blind to these rows; it simply has no instruction for them. `fkit-task-cancelled/SKILL.md` has the
same shape.

That matters twice over: the fix is **cheap** (an instruction, not new search machinery), and the
"we never see the reference" defence is unavailable.

## ✅ Owner ruling (2026-07-13) — the open question below is CLOSED

**The owner ruled for the producer's recommendation: re-point the href, never the prose.** The mover
skills may write into `ai-agents/sprints/done/` for the sole purpose of repairing a dead pointer; a
closed sprint plan's status cells, priorities, and prose stay byte-frozen. Option B was not taken.
**Not open for re-litigation.** The question is preserved below as the record of why.

## ⚠️ Open question — the owner must rule before implementation *(answered above)*

**Should a task move re-point inbound links repo-wide, or are closed sprint plans immutable historical
records that are allowed to point at where a task *was*?**

**Producer's recommendation: re-point the href, never the prose.** A closed sprint plan's *claims* are
history and must not be rewritten — `➡️ Moved to Sprint 2 — priority 7` stays true forever. But a
**link is not a claim; it is a pointer to a file**, and a pointer to a file that isn't there is not
history, it is rot. Keeping the prose frozen and the href live preserves the historical record *and*
makes it navigable. Concretely: `➡️ Moved to Sprint 2 — priority 7` with the href re-pointed at
`tasks/done/…` reads exactly as it does today and actually resolves.

**The tradeoff, stated honestly:** it means the mover skills **write into `sprints/done/`** — a
directory the project currently treats as append-never-touch. That is a real widening of a skill's
write surface, and if the owner's model of "closed sprint" is *byte-frozen*, the honest alternative is
Option B and this task shrinks to documenting the exclusion.

**Option B (the alternative): declare closed sprint plans immutable.** Then the 6 links stay broken by
design, and any link checker needs a permanent `sprints/done/**` exclusion. The cost is that the
exclusion is **load-bearing and unbounded** — it permanently blinds the only mechanical check we have
over a directory that will keep growing, so a *genuine* break in a closed sprint plan would never be
caught. That is the reason the producer does not recommend it.

**This is a product/process call, not a technical one. fkit-coder correctly declined to decide it.**

## What to build

*(Scope below assumes the recommended ruling. If the owner picks Option B, this task collapses to item
C plus a documented exclusion, and the brief should be rewritten before any code is touched.)*

**A. Teach both movers to re-point inbound links**

- `claude/skills/fkit-task-done/SKILL.md`
- `claude/skills/fkit-task-cancelled/SKILL.md`

Step 4's grep already surfaces every inbound reference. Add a step-5 rule for the case it currently
drops: **for any reference whose href points at the task's old path, update the href to the new path —
and change nothing else on that line.** Explicitly:

- **The row's status cell and prose are not touched.** A `➡️ Moved` row keeps saying `➡️ Moved`. This
  is not a status update; it is a pointer repair.
- It applies **wherever the reference lives**, including `ai-agents/sprints/done/` and prose links,
  not only status-table rows in the active plan.
- The existing ambiguity discipline (step 6 — *never paper over it*) carries over unchanged: if a
  reference is ambiguous, **report it, do not guess.**

**B. Say so in the skills' report contract**

Each mover's report must list the re-pointed links alongside the status rows it updated, so a move that
quietly rewrote a closed sprint plan is **visible in the report**, not a surprise found later by a
sweep.

**C. Re-run init**

`claude/fkit-claude-init.sh .` — this repo's `.claude/skills/` are gitignored copies regenerated from
`claude/`. Until it is re-run, **this repo's own movers still carry the old procedure**, and the very
next `/fkit-task-done` re-breaks a link.

## Verification steps

- Read both `SKILL.md` files end to end and confirm the new rule sits in the step-4/step-5 flow rather
  than as a bolt-on appendix — the grep that finds the references and the instruction that acts on them
  must be adjacent, or the next editor will drop it again.
- **Exercise it, do not just read it.** In a scratch copy of the repo: take a task that is referenced
  from a *closed* sprint plan by a `➡️ Moved` row, run `/fkit-task-done` on it, and confirm
  (a) the href in the closed plan now points at `tasks/done/`, (b) the row's status cell and prose are
  **byte-identical** to before, and (c) the skill's report names the re-pointed link.
- Repeat once for `/fkit-task-cancelled`.
- Re-run the link sweep from task 21: still **zero unresolvable links** under `ai-agents/**` after the
  simulated move. This is the check that proves the recurrence is actually closed.
- Confirm no other skill or agent under `claude/` documents `sprints/done/` as never-written; if one
  does, it needs updating in the same pass or the two contracts now disagree.

## Notes

- **Owner: fkit-coder.** This is product source under `claude/` — outside the producer's and the
  architect's write authority.
- **Depends on:** the owner's ruling above. **Does not depend on task 21** — 21 fixes today's 6 links,
  22 stops tomorrow's. Either can land first; both are needed. Landing only 21 means the links rot
  again on the next carried-over completion.
- **Do not fix the 6 links here.** That is task 21. Keeping them separate is what lets 21 ship while
  this one waits on the owner.
- **Suggested follow-up, deliberately NOT in scope: a mechanical link checker.** This repo has **no
  test suite and no link check at all** — the only reason this defect was found is that fkit-coder
  hand-rolled a sweep. Every verification step above (and in task 21) is currently manual, which is
  precisely how this rotted unnoticed in the first place. There is already an unsprinted
  [`add-e2e-smoke-script-for-fkit-itself.md`](../cancelled/add-e2e-smoke-script-for-fkit-itself.md) that is the
  natural home for it. **Producer's position: worth doing, and it belongs there, not smuggled in
  here** — a checker that lands inside this brief would ship untested alongside the very change it
  exists to test. Flagged for the owner as a scoping question, not decided.
- Risk: **low technically, moderate in principle.** The edit is a few lines of skill prose. What is
  actually at stake is a **process rule** — whether a closed sprint plan can ever be written to — and
  that is why it is owner-gated rather than a coder's judgement call.
