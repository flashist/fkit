# Review — 0182

Task: ai-agents/tasks/done/0182-build-the-closed-rank-immutability-guard/brief.md
File(s) under review: test/closed-rank-immutability.test.js (NEW), test/fixtures/closed-rank-0174-before.md (NEW, frozen bytes), test/fixtures/closed-rank-0174-after.md (NEW, frozen bytes), ai-agents/tasks/done/0182-build-the-closed-rank-immutability-guard/worklog.md
Status: in-review

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | medium | test/closed-rank-immutability.test.js:144 | A table row with leading whitespace silently terminates parsing: that row AND every row after it drop out of the watch with no throw (verified firsthand: `" | ✅ Done \| P2 \| …"` mid-table → only rows above it parse). Worst case (raised by both reviewers; Codex articulation): indent the later revision's whole table and renumber a closed row — later parses to zero rows, reads as deletion (ratified reading 2), leg passes green; the vacuous-pass count reads the EARLIER revision, so it does not catch this. Contradicts the brief's own load-bearing fail-loud rule ("a silently skipped malformed row is a vacuous pass"); markdown renders an indented row as a normal table row, so nothing looks wrong. Cheap fix: treat `/^\s*\|/` lines as table lines (or throw when the terminating line's trimmed form starts with `\|`). |
| R2 | 1 | low | test/closed-rank-immutability.test.js:82 | The masking sentinels are assumed absent, not enforced: a Priority cell containing literal `\u0000\u0000` unmasks to `\|`, so a frozen closed cell changing from raw-NUL bytes to a real `\|` compares equal and is not flagged (Codex finding, verified correct in mechanism). Requires raw NUL bytes inside a markdown board file — near-impossible in any real editing path. Cheap hardening: throw on control characters in a table row before masking. |
| R3 | 1 | low | test/closed-rank-immutability.test.js:257 | `revBoards` uses non-`-z` `git ls-tree`: a board filename with non-ASCII bytes is C-quoted by git, fails both the `BOARD_DIRS` check and `BOARD_NAME`, and silently drops from the HEAD side — the board is unwatched with no throw (Codex finding, verified correct in mechanism). Hypothetical against the `sprint-<n>.md` naming convention; the worktree side (readdirSync) is unaffected, so the asymmetry reads as "new board, nothing to compare". Cheap fix: pass `-c core.quotepath=off` (or `-z`) to the ls-tree call. |

## Coder response

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Row loop widened to consume any `/^\s*\|/` line; a row with leading whitespace before its first `\|` now THROWS naming board and row (fail-loud, per the brief's rule) — it can no longer silently end the table. Two regression tests added: a mid-table indented row throws, and the Codex worst case (entire later table indented) throws instead of parsing to zero rows. Owner-ruled: "Fix before close". | ✅ done |
| R2 | CORRECT | Defect | The masking sentinels are now ENFORCED absent: any table row containing U+0000 or U+0001 throws (naming board and row) before masking runs, so raw-NUL bytes can never unmask into `\|` and defeat the frozen-cell comparison. Regression test added covering both sentinel characters. Owner-ruled: "Fix both". Severity re-derived and held at low — the trigger requires raw NUL bytes inside a markdown board file. | ✅ done |
| R3 | CORRECT | Defect | `revBoards` now passes `-z` to `git ls-tree` and splits on NUL, so filenames arrive raw — a non-ASCII board name is no longer C-quoted into failing the `BOARD_DIRS`/`BOARD_NAME` filters and silently dropping from the HEAD side. Regression test added: a committed `sprint-é.md` is listed and parses. Owner-ruled: "Fix both". Severity held at low — hypothetical against the `sprint-<n>.md` naming convention; the worktree side was never affected. | ✅ done |

**Round-1 disposition note (process-review unit, 2026-08-06, spawned fkit-coder under the
fkit-sprint-ship-loop declared-approval marker):** all three findings verified firsthand against
`test/closed-rank-immutability.test.js` before fixing — R1's silent-termination loop condition, R2's
unenforced sentinel assumption, and R3's quotepath drop each confirmed in the code, none matching an
accepted residual or an ADR re-raise condition. All three fixes were owner-ruled in the live lead
session 2026-08-06 (R1 "Fix before close"; R2+R3 "Fix both") and applied under that standing
approval. Suite result after fixes: `node --test test/closed-rank-immutability.test.js` — **34/34
pass, 0 skipped** (was 30 tests; +4 regression tests), both live legs green. Full `npm test` is the
driver's re-verify. Header left `in-review` for the reviewer/driver to confirm the fixes and close.

## Accepted residuals (shared, do-not-re-litigate)

*(none yet — the owner-ratified readings and rulings recorded in plan.md's Approval record function as settled decisions for this review: (1) code-span pipes masked with the fail-loud throw as backstop; (2) a closed row deleted from the later revision is not flagged; (3) full byte-exact fixtures, ~672KB, frozen — never edited; (4) prove-red gains no mutation for this suite until 0214/0215 — gap stated, not fixed. ADR-035's re-raise conditions also apply: findings proposing to repair the eight renumbered rows or edit boards are closeout, not findings.)*
