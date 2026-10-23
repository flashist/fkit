# Port aiboard's command line to Node, including the terminal kanban view and `--json`

## ID
0421

## Sprint
Sprint 14

## Priority
P6

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

aiboard's CLI (`aiboard/cli.py`, 573 lines in the aiboard repo) is how agents and scripts use the board (R6: *"CLI for everything"*). Ported faithfully here, including its **terminal kanban view** (the `board` command), `info`, list filters, `--json` on every read, JSON errors — and, faithfully for now, its `init` and agents-md instruction block (both dropped in `0432`).

⭐ The terminal kanban view is the one `0405` (terminal-UI investigation) is re-scoped over.

## What to build

1. Port every aiboard command, faithful to aiboard's names and output at this step.
2. Port the matching aiboard tests first (indicative: `test_full_flow`, `test_argparse_errors_are_json`, `test_critical_priority_via_cli`, `test_task_rank_via_cli`, `test_board_truncates_with_ellipsis`, `test_install_block_is_idempotent`, `test_block_tells_agents_to_take_work_from_the_top`).

## Verification steps

1. Each ported test seen red first, then green.
2. `--json` output of every read command parses as JSON (a test, not a claim).
3. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0419`](../../done/0419-port-aiboards-sprints-to-node-faithful-to-aiboards-format/brief.md) (the CLI drives tasks and sprints). Hard.
- **Blocks:** [`0423`](../0423-prove-the-node-port-matches-the-python-reference-on-fkits-corpus-the-phase-2-gate/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 2):** All ported tests green; output identical to the Python reference on the corpus; T-021/T-022 tests pass. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
- ⚠️ **Dated note 2026-10-20 — pulled into [Sprint 14](../../../sprints/done/sprint-14.md) as `P5`, and checked against [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md).** By a spawned `fkit-producer` (no owner channel), on owner rulings of 2026-10-20 via `AskUserQuestion` in a `fkit lead` session — selected option text, verbatim: *"New sprint after 13 (Recommended)"*, then *"Close it, then plan AI-Board sprint (Recommended)"* (quoted in full on the Sprint 14 board). `## Sprint` and `## Priority` above are updated; the *Board and priority* bullet above is now stale and left byte-identical. The sprint is **not started**; the ⛔ *do not start without the owner's specific word* stands. Scope is **not** changed by this note.
  - **ADR-057 D2.1 — growth stop.** This brief plans new test files: the ported CLI tests, and a test that every read command's `--json` output parses (*What to build* 2; *Verification* 2). Each new test file needs the **owner's OK**, file by file, in any lane; a plan he approves counts as that OK **only for the files it names**, and an agent's plan-review APPROVE is not his OK. So this task's plan must list every test file it adds, by path, for the owner to approve.
  - ⚠️ **ADR-057 D1 — the fence: an open owner question, not ruled.** D1 lets a test cover only a **shipped** script seen from outside (the launcher / init / hooks, or a shipped skill executable), plus four named exceptions, *"no others"*. `board/` does not ship in this phase and is in neither list, so tests under `test/board/` sit **outside the fence as written**. The default `npm test` glob (`test/*.test.js`) also does not reach `test/board/`, so where they run and the 2-min budget (D10) follow from the same ruling. ⛔ Do not build tests here until the owner rules; the question is on the Sprint 14 board's *Notes for the driver*.
- ⚠️ **Dated note 2026-10-20 — owner ruling A3: start word, test-file pre-approval, port source re-pointed.** Recorded by a spawned `fkit-producer` (no owner channel), relayed verbatim by `fkit-lead`. Earlier text is not rewritten; scope is unchanged except as stated here. Owner ruling **A3**, 2026-10-20, via `AskUserQuestion` in the `fkit-lead` session — question *"Go ahead with this plan?"*, selected option text, verbatim: *"Yes, all of it (Recommended)"* (description he saw: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*). The plan he approved is quoted in full on the [Sprint 14](../../../sprints/done/sprint-14.md) board (row A3); its test clause, quoted: *"The board's code gets automated tests. One test file per task, up to 6, pre-approved now, so you won't be asked about each file."*
  - **Start word (ADR-052 D9, phase 2) — given.** A3 is the owner's specific word to start phase 2, this task included. It supersedes the ⛔ *do not start without the owner's specific word* above **for this task only**. ⛔ It is **not** his word for phases 3+.
  - **Port source and Python reference re-pointed: aiboard `a1592dc`, not `0108027`.** The text above names aiboard HEAD `0108027`; that commit **still has T-023** (`0013` → `13` on write). `a1592dc` (its child, T-023 fixed — see the 2026-10-20 gate note above or the Sprint 14 board) is the source to port from and the reference to compare against. The earlier text is left byte-identical; where it says `0108027`, read `a1592dc`. Still read-only — ⛔ nothing is written in the aiboard repository.
  - **ADR-057 — ruled for this task.** D1 (the fence): the board's tests count, so tests under `test/board/` are inside the fence for this work. D2.1 (growth stop): **one** new test file under `test/board/` is pre-approved for this task — it holds this task's command-line tests, including the `--json` parse check. The plan names its path. ⛔ **Any second new test file, or any new test file outside `test/board/`, still goes to the owner, file by file.** This supersedes the *"⛔ Do not build tests here until the owner rules"* line of the 2026-10-20 ADR-057 note above.
  - ⚠️ **Not ruled by A3:** how `test/board/` is run (the default `npm test` glob, `test/*.test.js`, does not reach it — so *Verification*'s `node --test test/*.test.js` does not run this file) and how it fits the 2-min budget (ADR-057 D10). The plan says how, and puts it to the owner if it changes `package.json`'s test scripts or the suite's time.
- ✅ **Dated note 2026-10-20 — rank `P5` → `P6`.** By a spawned `fkit-producer` (no owner channel): `0536` moved to `P1` on owner ruling A3 — 2026-10-20, `AskUserQuestion`, `fkit lead` session, question *"Go ahead with this plan?"*, selected *"Yes, all of it (Recommended)"* (description: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*); plan text: *"1. Now, 1 small task: ship that view-only web page to every fkit user, through a new `fkit board` command. ... 2. Sprint 14, 7 tasks: rebuild aiboard inside fkit in Node ..."*. *"Now"*, and step 1 before step 2, is his ruling that `0536` runs first; every other Sprint 14 row moved down one. `## Priority` above is updated; the earlier *"as `P5`"* text is left byte-identical. Dependency order within `0417`–`0423` is unchanged. **Knock-on: none** — no `Depends on:` line changed.
  - ✅ **Correction 2026-10-20 — the *"Not ruled by A3"* line above is wrong; it was ruled, inside A3.** The architect's dated ⛔ note below [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) §D1 records the terms (option A, D2) that A3's *"Yes"* approved: tests under `test/board/` run **inside the default `npm test`** — `0417` adds `test/board/*.test.js` to `package.json`'s `"test"` script — **within the 2-minute budget** (D10, unchanged), and the coder names any slow board test in the task's plan, before building it. So *Verification*'s `node --test test/*.test.js` is no longer the whole suite once `0417` lands; `npm test` is. Earlier lines left byte-identical.
- ⚠️ **Dated note 2026-10-20 — forward notes carried from the closed [`0417`](../../done/0417-port-aiboards-model-and-front-matter-layer-to-node-in-board-tests-first/brief.md).** By a spawned `fkit-producer` (no owner channel), at the `fkit-sprint-ship-loop` driver's request (`fkit-lead`). Information for the plan, not new scope; earlier text left byte-identical; no status or `Depends on:` change. Sources: `0417`'s [review.md](../../done/0417-port-aiboards-model-and-front-matter-layer-to-node-in-board-tests-first/review.md) round-2 forward note and [worklog.md](../../done/0417-port-aiboards-model-and-front-matter-layer-to-node-in-board-tests-first/worklog.md) *Forward notes*.
  - **`pyStr` throws on a plain JS object.** `board/core/python-compat.mjs` `pyStr` now throws `TypeError` (`no Python str() for [object …]; use a Map for a dict`) on any value with no Python twin — the port's dict is a `Map`. review.md, quoted: *"aiboard's server and CLI call `str()` on raw JSON values — `server.py` `_labels` (`str(x).strip() for x in value`), `str(body.get("author") …)`, and the `edit` action's `title` stored straight into meta and then dumped. Python turns a JSON object there into text (`"{'a': 1}"`); the Node port will throw `TypeError` instead, unless its JSON layer turns objects into `Map`s first (in source key order — `JSON.parse` moves integer-like keys forward)."* Wherever this CLI takes JSON input and feeds it to `pyStr`, convert objects to `Map`s in source key order first.
  - **`--json` and `BigInt`.** worklog.md, quoted: *"integers beyond 2^53 come back as `BigInt`, and `JSON.stringify` throws on `BigInt`, so `--json` must convert them"*. The ported `--json` parse test should include one such integer.
  - **Emoji width.** worklog.md, quoted: *"emoji width matters there (`test_board_truncates_with_ellipsis`)"* — the terminal kanban view's truncation must count emoji and other astral (above U+FFFF) characters as Python does.
  - **Knock-on: none** — no task moved, no `Depends on:` line changed.
