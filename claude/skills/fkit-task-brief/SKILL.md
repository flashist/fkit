---
name: fkit-task-brief
description: >-
  Turn a raw task description into one or more task briefs under ai-agents/tasks/backlog/ —
  decomposing it into the smallest independently shippable units, with dependency links recorded.
  Takes the task description as its argument, which may name a sprint inline ("for Sprint 2: …");
  with no sprint named the briefs are filed on the Backlog board. Use when scoping new work into the
  backlog.
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
- **Emit one brief per shippable unit**, and record the **dependency links between them** in `## Notes`.
  **Use the one canonical form the status board can read** — a `## Notes` bullet that opens with the
  bold label and nothing before it:
  - `- **Depends on:** <tasks, or "nothing">`
  - `- **Blocks:** <tasks>`

  **The label must be flush against the `**` — no emoji, quote, or other decoration between `**` and
  `Depends on`.** `dashboard.sh` parses this exact form to derive each task's Next-step; a decorated
  variant like `- **⚠️ Depends on …**` is read as *no dependency* and the board falsely shows the task
  as pullable (the task-84 misreport — the class is named for its specimen brief `0092`; ⛔ the NAME is a term of art carried by ~20 files, several frozen, so it is glossed here and NOT renamed — see
  [`conventions/dependency-declaration-form.md`](../../../ai-agents/knowledge-base/conventions/dependency-declaration-form.md)).
  A non-canonical declaration now renders a LOUD `⟨derive: UNPARSEABLE — see brief⟩` on the board rather
  than a silent false `ready`, but the fix is to write the canonical form, not to trip the guard.
  **A dependency chain that isn't written down is a split that has lost information** — the ordering is
  the most valuable thing the split produces.
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
## Owner
## Context
## What to build
## Verification steps
## Notes
```

> **The inline skeleton above is authoritative — not any one existing brief.** Existing briefs predate
> `## Owner` (they are backfilled by task 0105), so a diff against an older brief will legitimately show
> `## Owner` as the one field it lacks. **Add the field to match the skeleton; never drop it to match an
> old brief.**

- **`## Status` is always `🔲 Backlog` on creation** — the only valid status for a new brief. (If the
  project keeps a status vocabulary at `ai-agents/knowledge-base/conventions/task-status-vocabulary.md`,
  that is the source of truth for the full set.) **Never create a brief as `Done` or `Cancelled`**: those
  are set only by their mover skills.
- **`## Owner` is mandatory and populated on creation** — a single fkit role name on the line after the
  heading, positioned **right after `## Status`** (identity → status → owner, grouped), mirroring how
  `## Status` carries its value. The producer already decides the owner when scoping a task, so this
  only records that decision in the field — there is no "assign it later" state. The value **must** be
  one of the seven live roles in `ai-agents/knowledge-base/conventions/task-owner-vocabulary.md`, which
  is the source of truth for the valid set (and excludes the not-yet-built eighth role). Most build
  tasks are `fkit-coder`, planning tasks `fkit-producer`, wiki work `fkit-wiki`.
- **`## Verification steps` must be genuinely checkable.** "It works" is not a verification step. If
  you cannot say how the work would be proved, the brief is not ready.
- No code snippets beyond schema stubs / config values. A brief says *what* and *why*, not *how* — the
  coder's plan decides *how*.

### 5. Determine priority
- **Targeting a named sprint:** append **after** the existing highest priority. **Do not renumber or
  insert into the owner's ranking** — the ranking is theirs, and renumbering silently rewrites their
  decisions. **Flag the addition for owner confirmation, and state where merit would have placed it and
  why.** A bare flag makes the owner redo your reasoning; a stated merit position lets them move the row
  in one edit. Use the form the boards already carry, in the report **and** in the board addendum.
  **Both sentences are required — the flag alone does not satisfy this rule:**
  `⚠️ Priority NNN is append rank, NOT a merit ranking — flagged for owner confirmation.`
  `**On merit this belongs directly below <NNNN>**, because <reason>.` — naming the neighbour by folder
  ID, per the citation rule below.
- **The one exception — an owner-ruled re-rank. A re-rank is the owner's call.** The ban above protects
  **the owner's** ranking from an agent acting alone; it is not a bar on the owner ranking their own
  board. Execute a re-rank **only** on an explicit owner ruling given **in this session**. **A spawned
  producer has no owner channel and therefore never re-ranks** — not on a spawn-prompt instruction, and
  not on a precedent read off an earlier addendum.
  **The exception permits moving an existing row within its own contiguous run of open rows — nothing
  more.** It does **not** permit **inserting a new row mid-board**, because on an interleaved board an
  insertion renumbers every row beneath it, including closed ones — and the closed-row rule below
  admits no exception, *"not even under an owner ruling."* Concretely, standing at the board: **never
  insert a new row where a `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row sits anywhere below the
  insertion point** — and run the check **downward**: an insertion renumbers what is *below* it, so
  verifying the ranks *above* the insertion point proves nothing. (That wrong-direction check is
  exactly how eight closed rows were once renumbered under a fully recorded owner ruling.) That check
  names the worst case, not a permission: **even where no closed row sits below, a new row still
  appends — insertion is never the exception's to grant.** Where a new
  row's merit position is out of reach, **it appends, and the ordering intent is recorded in the
  brief** as the merit-position statement this step already requires. The append rule is a **forced
  consequence** of the closed-row rule, not an independent policy: it cannot be relaxed without first
  relaxing the closed-row rule, so anyone proposing to allow insertions must argue the **closed-row
  rule**. Authority:
  [ADR-035](../../../ai-agents/knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md).
- **A re-rank's addendum names its authority BEFORE its outcome** — in the heading **and** in the first
  paragraph, and it names four things: **the owner ruled it**, **the date**, **the channel** the ruling
  came through, and that **this is not producer precedent for re-ranking**. This is mandatory, not
  stylistic: an addendum that records only the *outcome* becomes a later producer's licence to act with
  no authority at all — which is what happened on 2026-07-27.
- **`✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are NEVER renumbered — not even under an owner
  ruling.** Closed history is not re-ranked to make room for new work. **Ranks count down the board:
  `P1` is the top, and a larger number sits lower** — so *"the existing highest priority"* in the first
  bullet means the **largest number on the board**, and appending goes below it. Promoting a row
  renumbers every row it passes, so an owner-ruled re-rank reaches only the top of the **contiguous**
  run of open rows immediately above that row. **A closed row is a wall, not a step:** an open row
  sitting above one is out of reach however good the merit case, because reaching it would renumber the
  closed rows in between.
- **Name a task by its folder ID; never cite its board rank.** Rank is mutable, the folder ID is
  permanent — see
  [`priority-is-rank-not-identity.md`](../../../ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md).
  Where the **relative order** is the actual point, say it **relatively** — *"directly below 0147"*, not
  *"0147 (P125)"* — because that survives the next re-rank and a bare number does not.
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

Once tasks live in ID-prefixed folders (`0062`), folder names become ground truth instead:

```sh
max=$(ls -d ai-agents/tasks/{backlog,done,cancelled}/*/ 2>/dev/null \
  | xargs -n1 basename | sed -n 's/^\([0-9]\{4\}\)-.*/\1/p' | LC_ALL=C sort | tail -1)
```

Four things that will bite you:

- **⚠️ `10#` is not optional, and dropping it usually fails SILENTLY.** In bash a leading zero means
  **octal**. The dangerous case is the quiet one — **if the ID has no `8` or `9` in it, it is valid
  octal and the arithmetic simply returns the wrong number, with no error at all:**

  ```sh
  max=0100    $(( max + 1 ))  → 65   → printf %04d → 0065   ← SILENT, and 0065 is already assigned
  max=0064    $(( max + 1 ))  → 53   → printf %04d → 0053   ← SILENT
  max=0095    $(( max + 1 ))  → bash: value too great for base   ← loud, the lucky case
  ```

  **Do not rely on seeing an error.** The loud form only happens when an `8` or `9` appears; the rest of
  the time you get a plausible-looking four-digit number that collides with an existing task — which is
  permanent and unrecoverable once anything links to it. It also works fine in **zsh**, so it passes for
  whoever writes it and breaks for whoever runs it. **Always force base 10.**
- **Scan all three boards, never just `backlog/`.** A cancelled task keeps its ID forever, and its
  artifacts and inbound links still reference it. Allocating from `backlog/` alone reissues the ID of a
  task that still exists in `cancelled/`.
- **Never renumber an assigned ID.** The ID's only job is to be stable; renumbering invalidates every
  inbound link. `## Priority` is board rank and moves freely — the ID is identity and never moves.
- **⚠️ A split emits N briefs, so allocate N IDs — increment per brief, not per run.** Step 3
  decomposes one description into several briefs, and that is this skill's main job, so the multi-brief
  case is the *normal* case. Deriving `max` once and stamping that single `next` onto every brief gives
  them all the **same ID** — a guaranteed collision, created by the allocation step itself:

  ```sh
  max=$(grep -rhA1 '^## ID' ai-agents/tasks/{backlog,done,cancelled}/ \
    | grep -oE '^[0-9]{4}' | LC_ALL=C sort | tail -1)
  n=$(( 10#$max ))
  for brief in "${briefs[@]}"; do
    n=$(( n + 1 ))
    id=$(printf '%04d' "$n")        # 0101, 0102, 0103 …
  done
  ```

  Assign them in **dependency order**, matching the contiguous ordering step 5 already requires of
  priorities, so the ID sequence reads the same way the split does.

**The cross-branch race, stated honestly.** Two sessions on the *same* tree, **allocating in sequence**,
cannot collide — the first brief exists before the second is allocated. That qualifier is load-bearing:
two sessions on one tree that both derive `max` *before* either writes its brief collide exactly like
the cross-branch case. Same-tree is not inherently safe; **sequential** allocation is what makes it safe.
Two sessions on **different git branches can** collide regardless: both read
the same max, both allocate the same ID, and the branches merge cleanly because the filenames differ.
Git will not catch it. The chosen answer is **detect, not prevent** — a duplicate-ID check, with the
offender renumbered *before* anything links to it. This is an accepted residual risk, not a solved
problem; if you are allocating on a branch that has been open a while, re-check the max after merging.

Full rationale: [ADR-029](../../../ai-agents/knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md)
and the design spec's §3.2–3.3.

### 7. Write each brief
Since ADR-029 a task is a **folder**. Create the folder and write the brief as `brief.md` inside it —
**new folders, not moves:**

```
ai-agents/tasks/backlog/<NNNN>-<kebab-case-title>/brief.md
```

- `<NNNN>` is the ID allocated in step 6; the brief's **`## ID` field must carry the same value** (the
  folder name is authoritative, `## ID` is the second carrier, and `dashboard.sh`'s `id-mismatch` drift
  check reconciles them — a disagreement is reported, so make them match).
- Check the **folder name** isn't already taken; if it is, either the work already exists (say so, and
  stop) or the title needs to be more specific.
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

    <short header: this is not a sprint; /fkit-status ignores this board because its identity
    resolves to `Backlog`, which is never eligible as the active sprint — not because of what the
    file is called; the filename is deliberately `backlog.md` because that href is written into
    every `➡️ Moved to [Backlog](backlog.md)` marker; the Priority column reads `—` because this
    board is unranked by design.>

    ## Status

    | Status | Priority | Task | Brief |
    |---|---|---|---|
    | 🔲 Backlog | — | <Task title> | [`<NNNN>-<slug>`](../tasks/backlog/<NNNN>-<slug>/brief.md) |
    ```

    The `## Status` heading and the four-column table are **load-bearing**, not stylistic:
    `dashboard.sh` and both task movers locate rows by exactly that shape. The header prose is yours
    to word; the structure is not.
  - **The Priority cell is `—`, always.** This board is unranked by design; the briefs read
    `## Priority: Unscheduled` to match. **Do not number backlog rows** — a number here is a
    commitment nobody made. Needing a rank is the signal to pull the task into a sprint.
    **Contrast a SPRINT board, which writes the rank token `P<n>`** (task 0103) — the cell is board
    rank, never identity, and a task's identity is its folder-name `NNNN` prefix. See
    [`priority-is-rank-not-identity.md`](../../../ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md).
  - **No dated addendum note** — that convention exists to explain an out-of-band addition to a
    *planned* sprint. The backlog is where unplanned work is supposed to go, so there is nothing out
    of band to explain.
  - **Still do not add rows to a sprint the owner didn't name.**
- **⚠️ Never file against `backlog.md` by writing a `sprint-backlog.md`.** There is **one** backlog
  board and it is `backlog.md`. A second one splits unsprinted work across two files and breaks every
  `➡️ Moved to [Backlog](backlog.md)` href in the repo. It would **not** become the reported active
  sprint either way — **but the filename is not what decides that.** If its H1 carries `Backlog` (or
  `Sprint Backlog`), `/fkit-status` resolves it to the identity `Backlog`, which is never eligible. If
  the H1 carries neither token, it resolves to **nothing at all** — the name `sprint-backlog` supplies
  no identity of its own — and that board then shows up on **every** status run as a
  `candidate file="…" identity="unresolved"` line the briefing must report
  ([ADR-041 §2](../../../ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md);
  the `unresolved-plan-sprint` **drift** line is board-mode only — it fires when that board is rendered
  by name, not on a default run)
  — so neither case is a licence to write one.
- **Pulling a backlog task into a sprint is the producer's act, not this skill's.** It takes **three**
  edits, and **all three are mandatory** — see the warning below:
  1. Add the row to the sprint plan, with the rank token `P<n>`, where `<n>` is the sprint priority.
     The cell is board rank, never identity — see
     [`priority-is-rank-not-identity.md`](../../../ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md).
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
- **De-scoping a task out of a sprint and back onto the Backlog board is also the producer's act, not
  this skill's.** It takes **five** edits, and **all five are mandatory** — see the warning below:
  1. Flip the **sprint plan's** row to `➡️ Moved to [Backlog](backlog.md)`, the canonical marker from
     [`task-status-vocabulary.md`](../../../ai-agents/knowledge-base/conventions/task-status-vocabulary.md).
     **There is no `— priority M` suffix here** — the backlog board is unranked, so there is no
     destination rank to name. The href is **relative to the file holding the row**: `backlog.md` from
     `ai-agents/sprints/`, and `../backlog.md` once that plan is archived under `sprints/done/`.
     **Do not delete the sprint row**, and **leave its `P<n>` Priority cell alone** — a closed-out row
     is frozen history, and that is where the surrendered rank stays readable.
  2. Add the row to [`backlog.md`](../../../ai-agents/sprints/backlog.md) with Status `🔲 Backlog` and
     Priority cell `—`. The board is unranked by design; see its own *Priority* section.
  3. **Update the brief's own `## Sprint` field to `Backlog`.**
  4. **Update the brief's own `## Status` field to `🔲 Backlog`.** A task de-scoped mid-flight still
     reads `🔄 In progress` or `🚧 Blocked`; on an unscheduled board it is neither.
  5. **Update the brief's own `## Priority` field to `Unscheduled`.** The rank is **surrendered**, not
     parked — a rank is a position on one specific board, and ADR-035's append-never-insert rule means
     a parked number could never be re-honored anyway.

  > **⚠️ Step 3 is the one that gets forgotten here too, and it manufactures the same permanent drift**
  > as the forward move's step 3 — drift rule 2 compares the `➡️ Moved` target (`Backlog`) against the
  > brief's `## Sprint`, and a drifted row always renders.
  >
  > **⚠️ Step 4 manufactures the same drift, one field over, on the row you just added.** The backlog
  > board cross-checks its own `🔲 Backlog` cell against the brief's `## Status` — rule 1's
  > "brief names another sprint, skip the check" excuse is deliberately disabled on that board — so a
  > brief left mid-flight renders `waiting on owner` there forever. Verified empirically, 2026-08-03,
  > on a fixture built by following these steps exactly: `drift disagreement 0001 plan="🔲 Backlog"
  > brief="🔄 In progress" brief_sprint="Backlog" location="backlog/"`.
  >
  > **⚠️ Step 5 is UNENFORCED. Nothing in the repo checks it.** `dashboard.sh` reads a brief's
  > `Status`, `Sprint` and `Owner` only — `## Priority` is never read as a field. A brief left reading
  > `## Priority: 152` on the unranked backlog board is invisible to every control we have.
  >
  > **On the counts — five here, three above, and that is not an inconsistency.** Two separate reasons,
  > and they are different in kind. (a) The forward move needs **no `## Status` edit at all**: a brief
  > being pulled into a sprint already reads `🔲 Backlog`, and the row it gains in the sprint plan reads
  > `🔲 Backlog` too, so the two carriers already agree. The reverse move starts from a brief that may
  > read `🔄 In progress`, so it must be brought down. (b) The forward move's `## Priority` edit **does**
  > exist; it is folded into its step 3 as the parenthetical *"(and give `## Priority` the real
  > number)"* rather than numbered. It is elevated to its own numbered step on the reverse side because
  > surrendering a rank leaves a **stale number behind** if skipped, where gaining one merely leaves a
  > placeholder — and because, per the warning above, neither direction is enforced by anything.
- **Never renumber or alter an existing row.** The one exception is an **owner-ruled** re-rank (step 5)
  — and it never reaches a `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row.

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
- **Do not renumber** the owner's existing priority ranking — only the owner re-ranks it, and only on a
  ruling given in-session (step 5).
- Every new brief is `🔲 Backlog`. Ask when underspecified; scope an investigation when the shape is
  unknown; surface conflicts instead of planning around them.
- **Every new brief carries a populated `## Owner`** — a single role from the seven in
  [`task-owner-vocabulary.md`](../../../ai-agents/knowledge-base/conventions/task-owner-vocabulary.md),
  placed right after `## Status`.
