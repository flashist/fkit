# Remove the output variants from `/fkit-status` — one skill, one output

## ID
0074

## Sprint
Sprint 2

## Priority
44

## Status
✅ Done

## Context

**The owner ran `/fkit-status` and was told to run it again.** The producer replied *"Board not
re-rendered (delta default). Run `/fkit-status full` for the complete 43-row board."* The owner's
ruling (2026-07-16, verbatim):

> *"I want to remove different versions of the skill, there should be 1 version of the output if I run
> the skill, no additional arguments. I guess it means that we need to remove `full` and make the
> full-run by default."*

**This reverts task 38** ([`add-full-board-switch-to-fkit-status.md`](../0005-add-full-board-switch-to-fkit-status/brief.md),
`✅ Done`, shipped 2026-07-16). That brief argues persuasively *for* the switch. **Its argument is now
stale for one specific reason, and the reason matters more than the reversal:**

- The **delta default (step 5) was designed when the board was hand-built by the LLM.** Re-rendering 43
  rows meant re-deriving every marker by hand and risking exactly the miscount `SKILL.md` warns about.
  Terseness and *accuracy* both argued for deltaing.
- **Task 41 made the board `bash dashboard.sh`** — deterministic, free, and identical on every run.
  **Half the delta default's original justification was retired by that task.** What survives is only
  terseness — *do you want 43 rows every time you ask?* — and that is the owner's call, now made.

**⚠️ `full` and the delta default go together or not at all.** Removing the keyword while keeping the
delta default would be **strictly worse than today**: it leaves no path to the full board at all. The
delta default is the thing being removed; `full` is only the patch on it.

## Decided — the sprint-name argument **survives**

The owner's *"no additional arguments"* reads literally as killing `/fkit-status Sprint 1` too. **It
does not, and this is settled, not assumed:**

1. **The owner glossed their own rule and named only `full`** — *"I guess it means that we need to
   remove `full`."* The sentence's own author scoped it.
2. **A sprint name is not an output variant — it is a different *subject*.** `full` was one board
   rendered two ways; `Sprint 1` is a different board. *"1 version of the output"* constrains **how**
   the answer is rendered, not **what you may ask about**.
3. **Killing it is an unrecoverable capability loss.** Closed sprints live in `ai-agents/sprints/done/`
   and the argument is the **only** way to reach them. That is the same failure shape as removing
   `full` while keeping the delta — a removal that leaves no path to the thing.

**Owner to confirm at review**, but do not build the two-argument removal on spec.

## What to build

Make `/fkit-status` render **one output — the complete briefing with the full step-4 board — on every
invocation**, and delete the machinery of the variant. **Canonical source only:
`claude/skills/fkit-status/SKILL.md`.** The `.claude/` copy is gitignored and init-regenerated — do
not edit it.

1. **Delete the reserved-keyword bullet from the Argument contract** (`:27-34`). The contract returns
   to exactly two cases: **empty → active sprint**, **a sprint name → that sprint**. `full`, `all`,
   and `board` become ordinary text — and therefore resolve as sprint names and correctly fail with
   *"no sprint named `full`"*. That is the intended behavior now, not a regression.
2. **Delete step 5 in its entirety** (`:264-272`) — heading, the delta rule, and its `full` exception.
   The full board is unconditional. **Do not** replace it with a softer delta ("delta unless much
   changed") — a conditional variant is the same defect wearing a different hat.
3. **Renumber the steps and fix the inbound cross-references.** Old step 6 (*"Report — and stop
   there"*, `:274`) becomes step 5. **`:111` says "see step 6"** and must follow. Steps 1–4 are
   untouched; `dashboard.sh` stays the **step-4** board.
4. **Fix `:155`**, which promises *"The argument contract, the `full` keyword, and the step-5 delta all
   stay yours."* Both named things are gone; the sentence must not survive as written.
5. **Fix the `## Usage` block** (`:304-305`) — delete both `full` invocations, leaving the two that
   remain true.
6. **Fix `dashboard.sh:25`** — a **comment** reading *"The SKILL resolves the sprint and the `full`
   keyword."* **Comment-only; no behavior change.** The script never knew about `full` — it takes a
   path. *(Not in the coder's original site list; found while scoping.)*
7. **Check the frontmatter `description`** (`:3`) — it documents the optional sprint-name argument,
   which **survives**, so it likely stands. Confirm it makes no delta/variant claim.

**Skill-instruction text only.** There is no parser; the skill is prose the producer agent follows.

## Explicitly NOT in scope

- **The sprint-name argument.** It stays (see above).
- **`ai-agents/knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md`**
  (3 refs to `full`). It is a **dated report** — history, frozen. It was true when written. **Do not
  rewrite it.** Same rule as a closed sprint plan's prose.
- **Task 38's brief in `tasks/done/`.** Its claims are history and stay frozen. Do not edit, do not
  move — it remains `✅ Done`, because it *was* done.
- **The wiki** (8 files reference `full`). Neither the coder nor the producer may write
  `ai-agents/wiki-vault/`. **Task 45** covers it.

## Verification steps

**⚠️ The test suite does not cover skill prose. `node --test` passing proves nothing here — a real
`fkit producer` session is the only check.** Say so in the report rather than implying test coverage.

- **Run `/fkit-status` twice in one session. The second call renders the complete board — every row —
  identical to the first** (modulo real changes). No delta, no "board not re-rendered" line, no
  suggestion to re-run with anything.
- **`/fkit-status Sprint 1` still resolves a closed sprint** from `sprints/done/` and renders its full
  board. **This is the regression to watch** — the removal must not take the sprint argument with it.
- **`/fkit-status full` now fails honestly** — *"no sprint named `full`"*, listing what's there. Not
  silently treated as the active sprint.
- **Grep the skill for `full` / `all` / `board` as a keyword and for `delta`** — zero hits describing a
  variant or an override. **No section left describing the old contract** (the failure mode task 38's
  own verification named).
- **No orphan step references.** Grep `step 5` / `step-5` / `step 6` / `step-6` across
  `claude/skills/fkit-status/` — every survivor points at the renumbered reality.
- **`bash claude/skills/fkit-status/dashboard.sh <sprint-path>` output is byte-identical to before** —
  the comment fix changed nothing. Diff it.

## Notes

- **Owner: fkit-coder.** Skill procedure text in `claude/skills/fkit-status/SKILL.md`, plus one
  comment in `claude/skills/fkit-status/dashboard.sh`.
- **Depends on: nothing.** Task 41 (the deterministic board) has already landed — it is the
  *precondition that makes this cheap*, not a blocker. Independent of 34/35/42/43.
- **Risk: low.** Skill text + one comment. No launcher change, no new skill registration, no mirror,
  no product code, no scaffold copy.
- **Reverting a `✅ Done` task shipped in the same week is unusual and is deliberate.** The record is
  this brief and the Sprint 2 addendum; both name task 38 so the trail is findable from the reverted
  work. **No ADR** — see the sprint addendum for that call and the open question it leaves the owner.
- **The delete is the deliverable.** The temptation on a "remove the variant" brief is to leave the
  mechanism in place and change its default. That is not this. **If a future reader finds step 5 gone
  and assumes an oversight, this brief is the answer** — the delta default was removed on purpose, by
  the owner, on 2026-07-16, after task 41 retired half its rationale.
</content>
</invoke>
