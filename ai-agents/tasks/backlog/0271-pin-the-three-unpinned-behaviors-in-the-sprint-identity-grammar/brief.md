# Pin the five unpinned behaviors in the sprint-identity grammar

> ⚠️ **Title/folder-name mismatch, deliberate and flagged.** This brief was filed as *three* behaviors
> and grew to **five** on the owner's ruling of 2026-08-11 (see *Authority*, item 2). The **folder** is
> still `0271-pin-the-three-unpinned-behaviors-in-the-sprint-identity-grammar` and the board row still
> links to it. Renaming the folder is a **task-file move**, which only the mover skills may perform, so
> the producer changed the in-file H1 only and recorded the divergence here instead. **The folder name
> is not wrong; it is dated.** ⛔ Do not rename it as a side effect of this task.

## ID
0271

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

**Owner ruling 2026-08-11**, given live via `AskUserQuestion` in a `fkit lead` session, verbatim option
label **"File as one follow-up"**. It bundles three review residuals from
[`0264`](../../done/0264-implement-adr-040s-identity-grammar-in-dashboard-sh-both-rungs-and-the-moved-target-companion/brief.md)
into **one** brief. The source of truth for the wording is that task's `review.md`, residual **A2** —
read it before planning.

**Owner ruling 2026-08-11 (second, later the same day)**, given live via `AskUserQuestion` in a
`fkit lead` session, verbatim option label **"Fold into 0271"**. It adds **two** further residuals —
from [`0265`](../../done/0265-implement-adr-041s-dashboard-half-the-backlog-identity-token-and-the-resolve-identity-interface/brief.md)'s
`review.md`, residuals **A1** and **A2** — to this same brief, taking it from three items to **five**.
The source of truth for their wording is that ledger's *Accepted residuals* section — read it before
planning. **Exactly two items were added; see *Not in scope* for what was ruled out.**

### The shape all five share

`0264` landed ADR-040's sprint-identity grammar in `claude/skills/fkit-status/dashboard.sh` and it is
**correct**; `0265` landed ADR-041's `select-active` / `resolve_identity` half on top of it and that is
**correct too**. Every item below is the same defect *about the tests*, not about the code:

> **a correct behavior with no test that goes red when it is undone.**

⚠️ **None of the five is a claim that the shipped behavior is wrong.** Do not "fix" the grammar, and do
not "fix" `select-active`. The deliverable is coverage.

### What was already done, so it is not re-done

Item 1's **comment half is already landed.** T6's comment previously *claimed* to cover the de-dup;
that claim was corrected inside `0264` (owner ruling 2026-08-11, verbatim **"Fix the comment now"**),
and the comment now states plainly that the de-dup is unpinned and points at this follow-up.
⛔ **Do not restate the old claim, and do not treat the comment as still wrong.** The **guard itself**
is what is outstanding.

### Not in scope — a settled residual

⛔ **`moved_target` is not right-bounded** (`➡️ Moved to Sprint 4th` → `Sprint 4t`) is **`0264`'s
residual A1**, and the owner ruled **"Accept as residual"** on 2026-08-11: pre-existing, not a
regression, reaching only drift rule 2, which fires a **loud** `drift disagreement` and never a silent
skip. **It is not part of this task.** Its own re-raise condition lives in `0264`'s ledger.

### Not in scope — what the 2026-08-11 fold explicitly did NOT bring over

The fold took **`0265` residuals A1 and A2 only**. Everything else in that ledger is settled and ⛔
**must not be pulled in here**:

- ⛔ **`0265` R1** (the false locale guard) and ⛔ **`0265` R5** (an unreadable candidate resolving to a
  **wrong** identity — an ADR-040 breach) were **fixed inside `0265`** and red-proved there. The
  reviewer's convergence call additionally recorded R1 as **outside this brief's scope**. Nothing is
  outstanding on either.
- ⛔ **`0265` residual A3 / finding R6** — a leading-`-` plan path leaks `head`/`basename` usage errors.
  Owner ruled **accept as-is**: it **fails safe**, resolving *unresolved* and never to a wrong identity.
  Noisy, not incorrect.
- ⛔ **`0265` residual A4** — a newline or TAB in a plan's basename corrupts the candidate records. Owner
  ruled **accept as-is, code unchanged**; it is now **disclosed as a limit** in `dashboard.sh`'s
  tie-break comment and `0265`'s `worklog.md` §7. Do not re-describe it as safety, and do not fix it.

**This brief grows by exactly two items.** If planning wants a sixth, that is a new brief and a new
owner ruling.

## What to build

Five guards, one pass, over `claude/skills/fkit-status/dashboard.sh`'s grammar, its `select-active`
half, and their tests.
⚠️ **Line numbers below are dated anchors of convenience (measured 2026-08-11). The durable anchors
are the quoted text.**

1. **Pin the DISTINCT-vs-total refusal** (was `0264` review finding **R3**). The `seen` de-dup at
   `dashboard.sh:118` is what implements ADR-040 §2.5's *"two or more **distinct** tokens ⇒ refuse"*.
   Measured in `0264`: **dropping `seen` leaves the whole suite green (129/129)**, while
   `# Sprint 5 — Sprint 5` would then wrongly refuse. T6 does not exercise it — **both** its fixtures
   use two *different* tokens. Add the fixture that separates *distinct* from *total*: a repeated
   identity must **resolve**, not refuse.
2. **Pin the first-line-only narrowing** (was **R4**). ADR-040 §2.1 specifies the H1 is read from
   **line 1**; `dashboard.sh:109` reads `head -1 "$1"`. Measured in `0264`: **replacing it with
   `cat "$1"` leaves the whole suite green (129/129)**. Two consequences go unguarded — the
   owner-approved narrowing could be silently reverted, and a whole-file scan can `print` twice and
   hand `PLAN_SPRINT` a **multi-line value**, a shape no consumer expects.
3. **Add a `test/prove-red.sh` mutation for the new grammar.** `0264` added none: its verification
   step 7 fenced the diff to `dashboard.sh` + `test/dashboard-contract.test.js`, putting
   `test/prove-red.sh` out of scope **by the brief's own rule**. ADR-026 discipline wants one. The
   red-proofs for `0264` were done by hand and recorded in its `worklog.md` and `review.md`; this item
   makes one of them mechanical.

---

**Items 4 and 5 were added by the fold of 2026-08-11** (owner ruling, verbatim **"Fold into 0271"**).
They come from `0265`'s ledger, cover its `select-active` half, and are the same coverage shape as
items 1–3 — ⛔ **not** requests to change `select-active`'s behavior.

4. **Pin the `[ -f ]` no-match guard on the candidate glob** (was `0265` review finding **R4**,
   residual **A1**). Measured in `0265`: **removing the guard leaves the whole suite green
   (141/141)**. When it fires — an empty `sprints/` directory, so the glob matches nothing and stays
   literal — the output carries a phantom `candidate file="*.md" identity="unresolved"` plus a `head:`
   stderr line, while the **selection itself stays correct** (`active none`, exit 3). Add the fixture
   that reds when the guard is dropped.

   ⚠️ **Note the asymmetry, and do not conflate the two halves.** The *dangerous* half of the same
   construct — the `set +f` / `set -f` glob-enable wrapper — **IS already pinned**: removing it reds
   **7** tests (re-measured in `0265`). Only the `[ -f ]` no-match half is unpinned, and its blast
   radius when unguarded is **cosmetic noise, not a mis-selection**. Do not report this item as
   "globbing is untested".

5. **Pin the two unpinned comment claims** (was `0265` review finding **R7**, residual **A2**). Both
   were **verified correct as built by direct probe** in `0265`; neither reds if undone. Add a fixture
   for each:
   - **(a) ADR-041 §1.1's `sprints/done/` exclusion** — no test places a `.md` file under
     `sprints/done/` and runs `select-active` over the parent, so nothing pins that closed sprint plans
     are excluded from candidacy.
   - **(b) *"a plan file literally named `identity` still renders as a board"*** — no test uses that
     filename, so nothing pins that the CLI's `identity` **mode word** and a plan **file** of the same
     name do not collide.

### Constraints

- ⛔ **No behavior change to the grammar.** If a new guard goes red against the landed code, the guard
  is wrong — **stop and report**, do not adjust `dashboard.sh` to suit it.
- ⛔ **Do not touch `STATUS_HEADING_RE`**, and ⛔ **do not change the `backlog` basename special case**
  (owner-ruled 2026-07-18) — both carried forward from `0264`.
- ⛔ **Do not re-open `0264`'s residual A1** (the `moved_target` right-bound), per the ruling above.
- ⛔ **Do not re-open `0265`'s residuals A3 or A4** (leading-dash noise; newline/TAB in a basename) —
  both owner-ruled **accept as-is**. See *Not in scope* above.
- ⛔ No new devDependency (ADR-014). ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No commit.

## Verification steps

1. **Each of the five guards proves itself red.** Per ADR-026 this project does not take a guard's
   word for it. Paste the measured failure for each:
   - **Item 1** — temporarily drop the `seen` de-dup at `dashboard.sh:118`; the new distinct-count
     test **must fail**. Restore. ⚠️ If it stays green it is not testing the de-dup, which is the exact
     condition that produced this brief.
   - **Item 2** — temporarily replace `head -1 "$1"` with `cat "$1"` at `dashboard.sh:109`; the new
     first-line test **must fail**. Restore.
   - **Item 3** — run `test/prove-red.sh` and show the new mutation **red as named**, alongside the
     existing mutations.
   - **Item 4** — temporarily remove the `[ -f ]` no-match guard on the candidate glob; the new test
     **must fail**. Restore. ⚠️ It stayed green at 141/141 in `0265`, which is why this item exists.
     ⛔ Do **not** red-prove this by removing the `set +f` wrapper instead — that half is already
     pinned (7 tests) and reds for the wrong reason.
   - **Item 5** — for **(a)**, temporarily neutralize the `sprints/done/` exclusion; for **(b)**, run
     the board render against a plan file literally named `identity`. Each new test **must fail** when
     its behavior is undone. Restore both.
2. **`dashboard.sh` is byte-identical at the end of the task** — `git diff` on it is empty. This task
   ships tests only. If that turns out to be impossible, **stop and report** rather than widening.
3. **Full `npm test` green**, and `test/prove-red.sh` reports `✓ hard gate PASSED` with every baseline
   gate green and every mutation red. State the measured counts.
4. **State the awk-dialect coverage limit** in the worklog rather than implying it was closed — see
   `## Notes`.

## Notes

- **Depends on:** `0264` **and `0265`** (items 4 and 5 cover `0265`'s `select-active` half — both are
  now closed, so nothing here is waiting)
- **Blocks:** nothing
- ⚠️ **`gawk` / `mawk` / `busybox awk` are UNVERIFIED — carried as context, NOT as scope**
  (`0264`'s residual **A3**). Only BSD one-true-awk 20200816 was exercised. Every construct used is
  POSIX and BSD is the stricter dialect, and `dashboard.sh`'s forced `LC_ALL=C` makes the em/en-dash
  literals byte-matches — **so it is believed portable, but it was not measured.** ⛔ **Do not scope
  installing another awk into this task.** Record the limit; do not silently drop it either.
- **On merit:** the Backlog board is unranked, so there is no rank to justify — but the placement is a
  judgement and here it is. **Sprint 5 is mid-flight with nine rows still open** (`P4`–`P9` plus the
  displaced release-hygiene rows), the owner named no sprint in the ruling, and appending to Sprint 5
  would land this **below every open row** anyway — a worse and less honest signal than an
  explicitly-unranked board. This is hardening, **not** on the release path: `0264` already restored
  `npm test` to green and produced the landed pattern Sprint 5's release gate tests, so nothing in
  Sprint 5 waits on this. **If the owner wants it in Sprint 5, pulling it in is a three-edit producer
  act, not a re-file.**
- **Line-number citations are dated anchors of convenience** (measured 2026-08-11); the durable anchors
  are the quoted text.
- Filed 2026-08-11 by a spawned `fkit-producer` with no owner channel, on the owner's ruling of the
  same day.
- **Widened 2026-08-11 from three items to five** by a spawned `fkit-producer` with no owner channel,
  on the owner's later ruling the same day (verbatim option label **"Fold into 0271"**). ⚠️ **The
  board placement was NOT changed** — still Backlog, still Unscheduled, still the same folder. The
  `backlog.md` row cell was left byte-identical and a dated addendum appended beneath the board,
  matching this repo's existing pattern for amending a row without rewriting its history.
