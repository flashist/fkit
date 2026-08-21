# Worklog — 0198: teach `/fkit-record-decision` the dated correction-note form

- **Date:** 2026-08-15
- **Actor:** fkit-coder (Build worker, spawned by `fkit-sprint-ship-loop` under the declared-approval
  marker; owner approved the plan 2026-08-15 via `AskUserQuestion` in the driver session — flags A and
  B in scope, C out).
- **Plan:** `plan.md` in this folder (driver-written at approval; blob
  `74fbdc4dec2681982b124e02df760fa0573f663c`, 12892 bytes — re-verified with `git hash-object` /
  `wc -c` before implementing).

## What was done

One file edited: `claude/skills/fkit-record-decision/SKILL.md` (canonical source; the gitignored
`.claude/skills/` copy is now stale until `claude/fkit-claude-init.sh .` is re-run — mechanical
post-step, not part of this diff).

Two pure insertions, +91 lines total, zero deletions:

1. **Signpost blockquote** (3 lines) after the `> **Boundaries.**` blockquote, before `## Step 1`:
   points a corrector past Steps 1–4 to the new section.
2. **New section `## Correcting an accepted ADR — the dated correction note`** appended after Step 4
   (88 lines). Covers, per the approved plan: when to use / NOT to use (Status stays `accepted`; the
   likely-wrong `superseded` move; reversal = new ADR plus ⛔ notice; not a licence to edit); the
   three-part shape (drift note ⚠️, reversal notice ⛔, `- **Corrections:**` header bullet); the
   two-marker legend with both verbatim glosses and the explicit no-third-marker + mismark warning;
   the left-byte-identical clause with the `+N / −0` proof commands (`git diff --numstat`,
   `git diff -U0 … | grep '^-'`) and the 0195 snapshot caveat (`git diff --no-index`); below-the-claim
   placement with the R1 rationale as prose (departs from the vault's "banner above claim"; detaches /
   already-warned-by-header argument); the header bullet's form (one metadata item, may wrap, carries
   the legend, the stated append-only exception, 0195's continuation-line extension precedent);
   indentation-follows-the-claim (continuation indent under list items, column 0 under top-level
   prose, and why indent-0 is not sloppy); cross-reference-don't-restate with the shipped wording
   quoted ("deliberately not restated here, so there is one place to keep true rather than two");
   the worked example named in prose — ADR-010, task 0143 (first application), task 0195 (second,
   per flag B) — no relative links; and the two flag-A auxiliary rules (dated present-tense with a
   verification date; file + quoted phrase, no `:NNN` citations).

Flag C honored by omission: frontmatter `description:` untouched (frontmatter untouched entirely).

## Verification (commands run, raw output)

Pre-checks:

```
$ test -e claude/scaffold/skills && echo STOP || echo clear
clear
$ shasum claude/skills/fkit-record-decision/SKILL.md   # pre-edit baseline
3c064bad0c104a21c9df877db4e8427c3462f78f  claude/skills/fkit-record-decision/SKILL.md
$ git diff --stat -- claude/skills/fkit-record-decision/SKILL.md   # pre-edit
(empty — file was unmodified at baseline)
```

Plan step 1 — one file, section present:

```
$ git diff --stat -- claude/skills/fkit-record-decision/SKILL.md
 claude/skills/fkit-record-decision/SKILL.md | 91 +++++++++++++++++++++++++++++
 1 file changed, 91 insertions(+)
$ grep -n '^## Correcting an accepted ADR' claude/skills/fkit-record-decision/SKILL.md
170:## Correcting an accepted ADR — the dated correction note
```

Plan step 2 — anchor greps (all hit; line numbers from the batch run):

```
$ grep -n 'left byte-identical\|+N / −0\|--numstat\|banner above claim\|one metadata item\|column 0\|one place to keep true\|- \*\*Corrections:\*\*' claude/skills/fkit-record-decision/SKILL.md
190:3. A header **`- **Corrections:**`** metadata bullet, listing the annotated sites.
202:Every note states that the corrected text is **left byte-identical**. Prove the `+N / −0` shape with
206:git diff --numstat -- <adr-file>          # expect "N  0  <adr-file>"
217:"banner above claim" convention: a block above a bullet visually **detaches** from the claim it
219:**warned** first by the header `- **Corrections:**` bullet, so below-placement costs no warning.
223:`- **Corrections:**` is **one metadata item** that **may wrap** across physical lines. It carries the
233:item's continuation indent; a claim in **top-level prose** takes **column 0**. An indented note under
241:not restated here, so there is one place to keep true rather than two."* Restating creates two copies
$ grep -n 'a fact that drifted (the decision is untouched)' …/SKILL.md
194:- ⚠️ = a fact that drifted (the decision is untouched)
$ grep -n 'a decision that was overturned (do not follow it)' …/SKILL.md
195:- ⛔ = a decision that was overturned (do not follow it)
```

`drift note` (187), `reversal notice` (188), `no third marker` (197), `-U0` (207), `may wrap` (223),
`indentation matches` (232), `top-level prose` (233, 247), `warned` (219), `below`/`detaches`
(214–217) — all present in the batch grep output.

Plan steps 3–6:

```
$ grep -n 'detaches' …/SKILL.md                       # rationale as prose
217:"banner above claim" convention: a block above a bullet visually **detaches** from the claim it
$ grep -n 'stays `accepted`' …/SKILL.md
177:- A correction annotates a stale claim inside an ADR whose **Status stays `accepted`**. …
$ grep -n 'not a licence to edit\|new ADR plus' …/SKILL.md
180:… **new ADR plus a ⛔ notice**
182:- It is **not a licence to edit** ADR prose. …
$ grep -n '0143\|adr-010\|ADR-010\|0195' …/SKILL.md
210, 226, 244–247, 250, 255 — all three names present
$ grep -n 'deliberately\|on purpose' …/SKILL.md
214, 216, 240 — cross-reference "on purpose" + quoted shipped wording
```

Step 6a/6b eyeball: read ADR-010 lines 105–121 (the 0195 §Context ⚠️ block — indent 0, top-level
prose, carries "left byte-identical" and the exact wording "deliberately **not** restated here, so
there is one place to keep true rather than two") and lines 8–12 (the `- **Corrections:**` bullet —
one wrapping metadata item with the legend and the "Extended 2026-08-02 by a second append"
continuation). The new section's descriptions and quote match the shipped blocks.

Plan step 7 — pure insertion, proved by diff (twice):

```
$ git diff -U0 -- claude/skills/fkit-record-decision/SKILL.md | grep '^-[^-]'
(empty; exit 1)
$ git diff --numstat -- claude/skills/fkit-record-decision/SKILL.md
91	0	claude/skills/fkit-record-decision/SKILL.md
$ git diff --no-index --numstat <pre-edit snapshot> claude/skills/fkit-record-decision/SKILL.md
91	0	…   # snapshot proof per the 0195 caveat (tree was clean on this file anyway)
```

Steps 1–4 and the ADR template are therefore byte-untouched (zero `-` lines), except that the
signpost insertion sits *between* the Boundaries blockquote and Step 1 — an addition, not an edit.

Plan step 8 — `npm test` (`node --test test/*.test.js && bash test/prove-red.sh`):

Full suite green, exit code 0. Raw tails:

```
$ npm test          # background run, completed exit 0; tail -15 kept the prove-red end:
…
22. ✓ Released headline unreachable — "0288/default-released" should go RED ... red

✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.

[exited with code 0]

$ npm run test:unit   # re-run to capture the unit-phase count the tail cut off:
ℹ tests 730
ℹ suites 17
ℹ pass 730
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 71938.425208
```

⚠️ **Baseline drift, reported not hidden:** the plan expected "560 pass per 0195's worklog"; the
suite now reports **730 pass / 0 fail** — it has grown since 0195's baseline (later tasks added
tests; prove-red's own index now lists 22 mutations incl. 0288-series). Zero failures, so this is a
stale expected-count in the plan, not a regression. As the plan requires stating: no test asserts on
this file's BODY — 0152's H1 guard is still in backlog; `test/skill-frontmatter.test.js` covers
frontmatter only, which this edit does not touch. Green is a regression check, not evidence the
section is correct; the greps above are that evidence.

Run notes: the first `npm test` was piped through `tail -15`, so its unit-phase count was lost and
`test:unit` was re-run solo for it. A second, unrelated `prove-red.sh` process from another session
ran concurrently with the first run; the run nevertheless completed exit 0 with the hard gate
PASSED, and the solo `test:unit` re-run (730/0) confirms independently.

Plan step 9 — guarded directories, baseline-relative:

```
$ git status --porcelain ai-agents/knowledge-base/decisions/ ai-agents/wiki-vault/  (pre & post)
$ diff baseline-status.txt post-status.txt
no delta vs baseline   (4 pre-existing entries, unchanged)
```

No commit made. No task file moved. No `## Status` changed.

## Decision log (unattended-fix / obvious-winner audit, per ADR-019/ADR-032)

- **none.** No review fixes applied (this is the Build step, no review yet) and no obvious-winner
  call made — every content and placement choice was specified by the approved plan; flags A/B/C were
  ruled by the owner before the spawn.

---

# Round 2 — process the stateful review (2026-08-15)

- **Actor:** fkit-coder (Process-review worker, spawned by `fkit-sprint-ship-loop` under the
  declared-approval marker).
- **Input:** the *Reviewer findings* section of this folder's `review.md` (round 1: `R1`–`R5`).
- **Owner dispositions**, given live via `AskUserQuestion` in the driver session 2026-08-15, verbatim
  option labels: `R1`+`R2` → **"Fix both (Recommended)"**; `R4`+`R5` → **"R5 now, R4 follow-up
  (Recommended)"**; `R3` → **"Narrow it now (Recommended)"**.
- **File touched:** `claude/skills/fkit-record-decision/SKILL.md` only. Diff vs `HEAD` grew from
  `91 / 0` to **`111 / 0`** — still a pure insertion, so Steps 1–4, the ADR template and the
  frontmatter remain byte-untouched across both rounds.

## Decision log (unattended-fix / obvious-winner audit, per ADR-019/ADR-032)

Four fixes applied without a per-fix approval round. **All four were ruled in by the owner before this
spawn**, so none rests on this worker's discretion; each is recorded with the finding it answers, what
changed, and why it qualified.

1. **Answers `R1`** (deletion guard misses deleted markdown list lines). **Changed:** the prescribed
   proof command in the *Append-only, proved by diff* block, from
   `git diff -U0 -- <adr-file> | grep '^-[^-]'` to `git diff -U0 -- <adr-file> | grep '^-' | grep -v '^---'`,
   plus a ⚠️ paragraph naming the weak form and its mechanism. **Why it qualified:** verified `CORRECT`
   by reproduction in a scratch repo (in-place edit of a `- **Corrections:**` bullet → old guard empty,
   new guard catches it); mechanical and localized to one code block plus one adjacent paragraph; and
   explicitly owner-ruled ("Fix both"). The explanatory paragraph is inside the ruling's intent — the
   defect *was* a ratified command being rewritten weaker, so recording why prevents the same
   regression.
2. **Answers `R2`** (`0195` snapshot caveat encoded as an unfiltered eyeball diff). **Changed:** the
   one-sentence caveat became a two-command proof block —
   `git diff --no-index --numstat <snapshot> <adr-file>` (expect `N  0`) and
   `diff <snapshot> <adr-file> | grep '^<'` (expect no output) — with a sentence on why the
   working-tree diff cannot see it and an instruction to snapshot before editing. **Why it qualified:**
   verified `CORRECT` twice — the cited `0195` worklog text matches, and the failure reproduced in a
   scratch repo (`--numstat` → `4  0` with the deletion present); owner-ruled ("Fix both"); scoped to
   the same paragraph. Size is ~4 lines beyond the ruling's own "~4 lines" estimate.
3. **Answers `R3`** (supersession scope over-broad). **Changed:** *"state that they are superseded by
   the new lines"* → name **which part** is superseded, quoting shipped ADR-010's site-list wording,
   plus an explicit "the legend / no-edit assertion / `accepted` statement stay binding" clause.
   **Why it qualified:** verified `CORRECT` against the live ADR-010 header; owner-ruled ("Narrow it
   now"); a single-sentence rewrite inside the section this task authored.
4. **Answers `R5`** (no closing hand-off; corrected ADR leaves its wiki page stale). **Changed:** added
   a closing *"Hand off when you are done"* paragraph at the end of the new section — report the
   annotated sites and proof figures, recommend **fkit-wiki** re-ingest, restate "no commits". **Why it
   qualified:** premise verified live (vault holds ADR-010 material; task `0199` exists in backlog for
   this exact resync); owner-ruled IN ("R5 now"). **Deliberately narrow:** the owner ruled a *hand-off
   sentence* in, not a full Step-5 closing procedure, so this is a short paragraph, not a new numbered
   step.

**Obvious-winner calls made without asking: none.** Every applied change traces to an explicit owner
disposition.

**Deliberately NOT applied (recorded so it is not mistaken for an oversight):**

- **`R4`** — owner-ruled out of scope for `0198`; proposed brief below, needs a producer to file it.
- **A residual in `R1`'s own ratified fix** — `grep '^-' | grep -v '^---'` drops a deleted line whose
  text begins with `---` (markdown horizontal rule, YAML delimiter). Real but narrower than `R1`;
  hardening it is a frontier-move outside the approved plan and outside the owner's ruling, which named
  this exact command. Recorded in `review.md`'s *Coder response* as a known residual.

## Round 2 verification

Run with `R1`'s **corrected** command, not the approved plan's verification step 7 (which prescribes
the defective `grep '^-[^-]'` — the very command `R1` found wrong and the owner ruled fixed):

```
$ git diff --numstat -- claude/skills/fkit-record-decision/SKILL.md
111     0       claude/skills/fkit-record-decision/SKILL.md

$ git diff -U0 -- claude/skills/fkit-record-decision/SKILL.md | grep '^-' | grep -v '^---'
(empty)

$ git status --porcelain ai-agents/knowledge-base/decisions/ ai-agents/wiki-vault/
(4 pre-existing entries, identical to the round-1 baseline — no new entry)
```

Anchor greps for the four fixes all hit: `grep -v '^---'` (`:207`, `:213`), `no-index --numstat`
(`:222`), `diff <snapshot> … grep '^<'` (`:223`), *"site list in the first line"* (`:240`), *"still
binding"* (`:243`), *"fkit-wiki** re-ingest"* (`:275`).

**`npm test` (round 2, full suite — `node --test test/*.test.js && bash test/prove-red.sh`):**

**PASS — exit code 0, 730/730, zero failures.** Full output captured to a file (not piped) so the
node summary block survived; both phases below are raw from that file.

```
ℹ tests 730
ℹ suites 17
ℹ pass 730
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 83760.304042

…
22. ✓ Released headline unreachable — "0288/default-released" should go RED ... red

✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
EXIT=0
```

Identical to round 1's count (730 pass / 0 fail, 22-mutation prove-red gate) — **no regression from
this round's edit.** The plan's "560 pass" figure remains a stale expected-count, already disclosed in
round 1.

⚠️ Unchanged from round 1 and still true: **no test asserts on this file's body.** `0152`'s H1
house-style guard is still in backlog; `test/skill-frontmatter.test.js` is frontmatter-only and this
edit does not touch frontmatter. A green suite is a regression check, not evidence the section is
correct — the reproductions and greps above are that evidence.

No commit. No task file moved. No `## Status` changed. The gitignored `.claude/skills/` copy is stale
until `claude/fkit-claude-init.sh .` is re-run (mechanical post-step, not part of this diff).

---

## Proposed follow-up brief (R4) — NOT FILED; needs a producer

⚠️ This block is **a proposal, not a task file.** This worker may not invoke `/fkit-task-brief`
(producer-owned, hook-enforced per ADR-018/ADR-033). A **producer** must file it into
`ai-agents/tasks/backlog/` with a real task number.

**Title:** Specify the `- **Corrections:**` header item's own date and its position among ADR metadata

**Priority:** low

**Context.** Task `0198` taught `/fkit-record-decision` the dated correction-note form. Round-1 review
finding `R4` (see
`ai-agents/tasks/backlog/0198-teach-record-decision-the-dated-correction-note-form/review.md`) is
verified `CORRECT` but was ruled **out of `0198`'s scope** by the owner on 2026-08-15 and routed here.
The gap: the new section describes the `- **Corrections:**` header bullet's *form* (one wrappable
metadata item, carries the legend, append-only exception) but never states (a) that the item carries
**its own date**, nor (b) **where** it sits among the ADR's metadata bullets. The section's auxiliary
dating rule speaks of *"Notes"*, which does not plainly reach a header metadata item. A future agent
can follow the procedure exactly and emit an **undated** Corrections bullet, or place it above
`- **Status:**`, and nothing in the skill would flag it.

**Ground truth to encode.** Shipped ADR-010
(`adr-010-role-locked-sessions-and-skill-lockdown.md`) has `- **Corrections:** 2026-08-02 — …` placed
**last** in the metadata block, immediately after `- **Supersedes:**`. Cite it by file + quoted phrase,
never `:NNN` (the `Citation form` residual ratified in task `0143`).

**What to build.** In `claude/skills/fkit-record-decision/SKILL.md` — canonical source only, **never**
`.claude/skills/…` — extend the *"The header bullet's form"* paragraph of §*"Correcting an accepted
ADR — the dated correction note"* with two short statements: the item **opens with the correction's
date** in the shipped `- **Corrections:** YYYY-MM-DD — …` shape; and it is placed **last among the
metadata bullets, immediately after `- **Supersedes:**`** (or after `- **Deciders:**` when the ADR
supersedes nothing). Keep the existing `0143`/`0195`-ratified content byte-identical; this is an
extension, not a rewrite. Do **not** touch Steps 1–4, the ADR template, or the frontmatter. Do not
edit any ADR.

**Verification.**
1. `git diff --numstat -- claude/skills/fkit-record-decision/SKILL.md` → `N  0` (pure insertion).
2. `git diff -U0 -- claude/skills/fkit-record-decision/SKILL.md | grep '^-' | grep -v '^---'` → empty.
   **Use this form, not `grep '^-[^-]'`** — see finding `R1`.
3. `grep -n 'Corrections' claude/skills/fkit-record-decision/SKILL.md` shows the new date and position
   statements.
4. Read the new text against ADR-010's shipped header block and confirm it describes what actually
   ships.
5. `npm test` green. Note in the report that **no test asserts on this file's body** unless task
   `0152`'s H1 guard has landed by then.
6. `git status --porcelain ai-agents/knowledge-base/decisions/ ai-agents/wiki-vault/` shows no new
   entry versus the pre-edit baseline. No commit.

**Dependency / note.** Independent of `0199` (the ADR-010 vault resync). Blocked by nothing. If the
producer prefers, this can be folded into any later pass that edits this same section rather than
shipped alone.
