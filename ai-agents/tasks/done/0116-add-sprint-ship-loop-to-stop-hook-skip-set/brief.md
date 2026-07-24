# Add `fkit-sprint-ship-loop` to the ADR-030 Stop-hook skip set (when that hook is built)

## ID
0116

## Sprint
Sprint 2

## Priority
98

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

The sprint loop's idle turns (between owner relays) run in the interactive lead session, so the
ADR-030 Stop hook *sees* them. Like `/fkit-task-ship-loop`, the sprint loop is a long autonomous
driver, not a normal turn, so it should be exempt from the hook's "What's next?" footer. From the
approved design
[`2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../../../knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
§4.2, §5.3, and
[ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
(ADR-030 interaction).

**⚠️ This is gated on external work.** The ADR-030 Stop hook is **authorized but not yet built**
(`claude/turn-completion-hook.sh` does not exist yet). This task **cannot land until that hook is
built**. Until then the sprint loop relies on prose to avoid the footer, which is acceptable because
the hook does not exist (design §14.4). File it now so it is not forgotten when ADR-030 ships.

## What to build

When the ADR-030 Stop hook (`claude/turn-completion-hook.sh`) is built:

- Add `fkit-sprint-ship-loop` to ADR-030 Decision 7's **skip conditions**, alongside
  `/fkit-task-ship-loop` (design §4.2 last row, §5.3).
- (Relay turns use `AskUserQuestion`, so they already satisfy the hook's check A; this skip set covers
  the loop's mechanical *idle* turns.)

## Verification steps

1. `fkit-sprint-ship-loop` is listed in the Stop hook's skip conditions next to `/fkit-task-ship-loop`.
2. The hook's test suite (once it exists) asserts the sprint loop's idle turns are not forced to carry
   the "What's next?" footer.
3. This task remains **blocked** until `claude/turn-completion-hook.sh` exists — do not attempt it
   before the ADR-030 hook build lands.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** 0111 (the skill must exist) **and** the separate ADR-030 Stop-hook build (external —
  authorized, not built). Design §11: `T7` gated on `T3 + ADR-030 impl`.
- **Do not start** until the ADR-030 hook exists; this brief is filed to preserve the dependency, not
  to be picked up now.
- No commit — leave any future edit in the working tree.
