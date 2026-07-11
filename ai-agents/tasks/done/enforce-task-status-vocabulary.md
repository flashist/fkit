# Enforce the task status vocabulary in the source

## Sprint
Sprint 2

## Priority
15

## Status
✅ Done

## Context

Until 2026-07-11 this project had **no defined task-status vocabulary**. It was convention-by-accident:

- `✅ Done` and `⛔ Cancelled` were the only values specified anywhere — inside the two mover skills.
- `🔲 Backlog` was never defined; it was simply what everyone typed.
- `➡️ Moved` was introduced ad hoc during Sprint 2 planning and written into a sprint plan without
  being recorded anywhere.
- **There was no `In progress` and no `Blocked` at all** — meaning there was literally no way to
  record that a session had picked a task up, or that it was stuck.

That last gap produced a concrete failure the same day: a producer status report claimed
*"0 in progress · 14 not started"* when no `In progress` status existed and every row simply read
`Backlog`. **The dashboard reported a distinction the data could not support** — it looked precise and
was fabricated.

The vocabulary is now defined in
[`ai-agents/knowledge-base/task-status-vocabulary.md`](../../knowledge-base/task-status-vocabulary.md).
**This task makes it bind.** A convention that lives only in a knowledge-base doc is a suggestion; it
has to be in the skills and the scaffold, because that is what actually ships to every project fkit
creates.

## What to build

Propagate the six canonical statuses — **Backlog · In progress · Blocked · Done · Cancelled · Moved**
— into the source, per the "Where this must be enforced" section of the vocabulary doc.

- **`claude/skills/fkit-task-done/SKILL.md`** — reference the vocabulary doc as the source of truth;
  confirm it sets exactly `✅ Done`.
- **`claude/skills/fkit-task-cancelled/SKILL.md`** — same, for `⛔ Cancelled (YYYY-MM-DD) — <reason>`.
  The mandatory-reason rule is already there; align the wording.
- **`claude/agents/fkit-producer.md`** — the producer reports and plans against these values only.
- **`claude/scaffold/ai-agents/README.md`** — document the vocabulary so **new projects inherit it**.
  (Post-Phase-0.1 path — confirm before starting; see task 1.)
- **`claude/skills/fkit-task-plan/SKILL.md`** — must set `🔲 Backlog` on creation. **Coordinate with
  task 14**, which creates this file. If task 14 has not landed, leave a note in its brief rather than
  creating the file here.

**Preserve the authority split — it is the point of the vocabulary, not a detail:**
- `In progress` / `Blocked` — **free.** Any session may set them, without ceremony.
- `Done` / `Cancelled` — **gated.** Owner-invoked skills only. An agent that can mark its own work
  complete can launder unfinished work into a green board. Do not add any path that sets these by
  hand.
- `Moved` — producer-set.

**Also fix the existing drift:** no live task brief or sprint row may carry a value outside the six.

## Verification steps

- `grep -rn "## Status" -A1 ai-agents/tasks/` — every brief carries exactly one of the six markers.
- Every Status cell in `ai-agents/sprints/*.md` (and `sprints/done/`) carries one of the six.
- No occurrence of invented values — `grep -rniE "not started|WIP|todo|complete\b|in-progress"` across
  `ai-agents/tasks/` and `ai-agents/sprints/` returns nothing used as a status.
- A freshly scaffolded project (`fkit` into a scratch dir) ships an `ai-agents/README.md` that
  documents the vocabulary.
- Running `/fkit-task-done` and `/fkit-task-cancelled` still produces exactly `✅ Done` and
  `⛔ Cancelled (YYYY-MM-DD) — <reason>`.
- **Confirm the gate still holds:** there is no non-owner-invoked path that writes `Done` or
  `Cancelled`.

## Notes

- Owner: **fkit-coder** — source-tree work under `claude/`.
- **Depends on:** task 1 (`extract-scaffold-into-claude`) for the scaffold path. **Coordinate with
  task 14** (`add-task-plan-skill-to-producer`) — ideally land task 14 first, then this.
- Related: [`status-report-format.md`](../../knowledge-base/status-report-format.md) — the producer's
  status dashboard renders these values and no others.
- Risk: **low.** Doc/skill text only, no runtime behavior change.
