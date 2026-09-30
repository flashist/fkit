# Port aiboard's web server and page to Node with T-022 closed and concurrent writes kept in order

## ID
0422

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

aiboard's page needs no changes to move (decision document §3.1, `aiboard-lead`); its server (`aiboard/server.py`) does. Two faults are fixed **as part of the port**, each with its original reproduction as a test (ADR-052 D9 phase 2):

- **T-022** — another website the owner visits can write to his board. The server must check the requesting site, host and content type on every write. ADR-049 D4 (T-022 closed before any write mode) is **satisfied by building the fix in here** (ADR-052 *Effect on existing ADRs*).

- **Concurrent web writes** — aiboard's server today does **not** keep simultaneous web writes in order (a shared lock counter; *Risks* #6).

⛔ **Q16:** until the pilot, no writable server on real project data. Tests use fixture trees only.

The one-time key and the owner-door stamping are phase 3 (`0433`), not here.

## What to build

1. Port the server and move the page, including `serve --read-only`.
2. Port aiboard's server tests first (`test_critical_priority`, `test_rank_endpoint`, `test_index_and_board`, `test_write_flow`, `test_errors`, `test_read_only`).
3. Port T-022's original reproduction as a test; add the site/host/content-type checks.
4. Add a test that fires simultaneous web writes and proves none is lost or reordered.

## Verification steps

1. Each ported test seen red first, then green.
2. The T-022 reproduction is **refused** by the new server (a test), and was accepted by a naive port (show it).
3. The concurrent-writes test passes repeatedly (state how many runs).
4. No test serves a real project's `ai-agents/` tree writable (Q16) — say how this was checked.

## Notes

- **Depends on:** [`0419`](../0419-port-aiboards-sprints-to-node-faithful-to-aiboards-format/brief.md) (the server writes through the store). Hard.
- **Blocks:** [`0423`](../0423-prove-the-node-port-matches-the-python-reference-on-fkits-corpus-the-phase-2-gate/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 2):** All ported tests green; output identical to the Python reference on the corpus; T-021/T-022 tests pass. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
