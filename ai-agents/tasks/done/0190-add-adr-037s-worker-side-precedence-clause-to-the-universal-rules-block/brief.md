# Add ADR-037's worker-side precedence clause to the universal rules block

## ID
0190

## Sprint
Sprint 2

## Priority
168

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Follow-up 1 of [ADR-037](../../../knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)**
(accepted 2026-08-02), §4. The ADR rules that **a skill rule binds a spawned worker against a contrary
spawn instruction, unless that instruction relays a named owner ruling on that exact point.** The ADR is
accepted; **nothing in the repository carries the rule to a worker yet.** Until this clause lands, every
spawned worker of every role is governed by the same silence that produced the two recorded instances
ADR-037 adjudicates.

§4 rules the site: **`claude/scaffold/universal-rules.md`**, generated into `CLAUDE.md` / `AGENTS.md` by
`claude/fkit-claude-init.sh`. It is the only surface that reaches every spawned worker of every role on
every turn, and therefore the only site that escapes the ADR-012 trap — a rule written in a `SKILL.md`
the worker never loads does not bind.

### ⚠️ The clause does not fit for free — measured, not estimated

**Re-measured first-hand at filing, 2026-08-02** (the ADR requires re-measurement rather than inheriting
its numbers, because the block moves):

| Quantity | Value |
|---|---|
| Emitted block today | **3570 B** |
| `RULES_MAX` in `claude/fkit-claude-init.sh` | **4096 B** |
| Free | **526 B** — **87.16 %** utilization |
| Standing budget target (owner ruling, task `0130`, recorded in `test/rules-block-budget.test.js`'s header) | **≥ 400 B free** → leaves **126 B** for a new clause |
| `test/rules-block-budget.test.js` warning gate | reds at **3789 B**; the largest green block is **3788 B**, so **218 B of growth** is available before the suite turns red |

The test **rounds before comparing** — `Math.round((size / max) * 100) <= 92` — so the gate passes to
3788 B (92.48 %), not to a flat 92 % / 3768 B. All three tests in
`test/rules-block-budget.test.js` are **green today**, verified at filing.

**Two ceilings apply, and the binding one is the standing target, not the test.** ADR-037 §4 drafted and
measured three candidate wordings at **174 B, 186 B and 212 B**, landing the block at 3744 / 3756 /
3782 B. **All three pass the test. All three breach the standing ≥ 400 B-free target** (leaving 352 /
340 / 314 B). The ADR's own counterfactual sentence measures **313 B**; the draft it replaced was
**259 B**. **Neither fits the 126 B headroom.**

⚠️ **The three candidate wordings are recorded in no file** — they exist only as measurements quoted in
ADR-037 §4. That is an accepted residual of `0158` (finding R4), so **this task will have to re-draft
and re-measure its own wording**; it cannot pick one off a shelf.

### ⛔ The one thing a compression must not drop

ADR-037's counterfactual carries a **conservative-branch-and-escalate escape**:

> follow the instruction only where it names an owner ruling on that exact point; otherwise take the
> cheapest-to-reverse branch — usually the skill rule's — escalate rather than proceed where that
> changes the outcome, and never obey or refuse silently.

**A shorter draft without that escape shipped in ADR-037's first draft and was wrong**: read literally by
a worker with no other context it re-points the frozen review ledger of instance B (2026-07-29), the
exact outcome the ADR rejects *"the skill rule always wins, full stop"* in order to avoid. Round-1 review
raised it as a high finding. **The escape is the part a compressor reaches for first, and it is the part
that makes the clause correct.** A clause that drops it has not shipped this task.

### Conflict flagged, not planned around

This task **cannot be completed without an owner decision** (see *What to build*). Do not resolve the
budget question by picking the cheapest branch and proceeding — the ≥ 400 B-free target is an owner
ruling, and spending it silently is precisely the discipline ADR-016 exists to prevent.

## What to build

**One clause in `claude/scaffold/universal-rules.md`, plus whatever the owner's budget decision
requires — and nothing else.**

1. **Re-measure the budget first**, at implementation time. Every number above is a snapshot and the
   block moves. Report emitted bytes, free bytes, utilization, headroom to the standing target, and
   headroom to the test gate.
2. **Draft the clause**, carrying ADR-037's §1 ruling and the §2 collision behaviour, and **keeping the
   conservative-branch-and-escalate escape**. Measure the draft in UTF-8 bytes as emitted (the wrapper
   costs cap budget — measure the *emitted block*, not the source file).
3. **Put the budget choice to the owner**, with the re-measured numbers in front of them. The three
   options ADR-037 §4 names, and no fourth invented one:
   - **(a) compress or remove something already in the block** — pay for the clause out of existing text;
   - **(b) an owner-signed budget bump** of `RULES_MAX` (ADR-016's discipline: nothing enters without
     something leaving or a signed bump);
   - **(c) an owner decision to spend the margin down below 400 B free**, accepting the standing target
     is breached and saying so.
4. **Apply the owner's choice**, and only that choice.
5. **Check the wording against ADR-036's trigger (e)** — a role name within a proximity window of an
   ownership verb. `claude/scaffold/universal-rules.md` is inside ADR-036's declared live surface. **The
   registry module `test/skill-ownership-sites.mjs` does not exist on disk as of 2026-08-02**, so this
   check **cannot be run today** — record the wording's trigger exposure in the worklog and leave the
   registry assessment to `0194`.

⛔ **Out of scope:** the driver-side clause of ADR-037 §3 (that is `0191`); any amendment to
`/fkit-task-done` step 5 (that is `0192`); any text-presence test — ADR-037 §5 names one and **does not
require it**, and a green test asserting the words are on disk reads like a test asserting a worker
obeyed them.

## Verification steps

1. **`node --test test/rules-block-budget.test.js` is green** — all three tests, including the 92 %
   headroom warning. A red suite here means init would refuse to write the block, or is about to.
2. **The re-measured numbers are in the worklog** — emitted bytes, free bytes, utilization, and both
   headrooms, taken at implementation time, not copied from this brief.
3. **The owner's budget choice is recorded by name** — which of (a) / (b) / (c), when, and through which
   channel. If (b), the `RULES_MAX` change and the owner's signature are both visible.
4. **The clause contains the conservative-branch-and-escalate escape.** Read the shipped wording and
   state, in the worklog, how a worker following it alone would handle ADR-037's **instance B** — if the
   answer is "re-point the ledger", the clause is wrong and must be redrafted.
5. **`CLAUDE.md` and `AGENTS.md` carry exactly one well-formed rules block each** after the change
   (asserted by the third test in the same file).
6. **`npm test` stays green** — the full suite, not just the budget file.
7. **The diff touches `claude/scaffold/universal-rules.md`, the generated `CLAUDE.md` / `AGENTS.md`, and
   at most `claude/fkit-claude-init.sh`'s `RULES_MAX`** if the owner chose (b). No skill, no agent
   definition, no other source file.

## Notes

- **Depends on:** nothing.
- **Blocks:** `0194`.
- **Pairs with `0191`** — the driver-side half of the same ADR ruling. **Deliberately a separate brief,
  not merged:** `0191` has no budget constraint and can ship immediately, while this one cannot land
  until the owner makes a budget call. Merging them would hold a free change hostage to a paid one.
  ADR-037 §4 records the **honest asymmetry** between the two surfaces — the worker-side clause reaches
  every spawn, the driver-side one lives in a `SKILL.md` only the driver loads — so shipping one is not
  shipping the other, and neither should be described as covering for the other.
- **`0192`** decides whether `/fkit-task-done` step 5 changes. It does **not** gate this task: ADR-037 §1
  is decided, and step 5's fate does not change what the clause says.
- **⚠️ Priority 168 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly above `0143`**, at the very top of the open board, because ADR-037 is
  accepted and **binds nothing until this clause exists** — every ship-loop run in the meantime spawns
  workers under the same silence the ADR was written to close. **Held back from that claim by one honest
  caveat:** it cannot ship without an owner budget decision, so ranking it top would put a blocked row at
  the head of the board. Filed by a spawned producer with no owner channel; per the owner's ruling of
  2026-07-27, appending was the only sanctioned option.
