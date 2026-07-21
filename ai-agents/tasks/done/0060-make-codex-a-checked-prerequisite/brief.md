# Make Codex a checked prerequisite

## ID
0060

## Sprint
Sprint 2

## Priority
3 (Phase 0.3 — foundations, blocking)

## Status
✅ Done

## Context

Per the Omnigent-removal plan
([`2026-07-11-plan-omnigent-removal.md`](../../../knowledge-base/reports/2026-07-11-plan-omnigent-removal.md)
§Phase 0.3) and [ADR-009](../../../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md)
§Decision 2.

The runtime is now **Claude Code native + Codex sidekick**. Codex is no longer a nice-to-have that
the review skills degrade around — it is **required**. The adversarial reviewer's entire reason to
exist is genuine *model diversity*: a second opinion from a different model. A "Codex" review that
silently ran on Claude is a second opinion from the same model that wrote the code, which is not a
second opinion at all — it is the illusion of one, which is worse than none.

Today `claude/skills/fkit-adversarial-review/SKILL.md` and `claude/skills/fkit-review/SKILL.md` both
carry a `[claude-fallback — NOT model-diverse]` degradation path. Under ADR-009 that is **no longer a
supported mode**.

## ✅ Owner decision (2026-07-11) — RESOLVED: emit a flagged partial

**The reviewer does _not_ hard-fail when Codex is unreachable. It emits a loudly-flagged partial.**

The owner ruled against the architect's hard-fail recommendation. A review that cannot reach Codex
still produces its Claude pass — but it must be **unmistakably marked as incomplete and NOT
model-diverse**, so no one can mistake it for a full review.

**This makes the flag load-bearing, not decorative.** The entire safety of this decision rests on the
partial being impossible to misread as a complete review. Implement accordingly:

- The `[claude-fallback — NOT model-diverse]` marker stays, but it must be **prominent** — at the top
  of the review output, not buried in a footer. A reader skimming the result must see it first.
- It must state plainly what is missing: *this review had no independent second opinion; the model
  that reviewed this code is the same model family that may have written it.*
- **Preflight still warns loudly** (see below) — the partial is a last-resort safety net for a Codex
  outage mid-session, **not** a supported way to run fkit without Codex installed.

## Context

Per the Omnigent-removal plan
([`2026-07-11-plan-omnigent-removal.md`](../../../knowledge-base/reports/2026-07-11-plan-omnigent-removal.md)
§Phase 0.3) and [ADR-009](../../../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md)
§Decision 2.

The runtime is now **Claude Code native + Codex sidekick**. Codex is **required**, not optional.
The adversarial reviewer's entire reason to exist is genuine *model diversity*: a second opinion from
a different model. A "Codex" review that silently ran on Claude is a second opinion from the same
model that wrote the code — which is not a second opinion at all, it is the *illusion* of one. That
is strictly worse than no review, because it carries unearned confidence.

Hence: Codex absence must be **loud at every layer** — caught at preflight where possible, and
flagged unmissably in the output where not.

## What to build

- Add a **Codex preflight check**, alongside the existing `claude` binary check at
  `claude/fkit-claude.sh:122`. Decide with the owner whether it also belongs in `install.sh` (the
  installer is being rewritten in Phase 1 — coordinate so the two don't collide).
- The check should verify Codex is actually *reachable//usable*, not merely that a binary exists on
  `PATH` — a `codex` binary that cannot authenticate is the same failure from the user's point of
  view. Keep it fast; it runs at startup.
- Give a **genuinely actionable failure message**: what is missing, and the exact command to fix it.
  This is a first-run experience — a user hitting this has just installed fkit and has no context.
- **Preflight is a warning, not a wall.** Per the owner's ruling it must not hard-fail the session —
  but it must be impossible to miss, and it must fire at the point the user can still act on it.
- In `claude/skills/fkit-adversarial-review/SKILL.md` and `claude/skills/fkit-review/SKILL.md`,
  **keep the fallback path but harden its flagging** per the ruling above: the
  `[claude-fallback — NOT model-diverse]` marker moves to the **top** of the review output and states
  plainly that the review is incomplete and carries no independent second opinion.

## Verification steps

- With Codex absent/unauthenticated: the preflight fires with a message naming the exact fix command.
  The session still starts (no hard-fail).
- With Codex absent, **run an actual review**: the output is produced, and the
  `NOT model-diverse / incomplete` flag is the **first thing** a reader sees — not buried at the
  bottom. Show the output to someone who hasn't read this brief; if they could plausibly mistake it
  for a complete review, the flagging has failed.
- With Codex present and working: startup is unaffected, no perceptible latency, no flag in the
  output.
- A normal review genuinely reaches Codex — **confirm from the actual review output**, not from the
  absence of an error. (The whole failure mode this task guards against is a silent Claude fallback
  masquerading as a Codex pass — so "no error" proves nothing.)

## Notes

- Owner: **fkit-coder**. **Unblocked** — the owner's ruling (flagged partial, 2026-07-11) is recorded
  above; this task is ready to start.
- **Blocks:** Phase 1 (installer rewrite) — the installer may carry the preflight.
- Risk: **low** technically. The residual risk is entirely in the **flag's prominence**: a partial
  review that reads like a complete one is the exact failure this task exists to prevent.
