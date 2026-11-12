# Build native OpenCode authority and the delivery boundary

## ID
0547

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Unit A of the accepted [0546 design](../../../knowledge-base/reports/2026-11-12-design-native-fkit-planner.md),
especially §§4, 11–12, implements
[ADR-062](../../../knowledge-base/decisions/adr-062-native-opencode-only-branch-and-native-source-authority.md).
The owner accepted the design in the primary OpenCode `fkit-lead` session, question channel,
2026-11-12, verbatim **"Accept design (Recommended)"**, relayed by `fkit-lead`.
All four exact scope/acceptance answers are recorded in
[0546](../0546-design-fkit-planner-and-task-planning-ownership-transfer/brief.md), *Context*.
That answer authorizes formal records and build-brief preparation only, not implementation.

This branch supports native OpenCode only, not a staged standalone-Claude rollout. Native setup
currently derives roles/prompts/resources from legacy inputs; the accepted design replaces that
authority while explicitly retaining needed compatibility resources. The dependency must be coherent
before the [planner vertical slice](../0548-build-planner-all-native-planning-paths-and-exact-record-handoff/brief.md).
Existing native planning must keep working until that replacement is available.

**Execution gate:** current callable `fkit-coder` prepares the implementation plan while planner is
unbuilt. Present the complete plan for separate live owner approval before source writes. Design
acceptance and this brief are not that approval. No tests, runtime refresh/activation, stopped checks,
legacy-tree deletion or provider/model changes follow from either approval automatically. Re-read
current files and preserve concurrent native setup/model/launcher/docs work rather than overwriting
the architect's dated inspection baseline.

## What to build

1. Establish the accepted native sources: `opencode/roles.mjs` as the sole native role/procedure,
   common-skill, leaf-policy and artifact-grant registry; native `opencode/agents/fkit-*.md` prompts
   for the seven existing roles; and `opencode/runtime-contract.md`. Stop importing legacy agent
   bodies or `claude/skills-for-role.sh` as native authority. Keep current native planning ownership
   functional in this unit; do not transfer it to an unavailable planner.
2. Resolve the effective native-over-retained procedure union. Generate commands and permissions
   from that inventory and native registry, including native-only skills; unknown/unowned FKit
   procedures fail generation, never receive broad grants. Explicitly inventory retained
   `claude/skills/`, scaffold/structure resources and selected helpers as compatibility inputs,
   not a parallel supported runtime or mirrors requiring legacy feature parity.
3. Use one effective template resolver for initialization, heal snapshots and native manifest
   generation. Native overrides win; retain prior manifest hashes, existing owner knowledge/config,
   owner-edited files and current preservation behavior. The internal heal-resource `claude/`
   layout can remain; wholesale helper relocation is not required. Preserve consent-gated heal
   boundaries, wiki routing and no automatic existing-project repair.
4. Make installed `fkit [role]` native by default and preserve `fkit opencode [role]` as an alias.
   Explicit `FKIT_RUNTIME=claude` refuses with an actionable unsupported-runtime message, without
   fallback to a legacy CLI. Preserve native flags, option values, literal `--`, explicit model
   overrides, saved preferences and session-resume semantics; invent no provider requirements or
   model bans. Preserve the read-only board entry.
5. Supply the runtime-neutral updater without entering the legacy role launcher. Preserve recorded
   repository/ref/share/bin destinations, update-channel behavior and source-checkout safeguards.
   Installer sanity checks target native entry files and package both native inputs and explicitly
   retained dependencies. Remove unsupported standalone-Claude prerequisite advertising; do not
   delete/move the legacy tree or existing project `.claude/`, settings or knowledge.
6. Align active root instructions, native scaffold/README/help, PROJECT/architecture, delivery and
   contribution documentation, package description and changelog with the actual boundary. Distinguish
   accepted future planner behavior from the current seven-role bootstrap. Historical legacy texts
   remain history, not active native authority. Preserve review independence/model flags, native
   leaf/skill/edit boundaries, producer-only movers and agent-closed markers, vault exclusivity,
   owner approval and no unrequested commit/push rule. No Claude hooks/plan-mode/OS-sandbox claims.
7. Maintain affected shipped-script coverage within repository test policy; propose any new test
   files/cases requiring owner approval rather than silently adding them. Do not enable automatic
   test execution. Leave runtime generation/installed/live verification as explicit consent-gated
   work, not a side effect of changing canonical sources.

## Verification steps

1. Inspect the approved implementation diff against design §§4, 11–12 and ADR-062: native authority
   no longer reads legacy role ownership or agent bodies; existing seven-role planning remains
   internally consistent until `0548`. No unsupported Claude feature-parity work or deletion enters.
2. Inspect effective registry/procedure/template resolution across setup, command/permission
   generation, init/heal/manifests: one override policy, explicit retained dependencies, fail-closed
   unknown ownership, prior hashes and preservation rules retained. Record unexecuted behavior as
   unverified, not passed.
3. Review native entry/install/update behavior and docs for preserved arguments, preferences,
   resume/channel/destination/source-checkout semantics and explicit standalone-Claude refusal.
   Check model/provider configuration and authentication have not been reset or restricted.
4. Independent implementation review covers source/delivery/security boundaries, compatibility
   inputs, owner-file preservation and absence of privilege widening. Preserve all partial-review
   flags and required verification gaps; do not automatically close with incomplete required checks.
5. List concrete future script/packaging/config-preservation checks, expected outcomes and gaps.
   Tests are retained but paused by the owner's 2026-11-11 ruling: execute only on explicit request;
   any generation/install/update/live probe also needs separately authorized scope. Source-plan
   approval alone does not authorize runtime refresh or activation.

## Notes

- **Depends on:** nothing
- **Blocks:** 0548
- **Design prerequisite:** accepted `0546` report/ADR-062 already exist; this brief does not require
  a new lifecycle close of `0546` or modify its existing status/dependency fields.
- **Placement/knock-on:** Backlog, unranked. `0548` waits on `0547` on the Backlog board; `0549`
  waits through `0548`. No existing sprint task is re-pointed or newly blocked (checked at filing).
- **Split rationale:** native source authority and delivery are one coherent independently shippable
  boundary, with existing planning retained. The planner replacement is the next separate unit;
  deployment evidence is separately consent-gated.
- **Overlap/keep-outs:** `0345`/`0387` and `0543`–`0545` stay unchanged; paused Sprint 12, cancelled
  Claude checks, prior record-only/qualified-wording rulings and the interactive evidence gap are
  not repaired, waived or resumed here. No wiki writes or lifecycle action.
- **Wiki context:** prior read-only query lacks ADR-062/063; the accepted source records govern the
  new native contract. Vault updates belong to a separate `fkit-wiki` assignment.
- **Filed 2026-11-12** by spawned producer on the relayed owner acceptance and accepted split;
  preparation is not permission to start implementation, activation, tests, commits or pushes.
