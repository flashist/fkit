---
name: fkit-config
description: "Browse and change the project's fkit model-routing config — the project-wide default model (Claude or Codex) and any per-skill overrides — then re-sync the compiled skills so the change takes effect. Use to review or edit which model owns a given fkit skill, or to change the project default model. Makes no commits."
user-invocable: true
---
<!-- fkit:generated source=fkit-config version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

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
known skill with its resolved model, and whether that value came from an explicit **override** or is
**inherited from the default**, plus that skill's own one-line description. Parse its JSON. Never
hand-summarize or re-derive this data from memory — always relay or paraphrase directly from what it
actually returned. There is no task-type routing table anymore — don't look for one in this output,
and don't read `ai-agents.yml`'s (possibly still-present, now-inert) `routing:` block to reconstruct
one; this skill only edits `config.json`'s `defaultModel` + per-skill overrides.

## 2. Present it as a settings list — as plain text, in the chat

Render the FULL list **as your own text response** (a table or a clearly-labeled list) — never through
`AskUserQuestion` or any other tool. Neither that tool nor a plain chat has a real list-browser widget
(a search box, live filtering, a scrollable view) like Claude Code's native `/skills` picker — don't
attempt to fake one; this text response IS the equivalent here. Distinguish three kinds of row:

- **Display-only** — the config `version`. Mention it in passing; it is not a choice.
- **Group header** — a "Skills" heading in your text, introducing every skill below it (ALL of them —
  never truncate or bucket some as "and others").
- **Interactive rows** — `defaultModel`, and each individual skill, each showing its current value (and
  for skills, whether that value is an override or inherited from the default).

## 3. Ask which setting to change

**Never enumerate skills as individual `AskUserQuestion` options.** That tool hard-caps at **4 options
per question** (and 4 questions per call) — with more than a couple of skills this silently degrades
into an incoherent "pick a bucket, or type something" experience instead of a real choice. The table
you already rendered in step 2 is the full list; use it, don't re-list it as options.

Ask ONE small, bounded question instead — exactly 3 options, comfortably inside the limit:
- **"Default model"**
- **"A specific skill"**
- **"Nothing — I'm done"**

Use `AskUserQuestion` for this on Claude (a plain numbered 1/2/3 list conversationally on Codex). If the
user picks "A specific skill", ask **conversationally** (plain chat, not a tool call) which one — they
can just name it from the table you already showed. This scales to any number of skills with no cap and
no lossy bucketing.

## 4. Ask for the new value

Now that exactly one field is chosen (`defaultModel`, or one named skill), its possible values are
small and bounded — this is where `AskUserQuestion` fits cleanly. Read them from
`ai-agents/config-schema.json`'s `values` map (`defaultModel`'s own `values`, or the `skills` group's
`memberSchema.values`): `claude`, `codex` — the only two real values — each with the schema's own
`description` text as the option's description — never invent your own wording for it. When changing one
specific skill (not the project default), also offer **`default`** as a third choice, meaning "clear
this skill's override and let it inherit the project default."

Use `AskUserQuestion` on Claude, or a numbered list on Codex — same as step 3.

## 5. Apply the change

```bash
# project-wide default
npx --yes github:flashist/fkit config set --project . --default-model <claude|codex>

# one skill's override (or `default` to clear it)
npx --yes github:flashist/fkit config set --project . --skill <name> --model <claude|codex|default>
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

- `/fkit-config`

fkit **makes no commits** — everything is working-tree only.
