# ai-agents/

The working structure for AI-agent collaboration on this project. Scaffolded by
fkit; this folder tree is generic,
its *contents* are project-specific.

| Folder | Purpose |
|---|---|
| `sprints/` | Sprint plans (`plan-sprint-N.md`) + `sprint-backlog.md`. Completed sprints move to `sprints/done/`. |
| `tasks/` | Task briefs (`.md`), moved between `backlog/`, `done/`, and `cancelled/` — manually, after review (see the `task-done` / `task-cancelled` skills). |
| `reviews/` | Per-task **review ledgers** that carry decision state across review rounds so settled tradeoffs are not re-litigated. See `reviews/README.md`. |
| `knowledge-base/` | Investigation findings, decisions, reports, and research — generic project knowledge not easily derived from the code. |
| `wiki-vault/` | A structured wiki (Karpathy LLM-wiki pattern). `schema.md` = conventions/templates, `index.md` = catalog, `log.md` = activity log, `wiki/` = the pages. Maintained by the `wiki-*` skills. |

**Model routing** (which model owns which task type) and the **agent roster** are
declared in `ai-agents.yml` at the project root of `ai-agents/`. Edit that file and run
the kit's `sync` to change routing; it regenerates the routing blocks in `CLAUDE.md` /
`AGENTS.md` and the `.codex/config.toml` model.
