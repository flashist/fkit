# Design a version-to-version migration mechanism

**Source**: `ai-agents/tasks/done/design-version-to-version-migration-mechanism.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 20 (investigation)

## Goal
fkit had started **changing the shape of things it had already put on disk** — the scaffold moved, `omnigent/` was deleted, [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] restructured the whole knowledge base — **with no way to carry an existing installation across those changes.** A project scaffolded last week had no `conventions/`, `reports/`, or `incidents/`, and **nothing told it to create them.**

An **investigation**, explicitly not a build.

## Key Changes

**The owner's idea, given as an idea and not a spec:** a `migration-current.md` renamed to `migration-X.Y.Z.md` on release, walked in semver order on update, possibly executed by a migration agent. **The brief's framing was unusually strong on this point** — *"it is entirely fine to reject it completely and propose something else instead… do not let it anchor the investigation into validating rather than evaluating it."*

**The brief also named the load-bearing ambiguity itself:** the mechanism was ruled **fkit-development-internal**, but `fkit update` is the **end-user** path. *"These two facts are in tension and the investigation must resolve it explicitly. Do not paper over this."*

**The investigation rejected the idea** — as **premature, not wrong** — and resolved the tension by finding a **third answer**: the hook is neither `fkit update` nor a new mechanism. **It is launch, and it already exists.**

## Outcome
**Done.** Produced `reports/2026-07-14-migration-mechanism.md` → **[[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]**, and spawned four implementation tasks (25–28).

**The headline is not "build a migration mechanism."** It is: **fkit already converges every project on every launch; `ai-agents/` is simply carved out of it.** Un-carving it, additively, is the fix. **There is no migration mechanism, no version walk, and nothing new for a user to run.**

**The brief's verification bar explicitly permitted the answer it got:** *"a clear recommendation with its main tradeoff — including, if the evidence points that way, **'build nothing.'**"*

⚠️ **Rev 1 of its report did not survive an adversarial Codex pass** — two factual claims were false and the headline changed. **A third correction landed later**, after ADR-015 was accepted: the `cp -R` symlink write-through claim, falsified at implementation. **Two false claims from this report's lineage reached briefs before anyone ran the command.** *"We did not know all along."*

**Found in passing, and the more urgent of the two things it found:** [[tasks/stop-init-failure-bricking-the-launcher]].

## Related
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the decision it produced
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] — the live worked example that motivated it
- [[tasks/fix-scaffold-knowledge-base-folders]] · [[tasks/stop-init-failure-bricking-the-launcher]] · [[tasks/refuse-init-on-weird-ai-agents-state]] — the defects it spawned
- [[tasks/build-claude-self-update]] — the most likely hook, and not the answer
- [[systems/launch-convergence-and-init]]
- [[systems/install-and-self-update]]
- [[tasks/sprint-2-remove-omnigent]]
- [[systems/knowledge-base-structure]]
