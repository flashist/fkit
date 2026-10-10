# ADR-055: A spawned coder writes under one declared-approval marker, sent by either driver — the sprint loop or the lead as conductor

**Date**: 2026-10-06
**Status**: accepted

**Extends, does not supersede**: [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] (the conductor path) and [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] §Amendment A1–A4 (the marker). Both stay `accepted`; each — and ADR-037 and ADR-044 — carries a dated ⚠️ pointer note here.

## Context
**Owner ruling, 2026-10-02** (`fkit-lead` session, `AskUserQuestion`, selected option text). Question: *"This
'spawned coder may not write code unless the sprint loop sent it' rule has blocked or bent 6 times this week
when I drive. Fix the rule?"* Answer: *"File a task to fix it — Producer writes a brief: let a spawned coder
write when the lead relays an explicit owner approval (ADR-031's conductor path), matching how the sprint loop
does it. Starts on your word."* The plan and its six open questions were ruled on **2026-10-05**; the
architect recorded this ADR on 2026-10-06 as task `0475`'s Step 1.

**The gap.** `claude/agents/fkit-coder.md` §Mode let a **spawned** coder write source on exactly one path: the
sprint loop's three-signal marker. Everything else refused. But ADR-031 made the lead a **conductor for any
goal** (plan-only spawn → owner approves → implement spawn), and the coder prompt never caught up.

**The cost.** Six incidents 2026-09-23 → 2026-10-02 with the owner driving via `fkit lead` (`0412` build + two
review rounds, `0415` build + one round, a commit job, a refused README-adjacent text fix). Each time the coder
fell back on the ADR-037 *"names an owner ruling"* clause — ⛔ **so the same owner approval was honoured or
refused depending on how the spawn prompt was worded.** An outcome set by wording, not by a rule.

**Facts it is built on:** approval leaves no artifact a worker can check (ADR-021); the sprint marker is
already trust, not proof (ADR-032 §A3, and §A4 forbids re-raising that); the carry-check hook keys on the
`plan:` pointer line, not the caller, and is registered for every launcher role; and the harness's own rule —
no agent message is ever the user's consent — is **not** claimed away: this is fkit's prompt-level rule about
which relayed approvals a coder trusts.

## Decision
1. **One rule, two drivers.** A spawned coder may write source under the declared-approval marker sent by
   `fkit-sprint-ship-loop` **or** `fkit-lead` on the conductor path.
2. **Four fields, all required, the same for both drivers:** (a) **caller**; (b) the **approved plan verbatim**
   — or, for a small job with no plan, the **exact approved scope**; (c) the **owner's approval** — on the
   **lead path quoted verbatim** (selected option text or his own typed words) **with its date and channel**;
   a summary (*"the owner said yes"*) fails (c) (owner, OQ1); (d) the **worker role** — **Build** or
   **Process-review**, nothing else.
3. **The sprint loop is unchanged** — its three signals satisfy the four fields **by mapping** ((c)'s channel is
   the live `AskUserQuestion` in the driver session, its date that session's date). **Only the lead path must
   quote.** ⚠️ The asymmetry is stated: a driver mislabelling itself to dodge the quote is ADR-032 §A3's forgery
   cost again, not a new one.
4. **Still refuses:** no marker; a plan-only spawn; a marker failing any field → `NEEDS-DECISION` **naming the
   failed field** (incl. a plan carried by reference or truncated, a paraphrased approval, an approval that
   does not plainly cover the plan/scope carried — task `0163`'s case, not closed by this ADR); **any commit or
   push request**.
5. **Process-review on the lead path** follows ADR-032 §A2 / ADR-019 exactly: unattended fixes only if verified
   `CORRECT`, mechanical/localized and in-plan; judgment calls → `NEEDS-DECISION`; the `worklog.md`
   decision-log audit transfers — **so lead-path Process-review needs a task folder** (OQ3).
6. **Relation to ADR-037:** the coder's refusal is an agent-prompt rule, and **this ADR is the standing, named
   owner ruling on that exact point** — a correctly marked spawn departs from no rule and argues nothing.
   Tier 1 (never commit/push unprompted, wiki, movers, secrets) is displaced by nothing.
7. **Honesty — trust, not proof.** The marker is prose; a confused or injected driver could write a false
   quote and nothing structural stops the write. **Same accepted cost as ADR-031's honesty clause and ADR-032
   §A3, with wider exposure.** A quote buys **fidelity** and **auditability**; ⛔ **no document may call it
   "verification".** A structural write-wall is still available the old way: `fkit coder` +
   `/fkit-task-ship-loop` (plan mode).
8. **Carry-check hook unchanged.** A lead spawn **must** carry the `plan: <path>/plan.md  blob <hash>` pointer
   whenever a `plan.md` exists (OQ5). ⚠️ A no-plan small job carries none and is **invisible to the hook**.
9. **Coder only** (OQ6). ADR-044's architect/producer Build carve-outs **stay sprint-loop-only**.
10. **Out of scope:** a structural approval check; **commit and push** (owner OQ4: *"No — file a follow-up
    (Recommended)"* — filed as `0497`, open); the shared rules block (byte cap, ADR-030).

**Options rejected:** an "A5" amendment to ADR-032 (wrong home for a lead-path rule); amending ADR-031 (two
statements of one shape would drift); the status quo of argued-in spawns (the defect itself); accepting a
lead summary of approval (owner, OQ1); covering commit jobs now (OQ4).

## Consequences
- **Positive:** one rule, honoured the same way whoever drives; a defective marker gets `NEEDS-DECISION`
  naming the field, not an argued-in write; sprint loop and hook unchanged; lead-path writes become
  auditable (quote, date, channel in the spawn; fixes in the worklog).
- **Costs:** wider exposure of the same prose-enforced cost; a stricter (c) costs a re-send round on a sloppy
  spawn (intended); coder side, lead side and the sprint skill's pointer can drift — `0475` pins them with a
  text-presence test that checks **words on disk, never obedience**; no-plan jobs are outside the hook.
- **Re-raise if:** a spawned coder wrote on the lead path without a real owner approval (found out of band, by
  the owner); a lead-path Process-review fix is found wrong or out of plan; a future Claude Code exposes
  `AskUserQuestion` or plan mode to spawned workers.
- ⛔ **Do not re-raise:** "the lead-path marker is only prose / forgeable" or "a quote is not proof"; "a spawned
  coder must never write outside the sprint loop" (reversed here by owner ruling — a write **without all four
  fields** is the real leak); "the sprint loop should quote too" (owner ruled the mapping, OQ2).
- *The 2026-10-05 rulings reached the architect as a relay from `fkit-lead`; by Decision 7 that relay is
  trust, not proof — recorded as relayed.*

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the conductor path this extends; its honesty clause is the cost restated in Decision 7
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — §A1–A4, the marker this generalizes
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the fix discipline and worklog audit (Decision 5)
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — `plan.md` / `worklog.md`
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why no worker can verify an approval
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the named-ruling precedence made unnecessary on this path
- [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]] — the non-coder carve-outs that stay sprint-loop-only
- [[decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default]] — plan review is unchanged by this marker (the plan step writes no source)
- [[tasks/let-a-spawned-coder-write-under-a-lead-relayed-owner-approval]] — `0475`, the task that recorded and built it
- [[tasks/make-the-lead-hand-a-code-level-why-question-to-a-spawned-coder-instead-of-tracing-code-itself]] — `0498`: a diagnosis spawn is read-only and carries **no** marker; a relayed **read** approval is not this
- [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] — `0150`, the earlier "verbatim" tightening of the sprint marker
- [[systems/role-locked-sessions]] · [[tasks/sprint-10-the-0472-0482-batch]]
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`, closing a one-way link):* [[systems/fkit]] — fkit
