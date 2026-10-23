# Ship the read-only board reader to every fkit user via `fkit board`

## ID
0536

## Sprint
Sprint 14

## Priority
P1

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Owner ruling A3, 2026-10-20 — this task's start word is given.** Via `AskUserQuestion` in the
`fkit-lead` session, question *"Go ahead with this plan?"*, selected option text, verbatim: *"Yes, all
of it (Recommended)"* (description he saw: *"Ship the view-only board to every fkit user now, and
start the Node rebuild (Sprint 14)."*). Step 1 of the plan he approved, as `fkit-lead` put it in chat
(quoted): *"Now, 1 small task: ship that view-only web page to every fkit user, through a new
`fkit board` command. This gets your "everyone has the board" goal in one task instead of 44. It needs
Node, but only for this one command."* Its knock-on, quoted: *"the new task in step 1 goes into Sprint
14 on its own, with nothing waiting on it. No other task changes its dependencies."* Full ruling on the
[Sprint 14](../../../sprints/done/sprint-14.md) board (row A3). The owner's goal, typed 2026-10-20: *"I just
want this AI board to be compatible with F-Kit and I want later to make it part of F-Kit. So anybody
who is using F-Kit has this board delivered to them."*

**What exists today.** fkit has a read-only board reader, `bin/fkit-board.mjs` (task `0411`, ADR-051
"A now"; `--root` from `0412`). It serves aiboard's web page over a project's unchanged `ai-agents/`
tree and writes nothing. It runs only from a fkit checkout, via `npm run board`. `docs/board.md`
says so under *Not shipped*: `install.sh` copies `claude/` only (the `cp -R "$TMP/src/claude"` step),
and the page itself is read from an aiboard checkout found by `--aiboard`, `FKIT_AIBOARD` or a sibling
`../aiboard` folder — so a user who installs fkit gets neither.

**This task ships that reader, as it is, to every fkit user** — the interim board, until ADR-052's
built-in board (phases 2–5) replaces it. Scope per `fkit-architect` (relayed by `fkit-lead`,
2026-10-20):

- **Vendor aiboard's `web/index.html` (~34 KB) into fkit.** ⚠️ This reverses a recorded choice: the
  reader's comment at `bin/fkit-board.mjs` lines 106–107 says the page is *"NOT vendored into fkit — a
  copy would fork aiboard's UI … and invert the one-way dependency the owner set (fkit adapts to
  aiboard)"*. A3 plus the pending ADR below change that; the comment must be fixed in the same change
  (code-comments rule: fix a comment your change makes wrong).
- `install.sh` ships the reader and the vendored page into the install share.
- The launcher routes `fkit board` to the installed reader.
- **Node is required for this command only**, with a clear error naming Node if it is missing. Every
  other `fkit` command keeps working without Node.
- **Read-only, writes nothing** — unchanged from today.

⛔ **Rests on [ADR-058](../../../knowledge-base/decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge.md)** — *the read-only board reader ships to
every fkit user as `fkit board`, ahead of the merge*. Briefed as **pending**; by the time this brief was
written (2026-10-20) `fkit-architect` had placed it in the working tree, marked accepted. Read it before
planning — **where it and this brief differ, the ADR wins.** A decision record, not a task, so it is
not a `Depends on:` link.

**Not part of ADR-052 phase 2.** It is in Sprint 14 by A3's placement, but it is not in phase 2's gate
(`0423`) and it does not wait on the Node port. Later ADR-052 tasks take over from it: `0443` (installer
ships `board/`), `0444` (launcher routes `fkit board` to the board module) and `0467` (retires the
reader) — each carries a dated note pointing here.

## What to build

1. **Vendor the page.** Copy aiboard's page (`aiboard/web/index.html` in the aiboard repository) into fkit, unmodified. The plan names the
   aiboard commit it comes from (`a1592dc` is the commit fkit has checked, 2026-10-20) and where it
   lives in fkit, and records that provenance next to the file. Fix the reader's *"NOT vendored"*
   comment.
2. **Make the reader work from an install.** Today it finds fkit's root by walking up from its own
   file, and expects `ai-agents/` there; installed, it lives in the install share, which has no
   `ai-agents/`. The rule `0412` set stays — *tools* (`dashboard.sh`, the page) come from fkit, *data*
   (`ai-agents/`) from the project — but the project must be the one the user runs `fkit board` in
   (or `--root`). The plan says how, and that a checkout's `npm run board` still works.
3. **Ship it.** `install.sh` copies the reader and the vendored page into the install share.
4. **Route it.** The launcher sends `fkit board …` to the installed reader. If `node` is not on the
   `PATH`, `fkit board` stops with a clear message naming Node; no other command changes.
5. **Docs.** `docs/board.md` *Not shipped* section, and any README / CONTRIBUTING line that says the
   board is repo-only, updated to say how a user runs it. Relative links stay valid (grep them; the
   `0484` link check is no longer in `test/` as of 2026-10-20).

⛔ **Out of scope:** the task format, the movers, `dashboard.sh`, the hooks, any write path. No change
to aiboard's page beyond copying it. No `board/` module (that is `0417`–`0423`).

## Verification steps

1. A fixture install (fresh share, from this tree) contains the reader and the vendored page — show the
   listing.
2. From a fixture project (a copy, never a real project's tree served writable — ADR-052 Q16's
   spirit), `fkit board` starts the reader on that project's `ai-agents/`, and the page loads in a
   browser or via `curl` — show the HTTP 200 and the read-only flag in its data.
3. With no aiboard checkout anywhere and no `FKIT_AIBOARD` set, it still serves the page (the vendored
   copy) — show it.
4. With `node` off the `PATH`, `fkit board` prints a message naming Node and exits non-zero; `fkit
   producer` (or another role) still launches — show both.
5. Any non-GET request is still refused, and the tree is byte-identical before and after a session
   (`git status` / a checksum, pasted).
6. `npm run board` from a checkout still works.
7. `npm test` green (the existing suite; no regression).

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- ⚠️ **Tests — ADR-057 D2.1 applies, and A3's pre-approval does not cover this task.** A3 pre-approved
  up to 6 test files under `test/board/`, one each for `0417`–`0422` only. Any new test file this task
  adds needs the **owner's OK, file by file** — the plan names it by path, and an agent's plan-review
  APPROVE is not his OK. Once shipped, the reader is shipped-script behaviour, which ADR-057 D1's
  fence covers. (The reader's old test file, `test/board-reader.test.js`, was deleted in the ADR-057
  reset — the reader has no tests today.)
- **Priority:** ⚠️ Priority P8 is append rank, NOT a merit ranking — flagged for owner confirmation.
  **On merit this belongs directly above `0417`**, because it delivers the owner's stated goal in one
  small task, waits on nothing, and A3's plan calls it step 1, *"Now"*. A spawned producer never
  re-ranks or inserts (ADR-035); since every Sprint 14 row is open, an owner-ruled re-rank can move it
  up in one edit. Nothing depends on its rank — it can be picked up in any order.
- **Knock-on of this placement (checked 2026-10-20):** none. No open task names it in `Depends on:`,
  and it names none. `0443`, `0444`, `0467` get dated notes only; their dependencies are unchanged.
- **Version skew, flagged:** the vendored page is a copy of one aiboard commit. If aiboard's page
  changes later, fkit's copy does not follow. That is the point of vendoring for the interim, and it
  ends when `0467` retires the reader; the plan only records the commit.
- **Filed 2026-10-20** via `/fkit-task-brief` by a spawned `fkit-producer` on owner ruling A3, relayed
  verbatim by `fkit-lead` — no owner channel (ADR-021). ⛔ No commit.
- ✅ **Dated note 2026-10-20 — re-ranked `P8` → `P1`, on the owner's ruling.** By a spawned `fkit-producer` (no owner channel), on owner ruling A3 — 2026-10-20, `AskUserQuestion`, `fkit lead` session, question *"Go ahead with this plan?"*, selected *"Yes, all of it (Recommended)"* (description: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*); plan text: *"1. Now, 1 small task: ship that view-only web page to every fkit user, through a new `fkit board` command. ... 2. Sprint 14, 7 tasks: rebuild aiboard inside fkit in Node ..."*. *"Now"*, and step 1 before step 2, is his ruling that `0536` runs first. The *Priority* bullet above (*"append rank … flagged for owner confirmation"*) is settled: its merit place, directly above `0417`, is applied; `0417`–`0423` each move down one. The bullet above is left byte-identical. **Knock-on: none** — no `Depends on:` line changed and nothing waits on rank.
