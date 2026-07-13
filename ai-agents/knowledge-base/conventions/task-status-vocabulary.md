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
| **Done** | `✅ Done` | Reviewed, verified, complete. | **Owner only**, via `/fkit-task-done` |
| **Cancelled** | `⛔ Cancelled (YYYY-MM-DD) — <reason>` | Dropped, will not be done. **A reason is mandatory.** | **Owner only**, via `/fkit-task-cancelled` |
| **Moved** | `➡️ Moved to [Sprint N](…) — priority M` | Carried to another sprint. Not dead, not done — relocated. | Producer |

**No other value is valid.** Not "Not started", not "WIP", not "Todo", not "Complete". If a status you
need isn't here, the fix is to amend this doc — not to invent a value inline.

## The authority split — this is the point

**`In progress` and `Blocked` are free.** They are simply facts about the world; any session may set
them without ceremony, and *should*, the moment they become true.

**`Done` and `Cancelled` are gated.** They may only be set by the **owner-invoked** `/fkit-task-done`
and `/fkit-task-cancelled` skills. This is deliberate: those two are *judgments about whether work is
finished*, and an agent that can mark its own work complete can quietly launder unfinished work into a
green board. Never set them by hand-editing a file.

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
- `claude/skills/fkit-task-plan/SKILL.md` — sets `🔲 Backlog` on creation *(Sprint 2, task 14)*
- `claude/agents/fkit-producer.md` — the producer reports against these values
- `claude/scaffold/ai-agents/README.md` — so new projects inherit the vocabulary
- Any future `/fkit-status` skill — the dashboard renders these values and no others

**Tracked by:** `ai-agents/tasks/backlog/enforce-task-status-vocabulary.md` (Sprint 2, priority 15).

## Related

- [`status-report-format.md`](status-report-format.md) — how the producer *reports* status; its
  dashboard uses exactly these values.
