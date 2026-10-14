# Plan review — 0504

Append-only. One section per attempt. Record blocks copied from the plan-only coders' return messages
(trust, not proof — ADR-056). Never carried to Build or Process-review.

## Attempt 1 — 2026-10-10

Run: `fkit-sprint-ship-loop --plan-review`, Sprint 10, started 2026-10-10T16:23:38Z. Counted by the owner
as a `0474` plan-review trial run (owner, `AskUserQuestion`, `fkit lead` session, 2026-10-10:
"Yes, log it as a trial run (Recommended)").

### Record 1 — plan-only coder (approvers; Codex pass not returned)

===PLAN-REVIEW RECORD BEGIN===
Switch line: Plan review: on — set by the owner for this fkit-sprint-ship-loop run (--plan-review, 2026-10-10), run Sprint 10 started 2026-10-10T16:23:38Z
Times (UTC): planning started 16:25:37 · plan drafted 16:30:36 · round-1 ask (producer + architect, parallel) 16:30:36 · producer R1 return ≤16:32:53 · architect R1 return ≤16:33:48 · round-1 revision done / round-2 ask 16:35:19 · producer R2 return ≤16:36:32 · architect R2 return ≤16:37:25 · round-2 revision done / round-3 ask 16:37:30 · producer R3 return ≤16:38:10 · architect R3 return ≤16:38:18 · Codex start 16:38:23 / end NOT RETURNED by 16:41:01 · record returned 16:41:01. (Return times are "≤": stamped when I noticed the reply, not at delivery.) Elapsed: drafted→approvers settled ≈ 7m42s; total ≈ 15m24s.
Classification: product change — changes how every fkit agent asks questions of every fkit user (shipped rules block, role prompts, Stop-hook message, new scaffold convention) → producer + architect.
Round 1 (first ask): producer — APPROVE — all brief items covered; budget handled as the brief allows; items 1 and 6 reconciled via Q1; no scope creep; conflicts caught. Non-blocking: (a) widen the survey terms and check fkit-task-brief step 9's option count; (b) restate the live-check expectation, plus the personal-copy confound; (c) Q2 should name the plain-non-fkit-session trade-off.
Round 1 (first ask): architect — CHANGES REQUESTED — (1) the Stop hook's check A fires in later turns (no marker) and REASON_A pushes a new dialog, which is the bug itself; edit the hook or document the gap; (2) no rule that a non-answer is never consent (declared-approval marker path, coder field (c), ship-loop approval); (3) the 3-option cap never reaches workers; needs spawn-prompt carriage, coder/producer/lead-envelope copies and a merge fallback; (4) inconsistent re-ask wording; explain-first has the same hiding risk. Added owner questions Q4 (hook) and the Q1 addendum (live-check overlap → Q5).
Changes, round 1: D7 hook REASON_A exception + hook test + Q4 — answers architect R1-1 · D8 non-answer-is-never-consent across lead/coder/ship-loop/heal/open-questions + test pin — architect R1-2 · D3 cap carried in spawn prompts, coder/producer, lead:72, merge fallback — architect R1-3 · D2 single re-ask sentence everywhere + D2b explain-first visibility rule — architect R1-4 · survey widened, task-brief step 9 checked (3 options) — producer (a) · live-check expectation restated + Q5 confound — producer (b) + architect Q1 addendum · Q2 plain-session trade-off + init-propagation note — producer (c) + architect non-blocking.
Round 2: producer — APPROVE — R0 points met; every brief item and verification mapped; D7/D8 not scope creep (D7 = item-4 reconciliation; What's next? line already excluded by check A). Non-blocking: R2-5 close posture while the live check is pending; R2-6 the worklog should say D7 is not the out-of-scope result hook.
Round 2: architect — APPROVE — R1-1..R1-4 resolved with file:line evidence; anchors exist; parity enforced with no exception entry. Non-blocking: R2-7 widen REASON_A to cover D2b's explain-then-ask-next-turn path; R2-8 name the relabelling residual in Where enforced.
Changes, round 2: REASON_A widened to "answering the owner's question or explaining ahead of one" + D2b/paragraph "end the turn with no line ending in ?" — architect R2-7 · accepted residual named in the convention — architect R2-8 · close posture (verifications 5 and 7 owner-run, pending; no close until run or waived) — producer R2-5 · worklog note that D7 is the item-4 reconciliation — producer R2-6.
Round 3 (re-ask after round-2 revision; no round 3 of revisions): producer — APPROVE — only the five listed changes, everything else byte-identical; cosmetic wrap after "Keep". architect — APPROVE — R2-7/R2-8 resolved; REASON_A static and JSON-safe, today's string is its prefix; same cosmetic wrap note.
Disagreement: none.
Codex: NOT RETURNED. @fkit-adversarial-reviewer was spawned at 16:38:23Z with the plan pasted inline. At 16:41:01Z it had stopped with its own background work still running and had not delivered findings when this run was forced to hand back. No mode line, no banner, no findings to relay.
Coder check: none — no Codex findings received.
Problems: (1) Codex plan pass incomplete — spawned, not returned by handback (see top flag). (2) Procedure deviation: the round-2 and round-3 approver re-asks passed the full revised plan by scratch-file path (plan-r1.md / plan-r2.md in the session scratchpad) plus an inline change list (round 3 also an inline diff), not pasted inline; the round-1 ask and the Codex ask were pasted inline. (3) The Codex paste dropped the reviewer-attribution parentheticals and shortened Q1–Q5 to one line each; the design, steps and checks were verbatim. (4) Cosmetic wrap in the role-prompt paragraph left unreflowed in the approved text (build reflows it; no meaning change).
===PLAN-REVIEW RECORD END===

### Record 2 — plan-only continuation coder (Codex pass, re-run)

===PLAN-REVIEW RECORD BEGIN===
Scope: the Codex half only (a continuation). No approver rounds were run here; the approver record is the earlier coder's (producer and architect both APPROVE after 2 rounds, no disagreement).
Switch line: Plan review: on — set by the owner for this fkit-sprint-ship-loop run (--plan-review, 2026-10-10), run Sprint 10 started 2026-10-10T16:23:38Z
Plan reviewed: plan-r2.md, 17669 B, blob 613c2108fa621e130eede04f6662c451090ab62c, pasted inline and unabridged (Q1–Q5 in full). The reviewer confirmed its Codex prompt carried the whole plan.
Times (UTC): continuation start 16:43:11 · old codex-out.txt checked and found incomplete 16:43 · Codex spawn 16:43:37 · Codex returned ~16:47:30 (recorded 16:47:35) · record returned 16:48:08
Prior attempt: codex-out.txt (spawned 16:38:23Z by the previous coder; file last written 16:42:58Z) — incomplete. It ends mid-exec with no findings and no coverage line. Not used.

Codex: Mode: [codex] (codex-cli 0.157.1, `codex exec --sandbox read-only`; prompt `/Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/0504-r2-adversarial-prompt.md` carried the whole plan unshortened. The plan file was confirmed as 17669 B, blob 613c2108…, and contains Q1–Q5 in full.)
(no fallback banner)
Findings (verbatim):
- X1 — `claude/scaffold/universal-rules.md:40` (Plan D2b/D7). **medium** — correctness. "End with no line ending in `?`" conflicts with the mandatory separate `What's next?` heading; following it literally omits the footer and triggers hook check B. The hook already exempts the `What's next?` line from check A (`claude/turn-completion-hook.sh:128`), so the planned wording is unnecessarily contradictory.
- X2 — `claude/turn-completion-hook.sh:119` (Plan D7, Step 8). **medium** — missing-test. D7 calls this a carve-out, but only rewrites static `REASON_A`; check A still blocks every unmarked message with a non-exempt `?` line and cannot identify an answer/explanation. The planned test merely asserts the new reason text, so it passes even though no behavioral carve-out exists.
- X3 — `claude/skills/fkit-sprint-ship-loop/SKILL.md:327` (Plan D3). **medium** — correctness. The worker re-consult fallback permits `SendMessage`, but the governing record *"Ruling — what the sprint driver does when a spawned worker dies"* says "no skill or knowledge-base page sanctions, defines, or bounds `SendMessage` as a worker-resume mechanism." This introduces an undefined recovery path into the relay rule.
- X4 — `claude/structure-spec.md:171` (Plan Step 3). **low** — regression. Adding the convention row makes the shipped set 12 files (README + 11 conventions), but the plan schedules only an inventory row; the prose will still claim "eleven" and "ten conventions." `test/structure-spec.test.js` validates table membership, not that narrative count.
- X5 — `claude/skills/fkit-sprint-ship-loop/SKILL.md:347` (Plan Steps 6, 10; brief **What to build**: "it is the **last** option" and "so this option always fits"). **medium** — missing-test. The new test checks label/description presence and selected D8 text only; it does not cover last-position, exactly-once, recommended-first preservation, the ≤3 worker-option relay limit, merge fallback, or re-ask behavior. Those can regress while every planned automated check stays green; the only proposed coverage is owner-run and pending.
Codex coverage (verbatim): "Coverage: mode [codex]; executed `node --test test/rules-block-budget.test.js test/turn-completion-hook.test.js` — budget suite 3/3 passed, hook suite could not create its temp fixture (`EPERM`); read the brief and named rule, hook, skill, structure, parity, manifest, and test surfaces; did not run full `npm test` or owner live verification."
Reviewer's own note: it ran only the codex probe and a plan size/hash check, verified no finding itself, and did no dedupe.

Coder check:
- X1 — confirmed (wording only). The hook skips any line containing "What's next?" before the `?` test (`turn-completion-hook.sh`, awk `index(l, "What'\''s next?")`), so there is no false block. But the plan's text ("end the turn with no line ending in "?"", in the paragraph, D2b and the D7 REASON_A) contradicts, read literally, the required "What's next?" heading (`universal-rules.md` "Close with "What's next?"" bullet).
- X2 — partly. The behaviour claim is true: D7 changes only the static REASON_A string, and check A's logic is untouched. The plan already says so on purpose: "a static-string change, still presence-only (ADR-030)" (Q4), and "accepted residual … check A is a heuristic by design" (D7). Disputed as a missing test: a text-only change is fully pinned by a text assertion. Real nit: the name "carve-out" overstates what it does.
- X3 — confirmed. `ai-agents/knowledge-base/reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md:1` is titled "Ruling — …", and its line 443 says no page sanctions `SendMessage` as worker-resume. `grep -rn SendMessage` over `claude/`, `decisions/` and `conventions/` finds no hits. Softened: D3 already gives a sanctioned alternative (a read-only consult of the same role), so only the `SendMessage` branch is new and undefined.
- X4 — confirmed. `claude/structure-spec.md:172-173` says "requires the eleven files … plus ten conventions". Plan step 3 adds only the Table B row, and step 2 fixes only the two README counts.
- X5 — partly. True that the planned test pins only presence (label, description, D8 sentence). Position, once-only, re-ask timing and recommended-first are model behaviour, so a static test cannot prove them, and the plan routes those to the owner-run live check (verification 5 and 7, close held until it is run). It would be cheap to also pin the text of the ≤3-option cap and the merge fallback in lead, coder, producer and sprint-ship-loop; the plan does not.

Suggested if the owner adopts (NOT applied; plan unchanged per fkit-plan-task §5):
- for X1: in the paragraph, D2b, D7 REASON_A and the convention, say "no question line other than the What's next? heading" (or "no question to the owner left in prose") instead of "no line ending in "?"".
- for X2: rename D7 from "carve-out" to "REASON_A guidance reword"; no logic change.
- for X3: drop "resume via SendMessage" from D3, keeping only the read-only consult of the same role (or cite and define `SendMessage` first).
- for X4: add to step 3 "update `structure-spec.md:172-173` prose: twelve files, eleven conventions".
- for X5: extend step 10 to pin the ≤3-option cap sentence and the merge-fallback sentence in lead, coder, producer and sprint-ship-loop.

Problems: (1) The previous Codex spawn did not return before the earlier coder handed back; its partial output (`codex-out.txt`) was incomplete and discarded, and this re-run replaces it. (2) Codex's hook test suite failed to run (`EPERM` in its sandbox); this does not mean the tests failed. (3) The spawn instruction to revise the plan after Codex conflicts with skill rule §5; the rule was followed and the conflict is flagged above.
===PLAN-REVIEW RECORD END===

### Late return — the first Codex pass (adversarial reviewer spawned 16:38:23Z by Record 1's coder)

Delivered to the lead after Record 1's hand-back, mode `[codex]` (`codex exec --sandbox read-only`, exit 0). Its scope was the
shortened paste (see Record 1, Problems (3)). Findings, word for word as relayed:

- **X1** · `claude/structure-spec.md:171-174` · low · regression · Step 3 adds only an inventory row. The prose will still claim "eleven files" / "ten conventions" after shipping a twelfth file and eleventh convention; the structure tests do not validate that prose count.
- **X2** · `claude/scaffold/ai-agents/knowledge-base/conventions/placement-questions-state-the-knock-on.md:61-66` · medium · correctness · D3's four-option fallback merges two worker options while only requiring that it "name both." For two placement options with different knock-ons, that can discard the per-option consequence required in the dialog description, leaving the owner unable to evaluate the merged alternative.
- **X3** · `claude/skills/fkit-sprint-ship-loop/SKILL.md:347-353` · medium · missing-test · The proposed `asking-the-owner-rule` test checks labels, a pointer, and D8-presence text, but not the core relay rule at this call site: a typed follow-up or "Explain more" must produce chat explanation and no same-turn `AskUserQuestion`. A later wording regression can recreate the hidden-explanation dialog while all planned automated checks stay green.
- **X4** · `claude/skills/fkit-open-questions-interview/SKILL.md:60-63` · medium · missing-test · This skill currently treats every returned `AskUserQuestion` result as answered. The plan changes that for the standing option/non-choice, but Step 10 does not test this required carve-out; a missed or weakened edit silently marks the original question closed and prevents the promised re-ask.

Lead's mapping (not a coder check): late X1 ≈ Record 2 X4; late X3 ≈ Record 2 X5; late X2 and X4 are new → presented to the owner as **L1** and **L2**, flagged **no coder check**.

### Lead's lines

- Plan presented to the owner: **2026-10-10T16:56:51Z** (`fkit lead` session, `AskUserQuestion`).
- Owner design answers, asked earlier at 16:4x UTC while Codex re-ran (same session, `AskUserQuestion`, 2026-10-10): Q1 "On my next message (Recommended)" · Q2 "Pointer only, B (Recommended)" · Q3 "Yes, add it (Recommended)" · Q4 "Yes, reword it (Recommended)".
- **Owner decision:** "Approve + adopt all 7 edits (Recommended)"; Q5 "Accept, note it (Recommended)" — 2026-10-10, `AskUserQuestion`, `fkit lead` session.
- Approved `plan.md`: plan-final.md copied byte-for-byte + an appended *Owner rulings at approval* section.
- **0474 trial — "did plan review help?"** (asked after code review closed out, 2026-10-11, `AskUserQuestion`, `fkit lead` session). First reply, typed by the owner (not a choice): "To be honest, I don't know. Were there any things that could've been shown to me or was it a pure "internal" review process between agents?" — the lead answered in chat (visible effects: the 7 adopted Codex edits, Q4 and Q5 exist only because of approver round 1, the banners; internal: the approver rounds, summarised in one line; the owner never saw the pre-review plan) and re-asked on the owner's next message ("re-ask the question"). Owner's answer, typed by him: "Based on your explanation, I think it's worth it, but I would like to do a couple of other tasks with it too".
