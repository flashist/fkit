# Worklog — 0125: wiki SKILLs flag "task N ready to close"

- **Date:** 2026-07-27
- **Agent:** fkit-coder, as the Build worker of `/fkit-sprint-ship-loop` (sprint 2), under the driver's
  declared-approval marker (owner approved the plan live in the driver session; the coder spawn has no
  owner channel of its own — ADR-021).
- **Result:** implemented, then one review round applied (4 fixed, 1 subsumed). Three SKILLs changed:
  `ingest`/`lint` additions-only, `sync` `+42/-1` (the one deletion is R1's fix — see §3).
  Suite green at baseline, after round 1, and after the fix round: 523 pass / 0 fail.
- **No commit.** Everything left in the working tree.
- **Read §7–§8 for the current state**; §3–§5 are the round-1 record and their line numbers are stale.

---

## 1. THE BRIEF'S PREMISE WAS FALSE — read this before concluding anything was missed

> **Citation corrected 2026-07-27 (review finding R4).** An earlier revision of this section attributed
> the quoted phrase below to the brief's *"What to build"*. **That attribution was wrong** — the phrase
> appears **nowhere** in `brief.md`, in HEAD or the working tree. It came from the **sprint driver's
> spawn prompt**, which relayed the brief's framing in its own words. The disproof itself was never in
> question and still stands; only the source of the quote was mis-stated. Recording it because
> `evidence-before-assertion` applies to a **relayed** quote exactly as it does to a first-hand one —
> passing a claim along is not verifying it, and I cited it as though it were the brief's own text.

The **sprint driver's spawn prompt** asserted that the three wiki SKILLs **"currently end by closing, or
by implying they may close"**, and that they must be changed to flag instead. The brief's *"What to
build"* is looser but points the same way. **Neither was accurate.** Verified at plan time by execution:

```
grep -rn "task-done\|task-cancelled\|ready to close\|close\b\|mover" \
  claude/skills/fkit-wiki-ingest/ claude/skills/fkit-wiki-sync/ claude/skills/fkit-wiki-lint/
→ (no hits)
```

The three SKILLs contained **zero** mentions of a mover, of closing, or of a task, in any form. The
0108 investigation report independently recorded the same grep result on 2026-07-23
(`reports/2026-07-23-eval-wiki-task-completion-visible-to-the-board.md` §0: *"Grepped all three wiki
SKILLs … **zero** mentions of `task-done`, closing, or 'ready to close.'"*).

**Consequence for the shape of the work: this task was purely ADDITIVE, not corrective.** There was no
"closes the task" text to remove and no contradiction to repair. A reviewer reading the brief and then
the diff will see additions only, and must **not** conclude that a removal was forgotten. The finding
was relayed to the owner through the driver on 2026-07-27 and accepted.

Two related facts, also verified at plan time, that explain *why* nothing needed removing:

- **Task 0124 had already landed.** `claude/skills-for-role.sh` gives `wiki` no movers;
  `claude/scaffold/universal-rules.md:7` already read *"Only the producer may invoke them"*; and
  `claude/skills/fkit-team/SKILL.md:59-63` already stated producer-only.
- **No wiki-side system prompt ever claimed the close.** `claude/agents/fkit-wiki.md` was read in full
  and never mentions closing or a mover. This mattered because a fact in a system prompt outranks a
  SKILL in an agent's own context (the failure mode task 0142 is investigating) — here there was no such
  fact to contradict, so no agent-prompt edit was needed, and the brief's verification step 4 forbids
  one anyway.

## 2. Owner rulings — 2026-07-27

Both open decisions from the plan were put to the owner at the single plan-approval gate, in the driver
session via `AskUserQuestion`, and answered. Plan approved (option "Approve").

- **D1 — how the wiki identifies a completed task → Option B: caller-named PLUS a backlog scan.** The
  SKILL considers both a task the caller named *and* any brief under
  `ai-agents/tasks/backlog/*/brief.md` whose `## Owner` is `fkit-wiki` and whose `## Status` is not
  `✅ Done`. The owner accepted the argument that Option A (caller-named only) reproduces 0108 exactly —
  task 80 sat `🔄 In progress` for a week precisely because nobody named it. The doubt rule is kept
  verbatim: *fully → complete; in part or uncertain → **partial**; never resolve doubt as complete.*
- **D2 — the null line → KEEP.** A run completing no tracked task writes
  `No tracked task completed by this run.` Owner's reasoning matched the recommendation: silence cannot
  be told apart from a skipped check.

## 3. What changed

> **Superseded by §7's fix round — final numbers.** After the R1/R2/R5 fixes the surface is
> `+37/-0` (ingest), `+37/-0` (lint), `+42/-1` (sync). **The one deletion is real and is R1's:** sync's
> old *"report … and stop"* empty-delta line was replaced, so this change is **no longer purely additive
> in `sync`** — the round-1 "zero deletions" claim below held only before that fix. `ingest` and `lint`
> remain additions-only. The round-1 figures are kept as the record of that round.

Round 1, three files, `+30 / +30 / +31` lines, **zero deletions** (`git diff --numstat`):

| File | Where | What |
|---|---|---|
| `claude/skills/fkit-wiki-ingest/SKILL.md` | new list item **7**, after `6. **Report:** …` | flag block + `## Hard rules` bullet |
| `claude/skills/fkit-wiki-sync/SKILL.md` | new `## Step 9 — Flag any completed tracked task — close nothing` | flag block + `## Hard rules` bullet |
| `claude/skills/fkit-wiki-lint/SKILL.md` | new list item **8**, after `7. **Report** …`, before the `---` | flag block + `## Hard rules` bullet |

The flag block body is **byte-identical across all three** once leading indentation is normalized (two
are list items, one is a heading section). Verbatim text: see `plan.md` §3.

House style followed: ADRs are cited **bare** (`ADR-033`, `ADR-018`), no relative markdown links — the
convention already used in these files (`fkit-wiki-sync/SKILL.md:45` cites ADR-029 that way).

Canonical `claude/` sources only. The `.claude/` mirrors are gitignored (`.gitignore:17`) and refresh
on the next `fkit` launch; they were not touched and must not be used to verify.

## 4. Verification — actual output (ROUND 1)

> **These are round-1 numbers and line references, kept as that round's record. The fix round moved
> every line number in the table below.** For the current state — including the fail-closed uniformity
> proof that replaced check 4 — read **§8**. Do not cite this section's line numbers as current.

**Baseline, taken BEFORE any edit** (the plan flagged that it could not be run during the write-nothing
plan step, so a pre-existing failure must not be misattributed):

```
ℹ tests 523   ℹ suites 17   ℹ pass 523   ℹ fail 0   ℹ cancelled 0   ℹ skipped 0   ℹ todo 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

**After the three edits — identical:**

```
ℹ tests 523   ℹ suites 17   ℹ pass 523   ℹ fail 0   ℹ cancelled 0   ℹ skipped 0   ℹ todo 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

Note what this does and does not prove: **no test reads these SKILL bodies**, so a green suite here is a
regression guard only — it is *not* evidence that the convention itself is correct. See §6.

| Check | Expected | Actual |
|---|---|---|
| 1 — complete-flag line | 3 hits | 3 (`lint:75`, `sync:107`, `ingest:66`) |
| 2 — partial-flag line | 3 hits | 3 (`ingest:67`, `lint:76`, `sync:108`) |
| 3 — hard-rule bullet | 3 hits | 3 (`sync:123`, `lint:225`, `ingest:84`) |
| 4 — block uniformity | `UNIFORM` | `UNIFORM`; 26 lines extracted from each file, both pairwise diffs empty |
| 5 — no mover invocation | every hit benign | 9 hits, 3 per file, each read by eye — see below |
| 6 — suite | baseline | 523/523, hard gate passed |
| 7 — change surface | 3 files | **deviation — see §5** |

**Check 5, every hit read by eye.** Three per file, all benign:

- `ingest:52` / `sync:93` / `lint:61` — *"(`/fkit-task-done`, `/fkit-task-cancelled`) are the
  **producer's alone** — the wiki does not hold them"*. A **negation**, not an invocation.
- `ingest:66` / `sync:107` / `lint:75` — inside the backticked flag string, naming *who* runs the mover
  (the producer). Report text the wiki prints, not an action it takes.
- `ingest:76` / `sync:117` / `lint:85` — the routing line
  `@fkit-producer Run /fkit-task-done on <brief path>`, an instruction to the **caller** to route the
  close. Not the wiki invoking anything.

No hit instructs the wiki to invoke a mover. Brief verification step 2 satisfied.

## 5. Two deviations from the plan, both recorded rather than smoothed over

**(a) Check 4's regex was wrong in the approved plan, and it would have failed OPEN.** As written the
start anchor was `/The wiki \*\*closes nothing/` — literally `The wiki **closes nothing`. The block's
real text is `**The wiki closes nothing`, with the `**` *before* "The wiki". The anchor therefore
matched **zero lines**, and `sed` would have produced three empty files, whose pairwise diffs are
trivially equal — printing `UNIFORM` while checking nothing. Demonstrated at build time (`wc -l` on the
plan's literal regex returned `0`), then corrected to `/\*\*The wiki closes nothing/`, which extracts 26
lines from each file. The corrected form is what `plan.md` §5 now carries, with a note. This was a
mechanical fix to tooling inside the approved plan's intent, not a scope change.

**(b) Check 7 could not pass as written, and the reason is not this task.** The plan expected *"exactly
three files changed"*. `git status --porcelain` shows roughly 40 modified and 10 untracked paths —
sprint-plan, wiki-vault, dashboard, and other task artifacts. **None of those are mine.** What is
verifiable: `git diff --numstat` on the three SKILLs shows `30/0`, `30/0`, `31/0` — additions only, no
deletions, in exactly the three files in scope. The 0125 brief's own `## Status` flip from `🔲 Backlog`
to `🔄 In progress` is likewise **not mine** — it already read `🔄 In progress` when the brief was first
read during the plan step, so it predates this build. **Attribution supplied by the driver on
2026-07-27, after this section was first written: the flip was the sprint driver's**, which marks a task
In progress in both the brief and the board row when it begins driving it. Recorded now that it is
known, rather than left unattributed. I have **not** established who made the *other* ~40 changes and do
not assert it; the honest statement is that the working tree was already dirty when this build step
began, so check 7 verifies my change surface but cannot verify the tree's cleanliness.

## 6. Carried forward — the gap this task does NOT close

**This convention is prose only. Nothing enforces it.** Verified: the ADR-018 skill-ownership hook reads
only the stdin payload (`payload="$(cat)"`) and sources `claude/skills-for-role.sh` — it **never opens a
`SKILL.md`**, so no hook change could enforce this. And no test reads these files' bodies
(`grep -rn "fkit-wiki-ingest\|fkit-wiki-sync\|fkit-wiki-lint" test/` returns only skill-**name** arrays
at `test/skill-ownership-hook.test.js:302,331`). **If a future edit deletes the flag block, nothing goes
red and nothing complains.**

**No guard test was added, deliberately** — the brief's verification step 4 restricts this task to the
three SKILL texts. **Follow-up for the producer to file:** a small `test/wiki-flag-convention.test.js`
asserting the verbatim flag line and the hard-rule bullet in all three files, in the spirit of task
0152's SKILL H1 guard. This is precisely the class of gap task **0142** is investigating (a fact of
record living in prose that no checklist or test sees).

**Also not closed, and named in the plan:** the spawned-consult loss. When the wiki runs as a spawned
consult mid-flow, its flag rides the return and a summarizing caller can drop it (0108 report §3). The
block's *"these lines are the last thing in the report; a caller who summarizes carries them verbatim"*
reduces the miss rate but does not close it structurally.

---

## 7. Review round 1 — five findings, four fixed, one subsumed (2026-07-27)

Stateful review ledger: `review.md`. Verdict was **⚠️ changes requested, 5 defects, none blocking**,
with **FULL Codex coverage** (`codex-cli 0.145.0`) — not a degraded review. The reviewer independently
re-ran all seven §5 checks, re-grepped HEAD with a *wider* regex than mine and **confirmed the premise
disproof**, confirmed the byte-identical claim was honest rather than looser than stated, and disproved
one Codex finding rather than deferring to it. My verdicts on all five: **CORRECT**. Dispositions on
R1/R2/R3/R5 were ruled by the owner via `AskUserQuestion` in the driver session, same date.

**R1 (medium) — FIXED.** `fkit-wiki-sync/SKILL.md:52`. The empty-delta exit read *"report … and stop"*,
which bypasses Steps 4–9 — including the new Step 9 — so an **idle sync emitted no flag line at all**,
not even the null line D2 was kept for, and the Option B scan never ran. That is the precise path 0108
arose from (six batched syncs). Now: *"skip Steps 4–8 and go straight to Step 9"*, with the rationale in
place. **Deliberately not widened:** Steps 4–8 (including the Step 7 watermark write) were *already*
skipped on this path before my change; I preserved that rather than silently altering watermark
behavior on the empty-delta path, which is outside this task.

**R2 (medium) — FIXED, the reviewer's shape.** The consideration set gave no outcome for a brief
**unrelated** to the run, and *"not certain → partial"* swallowed them — so every run would have emitted
`Task N: partial — not ready to close` for 0126, 0141 and 0148 in perpetuity, while the null line's
*"if this run completed no tracked task"* condition fired simultaneously. The rule is now **three**
outcomes, the third being **unrelated → say nothing about it at all**, with an explicit anti-conflation
sentence (*a brief is not "uncertain" merely because you read it*); the null line is rescoped to
**"if that produced no lines at all"**, which removes the collision.

> **This also falsifies my own `plan.md` §6 risk 7**, which claimed the null line "keeps the common case
> one line". Under Option B as originally written the common case was *three* partial lines, not one.
> Left in `plan.md` as written and corrected here rather than edited away — the plan is the record of
> what was approved, and the error is more useful visible.

**R3 (low) — SUBSUMED by owner ruling, not fixed.** Confirmed on both counts: `sed 's/^ *//'` erases
relative nesting, and `diff && diff && echo UNIFORM` prints on an empty extraction. Owner ruled a real
test beats a better one-shot grep, so `plan.md` check 4 is unchanged. **Recorded in the ledger's
Accepted residuals.** It was not left unmitigated for this round — see §8.

**R4 (low) — FIXED.** Citation error in §1 of this worklog; corrected in place, see the note there.

**R5 (low) — FIXED, one clause.** The Then-stop list omitted *spawning the producer*, while the next
clause handed over a ready-to-run `@fkit-producer Run /fkit-task-done on <brief path>` inside a step the
wiki executes — and the ADR-018 hook gates the `Skill` tool by `agent_type`, so a wiki-**spawned**
producer's mover call is **allowed**. Appended *"and do not spawn the producer to close it yourself"*
and sharpened the routing clause to *"the **caller's** next move, **not yours**"*. **Scope held to one
clause: this is instruction clarity in new text, NOT a reopening of ADR-033's accepted laundering
residual.** No permission, hook, or policy changed.

## 8. Re-verification after the fix round — and the fail-closed uniformity proof

The R2/R5 edits landed in **three separate files**, which is exactly the condition under which the three
copies drift. Uniformity was therefore re-proved by a purpose-built **fail-closed** harness instead of
the fail-open check 4:

- extraction must be **non-empty** and at least 33 lines, or the run aborts non-zero;
- each block must contain the R2 branch, the rescoped null line, and the R5 clause;
- `ingest` vs `lint` compared **raw**, byte-for-byte, **indentation included**;
- `sync` compared by **re-adding** the uniform 3-space list prefix to every non-blank line — this
  **preserves relative nesting**, so a broken continuation indent fails, which is precisely what
  `sed 's/^ *//'` could not catch;
- a **negative control**: a one-word mutation must be detected, or the harness reports itself broken.

```
  ingest  34 lines
  sync    34 lines
  lint    34 lines
  ingest == lint    : raw byte-identical
  sync  == ingest   : identical after re-adding the uniform 3-space prefix
  negative control  : a 1-word mutation IS detected (harness fails closed)
UNIFORM (fail-closed: extraction non-empty, >=33 lines, nesting preserved, control fired)
exit=0
```

**The harness fired against me once, and that is worth recording.** Its first run reported `NOT UNIFORM`
on the per-file step heading (`7.` / `8.` / `## Step 9`) — an **intentional** difference the plan scopes
out of the identity claim. Corrected to compare **bodies** (drop line 1). A check that had passed at
that moment would have been the fail-open failure all over again.

**This harness is a one-off, in the session scratchpad. It is NOT committed and NOT a test.** The
committed fix remains the named `test/wiki-flag-convention.test.js` follow-up for the producer to file.

Other checks re-run after the fixes: check 1 = 1 hit per file (3 total); check 2 = 3; check 3 = 3; the
new R5 clause = 3; the R2 branch and rescoped null line = 3 each; check 5 = 9 mover mentions, still 3
per file in the same three benign categories (negation / flag string naming the producer / routing line
addressed to the caller) — **none authorizes the wiki to invoke or spawn anything**; check 6 =
523 pass / 0 fail, hard gate passed, unchanged from baseline; check 7 = the same three SKILLs plus this
task folder's artifacts. Lint's list nesting and the `---` boundary re-inspected and intact.

**No fix in this round broke another check.**
