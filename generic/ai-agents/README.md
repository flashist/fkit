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

The **agent roster** is declared in `ai-agents.yml` at the project root of `ai-agents/`.
**Per-skill model routing** (which model owns which fkit skill) lives in the sibling
`config.json` — edit via `fkit config set` or the `fkit-config` skill, then run the
kit's `sync` for the change to take effect and to sync the `.codex/config.toml` model.
