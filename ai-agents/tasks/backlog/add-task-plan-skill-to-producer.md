# Add a `task-plan` skill to fkit-producer

## Sprint
Sprint 2

## Priority
14

## Status
🔲 Backlog

## Context

The producer has `initiate-project` / `task-done` / `task-cancelled` — the **create** leg of the task
lifecycle is missing. Writing a task brief is the single thing the producer is asked to do most, and
it is the one thing it has no procedure for. `task-plan` is that third leg.

This formalizes work the producer already does by hand every time a task is scoped in conversation
(see every file in `ai-agents/tasks/backlog/`) into a repeatable, sanctioned skill.

> **Rescoped 2026-07-11 (Sprint 1 → Sprint 2), twice over:**
> 1. **Retargeted off Omnigent.** The original brief targeted
>    `omnigent/fkit-producer/skills/task-plan/SKILL.md` — a path being deleted (ADR-009). The skill
>    now lands in the Claude flavor.
> 2. **The open question is answered, and it widened the scope.** The owner ruled (2026-07-11) for
>    the **richer reading**: this skill decomposes, it does not merely transcribe. See below.

**Owner's ruling — the decomposition rule (2026-07-11):**

> *"All tasks should be split into the smallest possible shippable tasks. If a part of a bigger
> system can be developed, tested and shipped separately, it's worth creating a sub-task for it and
> splitting the bigger task. Sometimes the producer can make that decision themselves; sometimes they
> need to consult the architect to clarify the technical scope."*

This is the skill's **central behavior**, not a footnote. A `task-plan` invocation that takes a large
description and emits one large brief has failed at its main job.

**Prior wiki-grounded findings (still valid):**
- No ADR, wiki page, or log entry formalizes producer-skill-authoring beyond the existing skills'
  own source precedent — the pattern is documented *by example only*. Follow that example; no new
  authoring convention needs inventing.
- **`Backlog (unsprinted)`** is already a `## Sprint` value the mover skills recognize, but no live
  brief has ever used it. This skill will be the first to exercise that path.
- `ai-agents/README.md` references a `sprint-backlog.md` that doesn't exist in the tree. Not
  blocking; flagged below.

## What to build

A new skill at **`claude/skills/fkit-task-plan/SKILL.md`**, following the exact structural precedent
of `fkit-task-done` / `fkit-task-cancelled` (YAML frontmatter `name`/`description`, then a Markdown
body with an explicit numbered "Steps — do these in order").

Register it as a **producer-owned** skill in `skills_for_role()` (`claude/fkit-claude.sh`) — and note
this interacts with task 6 (`reconcile-skill-ownership-source-of-truth`), which may change where skill
ownership is declared. **Check task 6's status first**; if it has landed, follow whatever it
established as the single source of truth.

**Argument contract:** `$ARGUMENTS` is the raw task description. It may optionally name a sprint
inline ("for Sprint 2: …", "add to the backlog: …"); if none is named, default to unsprinted.

**Skill steps:**

1. **Parse `$ARGUMENTS`** for a sprint reference. If named, resolve it to an existing
   `ai-agents/sprints/sprint-N.md` — list the directory and match; **do not invent a sprint that
   doesn't exist, ask instead.** If none is named, treat as unsprinted backlog.

2. **Decompose — the core step.** Assess whether the description is one shippable unit or several.
   Apply the owner's rule: **if a part can be developed, tested, and shipped separately, it is its
   own task.**
   - The test is *independent shippability*, not size or effort. A piece that cannot be verified on
     its own is not a separate task; a small piece that can be is.
   - **Where the producer can judge alone, judge alone.** Where the split depends on a technical
     boundary the producer cannot see — module seams, deployment units, what can actually be tested in
     isolation — **consult fkit-architect** for the technical scope. That consult is expected and
     sanctioned, not a fallback.
   - Emit **one brief per shippable unit**, with explicit dependency links between them (`Depends
     on:` / `Blocks:` in `## Notes`), so the ordering survives the split. **A dependency chain that
     isn't written down is a split that has lost information.**
   - If the description is genuinely one unit, one brief out. Do not split for the sake of splitting.

3. **Preserve the producer's standing behavioral rules** — this skill packages them, it does not
   bypass them:
   - *Ask before recommending* — if the description is underspecified, ask before drafting.
   - *Investigation-first* — if meaningful unknowns exist (feasibility, root cause, architectural
     fit), scope an **investigation** task, not implementation.
   - *Flag dependencies and conflicts* — if the task depends on unfinished work or conflicts with a
     locked decision, say so in `## Context`.
   - Ground in the wiki (`/fkit-query`) exactly as the producer would for any brief.

4. **Draft each brief** using the established structure exactly: `# <Title>`, `## Sprint`,
   `## Priority`, `## Status`, `## Context`, `## What to build`, `## Verification steps`, `## Notes`.
   No code snippets beyond schema stubs / config values.

5. **Determine priority.** If targeting a named sprint, append **after** the existing highest priority
   (do **not** renumber or insert into the owner's ranking), and flag the addition for owner
   confirmation. Sub-tasks from one split should be **contiguous and in dependency order**. If
   unsprinted, `## Priority` reads `Unscheduled`.

6. **Write** each brief to `ai-agents/tasks/backlog/<kebab-case-title>.md` — **new files, not moves.**
   Creating briefs is ordinary producer work and is not gated the way the movers are.

7. **If a sprint was named**, add one Status-table row per new brief, plus a short dated addendum note
   explaining the out-of-band addition. **If no sprint was named**, touch no sprint plan — the brief's
   `## Sprint: Backlog (unsprinted)` field is the record.

8. **Never**: move or rename an existing task file; write to `ai-agents/tasks/done/` or
   `cancelled/`; produce or modify source code. This skill creates new Markdown briefs and optionally
   edits one sprint plan. Same authority boundary every producer skill respects.

9. **Report back**: every file path created, the split rationale (why N briefs, not 1), the sprint
   filed against, and anything flagged for owner confirmation.

## Verification steps

- **Decomposition (the main test):** given a description spanning several independently-shippable
  parts, the skill emits **multiple linked briefs** with dependencies recorded — not one monolith.
- Given a genuinely single-unit description, it emits exactly **one** brief — it does not over-split.
- Given a description whose technical seams are unclear, it **consults fkit-architect** rather than
  guessing the split.
- Naming an existing sprint: briefs land in `ai-agents/tasks/backlog/`, that sprint gains exactly one
  row per brief, and **no existing row is renumbered or altered**.
- Naming no sprint: briefs carry `Backlog (unsprinted)`, and **every** sprint plan is untouched.
- Brief structure matches existing backlog briefs exactly — diff against one to confirm.
- Given a vague description, it asks clarifying questions rather than drafting a guess.
- It never writes to `done/`, `cancelled/`, or outside `ai-agents/tasks/backlog/` + one sprint plan.
- The producer session can run `/fkit-task-plan`; **a non-producer role cannot** (the skill lockdown
  holds — ADR-010).

## Notes

- **Natural owner: fkit-coder** — it is source-tree work (a new `SKILL.md` under `claude/skills/`),
  outside the producer's own write authority, even though the skill's *behavior* is the producer's
  own workflow.
- **Depends on:** nothing hard, but **check task 6** (`reconcile-skill-ownership-source-of-truth`)
  before registering the skill — it may move where ownership is declared.
- **Adjacent gap, not in scope:** `ai-agents/README.md` references a `sprint-backlog.md` that doesn't
  exist. This skill will be the first to produce `Backlog (unsprinted)` briefs with no sprint plan
  pointing at them, which makes that gap more visible. Worth its own brief if discovery becomes a
  real problem.
- This is the precedent for any skill-expansion brief that follows it.
