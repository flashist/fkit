# Track the `fkit-coder` declared-approval carve-out for the sprint-ship-loop

## ID
0119

## Sprint
Sprint 2

## Priority
101

## Status
🔄 In progress

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

**This change is already implemented and committed** — the `fkit-coder.md` carve-out is in `a89c917`
(2026-07-22); `ed4122f` (2026-07-25) also touches the file but is ADR-033 mover work that does not alter
the carve-out. **Both commits were authored by the owner** (`Mark Dolbyrev <ruflashist@gmail.com>`), so
**no agent breached the no-commit rule** — see the correction note dated 2026-07-26 at the end of this
brief. It was owner-approved (2026-07-22) and fkit-architect-vetted (twice). But it landed **folded inside
0111** rather than as its own reviewable unit. The architect recommended a **guarantee-surface change
deserves its own tracked, independently-reviewable record** — this brief is that record.

**This brief does NOT re-do the edit.** It documents an already-shipped change so it can be reviewed as
its own unit and formally closed. Treat the build step as **done-pending-review**; the remaining work is
independent review + owner verification + closure.

## What to build

Nothing new to write — the implementation exists. The tracked work is to **verify and formally record**
the already-present `claude/agents/fkit-coder.md` carve-out as its own reviewable unit:

- Confirm the committed edit to `claude/agents/fkit-coder.md` matches the owner-approved,
  architect-vetted design: the declared-approval-marker gate, the Build-worker scope bound, the
  Process-review-worker option-b autonomy, and the "trust, not proof" framing.
- Confirm it does not weaken the coder's guarantee **outside** the sprint loop — every other spawned or
  pasted-in review still gates every round; `fkit-process-stateful-review` is byte-unchanged.
- The change is the diff already committed in `a89c917`; do not re-author it.

## Verification steps

1. `claude/agents/fkit-coder.md` contains the declared-approval-marker carve-out with all three marker
   conditions (caller identity, approved plan, owner-approved-in-driver-session).
2. The Build-worker path is scope-bounded to the approved plan (`NEEDS-DECISION` outside it); the
   Process-review-worker path applies only verified-`CORRECT`, in-plan fixes and stops on judgment calls.
3. The carve-out is framed as prose-enforced trust, citing ADR-031/ADR-032 + ADR-019 discipline —
   **not** a false structural guarantee.
4. No behavior change to the coder's guarantee outside a sanctioned autonomy loop.
5. The **one** `.claude/` mirror of `fkit-coder.md` — `.claude/agents/fkit-coder.md` — stays consistent
   with the canonical `claude/` source (refreshed by `fkit-claude-init.sh`) — the mirror is a gitignored
   copy, edit only the canonical.

## Notes

- **Owner:** fkit-coder (an `fkit-coder.md` agent-def source edit, same owner precedent as 0110).
- **Depends on:** 0111 (the carve-out landed inside 0111's work) and **0118** (the ADR-032 amendment that
  formally authorizes it — the carve-out text cites "the 2026-07-22 autonomy amendment", which 0118
  makes real). Recommend 0118 lands so the citation resolves before this is closed.
- **Done-pending-review:** the edit is already committed (`a89c917`); this brief tracks it, it does not
  re-implement it. **Recommend the owner verify this one rather than agent-close it** — it is a
  guarantee-surface change the architect specifically flagged for independent review, so an
  `agent-closed — not owner-verified` close would defeat the reason it got its own brief.
- **⚠️ Update 2026-07-26 — the 0118 dependency is DISCHARGED, and the owner-verify requirement is
  re-affirmed.** 0118 closed (`✅ Done (agent-closed — not owner-verified)`,
  `ai-agents/tasks/done/0118-record-adr-032-sprint-ship-loop-autonomy-amendment/brief.md`): ADR-032 now
  carries its `## Amendment — 2026-07-22`, so this brief's citation of *"the 2026-07-22 autonomy
  amendment"* in `claude/agents/fkit-coder.md` **resolves to real ADR text**. The `Depends on` bullet
  above is satisfied; this task is unblocked. **The bullet above it is not.** Raised again during the
  2026-07-26 sprint-loop run (by the architect, and by this brief's own `:76-78`) and recorded here
  rather than as a separate task, because a task would only have restated what this file already says:
  **do not close 0119 with the agent-closed marker.** It is a guarantee-surface change — the marker
  states that no human checked exactly the thing it was split out to have a human check. It needs an
  owner-present `fkit producer` session.
- **No commit from this task.** The tracked edit was **already committed by the owner** before this
  brief was written (see the correction note below); nothing further is to be committed here.
- **⚠️ Correction 2026-07-26 — two stale claims in this brief were wrong and have been fixed.**
  Both were review findings, verified by the reviewer and **re-verified against the tree** before the
  edit. Recorded rather than silently overwritten, because this brief's own deliverable *is* the record
  the owner verifies against. Ledger: `review.md:20` (R3) and `:21` (R4).
  - **R3 — "in the working tree (uncommitted)" was false.** `git status --porcelain
    claude/agents/fkit-coder.md` is empty; the carve-out was committed in **`a89c917`** (2026-07-22), and
    **`ed4122f`** (2026-07-25) touches the same file with ADR-033 mover work that does not alter the
    carve-out. **⚠️ Read this correctly: both commits were authored by the owner**
    (`Mark Dolbyrev <ruflashist@gmail.com>`). **No agent breached the never-commit-unprompted rule.** The
    brief was **stale, not evidence of a violation** — do not infer a breach from this correction.
    Fixed at four sites: the Context paragraph, the *What to build* bullet, the *Done-pending-review*
    note, and the closing no-commit bullet. **The ledger's R3 enumerates three (`:36`, `:55`, `:90`); the
    fourth — the *Done-pending-review* bullet — carried the same false claim and was corrected with them
    rather than left standing.**
  - **R4 — "the four `.claude/` mirrors" was wrong; there is exactly one.**
    `.claude/agents/fkit-coder.md`. The verification step's **substance passed** — the mirror is
    byte-identical to canonical (`md5 = e08875aa6baad20d0c2805a6e81dafca`, re-confirmed 2026-07-26); only
    the count was false. Verification step 5 now says one.
  - **Status unchanged, deliberately.** This task stays **`🔄 In progress`** here and in
    `ai-agents/sprints/sprint-2.md`. Correcting the record is not closing the task — 0119 needs an
    **owner-verified** close in an owner-present `fkit producer` session, per the bullets above, and the
    `agent-closed — not owner-verified` marker must not be used on it.
  - **Finding R1 from the same ledger is now tracked as task 0150** (`🔲 Backlog`, priority **124** —
    filed at 128, promoted beside 0147 by owner ruling 2026-07-26,
    Sprint 2, owner fkit-coder) — the missing **verbatim** in the marker's condition (b). It is a
    **separate task**, not a change to this one.
