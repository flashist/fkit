# Settle the reference-integrity condition, once — for both the markdown-link half and the `path:NNN` half

**Source**: `ai-agents/tasks/done/0353-settle-the-reference-integrity-condition-once-for-both-halves/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P3` · task `0353` · owner `fkit-architect`

## Goal

⭐ **An INVESTIGATION. It produces a written condition — not a test, and not a cleanup.**

Three rows were blocked on one unanswered question: `0354` builds the link guard, `0355` cleans the
red set that makes it green, and `0237` had carried the same question in its own step 3, **unanswered
since 2026-08-06**. ⛔ **None of them could start until this landed** — building a guard against an
unsettled condition is how the project got here.

The question had been open twice already. `0176` made **four scoping decisions**, all owner-ruled or
owner-accepted, and ⭐ **this task does not reopen them — it reconciles against them.** But `0176`'s
scanned set had moved out from under it: its residual list names `ai-agents/sprints/sprint-2.md`, and
the Sprint 2 → Sprint 3 rollover archived that board to `ai-agents/sprints/done/sprint-2.md`, **outside
the `sprints/*.md` glob**.

## Key Changes

The deliverable is a condition document with five parts: **the scanned set**, **the exemption set**,
**the match rule**, ⭐ **a mandatory reconciliation table** (one row per `0176` scoping decision and per
`0237` open question), and **the measured red set under the settled condition**.

⛔ **The two variables are the whole finding.** ⭐ **Between them they move the red set from 304 to 17 —
a factor of eighteen.** ⚠️ **Those figures are dated 2026-08-29 and each came from one particular
matcher** — they are one naive matcher's output, ⛔ **not a specification**, and must be re-measured
under the settled condition before being quoted.

The document's §4.1 (the link half) and §4.2 (the citation half) became **scripts to transcribe**, not
prose to re-derive — the rule both guards were built to.

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`. It unblocked `0354`, `0237` and, through them,
Sprint 7's three sweeps.

⚠️ **It did not close `0237` or change its status** — it answered `0237`'s step 3 so that `0237` could
run as a reconciliation rather than a fresh derivation.

⚠️ **The document was still under review (round 2) on 2026-08-30** while `0354`, `0176`, `0237` and
`0355` were taking their figures from it — every one of those briefs carries a "re-read §4.x on the day
you transcribe it" warning as a result.

- **Depends on:** nothing.
- **Blocks:** `0354`, `0237` — both hard.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[tasks/build-the-link-resolution-guard]] — `0354`, which transcribes §4.1
- [[tasks/build-the-coordination-citation-policy-guard]] — `0176`, which transcribes §4.2
- [[tasks/clean-the-coordination-citation-residual-set-that-blocks-0176]] — `0237`, whose step 3 this
  answered
- [[tasks/clean-the-in-scope-broken-link-red-set]] — `0355`, cancelled once this condition measured its
  red set at 0
- [[tasks/write-the-durable-citation-anchors-convention-page]] — the convention the settled condition
  enforces
- [[systems/testing-and-verification]] — where both guards landed
- *Added 2026-09-10 (sync `cf289c2`→`b4a1a52`):* [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]] — task `0356`, Sweep A — the citation-rot class in one pass
