# Retire the read-only board reader

## ID
0467

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

**Phase 8 — archive aiboard** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **After the fkit pilot** (Q12). The archive is **read-only, not deleted**; plain archive, no history import (ADR-052 D9 phase 8).

D9 phase 8: retire `bin/fkit-board.mjs` (733 lines), `bin/board-narrow.mjs` (458) and their tests (`test/board-reader.test.js` also pins `sprint-11.md` by name). ADR-051 D2 (the reader as interim) ends here.

⚠️ **Open point for pickup, not ruled:** the reader's `--root` flag (`0412`) serves **other** projects' trees; phase 8 may run while phase 7 is still converting them. Retiring it before the last conversion removes the owner's board view for unconverted projects. The owner decides whether to wait for `0463`.

## What to build

1. Delete the two scripts and their tests; remove every reference.

## Verification steps

1. No file references the retired scripts (grep, pasted); full suite green.

## Notes

- **Depends on:** [`0459`](../0459-pilot-run-real-sprints-on-the-converted-fkit-and-ask-the-owner-whether-it-works-the-phase-6-gate/brief.md) (phase 6 passed). Hard.
- **Blocks:** nothing
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 8):** Phase 6 passed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
- **Note, 2026-10-14 — links to `docs/board.md` will fail a new check.** Sprint 10 task `0484` adds
  `test/top-level-doc-links.test.js` (in `npm test` and `npm run test:docs`). It checks every relative
  link in `README.md`, `CONTRIBUTING.md`, `RELEASING.md`, `CHANGELOG.md`, `claude/README.md`,
  `CLAUDE.md`, `AGENTS.md` and every `.md` under `docs/`, with **no exemption list**. So if this task
  deletes `docs/board.md` (the page that documents the reader being retired), it must also remove or
  re-point every link to it, or that check goes red. Links found 2026-10-14:
  - `README.md` — the line ending ``Details: [`docs/board.md`](docs/board.md).``
  - `CONTRIBUTING.md` — `` `npm run board` — see [`docs/board.md`](docs/board.md) ``. Its repository
    layout tree also lists `board.md` as *"the repo-local web board, in detail"* — plain text, not a
    link, so the check will not catch it; it goes stale all the same.
  - `CHANGELOG.md`, released `v0.3.2` entry — *"The web-board details moved to"* followed by
    ``[`docs/board.md`](docs/board.md)``. This is release history, so the plan decides how to handle
    it (for example: unlink the path, or point it at the page as it stood in that release); the owner
    approves. The check fails on it too.

  Re-grep at pickup (`grep -rn "docs/board" .`, skipping `.git`): this list can drift. Applies only
  once `0484` is closed as Done; if `0484` is cancelled or reverted, ignore it. Soft note — it adds no
  dependency link (`0484` sits in Sprint 10, ahead of this Backlog task). Source: `0484`'s worklog,
  *"For the producer (not acted on)"*, which names `README.md` and `CONTRIBUTING.md`; the
  `CHANGELOG.md` link was found by this note's grep. Added by a spawned `fkit-producer` for
  `fkit-lead` (`/fkit-sprint-ship-loop`) — no owner channel (ADR-021).
- ⚠️ **Dated note 2026-10-20 — an interim task ships the read-only reader first; this task takes over from it.** By a spawned `fkit-producer` (no owner channel), on owner ruling A3 (2026-10-20, `AskUserQuestion` in the `fkit-lead` session, selected option *"Yes, all of it (Recommended)"* — quoted in full on the [Sprint 14](../../../sprints/done/sprint-14.md) board). [`0536`](../../done/0536-ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board/brief.md) (Sprint 14) ships today's read-only reader, `bin/fkit-board.mjs`, plus a vendored copy of aiboard's page, to every fkit user and routes `fkit board` to it, Node required for that command only. So when this task runs, the reader is **shipped**, not repo-only: retiring it also means removing it and the vendored page from `install.sh` and the install share, and making sure `fkit board` by then points at the `board/` module (`0444`), so no user loses the command. ⚠️ This makes the *open point* above (the `--root` flag and unconverted projects) wider: users of every installed project, not just the owner, may rely on the reader. A3 is **not** the owner's word to start this task (phase 8). `Depends on:` / `Blocks:` lines above unchanged — no placement or dependency change; no knock-on.
- ⚠️ **Dated note 2026-10-23 — retiring the reader also removes 0538's test and its test-rule item.** By a spawned `fkit-producer` (no owner channel), for `fkit-lead`. [`0538`](../../done/0538-refuse-reads-from-a-foreign-host-name-in-the-shipped-fkit-board-reader/brief.md) added a Host check to `bin/fkit-board.mjs` and, on owner ruling 2026-10-23 (`AskUserQuestion`, `fkit-lead` session, selected option *"Approve, add the test (Recommended)"*), a test file and a test rule for it. When this task retires the reader it must also: (1) delete `test/board-reader-host.test.js`; (2) remove item 4 — *"the board reader `bin/fkit-board.mjs`, which ships as `fkit board` … run as a process, through its HTTP answers"* — from the *What a test may cover* list in `CONTRIBUTING.md`'s test rules, and end item 3 with a full stop again (0538 changed it to a semicolon). Re-grep at pickup (`grep -rn "fkit-board.mjs\|board-reader-host" .`, skipping `.git`) — other mentions may exist. Scope, status, rank and the `Depends on:` / `Blocks:` lines above are unchanged. **Knock-on: none.**
