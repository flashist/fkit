# Sprint 6 — Repair the record the board rests on, and ship what was already ready

**Source**: `ai-agents/sprints/sprint-6.md`
**Status**: in-progress — 🟢 **THE ACTIVE BOARD**, and ⚠️ **every row is closed but the board is not**
**Sprint/Tag**: Sprint 6 · opened 2026-08-14 · **21 rows, 21 closed** *(re-measured 2026-08-29)* · ranks restart at `P1`

> ⚠️ **SYNC 2026-08-29 — the board grew from 19 rows to 21 and every row now reads `✅ Done`. The header above is updated; the body below keeps its dated 19-row record and is left byte-identical where it says so.**
> ⛔ **It is still `ai-agents/sprints/sprint-6.md`, NOT archived**, it carries **no `🔒 CLOSED` banner**, and `dashboard.sh select-active` still returns it as `active file="sprint-6.md"` — measured this run. ⛔ **A finished board is still being reported as the active one**, which is the exact condition [[tasks/archive-sprint-5-move-the-plan-into-sprints-done]] recorded as *"a banner flip is cosmetic; only the move changes behaviour."*
> ⛔ **All 21 carry `(agent-closed — not owner-verified)`. No human has verified any of them.**

## Goal

Two halves the 2026-08-14 backlog triage grouped into one sprint:

1. **Repair the record the rest of the board reads** — the three decay shapes (`0306`), the anchor form that stops them recurring (`0171`), the merit-statement form (`0178`), the correction-note form (`0198`), and the citation/ownership repairs that depend on them (`0218`, `0168`, `0188`).
2. **Ship what was already unblocked and nobody noticed** — five rows whose briefs still present them as gated when the gate is discharged (`0168`, `0204`, `0223`, `0046`, `0218`), plus the high report-to-cost repairs (`0280`, `0302`, `0250`, `0300`) and the decisions that stop future rework (`0270`, `0272`, `0229`).

## Key Changes

### The board opened against a gap, not a rollover

[[tasks/sprint-5-fix-what-a-real-project-found]] was archived **2026-08-14 with its successor clause deliberately omitted** — there was no Sprint 6 to name at the time. Between that archival and this board, `dashboard.sh select-active ai-agents/sprints` returned **`active none`** and the project had **no active sprint at all**. ⛔ **Sprint 5's banner is left byte-identical and is NOT amended to point here.**

⚠️ **What it inherits, stated rather than implied:** every Sprint 5 row closed `✅ Done (agent-closed — not owner-verified)` and **that marker stays on all of them permanently**. Nothing on this board changes that.

### Its authority is a triage of all 108 then-open rows, not a scoping guess

The board exists by an **owner ruling 2026-08-14**, given live via `AskUserQuestion` in an `fkit lead` session driving `/fkit-sprint-ship-loop` — option label verbatim **"Accept as proposed (Recommended)"** — accepting, unamended, the 18-row Sprint 6 proposed at §7 of `ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-synthesis.md`. That followed an earlier owner-ruled triage of **all 108 then-open rows** (verbatim *"Triage all 108 first, then scope (Recommended)"*), reported in `ai-agents/knowledge-base/reports/2026-08-14-backlog-triage-part-{1,2,3,4}.md`.

⛔ **Those five reports are the record this board rests on and must not be edited.**

**Merged verdicts across 108 triaged rows:** `KEEP` 92 · `STALE-PREMISE` 14 · `DONE-IN-FACT` 2 · `SUPERSEDED` 0 · `DUPLICATE` 0 · `UNCLEAR` 0. The two `DONE-IN-FACT` rows are `0206` and `0238` — see [[tasks/the-2026-08-15-done-in-fact-wiki-closes]].

⚠️ **The four fragments invented their tags independently** — 21 distinct labels across the four parts, merged into **ten themes** grouped by *what a worker would have to read and touch*, not by subject. ⭐ **`docs` is the one part-tag that does not fold whole — it splits**, on the test *does the fix change a pointer, or a claim?* (→ `citations` / `records`). Merging them would have hidden the largest single cluster on the board.

⭐ **The pass's single most useful output: five rows executable today whose briefs still present them as gated** — `0168`, `0204`, `0223`, `0240`, `0046` (plus `0045`, gated on a pre-migration numeral rather than a dependency). ⛔ **Four other rows that read blocked and ARE free — `0224`, `0225`, `0229`, `0271` — are deliberately NOT on that list**: each already carries a dated correction recording the discharge. ⭐ **They are the model, and they are why the five are a defect.** ⚠️ **`0224` is free of `0222` and still NOT ready** — held by an unruled owner decision. ⚠️ **`0194` must NOT be flipped**: `0190`/`0191` closed but `0189` did not, so the row is still genuinely blocked; the repair is to correct the count, not declare it ready.

⚠️ A **sixth report**, `2026-08-14-backlog-triage-recheck.md`, re-checked **41 absence claims** after a **confirmed, measured false negative** — and changed `0154`'s verdict. Its bottom line: ✅ **Sprint 6 is NOT scoped on a false premise.**

A **second owner ruling of the same session** re-targeted `0272` (verbatim *"Re-target it to Sprint 6 (Recommended)"*); its old placement instruction named the archived Sprint 5 and is **spent**.

### It opened UNRANKED — the first board in this project ever to — and was then ranked the same day

Rows entered unranked because the opening producer was a spawned `fkit-producer` with **no owner channel** ([[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]) and ADR-035 reserves ranking to the owner, so it recorded the accepted order as **prose** and left every Priority cell `—`. Two further owner rulings the same day — *"Rank it now, in the accepted order (Recommended)"* and *"Add an unranked-forward clause (Recommended)"* — made the board **`P1`–`P18`** and resolved the deviation. ⚠️ **`P19` (`0154`) is NOT from that ruling** — appended later the same day by a **separate** owner ruling (*"Pull it into Sprint 6 (Recommended)"*). ⛔ **An APPEND, not an insertion**: `P1`–`P18` were left exactly as they are and nothing was renumbered ([[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]]).

⚠️ **Ranking was free when it was recorded and is not free any more.** It was applied while no row was closed. ADR-035's no-re-rank wall bites **from the first close onward**.

⚠️⚠️ **STALE CLAUSES IN THE 18 ROW NOTES.** Each of the 18 rows carries a *"CARRIED ONTO SPRINT 6"* note written at opening, and each still asserts four things the ranking superseded (no `— priority M` suffix · board is unranked · `## Priority` untouched at `Unscheduled` · *"sequence position N of 18 — prose, not a rank"*). ⛔ **The row notes were left byte-identical rather than edited in place**; the board's `✅ This board is RANKED` section is the correction of record for all 18. **Whether to fold the correction into the rows is an open question returned to the owner.**

### The convention deviation it declared rather than made silently

`backlog.md`'s forward-move rule stated the marker suffix `— priority M` as **unconditional**. On an unranked destination `M` does not exist, so the 18 rows carried the marker without it. ⚠️ **The rule as written was not merely awkward, it was unsatisfiable** — no unranked destination could comply. ✅ Resolved both halves: the rows gained `— priority P<n>`, and `backlog.md`'s rule gained an **unranked-forward clause** making the suffix conditional and the omission an explicit **deferral**.

⚠️ **Checked, not assumed:** `dashboard.sh`'s `moved_target` parser lets `.*` swallow everything after the identity, so it **never reads the suffix**. Adding the 18 suffixes changed no count, no drift verdict and no `next` value — **a documentation-truth fix, not a behaviour change**.

### 📌 The rank is mirrored into each brief's `## Priority` — and nothing enforces it

Form `Sprint N P<n>`, verified against Sprint 4/5 closed briefs. ⚠️ **UNENFORCED — nothing in the repo checks it.** `dashboard.sh` reads a brief's `Status`, `Sprint` and `Owner`; it **never** reads `## Priority`.

### The order, and the four real dependencies it encodes

`0306` → `0171` → `0218` → `0177` → `0178` → `0198` → `0280` → `0302` → `0250` → `0046` → `0223` → `0204` → `0168` → `0188` → `0229` → `0300` → `0270` → `0272` (= `P1`–`P18`), with `0154` appended at `P19`.

1. **`0306` runs FIRST, and alone** — it edits briefs across 17+ open folders, four of them on this board.
2. **`0171` before the citation repairs** — it writes the anchor form the repairs land *in*.
3. **`0218` before `0177`** — `0177` was **unworkable as written** until the stale `RULES_MAX` figure was repaired.

## Outcome

~~**Open. 8 of 19 rows closed as of 2026-08-22**~~ ✅ *Superseded 2026-08-29:* **21 of 21 rows closed**, every one `✅ Done (agent-closed — not owner-verified)` — ⛔ **no human has verified any of them.** ⛔ **The board itself is NOT closed**: no `🔒 CLOSED` banner, not moved to `sprints/done/`, and still returned as the active sprint. *(The 2026-08-22 sentence is left as a dated record of the 8-of-19 state.)*

| rank | task | state |
|---|---|---|
| `P1` | [[tasks/repair-the-three-decay-shapes-across-the-open-backlog-briefs]] (`0306`) | ✅ agent-closed |
| `P2` | [[tasks/write-the-durable-citation-anchors-convention-page]] (`0171`) | ✅ agent-closed — *2026-08-22; the page had been on disk since 2026-08-21 while the row stayed open* |
| `P3` | [[tasks/repair-0177s-stale-cap-and-byte-figures]] (`0218`) | ✅ agent-closed |
| `P4` | [[tasks/verify-the-codex-half-of-the-comment-stripping-canary]] (`0177`) | ✅ agent-closed |
| `P5` | [[tasks/record-the-canonical-merit-statement-form-in-the-convention-page]] (`0178`) | ✅ agent-closed |
| `P6` | [[tasks/teach-record-decision-the-dated-correction-note-form]] (`0198`) | ✅ agent-closed |
| `P7` | [[tasks/rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint]] (`0280`) | ✅ agent-closed |
| `P8` | [[tasks/pressing-enter-at-the-role-menu-should-open-the-lead]] (`0302`) | ✅ agent-closed |
| `P9` | [[tasks/fix-the-scaffold-producer-row-fkit-task-brief-omission]] (`0250`) | ✅ agent-closed — *2026-08-23* |
| `P10` | [[tasks/gate-symlink-escape-in-init-intake-write]] (`0046`) | ✅ agent-closed — *2026-08-24* |
| `P11` | [[tasks/refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim]] (`0327`) | ✅ agent-closed — *2026-08-24* · ⭐ **added to the board after it opened, at `P11`** |
| `P12` | [[tasks/enumerate-the-process-review-rows-method-steps-and-give-the-row-its-reason]] (`0223`) | ✅ agent-closed — *2026-08-25* |
| `P13` | [[tasks/build-the-pretooluse-task-carry-check-hook-and-its-tests]] (`0204`) | ✅ agent-closed — *2026-08-26* |
| `P14` | [[tasks/repair-the-moved-folders-own-self-locators-in-task-done]] (`0325`) | ✅ agent-closed — *2026-08-26* · ⭐ **added after the board opened, ranked above `0168` by owner ruling** |
| `P15` | [[tasks/remediate-the-dead-brief-paths-in-closed-review-ledger-headers]] (`0168`) | ✅ agent-closed — *2026-08-26* |
| `P16` | [[tasks/repair-the-five-live-ownership-fact-defects]] (`0188`) | ✅ agent-closed — *2026-08-27* |
| `P17` | [[tasks/widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close]] (`0229`) | ✅ agent-closed — *2026-08-27* |
| `P18` | [[tasks/release-mjs-with-branch-other-commits-and-tags-head-but-pushes-a-different-ref]] (`0300`) | ✅ agent-closed — *2026-08-27* |
| `P19` | [[tasks/decide-how-the-ship-loop-handles-a-non-coder-owned-task-row]] (`0270`) | ✅ agent-closed — *2026-08-28* · produced [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]] |
| `P20` | [[tasks/replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary]] (`0272`) | ✅ agent-closed — *2026-08-28* |
| `P21` | [[tasks/build-wiki-flag-convention-test]] (`0154`) | ✅ agent-closed — *2026-08-28* |

> ⚠️ **SYNC 2026-08-29 — the `P9`–`P19` "🔲 Backlog" row that stood here has been REPLACED by the twelve rows above, because every one of them closed.** ⛔ **The rank list it carried is superseded twice over**: two rows (`0327`, `0325`) were added to the board after it opened, shifting the ranks below them by one each. ⭐ **Neither insertion renumbered a closed row** — the board's closed rows were contiguous at the top in both cases, the narrow shape [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] names by hand in its own residual-risks section. ⚠️ **The `## Key Changes` order sentence below still lists the original 18 + `0154` and is a dated record; read the table above for the live ranks.**

⚠️ **`P2` is out of sequence with the ranks below it** — the board's own §"four real dependencies" says `0171` runs before the citation repairs, and `P3`–`P8` shipped while it is still open. Recorded, not resolved here.

> ✅ **Dated note 2026-08-22 — `P2` has since CLOSED**, so the sentence above is a dated record and is left byte-identical. ⛔ **The out-of-sequence fact it states is NOT retracted:** `P3`–`P8` did ship ahead of the row the board's own dependency order puts first, and closing `P2` afterwards does not undo that. See [[tasks/write-the-durable-citation-anchors-convention-page]].

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the archived predecessor; ⛔ **there was no board at all between the two**
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board every Sprint 6 row moved off, and whose forward-move rule this board's deviation changed
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — why `P19` is an append and not an insertion
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why the opening producer could not rank
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] — how `select-active` resolves this board
- [[tasks/the-2026-08-15-done-in-fact-wiki-closes]] — the two `DONE-IN-FACT` rows the triage found
- [[systems/fkit]] · [[systems/knowledge-base-structure]]
- [[systems/install-and-self-update]] — the launcher this board's `0302` changed
- [[tasks/archive-sprint-5-move-the-plan-into-sprints-done]] — `0294`, the archival that opened the `active none` gap this board closed
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, whose follow-up `0171` is this board's `P2` — ⚠️ ~~**still `🔄 In progress` while `P3`–`P8` shipped past it**~~ ✅ *Corrected 2026-08-22:* **`P2` is now closed**; ⛔ the out-of-sequence fact stands — `P3`–`P8` shipped past it, against the board's own stated dependency order
- [[tasks/write-the-durable-citation-anchors-convention-page]] — `0171`, this board's `P2`, closed 2026-08-22 agent-closed
- [[tasks/wiki-ingest-of-adr-043-claude-is-not-a-structure-conformance-surface]] — `0293`, whose 2026-08-14 `active none` reading this board superseded the same day
- [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]] — *added 2026-08-29:* the ADR this board's `P19` produced; ⭐ **it rules that vault-deliverable rows are skipped at this loop's step 1 and reported**, so a wiki row will never again reach a coder Build worker
- [[tasks/record-that-0250-discharged-0188s-d1-and-warn-off-the-reordering]] — `0324`, filed off this board's `P9` and closed unranked on the Backlog
