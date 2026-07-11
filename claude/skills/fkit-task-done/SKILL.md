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
- the parent epic file, if step 2 found a `## Parent / Epic`

```
grep -rn "<file>.md" ai-agents/sprints/ ai-agents/tasks/
```

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

Make the **minimal** edit that flips the status accurately. Do not restructure tables or rewrite
descriptions beyond removing a fragment that is now false.

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
- **Updated:** each doc touched and how (e.g. "`plan-sprint-4.md` — status row → ✅ Done";
  "`refactor-auth-flow.md` — T4f slice → ✅ Done").
- **Flagged:** anything not auto-resolved (no sprint row found, mismatch, multiple matches).
- Remind that nothing was committed — the move + edits are staged/working-tree only.

---

## Rules
- **Do not commit** anything (the project rule: commit only when the owner explicitly asks).
- Only ever move the task **into `done/`** — this skill does not handle cancellation (`cancelled/`).
- Keep edits minimal and accurate; surface anything uncertain instead of guessing.
