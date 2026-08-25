# Teach the lead, producer, ship-loop and README the sprint lifecycle and what "current sprint(s)" means

## ID
0339

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Owner ruling 2026-08-25 (verbatim in `0337`): sprints carry explicit statuses like tasks, and *"when
we ask about the status of the sprint, actually ALL the currently active sprints should be reported
about"*. `0337` records it as an ADR; `0338` makes `/fkit-status` and the selector do it. This task
closes the gap in the roles and pages that **answer the owner**, which today carry no definition or
the old one (checked 2026-08-25):

- `claude/agents/fkit-lead.md` — no "current sprint"/"active sprint" at all (grep: no hits); the lead
  does not own `/fkit-status` (`claude/skills-for-role.sh:50`).
- `claude/agents/fkit-producer.md:15` *"read the active sprint plan"*, `:89` *"if unclear, list
  `ai-agents/sprints/` and find the active one"* — the step that goes wrong; the producer owns
  `/fkit-status` (`skills-for-role.sh:51`).
- `claude/skills/fkit-sprint-ship-loop/SKILL.md:47-48, 94` — *"empty = the active sprint, as
  `/fkit-status` resolves it"*: after `0338` there may be several; the loop drives **one** and must
  name which (the selector's `chosen`, OQ-1: lowest-ordered In-progress, marker override).
- `ai-agents/README.md:9` and `claude/scaffold/ai-agents/README.md:8` — *"Completed sprints move to
  `sprints/done/`"*; no statuses, no "current" definition. The scaffold copy is what new projects get.
- `ai-agents/knowledge-base/conventions/` — `task-status-vocabulary.md` exists; **no sprint
  equivalent**, and no page mentions either term.
- `claude/skills/fkit-task-brief/SKILL.md` step 8 and step 1 reason about "the Backlog board is never
  the active sprint" — re-read for wording that assumes one active sprint.

## What to build

1. **`ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md`** — the sibling of
   `task-status-vocabulary.md`: the four sprint statuses and markers; who sets each — `Backlog` and
   `In progress` by the producer freely, `Done`/`Cancelled` only via `/fkit-sprint-done` /
   `/fkit-sprint-cancelled`, producer-only, agent-closed marker when no owner (SD-3, ruled 2026-08-25,
   verbatim **"Mover skills, producer-only (Recommended)"**, built by `0341`); the carrier — the
   **line-3 banner** (SD-1, verbatim **"Line-3 banner (Recommended)"**) with its grammar quoted from
   the ADR; that `sprints/done/` holds `Done` plans and `sprints/cancelled/` holds `Cancelled` ones
   (SD-2, verbatim **"`sprints/cancelled/` (Recommended)"**), the legacy `🔒 CLOSED` banner reading
   as `Done`; and the definition:
   **"current sprint(s)" = "active sprint(s)" = every sprint whose status is `In progress`**; the
   single-board rule (lowest-ordered, marker override); the one resolution path —
   `bash .claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` — and the ADR-041 §5
   rule that no role re-derives it in prose. Link the `0337` ADR.
2. **Teach the lead** (`claude/agents/fkit-lead.md`, a few lines): "current"/"active sprint" means the
   convention's definition and can be **several**; resolve by running the selector (a read-only
   script, not a `/fkit-*` skill — inside the lead's lock) or by consulting the producer for
   `/fkit-status`; report all of them; never pick the highest-numbered plan by eye. Point at the page.
3. **Teach the producer** (`fkit-producer.md:15, :89`): replace *"find the active one"* with the
   selector / `/fkit-status` and "plans, plural". Point at the page.
4. **Ship-loop** (`fkit-sprint-ship-loop/SKILL.md:44-48, 92-96`): empty argument = the selector's
   **chosen** board (lowest-ordered In-progress, marker override); when more than one sprint is
   active, say which was chosen and why in the loop's opening report. Wording only — no procedure
   change.
5. **`ai-agents/README.md:9` and the scaffold copy**: one sentence naming the sprint statuses, the
   line-3 banner, that `sprints/done/` holds `Done` plans and `sprints/cancelled/` `Cancelled` ones,
   that plans move there only via the sprint movers, and linking the page. Say that a project
   upgrading fkit must add a banner to its own open plans (the `0340` migration, flagged there).
6. **`fkit-task-brief/SKILL.md`** steps 1 and 8: adjust any sentence that assumes a single active
   sprint; the Backlog-board reasoning itself is unchanged.

Edit canonical sources in `claude/` only, never `.claude/` copies (`CLAUDE.md`). No script or test
changes — `0338`.

## Verification steps

1. `grep -rn -i "current sprint\|active sprint" claude/agents/fkit-lead.md` — at least one hit, linking
   `conventions/sprint-status-vocabulary.md` and naming the selector or the producer consult, and
   saying "all" / plural.
2. `grep -n "find the active one" claude/agents/fkit-producer.md` — no hits; both former sites name
   the selector or `/fkit-status`.
3. The convention page exists, gives the four markers, the carrier, the definition in one sentence,
   the single-board rule, the selector command verbatim, and the `0337` ADR by filename.
4. `grep -rn -i "highest" claude/agents/fkit-lead.md claude/agents/fkit-producer.md
   claude/skills/fkit-sprint-ship-loop/SKILL.md ai-agents/README.md claude/scaffold/ai-agents/README.md
   ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md` — no line states the current rule.
5. `claude/fkit-claude-init.sh .` refreshes `.claude/agents/fkit-lead.md` / `fkit-producer.md` with the
   new text; the full test suite passes (some tests pin skill/agent prose).
6. Dry run in a `fkit lead` session on a fixture with two In-progress sprints: *"what's the status of
   the current sprint?"* — the lead names both, says how it resolved them; `/fkit-sprint-ship-loop`
   with no argument names the chosen one and why.

## Notes

- **Owner: fkit-coder** — edits to agent/skill sources under `claude/`, the scaffold, and a
  knowledge-base convention page.
- **Depends on:** 0337 (definition and SD-1..3 on record), 0338 (the script must implement what the
  prose tells roles to trust).
- **Blocks:** nothing.
- **Wiki:** ADR-041's wiki page and `index.md` carry the old rule — `fkit-wiki`'s sync after `0337`,
  not this task's write.
- **Not in scope:** giving the lead `/fkit-status` ownership (a `skills-for-role.sh` change, ADR-010
  territory) — raise separately if running the script directly is judged to breach the lock's intent;
  the sprint mover skills themselves (`0341`) — this task only names them in the vocabulary page and
  the README; `0341` owns every enumeration of the movers in agent/skill prose and `CLAUDE.md`.
