# Refuse reads from a foreign host name in the Node board server

## ID
0539

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being filed, or on the board, is not his
> word.

**Where this comes from.** The same owner ruling as
[`0538`](../0538-refuse-reads-from-a-foreign-host-name-in-the-shipped-fkit-board-reader/brief.md):
2026-10-22, `AskUserQuestion` in the `fkit-lead` session (Sprint 14), relayed to a spawned
`fkit-producer`. Question: *"A hostile site could READ a running board (incl. today's `fkit board`).
What to do?"* Selected, verbatim: *"File a follow-up task (Recommended)"* — description he saw:
*"Small Backlog task: Host check on reads in fkit board, then board/. Knock-on: none — nothing waits on
it."* It answers Q2 of `0422`'s approved
[plan](../../done/0422-port-aiboards-web-server-and-page-to-node-with-t-022-closed-and-concurrent-writes-kept-in-order/plan.md).
This brief is the *"then board/"* half; `0538` is the shipped reader's half.

**The exposure, in plain words.** `0422` ports aiboard's web server to Node as
`board/server/server.mjs` and closes **T-022 on writes**: every POST must pass a `Host`, `Origin` and
`Content-Type` check, and a `Host` that is a DNS name gets 403 (plan §2.3). **Reads were left out** —
the plan says *"GET is **not** checked. The brief scopes T-022 to writes."* So a hostile website that
points its own domain name at `127.0.0.1` (DNS rebinding) is same-origin to the browser and, while the
board server runs, can still **read** the board through GET: task titles, contents, sprints. This
matters more once `0444` routes `fkit board` to this server and `0467` retires the reader: it becomes
what every user runs.

⚠️ **Disclosure limit.** Per
[ADR-049](../../../knowledge-base/decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md),
this class is written down in git as a class only — no payload, no reproduction steps, no working
exploit. A test that sends a non-local `Host` and expects a refusal is a check, not an exploit.

⚠️ **A deliberate departure from Python aiboard, which has no such check.** Two places must know:
- **`0423`, the phase-2 parity gate** (Sprint 14) compares the Node port against the Python reference.
  Requests that use a local `Host` (`127.0.0.1`, `localhost`, an IP literal) are unaffected, so parity
  should hold as-is; a request under any other host name now differs **on purpose**, the same way
  `0422`'s 403/415 write refusals already do. If `0423` has not closed when this task runs, the coder
  tells its owner; if it has, this task re-runs `0423`'s comparison (or the parts of it that touch the
  server) and records the result.
- **`0422`'s port record.** The departure is recorded next to `0422`'s own T-022 departures (in this
  task's worklog, and in whatever document `0422` leaves listing where the port differs from Python).

The earlier owner ruling that **declined** a `Host` check on reads (2026-09-21, an accepted residual in
`0411`'s review ledger) is superseded by the 2026-10-22 ruling — see `0538`'s *Context* for the detail.

## What to build

1. **Extend `0422`'s `Host` check to GET** (and every other read the server answers, including
   `serve --read-only`), in `board/server/server.mjs`. Reuse `0422`'s rule, do not write a second one:
   allowed is `localhost`, an IPv4 literal, a bracketed IPv6 literal, or the configured host
   (case-insensitive, port stripped); a DNS name or a missing `Host` gets **403** with `0422`'s refusal
   shape. A refused read returns no board data.
2. **Only `Host` on reads.** `Origin` and `Content-Type` stay write-only checks, as `0422` built them —
   a plain GET from the board's own page carries no `Origin`, and adding one here would break it.
3. **Tests** go into `0422`'s existing file, `test/board/server.test.js` — no new test file
   ([ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)
   D2.1). The plan confirms that adding cases there needs no further OK.
4. **Same allow rule as `0538`'s reader check**, so `fkit board` behaves the same before and after
   `0444` switches it to this server.

## Verification steps

- GETs to the page and every read API route with `Host` `127.0.0.1:<port>`, `localhost:<port>` and
  `[::1]:<port>` return 200 with bodies unchanged from before the change.
- The same GETs with a `Host` that is a DNS name other than `localhost`, and with no `Host`, return
  **403** with no board data — on a normal server and on a `--read-only` one.
- `0422`'s write-side tests (T-022 refusals, same-origin writes, concurrent writes) all still pass.
- The new cases sit in `test/board/server.test.js`; no new test file exists.
- The parity result against the Python reference is recorded per the *Context* note on `0423` — the
  only differences are refusals of non-local `Host` requests.
- `npm test` stays green and inside the ADR-057 D10 budget (≤ 2 min on an idle Mac).

## Notes
- **Depends on:** [`0422`](../../done/0422-port-aiboards-web-server-and-page-to-node-with-t-022-closed-and-concurrent-writes-kept-in-order/brief.md) (hard — `board/server/server.mjs` and its Host check do not exist until it lands)
- **Blocks:** nothing
- Knock-on: this task (Backlog board) waits on `0422` (Sprint 14). Nothing waits on this task, so no
  sprint task is held up by it.
- **Neighbour, not a dependency:** `0538` (same check, shipped reader). Either may go first.
- **Neighbour, not a dependency:** `0423` (Sprint 14) — see the parity note in *Context*. Not a
  `Depends on:` either way: `0423` does not need this check to pass, and this check does not need
  `0423`'s verdict to be built.
- **Priority, the producer's suggestion only (not a ranking).** No fkit convention sets a priority for
  security fixes. On merit this should land before `0444` routes `fkit board` to `board/`, so users
  never run a board server without the read check. The board stays unranked; a rank comes only when the
  owner pulls it into a sprint.
- The split from `0538` is the producer's call under `/fkit-task-brief`'s decomposition rule (this half
  cannot start until `0422` lands; `0538` can start now). The owner can merge them back.
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
  *Owner-ruled 2026-09-21*) is **superseded** by this ruling; `0538` and `0539` stand. `0538`'s *Context*
  reading (*"The 2026-10-22 ruling is the newer one and governs"*), and this brief's *"superseded"* line, are now the owner's own ruling,
  not the producer's inference. `0411`'s ledger is closed history and is **not** edited. No status,
  sprint, rank or `Depends on:` line changed. **Knock-on: none.**
