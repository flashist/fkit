# Use supported interactive owner questions with an explicit fallback

## ID
0555

## Sprint
Sprint 15

## Priority
3

## Status
🔄 In progress

## Owner
fkit-coder

## Context

**Current driver claim — 2026-11-06, root `fkit-lead` ship-loop:** claimed for plan-only work after the complete producer closure of 0554 — Make the lead advance authorized work after worker completion was cross-checked. Sprint 15 P3, no dependencies; plan review ON (default). No source approval. The amendment-state and earlier approval-pending descriptions below are historical; 0554 is now agent-closed, not owner-verified. Other deferrals and retry limits remain.

**Owner authority — 2026-11-06, root `fkit-lead` user chat:** the exact request and top-priority
ruling are quoted in
[0554 — Make the lead advance authorized work after worker completion](../../done/0554-make-the-lead-advance-authorized-work-after-worker-completion/brief.md)
and [Sprint 15](../../../sprints/sprint-15.md). This brief addresses the owner's report that lead
often asks outside the interactive actions interface.

**Observed availability, not diagnosis:** the root lead reports that after tool refresh none of
`fkit_roles.fkit_ask_owner`, `fkit_roles.fkit_consult` or `fkit_roles.fkit_skill` was exposed in that
root session. Its prior prose retry question was a fallback. This does not prove a product defect,
connector cause, or that every host should expose identical tools. This spawned producer has
skill/consult tools and no owner-question tool; that is a different session and establishes nothing
about the root. No source-failure diagnosis, settings probe or repair is part of filing.

Current `codex/server.mjs` exposes the owner tool only for eligible interactive roots;
`codex/owner-question.mjs` negotiates elicitation, waits for actual responses, and distinguishes
listed choices from a second custom-text form. `codex/fkit.mjs` supplies session launch metadata;
`codex/materialize.mjs` maps canonical asking rules. `codex/README.md` and
`model-agnostic-sprint/HANDOFF.md` document real local form checks and explicit limitations.
These are existing integration seams, not proof the reported root has them available.

**Owner feedback refinement — 2026-11-06, root `fkit-lead` user chat, relayed verbatim
with an owner-supplied screenshot:**

> I am seeing this question like that, it has timeout, but it has no options for me that I can choose. Why's that? In order to answer it  I need to press certain combinations, but I want it to be asked without my additional input.

**Observed delivery, not an infrastructure diagnosis:** root called
`functions.request_user_input_async` with an approval question and three option strings; the
tool returned `{"accepted":true}`, but no answer was received. The screenshot shows plain-text
options, “Queued follow-up inputs”, “1 question” and a keyboard shortcut “to answer”; it does
not show an already-open selectable choice dialogue. This proves that this asynchronous request
was queued, not that an automatic blocking dialogue appeared. No deeper source, connector or
client cause is established. Root attempted only to open the existing question without selecting
an answer; Computer Use explicitly refused Terminal access. That refusal is a boundary, not a
reason to bypass it or automate a shortcut. Screenshot contents are relayed evidence; no image
or private desktop inventory is copied into the repository.

**Standing owner ruling — 2026-11-05, root user chat, verbatim:**

> I'm repeating again. If we have any mentions of delays, of timeouts, or of benchmark, durations of tests, or whatever, we should ignore them for now. Let's just continue working on the implementation tasks.

The new quote's timeout/counter wording is owner history, not a proved deadline. This amendment
addresses visible selectable choices without extra activation; it authorizes no counter, timing,
timeout-cause, benchmark, process, account/model/native-configuration or infrastructure inquiry.
It refines this brief only, granting no source approval, extra retry or priority/status change.

## What to build

1. Establish and deliver a reliable capability boundary: supported interactive roots discover and
   select the actual owner-question interface, and questions reach the supported form and wait
   for its result. Cover the lead and shared asking/runtime assembly where needed. Use Codex
   fkit owner elicitation where available and Claude native AskUserQuestion on its supported path;
   do not assume an interface solely because a prompt names it.
2. Distinguish host support, connector/tool exposure, session eligibility and invocation/delivery
   outcome. The plan identifies the supported combinations and exact capability/launch/prompt
   surfaces. Address fkit-owned gaps established there without claiming to repair an unknown
   external host cause. Preserve root-only asking; headless/delegated workers return decisions.
3. When no usable interactive interface is available, state the concrete limitation and use an
   explicit, concise fallback with listed alternatives and actual answer binding. Wait for the
   owner's answer before dependent action. Do not silently switch to a prose question when a
   usable interface exists; do not loop forever trying absent tools or require persistent native
   settings changes. If delivery is uncertain, report it and keep the decision pending.
4. Preserve no-consent semantics for decline, cancellation, interruption, invalid/empty responses,
   custom-text follow-ups and explanation requests. Listed options must submit without mandatory
   free text; selecting a custom-text route alone grants nothing. Preselected choices are never
   auto-submitted. Preserve exact decision/scope and selected answer with date/channel in approval
   records; tool exposure or invocation alone is not approval.
5. Update canonical instructions, runtime integration, relevant help/examples and delivered copies
   together as required by the approved plan. Preserve hook-disable, role/fresh-context, plan-gate
   and user-configuration limits. No hook reactivation, account/model/configuration probe,
   automatic connector install, global/native-config repair or background scheduler.
6. On a supported live host/session, asking must automatically present the actual selectable
   decision dialogue. The owner only chooses/submits an answer: no activation shortcut, queue
   opening, mode/panel switch or free-text composition just to reach ordinary choices. Select
   an appropriate available blocking/dialogue interface; an asynchronous queued follow-up API
   is not equivalent to that interface.
7. Separate capability/exposure, request acceptance, queueing, dialogue presentation, actual
   answer and applicable approval in behavior and reporting. An accepted request or queued
   notification proves neither visible-form delivery nor consent. Claim a displayed dialogue
   only with actual presentation evidence; absent or uncertain evidence keeps delivery unverified
   and the decision pending.
8. If the host/session has no usable automatic dialogue interface, explicitly state that concrete
   limitation and retain the explicit fallback and real-answer waiting above. Do not repeatedly
   resubmit asynchronous requests while claiming success, call unavailable APIs, automatically
   install/repair settings, control protected Terminal, hide mode changes, automate activation
   shortcuts or submit approval for the owner. Make no universal automatic-dialogue promise or
   new interface API specification here; any interface change needs normal implementation planning.

## Verification steps

1. In existing `test/launcher-contract.test.js`, cover eligible interactive-root capability
   exposure/selection, declared supported/unsupported elicitation, absent interface and delivery
   failure. Headless/delegated roles must return NEEDS-DECISION rather than present owner forms.
   Check preserved user settings with isolated fixtures, not real configuration probes.
2. Check successful listed-choice submission without text, actual answer return, custom-text
   routing, cancellation, decline, interruption and invalid/empty results. No dependent operation
   or approval is produced until a real applicable answer is received; no preselection submits.
3. Demonstrate a supported interactive host rendering/selecting/submitting an ordinary choice
   and cancelling a question, separately from protocol fixtures. Record host/path and actual
   observed result; missing execution remains unverified, never a fixture-based live pass or fake
   owner demo. Claude/mixed live coverage stays unverified unless actually exercised.
4. Exercise missing-interface fallback with separate pending decisions and clear alternatives;
   do not diagnose absence or pretend the fallback was an interactive form. Classify static
   inspection, protocol fixtures and actual host execution separately in the evidence.
5. Follow `CONTRIBUTING.md`'s affected-file checks and test scope. No new permanent test file or
   prove-red case without individual owner approval at the implementation-plan gate. No timing,
   delay, benchmark, duration or performance gate, process watching or infrastructure investigation.
6. Real-host acceptance must observe the actual choices already open automatically after asking,
   before the owner interacts: no extra activation shortcut, queue opening, mode/panel switch or
   text entry. Compare accepted-but-queued, missing/unavailable-interface and uncertain-delivery
   cases against genuinely displayed choice, successful submission and cancellation cases. Record
   observed presentation separately from acceptance/queueing and answer/approval. Fixtures and
   static checks cannot prove live display. If automatic display cannot be observed on an available
   supported host, record that unmet acceptance explicitly; fallback alone is not a live-display pass.
7. Only the actual owner supplies an applicable approval during live verification; never simulate
   it or have an agent choose/submit it. Confirm queued acceptance and displayed-but-unanswered
   forms grant nothing. Keep root-only asking and the independent decision-assembly boundary with
   [0556 — Give each independent owner decision its own selectable options](../../done/0556-give-each-independent-owner-decision-its-own-selectable-options/brief.md).
   This refinement approves no permanent test file, prove-red case, source implementation or retry.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **On merit:** as ranked. Immediately after
  [0554 — Make the lead advance authorized work after worker completion](../../done/0554-make-the-lead-advance-authorized-work-after-worker-completion/brief.md)
  by owner priority; delivery works independently with today's single-question caller.
- **Independent seam:** this task owns interface availability, choice delivery and degraded
  handling; [0556 — Give each independent owner decision its own selectable options](../../done/0556-give-each-independent-owner-decision-its-own-selectable-options/brief.md)
  owns splitting/assembly and multi-decision binding. Preserve the existing interface unless an
  approved change needs it; batching is optional, sequential questions are a complete outcome.
- **Duplicate boundaries:** shipped
  [0504 — Answer a question typed into a question dialog in full, in chat, and do not re-ask in the same turn](../../done/0504-answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn/brief.md)
  establishes existing explanation semantics, not current capability availability.
  [0553 — Include task titles alongside IDs in owner-facing communication](../0553-include-task-titles-alongside-ids-in-owner-facing-communication/brief.md)
  stays unranked Backlog; use ID plus canonical title in owner-visible task references now.
- **Placement/authority:** Sprint 15 under the exact owner user-chat ruling, 2026-11-06,
  relayed by `fkit-lead`. Scoped override of append-only/spawned-producer re-rank rules, not
  producer precedent. No closed-history re-ranking. Filing is not source-plan approval.
- **Checked knock-on:** no new hard dependencies, no existing links re-pointed, no open task gains
  a wait on these tasks or another sprint. Shared-file coordination is not a dependency.
- **Wiki freshness/runtime limits:** 12 commits since watermark
  `185ac5e07e918c089ed3afd23496587315342000`; wiki ADR-061 and shipped-question history may lag.
  No wiki page establishes the new root-session observation or its cause. Later wiki-role ingest
  can record the implemented result. Instruction delivery is not guaranteed model compliance;
  Codex hooks remain disabled and Claude/mixed live certification remains unverified.
- Product change; normal reviewed plan and owner source approval required. Filing makes no
  source/config/native-settings/index/wiki edit, terminal move, commit or push. Preserve the
  owner's 2026-11-05 timing-work deferral and existing task retry/approval boundaries.
- **Amendment boundary — 2026-11-06:** Sprint 15, priority 3, `🔲 Backlog`, owner `fkit-coder`,
  no dependencies/blocks, and the existing history remain unchanged. The current plan for
  [0554 — Make the lead advance authorized work after worker completion](../../done/0554-make-the-lead-advance-authorized-work-after-worker-completion/brief.md)
  has architect/producer APPROVE and usable clean leaf review plus coder check, per root's relay;
  actual owner implementation approval is still pending. Those records/statuses are not amended.
  [0556 — Give each independent owner decision its own selectable options](../../done/0556-give-each-independent-owner-decision-its-own-selectable-options/brief.md)
  remains independent at priority 4/`🔲 Backlog`; all older deferrals, blocks and retry limits stand.
