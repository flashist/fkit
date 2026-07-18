# Worklog — Add the `/fkit-dumb-down` skill for the six Claude-side roles

**Task:** [`add-dumb-down-skill-for-six-roles.md`](../tasks/done/add-dumb-down-skill-for-six-roles.md)
· **Sprint 2, priority 72** · **Plan:** [`plans/add-dumb-down-skill-for-six-roles.md`](../plans/add-dumb-down-skill-for-six-roles.md)
· **Ledger:** [`reviews/add-dumb-down-skill-for-six-roles.md`](../reviews/add-dumb-down-skill-for-six-roles.md)

**Status: 🔄 In progress — READY FOR DONE**, with one caveat below. Awaiting the owner's
`/fkit-task-done`; this loop never sets `✅ Done`.

---

## The headline: my content rule protected *presence* and missed *force*

The whole point of this skill is that simplifying must never soften. I wrote a list of things that
must survive a re-explanation — failures, caveats, unverified-claim flags, degradation flags, things
not done, load-bearing numbers — and thought that closed it.

**It didn't.** Both reviewers found the same gap, independently, and rated it high: the list governs
*whether* a claim survives, never **at what strength or in what position**. Two escapes, and both read
as good simplification:

- **Hedge-downgrade** — *"this will break"* → *"this could cause issues"* keeps the caveat and guts it.
- **Placement-demotion** — a flag that led the original, relegated to a trailing clause.

**The sharpest part of the finding: this repo had already solved the placement half** — `CLAUDE.md`
says *"'Loud' is placement, not word count"* — **and my skill did not import it.** That is what made it
cheap to close and hard to defend leaving open.

Fixed by naming both escapes explicitly and adding a decision test: **"if the owner acted only on your
re-explanation, would they make the same decision?"**

## The claim of mine that was too broad

I wrote that the skill *"works the same in a session and in a spawned consult."* The ADR-021 half was
right — no owner channel, so no degradation applies. **The sentence around it was false**, and the
reviewer verified two cases I had not considered:

- In a **fresh** consult there is no prior answer of the agent's own, so the skill is a **no-op by
  construction** — it degrades gracefully, but it does not "work the same".
- In a **resumed** consult it runs, but the output goes to the **calling agent**, whose relay is not
  bound by my content rules. **The preservation guarantee ends at the consult boundary.**

Narrowed to say exactly that, and what to do about it: if the content must reach the owner undiluted,
say so rather than trusting the relay.

## The mistake I self-reported, and why it was worth doing

My scripted edit to the hook test matrix was wrong **twice at once** — it duplicated `fkit-dumb-down`
in `UNIVERSE` (doubling every case) and missed `lead`, whose entry has different punctuation. The
suite went red at `lead × fkit-dumb-down -> deny`. I fixed it, then **told the reviewer it had been
wrong twice and asked them to verify independently rather than trust the fix.**

They parsed the matrix programmatically — 24 entries / 24 unique, `lead` present, no `OWNED`
duplicates, `UNIVERSE` matching `ls claude/skills/` 24/24 in both directions — and reported:
*"I specifically hunted for a third way the scripted edit was wrong and did not find one."*
**That is the check working.** Disclosing the mistake cost nothing and bought a targeted audit.

## Owner-decision log

| # | Question | Owner's answer |
|---|---|---|
| 1 | Approve the plan (batch, six tasks) | **Approved** |
| 2 | **R3/R4** (shared with task 70) — scaffold doc + the mirror mandate | **Fix the mandate header and its duplicate now** |

R1 and R2 were mechanical, in-plan `CORRECT` defects and were applied without asking; R3/R4 shared task
70's ruling and were fixed once, in that pass.

## Verification evidence

```
$ npm test
ℹ pass 379   ℹ fail 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

- Registration: 6 allow / 1 deny, no duplicated cases (`sort | uniq -c` verified).
- **Mutation-checked both directions:** granting to the adversarial reviewer → red; revoking from
  `wiki` → red.
- Six agent rosters carry the skill; `fkit-adversarial-reviewer.md` carries neither new skill.
- `prove-red.sh` now runs inside `npm test` (task 70's fix) — so from here a disarmed hard gate cannot
  hide behind a green unit suite.

## ⚠️ The caveat on "ready for done"

**The suite proves the gate, not the behavior.** Whether a re-explanation actually preserves a caveat —
the entire promise of this skill — **cannot be tested here.** The brief's spot-check (re-explain an
answer containing a caveat, confirm it survives) is the owner's, and it is outstanding. Given R1, that
spot-check is worth actually running: the failure mode is one that *reads well*.

## Open questions / residuals

- **Recorded in the ledger:** behavior is untestable; automated coverage stops at role→skill ownership.
- **Task 62 relationship confirmed sound** by the reviewer — default vs on-demand, *"a further step down
  in altitude on a specific answer"*. A future reader would not consolidate them.

## Commit state

**Nothing committed.** All edits left in the working tree.
