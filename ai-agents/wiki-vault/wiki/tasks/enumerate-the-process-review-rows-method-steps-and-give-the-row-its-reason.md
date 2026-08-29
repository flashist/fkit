# Enumerate the Process-review row's method steps, and give the row its reason

**Source**: `ai-agents/tasks/done/0223-enumerate-the-process-review-rows-method-steps-and-give-the-row-its-reason/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P12` · ID 0223 · owner `fkit-coder` · **four review rounds**, closed 2026-08-25

## Goal

**Follow-up 1 of `0200`'s report.** The sprint loop's step-2 spawn table has a **Process review** row that names its method and **never says what the method contains**.

⭐ **The cost was measured, not hypothesised.** On `0195` a worker applied the method by hand and its frozen worklog records what it missed: ⛔ **Steps 0, 2, 3 and 3.5 never ran** — the ADR skim, the settled-decision loop check, the codebase verification, the defect/frontier classification and the regression check — **and Step 4's prescribed Status vocabulary was not used.** *Nothing in the row said what "the method" contains, so a partial application looked complete to the worker performing it.*

### ⛔ Two mandatory constraints the brief pinned in advance

1. **Keep the word *"method"*. Do NOT change it to *"run `/fkit-process-stateful-review`"*.** *"Method"* is a settled [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] / [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] convention meaning **apply the steps, skip the skill's per-round owner gate, because the loop's single up-front approval replaces it.** ⛔ **Switching to the invocation form would re-impose the very gate ADR-019 deliberately replaced**, inside a loop whose whole premise is that the owner approved once. `0200`'s round-1 answer said the opposite and **was reversed**.
2. ⭐ **Carve out the CLAUSES, not the STEPS.** The gate is **three approval clauses inside Steps 4–6**, not those steps wholesale. ⛔ *"Every step except 4/5/6"* fails in the opposite direction — it would drop *"write the Coder response"*, which the on-disk gloss puts squarely in scope.

## Key Changes

**One row, in one file** — `claude/skills/fkit-sprint-ship-loop/SKILL.md:126`, cells 2 and 3. `git diff --numstat` = `1 1` for the whole task.

- **The method's steps enumerated** — 0, 1, 2, 3, 3.5, 4, 5, 6, 7 — so a partial application is visible to the worker itself.
- **A reason clause** stating why the step is `@fkit-coder` and not the deliverable's author: the skill writes the ledger's **coder-owned** *Coder response* section, and its Step 6 **applies code fixes**. Cites [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]]. ⭐ *Without the reason, a future driver re-derives the substitution as obviously right — which is exactly what happened on 2026-08-02.*

## Outcome

**Four review rounds, six findings, every one CORRECT and every severity agreed.** Reviewers: own pass + Codex (`codex-cli 0.145.0`, `--sandbox read-only` → **reasoning-only coverage**, [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] D1 — the normal state, not a degradation). `node --test test/*.test.js` → **747 pass / 0 fail**.

⭐⭐ **The headline finding of round 1 is the sharpest thing in this record: the enumeration was faithful on Steps 0, 1, 2, 3, 3.5 and 5, and NOT fully faithful on Steps 4, 6 and 7 — and all three defects sat on the *Status vocabulary* axis, which is the exact axis `0195` failed on and which the row itself cites as the failure it prevents.**

| # | Sev | What was wrong |
|---|---|---|
| **R1** | medium | Step 6 said set **each** row's Status to `✅ done`, unconditionally — **contradicting the skill inside its own sentence**: a confirmed intended tradeoff's row gets `won't fix (frontier)`. It also dropped `blocked`, and would have the worker **overwrite** `disproven` / `closeout (re-litigation)` rows set at Step 4. |
| **R2** | medium | Step 4 ordered the worker to use *"the skill's prescribed Status vocabulary"* — ⛔ **and the row never stated that vocabulary.** Of six values, only `✅ done` appeared; four occurred **zero** times. |
| **R3** | low | Step 7 was enumerated **in name only** — *"7 — final report"*. ⭐ *Naming a step without saying what it contains is the failure mode the row exists to close.* |
| **R4** | low | *"Never edit the Reviewer findings section"* was absolute, while the row's own Step 0 says *"open **or create**"* — ⭐ **instructing the worker to create a ledger it then forbids populating.** Raised by Codex. |
| **R5** | low | The enumeration carried every step's **action** and dropped a **load-bearing qualifier** from three. ⚠️ Step 3's bare *"verify each against the actual code at `file:line`"* **reads as licensing exactly the cited-line-only verification the source forbids**. |
| **R6** | medium | ⭐ **Step 6's closeout condition added a term its source does not have, in the permissive direction** — the source lists `closeout / disproven / accepted`; the row added `done`. ⭐ The three source terms are exactly the dispositions that **change no code**; adding `done` lets a round that *did* change code close itself out. |

⭐ **R6's verification is a worked example in its own right: the claim was verified against the state the reviewer reviewed, not the state on disk now** — the lead's own grep timestamp and the prior spawn's `Edit` `old_string` both carried the four-term text, proving the reviewer read what it said it read.

⚠️ **The base ref moved mid-review.** Rounds 1–3 reviewed the working tree vs `c45ec3d`; the owner committed the whole tree on 2026-08-25, so round 4 reviewed **`50cfdb6` vs `c45ec3d`** instead — one commit, one hunk, `@@ -126 +126 @@`.

### Accepted residuals

- ⛔ **A partial application is still only *visible*, never *prevented*.** The loop table is documentation and **a document cannot enforce itself**. Detection is open task `0224`'s; a red-first test on the row's content is `0225`'s. **Re-raise only if `0224` ships and its detector still cannot observe a skipped step.**
- ⚠️ **The row is a PROSE COPY of the skill, with no mechanical link** — the six-value vocabulary and the Step 4 / Step 6 mappings are restated, and **no test asserts the two agree**, so the copy can drift silently. ADR-032 keeps the source skill byte-unchanged, which is why the enumeration lives in the row at all.
- **R6's three-term closeout condition** is now restated faithfully; re-raise only if the loop gains a re-Review step.

### ⚠️ Also noted, below the bar for a finding

- The row's cell-2 column is **ragged** against the other five rows — owner-ruled acceptable.
- ⛔ **`:225-229`'s pointer-only-refusal prose is knowingly false pending `0333`.**
- `0224` also edits `:126` — a sequencing conflict, not a defect.
- ✅ **`0204`'s five marker-removal sites did not move** — file `wc -l` **414**, unchanged, anchors verified independently.

## Related
- [[tasks/record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — `0222`, the ADR this row's reason clause cites
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — the rule that fixes a loop step's role
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the per-round gate the word *"method"* skips
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the single up-front approval that replaces it
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — the coverage state declared each round
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
- [[tasks/decide-how-the-ship-loop-handles-a-non-coder-owned-task-row]] — *added 2026-08-29:* `0270`, the sibling ADR-038 follow-up, which re-examined the rule this row's reason clause cites
