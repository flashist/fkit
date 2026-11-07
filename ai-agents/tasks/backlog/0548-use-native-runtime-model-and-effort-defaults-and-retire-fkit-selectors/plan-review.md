

## Attempt 1 — 2026-11-05 — plan worker did not land

Fresh coder returned exit1, timed out false, truncated false, no usable response. Wrapper reported configuration-startup category; actual cause unproved. Prompt .fkit/tmp/consult-coder-4b526269-7fb3-4997-b13a-6bec0777e202.md. Driver read named draft surface: .fkit/tmp/0548-plan-20261105/ absent, zero files; no approved plan.md. No source change. Reset brief and Sprint15 row to Backlog, skip548 this run. Retry disposition remains owner-held. Read-only typed-coder CLI fallback unblocking check is a separate unit; no hidden implementation retry or timing investigation.


## Attempt 2 — 2026-11-05 — authorized typed CLI retry did not land

Owner-authorized one CLI plan retry used. Typed fkit-coder process returned exit1, zero stdout, no complete response markers. Transport metadata .fkit/tmp/0548-cli-plan-result-20261105/transport.json; role-return.md empty. Private diagnostic stderr suppressed, not persisted. No cause asserted and no further infrastructure investigation.

Driver read named draft surface: .fkit/tmp/0548-plan-cli-20261105/ absent, zero drafts; role-return empty; no approved plan.md. Reset brief and Sprint15 row to Backlog, skip548 this run. No source plan approved or implementation landed. Both explicitly authorized CLI retries consumed. Owner decision required before extra launches; proposed staged planning preserves roles/review/source approval, changes single-spawn planning arrangement only if owner rules.


## Attempt 3 — 2026-11-06 — staged planning incomplete; final revision did not land

Driver administrative failure record, not a worker-produced complete PLAN-REVIEW record.
Plan review: ON (default). Same continuing Sprint 15 run started 2026-11-05 08:03:24 UTC.

Actual owner staged permission, 2026-11-05, interactive `fkit_roles.fkit_ask_owner` in root lead,
observed 08:03:24 UTC, quoted verbatim:

> Authorize staged workflow (Recommended) — Separate coder drafting, fresh architect/producer reviews, independent adversarial pass, and coder finding check into role workers. At most two launches per stage and two approver revision rounds. Unchanged saved settings; no investigations. Your full-plan approval still precedes Build.

Actual owner selected-agent policy, same date/channel, observed 10:34:15 UTC, quoted verbatim:

> Block affected launches (Recommended) — Preserve the file and stop that agent’s launch until the owner resolves it. Other verified roles remain usable; edited readable agents may also be blocked.

Product classification. R0 and R1 coder drafts landed; R0 architect and producer requested changes.
R1 producer approved; R1 architect requested the explicit hook deny response/coverage and the exact
final gate including concrete ADR amendments and a scoped owner-present recording exception.
Two approver revision rounds were allocated. Both permitted launches of final revision R2 returned
exit 1 with zero stdout; complete R2 approver reviews, adversarial pass and coder finding check
were not run. Actual failure cause is unknown and was not investigated.

Named output readback: both role-return.md files were read and empty; optional
`.fkit/tmp/0548-staged-revision-r2-retry-20261105/plan-draft.md` is absent. Both transport records
were read. No approved plan.md exists. R1 is 13,935 bytes, SHA-256
`8b5cd03a0dc72cbd33ca1447c0d3fc65ba7680419b0faf113efdeb4ca6e47e6b`, unchanged.
Original role returns and prompts remain under .fkit/tmp; copies below preserve the returned
review text and last complete draft. No source implementation is authorized. No final plan was
presented to the owner; no final approval/rejection or recording exception was received.
Reset brief and sprint row to Backlog, skip this run, additional launch disposition owner-held.
No model/settings changes, failure diagnosis, verification waiver, commit, push or closure.

Both approver passes used configured/requested gpt-6.1-sol, exact serving identities/diversity
unknown. The independent adversarial pass for this plan was NOT RUN; review is incomplete.
Actual execution is stated separately in the verbatim peer returns below; static checks are not
behavioral execution.


### Verbatim Architect R0 return

Role: fkit-architect
Runtime: codex
Model: gpt-6.1-sol
Model requested: gpt-6.1-sol
Exit: 0
Timed out: false
Truncated: false
Prompt: /Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/consult-architect-4b4b0052-962d-499a-8e97-6b213fc76323.md

CHANGES REQUESTED

**Task0548 — Use native runtime model and effort defaults and retire fkit selectors:** product classification is correct. Migration and runtime precedence are feasible. R0 needs these changes:

1. **Complete the verification filter.** R0 still executes `fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile`. Its assertions measure elapsed time and CPU usage ([store.test.js:568](/Users/mark.dolbyrev/Workspace/fkit/test/board/store.test.js:568)). Add its exact full name to the skip pattern; disclose deferred lock-cleanup functional coverage. Both proposed reinstall names are accurate ([update-reinstall.test.js:589](/Users/mark.dolbyrev/Workspace/fkit/test/update-reinstall.test.js:589), [:602](/Users/mark.dolbyrev/Workspace/fkit/test/update-reinstall.test.js:602)); skipping them also defers download-failure and partial-script protection coverage.

2. **Freeze the ownership contract.** “Known shipped definitions” needs a bounded, identified historical set and narrowly defined frontmatter normalization. No recognition mechanism currently exists: initializer deletes the namespace and copies canonical files ([initializer:371](/Users/mark.dolbyrev/Workspace/fkit/claude/fkit-claude-init.sh:371)). State that unknown bodies remain untouched, absent canonical files are installed safely, and unrelated collisions do not block another selected role.

3. **Make launch blocking and coverage explicit.** Name the shared check and every caller: configured direct, shell consult, MCP/adversarial, and legacy Claude execution. Shell consult bypasses setup; MCP launches directly ([fkit.mjs:351](/Users/mark.dolbyrev/Workspace/fkit/codex/fkit.mjs:351), [server.mjs:35](/Users/mark.dolbyrev/Workspace/fkit/codex/server.mjs:35)). Legacy setup currently permits continued launch after failure ([launcher:359](/Users/mark.dolbyrev/Workspace/fkit/claude/fkit-claude.sh:359)). Explicitly disclose the compatibility cost: an edited, readable agent can become launch-blocking despite having no selector.

**Required dated ADR amendments, before Build:**

- **ADR-061 Decision 1:** project/role settings route runtimes only; retired selector data is inert and preserved; fkit emits no model/effort substitute. Native configuration governs selection; observed identity remains separate.
- **ADR-061 Decision 6’s 2026-10-30 amendment:** replace model/effort interviews with runtime-only review/save; preserve saved bytes during inspection/launch and retained data during runtime edits.
- **ADR-043 Decision, supported-entry guarantee, and consequences:** scope unconditional replacement to the unchanged skills behavior; replace the agent guarantee with verified ownership, preservation/reporting, and the owner-selected launch policy. This explicitly triggers its [re-raise condition 1](/Users/mark.dolbyrev/Workspace/fkit/ai-agents/knowledge-base/decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee.md:325).

The brief settles preservation and native defaults; it does **not** waive the owner-present decision-recording procedure.

**NEEDS-DECISION — unknown selected Claude agent**

Context: preservation is required; blocking an otherwise readable agent is a new compatibility choice.

- **Block affected launches (Recommended):** strongest guarantee; edited agents require owner resolution.
- **Allow demonstrably selector-free copies:** preserves more existing launches; retains potentially stale role instructions.
- **Explain more, then ask again:** give more context in simple terms, then re-ask.

**Accepted costs:** retiring `--runtime-default`; inert legacy data retained; historical copies outside the recognized set preserved; live Claude/mixed compatibility unverified; inherited verification failures remain open.

**Evidence/provenance:** fresh Codex architect pass; serving model identity unavailable. Static source/ADR/test inspection and draft SHA-256 verification only. No behavioral/native execution, nested consults, or writes. Coder’s reported nine checks were not rerun.

**What's next?** Revise R0 and obtain the launch-policy ruling; complete normal ADR recording before Build.




### Verbatim Producer R0 return

Role: fkit-producer
Runtime: codex
Model: gpt-6.1-sol
Model requested: gpt-6.1-sol
Exit: 0
Timed out: false
Truncated: false
Prompt: /Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/consult-producer-d88fc8a7-8caf-4dee-87f4-68e3416d51a5.md

CHANGES REQUESTED

**0548 — Use native runtime model and effort defaults and retire fkit selectors:** product classification correct; scope otherwise matches the brief.

1. **Blocker — §8 filter revives deferred checks.** [Draft line 92](/Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/0548-staged-draft-r0.md:92) does not exclude `fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile`. [Actual case](/Users/mark.dolbyrev/Workspace/fkit/test/board/store.test.js:568) includes elapsed-time and CPU assertions. Add its exact full name to the skip pattern; explicitly defer its lock-recovery assertions too. No reproduction needed.

2. **Blocker — omitted functional coverage needs disclosure.** Both named reinstall cases exist and match the filter. Skipping them also defers download-failure reporting, exit status and prevention of partial-installer execution—not merely deadline assertions. State that coverage loss alongside the filtered-suite qualification.

**Owner-gate costs, not additional blockers:** rejecting retired selectors, including `--runtime-default`, with exit 1 breaks old scripts; preserving an unrecognized selected agent can prevent its launch. Present both explicitly for approval, alongside the three individually named new tests. ADR-061/ADR-043 resolution remains architect-owned under the normal decision gate.

No split or placement change needed. No-loss legacy handling, native-preference preservation, routing, cancellation and setup semantics are adequately planned. Live configured Claude/mixed compatibility remains unverified; inherited first-use, 22 loopback-permission failures and prove-red baseline failure remain unresolved.

**Evidence/provenance:** fresh Codex producer pass; serving-model identity unknown. Static inspection only; no behavioral/native tests, writes or nested consults. Frozen draft verified: 9,921 bytes; supplied SHA-256 matches. Selector confirms Sprint 15 sole active, lowest-ordered.

Note: 12 commits touched `ai-agents/` since wiki watermark `185ac5e`; current sources and owner rulings govern. Consider `/fkit-wiki-sync` separately.

**What's next?** Revise §8, then continue the remaining authorized review stages before full-plan owner approval.




### Verbatim Architect R1 return

Role: fkit-architect
Runtime: codex
Model: gpt-6.1-sol
Model requested: gpt-6.1-sol
Exit: 0
Timed out: false
Truncated: false
Prompt: /Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/consult-architect-b0b401a2-d51b-4db6-afa0-e35fa72c3db4.md

CHANGES REQUESTED

**0548 — Use native runtime model and effort defaults and retire fkit selectors:** product classification is correct: configuration, launch behavior and compatibility change.

1. **Specify and verify the legacy hook’s blocking response.** R1 says verification failure exits **1**, but the existing Claude hook contract blocks through explicit `hookSpecificOutput.permissionDecision: "deny"` with exit **0** ([carry-check-hook.mjs:20](/Users/mark.dolbyrev/Workspace/fkit/claude/carry-check-hook.mjs:20)). R1 currently promises hook-wiring assertions only.

   Amend the plan: the shared selected-role command may return **1**; its hook adapter translates refusal, missing Node and unparseable verification into the existing blocking response. Preserve carry-check’s separate fail-open policy ([carry-check-hook.sh:8](/Users/mark.dolbyrev/Workspace/fkit/claude/carry-check-hook.sh:8)). Extend the proposed three cases or existing cases to exercise both `Agent` and `Task`: verified target, unknown selected target, unrelated identifiable target, malformed payload and missing Node. Assert the actual allow/deny output, preservation and role-local behavior. No fourth named case is needed.

   **Scope:** a plan-contract and coverage gap; no implemented hook defect or live Claude behavior was demonstrated.

2. **Replace the vague owner-present ADR prerequisite with an executable gate sequence.** A fresh headless architect cannot silently satisfy the normal owner-present procedure through a relayed decision. The [architect role:86](/Users/mark.dolbyrev/Workspace/fkit/claude/agents/fkit-architect.md:86) says these procedures “need the owner” and, in consult mode, “return that recommendation — don't run a half-blind version of it.”

   The loaded [fkit-record-decision/SKILL.md:42](/Users/mark.dolbyrev/Workspace/fkit/.agents/skills/fkit-record-decision/SKILL.md:42) says: “Ask the owner for anything missing”. That does **not** require repeating settled questions. The remaining restriction is the role’s owner-present requirement. Neither supplied November 5 ruling grants its exception; the earlier exception was expressly scoped to task 0546 ([ADR-061:35](/Users/mark.dolbyrev/Workspace/fkit/ai-agents/knowledge-base/decisions/adr-061-codex-as-a-full-seven-role-runtime-with-explicit-local-limits.md:35)).

   **Required sequence:** freeze the corrected full plan and amendment text → finish authorized fresh reviews, adversarial pass and finding check → root presents one complete owner gate explicitly including the guard’s costs and the scoped recording exception → record the actual answer/date/channel → one fresh architect invokes owned `fkit-record-decision` and appends the approved amendments → verify append-only changes → coder may enter Build. This is instruction-enforced, not a runtime write wall.

**Confirmed R0 corrections**

- All four release anchors match local Git. All L/P fingerprints match; P2 equals P; C differs only for lead; current working canonical definitions equal C.
- Normalization is sufficiently bounded: only the specified unique scalar selector lines disappear; all other bytes remain significant. This recognizes shipped content, not authorship of arbitrary edited files.
- The named shared check covers configured direct/shell consultation, MCP/adversarial, legacy cold-start/final execution and proposed native delegation. These are the relevant seams ([fkit.mjs:351](/Users/mark.dolbyrev/Workspace/fkit/codex/fkit.mjs:351), [server.mjs:35](/Users/mark.dolbyrev/Workspace/fkit/codex/server.mjs:35), [launcher:553](/Users/mark.dolbyrev/Workspace/fkit/claude/fkit-claude.sh:553)).
- The revised filter statically matches exactly **seven** intended cases across **29** discovered files, including the suite-qualified board case. Its deferred functional coverage is disclosed adequately.

**Guard recommendation and owner costs**

The shared initializer mode plus Node hook adapter is technically feasible. Dispatch agents-only/hook modes before normal initialization side effects; otherwise delegation could trigger scaffold, rules or intake work ([initializer:12](/Users/mark.dolbyrev/Workspace/fkit/claude/fkit-claude-init.sh:12)).

Recommend the bounded guard. It closes delegation after initial refresh without creating a manifest or general conformance system. However, **requiring Node for legacy delegation is a new compatibility decision**, not merely implementation of the settled unknown-agent ruling:

- Legacy root sessions can remain Node-free; without Node, their native delegation is denied.
- Unparseable target data denies delegation even when the intended target might be unrelated.
- Edited readable canonical agents block their own launches; unrelated verified roles remain usable.
- Existing carry-check behavior remains separate. Codex hooks remain disabled ([fkit.mjs:15](/Users/mark.dolbyrev/Workspace/fkit/codex/fkit.mjs:15)).
- Update the current broad Node-free wording in help/docs ([README:37](/Users/mark.dolbyrev/Workspace/fkit/README.md:37), [launcher:113](/Users/mark.dolbyrev/Workspace/fkit/claude/fkit-claude.sh:113)).

**Concrete amendment content for the final owner gate**

Append dated **⛔ partial-reversal notes**; retain existing body text and accepted status. The procedure explicitly says corrections are “appended next to it, never written over it” ([SKILL.md:181](/Users/mark.dolbyrev/Workspace/fkit/.agents/skills/fkit-record-decision/SKILL.md:181)). Record actual final approval provenance only after receipt; describe these as approved contracts pending implementation, not verified live behavior.

- **ADR-061, below Decision 1:**

  > ⛔ **Dated partial reversal — task 0548:** project and role settings route runtimes only. Retain schema 1 and `.fkit/model-settings.json`. Legacy `model` and `reasoningEffort` values are inert regardless of type and remain preserved. Runtime, schema, container, role, unrelated-field and file-safety validation remain. Resolve runtime by root-only override, explicit role runtime, then project runtime; model-only role records do not pin runtime. Children reload saved routing independently. fkit supplies no model, effort, profile, reset or snapshot substitute on direct, consultation or adversarial launches. Native runtime configuration governs selection; observed identity remains separate and may be unknown. Existing role, approval, sandbox, fresh-context and review-reporting limits remain. Pre-existing text is left byte-identical; Status stays `accepted`.

- **ADR-061, below the October 30 Decision 6 amendment:**

  > ⛔ **Dated partial reversal — task 0548:** retain explicit first-use runtime choice, runtime-only review, one explicit save, cancellation and same-command continuation. Remove model/effort catalogs and interviews, without adding a role-customization interview. Inspection and launch preserve saved bytes; runtime edits preserve retained data and explicit role runtimes except requested changes. Retired selector commands, including `--runtime-default`, fail with exit 1 before persistence or launch; literal task operands and arguments after `--` remain operands. Existing entry, preflight and cancellation boundaries remain except for the explicitly approved legacy delegation requirement recorded in ADR-043. Pre-existing text is left byte-identical; Status stays `accepted`.

- **ADR-043, below Decision:**

  > ⛔ **Dated partial reversal — task 0548:** unconditional agent replacement no longer governs. Skills retain their existing refresh behavior. Agent refresh recognizes only the seven exact canonical filenames and the bounded shipped-content fingerprints and normalization specified in task 0548’s approved plan. Install absent definitions safely; refresh recognized copies to selector-free canonical definitions. Preserve and report unknown bodies, unlisted names, unreadable files, wrong types and symlinks. Unrelated collisions do not block verified roles. Before each supported selected Claude launch or native delegation, verify that selected canonical role through the shared agents-only check; otherwise refuse without substituting a role or dropping `--agent`. This is bounded ownership recognition, not structure conformance: add no spec rows, manifest or persistent ownership registry. Pre-existing text is left byte-identical; Status stays `accepted`.

- **ADR-043, below the supported-entry guarantee:**

  > ⛔ **Dated partial reversal — task 0548:** supported entry guarantees selected-role verification rather than unconditional replacement of every agent. Legacy root entry remains Node-free; the native Agent/Task verification adapter requires Node and denies delegation when verification is unavailable or unparseable. Identifiable unrelated targets pass. Carry-check retains its separate semantics; Codex hook registration remains disabled. This intentionally cross-references the replacement Decision above, deliberately not restated here, so there is one place to keep true rather than two.

- **ADR-043, consequences and re-raise condition 1:**

  > ⛔ **Dated partial reversal — task 0548:** owner-edited agent files are preserved and can block their selected launches even when selector-free; older unlisted shipped definitions remain unknown. Missing Node or unreadable target data can block legacy delegation. Other verified roles remain usable. Re-raise condition 1 is exercised and resolved for this bounded ownership policy; unconditional skill refresh and exclusion from structure conformance remain. Checks establish state at verification, not immutable state throughout native loading. Live configured Claude/mixed compatibility remains unverified. Pre-existing text is left byte-identical; Status stays `accepted`.

Add or extend each ADR’s `Corrections` metadata with these sites and the existing marker legend. Use actual dated provenance, quoted source anchors and append-only diff proofs.

**NEEDS-DECISION — include in root’s final full-plan gate**

Context: native-default behavior and unknown-agent blocking are settled. The new delegation dependency and headless recording exception are not.

- **Approve full plan, guard and recording exception (Recommended):** accept the disclosed delegation costs; authorize one fresh architect worker to record only the approved amendments, waiving only its owner-present interview.
- **Use an owner-present architect session:** settle and record the amendments there before Build; no worker exception.

No scheduling, priority or task-dependency changes follow. Root adds the standing explanation option.

**Evidence and limits:** frozen R1 verified at **13,935 bytes**, SHA-256 `8b5cd03a0dc72cbd33ca1447c0d3fc65ba7680419b0faf113efdeb4ca6e47e6b`. Executed read-only source/ADR/test inspection, local Git content comparisons and static hashing/name matching. No behavioral/native checks, nested roles or writes. Serving model identity unknown.

Inherited **0520** verification remains **FAILED: 970 total, 946 pass, 23 fail, 1 skip**; the reported 22 loopback-permission failures, existing first-use failure and prove-red baseline **0b FAILED** were not rerun or waived. Live Claude/mixed compatibility remains unverified. Existing source deltas and frozen **0552 — Remove test timing restrictions** artifacts were untouched.

**What's next?** Incorporate the two bounded corrections and concrete gate package into the next frozen plan revision; finish the authorized review stages before owner approval.




### Verbatim Producer R1 return

Role: fkit-producer
Runtime: codex
Model: gpt-6.1-sol
Model requested: gpt-6.1-sol
Exit: 0
Timed out: false
Truncated: false
Prompt: /Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/consult-producer-af5664cf-88ee-46ec-afe9-9a6403d2bee2.md

APPROVE

**0548 — Use native runtime model and effort defaults and retire fkit selectors:** product classification correct. Configuration, CLI, agent delivery and visible behavior change together. No confirmed producer blocker remains.

1. **Both R0 blockers resolved.** R1 includes the exact nested board-case exclusion and adequately discloses lost functional coverage: launch/cleanup, lock recovery, successful reinstall, failed-download reporting, partial-installer prevention and snapshot parity. Static inspection found seven matching literal cases across 29 files. This supports the filter’s stated scope; it is not test execution.

2. **Requirements complete at plan level.** Runtime-only selection, fresh child routing, inert legacy values, byte-preserving inspection, retained validation, native-preference preservation, setup continuation and cancellation/failure semantics match the [brief](/Users/mark.dolbyrev/Workspace/fkit/ai-agents/tasks/backlog/0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors/brief.md). Retiring every listed selector, including `--runtime-default`, with exit **1** is an explicit compatibility cost for the full-plan owner gate. The three individually named new tests also remain proposals until that gate.

3. **Agent boundary is bounded and disclosed.** Independently checked **35/35** historical/current fingerprints across seven roles. Selected-agent verification covers direct, shell, MCP and adversarial callers. The owner already settled preservation plus affected-launch blocking; do not re-ask that policy. The new legacy Agent/Task guard adds a distinct cost: missing Node or unverifiable target data blocks delegation. Architect confirmation remains required; this producer approval does not supply it.

4. **Required sequence remains explicit.** Finish fresh architect/producer reviews → independent adversarial pass → fresh coder finding check → owner-present architect decision procedure and dated ADR-061/ADR-043 amendments → root’s complete-plan owner approval → Build. Resolve any architect-requested plan changes within the authorized revision limits.

   [fkit-record-decision/SKILL.md](/Users/mark.dolbyrev/Workspace/fkit/.agents/skills/fkit-record-decision/SKILL.md:13) says, **“Execute it only if you are the architect.”** The [architect role](/Users/mark.dolbyrev/Workspace/fkit/claude/agents/fkit-architect.md:86) additionally says its interactive procedures **“need the owner.”** Therefore an ordinary headless review worker cannot substitute for decision recording. These are source instructions, not a runtime write wall. This review is complete; no approval is requested here.

5. **Limits preserved.** Live configured Claude/mixed compatibility remains **unverified**. Inherited verification for **0520 — Stop the update check's `git ls-remote` from prompting over ssh when git rewrites GitHub URLs** remains reported **FAILED: 970 total, 946 pass, 23 fail, 1 skip**, plus failed prove-red baseline. Neither was rerun or waived. Historical global whitespace failure and reported scoped-source success also remain inherited evidence. No placement/dependency change is proposed; the brief records no dependencies or blocked tasks.

**Evidence:** frozen R1 verified at **13,935 bytes**, SHA-256 matches supplied value. Read-only source/ADR/wiki/test inspection and static fingerprint/name checks only. No behavioral/native tests, nested consultations or writes. Serving-model identity unknown.

Note: **12 commits** touched `ai-agents/` since wiki sync `185ac5e`; wiki lacks this new decision. Consider `/fkit-wiki-sync` separately.

**What's next?** Root completes the remaining authorized reviews and owner gates before Build.




### Last complete draft R1 — unapproved, copied verbatim


- **0548 — Use native runtime model and effort defaults and retire fkit selectors**
- **Product change:** changes configuration, launch arguments, agent refresh and displayed settings; producer and architect approval required.
- **Revised draft only.** Root owns remaining reviews and owner gates. Planning restraint is instruction-enforced; no approved `plan.md` or Build authorization.

### 1. Prerequisites and sequence

Root reruns fresh architect/producer reviews, then the independent adversarial pass and fresh coder finding check, within the authorized stage limits. The owner then sees and approves the complete plan before Build.

Before Build, the architect must complete its normal owner-present decision-recording procedure and dated amendments to:

- `ai-agents/knowledge-base/decisions/adr-061-codex-as-a-full-seven-role-runtime-with-explicit-local-limits.md`: Decision 1 becomes runtime-only routing, preserved inert selectors and native model/effort selection; Decision 6’s 2026-10-30 amendment replaces selector interviews with runtime-only review/save and byte-preserving inspection.
- `ai-agents/knowledge-base/decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee.md`: amend Decision, supported-entry guarantee and consequences. Skills retain existing behavior; agents use verified ownership, preservation/reporting and affected-launch blocking. Its re-raise condition 1 applies.

The November 5 launch-policy ruling settles blocking; it grants neither implementation approval nor an exception to the architect’s owner-present procedure. The legacy native-delegation guard proposed below also needs architectural confirmation.

### 2. Runtime-only settings and invocation

Change `codex/settings.mjs`, retaining schema 1 and `.fkit/model-settings.json`.

Ignore project/role `model` and `reasoningEffort` during validation and resolution, regardless of value type. Preserve runtime, schema, container, role and unrelated unknown-field validation; malformed JSON remains an error.

Resolve runtime as root-only launch override → explicit role runtime → project runtime. Model-only records do not pin runtime; children reload saved settings independently.

Launch, preview and inspection preserve saved bytes. Runtime edits clone retained data and change requested runtime fields only, retaining retired fields even on edited records. Default changes preserve explicit role runtimes; new records contain runtime fields only. Preserve containment, regular-file, symlink and atomic-write protections.

Remove selector emission from `codex/fkit.mjs::launchArgs` and `codex/claude.mjs::claudeArgs`, including the undefined-model hazard. Add no model, effort, profile, reset or snapshot substitute.

Cover seven roles, both runtimes, interactive/headless direct launches, shell consult, MCP consultation and reviewer adversarial delegation. Preserve existing approval, sandbox, ownership, tools, fresh-context, carry-check and disabled-hook controls.

Update help/settings/preview, `codex/server.mjs` provenance/descriptions and `codex/materialize.mjs` bindings: runtime routing is saved; fkit requests no model/effort; native configuration governs selection. Report observed identity separately, including unknown. Preserve same-model disclosure, different-model recommendation and missing-pass reporting.

### 3. Runtime-only CLI and setup

Update `bin/fkit` and `codex/fkit.mjs`.

Retire `models`, `--model`, `--role-model`, `--effort`, `--role-effort` and `--runtime-default`. Exit **1**, explaining removal/native defaults, before persistence or launch. Handle missing/valued operands and `--flag=value`. Parse option positions; preserve literal task operands and legacy arguments after `--`.

Keep `configure --runtime codex|claude` and `--role-runtime ROLE=codex|claude`. Runtime-only noninteractive edits work; absent initial runtime fails rather than guessing. Public bare first use explicitly chooses runtime; `bin/fkit-codex` retains its Codex entry contract.

Retain runtime review, one explicit save, cancellation and same-command continuation. Preserve exits: success/help/cancel/declined or empty save **0**; invalid input, EOF, unavailable runtime, missing Node or invalid settings **1**; SIGINT **130**. Pre-save failures write nothing and launch nothing; confirmed settings survive subsequent setup/session failure.

Delete `codex/models.mjs`, remove imports and its `install.sh` required-module entry; update installer guidance without changing protections or running installation.

**Compatibility cost:** old selector commands/scripts now fail, including `--runtime-default`.

### 4. Bounded agent ownership and launch checking

Implement shared shell function `refresh_managed_agents` in existing `claude/fkit-claude-init.sh`, used by normal initialization and an agents-only selected-role mode. Expose `ensureManagedAgent(root, role)` in `codex/materialize.mjs` as its Node caller.

Recognize only exact `claude/agents/fkit-<role>.md` filenames for the seven roles, matching current canonical bytes or these frozen historical definitions after normalization:

- **L:** `v0.3.2`, commit `0d1712fdd32355dd56e751c052e40997a23df82d`.
- **P:** `v0.4.0-codex.1`, commit `d6c7a768b463659a4f970e3d1767dcb41d493b95`; `.2`, commit `12a6fffca3ea2584619df1c07674e80b625ea79d`, has identical definitions.
- **C:** `.3`, commit `a0ec736dcb41b7adf8bea0fabe48c0f6c90b4b4d`; current HEAD definitions match C.

Normalized SHA-256 values:

| Role | L | P |
|---|---|---|
| lead | `516a19fb7274c49523893838fc1f68400ae5cdd9c6b7bb9f3f772197a5052aef` | `541a0c193ad734e4d3578eae9e0207c0024750027ab8168e3d82d77956fd1966` |
| producer | `5e3a722155972057217bc8fc89a5d1e12f3867a6f59486dc1601e76482816d61` | `0519cda4c221b915710f04f15ad3b8d74c988a1ad2db11f4b1954d7855107837` |
| coder | `b2bdd989e62de6c5f2e69af902d242298ba7e6cf05f70ed3341ea73e0b31a44c` | `ad6919452b9bdf032e38d746d7a3539942cbb817df70c760ba11d9deb97d8fc8` |
| reviewer | `0beaf1192fc23124032feffa8e3980d2966d7c306cf1c32de8d6352bcb4135f5` | `e8461b8a9f9c4f72e4618812e0a19b6c12daebf12d745d88d6857fded4e17c0b` |
| adversarial-reviewer | `bf79bcaff70ba667385775e64dda79d8c05f086bad0d77b646ecfae44bbb3297` | `097cb317b5fb1781e86929e5abc2cb0e74713b5a80773da51e3e161cd71af550` |
| architect | `a43df658cbc2981e7ade1c39f95ff0d165f85dbcd5207518bc8d2dca884c6f19` | `fca99ec3f7574298d6e8c0a702a3cf01d98a696716275f25d5f5cfbdb42ad80d` |
| wiki | `a52f72e4952befadda4225c1c0af694d8183215fb9f402437592e5684ea5603a` | `57bef8ec2154febc017bf493cdfa02f8623783c9a88304bef9a4b344d8b8fc13` |

C equals P except lead: `afb8c4e64f1bb18bae3a0f702830c41c7f1af4bbba1f9b3ba77abe24e706a247`.

Normalization accepts LF text with final newline, no CR/NUL and a properly delimited initial frontmatter block. Remove only unique, unindented `model:`, `effort:` or `reasoningEffort:` lines whose value is a single unquoted scalar matching `[A-Za-z0-9_.:/+-]+`. Preserve every other byte. Reject ambiguous/multiline forms. These releases currently contain no selectors; recognition permits only that narrowly defined selector variation on an otherwise exact shipped definition.

Embed full fingerprints in existing initializer source; no runtime Git dependency, persistent manifest or conformance system. Missing canonical files install safely; recognized stale copies refresh to selector-free canonical definitions. Unknown bodies, other names, unreadable files, wrong types and symlinks remain untouched and reported. Older unlisted definitions remain unknown.

Callers:

- Normal initializer: refresh independently per canonical role; an unrelated collision cannot abort other roles.
- Configured direct and shell consult: `codex/fkit.mjs::run` calls `ensureManagedAgent` before Claude execution.
- MCP/adversarial: `codex/server.mjs::consult` checks the selected Claude target before spawning.
- Legacy direct: `claude/fkit-claude.sh` checks producer before cold start and the final selected role before execution.
- Legacy native Agent/Task delegation: proposed initializer hook mode invokes the same selected-role check, registered alongside existing carry-check wiring. Parse target JSON with Node; unrelated targets pass when identifiable. Unavailable/unparseable verification denies that delegation. Existing carry-check semantics remain separate.
- Legacy raw Codex adversarial command already supplies no selector and loads no Claude agent definition; retain it.

Other setup failures may still permit a verified selected agent. Agent verification failure exits **1** without launch; MCP returns an error. Never substitute another role or drop `--agent`.

**Costs:** edited readable agents—even selector-free ones—can block their own launches. Legacy root entry remains Node-free, but its proposed native Agent/Task guard requires Node; unavailable verification blocks delegation. Architect must confirm this bounded guard and record its consequences before Build; it is not author-approved architecture.

Preserve native configuration, credentials, profiles, hooks/MCP preferences, unrelated agents and existing skills behavior. Edit no generated checkout copies.

### 5. Documentation

Update `README.md`, `CHANGELOG.md` Unreleased, `codex/README.md`, relevant `claude/README.md`, `package.json` description, current `ai-agents/knowledge-base/PROJECT.md` and `architecture.md`, plus living sections of `model-agnostic-sprint/HANDOFF.md`, `validation.md` and `release-readiness.md`.

Preserve historical evidence, use dated supersession, incorporate existing README/CHANGELOG deltas, and retain preview/default-distribution distinctions. No broad historical-format cleanup, board implementation, wiki or personal-settings edits.

### 6. Precisely three new tests; existing-file changes

**Zero new permanent test files; zero new prove-red cases.** Individually propose:

1. `test/launcher-contract.test.js`: `native defaults: legacy selector data is inert and runtime edits preserve retained data`
2. Same file: `native defaults: user configuration remains unchanged across launches`
3. `test/init-claude-refresh-guard.test.js`: `native defaults: recognized stale agents refresh and unknown agents remain untouched`

Their assertions cover malformed retired values, model-only roles, mixed routing, byte preservation, retained validation, changed isolated native preferences, historical/selector variants, missing installation, collisions, blocked targets and containment.

Revise existing launcher cases: seven first-use cases; five configured direct/effort/interview/default/delegation blocks; three forwarding/transport/owner-channel fixtures. Replace removed catalog/interview internals with public process/terminal assertions.

Extend existing direct coverage to **28 combinations: seven roles × two runtimes × interactive/headless**. Extend existing delegation assertions across shell/MCP/adversarial routes, root isolation, changed saved child routing and observed/unknown provenance.

Revise init D1 to preserve user agents while retaining skill behavior. Revise existing `test/launcher-agents-guard.test.js` fixtures/assertions: verify the selected canonical role, successful-setup checks, known agents after other setup failures, unknown-agent refusal and unrelated collisions. Update existing launcher hook-wiring assertions for the proposed legacy delegation guard. Add no fourth named case.

### 7. Verification after approval

Run changed process assertions against pre-change production in an isolated copy, then implementation. Distinguish expected behavioral reds from inherited failures; preserve current source deltas.

```sh
node --test test/launcher-contract.test.js test/init-claude-refresh-guard.test.js test/launcher-agents-guard.test.js
node --test --test-skip-pattern='0284/(git-deadline:|term-ignored:|no-stray:|reinstall-deadline:|reinstall-timeout-not-run:)|^fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$|^benchmark:' test/*.test.js test/board/*.test.js
npm run test:prove-red
```

Keep default discovery globs unchanged. This is **filtered default-suite coverage**, not an unqualified `npm test` pass.

The seven exclusions also defer these functional assertions:

- Three banner cases: successful silent launch under stalled git; forced termination; PID instrumentation, child/watchdog cleanup and watchdog disarming after normal completion.
- Board case: task creation returns `T-001`; stale owner/break files are removed.
- First reinstall case: successful update, requested installer fetch and sealed-command safety.
- Second reinstall case: exit **1**, source-specific download/error reporting, no success message, no partial-installer execution, expected source request and sealed-command safety.
- Opt-in benchmark: snapshot parity at corpus sizes 100, 405, 540 and 800; associated diagnostic observations are also deferred.

Retain functional `0284/git-env` and existing SSH-rewrite coverage. Do not execute excluded cases to validate the filter.

Run applicable Node/shell syntax checks, scoped `git diff --check`, and manual help/docs/link readback. Run only four existing prove-red mutations. Record commands, assertion evidence and pass/fail/skip counts; no deferred investigations or measurement gates.

Retain reported inherited first-use failure, 22 loopback-permission failures and prove-red baseline failure unless execution demonstrates otherwise. Request ordinary scoped exceptions for required listener checks; denial leaves them unverified. Do not repair unrelated reds automatically.

Live configured Claude/mixed compatibility remains **unverified**. Capable-environment follow-up must exercise native-default inheritance, refreshed agents, direct/child/adversarial execution and cancellation. Stubs establish omission/routing, not native certification. No account/provider probes, installation, release, commit or push.

