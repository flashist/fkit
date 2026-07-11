# ai-agents/

The working structure the fkit agents collaborate on. This folder tree is generic;
its *contents* are project-specific.

| Folder | Purpose |
|---|---|
| `sprints/` | Sprint plans (`plan-sprint-N.md`) + `sprint-backlog.md`. Completed sprints move to `sprints/done/`. |
| `tasks/` | Task briefs (`.md`), moved between `backlog/`, `done/`, and `cancelled/` — manually, after review (the producer's `task-done` / `task-cancelled` skills prepare the summaries). |
| `reviews/` | Per-task **review ledgers** that carry decision state across review rounds so settled tradeoffs are not re-litigated. See `reviews/README.md`. |
| `knowledge-base/` | Investigation findings, decisions, reports, and research — project knowledge not easily derived from the code. `PROJECT.md` is the prose project brief. |
| `wiki-vault/` | A structured wiki (Karpathy LLM-wiki pattern). `schema.md` = conventions/templates, `index.md` = catalog, `log.md` = activity log, `wiki/` = the pages. Maintained by the **fkit-wiki agent** — no other agent edits it. |

## Task status vocabulary

**The canonical set.** These are the *only* values that may appear in a task brief's `## Status`
field, a sprint plan's Status column, or a status dashboard.

| Status | Marker | Meaning | Set by |
|---|---|---|---|
| **Backlog** | `🔲 Backlog` | Scoped and filed, not picked up. The default on creation. | Producer |
| **In progress** | `🔄 In progress` | A session owns it and work has started. | Anyone — freely |
| **Blocked** | `🚧 Blocked — <reason>` | Started, cannot proceed. **A reason is mandatory.** | Anyone — freely |
| **Done** | `✅ Done` | Reviewed, verified, complete. | **Owner only**, via `/fkit-task-done` |
| **Cancelled** | `⛔ Cancelled (YYYY-MM-DD) — <reason>` | Dropped, will not be done. **A reason is mandatory.** | **Owner only**, via `/fkit-task-cancelled` |
| **Moved** | `➡️ Moved to [Sprint N](…) — priority M` | Carried to another sprint. Not dead, not done — relocated. | Producer |

**No other value is valid.** Not "Not started", not "WIP", not "Todo", not "Complete". If a status you
need isn't here, amend this table — don't invent a value inline.

### The authority split — this is the point

- **`In progress` and `Blocked` are free.** Any session may set them, without ceremony, and *should*,
  the moment they become true.
- **`Done` and `Cancelled` are gated.** They may only be set by the **owner-invoked**
  `/fkit-task-done` and `/fkit-task-cancelled` skills. This is deliberate: they are *judgments about
  whether work is finished*, and an agent that can mark its own work complete can quietly launder
  unfinished work into a green board. **Never set them by hand-editing a file.**
- **`Moved` is producer-set** — relocating work across sprints is a planning act.

### Rules

- **A status is only true if it is current.** An `In progress` marker left on an abandoned task is
  worse than no marker — it makes the board lie *with confidence*. Pick a task up, set it; put it
  down, unset it.
- **`Blocked` and `Cancelled` require a reason, inline, in the status itself.** A blocker with no
  stated cause cannot be acted on by anyone but the person who wrote it.
- **The brief and the sprint plan must agree.** Both carry the status; both get updated together.
- **Report reality, not the template.** If a dashboard shows a distinction this vocabulary cannot
  express, the dashboard is lying.

Which model runs each agent is set per-agent in `omnigent/<agent>/config.yaml` (the `executor`
harness/model); there is no project-level routing file.
