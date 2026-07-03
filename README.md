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
manifest/ai-agents.schema.yml documented manifest schema
examples/                     a sample project manifest
bin/lib.mjs                   shared YAML / substitution / routing utilities
bin/compile-skills.mjs        single-source → per-CLI skills
bin/scaffold-role.mjs         skeleton + preset → a project role
bin/bootstrap.mjs             stand up a new project
bin/sync.mjs                  re-pull kit updates into an existing project
```

## License

[MIT](LICENSE) © 2026 Mark Dolbyrev
