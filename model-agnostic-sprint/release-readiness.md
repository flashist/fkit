# Migration release-readiness record

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


2026-10-29. **Codex-only local deliverable ready within the accepted limits. Live Claude/mixed-runtime certification is deferred and unverified, not a requirement to repair Claude on this Mac. Independent source and documentation reviews completed.** No commit, push, installer run against the owner's global install, version bump or publication occurred.

## Implemented and checked

Current owner follow-up, 2026-10-29: both Codex hook registrations are disabled for the first version;
implementation retained for later usage feedback. Earlier reviews, live workflows and hook probes
below predate this change. Hook-free launch contracts are checked separately; the full workflow
and prior external reviews were not repeated for this bounded change. Legacy Claude is unchanged.

- Full seven-role Codex operation, project/per-role model choices and fresh review contexts, with measured limits accepted by the owner and recorded in ADR-061.
- Seven direct no-Claude role checks; actual wiki model override; owner form submission/rejection/cancellation, trusted Stop marker and worker decision relay.
- Existing approved task resumed through producer-only closure. One-task sprint completed plan review, actual synthetic approvals, build, verification, primary/adversarial review, coder dispositions and producer task/sprint movers. Agent-closed markers and archived links inspected. Only disposable workflow state closed.
- Public `bin/fkit` preserves unconfigured legacy Claude behavior, resolves configured runtimes/models, and supports explicit root-only runtime selection. Mixed direct/delegated CLI routing, model boundaries, cancellation/invalid settings, no framework Node invocation on the legacy path, and checkout self-hosting have deterministic behavior coverage.
- Installer ships canonical shared resources and adapters, validates required modules before mutation, refuses unowned new targets, handles quoted paths and retains update source/share/bin. Common board/update resource locations remain compatible. Both shipped context templates describe configured runtimes; regenerated manifest adds two current template-body hashes and retains every historical row.
- Root/current architecture, project brief, runtime docs, changelog and working migration records describe the implemented path and its limits. Wiki was not written; only its role may ingest the new ADR.

## Current verification

| Check | Result | Limit |
| --- | --- | --- |
| Final default suite after scaffold/manifest and legacy aliases | 958 total, 957 passed, one skipped, zero failed; duration_ms=94348.559959 | Within120000ms; includes existing-file extensions, not model-behavior coverage |
| Release regression suite | 30 passed, zero failed; duration_ms=88999.576666 | Tests only; the release command was not invoked |
| Public Codex live launch | Exit0, fixed role marker and owned procedure observed; gpt-6-luna | One bounded role smoke in addition to the earlier full local workflow |
| Latest Codex-only public launch | Claude absent from PATH, all seven roles configured Codex; exit0, final marker and successful owned MCP call observed in structured CLI events | Explicit fixture request gpt-6-luna; JSON mode did not supply serving identity, so observed identity stays unknown; real settings/global wrapper preserved |
| Runtime delegation/install tests | Passed with sealed/stubbed CLI/network fixtures | Proves routing/resource contracts, not real Claude success |
| Actual sandbox file probes | Read-only denied source/Git writes; workspace-write allowed source, denied protected Git | Measured environment only; general role ownership remains instructional |
| Syntax/whitespace | Passed | Later documentation/team-description wording received focused checks |
| Installed global wrapper | SHA-256 unchanged from this continuation's baseline | No global update performed |
| Final independent source review | Primary and adversarial available, both observed gpt-6-luna; no verified implementation defects; report relayed verbatim | Reasoning-only second opinion; no independent behavioral execution; Claude validation gate remains |
| Documentation/manifest delta review | Both passes completed; root/scaffold control claims and added hashes checked; R1/R2 stale working-record statements corrected | R3 completion status refreshed after the job ended; no implementation changed or further review loop needed for those own-record updates |
| Final legacy alias compatibility | Both aliases retain read-only direct routing; narrow primary/adversarial review found no confirmed defects | Reasoning-only on both observed gpt-6-luna passes; optional consult-alias tests remain a suggestion, not an unmet gate |
| Real Claude legacy/configured/plain calls | Failed with API Error, no success marker; owner confirmed normal-Terminal failure and local unavailability | No further local probes; live Claude/mixed certification deferred, not claimed |

The skipped default-suite case is the opt-in corpus-board benchmark (`FKIT_BOARD_BENCH=1`), not a failed behavior check. Final scoped process check found no owned verification/review job remaining. HEAD remains76c8507 and the source index is unchanged; no real task/sprint/wiki path changed.

## Failures retained and recovery

The original producer exit2 was an actual CLI flag conflict, not an approval denial. Fixed by omitting explicit sandbox when automatic approval already selects it; closure then passed. Sprint's first harness run timed out after approved build; it resumed from preserved artifacts with actual current-run synthetic reapproval. A later lead hit the default CLI model's usage limit after code review; an explicit fixture-only model selection enabled remaining coder/producer closure. No real model settings were silently changed.

First full-suite assertions passed but timing missed120000ms while release tests also ran (duration_ms=136326.882792). Isolated run passed (89987.425291ms); the final scaffold/manifest run also passed (89517.423542ms). Initial PTY and sandbox-probe errors were harness invocation problems; corrected terminal/file checks passed. Inside-sandbox Claude auth status and an OAuth-excluding bare-mode probe are not used as evidence of normal CLI authentication.

After review, a compatibility check reproduced configured rejection of the existing adv/adversarial aliases. Normalized direct/consult aliases to the canonical restricted role and extended existing direct-routing assertions; the final required suite passed in94348.559959ms. The narrow independent alias review then completed cleanly. No further runtime defect remains confirmed; this does not clear the separate Claude live-certification gate.

The latest Codex-only public-launch harness initially exited1 because its human-output tool-trace
matcher did not recognize the call, despite runtime exit0 and the expected reply. Corrected it to
inspect structured native `mcp_tool_call` completion events; the owned fkit_skill call then verified
completed without error and the harness exited0. This was an observer correction, not a source-code
fix. No further full-suite run was needed for this turn's availability/handoff documentation changes.

## Remaining scope

MA-01–13 have local implementation, measured workflow evidence, accepted limits and ADR record. MA-14 public integration is implemented with deterministic contracts and completed independent source/doc review; no confirmed runtime defects remained. The owner instructed not to rely on local Claude, so MA-15 live Claude/mixed certification is deferred to a capable environment. MA-16 documentation, scaffold/manifest and packaging/release tests are prepared; broader compatibility/release certification remains unclaimed. This local Codex deliverable is usable without that external certification; the entire cross-runtime plan is not declared certified.

Review closeout: the source review disproved X1 by checking that only explicit role keys are preserved on default changes. Documentation R1 and R2 correctly identified stale own-record claims and were corrected. R3 is the expected transition from running to completed and is now refreshed. The second report could not see its own serving identity internally; caller metadata observed gpt-6-luna for its primary and its adversarial tool also observed gpt-6-luna. Both passes used the same model; a different model is recommended for a broader second opinion. Reports were relayed verbatim; this closeout does not edit their findings or pretend they measured product behavior.

Do not ask the owner to repair Claude or repeat API probes as a condition of local Codex work.
The manual Claude-capable verifier handoff in `validation.md` records the still-unverified real
direct/delegated owner/workflow cases. No verifier is currently assigned or scheduled. Keep CLI
credentials/provider state with its owner; no bypass, account change or fallback can manufacture
certification. Local Codex profiles should show `codex` for every effective role in `fkit settings`.

Publication, committing and pushing need a separate explicit owner request. Preserve the current working tree, including untracked runtime/migration files; a checkout from HEAD alone omits this implementation. For a local rollback, stop using the new checkout dispatcher and use the existing legacy launcher/global install; preserve owner project content, saved settings and unrelated skills.
