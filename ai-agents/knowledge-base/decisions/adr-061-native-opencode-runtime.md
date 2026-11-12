# ADR-061: Add a native OpenCode runtime

- **Status:** accepted; manually verified 2026-11-11.
- **Date:** 2026-11-11
- **Authority:** owner request: "Native OpenCode experience — Uses OpenCode's built-in agent
  orchestration. Takes full advantage of its agent system. Requires adapting FKit to OpenCode."
- **Amends:** ADR-009's runtime exclusivity for this new path. Claude runtime behavior remains governed
  by its existing decisions. This record does not authorize test execution, commits or pushes.

- **Corrections:** 2026-11-12 (`0546`) — scoped ⛔ pointers below the runtime and role/source
  paragraphs name ADR-062 and ADR-063. Legend: ⚠️ = fact drift; ⛔ = decision replaced in stated
  scope. All earlier text is left byte-identical; Status stays `accepted`.

## Decision

Ship `opencode/` alongside `claude/`. `fkit opencode [role]` opens a native OpenCode v2 session;
`FKIT_RUNTIME=opencode` selects it for installed `fkit` launches. Setup also supports plain OpenCode.
Native named agent profiles, skill permissions and child sessions own orchestration. Commands
keep the current role and load owned procedures in-session; cross-role commands instruct the current
agent to delegate to the named owner, preserving primary-session approval gates. Do not run
Claude or Codex as an orchestration bridge on this path.

> ⛔ **Dated branch-runtime amendment 2026-11-12 (`0546`) — read
> [ADR-062](adr-062-native-opencode-only-branch-and-native-source-authority.md) for the new native-only
> support policy and future native-source/default-delivery boundary.** The change is deliberately not
> restated here, so there is one place to keep true rather than two. Legacy files are not deleted;
> model/provider choices are not changed. Policy/design accepted; source cutover is not implemented or
> activated by this note. Historical text remains byte-identical; Status stays `accepted`.

The seven roles and shared file-based task/sprint/ledger/wiki structure remain. Role → skill ownership
continues to come from `claude/skills-for-role.sh`; native permissions enforce it per child. Wiki and
hostile reviewer are leaves. Nesting depth 3 supports lead → coder → reviewer → hostile reviewer.
No cycles or concurrent writers against one task/board/ledger. The primary handles owner questions;
children return NEEDS-DECISION, and implementation requires the existing declared-approval marker.

> ⛔ **Dated native-role/source amendment 2026-11-12 (`0546`) — native ownership authority is replaced
> by [ADR-062](adr-062-native-opencode-only-branch-and-native-source-authority.md); planner ownership,
> roster distinctions, Record and the new depth-three planning chain are in
> [ADR-063](adr-063-planner-owns-native-task-planning-and-post-decision-records.md).** These changes are
> deliberately not restated here, so there is one place to keep true rather than two. Native skill/
> edit/delegation, leaf/review honesty and primary owner-channel boundaries remain. Design accepted;
> no eighth profile exists or is activated by these records. Prior text is left byte-identical;
> Status stays `accepted`.

The hostile pass uses a native model-selected child, with no shell or edit permission. Model
self-reports are not diversity evidence: the review helper inspects native assistant-message model
records for the child and its reviewer parent. Missing/unusable child output or unknown/same model
identity yields a prominently flagged partial review. Distinct runtime model IDs are evidence at
OpenCode's model layer, not proof that custom provider aliases map to different upstream models.
Partial reviews never authorize automatic closure. Coverage normally remains reasoning-only.

Claude hooks and plan-mode tools do not run here. Skill/edit/subagent permissions are native; shell
commands remain approval-controlled. Owner plan approval, shell-write discipline and no-cycle rules
remain prompt contracts, not OS sandbox guarantees. Only producer invokes movers, retaining the
`(agent-closed — not owner-verified)` marker. No unrequested commits or pushes.

Setup preserves existing project knowledge and local OpenCode JSON/JSONC. It refreshes FKit-owned
profiles, procedures and a native scaffold snapshot. Heal reuses the shared checker/repair engine
with OpenCode templates and an append-preserving hash manifest; CLAUDE.md is not a native requirement.
Repair remains replacements of known untouched-stale files only, with exact-list owner approval,
apply-time rechecks, symlink refusal and wiki-write routing. No launch-time repair or deletion.

## Evidence and limits

Native configuration and all seven profiles, 28 skills and 28 commands were loaded by OpenCode
v2.2.6. The owner explicitly approved `test/opencode.test.js` and manual verification for the port,
while retaining the test-automation pause. Focused checks cover installed setup and repair; live
fixtures exercised depth-three delegation, distinct-model evidence, non-owned skill denial, and a
same-role command plus native question/reply without project writes. Quota degradation was also
observed and correctly flagged as partial. These checks establish runtime wiring, not consistently
correct model judgments. Evidence and limits: [`opencode/VERIFICATION.md`](../../opencode/VERIFICATION.md).
