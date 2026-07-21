# Plan — Restructure the coder's report: bullet summary first, interview last

**Task:** [`restructure-coder-report-summary-then-interview.md`](./brief.md)
· **Sprint 2, priority 61** · **Approved by the owner: 2026-07-18**

## The change

A single edit to **`claude/agents/fkit-coder.md`**, rewriting its `## Output format` section into three
ordered parts:

1. **Summary first** — the report opens with a short bullet list of key outcomes, in fragments, per the
   project's concision preference. Explicitly: **lead with the worst news**, not the flattering part —
   summary-first is worthless otherwise. Restates "concision is not omission" at the point of use.
2. **Then the detail** — existing planning/implementing guidance, preserved, with the standing carve-out
   that a plan put to the owner is exempt from concision (they cannot approve what wasn't described).
3. **Interview last** — if open questions remain, **ask** them rather than listing them:
   - **session:** `AskUserQuestion`, batched, recommendations marked;
   - **spawned consult:** the tool is absent (ADR-021) ⇒ **return them in the reply. Mandatory, not a
     courtesy** — attempting it fails, and dropping the questions strands a decision.
   - **No open questions ⇒ no interview.** Do not manufacture one.

Plus a one-line pointer from the existing `:34-35` session-vs-consult seam to the new section, so the
mechanism and the behavior are not described in two disconnected places.

## Conflicts to honor, not override

- **The ship-loop's contract wins inside the loop.** ADR-019 defines its own owner-contact gates and
  its ready-for-done evidence packet. The new shape governs *how* the coder speaks at those gates; it
  **never adds a gate the loop lacks, nor licenses skipping one it has.** Stated explicitly in the file.
- **`status-report-format.md` is a different surface** (the producer's `/fkit-status` briefing), so
  there is no competing report format — verified, not assumed.
- **Not dual-homed** — verified: `fkit-coder.md` exists only under `claude/agents/`, no scaffold copy.
  (Worth checking given tasks 65 and 67 both turned up dual-home drift.)

## Verification

- The file states summary-first and interview-last with the session/consult split explicit.
- No other file modified — `git status` shows exactly one path.
- No contradiction with the ship-loop contract or the status-report convention (read-through).
- `npm test` green (no test asserts agent-file prose; the suite is a regression guard here, not proof).

## Scope boundary

Agent contract text only. No skill, no launcher, no `skills-for-role.sh`, no scaffold, no wiki, no
task-file move, no commit.

## Known limitation, disclosed not hidden

**This change cannot be proved by the test suite.** It is instruction text for an LLM; the brief's own
verification steps call for **session and spawned-consult spot-checks by the owner**. Everything below
that line is read-verified only, and the worklog says so rather than implying coverage.
