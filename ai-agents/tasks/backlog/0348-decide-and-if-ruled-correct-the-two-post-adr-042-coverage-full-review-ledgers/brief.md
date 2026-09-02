# Append a dated coverage correction to `0188`'s closed review ledger

> ⚠️ **RETITLED 2026-08-29. The original title was
> *"Decide — and, if ruled, correct — the two post-ADR-042 `Coverage: full` review ledgers"*.** The
> decide-half is **discharged** by the owner ruling recorded below, and the scope narrowed from two
> ledgers to one. ⛔ **The folder slug
> (`0348-decide-and-if-ruled-correct-the-two-post-adr-042-coverage-full-review-ledgers`) is now stale
> and was deliberately NOT renamed** — a folder rename is a move, the movers only move between
> `backlog/` `done/` `cancelled/`, and inbound citations point at the current path. **Cite this task by
> ID `0348`, not by slug.**

## ID
0348

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-reviewer

## Context

### Where this came from

Filed 2026-08-28 by a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
at the close of
[`0272`](../../done/0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/brief.md),
on the owner's ruling that `0272`'s coder record these for the producer to route. The coder collected
them in `0272`'s `worklog.md` §*"For the producer — three items to file at close"*, items 1 and 2, and
**touched neither ledger**.

### ✅ RULED 2026-08-29 — the gate below is DISCHARGED, and the scope is now ONE ledger

**Owner ruling, 2026-08-29, given live via `AskUserQuestion` in a `fkit lead` session — the option
label is the verbatim text: "Correct 0188 only (Rec)".** That is **disposition B** in
§*"The decision this brief puts"* below, which is the disposition this brief recommended.

**The ruling authorizes exactly one edit:** an appended, dated correction note beneath specimen 2,
[`0188`'s ledger](../../done/0188-repair-the-five-live-ownership-fact-defects/review.md) — the bare
`Coverage: full.` claim. ⛔ **Specimen 1, `0327`'s ledger, stays frozen and MUST NOT BE TOUCHED.**

**⭐ Why `0327` is excluded — the reason, not just the outcome. Record this, do not paraphrase it away.**
`0327`'s ledger was **written before `0272` landed**. ADR-042 D1 existed, but its three-state coverage
vocabulary had not yet been written into `claude/skills/fkit-review/SKILL.md`,
`fkit-stateful-review/SKILL.md`, or the reviewer agent text — the things a reviewer actually reads at
review time. So that ledger's `full coverage` is **an honest record of what its reviewer knew at the
time**, written in the only vocabulary then available to them. ⛔ **Correcting it would not fix an
error; it would rewrite that record** — overwriting a truthful account of a past state of the project
with a vocabulary that did not yet exist when it was written. The ledger also already tells the truth
in the same breath (*"reasoning-and-read-only per ADR-042 D1, the normal expected state, not a
degradation"*), so no reader is misled and no reader rescue is owed.

⚠️ **Re-measured 2026-08-29: `0327`'s ledger carries the banned phrase TWICE, not once** — at
`review.md:14` and again at `review.md:72` (*"**completed, full coverage** — reasoning-and-…"*). The
table below records only `:14`. **Both are out of scope**, and this note exists so a later reader does
not mistake the second one for a missed specimen.

⚠️ **`0188`'s ledger is unchanged as of this ruling** — re-measured 2026-08-29, the claim still sits at
`review.md:27` and still reads *"Reviewers run: own pass + Codex (`codex exec --sandbox read-only`,
exit 0). Coverage: full."*

*Ruling relayed and recorded by a spawned `fkit-producer`, 2026-08-29, which had no owner channel of
its own ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md))
and decided nothing — the ruling was given live in the lead session and is reproduced here verbatim.*

### ⚠️ THIS TASK IS NOT AUTHORIZED TO START YET — the same gate `0274` carried

> ✅ **DISCHARGED 2026-08-29 by the ruling above.** The words below are kept, not deleted — they are
> the reasoning that produced the question. ⛔ **Do not re-put this decision to the owner**, and read
> the gate as satisfied **for `0188` only**; for `0327` the ruling is a positive instruction to leave
> it frozen, not an undischarged gate.

The owner ruled that these recurrences be **filed**. Filing is not authorization to edit a closed
ledger. [ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)
freezes a closed ledger on its work product, and
[`0274`](../0274-append-dated-coverage-corrections-to-0259s-and-0264s-closed-review-ledgers/brief.md)
— the sibling task for the *pre*-ADR-042 specimens — could not start until an owner ruling discharged
exactly this gate (its §*"✅ RULED 2026-08-11"*). **⛔ Do not open either ledger below without an
equivalent ruling for these two.** If none exists when this task is pulled, **stop and report**; the
decision this brief exists to put is *whether* to correct them, not how.

### The two specimens, re-measured on disk 2026-08-28

Both are the exact violation ADR-042 D1 §2 names — a report claiming **full** coverage on a
reasoning-only Codex pass — and both were written **after** ADR-042 was accepted (2026-08-11).

| # | Ledger | Reads | Severity |
|---|---|---|---|
| 1 | `0327`'s review ledger, §"Reviewer findings", the "Round 1 — reviewers run:" paragraph — the coverage line | *"the Codex adversarial pass (`codex exec --sandbox read-only`, `gpt-5.6-sol`, completed, **full coverage** — reasoning-and-read-only per ADR-042 D1, the normal expected state, not a degradation)"* | **Lower.** It cites ADR-042 D1 and describes the reality **correctly**; only the two words *"full coverage"* are the banned token. A reader who finishes the sentence is not misled. |
| 2 | `0188`'s review ledger, §"Round 2 (2026-08-27) — re-verification, no new rows" | *"Reviewers run: own pass + Codex (`codex exec --sandbox read-only`, exit 0). **Coverage: full.**"* | **Higher.** A bare, unqualified claim on a `read-only` pass, with nothing beside it to correct the impression. This is the same shape as `0259`'s claim, which `0274` exists to correct. |

⭐ **The one thing that changes how this reads — measure the dates before deciding.** Both ledgers
were written **before `0272` landed** (`0327` closed 2026-08-24; `0188`'s Round 2 is dated
2026-08-27; `0272` landed 2026-08-28). ADR-042 D1 existed, but the vocabulary had **not** yet been
written into `claude/skills/fkit-review/SKILL.md`, `fkit-stateful-review/SKILL.md` or the reviewer
agent text — which is what a reviewer actually reads at review time. **So these are not evidence that
`0272` failed; they are the casualties `0272`'s own brief predicted** while it sat at `P20`
(*"every one landed without this is another defective ledger"*). ⛔ **Do not file a prevention task
off this brief on the theory that the prose did not take** — the prose was not there yet. If a
recurrence appears in a ledger written **after** 2026-08-28, that is a different and much more serious
fact, and it is a new task.

### The decision this brief puts

**Three dispositions. The owner picks one; this brief recommends the second.**

- **A — leave both frozen.** ADR-034's default. Cheapest, and the ledgers are history nobody re-reads.
  Cost: `0274` will have corrected two pre-ADR-042 ledgers while two worse-dated ones stand uncorrected,
  which is an incoherent record.
- **B — correct specimen 2 only (`0188`), leave specimen 1 (`0327`) frozen. ⭐ Recommended.** `0188`'s
  is a bare false claim; `0327`'s sentence already tells the truth in the same breath and needs no
  reader rescue. **The tradeoff:** the record stays slightly inconsistent — one banned phrase survives
  in `0327` — in exchange for touching one frozen ledger instead of two.
- **C — correct both**, mirroring `0274`'s treatment exactly.

## What to build

> ⚠️ **NARROWED 2026-08-29 by the owner ruling above — original words kept.** The gate **is**
> discharged, and the ruling names **exactly one ledger: `0188`'s.** Read *"whichever ledgers the
> ruling names"* below as **that one file and no other**. **One note, in one file, and stop.**

**Nothing, until the gate above is discharged.** Then, for whichever ledgers the ruling names:

**One appended, dated correction note per named ledger. Nothing else.**

Each note goes **directly beneath** the corrected claim and records that under ADR-042's three-state
vocabulary — as landed by `0272` — the pass reads **reasoning-only second opinion**: Codex ran and
reasoned, its `--sandbox read-only` flag blocks `mkdtemp` so it measured nothing, and all execution
evidence in that review is the Claude reviewer's. ⚠️ **The note must not imply the review was
deficient** — ADR-042 D1 §2 states reasoning-only is the *normal, expected* state under the current
sandbox, not a degradation.

### Constraints

- ⛔ **APPEND ONLY. Both existing claims stay byte-identical.** Prove it with `git diff`: every `-`
  line count must be zero. This is the hardest constraint in the task, and it is the same one `0274`
  carries.
- ⛔ **No in-place annotation** — no bracketed insert, no strikethrough, no edited word.
- ⛔ **Nothing else in either ledger changes** — not `Status:`, not the verdict, not the findings
  table, not the residuals. **Do not reopen either review** and do not add a round.
- ⛔ **Do not touch either task's `brief.md`, `plan.md`, `worklog.md`, or its board row.** Both stay
  `✅ Done (agent-closed — not owner-verified)` on Sprint 6. ⛔ **No task-file move**
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md))
  and no re-rank.
- ⛔ **Do not edit ADR-042** — its stale citations are `0349`, not this task.
  > 🆕 **2026-08-29 — pointer refreshed, original words kept:** `0349` was **cancelled as superseded**
  > on owner ruling 2026-08-29 (*"One combined pass (Rec)"*) and its scope absorbed into
  > [`0344`](../0344-refresh-the-stale-line-refs-and-moot-r5-rationale-inside-release-mjss-fenced-summary-block/brief.md).
  > **The constraint is unchanged and still binding** — ADR-042's stale citations belong to `0344`
  > now, and remain out of scope here.
- ⛔⛔ **DO NOT TOUCH `0327`'s LEDGER** (`ai-agents/tasks/done/0327-refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim/review.md`)
  — **owner ruling 2026-08-29, "Correct 0188 only (Rec)"**. Its `full coverage` at `:14` **and** at
  `:72` both stay **byte-identical**. ⚠️ **This is not an oversight to helpfully tidy up:** that ledger
  pre-dates `0272`, so its wording is an honest record of what its reviewer knew, and correcting it
  would rewrite that record. **`git diff` on that file must be completely empty.** A reviewer of this
  task should treat any change there as a failure, not a bonus.
- ⛔ **Do not touch `0259`'s or `0264`'s ledgers** — those are `0274`'s, and doing both here would
  double-correct them.
- ⛔ No `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  ⛔ No commit. ⛔ No source-code change of any kind.

## Verification steps

1. **The owner's ruling is recorded in the worklog before any edit** — the ruling text, its date, and
   the channel it came through, plus which disposition (A/B/C) was chosen. ⛔ If no ruling exists,
   **stop and report**; do not proceed on this brief's reasoning alone.
2. **Both original claims are byte-identical** — paste `git diff` on each named ledger and show the
   diffs are pure additions.
3. **Every ledger the ruling did *not* name has an empty `git diff`** — state which, by folder ID.
4. **Each note names what it corrects by durable anchor, not by `:NNN` alone** — quote the corrected
   claim inside the note so it survives a later line shift
   ([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
5. **Re-measure both coordinates on disk before editing** and report what moved — the `:NNN` values in
   this brief are dated 2026-08-28 anchors of convenience; the quoted text is the durable anchor.
6. **Full `npm test` green.** State the measured counts. ⚠️ It proves **nothing** about the content of
   the notes — say so rather than implying coverage. It exists only to catch an accidental structural
   break in a `done/` task folder.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- ⚠️ **It still cannot start without an owner ruling** (see the gate in `## Context`). That is an
  **authorization** gate, not a task dependency, and it is deliberately **not** written as a
  `Depends on` — inventing a dependency to express a gate is the trap `0184` and `0149` warn against,
  and it would make the board's derive cell say something false.
- **Sibling, not a duplicate:**
  [`0274`](../0274-append-dated-coverage-corrections-to-0259s-and-0264s-closed-review-ledgers/brief.md)
  covers `0259` and `0264` — the **pre**-ADR-042 specimens — and its `## What to build` reads
  *"Two appended correction notes. Nothing else."* ⭐ **Why a new brief rather than a note appended to
  `0274`:** `0274`'s scope is hard-closed at two enumerated ledgers, its per-ledger verification steps
  are written against those two, and the owner ruling that authorized it (2026-08-11) named those two.
  Widening it would have rewritten the brief and stretched a ruling past what it said. A dated
  cross-reference was appended to `0274`'s `## Notes` instead, so the two are findable together.
- **Soft ordering, deliberately NOT a `Depends on`:** best run **after** or **with** `0274`, so all
  correction notes use one wording. Either is writable alone.
- ⚠️ **This task's value is bounded, and stated plainly:** it buys a pointer for a reader who opens a
  frozen ledger without ADR-042 in hand. It does not make either review better, and it changes neither
  task's status.
- **On the board and the rank:** filed to the [Backlog](../../../sprints/backlog.md) board, unranked,
  deliberately — the ruling settled *what*, not *when*, and nothing waits on this. It touches no
  shipped code and is not on the release path.
- **Snapshot provenance:** every `:NNN` and every quoted phrase in this brief was read from disk on
  **2026-08-28** by a spawned `fkit-producer`, not copied from `0272`'s worklog. Treat as dated.
- ⛔ **Nothing else was touched by filing this:** no ledger edit, no ADR edit, no source edit, no
  `ai-agents/wiki-vault/` write, no commit.
