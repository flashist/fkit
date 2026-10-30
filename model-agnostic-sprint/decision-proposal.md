# Codex runtime decision proposal

Date: 2026-10-29. Status: draft for owner review, not an accepted ADR.

This proposal makes the existing owner-authorized experiment explicit. It does not change historical ADR text or claim that the migration is complete. Evidence and limits: `local-acceptance.md`, `progress.md`, and the disposable task/sprint records.

## Decisions already authorized

1. Add Codex CLI as a full seven-role runtime, using the installed CLI and its login. Local model weights and provider APIs are separate future scope.
2. Save a project default and per-role model overrides in ignored local settings. An explicit null model means follow that runtime's default. Unknown/invalid settings or an unavailable selected model never justify silently choosing another model.
3. Always attempt a separate adversarial context. A usable same-model pass is supported, with a visible different-model recommendation. Unusable/missing passes remain partial. Report actual pass availability, model identity/diversity and executed checks separately.
4. Preserve role duties, task/sprint state, coder dispositions, wiki ownership, producer-only movers and owner approval gates. No commit, push or release is authorized.

## Concrete local implementation to accept or revise

- Every role is a fresh Codex CLI process. A required, session-scoped stdio dispatcher checks skill ownership and consult topology. It is not a persistent service. Native subagents are disabled on this path.
- Ordinary consultation has a two-hop/cycle/leaf boundary. Reviewer-only independent second opinion has the same exception that the old external CLI pass had. The adversarial process is a read-only leaf.
- General role writes, wiki ownership and the no-code-before-plan-approval rule remain instructions. Codex provides no assumed Claude plan-mode write wall. Do not call these universal filesystem controls.
- Optional extra hooks require normal Codex trust. Owned skill invocation remains enforced by the dispatcher when those hooks are inactive. Stop checks are heuristics with one continuation maximum. No equivalent ship-loop user-prompt marker is claimed.
- Reuse the current carry checker and its fail-open infrastructure policy. It establishes carried-plan fidelity, not proof of approval. Actual owner responses must be preserved separately.
- Interactive root sessions use an actual owner form and wait. Headless workers return NEEDS-DECISION; cancellation, missing/invalid replies and requests for explanation grant no approval.
- Headless producer uses automatic approval review with workspace-write so the sanctioned movers can request protected Git writes. Each exception is reviewed. A denial leaves closure pending; no manual mover substitute, commit or push is authorized.
- Keep shared role/skill policy canonical under `claude/` during the port, with explicit generated Codex bindings. No duplicated ownership registry or broad policy extraction is needed for the local milestone.
- Stable Codex CLI >=0.165.0 is the minimum validated parser/feature baseline. Only the observed Mac/Node/CLI combination is currently tested.

## Amendments needed after acceptance

| Existing decision | Required new decision scope |
| --- | --- |
| ADR-009, single Claude runtime | Permit Codex as a full role runtime; keep Omnigent retired. Record this as a later amendment, not a rewrite of the original rationale. |
| ADR-042 D1, coverage reporting | Retain per-pass execution honesty; separate it from model diversity and runtime names. Never infer measurement from a sandbox label. |
| ADR-042 D2 / open task 0273 | Keep its workspace-write review implementation decision visible and unresolved here. This local port preserves live read-only behavior; it does not reverse or discharge task 0273. |
| ADR-054, Claude-only fallback | Preserve existing Claude fallback semantics for legacy users; add the owner-authorized Codex same-model two-pass behavior as an explicitly scoped runtime amendment. |
| ADR-018/021/030, ownership/questions/hooks | Record the measured Codex dispatcher/elicitation boundaries and optional trusted-hook differences. Do not claim that all Claude hook events ported. |
| ADR-059/060, plan review | Preserve review toggles and owner gates, while explicitly documenting the Codex instructional planning boundary. |

Formal ADR numbering and accepted status require the project's decision-recording procedure and the actual owner ruling. This draft supplies the concrete substance; it is not that ruling.

## Proposed next public integration

Preserve existing projects' Claude entry behavior when no runtime settings exist. Use the saved project runtime once configured, with an explicit session override such as `fkit --runtime codex` or `fkit --runtime claude`. Keep the checkout-local Codex entry point available. No installed global command is replaced merely to test the change.

Mixed-runtime overrides must select a valid model for the target runtime, launch a fresh role context, preserve owner relay and role ownership, and avoid inheriting incompatible model IDs/reasoning settings. Never implement silent fallback between Claude and Codex. Shared install/update/self-host, board/heal resources and release validation must be tested together in disposable installs. Real Claude sessions are required; argument stubs alone are insufficient.

Public command/default details and accepted local limits remain review decisions before MA-14–16 are declared complete. Publication and Git mutation remain separately unauthorized.
