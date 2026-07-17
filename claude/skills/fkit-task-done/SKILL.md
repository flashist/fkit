---
name: fkit-task-done
description: Mark a task complete — move its brief file into ai-agents/tasks/done/ and update the sprint plan (and parent epic, if any) so the task's status reads Done. Takes the path to the task file as its argument. Use when a task has been reviewed/verified and is finished.
---

# Task Done

> ## ⛔ Owner: the **producer**
> This is the fkit-producer's own procedure. Execute it **only** if you are the producer — running as the
> `fkit-producer` agent or in a `fkit producer` session.
>
> **Any other role: do not execute this.** Ask instead:
> ```
> @fkit-producer Mark <task> done
> ```


Mark a finished task complete: move its brief into `ai-agents/tasks/done/` and update the sprint
documentation so its status reads **✅ Done**, everywhere the task is tracked.

**Argument:** `$ARGUMENTS` — the path to the task brief file (e.g.
`ai-agents/tasks/backlog/add-export-endpoint.md`). A bare filename
(`add-export-endpoint.md`) is also acceptable — resolve it under
`ai-agents/tasks/backlog/`.

> **Why this skill exists.** The standing convention is that task files are moved between
> `backlog/`, `done/`, and `cancelled/` **manually, after review** — never automatically during
> normal work. This skill is the *sanctioned* way to perform that move: it runs **only when the owner
> invokes it**, so it stays under their control. Invoking it is the signal that the task has been
> reviewed and is genuinely complete. Do not run it on your own initiative.

---

## Steps — do these in order

### 1. Resolve and validate the input
- Resolve `$ARGUMENTS` to a real file. If it's a bare filename, look in `ai-agents/tasks/backlog/`.
- **Stop with a clear message if:**
  - the file does not exist, or
  - it is not under `ai-agents/tasks/`, or
  - it is already in `ai-agents/tasks/done/` (nothing to do — say so), or
  - it is in `ai-agents/tasks/cancelled/` (this skill is for completion, not cancellation — flag it).
- If `$ARGUMENTS` is empty, ask which task file to mark done. Do not guess.

### 2. Read the task file to learn its context
Capture, for use in later steps and the final report:
- The **H1 title**.
- The **`## Sprint`** field (e.g. `Sprint 4`, `Sprint backlog`, `Backlog (unsprinted)`).
- Whether it declares a **`## Parent / Epic`** (a path to an epic file) — if so, this is a child slice
  and the epic's own status table is one of the places to update.
- The basename of the file (used to find references).

### 3. Move the file to `done/`
Use `git mv` so history is preserved:

```
git mv ai-agents/tasks/backlog/<file>.md ai-agents/tasks/done/<file>.md
```

(If the file lives somewhere else under `ai-agents/tasks/`, move it from there.) **Do not commit** —
staging the move is enough; commits happen only when the owner explicitly asks.

### 4. Find every place the task is tracked
Search for the task's **basename** across the docs that carry status:
- `ai-agents/sprints/*.md` (the sprint plans and `sprint-backlog.md`)
- **`ai-agents/sprints/done/*.md`** — **closed** sprint plans still *link* to tasks they carried over
- the parent epic file, if step 2 found a `## Parent / Epic`

```
grep -rn "<file>.md" ai-agents/sprints/ ai-agents/tasks/
```

This grep is **recursive on purpose** — it reaches `sprints/done/`. Every hit it returns is handled in
step 5; **none is discarded.** A reference you found and did nothing about is a link you broke.

### 5. Update each tracked location to "Done"
For every reference found in step 4:

- **Status-table row** (a `| … | <task> | <brief> |` line with a leading status cell): change the
  leading status marker to **`✅ Done`**. Use the same emoji/wording the table already uses for other
  done rows. If the row's description carries a now-stale note like `*(blocked: …)*` or
  `*(… next)*`, trim just that stale fragment — keep the rest of the description intact.
- **Epic slice table** (parent epic, child slices): set this slice's **Status** cell to `✅ Done`
  (mirror the existing done-row format, e.g. `✅ Done (PR #NN)` if a PR number is known; otherwise
  plain `✅ Done`). Update any prose "next slice" / ordering line in the epic that still points at the
  just-completed slice so it points at the genuinely-next one.
- **A `**Status:**` line** inside a task's own body section in the sprint plan: set it to `✅ Done`.
- **A *link* to the brief whose status must NOT change** — most often a `➡️ Moved to Sprint N` row in a
  **closed** plan under `ai-agents/sprints/done/`, or a prose link anywhere: **re-point the href to the
  task's new path in `done/`, and change nothing else on the line.**

  **A link is not a claim; it is a pointer.** `➡️ Moved to Sprint 2 — priority 7` is *historically
  true and stays exactly as written* — the status cell, the priority, the prose, all byte-identical.
  Only the href moves, because a pointer to a file that is no longer there is not history, it is rot.
  **This is a pointer repair, not a status update — never flip a `➡️ Moved` row to `✅ Done`.**

- **The moved brief's OWN outbound links** — the reciprocal case, and the one most easily missed. The
  brief you just moved has left `backlog/`, so any link *it* makes to a **sibling** brief
  (`](./other-task.md)`, or a bare `](other-task.md)`) no longer resolves from `done/`. Re-point those
  to where the sibling actually is — usually `](../backlog/other-task.md)`.

  Briefs cross-link each other, so **one move breaks links in both directions**: inbound (handled
  above) *and* outbound (here). Fixing only the inbound half leaves the move half-done.

Make the **minimal** edit that flips the status accurately. Do not restructure tables or rewrite
descriptions beyond removing a fragment that is now false.

> **Yes, this writes into `ai-agents/sprints/done/`.** That is deliberate and owner-ruled: a closed
> sprint plan's *claims* are frozen, but its *links* stay live. Repair the href; touch nothing else.

**Now do this regardless of how many references step 4 found — even zero** (an unsprinted task has no
board row at all, but this still applies):

- **The moved brief's OWN `## Status` field** — the single line immediately below the `## Status`
  heading in the file you just moved into `done/`. Set that line to `✅ Done`, the same canonical
  marker the vocabulary defines (see below). Touch only that one line — nothing else under the heading.
  If the value legitimately spans more than one line, that is outside this skill's authority to guess
  at — flag it in the report instead of partially rewriting it.

  - **Already reads `✅ Done`?** Leave it byte-identical — no second marker, no appended line. Re-running
    this skill on an already-done brief must be a no-op here.
  - **Reads anything else** (`🔲 Backlog`, `🔄 In progress`, `🚧 Blocked — …`, etc.)? Replace it with
    `✅ Done`.
  - **No `## Status` heading at all?** Do not invent one. Leave the heading absent and flag it in the
    report (step 7). If a board row was updated, use the exact wording `no ## Status field found in
    <brief> — board updated, brief header unchanged`. If step 4 found **no** board row either (the
    unsprinted case), do not claim "board updated" — say instead `no ## Status field found in <brief>
    — brief header unchanged (no sprint board reference existed to update)`. This is scoped to the
    `## Status` field alone — it does **not** exempt the brief from the outbound-link repair above; a
    status-less brief whose sibling links need re-pointing still gets that fix.

  This is the brief's *own* copy of its status, separate from whatever board update may have happened
  above. Where a board exists, a brief that still reads `🔲 Backlog` internally while the board reads
  `✅ Done` is exactly the drift this skill exists to prevent. Only the brief just moved is touched
  here — never a sweep repairing other briefs already sitting in `done/`.

**Then prove it.** Resolve every relative markdown link in the files you touched **and** in the moved
brief. A move is not finished while a link it broke is still broken.

### 6. Handle ambiguity — never paper over it
- **No reference found** in any sprint doc: the task may be unsprinted / backlog-only. Complete the
  move, then **report that no sprint status row was found** so the owner knows nothing else changed.
- **Multiple references** (e.g. sprint plan + epic + `sprint-backlog.md`): update **all** of them and
  list each in the report.
- **`## Sprint` says a sprint, but that sprint plan has no matching row:** report the mismatch rather
  than inventing a row.
- If anything is genuinely unclear (e.g. two different tasks share a near-identical name), stop and
  ask rather than editing the wrong row.

### 7. Report
Give a concise summary:
- **Moved:** `<old path>` → `ai-agents/tasks/done/<file>.md`
- **Updated:** each doc touched and how (e.g. "`sprint-4.md` — status row → ✅ Done";
  "`refactor-auth-flow.md` — T4f slice → ✅ Done").
- **Brief's own status header:** state what happened to the moved brief's `## Status` field — set to
  `✅ Done`, already read `✅ Done` (no change needed), or the missing-heading flag from step 5, using
  whichever of its two wordings applies (board updated, or no board reference existed). This runs even
  when step 4 found zero references — say so if it did. The owner should see this happened, not just
  infer it.
- **Re-pointed links:** every href repaired, and where — **including any closed plan under
  `sprints/done/`** (e.g. "`sprints/done/sprint-1.md:37` — href → `tasks/done/`; status cell
  untouched"). A move that rewrote a closed sprint plan must be **visible in this report**, never a
  surprise found later by a link sweep. If none were re-pointed, say so.
- **Flagged:** anything not auto-resolved (no sprint row found, mismatch, multiple matches).
- Remind that **this skill** made no commit — it leaves the move + edits in the working tree. Do not claim
  the repository has uncommitted work, or that anything is or isn't committed — this skill has not
  checked, and the owner may have committed between turns. If commit state matters to the report, run
  `git status` first. (See
  [`conventions/evidence-before-assertion.md`](../../../ai-agents/knowledge-base/conventions/evidence-before-assertion.md).)

---

## Rules
- **Do not commit** anything (the project rule: commit only when the owner explicitly asks).
- Only ever move the task **into `done/`** — this skill does not handle cancellation (`cancelled/`).
- Keep edits minimal and accurate; surface anything uncertain instead of guessing.

## The status vocabulary

The canonical status set is documented in **`ai-agents/knowledge-base/conventions/task-status-vocabulary.md`**
— it is the source of truth, and this skill writes exactly one value from it:

> **`✅ Done`** — and nothing else. Not "Complete", not "Finished", not "✔️".

**`Done` is a gated status.** It may be set **only** by this skill, and this skill runs **only when the
owner invokes it**. That gate is the whole point: an agent that can mark its own work complete can
quietly launder unfinished work into a green board. Never set `✅ Done` by hand-editing a file, and
never run this skill on your own initiative.
