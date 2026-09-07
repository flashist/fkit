# Reconcile `fkit-task-brief`'s mandatory `— priority M` rule with `backlog.md`'s unranked-destination carve-out — a shipped skill and a board rule that disagree

## ID
0377

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

**Owner ruling P4**, given live via `AskUserQuestion` on **2026-09-04** during
[`0361`](../../done/0361-settle-whether-a-sprint-board-may-be-committed-unranked/brief.md)'s run —
**the option label is the verbatim text: "File separately onto the Backlog board (Rec)"**. P4 held
this fourth site **out of `0361`'s scope** and routed it here.

⚠️ **The ruling was given 2026-09-04 and this row was filed 2026-09-05 — it was overdue.** Recorded so
the gap is visible, not smoothed. Filed by a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
executing the mechanics of the ruling and deciding nothing beyond them.

⚠️ **Filed UNRANKED onto the Backlog board — this row APPENDS and renumbers nothing**
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

### ⛔ The divergence — two live rules, one shipped, that give opposite instructions

Derived from `0361`'s approved
[`plan.md`](../../done/0361-settle-whether-a-sprint-board-may-be-committed-unranked/plan.md)
§3 **Finding 2** ("a FOURTH site, on a shipped surface, that the brief does not name").

**Site 1 — `claude/skills/fkit-task-brief/SKILL.md`**, under the heading *"Pulling a backlog task into
a sprint is the producer's act, not this skill's"*, step 2 of the three mandatory edits:

> *"Flip the backlog row to `➡️ Moved to [Sprint N](sprint-N.md) — priority M` … **`— priority M` is
> mandatory and is not dropped just because this board is unranked** — `M` is the priority the task
> receives in **Sprint N** (step 1), which is exactly what the reader of a moved row needs."*

**Site 2 — [`backlog.md`](../../../sprints/backlog.md)**, the **"Off:"** rule's block headed
**⚠️ "The unranked-forward case — the one thing that drops the suffix"**:

> *"When the destination sprint board is **unranked** (its Priority column is all `—`, no `P<n>`
> assigned to anything), write the marker as `➡️ Moved to [Sprint N](sprint-N.md)` with **no
> `— priority M` suffix**: that board is unranked, so there is no destination rank to name."*
>
> ⛔ *"**Never write `— priority —`, and never invent a number**"* — and *"**The omission is a
> deferral, not a permanent exemption: when the owner later ranks that board, add every moved row's
> `— priority M` suffix in the same act.**"*

⭐ **Where exactly they part, stated precisely — the two rules are talking about DIFFERENT boards.**
The skill's *"this board"* is the **backlog** board (the **source**). Its sentence is therefore
**correct as far as it goes**: the source board being unranked is not a reason to drop the suffix.
⛔ **But the skill has no clause at all for the case `backlog.md` writes out at length — the
DESTINATION sprint board being unranked.** In that case there is no `M` to name, and the skill's
"mandatory, full stop" phrasing instructs the producer to invent one, which is exactly the act
[ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
forbids.

⭐ **This is a gap, not a contradiction between two equally-considered rules** — and saying which it is
matters, because the two have different repairs. Nothing in the skill argues *against* the carve-out;
the skill simply never contemplates the case.

### ⛔ Pre-existing — NOT created by `0361`

`0361` shipped one file, `test/closed-rank-immutability.test.js`. It touched no skill. This
divergence predates it and was found while planning it. ⛔ **Do not record this row as fallout from
`0361`.**

### ⭐ The precedent is live, so this is not hypothetical

[`Sprint 6`](../../../sprints/done/sprint-6.md) opened unranked (2026-08-14) and its 18 backlog rows
carried the bare marker under the carve-out. **Sprint 7 opened unranked too.** The next board opened
unranked reproduces the divergence, which is precisely the reasoning
[ADR-046](../../../knowledge-base/decisions/adr-046-a-sprint-board-may-be-committed-unranked-and-an-erased-rank-flags.md)
records for treating an unranked board as the ordinary path.

### ⚠️⚠️ THE SURFACE IS `claude/` — STOP AND SURFACE, DO NOT EDIT CASUALLY

⛔ **`claude/skills/fkit-task-brief/SKILL.md` is a shipped surface.** Three consequences the
implementer must engage **before** writing a character:

1. ⛔ **Structure manifest.** A `claude/` file is covered by `claude/structure-manifest.tsv`. Verify
   firsthand whether this file's hash is manifested; if it is, the edit **forces
   `npm run generate:manifest`** and puts a regenerated shipped artifact in the diff. ⚠️ **Expected,
   not a surprise to avoid** — but it must be declared in the plan, not discovered at verification.
2. ⛔ **Dual-home parity.** Edit the **canonical** source under `claude/`, **never** the gitignored
   `.claude/` copy. If this skill has a `claude/scaffold/` twin, ADR-027's parity test binds them and
   **both homes move in the same change or the test reds** — check firsthand; ⛔ do not assume either
   way.
3. ⛔⛔ **STOP AND SURFACE, per the standing line for `claude/` edits.** `0361`'s plan flagged this
   explicitly (*"Editing it **engages the stop-and-surface line**"*), which is **why** P4 held it out
   of that run. ⚠️ **A run that silently edits the skill has skipped the gate that put this on its own
   row.**

### ⛔ FRAME, then get a ruling — the wording is not the implementer's to pick

⭐ **Two of the plausible repairs are materially different, and choosing between them is the owner's.**
State them; do not settle them:

- **(a) Add a destination-unranked carve-out to the skill**, mirroring `backlog.md`'s clause
  (including its deferral instruction — *"when the owner later ranks that board, add every moved
  row's suffix in the same act"*), so the skill becomes complete.
- **(b) Replace the skill's rule with a pointer to `backlog.md`** as the single source of truth for
  the marker's form, so the rule lives in one place and cannot drift again.

⚠️ **(a) creates a third copy of a rule that already exists in two places; (b) removes text a reader
of the skill currently relies on being self-contained.** ⛔ **Neither is obviously right, and this
brief does not pick one.**

⛔ **What is NOT in question, and must survive whichever is chosen:** `— priority M` stays mandatory
when the destination board **is** ranked; ⛔ **never `— priority —`**; ⛔ **never an invented number.**
A repair that weakens any of those has broken the rule instead of completing it.

## What to build

1. **Re-verify both sites firsthand and re-quote them.** ⛔ **Do not copy the quotations above** — they
   were captured 2026-09-05 and are a dated observation
   ([`0301`](../0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md)).
   **Count occurrences, not lines** (`grep -o`), and state the method: the skill carries **3**
   occurrences of the string `priority M` as measured 2026-09-05, of which only **one** is the
   mandatory-suffix sentence — the other two are the de-scoping rule's *"There is no `— priority M`
   suffix here"* and step 2's marker template. ⚠️ **A run that amends the wrong occurrence has made
   the de-scoping rule wrong instead.**
2. **Determine and declare the shipped-surface consequences** — manifest coverage, scaffold twin,
   ADR-027 parity — as measured facts, before proposing wording.
3. ⛔ **STOP and put (a) vs (b) to the owner** with the tradeoff above. **Do not write the amendment
   before the ruling lands.**
4. **Apply the ruled option**, in the canonical `claude/` home (plus any bound twin in the same
   change), and regenerate the manifest if and only if step 2 established it is required.

## Verification steps

1. `npm test` — **green**, with counts stated as measured, not inherited.
2. If the manifest was regenerated, show that the regeneration is the **only** artifact change beyond
   the skill edit itself.
3. If a scaffold twin exists, show the parity test passing and both homes byte-consistent.
4. Quote the amended skill text and `backlog.md`'s clause side by side, and state in one sentence
   **which board each now refers to** — the confusion this row exists to remove.
5. ⚠️ **`npm test` green proves nothing about the wording.** No test reads this skill's prose. Say so
   rather than presenting a green suite as evidence the divergence is closed.

## Notes

- **Depends on nothing.** `0361` has landed; ADR-046 is accepted.
- ⛔ **Out of scope:** `backlog.md`'s clause (leave byte-identical), ADR-035, ADR-046, and
  `test/closed-rank-immutability.test.js`. This row touches the **skill**, and whatever the manifest
  or a parity twin forces alongside it.
- ⛔ **No wiki write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **Movers are producer-only** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md));
  route the close to the producer.
- **Owner: `fkit-coder`** — the deliverable is a skill-document edit plus possibly a regenerated
  manifest; it names no skill of its own
  ([ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)).
  ⚠️ Step 3's decision goes to the **owner**, not to the coder.
