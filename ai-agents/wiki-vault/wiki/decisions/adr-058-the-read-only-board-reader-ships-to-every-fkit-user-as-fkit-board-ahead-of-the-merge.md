# ADR-058: The read-only board reader ships to every fkit user as `fkit board`, ahead of the merge

**Date**: 2026-10-20
**Status**: accepted *(owner ruling 2026-10-20, relayed by `fkit-lead`; one ⚠️ dated note — `0536`'s row rank `P8` → `P1`; no decision overturned)*

**Amends**: [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — the reader no longer stays repo-local until it retires; phase 8 now also un-ships it (a ⚠️ note sits below ADR-052 §D9). **Unchanged, stated so nobody assumes otherwise**: ADR-052 Q16 / D6 (no writable board on real project data until the fkit pilot); [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] D5 (served read-only until the pilot); [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] D1 (one store); ADR-052 D9's phases and gates; [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] D2.1.

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`) from `ai-agents/knowledge-base/decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge.md`. Implemented by task `0536` — [[tasks/ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board]].

## Context
- **The owner's ruling (A3), 2026-10-20**, `AskUserQuestion`, question *"Go ahead with this plan?"*, selected *"Yes, all of it (Recommended)"* — *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."* Step 1 of the plan the lead showed him: *"Now, 1 small task: ship that view-only web page to every fkit user, through a new `fkit board` command. This gets your "everyone has the board" goal in one task instead of 44. It needs Node, but only for this one command."* ⛔ The plan's *"Each step still comes to you first"* stands — this is **not** his word for ADR-052 phases 3+.
- **The reader existed but only in fkit's own checkout.** `bin/fkit-board.mjs` serves aiboard's unmodified page over a project's `ai-agents/` tree, GET only, on `127.0.0.1`, writing nothing. `install.sh` shipped only `claude/`, and the page was read from an aiboard checkout a normal user does not have.
- **Why the page may now be copied in:** the code comment that forbade it rested on *"fkit adapts to aiboard"* — a rule from when aiboard was separate. ADR-052 R7 ended that (aiboard merges in; its repository is archived, Q12). aiboard's licence is MIT, same owner.
- **The full board is far off:** under ADR-052 it reaches users at phase 5 (`0443`, `0444`), about 44 tasks away.

## Decision
1. **Ship the reader** — `install.sh` installs `bin/fkit-board.mjs` into the install share. `bin/board-narrow.mjs` does not ship.
2. **Copy aiboard's page into fkit**, byte-for-byte from one named aiboard commit, with its MIT notice; it becomes the default page. `--aiboard` / `FKIT_AIBOARD` still win; an explicit path that is not a readable file is still an error.
3. **Route `fkit board` from the launcher** straight to the installed reader — no update check, no menu — serving the `ai-agents/` tree of the project the user is in. What the launcher hands to `claude`, and whether it `exec`s, does not change.
4. **Node only for this command** — without `node`, `fkit board` stops with a clear message and a non-zero exit; install and every other command work without Node.
5. **Read-only, unchanged.** ⛔ **This does NOT deliver editing** — that is the built-in board's job (ADR-052 D6, phases 3–6; Q16).
6. **Interim.** `0444` re-points `fkit board` to `board/`; `0467` (phase 8) retires the reader, now also removing it and the copied page from the install and the launcher.

Options rejected: **B** wait for the full merge (users get nothing for ~44 tasks); **C** ship the Python aiboard (adds Python; a second store, which ADR-051 D1 forbids; its writable server is Q16's forbidden case; about to be archived).

## Consequences
- **Positive:** every fkit user gets a clickable view of their tasks and sprints now; nothing new is stored.
- **Costs:** **two copies of aiboard's page** for a while (the copy, and the one `0422` ports into `board/`) — a fix to one does not reach the other until `0444`/`0467`; ⚠️ **the reader ships with no automated test** — its four tests were deleted by `0529` as category 3, and a new test file needs the owner's OK; one more launcher route to keep and swap; users may expect to edit from the page — they cannot.
  > ✅ *Dated note 2026-10-23 (sync `5ccf2c2`→`185ac5e`; the ADR source is unchanged and the line above left byte-identical):* the *"no automated test"* cost is **now discharged for the reader** — `0538` added `test/board-reader-host.test.js` on the owner's D2.1 OK, with a `Host` check on every read (foreign host names → 403). The launcher's `board` route still has no test. → [[tasks/refuse-reads-from-a-foreign-host-name-in-the-shipped-fkit-board-reader]]
- **⚠️ Not ruled (open):** whether an agent may run `fkit board`. It is a blocking server, so an agent running it would hang its own turn.
- **Re-raise only if:** the reader fails on a real consuming project's tree; the two pages drift and it hurts a user; users without Node are blocked from anything but `fkit board`. ⛔ **Do not re-raise** making the reader writable, or "a separate project must not be copied into fkit".

## Related
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — amended (D9 phase 8)
- [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] — D1, D2: the reader as the interim
- [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] — D5, unchanged
- [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] — D1/D2.1 and its 2026-10-20 notes
- [[tasks/ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board]] — `0536`, the implementation
- [[tasks/sprint-14-port-aiboard-to-node-adr-052-phase-2]] — the board A3 placed it on
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — `0411`, the reader it ships
- [[systems/install-and-self-update]]
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`, closing one-way links):* [[systems/fkit]] · [[systems/knowledge-base-structure]] · [[tasks/port-aiboard-to-node-in-board-the-adr-052-phase-2-tasks-0417-0423]] · [[tasks/stop-the-board-reader-failing-when-a-task-folder-moves-between-its-check-and-its-read]]
- *Added 2026-10-23 (sync `5ccf2c2`→`185ac5e`):* [[tasks/refuse-reads-from-a-foreign-host-name-in-the-shipped-fkit-board-reader]] — `0538`: the shipped reader now refuses (403) any `Host` that is not `localhost`, an IP literal or its own host, and has its first test file since `0529` (owner's OK)
