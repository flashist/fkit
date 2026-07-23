# Make a task's dependency visible to `dashboard.sh` when it's written in `## Notes` prose

## ID
0107

## Sprint
Sprint 2

## Priority
89

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

`dashboard.sh` derives each open task's **Next step** (`ready` / `after <N>`) from a dependency it can
parse. It reads structured/again-standard forms but **cannot read a dependency stated only in `## Notes`
prose**. When a brief records its dependency there and nowhere the script looks, the script emits
`⟨derive: none recorded⟩`, which the `/fkit-status` contract maps to **`ready`** — a false "nothing
blocks this."

**Observed, repeatedly:** task 84 (`0092-wiki-resync-eighth-role…`) declares *"Depends on tasks 82, 83
and 81 Part D"* in `## Notes`. The script read `none recorded` and every `/fkit-status` run for **seven
consecutive runs** had to hand-correct the Next-step cell to `after …` to avoid telling the owner an
84-shaped task was pullable when it was not. The producer caught it each time; a less careful reader
would have shipped the false `ready`.

**This is a genuine defect, owner-ruled worth fixing (2026-07-22):** a dependency the record states but
the tool cannot see is a dependency the board silently drops.

## What to build

Close the gap. Task 74's design ethos applies — **the fix is a convention or a parser change, and the
choice is the design's to make**, not pre-judged here:

- **Option A — teach `dashboard.sh` to read a `Depends on:` line in `## Notes`.** Give the brief a
  recognized dependency form inside Notes and have the script parse it into the same `⟨derive: …⟩`
  channel it already emits. Widens what the script reads.
- **Option B — make the row the single home for dependencies** (convention): require the dependency in
  the sprint-board row's description (where 87/88 already put theirs and parse correctly), and have
  `fkit-task-brief` enforce it. Narrows where dependencies may live so the script never misses one.
- Either way, **task 84's brief becomes the acceptance fixture** — after the change, `/fkit-status`
  must resolve 84's Next step to `after 83` (and whatever else is then open) **from the record, with no
  hand-correction.**

## Verification steps

- With task 84 still open, `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md`
  renders 84's Next step as `after <its real unmet deps>` — **not** `⟨derive: none recorded⟩` and not a
  bare `ready`.
- A brief that genuinely has no dependency still resolves to `ready` — the fix must not turn every task
  into a false `after`.
- The `dashboard-contract` test suite gains a fixture for the parsed/enforced form and passes.
- If the fix is a convention (Option B), `fkit-task-brief/SKILL.md` documents it and a new brief filed
  through the skill lands the dependency where the script reads it.

## Notes

- **Owner: fkit-coder.**
- **Depends on: nothing.**
- **Filed 2026-07-22** from the open-questions interview — the producer had flagged this misreport
  across seven status runs and offered to file it; the owner ruled *"file both"* (this and task 0108).
- **The design sub-choice (parse Notes vs enforce row) is for the coder's plan gate**, with the owner's
  approval — same shape as other convention-vs-code forks in this project.
- **Relation to task 0108** (`wiki-task completion visible to the board`): both are the same class of
  bug — *state the record holds that no board tool reads*. They are separable (different mechanisms) but
  a shared answer ("where does cross-cutting task state live so the board sees it") may inform both.
