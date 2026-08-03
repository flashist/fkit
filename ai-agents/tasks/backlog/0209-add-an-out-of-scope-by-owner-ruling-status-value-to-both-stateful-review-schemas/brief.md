# Add an "out of scope by owner ruling" status value to **both** stateful-review schemas

## ID
0209

## Sprint
Sprint 2

## Priority
187

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Follow-up 4 of `0202`'s review — raised by the run itself, not by a reviewer finding.** The evidence is
`0202`'s own ledger:
`ai-agents/tasks/done/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/review.md`.

The stateful-review ledger has a fixed **Status** vocabulary, declared identically in two skills.
Verified first-hand 2026-08-03:

| File | Line | Declared values |
|---|---|---|
| `claude/skills/fkit-stateful-review/SKILL.md` | `:74` | `pending approval` · `✅ done` · `won't fix (frontier)` · `disproven` · `closeout (re-litigation)` · … |
| `claude/skills/fkit-process-stateful-review/SKILL.md` | `:85` | `pending approval` · `✅ done` · `won't fix (frontier)` · `disproven` · `closeout (re-litigation)` · `blocked` |

**The vocabulary has no value for a finding that is CORRECT, accepted as correct, and deliberately not
fixed in this task because the owner ruled it out of scope.**

### The evidence — this already happened, deliberately, on `0202`

Three of `0202`'s six findings landed in exactly that state. All three are verdict **CORRECT**; none was
disputed; none was fixed in `0202`; each was ruled a follow-up by the owner:

- **`R1`** — ADR-020 says *coder-written* while `0202` ships a driver write → `0207`.
- **`R5`** — no exit-table row for a failed Build/Verify/Review spawn → `0208`.
- **`R6`** — `0202`'s `plan.md` carries a coordinate error that must not be edited → repaired by note.

The processing worker wrote **`deferred → follow-up (owner ruling)`** in the Status cell — **out of
vocabulary, and deliberately so**, with the reason stated in the ledger. The available value
`won't fix (frontier)` would have been **actively false**: it brands a finding as an accepted tradeoff
the team has chosen to live with. These three are not tradeoffs. They are **correct defects with an owner
ruling about *where* they get fixed**, and each has a filed row.

**Recording them as `won't fix` would have made three correct findings look declined.** The worker chose
an honest out-of-vocabulary string over a dishonest in-vocabulary one. That choice is the argument for
this task.

### ⚠️ The two schemas MUST change together

`fkit-stateful-review` (the reviewer's side) and `fkit-process-stateful-review` (the coder's side) write
into **the same `review.md` ledger**. They declare the same list in two places. **A value added to one
and not the other forks the ledger** — one party writing a status the other's schema rejects, in a file
they share. Either both land in the same change, or neither does.

## What to build

**One new Status value, declared in both skills, plus the rule for when to use it. Nothing else.**

1. Add a status value meaning **"CORRECT, accepted, and out of scope for this task by owner ruling —
   fixed elsewhere"** to the declared vocabulary in **both**
   `claude/skills/fkit-stateful-review/SKILL.md` and
   `claude/skills/fkit-process-stateful-review/SKILL.md`. (⚠️ **Re-verify `:74` and `:85` at
   implementation time.**)
2. **Pick one wording and use it byte-identically in both files.** `deferred → follow-up (owner ruling)`
   is the form the field already produced and is the obvious candidate; the implementer may choose a
   shorter one, but it must be the **same string in both places**.
3. **Write the distinguishing rule beside it**, in both files: this value is **not** `won't fix
   (frontier)`. `won't fix (frontier)` means *the team accepts the tradeoff and no fix is coming*. The new
   value means *the finding is correct, a fix IS coming, and the owner ruled it belongs in a different
   task*. Getting these two confused is the failure the task exists to prevent.
4. **Require a pointer.** A finding carrying the new value must name **where** it was filed — the
   follow-up task ID, or an explicit statement that the row is not yet filed. A deferral with no
   destination is indistinguishable from a dropped finding.

⛔ **Out of scope:** the **Verdict** vocabulary (this is the **Status** column only), the ledger's table
shape, `/fkit-review`, `/fkit-process-review` (the ephemeral pair), any change to `0202`'s already-written
ledger, and `ai-agents/wiki-vault/`.

## Verification steps

1. Both `claude/skills/fkit-stateful-review/SKILL.md` and
   `claude/skills/fkit-process-stateful-review/SKILL.md` declare the new Status value.
2. **The declared string is byte-identical in both files.** Prove it — e.g. grep the exact string in each
   and compare.
3. Both files carry the rule distinguishing the new value from `won't fix (frontier)`, and both require a
   destination pointer.
4. **No Verdict-column value was added or changed** in either file.
5. **Change surface is exactly two files.** `git diff --stat` shows those two and nothing else.
6. **Frontmatter guard green:** `node --test test/skill-frontmatter.test.js` passes for both.
7. **`npm test` passes.** Record pass/fail/suite counts.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **⚠️ Priority 187 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0208`** — like `0208` it repairs a **running control** (a schema
  two live skills write against today) rather than a historical record, so it sits above the documentary
  corrections and the wiki ingest appended near it. It ranks **below** `0208` because a missing exit-table
  row can orphan an artifact mid-run, whereas this one only costs ledger honesty — and the field has
  already shown it works around the gap correctly. **Append rank and merit diverge by roughly three
  places.** Filed by a spawned producer with no owner channel, which never re-ranks (ADR-035).
- **Source:** `0202`'s review ledger — rows `R1`, `R5`, `R6` and the out-of-vocabulary note beneath the
  table.
