# fkit

A transferable, two-model (Claude + Codex) "operating system" for a software project:
the `ai-agents/` working structure (sprints, tasks, reviews, knowledge-base, wiki) plus
the skills, configs, and role-agents around it — with a clean split between the **generic
machinery** (this kit) and **per-project content** (a project's manifest + docs), and
**project-level, editable model routing** (e.g. "wiki tasks → Codex").

> Status: **v0.1.0 — functionally complete.** Bootstrap + sync verified end-to-end.

## Quick start — stand up a new project

```bash
node bin/bootstrap.mjs --out /path/to/new-project
#   → writes a starter ai-agents/ai-agents.yml; edit it for your project, then:
node bin/bootstrap.mjs --out /path/to/new-project --manifest /path/to/new-project/ai-agents/ai-agents.yml
```

Produces: the `ai-agents/` skeleton, compiled `.claude` + `.codex` skills, scaffolded
roles, and generated `CLAUDE.md` / `AGENTS.md` / `.codex/config.toml`. Makes no commits.

## Update a project after editing the kit or its manifest

```bash
node bin/sync.mjs --project /path/to/project
```

Recompiles generated skills, regenerates the routing block in `CLAUDE.md`/`AGENTS.md`,
and updates the `.codex/config.toml` model. **Never touches `origin:project` files**
(scaffolded roles, project-authored skills).

## Run fkit from any project (`/fkit-install`, `/fkit-update`)

Prefer slash-commands over remembering the `node bin/…` invocations? fkit ships two
**global** skills that wrap the scripts above:

| Skill | Wraps | When |
|---|---|---|
| `/fkit-install` | `bootstrap.mjs` | once, when you start using fkit in a project |
| `/fkit-update`  | `git pull` + `sync.mjs` | anytime you want the latest kit skills |

Install them once into your global skill dirs — this bakes the current clone's path into the
skills so they always know where to find `bin/`:

```bash
node bin/install-cli-skills.mjs            # → ~/.claude/skills + ~/.codex/skills
node bin/install-cli-skills.mjs --dry-run  # preview; --target claude|codex to pick one side
```

Re-run it after moving this clone or editing `cli-skills/`. Because `/fkit-install` must work
in a project *before* fkit is set up there, these two are **global** — unlike the per-project
workflow skills, which are compiled into each project by `sync`.

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
cli-skills/                   fkit-install / fkit-update — global CLI skills (source)
manifest/ai-agents.schema.yml documented manifest schema
examples/                     a sample project manifest
bin/lib.mjs                   shared YAML / substitution / routing utilities
bin/compile-skills.mjs        single-source → per-CLI skills
bin/scaffold-role.mjs         skeleton + preset → a project role
bin/bootstrap.mjs             stand up a new project
bin/sync.mjs                  re-pull kit updates into an existing project
bin/install-cli-skills.mjs    install the /fkit-install + /fkit-update skills globally
```

## License

[MIT](LICENSE) © 2026 Mark Dolbyrev
