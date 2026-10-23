# Refuse reads from a foreign host name in the shipped `fkit board` reader

## ID
0538

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being filed, or on the board, is not his
> word.

**Where this comes from.** Owner ruling, 2026-10-22, `AskUserQuestion` in the `fkit-lead` session
(Sprint 14), relayed to a spawned `fkit-producer`. Question: *"A hostile site could READ a running board
(incl. today's `fkit board`). What to do?"* Selected, verbatim: *"File a follow-up task (Recommended)"*
— description he saw: *"Small Backlog task: Host check on reads in fkit board, then board/. Knock-on:
none — nothing waits on it."* It answers Q2 of `0422`'s approved
[plan](../../done/0422-port-aiboards-web-server-and-page-to-node-with-t-022-closed-and-concurrent-writes-kept-in-order/plan.md)
(§2.3 and *Q2*). The ruling covers two servers; the producer split it into two briefs because each
ships on its own: **this one** (the shipped reader, fixable now) and
[`0539`](../../backlog/0539-refuse-reads-from-a-foreign-host-name-in-the-node-board-server/brief.md) (the Node
board server, which does not exist until `0422` lands).

**The exposure, in plain words.** `fkit board` runs `bin/fkit-board.mjs`, a small web server on
`127.0.0.1` that serves the project's tasks and sprints over GET. Since `0536` /
[ADR-058](../../../knowledge-base/decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge.md)
it ships to **every fkit user**. It checks no `Host` header. A hostile website can point its own domain
name at `127.0.0.1` (DNS rebinding); the browser then treats that site and the local board as the same
origin, so while the board is running, a page the user has open can read the board's data — task
titles, briefs, sprint boards. Binding to loopback does not stop it; only the `Host` header gives the
foreign name away. Writes are not at stake here: the reader refuses every non-GET method already.

⚠️ **Disclosure limit.** Per
[ADR-049](../../../knowledge-base/decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md),
this class is written down in git as a class only — no payload, no reproduction steps, no working
exploit. That binds this brief, the plan, the worklog and the review ledger. A test that sends a
non-local `Host` and expects a refusal is a check, not an exploit, and is fine.

⚠️ **This reverses an earlier owner ruling — say so, do not trip on it.** `0411`'s review ledger
records this exact class as an **accepted residual, owner-ruled 2026-09-21**: *"A `Host` check was
offered to the owner and **declined** — do not implement one"*
([`0411` review.md, *Accepted residuals*](../../done/0411-make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads/review.md)).
That entry named its own re-raise conditions, and two are now met: **the owner asks for hardening**
(the 2026-10-22 ruling above) and **a second human enters the picture** (the reader now ships to every
user). The 2026-10-22 ruling is the newer one and governs. Its *"⛔ no fkit task may be filed for it"*
clause rested on ADR-051 D7, which
[ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md)
superseded (fkit now owns the board). `0411`'s ledger is closed history and is **not** edited by this
task.

**Neighbours.**
- [`0539`](../../backlog/0539-refuse-reads-from-a-foreign-host-name-in-the-node-board-server/brief.md) — the same
  check on the Node board server. Use the same allow rule in both, so `fkit board` behaves the same
  before and after `0444` routes it to `board/`.
- [`0467`](../../backlog/0467-retire-the-read-only-board-reader/brief.md) (Backlog, phase 8) retires this reader.
  Until then it is what every user runs, so this fix is worth having even though the reader is
  temporary.

## What to build

1. **A `Host` check on every request the reader serves**, in `bin/fkit-board.mjs`, before any route is
   matched:
   - **Allowed:** a `Host` whose hostname (port stripped, case ignored) is `localhost`, an IPv4
     literal, a bracketed IPv6 literal, or the host the server was started on.
   - **Refused:** any other name, and a missing `Host`. Refuse with **403** and a short message that
     names no filesystem path (the handler's existing rule for errors). The board data is never in a
     refused response.
   - Same rule as `0422`'s write-side Host check (its plan §2.3, item 1) so the two servers agree; IP
     literals are safe to allow because rebinding needs a DNS name.
2. **`fkit board` still works as users run it today:** the URL the launcher prints/opens, both
   `127.0.0.1:<port>` and `localhost:<port>`, the page and all its `/api/*` reads, `--port` and
   `--root`.
3. **Tell users.** Update whatever user-facing text states what the reader listens on and serves (the
   reader's README / `--help`, as the coder finds them) with one line: requests under any other host
   name are refused.
4. **Tests — ask first.** The reader has **no test file**: `0529` deleted its earlier ones, and per
   [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)
   D2.1 (and its ADR-058 note under D1 category 3) a new test file for it needs the owner's OK. The plan
   asks for that OK at plan approval, naming the file. If he declines, the proof is the manual check
   below, recorded in the worklog.

## Verification steps

- A GET to `/`, `/api/board`, `/api/check`, one `/api/tasks/<id>` and one `/api/sprints/<id>` with
  `Host: 127.0.0.1:<port>` and with `Host: localhost:<port>` returns 200 and the same bodies as before
  the change (compare against the pre-change reader on the same tree).
- The same requests with an IPv6-literal `Host` (`[::1]:<port>`) are allowed.
- The same requests with a `Host` that is a DNS name other than `localhost`, and with no `Host` at all,
  return **403**; the body contains no task data and no filesystem path.
- Non-GET requests still return the existing 405, unchanged.
- `fkit board` in a real project opens the page in the browser and the board renders.
- `npm test` stays green and inside the ADR-057 D10 budget (≤ 2 min on an idle Mac).
- The user-facing listen/serve statement mentions the refusal.

## Notes
- **Depends on:** nothing
- **Blocks:** nothing
- Knock-on of filing: none — no open task waits on this one, and it waits on nothing.
- **Priority, the producer's suggestion only (not a ranking).** No fkit convention sets a priority for
  security fixes. On merit this is worth pulling ahead of `0539`: the exposure is live today for every
  user who runs `fkit board`, while `0539`'s server is not shipped yet. The board stays unranked; a rank
  comes only when the owner pulls it into a sprint.
- **Python parity:** none needed here — this reader is fkit's own, not a port of aiboard. (The parity
  question belongs to `0539`.)
- Owner ruling quoted above: 2026-10-22, `fkit-lead` session, relayed to a spawned `fkit-producer`
  (no owner channel). The split into two briefs is the producer's call under `/fkit-task-brief`'s
  decomposition rule; the owner can merge them back.
- ⚠️ **Dated note 2026-10-22 — owner ruling: the 2026-09-21 Host-check residual is superseded.**
  Recorded by a spawned `fkit-producer` (no owner channel), relayed verbatim by `fkit-lead`. Owner
  ruling, 2026-10-22, via `AskUserQuestion` in the `fkit-lead` session. Question, verbatim: *"On
  2026-09-21 you declined a host check for the board reader. Does today's choice replace that, now the
  reader ships to every user?"* Selected option text, verbatim (a pre-written option, not his own typed
  words): *"Yes, replace it (Recommended)"* — description he saw: *"Keep 0538 and 0539; today's choice
  governs; the old ruling is superseded."* Before answering he was shown that the 2026-09-21 accepted
  residual said a `Host` check was declined (*"do not implement one"*, no fkit task to be filed) and that
  two of its re-raise conditions are now met (the owner asked for hardening; the reader now ships to
  every user). **Effect:** the *Accepted residuals* entry *"No `Host`/`Origin` validation — a
  read-exposure class on the loopback listener"* in [`0411`'s review ledger](../../done/0411-make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads/review.md) (lines 80–96,
  *Owner-ruled 2026-09-21*) is **superseded** by this ruling; `0538` and `0539` stand. The *Context*
  section's *"The 2026-10-22 ruling is the newer one and governs"* reading is now the owner's own ruling,
  not the producer's inference. `0411`'s ledger is closed history and is **not** edited. No status,
  sprint, rank or `Depends on:` line changed. **Knock-on: none.**
- **Dated note 2026-10-23 — closed by a spawned `fkit-producer` (agent-closed, ADR-033 §5).** Closed at
  `fkit-lead`'s request; no owner channel in this run, so the marker stands. Evidence relayed by
  `fkit-lead`: Build done (red/green of the new test), Verify pass (`npm test` 936 pass / 1 skip,
  78 s), stateful review "✅ Ready to merge" with no findings, `review.md` Status `closed-out`.
  **Dated fact, 2026-10-23:** the owner checked the browser step of *Verification steps* himself —
  after running `bash claude/fkit-claude.sh board` from this checkout he typed, verbatim, in the
  `fkit-lead` session: *"The page looks good"*. Relayed by `fkit-lead`; this producer did not see it
  first-hand. It does **not** turn this into an owner-verified close (ADR-049: no channel supplies a
  verified human principal); only the owner running `/fkit-task-done` himself can clear the marker.
