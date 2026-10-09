# Review — 0395

Task: ai-agents/tasks/done/0395-re-measure-the-ci-test-runtime-on-the-ubuntu-runner-and-correct-the-workflow-timeout-and-its-comment/brief.md
File(s) under review: .github/workflows/test.yml (timeout + its comment); RELEASING.md (the §"3. Run the suite yourself first" runtime wording and the §4 CI paragraph only); bin/release.mjs (the three "~6 min" → "10+ min" texts only); ai-agents/knowledge-base/architecture.md (the one "~6 min" → "10+ min" text only). Other tasks' uncommitted edits in the same files are out of scope.
Status: closed-out
Coverage: reasoning-only second opinion — Round 1: Codex ran (codex-cli 0.157.1, exit 0) and returned one finding; it executed only source checks (git show / rg counts, `ruby -ryaml` parse, `git diff --check`), no behavioural check. Reviewer leg measured: `gh run view --json jobs` for all 20 runs + `--log` split for run 36984588959 (all match the worklog), `npm run test:docs` 372/372 pass, `node --test test/release-summary.test.js` 30/30 pass, `node --check bin/release.mjs` ok. Full `npm test` not run here (parallel Verify step).

## Reviewer findings
| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|
| R1 | 1     | low  | .github/workflows/test.yml:34 | *"Those runs carried prove-red.sh mutations 1-40 and baselines 0a-0o"* is false for 6 of the 20 runs the comment names as its source: commits 81f1429 → add6a07 (runs 34954360697, 35061888223, 35064058140, 35070805186, 35327985039, 35502897871) carry mutations 1-39 only; mutation 40 arrived in 3027cc7 (run 35598869071, 2026-09-21). Checked with `git show <c>:test/prove-red.sh`. The basis run (36984588959, 4346410) does carry 1-40, so the timeout value is unaffected. Fix direction: tie the count to the 2026-10-02 runs/basis run, or say "1-39, then 1-40 from 2026-09-21". Raised by both reviewers. Defect (brief V3: every count in the comment true). |
| R2 | 1     | low  | worklog.md § Flags for later | The wiki-sync flag names only *"still quotes `timeout-minutes: 20`"*. The vault also cites RELEASING.md's old *"roughly 6–8 minutes, machine-dependent"* (an owner-ruled figure from 2026-08-13, now replaced under Q3) as the standing authority — `ai-agents/wiki-vault/wiki/tasks/fix-the-post-release-verify-lines-failing-and-false-green-cases.md`, the *"The standing authority is `RELEASING.md:128`"* bullet. A sync done from this flag alone would leave that stale. Fix direction: add it to the flag. Defect (incomplete handoff), docs-only. |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (low: comment-only; the basis run and the four slowest carry 1-40, so `timeout-minutes: 33` is unaffected) | Re-counted all 20 run commits with `git show <sha>:test/prove-red.sh`: 14 carry 1-40, 6 (81f1429 → add6a07) carry 1-39, all 0a-0o. Rewrote `.github/workflows/test.yml:34-35` to *"All 20 carried prove-red.sh baselines 0a-0o and mutations 1-40 (incl. the basis run), except the 6 before 3027cc7 (2026-09-21), which had 1-39"*; reflowed `:34-38` to stay within 100 columns (same 5 lines; `timeout-minutes: 33` still `:42`, so `RELEASING.md`'s citations stand). Logged as worklog decision D6. | ✅ done |
| R2 | CORRECT | Defect (low: handoff note only, no shipped text) | Verified that the vault page and the *"The standing authority is `RELEASING.md:128`"* bullet still quote *"roughly 6–8 minutes, machine-dependent"*. Added a second wiki-sync flag to worklog.md § Flags for later naming that page, plus three more pages that still present the old figure as current (found by grep). The wiki was not edited. Logged as worklog decision D7. | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)
