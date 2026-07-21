# Restructure the coder's report — bullet summary first, interview on open questions last

**Source**: `ai-agents/tasks/done/0082-restructure-coder-report-summary-then-interview/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 61

## Goal
Change how the coder reports back: **lead with a short bullet-point summary**, and **end by interviewing the owner** on any open questions rather than only listing them.

## Key Changes
A single edit to `claude/agents/fkit-coder.md`. **Agent files are not dual-homed** (verified — no `claude/scaffold/` copy), so the parity concern does not apply.

- **Summary-first:** the report opens with key outcomes in fragments, per the concision convention.
- **Interview-last:** if open questions remain, the coder **interviews** — in a **session** via `AskUserQuestion` (which the coder now holds, ADR-022 having relaxed tools); in a **spawned consult** the tool is `TOOL_ABSENT` (ADR-021) and it **must** return the questions in its reply. **This degradation is forced, not optional.**
- **No open questions ⇒ no interview.** The report simply ends — questions are never manufactured to have something to ask.

## Outcome
Done. The change makes the coder's report **more** conforming to the existing `status-report-format` convention and *"be extremely concise"* — it deliberately does **not** introduce a competing report format.

**Precedence settled where the two contracts meet:** `fkit-task-ship-loop` has its own specialized ready-for-done report and owner-contact gates. **The ship-loop's more specific contract wins inside the loop; this general contract governs ordinary reports.**

⚠️ **The brief's own line citation went stale in the act of implementing it.** The brief quoted `fkit-coder.md:34-35`'s session-vs-consult wording as the current contract; task 61 **rewrote that passage** and the surrounding `## Output format` section (review finding R6). The brief now carries a note preserving the quote as **pre-change** text — **read the agent file, not the citation.**

## Related
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — the session/consult seam the interview degrades across
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — why the coder holds `AskUserQuestion` in a session
- [[tasks/grant-askuserquestion-tool-to-six-claude-agents]] — the original grant, mechanism since subsumed
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] · [[tasks/implement-task-ship-loop-skill]] — the loop whose report contract wins inside the loop
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] — tasks 59/60, the adjacent ship-loop question surface, declined
- [[tasks/add-open-questions-interview-skill-for-six-roles]] — task 70, the on-demand interview skill of the same week
- [[systems/knowledge-base-structure]] — where `status-report-format` is filed
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
