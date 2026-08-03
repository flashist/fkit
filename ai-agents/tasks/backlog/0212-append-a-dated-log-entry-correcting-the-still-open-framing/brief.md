# Append a dated `log.md` entry correcting the `"still open"` framing on two frozen vault log entries

## ID
0212

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

Two frozen entries in `ai-agents/wiki-vault/log.md` still say that `0143`'s **dated-correction-note
fix is "still open"**. It is not: `0143` shipped on **2026-08-02** (`+71 / −0`), and `0195` added two
further correction blocks the same day (`+53 / −0`). The framing was true when written and became
false on 2026-08-02.

**The two entries, named by durable anchor — re-derive them at run time, do not trust a line number:**

| Entry | Where in it | What it says |
|---|---|---|
| The **2026-07-26 ingest (sync)** entry whose roll-up records the vault at **161 pages** | `⚠️ Flagged for human review`, the **ADR-010 stale-text** item | ADR-010's *"team room (menu option 7)"* is stale and deliberately unrepaired; *"the sanctioned fix is a **dated correction note**, an architect call, **still open**"* |
| The **2026-07-26 ingest (sync)** entry whose roll-up records the vault at **166 pages** | `⚠️ Flagged for human review`, the **ADR-029 §Decision 6** item | `dashboard.sh` still derives task identity from the mutable Priority cell; *"the sanctioned fix is task `0143`'s dated-correction-note form, **still open**"* |

⚠️ **There are two 2026-07-26 `ingest (sync)` entries and the date alone does not disambiguate them.**
The page-count roll-up is what separates them — 161 pages for the first, 166 for the second. Use that,
plus the item's subject, as the anchor. **Write no line numbers.**

**Re-derive the set before writing.** These two are the confirmed minimum, checked on disk 2026-08-03.
Run `grep -rn "still open" ai-agents/wiki-vault/log.md` at run time and classify each hit: the other
hits found on 2026-08-03 refer to **unrelated** open items (the sync procedure's structural blind spot,
`prove-red`'s R2 no-op mode, the missing `dual-home-parity` test, standing flags from earlier entries)
and are **correct as written — leave them alone**. Only the hits asserting *`0143`'s correction note is
still open* are in scope.

### ✅ Why this is an append, never an edit — OWNER RULING 2026-08-03

> **A wiki run may NEVER edit or annotate a past `log.md` entry in place.** A correction lands as a
> **new dated entry** that names what it corrects by **folder ID and durable anchor**. The original
> entries stay **byte-identical**.
>
> **Rationale as ruled:** it matches the append-only guarantee in `log.md`'s own header and in
> `schema.md`, and it matches the form the knowledge-base correction-note already uses.
>
> **Provenance:** given live via `AskUserQuestion` in a `/fkit-sprint-ship-loop` driver session on
> **2026-08-03**, and relayed here by a spawned producer with no owner channel. The same ruling is
> recorded in `0199`'s and `0211`'s briefs.

### ⛔ This row must NOT overlap `0211` — two defect classes, two entries, deliberately not merged

`0211` also appends a new dated `log.md` entry, and it is **a different job**:

| | `0211` | `0212` (this task) |
|---|---|---|
| Defect class | **Old-form completion-flag paths** — three emissions carrying the pre-`0173` hardcoded `backlog/` brief path | **`"still open"` framing** — two entries asserting `0143`'s fix is unshipped |
| Entries corrected | The 2026-08-03 sync entry (two flag lines) and the 2026-08-03 lint entry (one) | The two 2026-07-26 ingest (sync) entries above |
| Tasks named | `0199` (twice), `0206` (once) | `0143` (and `0195` as the second shipment) |

**The owner ruled that each log entry should be about one thing.** So this is a **separate appended
entry**, not a paragraph bolted onto `0211`'s. If both tasks happen to run in the same session, they
still produce **two** dated entries. **Do not merge them, and do not restate `0211`'s content here.**

## What to build

**A wiki-role change, inside `ai-agents/wiki-vault/` only.** `fkit-wiki` is the exclusive write gateway
for the vault (ADR-005); no other role may perform this.

> ⛔ **ROUTING — build this with `@fkit-wiki`, never a coder.** `/fkit-sprint-ship-loop`'s step table
> names the **coder** as the builder for a generic task. **That table does not apply here.** The only
> write surface is `ai-agents/wiki-vault/`, which ADR-005 makes the wiki role's **exclusive** surface,
> and that is a **universal hard rule** — it outranks a skill's step table. A driver that spawns a
> coder for this task is asking it to break a hard rule; spawn `@fkit-wiki` instead. The close still
> routes to the producer (ADR-033), as every close does.

1. **Append one new dated entry to `log.md`** that corrects the `"still open"` framing:
   - Names each corrected entry by **task folder ID** (`0143`, and `0195` as the follow-on shipment)
     **and by a durable, re-derivable anchor** — the dated entry plus its page-count roll-up plus the
     flagged item's subject, exactly as the table in *Context* does. **No line numbers.**
   - States the fact plainly: `0143` shipped **2026-08-02** (`+71 / −0`), `0195` the same day
     (`+53 / −0`); ADR-010 now carries **five** dated correction blocks and a `- **Corrections:**`
     header item with **two site lists**; ADR-010's `Status` remains `accepted`. The `"still open"`
     framing was **true when written and became false on 2026-08-02**.
   - **Says what is NOT being claimed.** The ADR-029 §Decision 6 item's *other* half — that
     `dashboard.sh` derives identity from the mutable Priority cell — is a **separate claim with its
     own lifetime**. Only the *"the fix is still open"* half is corrected here. Re-check that half at
     run time and, if it too has changed, say so as a distinct statement rather than folding it in.
2. **Leave both original entries byte-unchanged.** Append-only. Do not edit, do not rewrite, do not
   annotate in place — **owner ruling 2026-08-03, recorded above; this is settled, not optional.**
3. **State the write scope in the entry**, in the vault's established form: only
   `ai-agents/wiki-vault/` touched, nothing committed, nothing staged, no task moved, no mover invoked.

### Out of scope

- ⛔ **Do NOT do `0211`'s job.** The old-form completion-flag paths are `0211`'s entry. Two defect
  classes, two entries — see the table in *Context*.
- ⛔ **Do NOT clear `"still open"` from ordinary vault pages.** That half belongs to `0199` (its
  `index.md` `0140` entry and the ADR-010 vault page). This task is **`log.md` only**.
- ⛔ **Do NOT edit the two original entries in place**, or any other past `log.md` entry.
- ⛔ **Do NOT touch the unrelated `"still open"` hits** — the sync blind spot, `prove-red` R2, the
  missing parity test, the standing earlier-entry flags. They are correct as written.
- ⛔ **Do NOT touch any brief, sprint plan, ADR, report, skill, agent definition or source file.**
- ⛔ **Do NOT invoke `/fkit-task-done` or `/fkit-task-cancelled`, and do not move any task folder.**
- ⛔ **Write no `:NNN` line-number citations anywhere** — not in the log entry, not in the hand-off
  report. `0173` prohibits them in a flag, and the durable-anchor half of the append-only ruling is the
  same principle: a coordinate into an append-only file rots as the file grows.

## Verification steps

1. A new dated entry exists at the bottom of `ai-agents/wiki-vault/log.md` correcting the `"still
   open"` framing, naming `0143` and the 2026-08-02 shipment.
2. Each corrected entry is located by a **durable anchor** — its date, its page-count roll-up, and the
   flagged item's subject — **and** by task folder ID. Show that no line number was written.
3. `git diff ai-agents/wiki-vault/log.md` shows **zero deletions** — append-only preserved, no past
   entry edited. State the command run and its output, not just the conclusion.
4. `grep -rn "still open" ai-agents/wiki-vault/log.md` still returns the two original hits, unchanged.
   **Their survival is the expected result, not a failure** — the correction is the new entry, not
   their removal.
5. The new entry does **not** restate `0211`'s subject (old-form completion-flag paths). If `0211` has
   already run, the two entries are visibly about different things.
6. `grep -nE '\.md:[0-9]' ` over the diff returns nothing.
7. `git status --porcelain` with `ai-agents/wiki-vault/` excluded returns **nothing** — no brief,
   sprint plan, ADR, report, skill or source file touched.
8. Nothing committed, nothing staged. No task folder moved; no mover invoked.
9. The wiki run's own completion flag is emitted per the wiki skills' convention as tightened by `0173`
   (closed 2026-08-03): it carries this task's **folder ID only** — `0212` — in one of the two exact
   forms (`Task 0212's vault work is complete — ready to close` or `Task 0212: partial — not ready to
   close`), with **no brief path** and **no `:NNN` coordinate**.

## Notes

- **Owner:** `fkit-wiki` — the write is inside `ai-agents/wiki-vault/`, that role's **exclusive** write
  surface under ADR-005. No other role may perform it.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Relates to `0199`** — this row carries the `log.md` half that `0199`'s *What to build* item 5
  originally contained. The append-only ruling made that half unperformable inside `0199`, and the
  owner ruled it a **separate row** rather than folding it into `0199` or `0211`. `0199` keeps the
  ordinary-vault-page half (`index.md`, the ADR-010 vault page); this row keeps `log.md`. Neither
  blocks the other, and either order works.
- **Relates to `0211`** — same file, adjacent moment, **different defect class**. `0211` owns the
  old-form completion-flag paths; this row owns the `"still open"` framing. Deliberately not merged:
  the owner ruled that each log entry should be about one thing.
- **Source:** surfaced 2026-08-03 by the spawned producer that recorded the append-only ruling into
  `0199` and `0211`; filed on the owner's ruling of the same day, given live via `AskUserQuestion` in a
  `/fkit-sprint-ship-loop` driver session and relayed by a spawned producer with no owner channel.
- **Why the Backlog board and not Sprint 2:** the owner's standing ruling of 2026-08-02 — a brief not
  required to ship **in the current sprint alongside the other tasks** goes to `backlog.md`. Nothing
  here is required to ship in Sprint 2, and nothing in Sprint 2 waits on it. Rank stays `—`.
- **No `On merit` statement, by design:** the Backlog board is **unranked** (`## Priority:
  Unscheduled`, board cell `—`). A merit statement is what a *ranked* board brief carries; there is no
  rank here for it to diverge from.
- No commit — leave the edit in the working tree.
