# Build the ADR-030 `Stop` hook — turn-completion contract enforcement

## ID
0127

## Sprint
Sprint 2

## Priority
110

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

[ADR-030](../../../knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md)
is **accepted** (owner + fkit-architect) but the hook it authorizes is **not yet built** —
`claude/turn-completion-hook.sh` does not exist. The design is complete in
[`reports/2026-07-19-design-turn-completion-hook.md`](../../../knowledge-base/reports/2026-07-19-design-turn-completion-hook.md);
**no new design decision is needed** — this is a straight implementation task from a settled design.

The hook is a **second `Stop` hook** that enforces two end-of-turn behaviours the owner asked for and
the coder's prompt already promises but does not fire reliably (ADR-016 §6 — *delivery structural,
compliance advisory*): put questions to the owner **interactively** (`AskUserQuestion`), and close every
reply with a **"What's next?"** section.

**This task is the sole remaining blocker on task 0116** (add `fkit-sprint-ship-loop` to the hook's skip
set). 0116's other dependency — task 93 / 0111, the `fkit-sprint-ship-loop` skill — is already Done.

**This is the hook half of ADR-030 only.** The ADR also mandates a **prose half** (Decision 8 / design
§5.5 — the ~430 B rules-block addition), filed separately as **task 0128**. The two are independently
shippable in either order; neither blocks the other.

## What to build

Extend the **proven ADR-018 hook path — do not invent a second mechanism** (design §5.1):

1. **`claude/turn-completion-hook.sh`** — a sibling of `claude/skill-ownership-hook.sh`. The interface
   stub is given in design §5.4; implement its four predicates. On a `Stop` payload it performs **two
   presence checks and no judgement** (design §5.2):
   - **Check A (heuristic)** — interrogative content addressed to the owner in the final message **and**
     no `AskUserQuestion` call this turn → block once with a corrective message.
   - **Check B (exact)** — no literal `What's next?` section in the final message → block once with a
     corrective message.
2. **Wire it into `build_settings()`** (`claude/fkit-claude.sh:257-283`) as a **second key** in the same
   `{"hooks":{…}}` object that already carries `PreToolUse` — a `Stop` entry pointing at
   `bash "$here/turn-completion-hook.sh"` (match the existing `PreToolUse` wiring exactly, including the
   `bash "<path>"` form and the not-writable inline-settings fallback path).
3. **Honour the skip conditions** (ADR-030 Decision 7 / design §5.3) — the hook must **not** fire for:
   spawned consults / non-interactive runs, `/fkit-task-ship-loop`, and the adversarial reviewer; and it
   blocks **at most once per turn** (Decision 5).
4. **Fail open, always** (Decision 6) — any error, parse failure, or uncertainty **allows** the turn. A
   hook that can stop a turn completing is more dangerous than the missing footer it fixes.
5. **Tests** — add `node --test` coverage (per ADR-014) exercising the hook **script's logic against
   synthetic `Stop`-hook payloads**: check A fires / does not fire, check B fires / does not fire, each
   skip condition suppresses the block, block-once holds, and every error path fails **open**.

**Known limits to encode, not fix** (design §6): check A is a heuristic with accepted false positives
(rhetorical questions, questions quoted back from the owner, questions inside code fences — must not
match those). The **consult skip is safety-critical** (ADR-021 — `AskUserQuestion` is absent in
consults, so a wrong `is_interactive_session()` makes the block **unescapable**); when interactivity is
uncertain, **fail open**. Session-scoped hook behaviour cannot be fully verified by a spawned subagent
(ADR-012) — the `node --test` suite covers the script's logic; the live session path stays hand-verified.

## Verification steps

1. `claude/turn-completion-hook.sh` exists and is a `Stop` hook that performs checks A and B and no
   content judgement.
2. `build_settings()` emits a `Stop` key alongside `PreToolUse` in `.fkit/settings/<role>.json`; a
   launched session's settings file contains both hooks (verify the generated JSON).
3. `node --test` suite passes and asserts, against synthetic payloads: check A fires only when an
   interrogative appears with no `AskUserQuestion` call; check B fires only when the literal
   `What's next?` heading is absent; each of the three skip conditions suppresses the block; block-once
   holds; **every error / parse-failure path allows the turn (fails open)**.
4. A spawned consult and a `/fkit-task-ship-loop` run are **not** blocked (skip conditions hold).
5. Task 0116 becomes actionable once this lands (its brief's blocker `turn-completion-hook.sh` now
   exists).

## Notes

- **Owner:** fkit-coder.
- **Depends on:** nothing — ADR-030 is accepted and the design is complete; this is implementation only.
- **Blocks:** 0116 (add `fkit-sprint-ship-loop` to the hook's skip set), 0128 does **not** depend on
  this (the prose half ships independently).
- **Companion task:** 0128 (the ADR-030 prose half) — same ADR, independently shippable, either order.
- **Two open questions the owner should settle before/at build time** (design §7 — surfaced, not
  resolved here; they shape the check-B contract and check A's scope, but do not block starting):
  1. **Exact heading text for check B** — literally `What's next?`, or a looser match? Check B is an
     exact string match, so this is a **contract, not a preference**. *(Design recommends the literal
     string, since it is what the owner asked for.)*
  2. **Does check A apply to every role, or only the coder?** ADR-030 Decision 3 made *"What's next?"*
     (check B) universal but did **not** rule on check A's scope; the original complaint was about the
     coder. *(Design recommends universal — the reviewer and producer put questions to the owner too.)*
- **Coder-level implementation decision (not an owner question), flagged as the piece most likely to go
  subtly wrong** (design §5.4, §7 OQ3): the turn-scoped marker for block-once — where it lives and when
  it clears. A stale marker silently disables the hook; a missing one risks a loop. Document the marker
  and its lifetime.
- No commit — leave the change in the working tree.
