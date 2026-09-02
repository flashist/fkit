# Worklog — 0237, clean the coordination-citation residual set that blocks 0176

**Worker:** fkit-coder, spawned Build worker of `/fkit-sprint-ship-loop` (no owner channel — ADR-021)
**Date:** 2026-09-02 · **Tree:** HEAD `095bf15`, working tree dirty
**Plan:** this folder's `plan.md`, blob `710f1b2708198581810e08dd178dd3450e3ae0a8`, 28697 bytes —
verified byte-exact against the driver's pointer before any edit.

> ⛔ **This file is inside the scanned set** (`ai-agents/tasks/*/*/*.md`). Every coordinate below is
> rendered in **two cells** — document, then line — so this worklog adds no hits to the set it exists
> to empty. **V10 measures that rather than trusting it.**

---

## 1. What was done

The 19-instance residual measured by the settled condition
(`ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md`, §6.1) was
repaired to the durable named form of
`ai-agents/knowledge-base/conventions/durable-citation-anchors.md` — the line number dropped, the
smallest locating region named (a heading, a named field, or a finding id), the quoted fragment kept
byte-identical.

**Sequencing followed the plan's §4 exactly:** re-run the condition script → dashboard "before" →
Group A alone → dashboard immediately → Groups B/C/D one file at a time in ascending task order →
spot-check → re-run the script → `npm test` → dashboard "after".

**Method note.** Every edit went through a literal single-occurrence replace helper (scratchpad only,
never committed to the repo) that **refuses** a replacement containing a `|` or — outside prose mode —
a newline, and **refuses** unless the old text occurs exactly once. It fired twice, correctly, when a
table-row replacement wrongly included the row's own pipe delimiters; both were narrowed to cell
content and re-applied. **No edit was made by a loose regex.**

### Change surface — 14 files

| # | File | Sites |
|---|---|---|
| 1 | `ai-agents/sprints/backlog.md` | 1 (Group A, the live board) |
| 2 | `0149`'s brief | 1 |
| 3 | `0165`'s brief | 1 |
| 4 | `0166`'s brief | 1 |
| 5 | `0193`'s brief | 1 |
| 6 | `0221`'s brief | 1 |
| 7 | `0224`'s brief | 1 |
| 8 | `0274`'s brief | 1 |
| 9 | `0286`'s brief | 2 |
| 10 | `0287`'s brief | 2 |
| 11 | `0290`'s brief | 1 |
| 12 | `0296`'s brief | 2 |
| 13 | `0348`'s brief | 2 |
| 14 | `0350`'s brief | 2 |

⚠️ **`ai-agents/sprints/sprint-7.md` and this task's own `brief.md` are also modified in the working
tree. Neither edit is this worker's** — both are the driver's `🔲 Backlog → 🔄 In progress` status
flips, verified by diff.

---

## 2. Before / after figures — measured, not carried

The condition script was extracted **verbatim** from §4.2 of the condition document into a session
scratchpad and run from the repo root. **No matcher was re-derived.**

| | Plan's re-measure (2026-09-02) | **Before, measured by this worker** | **After** |
|---|---|---|---|
| `SCANNED` | 715 files | **716 files** | **716 files** |
| `TOTAL` | 185 across 80 | **185 across 80** | **166 across 66** |
| `EXEMPT` | 166 across 66 | **166 across 66** | **166 across 66** |
| ⭐ `RESIDUAL` | **19 across 14** | ⭐ **19 across 14** | ⭐ **0 across 0** |

⭐ **The 19 rows reproduced exactly** — same 14 files, same lines, same targets as the plan's §3 work
list, row for row. The plan's §4 step 1 stop-condition ("a row moved, or a 20th appeared") was **not**
triggered.

⚠️ **`SCANNED` is 716, not the plan's 715, because this task's own `plan.md` had landed by the time I
measured.** It contributes **0** residual hits — `TOTAL` and `EXEMPT` are unchanged by it.

---

## 3. The step-3 glob decision, named

The brief's step 3 asked which globs the citation half scans. **Answered by the condition document
§3 Half B, and carried unchanged, not re-decided:**

- ⛔ **`ai-agents/sprints/done/**` is OUT.** A closed board's claims are frozen. **Measured cost of
  including it: +4 residual.**
- ⛔ **`ai-agents/sprints/reviews/**` is OUT.** Same reason. **Measured cost of including it: 0.**

---

## 4. ⛔ The two mandatory disclosures — a green residual is not a complete guard

Both are stated, not implied, and both belong in the close report:

1. **The resolved-shorthand extension is still refused, by name** (owner ruling 1, 2026-08-01, not
   reopened). A **bare board name** or a **bare `NNNN/brief`** followed by a line number is **not
   matched** by this condition and was **not** repaired. Being a gate on three other Sprint 7 rows
   does not make the guard complete.
2. **Source-file coordinates are caught by neither guard**, and the cost is **250 instances across 46
   files** (a second regex for the same question measured 216 across 42; both refute the "three" this
   was once thought to be). That counts *coordinates*, **not** verified-stale coordinates. ⛔ The
   refusal to widen is unchanged and was not reopened here. Convention **row 1** rules a line number
   **correct** for a source file, so repairing them would be a defect, not a cleanup.

---

## 5. ⭐ G3 — the already-rotted-coordinate specimen (owner ruling, "Worklog + close report (Rec)")

**Three of the 19 cited coordinates had already drifted before this task ran.** Recorded here and
named in the close report; ⛔ **no new task filed, no new file created.**

| Specimen | What the citation claimed | Measured on disk 2026-09-02 | Drift |
|---|---|---|---|
| `0286`'s cell citing the live board | the `0145` row, at board line **101** | board line **101** is a blockquote line; the `0145` row sits at line **158** | **+57 lines** |
| `0296`, two cells citing the live board | the `0295` row, at board line **212** | line **212** is a different row entirely; the `0295` row sits at line **269** | **+57 lines** |
| `0286`'s cell citing `0145`'s brief, two sites | sites at lines **21** and **81** | site 1 still at **21**; site 2 has moved to **123** — ⭐ both do still cite the *same* `architecture.md` coordinate, so the replacement's claim holds | **+42 lines** on site 2 |

⭐ **`0296`'s own brief already warned its implementer** — *"Line 212 was the number at filing time …
locate the row by its `0295` href, not by line number."* That sentence is **left byte-identical**: it
is prose *about* a dead coordinate, not a citation in the banned form. **This is corroboration of the
task, not a conflict** — the repair fixed live rot, it did not tidy correct text.

---

## 6. Divergences found and surfaced — none resolved unilaterally

1. ⛔ **The plan's V8 says "all four live boards". There are only TWO.** `ai-agents/sprints/` holds
   `backlog.md` and `sprint-7.md` as live boards; `done/` and `reviews/` are directories of archived
   boards and are out of scope for this half by the settled condition. **V8 was therefore run over two
   boards, not four.** The plan's figure did not reproduce and is not carried.
2. **The brief's verification step 9 says the live board "carries 3 of the 19 residual citations".
   Measured, it carries 1** — it is a *citing* site once and a *cited target* three times. ⭐ Step 9's
   underlying instruction was honoured in full anyway: the one board edit was made first and alone,
   and the dashboard was re-run immediately after it and again at the end.
3. The three rot specimens in §5 above.

⛔ **No divergence was found between my measurement and the condition document itself.**

---

## 7. Verification — V1 to V10, actual measured figures

| # | Check | Result |
|---|---|---|
| **V1** | Residual empty | ✅ `RESIDUAL: 0 across 0 files` |
| **V2** | Guard not shrunk by accident | ✅ `TOTAL` **185 → 166** (−19, exactly the repaired set); `EXEMPT` **166 → 166** (0 change); `SCANNED` **716 → 716** |
| **V3** | Nothing under a closed folder touched | ✅ `git status --porcelain` over `ai-agents/tasks/done/` and `ai-agents/tasks/cancelled/` is **empty — zero files, any file type** |
| **V4** | Zero vault writes | ✅ `git status --porcelain` over `ai-agents/wiki-vault/` is **empty** |
| **V5** | Every citation still points at what it pointed at | ✅ **19/19 resolve** — each repaired anchor checked mechanically against the named heading, field or finding id in the target file, plus target existence |
| **V6** | Link guard still green | ✅ `0 broken, 6 named-exempt`; `NAMED-EXEMPT === 6` asserted and passing; 828 files, 3131 targets. 20 tests, 19 pass, 0 fail, 1 skip |
| **V7** | Full suite | ✅ **812 tests / 811 pass / 0 fail / 1 skip**, `✓ hard gate PASSED` (28 mutations) — **byte-identical to the pre-edit baseline I measured myself** |
| **V8** | Boards parse, gain no drift | ✅ both live boards exit 0; roll-ups reconcile and are **identical** before and after (`191` / `17 done · 127 backlog · 1 cancelled · 46 moved`; `13` / `4 done · 1 in progress · 7 backlog · 1 cancelled`). Rendered diff is **exactly the one repaired cell**; `sprint-7` renders **byte-identically**. **No board gained a drift record.** ⚠️ Two boards, not the plan's four — §6 item 1 |
| **V9** | The board edit specifically | ✅ dashboard run **immediately** after Group A: exit 0, **129 rows unchanged**, roll-up unchanged, single-cell diff |
| **V10** | This task's own artifacts are clean | ✅ measured with `plan.md` **and this `worklog.md`** on disk: `SCANNED: 717` · `TOTAL: 166 across 66` · `EXEMPT: 166 across 66` · `RESIDUAL: 0 across 0`. ⭐ The two new artifacts raised `SCANNED` by 2 and contributed **0** residual hits — the two-cell rendering held |

**Pre-edit baseline measured by this worker, not carried:** `node --test test/*.test.js` →
**812 tests, 811 pass, 0 fail, 1 skip**; `npm test` hard gate **PASSED**. The plan's carried
812/811/0/1 figure **did** reproduce.

⚠️ **The `0361` pre-existing red (`closed-rank-immutability`, "live leg 1") did not reproduce**, at
the pre-edit baseline or after. I did not investigate why; it is `P13`'s business. Consistent with
what the plan recorded.

---

## 8. ⛔ Decision log — every call applied without asking (ADR-019 audit obligation)

I ran as the sprint-ship-loop's **Build worker** under the declared-approval marker. The approved plan
is both the standing approval and the scope boundary.

**Fixes applied without per-item approval: the 19 repairs of the plan's §3 work list, and nothing
else.** Each qualified on all three counts — **verified `CORRECT`** (the site was re-measured by the
condition script before the edit and its target anchor checked on disk), **mechanical and localized**
(one citation each, no surrounding sentence reworded), and **inside the approved plan** (§3 names the
site and gives the replacement text, and owner ruling **G1 — "Repair them (Rec)"** put all 19 in
scope, the seven belonging to other open tasks included).

| Call | Finding it answers | What changed | Why it qualified |
|---|---|---|---|
| Repairs #1–#19 | The 19-row residual of §6.1 of the condition document, reproduced exactly at the plan gate | 19 citations converted to the durable named form across 14 files | Verified `CORRECT` + mechanical/localized + in the approved plan (§3) under owner ruling G1 |
| Two guard refusals, re-applied narrower | My own helper refused replacements for `0286`'s two table cells | Replacement scope narrowed from the whole row to the cell content; text otherwise unchanged | Mechanical correction of my own construction error; the plan's replacement text was applied unaltered |

**Obvious-winner calls made: `none`.**
**Judgment calls escalated instead of applied: `none arose`** — no row moved, no 20th instance
appeared, no finding fell outside the approved plan.

⛔ **Nothing was committed or pushed. No task file was moved.** The close is producer-only (ADR-033).
⛔ **The review was NOT run** — §4 step 9 is the loop's Review step and belongs to a separate
`@fkit-reviewer` spawn, not to this worker.

### 8.1 Review round 1 — the Process-review worker's own decision log

A second bounded spawn ran `fkit-process-stateful-review` over the ledger, under the **same** standing
approval (ADR-019's audit obligation transfers with its permission).

| Call | Finding it answers | What changed | Why it qualified |
|---|---|---|---|
| Re-anchor the first specimen row | **R1** — the repaired anchor named a heading spanning the whole findings section, which holds **two** near-identical coverage lines, so it no longer resolved uniquely and undercut the brief's own note that the table records the first one only | `0348`'s brief, the specimen table's row 1: the anchor now names the nested `"Round 1 — reviewers run:"` paragraph inside that heading — one occurrence on disk. No line number restored | Verified `CORRECT` against both files + mechanical/localized (one table cell, pipe count unchanged at 5) + **inside the approved plan** — §2's *"anchor by the smallest region that locates it — a nested or dated heading where one exists"*, which row 2 of the same table already followed |
| De-duplicate the doubled heading clause | **R2** — the prescribed replacement text restated a heading the preceding clause already carried | `0221`'s brief, the context sentence: `"Its brief, item 2 of that section, reads:"`; heading named once, item pointer and blockquote fragment unchanged | Verified `CORRECT` + mechanical/localized (one clause, one rewrap) + in-plan — §2's *"change the citation, not the sentence around it"*, which the doubling had breached |

**Obvious-winner calls made: `none`.**
**Judgment calls escalated instead of applied:** **R3** was **not** decided by this worker — the owner
ruled it live on 2026-09-02 (*"Accepted residual (Rec)"*) and it is recorded in the ledger's *Accepted
residuals*. ⛔ **No bare-shorthand coordinate was touched.** Two further questions were carried to the
driver rather than acted on: the reviewer's open question about an open task's `review.md` being inside
the scanned set (ruled **G5** — it is `0176`'s question, to be named at that task's plan gate), and the
observation that `0361`'s brief opens on a `npm test` RED claim that does not reproduce today (ruled
**G6** — left for `P13`, nothing touched).

---

## 9. ⛔ What was deliberately NOT touched

Per the plan's §7, unchanged:

- `ai-agents/tasks/done/**` and `ai-agents/tasks/cancelled/**` — owner ruling 2026-08-29. ⭐ Cost:
  **zero**, since none of the 19 citing sites was in a closed folder.
- `ai-agents/wiki-vault/**` — ADR-005. The 5 citations **of** the vault log were repaired **in the
  citing brief**, never in the vault.
- Archived boards and sprint review ledgers; `ai-agents/knowledge-base/**`, the condition document
  included.
- **Bare-shorthand coordinates** (a board name or `NNNN/brief` plus a line number) — refused by name
  by owner ruling 1, not folded in.
- **Source-file coordinates** under `claude/` and `test/` — convention row 1 rules them **correct**.
- The elided folder segments in `0224`'s and `0286`'s citations — ⛔ **not resolved into paths**
  (plan §2 decision 2). Repairing the elision is a different job.
- `0296`'s *"Line 212 was the number at filing time"* sentence and the `0306` dead-path note — prose
  *about* a dead coordinate.
- `test/coordination-citation-policy.test.js` — that is `0176`. This task ships a clean tree, not a
  test file.

---

## 10. Residual risk, stated plainly

1. **This makes `0176` shippable today, not forever.** The residual is measured against a tree this
   team writes to continuously, and **nothing mechanically stops a 20th instance being written
   tomorrow** — the guard that would is `0176` itself. ⭐ Owner ruling **G2 — "Yes, back to back
   (Rec)"** covers this: `0176` runs immediately after this closes, and ⛔ **its implementer
   re-measures at its own plan gate rather than trusting this task's closing figure.**
2. **A form was cleaned, not a fact.** V5 proves each repaired anchor **resolves to the same target**.
   It does **not** prove the cited claim is still true; one repaired anchor may already point at a
   superseded statement. Not checked, and not in scope.
3. **`0350`'s table is now heterogeneous** — its coordination-document rows lost their line numbers
   while its `test/` rows keep theirs. Each row is individually correct under the convention; the
   table reads less uniformly than it did. Recorded, not hidden.
4. **Seven repaired sites are other open tasks' own work-list coordinates** (`0286`, `0348`, `0350`,
   `0193`). Their tables will read differently when those tasks run — the accepted, owner-ruled cost
   of G1. Both `0286` and `0350` already instruct their own implementer to re-derive from disk first.
