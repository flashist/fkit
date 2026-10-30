# ADR-031: `fkit-lead` becomes the orchestrating front door — the "not a doer" stance is reversed

- **Status:** accepted
- **Date:** 2026-07-22
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Reverses:** [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) §Decision 3
  (*"`fkit-lead` (the team room) is a router, not a doer"*). ADR-010 Decisions 1, 2, 4,
  5 are **unaffected**.
- **Evidence:** [`reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
  — the feasibility analysis, the per-conflict resolution, and the plan-gate honesty clause reproduced
  in §Consequences here.
- **Corrections:** 2026-09-15 (`0393`) — this ADR carries a dated note inline below the §Context
  paragraph *"Also already-stale prose, corrected by this ADR"*. Marker legend: **⚠️ = a fact that
  drifted** (the decision is untouched); **⛔ = a decision that was overturned** (do not follow it). No
  existing line of this ADR was edited; the note is an append, and the Status stays `accepted`.
  ⚠️ 2026-10-06 (`0475`) — this ADR now carries **three** dated notes: the `0393` note above, plus two
  pointer notes to [ADR-055](adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver.md)
  — one below §*"The plan-gate honesty clause"* (it carries the fact) and one under §Consequences →
  Residual risks, first bullet (*"A spawned worker writes source before the owner approves the plan"*).
  The site list in the first line of this item is left byte-identical and is superseded by this line;
  the same append-only rule and the same legend apply.
  ⚠️ 2026-10-09 (`0498`) — this ADR now carries **four** dated notes: the three listed in the line
  above, plus one below §Decision 2 (the conductor also never diagnoses). The line above is left
  byte-identical and is superseded by this line; the same append-only rule and the same legend apply.
  ⚠️ 2026-10-30 (`0545`) — this ADR now carries **five** dated notes; the fifth follows the
  honesty-clause ADR-055 pointer and also covers Options considered. Earlier counts remain
  byte-identical; the same append-only rule and marker legend apply.

> **What this ADR decides, in one line:** `fkit-lead` grows from a router into a **single-point-of-
> interaction conductor** that spawns and drives any role — feasible because the ADR-018 hook already
> lets a spawned role run its own procedures, and safe *only* because the driver session keeps the owner
> channel to itself while workers **return** questions instead of asking them (ADR-021).

## Context

The owner wants **one agent per terminal** that is aware of the whole toolkit and **drives the other
roles as needed**, so they don't open a session per role until they genuinely need to. The owner ruled
(2026-07-22): grow the existing `fkit-lead` — **keep the name** — into a general conductor that "can
spawn **anybody** it needs — producer, architect, coder, reviewer, wiki, and future roles — give them a
task, wait for completion, then push the process further."

This **reverses** ADR-010 §Decision 3, and reversal is a real decision, not a drift: ADR-010 made lead a
router *"with no Write or Edit tools, deliberately"* (ADR-010 §Context, `fkit-lead.md:20-24`) precisely
because a long-lived session that *does everything* is the context-accumulation failure role-locking was
built to kill (ADR-010 §Options).

**Three harness facts settle feasibility** (all cited in the design report; corrected against the live
code, because `architecture.md:184-228` still describes the retired `skillOverrides` mechanism):

1. **Skill ownership follows the real caller's `agent_type` at any spawn depth**
   ([ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md);
   `skill-ownership-hook.sh:119-136`). A subagent spawned as `@fkit-coder` **may run coder-owned
   skills**. The skill lockdown is **not** the blocker to orchestration. (A *non-fkit* subagent carries
   no fkit identity and is denied every `fkit-*` skill — so the conductor must spawn **typed
   `fkit-<role>`** workers, never generic helpers, for any step that runs an fkit procedure.)
2. **The owner channel is session-only** ([ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md);
   `AskUserQuestion` `TOOL_ABSENT` 3/3 in a spawn). A spawned worker **cannot ask the owner** — only
   the top-level session can.
3. **Consult topology is prompt-enforced** (ADR-010 §Consequences; `Agent(type)` allowlists ignored).
   The conductor's spawn discipline is carried by prompt, not runtime.

**Also already-stale prose, corrected by this ADR:**
[ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md) relaxed tools for all six
Claude-side roles, so lead **already inherits Write/Edit** (`architecture.md:105`). `fkit-lead.md:20-24`'s
"no Write or Edit tools — deliberately" is a live drift; this reversal corrects it as well as the stance.

> ⚠️ **Dated correction 2026-09-15 (`0393`) — the `architecture.md` line pointer in this paragraph no
> longer lands.** It is **left byte-identical** as the record of what was cited on 2026-07-22; it now
> lands on a blank line inside §4.1. The passage is `architecture.md` §4.1 (*"The seven roles"*), the
> `fkit-lead` row of the tool table, whose tools cell still reads *"(none — inherits all)"* — so the
> claim it supports, that lead inherits Write/Edit, still holds. **Why ⚠️ and not ⛔:** a moved
> coordinate; nothing this ADR reverses changes. **Status stays `accepted`.**

## Decision

1. **`fkit-lead` gains an orchestrator remit and keeps its router remit.** It is now a
   **doer-of-orchestration**: given a goal, it spawns whatever typed role it needs, assigns one bounded
   unit of work, awaits the return, relays any surfaced decision to the owner, and advances (spawn the
   next role, or report "done"). It **retains** routing ("who do I need?", `/fkit-query`, one-off
   `@role` consults) — those do not spin up an orchestration.

2. **The conductor is a conductor, not a performer.** It **never writes source and never reviews.**
   Every role's *actual work* runs in that role's **own fresh spawned context** — so reviewer
   independence (a fresh context, ADR-010 §Context) is **preserved**: the review of code the coder wrote
   still happens in a different context than wrote it. Orchestration *sequences* the separate contexts;
   it does not merge proposal, build, and approval into one.

   > ⚠️ **Dated note 2026-10-09 (`0498`) — the never-list above gains a third item: the conductor also
   > never diagnoses.** Decision 2 is **left byte-identical**. Owner rulings 2026-10-08, via
   > `AskUserQuestion` in a `fkit lead` session (relayed in task `0498`'s brief): **L1** — the lead
   > still answers *"is this OK / expected?"* from the spec, a brief, the wiki or an ADR, with at most
   > 1–2 fact lookups; the first *"why does the code/system do this?"* goes to a spawned `@fkit-coder`
   > (or the owning role). Tripwire: a second file read to explain a behaviour, or any log read to
   > explain a failure. **L2** — the hand-off is said to the owner (*"a coder is finding the cause"*).
   > **L3** — the lead's own hypothesis never goes into a spawn prompt or a brief as fact: left out, or
   > marked an unverified guess. **L4** — a read approval the owner gave the lead (e.g. read-only
   > production logs) is relayed to the spawned role quoted verbatim with its date and channel; it
   > authorises no write and is **not** the ADR-055 declared-approval write marker — a diagnosis spawn
   > is read-only and carries no marker. Carried by `claude/agents/fkit-lead.md` (a fourth conductor
   > discipline, *"Hand off the first 'why' — never diagnose"*; a *"Never diagnose, yourself"* hard
   > rule; a routing line; the orient line narrowed to *"1–2 fact lookups, not diagnosis"*) and by the
   > role summaries in the `fkit-team` roster, PROJECT.md and `architecture.md`. This **extends**
   > Decision 2 and reverses nothing. It is **prose-enforced** — the same "trust, not proof" cost as the
   > honesty clause; no hook or tool changed. It narrows the risk §Consequences names: a driver that
   > starts *judging* instead of delegating. **Why ⚠️ and not ⛔:** nothing here is overturned; the
   > never-list grew. **Status stays `accepted`.**
   > Owner rulings 2026-10-09, same channel: **Q3** — the tripwire wording above (a second file read to
   > explain a behaviour, or any log read to explain a failure) is this ruling, not L1's; it refines L1.
   > **Q4** — one owner override: if the owner, told it is a coder's job, still asks the lead to look
   > itself, it may, labelled as the lead's own unverified look. So "never diagnoses" is the default, not
   > absolute against an explicit owner ask; the *"Never diagnose, yourself"* hard rule names this one
   > exception.

3. **The driver session holds the owner channel; workers return questions, never ask them.** A spawned
   worker that hits a decision **returns** it as structured text (`NEEDS-DECISION { question, options,
   recommendation, context }`); the driver — a live session — calls `AskUserQuestion` and **blocks on a
   real owner answer**, then spawns the next unit with the answer folded in. This **is** ADR-021's own
   "return open questions" contract applied at scale — the feature is built on the constraint, not in
   conflict with it.

4. **`ADR-010`'s other decisions stand.** Sessions stay role-locked (Decision 1); role separation stays
   structural via the ADR-018 hook (Decision 2); cross-role work is still consult, not role-switch
   (Decision 4); `skills_for_role()` stays the single source of truth (Decision 5). The conductor
   **spawns consults**; it does not role-switch.

5. **No new role; lead's *nature* changes, not the team count.** The seven→eight count question
   ([ADR-028](adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md)) is untouched. But every doc
   asserting lead "does no work itself" / "router, not a doer" goes stale and must be corrected
   (`fkit-lead.md`, the four `skills_for_role()` mirrors, `fkit-claude.sh:165,440,467`, PROJECT.md, the
   wiki) — tracked in the design report §11, not here.

## The plan-gate honesty clause — the one accepted cost, stated unsoftened

**On the orchestrated implementation path, "no code before the owner approves the plan" downgrades from a
runtime write-wall to prose.** `fkit-task-ship-loop`'s plan gate is protected by Claude Code **plan
mode** — a *session* write-wall and ADR-019's one unremovable checkpoint. Plan mode is interactive with
the owner and **cannot function in a spawned worker** (Decision-3 fact 2). So under orchestration the
driver enforces the ordering by splitting it: spawn coder **for the plan only** (prompt: *"write no
source, return the plan"*) → owner approves → spawn coder **to implement**. The "write nothing yet" is a
**prose instruction in the worker prompt, not a runtime wall** — a confused or injected worker could
write before approval and nothing structural stops it.

This is the same shape as [ADR-025](adr-025-spawned-agents-may-invoke-the-task-movers.md)'s honesty
clause (prevention removed, ordering-by-prose in its place). **The owner accepted it knowingly
(2026-07-22).** It is recorded here so no future reader mistakes the orchestrated path for carrying plan
mode's structural guarantee. Owners who want the structural wall for a given task still ship it the old
way: `fkit coder` + `/fkit-task-ship-loop`.

> ⚠️ **Dated pointer note 2026-10-06 (`0475`) — the implementing spawn on this path now has a written
> rule; read [ADR-055](adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver.md).**
> This clause is **left byte-identical**. It decides the plan-only → owner approves → implement split; it
> never said what lets the *implementing* coder write. Until 2026-10-06 only the sprint loop's
> declared-approval marker did (ADR-032 §Amendment A1), so a lead-driven implement spawn **outside** the
> sprint loop had no rule to write under. ADR-055 (owner ruling 2026-10-02) extends that one marker to
> `fkit-lead` on this conductor path: caller, the approved plan verbatim (or the exact approved scope),
> the owner's approval **quoted verbatim with its date and channel**, and the worker role (Build or
> Process-review). **The cost this clause states is unchanged and not softened** — ADR-055 records it as
> the **same accepted cost with wider exposure**, because more spawns now rely on prose. A quote is
> fidelity, not proof. **Why ⚠️ and not ⛔:** nothing here is overturned; the path this ADR decided gained
> a written rule. **Status stays `accepted`.**

> ⚠️ **Dated wording note 2026-10-30 (`0545`) — this note also qualifies the “structural write-wall”
> wording in Options considered.** Historical Claude headless tests refused `Write` outside the plan
> file but allowed Bash writes; `Edit` was not directly tested. Interactive models declined writes
> before runtime handling could be tested: 3m declined twice; 3m-bis was not triggered/not
> applicable. Neither is a pass. With plan review on (the `fkit coder` default), drafting and review
> precede native Claude plan mode, which covers only approval. The historical “old way” pointer
> means `fkit coder --no-plan-review` + `/fkit-task-ship-loop` for native plan mode from the start;
> the historical headless evidence does not establish a full write-wall. Codex planning/write limits
> remain instruction-enforced, both fkit hooks disabled. The plan-only → owner approval → implement
> split and its accepted prose-enforced cost remain unchanged. Status stays `accepted`. Existing ADR
> text remains byte-identical. Wording checked against current canonical procedures and retained
> evidence on 2026-10-30; no new plan-mode runtime test ran.

## Options considered

- **Evolve `fkit-lead` into the conductor (chosen).** Delivers the single-point-of-interaction the owner
  asked for at the lowest structural cost; keeps the team count; reuses the ADR-018 hook and the existing
  launcher wiring. Accepts the plan-gate downgrade on the orchestrated path.
- **Add a new "orchestrator" role.** Rejected by the owner (keep the name, grow lead). Also trips the
  seven→eight count ripple (ADR-028) for no authority gain — orchestration is not a new *authority*, it
  is lead's routing remit made active.
- **Keep lead a pure router; implementation stays in `fkit coder` sessions; orchestrate only
  review/close/relay (the "split" scope).** Preserves plan mode's structural write-wall. **Declined by
  the owner** in favor of full drive scope — maximum single-point-of-interaction over the structural
  gate, chosen knowingly.
- **Timed auto-proceed so the loop never blocks on the owner.** Already declined for the task loop
  (ADR-024, on cost); the same cost applies. Live-relay (Decision 3) is the deliberate alternative — it
  keeps the owner, it does not remove them.

## Consequences

- **Positive:**
  - One agent per terminal that drives the whole team — the workflow the owner asked for.
  - Reviewer independence and the coder's sole-source-write authority are **preserved** — the conductor
    delegates work to fresh spawned contexts and writes no source itself.
  - Reuses the ADR-018 hook and existing launcher control flow; no launcher control-flow change, one new
    owned skill, a wider prompt.
- **Negative / costs — stated plainly:**
  - **The plan-gate downgrade** (honesty clause above). The biggest change to fkit's guarantee surface;
    accepted, unmitigated on the orchestrated path.
  - **Orchestrator context accumulation.** A sprint-long driver accumulates every task's plan, diff, and
    review. Mitigated because the *work* runs in fresh spawned contexts; residual: if the driver starts
    *judging* (reviewing/designing) instead of delegating, it becomes the ADR-010 anti-pattern.
    **Prose-enforced discipline** ("delegate, never substitute") — the same class as the two-hop cap.
  - **Doc-drift blast radius** (Decision 5): the four `skills_for_role()` mirrors + launcher text +
    agent prompt + PROJECT.md + wiki, plus the independent `architecture.md` §5.2 stale-lock fix.
- **Residual risks / "re-raise only if":**
  - **A spawned worker writes source before the owner approves the plan** — that is the honesty clause's
    named cost becoming concrete, **not** a new defect against the mover or the hook. If it costs real
    quality, reopen the drive-scope decision (revisit the "split" option), do not patch the skill.

    > ⚠️ **Dated pointer note 2026-10-06 (`0475`).** On the lead path this trigger now also reads against
    > [ADR-055](adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver.md)'s
    > marker and its own re-raise conditions. The bullet above is **left byte-identical**. The fact is
    > carried by the note below §*"The plan-gate honesty clause"* — deliberately not restated here, so
    > there is one place to keep true rather than two. **Status stays `accepted`.**

  - **A future Claude Code exposes `AskUserQuestion` (or plan mode) to spawned subagents** — that would
    let a worker gate its own plan, removing the downgrade; re-measure per ADR-021's discipline and
    reopen the plan-gate clause.
  - **The conductor is observed substituting its own judgment for a role's** (reviewing, designing) —
    that is the context-accumulation risk realized; strengthen the prompt discipline, it is not grounds
    to reverse the conductor decision.
  - Do **not** re-raise *"lead is a router that does no work"* — **that is what this ADR reverses.**
  - Do **not** re-raise *"the orchestrated plan gate is only prose"* — stated here, knowingly, in the
    honesty clause. A finding must show it **failing in practice**, not restate its known limit.

## Related

- [`reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
  — the design this records; §3 feasibility, §3.5/§9.1 the plan-gate cost, §10 the ADR plan.
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — §Decision 3 **reversed**; 1, 2, 4, 5
  unaffected. File kept intact, not edited or renumbered.
- [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the
  hook whose real-caller-identity enforcement is the **enabling fact** for spawned workers running their
  own skills.
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — the session-only owner
  channel this design is **built on**, not in conflict with.
- [ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md) — lead already inherits
  Write/Edit; corrects `fkit-lead.md:20-24`'s stale "no tools" prose.
- [ADR-024](adr-024-ship-loop-owner-question-timeout-is-not-built.md) — the declined auto-proceed;
  live-relay is the opposite move, not a reopening.
- [ADR-025](adr-025-spawned-agents-may-invoke-the-task-movers.md) — the honesty-clause precedent.
- [ADR-028](adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md) — the team-count question this
  ADR does **not** touch (no new role).
- [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) — the sprint-ship-loop that
  applies this conductor across a sprint.
- Code: `claude/agents/fkit-lead.md:20-24`, `claude/skills-for-role.sh:37`,
  `claude/fkit-claude.sh:165,257-265,440,466-475`, `claude/skill-ownership-hook.sh:119-136`.
- **Wiki:** **fkit-wiki** should ingest this ADR — an architect never writes the vault.
