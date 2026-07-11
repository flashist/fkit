---
name: fkit-wiki-sync
description: Sync the project wiki at ai-agents/wiki-vault/ against changed ai-agents/ sources since the last sync (delta ingest via the .wiki-watermark commit SHA), via the fkit-wiki agent (the exclusive wiki-write gateway). Optional argument — a date (YYYY-MM-DD) overriding the since-point, or 'force' to re-ingest everything.
---

# Wiki Sync (dispatch to the fkit-wiki agent)

Detect what changed under `ai-agents/` since the last sync and ingest only the delta. All wiki
**writes** go through the **fkit-wiki** agent.

**Argument:** `$ARGUMENTS` — optional: a date `YYYY-MM-DD` (overrides the auto-detected
since-point) or `force` (re-ingest all non-wiki `ai-agents/` sources).

## Steps

1. Invoke the **fkit-wiki** agent (via the Agent tool): *"Run your sync procedure"* — passing
   `$ARGUMENTS` if given.
2. Relay its summary to the owner: the sync window, files changed, pages created/updated, and
   anything flagged (⚠️).

## Rules

- Never touch `ai-agents/wiki-vault/` yourself (including `.wiki-watermark`).
- Do not commit anything.
