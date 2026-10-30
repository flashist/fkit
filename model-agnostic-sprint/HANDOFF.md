# Codex migration — fresh-session handoff

**Current opt-in preview scope — 2026-10-30:** the owner requested a named preview through the regular
release procedure, without shipping to default users. Target: `v0.4.0-codex.1` on
`codex/codex-preview`; default install/update channel `main` must remain unchanged. The shared
installer is opt-in via `FKIT_REF`; publishing does not install globally or migrate consuming
projects. See the root README for branch versus exact-tag installation and retained tag-notice limits.

0543, 0544 and 0545 are now in `ai-agents/tasks/done/`, closed by actual producer movers as
**agent-closed — not owner-verified**. Sprint 12 has 14 done, one cancelled, no open task or drift;
its banner remains In progress. Latest 0545 suite: 961 total, 960 pass, zero fail, one optional
benchmark skip, 108.38142875 seconds. Independent primary/adversarial review found no confirmed
defects, with reasoning-only second-opinion coverage. 0544 also retained fresh hook-free
default/opt-out/reset/rejection/argument and full disposable task-lifecycle checks. Their durable
records supersede older pending-0544/0545 statements below.

Native human UI approval/rejection acceptance and live Claude/mixed compatibility remain separately
unverified. Codex planning/general writes remain instructional; both fkit hooks disabled. Same
configured-model passes do not prove serving identity or diversity. No stable cross-runtime
certification, sprint closure or wiki sync is implied. The release gate and remote publication
result must be checked independently; this scope note alone is not proof that the tag was pushed.

Earlier checkpoints below are historical, including statements that no real task was closed, no
release was authorized, or 0544 planning was still pending. The owner's named-preview request
authorizes the release commit/push on the preview branch only, not `main`, global installation or
changes in other projects.


Snapshot: 2026-10-29. Repository: `/Users/mark.dolbyrev/Workspace/fkit`.
Branch `main`, HEAD `76c8507` at the original checkpoint. **Codex-only local deliverable ready within the accepted limits; broader Claude/mixed certification deferred and unverified.**

**Current accepted/closed checkpoint — 2026-10-30:** 0543 is **✅ Done (agent-closed — not owner-verified)**
through the actual producer-owned `fkit-task-done`; the entire folder is now in `tasks/done/`,
and its brief/Sprint 12 markers match. The actual human desktop-chat `request_user_input_async`
answer, recorded at `2026-10-30T08:58:46.877838+00:00`, accepted the exact C1–C5 in the
[accepted proposal](../ai-agents/tasks/done/0543-turn-plan-review-on-by-default-in-fkit-coder-sessions-and-plain-fkit-plan-task/acceptance-proposal.md) and replaced the October 27 personal-live-check hold
for Codex completion only. The actual architect's dated additions to ADR-060 and the October 24
design report were verified before closure. This closure does not make deferred checks pass.

Complete Codex native human UI approval/rejection and the original Claude checks remain separately
unverified; see the proposal's retained checklist and `validation.md`. Synthetic replies remain
synthetic. Both passes used the same model. A different model is recommended for a broader second
opinion; independent serving identity/diversity remains unverified. Planning/general writes remain
instruction-only and both Codex hooks stay disabled. Existing bounded evidence is not a new full
post-follow-up task/sprint lifecycle or Claude/mixed certification. No workflow tests were rerun.

0544 planning is now permitted under the confirmed 0543 → 0544 → 0545 order; this closure run
starts no planning or implementation and changes no other task/sprint status, rank, dependency or
goal. Implementation still needs its own plan approval. No commit, push, release or wiki write.

**Historical acceptance preparation, 2026-10-30 (before the acceptance/closure above):** the coordinator can operate API-owned disposable
sessions without manual terminal relays. Actual synthetic default-review/opt-out/reset/decision-record
checks and a separate 27-assertion example build/review completed with two usable same-configured-model
passes. Durable evidence and exact limitations are now in 0543's
[verification record](../ai-agents/tasks/done/0543-turn-plan-review-on-by-default-in-fkit-coder-sessions-and-plain-fkit-plan-task/verification/2026-10-30-codex-automation.md)
and companion JSON. These results are not human UI acceptance, full native TTY flag-path coverage,
Claude verification or a new full task/sprint lifecycle pass after the later UI/hook changes.

Owner interview answers are recorded in `decisions.md`: draft Codex acceptance with Claude tracked
separately; 0545 wording uses confirmed evidence; Sprint 12 goal is "Finish the plan-review rollout
and clarify planning limits"; remaining order 0543 → 0544 → 0545. Goal/order and 0545's clarification
are recorded, with no status changes. 0543's
[acceptance proposal](../ai-agents/tasks/done/0543-turn-plan-review-on-by-default-in-fkit-coder-sessions-and-plain-fkit-plan-task/acceptance-proposal.md)
has an actual architect scope check, **APPROVE FOR OWNER DECISION**, with its response retained in
the task folder's `acceptance-review.md`; it still needs the actual owner ruling. Its earlier owner-run-live-check hold has not
been waived; 0544 cannot begin planning until producer closure genuinely lands. Do not re-ask the
four answered interview items, repeat completed tests, require manual terminal relays, probe Claude,
reactivate hooks, or treat synthetic decisions as human acceptance. No closure, commit or push is
authorized by preparation.

**Latest owner-form fix, 2026-10-29:** old two-field forms would not submit with a blank optional
comment in the native UI. Replaced them with a single required answer field. Listed choices submit
directly; `Write another answer` asks for text in a second form, remaining pending until actual
nonempty text arrives. Cancels/interruptions/empty custom text grant no approval. Return custom
text in `comment`; normal choices return an empty comment. Focused tests **8/8 pass**, native
Field1/1 enum submission returned `Explain fixture` with empty comment; free text also submitted.
Custom follow-up protocol tested, native rendering not separately exercised. Existing old forms
need a placeholder comment or a session restart to load this fix. Details in `progress.md`; test
log `/private/tmp/fkit-owner-single-field-regressions.log`. Full suite/reviews not repeated.

**Latest startup fix, 2026-10-29:** owner saw a blank lead session. Ordinary interactive Codex
launches now send the canonical role `initialPrompt` as their first message; previously only the
body instructions were loaded, so no turn started. All seven role greetings are reused, startup
helper paths adapted, explicit onboarding prompts preserved, and headless tasks unchanged. Both
hooks stay disabled. Focused checks 7/7 passed; after clarifying that a role name is not a skill,
final direct-launch regression 1/1 passed. Actual menu→lead greeting observed; first run tried an
invalid `fkit-lead` skill, seed corrected, second live direct lead greeted and rendered the owner
form without that error. Form cancelled, both test sessions closed exit0. Fixture-only requested
and observed gpt-6-luna; real saved settings untouched. Logs/results:
`/private/tmp/fkit-startup-prompt-tests.log`, `/private/tmp/fkit-startup-prompt-tests-final.log`,
`/private/tmp/fkit-startup-greeting-results.json`. Full suite/reviews not repeated for this fix.

**Current owner ruling — both Codex hooks disabled, 2026-10-29:** the first Codex version must
register neither PreToolUse nor Stop hooks. Their code is retained behind
`CODEX_HOOKS_ENABLED = false`, with no user-facing enable switch; do not reactivate without the
owner's later direction after usage feedback. Fresh direct/delegated and interactive/headless
launches omit both registrations. Runtime bindings explicitly state that no hook reminders are
active. Models/efforts, native-spawn disable settings, dispatcher checks, owner forms and written
role/question/footer instructions remain. Claude/user hooks are untouched. Existing sessions need
a restart; no global configuration edits or trust-store cleanup is required.

Focused launcher checks **7/7 passed, 10162.433ms** after this change, including all seven roles
in both session modes and direct/delegated argument checks. Log
`/private/tmp/fkit-disabled-hooks-tests.log`. Full suite, live task/sprint workflow and external
reviews below predate this change and were not repeated. Earlier hook proofs are historical only.

**Effort-selector follow-up — 2026-10-29:** owner noticed model setup omitted reasoning effort.
Latest flow returns to the numbered role list after each edit batch. Choose `0`, `done`, or blank
to reach one final save; roles can be revisited. Focused interview test and direct terminal check
passed, including two roles saved together and no settings write before confirmation. Two Python
PTY probes timed out before the direct-terminal pass; details in `progress.md`. Evidence:
`/private/tmp/fkit-role-edit-loop-tests.log`, `/private/tmp/fkit-role-edit-loop-terminal.json`.
Latest UI follow-up reprints the numbered Codex model catalog at every selected role's model
prompt, then shows a vertical numbered effort list. Focused interview/menu test passed (1/1);
`/private/tmp/fkit-role-model-menus-tests.log`. The 64-test result below predates this display-only
follow-up; full suite not repeated.
Added default/per-role effort prompts, model-catalog supported levels, `--effort` / `--role-effort`,
and effective effort in `settings`. Null effort follows the CLI; role `inherit` removes only its effort
override. Direct/delegated launches retain the existing Codex argument path. Extended the existing
launcher test file: **64/64 pass, 45664.588833ms**, including unsupported-value file preservation,
reset/inherit, interview blanks, unknown catalogs, and direct/delegated arguments. Actual terminal
configuration in a disposable project saved gpt-6.1-sol/high with wiki gpt-6-luna/low and correctly
omitted ultra from Luna's offered levels. Earlier full-suite/review evidence below predates this
bounded follow-up; those broad checks were not rerun for the selector. Claude API remains untested.

**CURRENT desktop checkpoint, 2026-10-29:** local seven-role Codex, owner relay/cancellation, full task and sprint passed. Producer exit2 was the conflicting automatic-approval/sandbox pair, fixed and live closure verified. Timeout/quota recovery preserved completed work and used explicit fixture-only gpt-6-luna selections. Owner accepted the local limits; actual architect wrote accepted ADR-061 and +2/−0 pointers to four old ADRs. No old ADR body deleted, no wiki writes or real task/sprint closures.

Public dispatcher, configured Claude/Codex models/peers, installer/update/self-host, docs and shipped context/manifest are implemented. Existing-file tests cover their contracts. Final scaffold suite:958 total/957 passed/1 skipped/0 failed, duration_ms=89517.423542; release tests30/30,88999.576666ms. Earlier simultaneous test/release run missed120000ms (136326.882792ms); isolated runs met the budget. Two new template hashes were added; historical manifest rows retained. Global installed fkit wrapper unchanged; source project model settings absent (not chosen on the owner's behalf).

Owner explicitly authorized external Codex review of changed migration source/tests/docs/ADRs excluding credentials/user configuration after an initial automatic approval rejection. Actual reviewer/adversarial source review completed exit0, reasoning-only on gpt-6-luna, no verified runtime defect (X1 disproven). Documentation-delta review completed: stale own-record R1/R2 fixed; R3 running→completed status refreshed. Full reports relayed verbatim; temporary outputs `/private/tmp/fkit-final-runtime-review.md` and `fkit-final-runtime-docs-review.md`. No repeated code-review loop for own-record closeout.

Final compatibility check reproduced configured rejection of legacy adv/adversarial aliases. Fixed direct/consult normalization and added read-only direct-routing assertions in the existing test. Narrow actual reviewer/adversarial reasoning review completed exit0 with no confirmed defects; optional consult-alias test coverage is a suggestion, not a required gate. Final required default suite **958 total/957 passed/1 skipped/0 failed, duration_ms=94348.559959**, within120000ms. All test/review tool sessions completed. Temporary final logs/report: `/private/tmp/fkit-migration-final-tests.log`, `/private/tmp/fkit-final-runtime-alias-review.md`. No source/runtime fix remains confirmed; do not repeat completed workflows/reviews without new evidence.

**Owner-confirmed local availability — 2026-10-29:** owner ran the plain command in normal Terminal and confirmed API failure: “don't count on Claude to be available here locally”. Stop local Claude probes/troubleshooting; do not require repairing its API for local Codex use or keep awaiting that answer. The local profile must use Codex for all seven effective roles. Keep optional/legacy Claude support and its deterministic contracts, but defer real Claude/mixed-runtime certification to a capable environment. The concrete handoff is in `validation.md`; no verifier is assigned, contacted or scheduled. Do not claim full cross-runtime certification or drop the broader MA-01–16 scope silently. No login/provider changes, commit, push or publication authorized.

**Latest no-Claude public proof:** disposable fixture with all seven effective roles Codex and Claude absent from PATH returned exit0 and its final marker. Structured native events confirm actual fkit_roles/fkit_skill completed without error. The first human-trace observer mismatch caused a harness failure despite runtime success; corrected event-based harness passed. Explicit fixture model request gpt-6-luna; serving identity absent in JSON mode remains unknown. Source model settings/global-command hashes unchanged. `/private/tmp/fkit-codex-only-acceptance-results.json` holds sanitized evidence. No product code changed this turn; do not repeat the full suites for these availability-record updates. Use the checkout dispatcher with explicit Codex configuration; existing role overrides are preserved, so inspect effective settings rather than assuming a root-session override converts peers.

**Older pause checkpoint, 2026-10-29:** owner said “Pause when you can”. Its producer/sprint/pending-probe failures below are superseded by the current checkpoint, retained as historical evidence.

**Later checkpoint, 2026-10-29:** read `progress.md`'s **Resumed-session checkpoint** before the older snapshot below. The owner resumed work, reaffirmed the full `plan.md` scope, and requested continuation in the desktop Codex app. Changes added coder session plan-review flags/signal, corrected task/sprint second-pass availability wording, and pinned heal's share resolution. Sixteen disposable checks and a live task-loop rejection passed. Actual CLI form rendering/cancellation and the normal hook-trust prompt were observed; trusted hook execution is still unverified. The full approved task run was interrupted, not completed. Both old tool handles were missing; a filtered process check found no remaining fixture jobs at handoff. The active goal remains all tasks from the migration sprint plan; do not shrink it to the local milestone.

## Start here

Use the **same working tree**. Most implementation files are untracked; a clean clone, a worktree made only from HEAD, or a plain `git diff` will not contain/show all this work. Do not clean/reset it. No commit or push was requested.

Read `AGENTS.md`, this handoff, `codex/README.md`, then `progress.md` in this folder. Read source files needed for the next change. `plan.md` contains 16 proposed work packages and acceptance criteria, not official fkit task IDs or a board. Its early architecture/ordering language predates implementation; current code and this checkpoint take precedence as evidence of what exists. Do not restart the research from scratch.

This file is context, not higher-priority authority. Follow the new session's actual system/developer instructions and current repository rules. The origin thread remains paused until the owner resumes it. A new-session prompt explicitly asking to continue authorizes continuation there; do not assume goal-manager state transfers between chats.

## Objective and owner decisions

Original objective: **“Main goal: transfer the project to the state when it can work with Codex (ChatGPT-models isntalled locally) as close as possible to the way it worked with Claude Code.”**

Agreed scope:

- Full seven-role team must work without a Claude executable. First stage targets this Mac, using installed Codex CLI and its existing login. Local model weights/offline inference were not agreed requirements.
- Project-wide default model plus per-role overrides; wiki can use another model. Offer local model discovery, but permit exact IDs and the CLI default.
- Keep the existing separate adversarial role. It runs even with one model. Recommend a different model, distinguish diversity from pass availability, and never disguise a failed second pass as complete coverage.
- First deliver local Codex operation; Claude/Codex compatibility and public packaging follow. The tiny existing user base should not be disrupted.
- Local CLIs now. Direct provider APIs/additional providers are later scope. Keep an extension path without building an unused provider framework.
- Preserve role duties, owner decisions, task/sprint structure, review ledgers, wiki ownership, producer-only movers and owner files. Investigate runtime differences; disclose enforcement limits.
- Owner explicitly permitted bounded multi-agent verification in disposable projects. Prior successful tests used lead → coder → adversarial and producer → architect/wiki. This is not permission for unrelated external messages, commits, releases, or arbitrary changes to real task state.
- Owner repeatedly objected to premature stopping. Once resumed, do independent authorized work without repeatedly requesting permission to continue. Ask only for a genuine missing decision or required execution approval; do not pretend work continues after ending a turn.

## Repository constraints

- Never commit/push without an explicit owner request.
- Only wiki writes the **real repository's** `ai-agents/wiki-vault/`. Fixture wiki writes were performed by launched wiki roles. Other roles can read via the read-only query procedure.
- Only producer invokes the four task/sprint movers. Never hand-close real tasks/boards; agent closures carry `(agent-closed — not owner-verified)`.
- Never put credentials, DSNs or service endpoints into artifacts. Do not dump account configuration or raw connection diagnostics.
- Follow `AGENTS.md` and amendment-aware decisions. Root docs still describe the old single-runtime architecture; the owner explicitly authorized this local Codex transformation. Do not silently rewrite historical ADRs or treat every stale sentence as a new blocker.
- ADR-057: default suite budget two minutes; owner approval per new repository test file. No new permanent test file was added. New runtime checks so far were disposable/ad hoc; existing suite success does not establish new-runtime coverage.
- Code comments explain why. No subagent delegation unless the session's applicable instructions/owner authorization permit it.

## Current worktree

Checked status before this handoff:

```text
 M README.md
 M package.json
?? bin/fkit-codex
?? codex/
?? model-agnostic-sprint/
```

`package.json` adds `npm run codex`. Root README mentions the opt-in path. The published installer/global `fkit` path has not been migrated. Everything remains in the working tree; preserve these files. The main implementation has not created/closed actual repository tasks or changed its wiki.

## Implementation map

| File | Responsibility |
| --- | --- |
| `codex/fkit.mjs` | CLI: configure/models/settings/setup/preview, role menu, interactive and headless launch, first-run initiation and lead handoff; exports `launchArgs` |
| `codex/settings.mjs` | Seven role names, schema/default/override resolution, containment/symlink checks and atomic writes |
| `codex/models.mjs` | `codex debug models` parsing, numbered/exact-ID/default selection and discovery fallback |
| `codex/materialize.mjs` | Reuses canonical role/skill sources and ownership registry; generates managed Codex skills and runtime-specific bindings/review procedures |
| `codex/server.mjs` | Session-scoped stdio MCP dispatcher, fresh role processes, tool exposure/ownership, model provenance, cancellation/cleanup |
| `codex/consult.mjs` | Ordinary two-hop/cycle/leaf checks; reviewer-only external-pass exception; reuses approved-plan fidelity checker |
| `codex/owner-question.mjs` | MCP form requests, client responses and cancellation; no inferred approval |
| `codex/hook.mjs` | Dormant Skill/spawn and Stop checks retained for possible later evaluation; current launcher registers neither |
| `bin/fkit-codex` | Checkout-local shell entry point |

Canonical ownership remains `claude/skills-for-role.sh`; role prompts and 28 procedures remain under `claude/agents/` and `claude/skills/`. Do not introduce a second hand-maintained ownership map. This is a port/adaptation, not an independent copied policy tree.

`setup` reuses `claude/fkit-claude-init.sh` to preserve existing convergence rules. It refreshes legacy `.claude/` files too, but never needs the Claude binary. Codex skills go under `.agents/skills/fkit-*`, with ownership markers and refusal of unowned targets. It does not replace user `.codex/config.toml`.

Local settings: ignored `.fkit/model-settings.json`, schema version 1. `default` has runtime `codex` and model ID or `null` (follow Codex default); `roles` contains partial overrides. Optional `reasoningEffort` is supported. Credentials remain with Codex. Invalid explicit selections do not silently fall back.

## Runtime design and important limits

- Each role runs in a fresh **Codex CLI process**. Native Codex subagents are disabled on this launch path. A session-scoped stdio MCP helper starts child role processes directly; it is not a persistent daemon. This avoided initialization failures when launching nested CLI processes through the parent agent's shell sandbox.
- `fkit_skill` checks its fixed caller identity against the canonical registry on every procedure load. Foreign procedures are denied independently of hook trust. Native skill catalog scoping is additional filtering. Manual file reads/execution are outside this invocation boundary, as they were outside the old Claude Skill hook.
- `fkit_consult` carries explicit caller lineage, applies depth/cycle/leaf rules and the existing plan-fidelity checker. Pass lineage in process arguments because MCP may filter environment variables.
- Reviewer-only `fkit_adversarial` preserves the old external CLI second opinion **outside ordinary consult depth**. Otherwise a reviewer reached at depth two cannot get its second pass. The adversarial dispatcher exposes only its owned skill loader, not consultation or owner questions.
- Adversarial runs read-only; other roles workspace-write. Apps/plugins are disabled for adversarial; this is not a complete allowlist over independently configured user MCP servers.
- Only interactive root sessions expose `fkit_ask_owner`. Headless workers return `NEEDS-DECISION`. Accepted text requesting explanation/revision is not approval; cancel/decline/error/interruption never supplies approval.
- The dispatcher is marked required. Approval settings are scoped to its own local tools, not other user MCP services. Approving invocation of the question tool does not answer its form.
- Both Codex hook registrations are disabled by the current owner ruling. Archived code retains stable definitions and per-run environment context for possible future evaluation. General write boundaries, plan approval and footer/question-tool behavior remain instructions; do not claim universal filesystem enforcement or full Claude equivalence.
- Headless tasks use stdin, not argv, to support large diffs and dash-prefixed text safely. Keep safe shell quoting for hook paths and use structured tool arguments for prompts.
- Per-role settings resolve at each child launch. Exact model identity may be unknown to the primary model; child dispatcher metadata reads its CLI header. Never fabricate diversity from aliases, a provider/runtime name, or a different reasoning effort.

## Verification completed

Tested locally: Node `v24.13.0`, Codex CLI `0.165.0`. Other versions/platforms are not certified.

- All seven roles participated in bounded live checks; lead → coder → adversarial succeeded.
- Live producer → architect/wiki onboarding completed on a PATH containing Node/Codex and standard tools **without Claude**. Brief, architecture, root overviews and fixture wiki ingestion landed; source hash stayed unchanged.
- Wiki override ran on `gpt-6-luna`; other tested sessions used runtime default `gpt-6.1-sol`. These are observed fixture selections, not bundled recommendations/defaults.
- Live primary + adversarial stateful review created a ledger. Second round retained unresolved R1 without duplication, refreshed evidence and preserved coder/residual sections, source and task status.
- Real Codex app-server emitted one owner form; synthetic client chose `Revise fixture`; model reported no approval and performed no dependent action. **Terminal widget rendering remains unverified.**
- 196 hook policy cases and a separate 196 actual MCP skill-loader permission matrix passed. Real wiki loaded `fkit-query` through `fkit_skill`.
- Settings/argv/containment/owner-text/repeat-setup/unowned-skill guards; 300 KB stdin transport; MCP handshake, cycles/depth/leaf restrictions; owner cancel/interrupt/late answers; Stop block-once and marker consumption passed disposable checks.
- Pseudo-terminal configuration/menu/cancellation checks passed. Initial setup cancellation exits 0 without scaffolding or a model call. Intake was separately verified with a permitted controlling terminal; sandboxed `/dev/tty` access had made the harness skip it.
- Dispatcher shutdown terminated a fake worker deliberately ignoring SIGTERM; no orphan remained.
- Last full existing `npm test`: **951 total, 950 passed, one skipped, zero failed**, ~83 seconds, outside the sandbox. Initial sandbox run failed on HTTP `listen EPERM` and a process-cleanup assertion. New runtime development continued afterward; do not label that older run full coverage of current new code. Later syntax and `git diff --check` checks passed.

## Next work — preserve the full objective

1. Revalidate worktree, versions and goal state. Check fixture/helper existence; do not blindly replay old commands.
2. Verify actual CLI owner-form presentation and normal hook trust/env propagation. The backend round-trip already works; focus on the missing frontend/trust evidence. Never bypass all hook trust merely to claim success.
3. Exercise a complete bounded task and a one-task sprint in a **new disposable project**: plan → actual approval/rejection → build → verification → independent/stateful review → coder dispositions → producer-only closure with marker. Include cancellation/rejection and a genuine pending decision. No real repository task should be closed for a test. **This sprint fixture/driver has not yet been created or run.**
4. Audit remaining source prompt/runtime-binding conflicts and script path discovery, including status/heal. Preserve the source contracts; do not globally replace tool names inside executable examples.
5. Resolve/report remaining enforcement differences and formal decision documentation. ADR-042 D2 adopted workspace-write review but live source still uses read-only; backlog task 0273 covers it. The local port preserved live read-only behavior. Do not silently change that accepted policy or duplicate the backlog task.
6. Review the implementation, run appropriate regression checks, and establish local readiness against `validation.md`. Actual global-command/installer migration and real Claude compatibility are the following stage (MA-14–16); APIs/additional providers remain later scope.

`plan.md` supplies acceptance criteria. MA-01–11 have substantial code/evidence but are not uniformly complete; MA-12–13 (whole workflow/local acceptance) are the main local gap. Formal ADRs/task-board filing and public compatibility are outstanding. No completion claim until requirement-by-requirement evidence exists.

## Useful commands and transient evidence

Start safely with read-only inspection:

```sh
git status --short
npm run codex -- --help
node --check codex/fkit.mjs
node --check codex/server.mjs
git diff --check
```

Configure/run only a chosen project; these commands can create/refresh managed files:

```sh
node codex/fkit.mjs configure --root /path/to/disposable-project --runtime-default
node codex/fkit.mjs configure --root /path/to/disposable-project --role-model wiki=MODEL_ID
node codex/fkit.mjs lead --root /path/to/disposable-project
node codex/fkit.mjs coder --root /path/to/disposable-project --exec 'bounded task'
```

The following existed when checked for this handoff; temporary paths may disappear. None is required to understand the source:

- `/private/tmp/fkit-owner-live-probe.mjs`: corrected real app-server owner-form client. Hardcoded to this checkout and the old review fixture; inspect/adapt before replay. Initialize → initialized → thread/start → turn/start; handle `mcpServer/elicitation/request` and respond with action/content. **Route incoming server requests before matching response IDs**: the first client attempt crashed because IDs collided. A process check confirmed the failed attempt left no matching app-server; corrected attempt exited 0.
- `/private/tmp/fkit-codex-suite.log`: prior full-suite output.
- `/var/folders/j8/6zcjvzwx1t5csm7rynmsjlr80000gn/T/fkit codex verify gHomrZ`: review fixture, intentionally broken `sample.mjs`, synthetic task 0001 and two-round ledger; wiki override set to `gpt-6-luna`. Its Git metadata was absent during later checks; do not assume a Git repository.
- `/var/folders/j8/6zcjvzwx1t5csm7rynmsjlr80000gn/T/fkit-onboarding-live-1C23I6`: successful no-Claude onboarding fixture, correct `sum.mjs`, generated product/architecture/wiki docs.

No owned model job was left running at the pause checkpoint; recheck actual process/session state before retrying anything. Earlier tool session handles are not proof that a process is live. Do not start duplicate runs merely because polling timed out. Do not copy raw account/connection diagnostics into repository artifacts.

## Planning estimate already shared

Remaining effort was estimated at **1–2 focused working days for reliable local Codex operation**, then **another 2–4 days for Claude/Codex compatibility and distribution**. Moderate-to-low confidence until the complete workflow test passes. This is an engineering estimate, not an elapsed autonomous-runtime promise. API providers are separately unscoped.

## Suggested first prompt for the new session

```text
Resume the fkit Codex migration in this working tree. Read AGENTS.md and
model-agnostic-sprint/HANDOFF.md, then inspect the current code/worktree.
The goal is to make fkit work with the locally installed Codex CLI as close
as possible to its Claude Code workflow. Continue implementation and bounded
multi-agent verification in disposable projects, starting with the remaining
owner-interface and task/sprint checks. Preserve the existing work. Do not
commit, push, release, or close real repository tasks. Keep the full goal
active and continue independently unless a genuine decision is needed.
```
