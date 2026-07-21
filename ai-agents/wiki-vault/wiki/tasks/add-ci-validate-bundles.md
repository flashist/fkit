# Add CI: run `validate-bundles.sh`

**Source**: `ai-agents/tasks/cancelled/0002-add-ci-validate-bundles/brief.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 1 — cancelled 2026-07-11

## Goal
Add a lightweight GitHub Actions workflow running `omnigent/validate-bundles.sh`, per [[decisions/adr-003-ci-runs-validate-bundles]].

## Key Changes
There was no CI in the repo. `omnigent/validate-bundles.sh` already existed and **caught real bugs** — the owner noted it had caught YAML frontmatter load failures. That made it a cheap, useful first CI target.

## Outcome
**⛔ Cancelled (2026-07-11) — Omnigent removed.** `validate-bundles.sh` was deleted with the Omnigent runtime ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]). **The premise no longer exists.**

⚠️ **The need it identified was real, and is now partly met.** *(Updated 2026-07-16, per [[systems/testing-and-verification]].)* `claude/fkit-claude.sh` is now covered by the launcher-contract suite ([[tasks/add-launcher-contract-smoke-script]], [[decisions/adr-014-how-fkit-tests-itself]]). **`install.sh` — the other file with the highest blast radius, and the `curl | sh` entry point — still has zero automated coverage, and there is still no `.github/`.** *The script died; the gap it was covering is reduced, not closed.*

**Open question for the owner:** is a `shellcheck` + smoke-install CI in scope, or is manual verification the accepted permanent posture for a prototype? *(The nominated home for that question, [[tasks/add-e2e-smoke-script-for-fkit-itself]], has since been cancelled — superseded by [[tasks/add-launcher-contract-smoke-script]], which does not cover `install.sh`. The question itself is still unresolved.)*

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[decisions/adr-003-ci-runs-validate-bundles]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/fkit]]
- [[systems/testing-and-verification]]
- [[tasks/add-e2e-smoke-script-for-fkit-itself]]
- [[tasks/add-launcher-contract-smoke-script]]
- [[decisions/adr-014-how-fkit-tests-itself]]
