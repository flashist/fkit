# Review — 0520

Task: ai-agents/tasks/backlog/0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh/brief.md
File(s) under review: claude/fkit-claude.sh, test/update-banner.test.js, CHANGELOG.md
Status: in-review
Coverage: reasoning-only second opinion — primary executed `node --test --test-name-pattern='^0520/' test/update-banner.test.js`: exit 0, 3 tests/pass, 0 fail/cancelled/reported skipped; adversarial performed source inspection and hash/snapshot comparisons only, no behavioral execution.

## Reviewer findings

### Round 1 — 2026-11-05

**🛑 Blocked — 0 confirmed defects (0 high/critical); required functional verification failed.**

This is a validation blocker, not an established defect in the scoped patch. No source fix requested. Source evaluation converged; task/ledger closure remains pending. No full-suite green or close-ready claim.

| # | Round | Sev | Location | Claim |
|---|-------|-----|----------|-------|

No novel confirmed Defect or Frontier-move rows. No prior ledger existed, so no prior findings or coder dispositions to deduplicate. No missing-test suggestions.

### Authority and scope

Caller: fkit-lead, fkit-sprint-ship-loop; fresh fkit-reviewer, owned fkit-stateful-review. Task: **0520 — Stop the update check's git ls-remote from prompting over ssh when git rewrites GitHub URLs**.

Owner approval relayed by caller, corroborated by plan-review.md § Actual owner plan/correction decision and worklog.md § Authority; not independently authenticated. Date: **2026-11-05**. Channel: **interactive fkit_roles.fkit_ask_owner in root lead**. Exact answer:

> Approve plan + correction (Recommended) — Accept HTTPS-only automatic Git checks, skipped non-HTTPS notices and the one-call protocol-policy override. Approve the three named cases and exact positive skip filters. Proceed through implementation, verification, review and producer closure; no commit or push.

Historical DRAFT/UNAPPROVED labels in byte-frozen artifacts do not negate this approval. Amendment's positive skip commands govern; obsolete main-plan negative filters were not executed. Latest root-chat owner ruling of 2026-11-05 remains controlling:

> I'm repeating again. If we have any mentions of delays, of timeouts, or of benchmark, durations of tests, or whatever, we should ignore them for now. Let's just continue working on the implementation tasks.

Only the three named source paths' Build change was reviewed against evidence/before-* snapshots and evidence/build-source.diff. Patch SHA-256 independently checked:
`019673d62862ede2e7653de2f7d2eed43d601fef56cd270bcb5092376f802b94`.

Each current source file matches its after-snapshot and Build/Verify after-hash; before-snapshot hashes match Build baseline. The preexisting CHANGELOG entry preserved in evidence/preexisting-source.diff is excluded. Frozen plan.md, verification-amendment.md and plan-review.md hashes match Build audit. Git index matches Build audit. This does not assert preservation of every unrelated working-tree byte.

### Reviewers and model provenance

- Primary: available; fresh fkit-reviewer context. Saved runtime/model selection: Codex / `gpt-6.1-sol`, high effort. Exact serving ID independently unestablished.
- Independent leaf: available and usable, via reviewer-only `fkit_adversarial`; tool metadata reports role fkit-adversarial-reviewer, runtime Codex, model/requested model `gpt-6.1-sol`, exit 0, untruncated. Its own report identifies GPT-6 family, exact serving ID unknown. The tool header establishes the requested ID despite the leaf narrative saying it was unavailable to that context.
- **Both passes used the same model. A different model is recommended for a broader second opinion.** This describes configured/requested selection; actual serving identity and diversity remain unknown. No missing-pass partial flag applies.

### Verified source flow

| Location | Verified behavior |
|----------|-------------------|
| claude/fkit-claude.sh:68, `env GIT_TERMINAL_PROMPT=0 GIT_ALLOW_PROTOCOL=https` | Restriction reaches the single automatic Git child; non-HTTPS rewritten transports are rejected before SSH selection. Parent environment is unchanged. |
| claude/fkit-claude.sh:171, `remote="$(_fkit_remote_sha)"` | Empty failed probe preserves silent continuation and upfront attempt stamp; no fresh cache/banner. Existing Git-present branch adds no curl retry. Explicit reinstall path is unchanged. |
| test/update-banner.test.js:560, `function realGitFixture(kind)` | Real Git, isolated config/non-repository cwd, sealed PATH and fixture GIT_EXEC_PATH, positive HTTPS identity/exchange and working SSH sentinels prevent vacuous success. |
| test/update-banner.test.js:666, `automatic update check must not invoke SSH` | Both rewrite cases require zero sentinel invocations plus unchanged help/config, no banner/latest, empty stderr and preserved attempt stamp. |
| test/update-banner.test.js:688, `readFileSync(f.curlEnvLog, 'utf8')` | HTTPS case proves helper receives HTTPS allowlist, config remains visible, and later curl retains original inherited policy. Synthetic proxy visibility is not native proxy operation. |
| CHANGELOG.md:14, `Automatic update checks silently skip Git URLs rewritten to SSH or other non-HTTPS transports.` | Describes the approved behavior; unrelated preexisting entry excluded. |

Read relevant ADR-009 notification-only decision, ADR-015 additive-launch contract/re-raise conditions, ADR-042 as amended by ADR-061, ADR-061 runtime limits, and CONTRIBUTING's written key list/test mapping. No concrete re-raise trigger or prior-finding regression identified.

### Actual primary execution

| Command/check | Result |
|---------------|--------|
| `node --test --test-name-pattern='^0520/' test/update-banner.test.js` | Exit 0; 3 tests/pass, 0 fail/cancelled/reported skipped. HTTPS controls exit 0; SSH controls exit 128 at sentinels; fixed SSH launcher invocations 0; HTTPS launcher helper invocation 1. |
| `sh -n claude/fkit-claude.sh` | Exit 0. |
| `node --check test/update-banner.test.js` | Exit 0. |
| `git diff --check -- claude/fkit-claude.sh test/update-banner.test.js CHANGELOG.md` | Exit 0. |
| Read-only Python SHA-256/snapshot comparisons and source/call-site inspection | Exit 0; matching scoped evidence described above. |

Node's existing MODULE_TYPELESS_PACKAGE_JSON warning appeared in the test runner; child-launcher stderr assertions passed. No package/config repair. No full suite or prove-red rerun by this reviewer.

### Inherited execution — separate Build/Verify coders

These results were inspected in worklog.md, evidence/build-audit.json, evidence/verify-final-audit.json and evidence/verify-filtered-disposition.json. They are not reviewer execution.

- Build: unchanged launcher reached SSH sentinel; three product expected reds then three fixed targeted passes. Two earlier fixture-preparation failures were not product reproduction or expected-red evidence. Corrected filtered banner: 18 tests/pass, 0 fail. Syntax/scoped whitespace passed. Broad whitespace exit 2 belongs to unchanged archived artifacts outside this scope; no repair or broad rerun.
- Fresh Verify: amended filtered default-equivalent run **exit 1; 970 tests, 946 pass, 23 fail, 1 reported skip, 0 cancelled**. All three new process cases passed. Twenty-two board tests failed at loopback `listen EPERM`: observed environment boundary. One existing first-use launcher assertion failed `9 !== 15`; underlying cause and attribution to this patch are unestablished. Existing test does not establish preexisting failure.
- Prove-red: **exit 1; whole hard gate FAILED**. Unmutated current-copy launcher baseline 0b red (74/75 pass), hook baseline 0c green, all four mutants red. M1 has its green hook baseline; M2/M30/M31 launcher mutation proofs are invalidated by 0b. Mutant redness alone is not a valid launcher proof.
- **Required functional verification remains blocking closure.** No owner waiver of these failed gates supplied. Approved functional exclusions do not waive other failures.

### [adversarial] — verbatim leaf response

> No significant issues found in task 0520’s scoped changes to `claude/fkit-claude.sh`, `test/update-banner.test.js`, and `CHANGELOG.md`. No novel Defect or Frontier-move finding verified.
>
> - **Scope verified:** all three current files match their frozen after-snapshots. `build-source.diff` SHA256 matches `019673d62862ede2e7653de2f7d2eed43d601fef56cd270bcb5092376f802b94`. The unrelated preexisting CHANGELOG entry was excluded.
> - **Suppressed/rejected objections:** skipped non-HTTPS notices, unused SSH wrappers, and the call-local protocol-policy override are explicitly approved tradeoffs. Synthetic helper success establishes transport selection, configuration visibility and environment scoping; native HTTPS/TLS/proxy behavior and Linux remain unverified. No concrete ADR re-raise condition found.
> - **Inherited verification remains a closure blocker:** filtered suite: 970 total, 946 pass, 23 fail, 1 skip, 0 cancelled. Failures comprise 22 loopback-listen `EPERM` failures and one existing first-use assertion (`9 !== 15`), with no attribution to this patch established. Prove-red exited 1: baseline 0b failed, invalidating launcher mutation proofs; baseline 0c passed and four mutants were red. All three new cases passed; focused banner coverage passed 18/18. These are inherited results, not this pass’s execution.
> - **Actual execution:** read-only inspection and `python3 -c` hash/snapshot comparison completed, exit 0. An initial here-document command was blocked; Python emitted cache-access diagnostics. No behavioral checks executed, no delegation or repository writes.
>
> Coverage self-assessment: fresh adversarial pass available and usable; behavior reviewed only by reading and reasoning. Requested model ID unavailable; runtime identifies GPT-6 family, exact serving ID unknown; diversity unknown. A different model is recommended for a broader second opinion.

Leaf static fallback succeeded; initial command restriction does not make the pass unusable. No automatic-approval rejection or pending permission request was reported. Tool-created prompt: `.fkit/tmp/consult-adversarial-reviewer-4cb10c6f-d263-4bcd-87e4-8f11cbfe67e0.md`.

### Re-litigates settled decisions (suppressed)

- Requiring SSH notices/custom SSH wrappers to keep working would reverse the owner-approved HTTPS-only choice. Pointer: Accepted residuals, “Optional HTTPS-only transport.”
- Objecting to replacement of inherited/configured protocol restrictions for this one call repeats the explicitly disclosed approval. Pointer: Accepted residuals, “Call-local protocol policy.”
- Treating the exact approved functional exclusions as new defects repeats the approved amendment. Pointer: Accepted residuals, “Bounded functional exclusions.” No further omission or failing-gate waiver is accepted by that entry.
- Native HTTPS/TLS/proxy, live authentication and Linux remain unverified, not implied by helper success. Recorded limitation, not evidence of a product defect or certification.

### Convergence and root handoff

Both independent inputs converge on no verified source defect. No further source review/fix round justified on this evidence. Retain `Status: in-review` because required functional verification is red. No source-tradeoff disposition remains open; root owns the failed-gate disposition and any separate authorized functional follow-up. Do not infer permission for startup/configuration repair.

Unfiltered default suite not run. Amendment excludes `0284/git-deadline`, `0284/term-ignored`, `0284/no-stray`, and exactly `fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile`. The mixed board case's task creation, abandoned-break handling, lock-owner/break-file cleanup and waiter-backoff coverage remain deferred together. The four omitted bodies are not counted as reported skips; existing opt-in skip remains. Native HTTPS/TLS/proxy, authentication and Linux unexecuted. No deferred investigations reopened.

Writes this round: this ledger only, plus the dispatcher-created scratch prompt identified above; focused tests created/cleaned disposable fixtures outside the repository. No persistent reviewer evidence file, source fix, coder-response content, mover, config/wiki write, commit or push.

**NEEDS-DECISION (root relay):** How should the failed required verification be recorded?
1. **Keep blocked (recommended):** retain the open ledger; root determines separately authorized functional follow-up. No placement/dependency change proposed.
2. **Seek explicit owner gate exception:** root presents the failed suite and invalid launcher mutation proofs for a specific disposition; no waiver or closure inferred here. Closure implications remain producer checks, outside this scoped source review.

## Coder response

| # | Verdict | Defect / Frontier | Action | Status |
|---|---------|-------------------|--------|--------|

### Round 1 — complete Process-review method, 2026-11-05

**Blocked verification; 0 novel findings; source review converged. Ledger remains `in-review`. No source change or closure.**

Task: **0520 — Stop the update check's git ls-remote from prompting over ssh when git rewrites GitHub URLs**. Fresh fkit-coder, Process-review worker for fkit-lead / fkit-sprint-ship-loop. Loaded owned `fkit-process-stateful-review` through `fkit_skill`; completed steps 0–7 below. ADR-019/032/055 standing approval replaces the ordinary per-round code-fix gate for verified, localized, in-plan fixes only. Relayed approval is trusted prose, not independently authenticated owner-channel evidence. Full approved plan/amendment were carried in the spawn; their historical draft labels remain untouched.

Owner's failed-gate disposition, **2026-11-05**, **interactive fkit_roles.fkit_ask_owner in root lead**, root-recorded **10:00:21 UTC**, verbatim:

> Keep blocked; continue implementation (Recommended) — Leave this task open with failed verification recorded, then continue the next eligible sprint task. No closure exception.

This resolves Reviewer findings § Convergence and root handoff's owner question. No new owner decision is requested; the reviewer-owned historical question and all other reviewer text remain unchanged.

#### Step 0 — resolve, ground, load settled decisions

Explicit ID 0520 resolves unambiguously to this existing task-folder ledger. Read the full brief, ledger and worklog; loaded all three Accepted residuals with their re-raise conditions: Optional HTTPS-only transport, Call-local protocol policy, Bounded functional exclusions. Skimmed relevant source ADRs 009/015 (optional notification and additive launch), 019/032/055 (standing approval and audit), 034 (work-product review close bar), 057 (process tests/key list), and 061 (runtime/provenance limits); ADR-042's historical coverage rule is amended by ADR-061. Current CONTRIBUTING and relayed owner instructions govern actual functional checks. ADR-034 does not waive failed required verification or the owner's keep-blocked ruling.

Read-only `fkit-query` grounding: [[systems/install-and-self-update]], [[systems/testing-and-verification]], and the linked ADR-061 page; read codex/README.md and model-agnostic-sprint/HANDOFF.md for current runtime context. Note: 12 commits touched `ai-agents/` since watermark `185ac5e07e918c089ed3afd23496587315342000`; historical wiki statements yield to current source decisions and owner rulings. No wiki writes.

#### Step 1 — identify novel findings

Reviewer findings has zero finding rows; prior Coder response has zero rows. Novel set: **0**. No pasted findings were seeded. Failed verification is retained as a gate result, not fabricated into a source finding.

#### Step 2 — loop check first

No novel row requires closeout or reopening. No residual/ADR re-raise condition is established by the scoped evidence. Suppressed-as-settled objections, preserving the reviewer's pointers:

- Requiring non-HTTPS notices/custom SSH wrappers: Accepted residuals, **Optional HTTPS-only transport**.
- Rejecting this single child's inherited/configured protocol-policy replacement: Accepted residuals, **Call-local protocol policy**.
- Requiring the four expressly excluded bodies: Accepted residuals, **Bounded functional exclusions**. This accepts no additional omission or failed-gate waiver.

Native HTTPS/TLS/proxy, live authentication and Linux remain unverified limitations, not new findings. No suppression disposes of the actual suite/prove-red failures.

#### Step 3 — verify actual flow and severity

No novel claim exists to verify or assign severity. Independently read actual launcher call/continuation flow (`claude/fkit-claude.sh:68`, `env GIT_TERMINAL_PROMPT=0 GIT_ALLOW_PROTOCOL=https`; `:171`, `remote="$(_fkit_remote_sha)"`) and the fixture/three assertions (`test/update-banner.test.js:560`, `function realGitFixture(kind)`; `:666`, `automatic update check must not invoke SSH`; `:688`, curl environment assertion), plus the Build-only patch and CHANGELOG entry. Restriction is confined to the Git child's env arguments; empty probe output follows existing silent continuation/cache guards. Fixtures seal Git helpers/config, establish positive controls and observe HTTPS-versus-curl policy scoping. This read-through is not behavioral execution or a replacement reviewer pass.

Read-only SHA-256/snapshot and Git-blob comparisons pass: current three source files match Build after-hashes; Build patch matches its recorded hash; approved plan trio and index match. Reviewed Build/Verify audits and filtered disposition separately from new execution. No new source defect, blast-radius claim or severity was inferred from unresolved first-use failure.

#### Step 3.5 — defect/frontier and regression check

Zero novel Defect or Frontier-move rows; classifications/severities are inapplicable. The three accepted policy costs remain settled. No proposed fix, prior coder finding or disposition exists to regress/oscillate against. Known gate failures remain blocking; first-use cause/patch attribution is unestablished. No startup/configuration investigation or unrelated fix is authorized.

#### Step 4 — verdict rows

Zero finding IDs means zero verdict/status rows. The prescribed Coder response table above stays empty; no invented CORRECT/closeout/blocked finding or placeholder ID. Prior dispositions: none.

#### Step 5 — report, convergence, standing gate

Summary table above: zero rows; novel findings/dispositions **0**. Suppressed-as-settled list is in Step 2. Code change required: **NONE**. Source evaluation converged; recommend ending source fix/review rounds on this evidence while retaining the open ledger and failed verification. The owner has already chosen keep blocked, continue the next eligible sprint task; no form or new consent inferred. Standing approval was not used to apply any fix.

#### Step 6 — apply only approved fixes, preserve status

Applied **NONE**. No autonomous fix or obvious-winner choice; worklog decision log records **NONE**. No new residual, test, source edit, staging or task move. Existing residual bytes unchanged. `Status: in-review` remains because required verification is failed and owner explicitly declined a closure exception; no close-ready claim. Reviewer-owned header/Coverage/findings are preserved verbatim. No post-review source change means no new root reverify triggered by this worker; historical failed gates remain failed.

#### Step 7 — final result and separate execution accounting

- This worker: read-only code/document inspection, source/patch/plan/index fingerprint comparisons and document/preservation checks only. No behavioral check, suite, prove-red, syntax or whitespace rerun. Fingerprint-matched results were retained; no fresh pass manufactured.
- Primary reviewer execution: three approved process cases **3/3 pass**, syntax and scoped source whitespace exit 0. Independent leaf: usable static/hash-only pass; no behavioral execution. Both passes used the same model. A different model is recommended for a broader second opinion. Configured/requested selection is `gpt-6.1-sol`; exact serving identity/diversity unknown.
- Inherited Build: isolated unchanged-source SSH reproduction, three expected reds, targeted 3/3 green, focused banner **18/18 pass**, shell/JS syntax and scoped whitespace pass. Global whitespace exit 2 is unchanged archived Task 0552 — Remove test timing restrictions evidence/plan formatting; no repair or rerun.
- Inherited Verify: filtered suite **exit 1; 970 tests, 946 pass, 23 fail, 1 reported skip, 0 cancelled**. Failures: 22 loopback `listen EPERM`, one existing first-use assertion **9 versus 15**, cause/patch attribution unresolved. All three approved new cases pass. Prove-red **exit 1; hard gate FAILED**: baseline 0b **74/75 pass**, 0c green, four mutants red. M1 has a valid green hook baseline; M2/M30/M31 launcher proofs remain invalidated by 0b. No waiver.
- Coverage remains the approved positive filters; unfiltered default/excluded bodies not run. Three named banner bodies plus the exact mixed board body are omitted, not four reported skips. The sole reported skip is existing opt-in coverage left disabled. Mixed-board task creation/abandoned-break handling/lock-owner and break-file cleanup/waiter-backoff coverage stays deferred together. Native HTTPS/TLS/proxy, live authentication and Linux unverified; synthetic helpers prove only isolated transport/configuration/environment behavior.
- Written: Coder response only, appended worklog method/decision record, necessary preservation audit `evidence/process-review-audit.json`. No source changes or new accepted residuals. Ledger **in-review**; task remains open for root's accurate Blocked handoff. This skill made no commit or push and invoked no mover. No pending owner question; root's keep-blocked disposition controls.

## Accepted residuals (shared, do-not-re-litigate)

Authority for the following three entries: owner approval quoted in Reviewer findings § Authority and scope, 2026-11-05, interactive fkit_roles.fkit_ask_owner in root lead; also plan-review.md § Actual owner plan/correction decision.

- Optional HTTPS-only transport — What: automatic Git update probe skips rewritten non-HTTPS transports; custom SSH commands, wrappers, keys and SSH proxies remain unused by this probe · Why (structural): optional notices must avoid SSH interaction; forcing or editing arbitrary SSH wrappers cannot ensure silence while preserving their behavior; curl retry/rewrite detection adds unapproved behavior · Re-raise only if: the call still invokes SSH after rewriting despite the allowlist, a concrete new regression appears within approved scope, or owner changes the chosen transport policy.
- Call-local protocol policy — What: this Git child replaces inherited GIT_ALLOW_PROTOCOL and overrides Git configuration rejecting HTTPS, while other operations retain their policy · Why (structural): the explicit allowlist guarantees the selected automatic transport; preserving arbitrary inherited restrictions would defeat the approved positive HTTPS behavior; ignoring all config would lose HTTPS proxy settings · Re-raise only if: the override leaks into another operation/parent environment, mutates user configuration, fails its selected transport restriction, or owner revises the accepted policy.
- Bounded functional exclusions — What: only the amendment's three named banner bodies and exact mixed board case are deferred, with their functional omissions disclosed; native-network/platform certification is not claimed · Why (structural): owner approved the exact positive skips and bounded synthetic fixture plan; splitting/weakening tests or adding replacement cases was rejected · Re-raise only if: runner selection executes an excluded body, omits additional required functional coverage, an omission causes a new concrete defect, or owner revises scope. This settles no remaining failed gate.

