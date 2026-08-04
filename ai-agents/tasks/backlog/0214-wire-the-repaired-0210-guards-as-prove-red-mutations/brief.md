# Wire the repaired `0210` R3/R4 guards as prove-red mutations

## ID
0214

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Task **`0210`** (closed 2026-08-03) made the reverse move — sprint → Backlog board — specified and
parsed, and its round-1 review produced five findings, all ruled *fix it*. Two of those fixes —
**R3** and **R4** — repaired test guards that were not guarding what they claimed:

- **R3** made case `0210/D` real. It now carries a second fixture row (`➡️ Moved to Narnia`) alongside
  the original bare-`➡️ Moved` row, so it guards against a **future parser that matches too much**.
- **R4** added case `0210/G`, pinning the legacy unlinked prose form (`➡️ Moved to Sprint 2 — priority
  7`), so it guards against a parser that makes the **opening bracket mandatory**.

**Both were proven red by hand and neither is wired as an automatic mutation.** The coder's own record,
under the heading *"Residual, disclosed — not everything new is prove-red wired"* in `0210`'s
`review.md`:

> Mutation 14 is the **revert** mutation, and it names `0210/A`. The repaired guards from R3 and R4 are
> proven red **by hand this round** (shown above) but are **not** themselves wired as prove-red
> mutations — the owner ruled "the dashboard mutation", singular, and widening that is scope this
> worker does not hold. The seam and helpers now exist, so adding an over-wide mutation and a
> mandatory-bracket mutation is a few lines each.

The hand proof itself, from the same file's *"R3 — case D was made real, not reworded down"* and
*"R4 / R5 — as ruled"* sections: the over-wide parser
`s/.*Moved to \[*([A-Za-z]+ ?[0-9]*).*/\1/p` "left **all 115** cases green before, and now reds **D and
only D**"; the mandatory-bracket change `\[*` → `\[` "left all 115 green before; case **0210/G** now
reds **G and only G**."

### Why this is worth doing

**A test that is not mutation-proven is a test nobody has shown would catch a regression.** The hand
proof is real and it is recorded — but it was run once, by one worker, on one afternoon, and nothing in
the repo re-runs it. `0210`'s own worklog is blunt about the same gap in its pre-review form, under
*"Red proof — the tests are load-bearing"*:

> Case D is red against neither variant, and that is by design: it guards against a *future* fix that
> matches too much, not against these two. Stated here so it is not mistaken for proven coverage.

**Mutation 14 already established that dashboard coverage is possible.** Before `0210`'s review, the
plan asserted this could not be covered without a test-architecture change; the review refuted that by
execution. The seam is the **directory layout**, not an env var — `make_repo_copy()` puts `claude/` and
`test/` under one throwaway root, and the copied test resolves the copied script by construction. This
task extends the coverage mutation 14 opened; it invents nothing.

### Cost, and why it is small

Per the coder, the helpers already exist in `test/prove-red.sh`: `make_repo_copy()`,
`run_dashboard_suite()`, and step `0i` (the unmutated-copy-must-be-green guard). Each new mutation is a
few lines that follow mutation 14's shape.

## What to build

Two new mutations in `test/prove-red.sh`, each reusing the existing helpers, each following mutation
14's block structure exactly.

1. **The over-wide mutation.** Swap `dashboard.sh`'s `➡️ Moved` target extractor in a
   `make_repo_copy()` root for an extractor that matches too much — the one the review used,
   `s/.*Moved to \[*([A-Za-z]+ ?[0-9]*).*/\1/p` — and assert the copied dashboard suite goes red **at
   the named assertion `0210/D`**.
2. **The mandatory-bracket mutation.** Swap the same extractor for one whose opening bracket is
   mandatory (`\[*` → `\[`), and assert the suite goes red **at the named assertion `0210/G`**.

3. **Update the header index in the same edit.** `test/prove-red.sh`'s header currently opens its index
   with *"FOURTEEN mutations, each caught by a NAMED assertion"* and carries the standing warning
   *"⚠️ KEEP THIS LIST IN STEP WHEN YOU ADD ONE"*, with the reason spelled out — it once read *"Two
   mutations"* while seven more sat below it. Update the count word **and** add the two new numbered
   entries in the established `N. <what it breaks> → "<named assertion>"  (task NNNN)` form.

### Follow mutation 14's shape — three details that are not stylistic

Read mutation 14's block (`test/prove-red.sh`, the block headed *"Mutation 14: revert dashboard.sh's
➡️ Moved target extractor"*) before writing a line. Three things there exist because they were paid
for:

- **⚠️ The replacement line comes from a file via `getline`, never from `awk -v`.** The block's own
  warning says why: *"awk processes escape sequences in a -v assignment, so `\[` and `\1` arrive
  stripped and the 'mutation' is a mangled regex that breaks the script outright: every test reds,
  including ones the mutation has nothing to do with, and the named-assertion check below would still
  pass. Red for the wrong reason, disguised as success."* **The mandatory-bracket mutation is exactly a
  `\[` payload** — it is the case this warning was written about.
- **The no-op check.** Mutation 14 runs `cmp -s` against a saved `.orig` and fails loudly if the swap
  changed nothing, because a mutation that does not mutate reports success while proving nothing. Both
  new mutations need the same check with their own message.
- **The named-assertion grep is the point, not the redness.** `[ "$r" != red ]` alone is not a gate.
  Each mutation must grep the suite output for its own assertion name and fail with *"red but NOT at
  `<name>` — red for the wrong reason"* otherwise.

### ⚠️ `prove-red.sh` is the hard gate for the entire suite — do not weaken it

**Read this before touching the file.** `test/prove-red.sh` is the one gate whose whole thesis is that
an unexercised gate hides drift. Everything below is the acceptance bar, not advice:

- **The existing mutations must not be weakened, reordered, renumbered, or destabilized.** The new
  mutations are **purely additive** — appended after the current last mutation, with new numbers.
  Mutations 1–14 keep their numbers, their payloads, their named assertions, and their messages.
- **The eight `0*` baseline steps stay as they are**, including step `0i`.
- **The never-touch-the-real-file invariant holds.** Every mutation edits a throwaway copy under the
  script's work directory. `0210` shipped its hand proof by swapping the real `dashboard.sh` in place
  and restoring it with a checksum check — that was disclosed as a transient act, and it is **not** the
  pattern to follow here. These mutations run on copies.
- **The acceptance bar is: every existing mutation still red at its own named assertion, plus the two
  new ones red at theirs.** A run where the new mutations pass and an old one no longer reds at its
  named assertion is a **failed** implementation, not a partial success.

### Out of scope

- ⛔ **Do not repair the work-directory `package.json` marker.** That is task `0215` — a different
  change with a different precondition. The new mutations route through `make_repo_copy()`, which
  already copies the repo's real `package.json` into the copy root, so they are unaffected by it.
- ⛔ **Do not change `claude/skills/fkit-status/dashboard.sh`.** Its extractor is the *target* of these
  mutations, not their subject. The shipped parser stays exactly as `0210` left it.
- ⛔ **Do not add, rename, or re-assert test cases in `test/dashboard-contract.test.js`.** Cases
  `0210/A`–`0210/G` are the assertions these mutations name; changing them changes what is being
  proven.
- ⛔ **Do not widen this into general dashboard mutation coverage.** Two mutations, for the two repaired
  guards. `0210`'s other cases are covered by mutation 14 or are out of scope here.
- ⛔ **No `:NNN` line-number citations** in the code comments, the hand-off, or anywhere else — cite by
  file plus heading plus quoted phrase, per the prohibition `0173` shipped.

## Verification steps

1. `sh test/prove-red.sh` exits **0**. Paste the run's own step lines showing steps `0a`–`0i` green and
   mutations **1 through 16** each reporting red at its named assertion. A summary sentence is not
   evidence; the gate prints one line per step and those lines are the evidence.
2. **State the before-and-after mutation count explicitly** — 14 before, 16 after — and confirm no
   existing mutation's number changed.
3. **Each new mutation reds its own case and only its own case.** Run the copied dashboard suite under
   each mutated parser and report which of `0210/A`–`0210/G` fail. Expected: over-wide → **D only**;
   mandatory-bracket → **G only**. If any other case reds, the mutation is broader than claimed and the
   named-assertion grep is hiding it.
4. **Prove each new mutation is not a no-op.** Show the `cmp -s` guard is present and, for each,
   demonstrate the swap actually changed the copied file.
5. `node --test test/*.test.js` → the suite is still **567 pass / 0 fail / 17 suites**, unchanged. This
   task adds no test cases; a changed count means something was touched that should not have been.
6. `git diff --stat` shows **`test/prove-red.sh` as the only changed file**.
7. The header index says **SIXTEEN** (or the correct count word) and lists both new entries in the
   established form.
8. `grep` for `\.md:[0-9]` and for `\.sh:[0-9]` over the diff returns nothing.
9. Nothing committed, nothing staged.

## Notes

- **Owner:** fkit-coder. The write surface is a single shell script under `test/`; the change is
  additive and its shape is already established by mutation 14. No design consult is needed — but the
  gate is load-bearing enough that the implementation plan should be reviewed before the edit lands.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Relates to `0215`** — the other `0210` residual, filed the same day. **Not a dependency in either
  direction.** These mutations use `make_repo_copy()`, which is already immune to the landmine `0215`
  describes; and `0215`'s repair must keep every mutation green, including these two, whichever ships
  first. If both are scheduled, doing this one first is marginally cheaper — it is additive, while
  `0215` touches shared state.
- **Source:** raised by `0210`'s coder as a disclosed residual in the task folder's `review.md`
  (*"Residual, disclosed — not everything new is prove-red wired"*), which closes
  *"Recommend the producer file it as a follow-up for the owner to rank."* Confirmed unfiled on either
  board by a wiki sync on 2026-08-03. Filed by a producer spawned by the sprint ship-loop driver, on
  the owner's live ruling of 2026-08-03 to file it now.
- **Why the Backlog board and not Sprint 2:** the owner's standing ruling of 2026-08-02 — a brief not
  required to ship in the current sprint alongside the other tasks goes to `backlog.md`. Nothing in
  Sprint 2 waits on this, and the hand proof already recorded in `0210`'s `review.md` means the guards
  are known-good today; what is missing is the automatic re-proof.
- **No `On merit` statement, by design:** the Backlog board is unranked (`## Priority: Unscheduled`,
  board cell `—`); there is no rank for a merit position to diverge from.
- **What this task does NOT claim to fix.** Dashboard behaviors outside `0210`'s cases remain
  unmutated. Mutation 14 plus these two cover the reverse-move parser; the other thirteen dashboard
  behaviors named in `0210`'s worklog stay in the posture they were already in. Say so in the hand-off
  rather than reporting "dashboard coverage is done".
- No commit — leave the change and the board row in the working tree.
