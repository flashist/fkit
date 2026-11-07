# Make the lead advance authorized work after worker completion

## ID
0554

## Sprint
Sprint 15

## Priority
2

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Driver claim at planning start — 2026-11-06, root `fkit-lead` ship-loop.** The owner's new top-priority
ruling and instruction to work on these fixes first supersede the previous next-task order.
Claimed for plan-only work after deterministic eligibility and filing cross-checks; depends on
nothing. Plan review remains ON (default). No implementation-plan approval or source-write
authority is implied. The filing's original Backlog/start-nothing statements are historical;
normal role, review and owner approval gates remain.

**Owner request — 2026-11-06, user chat in the root `fkit-lead` session, relayed verbatim:**

> I've noticed that FKIT-LEAD is right now very passive and not proactive. It often waits for me to push it forward, which sucks. Also, when there are questions (like the question you've just asked me) - it often doesn't ask it via the interactive actions interface and if there are more than 1 question, it often combines them into 1 question and asks it as 1 big chunk of text expecting me to choose the option "write your answer" where I write the answer verbatim and not able to choose an answer from the options that the lead is supposed to give me. Let's fix it first. Brief as many tasks to the current sprint as needed to handle all of the things that I mentioned, those things should be our top priority things for the current sprint, we will work on them first.

This brief covers proactive continuation. The reported passivity is an observation, not a proved
source failure. ADR-031 already makes lead a conductor; the current lead instructions and sprint
ship-loop already describe advancing on worker results. Close the behavior gap without inventing
background execution, weakening consent, or diagnosing the observed session during filing.

Read-only grounding: wiki decisions ADR-031/ADR-061 and the current `codex/README.md`, migration
`model-agnostic-sprint/HANDOFF.md`, `claude/agents/fkit-lead.md`,
`claude/skills/fkit-sprint-ship-loop/SKILL.md` and `codex/server.mjs`. The helper is session-scoped
stdio, not a daemon; interactive startup seeding does not establish later turn resumption.

## What to build

1. Make the lead consume a completed worker result, inspect the promised artifacts where required,
   and advance to the next already-authorized step or eligible task without an owner “continue”
   ping. Apply this to bounded conductor handoffs and the sprint loop; delegation remains to fresh
   typed roles. A progress update or a What's next? footer must not itself become a stop gate.
2. Define the continuation boundary across success, partial/empty return, blocked verification,
   failed closure handoff, and owner decision. Preserve accurate paired statuses, skip sets,
   existing retry budgets and explicit task/session rulings. Exhausted allowance never implies
   another launch. Safely parked work may be skipped for other authorized work; torn state and
   genuine judgments keep their existing stop rules. Do not invent a general retry allowance.
3. Pause dependent work only at actual approval/judgment/blocker/user-stop boundaries, including
   rejected plans, unresolved scope, exhausted retries and unavailable host resumption. Preserve
   real plan approval before source, approved-plan fidelity, fresh independent reviews, producer-only
   terminal movers and agent-closed markers. No commit/push or silence-as-approval.
4. Inspect actual supported runtime completion/return behavior during planning and identify exactly
   what fkit can drive in a live turn. Where the client cannot resume a turn, say work is paused,
   record a truthful checkpoint through existing artifacts, and identify the real resume action.
   Keep outstanding decisions, retry spend, skip state and next authorized step explicit. Do not
   claim work continues after returning, create a scheduler/service, reactivate hooks, or add a
   self-restart/self-clear mechanism. Existing owner context-management rulings remain intact.
5. Carry the contract through canonical lead/driver instructions, relevant worker-return templates,
   configured runtime bindings and delivered copies. The implementation plan identifies exact
   affected files and any ADR amendment needed; do not patch only generated instructions. Use
   representative examples with permanent task ID plus canonical title, consistent with
   [0553 — Include task titles alongside IDs in owner-facing communication](../../backlog/0553-include-task-titles-alongside-ids-in-owner-facing-communication/brief.md).

## Verification steps

1. Exercise representative worker-completion continuation: a returned verified result leads to
   the next authorized unit without an owner ping; a producer close result is checked before the
   next eligible task is selected. Record actual actions separately from illustrative transcripts.
2. Check a required plan/scope approval stops dependent source work until an actual answer; a
   blocked task with an authorized skip allows eligible independent work. Rejected approval,
   user stop and torn artifacts must not be reported as progress or success.
3. Cover an exhausted explicit retry allowance and an empty worker return: preserve evidence,
   accurate status and the real next decision; no unauthorized relaunch. Include missing owner-form
   capability and a host unable to resume: checkpoint honestly, with no claim of background work.
4. Verify source/prompt delivery and shipped runtime behavior using meaningful coverage in existing
   applicable files (starting with `test/launcher-contract.test.js`) and the checks mapped by
   `CONTRIBUTING.md`. Static instruction inspection and contract fixtures do not prove model
   obedience or actual interactive host continuation. Report real-host checks separately; mark
   unavailable checks unverified. No fake demo or cross-host guarantee.
5. No new permanent test file or prove-red case without individual owner approval at the
   implementation-plan gate. No timing/delay/benchmark investigations, process watching,
   performance gates, account/model/configuration probes or persistent settings repair.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **On merit:** as ranked. First new open task under the owner's explicit priority ruling;
  scheduling order creates no hard dependency.
- **Placement/authority:** Sprint 15, owner user chat 2026-11-06 quoted above; relayed by `fkit-lead`
  to a spawned producer. This owner ruling overrides append-only/spawned-producer re-rank rules
  only for the requested new top-priority work. Not producer precedent for re-ranking. Closed
  history is unchanged; filing is not implementation-plan approval.
- **Related, no wait:**
  [0555 — Use supported interactive owner questions with an explicit fallback](../../backlog/0555-use-supported-interactive-owner-questions-with-an-explicit-fallback/brief.md)
  owns capability/delivery;
  [0556 — Give each independent owner decision its own selectable options](../0556-give-each-independent-owner-decision-its-own-selectable-options/brief.md)
  owns decision assembly. They ship independently; shared-file edits require coordination only.
- **Duplicate boundaries:**
  [0499 — Decide how a lead "clear handoff" carries the important context across a `/clear`](../../backlog/0499-decide-how-a-lead-clear-handoff-carries-context-across-a-clear/brief.md)
  researches an owner-triggered clear helper, excluded here;
  [0490 — Report the "autonomous after plan approval" count](../../backlog/0490-report-the-autonomous-after-plan-approval-count/brief.md)
  is capture/reporting, not continuation. Neither is pulled forward or unblocked by this filing.
- **Checked knock-on:** no existing dependency is changed; no task gains a hard wait on these new
  tasks or on Sprint 15. Existing deferrals, verification block and exhausted retry allowance remain.
- **Wiki freshness:** 12 commits touched `ai-agents/` since watermark
  `185ac5e07e918c089ed3afd23496587315342000`; guidance may lag. No wiki entry records this new
  observation; current sources and owner rulings ground it. Later wiki-role ingest can capture the
  implemented outcome. Codex hooks stay disabled; planning/write limits remain instructional;
  live configured Claude/mixed compatibility remains unverified.
- Product change; normal reviewed implementation plan and actual owner approval required.
  Latest owner ruling, 2026-11-05, defers timing work; do not reopen it. No implementation starts
  from filing, and no wiki/native-settings/index write, move, commit or push is authorized here.
