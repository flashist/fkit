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
Everything the interview collects is saved to the **manifest** (project identity, task-type routing)
or — for default-model / per-skill-model routing — to **`ai-agents/config.json`** (A5). Together
those two are the source of truth the compiler reads. Do not create a separate settings file.

### A1. Scaffold the starter manifest
```bash
npx --yes github:flashist/fkit bootstrap --out .
```
This drops a starter `ai-agents/ai-agents.yml` (a copy of the sample) and stops. It also seeds a
starter `ai-agents/config.json` (default model only, nothing pinned yet) and the reference
`ai-agents/config-schema.json` (documents every field/enum value; kit-owned, always regenerated,
never hand-edited) — so `config show` (A2d) already has real, if default-only, data to display. You
will edit the yml in place during the interview. (First run downloads fkit via npx; it's cached
afterward.)

### A2. Interview the user
Ask these in order. Prefer an interactive selection UI when your CLI offers one; otherwise ask
conversationally. Offer the suggested default for each so the user can just accept.

- **a. Project name.** → derive a `slug` (lowercase-kebab-case).
- **b. Description.** Either (i) a sentence or two, **or** (ii) point to an existing file (README,
  spec) — read it and summarise. Capture a one-line `overview` **and** enough for the brief (A6).
- **c. Default model.** Suggest the model **you are running as**. Confirm or switch. This choice
  becomes the project-wide `defaultModel`, applied via `config set` in A5 — it is not written into
  the yml.
- **d. Per-skill model.** Run:
  ```bash
  npx --yes github:flashist/fkit config show --project .
  ```
  and relay its output as-is (don't re-derive or hand-summarize it) to show the user every skill's
  current assignment — at this point everything will show as **inheriting** the just-picked default
  model, since nothing's been overridden yet. Ask the user which skills (if any) should be pinned to
  a specific model instead of following the default. Explain what the choice means: left **unlisted**,
  a skill just follows whatever the project's default model is; pinned to **Claude** or **Codex**,
  that model owns it and the *other* model gets a delegating stub that **routes the task to the
  owner** (the skill is still invocable everywhere — nothing is hidden, it just delegates on the
  non-owner side). (Common case: assign the `wiki-*` write skills to **Codex**.)
- **(owner)** Capture an `owner` for task attribution — default to `git config user.name` (confirm).

### A3. Write the manifest (edit `ai-agents/ai-agents.yml` in place)
Edit the starter to reflect the interview. Match the file's YAML style — fkit's parser is a
**subset**: inline flow maps `{ a: b }` / inline flow lists `[a, b]`, nested maps by indent, full-line
`#` comments. **No block lists, no block scalars, no trailing inline comments.**
- `project.name` / `slug` / `owner` / `overview` (the one-liner).
- `routing:` block's task-type rows (`wiki`, `planning`, `review`, `routine-fix`, `complex-feature`,
  …) — this table maps *task types* to an owner and is unrelated to the default-model / per-skill
  config described below; it's still hand-edited here, exactly as before. Adjust rows per the
  project's needs.
- Leave `models.*.id` at the starter's defaults unless the user asks to change them.

The default-model and per-skill-model choices from A2c/A2d are **not** written here anymore —
`routing.default` and `skills:` are no longer edited by this skill. Those are applied through
`config set` in A5, once `ai-agents/config.json` exists.

### A4. Build
```bash
npx --yes github:flashist/fkit bootstrap --out . --manifest ai-agents/ai-agents.yml --force
```
Regenerates the `ai-agents/` skeleton (including `ai-agents/config.json` +
`ai-agents/config-schema.json`), compiles the skills per the manifest into `.claude/` + `.codex/`,
scaffolds roles, and generates `CLAUDE.md` / `AGENTS.md` / `.codex/config.toml`.

### A5. Apply the interview's model routing (`config set`, then `sync`)
`ai-agents/config.json` exists now, seeded with defaults, after A4's build. Apply the default model
from A2c — only if it differs from what's currently seeded:
```bash
npx --yes github:flashist/fkit config set --project . --default-model <claude|codex>
```
Then pin each skill the user chose to override in A2d, once per skill:
```bash
npx --yes github:flashist/fkit config set --project . --skill <name> --model <claude|codex|default>
```
`config set` only updates `ai-agents/config.json` — it doesn't recompile anything. Re-sync so the
compiled skills (`.claude/` + `.codex/`) actually pick up the change:
```bash
npx --yes github:flashist/fkit sync --project .
```

### A6. Enrich the project brief (after the build, so nothing clobbers it)
The build generated **`ai-agents/knowledge-base/PROJECT.md`** with the name + overview filled. Enrich
it from the interview (or the file from A2b): flesh out **Domain & context**, **Architecture**, and
**Conventions**. Leave any section you have no answer for as its `<!-- prompt -->`.

### A7. Report & stop
Run `npx --yes github:flashist/fkit config show --project .` one more time and relay its **exact
output** for the default-model / per-skill-assignment / task-type-routing part of the summary — never
restate those from memory or by re-deriving them from the yml. Alongside that, summarize: project
identity and the files created (`ai-agents/ai-agents.yml`, `ai-agents/config.json`,
`ai-agents/config-schema.json`, `ai-agents/knowledge-base/PROJECT.md`, compiled skills, CLAUDE.md /
AGENTS.md / config). **State the fkit version** installed — the `stamped ai-agents/.fkit-version = …`
line the build printed. Mention that **re-running this skill later updates instead of installs**, and
that the new **`fkit-config`** skill can be used any time afterward for ad-hoc routing changes
(default model or per-skill pins) without re-running this whole install flow. fkit **makes no
commits** — everything is working-tree only.

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
Run `npx --yes github:flashist/fkit config show --project .` and relay its **exact output** for the
routing / skill-assignment part of the summary — never hand-summarize or re-derive it from the yml.
Alongside that, summarize which skills recompiled and whether the `.codex` model changed, and **state
the fkit version** the project is now on — the `stamped ai-agents/.fkit-version = …` line the build
printed. Mention the **`fkit-config`** skill for later ad-hoc routing changes without re-running this
flow. fkit **makes no commits** — the updated files are working-tree only.
