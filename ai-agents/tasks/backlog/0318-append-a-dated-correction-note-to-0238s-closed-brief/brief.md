# Append a dated correction note to `0238`'s closed brief — its acceptance names a board state that no longer exists

## ID
0318

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

### Authority

**Owner ruling 2026-08-22**, given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to a spawned producer — **the option label is the verbatim
text: "File it as a second task (Recommended)"**.

The question it answered, verbatim:

> *"0238's brief sits in `done/` with acceptance text naming a board state that no longer exists
> (Sprint 3 active). 0317 will warn future readers via the vault log, but a reader of the brief
> itself sees nothing. Should the brief get a dated correction note too?"*

The chosen option's description, verbatim:

> *"Separate brief, different role from 0317's fkit-wiki owner — independently shippable, which is
> where /fkit-task-brief's decomposition rule points. Precedent exists: 0183, 0193, 0201, 0274 are
> all this shape."*

**Provenance of the split.** `0317`'s `## Notes` recorded this unit as *"A SPLIT WAS IDENTIFIED AND
DELIBERATELY NOT TAKEN — RETURNED TO THE OWNER INSTEAD"*. The owner has now taken it. This brief is
that split, filed.

⛔ **`0238` IS NOT REOPENED, RE-STATUSED OR MOVED BY THIS TASK.** It stays
`✅ Done (agent-closed — not owner-verified)` at
`ai-agents/tasks/done/0238-wiki-resync-after-the-sprint-2-archival-and-sprint-3-open/brief.md`.
Only an **appended** dated note is in scope.

⚠️ **Filed UNRANKED by a SPAWNED producer with no owner channel** (`AskUserQuestion` is absent in a
consult —
[ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
This row **appends** to the Backlog board and renumbers nothing; a mid-board insertion is not the
owner-ruled re-rank exception
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
The Backlog board is unranked by design, so no merit position is stated.

### The gap — re-verified firsthand on disk 2026-08-22, not carried on anyone's word

⚠️ **Measured against a DIRTY working tree with a live `fkit-wiki` worker writing
`ai-agents/wiki-vault/`.** `HEAD` = `9360177` (*"Sprint push"*). Figures are a dated observation, not
a permanent fact. ⛔ **Re-measure before acting.**

**1. `0238`'s acceptance names a board state that no longer exists — in two places.**

| Where in `0238`'s brief — **anchor on the quote, not a line number** | What it requires |
|---|---|
| `## What to build` — *"Sprint 3 is the **active** board at `ai-agents/sprints/sprint-3.md`, with its three rows."* | the vault to assert Sprint 3 is active |
| `## Verification steps` step 3 — *"The vault names `ai-agents/sprints/done/sprint-2.md` and `ai-agents/sprints/sprint-3.md` at their real paths"* | the vault to point at a live `sprints/sprint-3.md` |

⛔ **Measured on disk 2026-08-22: `ai-agents/sprints/` holds `backlog.md`, `sprint-6.md` and
`done/`.** `sprint-3.md` is at `ai-agents/sprints/done/sprint-3.md`; Sprint 3 was archived
**2026-08-07**; `ai-agents/sprints/sprint-6.md`'s H1 reads *"# Sprint 6 — Repair the record the
board rests on, and ship what was already ready"* and it is the active board. ⭐ **So satisfying
either criterion literally would mean writing a falsehood** — that is the precise sense in which the
acceptance was *overtaken, not met*.

**2. A reader of the brief itself sees none of this today.** The warning that exists is in
`ai-agents/wiki-vault/log.md`, under the entry headed `## 2026-08-22 — ingest (sync)`, which states
*"`0238`'s literal acceptance text was **overtaken, not met**"*. ⚠️ **That entry is
UNCOMMITTED** — it is absent from `HEAD` and was written into the working tree by the live
`fkit-wiki` worker. It is also in a different tree from the brief. **`0238`'s own brief carries no
correction of any kind** — verified by reading it in full.

**3. The *"three rows"* claim — investigated, and the answer is more interesting than "wrong".**
`0238`'s `## Context` says Sprint 3 was *"the **active** board, carrying three rows — `P1` `0181`,
`P2` `0182`, `P3` `0222`"*. Re-derived from `ai-agents/sprints/done/sprint-3.md` on 2026-08-22, that
board's `## Status` table carries **four** rows: `0181`, `0182`, `0241`, `0222`.

⭐ **But the four-row state postdates the sentence.** The same archived board carries a heading
`## Addendum — task 0241 added out of band (2026-08-06)` and a second,
`## Addendum — OWNER-RULED re-rank (2026-08-06): 0241 moves to Sprint 3 P3, 0222 to Sprint 3 P4`.
`0238` was filed **2026-08-06** as well. **So "three rows" is very likely a dated observation that
was correct when written, not a defect** — which is exactly the distinction the open task
[`0301`](../0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md)
exists to write down.

⚠️ **This is a producer's reading, offered as input and NOT as the verdict.** The ordering of the two
2026-08-06 events relative to `0238`'s filing was **not** established from commit history — only from
the addendum headings and the brief's own date. ⛔ **Establish the ordering before annotating this
claim, and if it cannot be established, say so in the note rather than guessing.**

**4. `0317` reports this same discrepancy against a different source and gets a different number's
provenance.** `0317`'s `## Notes` compares `0238`'s *"three rows"* against
`ai-agents/wiki-vault/wiki/tasks/sprint-3-close-the-rank-integrity-loop.md`, which records four. This
brief compares it against the **board itself**. Both readings agree on *four today*; neither had
established the dated-observation point above. ⛔ **Do not treat `0317` as having settled it.**

### Conflicts and adjacencies — stated, deliberately not resolved

- ⚠️ **[`0229`](../../done/0229-widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close/brief.md)**
  (`## Owner: fkit-coder`, open) would widen `/fkit-task-done` so the **mover itself** repairs a
  brief that contradicts a landed close. ⛔ **This task is the SINGLE INSTANCE and must not
  pre-decide the general case.** It adds no tooling, changes no skill, and its outcome is not a
  precedent for what a mover should do. They are independent: neither gates the other.
- ⚠️ **[`0315`](../0315-define-the-corrections-header-warning-equivalent-for-briefs-and-board-rows/brief.md)**
  (`## Owner: fkit-architect`, open) is the open question of **what the `- **Corrections:**` header
  warning even looks like in a brief** — the ADR form's third part has no defined brief equivalent.
  ⛔ **Do not invent one here and do not pre-decide `0315`.** See the constraint below for what this
  task does instead.
- **[`0317`](../0317-reconcile-the-vaults-not-ready-to-close-flag-on-0238-with-its-landed-close/brief.md)**
  (`## Owner: fkit-wiki`) is the **vault half** of the same subject. **Neither gates the other** —
  different files, different roles, different write authority. ✅ Running `0317` first would let its
  verdict be cited here, but that is a **scheduling preference, not a dependency**, and this task
  must not be written as blocked on it.
- **Precedent for a producer editing a brief inside `ai-agents/tasks/done/`:**
  [`0193`](../../done/0193-repair-the-stale-citations-in-0158s-closed-brief/brief.md) (`## Owner:
  fkit-producer`) does exactly this to `0158`'s closed brief. `0201` and `0274` are the same shape
  against closed **review ledgers**, under different owners. ⭐ **The write is sanctioned by an
  owner-ruled task, not by `/fkit-task-brief`** — that skill's own `### 9. Never` list forbids
  writing to `ai-agents/tasks/done/`, so this task exists precisely because the brief-creation skill
  cannot perform it.

## What to build

**One appended, dated correction note inside `0238`'s closed brief**, so a reader of the brief itself
learns that its acceptance text names a board state that no longer exists.

1. **Re-measure the four facts** before writing anything: that `ai-agents/sprints/sprint-3.md` does
   not exist; that `ai-agents/sprints/done/sprint-3.md` does; which board is active today (read its
   H1, do not assume Sprint 6); and the two quoted acceptance fragments, verbatim, from the brief as
   it is on the day of the run. ⛔ **Do not carry this brief's figures forward unverified.**
2. **Append a ⚠️ drift note directly below the `## What to build` claim** *"Sprint 3 is the
   **active** board at `ai-agents/sprints/sprint-3.md`, with its three rows."* It states: the date;
   that Sprint 3 is archived and which board is active now; that **the criterion is therefore
   unmeetable as written and satisfying it literally would write a falsehood**; and that the original
   text is **left byte-identical**.
3. **Append a second ⚠️ drift note below `## Verification steps` step 3**, on the same terms, for the
   `ai-agents/sprints/sprint-3.md` path.
4. **Decide and record the disposition of the *"three rows"* sentence** in `## Context`, using
   §3 above. Two admissible outcomes, and **state which and why**:
   - **annotate** — a ⚠️ note recording that the board carries four rows today and that `0241` was
     added out of band on 2026-08-06; or
   - **leave, with the reason recorded in the worklog** — because it is a dated observation that was
     correct when written and does not become a defect by ageing.
   ⛔ **"Not investigated" is not an outcome.** ⛔ **Do not rewrite the sentence either way.**
5. **Use the ⚠️/⛔ two-marker legend exactly as `0198` shipped it** —
   `claude/skills/fkit-record-decision/SKILL.md`, `## Correcting an accepted ADR — the dated
   correction note`. **Every note here is ⚠️ (a fact that drifted).** ⛔ **No ⛔ note belongs in this
   task** — nothing about `0238`'s decision was overturned, only overtaken; a drift marked ⛔ tells a
   reader to stop following a decision that in fact stands.
6. **Follow the form's placement and indentation rules:** the note goes **below** the claim it
   corrects, and its indentation **matches the block it sits under** — a claim inside a list item
   takes the item's continuation indent, a top-level prose claim takes column 0.

### Constraints

- ⛔ **APPEND-ONLY. Not one byte of `0238`'s existing text changes.** Proved by diff, not by eye —
  see `## Verification steps`.
- ⛔ **DO NOT ADD A `- **Corrections:**` HEADER BULLET, and do not invent a brief-shaped equivalent
  of one.** That is `0315`'s open question and this task must not pre-decide it. ⚠️ **State the
  consequence honestly in the worklog:** the ADR form warns the reader **first** via that header
  bullet, and a brief has no such carrier today, so a reader who does not scroll to the annotated
  claim gets no warning. **That is an accepted, recorded gap belonging to `0315`, not a defect of
  this run.**
- ⛔ **Do not reopen, re-status, move, rename or re-rank `0238`** — not its `## Status`, not its
  board row, not its folder. Task files move only via `/fkit-task-done` / `/fkit-task-cancelled`,
  producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  and no move is in scope here.
- ⛔ **Do not write `ai-agents/wiki-vault/`** — `fkit-wiki`'s exclusively
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  If the run concludes the vault needs something, **flag it to `0317`**; it is not done here.
- ⛔ **Do not edit `claude/skills/fkit-record-decision/SKILL.md`**, `/fkit-task-done`, or any other
  skill. This task **consumes** the correction-note form; it does not change it. Changing a mover is
  `0229`'s.
- ⛔ **Do not edit any other brief, board, ADR or knowledge-base document.** This task's diff is one
  file.
- ⚠️ **Cite by file + heading + quoted fragment, never `path:NNN`.** A task brief is a coordination
  document others append to, and row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)
  rules a line number **wrong** there, categorically.
- ⛔ **No commit, no push, no `git add`, no `git stash`. No secrets in any artifact.**

## Verification steps

1. `git diff --numstat -- ai-agents/tasks/done/0238-wiki-resync-after-the-sprint-2-archival-and-sprint-3-open/brief.md`
   reads **`N  0`** — additions only, zero deletions.
2. `git diff -U0 -- <that path> | grep '^-' | grep -v '^---'` produces **no output**. ⚠️ **Use that
   filter exactly** — the shorter `grep '^-[^-]'` misses a deleted markdown list line, because `- text`
   appears in the diff as `-- text`.
3. **The snapshot check is run as well, and it is not optional here.** The tree is dirty with other
   workers' uncommitted edits, so a working-tree diff is measured against the last commit and cannot
   isolate this run's change. Copy the file **before editing**, then:
   `git diff --no-index --numstat <snapshot> <brief>` → `N  0`, and
   `diff <snapshot> <brief> | grep '^<'` → no output.
4. Both quoted acceptance fragments — the `## What to build` *"Sprint 3 is the **active** board…"*
   sentence and `## Verification steps` step 3 — are still present and **byte-identical**, each with
   a dated ⚠️ note immediately **below** it.
5. **Every appended note is ⚠️. `grep -c '⛔' ` over the diff's added lines is `0`.**
6. The notes state, in words, that `ai-agents/sprints/sprint-3.md` does not exist on disk — provable
   by `ls ai-agents/sprints/` — and name the board that is active on the day of the run.
7. **The *"three rows"* disposition is recorded with its reason**, and the reason names whether the
   2026-08-06 ordering was established or could not be.
8. `git diff --stat` shows **exactly one changed path** and it is `0238`'s brief. **Nothing** under
   `ai-agents/wiki-vault/`, `ai-agents/sprints/`, `ai-agents/tasks/backlog/`, `claude/` or
   `ai-agents/knowledge-base/`. ⚠️ **Other workers' dirty paths will appear in `git status`** — scope
   the check to this run's own writes and say how you scoped it.
9. **No `## Status` line changed anywhere:** `git diff -U0 | grep -E '^[-+].*## Status'` is empty.
10. No `- **Corrections:**` bullet, or any brief-shaped equivalent, was added — and the worklog
    states that the reader-warning gap is `0315`'s and was left open deliberately.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Relates to:** `0317` (the vault half of the same subject — **neither gates the other**), `0229`
  (would widen `/fkit-task-done` to do this class of repair automatically — ⛔ **this task is the
  single instance and must not pre-decide it**), `0315` (the `- **Corrections:**` header-warning
  equivalent for briefs — ⛔ **deliberately left open here**), `0290` (whether anything should notice
  when a close falsifies a vault claim — the general mechanism), `0301` (the *"correct as of its
  date"* convention, which bears directly on the *"three rows"* disposition), `0193` / `0201` /
  `0274` (the precedent shape).
- ⚠️ **This brief decays.** Every measurement in it was taken **2026-08-22** at `HEAD` = `9360177`
  against a **dirty working tree with a live `fkit-wiki` worker writing `ai-agents/wiki-vault/`**.
  **Re-measure at implementation time; do not quote these figures.**
- ⚠️ **One reading in `## Context` §3 is explicitly unfinished** — whether `0241`'s out-of-band
  addition postdates `0238`'s filing was inferred from dated addendum headings, **not** from commit
  history. Step 4 of `## What to build` is where that gets settled.
- ⛔ **Do not commit, push, `git add` or `git stash`** unless the owner explicitly asks.
