# The Priority cell is rank, not identity

> **A sprint board's Priority cell is board rank, written `P<n>`. A task's identity is its
> task-folder name's `NNNN` prefix, and nothing else.**
>
> Approved by the owner on 2026-07-27, from
> `reports/2026-07-26-decide-task-folder-name-numeric-prefix.md` (task 0103).

## Why the two are not interchangeable

They look alike — both are small integers, in adjacent columns of the same table — and they behave
nothing alike.

- **Rank is mutable.** A sprint's priorities are re-ranked whenever the plan changes; sprint 2 was
  re-ranked twice in a single day. A number that can change twice in a day cannot identify anything.
- **Identity is permanent.** The task-folder name's `NNNN` prefix is assigned once and never reused
  (ADR-029 Decision 3).

Conflating them is not hypothetical. `dashboard.sh` keyed its `⟦FACTS⟧` records by the **Priority
cell** until task 0103 — so `drift on tasks 59, 60` named *ranks* while every other part of fkit named
*folders*, and a re-rank silently renamed the tasks in every drift record already written. Rendering
rank as `P<n>` is what makes the two number-spaces impossible to confuse at a glance.

## What to write

| Where | Form | Why |
|---|---|---|
| A **sprint board** (`ai-agents/sprints/sprint-*.md`) Priority cell | `P<n>` | it is rank; the `P` keeps it out of the identity number-space |
| The **backlog board** (`ai-agents/sprints/backlog.md`) Priority cell | `—`, always | the board is unranked by design; a number here is a commitment nobody made |
| A **brief's `## Priority` field** | a plain number, or `Unscheduled` | it is a **field, not a board cell** — `fkit-sprint-ship-loop` orders by it and reads it as a number |
| Anything that **identifies** a task | the folder-name `NNNN` prefix | the only permanent carrier |

## What NOT to rewrite

- **The `➡️ Moved to [Sprint N](…) — priority M` marker.** That `priority M` is prose inside the
  **Status** cell and is the canonical form in
  [`task-status-vocabulary.md`](task-status-vocabulary.md). Leave it byte-identical.
- **Existing `priority (folderID)` notations are frozen history — the board-cell form only.** A sprint
  board's Priority cell like `124 (0150)` records what that row meant on the day it was written; the
  notation simply becomes unnecessary going forward, and is never mass-edited. The **prose** form
  `0150 (124)` in a brief's reasoning — the same two numbers, reversed — is **not** covered: it is a
  live cross-reference that misdirects a reader today. Owner ruling, 2026-07-27. A stale one is
  rewritten to **name the folder ID and drop the rank**; updating it to today's number only reproduces
  the defect with a fresher date.
- **Closed sprint plans under `sprints/done/`.** A closed plan's claims stay byte-identical.

## Where this is enforced

1. **`claude/skills/fkit-status/dashboard.sh`** — the `⟦FACTS⟧` id ladder takes the folder-name ID
   prefix first; the Priority cell is only a fallback. This ships to every project.
2. **`test/dashboard-contract.test.js`** — the task-0103 red-proof holds one variable and moves the
   other, in both directions, so an implementation whose id merely *correlated* with the folder fails
   it. A companion test pins that a `P<n>` cell parses cleanly and never becomes the id.
3. **`claude/skills/fkit-task-brief/SKILL.md`** — at write time, when a task is pulled into a sprint.

## Provenance

Decision report `2026-07-26-decide-task-folder-name-numeric-prefix.md` §7 Option C and §9; completes
ADR-029 Decision 6. Implemented by task 0103.

> **⚠️ ADR-029 and the decision report are cited by name and NOT linked — deliberately. Do not "fix"
> this.** This file is dual-homed and must stay **byte-identical** in both copies
> (the rule is `dual-home-parity.md`, cited bare here because it is fkit-repo-only and ships to no
> project), while
> `knowledge-base/decisions/` and `knowledge-base/reports/` are **never synced** into
> `claude/scaffold/` and ship empty. A relative link to either would therefore be **dead in every
> project fkit sets up**, and making it resolve would mean letting the two copies diverge. Owner
> ruling, 2026-07-27. `task-status-vocabulary.md` above *is* linked, because it is itself dual-homed
> and present in both trees — that is the test to apply before adding any link here.
