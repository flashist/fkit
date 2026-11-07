# Use native runtime model and effort defaults and retire fkit selectors

## ID
0548

## Sprint
Sprint 15

## Priority
7

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Current priority — owner ruling, 2026-11-06, user chat in root `fkit-lead`, relayed to
`fkit-producer`; not producer precedent for re-ranking.** Now Sprint 15/P7
(previously P4). The exact owner request is recorded on
[Sprint 15](../../../sprints/sprint-15.md) under the dated owner-priority addendum.
The new lead-continuation/question tasks come first among open work; the prior open tasks keep
their relative order. This supersedes earlier priority and next-task/order statements only;
quoted decisions remain historical. Status, disposition, placement, dependencies, existing
approval gates and retry caps are unchanged. No implementation-plan approval or extra launch.

## Current continuation — planning stage parked, 2026-11-06

**0548 — Use native runtime model and effort defaults and retire fkit selectors** is reset to
`🔲 Backlog`: both owner-permitted launches for the final draft revision returned no usable draft.
The driver read both empty role returns and the absent optional checkpoint. The existing R1 draft
is intact and unapproved; no approved `plan.md` exists. Retain the incomplete review record below.
No further launch is authorized by the two-launch stage allowance. Skip this task for this run;
any additional attempt is an owner decision. This parking changes no priority, placement,
dependency, accepted product choice or source-write gate. Earlier In-progress claim text is
historical and superseded by this exit.

**Current planning claim — 2026-11-05, root `fkit-lead` ship-loop.** Claimed for root-owned
plan-only work under the 2026-11-03 sprint-start approval and the owner's 2026-11-05 continuation
ruling recorded on [Sprint 15](../../../sprints/sprint-15.md). Eligibility checked against the
actual briefs and deterministic dashboard: P1/0540 is agent-closed Done, P2/0537 is owner-deferred,
and P3/0520 is blocked by failed verification and skipped this run. This task is P4, depends on
nothing and has no current session claim in its retained records. `fkit-coder` remains the
accountable role; `fkit-lead` owns this planning claim.

No approved `plan.md` exists. The two failed attempts in [plan-review.md](plan-review.md) remain
historical, not current approval; this claim neither spends another worker retry nor authorizes
extra launches under their exhausted retry allowance. Plan review remains ON (default); actual
owner approval of the reviewed implementation plan is required before source writes. The owner's
latest user-chat ruling defers timing, delay, benchmark and test-duration work for now, including
the inherited gates below. No startup/configuration investigation is reopened. Scope, placement,
priority, dependencies and all other approval gates remain unchanged.

**Owner request — 2026-10-30, user chat, relayed verbatim by `fkit-lead`:**

> I decided that I want to remove the initial step of choosing models and effort or agent and F kit. The very first step that asks whether it is a cloud or a codex version of fkit should remain but the settings per like settings that allow you to choose specific model like astra soul terra and their effort should be removed so like the idea right now is that we should go with the default settings of the user, like whatever they have, we should go with it. Please take care of the cases like right now in some of my projects I already did manual setup of models per agent and per F-Kit In the future release it should be either reset or ignored. I don't know how to implement it better. So brief a task into the current sprint and we will take care of it in the current sprint and we will ship it in the next release.

The runtime choice means **Claude versus Codex**. The owner expressly names the just-planned
Sprint 15 through the lead's session context. Its banner is `🔲 Backlog`; the deterministic
selector returns `active none`. Filing schedules work for the next release; it starts nothing
and grants no release authority.

**Existing contract being changed:** [0546](../../done/0546-configure-first-use-from-bare-fkit-and-reuse-saved-project-settings/brief.md)
added model/effort interviews and exact saved-override reuse; [ADR-061](../../../knowledge-base/decisions/adr-061-codex-as-a-full-seven-role-runtime-with-explicit-local-limits.md)
Decision 1 and its Decision 6 amendment describe those settings. This new owner request changes
that behavior. Keep historical records intact and arrange the dated decision amendment through
the owning architect under its normal procedure during implementation planning. This brief
does not amend the ADR or authorize an interview exception.

**Architecture checked, not assumed:** `codex/settings.mjs` combines runtime/model/effort
validation and resolution. Direct launches and shell consults use `launchArgs` in
`codex/fkit.mjs`; MCP consultation and adversarial passes in `codex/server.mjs` reload settings
and use that same launch boundary. `codex/claude.mjs` is the other runtime adapter. Both
adapters currently test model against null, so deleting a field alone can still emit a bad
model argument. Current canonical fkit agent definitions contain no model/effort selectors;
upgrade refresh of older managed copies still needs verification.

A fresh read-only `fkit-architect` consultation at hop 2 of 2 confirmed enough is known to
scope implementation now. Its in-memory checks found runtime-only records and some
cross-runtime/null combinations rejected by current validation. No separate investigation is
needed; native-runtime acceptance, particularly configured Claude, remains unverified.

## What to build

1. **Use the selected runtime's native model and reasoning-effort defaults for every fkit role.**
   Stop supplying fkit model/effort overrides in interactive or headless direct launches,
   shell/MCP consults, and reviewer adversarial launches. Cover all seven roles and both
   runtime adapters. Do not replace removed arguments with a bundled model, effort, reset,
   profile, or a snapshot of the user's defaults. Native preference changes must take effect
   on the next launch without reconfiguring fkit. Retain role controls, approval gates,
   sandbox/tool limits, hook state, fresh contexts and actual serving-model reporting.
2. **No-loss migration: ignore legacy fkit model/effort fields, preserve stored choices.**
   Keep compatibility with `.fkit/model-settings.json` at its existing path/schema, accepting
   runtime-only records and treating legacy project/role `model` and `reasoningEffort` fields
   as inert data. Absent, null, obsolete, unsupported and malformed values in those two retired
   fields must neither affect launch nor block an otherwise valid runtime configuration.
   Preserve runtime/container/role validation, malformed-JSON errors, unknown unrelated-field
   handling, regular-file checks and symlink protections. Ordinary launch, preview and
   inspection must leave saved bytes unchanged. No automatic reset, deletion or rewrite is
   needed. Runtime configuration edits preserve unrelated retained data.
3. **Retain runtime selection and routing.** Keep the initial explicit Claude/Codex choice,
   saved project runtime, existing per-role runtime choices and root-only `--runtime` behavior.
   Children resolve their own saved runtime choices afresh. Decouple runtime validation from
   model/effort fields: no cross-runtime model requirement, model-driven pinning or catalog
   validation of ignored values. Model-only legacy role records must not become runtime pins;
   explicit runtime overrides keep their meaning. Retain runtime-only advanced configuration;
   do not add a new role-customization interview.
4. **Simplify setup and configuration in the same behavioral change.** Remove project/per-role
   model catalogs, model selection and effort prompts from first use and reconfiguration.
   Retain runtime review, one explicit save, cancellation and same-command setup/onboarding
   or role-menu continuation. Retire `--model`, `--role-model`, `--effort`, `--role-effort` and
   the `models` command; old invocations receive a clear removal/native-default message and cannot save
   an override. The coder's plan names the exact deprecated commands/flags and exit behavior,
   including any obsolete `--runtime-default` compatibility alias. This alias may only mean
   native defaults; it must never restore fkit model selection. Runtime-only noninteractive
   configuration must work without a model flag. Keep missing-Node, selected-CLI preflight,
   invalid runtime, cancel/EOF/SIGINT, unavailable-runtime and no-silent-fallback contracts.
5. **Make effective behavior visible.** Update public and dispatcher help, `settings`, preview,
   MCP provenance/descriptions and generated bindings to say model/effort follow native
   runtime defaults. Stored legacy values must never be presented as effective/requested
   selections. Actual observed serving identity stays distinct from the absence of an fkit
   request; unknown identity stays unknown. Do not select another model to manufacture review
   diversity; preserve current same-model disclosure and missing-pass reporting.
6. **Preserve user configuration and verify the managed-agent seam.** Do not edit native Codex
   or Claude config, credentials, profiles, unrelated agents, hooks or MCP settings to achieve
   migration. Check normal setup/upgrade refresh removes stale model/effort selectors from
   fkit-owned generated agent copies before delegation, including configured Claude.
   Canonical owned definitions must not inject a selector. If a candidate file cannot be
   established as fkit-owned, preserve it and report the boundary rather than resetting it.
7. **Ship matching documentation and existing-file regression coverage.** Likely work-product
   paths: `bin/fkit`, `codex/settings.mjs`, `codex/fkit.mjs`, `codex/claude.mjs`,
   `codex/server.mjs`, `codex/materialize.mjs`, and obsolete selector helpers in
   `codex/models.mjs`; inspect `claude/fkit-claude-init.sh` and owned agent delivery as needed.
   Update `codex/README.md`, relevant README/help/package metadata, release notes and living
   migration guidance where they describe current settings behavior. Preserve historical
   evidence and preview-versus-default distribution distinctions. This is a path guide, not
   authority for unrelated rewrites. Another coder currently owns `bin/fkit-board.mjs`,
   `docs/board.md`, `README.md` and `CHANGELOG.md` for board startup UX: leave board code/docs
   outside this task and coordinate later README/CHANGELOG edits against its completed delta.
   Use existing `test/launcher-contract.test.js` and established process/terminal harnesses.
   Follow CONTRIBUTING.md and ADR-057: no new permanent test file or prove-red case without
   individual owner approval; keep default `npm test` within 120 seconds on an idle Mac.

## Verification steps

1. With disposable new and initiated legacy projects, drive public bare interactive `fkit`
   through each runtime choice. Assert no model/effort/catalog/role-customization prompts,
   runtime-only review and explicit save, correct persistence, setup and continuation.
   Repeat launch must bypass setup questions. Check runtime-only `configure`, `settings`,
   preview and help; retired selectors must not take effect or write settings.
2. Exercise disposable schema-1 fixtures with project and role model/effort overrides,
   model-only roles, explicit mixed runtimes, absent/null values and invalid retired values.
   Include values the previous effort/model checks reject. For otherwise valid runtime data,
   launch must succeed using native defaults. Check invalid runtime, unknown role/container,
   malformed JSON, nonregular/symlinked files and unrelated invalid fields still fail safely.
   Hash saved settings before/after launch/inspection: unchanged. Explicit runtime-only edits
   must preserve unrelated retained data and effective routing except the requested change.
3. Through process fixtures, capture actual selected executable and argv for all seven direct
   roles in interactive/headless modes, shell consult, MCP consult and adversarial delegation.
   Assert no fkit `--model`, `model_reasoning_effort`, effort/profile substitute or model reset;
   runtime choices remain correct. Exercise same/different root runtime overrides, saved
   child runtime routing, and a settings change between child invocations. No live account
   probing is needed for this contract evidence.
4. In isolated native-config fixtures, retain distinct user model/effort defaults and unrelated
   preferences. Prove configuration bytes remain unchanged and the launcher does not override
   them; change those fixture defaults and prove the next launch still defers to them. Verify
   upgrade refresh of a stale fkit-owned agent copy, and preservation of unrelated native
   agents/configuration. Stub argv tests prove omission/routing, not actual provider execution:
   label each evidence type accurately.
5. Recheck cancellation, declined/empty save, invalid input, EOF/SIGINT, missing Node/selected
   CLI, setup failure after a confirmed save, unconfigured noninteractive/explicit legacy entry,
   direct Codex alias and help/board/update routing. Pre-save failures must save no choice and
   invoke no role. No runtime fallback, auth repair, native-config reset or global install.
6. Check help/docs/settings/preview/delegation output against the final behavior, with no
   legacy override claimed effective. Preserve the explicit caveat: **live configured Claude
   and mixed-runtime compatibility remain unverified** until checks run in a Claude-capable
   environment. Define that follow-up as actual native default inheritance, refreshed agent
   definitions, direct/child/adversarial launch and cancellation checks; retain failures and
   deferred results. Do not require local Claude API repair or promote stubs to certification.
7. Run focused existing-file launcher process/terminal tests, `npm test` and the four existing
   `npm run test:prove-red` cases. Record exact commands, counts, skips, failures and duration;
   distinguish executed checks from reasoning-only review and deferred native checks.
   No release command is required or authorized by this brief.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- One independently shippable behavioral slice: retiring selectors, ignoring old overrides,
  runtime-only validation/routing and native-default invocation must agree. Shipping only the
  engine would leave controls accepting ineffective choices; shipping only the UI would leave
  existing projects pinned. Docs/tests are acceptance work for that slice, not separate features.
- Fresh `fkit-architect` consultation: `fkit-lead → fkit-producer → fkit-architect`, hop 2 of 2,
  Codex, reported model `gpt-6.1-sol`, exit 0, usable, no timeout/truncation. Read-only source
  inspection plus in-memory validator checks; no live compatibility pass or implementation.
- No matching open brief found across live task records. 0546 is closed historical work,
  not a duplicate to reopen. No open brief currently depends on this new task; the settings
  change introduces no wait for 0540, 0537, 0520 or any other open task.
- **Owner-confirmed priority — 2026-10-30, `fkit_roles.fkit_ask_owner`, interactive root session, relayed verbatim by `fkit-lead`:**
  > Keep P4 after 0520 (Recommended) — Preserve the approved three-task order, then simplify runtime settings. No dependency links or waits on other sprints change.
  This confirms the existing P4 placement; no re-ranking or producer precedent for re-ranking.
- **On merit this belongs directly below 0520**, because it is the next-release settings change
  after the already-approved launcher hardening order. Existing priorities are untouched.
- Filed 2026-10-30 by the actual spawned `fkit-producer` through owned `fkit-task-brief`, with
  read-only `fkit-query` grounding and technical scope consultation. The wiki has a relevant
  ADR-061 page but no record of this new simplification yet; live source/owner ruling ground it.
  Nine commits touched `ai-agents/` since watermark
  `185ac5e07e918c089ed3afd23496587315342000`; wiki sync remains partial/stale.
- Product change; normal reviewed implementation plan and owner approval remain required.
  No unresolved product choice blocks filing. Any implementation discovery that cannot meet
  no-loss ignore within this boundary returns to the owner rather than resetting configuration.
- Scheduling only for Sprint 15/next release. No implementation, starts, status promotion,
  terminal moves, wiki writes, native-config edits, commit, push or publication in this filing.
