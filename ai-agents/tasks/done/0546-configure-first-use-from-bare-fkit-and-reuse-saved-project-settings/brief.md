# Configure first use from bare `fkit` and reuse saved project settings

## ID
0546

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

Owner request, typed in desktop chat on **2026-10-30**, relayed to this headless producer:
**"Is it possible to do something to make sure the end-users should run only fkit?"**
The intended experience is one command, `fkit`: first-use configuration and managed refresh happen
through that command, with choices saved per project. This filing authorizes a brief and one
Backlog-board row; it is **not approval of an implementation plan or a new runtime default**.

At the published opt-in preview `v0.4.0-codex.1` (baseline
`d6c7a768b463659a4f970e3d1767dcb41d493b95`, branch `codex/codex-preview`),
`bin/fkit` deliberately sends unconfigured projects to the legacy Claude launcher. Users must first
opt in with `fkit --runtime codex`. Meanwhile, `codex/fkit.mjs` already interviews missing settings
on interactive launches, reuses model/effort customization and save confirmation, and calls
`setup()` on ordinary direct launches. Extend the entry experience rather than inventing a second
settings store or refresh system. The coder's plan determines the exact seam.

**Conflict requiring owner approval:** [codex/README.md](../../../../codex/README.md) says
"Unconfigured projects keep the existing Claude launcher"; `bin/fkit` help and
[migration progress](../../../../model-agnostic-sprint/progress.md) preserve that contract too.
[ADR-061](../../../knowledge-base/decisions/adr-061-codex-as-a-full-seven-role-runtime-with-explicit-local-limits.md)
Decision 6 requires preserving legacy entry behavior and leaves public selection work open.
The proposed flow changes **interactive bare launches in existing legacy fkit projects without
model settings as well as brand-new projects**. This conflict is not settled by the request to file
this task. Present it explicitly at the concrete coder plan gate and wait for actual owner approval
before source edits. Any ADR amendment must go through the architect under its own authority;
this filing writes no ADR and grants the coder no ADR-write authority.

Read [the current migration handoff](../../../../model-agnostic-sprint/HANDOFF.md) and
[runtime documentation](../../../../codex/README.md) before planning. Earlier Sprint 12 closures
are history, not dependencies or permission to change that sprint. Claude/mixed live compatibility
remains unverified; CLI presence or a stub's success does not establish API usability.

Wiki context: [[systems/install-and-self-update]], [[systems/launch-convergence-and-init]],
[[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]],
[[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]],
and [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]]. These establish managed
refresh, preservation of owner content and the test fence. The wiki does not yet describe this
Codex public first-use flow; current source/handoff supplies that gap. A later wiki ingest belongs
to `fkit-wiki`, not this task's coder.

Note: 6 commit(s) touched `ai-agents/` since the wiki was last synced
(`185ac5e07e918c089ed3afd23496587315342000`) — this answer may not reflect the latest changes.
Consider running /fkit-wiki-sync.

## What to build

1. **Proposed product behavior, subject to the plan gate below:** interactive bare `fkit` with no
   `.fkit/model-settings.json` asks the user to choose **Codex or Claude once**. Cover both a new
   project and an existing legacy fkit project without model settings. Do not select a runtime
   merely because its CLI is installed, or invent a global default.
2. Reuse the existing runtime-appropriate model/effort interview, optional role customization,
   settings review and explicit save confirmation. Persist only the confirmed valid choice in
   ignored, project-local `.fkit/model-settings.json`. After save, run existing managed setup and
   continue normal fresh-project onboarding or the initiated-project role menu in the same command.
   No separate manual `configure`, `setup`, or runtime opt-in command should be needed for this flow.
3. With valid existing settings, bare `fkit` reuses every explicit project/per-role runtime, model
   and effort, including CLI-default/inherit semantics, without re-interview or settings rewrite.
   Keep automatic managed refresh on direct launches and the existing owner-content, unowned-skill,
   symlink and additive `ai-agents/` protections. Do not reinterpret refresh as unattended heal.
4. Empty/invalid **runtime choices**, cancellation, interruption, EOF, invalid configuration and
   declined/empty save confirmation persist no first-use choice and start no role. A subsequent
   bare launch must still offer first use. Existing valid settings must survive failed/cancelled
   configuration unchanged. Existing blank-means-keep answers within model/effort customization
   remain valid; those are not a blank runtime decision or save approval.
5. Keep the change bounded to interactive bare first use. Preserve headless/noninteractive legacy
   behavior, explicit role and legacy argument passthrough, `--runtime` overrides, and existing
   help, board, update, settings/models/preview and other read-only command behavior. Such commands
   must not acquire a first-use interview or settings persistence. Help wording may describe the
   newly approved behavior. Do not change native authentication, credentials, CLI/user configuration
   or hooks. No added auth/API probes, automatic CLI installation or silent runtime/model fallback.
   Runtime availability failures must be reported honestly through the existing launch contract.
6. **Concrete owner gate:** classify this as a product change; present the exact interactive entry
   conditions, legacy-project impact, selected code seam, terminal detection, missing-Node behavior,
   failure/cancellation behavior, compatibility boundaries and test plan. Recommend the bounded
   first-use flow, naming its cost: legacy users without settings now answer one configuration
   interview. Ask the owner explicitly to approve that changed behavior; record the actual answer,
   date and channel through the normal planning procedure. Rejection means no implementation.
   Missing Node must have a clear, non-installing, non-fallback outcome; the coder proposes the
   precise behavior for approval rather than this brief silently choosing it.
7. Update the relevant user-facing quickstart/runtime/help documentation with the approved
   first-use and repeat-launch experience, project-local storage, prerequisites and failure path.
   Keep the opt-in preview distribution distinction and unverified Claude/mixed compatibility clear.
   Do not imply every installation already has this future flow or certify live APIs from stubs.
8. Extend meaningful **existing-file black-box tests**, principally
   `test/launcher-contract.test.js`, exercising the public command through processes/terminal
   fixtures and observing prompts, exit codes, selected CLI argv and files. Reuse existing harnesses
   where suitable. Do not substitute imported interview-function assertions for public-entry proof.
   Follow [CONTRIBUTING.md](../../../../CONTRIBUTING.md) and ADR-057. No new permanent test file or
   prove-red case is authorized; an additional one would need its own explicit owner approval.

## Verification steps

1. In disposable new and initiated legacy projects with no model settings, drive interactive bare
   `fkit` through **each** runtime choice, model/effort settings and explicit save. Prove the saved
   file matches the confirmed choices, managed setup runs, and onboarding/menu continues without
   relaunch. Use stub CLIs and no live auth/API probes; report this as launcher-contract evidence.
2. Launch again with saved mixed per-role settings and explicit runtime/model/effort values; prove
   no configuration questions recur, settings bytes stay unchanged, the selected role receives the
   expected argv, and normal managed refresh still occurs without damaging owner content.
3. Exercise empty/invalid runtime choice, invalid model/effort/role input, cancel/interrupt/EOF and
   declined/empty save separately. Prove no saved first-use choice and **no role invocation**, not
   merely a successful exit. Retry and prove first use remains available. Check existing settings
   remain unchanged on failed/cancelled reconfiguration.
4. Run black-box regressions for noninteractive bare legacy launch, explicit roles plus legacy
   passthrough args, configured launches, explicit `--runtime` override, and help/board/update and
   read-only commands. Assert retained routing/argv and absence of unwanted interview or settings
   writes. Verify the owner-approved missing-Node outcome and selected-runtime unavailable failure;
   neither installs a CLI nor silently selects another runtime. Stubs do not certify account access.
5. Check changed documentation/help against the approved contract and check links by eye. Record
   any historical preservation wording requiring an architect decision; do not silently rewrite an
   accepted ADR or turn a pending behavior decision into an approval claim.
6. Run focused existing-file process tests, **`npm test` and `npm run test:prove-red`** for this
   launcher-contract change; record exact commands, counts, skips, failures and elapsed times.
   Keep `npm test` within ADR-057's 120-second idle-Mac budget. Prove-red's four existing mutations
   cover their stated contracts, not automatically the new interactive path; distinguish executed
   terminal coverage from reasoning-only review. Do not add permanent tests or repeat live workflow
   certification from the previous preview. No release command is needed or authorized.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- One independently shippable unit: first-use selection, confirmed persistence, continuation and
  repeat-launch reuse form one user flow; its tests/docs are acceptance work for that flow.
- Filed 2026-10-30 by the actual `fkit-producer` via owned `fkit-task-brief`, with read-only
  `fkit-query` grounding, in a headless context. No direct owner questioning or implementation.
- Placement: Backlog, unranked. No dependency links to other tasks or sprint waits introduced.
- Pending owner decision for relay **at the concrete plan gate**: approve the bounded interactive
  change including existing legacy projects; request a revised flow; or retain the current legacy
  bare-launch contract. Recommendation: bounded flow, with the one-time legacy interview cost.
  This is a future gate, not an unanswered prerequisite to filing the brief.
- Do not modify Sprint 12, close tasks/sprints, write the wiki, commit, push, change a global
  installation or publish another preview under this filing. Implementation requires the separate
  owner-approved plan; publication and completion require their own authority.
