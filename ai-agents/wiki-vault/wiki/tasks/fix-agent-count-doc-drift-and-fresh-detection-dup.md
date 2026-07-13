# Fix stale agent-count docs and duplicated fresh-project detection

**Source**: `ai-agents/tasks/cancelled/fix-agent-count-doc-drift-and-fresh-detection-dup.md`
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

⚠️ **The count bug is immortal, though.** The *same class* of drift survived the removal and is recorded in `architecture.md` §9.6: **`claude/fkit-claude-init.sh` prints "Six roles" and omits `lead`, immediately after copying seven agent files.** *The count is a literal, not derived* — which is precisely why it keeps going stale.

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/rewrite-docs-post-omnigent]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/install-and-self-update]]
