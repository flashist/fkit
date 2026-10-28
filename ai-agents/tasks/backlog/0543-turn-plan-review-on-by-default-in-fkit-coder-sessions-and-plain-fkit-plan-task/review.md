# Review — 0543

Task: ai-agents/tasks/backlog/0543-turn-plan-review-on-by-default-in-fkit-coder-sessions-and-plain-fkit-plan-task/brief.md
File(s) under review: claude/fkit-claude.sh, test/launcher-contract.test.js, claude/skills/fkit-plan-task/SKILL.md, claude/agents/fkit-{coder,architect,producer,lead}.md, claude/skills/fkit-sprint-ship-loop/SKILL.md, ai-agents/tasks/README.md, claude/scaffold/ai-agents/tasks/README.md, claude/structure-manifest.tsv, CHANGELOG.md, ADR-060 (dated note), the 0543 folder (brief status, plan.md, worklog.md), ai-agents/sprints/sprint-12.md (0543 row) — uncommitted working tree, 2026-10-27
Status: closed-out — round 2 (2026-10-27): R1 fixed (D11–D13) and reviewer-verified; no new findings
Coverage: reasoning-only second opinion — round 2: Codex ran (`codex-cli 0.157.1`, exit 0, "No findings") and reasoned over the launcher, the harness and the D11–D13 diff; its `npm test -- --test-name-pattern='D1[123]'` attempt exited 1 in the read-only sandbox (mkdtemp EPERM; D11–D13 reported "cancelled", not a behaviour failure), so it measured nothing. Execution evidence is the Claude reviewer's: `node --test test/launcher-contract.test.js` 57/57 pass, 0 fail (40.5 s), D11/D12/D13 green.

## Reviewer findings
| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|
| R1 | 1     | low  | test/launcher-contract.test.js:484 (`D8. after a \`--\` separator`) and :443 (`D2. \`fkit coder --no-plan-review\``) | Key-list item 1 (the argv the launcher hands to `claude`, CONTRIBUTING §Test rules) has three stated contract points with no test: (i) the exact token is taken out even as another option's value (`fkit coder --append-system-prompt --no-plan-review` → argv ends `--append-system-prompt`; ADR-060 Decision 3 dated note, "The option-value edge case"); (ii) after a non-coder role, a token after `--` passes through with no usage error (`fkit lead -- --no-plan-review`); (iii) the token is taken out wherever it sits, not only first (`fkit coder --resume --no-plan-review --debug` → off line, `--resume --debug` kept in order; ADR-060 Decision 3 "wherever they appear among the args"). All three behave correctly today (reviewer's harness probe, round 1); the gap is coverage only. A missing test on the key list is a Defect by the project's own rule. Raised by both (Codex X1, X2; Claude iii). |

### Owner disposition on R1 (recorded by the reviewer, round 2)
2026-10-27, `fkit coder` session, `AskUserQuestion`: question *"How should R1 (three untested launcher cases) be handled?"* → selected *"Add the 3 cases (Rec)"* (description shown: *"Your OK by name for: coder --append-system-prompt --no-plan-review; lead -- --no-plan-review; coder --resume --no-plan-review --debug. ~+1.5 s, no new file."*). A fix, not a settled tradeoff — no accepted residual added.

### Round 2 — reviewer verification of the R1 fix
- **R1 — fixed, verified.** `test/launcher-contract.test.js` Group D gains D11 (`test("D11. the token is taken out even as another option's value"`), D12 (`test('D12. \`fkit lead -- --no-plan-review\` passes through`), D13 (`test('D13. the token is taken out wherever it sits`). Each asserts `exec === true` plus the full argv by `deepEqual`, so each goes red on its regression: token not consumed as an option value → `--no-plan-review` stays in argv and the line file is `on` (D11); a usage error after `--` for a non-coder role → `exec` false (D12); only a first-position token consumed → `--no-plan-review` stays in argv (D13). Content of the off line is already pinned by D2; D11/D13 pin the off file by path. D12's lead argv matches test 1's shape. Reviewer run: launcher-contract 57/57 pass (40.5 s). Coder-reported, not re-run by the reviewer: `npm test` 950 pass / 0 fail / 1 skip; `npm run test:prove-red` PASSED.
- **No new findings** this round (Claude pass and Codex pass both clean). Scope was the D11–D13 change; that nothing else changed since round 1 is the coder's statement (no round-1 snapshot to diff against).
- **Convergence: closeout.** No open defects; nothing re-litigated.

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT — verified: Group D's `runFkit` calls (D1–D9) include no option-value case, no non-coder `--` case, and no non-first token; severity **low**, derived (the code is correct, the gap is coverage only; it is a defect only by key-list item 1) | Defect | Put to the owner (the cases are outside the plan's named OK). Owner, 2026-10-27, `fkit coder` session, `AskUserQuestion`: *"Add the 3 cases (Rec)"*, his OK by name. Added D11 (`coder --append-system-prompt --no-plan-review` → off line, argv ends `--append-system-prompt`), D12 (`lead -- --no-plan-review` → passes through), D13 (`coder --resume --no-plan-review --debug` → off line, `--resume --debug` in order) to `test/launcher-contract.test.js` Group D. `npm test` 951: 950 pass / 0 fail / 1 skip, 1:32.2 | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)
- (none yet)
