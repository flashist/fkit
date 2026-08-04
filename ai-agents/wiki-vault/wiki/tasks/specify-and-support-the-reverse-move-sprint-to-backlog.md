# Specify and support the reverse move — sprint → Backlog board

**Source**: `ai-agents/tasks/done/0210-specify-and-support-the-reverse-move-sprint-to-backlog/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0210` · owner `fkit-coder`

## Goal

The **forward** move — backlog board → sprint — was specified in full in two places: the mandatory edits, a canonical marker `➡️ Moved to [Sprint N](sprint-N.md) — priority M`, and a warning about the drift a skipped edit causes.

**The reverse move — sprint → backlog board — was specified nowhere, and the tooling did not support it.** Nothing in the repo said what marker a de-scoped sprint row takes, which files must change, or what happens to the row's rank.

⚠️ **Filed into Sprint 2 on an owner-instruction exception, and the brief says so rather than letting it read as a normal justification.** The standing rule of 2026-08-03 admits a Sprint 2 row on one of two grounds — something in Sprint 2 depends on it, or a live control is broken. **This brief passed neither**: nothing emitted a `Moved to Backlog` marker yet, so no control was misbehaving. It was admitted on a third and different basis, an explicit owner ruling, on the reasoning that this was the **second** time an unspecified reverse operation had bitten this board, and that **45 authorized task moves were queued behind it**. **Not precedent for filing into a sprint on merit.**

## Key Changes

### The canonical marker

`➡️ Moved to [Backlog](backlog.md)` — **no `— priority M` suffix**, because that board is unranked. The href is relative to the file holding the row, so it becomes `../backlog.md` once the plan is archived. Registered as a new row in `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` and documented beside the forward form in both sites that specify it.

### Five mandatory edits — not the three the forward form has

The brief warned explicitly against assuming the reverse mirrors the forward, and it did not. **Review finding R1 raised the count from four to five**, adding the sprint row's own `## Status` flip:

1. Sprint row status cell → `➡️ Moved to [Backlog](backlog.md)`. **Never deleted** — the row is the pointer to where the work went.
2. Add a row to `ai-agents/sprints/backlog.md`, Priority cell `—`.
3. Brief's `## Sprint` → `Backlog`. Skip it and drift rule 2 fires `drift disagreement` forever.
4. Brief's `## Status` → `🔲 Backlog`.
5. Brief's `## Priority` → `Unscheduled`.

⚠️ **Edits 4 and 5 have no forward analogue** — the forward move *gains* a rank, the reverse must *surrender* one. **And nothing catches you if you skip edit 5**: `dashboard.sh` performs **no drift check of any kind** against a brief's `## Priority`, treating that cell purely as mutable board rank. A brief left reading `## Priority: 152` on an unranked board is invisible to every control in the repo. The documentation says so out loud, on the reasoning that *an unenforced rule nobody knows is unenforced is worse than one that is labelled.*

### Rank is surrendered — owner-ruled

Option (A) over option (B): the new backlog row reads `—` and the brief reads `## Priority: Unscheduled`, because the backlog board's own *"this board is unranked"* rule already mandates that for every other row there — *"a number here would be a commitment nobody made."* **The sprint row keeps its `P<n>` as frozen history**, since [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] and the rank-vs-identity convention treat a board rank as frozen once a row is closed out, and a `➡️ Moved` row is closed out. Changing it would be a renumber.

### The parser fix, and the portability trap that nearly ate it

`claude/skills/fkit-status/dashboard.sh` extracted a move target with a BRE that matched **only** the literal `Sprint <digits>`. A `Backlog` target yielded an empty target, which landed in two places: a permanent `moved-without-target` nonconformance — and **a drifted row is never filtered off the board, so it renders forever** — plus a Next-step cell reading a literal `in Sprint ?`.

⚠️ **The obvious one-line fix silently does nothing on macOS.** Adding `Backlog` as a BRE alternation with `\|` is unsupported by BSD `sed`: it matches nothing, **exits 0, and prints nothing**, so the drift persists **with no error**. The same expression works under GNU `sed`. *A fix that passes on Linux CI and fails on the owner's Mac, with no signal either way.* The shipped form uses ERE — `sed -nE` — verified first-hand on Darwin; ERE was already established in that file.

The parser fix removed the `in Sprint ?` defect as a **side effect**, with no separate change needed.

## Outcome

Done, **agent-closed — not owner-verified**. Review verdict: **⚠️ Changes requested — 5 defects (none blocking); all five CONFIRMED and all five fixed.**

- **R1** — the edit count was wrong (four, not five); both count-stating sites updated together, each with its own warning and a counts-asymmetry paragraph.
- **R2** — ⚠️ **the plan's justification for skipping prove-red coverage was REFUTED**, and `worklog.md`'s *"independently verified, CONFIRMED"* endorsement of it was wrong. A mutation was wired into `test/prove-red.sh` after all, with an unmutated-copy guard. The correction was written into `worklog.md` and the ledger, **never into `plan.md`** — the approved plan is not rewritten.
- **R3** — a test case was **made to guard what it claimed** rather than reworded down: a second fixture row reds an over-wide parser.
- **R4** — a case pinning the legacy unlinked prose form `➡️ Moved to Sprint 2 — priority 7`.
- **R5** — hrefs corrected to the documented sibling-relative rule, so an archived-plan fixture actually contains the string its name quotes.

**Owner-approved residuals: none** — every finding was ruled *fix it*. The GNU-vs-BSD `sed` exposure is recorded as an acceptable frontier-move (`-E` is POSIX ERE).

**What it unblocked, executed the same day:** the **45** authorized sprint-2 → backlog reverse moves. Verified 2026-08-03 by `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md`: `total 188 · done 132 · backlog 6 · cancelled 5 · moved 45`, **zero drift records** — the board went from 52 open rows to **6**. See [[tasks/sprint-2-remove-omnigent]].

⚠️ **Its review ledger still reads `Status: in-review`** — the work shipped; the ledger's own status field was never flipped.

**Named, not filed:** the brief deliberately refused to build a `dashboard.sh` path override into `prove-red.sh` as part of this task, on the grounds that it is *"a change to the test architecture, not a test addition"* — and required the finding be handed back even if the answer was "it would be easy", because *a silent omission here is the exact class of gap this whole task exists to close.*

## Related

- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board this move targets, and its unranked-by-design rule
- [[tasks/sprint-2-remove-omnigent]] — the board reduced 52 → 6 open rows by the 45 moves this unblocked
- [[tasks/enforce-task-status-vocabulary]] — the status vocabulary this adds a registry row to
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — `dashboard.sh`, whose parser this fixes
- [[tasks/filter-fkit-status-board-to-open-tasks]] — why a drifted row renders forever
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — why the sprint row keeps its `P<n>` as frozen history
- [[decisions/adr-014-how-fkit-tests-itself]] — `node --test`, zero devDeps, the suite this extends
- [[tasks/tighten-the-wiki-completion-flag-block]] — `0173`, closed the same day; this move surrendered the two ranks its ordering note cites
- [[systems/testing-and-verification]] — the contract suite and `prove-red.sh`
