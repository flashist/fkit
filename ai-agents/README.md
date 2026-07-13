# ai-agents/

The working structure the fkit agents collaborate on. This folder tree is generic;
its *contents* are project-specific.

| Folder | Purpose |
|---|---|
| `knowledge-base/conventions/task-status-vocabulary.md` | **The only valid task statuses** — Backlog · In progress · Blocked · Done · Cancelled · Moved. Nothing else is valid. |
| `sprints/` | Sprint plans (`sprint-N.md`) + `sprint-backlog.md`. Completed sprints move to `sprints/done/`. |
| `tasks/` | Task briefs (`.md`), moved between `backlog/`, `done/`, and `cancelled/` — manually, after review (the producer's `task-done` / `task-cancelled` skills prepare the summaries). |
| `reviews/` | Per-task **review ledgers** that carry decision state across review rounds so settled tradeoffs are not re-litigated. See `reviews/README.md`. |
| `knowledge-base/` | Project knowledge not easily derived from the code. The root holds **exactly two** documents — `PROJECT.md` (the prose brief) and `architecture.md`; everything else is filed by kind into `conventions/` (standing rules), `decisions/` (ADRs), `incidents/`, `reports/`, `history/`. See [ADR-013](knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md). |
| `wiki-vault/` | A structured wiki (Karpathy LLM-wiki pattern). `schema.md` = conventions/templates, `index.md` = catalog, `log.md` = activity log, `wiki/` = the pages. Maintained by the **fkit-wiki agent** — no other agent edits it. |

Agents run on Claude Code and inherit the session's model unless their definition
(`.claude/agents/fkit-<role>.md`) pins one; there is no project-level routing file. The reviewer's
adversarial second opinion runs on Codex, for genuine model diversity.
