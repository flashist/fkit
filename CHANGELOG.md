# Changelog

Notable changes and upgrade notes for fkit, newest first. A release is a `v<x.y.z>` git tag cut by
`npm run release` (see [`RELEASING.md`](RELEASING.md)). The default install tracks `main`, so a change
reaches new installs as soon as it lands there, before any tag. `npm run release` turns
`## Unreleased` into that release's own `## v<x.y.z> — <date>` section, and refuses to release while
it is empty.

This file starts after v0.3.1. Earlier releases have tags but no written notes — compare two with
`git log <old-tag>..<new-tag>`.

## Unreleased

- README rewritten for first-time visitors. The web-board details moved to
  [`docs/board.md`](docs/board.md), the repository layout to [`CONTRIBUTING.md`](CONTRIBUTING.md), and
  the history and upgrade notes below into this file.
- `fkit update` now reinstalls from the repo, ref and paths you installed with. It used to run the
  installer on its defaults (`flashist/fkit@main`, `~/.local/share/fkit`, `~/.local/bin`) unless you
  kept `FKIT_REPO` / `FKIT_REF` / `FKIT_SHARE` / `FKIT_BIN` exported. A failed download now fails the
  update instead of reporting success. And `fkit update` refuses, before downloading anything, when
  the `fkit` you ran is a symlink or a copy of the launcher rather than the command the installer made
  (set `FKIT_SHARE` and `FKIT_BIN` to go ahead; the repo and ref then come from that install's record).
- The installer and docs now say Codex is optional but recommended (the installer used to print
  "Required"). Without it, the reviewer's second opinion runs on Claude only and is loudly flagged as
  not model-diverse. Nothing about how fkit runs changes.
- A spawned coder now writes code when `fkit lead` relays a quoted owner approval (ADR-055) — the same
  declared-approval marker the sprint loop uses. A marker missing any field gets `NEEDS-DECISION`.
- Opt-in plan review for `/fkit-sprint-ship-loop` runs (`--plan-review`, off by default): agents
  approve the plan and Codex reviews it before you do.
- A question that puts a task in a sprint, or changes a `Depends on:` link, must now say in each option
  which open tasks would then wait on which sprint — the recommended option and a worker's
  `NEEDS-DECISION` too. New convention:
  [`placement-questions-state-the-knock-on.md`](ai-agents/knowledge-base/conventions/placement-questions-state-the-knock-on.md).
- Filing a brief, re-pointing a `Depends on:` line, or moving a task between boards now warns (never
  refuses) when a sprint task would wait on a task in a later or not-started sprint, or on the Backlog
  board. The warning offers three ways out: move the dependents, place the blocker earlier, or accept
  it and record why.
- `/fkit-sprint-ship-loop` now says when a task on the sprint waits on a task the sprint cannot count
  on — one in a later or not-started sprint, a closed or unplaceable one, or on the Backlog board —
  read from the board's `drift depends-on-later-sprint` record. It says so at the start of a run, when
  a later check in the run finds a new one, and when it stops on a dependency deadlock.
  `/fkit-task-ship-loop` mentions it at its plan gate.
- The lead now hands a code-level 'why' question (an error's cause, traced in code or logs) to a
  spawned coder instead of tracing code itself; it tells you it delegated, passes no guess as fact, and
  relays any read approval quoted.

## Upgrade notes

### Custom-path or fork installs: reinstall once by hand

If you installed with a custom `FKIT_SHARE`, `FKIT_BIN`, `FKIT_REPO` or `FKIT_REF` and did not keep
them exported, re-run the installer once by hand, with the same variables **after** the pipe:

```sh
curl -fsSL https://raw.githubusercontent.com/<repo>/<ref>/install.sh | FKIT_REPO=<repo> FKIT_REF=<ref> FKIT_SHARE=<dir> FKIT_BIN=<dir> sh
```

Your current fkit's own `fkit update` cannot do this for you: the first update after this change still
runs the **old** launcher, which hands the new installer nothing, so it installs one last time into
the defaults. After the hand reinstall, `.version` remembers your source and paths. Then remove any
copy an earlier `fkit update` left at the default paths (`~/.local/share/fkit`, `~/.local/bin/fkit`)
if it is not the one you use. Default installs need nothing.

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

## Earlier releases

Releases from now on get their own section above; these earlier tags have none.

| Tag | Date |
|---|---|
| `v0.3.1` | 2026-09-18 |
| `v0.3.0` | 2026-09-08 |
| `v0.2.2` | 2026-08-14 |
| `v0.2.1` | 2026-08-08 |
| `v0.1.0` – `v0.1.30` | 2026-07-03 – 2026-07-11 (no `v0.1.18`) |
