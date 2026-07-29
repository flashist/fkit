# The wiki completion flag must carry the task's folder ID and the brief path — `Task N` is undefined

## ID
0153

## Sprint
Sprint 2

## Priority
117

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

Task **0125** (*"Wiki flag-don't-close convention"*, board rank **P108**) closed 2026-07-27 as
`✅ Done (agent-closed — not owner-verified)`. It landed the completion-flag block in all three wiki
SKILLs. **The block names the task it is flagging as `Task N`, and `N` is never defined anywhere in
it.**

**The three sites, re-verified 2026-07-27 by reading the files:**

| File | Line | The flag line |
|---|---|---|
| `claude/skills/fkit-wiki-ingest/SKILL.md` | 72 | `` - complete → `Task N's vault work is complete — ready to close (producer runs /fkit-task-done)` `` |
| `claude/skills/fkit-wiki-lint/SKILL.md` | 81 | same |
| `claude/skills/fkit-wiki-sync/SKILL.md` | 116 | same |

The partial line beside it (`` `Task N: partial — not ready to close` ``) has the identical defect.

### Why `N` is genuinely ambiguous, not merely loose

Every task in this project carries **two** small integers, in adjacent columns of the same board
table, and they are different number-spaces:

- the **folder ID** — the `NNNN` prefix of the task folder, permanent, never reused (ADR-029
  Decision 3);
- the **sprint rank** — the board's Priority cell, mutable, re-ranked twice in a single day, and since
  task 0103 rendered `P<n>`.

This is exactly the confusion
[`conventions/priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)
exists to prevent — *"A task's identity is its task-folder name's `NNNN` prefix, and nothing else."*
The convention was approved **2026-07-27**, and this text was written the **same day**, on the other
side of the repo, without it.

**The collision is live, not hypothetical, and it lands on the worst possible pair.** Task 0125 has
rank **P108**. A different, real task with folder ID **0108** also exists —
`ai-agents/tasks/done/0108-investigate-making-wiki-task-completion-visible-to-the-board/` — and it is
**the very investigation 0125 implements**. A flag reading *"Task 108's vault work is complete"* is
ambiguous between the two tasks a reader is most likely to conflate.

### Why the missing path makes it worse

- The flag line is **the one thing the SKILLs require be carried verbatim** by a caller who summarizes
  the report (*"a dropped flag is the whole bug this exists to fix"*). Whatever ambiguity it carries is
  carried undiluted to the producer.
- It carries **no path**, even though the block's own scan step already reads
  `ai-agents/tasks/backlog/*/brief.md` — so the wiki **holds the exact folder name at flag time**.
  Emitting it costs nothing.
- The consumer is `/fkit-task-done`, which **takes a path**. So the producer must resolve `N` to a path
  by hand, and resolving it wrong moves the **wrong** brief into `done/` and edits the sprint plan
  against the wrong row.

### The uniformity constraint — stated precisely, because the loose form is wrong

Measured 2026-07-27, block extracted between `**The wiki closes nothing` and `Run /fkit-task-done on`:

- `fkit-wiki-ingest` and `fkit-wiki-lint`: **byte-identical** — 2296 bytes, 33 lines each.
- `fkit-wiki-sync`: **2215 bytes**, 33 lines — the *same text* with **three fewer leading spaces per
  line**, because in `sync` the block sits at top level while in `ingest`/`lint` it is nested inside a
  numbered step.

So *"the three files are byte-identical"* is **false as stated** and must not be implemented literally.
The real rule is below in **What to build**.

### Provenance

Found by a spawned `fkit-producer` during 0125's close on 2026-07-27 — **the role that actually
consumes the flag.** Neither the coder, the reviewer, nor the Codex adversarial pass caught it across
five rounds of findings.

## What to build

Prose edits to three `SKILL.md` files. No source code, no test (the test is task **0154**).

1. **Make the flag name the folder ID, explicitly.** Both the complete line and the partial line must
   identify the task by the **`NNNN` prefix of its task folder** (equivalently the brief's `## ID`
   field — the folder name is authoritative). The word "N" alone is not acceptable; the placeholder
   must say what it is.
2. **Make the flag carry the brief path.** Both lines must include the path the scan step already read,
   in the form `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md`, so the producer can invoke
   `/fkit-task-done` without resolving anything.
3. **Add one short rule beneath the two lines** stating where the number comes from and — as an
   explicit negative — that it is **never** the sprint board's rank / `P<n>` Priority cell. Cite
   `conventions/priority-is-rank-not-identity.md` by name. The negative is the load-bearing half: it is
   what a future editor reads before reintroducing a bare number.
4. **Keep the three blocks uniform, correctly defined:**
   - the **backticked flag strings** (complete and partial) must be **byte-identical** in all three
     files;
   - the surrounding block must be identical **after normalising leading indentation only**, with
     relative nesting preserved;
   - **do not re-indent `fkit-wiki-sync`'s block** to force raw byte-equality. Its offset is correct
     for its position in that file.
5. **Do not widen scope.** Leave untouched: the three-outcome consideration rule (0125 R2, including
   *"unrelated to this run → say nothing about it at all"*), the R5 *"do not spawn the producer to
   close it yourself"* clause, the hard-rule bullet, the routing line, and the null line
   `No tracked task completed by this run.` — except where the flag line's own text necessarily
   changes.
6. **Edit `claude/skills/` only.** The `.claude/skills/` copies are gitignored mirrors refreshed by
   `claude/fkit-claude-init.sh`; verify by reading `claude/`, never `.claude/`.

## Verification steps

1. The new complete-flag string appears **exactly 3 times** across `claude/skills/fkit-wiki-*/SKILL.md`
   — once per file — and the backticked string is **byte-identical** in all three. Same for the partial
   line.
2. Both lines name the task by its **folder ID** and both carry a **brief path**. Read them aloud
   against the live specimen: a flag naming task 0125 must be unmistakable from one naming task 0108.
3. The block contains an explicit statement that the sprint-board rank / `P<n>` Priority cell is **not**
   the identifier, and cites `priority-is-rank-not-identity.md`.
4. **Uniformity re-proved with a fail-closed check.** The extraction must be gated on being non-empty
   and on a minimum line count, must **preserve relative nesting** (do not blanket-strip leading
   whitespace before comparing — that is precisely the 0125 `plan.md` check-4 defect, finding **R3**),
   and must include a **negative control** that is observed to fire. A check that prints `UNIFORM` on an
   empty extraction has verified nothing.
5. `fkit-wiki-sync`'s block still differs from `ingest`/`lint` **only** by uniform leading indentation
   — same line count, same text. No re-indentation was performed.
6. 0125's own verification steps 2 and 3 still hold: none of the three SKILLs invokes `/fkit-task-done`
   or any mover, none moves a task file, and the flag still routes the close to the **producer**
   (ADR-033).
7. **If task 0154 has already landed**, its assertions are updated in this same change and the full
   `node --test` suite is green. A green suite asserting the old strings would mean 0154 never
   guarded anything.

## Notes

- **Owner:** fkit-coder — SKILL source under `claude/skills/`, which is coder-editable (task 0081
  Part C: *"the wiki's exclusivity is over the vault, not over its own skill source"*).
- **Depends on:** nothing.
- **Blocks:** 0154 (soft — see the ordering note below).
- **Ordering with 0154 — this task first.** 0154 asserts the flag lines **verbatim**. Landing 0153
  first means 0154 pins the final wording. Landing 0154 first means 0153 must rewrite the brand-new
  test in the same change, and the suite is red in between. The dependency is **soft**, not hard —
  either order ships — but only one of them is free.
- **Source:** found by a spawned `fkit-producer` during task 0125's close, 2026-07-27, in the
  `fkit-sprint-ship-loop` run that shipped 0125. Owner approved filing on 2026-07-27 via
  `AskUserQuestion`.
- **Ranking note.** Placed at **117**, the top of the contiguous re-rankable region (P110–P112 and
  P115–P116 are `✅ Done` rows and renumbering closed history is refused — the same refusal 0152's
  addendum records). It sits above 0141, 0132, 0133, 0142, 0151, 0143, 0147, 0150 and 0148 because it
  is **the cheapest item in the open region** — three prose edits, no new infrastructure, no design
  call — and the only one whose cost of waiting is a **wrong action** (a mover pointed at the wrong
  task, which moves a file and edits the sprint plan) rather than missing evidence, stale prose, or
  inherited drift. **The ranking is producer judgment, not an owner ruling** — the owner approved
  filing, not placement.
- **⚠️ Timing the board cannot express.** Three wiki-owned tasks will each emit this flag: **0126**
  (rank P109), **0141** and **0148**. 0141 and 0148 rank below this task and so will emit the corrected
  flag. **0126 ranks above it and cannot be displaced** without renumbering the `✅ Done` rows at
  P110–P112. If 0126 runs before this lands, its flag will carry a bare `Task N` and the producer must
  resolve it by hand — **read the emitted flag against both number-spaces before invoking any mover.**
- No commit — leave the edits in the working tree.
