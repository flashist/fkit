# fkit

A transferable, two-model (Claude + Codex) "operating system" for a software project:
the `ai-agents/` working structure (sprints, tasks, reviews, knowledge-base, wiki) plus
the skills, configs, and role-agents around it — with a clean split between the **generic
machinery** (this kit) and **per-project content** (a project's manifest + docs), and
**project-level, editable per-skill model routing** (e.g. "wiki skills → Codex").

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

# inspect or change the per-skill/default model config of a bootstrapped project
npx github:flashist/fkit config show --project /path/to/project
npx github:flashist/fkit config set --project /path/to/project --default-model codex
npx github:flashist/fkit config set --project /path/to/project --skill fkit-config --model claude
```

`bootstrap` produces the `ai-agents/` skeleton, compiled `.claude` + `.codex` skills, scaffolded roles,
and generated `CLAUDE.md` / `AGENTS.md` / `.codex/config.toml`. `sync` recompiles the generated skills
and **never touches `origin:project` files** (scaffolded roles, project-authored skills). `config show`
prints the full resolved state (read-only); `config set` only edits
`ai-agents/config.json` — it does not recompile anything, so run `sync` afterward for the change to
take effect. None of these make commits. (Swap `npx github:flashist/fkit` for `node bin/…` if you're
in a clone.)

## Releasing

Cutting a new version is one command — it **bumps the version**, stages everything, commits, pushes
the branch, and creates + pushes an annotated `v<VERSION>` tag. **Every `npm run release` bumps the
patch** (`0.1.0 → 0.1.1 → 0.1.2 …`):

```bash
npm run release:dry                 # preview the plan (incl. the next version) — touches nothing
npm run release                     # bump patch, then commit + push + tag
npm run release:minor               # bump minor instead (0.1.3 → 0.2.0)
npm run release:major               # bump major instead (0.2.1 → 1.0.0)
npm run release -- --version 1.2.3  # set an explicit version
npm run release -- --no-bump        # re-release the current version as-is (e.g. to finish a failed run)
```

`VERSION` is the single source of truth (package.json is kept in sync); the tag is always
`v<VERSION>`. A default run always cuts a **new** version; `--no-bump` is the idempotent form (an
existing tag or already-committed tree is skipped). Makes **no npm-registry publish** — fkit is
consumed via `npx github:flashist/fkit`, so a pushed tag *is* the release. Verify with
`npx github:flashist/fkit#v<VERSION> --version`.

## How it works

- **Skills are single-sourced** under `generic/skills/<name>/`. Source placement carries no
  meaning — which model owns a skill is decided entirely by `ai-agents/config.json` (see below),
  never by directory. The compiler emits per-CLI variants, each with an `fkit:generated` marker.
  Three kinds of per-model variation, all from one source: manifest placeholders,
  per-model vars (`meta.<model>.vars`, e.g. `{{invoke}}` = `/` vs `$`), and per-model
  description overrides.
- **Every skill is available on every model.** A skill either has no override — in which case
  it simply follows the project's `defaultModel` — or is explicitly pinned to `claude` or
  `codex` in `ai-agents/config.json`, in which case that model owns it and every other model
  gets a stub that **routes the task to the owner** — headlessly via the owner's `exec` command,
  or a tab hand-off if that CLI isn't set up. Nothing is ever hidden from a model — pinning an
  owner just changes *who does the work*. Per-skill assignment lives in `ai-agents/config.json`
  (project-owned, alongside `ai-agents.yml`) — set it directly, via `fkit config set --skill
  <name> --model <claude|codex|default>` (`default` clears the override so the skill goes back
  to following `defaultModel`), or through the `fkit-config` skill. Its sibling
  `ai-agents/config-schema.json` is regenerated fresh on every `sync` and documents exactly what
  each value means, so nothing needs guessing. (The manifest's `skills:` block still exists but
  is now only a one-time migration seed, read once to create `config.json`; a skill previously
  listed under `skills.shared` has no equivalent anymore and is simply dropped during migration,
  falling through to `defaultModel` instead.)
- **The project manifest** (`ai-agents/ai-agents.yml`; schema in `manifest/`) declares
  identity and the agent roster — filling placeholders and generating the derived config.
  Per-skill model routing lives in `ai-agents/config.json` instead (see above).
- **Role-agents** (producer, …) are scaffolded from a skeleton template + a reusable
  preset, written `origin: project` so `sync` never overwrites your tuning.

## Layout

```
generic/skills/<name>/{skill.md, meta.yml}
generic/ai-agents/            the ai-agents/ skeleton (copied into each project)
generic/templates/            role-agent + CLAUDE.md/AGENTS.md templates
generic/roles/                role presets (producer.preset.md)
skills/                       fkit — the single entry skill (install + update), installed by every channel
.claude-plugin/               plugin.json + marketplace.json (Claude plugin channel)
manifest/ai-agents.schema.yml documented manifest schema
examples/                     a sample project manifest
bin/lib.mjs                   shared YAML / substitution / config utilities
bin/compile-skills.mjs        single-source → per-CLI skills
bin/scaffold-role.mjs         skeleton + preset → a project role
bin/bootstrap.mjs             stand up a new project
bin/sync.mjs                  re-pull kit updates into an existing project
bin/config.mjs                show/set a project's ai-agents/config.json (`fkit config show|set`)
bin/fkit.mjs                  CLI dispatcher — `npx github:flashist/fkit <cmd>` (no clone)
bin/install-cli-skills.mjs    copy skills/ into your global agent dirs (clone channel)
bin/release.mjs               cut a release — commit + push + tag (npm run release)
package.json                  makes `npx github:flashist/fkit` / `npx skills add` work
```

## License

[MIT](LICENSE) © 2026 Mark Dolbyrev
