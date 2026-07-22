# Restructure the coder's report — bullet summary first, interview on open questions last

## ID
0082

## Sprint
Sprint 2

## Priority
61

## Status
✅ Done

## Owner
fkit-coder

## Context

**The owner's ask (2026-07-18):** change how the coder agent reports back to the owner:
1. **Lead with a summary** — a list of short bullet points, first thing.
2. **End with an interview** — if there are open questions for the owner, ask them (interview),
   rather than only listing them and stopping.

This is a change to the coder's agent contract, `claude/agents/fkit-coder.md` — a single-file edit.
**Agent files are not dual-homed** (verified 2026-07-18: no `claude/scaffold/` copy), so the task-48/49
parity concern does not apply.

**The interview mechanism already has its seam.** `fkit-coder.md:34-35` stated, **at scoping time**:
*"In a session you may use `AskUserQuestion` for a structured choice; in a spawned consult the tool is
absent — return open questions as before."*

> **Note added 2026-07-18 (task 61 implementation, review finding R6):** this task **changed that
> wording** — the seam now reads *"…return open questions in your reply instead"* and carries a pointer
> to the new `## Output format` section. The quote above is preserved as the **pre-change** text the
> brief was written against; **do not read it as the current contract.** Read `claude/agents/fkit-coder.md`. The coder now holds `AskUserQuestion` in a session (ADR-022 relaxed tools).
So the "interview" is: in a **session**, use `AskUserQuestion` to ask the open questions; in a **spawned
consult**, the tool is `TOOL_ABSENT` (ADR-021) and the coder **must** fall back to returning the
questions in its reply — the existing two-hop consult contract. This degradation is **forced, not
optional**, and the brief must preserve it.

**⚠️ Consistency conflicts to honor, not override:**
- **The output-style convention** ([`status-report-format.md`](../../../knowledge-base/conventions/status-report-format.md))
  and CLAUDE.md's "be extremely concise" — the bullet summary must *align* with these, not restate a
  full report. This change should make the coder's report **more** conforming, not add a second format.
- **The ship-loop's own report contract.** `fkit-task-ship-loop` has a specialized ready-for-done
  report (spec §6.3) and its own owner-contact gates. This task changes the coder's **general** agent
  contract; the ship-loop's more specific contract must not end up contradicting it. If the general
  "interview at the end" and the ship-loop's gate structure would collide, the coder flags it — the
  ship-loop contract wins inside the loop, the general contract governs ordinary reports.
- **Tasks 59/60** (ship-loop timeout-auto-proceed) touch how ship-loop questions are answered. This
  task is a **different surface** (the agent's general report, not the loop's mid-run gates) — note the
  adjacency so the two don't drift into contradiction, but there is no hard dependency.

## What to build

A single edit to `claude/agents/fkit-coder.md` establishing the report shape:

- **Summary-first:** the coder's report to the owner **opens** with a short bullet-point summary — the
  key outcomes, in fragments, per the concision convention.
- **Interview-last:** after the summary and detail, **if open questions for the owner remain**, the
  coder **interviews** the owner on them:
  - in a **session**, via `AskUserQuestion` (structured choice), building on the existing `:34-35`
    wording;
  - in a **spawned consult**, `AskUserQuestion` is absent — return the open questions in the reply, as
    the two-hop consult contract already requires. **This fallback is mandatory and explicit.**
- **No open questions ⇒ no interview** — the report simply ends. Do not manufacture questions to have
  something to ask.
- Keep the change consistent with the status-report-format convention; do not introduce a competing
  report format.

## Verification steps

- `claude/agents/fkit-coder.md` states the report opens with a bullet summary and ends with an
  interview-on-open-questions, with the session (`AskUserQuestion`) vs spawned-consult (return-in-reply)
  split explicit.
- A session spot-check (owner): a coder session that finishes work with an open question **asks** it via
  the structured tool; one with no open questions ends without an interview.
- A spawned-consult spot-check: the coder returns open questions in its reply and does **not** attempt
  `AskUserQuestion` (which would be `TOOL_ABSENT`).
- The change does not contradict `status-report-format.md` or the ship-loop's §6.3 report — a read-through
  confirms consistency; any genuine collision is flagged, not silently resolved.
- No file other than `claude/agents/fkit-coder.md` is modified (agent files are not dual-homed; no
  scaffold copy, no `skills-for-role.sh`, no wiki).

## Notes

- **Owner: fkit-coder** — its own agent contract.
- **Depends on: nothing.** ADR-022 (tools relaxed) and ADR-021 (session-vs-consult) are the standing
  facts it builds on, both settled. **Soft-adjacent to tasks 59/60** (ship-loop questions) — no hard
  dependency; flagged so the two surfaces stay consistent.
- **Single brief, not split:** the two parts (summary-first, interview-last) are one coherent change to
  one file's reporting contract — independently describable but not independently *shippable* in a way
  that adds value; splitting two adjacent paragraphs of one agent file would be over-decomposition.
- Not a wiki change; a later sync picks up the agent-contract change if the vault records it.
