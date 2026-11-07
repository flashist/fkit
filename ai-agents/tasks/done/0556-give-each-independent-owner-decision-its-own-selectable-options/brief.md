# Give each independent owner decision its own selectable options

## ID
0556

## Sprint
Sprint 15

## Priority
4

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Current driver claim — 2026-11-06, root `fkit-lead` ship-loop.** Claimed for plan-only work
in the new Sprint 15 run after deterministic eligibility checks. Plan review: ON (default).
No implementation plan is approved. The owner's project-wide test-execution pause remains
binding; verification is static-only and skipped execution is never a pass. Existing task
claims, deferrals, blocks and exhausted launch allowances remain unchanged.

**Owner authority — 2026-11-06, root `fkit-lead` user chat:** the exact request and priority
ruling are quoted in
[0554 — Make the lead advance authorized work after worker completion](../../done/0554-make-the-lead-advance-authorized-work-after-worker-completion/brief.md)
and [Sprint 15](../../../sprints/sprint-15.md). This brief addresses unrelated questions combined
into one text block, forcing the owner to compose an answer instead of choosing supplied options.

`conventions/asking-the-owner.md` already requires short questions, explanations in chat, the
standing explanation option and non-choice-is-not-consent semantics. The lead and sprint relay
carry those rules. The current Codex adapter takes one question with up to four options, so
sequential questions are a supported way to separate decisions; multi-question batching must not
be assumed. The symptoms do not prove a particular assembly/adapter defect.

## What to build

1. Give every independent decision its own concise question and meaningful directly selectable
   alternatives. The question names one decision; short option labels say what each choice does;
   explanation and trade-offs go in separate visible chat. Standard decisions never require
   “Write your answer” or a combined free-text response just to select ordinary alternatives.
2. Batch related decisions as separate question objects only where the actual interface supports
   them; otherwise ask sequentially. Do not introduce a batch API merely to satisfy this outcome.
   Never concatenate unrelated decisions or collapse their options into a compound answer. Keep
   stable decision/question-to-answer binding across sequential calls, partial batches, reordering,
   custom follow-ups and re-asks; an answer to one must not authorize another.
3. Keep the recommended choice first, marked, and append exactly once to each question the standing
   label `Explain more, then ask again`, with description
   `Give me more context in simple terms, then re-ask the question.` Respect actual tool limits;
   do not squeeze extra decisions into an option or silently drop valid alternatives. An explicitly
   chosen custom alternative remains supported, without mandatory text for listed choices.
4. Preserve actual consent: typed questions, requests for explanation and the standing option get
   a full chat explanation, no new dialog that turn, and the unresolved question back on the next
   owner message under the existing convention. Keep valid partial answers without treating the
   whole batch as approved. Cancellation, invalid/empty results, no response and preselection
   grant nothing. Record each actual approval with its exact scope/decision, quoted answer, date
   and channel; never invent approval provenance or reuse it for a changed plan.
5. Cover lead instructions, shared question conventions/assembly, ship-loop relays, relevant
   interview/question templates and runtime prompt/answer handling where necessary. Headless
   workers return distinct NEEDS-DECISION items, each with its own question, at most three real
   options, recommendation and plain context, for root to relay; workers never ask owners.
   Preserve placement/dependency knock-ons per option. Pair every owner-visible task reference
   with its permanent ID and canonical title. Keep machine paths, IDs and dependency grammar.

## Verification steps

1. Exercise two or more independent decisions with distinct selectable choices, including a
   worker return carrying two NEEDS-DECISION items. Each arrives at root as its own question,
   batched as separate objects if supported or asked sequentially. Selecting one option supplies
   that decision only and requires no free-text composition. Show stable answer binding.
2. Check partial answers, reversed answer order where batching is supported, a typed follow-up,
   the standing explanation option, cancellation and re-ask. Preserve answered decisions, explain
   unresolved ones and re-ask only those; no same-turn re-ask after an explanation request. No
   auto-submission of a preselected option or dependent action without actual applicable consent.
3. Include separate plan approval and retry-allowance decisions: a retry choice never approves
   source, a plan approval never extends exhausted retries, and free-text questions grant neither.
   Check exact approval provenance and faithful propagation to the correct worker.
4. Check missing-interface fallback retains separate questions and named alternatives with explicit
   real-answer waiting. Interface capability itself is owned by
   [0555 — Use supported interactive owner questions with an explicit fallback](../../backlog/0555-use-supported-interactive-owner-questions-with-an-explicit-fallback/brief.md);
   current single-question delivery suffices to verify this task independently.
5. Use meaningful existing-file coverage (`test/launcher-contract.test.js` for actual adapter/relay
   contracts) and focused source/template review under `CONTRIBUTING.md`. Do not restore broad
   prose-presence tests or mirror implementation in tests. Separately record actual interactive
   host rendering/submission for two decisions; fixtures/static examples are not live execution
   or human approval. Missing host checks stay unverified; no fake demo or universal obedience claim.
6. No new permanent test file or prove-red case without individual owner approval at the
   implementation-plan gate. No timing/delay/benchmark/duration/performance gates, process
   watching, account/model/configuration probes or settings repair.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **On merit:** as ranked. Immediately after
  [0555 — Use supported interactive owner questions with an explicit fallback](../../backlog/0555-use-supported-interactive-owner-questions-with-an-explicit-fallback/brief.md)
  in the requested top-priority group; this is scheduling, not a hard dependency.
- **Duplicate boundaries:**
  [0487 — Add the `task: <id>` spawn line and the `[task NNNN]` relay tag to both ship-loop skills](../../backlog/0487-add-the-task-id-spawn-line-and-the-task-relay-tag-to-both-ship-loop-skills/brief.md)
  is gated owner-involvement capture instrumentation, excluded here; stable decision binding is
  not authorization to build its hooks/logs/tags.
  [0410 — Investigate how agents report status to the owner in prose, and put a hierarchical shape to him](../../backlog/0410-investigate-how-agents-report-status-to-the-owner-in-prose-and-put-a-shape-to-him/brief.md)
  concerns reporting hierarchy, not question assembly.
  [0553 — Include task titles alongside IDs in owner-facing communication](../../backlog/0553-include-task-titles-alongside-ids-in-owner-facing-communication/brief.md)
  remains unranked Backlog; follow its naming outcome here without pulling in its team-wide rollout.
- Preserve the shipped explanation semantics from
  [0504 — Answer a question typed into a question dialog in full, in chat, and do not re-ask in the same turn](../../done/0504-answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn/brief.md).
  This task completes independent-decision assembly, not a second implementation of that rule.
- **Placement/authority:** Sprint 15 under the exact owner user-chat ruling, 2026-11-06, relayed
  by `fkit-lead`. Scoped override of append-only/spawned-producer re-rank rules; not producer
  precedent. Closed history unchanged. No existing dependency changes or new waits on any sprint.
- **Wiki freshness/runtime limits:** 12 commits since watermark
  `185ac5e07e918c089ed3afd23496587315342000`; wiki may lag and does not record this new observation.
  Current convention, runtime source and owner ruling ground the scope; later wiki-role ingest
  can capture delivery. Codex hooks stay disabled; planning/write limits remain instructional;
  live configured Claude/mixed compatibility is unverified.
- Product change; normal reviewed plan and actual owner approval required before source. Filing
  starts nothing, writes no source/config/native-settings/index/wiki, moves nothing, commits and
  pushes nothing. Existing retry caps, role/review independence and producer-only movers remain.
