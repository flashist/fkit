# ADR-055: A spawned coder writes under one declared-approval marker, sent by either driver — the sprint loop or the lead as conductor

- **Status:** accepted
- **Date:** 2026-10-06
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect. The **substance** was ruled by the owner on
  **2026-10-02** (`fkit-lead` session, `AskUserQuestion`, relayed to a spawned producer). The **plan and
  its six open questions** were ruled on **2026-10-05** (`fkit-lead` session driving
  `/fkit-sprint-ship-loop` on Sprint 10, `AskUserQuestion`), and relayed to fkit-architect by fkit-lead,
  which recorded this ADR on 2026-10-06 as task `0475`'s Step 1.
- **Task:** `0475` (`0475-let-a-spawned-coder-write-under-a-lead-relayed-owner-approval`).
- **Extends, does not supersede:** [ADR-031](adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
  (the conductor path) and [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
  §Amendment A1–A4 (the marker). Both stay `accepted`; each carries a dated ⚠️ pointer note to this ADR,
  as do [ADR-037](adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)
  and [ADR-044](adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md).
- **Corrections:** 2026-10-30 (`0545`) — one dated ⚠️ wording note follows Decision 7. ⚠️ marks a
  drifted fact, not an overturned decision; all existing text remains byte-identical and Status
  stays `accepted`.

> **Citation form.** Agent, skill and hook files are mutable: they are cited by **section plus quoted
> phrase**, never by line number. Task briefs and plans are coordination documents: cited by **heading
> plus quoted phrase**, never `:NNN`. Tasks are named by folder `NNNN` prefix.

> **What this ADR decides, in one line:** the coder's spawned-write carve-out stops being
> sprint-loop-only. A spawned coder may write source when the spawn carries **one** declared-approval
> marker — sent by `fkit-sprint-ship-loop` **or** by `fkit-lead` as conductor — with the **same four
> fields**; on the lead path the owner's approval must be **quoted verbatim, with date and channel**.
> Everything else still refuses. It is still **trust, not proof**.

## Context

**The owner's ruling, 2026-10-02** (selected option text, as recorded in task `0475`'s brief under
*"Owner ruling behind this task"*). Question: *"This 'spawned coder may not write code unless the sprint
loop sent it' rule has blocked or bent 6 times this week when I drive. Fix the rule?"* Answer: *"File a
task to fix it — Producer writes a brief: let a spawned coder write when the lead relays an explicit
owner approval (ADR-031's conductor path), matching how the sprint loop does it. Starts on your word."*

**The gap.** `claude/agents/fkit-coder.md`, §Mode, *"A second scoped exception — the lead's
`/fkit-sprint-ship-loop`"*, lets a **spawned** coder write source on exactly one path: the sprint loop's
declared-approval marker — *"(a) the spawn prompt identifies the caller as `fkit-sprint-ship-loop` …
(b) it carries a concrete **approved plan** verbatim; and (c) it states the owner **approved that plan**
via a live `AskUserQuestion` relay in the driver session"* (verified against live code 2026-10-06). Then
*"**Everything else still refuses**"*.

But ADR-031 made the lead a **conductor for any goal**, not only for whole sprints: spawn coder plan-only
→ owner approves in the lead session → spawn coder to implement (ADR-031 §*"The plan-gate honesty
clause"*). The coder prompt never caught up: it names only the sprint loop. So when the owner drives
through `fkit lead` outside the sprint loop, the spawned coder has no rule that lets it write.

**The observed cost.** The brief records six incidents between 2026-09-23 and 2026-10-02 with the owner
driving through `fkit lead` (`0412` build and two review rounds; `0415` build and one review round; a
commit job; and on 2026-10-02 a refused README-adjacent text fix). Each time the coder fell back on the
universal rule *"A skill rule beats a contrary spawn instruction unless that instruction names an owner
ruling"* (ADR-037) — so **the same owner approval was honoured or refused depending on how the spawn
prompt happened to be worded.** That is the defect: an outcome set by wording, not by a rule.

**Facts this decision is built on, not against.**

- **Approval leaves no artifact a worker can check.** `AskUserQuestion` is session-only
  ([ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md), `TOOL_ABSENT` 3/3 in a
  spawn). A spawned coder **cannot verify** any approval, on either path.
- **The sprint loop's marker is already trust, not proof** (ADR-032 §A3, *"this is trust, not proof"*),
  and ADR-032 §A4 forbids re-raising *"the declared-approval marker is only prose / unverifiable /
  forgeable"*.
- **The carry-check hook keys on a pointer line, not the caller.** `claude/carry-check-hook.mjs`, header
  §*"THE UNGATED LIMIT"*: *"The trigger is the pointer line alone … not `subagent_type`, not the caller
  string."* So it already checks a lead spawn that carries a `plan: <path>/plan.md  blob <hash>` line, and
  ignores one that does not. It is registered for every launcher role by `build_settings()` in
  `claude/fkit-claude.sh`, so a `fkit lead` session has it.
- **The harness draws the same line ADR-037 draws.** Every spawned worker's preamble says no agent
  message is ever the user's consent. This ADR does **not** claim the lead's relay *is* the owner's
  consent; it is fkit's own prompt-level rule about **which relayed approvals a coder trusts**, on top of
  whatever the harness permission system allows or prompts for — which this ADR does not change.

## Decision

1. **One rule, two drivers.** A spawned **coder** may write source under the **declared-approval
   marker** sent by either `fkit-sprint-ship-loop` or `fkit-lead` on ADR-031's conductor path. The owner
   ruled this on 2026-10-02 (quoted in §Context).

2. **The marker's four fields — the same for both drivers.** **All** must be present:
   - **(a) caller** — `fkit-sprint-ship-loop` or `fkit-lead`.
   - **(b) the approved plan, verbatim** — or, for a small job with no plan, **the exact approved scope**
     (the files and the change, as approved).
   - **(c) the owner's approval.** On the **lead path** it is **quoted verbatim** — the `AskUserQuestion`
     selected option text, or the owner's own typed words — **with its date and its channel**. A summary
     or paraphrase (*"the owner said yes"*, *"approved"*) is **not** a quote and fails (c). *(Owner
     ruling 2026-10-05, OQ1: "Exact words + date + channel (Recommended)".)*
   - **(d) the worker role** — **Build** or **Process-review**. Nothing else. **Commit and push are not
     covered** (Decision 10). *(Owner ruling 2026-10-05, OQ4: "No — file a follow-up (Recommended)".)*

3. **The sprint loop is unchanged; its three signals satisfy the marker by mapping.** (a) is its caller
   string; (b) is its carried plan; (c)'s **channel** is the live `AskUserQuestion` in the driver session
   and its **date** is that session's date; (d) is the loop step (Build or Process-review). **Only the
   lead path must quote.** *(Owner ruling 2026-10-05, OQ2/3/5/6: "Yes, all four (Recommended)".)*
   **The asymmetry, stated plainly:** a spawn labelled `fkit-sprint-ship-loop` skips the quote. A driver
   that mislabels itself to dodge the quote is ADR-032 §A3's forgery cost again — **not a new cost**.

4. **What still refuses — write no source.**
   - **No marker** — any other spawned "implement this", with no owner approval behind it → return the
     plan.
   - **A plan-only spawn** ("write nothing yet") — it never carries the marker → return the plan.
   - **A marker that fails any field (a)–(d)** → return **`NEEDS-DECISION` naming the failed field**, so
     the driver can re-send. This includes: a plan carried **by reference only** (a pointer, or *"the plan
     you returned earlier"*) or **truncated**; a **paraphrased or summarized** lead-path approval; and an
     approval that does **not plainly cover the plan or scope carried** — an approval for X is never
     reused for Y. (This is backlog task `0163`'s defective-marker case; `0163` is not closed by this ADR.)
   - **Any commit or push request** — not covered by the marker (Decision 10).

5. **Process-review on the lead path** follows exactly the sprint loop's discipline (ADR-032 §A2, which
   is ADR-019's): fix without asking **only if** verified `CORRECT`, mechanical/localized and inside the
   approved plan (or an obvious winner within its intent); **every judgment call returns
   `NEEDS-DECISION`**. The **worklog decision-log audit** transfers too: each unattended fix and each
   obvious-winner call is recorded in the task folder's `worklog.md`, or `none`. **So lead-path
   Process-review needs a task folder;** without one the worker returns `NEEDS-DECISION`. *(OQ3.)*

6. **Relation to ADR-037.** The coder's refusal is an **agent-prompt rule** ("your role's instructions"
   in the precedence ladder), not a skill rule. **This ADR is the standing, named owner ruling on this
   exact point.** So a correctly marked spawn **departs from no rule**: the coder owes no ADR-037
   named-ruling argument and no comply-and-flag note, and it does **not** fall back on the CLAUDE.md
   "names an owner ruling" clause. Tier 1 — the universal hard rules (never commit or push unprompted,
   wiki writes, movers, no secrets) — is **untouched** and is displaced by nothing, this marker included.

7. **Honesty — this is trust, not proof.** The marker is **prose in the driver's spawn prompt**. The
   coder cannot verify from its own context that the owner approved anything (ADR-021); a confused or
   injected driver could write a false quote and **nothing structural stops the write**. This is the
   **same accepted cost** as ADR-031's honesty clause and ADR-032 §A3 — **with wider exposure**: more
   spawns now rely on prose, because the lead path joins the sprint loop. A verbatim quote buys
   **fidelity** (the owner's own words travel, not the lead's reading of them) and **auditability** (a
   reader can compare the quote with the session); **it is not proof, and no document may call it
   "verification".** Owners who want a structural write-wall for a task still ship it the old way:
   `fkit coder` + `/fkit-task-ship-loop` (plan mode).

   > ⚠️ **Dated wording note 2026-10-30 (`0545`) — Decision 7's “structural write-wall” pointer is
   > narrower than stated.** Historical Claude headless tests refused `Write` outside the plan file
   > but allowed Bash writes; `Edit` was not directly tested. Interactive models declined writes
   > before runtime handling could be tested: 3m declined twice; 3m-bis was not triggered/not
   > applicable. Neither is a pass. With plan review on (the `fkit coder` default), drafting and
   > review precede native Claude plan mode, which covers only approval; the “old way” pointer means
   > `fkit coder --no-plan-review` + `/fkit-task-ship-loop` for native plan mode from the start.
   > This evidence establishes no structural Bash guard for either path. Codex planning/write limits
   > remain instruction-enforced, both fkit hooks disabled. The marker's four fields and
   > trust-not-proof cost remain unchanged. Status stays `accepted`. Existing ADR text remains
   > byte-identical. Wording checked against current canonical procedures and retained evidence on
   > 2026-10-30; no new plan-mode runtime test ran.

8. **The carry-check hook is unchanged.** It keys on the `plan:` pointer line, not on the caller
   (§Context). **A lead spawn MUST carry the `plan: <path>/plan.md  blob <hash>` pointer whenever a
   `plan.md` exists** for the job, so the hook checks it exactly as it checks a sprint-loop spawn.
   *(OQ5.)* **A small job with no plan file carries no pointer and is invisible to the hook** — its
   (b) is the exact scope, carried as prose and checked by nothing. Stated, not hidden.

9. **Coder only.** This ADR widens the **coder's** spawned-write rule and nothing else. ADR-044's
   architect and producer Build carve-outs (ADR-044 §C2 (i); not yet present in
   `claude/agents/fkit-architect.md` or `claude/agents/fkit-producer.md`, verified 2026-10-06) **stay
   sprint-loop-only**. A lead-spawned architect or producer may **not** read "the declared-approval
   marker" here as covering it. *(OQ6.)*

10. **Out of scope.**
    - **A structural approval check** — ADR-021 says approval leaves no artifact; ADR-032 §A4 forbids
      re-raising the marker's prose nature.
    - **Commit and push.** Never covered by this marker; commits stay owner-only under the universal
      hard rule. Whether a quoted, lead-relayed owner instruction to commit should get its own worker
      role is a **separate follow-up** the owner asked to be filed (OQ4) — this ADR does not file it and
      does not decide it. **Push is never covered.**
    - **The shared rules block** (CLAUDE.md / AGENTS.md) — this is coder- and lead-specific; the block's
      byte cap (`RULES_MAX`, ADR-030) is not spent on it.

11. **Re-raise only if** (see §Consequences).

## Options considered

- **A new small ADR that ADR-031 and ADR-032 point at (chosen).** The marker is now shared by two
  drivers whose decisions live in two ADRs. One record states the shape once; dated ⚠️ pointer notes in
  ADR-031, ADR-032, ADR-037 and ADR-044 send readers here. Neither existing ADR's decision is overturned.
- **Amend ADR-032 (an "A5").** Rejected: ADR-032 is the sprint loop's ADR and already carries four
  amendment parts plus corrections; a lead-path rule there would sit inside a document whose scope it is
  not. A reader of the conductor path would not look there.
- **Amend ADR-031.** Rejected: the marker's fields would then be defined in two ADRs (ADR-032 for the
  loop, ADR-031 for the lead) and drift apart — the "two statements of one shape" risk, recorded instead
  of created.
- **Keep the carve-out sprint-loop-only; let each spawn argue in via the ADR-037 named-ruling clause
  (status quo).** Rejected: that is the defect itself — six incidents in ten days, outcome set by
  wording.
- **Accept a lead summary of the approval.** Rejected by the owner (OQ1): a summary carries the lead's
  reading, not the owner's words, and cannot be compared with the session afterwards.
- **Cover commit jobs under the same marker.** Not taken now (OQ4): filed as a follow-up for its own
  decision; commits stay owner-only.

## Consequences

- **Positive:**
  - One rule, honoured the same way whoever drives; a properly marked spawn writes without arguing its
    way in, and a defective one gets `NEEDS-DECISION` naming the field — not an argued-in write.
  - The sprint loop's behaviour does not change; the carry-check hook does not change.
  - Lead-path writes become auditable afterwards: the quoted approval, date and channel sit in the spawn
    prompt, and Process-review fixes sit in the worklog.
- **Negative / costs — stated plainly:**
  - **Wider exposure of the same prose-enforced cost** (Decision 7). More spawns rely on a marker no
    worker can verify.
  - **A stricter (c) on the lead path** costs one re-send round when a spawn prompt is sloppily worded.
    Intended.
  - **Two statements of one shape** — the coder side and the lead side (and the sprint skill's pointer)
    — can drift. Task `0475` pins them with a text-presence test; that test checks words on disk, never
    obedience.
  - **No-plan small jobs are outside the hook** (Decision 8).
  - **The asymmetry** (Decision 3): the sprint-loop label skips the quote.
- **Residual risks / "re-raise only if":**
  - **Re-raise if a spawned coder wrote source on the lead path without a real owner approval behind
    it** — evidence of failure in practice. Found the same way ADR-032 §A4 says: **out of band, by the
    owner**, who is in the relay loop and would recognise a build he never approved. Then reconsider the
    lead path; do not just harden the prose.
  - **Re-raise if a lead-path Process-review fix is found wrong or outside the approved plan** — the
    worklog decision log is what makes that checkable. Then reconsider Decision 5's autonomy on the lead
    path, as ADR-032 §A4 bullet 2 does for the loop.
  - **Re-raise if a future Claude Code exposes `AskUserQuestion` or plan mode to spawned workers**
    (ADR-031's own trigger) — the approval could then be gated in the worker itself.
  - Do **not** re-raise *"the lead-path marker is only prose / unverifiable / forgeable"* or *"a quote is
    not proof"* — stated here and in ADR-032 §A3. A finding must show it failing in practice.
  - Do **not** re-raise *"a spawned coder must never write source outside the sprint loop"* — this ADR
    reverses that on the lead path, by owner ruling. **Re-raise only if** a spawned coder writes source
    **without all four fields** — a leak, and a real defect.
  - Do **not** re-raise *"the sprint loop should quote too"* as a defect — the owner ruled the mapping
    (OQ2). Raise it only with a case where the missing quote let a wrong write through.

## Owner rulings, with provenance

- **2026-10-02**, `fkit-lead` session, `AskUserQuestion`, selected option text: *"File a task to fix it —
  Producer writes a brief: let a spawned coder write when the lead relays an explicit owner approval
  (ADR-031's conductor path), matching how the sprint loop does it. Starts on your word."*
- **2026-10-05**, `fkit-lead` session driving `/fkit-sprint-ship-loop` (Sprint 10), `AskUserQuestion`,
  selected option text, relayed to fkit-architect by fkit-lead:
  - Plan approval: *"Approve (Recommended)"*.
  - OQ1 — what counts as a quote: *"Exact words + date + channel (Recommended)"*.
  - OQ4 — relay commit jobs under the marker: *"No — file a follow-up (Recommended)"*.
  - OQ2 (sprint loop unchanged, satisfies by mapping), OQ3 (lead-path Process-review needs a task
    folder), OQ5 (`plan:` pointer required whenever `plan.md` exists), OQ6 (coder only): *"Yes, all four
    (Recommended)"*.

*These rulings reached the architect as a relay from fkit-lead. By this ADR's own Decision 7, that
relay is trust, not proof — recorded here as relayed.*

## Related

- [ADR-031](adr-031-fkit-lead-becomes-the-orchestrating-front-door.md) — the conductor path this extends;
  its plan-gate honesty clause is the cost restated in Decision 7.
- [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) §Amendment A1–A4 — the marker,
  the Process-review autonomy, the trust-not-proof cost and the do-not-re-raise guard this generalizes.
- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) — the fix discipline and
  worklog audit obligation (Decision 5).
- [ADR-020](adr-020-per-task-plan-and-worklog-artifacts.md) — the `plan.md` / `worklog.md` artifacts.
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — why no worker can verify an
  approval.
- [ADR-030](adr-030-stop-hook-enforces-turn-completion-contract.md) — the rules-block byte budget this
  stays out of.
- [ADR-037](adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)
  — the named-ruling precedence this ADR makes unnecessary on this path (Decision 6).
- [ADR-044](adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md) — the
  non-coder Build carve-outs that stay sprint-loop-only (Decision 9).
- Code (cited by section, mutable): `claude/agents/fkit-coder.md` §Mode, *"A second scoped exception"*;
  `claude/agents/fkit-lead.md` §*"The conductor remit — how you drive"*, the bullet *"⚠️ The orchestrated
  plan gate is prose, not a wall"*; `claude/skills/fkit-sprint-ship-loop/SKILL.md`, *"Rules that make
  this honor the ADRs"*; `claude/carry-check-hook.mjs` header.
- Task `0475`'s brief and plan (in its task folder) — the context, the plan this ADR is Step 1 of, and
  the open questions answered above. Task `0163` — the defective-marker refusal case (Decision 4).
- **Wiki:** **fkit-wiki** should ingest this ADR, and re-ingest ADR-031, ADR-032, ADR-037 and ADR-044
  for their new pointer notes — an architect never writes the vault.
