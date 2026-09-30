# Add an "Explain more, then ask again" standing option to fkit owner questions

**Source**: `ai-agents/tasks/cancelled/0414-add-an-explain-more-then-ask-again-standing-option-to-fkit-owner-questions/brief.md`
**Status**: cancelled — `⛔ Cancelled (agent-closed — not owner-verified) (2026-09-25)`
**Sprint/Tag**: Backlog board · Unscheduled · task `0414` · owner `fkit-coder`

## Goal
The owner's own typed words (2026-09-25): when Claude asks him a question he keeps typing the same thing
into the free-text slot — *"Give me more context in simple terms and then re-ask the question"* — and he
asked whether that could be *"one of the predefined options. In this interactive ask user tool."* His
scope ruling (own words): *"Let's do it for the fkit only, for testing. Maybe later I will do it as global
settings"*. The draft had two parts: **explain first** before any `AskUserQuestion`, and a **standing
option** *"Explain more, then ask again"* on every question.

## Key Changes
None — cancelled before a plan. The brief recorded the design constraints that made it hard, and they
stay on the record for a future decision:
- **An instruction, not enforcement** — `AskUserQuestion`'s options are written by the model on every
  call; there is no harness setting for a fixed option.
- **At most 4 options per question** — the standing option costs one slot, which collides with *"mark your
  recommendation"* and with questions that need 4 real options.
- **Consults have no `AskUserQuestion`** (ADR-021), so the relaying session would have to add the option —
  and a worker returning 4 options leaves the relayer no free slot.
- ⚠️ **The binding constraint was the rules-block byte budget**: `test/rules-block-budget.test.js` caps the
  emitted block at `RULES_MAX=4352` B; measured 2026-09-25 at **3906 B → 446 B free**, against the owner's
  standing target of **≥ 400 B free** — so only **~46 B** could be added inside target. The two-part rule
  as drafted did not fit.

## Outcome
**Cancelled by the owner on 2026-09-25** — he is **trialling the "explain first" and "Explain more, then
ask again" rules in his personal global `CLAUDE.md` first**; whether to bring them into fkit is deferred,
and a new task would be filed then. The open questions (the shared byte cap; what "fkit only" covers) stay
in the brief for that decision. Not related to the aiboard work that dominated the same weeks.

## Related
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why a consult cannot add the option itself
- [[tasks/reclaim-rules-block-budget-headroom]] — the ≥400 B headroom target this change could not fit inside
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board it was filed and cancelled on
