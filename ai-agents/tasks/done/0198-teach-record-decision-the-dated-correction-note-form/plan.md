# Implementation plan — 0198: teach `/fkit-record-decision` the dated-correction-note form

Planning-only spawn honored: nothing written to disk. All grounding artifacts read first-hand: the brief, the live `claude/skills/fkit-record-decision/SKILL.md` (165 lines, four steps, no notion of amending — confirmed), `0143`'s `worklog.md` + `review.md` (incl. residuals `R1-placement`, `R5-header-form`, `Citation form`), `0195`'s `worklog.md`, and the live ADR-010 with all five shipped notes.

## Pre-verified facts (recorded now; re-check at implementation time per the brief)

- **Not dual-homed — re-verified 2026-08-15:** `ls claude/scaffold/` → `AGENTS.md CLAUDE.md ai-agents universal-rules.md`. **No skills directory.** The implementation step still re-runs `test -e claude/scaffold/skills` before editing.
- **Pieces 6 and 7 verified first-hand against live ADR-010, not inherited:** the `0195` §Context ⚠️ block sits at **indent 0** (its annotated passage is top-level prose) while the §Decision 3 and §Decision 5 blocks are indented 3 spaces under their list items and the `0143` §Context blocks 2 spaces under their bullet; the §Context block carries *"The binding statement is §Decision 5, which carries its own ⚠️ notice … deliberately **not** restated here, so there is one place to keep true rather than two."*
- **Brief's step-8 caveat resolved:** the SKILL.md H1 house-style guard does **not exist** — task `0152-guard-test-for-skill-md-h1-house-style` is still in `ai-agents/tasks/backlog/`. The only skill-file test is `test/skill-frontmatter.test.js` (task 0136): **frontmatter-only**, `EXPECTED_SKILLS = 26` exact count. A body-only edit cannot trip it; no skill is added, so the count holds. The implementation report must say "no body guard exists" rather than claim guard coverage.

## Files touched — exactly one

`claude/skills/fkit-record-decision/SKILL.md` (canonical source). **Never** `.claude/skills/…` (gitignored refresh copy) and **never** any file under `ai-agents/knowledge-base/decisions/` or `ai-agents/wiki-vault/`. No commit; edit left in the working tree.

## Placement — new top-level section + one signpost, NOT a "Step 5"

1. **Signpost blockquote** inserted immediately after the existing `> **Boundaries.**` blockquote (before `## Step 1`), ~3 lines: *"**Correcting an existing ADR, not recording a new one?** Skip Steps 1–4 — they assume a new ADR — and use §'Correcting an accepted ADR — the dated correction note' below."*
2. **New section `## Correcting an accepted ADR — the dated correction note`** appended after Step 4, at the end of the file.

**Reason (the brief requires the choice be stated):** Steps 1–4 are a new-ADR sequence the brief fences off; a "Step 5" would read as part of that sequence and — as the brief itself warns — be easy to miss by someone who opened the skill to *correct*. A standalone section keeps the diff to the fenced steps at zero, and the signpost at the entry point is what makes it reachable; it is the "cross-reference the new section needs" that verification step 7 permits. Pure insertions both — `git diff -U0` will show zero `-` lines.

## Section content — how each of the seven pieces lands (with grep anchors)

Estimated +75–95 lines. Sub-structure and load-bearing phrases (chosen so verification step 2's greps are deterministic):

1. **When to use / when NOT to** (opens the section — brief's "say what it is NOT for" + Status rule):
   - A correction annotates a stale claim inside an ADR that **stays `accepted`** — *"the single most likely wrong move is marking it `superseded`"* stated in those terms. Anchor: `stays \`accepted\``, `superseded`.
   - NOT for a genuine reversal of the whole ADR (that is a **new ADR plus a ⛔ notice pointing at it**), and **not a licence to edit ADR prose**. Anchor: `new ADR`, `⛔ notice`, `not a licence to edit`.
2. **Piece 1 — the three-part shape:** a **drift note** (⚠️ blockquote), a **reversal notice** (⛔ blockquote), and a header **`- **Corrections:**`** metadata bullet. Anchors: `drift note`, `reversal notice`, `- **Corrections:**`.
3. **Piece 2 — the two-marker legend, and only two:** verbatim glosses *"⚠️ = a fact that drifted (the decision is untouched)"*, *"⛔ = a decision that was overturned (do not follow it)"*, plus the mismark warning (a drift marked ⛔ tells readers to stop following a decision that stands) and an explicit **no third marker**. Anchors: both glosses; `no third marker`.
4. **Piece 3 — the "left byte-identical" clause + the `+N / −0` proof:** every note states the corrected text is **left byte-identical**; the constraint is proved **by diff, not by eye** with the two commands verbatim: `git diff --numstat` and `git diff -U0 … | grep '^-'`. One caveat sentence from `0195`: when earlier uncommitted appends sit on the same file, prove against a pre-edit snapshot as well (`git diff --no-index`). Anchors: `left byte-identical`, `+N / −0`, `--numstat`, `-U0`.
5. **Piece 4 — below-the-claim placement WITH its rationale as prose** (`R1-placement`, owner-ruled): the note goes **below** the claim it corrects; this **deliberately departs from the wiki vault's "banner above claim" convention**; rationale carried in full: a block above a bullet visually **detaches** from the claim it annotates and reads as section preamble, breaking the narrative — and the reader is **already warned first by the header `- **Corrections:**` bullet**, so below-placement costs no warning. Anchors: `below`, `banner above claim`, `detaches`, `warned`.
6. **Piece 5 — the header bullet's form** (`R5-header-form`, ratified): **one metadata item that may wrap** across physical lines; carries the ⚠️/⛔ **legend** plus the list of annotated sites; and the stated **append-only exception**: it is the one part of an `accepted` ADR an append-only correction may extend, because it is metadata *about* the notes, not body text. Includes `0195`'s extension precedent: a later pass **appends continuation lines** to the same item, leaving prior lines byte-identical and stating they are superseded. Anchors: `one metadata item`, `may wrap`, `append`, `legend`.
7. **Piece 6 — indentation follows the claim; prose gets indent 0:** the note's indentation **matches the block it sits under** — a claim inside a list item means the item's continuation indent; **top-level prose means column 0**. Names why: an indented note under prose renders inside the wrong list; an indent-0 note is not sloppy. Anchors: `indentation matches`, `column 0`, `top-level prose`.
8. **Piece 7 — cross-reference, do not restate:** when two sites share a fact, **one site carries the fact, every other site points at it, and the pointing note says it is pointing on purpose** — quoting the shipped wording *"deliberately not restated here, so there is one place to keep true rather than two."* Anchors: `one place to keep true`, `on purpose` / `deliberately not restated`.
9. **Worked example, by name:** ADR-010 (`ai-agents/knowledge-base/decisions/adr-010-…`) carries all five shipped notes; **task `0143`** established the form (first application), **task `0195`** generalized it (second application — indent-0 and cross-reference). Named as prose, **not relative links** — this skill ships into consuming projects where those paths do not exist (edge case: the current skill already makes repo-specific references in prose, e.g. the 2026-07-19 collision, so this matches its idiom). Anchors: `0143`, `ADR-010`, `0195`.
10. **Two auxiliary form elements, flagged for approval (beyond the seven, both ratified residuals of `0143` that bind the form — strike if unwanted):** (a) notes are **dated** and written **present-tense with a verification date** ("verified against live code YYYY-MM-DD" — it is in the task's own name); (b) **citation form**: cite mutable files by **file + quoted phrase, no `:NNN`** (`Citation form` residual — 12 sibling pointers broke on `0143`'s own append while its quote-anchored citations survived). Two short bullets, ~4 lines total.

The new section itself follows the citation-form rule (no `:NNN` into ADRs) and the house idiom of the existing file (`>` blockquote warnings, bold lead-ins).

## Constraints honored

- Steps 1–4 + ADR template byte-untouched (checked by diff, below). Frontmatter untouched (avoids any interaction with `test/skill-frontmatter.test.js`'s E-rules). No third marker. No ADR edited. No wiki-vault write. No commit.

## Sequencing

1. Re-check not-dual-homed: `test -e claude/scaffold/skills && echo STOP || echo clear` (expect `clear`).
2. Baseline: `git diff --stat` of the tree; `shasum claude/skills/fkit-record-decision/SKILL.md`.
3. Insert signpost + append section (single-file edit).
4. Run verification suite (below).
5. Report; leave in working tree.

## Verification — mapped to the brief's 9 steps

1. `git diff --stat claude/skills/fkit-record-decision/SKILL.md` shows the one file; `grep -n '^## Correcting an accepted ADR' …/SKILL.md` hits.
2. One grep per anchor listed above — all seven pieces, both legend glosses, both proof commands, the placement rationale, the header exception. Concrete: `grep -n 'left byte-identical\|+N / −0\|--numstat\|banner above claim\|one metadata item\|column 0\|one place to keep true\|- \*\*Corrections:\*\*' …/SKILL.md` plus individual greps for the glosses and `drift note` / `reversal notice`.
3. Rationale-as-prose: read the placement paragraph; `grep -n 'detaches' …/SKILL.md`.
4. `grep -n "stays \`accepted\`" …/SKILL.md`.
5. `grep -n 'not a licence to edit\|new ADR plus' …/SKILL.md`.
6. `grep -n '0143\|adr-010\|ADR-010' …/SKILL.md`; 6a: `grep -n 'column 0\|top-level prose' …`; 6b: `grep -n 'one place to keep true\|pointing on purpose\|deliberately not restated' …` — then eyeball both against ADR-010's two `0195` blocks.
7. `git diff -U0 -- claude/skills/fkit-record-decision/SKILL.md | grep '^-[^-]'` → **empty** (pure insertions; Steps 1–4 and template untouched by construction, proven by diff).
8. `npm test` (baseline 560 pass per `0195`'s worklog; expect the same). Report will state: **no test asserts on this file's body — `0152`'s H1 guard is still in backlog; `test/skill-frontmatter.test.js` covers frontmatter only, which this edit does not touch** — so green is a regression check, not evidence the section is correct; the greps above are that evidence.
9. `git status --porcelain ai-agents/knowledge-base/decisions/ ai-agents/wiki-vault/` compared against the step-2 baseline — **no new entry** (the tree already carries pre-existing uncommitted deltas from earlier tasks; the check is delta-vs-baseline, not absolute-clean).

## Risks / edge cases accounted for

- **Dangling links in consuming projects** → worked example named in prose, no relative links (above).
- **Frontmatter guard fragility** → frontmatter not touched at all in the approved default plan.
- **Emoji in grep patterns** → anchors chosen to include ASCII alternatives where needed.
- **Pre-existing dirty tree on `decisions/`** → step 9 is baseline-relative.
- **`.claude/skills/` copy staleness after the edit** → noted in the report; refreshing via `claude/fkit-claude-init.sh .` is a mechanical post-step for the owner/driver, not part of this task's diff (it writes only gitignored copies).

## Flagged-for-approval items inside the plan (approve or strike; not blockers)

- **A:** the two auxiliary bullets (dated present-tense wording; no-`:NNN` citation form) — recommended: both are ratified `0143` residuals that bind the form, cost ~4 lines.
- **B:** naming `0195` alongside `0143`/ADR-010 in the worked-example paragraph — recommended: pieces 6–7 are checkable only against `0195`'s blocks, and the brief's own verification 6a/6b points there.
- **C:** frontmatter `description:` is **left untouched** in this plan (minimal diff; the skill is found by name). If the owner instead wants "correct an ADR" discoverable from the skill listing, a one-clause extension of the folded `>-` description is a ~1-line follow-on — deliberately not included by default.

---

## Owner approval record (driver-appended, 2026-08-15)

Approved by the owner via `AskUserQuestion` in the live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-15. Verbatim option labels: **"Approve (Recommended)"**; flagged items ruling: **"A: auxiliary bullets (Recommended), B: name 0195 in example (Recommended)"** — A and B are IN scope, **C was not selected and is OUT** (frontmatter `description:` stays untouched).

Transport note: the plan text above was returned by the plan worker through a task-notification channel that HTML-escapes `>` and `&`; the driver restored those characters (`&gt;` → `>`, `&amp;&amp;` → `&&`) when copying. No other transformation was applied.
