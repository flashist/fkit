# Build the coordination-citation policy guard — literal reading, closed ledgers grandfathered

**Source**: `ai-agents/tasks/done/0176-build-the-coordination-citation-policy-guard/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P7` · task `0176` · owner `fkit-coder`

## Goal

Make a `path:NNN` line coordinate inside a coordination document a **test failure**. Filed
2026-08-01, it sat unowned until Sprint 7 pulled it onto the board as `P7` by owner ruling of
2026-08-29.

⭐ **This task carries TWO owner rulings and four scoping decisions, and that density is itself part
of the record.**

## Key Changes

**`test/coordination-citation-policy.test.js`**, transcribing §4.2 of `0353`'s condition document.
⛔ **Transcribe, do not paraphrase into a fresh regex** — the measured reason: across **seven**
independent attempts, paraphrase drifted.

### 🔒 OWNER RULING 1, 2026-08-01 — the guard ships on the LITERAL full-path reading

⭐ **Unchanged and not reopened.** The resolved-shorthand extension stays **refused, by name**.

### 🔒 OWNER RULING 2 (R18), 2026-08-01 — the closed ledgers are grandfathered, BY NAME

⭐ **What is unchanged in ruling 2:** *"the exemption MUST be in the guard's definition from day one"*
— ⛔ never a post-filter bolted on.

⭐ **A later OWNER ruling superseded an earlier one. No agent reopened anything.** The **cited**-document
class widened to include `plan.md`, `worklog.md` and `review.md`. ⚠️ **Why the gap existed:** this
brief's condition was written **before ADR-029 moved plans, worklogs and reviews into the task
folder**. ⛔ **Do not confuse the two prongs** — the **citing**-side scanned set was always
`tasks/*/*/*.md`.

⛔ **The residual list of 8 files is superseded in full**; the settled residual's citing count is **14**.

### The match rule and the trap

⛔ **RULED: this half does NOT skip inline code spans.** ⭐ **The single most dangerous omission in the
brief**, because a reasonable implementer will assume the opposite. ⚠️ **The link half was ruled the
other way on both** — both in scope — because a rotted pointer is a different harm from a rotted
quotation. ⛔ **The fence-CLOSE rule was also wrong everywhere it had been written, and is corrected.**

⛔ **Verification step 4 as originally written was INVERTED and would have shipped a guard that
contradicts a settled owner ruling.** It was replaced, ⭐ and the guard must also assert the **cited**
(target) class, which step 4 never tested.

⛔ **Plant test cases in scratch fixtures, never by editing a real closed record.**

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`.

⭐ **Does this guard overlap or conflict with `0354`'s? — ANSWERED: NO, on both counts.** Different
condition, different failure. ⚠️ **The one axis where they genuinely touch is flagged rather than
resolved:** §4.1 and §4.2 duplicate structure, which is ⛔ **evidence the duplication can drift**.
⭐ **Recommendation adopted: transcribe each guard self-contained, ship them, and revisit if they
drift.**

⛔ **Four further blind spots are disclosed with the pass**, each with its measured cost.

⚠️ **This brief is one of the two (with `0237`) that took a seven-line dated 2026-09-08 annotation
during Sprint 7's archival**, by owner ruling **"Annotate, don't rewrite (Rec)"**, because it freezes
quotations the href repair would have rewritten.

- **Depends on:** `0237` — hard.
- **Blocks:** `0356`, `0357`, `0358` — hard. ⚠️ **This line was corrected in place 2026-08-29**; it
  previously read *"Blocks: nothing"*, true from filing until Sprint 7 gated its three sweeps on this
  guard being green. ⛔ It is a machine-parsed field.
- 🔗 **Kept SEPARATE from task `0175`** — a producer judgement, left open by the source report.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[tasks/clean-the-coordination-citation-residual-set-that-blocks-0176]] — `0237`, the hard dependency
- [[tasks/settle-the-reference-integrity-condition-once-for-both-halves]] — `0353`, whose §4.2 this
  transcribes
- [[tasks/build-the-link-resolution-guard]] — `0354`, the sibling guard
- [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]] ·
  [[tasks/sweep-b-the-single-site-correction-notes]] ·
  [[tasks/sweep-c-the-wiki-vault-resyncs-as-one-pass]] — the three sweeps this guard gates
- [[tasks/write-the-durable-citation-anchors-convention-page]] — the convention this enforces
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the move that opened the
  cited-class gap
- [[systems/testing-and-verification]] — the suite this joined
