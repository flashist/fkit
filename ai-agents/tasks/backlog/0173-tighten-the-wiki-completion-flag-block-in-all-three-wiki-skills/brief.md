# Tighten the wiki completion-flag block — the template manufactures a dead path on every emission

## ID
0173

## Sprint
Sprint 2

## Priority
152

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### ⚠️ Why this one is urgent

**Every wiki completion flag this project emits today manufactures a dead path, and any ledger that
quotes one preserves it permanently.** This is not a latent risk — the generator is running. Confirmed
firsthand 2026-08-01 by reading all three files: `claude/skills/fkit-wiki-ingest/SKILL.md`,
`claude/skills/fkit-wiki-lint/SKILL.md` and `claude/skills/fkit-wiki-sync/SKILL.md` all still carry the
defective template, and the wiki role independently confirmed the same on the same day.

Every hour this sits in the backlog, another flag can be emitted and another ledger can freeze it.

### The defect, from report §5.2

Task `0160`'s ruling —
[the 2026-08-01 durable-citation report](../../../knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md),
§5, case 4 — ruled the candidate rule *"folder ID and brief path only; no board rank, no `P<n>`, no
`:NNN`"* **IN on its folder-ID half**, and found the live delta is **exactly two things**:

**(i) `:NNN` is not prohibited.** The block in all three skills bans board rank / `P<n>` and says
**nothing** about line numbers. Verified 2026-08-01: `grep` for `line number` and `:NNN` across all
three files returns nothing; the only hit is the existing `P<n>` rank sentence.

**(ii) The mandated flag template hardcodes `backlog/`.** Quoted verbatim from the ingest skill (and
identically worded in lint and sync):

> - complete → `Task <NNNN>'s vault work is complete — ready to close (producer runs /fkit-task-done on ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)`
> - partial or uncertain → `Task <NNNN>: partial — not ready to close (ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)`

The report's conclusion: **the template manufactures a dead path, and the ledger that quotes it
verbatim preserves it forever.** The two forms die by different routes, and the report is precise
about it:

- **`complete` → dead almost immediately.** The flag says *"ready to close"*, the producer runs
  `/fkit-task-done`, the folder leaves `backlog/` in the same working session. The path is dead before
  anyone reads it.
- **`partial or uncertain` → correct at emission, dead later.** It says *"not ready to close"*, so the
  task genuinely is in `backlog/` when written. It dies whenever the task eventually closes or is
  cancelled — weeks later, or never. The report flags this as **the worse of the two to detect**: *"a
  pointer that was demonstrably correct when written, which is the exact profile §3.4 identifies as
  the dangerous one."*

**Live specimen on disk:** `ai-agents/tasks/done/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/review.md`
carries a verbatim quote of the flag with a `backlog/` path, for a task now in `done/`.

### 🔒 OWNER RULING — the replacement form. THE REPORT DOES NOT CONTAIN IT.

> **⚠️ Read this before reading report §11. §11 still reads *"⏳ Awaits the owner"* and it is out of
> date.** The report's open question 7 asked what replaces the brief path, listed three candidates and
> ruled none — *"⏳ Awaits the owner. Until it is ruled, follow-up 5 cannot be implemented, only
> filed."* **The owner ruled it AFTER the report was finalised**, and ruled the report ships as-is
> rather than being reopened. **The ruling therefore travels in this brief, not in the report.** A
> coder who reads §11 alone will find this unruled and stop. That is why this box exists.
>
> ### ✅ Owner-ruled 2026-08-01: **FOLDER ID ONLY — candidate (i). No path at all.**
>
> **Provenance:** the owner, 2026-08-01, via `AskUserQuestion` in the live `/fkit-sprint-ship-loop`
> driver session.
>
> The replacement form drops the path entirely and names the task by its folder ID:
>
> > *"Task 0148's vault work is complete — ready to close"*
>
> **This applies to BOTH template lines**, not only the `complete` one — report §5.2(ii) shows the
> hardcoded `backlog/` path sits in the `partial or uncertain` line too.
>
> **Why it satisfies the ruling:** §1's table rules that a **task** is anchored by *"the folder-name
> `NNNN` prefix, always"* (ADR-029 Decision 3: assigned once, never reused). With no path there is
> nothing left to rot.
>
> **The cost the owner accepted, stated rather than glossed:** **the producer does one lookup** to
> find the folder. Candidates (ii) *"a location-free prose reference"* and (iii) *"a wildcard path
> `ai-agents/tasks/*/<NNNN>-<slug>/brief.md`"* were both rejected — (iii) in particular *"is not a path
> any tool can open, and it is a new notation to teach."*

### What is already shipped, and must NOT be re-added

The **rank prohibition already exists in all three skills.** Report §5.2, checked firsthand
2026-08-01, quoting the ingest skill:

> **`<NNNN>` is the task folder name's four-digit prefix** (equivalently the brief's `## ID`) — the
> same four digits that open the path you emit, and the task's only identity. It is **never** the
> sprint board's rank / `P<n>` Priority cell, which is mutable and re-ranked […]

`0160`'s brief proposed this as new. **It is not.** Do not re-add it, and do not reword it.

### ⚠️ The three blocks are NOT byte-identical — verified firsthand for this brief

Report §5.2's R12 correction says the first draft wrongly called all three *"byte-equivalent"*.
**Re-verified independently 2026-08-01 while writing this brief, and the correction holds:**

- **ingest and lint ARE byte-identical.** `diff` of the two blocks returns **no output**.
- **sync is NOT.** Its copy carries **0-space** leading indentation where ingest's and lint's carry
  **3**. The text is identical once stripped; **the bytes are not.**

> **So the instruction is: make the same TEXTUAL change in all three. It is NOT "make the three blocks
> byte-identical."** An editor told the blocks are equivalent will normalize sync's indentation and
> produce a diff nobody asked for. Report §8.1 insists on exactly this care for task `0168`; the same
> care applies here.

## What to build

**Two textual changes, applied to all three of** `claude/skills/fkit-wiki-ingest/SKILL.md`,
`claude/skills/fkit-wiki-lint/SKILL.md`, `claude/skills/fkit-wiki-sync/SKILL.md`:

1. **Replace the hardcoded `backlog/` path in both template lines** with the owner-ruled folder-ID-only
   form above. No path, no wildcard, no board folder named.
2. **Add the `:NNN` prohibition** to the block that already bans board rank — a line number is never
   part of a flag. Word it beside the existing rank sentence; do not restructure the block.

**Preserve sync's 0-space indentation** and ingest's/lint's 3-space indentation exactly as they are.

### Out of scope

- **⛔ Do not add a guard or a test.** Task `0154` owns `test/wiki-flag-convention.test.js`; tasks
  `0136` and `0152` own the other `SKILL.md` walks. See the dependency warnings in `## Notes` — this
  task's relationship to `0154` is **ordering**, not scope.
- **⛔ Do not decide where a check on the *emitted* form lives.** That is task `0165`.
- **⛔ Do not touch `ai-agents/wiki-vault/`.** Only the `fkit-wiki` role writes the vault, and this
  task edits `claude/skills/`, not vault content. Report §5.3 records further rank citations in
  `log.md` and explicitly flags them as **unverified and unclassified** — *"I have not classified
  which are live claims and which are frozen history."* **Any vault cleanup is a separate task for the
  `fkit-wiki` role.** Do not start one here.
- **⛔ Do not edit `0148`'s closed review ledger** or any other frozen ledger to repair a quoted flag.
- **⛔ Write no `:NNN` line-number citations** anywhere in this task's artifacts. Locate by heading and
  quoted phrase.

## Verification steps

1. `grep -rn 'tasks/backlog/' claude/skills/fkit-wiki-ingest/SKILL.md claude/skills/fkit-wiki-lint/SKILL.md claude/skills/fkit-wiki-sync/SKILL.md`
   returns **no hit inside either flag template line**. Report any remaining hit and say what it is.
2. Both template lines in all three files carry the folder-ID-only form and **no path**. Check the
   `partial or uncertain` line explicitly — it is the one most likely to be missed.
3. All three files carry a `:NNN` prohibition. `grep` for it in each.
4. The existing rank / `P<n>` prohibition is **unchanged** in all three. Diff it against `HEAD`; a
   changed rank sentence is a failed verification, not a bonus.
5. **Indentation preserved:** ingest and lint still `diff` clean against each other; sync still carries
   its 0-space leading indentation. Report the three indent widths explicitly, even if unchanged.
6. `git diff --stat` shows exactly three files, all under `claude/skills/fkit-wiki-*/`. No file under
   `ai-agents/`.
7. `npm test` passes. **If `test/wiki-flag-convention.test.js` exists by the time this lands** (task
   `0154`), it will assert the OLD strings verbatim and go **red** — see the `## Notes` ordering
   warning. If that happens, **stop and route it to the owner**; do not edit the test to match.
8. State on the record that the replacement form used is the owner-ruled candidate (i), and that the
   ruling came from this brief and not from the report.

## Notes

- **Depends on:** nothing. The one thing that blocked it — report §11 open question 7 — **is ruled**;
  the ruling is in this brief with its provenance.
- **Blocks:** 0154, 0165.
- **⚠️ The two `Blocks:` entries are ordering constraints of different kinds. Both matter.**
  - **`0165` — named by the report.** §5.4: *"Not agree — but case 4 must land first. `0165` decides
    **where a check lives**. Case 4 decides **what the flag may contain**. A check written before the
    content ruling would pin today's form, including the `backlog/` hardcode."*
  - **`0154` — NOT named by the report; found while filing this brief.** `0154`'s brief requires the
    guard to assert *"the **complete-flag** line, verbatim, in all three files"* and *"the
    **partial-flag** line, verbatim, in all three files"*. **If `0154` lands first it pins the
    defective form in a test**, and this task then turns that test red. Worse, `0154` would ship a
    guard that *enforces* a form the owner has already ruled out. **Land this task first.**
- **⚠️ RANK CONFLICT — flagged loudly, for the owner, not resolvable by a spawned producer.**
  This brief's rank **P152 is APPEND rank**, assigned under `/fkit-task-brief` step 5, which forbids a
  spawned producer with no owner channel from inserting mid-board. But **`0154` sits at P129 and
  `0165` at P130 — both ABOVE this row.** So the board's reading order says do them first, while both
  the report and this brief say they must come second. **The dependency declarations above are the
  binding record; the ranks currently contradict them.**
  **On merit this belongs immediately above `0154`.** The owner should promote it, or accept that the
  ordering lives in the `Depends on` / `Blocks` links alone. **No existing row was renumbered by this
  brief.**
- **`SKILL.md`-walk queue.** Report §5.4 records this as joining the claimant queue alongside `0136`,
  `0152` and `0154` — *"exactly one walk"*. That warning is about **guards**, which this task does not
  add; it is recorded so the queue's owner sees the fourth claimant.
- **Owner is `fkit-coder`.** Report §8 lists follow-up 5 as *"`fkit-producer` to file"* — the filing is
  done here; the edit is a `claude/skills/` source change and belongs to the coder.
