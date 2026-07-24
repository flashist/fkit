# Review — 0116

Task: ai-agents/tasks/done/0116-add-sprint-ship-loop-to-stop-hook-skip-set/brief.md
File(s) under review: claude/turn-completion-hook.sh, test/turn-completion-hook.test.js
Status: closed-out

Verdict (Round 1): ✅ Ready to merge — 0 defects. Both reviewers ran (Claude + Codex); no findings.

## Reviewer findings
| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| —  | 1     | —   | —         | No findings. Two-reviewer pass (Claude + Codex) surfaced no novel defect. |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| —  | —       | —                 | —      | —      |

## Accepted residuals (shared, do-not-re-litigate)
- R6 (inherited from task 0127, filed as follow-up 0129) — What: SKIP 3 detects loop turns by scanning the transcript for a command-name substring; over-skips (any later turn once the marker appears anywhere) and under-skips only on a degraded transcript. Why (structural): a Stop payload has no tool-call list; over-skip is fail-open-safe (ADR-030 Decision 6). Re-raise only if: a transcript-independent skip signal lands (task 0129). **Out of scope for 0116** — 0116 only adds one entry to the existing seam; it introduces no new instance of this residual.
