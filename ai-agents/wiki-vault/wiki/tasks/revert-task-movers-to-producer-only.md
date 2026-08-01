# Revert the task movers to producer-only — ownership, mirrors, hook test, and mover prose

**Source**: `ai-agents/tasks/done/0124-revert-task-movers-to-producer-only/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0124 · owner `fkit-coder`

## Goal

The structural core of [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] §1: **only `fkit-producer` may run `/fkit-task-done` and `/fkit-task-cancelled`** — and make that fact **hook-structural**, not the prose ADR-025 relied on.

## Key Changes

One atomic unit, because every piece states the same fact: the ownership change in `skills-for-role.sh` (dropping both movers from `lead, coder, architect, reviewer, wiki`), its four human mirrors **in the same commit**, the hook test flipped to allow-for-producer / deny-for-all-others with the JSON deny shape pinned, and the two movers' own SKILL prose reverted from *"any agent may invoke it"* to producer-only — keeping the rule that a **spawned** producer still writes the agent-closed marker.

**Sequenced deliberately after** [[tasks/route-coder-ship-loop-close-to-producer]] and [[tasks/route-sprint-ship-loop-close-to-producer]]: removing the grant while the ship-loops still invoked a mover would hook-deny those loops.

### The scope was amended three times during the build — and that is the finding

Each amendment added a live source asserting the ADR-025 grant that the `skills-for-role.sh:12-24` **mirror checklist does not cover**:

1. **`claude/scaffold/universal-rules.md`** — the managed rules block that lands in **every agent's context on every turn**. Highest blast radius in the repo.
2. **`claude/agents/fkit-producer.md` and `fkit-coder.md`** — **system prompts**, which outrank a SKILL in an agent's own context. Had they been missed, the shipped runtime would have had the hook denying the coder a mover while the coder's own definition instructed it to invoke one.
3. **A hard-rule contradiction nobody owned** (from 0122's review, R4): *"a consult is a focused question, not a hand-off"* in both the coder's and producer's definitions forbids the very producer-spawn-to-close ADR-033 sanctions. Resolved with an explicit **carve-out**, not a deletion.
4. **`claude/agents/fkit-lead.md`** (from 0123): *"closes each task itself…"* — a **fourth** system prompt, and one the verification sweep would have missed entirely.

> ⚠️ **The verification sweep's own limits are recorded as an accepted residual, in unusual detail.** Two independent blind spots each shipped a real defect into the working tree: a **path gap** (the sweep excluded `ai-agents/knowledge-base/`, so `PROJECT.md` kept asserting the grant *and* "nothing structural replaced it" — the regex would have matched; the path never showed it the file) and a **phrasing gap** (`task-status-vocabulary.md` read *"Any agent, via /fkit-task-done"* — a **verbless noun phrase** no modal+verb regex can match, in **both** the live and scaffold copies).
>
> **The grep is a smoke test, never an inventory.** No single regex enumerates every way a permission fact can be phrased, and each amendment has only ever closed the *last* blind spot. **A green sweep is weak evidence**; the by-hand sweep and an independent reviewer pass are the real ones. **The mirror checklist is not a complete inventory** of where a skill-ownership fact is stated — treat that as the finding, not just this instance.

## Outcome

**Done, agent-closed.** Verified this sync (2026-07-26): `claude/skills-for-role.sh` grants both movers to `producer` and to no other role; the file's own comment now reads *"belong to `producer` and to NO other role."* `PROJECT.md` and `architecture.md` both describe producer-only movers with the honest note that this restores separation of **identity**, not prevention.

⚠️ **A correction the brief itself carries:** its step 4 originally required *"the ADR-027 dual-home parity test passes."* **That test does not exist** — an unrunnable instruction, corrected in place to a by-hand `diff` of each dual-homed file. Building it is separate, still-open work.

**Do not "harden" beyond the ADR** — the extra-hop residual (a doer spawning a producer to close) is accepted and named.

## Related
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — §1, implemented here
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the grant reverted
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — what makes it structural
- [[tasks/route-coder-ship-loop-close-to-producer]] · [[tasks/route-sprint-ship-loop-close-to-producer]] — hard dependencies, landed first
- [[tasks/implement-spawned-invocation-for-task-movers]] — the ADR-025 build this undoes
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — the *first* time the mirror checklist shipped false docs
- [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] · [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] — co-editors of the same files
- [[tasks/enforce-task-status-vocabulary]] — the vocabulary doc caught by the phrasing gap
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the missing parity test
- [[tasks/add-adr-030-prose-half-to-universal-rules]] — the rules-block budget this edit touches
- [[systems/fkit]] · [[systems/role-locked-sessions]]
- [[systems/knowledge-base-structure]] — Knowledge-Base Structure
- [[systems/testing-and-verification]] — Testing & Verification
- [[tasks/wiki-skills-flag-ready-to-close]] — `0125`, landed alongside this so the 0108 gap was not re-opened
- [[tasks/wiki-resync-for-adr-033]] — `0126`, the vault resync that deliberately followed this
