# Decide whether fkit needs a dedicated e2e-tester agent

## ID
0024

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

**This is a decision task. Its deliverable is a ruling — not code, and not a tester agent.**
If you are reading this as *"go build the tester,"* stop: nothing has been decided, and the first thing
this task must produce is the owner's answer to a question, not a diff.

Sprint 2's release gate (task 7, `ai-agents/tasks/done/verify-onboarding-flow-end-to-end.md`) forced
fkit-coder to verify its own work. It couldn't credibly do so and split verification into a mechanical
phase (itself) and a judgment phase (the owner, by hand, in live sessions). That split was ad hoc. The
owner asked whether fkit should gain an **8th role: a dedicated e2e-tester** that can drive a terminal
and/or a browser and judge whether a use-case actually works — thinking about **fkit as a product used
on other projects**, not about fkit's own repo.

The question was worked through on 2026-07-13 by the owner, fkit-coder, fkit-architect (design consult)
and fkit-producer (product consult). **All of the analysis is already done and recorded in full:**

> 📄 **Primary reference — read it before doing anything else:**
> [`ai-agents/knowledge-base/reports/2026-07-13-tester-agent-evaluation.md`](../../../knowledge-base/reports/2026-07-13-tester-agent-evaluation.md)

That document holds the question, the observed hole, the product read, the design read, the arguments
both consults **explicitly killed** (do not re-raise them), the two load-bearing technical facts, the
flip condition, an epistemic caveat, and the 7 open questions. **This brief deliberately does not restate
it.** Do not re-derive the argument — the whole point of the write-up was that it would not have to be
re-derived.

### ⚠️ No decision has been made

The architect and the producer both recommend **against** an 8th role — a reviewer-owned `/fkit-validate`
skill instead. **That is a recommendation. The owner has not ruled.** This task exists precisely because
the decision is still open. A future session that treats "no 8th role" as settled has misread both this
brief and the source document.

### ⚠️ It conflicts with a locked constraint — say so out loud

`ai-agents/knowledge-base/PROJECT.md` states: *"Stage: Prototype … hardening/polish is the current focus,
**not breadth**."* **An 8th role is breadth.** The owner may supersede his own constraint — but if the
ruling goes that way it must be an **explicit, recorded reversal**, not a drift. Whichever way it lands,
the artifact must name the constraint and say what happened to it.

### ⚠️ The flip condition — carry it forward, do not lose it

There is exactly one argument that beats the architect's, and it beats it cleanly:

> **Sandbox-authority divergence.** If validation turns out to need a **permission envelope you would not
> grant the reviewer** — a network-enabled, write-enabled, permissive sandbox to run an untrusted app —
> then the tester **does** hold a unique authority (a *sandbox* authority), and by the architect's own
> authority argument **it earns a seat.**

This is not a footnote. It is the re-raise clause, and it must survive into whatever artifact this task
produces. *"Watch for it the first time you write `.fkit/validate` for a real app."* — fkit-architect

## What to build

**No source code. The deliverable is a ruling, plus the record of it.**

1. **Put the 7 open questions to the owner** (they are in §*Open questions* of the evaluation doc). They
   are the real payload of this task. **Question 1 is the one that decides the whole scope:**

   > *Do you want to **talk to** a tester (a **seat**), or is it enough that verification happens
   > automatically inside review (a **capability**)?*

   Every other question is downstream of that one. Ask it first, and do not let the discussion move on
   until it is answered. Q6 (*do you intend to supersede your own "not breadth" constraint?*) is the
   second gate.

2. **Record the ruling as an ADR** in `ai-agents/knowledge-base/decisions/` — **whichever way it goes.**
   The durable, re-litigable artifact is the record, not the outcome. Per the architect: *"without this
   ADR, 'should we add a tester?' comes back every sprint."* The ADR must contain, at minimum:
   - the ruling and the authority-boundary reasoning behind it;
   - what happened to the `PROJECT.md` "not breadth" constraint (upheld, or explicitly reversed);
   - the **re-raise clause** (the sandbox-authority divergence above), so a future owner knows exactly
     what evidence would legitimately reopen this;
   - a pointer back to the evaluation doc as the underlying record.

3. **Only then, scope the follow-on work** — as new task briefs, filed separately, not inside this one.
   What those briefs are depends entirely on the ruling; see *Notes → Dependents*.

**Author: fkit-architect** (ADR authority), on the owner's ruling. The ADR is the architect's to write;
**the ruling is the owner's and no agent's.**

## Verification steps

- The owner has explicitly answered **Q1** (seat vs capability) and **Q6** (breadth constraint), on the
  record — not inferred by an agent from the recommendation.
- An ADR exists in `ai-agents/knowledge-base/decisions/` recording the ruling, the constraint
  disposition, and the re-raise clause.
- `ai-agents/knowledge-base/reports/2026-07-13-tester-agent-evaluation.md` has its **Status** line updated from
  *"⚠️ NO DECISION MADE"* to point at the ADR. (It stays as the underlying record; it is not rewritten.)
- **No tester agent, no `/fkit-validate` skill and no code was written by this task.** If a diff exists,
  this task was executed wrongly.

## Notes

- **Owner: the OWNER.** This is a product/architecture direction call that belongs to him. Agents can
  prepare it, frame it, and record it — **agents cannot settle it between themselves.**
- **This task can be picked up cold.** It needs no investigation phase: the investigation *is* the
  evaluation doc. What it needs is 30 minutes of the owner's attention, which is precisely what was not
  available on 2026-07-13.
- **Do not re-open the killed arguments.** The evaluation doc lists five (*"it's thin for a whole role"*,
  *"the coder writing its own tests is self-certification"*, *"new tools need a new seat"*, *"isn't this
  the adversarial reviewer?"*, and *"testing feels like a different job"*). They were each examined and
  killed with reasons. Re-litigating them wastes the owner's time — which is the scarce resource this
  whole task is waiting on.
- **Discount the convergence.** The architect and producer agreed, but **fkit-coder briefed both** — some
  of that agreement is its framing echoing back. The evaluation doc names which arguments carry
  independent weight; weigh those, not the headcount.

### Dependents — do not file these yet

- **B1 — bare-subagent investigation** (*can a plain subagent, given only Bash + Playwright, actually
  drive and judge an app well enough to be worth a seat?*). This **only makes sense after the owner
  answers Q1.** If Q1 lands on *capability*, B1 is moot. Filing it now would be scoping implementation
  ahead of a decision.
- **Whatever the ruling implies** — a `/fkit-validate` skill on the reviewer, or an 8th role's agent
  definition + skill lockdown + launcher wiring. Both are substantial; both are premature. **Blocked on
  this task.**

### Not a dependent — explicitly independent

**fkit's own CI gap is not blocked on this ruling and must not be bundled into it.** It is filed
separately as `add-e2e-smoke-script-for-fkit-itself.md`. The rationale is on the record and is worth
repeating, because it was nearly got wrong once already:

> *"The script protects **fkit's own regressions**; the tester verifies **a change in a consuming
> project**. Different users, different jobs — **building the script will teach us almost nothing about
> whether the tester earns its seat.** The honest rationale is simpler: CI first because it's the bigger
> risk and it's cheap — **full stop, not as an experiment.**"*

Do not treat the smoke script as a probe for this decision, and do not hold it hostage to this decision.

## Open questions

All 7 are in §*Open questions* of
[`2026-07-13-tester-agent-evaluation.md`](../../../knowledge-base/reports/2026-07-13-tester-agent-evaluation.md).
They are **for the owner**, and they are the substance of this task rather than a coda to it. Restated
here only so this brief cannot be picked up without seeing them:

1. **Seat or capability?** *(decides the whole scope — answer this one first)*
2. Is fkit used on any other project today, by anyone?
3. Terminal-only v1, or is the browser the point? *(these may be two products)*
4. Sign off on the restated source-write invariant (*"source includes test code"*) + the gitignored
   ephemeral-driver carve-out?
5. Is `.fkit/validate` the right pluggability boundary, or a first-party browser integration — at the
   cost of the `curl | sh` promise?
6. **Do you intend to supersede your own "seven roles, not breadth" constraint?** *(second gate)*
7. Sequencing: CI task before `/fkit-validate`, or in parallel?
