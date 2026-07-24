# Worklog — 0116 Add `fkit-sprint-ship-loop` to the ADR-030 Stop-hook skip set

**Task:** `0116-add-sprint-ship-loop-to-stop-hook-skip-set` · **Owner:** fkit-coder · via
`/fkit-task-ship-loop`. Plan approved (see `plan.md`). Status → 🔄 In progress (brief + sprint row).

## Owner-decision log
- Plan approved (upfront gate). No mid-build decisions needed — one-entry addition to the seam built
  for exactly this in task 0127.

## Build
- **EDIT `claude/turn-completion-hook.sh`:** added `/fkit-sprint-ship-loop` to the ship-loop skip marker
  list (`for marker in '/fkit-task-ship-loop' '/fkit-sprint-ship-loop'`); updated the seam comment to
  state both autonomous loops are listed. No other logic change.
- **EDIT `test/turn-completion-hook.test.js`:** added `SKIP: a /fkit-sprint-ship-loop marker in the
  transcript -> allow`, mirroring the existing task-loop skip test (brief verification step 2).

## Verification
- `node --test test/*.test.js` → **494 pass / 0 fail** (both loop-skip tests green).
- `bash test/prove-red.sh` → **hard gate PASSED**.
- Brief verification steps: (1) `fkit-sprint-ship-loop` listed next to `/fkit-task-ship-loop` — met;
  (2) suite asserts the sprint loop's idle turns aren't forced to carry the footer — met; (3) blocker
  `turn-completion-hook.sh` now exists — met.
- Live session-scoped behaviour hand-verified only (ADR-012), same as 0127.

## Review — Round 1 (model-diverse: reviewer + Codex 0.144.4)
✅ **Ready to merge — 0 defects.** Both passes ran (full coverage). Reviewer independently confirmed the
bash loop is correct, the marker names the real skill, SKIP 3 placement doesn't leak the askuq marker,
and **mutation-proved** the new test is a real gate (reverting the skip reds exactly the new test). R6
correctly not raised (out of scope; filed as 0129). Ledger `review.md` → closed-out. No coder actions.

## Close-out
- Verification (final): `node --test test/*.test.js` → **494 pass / 0 fail**; `bash test/prove-red.sh` →
  hard gate PASSED.
- Brief verification steps 1–3 all met.
- **Hand-verified only (ADR-012):** the live session path (same as 0127) — not automatable.
- Commit state: nothing committed; change (`turn-completion-hook.sh` + test) left in the working tree.
- Closed via `/fkit-task-done` with the agent-closed marker.

## Notes
- The transcript-scan detection's degraded-only under-skip is the accepted R6 residual from 0127, now
  filed as task **0129** (transcript-independent skip signal) — that hardens BOTH loops; 0116 only
  extends the existing seam. No conflict.
