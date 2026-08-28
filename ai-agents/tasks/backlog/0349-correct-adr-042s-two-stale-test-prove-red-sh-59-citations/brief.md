# Correct ADR-042's two stale `test/prove-red.sh:59` citations

## ID
0349

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### Where this came from

Filed 2026-08-28 by a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
at the close of
[`0272`](../../done/0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/brief.md),
on the owner's ruling that the producer files it. The drift was **found and re-verified on disk in
`0272`'s Round 2 stateful review** (`review.md`, R12's disposition row and the round's residual list);
`0272` corrected its **own** dated note to cite the right line and **deliberately did not touch the
ADR** — an ADR amendment is the architect's, not the coder's.

### The drift, re-measured on disk 2026-08-28

[`ADR-042`](../../../knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md)
cites `test/prove-red.sh:59` for the line `work="$(mktemp -d)"` at **two** sites:

| Site | Reads |
|---|---|
| `adr-042-…md:33` | *"`test/prove-red.sh:59` opens with `work="$(mktemp -d)"`, so fkit's own red-proof harness is among the things Codex cannot run."* — inside the §Context paragraph that establishes the whole ADR's premise |
| `adr-042-…md:313` | the §Evidence list: `· test/prove-red.sh:59` |

⚠️ **The real line is a moving target, and this is the point.** Measured 2026-08-28:
`work="$(mktemp -d)"` is at **`:80` at `HEAD`** and **`:82` in the working tree** — the file is under
an unrelated in-flight change. **⛔ Do not write `:82`, or `:80`, or any number measured today.**

### Why it matters, stated once

ADR-042 is the decision `0272` implements. Its **D1 §*"Re-raise only if"*** conditions are load-bearing
for every review round from here on: a reviewer who re-raises a settled coverage question is expected
to check them, and a reviewer who follows a citation into the wrong line loses confidence in the whole
paragraph. `:33` is not a footnote — it is the sentence that establishes *why* a Codex pass measures
nothing.

### The conflict this brief must not create

`durable-citation-anchors.md` is the governing rule, and it cuts **against** simply refreshing the
number: a citation into a **living file a third party edits under you** must not be a naked line
number. The 2026-08-28 measurement — two different lines in two different revisions of the same file —
is that rule demonstrating itself. **So the fix is not "59 → 80".**

## What to build

**Comment-and-citation change to one file. No source change, no decision change.**

Re-point both citations so they resolve without a naked line number. **The architect chooses the
form**; two that satisfy the convention:

- **Name the anchor, not the coordinate** — e.g. *"`test/prove-red.sh` opens its work dir with
  `work="$(mktemp -d)"`"*, quoting the durable string and dropping `:NNN` entirely. **Simplest, and
  the recommended default** — the quoted line is unique in the file and survives every renumber.
- **Freeze the revision** — cite `test/prove-red.sh:NN` *as of* a named commit SHA, per the
  convention's *"safe when the citer controls or freezes the target's revision"* clause. Heavier;
  choose it only if the exact coordinate is load-bearing, which it does not appear to be here.

### Constraints

- ⛔ **ADR-042's Decision, Status, Date, Deciders, and every D1/D2 clause stay byte-identical.** This
  is a **pointer repair**, not an amendment: a historical record's claims are frozen, its links are
  not. If the surrounding sentence has become factually wrong beyond the coordinate, **stop and report
  it** rather than rewriting it under this brief.
- ⛔ **Change no other citation in the ADR.** Its `claude/skills/…:NN` call-site list and its
  `tasks/done/…/review.md:NN` evidence list are **out of scope** — they have the same durability
  problem and are a separate decision.
- ⛔ **Do not edit `test/prove-red.sh`.** Nothing is wrong with it; it moved.
- ⛔ **Do not edit `0272`'s corrected note** — it already cites the right anchor and is inside a closed
  task folder.
- ⛔ No `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  ⛔ No commit. ⛔ No new devDependency
  ([ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)).

## Verification steps

1. **`grep -n 'prove-red' ai-agents/knowledge-base/decisions/adr-042-*.md` returns no `:59`** — and
   returns no naked `:NNN` for that file at all, if the recommended form was chosen.
2. **`grep -n 'mktemp -d' test/prove-red.sh` is run and its output pasted** in the worklog, at
   implementation time, so the record shows what the line actually was that day.
3. **`git diff` on ADR-042 is confined to `:33` and `:313`** — paste it. Every other line unchanged.
4. **The ADR still reads correctly at `:33`** — quote the whole rewritten sentence in the worklog. The
   claim it makes (Codex cannot run the red-proof harness) must be unchanged in meaning.
5. **State which form was chosen (anchor or frozen revision) and why**, against
   [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md).
6. **Full `npm test` green.** State the measured counts, and say plainly that no test reads ADR prose —
   green proves nothing about this change.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Sibling, same class:**
  [`0344`](../0344-refresh-the-stale-line-refs-and-moot-r5-rationale-inside-release-mjss-fenced-summary-block/brief.md)
  — stale `:NNN` references inside `bin/release.mjs`'s fenced summary block, also a comment-only
  refresh, also governed by `durable-citation-anchors.md`. ⚠️ **Not a dependency in either direction**;
  they touch different files and neither waits on the other. Worth pulling together if a session wants
  the whole citation-drift class in one pass — that is an ordering preference, not an edge.
- ⚠️ **Whichever form is chosen here is a precedent the next ADR citation will copy.** `0344` faces the
  same question for in-code comments and has an open question to the owner about an addendum to
  `durable-citation-anchors.md`. **This brief does not decide that** — if the architect thinks the
  convention needs an addendum, that is a separate ADR or convention change, escalated, not folded in.
- **On the board and the rank:** filed to the [Backlog](../../../sprints/backlog.md) board, unranked,
  deliberately. It is a two-line pointer repair with no consumer waiting on it.
- **Snapshot provenance:** `adr-042-…md:33` and `:313`, and the `:80`/`:82` measurements, were read
  from disk on **2026-08-28** by a spawned `fkit-producer`. Treat every number here as dated — and the
  brief's own point is that they will move again.
- ⛔ **Nothing else was touched by filing this:** no ADR edit, no source edit, no ledger edit, no
  `ai-agents/wiki-vault/` write, no commit.
