# Implement spawned invocation for the task movers from the approved design

**Source**: `ai-agents/tasks/done/0054-implement-spawned-invocation-for-task-movers/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 64

> ⚠️ **Closed by an agent, not the owner.** The brief and the board both read
> `✅ Done (agent-closed — not owner-verified)`. **No human verified this work.** That marker is the
> mechanism this very task shipped, applied to itself on its first use.

## Goal

Build the relaxation [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] approved: let any
spawned agent invoke `/fkit-task-done` and `/fkit-task-cancelled`, removing the coder → producer session
switch at close-out.

**The brief was written before the design ruling and asks for the opposite of what shipped.** It
specifies an *"authenticated precondition check"* the mover verifies before moving a file, and a
verification step requiring that *"a spawned mover invocation without the authenticated precondition
refuses."* Task 63 found **no such precondition exists** — every candidate is writable by the requester
— and the owner ruled for a prose-only relaxation with no check at all. The brief's own escape clause
("task 63's approved spec governs and wins wherever it differs") is what made that legal. **The
highest-care verification step in the brief was therefore never performed, because there is nothing to
perform it on.**

## Key Changes

- **`claude/skills-for-role.sh`** — both movers added to `lead`, `coder`, `architect`, `reviewer`,
  `wiki` (`producer` already had them). `adversarial-reviewer` **deliberately excluded**. This file is
  what actually makes the relaxation real; see A1 below.
- **The two mover skills' `⛔ Owner:` banners and prose** rewritten off the owner-only wording.
- **The universal hard rule** reworded in its three homes (`CLAUDE.md`,
  `claude/scaffold/universal-rules.md`, `AGENTS.md`) — it no longer states the owner-only absolute.
- **`conventions/task-status-vocabulary.md`** gained two rows — `Done (agent-closed)` and
  `Cancelled (agent-closed)` — and its gating paragraph now reads *"skill-gated, not owner-gated."*
  `conventions/status-report-format.md` gained the matching variants.
- **`/fkit-task-ship-loop`** now closes its own task.
- **`knowledge-base/architecture.md`** and **`PROJECT.md`** updated off the owner-only language.
- **`test/skill-ownership-hook.test.js`** pins the adversarial reviewer's exclusion as a deny assertion.

### The three amendments the adversarial pass forced

ADR-025 Decision 6 made a Codex pass **mandatory** before this task started. It earned its place —
it found the ADR self-contradictory, and all three findings became owner rulings amending the ADR:

- **A1 — the ADR could not have worked as written.** Decision 2 granted every role the movers;
  Decision 5 forbade touching the hook. But `skills-for-role.sh` listed the movers under `producer`
  only, so `skill-ownership-hook.sh` would have denied every non-producer call **before the relaxed
  prose was ever read**. The owner ruled: change the mapping, keep "any role."
  **`skill-ownership-hook.sh` itself is unchanged** — verified, no diff — so Decision 5's substance
  (no precondition check, prose-only) survives intact.
- **A2 — `fkit-adversarial-reviewer` is excluded.** Findings-only contract, never edits, restricted
  Codex allowlist ([[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]). **Deliberate,
  not an oversight.**
- **A3 — the marker is invisible in `/fkit-status`.** `dashboard.sh` matches the marker *prefix*, so
  `✅ Done (agent-closed — not owner-verified)` collapses to a plain `done`, gets filtered off the open
  board, and is counted in the roll-up as an ordinary close. **Accepted and recorded, not fixed.**

## Outcome

Done — agent-closed. The close-out session switch is gone, which is the ergonomics the owner asked for.

**What this task actually removed, stated plainly: prevention. Nothing structural replaced it.**
The `(agent-closed — not owner-verified)` marker is prose written by the same agent that performs the
move; no code path enforces it, `/fkit-status` does not surface it, and git carries no authenticated
trace because the owner authors the commit. All four laundering paths ADR-025 names (L1–L4) are open,
**L1 — the confused optimist — most of all.** Do not read the marker as a weakened form of the old
guarantee; the guarantee is gone. See the ADR's honesty clause.

**A second-order effect worth naming:** the ship-loop now closes its own task. ADR-019 sold that loop's
autonomy on **two** human gates; **only the plan gate remains.** Plan approval, then unattended
build → review → judge → close is L1 at full strength. The loop's refusal to self-close a degraded run
is loop-local prose, **not a guarantee ADR-025 provides.**

**Open, by decision rather than by oversight:** nothing counts how many closes were agent-performed,
and no artifact makes an agent-closed row visible to someone reading the dashboard.

## Related
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the ADR this task built, and which
  it amended three times in the building
- [[tasks/design-spawned-invocation-consent-model-for-task-movers]] — task 63, the design that governs
  this one and overrode its brief
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the loop whose
  done-gate this removed; the plan-gate survives
- [[tasks/implement-task-ship-loop-skill]] — the loop, now self-closing
- [[tasks/enforce-task-status-vocabulary]] — the vocabulary this task extended with the agent-closed
  variants
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the
  hook whose data source A1 had to change
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — why the adversarial reviewer
  is the one excluded role
- [[systems/knowledge-base-structure]] · [[systems/fkit]] · [[systems/role-locked-sessions]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/design-task-folder-structure-and-id-scheme]] — task 64 is the task 74's brief wrongly instructed the design to sequence against; it was already Done, so **there is no collision**
