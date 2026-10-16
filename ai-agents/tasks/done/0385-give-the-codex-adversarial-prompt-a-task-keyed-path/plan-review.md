# Plan review — 0385

Append-only. One section per plan attempt (ADR-056). Never carried to Build or Process-review.

## Attempt 1 — 2026-10-15

Record block, copied from the plan-only coder's return:

===PLAN-REVIEW RECORD BEGIN===
Switch line: Plan review: on — set by the owner for this fkit-sprint-ship-loop run (--plan-review, 2026-10-15), run Sprint 12 started 2026-10-15T16:38:40Z
Times (UTC): planning start 17:43:23 · plan drafted 17:48:41 · round 0 (void) architect ask ~17:49, return received by 17:50:17 · round 1 asks (architect, producer) ~17:49–17:50 · architect R1 return 17:51:18 · producer R1 return by 17:51:28 · round 2 asks 17:52:50 · producer R2 return 17:53:09 · architect R2 return by 17:53:14 · Codex spawn 17:54:13, codex exec ran 17:5x–18:01 (as the reviewer reported), reply received by 18:02:22 · record returned 18:02:45
Classification: product change — it changes the shipped review procedures (fkit-review, fkit-adversarial-review, fkit-stateful-review): which file the reviewer agents write, and whether two concurrent reviews are safe. Both approvers agreed.
Round 0 (VOID): architect — CHANGES REQUESTED — it was sent a placeholder, not the plan (my error). It still raised substantive points: always add a per-run token, carry the path as literal text, a single source, the owner-unruled items, and two extra stale mentions. All were folded into rounds 1–2.
Round 1: architect — APPROVE — non-blocking: (2) stateful `<key>` must come from the key already resolved in the run, never re-resolved from $ARGUMENTS; (3) never call the ephemeral label "the ledger key"; shapes A and B cannot collide; (4) the stateful override must name both the assemble step and the run line; add a guard that the run-id command is identical in both copies; the adversarial reviewer has no Write tool, so it writes via a heredoc; (5) add the stale mentions in reports/2026-07-14…:140 and wiki-vault/log.md:331 as historical.
Round 1: producer — APPROVE — non-blocking: (2) CHANGELOG and guard test are stated additions, not an owner question; (3) word shape B in the ledger rule's order; (4) byte-identical command guard; (5) make OQ1 relay-ready, state both differences from the brief, correct the mktemp reason; (6) OQ2 must note it changes the current round-1 habit.
Changes, round 1: 1 stateful-key wording (architect 2) · 2 override names both places (architect 4) · 3 label never called the ledger key, ledger-rule order with `review` for stop-and-ask (architect 3, producer 3) · 4 test asserts the command is byte-identical in both copies (architect 4, producer 4) · 5 heredoc edge case (architect 4) · 6 two historical mentions added (architect 5) · 7 old OQ3 dropped, CHANGELOG and test are stated additions (producer 2) · 8 OQ1 reworded, mktemp reason corrected, OQ2 habit note (producer 5, 6) · 9 A-vs-B non-collision added to edge cases (architect 3). Why: all were requested as non-blocking; folded in so the text both approved is the text returned.
Round 2: architect — APPROVE — all round-1 notes folded correctly; independently re-grepped the 7 sites; no conflict with ADR-016 or ADR-042; OQ1 and OQ2 are owner rulings that must come before Step 1.
Round 2: producer — APPROVE — scope matches the brief items 1–5 and Not-in-scope; no creep; condition: relay OQ1 and OQ2 before Step 1, and re-plan Steps 1–3 plus the test's shape assertions if the owner picks (b) or "optional".
Disagreement: none.
Codex: no fallback banner — the pass ran on Codex (exit 0). Reviewer's note: it used the skill's shared path `.fkit/tmp/adversarial-prompt.md`, with first line "# task 0385 PLAN review — … (NOT task 0516 …)". `ps` at 17:54Z and just before the run showed no other `codex exec`. Codex coverage, verbatim: "executed read-only `sed`, `nl`, `rg`, and `git status`; no test suite executed."
  [codex] X1 · claude/skills/fkit-stateful-review/SKILL.md:104 · high · concurrency · Two stateful reviewers starting together read the same ledger and both compute the same round `N`; planned shape A then gives both `.fkit/tmp/<key>-r<N>-adversarial-prompt.md`. They still overwrite/read one another's prompt—the exact silent wrong-diff failure—despite the plan calling this "per-run."
  [codex] X2 · claude/skills/fkit-stateful-review/SKILL.md:36 · medium · correctness · The ledger rule's task identity is the full task-folder name, but the plan truncates rules 1–2 to `<NNNN>`. This contradicts brief §What to build: "use that same resolved key," so prompt identity and ledger identity no longer match as required.
  [codex] X3 · test/plan-review-switch.test.js:30 · high · missing-test · The proposed guard only proves presence/absence of phrases. It passes if a run line is changed to a different fixed path such as `.fkit/tmp/fixed-adversarial-prompt.md`: the banned bare literal is absent and explanatory shape text remains. No planned assertion binds each actual assemble/run path to the generated per-run value.
  [claude — supplemental, NOT model-diverse] C1 · plan §naming rule B / shape A; fkit-stateful-review/SKILL.md:39 · medium · security · slug only maps `/`→`-`; git accepts `feat$(id)` and `a;b&c|d>e`; such a key runs `$(…)` inside the `echo` and splits the unquoted `- < .fkit/tmp/<key>-…` run line / heredoc redirect — an untrusted PR branch can execute code in the reviewer's shell. Direction: restrict slug to safe characters, quote the path.
  [claude — supplemental, NOT model-diverse] C2 · plan §Edge cases "Write tool targets a new file"; fkit-stateful-review/SKILL.md:104 with :142 · medium · edge · Round only advances when rows are appended; a clean/closeout round adds none, so the next pass reuses `<key>-r<N>`; keyed files already exist on disk; a fresh reviewer's Write refuses to overwrite an unread file, and if skipped `codex exec < <same path>` feeds a stale prompt.
  [claude — supplemental, NOT model-diverse] C3 · plan §naming rule B "two live shells never share a process number" · low · edge · the echo shell exits at once, so the real reliance is no PID reuse within the same second; not guaranteed under a separate PID namespace; mktemp is atomic.
Coder check: X1 — confirmed — `fkit-stateful-review/SKILL.md:104` computes the round from the ledger, so two concurrent starts get the same N. The plan lists this as an accepted edge case ("not newly broken") but still calls the name per-run. → PQ1.
Coder check: X2 — disputed — `<NNNN>` maps one-to-one to the resolved folder because task IDs are unique (`test/task-id-uniqueness.test.js` enforces it). The brief's own recommended example is `0337-r2-…` (ID only), and so are the 28 on-disk keyed files. The architect approved this explicitly (round 1, point 2). The prompt and the ledger cannot disagree about which task.
Coder check: X3 — confirmed — the planned assertions check phrases only. A different fixed name would pass. → PQ3.
Coder check: C1 — confirmed — ran `git check-ref-format --branch 'feat$(id)'` and `'a;b&c|d>e'`: both accepted. The plan's command interpolates the key inside `"$(…)"`-bearing echo text and an unquoted redirect. → PQ2.
Coder check: C2 — confirmed — `fkit-stateful-review/SKILL.md:142` appends rows only for **novel** findings, and :104 derives the Round from existing rows, so a clean round repeats N. → PQ1, which fixes it.
Coder check: C3 — confirmed as reasoning, low — no PID reuse within a second on an ordinary macOS/Linux host (PIDs increment). A PID-namespace case is not measured. → PQ4 (Rec: no change).
Problems: (1) round-0 architect consult was malformed — my error: it carried a placeholder instead of the plan; reply CHANGES REQUESTED (no plan seen); TaskStop could not cancel it; treated as void and a proper round 1 run. (2) The plan pass used the skill's shared `.fkit/tmp/adversarial-prompt.md` (the very defect under repair) because the skill prescribes it and no owner ruling authorized a deviation; no collision observed (no concurrent codex exec at 17:54Z or before the run; prompt header names 0385). (3) Evidence of another Codex pass this session: 0516's review wrote the shared file at 17:38:14Z, before this planning began (17:43Z); no `codex exec` process ran concurrently with this plan's pass.
===PLAN-REVIEW RECORD END===

Lead's lines:
- Plan presented to the owner: ≈2026-10-15T18:05Z (estimate — the driver did not read the clock at presentation; the record was returned 18:02:45Z and the owner's answers arrived before 18:12:53Z).
- Owner's decisions, quoted, 2026-10-15, AskUserQuestion in the fkit-lead session (fkit-sprint-ship-loop --plan-review run, Sprint 12):
  - Naming (OQ1): "Label + time/process stamp (Recommended)"
  - Round tag (OQ2): "Always, -r1 included (Recommended)"
  - Fixes: "PQ1–3 yes, PQ4 no change (Recommended)"
  - Plan: "Approve (Recommended)"
- plan.md written 2026-10-15T18:12:53Z: the returned plan, then the lead's rulings section, then the returned post-Codex questions (15783 bytes, blob 18baf57971fb2e3df152f329b3ee4795889f2b64).

## Post-approval edit to plan.md — 2026-10-15

- What: one citation in plan.md's "Flagged in the hand-off, not edited" list — the wiki log (`ai-agents/wiki-vault/log.md`) — lost its trailing line number (`:331`). No other byte changed.
- Why: `test/coordination-citation-policy.test.js` ("L2 live corpus: RESIDUAL is 0 under the settled condition") failed on that line-number cite of an append-only file in an open task folder; the Build worker found the suite red before its first edit for this reason and could not edit plan.md.
- Owner ruling, quoted: "Fix the citation (Recommended)" — option description he saw: "I change log.md:331 to log.md in plan.md only, log the edit and new hash in plan-review.md, then run Verify and Review." Date 2026-10-15; channel: AskUserQuestion in the fkit-lead session.
- Edited by the lead at 2026-10-15T18:46:26Z. Blob before 18baf57971fb2e3df152f329b3ee4795889f2b64 (15783 bytes) → after 22f2c35060e3e6b0b2c6b8d17123a24c5f4ed572 (15779 bytes). The citation test re-run after the edit: 22 pass / 0 fail.
