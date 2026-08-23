# Reconcile the vault's `partial — not ready to close` flag on `0238` with its landed close

## ID
0317

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

### Authority

**Owner ruling 2026-08-22**, given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` — **the option label is the verbatim text: "File a task (Recommended)"**.

The question it answered, verbatim:

> *"0238 closed while the vault's last word was `partial — not ready to close`, and its literal
> acceptance was overtaken rather than met. Its brief is already in `done/`."*

The chosen option's description, verbatim:

> *"Spawn a producer to file a brief covering the 0238 acceptance gap, so it's on the board rather
> than only in an append-only wiki log. Doesn't reopen a closed task."*

**Surfaced by:** the `fkit-wiki` sync + lint run of **2026-08-22** (watermark `20f431f` → HEAD
`6f3d9f3`), whose residuals named `0206` and `0238` as closed against a standing `partial` flag.

⛔ **`0238` IS NOT REOPENED BY THIS TASK.** It stays `✅ Done (agent-closed — not owner-verified)` in
`ai-agents/tasks/done/`, exactly as it is. This is new, forward-looking work; the owner's chosen
option says so in its own words.

### The gap — re-verified firsthand on disk by the filing producer 2026-08-22, not carried on the wiki role's word

The spawn note characterised `0238` as *"overtaken, not met"*. **That characterisation was re-checked
against the tree before this brief was written.** What was found:

**1. The vault's last operative word on `0238` says it is not done, and nothing withdrew it.**
`ai-agents/wiki-vault/log.md` carries the flag line **`Task 0238: partial — not ready to close`** in
**two** entries — under the heading **`## 2026-08-07 — lint`** and again under
**`## 2026-08-13 — ingest (sync)`**. The same 2026-08-13 entry states plainly
*"`0238` and `0258` were **NOT** done and their preconditions are named above."* The most recent
mention, under **`## 2026-08-22 — ingest (sync)`**, records the tension **without discharging it**:
*"Nothing withdrew those flags … ⛔ **The flags are not amended** — this log is append-only."*
**Established by enumerating every `0238` occurrence in `log.md`, not by an absence grep** — 11
occurrences, read individually; none is a withdrawal.

**2. Two of `0238`'s acceptance criteria are now UNMEETABLE AS WRITTEN.** Its brief's `## What to
build` requires the vault to say *"Sprint 3 is the **active** board at
`ai-agents/sprints/sprint-3.md`, with its three rows"*, and its `## Verification steps` step 3
requires *"The vault names `ai-agents/sprints/done/sprint-2.md` and `ai-agents/sprints/sprint-3.md`
at their real paths."* ⛔ **Measured on disk 2026-08-22: `ai-agents/sprints/` holds `backlog.md`,
`sprint-6.md` and `done/`, and `sprint-3.md` is in `done/`.** Sprint 3 was archived 2026-08-07;
Sprint 4 and Sprint 5 opened and closed after it; **Sprint 6 is the active board**. ⭐ **Satisfying
these two criteria literally would require writing a falsehood into the vault** — that is the precise
sense in which the acceptance was overtaken.

**3. The substance `0238` existed for APPEARS satisfied — and this task is what makes that a finding
of record rather than a producer's grep.** Re-measured 2026-08-22: **6 files** under
`ai-agents/wiki-vault/` contain the literal string `ai-agents/sprints/sprint-2.md` — `log.md`, the
ADR-034 page, the ADR-037 page, `tasks/specify-and-support-the-reverse-move-sprint-to-backlog`,
`tasks/sprint-2-remove-omnigent`, `tasks/sprint-3-close-the-rank-integrity-loop`. **Every one was
opened and read; each occurrence sits inside a frozen dated entry, a dated historical reading, an
explicit `was …` archival note, or a deliberate `0236`-sweep specimen** — and **all six files are
named** in the `## 2026-08-07 — ingest (sync)` entry's `0238` verification block, which is what that
brief's verification step 2 asks for. `index.md` names Sprint 6 as **`🟢 THE ACTIVE BOARD`** and
carries a struck-through dated correction on its Sprint 3 entry.

⚠️ **Point 3 is a PRODUCER'S READING, offered as input and explicitly NOT as the verdict.** It was
taken with the wrong authority (only `fkit-wiki` may pronounce on the vault under
`ai-agents/knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md`), it is
**path-shaped** and therefore blind to a stale *claim* phrased without the literal string — a limit
`0238`'s own brief states about itself — and it was **not** run through `/fkit-wiki-lint`. ⛔ **A run
of this task that quotes point 3 back as its answer has not done the work.**

### Conflicts and adjacencies — stated, deliberately not resolved

- **`0290`** (`ai-agents/tasks/backlog/0290-decide-whether-anything-should-notice-when-a-close-falsifies-a-vault-claim/brief.md`,
  `## Owner: fkit-architect`, open) is the **general mechanism** question — *should anything notice
  when a close falsifies a vault claim?* **This task is the single instance, discharged on the
  record.** ⛔ **Do not pre-decide `0290`** — this task adds no check, no tooling and no convention,
  and its outcome must not be cited as a mechanism. They are independent: neither gates the other.
- **`0206`** carries the identical flag from the identical cause and closed the same day. ⛔ **It is
  deliberately NOT in this task's scope** — the 2026-08-22 sync recorded its deliverable as
  *verified present*, so its flag is a stale flag rather than a contested close, and folding a
  verified row in with an unverified one would hide the difference. ⚠️ **Stated plainly: nothing
  currently discharges `0206`'s flag either, and no task covers it.** Whether that needs its own row
  is a producer/owner call, flagged here, not taken.
- **`0199`, `0212`, `0239`, `0287`** are the other open `fkit-wiki`-owned vault rows. **None overlaps
  this one** — different source documents, different claims. They would batch efficiently in one
  librarian session; that is a scheduling observation, **not** a dependency.

## What to build

A **`fkit-wiki` pass that settles `0238`'s record inside the vault**, on evidence gathered by the
role that owns the vault.

1. **Re-verify `0238`'s substantive deliverable against the tree as it is on the day of the run** —
   the two things its brief actually cared about: that the vault carries **no live claim that
   Sprint 2 is the active board**, and **no live pointer** to the pre-archival path
   `ai-agents/sprints/sprint-2.md`. ⚠️ **A path grep is a floor, not the check** — `0238`'s own brief
   says the stale *claim* can be phrased without the string. Use the vault's own verification
   practice, including the whitespace-normalised form and its stated limits from
   `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`.
2. **Append ONE dated `log.md` entry that reaches a verdict** and says which of these it is:
   - **discharged** — the substance is present, named site by site, and the standing
     `partial — not ready to close` flag is **superseded** by this entry; or
   - **not discharged** — naming exactly what is still missing and what would fix it.
   ⛔ **The verdict must be one of the two. "Recorded the tension" is what the 2026-08-22 entry
   already did and is not an outcome for this task.**
3. **Record, in that same entry, that `0238`'s literal acceptance text is unmeetable** — quoting the
   two criteria and stating that Sprint 3 is archived and Sprint 6 is the active board — **so a later
   reader does not re-open the question or, worse, "satisfy" it by writing the false claim.**
4. **Emit the flag line in the canonical form** the vault's own convention prescribes (the
   flag-don't-close convention, task `0125`), naming **this** task — `0317` — and not `0238`.

### Constraints

- ⛔ **Do not reopen, move, re-status or edit `0238`.** Owner ruling, 2026-08-22, verbatim label
  **"File a task (Recommended)"**, whose own description reads *"Doesn't reopen a closed task."*
  It stays in `ai-agents/tasks/done/` as `✅ Done (agent-closed — not owner-verified)`.
- ⛔ **Do not amend, annotate or edit any existing `log.md` entry.** `log.md` is **append-only** —
  owner-ruled, task `0211`, no exceptions. The standing flags stay byte-identical; a new dated entry
  is the only instrument.
- ⛔ **This task's diff is `ai-agents/wiki-vault/` and nothing else.** Not a board, not a brief, not a
  knowledge-base document, not a skill.
- ⛔ **Do not "re-fix" the six named pre-archival-path instances.** The 2026-08-07 entry already
  carries the warning *"a dead-path scan WILL report these named instances — do not 're-fix' them."*
- ⛔ **Do not move any task file** — the movers are producer-only
  (`ai-agents/knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md`).
  If this run concludes something needs closing, **flag it to the producer**; it does not close it.
- ⛔ **Do not re-rank any board row**, and do not add or alter a board row.
- ⛔ **No commit, no push. No secrets in any artifact.**
- ⚠️ **Citations are file + heading + quoted fragment, never `:NNN`.** `log.md` is an append-only
  coordination document and row 3 of `durable-citation-anchors.md`'s table rules a line number
  **wrong** there, categorically.

## Verification steps

1. `git diff --stat` after the run touches **only** paths under `ai-agents/wiki-vault/`. Any other
   path is a failure.
2. `git diff ai-agents/wiki-vault/log.md` shows **additions only** — zero deleted lines, proved by
   diff and not by eye. Every pre-existing `Task 0238: partial — not ready to close` line is still
   present and byte-identical.
3. The new entry states a **verdict** — the word `discharged` or an explicit `not discharged` — for
   `0238`. A reader who greps `log.md` for `0238` reaches an entry that answers the question, not one
   that only restates it.
4. The new entry **names every remaining vault site** carrying the literal string
   `ai-agents/sprints/sprint-2.md`, with its disposition. **A count without a list does not satisfy
   this.** Report the re-measured count alongside the **6 files** measured 2026-08-22, and say
   whether it moved.
5. The new entry **quotes both unmeetable `0238` criteria verbatim** and states that
   `ai-agents/sprints/sprint-3.md` does not exist on disk — provable by `ls ai-agents/sprints/`.
6. The absence half of the check is done in the **whitespace-normalised** form
   (`tr '\n\t' '  ' | tr -s ' '`, then match) and its **stated limits** — table cells, wording drift,
   inline emphasis — are recorded honestly in the entry alongside the result.
7. `/fkit-wiki-lint` is clean, or every finding it raises is listed with a disposition.
8. `ai-agents/tasks/done/0238-wiki-resync-after-the-sprint-2-archival-and-sprint-3-open/brief.md` is
   **byte-identical** to its pre-run state, and `git status --porcelain` shows nothing under
   `ai-agents/tasks/`.
9. The close report names **this** task (`0317`) in its flag line, never `0238`.

## Notes

- **Depends on:** nothing. Every fact this task corrects is true on today's tree.
- **Blocks:** nothing.
- ⚠️ **Filed UNRANKED by a SPAWNED producer with no owner channel.** This row **appends** to the
  Backlog board and renumbers nothing, and was deliberately **NOT** added to Sprint 6 — a mid-board
  insertion is not the owner-ruled re-rank exception
  (`ai-agents/knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md`),
  and `AskUserQuestion` is absent in a consult
  (`ai-agents/knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md`).
  The Backlog board is unranked by design, so no merit position is stated.
- ⚠️ **A SPLIT WAS IDENTIFIED AND DELIBERATELY NOT TAKEN — RETURNED TO THE OWNER INSTEAD.** A second,
  independently shippable unit exists: **appending a dated correction note to `0238`'s closed brief in
  `done/`**, so a reader of the brief itself sees that its acceptance text names a board state that no
  longer exists. It is a **different file and a different role** from this task, and the project has
  precedent for exactly that shape (`0183`, `0193`, `0201`, `0274`). ⛔ **The filing producer did not
  file it** — the spawn instruction ruled that a merit-based split is the owner's call, not this run's.
  ⚠️ **It also touches `0229`'s and `0315`'s territory** (repairing a brief that contradicts a landed
  close; the header-warning form for corrections in briefs), so whoever picks it up reads both first.
- ⚠️ **This brief decays.** Its measurements — 6 vault files carrying the pre-archival path, Sprint 6
  active, 11 `0238` occurrences in `log.md` — were taken **2026-08-22**. **Re-measure at
  implementation time; do not quote these numbers.**
- ⚠️ **`0238`'s own brief contains a further unchecked discrepancy, reported not repaired:** it
  describes Sprint 3 as carrying *"three rows"* (`0181`, `0182`, `0222`), while
  `ai-agents/wiki-vault/wiki/tasks/sprint-3-close-the-rank-integrity-loop.md` records **four**
  (`0181`, `0182`, `0241`, `0222`). Not investigated here, and **not** this task's scope.
