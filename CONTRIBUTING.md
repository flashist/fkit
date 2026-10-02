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
bin/                             repo-local tools — none of these ship to projects
  fkit-board.mjs                 read-only web board over ai-agents/ (`npm run board`)
  board-narrow.mjs               narrow, fixed-width render of a sprint board for the terminal
  release.mjs                    cuts a release (`npm run release`)
  generate-structure-manifest.mjs  rebuilds claude/structure-manifest.tsv
docs/
  board.md                       the repo-local web board, in detail
  media/                         README images
test/                            `npm test` — node:test suites plus test/prove-red.sh
.github/workflows/test.yml       CI: `npm test` on every push to main and every PR
ai-agents/                       fkit's own working structure (it is run on itself)
```

More: the runtime in detail — [`claude/README.md`](claude/README.md); the architecture —
[`ai-agents/knowledge-base/architecture.md`](ai-agents/knowledge-base/architecture.md); design
decisions — [`ai-agents/knowledge-base/decisions/`](ai-agents/knowledge-base/decisions/).
