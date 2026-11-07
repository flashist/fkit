# Build report — 0556 — Give each independent owner decision its own selectable options

- Bounded Build complete: all 16 approved source files changed; mandatory Build artifacts written.
- Behavioral/live-host acceptance **UNVERIFIED**; fresh independent verification and code review remain.
- Static whitespace check clean; convention copies byte-identical; existing manifest rows retained.
- 2,063 protected starting fingerprints unchanged, including brief, approved plan and plan-review.
- No task/board status, placement, dependency, wiki, hook, native/generated setting or test-source write;
  no commit/push/release or automatic closure.


## Approval and authority

Declared approval relayed by `fkit-sprint-ship-loop` (live root `fkit-lead`), Build role.
Decision key: `0556-plan-r1`. Full unchanged 16-file plan carried inline.
Actual owner answer, verbatim: "Approve unchanged implementation plan (Recommended)".
Date: 2026-11-06. Actual channel, as relayed: live interactive owner response via
`fkit_roles.fkit_ask_owner`; action accept, answered true, comment empty.
This worker trusts the declared relay; it cannot independently prove that owner exchange.
The plan's original DRAFT labels are superseded by this approval provenance, not rewritten.
Plan blob remains `e4320af4bc02ebd6a7717e66b3d8aaeb7b79884f`.
No acceptance waiver, closure approval, test re-enablement or extra retry allowance was relayed.

## Standing owner rulings

Owner ruling, verbatim, 2026-11-06 root user chat:
> "Disable ALL tests not only in this session, but in general in this project. No need to remove them completely, but they should not be run"

Owner ruling, verbatim, 2026-11-05 root user chat:
> "I'm repeating again. If we have any mentions of delays, of timeouts, or of benchmark, durations of tests, or whatever, we should ignore them for now. Let's just continue working on the implementation tasks."

Static inspection only. No test/discovery/fixture/probe/demo/project-code verification, generator,
materializer, initializer or release dry-run was invoked. No timing/process/account/model/native
configuration investigation. Carry both dated rulings verbatim into every later worker/review,
including the independent adversarial pass. Existing sessions require an explicit relay.

## Exact source change surface

1. `ai-agents/knowledge-base/conventions/asking-the-owner.md`
2. `claude/scaffold/ai-agents/knowledge-base/conventions/asking-the-owner.md`
3. `claude/agents/fkit-lead.md`
4. `claude/agents/fkit-coder.md`
5. `claude/agents/fkit-producer.md`
6. `claude/agents/fkit-reviewer.md`
7. `claude/agents/fkit-architect.md`
8. `claude/agents/fkit-wiki.md`
9. `claude/skills/fkit-sprint-ship-loop/SKILL.md`
10. `claude/skills/fkit-task-ship-loop/SKILL.md`
11. `claude/skills/fkit-open-questions-interview/SKILL.md`
12. `claude/skills/fkit-heal/SKILL.md`
13. `codex/materialize.mjs`
14. `codex/README.md`
15. `CHANGELOG.md`
16. `claude/structure-manifest.tsv`

The two convention homes now define independent scopes, interface-aware grouping, per-decision
identity and answer provenance, partial/unresolved states, lossless option handling and fallback.
All six ordinary role prompts follow that convention; the architect's earlier interview paragraph
and coder's closing interview no longer override it with unconditional batching.
Sprint relay accepts multiple separate decisions inside one prose envelope, retains the legacy
single-question return and carries scoped answers/checkpoint state. Task-loop gates follow the same
rule. Interview deduplication keeps separate decisions and stops every new dialog for the turn after
an explanation request. Heal retains one approval for its exact enumerated repair list, named subsets
and apply-time freshness. Runtime changes are prompt assembly only, shared by configured runtimes;
README/changelog describe the supported path and evidence limits. No adapter/server logic or schema
change was necessary or made.

## Static observations, not executed product behavior

- `git diff --check -- <the 16 paths above>`: exit 0, no stdout/stderr; raw result in `diff-check.txt`.
- Convention bytes equal. Scaffold CRLF-to-LF normalized SHA-256:
  `f01591d67fe1964309bfd8722c9aa7f51ef644ee17e51385d25f35e71d3a8c38`.
  Exactly one manifest row added; no starting rows removed; path/hash ordering retained.
  Standard-library data work only; full generator equivalence **UNVERIFIED**.
- Captured source bytes before editing include the earlier 0555, 0554 and test-pause changes.
  `incremental.diff` compares starting working-tree bytes to this Build's final bytes, not HEAD.
  `baseline-source.diff` and `baseline-status.txt` separate the substantial pre-existing work.
  All 2,063 protected fingerprints still match; no incompatible concurrent change was observed.
- Read changed hunks and the existing adapter/server flow as source. Unique pending JSON-RPC IDs and
  the original-question custom closure remain untouched; ordinary listed choices need no comment,
  actual custom text lives in `comment`, and interrupted/cancelled/declined input grants no answer.
- Read the existing launcher-contract choice/custom and supported-root/relay/cancel/late-result
  coverage as source only. None of those cases was run. Source inspection established no necessary
  adapter change and establishes no actual host rendering or model obedience.
- Targeted static search for unconditional batch-four and forced merge/drop instructions: no matches
  in the approved paths after correcting the architect paragraph. This is a bounded phrase search,
  not a proof that every model/host follows instructions.
- Static checklist in `static.json` covers two-item worker return / separate calls, partial/reordered/
  duplicate-label replies, interrupted custom input, late scope, explanation stop, separate plan/retry
  approvals, per-decision fallback, option caps, titles/knock-ons, heal and faithful provenance carry.
  Source references there identify the relevant sections. Examples are design illustrations only.
- Wiki grounding used `fkit-query`: explanation-first, next-message re-ask, session-only owner
  channel and trust-not-proof approval relay remain. 12 commits touched `ai-agents/` since watermark
  `185ac5e07e918c089ed3afd23496587315342000`; wiki lacks this current symptom and may lag current source.

## Execution skips

- `test/launcher-contract.test.js (including focused adapter/relay cases)`: skipped — owner disabled test execution.
- `npm test`: skipped — owner disabled test execution.
- `npm run test:docs`: skipped — owner disabled test execution.
- `npm run test:prove-red if applicable`: skipped — owner disabled test execution.
- `suite/build execution for verification`: skipped — owner disabled test execution.
- `test discovery/collection, fixtures, smoke tests, mutation tests, benchmarks, behavioral probes and saved verification scripts`: skipped — owner disabled test execution.
- `live host rendering/submission/cancellation and two-decision worker-relay exercise`: skipped — owner disabled test execution.
- `Claude/mixed live checks`: skipped — owner disabled test execution.

Mapped default check: `npm test`; documentation editing check: `npm run test:docs`; existing focused
adapter/relay coverage: `test/launcher-contract.test.js`. Prove-red is not newly required by these
prompt/data changes; any proposed execution remains skipped. Test sources/disable guards preserved.
No new test, prove-red case, schema, batch API, persistent approval registry or instrumentation.

## Artifacts and independent handoff

- `../../worklog.md`: Build record and decision log.
- `report.md`: this report, with both owner rulings for onward relay.
- `incremental.diff`: complete 16-file Build delta from captured starting bytes.
- `static.json`: exact file/hash surface, static observations, skip mapping, gaps and spend.
- `baseline.json`, `before/`, `baseline-source.diff`, `baseline-status.txt`,
  `protected-baseline.json`: starting evidence, retained unchanged.
- `after/`: frozen final bytes for Verify/Review; `diff-check.txt`: raw static whitespace result.

Outstanding: live driver consumes this bounded return, obtains fresh static Verify and independent
source-only Review with both owner rulings verbatim, then reconciles actual findings and gates.
This Build's source inspection is author QA, **not** an independent review. No review ledger or
reviewer-owned section was created/edited. Behavioral/live-host and Claude/mixed acceptance remain
**UNVERIFIED**. No live demo is requested; skips never become passes. Manifest generator equivalence
remains unverified. No acceptance waiver and no automatic task/board closure.

## Decision log

Autonomous choices / obvious-winner calls: **none**. No review findings or fixes in this Build.
All source edits implement the unchanged approved plan; no expansion or new product decision.

## Allowances and spend

Direct consult 2 of this run: Plan completed; Build now completed. Prior children:
architect 1 / producer 1 / adversarial 1 = 3. This worker launched **0** children.
Revision rounds 0/2; retries 0; verification launches 0; no-progress 0/3.
No additional task/session launch cap specified; no general retry allowance.
Run skip/attempt set includes 0556 once attempted. 0548 final-draft allowance remains exhausted 2/2,
no launch. 0555 existing claim, 0537 owner-deferred and 0520 blocked remain exclusions.

What's next? Driver advances to fresh static Verify and independent source-only Review; no owner
"continue" ping is needed for those authorized steps.
