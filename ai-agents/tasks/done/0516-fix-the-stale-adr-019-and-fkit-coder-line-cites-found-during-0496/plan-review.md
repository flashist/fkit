# Plan review — 0516

Append-only. One section per plan attempt (ADR-056). Never carried to Build or Process-review.

## Attempt 1 — 2026-10-15

Record block, copied from the plan-only coder's return:

===PLAN-REVIEW RECORD BEGIN===
Switch line: Plan review: on — set by the owner for this fkit-sprint-ship-loop run (--plan-review, 2026-10-15), run Sprint 12 started 2026-10-15T16:38:40Z
Times (UTC): plan drafted 16:44:25Z · architect ask r0 16:45:19Z, return r0 ≈16:46:30Z · ask r1 16:46:53Z, return r1 ≈16:47:16Z (hand-back copy 16:47:29Z) · ask r2 16:47:16Z (queued; resent ≈16:47:30Z), return r2 ≤16:47:38Z · Codex start 16:47:38Z / end ≤16:53:49Z · record returned 16:54:13Z
Classification: code-only — only cites change and ADRs get append-only notes; no fkit behaviour, rule or output changes (architect concurred every round)
Round 0: fkit-architect — APPROVE — classification right; the cite form matches durable-citation-anchors and ADR-037's citation note; targets verified on disk; ADR notes follow precedent and the counts (4→5, 2→3) are right; test impact correct. Non-blocking: (a) "clean tree" claim false (sprint-12.md and the 0516 brief are modified); (b) add a prose-unchanged check for Step 2's re-wrap; (c) record ADR-037's one-note-two-sites choice in the worklog
Changes, round 1: (1) summary bullet 2 reworded to name the producer's uncommitted edits — answers r0 (a); (2) prose-unchanged check added to Step 2 (and Step 3) and to Verify — answers r0 (b); (3) ADR-037 decision-log bullet added to Step 6 — answers r0 (c)
Round 1: fkit-architect — CHANGES REQUESTED — the prose-unchanged normaliser `sed 's/^[[:space:]>*-]*//'` strips a `**` the re-wrap moves to a line start, so it would report a false change (reproduced by architect and coder); use an indent-only strip for that check. Changes 1 and 3 accepted
Changes, round 2: Step 2's prose-unchanged check now uses `sed 's/^[[:space:]]*//' | tr '\n\t' '  ' | tr -s ' '` for Steps 2 and 3; the `>*-` strip is kept only for the quote-findability check — answers r1 item 1
Round 2: fkit-architect — APPROVE — the r2 edit is exactly the requested fix; rounds 0–1 stand; code-only; no unanticipated architecture decision; no open questions
Disagreement: none
Codex: [codex] mode — `codex exec --sandbox read-only` exited 0; no fallback banner. Findings verbatim:
  - **X1** — `ai-agents/knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md:243-245` — **medium** — **correctness** — Plan step 4 fixes only the header's `:97`. ADR-025's Related entry (*"[ADR-019](…) — **amended** by this ADR (§Decision 5, `:97`). Its `:143` re-raise pre-registered this decision"*) is a live pointer that still holds the stale ADR-019 cites `:97` and `:143`. So the plan's step 8 claim (*"No other `ADR-019`/`adr-019` + line-number cite"*) is false, and the plan gives these two cites no dated correction and no worklog verdict.
  - **X2** — `ai-agents/knowledge-base/reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md:328` — **low** — **correctness** — Plan steps 7–8 count only one `:138` cite in this report (§8.1). Its Related list holds a second `:138` cite. Leaving it as a frozen record is fine, but the brief asks for one verdict line per cite and a logged entry for every re-grep hit. The plan's count of 10 worklog verdict lines leaves this one out.
  Reviewer's coverage note: Codex did not run `npm test`; it raised nothing on the prove-red claims, the Markdown structure of the new notes, the normaliser, or the ADR-032/037 note counts — "no issue found", not proof those parts are clean.
Coder check: X1 — confirmed — ADR-025 lines 243–245 read "— **amended** by this ADR (§Decision 5, `:97`). Its `:143` re-raise pre-registered this decision." ADR-019:97 is inside Decision 3's amendment note, and :143 is inside Decision item 7, not the re-raise (that is at 194–195). My plan-time regex required "ADR-019 `:N`" or "…md) `:N`" and missed "…md) — **amended** by this ADR (§Decision 5, `:97`)". A wider post-Codex scan (any `:N` within 160 chars after an ADR-019 mention, multi-line) found no further hits beyond X1 and X2.
Coder check: X2 — confirmed — report line 328 (§Related): "…§Options (relayed-consent close-out rejected), `:138` (the pre-registered re-raise this task answers)". The report is a dated evidence record, so its verdict is "frozen record, left as is", but it needs its own verdict line.
Problems: none (the architect's r2 re-ask was sent twice because the first copy queued while the agent was finishing; both copies got the same APPROVE, counted once)
===PLAN-REVIEW RECORD END===

Lead's lines:
- Plan presented to the owner: ≈2026-10-15T16:57Z (the driver's clock read 16:56:43Z immediately before presenting).
- Owner's decision: approved. Selected option, quoted: "Approve with X1+X2 fixes (Recommended)" — option description he saw: "Plan plus Codex fixes: ADR-025 note also covers its 2 other stale refs; +1 worklog line for the report. 13 verdict lines." Date 2026-10-15; channel: AskUserQuestion in the fkit-lead session (fkit-sprint-ship-loop --plan-review run, Sprint 12).
- plan.md written 2026-10-15T17:02:52Z as the returned plan followed by the X1/X2 amendment section (18283 bytes, blob 01d839063e72c417c77229c043cc19ed11cd0e42).
