# Build `test/wiki-flag-convention.test.js` — the wiki flag block is prose only and wholly unenforced

## ID
0154

## Sprint
Sprint 2

## Priority
128

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
  they rank apart (this at 127, 0152 at 131, 0136 at P114). The producer did **not** re-rank 0152 to sit
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
- **⚠️ This task does not cover the failure that produced its promotion — see `0165` (P143).** This test
  asserts the five required strings are **present in the three wiki `SKILL.md` files**. They were present
  throughout the 2026-07-29 `0141` deviation (`ai-agents/wiki-vault/log.md:623`), so **this test would
  have been green for its entire duration**. It guards the **source text**; `0165` decides where a check
  on the **emitted form** can live. **Adjacency, not a dependency, and deliberately not a merge** — the
  producer judged them distinct on 2026-07-29 and recorded the argument on the sprint board.
- No commit — leave the test in the working tree.
