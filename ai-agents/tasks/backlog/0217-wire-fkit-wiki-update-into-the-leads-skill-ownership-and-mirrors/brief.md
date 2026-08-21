# Wire `fkit-wiki-update` into the lead's skill ownership, the mirrors, and the hook test matrix

## ID
0217

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

`0216` builds `claude/skills/fkit-wiki-update/SKILL.md`. **A skill that is not declared in
`skills_for_role()` is denied to every role by the ADR-018 `PreToolUse` hook** — so until this task
lands, the skill exists and cannot run. This task makes it the lead's.

**This is the `0111` → `0112` shape, and it is split for the same reason:** building the procedure and
declaring who owns it are separately verifiable, and the ownership half touches a different file class
(shell source, a test matrix, and four documented mirrors) from the skill half.

### ⚠️ The mirror checklist is known-incomplete — do not trust it alone

`claude/skills-for-role.sh` carries a hand-maintained checklist naming **four** places that mirror the
role→skill list. **Its own comment records that it said "TWO" until 2026-07-18, and that following it
precisely still shipped a false statement into every consuming project** (`0008` (`add-open-questions-interview-skill-for-six-roles`)).

**It has since failed a second time.** Task `0124` (2026-07-25) followed it and a manual grep found
**three further live sources** it does not cover — `claude/scaffold/universal-rules.md`,
`claude/agents/fkit-producer.md`, and `claude/agents/fkit-coder.md`. **Those are system prompts and the
universal rules block, which sit in an agent's context every turn and outrank a SKILL file.**

That gap is the subject of open task **`0142`** (investigate the fact-inventory gap), with **`0188`**
(repair the five live defects it found) and **`0189`** (build a declared site registry plus a
completeness tripwire) behind it. **If `0189` has landed by the time this runs, use the registry and say
so.** If it has not, **do a fresh grep sweep and treat the four-item checklist as a floor, not a
ceiling** — and report anything it missed, because that is a third data point for `0142`.

## What to build

1. **`claude/skills-for-role.sh`** — add `fkit-wiki-update` to the `lead)` arm's list. **Add it to no
   other role.** The wiki role keeps `fkit-wiki-ingest`, `fkit-wiki-lint` and `fkit-wiki-sync`
   unchanged; this is a lead-owned driver, not a fourth wiki procedure.
2. **The four documented mirrors**, per the checklist in that same file:
   - `claude/skills/fkit-team/SKILL.md` — the roster `/fkit-team` prints
   - `claude/README.md` — the skill-ownership table
   - `claude/scaffold/CLAUDE.md` — **ships into every consuming project's root `CLAUDE.md`**
   - `ai-agents/knowledge-base/architecture.md` — the skill count **and** the role/skill table
     (**the count is a number that goes stale silently — update it, don't skim past it**)
3. **`test/skill-ownership-hook.test.js`** — add `fkit-wiki-update` to the `lead` entry in the `OWNED`
   map. **Read the comment block above that map first:** it records that `fkit-sprint-ship-loop` is
   deliberately absent from `UNIVERSE` and covered by two spot tests instead, calling it a *"pre-existing
   gap, not this task's to close."* **Decide consciously which pattern this skill follows, and say
   which and why** — do not copy either by reflex.
4. **`claude/agents/fkit-lead.md`** — the lead's own system prompt lists its skills and describes its
   flagship driver. **This is the file class `0124`'s checklist missed**, and it outranks a SKILL in the
   agent's own reasoning. Add the new skill here.
5. **Sweep for anything the checklist does not name** — see the warning above.

## Verification steps

1. `bash claude/skills-for-role.sh` (or sourcing it) returns `fkit-wiki-update` for `lead` and for **no
   other role** — check all seven, not just lead.
2. `npm test` is green, **including `prove-red.sh`'s hard gate**. Measure and report the counts; do not
   quote a number from this brief.
3. The ADR-018 hook now **allows** `lead × fkit-wiki-update` and **denies** it to all six other roles.
   Assert both directions — an allow-only test would pass on a hook that allows everything.
4. In a real `fkit lead` session the skill appears in the `/` menu and runs; in a `fkit wiki` session it
   is absent.
5. All four documented mirrors are updated, **and `architecture.md`'s skill count matches the actual
   number of skills** — recount, don't increment.
6. `claude/agents/fkit-lead.md` names the skill.
7. **State explicitly in the report whether the sweep in item 5 found any site the four-item checklist
   does not name.** *"None found"* is a valid and useful answer; silence is not — that silence is what
   `0142` exists because of.

## Notes

- **Depends on:** 0216 — hard. Declaring ownership of a skill whose `SKILL.md` does not exist points the
  hook at nothing and puts a dangling entry in five documents.
- **Blocks:** nothing.
- **Owner:** fkit-coder — shell source, a test, and doc mirrors.
- **Edit the canonical sources in `claude/` only.** `.claude/skills-for-role.sh` and `.claude/agents/`
  are gitignored copies refreshed by `claude/fkit-claude-init.sh .`.
- **`claude/scaffold/CLAUDE.md` ships to consuming projects** — a wrong statement there is wrong in
  every installed copy, which is exactly how `0008` failed. It is the highest-consequence mirror in the
  list; do it deliberately.
- **No ADR-027 dual-home surface.** `architecture.md` is not in `claude/scaffold/ai-agents/` (it is
  project-specific), and `claude/scaffold/CLAUDE.md` and the repo-root `CLAUDE.md` are independent files
  rather than a parity pair. Checked at scoping time, per ADR-027 §Decision 1.
- **Coordinates with `0142`/`0188`/`0189`** — this task is a live exercise of the very checklist `0142`
  is investigating. Whatever the sweep finds is evidence for it.
- No commit — leave the edits in the working tree.
