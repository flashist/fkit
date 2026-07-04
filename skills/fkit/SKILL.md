---
name: fkit
description: "Set up or update fkit in the CURRENT project — one skill, auto-detects which. First run (no ai-agents/ai-agents.yml yet) interactively installs — interviews you for project name, description, default model, and per-skill model routing; writes ai-agents/ai-agents.yml + a PROJECT.md brief; then builds (compiles the Claude + Codex skills, generates CLAUDE.md/AGENTS.md/config). Later runs re-sync the compiled skills + routing to the latest fkit, never touching your origin:project files. Makes no commits."
---

# fkit

The single entry point for fkit. It runs fkit's machinery on demand with
**`npx --yes github:flashist/fkit …`** — no local clone required. (If fkit is later published to npm,
swap that prefix for `npx --yes fkit@latest …`.)

> **Default model:** when a step needs one, suggest the model *you* — the agent running this skill —
> are (Claude or Codex).

## 0. Detect mode

**Version check (fast path).** If the user only wants the fkit version — they invoked this skill with
`version` as the argument (e.g. `/fkit version` in Claude, `$fkit version` in Codex) or asked what
fkit version this project is on — run:
```bash
npx --yes github:flashist/fkit version --project .
```
Report the `kit:` line (latest available) and the `project:` line (what this project is installed
with, and whether an update is available), then **stop**. Do not install or update.

Otherwise, look for **`ai-agents/ai-agents.yml`** in the current working directory:

- **Not present → INSTALL** (first-time setup). Do Part A below.
- **Already present → UPDATE** (re-sync to the latest fkit). Skip to Part B.

If it's ambiguous which repo root the user means, confirm before touching anything.

---

## Part A — Install (first run)

Interactive one-time setup: interview the user, write the project's **manifest**
(`ai-agents/ai-agents.yml`) and **brief** (`ai-agents/knowledge-base/PROJECT.md`), then build.
Everything the interview collects is saved to the **manifest** — the single source of truth the
compiler reads. Do not create a separate settings file.

### A1. Scaffold the starter manifest
```bash
npx --yes github:flashist/fkit bootstrap --out .
```
This drops a starter `ai-agents/ai-agents.yml` (a copy of the sample) and stops. You will edit it in
place during the interview. (First run downloads fkit via npx; it's cached afterward.)

### A2. Interview the user
Ask these in order. Prefer an interactive selection UI when your CLI offers one; otherwise ask
conversationally. Offer the suggested default for each so the user can just accept.

- **a. Project name.** → derive a `slug` (lowercase-kebab-case).
- **b. Description.** Either (i) a sentence or two, **or** (ii) point to an existing file (README,
  spec) — read it and summarise. Capture a one-line `overview` **and** enough for the brief (A5).
- **c. Default model.** Suggest the model **you are running as**. Confirm or switch. → `routing.default`.
- **d. Per-skill model.** Read the `skills:` block in the freshly-written `ai-agents/ai-agents.yml`
  and list every skill with its current assignment (`shared` → **Both**, or an `owned:` entry →
  that **owner**). Let the user set each to **Both / Claude / Codex**. Explain what the choice means:
  **Both** = each model runs it natively; **Claude** or **Codex** = that model owns it and every
  *other* model gets a stub that **routes the task to the owner** (the skill is still available
  everywhere — nothing is hidden). Read-only lookups (e.g. `wiki-query`) are best left **Both**.
  (Common case: assign the `wiki-*` write skills to **Codex**.)
- **(owner)** Capture an `owner` for task attribution — default to `git config user.name` (confirm).

### A3. Write the manifest (edit `ai-agents/ai-agents.yml` in place)
Edit the starter to reflect the interview. Match the file's YAML style — fkit's parser is a
**subset**: inline flow maps `{ a: b }` / inline flow lists `[a, b]`, nested maps by indent, full-line
`#` comments. **No block lists, no block scalars, no trailing inline comments.**
- `project.name` / `slug` / `owner` / `overview` (the one-liner).
- `routing.default` = the chosen default model; adjust the other routing rows to match the per-skill
  choices (e.g. if `wiki-*` went to Codex, keep `wiki: codex`).
- `skills.shared` (a list) = the **Both** skills; `skills.owned` (a `skill: model` map) = the skills
  assigned to a single owner. Every skill appears in exactly one of the two (**Both** → add to
  `shared`; **Claude**/**Codex** → add to `owned` as `skill: claude`/`skill: codex`). There is no
  `claude_only`/`codex_only` — an owned skill is still compiled to every model as a routing stub.
- Leave `models.*.id` at the starter's defaults unless the user asks to change them.

### A4. Build
```bash
npx --yes github:flashist/fkit bootstrap --out . --manifest ai-agents/ai-agents.yml --force
```
Regenerates the `ai-agents/` skeleton, compiles the skills per the manifest into `.claude/` +
`.codex/`, scaffolds roles, and generates `CLAUDE.md` / `AGENTS.md` / `.codex/config.toml`.

### A5. Enrich the project brief (after the build, so nothing clobbers it)
The build generated **`ai-agents/knowledge-base/PROJECT.md`** with the name + overview filled. Enrich
it from the interview (or the file from A2b): flesh out **Domain & context**, **Architecture**, and
**Conventions**. Leave any section you have no answer for as its `<!-- prompt -->`.

### A6. Report & stop
Summarize: project identity, default model, per-skill overrides, and the files created
(`ai-agents/ai-agents.yml`, `ai-agents/knowledge-base/PROJECT.md`, compiled skills, CLAUDE.md /
AGENTS.md / config). **State the fkit version** installed — the `stamped ai-agents/.fkit-version = …`
line the build printed. Mention that **re-running this skill later updates instead of installs**. fkit
**makes no commits** — everything is working-tree only.

---

## Part B — Update (project already set up)

Re-sync **this project's** compiled skills and routing to the latest fkit. Safe anytime: it recompiles
the generated skills and regenerates the routing block, and **never touches your `origin:project`
files** (scaffolded roles, project-authored skills).

### B1. Sync
```bash
npx --yes github:flashist/fkit sync --project .
```
npx fetches fkit from GitHub, so this pulls the current published skills. (npx may cache a prior
fetch; if you need to force the very latest, clear the npx cache first — `npx clear-npx-cache` — or,
for pinned releases, use a published npm version.)

### B2. Report & stop
Summarize which skills recompiled and whether the routing block / `.codex` model changed, and **state
the fkit version** the project is now on — the `stamped ai-agents/.fkit-version = …` line the build
printed. fkit **makes no commits** — the updated files are working-tree only.
