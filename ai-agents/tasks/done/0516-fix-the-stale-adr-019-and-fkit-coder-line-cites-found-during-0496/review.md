# Review — 0516

Task: ai-agents/tasks/done/0516-fix-the-stale-adr-019-and-fkit-coder-line-cites-found-during-0496/brief.md
File(s) under review: claude/skills/fkit-sprint-ship-loop/SKILL.md, claude/agents/fkit-coder.md, claude/skills/fkit-task-ship-loop/SKILL.md, ai-agents/knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md, ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md, ai-agents/knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md, and this folder's worklog.md (working tree vs HEAD `6227119`)
Status: closed-out
Coverage: reasoning-only second opinion — Codex ran (`codex-cli 0.157.1`, exit 0) and returned a diff-grounded "no significant issues found"; it executed only source-text inspection (`git diff --check HEAD`, `git diff --numstat`, `rg` scans), no behavioural check. Claude leg measured: `node --test test/coordination-citation-policy.test.js` 22 pass / 0 fail over this working tree. The full suite is the parallel Verify step's, not this review's.

## Reviewer findings
| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|

Round 1 (2026-10-15): no novel findings from either reviewer. Verified by hand: every new heading+quote anchor lands on the sentence the old number meant (ADR-019 §Decision item 4's closing sentence; §Decision item 5's opening; §Consequences → Negative / costs "A soft self-classification boundary"; §Consequences → Residual risks "The owner later wants relayed-consent close-out"; `fkit-coder.md` §Consulting a teammate "But: a genuinely NEW architecture decision goes to the OWNER."); ADR diffs are additions-only (numstat 9/0, 11/0, 11/0); the two rewrapped bullets change only the cite; the ADR-032 (five) and ADR-037 (three) note counts match the notes present; no live ADR-019 line cite or `fkit-coder.md:165` remains outside annotated ADR originals and frozen reports; the +1 line in `fkit-coder.md` breaks no inbound cite that was correct before it; the three `.claude/` copies are byte-identical to their sources.

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|

Round 1 (2026-10-15): no findings to disposition, so no rows. Step 0: *Accepted residuals* empty; ADRs in scope skimmed (ADR-019, ADR-025, ADR-032, ADR-033, ADR-037, ADR-055, plus `conventions/durable-citation-anchors.md`); nothing to loop-check, nothing suppressed as settled. Spot-checked the working-tree diff of the six files: matches the approved plan (with its X1+X2 amendments); ADR numstat 9/0, 11/0, 11/0. No code changed by this step. Convergence: converged — header set to `closed-out`.

## Accepted residuals (shared, do-not-re-litigate)
