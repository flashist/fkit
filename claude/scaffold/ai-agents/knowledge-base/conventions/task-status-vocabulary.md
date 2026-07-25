# Task status vocabulary

> **The canonical set of task statuses for this project.** These are the *only* values that may appear
> in a task brief's `## Status` field, a sprint plan's Status column, or a status dashboard.
>
> This is a **starting convention**, shipped with the project scaffold. It is yours — amend it to fit
> how your team actually works. What matters is that there is exactly **one** place the vocabulary is
> defined, and that it is this one.

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

**No other value is valid.** Not "Not started", not "WIP", not "Todo", not "Complete". If a status you
need isn't here, the fix is to amend this doc — not to invent a value inline.

## The authority split — this is the point

**`In progress` and `Blocked` are free.** They are simply facts about the world; any session may set
them without ceremony, and *should*, the moment they become true.

**`Done` and `Cancelled` are skill-gated and role-gated — not owner-gated.** They may only be set by
the `/fkit-task-done` and `/fkit-task-cancelled` skills — never by hand-editing a file — and **only the
producer may invoke those skills.** That one is enforced rather than asked: a `PreToolUse` hook denies
a mover call from any non-producer identity, at any spawn depth. Every other role routes its closes
through the producer and closes nothing itself.

⚠️ **A close performed without the owner present must write the `(agent-closed — not owner-verified)`
variant — including a producer that was SPAWNED to close.** A spawned agent has no channel to you, so
its close is agent-closed however trustworthy the role. Only an owner-present producer session yields a
plain owner-verified close.

⚠️ **Role-gating is not prevention.** Understand the trade you are inheriting: restricting the movers
to one role separates the closing *identity*, but an agent that has decided its work is done can still
spawn a producer to close — the same act with an extra hop. The marker is **prose, not enforcement**;
nothing compels it. It exists so the board can at least be *read* honestly by someone who looks.

⚠️ **The marker does not appear in `/fkit-status`.** The dashboard matches on the marker prefix, so an
agent-closed row is counted and filtered as an ordinary closed row. To tell the two apart you must open
the sprint plan or the brief.

**If your team wants a stronger guarantee than this**, the fix is a further precondition in
`claude/skill-ownership-hook.sh` — closes only from an owner-present session, say — not stricter prose.
Prose does not stop an agent that has already decided its work is done.

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
  express, the dashboard is lying — fix the vocabulary, don't fake the row.

## Where this is enforced

- `/fkit-task-done` — sets `✅ Done`
- `/fkit-task-cancelled` — sets `⛔ Cancelled`
- `/fkit-task-brief` — sets `🔲 Backlog` on creation
- `/fkit-status` — the dashboard renders these values and no others
- The producer reports against these values and no others

## Related

- [`status-report-format.md`](status-report-format.md) — how the producer *reports* status; its
  dashboard uses exactly these values.
