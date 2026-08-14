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
- [[tasks/wiki-sync-post-omnigent]]
- [[tasks/wiki-resync-for-adr-033]] — `0126`, filed as its own task precisely because only `fkit-wiki` may write the vault
- [[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]] — `0211`, whose brief ruled that **this exclusive-surface rule outranks the sprint loop's step table**: a driver spawning a coder for a vault write is asking it to break a hard rule
- [[tasks/design-the-post-update-structure-check]] — task `0241` (2026-08-06): the structure-check design preserves this rule structurally under every branch — vault rows are existence-only checks and any vault repair routes to `fkit-wiki`
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — the companion ADR (2026-08-07) makes that routing an owner-ruled decision: the producer is custodian of the repair skill, and any repair under `wiki-vault/` routes to `fkit-wiki`, never the producer
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — ⚠️ *Added 2026-08-13:* ADR-042's **D2** puts `ai-agents/wiki-vault/` **inside a writable workspace for the duration of a review**, because the vault sits under the repo root that `--cd` names. ***This rule stands; the structural guarantee behind it does not, while a review is running.*** ADR-042 states the breach against itself rather than resolving it, and makes *"Codex is observed writing to `ai-agents/wiki-vault/`"* a re-raise condition where **a single occurrence is sufficient — no pattern needs establishing.** ⚠️ **D2 is decided, NOT built** (task `0273` open, verified 2026-08-13), so the exclusivity is still structurally intact today
- **The 2026-08-13 sync — pages whose very existence is this rule in force.** Each of these was a separate task *because* only `fkit-wiki` may write the vault: [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] (§4 names `structure-spec.md` as **not** the enforcement site, preserving this boundary) · [[tasks/sprint-4-ship-the-use-ready-self-healing-update]] (its archival banner records a producer **correctly writing nothing** in the vault and listing the debt instead) · [[tasks/author-the-structure-spec-and-its-scaffold-inventory-drift-test]] (the routing note on every vault row) · [[tasks/build-the-producer-owned-structure-check-skill]] (vault paths existence-only) · [[tasks/build-the-consent-gated-repair-path-inside-the-check-skill]] (a fixture asserts a repair run writes **nothing** under the vault) · [[tasks/update-the-docs-for-the-structure-check-capability]] and [[tasks/wiki-ingest-of-the-structure-check-design-report-and-companion-adr]] (**the split this rule forced**, cause recorded rather than inferred)
- [[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] — ⚠️ *Added 2026-08-13 (the `0258` resync):* `0252` is another page whose vault re-sync was **filed rather than performed** (`0258`) for exactly this reason — the coder landing `RELEASING.md` is structurally barred from following its own change into the vault. ⛔ It also could not be driven by `/fkit-sprint-ship-loop`, whose Build step spawns `@fkit-coder`; the owner routed it to a `fkit wiki` session instead
- [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]] — its vault ingest is filed as its own task (`0293`) precisely because writes stay exclusive to `fkit-wiki`
- [[tasks/the-2026-08-13-vault-resync-chain]] — six vault-maintenance rows in one day, every one owned by `fkit-wiki` and by nothing else
