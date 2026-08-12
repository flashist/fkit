# Task status vocabulary

> **The canonical set of task statuses for this project.** These are the *only* values that may appear
> in a task brief's `## Status` field, a sprint plan's Status column, or a status dashboard.
>
> Before this doc (2026-07-11) the vocabulary was convention-by-accident: only `Done` and `Cancelled`
> were specified anywhere (in the two mover skills), `Backlog` was simply what everyone typed, and
> `Moved` was introduced ad hoc without being recorded. This doc fixes that.

## The statuses

| Status | Marker | Meaning | Set by |
|---|---|---|---|
| **Backlog** | `🔲 Backlog` | Scoped and filed, not picked up. The default on creation. | Producer |
| **In progress** | `🔄 In progress` | A session owns it and work has started. | Anyone — freely |
| **Blocked** | `🚧 Blocked — <reason>` | Started, cannot proceed. **A reason is mandatory.** | Anyone — freely |
| **Done** | `✅ Done` | Reviewed, verified, complete — **closed by the owner**. | Owner, via `/fkit-task-done` |
| **Done (agent-closed)** | `✅ Done (agent-closed — not owner-verified)` | Closed by an agent. Complete **on the agent's own judgment**; no human checked it. | A **spawned producer**, via `/fkit-task-done` |
| **Cancelled** | `⛔ Cancelled (YYYY-MM-DD) — <reason>` | Dropped, will not be done. **A reason is mandatory.** | Owner, via `/fkit-task-cancelled` |
| **Cancelled (agent-closed)** | `⛔ Cancelled (agent-closed — not owner-verified) (YYYY-MM-DD) — <reason>` | Dropped on an agent's own judgment. **A reason is mandatory.** | A **spawned producer**, via `/fkit-task-cancelled` |
| **Moved** | `➡️ Moved to [Sprint N](…) — priority M` | Carried to another sprint. Not dead, not done — relocated. | Producer |
| **Moved (to backlog)** | `➡️ Moved to [Backlog](backlog.md)` | De-scoped from a sprint back to the unranked backlog board. Not dead, not done — unscheduled. **No `— priority M` suffix**: the board is unranked. The href is relative to the file holding the row (`../backlog.md` once the plan is archived). | Producer |

⚠️ **`N` in the `Moved to [Sprint N]` marker is the target sprint's *identity*, not a number** — `4`,
or `4c`. `Sprint 4` and `Sprint 4c` are different sprints.

**No other value is valid.** Not "Not started", not "WIP", not "Todo", not "Complete". If a status you
need isn't here, the fix is to amend this doc — not to invent a value inline.

## The authority split — this is the point

**`In progress` and `Blocked` are free.** They are simply facts about the world; any session may set
them without ceremony, and *should*, the moment they become true.

**`Done` and `Cancelled` are skill-gated and role-gated — not owner-gated.** They may only be set by the
`/fkit-task-done` and `/fkit-task-cancelled` skills — never by hand-editing a file — and **only the
producer may invoke those skills**
([ADR-033](../decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md), reversing
[ADR-025](../decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md)). This one is
**enforced**, not asked: the ADR-018 `PreToolUse` hook denies a mover call from any non-producer
identity at any spawn depth. Every other role routes its closes through a spawned producer.

⚠️ **A close performed without the owner present must write the `(agent-closed — not owner-verified)`
variant — and that includes a producer that was SPAWNED to close** (ADR-033 §5): a spawned producer has
no owner channel, so its close is agent-closed. Only an owner-present producer session yields a plain
owner-verified close.

⚠️ **Role-gating is not prevention, and must not be read as it** (ADR-033 §The limit). Producer-only
restores separation of the closing *identity*; a determined doer can still spawn a producer to close,
which is *"the doer marks its own work done with an extra hop"*. The marker remains **prose, not
enforcement** — nothing in the system compels it. It exists so the board can at least be *read*
honestly by someone who looks.

⚠️ **The marker does not appear in `/fkit-status`.** The dashboard matches on the marker prefix, so
`✅ Done (agent-closed …)` is counted and filtered as an ordinary `✅ Done` row. To tell an agent-closed
task from an owner-closed one you must open the sprint plan or the brief. Recorded, accepted, and **not**
a defect to file — see ADR-025's honesty clause, which ADR-033 §Consequences carries forward unchanged.

`Moved` is producer-set, because relocating work across sprints is a planning act.

## Rules

- **A status is only true if it is current.** An `In progress` marker left behind on an abandoned task
  is worse than no marker at all — it makes the board lie *with confidence*. If you pick a task up,
  set it; if you put it down, unset it.
- **`Blocked` and `Cancelled` require a reason, inline, in the status itself.** A blocker with no
  stated cause cannot be acted on by anyone but the person who wrote it.
- **The brief and the sprint plan must agree.** Both carry the status; both get updated together. The
  mover skills already do this — do the same by hand.
- **Report reality, not the template.** If a dashboard shows a distinction this vocabulary can't
  express, the dashboard is lying. (This is exactly what happened on 2026-07-11: a status report
  claimed "0 in progress · 14 not started" when no `In progress` status existed at all and every row
  simply read `Backlog`.)

## Where this must be enforced

This vocabulary ships to every project fkit scaffolds, so it has to live in the source, not just here:

- `claude/skills/fkit-task-done/SKILL.md` — sets `✅ Done`
- `claude/skills/fkit-task-cancelled/SKILL.md` — sets `⛔ Cancelled`
- `claude/skills/fkit-task-brief/SKILL.md` — sets `🔲 Backlog` on creation *(Sprint 2, task 14)*
- `claude/agents/fkit-producer.md` — the producer reports against these values
- `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md` — the scaffold ships
  this convention, so new projects inherit the vocabulary as law rather than as a copy in a README
- Any future `/fkit-status` skill — the dashboard renders these values and no others

**Tracked by:** `ai-agents/tasks/backlog/enforce-task-status-vocabulary.md` (Sprint 2, priority 15).

## Related

- [`status-report-format.md`](status-report-format.md) — how the producer *reports* status; its
  dashboard uses exactly these values.
