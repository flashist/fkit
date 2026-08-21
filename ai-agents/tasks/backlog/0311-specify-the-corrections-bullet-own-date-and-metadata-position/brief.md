# Specify the `- **Corrections:**` header item's own date and its position among ADR metadata

## ID
0311

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Provenance — where this came from, and who ruled it

**Surfaced as finding `R4` of task [`0198`](../../done/0198-teach-record-decision-the-dated-correction-note-form/brief.md)'s
review round 1.** The reviewer raised it; the **coder verified it `CORRECT`** (classified
*defect (completeness)*). The finding text and the coder's verification are in that task's ledger:
`ai-agents/tasks/done/0198-teach-record-decision-the-dated-correction-note-form/review.md`, section
*"R4 — Corrections bullet's own date and metadata position unspecified"*.

⭐ **The owner ruled `R4` OUT of `0198`'s scope and INTO this follow-up brief.** Ruling given live via
`AskUserQuestion` in the driving `fkit lead` session on **2026-08-15**; the verbatim option label was
**"File the R4 follow-up brief (Recommended)"**. The coder could not file it — `/fkit-task-brief` is
producer-only and hook-enforced (ADR-018/ADR-033) — so it drafted a full proposal at the end of
`ai-agents/tasks/done/0198-teach-record-decision-the-dated-correction-note-form/worklog.md` under
*"Proposed follow-up brief (R4) — NOT FILED; needs a producer"*. **This brief is that proposal, filed.**

⚠️ **Unranked, no sprint** — filed by a **spawned** producer with no owner channel, so this row
**appends** to the Backlog board and renumbers nothing
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
[ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**It is deliberately NOT added to Sprint 6.**

### The gap

Task `0198` taught `/fkit-record-decision` the dated correction-note form. Its new section describes
the `- **Corrections:**` header bullet's **form** — one metadata item, may wrap, carries the ⚠️/⛔
legend and the site list, is the append-only exception. It never states:

- **(a)** that the item carries **its own date**, nor
- **(b)** **where** it sits among the ADR's metadata bullets.

The section's auxiliary dating rule speaks of *"Notes"*, which does not plainly reach a **header
metadata item**. A future agent can follow the procedure exactly and emit an **undated** `Corrections`
bullet, or place it **above** `- **Status:**`, and nothing in the skill would flag it.

### Ground truth to encode — re-derived firsthand by the filing producer, 2026-08-15

Read directly from the live shipped file
`ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md`, not carried
on anyone's word. Its metadata block runs, in order: `- **Status:**`, `- **Date:**`,
`- **Deciders:**`, `- **Supersedes:**`, then **last** `- **Corrections:** 2026-08-02 — …`.

So the shipped shape is `- **Corrections:** YYYY-MM-DD — …`, placed **last**, immediately after
`- **Supersedes:**`.

⚠️ **Cite it by file + quoted phrase, never `:NNN`** — the *Citation form* residual ratified in task
`0143`. Line numbers in this brief's source material are deliberately not reproduced.

### Conflicts and dependencies

- **Independent of `0199`** (the ADR-010 vault resync). Blocked by nothing.
- **No ADR is edited by this task**, so no wiki-vault resync follows from it. The vault does hold
  ADR-010 material (`ai-agents/wiki-vault/wiki/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md`),
  but this change touches a **skill file**, not the ADR.
- ⚠️ **No test asserts on this file's body.** Task `0152`'s H1 house-style guard is still in backlog,
  and `test/skill-frontmatter.test.js` is frontmatter-only. A green suite is a regression check here,
  **not** evidence the new text is correct.

## What to build

**One file: `claude/skills/fkit-record-decision/SKILL.md`** — the **canonical source only**. ⛔ **Never**
edit the gitignored copy under `.claude/skills/…`.

Extend the **"The header bullet's form:"** paragraph of the section *"Correcting an accepted ADR — the
dated correction note"* with **two short statements**:

1. The item **opens with the correction's date**, in the shipped `- **Corrections:** YYYY-MM-DD — …`
   shape.
2. It is placed **last among the metadata bullets, immediately after `- **Supersedes:**`** — or after
   `- **Deciders:**` when the ADR supersedes nothing.

**Constraints:**

- Keep the existing `0143`/`0195`-ratified content **byte-identical**. This is an **extension**, not a
  rewrite.
- ⛔ Do **not** touch Steps 1–4, the ADR template, or the frontmatter.
- ⛔ Do **not** edit any ADR.
- ⛔ Do **not** commit or push.

## Verification steps

⚠️ **Read this first — the guard command changed.** Use
`git diff -U0 <file> | grep '^-' | grep -v '^---'`, **NOT** `grep '^-[^-]'`. Task `0198`'s finding
`R1` proved the latter **misses deleted markdown list lines** (a line beginning `- ` deletes as `-- `,
which `^-[^-]` does not match), so it can report a clean pure-insertion when text was in fact removed.
The owner ratified the corrected form.

⚠️ **Known residual in the corrected guard, carried forward from `0198` — not a reason to revert.**
`grep '^-' | grep -v '^---'` still **misses a deleted line whose own text begins with `---`** (a
markdown horizontal rule, a YAML delimiter). Narrower than `R1`, and hardening it is a frontier-move
outside this task. **Be aware of it when reading step 2's result**; if the edit region contains any
`---` line, confirm deletions by eye as well.

1. `git diff --numstat -- claude/skills/fkit-record-decision/SKILL.md` → `N  0` (pure insertion, zero
   deletions).
2. `git diff -U0 -- claude/skills/fkit-record-decision/SKILL.md | grep '^-' | grep -v '^---'` → empty.
   **This exact form — see the two warnings above.**
3. `grep -n 'Corrections' claude/skills/fkit-record-decision/SKILL.md` shows the new **date** statement
   and the new **position** statement.
4. Read the new text against ADR-010's shipped header block and confirm it describes **what actually
   ships** — the `- **Corrections:** 2026-08-02 — …` item sitting last, after `- **Supersedes:**`.
5. `npm test` green. **State in the report that no test asserts on this file's body** unless task
   `0152`'s H1 guard has landed by then.
6. `git status --porcelain ai-agents/knowledge-base/decisions/ ai-agents/wiki-vault/` shows **no new
   entry** versus the pre-edit baseline (capture that baseline before editing — the tree already
   carries pre-existing entries there). **No commit.**

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Relates to:** `0198` (⛔ closed and frozen — do not modify anything under
  `ai-agents/tasks/done/0198-*/`), `0143` and `0195` (the ratified content this extends), `0152` (the
  absent H1 body guard), `0199` (independent).
- **Priority `low`**, carried from the coder's proposal and unchanged. Filed **unranked** on the
  Backlog board, Priority cell `—`, per ADR-035 — a spawned producer never ranks.
- ⭐ **The proposal's own optional fold, preserved for the owner:** *"If the producer prefers, this can
  be folded into any later pass that edits this same section rather than shipped alone."* The filing
  producer took **no** position on that — it needs the owner, and there is no owner channel here.
- ⛔ **Do not commit or push** unless the owner explicitly asks.
- The gitignored `.claude/skills/` copy stays stale until `claude/fkit-claude-init.sh .` is re-run — a
  mechanical post-step, not part of this task's diff.
