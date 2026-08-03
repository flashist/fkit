# ADR-032: The `fkit-sprint-ship-loop` autonomy & consent model — the conductor at sprint scope

**Date**: 2026-07-22
**Status**: accepted *(amended **twice**: its own §Amendment — 2026-07-22 (the two source-write carve-outs, written 2026-07-26 by task 0118), and §Decision 3 / §Decision 5's close step by [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] on 2026-07-23 — the driver no longer closes; it spawns the producer)*

**Source**: `ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md`
**Depends on**: [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]]

> ✅ **The previously-missing autonomy amendment now exists** — landed 2026-07-26 by [[tasks/record-adr-032-sprint-ship-loop-autonomy-amendment]] and recorded in full below. It had been ruled on 2026-07-22 and left unwritten for four days while `claude/agents/fkit-coder.md` cited it; **the ADR carried the citation before it carried the text**, and that gap silently blocked [[tasks/wiki-ingest-lead-conductor-and-adrs-031-032]] for three days. *(This line replaces the `⚠️ STALE` banner that stood in for the missing text.)*

> **In one line:** `fkit-sprint-ship-loop` is a **lead-owned driver** that ships a sprint's eligible tasks brief→closed by spawning role workers for bounded steps, relaying every owner decision **live** through the lead session, and closing with the agent-closed marker **by default** — and it **never** invokes the coder's session-only `fkit-task-ship-loop`.

## Context

ADR-031 established that `fkit-lead` can drive the team. This records the behaviour of its first named application: a loop that ships a whole sprint. Two constraints shaped it:

- **The coder's `fkit-task-ship-loop` is session-only and refuses a spawned/headless invocation.** So *"spawn a coder and run its ship-loop"* is infeasible — and it could not reach the owner anyway (ADR-021). The sprint loop must be a **new driver** that spawns the coder for *discrete steps*, not a wrapper.
- **The task loop's owner gates rely on the owner being present in the coder's own session.** Under orchestration the owner is present in the **lead** session, so the driver must own every gate.

## Decision

1. **A new skill owned by `lead`** (`skills-for-role.sh`; the ADR-018 hook then allows lead and denies every other role). It **does not invoke** `fkit-task-ship-loop`, which stays byte-unchanged and session-only.
2. **Task selection & order.** Read the sprint plan and its briefs; get the board via `dashboard.sh` — **never re-derive status by hand**. Eligible = `🔲 Backlog` tasks whose `Depends on` links are all `✅ Done`, ordered by priority then dependency topology. Dependency deadlock → **stop and report the chain**.
3. **Per-task drive sequence** — the bounded-worker / driver-owns-owner-channel pattern: spawn `@fkit-coder` for **plan only** → **driver `AskUserQuestion`: approve plan** → spawn coder to **implement** → spawn coder to **verify** → spawn `@fkit-reviewer` for `/fkit-stateful-review` → spawn coder to apply the process-stateful-review method → **close**. Re-verify after any post-review code change before closing.
   > ⚠️ **Amended by ADR-033 §4:** the close step was *"driver runs `/fkit-task-done`"*. It is now *"spawn `@fkit-producer` to close"* — the driver holds no movers. Landed by [[tasks/route-sprint-ship-loop-close-to-producer]].
4. **The live owner-relay gate is the load-bearing mechanism, and it differs from ADR-024.** A worker surfaces a decision by **returning** it; the driver relays via `AskUserQuestion` and **blocks on a real owner answer** — **no timer, no guess.** This is the *opposite* of ADR-024's declined silence-timeout auto-proceed: it **keeps** the owner in the loop and merely consolidates the channel into one session. **ADR-024 is not reopened.**
5. **Agent-closed marker by default.** Live-relay checks *decisions*, not *done-ness*, so a loop close carries `✅ Done (agent-closed — not owner-verified)` **unless the loop explicitly stops and the owner verifies.** *(Post-ADR-033 the marker is written by the **spawned producer**, not the driver — the marker rule itself is unchanged.)*
6. **Degraded runs and cancellations stop for the owner.** No Codex pass after retries, red verification, or an unresolved residual → **do not self-close**, put the close to the owner. **Never self-cancel** — `cancelled/` is audited by nobody, so a cancel always stops and asks.
7. **The plan/build split is mandatory** — it is the only thing standing in for plan mode's write-wall on this path (ADR-031's honesty clause). "Plan only, write nothing yet" is **prose-enforced**, and that limit is accepted, not hidden.
8. **Stop-hook interaction.** `fkit-sprint-ship-loop` **joins `/fkit-task-ship-loop` in [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]]'s Decision-7 skip set** — a long autonomous driver's idle turns must not be forced to carry a "What's next?" footer. *(Landed by [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] once the hook was built; the detection was then made transcript-independent by [[tasks/transcript-independent-ship-loop-skip-signal]].)*

## Amendment — 2026-07-22: the two sprint-loop source-write carve-outs

*(Ruled 2026-07-22, written 2026-07-26 by [[tasks/record-adr-032-sprint-ship-loop-autonomy-amendment]]. **Read Decision 3 together with this block, not on its own.**)*

Decision 3's drive sequence assumes the spawned coder can *write source* at the **Build** and **Process-review** steps. By default it **cannot** — `claude/agents/fkit-coder.md` makes a spawned coder **refuse** to implement, *"nobody is there to approve it"*. Task 0111's review found this **whole in round 1** and resolved it **in two halves**: R1 named both steps, only the Build half was carved out, and R4 (round 2) reopened the remainder — *"R1's Process-review half is not resolved."* **The defect was never Build-only.**

**A1 — the Build-worker carve-out.** A coder **spawned by `/fkit-sprint-ship-loop`** MAY write source, but **only** under the loop's **declared-approval marker** — **all three** of: (a) the spawn prompt identifies the caller as `fkit-sprint-ship-loop`; (b) it carries the concrete **approved plan** *verbatim*; (c) it states the owner **approved that plan** via a live `AskUserQuestion` relay in the driver session. On this path the refusal's own rationale is satisfied — the owner approved in the **driver's** session before the worker was spawned. **The approved plan is both the standing approval and the scope boundary:** the Build worker implements only that plan and returns `NEEDS-DECISION` for anything outside it.

> **Everything without the marker still refuses — including this loop's own plan-only spawn**, which carries no approved plan and says *write nothing yet*. That refusal is **itself prose, like everything else on this path**, and it is what keeps Decision 7's plan/build split meaningful: the carve-out opens **Build and Process-review, not the plan step.**

**A2 — the Process-review-worker autonomy** (owner-ruled option **b**). The Process-review step runs under the **same** marker and the **same** standing approval, and applies fixes **without per-fix owner approval**, on exactly [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]'s discipline: write without asking **only if** the fix is verified `CORRECT`, mechanical/localized and **inside the approved plan** (or an obvious winner within the plan's intent); **stop and return `NEEDS-DECISION` for every judgment call** — a frontier-move, a regression or review oscillation, a disputed severity that changes scope, a broad/behavior-changing fix, or anything outside the plan.

**ADR-019's audit obligation transfers with its permission** — it is part of *"exactly the same discipline"*. The Process-review worker **MUST record, in the task's worklog, each fix it applied without asking and each obvious-winner call it made**, so what the loop did unattended is inspectable afterwards. This is not decoration: **A4 bullet 2's reopening condition is unsatisfiable without it**, because nothing else on this path records what was applied autonomously.

> ⚠️ **Stated as a requirement, not yet true of the implementation — and the ADR says so.** `fkit-sprint-ship-loop/SKILL.md:105` asks the Process-review worker only for *"change surface + residuals"*, and `fkit-coder.md:73-82` imposes no worklog duty. Tracked as task `0147`; **until it lands, A4 bullet 2's guard points at evidence nothing requires anyone to write.**
>
> ✅ **Dated correction 2026-07-29 — `0147` landed; the sentence above is history.** *(Landed in the working tree, uncommitted.)* `claude/skills/fkit-sprint-ship-loop/SKILL.md:105` now requires the Process-review worker to **record each autonomously-applied fix and each obvious-winner call in the task folder's `worklog.md` decision log** — per entry: which finding it answers, what changed, and why it qualified; **`none` if none**. `claude/agents/fkit-coder.md:82-91` now imposes the same duty on the worker side, citing ADR-019 `:96`. **A4 bullet 2's reopening condition is therefore satisfiable** — the guard now points at evidence something requires someone to write. The claim above is left **byte-identical** as the ADR's own record of the gap it declared against itself. ⚠️ **The knowledge-base source still states the gap as live** — `ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md:129-133`. Repairing it belongs to task `0143`'s architect pass (owner-ruled 2026-07-29, alongside the ADR-010 and ADR-022 notes); **the wiki role never writes `knowledge-base/`.** *(Tree coordinates measured 2026-07-29 and are mutable — cf. open tasks `0159`/`0160`.)*
>
> ✅ **Amended 2026-08-01.** *"Landed in the working tree, uncommitted"* is out of date — [[tasks/implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop]] (`0147`) is **committed**. `0159` and `0160` are **closed**, not open; `0160`'s ruling on this exact citation class is on [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]]. ⚠️ **The knowledge-base source has NOT been re-checked by this sync** and the `0143` routing above stands as written — the wiki role never writes `knowledge-base/`, so its state is unverified here.

This makes the sprint loop the **second** standing-approval exception to `fkit-process-stateful-review`'s *"explicit approval every round"* gate; the task loop (ADR-019) is the first. **Nowhere else** — any genuinely outside-a-loop spawned or pasted-in review still gates every round, and `fkit-process-stateful-review` is **byte-unchanged**.

### The history, and one argument corrected at its own strength

*Why **some** repair was mandatory though not necessarily this one:* R4 established that the Build-only carve-out left post-review fixes with **no authorized writer at all** — a task with any valid review defect either stalls or gets written in violation of the coder's contract. That forced *a* fix; it did not force *this* fix.

R4 offered a **narrower alternative** — the driver relays every accepted fix for owner approval and re-spawns a Build-type worker, needing no further guarantee-surface change — and **the coder recommended it. The owner overrode that recommendation and ruled the broader option (b).**

> **The "strict subset" argument for (b) is conceded as not strictly true, in the amendment's own text.** The architect argued (b) is a *smaller* write surface than the Build carve-out already granted, and on most axes it holds — same marker, same approved-plan boundary, plus ADR-019's stop-on-judgment discipline, minus a per-fix relay *inside* a boundary Build already had. **But A1 bounds Build to "only that plan", while A2 additionally admits "an obvious winner within the plan's intent" — and intent is wider than the plan.** On that one branch A2 permits a write A1 would refuse. The round-3 model-diverse review reached "strict subset" only by describing the surface as *"in-plan CORRECT mechanical fixes only"*, **which drops the obvious-winner branch**; it is cited as the record of what was argued, **not as proof of the claim**. The asymmetry is inherited from `fkit-coder.md`, not introduced by the amendment, which **does not certify it away**.
>
> **None of this reopens A2** — the owner ruled (b) knowingly with the narrower option in front of him. Only the record's overstatement of the argument is corrected.

**A3 — the accepted cost, stated plainly: this is trust, not proof.** The declared-approval marker is **three prose signals in a spawn prompt.** A worker **cannot verify** from its own context that the owner approved anything — the owner channel is session-only ([[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]) and there is **no cross-context token to check**. A confused or injected driver prompt could assert the marker falsely and **nothing structural stops the write.** This is the **same** cost the owner accepted for the plan/build split (Decision 7 / ADR-031's honesty clause) — which is to say **both are unenforced**, not that either is safe; it is one more prose-enforced ordering on a path that already has one, not a novel kind of exposure. **Accepted knowingly, 2026-07-22.**

> **It is recorded so no future reader mistakes the carve-out for a structural guarantee.** It is **not hook-enforced** (contrast [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] §Decision 1, which *is*), there is **no token**, and there is **no detection** — a false marker leaves no trace anything checks. Owners who want the structural write-wall for a given task still ship it the old way: `fkit coder` + `/fkit-task-ship-loop`, where plan mode is a real session write-wall. **Do not rewrite this paragraph into a guarantee.**

**A4 — do-not-re-raise guard.** A finding that merely **restates** A3's cost is a **closeout, not a defect** — *"a finding must show it failing in practice."* Five closeouts, each with a narrow bar:

1. Do **not** re-raise *"the marker is only prose / unverifiable / forgeable"*. **Re-raise only if** a source write happened on this path **without a real owner plan approval**. *How that would ever be found, given A3 says there is no detection:* **out of band, by the owner**, who is in the relay loop and would recognise a build against a plan they never approved. **That channel is the only detection there is — a person noticing, not a check.** The guard is narrow, not unreopenable.
2. Do **not** re-raise *"the Process-review worker applies fixes without per-fix approval"* as a consent-model hole. **Re-raise only if** a loop-applied post-review fix is found **wrong or out-of-plan** (A2's worklog record is what makes that checkable) — then reconsider A2's autonomy; do **not** patch `fkit-process-stateful-review`. *Scope note:* the source residual shields the coder **skill**, **not** `claude/agents/fkit-coder.md`.
3. Do **not** re-raise *"relaying every fix is safer, use that instead"* — offered, coder-recommended, **owner-declined**.
4. Do **not** re-raise *"a spawned coder must never write source"* — reversed on this **one** path only. **Re-raise if** a spawned coder is found writing source **without all three marker signals**: that is a leak of the carve-out and a real defect.
5. Do **not** re-raise *"(b) widened the coder's authority"* **as a settled-tradeoff complaint**. **Re-raise with either** (i) a **write that actually occurred** which (b) permitted and Build would have refused, **or** (ii) **a textual demonstration** — a quoted passage showing the Process-review surface reaching past Build's, with the widening clause identified. **The claim was settled by reading, so it must stay answerable by reading** — a later edit that quietly widens the surface has to be raisable *before* it causes a bad write. A bare desk argument qualifies as neither. *(The obvious-winner branch is already conceded above and is not a re-raise.)*

**What the amendment does not change:** Decisions 1, 2, 4, 5, 6, 7 and 8 stand as written. **Decision 7 is reinforced, not superseded** — A3 is the same cost applied one step later in the drive sequence.

⚠️ **A second gap on the same guarantee surface, found by [[tasks/track-fkit-coder-declared-approval-carve-out]]'s review:** `fkit-coder.md` says the marker carries *"a concrete **approved plan**"* where A1 and the driver SKILL both require it **verbatim** — so a paraphrased plan satisfies the worker-side check and the worker's scope boundary can silently become the driver's summary. **Medium, not high:** the driver's own verbatim rule must fail first, making this a missing **second** line of defence. Tracked as task `0150`.

> ✅ **Dated correction 2026-07-29 — `0150` landed; the claim above is history.** *(Landed in the working tree, uncommitted.)* `claude/agents/fkit-coder.md:65-66` now reads *"(b) it carries a concrete **approved plan** verbatim"*, so the worker-side check matches A1 and the driver SKILL. The claim above is left **byte-identical**. ⚠️ **The guarantee surface is NOT fully closed, and this note must not be read as closing it.** Backlog task `0163` records that `fkit-coder.md:98-100`'s refusal clause enumerates exactly two cases — *"any other spawned 'implement this'"* and this loop's own **plan-only** spawn — and **neither of them is "a genuine sprint-loop spawn whose marker is defective"**. There is **no clause anywhere** of the form *"if the plan is not carried verbatim, refuse / return `NEEDS-DECISION` and ask the driver to re-send it"*. The refusal is inferable from A1's *"all three"* conjunction; it is not stated. *(Tree coordinates measured 2026-07-29 and are mutable — cf. `0159`/`0160`.)*
>
> ✅ **Amended 2026-08-01.** Two things in the note above are now out of date, and the note's own sentences are left byte-identical. **(1)** *"Landed in the working tree, uncommitted"* — [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] (`0150`) is **committed**; its brief is in `ai-agents/tasks/done/`. **(2)** `0159` and `0160` are **no longer open** — both closed *(agent-closed — not owner-verified)*. `0160` **ruled** the mutable-coordinate class: line numbers are for findings against a revision, names are for cross-references into living documents, and **never cite a line number naked**. See [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] and [[tasks/sweep-the-stale-rank-citations]]. **`0163` remains open and the guarantee surface is still not fully closed** — that half of the note stands unchanged.

## Consequences

- **Positive:** a whole sprint ships from one session, with the owner answering only real decisions; reuses `dashboard.sh` for deterministic selection and the existing stateful-review rigor; `fkit-task-ship-loop` and every role stay untouched — the change is additive and opt-in by name.
- **Negative, stated plainly:**
  - **The plan-gate is prose on this path.** Accepted.
  - **The agent-closed marker is invisible in `/fkit-status`** — `dashboard.sh` collapses it to plain `done`. A sprint driven end-to-end can turn a board green with **no surfaced signal** that no human verified any task. This is an **amplification** of ADR-025's accepted cost across many tasks at once, **not a new defect**.
  - **Orchestrator context accumulates over a sprint.**
- **Re-raise only if:** an agent-closed task shipped by the loop is found incomplete; the `/fkit-status` invisibility proves painful at sprint scale; or the live-relay round-trip is *measured* not to deliver a worker's `NEEDS-DECISION` return (that would be an implementation defect, not a model problem). **Do not re-raise** *"the sprint loop should just call `fkit-task-ship-loop`"* (infeasible — recorded here) or *"add a timeout so it doesn't block"* (declined, ADR-024).

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the conductor this applies
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — **amends** Decisions 3 & 5's close step
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the task-scope loop whose rigor this reuses and whose session-bound machinery it deliberately does not
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why workers return, not ask
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] — the declined auto-proceed; live-relay is the opposite
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the marker and its `/fkit-status` invisibility this loop amplifies
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — the skip set this loop joined
- [[tasks/build-fkit-sprint-ship-loop-skill]] — the build, and where R1/R4 forced the two carve-outs
- [[tasks/record-adr-032-sprint-ship-loop-autonomy-amendment]] — task 0118, the §Amendment above
- [[tasks/track-fkit-coder-declared-approval-carve-out]] — task 0119, the `fkit-coder.md` carve-out the §Amendment authorizes, tracked as its own reviewable unit and **owner-verified**
- [[tasks/wiki-ingest-lead-conductor-and-adrs-031-032]] — task 0117, silently blocked for three days by the unwritten amendment
- [[tasks/fix-sprint-ship-loop-skill-owner-banner-format]] — task 0120, the driver SKILL's H1 house-style fix
- [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] — the ownership wiring
- [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] · [[tasks/transcript-independent-ship-loop-skip-signal]]
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — the design
- [[systems/fkit]] · [[systems/role-locked-sessions]]
- [[systems/testing-and-verification]] — Testing & Verification
- [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] — Refresh architecture.md for the lead conductor + fix the stale §5.2 lock description
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] — ruled during a run of **this** loop. ⚠️ The driver proposed filing the review close-bar as a step **in this skill's SKILL**; the owner **rejected that** and took the reviewer's side — it is a cross-role rule, so it lives in an ADR, not here
- [[tasks/implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop]] — `0147`, which made A2's worklog obligation real and A4 bullet 2's reopening condition satisfiable
- [[tasks/wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner]] — `0148`, the vault's ingest of the 2026-07-22 amendment
- [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] — `0150`, which aligned the worker's condition (b) to A1's `verbatim`
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the declared-approval marker generalized from one skill and one role to **every spawned worker**
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162` — the construction that makes the marker's condition (b) true by copy rather than by recall
- [[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] — task `0202` — the loop's `plan.md` write moved to plan approval, plus the artifact table it lacked
