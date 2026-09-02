# ADR — the narrow in-flight review-fix lane: a reviewer's finding on a diff already under review is recorded, not filed as a task

## ID
0352

## Sprint
Sprint 7

## Priority
P2

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

### The owner ruling this task executes — quoted, because its narrowness is the whole point

**Owner ruling, 2026-08-29, given live via `AskUserQuestion` in a `fkit lead` session. The option
label is the verbatim text: "Narrow it — in-flight review fixes only (Rec)".** It was put to the
owner with this description, and the description is binding on this task:

> *the lane covers ONLY a fix a reviewer finds on a diff already in front of them. It exempts no new
> work and needs no size judgement at filing time — it just stops a reviewer's own finding from
> becoming a task folder. Your standing rule survives untouched.*

⛔ **THREE THINGS THIS RULING FORBIDS, STATED BEFORE ANYTHING ELSE, BECAUSE AN EARLIER PROPOSAL HAD
ALL THREE AND WAS SUPERSEDED BY NAME:**

1. ⛔ **NO SIZE FLOOR.** Not "under N lines", not "trivial", not "one-liner". The lane is defined by
   **where the finding came from**, never by how big the fix is.
2. ⛔ **`/fkit-task-brief`'s smallest-shippable rule is NOT AMENDED.** The owner's standing rule —
   *"All tasks should be split into the smallest possible shippable tasks. If a part of a bigger
   system can be developed, tested and shipped separately, it's worth creating a sub-task for it and
   splitting the bigger task"* — survives **untouched, byte-for-byte**. An ADR that weakens, qualifies
   or footnotes it has failed this task.
3. ⛔ **NO NEW WORK IS EXEMPTED.** Work that did not arrive as a finding on a diff already under
   review still gets a brief, however small.

**A superseded proposal, named so it is not revived.** A prior scoping pass proposed amending the
smallest-shippable rule with a size floor. **The owner rejected that shape and chose the narrow one
above.** ⛔ Do not reintroduce it as an option, a footnote, or a "rejected alternative that could be
revisited"; it may appear in §Options-considered **only** as rejected, with this ruling as the reason.

### Why the lane exists at all

A reviewer working a diff finds a defect in that diff. Today there is no written route for it, so it
becomes either an untracked in-place fix or a new task folder. **Neither is right:** the first is
invisible, the second manufactures a record-repair row for something that could have been closed
inside the review it came from. Sprint 7's stated success criterion is to **cap record-repair rows**,
and this lane is one of its two structural causes.

**The route already half-exists.** The stateful review pair —
[`fkit-stateful-review`](../../../../claude/skills/fkit-stateful-review/SKILL.md) (reviewer writes
findings) and [`fkit-process-stateful-review`](../../../../claude/skills/fkit-process-stateful-review/SKILL.md)
(coder verifies, classifies, gates on the owner, records the outcome) — already round-trips findings
through a `review.md` ledger inside the task folder. **This ADR's job is to say when that ledger is
the terminus and when a finding must still leave it as a brief**, not to invent a new mechanism.

### The conflict this ADR must face, not route around

[ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)
makes a closed review ledger **frozen**. A lane that terminates findings in the ledger therefore has a
hard edge: **a finding that arrives after the ledger closes cannot use the lane.** Say so explicitly;
do not leave it to be discovered.

## What to build

**One ADR**, written with [`/fkit-record-decision`](../../../../claude/skills/fkit-record-decision/SKILL.md)
into `ai-agents/knowledge-base/decisions/`. It allocates the next free ADR number — **045 as measured
2026-08-29; re-derive it, do not copy this number forward**
([`evidence-before-assertion`](../../../knowledge-base/conventions/evidence-before-assertion.md)).

**The ADR must answer all five, each in its own section:**

1. **The entry condition, stated so it is checkable with no judgement call.** What exactly makes a
   finding "in-flight"? The candidate condition, offered as a starting point and not as the answer:
   *the finding is about the diff currently under review, and the review that surfaced it has not yet
   closed.* Name the artifact that proves each half.
2. **The route.** Where the fix and its record go — which file, which section, which skill writes it,
   and what the reader of that record sees six months later. Reuse the existing `review.md` ledger
   sections rather than inventing a parallel store.
3. **The four hard limits**, ruled on individually and by name:
   - a finding that is **out of scope of the diff** — does it use the lane? (Recommendation: **no**.)
   - a finding that arrives **after the ledger closes** — ADR-034's frozen wall. (Recommendation:
     **no** — it files a brief.)
   - a finding the coder **disputes**, or the owner rules against — does the lane still terminate it?
   - a fix that is **large** — the ruling says size is irrelevant, so state that a large in-scope
     in-flight fix **stays in the lane**, and say what stops that becoming a hiding place.
4. **What is unchanged.** An explicit section stating that `/fkit-task-brief`'s smallest-shippable
   rule is untouched, and that no category of new work is exempted. ⛔ **This section is mandatory** —
   without it, a later reader will read the lane as a general small-fix exemption, which is exactly
   the shape the owner rejected.
5. **The follow-ups.** Which skills would need edits to implement the lane —
   `fkit-stateful-review`, `fkit-process-stateful-review`, `fkit-review`, `fkit-process-review`,
   `fkit-task-brief` — **named, not edited.** Filing them is the producer's act, after this ADR is
   accepted.

⛔ **Constraints:**

- **⛔ This task writes ONE ADR file and nothing else.** No skill edits, no source, no tests, no board
  status changes, no task-folder moves.
- **⛔ Do not write `ai-agents/wiki-vault/`** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- **⛔ No `path:NNN` line-number citations** in the ADR — anchor on quoted text
  ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
- **⛔ Do not amend `/fkit-task-brief`.** Naming it as a follow-up is the whole of this task's reach
  into it.

## Verification steps

1. The ADR file exists under `ai-agents/knowledge-base/decisions/`, its number is one above the
   highest on disk at write time, and `## Status` reads `proposed` or `accepted` per
   `/fkit-record-decision`'s own rule.
2. **`git diff --stat` shows exactly one new file** plus this task's own folder. ⛔ Zero changes under
   `claude/`, `test/`, `ai-agents/sprints/`, `ai-agents/wiki-vault/`.
3. **`git diff` shows `claude/skills/fkit-task-brief/SKILL.md` unchanged — zero lines.** Prove it with
   the command; do not assert it.
4. `grep -c` the ADR for a size threshold: **zero** hits for a numeric line/byte/word floor, and zero
   for `trivial` / `one-liner` / `small enough` used as an entry condition.
5. The ADR contains a section whose text states the smallest-shippable rule is unchanged, and quotes
   the owner's standing rule verbatim.
6. All five numbered questions above have a section each, and the four limits in (3) each carry an
   explicit ruling — not a "to be decided".
7. ADR-034's frozen-ledger edge is named in the ADR by ADR number.
8. The follow-up skills are **named** and **not edited** — cross-check against step 2's `git diff --stat`.
9. `npm test` green. Report the counts.

## Notes

- **Depends on:** nothing.
- **Blocks:** its own follow-ups — the skill edits that implement the lane, which are **not filed
  yet** and are the producer's to file once this ADR is accepted. ⛔ **Nothing on Sprint 7 depends on
  this task**, so it may run in parallel with `0353`–`0355`.
- ⚠️ **This is an ADR, not an implementation.** Nothing changes behaviour until the follow-ups ship.
  A close report that implies the lane is live has misreported.
- ⚠️ **The superseded proposal is recorded above deliberately.** A size floor was proposed, put to the
  owner, and rejected by name. It is written down so the next reader can tell a rejected option from
  an unconsidered one.
- **Priority `P2` is a rank on Sprint 7's board, assigned in the same act that ranked the board on the
  owner's ruling of 2026-08-29** — see [`sprint-7.md`](../../../sprints/sprint-7.md) §"⭐ THIS BOARD IS
  RANKED". It is **not** an append-rank flagged for confirmation: the owner approved this row at this
  position. Rank is board position, never identity — the identity is `0352`
  ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
- **Source:** owner ruling of 2026-08-29 (`AskUserQuestion`, live `fkit lead` session), option label
  *"Narrow it — in-flight review fixes only (Rec)"*, with the binding description quoted in full above.
</content>
</invoke>
