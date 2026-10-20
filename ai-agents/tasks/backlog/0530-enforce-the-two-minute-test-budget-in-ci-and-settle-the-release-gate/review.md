# Review — 0530

Task: ai-agents/tasks/backlog/0530-enforce-the-two-minute-test-budget-in-ci-and-settle-the-release-gate/brief.md
File(s) under review: .github/workflows/test.yml, .github/workflows/prove-red.yml (new), bin/release.mjs, test/release/release-summary.test.js, RELEASING.md, CONTRIBUTING.md, ai-agents/knowledge-base/architecture.md, ai-agents/knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md, ai-agents/knowledge-base/decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md, ai-agents/knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md, worklog.md
Status: closed-out
Coverage: reasoning-only second opinion — codex-cli 0.157.1, exit 0, usable findings list; Codex executed only `git diff --check` (source-text inspection, not a behavioural run) and ran no test or release command. Claude leg measured: `npm run test:release` 30/30, `npm run test:docs` 51/51, `npm test` 845/845 in 81.5 s (load ~10), the test.yml budget block run under `bash -e` with a shim `npm` (over / under / red / red+slow), and four scratch release.mjs fixtures (first red stops, HEAD moved during `test:release`, both green).

## Reviewer findings
| #  | Round | Sev | Location | Claim |
|----|-------|-----|----------|-------|
| R1 | 1     | nit | test/release/release-summary.test.js:510 (and its comment at :507) | Test 0300's title says "refused after the gate" and its comment says "The script now re-reads HEAD after the gate". Since C1, `refuseIfHeadMoved("npm test")` runs inside `runTests()` right after `npm test` (bin/release.mjs:353), so the refusal now comes mid-gate, before `npm run test:release`. The assertions are still right; only the title and comment are out of date. Project rule: fix a comment your change makes wrong. |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT (sev: nit — mine, agreed; wording only, no behaviour or assertion touched) | Defect (a comment/title this task's C1 made wrong) | Verified: `runTests()` calls `refuseIfHeadMoved(name)` after each gate script (bin/release.mjs, the `// After each script` comment above `refuseIfHeadMoved(name);`), so 0300's refusal comes straight after `npm test`, before `npm run test:release`. Test 0300's title → "refused straight after npm test, before test:release and any write"; its comment → "re-reads HEAD after each gate script". No assertion changed; reviewer's suggestions (a not-ran assertion, X3, a RELEASING §5 line) not taken — not defects, new assertions need the owner's OK (ADR-057 D2). 0479's "refused after the gate" title checked: still true (the changelog re-read runs after both scripts), left. `npm run test:release` 30/30 pass, 49.9 s (load ~10). | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)
