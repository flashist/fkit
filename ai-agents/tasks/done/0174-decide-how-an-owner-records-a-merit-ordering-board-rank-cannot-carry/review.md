# Review — 0174

Task: 0174 — [brief](./brief.md)

File(s) under review:
- `ai-agents/knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md` (new)
- `ai-agents/knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md` (new)
- `ai-agents/tasks/backlog/0174-.../plan.md`, `.../worklog.md` (new)

Out of scope, not reviewed: tasks `0130` and `0136` (closed earlier this sprint run), the driver's
status-flip edits to `ai-agents/sprints/sprint-2.md` and to `0174`'s `brief.md`, the untracked `0177`
brief.

Status: **responded — round 1 closed.** All 8 findings owner-ruled 2026-08-01, all 8 independently
re-verified and confirmed, all 8 corrections applied to the report and ADR-035. No accepted residuals
recorded. See *Coder response* below.

> **Citation form in this ledger.** No `:NNN` line-number citations appear anywhere below. This task's
> own subject is durable citation form and `0160`'s ruling binds downstream work, so the schema's
> `file:line` column is used as **`file › heading`** and every claim is anchored by **heading plus
> quoted phrase**. Tasks are cited by **folder ID**, never by board rank.

---

## Reviewer findings

| #  | Round | Sev | file › anchor | Claim |
|----|-------|-----|---------------|-------|
| R1 | 1 | med | report › `### 5.4 Two accepted costs, carried explicitly` — *"18 of the 29 open sprint-2 briefs carry no merit statement in any form"* | The day-one grandfathering cost is sized against the wrong predicate. §5.1's condition requires the **canonical form** `**On merit:**`; **zero** briefs in the corpus match it — all 15 use the legacy `**On merit this belongs …**` shape that step 5 mandates today. The specified guard is red on **29 of 29** open briefs, not 18. Follow-up 3's blocking decision inherits the understated number. Raised by both reviewers. |
| R2 | 1 | med | report › `### 1.3 The diff decomposition` — *"under the current rule it is **impossible** — a row leaves the unreachable set only by **closing** or **being cancelled**, never by moving"* | False as a universal claim. A third route exists: when **every** row of the final (append-zone) segment closes, the next segment up becomes the final segment and its open rows leave the unreachable set **without closing, cancelling, or moving**. Verified by simulation against the live board's tail shape — 7 rows transition. The measured count of zero transitions **over the reviewed interval is correct**; the invariant asserted from it is not, and §1.3's "exactly two routes" enumeration is incomplete. Raised by Codex, verified here. |
| R3 | 1 | med | report › `### 1.4 Method cross-validation` — *"Replaying the identical script against the commit that held the board at the time report `0160` was written"* | The cross-validation is **true but not replayable as published**. No revision is named and no script is shipped, in the paragraph whose whole job is to establish that the measurement can be trusted (and under a heading that promises *"Method — stated, so it can be replayed"*). The obvious candidate — the commit that introduced report `0160` — yields **148 / 124 / 24 open**, contradicting the claim. The revision that actually reproduces the prior reading cell-for-cell is its **parent**, and naming it is what makes §1.4 checkable. Raised by Codex; the matching revision was independently located here. |
| R4 | 1 | low | report › `### 1.4 Method cross-validation` — *"Reverse-shifting the live board by the +1 renumbering §2 describes gives the same six segments"* | False under every reading. Segment count is fixed by the open/closed sequence in board order; a rank shift is a relabeling and cannot change it. The live board has **five** segments, so reverse-shifting it yields five, never six. Undoing the closes is not a "shift". An unchecked assertion inside the trust-establishing paragraph. Reviewer-only finding. |
| R5 | 1 | low | report › `### 2.1 The eight rows` — *"Twenty open rows moved as well; those are unremarkable"* | Miscount: **22** open rows moved, not twenty. (30 rows moved in total, 8 closed + 22 open; the brief's own *"every rank from the old P119 through the old P148"* band is 30 rows, which I confirmed all moved exactly +1.) Related wording slip in `### 1.3` — *"**+7** new appended rows"* counts `0174` among the appends, when the same report's central finding is that `0174` was an **insertion**, not an append. Reviewer-only finding. |
| R6 | 1 | low | report › `## 10. Verification — this report's own compliance`, step 7 row — *"this ruling wrote only this report and ADR-035"* | The word **"only" is false**, and is contradicted by the remainder of the same table cell, which discloses that `plan.md` and `worklog.md` were written under `ai-agents/tasks/`. Separately, the report does not state what the worklog does state — that `git diff --stat` **cannot see** untracked files, so the stated check is structurally incapable of deciding step 7 in either direction. Disclosure is **adequate in the worklog, marginal in the report**. See the step-7 ruling below: the step passes on substance; this finding is about the false clause, not the scope. Raised by both reviewers. |
| R7 | 1 | low | report › `### 1.3 The diff decomposition` — *"`0174`, this task, which entered the board already unreachable (§6.1)"* | Dangling cross-reference. The report has no §6.1 (§6 carries no subsections), and report `0160`'s §6.1 — *"The ruling, in this report's own words"* — does not support the statement either. The intended target is this report's **§6**, which does state *"`0174` is itself one of the 16 unreachable rows"*. A broken pointer in a ruling about durable pointers. Raised by both reviewers. |
| R8 | 1 | low | ADR-035 › `## Context` — *"**The closed-row rule**, four bullets later in the same step"*; report › `### 4.2 The required narrowing` — *"a rule the same step calls absolute, four bullets apart"* | Form, not substance. *"Four bullets later"* is a **positional coordinate into a mutable file** — the exact citation class `0160` ruled against and this task is downstream of. It is also miscounted: within step 5 the closed-row rule is the **fourth** bullet and sits **two** bullets after the exception it is contrasted with. The accompanying verbatim quotes are correct and keep the anchor durable in practice. Reviewer-only finding. |

---

## Coder response

<!-- CODER-OWNED. The reviewer does not write this section. -->

**Author of the artifacts under review is `fkit-architect`, not the coder** — the files are a report and
an ADR, no source was touched. This section is filled by the author in that role. The `/fkit-process-stateful-review`
skill was **not run** (it is the coder's, and the ADR-018 hook denies it here); its *method* was applied
by hand: each finding re-verified against the artifacts before any edit.

**Owner rulings: 2026-08-01, all eight ruled CORRECT.** Every finding was independently re-verified here
before applying; **all eight confirmed**, none was found wrong.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CONFIRMED** — re-verified: `grep -rl '\*\*On merit:\*\*'` over `*/brief.md` returns **0**; `On merit` in any shape returns **15**. §5.1's condition is red on **29 of 29** open briefs | defect | report §5.4b rewritten with a breakdown table (18 no statement / 11 legacy shape / 0 canonical / **29 of 29 red**); §9 open question 1 and §8 follow-up 3 resized to 29. **§5.1's canonical form left untouched** — the regression the reviewer warned of was not taken | **applied** |
| R2 | **CONFIRMED** — simulated: closing all 13 rows of live segment 5 makes segment 4's **7** rows (`0144`, `0145`, `0146`, `0152`, `0149`, `0155`, `0156`) reachable with no row moving | defect | §1.3's impossibility claim replaced by an explicit correction; the "exactly two routes" list is now **three**, adding **segment rollover**. The measured **zero** transitions is kept and still carries the ruling; the report says in-line that no conclusion changes | **applied** |
| R3 | **CONFIRMED** — and **the ruling's ancestry labels are off by one; its figures are right.** See the note below | defect | §1.4 rewritten: revision named by SHA, the contradicting candidate named and explained, and the measurement script shipped inline. Re-extracted the published script from the report and re-ran it — it reproduces all three readings | **applied** |
| R4 | **CONFIRMED** — segment count depends only on the open/closed sequence in board order; a rank relabeling cannot change it, and the live board has five | defect | the false sentence deleted; replaced with the true statement it was reaching for — the 6 → 5 change is not the renumbering, it is segment 1 (`{0130, 0136}`) closing | **applied** |
| R5 | **CONFIRMED** — filing-commit diff by folder ID: **30** rows changed rank, **8** closed + **22** open, every one exactly **+1**, and the set is exactly the old `P119`–`P148` band | defect | §2.1 corrected to **22** with the 30/8/22 and +1 detail. §1.3's `+7 new appended rows` corrected to **+7 new rows — six appended (`0171`, `0172`, `0173`, `0175`, `0176`, `0177`) plus `0174`, inserted mid-board**, consistent with §2 | **applied** |
| R6 | **CONFIRMED** — the cell's own text refutes its `only` | defect | §10 step-7 cell rewritten: `only` removed, the ruling's **products** distinguished from the mandated workflow artifacts, and the instrument's blindness stated in the report (previously only in the worklog). Verdict restated as **PASS on scope, checked directly** | **applied** |
| R7 | **CONFIRMED** — the report has no §6.1 (heading sweep: §6 carries no subsections); `0160`'s §6.1 is *"The ruling, in this report's own words"* and does not support the statement | defect | `(§6.1)` → `(§6)` | **applied** |
| R8 | **CONFIRMED** — step 5's bullets in order: append rule; the one exception; the re-rank addendum; **the closed-row rule (4th)**. It is **2** bullets after the exception, not four | defect (citation form — matters above its severity) | fixed in **both** documents. Report §4.2 now quotes the closed-row rule verbatim and anchors by step heading, with a note naming the old form as the citation class this task descends from. ADR-035's *"four bullets later"* replaced by a quoted-text anchor, and its **Citation form** blockquote extended to ban bullet ordinals by name | **applied** |

### R3 — a discrepancy in the relayed ruling, recorded rather than silently absorbed

The ruling's **figures** are exactly right and pin the revision uniquely. Its **ancestry labels are off
by one generation** against measured history. Measured here with the shipped script:

| Revision | Relation to `0174`'s filing commit `8540d03` | Reading |
|---|---|---|
| `ba36196` | parent | 148 / 124 / 24 open |
| `aa62e6d` | **grandparent** — and the commit that **added** report `0160` | 148 / 124 / 24 open |
| `afe4fae` | **great-grandparent** | **148 / 123 (83.1%) / 25 open / 6 segments / 17 of 25 (68.0%) / 1 singleton** |

The ruling named the **grandparent** as the reproducing revision, but the grandparent returns the
contradicting reading; the revision that returns the ruling's own stated figures is the
**great-grandparent**. The reviewer's original ledger wording is consistent with the measurement — it
says *"the commit that introduced report `0160`"* yields 148/124/24 and *"its parent"* reproduces, and
`aa62e6d` is indeed that commit. **The slip is in the ancestry label, not in the substance**, so this
was not escalated: the report now names the revision by **SHA**, which is unambiguous and does not rot,
and names the contradicting candidate too, as the ruling asked.

### Consistency knock-on found while sweeping R1

§5.4a's cost (a) reasoned about `0158` under the old 18-brief premise and became imprecise once §5.4b
was corrected: `0158`'s line as written **is** caught today, but by the **presence** half (legacy shape),
not for its bare rank. §5.4a now states this precisely and adds the consequence — **a backfill done to
clear cost (b) can extinguish the drift flag while leaving the bare-rank defect in place.** Not a
reviewer finding; a correctness follow-through the R1 sweep surfaced.

### Verification re-run on the corrected documents

- **Brief step 8 — PASS.** `grep -nE '\.md:[0-9]'` returns **no matches** over both documents; the
  broader `path:NNN` sweep and a generic `word:NNN` sweep also return **no matches**. R8's fix
  introduced none.
- **Measurement re-run — unchanged.** Live board still 155 / 126 (81.3%) / 29 open / 5 segments /
  16 of 29 (55.2%) / 1 singleton (`0143`).
- **Published script verified as published.** The `bash` block was extracted back out of the report and
  executed: it reproduces the live reading, `afe4fae`'s 148/123/25/6/17-of-25/1, and `aa62e6d`'s
  contradicting 148/124/24. §1.4 is now genuinely replayable.
- **Changed figures swept for every occurrence.** `18`→`29` (§5.4b, §8 follow-up 3, §9 OQ 1),
  `Twenty`→`22` (§2.1), `+7 appended`→`+7, six appended + `0174` inserted` (§1.3). Residual-claim greps
  for `Twenty open`, `impossib`, `four bullets`, `§6.1`, `two routes`, `wrote only`, `reverse-shift`
  return only the new corrective text. ADR-035 carries no figure touched by R1 or R5 — its `126 of 155`,
  `16 of 29`, five segments and the eight identities are all confirmed unchanged.

### Scope held

No implementation: `/fkit-task-brief`, `dashboard.sh`, `test/` and every skill are untouched. No brief
filed, nothing re-ranked, the board addendum and `0174`'s brief not edited (follow-up 6, the
producer's). Nothing written under `ai-agents/wiki-vault/`. Nothing committed. The *Reviewer findings*
section above was not modified.

---

## Accepted residuals (shared, do-not-re-litigate)

<!-- Entries are added only once the owner approves treating a finding as a settled tradeoff. -->

*(none recorded — the owner adopted none this round.)*

**Raised and deliberately NOT adopted:** the step-7 instrument weakness — that `git diff --stat` is
blind to untracked files and therefore cannot decide a scope check in either direction. The owner did
**not** select it for recording as an accepted residual, so it is **not** protected from re-litigation.
It stays documented where the reviewer put it, in *"Step 7 — the declared conflict, ruled plainly"*
above, and it is now also stated in the report's own §10 step-7 cell under R6.

---

## Round 1 — reviewers, verdict, and what was independently re-derived

**Verdict: ⚠️ Changes requested — 8 defects (none blocking).**

**Reviewers run: BOTH. Coverage is COMPLETE, not degraded.**
- Reviewer pass: this reviewer, full independent re-derivation (own measurement script, own diff
  comparison across the filing commit, own history sweep).
- Codex adversarial pass: `codex-cli 0.145.0`, `codex exec --sandbox read-only`, completed exit 0.
  No fallback was used and nothing was skipped.

### The load-bearing claims all hold

Every claim the driver flagged as most consequential was independently re-derived and **confirmed**:

- **The live measurement reproduces exactly.** An independently written script, applying the report's
  stated method (rows matching a `P<n>` cell; status from field 1 of the pipe-split only; closed = cell
  starts with `✅ Done` / `⛔ Cancelled` / `➡️ Moved`; segments = maximal runs of consecutive open rows;
  unreachable = open rows outside the final segment) returns **155 rows / 126 closed (81%) / 29 open /
  5 segments / 16 of 29 unreachable (55%) / 1 singleton — `0143`**. The §1.2 five-segment membership
  table matches **row for row, in order**. Codex's independent parser returned the same.
- **The eight-closed-row finding is exact, and ADR-035's premise is TRUE.** Comparing the board across
  the filing commit by folder ID returns exactly eight rows that carried a closed status before and
  changed rank: `0151`, `0147`, `0150`, `0157`, `0161`, `0148`, `0159`, `0160` — same identities, same
  order as the report's table, all `✅ Done (agent-closed — not owner-verified)` at the time, all moved
  by one. **Both contrary records were confirmed present and false**: the board addendum under
  *"⚠️ One row was inserted mid-board by owner ruling, and it renumbered the board"*, and `0174`'s own
  brief `## Notes`, both stating *"no closed row was renumbered by the insertion."*
- **The decomposition's observed figures are exact.** Departures `0130` and `0136`, both by closing;
  arrival `0174`; denominator 25 → 29 via seven new rows and three closes (`0160`, `0130`, `0136`).
  Prior segment 1 was exactly `{0130, 0136}`, so closing it erased a whole segment — the complete
  explanation for 6 → 5. Only the **impossibility generalization** drawn from it fails (R2).
- **§1.4's cross-validation is substantively true.** A sweep of the board's history found a revision
  reproducing the prior reading **cell for cell** — 148 / 123 (83%) / 25 open / 6 segments / 17 of 25 /
  1 singleton — including the six-segment decomposition. It is simply not identified in the report (R3).
- **The `0173` specimen is verbatim and the wall count is right.** Its brief states *"On merit this
  belongs immediately above `0154`."* Exactly **five** closed rows lie between them on the live board:
  `0157`, `0161`, `0148`, `0159`, `0160` — the named five, in order.
- **The corpus count is right, including the self-correction.** `On merit` appears in **15** brief
  files: **11 of the 29 open** (`0154`, `0155`, `0156`, `0158`, `0163`, `0164`, `0168`, `0170`, `0172`,
  `0173`, `0176`) and **4 closed** (`0150`, `0157`, `0159`, `0160`) — every named list exact. The
  14 → 15 self-correction is sound and **no conclusion depended on the wrong figure**.
- **`0158`'s brief is verbatim as quoted** — *"On merit this belongs at 122"* and the `0142 (P121)`
  pairing, both now stale, in one sentence.
- **18 of 29 open briefs carry no `On merit` phrase**, and 11 + 18 = 29. The arithmetic is internally
  consistent; the **predicate** is the wrong one (R1).
- **ADR-035's number is free.** Highest pre-existing ADR on disk is 034; the only `adr-035` file is the
  new one; no reference outside the new report; no untracked or in-flight ADR collides.
- **The enforcement sites are real.** `claude/skills/fkit-status/dashboard.sh` and
  `test/dashboard-contract.test.js` both exist, and the drift kinds `brief-missing-status`,
  `brief-missing-owner` and `brief-missing-id` are genuinely emitted and genuinely asserted.
- **§5.3 limit 4 is confirmable and confirmed** — the proposed closed-rank-immutability condition does
  flag all eight rows on the filing commit.
- **Quoted rule text is verbatim-accurate throughout.** Every quotation of `/fkit-task-brief` step 5, of
  the board addendum, and of report `0160` checks out against the sources.

### Are the rulings actually rulings? — YES

Step 4's bar is met. All five candidates the brief listed are ruled **by name**: 1 IN; 2, 3, 4, 5 OUT.
Two further candidates the architect added are ruled IN.

**Candidate 6's *"mechanism ruled IN, execution NOT ruled"* is a legitimate distinction, not a survey in
a ruling's clothes.** The mechanism question — *does a rollover restore reachability without renumbering
a closed row?* — is answered affirmatively with a structural reason (the closed rows stay on the frozen
board at the ranks they already hold). The execution question was **deferred by the owner on
2026-08-01**, and the report withholds authorization loudly in three separate places rather than
hedging. Splitting them is what lets the document hold both owner rulings without contradiction. Codex
reached the same conclusion independently.

### Does the ADR match the report? — YES

No material divergence. Shared figures (126 of 155, 16 of 29, five segments), the eight identities, the
narrowing, the canonical merit form, and the rejected options all line up. R8 is the only ADR-side
finding and it is a citation-form point, not a divergence.

### Per-step verdict on the brief's eight verification steps

| Step | Verdict | Note |
|---|---|---|
| 1 — dated report under `reports/` | **PASS** | — |
| 2 — fresh measurement, own as-of date, method stated, prior figures only as comparison | **PASS** | Live measurement reproduced first try. The **cross-validation half** is not replayable as published — R3. |
| 3 — `0161`/`P131` proof case expired; live singleton set named | **PASS** | `0161` confirmed `✅ Done`; live singleton set is exactly `{0143}`. |
| 4 — each candidate ruled IN or OUT **by name** | **PASS** | 5 brief candidates + 2 added, all ruled by name. Candidate 6's split is legitimate. |
| 5 — enforcement: file + condition, **or** the literal words | **PASS** | Both halves delivered — real file and condition in §5.1, literal *"nothing can enforce this"* in §5.2. The condition's **baseline cost** is misstated — R1. |
| 6 — follow-ups named, not filed | **PASS** | Eight named; no brief file created — confirmed against the untracked-file list. |
| 7 — `git diff --stat` clean under `tasks/`, `sprints/`, `wiki-vault/` | **PASS on substance** | See the ruling below. The §10 cell's *"only"* clause is false — R6. |
| 8 — no `.md:` + digits citation | **PASS** | Clean for `\.md:[0-9]` and for any `path:NNN` shape across the report and the ADR. |

### Step 7 — the declared conflict, ruled plainly

**It passes on substance, and the disclosure was the right behavior but is unevenly placed.**

The instrument cannot decide the question either way. `git diff --stat` **over-reports** — it shows two
files under the named paths, `ai-agents/sprints/sprint-2.md` and `0174`'s `brief.md` — and I verified
both are the driver's one-line status flips (`🔲 Backlog` → `🔄 In progress`), made before the ruling
began, not the ruling's work. It also **under-reports**: `plan.md` and `worklog.md` are under
`ai-agents/tasks/` and were created by this task's execution, and are invisible to the command purely
because they are untracked.

**The scope the step exists to protect is verifiably intact**, checked directly rather than through the
command: no brief was filed, nothing was re-ranked, no coordination document was edited, nothing under
`wiki-vault/` was touched, nothing was committed. `plan.md` and `worklog.md` are workflow artifacts the
task process mandates, not products of the ruling — failing on them would make step 7 unsatisfiable by
any task rather than making this deliverable non-compliant.

**I differ from the Codex pass here**, which graded step 7 a failure. My reason: the step's purpose is a
scope guard, and the scope is clean on independent inspection.

**On the disclosure:** the architect flagged the conflict rather than hiding it, which is what the
convention wants. The worklog is fully candid and names the instrument's blindness explicitly. The
report's §10 is weaker — it discloses the two files but not the blindness, and pairs the disclosure with
a ✅ and an *"only"* the same cell refutes. **Adequate in the worklog, marginal in the report** (R6).

### Re-litigates settled decisions (suppressed)

**Empty — nothing was suppressed this round.** Neither reviewer re-raised ADR-035's do-not-re-raise
items (report §3.5 *"make insertions legal"*, report §3.2 *"formalize the owner re-rank act harder"*),
and neither re-raised the closed-row rule. Both of ADR-035's *"re-raise only if"* conditions are
unmet and were not tripped.

### Convergence call

**Act, do not close out.** This is round 1, nothing re-litigates a settled residual, and the eight
findings are all novel. None is blocking: the ruling stands, the ADR's premise is true, and the
headline measurement is exact. R1, R2 and R3 are worth correcting because each is a claim about
measurement or cost inside a document whose authority rests on measurement discipline — and R1's
corrected figure changes the size of a decision already routed to the owner. R4–R8 are accuracy and
citation-form items.

**A regression to avoid:** correcting R1 by loosening §5.1's condition to accept the legacy
`**On merit this belongs …**` shape would re-open exactly what §3.1 ruled — *"the practice is right and
its form is wrong"* — and would defeat the shape half of the guard. The correction that does not
regress is to the **number and the grandfathering scope**, not to the canonical form.
