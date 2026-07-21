# Compress the Output style section of `universal-rules.md`

**Source**: `ai-agents/tasks/done/0022-compress-universal-rules-output-style-section/brief.md`
**Status**: done — ⚠️ **`(agent-closed — not owner-verified)`**
**Sprint/Tag**: Sprint 2 · ID **0022** · priority 79 · owner fkit-coder (architect content)

## Goal
Reclaim headroom in `claude/scaffold/universal-rules.md` — the **single source** for the marker-delimited block that `fkit-claude-init.sh` injects into every consuming project's `CLAUDE.md` **and** `AGENTS.md` on **every launch**.

The budget is real and launch-blocking: `RULES_MAX=4096`, and overflow is a hard **`exit 1`** — an over-budget block **fails the launch**, it does not degrade or warn. The live block measured **3557 B / 4096 (539 B headroom)**, of which the **Output style section was 2397 B — 67% of the block**. A prior review (R2) had already flagged the budget at 84% consumed.

## Key Changes
- Compressed the Output style section — settled, owner-reviewed architect content — reclaiming ~549 B against the cap.
- The budget itself is now test-guarded: `test/rules-block-budget.test.js` exists (R2's test-coverage half), so a future over-budget edit fails `npm test` rather than only the launch.

## Outcome
Done, agent-closed. **Owner asked for it explicitly (2026-07-19) and asked that it go into the current sprint.** A review pass was required (the R3 precedent on output-style edits). It was sequenced **before** the not-yet-filed output-style follow-ups so they land against the compressed baseline.

## Related
- [[tasks/add-speak-in-simple-terms-output-style]] — the edit whose review (R2) flagged the budget this task relieves
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the shared-instructions block this section lives in
- [[systems/testing-and-verification]] — `rules-block-budget.test.js`, the guard on this cap
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
