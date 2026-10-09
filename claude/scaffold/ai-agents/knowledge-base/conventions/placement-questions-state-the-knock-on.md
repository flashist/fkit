# A placement question names its knock-on

> **Before the owner picks an option that puts a task in a sprint or re-points a dependency, the
> option says which open tasks would then wait, and on which sprint.** Form:
> *"`<task>` and N tasks behind it would then wait on Sprint M."* When no open task would wait, the
> owner sees nothing extra (a spawned worker still marks the check for its relayer — see below).
>
> Owner ruling, 2026-10-05 — *"Say the knock-on in questions"* (task 0495). Scope ruled by the owner
> on 2026-10-08 — *"Always (Recommended)"*: whenever open tasks depend on the placed task, the same
> sprint included (task 0495).

## Why

An owner approved the option marked "(Recommended)". It filed a verify task into the next sprint and
re-pointed a current-sprint task at it. The question never said that this task, and five tasks behind
it, would then wait on the next sprint. Several sprints can be in progress at once, and open rows carry
forward, so this is not a hard lock. But the owner could not weigh a cost nobody showed him.

## Which options it covers

- An option that **puts a task in a sprint or on the Backlog board**: filing, pulling in, moving,
  carrying forward, de-scoping.
- An option that **adds, removes or re-points a `Depends on:` link** (the line's form is
  [`dependency-declaration-form.md`](dependency-declaration-form.md)).
- **Not** an option that does neither, and not an "explain more, then ask again" option.

## What to say, for each option

- Name each **open** task whose wait the option changes (the start set, under *How to find them*).
  Count the open tasks behind each one. Name the sprint they would then wait on, or "the Backlog
  board". For a link the option **removes**, say which sprint they would **no longer** wait on. A
  re-point removes one link and adds another, so its option says both.
- **Always, whichever sprint they sit in** (the owner's scope ruling above). Say it when the dependent
  tasks are in a later sprint, an earlier one, or the **same** sprint as the placed task. A same-sprint
  wait still orders the work, and the owner decides whether that order is acceptable.
- Put it **in the option's own description**, not only in the explanation above the question. Each
  option states its own knock-on; they differ, and that difference is the point.
- **Open** means the task's status is not Done or Cancelled, in any form, agent-closed included
  ([`task-status-vocabulary.md`](task-status-vocabulary.md)). A `Moved` board row is not a closed task:
  the task is open in the sprint it moved to, and counts there.

## How to find them

- **Start from the briefs as they would stand once the option is applied** — counting a link the option
  itself adds, and not one it removes. The start set is:
  - each open task whose `Depends on:` line would then name the task the option puts in a sprint or
    on the Backlog board;
  - for an option that adds, removes or re-points a link, the task whose `Depends on:` line changes.
- That is what catches the incident shape: a new task is filed, and an existing task is re-pointed at
  it. No brief names the new task yet, so a search of the briefs as they stand finds nothing; the
  re-pointed task, and everything behind it, is the knock-on.
- Then search the open briefs' `Depends on:` lines for each start task's ID, and repeat for each task
  you find, until no new task turns up — those are the tasks *behind* it. Count each task once, even
  when the chain loops. The check is made this turn
  ([`evidence-before-assertion.md`](evidence-before-assertion.md)).
- A `Depends on:` line you cannot read: say so in the option — *"knock-on not fully checked: `<task>`'s
  `Depends on:` line is unreadable"*. **A count you did not check is not zero.**

## Every asker, every channel

- **In a session:** in the `AskUserQuestion` option's description.
- **A spawned worker:** writes it into each placement option of its `NEEDS-DECISION` (and into any
  open question it returns in prose). The worker has the files; the relayer may not. When the search
  finds no open task that would wait, the worker writes `knock-on: none (checked)` in that option, so
  the relayer can tell a checked zero from a forgotten one.
- **A relayer** (the lead, or the sprint-loop driver): carries a knock-on unchanged, and drops a
  `knock-on: none (checked)` note when it asks (the owner sees nothing extra). A placement option with
  **neither** is missing one: the relayer adds it from the briefs, checked this turn, before asking,
  and **says the relayer added it**, so the owner knows who checked. Never relay a placement option
  without it.
- **The recommended option** — marked "(Recommended)" or "(Rec)" — states its knock-on like the others.
  It is the option most likely to be taken without reading the rest, so the mark never excuses it.

## With other question rules

- An explanation given first may mention the knock-on; it still goes in the option.
- If the asker's rules add an "explain more, then ask again" option, that option carries no knock-on,
  and on the re-ask every option keeps its knock-on.
- The knock-on lives in descriptions, so it never uses up one of the four option slots.

## Where it is enforced

**Prose only.** Pointers to this page sit in the fkit-lead, fkit-producer and fkit-coder agent prompts
and in `/fkit-task-brief`, `/fkit-sprint-ship-loop` and `/fkit-task-ship-loop`. **Nothing checks a
question's text mechanically** — whether an asker follows this page is not tested anywhere.
