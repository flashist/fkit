# Rewrite the installer for a single flavor

**Source**: `ai-agents/tasks/done/rewrite-installer-single-flavor.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 4 (Phase 1)

## Goal
Collapse `install.sh` from two flavors to one: Claude Code native.

## Key Changes
- Install **only `claude/`** into `~/.local/share/fkit/`.
- Generate a launcher that is a **direct `exec`** of `claude/fkit-claude.sh` — no flavor dispatch, and `update` is **not** intercepted (the launcher owns self-update now).
- **`rm -rf "$SHARE/omnigent"`** — what makes an upgrade from an older fkit *clean*, rather than leaving a dead runtime on disk.
- **Four retired verbs fail loudly** rather than falling through to `claude` as stray arguments: `omnigent`, `claude`, `reconnect`, `restart-team`.
- Sanity-gate the fetch on `claude/fkit-claude.sh` — the one file the installer cannot work without.

## Outcome
Done. **This was the blast radius of the entire sprint.**

> `install.sh` is the **`curl | sh` entry point**. A mistake here breaks installation **for everyone** — *including the self-update path that would otherwise deliver the fix*. It is the one file where a bad landing **cannot be quietly rolled back, because the broken version is the one users fetch.**

Consequently the verification was **not optional**: it had to be installed **from a branch ref into a clean `$HOME`**. *Reading the diff is not verification for this file.* That verification became the sprint's release gate — [[tasks/verify-onboarding-flow-end-to-end]].

⚠️ **It remains the highest-blast-radius file in the repo with zero automated coverage.**

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/build-claude-self-update]]
- [[tasks/delete-omnigent-directory]]
- [[tasks/verify-onboarding-flow-end-to-end]]
- [[systems/install-and-self-update]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[tasks/remove-fkit-resume-passthrough]]
