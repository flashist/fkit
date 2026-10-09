# Make every sprint-placement question state which tasks would then wait on that sprint

## ID
0495

## Sprint
Sprint 10

## Priority
P15

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.
> The sprint ship-loop's per-task plan approval, given live by the owner, is where that word is given.

**The incident and the owner rulings** are recorded in full in
[`0492`](../../done/0492-flag-a-sprint-task-that-hard-depends-on-an-open-later-sprint-task-as-a-dashboard-drift-record/brief.md)'s
*Context*. In short: in a consuming project (geoconflict), the owner approved an option the lead had
marked "(Recommended)" that filed a verify task into the next sprint and re-pointed a current-sprint
task at it. **The question never said** that this task and 5 tasks behind it would then wait on the
next sprint. The owner could not weigh a cost nobody showed him.

**Owner ruling (c), 2026-10-05:** *"Say the knock-on in questions"* — any `AskUserQuestion` that places
a task in a sprint must state the downstream consequence when existing tasks depend on it (e.g. *"X and
N tasks behind it would then wait on Sprint M"*).

**Independent of `0492`–`0494`.** This is prose in the instructions of whoever builds such questions; it
needs no tool. It can ship first, last, or alongside the others.

**Overlap, flagged — not a dependency.** ADR-052 phase-5 tasks `0453` (both ship loops) and `0457`
(agent prompts) rewrite some of the same files. Neither has started. Build on the current tree.

## What to build

1. **Find the homes.** Every place in `claude/` that tells a role to put a sprint-placement or
   dependency-changing choice to the owner — at least the lead (`claude/agents/fkit-lead.md`), the
   producer (`claude/agents/fkit-producer.md`), `/fkit-task-brief`, and both ship-loops' relay steps
   (`fkit-sprint-ship-loop`, `fkit-task-ship-loop`). The plan lists every home found and why each is one.
   Prefer **one rule stated once** in a shared place the others point to, over the same paragraph
   pasted six times — the plan says where, and how the others reach it.
2. **The rule:** before offering an option that puts a task in a sprint, or re-points a dependency, the
   question states — for each option — which existing open tasks depend on the task, and which sprint
   they would then wait on. Plain words, in the option's description: *"`<task>` and N tasks behind it
   would then wait on Sprint M."* When nothing depends on it, say nothing extra.
3. **The same rule applies to a `NEEDS-DECISION` returned by a spawned worker**, since the lead relays
   those as `AskUserQuestion` options — the worker writes the knock-on into its options.
4. **The "(Recommended)" mark does not excuse it.** The recommended option states its knock-on like the
   others.
5. Edit the canonical sources under `claude/`, never the `.claude/` copies.

## Verification steps

1. The plan's list of homes is reviewed; each listed file carries the rule or a pointer to its one
   home (diff review).
2. Grep check: each of the files named in *What to build* §1 mentions the knock-on rule or links its
   home.
3. The rule's text includes the example form, the `NEEDS-DECISION` case, and the "(Recommended)" case.
4. Nothing beyond the prose changes — no tool, no test behaviour (diff review).
5. `node --test test/reference-integrity.test.js test/task-id-uniqueness.test.js` passes, and any
   test pinning a rules-block or prompt size budget still passes.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- Filed 2026-10-05 by a spawned `fkit-producer` on `fkit-lead`'s instruction, under the owner rulings
  recorded in `0492`. ⚠️ `P15` is append rank, NOT a merit ranking — append is also the owner's placement ruling
  (*"Sprint 10, at the end"*). **On merit this belongs directly below `0494`, where it is** — it has no
  dependency, so its place among the four is free; it is last only because the tool briefs come first
  in dependency order.
