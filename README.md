# fkit

[![test](https://github.com/flashist/fkit/actions/workflows/test.yml/badge.svg)](https://github.com/flashist/fkit/actions/workflows/test.yml) [![version](https://img.shields.io/github/package-json/v/flashist/fkit?label=version)](VERSION) [![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![fkit teaser: in a coder session, /fkit-review is denied, because your coder can't review its own code](docs/media/fkit-teaser.gif)

**An agent team for software projects, with one front door.** Run `fkit`, press Enter, and you're
talking to the **lead**. It routes you to the right role, answers questions from the project wiki, or
drives the team itself — up to shipping a sprint's tasks from brief to closed — and brings each
decision to you as it comes up. Behind it, seven roles: a **producer**, a **coder**, a **reviewer**,
an **adversarial reviewer**, an **architect**, a **wiki librarian**, and the **lead**.

## Why fkit

When one AI session plans, writes **and** reviews its own code, the review isn't independent — the
blind spot that wrote a bug is the one that approves it. fkit splits the work into roles that
**cannot** run each other's procedures: the coder can't review, only the producer can close a task,
and the reviewer gets a second opinion in a fresh role context. A different model is recommended;
configured Codex sessions support a visibly disclosed same-model pass. Review stops being a promise
and becomes a rule — with a review ledger per task, a knowledge base (decisions, design specs, reports)
and a wiki, all in an `ai-agents/` folder inside your project.

## Install & run

```bash
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh   # once

cd /path/to/your/project
fkit            # pick a role from the menu (Enter = lead)
fkit coder      # …or go straight to one
fkit board      # view this project's tasks and sprints in your browser, read-only (needs Node)
```

Published `v0.4.0-codex.1` and the default `main` installation retain the legacy [Claude Code](https://claude.com/claude-code) launcher for unconfigured projects;
[Codex](https://github.com/openai/codex) is optional but recommended for its independent review.
Without it, legacy reviews keep their explicit NOT model-diverse fallback label. Installation needs
`curl`, `tar` and `bash`; legacy Claude sessions work without Node. Configuration, configured runtime
sessions and `fkit board` need [Node.js](https://nodejs.org).

**Starting with preview `v0.4.0-codex.2`, run only `fkit` inside your project.** Checkout users can
run the checkout's `bin/fkit` directly. With no arguments and both stdin
and stdout attached to terminals, missing project settings trigger one explicit Codex/Claude
choice, the existing model/effort and optional role interview, review, and one save confirmation.
This includes existing Claude-era projects without settings: their old bare-interactive default
is replaced by this one-time interview. Confirming saves ignored `.fkit/model-settings.json`,
refreshes managed resources, and continues fresh onboarding or the existing project's role menu
in the same command. Repeat launches reuse all saved overrides without rewriting settings.
No separate configure/setup command is needed for this flow.

Node is required for that new bare first use, even when selecting Claude. Missing Node exits 1
with an install-and-retry message; no runtime is chosen or installed automatically. Install and
authenticate your chosen CLI yourself (Codex stable >=0.165.0). Blank/invalid runtime input,
invalid settings, EOF, Ctrl-C or declined save starts no role and saves no first-use choice.
Blank model/effort answers still keep their current values. A confirmed save survives a later
setup/session failure for retry. Corrupt settings are errors, never permission to reconfigure.
Noninteractive bare entry, explicit unconfigured legacy roles/arguments, explicit runtime/root
paths and management commands retain their contracts. Direct `bin/fkit-codex` stays Codex-first.
Installing this preview is opt-in; publishing it does not change an existing global installation.

**Opt-in Codex preview: `v0.4.0-codex.2`.** The preview lives on `codex/codex-preview`, separate from
the default `main` install/update channel. To install the preview and follow its updates:

```sh
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/codex/codex-preview/install.sh | FKIT_REF=codex/codex-preview sh
```

For exactly this preview, use `v0.4.0-codex.2` instead of `codex/codex-preview` in both places.
A tag stays on that version; it does not subscribe to later previews. Tag update-notice limitations
are documented in [RELEASING.md](RELEASING.md). Install the shared command once, then run only `fkit`
inside each existing project and choose Codex at first use for a Codex-only team. If settings already
exist, they are reused without an interview; `fkit configure` changes preferences and `fkit settings`
optionally inspects them. Explicit Claude role overrides are preserved until changed with
`fkit configure --role-runtime ROLE=codex`. Keep existing project records and do not
repeat project initiation. Setup refreshes fkit-managed resources and instruction blocks; edits
inside those managed areas are replaced. Exit older sessions before refreshing.

Codex checks used CLI 0.165.0 and Node 24.13.0 on macOS; other versions/platforms are not certified.
Real Claude compatibility remains pending; see [runtime evidence](model-agnostic-sprint/local-acceptance.md).
Checkout users can still use `./bin/fkit` or `npm start -- ...` without changing their global install.

```sh
./bin/fkit configure --root /path/to/project --runtime codex --runtime-default
./bin/fkit lead --root /path/to/project
./bin/fkit configure --root /path/to/project --role-model wiki=MODEL_ID
# Only in a Claude-capable environment; live mixed-runtime certification is deferred here.
./bin/fkit configure --root /path/to/project --role-runtime wiki=claude --role-model wiki=MODEL_ID
```

An explicit model is passed to that CLI; unavailable choices fail without switching runtimes or
models. Credentials stay with the CLIs. A default model is not bundled. Configure once in an existing
project without repeating product intake. [Runtime details and limits](codex/README.md).

The local Codex path does not require Claude. On this Mac the owner confirmed Claude's API is
unavailable; run all effective roles on Codex. Claude compatibility remains explicitly unverified
and deferred to a capable environment, rather than blocking local Codex use.

The [installer](install.sh) (read it first if you like) copies fkit to `~/.local/share/fkit` and the
`fkit` command to `~/.local/bin`, which must be on your `PATH` — it tells you if it isn't. It installs
from `main`; re-running it is safe. Each launch then sets the project up if needed (`ai-agents/`,
`CLAUDE.md` / `AGENTS.md`, the agents and skills under `.claude/`) and opens the role **in the same
tab** — for two roles at once, open another tab. Configured sessions also install owned generated
procedures under `.agents/skills/`; canonical policy remains under `claude/`. Multiple fresh role
processes consume more model usage than a single session.

## A first session

On the current unreleased checkout, the first-use runtime/settings interview above precedes
these steps. Published versions retain their documented setup requirements.

In a brand-new project, `fkit`:

1. sets the project up and says *"This project is not initiated yet — starting the producer to set
   it up."*
2. asks six quick questions in the terminal (*fkit — quick project intake*; Enter skips one);
3. opens the **producer**, which runs `/fkit-initiate-project`: it interviews you, has the
   **architect** survey the code, and writes `ai-agents/knowledge-base/PROJECT.md` and `architecture.md`;
4. opens the **lead** in the same tab once you exit the finished producer session.
5. Give the lead a goal (*"add CSV export to the reports page"*); it has the producer file a **brief**
   under `ai-agents/tasks/backlog/`.
6. Build it: `fkit coder`, then `/fkit-task-ship-loop <path-to-brief>`. You approve the plan once; the
   coder builds and tests, the **reviewer** (own pass + Codex) records findings in the task's
   `review.md`, and the **producer** closes the task into `ai-agents/tasks/done/` (without Codex, the
   loop stops and hands the close to you).

For a whole sprint, ask the lead to run `/fkit-sprint-ship-loop`.

## See it in action

https://github.com/user-attachments/assets/9e0a753b-dc74-447c-8089-34f7bf22900b

## The team

| Agent | Role |
|---|---|
| **fkit-producer** | product / sprint planning, task briefs, status — and the **only** role that may close tasks and sprints |
| **fkit-coder** | implementation — the **sole** source-write authority; `/fkit-task-ship-loop` takes one brief to ready-to-close |
| **fkit-reviewer** | code review — its own pass **plus** a Codex second opinion (Claude-only, loudly flagged, without Codex) |
| **fkit-adversarial-reviewer** | the hostile pass — runs on Codex, a *different* model, on purpose; without Codex it falls back to Claude, loudly flagged |
| **fkit-architect** | architecture, design specs, ADRs, feasibility |
| **fkit-wiki** | the project wiki — the **exclusive** gateway for writes (reads are direct, via `/fkit-query`) |
| **fkit-lead** | the front door — routes you, answers wiki questions, and **drives the team** when you hand it a goal; `/fkit-sprint-ship-loop` ships a whole sprint |

An eighth role, a sandboxed e2e tester, is authorized but not built yet. `/fkit-team` shows who does what.

**On the legacy Claude path, the role lock is enforced by a hook.** A session can run only its own role's `/fkit-*`
commands; the rest still show in the `/` menu but are refused, by a hook that checks every call —
in a role you consult, too. `@fkit-<role> <question>` consults another role and brings the answer
back (up to two hops). **Only the producer closes work**; a close made by an agent rather than by you
is marked `(agent-closed — not owner-verified)`. Details: [`claude/README.md`](claude/README.md).

Configured Codex sessions check owned skill invocation and delegation through fkit's dispatcher.
The first Codex version registers no fkit PreToolUse or Stop hooks; their code is retained for
later evaluation. Agent instructions still require role boundaries, interactive owner questions
and “What's next?”. General file-write ownership and plan approval remain instruction-enforced.

## Key terms

- **Brief** — a task's spec: `ai-agents/tasks/<state>/<id>-<slug>/brief.md`.
- **Ship loop** — brief → plan → build → review → closed, for one task or a whole sprint.
- **Sprint** — a board of tasks in `ai-agents/sprints/`; unsprinted tasks sit on the Backlog board.
- **Review ledger** — the task's `review.md`: findings, responses and accepted trade-offs, kept across
  rounds so settled points stay settled.
- **Consult** — `@fkit-<role> <question>` inside a session; the answer comes back to you.
- **Role-locked session** — `fkit <role>`: a session that can run only that role's skills.
- **Lead** — the front door: routes you, or drives the other roles toward your goal.
- **Producer** — plans sprints, writes briefs, and is the only role that closes tasks.
- **ADR** — an Architecture Decision Record, in `ai-agents/knowledge-base/decisions/`.
- **Wiki librarian** — `fkit-wiki`, the only role that writes the wiki (`ai-agents/wiki-vault/`).

## Updating

| Situation | What happens |
|---|---|
| Normal `fkit` launch | A throttled check (hourly by default) **tells** you when a newer version is out; it never updates itself |
| `fkit update` | Updates the installed fkit only, not your projects |
| Next `fkit` launch in a project | Rewrites that project's `.claude/agents/fkit-*` and `.claude/skills/fkit-*` |
| Project not re-launched since the update | Keeps its old agents and skills, and nothing tells you. Run `FKIT_SETUP_ONLY=1 fkit` there |
| Inside a checkout of the fkit repo | No update check; `fkit update` refuses (use `git pull`); runs the checkout's own `claude/` |

A launch prints one warning line when your `ai-agents/` tree or root `CLAUDE.md` / `AGENTS.md`
differs from what your fkit version ships. `/fkit-heal` in a producer session shows each file and
repairs only what you approve, diffs in view, deleting nothing. Changed one on purpose? List it in
`ai-agents/.fkit-accepted-drift`. Upgrade notes: [`CHANGELOG.md`](CHANGELOG.md).

## Configuration

Configured projects use ignored `.fkit/model-settings.json`: one default runtime/model and optional
role overrides. `fkit settings` shows effective choices. `fkit --runtime codex|claude ROLE` selects
only that root session; switching runtimes uses its CLI default, while saved child settings remain
unchanged. `fkit configure --runtime ...` changes the saved default and preserves existing explicit
role choices. No login or user CLI configuration is replaced.

Codex setup asks for reasoning effort after model selection, including individual role choices.
Change it later with `fkit configure --effort high` or `--role-effort wiki=low`;
`default` follows the CLI effort, and role effort `inherit` uses the project setting.

| Variable | Default | What it does |
|---|---|---|
| `FKIT_SHARE` | `~/.local/share/fkit` | Installer: where fkit's files go |
| `FKIT_BIN` | `~/.local/bin` | Installer: where the `fkit` command goes |
| `FKIT_REPO` / `FKIT_REF` | `flashist/fkit` / `main` | Install and update source |
| `FKIT_NO_UPDATE_CHECK=1` | off | Never check for updates |
| `FKIT_UPDATE_INTERVAL_MIN` | `60` | Minutes between update checks (`0` = every launch) |
| `FKIT_SETUP_ONLY=1` | off | Set the project up, then exit (non-zero if setup failed) |
| `FKIT_NO_SELF_HOST=1` | off | In a checkout of this repo, use the installed fkit, not the checkout's `claude/` |
| `FKIT_CLEANUP_DRY_RUN=1` | off | List the old-runtime files fkit would delete from a project; delete nothing |
| `FKIT_AIBOARD` | — | `fkit board`: serve this aiboard `index.html` instead of fkit's copy |

Installer variables go **after** the pipe (`curl … | FKIT_SHARE=… sh`). `fkit update` reuses the
source and paths you installed with; set a variable on `fkit update` only to change one.

## Uninstall

```sh
rm -rf ~/.local/share/fkit ~/.local/bin/fkit     # fkit itself (or your FKIT_SHARE / FKIT_BIN)
# in each project (removes symlinked fkit-* entries, not their targets; skipped if .claude is a link):
[ -L .claude ] || find .claude/agents -maxdepth 1 -name 'fkit-*.md' -exec rm -rf {} +
[ -L .claude ] || find .claude/skills -maxdepth 1 -name 'fkit-*' -exec rm -rf {} +
rm -rf .fkit
```

Per project, also remove fkit's three `.gitignore` entries and the `<!-- fkit:begin-rules -->` …
`<!-- fkit:end-rules -->` block in `CLAUDE.md` and `AGENTS.md` (or the whole file, if fkit created
it). **`ai-agents/` is your own work** — briefs, decisions, the wiki — so keep or delete it as you
like; fkit never removes it. Drop the `~/.local/bin` `PATH` line if you added it only for fkit.

## Setting up a project by hand

`fkit` does this for you. Manually: copy `ai-agents/`, `CLAUDE.md` and `AGENTS.md` from
[`claude/scaffold/`](claude/scaffold/) into your project and fill in the placeholders (a project that
already has them needs nothing). The role lock comes from the `fkit` launcher — a session opened with
plain `claude` is not role-locked.

## Web board

Run `fkit board` in your project's folder: it serves a **read-only** web view of the project's
`ai-agents/` tasks and sprints at `http://127.0.0.1:8585/`, using a copy of
[aiboard](https://github.com/flashist/aiboard)'s page that ships with fkit. It writes nothing and needs
Node.js. An older install needs `fkit update` first. In a checkout of this repo, `npm run board` does
the same over fkit's own tree. Details: [`docs/board.md`](docs/board.md).

## Contributing

Issues and PRs welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md). fkit is developed with fkit, so
this repo's own `ai-agents/`, `CLAUDE.md` and `AGENTS.md` are its working files, not part of the
product. Tests: `npm test`. Releases: [`RELEASING.md`](RELEASING.md). Design decisions are ADRs in
[`ai-agents/knowledge-base/decisions/`](ai-agents/knowledge-base/decisions/).

## Roadmap

**Planned, not built yet:** the board becomes fkit's built-in, single store for every project's tasks
and sprints. Everything above describes fkit as it is today.

## License

[MIT](LICENSE) © 2026 Mark Dolbyrev
