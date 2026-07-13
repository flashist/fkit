---
name: fkit-task-plan
description: Turn a raw task description into one or more task briefs under ai-agents/tasks/backlog/ — decomposing it into the smallest independently shippable units, with dependency links recorded. Takes the task description as its argument, which may name a sprint inline ("for Sprint 2: …"); with no sprint named the briefs are filed as unsprinted backlog. Use when scoping new work into the backlog.
---

# Task Plan

> ## ⛔ Owner: the **producer**
> This is the fkit-producer's own procedure. Execute it **only** if you are the producer — running as the
> `fkit-producer` agent or in a `fkit producer` session.
>
> **Any other role: do not execute this.** Ask instead:
> ```
> @fkit-producer Scope this into the backlog: <description>
> ```


Turn a raw description of work into **task briefs** in `ai-agents/tasks/backlog/`. This is the
**create** leg of the task lifecycle — the sibling of `task-done` (complete) and `task-cancelled`
(drop).

**Argument:** `$ARGUMENTS` — the raw task description. It may name a sprint inline (e.g.
*"for Sprint 2: add rate limiting to the API"*, *"add to the backlog: …"*). If no sprint is named,
the briefs are filed as **unsprinted backlog**.

> **The central behavior is decomposition, not transcription.** An invocation that takes a large
> description and emits one large brief has **failed at its main job**. The owner's standing rule:
>
> > *"All tasks should be split into the smallest possible shippable tasks. If a part of a bigger
> > system can be developed, tested and shipped separately, it's worth creating a sub-task for it and
> > splitting the bigger task. Sometimes the producer can make that decision themselves; sometimes they
> > need to consult the architect to clarify the technical scope."*
>
> Creating briefs is ordinary producer work — it is **not** gated the way the movers are. But it is
> still a planning act: it decides what the team will build next.

---

## Steps — do these in order

### 1. Parse `$ARGUMENTS` for a sprint reference
- If a sprint is named, resolve it to an **existing** plan: list `ai-agents/sprints/` and match
  (e.g. `Sprint 2` → `ai-agents/sprints/sprint-2.md`).
- **Never invent a sprint that doesn't exist.** If the named sprint has no plan file, **stop and
  ask** — do not create the plan, and do not silently file the work as unsprinted.
- If no sprint is named, treat the work as **unsprinted backlog** (`## Sprint: Backlog (unsprinted)`).
- If `$ARGUMENTS` is empty, ask what to scope. Do not guess.

### 2. Ground the work before drafting
- **Ask before recommending.** If the description is underspecified in a way that changes *what gets
  built*, ask the owner rather than drafting a guess. A brief built on a guess sends the coder down
  the wrong path with full confidence.
- **Investigation-first.** If meaningful unknowns remain — feasibility, root cause, architectural fit
  — scope an **investigation** task, not an implementation task. Do not write an implementation brief
  for work whose shape isn't known yet.
- **Ground in the wiki.** Follow the read-only query procedure in `.claude/skills/fkit-query/SKILL.md`
  against `ai-agents/wiki-vault/` for existing decisions and constraints that bear on this work. Treat
  what it returns as ground truth — don't re-derive what the wiki already records.

### 3. Decompose — the core step
Assess whether the description is **one** shippable unit or **several**. Apply the owner's rule: **if
a part can be developed, tested, and shipped separately, it is its own task.**

- **The test is *independent shippability*, not size or effort.** A small piece that can be verified on
  its own **is** a separate task. A large piece that cannot be verified on its own is **not**.
- **Where you can judge alone, judge alone.** Where the split depends on a technical boundary you
  cannot see — module seams, deployment units, what can actually be tested in isolation — **consult
  fkit-architect** for the technical scope. That consult is **expected and sanctioned**, not a
  fallback or an admission of failure.
- **Emit one brief per shippable unit**, and record the **dependency links between them** (`Depends
  on:` / `Blocks:` in `## Notes`). **A dependency chain that isn't written down is a split that has
  lost information** — the ordering is the most valuable thing the split produces.
- **Do not split for the sake of splitting.** If the description is genuinely one unit, one brief out.
- **Flag dependencies and conflicts.** If the work depends on unfinished work, or conflicts with a
  locked decision (an ADR, a wiki page), say so in `## Context` — do not quietly plan around it.

### 4. Draft each brief
Use the established structure **exactly** — diff against an existing brief in
`ai-agents/tasks/backlog/` to confirm:

```
# <Title>

## Sprint
## Priority
## Status
## Context
## What to build
## Verification steps
## Notes
```

- **`## Status` is always `🔲 Backlog` on creation** — the only valid status for a new brief. (If the
  project keeps a status vocabulary at `ai-agents/knowledge-base/conventions/task-status-vocabulary.md`,
  that is the source of truth for the full set.) **Never create a brief as `Done` or `Cancelled`**: those are
  owner-gated and set only by their mover skills.
- **`## Verification steps` must be genuinely checkable.** "It works" is not a verification step. If
  you cannot say how the work would be proved, the brief is not ready.
- No code snippets beyond schema stubs / config values. A brief says *what* and *why*, not *how* — the
  coder's plan decides *how*.

### 5. Determine priority
- **Targeting a named sprint:** append **after** the existing highest priority. **Do not renumber or
  insert into the owner's ranking** — the ranking is theirs, and renumbering silently rewrites their
  decisions. Flag the addition for owner confirmation in the report.
- **Sub-tasks from one split** should be **contiguous and in dependency order**, so the sequence reads
  correctly.
- **Unsprinted:** `## Priority` reads `Unscheduled`.

### 6. Write each brief
Write to `ai-agents/tasks/backlog/<kebab-case-title>.md` — **new files, not moves.**
- Check the filename isn't already taken; if it is, either the work already exists (say so, and stop)
  or the title needs to be more specific.
- **Do not commit** — writing the files is enough; commits happen only when the owner explicitly asks.

### 7. Update the sprint plan — only if a sprint was named
- **If a sprint was named:** add **one Status-table row per new brief**, matching the table's existing
  format exactly, plus a short **dated addendum note** explaining the out-of-band addition (follow the
  "Addendum — task N added out of band (YYYY-MM-DD)" precedent already in the sprint plans).
- **If no sprint was named: touch no sprint plan.** The brief's `## Sprint: Backlog (unsprinted)` field
  is the record. Do not add rows to a sprint the owner didn't name.
- **Never renumber or alter an existing row.**

### 8. Never
- Move or rename an existing task file (that's `/fkit-task-done` / `/fkit-task-cancelled`, owner-invoked).
- Write to `ai-agents/tasks/done/` or `ai-agents/tasks/cancelled/`.
- Set a status of `✅ Done` or `⛔ Cancelled` on anything.
- Produce or modify source code.
- Write to `ai-agents/wiki-vault/` (wiki writes are the fkit-wiki agent's, exclusively).

This skill creates **new Markdown briefs** and optionally edits **one sprint plan**. That is its whole
write surface — the same authority boundary every producer skill respects.

### 9. Report
Give a concise summary:
- **Created:** every file path written.
- **Split rationale:** *why N briefs and not 1* — which seams made each piece independently shippable.
  If you emitted one brief, say why the work is genuinely a single unit.
- **Dependencies:** the links recorded between the new briefs.
- **Sprint:** which sprint plan was filed against (and the rows added), or "unsprinted".
- **Flagged for owner confirmation:** the appended priorities, anything you had to assume, and any
  dependency or conflict surfaced in step 3.
- **Consulted:** if fkit-architect was consulted for the technical scope, say so and summarize what it
  established.
- Remind that nothing was committed — the new files + edits are working-tree only.

---

## Rules
- **Decompose.** One monolithic brief out of a multi-part description is a failed run.
- **Record the dependency links** between split briefs — without them the split has lost information.
- **Do not commit** anything (the project rule: commit only when the owner explicitly asks).
- **Do not renumber** the owner's existing priority ranking.
- Every new brief is `🔲 Backlog`. Ask when underspecified; scope an investigation when the shape is
  unknown; surface conflicts instead of planning around them.
