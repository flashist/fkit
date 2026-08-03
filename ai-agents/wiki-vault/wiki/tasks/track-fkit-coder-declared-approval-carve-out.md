# Track the `fkit-coder` declared-approval carve-out for the sprint-ship-loop

**Source**: `ai-agents/tasks/done/0119-track-fkit-coder-declared-approval-carve-out/brief.md`
**Status**: done *(**owner-verified** — the `agent-closed` marker was deliberately refused)*
**Sprint/Tag**: Sprint 2 · ID `0119` · priority 101 · owner `fkit-coder`

## Goal

Give an **already-shipped guarantee-surface change its own reviewable record.** Task 0111 needed the sprint loop to actually build; a spawned `fkit-coder` refuses to implement (*"nobody is there to approve it"*). The fix edited the coder's guarantee surface — `claude/agents/fkit-coder.md` — but it landed **folded inside 0111** rather than as its own unit. The architect's position: a guarantee-surface change deserves its own tracked, independently-reviewable record. This brief is that record.

**It does not re-do the edit.** The build step was treated as *done-pending-review*; the work was review + owner verification + closure.

## Key Changes

The tracked change, in four parts:

- A sprint-loop-spawned coder **MAY** write source, **only** under the **declared-approval marker**: the spawn prompt names the caller as the sprint driver, carries a concrete **approved plan**, and states the owner approved that plan by live `AskUserQuestion` relay in the driver session.
  - ✅ **Dated correction 2026-07-29 — condition (b) now requires the plan `verbatim`.** The sentence above is left **byte-identical** as the record of what `claude/agents/fkit-coder.md` said when this task shipped on 2026-07-26 — *"a concrete **approved plan**"*, with no `verbatim`, which is precisely the defect this task's own review raised as **R1**. Task `0150` landed the missing word on **2026-07-29**: `claude/agents/fkit-coder.md:65-66` now reads *"(b) it carries a concrete **approved plan** verbatim"*, matching ADR-032 **A1** and the driver SKILL, which had both required it all along. *(The R1 explanation on this page sits 25 lines below, under §Outcome; this marker is placed at the claim because a reader reaches it first.)* ⚠️ **Not fully closed:** backlog task `0163` records that `fkit-coder.md`'s refusal clause still names no *defective-marker* case, so a by-reference carry is refused only by inference from A1's *"all three"* conjunction.
- **Build worker:** implement *only* the approved plan; `NEEDS-DECISION` on anything outside it.
- **Process-review worker:** under the same standing approval, apply verified-`CORRECT`, in-plan post-review fixes autonomously (owner-ruled **option b**, 2026-07-22), on exactly ADR-019's discipline; stop on every judgment call.
- Framed explicitly as **trust, not proof** — prose-enforced, the same accepted cost as ADR-031's honesty clause, **not** a hardened structural guarantee.

Verified: the marker's three conditions are present; the Build path is scope-bounded; the Process-review path applies only verified-`CORRECT` in-plan fixes; **no weakening outside the sprint loop** — every other spawned or pasted-in review still gates every round, and `fkit-process-stateful-review` is byte-unchanged. The one `.claude/agents/fkit-coder.md` mirror is byte-identical to canonical (`md5 = e08875aa6baad20d0c2805a6e81dafca`, re-confirmed 2026-07-26).

### Two stale claims in the brief were wrong, and were corrected on the record

Both were review findings (ledger R3, R4), **re-verified against the tree before the edit**, and recorded rather than silently overwritten — because this brief's own deliverable *is* the record the owner verifies against.

- **R3 — "in the working tree (uncommitted)" was false.** The carve-out was committed in **`a89c917`** (2026-07-22); **`ed4122f`** (2026-07-25) touches the same file with ADR-033 mover work that does not alter it. ⚠️ **Read this correctly: both commits were authored by the owner. No agent breached the never-commit-unprompted rule** — the brief was **stale, not evidence of a violation.** Fixed at **four** sites; the ledger enumerated three, and the fourth carried the same false claim and was corrected with them rather than left standing.
- **R4 — "the four `.claude/` mirrors" was wrong; there is exactly one.** The verification step's **substance passed**; only the count was false.

**Correcting the record did not close the task** — its status stayed `🔄 In progress` through the correction, deliberately.

## Outcome

**Closed `✅ Done` — owner-verified, and the `agent-closed — not owner-verified` marker was deliberately refused.** This is the point of the task existing:

> A guarantee-surface change split out precisely so a human would check it **cannot** be closed with a marker stating that no human checked it. It needed an owner-present `fkit producer` session.

The requirement was raised twice — once in the brief itself, then again during the 2026-07-26 sprint-loop run by the architect — and **recorded in this brief rather than filed as a separate task**, because a task would only have restated what the file already said. In a sprint where most rows carry the agent-closed marker, **this row is one of the few that does not, on purpose.**

- **Its 0118 dependency was discharged by another route.** The brief predicted the ADR-032 amendment would land first; 0117 and this task ran ahead of it. Once 0118 closed, `fkit-coder.md`'s citation of *"the 2026-07-22 autonomy amendment"* resolves to real ADR text and the dependency is satisfied.
- **Review finding R1 became its own task, `0150`** (promoted by owner ruling to sit adjacent to `0147`): the marker's condition (b) says *"a concrete **approved plan**"* where ADR-032 A1 and the driver SKILL both require it **verbatim**. A paraphrased plan satisfies the worker-side check, so the worker's **scope boundary can silently become the driver's summary.** Rated **medium, not high** — the driver's own verbatim rule must fail first, making this a **missing second line of defence, not the primary control.** A one-word prose fix on a guarantee surface, **owner-ruled to be tracked rather than slipped in.** ✅ **Dated correction 2026-07-29: `0150` closed** *(agent-closed — not owner-verified)*; `claude/agents/fkit-coder.md:65-66` now carries `verbatim`. **A residual on the same surface stays open as `0163`** — the refusal clause names no defective-marker case.
- **No commit from this task.** The tracked edit was already committed by the owner before the brief was written.

## Related
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the §Amendment that authorizes this carve-out
- [[tasks/record-adr-032-sprint-ship-loop-autonomy-amendment]] — task 0118, which made the citation real
- [[tasks/build-fkit-sprint-ship-loop-skill]] — task 0111, where the carve-out landed folded in
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — task 0110, the agent-def-edit ownership precedent this followed
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the discipline the Process-review path runs on
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the honesty clause whose accepted cost this shares
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why the marker cannot be verified from the worker's context
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why an owner-present producer session was the required closing route
- [[tasks/wiki-ingest-lead-conductor-and-adrs-031-032]] — task 0117, whose gap analysis found this carve-out missing from the vault
- [[tasks/sprint-2-remove-omnigent]] — the sprint carrying this task
- [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] — `0150`, the fix for this task's review finding R1
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the carve-out ADR-037 turns from a one-role exception into an instance of a general rule
- [[tasks/decide-whether-a-spawn-instruction-may-override-a-skill-rule]] — task `0158`, the investigation behind it
