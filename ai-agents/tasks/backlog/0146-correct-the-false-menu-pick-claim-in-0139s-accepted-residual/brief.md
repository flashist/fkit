# Correct the false "menu-pick alias" claim in 0139's accepted residual

## ID
0146

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-reviewer

## Context

Task **0139**'s review ledger records an owner-ratified accepted residual whose description of shipped
behavior is **false**. Found 2026-07-26 during the owner-verification close of 0139, by checking the
residual's claim against the code rather than reading it.

**The residual says** (`ai-agents/tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/review.md`,
in *Accepted residuals*, the entry titled *"`fkit team` is a menu-pick alias only, never a CLI word"*):

> *"the explicit-role path accepts the seven real role words plus `adv` / `adversarial`; `team` and
> `team room` are accepted **only** as menu picks, **exactly as before this task**."*

**The code says otherwise.** `claude/fkit-claude.sh`, the menu `case` block:

```
1|lead)                role="lead" ;;
```

There is **no `team` and no `"team room"` pattern on any arm.** A `team` input at the `role [1-7…]`
prompt falls through to `*)` and prints `? "team" is not one of 1-7.` Before this task the arm read
`7|lead|team|"team room")`, so the menu **did** accept them — meaning "exactly as before this task" is
wrong in the one direction that matters.

**The launcher's own comment agrees with the code, not the residual** (`claude/fkit-claude.sh:182-184`):

> *"⚠️ `team` / `team room` are NOT accepted — **not here, and not at the menu either**."*

So the residual text is the lone outlier among three sources.

**Owner ruled 2026-07-26: the text is wrong, the code is right.** The words were intended gone from
**both** paths. This is a **documentation defect in a decision record**, not a behavioral regression —
**no launcher change is authorized by this brief.**

**Why it is worth its own task rather than a silent edit.** An accepted residual is marked
*do-not-re-litigate*: the next reader is instructed to trust it and move on. One that describes
behavior the code does not have will be trusted precisely because of that marking — and R1 was ruled on
the strength of this description. It is also a textbook instance of the class task **0137** is being
written to name (*"verify against the claim"*), and of the incomplete/incorrect-inventory class task
**0142** investigates.

## What to build

A minimal correction to the residual's text in
`ai-agents/tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/review.md`:

1. Fix the **What** clause so it states what shipped: `team` and `team room` are accepted on **neither**
   the menu nor the CLI path — the menu arm is `1|lead)` and the words appear nowhere in it.
2. Fix the residual's **title**, which carries the same error — *"`fkit team` is a menu-pick alias only,
   never a CLI word"* asserts the menu still accepts it.
3. **Add a dated correction note** rather than silently overwriting, mirroring the form used in 0139's
   own `brief.md` amendment (2026-07-26): quote the original wording so the history is not lost, and
   record that the owner ruled the text wrong on 2026-07-26.
4. **Leave the Why clause and the re-raise condition alone** — the *reasoning* for R1 (menu reads a
   line, CLI reads argv; a narrow fix would make `team` stricter than every real role word) is correct
   and is not what went wrong. Only the description of the resulting behavior is.

**Explicitly not in scope:** any change to `claude/fkit-claude.sh`. The code is correct. A brief that
ends in a launcher edit has misread this one.

## Verification steps

1. The residual's title and What clause in `review.md` both state that `team` / `team room` are accepted
   on **neither** path.
2. A dated correction note is present and quotes the original wording verbatim.
3. The residual's Why clause and re-raise condition are **byte-unchanged** — verify by diff.
4. `git diff` shows **no change to `claude/fkit-claude.sh`** or any other source file.
5. Re-run the check that found this: the menu `case` block contains no `team` pattern, and
   `claude/fkit-claude.sh:182-184` still says the words are accepted on neither path. Both must agree
   with the corrected text — **three sources, one story.**
6. `npm test` still green — 521 tests + the `prove-red.sh` hard gate. (A docs-only change should not
   move it; confirm rather than assume.)

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Owner:** fkit-reviewer — `review.md` is the reviewer's ledger, and this corrects a reviewer-written
  residual. **Not the coder's to edit**, and not a source change.
- **Coordinates with task 0144**, which pins the `team` / `team room` rejection with launcher-contract
  CLI tests. **0144 is the durable fix and this is not a substitute for it:** a test would have caught
  this, and the reason it was not caught is that no test asserts the menu path's rejection. The owner
  considered folding this into 0144 and chose to keep it separate so the false sentence is corrected
  now rather than whenever 0144 runs.
- ⛔ **Dated ruling 2026-08-03 — the merge was proposed a SECOND time and REFUSED again: this task and
  0144 stay two separate Backlog rows. Do not merge them.** Owner ruling, given live via
  `AskUserQuestion` in an `fkit-lead` session on **2026-08-03**. The bullet above is **left
  byte-identical**; this is an append below it, in the `0149` shape — a separate bullet, never inside
  the label.
  - **What was proposed:** the 2026-08-03 sprint-2 open-row triage classified both rows as movers to
    the Backlog board and proposed folding this task into 0144.
  - **Why it was refused:** the merge's rationale was **schedule pressure inside Sprint 2**. Both rows
    are now **unranked on the Backlog board**, so that pressure is gone. The owner also accepted this
    brief's own standing argument — **"0144 is the durable fix and this is not a substitute for it"**.
  - **What executed instead:** both rows moved to the Backlog board on 2026-08-03 with the other 43
    movers, **separately**. Neither was cancelled or closed.
  - ⛔ **Do not re-derive or re-propose this merge.** Also recorded in the 2026-08-03 triage addendum
    in `ai-agents/sprints/done/sprint-2.md`, under *"Two owner rulings recorded, awaiting the unblock"*.
- **Feeds task 0142** (the fact-inventory investigation) as a worked example: a claim stated in a
  decision record, marked do-not-re-litigate, contradicted by the code, and caught only by a human
  checking it by hand.
- No commit — leave the edit in the working tree.
