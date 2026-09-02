# Review — 0237

Task: this folder's `brief.md`
File(s) under review: `ai-agents/sprints/backlog.md` (1 site) + 13 open task briefs
(`0149` `0165` `0166` `0193` `0221` `0224` `0274` `0290` — 1 site each; `0286` `0287` `0296` `0348`
`0350` — 2 each) + this folder's new `worklog.md`. **Excluded, not this task's work:**
`ai-agents/sprints/sprint-7.md` and this folder's `brief.md` (driver status flips only); this folder's
`plan.md` (the approved plan — context, not a change under review).
Status: closed-out
Coverage: **both reviewers measured** (ADR-042 D1) — Codex (`codex-cli 0.152.0`, exit 0) executed §4.2's
matcher (`RESIDUAL: 0 across 0 files`), `git diff --check`, and the live link-integrity assertions
(3131 targets, 0 broken, 6 named-exempt); nine fixture tests in that suite could not rerun under its
read-only sandbox (`mkdtemp` `EPERM`) and I covered those from my own `npm test`. My pass ran the same
matcher (settled reading **and** the `FENCES=0 QUOTES=0` alternate reading), `dashboard.sh` over the
live board, and the full suite.

> ⛔ **This ledger is inside the scanned set** (`ai-agents/tasks/*/*/*.md`). Its findings table
> therefore splits the usual `file:line` column into **two cells — file, then line** — so a review of
> this task does not re-dirty the set the task exists to empty. Same discipline the approved `plan.md`
> and the `worklog.md` adopted. **The split is presentational only**; the coder's
> `fkit-process-stateful-review` reads it as the `file:line` column.

---

## Reviewer findings

| #  | Round | Sev | Citing file | Line | Claim |
|----|-------|-----|-------------|------|-------|
| R1 | 1 | medium | `0348`'s brief | 96 (note at 62) | **The repaired row-1 anchor is ambiguous where the old coordinate was unique, and it falsifies the brief's own disambiguating note.** Row 1 now anchors on `` `0327`'s review ledger, §"Reviewer findings" — the coverage line ``. That heading spans **`:10` → `:124`** (next heading `## Coder response`) and contains **two** `full coverage` lines — the Round 1 one and a near-identical Round 2 one. Line 62 reads *"The table below records only `:14`"*, and its stated job is *"so a later reader does not mistake the second one for a missed specimen"* — the table no longer records `:14`, and its new anchor matches both. ⭐ Row 2 of the same table shows the correct shape: it anchors on the **nested dated heading** `§"Round 2 (2026-08-27) — re-verification, no new rows"`, which is unique. The convention says the same thing (*"A heading alone is usually not enough… Where the target sits under a nested or dated sub-heading, name that one — it is the smaller region"*). Anchor still **resolves**; it no longer resolves **uniquely**. |
| R2 | 1 | low | `0221`'s brief | 23 | **The repair states the same heading twice in consecutive clauses.** The line now reads *"…lists three prerequisites under \*"Why it cannot be done now — three prerequisites, all open"\*. Its brief, §"Why it cannot be done now — three prerequisites, all open", item 2, reads:"* — the preceding clause already carried that heading, so the repair doubled it. Anchor is **correct** (`0194`'s brief, heading `:27`, item 2 `:31`) and the blockquote fragment is intact; this is a prose cost of the prescribed replacement text, which did not account for the sentence it landed in. |
| R3 | 1 | low | 6 briefs (see Claim) | — | **Five edited briefs now carry the same coordinate in two contradictory forms, and the worklog does not disclose it.** The repair de-numbered the **full-path** occurrence and correctly left the **bare-shorthand** occurrences of the *same* coordinate standing (refused by name, owner ruling 1, 2026-08-01 — so this is a **frontier-move, not a defect in the repair**): `0165` (`:47`, `:104`), `0166` (`:50`, `:142`), `0287` (`:40`, `:189`), `0274` (`:65`), `0350` (`:55`, an orphaned *"heading at"* fragment in a cell whose path column no longer carries one). `0221` `:126` is the sharper shape — a ⚠️ warning *about* a coordinate that the repair removed from the file, so it now warns about nothing present. The **worklog §4.1** discloses bare shorthand as a *guard-completeness* gap; it does **not** disclose the *intra-file inconsistency this pass newly creates*. The gap is in the disclosure, not the edits. |

**Disproven / checked and NOT findings — do not chase.** ⛔ Recorded so no one re-checks them:
the board edit (pipe count `5` on line 156, identical to both neighbours and to HEAD; row count `195`
and line count `507` identical to HEAD; `dashboard.sh` exit `0`, **0** `drift` records, roll-up
`191` / `17 done · 127 backlog · 1 cancelled · 46 moved`, `derive 0165 depends="nothing."` clean);
**0 over-repairs** (every source-file coordinate, every bare-shorthand coordinate and the protected
*"Line 212 was the number at filing time"* prose are byte-identical); **0 banned-form coordinates
added** by the diff against **19 removed**, counted independently of the worklog; all **19 anchors
resolve** on disk, checked by me and again by Codex, agreeing site for site; markdown/table integrity
(pipe counts per edited row unchanged; 1 link on each side of the diff, unmoved); `npm test` **812 /
811 pass / 0 fail / 1 skip** with `✓ hard gate PASSED` (28 mutations), link guard **829 files, 3131
targets, 0 broken, 6 named-exempt** and `NAMED-EXEMPT === 6` asserted. ⭐ **The residual is `0` under the alternate reading too** (`FENCES=0 QUOTES=0`:
`TOTAL 174` / `EXEMPT 174` / `RESIDUAL 0`) — the sweep is genuinely complete, not matcher-shaped.

## Coder response
<!-- CODER-OWNED — the reviewer never writes this section. -->
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Re-anchored row 1 on the nested paragraph `"Round 1 — reviewers run:"` **inside** §"Reviewer findings" — unique on disk (one occurrence), so the anchor now names the first specimen only and the brief's own note that the table records the first one is true again. Row 2's dated-heading shape is the model followed. No number restored | ✅ done |
| R2 | CORRECT | Defect | Replaced the doubled heading clause with `"Its brief, item 2 of that section, reads:"` — the heading is still named once, in the immediately preceding clause; the item pointer and the blockquote fragment are byte-identical. Sentence rewrapped to the file's width; nothing else touched | ✅ done |
| R3 | CORRECT | **Frontier** | ⛔ **No edit.** Owner ruled it a residual live on 2026-09-02 (option label verbatim *"Accepted residual (Rec)"*). Bare-shorthand occurrences stay — owner ruling 1 of 2026-08-01 refuses that form **by name** and is not reopened. Recorded in *Accepted residuals* below. The owner did **not** take the paired worklog-disclosure option, so the worklog is unamended by ruling, not by omission | won't fix (frontier) |

**Severity derived here, not inherited** (the reviewer's labels were medium / low / low): **R1 low**, not
medium — the anchor always **resolved**; the adjacent *Reads* cell quotes the round-1 variant
(`--sandbox read-only`, no `--cd`), which the round-2 line does not match, so the specimen was
recoverable by the paired-quote rider even before this fix. Blast radius: one table cell in one open
decision brief that has not been pulled. **R2 low** — prose only, anchor was already correct. **R3
low** — six open briefs read inconsistently; no coordinate is wrong in form under the settled ruling,
and the sharpest site (`0221`'s ⚠️ note) is still true guidance to that task's implementer.

⭐ **Per-round owner-approval gate.** This round ran under `/fkit-sprint-ship-loop`'s single up-front
plan approval of 2026-09-02 (ADR-019 / ADR-032), which replaces this skill's per-round gate; `pending
approval` is therefore unused this round. R1 and R2 were applied unasked as verified-`CORRECT`,
mechanical, localized and inside the approved plan's §2 repair form. R3 was **not** an autonomous call —
it was ruled by the owner.

## Accepted residuals (shared, do-not-re-litigate)

- **One coordinate, two forms, after a de-numbering pass** (R3, ruled 2026-09-02) —
  **What:** where a brief cited the same coordination-document coordinate **twice** — once as a full
  path carrying a line number, and elsewhere in the same file as a **bare shorthand** (a bare file name,
  or a task's `brief`, plus a line number) — this pass de-numbered the full-path occurrence **only**.
  The bare-shorthand occurrences stand unchanged in `0165` (two), `0166` (two), `0221` (one), `0274`
  (one), `0287` (two) and `0350` (one), so those six briefs now carry one coordinate in two forms.
  `0221`'s is the sharpest shape: a ⚠️ note warning that a coordinate is mutable, where the repair has
  removed that coordinate from the file, so the note now warns about something the file no longer cites.
  The worklog discloses bare shorthand as a **guard-completeness** gap; it does not disclose this
  **intra-file** inconsistency.
  **Why (structural):** owner ruling 1 of 2026-08-01 refuses the resolved-shorthand extension **by
  name**, and was not reopened — the bare-shorthand occurrences are outside both the matcher and this
  task's repair scope, so repairing them here would settle a scoping question the owner has declined to
  widen. Rejected alternatives, both put to the owner on 2026-09-02: **repair the shorthand** (reopens
  the settled ruling, and would have widened this task's work list mid-flight); **residual plus a
  worklog disclosure amendment** (offered and **not** chosen — the disclosure gap sits in this task's
  own record, which ADR-034 rules is recorded rather than re-fixed). The de-numbered form is strictly
  better than what it replaced at every site touched; the inconsistency is a cost of a deliberately
  narrow scope, not of a bad edit.
  **Re-raise only if:** owner ruling 1 of 2026-08-01 is reopened and the resolved-shorthand form is
  brought inside the settled condition — at which point these six briefs are the known work list and
  should be swept in one pass, not re-found.
