# Worklog — 0202

**Task:** write `plan.md` at plan approval in `/fkit-sprint-ship-loop`, and add the artifact table it
lacked. **Driven by:** `fkit-sprint-ship-loop` Build worker (spawned `@fkit-coder`), under the
declared-approval marker. **Date:** 2026-08-03.

## How `plan.md` came to exist for this task

⚠️ **Recorded because it is the exact defect this task repairs, biting once more on the task that repairs
it.** At the moment I was spawned, `<task-folder>/plan.md` did not exist — the sprint loop does not write
it until Build. So the driver could carry the **paste only**, not the path + `git hash-object` pointer
that `0162`'s ruling calls for. The driver disclosed this in the spawn prompt rather than papering over
it. I wrote `plan.md` as a **verbatim copy of the pasted approved text**, on an explicit
outside-the-approved-plan instruction from the driver that relayed the owner's 2026-08-02 OQ-1 ruling
(a faithful carry is a copy operation, never a recall) — permitted under ADR-037. I did **not** author my
own rendering of the plan; that is the `R4b` failure (`0162/plan.md`, blob `2458a57e`) and reproducing it
here would have been absurd.

**Residual, unchanged by that care:** the copy still originates in **context**, not file→file. Nobody can
verify it against a durable artifact, because none existed. Once this change is live the same task run
under the new text would have had one.

## Coordinate re-verification (nothing inherited)

Every coordinate in the approved plan re-measured this turn and **confirmed**: `plan.md` sole hit at
`:103`; `grep -i artifact` zero hits; Plan row `:102`; Rules heading `:109`; sibling artifact table
`:102-104` with `<task-folder>` at `:106`; sibling step 4 at `:142-143`; `R4b` blob
`2458a57eda55ca774884110e76dee1bf91b6d6e0`, 9625 B; `EXPECTED_SKILLS = 25` at
`test/skill-frontmatter.test.js:574` against 25 skill dirs.

**One correction to the approved plan, stated rather than inherited:** §7 cites the `fkit-stateful-review`
ledger-key rules as `SKILL.md:33-40`. The block actually runs `:31-40` (the numbered rules are `:34-40`).
Immaterial to the edit; the shipped text cites the rule by name, not by line, so it cannot go stale.

## What changed

One file — `claude/skills/fkit-sprint-ship-loop/SKILL.md`, four sites:

1. **Plan row gate cell** — the driver writes `<task-folder>/plan.md` verbatim on approval, **before**
   spawning Build.
2. **Build row** — no longer claims the worker writes `plan.md`; carries the negative instead
   (*"`plan.md` already exists — the driver wrote it at approval; never re-author it"*), per the owner's
   **OQ-2** ruling, which puts the anti-`R4b` instruction at the site where `R4b` happened.
3. **Note below the step table** — why the driver writes it, and the closes/does-not-close statement.
4. **New `## Durable artifacts` section** — the table the loop lacked entirely.

## ⛔ What this closes, and what it does NOT

- **Closes: the reconstruction route.** Writing `plan.md` from the approved text at approval, before any
  worker is spawned, means **no worker is ever asked to reconstruct the plan.** That is the route `R4b`
  took.
- **Does NOT close: the `carried-not-approved` class.** A hash pins *which bytes were carried*, not
  *which were approved*. A driver that persists a plan the owner never approved, carries it faithfully
  and hashes it correctly still verifies green over bytes the owner never saw. **Structural, not
  provisional** — approval is granted in a session channel that leaves no artifact (ADR-021). An
  **accepted residual** with a re-raise condition in `0162`'s review ledger. The driver doing the copy
  **narrows** the transcription hazard (one copy, no spawn boundary); it relocates it, it does not remove
  it.

## ⚠️ Mid-flight: what a resuming driver should do

This edits `/fkit-sprint-ship-loop` while that loop is driving Sprint 2. **Checked, not assumed:**
`.claude/skills/` is gitignored and re-copied from `claude/` by `fkit-claude-init.sh` on **every** `fkit`
launch, and a running session loaded its copy at start — so **this change reaches no session until the
next launch**, and the in-flight run finishes on the old text. I did **not** run `fkit-claude-init.sh`.

A driver that resumes after this lands may find **no `plan.md`** where the new table says one exists:

- **It must NOT back-fill it from context.** That is `R4b` — authoring a rendering of a plan approved
  earlier, and then treating it as the approved bytes.
- **Pre-Build** → return to the plan gate; re-present and re-approve, then write `plan.md` from that
  approval.
- **Past Build** → treat the run as **degraded** and put the close to the owner, flagging that no
  approved-plan artifact backs the autonomy boundary for that task.

## Decision log — autonomously-applied fixes and obvious-winner calls

**`none`.** No review had run at Build time, so no finding was answered and no fix was applied
unattended. Every judgment call in this task (the `review.md` row's wording, the Build row's negative
parenthetical, rank, `0164` ordering) was returned to the owner as OQ-1…OQ-4 **before** I was spawned,
and I implemented their rulings — I settled none of them myself. Recorded explicitly per ADR-032 A2 /
ADR-019 `:96`, so an empty log is distinguishable from a forgotten one.

## Decision log — Process-review, review round 1 (2026-08-03)

Spawned `@fkit-coder` running `fkit-process-stateful-review` under the declared-approval marker. **Three
fixes applied without a per-fix stop** — all three are single-cell text corrections the owner had already
ruled on (dispositions 2 and 3, relayed with the spawn), each verified `CORRECT` against the code first,
each mechanical, localized to one table row, and inside the approved plan's own §1(d) artifact table.

1. **R3 — `worklog.md` row "Written by" cell** (`SKILL.md:81`). Changed *"the **Build** worker, grown by
   Verify + Process-review"* → *"the **Build** worker, grown by Process-review"*. **Why it qualified:**
   verified `CORRECT` — `:122` (Verify) instructs no write; only `:121` and `:124` do. One cell, no
   behavior change, inside the approved table. Owner disposition 3 ("fix in place").
2. **R4 — same cell, dangling pointer** (`SKILL.md:81`). Changed *"what the close-out packet §5
   surfaces"* → *"what the close-out packet surfaces per task (*Progress reporting*, §5.5)"*. **Why it
   qualified:** verified `CORRECT` — this file's §5 is *Advance* (`:236`); the packet is surfaced at
   `:266-268`. One cell, inside the approved table. Owner disposition 3.
3. **R2 — `review.md` row ⚠️** (`SKILL.md:82`). Rewrote to name **rule 2** as governing, keep rule 3 as
   the *neither-resolves* case, and shorten ~75 → ~55 words. **Why it qualified:** verified `CORRECT`
   against `fkit-stateful-review/SKILL.md:36`; one cell; the wording is the owner's explicit disposition 2,
   which also instructed me to verify the rule list myself before writing.

**One obvious-winner call, inside that intent, recorded because it goes beyond the disposition's letter.**
The disposition's framing implies rule 2 simply resolves. Checking it, I found rule 2 can be **ambiguous**
mid-run: the loop never commits, so after the first task ships, several task folders carry uncommitted
`plan.md`/`worklog.md`, and an unambiguous folder-name match is not guaranteed → **rule 4** (stop and ask),
still never rule 3's branch fallback. I wrote the accurate version rather than the flat *"always resolves"*.
**Why it qualified as an obvious winner and not a stop:** writing a fresh inaccuracy into a table whose
entire purpose is accuracy is exactly the defect R2 penalized, and the nuance strengthens the same
conclusion the disposition reached (pass the task-id). It is visible in the shipped cell and in the ledger,
so a wrong call here is findable.

**Applied nothing for R1, R5, R6** — the owner ruled those to follow-ups. `plan.md` was deliberately **not**
edited to repair the R6 coordinate error: it is the verbatim approved-plan artifact, and editing it would
corrupt the bytes it exists to preserve.

## Verification

Recorded in the Build worker's return. In short: the brief's 8 steps walked; change surface proved one
file by `git status` + `git diff --stat`; `node --test test/skill-frontmatter.test.js` and `npm test`
green. **Green here is a regression guard, not evidence the change works** — nothing in this repo tests a
skill **body**; `skill-frontmatter.test.js` reads frontmatter only, and no byte budget applies. The real
evidence is the grep/read walk of the brief's steps.

---

## Dated correction — 2026-08-03 (producer, follow-up 3 of this task's review)

**Correcting a claim in this worklog, by note. Nothing above is rewritten.**

`plan.md` in this folder carries a coordinate error, recorded as review finding **`R6`** (verdict
**CORRECT**, owner-dispositioned `deferred → follow-up (owner ruling)`):

- `plan.md:13` states *"Artifact table header `:101`"* for
  `claude/skills/fkit-task-ship-loop/SKILL.md`.
- `plan.md:15` builds on that to state *"**Brief's citations check out**, except `:100-104` for the table
  (header is `:101`)"* — i.e. it declares the brief's `:100-104` wrong.

**Both are wrong, and the brief was right.** Re-verified first-hand 2026-08-03 against
`claude/skills/fkit-task-ship-loop/SKILL.md` (**byte-unchanged by this task**):

| Line | Content |
|---|---|
| `:100` | `| File | Written by the loop | Holds |` — **the header row** |
| `:101` | `|---|---|---|` — the separator |
| `:102` | the `<task-folder>/plan.md` row |
| `:103` | the `<task-folder>/worklog.md` row |
| `:104` | the `<task-folder>/review.md` row |

So the header is **`:100`**, the table spans **`:100-104`**, and the brief's citation was correct.
`plan.md` "corrected" a correct citation into an error.

### ⛔ Why this is a note and not an edit

**`plan.md` is the verbatim approved-plan artifact.** Editing it to repair the coordinate would corrupt
the exact bytes it exists to preserve — which is the whole point of writing it at plan approval, and the
failure (`R4b`) this task shipped to close. **The error stays in `plan.md`. This note is the repair.**

### ⚠️ A claim in this worklog is therefore only PARTIALLY true — stated plainly

The **Coordinate re-verification** section above opens: *"Every coordinate in the approved plan re-measured
this turn and **confirmed**"*. **That was partially true, not clean.** The artifact-table header coordinate
was **not** correctly re-measured — it was re-measured to a wrong value, and that wrong value was then used
to declare a correct citation stale. The section's own *"One correction to the approved plan"* paragraph
(the `:33-40` → `:31-40` ledger-key note) is **not** this; it is a separate, unrelated correction and it
stands.

**The shipped deliverable is unaffected** — `claude/skills/fkit-sprint-ship-loop/SKILL.md` cites no line
number at this site.

**Filed by:** a spawned producer with no owner channel, as part of closing this task.
