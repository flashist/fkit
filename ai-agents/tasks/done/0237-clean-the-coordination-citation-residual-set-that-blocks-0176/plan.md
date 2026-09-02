# Plan — 0237, clean the coordination-citation residual set that blocks 0176

## 0. What this plan is, and the one thing to read first

**The work list is the 19-instance table in §6.1 of
`ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md`** (`0353`'s
deliverable), re-measured today. It is **not** this brief's `19 across 15`, not `0176`'s `11 across 8`,
not the `12 across 9` the same document reports elsewhere.

⛔ **The brief's `19 across 15` and the settled `19 across 14` are different sets that share a total.**
The re-measurement below reproduces the settled **14-file** set, row for row. The 2026-08-06 `15`-file
set is not reproduced, is not reconciled, and is not worked from.

⛔ **This plan file itself lands inside the scanned set** (`ai-agents/tasks/*/*/*.md`). Every coordinate
below is therefore rendered in **two cells** — cited document, then line — exactly as §6.1 does, so the
plan does not add hits to the very set it exists to empty. The same discipline binds this task's
`worklog.md` and its `review.md`.

---

## 1. Reconciliation against `0353` — steps 1 and 3 of the brief

The brief's steps 1 and 3 are discharged by `0353` and are run here as a **reconciliation, not a
re-derivation**.

**Step 1 — the condition.** Named by filename:
`ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md`, §4.2 (Half B).
Its script **is** the condition. I extracted it **verbatim** into a session scratchpad (never into the
repo) and ran it from the repo root. **No matcher was re-derived** — five hand-written matchers
producing five figures is why that document exists.

**Step 3 — the scanned-set glob.** Answered by §3 Half B, and carried unchanged:
`ai-agents/sprints/done/**` and `ai-agents/sprints/reviews/**` are **OUT** for this half — a closed
board's claims are frozen. Measured cost of including them: **+4** and **0**. ⭐ **This decision is
named explicitly in the close report**, as the brief's step 3 requires.

**Re-measurement at this plan gate (today, working tree):**

| | 2026-08-30 (brief / §6.1) | **Today** |
|---|---|---|
| Scanned | 708 files | **715 files** |
| Total | 182 across 79 | **185 across 80** |
| Exempt | 163 across 65 | **166 across 66** |
| ⭐ **Residual — the work list** | **19 across 14** | ⭐ **19 across 14** |

⭐ **The residual reproduced exactly — same 19 rows, same 14 files, same targets.** The scanned/total/
exempt figures moved because new task folders landed and `0327` moved into `done/` (its new `plan.md`,
`worklog.md` and `review.md` are scanned **and** exempt). ⛔ **That drift is expected and is not a
divergence:** it is the self-measurement effect §6 of the condition document warns about — this repo's
own live coordination documents are inside the scanned set.

### 1.1 Divergences found — surfaced, not resolved

Three. **None of them changes the work list, and none is resolved unilaterally.**

1. **The brief's verification step 9 says `ai-agents/sprints/backlog.md` "carries 3 of the 19 residual
   citations". Measured, it carries 1.** The board is a **citing** site **once** (one instance) and a
   **cited target** three times. The `3` in the brief's §2 by-target table is the target count and step
   9 reads it as the citing count. ⭐ **Step 9's underlying instruction still stands and is honoured in
   full** — one edit does land in `backlog.md`, it is a machine-parsed file, and the dashboard is re-run
   after that edit and again at the end. Only the number is wrong.
2. **Two of the 19 cite coordinates that have already rotted, and one of the citing briefs already says
   so.** `ai-agents/sprints/backlog.md` line **101** today is a blockquote line, not the board row
   `0286` says it is; line **212** today is a different row entirely — `0295`'s row now sits at line
   **269**. `0296`'s own brief already warns *"Line 212 was the number at filing time … locate the row by
   its `0295` href, not by line number."* ⭐ **This is corroboration of the task, not a conflict** — but
   it is recorded because it means the repair is fixing live rot, not tidying correct text.
3. **`0286`'s cell citing `0145`'s brief at two sites is half-rotted too.** The second site is no longer
   where the cell says; the brief's two `architecture.md` citations sit at different lines today. Same
   class as (2).

⛔ **I found no divergence between my measurement and the condition document itself.** Where the brief
and the document disagree, the document governs and the disagreement is reported above rather than
picked between.

---

## 2. The repair form — what each citation becomes, and why

**Authority:** `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`, which has landed
(`0171` is on disk), so its form is used by name rather than invented.

Its row 3 is the governing rule: *a coordination document others append to — sprint plans, task briefs,
an append-only project log — `path:NNN` is **wrong**, because third parties append above your line for
reasons unrelated to your sentence.*

**The conversion, stated once:**

- **Drop the `:` + line number.** Keep the file named.
- **Anchor by the smallest region that locates it** — a nested or dated heading where one exists, the
  named field (`## Status`, `## Priority`) where the target is a field, the finding id (`R2`) where the
  target is a ledger row.
- **Keep or add the quoted fragment.** Most of the 19 sites already carry the quote; the rider is
  already satisfied there and the quote is left byte-identical.
- **Cite a task by its `NNNN` folder prefix** — convention row 4. `` `NNNN` (`folder-slug`) `` on first
  occurrence in a file, bare `` `NNNN` `` after.
- **Change the citation, not the sentence around it.** No rewording, no reflowing, no "harmonising".

**Two form decisions I am making inside the plan, stated so they can be overruled:**

1. ⛔ **No new markdown links.** The convention does not require one, and `test/reference-integrity.test.js`
   (`0354`'s link guard, green today: 827 files, 3131 targets, **0 broken, 6 named-exempt**) resolves
   every link in `ai-agents/**`. A new link is a new way to red a currently-green guard for zero gain,
   and the guard asserts `NAMED-EXEMPT === 6` — a seventh would fail loudly. Backticked names only.
2. ⛔ **Do not resolve the two elided coordinates into real paths.** Condition document §7 item 10 rules
   elided targets **count** for Half B; the brief's §3 says repair them to the durable named form. The
   folders do both exist (`0195-correct-adr-010s-skills-for-role-source-of-truth-claim`,
   `0145-pty-driven-menu-pick-coverage-for-the-launcher`) — resolving them would mint a *fresh* long
   path where the point is to stop pointing by coordinate at all.

---

## 3. ⭐ The work list — all 19, each with its replacement

⚠️ **Coordinates are rendered in two cells. The "Replacement" column is the text that will stand after
the edit** — the offending substring is not reproduced anywhere in this file.

### Group A — the live board (1 instance)

| # | Citing file | Line | Cited document | Line cited | Replacement |
|---|---|---|---|---|---|
| 1 | `ai-agents/sprints/backlog.md` | 156 | `ai-agents/wiki-vault/log.md` | 623 | `` `ai-agents/wiki-vault/log.md` §"Correction appended 2026-07-29 — the terminal flag line was emitted in a non-conforming form" `` — inside the `0165` row's description cell; the existing quote *"task 0141 ready to close…"* stays byte-identical |

⚠️ **Machine-parsed file.** The edit sits inside one row's pipe-delimited description cell. ⛔ **The
replacement text contains no `|` and no newline** — either would split or break the row and hand
`dashboard.sh` an unparseable board. The dashboard is re-run immediately after this edit, not only at
the end (brief's step 9).

### Group B — vault-log citations in open briefs (4 instances)

⭐ **Repairing these is NOT a vault write.** The edit lands in the citing open brief;
`ai-agents/wiki-vault/` is never opened for writing (ADR-005).

| # | Citing file | Line | Cited document | Line cited | Replacement |
|---|---|---|---|---|---|
| 2 | `…/0165-decide-where-a-check-on-the-wiki-flags-emitted-form-can-live/brief.md` | 38 | `ai-agents/wiki-vault/log.md` | 623 | `` `ai-agents/wiki-vault/log.md` §"Correction appended 2026-07-29 — the terminal flag line was emitted in a non-conforming form" `` — evidence-table cell; the existing quote is the fragment and stays as-is |
| 3 | `…/0166-decide-the-enforcement-point-for-run-every-command-you-print/brief.md` | 43 | `ai-agents/wiki-vault/log.md` | 657 | `` Recorded on disk in `ai-agents/wiki-vault/log.md`, §"Correction appended 2026-07-29 (round 2, stateful review) — three worklog-accuracy defects in this entry": `` — the blockquote that follows is the fragment, unchanged |
| 4 | `…/0287-wiki-resync-of-the-codex-sandbox-read-only-pages-after-0273/brief.md` | 27 | `ai-agents/wiki-vault/log.md` | 2008 | `` (`ai-agents/wiki-vault/log.md` §"⚠️ Flagged for human review — 3", item 2, anchor measured 2026-08-13) `` — the trailing measurement date is kept; it is still a true statement about when the anchor was taken |
| 5 | same file | 223 | `ai-agents/wiki-vault/log.md` | 2008 | `` (recorded in `ai-agents/wiki-vault/log.md` §"⚠️ Flagged for human review — 3", item 2) `` |

### Group C — citations of a closed record, from an open brief (7 instances)

⚠️ **A citation pointing INTO a closed folder is repairable — the exemption is about the CITING site,
not the cited one.** Every edit here lands in an open backlog brief.

| # | Citing file | Line | Cited document | Line cited | Replacement |
|---|---|---|---|---|---|
| 6 | `…/0149-record-that-0118s-block-on-0117-was-discharged-by-another-route/brief.md` | 32 | `0117`'s review ledger (`0117-wiki-ingest-lead-conductor-and-adrs-031-032`) | 33 | `` (the one-line authorized widening recorded in `0117`'s review ledger, §"Coder response", finding `R2`) `` |
| 7 | `…/0193-repair-the-stale-citations-in-0158s-closed-brief/brief.md` | 58 | `0162`'s brief (`0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement`) | 10 | `` `0162`'s brief `## Priority` field reads `127` `` — table cell; the rest of the cell is untouched |
| 8 | `…/0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md` | 38 | `0195`'s worklog — folder segment **elided** | 188 | `` (`0195`'s worklog, §"Round 2 — review processing, 2026-08-02", the ⚠️ Procedural-flag paragraph recording the hook denial, frozen) `` — elision **not** resolved |
| 9 | `…/0274-append-dated-coverage-corrections-to-0259s-and-0264s-closed-review-ledgers/brief.md` | 162 | `0265`'s review ledger | 10 | `` `0265`'s review ledger already states the reasoning-only reality loudly and correctly `` — the existing quote *"COVERAGE IS PARTIAL AND THIS IS NOT A FOOTNOTE"* is the fragment and stays |
| 10 | `…/0290-decide-whether-anything-should-notice-when-a-close-falsifies-a-vault-claim/brief.md` | 418 | `0289`'s brief | 12 | `` (`0289`'s brief `## Status` field) `` |
| 11 | `…/0348-decide-and-if-ruled-correct-the-two-post-adr-042-coverage-full-review-ledgers/brief.md` | 96 | `0327`'s review ledger | 12 | `` `0327`'s review ledger, §"Reviewer findings" — the coverage line `` ; the quoted phrase already sits in the next cell and stays |
| 12 | same file | 97 | `0188`'s review ledger | 27 | `` `0188`'s review ledger, §"Round 2 (2026-08-27) — re-verification, no new rows" `` ; existing quote stays |

### Group D — citations of an open brief or the live board, from an open brief (7 instances)

| # | Citing file | Line | Cited document | Line cited | Replacement |
|---|---|---|---|---|---|
| 13 | `…/0221-repair-0194s-false-0190-clause-does-not-exist-premise/brief.md` | 24 | `0194`'s brief | 31 | `` Its brief, §"Why it cannot be done now — three prerequisites, all open", item 2, reads: `` — the blockquote that follows is the verbatim fragment |
| 14 | `…/0286-mechanical-citation-sweep-of-architecture-md/brief.md` | 158 | `ai-agents/sprints/backlog.md` | 101 | `` `ai-agents/sprints/backlog.md` — the `0145` row `` (⚠️ **already rotted**: line 101 today is a blockquote line) |
| 15 | same file | 159 | `0145`'s brief — folder segment **elided** | 21 | `` `0145`'s brief — two sites, both citing the same `architecture.md` coordinate `` (⚠️ the second site has moved; elision **not** resolved) |
| 16 | `…/0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md` | 50 | `ai-agents/sprints/backlog.md` | 212 | `` now sits on `ai-agents/sprints/backlog.md` as the `0295` row `` (⚠️ **already rotted**: `0295`'s row is at line 269 today) |
| 17 | same file | 300 | `ai-agents/sprints/backlog.md` | 212 | `` ⛔ **Do not edit the `0295` row on `ai-agents/sprints/backlog.md`** `` |
| 18 | `…/0350-append-the-dated-r3-discharge-note-to-0125s-closed-review-ledger/brief.md` | 55 | `0125`'s review ledger | 109 | `` `0125`'s review ledger — the R3 residual bullet under `## Accepted residuals (shared, do-not-re-litigate)` `` ; the Content cell already carries that anchor and stays |
| 19 | same file | 56 | `0125`'s plan | 127 | `` `0125`'s plan — check 4, the uniformity check `` ; the Content cell's description stays |

⚠️ **On #17.** The sentence *immediately after* it — *"Line 212 was the number at filing time; two rows
were appended after it … locate the row by its `0295` href, not by line number"* — is **left
byte-identical**. It is prose *about* the number, is not in the banned form, and is the record of why the
coordinate rotted. Same class as the `0306` dead-path note this brief protects.

---

## 4. Sequencing

1. **Re-run §4.2's script from the repo root** (verbatim from the condition document, into the
   scratchpad) and confirm the 19 rows still match this plan. If a row has moved or a 20th has appeared
   — **stop and surface**, do not silently widen.
2. **Run the dashboard over all four live boards; record roll-ups and drift — the "before" reading.**
3. **Group A first (the board), alone, then re-run the dashboard immediately.** The one machine-parsed
   edit is isolated so a parser break is attributable to it and nothing else.
4. **Groups B, C, D** — one file at a time, in ascending task order.
5. **After each file: spot-check the repaired citation still points at the same thing** (brief's
   verification step 6). A cleanup that silently re-targets a citation is worse than the citation.
6. **Re-run §4.2's script — expect `RESIDUAL: 0 across 0`.**
7. **Run `npm test`** and the dashboard again — the "after" reading.
8. **Write `worklog.md`**: the runnable command, the before/after figures, the step-3 glob decision by
   name, and the two mandatory disclosures (§6 below).
9. **Ask `@fkit-reviewer` for a stateful review**, relay it verbatim, then process it.

---

## 5. Verification — commands and expected figures

| # | Check | Command | Expected |
|---|---|---|---|
| V1 | Residual empty | §4.2's script, verbatim from the condition document, run from the repo root | `RESIDUAL: 0 across 0 files` |
| V2 | The pass did not shrink the guard by accident | same script | `TOTAL` and `EXEMPT` drop by **19** and **0** respectively from the pre-pass reading; **`SCANNED` unchanged except for this task's own new files** |
| V3 | ⛔ Nothing under a closed folder was touched (brief's step 4′) | `git diff --stat` filtered to `ai-agents/tasks/done/` and `ai-agents/tasks/cancelled/` | **zero files, any file type** — not just `review.md` |
| V4 | ⛔ Zero vault writes | `git diff --stat` filtered to `ai-agents/wiki-vault/` | **zero files** |
| V5 | Every citation still points at what it pointed at | manual spot-check of **all 19**, each against the named heading/field/finding in the target | 19/19 resolve |
| V6 | Link guard still green | `node --test test/reference-integrity.test.js` | `0 broken, 6 named-exempt`; **`NAMED-EXEMPT === 6`** unchanged |
| V7 | Full suite | `npm test` | **812 tests / 811 pass / 0 fail / 1 skip**, `✓ hard gate PASSED` (28 mutations) — allowing for count drift from any test file added elsewhere in the tree |
| V8 | Boards parse and gain no drift | dashboard over all four live boards, before and after | roll-ups reconcile; **no board gains a drift record** |
| V9 | The board edit specifically | dashboard over `backlog.md` **immediately after** the Group A edit | parses; row count unchanged |
| V10 | This task's own artifacts are clean | §4.2's script, after `plan.md` / `worklog.md` exist | they contribute **0** residual hits |

**Baseline measured this session, not assumed:** `node --test test/reference-integrity.test.js
test/closed-rank-immutability.test.js test/dashboard-contract.test.js` → **197 tests, 196 pass, 0 fail,
1 skip.** ⚠️ **The `0361` pre-existing red (`closed-rank-immutability`, "live leg 1") did NOT reproduce
in the current working tree.** I did not investigate why — it is `P13`'s business. If it appears during
this task I will report it and **not** fix it.

⚠️ **`npm test` in full has not been run this session.** The 812/811/0/1 figure is carried from the
task assignment, not measured by me. It is measured before the first edit, so the "after" comparison
has a real baseline.

---

## 6. ⛔ What must be disclosed alongside the pass (brief §4, and it is not optional)

**A green guard here is not a complete guard.** Both accepted incompletenesses go in the close report,
stated, not implied:

1. **The resolved-shorthand extension is still refused, by name** (owner ruling 1, 2026-08-01, not
   reopened). A bare board name or a bare `NNNN/brief` followed by a line number is **not** matched.
   Being a gate on three other Sprint 7 rows does not make it complete.
2. **Source-file coordinates are caught by neither guard**, and the cost is **250 instances across 46
   files** (a second regex for the same question measured 216 across 42; both refute the "three" this
   was once thought to be). That counts coordinates, **not** verified-stale coordinates. ⛔ The refusal
   to widen is unchanged and is not reopened.
3. **The step-3 glob decision, by name:** `ai-agents/sprints/done/**` and `ai-agents/sprints/reviews/**`
   are **OUT** for the citation half; measured cost of including them **+4** and **0**.

---

## 7. ⛔ What I will deliberately NOT touch, and why

| Not touched | Why |
|---|---|
| Anything under `ai-agents/tasks/done/**` or `ai-agents/tasks/cancelled/**` | Owner ruling 2026-08-29, the whole closed folder is exempt. ⭐ Costs nothing: **zero of the 19 citing sites are in a closed folder** |
| `ai-agents/wiki-vault/**` | ADR-005 — the wiki role's exclusive write surface. The 5 citations **of** `log.md` are repaired **in the citing brief** |
| `ai-agents/sprints/done/**`, `ai-agents/sprints/reviews/**` | Out of the scanned set by the settled condition; a closed board's claims are frozen |
| `ai-agents/knowledge-base/**`, including the condition document itself | Out of the scanned set for this half (`0176` decision 1 — a report cites a coordination document **as the specimen it is diagnosing**) |
| Bare-shorthand coordinates (a board name or `NNNN/brief` + a line number) — e.g. the two in `0193`'s same table cell | Refused **by name** by owner ruling 1. ⛔ Not folded in, not flagged as an option |
| Source-file coordinates (`claude/…`, `test/…` + a line number) — e.g. the three source rows in `0350`'s table, the SKILL rows in `0165`'s table | Convention **row 1** rules `path:NNN` **correct** for a source file. Repairing them would be a *defect*, not a cleanup |
| `architecture.md` and report coordinates (e.g. `0286`'s column 2, `0145`'s brief) | Not coordination documents under the settled target class; `0286` owns that sweep |
| The `0306` dead-path note in this brief; the *"Line 212 was the number at filing time"* sentence in `0296` | Both are prose **about** a coordinate being dead. Re-pointing them makes the sentence contradict itself |
| `test/coordination-citation-policy.test.js` | ⛔ That is `0176`. This task ships a clean tree, not a test file |
| Any task file **move**; any commit or push | Movers are producer-only (ADR-033); commits need an explicit ask |

---

## 8. Edge cases and failure modes I am planning around

1. ⛔ **The plan / worklog / review of this very task are inside the scanned set.** Writing a coordinate
   in the banned form into any of them adds residual hits and reds `0176` on this task's own artifacts.
   Mitigation: two-cell rendering throughout, and **V10** measures it rather than trusting it.
2. **Markdown table cells are pipe-delimited.** 12 of the 19 sites sit in a table row; the board edit
   sits in a `dashboard.sh`-parsed cell. ⛔ **No `|` and no newline enters any replacement.**
3. **The `0295` and `0145` coordinates are already stale.** Repairing by *dropping the number* is
   correct; ⛔ **"repairing" by updating the number to today's line would satisfy the matcher and be
   wrong** — the convention bans the form, not the arithmetic.
4. **Editing `backlog.md` shifts every line number below the edit** — including the two already-stale
   `backlog.md` coordinates. Mitigation: the board is edited **first**, then the script re-run, so later
   groups work from post-shift positions. The repairs are line-number-free anyway, so this is belt and
   braces.
5. **Two elided coordinates.** ⛔ Not resolved into paths (§2 decision 2). Half A skips elided targets;
   Half B does not. That divergence is deliberate and stays.
6. **Adding a link could red the currently-green link guard**, or push `NAMED-EXEMPT` past its asserted
   6. Mitigated by the no-new-links decision.
7. **A concurrent write lands a 20th instance while I work.** The tree measures differently as this
   repo's own coordination documents are written. Mitigation: re-measure at the start (done), and again
   at the end; if the residual is not 0, name the new instance and its provenance rather than quietly
   sweeping it.
8. **`0236` overlaps on the stale-`sprint-2.md` hits.** A path can be stale-and-legal or
   fresh-and-banned independently. ⛔ I repair only the banned **form**; whatever staleness `0236` owns
   is left, and the close report says what was left for it.
9. **`0171`'s convention page has landed** (verified on disk), so the target form is cited by name
   rather than invented — the brief's fallback ("name the form you used and why") is not needed.

---

## 9. ⛔ Blind spots — what this plan does NOT cover

1. **It does not make `0176` shippable *forever*, only *today*.** The residual is measured against a
   living tree that this team writes to continuously. ⛔ **If `0176` is not built promptly after this
   closes, the set can be non-empty again by the time it runs** — see the open question below.
2. **It cleans a form, not a fact.** Every repaired citation is anchored by heading, field or finding
   id; **whether the cited claim is still true is not checked**, and one repaired anchor may already be
   pointing at a superseded statement. V5 checks the anchor resolves to the same target, not that the
   target still says what the citing sentence claims.
3. **The two elided coordinates stay elided.** A reader still cannot click through them. Repairing the
   elision is a different job and is not folded in.
4. **`0350`'s table becomes heterogeneous** — its coordination-document rows lose their line numbers
   while its `test/` rows keep theirs. Each row is individually correct under the convention, but the
   table reads less uniformly than it did. Recorded, not hidden.
5. **`npm test` was not run in full this session.** The pre-edit baseline is measured before the first
   edit; until then the 812/811/0/1 figure is carried, not verified by me.
6. **The `0361` red did not reproduce** in the current working tree and I did not investigate why. If it
   is masked by an uncommitted change rather than fixed, this plan does not notice.
7. **No `path:NNN` guard exists yet** to catch a regression here — that is precisely `0176`. Until it
   ships, nothing mechanically stops the 20th instance being written tomorrow.
8. **This plan does not verify the condition document's own review is finished.** It was under review
   (round 2) when the brief's figures were taken. I reconciled against its current on-disk text and the
   residual reproduced; I did not check whether a round-3 finding is pending against §4.2.

---

## ❓ Open questions for the owner

**Q1 — Four of the 19 sites are other open tasks' own work-list coordinates. Repair them, or leave
them?**
`0286` (2 sites), `0348` (2 sites), `0350` (2 sites) and `0193` (1 site) write these coordinates *as
their deliverable's input* — the thing they will go and edit. Repairing them changes another task's
work list before that task runs.
- **(Rec) Repair them.** The durable form is strictly more usable than a rotted line number, and both
  `0286` and `0350` **already instruct their own implementer to re-derive from disk before acting**
  (*"Re-derive the map from disk before you use it"* / *"⛔ Re-measure every figure below before
  acting"*). Two of these coordinates are demonstrably already wrong. Cost: those briefs' tables read
  slightly differently when their tasks run.
- **Leave them and exclude 7 of the 19.** Residual would land at 7, not 0, and `0176` would still be
  unshippable. **This defeats the task**, so it is listed for completeness, not as a live option.

**Q2 — Sequencing: should `0176` (`P7`) be built immediately after this closes, in the same run?**
The residual is measured against a tree this team writes to constantly, and **nothing mechanically
stops a 20th instance being written tomorrow** — the guard that would is `0176` itself. A gap between
these two rows re-opens the hole.
- **(Rec) Yes — run `0176` next, back to back, and have its implementer re-measure at its own plan gate
  rather than trusting this task's closing figure.**
- **No, schedule it normally** — accept that `0176` may arrive red and need a second, smaller sweep.

**Q3 — Should the close report also file the freshly-observed rot as its own note?**
Three of the 19 cite coordinates that have **already** drifted (§1.1 items 2 and 3). That is live
evidence for the convention, and currently it would only appear inside this task's worklog.
- **(Rec) Record it in the worklog and name it in the close report** — no new task, no new file.
- **File it as a task** — probably over-engineering for three data points.
- **Say nothing** — loses the specimen.

---

# ⭐ OWNER RULINGS AT THE PLAN GATE — 2026-09-02

⛔ **Appended by the driver (`fkit-sprint-ship-loop`, `fkit lead` session) AFTER the plan text above,
which is the approved text verbatim.** These four rulings were given live via `AskUserQuestion` in this
session and are recorded here by **verbatim option label** so a later reader can see exactly what was
chosen, not a paraphrase of it.

| # | Question | ⭐ Owner's choice — option label verbatim | What it settles |
|---|---|---|---|
| G0 | Approve this plan for `0237`, and let the build spawn proceed? | **"Approve as written (Rec)"** | ⭐ **The plan above is APPROVED as written.** No re-measure precondition was imposed; §4 step 1's own re-run stands as the plan wrote it |
| G1 | Seven of the 19 sites are other open tasks' own work-list coordinates (`0286`, `0348`, `0350`, `0193`). Repair them, or leave them? | **"Repair them (Rec)"** | ⭐ **All 19 are in scope.** The plan's own Q1 recommendation is ruled correct — the seven are repaired, and those briefs' tables will read differently when their own tasks run |
| G2 | Run `0176` (`P7`) back-to-back straight after this closes? | **"Yes, back to back (Rec)"** | ⭐ `0176` is driven **immediately** after this task closes. ⛔ Its implementer **re-measures at its own plan gate** and does **not** trust this task's closing figure |
| G3 | Three of the 19 cite coordinates that have already rotted. Where does that observation go? | **"Worklog + close report (Rec)"** | ⭐ The rot specimen is recorded in this task's `worklog.md` **and named in the close report**. ⛔ **No new task is filed for it**, and no new file is created |

⚠️ **G1 is the ruling that keeps the residual reachable at zero.** The plan's alternative — leaving the
seven out — would have landed the residual at **7**, not 0, and `0176` would have stayed unshippable.
The owner did not take it.
