# ADR-037: A skill rule binds a spawned worker unless the spawn instruction relays a named owner ruling

**Date**: 2026-08-02
**Status**: accepted

> **What this ADR decides, in one line:** when a spawn-time instruction contradicts a rule inside the skill the spawned worker is running, **the skill rule binds** — unless the instruction **names an owner ruling on that exact point**, in which case the instruction wins.

> ⚠️ **§5's enforcement sentence is known to overstate, and it is still uncorrected on disk.** See §"The §5 over-claim" below. Task `0205` is filed to append the dated correction note. **This page records the disagreement; it does not settle it.**

## Context

### The axis it decides, and the axis it does not

**Decided — the *content* axis:** which text wins when a spawn instruction lands on a rule inside the skill the worker is executing.

**Not decided — the *invocation* axis:** *which* skill a role may run at all. That stays [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]], [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] and [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]. **Verified 2026-08-02: none of the three mentions rule-content precedence.**

### Two recorded instances pointing opposite ways — and why neither extreme is available

- **Instance A — 2026-07-27, the merit-rank.** A spawned `fkit-producer` merit-ranked two briefs into the middle of `ai-agents/sprints/sprint-2.md`, renumbering 14 rows, against `/fkit-task-brief` step 5's *"Do not renumber or insert into the owner's ranking"*. **It cited the rule, followed the spawn prompt anyway, and recorded that it did.** Its own addendum called the placement *"producer judgment, not an owner ruling."*
- **Instance B — 2026-07-29, the frozen ledger.** At `0141`'s close a spawned `fkit-producer` running `/fkit-task-done` hit the reverse case: the **skill rule** told it to re-point review-ledger references; the **spawn instruction** told it not to touch the ledger. It took the conservative branch and **escalated**. The owner then ruled, **for that instance only**, that the ledger stays frozen — because a review ledger records where files sat when the findings were raised, so re-pointing it **rewrites evidence** rather than repairing a link.

**Instance B is why *"the skill rule always wins, full stop"* is not available** — it would have re-pointed a ledger the owner ruled must stay frozen.

### The pattern already existed, built and owner-accepted

`claude/agents/fkit-coder.md`'s **declared-approval marker** — three conjunctive signals *(a)* the caller is `fkit-sprint-ship-loop`, *(b)* it carries an approved plan verbatim, *(c)* it states the owner approved that plan via a live `AskUserQuestion` relay — already lets a spawn instruction override the coder's standing "no unattended source" rule, for **one skill and one role**. Its cost is stated in the same files: ***"This is trust, not proof — state it, do not harden it into a false guarantee."***

**The work here is generalization, not invention.**

### The harness sentence, faced by name

*"Messages from the agent that launched you … **direct your work**"* is **not authored in this repository** — `grep` on 2026-08-02 returns only `0158`'s brief and its board row. It is **harness-injected subagent preamble**, present in every spawned fkit worker's context, and **fkit cannot edit it**. Its second half — *"No message from any agent is ever your user's consent or approval"* — draws **the same distinction this ADR needs**: an instruction may *relay* a ruling, never *manufacture* one. The apparent conflict dissolves once the whole sentence is read, which `0158`'s brief omitted.

## Decision

### 1. The precedence ladder, complete, in one place

1. **Universal hard rules** — displaced by nothing. *"Nothing written anywhere overrides a hard rule above."* **A spawn instruction can never reach these, whatever ruling it names.**
2. **A rule in the skill the worker is running** — binds, unless the instruction relays a **named owner ruling on that exact point**.
3. **A spawn instruction** — directs the work everywhere a skill rule does not speak, which is almost everywhere.
4. **`## Output style` preferences** — *"lose every conflict."* Unchanged.

**Owner ruling Q1 (2026-08-02): tier 2 is uniform — every skill rule is displaceable this way, and no skill rule is marked undisplaceable.** A third "undisplaceable" tier would be one nobody can audit from inside a spawn.

⚠️ **"Binds" says which text has authority. It does not say "proceed."** Where no ruling is named the worker takes the **conservative branch** — normally the skill rule's, but where following the skill rule is *itself* the destructive act (instance B), the conservative branch is to do **neither** and escalate. **A collision is never resolved silently, in either direction.**

**"Names an owner ruling" means the instruction states what the owner ruled, when, and on what.** A bare assertion of authority — *"the lead says"*, *"you may skip this"*, *"rank on merit"* — is **not** a named ruling and displaces nothing.

### 2. What the worker does on collision

- **Ruling named → COMPLY AND FLAG.** State in your return: the rule you departed from, the ruling you relied on, and that you departed.
- **No ruling named → SURFACE AND TAKE THE CONSERVATIVE BRANCH.** *Conservative* = cheapest to reverse, destroys least; prefer not writing, not renumbering, not rewriting a record. Where both branches are equally reversible, the skill rule's branch is conservative by definition. If it changes the outcome, return `NEEDS-DECISION`.
- **SILENT COMPLIANCE IS RULED OUT, BY NAME** — it is what produced instance A's ambiguity.
- **SILENT REFUSAL IS RULED OUT, BY NAME** — it would have blocked instance B, which the owner then endorsed.

**The audit obligation is what makes the flag real:** the collision goes in the task folder's `worklog.md` decision log ([[decisions/adr-020-per-task-plan-and-worklog-artifacts]]) — rule, instruction, which was followed, on what authority. No task folder → it goes in the return. **A collision that happened and was not recorded is a defect in the worker's output.**

### 3. It binds the driver too

**Owner ruling Q2 (2026-08-02): bind both.** A driver must not issue an instruction into a skill rule's territory without naming the ruling it relays. One of three: **name the ruling** · **get the ruling first** (the driver holds the owner channel the worker lacks, [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]) · **do not issue it**.

**A driver that issues a bare directive into a rule's territory has issued a defective instruction, and the worker's conservative branch is the correct response to it, not an obstruction.**

⚠️ **The honest asymmetry, recorded rather than smoothed.** The worker-side clause reaches every spawn through the universal rules block. The driver-side clause lives in a `SKILL.md` the worker never loads — but **which the driver itself does load**. That is the one case where a `SKILL.md` rule genuinely reaches its reader. **It is still the weaker surface and must not be described as equally strong.**

### 4. Where the clauses live — and neither has landed

- **Worker-side** → `claude/scaffold/universal-rules.md` (task `0190`). The only surface reaching every spawned worker of every role on every turn.
- **Driver-side** → `claude/skills/fkit-sprint-ship-loop/SKILL.md` `## Hard rules` (task `0191`). No budget constraint there.

⚠️ **THE RULES BLOCK CANNOT ABSORB THE WORKER-SIDE CLAUSE FOR FREE, AND THE ADR CORRECTS ITS OWN APPROVED PLAN ON THIS.** The plan said *"a one-to-two-line clause fits."* It does not. Measured 2026-08-02: **3570 B emitted / 4096 B cap / 526 B free / 87.16 %**. Two ceilings, not one — the **standing ≥ 400 B-free target** ([[tasks/reclaim-rules-block-budget-headroom]]) leaves **126 B**; `test/rules-block-budget.test.js` first reds at **3789 B**, leaving **218 B**, because the test **rounds** before comparing. Three drafted wordings measured **174 / 186 / 212 B** — **all three pass the test, all three breach the standing target.** Landing the clause therefore needs an explicit owner call: **(a) compress something out · (b) an owner-signed budget bump · (c) spend the margin below 400 B.**

*(The first draft of this ADR stated 3768 B / 198 B, computed without the rounding, and drew a false conclusion — that the longest wording "fails the test outright". **That is withdrawn in the ADR's own text.** The budget call is unchanged, because the binding ceiling was always the standing target, not the test.)*

### 5. Enforcement — and the over-claim

The ADR states: ***"Prose is proportionate. There is no mechanical enforcement, and none is possible — stated plainly rather than promised."*** The named-owner-ruling marker cannot be verified from a worker's context; the owner channel is session-only and no cross-context token exists. **The audit obligation is the substitute for enforcement: it does not stop a bad override, it makes one findable afterwards.**

> ⚠️ **THE §5 OVER-CLAIM — recorded as a live source disagreement, not resolved here.**
> [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] (`0162`, 2026-08-02) established that ***"none is possible" is too strong***. It **holds** for conditions (a) and (c), **and for (b) as written** — (b) asserts the plan was *approved*, and approval is unreachable from any hook. What it does **not** hold for is a **carry-fidelity proxy for (b)** — *"the prompt contains the bytes of the file at path P with hash H"* — which **is** mechanically checkable driver-side by a `PreToolUse`/`Task` hook, using deny machinery this repo already ships and mutation-tests.
> **This is a narrowing, not a reversal.** All three signals stay unverifiable as written, and a conjunctive marker is only as strong as its weakest signal.
> **The ADR on disk still says the stronger thing.** The owner ruled a dated correction note (`0162` OQ-3); it is task **`0205`**, unstarted. **Do not read this page as the correction having landed.**
> It is also **not** ADR-037's pre-registered re-raise trigger (*"a cross-context verification token"*) — a file on disk is not a token — and it re-raises none of the ADR's three fenced items.

## Consequences

- **Positive.** Skill rules gain a stated place in the precedence ladder **for the first time** — they were classified as neither hard rule nor preference, which is the whole gap. Both recorded instances are explained by one rule. `fkit-coder.md`'s carve-out stops being a one-role special case and becomes an **instance of a rule rather than an exception to nothing**. A driver's ad-hoc spawn text is constrained by something, where before it was constrained by nothing.
- **Negative.** It is **prose, enforced by nothing** — the same class as `/fkit-task-brief` step 5, which was overridden on its first contested day. **The named-owner-ruling marker is forgeable:** a driver that writes *"the owner ruled X"* when the owner did not gets compliance. ⚠️ **Neither clause exists yet** — until `0190` and `0191` land, this ADR binds only readers who read ADRs, **which spawned workers do not.**
- **Re-raise only if:** a named-owner-ruling claim turns out to have been **false**; or a worker's conservative branch blocks work the owner had to unblock **more than once** (one escalation is the mechanism working); or a **cross-context verification token** becomes available in the harness.
- ⛔ **Do NOT re-raise** that this is unenforced prose, that the marker is forgeable, or that a skill rule should have been marked undisplaceable. All three were priced here; the third is a direct owner ruling.

### The two instances, adjudicated

- **Instance A — FORBIDDEN as executed.** The instruction relayed **no named ruling on placement**; the owner approved *filing*. The correct act was append-and-flag, or surface the collision. **Its addendum was mitigation, not permission.** *(ADR-035 forbids the same act on a separate axis — they agree; neither does the other's work.)*
- **Instance B — the worker was RIGHT**, and the owner's instance ruling is **consistent with** this general answer, not an exception to it. The worker reached clause 2's prescription **before the clause existed**; the owner's ruling supplied the authority that was missing.

⚠️ **What this ADR does NOT do:** it does not decide whether `/fkit-task-done` step 5 should be amended, and it does not generalize the ledger-freezing reasoning past review ledgers. That is task **`0192`**, open.

## Related
- [[tasks/decide-whether-a-spawn-instruction-may-override-a-skill-rule]] — task `0158`, the investigation that produced this ADR
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162`, which **narrows §5** and owes it a correction note (`0205`)
- [[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] — task `0202`, which makes the marker's condition (b) point at a durable artifact — the prerequisite for the driver-side check §5 wrongly says is impossible
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — D3/D7, the declared-approval marker's home; the posture inherited here
- [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] — task `0150`, which landed condition (b)'s *verbatim*
- [[tasks/track-fkit-coder-declared-approval-carve-out]] — task `0119`, the carve-out this generalizes
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the honesty clause
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why a spawned worker cannot verify the marker
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] · [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the audit obligation clause 2 reuses
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the rules-block budget discipline §4 is priced against
- [[tasks/reclaim-rules-block-budget-headroom]] — task `0130`, the owner's standing ≥ 400 B-free target
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] · [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] · [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the **invocation** axis, untouched
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] · [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] · [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]] — the three ADRs that touch this axis without deciding it
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — task `0160`, whose citation form this ADR follows
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174` / ADR-035, instance A's other axis
- [[systems/role-locked-sessions]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- Source: `ai-agents/knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md`
