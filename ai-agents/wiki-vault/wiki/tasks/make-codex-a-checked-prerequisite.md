# Make Codex a checked prerequisite

**Source**: `ai-agents/tasks/done/0060-make-codex-a-checked-prerequisite/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 3 (Phase 0.3, blocking)

## Goal
Make Codex a **required** dependency with a real preflight check, and remove the same-model fallback from the review skills.

## Key Changes
The runtime is now **Claude Code native + Codex sidekick**. Codex is no longer a nice-to-have the review skills degrade around.

> **The reasoning, which is the whole point of the role:** the adversarial reviewer exists for genuine *model diversity*. **A "Codex" review that silently ran on Claude is a second opinion from the model that wrote the code — which is not a second opinion at all. It is the illusion of one, and that is worse than none.**

The old `[claude-fallback — NOT model-diverse]` degradation path in `fkit-review` and `fkit-adversarial-review` is **no longer a supported mode**.

## Outcome
Done — with an **owner ruling that overrode the architect's recommendation**.

The architect recommended a **hard preflight fail** when Codex is absent. **The owner ruled against it: emit a loudly-flagged partial instead.** Rationale: *a Codex outage must not lock the owner out of their own team.* **The preflight warns; it does not wall.**

**The flag is therefore load-bearing**: the `⚠️ [NOT model-diverse — INCOMPLETE]` marker must be **the first thing a reader sees**, not a footnote — *because a partial review that reads like a complete one is precisely the failure this guards against.*

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[systems/review-and-model-diversity]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/install-and-self-update]]
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`):* [[decisions/adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode]] — ⚠️ **moves the line this task's ruling drew**: the flagged partial was *"a last-resort safety net for a Codex outage mid-session, not a supported way to run fkit without Codex installed"*; since 2026-10-05 running with **no Codex at all** is a supported, flagged setup. The "required" wording on this page is history.
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`, closing a one-way link):* [[tasks/make-every-document-say-codex-is-optional-but-recommended]] — Make every document say Codex is optional but recommended
