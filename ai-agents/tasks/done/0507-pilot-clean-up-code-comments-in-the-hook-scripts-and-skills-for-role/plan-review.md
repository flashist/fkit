# Plan review — 0507

Append-only. One section per plan attempt (ADR-056). Never carried to Build or Process-review.

## Attempt 1 — 2026-10-16

Record block, copied from the plan-only coder's return:

===PLAN-REVIEW RECORD BEGIN===
Switch line: Plan review: on — set by the owner for this fkit-sprint-ship-loop run (--plan-review, 2026-10-15), run Sprint 12 started 2026-10-15T16:38:40Z
Times (UTC): plan drafted 2026-10-16T20:49Z · round 1 ask architect 20:49:13Z, return 20:52:33Z · round 2 ask architect ~20:52:45Z, return 20:53:04Z · Codex start 20:54:22Z, end ~21:02:18Z · record returned 21:02:51Z
Classification: code-only. The change edits comments only in internal hook scripts and skills-for-role.sh, plus an internal method for the series. Nothing fkit delivers to its users changes. The architect confirmed this classification.
Round 1: architect — APPROVE — (1) the classification is right; (2) the plan fits the recorded decisions, and the pointer homes it checked exist; (3) Q1 is handled correctly, but cite 0226's step 3 and verification step 4, not the ruling itself, as the source of "keep it verbatim"; (4) the .claude/skills-for-role.sh correction is confirmed; (5) prove-red mutations 5 and 6 also have no anchor, not only 4; (6) the shell check fails safe on `$(…)`, so record that in §8; (7) the JS token hash ignores newlines, so record that and rely on the other checks; (8) pointers need the round where a ledger reuses a finding ID.
Changes, round 1: C1 corrects the wording of the 0226 cite (answers point 3). C2 makes §4 name mutations 4, 5 and 6 (point 5). C3 adds the `$(…)` false-alarm note to §8 (point 6). C4 adds the newline and automatic-semicolon limit to M3 and §8, so the JS proof becomes all four checks together (point 7). C5 adds the round-naming rule and the unique-ID check to M2 (point 8).
Round 2: architect — APPROVE — C1–C5 each settle the round-1 point of the same number. C3 and C4 were re-measured and hold. The architect noted its grep would miss a second `$(` opened on the same line; it called this unlikely, and the check fails safe anyway.
Disagreement: none
Codex: mode [codex] primary, completed, exit 0, 2 findings; plus a separate [claude-supplement — NOT model-diverse] section with 8 items (C1–C8). There is no fallback banner. The reviewer's coverage line, verbatim: "Read/reasoned against briefs, code, ADRs, reports, and prove-red; no tests executed bearing on findings. Probe only: `/bin/bash` normalization made a comment-only edit equal; Node v24.13.0 loaded internal Acorn successfully."
 Findings verbatim:
 - X1: ai-agents/tasks/backlog/0403-guard-architecture-mds-skill-count-against-the-skills-on-disk/brief.md · high · regression — "Plan §5 deliberately leaves open briefs despite line shifts, but this live brief cites `skills-for-role.sh:12`, `:17`, `:22`, and `:26` by coordinate and quotes the affected comments. The planned header compression makes those coordinates stale; `0224` has the same issue for marker-write lines. This violates V5's requirement to fix live inbound line references."
 - X2: claude/skills-for-role.sh:12 · high · correctness — "Plan §0/§3's Q1 treats the mirror checklist as an owner choice and leaves both blocks untouched. That contradicts `0226`'s settled ruling, under "✅ OWNER RULING — SETTLED 2026-08-05. Do not re-open", quoted: "(b) — NARROW TO SITE CLASSES"; its "What to build" requires repairing this header to declare site classes, while only the separate `0008` warning block must remain verbatim. Keeping the individual six-site checklist preserves the known stale form and reopens a closed owner decision."
 - [claude-supplement — NOT model-diverse] C1 (medium): the M3 JS hash of `type:value` cannot see regex edits — every regex hashes as `regexp:[object Object]`; the POINTER, NEAR_MISS and degraded-form regexes are at risk. C2 (medium): `norm()` fails open — a missing file or a syntax error prints nothing and exits 1, so two empty outputs compare EQUAL. C3 (low): test/skill-ownership-hook.test.js says "see the hook's own header comment" for "the payload has no depth field…"; this is missing from V5. C4 (low): the .mjs pointer drops report §6, which holds the driver-side hook design; F3 sits in §1. C5 (low): "Stop only, never SubagentStop … (Decision 7)" — Decision 7 lists only the skip conditions; the mechanism is in ADR-030 "Addendum — 2026-07-23", "Two design questions this settles". C6 (low): the hashMatches / containsExactBytes drafts do not say whether the Q4 prefix-match reason and the trimmed-final-newline gotcha survive. C7 (low): code-comments.md rule 3 bans "review finding R2" as a history comment, but M2 keeps "(0052 review R1)"-style pointers; Q2 does not name this conflict. C8 (nit): "≤2 lines" has no cap on line width.
Coder check: X1 — disputed as a defect, confirmed as a fact. 0403's and 0224's cited lines do shift. But the brief's rule 5 lists the live classes as skills, agents, conventions, tests and code, and open briefs are not among them. The plan deliberately leaves open briefs (M4d). The text 0403 quotes sits in the mirror block, which stays untouched, so the quotes survive. 0224 cites the marker hooks' `mkdir` code lines, which also survive. The owner decides: PC-1.
Coder check: X2 — disputed. 0226 is `🔲 Backlog`, and narrowing the checklist to site classes is 0226's own deliverable (its What to build step 2). By leaving the block for 0226, 0507 reopens nothing. The supplement's own note agrees. Confirmed in part: the plan's Q1 frames as an owner choice something 0226's settled ruling already decides, and Q1's option (b), "cut it now", would contradict 0226's step 3. The fix is PC-2.
Coder check: C1 — confirmed. Measured: acorn gives `regexp:[object Object]` for both `/abc/g` and `/xyz/i`. Fix: PC-3.
Coder check: C2 — confirmed. Measured: `norm /nonexistent/a` prints nothing and exits 1. Fix: PC-3.
Coder check: C3 — confirmed. test/skill-ownership-hook.test.js, in the comment above `test('reviewer owns fkit-stateful-review -> allow'`, reads: "the payload has no depth field at all … see the hook's own header comment". The drafted header does not say there is no depth field. Fix: PC-4.
Coder check: C4 — confirmed. Report heading "## 6. Q5 — Is any of this machine-checkable?" holds "### Driver-side: yes — a PreToolUse hook on the Task matcher"; F3 sits under "## 1. Findings that reshape the task". Fix: PC-4.
Coder check: C5 — confirmed. ADR-030 Decision item 7 reads "Skip conditions are part of the decision… spawned consults and other non-interactive runs, …". "Stop only, never SubagentStop" appears only under the Addendum's "### Two design questions this settles". Fix: PC-4.
Coder check: C6 — confirmed that the pasted plan does not name those two reasons. Both are kept in the fix: PC-4.
Coder check: C7 — confirmed that the tension exists. Rule 2 of the same convention allows "a one-line pointer"; rule 3 bans history narration. The method should say which side each comment falls on. Fix: PC-5.
Coder check: C8 — confirmed. Measured: of the current comment lines in the 7 files, all but 5 are 110 columns or narrower. Fix: PC-5.
Problems: none. Every spawn ran, and no pointer line was quoted in any prompt. The architect's round-2 re-ask went to the same architect by SendMessage, which kept its context, rather than to a fresh spawn.
===PLAN-REVIEW RECORD END===

Lead's lines:
- Plan presented to the owner: ≈2026-10-16T21:06Z (the driver's clock read 21:06:13Z immediately before presenting).
- Owner's decisions, quoted, AskUserQuestion in the fkit-lead session (fkit-sprint-ship-loop --plan-review run, Sprint 12); answers received before 2026-10-16T21:08:43Z:
  - Fixes: "All recommended (Recommended)"
  - Q2: "Point to it (Recommended)"
  - Q3: "Leave them (Recommended)"
  - Plan: "Approve (Recommended)"
- plan.md written 2026-10-16T21:08:43Z: the returned plan, then the lead's rulings section, then the returned post-Codex questions and open questions (29191 bytes, blob 5ee3cdd5252744a9a8113f606ccc6e47ca6995a9). Citation-policy test after the write: 22 pass / 0 fail.
- Copy note: in X1's location above, the lead dropped the trailing line number after the 0403 brief path (Codex's original cited it by line), because `test/coordination-citation-policy.test.js` forbids line-number cites of open briefs inside task folders. Nothing else in the record block was changed.
