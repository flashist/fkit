# Build T-021's index-once-per-read into the Node store, with its reproduction as a test

## ID
0420

## Sprint
Sprint 14

## Priority
P5

## Status
✅ Done (agent-closed — not owner-verified)

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

aiboard's **T-021** is its snapshot cost: every read rebuilt everything. `aiboard-lead` measured an index built once per read at **6.8×** faster (decision document §3.2 — *attributed, not re-measured here*). fkit has ~415 tasks today, so this matters from the first real use. ADR-052 D9 phase 2: *"T-021 (speed) … built in with their original reproductions as tests."*

## What to build

1. Build the index once per read into the ported store.
2. Port T-021's **original reproduction** from the aiboard repository's task record as a test, and a benchmark the worklog quotes (numbers, machine-independent ratio).

## Verification steps

1. The T-021 reproduction test fails against the store without the index and passes with it (show both).
2. The worklog quotes the measured speed-up on a corpus of at least fkit's size — a number, not a claim.
3. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0418`](../../done/0418-port-aiboards-task-store-to-node-with-cross-process-locking/brief.md). Hard.
- **Blocks:** [`0423`](../0423-prove-the-node-port-matches-the-python-reference-on-fkits-corpus-the-phase-2-gate/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 2):** All ported tests green; output identical to the Python reference on the corpus; T-021/T-022 tests pass. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
- ⚠️ **Dated note 2026-10-20 — pulled into [Sprint 14](../../../sprints/done/sprint-14.md) as `P4`, and checked against [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md).** By a spawned `fkit-producer` (no owner channel), on owner rulings of 2026-10-20 via `AskUserQuestion` in a `fkit lead` session — selected option text, verbatim: *"New sprint after 13 (Recommended)"*, then *"Close it, then plan AI-Board sprint (Recommended)"* (quoted in full on the Sprint 14 board). `## Sprint` and `## Priority` above are updated; the *Board and priority* bullet above is now stale and left byte-identical. The sprint is **not started**; the ⛔ *do not start without the owner's specific word* stands. Scope is **not** changed by this note.
  - **ADR-057 D2.1 — growth stop.** This brief plans new test files: T-021's original reproduction as a test, and a benchmark (*What to build* 2). Each new test file needs the **owner's OK**, file by file, in any lane; a plan he approves counts as that OK **only for the files it names**, and an agent's plan-review APPROVE is not his OK. So this task's plan must list every test file it adds, by path, for the owner to approve.
  - ⚠️ **ADR-057 D1 — the fence: an open owner question, not ruled.** D1 lets a test cover only a **shipped** script seen from outside (the launcher / init / hooks, or a shipped skill executable), plus four named exceptions, *"no others"*. `board/` does not ship in this phase and is in neither list, so tests under `test/board/` sit **outside the fence as written**. The default `npm test` glob (`test/*.test.js`) also does not reach `test/board/`, so where they run and the 2-min budget (D10) follow from the same ruling. ⛔ Do not build tests here until the owner rules; the question is on the Sprint 14 board's *Notes for the driver*. Also D10: a benchmark on a corpus of fkit's size must not run inside the default `npm test` without the owner's OK — the plan says where it runs.
- ⚠️ **Dated note 2026-10-20 — owner ruling A3: start word, test-file pre-approval, port source re-pointed.** Recorded by a spawned `fkit-producer` (no owner channel), relayed verbatim by `fkit-lead`. Earlier text is not rewritten; scope is unchanged except as stated here. Owner ruling **A3**, 2026-10-20, via `AskUserQuestion` in the `fkit-lead` session — question *"Go ahead with this plan?"*, selected option text, verbatim: *"Yes, all of it (Recommended)"* (description he saw: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*). The plan he approved is quoted in full on the [Sprint 14](../../../sprints/done/sprint-14.md) board (row A3); its test clause, quoted: *"The board's code gets automated tests. One test file per task, up to 6, pre-approved now, so you won't be asked about each file."*
  - **Start word (ADR-052 D9, phase 2) — given.** A3 is the owner's specific word to start phase 2, this task included. It supersedes the ⛔ *do not start without the owner's specific word* above **for this task only**. ⛔ It is **not** his word for phases 3+.
  - **Port source and Python reference re-pointed: aiboard `a1592dc`, not `0108027`.** The text above names aiboard HEAD `0108027`; that commit **still has T-023** (`0013` → `13` on write). `a1592dc` (its child, T-023 fixed — see the 2026-10-20 gate note above or the Sprint 14 board) is the source to port from and the reference to compare against. The earlier text is left byte-identical; where it says `0108027`, read `a1592dc`. Still read-only — ⛔ nothing is written in the aiboard repository.
  - **ADR-057 — ruled for this task.** D1 (the fence): the board's tests count, so tests under `test/board/` are inside the fence for this work. D2.1 (growth stop): **one** new test file under `test/board/` is pre-approved for this task — it holds this task's T-021 reproduction test (the speed check). The plan names its path. ⛔ **Any second new test file, or any new test file outside `test/board/`, still goes to the owner, file by file.** This supersedes the *"⛔ Do not build tests here until the owner rules"* line of the 2026-10-20 ADR-057 note above.
  - ⚠️ **Not ruled by A3:** how `test/board/` is run (the default `npm test` glob, `test/*.test.js`, does not reach it — so *Verification*'s `node --test test/*.test.js` does not run this file) and how it fits the 2-min budget (ADR-057 D10). The plan says how, and puts it to the owner if it changes `package.json`'s test scripts or the suite's time.
- ✅ **Dated note 2026-10-20 — rank `P4` → `P5`.** By a spawned `fkit-producer` (no owner channel): `0536` moved to `P1` on owner ruling A3 — 2026-10-20, `AskUserQuestion`, `fkit lead` session, question *"Go ahead with this plan?"*, selected *"Yes, all of it (Recommended)"* (description: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*); plan text: *"1. Now, 1 small task: ship that view-only web page to every fkit user, through a new `fkit board` command. ... 2. Sprint 14, 7 tasks: rebuild aiboard inside fkit in Node ..."*. *"Now"*, and step 1 before step 2, is his ruling that `0536` runs first; every other Sprint 14 row moved down one. `## Priority` above is updated; the earlier *"as `P4`"* text is left byte-identical. Dependency order within `0417`–`0423` is unchanged. **Knock-on: none** — no `Depends on:` line changed.
  - ✅ **Correction 2026-10-20 — the *"Not ruled by A3"* line above is wrong; it was ruled, inside A3.** The architect's dated ⛔ note below [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) §D1 records the terms (option A, D2) that A3's *"Yes"* approved: tests under `test/board/` run **inside the default `npm test`** — `0417` adds `test/board/*.test.js` to `package.json`'s `"test"` script — **within the 2-minute budget** (D10, unchanged), and the coder names any slow board test in the task's plan, before building it. So *Verification*'s `node --test test/*.test.js` is no longer the whole suite once `0417` lands; `npm test` is. Earlier lines left byte-identical. This also answers the earlier *"a benchmark on a corpus of fkit's size must not run inside the default `npm test` without the owner's OK"* line: this task's file runs inside `npm test`; if its speed check would threaten the 2-minute budget, the plan names it, before building, and that goes to the owner.
