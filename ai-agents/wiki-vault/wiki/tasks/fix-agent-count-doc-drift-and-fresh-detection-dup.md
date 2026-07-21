# Fix stale agent-count docs and duplicated fresh-project detection

**Source**: `ai-agents/tasks/cancelled/0040-fix-agent-count-doc-drift-and-fresh-detection-dup/brief.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 1 — cancelled 2026-07-11

## Goal
Two small adjacent drifts in the install-path files, bundled into one low-priority ticket.

## Key Changes
Flagged by fkit-architect during a follow-up architecture inspection (2026-07-10); both cosmetic and harmless at the time, bundled into one ticket **per the architect's own suggestion**, since both were small and touched the same family of files.

- **(a) Stale agent-bundle counts.** `omnigent/fkit-init.sh` said "six agent bundles" / "6 agents" over a list of five.
- **(b) Duplicated fresh-project detection** logic in the install path.

## Outcome
**⛔ Cancelled (2026-07-11) — Omnigent removed.** **The drifted files are deleted, not fixed** — and [[tasks/rewrite-docs-post-omnigent]] rewrote the docs against the post-removal reality instead.

**This is the sprint's explicit policy, applied:** *"Do not fix Omnigent-side doc drift — its output would be a deletion."*

⚠️ **The drift *class* outlived the ticket.** `architecture.md` §9.6 later recorded the same bug reborn on the Claude side — `claude/fkit-claude-init.sh` printing a **hard-coded role count** next to a line that separately *counts* the agent files it just copied.

**Verified 2026-07-13: that instance is now fixed in code** (`:144` reads `Seven roles`), though `architecture.md` §9.6 still lists it as open. **But the shape that caused it is unchanged — the count is a literal, not derived** — so it can drift again the next time a role is added. *That is the actual lesson: the bug was fixed twice and its cause never was.*

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/rewrite-docs-post-omnigent]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/install-and-self-update]]
