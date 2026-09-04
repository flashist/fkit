# Give the ownerless source-file coordinate-rot class an owner — measure `test/`, and repair `dashboard.sh`'s self-pointing comment

## ID
0368

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

⭐⭐ **THIS ROW MERGES TWO FOLLOW-UPS THE RECORDS THEMSELVES CALL ONE CLASS.** It was filed as a single
brief deliberately, and the merge is reported rather than silent.

> ⭐ **AMENDED 2026-09-04 — a THIRD instance was folded in by owner ruling `K2`.** The sentence above
> was written when this row carried two halves and **stays as written**; it is now **three**. See
> § *⭐⭐ Instance C* below, `## What to build` steps 5–7, and the dated note in `## Notes`. ⛔ The
> amendment **adds** scope — nothing already in this brief was removed or re-scoped.

**Authority:** [`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md)'s
[`worklog.md`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/worklog.md) —
follow-up row **F5** and §"Named residuals carried out of this sweep" item 8. F5's own words tie them
together: the `dashboard.sh` pointer *"is a source-file line coordinate, a different class from
`0308`'s task-numeral population, and **nothing owns it** — **the same gap round 1's residual 8
recorded for `test/`**."*

⚠️ **No owner ruling attaches to this row.** Both halves are recorded refusals, not `AskUserQuestion`
settlements. Stated so nobody cites a ruling that does not exist.

### The class: source-file line coordinates that no task owns

`0308` owns `claude/`'s task **numerals**. `0309` owns the open briefs. ⛔ **Nothing owns source-file
*coordinates*** — a comment or a test that names a line by number and has since drifted. Both guards
are silent here: neither scans `ai-agents/knowledge-base/`, `claude/`, `bin/` or `test/` for
citations.

### Instance A — `dashboard.sh`'s comment points at the wrong line, verified firsthand

`claude/skills/fkit-status/dashboard.sh:664` reads:

`# NB: no apostrophes in this comment — it lives inside a single-quoted awk program (see line 181).`

⛔ **Line 181 today holds an identity-ordering warning** — *"⚠️ DO NOT "SIMPLIFY" THIS TO
`[ "$a" -gt "$b" ]`"* — **not an awk program.** The awk program this comment actually sits inside
begins at **line 561**. ⭐ The twin NB at **line 427** does sit directly above the awk row-parser, so
the pointer rots in one direction only.

⛔ **Pre-existing at `HEAD` and deliberately not repaired** by `0356`.

⭐⭐ **This is a live specimen of `0344`'s open question** — *"whether `durable-citation-anchors.md`
needs an addendum for **in-code comments citing their own file**"* — because it is exactly that: a
comment citing its own file by bare line number, in a file that grows above it for unrelated reasons.

### Instance B — `test/` is owned by nobody, and its population is UNMEASURED

The records name **one** carrier and **one** numeral: *"`test/prove-red.sh` carries the stale
`pre-task-18` numeral"* — which resolves to **`0073`** (*"Remove `fkit --resume` and the blanket
arg-passthrough"*), evidenced by that file's mutation 2, *"Restore the pre-task-18 `--resume`
passthrough"*, and confirmed by `0073`'s own `## Priority` reading `18`.

⛔⛔ **THERE IS NO CENSUS. No sweep of `test/` has ever been run, and no count of stale coordinates or
numerals inside `test/` exists in any record.** ⛔ **Measuring it is step 1 of this task, not an
assumption it may start from.**

⚠️ **A raw grep will badly overstate the defect.** Measured 2026-09-04, `\btask[ -][0-9]{1,2}\b`
returns **638 occurrences across 14 files** in `test/` — but that population is dominated by **fixture
data and test names**, which are not citations at all. ⭐ **The triage is the work; the count is not
the deliverable.** `0308`'s three-class method — stale citation / correct citation / illustrative — is
the precedent to follow.

### ⭐⭐ Instance C — ADDED 2026-09-04 by owner ruling **K2**: the inbound coordinates `0369` shifted

**Authority:** owner ruling **K2**, given at [`0369`](../../done/0369-amend-the-review-ledger-location-column-to-heading-plus-fragment-for-coordination-documents/brief.md)'s
round-1 process-review on **2026-09-04**, live via `AskUserQuestion` and relayed to a spawned worker —
**the option label is the verbatim text: "Note it in the worklog + fold into 0368 (Rec)"**.

⛔ **This is a fold, not a new task.** K2 named *this* row as the destination because it already owns
the ownerless source-file coordinate class. ⭐ Filing it separately would have duplicated the class —
the exact mistake this brief's own merge note warns against.

**What happened:** `0369` inserted a five-line rule block into
`claude/skills/fkit-stateful-review/SKILL.md` and `claude/skills/fkit-process-stateful-review/SKILL.md`,
which **moved the line numbers that other artifacts cite in those two files**.

#### ⚠️ Two measurements were taken and THEY DISAGREE — both are recorded, neither is discarded

⛔ **Do not treat either figure as settled. Re-measure and state your own corpus.**

| Measurer | Coordinates moved | Artifacts | Corpus |
|---|---|---|---|
| **the coder** | **31 of 47** distinct inbound coordinates (20 into the process skill, 11 into the reviewer skill) | **30 durable artifacts** — **6 ADRs**, **2 `ai-agents/wiki-vault/` pages** | excludes `.git`, `.claude`, `.fkit/tmp/` scratch output, and `0369`'s own folder |
| **the reviewer** (finding R1) | **40 of 61** | **42 artifacts** — 6 ADRs, 3 vault pages | wider; includes scratch output |

⭐ **The gap is corpus, not substance.** The coder re-ran its own count *including* `.fkit/tmp/` and
`0369`'s folder and got **45 of 89 across 42 artifacts** — matching the reviewer's artifact count
exactly. ⛔⛔ **Both measurements agree on the two things that matter: a large inbound surface moved,
and `0369` is NOT the origin of the rot** — several of those coordinates were **already stale at
`HEAD`** before `0369` touched anything (spot-checked: the coder skill's `:195` and `:200-201`, the
reviewer skill's `:95` and `:156`).

⭐ **Recording the disagreement is deliberate.** It is a live demonstration that this class's size is a
function of the corpus you choose — which is exactly why **step 1 of this task demands you state
yours**.

**Shift arithmetic, as measured** (⛔ a dated observation, not a rule to apply blind):
process skill — everything at old line **≥77** moves **+6**; reviewer skill — old **71–136** moves
**+6**, old **≥140** moves **+7**, and old **137–139** was **rewritten outright**.

#### ⛔ Scope of instance C — absorb and measure, do NOT repair on sight

⚠️ **This instance widens the corpus beyond `test/`.** Instance B is a `test/` census; instance C's
30 artifacts sit largely in `ai-agents/knowledge-base/` and `claude/`. ⛔ **Do not let the wider
corpus turn the `test/` census into an estimate** — they are counted separately and reported
separately.

⛔⛔ **THE 2 `ai-agents/wiki-vault/` ARTIFACTS ARE `fkit-wiki`'s AND NOBODY ELSE'S.**
[ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)
is a wall, not a routing preference. ⛔ **Count them, name them, and route them — never edit them.**
This brief's `Out of scope` already forbids vault writes; this restates it because instance C is the
half that actually reaches the vault.

## What to build

**Triage first, repair second, and ⛔ step 2 may not begin on a site step 1 has not classified.**

1. **Census `test/` yourself** — both singular and plural spellings, case-insensitively, counting
   **occurrences** (`grep -o … | wc -l`) not lines, plus bare source-file coordinates. **Record
   before-counts.** ⛔ **State your own numbers; this brief's 638 is a dated observation.**
2. **Triage every occurrence into stale citation / correct citation / illustrative-or-fixture**, one
   row each. ⛔ **A site with no row is an unfinished triage.** ⚠️ Expect most of `test/` to be
   fixtures and test names — say so with the number, rather than repairing them.
3. **Repair the stale citations** to the durable form — folder `NNNN` ID for a task, heading + quoted
   fragment for a coordination document. ⛔ **Never a board rank.**
4. **Repair instance A** — `dashboard.sh`'s `(see line 181)` pointer. ⚠️ **Re-anchor rather than
   re-number:** replace it with a quoted fragment of the awk program it means, so it cannot rot again.
   ⛔ **A fresher bare line number is not a repair.**
5. **Instance C — re-measure the inbound coordinates into the two stateful-review skills** (added
   2026-09-04, owner ruling **K2**). ⛔ **State your corpus before you state your number**, and say
   explicitly whether it includes `.fkit/tmp/` scratch output and `0369`'s own folder — that single
   choice is the whole difference between the two recorded figures. ⛔ **Report against BOTH recorded
   measurements** (31/47 across 30, and 40/61 across 42) and say which your corpus reproduces, or that
   it reproduces neither. ⚠️ **Counting occurrences, not lines.**
6. **Triage instance C's coordinates on the same three-class method**, and repair the stale ones to the
   durable form. ⛔ **The `ai-agents/wiki-vault/` members are NOT repaired here** — count them, name
   them, and **route them to `fkit-wiki`** (ADR-005). ⛔ **A vault member silently omitted from the
   count is a worse failure than one correctly routed.**
7. **Report the ownership gap explicitly** — say whether `test/` should be added to a guard's scope,
   and ⛔ **raise that as a question for the owner rather than deciding it.** ⭐ **Instance C sharpens
   this question**: the moved coordinates sit in `ai-agents/knowledge-base/` and `claude/`, which
   **no guard scans either** — so say whether the gap is `test/`-shaped or wider.

⛔ **Out of scope:** any behavioural change to any script or test — **comments and prose only**; the
guards' target class (that is a separate costing row); `test/fixtures/` content, which is data and
must not be "repaired"; `.claude/` mirror edits; `ai-agents/wiki-vault/`
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. A **census of `test/` exists with its own numbers**, before and after, for both spellings.
2. **The triage table's row count equals the census count.** ⛔ A shorter table fails.
3. The **illustrative/fixture share is stated as a number**, not implied by omission.
4. `dashboard.sh`'s repaired comment names a **quoted fragment, not a line number**, and
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` exits `0`.
5. **`npm test` passes** — ⚠️ this task edits files inside `test/`, so a green suite is a genuine
   gate here, unlike the comment-only halves. ⛔ **But it is NOT a gate on instance C**, whose repairs
   are comment and prose coordinates no test pins — say which halves the suite actually covers.
6. `git diff --stat` shows changes only under `test/`, `claude/`, and — for instance C —
   `ai-agents/knowledge-base/`. ⛔ **Zero changes under `ai-agents/wiki-vault/`** (ADR-005).
7. **Instance C's census states its corpus**, is compared against **both** recorded measurements, and
   the vault members are **counted and routed to `fkit-wiki`, not repaired**. ⛔ A census with no
   stated corpus fails this step.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- ⭐⭐ **AMENDMENT 2026-09-04 — instance C folded in under owner ruling `K2`**, verbatim option label
  *"Note it in the worklog + fold into 0368 (Rec)"*, given live via `AskUserQuestion` at `0369`'s
  round-1 process-review and relayed to a spawned `fkit-producer` with **no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  ⛔ **Filed as an amendment, NOT a new row** — K2 named this row as the destination, and a separate
  brief would have duplicated the class this row exists to own. ⚠️ **This row is now materially
  bigger than when it was filed** — the corpus widened from `test/` + one `dashboard.sh` comment to
  **~30 further artifacts including 6 ADRs**. ⛔ **Re-cost it before ranking**; its `Unscheduled`
  priority was set against the smaller scope and was **not** re-judged by any owner ruling.
  ⚠️ **Two measurements of instance C disagree and BOTH are recorded** — see § *Instance C*; the
  disagreement is corpus, not substance.
- ⚠️ **`0369` has landed** — verified 2026-09-04, its folder sits in `ai-agents/tasks/done/`. Instance
  C's shift is therefore **already in the working tree**, not pending. ⛔ **It is not `0369`'s defect
  to fix** — `0369` is the trigger, not the origin; several of the coordinates were stale beforehand.
this belongs above the individual repairs it generalises, because it is the only row that gives an ownerless class an owner — but its `test/` half is unmeasured, so its true size is unknown and the owner may want the census before ranking it.- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **On merit - ⭐⭐ **MERGE REPORTED:** this row is follow-ups **F5(i)** and the **`test/` gap** filed as one
  task, because `0356`'s own F5 row calls them *"the same gap"*. ⛔ **Filing them separately would
  have duplicated the class.** If the owner wants them split, they split cleanly at step 4.
- ⚠️ **Same family as the source-file-coordinate costing row** (`0176`'s ruling **G3**) — that row
  asks whether the guard's target class *should* widen to cover exactly this rot; this row repairs two
  live instances of it. ⛔ **Neither gates the other**, but whoever runs second should read the first.
- ⭐ **Instance A is live proof for `0344`'s open convention question** — the in-code-comment addendum
  row. Whoever answers that question should be shown this specimen.
** Flagged so the owner can say otherwise.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** keeps them legal.
