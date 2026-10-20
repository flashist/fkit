# Have the lead offer a retro once, after a verified sprint close

## ID
0533

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being filed, or on the board, is not his
> word.

**Where this comes from.** The owner's request (2026-10-09, quoted in
[`0500`](../../done/0500-research-and-decide-how-fkit-runs-a-sprint-retrospective/brief.md)): *"I want the lead
to suggest running a retrospective (retro) with the user after each sprint is closed."* `0500`'s
2026-10-20 Notes section records the rulings and the trigger the research agreed on; the ADR from
[`0531`](../0531-record-the-adr-for-how-fkit-runs-a-sprint-retro/brief.md) records it as an amendment
to ADR-031's lead remit. This task implements that offer; the skill it offers is `0532`.

**Why "verified", and why not at "Sprint shipped".** The ship-loop's *"Sprint shipped"* state means
*"every eligible task CLOSED"*, not that the sprint board is closed — Sprint 13 needed a separate
*"Sprint 13 is all done. Close it now?"* ruling before `/fkit-sprint-done` ran (architect report §6).
Sprint closes run through a spawned producer on the lead's instruction, so the lead knows a close landed
only after it reads disk.

## What to build

1. **The offer, in the lead's prompt (`claude/agents/fkit-lead.md`)** — and in
   `claude/skills/fkit-sprint-ship-loop/SKILL.md` too if the plan finds the ship-loop is where the lead
   instructs a sprint close (the plan says which, with the evidence). The rules, from the ADR:
   - **When:** only after the lead has **verified** that a `/fkit-sprint-done` or
     `/fkit-sprint-cancelled` close **landed** — the board is in `sprints/done/` or `sprints/cancelled/`
     and `dashboard.sh` reads its line-3 banner as `✅ Done` or `⛔ Cancelled`. Whether the close came at
     the end of a ship-loop run or by a direct instruction.
   - **Never** at the ship-loop's *"Sprint shipped"* state, and never before the close is verified.
   - **Once.** Never repeated for the same close; never run automatically.
   - **Declinable.** Asked with `AskUserQuestion` per `conventions/asking-the-owner.md` (so *"Explain
     more, then ask again"* is the last option). The options include the subject (*this sprint* or
     *every sprint since the last retro*, ruling 2) and a decline.
   - **A decline writes nothing** — no board text, no note, no file.
   - Accepting runs `/fkit-retro` (`0532`) in the same lead session.
2. **Say honestly that it is prose-enforced only.** Nothing checks that the lead offered, or that it
   did not force the retro (architect report §6). No test is added for it (ruling 3; the coder's angle
   judged a hook too heavy, recommendation §4.3).
3. **Mirrors.** If `claude/README.md`, `claude/skills/fkit-team/SKILL.md`, `claude/scaffold/CLAUDE.md`
   or `ai-agents/knowledge-base/architecture.md` describe what the lead does at sprint close, update
   them to match; the plan lists each one checked.

**Out of scope:** the skill itself (`0532`); the fkit-feedback file (`0534`); any test or hook; any
change to the four movers; saving the ship-loop's sprint roll-up (not filed).

## Verification steps

1. `grep` on `claude/agents/fkit-lead.md` (and on the ship-loop skill, if the plan put the offer there)
   shows: the offer comes only after a **verified** `/fkit-sprint-done` or `/fkit-sprint-cancelled`
   close; never at *"Sprint shipped"*; once; declinable; a decline writes nothing; never automatic;
   prose-enforced only; it runs `/fkit-retro`.
2. The offer's question follows `asking-the-owner.md`: explain first, recommended option first, and
   *"Explain more, then ask again"* last, with its exact label and description.
3. Every mirror the plan checked is either updated or named with the reason it needs no change.
4. No test file, hook, or mover skill changed: `git status --porcelain test/ claude/*.sh
   claude/skills/fkit-sprint-done claude/skills/fkit-sprint-cancelled` shows nothing from this task.
5. One smoke check in a **relaunched** `fkit lead` session (after `claude/fkit-claude-init.sh .`; an
   agent-prompt change reaches only a relaunched session): the lead's prompt carries the new rule. A
   real offer at a real close is part of `0535`'s trial, not this check.

## Notes
- **Depends on:** 0532
- **Blocks:** 0535
- **Related:** `0500`; `0531` (the ADR and its ADR-031 amendment); `0524` (sprint goal reported at
  close — a neighbour at the same moment, not a dependency).
- ⛔ **Do not start without the owner's specific word.**
- **Knock-on (stated per `placement-questions-state-the-knock-on.md`):** filed on the **Backlog board**
  (owner ruling 5, 2026-10-20). It waits on `0532` (Backlog). `0535` waits on it, on the Backlog board.
  Nothing in Sprint 12 or Sprint 14 waits on it (checked 2026-10-20).
- **Why its own brief:** a separate edit (the lead's prompt, not the skill), shippable and checkable on
  its own once the skill exists. The owner can use `/fkit-retro` by hand before the offer ships.
- **Owner choice:** `fkit-coder` — an agent-prompt edit is build work.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`.
- Filed 2026-10-20 by a spawned `fkit-producer` on owner rulings relayed by `fkit-lead` (no owner
  channel, ADR-021). No commit.
