# Repair the broken task links in the closed Sprint 1 plan

## ID
0076

## Sprint
Sprint 2

## Priority
21

## Status
✅ Done

## Owner
fkit-coder

## Context

`ai-agents/sprints/done/sprint-1.md` carries **6 broken relative links** (5 distinct tasks). Every one
is a `➡️ Moved to Sprint 2` row whose href still points at `../../tasks/backlog/…`, but the task has
since been completed and its brief moved to `tasks/done/`. The links resolve to nothing.

Found by a hand-rolled repo-wide link sweep during task 10 (`knowledge-base-hygiene-post-omnigent`).
It is **pre-existing and out of task 10's scope** — task 10 neither caused it nor fixed it.

| `sprint-1.md` line | Broken target | Actual location |
|---|---|---|
| 37 | `../../tasks/backlog/verify-onboarding-flow-end-to-end.md` | `tasks/done/` |
| 42 | `../../tasks/backlog/extend-initiate-project-fill-overview.md` | `tasks/done/` |
| 43 | `../../tasks/backlog/bake-architecture-pointer-into-scaffold-templates.md` | `tasks/done/` |
| 47 | `../../tasks/backlog/formalize-knowledge-base-incidents-folder.md` | `tasks/done/` |
| 50 | `../../tasks/backlog/add-task-plan-skill-to-producer.md` | `tasks/done/` |
| 74 | `../../tasks/backlog/add-task-plan-skill-to-producer.md` *(again, in prose)* | `tasks/done/` |

**This brief is the one-off cleanup only.** The *recurrence* — every future `/fkit-task-done` on a
carried-over task breaks another link in an older sprint plan — is [task
22](../0050-harden-task-movers-against-closed-sprint-link-rot/brief.md), and it is gated on an owner decision.
The two are deliberately split: this one is uncontroversial and shippable today; task 22 is not.

## What to build

**A. Re-point the 6 hrefs in `ai-agents/sprints/done/sprint-1.md`**

`../../tasks/backlog/<file>.md` → `../../tasks/done/<file>.md`, for the 6 sites above.

**Change the href only. Do not touch the row's status cell or its prose.** `➡️ Moved to Sprint 2 —
priority N` is *historically true* and stays exactly as written: it records what happened to the task
in Sprint 1, not where the file lives now. This task fixes a **link that 404s**, not a status.

**B. Verify — do not fix — one likely false positive**

`ai-agents/tasks/done/bake-architecture-pointer-into-scaffold-templates.md:41` has a repo-root-relative
link `](ai-agents/knowledge-base/architecture.md)` that does not resolve from its own directory. Line
41 sits **inside a blockquote quoting text to be baked into scaffold templates** — the path is correct
*as template content* and only looks broken to a checker.

**Expected outcome: no-op.** Read it, confirm it is quoted template content, and record the conclusion
in the report. **If it is genuinely quoted content, leave it alone** — "fixing" it would corrupt the
template text the task was about. Only if that reading turns out to be wrong does it become a defect,
and then it is in scope here.

## Verification steps

- Resolve every relative `](….md)` link under `ai-agents/**` against the filesystem. **Zero
  unresolvable**, with two known exclusions:
  - the `[Sprint N](…)` ellipsis placeholders in `ai-agents/knowledge-base/conventions/*.md` — template
    text, not links;
  - the blockquoted template path at `tasks/done/bake-architecture-pointer-into-scaffold-templates.md:41`,
    **if and only if** part B confirms it is quoted content.
- The 6 repaired rows in `sprint-1.md` still read `➡️ Moved to Sprint 2 — priority N` verbatim. A diff
  that changed a status cell has overreached — revert that hunk.
- `git diff --stat` touches **`ai-agents/sprints/done/sprint-1.md` and nothing else** (part B being a
  no-op).

## Notes

- **Owner: fkit-coder.** Mechanical, low risk, small blast radius — it is documentation under
  `ai-agents/`, no product source, no shipped behavior.
- **Independent of everything else in Sprint 2.** Can be picked up at any time. It does **not** depend
  on task 22 and must not wait for it: the 6 links are broken now regardless of how the owner rules on
  the process question.
- **Working tree note:** at the time of writing, uncommitted changes from tasks 19 and 10 are in the
  tree. The 6 broken links are present in the tree as it stands — they are not an artifact of those
  changes.
- **A mechanical link checker does not exist** — this repo has no test suite, no `Makefile`, and
  release-only `package.json` scripts. The sweep above is currently a manual/ad-hoc script. Whether
  fkit should *own* a link checker is a **separate question**, deliberately not folded in here; see
  task 22's Notes.
