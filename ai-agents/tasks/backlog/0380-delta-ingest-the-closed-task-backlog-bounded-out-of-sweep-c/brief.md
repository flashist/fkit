# Delta-ingest the closed-task backlog accumulated 2026-08-29 → present — the 45 closed tasks Sweep C bounded OUT while advancing the watermark

## ID
0380

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

**Owner ruling T2, 2026-09-05**, given live via `AskUserQuestion` in a `fkit lead` session — **the
option label is the verbatim text: "Bound out + filing request (Rec)"**.

Filed by a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
executing the mechanics of the ruling and deciding nothing beyond them.

⚠️ **Filed UNRANKED onto the Backlog board — this row APPENDS and renumbers nothing**
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

### ⛔⛔ THE HAZARD THIS ROW EXISTS TO DISCHARGE — A CLEAN WATERMARK THAT IS NOT A CLEAN VAULT

[`0358`](../../done/0358-sweep-c-the-wiki-vault-resyncs-as-one-pass/brief.md) (Sweep C) ran a full vault pass
on 2026-09-05 and **advanced `ai-agents/wiki-vault/.wiki-watermark` from `16754e3` to `cf289c2`.**

⛔ **That advance does NOT mean the closed-task backlog was ingested. It was not.** A future
`/fkit-wiki-sync` run reads the watermark, sees a clean delta, and — with nothing else to go on —
would conclude the vault is current. **It is not current, and this row is the outstanding work.**

### ⭐ WHY THE HAZARD IS ALREADY DEFUSED IN THE RECORD — AND WHY THAT MATTERS TO THIS ROW

⭐ **The bound is written into `ai-agents/wiki-vault/log.md` itself, in TWO entries, not only into
Sweep C's worklog.** That was deliberate: a worklog is a task's own record and a future sync run has
no reason to read it, whereas `log.md` is the first thing a sync run reads.

| Entry | Section | What it says |
|---|---|---|
| `2026-09-05 — ingest (sync) — sweep C, task 0358` | § *"⛔ THE BOUND — 45 uningested closed tasks are DELIBERATELY NOT IN THIS PASS"* | the measurement, the ruling, and the reasons |
| the same run's lint entry | § *"⛔ WATERMARK ADVANCED — and what that must NOT be read to mean"* | *"A future sync must treat the closed-task backlog as OUTSTANDING despite a clean watermark."* |

⛔ **Consequence for this row: do not re-derive the bound from the watermark.** The watermark cannot
tell you what is missing — it says nothing is. **Derive the set from the vault's own page inventory
against the closed-task folders on disk**, exactly as step 1 below requires.

### The measurement, as recorded — ⛔ a dated figure, not a standing truth

**Measured 2026-09-05 by the Sweep C wiki worker:** **61** closed-task folders touched since the
`16754e3` watermark (committed plus working tree); **45** of them have **no vault task page** under a
slug match.

⚠️ **Slug matching is a FLOOR, not a census** — a page may exist under a different slug, so the real
uningested count could be lower. It could also be higher: **Sweep C's reviewer independently counted
64 folders / 48 without a slug-matched page**, a difference in the safe direction. ⛔ **Neither pair
of numbers is this row's input.** They establish the order of magnitude and nothing more
([`0301`](../0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md)
— a dated claim is correct as of its date).

### ⭐ WHY THIS IS A SEPARATE ROW AND WAS NOT FOLDED INTO SWEEP C

The owner's reasons, as ruled:

- **45 is roughly 7.5× Sweep C's member count.** Folding it in would have made that pass
  **unauditable against its own member-shaped verification steps**.
- ⛔ **A task ingest is a DIFFERENT ACT from a resync.** A resync reconciles an existing page with a
  changed truth. A task ingest **creates new synthesized knowledge** and needs its source read in
  full. Same role, same write surface, different act.

### ⭐ WHY THIS ROW IS `fkit-wiki`'s AND NOBODY ELSE'S

[ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md):
**reads of `ai-agents/wiki-vault/` are decentralized; writes are exclusively `fkit-wiki`'s.** This
row's entire deliverable is a vault write. ⛔ **This is a wall, not a routing preference**
([ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
— the build role follows the deliverable's skill).

## What to build

**One vault ingest pass** over the uningested closed-task backlog, run with the wiki role's own
procedures — [`/fkit-wiki-ingest`](../../../../claude/skills/fkit-wiki-ingest/SKILL.md) to write, with
[`/fkit-wiki-lint`](../../../../claude/skills/fkit-wiki-lint/SKILL.md) as the health check after.
⚠️ [`/fkit-wiki-sync`](../../../../claude/skills/fkit-wiki-sync/SKILL.md)'s watermark-driven delta
**will not find this set** — see the hazard above.

### Steps

1. **Re-derive the set firsthand, from the inventory — ⛔ NOT from the watermark and ⛔ NOT from the
   61/45 or 64/48 figures.** Enumerate the closed-task folders under `ai-agents/tasks/done/` whose
   close falls in the window, and match each against the vault's task pages. ⛔ **Match on more than
   the slug** — the recorded figures are explicitly a floor because slug matching alone misses a page
   filed under a different name. **Report the derived count and the method that produced it, and say
   how it differs from 45.**
2. **Decide and record a bound for THIS pass before writing anything.** ⚠️ If the derived set is
   large enough that one pass cannot be verified per-page, **say so and bound it**, with the same
   discipline Sweep C used: the bound goes in `log.md`, not only in the worklog, and the remainder is
   handed to the producer as a filing request. ⛔ **Do not silently ingest a subset.**
3. **Ingest**, one page per task, each carrying its `**Date**:` / `**Status**:` / `**Source**:` inline
   metadata, its `index.md` catalog row, and reciprocating cross-links.
4. **Lint** — report broken links, index gaps, missing back-links and template drift, with counts
   **before and after**.
5. **Settle the watermark question explicitly and record the answer.** The watermark already reads
   `cf289c2`. State in `log.md` what this pass's completion does and does not mean for it, so the next
   run inherits an unambiguous record rather than a second silent advance.
6. **Hand the producer any close list or filing request** — one line per row, with outcome and reason.

⛔ **Constraints:**

- ⛔ **Do not run `/fkit-task-done` or `/fkit-task-cancelled`, and do not move any task folder**
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
  Route every close to the producer; an agent-performed close carries
  `(agent-closed — not owner-verified)` (ADR-033 §5).
- ⛔ **Do not write source, tests, task briefs, or any sprint/backlog board.** This row's entire write
  surface is `ai-agents/wiki-vault/`.
- ⛔ **`log.md` is APPEND-ONLY** on the standing owner ruling of 2026-08-03. Past entries — the two
  bound entries above included — stay **byte-identical**; `git diff ai-agents/wiki-vault/log.md` must
  show **zero deletions**.
- ⛔ **No `path:NNN` citations** in anything this pass writes
  ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
- ⛔ **No secrets in any vault page.**

## Verification steps

1. `git diff --stat` shows changes **only** under `ai-agents/wiki-vault/`, plus this task's own folder.
2. The derived set exists in the worklog **before any write**, with the method that produced it and
   its delta against the recorded 45.
3. `git diff ai-agents/wiki-vault/log.md` shows **zero deletions**, proved by the command — the two
   bound entries are byte-unchanged.
4. Every ingested page has an `index.md` catalog row and reciprocating cross-links; report the page
   count before and after.
5. `/fkit-wiki-lint` runs clean; counts reported before and after.
6. `git status` shows **no task folder moved** and no board row flipped by this task.
7. ⚠️ **`npm test` is NOT evidence for this row.** `test/reference-integrity.test.js` arm **L5**
   asserts positively that no `ai-agents/wiki-vault/` file ever enters the scanned set, and
   `test/coordination-citation-policy.test.js` never walks the vault. **`/fkit-wiki-lint` is what
   verifies this pass.** Run the suite and report it, then say what it cannot prove — ⛔ do not cite a
   green suite as coverage.

## Notes

- **Depends on nothing.** `0358` has already run; this row is its bounded-out remainder, not its
  continuation.
- **Blocks:** nothing today. ⚠️ **But every future `/fkit-wiki-sync` inherits the hazard until this
  row lands** — the watermark will keep reading clean.
- **Owner: `fkit-wiki`** — exclusive write gateway for the vault (ADR-005). ⛔ No other role may
  absorb this row.
- ⭐ **Open question for the owner, deliberately not decided:** should a watermark advance that
  knowingly leaves work uningested be **mechanically** prevented — a second marker the sync reads —
  rather than defused by prose in `log.md`? Sweep C's two entries are the current mitigation and they
  depend entirely on a future run reading them. ⛔ Not assumed here, and not this row's to settle.
- **Source:** owner ruling T2, 2026-09-05, `AskUserQuestion`, live `fkit lead` session, option label
  verbatim *"Bound out + filing request (Rec)"*; measurement from `ai-agents/wiki-vault/log.md`
  § *"⛔ THE BOUND — 45 uningested closed tasks are DELIBERATELY NOT IN THIS PASS"*.
