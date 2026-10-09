# Build the owner-involvement summarizer that writes the fixed per-task worklog line

## ID
0488

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

**Where this comes from.** Brief **B3** of the Phase-B split of the gated umbrella
[`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md)
(the logic half of item 2 "linking" and the writer half of item 3 "the per-task line"). Design:
[ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md)
D4 (read rule), D5–D8. **ADR-053 governs where it differs from `0482`'s `plan.md` § 3** — notably,
`plan.md`'s "errors only lower the autonomy count" is now qualified by ADR-053's eight named residual
risks. The "Carry into the Phase-B briefs → B3" list in `0482`'s `worklog.md` is folded in below.

**Owner rulings that bound this task** (2026-10-05, `AskUserQuestion`, `fkit-lead` session):
**OQ1** no text; **OQ2** unattributed owner messages count, shown separately; **OQ3** every typed
message counts (the line says "typed messages", not "decisions"); **OQ4** 30 days; **R11 "Yes, mark
unknown"** (damaged lines → `unknown (log-corrupt)`); **R12 "Yes, count it"** (`expanded`). And the
owner's metric definition (2026-10-02): a task is *autonomous after plan approval* when, after he
approved its plan, the agents finished it with no further involvement from him. Never say "fully
automatic".

**Inputs:** the local day files `0486` writes; the `task:` / `[task NNNN]` conventions `0487` adds.

## What to build

A shipped, zero-dependency node script (from `claude/`), with a **pure, fixture-tested** core:

1. **Read rule** (D4): compute **W = the end of the UTC day containing (now − 30 days)**; ignore every
   entry before W, on disk or not. Run the D4 prune (same rules as `0486`) on every run.
2. **Malformed lines** (D3): a line that does not parse fully to the closed format (including a final
   line with no newline) counts toward no total; any task that would otherwise be autonomous and whose
   window overlaps that file's UTC day reads **`unknown (log-corrupt)`**. Diagnostics count malformed
   lines.
3. **Binding and attribution** (D5): a session is bound to task X by `command`, `bind` or `plan-write`
   naming X. Owner entries are `asked`, `answered`, `typed`, `command`, `expanded`. Rule (1): a tagged
   entry whose task is bound in S → that task only; **not bound in S → that task AND as if untagged**
   (rule 2, or rule 3 when S has no bound task); a `command` task id is a bind, not a tag. Rule (2): no
   tag → every task bound in S. Rule (3): no tag, nothing bound → **unattributed**, counted against
   every task whose window covers t, reported separately. **Window = the task's anchor → this
   summarizer run for it.**
4. **`unknown-session`** (D5): never binds, never satisfies liveness; its tagged owner entries count
   for the tagged task **and** as unattributed, untagged ones as unattributed only; a `plan-write` there
   still sets the anchor; a task whose only binding session is `unknown-session` → `unknown`.
5. **`expanded`** (D2): counts as involvement; never binds; never proves liveness; never in the typed
   count.
6. **Anchor** (D6): the first `plan-write` for the task. No anchor → `unknown (no-anchor)`. An anchor
   before W → `unknown (log-pruned)`.
7. **Classification** (D7): `autonomous-after-plan-approval` only with an anchor, liveness (the binding
   session holds ≥ 1 `typed` or `command` entry), W not later than the anchor, and zero attributed and
   zero unattributed owner entries after the anchor; `involved`; `involved-unattributed`;
   `unknown (<reason>)`.
8. **Counts** (D8): questions asked and answered **per question**; **typed messages = `typed` entries
   only** (a slash command counts once); attributed and unattributed shown separately.
9. **The line** (D8): the script **regenerates exactly one** fixed-wording line in the task's
   `worklog.md`, next to the decision log (never replacing it) — replacing its own earlier line, never
   adding a second. It holds the counts, the classification with reason code, and the scope
   "captured: launcher sessions, this machine". **No owner text; never the words "approved" or
   "verified"** (ADR-049, D12). Fix the exact wording in this task so it can be counted by `0490`.
   No capture data → `unknown (<reason>)`, never 0.
10. The script writes the line itself — no model retypes it (ADR-053 Options considered). It is safe
    to run early: an early run writes a provisional line the close overwrites (`0489` wires the close).

## Verification steps

1. **Worked examples (`0482` test 10):** a fixture task with plan approval only → `autonomous-after-plan-approval`;
   one with a later question → `involved`; one with no data → `unknown (<reason>)`, never 0.
2. A relayed question whose task is **not** bound in the lead session still makes that task `involved`.
3. A slash command counts as **one** typed message.
4. An anchor before W → `unknown (log-pruned)`.
5. `unknown-session`: never binds; never satisfies liveness; tagged entry counts for its task and as
   unattributed; `plan-write` there still anchors; a task bound only there → `unknown`.
6. A malformed line → no total; a would-be-autonomous task whose window overlaps that day →
   `unknown (log-corrupt)`; diagnostics count it.
7. `expanded`: involvement yes; bind no; liveness no; typed count no.
8. Unattributed entries in a task's window → `involved-unattributed`, counted separately.
9. **No owner text in the line (OQ1 / Ruling 1):** fixtures whose day files hold the maximum the
   closed format allows produce a line made only of fixed words, counts, reason codes and the scope
   note; a grep for "approved" / "verified" / "fully automatic" in the line finds nothing.
10. Re-running on the same worklog leaves exactly one line (idempotent).
11. No absolute machine path in any changed file; tests are zero-dependency `node --test` (ADR-014).

## Notes
- **Depends on:** 0485, 0486, 0487
- **Blocks:** 0489, 0490, 0491
- **Parent:** [`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md);
  design in [ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md).
- **ADR-052 survival** (D10): after the board switch the same fixed text becomes a board worklog entry
  written `--by producer`; a dedicated board field is its own decision. Keep the line's text
  board-agnostic.
- **`0121` (observer)** reads the same log with the same W rule; it must not build a second log (D11).
- **Not yet scheduled:** on the Backlog board; pulling it into a sprint is the owner's call.
- **Consulted:** none at filing.
- Filed 2026-10-05 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  APPROVE of `0482` Phase B items 1–5; it decides nothing beyond that APPROVE and ADR-053.
