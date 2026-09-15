# Review — 0389

Task: ai-agents/tasks/done/0389-add-dual-home-parity-md-s-missing-fkit-accepted-drift-row-and-correct-its-stale-mirror-count/brief.md
File(s) under review: ai-agents/knowledge-base/conventions/dual-home-parity.md (working tree vs HEAD; +2/−1)
Status: closed-out
Coverage: both reviewers measured — Round 1: Codex (`codex-cli 0.152.0`, exit 0) imported `test/dual-home-parity-exceptions.mjs` in a Node audit (28 total / 18 files / 10 dirs, zero table paths missing) and ran `node --test test/dual-home-parity.test.js` (4 live-corpus checks passed; 5 synthetic checks blocked by read-only sandbox `mkdtemp` EPERM); the Claude reviewer ran the same module import with brace expansion (28/18/10, all 28 paths present) and the suites dual-home-parity 9/9, reference-integrity 22/22 (0 broken, 7 named-exempt), coordination-citation-policy 21/21.

## Reviewer findings

| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|

*(Round 1: no findings. Both passes clean. Row matches the module entry — path `.fkit-accepted-drift`, kind `live-only`, reason condensed faithfully (task 0247, shipped copy would pre-mute launch notices, live copy exists because this repo dogfoods fkit); placed directly after the page's other `live-only` row, mirroring module order; `⛔ never sync` parity cell and "kind — reason" cell form follow the majority of rows. Counts 28/18/10 re-derived from the module and correct. Every module path present in the table with braces expanded. No link added, no line-number citation added.)*

## Coder response

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|

*(Round 1: no reviewer findings, so no rows to write. Both accepted residuals checked against plan.md § "Owner rulings": they match Q2=A and Q3=A and follow the What / Why / Re-raise shape. Nothing blocking, so the ledger is closed out. No source changed.)*

## Accepted residuals (shared, do-not-re-litigate)

- Stale count comments under `test/` — What: the "all 26 live entries" comment in `test/dual-home-parity.test.js` and the "13 real files" comment in `test/dual-home-parity-exceptions.mjs` stay as-is; nothing filed · Why (structural): owner ruling Q2=A (plan.md § "Owner rulings"), write surface fenced to the convention page; rejected: editing them in 0389, or filing a follow-up · Re-raise only if: a test or tool starts reading those comments as data, or the owner reopens scope.
- No page↔module guard test — What: mirror completeness stays checked by hand · Why (structural): owner ruling Q3=A (plan.md § "Owner rulings"); rejected: adding a guard test in 0389 · Re-raise only if: the mirror drifts again after this fix, or the owner asks for a guard.
