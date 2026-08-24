# Build `test/wiki-flag-convention.test.js` — the wiki flag block is prose only and wholly unenforced

## ID
0154

## Sprint
Sprint 6

## Priority
Sprint 6 P21

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Task **0125** landed the wiki completion-flag convention in three `SKILL.md` files as **prose only.
Nothing in the repo enforces it. Deleting the entire block would turn nothing red.**

**Re-verified firsthand 2026-07-27:**

| Claim | Evidence |
|---|---|
| The ADR-018 skill-ownership hook never opens a `SKILL.md` | `claude/skill-ownership-hook.sh` is 136 lines; it reads the payload once (`payload="$(cat)"`, line 55) and consults `skills_for_role()`. `grep -n 'SKILL.md' claude/skill-ownership-hook.sh` → **no hits**. |
| No test reads any `SKILL.md`'s body | Every `SKILL.md` occurrence under `test/` is a **comment**: `test/dashboard-contract.test.js` (6 sites) and `test/task-id-uniqueness.test.js:35`. There is **no `readFileSync` of any `SKILL.md`** in the suite. |

This matches the surface finding already recorded in task **0152**'s brief — skill-file *content* is an
entirely untested surface.

**Named as a residual by both reviewers on 0125**, independently:

- the coder, in `plan.md` §6 risk 1 — *"This convention is prose only. Nothing enforces it… If a future
  edit deletes the block, nothing goes red."* It names the follow-up by filename.
- the reviewer, in `review.md`'s accepted-residuals section — same filename, same reasoning.

**The standing residual this task replaces.** 0125's `review.md` finding **R3** (low, CORRECT):
`plan.md` check 4 is **fail-open in shape** — `sed 's/^ *//'` erases relative nesting, so it cannot
detect a broken list-item indent (the one structural risk of that change), and the
`diff && diff && echo UNIFORM` chain **prints `UNIFORM` on an empty extraction**. The **owner ruled
SUBSUME on 2026-07-27**: check 4 was left as-is because *a real test beats a better one-shot grep*.
**This task is what actually closes R3.** Until it lands, R3 is an open residual with nothing behind it
but a one-off harness that was never committed.

**A near-miss worth carrying, because it is the argument for the test.** As first written, check 4's
start anchor was `/The wiki \*\*closes nothing/` while the block's actual text is
`**The wiki closes nothing` — the `**` on the other side. The anchor matched **zero** lines, so the
check would have compared three empty files and printed `UNIFORM`. It was caught at build time by
chance. That is the failure mode a committed, fail-closed test removes.

> ## ⭐⭐ DATED CORRECTION 2026-08-14 — A FRAMING REPAIR, AND IT CORRECTS THE TRIAGE, NOT THIS BRIEF. Every prior byte left identical.
>
> **⛔⛔ READ THIS BEFORE THE ASSERTION LIST BELOW.** ⚠️ **Scope of this correction: FRAMING ONLY.**
> Nothing about this task's scope, intent or deliverable changes. **No scope change, no status change,
> no re-rank, no file move.** Written by a spawned `fkit-producer` with no owner channel.
>
> ### Why it is here
>
> The 2026-08-14 backlog triage classified this row **STALE-PREMISE** on two claims:
> *"the five strings it would pin have moved — `0173` rewrote the block"* and, worse, *"under ADR-033,
> pinning **do not spawn the producer** would pin the WRONG rule, because the producer is now the only
> role that may run a mover."* **That second claim would make this task harmful to build as written.**
>
> ### ⛔⛔ BOTH CLAIMS ARE FALSE. RE-MEASURED ON DISK 2026-08-14, AND THE BRIEF BELOW NEEDS NO REWRITE.
>
> **1. ⛔ The R5 clause is NOT gone. It survives verbatim in all three files.**
>
> | file | the R5 clause, whitespace-normalized | the triage's `grep -c "do not spawn the producer"` |
> |---|---|---|
> | `claude/skills/fkit-wiki-ingest/SKILL.md` | ✅ present | `0` |
> | `claude/skills/fkit-wiki-sync/SKILL.md` | ✅ present | `0` |
> | `claude/skills/fkit-wiki-lint/SKILL.md` | ✅ present | `0` |
>
> ⭐⭐ **The grep returned `0` because the phrase WRAPS ACROSS A LINE BREAK, and the continuation is
> indented.** The live text reads:
>
> ```
> **Then stop.** Do not invoke a mover, do not edit the brief, do not touch the sprint plan, and do not
>    spawn the producer to close it yourself.
> ```
>
> A single-line `grep` cannot match it. ⚠️ **Joining lines with `tr '\n' ' '` is ALSO not enough** —
> that leaves the three-space indent as internal whitespace and still returns `0` for `ingest` and
> `lint`. **Only a whitespace-normalizing match finds it**, and it finds it in all three.
>
> ⭐⭐ **This is not a footnote — it is the argument for this very task, arriving unprompted.** A
> single-line anchor over a wrapped block reported *"the string is gone"* about text that is right
> there. That is **the same failure this brief already records at check 4's near-miss above**: an
> anchor that matched **zero** lines and reported a pass. ⛔ **The test this task builds MUST be
> wrap-tolerant** — normalize whitespace before matching, or the guard reproduces the exact false
> negative that produced this correction. ⚠️ **Add that to what "fail closed" means here.**
>
> **2. ⛔ THE RULE IS NOT REVERSED. ADR-033 does not contradict the R5 clause — it is why the clause
> exists.**
>
> ADR-033 makes the movers **producer-only**. The R5 clause does **not** say *"the producer must not
> close"*; it says the **wiki** must not spawn the producer to close **on its own initiative**.
> The live block states the whole rule in one breath, and it is internally consistent:
>
> > **The wiki closes nothing and moves no task file.** Since **ADR-033** the task movers … are the
> > **producer's alone** … **Then stop.** Do not invoke a mover, do not edit the brief, do not touch
> > the sprint plan, and do not spawn the producer to close it yourself. **Routing the close is the
> > caller's next move, not yours.**
>
> ✅ **Pinning that clause pins CURRENT policy, exactly as written.** ⛔ **The triage's *"would enforce
> the opposite of current policy"* reading is wrong, and a run that acts on it would delete a live rule
> from three shipped skill files.**
>
> ⚠️ **The distinction, stated plainly because it is what the triage collapsed:** ADR-033 §3/§4 has the
> **ship-loops** spawn the producer to close — that is the **driver's** act. The wiki is **not** a
> driver, and the same act from a wiki identity is what R5 forbids. **Two different actors, one rule,
> no contradiction.**
>
> **3. ✅ All five assertion subjects survive `0173`, in all three files** (whitespace-normalized,
> 2026-08-14): the complete-flag line (`Task <NNNN>'s vault work is complete — ready to close`), the
> partial-flag line (`Task <NNNN>: partial — not ready to close`), the hard-rule bullet (*"The wiki
> does not hold the task movers"*), the R2 branch (*"say nothing about it at all"*), and the R5 clause.
> **The assertion list below is sound and needs no re-derivation.**
>
> ### ⚠️ What IS genuinely dated below — small, and none of it changes the deliverable
>
> - **`0173` did rewrite the block**, after `0153`. ⛔ **Derive the exact strings from the post-`0173`
>   text on disk, not from any figure or quotation in this brief** — that instruction was always here
>   and still stands; only the reason has grown.
> - **`0153`, `0136` and `0125` are all closed** (`ai-agents/tasks/done/`). The *"soft-follows"* line in
>   `## Notes` is discharged for `0153` and `0136`; **`0152` is still open** in
>   `ai-agents/tasks/backlog/`, so the shared-`SKILL.md`-walk question is live and verification step 7
>   still applies.
> - **The `P114` / `127` / `128` rank figures throughout are stale** — Sprint boards were re-ranked
>   since. ⚠️ **This row is on the Backlog board, unranked.** The `## Notes` ranking note already
>   carries its own 2026-07-29 dated correction; ⛔ nothing here re-ranks anything (ADR-035).
> - **The `33 lines each; 2296 B, 2296 B, 2215 B` figures are dated 2026-07-27.** ⛔ Re-measure — the
>   brief already says so, and `0173` touched exactly that text.
>
> ⛔ **Nothing else about this row changed.** `## Status` `🔲 Backlog`, `## Priority` `Unscheduled`,
> `## Sprint` `Backlog`, `## Owner` `fkit-coder` — all untouched. No board row edited, nothing
> re-ranked (ADR-035), no mover run (ADR-033), nothing written under `ai-agents/wiki-vault/` (ADR-005),
> nothing committed.

> ## ⭐⭐ SCHEDULED ONTO SPRINT 6 AT `P19` — OWNER RULING 2026-08-14. Every prior byte left identical.
>
> ⚠️ **This supersedes the header-field line immediately above** (*"`## Priority` `Unscheduled`,
> `## Sprint` `Backlog` … untouched"*), which was true when it was written and is now dated. That block
> is **left byte-identical**, per this project's dated-correction practice. **`## Status` is still
> `🔲 Backlog` and was not touched** — a sprint assignment is not a lifecycle move
> ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
>
> **The ruling.** Given live via `AskUserQuestion` in an owner-present `fkit lead` session driving
> `/fkit-sprint-ship-loop` — **the option label is the verbatim text**:
> **"Pull it into Sprint 6 (Recommended)"**. Recorded by a spawned `fkit-producer` with **no owner
> channel** ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
> which **ranked nothing itself**. ⛔ **`P19` is an APPEND** — Sprint 6's `P1`–`P18` were left exactly as
> they are and nothing was renumbered
> ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
>
> **The three edits of the forward move, all done in this act:** the row was added to
> [`sprint-6.md`](../../../sprints/sprint-6.md) at `P19`; the row on
> [`backlog.md`](../../../sprints/backlog.md) was flipped to
> `➡️ Moved to [Sprint 6](sprint-6.md) — priority P19` and **not deleted** (Task and Brief cells left
> byte-identical); and this brief's `## Sprint` / `## Priority` were updated. ⚠️ **The `— priority P19`
> suffix is owed here** — Sprint 6 is ranked `P1`–`P19`, so the unranked-forward clause that let the
> first 18 rows omit it does not apply.
>
> ### Why it was scheduled
>
> **Both halves of the `STALE-PREMISE` evidence that shelved this row have fallen** — the correction is
> recorded in full in the framing-repair block above, and in
> [`2026-08-14-backlog-triage-recheck.md`](../../../knowledge-base/reports/2026-08-14-backlog-triage-recheck.md):
>
> 1. **The string half was a FALSE NEGATIVE.** *"`grep -c "do not spawn the producer"` returns 0"* — the
>    phrase **wraps across a line break**. Measured `naive=0 / normalised=1` in **all three** wiki
>    skills: `fkit-wiki-ingest:90-91`, `fkit-wiki-sync:135-136`, `fkit-wiki-lint:99-100`.
> 2. **The reasoning half was WRONG.** *"pinning it would guard a rule ADR-033 reversed"* — ADR-033
>    makes the **movers** producer-only and has the **driver** spawn the producer; the clause forbids the
>    **wiki** spawning one *on its own initiative* (*"Routing the close is the **caller's** next move,
>    not yours"*). **Two actors, one consistent rule. Pinning the clause pins CURRENT policy.**
>
> The owner ruled the row a clean **`KEEP`, with a wrap-tolerance requirement** on its guard — **the
> option label is the verbatim text**: **"Keep it, with the wrap-tolerance requirement
> (Recommended)"** — and has now scheduled it. ⭐ **The scheduling argument, on the record: today's false
> negative was caught by an agent choosing to verify, not by any check. This task's guard is the only
> filed work that would catch that class mechanically.**
>
> ⚠️ **The wrap-tolerance requirement is ALREADY RECORDED above and is not restated here** — see the
> 2026-08-14 framing correction, §1: *"⛔ **The test this task builds MUST be wrap-tolerant** — normalize
> whitespace before matching, or the guard reproduces the exact false negative that produced this
> correction. ⚠️ **Add that to what 'fail closed' means here.**"* **It is a requirement of the
> deliverable, not a footnote.**
>
> ### ⛔ What this act did NOT do
>
> **The genuinely dated content flagged in the framing correction above was deliberately NOT repaired
> here, and this scheduling must not be read as having checked it:** `0153`, `0136` and `0125` have
> closed; **`0152` is still open**, so verification step 7 and the shared-`SKILL.md`-walk question stay
> live; the `P114` / `127` / `128` rank figures throughout are stale; and the 2026-07-27 byte figures
> (`33 lines each; 2296 B, 2296 B, 2215 B`) need re-measuring. **The implementer re-derives all of it at
> the plan gate**, along with the exact assertion strings from the post-`0173` text on disk.
>
> ⛔ Nothing closed, cancelled or started. No task file moved between `backlog/`, `done/` or
> `cancelled/`. Nothing written under `ai-agents/wiki-vault/` (ADR-005). Nothing committed.

## What to build

A hand-rolled `node --test` guard, `test/wiki-flag-convention.test.js`, over
`claude/skills/fkit-wiki-{ingest,sync,lint}/SKILL.md`.

**Assert all five of these — the flag line alone is not enough:**

1. the **complete-flag** line, verbatim, in all three files;
2. the **partial-flag** line, verbatim, in all three files;
3. the **hard-rule bullet** (*"The wiki does not hold the task movers…"*), in all three files;
4. the **R2 branch** — *"unrelated to this run → say nothing about it at all"*. Without it the block
   reverts to emitting a `partial` line for every `fkit-wiki`-owned backlog brief on every run, in
   perpetuity;
5. the **R5 clause** — *"do not spawn the producer to close it yourself"*. Without it the block names
   three forbidden acts and omits the fourth, next to a ready-to-run `@fkit-producer` line, on a path
   the ADR-018 hook **permits**.

   > ✅ **DATED CONFIRMATION 2026-08-14 — assertion 5 STANDS, and the claim that it was stale is the
   > thing that was wrong. This item is left byte-identical.** The clause is **present in all three
   > files** and pins **current** policy under ADR-033. ⛔ **Do not drop, weaken or invert this
   > assertion.** ⚠️ **It WRAPS across a line break with an indented continuation, so a single-line
   > `grep` reports it missing** — ⛔ **the guard must normalize whitespace before matching, or it
   > reproduces the false negative that caused this note.** Full reasoning in the dated correction
   > above `## What to build`.

**And the shape of the check itself:**

6. **Fail closed, deliberately, in contrast to 0125's check 4.** Gate the extraction on being
   **non-empty** and on a **minimum line count** before comparing anything. **Preserve relative
   nesting** — do not blanket-strip leading whitespace. `fkit-wiki-sync`'s block is the same text at a
   **uniform** three-space-smaller indent than `ingest`/`lint` (verified 2026-07-27: 33 lines each;
   2296 B, 2296 B, 2215 B). Model that as *"identical modulo one uniform offset"* and reject a
   **non-uniform** offset, which is what a broken list-item indent looks like. Blanket-stripping accepts
   the bug.
7. **ADR-014 governs** — `node --test`, **zero devDependencies**, hand-rolled. No YAML or markdown
   library.
8. **Earn a `test/prove-red.sh` mutation.** A guard nobody has seen fail is not yet a guard. At minimum
   mutate one of the five asserted strings and observe red naming the offending file.
9. **Failure messages name the offending file and which of the five assertions failed.** A bare
   `expected true to be false` leaves the next reader grepping three files.
10. **Cover the canonical tree only** — `claude/skills/`, never `.claude/skills/` (gitignored mirrors
    refreshed by `claude/fkit-claude-init.sh`; asserting against them makes the suite depend on whether
    init has run).

**⚠️ One `SKILL.md` walk across the whole suite, not three.** Two other tasks commit to reading
`SKILL.md` files: **0136** (rank P114 — the first automated reader, frontmatter) and **0152** (the H1
house-style guard), and 0152's brief already carries the *"must not end up with two independent
readers"* warning. This task is the **third** claimant. Read whichever has landed and **reuse its
walk**; if this runs first, leave a walk the other two can reuse. **Whether the three should share one
harness file or co-land in one `fkit-coder` session is an open call for the owner** — see Notes.

## Verification steps

1. The test passes against the tree **as it stands after task 0153**, with no skip list and nothing
   grandfathered.
2. **Prove it can fail — five times, one per assertion.** For each of the five asserted strings, mutate
   it in **one** file, run the test, see it go **red naming that file and that assertion**, then revert.
   Four green mutations and one untested assertion is a guard with a hole in it.
3. **Prove the uniformity check fails closed.** (a) Point the extraction at an anchor that matches
   nothing → the test must go **red**, not print a pass. (b) Break **one** list item's relative indent
   in one file → **red**. (c) Shift the whole `sync` block by a uniform offset → still **green**, because
   that is the legitimate existing state.
4. `test/prove-red.sh` gains at least one mutation for this file and the mutation is observed to fire.
5. `node --test` runs it with the rest of the suite; **zero** new devDependencies (`git diff
   package.json` empty, or no `package.json` change at all) — ADR-014.
6. The test reads `claude/skills/`, not `.claude/skills/`, and passes in a fresh clone where init has
   never run.
7. Exactly **one** `SKILL.md` file walk exists across the suite once this, 0136 and 0152 have all
   landed. A second independent walk introduced by this task is a defect in this task.
8. **No `SKILL.md` is modified by this task.** It adds a guard; the text it guards is 0153's and
   0125's.
9. The test's header comment states the rule, cites **0125** as its origin and **0153** as the source of
   the current wording, and says what it does **not** catch.

## Notes

- **Owner:** fkit-coder — a test-suite addition.
- **Depends on:** nothing hard. **Soft-follows 0153** (rank 117), which changes the exact strings this
  test asserts — pinning the pre-0153 wording would guard text that is about to be replaced. Also
  **soft-follows 0136** (rank P114) and **soft-follows 0152** for the shared `SKILL.md` walk.
- **Blocks:** nothing.
- **Closes:** the standing accepted residual **R3** from `ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/review.md`
  (`plan.md` check 4 is fail-open). Owner ruled **SUBSUME** 2026-07-27 — this test is the thing that
  discharges it. Say so explicitly in the hand-off, so the residual is retired rather than left
  standing.
- **Source:** named as a residual by **both** the coder (`plan.md` §6 risk 1) and the reviewer
  (`review.md` accepted residuals) during task 0125, 2026-07-27. Owner approved filing 2026-07-27 via
  `AskUserQuestion`.
- **⚠️ Open call for the owner — harness sharing with 0152 and 0136.** All three read `SKILL.md`
  bodies, all three are hand-rolled under ADR-014, and all three would benefit from one walk. On merit
  they rank apart (0152 sits below this task, 0136 at P114). The producer did **not** re-rank 0152 to sit
  beside this task, because that is a re-ranking of existing work on producer judgment rather than an
  owner ruling. **If the owner prefers one session over three, the cheapest form is co-landing this
  task with 0152.**
- **Ranking note.** Placed at **127**, directly above the launcher pin-guards 0144/0145 and above 0146,
  and above 0152. Same class as all four — adding a guard — but with the strongest case of the group:
  the convention it guards is **one day old, duplicated across three files, and enforced by nothing at
  all**, and its only existing check is **fail-open and nearly shipped broken**. 0144/0145/0146 pin
  behavior already verified correct, and 0152's convention held in 24 of 25 files with no enforcement
  whatsoever. Placed **below** 0148 and the 0147/0150 pair because those close gaps in controls the
  project is exercising right now. **The ranking is producer judgment, not an owner ruling.**
- **⚠️ Dated correction, 2026-07-29 — the Ranking note above is superseded. It is left in place, not
  rewritten, per this project's dated-correction practice.** Two of its statements are now wrong:
  - **The rank is `128`, not `127`.** It was appended-displaced to 130 and then to 131 during the
    2026-07-27 and 2026-07-29 passes, and promoted to **128** by the ruling below.
  - **The current rank IS an owner ruling.** **Authority: the owner, 2026-07-29, via `AskUserQuestion`
    in the live `/fkit-sprint-ship-loop` driver session**, executed by a spawned `fkit-producer` with no
    owner channel and no merit judgment of its own. **Merit as ruled:** this run produced **direct
    evidence** for the task — the consumer that would have to enforce the flag form, a spawned
    `fkit-producer` asked at `0141`'s close, stated on the record **"No. I would have acted on it
    without noticing"** and concluded ***"on this run 'carried verbatim' was decorative, not a
    control"***. This task is the only filed work that can make the form a real control.
  - **Placed at 128, not 127**, because P127 is 0162's owner-ruled placement of the same day and P126 is
    `✅ Done`. Raising this task was ruled; lowering 0162 was not. See the sprint plan's *"Promoted by
    OWNER RULING 2026-07-29"* addendum for the full authority note and the open question left for the
    owner.
- **⚠️ This task does not cover the failure that produced its promotion — see `0165`.** This test
  asserts the five required strings are **present in the three wiki `SKILL.md` files**. They were present
  throughout the 2026-07-29 `0141` deviation (`ai-agents/wiki-vault/log.md:623`), so **this test would
  have been green for its entire duration**. It guards the **source text**; `0165` decides where a check
  on the **emitted form** can live. **Adjacency, not a dependency, and deliberately not a merge** — the
  producer judged them distinct on 2026-07-29 and recorded the argument on the sprint board.
- No commit — leave the test in the working tree.
