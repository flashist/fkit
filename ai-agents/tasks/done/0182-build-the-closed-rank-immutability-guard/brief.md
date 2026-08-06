# Build `test/closed-rank-immutability.test.js` — no closed row's rank ever changes

## ID
0182

## Sprint
Sprint 3

## Priority
2

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**This is follow-up 5 of task `0174`'s decision report**
([the 2026-08-01 merit-ordering report](../../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md),
§5.3 and §8). Report §8 ranks it **LOW**.

**Why it exists.** Report §2 found a breach of an absolute rule that **no existing check caught**, and
that **both written records of the act claimed had not happened**. Task `0174`'s mid-board insertion
renumbered eight closed rows — `0151`, `0147`, `0150`, `0157`, `0161`, `0148`, `0159`, `0160` — and the
board addendum and the brief both asserted *"no closed row was renumbered by the insertion."* The
producer's own check ran in the wrong direction. **A rule this easy to breach while believing you have
not is a rule worth a mechanical guard.**

**The condition.** Across a commit range, for every `ai-agents/sprints/sprint-*.md`: no board row whose
status in the **earlier** revision starts with `✅ Done`, `⛔ Cancelled` or `➡️ Moved` appears with a
different `P<n>` rank in the **later** revision.

**⚠️ Rows are matched by FOLDER ID, never by rank.** Rank is the mutable coordinate this whole task
family is about; matching rows by rank would make the guard's own key the thing it is testing. The
folder-name `NNNN` prefix is identity and nothing else is
([`conventions/priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).

### ⚠️ Its ceiling — four limits, stated here rather than discovered later

1. **It is a diff check, not a state check.** No property of a single board file reveals that a closed
   row was renumbered. The invariant lives **between two revisions**.
2. **It therefore needs git history**, unlike every other test under `test/`. That is a new kind of
   dependency for this suite and a real cost: **it cannot run against a bare working tree or a
   single-commit / shallow clone.**
3. **It asserts a transition, not a state.** It cannot tell you the current board is correct — only that
   a particular change did not break the rule.
4. **It would be red on the commit that filed task `0174`.** The report confirmed this by replaying the
   condition across that commit: all eight rows flag. **That is the test working correctly, and it is
   the argument for building it** — but it means the task cannot land without a baseline decision.

### 🚧 The blocking decision — the baseline

**Report §9 open question 2. Not yet made.** Either:

- **Exempt history before a named commit** — the guard enforces forward only, and the named commit is
  recorded in the test so nobody later reads the exemption as an accident; or
- **Accept a permanently red run** on that range.

**Not choosing means the guard cannot land.**

---

## ✅ DECIDED 2026-08-06 — the blocking decision is DISSOLVED, and twelve corrections follow

> **Everything above this line is left byte-identical.** It records what was true up to 2026-08-06 and
> stays readable. **Where this section contradicts anything above, THIS SECTION GOVERNS.** The `🚧` in
> the heading immediately above no longer describes reality: **this task is not blocked.**

### Authority — three owner rulings, in sequence

All via `AskUserQuestion` in a live `fkit lead` session, **2026-08-06**:

1. On who settles the baseline question — **"Have the architect decide it."**
2. The architect delivered; on CI — **"No CI planned."**
3. On the `HEAD` ↔ `HEAD^` second leg — **"Include it."**

A fourth ruling the same day — **"Pull it into Sprint 3."** — is what put this task on the active
board at `P2`, below its gate `0181`.

### The decision

**Baseline = `HEAD`. Scope = the transition currently in progress — not a history range.**

The guard compares each board file's **working-tree** content against its **`HEAD`** blob, and asserts
that no row closed in the `HEAD` revision carries a different `P<n>` in the working tree. **Plus a
second leg comparing `HEAD` against `HEAD^`** (owner-ruled: include it; **skip that leg cleanly at
depth 1**, where `HEAD^` does not exist).

**The deciding criterion, in the architect's words:** *"A baseline must be a record you cannot rewrite
in the same act that breaks the invariant."*

**Rejected, by name and for the record:**

- **A committed snapshot / manifest of ranks** — *"a manifest's only repair path is 'regenerate from
  the current board,' and that launders the breach into the baseline."*
- **A git-history range** — unbounded cost, and it carries the permanent red that created this
  blocking decision in the first place.

**⚠️ This DISSOLVES the blocking decision above rather than answering it.** With no range, `0174`'s
filing commit is **not red and is not exempted** — it is simply **outside the guard's stated scope**.
That distinction is the point: **a scope is a definition you state once; an exemption is a carve-out
every future reviewer re-litigates.**

### The twelve corrections — all of them apply

Each names the original text it supersedes by **quoted phrase**, not by line number.

1. **§"🚧 The blocking decision — the baseline" is SUPERSEDED IN FULL.** Both branches it offers
   (*"Exempt history before a named commit"* / *"Accept a permanently red run"*) assume a history
   range, and **neither is chosen**. Replace with: baseline `HEAD`, scope the current transition, plus
   the `HEAD` ↔ `HEAD^` leg.

2. **Ceiling limit 2 is REWRITTEN.** *"it cannot run against a bare working tree or a single-commit /
   shallow clone"* is now **wrong in both halves**. Correct statement: **it needs a git repo with at
   least one commit; it works at `--depth 1`** (the `HEAD` leg runs; the `HEAD`↔`HEAD^` leg skips with
   a stated reason); **a non-git tree skips with a stated reason.**

3. **Ceiling limit 4 is DELETED and REPLACED.** *"It would be red on the commit that filed task
   `0174`"* is no longer true of the shipped guard — that commit is outside its scope. **The new
   fourth limit, which must be stated in its place:** the guard sees **only the current uncommitted
   transition, plus the last committed one**. **A breach committed with no test run in that window is
   never caught. And there is no CI, so nothing runs it automatically** (owner, 2026-08-06: *"No CI
   planned."*). ⛔ Do not present this guard as continuous protection.

4. **The glob is FIXED.** *"for every `ai-agents/sprints/sprint-*.md`"* misses **archived boards under
   `ai-agents/sprints/done/`** — **live, not hypothetical, since the 2026-08-06 rollover** moved Sprint
   2 there. **Cover both locations.** **Exclude `ai-agents/sprints/backlog.md`, and state the reason in
   the code:** it is unranked by design and every Priority cell reads `—`, so it has no rank to hold
   still. This **discharges** the ⛔ DO-NOT-BUILD note in `## Notes` — see its own dated correction.

5. **The join key is `(board basename, folder ID)`, NOT folder ID alone.** A folder ID legitimately
   appears on two boards at different ranks after a move or a rollover — `0181` and `0182` do so
   **today** — and a global join false-flags every moved row. Keying on basename also makes the
   archival rename (`sprint-2.md` → `done/sprint-2.md`) transparent, since the basename is unchanged.
   ⚠️ **The rule *"Rows are matched by FOLDER ID, never by rank"* is RIGHT and STAYS.** This
   **narrows** it; it does not weaken it. Rank is still never a key.

6. **⚠️ THE PARSER CANNOT BE A LINE-SHAPE REGEX — the boards contain decoy tables that look like board
   rows.** Re-measured first-hand in `ai-agents/sprints/done/sprint-2.md` on **2026-08-06**: the real
   `## Status` table is **189 rows** (188 closed, 1 open, `P1`–`P189`), and **a further 7 rows in a
   later addendum table carry BOTH a folder-ID brief link AND a `P<n>` cell** — indistinguishable from
   a board row by shape alone. Additional addendum tables carry a `P<n>` cell without a link. A naive
   regex ingests these as extra `(folder ID, rank)` pairs and **corrupts the join**.
   **Required:** anchor the parse to the header row **`| Status | Priority | Task | Brief |` under
   `## Status`**, and consume **contiguous table lines until the first non-table line**. Verified
   2026-08-06: that header appears **exactly once** in each of the four board files.

7. **⚠️ PIPES APPEAR INSIDE CELLS — 8 of the 189 rows mis-field under a naive `split('|')`.**
   Re-measured 2026-08-06 on the same board. **The brief's *"Status is field 1 of the pipe-split"* is
   unsafe as written.**
   **⚠️ AND THE ARCHITECT'S STATED CAUSE COVERS ONLY 7 OF THE 8 — corrected here, first-hand.**
   - **7 rows** carry an **escaped `\|`** inside prose (one carries two, one carries three).
   - **1 row does not** — the `0169` row (*"Point the stateful-review close conditions…"*) carries a
     **bare, UNESCAPED `|` inside a backtick code span**: `` `Status: in-review | closed-out` ``.
     **Handling escaped `\|` alone still mis-fields it.**
   **Required:** handle the escaped form, **and** make the **fail-loud rule the load-bearing half** —
   **any row that does not yield the expected field count must FAIL, never be skipped.** ⛔ **A
   silently skipped malformed row is a vacuous pass**, and it is precisely how the one row an escaping
   fix does not cover would disappear.

8. **Add a vacuous-pass assertion**, following the precedent already set in
   `test/task-id-uniqueness.test.js` (its live-corpus test asserts a non-zero record count for exactly
   this reason). **Assert the live-corpus closed-row count is non-zero**, so a future parser change
   cannot silently go green over a corpus it stopped reading.

9. **Verification step 3 is REWRITTEN, not dropped.** *"Replay the condition across the commit that
   filed task `0174`"* is no longer something the **shipped guard** does — it is outside scope. ⛔ **Do
   not delete this check.** It is the **strongest evidence the detection logic actually works.**
   **Keep it as a fixture test over a pure, exported comparison function**, fed the two `0174`
   revisions as fixture data, asserting it flags **exactly** `0151`, `0147`, `0150`, `0157`, `0161`,
   `0148`, `0159`, `0160` — no more, no fewer.

10. **⚠️ UNRECORDED PROVE-RED DEPENDENCY — flagged, not resolved here.** Verification step 6 requires a
    mutation that reds the new assertion. Verified 2026-08-06: **all 14 mutations in
    `test/prove-red.sh` reach their target either via `FKIT_LAUNCHER` or by copying `claude/` + `test/`
    into a throwaway tree — neither reaches `ai-agents/`**, and the file states outright that the suite
    *"walks it against the real, untouched `ai-agents/` live home"*. ⛔ **prove-red must never edit the
    real boards.** The **pure-function-plus-tmpdir-fixture shape in item 9 is what supplies the
    mutation seam.** **Tasks `0214` and `0215` are open and sit on exactly this ground** — **sequence
    after them, or state the gap explicitly in the close report.** Silence here is not acceptable.

11. **Add the `➡️ Moved` note.** A moved row's rank on its **source** board is **frozen**, and is
    **never** compared against that task's rank on the **destination** board. (Item 5's basename key is
    what makes this expressible at all.)

12. **`0181` stays a HARD dependency — unchanged, and correct.** The guard enforces the rule `0181`
    writes down; shipping it first enforces a rule the skill still contradicts.

### Cross-reference — `0240` records this as an ADR, and must not duplicate this brief

[`0240`](../../backlog/0240-record-the-adr-for-the-closed-rank-guards-baseline/brief.md) records the decision
above as an ADR and is **explicitly barred from editing this brief** — it hands that edit to the
producer, which is this correction. **Division of labour, so neither duplicates the other: `0240`
carries the DECISION and its rejected options; this brief carries the BUILD.** ⚠️ `0240`
**hard-depends on `0222`** for its ADR number. **That is `0240`'s dependency, not this task's — do not
inherit it.** This task's only hard dependency remains `0181`.

⚠️ **Citations in this section are by heading plus quoted phrase, per the `0160`/`0176` durable-citation
policy.** The measurements above (189 rows, 8 mis-fielding rows, 7 decoy rows, 14 mutations) were taken
**2026-08-06** and are **mutable** — **re-measure before building** and report any movement.

## What to build

`test/closed-rank-immutability.test.js` — a hand-rolled `node --test` file picked up by `npm test`'s
existing `node --test test/*.test.js` glob. **No new devDependency** (ADR-014).

1. Resolve the commit range to compare. State how the range is chosen, and make it work in CI and
   locally, or state plainly which it does not work in.
2. For each `ai-agents/sprints/sprint-*.md` in both revisions, parse rows into `(folder ID, status,
   rank)` triples. **Status is field 1 of the pipe-split; closed means the cell *starts with* one of the
   three closed markers** — the same reading report §1.1 used, so results are comparable.
3. Join earlier-to-later **on folder ID**. For every row closed in the earlier revision, assert its
   `P<n>` is unchanged.
4. Implement the chosen baseline exemption **in the guard's definition**, not as a post-filter bolted
   on — the same lesson task `0176`'s closed-ledger exemption records.
5. **Fail loudly and usefully:** the failure message must name the folder IDs, their old rank and their
   new rank. A guard that says only *"a closed row moved"* leaves the reader doing the eight-row diff by
   hand, which is the work that was skipped in the first place.
6. **Skip cleanly with a stated reason when git history is unavailable** — a shallow clone must produce
   a clear skip, not a false pass and not a confusing crash.

### Out of scope

- **⛔ Do not repair the eight renumbered rows.** ADR-035 rejected reverting by name: it renumbers the
  same eight closed rows a second time. The record is corrected by task `0183`.
- **⛔ Do not add a devDependency.** ADR-014.
- **⛔ Do not edit any sprint board.**
- **⛔ Write no `:NNN` line-number citations.**
- **⛔ Do not touch `ai-agents/wiki-vault/`.**

## Verification steps

1. `test/closed-rank-immutability.test.js` exists and is picked up by `npm test` with **no** change to
   `package.json`.
2. The join is **on folder ID**. Prove it: a test case where a closed row's rank changed and another
   row took its old rank must still flag the closed row.
3. Replay the condition across the commit that filed task `0174` and confirm it flags **exactly** the
   eight rows named above — no more, no fewer. Report the list.
4. Under the chosen baseline, `npm test` is green. State which baseline was chosen and why.
5. In a repository without git history (simulate a shallow clone), the test **skips with a stated
   reason** — it does not pass silently and does not crash.
6. `npm test` passes including `test/prove-red.sh`'s hard gate; a mutation makes the new assertion fail.
   **Report the red run, not only the green one.**
7. **State all four ceiling limits in the close report.** A close report presenting this guard as a
   general check on board correctness has failed verification.
8. `grep` for `\.md:[0-9]` over the changed files returns nothing.

## Notes

- **Depends on:** `0181` — the guard enforces the rule `0181` writes down, and shipping the guard before
  the rule is narrowed enforces a rule the skill still contradicts. **And a baseline decision that is
  not yet made** — see above.
  - **⚠️ DATED CORRECTION 2026-08-06 — the baseline clause is DISCHARGED. Line left byte-identical.**
    The baseline decision **has been made** (owner: *"Have the architect decide it."* → architect
    delivered → *"No CI planned."* + *"Include it."*). **Current dependency: `0181` only — hard.**
    See §"✅ DECIDED 2026-08-06" above. ⚠️ **Sequencing note, not a dependency:** correction 10 there
    flags `0214`/`0215` as the prove-red seam — **sequence after them or state the gap explicitly**.
- **Blocks:** nothing.
- **Priority: LOW.** Report §8 ranks it LOW: it guards a rule that is breached rarely and loudly, and it
  costs more than the other guard.
- **⚠️ Priority 160 is append rank, NOT a merit ranking — flagged for owner confirmation.**
- **On merit:** as ranked — it must land after `0181` and it is the lowest-urgency item of this batch,
  so append rank and merit position coincide.
- **Merit form used here** is the canonical `**On merit:**` shape from report §3.1 / ADR-035. Flagged so
  it is not read as drift.
- No existing row was renumbered by this brief.

- **⚠️ DATED CORRECTION 2026-08-06 — pulled onto Sprint 3 by the rollover.** The append-rank and
  merit-divergence notes above describe this brief's position on the board it came from and **no longer
  describe its position today**. Sprint 3 is a **fresh board with no closed rows**, so its `P1`–`P3` were
  assigned **on merit, freely** — ADR-035's closed-row wall does not apply there yet, and no append/merit
  divergence exists on that board. **The original notes are left byte-identical**; scope, dependencies and
  prohibitions are unaffected. Ranking rationale: `ai-agents/sprints/sprint-3.md`, §"How this board was
  ranked". Pulled by owner ruling, `AskUserQuestion`, live `fkit lead` session 2026-08-06.
- **Ranked `P2` on Sprint 3**, directly below its gate `0181`. **This is the row the owner named**
  (*"Pull it into Sprint 3"*); `0181` came with it because the dependency is hard.
- **🚧 ⛔ DO NOT BUILD THIS AGAINST THE GLOB THIS BRIEF CURRENTLY SPECIFIES.** The condition above globs
  `ai-agents/sprints/sprint-*.md`. As of 2026-08-06 the Sprint 2 board lives at
  `ai-agents/sprints/done/sprint-2.md`, which that glob **does not match** — so the guard as specified
  would run **green over all 188 closed Sprint 2 rows**, the exact history it exists to protect. A
  **separate unit is queued to repair this brief**; it was deliberately not repaired by the rollover.
  Related: an archived board is **moved, not frozen** — Sprint 1's was edited three more times after
  archiving, so the guard must keep watching `sprints/done/` rather than assuming it is inert.
  - **⚠️ DATED CORRECTION 2026-08-06 — THE REPAIR HAS NOW LANDED. THIS BLOCK NO LONGER BLOCKS THE
    BUILD. Text above left byte-identical.** The *"separate unit queued to repair this brief"* **is
    this correction**. See §"✅ DECIDED 2026-08-06" → **correction 4**: the guard now globs **both**
    `ai-agents/sprints/sprint-*.md` **and** `ai-agents/sprints/done/sprint-*.md`, and **excludes
    `backlog.md` with a stated reason** (unranked by design, Priority cells read `—`).
    ⚠️ **The `🚧` and `⛔` markers above are stale — this task is NOT blocked and IS buildable**, but
    **only against the corrected specification**, never against the glob written in §"The condition".
    ⚠️ **The *"moved, not frozen"* observation stays fully live** and is now load-bearing twice over:
    it is why `sprints/done/` must be watched (correction 4) and part of why the join key gained a
    board basename (correction 5).
