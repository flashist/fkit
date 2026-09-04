# Sweep A — the citation-rot class in ONE verified pass, absorbing and closing the individually-filed rows

## ID
0356

## Sprint
Sprint 7

## Priority
P8

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### ⛔ READ THIS FIRST — THIS TASK ABSORBS EXISTING ROWS. IT DOES NOT SIT BESIDE THEM.

**The citation-rot class is already on the board as a dozen-odd separate open briefs.** A sweep filed
*alongside* them would be a duplicate — and would be a self-inflicted instance of the exact problem
Sprint 7 exists to fix. ⛔ **It is filed instead as the row that DOES their work in one pass and CLOSES
them.**

Concretely, this task's deliverable is **two things, not one**:

1. the repairs, done once, verified once; **and**
2. **every absorbed row closed** — via the producer, per
   [ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md),
   each carrying the **`(agent-closed — not owner-verified)`** marker (ADR-033 §5).

⭐ **Those closes are owner-authorized in advance.** Owner ruling, 2026-08-29, given live via
`AskUserQuestion` in a `fkit lead` session — option label, verbatim: **"Accept the 25 marked closes
(Rec)"** — agents run them during the sweeps, each carrying the agent-closed marker.

⛔ **BUT THE MOVERS ARE PRODUCER-ONLY.** This task **never** runs `/fkit-task-done` or
`/fkit-task-cancelled` itself and **never** moves a task folder by hand. Its terminal act is to hand
the producer the exact list, with the outcome and reason for each row. ADR-033 admits no exception.

### The class

A **citation-rot** row is one whose whole content is: *a recorded coordinate no longer resolves to
what it claims, so repair or re-anchor it.* One-by-one they are cheap; together they are a third of
the open board, and each one re-derives the same scanned set, the same exemptions and the same
"is this a live pointer or a frozen record?" judgement from scratch.

### ⚠️ The candidate membership — measured 2026-08-29, and NOT frozen

**13 candidates**, all confirmed open in `ai-agents/tasks/backlog/` on 2026-08-29:

| ID | Owner on the brief | Title (truncated) |
|---|---|---|
| `0193` | `fkit-producer` | Repair the stale citations in `0158`'s closed brief — and the same rank drift in `0162`'s |
| `0197` | `fkit-architect` | Resolve ADR-010's remaining stale code line-ranges — including one never checked at all |
| `0232` | `fkit-coder` | Correct ADR-012's stale source-of-truth claim — and every other stale coordinate in the file |
| `0275` | `fkit-coder` | Correct the stale `fkit-adversarial-review` citations in `architecture.md`'s review walkthrough |
| `0286` | `fkit-coder` | Mechanical citation sweep of `architecture.md` — resolve every `:NNN` against disk |
| `0298` | `fkit-coder` | Pin the two non-`ai-agents/` inventory rows so `README.md`'s scope sentence cannot go stale |
| `0308` | `fkit-coder` | Triage and repair `claude/`'s surviving stale task-numeral seeds |
| `0309` | `fkit-coder` | Repair the hyphenated `task-NN` citation class — the form three consecutive sweeps could not see |
| `0320` | `fkit-producer` | Repair the two stale `0171` claims in the closed briefs `0261` and `0263` |
| `0321` | `fkit-producer` | Repair the two stale `0171` claims on the live Backlog board |
| `0323` | `fkit-architect` | Re-sweep the `ADR-NNN:LINE` citation class case-insensitively, and repair ADR-013's pointers |
| `0343` | `fkit-coder` | Repair the two stale self-locators outside `0168`'s scope |
| `0344` | `fkit-coder` | Repair the citation drift in `bin/release.mjs`'s fenced summary block and in ADR-042 |

⛔ **THIS IS A CANDIDATE LIST, NOT THE MEMBERSHIP.** Step 1 below freezes the real one. Two known
boundary cases, flagged rather than decided here:

- **`0320` is also a candidate for [Sweep B](../../backlog/0357-sweep-b-the-single-site-correction-notes/brief.md)** —
  it repairs a stale claim *by appending a dated note*, which is Sweep B's shape. ⛔ **It must land in
  exactly one sweep.** Step 1 rules which.
- **`0307` was considered and excluded** — it is a *decision* about how a corrected dependency line
  reaches the dashboard, not a repair. Recorded so it is not re-considered as an omission.

⚠️ **The scope figure carried into Sprint 7 was ~25 closes across all three sweeps. It does not
reproduce.** Measured 2026-08-29, the three sweeps' candidate lists total **~38 rows** (13 here, ~20
in Sweep B, 5 in Sweep C). **Neither number is authoritative until each sweep's step 1 runs.** The
owner's ruling authorizes the closes the sweeps actually perform; it does not fix their count
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
> - ⚠️ **The paragraph above still governs everything else:** each sweep's step 1 freezes its own
>   membership, and the ruling authorizes the closes the sweeps actually justify — ⛔ **not a quota to
>   hit.** A sweep that closes fewer because members did not reproduce has obeyed the ruling; so has one
>   that closes more because step 1 found another member of the class.
> - **Expected effect on open work, measured 2026-08-29:** **138** open task folders today
>   (all `🔲 Backlog`), falling to **~100** if ~38 close. ⛔ Re-measure before quoting.

> ### ✅ CLOSED 2026-09-04 — THE MEMBERSHIP FROZE AT 10 OF 13, AND THREE STAYED OPEN BY RULING
>
> **Owner ruling H21, given live via `AskUserQuestion` on 2026-09-04; the ruling is a selection from
> an option list, so the option label is the verbatim text: "Close 0356 now (Rec)".** Relayed to a
> spawned `fkit-producer` with no owner channel, so the close is marked
> `(agent-closed — not owner-verified)`.
>
> - **This sweep absorbed and closed 10 of the 13 candidates above:** `0193`, `0197`, `0232`, `0275`,
>   `0308`, `0309`, `0320`, `0321`, `0343`, `0344`. (`0320` was ruled into Sweep A, settling the
>   boundary case flagged above.)
> - ⛔ **THREE REMAIN OPEN BY OWNER RULING, NOT BY OMISSION.** A reader must not record these as
>   escaped members:
>   - **`0286`** — half A repaired; **half B, roughly 230 inbound coordinates across roughly 60
>     files, was deliberately not attempted.** Ruling: *"Leave 0286 open as-is (Rec)"*, **re-affirmed
>     2026-09-04: half B stays inside `0286` and gets no new row.**
>   - **`0323`** — **ruled OUT.** Its census was re-measured firsthand at **402**, not the **351** its
>     own brief claims. Ruling: *"Ratify OUT (Rec)"*.
>   - **`0298`** — **OUT.** Its deliverable is a tripwire test, not a repair, so it is not a member of
>     this class.
> - ⛔ **THE GUARDS ARE A REGRESSION GATE, NOT A COVERAGE GATE.** Neither scans
>   `ai-agents/knowledge-base/`, `claude/` or `bin/` for citations — so **most of this sweep's repair
>   surface is covered by no test at all.** ⚠️ A green suite is therefore **not** evidence these
>   repairs are correct. What proves them is the **per-repair re-resolution recorded in this folder's
>   `worklog.md`** and **two review rounds**.
> - **Review:** two rounds, **15 findings, all dispositioned**; this folder's `review.md` reads
>   `Status: closed-out`. **Coverage both rounds: reasoning-only second opinion** — ADR-042's normal
>   state, ⛔ **not a degradation**.
>
> ⛔ **Nothing above this note was rewritten.** The candidate table, the boundary cases and the
> 2026-08-29 discharge all stand byte-identical; this note records the outcome beside them.

### ⛔ THE HARD GATE — this task does not start until two guards are green

⛔ **`0354`'s `test/reference-integrity.test.js` AND `0176`'s
`test/coordination-citation-policy.test.js` must both be GREEN before this sweep touches a file.**
That is the owner-agreed *"verified, not trusted"* constraint, and it is not a preference: a sweep
that rewrites coordinates across dozens of records **with no guard underneath it** is the act that
produced this backlog. The guards are what make the pass verifiable instead of trusted.

## What to build

### Steps

1. **Freeze the membership, in writing, before touching anything.** For each of the 13 candidates:
   **in / out**, with a reason. Rule `0320`'s sweep assignment. State the total. ⛔ **A membership
   decided after the edits is a rationalisation** — publish it as a discrete worklog step first.
2. **Re-verify every claim in every member brief.** Each names specific coordinates measured on a date
   in the past. ⛔ **Do not inherit them.** Re-resolve each against the file it points into, at `HEAD`
   and in the working tree, and record what is actually there. A member whose claim **no longer
   reproduces** is closed as **`⛔ Cancelled`**, not silently dropped.
3. **Repair once, using `0353`'s settled condition** for the scanned set and exemptions — the same
   condition `0354` implements. ⛔ Do not re-derive it.
4. **Classify each repair before making it**, per the rule
   [`0355`](../../cancelled/0355-clean-the-in-scope-broken-link-red-set/brief.md) inherits from the `0306`
   precedent: a coordinate that is a **live pointer** is re-anchored; a coordinate that is a **frozen
   record of a past measurement** is left byte-identical and annotated. ⛔ Getting this backwards
   destroys the record.
5. **Re-anchor, never re-cite.** Repairs use durable anchors — quoted text, a symbol name, a heading —
   ⛔ never a new `path:NNN`
   ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
   A sweep that replaces rotted line numbers with fresh line numbers has scheduled its own successor.
6. **Hand the producer the close list** — one line per absorbed row: ID, outcome (`Done` or
   `Cancelled`), and the reason. ⛔ **Do not run the movers. Do not move a folder.**

⛔ **Constraints:**

- **⛔ Do not run `/fkit-task-done` or `/fkit-task-cancelled`, and do not move any task folder** (ADR-033).
- **⛔ Edit nothing under `ai-agents/tasks/done/` or `cancelled/`** (ADR-034) — beyond what `0353`'s
  settled exemption explicitly permits, and only where a member brief's own owner ruling already
  authorized it (`0176`'s ruling exempts `done/*/review.md` **by name and only that**).
- **⛔ Edit nothing under `ai-agents/wiki-vault/`** (ADR-005). Report anything found there and route it
  to `fkit-wiki` via [Sweep C](../../backlog/0358-sweep-c-the-wiki-vault-resyncs-as-one-pass/brief.md).
- **⛔ Do not absorb a row from Sweep B or Sweep C.** Three sweeps, disjoint membership.
- **⛔ Do not weaken or re-open `0353`'s condition** to make the pass easier.
- **⛔ No `path:NNN` citations in this task's own artifacts.**

## Verification steps

1. **The gate, proved first:** paste the passing runs of `test/reference-integrity.test.js` **and**
   `test/coordination-citation-policy.test.js` **taken before the first edit**. ⛔ A close report
   without both green runs, dated before the diff, has failed verification.
2. The frozen membership list exists in the worklog as a discrete step **before** any edit, with an
   in/out verdict and reason per candidate, and an explicit ruling on `0320`.
3. Every member's claims were **re-verified firsthand** and the finding recorded — reproduced or not —
   per member. Name the ones that did not reproduce.
4. The live-pointer / frozen-record classification is published **before** the edits, with a count
   per class, and every frozen-record coordinate is **byte-identical to `HEAD`** (prove per file with
   `git diff`).
5. `grep -nE '[A-Za-z0-9_./-]+:[0-9]+' ` over the diff shows **no new `path:NNN` coordinate
   introduced** by this sweep.
6. Both guards are **still green after** the sweep. Show the runs.
7. `git diff --stat` shows **zero** files modified under `ai-agents/wiki-vault/`, and zero under
   `ai-agents/tasks/done/` / `cancelled/` other than those `0353`'s exemption and a member's own owner
   ruling expressly permit — name each one and its authority.
8. **`git status` shows no task folder moved** and no board row flipped to `✅ Done` or `⛔ Cancelled`
   by this task. The close list is a **hand-off**, and the report says so.
9. Run the dashboard over all live boards; report roll-ups and drift before and after. **No board
   gains a drift record.**
10. `npm test` passes, including `test/prove-red.sh`. Report the counts.

## Notes

- **Depends on:** `0353`, `0354`, `0176`, `0237` — ⛔ **all hard.** `0353` supplies the condition;
  `0354` and `0176` are the two guards that must be **green**, and `0176` cannot be green until `0237`
  lands.
- **Blocks:** nothing.
- ⛔ **This task closes nothing itself.** Every close is the producer's act, via the movers, carrying
  `(agent-closed — not owner-verified)` (ADR-033 §5). The marker is permanent.
- ⚠️ **The absorbed rows carry FOUR different `## Owner` values** — `fkit-coder`, `fkit-producer`,
  `fkit-architect`. This sweep's owner is `fkit-coder` by the owner's approved board. **Where a member
  needs a judgement only the architect can make** (an ADR's meaning, not its coordinates), ⛔ **surface
  it rather than deciding it** — consult, or return it as an open question.
- ⚠️ **`0286` and `0309` are themselves sweeps of a citation class**, and `0309`'s title records that
  *"three consecutive sweeps could not see"* its form. **Absorbing a sweep into a sweep is the shape
  that has already failed here three times.** Step 1 must decide deliberately whether each belongs in
  the pass or stays a row of its own.
- **Priority `P8` is a rank on Sprint 7's board, assigned in the same act that ranked the board on the
  owner's ruling of 2026-08-29** — see [`sprint-7.md`](../../../sprints/sprint-7.md) §"⭐ THIS BOARD IS
  RANKED". Rank is board position, never identity
  ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
- **Source:** Sprint 7 scope, owner rulings *"Approve all 12 as proposed (Rec)"* and *"Accept the 25
  marked closes (Rec)"*, both 2026-08-29, `AskUserQuestion`, live `fkit lead` session.
</content>
