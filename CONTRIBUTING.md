# Contributing to fkit

Issues and PRs welcome; open an issue first for big changes.

## fkit is developed with fkit

This repo runs fkit on itself. Its `ai-agents/` (briefs, sprints, reviews, decisions, wiki),
`CLAUDE.md` and `AGENTS.md` are fkit's own working files, not part of the product. Changes go through
the roles: the producer files a brief, the coder plans it (the owner approves) and builds it, the
reviewer reviews it, and the producer closes it. [`CLAUDE.md`](CLAUDE.md) holds the rules every role
follows.

Edit the canonical sources in `claude/`, never the copies in `.claude/` — those are gitignored and
refreshed from `claude/` by `claude/fkit-claude-init.sh .`. Launched inside this checkout, `fkit` runs
the checkout's own `claude/`, so your edits are what the agents use.

## Tests — manual only

Owner ruling, 2026-11-07: tests may be used while working, but do not add more permanent tests;
all previous automatic testing is disabled. This supersedes ADR-057's automatic CI/nightly and
release gates and its new-test approval workflow for this work.

Existing suites remain available on explicit request:

```sh
npm test                 # existing default suite
npm run test:release     # existing release-tool suite
npm run test:prove-red   # four existing mutation checks
npm run test:docs        # existing documentation checks
```

`test:unit` aliases `npm test`. There is no test run on push, pull request, schedule, release,
or release dry-run. Both GitHub workflows expose only `workflow_dispatch`; they can also remain
disabled in repository settings. The release tool never invokes npm. `--no-test` remains a
compatibility no-op. Do not re-enable automatic testing or add test files/cases without a new
owner instruction. Temporary, task-local checks are allowed and should not be committed.

Run relevant checks while implementing. Report actual results, failures, skips, and limitations;
a skipped or disabled check is not a pass. No new regression suite is required for this port.
The older suite still has its existing scope and named exceptions; read ADR-057 for history.
Some release tests depended on the removed automatic gate and are skipped for that reason.

No npm dependencies or install step are needed. Use a full clone for the structure-manifest
check. Local HTTP tests need permission to listen on loopback. Ignored OS files can trip the
existing live-corpus parity check; do not claim such failures are product defects without checking.
When changing shipped scaffold files, regenerate `claude/structure-manifest.tsv` with
`npm run generate:manifest`. This is generation, not an automatic test run.

## Releases

`main` is the release channel: every commit there is live to the next install. Cutting a release:
[`RELEASING.md`](RELEASING.md) (`npm run release`, `release:minor`, `release:major`, `release:dry`).

Landed a change people who use fkit would notice? Add a line for it under `## Unreleased` in
[`CHANGELOG.md`](CHANGELOG.md) in the same change. A release refuses to run while that section is
empty, so this keeps the release notes written as you go.

## The web board

`fkit board` in a project, or `npm run board` in this checkout — see [`docs/board.md`](docs/board.md).

## Layout

```
install.sh                       curl|sh entry point — installs the global `fkit` command
VERSION                          fkit's own version (bumped by `npm run release` — see RELEASING.md)
README.md / CHANGELOG.md / CONTRIBUTING.md / RELEASING.md   front door, changes, this file, release guide
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
board/                           the built-in board, being ported from aiboard to Node (ADR-052); not shipped yet
bin/                             tools — only fkit-board.mjs ships with the install; the rest are repo-local
  fkit-board.mjs                 read-only web board over ai-agents/ (`fkit board`, `npm run board`)
  board-narrow.mjs               narrow, fixed-width render of a sprint board for the terminal
  release.mjs                    cuts a release (`npm run release`)
  generate-structure-manifest.mjs  rebuilds claude/structure-manifest.tsv
docs/
  board.md                       the web board, in detail
  media/                         README images
vendor/aiboard/                  aiboard's web page, copied unmodified for `fkit board` (provenance in its README)
test/                            `npm test` — the default suite (node:test)
  board/                         the board module's tests (in `npm test`)
  release/                       the release tool's own test (`npm run test:release`)
  prove-red.sh                   the mutation lane (`npm run test:prove-red`)
.github/workflows/test.yml       manual-only default-suite workflow
.github/workflows/prove-red.yml  manual-only mutation workflow
ai-agents/                       fkit's own working structure (it is run on itself)
```

More: the runtime in detail — [`claude/README.md`](claude/README.md); the architecture —
[`ai-agents/knowledge-base/architecture.md`](ai-agents/knowledge-base/architecture.md); design
decisions — [`ai-agents/knowledge-base/decisions/`](ai-agents/knowledge-base/decisions/).
