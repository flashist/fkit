# Sweep B — the single-site correction notes in ONE pass, absorbing and closing the individually-filed rows

## ID
0357

## Sprint
Sprint 7

## Priority
P9

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### ⛔ READ THIS FIRST — THIS TASK ABSORBS EXISTING ROWS. IT DOES NOT SIT BESIDE THEM.

**The single-site-correction-note class is already on the board as ~20 separate open briefs.** Filing
a sweep *alongside* them would be a duplicate — and a self-inflicted instance of the exact problem
Sprint 7 exists to fix. ⛔ **It is filed instead as the row that DOES their work in one pass and CLOSES
them.**

This task's deliverable is **two things, not one**:

1. the notes, written once, verified once; **and**
2. **every absorbed row closed** — via the producer, per
   [ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md),
   each carrying the **`(agent-closed — not owner-verified)`** marker (ADR-033 §5).

⭐ **Those closes are owner-authorized in advance.** Owner ruling, 2026-08-29, given live via
`AskUserQuestion` in a `fkit lead` session — option label, verbatim: **"Accept the 25 marked closes
(Rec)"**.

⛔ **BUT THE MOVERS ARE PRODUCER-ONLY.** This task **never** runs `/fkit-task-done` or
`/fkit-task-cancelled` and **never** moves a task folder by hand. Its terminal act is to hand the
producer the exact list, with outcome and reason per row. ADR-033 admits no exception.

### The class

A **single-site correction note** row is one whose whole content is: *a record says something that is
no longer true; append a dated note at the named site saying so.* No source changes, no behaviour
change, no board status change. The record is append-only, so the note is the entire deliverable.

**They are individually correct and collectively the problem.** Each one costs a task folder, a
brief, a plan, a worklog, a review ledger and a close — six artifacts to append one paragraph. That
ratio is what drives the record-repair share Sprint 7 exists to cap.

### ⚠️ The candidate membership — measured 2026-08-29, and NOT frozen

**20 candidates**, all confirmed open in `ai-agents/tasks/backlog/` on 2026-08-29. ⭐ **Amended
2026-08-29: `0212` is ROUTED OUT to Sweep C by owner ruling, so this sweep's in-scope candidate count
is 19.** The row is kept in the table, struck, because deleting it would lose the record of where it
went. ⛔ **The three-sweep total is unchanged at ~38** — it moves from `13 + 20 + 5` to `13 + 19 + 6`.

| ID | Owner on the brief | Site the note lands on |
|---|---|---|
| `0146` | `fkit-reviewer` | `0139`'s accepted residual — the false "menu-pick alias" claim |
| `0170` | `fkit-coder` | `fkit-sprint-ship-loop` — the stale *"stays byte-unchanged"* claim |
| `0183` | `fkit-producer` | two live records — the "no closed row was renumbered" claim |
| `0196` | `fkit-architect` | ADR-010's `skillOverrides` claims, retired by ADR-018 |
| `0201` | `fkit-coder` | `0143`'s and `0158`'s closed review ledgers |
| `0205` | `fkit-architect` | ADR-037 §5's enforcement claim |
| `0207` | `fkit-architect` | ADR-020 — naming the driver a sanctioned `plan.md` writer |
| ~~`0212`~~ | `fkit-wiki` | ⛔ **ROUTED OUT — now a member of [Sweep C (`0358`)](../0358-sweep-c-the-wiki-vault-resyncs-as-one-pass/brief.md) by owner ruling 2026-08-29.** Its site is `ai-agents/wiki-vault/log.md`; see the routing warning below |
| `0274` | `fkit-reviewer` | `0259`'s and `0264`'s closed review ledgers |
| `0276` | `fkit-architect` | ADR-041's `unresolved-plan-sprint` drift-mechanism claim and its echoes |
| `0279` | `fkit-coder` | `status-report-format.md`'s undefined `N`, in both homes |
| `0281` | `fkit-architect` | ADR-003's *"the need it identified is still unmet"* claim |
| `0299` | `fkit-coder` | the archived Sprint 2–5 plans — five active-sprint-glob mechanism claims |
| `0312` | `fkit-coder` | `architecture.md`'s false *"the CI half has never actually run"* claims |
| `0318` | `fkit-producer` | `0238`'s closed brief — an acceptance naming a board state that is gone |
| `0335` | `fkit-producer` | the records inside `0327`'s task folder — two false mechanism claims |
| `0346` | `fkit-architect` | ADR-038's "roles come from the enumerated step table" claim, scoped to Build |
| `0348` | `fkit-reviewer` | `0188`'s closed review ledger — a coverage correction |
| `0350` | `fkit-reviewer` | `0125`'s closed review ledger — the R3 discharge note |
| `0351` | `fkit-coder` | `test/prove-red.sh`'s *"the only proof the seam is honoured"* wording at `0k`/`0l` |

⛔ **THIS IS A CANDIDATE LIST, NOT THE MEMBERSHIP.** Step 1 freezes the real one. Three flagged cases:

- ⛔ **`0212` WRITES `ai-agents/wiki-vault/log.md` AND CANNOT BE DONE BY THIS SWEEP.**
  [ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)
  makes vault writes `fkit-wiki`'s exclusively. ⛔ **It is never done here.**
  - ✅ **SETTLED 2026-08-29 — IT GOES TO SWEEP C, AND STEP 1 NO LONGER RULES IT.** ⚠️ This bullet
    previously read *"**Route it to [Sweep C](../0358-sweep-c-the-wiki-vault-resyncs-as-one-pass/brief.md)**
    or leave it as its own row — step 1 rules which."* **Owner ruling, 2026-08-29, given live via
    `AskUserQuestion` in a `fkit lead` session and relayed by a spawned `fkit-producer` with no owner
    channel** ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)):
    **`0212` joins [Sweep C (`0358`)](../0358-sweep-c-the-wiki-vault-resyncs-as-one-pass/brief.md).**
    The choice is the owner's and is no longer this sweep's to make.
  - ⛔ **This sweep therefore neither does `0212` nor closes it.** It is **not** on this sweep's close
    list, and its outcome is reported by `0358`. ⚠️ **Sweep C is `fkit-wiki`-owned and this sweep is
    `fkit-coder`-owned** — the routing is the ADR-005 wall, not a scheduling preference.
- **`0320` and `0321` sit on the boundary with [Sweep A](../0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md)** —
  both repair a stale claim *by appending a dated note*. ⛔ **Each must land in exactly one sweep.**
  Sweep A's step 1 rules `0320`; whichever runs first records its ruling for the other.
- **`0351` edits a shell script's wording** (`test/prove-red.sh`), not a markdown record. It is an
  append-of-truth at one site, so it fits the class in shape — but it touches `test/`. Rule
  deliberately.

⚠️ **The scope figure carried into Sprint 7 was ~25 closes across all three sweeps. It does not
reproduce.** Measured 2026-08-29, the three candidate lists total **~38 rows** (13 in Sweep A, 20
here, 5 in Sweep C). Neither number is authoritative until each sweep's step 1 runs; the owner's
ruling authorizes the closes the sweeps actually perform, not a count
([`evidence-before-assertion`](../../../knowledge-base/conventions/evidence-before-assertion.md)).

> ### ✅ DISCHARGED 2026-08-29 — THE OWNER RULED ON THE ~38, AND ~25 WAS NEVER A CAP
>
> **Owner ruling, 2026-08-29, given live via `AskUserQuestion` in a `fkit lead` session; the option
> label is the verbatim text: "Proceed — 38 is fine (Rec)".** Relayed by a spawned `fkit-producer`
> with no owner channel ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
>
> - ⭐ **The earlier ruling *"Accept the 25 marked closes (Rec)"* settled the MECHANISM, not a count.**
>   The "25" in that option label is the estimate the owner was shown; it was never a ceiling.
> - ⭐ **~38 stands.** ⛔ **There is no 25-row cap, and no brief or board may be read as imposing one.**
> - ⚠️ **Step 1 still freezes this sweep's own membership**, and the ruling authorizes the closes this
>   sweep actually justifies — ⛔ **not a quota to hit.**
> - ⚠️ **The split moved, the total did not.** With `0212` owner-routed to Sweep C the same day, the
>   ~38 is now `13 + 19 + 6` rather than `13 + 20 + 5`.
> - **Expected effect on open work, measured 2026-08-29:** **138** open task folders today
>   (all `🔲 Backlog`), falling to **~100** if ~38 close. ⛔ Re-measure before quoting.

### ⛔ THE HARD GATE — this task does not start until two guards are green

⛔ **`0354`'s `test/reference-integrity.test.js` AND `0176`'s
`test/coordination-citation-policy.test.js` must both be GREEN before this sweep touches a file.**
The owner-agreed *"verified, not trusted"* constraint. A pass that appends notes across twenty records
with no guard underneath it cannot demonstrate it left the tree consistent.

## What to build

### Steps

1. **Freeze the membership, in writing, before touching anything.** In/out per candidate with a
   reason; rule `0320`/`0321`'s sweep assignment and `0351`'s inclusion. State the
   total. ⛔ A membership decided after the edits is a rationalisation.
   ⛔ **`0212`'s routing is NOT among them — it is owner-ruled into Sweep C (2026-08-29) and this step
   records that ruling rather than re-taking it.** ⚠️ This step previously read *"rule `0212`'s
   routing, `0320`/`0321`'s sweep assignment, and `0351`'s inclusion"*.
2. **Re-verify every claim, firsthand.** Each member asserts that a specific record says something
   false. ⛔ **Do not inherit the assertion** — read the site, at `HEAD` and in the working tree, and
   record what it actually says. ⚠️ **Some will have been fixed already.** A member whose claim no
   longer reproduces is closed **`⛔ Cancelled`** with that as the reason — ⛔ never silently dropped,
   and ⛔ never "corrected" by writing a note about a claim that is no longer there.
3. **Write each note at its own site.** ⛔ **Append-only.** Do not rewrite the sentence being
   corrected; the record of what was believed is the point. Each note carries: **the date**, **what
   the record claims**, **what is actually true**, and **the authority**.
4. **Preserve every absorbed brief's own constraints.** Several carry explicit scoping — `0346` is
   *"scoped to Build"*, `0335` names *"TWO false mechanism claims"* and no more, `0321` says *"one
   repaired in place, one annotated"*. ⛔ **A sweep does not get to relax a member's scope**; quote
   each constraint in the worklog and honour it.
5. **Hand the producer the close list** — one line per absorbed row: ID, outcome, reason. ⛔ **Do not
   run the movers. Do not move a folder.**

⛔ **Constraints:**

- **⛔ Do not run `/fkit-task-done` or `/fkit-task-cancelled`, and do not move any task folder** (ADR-033).
- **⛔ Edit nothing under `ai-agents/wiki-vault/`** (ADR-005) — `0212` is routed out, not done here.
- **⛔ Closed review ledgers are append-only** ([ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)).
  Six members (`0201`, `0274`, `0348`, `0350`, and `0318`/`0335` on closed folders) land notes **inside
  closed task folders**. That is exactly what a dated append is for — ⛔ but the existing text is never
  edited, reordered or reflowed. Only appended to.
- **⛔ Do not absorb a row from Sweep A or Sweep C.** Three sweeps, disjoint membership.
- **⛔ Change no `## Status`, `## Sprint`, `## Priority`, `## ID` or `## Owner` field** on any absorbed
  brief. The closes are the producer's act and they touch those fields; this task does not.
- **⛔ No `path:NNN` citations in the notes** — anchor on quoted text
  ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)).

## Verification steps

1. **The gate, proved first:** paste the passing runs of `test/reference-integrity.test.js` **and**
   `test/coordination-citation-policy.test.js` **taken before the first edit**. ⛔ A close report
   without both green runs, dated before the diff, has failed verification.
2. The frozen membership list exists in the worklog **before** any edit, with an in/out verdict and
   reason per candidate, and explicit rulings on `0320`, `0321` and `0351`. **`0212` is recorded as
   routed to Sweep C by the owner's ruling of 2026-08-29** — ⛔ not re-decided here, and ⛔ not on this
   sweep's close list.
3. Every member's claim was re-verified firsthand and the finding recorded — reproduced or not — per
   member. **Name every one that did not reproduce**, with what the site actually says.
4. **Append-only, proved:** `git diff -U0` on every edited record shows **`−0`** — zero removed lines
   — outside a note being extended. ⛔ Prove it with the command; do not eyeball it.
5. Every note carries a date, the claim, the correction and the authority. Grep for the date in each.
6. Each absorbed brief's own scoping constraint is quoted in the worklog and shown honoured — name
   `0346`'s *"scoped to Build"*, `0335`'s "TWO", `0321`'s "one in place, one annotated".
7. `git diff --stat` shows **zero** files under `ai-agents/wiki-vault/` modified.
8. **`git status` shows no task folder moved** and no board row flipped to `✅ Done` or `⛔ Cancelled`
   by this task. The close list is a **hand-off**, and the report says so.
9. Both guards **still green after** the sweep. Show the runs.
10. Run the dashboard over all live boards; report roll-ups and drift before and after. **No board
    gains a drift record.**
11. `npm test` passes, including `test/prove-red.sh`. Report the counts.

## Notes

- **Depends on:** `0353`, `0354`, `0176`, `0237` — ⛔ **all hard.** `0353` supplies the condition;
  `0354` and `0176` are the two guards that must be **green**, and `0176` cannot be green until `0237`
  lands.
- **Blocks:** nothing.
- ⛔ **This task closes nothing itself.** Every close is the producer's act, via the movers, carrying
  `(agent-closed — not owner-verified)` (ADR-033 §5). The marker is permanent.
- ⚠️ **The absorbed rows carry FIVE different `## Owner` values** — `fkit-coder`, `fkit-producer`,
  `fkit-architect`, `fkit-reviewer`, `fkit-wiki`. This sweep's owner is `fkit-coder` by the owner's
  approved board. **`fkit-wiki`'s row (`0212`) is routed out entirely — ADR-005 is a wall, not a
  preference — and its destination is now named: [Sweep C (`0358`)](../0358-sweep-c-the-wiki-vault-resyncs-as-one-pass/brief.md),
  by owner ruling of 2026-08-29.** Where a member needs a judgement only the architect or the reviewer can make (an ADR's
  meaning; a coverage verdict), ⛔ **surface it rather than deciding it.**
- ⚠️ **Nine candidates land notes on ADRs** (`0196`, `0205`, `0207`, `0276`, `0281`, `0346`, plus
  ADR-042 adjacency). An ADR's correction note is a statement about a decision's standing.
  ⛔ **Do not restate an ADR's decision, narrow it, or mark it superseded** — the note says what is no
  longer true and nothing more.
- **Priority `P9` is a rank on Sprint 7's board, assigned in the same act that ranked the board on the
  owner's ruling of 2026-08-29** — see [`sprint-7.md`](../../../sprints/sprint-7.md) §"⭐ THIS BOARD IS
  RANKED". Rank is board position, never identity
  ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
- **Source:** Sprint 7 scope, owner rulings *"Approve all 12 as proposed (Rec)"* and *"Accept the 25
  marked closes (Rec)"*, both 2026-08-29, `AskUserQuestion`, live `fkit lead` session.
</content>
