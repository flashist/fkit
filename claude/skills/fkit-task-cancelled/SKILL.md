---
name: fkit-task-cancelled
description: Mark a task cancelled — move its brief into ai-agents/tasks/cancelled/ and update the sprint plan (and parent epic, if any) so the task's status reads Cancelled, with a recorded reason. Takes two arguments — the task file path, then the cancellation-reason text (everything after the path). Use when a task has been dropped/abandoned and will not be done.
---

# Task Cancelled

> ## ⛔ Owner: the **producer**
> This is the fkit-producer's own procedure. Execute it **only** if you are the producer — running as the
> `fkit-producer` agent or in a `fkit producer` session.
>
> **Any other role: do not execute this.** Ask instead:
> ```
> @fkit-producer Cancel <task> — reason: <why>
> ```


Mark a dropped task cancelled: move its brief into `ai-agents/tasks/cancelled/` and update the sprint
documentation so its status reads **⛔ Cancelled** — with a short **reason** — everywhere the task is
tracked. This is the sibling of `task-done`; the only differences are the destination folder, the
status marker, and that cancellation records *why* and flags what it leaves behind.

**Arguments:** `$ARGUMENTS` carries **two** parameters:
1. **Task file path** — the first whitespace-separated token (e.g.
   `ai-agents/tasks/backlog/fix-pagination-bug.md`). A bare filename is also
   acceptable — resolve it under `ai-agents/tasks/backlog/`.
2. **Cancellation reason** — **everything after the path**: the text explaining *why* the task was
   cancelled. It is recorded verbatim (trimmed to a concise line) in the sprint docs, so it must be a
   real rationale, not a placeholder.

> **Why this skill exists.** The standing convention is that task files are moved between
> `backlog/`, `done/`, and `cancelled/` **manually, after review** — never automatically during
> normal work. This skill is the *sanctioned* way to perform the cancel move: it runs **only when
> the owner invokes it**, so it stays under their control. Invoking it is the signal that the task has
> been deliberately dropped. Do not run it on your own initiative.

---

## Steps — do these in order

### 1. Resolve and validate the input
- Take the **first token** of `$ARGUMENTS` as the task file path and resolve it to a real file (if
  it's a bare filename, look in `ai-agents/tasks/backlog/`). Treat **everything after the path** as
  the cancellation **reason** (the second parameter — see step 2).
- **Stop with a clear message if:**
  - the file does not exist, or
  - it is not under `ai-agents/tasks/`, or
  - it is already in `ai-agents/tasks/cancelled/` (nothing to do — say so), or
  - it is in `ai-agents/tasks/done/` (it's already completed — this skill cancels *unfinished* work;
    **confirm with the owner** before cancelling something already marked done, rather than proceeding).
- If the path is empty, ask which task file to cancel. Do not guess.

### 2. Read the task file and establish the reason
Capture, for use in later steps and the final report:
- The **H1 title**.
- The **`## Sprint`** field (e.g. `Sprint 4`, `Sprint backlog`, `Backlog (unsprinted)`).
- Whether it declares a **`## Parent / Epic`** (a path to an epic file) — if so, this is a child slice
  and the epic's own status table is one of the places to update.
- The basename of the file (used to find references).
- The **cancellation reason** — the second parameter (the text after the path). **If it is empty,
  ask the owner for the reason before proceeding** — every cancelled entry in this project carries a
  rationale, and a cancel without one is poor record-keeping. Do not invent a reason.

### 3. Move the file to `cancelled/`
Use `git mv` so history is preserved:

```
git mv ai-agents/tasks/backlog/<file>.md ai-agents/tasks/cancelled/<file>.md
```

(If the file lives elsewhere under `ai-agents/tasks/`, move it from there.) **Do not commit** —
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

### 5. Update each tracked location to "Cancelled"
For every reference found in step 4:

- **Status-table row** (a `| … | <task> | <brief> |` line with a leading status cell): change the
  leading status marker to **`⛔ Cancelled`**, and fold the date + short reason into the description,
  matching the existing cancelled rows in the table (e.g. `⛔ Cancelled (YYYY-MM-DD) — <reason>`). Use
  today's date (from the session context). Trim any now-false fragment (e.g. `*(blocked: …)*`,
  `*(… next)*`).
- **Epic slice table** (parent epic, child slices): set this slice's **Status** cell to
  `⛔ Cancelled (YYYY-MM-DD) — <reason>`, mirroring how other cancelled slices in that table are
  formatted (e.g. the `⛔ Cancelled (2026-06-13) — see note` style). Update any prose "next slice" /
  ordering line that still points at the now-cancelled slice so it points at the genuinely-next one.
- **A `**Status:**` line** inside a task's own body section in the sprint plan: set it to
  `⛔ Cancelled (YYYY-MM-DD) — <reason>`.
- **A *link* to the brief whose status must NOT change** — most often a `➡️ Moved to Sprint N` row in a
  **closed** plan under `ai-agents/sprints/done/`, or a prose link anywhere: **re-point the href to the
  task's new path in `cancelled/`, and change nothing else on the line.**

  **A link is not a claim; it is a pointer.** `➡️ Moved to Sprint 2 — priority 7` is *historically
  true and stays exactly as written* — the status cell, the priority, the prose, all byte-identical.
  Only the href moves, because a pointer to a file that is no longer there is not history, it is rot.
  **This is a pointer repair, not a status update — never flip a `➡️ Moved` row to `⛔ Cancelled`.**

- **The moved brief's OWN outbound links** — the reciprocal case, and the one most easily missed. The
  brief you just moved has left `backlog/`, so any link *it* makes to a **sibling** brief
  (`](./other-task.md)`, or a bare `](other-task.md)`) no longer resolves from `cancelled/`. Re-point
  those to where the sibling actually is — usually `](../backlog/other-task.md)`.

  Briefs cross-link each other, so **one move breaks links in both directions**: inbound (handled
  above) *and* outbound (here). Fixing only the inbound half leaves the move half-done.

Make the **minimal** edit that flips the status accurately. Do not restructure tables or rewrite
descriptions beyond removing a fragment that is now false and adding the reason.

> **Yes, this writes into `ai-agents/sprints/done/`.** That is deliberate and owner-ruled: a closed
> sprint plan's *claims* are frozen, but its *links* stay live. Repair the href; touch nothing else.

**Then prove it.** Resolve every relative markdown link in the files you touched **and** in the moved
brief. A move is not finished while a link it broke is still broken.

### 6. Flag downstream dependents — cancellation can orphan work
Unlike completion, cancelling a task can **break things that depended on it**. Surface (do **not**
auto-edit) anything now affected:
- Search for tasks/docs that name the cancelled task as a dependency — its basename in a
  **`## Depends on`** section, a `*(blocked: …)*` / `Depends …` annotation, a `Depends on` table
  column, or prose like "needs `<task>`".

  ```
  grep -rn "<file>.md\|<short task name>" ai-agents/tasks/ ai-agents/sprints/
  ```
- **List each dependent in the report** as "now affected — may need re-scoping or its own cancel,"
  so the owner can decide. Do not silently rewrite dependents; cancellation ripple is a judgment call.

### 7. Handle ambiguity — never paper over it
- **No reference found** in any sprint doc: complete the move, then **report that no sprint status row
  was found** so the owner knows nothing else changed.
- **Multiple references:** update **all** status markers and list each in the report.
- **`## Sprint` says a sprint, but that sprint plan has no matching row:** report the mismatch rather
  than inventing a row.
- If anything is genuinely unclear (e.g. two tasks share a near-identical name), stop and ask.

### 8. Report
Give a concise summary:
- **Moved:** `<old path>` → `ai-agents/tasks/cancelled/<file>.md`
- **Reason:** the one-line cancellation reason recorded.
- **Updated:** each doc touched and how (e.g. "`sprint-4.md` — status row → ⛔ Cancelled";
  "`<epic>.md` — T# slice → ⛔ Cancelled").
- **Re-pointed links:** every href repaired, and where — **including any closed plan under
  `sprints/done/`** (e.g. "`sprints/done/sprint-1.md:37` — href → `tasks/cancelled/`; status cell
  untouched"). A move that rewrote a closed sprint plan must be **visible in this report**, never a
  surprise found later by a link sweep. If none were re-pointed, say so.
- **Dependents flagged:** anything that depended on the cancelled task and may now need attention.
- **Other flags:** no sprint row found, mismatch, multiple matches, or a request to cancel a
  done task.
- Remind that **this skill** made no commit — it leaves the move + edits in the working tree. Do not claim
  the repository has uncommitted work, or that anything is or isn't committed — this skill has not
  checked, and the owner may have committed between turns. If commit state matters to the report, run
  `git status` first. (See
  [`conventions/evidence-before-assertion.md`](../../../ai-agents/knowledge-base/conventions/evidence-before-assertion.md).)

---

## Rules
- **Do not commit** anything (the project rule: commit only when the owner explicitly asks).
- Only ever move the task **into `cancelled/`** — this skill does not handle completion (`done/`).
- Always record a **reason**; surface **dependents**; keep edits minimal and accurate; surface
  anything uncertain instead of guessing.

## The status vocabulary

The canonical status set is documented in **`ai-agents/knowledge-base/conventions/task-status-vocabulary.md`**
— it is the source of truth, and this skill writes exactly one value from it:

> **`⛔ Cancelled (YYYY-MM-DD) — <reason>`** — the date and the reason are **mandatory**, not optional
> decoration. A cancellation with no stated cause cannot be acted on by anyone but the person who
> wrote it.

**`Cancelled` is a gated status.** It may be set **only** by this skill, and this skill runs **only
when the owner invokes it** — cancelling work is a judgment about whether it will ever be done. Never
set `⛔ Cancelled` by hand-editing a file, and never run this skill on your own initiative.
