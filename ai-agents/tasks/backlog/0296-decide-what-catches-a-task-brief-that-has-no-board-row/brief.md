# Decide what catches a task brief that has no board row — mechanism open, including "nothing changes"

## ID
0296

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**The gap, stated exactly.** Nothing in this repo catches *"a task brief exists on disk with no row on
any board."* A task in that state is invisible to `/fkit-status`, invisible to
`.claude/skills/fkit-status/dashboard.sh`, and invisible to a producer sweeping the backlog — because
every one of those reads **boards**, and a brief with no row is not on a board. The brief exists; the
task does not appear anywhere. `dashboard.sh` is a *pure function of the sprint plan and the briefs the
plan links* (its own contract comment, `claude/skills/fkit-status/dashboard.sh:24-27`) — a brief the
plan does not link is outside its input, by construction, not by oversight.

**⚠️ The `/fkit-task-brief` skill already requires the row.** Step 8 of
`claude/skills/fkit-task-brief/SKILL.md` is titled *"Update the board — every brief gets a row,
always"*. So the rule is written and unambiguous. What is missing is **anything that notices when the
step is skipped**. This task is about the enforcement, not the rule.

### The three specimens — measured, not asserted

A sweep on **2026-08-14** resolved **every** task folder id under `ai-agents/tasks/{backlog,done,cancelled}/`
against **every** board file (`ai-agents/sprints/*.md` plus `ai-agents/sprints/done/*.md`), in both
directions. Measured before this brief was filed: **295 task folders** (102 backlog, 182 done, 11
cancelled); **297** once this brief and its sibling landed.

⚠️ **THE ORIGINAL SWEEP UNDERCOUNTED. It reported TWO specimens; the correct answer is THREE.** The
loose form of the check — *"does this id appear anywhere in a board file?"* — counts a **prose citation
inside another row's description** as though it were a board row. Tightening the match to **a table
row's final Brief cell** surfaced a third specimen the loose form had masked. Both forms and both
counts are given in `## Verification steps`, because **the discrepancy is itself the strongest evidence
this task has.**

**Specimen 1 — `0295`, a fresh filing that skipped the append. ⚠️ ALREADY REPAIRED.**
[`0295`](../../done/0295-correct-the-false-0254-review-attribution-and-the-unconditional-exit-2-claim/brief.md)
was filed 2026-08-13 and **no board row was created**, so it was invisible for a full day. The row was
appended 2026-08-14 and now sits on `ai-agents/sprints/backlog.md` as the `0295` row, which carries the dated
registration note recording the whole episode — **that row is the durable carrier of this specimen**;
the task has since closed. ⛔ **Do not re-repair it and do not edit that row.** How it happened is on the
record: the producer that filed it reported its change surface as *"exactly one new file: the brief
above. Nothing else"*, and the lead relayed that report as *"filed"* without checking a board.

**Specimen 2 — `0014`, an old task, a different signature. ⚠️ STILL OPEN AS OF 2026-08-14.**
[`0014-align-conventions-readme-enforcement-item-live-vs-scaffold`](../../done/0014-align-conventions-readme-enforcement-item-live-vs-scaffold/brief.md)
sits in `ai-agents/tasks/done/` and has **no board row anywhere**. Measured 2026-08-14:
`grep -rn '0014' ai-agents/sprints/` returns **zero hits** — the bare string does not appear in that
tree at all. Its slug appears **once**, at `ai-agents/sprints/done/sprint-2.md:2447`, and that
occurrence is **prose inside a sentence, not a table row**. The reverse direction is clean — **every**
board href pointing into `ai-agents/tasks/` resolves to a file that exists.

**Specimen 3 — `0004`, found only by the tightened check. ⚠️ MISSED BY THE ORIGINAL SWEEP, STILL OPEN.**
[`0004-add-e2e-smoke-script-for-fkit-itself`](../../cancelled/0004-add-e2e-smoke-script-for-fkit-itself/brief.md)
sits in `ai-agents/tasks/cancelled/` (`⛔ Cancelled (2026-07-14) — superseded by Sprint 2 task 23`) and
has **no board row anywhere**. Its **only** appearance in `ai-agents/sprints/` is a **prose citation** at
`ai-agents/sprints/done/sprint-2.md:2875`, inside a sentence describing it as *"already-unsprinted"*.
⚠️ **That citation is exactly why the loose sweep declared it registered.** Same signature as `0014`:
an old, unsprinted task (`## Sprint: Backlog (unsprinted)`) that reached a terminal state without ever
having a row.

**Measured with the tightened check, 2026-08-14: `total=297 no-row=2` — `0014` and `0004`.**

**⚠️ `0014` carries a SECOND, separate anomaly, and it is NOT this task's.** Its folder is under
`done/` while its own brief reads `## Status: 🔲 Backlog` and `## Sprint: Backlog (unsprinted)` —
verified 2026-08-14. **That mismatch is already owned by
[`0134`](../0134-decide-the-sanctioned-repair-path-for-a-half-landed-close/brief.md)** — *"Decide the
sanctioned repair path for a half-landed close — ADR, then the reconcile mode"*.
⛔ **Do not duplicate `0134`, and do not repair `0014`'s status or move its folder here.**
**This task owns the MISSING ROW. `0134` owns the STATUS/FOLDER DISAGREEMENT.** They meet on one task
folder and nowhere else.

### ⚠️ Separate slips, or one under-enforced step? — that is the question, not the premise

The producer that ran the original sweep **explicitly declined to call these one pattern**, and that
judgement is recorded here rather than overwritten: `0295` is a **fresh filing that skipped an append**;
`0014` is an **old task with a different failure signature** — old enough that the board conventions of
its era are not today's. **`0004` lands on `0014`'s side of that split**, not `0295`'s: both are old,
both unsprinted, both reached a terminal state without a row, and both are visible in the sprint record
only as prose. ⚠️ **That the two old ones now outnumber the fresh one is evidence for the split, not
against it** — and it cuts **both** ways, because two of three specimens belong to a convention era
that has already passed. **Whether three specimens in 297 folders are one under-enforced step or two
separate failure modes is exactly what this task decides.** ⛔ Do not open with the assumption that a
mechanism is warranted.

## What to build

**The deliverable is a decision first, and a mechanism only if the decision calls for one.**
⛔ **The shape is deliberately NOT pre-decided.** Weigh the candidates below on their merits, recommend
one, and put it to the owner.

### Candidate mechanisms — none preferred, all real

1. **A `dashboard.sh` check.** It already derives per-task facts and already renders drift lines, so it
   is the natural host for another per-task fact. ⚠️ **Weigh the contract cost honestly:** its stated
   contract is a pure function of *the plan and the briefs the plan links*
   (`claude/skills/fkit-status/dashboard.sh:24-27`), and a brief with no row is **by definition outside
   that input**. Hosting this check there requires **widening the contract to read the task tree** —
   which is a real change, not a free addition. Precedent exists that such a widening is possible under
   an owner ruling (the sibling-first-line read, ADR-041 §1.5), and that it was treated as a decision,
   not a detail.
2. **A `node --test` contract-suite assertion.** The suite already walks `ai-agents/` trees —
   `test/task-id-uniqueness.test.js` and `test/dashboard-contract.test.js` are the closest neighbours.
   This costs `dashboard.sh` nothing and fails loudly in CI, but catches the slip **at test time, not
   at filing time** — so a brief can still be invisible for as long as nobody runs the suite.
3. **A producer-procedure step at filing time.** `/fkit-task-brief` step 8 already *requires* the row;
   this would add a **verify-what-you-just-wrote** step so the producer proves the row exists before
   reporting. Cheapest to write, catches it earliest — and is exactly the class of instruction that
   `0295` shows can be skipped without anything noticing.
4. **⚠️ "Nothing changes" — a REAL candidate, not a straw man.** Three specimens in 297 folders — one
   already repaired, and the other two products of a convention era that has since passed — may not
   justify a mechanism at all. ⛔ **Record it with the same seriousness as the other three**, and if it
   wins, say so plainly and close the task on that finding. ⚠️ **Weigh it against the counter-evidence
   honestly**: the count went from two to three the moment the check was tightened, so *"only two, it's
   rare"* was never a measurement — it was an artefact of a loose pattern.

### Required content of the decision

- **A recommendation with its main trade-off**, not a menu.
- **The `0295` vs `0014`/`0004` split judged, not assumed** — state whether they are one pattern or
  two, and what evidence decided it.
- **If a mechanism is recommended:** name its host file, what it reads, what it prints, and what it
  exits.
- **If the recommendation is an ADR-sized change** (widening `dashboard.sh`'s contract is), say so —
  `/fkit-record-decision` is the route.

### ⚠️ Record the second-order lesson — but do NOT scope it here

`0295` was invisible for a day **because a change-surface report was taken on trust.** The producer said
what it had written; nobody read a board to check. Whether *that* — an unverified change-surface report
crossing an agent boundary — wants a mechanism of its own is worth naming in this brief's findings.
⛔ **Do not scope it in this task.** Name it, and let the owner decide whether it becomes its own brief.

## Verification steps

⚠️ **Every command below is runnable as written, from the repo root, and was run 2026-08-14 to produce
the figures in `## Context`.**

1. **The forward sweep — every task folder resolved against every board file.** ⚠️ Run it in **bash**,
   and read traps 1–3 in step 3 before trusting any number it prints.

   **⛔ The LOOSE form below is the WRONG check. It is written here only because reproducing its
   undercount is part of the evidence:**

   ```sh
   # ⛔ WRONG — counts a prose citation as a board row.
   missing=0; total=0
   for d in ai-agents/tasks/backlog/*/ ai-agents/tasks/done/*/ ai-agents/tasks/cancelled/*/; do
     id=$(basename "$d" | cut -c1-4); total=$((total+1))
     grep -qE "tasks/(backlog|done|cancelled)/${id}-" \
       ai-agents/sprints/*.md ai-agents/sprints/done/*.md \
       || { echo "NO-ROW: $(basename "$d")"; missing=$((missing+1)); }
   done
   echo "total=$total no-row=$missing"
   ```

   **✅ The CORRECT form matches only a table row's final `Brief` cell:**

   ```sh
   missing=0; total=0
   for d in ai-agents/tasks/backlog/*/ ai-agents/tasks/done/*/ ai-agents/tasks/cancelled/*/; do
     id=$(basename "$d" | cut -c1-4); total=$((total+1))
     grep -qE "^\|.*tasks/(backlog|done|cancelled)/${id}-[^)]*/brief\.md\) \|[[:space:]]*$" \
       ai-agents/sprints/*.md ai-agents/sprints/done/*.md \
       || { echo "NO-ROW: $(basename "$d")"; missing=$((missing+1)); }
   done
   echo "total=$total no-row=$missing"
   ```

   **Measured 2026-08-14, immediately after this brief and its sibling were filed:**
   **loose form → `total=297 no-row=0`; tight form → `total=297 no-row=2` (`0014`, `0004`).**
   ⚠️ **The loose form reports a perfectly clean board while two tasks have no row.** A run that
   reports different counts must explain the difference before anything is built on it.

   ⚠️ **Neither form is offered as the finished mechanism.** The tight form is a `grep` that assumes the
   `Brief` cell is last on the line; a board row wrapped differently, or a future column added after
   `Brief`, would silently drop out of its match. **Whatever ships must parse the row, not pattern-match
   the line** — or must state that limitation out loud.

2. **The reverse sweep — every board href resolves to a folder that exists.**

   ```sh
   for b in ai-agents/sprints/backlog.md ai-agents/sprints/sprint-5.md ai-agents/sprints/done/sprint-*.md; do
     dir=$(dirname "$b")
     grep -oE '\]\(\.\.?/[^)]*tasks/[^)]*brief\.md\)' "$b" | sed 's/^](//; s/)$//' | sort -u \
     | while read -r href; do [ -f "$dir/$href" ] || echo "DEAD: $b -> $href"; done
   done
   ```

   **Measured 2026-08-14: no output — every href resolves.**

3. **⚠️ PROVE THE CHECK AGAINST A KNOWN-GOOD AND A KNOWN-BAD CASE. This step is mandatory, and it is
   here because all three traps below were hit for real on 2026-08-14, in this task's own filing run.**

   - **Trap 1 — a pattern that matches prose it did not mean.** A bare
     `grep -c 'UNPARSEABLE' ai-agents/sprints/backlog.md` returns **`2`**, and **both are false
     positives**: the string is literal descriptive text inside
     [`0149`](../0149-record-that-0118s-block-on-0117-was-discharged-by-another-route/brief.md)'s row
     (`backlog.md:104`) and
     [`0294`](../../done/0294-archive-sprint-5-move-the-plan-into-sprints-done-and-repoint-every-link/brief.md)'s
     row (`backlog.md:211`). **A check whose pattern matches prose it did not mean is a check that
     reports phantoms.**
   - **Trap 2 — a sweep that reports EVERYTHING as broken.** The first run of step 1 on 2026-08-14
     reported **295 of 295** folders as row-less. The cause was **shell**, not data: the board file list
     was held in a variable and passed unquoted to `grep`, and **zsh does not word-split an unquoted
     variable**, so `grep` received one bogus multi-line filename, errored with exit `2`, and the
     `! grep -q` test read every error as *"no match"*. **A check that cannot distinguish "no match"
     from "I failed to run" reports a catastrophe that does not exist.** Whatever is built must fail
     **loudly on error**, never silently into the not-found branch.
   - **⚠️ Trap 3 — the FALSE NEGATIVE, and the one that actually cost a specimen.** Trap 1 produces
     phantoms; this one **hides real findings**, which is strictly worse because nothing looks wrong.
     A prose citation of a task inside **another** row's description satisfies the loose *"does this id
     appear on a board?"* test. That is how **`0004` was missed entirely** — its only appearance is a
     sentence at `ai-agents/sprints/done/sprint-2.md:2875`. ⚠️ **It was demonstrated live during this
     brief's own filing:** the moment this brief cited `0014`, the loose sweep stopped reporting `0014`
     too, and went from `no-row=1` to `no-row=0` — **the act of writing about the gap concealed it.**
     ⛔ **A check that a brief can silence by mentioning a task is not a check.**
   - **The proof required:** run the check against the tree as it stands (**known-good: exactly two
     findings, `0014` and `0004`**), **and** against a deliberately row-less scratch brief (**known-bad:
     exactly three findings**), **and** against a scratch brief that is *cited in prose but has no row*
     (**still a finding — this is the trap-3 case, and skipping it is how trap 3 survives**).
     ⛔ Do not create those scratch briefs inside `ai-agents/tasks/` — build them in a temp tree or a
     fixture directory, and remove them.

4. **If a mechanism lands, it must be run and its output pasted into the close** — not described.
5. **If the recommendation is "nothing changes"**, the close states that, names the evidence, and
   ⛔ leaves `0014`'s and `0004`'s missing rows to the owner's next call rather than repairing them
   silently.

## Notes

- **📌 DATED NOTE 2026-08-15 (`0306`) — the quoted *"Sprint 2 task 23"* in Specimen 3 means `0006`,
  and the quotation is DELIBERATELY LEFT byte-identical.** `0306` swept stale pre-ADR-029 task
  numerals out of the open briefs. That string is a **verbatim quotation of `0004`'s frozen
  cancellation reason** (`⛔ Cancelled (2026-07-14) — superseded by Sprint 2 task 23`), so it is never
  edited to make it accurate — the key goes beside it:
  - **`task 23` = `ai-agents/tasks/done/0006-add-launcher-contract-smoke-script/`** (pre-migration
    `task NN` is the brief's old `## Priority` value; `0006` carries Priority 23, and its H1 is
    *"Add the launcher-contract test suite"* — the thing that superseded `0004`'s e2e smoke script).
  - ⛔ **It is NOT `0023-converge-ai-agents-additively-on-launch`**, which the bare numeral lands on
    by coincidence.
- **📌 DATED NOTE 2026-08-15 (`0306`) — the reverse-sweep loop in §"What to build" carries a DEAD
  PATH, and it is DELIBERATELY LEFT byte-identical.** `0306` swept dead board paths out of the open
  briefs and stopped at this one. Owner ruling, verbatim option label:
  **"Leave it, dated note beside (Recommended)"** — `AskUserQuestion`, live `fkit lead` session
  driving `/fkit-sprint-ship-loop`.
  - **The dead term:** `ai-agents/sprints/sprint-5.md`, in
    `for b in ai-agents/sprints/backlog.md ai-agents/sprints/sprint-5.md ai-agents/sprints/done/sprint-*.md`.
    Sprint 5 was archived to `ai-agents/sprints/done/sprint-5.md` after this brief was written.
  - ⭐ **The loop still scans every board the author meant to scan** — the `done/sprint-*.md` glob in
    the same loop **already matches `done/sprint-5.md`**, so no board is missed and no false `DEAD:`
    line is produced (the resolution test is `[ -f ]`, which is never reached for the dead term).
  - ⚠️ **But the dead term is NOT silent, and an earlier version of this note wrongly said it
    "simply contributes nothing"** — corrected 2026-08-15 (`0306` review round 1, R2). Running the
    loop, `grep` on the missing file **warns on stderr and exits `2`**; that `2` is then **discarded**,
    because it is not the last command in the pipeline. **This brief's own Trap 2 (§"What to build",
    step 3) is exactly that shape** — *"`grep` … errored with exit `2`, and the `! grep -q` test read
    every error as 'no match'"*. It does not corrupt the result **here**, but a runner sees a warning
    that looks like a failed sweep, and whoever ships the mechanism must fail **loudly on error**
    rather than inherit this pattern.
  - ⛔ **That is exactly why it was not "repaired":** re-pointing the term would make the loop scan
    `done/sprint-5.md` **twice**, and deleting the term is a semantic edit to someone else's
    verification command. **`0296`'s call, not a sweep's.**
  - ⚠️ **`ai-agents/sprints/sprint-6.md` is missing from the loop entirely** — it did not exist when
    this was written. Whoever ships the mechanism must add it, or the reverse sweep will not cover the
    active board.
- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** a backlog sweep run 2026-08-14 in a `fkit lead` session, which resolved all 295 task
  folders against all six board files. **Owner ruling 2026-08-14, verbatim option label:
  *"File one task for the mechanism"*.** Filed by a spawned `fkit-producer` with no owner channel.
- **⚠️ THE OWNER RULED ON A TWO-SPECIMEN PICTURE; THE FILING RUN MEASURED THREE.** The ruling
  *"File one task for the mechanism"* was given against `0295` + `0014`. Re-deriving from disk at filing
  time surfaced **`0004`** as a third, found only once the check was tightened to match a table row
  rather than any occurrence. ⛔ **This does not change what was ruled — one task, mechanism open — and
  the filing did not expand scope on its own authority.** It is recorded here because the owner should
  know the evidence base grew, and because *"only two specimens"* was one of the stated reasons the
  *"nothing changes"* candidate is live.
- **⚠️ Relationship to [`0134`](../0134-decide-the-sanctioned-repair-path-for-a-half-landed-close/brief.md),
  stated so nobody merges them:** both touch `0014`. `0134` owns the **status/folder disagreement** (a
  brief reading `🔲 Backlog` inside `done/`); **this task owns the missing board row.** Neither is the
  other's blocker — `0014` can gain a row without its status being resolved, and vice versa.
  ⚠️ **`0004` carries no such second anomaly** — its folder (`cancelled/`) and its `## Status`
  (`⛔ Cancelled (2026-07-14)`) agree, so `0134` does **not** touch it. Its only defect is the missing row.
- **⛔ Scope excludes repairing `0014` and `0004`.** Whether the missing rows are backfilled — and onto
  which board, given both tasks are closed and `sprint-2.md` is archived — is a **consequence** of this
  decision, not an input to it. A repair before the decision pre-empts the *"nothing changes"* candidate
  by destroying the only two live specimens.
- ⛔ **Do not edit the `0295` row on `ai-agents/sprints/backlog.md`** or any other existing row. The
  dated registration note there is evidence. ⚠️ **Line 212 was the number at filing time**; two rows
  were appended after it in the same run, so **locate the row by its `0295` href, not by line number.**
- **⛔ No mover** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
  — the close goes through `/fkit-task-done`, producer-only, carrying the
  `(agent-closed — not owner-verified)` marker if the owner is absent), **⛔ no re-rank**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  **⛔ no commit.**
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`. **Unranked** —
  the backlog is unranked by design, and a spawned producer with no owner channel ranks nothing.
