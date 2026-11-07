- **Static obligations: PASS within the recorded snapshot coverage.** No source defect found requiring repair.
- **Behavioral/live-host acceptance: UNVERIFIED. Manifest-generator equivalence: UNVERIFIED.** Required execution was skipped; this is not a fully green Verify or permission to close.
- Exact 16-file delta confirmed; all current source bytes match frozen Build output; 2,063 protected fingerprints unchanged.
- Only this report and `static.json` written. Independent source-only code review remains outstanding.

# Static Verify — 0556 — Give each independent owner decision its own selectable options

## Authority and owner rulings

Fresh bounded Verify, caller `fkit-sprint-ship-loop`, live root `fkit-lead`, 2026-11-06.
Not Build or Process-review; no source-write approval carried. Allowed writes only under
this task's `evidence/verify/`. No source repair, worklog/plan/ledger/status/config/wiki/index write,
owner form, commit, push, release or task move performed.

Owner ruling, verbatim, 2026-11-06 root user chat:
> "Disable ALL tests not only in this session, but in general in this project. No need to remove them completely, but they should not be run"

Owner ruling, verbatim, 2026-11-05 root user chat:
> "I'm repeating again. If we have any mentions of delays, of timeouts, or of benchmark, durations of tests, or whatever, we should ignore them for now. Let's just continue working on the implementation tasks."

Both rulings bind onward workers and source-only/adversarial review. No child launched here.
No tests, discovery/collection, fixtures, probes, demos, saved verification scripts, project-code
verification, generator/materializer/initializer call or release dry-run executed. No timing,
process, account, model or native-configuration investigation performed.

Actual plan authority is the driver's declared relay: exact owner answer
`Approve unchanged implementation plan (Recommended)`, 2026-11-06, live response through
`fkit_roles.fkit_ask_owner`. This granted Build only, with no acceptance waiver or closure.
The worker cannot independently prove the owner exchange. The copied DRAFT labels remain untouched.
Independent Git-blob calculation of current `plan.md` matches approved blob
`e4320af4bc02ebd6a7717e66b3d8aaeb7b79884f`.

## Inputs and independent static results

Fully consumed: `brief.md` (121 lines), `plan.md` (111), `worklog.md` (88), Build `report.md`
(143), `incremental.diff` (911 lines / 91,377 bytes), and `static.json` (363).
Read bounds came from `wc -lc`; truncated combined output was replaced by split reads.
The complete incremental diff was read in ranges 1–125, 126–280, 281–425, 426–570,
571–705, 706–820 and 821–940 (EOF at 911). Required JSON, `baseline.json`,
`protected-baseline.json`, all `before/` and `after/` snapshots were consumed fully as data.
Build `diff-check.txt` records exit 0; an independent current check also ran.

| Static obligation | Result and evidence |
|---|---|
| Exact approved scope | PASS. Explicit independent 16-path list equals baseline, Build record and both snapshot sets. Every path changed. Per-file sizes/hashes in `static.json`. |
| Snapshot and current-byte fidelity | PASS. All 16 `before/` hashes/sizes match baseline; all 16 `after/` hashes/sizes match Build record; all 16 current files equal `after/` bytes. |
| Complete incremental delta | PASS. Independent Python standard-library `difflib.unified_diff` reconstruction from before/after equals the entire supplied diff byte-for-byte: 91,377 bytes, SHA-256 `5120935fb2bea8ea37a2d0383cdab54e9f7e3a23b8fb8062b9e80866be1bdce6`. This is the Build delta, not HEAD diff. |
| Two convention homes | PASS. Byte-identical; normalized SHA-256 `f01591d67fe1964309bfd8722c9aa7f51ef644ee17e51385d25f35e71d3a8c38`. |
| Manifest data | PASS. CRLF-to-LF normalization and SHA-256 performed independently without project imports. Exactly one matching path/hash row added once; all 98 original rows retained, no removals; 99 final rows valid and ordered by path then hash. Full generator equivalence UNVERIFIED. |
| Protected starting files | PASS for supplied coverage. All 2,063 fingerprints unchanged, including brief, plan, plan-review, unrelated task/board/wiki files and protected test/guard sources. |
| Index evidence | PASS for available observations: 17 staged status entries equal Build-start status; Verify's captured index hash remains unchanged at final readback. Pre-Build index byte identity UNVERIFIED: Build captured no original index hash. |
| Whitespace | PASS. `GIT_OPTIONAL_LOCKS=0 git diff --check -- <all 16 paths>` exit 0, empty stdout/stderr. Required single-space unified-diff context lines are patch syntax, not source whitespace defects. |
| Contradictory batch/drop guidance | PASS for bounded search and hunk inspection. No hits for the recorded obsolete unconditional batch/merge/drop phrases across the 16 approved paths. This is not proof of model compliance. |

## Plan-to-source contract inspection

The following are static source obligations, each **PASS**, not executed outcomes. Locations refer
to current repository source. Full observations and per-role references are also in `static.json`.

| Contract | Source evidence and result |
|---|---|
| Independent questions and selectable alternatives | `ai-agents/knowledge-base/conventions/asking-the-owner.md:49`, `claude/agents/fkit-lead.md:106`, `codex/materialize.mjs:48`: one independently approvable scope per question; current Codex sequential; batches only with supported shape/count and reliable identity. No batch API introduced. |
| Two independent worker decisions | Convention `:157`, sprint-loop `:384`: two-item prose `decisions` envelope; each item has its own key/question/options/recommendation/context and at most three real options. Legacy single-question return remains valid; no item omitted. |
| Partial, reversed-order, duplicate-label and late answers | Convention `:58`, sprint-loop `:418`, task-loop `:314`: bind by key and unchanged scope, never order or labels; valid partial answers retained; unanswered/ambiguous items pending; changed scope requires a new applicable answer. |
| Explanation and re-ask | Convention `:129`, interview `:98`: any explanation request stops all new dialogs for that turn, retains other valid answers and re-asks only unresolved decisions on the next owner message under the existing rule. |
| Option limits and standing explanation choice | Convention `:110`, runtime prompt `:50`: recommendation first; exact standing label last, once; exact description in preceding chat for string-only Codex. Faithful narrowing or transparent non-authorizing stages preserve valid alternatives and knock-ons. |
| Ordinary choice/custom/cancel source consistency | Unchanged `codex/owner-question.mjs:17–61`, `codex/server.mjs:89`: single question, up to four supplied strings, pending request IDs, ordinary choice without mandatory comment; custom follow-up retains original question and exact text in `comment`; interruption/cancel/decline/invalid replies do not supply approval. Semantic decision binding remains instructional. |
| Plan approval versus retry allowance | Convention `:51`, lead `:122`, sprint-loop `:459`: separate keys/options; both required approvals and allowances must hold; exact scope/answer/date/channel carried; unknown provenance stays unknown. Neither decision grants the other. |
| Missing-interface fallback | Convention `:89`, runtime prompt `:53`: separate explicit choices and pending state for each decision; wait for real answers; uncertain presentation remains unverified. |
| Six roles, interview, titles and dependency effects | All six role diffs align with the shared convention, including architect opening `:32` and coder closing interview `:328`. Interview `:70` deduplicates only the same decision/scope. Owner-facing IDs pair with titles; each placement option retains its knock-on. No placement/dependency change. |
| Heal exception | Heal `:115`: exact enumerated repair list remains one decision; unrelated choices are separate. Only explanatory paragraph changed; named-subset custom route and apply-time freshness retained. |
| Runtime and documentation scope | `codex/materialize.mjs:26,48,65,81`: only prompt strings changed; shared owner-delivery text inserted in both configured runtime bindings. README `:147` and changelog `:14` explicitly retain unverified acceptance. Adapter/schema/native settings/hooks/tests unchanged by this delta. |

Existing `test/launcher-contract.test.js:911–965,1267–1405` read only: ordinary choice,
custom text, cancellation/interruption, invalid/late responses, root eligibility and relay cases.
These sources provide no live rendering or two-decision execution evidence; no new test proposed.

## CONTRIBUTING mapping and skipped execution

Read all of `CONTRIBUTING.md`. Its pause and inactive change table govern this checkout.

| Changed paths / requirement | Mapped check | Result |
|---|---|---|
| `CHANGELOG.md` alone | No automated check covers this path; touched links inspected by eye | New entry adds no link. |
| Other 15 approved paths, including conventions, roles, skills, manifest, runtime source and Codex README | `npm test` | skipped — owner disabled test execution |
| Convention/ai-agents editing; unchanged plan's docs check | `npm run test:docs`; dual-home parity and task-ID uniqueness | skipped — owner disabled test execution |
| Scaffold and manifest | `test/structure-manifest.test.js` via default suite | skipped — owner disabled test execution |
| Adapter/relay contracts named by plan | `test/launcher-contract.test.js`, including focused cases | skipped — owner disabled test execution |
| Prove-red | No named mutation path changed; not additionally mapped | skipped — owner disabled test execution |
| Unit/release suites, suite/build/linter verification | No release scope or additional execution authorized | skipped — owner disabled test execution |
| Discovery/collection, fixtures, smoke/mutation tests, benchmarks, behavioral probes, saved verification scripts | Prohibited under owner ruling | skipped — owner disabled test execution |
| Two decisions, worker relay, live rendering/submission/cancellation, partial/reordered/custom/explanation/re-ask; Claude/mixed host checks | Brief's behavioral/live-host acceptance | skipped — owner disabled test execution |
| Full manifest generator, materializer/initializer and release dry-run verification | Project-code execution explicitly prohibited | skipped — owner disabled test execution |

No fallback `npm test` invocation. Skips are not passes. No new test file, test-source change or
prove-red case. Current guard source inspected without invoking it: all five npm test scripts point
to `test/execution-disabled.mjs`; that guard exits 1; harness and named standalone suites import it
before executable bodies; prove-red exits before its retained body; both workflow jobs have false
guards; default release/dry-run refusal precedes Git operations. This verifies written guard placement,
not actual refusal behavior. The existing untracked `test/execution-disabled.mjs` lacks a pre-Build
protected fingerprint: its present source was inspected and hashed, but earlier byte identity is
not independently provable from missing baseline evidence.

## Commands, limits and handoff

Actual static commands: `wc -lc`; bounded `cat`/`sed -n` reads; targeted `rg -n` and file-name lookup;
`python3` with standard-library `pathlib/json/hashlib/difflib/collections` for bytes/data only;
`GIT_OPTIONAL_LOCKS=0 git status --porcelain=v1 --untracked-files=all`; and the 16-path
`git diff --check`. No repository module imported, evaluated or called. Full command families,
Git arguments/results, fingerprints and source obligations are in [static.json](static.json).
An initial oversized data print was truncated and could not be JSON-decoded by the orchestration;
the rerun saved full data with bounded output. This was an inspection-output issue, not a test run.

Used `fkit-query` read-only. Relevant wiki task 0504 and ADR-021 preserve explanation-first,
next-message re-ask and worker-return semantics. Corrected two missing wiki paths before reading
the actual pages under `wiki/`. Staleness check:
`git log 185ac5e07e918c089ed3afd23496587315342000..HEAD --oneline -- ai-agents/ ':!ai-agents/wiki-vault/'`
returned 12 commits. Wiki's historical batch/merge wording lags current approved source.

Static obligations **PASS**, with baseline coverage limits above. Overall behavioral/live-host
acceptance **UNVERIFIED**; manifest-generator equivalence **UNVERIFIED**. No claim of fully green
Verify, universal model obedience, host presentation, acceptance waiver or automatic closure.
No source defect/repair decision found in this unit. Independent source-only code review remains
outstanding and belongs to the live driver; this unit did not perform or substitute for that review.

Artifacts: this `report.md` and `static.json`, both under the sole authorized Verify evidence directory.
Final readback in `static.json` records source/protected/Build/worklog/index preservation.
Preservation is relative to supplied baseline coverage and this unit's captured fingerprints, not
an invented complete historical index or untracked-file snapshot.

Spend: direct consult **3** (Plan and Build completed); prior plan-review children **3**;
this unit children **0**; Verify launch **1**; revisions **0/2**; retries **0**; no-progress **0/3**.
No additional task/session cap or general retry allowance. Preserve 0555 existing claim,
0537 owner-deferred, 0520 blocked and 0548 exhausted **2/2**; none launched. Attempt/skip set
includes actively driven 0556. No unrelated placement/dependency change.

What's next? Live driver consumes both artifacts and advances to authorized independent source-only
Review with both dated owner rulings; retain the acceptance gaps and normal gates. No continue ping.
