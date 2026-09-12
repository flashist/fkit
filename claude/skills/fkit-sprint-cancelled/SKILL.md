---
name: fkit-sprint-cancelled
description: >-
  Mark a sprint cancelled — stamp its board's line-3 Cancelled banner with a recorded reason, de-scope
  every still-open row back onto the Backlog board, repoint inbound links, and move the plan into
  ai-agents/sprints/cancelled/. Takes two arguments — the sprint plan path, then the
  cancellation-reason text. Use when a sprint was dropped and its work will not be done as planned.
---

# Sprint Cancelled

> ## ⛔ Owner: the **producer**
> This is the fkit-producer's own procedure. Execute it **only** if you are the producer — running as
> the `fkit-producer` agent or in a `fkit producer` session. Per
> [ADR-047](../../../ai-agents/knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md)
> §4, applying
> [ADR-033](../../../ai-agents/knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)'s
> reasoning verbatim, this is **structural, not a request**: the ADR-018 `PreToolUse` hook denies a
> mover call from any non-producer identity at any spawn depth.
>
> **Any other role: do not execute this.** Route the cancellation to the producer instead:
> ```
> @fkit-producer Cancel this sprint: <path> — <reason>
> ```
>
> **⚠️ If you are an agent and not the owner, you MUST write the agent-closed marker** — see
> *The sprint status vocabulary* below. **A producer that was SPAWNED to cancel is an agent**
> (ADR-033 §5): it has no owner channel (ADR-021). **Cancelling is the least-audited path in fkit**:
> nobody reads `cancelled/`. Cancelling a whole SPRINT makes a batch of obligations disappear at once,
> and the chance anyone notices is close to zero. Producer-only changed **who signs** that act, not how
> invisible it is. Weigh that before you run it on work you were handed.


Mark a dropped sprint cancelled: stamp **`⛔ Cancelled`** into the board's **line-3 banner** — with a
short **reason** — de-scope every row still open on it back onto the Backlog board, repoint every link
that names it, and move the plan into `ai-agents/sprints/cancelled/`.

This is the sibling of `sprint-done`; the differences are the destination folder, the marker, the
mandatory reason, and that **every** open row goes to the Backlog board rather than to a successor.

**Arguments:** `$ARGUMENTS` carries **two** parameters:
1. **Sprint plan path** — the first whitespace-separated token (e.g. `ai-agents/sprints/sprint-8.md`).
   A bare filename is also acceptable — resolve it under `ai-agents/sprints/`.
2. **Cancellation reason** — **everything after the path**: the text explaining *why* the sprint was
   dropped. It is recorded verbatim (trimmed to a concise line) in the banner, so it must be a real
   rationale, not a placeholder.

> **Why this skill exists.** Until ADR-047 a sprint had no cancelled state at all — only "at the top of
> `sprints/`" or "in `sprints/done/`", so a sprint that was abandoned had to be filed as if it had been
> finished. This skill is the *sanctioned* way to record the other outcome: it writes the status and
> the reason, de-scopes the work nobody is left driving, repairs the links, and archives the plan, as
> **one act**.
>
> **What kind of gate it is — the same narrow one the task movers have.** The hook enforces **who** may
> cancel: the producer, and no other role, at any spawn depth. It does **not** restore prevention
> (ADR-033 §The limit): a doer can still spawn a producer. The `(agent-closed — not owner-verified)`
> marker carries the only signal there, and **the marker is prose — nothing enforces it.**
>
> ⭐ **Atomic by INVOCATION, not by filesystem** (ADR-047 §4). An interrupted run leaves a half-closed
> board — repointed links to a plan that has not moved yet. That is stated plainly rather than implied
> away: §7's location-mismatch drifts are what catch it. Do not read the step order as a transaction.

## Resolve the status value FIRST

Before any edit, decide which marker this run writes — **every `⛔ Cancelled` in the steps below means
this resolved value, not the literal string**:

| You are | Banner to write |
|---|---|
| The **owner**, invoking this in an owner-present `fkit producer` session | `> ## ⛔ Cancelled — <YYYY-MM-DD>. Closed by /fkit-sprint-cancelled — <reason>.` |
| A **producer spawned** to cancel — by a loop, an orchestrator, or any other agent | `> ## ⛔ Cancelled — <YYYY-MM-DD>. Closed by /fkit-sprint-cancelled (agent-closed — not owner-verified) — <reason>.` |

**If you are unsure which you are, you are an agent.** Being the producer is what let you run this
skill at all (ADR-033 §1); the **owner being present** is what makes a cancellation owner-verified
(ADR-033 §5). The date and the reason stay **mandatory** in both forms; the qualifier is inserted, never
a substitute for either.

⚠️ **The qualifier contains an em-dash of its own, so it does NOT satisfy the reason requirement.**
`… Closed by /fkit-sprint-cancelled (agent-closed — not owner-verified).` with nothing after it is
**invalid**. Write a real reason after a final ` — `.

---

## Steps — do these in order

⚠️ **This order INVERTS the task movers', deliberately — ADR-047 §4, and you are inverting, not
mirroring.** `/fkit-task-cancelled` moves the folder and *then* repoints (its step 3 precedes its step
4). Here the repoint comes **first** and the `git mv` last. The reason: repointing while the file is
still at its old path means the search token and the file agree — **every reference you find can be
resolved against a file that is still there, so you can prove each one before the move invalidates all
of them at once.** Repoint
after the move and the same miss reads as a link to a file that exists at neither path,
indistinguishable from a stale mention.
⛔ Do not "restore consistency" with the task movers by swapping these back.

⛔ **What the inversion does NOT buy you: a guard over the widened half.**
`test/reference-integrity.test.js` builds its scanned set from `collectFiles()`, which walks
`ai-agents/` **and nothing else** — so inside `ai-agents/` a missed reference really is a dangling link
the guard catches, and in `claude/`, `test/`, `CLAUDE.md`, `README.md` or `AGENTS.md` — exactly the half
step 6's sweep was widened to — **nothing catches it.** Your own sweep is the only check there is out
there. Do not carry the task movers' "the guard catches it" reassurance across; it does not travel.

### 1. Resolve and validate the input
- Take the **first token** of `$ARGUMENTS` as the plan path and resolve it to a real sprint plan under
  `ai-agents/sprints/`. Treat **everything after the path** as the cancellation **reason**.
- **Resolve its identity with the deterministic reader — never re-derive it** (ADR-041 §5: one
  grammar, one implementation):
  ```
  bash claude/skills/fkit-status/dashboard.sh identity <plan>
  ```
  Exit 0 prints the identity; exit 3 means readable but unresolved.
- **Stop with a clear message if:**
  - the file does not exist, or is not under `ai-agents/sprints/`, or
  - it is already under `ai-agents/sprints/cancelled/` (nothing to do — say so), or
  - it is under `ai-agents/sprints/done/` (it was completed — this skill cancels *unfinished* work;
    **confirm with the owner** before cancelling something already closed, rather than proceeding), or
  - the identity is **unresolved** (exit 3) — a board whose identity nothing can read must not be
    archived under a name nobody can look up; report it and stop, or
  - the identity is **`Backlog`** — `ai-agents/sprints/backlog.md` is the standing unranked board and
    is **never a sprint**. It has no lifecycle and this skill does not cancel it. It is also where this
    skill sends every row, so cancelling it would have nowhere to send them.
- ⛔ **Check the ARCHIVE DESTINATION now, before any edit.** If `ai-agents/sprints/cancelled/<basename>`
  already exists, **stop and report it.** The `git mv` is the LAST step, so a destination collision
  discovered there fails *after* the banner, the rows, the briefs and every repointed link are already
  written. Worse than the failure: step 6 will have repointed those links into `cancelled/<basename>`,
  where they resolve **successfully** — to the OLDER archived board sitting at that path. That is the
  same silent-resolution hazard step 4 names for the row marker, aimed at the cancel itself, and only
  this up-front check catches it while nothing has been touched.
- **If the reason is empty, ask the owner for it before proceeding.** The date and the reason are both
  mandatory. Do not invent a reason.
- If the path is empty, ask which sprint plan to cancel. Do not guess.

⛔ **Do NOT refuse the cancel because rows are still open.** ADR-047 §3.0 item 2 rejects
*refuse-to-close-while-rows-are-open* **by name**: a board that cannot reach its terminal state until
every row is resolved makes the status carrier hostage to the work. Open rows are **de-scoped** in
step 4. ⚠️ **The brief for this task says otherwise in its `## What to build` step 1; that is stale
text** — owner ruling Q1, 2026-09-12, option label verbatim **"Follow the ADR — relocate (Rec)."**
Noted here rather than silently ignored.

### 2. Read the board and learn its context
Capture, for use in later steps and the final report:
- The **H1 title** and the **resolved identity** from step 1.
- **Line 3** — the current banner, if any. You are replacing it, not appending to it.
- The **cancellation reason** — the second parameter, trimmed to one concise line.
- Every row in the board's `## Status` table, split into **closed** (`✅ Done`, `⛔ Cancelled`, or an
  already-`➡️ Moved` row) and **open** (everything else).

⛔ **There is no successor lookup in this skill, and adding one is wrong.** ADR-047 §3.0's table sends
`/fkit-sprint-cancelled`'s rows **always to the Backlog board**: a cancelled sprint's work is
**de-scoped, not carried**. Do not reach for `dashboard.sh successor` here — that mode exists for
`/fkit-sprint-done` alone.

### 3. Stamp the line-3 banner
Write, at **line 3** of the plan (line 1 is the H1, line 2 is blank):

```
> ## ⛔ Cancelled — <YYYY-MM-DD>. Closed by /fkit-sprint-cancelled — <reason>.
```

— or the agent-closed form you resolved above. Use today's date, from the session context, and the
reason from step 2.

- ⛔ **Strictly line 3.** The recognizer reads that line and no other. A `> ## ` further down the board
  is not a status and must not be treated as one.
- **Replace an existing banner in place; never add a second.** A board carrying `🔲 Backlog` or
  `🔄 In progress` at line 3 has that line overwritten. One banner per board.
- **If line 3 is not a banner** — prose, or a blockquote of some other kind — **insert** the banner as
  the new line 3 and push what was there down. Report that you inserted rather than replaced.
- ⛔ **`Superseded by …` does NOT apply here.** A cancelled sprint has no successor carrying its work;
  the work went to the Backlog board. Writing one would assert something false.
- ⛔ **Never write the legacy `🔒 CLOSED` form.** It is read forever and written never (owner ruling
  V3), and it reads as `Done` — the opposite of what this skill records.

### 4. De-scope the open rows — ADR-047 §3.0, and this skill may not invent it
1. ⛔ **A closed row's CONTENT is frozen history and is NEVER touched** — `✅ Done`, `⛔ Cancelled`,
   and an already-`➡️ Moved` row alike: its status cell, its `P<n>` rank and its prose all stay exactly
   as they are (ADR-035 — a closed rank is what every rank reference in closed history points at).
   ⚠️ Cancelling the sprint does **not** cancel its finished work.
   ⚠️ **The one thing this freeze does NOT cover is the depth of an href on that row**, and saying so
   here is what keeps step 6 from colliding with this rule. Closed rows carry `../tasks/…/brief.md`
   links — measured on `ai-agents/sprints/sprint-8.md`, every `✅ Done` row does — and moving the board
   into `cancelled/` breaks every one of them. Step 6 shifts those to `../../tasks/…` and **that is not
   a touch**: the row still says the same thing about the same task, and step 7's *"Then prove it."*
   requires it of you. **Freeze the claim; repair the pointer.**
2. ⛔ **An open row is NEVER left open on a terminal board.** A `🔲`/`🔄` row on a `⛔ Cancelled` board
   is a row no board is driving, and nothing would ever look at it again. *Freeze open rows in place*
   is rejected by name, exactly as *refuse to close* is.
3. **Every open row goes to the Backlog board**, with the marker:

```
➡️ Moved to [Backlog](../backlog.md)
```

- ⛔ **`../` is mandatory.** The row-holding file ends up in `cancelled/`, so a bare `backlog.md`
  resolves from there and points at nothing.
- ⛔ **No `— priority M` suffix, ever.** The Backlog board is **unranked**. Never write
  `— priority —`, and never invent a number.
- ⛔ **Verify `ai-agents/sprints/backlog.md` exists before writing the marker.** A row relocated to a
  board that is not there is a defect, not a deferral.
- ⛔ **There is no per-row destination override in this skill, and it is absent on purpose.**
  `/fkit-sprint-done` has one because its rows have two possible destinations; here every row goes to
  the Backlog board, and step 5 offers exactly ONE brief-field procedure — the de-scope one, which
  forces `## Sprint` to `Backlog`. Sending a row somewhere else while the brief is still forced to
  `Backlog` **manufactures the permanent `drift disagreement` step 5 warns about**, and a drifted row
  always renders. If a row genuinely belongs on another sprint, that is a producer's separate
  pull-into-a-sprint act **after** this cancel, not a cell edited during it.

### 5. Update each de-scoped task's brief fields
For **every row you relocated in step 4**, update that task's `brief.md`, mirroring
*"De-scoping a task out of a sprint and back onto the Backlog board"* in
`claude/skills/fkit-task-brief/SKILL.md`:

| Field | Value |
|---|---|
| `## Sprint` | `Backlog` |
| `## Status` | `🔲 Backlog` |
| `## Priority` | `Unscheduled` |

⛔ **Mirror that procedure's BRIEF-FIELD steps only — never its marker.** Step 4 above is the marker,
and it is the only one.

⚠️ **Why this matters, not a nicety.** Drift rule 2 compares a `➡️ Moved` row's target against the
brief's `## Sprint`. Leave the brief naming the cancelled sprint and the row is flagged
`drift disagreement` — and a drifted row **always renders**, so it never disappears from the backlog
board again. Verified empirically, 2026-07-18.

⭐ **This is the pairing ADR-047 §3.1 FOLLOW-UP 3 settles, and for this skill there is only one.**
`/fkit-sprint-done` has two, because its rows can go to a successor. Every row here goes to the
Backlog board, so the de-scope procedure is always the right one.

### 6. Repoint every link that names this board
The plan is about to move to `sprints/cancelled/`, so every link to it goes stale. Repoint **now, while
the file is still at its old path** — that is the whole reason for the inverted order.

Search for the plan's **basename** (`sprint-8.md`, or whatever it really is — never assume the
filename from the identity):

```
grep -rn --exclude-dir=wiki-vault "<basename>" ai-agents/ claude/ test/ CLAUDE.md README.md AGENTS.md
```

- ⚠️ **This sweep is WIDER than the task movers'**, which grep `ai-agents/` alone. A sprint board is
  named from skill prose, from tests, and from the root docs, not only from coordination files.
- ⛔ **YOU REPOINT HREFS. YOU LEAVE EVERYTHING ELSE — and outside `ai-agents/`, "everything else" is
  what you will actually find.** This grep is a raw text search, so it returns every mention of the
  string, not every link to the board. **Measured on a real close of Sprint 8: 24 hits outside
  `ai-agents/` — 19 in `test/`, 5 in `claude/` — and NOT ONE of them was an href.** They were JS
  fixture literals (`'sprint-8.md': prosePlan(…)`, `identity="Sprint 8"`) and illustrative examples in
  skill prose (including **this file's own** argument example). Rewriting any of them is a defect, not
  a repair: a fixture key is a test's input and editing it reds the suite or, worse, silently changes
  what the test asserts; an illustrative example is documentation about a board, not a pointer to one.
  ⚠️ **Do not reach for the EVIDENCE list below to justify leaving them** — a fixture literal is none
  of those five things, and the list would leave you with no rule at all for the only kind of hit that
  is actually out there. **The rule is the link test: is this occurrence inside a markdown link's
  target — `](…)` — that a reader would follow? Repoint it. Anything else stays, and gets listed in
  the report's *Left frozen* line with `non-link occurrence` as its reason.**
  ⛔ **One exception, and it OUTRANKS the link test: EVIDENCE** — the last bullet of this step. An
  occurrence can be **both** a real markdown link and a quoted specimen, and where it is, the evidence
  rule wins and the link stays frozen. Read the two rules in that order.
- **Re-derive the counts at run time.** Do not carry a number from this file or from a previous run.
- **In-file relative links first** — the board's own outbound links. Moving into `cancelled/` adds one
  directory level, so **every link written BEFORE this close gains one hop**: `../tasks/…` becomes
  `../../tasks/…`. Every task href on the board is one of these.
  ⛔ **The `➡️ Moved to [Backlog](../backlog.md)` markers THIS run wrote in step 4 are NOT.** They were
  written **for the destination** — their `../` is already measured from `sprints/cancelled/`. Shifting
  them again is the double-hop bug, and it is silent: `../../backlog.md` resolves to
  `ai-agents/backlog.md`, a path that will never exist. **Sort by who wrote it, not by what it looks
  like.**
- **Then inbound links**, repo-wide. **Re-point the href to the new path in `sprints/cancelled/`, and
  change nothing else on the line.** A link is not a claim; it is a pointer.
- ⛔ **`ai-agents/wiki-vault/` is excluded deliberately — do NOT "fix" this.** Only `fkit-wiki` writes
  the vault ([ADR-005](../../../ai-agents/knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  If a vault link rots when a board moves, that is the wiki role's repair. Say so in the report if it
  seems likely; never reach in and fix it.
- ⛔ **Never edit an ADR's prose, status, date, or decision text from this skill.** A historical
  record's *claims* are frozen; its *links* are not. ⚠️ Cancellation makes this sharper than completion
  does: a knowledge-base record may cite this sprint as the *reason* for a decision, and cancelling the
  sprint does **not** retract the ADR. Repair the pointer, flag the tension, decide nothing.
- ⛔ **Never rewrite the old path where it is EVIDENCE** — inside a fenced block, captured command
  output, a dated measurement, a quoted specimen, or a findings row. Editing a transcript forges it.
  Report each one you met and left frozen. ⛔ **This wins over the link test above**, and the case is
  real, not hypothetical: `ai-agents/tasks/done/0268-…/worklog.md` carries `[Sprint 4c](../sprint-4c.md)`
  twice, once in a quoted plan row and once in captured drift output, and both are exempted **by name**
  in `test/reference-integrity.test.js`. Repointing them would forge the transcript **and** orphan a
  key you are forbidden to edit.

### 7. Move the board FILE to `sprints/cancelled/`
Create `ai-agents/sprints/cancelled/` if it does not exist — ADR-047 §3 has it **created on first use**,
because git cannot carry an empty directory. Then move the plan with `git mv` so history is preserved:

```
mkdir -p ai-agents/sprints/cancelled
git mv ai-agents/sprints/<basename> ai-agents/sprints/cancelled/<basename>
```

**Do not commit** — staging the move is enough; commits happen only when the owner explicitly asks.

**Then prove it.** Resolve every relative markdown link in the files you touched **and** in the moved
plan. A move is not finished while a link it broke is still broken. The board's own outbound links are
the ones most easily left one level short — test them from the plan's **new** location, not its old one.

**Then check the exemption keys this move may have invalidated.** They live in
`test/reference-integrity.test.js`, which holds a set of named
`(citing file, target)` keys exempting links that are broken on purpose. Moving a board file into
`cancelled/` can orphan one of those keys, heal one, or break a fresh link that needs repairing. The guard
already computes all three directions, and its own failure messages name the repair each one needs —
but never who lands it, which is what the two rules below settle. Run it, then read its red against
them.

⛔ **Two rules bind every repair below — read them before acting on one.** **Attribute the red first:**
the guard is repo-global, so it may not be this move's at all. And **you may run this guard, you may
not edit it** — wherever the repair a red requires is an edit to `test/reference-integrity.test.js`
(repointing a key, deleting one, or adding one), that repair is what you put in the `NEEDS-DECISION`,
not what you do, and a coder lands it. **Exactly one repair below is yours:** `L2`'s leading branch,
repairing a markdown link **this move broke**. Attribution binds here too: an `L2` red this move did
not cause is pre-existing — report it, leave it alone. And *"the edit is under `ai-agents/`"* is no
test at all: the guard scans nothing else, so it holds for every `L2` red. What makes this one yours
is *"Then prove it."* above — a move is not finished while a link **it** broke is still broken — so
you land it and the close is not unfinished for it. The last two bullets state both rules in full.

- **Run it unconditionally**, even when the sweep above found nothing to update:
  `node --test test/reference-integrity.test.js`
- **Green** → record the guard's measured named-exempt figure in the report and stop. `L8` prints it
  as the tail of its disclosure line — e.g. `0 broken, 7 named-exempt` — with the **number before the
  words**, so there is no `named-exempt: N` line to copy. This is the common case, and the step is a
  no-op.
- **Red at `L4`** — *"whose CITING FILE no longer exists"* → the citing file moved with this close, so
  the key names a path that no longer exists. Name repointing the citer half to the new board — and
  name the tail with it: the coder **re-runs the guard** after that edit, and if it then reds at
  *"whose TARGET now resolves"*, deletes the key instead of keeping the repointed one.
- **Red at `L4`** — *"whose TARGET now resolves"* → the link healed. **Delete the key — do not repoint it.**
  A sibling-relative link *heals* when its citer moves into `cancelled/` alongside a target already there:
  *"`../../cancelled/X` survives, `../X` does not" is right about a POINTER and INVERTS for an exemption
  KEY.*
- **Red at `L2`** — *"unresolved markdown link(s)"* → this move *broke* a link, and that arm's own
  message names the fork: **repair the link** when it is a pointer offered to a reader, or — *"if it
  is quoted or illustrative text rather than a pointer"* — add a NEW key carrying its reason. Neither
  branch is a deletion, and **repair is the default**: a new key on a link that should resolve
  converts a loud deterministic red into a silent permanent exemption.
- **The exempt count falls by suppressed INSTANCES, not by keys** — one key can match more than once,
  so deleting a single key can lower the count by more than one. The new number is therefore **read
  from a re-run of the guard once the edit lands, never decremented by hand** — again the coder's
  step, not yours.
- **You may run this guard. You may not edit it.** `test/reference-integrity.test.js` is a coder
  surface: stop and return a `NEEDS-DECISION` naming what the red points at verbatim — each offending
  key and its direction, or, for an `L2` red taking the add-a-key branch, where there is no key yet,
  the broken link's citing file, its line text, and its unresolved target — and treat the close as
  unfinished until a coder lands that edit. **An `L2` red you answer by repairing the link is not this
  case:** where **this move** broke the link, that repair is yours to land — *"Then prove it."* above
  already requires it of you — and it does not leave the close unfinished. Not because the edit is
  under `ai-agents/`: the guard scans nothing else, so that holds for every `L2` red, this move's or
  not. A red this move did not cause is still pre-existing, and still left alone.
- **Attribute before touching anything.** The guard is repo-global, so a red may belong to another
  change in flight. It is this move's only where the board file just moved is spelled by the named key —
  or, for an `L2` red, where there is no key yet, by the broken link's own citing file or target;
  anything else is reported as pre-existing and left alone. Re-running the guard is harmless and must
  not produce a second `NEEDS-DECISION` for the same key.

### 8. Flag downstream dependents — a cancelled sprint can orphan work
Unlike completion, cancelling a sprint can **break things that depended on it**. Surface (do **not**
auto-edit) anything now affected:
- Search for docs that name this sprint as a dependency or a commitment — its **identity**
  (`Sprint 8`) and its **basename** in a `## Depends on` section, a `*(blocked: …)*` annotation, an
  epic's ordering prose, or a roadmap line:

  ```
  grep -rn --exclude-dir=wiki-vault "<identity>\|<basename>" ai-agents/
  ```

  ⚠️ **This is the SECOND sweep in this skill** — step 6's is the obvious one; this dependency search
  is separate and is the one most easily missed. An identity search is far noisier than a basename
  search: read the basename hits first (precise, few, handle every one), then the identity hits
  **filtered to the ones that read as a dependency** — near `Depends on`, `blocked`, `needs`, `waits
  on`, or a table row. `Sprint 8` in ordinary prose usually is not a dependency claim.
  **If the identity search is too noisy to read honestly, say so in the report** and fall back to the
  basename results. An explicit *"I triaged basenames only, the identity search returned N hits and was
  not exhaustively read"* is a true statement the owner can act on. Silently skimming and implying full
  coverage is not.
- **List each dependent in the report** as "now affected — may need re-scoping," so the owner can
  decide. Do not silently rewrite dependents; cancellation ripple is a judgment call.

### 9. Handle ambiguity — never paper over it
- **No inbound reference found** anywhere: complete the cancel, then **report that nothing linked this
  board** so the owner knows nothing else changed.
- **Two boards claim the same identity** (`sprint-6.md` and `plan-sprint-6.md`): **stop and ask which
  one is being cancelled** rather than picking one — that collision is a mistake to resolve, not a tie
  to break.
  ⛔ **It will NOT announce itself to you.** This skill runs no mode that reports it — step 1 calls
  `identity` and nothing else reads siblings. So the collision is silent on this path: cancel one of
  the two boards and it disappears from depth 1 along with the evidence — and `cancelled/` is audited
  by nobody. **If two boards might claim one identity, render the board —
  `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/<basename>` — and read its `⟦FACTS⟧`
  for `drift ambiguous-plan-identity`, which names every other claimant.** That is the check, not a
  hope that step 1 will warn you.
  ⛔ **Not `select-active`.** It filters to `In progress` before its own `ambiguous-active-sprint`
  check, so two `🔲 Backlog` boards claiming one identity are dropped and nothing is reported — and
  step 1 refuses only the *identity* `Backlog`, never the *status*, so that is a board you may be
  cancelling. The render's check is gated on identity eligibility alone.
- **A row's brief cannot be found** where step 5 needs to edit it: relocate the row, leave the brief
  alone, and list the row in the report as needing the producer's hand.
- If anything is genuinely unclear, stop and ask rather than editing the wrong board.
  ⚠️ **A spawned producer has no owner channel** (ADR-021). If you are spawned, every path above that
  says "ask" means **report and stop**, returning the question to whoever spawned you.

### 10. Report
Give a concise summary:
- **Cancelled:** `<identity>` (`<basename>`) — and the banner you wrote, verbatim, including whether it
  is the agent-closed form and whether you **replaced** an existing banner or **inserted** one.
- **Reason:** the one-line cancellation reason recorded, exactly as it went into the banner.
- **Moved:** `ai-agents/sprints/<basename>` → `ai-agents/sprints/cancelled/<basename>`, and whether you
  had to create the `cancelled/` directory.
- **Rows:** how many were frozen as already-closed, and every row de-scoped to the Backlog board. If
  none were open, say so.
- **Briefs updated:** each de-scoped task's brief and the three field values written. If a brief could
  not be found, name it here.
- **Re-pointed links:** every href repaired and where, with the counts you re-derived this run —
  **including hits outside `ai-agents/`** (`claude/`, `test/`, the root docs), which the task movers
  never touch and a reader will not expect. If none were re-pointed, say so.
- **Left frozen:** every occurrence of the old path you met and deliberately did not rewrite, with the
  reason in a phrase (**non-link occurrence** / captured output / dated measurement / quoted specimen /
  findings row). These are judgment calls and this list is the only place they can be checked.
  ⚠️ **`non-link occurrence` will be the commonest reason by far, and nearly all of it outside
  `ai-agents/`** — it was 24 of 24 on the Sprint 8 measurement. A count is enough for that group; name
  the files, not every line.
- **Dependents flagged:** anything that depended on this sprint and may now need attention.
- **Vault links NOT touched:** if the board seems likely to be referenced from `ai-agents/wiki-vault/`,
  say so and name it as **fkit-wiki's** repair. Do not assert whether vault links actually rotted; this
  skill did not look.
- **Flagged:** anything not auto-resolved — an ambiguous identity, a brief that could not be updated, a
  knowledge-base record whose claim this cancellation puts in tension.
- Remind that **this skill** made no commit — it leaves the move + edits in the working tree. Do not
  claim the repository has uncommitted work, or that anything is or isn't committed — this skill has
  not checked, and the owner may have committed between turns. If commit state matters to the report,
  run `git status` first. (See
  [`conventions/evidence-before-assertion.md`](../../../ai-agents/knowledge-base/conventions/evidence-before-assertion.md).)

---

## Rules
- **Do not commit** anything (the project rule: commit only when the owner explicitly asks).
- Only ever move the plan **into `sprints/cancelled/`** — this skill does not handle completion
  (`/fkit-sprint-done`).
- **Never cancel `backlog.md`.** It is the standing unranked board, not a sprint — and it is where
  every de-scoped row goes.
- Always record a **reason**; surface **dependents**; keep edits minimal and accurate; surface anything
  uncertain instead of guessing.

## The sprint status vocabulary

A sprint has **four** statuses, carried by the **line-3 banner** and mirrored by location (ADR-047 §1).
This skill writes exactly one of them:

> **`> ## ⛔ Cancelled — <YYYY-MM-DD>. Closed by /fkit-sprint-cancelled — <reason>.`** — or, when an
> agent performs the cancel, **`> ## ⛔ Cancelled — <YYYY-MM-DD>. Closed by /fkit-sprint-cancelled
> (agent-closed — not owner-verified) — <reason>.`** The date and the reason are **mandatory** in both
> forms, not optional decoration. A cancellation with no stated cause cannot be acted on by anyone but
> the person who wrote it — and the date is part of the **recognizer**: a banner without one is
> MALFORMED, resolves to `unresolved`, and fires `drift sprint-status-malformed`.

**`🔲 Backlog → 🔄 In progress` is free for the producer to set by hand** — a planning act. Only the
two **terminal** states are mover-gated, mirroring the task vocabulary's authority split.

⚠️ **Read a sprint status BY POSITION, never by the glyph** (ADR-047 §1.1). The four markers are
deliberately the task markers, so one eye reads both boards — and `Backlog` therefore means two things
in this subsystem. A **task** status is a brief's `## Status` field or a board row's leading cell. A
**sprint** status is a blockquoted H2 on **line 3 of a board**, and nowhere else. Do not "fix" the
collision by inventing a second glyph set.

⚠️ **The agent-closed marker is the entire residual mechanism, and it is unenforced.** No code path
checks it. **Apply it whenever the owner is not present**, spawned producers included.

⚠️ **`cancelled/` is audited by nobody.** ADR-025 recorded this as its relaxation's sharpest cost for
tasks, and **producer-only does not fix it**: a false `done` is caught when someone uses the work, but a
false `cancelled` may never be caught at all. A whole sprint is a batch of that. If a sprint is being
cancelled because an agent could not finish it, that asymmetry is working against the record — route
the decision to the owner, not to a producer spawn.
