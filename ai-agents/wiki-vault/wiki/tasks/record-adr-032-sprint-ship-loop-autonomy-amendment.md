# Record the ADR-032 sprint-ship-loop autonomy amendment

**Source**: `ai-agents/tasks/done/0118-record-adr-032-sprint-ship-loop-autonomy-amendment/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0118` · priority 100 · owner `fkit-architect`

## Goal

Write the **missing decision record** for a change that had already shipped. `claude/agents/fkit-coder.md` cites *"[ADR-032] Decision 3 + its 2026-07-22 autonomy amendment"* — **a citation to text that did not exist.** Four things were owner-ruled on 2026-07-22 and never written down: the Build-worker carve-out, the Process-review-worker autonomy (option **b**), the accepted cost, and a do-not-re-raise guard.

**The task does not re-decide any of them.** The architect writes up decisions already made.

## Key Changes

### The procedural lesson, which is why this brief is worth reading

The brief originally read: *"the owner stated (2026-07-22) they will write this amendment themselves in a `fkit architect` session… a tracking record only."* On **2026-07-25** the producer checked the ADR directly — `grep -niE "amend|carve-out|do-not-re-raise"` returned **zero matches**. The amendment was never written, and it **had been blocking task 0117 for three days with nobody tracking it as a block, because the brief said someone had it.**

> **A task parked on "the owner is doing it himself" has no owner the board can chase.** Prefer a real assignee with the owner as reviewer. The lesson is procedural, not personal.

The owner ruled the task stalled and **reassigned it** as ordinary architect work.

### What landed in ADR-032

A single dated `## Amendment — 2026-07-22` block, written **2026-07-26**. *The four-day gap is recorded, not hidden: the ADR carried the citation before it carried the text.*

- **A1 — the Build-worker carve-out.** A coder spawned by `/fkit-sprint-ship-loop` may write source, but **only** under the **declared-approval marker** — **all three** of: the spawn prompt identifies the caller as the driver; it carries the concrete **approved plan** verbatim; and it states the owner approved that plan via a live `AskUserQuestion` relay in the driver session. On this path the refusal's own rationale is satisfied. **The approved plan is both the standing approval and the scope boundary.** Everything without the marker still refuses — **including the loop's own plan-only spawn**, which is what keeps Decision 7's plan/build split meaningful.
- **A2 — the Process-review-worker autonomy** (option b). Same marker, same standing approval, fixes applied **without per-fix owner approval**, on exactly ADR-019's discipline: write without asking only if verified `CORRECT`, mechanical/localized and **inside the approved plan**; stop and return `NEEDS-DECISION` for every judgment call. **ADR-019's audit obligation transfers with its permission** — every autonomous fix and obvious-winner call must be recorded in the task's worklog. This makes the sprint loop the **second** standing-approval exception to `fkit-process-stateful-review`'s per-round gate; the task loop is the first; **nowhere else**, and that skill is byte-unchanged.
- **A3 — the accepted cost, stated plainly: this is trust, not proof.** The marker is three prose signals. A worker **cannot verify** the owner approved anything — the owner channel is session-only and **there is no cross-context token to check**. A confused or injected driver prompt could assert the marker falsely and **nothing structural stops the write**. Not hook-enforced, no token, **no detection** — a false marker leaves no trace anything checks. Owners wanting the real write-wall still ship the old way: `fkit coder` + `/fkit-task-ship-loop`, where plan mode is a session write-wall. **Do not rewrite this paragraph into a guarantee.**
- **A4 — the do-not-re-raise guard.** Five closeouts, each with a narrow re-raise bar: *"the marker is only prose / forgeable"* (re-raise only on a source write with no real owner approval — found **out of band, by the owner**, which is the only detection there is); *"the Process-review worker applies fixes without per-fix approval"* (re-raise only if a loop-applied fix is found wrong or out-of-plan); *"relay every fix instead"* (declined); *"a spawned coder must never write source"* (re-raise if one writes **without all three signals** — that is a leak of the carve-out and a real defect); and *"(b) widened the coder's authority"* (re-raise only with an actual write, **or a quoted textual demonstration** — the claim was settled by reading, so it must stay answerable by reading).

### Where the amendment corrects the record rather than restating it

**The "strict subset" argument for option (b) is conceded as not strictly true, in the amendment's own text.** The architect argued at the time that (b) is a *smaller* write surface than the Build carve-out already granted. On most axes it holds — but **A1 bounds Build to "only that plan"**, while **A2 additionally admits "an obvious winner within the plan's intent" — and intent is wider than the plan.** On that one branch A2 permits a write A1 would refuse. The round-3 model-diverse review reached "strict subset" only by describing the surface as *"in-plan CORRECT mechanical fixes only"*, **which drops the obvious-winner branch**; it is cited as the record of what was argued, **not as proof of the claim**. The asymmetry is inherited from `fkit-coder.md`, not introduced here, and the amendment **does not certify it away**.

**None of this reopens A2** — the owner ruled option (b) knowingly with the narrower alternative in front of him, over the coder's own recommendation. What is corrected is only the record's overstatement of the argument for it.

**Why *some* repair was mandatory though not necessarily this one:** finding R4 established that the Build-only carve-out left post-review fixes with **no authorized writer at all** — a task with any valid review defect either stalls or gets written in violation of the coder's contract. That forced *a* fix; it did not force *this* fix.

## Outcome

ADR-032 now carries the amendment; **0119's citation of "the 2026-07-22 autonomy amendment" resolves to real ADR text**; ADR-019 and ADR-031 are cross-referenced as required. No source or wiki change in the task itself — an ADR write only.

⚠️ **The amendment states one requirement that is not yet true of the implementation, and says so.** A2's worklog audit obligation is unimplemented: `fkit-sprint-ship-loop/SKILL.md:105` asks the Process-review worker only for *"change surface + residuals"*, and `fkit-coder.md:73-82` imposes no worklog duty. **Consequence: A4 bullet 2's reopening condition is unsatisfiable in practice** — the guard points at evidence nothing requires anyone to write. Tracked as task `0147`.

✅ **Dated correction 2026-07-29 — `0147` landed, and the paragraph above is this task's record as of 2026-07-26.** `claude/skills/fkit-sprint-ship-loop/SKILL.md:105` now requires the Process-review worker to record each autonomously-applied fix and each obvious-winner call in the task folder's `worklog.md` **decision log** (which finding, what changed, why it qualified; **`none` if none**), and `claude/agents/fkit-coder.md:82-91` imposes the same duty. **A4 bullet 2's reopening condition is now satisfiable.** The paragraph above is left byte-identical. ⚠️ **The knowledge-base ADR source still states the gap as live** at `ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md:129-133` — routed to task `0143`'s architect pass; **the wiki role never writes `knowledge-base/`.**

⚠️ **A second gap on the same guarantee surface, found by 0119's review:** `fkit-coder.md` says the marker carries *"a concrete approved plan"* while A1 and the driver SKILL both require it **verbatim**. Tracked as task `0150`.

✅ **Dated correction 2026-07-29 — `0150` landed.** `claude/agents/fkit-coder.md:65-66` now reads *"(b) it carries a concrete **approved plan** verbatim"*. The claim above is left byte-identical. ⚠️ **Not fully closed** — backlog task `0163` records that the refusal clause names no *defective-marker* case, so a by-reference carry is refused only by inference from A1's *"all three"* conjunction.

## Related
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the ADR this amends
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the discipline A2 mirrors, and the audit obligation that transfers with it
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the honesty clause A3 is the same cost as
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why there is no cross-context token to verify the marker
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — separately amends Decision 3's close step
- [[tasks/track-fkit-coder-declared-approval-carve-out]] — task 0119, the `fkit-coder.md` change this authorizes
- [[tasks/build-fkit-sprint-ship-loop-skill]] — task 0111, whose R1/R4 rounds produced the two carve-outs
- [[tasks/wiki-ingest-lead-conductor-and-adrs-031-032]] — task 0117, which this was meant to unblock and which shipped first instead
- [[tasks/sprint-2-remove-omnigent]] — the sprint carrying this task
