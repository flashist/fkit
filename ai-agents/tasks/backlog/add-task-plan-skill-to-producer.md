# Add a `task-plan` skill to fkit-producer

## Sprint
Sprint 1

## Priority
14 (appended after the owner's original 1–13 ranking — same out-of-band-addition convention as
priorities 6–13; flag for owner confirmation before treating as locked)

## Status
🔲 Backlog

## Context

Sprint 1 reopened skill-set expansion to the producer on 2026-07-10 (owner reversal, see
`plan-sprint-1.md`'s addendum), but noted *"the owner has not yet specified which skills to add for
which agents"* and that briefs should be written once they do. This is the first: the owner asked
for a `task-plan` skill for fkit-producer that takes a task description as its argument, plans the
task, and files it — defaulting to the backlog if no sprint is named, or slotting into a named
sprint if one is.

This formalizes work the producer already does manually every time a new task is scoped in
conversation (see this very session, and the structure of every existing brief in
`ai-agents/tasks/backlog/`) into a repeatable, sanctioned skill — the same pattern `task-done` and
`task-cancelled` already established for the other two task-lifecycle moves (mark complete, mark
cancelled). `task-plan` is the third leg: **create**.

**Wiki-grounded findings (fkit-wiki consulted before drafting this brief):**
- No wiki page, ADR, or log entry names a `task-plan` skill or formalizes producer-skill-authoring
  rules beyond the three existing skills' own source code — the bundling pattern (`config.yaml` +
  scoped `skills/<name>/SKILL.md` with YAML frontmatter) is documented **by example only**. This
  brief's "What to build" follows that same example precedent; no new authoring convention needs to
  be invented from scratch.
- **`Backlog (unsprinted)`** is already a `## Sprint` value the `task-done`/`task-cancelled` skills
  explicitly recognize, but no live task brief in the repo currently uses it — every backlog brief
  today is tagged to Sprint 1. This task is what will actually exercise that path for the first time
  when no sprint is named.
- There is no `ai-agents/sprints/sprint-backlog.md` file today, even though `ai-agents/README.md`
  references one as part of the generic layout. Not blocking, but flagged below as an open question
  for whoever implements this.

## What to build

A new skill at `omnigent/fkit-producer/skills/task-plan/SKILL.md`, following the exact structural
precedent of `task-done`/`task-cancelled` (YAML frontmatter `name`/`description`, then a Markdown
body with an explicit numbered "Steps — do these in order" section).

**Argument contract:** `$ARGUMENTS` is the raw task description the owner passes alongside the
skill invocation. It may optionally name a sprint inline (e.g. "for Sprint 2: ..." or "add to the
backlog: ..."); if no sprint is mentioned, default to unsprinted.

**Skill steps:**
1. **Parse `$ARGUMENTS`** for an explicit sprint reference. If one is named, resolve it to an
   existing `ai-agents/sprints/plan-sprint-N.md` (list the directory and match by number/title if
   ambiguous — do not guess a sprint that doesn't exist; ask instead). If none is named, treat the
   task as unsprinted backlog.
2. **Preserve the producer's existing behavioral rules** — this skill does not bypass them, it
   packages them:
   - *Ask before recommending*: if the passed description is underspecified (goal, constraints,
     acceptance criteria unclear), ask clarifying questions before drafting rather than guessing.
   - *Investigation-first*: if meaningful unknowns exist (technical feasibility, root cause,
     architectural fit), the brief this skill produces should scope an investigation task, not
     implementation — same standard as any other producer-written brief.
   - *Flag dependencies/conflicts*: if the described task depends on unfinished work, or conflicts
     with a locked decision, say so in the brief's Context section rather than silently proceeding.
   - Consult fkit-wiki (and fkit-architect for technical feasibility questions) exactly as the
     producer would when writing any other brief — this skill does not skip that grounding step.
3. **Draft the brief** using the established structure exactly (see any file in
   `ai-agents/tasks/backlog/` for the reference format): `# <Title>`, `## Sprint`, `## Priority`,
   `## Status`, `## Context`, `## What to build`, `## Verification steps`, `## Notes`. No code
   snippets beyond schema stubs/config values, per the producer's standing brief-writing rule.
4. **Determine priority:**
   - If targeting a named sprint's Status table: append after the existing highest priority number
     in that plan (do not renumber or insert into the owner's locked ranking), and mark the addition
     as flagged for owner confirmation — same convention this very brief follows for priority 14.
   - If unsprinted: no priority-ordering concern; `## Priority` can read `Unscheduled`.
5. **Write the new brief** to `ai-agents/tasks/backlog/<kebab-case-title>.md`. This is a **new
   file**, not a move — creating new backlog briefs is ordinary producer work and is not gated the
   way `task-done`/`task-cancelled`'s moves are.
6. **If a sprint was named**, add one row to that sprint's Status table linking the new file, plus a
   short dated addendum note in that plan's Context/Notes explaining the out-of-band addition (same
   pattern as this plan's own 2026-07-10 addenda). **If no sprint was named**, do not touch any
   sprint plan file — the brief's `## Sprint` field alone (`Backlog (unsprinted)`) is the record.
7. **Never**: move or rename any existing task file, write to `ai-agents/tasks/done/` or
   `ai-agents/tasks/cancelled/`, or produce/modify source code. This skill only creates one new
   Markdown file (and optionally edits one sprint plan's Status table + notes) — the same
   authority boundary every other producer skill already respects.
8. **Report back** to the owner: the new file's path, the sprint it was (or wasn't) filed against,
   and the priority/flag-for-confirmation status if applicable — mirroring the final-report step
   `task-done`/`task-cancelled` already do.

## Verification steps

- Invoking `task-plan` with a description that names an existing sprint (e.g. "Sprint 1") produces
  a correctly-structured brief in `ai-agents/tasks/backlog/`, and that sprint's plan gains exactly
  one new Status-table row plus an addendum note — no other row is renumbered or altered.
- Invoking `task-plan` with a description that names no sprint produces a brief with
  `## Sprint` = `Backlog (unsprinted)`, filed to `ai-agents/tasks/backlog/`, and leaves every
  existing sprint plan file untouched.
- The produced brief's section structure matches existing backlog briefs exactly (same headers, same
  order) — diff against an existing file (e.g. this one, once filed) to confirm.
- Given a deliberately vague/underspecified description, the skill asks clarifying questions rather
  than drafting a guessed brief.
- The skill never writes to `ai-agents/tasks/done/`, `ai-agents/tasks/cancelled/`, or any file
  outside `ai-agents/tasks/backlog/` and (optionally) one sprint plan.
- `omnigent/validate-bundles.sh` still passes after the new `SKILL.md` is added (frontmatter parses
  cleanly, same check it runs on the other three producer skills).

## Notes

- **Natural owner: fkit-coder** — this is source-tree work (a new skill file under
  `omnigent/fkit-producer/skills/`), which is outside producer's own write authority even though the
  skill's *behavior* is producer's own workflow.
- **Open question for the owner, not blocking**: "the skill will plan the task" could mean just what
  this brief scopes (turn a description into one properly-filed, properly-formatted brief) — or
  something richer, like breaking a large description into multiple linked sub-task briefs, or doing
  rough estimation/sizing. This brief assumes the narrower reading (one brief in, one brief out)
  since that's what was described and matches the `task-done`/`task-cancelled` precedent scope.
  Flag before fkit-coder starts if the richer reading was intended.
- **Adjacent, non-blocking gap surfaced during grounding**: `ai-agents/README.md` references a
  `sprint-backlog.md` file that doesn't exist in the tree; this task will be the first to actually
  produce `Backlog (unsprinted)` briefs with no sprint plan pointing at them, which makes that gap
  more visible than before. Not in scope here — worth its own brief if it becomes a real discovery
  problem once a few unsprinted briefs exist.
- This is the first skill-expansion brief written since the 2026-07-10 scope reversal; its format is
  intended as the precedent for whatever skill-expansion briefs follow it this sprint.
