# Local Codex acceptance record

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


Date: 2026-10-29. Status: Codex-only local workflow passed within the owner-accepted limits, recorded in ADR-061. Claude/mixed-runtime certification is deferred to a capable environment; it does not block this local Codex deliverable.
Scope: MA-01–13 from `plan.md`; MA-14–16 compatibility/distribution remain required.

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

Historical evidence filing, 2026-10-30 (before acceptance/closure): the hook-free API-owned default-review/opt-out/reset/decision-record
checks and a separately authorized 27-assertion example build/review now have a durable
[0543 verification record](../ai-agents/tasks/done/0543-turn-plan-review-on-by-default-in-fkit-coder-sessions-and-plain-fkit-plan-task/verification/2026-10-30-codex-automation.md)
and companion machine audit. Same-model, synthetic-decision, generic-question-tool and instruction-only
limits remain explicit. This supplements earlier lifecycle evidence; it does not certify a new full
task/sprint lifecycle after later hook/startup/form changes, complete native human UI acceptance or
Claude behavior. 0543's Codex completion basis is a proposal awaiting an actual owner ruling.

Current owner follow-up, 2026-10-29: the first Codex version registers neither PreToolUse nor Stop
hooks. Their implementation is retained but disabled. Prior live workflow/hook evidence below
predates that change; the hook checks are not current controls. Written role/question/footer rules,
model/effort routing and dispatcher checks remain in place. The later contract checks cover the
hook-free launch arguments; the full task/sprint workflow has not been repeated after this change.

## Observed environment

- macOS on the owner's Mac, Node 24.13.0, Codex CLI 0.165.0. The launcher requires stable Codex >=0.165.0. Other versions/platforms are unverified.
- Installed CLI login is reused. No API keys/provider configuration are stored by fkit.
- Live fixtures used CLI default `gpt-6.1-sol`; a wiki override actually ran on `gpt-6-luna`. Those observations are not shipped model defaults or access promises.
- Real Claude CLI is present, version 2.1.312. Two bounded real checks through the unchanged legacy wiki launcher failed, exit 1 / runtime error, without the expected marker. Fixed error category was network/service-related; precise cause is unestablished. Claude compatibility remains unverified.
- Owner confirmed the plain command also fails in normal Terminal and instructed not to count on
  Claude locally. Do not retry its API or require repairing it for Codex-only use. No external
  Claude verifier is assigned; the handoff is in `validation.md`.

## Boundaries and guarantees

| Capability | Status and evidence | Limit / recommendation |
| --- | --- | --- |
| Seven roles, fresh contexts | All seven direct launches passed on a PATH without Claude, each loading an owned procedure; live lead → coder → adversarial and producer → architect/wiki | Dedicated CLI processes; no native subagent parity claim |
| Default/per-role models | Local resolver checks and actual alternate wiki model | Requested model and observed runtime header are reported separately; IDs/aliases do not prove model-family diversity |
| Owned procedures | Dispatcher enforced; 196 actual role/skill cases | Manual file reads/execution remain outside the invocation boundary |
| Native catalog scoping | Session config enables only owned fkit skills | Discovery control, not a filesystem boundary |
| Two-hop/cycle/leaf policy | Dispatcher enforced; protocol cases and nested live runs | Manual independent CLI launches remain outside this boundary |
| Reviewer second pass | Dedicated reviewer-only route outside ordinary consult budget | Fresh read-only context; same-model pass allowed and visibly disclosed |
| Review execution coverage | Per-pass command evidence in actual fixture ledgers | Reading code never counts as execution; unavailable pass stays partial |
| Wiki/source/ledger ownership | Role instructions and inspected bounded fixture outcomes | General write ownership remains advisory; do not describe it as universal sandbox protection |
| Actual sandbox file writes | A disposable command under read-only received EPERM for source and Git writes; workspace-write allowed source and received EPERM for Git writes | Measured boundary in this environment, not authority to write source from other roles |
| Planning gate | Real approval/rejection form behavior observed | Codex has no assumed Claude plan-mode write wall; source-write gate remains instructional |
| Owner question pending/cancelled | Worker decision reached lead, form remained pending, cancellation left source unchanged; exit 0 | Synthetic decisions authorize fixture work only; no unanswered decision grants consent |
| Terminal form UI | Rendered, cancelled and submitted a revision request with exact comment | Tested CLI/client version only; unsupported clients must ask explicitly and wait |
| Stop hook | Disabled by current owner ruling; prior trust/marker check retained as historical evidence | Footer/question-tool requirements now rely on instructions |
| Skill/native-spawn hooks | Disabled by current owner ruling; 196 prior local hook cases are historical | Dispatcher ownership and native-spawn disable settings remain |
| Carry checker | Existing checker reused on direct/dispatcher consult routes | Fail-open source policy retained; fidelity is not proof of owner approval |
| Ship-loop invocation marker | No equivalent runtime claim | Ship-loop context and standing approval are carried in instructions/artifacts |
| Producer Git operations | Corrected CLI argument conflict; task folder and board now show producer closure | Headless producer requests scoped exceptions through automatic approval review; never bypass denial |
| Startup errors | Actual argument-parser failure reproduced; actual MCP failure reports fixed category and withholds synthetic private stderr | Unknown stderr is withheld, not heuristically declared safe |
| Cancellation/cleanup | Protocol cancellation, late-answer rejection, forced termination of SIGTERM-resistant fake worker | No claim to control arbitrary grandchildren or external services |
| Setup/file safety | Repeated setup, root-body preservation, symlink/unowned-skill refusal and existing convergence checks | Canonical initializer also refreshes legacy `.claude/`; `.codex/config.toml` is not replaced |
| Board/heal payloads | Disposable installed status command and explicit `--share` heal checks | Shared canonical payloads stay under `claude/`; no second ownership map |
| No-Claude onboarding | Producer → architect/wiki ran on isolated PATH with no Claude; inspected artifacts | Model/API calls still need the selected CLI's account and network |
| Task completion | Driver exit 0; producer move/status/href/agent-closed marker inspected; existing add check passed; check script hash preserved | Historical source preservation before recorded review lacks committed baseline |
| Sprint completion | Final driver exit0; task and sprint closed by producer movers with agent-closed markers; ledger closed-out and archived links inspected | Preserved timeout/quota recovery; implementation review diversity unknown, actual per-pass execution recorded |
| Public runtime integration | Implemented dispatcher, mixed direct/peer choices, installer/update/self-host and explicit root override; deterministic contract tests passed | Live Claude certification remains open |
| Latest Codex-only public launch | All seven configured roles Codex, Claude absent from PATH; exit0, final marker and actual owned MCP completion observed | No change to real settings/global command; requested fixture model is not a serving-identity claim |
| Shipped context/manifest | Both context templates updated; two current body-hash entries added, all historical manifest rows retained; default suite passed | Existing owner context bodies still follow their preservation/consent rules |

## Regression evidence

Previous checkpoint: permitted existing suite run reported 951 tests, 950 passed, one skipped, zero failed, about83 seconds. It predates this continuation. The canonical legacy launcher later gained common management-only notification support and safe update-wrapper path decoding; current checks cover those changes.

This continuation: 14 role/mode policies, seven actual headless CLI parsers, seven diagnostic cases and an actual MCP error round-trip passed. Seven direct no-Claude role launches loaded their owned team procedure and returned role markers, all exit 0. Runtime headers showed `gpt-6.1-sol` for six roles and the saved wiki override `gpt-6-luna`. An initial sandbox probe failed during CLI argument parsing; the corrected probe measured the file denials/allowance above. No permanent test file added. `progress.md` contains historical attempts and current workflow outcomes, including failures.

Final default suite after shipped context/manifest and alias compatibility updates: **958 total, 957 passed, one skipped, zero failed**, `duration_ms=94348.559959`, within120000ms. Release tests: **30/30**, `duration_ms=88999.576666`. Public Codex live role/procedure smoke passed. Executable-source, documentation-delta and final narrow alias reviews completed primary/adversarial reasoning passes; no behavioral checks were attributed to them. The documentation review found stale working-record statements, corrected after verification; no runtime defect remains confirmed. Optional consult-alias tests were a nonblocking suggestion, not an unmet project key-list requirement.

## Decisions and remaining work

The owner already authorized Codex-first local operation, per-role models, fresh same-model second opinions, preservation of existing workflows/files and later Claude compatibility/distribution. `decisions.md` records these rulings and concrete implementation choices without rewriting accepted ADRs.

Owner accepted the documented local limits through the interactive question in this chat: “Accept limits; continue migration (Recommended)”, 2026-10-29. Exact scope and actual response are in `decisions.md`; the sprint condition then passed. Public selector/mixed routing and packaging are implemented and reviewed. The owner subsequently confirmed API failure in normal Terminal and local Claude unavailability. MA-15 live Claude/mixed compatibility and broader MA-16 certification are deferred, explicitly unverified, with a handoff for a Claude-capable environment. Codex-only local use needs no Claude repair or further Claude probes. This does not turn the stubbed Claude contracts into live evidence or declare the full cross-runtime plan certified.

Rollback of the local experiment: keep owner task/source/wiki content and saved model settings; stop using `bin/fkit-codex`. Only positively identified generated `.agents/skills/fkit-*` artifacts may be removed. Never delete unrelated skills or owner `.codex/` configuration. The installed global command remains outside this local experiment.
