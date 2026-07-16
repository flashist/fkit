# ADR-009: Claude Code native + Codex is the only runtime; Omnigent is removed

**Date**: 2026-07-11
**Status**: accepted

**Supersedes**: [[decisions/adr-008-claude-code-native-port-alongside-omnigent]] (dual-runtime)

## Context
ADR-008 made fkit **dual-runtime**: Omnigent bundles under `omnigent/` plus a Claude Code native port under `claude/`, both on the same `ai-agents/` file contracts. It kept Omnigent as a peer — *"no flavor is deleted until the native port proves itself."*

**The port proved itself, and the cost came due:**

- **The dispatch had already inverted in code.** Bare `fkit` ran the Claude flavor; Omnigent had been demoted to a subcommand. Omnigent was *already* the secondary path in practice.
- **Hand-mirroring did not happen.** The doc-drift audit found the Omnigent-side docs, printed strings, and counts **pervasively stale** — its README still documented bare `fkit` as the Omnigent entrypoint, its init printed "6 agents" over a list of five, and its **reconnect script told a user mid-incident to "run `fkit`", which by then started Claude and never started an Omnigent server.** The dual-flavor tax was real and was not being paid.
- **The original driver never went away.** Omnigent's orchestration was unreliable — the failure classes the reconnect/restart tooling existed to paper over.
- **Owner ruling:** Omnigent is legacy; Claude Code native + Codex is the model going forward.

**Crucially, `omnigent/` was not dead weight that could simply be deleted.** The Claude flavor had **three hard dependencies** on it: the **shared scaffold** lived there, the **installer hard-required** it, and **self-update lived there**. Deleting it first would have broken the product three ways at once.

Dependency 3 exposed a **live defect**: `claude/fkit-claude.sh` contained **no update check at all**, so *the default flavor never self-updated* — every user on the default path was silently stuck on whatever version they installed. Self-update had to be **built**, not merely moved.

## Decision
**Claude Code native is fkit's only runtime.** `omnigent/` is removed from the repo.

1. **One flavor.** The team ships as Claude Code subagents + `/fkit-*` skills. The `omnigent` and `claude` subcommands, the `fkit-team` root agent, `.fkit/agents/` vendoring, `.fkit/run`, and the reconnect/restart tooling **all go away with it**.
2. **Codex is a required dependency, not optional.** It is what makes the adversarial second opinion genuinely model-diverse. Its absence is a **setup problem** — but per the owner's later ruling, it produces a **loudly-flagged partial review, not a hard fail**: an outage must not lock the owner out of their own team.
3. **Self-update is built for the Claude path.** It **notifies; it never auto-updates and never re-execs itself** — deliberately unlike the Omnigent launcher, which had no timeout and no `GIT_TERMINAL_PROMPT` guard.

**Sequence: extract → build → rewrite → delete.** The phases are genuinely ordered.

## Consequences
- **Single-vendor concentration, taken knowingly.** No fallback runtime. If Claude Code makes a breaking change, fkit has no second leg to stand on. **This is the main thing the decision buys its simplicity with — a finding of the form *"fkit only runs on one vendor's CLI"* is this decision, not a bug.**
- The hand-mirroring tax is gone; docs get written **once**, against one reality.
- **Retired verbs fail loudly** rather than being silently passed to `claude`: `omnigent`, `claude`, `reconnect`, `restart-team`.
- `install.sh` actively `rm -rf`s `$SHARE/omnigent`, so upgrading from an older fkit is clean rather than leaving a dead runtime on disk.
- **fkit's only automated check died with it** — `omnigent/validate-bundles.sh` ([[decisions/adr-003-ci-runs-validate-bundles]]). Nothing replaced it. This is now the project's top structural risk.
- ADRs 003, 004, 006, 007 describe Omnigent-only mechanics and were marked **superseded** once the code was actually removed. **ADR-005's *rule* survives** — only its mechanism died.

## Related
- [[systems/fkit]]
- [[decisions/adr-008-claude-code-native-port-alongside-omnigent]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
- [[decisions/adr-003-ci-runs-validate-bundles]]
- [[systems/install-and-self-update]]
- [[systems/review-and-model-diversity]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/delete-omnigent-directory]]
- [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]]
- [[decisions/adr-006-symlink-vendored-query-skill-not-copy]]
- [[decisions/adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/add-ci-validate-bundles]]
- [[tasks/amend-subagent-disconnect-incident-doc]]
- [[tasks/build-claude-self-update]]
- [[tasks/document-consult-chain-envelope]]
- [[tasks/extract-scaffold-into-claude]]
- [[tasks/fix-agent-count-doc-drift-and-fresh-detection-dup]]
- [[tasks/make-codex-a-checked-prerequisite]]
- [[tasks/remove-adversarial-reviewer-eager-spawn]]
- [[tasks/rewrite-docs-post-omnigent]]
- [[tasks/rewrite-installer-single-flavor]]
- [[tasks/rollout-adr-004-fixed-consult-titles]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[tasks/remove-fkit-resume-passthrough]]
- [[tasks/give-codex-the-universal-hard-rules]]
- [[tasks/wiki-sync-post-omnigent]]
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]
