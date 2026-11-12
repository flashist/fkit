# ADR-062: Native OpenCode-only branch and native source authority

- **Status:** accepted — design/policy; source cutover not implemented.
- **Date:** 2026-11-12
- **Deciders:** owner (Mark Dolbyrev), via primary OpenCode fkit-lead question channel; verbatim answers relayed to fkit-architect. No verified human-signature claim.
- **Task:** [0546](../../tasks/backlog/0546-design-fkit-planner-and-task-planning-ownership-transfer/brief.md).
- **Amends:** [ADR-061](adr-061-native-opencode-runtime.md), only the alongside-runtime support and native shared-source clauses for this branch. Other native safety/permission/review boundaries stand.
- **Specification:** [2026-11-12 native planner design](../reports/2026-11-12-design-native-fkit-planner.md), §§1–5, 11–12.

## Context

The owner wants a dedicated planner and explicitly selected native-only support, not a staged dual-runtime feature. Current native setup still derives ownership and prompts from legacy sources: `opencode/setup.mjs`, "const readOwnership", "claude/skills-for-role.sh", and "claude/agents/fkit-${role}.md". It also overlays native procedures on legacy resources. The installer still defaults to the legacy launcher (`install.sh`, "FKIT_RUNTIME:-claude"). Making native planning authoritative while retaining those ownership imports would leave two competing contracts.

### Owner authority, verbatim

**2026-11-12, primary OpenCode fkit-lead session, question channel**, relayed by fkit-lead:

- Runtime question: **"Focus on OpenCode only, we're not supporting Claude anymore in this branch. Claude will be able to be supported only via OpenCode"**.
- Final revised-design gate: **"Accept design (Recommended)"**.

The final presentation authorizes formal design records and preparation of build briefs, NOT source implementation, legacy deletion, activation, model/provider changes, tests or resuming stopped checks. Full answer set and accepted specification: report §1. Relay is trust, not independently verified consent evidence.

## Decision

1. **Supported runtime on this branch is native OpenCode only.** Standalone Claude is not supported and is not a later rollout phase. Claude-via-OpenCode adds no provider/model selection, requirement or restriction.
2. **Native sources own native authority.** Future `opencode/roles.mjs` is the one native role/procedure/leaf/artifact registry. Native `opencode/agents/fkit-*.md` prompts and `opencode/runtime-contract.md` replace legacy agent-body transformation. Native setup no longer reads `claude/skills-for-role.sh` or `claude/agents/` as authority. These files are future implementation, not created by this ADR.
3. **Retain explicitly scoped compatibility resources, not a second supported runtime.** Legacy procedures, templates, structure resources and selected helpers may remain inputs until separately migrated. No legacy-tree deletion or full helper relocation is authorized. Retained legacy ownership/agent files are historical, not native mirrors to keep synchronized.
4. **One effective native-over-retained resource resolution.** Native procedures/scaffold overrides win. Generate commands/permissions from the effective procedure inventory and native registry, including native-only skills. Unknown/unowned FKit procedures fail generation. Initialization, heal snapshot and native manifest generation use the same effective template resolver; retain historic hashes, existing knowledge/config preservation and current internal heal-resource layout where needed.
5. **Supported entry/delivery becomes native.** `fkit [role]` defaults native; `fkit opencode [role]` remains alias. Explicit standalone-Claude runtime selection refuses, never falls back. Preserve native argument/model/session semantics. Runtime-neutral update preserves recorded repo/ref/share/bin and source-checkout safeguards without entering the legacy role launcher. Package native entry files and retained dependencies; advertise only supported prerequisites. Do not automatically delete existing `.claude/`, settings or knowledge.
6. **No provider/config reset.** Existing native model preferences, overrides and authentication remain. Planner receives normal team model/effort, not hostile defaults.
7. **Delivery is future work.** The support policy and design are accepted now; source/installer/runtime state remains as inspected until separately approved implementation. Bootstrap authority/delivery first; planner vertical slice next ([ADR-063](adr-063-planner-owns-native-task-planning-and-post-decision-records.md)); activation/verification needs separate consent. No automatic tests, lifecycle action, commit or push follows from acceptance.

## Options considered

- **Native authority plus retained compatibility resources (chosen).** Implements the owner's branch policy without an unnecessary tree deletion or wholesale migration.
- **Both runtime sources receive planner.** Earlier architect recommendation; not chosen by the owner, who explicitly excluded standalone Claude support.
- **OpenCode-first staged standalone-Claude support.** Not the ruling: support is native-only, not a temporary parity gap.
- **Native profile overlay while ownership/prompts remain legacy-derived.** Does not establish coherent native authority; rejected in the accepted revised design.
- **Delete/move the entire legacy tree now.** Not authorized or necessary; widens delivery risk beyond the accepted boundary.

## Consequences

- **Positive:** one supported runtime and one native authority contract; native-only procedures can ship coherently; retained helpers avoid unrelated migration work.
- **Negative / costs:** native registry/prompt/launcher/install cutover is broader than adding one file; compatibility resources remain load-bearing and must be packaged/resolved consistently. Historical legacy sources deliberately diverge from active native definitions. Unsupported old scripts may remain on disk; their presence is not a support claim.
- **Residual risks:** config/provider overrides may alter effective runtime behavior; ignored generated files are not canonical; resource omission can break installed use. No OS sandbox or Claude hook enforcement is claimed.
- **Re-raise only if:** the owner changes branch runtime policy; a retained dependency cannot be delivered safely; effective resource resolution diverges across setup/heal/manifests; native behavior still reads legacy role authority after cutover; or a later migration proposes removal of retained resources. A retained `claude/` directory or deliberate historical/native divergence alone is not a defect.

## Related

- [Accepted design and verification limits](../reports/2026-11-12-design-native-fkit-planner.md).
- [ADR-061](adr-061-native-opencode-runtime.md) — original native addition; only scoped clauses amended.
- [ADR-063](adr-063-planner-owns-native-task-planning-and-post-decision-records.md) — planner role and approval/record handoff.
- `opencode/setup.mjs`, "copyTree(path.join(source, 'claude/skills')"; `opencode/generate-manifest.mjs`, "claude/scaffold" — retained-resource seams.
- `install.sh`, "record the installed version"; `claude/fkit-claude.sh`, "_fkit_reinstall" — update behavior to preserve, not commands executed here.
- Wiki ingestion is a separate fkit-wiki assignment; no vault write is made by this record.
