# Scope `README.md:54`'s *"fkit-managed structure"* sentence to what the check actually covers

**Source**: `ai-agents/tasks/done/0292-scope-readme-54s-fkit-managed-structure-sentence-to-what-the-check-actually-covers/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-14
**Sprint/Tag**: Backlog board, unscheduled and unranked · task `0292` · owner `fkit-coder`

## Goal

**Discharge ADR-043 §C6's knowingly-wrong README line.** The launch notice's one-line description said
the check watches *"the fkit-managed structure"*, which reads as including `.claude/` — the very tree
ADR-043 ruled is **deliberately not** a conformance surface. Owner ruling 2026-08-13, verbatim option
label ***"Its own follow-on brief"***.

⚠️ **This edit is a CONSEQUENCE of ADR-043, not a pre-emption of it.** Writing the corrected sentence
before the ADR ruled would have decided the question task `0255` existed to decide — which is exactly
why it was filed as a separate row rather than folded in.

## Key Changes

`README.md:54-57` now reads (verified on disk 2026-08-14):

> A launch also tells you — one stderr line — when your project's `ai-agents/` tree, or its root
> `CLAUDE.md` / `AGENTS.md`, diverges from what the installed version ships. (The fkit agents and
> skills under `.claude/` are not part of that check: a launch rewrites them outright, so there is
> nothing to diverge.)

✅ **It avoided the remedy ADR-043 §C6 itself warned was wrong.** Scoping the sentence to `ai-agents/`
**alone** would have under-described a check whose inventory Table B includes the root `CLAUDE.md` and
`AGENTS.md` — and would have failed the task's own verification step. The landed fix keeps both root
files in the description and states the `.claude/` exclusion **with its reason**, so a future reader
cannot mistake the absence for an oversight.

Review: **✅ Ready to merge, no open confirmed defects**, both reviewers ran.

## Outcome

### Two accepted residuals, both owner-ruled

- **AR-1 — the one-line summary reads broader than the check it summarizes.** The check is not
  tree-wide: it is an inventory of **48 pinned spec paths** (46 under `ai-agents/`, 2 outside), of
  which only the **10** `fkit-authored reference file` rows are content-compared; 19 structural
  directories and 13 `.gitkeep` placeholders are existence-only, `PROJECT.md` is never
  content-checked, and **owner files added under `ai-agents/` are never reported at all**. ⚠️ **Ruled
  the intended shape, not a defect** (verbatim label *"Promote to accepted residual (Recommended)"*):
  the sentence is **byte-identical to ADR-043 §C6**, it is faithful to the stderr line it describes,
  the next sentence delegates the per-file verdicts to `/fkit-heal`, and the replaced wording carried
  the identical imprecision. **Not a regression.**
- **AR-2 — this sentence can go stale SILENTLY.** ⚠️ It is accurate today *only by coincidence of the
  current inventory*: exactly **two** of the 48 pinned paths sit outside `ai-agents/`. If a third is
  ever added the sentence becomes **factually wrong** — and **nothing catches it**, because no test in
  `test/` reads the root README's prose. The ledger recorded the follow-on as **owed**, and ⛔
  explicitly declined to file it: task filing is the producer's alone (ADR-033).

### ✅ The owed follow-on was filed — task `0298`, open

**Filed 2026-08-14** on the owner's verbatim ruling *"File a follow-on task (Recommended)"*: a test
assertion that **fails loudly and points at the README sentence** the moment
`claude/structure-spec.md`'s inventory gains or loses a path outside `ai-agents/`. Backlog board,
`🔲 Backlog`, **unranked**, owner `fkit-coder`. ⛔ It does **not** change `README.md:54-57` — the
wording is settled by this task and constrained by ADR-043 §C6's verbatim text — and it does not
change the inventory. **It adds a tripwire, not a rewrite.**

⚠️ Closed `(agent-closed — not owner-verified)`. **No human has checked it.**

## Related
- [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]] — §C6, the residual this task discharges, and the verbatim text that constrains the wording
- [[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] — `0255`, the decision row whose ruling this implements
- [[tasks/state-the-per-project-relaunch-step-fkit-update-requires]] — `0253`, whose R2 residual deliberately left this same line wrong, now discharged
- [[systems/install-and-self-update]] — the launch notice and the structure check the sentence describes
