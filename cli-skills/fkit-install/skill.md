---
name: fkit-install
description: Interactively install fkit into the CURRENT project (one-time). Interviews you for the project name, description, default model, and per-skill model routing; writes ai-agents/ai-agents.yml + a PROJECT.md brief; then builds (compiles skills, generates CLAUDE.md/AGENTS.md/config). Run once per project; use fkit-update afterwards. Makes no commits.
---

# fkit-install

Interactive one-time setup: interview the user, write the project's **manifest**
(`ai-agents/ai-agents.yml`) and **brief** (`ai-agents/knowledge-base/PROJECT.md`), then build.

> Running model: **{{running_model}}** (baked in when this skill was installed — the CLI you
> are running now). Use it as the default-model suggestion in step 2c.
> fkit clone: **`{{fkit_home}}`**.

Everything the interview collects is saved to the **manifest** — the single source of truth
the compiler already reads. Do **not** create a separate settings file.

## Steps

### 0. Confirm the target
Install into the current working directory. If it's ambiguous which repo root the user means,
confirm first. If `ai-agents/ai-agents.yml` **already exists** here, **stop** — fkit is already
set up; point the user at `{{invoke}}fkit-update`. Do not re-install.

### 1. Scaffold the starter manifest
```bash
node {{fkit_home}}/bin/bootstrap.mjs --out .
```
This drops a starter `ai-agents/ai-agents.yml` (a copy of the sample) and stops. You will edit
it in place during the interview.

### 2. Interview the user
Ask these in order. Prefer the interactive selection UI when the CLI offers one; otherwise ask
conversationally. Keep it brisk — offer the suggested default for each so a user can just accept.

- **a. Project name.** → derive a `slug` (lowercase-kebab-case).
- **b. Description.** Either (i) have them describe it in a sentence or two, **or** (ii) let them
  point to an existing file (README, spec, design doc) — read it and summarise. Capture a
  one-line `overview` **and** enough for the PROJECT.md brief (step 4).
- **c. Default model.** Suggest **{{running_model}}** (the CLI running this). Confirm or switch.
  This becomes `routing.default`.
- **d. Per-skill model.** List the fkit skills and let the user reassign any of them.
  - Enumerate skills by reading the directories under
    `{{fkit_home}}/generic/skills/{shared,claude-only,codex-only}/`.
  - A skill's **default side** = the tier it lives in: `shared` → **Both**, `claude-only` →
    **Claude**, `codex-only` → **Codex**.
  - Present each skill with its default; let the user set any to **Claude**, **Codex**, or **Both**.
    (Common case: move the `wiki-*` skills to Codex.)
- **(owner)** Also capture an `owner` for task attribution — default to `git config user.name`
  (confirm), since the generated skills refer to the owner by name.

### 3. Write the manifest (edit `ai-agents/ai-agents.yml` in place)
Edit the starter to reflect the interview. Match the file's existing YAML style — the fkit
parser is a **subset**: inline flow maps `{ a: b }` and inline flow lists `[a, b]`, nested maps
by indent, full-line `#` comments. **No block lists, no block scalars, no trailing inline comments.**
- `project.name`, `project.slug`, `project.owner`, `project.overview` (the one-liner).
- `routing.default` = the chosen default model. Leave the other routing rows or adjust them to
  match the per-skill choices (e.g. if `wiki-*` went to Codex, keep `wiki: codex`).
- `skills.shared` / `skills.claude_only` / `skills.codex_only` = the per-skill assignments
  (**Both** → `shared`, **Claude** → `claude_only`, **Codex** → `codex_only`). Every fkit skill
  must appear in exactly one list.
- Leave `models.*.id` at the starter's defaults unless the user asks to change them.

### 4. Build
```bash
node {{fkit_home}}/bin/bootstrap.mjs --out . --manifest ai-agents/ai-agents.yml --force
```
Regenerates the `ai-agents/` skeleton, compiles the skills per the manifest into `.claude/` +
`.codex/`, scaffolds roles, and generates `CLAUDE.md` / `AGENTS.md` / `.codex/config.toml`.

### 5. Enrich the project brief (after the build, so nothing clobbers it)
The build already generated **`ai-agents/knowledge-base/PROJECT.md`** with the name + overview
filled. Enrich it from the interview (or the file pointed to in 2b): flesh out the
**Domain & context**, **Architecture**, and **Conventions** sections. Leave any section you have
no answer for as its `<!-- prompt -->` for the user to fill later.

### 6. Report & stop
Summarize: project identity, default model, any per-skill overrides, and the files created
(`ai-agents/ai-agents.yml`, `ai-agents/knowledge-base/PROJECT.md`, compiled skills, CLAUDE.md /
AGENTS.md / config). fkit **makes no commits** — everything is working-tree only for the user to
review and commit.
