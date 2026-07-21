# Worklog — Task 48: ship the one-skill-one-output convention in the scaffold

Task file: `ai-agents/tasks/backlog/ship-one-skill-one-output-convention-in-scaffold.md`
Plan: `ai-agents/plans/ship-one-skill-one-output-convention-in-scaffold.md` (owner-approved at plan gate)

## Owner-decision log
- **Plan gate (owner-approved):** approach (B) de-repo-specify the scaffold copy — following the
  precedent of the three shipped scaffold conventions — over (A) byte-copy with only broken links
  stripped. Rationale in the plan; supersedes the brief's narrower "diff is exactly those links"
  verification wording, which didn't anticipate the live doc's History/Provenance/Sprint-2 content.

## Worklog
- P4 build: created the scaffold convention (de-repo-specified) + README index row + count fix ("Three"→"Four").
- P5 verify (evidence below).

## Files touched / change surface
- **New** `claude/scaffold/ai-agents/knowledge-base/conventions/one-skill-one-output.md` (de-repo-specified adaptation).
- **Edit** `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` (+1 index row; count "Three"→"Four").
- Loop artifacts (not part of the deliverable): `ai-agents/plans/…`, `ai-agents/worklogs/…`, status flips in the brief + sprint row.

## Verification evidence (run after final code change)
- `grep -nE '\]\(|task [0-9]|Sprint [0-9]|2026-|OQ[0-9]|claude/'` on the new file → **zero** repo-specific links/refs (matches sibling precedent).
- **Clean-init** `claude/fkit-claude-init.sh <scratch>` (exit 0): conventions dir has all 4 entries; README lists all 4; count reads "Four"; shipped file byte-identical to scaffold source (`diff -q` IDENTICAL).
- **Convergence** init into an existing tree missing only the new file (exit 0): file **created**; stderr announced exactly `knowledge-base/conventions/one-skill-one-output.md`; pre-existing README **untouched** (sha identical before/after; still "Three"; 0 rows for the new file) — accepted limitation observed.
- `git status`: only the two scaffold paths + loop artifacts. **Not committed.**
- **Caveat (loud):** scaffold prose; `node --test` proves nothing about document content. The init/convergence runs above are the real verification.

## Brief verification steps — walked
- ✅ scaffold conventions dir contains the file; README indexes it.
- ⚠️ "content matches live / diff is exactly the links" — **intentionally superseded** by the owner-approved (B) de-repo-specification (plan gate); content follows the three siblings' precedent, not a byte copy.
- ✅ clean-init check — all four entries + README lists four.
- ✅ convergence check — created + announced; pre-existing README untouched.
- ⚠️ "no file outside `claude/scaffold/`" — held *until* the R1 fix, which the owner approved touching the live README (see below). Otherwise no scope creep.

## Review (round 1) — ledger `ai-agents/reviews/ship-one-skill-one-output-convention-in-scaffold.md`
- **Verdict:** ⚠️ Changes requested — 1 low, non-blocking defect. **Codex coverage: FULL** — reviewer's own pass + Codex adversarial (codex-cli 0.144.4) both ran and converged; not degraded.
- **R1 (low, CORRECT, Fixed):** scaffold README's "adding a **fourth** document" went off-by-one once four conventions ship; the live README carried the same latent wording. **Owner decision — count-proof both:** changed "a fourth" → "**another**" in both scaffold and live README. Fixes the pre-existing live bug, keeps parity, never goes stale.
- **Scope expansion (owner-approved):** the live-README edit is outside the plan's `claude/scaffold/`-only boundary; applied only after explicit owner sign-off at the R1 disposition.
- **Accepted residual (recorded in ledger):** the de-repo-specification of the scaffold convention (owner-approved at plan gate; matches sibling precedent). Re-raise only if a live rule/litmus line is found dropped or repo-specific residue leaks in.
- Ledger **closed-out**, last verify green.

## Owner-decision log (append)
- **R1 disposition (review round 1):** owner chose *count-proof both READMEs* ("a fourth" → "another"), expanding scope to the live README. Recorded.

## Post-fix verification (after final code change)
- Both READMEs: 0 "a fourth" hits; bullet-4 reads "adding another document".
- Clean-init re-run (exit 0): four conventions ship; README count "Four"; `one-skill-one-output.md` byte-identical to scaffold source.

## Residuals / recommended follow-ups (named only — not filed by the loop)
- **Task 45 / a wiki sync** picks up this convention into `ai-agents/wiki-vault/` (fkit-wiki's exclusive path) — out of scope here.
- **Task 49** investigates the recurring live-vs-scaffold gap (this was the 4th instance).
- Accepted convergence limitation: existing projects receive the new convention file but their pre-existing conventions `README.md` index is not updated (observed in the convergence test) — inherent, disclosed, not a bug to fix.

## Commit state
- **Not committed.** `git status` (working tree): modified `claude/scaffold/…/conventions/README.md`, `ai-agents/…/conventions/README.md` (R1), `ai-agents/sprints/sprint-2.md` + brief (status flips); untracked `claude/scaffold/…/conventions/one-skill-one-output.md`, `ai-agents/plans/`, `ai-agents/worklogs/`, `ai-agents/reviews/…`. The loop never commits — the owner commits.

## Status: 🔄 In progress — ready for the owner's done-gate
Work complete and verified; close-out (`✅ Done`) is owner-gated via `/fkit-task-done` in a producer session.
