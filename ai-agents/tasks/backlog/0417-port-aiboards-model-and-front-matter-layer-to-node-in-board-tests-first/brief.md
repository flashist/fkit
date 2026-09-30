# Port aiboard's model and front-matter layer to Node in `board/`, tests first

## ID
0417

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).**
> His standing rule, own words (2026-09-27): *"if we already have a brief for that task, the task
> shouldn't start, until I specifically approve it (because it might change the way fkit work in
> general)."*

**Phase 2 — port aiboard to Node, straight into `board/`** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **Faithful to aiboard's format at this step.** Ids stay `T-001`, sprint folders stay `S-011`, aiboard's rules stay aiboard's. fkit's rules are phase 3, not here — mixing the two is the "three big changes at once" risk the phases exist to prevent (ADR-052 *Risks* #2). **Tests first:** port the named aiboard tests to `node:test` under `test/board/`, see them red, then write the code. **Zero dependencies** (ADR-014). The source is the aiboard repository at HEAD `0108027`, read-only — ⛔ nothing is written there.

The first code of the merge: the new `board/` module (D1, Q10) and its lowest layer — the task and sprint model and the front-matter parser/writer. The decision document names **byte-exact front-matter parsing** and **emoji counted differently in the two languages** as the top port risks (§8.4 #3); this unit is where they live, so it goes first and alone.

⚠️ **External precondition — ADR-052 phase 1, not an fkit task.** Phase 1 fixes **only T-023** (ids like `0013` silently becoming `13` on write) in the **Python** aiboard, with a test round-tripping `0013` and `0404`, and runs fkit's real briefs through it so Python is a **correct reference** for this port. By the owner's ruling **Q11** it is **`aiboard-lead`'s last task**, done in the aiboard repository. ⛔ fkit files no task for it and never writes that repository. Its gate — *"Python round-trips the whole corpus unchanged"* — must be met, and phase 2 then put to the owner, before this starts.

## What to build

1. Create `board/` as a separate module with its own tests under `test/board/` (decision document §3.1). No `claude/` file changes; nothing ships yet (`install.sh` is phase 5).
2. Port aiboard's model layer (`aiboard/model.py` in the aiboard repo): front-matter parse and write, ids and statuses, priorities including `critical` and the `urgent` alias, rank defaults, worklog parsing — **faithful to aiboard's format**.
3. Port the matching aiboard tests first (indicative: `test_front_matter_roundtrip`, `test_front_matter_inline_list_and_missing`, `test_quotes_and_backslashes_roundtrip`, `test_ids_and_statuses`, `test_priorities`, `test_rank_defaults_to_id_order`, `test_worklog_parse`, `test_hand_edited_urgent_reads_as_critical`). The plan states the exact list; `0423` checks that every one of aiboard's tests landed somewhere.
4. Add a test that a front matter holding emoji and a zero-padded id (`0013`) survives a write byte-for-byte — the T-023 class, guarded in Node from day one.

## Verification steps

1. Each ported test was seen **red** before the code existed (show the red run in the worklog).
2. `node --test test/board/*.test.js` green; `node --test test/*.test.js` green (no regression).
3. A byte-for-byte round-trip test passes on front matter with emoji, quotes, backslashes and `0013`.
4. `package.json` gains **no** dependency.
5. Nothing outside `board/`, `test/board/` and this task's folder changed (`git status`).

## Notes

- **Depends on:** ADR-052 phase 1's gate — external, `aiboard-lead`'s T-023 fix in the aiboard repository (Q11); no fkit task id. Hard.
- **Blocks:** [`0418`](../0418-port-aiboards-task-store-to-node-with-cross-process-locking/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 2):** All ported tests green; output identical to the Python reference on the corpus; T-021/T-022 tests pass. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
