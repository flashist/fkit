# ai-agents/

The working structure the fkit agents collaborate on. This folder tree is generic;
its *contents* are project-specific.

| Folder | Purpose |
|---|---|
| `sprints/` | Sprint plans (`sprint-N.md`) + `sprint-backlog.md`. Completed sprints move to `sprints/done/`. |
| `tasks/` | Task briefs (`.md`), moved between `backlog/`, `done/`, and `cancelled/` — manually, after review (the producer's `task-done` / `task-cancelled` skills prepare the summaries). |
| `reviews/` | Per-task **review ledgers** that carry decision state across review rounds so settled tradeoffs are not re-litigated. See `reviews/README.md`. |
| `knowledge-base/` | Investigation findings, decisions, reports, and research — project knowledge not easily derived from the code. `PROJECT.md` is the prose project brief. |
| `wiki-vault/` | A structured wiki (Karpathy LLM-wiki pattern). `schema.md` = conventions/templates, `index.md` = catalog, `log.md` = activity log, `wiki/` = the pages. Maintained by the **fkit-wiki agent** — no other agent edits it. |

Which model runs each agent is set per-agent in `omnigent/<agent>/config.yaml` (the `executor`
harness/model); there is no project-level routing file.
