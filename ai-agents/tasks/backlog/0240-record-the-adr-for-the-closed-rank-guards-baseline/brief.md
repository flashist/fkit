# Record the ADR — the closed-rank-immutability guard's baseline is `HEAD`, and its scope is the transition in progress

## ID
0240

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### Authority — three owner rulings, in sequence

All taken via `AskUserQuestion` in a live `fkit lead` session on **2026-08-06**:

1. On who should settle `0182`'s blocking baseline question — **"Have the architect decide it."**
2. The architect consult delivered its recommendation and returned two open questions. On CI —
   **"No CI planned."**
3. On whether to include the `HEAD` ↔ `HEAD^` second leg — **"Include it."**

This task records the resulting decision as an ADR. **The decision has been taken. This task does not
re-open it.**

> ### ⚠️ DATED CORRECTION 2026-08-12 — RULING 2 ABOVE IS REVERSED. CI EXISTS. Text above left byte-identical.
>
> **"No CI planned" is dead as a premise.** The owner reversed it themselves — first on **2026-08-08**
> (*"fix it, not just record it"*), then confirmed on **2026-08-12** at
> [`0256`](../../done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md)'s plan gate, verbatim option
> label **"Approve — both gate and CI (Recommended)"**. This correction is filed on the owner ruling
> **"Spawn a producer to amend 0240 now (Recommended)"** (`AskUserQuestion`, 2026-08-12, live `fkit lead`
> session). Ruling 2 above is now **history, dated and superseded** — it is not a live premise and must
> not be written into a permanent record as one.
>
> **What `0256` landed on 2026-08-12** — verified on disk by the producer that wrote this block;
> **re-verify before writing the ADR** rather than citing this list:
> - **`.github/workflows/test.yml`** — `npm test` on every push to `main` and every pull request;
>   `ubuntu-latest`, Node 24, `fetch-depth: 0`, `timeout-minutes: 20`.
> - **`bin/release.mjs`** — a `runTests()` gate immediately before the version-bump block, the script's
>   first mutating line. Red suite → exit 1. No warn-and-continue path. Runs under `--dry-run` too. A
>   `--no-test` escape hatch exists, behind an unconditional stderr banner.
> - **`architecture.md`** — §9.1's heading, opening sentence, its `- **No CI.**` bullet and its closing
>   residual paragraph corrected; §11 OQ2 closed.
>
> **⚠️ CI HAS NEVER RUN.** The loop that landed it neither commits nor pushes, so the workflow is
> verified by static review only. **The ADR must not claim CI is proven working** — the honest wording is
> *wired, not yet observed green on a runner*.
>
> **Three sites in this brief are corrected — none of them changes what the ADR decides:** ruling 2
> above; the premise bullet in `## What to build`; verification step 7. Corrections are filed at each.
>
> **⛔ The decision itself is UNCHANGED and still not re-openable here:** baseline `HEAD`, scope = the
> transition in progress, the `HEAD` ↔ `HEAD^` second leg, the criterion, and the by-name rejection of a
> committed snapshot/manifest. **None of those rests on CI.** They rest on *a baseline must be a record
> you cannot rewrite in the same act that breaks the invariant* — a property of the baseline, which CI
> does not touch.

### What the architect recommended

**Baseline = `HEAD`. Scope = the transition currently in progress, not a history range.**

This does not *answer* `0182`'s blocking decision — it **dissolves** it. `0182` is blocked on choosing
between *exempt history before a named commit* and *accept a permanently red run*. With no history
range there is no permanently red run, and therefore **no exemption to justify**. The `0174` commit
that renumbered eight closed rows stays in history, red or not, without the guard ever asserting over
it.

**The deciding criterion, and the sentence the ADR exists to preserve:**

> A baseline must be a record you cannot rewrite in the same act that breaks the invariant.

`HEAD` satisfies it — a working-tree change cannot alter what `HEAD` already committed.

**A committed snapshot / manifest file was rejected BY NAME**, and the ADR must record the rejection
with its reasoning intact: a manifest's only repair path is regenerating it from the thing under test,
so the act that breaks the invariant is also the act that updates the baseline — **laundering the
breach into the baseline.** It fails the criterion above by construction, not by accident.

### Why an ADR rather than a note on `0182`

Two reasons, both from the architect:

1. **[ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)'s
   §"Left undone, deliberately" leaves this hole open explicitly** — *"No guard is built here… it needs
   a baseline decision first, because it would be red on the commit that filed task `0174`."* The hole
   is named in an accepted ADR; the answer belongs at the same altitude.
2. **The snapshot idea will otherwise return as a review finding.** Recording the rejection by name is
   what makes a future proposal *closeout* rather than a new defect — the same device ADR-035 uses for
   the three options it rejected.

## What to build

An ADR in `ai-agents/knowledge-base/decisions/`, via `/fkit-record-decision`.

### It must contain

- **The decision:** baseline `HEAD`; scope = the transition in progress; **plus the `HEAD` ↔ `HEAD^`
  second leg, which the owner ruled *"Include it"*.**
- **The criterion**, stated as a criterion so it generalizes: *a baseline must be a record you cannot
  rewrite in the same act that breaks the invariant.*
- **The rejected option, by name:** a committed snapshot/manifest, with the laundering argument.
- **⚠️ The accepted residual, stated honestly and prominently — not implied away.** The design
  **knowingly accepts that a breach committed with no test run in between is never caught.** A
  working-tree comparison against `HEAD` sees only what is uncommitted right now; commit the breach,
  run nothing, and the next comparison's baseline already contains it. **This is a real limitation,
  ruled acceptable, and the ADR must say so.** An ADR that implies full coverage of closed-rank
  immutability is a defect of this task. Note that the `HEAD` ↔ `HEAD^` leg **narrows** this residual
  by one commit; it does not remove it, and the ADR must not let the second leg read as a fix.
- **The owner's CI ruling — "No CI planned"** — recorded as a **premise**, because it is load-bearing:
  with no CI, "run on every commit" is not available and the residual above cannot be closed by
  automation. The ADR's answer would change if that changed, which is why:
- **A mandatory `Re-raise only if` clause**, following ADR-035's own form, with at least these two:
  - **Re-raise only if CI is introduced** — the residual becomes closeable and the range question
    genuinely reopens.
  - **Re-raise only if the closed-row rule itself is revised** — this decision is downstream of it, as
    ADR-035 records of its own narrowing.

  > **⚠️ DATED CORRECTION 2026-08-12 — the two bullets above are FALSIFIED BY CI. Both left
  > byte-identical.** Provenance: `0256` landed CI and the in-release gate on 2026-08-12; owner rulings
  > **"Approve — both gate and CI (Recommended)"** (2026-08-12, `0256`'s plan gate) and **"Spawn a
  > producer to amend 0240 now (Recommended)"** (2026-08-12). See the master correction in `## Context`.
  >
  > **1. The premise bullet — "The owner's CI ruling — *No CI planned*".** Record the CI position as a
  > **dated history, not a live premise**: ruled *"No CI planned"* on 2026-08-06, **reversed by the owner
  > on 2026-08-08 and confirmed 2026-08-12; CI landed the same day as `0256`.** Its stated consequence —
  > *"with no CI, 'run on every commit' is not available and the residual cannot be closed by
  > automation"* — **no longer holds as written.**
  >
  > **2. The residual must be re-reasoned, not deleted.** It narrows; on the evidence available it does
  > **not** close. The ADR must state where it now stands, and the architect must **derive this from the
  > guard as built (`test/closed-rank-immutability.test.js`) — the producer did not read it.** The
  > shape to test, not to copy: CI checks out a clean tree, so a working-tree-vs-`HEAD` comparison is
  > **vacuously green under CI**; it is the `HEAD` ↔ `HEAD^` leg that CI actually exercises, and a push
  > of N commits runs CI once at the tip. If that holds, CI catches the **tip commit of each push** and
  > leaves non-tip commits and never-pushed work uncovered. **An ADR that reads "CI closes the residual"
  > is a defect of this task**, exactly as an ADR implying full coverage already was.
  >
  > **3. The first `Re-raise only if` trigger is spent.** *"Re-raise only if CI is introduced"* **has
  > already fired** — writing it into a new ADR dated after CI landed files a dead trigger. Replace it
  > with a live one, chosen by the architect and stated with its reasoning. Candidate, not a ruling:
  > *re-raise only if the guard is made to assert over committed history.* **The second trigger — "if the
  > closed-row rule itself is revised" — is untouched by CI and stands verbatim.**
  >
  > **⛔ ONE QUESTION THIS BRIEF DOES NOT SETTLE — put it to the owner at this task's plan gate.** The
  > spent trigger claims that on CI *"the residual becomes closeable and **the range question genuinely
  > reopens**"*. **The producer filing this correction is deliberately not resolving the second half.**
  > The producer's reading, offered as input and **not as a ruling**: CI changes *when* the guard runs,
  > not *what history contains* — the permanently-red-run problem came from commit `0174` renumbering
  > eight closed rows, that commit is still in history, and a history-range guard would still be
  > permanently red. On that reading the dissolution holds and **nothing reopens**. If the architect
  > reaches the opposite conclusion, **that is an owner decision, not an ADR paragraph** — surface it
  > and stop, exactly as ⛔ *"Do not re-open the decision"* below still requires.

### ⛔ Out of scope

- **⛔ No implementation.** Do not write `test/closed-rank-immutability.test.js`, do not edit anything
  under `test/`, `claude/`, or any board. That is `0182`, and it is `fkit-coder`'s.
- **⛔ Do not re-open the decision.** The owner ruled on both open questions. A finding proposing a
  committed snapshot/manifest, or a history-range scope, is **closeout, not a new defect.**
- **⛔ Do not re-rank anything.** ADR-035 — closed rows are never renumbered, and a spawned session
  never re-ranks.
- **⛔ Do not repair the eight rows `0174` renumbered.** ADR-035 rejected reverting by name; `0183`
  corrects the record.
- **⛔ Do not write `ai-agents/wiki-vault/`** (ADR-005). If the ADR warrants an ingest, **file it as a
  follow-up** — the `0199` / `0239` shape.
- **⛔ No `:NNN` line-number citations** in this task's artifacts.
- **⛔ No commit.**

### ⚠️ The number hazard — do NOT pre-allocate 039

**Sequence this task AFTER [`0222`](../../done/0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs/brief.md),
which files ADR-038 and carries its own mandatory four-way number sweep.** `adr-037` is the highest on
disk today and `0222` has not landed, so **039 is likely and MUST NOT be assumed.**

Run the **same mandatory four-way sweep `0222` carries** before allocating: `decisions/`, `reports/`,
**the sprint boards**, and **`ai-agents/wiki-vault/` (read-only, ADR-005)**. The **ADR-029 precedent**
is the reason: a number was once claimed **everywhere except `decisions/`**, so sweeping `decisions/`
alone is exactly the check that has already failed once in this repo. Measured at filing on
2026-08-06, the strings `adr-038` / `adr-039` already appear across **17 files** — boards, briefs,
reports, and the vault — none of which is a `decisions/` file.

> ## ⚠️ DATED CORRECTION 2026-08-14 — THIS SECTION'S SPECIFIC WARNING IS SPENT. Its rule is not. Every prior byte left identical.
>
> ⚠️ **FRAMING ONLY.** ⛔ **This task's scope, intent and deliverable are unchanged** — it still records
> the baseline decision as an ADR, and ⛔ **the decision is still not re-openable here.** No scope
> change, no status change, no re-rank, no file move. Written by a spawned `fkit-producer` with no
> owner channel.
>
> **1. ⛔ *"Do NOT pre-allocate 039"* is MOOT. `039` is taken — and so are `040`–`043`.** Measured on
> disk 2026-08-14, `ai-agents/knowledge-base/decisions/` holds ADR-001 through **ADR-043**; `adr-037`
> is no longer the highest, and `adr-038` landed with `0222`. **The lowest free number today is `044`**
> — ⛔ **and that figure is a dated reading, not an allocation.** Re-derive it.
>
> ✅ **The four-way sweep this section mandates is UNCHANGED and still mandatory** — `decisions/`,
> `reports/`, the sprint boards, and `ai-agents/wiki-vault/` (read-only, ADR-005). ⚠️ **The ADR-029
> precedent behind it is if anything stronger now**: five more numbers have been claimed since the
> figure above was measured, so the *"claimed everywhere except `decisions/`"* failure has more surface
> than it did. ⛔ **Sweeping `decisions/` alone still fails verification step 2.** The `17 files`
> figure is a 2026-08-06 reading — re-measure it.
>
> **2. ✅ `0222` HAS LANDED**, at `ai-agents/tasks/done/0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs/`.
> The *"`0222` has not landed"* clause above is history. ⚠️ **Verification step 1 still applies as
> written** — state its close date and the ADR number it took; that is now a lookup rather than a wait.
>
> **3. ⛔ THE `Blocks: 0182 — soft` EDGE IN `## Notes` IS DEAD. `0182` SHIPPED.**
> `ai-agents/tasks/done/0182-build-the-closed-rank-immutability-guard/` exists and
> **`test/closed-rank-immutability.test.js` is on disk (37,782 bytes)**, implementing the ruled two-leg
> design — the `HEAD` comparison and the `HEAD` ↔ `HEAD^` leg the owner ruled *"Include it"*.
> ⭐ **The guard did not wait for this ADR.** ⚠️ **That does NOT discharge this task:** its deliverable
> is the durable, citable *record* of the decision, and `0182`'s brief carries that decision as a
> §"✅ DECIDED 2026-08-06" correction rather than as an ADR. **What is discharged is the framing that
> this task gates `0182`** — it does not, and never did after 2026-08-06.
> ⚠️ **Consequence for verification step 9, which the reader reaches later:** its *"do not edit
> `0182`'s brief"* prohibition **stands**, and its own 2026-08-06 correction already recorded that the
> follow-up landed. ⭐ **What is new here is that the guard itself now EXISTS** — so the ADR's residual
> reasoning must be derived **from the code as built**, exactly as the 2026-08-12 correction in
> `## What to build` already demands. ✅ **That instruction is now satisfiable; it was speculative when
> written.**
>
> **4. ✅ `Depends on: 0222` is DISCHARGED** — see the nested correction on that line in `## Notes`.
>
> ⛔ **Nothing else about this row changed.** `## Status` `🔲 Backlog`, `## Priority` `Unscheduled`,
> `## Sprint` `Backlog`, `## Owner` `fkit-architect` — all untouched. No board row edited, nothing
> re-ranked ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
> no mover run ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
> nothing written under `ai-agents/wiki-vault/` (ADR-005), nothing committed.

## Verification steps

1. `0222` is closed before this starts — state its close date and the ADR number it took.
2. The four-way sweep is **run and its output recorded in the worklog** before a number is allocated —
   `decisions/`, `reports/`, the sprint boards, `wiki-vault/`. Sweeping `decisions/` alone fails this
   step.
3. The allocated number is unclaimed in all four places.
4. The ADR names the rejected snapshot/manifest option and reproduces the laundering argument.
5. The ADR states the accepted residual — *a breach committed with no test run in between is never
   caught* — **in its own section, not in a footnote or a parenthetical.** Grep the file for the
   claim; if it is not findable as a standalone statement, this step fails.
6. The ADR carries a `Re-raise only if` clause containing both named triggers.
7. The ADR records **"No CI planned"** as a dated premise attributed to the owner ruling of
   2026-08-06.

   > **⚠️ DATED CORRECTION 2026-08-12 — THIS STEP AS WRITTEN NOW FAILS THE TASK. Left byte-identical.**
   > An ADR that records *"No CI planned"* as a **live** premise records a dead ruling permanently.
   > **What this step now requires instead:**
   > - The ADR records the CI position as **dated history**: *"No CI planned"* (owner, 2026-08-06),
   >   **reversed by the owner 2026-08-08, confirmed 2026-08-12, CI landed 2026-08-12 with `0256`.**
   > - The ADR **nowhere asserts that no CI exists**, and **nowhere asserts CI is proven working** —
   >   `.github/workflows/test.yml` has never run (see the master correction in `## Context`).
   > - The ADR states where the residual now stands **with CI in the picture**, and does **not** claim
   >   CI closes it.
   > - The `Re-raise only if` clause carries **two live triggers**; *"if CI is introduced"* is spent and
   >   must not be one of them.
   >
   > Grep check: the ADR must contain **no undated, present-tense claim that this project has no CI.**
8. `git diff --stat` shows **one new file under `ai-agents/knowledge-base/decisions/`** plus, at most,
   board/brief rows the producer adds. **Nothing under `test/`, `claude/`, or `ai-agents/wiki-vault/`.**
9. `0182`'s blocking status is addressed in the close report: state explicitly that the blocking
   decision is **dissolved, not answered**, and that `0182`'s brief still records the old blocked
   framing. **Do not edit `0182`'s brief** — hand that to the producer as a follow-up.

   > **⚠️ DATED CORRECTION 2026-08-06 — the follow-up has ALREADY been done. Step above left
   > byte-identical.** A spawned producer applied the architect's decision and all twelve of its
   > corrections into `0182`'s brief the same day, as
   > [`0182`](../../done/0182-build-the-closed-rank-immutability-guard/brief.md) §"✅ DECIDED 2026-08-06".
   > **`0182` no longer records the old blocked framing** — its original text is preserved
   > byte-identical beneath a dated correction that governs.
   > **What this step now requires:** still state in the close report that the block is **dissolved,
   > not answered** — that claim is unchanged and still load-bearing. **Drop only the *"still records
   > the old blocked framing"* half, and check the brief first rather than asserting either way from
   > this line.** ⛔ **The prohibition stands: this task still does NOT edit `0182`'s brief.**

## Notes

- **Depends on:** `0222` — hard, for the ADR number only. `0222` files ADR-038 and runs the number
  sweep; allocating before it lands risks a collision that is permanent once anything links to it.
  **The decision itself does not depend on `0222` in any way** — the two ADRs are unrelated in subject.
  - ✅ **DATED CORRECTION 2026-08-14 — THIS DEPENDENCY IS DISCHARGED. The line above is left
    byte-identical and is no longer binding.** `0222` closed; its folder is
    `ai-agents/tasks/done/0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs/`
    and **ADR-038 is on disk**. **Current dependency: nothing.** ⚠️ **What survives is the *reason*,
    not the wait:** the four-way number sweep is still mandatory before allocating (verification step
    2), and `039`–`043` are now all taken — see the dated correction at §"The number hazard".
    ⛔ **This does not make the row `🔄 In progress`; it makes it runnable.**
- **Blocks:** `0182` — soft. `0182` is currently recorded as blocked on this baseline decision, and this
  ADR is what discharges that block. It is soft rather than hard because the ruling already exists in
  the session record; the ADR is what makes it durable and citable.
  - ⛔ **DATED CORRECTION 2026-08-14 — THIS EDGE IS DEAD. `0182` SHIPPED. The line above is left
    byte-identical.** `ai-agents/tasks/done/0182-build-the-closed-rank-immutability-guard/` exists and
    **`test/closed-rank-immutability.test.js` is on disk**, implementing the ruled two-leg design.
    ⭐ **`0182` was never actually held by this row** — the owner's 2026-08-06 rulings were applied
    straight into `0182`'s brief as its §"✅ DECIDED 2026-08-06" correction, and it built from that.
    **Current: this task blocks nothing.**
    ⚠️ **It does NOT follow that this task is discharged.** Its deliverable is the **durable, citable
    record** of a decision that today lives only inside a closed task's brief and a session log.
    ⭐ **What changes is the value proposition, and the plan should say so plainly:** the ADR is no
    longer an unblock, it is a record — ⛔ **and a run that writes it up as unblocking `0182` is
    reporting something that stopped being true on 2026-08-06.**
- ⚠️ **Overlap with [`0306`](../../done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/brief.md),
  stated so the work is not done twice.** `0306`'s Step 4 names `0240` as one of five rows owing a
  discharged-dependency correction, **including the dead `Blocks: 0182` edge**. ✅ **Both are now
  appended, above, in `0306`'s own prescribed form** — nested bullets, originals byte-identical, the
  canonical flush-`**` `- **Depends on:**` line untouched so `dashboard.sh` still parses it.
  ⛔ **`0306`'s run must NOT append a second pair here** — it should verify these and record `0240` as
  already-correct, the way it already treats `0224`, `0225`, `0229` and `0271`.
- **Related, not blocking:** `0181` (narrows the re-rank exception — the rule `0182` enforces), `0183`
  (corrects the two live records that claimed no closed row was renumbered), ADR-035 (whose
  §"Left undone, deliberately" this ADR closes).
- **⚠️ `0182`'s brief carries a separate, already-flagged defect that this task does NOT fix:** its
  guard glob `ai-agents/sprints/sprint-*.md` no longer reaches the archived Sprint 2 board at
  `sprints/done/sprint-2.md` — the exact history it exists to protect. A separate unit is queued for
  that. **Do not fold it in here, and do not build `0182` against the current glob.**
  - **⚠️ DATED CORRECTION 2026-08-06 — the glob defect is REPAIRED. Text above left byte-identical.**
    The *"separate unit queued"* landed the same day: `0182`'s §"✅ DECIDED 2026-08-06" **correction 4**
    globs **both** `ai-agents/sprints/sprint-*.md` **and** `ai-agents/sprints/done/sprint-*.md` and
    **excludes `backlog.md` with a stated reason**. ⛔ **Both prohibitions still stand** — do not fold
    it in here, and build `0182` only against its corrected specification, never against its
    §"The condition" glob.
- **⚠️ AMENDED 2026-08-12 — the `No CI planned` premise is dead; three corrections filed in-place.**
  For a reader working bottom-up: `0256` landed CI (`.github/workflows/test.yml`) and an in-release
  `npm test` gate (`bin/release.mjs`) on **2026-08-12**, reversing the owner's 2026-08-06 ruling. The
  owner took the reversal themselves (2026-08-08; confirmed 2026-08-12, verbatim **"Approve — both gate
  and CI (Recommended)"**) and ordered this amendment (verbatim **"Spawn a producer to amend 0240
  now (Recommended)"**, 2026-08-12). Corrections sit at: the Authority list in `## Context` (master),
  the `Re-raise only if` bullets in `## What to build`, and verification step 7. **The ADR's decision is
  unchanged; only its premise, its residual reasoning and one re-raise trigger move.** ⛔ CI has never
  run — do not write that it works. **One open question is deliberately left for the owner at this
  task's plan gate** — whether the range question reopens; see the correction in `## What to build`.
- **Priority is `—` (unscheduled).** Filed to the Backlog board on the owner's rulings; no sprint was
  named and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5). **Sequencing after `0222` is a
  dependency, not a rank** — `0222` sits on Sprint 3 at `P3` and this row is unscheduled, so nothing
  here asserts a position on any ranked board.
