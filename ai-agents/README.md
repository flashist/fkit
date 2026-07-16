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

## How fkit keeps this folder up to date

Every `fkit` launch tops this tree up **additively**: any folder or file the current scaffold has and
this project does not, fkit creates — announcing it once, on the launch it happens, and staying silent
otherwise. That is how a project scaffolded before a path existed gains it, with no migration to run.

> **fkit never writes to a path that already exists here.** Create-if-absent only — no overwrite, no
> move, no delete, ever, inside `ai-agents/`.

Two consequences follow directly from that rule, and both are deliberate:

- **Content drift is not fixed.** A file you edited (this README included) is a path that already
  exists, so fkit steps over it forever. You will not receive later scaffold improvements to a file you
  already have. The safety and the limitation are the same property.
- **A rename gets you both.** fkit compares the scaffold to the disk and keeps no history, so it cannot
  tell a rename from a deletion and recreates the original alongside yours. An inherent limit of any
  stateless mechanism, not a bug.

To stop fkit creating a path, list it in **`ai-agents/.fkit-keep-out`** — one scaffold-relative path
per line, an entry covering everything beneath it, `#` comments ignored. **Commit it**: it is tracked
so it survives a clone, which is exactly what an opt-out under gitignored `.fkit/` would not do.
