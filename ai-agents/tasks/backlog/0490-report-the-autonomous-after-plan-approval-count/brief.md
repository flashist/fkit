# Report the "autonomous after plan approval" count

## ID
0490

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

> ⛔ **Do not start without the owner's specific word.**
>
> ⛔ **Blocked by [`0485`](../0485-owner-reads-and-accepts-adr-053-before-any-owner-involvement-capture-is-built/brief.md)
> (B0) until ADR-053 is `accepted`.** The 2026-10-05 APPROVE of Phase B is not acceptance of the ADR.

## Context

**Where this comes from.** Brief **B4** of the Phase-B split of the gated umbrella
[`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md)
(item 4, "the countable metric"). Design:
[ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md)
D7, D9, D10, D13. **ADR-053 governs where it differs from `0482`'s `plan.md` § 3.** The "Carry into the
Phase-B briefs → B4" list in `0482`'s `worklog.md` is folded in below.

**Why the owner wants it.** A real number for a conference talk about fkit, in his definition: a task is
*autonomous after plan approval* when, after he approved its plan, the agents finished it with no
further involvement from him. The plan approval itself does not disqualify a task. **Never use "fully
automatic."**

**Input:** the fixed line `0488` writes into each done task's worklog.

## What to build

1. A read-only report — inside `/fkit-status` or as a small `fkit` report; **the plan picks which and
   says why** — that counts **done tasks only** (D9) by bucket:
   `autonomous-after-plan-approval` / `involved` / `involved-unattributed` / `unknown (<reason>)`, with
   the reason codes broken out.
2. It reads the line from **`worklog.md` and `worklog-legacy.md`** (ADR-052's converter keeps old
   worklogs word for word there). A done task with no line is `unknown`, **never autonomous**.
3. It uses **W** (D4: end of the UTC day containing now − 30 days) as the pruning boundary — **no
   stored watermark**.
4. It always says **"captured channels only"** and the scope "launcher sessions, this machine" (D13),
   and prints the date of the last captured entry of each kind (ADR-053 residual 3: payload drift).
5. Read-only: it writes nothing to any tracked file.

## Verification steps

1. Fixture done tasks — one per bucket, one with no line, one with the line only in
   `worklog-legacy.md` — give the expected counts; the no-line task is `unknown`.
2. Open and cancelled tasks are not counted.
3. The output contains "captured channels only" and the scope note; it never contains "fully automatic".
4. Last-entry-per-kind dates are printed from fixture day files.
5. `git status` shows no change after a run.
6. If built inside `/fkit-status`: its existing dashboard tests pass unchanged.
7. No absolute machine path in any changed file; tests are zero-dependency `node --test` (ADR-014).

## Notes
- **Depends on:** 0485, 0488
- **Blocks:** 0491
- **Parent:** [`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md);
  design in [ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md).
- **Not item 6.** This counts only tasks with captured data. An approximate historical count from old
  transcripts (item 6) is **not approved** and is not part of this task.
- **ADR-052 (D10):** after the board switch the line becomes a board worklog entry; the report must
  then read it there too — re-check when ADR-052's phases land.
- **Not yet scheduled:** on the Backlog board; pulling it into a sprint is the owner's call.
- **Consulted:** none at filing.
- Filed 2026-10-05 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  APPROVE of `0482` Phase B items 1–5; it decides nothing beyond that APPROVE and ADR-053.
