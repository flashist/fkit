# Append a dated correction note to ADR-020 naming the **driver** a sanctioned `plan.md` writer

## ID
0207

## Sprint
Sprint 2

## Priority
185

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Follow-up 1 of `0202`'s review** — finding `R1`, verdict **CORRECT**, classified *Defect
(documentary)*, dispositioned by the owner as `deferred → follow-up (owner ruling)`. The ledger is
`ai-agents/tasks/done/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/review.md`
(row `R1`).

`0202` made the **sprint-loop driver** write `<task-folder>/plan.md` at plan approval, and cited
[ADR-020](../../../knowledge-base/decisions/adr-020-per-task-plan-and-worklog-artifacts.md) for it.

**The citation is right about timing and wrong about the writer.** Verified first-hand 2026-08-03:

| Site | What it says |
|---|---|
| `ai-agents/knowledge-base/decisions/adr-020-per-task-plan-and-worklog-artifacts.md:34` | *"The ship-loop persists two new git-tracked, **coder-written**, task-id-keyed artifacts…"* |
| same file, `:39` | the `plan.md` row's **Written** cell reads *"at plan approval"* — **this half already fits** and needs no change |

So the ADR's Decision sentence says these artifacts are **coder-written**, while `0202` shipped a
**driver** write. The shipped skill text is correct behaviour; the ADR is the record that has fallen
behind it.

## What to build

**One dated correction note appended to ADR-020. Nothing else.**

1. Append a **dated correction note** to
   `ai-agents/knowledge-base/decisions/adr-020-per-task-plan-and-worklog-artifacts.md` recording that,
   as of `0202` (2026-08-02), the **`/fkit-sprint-ship-loop` driver is a sanctioned writer of
   `<task-folder>/plan.md`**, written at plan approval, **before** the Build worker is spawned.
2. Say explicitly that the ADR's **timing** clause (`:39`, *"at plan approval"*) is **unchanged and still
   correct** — only the *writer* attribution needed the note.
3. **Form:** as `0143` established for dated ADR corrections and `0195` extended. Follow those two, do
   not invent a third shape.
4. **`claude/skills/fkit-sprint-ship-loop/SKILL.md` keeps its ADR-020 citation byte-unchanged.** The
   owner dispositioned it that way in `0202`'s review: the citation is not the defect, the ADR is.

### ⛔ Settled and NOT to be reopened — the "delegate the write to a bounded coder" option

Codex, reviewing `0202`, recommended resolving the mismatch the other way: keep ADR-020's *coder-written*
wording and have the driver **delegate** the `plan.md` write to a bounded coder spawn.

**The reviewer ruled that this RECREATES `R4b`, and the owner agreed.** `R4b` is the confirmed live
production failure `0202` exists to fix: a spawned worker handed an approved plan **authored a
re-rendering of it instead of copying it** (on task `0162` — two of three distinctive strings absent,
`git hash-object` = `2458a57eda55ca774884110e76dee1bf91b6d6e0`). Putting a worker back between the
approved text and the file on disk restores exactly the reconstruction route `0202` closed.

**This brief must state that ruling, and must not reopen it.** Do not evaluate the delegation option, do
not present it as an alternative in the note, and do not weigh it again in a design pass.

## Verification steps

1. ADR-020 carries a dated correction note naming the **driver** as a sanctioned writer of
   `<task-folder>/plan.md` at plan approval.
2. The note says the ADR's **timing** clause is unchanged and correct.
3. The note's shape matches `0143`/`0195`, not a new form.
4. **ADR-020's original Decision text is not silently rewritten** — a reader can see what it said before
   and when the correction was added.
5. `claude/skills/fkit-sprint-ship-loop/SKILL.md` is **byte-unchanged** by this task —
   `git diff -- claude/` shows nothing from it.
6. The note does **not** describe the delegate-to-a-bounded-coder option as available or open.
7. `npm test` stays green (this touches no source).

## Notes

- **Depends on:** nothing. `0202` has shipped.
- **Blocks:** nothing.
- **⚠️ Priority 185 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0205`** — it is the same class of work as `0205` (a dated
  correction note to an ADR whose claim a shipped change has outrun), same owner role, and the two read
  naturally together. It is **not** urgent: the shipped behaviour is correct today and only the record
  disagrees. **Append rank and merit are close here — a few places, not a wholesale divergence.** Filed by
  a spawned producer with no owner channel, which never re-ranks (ADR-035).
- **Source:** `0202`'s review ledger, row `R1`.
