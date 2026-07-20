---
name: fkit-task-brief
description: Turn a raw task description into one or more task briefs under ai-agents/tasks/backlog/ — decomposing it into the smallest independently shippable units, with dependency links recorded. Takes the task description as its argument, which may name a sprint inline ("for Sprint 2: …"); with no sprint named the briefs are filed on the Backlog board. Use when scoping new work into the backlog.
---

# Task Brief

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
the briefs are filed on the **Backlog board** (`ai-agents/sprints/backlog.md`).

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
  ask** — do not create the plan, and **do not quietly divert the work to the Backlog board instead.**
  The owner named a sprint; silently filing elsewhere is a different answer to the one they asked for.
- If no sprint is named, file the work against the **Backlog board** (`## Sprint: Backlog`) — see
  step 8. It is a real board with a real row, not a "no board" state.

> **⚠️ The Backlog board is the ONE designed exception to "never invent a sprint that doesn't exist",
> and it is deliberate, not drift.** `ai-agents/sprints/backlog.md` is **created if absent**. The rule
> above exists so a *typo'd or imagined sprint name* never silently materializes a plan file — the
> Backlog board is neither: it is a single, fixed, well-known path that every unsprinted brief shares.
> **The exception is exactly one filename.** Any other missing sprint still stops and asks.
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

## ID
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
  that is the source of truth for the full set.) **Never create a brief as `Done` or `Cancelled`**: those
  are set only by their mover skills.
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
- **Backlog board:** `## Priority` reads `Unscheduled`, and the board row's Priority cell reads `—`.
  The board is unranked by design — see step 8.

### 6. Allocate the `## ID` — permanent, and unrecoverable if wrong

Every brief carries a **global task ID**: four digits, zero-padded, no prefix (`0001`…`9999`). It goes
immediately after the H1, with the value on the next line:

```markdown
# Build the export endpoint

## ID
0042

## Sprint
Sprint 2
```

**The rule:**

> **Next ID = 1 + the highest ID that has ever existed, across all three boards. IDs are never reused,
> never renumbered, and never recycled from a cancelled task.**

Derive the highest existing ID — **the brief's `## ID` fields are ground truth**:

```sh
max=$(grep -rhA1 '^## ID' ai-agents/tasks/{backlog,done,cancelled}/ \
  | grep -oE '^[0-9]{4}' | LC_ALL=C sort | tail -1)
next=$(printf '%04d' $(( 10#$max + 1 )))     # ⚠️ 10# IS MANDATORY — see below
```

Once tasks live in ID-prefixed folders (task 76), folder names become ground truth instead:

```sh
max=$(ls -d ai-agents/tasks/{backlog,done,cancelled}/*/ 2>/dev/null \
  | xargs -n1 basename | sed -n 's/^\([0-9]\{4\}\)-.*/\1/p' | LC_ALL=C sort | tail -1)
```

Three things that will bite you:

- **⚠️ `10#` is not optional.** In bash a leading zero means **octal**, so `$(( 0095 + 1 ))` fails with
  *"value too great for base"* — and so does `0009`. It works fine in **zsh**, which is exactly what
  makes it a trap: it passes for whoever writes it and breaks for whoever runs it. Always force base 10.
- **Scan all three boards, never just `backlog/`.** A cancelled task keeps its ID forever, and its
  artifacts and inbound links still reference it. Allocating from `backlog/` alone reissues the ID of a
  task that still exists in `cancelled/`.
- **Never renumber an assigned ID.** The ID's only job is to be stable; renumbering invalidates every
  inbound link. `## Priority` is board rank and moves freely — the ID is identity and never moves.

**The cross-branch race, stated honestly.** Two sessions on the *same* tree cannot collide — the first
brief exists before the second is allocated. Two sessions on **different git branches can**: both read
the same max, both allocate the same ID, and the branches merge cleanly because the filenames differ.
Git will not catch it. The chosen answer is **detect, not prevent** — a duplicate-ID check, with the
offender renumbered *before* anything links to it. This is an accepted residual risk, not a solved
problem; if you are allocating on a branch that has been open a while, re-check the max after merging.

Full rationale: [ADR-029](../../../ai-agents/knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md)
and the design spec's §3.2–3.3.

### 7. Write each brief
Write to `ai-agents/tasks/backlog/<kebab-case-title>.md` — **new files, not moves.**
- Check the filename isn't already taken; if it is, either the work already exists (say so, and stop)
  or the title needs to be more specific.
- **Do not commit** — writing the files is enough; commits happen only when the owner explicitly asks.

### 8. Update the board — every brief gets a row, always
- **If a sprint was named:** add **one Status-table row per new brief**, matching the table's existing
  format exactly, plus a short **dated addendum note** explaining the out-of-band addition (follow the
  "Addendum — task N added out of band (YYYY-MM-DD)" precedent already in the sprint plans).
- **If no sprint was named: add the rows to the Backlog board, `ai-agents/sprints/backlog.md`.**
  Same Status-table format as a sprint plan (`Status | Priority | Task | Brief`) — that identical
  shape is what lets `dashboard.sh` and both task movers parse it with no special-casing.
  - **Create the file if it is absent** (the designed exception in step 1). ⚠️ **In a fresh project
    there is no existing board to copy** — the required structure is therefore given here, in full:

    ```markdown
    # Backlog — the default home for unsprinted task briefs

    <short header: this is not a sprint; the filename is deliberately `backlog.md`, NOT
    `sprint-backlog.md`, because /fkit-status globs `sprint-*.md` to find the active sprint;
    the Priority column reads `—` because this board is unranked by design.>

    ## Status

    | Status | Priority | Task | Brief |
    |---|---|---|---|
    | 🔲 Backlog | — | <Task title> | [`<brief>.md`](../tasks/backlog/<brief>.md) |
    ```

    The `## Status` heading and the four-column table are **load-bearing**, not stylistic:
    `dashboard.sh` and both task movers locate rows by exactly that shape. The header prose is yours
    to word; the structure is not.
  - **The Priority cell is `—`, always.** This board is unranked by design; the briefs read
    `## Priority: Unscheduled` to match. **Do not number backlog rows** — a number here is a
    commitment nobody made. Needing a rank is the signal to pull the task into a sprint.
  - **No dated addendum note** — that convention exists to explain an out-of-band addition to a
    *planned* sprint. The backlog is where unplanned work is supposed to go, so there is nothing out
    of band to explain.
  - **Still do not add rows to a sprint the owner didn't name.**
- **⚠️ Never file against `backlog.md` by writing a `sprint-backlog.md`.** `/fkit-status` finds the
  active sprint by globbing `sprint-*.md`; the backlog is excluded from the default status run purely
  because its filename does not match. A name inside the glob turns unscheduled work into the reported
  active sprint.
- **Pulling a backlog task into a sprint is the producer's act, not this skill's.** It takes **three**
  edits, and **all three are mandatory** — see the warning below:
  1. Add the row to the sprint plan, with a real priority number.
  2. Flip the backlog row to `➡️ Moved to [Sprint N](sprint-N.md) — priority M`, the canonical marker
     from [`task-status-vocabulary.md`](../../../ai-agents/knowledge-base/conventions/task-status-vocabulary.md).
     **`— priority M` is mandatory and is not dropped just because this board is unranked** — `M` is
     the priority the task receives in **Sprint N** (step 1), which is exactly what the reader of a
     moved row needs. **Do not delete the backlog row**; deleting it loses the pointer to where the
     work went.
  3. **Update the brief's own `## Sprint` field to `Sprint N`** (and give `## Priority` the real
     number).

  > **⚠️ Step 3 is the one that gets forgotten, and omitting it manufactures permanent drift.**
  > `dashboard.sh`'s drift rule 2 compares a `➡️ Moved` row's target against the brief's `## Sprint`.
  > Leave the brief saying `Backlog` and the board says Sprint N: the two sources now disagree, so the
  > row is flagged `drift disagreement` — and because a drifted row **always renders**, it never
  > disappears from the backlog board. Every task ever pulled into a sprint would leave a permanent
  > drifted row behind. Verified empirically, 2026-07-18: with step 3, no drift and the row correctly
  > drops off; without it, `drift disagreement … brief_sprint="Backlog" moved_target="Sprint 2"`.
- **Never renumber or alter an existing row.**

### 9. Never
- Move or rename an existing task file (that's `/fkit-task-done` / `/fkit-task-cancelled`).
- Write to `ai-agents/tasks/done/` or `ai-agents/tasks/cancelled/`.
- Set a status of `✅ Done` or `⛔ Cancelled` on anything.
- Produce or modify source code.
- Write to `ai-agents/wiki-vault/` (wiki writes are the fkit-wiki agent's, exclusively).

This skill creates **new Markdown briefs** and edits **exactly one board** — the named sprint plan, or
`ai-agents/sprints/backlog.md` (creating it if absent) when no sprint was named. **A board edit is not
optional**: every brief gets a row somewhere, or the work is invisible to every board-driven view,
which is the gap the Backlog board exists to close. That is its whole write surface — the same
authority boundary every producer skill respects.

### 10. Report
Give a concise summary:
- **Created:** every file path written.
- **Split rationale:** *why N briefs and not 1* — which seams made each piece independently shippable.
  If you emitted one brief, say why the work is genuinely a single unit.
- **Dependencies:** the links recorded between the new briefs.
- **Sprint:** which plan was filed against and the rows added — a named sprint, or the Backlog board (say so explicitly, and say if you created it).
- **Flagged for owner confirmation:** the appended priorities, anything you had to assume, and any
  dependency or conflict surfaced in step 3.
- **Consulted:** if fkit-architect was consulted for the technical scope, say so and summarize what it
  established.
- Remind that **this skill** made no commit — it leaves the new files + edits in the working tree. Do not
  claim the repository has uncommitted work, or that anything is or isn't committed — this skill has
  not checked, and the owner may have committed between turns. If commit state matters to the report,
  run `git status` first. (See
  [`conventions/evidence-before-assertion.md`](../../../ai-agents/knowledge-base/conventions/evidence-before-assertion.md).)

---

## Rules
- **Decompose.** One monolithic brief out of a multi-part description is a failed run.
- **Record the dependency links** between split briefs — without them the split has lost information.
- **Do not commit** anything (the project rule: commit only when the owner explicitly asks).
- **Do not renumber** the owner's existing priority ranking.
- Every new brief is `🔲 Backlog`. Ask when underspecified; scope an investigation when the shape is
  unknown; surface conflicts instead of planning around them.
