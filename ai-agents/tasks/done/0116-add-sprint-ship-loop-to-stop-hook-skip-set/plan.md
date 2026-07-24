# Plan — 0116: add `fkit-sprint-ship-loop` to the ADR-030 Stop-hook skip set

## Context

Task `0116` was the original ship-loop target; it was blocked on the ADR-030 `Stop` hook not existing.
That hook now exists (task 0127, closed) — and I built its ship-loop skip as an **extensible list**
precisely so `0116` is a one-entry addition. `0116` makes the **sprint** ship-loop's mechanical idle
turns exempt from the hook's "What's next?"/interactive-question nudge, exactly as `/fkit-task-ship-loop`
already is (design §4.2/§5.3; ADR-032). Relay turns already use `AskUserQuestion` (satisfy check A); this
covers the loop's idle turns.

## Change (minimal — one list entry + one test)

### 1. EDIT `claude/turn-completion-hook.sh` (~line 89-93)
Add `/fkit-sprint-ship-loop` to the ship-loop skip marker list, and update the now-satisfied seam comment:
```sh
# was:  for marker in '/fkit-task-ship-loop'; do
        for marker in '/fkit-task-ship-loop' '/fkit-sprint-ship-loop'; do
```
The comment at `:89` ("task 0116 adds …") becomes a statement of fact (both loops listed). No other logic
changes — the skip mechanism (transcript command-marker scan, fail-open-safe over-skip) is unchanged.

### 2. EDIT `test/turn-completion-hook.test.js`
Add a test mirroring the existing `SKIP: a /fkit-task-ship-loop marker in the transcript -> allow`: a
transcript containing `/fkit-sprint-ship-loop` (an idle sprint-loop turn, message with no "What's next?")
→ **allow** (skipped, not nudged). This is the brief's verification step 2.

## Out of scope (accepted residual R6, already flagged as a producer follow-up)
The transcript-scan detection's degraded-only under-skip (missing/unreadable/lagging transcript) is the
known R6 residual from 0127 — a separate follow-up (a transcript-independent signal), **not** this task.
`0116` only extends the existing seam.

## Verification
1. `node --test test/*.test.js` — new skip test passes; full suite green.
2. `bash test/prove-red.sh` — hard gate still passes.
3. Walk `0116`'s brief verification steps: (1) `fkit-sprint-ship-loop` listed next to
   `/fkit-task-ship-loop` in the skip conditions — met; (2) the suite asserts the sprint loop's idle turns
   aren't forced to carry the footer — met; (3) the blocker (`turn-completion-hook.sh`) now exists — met.
4. Live session-scoped behaviour stays hand-verified (ADR-012), same as 0127.
5. Model-diverse review (reviewer + Codex) on the diff, then close via `/fkit-task-done` (agent-closed).

## Out of scope
No commit — working tree only.
