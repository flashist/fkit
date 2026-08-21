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

## The merit statement — recording an ordering rank cannot carry

Board rank is **append-only against closed history**: a `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row is
never renumbered, so a new row whose merit position sits above one can never be given that rank. The
ordering intent is then recorded **in the task's own brief**, as a relative, non-numeric **merit
statement**.

**Two shapes, and only two:**

```
- **On merit:** immediately above 0154 — <reason>
- **On merit:** as ranked
```

Every brief on a **ranked** board **must** carry exactly one of them. That is the rule, not a description
of the corpus — much of the existing corpus does not yet meet it. The Backlog board is unranked, so none
is required there — there is no rank for a statement to be relative to.

### The rules, each chosen against a named failure

- **Relative, never absolute.** Name a neighbour — *"immediately above `0154`"* — never a position,
  *"belongs at 122"*. A relative statement survives every re-rank; an absolute one is stale the moment
  anything above it moves. That is this page's own rule, applied to the one place it was not yet binding.
- **Folder ID only. A merit statement contains no `P<n>` token.** The neighbour is `0154`. Writing
  `0154 (P129)` pairs an identity with a rank, and reintroduces exactly the defect this page exists to
  prevent.
- **Advisory. Board rank still binds execution.** The merit statement records what the owner thinks
  *should* have been next. It does not redirect a reader picking up the next task, and nothing reads the
  board differently because of it. Two carriers, two jobs; collapsing them makes the board unreadable.
- **`as ranked` is required, not optional.** A brief with no merit line is indistinguishable from a
  brief whose author forgot. The explicit no-op is what makes **absence detectable**, and it is what
  makes a guard possible at all.

### The three carriers, and which of them binds

The merit statement is unreadable without the division of labour it sits in:

| Carrier | Carries | Binding? |
|---|---|---|
| Board rank `P<n>` | reading order — what to pick up next | yes, for picking work |
| `On merit` statement | the owner's preference the rank cannot express | **no — advisory** |
| `Depends on` / `Blocks` | correctness order — what must land first | **yes, and it outranks reading order** |

A merit case that is really a **correctness** constraint belongs in the `- **Depends on:**` form of
[`dependency-declaration-form.md`](dependency-declaration-form.md), where it **binds** — not in a merit
statement, where it does not.

**Authority.** ADR-035, *"A mid-board insertion is not the owner-ruled re-rank exception"*, and decision
report `2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md` §3.1, which ruled this form
in by name alongside six other candidates weighed in the same report. Both are cited bare — see the note
at the foot of this page.

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
4. **`claude/skills/fkit-status/dashboard.sh` + `test/dashboard-contract.test.js`** — **Specified, not
   built yet.** A `brief-missing-merit` drift kind, in the same family as `brief-missing-status`,
   `brief-missing-owner` and `brief-missing-id`. Its condition, in the two parts report
   `2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md` §5.1 rules: **presence** — every
   brief on a **ranked** board carries a line reading `**On merit:**` followed by *either* a relative
   statement naming a neighbour by folder ID *or* the literal `as ranked`, and a brief with neither is
   drift; and **shape** — that statement contains no `P<n>` token. Its two accepted limits — a bare rank
   with no `P` is not caught, and the guard is red on the existing corpus until a grandfathering decision
   is taken — are recorded in the same report, §5.4.

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
