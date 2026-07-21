# Remove eager auto-spawn of fkit-adversarial-reviewer at session start

**Source**: `ai-agents/tasks/cancelled/0071-remove-adversarial-reviewer-eager-spawn/brief.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 1 — cancelled 2026-07-11

## Goal
Stop `fkit-adversarial-reviewer` appearing as a standalone session in the Omnigent UI's subagents panel the moment a `fkit team` session started — **before any review had run.**

## Key Changes
The owner flagged it as noise. The reasoning matters and outlived the ticket:

> **`fkit-adversarial-reviewer` was never meant to be usable as a standalone teammate** — only as a **sidekick that `fkit-reviewer` spawns on demand mid-review.**

Eager-spawning it at bootstrap advertised it as a peer role it was never designed to be.

## Outcome
**⛔ Cancelled (2026-07-11) — Omnigent removed.** `fkit-team` — the root agent that carried the eager bootstrap roster — **was deleted with Omnigent** ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]). *There is no root agent to eager-spawn anything.*

**The intent is now structural rather than fixed.** On Claude Code there is **no orchestrator and no standing roster**: the adversarial reviewer exists only when the reviewer spawns it, and it is a **write-free leaf** by tool allowlist. **The role it was never meant to have is now one it cannot have.**

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[systems/review-and-model-diversity]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/fkit]]
