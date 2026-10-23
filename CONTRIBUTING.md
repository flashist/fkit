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
npm test                 # the default suite (~1.5 min; budget 2 min)
npm run test:release     # the release tool's own test — `npm run release` runs it (~45 s)
npm run test:prove-red   # the four deliberate mutants — nightly in CI (~2.5 min)
npm run test:docs        # fast path: the two named-exception tests that read ai-agents/ (under 1 s)
```

`npm run test:unit` is an alias of `npm test`. Local times, a busy Apple M4 Pro (14 cores),
2026-10-20: `npm test` 76.2 / 82.2 / 76.2 s (three runs, task 0530; load average 7.0 / 11.5 / 11.2 at
start — no idle window came, so these are not idle-Mac figures); `test:release` 46 s (one run, load
12.4); `test:prove-red` 151.6 s (one run, task 0529). Yours will differ.

When each runs — only `npm test` counts against the 2-minute budget (ADR-057 §D10):
- `npm test` — CI, on every push to `main` and every pull request; and every `npm run release`.
- `npm run test:release` — every `npm run release` (after `npm test`), or by hand.
- `npm run test:prove-red` — nightly in CI, or by hand. The release does not run it.

On a red, `test/prove-red.sh` prints where it kept each failing step's own output (a `fkit-prove-red-kept.*` folder under `$TMPDIR`).

No dependencies and no `npm install`. CI (`.github/workflows/test.yml`) runs `npm test` on Node 24
for every push to `main` and every pull request, in one timed step that fails the job when
`npm test` takes over 120 s, naming the budget and the time taken. On the
runner (`ubuntu-latest`), 2026-10-20: `npm test` 72 / 65.8 / 81.6 / 85.2 / 60.7 s (five runs —
runner times vary ~60–85 s; the slowest is 71% of the budget); prove-red 118 s (one run; job 123 s).
Use a full clone:
`test/structure-manifest.test.js` refuses a shallow one.

Prove-red runs in CI nightly at 03:17 UTC (`.github/workflows/prove-red.yml`; also runnable from the
Actions tab, `workflow_dispatch`). Its limits, from GitHub's docs (2026-10-20): it runs on `main`'s
latest commit only — branches, pull requests and a release's working tree are not covered; GitHub
may delay a scheduled run at busy times or drop it, and a dropped night sends no message; the
schedule is disabled after 60 days with no repository activity. A red run notifies, by email or on
the web, whoever last changed the workflow's cron line — **only if that person has Actions
notifications on** (github.com/settings/notifications → Actions; check it once). A red run also
shows on the Actions tab.

Changed anything under `claude/scaffold/`? Run `npm run generate:manifest` and commit the regenerated
`claude/structure-manifest.tsv` with it — its test goes red when the manifest is stale.

### Test rules

fkit's own rules for its test suite, set by
[ADR-057](ai-agents/knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md),
which holds the reasons. The shipped prompts tell agents to follow "the project's own test rules and
key list"; in this repo, these are they.

- **What a test may cover.** Only how a shipped script behaves, seen from outside — inputs in; exit
  code, output and files written out; no sourcing or mocking of its internals:
  1. the launcher, init and hooks — `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, the hook
     scripts under `claude/`, and `claude/skills-for-role.sh`, which they source;
  2. shipped skill executables — `dashboard.sh`, `throughput.mjs`, the heal `check.sh` / `repair.sh`;
  3. the board module `board/`, tested under `test/board/` (it will ship — ADR-057 §D1's dated note);
     its tests import the module, so "from outside" there means through its exported API only;
  4. the board reader `bin/fkit-board.mjs`, which ships as `fkit board` (ADR-057 §D1 category 3's
     dated note, ADR-058) — run as a process, through its HTTP answers.

  Not repo-only tools under `bin/`, not the wording or shape of prompts and documents under `claude/`,
  not the content of `ai-agents/`. LLM behaviour stays out.
- **Named exceptions — these four, no others:** `test/dual-home-parity.test.js`,
  `test/task-id-uniqueness.test.js` and `test/structure-manifest.test.js` (in `npm test`), and
  `test/release/release-summary.test.js` (its own script, `npm run test:release`, run before a
  release). No test may cite "the fourth
  category" as its licence.
- **Growth stop.** No new test file and no new prove-red case without the owner's OK — each one, every
  time, in any lane (the default suite, nightly prove-red, the release-test script). A plan the owner
  approves counts as that OK only for the files or cases it names; an agent's plan-review APPROVE is
  not the owner's OK. There is no numeric cap: growth is held back by that OK and the 2-minute budget.
- **A missing test is a suggestion, not a defect** — on code that behaves correctly — **except on the
  key list**, where it is still a defect:
  1. the argv the launcher hands to `claude`, including whether it `exec`s at all (`--resume`, cold
     start);
  2. the role-lock `skillOverrides` matrix;
  3. the skill-ownership hook's allow / deny decision;
  4. any code path that writes or deletes a file in a user's project (init's convergence and
     never-overwrite rule, orphan cleanup, heal `repair.sh`).
- **Prove-red's lane.** Four cases only (numbers kept from before the cut): M1 (a `skills_for_role()` entry), M2 (the
  `--resume` passthrough), M30 (`exec` on the cold start) and M31 (the same, intake path only). Each
  runs only the test file it needs, nightly in CI, outside `npm test`; still runnable by hand with
  `npm run test:prove-red`. A fifth case needs the owner's OK.
- **The budget.** The default `npm test` takes ≤ 2 min locally on an idle Mac; CI fails the job if it
  goes over. Nightly prove-red and the release-test script are outside it.

### What to run for a change

`npm test` is what CI runs on every push; `npm run release` runs it and then `npm run test:release`.
While you work, run what the change needs:

| What changed | Run | Why |
|---|---|---|
| Only `LICENSE`, `ai-agents/wiki-vault/` (except `schema.md`), `README.md`, `CONTRIBUTING.md`, `RELEASING.md`, `CHANGELOG.md`, `docs/`, `claude/README.md` | **nothing** — report "no automated check covers these files"; check any links you touched by eye | No test reads their contents. In the vault, `dual-home-parity` only checks which files sit outside `wiki/`. |
| `bin/release.mjs` | `npm test` + `npm run test:release` | The release tool's own test is outside `npm test`. |
| `claude/fkit-claude.sh`, `claude/skills-for-role.sh`, `claude/skill-ownership-hook.sh`, `test/launcher-contract.test.js`, `test/skill-ownership-hook.test.js`, `test/prove-red.sh` | `npm test` + `npm run test:prove-red` | Prove-red mutates these files or runs these tests. |
| Anything else — `ai-agents/` (`wiki-vault/schema.md` included), other `claude/` files, `claude/scaffold/`, other `bin/` tools, `test/`, `package.json`, `.github/` — or **unsure** which row applies | `npm test` | The default command. When unsure, nothing beyond it. Before a release, check the last nightly prove-red run is green (`RELEASING.md` §3). |

- **A change that spans rows: run what every row it touches asks for.**
- **Always report which checks ran and which were skipped, and why — a skipped check is not a passed one.**
- Does prove-red mutate a file or run a test file? Read its `--- Mutation` blocks and `run_*_suite`
  helpers. Today: the launcher, `skills-for-role.sh`, `skill-ownership-hook.sh` and the two test files
  it runs — the table's prove-red row; this list will drift. A plain `grep -F '<path>'
  test/prove-red.sh` also hits files named only in its comments (`fkit-claude-init.sh`,
  `structure-spec.md`, `check.sh`): every copy runs those, but so does `npm test` through the real
  launcher, so they stay in the "Anything else" row. Prove-red copies `claude/` alone, so a change
  that makes `claude/` read a file outside it can red baseline 0b — run prove-red then too.
- `npm run test:docs` runs only `dual-home-parity` and `task-id-uniqueness` — a fast check while you edit
  `ai-agents/`, not a replacement for `npm test`, which also reads the live tree (`dashboard-contract`
  reads the archived sprint boards).

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
.github/workflows/test.yml       CI: `npm test`, timed against its budget, on every push to main and every PR
.github/workflows/prove-red.yml  CI: `npm run test:prove-red`, nightly
ai-agents/                       fkit's own working structure (it is run on itself)
```

More: the runtime in detail — [`claude/README.md`](claude/README.md); the architecture —
[`ai-agents/knowledge-base/architecture.md`](ai-agents/knowledge-base/architecture.md); design
decisions — [`ai-agents/knowledge-base/decisions/`](ai-agents/knowledge-base/decisions/).
