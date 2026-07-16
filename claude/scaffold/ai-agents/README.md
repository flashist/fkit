# ai-agents/

The working structure the fkit agents collaborate on. This folder tree is generic;
its *contents* are project-specific.

| Folder | Purpose |
|---|---|
| `sprints/` | Sprint plans (`sprint-N.md`) + `sprint-backlog.md`. Completed sprints move to `sprints/done/`. |
| `tasks/` | Task briefs (`.md`), moved between `backlog/`, `done/`, and `cancelled/` — manually, after review (the producer's `task-done` / `task-cancelled` skills prepare the summaries). |
| `reviews/` | Per-task **review ledgers** that carry decision state across review rounds so settled tradeoffs are not re-litigated. See `reviews/README.md`. |
| `knowledge-base/` | Project knowledge not easily derived from the code. The root holds **exactly two** documents — `PROJECT.md` (the prose project brief) and `architecture.md`; everything else is filed by kind into `conventions/` (standing rules the project reads on a normal run), `decisions/` (ADRs), `incidents/`, `reports/` (dated audits, verifications, evaluations, plans), `history/` (superseded design docs). |
| `wiki-vault/` | A structured wiki (Karpathy LLM-wiki pattern). `schema.md` = conventions/templates, `index.md` = catalog, `log.md` = activity log, `wiki/` = the pages. Maintained by the **fkit-wiki agent** — no other agent edits it. |

## The standing conventions

The project's **standing law** lives in `knowledge-base/conventions/` — documents the agents read on a
normal run and **defer to**. Two ship with the scaffold:

| Convention | In force over |
|---|---|
| [`knowledge-base/conventions/task-status-vocabulary.md`](knowledge-base/conventions/task-status-vocabulary.md) | **The only valid task statuses** — Backlog · In progress · Blocked · Done · Cancelled · Moved. Nothing else is valid. |
| [`knowledge-base/conventions/status-report-format.md`](knowledge-base/conventions/status-report-format.md) | The shape of a status briefing — six beats, then the board. `/fkit-status` executes it. |

They are **yours to amend** — but amend them *there*. A convention has exactly one home; a second copy
of a rule is how the two drift apart and the project stops knowing which one is law.

## How fkit keeps this folder up to date

Every `fkit` launch tops this tree up **additively**: any folder or file the current scaffold has and
your project does not, fkit creates. That is how a project scaffolded months ago gains a path added to
fkit later, with no migration step to run. It says so on the launch it happens, and is otherwise
silent.

**The one rule it never breaks:**

> **fkit never writes to a path that already exists here.** Create-if-absent only — no overwrite, no
> move, no delete, ever, inside `ai-agents/`.

Everything in this folder is **yours**. Rename things, delete things, rewrite them; fkit will not
argue. Two consequences follow directly, and both are deliberate:

- **Your edits are never "corrected".** Once a file exists, fkit steps over it forever — including
  this README. If a later fkit improves a scaffold file, you will **not** receive that change to a
  file you already have. Content is yours; only *absence* is topped up.
- **A rename gets you both.** fkit compares the scaffold to your disk and nothing else — it cannot
  tell "renamed `sprints/` to `iterations/`" from "deleted `sprints/`", so it recreates `sprints/`
  alongside yours. This is an inherent limit of any mechanism that keeps no history of your project,
  not a bug. Use the opt-out below.

### Opting out — `ai-agents/.fkit-keep-out`

Deleted `wiki-vault/` because you don't use a wiki? Say so, and fkit stops recreating it:

```
# ai-agents/.fkit-keep-out — paths fkit must never create. One per line, relative to ai-agents/.
# An entry covers that path and everything under it. `#` comments and blank lines are ignored.
wiki-vault
knowledge-base/reports
```

**Commit this file.** It lives inside `ai-agents/` — tracked — precisely so it survives a `git clone`
and applies for your whole team. A teammate's launch would otherwise resurrect the folder you
deliberately removed. It records your *intent*, not fkit's progress: there is no version cursor here,
and no notion of "which fkit release this project is at".

Agents run on Claude Code and inherit the session's model unless their definition
(`.claude/agents/fkit-<role>.md`) pins one; there is no project-level routing file. The reviewer's
adversarial second opinion runs on Codex, for genuine model diversity.
