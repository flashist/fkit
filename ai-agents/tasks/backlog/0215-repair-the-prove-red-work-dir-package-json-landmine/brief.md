# Repair the `prove-red.sh` work-dir `package.json` landmine

## ID
0215

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

`test/prove-red.sh` writes an **empty** `package.json` into its throwaway work directory as a
source-checkout marker. Its own comment, above the line that writes it, states the purpose:

> A copied launcher's install root ($share) is NOT a source checkout, so its `fkit update` would
> reach the real `curl | sh` network installer. We drop a package.json marker in $work so the
> copies read as source checkouts (belt-and-braces; the harness also stubs curl to a no-op).

**The problem is what that empty file does to node.** Node resolves a `.js` file's module type from
the **nearest parent `package.json`**. An empty file is not valid JSON, so any node process launched
against a file sitting under the work directory dies with `ERR_INVALID_PACKAGE_CONFIG` **before loading
a single test**. Task `0210`'s coder hit this while wiring mutation 14, and recorded it in
`test/prove-red.sh`'s own `make_repo_copy()` comment, under the warning
*"⚠️ THE package.json COPY IS LOAD-BEARING, NOT TIDINESS"*:

> Without a valid one in the copy root, node walks up to that empty file and dies with
> ERR_INVALID_PACKAGE_CONFIG before loading anything — every test in the copy fails at import, so the
> suite is red no matter what the mutation did.

**"Red no matter what the mutation did" is the dangerous part.** A mutation gate proves a test is
load-bearing by making the code wrong and watching a *specific* assertion fail. A fault that reds the
whole suite regardless of the mutation destroys that link — every mutation "passes" the crude
red/not-red check while proving nothing at all.

### ⚠️ Nothing is broken today — state this accurately, and do not overstate it

**The gate works right now.** Mutation 14 is live, `sh test/prove-red.sh` exits 0, and mutations 1–14
red at their named assertions. Three things contain the fault today:

1. **`make_repo_copy()` sidesteps it.** It copies the repo's real `package.json` into the copy root,
   which wins as the nearest parent. Every node run that happens from under the work directory goes
   through that helper.
2. **Step `0i` catches it.** The unmutated-copy-must-be-green guard `0210` added is what surfaced the
   fault on its first run. `0210`'s worklog records the sequence: the run *"exited **1** at step 0i and
   again at mutation 14 (*"red but NOT at 0210/A"*)"*.
3. **The named-assertion greps catch it.** Every existing mutation ends in a
   *"red but NOT at `<assertion>` — red for the wrong reason"* check, and an import-time crash produces
   output that matches no assertion name. **This is a correction worth carrying:** the failure mode is
   *not* a silently-passing gate under today's mutations — it is a **loud failure with a misleading
   cause**, which is what the first run of mutation 14 actually produced.

### So what is the actual risk

**It is latent, and it lands on the next person, not on the current gate.** Two concrete ways it bites:

- **A future node-based mutation that does not route through `make_repo_copy()`** — someone copies just
  `test/`, or runs node against a fixture they built directly under the work directory — reds at import
  for a reason that has nothing to do with their mutation. If they wrote only a red/not-red check, or a
  grep loose enough to match crash output, the gate reports success while proving nothing. If they
  wrote a proper named-assertion check, they get a confusing failure and lose an afternoon finding out
  why. **`0210`'s coder caught it only because it had added the step `0i` guard** — a future author has
  no reason to expect a trap in a file whose purpose is unrelated.
- **A new green-expecting baseline step** would fail with no obvious cause, in a file where a failing
  baseline step is read as "the suite is broken, fix the suite before trusting the gate".

**Nothing in the repo warns about this except a comment inside the helper that already works around
it.** Someone who does not call that helper has no reason to read its comment.

### Why `0210` did not repair it, and what that constrains

**Mutations 1–13 depend on the marker's presence.** `0210`'s coder scoped the repair out for exactly
that reason, recording in the task folder's `review.md` that *"`$work`'s empty marker is left alone:
mutations 1–13 depend on it and only its existence is read"*, and in the worklog that repairing it
*"would have touched shared state the existing 13 mutations depend on, which the 'must not weaken or
destabilize the existing 13' constraint forbids."* That was the right call inside `0210`'s scope. It is
this task's job.

**One fact narrows the design, verified on disk 2026-08-03 by the producer filing this brief.** The
marker is checked for **existence only, never for contents**. `claude/fkit-claude.sh` defines
`_fkit_is_source_checkout()` as a test for a `.git` directory or a `package.json` **file** — a `[ -f ]`
test, with no read of the file's bytes. Nothing else in the repo reads that marker's contents.
So a marker that is valid JSON satisfies the source-checkout check identically to an empty one.

**That is context, not the design.** The implementation plan decides the fix and must confirm the
finding above rather than inherit it — `0210`'s round-1 review exists because a plan inherited a claim
that turned out to be false.

## What to build

A repair to `test/prove-red.sh` that removes the trap for the next author, without weakening the gate.

1. **Confirm the constraint first, in the plan.** Establish what actually reads the work-directory
   marker and whether anything reads its contents. Report what you found before proposing the change.
2. **Make a node process launched from under the work directory not die at import** because of that
   marker. Whatever form the fix takes, the source-checkout behavior the marker exists for must still
   hold — a copied launcher's `fkit update` must still exit before reaching the network installer.
3. **Reconcile the repair with `make_repo_copy()`'s existing workaround in the text.** That helper
   carries a long warning explaining why it copies the real `package.json`. If the repair makes the
   workaround unnecessary, say so there; if the workaround stays (it may still be wanted, so the copy
   resolves modules identically to a real `npm test` run), say why it stays. **Do not leave a comment
   describing a hazard that no longer exists, and do not delete the explanation of a workaround that is
   still doing work.**
4. **Leave a warning where the next author will actually meet it** — beside the marker itself, not only
   inside the helper that works around it. The reader who needs it is the one who never calls
   `make_repo_copy()`.

### ⚠️ `prove-red.sh` is the hard gate for the entire suite — this change touches shared state

**This is the sharper of the two `0210` follow-ups precisely because it is not additive.** The marker is
read by every mutation that copies a launcher. Everything below is the acceptance bar, not advice:

- **Every existing mutation must still be red at its own named assertion.** Not "the gate still exits
  0" — each mutation's own line, checked individually. A mutation that goes red for a *new* reason
  after this change has been silently disarmed.
- **All eight `0*` baseline steps stay green**, including step `0i`, and none is removed or relaxed to
  make the change fit. **Step `0i` is the guard that found this fault; weakening it to accommodate its
  own repair would be the worst possible outcome of this task.**
- **The source-checkout protection must not regress.** The marker exists so a copied launcher's
  `fkit update` never reaches `curl | sh`. State how you verified this still holds; do not assume it
  from the shape of the change.
- **No mutation is renumbered, reordered, or reworded** except where this change strictly requires it,
  and any such change is called out explicitly in the hand-off.

### Out of scope

- ⛔ **Do not add new mutations.** Wiring the repaired `0210` guards is task `0214`. This task changes
  no coverage.
- ⛔ **Do not change `claude/fkit-claude.sh`** or the source-checkout check itself. The marker's
  *consumer* is not the defect; the marker's *form* is.
- ⛔ **Do not restructure the work directory, the helpers, or the mutation harness.** The smallest
  change that removes the trap and keeps every mutation green.
- ⛔ **Do not touch `claude/skills/fkit-status/dashboard.sh` or `test/dashboard-contract.test.js`.**
- ⛔ **No `:NNN` line-number citations** in the code comments, the hand-off, or anywhere else — cite by
  file plus heading plus quoted phrase, per the prohibition `0173` shipped.

## Verification steps

1. **Reproduce the fault before fixing it.** Run a node process against a `.js` file placed under the
   work directory with the marker in its current form, and paste the `ERR_INVALID_PACKAGE_CONFIG`
   output. **A fix for a fault nobody reproduced is a fix for a fault nobody has.**
2. **Show the same reproduction now succeeds** after the repair, with the same command.
3. `sh test/prove-red.sh` exits **0**, and the pasted step lines show `0a`–`0i` green and every mutation
   red **at its own named assertion**. If `0214` has already landed, that is mutations 1–16; if not,
   1–14. **State which.**
4. **Prove the source-checkout protection survives.** Demonstrate that a copied launcher under the work
   directory still reads as a source checkout — name the check you ran and paste its result.
5. **Show that step `0i` was not weakened.** `git diff` over that step and over any baseline step is
   either empty or explained line by line.
6. `node --test test/*.test.js` → **567 pass / 0 fail / 17 suites**, unchanged. This task adds no test
   cases.
7. `git diff --stat` — list every changed file and justify any file other than `test/prove-red.sh`.
8. The `make_repo_copy()` comment block is reconciled with the new state, and a warning sits beside the
   marker itself. Quote both.
9. `grep` for `\.md:[0-9]` and for `\.sh:[0-9]` over the diff returns nothing.
10. Nothing committed, nothing staged.

## Notes

- **Owner:** fkit-coder. The write surface is `test/prove-red.sh`, a source file. The change needs a
  plan before an edit — it touches state fourteen mutations depend on — but the design space is narrow
  enough (see the existence-only finding in `## Context`) that it is ordinary coder work, not an
  investigation task. **If the plan finds the constraint is wider than this brief states, stop and say
  so rather than forcing the change.**
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Relates to `0214`** — the other `0210` residual, filed the same day. **Not a dependency in either
  direction.** `0214` is additive and immune to this landmine (it routes through `make_repo_copy()`);
  this repair must keep `0214`'s mutations green if they have already landed. If both are scheduled,
  `0214` first is marginally cheaper.
- **Source:** raised by `0210`'s coder as a disclosed residual — recorded in the task folder's
  `worklog.md` under *"Obvious-winner calls — three, all inside the rulings' intent"* (the third entry)
  and in `review.md`'s R2(b) response. Confirmed unfiled on either board by a wiki sync on 2026-08-03.
  Filed by a producer spawned by the sprint ship-loop driver, on the owner's live ruling of 2026-08-03
  to file it now.
- **Why the Backlog board and not Sprint 2:** the owner's standing ruling of 2026-08-02 — a brief not
  required to ship in the current sprint alongside the other tasks goes to `backlog.md`. Nothing in
  Sprint 2 waits on this, and nothing is broken today (see `## Context`), so it does not force its way
  into a sprint that has been kept deliberately short.
- **No `On merit` statement, by design:** the Backlog board is unranked (`## Priority: Unscheduled`,
  board cell `—`); there is no rank for a merit position to diverge from.
- **⚠️ Do not let the "nothing is broken today" framing shrink the acceptance bar.** The bar is every
  mutation red at its own named assertion, verified individually — a repair to a gate is exactly the
  change where "the gate still exits 0" is the least informative thing you can report.
- No commit — leave the change and the board row in the working tree.
