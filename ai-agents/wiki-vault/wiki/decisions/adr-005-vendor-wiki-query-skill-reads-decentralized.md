# ADR-005: Wiki reads are decentralized; writes stay fkit-wiki-exclusive

**Date**: 2026-07-10
**Status**: superseded (on **mechanism only** — **its rule is accepted and IN FORCE**)

> ## ⚠️ Do not read this ADR as retired.
> The **mechanism** it chose — vendoring a copy of the `query` skill into each Omnigent agent bundle —
> died with Omnigent ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]). There is now one
> `/fkit-query` skill and no vendoring.
>
> **The rule it established is current law:** wiki *reads* are **decentralized**; wiki *writes* stay
> **exclusive to `fkit-wiki`**. It is cited as live in `CLAUDE.md`, `AGENTS.md`, and `architecture.md`.

## Context
The proposal reversed a stated, checked-in project rule: root `CLAUDE.md` said *"All wiki reads and writes go through the fkit-wiki agent… no other agent edits the wiki directly."* Every agent spawning a fresh `fkit-wiki` sub-agent session for every lookup was the single biggest source of ad hoc consult children.

**No recorded rationale for the centralization rule existed anywhere** — not in the wiki, not as an ADR, not in `log.md`. It was asserted as policy, never justified. That absence didn't prove the rule pointless, but it meant the decision was overriding *an unexplained convention*, not a documented technical guarantee.

**Live reliability evidence, independent of the rationale question:** the very investigation that produced this decision (a 2-hop producer→architect→fkit-wiki consult) **hit the consult-chain reliability gap itself** — fkit-wiki's leg completed cleanly, but the completion never woke the architect to relay it back, and the stall recurred even after a manual nudge. Reducing reliance on spawning a separate agent for what is fundamentally a **read-only lookup** removed exposure to that gap for the common case.

**Due diligence, done directly:** the `query` skill's six steps are read `index.md` → read relevant pages → follow wiki-links (max 2 hops) → read cited sources → compose a cited answer → note gaps. **Zero mention of `sync`, `.wiki-watermark`, or any freshness check.** The watermark is exclusively `sync`'s mechanism. **Confirmed: `query` has no fkit-wiki-specific state or tooling dependency.**

## Decision
- **Reads are decentralized.** Any role may follow the one **read-only** `/fkit-query` procedure directly, with direct read access to `ai-agents/wiki-vault/`. A lookup happens in-process instead of via a spawn.
- **Writes stay exclusive to `fkit-wiki`.** Ingest, lint, and sync go through the librarian and **nowhere else**. No other agent or session ever writes under `ai-agents/wiki-vault/`. **No exceptions.**
- `fkit-wiki` is still consulted for **writes**, or for a lookup that genuinely needs deeper multi-step research.

## Consequences
- The most common wiki interaction (a read) no longer depends on the least reliable mechanism (a consult spawn).
- The wiki's integrity guarantee — one writer, one gateway — is **untouched**, and is the part that actually mattered.
- **`query` must stay genuinely read-only.** If a query reveals something worth persisting, the role says so and suggests an ingest; it does not silently write.
- The distribution mechanism churned hard before settling — see [[decisions/adr-006-symlink-vendored-query-skill-not-copy]] and [[decisions/adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill]]. On Claude Code the problem evaporated: one skill, zero distribution machinery.

## Related
- [[systems/fkit]]
- [[decisions/adr-006-symlink-vendored-query-skill-not-copy]]
- [[decisions/adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]] — sibling; same 2026-07-10 panel-noise investigation
- [[tasks/give-every-agent-direct-wiki-query-access]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/knowledge-base-hygiene-post-omnigent]]
