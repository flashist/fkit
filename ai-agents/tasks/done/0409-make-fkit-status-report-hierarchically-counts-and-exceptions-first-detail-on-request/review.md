# Review — 0409

Task: `ai-agents/tasks/done/0409-make-fkit-status-report-hierarchically-counts-and-exceptions-first-detail-on-request/brief.md`
File(s) under review: `claude/skills/fkit-status/dashboard.sh`, `claude/skills/fkit-status/SKILL.md`, `test/dashboard-contract.test.js`, `test/prove-red.sh`, and this task folder (`plan.md`, `worklog.md`, `scoring-table.md`, `captures/`). Baseline `add6a07`, working tree.
Status: closed-out — all three round-1 findings dispositioned (R1 fixed, R2 + R3 recorded); nothing
blocking. ⚠️ **One non-blocking residual is flagged for an owner disposition** in *Coder response*
(an odd backtick count in a head that carries words); closing the ledger does not bury it.
Coverage: both reviewers measured — ADR-042 D1. Codex ran (`codex-cli 0.152.0`, exit 0) and executed the shipped `title_cell()` body under bash against crafted inputs, benchmarked 117 calls, and ran a Node parse over `captures/` comparing `⟦FACTS⟧` and the roll-up; I independently ran `node --test test/*.test.js` (974 pass / 0 fail, exit 0), `bash test/prove-red.sh` (40 mutations red, zero `✗`, exit 0), a targeted single-line mutation of the empty-fallback guard, and an escape-aware re-measurement of both captures.

## Reviewer findings

| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|
| R1 | 1     | medium | `claude/skills/fkit-status/dashboard.sh:1155-1156` (`title_cell()`) | `*(` is matched as a literal two-byte sequence anywhere in the cell, so a Task cell where `*(` is **markdown or content rather than an annotation opener** loses its title and emits unbalanced emphasis. Measured on the shipped function: `**Title**(note about filing)` → `**Title* …`; `**(P0)** Ship the thing` → `* …`; `` Document Bash `*(pattern)` extglob `` → `` Document Bash ` … ``. The `[ -n "$_title_head" ]` guard does not fire, because the surviving head (`*`, `**`, `` ` ``) is non-empty — so the row keeps a cell but loses its only identifying text, which is the failure R7 and this guard exist to prevent, and the odd `*` count opens emphasis that runs on through the rendered table. ⚠️ This is the **same** failure the approved plan names as its stated reason for rejecting the `one_line_cell` alternative (*"would sever the `*(` span mid-emphasis, leaving unbalanced markdown that italicises the rest of the table"*). **Latent, not live:** I measured 0 of 116 live Backlog Task cells and 0 of 4 Sprint 11 cells with an emphasis-only or odd-asterisk head, and 0 odd-asterisk cells in the after-render. No test covers a non-annotation `*(`. Raised independently by both reviewers. |
| R2 | 1     | low  | `scoring-table.md` § *AFTER — the same measurements, same rules, after `title_cell()`* | The gap flagged as *"The realised numbers run slightly ABOVE the plan's simulation — whole board 74,980 against a predicted 74,867, Task cells 12,067 against 11,619"* is stated without a cause; it is **fully explicable and nothing else moved**. The realised figures are exact and self-consistent (458,446 − 395,533 + 12,067 = 74,980, verified). The plan's two simulated figures use **two different elision-marker models**: its whole-board number adds a 3-byte `…` per annotated cell (458,446 − 395,537 + 11,619 + 113×3 = 74,867 exactly), while its Task-cell total adds no marker at all (12,067 − 113×4 marker bytes + 4 header-cell bytes = 11,619 exactly). The shipped marker is ` …` (4 bytes). Recording the cause turns an open discrepancy into a closed one. |
| R3 | 1     | low  | `plan.md` § *1. The measurement I actually took* | The plan's baseline row/derived figures count the table **header row as a data row** — *"458,446 bytes, 246 lines, 117 rows"*, *"395,537 bytes across 117 cells"*, *"113 of 117 rows"*, mean 3,380. `scoring-table.md` reconciles the byte total and row count exactly (395,533 + 4 = 395,537) and every **shipped** figure is the corrected one (113 of 116, 395,533 of 458,446, max 15,375 — all four independently re-measured and confirmed here). ⛔ One plan figure is **not** covered by that reconciliation and stays unreconciled: the plan's median *"~2,900"* against a measured 2,583. **Record-only** — the plan is the approved contract and must not be edited. |

**Disproven, recorded so nobody chases it.** The builder's self-flag that `0409/opener-at-start` is *"green for the wrong reason"* is **overstated**. I removed **only** the `[ -n "$_title_head" ] || { … }` line from a full repo copy and re-ran the dashboard suite: **186 pass, 1 fail — exactly and only `0409/opener-at-start`**. It is a tight, valid guard test. It is correctly *not* pinned by mutation 40, which disables a different line; that is the mutation being precise, not the test being weak. **No action.**

**Verified, no finding — recorded because they were the named risks.**
- **Drift safety holds, structurally.** `$task` / `${task}` is read at exactly one site in all 1,687 lines — `task_cell=$(title_cell "$task")` (`dashboard.sh:1574`). Every other `task` token is a comment or the awk-internal builder upstream of the shell. No drift check, counter or fact emitter reads it, and the trim sits **after** the open-work `continue` filters. `⟦FACTS⟧` and the roll-up are byte-identical before/after on both live captures (re-verified independently by both reviewers). `0409/facts-identical` carries its own anti-vacuity assertions and is not hollow.
- **Both gates re-run by me, not taken on trust.** `node --test test/*.test.js` → **974 pass / 0 fail, exit 0**. `bash test/prove-red.sh` → **40 mutations red, zero `✗`, exit 0, "✓ hard gate PASSED"**. Mutation 40's anchor `^title_cell() {$` is unique (1 occurrence); the index holds exactly 40 entries numbered 1–40 and the banner reads `FORTY`.
- **The 391,760 correction landed everywhere.** Repo-wide grep: the figure survives in exactly one place — `scoring-table.md`, where it is explicitly labelled the earlier draft's error. No other artifact carries a figure derived from the bad "field 4" rule. My own escape-aware re-measurement of `captures/before-backlog.txt` returns **395,533 bytes / 116 rows / 113 annotated / 112 over 200 bytes / max 15,375**, matching the shipped figures exactly.
- **`v2` not bumped is a frontier-move, not a defect.** The marker's only documented contract is shape (`SKILL.md`: *"If the version marker is not `⟦fkit-dashboard v2⟧`, say so rather than guessing at the shape"*). No machine consumer parses Task-cell content — `throughput.mjs` names `⟦BOARD⟧` only in a comment. It remains an **agent's call the owner has never ruled on** (plan Q4), so it is an open disposition, not an open defect.
- **`.claude/` copies are refreshed** — `claude/` and `.claude/` are byte-identical for both changed files. No `claude/scaffold/` twin exists, confirming the plan's dual-home-parity claim.
- **Shell hygiene clean apart from R1.** `_title_head` cannot leak: the helper always runs inside command substitution. `printf '%s'` is safe for `%`, backslashes, a leading `-`, and multibyte content. `[[:space:]]` cannot bite a UTF-8 continuation byte. 117 calls cost 0.30s wall.

## Coder response

<!-- CODER-OWNED. The reviewer never writes here. -->

Round 1 processed 2026-09-20 by a spawned `fkit-coder` (Process-review worker under
`/fkit-sprint-ship-loop`; the owner's plan approval is the standing approval, the approved plan the
scope boundary). **`Sev (mine)` is derived from blast radius traced in the code — the reviewer's label
was not inherited**, though on R1 I independently land on the same one.

| #  | Sev (mine) | Verdict | Defect / Frontier | Action | Status |
|----|-----------|---------|-------------------|--------|--------|
| R1 | **medium** | CORRECT | Defect | **Reproduced first, on the shipped function — all three of the reviewer's measured outputs byte for byte.** Hardened `title_cell()` per the owner's ruling: two arms beside the existing empty guard — fall back to the raw cell when the head carries no non-asterisk/non-backtick character, or when its asterisk count is odd. Two new tests (`0409/emphasis-head` ×2, the second anti-vacuity: a *balanced* head before a real annotation is still cut). Contract block + `SKILL.md` updated. **No mutation 41** — derived, see worklog § *"Why no mutation 41"*. ⚠️ **One residual flagged, not fixed** — see the note below the table. | ✅ done |
| R2 | **low** | CORRECT | Defect (docs) | Arithmetic re-verified independently, all three identities land exactly. Cause recorded in `scoring-table.md` § *"…and the cause is now known: the elision marker is 4 bytes, not 3"*: the shipped marker ` …` is **4 bytes** where the plan's whole-board figure simulated a 3-byte `…` and its Task-cell figure simulated **no marker at all**. Gaps are exactly `113 × 1 = 113` and `113 × 4 − 4 = 448`. No figure revised; `plan.md` untouched. | ✅ done |
| R3 | **low** | CORRECT | Defect (docs, record-only) | **Re-measured from `captures/before-backlog.txt` myself** — 116 rows, 395,533 bytes, mean 3,409.8, median **2,583**, max 15,375; every figure matches the scoring table. The header-row reconciliation does not just fail to cover the median, it **runs the wrong way**: counting the header cell gives **2,543**, moving *away* from the plan's ~2,900. Recorded in `worklog.md` § *"R3 — recorded, and `plan.md` left alone"*, with the point that nothing depends on the figure — it appears in no shipped file, test, contract block or decision. ⛔ **`plan.md` NOT edited** — frozen approved artifact, per the ruling. | ✅ done |

**Why R1 is `medium` and not higher or lower — the blast radius I traced.** Not **high**: the cell
reaches exactly one site (the row assembly), `⟦FACTS⟧`/drift/roll-up are structurally untouched, no
machine consumer parses Task-cell content, and it was **latent** — 0 of 116 live Backlog cells and 0
of 4 Sprint 11 cells were in this class. Not **low**: when it does fire the row loses its only
identifying text, which is precisely the failure `R7` exists to prevent, and the trigger
(`**Bold**(…)`, a leading `**(P0)**`) is ordinary markdown a board writer could type tomorrow.

⭐ **"Latent, not live" is now measured rather than asserted.** Re-rendering the **live** Backlog
board with the hardened function gives **74,980 bytes, `diff` exit 0** against
`captures/after-backlog.txt` — the hardening changes the live render by **zero bytes**. The round-1
captures therefore stay accurate and were not re-captured.

⚠️ **One limb of R1's rationale I could not confirm.** R1 says the odd `*` *"opens emphasis that runs
on through the rendered table."* GFM parses each table cell as an independent inline context, so a
leak past the cell is unlikely — **but I ran no GFM renderer, so this is reasoning, not measurement.**
It changes nothing: the in-cell title loss is reproduced and is on its own sufficient. Verdict stays
CORRECT.

⚠️ **FLAGGED FOR THE OWNER — an odd BACKTICK count is still not caught.** The ruled guard fixes two of
R1's three measured cases. The third survives: `` Document Bash `*(pattern)` extglob `` →
`` Document Bash ` …`` — the head carries words (so the punctuation-only arm misses) and holds zero
asterisks (so the odd-asterisk arm misses). **Materially smaller**: the title survives and the row
stays identifiable, so it is cosmetic markup, not the R7 failure. **Not fixed because widening the
odd-count rule to backticks would change the shape the owner ruled**, which names backticks only in
the punctuation-only arm. Recorded in `title_cell()`'s own comment and in `worklog.md`
§ *"FLAGGED RESIDUAL"*. **Needs an owner disposition; it is not a blocker.**

⛔ **The disproven finding was NOT "fixed".** The round-1 builder's self-flag that
`0409/opener-at-start` is *"green for the wrong reason"* stays disproven. I re-ran the reviewer's own
experiment against the **hardened** file — deleting only the `[ -n "$_title_head" ]` line still gives
**188 pass / 1 fail, exactly and only `0409/opener-at-start`**. The new arms are ordered after that
guard and the punctuation-only arm uses `?*` so it fires only on a non-empty head, precisely so the
old guard stays load-bearing rather than becoming dead code.

## Accepted residuals (shared, do-not-re-litigate)

- **No character cap on the Task cell** — What: ship the cut-point rule only; two live cells that use an em-dash continuation instead of `*(` stay long (measured after: 672 and 262 bytes). Why (structural): owner ruling 2026-09-20 (plan Q1) — it takes 96.9% of the win and keeps the established principle that the trim *"is not a byte count: a long single clause survives whole"*; a length cap was rejected on the Status cell for slicing sentences in half. Re-raise only if: the cut-point rule itself is shown to be wrong, not merely that it leaves long cells.
- **`status-report-format.md` is not edited** — What: the convention is left untouched and the task is not split. Why (structural): owner ruling 2026-09-20 (plan Q2) — *"Short title"* already implies a prefix and *"no wrapped prose in cells"* already forbids the remainder, so the finding is conformance, not design. Re-raise only if: the shipped behaviour contradicts that document's text.
- **Task `0383` stays open** — What: the renderer fix does not close or shrink `0383`. Why (structural): owner ruling 2026-09-20 (plan Q3) — a renderer fix hides the symptom without slowing the cause; the board file is still a document store and still growing. Re-raise only if: the owner reverses the ruling.
- **The `⟦fkit-dashboard v2⟧` marker is NOT bumped** — What: cell content changed for 113 of 116 rows
  and the version marker stays at `v2`. Why (structural): ⭐ **owner ruling 2026-09-20 — this is no
  longer an agent's call.** `plan.md` Q4 recorded it as an agent's recommendation flagged for
  override, and the round-1 ledger carried it as *"an open disposition, not an open defect"*; the owner
  has now ruled it directly. The marker's only documented contract is envelope **shape**
  (`SKILL.md`: *"If the version marker is not `⟦fkit-dashboard v2⟧`, say so rather than guessing at
  the shape"*), this change alters **content** only, and no machine consumer parses the Task cell.
  **No code changed — only the disposition's status did.** Re-raise only if: a consumer appears that
  parses Task-cell content, or the marker's contract is widened beyond shape.
- **Stray unescaped `|` in `ai-agents/sprints/backlog.md`** — What: two live board rows carry a raw pipe inside their annotation; the trim stops the *rendering* symptom and the board file is left untouched. Why (structural): this task writes no board file; it is `0383`'s territory under the Q3 ruling. Re-raise only if: it is re-raised as a defect of **this** change rather than of the board.
