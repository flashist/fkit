# Decide whether the active-sprint `sprint-*.md` glob widens, or projects are told to name plans `sprint-N.md`

**Source**: `ai-agents/tasks/done/0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 5 P3 · task `0261` · owner `fkit-architect`

## Goal

Rule on the question **the downstream reporter explicitly declined to decide for fkit** — *"a product
call we are not making for you."* ⚠️ The brief flagged up front that this **may need owner sign-off
before it is actionable**, because *"tell projects how to name their files"* is a product posture. It
got that sign-off.

## Key Changes

The brief's central instruction was that **the report under-states the problem and the ADR must carry
the compounded form**: on the downstream repo the two findings land on the **same file**.
`sprint-backlog.md` is the only file matching the glob, so a bare `/fkit-status` reports an
*unscheduled* board as the active sprint — **and** its basename is not `backlog`, so its identity
resolves empty too, costing it *"the single highest-value drift this board can surface."*

Three things the brief required: rule on `sprint-backlog.md` **by name**; say in one sentence whether
this is fkit's problem or the project's; and **name an enforcement point or state there is none** —
*a naming rule living only in a template header is a rule nobody enforces.*

⛔ Decision output only. ⛔ **Do not rename `backlog.md`** — its name is load-bearing.

## Outcome

Delivered [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]],
accepted 2026-08-10 on the **owner's** ruling, verbatim **"Accept — selection by identity
(Recommended)"**. The glob is **retired, not demoted**; *"keep the glob as a fallback"* was put to the
owner alongside it and **explicitly rejected**.

### ⚠️ The ADR corrected this brief's own stated cost of widening

The brief said a wider glob *"also catches our own `backlog.md` under most widenings."* **Measured: it
does not** — `backlog.md` contains no substring `sprint`. **The conclusion is unchanged; the reason is
different — and the different reason is what rules out every "just widen the glob a bit more
carefully" variant.** *The real cost is that it catches **their** unscheduled board, which is the
reported defect rather than a fix.*

The enforcement-point question was answered as instructed: **there is none for filenames, and that is
the point.** What replaces it is a runtime signal on the run the reader just made.

A second owner ruling the same day settled the same-identity tie-break — verbatim **"Pick
deterministically, flag loudly (Recommended)"** — which the ADR then had to state as a **concrete
rule** (byte order under `LC_ALL=C`) rather than as the adjective *"deterministic"*.

⚠️ One residual was **ruled by the architect, not the owner, and flagged to the owner as such**: the
*"highest N"* heuristic is **retained, not endorsed**, with an explicit active-sprint marker recorded
as the named future exit.

⚠️ Closed `(agent-closed — not owner-verified)`.

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] — this task's deliverable
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] — the grammar it depends on and cannot ship before
- [[tasks/decide-the-plan-sprint-resolution-strategy]] — the coordinating decision, deliberately not merged
- [[tasks/implement-adr-041s-dashboard-half]]
- [[tasks/retire-the-sprint-glob-in-fkit-status-skill]]
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board whose exclusion the ADR strengthens
