# Correct the five remaining prose sites that state the glob as the mechanism

**Source**: `ai-agents/tasks/done/0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 5 P7 (append rank `P14`, promoted 2026-08-11) · task `0267` · owner `fkit-coder`

## Goal

ADR-041 §6 **sites 3–7** — two in `/fkit-task-brief`, two in `/fkit-sprint-ship-loop`, and this repo's
own live `ai-agents/sprints/backlog.md` header.

⚠️ **All five were re-verified on disk by the filing producer rather than carried on the architect's
word.**

## Key Changes

⚠️ **Two are not ordinary doc edits, and the brief called both out:**

- **Site 3 is a GENERATOR.** Its output already exists as **project content in every downstream repo
  that ever filed an unsprinted brief** — and launch convergence refreshes `.claude/` agents and
  skills, **not** a project's `backlog.md`. ***Those copies will not be repaired by this task, and the
  close had to say so.***
- **Site 7 is our own LIVE board, not scaffold** — so it needs the same correction **by hand, as a
  separate act.** ADR-041 §6 states it explicitly: *"Fix **both** the generator and this copy."*

⚠️ **Site 4's rule SURVIVES** — *"never file against `backlog.md` by writing a `sprint-backlog.md`"*
stays true for a **different reason** (one board, one file). **Rewrite the reason, keep the rule.**

⛔ No `fkit-status/SKILL.md` or `dashboard.sh` edit. ⛔ **No `backlog.md` rename** — its href is in
every `➡️ Moved to [Backlog](backlog.md)` marker in the repo. ⛔ **No `structure-spec.md` edit —
ADR-041 §4 rules it out by name; there is no filename rule left to enforce.** ⛔ No behavior change.

## Outcome

Closed `(agent-closed — not owner-verified)`.

### ⚠️ A near-miss the re-rank exposed, recorded rather than smoothed over

The 2026-08-11 re-rank moved this row **above `0252`**, reversing their previous order. `0267` cites
`0252` twice as *"Sprint 5 `P7`"*, from when `RELEASING.md` was a candidate landing site for its
downstream-exposure note. **That is safe only because the owner ruled the landing site to `README.md`
on 2026-08-10 with no sequencing dependency on `0252`, and no `Depends on: 0252` edge was ever
declared.** *Had that ruling gone the other way, the re-rank would have created a real ordering
defect.* The brief carries a dated correction recording it.

**The gap this task leaves open by design:** every downstream project that already generated a
`backlog.md` header still carries the false mechanism, and **nothing fkit ships will repair it.** That
is the same class of problem the structure-check capability was built for, and it is not covered by
this task.

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] — §6 sites 3–7, and §4's "not the enforcement site" ruling
- [[tasks/retire-the-sprint-glob-in-fkit-status-skill]] — sites 1–2; the dependency
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board and the generated header
- [[tasks/build-fkit-sprint-ship-loop-skill]] — two of the corrected sites live in this skill
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the rule the re-rank that reordered this row was checked against
- [[systems/launch-convergence-and-init]] — why the generated copies are unreachable
