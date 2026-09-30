# Revisit whether fkit needs a tripwire hook against hand-moved task folders

## ID
0416

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

> ## ⛔ DO NOT IMPLEMENT THE TRIPWIRE. This is a REVISIT task, not a build task.
> Its only output is a **recommendation to the owner**, backed by evidence from real use. No hook, no
> settings change, no code. If the recommendation is "build it", building it is a **separate, new**
> task the owner approves on its own.

**Owner ruling, 2026-09-30** — given in a `fkit lead` session, his own words (may be quoted):
*"Don't implement it, add a task to the backlog with low priority, that will require to think about
this feature again after some time (e.g. after a month of using a new version of fkit), after we
understand if such situations ever happen"*.

### What "it" is

On 2026-09-30 the owner decided to fold aiboard **into** fkit: aiboard becomes fkit's built-in board
and the single task/sprint store. ⚠️ **That design is still under discussion and not approved to
start** — see
[`2026-09-30-eval-aiboard-as-fkits-single-task-store.md`](../../../knowledge-base/reports/2026-09-30-eval-aiboard-as-fkits-single-task-store.md)
and
[`2026-09-30-design-cli-door-enforcement-addendum.md`](../../../knowledge-base/reports/2026-09-30-design-cli-door-enforcement-addendum.md).

In that design **the folder is the status**. So an agent can close a task without the board at all —
a plain folder move between task-status folders, e.g. `mv tasks/backlog/0404-… tasks/done/`. That
skips the board's own close, which is what checks *producer-only*, records who closed it and how (the
close record), and writes the `(agent-closed — not owner-verified)` marker.

The **tripwire** is a hook that would refuse such a hand move when an agent types it. The addendum
calls this *"the biggest gap — needs no aiboard at all"* (§4, row 6) and is honest about its limits
(§3.3): it catches only the plain spellings, and it **will refuse some legitimate commands**. Its open
question **Q-C4** asked whether to add it; the owner's answer is the ruling above — not now, look
again after real use.

### What is NOT this task

**Detection** — the board's check flagging *a closed task with no close record*, surfaced by
`/fkit-status` (addendum §5, requirement R24) — is **part of the main merged-board design**, not this
task. This task **reads** detection's output as its evidence; it does not build detection.

### Scenarios to look for (as the lead listed them to the owner)

1. Agents falling back on the **old `mv`-based movers** out of habit.
2. **Improvisation after compaction** cuts a skill's text, so the agent moves the folder itself.
3. An agent **working around a board refusal** (e.g. a non-producer tries to close, is refused, then
   moves the folder).
4. A **non-fkit session** — plain `claude`, Codex, or a generic subagent — with no fkit hooks.
5. A project with a **stale fkit install** that still carries the old movers.

⚠️ Scenario 4 is one a tripwire hook **cannot** stop (addendum §4 row 11: no fkit hooks run there).
The recommendation must say which of the observed cases a tripwire would actually have caught.

## What to build

**No code.** A short evidence review and a recommendation, in this order:

1. **Confirm the gate is open** (see Notes): the merged-board fkit has been in real use for roughly a
   month, **and** the owner has approved starting this task.
2. **Gather the evidence** from that period, across every project running the new fkit that the owner
   points to:
   - every *"closed with no close record"* finding from the board's check / `/fkit-status`;
   - worklogs and review ledgers that show a task folder moved by hand, or an agent reaching for a
     folder move after a board refusal;
   - anything the owner himself noticed.
3. **Classify each case** against the five scenarios above, and for each say whether a tripwire would
   have caught it (plain form vs indirect form vs no-hook session).
4. **Bring the owner one recommendation** — **build the tripwire** or **keep detection only** — with the
   count of real cases, what the tripwire would have prevented, and its known cost (false refusals,
   addendum §3.3). If the recommendation is "build", say so and name what a build task would need;
   consult `fkit-architect` for the current cost/risk if the design has moved since the addendum.
5. **Record the outcome** the owner rules: close this task, and — only if he says build — file the build
   task as a new brief.

## Verification steps

1. **No code, hook, or settings change** exists from this task — the change set is Markdown only.
2. The recommendation states the **evidence period** (dates) and **which projects** were checked.
3. It gives a **count** of hand-move cases found (zero is a valid answer), each one cited to its source
   (check output, worklog, or owner report) and tagged with one of the five scenarios.
4. For every case it says whether a tripwire **would or would not** have caught it, and why.
5. It ends in **one** recommendation (build / detection only), with the owner's ruling recorded in the
   worklog.

## Notes

- **Depends on:** [`0458`](../0458-pilot-convert-fkit-itself-trial-run-owner-reads-apply-owner-commits/brief.md) (fkit converted to the merged board — real use starts there) plus roughly a month of that use, and the detection it reads as evidence: [`0428`](../0428-make-check-flag-closed-tasks-with-no-close-record-or-a-record-that-does-not-fit-its-door/brief.md) (`fkit board check`) and [`0451`](../0451-rewrite-fkit-status-and-dashboard-sh-over-fkit-board-json/brief.md) (`/fkit-status` shows it). *(Updated 2026-09-30 with the real ids, as the original line asked; see the dated note below.)*
- **Blocks:** nothing.
- ⛔ **Two gates, both required, before this starts:** (a) the dependency above is met, **and** (b) the
  owner **specifically approves starting it** — his standing rule for the aiboard-merge initiative. Being
  pullable on the board is **not** approval.
- **Timing:** "roughly a month" is the owner's own example (*"e.g. after a month"*), **not a
  deadline**. No date is set here; the owner decides when enough real use has passed.
- **Needs detection to exist first:** the main design's close-record check (addendum §5, R24) is the
  main source of evidence. If it was never built, say so in the recommendation — the evidence is then
  worklogs and owner reports only, and weaker.
- Filed by a spawned `fkit-producer` on a relayed ruling (no owner channel, ADR-021); decides nothing
  beyond the scoping.

> ## DATED NOTE 2026-09-30 — the merged-board design is now DECIDED (ADR-052). This task is unchanged in scope. Every prior byte above is left identical except the `Depends on` line, which asked to be updated.
>
> - **Decided:** [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) was accepted on 2026-09-30 (owner approval A1). The *"still under
>   discussion and not approved to start"* wording in `## Context` described that morning; the design
>   is now approved, and ⛔ **still not started** — each phase starts only on the owner's word.
> - **Consistent with ADR-052:** D5 layer 5 — *"Hand-move tripwire — Not built (R8). Task `0416`, low
>   priority, to revisit after about a month of use"*; D11 — *"`0416` … stays in the backlog, low
>   priority."* Nothing here conflicts.
> - **The two reports linked in `## Context` are superseded** by the approved decision document
>   (they carry dated superseded-by notes); they stay valid as evidence. Detection is ADR-052 D5 layer 4.
> - ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).**
>
> *Recorded by a spawned `fkit-producer` with no owner channel (ADR-021). ⛔ No commit.*
