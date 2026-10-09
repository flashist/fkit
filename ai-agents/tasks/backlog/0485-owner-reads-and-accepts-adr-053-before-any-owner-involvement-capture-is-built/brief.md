# Owner reads and accepts ADR-053 before any owner-involvement capture is built

## ID
0485

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

> ⛔ **Do not start without the owner's specific word.**
>
> ⛔ **This is an owner-only act.** No agent may accept ADR-053 or mark it `accepted`. The producer's
> job here is only to put the ADR to the owner, in a session where he is present, and record his answer.
> Until he accepts it, **every one of `0486`–`0491` stays blocked** (ADR-053 § Authority).

## Context

**Where this comes from.** This is brief **B0** of the Phase-B split of the gated umbrella
[`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md)
(its `plan.md` § 4, as amended by
[ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md)).

**Owner ruling behind the filing** (2026-10-05, given directly by the owner via `AskUserQuestion` in the
`fkit-lead` session, Sprint 10 `/fkit-sprint-ship-loop`; relayed to a spawned producer): **APPROVE
Phase B items 1–5** (capture; linking; the per-task line; the metric; privacy). **Item 6 (an approximate
historical count from local transcripts) is NOT approved** and has no brief.

**Why acceptance is a separate step.** The APPROVE was of `0482`'s `plan.md` § 3. Three review rounds
then changed the design. ADR-053 now **governs where it differs from `plan.md` § 3** (its Status
bullets). So the owner must accept the ADR text itself, knowing what changed. The APPROVE is **not**
that acceptance (ADR-053 § Status, § Authority).

**Where ADR-053 differs from the `plan.md` § 3 the owner approved** — the list ADR-053's Status bullets
enumerate, in plain words:
1. **D1 — what each log entry may hold.** Only fixed-format fields: time, session id, role, event kind,
   task id, command name, answer kind. Role and command name are kept only if they are on a known
   list; anything else is stored as `other`.
2. **D1 — where those known lists come from.** The launcher builds them fresh on every launch (from
   its role list and `skills_for_role()`) and hands them to the hook. The hook keeps no list of its own.
3. **D2 — task tags on questions.** If a question's text holds exactly one `[task NNNN]` tag, the hook
   keeps only the four digits. The question text itself is never kept.
4. **D2 — a new event kind, `expanded`.** Something that expands into a prompt but is not a normal
   slash command (for example an MCP tool's prompt) counts as your involvement, but never as proof the
   session was being watched. (Your ruling "Yes, count it", 2026-10-05.)
5. **D3/D7 — a new reason, `unknown (log-corrupt)`.** If a log line is damaged, any task whose window
   overlaps that day reads `unknown`, never autonomous. (Your ruling "Yes, mark unknown", 2026-10-05.)
6. **D4 — day files instead of one file per session.** See the plain-words line below.
7. **D5 rule (1) — a tagged question whose task is not bound in that session** still counts for the
   tagged task, and also counts as if untagged. A doubt adds involvement; it never removes it.
8. **D5 — the `unknown-session` rule.** If a session id fails its format check, the entry is kept under
   `unknown-session`. Those entries never prove a task was autonomous.
9. **D8 — how "typed messages" are counted.** Only your typed prompts are counted; a slash command
   counts once, not twice.

Also changed from `plan.md` § 3 by your own rulings of 2026-10-05: **no text is kept, even locally**
(OQ1); **retention is 30 days**, not 90 (OQ4); unattributed messages count and are shown separately
(OQ2); every typed message counts (OQ3).

**D4 in plain words (the exact rule you accept — ruling R9 "Accept, fix the wording"):** *"Each day's
log becomes deletable 30 days after that day starts, so some entries go up to a day early. Old files are
removed the next time fkit records something or writes a summary in that project — until then they stay
on disk (typically hours to days; forever if the project is never used again). What fkit reads never
goes back more than 30 days."*

**One thing nobody ruled, to put to the owner here.** These Phase-B briefs were filed **after** the
APPROVE but **before** the ADR is accepted, with this brief blocking all the others. That ordering was
found consistent by the reviewer and `fkit-architect`; **the owner never ruled on it** (ADR-053 § Owner
rulings, "Not owner rulings"). It stands unless he says otherwise here.

**What stays open at this step.** ADR-053's *Options considered* says dropping the feature remains a
valid choice if the owner finds the remaining accuracy gaps (its eight named residual risks) too large
for a metric. Those are honesty risks — autonomy can be over-reported — not privacy risks.

## What to build

Nothing is built. In a producer session with the owner present:

1. Ask the owner to read ADR-053 in full (not a summary). Point him at its Status bullets, its
   residual-risk list, and § Owner rulings.
2. Put to him, with `AskUserQuestion` and the plain-language context above: the nine differences from
   `plan.md` § 3, the D4 plain-words line, the one unruled ordering point, and the residual risks.
   Options to offer, at least: **accept ADR-053 as written**; **accept with named changes**; **drop the
   feature**.
3. Record his answer word for word (option label and description) with date and channel, in this task's
   `worklog.md`.
4. **On accept:** the ADR's `Status:` is changed to `accepted` with the date, the channel, and his
   words. ADRs are `fkit-architect`'s documents — the edit is made by the architect (or in whatever
   session the owner directs), **quoting the owner's ruling, never on an agent's own judgement**. Then
   `0486`–`0491` are unblocked — each still needs the owner's own word to start.
5. **On "accept with changes":** the architect amends ADR-053; this step is asked again against the new
   text. Briefs `0486`–`0491` are updated to match before any starts.
6. **On drop:** the producer cancels `0486`–`0491` and this brief via `/fkit-task-cancelled`, with the
   owner's words as the reason; ADR-053's status is set by the architect to match his ruling.

## Verification steps

1. This task's `worklog.md` records the owner's ruling: option label and description word for word,
   date, channel (`AskUserQuestion` in a named session), and who asked.
2. ADR-053's `Status:` matches the ruling — `accepted` with date, channel and the owner's words; or
   amended and re-asked; or set to match a drop. No agent-only edit marks it `accepted`.
3. On accept: `0486`–`0491` still read `🔲 Backlog` (unblocking is not starting); their `Depends on`
   lines still name `0485`, which is now closed.
4. On drop: `0486`–`0491` are in `ai-agents/tasks/cancelled/` with the reason, moved only by
   `/fkit-task-cancelled`.
5. `node --test test/reference-integrity.test.js test/task-id-uniqueness.test.js` passes.

## Notes
- **Depends on:** nothing
- **Blocks:** 0486, 0487, 0488, 0489, 0490, 0491
- **Parent:** [`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md)
  (gated umbrella; Phase A design in its `plan.md`, rulings in its `worklog.md`, review in its
  `review.md`).
- **Decision record:** [ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md)
  (`proposed`).
- **Not in scope:** item 6 (historical approximate count) — not approved; needs its own separate
  approval and its own brief if he ever gives it.
- **Not ADR-049:** accepting ADR-053 does not create a verified human principal and never upgrades the
  `(agent-closed — not owner-verified)` marker (ADR-053 D12).
- **Not yet scheduled:** on the Backlog board. Sprint 10's `0482` section says the Phase-B briefs go
  "on a sprint the owner names"; he has not named one. Pulling these into a sprint is his call.
- **Consulted:** none at filing.
- Filed 2026-10-05 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  APPROVE above; it decides nothing beyond it.
