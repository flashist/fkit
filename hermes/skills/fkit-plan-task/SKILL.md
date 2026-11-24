---
name: fkit-plan-task
description: >-
  Read a task file and produce a concrete implementation plan before any code is written. The plan
  should account for realistic edge cases, including non-obvious but plausible failure modes, where
  they could materially affect implementation, correctness, or testing.
---

# Plan Task

> ## ⛔ Owner: the **coder**
> This is the fkit-coder's own procedure. Execute it **only** if you are the coder — running as the
> `fkit-coder` agent or in a `fkit coder` session.
>
> **Any other role: do not execute this.** Ask instead:
> ```
> @fkit-coder Plan this task: <path>
> ```

## Overview

Use this skill to turn a task file into a
concrete implementation plan **without making code changes**. The goal is to gather the necessary
context, identify the likely work areas, and present a step-by-step plan for approval before
implementation begins.

**Argument:** `$ARGUMENTS` — the path to the task file (e.g.
`ai-agents/tasks/backlog/0042-add-export-endpoint/brief.md`), optionally followed by
`--no-plan-review` (no plan review for this plan) or the no-op `--plan-review`. Both together, or any
other `--` token: stop before planning and ask the owner (`clarify` in a session; spawned,
return the question). The flag changes what work this step does, so it is an operand, not an output
variant ([`conventions/one-skill-one-output.md`](ai-agents/knowledge-base/conventions/one-skill-one-output.md)).

## Workflow

1. **Plan only.** Read the brief and gather evidence. Wait for explicit owner approval before any project edit, including persisting the plan. The reviewer may use its private scratch prompt.
2. Read the task file — the path in `$ARGUMENTS`.
3. **Gather wiki context.** If the task touches areas the wiki may cover, follow the read-only
   query procedure in `skill_view(name="fkit-query")` against `ai-agents/wiki-vault/` and use
   its answer as ground truth for existing decisions and constraints. Invoke the fkit-wiki agent
   only if the lookup genuinely needs deeper multi-step research.
4. Read any files referenced by the task, including specs, related tasks, and knowledge-base
   documents.
5. Identify the implementation scope, constraints, dependencies, risks, and likely validation steps.
6. Produce a concrete step-by-step plan.
7. Present the complete plan. In an owner session, use `clarify` and wait. In a delegated job, return the plan and open questions to the driver. Only a later Build handoff carrying the owner-approved scope authorizes implementation.

## Plan review switch

In an interactive coder session, review is on by default. Honor the owner launch setting in the opening message and a per-invocation `--no-plan-review`. In a delegated planning job, run this review only when the driver's handoff includes its plan-review switch line with board and run time. Report the effective choice before presenting the plan.

It runs **between Workflow steps 6 and 7** — after the plan is written, before you return or present
it. Decision records: [ADR-056](ai-agents/knowledge-base/decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default.md);
for sessions, ADR-060. Where a step below says **In a session**, that applies only under (b).
- **You still write nothing** — no source, no file. The approvers write nothing. The adversarial
  reviewer writes only its gitignored `.fkit/tmp/` prompt. During planning, `plan-review.md` comes only after
  approval (*6. Present*).
- **In a session, post progress lines:** one short chat line as each step returns, e.g. `Plan review:
  round 1 — architect APPROVE, producer CHANGES REQUESTED (2 points)`, and one for the Codex pass.
- **Hop check first (spawned).** If you were consulted at hop 2, you cannot consult anyone: skip the rest and
  return the plan with the loud flag `plan review not run — hop budget` at the top, then the record
  block (*6. Return*, below) holding only the switch line, the times (plan drafted, record returned)
  and `Problems: hop limit hit — plan review not run`.
- **Record UTC times as you go** (`date -u`): plan drafted, each ask and each reply, Codex start and
  end, record returned. In a session, also record when the plan was presented for approval.
- **Never quote a live plan pointer line** (`plan: <path>/plan.md  blob <hash>`) in an approver or
  Codex prompt — the carry-check hook may deny the spawn. A denied spawn is a problem to record.

### 1. Classify

**Classify the change in one line, with your reason.** "Product" means what this project delivers to its users.
- **Product change** — adds or changes what the project delivers: features, behaviour or output its users get. → the **producer and the architect** approve.
- **Code-only** — internal; what the project delivers stays the same: refactors, tests, tooling, infrastructure. → the **architect** approves.
- **Unclear** — you cannot tell which. → **both** approve.

If an approver disputes a code-only classification, treat the task as unclear and add the producer.

### 2. Ask

Spawn the assigned approvers (`@fkit-architect`, `@fkit-producer`) as consults, **in parallel**. Each
prompt carries:
- the brief path;
- the full plan, pasted;
- the classification and its reason;
- the hop line: *"You are being consulted at hop 2 of 2; chain: lead → coder → <role>."* **In a
  session:** *"You are being consulted at hop 1 of 2; chain: coder → <role>. You are a plan-review
  approver: answer from files and consult no one; put anything you cannot settle as an open
  question."*;
- the question: reply **`APPROVE`** or **`CHANGES REQUESTED`** on the first line, then numbered,
  focused reasons — no situation briefing.

A reply that is neither counts as `CHANGES REQUESTED (reply unclear)`. An approver's open question for
the owner goes into the plan's open questions; it blocks nothing unless the approver says it does.

### 3. Revise and re-ask — at most 2 revision rounds

First ask → revise (round 1) → re-ask → revise (round 2) → re-ask. **There is no round 3.**
- Re-ask **every** assigned approver each round, with the revised full plan and a list of the changes.
- You may decline a requested change, with your reason. If the approver still insists, that is a
  disagreement.

### 4. A disagreement still open after round 2 → the owner

Return **`NEEDS-DECISION`** carrying: the point in dispute; each side's reasons; the options (adopt the
change / keep the plan / other) with your recommendation; the draft plan; the record so far. **Do not
run Codex yet.**

The driver asks the owner, then re-spawns a plan-only coder with the switch line, the owner's ruling
quoted verbatim (date and channel), and the draft and record labelled *"draft as returned"*. **If you
are that coder:** apply the ruling, skip steps 1–3 (**no further approver rounds**), go on to step 5,
and return the record you were given with the ruling and your changes added.

**In a session** the owner is here: ask him directly with `clarify`, following
[`conventions/asking-the-owner.md`](ai-agents/knowledge-base/conventions/asking-the-owner.md) —
no `NEEDS-DECISION`, no re-spawn. Quote his ruling in the record with its date and the channel `fkit
coder session, clarify`, apply it (no further approver rounds), then go on to step 5.

### 5. Codex review — last

Spawn `@fkit-adversarial-reviewer`: *"Attack this plan"*, with the plan pasted inline, the brief path,
and the hop line (*"hop 2 of 2; chain: lead → coder → adversarial-reviewer"*; **in a session** *"hop 1
of 2; chain: coder → adversarial-reviewer"*). It runs its normal procedure — no plan-mode note, no
retry. It returns findings only.
- If the spawn fails or returns no usable findings: `plan review incomplete: Codex pass not run
  (<reason>)` (*Incomplete review*).
- If it fell back, its banner comes **first, verbatim** — relay it unchanged.
- Do not assign a coverage state; relay only its mode line.
- **The plan is not changed after Codex.** For each finding, add a separate one-line check: confirmed
  or disputed, with your evidence. The owner decides what a finding changes.

### 6. Return (spawned) or present (session)

The plan, then one block:

```
===PLAN-REVIEW RECORD BEGIN===
Switch line: <as received>
Times (UTC): plan drafted · each ask and return · Codex start / end · record returned
Classification: <product change | code-only | unclear> — <reason>
Round <n>: <approver> — <APPROVE | CHANGES REQUESTED> — <reasons>     (one line per approver per round)
Changes, round <n>: <what changed> — <why> — <which request it answers>
Disagreement: <none | the point, and the owner's ruling quoted with date and channel>
Codex: <mode line>; banner first if any; findings verbatim
Coder check: <finding id> — <confirmed | disputed> — <evidence>
Plan presented for approval: <UTC> (session only)
Owner revision: <his words quoted> — not re-reviewed                                (session, if any)
Problems: <none | a spawn denied or failed, a hop limit hit, a malformed reply>
===PLAN-REVIEW RECORD END===
```

**In a session**, present instead of returning — Workflow step 7 using `clarify`
with, in order: any banner (an incomplete-review flag, the reviewer's fallback banner) → `Plan review:
ON (default)` → the plan → three attachments (who approved, and the classification · what changed and
why · the Codex findings with your checks) → the full record block. Then:
- **Approved, with a task-folder brief:** before any other edit, append to
  `<task-folder>/plan-review.md` a `## Attempt N — <date>` section: the record block as shown,
  `Presented: <UTC>`, and `Owner decision: approved via clarify, <UTC>, fkit coder session`. This
  is a self-record — fidelity, not proof; the owner saw the same block at the gate. A failed write is a
  problem to report; the work goes on. `plan.md` is not written on this path.
- **No task folder** (inline work): no file. The presentation says `plan-review record: not persisted
  — no task folder`.
- **Rejected:** record nothing. Tell the owner the plan was rejected.
- **He asks for changes at the gate:** revise. The revision is **not re-reviewed** unless he asks; show
  it under the banner `revised after owner feedback — not re-reviewed`, and add the `Owner revision:`
  line. If he asks for a re-review, repeat the approval and Codex steps.

**Incomplete review:** if an approver or the Codex spawn could not run, return the plan anyway, with
`plan review incomplete: <what>` loudly at the top. Never present it as a reviewed plan.

## Planning Requirements

The plan should be specific enough that implementation can begin immediately after approval.

Include when relevant:
- likely files or subsystems to change
- sequencing of work
- dependencies or blockers
- testing and validation steps — the checks this change needs, by name: map the changed paths to the
  project's checks (its own "what changed → what to run" table if it has one, e.g. in
  `CONTRIBUTING.md`), following the project's own test rules; when unsure, plan the project's default
  test command — nothing beyond it. Name each new test file the plan adds, so the owner's approval
  covers it where the project's rules require one. The plan names which checks it will run and which
  it will skip, and why — a skipped check is not a passed one
- open questions or assumptions that could affect the implementation
- realistic edge cases and non-obvious but plausible failure modes that may affect implementation,
  correctness, or testing

## Guardrails

- Do not write or edit code while using this skill.
- Do not skip referenced documents if they materially affect the task.
- Do not present a vague high-level outline when the task file supports a concrete plan.
- If the task is underspecified, surface the missing details explicitly in the plan.

## Usage

Examples:
- `/fkit-plan-task ai-agents/tasks/backlog/0042-add-export-endpoint/brief.md`
- `/fkit-plan-task ai-agents/tasks/backlog/0043-fix-pagination-bug/brief.md`
- `/fkit-plan-task ai-agents/tasks/backlog/0043-fix-pagination-bug/brief.md --no-plan-review`
