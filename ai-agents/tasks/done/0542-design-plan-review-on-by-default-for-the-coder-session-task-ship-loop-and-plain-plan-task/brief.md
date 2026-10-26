# Design plan review on by default for the `fkit coder` session, `/fkit-task-ship-loop` and plain `/fkit-plan-task`, with an opt-out (provisional owner ruling)

## ID
0542

## Sprint
Sprint 12

## Priority
P12

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

**Where this comes from.** Task `0541` makes plan review the default in `/fkit-sprint-ship-loop` runs,
with an opt-out parameter. Its plan
([`plan.md`](../../done/0541-make-plan-review-the-default-for-the-sprint-loop-with-an-opt-out-parameter/plan.md),
§1 and decision D1) puts the default **in the sprint-loop driver only**: `fkit-plan-task`'s gate still
runs plan review only when the driver's switch line is present, so the `fkit coder` session,
`/fkit-task-ship-loop` and a plain `/fkit-plan-task` stay without plan review. At `0541`'s plan gate the
owner asked for more than that — plan review on by default on **all** paths — and for that wider part to
be designed in a separate task first. This is that task.

**The owner's rulings — his selected options, verbatim** (via `AskUserQuestion`, 2026-10-24, about
14:19–14:25 UTC, `fkit lead` session, relayed verbatim by `fkit-lead` to a spawned `fkit-producer`):

- At `0541`'s plan gate, *"Q1 — Where should plan review be on by default?"* — selected option text,
  verbatim: *"All paths"*. Description he saw: *"Needs a separate design task first; this task ships only
  the sprint-loop part."*
- *"Where should the follow-up task (design plan review as default for the other paths) go?"* — selected
  option text, verbatim: *"Sprint 12 (Recommended)"*. Description he saw: *"Waits on 0541 in the same
  sprint, so this run can pick it up after 0541 ships. Nothing else waits on it."*

**This is provisional.** The owner's final decision on plan review comes after he has used the new fkit
on real projects for some time — his own words are in `0541`'s brief, *Context*, and in the trial
summary
[`2026-10-24-plan-review-trial-summary.md`](../../../knowledge-base/reports/2026-10-24-plan-review-trial-summary.md)
§9. Whatever this task designs must keep an **opt-out** on every path, with the same idea as `0541`'s:
the old no-plan-review path stays and keeps working exactly as it does today, selectable when the owner
asks for it.

**Locked decisions this touches.**

- **ADR-056 Decision 3** — *"Session paths are unchanged"* (owner, 2026-10-06: *"Sprint-loop runs only
  (Recommended)"*): `fkit coder` sessions, `/fkit-task-ship-loop` and a plain `/fkit-plan-task` *"behave
  exactly as today"*. **That stays true until this work lands.** The 2026-10-24 *"All paths"* ruling is
  the new owner ruling that will change it — but only once a design is approved and built, not by filing
  this brief.
- **ADR-059** (being recorded now by fkit-architect for `0541`; not yet present when this brief was
  filed) will state the owner's all-paths intent. This task builds on it and must not contradict it.
  Check ADR-059's final text before starting.
- **ADR-056 *Options considered*** rejected a per-task field partly because *"the session path has an
  untested interaction with plan mode (whether a spawned adversarial reviewer can write `.fkit/tmp/`
  under it is unverified)"*. **That is still unverified** (as of 2026-10-24) and is the first unknown
  this task must settle — see *What to build* §1.
- **ADR-056 *Consequences*** tells reviewers not to re-raise *"should cover sessions"* as a defect,
  because it is an owner decision. The owner has now made it; this task is where it is designed.
- **Codex is optional** ([ADR-054](../../../knowledge-base/decisions/adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode.md)).
  On by default in a session means a project without Codex gets a Claude-only plan pass, flagged *NOT
  model-diverse*, on every plan in every session.

**Why this is a design task, not a build task.** Meaningful unknowns remain — feasibility (plan mode vs
the Codex temp file), and where the switch, the opt-out and the `plan-review.md` record live when there
is no driver. Per the producer's investigation-first rule, this brief scopes the **design and the owner
decision only**. The build is filed as separate brief(s) **after** the owner has reviewed the findings —
see *Notes*.

**Why the owner is fkit-architect.** The work is a feasibility probe, a design across three entry
points, and an ADR — the architect's seat ("designs, never implements"). The architect wrote ADR-056
and is writing ADR-059, so it holds the context. The build that follows goes to `fkit-coder`.

## What to build

1. **Settle the plan-mode question, with evidence.** `fkit-plan-task` runs in plan mode
   (`EnterPlanMode`), which blocks `Write`/`Edit` until the plan is approved. Find out, by a real probe
   rather than by reading docs, whether a subagent spawned while plan mode is on — the
   `fkit-adversarial-reviewer` running Codex, and the producer/architect approvers — can write the files
   they need (Codex's temp file under `.fkit/tmp/`, any review output). Record what was run and what
   happened. If the probe cannot be run, say so and mark the question **not settled** — never assume an
   answer. The probe must not change any shipped file under `claude/`.
2. **Design plan review on by default for each of the three paths** — the `fkit coder` session,
   `/fkit-task-ship-loop`, and a plain `/fkit-plan-task` — with an opt-out on each. For each path, say
   what turns plan review on, how the owner opts out, who writes the `plan-review.md` record, how the hop
   budget works (ADR-010 Decision 7), what the owner sees, and what happens without Codex. Where a path
   is not feasible, say so with the evidence from §1. **Leave the choices open where they are the
   owner's** — set out the options and a recommendation, do not decide them.
3. **Keep the old path reachable on every path.** The design must show how a session or run with the
   opt-out behaves exactly as today — matching `0541`'s opt-out idea, and where it makes sense its
   parameter name.
4. **Write it up** as a design spec or approach comparison in `ai-agents/knowledge-base/reports/`
   (`/fkit-design-spec` or `/fkit-evaluate-approach`, the architect's choice). Never the wiki.
5. **Put the open questions to the owner** (through the driver or a session — the architect has no owner
   channel when spawned) and record his answers verbatim, with date and channel.
6. **Record the approved design** in the ADR set — a new ADR or an amendment to ADR-059, the architect's
   call — saying which part of ADR-056 Decision 3 it changes. Existing ADR text stays byte-identical
   (additions only), per ADR-056's correction convention.
7. **Propose the build split** — which build brief(s) the producer should file (for example one per
   path, if each can ship and be tested on its own), in dependency order. The producer files them; this
   task does not build anything.

## Verification steps

1. The report exists under `ai-agents/knowledge-base/reports/` and covers all three paths, each with a
   verdict: feasible / feasible with a condition / not feasible, and the reason.
2. The plan-mode probe (§1) is recorded: the steps run, what was observed, and the conclusion — or it is
   marked **not run**, and the question **not settled**, never passed.
3. For every path, the report names the opt-out and shows the opted-out behaviour is today's behaviour.
4. Each owner question carries his answer verbatim, with date and channel; any question he did not answer
   is listed as open.
5. The ADR (new, or an amendment) exists for the approved design; `git diff` on existing ADRs shows
   additions only.
6. `git diff -- claude/` is empty — this task changes no shipped skill, agent or script.
7. The report ends with the proposed build split (brief titles, owners, `Depends on:` order) ready for the
   producer to file.

## Notes

- **Depends on:** 0541
- **Blocks:** nothing
- **Why it depends on 0541:** the session-path design should reuse `0541`'s opt-out parameter and
  ADR-059's wording, and `0541`'s shipped `fkit-plan-task` gate (plan decision D6) is the thing this
  design extends.
- **Knock-on of placing it on Sprint 12:** it waits on `0541`, which is in the same sprint (`🔄 In
  progress`), so it does not wait on a later sprint. No open task waits on `0542` — per the owner's
  option description, *"Nothing else waits on it."*
- ⚠️ Priority P12 is append rank, NOT a merit ranking — flagged for owner confirmation.
  **On merit this belongs directly below 0541**, because it depends on `0541` and is the second half of
  the same owner ruling. Append rank and merit fall in the same place.
- **The build is not in this task.** The lead's request read *"design (then, if feasible, implement)"*;
  this brief scopes the design and the owner decision only (investigation-first, and the owner's own
  option text: *"Needs a separate design task first"*). Build brief(s) are filed by the producer from §7's
  proposal once the owner has reviewed the findings.
- **Open questions** (listed, not resolved — the design sets out options, and the owner decides where
  marked):
  1. **Plan mode vs the Codex temp file.** Can a subagent spawned under plan mode write `.fkit/tmp/`?
     Does plan mode's write wall reach spawned subagents at all? (Unverified — §1.)
  2. **What turns it on without a driver.** Today `fkit-plan-task`'s gate runs only on a driver's switch
     line, and *"nothing else turns it on"*; a brief is not the switch. With no driver, does
     `fkit-plan-task` default on by itself, and does the *"a brief is not the switch"* rule still hold?
  3. **The opt-out's form on each path** — a skill argument (on `/fkit-task-ship-loop` and
     `/fkit-plan-task`), something the owner says in a `fkit coder` session, or a launcher option — and
     whether it shares `0541`'s parameter name. Owner approves.
  4. **Who writes `plan-review.md`** when there is no driver, given plan mode blocks writes until the plan
     is approved.
  5. **The owner is present in a session.** Does he still want the agents to approve before he sees the
     plan, and how much of their review should he see (the trial summary notes he found it hard to judge
     because it all happened *"behind the scene"*)? Owner's call.
  6. **What a session reports** when plan review is on, and when it is opted out (ADR-056's Q3 ruling set
     this for the sprint loop only). Owner's call.
  7. **Cost and wait.** In a live session the owner waits through the approver and Codex rounds (2-round
     cap, ADR-056 Decision 4). Is that acceptable on every plan?
  8. **Codex-less projects** — every session plan gets a Claude-only pass, flagged. Acceptable as the
     default for consuming projects, or should it change there?
  9. **ADR form** — a new ADR or an amendment to ADR-059. Architect's call.
- **Classification hint, not a ruling:** this changes what fkit delivers to its users (session
  behaviour), so under ADR-056 Decision 1 it reads as a **product change** if it is itself planned with
  plan review on.
- **Wiki:** once the design ADR lands, `fkit-wiki` should ingest it and the report. No other role writes
  the vault.
- **Filed 2026-10-24** by a spawned `fkit-producer` (no owner channel, ADR-021) at `fkit-lead`'s
  direction, on the owner rulings quoted in *Context*, relayed verbatim. ⛔ No commit.
