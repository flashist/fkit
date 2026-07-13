# Delete `omnigent/`

**Source**: `ai-agents/tasks/done/delete-omnigent-directory.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 5 (Phase 2)

## Goal
Remove the Omnigent runtime from the repo. **The payoff task — everything before it existed to make this safe.**

## Key Changes
- `git rm` the `omnigent/` tree: bundles, `fkit-team` root agent, `validate-bundles.sh`, the reconnect/restart tooling, `.fkit/agents/` vendoring, `.fkit/run`.
- Clean up `package.json`'s `description` and `keywords`, which still read *"An Omnigent agent team…"*.

## Outcome
Done. **Zero tracked files remain** (`git ls-files omnigent`), and `install.sh` actively cleans it out of pre-existing installs.

> **⚠️ Ordering was the whole risk.** This task was **low risk if and only if Phases 0 and 1 had landed**, and **catastrophic if run early** — running it before Phase 0 would break Claude init, the installer, and `fkit update` **at once**. The brief required confirming all four predecessors were *actually* Done — "not 'in progress', not 'basically done'" — and to **stop and report** rather than work around a missing one.

**A deliberate non-goal:** Omnigent-side doc drift, stale counts, and a known `chmod` bug were **not fixed on the way out**. *They were deleted, not fixed.* The correct residual `grep -rn "omnigent"` hits are **only** in the knowledge base — the ADRs, the removal plan, the audit, `history/` — which is intended: that is the record of *why fkit left*.

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/extract-scaffold-into-claude]]
- [[tasks/rewrite-installer-single-flavor]]
- [[tasks/rewrite-docs-post-omnigent]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/fkit]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/verify-onboarding-flow-end-to-end]]
