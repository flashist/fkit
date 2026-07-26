# Record the ADR-032 sprint-ship-loop autonomy amendment

## ID
0118

## Sprint
Sprint 2

## Priority
100

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

Resolving 0111's feasibility gap (a spawned coder refuses to implement because "nobody is there to
approve") required a **guarantee-surface** change to `claude/agents/fkit-coder.md`: a
declared-approval-marker carve-out that lets a `fkit-sprint-ship-loop`-spawned coder write source under
the driver's owner-approved plan. Two worker paths were opened:

1. **Build worker** — implements *only* the approved plan, `NEEDS-DECISION` on anything outside it.
2. **Process-review worker** — under the same standing approval, applies verified-`CORRECT`,
   in-approved-plan post-review fixes autonomously (owner-ruled **option b**, 2026-07-22), mirroring
   the ADR-019 per-round-gate discipline; every judgment call still stops.

Both were owner-approved (2026-07-22) and fkit-architect-vetted (twice). The `fkit-coder.md` edit is
already in the working tree (uncommitted) and is being tracked separately as 0119. **The decision
record that authorizes it does not yet exist as a formal amendment.**

ADR-032 today records the sprint-ship-loop autonomy/consent model but **predates** these two carve-outs
and the do-not-re-raise guard. Without the amendment: (a) 0119's carve-out cites an ADR-032 amendment
that has no formal text; (b) 0117 (wiki ingest of ADRs 031/032) would ingest a **stale** ADR-032
missing the Build + Process-review exceptions. This brief exists to make that dependency visible and
prevent the amendment from being silently dropped.

**⚠️ Reassigned 2026-07-25 — this is no longer a tracking-only record; it is live work.**

The brief formerly read: *"the owner stated (2026-07-22) they will write this amendment themselves in a
`fkit architect` session… a tracking record only."* On **2026-07-25** the producer verified the ADR
directly — `grep -niE "amend|carve-out|do-not-re-raise"` against
`knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md` returns **zero
matches**. The amendment was never written. **The owner ruled the task stalled and reassigned it** to be
executed as ordinary architect work rather than waited on.

**Consequence: this has been blocking 0117 for three days** and nobody was tracking it as a block,
because the brief said someone had it. **The lesson is procedural, not personal — a task parked on
"the owner is doing it himself" has no owner the board can chase.** Prefer a real assignee with the
owner as reviewer.

**The four decisions below are settled (owner-ruled 2026-07-22) and are NOT reopened by this
reassignment.** The architect writes up decisions already made; it does not re-decide them.

## What to build

A **combined amendment to ADR-032** (via `/fkit-record-decision` in a `fkit architect` session, per the
owner) that records, as a single reviewable unit:

- The **Build-worker carve-out** — a sprint-ship-loop-spawned coder may write source under the driver's
  owner-approved plan, scope-bounded to that plan.
- The **Process-review-worker autonomy** — a *second* per-round-gate exception mirroring ADR-019: apply
  verified-`CORRECT`, in-plan fixes without per-fix approval; stop on every judgment call
  (owner-ruled option b).
- The **accepted cost** — this is prose-enforced trust, not a structural guarantee (the owner channel is
  session-only, ADR-021; there is no cross-context marker to verify). The same cost the owner accepted
  for ADR-031's honesty clause / ADR-032 Decision 7.
- A **do-not-re-raise guard** so a future review does not re-flag the trust boundary as a new hole.

## Verification steps

1. ADR-032 carries a dated amendment section recording all four points above (Build carve-out,
   Process-review autonomy, accepted cost, do-not-re-raise guard).
2. The amendment cross-references ADR-019 (mirrored discipline) and ADR-031 (honesty clause).
3. 0119's `fkit-coder.md` citation of "the 2026-07-22 autonomy amendment" resolves to real ADR text.
4. No source or wiki change in this task — it is an ADR write only (wiki ingest is 0117).

## Notes

- **Owner:** fkit-architect — **live assignment as of 2026-07-25**, not a placeholder. Run
  `/fkit-record-decision` in a `fkit architect` session.
- **Blocks:** 0117 (wiki ingest must ingest the *amended* ADR-032 — the amendment lands before 0117 runs)
  and closes the citation gap in 0119.
- **Depends on:** nothing. The four decisions were owner-approved 2026-07-22; this is a write-up, not a
  decision task.
- **⚠️ Do not re-decide the option-b ruling, the carve-outs, or the accepted cost** — all settled
  2026-07-22 and re-affirmed by the reassignment. The architect's job here is to write down what was
  decided, not to re-litigate it. If the architect believes a decision is wrong, that is an open question
  for the owner, **not** an edit to the amendment.
- **Verified 2026-07-25:** ADR-032 contains no amendment text. Start from nothing; there is no partial
  draft to find.
- No commit — leave the ADR file in the working tree.
