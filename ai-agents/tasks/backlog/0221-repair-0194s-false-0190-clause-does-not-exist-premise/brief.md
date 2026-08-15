# Repair 0194's false "0190's clause does not exist" premise

## ID
0221

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

**Task `0194` is open and one of the three prerequisites it declares blocked is no longer blocked.**

`0194` ("Assess ADR-037's two clause sites against the ADR-036 registry") lists three prerequisites
under *"Why it cannot be done now — three prerequisites, all open"*. Its brief at
`ai-agents/tasks/backlog/0194-assess-adr-037s-two-clause-sites-against-the-adr-036-registry/brief.md:31`
reads:

> 2. **`0190`'s clause does not exist** — no wording to assess.

**That is false.** `0190` shipped its worker-side precedence clause on **2026-08-04**. Verified on disk
2026-08-05 at `claude/scaffold/universal-rules.md`, final bullet of `## Universal hard rules`:

> - **A skill rule beats a contrary spawn instruction** unless that instruction names an owner ruling
>   on that point. With no such ruling: take the cheapest-to-reverse branch (usually the rule's),
>   escalate if it changes the outcome, never silently comply or refuse.

`0190`'s task folder is in `ai-agents/tasks/done/`.

**⚠️ Exactly ONE of the three premises is false — do not "repair" the other two.** Re-verified on disk
2026-08-05:

| `0194`'s premise | State on 2026-08-05 |
|---|---|
| 1. `test/skill-ownership-sites.mjs` does not exist (`0189`) | **Still true** — absent from disk; `0189` open in `backlog/` |
| 2. `0190`'s clause does not exist | **NOW FALSE** — clause shipped 2026-08-04; `0190` in `done/` |
| 3. `0191`'s clause does not exist | **Still true** — no such wording in `claude/skills/fkit-sprint-ship-loop/SKILL.md`; `0191` open in `backlog/` |

> ## ⚠️ DATED CORRECTION 2026-08-14 — THE COUNT IS NOW WRONG: **TWO** premises are false, not one. Every prior byte left identical.
>
> ⚠️ **FRAMING ONLY.** ⛔ **This task's scope, intent and deliverable are unchanged by this note** —
> the widening question it raises is put to the owner below, ⛔ **not decided here.** No scope change,
> no status change, no re-rank, no file move. Written by a spawned `fkit-producer` with no owner
> channel.
>
> **Re-measured on disk 2026-08-14** — ⛔ **and this table is itself a dated reading; step 1 already
> requires re-deriving all three, which is now doubly the point:**
>
> | `0194`'s premise | State on **2026-08-05** (above) | State on **2026-08-14** |
> |---|---|---|
> | 1. `test/skill-ownership-sites.mjs` does not exist (`0189`) | Still true | ✅ **STILL TRUE** — `ls` returns *No such file or directory*; `0189` still open in `ai-agents/tasks/backlog/` |
> | 2. `0190`'s clause does not exist | NOW FALSE | ⛔ **STILL FALSE** — clause present at `claude/scaffold/universal-rules.md`; `0190` in `done/` |
> | 3. `0191`'s clause does not exist | Still true | ⛔⛔ **NOW ALSO FALSE** — the driver-side clause **is** in `claude/skills/fkit-sprint-ship-loop/SKILL.md`, citing **ADR-037 §3** by name and recording that it is *"weaker than its worker-side twin"*; `0191` is in `ai-agents/tasks/done/` |
>
> ⛔⛔ **So the bolded instruction above — *"Exactly ONE of the three premises is false — do not
> 'repair' the other two"* — now names the WRONG COUNT and would tell a run to leave a false premise
> standing.** ✅ **Its underlying rule is UNCHANGED and still binding: repair only what is measured
> false, and premise 1 is genuinely still true.**
>
> ⭐ **`0194` remains genuinely blocked, on `0189` alone.** ⛔ **Do not read *"two of three are now
> false"* as *"`0194` is ready"*** — it is not, and nothing here changes its `## Status`.
>
> ⚠️ **This is the very decay this row exists to fix, recurring on this row.** `0221`'s own `## Notes`
> already predicted it: *"Note for whoever closes `0191` and `0189` — each will falsify one more of
> `0194`'s premises."* **`0191` closed and the premise was not repaired.** ⭐ The prediction was right
> and the mechanism behind it does not exist, which is the argument for `0171`'s durable-citation work
> and for `0306`'s sweep — ⛔ **neither of which this row waits on.**
>
> ### ⛔ ONE QUESTION THIS NOTE DOES NOT SETTLE — it goes to the owner
>
> `## What to build` step 2 reads **"Correct premise 2 only"**. With premise 3 now false as well, that
> instruction **under-covers**: a run following it literally repairs one false premise and leaves the
> other. ⛔ **A spawned producer with no owner channel does not widen a filed task's deliverable**, so
> the instruction is **left exactly as written** and the choice is surfaced instead:
>
> - **(a)** widen this task to repair premises 2 **and** 3 in one pass — cheaper, one edit to `0194`,
>   and the count in step 3 and step 4 comes out right either way; **or**
> - **(b)** hold this task to premise 2 and let `0191`'s own follow-up carry premise 3.
>
> ⭐ **The producer's input, offered and NOT a ruling: (a).** The two repairs touch the same three
> sentences of the same file, the deliverable class is identical, and splitting them guarantees a
> second pass over a brief that will have decayed again. ⚠️ **The title and `## ID` would then name
> only `0190`; that is cosmetic and no reason to choose (b).** ⛔ **Until the owner rules, a run takes
> the narrower branch (b) and REPORTS premise 3 as an unrepaired measured falsehood** — never silently
> widens, never silently leaves it unmentioned.
>
> ⚠️ **Steps 3, 4 and verification 5 are count-driven and self-correct under either branch** —
> *"how many remain open and which"* is derived from step 1's re-measurement, so they do not need
> amending. **Under either branch the answer today is: ONE open prerequisite, `0189`.**
>
> ⛔ **Nothing else about this row changed.** `## Status` `🔲 Backlog`, `## Priority` `Unscheduled`,
> `## Sprint` `Backlog`, `## Owner` `fkit-producer` — all untouched. ⛔ **`0194`'s brief was NOT edited
> by this note** — that is this task's own deliverable, not a correction's. No board row edited,
> nothing re-ranked (ADR-035), no mover run (ADR-033), nothing written under `ai-agents/wiki-vault/`
> (ADR-005), nothing committed.

**Why it matters.** `0194` is a **`🔲 Backlog`** row that will be planned and pulled off its own stated
premises. Two of them still hold, so `0194` is genuinely not yet pullable — but a reader who checks
premise 2 and finds it false has no reason to trust premises 1 and 3, and a reader who does not check
carries a false statement forward. The whole point of `0194` existing as a separate row is that it
survives every ordering of its three prerequisites; a premise list that does not track their real state
defeats that design.

**Conflicts with no locked decision.** This aligns a brief with what shipped; it changes nothing about
ADR-036, ADR-037, or `0194`'s scope.

## What to build

A **documentation repair to one file** —
`ai-agents/tasks/backlog/0194-assess-adr-037s-two-clause-sites-against-the-adr-036-registry/brief.md`.
No source change, no scope change, no status change.

1. **Re-verify all three premises on disk before editing.** Do not copy the table above. ⚠️ Briefs in
   this tree decay and several were edited during this sprint run — including, possibly, `0194` itself
   since this brief was filed. Check:
   - `test/skill-ownership-sites.mjs` present or absent, and `0189`'s folder location;
   - the clause text in `claude/scaffold/universal-rules.md`, and `0190`'s folder location;
   - the driver-side clause in `claude/skills/fkit-sprint-ship-loop/SKILL.md`, and `0191`'s folder
     location.
   ⚠️ **`brief.md:31` is a mutable coordinate.** Locate the premise by its wording, not by its line
   number; if the line has moved, that is expected and the wording is authoritative.
2. **Correct premise 2 only**, in place. Replace *"does not exist — no wording to assess"* with the
   shipped state: the clause exists, its file, the date it shipped, and — because `0194`'s job is to
   assess the wording — **quote the clause verbatim** so the assessment has its subject in hand.
3. **Correct the heading that counts them.** *"three prerequisites, all open"* is now wrong on the
   count. Say how many remain open and which. Do **not** renumber the list — the numbering is
   referenced by `0194`'s own prose.
4. **Update `## Notes` where it repeats the claim.** `0194`'s notes read *"⚠️ All three dependencies
   are open at filing"*. Correct the count and name which remain open. **`- **Depends on:** 0189,
   0190, 0191` stays exactly as written** — a satisfied dependency is still a dependency, and the
   canonical `## Notes` dependency form is what `dashboard.sh` parses.
5. **Date-stamp the correction** so the next reader can tell a verified state from an inherited one,
   and say plainly that these premises are **snapshots that must be re-checked at pull time** — the
   defect being repaired is a premise treated as permanent.
6. **Change nothing else in `0194`.** Not its `## Status` (it stays `🔲 Backlog`), not its `## Owner`,
   not its `## Priority`, not its scope, not its trigger-scoring instructions, not its append-rank flag,
   and not its *"Why it is a row and not a verification step"* rationale.

> ## ⭐ DATED CORRECTION 2026-08-14 (second) — OWNER RULING: **step 2 widens to premise 3.** Every prior byte left identical.
>
> **The owner ruled, live via `AskUserQuestion` in an `fkit lead` session — verbatim option label:
> *"Widen to premise 3 (Recommended)"*.** That is **branch (a)** of the fork the first dated correction
> (above, in `## Context`) put to the owner and deliberately did not settle. ⛔ **Step 2 above is left
> byte-identical on purpose** — this note is the amendment, per the superseded-text convention.
>
> ### What changes
>
> **Step 2's *"Correct premise 2 only"* now reads, in effect, "correct premises 2 and 3".** A run
> repairs **both** measured-false premises in one pass, in the same edit to the same file. ⛔ The first
> correction's interim instruction — *"Until the owner rules, a run takes the narrower branch (b) and
> REPORTS premise 3 as an unrepaired measured falsehood"* — is **spent and no longer applies.** The
> owner has ruled; take branch (a).
>
> ### ⭐ Premise 3 re-verified on disk 2026-08-14 before this note was written
>
> ⚠️ **Verified independently, not inherited** — the triage that first reported it also produced a
> confirmed false negative elsewhere, so nothing from it was taken on trust. Measured with
> wrap-tolerant matching (a single-line `grep` cannot see a phrase broken across a line break):
>
> | premise | measured state 2026-08-14 |
> |---|---|
> | 1. `test/skill-ownership-sites.mjs` does not exist (`0189`) | ✅ **STILL TRUE** — `ls` returns *No such file or directory*; `0189` is in `ai-agents/tasks/backlog/0189-build-the-skill-ownership-site-registry-and-completeness-tripwire/` |
> | 2. `0190`'s clause does not exist | ⛔ **FALSE** — the clause is present in `claude/scaffold/universal-rules.md`; `0190` is in `ai-agents/tasks/done/` |
> | 3. `0191`'s clause does not exist | ⛔ **FALSE** — the driver-side clause **is** in `claude/skills/fkit-sprint-ship-loop/SKILL.md`, under `## Hard rules`, citing **ADR-037 §3** by name **twice**; `0191` is in `ai-agents/tasks/done/0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules/` |
>
> **The clause `0194` must assess, quoted so the assessment has its subject in hand.** ⚠️ **Locate it by
> this wording, never by line number** — it sat at `claude/skills/fkit-sprint-ship-loop/SKILL.md:390-401`
> on 2026-08-14 and that coordinate is mutable:
>
> > - **Never instruct into the territory of a rule in the skill a worker will run without naming the owner
> >   ruling you relay** (ADR-037 §3 — the driver-side half of the owner's Q2 ruling; this ADR binds the
> >   driver, not only the worker). Exactly one of three is permitted:
> >   - **Name the ruling** — what the owner ruled, when, on what point — and the instruction binds.
> >   - **Get the ruling first.** You hold the owner channel the worker lacks (ADR-021); if the point
> >     matters, ask before spawning.
> >   - **Do not issue it.** Let the skill rule stand.
> >
> >   **A bare directive into a rule's territory is a defective instruction, and the worker's conservative
> >   branch is the correct response to it, not an obstruction** — do not read a worker's escalation here as
> >   a failure to follow orders. **This clause is weaker than its worker-side twin** and ADR-037 §3 records
> >   that deliberately: the worker-side clause reaches every spawn through the universal rules block, while
> >   this one binds you only because *you* load this file, and it reaches no worker.
>
> ### ⛔ What this ruling does NOT change
>
> - ⛔ **Step 1 still governs.** All three premises are re-derived **on disk at pickup**, not copied from
>   this table. This table is a dated reading and will decay like every other one.
> - ⛔ **Premise 1 is genuinely still true** — repair only what is measured false. Widening to premise 3
>   is **not** a licence to touch premise 1.
> - ⭐ **`0194` remains genuinely blocked, on `0189` alone.** *"Two of three are now false"* is **not**
>   *"`0194` is ready"*. `0194`'s `## Status` stays `🔲 Backlog`.
> - **Steps 3, 4 and verification 5 are count-driven and self-correct** — they derive from step 1's
>   re-measurement. **Under this ruling the answer today is: ONE open prerequisite, `0189`.**
> - **Verification step 3 still holds and is now sharper:** `grep -n "clause does not exist"` on the
>   repaired `0194` brief must return **only premise 1's hit**, not two.
> - ⚠️ **The title and `## ID` still name only `0190`.** Cosmetic, and the first correction already ruled
>   it no reason to choose otherwise. **Left unchanged.**
> - ⛔ **Unchanged:** `## Status` `🔲 Backlog`, `## Priority` `Unscheduled`, `## Sprint` `Backlog`,
>   `## Owner` `fkit-producer`. **`0194`'s brief was NOT edited by this note** — that is this task's own
>   deliverable. No board row edited, nothing re-ranked (ADR-035), no mover run (ADR-033), nothing
>   written under `ai-agents/wiki-vault/` (ADR-005), no commit.
>
> **Written by a spawned `fkit-producer` with no owner channel** (ADR-021), relaying a ruling the live
> `fkit lead` session obtained from the owner.

## Verification steps

1. **All three premises were re-checked on disk this run** — the worklog quotes the command output for
   each: the existence check on `test/skill-ownership-sites.mjs`, the clause grep in
   `claude/scaffold/universal-rules.md`, the clause grep in
   `claude/skills/fkit-sprint-ship-loop/SKILL.md`, and each task folder's location.
2. **`git diff` touches exactly one file:**
   `ai-agents/tasks/backlog/0194-assess-adr-037s-two-clause-sites-against-the-adr-036-registry/brief.md`.
   Nothing under `claude/`, nothing under `test/`, no board file, and **not `0190`'s or `0191`'s brief**.
3. **The false sentence is gone** — `/usr/bin/grep -n "clause does not exist" <the brief>` returns only
   the premises that are genuinely still true, and each remaining hit is accounted for by step 1's
   evidence.
4. **The clause is quoted verbatim** in the repaired premise, and the quote matches
   `claude/scaffold/universal-rules.md` byte for byte.
5. **The prerequisite count is consistent everywhere** — the section heading, the list, and the
   `## Notes` warning all state the same number of open prerequisites.
6. **The `- **Depends on:** 0189, 0190, 0191` line is byte-identical** before and after. Confirm the
   canonical flush-`**` form is intact — a decorated variant makes `dashboard.sh` read the task as
   having no dependencies and show it as pullable.
7. **`0194`'s status, owner, priority and scope are unchanged**, and its append-rank flag for owner
   confirmation is still present and unedited.
8. **No test run is required and none is claimed.** This task changes no code. Do not report a suite
   result you did not run.

## Notes

- **Owner:** fkit-producer — a task brief is the producer's artifact, and this is a premise-accuracy
  repair, not implementation.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Priority: medium.** `0194` is still genuinely not pullable — premises 1 and 3 hold — so nothing is
  acting on the false line today. It gets repaired before `0189` or `0191` lands and makes `0194`
  pullable against a premise list nobody re-read.
- **Prompted by:** task `0190` shipping ADR-037's worker-side clause on 2026-08-04 and not sweeping the
  open briefs that had recorded its absence as a premise. The same class of decay `0218` repairs in
  `0177`.
- **⚠️ Note for whoever closes `0191` and `0189`:** each will falsify one more of `0194`'s premises.
  Repairing the premise is part of closing the prerequisite, not a follow-up to file later.
- **Filed by a spawned producer with no owner channel**, on the owner's ruling of 2026-08-04 (relayed
  through the live `fkit lead` session) to file this follow-up. Filed on the **Backlog board** — it was
  not scoped into Sprint 2, and a spawned producer never ranks (ADR-035).
- No commit — leave the change in the working tree.
