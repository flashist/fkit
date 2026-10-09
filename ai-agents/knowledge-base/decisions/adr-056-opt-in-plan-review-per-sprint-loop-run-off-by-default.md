# ADR-056: Opt-in plan review — agents approve the plan and Codex attacks it before the owner does, switched per sprint-loop run, off by default

- **Status:** accepted
- **Date:** 2026-10-06
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect. The **request and its shape** were ruled on
  **2026-10-01** and **2026-10-02** (`fkit-lead` session; relayed to a spawned producer, who filed task
  `0473`). The **plan, its decisions D1–D6 and its three open questions** were ruled on **2026-10-06**
  (`fkit-lead` session driving `/fkit-sprint-ship-loop` on Sprint 10, `AskUserQuestion`), and relayed to
  fkit-architect by fkit-lead, which recorded this ADR the same day, after plan approval and before Build
  (the plan's §5 / §11 step 2).
- **Task:** `0473` (`0473-build-the-opt-in-plan-review-step-off-by-default`). The trial is task `0474`.
- **Extends, does not supersede:** [ADR-020](adr-020-per-task-plan-and-worklog-artifacts.md) (a new
  per-task artifact, `plan-review.md`), and sits beside
  [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) Decision 2 and
  [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) Decision 3 / Decision 7 (the plan
  gate). All three stay `accepted`; each carries a dated ⚠️ pointer note to this ADR.
- **Corrections:** 2026-10-06 (`0473`, review finding R2) — this ADR carries one dated note inline below
  **Decision 5**. Legend: ⚠️ = a fact or wording that drifted (the decision is untouched); ⛔ = a decision
  overturned (none here). The annotated text is left byte-identical; Status stays `accepted`.

> **Citation form.** Agent, skill and hook files are mutable: cited by **section plus quoted phrase**,
> never by line number. Task briefs and plans are coordination documents: cited by **heading plus quoted
> phrase**, never `:NNN`. Tasks are named by folder `NNNN` prefix. Where this ADR describes text that
> task `0473`'s Build **will add** to a skill or agent file, it says so; it does not cite it as present.

> **What this ADR decides, in one line:** a `/fkit-sprint-ship-loop` run started with `--plan-review`
> has each task's plan approved by the producer and/or the architect (by a written classification rule),
> then attacked by the adversarial reviewer on Codex, **before** the owner sees it — at most 2 revision
> rounds, the owner settles what is still disputed, and **the owner still approves last**. A run without
> the flag, and every other path, behaves exactly as today. It is **trust, not proof**.

## Context

**The owner's request, 2026-10-01** (task `0473`'s brief, §Context, *"The owner's request, his own
words"*): the coder should get the plan approved by other agents — *"If the feature is related to some
product features or changes in the current product features. Then the coder should take approval from
both producer and architect. If it's only the code feature … then the coder should ask the architect.
And in all cases, when … the plan is done and approved by the dependent agents, the plan should be given
to Codex for the final review."* And, in the same message: *"I'm a bit worried that this can make the
whole process more complicated. So we need to test it first … I want to keep the previous behaviour
as-is right now, and I want to be able to switch "in time" … but the old approach should be our "by
default" one."*

**So this is a decision with two halves that must hold together:** a new review flow, and a guarantee
that nothing changes unless the owner turns it on. A flow without a switch cannot be trialled; a switch
without a flow does nothing.

**Facts this decision is built on, not against.**

- **The plan gate is the one guaranteed human checkpoint.** ADR-019 Decision 2, *"The plan gate stays —
  the one guaranteed upfront human checkpoint"*; on the orchestrated path ADR-032 Decision 3 (*"driver
  AskUserQuestion: approve plan"*) and Decision 7 (*"The plan/build split is mandatory"*). This ADR adds
  agent reviews **before** that gate and changes nothing about the gate itself.
- **The sprint loop's plan step is a plan-only coder spawn that writes nothing.**
  `claude/skills/fkit-sprint-ship-loop/SKILL.md`, §*"The plan-gate honesty clause"*: *"spawn
  `@fkit-coder` **for the plan only** — prompt: *"produce a plan with `/fkit-plan-task`, write no source,
  return the plan and any open questions"*"* (verified against live code 2026-10-06).
- **The driver writes the approved plan; workers do not.** Same skill, §*"Durable artifacts"*:
  `plan.md` is written by *"**the driver** … at plan approval, before the Build spawn"* (ADR-020's
  dated `0207` correction records why a worker must not stand between approved text and the file).
- **The consult budget is two hops** (ADR-010 point 4, *"two-hop"*; `claude/agents/fkit-coder.md`
  §*"Consult rules — hard"*, *"If **you** were consulted at hop 2, you may **not** consult anyone"*).
- **`AskUserQuestion` is session-only** ([ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  Spawned approvers cannot ask the owner; they return open questions.
- **Codex is optional; its absence is a loud flag, never a silent substitute**
  ([ADR-054](adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode.md);
  `claude/skills/fkit-adversarial-review/SKILL.md`, §*"The fallback banner — first thing in the output,
  every time"*). Today the adversarial reviewer attacks **a diff/scope**
  (`claude/agents/fkit-adversarial-reviewer.md`, §*"What you receive"*: *"A **diff / scope** to
  review"*); Build widens it to accept a pasted plan.
- **Arguments select subjects, never output shapes** (`conventions/one-skill-one-output.md`, *"Litmus
  test (one line): does the argument change *what the skill works on*, or *what the same work looks
  like when reported*?"*). The sprint loop's argument today is one operand, *"no output-variant flags"*.
- **ADR-052 phase 5 will convert the task store** (D4: *"`plan.md`, `review.md`, `assets/` stay
  ordinary files"*; D8 item 7: *"every other file hash-identical"*). None of its phase-5 tasks has
  started; whichever lands second carries the other forward (brief, §Context, *"Overlap with ADR-052
  phase 5"*).

## Decision

1. **The classification rule — shipped verbatim, generic.** When plan review runs, the coder classifies
   the change in one line with its reason, using exactly this wording (the approved plan's §3.2,
   approved by the owner 2026-10-06):

   > **Classify the change in one line, with your reason.** "Product" means what this project delivers to its users.
   > - **Product change** — adds or changes what the project delivers: features, behaviour or output its users get. → the **producer and the architect** approve.
   > - **Code-only** — internal; what the project delivers stays the same: refactors, tests, tooling, infrastructure. → the **architect** approves.
   > - **Unclear** — you cannot tell which. → **both** approve.
   >
   > If an approver disputes a code-only classification, treat the task as unclear and add the producer.

   **It names no fkit-specific example** (owner, 2026-10-02, Q1: *"the instructions should be generic
   enough to make sure they work the same way in different projects, regardless of their nature"*).
   "Unclear → both" is the owner's 2026-10-01 ruling.

2. **The switch is a run-level flag, default off: `/fkit-sprint-ship-loop [<sprint-plan>]
   --plan-review`.** Absent means off. It is read **once at run start** and applies to **every task
   planned in that run**; it cannot be flipped mid-run (the owner restarts the run). `fkit-lead` passes
   it **only when the owner asks**, **never adds it unasked**, and **never carries it to another run**.
   The run's opening report and roll-up say *"Plan review: on"* **only when it is on**; an off run
   reports **exactly as today** (owner, 2026-10-06, Q3).
   - **Why in the run, not the store.** The owner trials it by running sprint loops, not by picking tasks
     (2026-10-02, Q2: *"I will run the tests via fkit-sprint-ship-loop loops, I won't be choosing
     specific tasks"*). A run-level flag also lives **outside the task store**, so ADR-052's conversion
     never sees it — there is no brief field to migrate, no `dashboard.sh` parse to break.
   - **Why it passes the one-skill-one-output rule (the litmus, D1 of the plan, owner-approved).** The
     flag changes **what the plan step does** — it adds approver consults and a Codex pass to the work —
     not **how the same output looks when reported**. By the convention's own litmus it is a parameter of
     the work, not an output variant. The plan stated this openly so the owner ruled on it rather than a
     designer settling it silently (the convention's escape-hatch spirit); his plan approval covers it.
   - **How the switch reaches the worker.** The driver adds a **switch line** to the plan-only spawn
     prompt, naming the owner's run-start ruling (ADR-037's driver-side discipline: the instruction relays
     a named owner ruling). **Nothing else turns plan review on** — not a brief, not a plan, not any file
     read during planning. A brief *about* plan review (such as `0473`'s or `0474`'s own) must not
     trigger it.

3. **Session paths are unchanged** (owner, 2026-10-06, Q1: *"Sprint-loop runs only (Recommended)"*).
   There is **no per-task brief field**. `fkit coder` sessions, `/fkit-task-ship-loop` and a plain
   `/fkit-plan-task` behave exactly as today; `/fkit-task-brief` and `dashboard.sh` are not touched.

4. **The flow — runs only when the switch line is present.** It lives in **one clearly gated section**
   of `fkit-plan-task` (between the existing Workflow steps 6, *"Produce a concrete step-by-step plan"*,
   and 7, *"Stop for approval"*), with a matching gated block in the sprint loop; the default text of both
   is left as it is. The steps:
   1. The coder writes the plan as today, then **classifies** it (Decision 1).
   2. **Ask.** The coder consults the assigned approvers in parallel. Each replies **`APPROVE`** or
      **`CHANGES REQUESTED`**, then numbered, focused reasons. A reply that is neither counts as
      `CHANGES REQUESTED (reply unclear)`. An approver's open question for the owner joins the plan's
      open questions and blocks nothing unless the approver says it does.
   3. **Revise and re-ask — at most 2 revision rounds.** First ask → revise (round 1) → re-ask → revise
      (round 2) → re-ask. **There is no round 3.** The coder may decline a requested change with a
      reason; if the approver still insists, that is a disagreement.
   4. **The owner settles a disagreement still open after round 2.** The coder returns
      `NEEDS-DECISION` (the point, each side's reasons, options with a recommendation, the draft plan, the
      record so far) and does not run Codex yet. The driver asks the owner with `AskUserQuestion`, then
      re-spawns a plan-only coder carrying the switch line, the owner's ruling quoted verbatim with date
      and channel, and the draft and record labelled *"draft as returned"*. That coder applies the ruling,
      runs **no further approver rounds**, and goes on to Codex. **This is the only new owner
      touchpoint.**
   5. **Codex last.** The coder spawns `@fkit-adversarial-reviewer` to attack the **agreed** plan. It
      returns **findings only**; its fallback banner, if any, is relayed **first, verbatim**.
      **After Codex, the plan is not changed** (owner, 2026-10-06, Q2: *"Plan unchanged + coder check
      (Recommended)"*): each finding reaches the owner verbatim with a separate one-line coder check
      (confirmed or disputed, with evidence). The approvers approved exactly the text the owner sees, and
      the owner decides what any finding should change.
   6. **The owner approves last, as today.** The plan gate presentation leads with any banners (Codex
      fallback, *"plan review incomplete"*, an owner-settled disagreement), then the plan as today, then
      three attachments: who approved and how the task was classified; what changed during review and
      why; Codex's findings with the coder checks. Then approve or reject, as today.
   - **Incomplete is never "reviewed".** If an approver or the Codex spawn could not run, the plan is
     still returned, flagged at the top as `plan review incomplete: <what>`. A Codex plan pass in
     `claude-fallback — NOT model-diverse` mode is flagged loudly in the roll-up.
   - **Workers write nothing.** The plan-step coder and the approvers write no file; the adversarial
     reviewer writes only its gitignored `.fkit/tmp/` prompt, as today.

5. **The plan gate is still the one human checkpoint.** ADR-019 Decision 2 and ADR-032 Decisions 3 and
   7 are **unchanged**. Plan review adds **agent consults before** the gate; it adds no gate, removes
   none, and weakens none. The plan the owner approves is still the one the driver writes to `plan.md`
   and carries to Build. A rejected-plan re-plan and the re-presentation of an orphaned, already-approved
   `plan.md` **run no plan review** — they are not a new plan step.

   > ⚠️ **Dated correction 2026-10-06 (`0473`, review finding R2) — "A rejected-plan re-plan" names a
   > path the sprint loop does not have, and can be misread.** The sentence above is **left
   > byte-identical**. No decision is reopened; Status stays `accepted`.
   >
   > **Why it misleads.** After the owner rejects a plan, the task is reset to `🔲 Backlog` and skipped for
   > the rest of that run (`claude/skills/fkit-sprint-ship-loop/SKILL.md`, §*"Stop conditions — the
   > driver's exit table"*, row *"Plan rejected"*: *"reset the task `🔄 In progress` → `🔲 Backlog`"*).
   > There is no in-run re-plan. A **later** `--plan-review` run could read the sentence as *"skip review
   > for a task whose plan was rejected before"* — and that plan would reach the owner unreviewed, with no
   > banner, against Decision 2's *"every task planned in that run"* (task `0473`'s review ledger,
   > §*"Reviewer findings"*, row R2: *"The plan would then reach the owner with no review and no
   > banner"*).
   >
   > **The intended meaning — the owner-approved plan's own wording.** Task `0473`'s plan, §*"2. Decisions
   > this plan makes"*, row D5: *"The rejected-plan path and orphaned plan.md re-presentation run no plan
   > review"*, because *"Re-presenting a plan.md that was already approved is not a new plan step."* Read
   > Decision 5 as:
   > - **No plan review** runs on the rejection path itself (the owner rejects → the task is reset), or
   >   when an already-approved, orphaned `plan.md` is re-presented.
   > - A task whose earlier plan was rejected and is **planned again in a later `--plan-review` run IS a
   >   new plan step and IS reviewed**, like every other task planned in that run.
   >
   > **Provenance.** The owner approved the plan on 2026-10-06 (`fkit-lead` session, `AskUserQuestion`,
   > *"Approve, with §7 fix (Recommended)"*). He did **not** rule on R2 itself; this note restores the
   > approved plan's meaning, it decides nothing new. **It pairs with the coder's fix** of the same
   > wording in `claude/skills/fkit-sprint-ship-loop/SKILL.md` (§*"Not a new plan step → no plan
   > review"*), made in parallel under task `0473`; this note does not cite that fix as landed.

6. **A new per-task artifact: `<task-folder>/plan-review.md`, extending ADR-020's set.**
   - **Written by the driver**, at the owner's decision — **on approve and on reject**. The plan-step
     coder writes nothing, so the driver, which holds the return, writes the file (the same reasoning as
     `plan.md`, ADR-020's `0207` note).
   - **Contents:** the worker's returned record block (between `===PLAN-REVIEW RECORD BEGIN===` and
     `===PLAN-REVIEW RECORD END===`) copied, plus the driver's lines: when the plan was presented, and the
     owner's decision with the selected option quoted, its date and channel. The record carries the
     switch line, UTC timestamps, the classification and reason, each round's verdicts and reasons, the
     changes per round, any disagreement and its ruling, the Codex mode line and findings verbatim
     (banner first), the per-finding coder checks, and problems (a denied or failed spawn, a hop limit
     hit, a malformed reply).
   - **Append-only**, one `## Attempt N — <date>` section per plan-review attempt; kept on reject because
     rejected attempts are trial evidence for `0474`.
   - **Separate from `plan.md`**, so Codex findings are never mistaken for approved scope and the
     Build / Process-review carry (and its hash pointer) stays the approved plan only.
   - **Optional and reserved:** it exists only for tasks planned in a plan-review run; Build adds it to
     the task-folder reserved names (`ai-agents/tasks/README.md` and its scaffold twin). Under ADR-052
     D4 it is an ordinary task-folder file, carried hash-identical by D8 item 7.

7. **Hop design — the coder runs the approvals and the Codex pass inside the single plan-step spawn**
   (plan D3). Chain: **lead (hop 0) → coder (hop 1) → architect / producer / adversarial-reviewer
   (hop 2)**. This keeps the plan in **one context** through every revision round; a driver-run design
   would re-spawn coders and re-carry the plan between rounds, a known fidelity hazard. It stays within
   ADR-010's two-hop limit, and every approver runs only its own skills or none, so the ADR-018 hook has
   nothing to deny. **The cost:** approvers at hop 2 cannot consult anyone, so they return open questions
   instead. If a plan-step coder is itself at hop 2, it cannot consult and returns the plan flagged
   `plan review not run — hop budget`. The re-spawn after an owner settlement (Decision 4.4) is a fresh
   hop-1 coder.

8. **Honesty — this is trust, not proof.** The switch line, *"write nothing"*, the 2-round cap and the
   classification are **prose in spawn prompts and skill text**. A confused or injected driver could add
   the switch line unasked, or a worker could skip a round or misclassify, and **nothing structural stops
   it**. This is the **same accepted cost** as ADR-031's plan-gate honesty clause and ADR-032 §A3, with
   no new kind of exposure: plan review only **adds** reviewers before a gate the owner still holds. The
   record (`plan-review.md`) is copied by the driver from a return message and the plan reaches Codex by
   pasting — both are LLM restatements, so the record is **fidelity, not proof**. Its impact is bounded
   because the owner sees and approves the actual plan. **No document may call plan review a
   "verification" or a "guarantee".**

9. **The trial, and the default.** Plan review is trialled through task `0474`, which runs sprint loops
   with `--plan-review` and judges it from the `plan-review.md` records and the run roll-ups. **Making
   plan review the default — or changing any part of this flow on the strength of the trial — needs a new
   owner ruling**, recorded as a new ADR or a dated note here. Nothing in this ADR turns it on by
   default.

10. **Out of scope.** A per-task switch or session-path plan review (Decision 3); making it the default
    (Decision 9); a new role (the team stays seven; approvals are consults to existing roles); the shared
    rules block in `CLAUDE.md` / `AGENTS.md` (not touched, its byte cap not spent); the hooks and
    `claude/skills-for-role.sh` (no new skill; approvers run none).

## Options considered

- **Run-level flag, coder-run reviews in one spawn, driver-written `plan-review.md` (chosen).** Matches
  how the owner will trial it (per run), keeps the default text byte-for-byte reachable, survives ADR-052
  untouched, keeps the plan in one context through the rounds, and keeps the owner last.
- **A per-task brief field (e.g. `## Plan review: on`).** Rejected (owner Q1, 2026-10-06): a second
  switch to combine with the run switch; the session path has an untested interaction with plan mode
  (whether a spawned adversarial reviewer can write `.fkit/tmp/` under it is unverified); and a field
  must survive ADR-052's conversion and its `dashboard.sh` rewrite. The owner trials by run, not by task.
- **Driver-run reviews** (the lead spawns approvers and Codex between plan-step spawns). Rejected: each
  round would re-spawn a coder and re-carry the plan — the fidelity hazard the driver-writes-`plan.md`
  rule exists to avoid — and the procedure would be split across two skills, harder to gate and test.
- **Plan review on by default, with an opt-out.** Rejected by the owner's own words: *"the old approach
  should be our "by default" one"*, and *"we need to test it first"*.
- **Let the coder revise the plan after Codex.** Rejected (owner Q2, 2026-10-06): the approvers approved
  a text the owner would then not see; the owner decides what a finding changes.
- **Record the review inside `plan.md`.** Rejected: Codex findings would sit inside the approved scope
  that Build and Process-review carry by hash.

## Consequences

- **Positive:**
  - The owner gets the review he asked for — product and design approval, then a model-diverse attack —
    **without** losing his gate, and can try it per run with zero risk to the default.
  - Off really means off: no flag, no new behaviour, no new report line.
  - `0474` gets per-task evidence (run identity, timestamps, rounds, classification, which findings
    changed the plan, problems, the owner's decision) and a per-run roll-up line.
- **Negative / costs — stated plainly:**
  - **Slower plan step** in an on run: up to 3 asks × 2 approvers plus a Codex pass (several minutes),
    all in one coder context (context growth). The timestamps measure it.
  - **Prose-enforced** throughout (Decision 8).
  - **Approvers at hop 2 are leaves** — they cannot consult anyone, only return open questions.
  - **Two statements of one shape** (the plan-task gated section and the sprint-loop gated block) can
    drift; Build pins them with a text-presence test that checks words on disk, never obedience.
  - **Overlap with ADR-052 phase 5** (`0450`, `0451`, `0453`, `0457`) — whichever lands second must carry
    the gated blocks forward.
  - **One more per-task file** in the task folder, written by the driver.
- **Residual risks / "re-raise only if":**
  - **Re-raise on `0474`'s verdict** — the trial's outcome (keep opt-in, make default, change the flow,
    or remove it) is the pre-registered trigger; any change needs a new owner ruling (Decision 9).
  - **Re-raise if an ADR-052 phase-5 change touches the task-folder files** — e.g. the converter or the
    board stops carrying `plan-review.md` as an ordinary file, or `plan.md`'s writer changes.
  - **Re-raise if the hop limit changes** (ADR-010 point 4) — Decision 7's chain is fitted to two hops.
  - **Re-raise if the Codex runtime changes** (ADR-054, the adversarial reviewer's mechanism) — Decision
    4.5 and the banner rule depend on it.
  - **Re-raise if plan review is found running in a run the owner did not start with it**, or a plan
    shown as reviewed when a review step did not run — a leak of Decision 2 or 4, found out of band by
    the owner or in a `plan-review.md` record.
  - Do **not** re-raise *"the switch / the round cap / write-nothing is only prose"* — stated and
    accepted in Decision 8. A finding must show it failing in practice.
  - Do **not** re-raise *"`--plan-review` is an output variant under one-skill-one-output"* — the litmus
    was applied and the owner approved it (Decision 2). Raise it only with a case where the flag changes
    how the same work is reported rather than what work is done.
  - Do **not** re-raise *"plan review should be the default"* or *"should cover sessions"* as a defect —
    both are owner decisions routed through `0474` and a new ruling.

## Owner rulings, with provenance

- **2026-10-01**, `fkit-lead` session, `AskUserQuestion`, selected option text (task `0473`'s brief,
  §Context, *"Owner rulings"*):
  - On the shape: *"Yes, file the brief — Producer writes the brief; coder plans it; you approve the plan
    before anything is built, as usual."*
  - When the coder cannot tell product change from code-only: *"Ask both — Producer + architect; safer,
    slightly slower."*
- **2026-10-02**, `fkit-lead` session, the owner's own typed words, relayed to the producer (same brief,
  *"Owner answers to the brief's open questions"*):
  - Q1 — product vs code-only: *"The instructions shouldn't be fkit-specific. … the instructions should
    be generic enough to make sure they work the same way in different projects, regardless of their
    nature."*
  - Q2 — how the trial runs: *"I will run the tests via fkit-sprint-ship-loop loops, I won't be choosing
    specific tasks, I will run it as many times as needed to make sure I approve the new behaviour."*
- **2026-10-06**, `fkit-lead` session driving `/fkit-sprint-ship-loop` (Sprint 10), `AskUserQuestion`,
  selected option text, relayed to fkit-architect by fkit-lead:
  - Plan approval (covers D1–D6, the §3.2 wording, the file list and this ADR's content):
    *"Approve, with §7 fix (Recommended)"*.
  - Q1 — the per-task field / session paths: *"Sprint-loop runs only (Recommended)"*.
  - Q2 — what happens after Codex: *"Plan unchanged + coder check (Recommended)"*.
  - Q3 — what an off run reports: *"Only when it's on (Recommended)"*.

*These rulings reached the architect as a relay from fkit-lead. By Decision 8 and ADR-055 Decision 7,
that relay is trust, not proof — recorded here as relayed.*

## Related

- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) Decision 2 — the plan
  gate as the one guaranteed human checkpoint; unchanged (Decision 5).
- [ADR-020](adr-020-per-task-plan-and-worklog-artifacts.md) — the per-task artifact set `plan-review.md`
  joins (Decision 6).
- [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) Decisions 3 and 7, §A3 — the
  sprint loop's plan gate, plan/build split and trust-not-proof cost; unchanged.
- [ADR-031](adr-031-fkit-lead-becomes-the-orchestrating-front-door.md) — the plan-gate honesty clause
  restated in Decision 8.
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — the two-hop consult budget (Decision 7).
- [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the
  skill-ownership hook the hop design must not trip.
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — why approvers return open
  questions.
- [ADR-037](adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)
  — the driver-side discipline the switch line follows.
- [ADR-052](adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md)
  D4 / D8 — why the switch lives in the run and how `plan-review.md` survives conversion.
- [ADR-054](adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode.md)
  — Codex optional; the fallback flag that must reach the owner.
- [ADR-055](adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver.md) — the
  Build-side marker; unchanged by plan review (the plan step writes no source).
- `conventions/one-skill-one-output.md` — the litmus the flag passes (Decision 2).
- Code (cited by section, mutable; Build edits these): `claude/skills/fkit-plan-task/SKILL.md`
  §Workflow; `claude/skills/fkit-sprint-ship-loop/SKILL.md` *"**Argument:**"* paragraph and
  §*"Durable artifacts"*; `claude/agents/fkit-lead.md`, `fkit-coder.md`, `fkit-producer.md`,
  `fkit-architect.md`, `fkit-adversarial-reviewer.md`; `claude/skills/fkit-adversarial-review/SKILL.md`.
- Task `0473`'s brief and plan (in its task folder) — the request, the design (D1–D6) and the owner's
  answers. Task `0474` — the trial.
- **Wiki:** **fkit-wiki** should ingest this ADR, and re-ingest ADR-019, ADR-020 and ADR-032 for their
  new pointer notes — an architect never writes the vault.
