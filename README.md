# fkit

[![fkit teaser: in a coder session, /fkit-review is denied, because your coder can't review its own code (click for the full video)](docs/media/fkit-teaser.gif)](https://github.com/user-attachments/assets/9e0a753b-dc74-447c-8089-34f7bf22900b)

**An agent team for software projects, with one front door.** Run `fkit`, press Enter, and you're
talking to the **lead**. It routes you to the right role, answers questions from the project wiki, or
drives the team itself — up to shipping a sprint's tasks from brief to closed with
`/fkit-sprint-ship-loop` — and brings each decision to you as it comes up.

Behind it, seven roles: a **producer**, a **coder**, a **reviewer**, an **adversarial reviewer**, an
**architect**, a **wiki librarian**, and the **lead**. Each is a **role-locked session**: it can run
only its own procedures, so the coder *cannot* review its own code, and the wiki has a single writer.

What you get, on a shared `ai-agents/` working structure inside your project:

- **Ship loops** — brief → plan → build → review → closed, for one task (`/fkit-task-ship-loop`) or a
  whole sprint (`/fkit-sprint-ship-loop`).
- **Tracked reviews** — a stateful review ledger in each task folder, so settled trade-offs stay
  settled, with a second opinion from a *different model* when Codex is present.
- **A knowledge base and a wiki** — ADRs, design specs and reports, plus a wiki only the librarian
  writes.
- **A read-only web board** over your tasks and sprints — `npm run board` from a checkout of this
  repo (see [below](#reading-the-board-in-a-browser-repo-local)).

fkit runs on **Claude Code**. Codex is **optional but recommended** — without it the reviewer's
second opinion falls back to Claude-only, **loudly flagged**.

https://github.com/user-attachments/assets/9e0a753b-dc74-447c-8089-34f7bf22900b

## Install & run

```bash
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh   # once

cd /path/to/your/project
fkit            # pick a role from the menu
fkit coder      # …or go straight to one
```

**Requires:** [Claude Code](https://claude.com/claude-code). **Optional but recommended:**
[Codex](https://github.com/openai/codex) (`npm install -g @openai/codex && codex login`). Codex is
what makes the reviewer's second opinion genuinely independent — without it, reviews still run, on
Claude only, and are **loudly flagged as not model-diverse**. At launch, `fkit` stops if Claude Code
is missing, and only warns if Codex is missing or not logged in.

`fkit` sets the project up if needed (scaffolds `ai-agents/`, drops `CLAUDE.md`/`AGENTS.md`, installs
the agents and skills into `.claude/`, runs a short terminal intake on a fresh project), then opens
the role you picked **in the same tab** (Enter at the menu picks the lead). On a brand-new project it
goes straight to the producer to run `/fkit-initiate-project`, then opens the lead once that is done.
Want two roles at once? Open another terminal tab.

**Staying current:** a normal launch does a throttled check and **tells you** when a newer version is
out — it never updates itself behind your back. Run `fkit update` when you want it. (Silence it with
`FKIT_NO_UPDATE_CHECK=1`.) A checkout of this repo is never auto-checked — update it with `git`.
Launched inside such a checkout, `fkit` runs the checkout's own `claude/` instead of the installed
copy, so your edits are what the agents use (`FKIT_NO_SELF_HOST=1` turns that off).

**`fkit update` updates fkit, not your projects.** It refreshes the installed copy and stops there.
(In a checkout of this repo it refuses and points you at `git pull`.) Each project picks up the
new agents and skills the **next time you launch `fkit` in that project** — that launch is what
rewrites its `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/`. A project you updated but
never re-launched in keeps its **old agents and skills, and nothing tells you**. Want the refresh
without opening a session? Run `FKIT_SETUP_ONLY=1 fkit` in the project.

**One thing an update does not repair.** A launch refresh replaces the agents and
skills under `.claude/` — it never rewrites your project's own content under `ai-agents/`. If your
project filed an unsprinted brief before this correction shipped, the header `/fkit-task-brief`
generated into `ai-agents/sprints/backlog.md` says the backlog is excluded from `/fkit-status`
because its filename sits outside a `sprint-*.md` glob. **That sentence is stale prose, not broken
behaviour.** Since
[ADR-041](ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
the active sprint is selected by each plan's resolved **identity**, and the backlog is excluded
because its identity is `Backlog`, which is never eligible — a stronger rule, not a weaker one. Your
board works correctly; only its header sentence is wrong. Correct it by hand if you want it accurate;
nothing depends on it.

A launch also tells you — one stderr line — when your project's `ai-agents/` tree, or its root
`CLAUDE.md` / `AGENTS.md`, diverges from what the installed version ships. (The fkit agents and
skills under `.claude/` are not part of that check: a launch rewrites them outright, so there is
nothing to diverge.) To see the per-file verdicts and repair, run `/fkit-heal` in a
producer session: repair is **in-session, consent-gated, diffs in view, and applies only the exact
list you approve — never silent**, and it never moves, renames, or deletes anything. Divergence
that's deliberate? List the path in `ai-agents/.fkit-accepted-drift` and the launch line goes quiet
(`/fkit-heal` still reports it in full).

## The team

| Agent | Role |
|---|---|
| **fkit-producer** | product / sprint planning, task briefs, status — and the **only** role that may close tasks and sprints |
| **fkit-coder** | implementation — the **sole** source-write authority; `/fkit-task-ship-loop` takes one brief to ready-to-close |
| **fkit-reviewer** | code review — its own pass **plus** a Codex second opinion (Claude-only, loudly flagged, without Codex) |
| **fkit-adversarial-reviewer** | the hostile pass — runs on Codex, a *different* model, on purpose; without Codex it falls back to Claude, loudly flagged |
| **fkit-architect** | architecture, design specs, ADRs, feasibility |
| **fkit-wiki** | the project wiki — the **exclusive** gateway for writes (reads are direct, via `/fkit-query`) |
| **fkit-lead** | the front door — routes you, answers wiki questions, and **drives the team** when you hand it a goal; `/fkit-sprint-ship-loop` ships a whole sprint ([ADR-031](ai-agents/knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)) |

An eighth role, a sandboxed e2e tester, is authorized
([ADR-028](ai-agents/knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md))
but **not built yet** — the team is seven today. `/fkit-team` in any session shows who does what.

**Closing work is the producer's alone.** Every other role routes its closes to the producer
([ADR-033](ai-agents/knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
and a close made by a spawned agent rather than by you in a `fkit producer` session carries an
`(agent-closed — not owner-verified)` marker.

**Sessions are role-locked.** `fkit <role>` pins the session to that role's system prompt and **only its
own `/fkit-*` skills** (a `tools:` allowlist too, for the adversarial reviewer alone —
[ADR-022](ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)) — every other fkit skill is denied on invocation:
still visible in the `/` menu, but unrunnable, not merely discouraged (ADR-018 §Decision 5, an
accepted cost). That is what makes reviewer independence a fact rather than a promise.

Inside a session, `@fkit-<role> <question>` consults another role and brings the answer back (up to
two hops, never a cycle). A **consult** is gated the same way: a `PreToolUse` hook checks the spawned
agent's own role on every skill call, at any depth, so the boundary is enforced there too — see
[ADR-018](ai-agents/knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md),
which superseded the "advisory in a consult" half of
[ADR-012](ai-agents/knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md).

Full topology and the skill-ownership table: [`claude/README.md`](./claude/README.md).

## Standing up a new project by hand

`fkit` does this for you. If you'd rather do it manually: the agents operate on an `ai-agents/`
working structure plus project-root `CLAUDE.md` / `AGENTS.md`. A starter for all of it ships in
[`claude/scaffold/`](./claude/scaffold/) — copy `claude/scaffold/ai-agents/` and the `CLAUDE.md` /
`AGENTS.md` into your project root, then fill in the placeholders. A project that already has an
`ai-agents/` tree + context files needs nothing from the scaffold. Note that the role lock is wired in
by the `fkit` launcher at each launch — a session opened with plain `claude` is not role-locked.

## Reading the board in a browser (repo-local)

`npm run board` starts a **read-only** web board: it serves
[aiboard](https://github.com/flashist/aiboard)'s unmodified UI over fkit's unmodified `ai-agents/`
tree, so the tasks and sprints you'd otherwise read as raw markdown render as cards you can click.
It is the **interim** reader: **fkit's tree stays the single store** until a project moves to the
built-in board (see *Roadmap*), after which this reader retires
([ADR-052](ai-agents/knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md);
it began as Track 1 of
[ADR-051](ai-agents/knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md)).

```
npm run board                                   # then open http://127.0.0.1:8585/
npm run board -- --port 9000                    # a different port
npm run board -- --aiboard ../aiboard/aiboard/web/index.html
FKIT_AIBOARD=/path/to/aiboard/web/index.html npm run board
node bin/fkit-board.mjs --bench                 # snapshot cost at this repo's real corpus
npm run board -- --root <other-project> --port 9001     # another fkit-using project's ai-agents/
node bin/fkit-board.mjs --bench --root <other-project>  # snapshot cost on that project's tree
```

It finds fkit's root itself — there is nothing to edit before running it. It finds aiboard's
`index.html` in this order: `--aiboard`, then `FKIT_AIBOARD`, then the sibling default
`../aiboard/aiboard/web/index.html`. If none resolve it **exits non-zero naming all three**, rather
than starting and serving a 404.

**Another project's board: `--root <path>`.** It reads that project's `ai-agents/` instead of fkit's,
still read-only. The path must be a directory holding both `ai-agents/tasks/` and `ai-agents/sprints/`;
if it is not, the reader **exits non-zero naming what is missing and never falls back to fkit's own
tree**. A tree whose boards cannot be read (a permission error) is refused the same way, naming the
unreadable directory. A relative path resolves from where `node` runs — under `npm run board` that is fkit's
checkout, so from anywhere else pass an absolute path. The startup banner prints the tree it is
serving, marked `(--root)`.

- **fkit's own `dashboard.sh` reads every tree, a foreign one included; the target's copy is never
  run.** So the board shows *this* fkit's reading of the target's sprint status. If the target's fkit
  install is older, its own `/fkit-status` may read some boards differently — the banner adds a `note`
  line saying so whenever the target carries a `dashboard.sh` of its own.
- `/api/check` also returns `warnings` — e.g. two board files that map to the same board id, where
  one would otherwise silently shadow the other. A warning does not flip `ok`.

**What it listens on, and what it accepts.** It binds **`127.0.0.1` only** — never `0.0.0.0` — on port
`8585` by default. It serves six GET paths and nothing else: `/` and its alias `/index.html` (both
aiboard's `index.html`, byte-for-byte as found), `/api/board`, `/api/tasks/<id>`, `/api/sprints/<id>`
and `/api/check`.
**Every other method — POST, PUT, PATCH, DELETE, and anything else that is not GET — is refused with a
JSON error.** It holds no credentials and reads no environment beyond `FKIT_AIBOARD`.

**It writes nothing, anywhere, in any mode, behind any flag.** It opens no file outside `ai-agents/`
except the single aiboard `index.html` it was pointed at, and it runs one fkit-local subprocess:
`claude/skills/fkit-status/dashboard.sh select-active`, which is the project's **one** implementation
of the sprint-status grammar. `test/board-reader.test.js` pins all of this, including a check that
`git status --porcelain ai-agents/` is unchanged by a full crawl plus every route.

Repo-local by construction: `install.sh` copies `claude/` only, so this does not ship to projects that
install fkit, and aiboard is not a dependency of fkit.

## Layout

```
install.sh                       curl|sh entry point — installs the global `fkit` command
VERSION                          fkit's own version (bumped by `npm run release` — see RELEASING.md)
claude/
  README.md                      the runtime, in detail (topology + skill lockdown)
  fkit-claude.sh                 the `fkit` command: role menu, role-locked launch, update notice + `fkit update`
  fkit-claude-init.sh            idempotent per-project setup (scaffold + context files + agents/skills)
  skills-for-role.sh             role → skill ownership, declared in exactly one place
  *-hook.sh, carry-check-hook.mjs  the hooks each launch wires in (skill lock, turn completion, …)
  structure-spec.md              what a project's structure should be — checked by /fkit-heal
  structure-manifest.tsv         every file hash fkit has shipped (`npm run generate:manifest`)
  agents/                        the seven roles as Claude Code subagent definitions (an 8th, a tester, is authorized — ADR-028 — but not yet built)
  skills/                        the /fkit-* procedures
  scaffold/                      starter ai-agents/ tree + CLAUDE.md / AGENTS.md
bin/                             repo-local tools — none of these ship to projects
  fkit-board.mjs                 read-only web board over ai-agents/ (`npm run board`)
  board-narrow.mjs               narrow, fixed-width render of a sprint board for the terminal
  release.mjs                    cuts a release (`npm run release`)
  generate-structure-manifest.mjs  rebuilds claude/structure-manifest.tsv
test/                            `npm test` — node:test suites plus test/prove-red.sh
ai-agents/                       fkit's own working structure (it is run on itself)
```

## Roadmap

**Planned, not built yet:** the board becomes fkit's built-in, single store for every project's tasks
and sprints ([ADR-052](ai-agents/knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md)).
Everything above describes fkit as it is today.

## History

fkit originally shipped a second runtime on [Omnigent](https://omnigent.ai). It was removed in
Sprint 2 — see
[ADR-009](ai-agents/knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md) for
why, and
[ADR-010](ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md) for
the role-locked model that replaced its team-session topology.

## License

[MIT](LICENSE) © 2026 Mark Dolbyrev
