# Annotate the three old-form completion flags in the vault `log.md` before their paths die

## ID
0211

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-wiki

## Context

Task **`0173`** (closed 2026-08-03) tightened the wiki completion-flag block in all three
`claude/skills/fkit-wiki-*/SKILL.md` files. The flag now carries a **folder ID only, with no path at
all**, plus a `:NNN` prohibition and a routing line telling the caller to resolve `<NNNN>` to its task
folder by globbing `ai-agents/tasks/*/<NNNN>-*/`.

**The three flags already written into `ai-agents/wiki-vault/log.md` use the OLD form**, which
hardcoded a `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md` path into the flag text. They are:

| Where | Flag | Names |
|---|---|---|
| The **2026-08-03 sync** entry, in its two run-ending flag lines | `partial — not ready to close (<backlog path>)` | `0199` |
| The same entry, second flag line | `vault work is complete — ready to close (producer runs /fkit-task-done on <backlog path>)` | `0206` |
| The **2026-08-03 lint** entry, in its single run-ending flag line | `partial — not ready to close (<backlog path>)` | `0199` |

Three emissions, two distinct tasks: **`0199` twice, `0206` once.**

### ⚠️ The timing is the whole point, and it is easy to get wrong

**Verified on disk 2026-08-03: both `0199` and `0206` are still in `ai-agents/tasks/backlog/`.**

**So all three paths are LIVE and CORRECT today. Nothing is broken right now.** They die the moment
either task closes or is cancelled — at which point three frozen, append-only log entries will be
pointing at folders that have moved to `done/`.

This is exactly the profile that **`0160`'s decision report §5.2** singles out as **the worse of the
two to detect**: the `partial` form says in so many words *"not ready to close"*, so the task genuinely
**is** in `backlog/` when the flag is written and the path is **true at the time**. It dies later —
possibly weeks later. The report's words: *"it is a pointer that was demonstrably correct when written,
which is the exact profile §3.4 identifies as the dangerous one."*

**A reader who checks these paths today finds them correct and concludes there is nothing to do. That
conclusion is right about today and wrong about next week.** Say so in whatever is written.

### ✅ The central obstacle — SETTLED 2026-08-03 by owner ruling: `log.md` is append-only, no exceptions

`ai-agents/wiki-vault/schema.md` records `log.md` as *"Append-only chronological activity log"*, the
log's own header says *"Never edit or rewrite"*, and multiple prior runs record the discipline
explicitly (*"the old entry is left byte-unchanged — `log.md` is append-only"*).

**This collision was flagged twice and left unresolved both times.** The 2026-08-03 sync raised it for
human review: `0199`'s own instruction to clear *"still open"* framing **from `log.md`** conflicts with
the log being append-only, *"the two instructions conflict, and this run did not resolve it"* — and it
asked an architect or the owner to rule. **The 2026-08-03 lint hit it and did not settle it either.**

> **✅ OWNER RULING — 2026-08-03. A wiki run may NEVER edit or annotate a past `log.md` entry in
> place.** A correction lands as a **new dated entry** that names what it corrects by **folder ID and
> durable anchor**. The original entries stay **byte-identical**.
>
> **Rationale as ruled:** this matches the append-only guarantee in `log.md`'s own header and in
> `schema.md`, and it matches the form the knowledge-base correction-note already uses.
>
> **Provenance:** given live via `AskUserQuestion` in a `/fkit-sprint-ship-loop` driver session on
> **2026-08-03**, and relayed into this brief by a spawned producer with no owner channel. **Ruled
> once, for both tasks** — it governs this task *and* `0199`, exactly as this brief recommended.

**Consequence for this task: none — it was already built for this answer.** The default deliverable
below was chosen precisely so it needed no ruling, and the ruling confirms it. The in-place variant
this brief described as *"materially better if permitted"* is now **permanently ruled out**; do not
revisit it.

## What to build

**A wiki-role change, inside `ai-agents/wiki-vault/` only. `fkit-wiki` is the exclusive write gateway
for the vault (ADR-005); no other role may perform this.**

> ⛔ **ROUTING — build this with `@fkit-wiki`, never a coder.** `/fkit-sprint-ship-loop`'s step table
> names the **coder** as the builder for a generic task. **That table does not apply here.** The only
> write surface is `ai-agents/wiki-vault/`, which ADR-005 makes the wiki role's **exclusive** surface,
> and that is a **universal hard rule** — it outranks a skill's step table. A driver that spawns a
> coder for this task is asking it to break a hard rule; spawn `@fkit-wiki` instead. The close still
> routes to the producer (ADR-033), as every close does.

1. **Append a new dated entry to `log.md`** that records all three old-form emissions:
   - Names each by the **task folder ID** (`0199`, `0206`) and by a **durable, re-derivable anchor** —
     *"the run-ending flag lines of the 2026-08-03 sync entry"* / *"of the 2026-08-03 lint entry"*.
     **No line numbers.** The paired identification is the §1.1 rider working: a reader can re-derive
     the location even after the file grows.
   - States the fact plainly: these carry the **pre-`0173` flag form**, which hardcodes a `backlog/`
     path; the paths were **correct at emission and are still correct on 2026-08-03**; they become
     dead the moment `0199` or `0206` closes; and the current form (post-`0173`) emits a **folder ID
     only**, with the caller resolving it by glob.
   - **Does not restate the dead-or-live status as a fixed fact.** Write it as *"correct as of
     2026-08-03; dies when the task closes"*, so the entry does not itself become a stale claim.
2. **Leave the three original entries byte-unchanged.** Append-only. Do not edit, do not rewrite, do
   not annotate in place — **owner ruling 2026-08-03, recorded above; this is settled, not optional.**
3. **State the write scope in the entry**, in the vault's established form: only `ai-agents/wiki-vault/`
   touched, nothing committed, nothing staged, no task moved, no mover invoked.

### Out of scope

- **⛔ Do NOT edit `0148`'s closed review ledger.** It carries a `backlog/` path for a task now in
  `done/`, and that is **correct content in a frozen ledger**, not a defect. It is deliberately not
  this task's business.
- **⛔ Do NOT edit the three original log entries in place.** In-place annotation of a past `log.md`
  entry is **forbidden outright** by the owner's 2026-08-03 ruling recorded in Context above.
- **⛔ Do NOT sweep the further prose rank citations in `log.md`.** See the scoping call below.
- **⛔ Do NOT touch any brief, sprint plan, ADR, report, skill, agent definition or source file.** The
  only write surface is `ai-agents/wiki-vault/`.
- **⛔ Do NOT invoke `/fkit-task-done` or `/fkit-task-cancelled`, and do not move any task folder.**
  `0199` and `0206` staying open is a *precondition* of this task's own description, not an oversight.
- **⛔ Write no `:NNN` line-number citations anywhere** — not in the log entry, not in the hand-off
  report. Writing one here would reproduce the defect class this task exists to record.

### Scoping call — made here, and stated so it is not re-litigated

**`0160`'s report §5.3 leaves an explicitly open question**: beyond the specimens it confirmed, it lists
**further prose rank citations found in the same read-only scan of `log.md`** and records, in its own
words, that it has *"not classified which are live claims and which are frozen history"* and **flags
that as unverified**.

**Ruling: those are OUT of this task's scope.** Three reasons:

1. **Different defect class.** Those are **board-rank citations in prose** (the report's cases 1 and 2).
   This task is about the **completion-flag path form** (case 4). Different remedy, different rule.
2. **The inventory is unverified by the report's own admission.** Folding an unclassified list into a
   task whose scope is three known, verified emissions would make the task unshippable until someone
   does the classification work.
3. **Smallest independently shippable unit.** Three known emissions is a bounded, verifiable job. The
   rank sweep is a separate one.

**Follow-up, named not filed:** *classify the unclassified `log.md` rank citations from `0160` §5.3 and
decide which need annotation.* The producer files it if the owner wants it.

## Verification steps

1. A new dated entry exists at the bottom of `ai-agents/wiki-vault/log.md` recording all **three**
   old-form emissions, naming `0199` (twice) and `0206` (once).
2. Each is located by a **durable anchor** — the dated entry it sits in, plus which run-ending flag line
   — and by **task folder ID**. Show that no line number was written.
3. The entry states that the paths were **correct at emission and correct on 2026-08-03**, and that they
   die when the named task closes. **It must not claim they are dead today.**
4. `git diff` on `log.md` shows **zero deletions** — append-only preserved, no past entry edited. State
   the command run and its output, not just the conclusion.
5. `git status --porcelain` with `ai-agents/wiki-vault/` excluded returns **nothing** — no brief, sprint
   plan, ADR, report, skill or source file touched.
6. `0148`'s review ledger is unchanged.
7. `grep` for `\.md:[0-9]` over the diff returns nothing.
8. Nothing committed, nothing staged. No task folder moved; no mover invoked.
9. State in the hand-off whether `0199` and `0206` were still in `ai-agents/tasks/backlog/` at the time
   the entry was written. If either has closed in the meantime, **say so and adjust the wording** — the
   entry describes a live state and must be accurate at the moment it is appended.

## Owner rulings on record

**Both questions this brief carried were ruled by the owner on 2026-08-03, live via `AskUserQuestion`
in a `/fkit-sprint-ship-loop` driver session, and relayed here by a spawned producer with no owner
channel. Neither is open any more.**

1. **✅ RULED — `log.md` is append-only; in-place annotation is forbidden, always.** A correction is a
   **new dated entry** naming what it corrects by **folder ID and durable anchor**; originals stay
   **byte-identical**. Ruled **once, for this task and `0199` together**, as this brief recommended.
   The full ruling, its rationale and its provenance are in Context above; the same ruling is recorded
   against `0199`'s affected step in that task's own brief. **This task's default deliverable already
   matched the ruling — nothing in *What to build* changes.**
2. **✅ RULED — run this task NOW, as its own task.** Not folded into `0199`'s or `0206`'s closes, and
   not deferred until either closes. This matches the brief's recommendation and its reason: the whole
   lesson of the *"correct at emission, dead later"* class is that **nobody notices at close time**.
   ⚠️ **"Run now" is a scheduling intent, not a board move.** This task **stays on
   `ai-agents/sprints/backlog.md` at rank `—` (unranked)**, under the owner's standing 2026-08-02
   ruling. It does **not** move to `sprint-2.md` and it does **not** get a sprint rank. What "now"
   means is that a driver pulls it deliberately this run.

## Notes

- **Owner:** fkit-wiki — the write is inside `ai-agents/wiki-vault/`, which is that role's **exclusive**
  write surface under ADR-005. No other role may perform it.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Relates to `0199` and `0206` — but does not depend on them, and is deliberately best done while both
  are still open.** If either closes first, this task's subject changes from *"paths that will die"* to
  *"paths that have died"*, and the wording in item 1 must be adjusted to match. The verification steps
  cover that case.
- **Source:** surfaced 2026-08-03 during the `/fkit-sprint-ship-loop` run that closed `0173`; the owner
  ruled the same day, live via `AskUserQuestion`, **"file a brief to `backlog.md`"**.
- **Why the Backlog board and not Sprint 2:** the owner's standing ruling of 2026-08-02 — a brief not
  required to ship **in the current sprint alongside the other tasks** goes to `backlog.md`. Nothing
  here is required to ship in Sprint 2, and nothing in Sprint 2 waits on it.
- **No `On merit` statement, by design:** the Backlog board is **unranked** (`## Priority: Unscheduled`,
  board cell `—`). A merit statement is what a *ranked* board brief carries; there is no rank here for
  it to diverge from.
- No commit — leave the edit in the working tree.
