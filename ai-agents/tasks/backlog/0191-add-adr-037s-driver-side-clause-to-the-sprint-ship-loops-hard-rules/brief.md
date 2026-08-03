# Add ADR-037's driver-side clause to the sprint-ship-loop's hard rules

## ID
0191

## Sprint
Sprint 2

## Priority
169

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Follow-up 2 of [ADR-037](../../../knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)**
(accepted 2026-08-02), §3 and §4. **On the owner's Q2 ruling of 2026-08-02, ADR-037 binds the driver as
well as the worker** — the two clauses are the two halves of one ruling, and the worker-side half alone
leaves the driver still free to issue the instruction that starts the collision.

ADR-037 §3, the clause to carry:

> `fkit-sprint-ship-loop` (and any agent spawning a typed fkit worker) **must not issue an instruction
> into the territory of a rule in the skill the worker will run without naming the owner ruling it
> relays.** Concretely, one of three:
> - **Name the ruling** — what the owner ruled, when, on what point — and the instruction binds.
> - **Get the ruling first.** The driver holds the owner channel the worker lacks (ADR-021); if the point
>   matters, ask before spawning.
> - **Do not issue it.** Let the skill rule stand.
>
> **A driver that issues a bare directive into a rule's territory has issued a defective instruction, and
> the worker's conservative branch under clause 2 is the correct response to it, not an obstruction.**

§4 rules the site: **`claude/skills/fkit-sprint-ship-loop/SKILL.md`, under its `## Hard rules`** — the
section exists in the file today, verified at filing.

**No budget constraint applies here.** The rules-block byte ceiling that shapes `0190` does not reach a
`SKILL.md`; this clause is priced only by the reader's attention.

### The asymmetry this task must not oversell

ADR-037 §4 records it deliberately, and the shipped wording should not paper over it:

> The worker-side clause reaches every spawn through the rules block, which is injected into every
> context. The driver-side clause lives in `claude/skills/fkit-sprint-ship-loop/SKILL.md` — a `SKILL.md`
> the worker does not load, but **which the driver itself does load**. That is precisely why the
> asymmetry is acceptable here and nowhere else: the driver-side clause is the one case where a
> `SKILL.md` rule genuinely reaches its reader. It is still a weaker surface than the worker-side clause,
> and it should not be described as equally strong.

### The live instance the clause governs

The 2026-07-27 merit-rank (ADR-037 **instance A**, adjudicated **FORBIDDEN as executed**) came from a
driver instruction — *"rank on merit rather than append"* — that relayed **no named owner ruling on
placement**. The instruction was not in any `SKILL.md`; it was ad-hoc spawn-prompt text from a live lead
session, which is exactly what made it invisible to review. This clause is the thing that would have
stopped it at the driver rather than at the worker.

## What to build

**One addition to `claude/skills/fkit-sprint-ship-loop/SKILL.md`'s `## Hard rules`, and nothing else.**

- State the prohibition: no instruction into the territory of a rule in the skill the worker will run,
  without naming the owner ruling it relays.
- State **all three permitted forms by name** — name the ruling, get the ruling first, or do not issue
  it. A clause that gives only the first reads as a licence to relay.
- State that a bare directive into a rule's territory is a **defective instruction**, and that the
  worker's conservative branch is the correct response to it rather than an obstruction. Without this,
  a driver reads a worker's escalation as a failure to follow orders.
- **Do not claim parity with the worker-side clause.** Say, or leave visible, that this surface is
  weaker — it binds the driver because the driver loads it, and it reaches no worker.
- Cite ADR-037 **by name, not by line number** (the coordination-citation policy; see `0176`).

⛔ **Out of scope:** the worker-side clause (`0190`); any other `## Hard rules` entry; any change to the
loop's numbered steps, stop conditions, or progress reporting; any test.

## Verification steps

1. **The clause is in `claude/skills/fkit-sprint-ship-loop/SKILL.md` under `## Hard rules`** — not in the
   overview, not in a step, not in a footnote.
2. **All three permitted forms appear**, each identifiable as a permitted form rather than as prose
   around one of them.
3. **The defective-instruction sentence is present** — a bare directive is defective, and the worker's
   conservative branch is the correct response.
4. **The clause names ADR-037** and contains **no `path:NNN` line citation**.
5. **Applied to instance A** (2026-07-27, *"rank on merit rather than append"*): read the shipped clause
   and state in the worklog which of the three forms the driver should have used. If the clause cannot
   decide that case, it is not usable.
6. **`npm test` stays green.** No test reads any `SKILL.md` today, so this is a regression check, not a
   proof the clause landed.
7. **The diff touches exactly one file.** No agent definition, no scaffold file, no source.

## Notes

- **Depends on:** nothing.
- **Blocks:** `0194`.
- **Pairs with `0190`** — the worker-side half. **Deliberately separate:** this half has no budget
  constraint and can ship the day it is picked up; `0190` cannot land until the owner makes a byte-budget
  call. Shipping this one does **not** discharge `0190`, and the ADR's recorded asymmetry is the reason —
  this clause binds the driver only.
- **⚠️ Priority 169 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly above `0143`**, at the top of the open board and **above `0190`**,
  because it is the half of ADR-037 that can ship with no owner decision, no budget fight and one file
  touched — and because the driver instruction is where both recorded instances actually began. Filed by
  a spawned producer with no owner channel; per the owner's ruling of 2026-07-27, appending was the only
  sanctioned option.
