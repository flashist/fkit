# fkit

A transferable, two-model (Claude + Codex) "operating system" for a software project:
the `ai-agents/` working structure (sprints, tasks, reviews, knowledge-base, wiki) plus
the skills, configs, and role-agents around it — with a clean split between the **generic
machinery** (this kit) and **per-project content** (a project's manifest + docs), and
**project-level, editable model routing** (e.g. "wiki tasks → Codex").

> Status: **v0.1.0 — functionally complete.** Bootstrap + sync verified end-to-end.

## Install

fkit ships a single entry skill — **`fkit`** — that sets up the current project on first run and
re-syncs it to the latest kit on later runs (it auto-detects which). Install it into your agent(s)
via any channel below; all are equivalent.

**Any agent (recommended)** — via the universal [`skills`](https://github.com/vercel-labs/skills) tool:

```bash
npx skills add flashist/fkit -g -y     # -g global, -y skips all prompts (installs to your detected agents)
```

**Claude Code plugin:**

```
/plugin marketplace add flashist/fkit
/plugin install fkit@fkit
```

**Clone (no npx):**

```bash
git clone https://github.com/flashist/fkit && cd fkit
node bin/install-cli-skills.mjs     # → ~/.claude/skills + ~/.codex/skills (copies skills/ verbatim)
```

Then, in any project, just run **`fkit`** — it installs on the first run and updates on every run
after. The skill calls the kit's machinery on demand via `npx github:flashist/fkit …`, so no clone is
needed — all three channels install the same self-contained skill.

## Direct script use

The skills are thin wrappers — you can drive the kit directly, cloned or via npx with no clone:

```bash
# stand up a project (two passes: starter manifest → edit → build)
npx github:flashist/fkit bootstrap --out /path/to/project
npx github:flashist/fkit bootstrap --out /path/to/project --manifest /path/to/project/ai-agents/ai-agents.yml

# re-sync an existing project to the latest kit
npx github:flashist/fkit sync --project /path/to/project
```

`bootstrap` produces the `ai-agents/` skeleton, compiled `.claude` + `.codex` skills, scaffolded roles,
and generated `CLAUDE.md` / `AGENTS.md` / `.codex/config.toml`. `sync` recompiles the generated skills
and routing block and **never touches `origin:project` files** (scaffolded roles, project-authored
skills). Both make no commits. (Swap `npx github:flashist/fkit` for `node bin/…` if you're in a clone.)

## Releasing

Cutting a new version is one command — it stages everything, commits, pushes the branch,
and creates + pushes an annotated `v<VERSION>` tag:

```bash
npm run release:dry                 # preview the plan — touches nothing
npm run release                     # commit + push + tag the current VERSION
npm run release -- --version 0.2.0  # bump VERSION + package.json first, then release
```

`VERSION` is the single source of truth for the version number; the tag is always `v<VERSION>`.
The command is idempotent (an existing tag or already-committed tree is skipped) and makes **no
npm-registry publish** — fkit is consumed via `npx github:flashist/fkit`, so a pushed tag *is* the
release. Verify with `npx github:flashist/fkit#v0.2.0 --version`.

## How it works

- **Skills are single-sourced** under `generic/skills/{shared,claude-only,codex-only}/<name>/`.
  The compiler emits per-CLI variants, each with an `fkit:generated` marker.
  Three kinds of per-model variation, all from one source: manifest placeholders,
  per-model vars (`meta.<model>.vars`, e.g. `{{invoke}}` = `/` vs `$`), and per-model
  description overrides.
- **The project manifest** (`ai-agents/ai-agents.yml`; schema in `manifest/`) declares
  identity, the agent roster, and the routing table — filling placeholders and generating
  the derived config. Change routing by editing one file + running `sync`.
- **Role-agents** (producer, …) are scaffolded from a skeleton template + a reusable
  preset, written `origin: project` so `sync` never overwrites your tuning.

## Layout

```
generic/skills/{shared,claude-only,codex-only}/<name>/{skill.md, meta.yml}
generic/ai-agents/            the ai-agents/ skeleton (copied into each project)
generic/templates/            role-agent + CLAUDE.md/AGENTS.md templates
generic/roles/                role presets (producer.preset.md)
skills/                       fkit — the single entry skill (install + update), installed by every channel
.claude-plugin/               plugin.json + marketplace.json (Claude plugin channel)
manifest/ai-agents.schema.yml documented manifest schema
examples/                     a sample project manifest
bin/lib.mjs                   shared YAML / substitution / routing utilities
bin/compile-skills.mjs        single-source → per-CLI skills
bin/scaffold-role.mjs         skeleton + preset → a project role
bin/bootstrap.mjs             stand up a new project
bin/sync.mjs                  re-pull kit updates into an existing project
bin/fkit.mjs                  CLI dispatcher — `npx github:flashist/fkit <cmd>` (no clone)
bin/install-cli-skills.mjs    copy skills/ into your global agent dirs (clone channel)
bin/release.mjs               cut a release — commit + push + tag (npm run release)
package.json                  makes `npx github:flashist/fkit` / `npx skills add` work
```

## License

[MIT](LICENSE) © 2026 Mark Dolbyrev
