# Prove the Node port matches the Python reference on fkit's corpus — the phase-2 gate

## ID
0423

## Sprint
Sprint 14

## Priority
P8

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

Phase 2's gate (ADR-052 D9): *"All ported tests green; output **identical to the Python reference** on the corpus; T-021/T-022 tests pass."* The Python reference is aiboard **with T-023 fixed** (phase 1, external — see `0417`). This unit is the check that proves the port, not more port.

⚠️ **Test-count discrepancy, flagged.** ADR-052 says **62** tests are ported in phase 2. Measured in the aiboard repository at `0108027`: 46 (`test_board.py`) + 6 (`test_server.py`) + **10 (`test_mcp.py`)** = 62. But the MCP server is ported **after v1** (Q8, phase 9 — `0468`). This brief assumes the **52 non-MCP tests** are phase 2's and the 10 MCP tests travel with `0468`. ⚠️ **Producer's reading, raised to the owner — not ruled.** If he rules all 62 in phase 2, the MCP port moves forward.

## What to build

1. A harness that runs the Python reference and the Node port over the same corpus (fkit's real tasks, as phase 1 ran them) and diffs every output byte.
2. A table in the worklog mapping every aiboard test name to its ported `node:test` test (or to `0468` for MCP) — none unaccounted for.
3. Report every difference found; fix the port, never the reference.

## Verification steps

1. The harness reports **zero** differences on the corpus — paste its output.
2. The mapping table accounts for all 62 aiboard tests.
3. T-021 and T-022 tests pass; `node --test test/*.test.js` green.
4. The worklog states which corpus was used (commit and count) and that Python had T-023 fixed.

## Notes

- **Depends on:** [`0420`](../../done/0420-build-t-021s-index-once-per-read-into-the-node-store-with-its-reproduction-as-a-test/brief.md), [`0421`](../../done/0421-port-aiboards-command-line-to-node-including-the-terminal-kanban-view-and-json/brief.md) and [`0422`](../../done/0422-port-aiboards-web-server-and-page-to-node-with-t-022-closed-and-concurrent-writes-kept-in-order/brief.md) (the whole port); and ADR-052 phase 1's gate (external — the Python reference). Hard.
- **Blocks:** [`0424`](../../backlog/0424-give-the-board-fkits-four-digit-task-ids-with-forgiving-lookups-and-a-0013-round-trip/brief.md), [`0435`](../../backlog/0435-build-the-converters-reader-every-tasks-and-sprints-facts-from-a-markdown-project-read-with-fkits-current-tools/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 2):** All ported tests green; output identical to the Python reference on the corpus; T-021/T-022 tests pass. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- Gate reached = phase 3 may be **put to** the owner. It does not start phase 3.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
- ⚠️ **Dated note 2026-10-20 — pulled into [Sprint 14](../../../sprints/done/sprint-14.md) as `P7`, and checked against [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md).** By a spawned `fkit-producer` (no owner channel), on owner rulings of 2026-10-20 via `AskUserQuestion` in a `fkit lead` session — selected option text, verbatim: *"New sprint after 13 (Recommended)"*, then *"Close it, then plan AI-Board sprint (Recommended)"* (quoted in full on the Sprint 14 board). `## Sprint` and `## Priority` above are updated; the *Board and priority* bullet above is now stale and left byte-identical. The sprint is **not started**; the ⛔ *do not start without the owner's specific word* stands. Scope is **not** changed by this note.
  - **ADR-057 D2.1 — growth stop.** This brief plans a Python-vs-Node diff harness (*What to build* 1). If the harness is kept as a test file, or as a kept file the suite runs, it needs the owner's OK the same way; if it is a one-off check whose output the worklog pastes, say so in the plan. Each new test file needs the **owner's OK**, file by file, in any lane; a plan he approves counts as that OK **only for the files it names**, and an agent's plan-review APPROVE is not his OK. So this task's plan must list every test file it adds, by path, for the owner to approve.
  - ⚠️ **ADR-057 D1 — the fence: an open owner question, not ruled.** D1 lets a test cover only a **shipped** script seen from outside (the launcher / init / hooks, or a shipped skill executable), plus four named exceptions, *"no others"*. `board/` does not ship in this phase and is in neither list, so tests under `test/board/` sit **outside the fence as written**. The default `npm test` glob (`test/*.test.js`) also does not reach `test/board/`, so where they run and the 2-min budget (D10) follow from the same ruling. ⛔ Do not build tests here until the owner rules; the question is on the Sprint 14 board's *Notes for the driver*.
  - **Factual update, not a scope change:** the *Test-count discrepancy* paragraph above says the 52-now / 10-with-MCP reading was *"not ruled"*. It **was** ruled — owner ruling 2026-09-30, recorded in ADR-052 (*"52 now, 10 with MCP …"*). *Verification* 2's *"all 62"* means 52 ported here plus 10 mapped to `0468`. The paragraph above is left byte-identical.
- ⚠️ **Dated note 2026-10-20 — ADR-052 phase 1's gate (aiboard T-023 fixed) is met: the external half of the *Depends on* line above.** Recorded by a spawned `fkit-producer` (no owner channel) at `fkit-lead`'s request. A fact only: the *Depends on* line above is left byte-identical, and this note does not touch its `0420` / `0421` / `0422` half; no status, sprint or board changed. Per ADR-052 D9 a met gate means phase 2 may be **put to** the owner — ⛔ it does **not** start phase 2, and the ⛔ *do not start without the owner's specific word* above stands. For *Verification* 4, the Python reference with T-023 fixed is aiboard `a1592dc`.
  - **Checked by `fkit-lead` on 2026-10-20:** aiboard commit `a1592dc` ("Sprint push") on `main`, parent `0108027`, authored by the owner 2026-10-20. It changes `aiboard/model.py` (`_parse_scalar` keeps non-canonical digit strings such as `0013` / `0404` as strings; `_dump_scalar` quotes any string that would not read back as itself) and `tests/test_board.py` (+2 tests); T-023 is moved to done in aiboard. The commit also carries 3 stray `.DS_Store` files — harmless, noted only.
  - **Reported by `aiboard-lead` — not checked by fkit:** both new tests pass; the aiboard suite is 63/64, and its 1 failure (`test_comments_and_stale_detection`) pre-dates the fix (hard-coded 2026-09 dates). Corpus: 538/538 fkit files (535 briefs + 3 sprint plans) round-trip byte-identical. fkit files carry no front matter, so `aiboard-lead` also built front matter from 2870 `## Field` values and round-tripped it — 538/538 pass; the same check fails 535/535 on the unfixed `0108027`.
  - **Known gap outside T-023 (pre-existing, reported):** a `None` / empty-string item in a block list is dropped on read. Not part of this gate and not fixed by `a1592dc`; a Node port matched to the Python reference would inherit it unless scoped otherwise. No scope change is made here.
  - **Owner context, verbatim (2026-10-20, typed in the `fkit-lead` session):** *"I just want this AI board to be compatible with F-Kit and I want later to make it part of F-Kit. So anybody who is using F-Kit has this board delivered to them."* Quoted as context; not read here as his word to start phase 2.
- ⚠️ **Dated note 2026-10-20 — owner ruling A3: start word, port source re-pointed, the check is a one-off.** Recorded by a spawned `fkit-producer` (no owner channel), relayed verbatim by `fkit-lead`. Earlier text is not rewritten; scope is unchanged except as stated here. Owner ruling **A3**, 2026-10-20, via `AskUserQuestion` in the `fkit-lead` session — question *"Go ahead with this plan?"*, selected option text, verbatim: *"Yes, all of it (Recommended)"* (description he saw: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*). The plan he approved is quoted in full on the [Sprint 14](../../../sprints/done/sprint-14.md) board (row A3); its test clause, quoted: *"The board's code gets automated tests. One test file per task, up to 6, pre-approved now, so you won't be asked about each file."*
  - **Start word (ADR-052 D9, phase 2) — given.** A3 is the owner's specific word to start phase 2, this task included. It supersedes the ⛔ *do not start without the owner's specific word* above **for this task only**. ⛔ It is **not** his word for phases 3+.
  - **Python reference re-pointed: aiboard `a1592dc`, not `0108027`.** The text above measures the aiboard tests at HEAD `0108027`; that commit **still has T-023** (`0013` → `13` on write). The reference this harness runs (*What to build* 1, *Verification* 4) is `a1592dc` (T-023 fixed). The earlier text is left byte-identical. Re-count aiboard's tests at `a1592dc` for the mapping table: `aiboard-lead` reports 64 there (63 pass), against the 62 measured at `0108027` — the plan reconciles the two numbers; not checked by fkit.
  - **ADR-057 — the Python-vs-Node check is a one-off script, not a kept test** (A3). It is **not** one of the 6 pre-approved test files and does not join the suite; the worklog pastes its output (*Verification* 1). This settles the *"if it is a one-off check … say so in the plan"* branch of the 2026-10-20 ADR-057 note above. ⛔ If the plan wants to keep it as a test, or add any other new test file, that goes to the owner, file by file.
  - **Known gap carried from the reference:** the `None` / empty-string block-list item dropped on read (2026-10-20 gate note above) exists in `a1592dc` too, so a zero-difference result matches it rather than fixes it. The worklog says so; no scope change here.
- ✅ **Dated note 2026-10-20 — rank `P7` → `P8`.** By a spawned `fkit-producer` (no owner channel): `0536` moved to `P1` on owner ruling A3 — 2026-10-20, `AskUserQuestion`, `fkit lead` session, question *"Go ahead with this plan?"*, selected *"Yes, all of it (Recommended)"* (description: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*); plan text: *"1. Now, 1 small task: ship that view-only web page to every fkit user, through a new `fkit board` command. ... 2. Sprint 14, 7 tasks: rebuild aiboard inside fkit in Node ..."*. *"Now"*, and step 1 before step 2, is his ruling that `0536` runs first; every other Sprint 14 row moved down one. `## Priority` above is updated; the earlier *"as `P7`"* text is left byte-identical. Dependency order within `0417`–`0423` is unchanged. **Knock-on: none** — no `Depends on:` line changed.
- ⚠️ **Dated note 2026-10-22 — a planned, deliberate departure from Python aiboard: a read-side `Host` check.** Recorded by a spawned `fkit-producer` (no owner channel) at `fkit-lead`'s request, on owner rulings of 2026-10-22 (`AskUserQuestion`, `fkit-lead` session; quoted verbatim in [`0538`](../../backlog/0538-refuse-reads-from-a-foreign-host-name-in-the-shipped-fkit-board-reader/brief.md) and [`0539`](../../backlog/0539-refuse-reads-from-a-foreign-host-name-in-the-node-board-server/brief.md)). Backlog task [`0539`](../../backlog/0539-refuse-reads-from-a-foreign-host-name-in-the-node-board-server/brief.md) will add a `Host` check on reads to `board/server/server.mjs`: a GET whose `Host` is not local (anything other than `localhost`, an IP literal, or the configured host) is **refused (403)**. Python aiboard has no such check, so those requests will differ from the reference **on purpose** — the same kind of departure as `0422`'s T-022 write refusals. **Requests with a local `Host` must still match Python exactly**; this note does not loosen the gate for them. **Sequencing:** if this task closes before `0539` lands, `0539` re-runs this comparison (or the server-facing parts of it) and records the result; if `0539` lands first, this task's harness treats non-local-`Host` refusals as the one expected difference and says so in the worklog. Scope, status, rank and the *Depends on* line above are unchanged; `0539` is a neighbour, not a dependency, either way. **Knock-on: none.**
