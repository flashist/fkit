# Track the `fkit-coder` declared-approval carve-out for the sprint-ship-loop

## ID
0119

## Sprint
Sprint 2

## Priority
101

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

0111 (build the `fkit-sprint-ship-loop` skill) hit a feasibility gap: a spawned `fkit-coder` **refuses
to implement** because its guarantee is "nobody is there to approve" (owner channel is session-only,
ADR-021). Making the sprint loop able to actually build required editing the coder's guarantee surface —
`claude/agents/fkit-coder.md` — to add a **declared-approval-marker carve-out**:

- A `fkit-sprint-ship-loop`-spawned coder **MAY** write source **only** under the loop's
  declared-approval marker: the spawn prompt identifies the caller as the sprint driver, carries a
  concrete **approved plan**, and states the owner approved that plan via a live `AskUserQuestion` relay
  in the driver session.
- **Build worker:** implement *only* the approved plan; `NEEDS-DECISION` on anything outside it.
- **Process-review worker:** under the same standing approval, apply verified-`CORRECT`, in-plan
  post-review fixes autonomously (owner-ruled **option b**, 2026-07-22), on exactly the ADR-019
  discipline; stop and return `NEEDS-DECISION` on every judgment call.
- Framed explicitly as **trust, not proof** — prose-enforced, the same accepted cost as ADR-031's
  honesty clause, not a hardened structural guarantee.

**This change is already implemented** — the `fkit-coder.md` edit is in the working tree (uncommitted).
It was owner-approved (2026-07-22) and fkit-architect-vetted (twice). But it landed **folded inside
0111** rather than as its own reviewable unit. The architect recommended a **guarantee-surface change
deserves its own tracked, independently-reviewable record** — this brief is that record.

**This brief does NOT re-do the edit.** It documents an already-shipped change so it can be reviewed as
its own unit and formally closed. Treat the build step as **done-pending-review**; the remaining work is
independent review + owner verification + closure.

## What to build

Nothing new to write — the implementation exists. The tracked work is to **verify and formally record**
the already-present `claude/agents/fkit-coder.md` carve-out as its own reviewable unit:

- Confirm the working-tree edit to `claude/agents/fkit-coder.md` matches the owner-approved,
  architect-vetted design: the declared-approval-marker gate, the Build-worker scope bound, the
  Process-review-worker option-b autonomy, and the "trust, not proof" framing.
- Confirm it does not weaken the coder's guarantee **outside** the sprint loop — every other spawned or
  pasted-in review still gates every round; `fkit-process-stateful-review` is byte-unchanged.
- The change is the diff currently in the working tree; do not re-author it.

## Verification steps

1. `claude/agents/fkit-coder.md` contains the declared-approval-marker carve-out with all three marker
   conditions (caller identity, approved plan, owner-approved-in-driver-session).
2. The Build-worker path is scope-bounded to the approved plan (`NEEDS-DECISION` outside it); the
   Process-review-worker path applies only verified-`CORRECT`, in-plan fixes and stops on judgment calls.
3. The carve-out is framed as prose-enforced trust, citing ADR-031/ADR-032 + ADR-019 discipline —
   **not** a false structural guarantee.
4. No behavior change to the coder's guarantee outside a sanctioned autonomy loop.
5. The four `.claude/` mirrors of `fkit-coder.md` stay consistent with the canonical `claude/` source
   (refreshed by `fkit-claude-init.sh`) — the mirrors are gitignored copies, edit only the canonical.

## Notes

- **Owner:** fkit-coder (an `fkit-coder.md` agent-def source edit, same owner precedent as 0110).
- **Depends on:** 0111 (the carve-out landed inside 0111's work) and **0118** (the ADR-032 amendment that
  formally authorizes it — the carve-out text cites "the 2026-07-22 autonomy amendment", which 0118
  makes real). Recommend 0118 lands so the citation resolves before this is closed.
- **Done-pending-review:** the edit is already in the working tree; this brief tracks it, it does not
  re-implement it. **Recommend the owner verify this one rather than agent-close it** — it is a
  guarantee-surface change the architect specifically flagged for independent review, so an
  `agent-closed — not owner-verified` close would defeat the reason it got its own brief.
- No commit — leave the edit in the working tree.
