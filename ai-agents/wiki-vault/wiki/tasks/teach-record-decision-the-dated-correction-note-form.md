# Teach `/fkit-record-decision` the dated correction-note form

**Source**: `ai-agents/tasks/done/0198-teach-record-decision-the-dated-correction-note-form/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P6` · ID 0198 · owner `fkit-coder` · shipped 2026-08-15

## Goal

Follow-up 5 of `0143` — and the one `0143`'s own brief named and deferred. `0143` **established** the knowledge-base correction-note form by applying it to ADR-010; `0195` applied it a second time. But the form lived only in those two task records: **the skill that writes ADRs did not know it**, so the next corrector had nothing to follow.

## Key Changes

**One file — `claude/skills/fkit-record-decision/SKILL.md`. Two pure insertions, +111 / −0 across both rounds**, so Steps 1–4, the ADR template and the frontmatter are byte-untouched.

1. A **signpost blockquote** before `## Step 1`, pointing a corrector past Steps 1–4.
2. A new section **`## Correcting an accepted ADR — the dated correction note`**.

### What the section records

- **When to use it, and when not.** `Status` stays `accepted`; the *likely-wrong* `superseded` move is named; a **reversal is a new ADR plus a ⛔ notice**, not an edit. ⛔ It is not a licence to edit an accepted ADR.
- **The two-marker legend, with both verbatim glosses**: **⚠️ = a fact has drifted · ⛔ = a decision is overturned** — plus an explicit **no-third-marker** rule and a mismark warning.
- **Below-the-claim placement**, with the rationale carried as prose. ⚠️ This **departs from the vault's original *"banner above claim"* wording**, which an owner ruling of 2026-08-03 had already superseded for the vault too.
- **Original left byte-identical; additions only** — and ⭐ **this is now the only normative source for the git-based append-only proof**:
  - `git diff --numstat` → expect `N  0`
  - `git diff -U0 <adr-file> | grep '^-' | grep -v '^---'` → expect no output
- **The `0195` snapshot caveat as a two-command proof block** (`git diff --no-index --numstat <snapshot> <file>` and `diff <snapshot> <file> | grep '^<'`), because a working-tree diff **cannot see** an in-place edit made before the snapshot.
- **The `- **Corrections:**` header bullet's form** — one metadata item, may wrap, carries the legend, with `0195`'s continuation-line extension as precedent.
- **Indentation follows the claim**, and why indent-0 is not sloppy.
- **Cross-reference, don't restate** — *"deliberately not restated here, so there is one place to keep true rather than two."*
- **A closing hand-off paragraph**: report the annotated sites and proof figures, and **recommend `fkit-wiki` re-ingest**, because a corrected ADR otherwise leaves its vault page stale. ⛔ **Deliberately narrow** — the owner ruled a hand-off *sentence* in, not a new numbered step.
- Two auxiliary rules: **dated present tense with a verification date**, and **file + quoted phrase, never `:NNN`**.

### ⭐ The review finding that changed a ratified command

Round-1 `R1`: the previously-prescribed deletion guard `grep '^-[^-]'` **misses a deleted markdown list line** — reproduced in a scratch repo (in-place edit of a `- **Corrections:**` bullet → old guard **empty**, new guard catches it). ⭐ **The defect was a ratified command being rewritten weaker**, which is why the fix ships with a paragraph naming the weak form and its mechanism.

## Outcome

**Shipped 2026-08-15**, agent-closed, over two rounds. All five review findings verified `CORRECT`; four fixed on explicit owner dispositions (*"Fix both"*, *"R5 now, R4 follow-up"*, *"Narrow it now"*), **zero obvious-winner calls made without asking.**

**Residuals — recorded, not oversights:**

- **`R4` — the `- **Corrections:**` bullet's own date and metadata position are unspecified.** Owner-ruled **out of scope**; a follow-up brief was drafted in the worklog but **NOT filed — filing is producer-only**.
- ⚠️ **A residual inside `R1`'s own ratified fix**: `grep '^-' | grep -v '^---'` **drops a deleted line whose text begins with `---`** (a markdown horizontal rule or YAML delimiter). Real, narrower than `R1`, and hardening it is outside the owner's ruling, which named this exact command.
- The gitignored `.claude/skills/` dogfood copy is stale until the next `fkit` launch re-runs convergence — mechanical, not part of the diff.

## Related
- [[tasks/append-a-dated-correction-note-to-adr-010]] — `0143`, which established the form this teaches
- [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] — `0195`, the second application and the source of the snapshot caveat
- [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] — `0141`, whose *"banner above claim"* wording this supersedes
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the ADR that carries five correction blocks and is the worked example
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — `P6`
- [[systems/knowledge-base-structure]] — where ADRs, conventions and reports are filed, and the correction-note form
