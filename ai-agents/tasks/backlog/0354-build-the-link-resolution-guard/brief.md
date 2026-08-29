# Build the link-resolution guard — `test/reference-integrity.test.js`, with the exemptions in the definition from day one

## ID
0354

## Sprint
Sprint 7

## Priority
P4

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### What this guards

A markdown link `[label](relative/path.md)` inside `ai-agents/` whose target **does not exist on
disk**. Measured 2026-08-29 with **two** matchers, differing only in whether fenced blocks and inline
code spans are skipped: **304 across 96 files** naive-unexempted, **60 across 26** convention-correct
(honouring `0176` scoping decision 2), and ⭐ **24 across 11** once frozen closed folders, `wiki-vault/`
and archived boards are exempted. ⛔ **Take the number from `0353`, not from here** — the spread is the
point, not any one figure. The project has no automated check for this at all today: every one of
those was written by someone who believed it resolved.

**This is the enforceable half of the reference-integrity problem**, in exactly the sense
[`0176`](../0176-build-the-coordination-citation-policy-guard/brief.md) established for its own
condition: a link either resolves or it does not, so a test can check it. ⚠️ It is **not** the same
condition as `0176`'s — `0176` tests whether a `path:NNN` **citation names a coordination document**;
this tests whether a **link target exists**. Two guards, two conditions, one shared scanned set.

### ⛔ The condition is NOT this brief's to invent — it is `0353`'s deliverable

[`0353`](../0353-settle-the-reference-integrity-condition-once-for-both-halves/brief.md) settles the
exact scanned set, exemption set and match rule and writes them as **runnable commands**. ⛔ **Do not
start this task before that document exists, and do not re-derive its condition.** Implementing a
guard against a self-invented condition is precisely what put `0176` on the board unshippable for
four weeks.

### The lesson `0176` paid for, inherited here verbatim

> **"The exemption MUST be in the guard's definition from day one, or the guard is red on historical
> files the ruling has decided will never be cleaned. It is not an optimization to add later; it is
> part of the guard's definition."**

That is `0176`'s owner ruling 2 (2026-08-01), and it applies here unchanged. The two exemptions this
guard carries from the start:

- **Frozen closed task folders** — [ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md).
  **34 of the 60 convention-correct broken links live under `ai-agents/tasks/done/`** (219 of 304
  naive). A guard red on those is red on files nobody is permitted to edit.
- **`ai-agents/wiki-vault/`** — [ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md).
  Only `fkit-wiki` may write there, so no other role could ever make this guard green. ⭐ **Measured
  2026-08-29 the vault holds ZERO convention-correct broken links** — a naive matcher reports 13, and
  **all 13 are inside inline code spans**, i.e. quoted marker text, not links. ⛔ **The exemption is
  still required on principle** (no other role may repair the vault if one appears), but do not scope
  work against the 13: it is a matcher artifact. Report, never edit.

⚠️ **The exact boundary of both exemptions is `0353`'s to rule** — `0176`'s owner ruling exempts
`done/*/review.md` **by name and only that**, explicitly leaving `done/*/brief.md` and
`done/*/worklog.md` in scope. Whether the link half takes the narrow or the whole-folder shape is
answered in `0353`'s reconciliation table. **Implement whichever `0353` ruled, and name it.**

## What to build

**One new file: `test/reference-integrity.test.js`** — a hand-rolled `node --test` guard picked up by
`npm test`'s existing `node --test test/*.test.js` glob. ⛔ **No new devDependency** (ADR-014); ⛔ no
change to `package.json`.

- **The condition is `0353`'s, transcribed.** Its scanned set, its exemptions, its match rule. Where
  `0353` gave a runnable command, the test's behaviour must agree with that command's output on the
  tree as it stands.
- **The exemptions live in the guard's definition** — in the walk that builds the scanned set, **not**
  as a post-filter over failures. Structure it so this is demonstrable.
- **A stated skip convention for non-file links**: `http(s)://`, `mailto:`, and bare `#anchor` links,
  per `0353`. Say what the guard does with a `path#fragment` link whose file resolves.
- **The failure message names the citing file, the line's text (not its number), and the unresolved
  target** — ⛔ **never `file:NNN`.** A guard against broken references must not emit the coordinate
  form the project is trying to retire
  ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)).

⛔ **Constraints:**

- **⛔ Do not fix a single broken link.** That is [`0355`](../0355-clean-the-in-scope-broken-link-red-set/brief.md).
  This task ships a test file; the tree it runs against is `0355`'s to make green.
- **⛔ Do not edit `ai-agents/wiki-vault/`** — report what the guard finds there, touch nothing (ADR-005).
- **⛔ Do not edit anything under `ai-agents/tasks/done/` or `cancelled/`** (ADR-034).
- **⛔ Do not modify `test/coordination-citation-policy.test.js`** or `0176`'s scope. Two guards, kept
  separate, by `0176`'s own recorded producer judgement about `0175`.
- **⛔ Do not move any task file** — the movers are producer-only (ADR-033).

## Verification steps

1. `test/reference-integrity.test.js` exists and is picked up by `npm test` with **no** change to
   `package.json`. Show the run.
2. **Name `0353`'s condition document by filename in the worklog**, and show the guard's scanned set
   and exemption list matching it item for item. A guard whose condition differs from `0353`'s is a
   failed run, not a variation.
3. **Prove the exemption is in the definition, not a post-filter:** the guard must be green over the
   exempted files **without any of them being edited**, and instrumenting the walk must show the
   exempted paths were never visited. Prove it, do not assert it.
4. **The mutation test:** plant a broken link in an in-scope file, show the guard **fails**; remove it,
   show it passes. Plant the same broken link in an **exempted** file, show the guard **passes**.
   Report all three runs.
5. `grep -nE ':[0-9]+' test/reference-integrity.test.js` shows **no** `path:NNN` citation form in the
   guard's own messages or comments.
6. `git diff --stat` shows **zero** files modified under `ai-agents/tasks/done/`,
   `ai-agents/tasks/cancelled/`, and `ai-agents/wiki-vault/`.
7. `npm test` passes, **including `test/prove-red.sh`'s hard gate**. Report the red run, not only the
   green one.
8. **State the guard's red/green state honestly in the close report.** If `0355` has not yet landed,
   the guard is **red on the in-scope set by design** — say so with the count, and do not present a
   red guard as shipped-green. ⚠️ Conversely, do not weaken the condition to make it green.
9. Report how many links the guard **skips** (external, anchor-only, exempted) alongside how many it
   checks — a guard that checks almost nothing passes trivially.

## Notes

- **Depends on:** `0353` — hard. The condition is its deliverable; there is nothing to implement
  without it.
- **Blocks:** `0356`, `0357`, `0358` — ⛔ **hard, and this is Sprint 7's loudest sequencing rule.**
  The three sweeps do not start until **this guard and `0176` are both green**. The constraint is the
  owner-agreed *"verified, not trusted"* rule: a sweep that edits many records without a guard
  underneath it is exactly the act that produced the record-repair backlog. See
  [`sprint-7.md`](../../../sprints/sprint-7.md) §"⛔ THE FORCED SEQUENCING".
- ⚠️ **This guard may legitimately ship red** if it lands before `0355`. That is a stated,
  bounded state — not a defect and not a licence to weaken the condition. `0355` makes it green.
- ⚠️ **`0176`'s guard is a sibling, not a duplicate.** Different condition, different failure. Keep
  the two test files separate — `0176` records the producer judgement behind two files rather than one.
- **Priority `P4` is a rank on Sprint 7's board, assigned in the same act that ranked the board on the
  owner's ruling of 2026-08-29** — see [`sprint-7.md`](../../../sprints/sprint-7.md) §"⭐ THIS BOARD IS
  RANKED". Rank is board position, never identity
  ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
- **Source:** Sprint 7 scope, owner ruling *"Approve all 12 as proposed (Rec)"*, 2026-08-29,
  `AskUserQuestion`, live `fkit lead` session.
</content>
