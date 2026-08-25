# Build the producer-only sprint movers — `/fkit-sprint-done` and `/fkit-sprint-cancelled`

## ID
0341

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Owner ruling SD-3, 2026-08-25, live via `AskUserQuestion`, option label verbatim:**
**"Mover skills, producer-only (Recommended)"** — `/fkit-sprint-done` + `/fkit-sprint-cancelled`,
producer-only under ADR-033's reasoning, agent-closed marker when no owner. Sibling rulings the same
day: **SD-1 "Line-3 banner (Recommended)"** (a sprint's status is a line-3 header banner generalising
`> ## 🔒 CLOSED — <date>.`) and **SD-2 "`sprints/cancelled/` (Recommended)"**. All three are recorded
in `0337`'s ADR; this task builds the movers to that ADR.

**Why a mover.** Every sprint close so far was a hand-scoped task: banner → `🔒 CLOSED`, file →
`sprints/done/`, links repointed (precedent chain `sprints/done/sprint-4.md:97-172`; Sprint 5 by task
`0294`, wiki `wiki/tasks/archive-sprint-5-move-the-plan-into-sprints-done.md`). Nothing tied the
three edits together, so a finished Sprint 5 sat at the top of `sprints/` and was reported as active
until the move happened. Sprint 5's link surface, measured at filing of `0294`: **57 relative links
inside the file** across three shapes, **53 files / 177 occurrences inbound**, with a naive one-shape
rewrite breaking ten links in the opposite direction. That is procedural, repeatable work — the same
shape the task movers already do for a task folder.

**The task movers are the model** (checked 2026-08-25):

- `claude/skills/fkit-task-done/SKILL.md` — *Resolve the status value FIRST* (`:56-70`: owner-present
  → `✅ Done`, spawned → `✅ Done (agent-closed — not owner-verified)`), then steps: validate input
  (`:74`), read context (`:89`), `git mv` the folder (`:98-104`), find every reference — recursive,
  reaching `sprints/done/` (`:109-142`), update each tracked location (`:144-230`), handle ambiguity
  (`:231`), report (`:241`). `fkit-task-cancelled/SKILL.md` mirrors it with a mandatory reason
  (`:118-199`, `:305-311`).
- **Role ownership is declared in exactly one place:** `skills_for_role()` in
  `claude/skills-for-role.sh:48-56` (producer's list at `:51` carries `fkit-task-done
  fkit-task-cancelled`), sourced by `claude/fkit-claude.sh` (session lock, ADR-010) and by
  `claude/skill-ownership-hook.sh` (`PreToolUse` deny for any non-owning identity, ADR-018). The hook
  is generic over the mapping — adding a skill to a role's list is what enforces it.
- **Tests pin the mapping:** `test/skill-ownership-hook.test.js:223-226` (producer allowed the
  movers), `:299-304` (the all-skills list), `:307-315` (`MOVERS` — *"now appears on EXACTLY ONE
  role. That is the invariant"*).
- **Every skill carries the `⛔ Owner:` banner** (ADR-012 — the lock is advisory in a spawned
  consult); the mover skills add the *Resolve the status value FIRST* table (ADR-033 §5).
- `claude/fkit-claude-init.sh` refreshes `.claude/skills/fkit-*/` by name pattern (`:12`, `:529-531`)
  — a new `claude/skills/fkit-sprint-*/` directory needs no per-skill registration there;
  `claude/structure-spec.md` / `structure-manifest.tsv` list no per-skill entries (grep: none) — verify
  at pickup whether the manifest generator picks new dirs up automatically.
- Prose that enumerates the movers and must grow: `claude/agents/fkit-producer.md:6,38,77,118`;
  `claude/skills/fkit-team/SKILL.md:54,61`; `CLAUDE.md:58` (the universal hard rule);
  `ai-agents/README.md:9-10` and the scaffold copy.

## What to build

Two skills, `claude/skills/fkit-sprint-done/SKILL.md` and `claude/skills/fkit-sprint-cancelled/SKILL.md`,
built to `0337`'s ADR and to the task movers' shape. Each, in one act:

1. **Argument and validation.** `/fkit-sprint-done <plan path>`; `/fkit-sprint-cancelled <plan path>
   <reason…>` (reason mandatory, as `fkit-task-cancelled`). Resolve the plan's identity through
   `dashboard.sh identity` (ADR-041 §5 — never re-derive); refuse a `Backlog` identity, an
   unresolved identity, and a plan already under `sprints/done/` or `sprints/cancelled/`. Refuse
   `sprint-done` while any row on the plan is still `🔲 Backlog` / `🔄 In progress` / `🚧 Blocked`
   unless the owner rules otherwise in-session (a spawned producer has no channel → refuse and report
   the open rows; never move them itself).
2. **Resolve the status value FIRST** — the ADR-033 §5 table: owner-present → `✅ Done` /
   `⛔ Cancelled (YYYY-MM-DD) — <reason>`; spawned → the `(agent-closed — not owner-verified)`
   variant. Same wording as the task movers' table.
3. **Write the line-3 banner** in the SD-1 grammar the ADR fixes (the `Done` banner is the existing
   `> ## 🔒 CLOSED — <date>.` form or its successor as the ADR states; the `Cancelled` banner carries
   the date and reason). Replace an existing status banner in place; never add a second.
4. **Cancelled only — dispose of open rows** per the ADR's point 3: each open row flips to
   `➡️ Moved to [Backlog](../backlog.md)` (href relative to the archived location), a matching
   `🔲 Backlog` row is added to `backlog.md`, and each brief's `## Sprint` → `Backlog`, `## Status` →
   `🔲 Backlog`, `## Priority` → `Unscheduled` — the five-edit de-scope in
   `fkit-task-brief/SKILL.md` step 8, applied per row. Closed rows are frozen history.
5. **`git mv` the plan** to `ai-agents/sprints/done/` or `ai-agents/sprints/cancelled/` (SD-2; create
   `cancelled/` if absent — the one designed create, like `backlog.md`). No commit.
6. **Repoint every link** — the `0294` procedure: in-file relative links (`](../…)`, `](done/…)`,
   `](backlog.md)` shapes), then every inbound reference repo-wide (`grep -rn` over `ai-agents/`,
   `claude/`, `test/`, `CLAUDE.md`, `README.md`; **not** `ai-agents/wiki-vault/` — ADR-005, the wiki
   role's sync repoints those). Re-derive counts at run time; never trust a recorded count.
7. **Report** in the task movers' shape: status written, banner line, old → new path, links repointed
   by file with counts, rows disposed (cancelled), anything refused or ambiguous, and *"this skill
   made no commit"*.
8. **Ownership and enforcement:** add both names to the producer's list in
   `claude/skills-for-role.sh:51` and **nowhere else**; extend `test/skill-ownership-hook.test.js`
   (`MOVERS` grows to four, the all-skills list grows by two, every non-producer role denied both,
   spawned depth included). Add the `⛔ Owner: the producer` banner to both skills.
9. **Prose that enumerates the movers** (list above) gains the pair; `CLAUDE.md:58`'s hard rule gains
   its sprint twin: *sprint plans move between `sprints/`, `sprints/done/`, `sprints/cancelled/`
   only via `/fkit-sprint-done` / `/fkit-sprint-cancelled`* — producer-only, agent-closed marker.
10. **Tests** beyond the hook: a fixture repo where `sprint-done` on a plan with all rows closed
    writes the banner, moves the file, repoints an inbound link in a sibling plan and in a brief, and
    leaves `dashboard.sh select-active` no longer listing it; `sprint-cancelled` disposes two open
    rows onto `backlog.md` with the five brief edits; both refuse the `Backlog` board, an already
    archived plan, and (for `done`) a plan with an open row. Skill prose is a model procedure, so
    test what is scriptable (the mapping, the banner grammar via `dashboard.sh`, the link rewrite if
    it is factored into a script) and record what is not.

## Verification steps

1. `bash claude/skills-for-role.sh`-sourced `skills_for_role producer` lists both new skills; no
   other role's list does. `node --test test/skill-ownership-hook.test.js` passes with the four-mover
   invariant.
2. In a `fkit producer` session on a fixture: `/fkit-sprint-done <fixture>/sprints/sprint-1.md`
   → banner at line 3 in the ADR grammar, file under `sprints/done/`, every inbound href re-derived
   and repointed (counts in the report match a fresh `grep`), `select-active` no longer lists it, and
   the board renderer reports no sprint-level drift on the archived plan.
3. Same via a *spawned* producer: the banner carries `(agent-closed — not owner-verified)`.
4. `/fkit-sprint-cancelled` with two open rows: both rows read `➡️ Moved to [Backlog](../backlog.md)`,
   `backlog.md` gained two `🔲 Backlog` rows, each brief's three fields updated; `dashboard.sh
   ai-agents/sprints/backlog.md` shows no drift on them; plan under `sprints/cancelled/`.
5. From a `fkit coder` or `fkit lead` session, invoking either skill is denied by the hook.
6. `claude/fkit-claude-init.sh .` installs `.claude/skills/fkit-sprint-done/` and
   `fkit-sprint-cancelled/`; `/fkit-heal` reports both as conforming (or the manifest is regenerated
   and the check passes).
7. `grep -rn "fkit-task-done" claude/agents/fkit-producer.md claude/skills/fkit-team/SKILL.md
   CLAUDE.md ai-agents/README.md claude/scaffold/ai-agents/README.md` — every enumeration of the task
   movers now names the sprint movers beside them.
8. Full test suite passes.

## Notes

- **Owner: fkit-coder** — two new skills, a role-mapping change, hook tests, and the prose that
  enumerates the movers.
- **Depends on:** 0337 (the ADR: banner grammar, `sprints/cancelled/`, disposal of open rows,
  agent-closed rule), 0338 (the `dashboard.sh` banner reader the movers write against and verify
  with — shared, so the grammar has one implementation).
- **Blocks:** nothing. `0340` (backfill) does not need the movers — it adds an `In progress` banner,
  which is not a close.
- **After this lands:** the sprint archivals stop being hand-scoped tasks; `fkit-task-brief`'s step 8
  href rules (`backlog.md` vs `../backlog.md`) already cover the archived case.
- **Authority note for the ADR:** producer-only is ADR-033's reasoning applied to sprints — the
  closing *identity* is separated from the doing identity; role-gating is not prevention (ADR-033
  §The limit), and the marker stays prose.
