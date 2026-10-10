# Make every document say Codex is optional but recommended

**Source**: `ai-agents/tasks/done/0476-make-every-document-say-codex-is-optional-but-recommended/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P6` · task `0476` · owner `fkit-coder`

## Goal
Owner ruling 2026-10-02 (selected option text): *"Optional, recommended — README: 'Codex is optional but
recommended — without it the reviewer's second opinion falls back to Claude-only, loudly flagged.' And file a
small task to update CLAUDE.md + record the change against ADR-009, so the documents agree."* What raised it:
*"the CODEX is mentioned as a hard dependency, while it's an optional one."*

**The gap:** `CLAUDE.md`, ADR-009 Decision 2, `claude/README.md`, `PROJECT.md`, `architecture.md`
(*"required-but-WARNED"*), `install.sh` (*"⚠ Required: Codex"*) and the launcher comment said "required" — while
the product already treated Codex as optional (preflight only warns; both review skills fall back to a loudly
flagged Claude pass). ⚠️ **A pre-existing conflict inside ADR-009 had to be settled, not papered over:** its
*"no longer a mode fkit offers"* line had been false in practice for months.

**Meaning that must survive:** the second opinion is **meant** to be model-diverse; without Codex it is
**explicitly degraded and flagged** — *"not a downgrade of the loud flag."*

## Key Changes
- **Decision first, via the architect:** a new small ADR rather than a correction note —
  [[decisions/adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode]]
  (accepted 2026-10-05; the owner approved it as *"Approve with ADR-054"*). ADR-009's body left byte-identical,
  with a Status-line pointer and a dated end note.
- **Inventory, then reword** every live hit to *optional but recommended — falls back to Claude-only, loudly
  flagged*, keeping "model-diverse" and "not a complete review" wherever they appear: `CLAUDE.md`,
  `claude/README.md`, `PROJECT.md`, `architecture.md` (component table + launch diagram now
  *"optional-but-WARNED"*), `install.sh` (no longer "Required"; still says what you lose and how to install),
  the launcher comment above `codex_preflight`.
- **Behaviour unchanged** — `codex_preflight` and the review skills' fallback were not touched.
- Frozen history (closed tasks, closed sprints, the wiki) left alone; ADR-016/ADR-042 and three 2026-07 reports
  kept as history citers.

## Outcome
- Owner rulings on the ADR (2026-10-05): ADR-009 Status line updated; ⚠️ **no automated test pins the wording** —
  *"No, recorded grep is enough"*; the task's verification grep is the record.
- The brief named three wiki pages carrying the old wording (ADR-009, review-and-model-diversity,
  install-and-self-update) for a `fkit-wiki` sync after close — **done in the 2026-10-10 sync**.

## Related
- [[decisions/adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode]] — the decision it recorded
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] — Decision 2 amended
- [[tasks/make-codex-a-checked-prerequisite]] — `0060`, the 2026-07-11 ruling that made the flagged partial
- [[tasks/overhaul-the-readme-for-first-time-visitors]] — `0478`, the README half of the same ruling (not concurrent)
- [[tasks/sprint-10-the-0472-0482-batch]] — `P6`
- [[systems/review-and-model-diversity]] · [[systems/install-and-self-update]]
