# Remove the output variants from `/fkit-status` — one skill, one output

**Source**: `ai-agents/tasks/done/remove-output-variants-from-fkit-status.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 44

## Goal
Make `/fkit-status` render **one output — the complete briefing with the full step-4 board — on every invocation**, deleting the delta-on-repeat default and the reserved `full` keyword together (removing only the keyword while keeping the delta would leave *no* path to the full board). **Reverts task 38**, `✅ Done` and shipped the same week — deliberately: the delta default was designed when the board was LLM-hand-built and expensive; task 41's `dashboard.sh` made rendering deterministic and free, retiring half the justification, and the owner ruled on what survived (terseness): *"there should be 1 version of the output if I run the skill."*

## Key Changes
- Argument contract back to two cases: empty → active sprint, a name → that sprint. `full`/`all`/`board` are ordinary text and fail honestly as unknown sprint names.
- Step 5 (the delta rule) deleted **entirely** — no softer "delta unless much changed" (the same defect in a different hat); steps renumbered, stale cross-references and the `dashboard.sh:25` comment fixed.
- **The sprint-name argument survives, settled not assumed:** it is a different *subject* (an operand), not an output variant — and it is the only path to closed sprints in `sprints/done/`.
- History frozen: the dated design report and task 38's brief are not rewritten; task 38 stays `✅ Done` because it *was* done.
- **No ADR** — a product preference about one skill's output, not mechanism; the general rule went to a convention instead (task 47).

## Outcome
**Done.** `/fkit-status` has one output. The generalized rule lives in [[tasks/record-one-skill-one-output-convention]] (`conventions/one-skill-one-output.md`); the pre-filed wiki-sync task 45 covered updating the vault's `full` references (this sync's pages record the reversal).

## Related
- [[tasks/add-full-board-switch-to-fkit-status]] — task 38, the feature this reverts
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — task 41, which made the full board free and the delta unjustified
- [[tasks/record-one-skill-one-output-convention]] — the standing rule generalized from this reversal
- [[tasks/add-status-skill-to-producer]] — the skill itself
- [[tasks/sprint-2-remove-omnigent]]
