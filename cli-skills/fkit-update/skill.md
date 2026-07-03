---
name: fkit-update
description: Pull the latest fkit and re-sync THIS project's compiled skills + routing block. Safe to run anytime — recompiles the generated skills and never touches your origin:project files (scaffolded roles, project-authored skills). Makes no commits.
---

# fkit-update

Pull the latest fkit and re-sync **this project's** compiled skills and routing. Safe to run
anytime: it recompiles the generated skills and regenerates the routing block, and **never
touches your `origin:project` files** (scaffolded roles, project-authored skills).

> The fkit clone this skill drives lives at **`{{fkit_home}}`**.

## Steps

1. **Confirm this is an fkit project.** If there is no `ai-agents/ai-agents.yml` in the current
   project, **stop** — it is not set up yet; the user wants `{{invoke}}fkit-install` first.

2. **Pull the latest fkit (with a heads-up).** Show the clone's state first:

   ```bash
   git -C {{fkit_home}} log -1 --oneline && git -C {{fkit_home}} status --short
   ```

   - If it is **clean**, update it: `git -C {{fkit_home}} pull --ff-only`.
   - If it has **local changes**, do **not** pull. Tell the user, and continue the sync
     against their current clone (or let them stash/commit first). Never discard their work.

3. **Sync this project.** Run:

   ```bash
   node {{fkit_home}}/bin/sync.mjs --project .
   ```

4. **Report & stop.** Summarize which skills recompiled, whether the routing block / `.codex`
   model changed, and the fkit commit now in use. fkit **makes no commits** — the updated
   files are working-tree only.
