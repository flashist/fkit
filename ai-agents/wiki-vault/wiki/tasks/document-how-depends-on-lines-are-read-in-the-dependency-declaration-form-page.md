# Document how `Depends on:` lines are read in the dependency-declaration-form page

**Source**: `ai-agents/tasks/done/0501-document-how-depends-on-lines-are-read-in-the-dependency-declaration-form-page/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P21` (pulled by owner ruling R11, 2026-10-14) · task `0501` · owner `fkit-coder`

## Goal
Owner ruling 2026-10-09 on `0494`'s Q2, verbatim *"Not now; follow-up brief (Recommended)"* — this is that brief.
Task `0492` taught `dashboard.sh` to **read the task IDs** on a `Depends on:` line and to tell **soft** from **hard**
dependencies, for its `drift depends-on-later-sprint` record. Those reading rules lived only in `0492`'s plan and
worklog and in one sentence of `fkit-status/SKILL.md` — **not** in `dependency-declaration-form.md`, the page that calls
itself the form's *"single documented home"*. Docs only: no `dashboard.sh` change, no rule change.

**The cost, ruled with it in view:** two homes edited together (live + scaffold, **audience-adapted**, not
byte-identical — the scaffold uses neutral IDs); the scaffold copy is hashed, so `structure-manifest.tsv` is regenerated
and **every fkit user's `/fkit-heal` offers the page as an update**; one full `npm test`.

## Key Changes
- A new section **`## How the board reads the IDs (task 0492)`** in both copies (scaffold: no task number, IDs
  `0042`–`0045`), between *The guard* and *Rules*; no existing line changed:
  1. **Only exact 4-digit task IDs are read** — not `110`, `T-023`, `ADR-0047` or a date. Every such ID counts, even one
     mentioned in passing; an ID with no task folder is skipped.
  2. **Soft = `— soft, not hard` after the ID** — the same marking `/fkit-task-brief` uses (wording checked against
     `0494`'s step). Anything not marked soft is **hard**. The mark covers the ID before it up to the next *different*
     ID; the first `soft`/`hard` decides, **whole words only** (`software`, `Microsoft`, `harden` decide nothing). An ID
     named twice is soft only if every mention is.
  3. **The bold form works** — text **after** the closing `**` decides.
  4. **Known misses — write around them:** the word **before** the ID reads hard (over-flags, safe); ranges are not
     expanded; *"(not soft)"* reads **soft** (the quiet direction — never write it); and **a link to the task's folder
     repeats the ID in its path**, so a `soft`/`hard` in the slug can decide it.
- The flagged blockers list now names a **closed** sprint too (*"later, not-started, closed or unresolved"*) — review R3,
  matching `dashboard.sh`'s `sprint-closed` reason.
- `structure-manifest.tsv` regenerated (one new scaffold hash; history-keeping, old line kept).

## Outcome
- ⭐ **Writing it down exposed a real quiet miss, and the owner ruled twice on the advice.** Mid-build, the plan's remedy
  (*"put the mark after the link"*) failed on a scratch board — the slug's word is the first after the repeated ID.
  Owner: *"Fix the advice (Rec)"*. Review then showed it was wider still (R1, medium): **any** link into a folder whose
  slug holds `soft` makes an **unmarked** ID read soft — no record; and the soft-mark advice gave a false (loud) flag
  (R2). Owner: *"Repeat mark after link (Rec)"* — the page now says: **the ID and its mark first, then the link, then the
  mark again** — `0110 — hard, not soft ([brief](../0110-make-it-soft/brief.md)) — hard, not soft`. A slug with `hard`
  still over-flags (safe direction).
- ⚠️ **The worklog's own evidence table misreported one row** (row 0221: "record" where the run showed none) — a dated
  correction was appended to the worklog; found by review.
- Three live backlog briefs (`0444`, `0445`, `0455`) link `0443` through a slug with `hard` and say *"Hard."* — read hard,
  as intended. No finding.
- ⛔ **The reading rules themselves were not changed** — this task documents them. The slug behaviour is documented as a known
  miss to write around; neither the worklog nor the review ledger records a follow-up to change it in `dashboard.sh`.
- Checks: `npm test` exit 0, unit 1112/1112, prove-red hard gate passed; `test:docs` 389/389; the two `diff`-compared
  sections differ only by the planned substitutions.

## Related
- [[tasks/make-a-later-sprint-blocker-visible-0492-0495]] — `0492` built the reading rules; `0494`'s Q2 filed this task
- [[tasks/teach-dashboard-to-resolve-notes-dependencies]] — `0107`, which created the page and its LOUD guard
- [[systems/knowledge-base-structure]] — the convention set; this page is audience-adapted, not must-match
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — why both homes changed together
- [[tasks/add-a-why-not-what-code-comment-rule-and-remove-the-rules-that-contradict-it]] — `0506`, built just before it; the manifest carries both tasks' new lines
- [[tasks/sprint-10-the-0472-0482-batch]] · [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]]
