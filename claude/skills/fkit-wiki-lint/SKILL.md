---
name: fkit-wiki-lint
description: Health-check the project wiki at ai-agents/wiki-vault/ and fix safe issues, via the fkit-wiki agent (the exclusive wiki-write gateway). Use when asked to lint, validate, or health-check the wiki.
---

# Wiki Lint (dispatch to the fkit-wiki agent)

Health-check the whole wiki — broken links, stale claims, missing back-links, template drift. All
wiki **writes** (including lint fixes) go through the **fkit-wiki** agent.

## Steps

1. Invoke the **fkit-wiki** agent (via the Agent tool): *"Run your lint procedure."*
2. Relay its summary to the owner: issues found / fixed / flagged for human review, and the
   most significant items.

## Rules

- Never touch `ai-agents/wiki-vault/` yourself.
- Do not commit anything.
