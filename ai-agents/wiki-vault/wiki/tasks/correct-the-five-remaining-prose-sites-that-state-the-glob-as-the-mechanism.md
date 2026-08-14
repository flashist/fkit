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

> ⚠️ **Dated addition 2026-08-14 (the post-`0288` sync; everything above is left byte-identical).**
> **This sweep was not complete: FIVE more sites state the retired glob as the mechanism**, all in
> **archived sprint plans** — `sprints/done/sprint-4.md` (×2), `done/sprint-5.md`, `done/sprint-3.md`
> and `done/sprint-2.md`. They were found after this row closed and filed 2026-08-14 as task **`0299`**
> (Backlog, `🔲 Backlog`, **unranked**, owner `fkit-coder`), on four owner rulings of that date.
> ⛔ **This is an addition, not a repudiation** — every one of sites 3–7 above was genuinely corrected;
> the archived boards were simply outside the sweep. *A sweep is only as wide as the command that ran
> it.*
>
> ⚠️ **Two things about `0299` a later reader will otherwise get wrong.** **(1)** Its folder slug says
> *"the two … Sprint 4 and 5"*, but its scope is **FIVE sites across Sprints 2–5** — the scope was
> widened by owner ruling **after** filing, and the slug is **deliberately not renamed** (task files
> move only via the producer's movers, ADR-033). **The brief's `## What to build` is the scope; the
> slug is a stale name.** **(2)** Site 5 states the retired mechanism twice, and its *conclusion* —
> that `backlog.md` is invisible to `/fkit-status`'s default run — **remains true under ADR-041, by
> identity rather than by filename**. ⛔ **Correct the mechanism; do not negate the conclusion.**

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] — §6 sites 3–7, and §4's "not the enforcement site" ruling
- [[tasks/retire-the-sprint-glob-in-fkit-status-skill]] — sites 1–2; the dependency
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board and the generated header
- [[tasks/build-fkit-sprint-ship-loop-skill]] — two of the corrected sites live in this skill
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the rule the re-rank that reordered this row was checked against
- [[systems/launch-convergence-and-init]] — why the generated copies are unreachable
