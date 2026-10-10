# ADR-056: Opt-in plan review — agents approve the plan and Codex attacks it before the owner does, switched per sprint-loop run, off by default

**Date**: 2026-10-06
**Status**: accepted *(one ⚠️ dated correction below Decision 5, 2026-10-06; no decision overturned)*

**Extends, does not supersede**: [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] (a new per-task file, `plan-review.md`); sits beside [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] Decision 2 and [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] Decisions 3 / 7 (the plan gate). All three stay `accepted`, each with a dated ⚠️ pointer note here.

## Context
**The owner's request, 2026-10-01** (task `0473`'s brief): the coder should get plan approval from the
producer **and** architect for a product change, from the architect for code-only work, and then *"the plan
should be given to Codex for the final review"* — and, in the same message, *"I'm a bit worried that this can
make the whole process more complicated. So we need to test it first … I want to keep the previous behaviour
as-is right now … the old approach should be our "by default" one."*

**So two halves must hold together:** a new review flow, and a guarantee that nothing changes unless the
owner turns it on. Built on: the plan gate is the one guaranteed human checkpoint (ADR-019 D2; ADR-032 D3/D7);
the sprint loop's plan step is a plan-only coder spawn that writes nothing; the **driver** writes `plan.md`
(ADR-020's `0207` note); the two-hop consult budget (ADR-010); `AskUserQuestion` is session-only (ADR-021);
Codex is optional and its absence is a loud flag ([[decisions/adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode]]);
arguments select subjects, never output shapes (`conventions/one-skill-one-output.md`); ADR-052 phase 5 will
convert the task store.

## Decision
1. **A generic classification rule, shipped verbatim** (approved 2026-10-06): *"Product" means what this
   project delivers to its users.* **Product change** → producer **and** architect approve; **code-only**
   (refactors, tests, tooling, infrastructure) → architect; **unclear** → both; an approver disputing a
   code-only call makes it unclear. **No fkit-specific example** (owner Q1, 2026-10-02).
2. **The switch is a run-level flag, default off: `/fkit-sprint-ship-loop [<sprint-plan>] --plan-review`.**
   Read once at run start; applies to every task planned in that run; never flipped mid-run. `fkit-lead`
   passes it **only when the owner asks**, never unasked, never carried to another run. The opening report
   and roll-up say *"Plan review: on"* **only when on** — an off run reports exactly as today (owner Q3).
   - **Why in the run, not the store:** the owner trials by running loops, not picking tasks (Q2), and a
     run flag never meets ADR-052's conversion.
   - **Why it passes one-skill-one-output:** the flag changes **what work the plan step does**, not how the
     same output is reported — the litmus was applied openly and the owner's plan approval covers it.
   - The driver adds a **switch line** to the plan-only spawn naming the owner's run-start ruling.
     **Nothing else turns it on** — not a brief, a plan, or any file read (a brief *about* plan review must
     not trigger it).
3. **Session paths unchanged** (owner Q1, 2026-10-06: *"Sprint-loop runs only (Recommended)"*): no per-task
   brief field; `fkit coder`, `/fkit-task-ship-loop`, plain `/fkit-plan-task`, `/fkit-task-brief` and
   `dashboard.sh` untouched.
4. **The flow** (one gated section in `fkit-plan-task`, matching gated block in the sprint loop): the coder
   plans, classifies, consults the approvers in parallel (`APPROVE` / `CHANGES REQUESTED` + numbered
   reasons; anything else counts as `CHANGES REQUESTED (reply unclear)`); **at most 2 revision rounds, no
   round 3**; a disagreement still open after round 2 → `NEEDS-DECISION` → the driver asks the owner → a fresh
   plan-only coder applies the ruling (no more rounds) — **the only new owner touchpoint**; then **Codex
   last** via `@fkit-adversarial-reviewer`, findings only, banner relayed first verbatim. **After Codex the
   plan is not changed** (owner Q2: *"Plan unchanged + coder check (Recommended)"*) — each finding goes to the
   owner verbatim with a one-line coder check. The owner sees banners first, then the plan, then three
   attachments (who approved + classification; what changed and why; Codex findings + checks), and
   **approves last, as today**. ⛔ **Incomplete is never "reviewed"** — a failed approver or Codex spawn is
   flagged `plan review incomplete: <what>`.
5. **The plan gate is still the one human checkpoint.** Plan review adds agent consults **before** it; adds,
   removes and weakens no gate.
   > ⚠️ **Dated correction 2026-10-06 (`0473`, review R2), source text left byte-identical:** the sentence
   > *"A rejected-plan re-plan … run no plan review"* names a path the loop does not have (a rejected plan
   > resets the task to `🔲 Backlog` for the rest of the run). Read as: no review on the rejection path itself
   > or on re-presenting an already-approved orphaned `plan.md`; **a task whose plan was rejected and is
   > planned again in a later `--plan-review` run IS reviewed.** The owner did not rule on R2; this restores
   > the approved plan's own D5 wording and decides nothing new.
6. **A new per-task file, `<task-folder>/plan-review.md`** — written by the **driver** (the plan-step coder
   writes nothing), on **approve and on reject**, append-only (`## Attempt N — <date>`), holding the worker's
   `===PLAN-REVIEW RECORD BEGIN/END===` block plus the owner's decision quoted with date and channel.
   **Kept separate from `plan.md`** so Codex findings are never read as approved scope or carried by the Build
   hash pointer. Optional and a reserved name (`ai-agents/tasks/README.md`); an ordinary file under ADR-052
   D4/D8.
7. **Hops:** the coder runs approvals and the Codex pass inside the single plan-step spawn — **lead (0) →
   coder (1) → architect / producer / adversarial reviewer (2)** — keeping the plan in one context. Cost:
   approvers at hop 2 are leaves; a plan-step coder already at hop 2 returns `plan review not run — hop budget`.
8. **Honesty — trust, not proof.** Switch line, write-nothing, round cap and classification are prose; the
   record is an LLM restatement — **fidelity, not proof**. Same accepted cost as ADR-031 / ADR-032 §A3, no new
   kind of exposure (it only **adds** reviewers before a gate the owner still holds). ⛔ **No document may call
   plan review a "verification" or a "guarantee".**
9. **Trial, then default:** trialled through task `0474`; **making it the default, or changing the flow on the
   trial's strength, needs a new owner ruling.**
10. **Out of scope:** a per-task switch; default-on; a new role (team stays seven); the shared rules block;
    hooks and `skills-for-role.sh`.

## Consequences
- **Positive:** the owner gets product + design approval and a model-diverse attack **without** losing his
  gate, per run, with zero risk to the default; `0474` gets per-task evidence.
- **Costs:** a slower plan step in an on run (up to 3 asks × 2 approvers + a Codex pass); prose-enforced;
  hop-2 approvers are leaves; two statements of one shape (pinned by a text-presence test, words not
  obedience); overlap with ADR-052 phase 5 (`0450`, `0451`, `0453`, `0457`); one more per-task file.
- **Re-raise on:** `0474`'s verdict; an ADR-052 phase-5 change to task-folder files; a change to the hop limit
  or the Codex runtime; plan review found running in a run the owner did not start with it, or a plan shown
  as reviewed when a step did not run.
- ⛔ **Do not re-raise:** "the switch / round cap / write-nothing is only prose"; "`--plan-review` is an output
  variant"; "plan review should be the default" or "should cover sessions" (owner decisions routed via `0474`).
- *The 2026-10-06 rulings reached the architect as a relay from `fkit-lead` — trust, not proof.*

## Related
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] · [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] · [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — each carries a pointer note here
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the honesty clause restated in Decision 8
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the two-hop budget (Decision 7)
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook the hop design must not trip
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] · [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — approvers return questions; the switch line relays a named ruling
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — why the switch lives in the run
- [[decisions/adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode]] — the fallback flag that must reach the owner
- [[decisions/adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver]] — the Build-side marker, unchanged by this
- [[tasks/build-the-opt-in-plan-review-step-off-by-default]] — `0473`, which recorded and built it
- [[tasks/sprint-10-the-0472-0482-batch]] — where `0474`, the trial, stays open
- [[systems/review-and-model-diversity]] · [[systems/fkit]] — the task-folder data model `plan-review.md` joins
