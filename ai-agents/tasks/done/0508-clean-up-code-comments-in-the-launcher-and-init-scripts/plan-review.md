# Plan review — 0508

Append-only. One section per plan attempt (ADR-056). Never carried to Build or Process-review.

## Attempt 1 — 2026-10-18

Record block, copied from the plan-only coder's return:

===PLAN-REVIEW RECORD BEGIN===
Switch line: Plan review: on — set by the owner for this fkit-sprint-ship-loop run (--plan-review, 2026-10-15), run Sprint 12 started 2026-10-15T16:38:40Z
Times (UTC):
- plan drafted 2026-10-18T18:05:02Z
- architect asked, round 1: ~18:05:20Z; reply 18:11:22Z
- architect asked, round 2: 18:11:52Z; reply 18:12:10Z
- Codex start 18:13:41Z (prompt stamped 20261018T181345Z); end 18:20:27Z
- record returned 2026-10-18T18:20:47Z
Classification: code-only — comments in two shipped scripts, plus comment and doc cite fixes. No code, string or heredoc changes, so what fkit delivers is unchanged. The architect agreed.
Round 1: fkit-architect — CHANGES REQUESTED.
  1. The 0247 pointer is incomplete: review R1 (LC_ALL=C; a filter failure drops suppression) and R2 (all CRs stripped) changed the contract. The test header must not call a frozen plan "the authority".
  2. The convergence draft says drift is "never fixed", which reads as fkit-wide; /fkit-heal repairs drift (ADR-039). It also drops the "do not make it overwrite stale files" rule.
  3. The rules-cap draft drops two caveats: attention dilution is suspected but unmeasured, and the strip measurement is build-specific.
  4. The update-case draft overstates the refusal: an explicit FKIT_SHARE is taken as given.
  Approved as designed: classification, M4l (record it in 0508's worklog), the M4c clarification, fences F1–F5 (F4 re-run by the architect at HEAD: each target hits only orphan-targets), the rule-5 edits outside the two files, Q-A and Q-B. Optional: keep "STDERR (OUTPUT TRAP)" in §1. Also name the coordination-citation-policy fixture in V5.
Changes, round 1:
  C1 — the launcher notice comment points to "0247 plan §2–§3, review R1, R2"; the test header becomes "(the arms below are the contract; its record is 0247 plan §2–§3 + review R1–R2, ADR-039 Decision 3)". Answers item 1.
  C2 — the convergence comment keeps the never-overwrite rule and scopes drift repair to /fkit-heal (ADR-039). Answers item 2.
  C3 — the rules-cap comments keep both caveats inline, plus the 400 B target with a 0130 pointer. Checked: the 0130 brief and plan hold "dilution suspected but unmeasured" and the 400 B target; the 0177 brief says re-measure. Answers item 3.
  C4 — the update-case comment gains "unless FKIT_SHARE names it". Answers item 4.
  C5 — M4l is recorded in 0508's worklog (sequence step 6). Answers item 5.
  C6 — V5 names the coordination-citation-policy fixture. Answers item 9.
  C7 — the §1 label keeps "on STDERR (OUTPUT TRAP)". Answers item 11.
Round 2: fkit-architect — APPROVE.
  1. C1–C7 resolve items 1–5, 9 and 11.
  2. The convergence line 2 and the §1 line 1 drafts ran about 120 and 113 columns: rewrap to 2 lines, or list them in V6. The §1 rewrap must keep "`[ -L ]` is the one test that does not lie, so it has to come first" verbatim.
  3. The 0130 worklog records the 2.1.220 strip measurement and 0177 the codex half, so "(0130, 0177)" holds.
Changes, after round 2 (before Codex; mechanical): the convergence line 2 and the §1 line 1 were rewrapped within the same words to 106 and 108 columns (measured), and the §1 quote is kept verbatim. Answers round-2 item 2. No round 3.
Disagreement: none.
Codex: mode `[codex]` — Codex CLI present, run exited 0. No fallback banner. Codex ran the orphan-target boundary greps (no hits outside claude/orphan-targets) and `bash -n` / `sh -n` (all 0). It did not run npm test or dry-run any mutation. Not covered by anyone: the plan's line numbers were not checked one by one against HEAD, and the F1/F2 greps were not run on the proposed comment text. Findings verbatim:
  - **X1** · `claude/fkit-claude-init.sh:601` · medium · correctness · The §3 replacement comment in plan §5 says any user path squatting an fkit name "is deleted and NOT put back." But if a directory is named like a file (for example `.claude/agents/fkit-x.md`), `rm -f` fails under `set -e` (`:25`). The directory stays and init aborts. That is a known wrong-type case, not a deletion.
  - **X2** · `claude/fkit-claude.sh:199` · low · correctness · The self-update comment in plan §4 says "Every launch runs the check," but `FKIT_NO_UPDATE_CHECK=1` and source checkouts skip the update-check block entirely. Once the existing env explanation is removed, the new comment would be false.
  - **X3** · `claude/fkit-claude.sh:624` · medium · error-path · The structure-notice comment in plan §4 says a filter failure "drops suppression, never the notice." If both awk attempts fail, `:626` sets `sn_line=""` and no notice is printed. The retry keeps the notice only when the unsuppressed retry succeeds.
  - **X4** · `test/structure-manifest.test.js:253` · low · regression · Plan §6 leaves this live assertion message pointing at `claude/fkit-claude-init.sh:366-372`, even though the plan reflows `marker_lines` and the brief says "Fix live inbound references." After the change, a failing test would point to unrelated lines. (This is the plan's open question Q-B. There is no owner ruling on it yet.)
Coder check:
  X1 — confirmed. `rm -f "$dest/.claude/agents/fkit-"*.md` fails on a directory, and `set -euo pipefail` aborts init. On the skills side, `fkit-*/` only sees directories, so a file squatter survives until `cp -R`. Open brief 0336 (R6) records exactly this. HEAD's comment makes the same overclaim, so M4i applies → PC-1.
  X2 — confirmed. Line 199: `if [ "${FKIT_NO_UPDATE_CHECK:-0}" != 1 ] && ! _fkit_is_source_checkout; then`. → PC-2.
  X3 — confirmed. Lines 624–626: if both awk runs fail, `sn_line=""` and nothing prints. HEAD's comment ("drops SUPPRESSION, never the notice") makes the same overclaim, and the architect's round-1 item 1 repeated it. M4i applies → PC-3.
  X4 — confirmed as fact; it is the plan's own Q-B. Codex adds weight to option 2. → PC-4.
Problems:
  - Round 2's re-ask to the architect carried the list of changed lines plus the change list, not a fresh paste of the whole plan. The same agent held the full round-1 plan in its context, and the skill asks for the revised full plan. Recorded so this is not presented as a fully re-pasted round.
  - No spawn was denied. No malformed reply.
===PLAN-REVIEW RECORD END===

Lead's lines:
- Plan presented to the owner: ≈2026-10-18T18:25Z (the driver's clock read 18:25:04Z immediately before presenting). The process gap in Problems was shown to the owner as a warning at the gate.
- Owner's decisions, quoted, AskUserQuestion in the fkit-lead session (fkit-sprint-ship-loop --plan-review run, Sprint 12); answers received before 2026-10-18T18:25:44Z:
  - Fixes: "PC-1–3 yes, PC-4 leave (Recommended)"
  - Q-A: "Yes, note it in 0226 (Recommended)"
  - Plan: "Approve (Recommended)"
- plan.md written 2026-10-18T18:25:44Z: the returned plan, then the lead's rulings section, then the returned post-Codex questions (40099 bytes, blob b62d79f66257e61f4b446331954a4893581e6f87). Citation-policy test after the write: 22 pass / 0 fail.
