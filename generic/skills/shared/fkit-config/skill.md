---
name: fkit-config
description: "Browse and change the project's fkit model-routing config — which model (Claude, Codex, or both) owns each fkit skill, and the project-wide default model — then re-sync the compiled skills so the change takes effect. Use when reviewing or editing fkit's model routing, checking which model a skill is assigned to, or changing the project default model. Makes no commits."
---

# fkit Config

Interactive browser/editor for the project's model-routing config: `ai-agents/config.json` (the values)
described by `ai-agents/config-schema.json` (what each field means and its allowed values). This skill
runs natively on both Claude Code and Codex — editing config and re-syncing is safe and fast on either
model, so it never delegates.

## 1. Load current state

```bash
npx --yes github:flashist/fkit config show --project . --json
```

This single command is **authoritative** — it returns the full current picture: `defaultModel`, every
known skill with its resolved model, whether that value came from an explicit **override** or is
**inherited from the default**, and that skill's own one-line description; plus the project's
task-type routing table (from `ai-agents.yml`'s `routing:` block — a separate, untouched system,
included only so the status picture is complete). Parse its JSON. Never hand-summarize or re-derive
this data from memory — always relay or paraphrase directly from what it actually returned.

## 2. Present it as a settings list

Lay out what `config show` returned the way a settings screen would, distinguishing three kinds of row:

- **Display-only** — the config `version`. Mention it in passing; it is not a choice.
- **Group header** — "Skills" as a category label. Not itself selectable; it just introduces the rows
  listed under it.
- **Interactive rows** — `defaultModel` itself, and each individual skill, each showing its current
  value (and for skills, whether that value is an override or inherited from the default).

This should read like browsing a settings list where some rows are just labels and others are
selectable — the same distinction Claude Code's own skill/plugin listings draw between group headers
and actual selectable entries.

Also surface the task-type routing table from `config show`'s output, noting plainly that it is a
separate system (`ai-agents.yml`'s `routing:` block) this skill does not edit.

## 3. Ask which setting to change

Read `ai-agents/config-schema.json` directly and use its own `description` field for whichever setting
you're asking about — never invent your own wording for it.

- **If you have an interactive choice tool available** (e.g. Claude Code's `AskUserQuestion`), use it:
  one option per changeable setting (`Default model`, plus one per skill), each option's label showing
  its current value, and its description field carrying the schema's `description` text for that field.
- **If you don't** (e.g. running as Codex), present the same choices as a numbered list conversationally
  — the default model plus every skill, each annotated with its current value — and read back the
  user's typed choice.

## 4. Ask for the new value

Options are exactly the schema's enum values for that field — read them from
`ai-agents/config-schema.json`'s `values` map (`defaultModel`'s own `values`, or the `skills` group's
`memberSchema.values` for a specific skill): `claude`, `codex`, `both`. When changing one specific skill
(not the project default), also offer **`default`** as an extra choice, meaning "clear this skill's
override and let it inherit the project default."

Ask this the same way as step 3 — `AskUserQuestion` if you have it, otherwise a numbered list.

## 5. Apply the change

```bash
# project-wide default
npx --yes github:flashist/fkit config set --project . --default-model <claude|codex|both>

# one skill's override (or `default` to clear it)
npx --yes github:flashist/fkit config set --project . --skill <name> --model <claude|codex|both|default>
```

## 6. Sync — required

`config set` alone does not recompile anything; the change has no visible effect until sync runs:

```bash
npx --yes github:flashist/fkit sync --project .
```

Relay its console output verbatim — quote what it actually printed, don't paraphrase what changed.

## 7. Loop or stop

Ask if the user wants to change anything else. If yes, go back to step 3 (re-run `config show` first if
the state may have changed since it was last loaded). If no, stop.

## Usage

- `{{invoke}}fkit-config`

fkit **makes no commits** — everything is working-tree only.
