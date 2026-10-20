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
npm test                 # everything: unit suites + test/prove-red.sh (~12 min)
npm run test:unit        # the node:test suites only (~1 min)
npm run test:prove-red   # re-runs the suites against deliberate mutants (~11 min)
npm run test:docs        # only the tests that read the live ai-agents/ tree (~30 s)
```

Times are from a busy Apple M4 Pro (2026-10), to be re-measured by `0530`; yours will differ.

On a red, `test/prove-red.sh` prints where it kept each failing step's own output (a `fkit-prove-red-kept.*` folder under `$TMPDIR`).

No dependencies and no `npm install`. CI (`.github/workflows/test.yml`) runs `npm test` on Node 24
for every push to `main` and every pull request. Use a full clone: `test/structure-manifest.test.js`
refuses a shallow one.

Changed anything under `claude/scaffold/`? Run `npm run generate:manifest` and commit the regenerated
`claude/structure-manifest.tsv` with it — its test goes red when the manifest is stale.

### Test rules

fkit's own rules for its test suite, set by
[ADR-057](ai-agents/knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md),
which holds the reasons. The shipped prompts tell agents to follow "the project's own test rules and
key list"; in this repo, these are they.

⚠️ Not all of this is true yet. `0529` cuts the suite and prove-red down to what is below; `0530`
makes CI enforce the budget and adds the nightly prove-red lane. Until each lands, `npm test` still
runs everything listed above, prove-red included.

- **What a test may cover.** Only how a shipped script behaves, seen from outside — inputs in; exit
  code, output and files written out; no sourcing or mocking of its internals:
  1. the launcher, init and hooks — `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, the hook
     scripts under `claude/`, and `claude/skills-for-role.sh`, which they source;
  2. shipped skill executables — `dashboard.sh`, `throughput.mjs`, the heal `check.sh` / `repair.sh`.

  Not repo-only tools under `bin/`, not the wording or shape of prompts and documents under `claude/`,
  not the content of `ai-agents/`. LLM behaviour stays out.
- **Named exceptions — these four, no others:** `test/dual-home-parity.test.js`,
  `test/task-id-uniqueness.test.js` and `test/structure-manifest.test.js` (in `npm test`), and
  `test/release-summary.test.js` (its own script, run before a release). No test may cite "the fourth
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
- **Prove-red's lane.** Four cases only (today's numbering): M1 (a `skills_for_role()` entry), M2 (the
  `--resume` passthrough), M30 (`exec` on the cold start) and M31 (the same, intake path only). Each
  runs only the test file it needs, nightly in CI, outside `npm test`; still runnable by hand with
  `npm run test:prove-red`. A fifth case needs the owner's OK.
- **The budget.** The default `npm test` takes ≤ 2 min locally on an idle Mac; CI fails the job if it
  goes over. Nightly prove-red and the release-test script are outside it.

### What to run for a change

`npm test` is what CI and `npm run release` always run. While you work, run what the change needs:

| What changed | Run | Why |
|---|---|---|
| Only `LICENSE`, `ai-agents/wiki-vault/` (except `schema.md`) | **nothing** — report "no automated check covers these files"; check any links you touched by eye | No test reads their contents. `reference-integrity` scans `ai-agents/` minus the wiki vault; in the vault, `dual-home-parity` only checks which files sit outside `wiki/`. |
| `README.md`, `CONTRIBUTING.md`, `RELEASING.md`, `CHANGELOG.md`, `docs/`, `claude/README.md` | `npm run test:docs` (~30 s); fast path `node --test test/top-level-doc-links.test.js` (under 1 s) | `top-level-doc-links` checks their relative links with `reference-integrity`'s rule; `reference-integrity` scans `ai-agents/` only. The rule skips image links and nested-bracket badge links, so README's teaser gif and its `VERSION` and `LICENSE` badge targets stay unchecked — check those by eye. `CHANGELOG.md` is scanned whole, released entries too, so deleting a file an old entry links to means fixing that entry's link. |
| `ai-agents/wiki-vault/schema.md`; anything else under `ai-agents/` (briefs, plans, worklogs, review ledgers, sprint boards, knowledge-base, ADRs, conventions) | `npm run test:docs` (~30 s) | Only these tests read the live `ai-agents/` tree: links, citations, task/ADR ids, closed ranks, dual-home parity (`schema.md` is dual-homed and must match its scaffold copy byte for byte), the board readers |
| `.md` files under `claude/` (skills, agents, specs) **not named in `test/prove-red.sh`**; `bin/` tools other than `release.mjs`; `CLAUDE.md`, `AGENTS.md` | `npm run test:unit` (~1 min) | Frontmatter, ownership, contract and parity checks read these; `rules-block-budget` reads `CLAUDE.md` and `AGENTS.md`, and `top-level-doc-links` checks their relative links. No mutation edits them. |
| Any **non-`.md`** file under `claude/` (launcher, init, hooks, `skills-for-role.sh`, `dashboard.sh`, `throughput.mjs`, `structure-manifest.tsv`, `orphan-targets`); anything under `claude/scaffold/`; `bin/release.mjs`; anything under `test/`; `package.json`; `.github/`; **any file `test/prove-red.sh` names** | `npm test` (~12 min) | prove-red mutates these, or they are the test machinery itself |
| A release, or **unsure** which row applies | `npm test` | The default command. When unsure, nothing beyond it. Before a release, also the release tool's own test once it leaves `npm test` (see *Test rules*). |

- **A change that spans rows: run the heaviest row it touches (the lowest in the table).**
- **Always report which checks ran and which were skipped, and why — a skipped check is not a passed one.**
- Does prove-red name a file? Run `grep -F '<path below claude/>' test/prove-red.sh`. Today that
  includes `skills/fkit-team/SKILL.md`, `skills/fkit-sprint-ship-loop/SKILL.md`,
  `skills/fkit-wiki-sync/SKILL.md`, `skills/fkit-wiki-lint/SKILL.md`, `skills/fkit-task-done/SKILL.md`,
  `skills/fkit-task-cancelled/SKILL.md`, `skills/fkit-sprint-done/SKILL.md`,
  `skills/fkit-sprint-cancelled/SKILL.md`, `structure-spec.md` and the `claude/scaffold` tree. The grep
  is the rule; this list is only an example and will drift.
- A new test that reads the live `ai-agents/` tree or the top-level docs must also be added to
  `test:docs` in `package.json`.

## Releases

`main` is the release channel: every commit there is live to the next install. Cutting a release:
[`RELEASING.md`](RELEASING.md) (`npm run release`, `release:minor`, `release:major`, `release:dry`).

Landed a change people who use fkit would notice? Add a line for it under `## Unreleased` in
[`CHANGELOG.md`](CHANGELOG.md) in the same change. A release refuses to run while that section is
empty, so this keeps the release notes written as you go.

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
