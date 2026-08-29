# Settle whether a sprint board may be committed UNRANKED — decide which rule wins, then make the other conform

## ID
0361

## Sprint
Sprint 7

## Priority
P13

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### ⭐ AUTHORITY — THIS IS THE THIRTEENTH ROW, AND IT ARRIVED BY THE THIRTEENTH RULING

**Owner ruling, 2026-08-29, given live via `AskUserQuestion` in a `fkit lead` session; the option label
is the verbatim text: "File it as a Sprint 7 row (Rec)".** It was put to the owner with this
description, quoted verbatim:

> *"A thirteenth row to settle which rule wins. The producer deliberately filed nothing — Sprint 7's
> banner says a row arrives only by a ruling naming it, so this needs your word. It's a real
> contradiction that will bite the next board opened unranked."*

Relayed by a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
which asked nothing and decided nothing beyond the mechanics of the ruling.

⭐ **[`sprint-7.md`](../../../sprints/sprint-7.md)'s one-row rule is HONOURED, not broken.** That rule
reads *"a row arrives here the way this one did: by an owner ruling that names it"*, and its second-pass
block adds *"**A thirteenth row needs a thirteenth ruling.**"* **This is that ruling.** ⛔ No agent added
this row on its own judgement.

### ⛔ THE CONTRADICTION — MEASURED 2026-08-29, NOT INHERITED

⛔ **`npm test` IS RED ON `main` RIGHT NOW, AND HAS BEEN SINCE SPRINT 7's BOARD WAS COMMITTED.**
Measured 2026-08-29 by running `node --test test/closed-rank-immutability.test.js`: **34 tests, 33 pass,
1 fail.** The failing test and its exact error:

```
✖ live leg 1: working tree vs HEAD — closed ranks unmoved
  Error: sprint-7.md (earlier) row at line 126: Priority cell "—" is not a rank
         (expected P<n>, or the first-era bare <n> with an optional parenthesized annotation).
```

**Three rules disagree. Two are written policy; one is a shipped test.**

| # | Site | What it says | Anchor |
|---|---|---|---|
| **A** | `test/closed-rank-immutability.test.js`, function **`parseBoard`** | A Priority cell must match `P<n>` (or the first-era bare `<n>`) — anything else **throws**, and the code comment states the assumption outright: *"`—` — the Backlog board's unranked marker — **never appears on a sprint board** and throws."* Its own unit test **`parseBoard: an unranked (—) or garbage Priority cell throws`** asserts the behaviour deliberately | function name + quoted fragment |
| **B** | [`backlog.md`](../../../sprints/backlog.md), the **"Off:"** rule's **unranked-forward clause** | Presupposes the opposite: *"When the destination sprint board is **unranked** (its Priority column is all `—`, no `P<n>` assigned to anything), write the marker as `➡️ Moved to [Sprint N](sprint-N.md)` with **no `— priority M` suffix**"* — and *"⛔ **Never write `— priority —`, and never invent a number**"* | heading + quoted fragment |
| **C** | [`sprint-7.md`](../../../sprints/sprint-7.md) §**"⛔ This board is UNRANKED — and one row is not a rank"** | *"**This is the ordinary path, not a deviation.**"* — and names Sprint 6 as *"the worked precedent that clause was written from"*. The section is superseded as a description of today's board but is **the reasoning**, not merely a record | heading + quoted fragment |

⛔ **B and C sanction committing an all-`—` sprint board. A shipped test makes doing so go red. Both
cannot stand.**

### ⚠️ THE STATE OF THE FAILURE — PRE-EXISTING, AND THE SYMPTOM SELF-CLEARS

**Measured 2026-08-29. Re-measure all of it; every line here is a claim about a live tree**
([`evidence-before-assertion`](../../../knowledge-base/conventions/evidence-before-assertion.md)):

- **The failing side is `HEAD`, not the working tree.** The error names `sprint-7.md` **(earlier)** —
  `runLeg`'s earlier revision, which for leg 1 is `HEAD`. `git show HEAD:ai-agents/sprints/sprint-7.md`
  carries **one** board row and its Priority cell is `—`.
- **It is therefore PRE-EXISTING and was not caused by the second-pass ranking.** No working-tree change
  can affect the `HEAD` side; on a clean `HEAD` checkout leg 1 compares `HEAD` against `HEAD` and hits
  the same unranked row.
- **The working-tree side is already clean.** All **12** current rows read `P<n>`; **zero** `—` Priority
  cells remain in the `## Status` table.
- **Leg 2 passes for an incidental reason:** `sprint-7.md` does not exist at `HEAD^`
  (`git cat-file -e HEAD^:ai-agents/sprints/sprint-7.md` → *"exists on disk, but not in `HEAD^`"*), so
  the earlier side has no counterpart to parse. ⛔ **Do not read leg 2's green as evidence the rule is
  fine.**
- ⭐ **The SYMPTOM clears at the owner's next commit** of the ranked board — and ⛔ **the CONFLICT does
  not.** The next board opened unranked reproduces it exactly, and B and C both still tell a producer to
  open one that way.

### ⚠️ WHY THIS IS NOT A ROW SPRINT 7 CAN SHRUG OFF

⛔ **Nine of Sprint 7's other twelve rows verify with *"`npm test` passes"* or *"both guards still
green"*.** A permanently red leg means every one of those workers has to tell a **known** red from a
**new** one by hand — which is the *"the sweep was careful" is the only evidence there is* failure that
[`sprint-7.md`](../../../sprints/sprint-7.md) §"⛔ THE FORCED SEQUENCING" exists to stop. ⭐ **A red
baseline is not a small cost on a board whose whole thesis is "verified, not trusted".**

## What to build

⛔ **TWO PHASES, IN ORDER. THE DECISION FIRST, AND NO CONFORMING EDIT BEFORE IT LANDS.**

### Phase 1 — decide which rule wins

**Re-measure all three sites and the failure first** (the tables above are dated and will go stale),
then rule between exactly these three, which are [`sprint-7.md`](../../../sprints/sprint-7.md)'s own
open question 4 verbatim: *"rule that boards are never committed unranked; widen the test to accept `—`;
or accept the red leg as a known state."*

| Option | What wins | What must then conform |
|---|---|---|
| **(a)** Sprint boards are **never committed unranked** | Site **A**, the test | **B** and **C**. `backlog.md`'s unranked-forward clause becomes unreachable and must be repaired or annotated; the "one row is not a rank" reasoning is reversed. ⚠️ **And a new question opens: what does a producer write in the Priority cell of a board the owner has not ranked?** — ⛔ answer it or the option is not implementable |
| **(b)** **Widen `parseBoard`** to accept `—` on a sprint board | Sites **B** and **C**, the written rules | **A**, the test — ⛔ **widened, never weakened** (see the hard limits below) |
| **(c)** Accept the red leg as a **known state** | nothing wins | ⛔ Then say **where** it is recorded so a worker can tell it from a new failure, and accept that `npm test` is red on `main` indefinitely |

⭐ **The producer's recommendation is (b), and the tradeoff is named rather than hidden.** The unranked
board is a **sanctioned and precedented** state — Sprint 6 opened unranked on 2026-08-14 and is the case
`backlog.md`'s clause was written from; Sprint 7 opened unranked on reasoning that survived owner
review. This test's subject is **closed-rank immutability**, not rank presence, so refusing `—` is
strictness beyond its own purpose and it makes a lawful board state uncommittable.
⚠️ **The tradeoff:** a row with no rank has no rank to compare, so widening means **defining** what the
guard does with one — and that is a real design question, not a regex tweak. See the hard limits.

⛔ **RECORD THE DECISION WHERE ITS SHAPE DICTATES, AND SAY WHICH AND WHY.** If it changes a standing
rule — which (a) and (b) both do — it is an **ADR** via `/fkit-record-decision`. If it changes nothing
and only records a tolerance — (c) — a dated note at the sites is enough. ⛔ **Do not default to an ADR
to look thorough, and do not skip one to save a file.**

### Phase 2 — make the other rule conform

**Only after phase 1 lands.** Apply the ruled option at **every** site it touches, and **prove the test
goes green** with the command output pasted.

⛔ **HARD LIMITS ON A PHASE-2 EDIT TO `test/closed-rank-immutability.test.js`:**

- ⛔ **Widening is not weakening.** `parseBoard` must **still throw** on a garbage Priority cell. The
  unit test `parseBoard: an unranked (—) or garbage Priority cell throws` is **amended and split**, ⛔
  never deleted — the garbage half keeps asserting the throw.
- ⛔ **Answer the question the widening creates, in the test's own comments:** an unranked row has no
  rank, so it cannot violate closed-rank immutability — **but a CLOSED row that goes `—` → `P<n>`
  between revisions must still be classified deliberately.** ⚠️ **That case is live, not theoretical:**
  Sprint 7's board went from all-`—` to `P1`–`P12` in one act, and the next such act may run over a
  board that already holds closed rows. ⛔ **Rule it, in writing, in the test.**
- ⛔ **Do not touch the `0174` replay fixtures or the first-era bare-`<n>` widening.** They are frozen
  historical anchors and 33 tests currently rest on them.
- ⛔ **No new devDependency and no `package.json` change** ([ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)).

⛔ **HARD LIMITS ON A PHASE-2 EDIT TO A BOARD:**

- ⛔ **Do not re-rank anything, do not renumber anything, and do not insert a row anywhere.** This task
  settles a **rule about** ranks; it changes no rank
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⛔ **`backlog.md` is machine-parsed** — `dashboard.sh` reads its `## Status` table and its `Moved`
  markers. An edit to the "Off:" rule's prose must leave the table and every marker untouched. Run the
  dashboard before and after and show no board gains a drift record.
- ⛔ **Site C is a SUPERSEDED section kept byte-identical on purpose.** If (a) wins, it is **annotated**,
  ⛔ never rewritten — the `0306` precedent that `0176` and `0237` both carry.

### Out of scope

- ⛔ **Do not commit and do not `git push`.** Leave the work in the working tree; the commit is the
  owner's. ⚠️ **Note the consequence, and do not let it read as failure:** leg 1's `HEAD` side stays red
  until the owner commits, so a green working tree is the most this task can demonstrate.
- ⛔ **Do not re-open [`ADR-035`](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)'s
  closed-row rule.** Whether closed rows may be renumbered is settled and its ADR says *"Do not
  re-raise"*. This task is about **unranked** cells, not about moving ranked ones.
- ⛔ **Do not rank the Backlog board.** It is *"an archive of known issues, not a ranked queue"* by owner
  ruling of 2026-08-29 — and that board is excluded from this test by construction anyway.
- ⛔ **Do not write `ai-agents/wiki-vault/`** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **Do not move any task folder and do not run `/fkit-task-done` or `/fkit-task-cancelled`**
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).

## Verification steps

1. **The three sites are re-measured firsthand and quoted**, at the revision read, before any edit —
   `parseBoard`'s rank check and its comment, `backlog.md`'s unranked-forward clause, `sprint-7.md`'s
   §"⛔ This board is UNRANKED". ⛔ State what each actually says now; do not inherit the tables above.
2. **The failure is reproduced and pasted**, with the command run — `node --test
   test/closed-rank-immutability.test.js` — and the pass/fail counts named. Show which side of leg 1
   fails (earlier vs later) and say what `HEAD` holds there.
3. **The decision exists as a file** — an ADR under `ai-agents/knowledge-base/decisions/`, or a dated
   note at the sites — and the report says **which form and why**. It names the option chosen from the
   three, and what it costs.
4. **Every site the ruled option touches is edited, and none that it does not.** `git diff --stat` is
   pasted and each file is justified in one line.
5. **`node --test test/closed-rank-immutability.test.js` is GREEN in the working tree**, with counts.
   ⚠️ If (c) was ruled, this step instead names the exact recorded location of the accepted red leg and
   shows a worker can find it — ⛔ a red leg with nowhere written down has failed this step.
6. **The garbage-cell throw still holds.** Run the unit test that asserts it and paste the result. ⛔ A
   diff that deletes it has failed verification.
7. **`npm test` passes in full**, including `test/prove-red.sh`. Report the counts. ⚠️ If leg 1's `HEAD`
   side is still red for the uncommitted-board reason, **say so explicitly and separate it from any
   other failure** — ⛔ never fold the two together.
8. Run `bash claude/skills/fkit-status/dashboard.sh` over every live board before and after; report
   roll-ups and drift. **No board gains a drift record**, and `select-active` still returns
   `active file="sprint-7.md" identity="Sprint 7"`, exit 0.
9. **No rank changed anywhere.** `git diff` over `ai-agents/sprints/` shows no Priority cell altered by
   this task. Prove it with the command.
10. Nothing committed, nothing staged, no task folder moved, no mover invoked.

## Notes

- **Depends on:** nothing. ⭐ **Independent of the whole `0353`→`0358` guard-and-sweep chain** — it may
  run at any point in Sprint 7 and waits on no guard.
- **Blocks:** `0360` — ⛔ **hard.** `0360` cuts v0.3.0 and hand-archives this board, and its own brief
  says *"Do not archive while any Sprint 7 row is open."* ⛔ **This row must close before `0360` runs.**
- **On merit:** immediately above `0360` — the release should not ship with two written rules
  contradicting a shipped test, and nothing else on the board waits on this. ⚠️ **The append rule placed
  it BELOW `0360` instead** (see the rank note next), so ⛔ **the ordering that actually binds is the
  `Blocks` line above and `0360`'s own `Depends on`, never this rank** — exactly as ADR-035 requires:
  *"Where ordering must actually bind, it belongs in `Depends on` / `Blocks`, not in rank and not in a
  merit note."*
- ⛔ **WHY `P13` AND NOT `P12` — the rank is an APPEND, and that was not a free choice.**
  [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
  §Decision: *"The owner-ruled re-rank exception permits moving an existing row within its own
  contiguous run of open rows. **It does not permit inserting a new row mid-board.**"* Placing this row
  at `P12` would have renumbered `0360` to `P13` — an insertion, however small.
  - ⚠️ **The tempting counter-argument, stated and rejected.** ADR-035's own *"re-raise only if"* notes
    that on a board *"whose closed rows are all contiguous at the top, a mid-board insertion below them
    renumbers nothing closed, and the narrowing is unnecessary though harmless"* — and Sprint 7 holds
    **zero** closed rows today (measured 2026-08-29: all twelve read `🔲 Backlog`), which is the
    degenerate case of exactly that. ⛔ **It is still not taken.** The ADR's Decision is written flatly,
    it says *"Do not re-raise"* the make-insertions-legal option, and the owner's thirteenth ruling names
    a **row**, not a re-rank of the twelve they approved row by row. ⭐ **A spawned producer does not
    re-rank** (`/fkit-task-brief` step 5).
  - ⭐ **The cost is real and is paid in the `Blocks` line above, not hidden:** rank order and execution
    order now disagree for one pair of rows, and `0360`'s `Depends on` was updated in the same act so the
    binding order is machine-readable.
- ⛔ **This row is NOT a record-repair row, and must not be counted as one by `0359`.** It does not
  append a note to a stale record; it settles a **live rule conflict** and changes a shipped test or a
  standing convention. ⭐ Sprint 7's success criterion caps record repair and *"there is NO cap on
  process work at all"*.
- **Who builds it, under ADR-044 §Decision 1** — stated so it does not read as a misroute:
  `## Owner` is **`fkit-architect`**, the seat accountable for delivering a rule decision
  ([`task-owner-vocabulary`](../../../knowledge-base/conventions/task-owner-vocabulary.md): *"the role
  accountable for the task's delivery"*). ⭐ **The ship-loop's per-step roles are derived separately and
  may differ** — phase 1's deliverable is produced by `/fkit-record-decision`, architect-owned in
  `skills_for_role()`, so its Build is the architect; phase 2's deliverable is a **test or convention
  edit, which names no skill**, so ADR-044 §Decision 1 puts it with `@fkit-coder`, *"whatever `## Owner`
  says."* ⛔ **Two phases, possibly two Build workers. That is the rule working, not a defect.**
- ⚠️ **Soft collision with `P5` (`0355`)** — both may edit `ai-agents/sprints/backlog.md`. Different
  regions (`0355` repairs broken links; this task may amend the "Off:" rule's prose), and `P13` runs
  after `P5`, so it is a sequencing note, not a dependency. ⛔ Re-read the file rather than assuming a
  stale copy.
- ⚠️ **Citations here are deliberately name-anchored, not `path:NNN`.** `parseBoard` is named by
  function plus quoted comment, and the board sites by heading plus quoted fragment. ⭐ **Reason: `P6`
  (`0237`) and `P7` (`0176`) are cleaning and then guarding coordination-citation form on this very
  board, and a new `:NNN` written today is a new member of the set they are sweeping**
  ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
- ⚠️ **Why one row and not two (decide, then implement).** `/fkit-task-brief`'s smallest-shippable rule
  would ordinarily split them. ⛔ **Not here:** the implementation is unknowable until the decision lands
  — under (c) there is none at all — and under (b) it is a regex plus a comment. ⭐ **Sprint 7 exists to
  stop manufacturing task folders**, and a second folder to hold a possible one-line edit is the exact
  ratio the sprint is capping. ⚠️ **The gate is kept as a phase order inside this brief, not lost:**
  phase 2 may not start before phase 1 lands.
- **Source:** [`sprint-7.md`](../../../sprints/sprint-7.md) §"Open questions for the owner" question 4,
  and its `## Notes` bullet *"⛔ ONE TEST IS RED, IT WAS RED BEFORE THIS PASS, AND IT IS NOT CAUSED BY
  IT."* Filed 2026-08-29 on the owner ruling *"File it as a Sprint 7 row (Rec)"*.
