# ADR-032: The `fkit-sprint-ship-loop` autonomy & consent model — the conductor at sprint scope

- **Status:** accepted
- **Date:** 2026-07-22
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Depends on:** [ADR-031](adr-031-fkit-lead-becomes-the-orchestrating-front-door.md) (the conductor
  reversal). This ADR records how the flagship application of that conductor behaves — the sprint-scope
  analogue of [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)'s task loop.
- **Amended by:** this ADR's own
  [§Amendment — 2026-07-22](#amendment--2026-07-22-owner-ruling-the-two-sprint-loop-source-write-carve-outs)
  (the two sprint-loop source-write carve-outs, recorded by task 0118), and
  [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md) (Decision 3/5 close step — the
  driver spawns `@fkit-producer` to close and does **not** run the movers itself).
- **Corrections:** 2026-09-04 (`0170`, inside sweep `0357`) — this ADR carries **one** dated note
  inline, under **§Decision item 1**, and that single note covers **two** annotated sites: §Decision
  item 1's closing sentence and the **§Consequences → Positive** bullet beginning *"`fkit-task-ship-loop`
  and every role stay untouched"*. Marker legend: **⚠️ = a fact that drifted** (the decision is
  untouched); **⛔ = a decision that was overturned** (do not follow it). No existing line of this ADR
  was edited; the note is an append, and the Status stays `accepted`. ⛔ **§Amendment — 2026-07-22's
  separate *"byte-unchanged"* claim about `fkit-process-stateful-review` is a DIFFERENT subject and is
  deliberately not annotated.**
- **Evidence:** [`reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
  §5 (the contract), §5.3 (the live-relay gate), §5.4 (stop conditions).

> **What this ADR decides, in one line:** `fkit-sprint-ship-loop` is a **lead-owned driver** that ships a
> sprint's eligible tasks brief→closed by spawning role workers for bounded steps, relaying every owner
> decision **live** through the lead session, and closing with the agent-closed marker **by default** —
> it **never** invokes the coder's session-only `fkit-task-ship-loop`.

## Context

ADR-031 establishes that `fkit-lead` can drive the team as a conductor. This ADR records the behavior of
its first named application: a loop that ships a whole sprint. Two constraints shape it:

- **The coder's `fkit-task-ship-loop` is session-only and refuses a spawned/headless invocation**
  (`fkit-task-ship-loop/SKILL.md:8-18,74-75,238`). So *"spawn a coder and run its ship-loop"* is
  infeasible — and it could not reach the owner anyway (ADR-021). The sprint loop must therefore be a
  **new driver** that spawns the coder for *discrete steps*, not a wrapper around the task loop.
- **The task loop's owner gates rely on the owner being present in the coder's own session** — plan
  approval (plan mode), review judgment calls, degraded-run close. Under orchestration the owner is
  present in the **lead** session, not the worker's; the driver must therefore own every gate.

## Decision

1. **`fkit-sprint-ship-loop` is a new skill owned by `lead`** (`skills-for-role.sh:37` gains it; the
   ADR-018 hook then allows lead and denies every other role). It **does not invoke**
   `fkit-task-ship-loop`, which stays byte-unchanged and session-only.

   > ⚠️ **Dated correction 2026-09-04 (`0170`, inside sweep `0357`) — the *"byte-unchanged"* half of
   > the sentence above is false, and it is false at a second site in this ADR too.** Both passages are
   > **left byte-identical** as the record of what was decided on 2026-07-22. ⛔ **Nothing here reopens a
   > decision** — this is a drifted fact, not an overturned ruling.
   >
   > **The two sites this one note covers** — anchored by heading and quoted phrase, because both files
   > involved are actively edited:
   >
   > - **`## Decision` item 1** (immediately above): *"It **does not invoke** `fkit-task-ship-loop`,
   >   which stays byte-unchanged and session-only."*
   > - **`## Consequences` → Positive**, the bullet reading: *"`fkit-task-ship-loop` and every role stay
   >   untouched; the change is additive and opt-in by name."*
   >
   > **What falsified them.**
   > [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md) **§Decision 3** rewrote
   > `fkit-task-ship-loop`'s close step — from invoking `/fkit-task-done` itself to routing the close to
   > the producer — and that rewrite is present in `claude/skills/fkit-task-ship-loop/SKILL.md` today.
   > So the file **was** edited after this ADR was written, and it was edited for a reason unrelated to
   > this ADR's own ripple.
   >
   > **What still stands, and it is the larger half.**
   >
   > - **The *"session-only"* claim is TRUE and untouched.** `fkit-task-ship-loop` genuinely refuses a
   >   spawned or headless invocation.
   > - **The design fact both sentences were written to carry is TRUE and untouched:** introducing the
   >   sprint driver required **no** edit to the task loop. ADR-032's own ripple left it alone. What went
   >   wrong is that a claim with that scope was written in unscoped, permanent-tense words, so a later
   >   and unrelated ADR made it read false.
   > - **This ADR's decision is not overturned.** The driver still does not invoke the task loop.
   >
   > **Why ⚠️ and not ⛔.** ⛔ marks a decision a reader must stop following. Nothing here was overturned
   > — a supporting fact aged. Marking this ⛔ would tell readers to stop following a decision that is in
   > force, which is the failure the two-marker legend exists to prevent.
   >
   > **Neighbouring-site check, run deliberately and reported either way** (the `0143` lesson: a scoped
   > append can leave a document contradicting itself on one screen). ⛔ **One neighbour found, and it is
   > NOT this defect:** the `## Amendment — 2026-07-22` section calls **`fkit-process-stateful-review`**
   > *"byte-unchanged"*. That is a **different subject**; its truth is **not assessed here** either way,
   > and it is deliberately left untouched. **No other passage in this ADR is contradicted by the wording
   > above.**
   >
   > ⛔ **This note deliberately asserts no new permanent-tense claim about `fkit-task-ship-loop`'s
   > bytes.** Restating the fact in a fresher tense would reproduce the defect one layer down.

2. **Task selection & order.** Read the sprint plan and its briefs; get the board via
   `bash claude/skills/fkit-status/dashboard.sh <plan>` (never re-derive status by hand). Eligible =
   `🔲 Backlog` tasks whose `Depends on` links are all `✅ Done`, ordered by **priority** then dependency
   topology. Dependency deadlock (nothing eligible, backlog remains) → **stop and report the chain**.

3. **Per-task drive sequence** — the bounded-worker/driver-owns-owner-channel pattern (ADR-031
   Decision 3): spawn `@fkit-coder` for **plan only** (write no source) → **driver AskUserQuestion:
   approve plan** → spawn coder to **implement approved plan** → spawn coder to **verify** → spawn
   `@fkit-reviewer` `/fkit-stateful-review` → spawn coder to apply `fkit-process-stateful-review`
   **method** → **driver runs `/fkit-task-done`** to close. Re-verify after any post-review code change
   before closing.

4. **The live owner-relay gate is the load-bearing mechanism, and it differs from ADR-024.** A worker
   surfaces a decision by **returning** it; the driver relays via `AskUserQuestion` and **blocks on a
   real owner answer** — **no timer, no guess.** This is the *opposite* of ADR-024's declined
   silence-timeout auto-proceed: it **keeps** the owner in the loop and merely consolidates the channel
   into one session. ADR-024 is **not** reopened.

5. **Agent-closed marker by default** (owner ruling, honoring
   [ADR-025](adr-025-spawned-agents-may-invoke-the-task-movers.md)). Live-relay checks *decisions*, not
   *done-ness*; so a loop close carries `✅ Done (agent-closed — not owner-verified)` **unless the loop
   explicitly stops and the owner verifies.** The marker states exactly what was and was not checked.

6. **Degraded runs and cancellations stop for the owner.** No Codex pass after retries, red
   verification, or an unresolved residual → **do not self-close**, put the close to the owner
   (mirroring `fkit-task-ship-loop/SKILL.md:154-161,224`). **Never self-cancel** — `cancelled/` is
   audited by nobody (ADR-025 §Consequences); a cancel always stops and asks.

7. **The plan/build split is mandatory** — it is the only thing standing in for plan mode's write-wall
   on this path (ADR-031's honesty clause). The "plan only, write nothing yet" worker prompt is
   **prose-enforced**, and that limit is accepted, not hidden.

8. **Stop-hook interaction.** When [ADR-030](adr-030-stop-hook-enforces-turn-completion-contract.md)'s
   `Stop` hook is built, `fkit-sprint-ship-loop` **joins `/fkit-task-ship-loop` in its Decision-7 skip
   set** — a long autonomous driver's idle turns must not be forced to carry a "What's next?" footer.
   (Relay turns use `AskUserQuestion`, so they satisfy the hook's check A regardless.) Until that hook
   ships, this is prose only — noted so it is not forgotten.

## Amendment — 2026-07-22, owner ruling: the two sprint-loop source-write carve-outs

**Read Decision 3 together with this block, not on its own.** Decision 3's drive sequence assumes the
spawned coder can *write source* at the **Build** and **Process-review** steps. By default it cannot:
`claude/agents/fkit-coder.md:29-32` makes a spawned coder **refuse** to implement — *"nobody is there to
approve it"*. Task **0111**'s review found this **whole in round 1** and resolved it **in two halves**.
**R1** named both steps — *"spawns `@fkit-coder` to **implement** (Build) and to **apply fixes**
(Process-review)"* (`ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/review.md:21`;
disposition at `:34`). The Build half was carved out first; **R4** (round 2) reopened the remainder,
opening *"**R1's Process-review half is not resolved.**"* (`review.md:24`; resolution at `:45`). The
defect was never Build-only. The owner ruled four things on **2026-07-22**; they are
recorded here because `claude/agents/fkit-coder.md:60-61` already cites *"[ADR-032] Decision 3 + its
2026-07-22 autonomy amendment"* — **this is that amendment.** (Ruled 2026-07-22, written 2026-07-26 as
task 0118. The four-day gap is recorded, not hidden: the ADR carried the citation before it carried the
text.)

**A1 — the Build-worker carve-out.** A coder **spawned by `/fkit-sprint-ship-loop`** MAY write source,
but **only** under the loop's **declared-approval marker** — **all three** of: (a) the spawn prompt
identifies the caller as `fkit-sprint-ship-loop`; (b) it carries the concrete **approved plan** verbatim;
and (c) it states the owner **approved that plan** via a live `AskUserQuestion` relay in the driver
session. On this path the refusal's own rationale is satisfied: the owner approved in the **driver's**
session before the worker was spawned. **The approved plan is both the standing approval and the scope
boundary** — the Build worker implements only that plan and returns `NEEDS-DECISION` for anything outside
it. Worker side: `claude/agents/fkit-coder.md:60-72`. Driver side (the obligation to *construct* the
marker on **both** spawn prompts): `claude/skills/fkit-sprint-ship-loop/SKILL.md:109-115`.

**Everything without the marker still refuses** — including **this loop's own plan-only spawn**, which
carries no approved plan and says *write nothing yet* (`claude/agents/fkit-coder.md:89-91`). That
refusal — **itself prose, like everything else on this path** — is what keeps Decision 7's plan/build
split meaningful: the carve-out opens the Build and Process-review steps, **not** the plan step.

**A2 — the Process-review-worker autonomy (owner-ruled option (b)).** Decision 3's Process-review step
runs under the **same** marker and the **same** standing approval, and applies fixes **without per-fix
owner approval**, on exactly
[ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)'s task-loop discipline:
write a fix without asking **only if** it is verified `CORRECT`, mechanical/localized, and **inside the
approved plan** (or an obvious winner within the plan's intent); **stop and return `NEEDS-DECISION` for
every judgment call** — a frontier-move, a regression or review oscillation, a disputed severity that
changes scope, a broad/behavior-changing fix, or anything outside the plan
(`claude/agents/fkit-coder.md:73-82`; driver side `SKILL.md:118-121`).

**ADR-019's audit obligation transfers with its permission — it is part of "exactly the same
discipline."** ADR-019 `:96` makes the autonomy conditional on auditability: *"Every autonomous choice —
every obvious winner — is recorded in the task's worklog decision-log (ADR-020) so it is auditable."*
That applies here: the Process-review worker **MUST record, in the task's worklog, each fix it applied
without asking and each obvious-winner call it made**, so what the loop did unattended is inspectable
afterwards. This is not decoration — **A4 bullet 2's reopening condition is unsatisfiable without it**,
because nothing else on this path records what was applied autonomously. ADR-019 `:148-150` also names
the obvious-winner self-classification *"the sharpest edge"*; that accepted cost transfers unchanged.

> **Stated as a requirement, not yet true of the implementation.**
> `claude/skills/fkit-sprint-ship-loop/SKILL.md:105` currently asks the Process-review worker only for
> *"change surface + residuals"*, and `claude/agents/fkit-coder.md:73-82` imposes no worklog obligation.
> Carrying this requirement into the driver-side SKILL is a **follow-up for the coder**, tracked
> separately. Recorded here so the gap is visible rather than assumed closed.

This makes the sprint loop the **second** standing-approval exception to
`fkit-process-stateful-review`'s *"explicit approval every round"* gate; the task loop (ADR-019) is the
first. **Nowhere else** — any genuinely outside-a-loop spawned or pasted-in review still gates every
round, and `fkit-process-stateful-review` is **byte-unchanged**
(`claude/agents/fkit-coder.md:51-58`).

*Why **some** repair was mandatory — though not necessarily this one:* R4 established that the
Build-only carve-out left post-review fixes with **no authorized writer at all** — a task with any valid
review defect either stalls or gets written in violation of the coder's contract (`review.md:24`). That
forced *a* fix; it did not force *this* fix. The narrower alternative below would also have closed it.

*The history, recorded because the guard below depends on it:* R4 offered an option **(b)-alternative** —
the driver relays every accepted fix for owner approval and re-spawns a Build-type worker, needing no
further guarantee-surface change — and **the coder recommended that narrower option**
(`ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/worklog.md:82-87`, where it is labelled
option (a); note R1 used the same letter for a different option, so read by content, not by letter).
**The owner overrode that recommendation and ruled the broader (b)** (`review.md:45`).

*The supporting argument, stated at its true strength — this amendment does not certify it as verified.*
The architect argued at the time that **(b) is a smaller write surface than the Build carve-out already
granted**, and on most axes that holds: same three-signal marker, same approved-plan boundary, plus
ADR-019's stop-on-judgment discipline; it removes a per-fix relay **inside** a boundary Build already
had. **But it is not a strict subset, and this amendment's own text carries the counterexample.** A1
bounds the Build worker to *"only that plan"*, `NEEDS-DECISION` for anything outside it (`:100-102`); A2
additionally admits *"an obvious winner within the plan's intent"* (`:114-115`) — and **intent is wider
than the plan**. On that one branch A2 permits a write A1 would refuse. The round-3 model-diverse review
(`review.md:95-102`, esp. `:99`) reached "strict subset" only by describing the surface as *"in-plan
CORRECT mechanical fixes only"*, **which drops the obvious-winner branch**; it is cited here as the
record of what was argued and checked, **not** as proof of the subset claim. The asymmetry is inherited
from `claude/agents/fkit-coder.md:71-72` vs `:76-77` — the amendment did not introduce it, and does not
certify it away.

**None of this reopens A2.** The owner ruled option (b) knowingly, with the narrower alternative in
front of him; that ruling stands exactly as made. What is corrected here is only this record's
overstatement of the argument for it.

**A3 — the accepted cost, stated plainly: this is trust, not proof.** The declared-approval marker is
**three prose signals in a spawn prompt.** A worker **cannot verify** from its own context that the owner
approved anything — the owner channel is session-only
([ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md)) and there is **no
cross-context token to check**. A confused or injected driver prompt could assert the marker falsely and
**nothing structural stops the write.** This is the **same** cost the owner accepted for the plan/build
split (Decision 7 / [ADR-031](adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)'s honesty
clause, `:83-98`) — which is to say **both are unenforced**, not that either is safe; it is one more
prose-enforced ordering on a path that already has one, not a second, novel kind of exposure. **The owner
accepted it knowingly (2026-07-22).**

It is recorded here so **no future reader mistakes the carve-out for a structural guarantee.** It is
**not hook-enforced** (contrast [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md)
§Decision 1 `:42-46`, which *is*), there is **no token**, and there is **no detection** — a false marker
leaves no trace anything checks. Owners who want the structural write-wall for a given task still ship it
the old way: `fkit coder` + `/fkit-task-ship-loop`, where plan mode is a real session write-wall. **Do
not rewrite this paragraph into a guarantee.**

**A4 — do-not-re-raise guard.** A finding that merely **restates** A3's cost is a **closeout, not a
defect** (matching the accepted residual already agreed at `review.md:68-75`, whose controlling sentence
is `:75` — *"a finding must show it failing in practice"*). Specifically:

- Do **not** re-raise *"the declared-approval marker is only prose / unverifiable / forgeable"*. Named and
  accepted in A3. **Re-raise only if** a source write is found to have happened on this path **without a
  real owner plan approval** — evidence of failure in practice, not of the shape. *How it would ever be
  found, since A3 says there is no detection:* **out of band, by the owner** — they are in the relay loop
  and would recognise a build against a plan they never approved. That channel is the only detection
  there is, and it is a person noticing, not a check. **This guard is narrow, not unreopenable.**
- Do **not** re-raise *"the Process-review worker applies fixes without per-fix owner approval"* as a
  consent-model hole. Owner-ruled option (b), over the coder's narrower recommendation. **Re-raise only
  if** a loop-applied post-review fix is later found **wrong or out-of-plan** (A2's worklog record is what
  makes that checkable) — then reconsider A2's autonomy; do **not** patch `fkit-process-stateful-review`.
  *Scope note:* the source residual says *"do not patch the coder skill"* (`review.md:73-74`) — it does
  **not** shield `claude/agents/fkit-coder.md`; a defect in the agent def is bullet 4's path, not
  something this bullet forbids.
- Do **not** re-raise *"relaying every fix for owner approval is safer, use that instead"*. Offered,
  recommended by the coder, **declined by the owner**. **Re-raise only** with the evidence in the bullet
  above.
- Do **not** re-raise *"a spawned coder must never write source"*. Reversed on this **one** path only.
  **Re-raise only if** a spawned coder is found writing source **without all three marker signals** — that
  is a leak of the carve-out and a real defect.
- Do **not** re-raise *"(b) widened the coder's authority"* **as a settled-tradeoff complaint** — the
  owner ruled option (b) knowingly and that is not reopenable by argument. **Re-raise with either:**
  (i) a **write that actually occurred** on this path which (b) permitted and the Build carve-out would
  have refused; **or** (ii) **a textual demonstration** — a specific passage of
  `claude/agents/fkit-coder.md` or the driver SKILL showing the Process-review surface reaching past
  Build's, **quoted, with the widening clause identified**. The claim was settled by reading, so it must
  stay answerable by reading — a later edit that quietly widens the surface has to be raisable **before**
  it causes a bad write. What does **not** qualify either way: a bare desk argument that re-litigates the
  tradeoff without quoting the text or exhibiting the write. **The obvious-winner branch is already
  conceded above and is not a re-raise** — it is recorded, not disputed.

**What this amendment does not change.** Decisions 1, 2, 4, 5, 6, 7 and 8 stand as written. Decision 7 in
particular is **reinforced, not superseded** — A3 is the same cost applied one step later in the drive
sequence. (Decision 3's *close* step is separately amended by ADR-033: the driver spawns
`@fkit-producer` to close and does not run the movers itself.)

## Options considered

- **A new lead-owned driver that spawns workers per step (chosen).** The only feasible shape given the
  task loop's spawned-invocation refusal and the session-only owner channel. Reuses the task loop's
  *rigor* (stateful review, verify budget, degraded-run conservatism) without reusing its session-bound
  machinery.
- **Wrap `fkit-task-ship-loop` (spawn a coder, run the loop).** Infeasible: the loop refuses spawned
  invocation and has no owner channel. This is *why* the sprint loop is a new driver.
- **Owner-verify every task close.** Offered; **declined** by the owner in favor of the agent-closed
  marker by default — stronger guarantee, but per-task interruptions the owner did not want. Recorded so
  the weaker-close posture is a knowing choice.
- **Timed auto-proceed so the loop never blocks.** Declined per ADR-024; live-relay is the deliberate
  alternative.

## Consequences

- **Positive:**
  - A whole sprint ships from one session, with the owner answering only real decisions.
  - Reuses `dashboard.sh` for deterministic task selection and the existing stateful-review rigor.
  - `fkit-task-ship-loop` and every role stay untouched; the change is additive and opt-in by name.
- **Negative / costs — stated plainly:**
  - **The plan-gate is prose on this path** (Decision 7 / ADR-031 honesty clause). Accepted.
  - **The agent-closed marker is invisible in `/fkit-status`** (ADR-025 §A3: `dashboard.sh` collapses it
    to plain `done`). A sprint driven end-to-end can turn a board green with **no surfaced signal** that
    no human verified any task — an **amplification** of ADR-025's accepted cost across many tasks at
    once, not a new defect.
  - **Orchestrator context accumulates over a sprint** (ADR-031 §Consequences).
- **Residual risks / "re-raise only if":**
  - **An agent-closed task shipped by the loop is found incomplete** — evidence the default-marker
    posture costs real quality (ADR-025's own re-raise shape). Reopen Decision 5 (consider owner-verify),
    do not patch the mover.
  - **The `/fkit-status` invisibility (ADR-025 §A3) proves painful at sprint scale** — a spot-check
    finding many silent agent-closes is the trigger to surface the marker in the dashboard.
  - **The live-relay round-trip is measured to not reliably deliver a worker's `NEEDS-DECISION` return
    to the driver** (design report §13 probe #2) — that is an implementation defect against this ADR, fix
    the loop; it is not grounds to revisit the model.
  - Do **not** re-raise *"the sprint loop should just call `fkit-task-ship-loop`"* — infeasible, this ADR
    records why.
  - Do **not** re-raise *"add a timeout so it doesn't block"* — declined (ADR-024), and live-relay is the
    chosen alternative.

## Related

- [`reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
  §5 (contract), §5.3 (relay gate), §5.4 (stop table), §9.4 (close honesty), §13 (test/probe plan).
- [ADR-031](adr-031-fkit-lead-becomes-the-orchestrating-front-door.md) — the conductor this applies.
- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) /
  [task loop SKILL](../../../claude/skills/fkit-task-ship-loop/SKILL.md) — the task-scope loop whose
  rigor this reuses and whose session-bound machinery it deliberately does not.
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — why workers return, not ask.
- [ADR-024](adr-024-ship-loop-owner-question-timeout-is-not-built.md) — the declined auto-proceed;
  live-relay is the opposite.
- [ADR-025](adr-025-spawned-agents-may-invoke-the-task-movers.md) — the agent-closed marker and its
  `/fkit-status` invisibility this loop amplifies.
- [ADR-030](adr-030-stop-hook-enforces-turn-completion-contract.md) — the Stop-hook skip set this loop
  must join when that hook is built.
- Code: `claude/skills-for-role.sh:37`, `claude/skills/fkit-status/dashboard.sh`,
  `claude/skills/fkit-task-ship-loop/SKILL.md`.
- `claude/agents/fkit-coder.md:51-58,60-91` — the declared-approval-marker carve-out the §Amendment
  authorizes (tracked as its own reviewable unit by task 0119).
- `claude/skills/fkit-sprint-ship-loop/SKILL.md:109-121` — the driver-side rule that constructs the
  marker on **both** the Build and Process-review spawn prompts.
- `ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/{review.md,worklog.md}` — R1/R4, the
  owner's option-(b) ruling, and the accepted residual (`review.md:68-75`) the §Amendment's guard
  formalizes.
- **Wiki:** **fkit-wiki** should ingest this ADR — an architect never writes the vault.
