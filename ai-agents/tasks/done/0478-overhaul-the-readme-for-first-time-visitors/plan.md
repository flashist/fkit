# Plan — `0478` Overhaul the README for first-time visitors

**Status:** awaiting owner approval (plan gate). Written 2026-10-02 by a spawned `fkit-coder`,
plan-only, driven by `fkit-lead`. No README, doc or source file was touched; only this file and
`worklog.md` were written.

**Spec:** `assets/source-brief.md`, overridden by the owner rulings in `brief.md` (straight to `main`;
History → `CHANGELOG.md`; handoff file moved, not deleted).

---

## 0. Summary

- New README ≈ **173 lines** (from 230). ⚠️ **Over the 110–130 target** — see §9 decision D1. Every
  section of the source-brief outline is present, in that order.
- **New files:** `CHANGELOG.md`, `CONTRIBUTING.md`, `docs/board.md`.
- **Edited:** `README.md`, `claude/README.md` (small merges only), `package.json` (`description` only).
- **Moved (rename, content unchanged):** `handoff-fkit-status-filtered-board.md` →
  `ai-agents/knowledge-base/reports/2026-07-18-handoff-fkit-status-filtered-board.md`.
- **No behaviour change** — no launcher, installer, skill, test or scaffold edit.
- **Manifest regeneration: not needed** (§7).
- Baseline `npm test` before any change: **green** — 1017/1017 unit tests, `prove-red.sh` hard gate
  passed, exit 0.

---

## 1. Ground checked before planning

- `git status`: `README.md` clean; `0475`, `0476`, `0467` all still `🔲 Backlog` — nobody else is
  editing the README. Re-check right before the build.
- Read in full: `README.md`, `install.sh`, `claude/fkit-claude.sh`, the relevant parts of
  `claude/fkit-claude-init.sh`, `claude/README.md`, `package.json`, `RELEASING.md`,
  `.github/workflows/test.yml`, the handoff file, the reports folder's `README.md`, the
  `fkit-task-brief` / `fkit-task-ship-loop` / `fkit-lead` heads, and the two repo-content guards
  (`test/reference-integrity.test.js`, `test/coordination-citation-policy.test.js`).
- Wiki (`/fkit-query` read): `wiki/systems/install-and-self-update.md` says nothing about OS support or
  uninstall. No wiki fact constrains this task.

### Facts that shape the plan

| Fact | Source |
|---|---|
| Installer needs `curl` and `tar`; refuses without them | `install.sh:23-25` |
| Defaults: repo `flashist/fkit`, ref `main`, share `~/.local/share/fkit`, bin `~/.local/bin` | `install.sh:18-21` |
| Installer copies `claude/` only, removes old `omnigent/`, writes `.version` into the share dir | `install.sh:39-49`, `:65-70` |
| PATH check only **prints** the `export PATH=…` line; never edits a shell profile | `install.sh:107-118` |
| Project setup script is bash (`#!/usr/bin/env bash`); hooks are `#!/bin/bash` | `claude/fkit-claude-init.sh:1`, `claude/*-hook.sh` |
| Launcher env vars: `FKIT_NO_SELF_HOST`, `FKIT_NO_UPDATE_CHECK`, `FKIT_UPDATE_INTERVAL_MIN` (default 60, 0 = every launch), `FKIT_REPO`/`FKIT_REF` (fall back to the ref recorded in `.version`), `FKIT_SETUP_ONLY` (exits non-zero on failed setup) | `claude/fkit-claude.sh:42`, `:127-129`, `:106-107`, `:527-529` |
| `FKIT_CLEANUP_DRY_RUN` is read by the setup script; listed in `fkit --help` | `claude/fkit-claude-init.sh:835`; `claude/fkit-claude.sh:193` |
| `FKIT_NET_TIMEOUT` is **not** a user setting — hard-assigned `5` | `claude/fkit-claude.sh:70` |
| `FKIT_AIBOARD` is read only by the repo-local board | `bin/fkit-board.mjs` |
| `fkit update` re-runs the installer passing `FKIT_REPO`/`FKIT_REF` only — `FKIT_SHARE`/`FKIT_BIN` come from the caller's environment | `claude/fkit-claude.sh:100-104` |
| Fresh project: prints "This project is not initiated yet — starting the producer to set it up." → runs `.fkit/interview` → runs the producer (not `exec`) → opens the lead only if the producer exited 0 **and** `PROJECT.md` is no longer a placeholder | `claude/fkit-claude.sh:606-638` |
| Intake prints " fkit — quick project intake", asks 6 questions, Enter skips | `claude/fkit-claude-init.sh:685-694` |
| Project-side files fkit creates: `.claude/agents/fkit-*.md`, `.claude/skills/fkit-*/`, `.fkit/` (intake, `settings/`, `state/`), three `.gitignore` entries, `CLAUDE.md`/`AGENTS.md` (created if absent, else only the `<!-- fkit:begin-rules -->`…`<!-- fkit:end-rules -->` block) | `claude/fkit-claude-init.sh:351-363`, `:600-619`, `:726-728`; `claude/fkit-claude.sh:334`, `:346` |
| CI runs `npm test` on `ubuntu-latest`, Node 24, full clone, on push to `main` + PRs | `.github/workflows/test.yml` |
| `package.json` version is kept in sync with `VERSION` by `bin/release.mjs` | `install.sh:53-54` comment |
| Tags: `v0.1.0`…`v0.1.30` (no `v0.1.18`), `v0.2.1`, `v0.2.2`, `v0.3.0`, `v0.3.1` (+ non-release `pre-task-folder-migration`). `VERSION` = `0.3.1` | `git tag`; `VERSION` |
| Backlog-header correction first shipped in **v0.2.2** (commit `df55b50`, 2026-08-12, changed the `fkit-task-brief` header text) | `git log -S'sprint-*.md' -- claude/skills/fkit-task-brief/SKILL.md`; `git tag --contains df55b50` |
| Omnigent removal first tagged in **v0.2.1** (oldest deletion commit `6fd2d84`, 2026-07-11) | `git log --diff-filter=D -- omnigent`; `git tag --contains 6fd2d84` |
| `claude/structure-manifest.tsv` covers only `claude/scaffold/` paths (`ai-agents/…`, `CLAUDE.md`, `AGENTS.md`) | `bin/generate-structure-manifest.mjs` header; manifest rows |
| Every `.md` under `ai-agents/` (not the wiki) is link-checked by `npm test`; open task folders are also scanned for `ai-agents/<coordination doc>.md:<line>` citations | `test/reference-integrity.test.js`; `test/coordination-citation-policy.test.js` |
| The handoff file has **no** markdown links, so it cannot break the link guard after the move | `grep '](' handoff-fkit-status-filtered-board.md` → none |
| Reports must be named `YYYY-MM-DD-<slug>.md` | `ai-agents/knowledge-base/reports/README.md` §Naming |
| Nothing in the repo links to a root-README `#anchor` (outside frozen history and the wiki) | grep over the repo |
| ⚠️ `install.sh:127-131` still prints "Required: Codex" — contradicts the README's "optional but recommended". That is `0476`'s file; **not touched here** | `install.sh` |

---

## 2. Target README outline (line counts measured on the draft in §3)

| # | Section | Lines | Notes |
|---|---|---|---|
| — | Title, badges, GIF, pitch | 12 | GIF stays a **plain image**, never wrapped in a link |
| 1 | Why fkit | 9 | NEW |
| 2 | Install & run | 23 | + prerequisites, platforms, installer paths, PATH, usage note |
| 3 | A first session | 18 | NEW, checked against the launcher and skills |
| 4 | See it in action | 4 | the video, a bare standalone `user-attachments` line |
| 5 | The team | 20 | table kept; ADR links removed; plain-language lock paragraph |
| 6 | Key terms | 14 | NEW, the ten terms §4.3 names |
| 7 | Updating | 15 | table + 4 lines on drift / `/fkit-heal` |
| 8 | Configuration | 17 | NEW, every user-facing `FKIT_*` |
| 9 | Uninstall | 13 | NEW |
| 10 | Setting up a project by hand | 7 | shortened |
| 11 | Web board (repo-local) | 5 | 2 lines + link to `docs/board.md` |
| 12 | Contributing | 7 | NEW, holds the one ADR-folder pointer |
| 13 | Roadmap | 5 | ADR link removed |
| 14 | License | 3 | unchanged |
| | **Total** | **≈173** | before: 230 |

Why it lands above 130: the outline's fixed structure alone (15 headings, three tables, two code
blocks, ten glossary lines) is ≈ 80 lines before any prose, at this repo's ~100-column wrap.

---

## 3. Draft README (near-final text)

Text is close to final; the build may re-wrap lines. Every factual claim is sourced in §1.

~~~markdown
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
**cannot** do each other's jobs: the coder can't review, only the producer can close a task, and the
reviewer gets a second opinion from a *different* model (Codex). Review stops being a promise and
becomes a rule — with a review ledger per task, a knowledge base (decisions, design specs, reports)
and a wiki, all in an `ai-agents/` folder inside your project.

## Install & run

```bash
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh   # once

cd /path/to/your/project
fkit            # pick a role from the menu (Enter = lead)
fkit coder      # …or go straight to one
```

**Requires:** [Claude Code](https://claude.com/claude-code), `curl`, `tar`, `bash`. **Optional but
recommended:** [Codex](https://github.com/openai/codex) (`npm install -g @openai/codex && codex
login`) — without it, reviews run on Claude only and are **loudly flagged as not model-diverse**.
`fkit` stops if Claude Code is missing; it only warns about Codex. **Platforms:** macOS and Linux.
TODO(owner): Windows — unsupported, or WSL only?

The [installer](install.sh) (read it first if you like) copies fkit to `~/.local/share/fkit` and the
`fkit` command to `~/.local/bin`, which must be on your `PATH` — it tells you if it isn't. It installs
from `main`; re-running it is safe. Each launch then sets the project up if needed (`ai-agents/`,
`CLAUDE.md` / `AGENTS.md`, the agents and skills under `.claude/`) and opens the role **in the same
tab** — for two roles at once, open another tab. fkit runs several Claude Code sessions and subagents,
plus Codex, so expect noticeably more model usage than a single session.

## A first session

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
   `review.md`, and the **producer** closes the task into `ai-agents/tasks/done/`.

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

**The role lock is enforced, not advisory.** A session can run only its own role's `/fkit-*`
commands; the rest still show in the `/` menu but are refused, by a hook that checks every call —
in a role you consult, too. `@fkit-<role> <question>` consults another role and brings the answer
back (up to two hops). **Only the producer closes work**; a close made by an agent rather than by you
is marked `(agent-closed — not owner-verified)`. Details: [`claude/README.md`](claude/README.md).

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
| `FKIT_AIBOARD` | — | Repo-local web board only: path to aiboard's `index.html` |

Installer variables go **after** the pipe (`curl … | FKIT_SHARE=… sh`). `fkit update` re-runs the
installer with your current environment, so keep custom paths exported.

## Uninstall

```sh
rm -rf ~/.local/share/fkit ~/.local/bin/fkit     # fkit itself (or your FKIT_SHARE / FKIT_BIN)
rm -rf .claude/agents/fkit-*.md .claude/skills/fkit-*/ .fkit/    # in each project
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

## Web board (repo-local)

In a checkout of this repo, `npm run board` serves a **read-only** web view of an `ai-agents/` tree at
`http://127.0.0.1:8585/`. It is not installed with fkit. Details: [`docs/board.md`](docs/board.md).

## Contributing

fkit is developed with fkit, so this repo's own `ai-agents/`, `CLAUDE.md` and `AGENTS.md` are its
working files, not part of the product. Tests: `npm test`. Releases: [`RELEASING.md`](RELEASING.md).
More in [`CONTRIBUTING.md`](CONTRIBUTING.md). Design decisions are ADRs in
[`ai-agents/knowledge-base/decisions/`](ai-agents/knowledge-base/decisions/).

## Roadmap

**Planned, not built yet:** the board becomes fkit's built-in, single store for every project's tasks
and sprints. Everything above describes fkit as it is today.

## License

[MIT](LICENSE) © 2026 Mark Dolbyrev
~~~

Badges: CI = the `test.yml` workflow badge. Version = shields.io `github/package-json/v` — reads
`package.json` on the default branch, which `bin/release.mjs` keeps equal to `VERSION`. (A tag badge
was rejected: the non-semver tag `pre-task-folder-migration` can confuse "latest tag" logic.) License
= a static MIT badge linking `LICENSE`. All three need the repo to be public, which the `curl | sh`
install already assumes.

ADR check: the draft has **no `ADR-<n>` reference**. The word "ADR" appears three times — the
architect's table row, the glossary entry, and the one decisions-folder pointer in *Contributing*.
Only that pointer is a link.

---

## 4. Relocation table — every block of the current README

Line numbers are the current `README.md`. "Kept" means it stays in the README, maybe tightened.

| Old lines | Content / fact | New home |
|---|---|---|
| 1 | Title | Kept |
| 3 | Teaser GIF (plain image) | Kept, plain image, under the new badge line |
| 5-8 | Pitch: one front door, lead routes / answers / drives, brings decisions to you | Kept (pitch) |
| 8 | `/fkit-sprint-ship-loop` ships a sprint | Kept — *A first session*, team table |
| 10-12 | Seven roles named; role-locked; coder can't review; wiki has one writer | Kept — pitch, *Why fkit*, team table, *Key terms* |
| 14-21 | "What you get": ship loops, tracked reviews + Codex second opinion, knowledge base + wiki | Kept, condensed — *Why fkit* last sentence; *Key terms* (ship loop, review ledger, ADR, wiki librarian) |
| 22-23 | Read-only web board bullet + anchor link | Kept — *Web board* section (anchor link dropped; no inbound links to it exist) |
| 25-26 | Runs on Claude Code; Codex optional but recommended, Claude-only fallback loudly flagged | Kept — *Install & run* |
| 28 | Full video URL | Moved within README — *See it in action*, bare standalone line |
| 30-38 | Install + run commands | Kept |
| 40-44 | Requires Claude Code; Codex optional + install command; stops without Claude, warns without Codex | Kept |
| 46-48 | Launch sets the project up (ai-agents/, CLAUDE.md/AGENTS.md, .claude/, intake); same tab; Enter = lead | Kept — *Install & run*, *A first session* |
| 48-49 | Brand-new project → producer runs `/fkit-initiate-project` → then the lead | Kept — *A first session* steps 1-4 |
| 50 | Two roles → another terminal tab | Kept |
| 52-54 | Throttled check tells you, never auto-updates; `fkit update`; `FKIT_NO_UPDATE_CHECK=1` | Kept — *Updating* row 1 + *Configuration* |
| 54-56 | Checkout never auto-checked; runs checkout's own `claude/`; `FKIT_NO_SELF_HOST=1` | Kept — *Updating* last row + *Configuration* |
| 58-63 | `fkit update` updates fkit not projects; refuses in a checkout; next launch rewrites `.claude/…`; un-relaunched project keeps old copies silently; `FKIT_SETUP_ONLY=1 fkit` | Kept — *Updating* table rows 2-5 |
| 65-75 | "One thing an update does not repair" — stale backlog-header sentence, ADR-041 | **`CHANGELOG.md`** → *Upgrade notes*, full text, version named (v0.2.2). README keeps only "Upgrade notes: CHANGELOG.md" |
| 77-79 | Launch prints one stderr line when `ai-agents/` / root `CLAUDE.md` / `AGENTS.md` diverge | Kept — *Updating* paragraph |
| 78-80 | `.claude/` agents and skills are not part of that check (a launch rewrites them) | **`claude/README.md`** → new 3-line "Drift check" note under its *Install & run* |
| 80-82 | `/fkit-heal` in a producer session; consent-gated, diffs in view, exact approved list, never moves / renames / deletes | Kept, short — *Updating*; full wording also in the `claude/README.md` note |
| 83-84 | `ai-agents/.fkit-accepted-drift` quiets the launch line; `/fkit-heal` still reports in full | Kept (accepted-drift) — *Updating*; "still reports in full" → `claude/README.md` note |
| 86-96 | Team table | Kept; ADR-031 link removed from the lead row |
| 96 | ADR-031 (lead = orchestrating front door) | `claude/README.md` — ADR-031 added to its team table's lead row |
| 98-100 | Eighth role authorized, not built (ADR-028); `/fkit-team` | Kept, ADR link removed. ADR-028 already cited in `claude/README.md` line 6 |
| 102-105 | Closing is producer-only (ADR-033); agent close carries `(agent-closed — not owner-verified)` | Kept, plain. **`claude/README.md`** gains the marker sentence; ADR-033 is already in its skills table header |
| 107-108 | `fkit <role>` pins system prompt + only own skills | Kept, plain. Already in `claude/README.md` |
| 108-109 | `tools:` allowlist for the adversarial reviewer alone (ADR-022) | Already in `claude/README.md` lines 29-31 |
| 109-111 | Foreign skills visible in `/` menu but unrunnable; "ADR-018 §Decision 5, an accepted cost"; independence a fact | Kept, plain ("still show… but are refused"). **`claude/README.md`** gains "— an accepted cost (ADR-018 §Decision 5)" |
| 113-114 | `@fkit-<role>` consults; up to two hops, never a cycle | Kept (two hops). "Never a cycle": already in `claude/README.md` consult rules |
| 114-118 | `PreToolUse` hook checks the spawned agent's own role at any depth; ADR-018 supersedes ADR-012's "advisory in a consult" half | Kept, plain ("in a role you consult, too"). Mechanics already in `claude/README.md` lines 56-65 |
| 120 | Pointer to `claude/README.md` | Kept |
| 122-128 | Setting up by hand: copy scaffold, fill placeholders; existing tree needs nothing | Kept, shortened |
| 128-129 | Role lock wired by the launcher; plain `claude` is not role-locked | Kept. **`claude/README.md`** gains the same sentence (it lacks it) |
| 131-186 | Whole board section: what it is, aiboard, interim reader (ADR-052, ADR-051 Track 1), 7 commands, aiboard lookup order, `--root`, banner, `dashboard.sh` note, `/api/check` warnings, `127.0.0.1:8585`, six GET paths, non-GET refused, no credentials, writes nothing, one subprocess, `test/board-reader.test.js`, not shipped | **`docs/board.md`**, in full (§5.3). README keeps 2 lines + link |
| 188-211 | Layout tree | **`CONTRIBUTING.md`**, verbatim, plus the entries it lacked (§5.2) |
| 213-217 | Roadmap + ADR-052 link + "describes fkit as it is today" | Kept, without the link. ADR-052 lives on in `docs/board.md` |
| 219-226 | History: Omnigent runtime removed in Sprint 2; ADR-009 why; ADR-010 replacement model | **`CHANGELOG.md`** → *History* (ruling 4). Also already in `claude/README.md` lines 10-13 |
| 228-230 | License | Kept |

Every ADR the old README linked is still linked somewhere reachable from the README: 041 →
`CHANGELOG.md`; 009, 010 → `CHANGELOG.md` + `claude/README.md`; 051, 052 → `docs/board.md`; 012, 018,
022, 028, 033 → `claude/README.md` (already); 031 → `claude/README.md` (added). Plus the one folder
pointer.

---

## 5. The other files

### 5.1 `CHANGELOG.md` (new, ≈ 55 lines)

~~~markdown
# Changelog

Notable changes and upgrade notes for fkit, newest first. A release is a `v<x.y.z>` git tag cut by
`npm run release` (see [`RELEASING.md`](RELEASING.md)). The default install tracks `main`, so a change
reaches new installs as soon as it lands there, before any tag.

This file starts after v0.3.1. Earlier releases have tags but no written notes — compare two with
`git log <old-tag>..<new-tag>`.

## Unreleased

- README rewritten for first-time visitors. The web-board details moved to
  [`docs/board.md`](docs/board.md), the repository layout to [`CONTRIBUTING.md`](CONTRIBUTING.md), and
  the history and upgrade notes below into this file.

## Upgrade notes

### Projects with unsprinted briefs filed before v0.2.2: a stale backlog-header sentence

An update does not repair this. A launch refresh replaces the agents and skills under `.claude/` — it
never rewrites your project's own content under `ai-agents/`. If your project filed an unsprinted
brief before the correction shipped in v0.2.2, the header `/fkit-task-brief` generated into
`ai-agents/sprints/backlog.md` says the backlog is excluded from `/fkit-status` because its filename
sits outside a `sprint-*.md` glob. **That sentence is stale prose, not broken behaviour.** Since
[ADR-041](ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
the active sprint is selected by each plan's resolved **identity**, and the backlog is excluded
because its identity is `Backlog`, which is never eligible — a stronger rule, not a weaker one. Your
board works correctly; only its header sentence is wrong. Correct it by hand if you want it accurate;
nothing depends on it.

## History

### The Omnigent runtime was removed (Sprint 2; first tagged in v0.2.1)

fkit originally shipped a second runtime on [Omnigent](https://omnigent.ai). It was removed in
Sprint 2 — see
[ADR-009](ai-agents/knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md) for
why, and
[ADR-010](ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md) for
the role-locked model that replaced its team-session topology.

## Releases

| Tag | Date |
|---|---|
| `v0.3.1` | 2026-09-18 |
| `v0.3.0` | 2026-09-08 |
| `v0.2.2` | 2026-08-14 |
| `v0.2.1` | 2026-08-08 |
| `v0.1.0` – `v0.1.30` | 2026-07-03 – 2026-07-11 (no `v0.1.18`) |
~~~

Dates are the tagged commit's date (`git log -1 --format=%ad --date=short <tag>`); the build re-reads
them, and uses the tag's own date instead if the two differ for an annotated tag. Nothing else is
claimed per version: no written notes exist for them. **The ADR-041 note keeps its exact old
wording**, with only "this correction" made concrete as "the correction shipped in v0.2.2".

### 5.2 `CONTRIBUTING.md` (new, ≈ 70 lines)

~~~markdown
# Contributing to fkit

## fkit is developed with fkit

This repo runs fkit on itself. Its `ai-agents/` (briefs, sprints, reviews, decisions, wiki),
`CLAUDE.md` and `AGENTS.md` are fkit's own working files, not part of the product. Changes go through
the roles: the producer files a brief, the coder plans it (the owner approves) and builds it, the
reviewer reviews it, and the producer closes it. [`CLAUDE.md`](CLAUDE.md) holds the rules every role
follows.

Edit the canonical sources in `claude/`, never the copies in `.claude/` — those are gitignored and
refreshed from `claude/` by `claude/fkit-claude-init.sh .`. Launched inside this checkout, `fkit` runs
the checkout's own `claude/`, so your edits are what the agents use.

TODO(owner): outside contributions — are pull requests welcome, and should a change start as an issue?

## Tests

```sh
npm test                 # everything: unit suites + test/prove-red.sh (~6 min)
npm run test:unit        # the node:test suites only
npm run test:prove-red   # re-runs the suites against deliberate mutants
```

No dependencies and no `npm install`. CI (`.github/workflows/test.yml`) runs `npm test` on Node 24
for every push to `main` and every pull request. Use a full clone: `test/structure-manifest.test.js`
refuses a shallow one.

Changed anything under `claude/scaffold/`? Run `npm run generate:manifest` and commit the regenerated
`claude/structure-manifest.tsv` with it — its test goes red when the manifest is stale.

## Releases

`main` is the release channel: every commit there is live to the next install. Cutting a release:
[`RELEASING.md`](RELEASING.md) (`npm run release`, `release:minor`, `release:major`, `release:dry`).

## The web board

`npm run board` — see [`docs/board.md`](docs/board.md).

## Layout

```
(old README lines 191-210, verbatim, with these added lines:)
README.md / CHANGELOG.md / CONTRIBUTING.md / RELEASING.md   front door, changes, this file, release guide
docs/
  board.md                       the repo-local web board, in detail
  media/                         README images
.github/workflows/test.yml       CI: `npm test` on every push to main and every PR
```

More: the runtime in detail — [`claude/README.md`](claude/README.md); the architecture —
[`ai-agents/knowledge-base/architecture.md`](ai-agents/knowledge-base/architecture.md); design
decisions — [`ai-agents/knowledge-base/decisions/`](ai-agents/knowledge-base/decisions/).
~~~

Sources: "~6 min", Node 24, full clone, triggers — `.github/workflows/test.yml` comments and keys;
scripts — `package.json`; "edit `claude/`, never `.claude/`" — root `CLAUDE.md`; self-hosting —
`claude/fkit-claude.sh:42-48`; manifest duty — manifest header + `bin/generate-structure-manifest.mjs`.

### 5.3 `docs/board.md` (new, ≈ 65 lines)

Old README lines 131-186, **moved in full**, lightly reorganised under headings. Edits allowed:

- Title `# The web board (repo-local)`; old lines 133-140 become the intro, keeping ADR-052 and the
  ADR-051 "Track 1" sentence.
- Headings: *Running it* (the 7-command block, verbatim) · *Finding aiboard* (lines 152-155) ·
  *Another project's board: `--root`* (157-170) · *What it listens on and accepts* (172-177) · *What
  it writes: nothing* (179-183) · *Not shipped* (185-186).
- Links re-pointed for the new folder: `ai-agents/…` → `../ai-agents/…`; "see *Roadmap*" →
  `[Roadmap](../README.md#roadmap)`.
- No sentence dropped and no claim changed — checked by the line-by-line read in §8.

### 5.4 `claude/README.md` (merge only what it lacks — ≈ +8 lines)

1. In "Each session is locked two ways", item 2, after "is **not runnable**": add "— an accepted
   cost (ADR-018 §Decision 5)".
2. After that list: "The lock is wired in by the launcher at each launch — a session opened with plain
   `claude` is not role-locked."
3. Under the skills table: "A close made by a spawned agent rather than by the owner in a
   `fkit producer` session carries an `(agent-closed — not owner-verified)` marker."
4. Team table, lead row: append a link to ADR-031 —
   `([ADR-031](../ai-agents/knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md))`.
5. Under its *Install & run*, a short **Drift check** note: a launch prints one stderr line when the
   project's `ai-agents/` tree or root `CLAUDE.md` / `AGENTS.md` diverges from what the installed
   version ships; the `.claude/` copies are outside that check because each launch rewrites them;
   `/fkit-heal` (producer) repairs in-session, consent-gated, diffs in view, only the exact approved
   list, never moving, renaming or deleting; `ai-agents/.fkit-accepted-drift` quiets the launch line,
   and `/fkit-heal` still reports those paths in full.

Not fixed, flagged only: its team table's **Tools** column predates ADR-022 (tools were relaxed for
every role but the adversarial reviewer). Out of scope.

### 5.5 `package.json` — `description` only

~~~text
A Claude Code agent team for software projects: seven roles — lead, producer, coder, reviewer,
adversarial-reviewer, architect, and wiki — in role-locked sessions with scoped skills, plus a project
scaffold. Reviews get an independent second opinion from Codex.
~~~

(One JSON string, no line breaks.) No test reads `description` (grep of `test/` and `bin/`). The Codex
sentence is left as it is — rewording Codex outside the README is `0476`'s job.

### 5.6 The handoff file

`git mv handoff-fkit-status-filtered-board.md
ai-agents/knowledge-base/reports/2026-07-18-handoff-fkit-status-filtered-board.md`

- Destination: `knowledge-base/reports/`, as the brief recommends — its related task `0039` is in
  `tasks/done/`, which is frozen.
- Date prefix: that folder's naming rule (`YYYY-MM-DD-<slug>.md`); 2026-07-18 is the file's own
  "Date started". Content is byte-for-byte unchanged.
- Safe for the link guard: the file has no markdown links. Not a parity drift: reports are never
  dual-home drift.
- **Note for `0236`:** its sweep inventory lists `repo-root handoff-fkit-status-filtered-board.md`.
  The worklog records the new path so `0236` does not chase a missing file. This task does **not**
  edit `0236`'s brief (a producer file); the lead or producer may add a one-line note there.

---

## 6. Build steps (after approval)

1. `git status` — confirm `README.md`, `claude/README.md`, `package.json` are still clean and `0475` /
   `0476` have not started. If either has, stop and report.
2. `git mv` the handoff file (§5.6).
3. Write `docs/board.md` (§5.3) — move first, so nothing is cut before it has a home.
4. Write `CHANGELOG.md` (§5.1) and `CONTRIBUTING.md` (§5.2).
5. Merge into `claude/README.md` (§5.4).
6. Edit `package.json` `description` (§5.5).
7. Rewrite `README.md` from §3, applying the answers to §9.
8. Run the checks in §8; fix anything red.
9. Worklog: delivery record — restructure summary, relocation table with each fact's new location,
   source per new claim, `TODO(owner)` list, GitHub "About"/topics step, before/after line counts,
   the `0236` / `0467` notes, the `RELEASING.md` question. Draft commit message there. **No commit.**

---

## 7. Structure manifest — not regenerated

`claude/structure-manifest.tsv` hashes only paths shipped from `claude/scaffold/`. This task touches
nothing there: root `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `docs/`, `claude/README.md`,
`package.json`, and a file under the repo's own `ai-agents/knowledge-base/reports/`. `npm test`
(which includes `test/structure-manifest.test.js`) confirms it.

---

## 8. Verification

1. **`npm test`** green; state the pass count (baseline taken before planning — see the worklog).
2. **Line counts:** `wc -l README.md` before (230) and after.
3. **No ADR refs:** `grep -nE 'ADR-[0-9]+' README.md` → nothing; `grep -n 'decisions/' README.md` →
   the glossary line (plain text) and the one *Contributing* link. ⚠️ The brief's literal
   `grep -n 'ADR' README.md` will also hit the architect's table row and the glossary — deliberate;
   neither is a reference.
4. **Relative links** in `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `docs/board.md`,
   `claude/README.md`: a script extracts every `](target)`, skips `http(s):` / `mailto:` / pure
   `#anchor`, strips `#…`, resolves against the file's folder, and tests `-e` with a **case-exact**
   check (macOS is case-insensitive). Output: zero misses.
5. **Anchors:** the one new anchor link (`../README.md#roadmap`) is checked by hand against the
   heading.
6. **Nothing lost:** walk §4 row by row and find each fact at its new home by reading, not by
   assumption. For `docs/board.md`, a word-level diff of old lines 131-186 against the new file shows
   only headings and re-pointed links.
7. **GIF / video:** line 5 is `![…](docs/media/fkit-teaser.gif)` with no wrapping link; the video is a
   bare line under *See it in action*. GitHub preview of badges, tables, GIF and video: only possible
   after the push (straight to `main`, no branch) — the worklog says so, and lists it as a post-push
   check for the owner.
8. **`package.json`:** valid JSON (`node -e "require('./package.json')"`); description names seven
   roles, including the lead.
9. **Handoff file:** absent at root; `git diff --staged -M --stat` shows a 100% rename (or `cmp`
   passes).
10. **Codex wording:** README still says "optional but recommended" with the Claude-only fallback
    loudly flagged.
11. **This task folder:** `plan.md` / `worklog.md` hold no `ai-agents/<board or task file>.md:<line>`
    citations (the citation guard scans open task folders).

---

## 9. Decisions for the owner

- **D1 — README length.** All mandated sections land at ≈ 173 lines, not 110–130.
  (a) **(Rec)** Accept ≈ 170: everything a visitor needs stays on one page, which is the brief's main
  success test. (b) ≈ 145: move *Configuration* and *Key terms* to a new `docs/reference.md`, one link
  line each. (c) ≈ 130: (b) plus trimming the team table and *Updating* prose — loses detail the
  brief asked to keep.
- **D2 — Windows.** Nothing in the code or wiki says. (a) **(Rec)** You state it now ("not supported",
  "WSL works", or "untested") so no `TODO(owner)` ships on the live README. (b) Ship
  `TODO(owner): Windows …` visibly — it goes live to every visitor the moment it lands on `main`.
- **D3 — Outside contributions** (for `CONTRIBUTING.md`). (a) **(Rec)** You state the policy now
  (e.g. "issues and PRs welcome; open an issue first for anything large"). (b) Ship a visible
  `TODO(owner)`.
- **D4 — `RELEASING.md` and the changelog** (flag only, not changed here). With a `CHANGELOG.md`, should
  the release flow start updating it (a step in `RELEASING.md`, maybe in `npm run release`)? If not,
  the file goes stale after one release. **(Rec)** File a follow-up task; decide there.
- **D5 — Handoff file name.** (a) **(Rec)** Add the date prefix the reports folder requires
  (`2026-07-18-…`); content unchanged. (b) Keep the bare name.

## 10. `TODO(owner)` items

Only those left open by D2 / D3. If you answer both, none ship. The worklog also lists the owner
actions that are not in the text: GitHub "About" description + topics (`claude`, `claude-code`,
`codex`, `ai-agents`, `agents`, `skills` — the current `package.json` keywords; the source brief also
suggests `code-review`, `multi-agent`), and a post-push look at the rendered README.

## 11. Risks

- **`main` is live.** A broken link or bad badge ships to every visitor at once; §8 checks 4-8 run
  before you are asked to commit.
- **Concurrent edits** by `0475` / `0476` — checked in step 1.
- **Link guard on `ai-agents/`** — the moved handoff file and this folder's files are link-checked by
  `npm test`; both are clean by construction.
- **`0467` follow-up:** retiring the board reader must also delete `docs/board.md`, the README's
  *Web board* section, the `FKIT_AIBOARD` row, and the `CONTRIBUTING.md` board pointer.
- **Docs that will lag:** `ai-agents/knowledge-base/architecture.md`'s repo tree does not list `docs/`,
  `CHANGELOG.md` or `CONTRIBUTING.md` (architect's file — not edited); the wiki needs a `fkit-wiki`
  sync after close.
- **Badges** cannot be checked offline; a wrong shields.io URL shows as a broken image only after the
  push.
- **`fkit update` with custom `FKIT_SHARE` / `FKIT_BIN`** silently reinstalls to the defaults unless
  the variables are still exported. Documented in *Configuration*; the behaviour is not changed here.
