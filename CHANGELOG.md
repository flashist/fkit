# Changelog

Notable changes and upgrade notes for fkit, newest first. A release is a `v<x.y.z>` git tag cut by
`npm run release` (see [`RELEASING.md`](RELEASING.md)). The default install tracks `main`, so a change
reaches new installs as soon as it lands there, before any tag. `npm run release` turns
`## Unreleased` into that release's own `## v<x.y.z> — <date>` section, and refuses to release while
it is empty.

This file starts after v0.3.1. Earlier releases have tags but no written notes — compare two with
`git log <old-tag>..<new-tag>`.

## Unreleased

- `fkit board` now refuses (403) a request addressed under any host name other than `localhost` or an
  IP address, so a web page you have open cannot read your board through another domain name.
  `http://127.0.0.1:8585/` and `http://localhost:8585/` work as before.
- New: `fkit board` — a read-only web view of the project's tasks and sprints, at
  `http://127.0.0.1:8585/`. Run it in the project's folder. It needs Node.js; no other fkit command
  does. Existing installs get it with `fkit update`.
- When setup fails, the launcher no longer starts a session on agents it cannot use — any symlink on
  the way (a symlinked `.claude`, `.claude/agents` or agent file, working or dangling), a directory, or
  an unreadable file named `fkit-*.md`. It refuses and names each offending path and why. A project
  with no agents at all gets the same message as before.
- The launch-time update check can no longer hang on a stalled network: its `git ls-remote` probe now
  gives up after about 5 s, like the curl calls, so a whole check takes about 10 s at worst and stays
  silent. `fkit update`'s download of the installer script now gives up after 60 s with its usual
  failure message; the installer's own downloads still have no time limit.
- Reviews no longer share one Codex prompt file. Each run writes its own under `.fkit/tmp/` (task or
  branch label, the round for a stateful review, and a run id), so two reviews running at once can no
  longer hand Codex the wrong diff. Existing installs get it on next launch.
- Every question an fkit session puts to the owner now explains first, in chat, and ends with the
  option `Explain more, then ask again`. A reply that is not a choice — that option, or a question typed
  into the dialog — gets a full answer in chat and no new dialog that turn; the same question comes
  back on the owner's next message, and such a reply never counts as approval. The full rule is the
  new convention `ai-agents/knowledge-base/conventions/asking-the-owner.md` (existing installs get it
  on next launch); the shared rules block now only points to it. If your own instructions already add
  this exact option, you see it once.
- Code comments now follow "say WHY, not WHAT" (new convention `code-comments.md`, new shared
  rules-block line; the block's wording was tightened to make room — no rule changed). Existing
  installs get it on next launch.
- The dependency-form convention (`dependency-declaration-form.md`) now says how the board reads a
  `Depends on:` line — which task IDs count, how to mark one soft (`— soft, not hard`), and the known
  misses. Existing installs: `/fkit-heal` offers the updated page.
- The web board no longer answers a poll, a task's details or a sprint's details with an error when a
  task or sprint board is closed or moved at that moment. A card that moved mid-poll is missing for
  one poll and then shows in its new place.

## v0.3.2 — 2026-10-10

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
- `/fkit-status`: the board's Task cell now shows just the task's title. Anything from the first `*(`
  on — the notes added after a title — is cut and marked ` …`. The full text stays in the board file
  and the brief, which the row's Filename column links. A cell with no `*(` is unchanged.
- `/fkit-status` now reports, as a decision for you, a sprint task that waits on a task the sprint
  cannot count on (the board's new `drift depends-on-later-sprint` record): move the dependents, move
  the blocker earlier, or accept it and record why. It blocks nothing by itself.
- `/fkit-sprint-ship-loop` now says when a task on the sprint waits on a task the sprint cannot count
  on — one in a later or not-started sprint, a closed or unplaceable one, or on the Backlog board —
  read from the board's `drift depends-on-later-sprint` record. It says so at the start of a run, when
  a later check in the run finds a new one, and when it stops on a dependency deadlock.
  `/fkit-task-ship-loop` mentions it at its plan gate.
- The lead now hands a code-level 'why' question (an error's cause, traced in code or logs) to a
  spawned coder instead of tracing code itself; it tells you it delegated, passes no guess as fact, and
  relays any read approval quoted.
- The coder, `/fkit-plan-task` and both ship loops now run the checks a change needs, not one fixed
  command. They map the changed files to your project's checks (its own "what changed → what to run"
  table if it has one, for example in `CONTRIBUTING.md`), and run the full suite at release, when the
  tests or test tooling change, or when unsure. Plans and reports name the checks that ran and the
  ones skipped, and why. `/fkit-sprint-ship-loop`'s verify step used to say `node --test`, fkit's own
  test command, in every project. `/fkit-review` follows the same rule when it runs checks itself.
- `🚧 Blocked` now means the work cannot proceed, started or not. A task nobody may pick up yet —
  held for a decision, an outside event, or other work that may remove what it would change — is
  Blocked. A decision the task itself would settle first is not a blocker: if a session could start
  it today, it stays `🔲 Backlog`. The rule lives in your project's
  `ai-agents/knowledge-base/conventions/task-status-vocabulary.md`, so it applies once you take that
  file's new version (see *Upgrade notes* below).

## Upgrade notes

### Every project upgrading from v0.3.1 or earlier: one new file, and a launch warning

This also applies to a `main` install from before this release. fkit ships new versions of four files
it put in your project, and one new file. After `fkit update`, your project's next `fkit` launch:

- **adds** `ai-agents/knowledge-base/conventions/placement-questions-state-the-knock-on.md` and says
  so once (unless that path is in `ai-agents/.fkit-keep-out`). It is new and untracked — commit it.
- **warns on every launch** that these paths diverge from what the installed fkit ships:
  - `ai-agents/README.md`
  - `ai-agents/knowledge-base/conventions/README.md`
  - `ai-agents/knowledge-base/conventions/task-status-vocabulary.md`
  - `ai-agents/tasks/README.md`

  To clear it, run `/fkit-heal` in a `fkit producer` session. It shows each file's diff and replaces
  only the ones you approve. A file you edited yourself is shown but never replaced — merge it by hand.
  To keep your copy instead, list its path in `ai-agents/.fkit-accepted-drift`, one per line. That
  silences the launch warning for it, though `/fkit-heal` still reports it. Nothing changes until you
  choose.

### Custom-path, fork or pinned-ref installs upgrading from v0.3.1 or earlier: reinstall once by hand

If you installed with a custom `FKIT_SHARE`, `FKIT_BIN`, `FKIT_REPO` or `FKIT_REF` and did not keep
them exported, re-run the installer once by hand, with the same variables **after** the pipe:

```sh
curl -fsSL https://raw.githubusercontent.com/<repo>/<ref>/install.sh | FKIT_REPO=<repo> FKIT_REF=<ref> FKIT_SHARE=<dir> FKIT_BIN=<dir> sh
```

Your current fkit's own `fkit update` cannot do this for you: an update from v0.3.1 or earlier (or
from a `main` install older than this release) still runs the **old** launcher, which hands the new
installer nothing, so it installs one last time into the defaults. After the hand reinstall,
`.version` remembers your source and paths. Then remove any copy an earlier `fkit update` left at the
default paths (`~/.local/share/fkit`, `~/.local/bin/fkit`) if it is not the one you use. Default
installs need no hand reinstall.

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
