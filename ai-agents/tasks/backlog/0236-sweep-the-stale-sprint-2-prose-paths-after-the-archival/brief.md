# Sweep the stale `ai-agents/sprints/sprint-2.md` prose paths after the archival — the `0076` precedent

## ID
0236

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Filed on a named owner ruling** taken via `AskUserQuestion` in a live `fkit lead` session on
**2026-08-06** — verbatim: **"File it as its own task."**

### What happened

The Sprint 2 → Sprint 3 rollover (task `0185`) moved the Sprint 2 board from
`ai-agents/sprints/sprint-2.md` to `ai-agents/sprints/done/sprint-2.md`. Every **markdown link** that
broke was re-pointed during the rollover. Every **prose mention of the literal path string** was
deliberately left alone.

The rollover producer's stated reason, which this task inherits: a repo-wide rewrite of frozen records
executed inside a rollover, with no owner present and no separate review, is exactly the silent
history-edit this project's rules exist to prevent. Sprint 1's rollover handled the identical class of
work as **its own task — `0076`** — and that is the precedent the owner's ruling points at.

### ⚠️ Read `0076` first, and follow it

[`0076-repair-broken-links-in-closed-sprint-plans`](../../done/0076-repair-broken-links-in-closed-sprint-plans/brief.md)
is the template, and three of its rules carry over directly:

1. **Change the pointer, never the prose around it.** `0076`: *"Change the href only. Do not touch the
   row's status cell or its prose."* A historically-true sentence stays exactly as written.
2. **Verify-do-not-fix the likely false positives.** `0076` carried a named false positive (a path
   inside quoted template content) with the **expected outcome recorded as a no-op** before work
   started. Do the same here.
3. **Scope the diff and prove it.** `0076` required `git diff --stat` to touch one file and nothing
   else. This task's diff will be larger, so the scoping statement matters more, not less.

### The measurement — re-taken 2026-08-06 at filing

The Sprint 3 board records **107 files**. **Re-measured at filing on the same tree, the figure is
different, and the difference is definitional:**

| Measure | Sprint 3 board | **Re-measured 2026-08-06 at filing** |
|---|---|---|
| Files containing the literal string, whole repo (excl. `.git`) | 107 | **106** |
| — of which inside `ai-agents/wiki-vault/` | not stated | **5** |
| — **outside the vault (the actionable set)** | 107 | **101** |
| Total occurrences outside the vault | not stated | **148** |
| Occurrences in the banned `path:NNN` form | "many" | **16** |

Where the 101 sit:

| Area | Files |
|---|---|
| `ai-agents/tasks/done/` | 70 |
| `ai-agents/tasks/backlog/` | 12 |
| `ai-agents/knowledge-base/reports/` | 9 |
| `ai-agents/knowledge-base/decisions/` | 4 |
| `ai-agents/sprints/` (incl. `done/` and `reviews/`) | 3 |
| `claude/skills/` | 2 |
| repo-root `handoff-fkit-status-filtered-board.md` | 1 |

**⚠️ Do not treat either number as a checklist. Re-count at implementation time and report your figure
against both of the above**, saying which condition you measured. The discrepancy between 107 and 106
is not resolved here and does not need to be — the point is that **every count in this project has been
definition-dependent**, and yours will be too.

## What to build

**The core work is a judgement, not a `sed`.** The deliverable is a *classified* sweep: each of the
~101 files sorted into re-point / leave / already-broken-for-another-reason, with the rule that decided
it stated once and applied consistently.

### The classification, which is the actual task

- **Live documents — re-point.** Anything a reader is meant to act on today: `claude/skills/*/SKILL.md`,
  open briefs under `tasks/backlog/`, the repo-root handoff file, live knowledge-base conventions. A
  stale path in a live instruction sends the next agent to a file that does not exist.
- **Frozen closed records — the historical text is arguably correct as written.** Closed briefs,
  worklogs, review ledgers under `tasks/done/`, and frozen reports under `knowledge-base/reports/` are
  records of *what was true when they were written*. `sprint-2.md` **was** at that path then. Rewriting
  them makes the record say something the author did not say. **The default for this class is LEAVE,
  and the burden is on the argument to change one, not to keep it.**
- **⚠️ Named, expected no-ops — verify, do not fix.** Some hits are *supposed* to contain the old
  string: `ai-agents/sprints/done/sprint-3.md` and `ai-agents/sprints/done/sprint-2.md` both name the
  literal old path inside dated corrections **that are about the archival itself**, and
  `claude/skills/fkit-task-brief/SKILL.md` may carry it as illustrative template text. Read each,
  confirm, and record the conclusion — **`0076` part B's shape exactly.**
- **The `path:NNN` hits are a different problem wearing the same clothes.** 16 occurrences are in the
  `ai-agents/sprints/sprint-2.md:NNN` form, which the `0160` ruling makes **categorically wrong for a
  coordination document regardless of whether the path is stale**, and which `0176` exists to guard.
  **Do not silently "repair" these by updating the path — that ships a still-banned citation with a
  fresher-looking path.** Either strip them to a durable form or leave them and hand them to `0237`
  (the citation cleanup), and **say which you did and why.**

### Constraints

- **⛔ Do not write `ai-agents/wiki-vault/`.** The 5 vault hits are `fkit-wiki`'s exclusively (ADR-005).
  Report them; hand them to `0238`.
- **⛔ Do not edit any board's status cells, `P<n>` values, or `➡️ Moved` markers.** This task touches
  path strings only. A closed row is frozen history.
- **⛔ Do not move any task file** — the movers are producer-only (ADR-033).
- **⛔ No `:NNN` line-number citations in this task's own artifacts.** A task that cleans up citations
  must not ship carrying the banned form.
- **⛔ No blanket `sed -i` over the repo.** If the plan proposes one, the classification above has not
  been done. A scripted apply is fine **after** the classification exists and is reviewed — the script
  executes the decision, it does not make it.

## Verification steps

1. **Re-count first**, and report the figure against the 107 / 106 / 101 above, naming the condition
   measured (whole repo? excluding the vault? files or occurrences?).
2. Produce the classification table — every file in the actionable set with its bucket and the rule
   that put it there — **before** any file is edited. This is the reviewable artifact.
3. The named no-ops in §"Named, expected no-ops" are read and **confirmed as no-ops in writing**. If
   one turns out to be a genuine defect, it becomes in scope and is called out as a correction to this
   brief.
4. Every re-pointed path resolves on the filesystem from its own file's directory.
5. **Zero files under `ai-agents/wiki-vault/` modified** — `git diff --stat` proves it.
6. **No board status cell, priority cell, or `➡️ Moved` marker changed** — `git diff` of
   `ai-agents/sprints/**` shows path-string edits only, or no edits at all.
7. Run the dashboard over all four live boards and report roll-ups and drift before and after. **No
   board gains a drift record.**
8. `npm test` passes.
9. State in the close report **how many files were left deliberately, and the rule that left them.**
   A close report that reports only what it changed has hidden half the decision.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Related, not blocking:** `0237` (the coordination-citation residual cleanup) — the two overlap on
  the 16 `path:NNN` hits. **They are deliberately separate tasks**: this one is about a *stale path*,
  `0237` is about a *banned citation form*, and a path can be stale-and-legal or fresh-and-banned
  independently. Whichever lands first should say what it left for the other. `0238` (the wiki re-sync)
  owns the 5 vault hits and is the only task that may touch them.
- **📌 DATED NOTE 2026-08-15 (`0306`) — this brief's `ai-agents/sprints/sprint-2.md` strings are
  DELIBERATELY LEFT DEAD.** `0306` swept dead board paths out of the open briefs and left this file's
  occurrences byte-identical, because **this brief's subject IS that string.** Re-pointing them would
  erase the task:
  - **The H1 title** — *"Sweep the stale `ai-agents/sprints/sprint-2.md` prose paths after the
    archival"*.
  - **§"What happened" `:26`** — *"moved the Sprint 2 board **from** `ai-agents/sprints/sprint-2.md`
    **to** `ai-agents/sprints/done/sprint-2.md`"*. Re-pointing the first path makes the sentence say
    the board moved from where it already is.
  - **§"What to build" `:100`** — *"16 occurrences are in the `ai-agents/sprints/sprint-2.md:NNN`
    form"*. That is the name of a **form**, not a path to follow.
  **Where the board actually is today: `ai-agents/sprints/done/sprint-2.md`** — which is exactly what
  this task exists to record everywhere else.
- **✅ RE-POINTED BY OWNER RULING 2026-08-15 (`0306`) — the `sprint-3.md` pointer at §"What to build",
  the *"Named, expected no-ops"* bullet, now reads `ai-agents/sprints/done/sprint-3.md`.**
  ⚠️ **This is the ONE site in this file that was re-pointed**; the three above were left.
  **Why it is not in the leave-class above:** the string there is `sprint-3.md`, a **file the
  implementer is told to open and read** — not the `sprint-2.md` that this brief's sentences are
  *about*. `0306`'s approved plan had enumerated it as leave-class; that enumeration never fit its own
  class definition, so the **owner overturned it** — verbatim option label:
  **"Re-point to `done/sprint-3.md` (Recommended)"**, given via `AskUserQuestion` in a live
  `fkit lead` session driving `/fkit-sprint-ship-loop`.
  **Verified before and after the edit:** `ai-agents/sprints/done/sprint-3.md` exists and **still
  contains the literal old path (2 occurrences)**, so the bullet's claim is as true as it was, and now
  resolvable too.
- **⚠️ An archived board is MOVED, not FROZEN.** Sprint 1's archived board was edited three more times
  after archiving, so `sprints/done/sprint-2.md` is a live editing target, not a sealed one.
- **⚠️ This brief decays.** Every figure was measured on **2026-08-06** on a tree with concurrent
  untracked work. **The inventory is evidence that the class is wide, not a checklist to execute.**
- **Priority is `—` (unscheduled).** Filed to the Backlog board on the owner's ruling; no sprint was
  named and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5).
