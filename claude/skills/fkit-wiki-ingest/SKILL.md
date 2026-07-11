---
name: fkit-wiki-ingest
description: Ingest one or more sources into the project wiki at ai-agents/wiki-vault/, via the fkit-wiki agent (the exclusive wiki-write gateway). Accepts a file path, a directory path, or a keyword — 'all tasks', 'knowledge-base', or 'architecture'.
---

# Wiki Ingest (dispatch to the fkit-wiki agent)

Add or update wiki pages from a named source. All wiki **writes** go through the **fkit-wiki**
agent — never write `ai-agents/wiki-vault/` from this session.

**Argument:** `$ARGUMENTS` — a file path, glob, directory, or keyword (`all tasks` /
`knowledge-base` / `architecture`).

## Steps

1. Invoke the **fkit-wiki** agent (via the Agent tool): *"Run your ingest procedure on:
   `$ARGUMENTS`"*. If `$ARGUMENTS` is empty, ask the owner what to ingest first — don't guess.
2. Relay its summary to the owner: sources processed, pages created/updated, anything flagged.

## Rules

- Never touch `ai-agents/wiki-vault/` yourself — reads use `/fkit-query`; writes are the fkit-wiki
  agent's exclusively.
- Do not commit anything.
