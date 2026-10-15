# Worklog — 0501: say how the board reads `Depends on:` lines in `dependency-declaration-form.md`

Build worker: spawned `fkit-coder`, caller `fkit-sprint-ship-loop` / `fkit-lead` (Sprint 10), 2026-10-14.
Approved plan carried verbatim, with its blob pointer. I re-checked `git hash-object plan.md` at the
start: `21a4e24d9ac3b01148f0a60eade3382c6c030856`, 11285 B, a match. Owner approvals, all via
`AskUserQuestion` in the `fkit-lead` session on 2026-10-14:
- Q2 "Approve (Rec)";
- Q1 "Both copies (Rec)", meaning the slug bullet goes in both copies;
- the mid-build slug ruling "Fix the advice (Rec)" (decision 1 below).

`plan.md` was not touched. No commit, no push, no wiki-vault write.

## Change surface (4 files)
- `ai-agents/knowledge-base/conventions/dependency-declaration-form.md`: new section
  `## How the board reads the IDs (task 0492)`, between `## The guard (task 0107)` and `## Rules`. No
  existing line changed.
- `claude/scaffold/ai-agents/knowledge-base/conventions/dependency-declaration-form.md`: the same
  section without the task number, between `## The guard` and `## Rules`. It uses the neutral IDs
  `0042`–`0045` and drops the `0492` R1 cite. `## Where this is enforced` is untouched.
- `claude/structure-manifest.tsv`: regenerated (`npm run generate:manifest`, 92 entries). Against the
  pre-run copy it gains exactly one line: the new scaffold hash
  `5ee2caf1…` for `dependency-declaration-form.md`. No line was removed. Against `HEAD` it shows 3
  added lines, which is 0506's two plus this one.
- `CHANGELOG.md`: one bullet under `## Unreleased`.

A `diff` of the two new sections shows they differ only by the listed substitutions: heading, IDs,
the R1 cite, and `110`→`42` (decision 2).

## Decision log
1. **Slug bullet: the plan's remedy was wrong, so the owner ruled.** This was not my call.
   - **Finding:** the plan's draft said "put the mark after the link". On the scratch board a mark
     after a soft-slug link is ignored.
   - **Why:** in `dep_hard_ids` an ID's segment runs to the next *different* ID. A link like
     `[0005](../0005-make-it-soft/…)` repeats the same ID in its slug, so the slug's `soft` is the
     first whole word after the ID.
   - **What I did:** stopped and returned NEEDS-DECISION. The owner selected "Fix the advice (Rec)"
     (2026-10-14, `AskUserQuestion`, `fkit-lead` session).
   - **Result:** the bullet now says a link whose text is the ID is read through its slug, even with a
     mark after the link, and to write the plain ID and its mark first, then the link. The live copy
     uses `0110`, the scaffold copy `0042`.
   - **Evidence**, scratch board run 1:

     | Row | Line | Result |
     |---|---|---|
     | 0218 | `[0005](../0005-make-it-soft/brief.md).` | no record (the miss) |
     | 0219 | `[0005](../0005-make-it-soft/brief.md) — hard, not soft.` | **no record** (the plan's remedy fails) |
     | 0220 | `0005 — hard, not soft ([brief](../0005-make-it-soft/brief.md)).` | record (the new remedy works) |
     | 0221 | `0005 ([brief](../0005-make-it-soft/brief.md)).` | record (link text not the ID, so the plain ID reads hard) |
     | 0222 | `[0006](../0006-hard-reset/brief.md) — soft, not hard.` | record (a `hard` slug over-flags, the safe direction) |
2. **Obvious-winner call: the scaffold copy's rule 1 says `42` where the live copy says `110`.**
   - **Why:** the plan maps the live IDs to the neutral `0042`/`0043`/`0044` set. `110` is the
     "not 4 digits" form of `0110`, so its neutral twin is `42`.
   - **Why it qualified:** it is mechanical and inside the plan's "neutral example IDs" substitution.
     The reader treats both the same way: neither is 4 digits, so neither is read. Scratch run 2,
     row 0214, `task 42` gave no record.
3. **The slug bullet has the same wording in both copies.** This follows the owner's Q1 ruling
   ("same rules in both homes"). Only the ID differs.

No other fix was applied and no other obvious-winner call was made.

### Review round 1 — Process-review worker (spawned `fkit-coder`, 2026-10-14)
Same declared-approval marker as the build, with worker role Process-review. Plan blob re-checked:
`21a4e24d…`, 11285 B, a match.

4. **Correction to decision 1's evidence table, row 0221 (found by review R1).** The table says
   `0005 ([brief](../0005-make-it-soft/brief.md)).` gave a "record (link text not the ID, so the plain
   ID reads hard)". **That is wrong.** The run's own saved output (`scratchpad/0501/w/out.txt`) has
   records only for 0220 and 0222; row 0221 gave **no record**. Re-run this round: still no record.
   Why: the link's path `../0005-…` is a second mention of `0005`, and every mention must read soft,
   which both do (the slug's `soft` is the first whole word in each segment). The original row is left
   as written; this entry supersedes it.
5. **R3 fixed without asking: both copies now say "in a later, not-started, closed or unresolved
   sprint".**
   - **Finding:** R3 — the list of sprints "the sprint cannot count on" left out a closed (Done or
     Cancelled) sprint, which `later_sprint_reason` reports as `sprint-closed`.
   - **What changed:** one phrase in each copy's `## How the board reads the IDs` intro.
   - **Why it qualified:** verified CORRECT (code table row 5, and a scratch board with Sprint 2 set to
     `✅ Done` gave `reason="sprint-closed"`); mechanical, one phrase; inside the plan, whose step 1
     documents the rules as the code applies them.
6. **R1 and R2 not fixed — returned NEEDS-DECISION.** The real fix changes the advice the owner set in
   the "Fix the advice" ruling: "ID + mark first, then the link" is right for a **hard** mark, but a
   **soft** mark written that way gets a false flag, because the link's path is a second mention with
   no `soft` in its segment. Choosing new advice is a judgment call, so no slug-bullet text was changed.
   Evidence (scratch board, real `dashboard.sh`, run `w-r12`): mark first then link — hard: record for
   soft, neutral and hard slugs; soft: neutral slug **record** (false flag), soft slug none, hard slug
   **record**. Mark after the link — soft neutral none; hard with a soft slug **no record** (quiet
   miss). Mark both after the ID and after the link — hard: record for every slug; soft: none, except a
   slug with the word `hard` (record, the safe direction).

No other fix was applied and no obvious-winner call was made this round.

7. **R1 and R2 fixed under the owner's ruling.** This was not my call.
   - **Ruling:** "Repeat mark after link (Rec)". Description: "ID + mark, link, mark again. Correct both
     ways. Knock-on: none (checked)." Given via `AskUserQuestion`, 2026-10-14, `fkit-lead` session,
     relayed to this worker by the driver. It supersedes decision 1's "Fix the advice" wording for
     this bullet.
   - **Finding:** R1 (the miss covers any link to the folder, not only one whose text is the ID) and
     R2 (a soft mark written before the link gets a false flag).
   - **What changed:** the slug bullet in both copies. It now names both link forms, says both read
     soft (the quiet direction), and says to write the ID and its mark, then the link, then the mark
     again. It adds that a slug containing `hard` still over-flags. The live copy uses `0110`, the
     scaffold copy `0042`.
   - **Evidence** (scratch board, real `dashboard.sh`, run `w-final`, the page's exact lines in both
     copies):
     - `[0110](../0110-make-it-soft/brief.md)` and `0110 ([brief](../0110-make-it-soft/brief.md))`
       give no record. So do the `0042` twins.
     - the hard example `… — hard, not soft ([brief](…make-it-soft…)) — hard, not soft` gives a
       record for `0110` and for `0042`.
     - its soft twin gives none (`0110`, `0042`), and so does a neutral-slug soft line (`0112`,
       `0043`).
     - a soft line with a `hard` slug gives a record (`0112`, `0043`): the safe over-flag the page
       names.
   - **Checks:**
     - `npm run generate:manifest`: against HEAD, still 3 added lines (0506's two, plus this path at
       `43cadd2d…`, which matches `shasum` of the scaffold copy).
     - `node --test test/structure-manifest.test.js test/dual-home-parity.test.js`: 14/14 pass.
     - `npm run test:docs`: 389/389 pass.
     - Full `npm test`: not run here; it is the lead's.

Review status: every finding is settled (R1, R2 and R3 are `✅ done`), and the ledger header is set to
`closed-out`.

## Verification
### A. Behaviour proof
I used a scratch board in the session scratchpad, not the repo: `scratchpad/0501/board.sh`, with the
cases files beside it.
- **Layout:** the dependents are on a `🔄` Sprint 1 board, and every blocker is open on a `🔲` Sprint 2
  board.
- **Runner:** the real `claude/skills/fkit-status/dashboard.sh`.
- **What I captured:** the `drift depends-on-later-sprint` facts.

Run 1 covers the generic shapes:
- the bold soft line gives no record, and its hard twin gives a record;
- a plain unmarked line gives a record;
- `software` and `Microsoft` give records, and `harden … ; soft` reads soft;
- `soft: 0110` gives a record, and `0110 (not soft)` gives none;
- the range `0485–0491` gives no record for its middle ID 0488;
- `0110 and 0112 — soft, not hard` gives a record for 0110 only;
- `110`, `T-0110`, `ADR-0047`, `2026-09-13` (with folders 0110, 0047 and 2026 present) and the
  no-folder `0999` give no record;
- an ID only after the closing `**` gives no record;
- an ID named twice, once soft and once unmarked, gives a record;
- the slug rows are as in decision 1.

Run 2 uses the page's exact example lines, in both copies:
- Live: `task 0072` bold soft gives none. `soft: 0110` gives a record. `0110 and 0112 — soft, not hard`
  gives a record for 0110 only. `0485–0491` gives none. `0110 (not soft)` gives none. The slug link
  gives none. The slug link with a mark after it gives none. The remedy form gives a record.
- Scaffold: `task 0044` bold soft gives none. `soft: 0042` gives a record. `0042 and 0043` gives a
  record for 0042 only. `0042–0045` gives records for the endpoints 0042 and 0045 only, not 0043 or
  0044, so the range is not expanded. `0042 (not soft)` gives none. `task 42` gives none. The slug
  link gives none. The slug link with a mark after it gives none. The remedy gives a record. The
  page's own `0042 (the API layer) and 0043 (its migration).` gives records for both.

Every example matches the page.

The `derive` facts (the Next step text) are unchanged by soft/hard marking, which confirms the
plan's finding 3.

### Plan step 5: the live slug briefs
Three backlog briefs link `0443` through a slug containing `hard`: `0444`, `0445` and `0455`, each
ending "Hard.". Through the reader all three give a record on `0443`. That is hard, as they intend.
**No finding.**

### B. Wording check
- Page, rule 2: "**To mark a dependency soft, write `— soft, not hard` after its ID** — the same
  marking `/fkit-task-brief` uses. A soft ID is skipped by the later-sprint check; anything not marked
  soft is read as **hard**."
- `/fkit-task-brief` §9 "Limits" (0494): "Only 4-digit IDs are read. An ID followed by
  `— soft, not hard` is skipped — **that marking is how to declare a soft dependency** so it is not
  warned about."

The two agree: same marking, same placement after the ID, same effect.

### C. Checks
- `node --test test/structure-manifest.test.js test/dual-home-parity.test.js`: 14/14 pass.
- `npm run test:docs`: 389/389 pass.
- `npm test` (full): exit 0. `node --test`: 1112/1112 pass. `prove-red.sh`: "hard gate PASSED", 43
  mutations, each red. This run started before this worklog existed. `npm run test:docs` was re-run
  after it was written (next line).
- `npm run test:docs` re-run with this worklog in place: 389/389 pass.
- `CHANGELOG.md`: checked by eye.

## Re-verify after review round 1 — 2026-10-14
Verify worker (spawned `fkit-coder`, caller `fkit-sprint-ship-loop` via `fkit-lead`). Wrote no source;
this section is the only edit.

**Ran:**
- `npm test` (full): exit 0. `node --test`: 1112/1112 pass (0 fail, 0 skipped). `prove-red.sh`:
  "hard gate PASSED", 43 mutations, each red.
- `npm run test:docs`: 389/389 pass. Run before this section was written; re-run after it (next line).
- `npm run test:docs` re-run with this section in place: see the last line below.
- Manifest: the scaffold copy's `shasum -a 256` is `43cadd2d5451c562c76a8b7d4130a386beb765f4df5b3b47ac25e5460533874e`,
  which matches the manifest line for `ai-agents/knowledge-base/conventions/dependency-declaration-form.md`.
  The older line (`74930dfa…`, the committed HEAD content) stays, as the history-keeping format expects.
- `diff` of the two `## How the board reads the IDs` sections (30 lines each): they differ only by the
  planned substitutions — heading without `(task 0492)`; IDs `0110`/`0112`/`0072` → `0042`/`0043`/`0044`
  (and the counter-example `110` → `42`, which follows from `0110` → `0042`); range `0485–0491` →
  `0042–0045`; the "(task `0492` review R1)" reference dropped, with the line re-wrapped. The R3 phrase
  ("closed") and the slug bullet are otherwise word-for-word the same in both.
- `plan.md` blob: `21a4e24d9ac3b01148f0a60eade3382c6c030856`, unchanged.

**Skipped:** nothing in the asked list. No new behaviour proof (scratch-board run) — round 1 changed
page wording only; the reader's behaviour for these examples was checked in round 1 (decision log above).
- `npm run test:docs` re-run with this section in place: 389/389 pass.
