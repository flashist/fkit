---
name: fkit-install
description: Interactively install fkit into the CURRENT project (one-time). Interviews you for the project name, description, default model, and per-skill model routing; writes ai-agents/ai-agents.yml + a PROJECT.md brief; then builds (compiles the Claude + Codex skills, generates CLAUDE.md/AGENTS.md/config). Run once per project; use fkit-update afterwards. Makes no commits.
---

# fkit-install

Interactive one-time setup: interview the user, write the project's **manifest**
(`ai-agents/ai-agents.yml`) and **brief** (`ai-agents/knowledge-base/PROJECT.md`), then build.

This skill runs fkit's machinery on demand with **`npx --yes github:flashist/fkit …`** — no local
clone required. (If fkit is later published to npm, swap that prefix for `npx --yes fkit@latest …`.)

> **Default model:** suggest the model *you* — the agent running this skill — are (Claude or Codex).
> **Invoking sibling skills:** use your own syntax (e.g. `/fkit-update` in Claude, `$fkit-update` in Codex).

Everything the interview collects is saved to the **manifest** — the single source of truth the
compiler reads. Do not create a separate settings file.

## Steps

### 0. Confirm the target
Install into the current working directory. If it is ambiguous which repo root the user means,
confirm first. If `ai-agents/ai-agents.yml` **already exists** here, **stop** — fkit is already set
up; point the user at the `fkit-update` skill. Do not re-install.

### 1. Scaffold the starter manifest
```bash
npx --yes github:flashist/fkit bootstrap --out .
```
This drops a starter `ai-agents/ai-agents.yml` (a copy of the sample) and stops. You will edit it in
place during the interview. (First run downloads fkit via npx; it's cached afterward.)

### 2. Interview the user
Ask these in order. Prefer an interactive selection UI when your CLI offers one; otherwise ask
conversationally. Offer the suggested default for each so the user can just accept.

- **a. Project name.** → derive a `slug` (lowercase-kebab-case).
- **b. Description.** Either (i) a sentence or two, **or** (ii) point to an existing file (README,
  spec) — read it and summarise. Capture a one-line `overview` **and** enough for the brief (step 5).
- **c. Default model.** Suggest the model **you are running as**. Confirm or switch. → `routing.default`.
- **d. Per-skill model.** Read the `skills:` block in the freshly-written `ai-agents/ai-agents.yml`
  to list every skill and its default side (`shared` → **Both**, `claude_only` → **Claude**,
  `codex_only` → **Codex**). Present them; let the user set any to **Claude / Codex / Both**.
  (Common case: move the `wiki-*` skills to Codex.)
- **(owner)** Capture an `owner` for task attribution — default to `git config user.name` (confirm).

### 3. Write the manifest (edit `ai-agents/ai-agents.yml` in place)
Edit the starter to reflect the interview. Match the file's YAML style — fkit's parser is a
**subset**: inline flow maps `{ a: b }` / inline flow lists `[a, b]`, nested maps by indent, full-line
`#` comments. **No block lists, no block scalars, no trailing inline comments.**
- `project.name` / `slug` / `owner` / `overview` (the one-liner).
- `routing.default` = the chosen default model; adjust the other routing rows to match the per-skill
  choices (e.g. if `wiki-*` went to Codex, keep `wiki: codex`).
- `skills.shared` / `claude_only` / `codex_only` = the per-skill assignments (**Both** → `shared`,
  **Claude** → `claude_only`, **Codex** → `codex_only`). Every skill appears in exactly one list.
- Leave `models.*.id` at the starter's defaults unless the user asks to change them.

### 4. Build
```bash
npx --yes github:flashist/fkit bootstrap --out . --manifest ai-agents/ai-agents.yml --force
```
Regenerates the `ai-agents/` skeleton, compiles the skills per the manifest into `.claude/` +
`.codex/`, scaffolds roles, and generates `CLAUDE.md` / `AGENTS.md` / `.codex/config.toml`.

### 5. Enrich the project brief (after the build, so nothing clobbers it)
The build generated **`ai-agents/knowledge-base/PROJECT.md`** with the name + overview filled. Enrich
it from the interview (or the file from 2b): flesh out **Domain & context**, **Architecture**, and
**Conventions**. Leave any section you have no answer for as its `<!-- prompt -->`.

### 6. Report & stop
Summarize: project identity, default model, per-skill overrides, and the files created
(`ai-agents/ai-agents.yml`, `ai-agents/knowledge-base/PROJECT.md`, compiled skills, CLAUDE.md /
AGENTS.md / config). fkit **makes no commits** — everything is working-tree only.
