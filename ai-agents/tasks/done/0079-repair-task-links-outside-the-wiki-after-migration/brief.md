# Repair the task links outside the wiki after the migration

## ID
0079

## Sprint
Sprint 2

## Priority
77

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

The migration ([task 76](../../done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md)) repairs the
**executable** references — the sprint-board hrefs `dashboard.sh` and the movers actually follow. It
deliberately leaves the **documentation** references, which are numerous but which nothing executes:

| Area | Approx. refs (2026-07-19 — **re-measure, do not trust**) |
|---|---|
| `ai-agents/knowledge-base/` | ~59 |
| the absorbed review ledgers (was `ai-agents/reviews/`) | ~41 |
| `ai-agents/tasks/` (brief ↔ brief cross-links) | ~12 |
| the absorbed plans and worklogs (was `ai-agents/plans/`, `ai-agents/worklogs/`) | derive |

Roughly **110+ links** to `ai-agents/tasks/<board>/<slug>.md` paths that no longer resolve. **Every
count here is a snapshot that will be stale by the time this task runs — re-measure before starting and
verify against your own measurement.** Separating this from task 76 is what makes task 76 reviewable:
the structural change is judged on whether the tools work, not buried under a hundred mechanical href
edits.

**⚠️ The sweep areas changed with the widened absorption (owner ruling, design spec §4.3).**
`ai-agents/reviews/`, `ai-agents/plans/` and `ai-agents/worklogs/` **no longer exist** after task 76 —
their files are now `review.md`, `plan.md` and `worklog.md` **inside the task folders**. So the sweep
covers `ai-agents/knowledge-base/` and **all of `ai-agents/tasks/`** (briefs, plans, worklogs and review
ledgers alike), not three separate top-level directories. **The links inside the absorbed plans and
worklogs are new scope this brief did not originally carry.**

**This task must not touch `ai-agents/wiki-vault/`** — that is task 78's, and only the `fkit-wiki` role
may write there.

### ⚠️ This task repairs pre-existing rot as well as migration-induced rot

**Scope note added 2026-07-19 by owner ruling.** As originally written this brief read as *"re-point
the links the migration moved."* That is too narrow. **A large share of the task-brief links outside
`sprints/` and `tasks/` are already broken today, before task 76 moves anything** — rotted by past
task closes, because the movers' reference sweep never covered `ai-agents/knowledge-base/`
(the defect [task 81](../../done/0036-extend-mover-reference-sweep-to-the-knowledge-base/brief.md) fixes).

An indicative 2026-07-19 measurement found **16 of 47** such links already broken — roughly a third.
**That measurement was rough and is not audited**: dedup may misattribute a source or double-count.
**Do not trust the number 16 and do not work from the list below as a worklist** — the set moves with
every task close between now and this task's run. **Derive the broken set yourself, at run time.**

Confirmed-broken sources at that snapshot, given as evidence that the problem is real and spread
across areas — not as the set to repair:

- `knowledge-base/decisions/adr-016-…` → `tasks/backlog/add-shared-instructions-layer-for-all-agents.md`
- `knowledge-base/conventions/one-skill-one-output.md` → `tasks/backlog/remove-output-variants-from-fkit-status.md`
- `knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md` → `tasks/backlog/design-task-ship-loop-skill.md`
- `knowledge-base/reports/` — `2026-07-14-migration-mechanism.md`, `2026-07-17-askuserquestion-…`,
  `2026-07-18-design-fkit-git-agent-…`, `2026-07-16-design-deterministic-dashboard-…` (2 links)
- `reviews/sprint2-shared-instructions-delivery.md` (3 links),
  `reviews/sprint2-scaffold-launcher-hardening.md` (3 links)

**Why this is not a separate task:** once task 76 lands, a link broken by the migration and a link
broken six weeks ago are **indistinguishable** — both are hrefs pointing at a path that does not
exist. Separating them costs effort and buys nothing. But a sweep scoped to *"links the migration
touched"* walks straight past roughly a third of the real defects, which is why this has to be said
explicitly rather than left to inference.

**Two categories that are not the same edit, and must not be conflated:**

- **A link** — a pointer. Re-point it. A pointer to a file that is not there is rot, not history.
- **A prose claim** — e.g. a review ledger citing `tasks/backlog/foo.md:58` as *where a finding was
  observed at review time*, or a brief calling another task "also live". Those are **historical
  claims** and are **not** repaired by this task. Changing them rewrites the record.

## What to build

- Every **link** under `ai-agents/knowledge-base/` and everywhere inside `ai-agents/tasks/` — briefs,
  and the absorbed `plan.md`, `worklog.md` and `review.md` files — re-pointed to its post-migration
  path.
- **Relative-depth correctness**, not just filename correctness: a brief now sits one directory deeper
  than it used to, so a sibling link that was `](other-task.md)` is not simply renamed — its `../`
  depth changes. This is the error the migration is most likely to leave behind.
- **A pre-migration baseline of the already-broken set, captured BEFORE task 76 runs.** Sweep every
  task-brief link outside `sprints/` and `tasks/`, resolve each against its containing file's
  directory, and record which ones already fail. **This must happen before the migration** — once 76
  lands, the evidence is gone. Without the baseline neither this task nor its reviewer can tell
  *"I failed to repair this"* from *"this was already broken and I repaired it too."* Store it in the
  task's worklog.
  > **⚠️ This is the one step of this task that cannot be done late.** Everything else here waits on
  > 76; this step must run before it. If you reach this task and no baseline exists, say so loudly
  > rather than reconstructing one — a reconstructed baseline is a guess, and it will be read as fact.
- **Every broken link repaired, whatever broke it** — migration-induced and pre-existing alike, with
  no attempt to sort one from the other beyond what the baseline already records.
- **A list, in the task's worklog, of every prose claim deliberately left alone**, so the next reader
  can tell "not repaired" from "missed".

## Verification steps

- A mechanical sweep for `tasks/(backlog|done|cancelled)/[a-z0-9-]+\.md` across
  `ai-agents/knowledge-base/` and `ai-agents/tasks/` returns **only** the prose claims on the
  deliberately-left-alone list — nothing else.
- A sweep for links into `ai-agents/plans/`, `ai-agents/worklogs/` and `ai-agents/reviews/` returns
  nothing outside that same list — those three directories no longer exist.
- **Every relative markdown link in the swept files resolves to a real file**, checked by resolving
  each link against its containing file's directory. Filename-only checking is insufficient and will
  pass on a wrong `../` depth.
- The deliberately-left-alone list exists and every entry on it is genuinely a claim about the past,
  not a live pointer.
- **The pre-migration baseline exists, is dated, and every entry on it is either repaired or on the
  deliberately-left-alone list.** A baseline entry that is neither is an unexplained miss.
- **The two sprint-keyed review ledgers are findable at their new paths** and their inbound links
  resolve — checked by name, not assumed covered by the general sweep.
- `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` emits no new drift.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 76 — hard.**
- **Runs in parallel with task 78** — disjoint file sets, different write authorities. Neither blocks
  the other.
- **Scope boundary, hard: `ai-agents/wiki-vault/` is out of scope**, including its ~96 refs. Task 78.
- **Scope widened 2026-07-19:** the owner ruled that `plans/` and `worklogs/` are absorbed alongside
  `reviews/` (design spec §4.3), so their links fall to this task too.
- **⚠️ The sprint-keyed review ledgers are a special case — they move somewhere different, and this
  brief previously said otherwise.** `reviews/sprint2-shared-instructions-delivery.md` and
  `reviews/sprint2-scaffold-launcher-hardening.md` are keyed to a **sprint**, not a task, so they
  relocate to **`ai-agents/sprints/reviews/`** per design spec **§5.2b** — *not* into a task folder as
  `review.md`. For these two files **both things change at once**: the links they contain need
  repairing, **and their own paths change**, so anything linking *to them* moves too. Do not treat
  them as ordinary knowledge-base files, and do not let the §4.3 absorption rule above sweep them into
  a task folder.
  > **Open question flagged to the owner:** the Context table above still counts ~41 refs under "the
  > absorbed review ledgers (was `ai-agents/reviews/`)" as if every ledger lands in a task folder.
  > With §5.2b splitting sprint-keyed ledgers out to `sprints/reviews/`, that line needs re-deriving
  > at run time, and task 76 needs to route the two kinds differently. **Confirm task 76's brief
  > encodes the split before starting this task** — if it does not, this task inherits a migration
  > that put the sprint ledgers in the wrong place.
- **Related defect: [task 81](../../done/0036-extend-mover-reference-sweep-to-the-knowledge-base/brief.md)** fixes the mover
  gap that *caused* the pre-existing rot. Task 81 stops new rot; this task clears the accumulated
  backlog of it. Neither substitutes for the other, and 81 landing first (as recommended) does not
  shrink this task's scope.
- The link/claim distinction is the same one the task movers already encode ("a link is not a claim;
  it is a pointer") — this task applies that existing rule at scale rather than inventing a new one.
