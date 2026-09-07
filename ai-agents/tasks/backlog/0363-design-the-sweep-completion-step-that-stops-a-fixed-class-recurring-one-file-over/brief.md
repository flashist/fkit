# Design the sweep-completion step that stops a fixed class recurring one file over — the recurring-class signal from `0356`

## ID
0363

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Owner ruling H19**, given live via `AskUserQuestion` on **2026-09-04** in an `fkit lead` session
driving `/fkit-sprint-ship-loop` and relayed to a spawned producer. **The ruling is a selection from
an option list, so the option label is the verbatim text: "File it as a follow-up for the architect
(Rec)".**

### The signal — three round-1 classes each recurred in round 2

Authority: [`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md)'s
[`review.md`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/review.md) §"⚠️⚠️
OSCILLATION CALL — stated loudly, and it is NOT a reason to stop".

| Round 1 | Round 2 | The class |
|---|---|---|
| **R3** — a meta-note describing a state the sweep then changed | **R9** | Stale self-description |
| **R5** — a durable anchor that does not resolve as prescribed | **R13** | Anchor checkability |
| **R6** — prose damage in the sweep's own substitution | **R15** | Self-inflicted prose defect |

⭐ **All three round-1 rows read `✅ done`.** Each round-2 row is *"a **different site in a different
file**, found in edits that **did not exist** when round 1 ran"*. Round 2's surface was 16 files
(`0308`'s twelve `claude/` files plus `0193`'s four), so it is **not** a re-review of round 1's
surface — the class genuinely reappeared rather than being missed.

⛔ **The diagnosis, verbatim:** *"**What recurred is the CLASS, because round 1 fixed each instance
per-site and nothing generalised the lesson**"*.

### ⛔ What is NOT settled, and must not be treated as settled

⛔ **The reviewer explicitly did NOT design a remedy** — *"I did NOT design a remedy."* Its suggested
shape, a sweep-completion step reading *"re-read every note that describes a state you changed"*, is
carried as **evidence in this follow-up, not as a decision**. ⛔ **Do not implement that sentence as
though it were the ruling.**

⛔ **This is routed to the architect and not to a coder deliberately** — a convention or procedure
change with repo-wide reach is the architect's to design.

⚠️ **Closing `0356`'s ledger recorded that its *findings* were dispositioned — ⛔ NOT that the
recurring class is solved.** The class-level risk is open, and this row is where it lives.

## What to build

1. **Characterise the class before proposing anything.** Read the three round-1 / round-2 pairs in
   `0356`'s `review.md` and state, in your own words, what the three share. ⛔ **A proposal that does
   not first name the mechanism has skipped the work.**
2. **Decide whether a sweep-completion step is the right remedy at all** — and say so if it is not.
   The reviewer's phrasing is one candidate; ⛔ **it is evidence, not the answer.** Consider at least:
   a completion step in the ship-loop, a convention page, a reviewer-side check, a mechanical guard,
   and **doing nothing with the reason recorded**.
3. **If a procedure or convention change is the answer, specify it** — which file, what wording, which
   role owns running it, and what it costs on a sweep that touches many files.
4. **Say explicitly whether it generalises beyond citation sweeps.** The three instances are all from
   one sweep; a rule scoped too wide is its own defect.
5. **Record the decision as an ADR** if it changes how any role works.

⛔ **Out of scope:** implementing any guard or test; editing `0356`'s folder; re-opening any closed
finding; editing `ai-agents/wiki-vault/` ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. The three round-1 / round-2 pairs are **re-read firsthand** and the shared mechanism is stated in
   the deliverable's own words.
2. The deliverable states **whether a sweep-completion step is the remedy**, with the rejected
   alternatives named — ⛔ a document that only restates the reviewer's sentence fails this step.
3. If a rule is proposed, it names **the file, the wording, the owning role, and the cost**.
4. It says explicitly **whether the rule generalises beyond citation sweeps**.
5. **`npm test` stays green** — this writes no source.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing hard.
this belongs above the individual repair rows it would govern, because a rule that stops the class recurring is worth more than one more per-site fix — but it is a design task with no deadline, so it does not displace running work.- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **On merit - ⚠️ **`0356`'s residual R13 is downstream of this row.** Its recorded re-raise condition is
  *"**or** the architect's H19 follow-up rules on anchor-quoting generally"* — so if this lands,
  **R13 reopens.** Sequence this **before** any anchor-hygiene repair row.
** Flagged so the owner can say otherwise.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** (*"No, refuse — file follow-up if wanted (Rec)"*, 2026-09-02) keeps
  them legal.

---

## ⭐ AMENDED 2026-09-05 — THIS ROW ALSO COVERS THE DRIVER-RELAY CHANNEL

**Owner ruling, 2026-09-05, given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop`. The ruling is a selection from an option list, so the option label is the
verbatim text: "Widen 0363 to cover it (Rec)".** Relayed to a spawned `fkit-producer` with no owner
channel ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).

⛔ **This is an APPEND. Nothing above it is restructured, re-scoped, renumbered or re-ranked.** The row
stays **unranked** (`## Priority` `Unscheduled`, Backlog board), its `## Owner` stays
`fkit-architect`, and the core scope above — the `0356` sweep-completion signal — is untouched.
⚠️ **The H1 title still names only the `0356` signal and is left byte-identical**; read this section as
the second half of the scope, exactly as `0358`'s row title still says "five".
⛔ **The owner refused a separate row for this by name.** It belongs here.

### Same defect class, seen from the driver's side

This row's core class is **a loose claim propagating into a decision record**. The amendment adds a
**second channel by which that happens: the DRIVER'S RELAY.** ⛔ **Not a new class** — the same one
from the other end. Where the core signal is *a sweep fixing per-site and generalising nothing*, this
is *a conductor summarising a worker's output, and the summary hardening into fact downstream*.

### The evidence — two false claims, one task, both reached durable records

Both originated in task
[`0361`](../../done/0361-settle-whether-a-sprint-board-may-be-committed-unranked/brief.md) and both landed in
**ADR-046**.

| # | The claim as relayed | Where it went | What is actually true | What caught it |
|---|---|---|---|---|
| 1 | *"`dashboard.sh` never reads the Priority column at all"* | Originated in `0361`'s `plan.md`; **relayed by the driver into the owner's stated reason at the plan gate**; reached **ADR-046** | ⛔ **False.** `dashboard.sh`'s `extract_rows` emits `priority=$3`, and `task_id "$pr"` is **arm 2** of the FACTS-id ladder — folder ID prefix → **Priority number** → sanitised folder name → `?` | The **phase-1 architect re-measuring a claim it had been handed as settled** |
| 2 | *"`'P1 (a) (b)'` IS asserted"* | The driver relayed **a list of must-throw items to the architect as fully asserted**; it was not | ⛔ **False as relayed** — the list was not fully asserted | `0361`'s **round-1 review**, confirmed by **Codex** via a `?`→`*` quantifier mutant that passed **39/39** |

⭐ **Both originated in the DRIVER'S SUMMARISING, not in worker error.** Neither worker was wrong; the
compression between them was.
⭐ **Both were caught only by a worker RE-MEASURING rather than inheriting.** ⛔ **No test reaches
either claim** — they live in prose, a plan, a stated reason and an ADR.
⚠️ **ADR-046 now carries THREE dated correction passes, two of them from this channel** — counted
firsthand 2026-09-05, read-only.

⚠️ **Provenance of the two rows, stated because this row is about exactly that failure.**

- **Row 1 was re-measured firsthand 2026-09-05** by the spawned `fkit-producer` writing this
  amendment, against `claude/skills/fkit-status/dashboard.sh`: the `priority=$3` emit in
  `extract_rows` and the two-line ladder (`tid=$(folder_id_prefix "$folder")` then
  `[ -n "$tid" ] || tid=$(task_id "$pr")`) were **read, not inherited**.
- ⛔ **Row 2 was NOT re-measured.** A coder was live on `0361`'s test file and its ledger on
  2026-09-05, so a measurement taken then would have been of a moving file. It is carried on the
  authority of `0361`'s round-1 review and the Codex mutant run **as relayed** — ⛔ and this brief
  says so rather than presenting it as verified
  ([`evidence-before-assertion`](../../../knowledge-base/conventions/evidence-before-assertion.md)).
  **Re-measure it before quoting it.**

### What this adds to "What to build" — ⛔ the ANSWER is the architect's, not this brief's

⛔ **This section frames a question. It does not design a remedy, name a mechanism, or prefer one** —
the same discipline the core applies to the reviewer's suggested sentence.

6. **Characterise the relay channel before proposing anything.** Read the two rows above at their
   sources and state, in your own words, what a driver's summary does to a claim's evidential status.
   ⛔ A proposal that does not first name the mechanism has skipped the work.
7. **Answer the open question, both halves: what may a DRIVER assert to a WORKER as settled, and how
   should a WORKER treat a HANDED claim?** ⛔ A rule on only one side leaves the channel open.
8. **Say whether the two channels take ONE remedy or TWO.** ⛔ Do not assume one rule covers both
   because they share a class — the core's step 4 applies here: a rule scoped too wide is its own
   defect.

### What this adds to "Verification steps"

6. The two relayed claims are **re-read at their sources firsthand** (⚠️ row 2 only once `0361`'s
   records are settled), and the mechanism they share with the core signal is stated in the
   deliverable's own words.
7. The deliverable **answers both halves** of the driver/worker question, or says explicitly why one
   side needs no rule.
8. It states **whether the relay channel and the sweep channel take one remedy or two**, with the
   reason.

### Notes on this amendment

- **Depends on:** nothing new. ⚠️ **Reading `0361`'s records is a timing constraint, not a
  dependency** — a coder was live on them 2026-09-05.
- ⛔ **Out of scope — the core's list, unchanged and extended:** implementing any guard or test;
  editing `0356`'s or `0361`'s folders; editing **ADR-046**; re-opening any closed finding; editing
  `ai-agents/wiki-vault/`
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⚠️ **Rank unchanged — still `Unscheduled`, still on the unranked Backlog board.** The widening adds
  scope, not priority, and ⛔ **nothing was renumbered**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⚠️ **Citation form, as above:** file + heading + quoted fragment, never `path:NNN`.
