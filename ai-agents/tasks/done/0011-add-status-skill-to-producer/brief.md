# Add a `status` skill to fkit-producer

## ID
0011

## Sprint
Sprint 2

## Priority
16

## Status
✅ Done

## Context

The producer is asked *"what's the status?"* constantly, and has **no procedure for answering it** —
so the format is improvised every time. That improvisation already produced a concrete failure on
2026-07-11: a status report claimed *"0 in progress · 14 not started"* when no `In progress` status
existed in the project at all and every row simply read `Backlog`. **The report looked precise and was
fabricated.** A skill exists to stop that recurring.

This is the sibling of `task-plan` (task 14) and follows the same logic: formalize what the producer
already does by hand into a repeatable, sanctioned procedure.

**The format is already designed and owner-approved** — do not redesign it. Two docs are the spec:

- [`status-report-format.md`](../../../knowledge-base/conventions/status-report-format.md) — the seven beats, the
  rules, and the anti-patterns. **This is the contract.**
- [`task-status-vocabulary.md`](../../../knowledge-base/conventions/task-status-vocabulary.md) — the six valid
  statuses the dashboard may render, and nothing else.

**The standard to hit, in the owner's words:** *"as if I ask the producer of the project what the
status is, and they provide it in a simple yet informative way."* An answer, not a dashboard. A real
producer doesn't recite the board — they tell you where things stand, what's stuck, and what they need
from you.

## What to build

A new skill at **`claude/skills/fkit-status/SKILL.md`**, following the structural precedent of
`fkit-task-done` / `fkit-task-cancelled` (YAML frontmatter `name`/`description`, then a Markdown body
with explicit numbered steps).

Register it as **producer-owned** in `skills_for_role()` (`claude/fkit-claude.sh`). **Coordinate with
task 6** (`reconcile-skill-ownership-source-of-truth`) — if it has landed, follow whatever it
established as the single source of truth for skill ownership.

**Argument contract:** `$ARGUMENTS` is optional. Empty = status of the active sprint. It may name a
specific sprint (e.g. "Sprint 1") — resolve against `ai-agents/sprints/` (including `done/`).

**Skill steps:**

1. **Ground in the real files — never from memory.** Read the active sprint plan
   (`ai-agents/sprints/sprint-N.md`; if unclear, list the directory and find the active one) and
   `ai-agents/tasks/backlog/`. Cross-check the sprint plan's Status column against the briefs'
   own `## Status` fields.

2. **Reconcile drift before reporting — this is the core value of the skill.** If the sprint plan and
   the briefs disagree, or a task is complete in code but still marked `Backlog`, **the prose wins and
   the drift gets flagged to the owner.** Never render a stale board as if it were true. Do not
   silently "fix" the disagreement either — surface it; reconciling the record is a decision.

3. **Emit the seven beats, in order**, exactly per `status-report-format.md`:
   1. **The headline** — one sentence. If someone reads only this, nothing below should surprise them.
   2. **Where we are** — sprint, `N of M done`, what phase that really means.
   3. **What's moving** — what's genuinely in progress, and who has it. **If nothing, say so plainly.**
   4. **What's next** — the *one* thing to pick up, and why that one. A recommendation, not a ranked list.
   5. **What's in the way** — real blockers and *live* risks only.
   6. **What I need from you** — owner-only decisions. **If nothing: "nothing, you're clear."**
   7. **The dashboard** — the task board, last. Columns: **Status · # · Task · Filename · Next step**,
      plus a one-line roll-up (`N done · N in progress · N blocked · N backlog`).

4. **Honor the format's rules** (they are in the doc; the load-bearing ones):
   - **Say "nothing" when it's nothing.** Empty sections are information. Padding them is how a status
     report starts lying.
   - **Lead with bad news.** Anything broken, slipped, or missed goes in the *headline* — never buried
     under progress.
   - **The dashboard renders only the six canonical statuses.** No invented values ("Not started",
     "WIP", "Todo"). If the board needs a distinction the vocabulary can't express, the board is lying
     — flag it instead.
   - **Short by default** — readable in under 30 seconds. Prose and short bullets in beats 1–6; the
     only table is the dashboard.
   - **On a repeat status in the same session, report the delta**, not the whole state again.

5. **Read-only. Write nothing.** This skill reports; it does not mutate. It must never change a task
   status, move a file, or edit a sprint plan — including to "fix" drift it finds (step 2 surfaces it
   instead). Status changes go through the normal gated paths.

## Verification steps

- Run `/fkit-status` against the live Sprint 2: output matches the seven-beat structure, and the
  dashboard's roll-up counts match the actual briefs on disk.
- **Drift test (the important one):** hand-edit a sprint row to disagree with its brief's `## Status`,
  run the skill, and confirm it **flags the disagreement** rather than silently rendering one of them.
- **Fabrication test:** confirm the roll-up never reports a state that doesn't exist in the
  vocabulary — e.g. it says `N backlog`, never `N not started`.
- **Empty-section test:** with nothing blocked and nothing needed from the owner, confirm it prints
  "nothing's blocked" / "nothing, you're clear" rather than inventing filler.
- Run with an explicit argument (`/fkit-status Sprint 1`) — resolves the archived sprint in
  `sprints/done/`.
- Confirm it writes **nothing** — `git status` is unchanged after a run.
- The producer session can run `/fkit-status`; **a non-producer role cannot** (skill lockdown, ADR-010).

## Notes

- Owner: **fkit-coder** — source-tree work (a new `SKILL.md` under `claude/skills/`), outside the
  producer's own write authority even though the skill's behavior is the producer's own workflow.
- **Depends on:** nothing hard. **Coordinate with task 6** (skill-ownership SoT) before registering,
  and note tasks 14/15/16 all add or touch producer skills — landing them together is cheaper than
  three separate passes through `claude/skills/`.
- **Do not redesign the format.** It is owner-approved and specified in the two knowledge-base docs
  above. If something in the spec can't be implemented as written, report back rather than
  substituting your own judgment.
- Risk: **low.** New read-only skill; no runtime behavior change to anything existing.
