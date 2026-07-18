# Worklog — Add the `/fkit-open-questions-interview` skill for the six Claude-side roles

**Task:** [`add-open-questions-interview-skill-for-six-roles.md`](../tasks/done/add-open-questions-interview-skill-for-six-roles.md)
· **Sprint 2, priority 70** · **Plan:** [`plans/add-open-questions-interview-skill-for-six-roles.md`](../plans/add-open-questions-interview-skill-for-six-roles.md)
· **Ledger:** [`reviews/add-open-questions-interview-skill-for-six-roles.md`](../reviews/add-open-questions-interview-skill-for-six-roles.md)

**Status: 🔄 In progress — READY FOR DONE**, with one caveat below. Awaiting the owner's
`/fkit-task-done`; this loop never sets `✅ Done`.

---

## The headline: I disarmed a test-integrity gate, and a green suite hid it

`test/prove-red.sh` is the script that proves the test suite actually *bites* — it mutates the code and
checks the suite goes red. Its first mutation matched the reviewer's entire skill list **byte for
byte**. Registering this task's new skill changed that line, the `sed` silently stopped matching, and
the "mutant" became identical to the original. **Mutation 1 was testing nothing.**

It failed loudly — `✗ hard gate FAILED` — but **only to whoever ran the script, and `npm test` did not
run it.** So `379 pass / 0 fail` was true and meaningless about the thing prove-red exists to prove. I
reported a green suite while a hard gate was disarmed by my own edit.

**Fixed on the owner's ruling, both halves:**
- The mutation is now **roster-independent** — anchored on the `reviewer)` arm, stripping only the
  `fkit-review` token, so adding or reordering skills cannot break it.
- A **`cmp` post-condition fails the run if the mutation is ever a no-op again.** Verified by
  deliberately disarming it: it now prints `✗ MUTATION WAS A NO-OP` and fails, instead of passing.
- **`npm test` now runs `node --test && bash test/prove-red.sh`**, so this cannot hide behind a green
  unit suite again.

## The second lesson: the checklist I followed was itself wrong

`skills-for-role.sh`'s header says *"Two hand-maintained tables MIRROR this list… or the docs lie about
what a role can do."* **There are four.** I followed it precisely and still shipped a false statement
into `claude/scaffold/CLAUDE.md` — the file that lands in **every consuming project's** root
`CLAUDE.md` — asserting the lead role has "only" two skills, which had just stopped being true.

I had actually suspected this: my review request asked *"is there a third place I have not found?"* and
flagged that the header might be stale. **Both suspicions were right.** So the fix was not just the
mirror but the checklist — fixing one and leaving the other re-fires the same miss on the next skill.

## Owner-decision log

| # | Question | Owner's answer |
|---|---|---|
| 1 | Approve the plan (batch, six tasks) | **Approved** |
| 2 | **R2** — prove-red fix shape; wire into `npm test`? | **Robust mutation + wire it in** |
| 3 | **R3** — fix the mirror mandate header and its duplicate? | **Fix both now** |
| 4 | **R4/R7** — doc drift scope | **Fix what these tasks falsified; separate task for the pre-existing rest** |
| 5 | **Ledger hole** — widen the skill to read ledgers? | **Keep session-only; name a follow-up** |

Questions 2–5 were relayed **verbatim** from the reviewer.

### Obvious winners chosen without asking

| Choice | Why |
|---|---|
| Adding the `cmp` no-op post-condition, beyond the "robust mutation" the owner approved | The owner's ruling fixes *this* break; the post-condition prevents the *class*. A gate that can silently disarm is worse than no gate. |
| Fixing R5/R6 (the re-ask bug and the `>4` loop) directly | Mechanical, in-plan, and R5 was my text commanding the exact behavior it forbids two rules later. |

## Verification evidence

```
$ npm test
ℹ pass 379   ℹ fail 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

- **Sabotage check:** disarming the mutation → `✗ MUTATION WAS A NO-OP … hard gate FAILED`.
- Registration: 6 allow / 1 deny; **mutation-checked both directions** (granting to the adversarial
  reviewer → red; revoking from the coder → red).
- All four mirrors consistent; six agent rosters carry the skill, the adversarial reviewer does not.
- `architecture.md` skill count corrected 21 → **24**, verified against `ls claude/skills/`.

## ⚠️ The caveat on "ready for done"

**The suite proves the gate, not the behavior.** Whether the sweep finds real questions, dedups
correctly, or refuses to invent one is **not testable here** — that is the owner's session spot-check
from the brief, and it is outstanding.

## Open questions / residuals

- **A genuine hole in the session-only ruling, verified by the reviewer.** Unanswered owner-questions
  *do* persist in files — it found live ones in three review ledgers, including one marked
  `awaiting owner`. Session-only scope cannot see them across a session boundary. **The owner's ruling
  stands for this skill** (different source, different failure modes), and a **file-scoped ledger
  sweep is named as a recommended follow-up** — I do not file briefs; that is the producer's.
- **Named follow-up:** `architecture.md`'s pre-existing drift — retired `task-plan`, missing
  `task-ship-loop`, a stale `fkit-claude.sh` line pointer. Deliberately out of scope here.

## Commit state

**Nothing committed.** All edits left in the working tree.
