# Gloss the undefined `N` in `status-report-format.md`'s `Moved` value — in both homes

## ID
0279

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

**Why the coder and not the architect.** No decision is open. The wording is **already settled** by
`0268`'s landed gloss, which this row copies rather than reinvents; no ADR is amended, no status value
is added, no behavior changes. What is left is a careful **dual-home** prose edit with a manifest
regeneration and a test run — and a parity check that is **switched off for this file**, which is
exactly the kind of hand-verification a coder's close is built to carry.

## Context

### Authority

**Owner ruling 2026-08-12**, given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text**:
**"File both as new tasks (Recommended)"**.

### Provenance

Finding **F3** of task
[`0268`](../../done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/plan.md)'s
plan worker, recorded in that plan's §*"⚠️ Three findings — surfaced, not acted on"*, and also carried
in `0268`'s `review.md`. `0268` closed 2026-08-12 having glossed `N` in
`task-status-vocabulary.md` **only**; the plan worker flagged the identical gap in a second file, out
of scope there, and the owner ruled it a separate row.

### The gap

Both copies of `status-report-format.md` enumerate the valid status values inside the `**Status**`
cell of the beat-7 dashboard column table, including:

> `` ➡️ Moved to [Sprint N](…) — priority M ``

with **`N` undefined**. `Sprint 4` and `Sprint 4c` are different sprints, and nothing at the point of
use says so.

| Home | Site, measured 2026-08-12 |
|---|---|
| live | `ai-agents/knowledge-base/conventions/status-report-format.md:46` |
| scaffold | `claude/scaffold/ai-agents/knowledge-base/conventions/status-report-format.md:48` |

⚠️ **The two cells are textually identical today** (measured at filing; only the line offset differs).
The gloss should therefore land **textually identical** in both — this file's parity exception is about
its *header framing*, not this table.

### ⚠️⚠️ THE PRECEDENT IS `0268`'S **LANDED** TEXT, AND IT IS NOT WHAT WAS FIRST WRITTEN

`ai-agents/knowledge-base/conventions/task-status-vocabulary.md:24-25`, as landed:

> ⚠️ **`N` in the `Moved to [Sprint N]` marker is the target sprint's *identity*, not a number** — `4`,
> or `4c`. `Sprint 4` and `Sprint 4c` are different sprints.

**Read it on disk and match it.** ⛔ **Do not reinvent the wording.**

**⛔ AND DO NOT REINTRODUCE THE CLAUSE `0268` REMOVED.** After review, `0268`'s wording was **reduced**
to stop naming a **source of truth** for `N`. Both candidate sources were wrong to name:

- Naming **the plan's H1** alone is **false** — identity also resolves from the filename stem.
- Naming **the filename stem** reopens *"no pattern on the filename"*, which ADR-041 settled.

So the landed gloss says what `N` **is** (an identity, not a number) and stays silent on **where it
comes from**. ⚠️ A gloss here that adds *"…as resolved from the plan's H1"* — or any equivalent —
**reintroduces the exact defect `0268`'s review removed**, and is a defect of this task.

⛔ **Never restate the token grammar, the delimiters, the letter-suffix bound, or any filename
allowlist** (ADR-041 §5).

### Judgment call: is an inline gloss warranted at all?

The cell **already** says the value is *"rendered exactly as the vocabulary writes it"* and links
`task-status-vocabulary.md`, which now carries the gloss. So a reader who follows the link is covered.

- **Recommendation: yes, gloss it.** This cell **enumerates the values at point of use**, and a reader
  parsing that list in place meets `N` undefined. That is the same argument that justified `0268`.
- ✅ **But "the pointer already discharges it — no edit warranted" is a SANCTIONED finding.** If the
  evidence supports it, ⛔ **say so loudly and surface it**; do not close this quietly with an empty
  diff, and do not manufacture an edit to have something to show.

**Placement** is the implementer's call, with one steer: `0268` deliberately put its gloss **beneath
the table** rather than inside the marker cell, because `priority-is-rank-not-identity.md:35-37` — in
**both** homes, byte-enforced, **not** on the exception list — says of that exact marker *"Leave it
byte-identical."* ⚠️ **The same trap exists here.** A parenthetical inside the marker text would put
the two conventions in direct conflict; a sentence beneath the table sidesteps it entirely.

### ⚠️⚠️ THE AUTOMATED PARITY CHECK IS **OFF** FOR THIS FILE — A ONE-HOME EDIT IS SILENT

Measured at filing 2026-08-12, and ⚠️ **re-verify this yourself rather than taking it from this brief**:

- `test/dual-home-parity-exceptions.mjs:161-171` declares
  `knowledge-base/conventions/status-report-format.md` with `kind: 'audience-adapted'`.
- `test/dual-home-parity.test.js:171` **skips** any path `findException` resolves.
- The exception's `reason` is only **length**-checked (floor 30 chars, `:274`) — it is **never** checked
  for actually accounting for what differs.

**So nothing in the suite will catch it if you edit one home and not the other.** The twin edit must be
made **deliberately** and **diffed by hand**. This is not a formality; it is the only check there is.

⛔ **Do not touch the exception's `reason` string.** Its incompleteness is a **separate, already-known
finding** (`0268`'s **F1**, which the owner handled by amending `0268`'s own verification step, not by
editing the exception) and editing it needs its own ruling.

### The manifest regeneration is owed

`claude/structure-manifest.tsv` carries hashes for the project path
`ai-agents/knowledge-base/conventions/status-report-format.md` (**5** rows at `:68-72`, measured
2026-08-12). The generator walks *history ∪ current on-disk `claude/scaffold/`*, so a scaffold edit
adds a row.

**Run `npm run generate:manifest`.** Per `0268`'s measured precedent, skipping it reds **two** suites:
`test/structure-manifest.test.js` (*"the committed manifest is byte-exactly what the generator produces
today"*) and `test/structure-notice.test.js`. ⚠️ **Verify this against the tree; do not take the count
on this brief's word.**

### Constraints

- ⛔ **No new status value, in either home.** This is a gloss on an existing value, nothing more.
- ⛔ **No marker-syntax change.** `priority-is-rank-not-identity.md` requires it byte-identical.
- ⛔ **No `task-status-vocabulary.md` edit** — that is `0268`'s landed work. If it looks wrong, **stop
  and report**.
- ⛔ **No `test/dual-home-parity-exceptions.mjs` edit** (see above).
- ⛔ **No `dashboard.sh` change**, and no change to any *"Where this is enforced"* list — those
  **diverge by design** between the homes and are beyond a gloss.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No task-file move (ADR-033). ⛔ No commit. ⛔ No new
  devDependency (ADR-014).
- ⚠️ **Every `:NNN` here is a dated anchor of convenience, measured 2026-08-12. The durable anchor is
  the quoted text. Re-measure at implementation time.**

## What to build

1. **Decide whether the gloss is warranted** (see the judgment call above; recommendation: yes). State
   the decision either way.
2. **If yes — add it to the live copy**, matching `0268`'s landed wording, placed beneath the table.
3. **Add the textually identical gloss to the scaffold copy.** ⚠️ **This is the edit nothing will catch
   if you forget it.**
4. **Run `npm run generate:manifest`.**

## Verification steps

1. **Both landed fragments quoted side by side** — live and scaffold — and shown to be textually
   identical. ⛔ Not "I edited both"; **show both**.
2. **The wording matches `0268`'s landed gloss.** Quote `task-status-vocabulary.md`'s text and the new
   text together. Then state explicitly that the new text **names no source of truth for `N`** and
   reintroduces none of the clause `0268`'s review removed.
3. **The marker itself is byte-identical.** Show from the **diff** that no `➡️ Moved to [...]` token
   text changed in either home.
4. **The parity exception was re-verified first-hand** — paste the command and its output showing the
   entry, its `kind`, and that the automated comparison is skipped for this path. Then say plainly:
   **the twin edit was verified by hand because nothing else verifies it.**
5. **`npm run generate:manifest` was run**, and `node --test test/structure-manifest.test.js` is green.
   Paste the counts.
6. **`git diff --stat` touches exactly three paths** — the two convention copies and
   `claude/structure-manifest.tsv`. ⛔ `test/dual-home-parity-exceptions.mjs` and
   `task-status-vocabulary.md` must be untouched — show it.
7. **Full `npm test` green; state the measured counts.** ⚠️ Then say plainly **what it proves and what
   it does not**: green proves the manifest is fresh; it proves **nothing** about whether the two
   copies agree, because the parity check is off for this file.
8. **If the conclusion was "no edit warranted"**, say so explicitly, with the reasoning, and surface it
   — ⛔ do not close it as done with an empty diff and no statement.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** finding **F3** of `0268`'s plan worker
  ([`plan.md`](../../done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/plan.md),
  §*"⚠️ Three findings — surfaced, not acted on"*; also in that task's `review.md`). Filed 2026-08-12
  on the owner's ruling of the same day, verbatim label **"File both as new tasks (Recommended)"**.
- **⚠️ NOT a defect of `0268`.** `0268` glossed the file it was scoped to gloss; the plan worker found
  the second site and surfaced it rather than widening. ⛔ Do not close this as repair of `0268`.
- **Independent of [`0278`](../0278-confirm-or-disprove-the-filename-derived-moved-href-template-in-task-brief/brief.md)**,
  its sibling filed the same day from the same source. No shared file, no ordering, either order safe.
  Recorded so nobody invents a dependency edge between two rows filed together.
- **⚠️ No overlap with any open row on these two files**, checked at filing 2026-08-12 —
  `0276` and `0278` both touch `claude/skills/fkit-task-brief/SKILL.md`, which this row does not.
- **On merit:** the **Backlog**, unranked, and that is honest. It is a documentation gloss with no
  runtime consequence and nothing waiting on it. Sprint 5 is mid-flight with owner-set ranks from
  2026-08-11; appending there would land it below every open row.
- **Blast radius if never done:** a reader of `status-report-format.md`'s value list meets `N`
  undefined at point of use and may render `Sprint 4c` as `Sprint 4` in a briefing — the same
  identity-vs-number confusion `0268` was filed to remove, surviving in the second of the two files
  that carry the value list. Small, real, and invisible to the suite.
- Filed 2026-08-12 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of the
  same day. It asked nothing, edited no convention file, changed no task's status, moved no task file,
  touched no sprint plan, and committed nothing.
