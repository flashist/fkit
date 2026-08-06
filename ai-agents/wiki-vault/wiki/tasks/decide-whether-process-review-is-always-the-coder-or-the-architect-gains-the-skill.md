# Decide whether Process-review is always `@fkit-coder`, or the architect gains the skill

**Source**: `ai-agents/tasks/done/0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-05
**Sprint/Tag**: Sprint 2 · ID `0200` · owner `fkit-architect`
**Report**: `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md`

## Goal
On the 2026-08-02 driver run the sprint loop spawned **`@fkit-architect`** for the **Process-review** step on **three consecutive tasks** (`0158`, `0143`, `0195`), because each deliverable was architect work product. `/fkit-process-stateful-review` is **coder-owned**, so the **ADR-018 hook denied the skill** — and the denial reached the record **only because one worker chose to disclose it**. Rule whether the step is **always the coder**, or whether the architect gains the skill.

## Key Changes

### The ruling — one sentence a future driver can act on
> **The Process-review step's role is fixed by the skill the step runs, not by who wrote the deliverable: it is always `@fkit-coder`, because `fkit-process-stateful-review` writes the ledger's coder-owned section and applies code fixes — neither of which changes when the deliverable happens to be a document.**

**Structural, not preferential.** Four grounds, and the report **re-ranked its own strongest to weakest under review**:
1. **The counter-example is already in the record** — on `0167`, an architect-authored deliverable, the Process-review step **was still routed to `@fkit-coder`**. ⚠️ **Narrowed under review:** the **routing** is attested; the **authorship** of one round is *unestablished*, and concluding "coder" from the absence of a denial is exactly the inference the report's own S11 shows proves nothing. **Ground 1 is now the weakest of the four; 2–4 carry the ruling alone.**
2. **The step is defined by the section it writes, not the artifact under review.** *"Reviewer and coder each own a section and round-trip in place"* — the section is **coder-owned regardless of what the review is about**.
3. **Step 6 applies code fixes.** The step can end in a source edit. **Only one role may make one.**
4. **This is ADR-033's pattern exactly** — route the step to its owning role; **do not widen the skill**.

**What the answer is not:** it is not *"the architect may not touch a review."* It is the **step** — writing the coder-owned section and applying fixes — that does not move.

### ⛔ Option (b) rejected — granting the skill to `architect`
- **It hands a source-write procedure to a design-only role.** ⚠️ **Narrowed under review:** for a *document* review, Step 6's *"apply the minimal, idiomatic fix"* is a document edit, inside the architect's existing authority, so the five *sole-source-write* statements would **not** be falsified the moment (b) landed. **The rejection stands on the authority conflict the grant cannot scope away**, not on the word "false".
- **The grant is total or absent.** `skills_for_role()` is a flat list with **no conditions** and the hook does a substring match — **there is no mechanism to grant the skill "for architect-owned work products only"**, which is the only stopping rule anyone proposed.
- **Nothing stops the argument.** *"The role that owns the artifact processes its review"* reaches **four of seven roles** — and the reviewer case **additionally collapses reviewer independence**, letting a reviewer answer its own findings.
- **It answers a question nobody has** — it removes the *denial* without removing the *misroute*, and **the one signal that surfaced this defect at all would stop firing**.

### The detection answer — a PAIR, not one signal
> ⚠️ **Round 1 recommended a single signal and was wrong.** The corrected answer: **(v) a git-tracked, append-only denial log written by the hook** ***and*** **(i) a mandatory `**Role:**` line in every worklog round.** Each covers a path the other misses.

| Path the misroute takes | Reaches the hook? | Caught by |
|---|---|---|
| Worker **attempts** the skill and is denied (`0195`) | yes | **(v)** the denial log |
| Worker is told to apply the method **by hand** and never attempts it (`0158`/`0143`, on the reading the artifacts allow) | **no** | **(i)** the `**Role:**` line |

**Today a denial reaches the record only through the goodwill of the worker that was denied.** ***A detector whose output channel is the accused is not a detector*** — **but a detector wired only to the hook is blind to the worker that never knocks on the hook's door.** Measured: **2 of 4** Process-review rounds this session carry no `**Role:**` line at all.

### ⚠️ The framing the brief got wrong, and it changes the question
The brief says the loop's prose and the hook **disagreed** for three tasks. **They agree exactly** — the row names `@fkit-coder`, `skills_for_role()` grants `coder`. **What departed from both was the driver's spawn choice.** The real question is *"what makes the next **driver departure from the role the loop names** visible in fewer than three tasks?"* — a different question with a different answer. **A test asserting each loop row's role owns that row's skill passes today and would have passed on 2026-08-02** — it does not catch this defect. **The report corrects its own approved plan on that point.**

### The `"method"` wording — reversed under review, and the reversal is the interesting part
> ⚠️ **Round 1 ruled the row should read *"run `/fkit-process-stateful-review`"*. That answer was WRONG and is withdrawn.**

***"Method"* stays. It is a settled ADR-019 / ADR-032 convention, not a wording accident** — in a ship loop the step applies the skill's *steps* while **the loop's single up-front owner approval replaces the skill's per-round owner gate**. Switching to the invocation form **would re-impose the gate ADR-019 explicitly rejected**, inside a loop whose whole premise is that the owner approved once.

**What is actually wrong with the row: it names the method without *enumerating* it**, so a worker can reproduce a subset of the steps and believe it complied. **Measured cost on `0195`: Steps 0, 2, 3 and 3.5 never ran, and Step 4's prescribed status vocabulary was not used.** The word *"method"*, left unenumerated, **did not merely fail to stop the wrong role — it permitted an incomplete execution by any role**, which is the larger defect. **Enumeration fixes that; a verb change does not.**

## Outcome
**Recommend (a) — the routing rule stated and reasoned, with the method ENUMERATED — plus (c)'s paired detector as a non-optional companion. Reject (b).** Assessed against the owner-ruled priority ordering *correctness > detection latency > maintenance cost > implementation cheapness*: **(a) does not win by being cheap — cheapness ranked last.** It wins on priority 1, where (b) fails outright, and **neither half of the recommendation is optional**: (a) contributes the enumerated row, (c) contributes detection.

**Main tradeoff, stated rather than buried: the rule stays PROSE.** There is nothing to make *"Process-review is the coder"* hook-structural — **the hook gates skill *invocation*, and a driver that spawns the wrong role and tells it to work by hand never reaches the gate.** A prose rule plus a durable detector **in place of prevention**, the same honesty ADR-033 states about its own residual.

**An ADR is required and was deliberately not written here** — owner-ruled at plan approval. Proposed: ***"A loop step's role is fixed by the skill the step runs, not by the deliverable's author."*** It is task `0222`, filed as **the only one of the eight named follow-ups the owner authorized**. ⚠️ **Its number must not be taken on trust** — the ADR-029 precedent is a number claimed everywhere **except** `decisions/`, so the sweep must cover `decisions/`, `reports/`, the boards **and** this vault.

### The undeclared change surface — the task-70 failure recurring in the checklist that documents task 70
`claude/skills-for-role.sh`'s header declares **four** hand-maintained mirrors. An option-(b) change would also have had to touch the skill's own **⛔ Owner: the coder** banner and `claude/agents/fkit-architect.md`, plus a **second site inside an already-declared file**; and **three further shipped sentences** would go stale. ⚠️ **The report's own count was wrong twice in opposite directions**, and the accepted figure is **7 files / 8 sites** — the `8 / 9` printed in the report is a **recorded residual, left as written**. **Every count in it is a hand grep**, because ADR-036's site registry has no tooling.

### Five accepted residuals worth carrying
- **The `0191` clause's *"will run"* reading is contested and stays unsettled** — decision-irrelevant twice over: on either reading it adds **no detection**, and it reaches **no driver at all**.
- **The `**Role:**` line is a *presence* signal, not an *attribution* signal.** A test that asserts the line is present cures **absence** and cannot cure **misattribution** — nothing compares the recorded role against the row's role, so **a line copied from the row passes**. Inherent to a self-reported channel.
- **The `8 / 9` surface count is `7 / 8`**, left as written because it belongs to the rejected option.
- ***"Outside the denied worker's control"* overstates** — ADR-022 leaves every role but the adversarial reviewer tool-unrestricted.
- **`/fkit-evaluate-approach` Step 1's owner interview could not be executed** (ADR-021). The driver pre-supplied the owner-ruled priority ordering; **everything else Step 1 would have elicited was not obtained, and the report says so rather than assuming.**

## Related
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook, which **performed correctly**; this is not a bug report against it
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the *route-don't-widen* precedent this ruling follows
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — ⚠️ **it does NOT already answer this**: §Context explicitly disclaims the **invocation** axis, which is where role selection lives
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] · [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the *"method"* construction's authority: the loop's single up-front approval **replaces** the skill's per-round gate
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — `skills_for_role()` as the single declared source of truth. ⚠️ **It names the stale home `claude/fkit-claude.sh`; cite the file, not the ADR's path**
- [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]] — the registry that would have enumerated the surface, **with no tooling on disk**
- [[tasks/add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules]] — task `0191`, whose clause this task measured as reaching **no driver**
- [[tasks/decide-what-the-sprint-driver-does-when-a-spawned-worker-dies]] — task `0167`, whose attested coder routing is ground 1
- [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] — task `0195`, the primary evidence: the worker that **disclosed its own denial**
- [[tasks/append-a-dated-correction-note-to-adr-010]] · [[tasks/decide-whether-a-spawn-instruction-may-override-a-skill-rule]] — `0143` and `0158`, the two closed ledgers **audited read-only, never reopened**; their record defects belong to task `0201`
- [[tasks/investigate-the-skill-ownership-fact-inventory-gap]] — task `0142` / ADR-036, the same incomplete-checklist failure this task hit again
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why Step 1's interview was impossible
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — the reason *"outside the worker's control"* overstates
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board where **seven of this task's eight named follow-ups** sit unfiled by design; only `0222` took a Sprint 2 row
- [[systems/role-locked-sessions]] · [[systems/testing-and-verification]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
