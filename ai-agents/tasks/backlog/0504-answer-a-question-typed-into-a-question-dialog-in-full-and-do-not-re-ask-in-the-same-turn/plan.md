# Plan — 0504: answer a typed follow-up in chat, no re-ask that turn; ship "Explain more, then ask again"

## Goal
fkit's own asking rules, for every fkit user: (1) explain before asking, in chat; (2) the standing option "Explain more, then ask again" on every question, byte-exact; (3) a dialog reply that is not a choice gets a full chat answer and no new dialog that turn; (4) the same on the lead's relay path; (5) a reply that is not a choice is never an answer and never consent. Owner's personal ~/.claude files untouched (post-ship owner/lead step, per brief Ruling B).

## Measured facts (2026-10-10, this planner)
- Emitted rules block (real `emit_block`, as the test does): **3906 B / RULES_MAX 4352 → 446 B free (90%)**; `test/rules-block-budget.test.js` green. Floor (task 0130 ruling) ≥ 400 B free → 46 B spendable. Test warning threshold 92% (≤ 4025 B).
- Candidate block wordings measured on scratch copies with the real `emit_block`: pointer-only (wording **B**) = **3905 B (447 free, net −1 B)**; pointer + keep "batch; mark your recommendation" (**D**) = 3941 B (411 free); any wording carrying the behaviour summary in the block = 3958–3965 B (< 400 free). Full rule in the block ≈ +450–600 B → needs an owner-signed RULES_MAX bump.
- Stop hook `claude/turn-completion-hook.sh` check A (a line ending in `?`, no AskUserQuestion this turn → block with REASON_A "ask it with the AskUserQuestion tool"):
  - **Turn 1** (the owner's typed follow-up returns as the AskUserQuestion tool result, same turn as the call): the PreToolUse marker is present at Stop → check A suppressed. Safe.
  - **Later turns** (the owner's next message is another question, or a prose answer): no AskUserQuestion call → no marker → any explanation line ending in `?` fires check A, and REASON_A pushes a dialog right after the explanation — the bug this task fixes. Ship-loop sessions skip the hook (`:93-95`); plain `fkit <role>` sessions do not. **→ hook edit, D7.** (Architect round-1 finding; verified against `:61-76`, `:113-143`.)
- `prove-red.sh` mutations 3/4/6 on the hook anchor on `whats_next_missing=1`, `had_marker=1` and the ship-loop marker read — not on REASON_A text; `turn-completion-hook.test.js` asserts only `/AskUserQuestion/` in the A reason. A REASON_A reword breaks no anchor.
- Prior cancelled task 0414 (same option) named the constraints: no harness-level fixed option; 4-option cap; consults lack the tool so the relayer adds it; a worker returning 4 options leaves the relayer no slot.

## Design decisions
- **D1 — where the text lives (budget-neutral split).**
  - Block (`claude/scaffold/universal-rules.md`, `## Output style`): reword the existing *Ask interactively* bullet to wording **B** (net −1 B):
    ```
    - **Ask interactively.** In a session, ask the owner with `AskUserQuestion`, not prose, per
      `ai-agents/knowledge-base/conventions/asking-the-owner.md`. In a spawned consult the tool is absent —
      return open questions in your reply instead.
    ```
    "Batch related questions; mark your recommendation" move into the convention + role prompts (moved, not dropped). **Trade-off (named in Q2):** the block is the only rule text a plain non-fkit `claude` session in a consuming project sees; under B such a session sees only the pointer. Existing installs gain the convention file on next launch (init adds any scaffold file a project lacks, `fkit-claude-init.sh:35-38`); the edited scaffold conventions `README.md` does not reach existing installs (init never overwrites) — they miss only the new README row.
  - New convention `ai-agents/knowledge-base/conventions/asking-the-owner.md`, dual-homed **byte-identical** with `claude/scaffold/ai-agents/knowledge-base/conventions/asking-the-owner.md` — the canonical full rule.
  - The six Claude role prompts (`claude/agents/fkit-{lead,producer,coder,architect,reviewer,wiki}.md`) carry one identical short *Asking the owner* paragraph (text below) — always in context at ask time; a pointer alone is not read at ask time.
  - Why not the block: 46 B; AGENTS.md (codex) carries the block too and codex has no AskUserQuestion; `0506` spends the same budget next.
- **D2 — items 1 and 6 read together; one re-ask wording everywhere.** A typed follow-up and a picked "Explain more" are both *a reply that is not a choice*: answer in full in chat, open no new dialog that turn, end the turn (its "What's next?" says "say 'ask again' when ready"). **Re-ask wording, used verbatim in the paragraph, the convention and the ship-loop:** *"Put the same question back on the owner's next message — unless that message is the answer (take it) or another question (answer it the same way)."* Reason: a dialog opened right after an explanation hides it — the report's root cause. Pending Q1 (if the owner rules "same turn" for the standing option, that one sentence changes in all three places).
- **D2b — explain-first has the same hiding risk** (source report: a chat explanation "right before a new dialog is easily hidden by that dialog"). Rule: keep background before a question short enough to sit visibly above the dialog; if it needs more, explain, end the turn with no line ending in "?", and ask on the next turn.
- **D3 — relay path, and the 3-option cap reaches the workers.** A `NEEDS-DECISION` carries **at most 3 options** (the relayer adds the standing option as the 4th) and a plain-language `context` enough to explain without asking back. The cap travels the way the knock-on rule does — **said in each worker's spawn prompt beside the envelope** (`fkit-sprint-ship-loop` §3) — and in the worker-side sources that return `NEEDS-DECISION` (`fkit-coder.md`, `fkit-producer.md`) and the conductor's own envelope copy (`fkit-lead.md:72`). **Fallback when a worker returns 4 anyway:** the driver merges the two least-recommended options into one, naming both, and says so in chat — never silently drops an option. On a non-choice reply the driver answers in chat from the worker's context / brief / plan; if it cannot, it asks the worker (resume via SendMessage, or a read-only consult of the same role carrying its `NEEDS-DECISION` verbatim + the owner's question; no write marker; never a live plan pointer line), ends the turn, and re-puts the same decision per D2. Still no timer, no guess.
- **D4 — which of the owner's 4 personal bullets ship:** 1 (explain first = item 2), 2–3 (the option), 4 (a worker returns its question with enough plain context to relay — consistent with ADR-021).
- **D5 — coexistence:** "If your own instructions already add this exact option, add it once."
- **D6 — knock-on carve-out:** "explanations never go in dialog fields" excludes short required facts — a placement option's knock-on stays in its description (`placement-questions-state-the-knock-on.md` requires it).
- **D7 — Stop-hook REASON_A carve-out (new, architect R1-1).** Reword the static `REASON_A` in `claude/turn-completion-hook.sh` (stays static, JSON-safe, presence-only per ADR-030 Decision 2) to: *"You put a question to the owner in prose. In a session, ask it with the AskUserQuestion tool; in a spawned consult, return the open questions in your reply instead. If you were answering the owner's question or explaining ahead of one, open no dialog: end the turn with no line ending in a question mark."* (Widened in round 2 to cover D2b's explain-then-ask-next-turn path — architect R2-7.) Matching line in the convention (*Where enforced*: answering the owner's question or explaining ahead of one, end with no line ending in `?`), plus the **accepted residual**: the hook cannot tell a genuine answer/explanation turn from a prose question relabelled as one — check A is a heuristic by design (ADR-030) (architect R2-8). Hook test case pins the widened carve-out phrase. D7 is brief item 4's reconciliation of a contrary instruction — **not** the out-of-scope hook on the `AskUserQuestion` result; the worklog says so (producer R2-6). Owner can override → Q4.
- **D8 — a non-answer is never consent (new, architect R1-2).** A picked "Explain more, then ask again", or a typed question / request for more information, is not an answer and not approval:
  - `fkit-lead.md` declared-approval bullet: one added sentence beside (not replacing) the pinned "No real owner answer → spawn plan-only".
  - `fkit-coder.md` refusal list item 3 (field (c)): such a quote fails field (c) → `NEEDS-DECISION` naming it.
  - `fkit-sprint-ship-loop` plan-approval relay (§2 Plan row / §3 step 2): the same.
  - `fkit-heal` step 4: an "Explain more" pick or a typed question is not consent — one clause.
  - `fkit-open-questions-interview` step 1 callout: such a result is not an answer; the question stays open.
  - Pinned by the new test (below).

## Role-prompt paragraph (identical in all six; each byte-exact string kept on ONE line so a search finds it)
```
**Asking the owner.** In a session, every `AskUserQuestion` follows
[`conventions/asking-the-owner.md`](../../ai-agents/knowledge-base/conventions/asking-the-owner.md):
- **Explain first, in chat:** what the choice is, why it matters, what each option changes — short
  enough to stay visible above the dialog; if it needs more, explain, end the turn (no line ending in
  "?"), ask next turn. Keep
  the question and option descriptions short; batch related questions; recommended option first, marked.
- **Last option, every question, once:** label `Explain more, then ask again`,
  description `Give me more context in simple terms, then re-ask the question.`
  With 4 real options, merge or drop the weakest so it fits.
- **A reply that is not a choice** — typed text that asks something, or that last option — is not an
  answer and not consent: answer it in full, in chat (plain words, a concrete example, what each option
  means in practice); open no new question that turn; end it with no line ending in "?". Put the same
  question back on the owner's next message — unless that message is the answer (take it) or another
  question (answer it the same way). Never write "as explained above".
```

## Steps
1. New convention, both homes, byte-identical. Sections: summary blockquote; Why (the report's pattern, provenance "owner ruling 2026-10-10 (task 0504)" in the placement-convention style, no relative links into tasks/ so byte-identity is safe); Before you ask (D2b); The standing option (label/description byte-exact, last, once, 4-option rule, what to do when picked); A reply that is not a choice (typed question / request for info / the standing option; a batched call answered in part → take the answers, explain the rest, re-ask only those; a reply that both picks and asks → answer first, act on the pick only if the answer does not bear on it; owner answers in prose → take it, don't reopen a dialog; D2 re-ask wording; never "I've explained" / "as explained above"; D8 never consent); Spawned workers & relayers (D3, incl. the 3-option cap and the merge fallback); With other rules (D5, D6, Output-style precedence: owner's own instructions win); Where enforced (prose + the presence test + D7).
2. Conventions READMEs: live — add the row, "Four of them … byte-identical" → five; scaffold — add the row, "Ten conventions ship" → eleven.
3. `claude/structure-spec.md` inventory row; `npm run generate:manifest` → `claude/structure-manifest.tsv`.
4. `claude/scaffold/universal-rules.md` → wording B.
5. Role prompts: paragraph after the "In a session you may use `AskUserQuestion`…" line in wiki/producer/reviewer/architect/coder; in `fkit-lead.md` inside the *Hold the owner channel* bullet, plus the relay sentence (D3) and the 3-option cap on its envelope line (`:72`). Coder §Output format 3 "In a session" bullet: "per *Asking the owner* above". 3-option cap also where coder/producer describe returning `NEEDS-DECISION`. D8 sentences (lead marker bullet; coder refusal item 3). Leave the lead's pinned "No real owner answer → spawn plan-only" text untouched (`test/spawned-write-marker.test.js` pins it; additions only).
6. `claude/skills/fkit-sprint-ship-loop/SKILL.md` §3: beside the envelope, "say so in each worker's spawn prompt" for the ≤ 3-option cap + plain context (as the knock-on rule does); step 1 add the standing option last + the merge fallback; step 2 non-choice reply handling (D3, D8); Plan-row approval: a non-choice reply is not approval.
7. `claude/skills/fkit-open-questions-interview/SKILL.md` step 1 callout carve-out (D8); `claude/skills/fkit-heal/SKILL.md` step 4 one clause (D8).
8. `claude/turn-completion-hook.sh` REASON_A reword (D7, widened wording) + a case in `test/turn-completion-hook.test.js` asserting the widened carve-out phrase appears in the A reason (and still `/AskUserQuestion/`). Worklog notes D7 is the item-4 reconciliation, not the out-of-scope result hook.
9. Survey record in the task's `worklog.md`: every `AskUserQuestion` site under `claude/` (17 files), **plus** a search of `claude/agents/` and `claude/skills/` for `re-ask`, `ask again`, `option description`, `in the description`, `options[]`, `immediately` — each hit with a consistent/edited verdict. Already checked: `fkit-task-brief` step 9 offers 3 ways out (3 options + standing = 4, consistent; its "four per call" is questions, not options); `fkit-heal` 3 options + standing = 4 (edited only for D8); placement convention already anticipates the option; `fkit-task-ship-loop` has no AskUserQuestion site; `fkit-plan-task` "re-ask" is approver rounds, not the owner (consistent). Edited: the six agents, sprint-ship-loop, open-questions-interview, heal, turn-completion hook, universal-rules.
10. New `test/asking-the-owner-rule.test.js` (reads only `claude/`, so no `test:docs` change): (a) the label and description byte-exact in each of the six role prompts and in the scaffold convention; (b) `universal-rules.md` names the convention path and that file exists; (c) D8 sentence present in lead, coder and sprint-ship-loop; (d) a control: a one-char-mutated description is caught (checker not vacuous) — the in-test control style of `spawned-write-marker.test.js`.
11. Re-run `claude/fkit-claude-init.sh .`; diff the root `CLAUDE.md`/`AGENTS.md` blocks against `emit_block` output.
12. `CHANGELOG.md` `## Unreleased` line.

## Checks
- `npm test` (full: scaffold edits, a hook script, `fkit-sprint-ship-loop/SKILL.md` named in `prove-red.sh`, new/edited test files) per CONTRIBUTING's table. Expected budget 3905 B / 447 B free.
- grep both byte-exact strings → the six prompts + both convention copies.
- **Live check (verification 5 + 7) is owner-run** in a fresh `fkit lead` session after the build — a spawned worker cannot run it; recorded in the worklog when done; unverified until then. **Expected result, restated to D2:** typed follow-up → full chat explanation, no dialog that turn, no "I've explained"; picking "Explain more" → plain explanation, no dialog that turn; "ok, ask again" → the same question returns (same options + the standing option, shown **once**). **Close posture (producer R2-5):** the Build/review hand-off lists verifications 5 and 7 as *owner-run, pending*; the task is not routed to close until the owner has run them or has explicitly ruled to close without them. **Known confound (named in the worklog):** while the owner's personal copy is in place it says "then ask the same question again" and his own instructions outrank fkit's Output-style preferences — a same-turn re-ask during the check may come from his rule, not a failure of fkit's → Q5.

## Risks / edge cases
Byte-exact strings broken by line wrap (one line each; test catches); dual-home drift (parity test); stale manifest (structure-manifest test); relative links (precedent `../../ai-agents/…` from `claude/agents/`); REASON_A must stay static and JSON-safe (no `"` or `\`); rules take effect in new sessions only (this run's lead session keeps old rules; init refreshes `.claude/` copies that later spawns read); `0506` shares the budget (this plan leaves 447 B, +1); a new convention needs owner sign-off per conventions/README's bar — plan approval counts only if the owner says so (Q3). No ADR needed (architect R1, non-blocking).

## Open questions (for the owner at plan approval)
- **Q1 — when to re-ask after "Explain more".** (Rec) On the owner's next message — the explanation stays visible until he replies. / In the same turn — the literal personal wording; the new dialog may cover the explanation.
- **Q2 — rules-block wording.** 46 B of room above the 400 B floor. (Rec) **B**, pointer only, −1 B: "batch; mark your recommendation" moves to role prompts + convention; a plain non-fkit `claude` session then sees only the pointer. / **D**: keeps that line, +35 B, leaves `0506` 11 B above the floor. / Owner-signed RULES_MAX bump, full rule in the block.
- **Q3 — new convention page** `asking-the-owner.md` (byte-identical in the live knowledge-base and the shipped scaffold). The conventions README requires the owner's sign-off for a new convention; plan approval counts only if he says so.
- **Q4 — the Stop hook.** (Rec) Reword REASON_A (D7) so answering the owner's own question never pushes a new dialog — a static-string change, still presence-only (ADR-030). / Leave the hook; write the gap + workaround into the convention.
- **Q5 — live-check overlap with the personal rule.** (Rec) Accept the overlap, note it in the worklog. / Owner removes his personal copy before the live check. / Re-word Ruling B's removal as "before the live check" instead of "after ship".

---

## Owner rulings at approval (appended by fkit-lead, 2026-10-10)

The plan text above is `plan-final.md` copied byte-for-byte (17669 B, blob 613c2108fa621e130eede04f6662c451090ab62c — identical to the approver-approved `plan-r2.md`). Everything below is appended; nothing above was edited.

All answers: owner, via `AskUserQuestion`, in the `fkit lead` session, 2026-10-10. Selected option text quoted.

- **Q1 — when to re-ask:** "On my next message (Recommended)" → D2 stands as written.
- **Q2 — rules-block wording:** "Pointer only, B (Recommended)" → D1 wording B stands.
- **Q3 — new convention page:** "Yes, add it (Recommended)" → this is the owner's explicit sign-off on `asking-the-owner.md`.
- **Q4 — Stop hook:** "Yes, reword it (Recommended)" → D7 stands (as amended by X1/X2 below).
- **Q5 — live-check overlap:** "Accept, note it (Recommended)" → keep the personal rule during the check; the worklog notes the confound.
- **Plan approval:** "Approve + adopt all 7 edits (Recommended)" — option description as shown: "Plan as shown, plus the X1–X5 and L1–L2 edits appended as owner rulings. The build coder checks L1 and L2 before applying them."

### Adopted edits (from the Codex plan pass; wording as presented to the owner)
- **X1:** Say "no question line other than the What's next? heading" instead — in the paragraph, D2b, D7 REASON_A and the convention, replacing "no line ending in "?"".
- **X2:** Rename it "REASON_A guidance reword" — D7 is renamed from "carve-out"; no logic change.
- **X3:** Drop the `SendMessage` route; keep the read-only consult of the same role — in D3.
- **X4:** Step 3 also updates `structure-spec.md`'s prose count: twelve files, eleven conventions.
- **X5:** Step 10 also pins the ≤3-option cap and merge-fallback sentences in lead, coder, producer and sprint-ship-loop.
- **L1 (late Codex pass; no coder check — Build verifies the finding first):** the merged option keeps both knock-ons in its description (D3 merge fallback).
- **L2 (late Codex pass; no coder check — Build verifies the finding first):** Step 10 also pins the `fkit-open-questions-interview` carve-out sentence (an "Explain more" pick or a typed question leaves the question open).

L1/L2 finding text (late Codex pass, verbatim): L1 — "D3's four-option fallback merges two worker options while only requiring that it "name both." For two placement options with different knock-ons, that can discard the per-option consequence required in the dialog description, leaving the owner unable to evaluate the merged alternative." L2 — "This skill currently treats every returned `AskUserQuestion` result as answered. The plan changes that for the standing option/non-choice, but Step 10 does not test this required carve-out; a missed or weakened edit silently marks the original question closed and prevents the promised re-ask."

### Standing conditions
- Verifications 5 and 7 (live check) are owner-run, pending; 0504 is not routed to close until the owner runs them or explicitly waives them.
- Build re-measures the rules-block budget (not re-measured since planning).
