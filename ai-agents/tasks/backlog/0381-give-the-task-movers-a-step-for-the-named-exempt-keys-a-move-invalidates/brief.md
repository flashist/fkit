# Give the task movers a step for the `NAMED_EXEMPT` keys a move invalidates — the mover repoints links but never deletes an exemption

## ID
0381

## Sprint
Backlog

## Priority
—

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### The defect, in the coder's own words

> **"`/fkit-task-done` reasons about links it must *repoint* but has no step for exemption keys it
> must *delete* — the keys are in a test file, outside the folders it inspects."**

⭐ **FILED BY OWNER RULING, 2026-09-07** — given live via `AskUserQuestion` in the `fkit lead` session
driving `/fkit-sprint-ship-loop`, and relayed to a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**Option label, verbatim: "File it as its own row (Rec)."**

### What the gap is, mechanically

`test/reference-integrity.test.js` carries `NAMED_EXEMPT`, a `Set` of **`(citing file, target)` string
pairs** that suppress a known-and-accepted broken link. A key is a promise that *this* link, from
*this* file, is deliberately unresolvable.

Both movers — [`fkit-task-done`](../../../../claude/skills/fkit-task-done/SKILL.md) and
[`fkit-task-cancelled`](../../../../claude/skills/fkit-task-cancelled/SKILL.md) — carry a long,
careful step 5 about **repointing** hrefs and **freezing** claims. ⛔ **Measured on disk 2026-09-07:
the strings `NAMED_EXEMPT` and `reference-integrity` appear ZERO times in either skill file.** The
movers do not know the set exists.

That is survivable for a *link*, which the mover does repair. It is not survivable for a *key*,
because a move can invalidate a key in **two opposite directions**, and the mover handles neither:

- **A key goes stale by orphaning** — the citing file named in the key moves, so the key names a path
  that no longer exists and suppresses nothing.
- **A key goes stale by healing** — the link the key excuses starts *resolving*, so the exemption
  becomes dead weight. `test/reference-integrity.test.js`'s `L4` (`targetIsBack`) reds on a
  **satisfied** exemption.

### ⭐ The rule to record — this is the durable part

> **"`../../done/X` survives, `../X` does not" is right about a POINTER and INVERTS for an EXEMPTION
> KEY.**

A sibling-relative link **heals** when its citer moves into `done/` beside a target already there. At
that moment the exemption is **dead weight and must be DELETED, not repointed.** A run that applies
the pointer rule to the key does exactly the wrong thing.

### Evidence — it fired twice in one day, both times as a red suite discovered AFTER the close

1. Closing **Sweep C's five members** left three `NAMED_EXEMPT` keys pointing at `0358`'s
   `review.md` **`backlog/`** path.
2. Closing **`0358`** itself then made those three links **resolve** — the exemptions became dead
   weight, `namedExemptCount` fell **9 → 6**, and **`L3` red on the FALL, not on a rise.** A fourth
   link (`0290`) broke in the same move and needed a **new** exemption.

Both discoveries came from a red suite *after* the mover had already reported success. The lesson is
now written in prose inside `test/reference-integrity.test.js`'s own `NAMED_EXEMPT` comment block —
⭐ **which is exactly the wrong place for it**: it is visible to a reader of the test, and invisible
to the skill that must act on it.

### ⚠️ The gap does not fire on every close, which is why it keeps surviving

Measured this turn: closing **`0359`** grepped clean — **zero** `NAMED_EXEMPT` keys named that folder,
before and after the move, and the close needed no test-file change at all. A mover with this gap
reports a clean close most of the time. It reds only when a key happens to name the moving folder.

### ⛔ Distinct from two rows it will be tempting to merge with later

| Row | What it is | Why it is NOT this |
|---|---|---|
| [`0378`](../0378-decide-how-a-worker-tells-a-concurrent-close-s-transient-link-red-from-its-own/brief.md) | A worker telling a **concurrent** close's transient link-guard red from its own | That is **concurrency / timing** — a red caused by someone else's in-flight move. This row's red is caused by the mover's **own completed** move. |
| [`0363`](../0363-design-the-sweep-completion-step-that-stops-a-fixed-class-recurring-one-file-over/brief.md) | The sweep-completion step that stops a fixed class recurring one file over | That is **claim propagation** across a class of documents. This is one missing step in one skill. |

⭐ **This row reds DETERMINISTICALLY**: given a key that names the moving folder, the suite goes red
every single time, with no race and no second actor. Say so if anyone proposes folding these three.

## What to build

⛔ **THE ANSWER IS DELIBERATELY NOT CHOSEN HERE. This brief frames the problem; the design belongs to
the implementer's plan gate with the owner.** A run that arrives having already picked one has skipped
the gate.

The fork, stated so the plan gate has something to rule on:

- **A — the movers gain a step.** Add an explicit step (both movers) that greps `NAMED_EXEMPT` for the
  moving folder name and classifies each hit *orphaned → repoint* or *healed → delete*.
  Cost: the rule lives in prose in two skill files and must stay in sync with a third file.
- **B — the key format becomes move-invariant.** Key on something a move does not change (a task ID,
  a content hash, a board-agnostic form) so no mover step is needed.
  Cost: a change to a **coder-owned test surface** with its own transcription-fidelity history.
- **C — something else** the implementer finds better.

⚠️ **What every option must settle regardless of which is chosen:**

1. **Who may edit `test/reference-integrity.test.js`.** It is a **coder** surface. Today a spawned
   producer running a mover cannot touch it, so any option that puts the fix inside the mover run must
   say what the producer does instead — most plausibly **return `NEEDS-DECISION` naming the exact
   keys**, which is what happened in this turn's close-out discipline and worked.
2. **The `L3` count assertion.** `namedExemptCount` is asserted; a deletion moves it **down**. Whatever
   is built must make a legitimate fall green without disarming the guard against an illegitimate one.
3. **`fkit-task-cancelled` too.** The gap is measured in **both** movers. A fix that lands only in
   `fkit-task-done` half-ships the task.

## Verification steps

1. Reproduce the failure first, before any fix: construct a case where a folder moves and a
   `NAMED_EXEMPT` key names it, and show the suite red. ⛔ **A fix with no red-first reproduction is
   not verified.**
2. Cover **both** directions — the orphaned key and the healed key. The healed direction is the one
   that inverted the rule and is the easier of the two to get backwards.
3. `npm test` green. Report **measured** counts, not "all green". Baseline at filing time:
   **869 tests / 869 pass / 0 fail**, plus `test/prove-red.sh`'s hard gate.
4. If the chosen option edits a skill under `claude/`, it engages the install share's **structure-spec
   and hash manifest**, and the gitignored `.claude/` mirror
   ([ADR-027](../../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
   dual-home parity). ⛔ Edit canonical `claude/`, never the mirror; ⛔ **stop and surface** if the
   edit forces regenerating a shipped artifact.
5. If a `prove-red.sh` mutation is the right proof shape, add one — the repo's existing convention for
   proving a guard actually guards.

## Notes

- **Depends on nothing.** ⛔ **But it is a live tax on every close** — it has cost two rounds in one
  day, and it will cost more for as long as sweeps keep closing folders that other folders quote.
- **Owner: `fkit-coder`** — it amends a mover skill (or two) and a test file, both coder surfaces.
- **Unranked**, per the Backlog board's archive-not-queue rule (owner ruling 2026-08-29,
  *"Rank Sprint 7; declare backlog an archive (Rec)"*): ranking happens **at pull time onto a sprint
  board**, so the `Priority` column reads `—`. ⛔ **Nothing was re-ranked by this filing**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⚠️ **This brief was written by a spawned `fkit-producer` with no owner channel** (ADR-021). The
  ruling to file it is the owner's; every framing choice below that ruling is the producer's and is
  open to correction.
