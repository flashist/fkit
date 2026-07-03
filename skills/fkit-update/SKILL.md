---
name: fkit-update
description: Re-sync THIS project's compiled skills + routing block to the latest fkit. Safe to run anytime — recompiles the generated skills and never touches your origin:project files (scaffolded roles, project-authored skills). Makes no commits.
---

# fkit-update

Re-sync **this project's** compiled skills and routing to the latest fkit, via
**`npx --yes github:flashist/fkit sync …`** — no local clone required. Safe anytime: it recompiles
the generated skills and regenerates the routing block, and **never touches your `origin:project`
files** (scaffolded roles, project-authored skills). (If fkit is later published to npm, swap the
prefix for `npx --yes fkit@latest …`.)

## Steps

1. **Confirm this is an fkit project.** If there is no `ai-agents/ai-agents.yml` in the current
   project, **stop** — it is not set up yet; the user wants the `fkit-install` skill first.

2. **Sync.**
   ```bash
   npx --yes github:flashist/fkit sync --project .
   ```
   npx fetches fkit from GitHub, so this pulls the current published skills. (npx may cache a prior
   fetch; if you need to force the very latest, clear the npx cache first — `npx clear-npx-cache` —
   or, for pinned releases, use a published npm version.)

3. **Report & stop.** Summarize which skills recompiled, whether the routing block / `.codex` model
   changed. fkit **makes no commits** — the updated files are working-tree only.
