# Add CI: run `validate-bundles.sh`

**Source**: `ai-agents/tasks/cancelled/add-ci-validate-bundles.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 1 — cancelled 2026-07-11

## Goal
Add a lightweight GitHub Actions workflow running `omnigent/validate-bundles.sh`, per [[decisions/adr-003-ci-runs-validate-bundles]].

## Key Changes
There was no CI in the repo. `omnigent/validate-bundles.sh` already existed and **caught real bugs** — the owner noted it had caught YAML frontmatter load failures. That made it a cheap, useful first CI target.

## Outcome
**⛔ Cancelled (2026-07-11) — Omnigent removed.** `validate-bundles.sh` was deleted with the Omnigent runtime ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]). **The premise no longer exists.**

⚠️ **But the need it identified is still unmet and still open, and it is now the project's top structural risk.** fkit has **no CI and no test suite of any kind** — and the two files with the highest blast radius (`install.sh`, `claude/fkit-claude.sh`) have the least verification. *The script died; the gap it was covering got bigger.*

**Open question for the owner:** is a `shellcheck` + smoke-install CI in scope, or is manual verification the accepted permanent posture for a prototype? *(See `ai-agents/tasks/backlog/add-e2e-smoke-script-for-fkit-itself.md`.)*

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[decisions/adr-003-ci-runs-validate-bundles]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/fkit]]
- [[systems/testing-and-verification]]
