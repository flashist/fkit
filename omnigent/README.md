# fkit on Omnigent — the agent team

This directory **is** fkit: a team of agents and skills built for
[Omnigent](https://omnigent.ai) (Databricks' open-source agent meta-harness). Omnigent is the
runtime these agents run on — fkit is authored for it.

Each agent is an Omnigent **bundle directory** (`<agent>/config.yaml` + a per-agent `skills/` dir).
Skills are auto-discovered and **scoped to their agent** — they exist in a session only while that
agent is active.

## The team

| Agent | Harness | Skills | Role |
|---|---|---|---|
| **fkit-producer** | claude-sdk | task-done, task-cancelled | product / sprint planning, task lifecycle |
| **fkit-coder** | claude-sdk | plan-task, process-review, process-stateful-review | implementation (sole source-write authority) |
| **fkit-reviewer** | claude-sdk | review, stateful-review | code review (lead) |
| **fkit-adversarial-reviewer** | **codex** | _(prompt-only)_ | adversarial second-opinion sidekick — a *different model* on purpose |
| **fkit-architect** | claude-sdk | inspect, design-spec, evaluate-approach, record-decision | architecture, design specs, ADRs |
| **fkit-wiki** | **codex** | query, ingest, lint, sync | the wiki — **sole gateway** to `ai-agents/wiki-vault/` |

Per-agent harness is intentional (Omnigent's per-agent model feature): the adversarial reviewer runs
on a *different* model from the Claude lead for genuine perspective diversity.

## Consultation topology

Agents consult each other by **spawning** the target bundle and reading its reply from the inbox —
`sys_session_create(config_path=".fkit/agents/fkit-<name>", …)` → `sys_session_send` → `sys_read_inbox`
(each consulting agent declares `spawn: true`). Omnigent 0.4.0 has no way to reference an external agent
bundle from a `tools:` block, so this spawn model is the supported mechanism — and it requires the
bundles to be **vendored under the project root** (see *Running an agent*).

- **Every non-wiki agent → fkit-wiki.** All wiki access (read *and* write) goes through fkit-wiki's
  `query`/`ingest`/… — no agent reads `ai-agents/wiki-vault/` directly. fkit-wiki is the single source
  of truth for anything about the project.
- **fkit-coder → fkit-architect** — design interpretation / consistency (a *new* architecture decision
  is surfaced to the owner instead).
- **fkit-producer ⇄ fkit-architect** — product ⇄ technical clarifications; the decision stays in the
  asker's domain.
- **fkit-reviewer → fkit-adversarial-reviewer** — independent adversarial pass, merged into the review.

Consults are framed as focused, loop-safe questions (answer concisely, don't counter-consult). Dispatch
is **async**: the consulting agent ends its turn and is woken when the answer lands. One-hop consults are
verified working; deeper chains (a spawned consultant that itself consults another) complete in
interactive sessions but are unreliable under headless `-p` — for headless automation drive via the
Omnigent server REST API, or keep consults one-hop.

## Install & run — the `fkit` command

One line installs `fkit` as a global command (like `omnigent`), then you run it in any project:

```bash
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh   # once
cd /path/to/project && fkit                                                        # per project
```

You run that one-liner **once**. After that `fkit` keeps itself current:

- Every launch prints its **version** first — e.g. `fkit v0.4.0 (a1b2c3d)` — so you always know what
  you're running. If the last update check saw a newer one, it adds `↑ v0.5.0 available — run: fkit update`
  (from cache, no network on that line). The version lives in the repo-root `VERSION` file — the single
  source of truth, bumped and tagged by `npm run release` (kept in sync with `package.json`).
- **`fkit update`** reinstalls from GitHub on demand (alias: `fkit upgrade`).
- **`fkit reconnect`** finds every session in the team tree whose runner has disconnected
  (`runner_online: false`) — root, teammates, and any ad hoc consult grandchildren — and
  reconnects each one, the client-side recovery recipe from
  [the 2026-07-10 disconnected-runners incident](../ai-agents/knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md)
  codified as a script. `fkit reconnect --help` documents its caveats (internal endpoints, the
  `omnigent.closed` label filter). A stopgap — retire it once the platform ships a first-class
  reconnect + tree-visibility tool.
- A normal **`fkit`** does a throttled check (default every hour) and, when a newer version is published,
  auto-updates and continues on the fresh code. It's silent when already current and skips cleanly
  offline. Toggles: `FKIT_NO_AUTO_UPDATE=1` (check + notify only), `FKIT_NO_UPDATE_CHECK=1` (no network),
  `FKIT_UPDATE_INTERVAL_MIN` (throttle window; `0` = check every launch). A source checkout is never
  auto-updated — update it with `git`.

`install.sh` puts the agent bundles + scaffold under `~/.local/share/fkit/` and a `fkit` launcher in
`~/.local/bin/`. Running **`fkit`** in a folder self-decides:

- **Fresh folder** → scaffolds `ai-agents/`, vendors the agents into `.fkit/agents/`, runs a quick
  terminal **intake** (writes `.fkit/intake.md`), then launches the team.
- **Already set up** → resumes the same team session (or creates it the first time).

### One durable, resumable team session

`fkit` opens a **single** `fkit-team` root session that stands up the six agents (`producer`, `coder`,
`reviewer`, `architect`, `wiki`, `adversarial-reviewer`) as **named children in the web UI's Subagents
panel** — each directly chattable (click one, or "take over"). One entry in the sidebar, not six, and it
never proliferates.

It's **durable and resumable**: the root's conversation id is cached in `.fkit/team-session`, and every
later `fkit` **resumes that same session** (via `omnigent run --resume`, recreating only if the id is
gone). Start today, close Omnigent, come back tomorrow — same workspace, same teammates, nothing piled up.
The root is idempotent: on resume it re-checks the roster and stays quiet rather than duplicating anyone.

It opens **exactly one browser tab**, at the server's real URL — `fkit` asks `omnigent host status` for
the actual `server_url` rather than assuming `6767` (Omnigent picks a free port when 6767 is taken).
`FKIT_NO_BROWSER=1` skips the browser. The producer, when you open it on a fresh project, offers full
initiation (see below).

Consults are unchanged — a teammate that needs a peer (e.g. coder→architect) spawns it as a grandchild
under itself, off the root panel, so the panel always shows the clean six.

**One agent in your terminal instead** (the agents spawn each other by relative `config_path`, which
Omnigent requires to stay inside the working directory — hence the vendored `.fkit/agents/`):

```bash
.fkit/run coder        # or producer / reviewer / architect / wiki / adversarial
```

Agents use `os_env: caller_process, cwd: .`, so they operate on the project root you launch them from.
`omnigent run` auto-spawns the local server the spawn model needs — no separate `omnigent server` step.
Validate the bundles first with `omnigent/validate-bundles.sh` (Omnigent has no `validate` CLI).

## First run — project initiation

A brand-new project has an empty `ai-agents/` and a placeholder `PROJECT.md`, so launching an agent
into it would drop the owner at a blank prompt with no context. The **producer** closes that gap: on a
fresh project (its `PROJECT.md` still carries the `fkit:uninitialized` marker) the launcher seeds the
producer's first message — `omnigent run … -p "run project initiation"` — so the session opens directly
into the **`initiate-project`** skill. That skill (1) interviews the owner about the product, (2) spawns
the **fkit-architect** to run its **`survey-project`** skill (a non-interactive, evidence-first codebase
survey that writes `ai-agents/knowledge-base/architecture.md`), (3) writes `PROJECT.md` from both, and
(4) ends with a readiness summary and concrete next steps. Writing real content removes the marker, so
subsequent launches give the normal situation briefing instead. The producer also self-detects an
uninitialized project from its prompt, so initiation still triggers even without the seeded message.

## Scaffold — standing up a new project

[`scaffold/`](./scaffold/) is a starter the agents operate on: an empty `ai-agents/` working
structure (`wiki-vault/` incl. the wiki `schema.md` the fkit-wiki agent reads at runtime, plus
`knowledge-base/`, `tasks/`, `sprints/`, `reviews/`) and fill-in `CLAUDE.md` / `AGENTS.md` /
`ai-agents/knowledge-base/PROJECT.md`. To set up a fresh project, copy `scaffold/ai-agents/` and the
two context files into its root, then fill in the placeholders. A project that already has an
`ai-agents/` tree + context files needs nothing from here.

## Shared, cross-agent rules

Rules that apply to *all* agents (e.g. "never commit unless asked", secrets hygiene) belong in the
project-root **`CLAUDE.md`** (read by the claude-sdk agents) and **`AGENTS.md`** (read by the codex
agents) — the harness injects them automatically alongside each agent's own prompt (verified). Starter
versions of both ship in [`scaffold/`](./scaffold/) (see above); copy them to your project root and
edit. Omnigent has **no** native "shared config across agents" mechanism (no `extends`/`base`;
`instructions:` *replaces* the prompt), so CLAUDE.md/AGENTS.md is the DRY home for shared instructions —
keep the two in sync by hand.

## Status & caveats (alpha)

The core collaboration is **verified live** on Omnigent 0.4.0 — spawn-by-`config_path`, the vendoring
model, one-hop and two-hop consults, codex-under-claude harness mixing, and the wiki's delegated-query
init all confirmed end-to-end. Remaining caveats:

- **Deep consult chains under headless `-p`.** A spawned consultant that itself consults another agent
  completes in an interactive session but may not finish under headless `-p` (the run can exit
  mid-chain). For headless/CI, drive via the Omnigent server REST API, or keep consults one-hop.
- **Role boundaries are prompt-enforced, not sandboxed.** All agents run `sandbox: none`, so
  "REVIEW-ONLY" / "wiki-writes-only" live in the prompts (and the blast_radius DENY set), not the
  sandbox. Omnigent supports `sandbox.write_paths` to enforce these structurally — adopting it is a
  planned follow-up (verify it doesn't break model/git access on your platform first).
- **`gate_pushes: false`.** Chosen so headless runs don't hang on an unanswerable approval prompt; the
  catastrophic DENY set (force-push, `rm -rf /`, hard-reset to a remote) still applies, and "never
  commit/push unprompted" is a prompt hard-rule. Flip to `true` for an interactive hard push-gate.

Run `omnigent/validate-bundles.sh` before relying on any change.
