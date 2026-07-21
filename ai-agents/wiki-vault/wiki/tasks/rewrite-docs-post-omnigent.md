# Rewrite the docs against the post-removal reality

**Source**: `ai-agents/tasks/done/0083-rewrite-docs-post-omnigent/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 8 (Phase 4)

## Goal
Rewrite `AGENTS.md`, `CLAUDE.md`, `README.md`, `claude/README.md`, `architecture.md`, and `PROJECT.md` against the one runtime that actually exists.

## Key Changes
**This came *after* the deletion, deliberately.** The prize for sequencing the sprint correctly is that the docs get written **once, against what actually exists** — instead of correcting drift in files about to be `git rm`'d. *Starting it early would have wasted the work.*

**`AGENTS.md` was done first — highest leverage, and the reason is sharp:** **Codex reads it *natively* during the adversarial pass.** While it was stale, it was briefing the adversarial reviewer that fkit was Omnigent-only — meaning **every adversarial review was being run by a model that had been told the wrong thing about the project.**

Other drift sites: `claude/README.md` was the **largest single one** and *never documented the skill lockdown at all* — the flavor's central invariant. `architecture.md` needed a **substantial rewrite**, not a patch: it was "an Omnigent-shaped document with a stale Claude addendum bolted on."

**Recurring themes to get right everywhere:** it is **7 agents, not 6** (`fkit-lead` was missing from every table); there is **one runtime, not two**; sessions are **role-locked with a skill lockdown**, not a lead session wearing hats; **Codex is required**, not optional.

## Outcome
Done. `architecture.md` was rewritten as a post-removal document with `path:line` evidence for every claim and open questions kept explicitly separate from answers.

⚠️ **Two claims in `architecture.md` have since gone stale** (flagged during this wiki sync): §8 and §9.6 state that ADRs 003, 004, 006, 007 *"are still marked `accepted` today."* They were **marked superseded** by [[tasks/knowledge-base-hygiene-post-omnigent]], which ran afterwards.

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/delete-omnigent-directory]]
- [[tasks/knowledge-base-hygiene-post-omnigent]]
- [[systems/review-and-model-diversity]]
- [[systems/fkit]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[tasks/fix-agent-count-doc-drift-and-fresh-detection-dup]]
- [[tasks/wiki-sync-post-omnigent]]
