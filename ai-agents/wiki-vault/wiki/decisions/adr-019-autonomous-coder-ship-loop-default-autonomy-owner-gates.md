# ADR-019: The coder's `fkit-task-ship-loop` is autonomous by default, gated only at plan-approval and the done-gate

**Date**: 2026-07-17
**Status**: accepted

**Amends (does not supersede)**: the coder's "owner present for the fix gate" contract in `claude/agents/fkit-coder.md` — narrowed for this one skill's context, unchanged everywhere else.

## Context
The owner asked for a coder skill that takes a task from brief to *done* with **minimal owner involvement** — *"I want to run the loop, get away from the computer, and be sure the coder makes their own decisions while I am absent — only important questions can and should be asked from me."* That collides with three settled facts: the coder's contract is **owner-present** (`fkit-coder.md`); the review fix gate is **per-round owner-approved** (`fkit-process-stateful-review`); and **done is owner-gated, anti-laundering** (task files move to `done/` only via the owner-invoked `/fkit-task-done`).

A first design tried to make the loop autonomous by narrowing `fkit-process-stateful-review`'s gate "for the loop context" via a cross-skill note. A **Codex adversarial pass** (model diversity intact) killed it: there is **no runtime-authenticated signal for "loop context,"** so the note either loses to the skill's self-contained hard rule or is claimable by any standalone invocation — and a `CORRECT` verdict certifies a finding's accuracy, **not** that its fix is mechanical. Full analysis in the design spec (`reports/2026-07-17-design-task-ship-loop-skill.md`, rev 3, owner-approved).

## Decision
**`fkit-task-ship-loop` is a coder-owned skill that runs autonomously by default after a single up-front plan approval, stopping for the owner only at a bounded set of "important questions" and at the owner-only done-gate. It never moves a task file.**

- **Autonomy is the loop's built-in default, self-contained in the skill.** Invoking `/fkit-task-ship-loop` **is** the authorization. This is **not** an override bolted onto the shared `fkit-process-stateful-review` gate (which the Codex pass proved unenforceable) — the loop carries the review *rigor* under its own discipline and does not call the gated skill and contradict it. Because the skill is coder-owned and **hook-enforced (ADR-018, only the coder can run it)**, the authorization cannot be claimed by another role or a standalone invocation. `fkit-process-stateful-review` is **byte-unchanged**; its per-round gate remains in force for every other use.
- **The plan gate stays — the one guaranteed upfront human checkpoint** (also runtime-enforced by plan mode). Only after approval may the owner walk away. Plan rejection ends the run with the task left `🔲 Backlog`.
- **"Walk away" is ordinary in-session turn-taking, not background delegation.** Between gates the loop proceeds without waiting; at an important question it ends its turn and idles until the owner returns. It **refuses** a genuinely spawned/headless invocation. No `AskUserQuestion` dependency (task 39).
- **The autonomous class is bounded by fix *shape*, not verdict, plus an obvious-winner rule.** It applies a change without asking **only if** it is (a) verified `CORRECT`, (b) mechanical/localized, and (c) inside the approved plan — **or** an **obvious winner** (one option clearly dominates *and* stays within the plan's intent). It **stops** for every judgment call: a frontier-move/residual, a regression or oscillation, a disputed severity that changes scope, a broad/behavior-changing fix, a genuine tradeoff with no dominant option, or anything outside the plan. **When in doubt, it stops.** Every autonomous choice is recorded in the worklog decision-log (ADR-020).
- **The done-gate is unchanged and owner-only.** The loop's terminal act is a ready-for-done **evidence packet** plus the ask — evidence to judge, not a done-verdict. It does not move the brief and does not spawn a producer to move it. Status stays `🔄 In progress` until the owner's mover sets `✅ Done`.
  > **⚠️ AMENDED — this Decision no longer holds.** [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] (2026-07-18) **removed the owner-only done-gate**; a spawned agent may now move task files, including the coder closing its own task. **This ADR's re-raise clause pre-registered exactly that decision** ("a new consent-model decision needing its own ADR"), so the amendment is orderly, not a violation. **The loop's own behavior is unchanged** — it still does not move the brief. What changed is the *rule protecting it*: **the autonomy argued for here rested on two human gates and now rests on one.** The plan-gate is untouched and remains the one unremovable checkpoint. *(Annotated by lint, 2026-07-19.)*
- **The Codex second opinion cannot be silently skipped.** A partial (no-Codex) review is re-requested up to **3 attempts**; if still not model-diverse, the loop proceeds but marks the task loudly **"reviewed — NOT model-diverse."**

Task 53 applies the single contract edit this requires: a scoped note in `fkit-coder.md`, unchanged outside the loop.

## Consequences
- **Positive:** the owner gets the walk-away workflow; the two decisions that protect the work — *what gets built* (plan gate) and *what gets marked done* (done-gate) — stay human; the review skill and its per-round gate are untouched for every other use; every autonomous choice is auditable in the worklog.
- **Negative / costs:** a genuine, recorded amendment to the coder's owner-present contract (scoped to this skill); a **soft self-classification boundary** — the loop must honestly judge fix "shape" / "obvious winner", the sharpest edge, which task 53's dry-run must exercise hardest; closing a task costs a coder → producer session switch (accepted — *that friction is the gate*).
- **Rejected, named so they aren't re-litigated:** narrowing `fkit-process-stateful-review`'s gate via a cross-skill note (rev 1 — unenforceable, `CORRECT` ≠ mechanical); a per-run *spoken* autonomy grant (rev 2 — owner wants it as the default); **relayed-consent close-out** (loop spawns a producer to run the mover — contradicts "do not tell anyone else to"; needs its own consent ADR); a fully unattended/headless background loop (impossible under the coder contract).
- **Re-raise only if:** the loop is shown to apply a scope-changing/out-of-plan fix without stopping (defect against the decision, fix the skill); a spawned/headless invocation is found to proceed autonomously; someone proposes making the autonomy reachable by another role or bolting it onto the shared review skill (reopen — that is the unenforceable path); or the owner later wants relayed-consent close-out (a **new** consent ADR, not settled implicitly here).

## Related
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the `plans/` + `worklogs/` artifacts this loop writes (the autonomy boundary and audit trail)
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook that makes "only the coder can run this skill" structural, at any depth
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the consult envelope the loop operates within
- [[systems/review-and-model-diversity]] — the Codex degradation contract the loop inherits
- [[systems/fkit]]
- [[tasks/design-task-ship-loop-skill]] — the design task (priority 52) that produced this ADR
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/implement-task-ship-loop-skill]] — the implementation (task 53)
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] — the owner-question timeout, declined on cost; this ADR's gates unchanged
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — **amends this ADR's Decision 5**: the done-gate is removed; the plan-gate survives
- [[tasks/design-ship-loop-timeout-auto-proceed]] · [[tasks/implement-ship-loop-timeout-auto-proceed]] — cancelled follow-ups
- [[tasks/restructure-coder-report-summary-then-interview]] — the general coder report contract; the loop's own contract wins inside the loop
- [[decisions/adr-023-fkit-git-agent-is-not-built]]
- [[tasks/design-fkit-git-agent-and-consent-model]]
