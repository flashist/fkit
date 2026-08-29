# Write the `durable-citation-anchors` convention page — dual-homed into the scaffold

**Source**: `ai-agents/tasks/done/0171-write-the-durable-citation-anchors-convention-page/brief.md`
**Status**: done — ⛔ **`✅ Done (agent-closed — not owner-verified)`. No human has verified this row.**
**Sprint/Tag**: Sprint 6 `P2` · task `0171` · owner `fkit-architect` · closed 2026-08-22

## Goal

Follow-up 1 of [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] (`0160`): turn that
report's §1 ruling into the **standing rule**, as a new convention page — because
`conventions/README.md`'s own root rule forbids promoting a report into `conventions/`. The rule the
page carries: *line numbers are for findings against a revision; names are for cross-references into
living documents*, plus the rider that outranks it — **never cite a line number naked**.

It grew **two more deliverables by owner ruling** and shipped all three.

## Key Changes

### Deliverable A — the page, dual-homed byte-identically

`ai-agents/knowledge-base/conventions/durable-citation-anchors.md`, written twice:

- `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`
- `claude/scaffold/ai-agents/knowledge-base/conventions/durable-citation-anchors.md`

✅ **Re-measured by this ingest 2026-08-22:** `diff` exits 0, both copies `sha256`
`2ef1f155556154230fd6b7cad10b81705185e66bb0eb91a8360c4466199c7933`, **233 lines / 15825 bytes**, and
the row is present in **both** `conventions/README.md` copies' *"What's here"* tables.

Its sections: *Never cite a line number naked* · *Which anchor for which target* (the five-row table
with its `Because` cells, plus **applying the two conditions to a target the table does not name**) ·
*Citing a task* · *Link labels* · *Review-ledger practice* · *Verifying a claim about text* ·
*Where this is enforced* · *Provenance*.

⛔ **Two constraints the owner accepted at the 2026-08-01 dual-home ruling, and they bind every future
edit:**

1. Every edit is bound to **two byte-identical files** (`conventions/dual-home-parity.md`).
2. **The `0160` report may be cited from the page by NAME only, never linked** — the scaffold's
   `reports/` folder ships empty, so a relative link would resolve in this repo and dangle in every
   consuming project. ⭐ *That is the exact defect class the page is about.*

⚠️ **The R20 narrowing must not be undone.** The link-label rule ships as *"do not use a mutable
location as the visible label of a forwarding link into a living document"* — **not** the withdrawn
*"a link's display text must never be a mutable coordinate"*, which contradicted the page's own table
row 1 (a `path:NNN` into a source file **is** correct in a design doc).

⚠️ **§1's R22 scope note is mandatory, and the reason is this task.** The claim-versus-pointer question
is a **first cut, not the test**: walked against the five rows it decides **one** cleanly, and a writer
applying it alone *"will get row 3 wrong in the unsafe direction"*. Both conditions must be read
together.

⭐ **Piece 7 — verifying a claim about text — was folded in 2026-08-14** by owner ruling (verbatim
option label ***"Fold it into `0171` (Recommended)"***), on a live specimen: the backlog triage had
verdicted task `0154` `STALE-PREMISE` because a single-line `grep -c` returned **0** across the three
wiki skills — **and the clause is live in all three**, wrapped across a line break. Acting on that
verdict would have deleted a live rule from three files that ship into every consuming project.
⚠️ **The squeeze is load-bearing:** the form is `tr '\n\t' '  ' | tr -s ' '`; a bare `tr '\n' ' '`
still misses it in 2 of 3 files, because the continuation line's indent survives the join. ⭐ **Point 4
is what keeps the rule cheap: only ABSENCE claims need the expensive form** — a presence claim cannot
fail this way. ⛔ **The known limits are listed rather than footnoted** — split table cells, wording
drift, code fences read as prose, hyphenation across a line break.

### Deliverable B — the displaced `adr-010:NNN` pointers, and the cascade it measured

Folded in by owner ruling 2026-08-02 (*"fold into the durable-citation-anchors work (`0171`) — do NOT
file standalone"*): the 12 pointers [[tasks/append-a-dated-correction-note-to-adr-010]] (`0143`)
displaced when it appended `+71 / −0` lines to ADR-010, **two of them naked** and landing on unrelated
text.

⚠️ **The citation set grew twice, and the counts are the record: 12 → 13** (a further `adr-012:67-76`
in ADR-018, owner-ruled in mid-run) **→ 23** (ten more `adr-012:NNN` pointers, repaired under the
verbatim ruling *"Repair all 10 now, strip-`:NNN` (Recommended)"*).

✅ **Re-measured by this ingest 2026-08-22:**
`grep -rno "adr-010:[0-9,-]*" ai-agents/knowledge-base/decisions/` returns **zero occurrences** — no
`adr-010:NNN` pointer survives anywhere under `decisions/`.

⭐ **Its best find is a correction against itself.** The worker first recorded — and was asked to state
more strongly — that *"this task caused the displacement it is now repairing."* **That is false, and
the measurement is on the record instead:** `adr-012`'s blob is byte-identical between ADR-018's
creation commit and `HEAD`, and testing each pointer against its own citing claim at that revision
shows they were **defective at authoring** (`adr-012:130` was off by 11 lines the day it was written;
`adr-012:92` was a blank line). This task's `+6` lines made an **already-broken pointer more broken,
not a working one broken**. *A smaller fault than the one first recorded, and the one the evidence
supports.*

⭐ **Does the strip-`:NNN` repair terminate? MEASURED — yes, at wave 2, with zero repairs needed.**
The page's central argument was tested rather than restated: residual `adr-010:NNN` **0**, residual
`adr-012:NNN` **0**, exactly one inbound `adr-016:NNN` in `decisions/` and it is **above** every edit
so it did not move (verified by string comparison, not arithmetic), and a **wrap-aware absence sweep
per the page's own Piece 7** confirmed the enumeration was not a false zero. **An append-and-strip
repair is convergent: a pointer anchored to a heading plus a quoted fragment cannot move at all.**

### ⛔ Verification step 8 is SUPERSEDED, not met — read this before citing step 8

Step 8 said verbatim *"No file under `ai-agents/tasks/`, `ai-agents/sprints/` or
`ai-agents/wiki-vault/` is modified."* Three facts that must be read together:

1. **It was NOT met literally.** The run modified `ai-agents/sprints/backlog.md` at five lines. **A
   real, disclosed deviation. It is not marked met.**
2. **Those edits were citation-text-only and zero-net** — no `## Status`, no rank, no row order, no row
   count. Ledger round **R9** caught the worklog *falsely claiming `backlog.md` was untouched* and
   forced the correction.
3. **A later owner ruling governs.** The edits were made under a live relayed ruling (*"Repair the
   authorized surfaces only (the worker's recommendation)."*), and the supersession itself was ruled
   **2026-08-22**, verbatim option label ***"Ruling governs — record it (Recommended)"***.

⛔ **The five `backlog.md` edits stand and are not to be reverted. Step 8 stays written as it was — it
is superseded, not amended.**

## Outcome

**Closed 2026-08-22 as `✅ Done (agent-closed — not owner-verified)`** by a **spawned** `fkit-producer`
with **no owner channel** ([[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]),
so per [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] §5 the close is **not
owner-verified**. ⛔ **The MEETS verdict, the two review rounds and the owner rulings above do NOT
upgrade that** — no human has checked this row.

**Close basis, as recorded — ⚠️ figures carried from the task's own record, NOT re-run by this ingest:**

- Re-verified 2026-08-22 by a spawned `fkit-coder`: **VERDICT: MEETS**, 17 criteria, 16 met (step 8
  superseded); `node --test` **732 / 732, 0 fail**.
- The build-time full run 2026-08-15 was **730 tests, 730 pass, 0 fail**, `npm test` exit 0, taken
  *after* Deliverable B. ⚠️ **The two figures are different dates, not a discrepancy** — and neither
  was re-run here.
- Reviewed **twice**. ⚠️ **The rounds had different coverage and the ledger records it as such:**
  round 1 (2026-08-15) `fkit-reviewer` **+ Codex `gpt-5.6-sol`, both ran — coverage FULL**, 7 findings;
  round 2 the **same day, `fkit-reviewer` alone — single-reviewer coverage, no Codex pass**, by the
  driver's instruction, 5 findings. Verdict verbatim: *"Called proactively: `0171` has converged.
  Recommend closeout after R12."*
- ⚠️ **The close recovered an interrupted one** — a previous spawned producer completed the folder move
  and died on an infrastructure error before sweeping references. The move was not redone.

⭐⭐ **The task's own honest pattern, and it is the strongest evidence for the page it ships: FOUR
distinct instances in one task of a matcher or a count returning a figure that was too low** — the
round-1 `adr-016:292` under-count (four found, **six real**, because two sites use the elided-filename
notation the pattern could not match), the R7 false zero, a wrong `backlog.md` line-count figure, and
an incomplete `tasks/backlog/` enumeration. The reviewer's call: *"Further rounds would keep finding
instances of the thing the page exists to warn about. Stop here."* ⭐ **A citation-decay sweep is only
as complete as the set of NOTATIONS its pattern knows.**

**Residuals — recorded, not repaired:**

- ⛔ **The page is enforced by nothing**, as its own *Where this is enforced* section says. The guard is
  task `0176`, **open**.
- ⚠️ **`0171` silently discharged work belonging to open task `0232`** — Class 5 in full (9
  `adr-010:NNN` occurrences) and Class 4 item 3; `0232`'s remainder fell **26 → 16**. ⛔ The overlap
  was silent — neither `plan.md` nor the earlier worklog mentioned `0232` — and **`0232` runs only
  after `0171` commits**, because a revert grows the remainder straight back to 26.
- ⚠️ `adr-043:19` still reads *"across 48 inventory rows"* where it is now 49 — a **residual, not a
  defect**, because accepted ADRs stay byte-identical with dated corrections.
- ⚠️ `adr-031:27`'s co-cited `fkit-lead.md:20-24` is stale; it is a source-file `path:NNN`, which the
  page's own table row 1 rules **correct**, and outside this task's scope. Flagged, not touched.
- ⚠️ **The two boards disagree** (`backlog.md` vs `sprint-6.md` on the same citation) — ⛔ **deliberately
  not converged**: a reasoned residual of the owner's ruling, not drift.
- ⚠️ A **pre-existing uncommitted `+4` hunk** in `backlog.md` may displace pointers below its line —
  **that other change, not this one.** Flagged, not swept.
- ⚠️⚠️ **Its recorded serialization constraint was NOT met, and this vault is the first record to say
  so.** The brief carries a `⛔ SERIALIZATION` note binding Deliverable B to run **after all three
  ADR-010 appends** — `0195` → `0196` → `0197` → `0171` → `0199` — with the stated reason that
  re-anchoring earlier *"measures against a moving baseline and the new anchors re-rot on the next
  append."* **Measured 2026-08-22 at ingest: `0196` and `0197` both read `🔲 Backlog`.** `0171` ran
  **third from the front of a five-link chain, not fourth.** ⚠️ **Whether that matters is an open
  question, not a defect this page asserts** — the repair **stripped `:NNN` and anchored to heading plus
  quoted fragment**, which the task itself measured to be append-immune, so the stated harm may not be
  reachable. ⛔ **But nobody ruled on running it early, the brief's own reason for the ordering was never
  withdrawn, and the exposure — a quoted fragment breaking if `0196`/`0197` change ADR-010's *text*
  rather than appending to it — was not assessed by anyone.** Returned to the owner, not resolved here.

## Related
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, the ruling this page
  writes down; this task is its **follow-up 1**
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — its board; this is `P2`, and it shipped
  **after** `P3`–`P8` despite the board's own dependency order putting it first
- [[tasks/append-a-dated-correction-note-to-adr-010]] — `0143`, whose `+71 / −0` append displaced the
  12 pointers Deliverable B repaired
- [[tasks/repair-the-three-decay-shapes-across-the-open-backlog-briefs]] — `0306`, which repaired the
  day's seed and left the `:NNN` → `§heading` migration to this task
- [[tasks/record-the-canonical-merit-statement-form-in-the-convention-page]] — `0178`, the sibling
  convention landing; ⚠️ **the two reds it accepted in the live tree were this task's**
- [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] — `0195`, first of the ADR-010
  appends this task's Deliverable B had to run **after**
- [[systems/knowledge-base-structure]] — where the convention is filed, and the ninth convention page
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] · [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why the close is agent-closed and not owner-verified
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — why neither
  scope widening changed the rank
- [[tasks/remediate-the-dead-brief-paths-in-closed-review-ledger-headers]] — *added 2026-08-29:* `0168`, whose 67 header rewrites land in this page's location-free form
- [[tasks/repair-the-moved-folders-own-self-locators-in-task-done]] — *added 2026-08-29:* `0325`, whose R7 finding turned on this page's *"Citing a task"* rule binding a skill file
