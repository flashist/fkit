# Review — 0419

Task: ai-agents/tasks/done/0419-port-aiboards-sprints-to-node-faithful-to-aiboards-format/brief.md
File(s) under review: board/core/store.mjs (only the three added methods `moveSprint`, `sprintAdd`, `sprintRemove`; the rest of the file is 0418's, out of scope), test/board/sprints.test.js (new)
Status: closed-out
Coverage: reasoning-only second opinion — round 1: Codex (`codex-cli 0.157.1`, exit 0) returned a usable pass ("no significant issues found in Task 0419 scope"); its only execution, `npm test -- --test-name-pattern=… test/board/sprints.test.js`, ran the whole suite and failed before the target tests ran (read-only sandbox refused `mkdtemp`, EPERM), so it measured nothing. Measurement is the reviewer's: `node --test test/board/*.test.js` 52/52; `test/board/sprints.test.js` alone 6/6 ×3 (~100 ms per run); an independent Python-vs-Node parity run (aiboard `a1592dc` extracted read-only, `python3 -I`, 18 hand cases), where all files matched and only exception class/message differed, on non-string input to 0417 helpers; one mutation (in a scratch copy) left all 6 tests green (see Suggestions in the report).

## Reviewer findings
| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|

_Round 1: no confirmed defects in 0419's scope. No rows._

Out-of-scope observation (no row, no 0419 action): Python and Node raise different exception classes (Python `AttributeError`, Node `TypeError`) for non-string input to 0417's `normalizeId` / `normalizeStatus` (`board/core/model.mjs`, `board/core/python-compat.mjs`). Two triggers: (a) a hand-typed non-string entry in a sprint's `tasks:` list (coder's worklog forward note); (b) a `null` status (`moveSprint('S-001', null)`, and the same through 0418's `moveTask`; found by the reviewer in round 1, not in the worklog). Files on disk are identical in both runtimes. 0419 adds no normalization or comparison of its own, so this belongs with whoever owns `model.mjs` and with 0423's corpus gate, not with 0419.

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|

_Round 1: no findings to disposition. No rows. The reviewer's suggestion (one `sprintRemove` call with a member ref then a stale ref, to kill the mutant that drops `sprint = this.getSprint(sprint.id);` in the else branch) was added as a 7th test in `test/board/sprints.test.js`; it fails on that mutant. The out-of-scope observation is carried as 0419 worklog forward note "For 0423 / whoever owns `model.mjs`", now naming all four known triggers. Details: worklog, review round 1 section._

## Accepted residuals (shared, do-not-re-litigate)
