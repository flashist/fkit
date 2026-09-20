# Build the no-board-row check in the `node --test` suite, with a named dated allowlist of exactly `0014` and `0004`

## ID
0406

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**This task implements a decision that is already made.** ⛔ **Do not re-open it, do not re-weigh the
candidates, and do not propose a `dashboard.sh` change.**

[`0296`](../0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md) — *"Decide what
catches a task brief that has no board row"* — was ruled on **2026-09-18**. The full record, including
the rejected candidates and the measurement, lives in that brief under its heading
*"⭐ DATED NOTE 2026-09-18 — THE DECISION IS RULED"*.

⛔ **THE OWNER SELECTED A PRE-WRITTEN OPTION; HE TYPED NO FREE TEXT.** What follows is **selected
option text**, chosen via `AskUserQuestion` in a live `fkit lead` session. ⛔ **Never quote it as the
owner's own words.**

> *"A test-suite check, keeping the two specimens — ~10 lines in the existing node --test suite, with
> a named dated allowlist of exactly 0014 and 0004 recording why they stay unrepaired. No ADR, no
> contract change, nothing for dashboard.sh to learn. Catches at CI time rather than filing time —
> acceptable given zero recurrence in 108 filings, and that latency is the whole price. Closes 0296
> on the finding 'two failure modes, the live one has stopped.'"*

### The gap this closes

Nothing in this repo catches *"a task brief exists on disk with no row on any board."* Such a task is
invisible to `/fkit-status`, to `.claude/skills/fkit-status/dashboard.sh`, and to any backlog sweep —
because all three read **boards**, and a brief with no row is not on a board. `dashboard.sh` is a pure
function of the sprint plan and **the briefs the plan links** (its own contract comment), so an
unlinked brief is outside its input **by construction**. `/fkit-task-brief` step 8 already *requires*
the row (*"Update the board — every brief gets a row, always"*); what is missing is anything that
**notices the step was skipped**.

### The two specimens — and why they stay broken on purpose

⛔ **`0014` and `0004` are NOT to be repaired by this task, or by anything else.** The ruling keeps
them. They are the only live test data this check has, and repairing either would make the test
vacuous.

| Specimen | Location | Why it has no row |
|---|---|---|
| [`0014-align-conventions-readme-enforcement-item-live-vs-scaffold`](../../done/0014-align-conventions-readme-enforcement-item-live-vs-scaffold/brief.md) | `ai-agents/tasks/done/` | Old, unsprinted; reached a terminal state without ever having a row. Appears in `ai-agents/sprints/done/sprint-2.md` only as **prose**. |
| [`0004-add-e2e-smoke-script-for-fkit-itself`](../../cancelled/0004-add-e2e-smoke-script-for-fkit-itself/brief.md) | `ai-agents/tasks/cancelled/` (`⛔ Cancelled (2026-07-14)`) | Same signature. Its **only** appearance in `ai-agents/sprints/` is a prose citation calling it *"already-unsprinted"*. |

⭐ **The split that decided the ruling: TWO failure modes, and the live one has stopped.** A third
specimen, `0295`, was a **fresh filing that skipped an append** — that mode was repaired in August and
has not recurred. `0014` and `0004` belong to a **convention era that has passed**.

**Measured on disk 2026-09-18, re-derived not carried forward: 405 task folders, findings = exactly 2
(`0014`, `0004`). At 2026-08-14 it was 297 folders and the same 2.** ⭐ **108 new task folders in 35
days and not one new specimen** — that is the zero-recurrence figure the ruling rests on.

### ⚠️⚠️ READ THIS BEFORE WRITING A LINE — THE NAIVE CHECK IS NOW PERMANENTLY SILENCED

⛔ **`grep`ing the boards for `0014` or `0004` returns hits today, and EVERY ONE OF THEM IS PROSE.**
`0296`'s own Backlog-board row cites both task folders by href, and `0301`'s row cites `0014`. So the
loose form — *"does this id appear anywhere in a board file?"* — reports a **perfectly clean board**
while both tasks still have no row, and it will keep doing so for as long as those rows exist.

**Measured 2026-09-18, both forms, same tree:**

| Form | Result |
|---|---|
| Loose (id appears anywhere on a board) | `total=405 no-row=0` ⛔ **wrong — a silent false clean** |
| Tight (table row's final `Brief` cell links the folder) | `total=405 no-row=2` ✅ `0014`, `0004` |

⭐ **`0296` predicted this exact outcome and named it**: *"A check that a brief can silence by
mentioning a task is not a check."* ⚠️ **The prediction has now come true permanently.** A check built
on the loose form would go green on day one and stay green forever, over a corpus with two real
findings in it. **That is the single most likely way this task ships broken.**

⭐ **Two independently derived rules agree on the answer, and that agreement is the strongest evidence
this task has:**

1. **`0296`'s rule** — a table row whose **final `Brief` cell** links the task folder.
2. **`fkit-external-expert`'s rule** — the row's **first cell starts with a status glyph** and its
   **last cell links a task folder**.

**Both return exactly `0014` and `0004` at 405 folders.** ⭐ Rule 2 is the stronger of the two because
it constrains **both** ends of the row; prefer it, or state why not.

## What to build

**One thing: a new assertion in the existing `node --test` suite.** ⛔ Nothing else. No `dashboard.sh`
change, no contract widening, no ADR, no skill-procedure edit, no repair of any task.

1. **Host it in the `node --test` suite.** The closest neighbour is
   `test/task-id-uniqueness.test.js`, which already walks all three task-board trees, already reads
   the repo read-only, and already carries a header explaining its own test-scope widening. ⭐ **Follow
   that header precedent** — this assertion is the same fourth scope category (an invariant over the
   repo's own `ai-agents/` content), and the reader should not have to infer that. Whether it becomes a
   new `test/*.test.js` file or an added test in that one is the coder's call; **say which and why.**
2. **The rule it matches: a status-led table row whose `Brief` cell links the task folder.** ⛔ **Never
   the bare id anywhere in a board file.** Scan every board — `ai-agents/sprints/*.md` **and**
   `ai-agents/sprints/done/*.md` **and** `ai-agents/sprints/cancelled/*.md` — and derive the board list
   by glob, never by a hand-written list of filenames (a hard-coded list is how the reverse sweep in
   `0296` went stale when Sprint 5 was archived).
3. **The named, dated allowlist of exactly two entries.** ⭐ **This is not a mute button — it is the
   durable record of the decision not to repair `0014` and `0004`.** It must carry, in the source,
   beside each entry: the task id, its current folder, **the date the exemption was granted
   (2026-09-18)**, **who ruled it** (owner, by selected option, in a live `fkit lead` session), and
   **why it stays unrepaired** (an old-era failure mode that has stopped recurring; and repairing it
   would make this test vacuous). A bare `const ALLOW = ['0014','0004']` **does not satisfy this
   task.**
4. **⛔⛔ THE TEST MUST FAIL ON THOSE TWO IF THE ALLOWLIST IS REMOVED — or it proves nothing.** An
   allowlist that is never exercised is indistinguishable from a check that finds nothing. **Assert
   this directly**: a test that removes the allowlist and asserts the finding set equals exactly
   `{0014, 0004}` is the proof that the matcher works on the live corpus. ⚠️ **Without that assertion,
   a matcher with a typo'd regex passes silently forever.**
5. **The allowlist must be exact, and over-broad entries must fail.** An id in the allowlist that is
   **no longer** a finding (because someone backfilled its row) must **fail the test**, not pass
   silently — a stale exemption is a lie in the source. Say plainly which direction you implemented.
6. **Fail loudly on error, never silently into the not-found branch.** `0296`'s Trap 2: a sweep whose
   tooling errored read every error as *"no match"* and reported 295 of 295 folders broken. In Node
   this is the unreadable-file / empty-glob case. **A zero-board or zero-task scan must fail, not
   pass.**

### ⛔ Out of scope — named so it is not drifted into

- ⛔ **Repairing `0014` or `0004`.** Keeping them is the ruling.
- ⛔ **Deciding which board would take their rows if they were ever backfilled.** The owner
  **deferred** that on 2026-09-18, with the trigger *"when they're backfilled."* It is recorded on
  `0296`. ⛔ Do not answer it here.
- ⛔ **Any `dashboard.sh` change.** The ruling's own words: *"nothing for dashboard.sh to learn."*
- ⛔ **A filing-time producer step.** Rejected candidate.
- ⛔ **Editing `0296`'s or `0301`'s board rows** to remove the prose citations that silence the loose
  check. Those rows are evidence, and the tight matcher is immune to them.

## Verification steps

1. **`node --test test/*.test.js` is green** with the new assertion present.
2. **The matcher returns exactly `{0014, 0004}` against the live tree with the allowlist removed** —
   paste the actual output into the close, do not describe it. ⚠️ **A run returning a different set
   must explain the difference before anything is built on it**; the count was `2` at both 297 and 405
   folders.
3. **Known-bad, in a fixture tree, never inside `ai-agents/tasks/`:**
   - a brief with **no row at all** → **found**;
   - a brief **cited in prose in another row's description but with no row of its own** → ⛔ **still
     found.** ⚠️ **This is the trap-3 case and skipping it is how trap 3 survives.** A matcher that
     passes tests 1–2 but fails this one is the exact defect this task exists to avoid.
4. **Known-good, in a fixture tree:** a brief **with** a proper status-led row → **not found**.
5. **Row-shape robustness — state the limit out loud if you do not solve it.** `0296` flags that a
   `grep` assuming the `Brief` cell is last would silently drop a re-wrapped row or a row with a future
   added column. **Either parse the row into cells, or write down the limitation in the source.** ⛔ Do
   not leave it unstated.
6. **Error-path proof:** point the scan at an unreadable or empty board set and show it **fails**
   rather than reporting a clean tree.
7. **The allowlist's documentation content is present** — date, authority, per-entry reason — and a
   reader who has never seen `0296` can tell from the source alone why those two are exempt.
8. **Nothing in `ai-agents/tasks/` was moved, renamed, repaired or re-statused** by this change.
   `git status` shows only test-tree changes.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** nothing. ⭐ The decision it implements is already ruled (`0296`, 2026-09-18); no
  ADR and no contract change gate it.
- **Blocks:** [`0296`](../0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md) — ⭐
  **`0296`'s close is gated on this task landing green**, which is what its own `## Verification steps`
  step 4 demands (*"If a mechanism lands, it must be run and its output pasted into the close"*).
- **⭐ Why this is its own brief rather than being carried by `0296` — the producer's call, stated so
  it can be overturned.** `0296` is a **decision** task owned by `fkit-architect`; this is **code**
  owned by `fkit-coder`. Two owners, two verification sets, and two independently shippable units —
  the decision shipped on 2026-09-18 and the check has not. Folding the code into `0296` would make one
  brief carry a finished deliverable and an unstarted one, which is exactly the conflation the
  decomposition rule forbids. ⚠️ **The cost, named: two rows now describe one line of reasoning**, and
  a reader who finds only this brief must follow the link to `0296` for the evidence base.
- **⚠️ The accepted cost of the whole approach, from the ruling itself:** this fires at **CI time, not
  filing time**. A brief can still be invisible until someone runs the suite. ⛔ **That latency is the
  ruling's stated price, not a defect to design around.**
- **⚠️ Not caught by the Sprint 11 migration freeze.** That freeze covers *migration-shaped* work —
  re-keying ids, moving folders, rewriting boards. This adds a **read-only test**; it changes no stored
  shape. ⚠️ If the implementation ever proposes to move, re-key or rewrite anything under
  `ai-agents/`, it **stops and escalates** rather than proceeding.
- **⛔ No mover**
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
  — the close goes through `/fkit-task-done`, producer-only, carrying the
  `(agent-closed — not owner-verified)` marker if the owner is absent), **⛔ no re-rank**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  **⛔ no commit.**
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`. **Unranked** —
  the backlog is unranked by design, and a spawned producer with no owner channel ranks nothing.
  **On merit this belongs directly below [`0296`](../0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md)**,
  because it is that task's deliverable and nothing else reads it.
- **Filed 2026-09-18** by a spawned `fkit-producer` with **no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  executing the mechanics of an owner ruling relayed by `fkit-lead`.
