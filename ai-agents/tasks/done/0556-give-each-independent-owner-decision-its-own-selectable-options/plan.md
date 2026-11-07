# Draft implementation plan — 0556 — Give each independent owner decision its own selectable options

Status: DRAFT, NOT APPROVED. Plan-only return to the live fkit-lead sprint driver. No declared write approval. Planning restraint is instructional, not a runtime write wall.

Classification: product change — changes the questions and selectable alternatives delivered to owners. Architect and producer approval required before the independent adversarial plan pass; actual owner approval remains a separate gate.

## Authority and boundaries

OWNER RULING, verbatim, 2026-11-06 root user chat:
"Disable ALL tests not only in this session, but in general in this project. No need to remove them completely, but they should not be run"

Static inspection only. Every execution check: "skipped — owner disabled test execution". No tests, test discovery/collection, fixtures, smoke tests, benchmarks, behavioral probes, saved verification scripts, project-code execution for verification, live demo requests or release dry-runs. Preserve test sources and all disable guards. Behavioral and live-host acceptance remain unverified. Carry this quote/date/channel to every later worker and review.

Standing owner ruling, verbatim, 2026-11-05 root user chat:
"I'm repeating again. If we have any mentions of delays, of timeouts, or of benchmark, durations of tests, or whatever, we should ignore them for now. Let's just continue working on the implementation tasks."

No timing/delay/timeout/duration/performance/process-observation investigations, account/model/native-configuration probes or repairs, hook reactivation, permanent new test file or prove-red case. No task placement, priority, dependency or closure changes. Preserve 0555 — Use supported interactive owner questions with an explicit fallback and its separate run; coordinate shared-file edits through the live driver without taking over its artifacts or approval. 0537 remains deferred; 0520 remains Blocked — verification failed; 0548 allowance remains exhausted 2/2. No new allowance is implied.

## Grounding and existing behavior

Read the brief, shared asking convention, lead and ship-loop relay text, interview and heal templates, current Codex source, CONTRIBUTING.md, codex/README.md and model-agnostic-sprint/HANDOFF.md. Wiki grounding: [[tasks/answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn]], [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]], [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]], [[decisions/adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver]], and the session-only owner-channel decision ADR-021. These preserve explanation-first, next-message re-ask, exact scope carry and trust-not-proof approval relay.

Wiki caveat: 12 commits touched ai-agents/ since watermark 185ac5e07e918c089ed3afd23496587315342000. The wiki does not record the current independent-decision symptom. Current source and explicit owner rulings take precedence for this task.

Static evidence:
- codex/server.mjs advertises one question string and up to four supplied option strings; there is no questions-array input.
- codex/owner-question.mjs already correlates responses by unique JSON-RPC request ID in pending, and retains the original question in the separate custom-text follow-up closure. Listed choices need no extra text; custom routing alone is insufficient.
- The shared convention and all six ordinary role prompts still say to batch related questions without tying that advice to actual interface support.
- The interview assumes four questions per call; the lead and sprint worker envelope show only one question, leaving multiple independent worker decisions unspecified.
- Heal's exact enumerated repair list is one plan-level decision under ADR-039. Do not split its file list into independent repair approvals or change its freshness/consent model.
- No specific adapter correlation defect has been established. A new batch API, persistent decision registry or approval token is unnecessary.

## Exact implementation surface, after owner approval

1. ai-agents/knowledge-base/conventions/asking-the-owner.md and claude/scaffold/ai-agents/knowledge-base/conventions/asking-the-owner.md: same complete edits in both homes. Define independent decisions, per-decision selectable options, interface-aware grouping, binding and partial-answer handling. Replace blanket option merging/dropping guidance with transparent handling that preserves valid alternatives.
2. claude/agents/fkit-lead.md: individual decision relay and approval provenance; separate decision sets in worker returns; no compound plan/retry approvals.
3. claude/agents/fkit-coder.md, claude/agents/fkit-producer.md, claude/agents/fkit-reviewer.md, claude/agents/fkit-architect.md, claude/agents/fkit-wiki.md: localized changes to their existing Asking the owner / worker-return paragraphs so they do not override the shared convention with unconditional batching or dropping options. No role-boundary changes.
4. claude/skills/fkit-sprint-ship-loop/SKILL.md: extend the prose return contract and relay steps to multiple separate decisions inside one NEEDS-DECISION envelope; update answer carry and checkpoint wording to retain each decision's state and provenance. Keep legacy single-question returns valid, all launch caps and existing driver gates.
5. claude/skills/fkit-task-ship-loop/SKILL.md: apply the same independent-decision rule at its plan gate and important-question handling; preserve its existing autonomy and producer-only close.
6. claude/skills/fkit-open-questions-interview/SKILL.md: deduplicate only the same decision and scope; preserve separate open decisions, adapt group size to interface limits, ask sequentially on current Codex, retain the unresolved remainder and stop all new dialogs that turn after explanation requests.
7. claude/skills/fkit-heal/SKILL.md: add a narrow reference clarifying that approval of the exact enumerated repair list remains one decision; unrelated choices are separate. Existing named-subset custom route and apply-time freshness checks stay intact.
8. codex/materialize.mjs: update initialPrompt, shared ownerDelivery and headless/runtime-binding wording to carry the same per-decision semantics for both configured runtimes. Explicitly describe current fkit_ask_owner as single-question and sequential. This is prompt assembly, not a change to native settings or tool schemas.
9. codex/README.md and CHANGELOG.md under Unreleased: describe the supported sequential path, optional separate-object batches only when supported, independent answer scope, and unverified behavioral/live-host acceptance. Preserve 0555's interface/display limits and existing entries.
10. claude/structure-manifest.tsv: maintain the changed scaffold convention's current normalized SHA-256 entry as data, retaining historical and concurrent entries, sorting by existing path/hash contract. Because execution is disabled, do not run the project generator as verification. Use only standard-library byte normalization/hash/data editing for this one changed source entry; disclose that full generator equivalence remains unverified.

No other source files are authorized by this draft. In particular: no codex/owner-question.mjs or codex/server.mjs logic/schema changes; no test source changes or new tests; no hooks, universal-rules budget changes, root AGENTS.md/CLAUDE.md edits, native/generated .agents/.codex settings, task/board changes or wiki/index writes. Read existing test/launcher-contract.test.js to map preserved transport behavior; do not run it or add prose-presence assertions. If source inspection establishes a necessary runtime change, return the exact added scope for owner decision before writing it.

## Decision and answer contract

A decision is one independently approvable scope/action. Different decisions may share context but never share a compound option such as "approve plan and grant two more attempts". One question names one decision. Each real option names its effect; explanations and trade-offs precede the dialog in chat.

The root keeps a small conversation/checkpoint list, using existing driver artifacts only after their normal gates: stable decision key, task ID plus canonical title where applicable, unchanged scope/revision, question, exact options, recommendation, pending/answered/superseded state and answer provenance. Use human-readable local keys, e.g. 0556-plan-r1 and 0556-retry-r1, not new runtime tags/hooks/logging. Keys are correlation aids, not approval proof or a new instrumentation system.

For multiple worker decisions use one prose envelope:
NEEDS-DECISION { decisions: [
  { id, question, options, recommendation, context },
  { id, question, options, recommendation, context }
] }
Each item has at most three real options and its own plain context. The existing NEEDS-DECISION { question, options, recommendation, context } remains valid for one decision; root assigns its stable key before asking. This is a prompt/relay convention, not a new runtime parser or tool API. Do not silently omit any item.

Ask related decisions as separate question objects only if the actual exposed interface supports that shape and count. Otherwise, issue one question call at a time. Current Codex uses sequential fkit_ask_owner calls; never pass a questions array, join questions/options in one string, or invent a multi-question API. For a supported batch, bind answers using stable question identity and scope, never list order or repeated labels. If the host does not preserve trustworthy identity, ask sequentially instead. Unsupported batching is not an implementation blocker.

Put the recommended real alternative first, marked. Append exactly once to every question's supplied alternatives:
- label: Explain more, then ask again
- description: Give me more context in simple terms, then re-ask the question.
Respect the actual interface's option limit and its distinct custom-text affordance. The Codex adapter accepts strings, so keep the standing label exact and place its description in visible preceding chat; structured interfaces use the description field. Preserve ordinary listed-choice submission without text and the adapter's separate custom-text route. Do not mistake the host-provided custom affordance for another decision or require a custom answer to select a listed choice.

Do not drop valid alternatives or merge unrelated effects to make room. If a worker supplies too many, return for a narrower faithful option set or transparently stage a selection within the same decision: the preliminary stage selects a category/subset only and authorizes no dependent action; the final question names the exact scope. Disclose any semantically equivalent consolidation and preserve all knock-ons. Do not shrink options silently.

Keep binding from root decision key/scope through the tool call and actual returned answer. Transport request IDs correlate replies to calls; they do not establish semantic approval. A custom follow-up stays attached to its original decision and scope. Preserve its text exactly. A re-ask retains the same key only while scope/options mean the same thing; changed scope supersedes that pending version and requires a fresh applicable answer. Duplicate labels, reordered answers and late replies never imply approval of another decision.

Accept valid partial answers for their unchanged scopes and retain unanswered items. Cancellation, decline, interruption, invalid/empty/duplicate-ambiguous results, silence, accepted/queued requests, presentation alone and preselection grant nothing. Never auto-submit. A typed question, request for explanation or standing-option selection gets a full chat answer; open NO new dialog for any decision that turn. On the owner's next message, take an actual applicable answer or explain another question; otherwise re-ask only unresolved decisions. A mixed pick-plus-question is acted on only when the answer does not bear on the pick, under the existing convention.

For each actual approval record the exact decision key and scope/plan version, quoted selected answer or exact prose/custom answer, date and actual channel in the existing decision log/checkpoint when authorized. Never label prose as a form answer or turn "Write another answer" into the owner's substantive answer. Carry the applicable approval and full approved scope faithfully to the appropriate next worker; unknown provenance stays unknown, never reconstructed.

Plan approval and retry allowance are independent. Granting a retry does not approve source; approving a plan does not revive exhausted launches. Dependent work starts only when every approval/allowance it requires is actually satisfied. Unrelated authorized work may continue under existing driver rules. Preserve per-option placement/dependency knock-ons and permanent task ID plus canonical title; no placements/dependencies change in this task.

Missing-interface fallback repeats the established limitation and explicit choices separately for each decision, retaining its identity, context, standing explanation choice and pending state. Wait for a real answer. Do not repeatedly submit uncertain asynchronous requests, automate activation or claim fallback meets live-host acceptance.

## Implementation sequence

1. Re-read the current shared paths and relevant 0555 changes before editing. Capture/read the existing diff; preserve every unrelated staged/unstaged/untracked edit. If the concurrent run changes a shared section incompatibly, return the conflict to the live driver; never overwrite or claim its approval.
2. Implement the shared convention in both homes, then the six roles and ship-loop/interview/heal templates. Keep the worker shape and real-option caps consistent.
3. Update only runtime prompt assembly and the bounded README/changelog entries. Inspect the existing adapter and server end-to-end as source to ensure the described sequential/custom/cancel behavior remains accurate; do not invoke them.
4. Update only the required manifest data entry from normalized scaffold bytes, preserving earlier versions and concurrent edits. No generator, materialization, initialization or project-code verification is run.
5. Read every changed hunk, compare the two convention copies as data and review exact labels, scope binding, paths and links. Run git diff --check on the implementation paths. Use static searches to locate remaining contradictory unconditional batch/drop/compound-approval instructions within these paths. No broad unrelated rollout.
6. Obtain the normal independent source-only code review through the driver with both owner rulings verbatim. Report findings and disposition gates honestly; that future code review is separate from this plan review. Stop for judgment calls outside approved scope.

## Static acceptance checklist and execution skips

Inspect, without executing, the written control flow/examples for:
- Two independent decisions returned in one worker envelope; two separate Codex question calls with ordinary selectable alternatives and no required custom text.
- Partial answers, answer-order changes only on supported batch interfaces, duplicate labels, interrupted custom entry, scoped late answers, cancellation and re-asks.
- Explanation requests in any item stopping all new dialogs that turn while preserving other valid answers.
- Separate plan-approval and retry keys, exact provenance and faithful carry; no changed-plan approval reuse.
- Per-decision fallback and option caps, canonical titles, knock-ons, standing label once, visible description, no silently lost alternatives.
- Byte-equal convention homes, preserved existing edits and disable guards, manifest data entry and source diff cleanliness.

Read-only inspection and git diff --check are static evidence only. No executed product behavior is established. Source examples are design illustrations, not fixtures, tests, approval or proof of host rendering.

Existing test/launcher-contract.test.js coverage, npm test, npm run test:docs, mapped npm run test:prove-red if applicable, any focused adapter/relay tests, suite/build execution for verification, host rendering/submission/cancellation, worker-relay behavioral exercise, and Claude/mixed checks: each "skipped — owner disabled test execution". No new test file/case is proposed. The mapping remains recorded, never run to prove a guard refuses. Manifest generator equivalence is also unverified.

## Alternatives, judgments and completion limits

Recommended shape: localized instruction/assembly changes using existing single-question transport. Rejected for this scope: a new batch API or persistent decision/approval registry (unnecessary new machinery); compound approval options or mandatory free text (recreates the failure); silently merging/dropping valid alternatives (loses owner choices). Heal's single exact repair-plan gate remains one decision.

No unresolved product/design question is required to draft this scope. Actual source approval is outstanding and belongs to the live driver; approver verdicts and adversarial findings are advisory, not owner consent. Any post-adversarial plan change requires owner disposition and is not silently included.

Behavioral and live-host acceptance are UNVERIFIED, not passed. In particular, the brief's live rendering/submission criterion for two decisions cannot be satisfied by static inspection. Do not auto-close, convert skips to green, request a prohibited live demo, or invent an acceptance waiver. Report the incomplete evidence to the live driver; any later re-enablement or acceptance change requires a separate explicit owner decision. Only the producer may close through its mover when actually authorized; this unit closes nothing.

What's next? Live driver presents this complete draft and review record for actual owner approval; execution acceptance remains unmet under the standing pause.
