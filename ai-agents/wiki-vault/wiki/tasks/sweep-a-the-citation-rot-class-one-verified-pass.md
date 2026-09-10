# Sweep A — the citation-rot class in ONE verified pass, absorbing and closing the individually-filed rows

**Source**: `ai-agents/tasks/done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P8` · task `0356` · owner `fkit-coder`

## Goal

⛔ **THIS ROW ABSORBS EXISTING ROWS. IT DOES NOT SIT BESIDE THEM.** The citation-rot class was already
on the board as a dozen-odd separate open briefs; a sweep filed *alongside* them would have been a
duplicate — ⛔ **a self-inflicted instance of the exact problem Sprint 7 exists to fix.**

A **citation-rot** row is one whose whole content is: *a recorded coordinate no longer resolves to what
it claims, so repair or re-anchor it.* One by one they are cheap; together they were **a third of the
open board**, and each re-derived the same scanned set, the same exemptions and the same *"live pointer
or frozen record?"* judgement from scratch.

The deliverable is **two things, not one**: the repairs done once and verified once, **and every
absorbed row closed**.

## Key Changes

⛔ **THE HARD GATE:** `0354`'s `test/reference-integrity.test.js` **and** `0176`'s
`test/coordination-citation-policy.test.js` both **GREEN before the sweep touched a file** — the
owner-agreed *"verified, not trusted"* constraint. ⛔ A sweep that rewrites coordinates across dozens
of records with no guard underneath it **is the act that produced this backlog.**

The pass ran six steps in order, and the ordering is the point:

1. **Freeze the membership in writing, before touching anything** — ⛔ *"a membership decided after the
   edits is a rationalisation."*
2. **Re-verify every claim in every member brief firsthand.** ⛔ Do not inherit a dated coordinate. A
   member whose claim no longer reproduces is closed **`⛔ Cancelled`**, never silently dropped.
3. **Repair once, using `0353`'s settled condition** — ⛔ do not re-derive it.
4. **Classify each repair before making it:** a **live pointer** is re-anchored; a **frozen record of a
   past measurement** is left byte-identical and annotated. ⛔ **Getting this backwards destroys the
   record.**
5. ⛔ **Re-anchor, never re-cite** — quoted text, a symbol name, a heading, ⛔ never a fresh `path:NNN`.
   *A sweep that replaces rotted line numbers with fresh line numbers has scheduled its own successor.*
6. **Hand the producer the close list.** ⛔ Do not run the movers.

### The membership — froze at 10 of 13

⛔ **Closed 2026-09-04 by owner ruling H21, option label verbatim "Close 0356 now (Rec)"**, relayed to a
spawned `fkit-producer` with no owner channel — hence the agent-closed marker.

**Absorbed and closed — 10:** `0193`, `0197`, `0232`, `0275`, `0308`, `0309`, **`0320`**, `0321`,
`0343`, `0344`. (`0320` was ruled **into** Sweep A, settling the boundary case it shared with Sweep B.)

⛔ **THREE REMAIN OPEN BY OWNER RULING, NOT BY OMISSION.** ⛔ A reader must not record these as escaped
members:

| ID | Ruling | Why |
|---|---|---|
| `0286` | *"Leave 0286 open as-is (Rec)"*, re-affirmed 2026-09-04 | Half A repaired; **half B — roughly 230 inbound coordinates across roughly 60 files — deliberately not attempted.** Half B stays inside `0286` and gets no new row |
| `0323` | *"Ratify OUT (Rec)"* | Its census re-measured firsthand at **402**, not the **351** its own brief claims |
| `0298` | OUT | Its deliverable is a tripwire test, not a repair — not a member of this class |

⚠️ **The scope figure carried into Sprint 7 — *"~25 closes across all three sweeps"* — does not
reproduce.** Measured 2026-08-29 the three candidate lists totalled **~38** (13 + 19 + 6 after `0212`'s
routing). ⭐ **Owner ruling *"Proceed — 38 is fine (Rec)"*: the earlier *"Accept the 25 marked closes
(Rec)"* settled the MECHANISM, not a count.** ⛔ **There is no 25-row cap, and no brief or board may be
read as imposing one** — nor is ~38 a quota to hit.

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`.

⛔ **THE GUARDS ARE A REGRESSION GATE, NOT A COVERAGE GATE.** Neither scans
`ai-agents/knowledge-base/`, `claude/` or `bin/` for citations — so **most of this sweep's repair
surface is covered by no test at all.** ⚠️ **A green suite is NOT evidence these repairs are correct.**
What proves them is the per-repair re-resolution recorded in the folder's `worklog.md`, plus two review
rounds.

**Review:** two rounds, **15 findings, all dispositioned**; the ledger reads `Status: closed-out`.
**Coverage both rounds: reasoning-only second opinion** — ⭐ ADR-042's normal state, ⛔ **not a
degradation.**

⚠️ **`0286` and `0309` are themselves sweeps of a citation class**, and `0309`'s own title records the
form *"three consecutive sweeps could not see"*. ⛔ **Absorbing a sweep into a sweep is the shape that
had already failed three times here** — which is why step 1 had to rule on each deliberately.

- **Depends on:** `0353`, `0354`, `0176`, `0237` — ⛔ all hard.
- **Blocks:** nothing.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[tasks/sweep-b-the-single-site-correction-notes]] · [[tasks/sweep-c-the-wiki-vault-resyncs-as-one-pass]]
  — the other two sweeps; ⛔ **three sweeps, disjoint membership**
- [[tasks/build-the-link-resolution-guard]] · [[tasks/build-the-coordination-citation-policy-guard]] —
  the two guards that had to be green first
- [[tasks/settle-the-reference-integrity-condition-once-for-both-halves]] — the condition the repairs used
- [[tasks/write-the-durable-citation-anchors-convention-page]] — the re-anchoring convention
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why this row closed nothing
  itself
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] — the
  append-only rule on closed folders
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — why *reasoning-only*
  is the normal coverage state, not a failure
