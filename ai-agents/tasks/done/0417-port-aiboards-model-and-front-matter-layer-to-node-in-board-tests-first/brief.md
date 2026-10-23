# Port aiboard's model and front-matter layer to Node in `board/`, tests first

## ID
0417

## Sprint
Sprint 14

## Priority
P2

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
- ⚠️ **Dated note 2026-10-20 — pulled into [Sprint 14](../../../sprints/done/sprint-14.md) as `P1`, and checked against [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md).** By a spawned `fkit-producer` (no owner channel), on owner rulings of 2026-10-20 via `AskUserQuestion` in a `fkit lead` session — selected option text, verbatim: *"New sprint after 13 (Recommended)"*, then *"Close it, then plan AI-Board sprint (Recommended)"* (quoted in full on the Sprint 14 board). `## Sprint` and `## Priority` above are updated; the *Board and priority* bullet above is now stale and left byte-identical. The sprint is **not started**; the ⛔ *do not start without the owner's specific word* stands. Scope is **not** changed by this note.
  - **ADR-057 D2.1 — growth stop.** This brief plans new test files: the ported model / front-matter tests (*What to build* 3) and the byte-for-byte emoji + `0013` round-trip test (item 4). Each new test file needs the **owner's OK**, file by file, in any lane; a plan he approves counts as that OK **only for the files it names**, and an agent's plan-review APPROVE is not his OK. So this task's plan must list every test file it adds, by path, for the owner to approve.
  - ⚠️ **ADR-057 D1 — the fence: an open owner question, not ruled.** D1 lets a test cover only a **shipped** script seen from outside (the launcher / init / hooks, or a shipped skill executable), plus four named exceptions, *"no others"*. `board/` does not ship in this phase and is in neither list, so tests under `test/board/` sit **outside the fence as written**. The default `npm test` glob (`test/*.test.js`) also does not reach `test/board/`, so where they run and the 2-min budget (D10) follow from the same ruling. ⛔ Do not build tests here until the owner rules; the question is on the Sprint 14 board's *Notes for the driver*.
- ⚠️ **Dated note 2026-10-20 — ADR-052 phase 1's gate (aiboard T-023 fixed) is met.** Recorded by a spawned `fkit-producer` (no owner channel) at `fkit-lead`'s request. A fact only: the *Depends on* line above is left byte-identical; no status, sprint or board changed. Per ADR-052 D9 a met gate means phase 2 may be **put to** the owner — ⛔ it does **not** start phase 2, and the ⛔ *do not start without the owner's specific word* above stands.
  - **Checked by `fkit-lead` on 2026-10-20:** aiboard commit `a1592dc` ("Sprint push") on `main`, parent `0108027`, authored by the owner 2026-10-20. It changes `aiboard/model.py` (`_parse_scalar` keeps non-canonical digit strings such as `0013` / `0404` as strings; `_dump_scalar` quotes any string that would not read back as itself) and `tests/test_board.py` (+2 tests); T-023 is moved to done in aiboard. The commit also carries 3 stray `.DS_Store` files — harmless, noted only.
  - **Reported by `aiboard-lead` — not checked by fkit:** both new tests pass; the aiboard suite is 63/64, and its 1 failure (`test_comments_and_stale_detection`) pre-dates the fix (hard-coded 2026-09 dates). Corpus: 538/538 fkit files (535 briefs + 3 sprint plans) round-trip byte-identical. fkit files carry no front matter, so `aiboard-lead` also built front matter from 2870 `## Field` values and round-tripped it — 538/538 pass; the same check fails 535/535 on the unfixed `0108027`.
  - **Known gap outside T-023 (pre-existing, reported):** a `None` / empty-string item in a block list is dropped on read. Not part of this gate and not fixed by `a1592dc`; a Node port matched to the Python reference would inherit it unless scoped otherwise. No scope change is made here.
  - **Owner context, verbatim (2026-10-20, typed in the `fkit-lead` session):** *"I just want this AI board to be compatible with F-Kit and I want later to make it part of F-Kit. So anybody who is using F-Kit has this board delivered to them."* Quoted as context; not read here as his word to start phase 2.
- ⚠️ **Dated note 2026-10-20 — owner ruling A3: start word, test-file pre-approval, port source re-pointed.** Recorded by a spawned `fkit-producer` (no owner channel), relayed verbatim by `fkit-lead`. Earlier text is not rewritten; scope is unchanged except as stated here. Owner ruling **A3**, 2026-10-20, via `AskUserQuestion` in the `fkit-lead` session — question *"Go ahead with this plan?"*, selected option text, verbatim: *"Yes, all of it (Recommended)"* (description he saw: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*). The plan he approved is quoted in full on the [Sprint 14](../../../sprints/done/sprint-14.md) board (row A3); its test clause, quoted: *"The board's code gets automated tests. One test file per task, up to 6, pre-approved now, so you won't be asked about each file."*
  - **Start word (ADR-052 D9, phase 2) — given.** A3 is the owner's specific word to start phase 2, this task included. It supersedes the ⛔ *do not start without the owner's specific word* above **for this task only**. ⛔ It is **not** his word for phases 3+.
  - **Port source and Python reference re-pointed: aiboard `a1592dc`, not `0108027`.** The text above names aiboard HEAD `0108027`; that commit **still has T-023** (`0013` → `13` on write). `a1592dc` (its child, T-023 fixed — see the 2026-10-20 gate note above or the Sprint 14 board) is the source to port from and the reference to compare against. The earlier text is left byte-identical; where it says `0108027`, read `a1592dc`. Still read-only — ⛔ nothing is written in the aiboard repository.
  - **ADR-057 — ruled for this task.** D1 (the fence): the board's tests count, so tests under `test/board/` are inside the fence for this work. D2.1 (growth stop): **one** new test file under `test/board/` is pre-approved for this task — it holds this task's model and front-matter tests (*What to build* 3) **and** the emoji + `0013` byte-for-byte round-trip (item 4) — both go in that one file. The plan names its path. ⛔ **Any second new test file, or any new test file outside `test/board/`, still goes to the owner, file by file.** This supersedes the *"⛔ Do not build tests here until the owner rules"* line of the 2026-10-20 ADR-057 note above.
  - ⚠️ **Not ruled by A3:** how `test/board/` is run (the default `npm test` glob, `test/*.test.js`, does not reach it — so *Verification*'s `node --test test/*.test.js` does not run this file) and how it fits the 2-min budget (ADR-057 D10). The plan says how, and puts it to the owner if it changes `package.json`'s test scripts or the suite's time.
- ✅ **Dated note 2026-10-20 — rank `P1` → `P2`.** By a spawned `fkit-producer` (no owner channel): `0536` moved to `P1` on owner ruling A3 — 2026-10-20, `AskUserQuestion`, `fkit lead` session, question *"Go ahead with this plan?"*, selected *"Yes, all of it (Recommended)"* (description: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*); plan text: *"1. Now, 1 small task: ship that view-only web page to every fkit user, through a new `fkit board` command. ... 2. Sprint 14, 7 tasks: rebuild aiboard inside fkit in Node ..."*. *"Now"*, and step 1 before step 2, is his ruling that `0536` runs first; every other Sprint 14 row moved down one. `## Priority` above is updated; the earlier *"as `P1`"* text is left byte-identical. Dependency order within `0417`–`0423` is unchanged. **Knock-on: none** — no `Depends on:` line changed.
  - ✅ **Correction 2026-10-20 — the *"Not ruled by A3"* line above is wrong; it was ruled, inside A3.** The architect's dated ⛔ note below [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) §D1 records the terms (option A, D2) that A3's *"Yes"* approved: tests under `test/board/` run **inside the default `npm test`** — `0417` adds `test/board/*.test.js` to `package.json`'s `"test"` script — **within the 2-minute budget** (D10, unchanged), and the coder names any slow board test in the task's plan, before building it. So *Verification*'s `node --test test/*.test.js` is no longer the whole suite once `0417` lands; `npm test` is. Earlier lines left byte-identical. **This task makes the `package.json` change** — it is in scope here.
