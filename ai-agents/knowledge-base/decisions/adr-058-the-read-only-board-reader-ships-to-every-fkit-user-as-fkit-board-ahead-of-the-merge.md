# ADR-058: The read-only board reader ships to every fkit user as `fkit board`, ahead of the merge

- **Status:** **accepted** — owner ruling 2026-10-20, via `AskUserQuestion`, `fkit lead` session,
  relayed verbatim by `fkit-lead` (the architect did not hear it first-hand — ADR-021). Quoted in full
  in *§The owner's ruling*.
- **Date:** 2026-10-20
- **Corrections:** 2026-10-20 — a dated note sits below the **Implemented by** bullet (`0536`'s row
  rank). Marker legend: **⚠️ = a fact that drifted** (the decision is untouched); **⛔ = a decision that
  was overturned** (do not follow it). No existing line of this ADR was edited; the note is an append,
  and the Status stays `accepted`.
- **Deciders:** owner (Mark Dolbyrev). Recorded by `fkit-architect`, spawned by `fkit-lead`, no owner
  channel. The option set is the architect's earlier consult to `fkit-lead` (its option A, items
  D1–D4), which the owner approved.
- **Implemented by:** task `0536` (Sprint 14, row `P8`) — cited by ID because its folder moves when
  it closes.
  > ⚠️ **Dated note 2026-10-20 — `0536` is now Sprint 14 row `P1`, not `P8`** (verified against
  > `ai-agents/sprints/sprint-14.md` 2026-10-20). The producer re-ranked it `P8` → `P1` (and `0417`–`0423`
  > to `P2`–`P8`) on owner ruling A3 — see that board's dated note *"ranks now owner-ruled: `0536` is
  > `P1`"*. A drifted pointer only; no decision here changes. The bullet above is left byte-identical.
- **Amends:** [ADR-052](adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md)
  — the reader no longer stays repo-local until it retires; phase 8 now also un-ships it (a dated ⚠️
  note sits below ADR-052 §D9). **Also makes wrong, for `0536` to fix:** `docs/board.md`'s title
  *"The web board (repo-local)"* and its *"Not shipped"* section (*"Repo-local by construction:
  `install.sh` copies `claude/` only"*); the code comment in `bin/fkit-board.mjs` above
  `resolveAiboard` (*"⛔ NOT vendored into fkit"*), per the code-comment rule.
- **Unchanged, stated so nobody assumes otherwise:** ADR-052 Q16 / D6 (no writable board on real
  project data until the fkit pilot); [ADR-049](adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md)
  D5 (the board is served read-only until the pilot); [ADR-051](adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md)
  D1 (one store — fkit's `ai-agents/` tree stays it); ADR-052 D9's phases and gates (this starts no
  phase); [ADR-057](adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) D2.1 (no new test file
  without the owner's OK).

> **What this ADR decides, in one line:** today's read-only web board (`bin/fkit-board.mjs`) ships to
> every fkit user now, as `fkit board`, with aiboard's page copied into fkit — view only, Node needed
> for that one command — until the built-in board (ADR-052) takes the command over.

## The owner's ruling (verbatim)

2026-10-20, `AskUserQuestion`, `fkit lead` session. Question as shown: *"Go ahead with this plan?"*
Selected option text, verbatim: *"Yes, all of it (Recommended)"* — description he saw: *"Ship the
view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*

The plan `fkit-lead` put to him in chat just before, as recorded on the
[Sprint 14 board](../../sprints/done/sprint-14.md)'s A3 row (`fkit-lead`'s own elision kept):

> *"1. Now, 1 small task: ship that view-only web page to every fkit user, through a new `fkit board`
> command. This gets your "everyone has the board" goal in one task instead of 44. It needs Node, but
> only for this one command. 2. Sprint 14, 7 tasks: rebuild aiboard inside fkit in Node, copied
> exactly from the fixed Python version. 3. Later steps, about 37 tasks: teach the board fkit's task
> format and hook it into fkit's tools. After that, every user gets the board with editing. Each step
> still comes to you first, as a simple yes/no. Saying yes also allows two things behind the scenes:
> - The board's code gets automated tests. One test file per task, up to 6, pre-approved now, so you
> won't be asked about each file. - The architect and producer write down your OK. I send aiboard-lead
> 4 small cleanups: ... Knock-on: the new task in step 1 goes into Sprint 14 on its own, with nothing
> waiting on it. No other task changes its dependencies."*

Item 1 is this ADR. Item 2's test pre-approval is recorded in ADR-057 (dated note, 2026-10-20). ⛔
Item 3's *"Each step still comes to you first"* stands: this ruling is **not** his word for ADR-052
phases 3 and later.

## Context

- **The reader exists and works, but only in fkit's own checkout.** `bin/fkit-board.mjs` serves
  aiboard's unmodified page over a project's unmodified `ai-agents/` tree, GET only, on `127.0.0.1`,
  writing nothing (`docs/board.md`, *"What it listens on, and what it accepts"* and *"What it writes:
  nothing"*). `install.sh` ships only `claude/` (*"Installing fkit resources → $SHARE/claude"*), so no
  fkit user gets it.
- **Its page is not in fkit.** The reader looks for aiboard's `web/index.html` via `--aiboard`, then
  `FKIT_AIBOARD`, then a sibling aiboard checkout (`bin/fkit-board.mjs`, `resolveAiboard`). An
  ordinary user has none of the three, so shipping the reader alone would give them an error.
- **Its other tool already ships.** The reader runs `dashboard.sh select-active`, found under
  `claude/skills/fkit-status/` next to the reader's own root (`findDashboard`), and reads data from
  `--root` (*"TOOLS come from fkit's own checkout, DATA comes from `--root`"*). `claude/` is in the
  install share, so this rule holds there too.
- **The full board is far off.** Under ADR-052 the built-in board reaches users at phase 5 (`0443`
  ships `board/`, `0444` routes `fkit board` to it) — after phase 2 (Sprint 14, 7 tasks) and about 37
  more tasks. The owner wants every user to have a board now.
- **Why the page may now be copied into fkit.** The code comment that forbids it gives as its reason
  *"the one-way dependency the owner set (fkit adapts to aiboard)"* — a rule from when aiboard was a
  separate project. ADR-052 R7 ended that: aiboard merges into fkit and its repository is archived
  (Q12). Copying its page into fkit is the merge's direction, not against it.
- **aiboard's licence allows the copy:** MIT, *"Copyright (c) 2026 Mark Dolbyrev"* — the same owner
  (aiboard's `LICENSE`, read 2026-10-20).

## Decision

1. **Ship the reader.** `install.sh` installs `bin/fkit-board.mjs` into the install share for every
   fkit user. `bin/board-narrow.mjs` is not needed by the reader and does not ship.
2. **Copy aiboard's page into fkit.** aiboard's `web/index.html`, byte-for-byte from one named aiboard
   commit, with its MIT notice, stored in fkit and shipped beside the reader. It becomes the reader's
   default page. `--aiboard` and `FKIT_AIBOARD` still win when given, and an explicit path that is not
   a readable file is still an error, never a fall-through.
3. **Route `fkit board` from the launcher.** `claude/fkit-claude.sh` hands `fkit board …` to the
   installed reader **straight** — no update check, no menu (the shape ADR-052 D7 sets for the later
   module) — serving the `ai-agents/` tree of the project the user is in. Every other `fkit` command
   behaves exactly as before; in particular, what the launcher hands to `claude`, and whether it
   `exec`s, does not change.
4. **Node only for this command.** Without `node`, `fkit board` stops with a clear message naming Node
   and a non-zero exit. Install and every other `fkit` command keep working without Node. (Node as a
   hard requirement stays ADR-052 D7 / task `0443`.)
5. **Read-only, unchanged.** No write path is added, in any mode, behind any flag. ⛔ **This does NOT
   deliver editing.** Editing arrives with the built-in board and its owner door (ADR-052 D6, phases
   3–6), and ADR-052 Q16 forbids a writable board on real project data until the fkit pilot.
6. **It is interim, and the board takes it over.** `0444` re-points `fkit board` from the reader to
   `board/`. `0467` (phase 8) retires the reader — which now also means removing it and the copied page
   from the install and the launcher, if `0444` has not already. The producer adds these to those
   briefs.

How each point is built — where the copied page lives, which aiboard commit it comes from, how the
launcher finds the project root — is `0536`'s plan, for the owner to approve.

## Options considered

- **A — ship the read-only reader now (chosen).** One small task; every user sees their board today;
  the code already exists and is read-only by construction.
- **B — wait for the full merge.** Rejected: users get nothing until ADR-052 phase 5, about 44 tasks
  away.
- **C — ship the Python aiboard to users.** Rejected: it adds Python to every install; it reads its own
  store format, not fkit's markdown tree, so using it means converting or copying the tasks — a second
  store, which ADR-051 D1 forbids; its writable server is the case ADR-052 Q16 rules out; and it is
  about to be archived (Q12).

## Consequences

- **Positive:** every fkit user gets a clickable view of their tasks and sprints now; nothing new is
  stored; no new dependency beyond Node, and only for this command.
- **Negative / costs:**
  - **Two copies of aiboard's page for a while** — the copied one, and the one `0422` ports into
    `board/`. Until `0444`/`0467`, a fix to one does not reach the other. Whether `0422` reuses the
    copy is that task's plan, not this ADR's.
  - **The reader ships with no automated test.** Task `0529` deleted its four tests under ADR-057 (they
    were category 3, repo-only tooling). Once shipped, the reader is a shipped script, inside ADR-057
    D1's fence — but **no test file for it is pre-approved**: the owner's pre-approval covers only
    `test/board/`, one file each for `0417`–`0422`. A new test file for the reader or the route goes to
    the owner (ADR-057 D2.1).
  - One more launcher route to keep and later swap.
  - Users may expect to edit from the page. They cannot (point 5); the page must not suggest otherwise.
  - The reader reads only today's markdown format; that holds until a project is converted, and
    conversion (phase 6) comes after `0444` takes the command over (phase 5).
- **Not ruled here (open):** whether an agent may run `fkit board`. ADR-052 D6 says agents may not
  start the board's page; for this read-only server it is not ruled. It is a blocking server, so an
  agent running it would hang its own turn.
- **Residual risks / "re-raise only if":**
  - the reader fails on a real consuming project's tree in a way the owner sees;
  - the copied page and `board/`'s page drift and a user is hurt by it;
  - users without Node are blocked from something other than `fkit board`.
  - ⛔ **Do not re-raise** making this reader writable — editing is the built-in board's job (ADR-052
    D6, Q16). **Do not re-raise** "a separate project must not be copied into fkit" — ADR-052 R7.

## Related

- [ADR-052](adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md)
  — D1 (`fkit board`, Q10), D6, D7, D9 phase 5 and phase 8; its dated ⚠️ note below §D9 points here.
- [ADR-051](adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md)
  D1, D2 (the reader as the interim).
- [ADR-057](adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) D1, D2.1 and its 2026-10-20
  dated notes (the board-test pre-approval).
- `docs/board.md`; `bin/fkit-board.mjs`; `install.sh`; `claude/fkit-claude.sh`.
- Tasks `0536` (this), `0422`, `0443`, `0444`, `0467` — cited by ID because their folders move.
- **Wiki:** fkit-wiki should ingest this ADR and re-ingest ADR-052 and ADR-057; the architect writes
  nothing under `ai-agents/wiki-vault/`.
