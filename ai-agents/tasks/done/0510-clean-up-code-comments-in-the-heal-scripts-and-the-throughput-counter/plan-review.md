# Plan review — 0510

Append-only. One section per plan attempt (ADR-056). Never carried to Build or Process-review.

## Attempt 1 — 2026-10-17

Record block, copied from the plan-only coder's return:

===PLAN-REVIEW RECORD BEGIN===
Switch line: Plan review: on — set by the owner for this fkit-sprint-ship-loop run (--plan-review, 2026-10-15), run Sprint 12 started 2026-10-15T16:38:40Z
Times (UTC): plan drafted 2026-10-17T19:08:06Z · architect ask, round 0 2026-10-17T19:08:30Z (approx.; spawn returned 19:09:34Z) · architect reply, round 0 ~2026-10-17T19:15:00Z (logged on receipt 19:15:24Z) · re-ask, round 1 2026-10-17T19:16:37Z · architect reply, round 1 ~2026-10-17T19:17:00Z · Codex start ~2026-10-17T19:17:30Z (its prompt file is stamped 19:18:21Z) / end ~2026-10-17T19:22:45Z (logged on receipt 19:22:51Z) · record returned 2026-10-17T19:23Z
Classification: code-only — every change is to code comments in three shipped skill executables; no code, string, output or behaviour changes, so what fkit delivers is unchanged. The architect confirmed it in both rounds.
Round 1: architect — CHANGES REQUESTED — (1) dropping the usage text removes ADR-017's "run with bash, never ./" rule from both heal headers, which ADR-017 Consequences require in the script's own header; (2) H3's "Output and exit codes: SKILL.md" is only half true, because SKILL.md gives no propose exit codes; (3) H4's "fences both" overclaims: consent-never-stored is not fenced, and the fences are word-match only (0246 review R8); (4) M4k: the search misses loop-based readers; it must cover must-contain and exact-count fences too; and it must say where it lives (0507's worklog is frozen). Small points: C1's bare "0245" is a history tag; strip the trailing spaces left on the V1-exception lines; mixed comment styles on exports.
Changes, round 1: C0/H0 "Run as bash <path>, never ./ … (ADR-017 rule 2)" added, by rule name, not a line cite — answers (1). H2 now carries propose's exit codes and H3's pointer is narrowed to apply — answers (2). H4 line 2 now says "the repair test pins both by word match only" — answers (3). M4k rewritten with a name-grep search, three fence kinds, and a home in 0510's worklog plus a routed note to the producer; re-run for this unit, only structure-repair's two fences found, and the exact-count fence sits on code — answers (4). C1 → "(ADR-039; 0245 plan §2)"; trailing spaces removed; every exported function's comment uses `//` (classify and foldTransitions comments reworded) — answers the small points. Q-A added to §9.
Round 2: architect — APPROVE — all four points and the small points resolved; build note: C0/H0 need a real blank line before C1/H1 (already in §3 and §8); Q-A is a genuine owner architecture decision, not blocking.
Disagreement: none
Codex: mode `[codex]`, no fallback banner. Findings verbatim:
  - **X1** · Plan §3, throughput.mjs header T1–T4 and the `isoWeek` comment; rests on `/Users/mark.dolbyrev/Workspace/fkit/claude/skills/fkit-status/throughput.mjs:34` · **low** · regression · The plan drops the only place that states the minimum Node version, `node >= 18` (line 34 `// PORTABILITY: node >= 18, no dependency, …`). T1 keeps only "node", and the planned `isoWeek` comment covers `strftime`, not which Node versions work. Nothing durable and no planned compatibility check replaces it. That breaks the brief's "Rules for every unit of this series": "Never delete the only record of a reason."
  Coverage note from the adversarial reviewer: Codex ran `node --check` on throughput.mjs (pass). It also ran `node --test test/structure-repair.test.js`: the 3 source-fence tests passed, but the 17 fixture tests could not run because the read-only sandbox refused `mkdtemp` (EPERM). Its output does not show which pointer targets it opened; "No other findings" is its result, not a check by item.
Coder check: X1 — confirmed — `grep -rnE "node *>= *18|engines"` over package.json, README.md, CONTRIBUTING.md, fkit-status SKILL.md, 0359's folder, architecture.md and ADR-014 finds no statement of a node minimum (only ADR-014's mention that a brief would add `"engines"`). So line 34 is the only record, and the plan deletes it. The fix is PC-1 below.
Problems: none. Every spawn ran. The architect's round-1 reply arrived as a message before its completion notification. Times marked "~" were logged when the message arrived, not when it was sent.
===PLAN-REVIEW RECORD END===

Lead's lines:
- Plan presented to the owner: ≈2026-10-17T19:26Z (the driver's clock read 19:25:32Z immediately before presenting).
- Owner's decisions, quoted, AskUserQuestion in the fkit-lead session (fkit-sprint-ship-loop --plan-review run, Sprint 12); answers received before 2026-10-18T08:22:16Z:
  - PC-1: "Keep it (Recommended)"
  - Q-A: "File a backlog brief (Recommended)"
  - M4k note: "Yes, add a note (Recommended)"
  - Plan: "Approve (Recommended)"
- plan.md written 2026-10-18T08:22:16Z: the returned plan, then the lead's rulings section, then the returned post-Codex question and open questions (23889 bytes, blob f3710201df08e422f565fdff92dce71766b854c8). Citation-policy test after the write: 22 pass / 0 fail.
