# Refuse reads from a foreign host name in the shipped `fkit board` reader

**Source**: `ai-agents/tasks/done/0538-refuse-reads-from-a-foreign-host-name-in-the-shipped-fkit-board-reader/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Backlog board (unranked, `—`) · task `0538` · owner `fkit-coder` · closed 2026-10-23

> ⭐ **Ingested 2026-10-23** (sync `5ccf2c2`→`185ac5e`). The task's `plan.md`, `worklog.md` and `review.md` were read as evidence, not ingested.
>
> ⚠️ **Disclosure limit (ADR-049), kept here too:** this page names the exposure **as a class only** — no payload, no reproduction steps.

## Goal
Close the **read side of DNS rebinding** on the reader every fkit user now runs. Since [[decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge]] (`0536`), `fkit board` runs `bin/fkit-board.mjs` on `127.0.0.1` for **every user**, and it checked no `Host` header — so while it ran, a hostile page whose domain name points at `127.0.0.1` could **read** the board's data (task titles, briefs, sprint boards). Binding to loopback does not stop that; only the `Host` header gives the foreign name away. Writes were never at stake (the reader already answers every non-GET with 405).

- **Where it came from:** owner ruling 2026-10-22 (`AskUserQuestion`, `fkit-lead` session, Sprint 14), answering Q2 of `0422`'s plan — *"File a follow-up task (Recommended)"*. The producer split the ruling into two briefs: **this one** (the shipped reader) and open `0539` (the Node `board/` server).
- ⚠️ **It reverses an earlier owner ruling, by a later one.** `0411`'s review ledger held this exact class as an **accepted residual, owner-ruled 2026-09-21** — a `Host` check offered and **declined**, *"do not implement one"*. Two of that entry's own re-raise conditions were met (the owner asked for hardening; the reader now ships to every user), and a second owner ruling of 2026-10-22 — *"Yes, replace it (Recommended)"* — made the supersession the owner's own, not the producer's inference. `0411`'s ledger is closed history and **was not edited**. → [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]]

## Key Changes
*(from the worklog's Build entry; plan approved 2026-10-23 via `AskUserQuestion` in the `fkit-lead` session — Q1 *"Approve, add the test (Recommended)"*, Q2 *"Keep Node's 400 (Recommended)"*; built by a spawned coder under the ADR-055 declared-approval marker)*
- **`bin/fkit-board.mjs`:** a new `hostNamesThisServer()` check runs right after the 405 method check, **before any route**. Allowed: a `Host` whose name (port stripped, case ignored) is `localhost`, an IPv4 literal, a bracketed IPv6 literal, or the host the server was started on. Anything else → **403** with a short JSON error that carries no board data and no path. The logic is the `Host` half of `0422`'s `refuseCrossSite` in `board/server/server.mjs`, diffed line by line — so `fkit board` behaves the same before and after `0444` routes it to `board/`. IP literals are allowed because rebinding needs a DNS name. One `--help` line added.
- **No `Host` at all** (owner Q2-A): HTTP/1.1 gets **Node's own 400** (before the handler runs); HTTP/1.0 gets the reader's **403**. Both refuse and carry no data; this matches `board/server`. Recorded as an accepted residual — the brief's *"no `Host` → 403"* holds for HTTP/1.0 only, by ruling, not a miss.
- **Docs:** `docs/board.md` (*What it listens on, and what it accepts*) states the rule and the no-Host answer; `CHANGELOG.md` one `Unreleased` bullet, class only.
- **Tests — owner's OK (Q1-A), per ADR-057 D2.1:** new `test/board-reader-host.test.js` (4 tests) spawns the real reader on a two-file temp tree, port 0, raw-socket requests. `CONTRIBUTING.md` *What a test may cover* gains **item 4**: the board reader, run as a process, through its HTTP answers (ADR-057 §D1 category 3's dated note, ADR-058). ⭐ **This ends the reader's "ships with no automated test" state** that `0529` and ADR-058 had left.

## Outcome
- **Verified** (Build and an independent Verify worker): same bodies and status lines as the unchanged reader under `127.0.0.1` and `localhost` on every path checked; local hosts (incl. `[::1]`, `127.0.0.2`, mixed case) → 200; foreign names and the near-miss forms the plan listed → 403 with no task title, root or user path in the body; POST / HEAD → 405 unchanged; the launcher route (`bash claude/fkit-claude.sh board`) → 200 local, 403 foreign. Red/green: the new test fails 2 of 4 on the old reader and passes 4/4 on the new one; a negative control (check removed, or moved after routing) fails the same 2. `npm test` exit 0 — **937 tests, 936 pass, 1 skipped** (the env-gated bench), 89 s Build / 78 s Verify, inside the ADR-057 D10 ≤ 2 min budget. `test:prove-red` and `test:release` skipped (nothing they cover touched).
- **Review:** stateful, round 1 **no findings**; ledger `Status: closed-out`. ⚠️ Codex's pass was **reasoning-only** (ADR-042) — its sandbox denied running a server, so it measured nothing on the change; the execution evidence is the Claude reviewer's.
- **The owner's browser check** — *"`fkit board` in a real project opens the page and the board renders"* — agents may not open a browser; the owner ran it himself from this checkout and typed *"The page looks good"* (relayed by `fkit-lead`). ⛔ That does **not** make this an owner-verified close (ADR-049); the agent-closed marker stands.
- **Out of scope (named):** the reader's IPv4-only `127.0.0.1` bind; the `board/` server's reads (`0539`, open).
- **Knock-on:** open `0467` (retire the reader) now carries a dated note — retiring it must also delete `test/board-reader-host.test.js` and `CONTRIBUTING.md`'s test-rule item 4.

## Related
- [[decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge]] — why the reader reaches every user
- [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] — D2.1: the new test file needed the owner's OK
- [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] — the disclosure limit, and why the owner's relayed check is not owner verification
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — fkit owns the board now, which lifted the old *"no fkit task"* clause
- [[tasks/ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board]] — `0536`, which shipped the reader this hardens
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — `0411`, the reader, and the 2026-09-21 residual this supersedes
- [[tasks/port-aiboard-to-node-in-board-the-adr-052-phase-2-tasks-0417-0423]] — `0422`'s write-side Host rule this copies; `0539` is its read-side sibling
- [[tasks/sprint-14-port-aiboard-to-node-adr-052-phase-2]] — the sprint it was filed during
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board its row sits on
- [[systems/install-and-self-update]] · [[systems/testing-and-verification]]
