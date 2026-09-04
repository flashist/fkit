# Worklog — 0357, Sweep B: the single-site correction notes

**Worker:** `fkit-coder`, spawned **Build worker** under `/fkit-sprint-ship-loop`.
**Authority:** the approved `plan.md` in this folder (owner-approved 2026-09-04, verbatim option label
**"Approve as written (Rec)"**), plus rulings **L1–L6** in its appendix.
**No owner channel** (ADR-021) — every judgment call is surfaced to the driver, not decided here.

⛔ **Citation form, binding on every line of this file.** The plan's §2.3 rule is adopted in its
stricter reading: **no `token:digits` anywhere** — not for coordination documents, not for ADRs, not
for source files, not inside backticks. Sites are recorded as **file · heading · quoted fragment**.
Where a number is genuinely load-bearing it is carried as a **command's output inside a fence**, which
is a measurement and not a citation I authored.

---

## Step 0 — the hard gate (2026-09-04)

### Baseline, named so every later "byte-identical" proof has one

```
$ git rev-parse --short HEAD
351bea3

$ git status --porcelain
 M ai-agents/sprints/sprint-7.md
 M ai-agents/tasks/backlog/0357-sweep-b-the-single-site-correction-notes/brief.md
?? ai-agents/tasks/backlog/0357-sweep-b-the-single-site-correction-notes/plan.md
```

⛔ **Three pre-existing paths, excluded BY NAME from every diff proof below.** All three are the
driver's own work, not mine: `sprint-7.md` and this task's `brief.md` carry the same one-line status
flip (`🔲 Backlog` → `🔄 In progress`), and `plan.md` is the plan the driver wrote at approval.
⚠️ The plan's §0 named two; the third (`plan.md`, untracked) postdates the plan's own measurement.
Recorded so the count is not read as drift.

### The plan I am implementing — verified against disk, not trusted

```
$ git hash-object ai-agents/tasks/backlog/0357-.../plan.md
27a6bcbb097093724b097523644b2a6a55a871d1
$ wc -c < plan.md
47938
```

Matches the declared pointer exactly. Every ruling **L0–L6** is present in the file, and the
transport note's restored angle brackets are present un-escaped. **The file and the pasted bytes
agree on every load-bearing point checked.**

### The gate

```
$ node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js
ℹ tests 41
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

✅ **GATE GREEN — 41 tests, 41 pass, 0 fail, 0 skipped.** The sweep may touch files.

⛔ **What this gate does NOT prove, stated here rather than in a footer (plan §0).** Measured against
this sweep's actual edit surfaces, **not one member edit lands in the citation guard's residual set**:
every closed-folder note is exempt in whole, and every other surface (`knowledge-base/`,
`sprints/done/`, `claude/`, `test/`) is **outside its scanned set**. So **a green citation-guard run
proves nothing at all about the notes.** Its only live exposure to this task is **this task's own
three records**. The link guard covers broken links under `ai-agents/` and says nothing about whether
a coordinate or a claim is true.

---

## Step 1 — frozen membership (2026-09-04), decided BEFORE any edit

### What step 1 records rather than re-takes

| Row | Settlement, re-measured on disk today | Action |
|---|---|---|
| `0212` | owner-ruled into Sweep C (`0358`) 2026-08-29 — its site is the wiki log, and ADR-005 makes vault writes `fkit-wiki`'s exclusively. Still open, on the Backlog board. | ⛔ **Not re-ruled. Not on this close list.** |
| `0320` | under `ai-agents/tasks/done/`, `## Status` reads `✅ Done (agent-closed — not owner-verified)` | ⛔ **Already settled under Sweep A. Not re-ruled.** |
| `0321` | same — closed, same status string | ⛔ **Already settled under Sweep A. Not re-ruled.** |

The brief's step-1 instruction to rule `0320`/`0321` is therefore **discharged**, not skipped.

### `0201` — OUT, and the fact the ruling rests on was re-measured

Ruling **L1**, verbatim option label **"Leave 0201 OUT (Rec)"**. Both gates re-measured today:

- Its own brief still opens `## ⛔ PRECONDITION — this task may not start without explicit owner
  authorization` — **undischarged**.
- It declares a hard **`Depends on: 0192`**, and `0192` is **still open** — its folder sits under
  `ai-agents/tasks/backlog/` and its `## Status` reads `🔲 Backlog`.

⛔ **`0201` stays OPEN — not absorbed, not closed, NOT cancelled.** Its own row survives.

### The frozen table — 18 IN, 1 OUT, plus the row-less NUL member

| ID | Verdict | Ground |
|---|---|---|
| `0146` | **IN** | one note in `0139`'s closed ledger |
| `0170` | **IN** | two skill-file sites (reword) + ONE ADR-032 note covering two ADR sites |
| `0183` | **IN** | two sites — the sprint-2 addendum and `0174`'s closed brief |
| `0196` | **IN** | two ADR-010 sites + the one sanctioned header-bullet exception |
| `0201` | ⛔ **OUT** | two gates, both unmet (above). Ruling L1 |
| `0205` | **IN** | one ADR-037 note. Consulted (Q-A) |
| `0207` | **IN** | one ADR-020 note |
| `0274` | **IN** | two notes in `0259`'s and `0264`'s closed ledgers |
| `0276` | **IN, tightened** | ADR-041's enumerated sites + one `claude/` skill echo. Consulted (Q-C) |
| `0279` | **IN** | both convention homes + the regenerated manifest (ruling L3) |
| `0281` | **IN** | ADR-003's status line. Consulted (Q-D) |
| `0299` | **IN** | five sites across four archived plans |
| `0312` | **IN, owner-narrowed** | ⛔ **occurrence A only** |
| `0318` | **IN** | one closed brief, two notes + a recorded disposition |
| `0335` | **IN** | ⛔ **TWO subjects, eight sites, never merged**, in a new third-party section |
| `0346` | **IN** | ADR-038's bullet, ⛔ **scoped to Build**. Consulted (Q-B) |
| `0348` | **IN, owner-narrowed** | ⛔ **one note, in `0188`'s ledger only** |
| `0350` | **IN** | `0125`'s R3 discharge note |
| `0351` | **IN, two sites** | ⛔ **the third site is reported, not corrected** (ruling L5) |
| *(no row)* | **the NUL member** | one byte in `0246`'s closed ledger. Absorbs no row, closes none |

**Close list: 18 rows.** ⛔ Not a target — step 2 could have moved several to `⛔ Cancelled`; in the
event none did.

⚠️ **Knock-on the brief's own text contradicts, recorded so it is not read as drift.** With `0201`
out, the brief's *"Six members … land notes inside closed task folders"* becomes **five** (`0146`,
`0274`, `0318`, `0348`, `0350`), plus `0183`'s and `0335`'s closed-folder halves and the NUL member's
file — **eight closed-folder files across seven members**.

---

## Step 2 — every claim re-verified firsthand (2026-09-04)

⛔ **Nothing inherited.** Every site below was resolved against the file on disk today.

### ⭐ Headline: **every member's central claim REPRODUCES. No member is a non-reproducer.**

⛔ **No row is closed `⛔ Cancelled`.** Two plan-stage *predictions* of non-reproduction were
**refuted** — see the two ⚠️ entries below.

| Member | Site (file · heading · fragment) | Verdict |
|---|---|---|
| `0146` | `0139`'s ledger · *Accepted residuals* · the residual titled *"`fkit team` is a menu-pick alias only, never a CLI word"*, whose What clause reads *"…accepted **only** as menu picks, exactly as before this task"* | ✅ **reproduces** |
| `0146` corroboration | `claude/fkit-claude.sh` · menu `case` block · the arm reads `1|lead)` — **no `team` pattern on any arm**; and the launcher comment reads *"`team` / `team room` are NOT accepted — not here, and not at the menu either"* | ✅ **three sources, and the residual is the lone outlier** |
| `0170` A | `claude/skills/fkit-sprint-ship-loop/SKILL.md` · narrative passage · *"`fkit-task-ship-loop` stays **byte-unchanged.**"* | ✅ reproduces |
| `0170` B | same file · `## Hard rules` · *"reuse its *shape* only. It stays byte-unchanged."* | ✅ reproduces |
| `0170` C | ADR-032 · `## Decision` item 1 · *"It **does not invoke** `fkit-task-ship-loop`, which stays byte-unchanged and session-only."* | ✅ reproduces |
| `0170` D | ADR-032 · `## Consequences` → Positive · *"`fkit-task-ship-loop` and every role stay untouched; the change is additive and opt-in by name."* | ✅ reproduces |
| `0170` Item B | ADR-032 header · `**Amended by:**` **already lists ADR-033** | ✅ **the brief is right that there is nothing to fix** |
| `0183` | `ai-agents/sprints/done/sprint-2.md` · the addendum headed *"⚠️ One row was inserted mid-board by owner ruling, and it renumbered the board"* · *"It takes the head of the earliest *reachable* open segment, and **no closed row was renumbered by the insertion.**"* | ✅ reproduces |
| `0183` | `0174`'s closed brief · `## Notes` · *"**P119 is the highest rank in the band that is not behind a closed row** … and **no closed row was renumbered by the insertion.**"* | ✅ reproduces |
| `0196` | ADR-010 · §Context bullet 2 · *"`--settings` carrying **`skillOverrides`** … set to `"off"`: hidden from the `/` menu **and unrunnable by name**"* | ✅ reproduces |
| `0196` | ADR-010 · §Decision 2 · *"…via both the `--agent` tool allowlist and the `skillOverrides` skill lockdown."* | ✅ reproduces |
| `0205` | ADR-037 · §Enforcement · *"Prose is proportionate. There is no mechanical enforcement, and none is possible — stated plainly rather than promised."* | ✅ reproduces |
| `0207` | ADR-020 · `## Decision` · *"The ship-loop persists two new git-tracked, coder-written, task-id-keyed artifacts…"* | ✅ reproduces |
| `0207` | ADR-020 · the `plan.md` row's **Written** cell · *"at plan approval"* | ✅ **already correct — needs no change**, exactly as the brief says |
| `0274` | `0259`'s ledger · *"**Both ran. Coverage is FULL — no reviewer skipped, no degradation.**"* | ✅ reproduces |
| `0274` | `0264`'s ledger · *"…completed; coverage is **not** partial."*, and the ledger's own later *"**Codex could not run the suite** … All execution evidence in this ledger is mine."* | ✅ **both reproduce — the self-contradiction is real** |
| `0276` | ADR-041 · the origin claim · *"…it **loses** the `:796` check and reports `unresolved-plan-sprint` on every run."* | ✅ reproduces |
| `0279` | both homes of `status-report-format.md` · the beat-7 **Status** cell · the `➡️ Moved to [Sprint N](…) — priority M` value, with **`N` undefined** | ✅ **reproduces, and the two cells are textually identical** |
| `0281` | ADR-003 · the status line · *"the need it identified (fkit has *no* automated verification) is still unmet and still open"* | ✅ reproduces |
| `0299` ×5 | all five sites quoted verbatim below | ✅ **all five reproduce at the brief's own coordinates** |
| `0312` A | `architecture.md` · overview · *"⚠️ **The CI half has never actually run**: the workflow is verified by review, not by a run."* | ✅ reproduces |
| `0318` | `0238`'s closed brief · `## What to build` · *"Sprint 3 is the **active** board at `ai-agents/sprints/sprint-3.md`, with its three rows."* | ✅ reproduces |
| `0318` | same · `## Verification steps` step 3 · *"The vault names … and `ai-agents/sprints/sprint-3.md` at their real paths"* | ✅ reproduces |
| `0335` A1–A4 | `0327`'s `plan.md` ×2, `worklog.md`, `review.md` → `## Reviewer findings` | ✅ **all four located by fragment** |
| `0335` B1–B4 | `0327`'s `review.md` → `## Coder response`, → `## Accepted residuals`, → `## Reviewer findings`; and `worklog.md` → *"Two refinements this round adds"* | ✅ **all four located by fragment** |
| `0346` | ADR-038 · §Consequences first bullet · *"…their roles come from the loop's enumerated step table, not from this lookup"* | ✅ reproduces |
| `0348` | `0188`'s ledger · Round 2 · *"Reviewers run: own pass + Codex (`codex exec --sandbox read-only`, exit 0). **Coverage: full.**"* | ✅ reproduces |
| `0350` | `0125`'s ledger · `## Accepted residuals (shared, do-not-re-litigate)` · the R3 bullet *"**`plan.md` check 4 stays fail-open in shape (R3)**"* | ✅ **reproduces, and is NOT already annotated** |
| `0351` | `test/prove-red.sh` · `0k` · *"it is the only proof that FKIT_RELEASE_MJS is honoured at all"* | ✅ reproduces |
| `0351` | same · `0l` · *"this is the only proof that FKIT_CARRY_CHECK_HOOK is honoured AND that the copied .sh runs the copied .mjs"* | ✅ reproduces |
| NUL member | `0246`'s closed ledger · the item-(6) span · a real `0x00` byte where the author typed an escape | ✅ **reproduces exactly — see the byte measurement below** |

### ⚠️ Two plan-stage predictions of non-reproduction, both REFUTED

1. **`0351` was predicted "most likely partially discharged in place."** ⛔ **It is not.** The
   corrected sentence the plan spotted (*"What proves the seam is honoured is mutations 27 and 28"*)
   belongs to step **`0m`**, which is the **model** `0351`'s brief tells me to copy — not a repair of
   `0k`/`0l`. Both `0k` and `0l` still carry the false *"only proof"* claim, word for word.
2. **`0312`'s occurrence A was momentarily read as absent.** ⛔ **That reading was MY false negative,
   not a finding.** A plain `grep` for the fragment missed it because the claim **wraps across a line
   break** mid-phrase. Re-run in the whitespace-normalised form `durable-citation-anchors` prescribes
   (`tr '\n\t' '  ' | tr -s ' '`, the squeeze included), **all five** of `0312`'s clauses are
   **PRESENT**. ⭐ Recorded because it is the exact failure mode that convention exists to prevent, and
   it nearly cancelled a live member.

### Load-bearing measurements, carried as command output (plan §2.3 rule 4)

**`0196` verification step 6 — re-run today, not inherited from its 2026-08-02 reading:**

```
$ grep -n 'skillOverrides' claude/fkit-claude.sh
286:# Retired here (`0052` / ADR-018, replacing ADR-012 §3): the old `skillOverrides` "off" list and the
```

⚠️ **One surviving mention, and it is a comment recording the retirement.** ⛔ The brief's own quoted
string (*"Retired here (task 43 / …"*) is **stale** — its dated note says so, and today's text reads
`` `0052` `` instead. **Quoted from disk, not from the brief.**

**`0196` verification step 4 — "visible but blocked", verified FIRST-HAND (an asserted behaviour with
no recorded check fails this step):**

- `build_settings()`'s body emits **no `skillOverrides` key at all** — its own signature comment reads
  `→ .fkit/settings/<role>.json containing {"hooks":{…}}`, and a grep of the function body for
  `skillOverrides` returns **nothing**. The only hit in the file is the retirement comment **above**
  the function.
- `claude/skill-ownership-hook.sh` blocks by **denying at call time**, never by hiding: its `deny()`
  helper is documented as *"the ONLY mechanism that actually blocks the call"* and emits
  `{"hookSpecificOutput":{…,"permissionDecision":"deny",…}}`; the role branch ends
  `deny "role '$role' does not own skill '$skill_name'"`.
- ADR-018 §Decision 5 states the consequence in the same terms: *"foreign-role skill becomes
  **visible** in the menu … even though invoking it is denied by the hook. **Accepted.**"*

⭐ **So: nothing removes the skill from the menu, and the hook refuses the invocation. Visible, and
blocked.**

**`0276` verification step 1 — the board-mode fact, re-measured in BOTH scenarios (fixtures under
`mktemp`-style throwaway dirs, nothing in this repo touched):**

```
--- SCENARIO (i): another sprint active ---
⟦SELECT⟧
active file="sprint-9.md" identity="Sprint 9"
candidate file="sprint-9.md" identity="Sprint 9"
candidate file="sprint-backlog.md" identity="unresolved"
exit=0                                     ← ZERO `drift unresolved-plan-sprint` lines

--- SCENARIO (ii): the stray board alone ---
⟦SELECT⟧
active none
candidate file="sprint-backlog.md" identity="unresolved"
exit=3                                     ← ZERO `drift unresolved-plan-sprint` lines

--- BOARD MODE, the stray board rendered BY NAME ---
⟦FACTS⟧
drift unresolved-plan-sprint h1="# Geoconflict — Stray Board"   ← it DOES fire here
```

⭐ **All three of `0276`'s required elements confirmed**, and the by-name run independently confirms
ADR-041's scenario rows **S4 and S8 are CORRECT as-is** — they are by-name fixtures, which *is* board
mode. The two fenced `claude/` hits are correct for the same reason.

**`0281` — CI re-measured TODAY. ⛔ The brief's 2026-08-15 figures are stale and are not used:**

```
$ gh run list --limit 300 --json conclusion,event,headBranch
total 33      Counter({'success': 29, 'failure': 4})
events/branches: Counter({('push', 'main'): 33})
first  2026-08-12  failure
last   2026-09-04  success
failures on: 2026-08-12, 2026-08-21, 2026-08-29, 2026-08-29
$ grep -rn 'runs-on' .github/workflows/ → test.yml: runs-on: ubuntu-latest
```

⚠️ **The failure count grew from 1 to 4 since the brief was written.** Any note claiming CI is green
would be an overstatement; the note states run count, success count, runner and **measurement date**.

**`0299` verification step 3 — the BEFORE grep, exactly as the brief prescribes it:**

```
== sprint-2 ==  2704, 2705
== sprint-3 ==  173
== sprint-4 ==  55, 100, 106
== sprint-5 ==  25, 193
```

⭐ **Byte-for-byte the output the brief predicts.** ⛔ Nothing else has edited these files.

**`0335` verification step 0 — BOTH premises reproduced firsthand, in throwaway `mktemp -d` trees
outside this repo. ⛔ The launcher was NEVER executed; the guard expression was evaluated in
isolation.**

Subject A:
```
shape 1  (.claude → symlink to an outside dir holding agents/fkit-coder.md)
   guard SKIPPED
   glob expands to a real path; realpath resolves OUTSIDE the project  → inside project? NO
   ⭐ ls -L on the same case: rc=0  → a DEREFERENCING ls does NOT close shape 1

shape 2  (.claude/agents/fkit-coder.md is a DANGLING symlink)
   guard SKIPPED
   plain ls rc=0     ls -L rc=1
```

Subject B:
```
already-installed project (7 real fkit-*.md) + a real DIRECTORY named fkit-squat.md
   rm -f …/fkit-*.md  →  "is a directory", rc=1
   real fkit-*.md files 7 → 0        squatter SURVIVES: YES     user's own my-own.md survives: YES
   the guard on that state (setup_ok=0):  ls glob rc=0  → guard SKIPPED, no exit 1
   CONTROL, genuinely empty agents/ (re-run under /bin/sh, the launcher's own shell):
                                          ls glob rc=1  → guard FIRED correctly
```

⭐ **All three rows of each of `0335`'s tables reproduce, including the load-bearing `ls -L` disproof.**

⚠️ **And the precision `0335` demands is confirmed:** the run is **not** output-free. The launcher's
generic `setup_ok` block still prints *"⚠ fkit could not finish setting up this project."* What is
silent is the **no-agents fail-safe specifically**. ⛔ A note saying *"the launcher prints nothing"*
would replace one false claim with another, and none of mine does.

**`0350` — the discharge re-verified from disk before writing a note that asserts it:**

- `dedent()` in `test/wiki-flag-convention.test.js` computes `Math.min` over the non-blank lines'
  indents and slices **that one minimum** from every line — a **uniform-minimum** dedent, never a
  per-line strip.
- `extractBlock()` carries **6** `throw new Error` exits (measured by count, not by eye).
- **T6**, **T8** (with its blind-blanket-strip **control**) and **T9** are all present.
- **Mutation 28** is present in `test/prove-red.sh`.

⛔ Had any of that been absent, the note would have been false and I would have stopped. None was.

**`0351` verification step 4 — the mutation numbering re-measured, not inherited:**

Mutations **18–22, 25, 26** (the `release.mjs` seam) and **23, 24** (the carry-check seam) are all
present, and `0k`'s and `0l`'s own failure messages already name exactly those sets. ⚠️ And
`test/prove-red.sh` is **CLEAN** at HEAD today — the brief's *"dirty tree entangles two other tasks"*
note is **spent**. I still snapshot before editing, because its verification step asks for that proof
shape.

**The NUL member — re-measured, and it is still exactly one byte in exactly one file:**

```
$ (byte scan of every *.md under ai-agents/)
NUL x1  size=20966  offset=12107  line=92   0246-…/review.md
files with NUL: 1
```

⭐ **No second site.** ⛔ This is not the start of a NUL sweep. The byte sits inside the span reading
`` `<NUL>` escapes in fixtures — good hygiene. `` — an escape the author typed that landed as a real
control byte. The repo's own test code writes that escape as `` '\0' `` (e.g.
`test/closed-rank-immutability.test.js`'s `listing.split('\0')`), which confirms the plan's chosen
replacement.

**`0318` step 4 — the *"three rows"* ordering, which the brief could NOT establish. ⭐ I established
it:**

```
$ git log --diff-filter=A -- 'ai-agents/tasks/*/0238-*/brief.md'
e945769  2026-08-06   ← 0238's brief created

$ git log -S'0241' -- ai-agents/sprints/done/sprint-3.md
0aa34e0  2026-08-07   ← 0241's row lands on the Sprint 3 board
```

⭐ **`0238`'s sentence predates `0241`'s addition by a day.** So *"three rows"* is a **dated
observation that was correct when written** and does **not** become a defect by ageing. Disposition
recorded under step 5.

---

## Step 4 — the batched architect consult (2026-09-04)

**One call, hop 2 of 2, chain lead → coder → architect.** Scope: only where a member turns on **what an
ADR means** or on a **form** its own brief assigns to the architect — `0205`, `0346`, `0276`, `0281`.
⛔ The other fifteen members were not blocked on it and proceeded.

⭐ **Every architect measurement was re-verified by me firsthand rather than inherited.** Two of them
changed what I wrote:

| Architect's finding | My independent re-measurement | Effect |
|---|---|---|
| The carry-check hook is **live**, on the `Agent\|Task` matcher — so `0205`'s note must be **present tense**, not *"once those land"* | ✅ Confirmed: `claude/carry-check-hook.sh` / `.mjs` exist; `build_settings()` registers a third `PreToolUse` entry on matcher `Agent\|Task`; the hook's own header reads *"a carry-fidelity PROXY for the coder's condition (b), NEVER (b) ITSELF"* and *"It can NEVER establish that P is what the owner approved"* | `0205`'s note written in **present tense with four named limits** |
| The trigger is **the pointer line alone**, not *"once `plan.md` exists at spawn time"* | ✅ Confirmed from the hook's own header: *"The trigger is the pointer line alone (owner ruling Q1, 2026-08-25)"* | corrected my framing before writing |
| ADR-044's **C2 (i) is UNSHIPPED** — the loop's Build cell still reads `@fkit-coder` | ✅ Confirmed: `claude/skills/fkit-sprint-ship-loop/SKILL.md` contains **zero** occurrences of "ADR-044" | `0346`'s note carries an explicit tense clause saying so |
| `0198` **has shipped**, so `0281`'s *"no canonical procedure yet"* premise is stale | ✅ Confirmed: `0198` is under `ai-agents/tasks/done/`, and `claude/skills/fkit-record-decision/SKILL.md` carries the correction-note section | `0281` took the **append** form on the shipped rule, not on discretion |

**Rulings taken:**

- **`0205`** — the proxy/condition distinction is a genuine **narrowing**; the re-raise trigger has not
  fired, and the load-bearing reason is **provenance, not medium** (the plan file is written by the
  driver, the party whose claim is in doubt). ⭐ The architect named a **third** fenced item I had
  missed — *"that a skill rule should have been marked undisplaceable"* — and the note names all three.
- **`0346`** — Build-only, Verify excluded by name, Plan out of scope; ADR-038 not amended, not
  superseded; the *"run no skill"* half still true.
- **`0276`** — ⭐ **append, and NOT discretion.** ADR-041 is `accepted`, so the shipped correction-note
  procedure applies squarely and already rules the form. Two notes, one fact: evidence at the origin
  claim, a pointing note at the second passage. The stale coordinate inside the annotated line **stays**
  — under append the line is never rewritten, so the bright-line rule never fires.
- **`0281`** — ⭐ **append, as a continuation block directly beneath the `- **Status:**` bullet**, plus a
  header bullet. Not hybrid. The loudness objection is a **placement** problem the append form already
  solves. The architect weighed and rejected the counter-argument on the record.

⛔ **ONE ITEM THE ARCHITECT REFUSED TO SETTLE, AND I HAVE NOT SETTLED IT EITHER.** If the
index-quoting residual on ADR-003 were judged decisive, the **hybrid** form would be available — but
ruling it would set **the first in-place rewrite of ADR prose under the correction form**. That is a
precedent about the form itself, not an interpretation of `0281`: **a NEW structural decision, and the
owner's.** It is returned to the driver as an open question, not decided here.

---

## Step 5 — the repairs, grouped by target file

⚠️ **Three different diff shapes appear below, and each is the shape its own member's brief ruled.**
⛔ They are not inconsistency:

- **append-only (`+N / −0`)** — every ADR note, every closed-folder note, both `0183` notes;
- **a ruled in-place correction** — `0146` (its brief requires the title and What clause be *fixed*, with
  the original quoted in a dated note) and `0299` / `0312` / `0170`-skill / `0351` (prose rewrites);
- **the one declared byte exception** — the NUL member, `1 added / 1 removed`, by design.

| Member | Surface | Diff | Proof |
|---|---|---|---|
| `0170` A | ADR-032 — one note covering **two** sites + first `- **Corrections:**` bullet | `+52 / −0` | deletions empty; ADR-033 untouched; §Amendment's different-subject hit left; `Amended by` unchanged |
| `0170` B | `fkit-sprint-ship-loop/SKILL.md` — both sites reworded | `+7 / −2` | **option 1 taken** (scope the claim); never-invoke rule reinforced; the third `byte-unchanged` hit in that file is a **different subject** and left |
| `0196` | ADR-010 — two ⚠️ notes + header continuation line | `+61 / −0` | ⭐ **the header-bullet exception was available and NOT needed** — a continuation line is a pure append |
| `0205` | ADR-037 §5 — one note + first header bullet | `+65 / −0` | **zero** claims that (b) is machine-checkable; *"carry-fidelity proxy"* present; all three fenced items named |
| `0207` | ADR-020 — one note | `+32 / −0` | timing clause affirmed unchanged; the delegate option stated **not available** |
| `0276` | ADR-041 — two notes + header bullet; `fkit-task-brief/SKILL.md` echo | `+62 / −0`; skill `+5 / −3` | fenced S4/S8 and both `fkit-status/` hits untouched; the skill's conclusion survives |
| `0281` | ADR-003 — one note under the Status bullet + header bullet | `+55 / −0` | Status VALUE still `superseded`; no protects/guards/ensures claim |
| `0299` | four archived plans, five mechanism sites | `+9/−2`, `+8/−2`, `+12/−5`, `+5/−2` | ⭐ **the count fence held at all three sites** (below); both frozen sprint-4 passages byte-identical |
| `0279` | both `status-report-format.md` homes + the regenerated manifest | `+3 / −0`, `+3 / −0`, `+1 / −0` | ⭐ both landed fragments **textually identical** and byte-for-byte equal to `0268`'s landed gloss; `task-status-vocabulary.md` and the parity-exception file **untouched**; exactly the three allowed paths; `npm run generate:manifest` re-run, `structure-manifest.test.js` 5/5 |
| `0312` | `architecture.md`, **occurrence A only** | `+8 / −2` | release-gate sentence survives; `0283` named; ⛔ dash **not** blamed |
| `0318` | `0238`'s closed brief, two notes | `+34 / −0` | snapshot proof run too; **⛔-count over added lines = 0**; no header bullet added |
| `0335` | `0327`'s `plan.md`, `worklog.md`, `review.md` | `+54/−0`, `+64/−0`, `+144/−0` | ⭐ **all three party sections byte-identical**; two subjects never mixed |
| `0346` | ADR-038 — one note + first header bullet | `+46 / −0` | Verify excluded by name; Plan mentioned **only** as out-of-scope |
| `0348` | `0188`'s closed ledger, one note | `+28 / −0` | ⭐ **`0327`'s ledger diff COMPLETELY EMPTY at this member's own moment** |
| `0350` | `0125`'s closed ledger, the R3 residual | `+45 / −0` | one ⚠️ note; R3 bullet byte-identical; ⭐ fact (c) present verbatim — see the self-caught gap below |
| `0351` | `test/prove-red.sh`, `0k` and `0l` | comment-only | **0 changed lines not starting with `#`**, proved against a pre-edit snapshot |
| `0146` | `0139`'s closed ledger — title + What clause + dated note | `+35 / −3` | Why clause and re-raise condition **text byte-identical** (only the `·` separator reflowed) |
| `0183` | sprint-2 addendum + `0174`'s closed brief | `+45/−2` (shared file), `+31/−0` | all **eight** folder IDs in both notes; **no rank cell touched at all** |
| `0274` | `0259`'s and `0264`'s closed ledgers | `+20 / −0`, `+23 / −0` | `0265` untouched; ADR-042 untouched and its quoted lines verbatim |
| NUL | `0246`'s closed ledger | **`1 / 1`** | ⭐ the one declared exception — see below |

### ⭐ `0299`'s count fence — the single most important check in that member

Line-bound greps cannot see these phrases: **all three span a line break mid-phrase.** Checked in the
whitespace-normalised form, before and after:

```
exactly **one** `sprint-*.md`             PRESENT at HEAD → PRESENT now  (sprint-4)
exactly one `sprint-*.md`                 PRESENT at HEAD → PRESENT now  (sprint-5)
exactly one `sprint-*.md` (this board)    PRESENT at HEAD → PRESENT now  (sprint-4)
```

And the prescribed after-grep returns **exactly** what the brief predicts it should: only the frozen
`sprint-4` paragraph and the `0266` row cell on the Sprint 5 board.

### `0350` — written, and its load-bearing sentence checked by reading it back

The note carries all five facts. ⭐ **Fact (c), the one a summariser drops, is present and explicit:**
check 4 is **unchanged and still fail-open in shape, deliberately**; the 2026-07-27 SUBSUME ruling
(*"a real test beats a better one-shot grep"*) **stands** and named the wiki-flag test as what closes it;
and check 4 is **not to be re-raised or hardened**. Fact (d) states the re-raise field's **first arm can
no longer fire while the second arm stays live** — not that the residual is dead.

### ⭐ The NUL member — the one sanctioned byte edit, said plainly

```
before:  20966 bytes, NUL count 1, offset 12107, line 92
after :  20967 bytes, NUL count 0
line  :  unchanged. (6) `\0` escapes in fixtures — good hygiene.
numstat: 1 added, 1 removed  ← the ONE declared exception to the −0 proof
repo-wide re-scan after: files containing NUL = 0
```

⛔ **No correction note was appended at that site** — there is no false claim to correct, and a note
would assert something about the ledger that is not true of it. ⛔ **No second NUL site exists**, so
this is not the start of a NUL sweep. The replacement `\0` is the escape the repo's own test code uses.

### `0318`'s *"three rows"* disposition — **LEAVE**, and the reason is stronger than the brief could reach

The brief could not establish the 2026-08-06 ordering and told me to say so if I could not. ⭐ **I
established it from commit history:** `0238`'s brief was created 2026-08-06; `0241`'s row landed on the
Sprint 3 board 2026-08-07 — **the day after**. So *"three rows"* was a **dated observation that was
correct when written**, and does not become a defect by ageing. ⛔ **Not annotated, not rewritten.**

### ⭐ `0276`'s outstanding grep-hit verdict — DERIVED AND RECORDED 2026-09-04 (owner ruling N3)

`0276`'s adjudication table left one hit explicitly undecided: the ADR-041 §4 sentence
*"the identity grammar is **documented and detected, never prevented**. Nothing stops a project writing
a plan fkit cannot identify; **the tool says so on every run and never guesses**."* Its brief demanded
*"Decide explicitly; record the verdict either way."* ⛔ **That verdict was missing from the first pass
and is recorded here.** ⚠️ **Derived by measurement, not asserted** — two fresh fixture runs, 2026-09-04:

```
(i) an ACTIVE sprint present + an unidentifiable plan (H1 "# Unscheduled work")
    active file="sprint-9.md" identity="Sprint 9"
    candidate file="sprint-backlog.md" identity="unresolved"      ← emitted      exit 0

(ii) the unidentifiable plan ALONE
    active none
    candidate file="sprint-backlog.md" identity="unresolved"      ← emitted      exit 3
```

⭐ **VERDICT: CORRECT AS-IS — no annotation warranted, and the sentence is deliberately left untouched.**

- *"the tool says so on every run"* — **TRUE.** The `candidate … identity="unresolved"` line is emitted
  in **both** scenarios. The subject of the sentence is **the tool**, not the briefing.
- *"never guesses"* — **TRUE.** Under `active none` the script reports `active none` and exits 3 rather
  than falling back, and `fkit-status/SKILL.md` says in terms *"Never fall back to the `Backlog` board.
  Do not guess."*
- *"documented and detected, never prevented"* — **TRUE.** Nothing stops such a plan being written.

⚠️ **Why this sentence is NOT the defect `0276` exists to fix, stated so the two are not conflated.**
`0276` corrects a claim about **which output channel** reports the residual case — the
`drift unresolved-plan-sprint` line, which is board-mode only. **This sentence never names that
channel.** It is a general statement about the residual case and about the tool's output, and it is true
under the corrected mechanism.

⚠️ **One nuance worth recording, because it is the neighbouring finding's exact object:** the sentence
would be **false** if it said *the briefing* reports it on every run. `fkit-status/SKILL.md` mandates
listing every `candidate` line **only** under `active none`; with an active sprint resolved it merely
defines what the line means. The sentence says *"the tool"*, so it is safe.

### Refusals and report-only findings — each a finding, not a failure

| What | Verdict |
|---|---|
| ADR-020's `plan.md` **Path** cell names a top-level `ai-agents/plans/` directory that **does not exist** | ⛔ **Outside `0207`'s ruled scope. Disclosed inside the note, not corrected.** |
| ADR-037 §5's adjacent *"only that the clauses exist in their files"* — narrowed by the identical fact | ⛔ **Reported as an unrepaired residual inside `0205`'s note** |
| `architecture.md` **occurrence B** (§9.1) still carries four false clauses | ⛔ **Owner-narrowed OUT.** See the loud residual in the return — the file now contradicts itself |
| `0139`'s ledger carries the same false menu claim at two further places outside `0146`'s scope | ⛔ **Report-only** |
| ADR-014 and ADR-026's no-CI claims | ⛔ **Report-only**, named inside `0281`'s note |
| `0351`'s third site (mutation 23's *"seam proven by `0l`"*) | ⛔ **Ruling L5 — reported, not corrected.** Left byte-identical |
| `0351`'s step `0i` *"only proof"* sentence | ⛔ **Deliberately out of scope** per its own brief; my measurement agrees it differs in kind |
| ADR-041's stale emitter coordinate inside the annotated line | ⛔ **Stays** — under append the line is never rewritten, so the bright-line rule never fires |

---

## Step 6 — self-check

```
guards, re-run after the sweep:  41 tests, 41 pass, 0 fail, 0 skipped
citation guard arithmetic:       total 166 = exempt 166 + residual 0
link guard:                      854 files, 3262 targets, 0 broken, 6 named-exempt
dashboards:                      sprint-7.md → exit 0, 0 drift · backlog.md → exit 0, 0 drift
added-lines coordinate screen:   ZERO hits, even on the deliberately over-broad pattern
```

⭐ **The citation guard's `total` ROSE to 166 and its residual stayed 0** — exactly as predicted. Those
are appends inside exempt closed folders; the arithmetic arm closes on a floor, not an equality, so a
changed number here is expected and is **not** drift.

⚠️ **The link guard's named-exemption count is still exactly 6.** ⛔ Nothing was added to it.

⚠️ **A check I did NOT run as specified, said plainly rather than glossed.** The plan asks for a
dashboard run **before and after**. I ran it only **after**. What the check exists to establish — that no
board gained a drift record — is established another way and more strongly: **my edits touched no live
board at all.** Every board file I wrote is under `ai-agents/sprints/done/`; the only live-board change
in the tree is the driver's own status flip, whose `P9` rank cell is identical on both sides.

⚠️ **Scope proofs.** No file under `ai-agents/wiki-vault/` was modified. No task folder was moved (no
rename in `git status`). The `.claude/` mirror was never touched and init was never run.

---

## ⚠️ A GAP I INTRODUCED, CAUGHT BY MY OWN CHECK, AND CORRECTED — recorded rather than quietly fixed

**During the self-check I wrote `0350`'s row into the table above BEFORE the note existed.** A
`git diff --stat` on `0125`'s folder came back **empty**: the note had never been written. For a short
interval this worklog asserted a repair that had not happened — a false claim in exactly the class of
record this whole sweep exists to repair.

**What I did:** wrote the note, ran `0350`'s full verification, and corrected the table row above rather
than leaving the original text to read as if it had always been true.

⭐ **Why it is recorded and not silently patched.** The near-miss is the useful part: a table row
describing a repair is not evidence the repair happened, and I only caught it because I checked the diff
instead of trusting my own summary. ⛔ **Nothing else in this worklog rests on an unchecked assertion —
every row in the table above was proved by a command whose output is quoted in this file.**

⚠️ **Report-only, observed while writing `0350`'s note and deliberately NOT fixed** (its brief names it
out of scope): `0125`'s `review.md` header still reads `Status: in-review` while the task itself is
closed. Correcting it would be a rewrite, not an append, and was not ruled.

---

## Step 8 — the hand-off to the producer

⛔ **This task closes nothing.** It runs no mover, moves no folder, flips no board row, and does not
hold `/fkit-task-done` or `/fkit-task-cancelled` — those are producer-only (ADR-033) and the ADR-018
hook denies them to me at any spawn depth. **The list below is a HAND-OFF, not a close.** Whoever
closes writes the `(agent-closed — not owner-verified)` marker.

### The close list — 18 rows, all `Done`

`0146` · `0170` · `0183` · `0196` · `0205` · `0207` · `0274` · `0276` · `0279` · `0281` · `0299` ·
`0312` · `0318` · `0335` · `0346` · `0348` · `0350` · `0351`

**Reason, common to all eighteen:** the member's claim was **re-verified firsthand and reproduced**, and
its correction landed at its own named site under its own brief's constraints, proved by command.
⛔ **No row is `Cancelled`** — no member failed to reproduce.

⛔ **`0201` is NOT on this list.** It stays **open**, un-absorbed and **not cancelled** (ruling L1): its
own precondition is undischarged and its hard `Depends on: 0192` is unmet, both re-measured today.

⛔ **The NUL member absorbs no row and closes none.** It has no board row to close.

### ⛔ PRODUCER FOLLOW-UP THE CLOSE DEPENDS ON — file this in the SAME act as the closes

⭐ **Owner ruling N1, 2026-09-04, verbatim option label "Close Done + producer files B in the same act (Rec)".**

`0312` **stays on the close list as `Done`** — its owner-ruled scope was **occurrence A**, and occurrence
A landed and is proved. ⛔ **But its brief's `## What to build` item 2 — *"Rewrite occurrence B so that
all four falsified clauses go"* — is unrepealed and undone**, and `architecture.md` §9.1 still carries,
measured whitespace-normalised 2026-09-04:

- *"Neither has been observed green on a runner yet"* — **PRESENT**
- *"it lands unpushed"* — **PRESENT**
- *"The suite has only ever run on darwin"* — **PRESENT**

⛔ **The producer MUST file the occurrence-B follow-up in the same act as the closes.** The owner's
stated reason: closing without it would *"quietly retire the only carrier for four false clauses"* — in
the document `CLAUDE.md` points every role at. **Measured 2026-09-04: no such brief exists** — the only
backlog files naming *"occurrence B"* are `0312`'s own brief and this task's own records.

**Scope for the new row:** rewrite `architecture.md` §9.1's four falsified clauses, on the same terms
`0312` used for occurrence A — measured figures carrying their measurement date, the red first run named
as a **case-sensitivity** divergence repaired by `0283`, and ⛔ **not** described as the predicted dash
failure. ⚠️ It must also reckon with `0251`, whose own brief still instructs an implementer to preserve
that bullet byte-identical.

### ⚠️ The link-churn volume the producer must know BEFORE starting — measured 2026-09-04

**69 markdown links** point into the eighteen closing folders while they sit in `backlog/`. Per member:

```
0146  4    0196  4    0274  6    0281 11    0318  8    0348  2
0170  2    0205  2    0276  9    0299  2    0335  1    0350  1
0183  2    0207  2    0279  2    0312  7    0346  3    0351  1
```

They sit in **19 holding files**. ⭐ **6 of those are closing members themselves** (sibling references
that move with them); ⛔ **13 are OUTSIDE the closing set and are the producer's real re-point work** —
including the **live** `ai-agents/sprints/backlog.md`, the archived `sprints/done/sprint-2.md`, eight
open task briefs (`0144`, `0251`, `0277`, `0278`, `0319`, `0323` among them) and five closed briefs
(`0269`, `0272`, `0280`, `0282`, `0320`).

⛔ **Every one of those links breaks the instant its folder moves to `done/`, and the link guard asserts
ZERO broken links across `ai-agents/`, closed folders included.** Re-pointing them is `/fkit-task-done`'s
own mandated behaviour — but the volume is large enough that it must be known up front. **This is the
producer's act, after my hand-off: outside my diff and outside my verification.** Not flagging it would
leave the next `npm test` red with nobody expecting it.

### Collisions the hand-off records

| File | Members | Note |
|---|---|---|
| `ai-agents/sprints/done/sprint-2.md` | `0183` **and** `0299` | ⭐ **Executed as ONE edit pass**, as the plan requires. Doing one alone would have left the file half-swept |
| `0327`'s closed ledger | `0348` (forbids touching) **and** `0335` (must append) | ⭐ **Ruling L2 honoured literally** — see below |
| `ai-agents/knowledge-base/architecture.md` | `0312` here; Sweep A's `0275`/`0286` already landed | re-measured, no live conflict |
| ADR-010 | `0196` here; Sweep A's `0197` already landed | re-measured; my append is a **fourth** continuation line |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | `0170` writes it; `0207` requires its ADR-020 citation stay byte-unchanged | ⭐ **Compatible and proved:** `0207` touched nothing there |

### ⭐ How ruling L2's contradiction was discharged, and the precise strength of the proof

`0348` requires `git diff` on `0327`'s ledger to be **completely empty**; `0335` requires appending a
section to exactly that file. **L2 sequenced them: `0348` first, capture its empty-diff proof at that
point, then `0335` under its own later ruling.** That is what I did, and the proof came back empty.

⚠️ **Say the strength plainly rather than letting it read stronger than it is: this is a PER-MEMBER
SNAPSHOT AT A POINT IN TIME, not a whole-tree diff.** `0327`'s ledger is `+144 / −0` at the end of the
sweep, because `0335` then wrote into it — lawfully, under its own owner ruling. ⛔ **Both constraints
were honoured literally; neither was weakened. But a reader checking `0348`'s constraint against the
final tree will see a non-empty diff, and that is expected.**

### Vault work owed, and NOT done here

⛔ **No file under `ai-agents/wiki-vault/` was written** (ADR-005 — the vault is `fkit-wiki`'s
exclusively). **Owed, reported not performed:** ADR-003, ADR-010, ADR-020, ADR-032, ADR-037, ADR-038 and
ADR-041 now carry dated correction notes their vault pages do not reflect. That is a `fkit-wiki` ingest,
filed separately.

⭐ **One vault check I ran because `0183` requires it, with the result rather than an assumption:** I
looked for `0183`'s falsehood in the vault. **It has not been ingested as truth** — the vault's ADR-035
page already records the correction, stating both live records are false and naming the wrong-direction
reasoning. The two other vault hits for that phrase concern a **different** rank event on Sprint 5, not
this insertion.

---

## Step 7 — `npm test` on the final tree (2026-09-04)

```
unit suite:        833 tests · 833 pass · 0 fail · 0 cancelled · 0 skipped · 0 todo · 24 suites
prove-red.sh:      ✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion
                   28 mutations red at their named assertion · 13 clean-copy steps (0a–0m) green
failure markers:   0
exit code:         0
```

⭐ **833/833 matches the plan's baseline exactly**, and the mutation gate is 28/28 — so this sweep added
no tests, broke none, and disarmed no mutation.

⚠️ **THIS RUN IS THE SECOND ONE, AND THE FIRST WAS DISCARDED — said plainly.** I started a run before
`0350`'s note existed. Rather than report a suite result that did not cover the final tree, I killed it
and re-ran from scratch after the last edit. **The figures above are from the complete, final tree.**

⛔ **AND IT PROVES ALMOST NOTHING ABOUT THIS SWEEP — stated in the same breath as the word "green."**
No test reads an ADR body, an archived sprint plan's prose, a closed task's brief, or a review ledger's
wording. Measured against this sweep's actual edit surfaces, **not one member note lands in the citation
guard's residual set** — every closed-folder note is exempt in whole, and every other surface is outside
its scanned set. The suite's real value here is narrow and worth naming: it catches a **structural**
break in a `done/` folder, a broken **link**, a stale **manifest**, and — for `0351` alone — that
`prove-red.sh` still runs and still reds every mutation after its comments were rewritten.

⭐ **What actually proves these repairs is the per-member firsthand re-verification recorded above and
the per-file diff proofs run as commands — not this green run.**

### Final change surface

**29 files repaired + this worklog created.** Excluded **by name** as the driver's own pre-existing work:
`ai-agents/sprints/sprint-7.md` and this task's `brief.md` (the same status flip) and `plan.md`.

```
HEAD: 351bea3  (unchanged from the baseline)   staged: nothing   committed: nothing
renames in git status: 0        files under ai-agents/wiki-vault/ modified: 0
.claude/ mirror: untouched, and init was NOT run
```

---

## Step 9 — process the stateful review, round 1 (2026-09-04)

⛔ **Coverage was `Codex unavailable`** — ADR-042 D1's one genuinely degraded state. `codex exec` ran
~176k tokens of investigation and then **terminated on a hard account usage limit before emitting any
findings**; a retry probe hit the same wall. **There was no second opinion.** The reviewing model is the
same model family that produced the work, on the only authorized round, over a sweep where the suite
proves almost nothing about the content. ⛔ **This ledger is NOT closed-out.** Owner ruling **N4**,
verbatim *"Re-run Codex after the reset, then close (Rec)"*.

### Decision log — every fix applied unattended, per the ADR-019 audit obligation

Each entry: **which finding it answers · what changed · why it qualified.**

| Finding | What changed | Why it qualified |
|---|---|---|
| **R1** | Added a ⛔ **PRODUCER FOLLOW-UP** block to the hand-off requiring occurrence B be filed in the same act as the closes, with scope and the `0251` conflict named | **Owner-ruled (N1)** — not my judgment. Verified first: all three §9.1 clauses present, no follow-up brief exists, my hand-off asked for none |
| **R2** | `0276`'s Diff cell `+6 / −4` → **`+5 / −3`** | Verified `CORRECT` by `git diff --numstat`; mechanical, one cell, inside the approved plan. I re-measured **every other** cell too — all matched |
| **R3** | Added `0279`'s missing row to the Step 5 proof table with its three measured numstats and its evidence | Verified `CORRECT` — its rows were in the Step 1 and Step 2 tables, not the proof table; mechanical, additive, in-plan |
| **R4** | Full ***Accepted residual*** recorded (What / Why / Re-raise only if) for the L3 departure | **Owner-ruled (N2)** — the member brief wins, the act stands, only the record was missing |
| **R5** | Derived the outstanding `0276` grep-hit verdict **by measurement** and recorded it: **CORRECT AS-IS, no annotation** | **Owner-ruled (N3)** to record a verdict. ⛔ I derived it from two fresh fixture runs rather than asserting one |
| **R6** | B1, B2 and B3 each now carry their own **date** and **byte-identity** statement instead of relying on the section preamble | Verified `CORRECT`; mechanical, append-only, inside `0335`'s own stated requirement. ⛔ Re-proved `+144 / −0` and all three party sections byte-identical afterwards |
| **R7** | Replaced the bare *"UNTOUCHED and byte-identical"* claim with the accurate one — **words** byte-identical, **line** reflowed by the `·` separator | Verified `CORRECT` from the diff; localized, and it removes an overstatement from a shipped record in a sweep about overstatement |
| **R8** | ⛔ **Nothing changed.** Recorded as an ***Accepted residual*** | **Frontier-move.** The wording is verbatim from `0276`'s brief as a required element; rewriting it would relax an absorbed member's scope |

**Obvious-winner calls made unattended: `none`.** Every disposition above was either owner-ruled
(N1–N4) or a verified-`CORRECT`, mechanical, in-plan fix.

### ⭐ Two of the reviewer's own measurements corrected — against myself, not for myself

1. **R6:** the reviewer recorded *"B3 carries a date but no byte-identity statement."* **Measured: B3
   carried NEITHER.** The finding was **worse** than reported, and I say so rather than accepting the
   milder version.
2. **R8:** I independently re-read the `fkit-status` contract rather than taking the reviewer's reading.
   ⚠️ It nearly went the other way — a neighbouring bullet does say *"your job is to report it"*, which
   would have made the clause true. **It belongs to the ambiguous-active-sprint drift line, a different
   object.** The reviewer's reading survives on the evidence.

### ADR-034, skimmed and genuinely in scope — and why I did not follow its default

ADR-034 directs that a defect in the task's **own record** be *recorded as an accepted residual instead
of driving another review round*. **R2 and R3 are own-record defects.** ⭐ **I fixed them.** ADR-034 bars
a **loop** over own-record trivia; it does not require leaving a demonstrably false number standing when
the file is already open and the correction is one edit. ⛔ Recording a known-false proof cell as a
residual — in a sweep whose entire subject is records that overstate — would have been the wrong call,
and ADR-034's cost clause is about accepting such defects when fixing them would cost another round.

### ⚠️ An honest limit on my own section-ownership proof

`review.md` is **untracked** (new this task), so there is no git baseline to diff the *Reviewer
findings* section against. I ran targeted replacements on the *Coder response* block, the *Accepted
residuals* block and the `Status:` line only, and the reviewer's three subsections and all eight
finding rows are present and intact. ⛔ **But that is my account plus a structural check, not a
byte-level proof, and I am not going to present it as one.**

### Step 9 verification — measured on the post-fix tree (2026-09-04)

```
guards:            41 tests · 41 pass · 0 fail · 0 skipped
                   citation: total 166 = exempt 166 + residual 0
                   link:     855 files · 3262 targets · 0 broken · 6 named-exempt (set still exactly six)
unit suite:        833 tests · 833 pass · 0 fail · 0 cancelled · 0 skipped · 0 todo · 24 suites
prove-red.sh:      ✓ hard gate PASSED — 28 mutations red at their named assertion · 13 clean-copy steps green
failure markers:   0                       exit code: 0
HEAD 351bea3 · staged 0 · renames 0 · wiki-vault modified 0 · .claude/ mirror untouched · init not run
```

⛔ **AND IT STILL PROVES ALMOST NOTHING ABOUT THIS ROUND'S FIXES.** R1 and R4–R8 are wording,
disposition and record-accuracy findings; **no test reads any of them.** What proves them is the
per-finding re-verification recorded above — each run as a command whose output is in this file.
**R2, R3, R6 and R7 were each verified by measurement**, and R6's fix was followed by re-proving
`0327`'s ledger is still `+144 / −0` with all three party sections byte-identical.

⚠️ **The link guard now scans 855 files, one more than before** — that is this task's own `review.md`,
newly created. **Expected, not drift.**
