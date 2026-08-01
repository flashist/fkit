# Worklog — task 0174

## 2026-08-01 — investigation, owner rulings, and the written ruling

### What was produced

- **Decision report:** `ai-agents/knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md`
- **ADR-035:** `ai-agents/knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md`

Nothing else was written or edited. No brief was filed, nothing was re-ranked, no skill / script / test
was touched, nothing was committed.

### Measurement — as of 2026-08-01 18:32 MSK

Method: rows of `ai-agents/sprints/sprint-2.md` matching a `P<n>` cell; status read from field 1 of the
pipe-split only; closed = starts with `✅ Done` / `⛔ Cancelled` / `➡️ Moved`; a segment is a maximal run
of consecutive open rows; unreachable = an open row not in the final segment.

**155 rows / 126 closed (81%) / 29 open / 5 segments / 16 of 29 unreachable (55%) / 1 singleton
(`0143`).**

**Method cross-validated:** replaying the identical script against the board revision report `0160`
read reproduces its figures exactly — 148 / 123 (83%) / 25 / 6 / 17 of 25 / 1 singleton — including its
six-segment decomposition. ~~Reverse-shifting the live board gives the same six segments.~~
**⚠️ Superseded — see the correction section below (R3, R4): the revision is `afe4fae` and the
reverse-shift sentence was false.**

### The load-bearing finding in the measurement

The unreachable **share** fell 68% → 55%, and that is **not progress**. **No open row moved from
unreachable to reachable** — ~~the transition is impossible under the current rule~~ **⚠️ Superseded
(R2): the measured zero is right; the impossibility claim is FALSE — a third route exists.** The 17 → 16 change
decomposes as: two departures, both by **closing** (`0130`, `0136`, this run's own closes, which
together were an entire segment — hence 6 segments → 5); one arrival (`0174` itself); and a denominator
inflated by seven fresh appends. The metric improves only by **attrition** and **dilution**.

### The finding the brief did not anticipate

Verified against the filing commit's own diff: `0174`'s own mid-board insertion **renumbered eight
closed rows** — `0151`, `0147`, `0150`, `0157`, `0161`, `0148`, `0159`, `0160`. The sprint-2 board
addendum and `0174`'s own brief both state *"no closed row was renumbered by the insertion"*, and **both
are false**. Named in the report; **not repaired here** — that is the producer's follow-up 6, by dated
correction note, **not** by revert.

### Other confirmations

- `0161` (the prior report's headline proof case) is `✅ Done` — **expired, confirmed**.
- Live singleton set is exactly one: `0143`, one rank lower than the prior report printed (that figure
  was a pre-insertion rank).
- Stronger live specimen: `0173` — *"On merit this belongs immediately above `0154`"*, urgent, with
  **five closed rows** between them.
- `On merit` appears in **15 brief files** — 11 of the 29 open sprint-2 briefs, 4 closed. `0158`'s
  writes a bare rank (*"belongs at 122"*) and a `0142 (P121)` pairing — the practice reproducing case 1
  inside itself.
- **18 of the 29 open sprint-2 briefs carry no merit statement** — the grandfathering decision the
  proposed guard needs. **⚠️ Superseded (R1): 18 is the presence-failure count only. Against the
  canonical `**On merit:**` form the guard actually specifies, **zero** briefs conform, so it is red on
  **29 of 29**.**

### Owner rulings taken (2026-08-01, `AskUserQuestion`, live driver session)

1. Ruling signed as recommended — candidate 1 **IN**; 2, 3, 4, 5 **OUT** by name; 6 and 7 **IN**; step
   5's wall clause **stays**, consequence accepted, with the mid-board-insertion narrowing; enforcement
   answer **split**.
2. Closed-row breach: **correct the record, do not revert.**
3. **Write the ADR.**
4. Sprint rollover: **noted as a follow-up, decided later — not ruled.**

### Self-verification

- `grep -nE '\.md:[0-9]'` over the report and the ADR: **no matches** (also no match for any
  `path:NNN` shape over `.md` / `.sh` / `.js` / `.mjs`).
- `git diff --stat`: only the two status-flip edits the driver made **before** this ruling began
  (`ai-agents/sprints/sprint-2.md` and this brief, `🔲 Backlog` → `🔄 In progress`, one line each).
  This ruling changed **no** tracked file under `ai-agents/tasks/`, `ai-agents/sprints/` or
  `ai-agents/wiki-vault/`. This `plan.md` / `worklog.md` pair is new and untracked, so it does not
  appear in `git diff --stat` at all — flagged here rather than left for the driver to discover.

---

## 2026-08-01 — round-1 stateful review: 8 findings, all owner-ruled, all applied

Reviewer ledger: `review.md` in this folder. **Verdict was ⚠️ Changes requested — 8 defects, none
blocking.** The reviewer independently re-derived the headline measurement and it **matched exactly**,
and confirmed **ADR-035 does not rest on a false premise** (the eight-closed-row finding is exact —
same eight identities, same order, both contrary records present and false).

`/fkit-process-stateful-review` was **not run** — it is the coder's skill and the ADR-018 hook denies it
to the architect. Its **method** was applied by hand: every finding re-verified against the artifacts
before any edit.

**All 8 owner-ruled CORRECT on 2026-08-01; all 8 independently re-verified here and confirmed; all 8
applied.** Per-finding verdicts and actions are in `review.md` under *Coder response*.

- **R1** — guard is red on **29 of 29** open briefs, not 18 (**0** briefs match the canonical
  `**On merit:**` form; all 15 use the legacy shape). §5.4b rewritten with a breakdown table; §8
  follow-up 3 and §9 open question 1 resized. **§5.1's canonical form deliberately NOT loosened** — the
  reviewer flagged that as a regression and the owner honored the warning.
- **R2** — the impossibility claim was false. §1.3 now states **three** routes; the third is **segment
  rollover** (simulated: 7 rows). The measured zero is kept and still carries the ruling.
- **R3** — §1.4 now names the revision (**`afe4fae`**) and **ships the script**. The contradicting
  candidate (`aa62e6d`, the commit that added report `0160`) is named too, so nobody repeats the sweep.
  **⚠️ Recorded discrepancy:** the relayed ruling called the reproducing revision the filing commit's
  *grandparent*; measured, the grandparent returns the contradicting 148/124/24 and the
  **great-grandparent** returns the ruling's own stated figures. Figures right, ancestry label off by
  one — resolved by citing the SHA. Detail in `review.md`.
- **R4** — the false "reverse-shifting gives the same six segments" sentence deleted; replaced with the
  true reason for 6 → 5 (segment 1, `{0130, 0136}`, closed).
- **R5** — **22** open rows moved, not twenty (30 total = 8 closed + 22 open, all +1, exactly the old
  `P119`–`P148` band). §1.3's "+7 new **appended** rows" corrected — six appended, plus `0174`
  **inserted**, which is the report's own central finding.
- **R6** — §10's step-7 `only` removed; the instrument's blindness to untracked files now stated in the
  report, not just here.
- **R7** — dangling `(§6.1)` → `(§6)`.
- **R8** — *"four bullets later/apart"* removed from **both** documents. It was a positional coordinate
  into a mutable skill file — the exact citation class this task descends from — and miscounted (4th
  bullet, 2 after the exception). Both now anchor by step heading plus quoted text, and ADR-035's
  citation-form banner bans bullet ordinals by name.
- **Knock-on found while sweeping R1:** §5.4a's cost (a) restated — a backfill done to clear cost (b)
  can extinguish the drift flag while leaving the bare-rank defect in the brief.

**Not adopted as an accepted residual:** the step-7 instrument weakness (`git diff --stat` is blind to
untracked files). The owner did not select it, so it is **not** protected from re-litigation; it stays
documented in the reviewer's section of `review.md`.

### Re-verification after the edits

- **Brief step 8 — PASS.** `grep -nE '\.md:[0-9]'` over both corrected documents: **no matches**.
  Broader `path:NNN` and generic `word:NNN` sweeps: **no matches**. R8's fix introduced none.
- **Measurement re-run — unchanged:** 155 / 126 (81.3%) / 29 open / 5 segments / 16 of 29 (55.2%) /
  1 singleton (`0143`).
- **Published script verified as published** — extracted back out of the report's `bash` block and
  executed; reproduces the live reading, `afe4fae`'s prior reading cell-for-cell, and `aa62e6d`'s
  contradicting reading.
- **Every changed figure swept for all occurrences** and confirmed consistent. ADR-035 carries no figure
  touched by R1 or R5.

### Scope held

Still no implementation — `/fkit-task-brief`, `dashboard.sh`, `test/` and every skill untouched. No
brief filed, nothing re-ranked, the board addendum and this brief not edited (follow-up 6, the
producer's). Nothing under `ai-agents/wiki-vault/`. Nothing committed. The reviewer's *Reviewer
findings* section was not modified.
