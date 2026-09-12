---
name: fkit-sprint-done
description: >-
  Mark a sprint complete — stamp its board's line-3 Done banner, relocate every still-open row to the
  next non-terminal sprint (or the Backlog board), repoint inbound links, and move the plan into
  ai-agents/sprints/done/. Takes the path to the sprint plan as its argument. Use when a sprint has
  been finished and is being closed.
---

# Sprint Done

> ## ⛔ Owner: the **producer**
> This is the fkit-producer's own procedure. Execute it **only** if you are the producer — running as
> the `fkit-producer` agent or in a `fkit producer` session. Per
> [ADR-047](../../../ai-agents/knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md)
> §4, applying
> [ADR-033](../../../ai-agents/knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)'s
> reasoning verbatim, this is **structural, not a request**: the ADR-018 `PreToolUse` hook denies a
> mover call from any non-producer identity at any spawn depth.
>
> **Any other role: do not execute this.** Route the close to the producer instead:
> ```
> @fkit-producer Close this sprint: <path>
> ```
>
> **⚠️ If you are an agent and not the owner, you MUST write the agent-closed marker** — see
> *The sprint status vocabulary* below. **A producer that was SPAWNED to close is an agent**
> (ADR-033 §5): it has no owner channel (ADR-021), so its close is agent-closed. Only an owner-present
> producer session yields a plain owner-verified close. That marker is the only trace that no human
> checked this sprint.


Mark a finished sprint complete: stamp **`✅ Done`** into the board's **line-3 banner**, relocate every
row still open on it, repoint every link that names it, and move the plan into
`ai-agents/sprints/done/`.

**Argument:** `$ARGUMENTS` — the path to the sprint plan (e.g. `ai-agents/sprints/sprint-8.md`). A bare
filename (`sprint-8.md`) is also acceptable — resolve it under `ai-agents/sprints/`.

> **Why this skill exists.** Until ADR-047 a sprint's status was carried **implicitly**, by location
> alone, and every archival was a hand-scoped one-off task. Nothing made the banner and the move happen
> together, so the two carriers could disagree and nothing said so — a finished Sprint 5 kept being
> reported as active. This skill is the *sanctioned* way to close a sprint: it writes the status, moves
> the rows nobody is left driving, repairs the links, and archives the plan, as **one act**.
>
> **What kind of gate it is — the same narrow one the task movers have.** The hook enforces **who** may
> close: the producer, and no other role, at any spawn depth. That is real, and it is not prose.
> **What it is NOT: prevention** (ADR-033 §The limit — do not "harden" past it). A determined doer can
> still spawn a producer to close. The `(agent-closed — not owner-verified)` marker carries the only
> signal there, and **the marker is prose — nothing enforces it.**
>
> ⭐ **Atomic by INVOCATION, not by filesystem** (ADR-047 §4). An interrupted run leaves a half-closed
> board — repointed links to a plan that has not moved yet. That is stated plainly rather than implied
> away: §7's location-mismatch drifts are what catch it. Do not read the step order as a transaction.

## Resolve the status value FIRST

Before any edit, decide which marker this run writes — **every `✅ Done` in the steps below means this
resolved value, not the literal string**:

| You are | Banner to write |
|---|---|
| The **owner**, invoking this in an owner-present `fkit producer` session | `> ## ✅ Done — <YYYY-MM-DD>. Closed by /fkit-sprint-done.` |
| A **producer spawned** to close — by a ship-loop, an orchestrator, or any other agent | `> ## ✅ Done — <YYYY-MM-DD>. Closed by /fkit-sprint-done (agent-closed — not owner-verified).` |

**If you are unsure which you are, you are an agent.** Being the producer is what let you run this
skill at all (ADR-033 §1); it is **not** what makes a close owner-verified — the owner being present
is (ADR-033 §5).

---

## Steps — do these in order

⚠️ **This order INVERTS the task movers', deliberately — ADR-047 §4, and you are inverting, not
mirroring.** `/fkit-task-done` moves the folder and *then* repoints (its step 3 precedes its step 4).
Here the repoint comes **first** and the `git mv` last. The reason: repointing while the file is still
at its old path means the search token and the file agree — **every reference you find can be resolved
against a file that is still there, so you can prove each one before the move invalidates all of them
at once.** Repoint after the
move and the same miss reads as a link to a file that exists at neither path, indistinguishable from a
stale mention. ⛔ Do not "restore consistency" with the task movers by swapping these back.

⛔ **What the inversion does NOT buy you: a guard over the widened half.**
`test/reference-integrity.test.js` builds its scanned set from `collectFiles()`, which walks
`ai-agents/` **and nothing else** — so inside `ai-agents/` a missed reference really is a dangling link
the guard catches, and in `claude/`, `test/`, `CLAUDE.md`, `README.md` or `AGENTS.md` — exactly the half
step 6's sweep was widened to — **nothing catches it.** Your own sweep is the only check there is out
there. Do not carry the task movers' "the guard catches it" reassurance across; it does not travel.

### 1. Resolve and validate the input
- Resolve `$ARGUMENTS` to a real sprint plan under `ai-agents/sprints/`. A bare filename resolves
  there; nothing resolves inside `done/` or `cancelled/`.
- **Resolve its identity with the deterministic reader — never re-derive it** (ADR-041 §5: one
  grammar, one implementation):
  ```
  bash claude/skills/fkit-status/dashboard.sh identity <plan>
  ```
  Exit 0 prints the identity; exit 3 means readable but unresolved.
- **Stop with a clear message if:**
  - the file does not exist, or is not under `ai-agents/sprints/`, or
  - it is already under `ai-agents/sprints/done/` or `ai-agents/sprints/cancelled/` (nothing to do —
    say which), or
  - the identity is **unresolved** (exit 3) — a board whose identity nothing can read must not be
    archived under a name nobody can look up; report it and stop, or
  - the identity is **`Backlog`** — `ai-agents/sprints/backlog.md` is the standing unranked board and
    is **never a sprint**. It has no lifecycle and this skill does not close it.
- ⛔ **Check the ARCHIVE DESTINATION now, before any edit.** If `ai-agents/sprints/done/<basename>`
  already exists, **stop and report it.** The `git mv` is the LAST step, so a destination collision
  discovered there fails *after* the banner, the rows, the briefs and every repointed link are already
  written. Worse than the failure: step 6 will have repointed those links into `done/<basename>`, where
  they resolve **successfully** — to the OLDER archived board sitting at that path. That is the same
  silent-resolution hazard step 4 names for row markers, aimed at the close itself, and only this
  up-front check catches it while nothing has been touched.
- If `$ARGUMENTS` is empty, ask which sprint plan to close. Do not guess.

⛔ **Do NOT refuse the close because rows are still open.** ADR-047 §3.0 item 2 rejects
*refuse-to-close-while-rows-are-open* **by name**: a board that cannot reach its terminal state until
every row is resolved makes the status carrier hostage to the work. Open rows are **relocated** in
step 4. ⚠️ **The brief for this task says otherwise in its `## What to build` step 1; that is stale
text** — owner ruling Q1, 2026-09-12, option label verbatim **"Follow the ADR — relocate (Rec)."**
Noted here rather than silently ignored.

### 2. Read the board and learn its context
Capture, for use in later steps and the final report:
- The **H1 title** and the **resolved identity** from step 1.
- **Line 3** — the current banner, if any. You are replacing it, not appending to it.
- Every row in the board's `## Status` table, split into **closed** (`✅ Done`, `⛔ Cancelled`, or an
  already-`➡️ Moved` row) and **open** (everything else).
- **The successor board, resolved by the deterministic reader — never by comparing sprint numbers in
  your head:**
  ```
  bash claude/skills/fkit-status/dashboard.sh successor ai-agents/sprints "<closing identity>"
  ```
  It prints **one basename** and exits 0; it exits **3** when no successor exists. It applies
  ADR-047 §3.0.2 in full: depth 1 of `ai-agents/sprints/` and no other traversal, filtered to boards
  whose identity orders **above** the closing sprint **and** whose status is `🔲 Backlog` or
  `🔄 In progress`, ordered lowest-first with byte order breaking a tie, first wins.

  ⛔ **Never substitute `select-active` for this.** It filters to `In progress` alone and so silently
  drops every `🔲 Backlog` successor — which is half the successor set. That is the plausible wrong
  turn, and it is named here so it is not taken.
  ⛔ **Never compare `Sprint 9` against `Sprint 10` in prose.** ADR-041 §5 forbids a second reading of
  the grammar, and the hand comparison walks into the two hazards `identity_gt`'s own comment records:
  a leading zero, and a 30-digit sprint number that overflows the shell's integer and compares as
  garbage.
- **The successor's LABEL, resolved separately:**
  ```
  bash claude/skills/fkit-status/dashboard.sh identity ai-agents/sprints/<that basename>
  ```
  ⛔ **Two lookups, neither derived from the other** (ADR-047 §3.0.1). The label is the successor's
  **resolved identity**; the href is its **basename**. Deriving one from the other reintroduces the
  filename-as-identity bug ADR-041 exists to deny — `plan-sprint-6.md` legitimately carries the
  identity `Sprint 6`.

### 3. Stamp the line-3 banner
Write, at **line 3** of the plan (line 1 is the H1, line 2 is blank):

```
> ## ✅ Done — <YYYY-MM-DD>. Closed by /fkit-sprint-done.
```

— or the agent-closed form you resolved above. Use today's date, from the session context.

- ⛔ **Strictly line 3.** The recognizer reads that line and no other. A `> ## ` further down the board
  is not a status and must not be treated as one.
- **Replace an existing banner in place; never add a second.** A board carrying `🔲 Backlog` or
  `🔄 In progress` at line 3 has that line overwritten. One banner per board.
- **If line 3 is not a banner** — prose, or a blockquote of some other kind — **insert** the banner as
  the new line 3 and push what was there down. Report that you inserted rather than replaced.
- **`Superseded by [<successor identity>](../<successor basename>) — …` is OPTIONAL trailing prose**,
  written only when step 2 found a successor. Sprints 5, 6 and 7 omit it and that was correct, not
  drift. ⛔ **The `../` is IN the template and is mandatory**, exactly as it is in the step-4 row
  markers: this link sits on the board that is about to move into `done/`, so a bare
  `[Sprint 9](sprint-9.md)` resolves from there — and once Sprint 9 is itself archived under the same
  basename it resolves to the **archived copy**, silently. Write `[Sprint 9](../sprint-9.md)`.
- ⛔ **Never write the legacy `🔒 CLOSED` form.** It is read forever and written never (owner ruling
  V3) — a permanent compatibility rung, not a migration window.

### 4. Dispose of the open rows — ADR-047 §3.0, and this skill may not invent it
1. ⛔ **A closed row's CONTENT is frozen history and is NEVER touched** — `✅ Done`, `⛔ Cancelled`,
   and an already-`➡️ Moved` row alike: its status cell, its `P<n>` rank and its prose all stay
   exactly as they are (ADR-035 — a closed rank is what every rank reference in closed history points
   at).
   ⚠️ **The one thing this freeze does NOT cover is the depth of an href on that row**, and saying so
   here is what keeps step 6 from colliding with this rule. Closed rows carry `../tasks/…/brief.md`
   links — measured on `ai-agents/sprints/sprint-8.md`, every `✅ Done` row does — and moving the board
   into `done/` breaks every one of them. Step 6 shifts those to `../../tasks/…` and **that is not a
   touch**: the row still says the same thing about the same task, and step 7's *"Then prove it."*
   requires it of you. **Freeze the claim; repair the pointer.**
2. ⛔ **An open row is NEVER left open on a terminal board.** A `🔲`/`🔄` row on a `✅ Done` board is a
   row no board is driving, and nothing would ever look at it again. *Freeze open rows in place* is
   rejected by name, exactly as *refuse to close* is.
3. **Every open row is RELOCATED, and the destination is deterministic:**

| Step 2 found | Marker to write on the row |
|---|---|
| a **successor** board | `➡️ Moved to [<resolved identity>](../<successor basename>) — priority M` |
| **no successor** (exit 3) | `➡️ Moved to [Backlog](../backlog.md)` |

- ⛔ **`../` is mandatory on BOTH markers.** The row-holding file ends up in `done/`, so a bare
  `sprint-9.md` resolves from there — and once that successor is *itself* archived under the same
  basename, it resolves to the **archived copy** instead of the live board and **no guard ever fires**.
  A dangling link is loud; this one would not be.
- **`M` is the rank the row receives on the DESTINATION board, never the one it carried here.** A rank
  is board-scoped. The relocated rows **append** to the destination, keeping their relative order from
  this board (ADR-035: where a merit position is out of reach, it appends — and a relocating mover has
  no merit judgment to make, so every row's position is out of reach by definition).
- ⛔ **No `— priority M` when the destination board is UNRANKED** — the Backlog board always, and a
  successor sprint whose own board is unranked. Never write `— priority —`, and never invent a number.
- ⛔ **Verify the destination file exists before writing the marker.** A row relocated to a board that
  is not there is a defect, not a deferral: if the successor file is missing, fall to the Backlog board.
- **The producer may override a single row's destination**, naming the reason in the cell. The rule is
  a default that never has to be guessed, not a prohibition on judgment.

### 5. Update each relocated task's brief fields
For **every row you relocated in step 4**, update that task's `brief.md`. ⛔ **Which of the
brief-writing skill's two relocation procedures applies depends on where the row went** — this is the
pairing, and getting it wrong manufactures a permanent `drift disagreement` (ADR-047 §3.1 FOLLOW-UP 3):

| Destination | Procedure to mirror | Fields |
|---|---|---|
| a **successor sprint** | *"Pulling a backlog task into a sprint"* in `claude/skills/fkit-task-brief/SKILL.md` | `## Sprint` → `Sprint N` (the successor's **resolved identity**), `## Status` → `🔲 Backlog`, `## Priority` → the real number `M` — **or `Unscheduled` where the successor's own board is UNRANKED and step 4 therefore wrote no `— priority M`** |
| the **Backlog** fallback | *"De-scoping a task out of a sprint and back onto the Backlog board"* in the same file | `## Sprint` → `Backlog`, `## Status` → `🔲 Backlog`, `## Priority` → `Unscheduled` |

⛔ **Mirror those procedures' BRIEF-FIELD steps only — never their marker.** The pull-into-a-sprint
procedure's step 2 still writes `➡️ Moved to [Sprint N](sprint-N.md) — priority M`, the
filename-as-identity form ADR-047 §3.0.1 **withdrew**. Step 4 above is the marker, and it is the only
one.

⛔ **`Unscheduled` on an unranked successor is not an invented value, and never invent a number
instead.** ADR-046 lets a sprint board be committed unranked; a rank is a **position on one specific
board**, so a board with no ranks has no position to hand out. The de-scope procedure's own step 5
gives that case `Unscheduled` for exactly this reason. Writing a number here would make the brief
claim a rank the destination board does not carry — and `## Priority` is checked by **no guard**, so
that claim would never be caught. **The row and the brief must agree: no `— priority M` on the row
means no number in the brief.**

⚠️ **Why the pairing is load-bearing, not a nicety.** Drift rule 2 compares a `➡️ Moved` row's target
against the brief's `## Sprint`. Send a row to `Sprint 9` while leaving the brief reading `Backlog`
and the row is flagged `drift disagreement` — and a drifted row **always renders**, so it never
disappears from the board again. Verified empirically, 2026-07-18.

### 6. Repoint every link that names this board
The plan is about to move to `sprints/done/`, so every link to it goes stale. Repoint **now, while the
file is still at its old path** — that is the whole reason for the inverted order.

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
- **In-file relative links first** — the board's own outbound links. Moving into `done/` adds one
  directory level, so **every link written BEFORE this close gains one hop**: `../tasks/…` becomes
  `../../tasks/…`. Every task href on the board is one of these.
  ⛔ **The links THIS run wrote in steps 3 and 4 are NOT.** The `Superseded by` link and both
  `➡️ Moved to …` marker forms were written **for the destination** — their `../` is already measured
  from `sprints/done/`. Shifting them again is the double-hop bug, and it is silent: `../../sprint-9.md`
  resolves to `ai-agents/sprint-9.md`, a path that will never exist. **Sort by who wrote it, not by
  what it looks like.**
- **Then inbound links**, repo-wide. **Re-point the href to the new path in `sprints/done/`, and change
  nothing else on the line.** A link is not a claim; it is a pointer.
- ⛔ **`ai-agents/wiki-vault/` is excluded deliberately — do NOT "fix" this.** Only `fkit-wiki` writes
  the vault ([ADR-005](../../../ai-agents/knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  If a vault link rots when a board moves, that is the wiki role's repair. Say so in the report if it
  seems likely; never reach in and fix it.
- ⛔ **Never edit an ADR's prose, status, date, or decision text from this skill.** A historical
  record's *claims* are frozen; its *links* are not. If a surrounding sentence has become factually
  wrong, that is an architect's amendment — **flag it in the report** instead.
- ⛔ **Never rewrite the old path where it is EVIDENCE** — inside a fenced block, captured command
  output, a dated measurement, a quoted specimen, or a findings row. Editing a transcript forges it.
  Report each one you met and left frozen. ⛔ **This wins over the link test above**, and the case is
  real, not hypothetical: `ai-agents/tasks/done/0268-…/worklog.md` carries `[Sprint 4c](../sprint-4c.md)`
  twice, once in a quoted plan row and once in captured drift output, and both are exempted **by name**
  in `test/reference-integrity.test.js`. Repointing them would forge the transcript **and** orphan a
  key you are forbidden to edit.

### 7. Move the board FILE to `sprints/done/`
Move the plan with `git mv` so history is preserved:

```
git mv ai-agents/sprints/<basename> ai-agents/sprints/done/<basename>
```

**Do not commit** — staging the move is enough; commits happen only when the owner explicitly asks.

**Then prove it.** Resolve every relative markdown link in the files you touched **and** in the moved
plan. A move is not finished while a link it broke is still broken. The board's own outbound links are
the ones most easily left one level short — test them from the plan's **new** location, not its old one.

**Then check the exemption keys this move may have invalidated.** They live in
`test/reference-integrity.test.js`, which holds a set of named
`(citing file, target)` keys exempting links that are broken on purpose. Moving a board file into
`done/` can orphan one of those keys, heal one, or break a fresh link that needs repairing. The guard
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
  A sibling-relative link *heals* when its citer moves into `done/` alongside a target already there:
  *"`../../done/X` survives, `../X` does not" is right about a POINTER and INVERTS for an exemption
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

### 8. Handle ambiguity — never paper over it
- **No inbound reference found** anywhere: complete the close, then **report that nothing linked this
  board** so the owner knows nothing else changed. A sprint with no inbound link at all is itself
  worth saying out loud.
- **Two boards claim the same identity** (`sprint-6.md` and `plan-sprint-6.md`): **stop and ask which
  one is being closed** rather than picking one — that collision is a mistake to resolve, not a tie to
  break.
  ⛔ **It will NOT announce itself to you.** This skill runs no mode that reports it — step 1 calls
  `identity` and step 2 calls `successor`, and both answer with a value and no drift. So the collision
  is silent on this path: close one of the two boards and it disappears from depth 1 along with the
  evidence. **If two boards might claim one identity, render the board —
  `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/<basename>` — and read its `⟦FACTS⟧`
  for `drift ambiguous-plan-identity`, which names every other claimant.** That is the check, not a
  hope that step 1 will warn you.
  ⛔ **Not `select-active`.** It filters to `In progress` before its own `ambiguous-active-sprint`
  check, so two `🔲 Backlog` boards claiming one identity are dropped and nothing is reported — and
  step 1 refuses only the *identity* `Backlog`, never the *status*, so that is a board you may be
  closing. The render's check is gated on identity eligibility alone.
- **The successor's own board is missing or unreadable** where step 2 named one: fall to the Backlog
  board for the rows, and report the fallback and its reason.
- **A row's brief cannot be found** where step 5 needs to edit it: relocate the row, leave the brief
  alone, and list the row in the report as needing the producer's hand.
- If anything is genuinely unclear, stop and ask rather than editing the wrong board.
  ⚠️ **A spawned producer has no owner channel** (ADR-021). If you are spawned, every path above that
  says "ask" means **report and stop**, returning the question to whoever spawned you.

### 9. Report
Give a concise summary:
- **Closed:** `<identity>` (`<basename>`) — and the banner you wrote, verbatim, including whether it
  is the agent-closed form and whether you **replaced** an existing banner or **inserted** one.
- **Moved:** `ai-agents/sprints/<basename>` → `ai-agents/sprints/done/<basename>`.
- **Rows:** how many were frozen as already-closed, and every row relocated — each with its
  destination and the exact marker written. If none were open, say so.
- **Successor:** the basename the reader returned and the identity it resolved to, **as two separate
  lookups** — or `none (exit 3), rows fell to the Backlog board`.
- **Briefs updated:** each relocated task's brief, which procedure's fields you wrote, and the values.
  If a brief could not be found, name it here.
- **Re-pointed links:** every href repaired and where, with the counts you re-derived this run —
  **including hits outside `ai-agents/`** (`claude/`, `test/`, the root docs), which the task movers
  never touch and a reader will not expect. If none were re-pointed, say so.
- **Left frozen:** every occurrence of the old path you met and deliberately did not rewrite, with the
  reason in a phrase (**non-link occurrence** / captured output / dated measurement / quoted specimen /
  findings row). These are judgment calls and this list is the only place they can be checked.
  ⚠️ **`non-link occurrence` will be the commonest reason by far, and nearly all of it outside
  `ai-agents/`** — it was 24 of 24 on the Sprint 8 measurement. A count is enough for that group; name
  the files, not every line.
- **Vault links NOT touched:** if the board seems likely to be referenced from `ai-agents/wiki-vault/`,
  say so and name it as **fkit-wiki's** repair. Do not assert whether vault links actually rotted; this
  skill did not look.
- **Flagged:** anything not auto-resolved — an ambiguous identity, a missing successor board, a brief
  that could not be updated, an ADR sentence that has become factually wrong.
- Remind that **this skill** made no commit — it leaves the move + edits in the working tree. Do not
  claim the repository has uncommitted work, or that anything is or isn't committed — this skill has
  not checked, and the owner may have committed between turns. If commit state matters to the report,
  run `git status` first. (See
  [`conventions/evidence-before-assertion.md`](../../../ai-agents/knowledge-base/conventions/evidence-before-assertion.md).)

---

## Rules
- **Do not commit** anything (the project rule: commit only when the owner explicitly asks).
- Only ever move the plan **into `sprints/done/`** — this skill does not handle cancellation
  (`/fkit-sprint-cancelled`).
- **Never close `backlog.md`.** It is the standing unranked board, not a sprint.
- Keep edits minimal and accurate; surface anything uncertain instead of guessing.

## The sprint status vocabulary

A sprint has **four** statuses, carried by the **line-3 banner** and mirrored by location (ADR-047 §1).
This skill writes exactly one of them:

> **`> ## ✅ Done — <YYYY-MM-DD>. Closed by /fkit-sprint-done.`** — or, when an agent performs the
> close, **`> ## ✅ Done — <YYYY-MM-DD>. Closed by /fkit-sprint-done (agent-closed — not
> owner-verified).`** Nothing else. The date is part of the **recognizer**, not decoration: a banner
> without one is MALFORMED, resolves to `unresolved`, and fires `drift sprint-status-malformed`.

**`🔲 Backlog → 🔄 In progress` is free for the producer to set by hand** — a planning act. Only the
two **terminal** states are mover-gated, mirroring the task vocabulary's authority split.

⚠️ **Read a sprint status BY POSITION, never by the glyph** (ADR-047 §1.1). The four markers are
deliberately the task markers, so one eye reads both boards — and `Backlog` therefore means two things
in this subsystem. A **task** status is a brief's `## Status` field or a board row's leading cell. A
**sprint** status is a blockquoted H2 on **line 3 of a board**, and nowhere else. Do not "fix" the
collision by inventing a second glyph set.

⚠️ **The agent-closed marker is the entire residual mechanism, and it is unenforced.** No code path
checks it. The same agent that would wrongly close a sprint can spawn the producer that labels the
close — so the label is worth exactly what your honesty is worth. **Apply it whenever the owner is not
present**, spawned producers included.
