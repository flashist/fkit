# Update the launcher menu/help text — "does no work itself" → accurate to a conductor

**Source**: `ai-agents/tasks/done/0113-update-launcher-menu-help-for-conductor/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0113 · priority 95 · owner `fkit-coder`

## Goal

Make the launcher's user-facing description of lead accurate to a conductor — **text only**.

## Key Changes

The launcher described `fkit-lead` as the team room that *"does no work itself"* — correct for the old router, wrong after [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]].

**No control-flow change was needed, and the brief forbade one.** The menu already exec'd `claude --agent fkit-lead --settings <lead.json>`, and `build_settings()` already wired the ADR-018 hook for lead. Only the menu and help strings changed — no exec line, no `build_settings()` edit — and the new wording had to describe the conductor **while keeping the routing capability lead still has**.

## Outcome

**Done, agent-closed.** The launcher no longer tells the owner that lead does no work.

This is the *first* of two launcher-text passes. It fixed the **description**; the **position and label** were changed later, when the owner saw the menu on screen and ruled lead should be **option 1** and "team room" retired project-wide — [[tasks/reorder-launcher-menu-lead-first-and-rename-label]].

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]]
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — hard dependency (the text must describe the new nature)
- [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] — the later menu reorder + label retirement
- [[tasks/retire-team-room-in-docs-and-agent-definitions]] — the prose sweep outside the launcher
- [[systems/install-and-self-update]] · [[systems/fkit]]
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — Design fkit-lead as the orchestrating front door, and the `fkit-sprint-ship-loop` skill
