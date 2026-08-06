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
