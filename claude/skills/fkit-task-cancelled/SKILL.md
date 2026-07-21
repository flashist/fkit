---
name: fkit-task-cancelled
description: Mark a task cancelled — move its brief into ai-agents/tasks/cancelled/ and update the sprint plan (and parent epic, if any) so the task's status reads Cancelled, with a recorded reason. Takes two arguments — the task file path, then the cancellation-reason text (everything after the path). Use when a task has been dropped/abandoned and will not be done.
---

# Task Cancelled

> ## ⛔ Owner: the **producer** — but **any agent may invoke it**
> This is the fkit-producer's procedure and it lives in the producer's namespace. Since
> [ADR-025](../../../ai-agents/knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md)
> it is **not owner-only**: any spawned fkit role may run it, including on its own task.
> (The one exception is `fkit-adversarial-reviewer`, whose contract is findings-only.)
>
> **⚠️ If you are an agent and not the owner, you MUST write the agent-closed marker** — see
> *The status vocabulary* below. **Cancelling is the least-audited path in fkit**: nobody reads
> `cancelled/`. An agent that cannot finish a task can make its own obligation disappear here, and the
> chance anyone notices is close to zero. Weigh that before you invoke this on your own work.


Mark a dropped task cancelled: move its brief into `ai-agents/tasks/cancelled/` and update the sprint
documentation so its status reads **⛔ Cancelled** — with a short **reason** — everywhere the task is
tracked. This is the sibling of `task-done`; the only differences are the destination folder, the
status marker, and that cancellation records *why* and flags what it leaves behind.

**Arguments:** `$ARGUMENTS` carries **two** parameters:
1. **Task file path** — the first whitespace-separated token (e.g.
   `ai-agents/tasks/backlog/fix-pagination-bug.md`). A bare filename is also
   acceptable — resolve it under `ai-agents/tasks/backlog/`.
2. **Cancellation reason** — **everything after the path**: the text explaining *why* the task was
   cancelled. It is recorded verbatim (trimmed to a concise line) in the sprint docs, so it must be a
   real rationale, not a placeholder.

> **Why this skill exists.** Task files are moved between `backlog/`, `done/`, and `cancelled/`
> **deliberately, after review** — never as a side effect of normal work. This skill is the *sanctioned*
> way to perform the cancel move: it updates every place the task is tracked and records *why*, so the
> board and the brief never drift apart. Invoking it is the signal that the task was deliberately dropped.
>
> **What it no longer is: a gate.** It used to run only when the owner invoked it. ADR-025 removed that
> **knowingly**. What replaces it is the `(agent-closed — not owner-verified)` marker, and **the marker
> is prose — nothing enforces it.**

## Resolve the status value FIRST

Before any edit, decide which marker this run writes — **every `⛔ Cancelled` in the steps below means
this resolved value, not the literal string**:

| You are | Marker to write |
|---|---|
| The **owner**, invoking this in a session | `⛔ Cancelled (YYYY-MM-DD) — <reason>` |
| **Any agent** — spawned, in a loop, or cancelling its own work | `⛔ Cancelled (agent-closed — not owner-verified) (YYYY-MM-DD) — <reason>` |

**If you are unsure which you are, you are an agent.** The date and reason stay mandatory in both
forms; the qualifier is prepended, never a substitute for them.

---

## Steps — do these in order

### 1. Resolve and validate the input
- Take the **first token** of `$ARGUMENTS` as the task file path and resolve it to a real file (if
  it's a bare filename, look in `ai-agents/tasks/backlog/`). Treat **everything after the path** as
  the cancellation **reason** (the second parameter — see step 2).
- **Stop with a clear message if:**
  - the file does not exist, or
  - it is not under `ai-agents/tasks/`, or
  - it is already in `ai-agents/tasks/cancelled/` (nothing to do — say so), or
  - it is in `ai-agents/tasks/done/` (it's already completed — this skill cancels *unfinished* work;
    **confirm with the owner** before cancelling something already marked done, rather than proceeding).
- If the path is empty, ask which task file to cancel. Do not guess.

### 2. Read the task file and establish the reason
Capture, for use in later steps and the final report:
- The **H1 title**.
- The **`## Sprint`** field (e.g. `Sprint 4`, or `Backlog` for a task on the unranked `backlog.md` board).
- Whether it declares a **`## Parent / Epic`** (a path to an epic file) — if so, this is a child slice
  and the epic's own status table is one of the places to update.
- The basename of the file (used to find references).
- The **cancellation reason** — the second parameter (the text after the path). **If it is empty,
  ask the owner for the reason before proceeding** — every cancelled entry in this project carries a
  rationale, and a cancel without one is poor record-keeping. Do not invent a reason.

### 3. Move the file to `cancelled/`
Use `git mv` so history is preserved:

```
git mv ai-agents/tasks/backlog/<file>.md ai-agents/tasks/cancelled/<file>.md
```

(If the file lives elsewhere under `ai-agents/tasks/`, move it from there.) **Do not commit** —
staging the move is enough; commits happen only when the owner explicitly asks.

### 4. Find every place the task is referenced
Search for the task's **basename** across everything under `ai-agents/` — status boards *and* prose:
- `ai-agents/sprints/*.md` (the sprint plans, and the unranked `backlog.md` board)
- **`ai-agents/sprints/done/*.md`** — **closed** sprint plans still *link* to tasks they carried over
- **`ai-agents/knowledge-base/`** — ADRs and reports routinely back-link the brief that spawned them
- `ai-agents/reviews/`, `ai-agents/plans/`, `ai-agents/worklogs/` — all key artifacts by task-id
- the parent epic file, if step 2 found a `## Parent / Epic`

```
grep -rn --exclude-dir=wiki-vault "<file>.md" ai-agents/
```

> **⚠️ Why the whole of `ai-agents/` and not a list of directories.** This sweep used to name
> `ai-agents/sprints/ ai-agents/tasks/` explicitly. That list was correct when written and **went
> stale**: `knowledge-base/` was never in it, and `plans/` + `worklogs/` did not yet exist (ADR-020
> added them). The movers therefore rotted links on every close, **by design**. Sweeping the parent
> directory with one named exclusion is self-maintaining.
>
> ### ⛔ `wiki-vault/` is excluded deliberately — do NOT "fix" this
>
> **Only `fkit-wiki` writes `ai-agents/wiki-vault/`** ([ADR-005](../../../ai-agents/knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
> A mover that re-pointed a vault link would breach that boundary. **If a vault link rots when a task
> moves, that is the wiki role's repair to make** — never reach in and fix it.

This grep is **recursive on purpose** — it reaches `sprints/done/`. Every hit it returns is handled in
step 5; **none is discarded.** A reference you found and did nothing about is a link you broke.

### 5. Update each tracked location to "Cancelled"
For every reference found in step 4:

- **Status-table row** (a `| … | <task> | <brief> |` line with a leading status cell): change the
  leading status marker to **`⛔ Cancelled`**, and fold the date + short reason into the description,
  matching the existing cancelled rows in the table (e.g. `⛔ Cancelled (YYYY-MM-DD) — <reason>`). Use
  today's date (from the session context). Trim any now-false fragment (e.g. `*(blocked: …)*`,
  `*(… next)*`).
- **Epic slice table** (parent epic, child slices): set this slice's **Status** cell to
  `⛔ Cancelled (YYYY-MM-DD) — <reason>`, mirroring how other cancelled slices in that table are
  formatted (e.g. the `⛔ Cancelled (2026-06-13) — see note` style). Update any prose "next slice" /
  ordering line that still points at the now-cancelled slice so it points at the genuinely-next one.
- **A `**Status:**` line** inside a task's own body section in the sprint plan: set it to
  `⛔ Cancelled (YYYY-MM-DD) — <reason>`.
- **A *link* to the brief whose status must NOT change** — most often a `➡️ Moved to Sprint N` row in a
  **closed** plan under `ai-agents/sprints/done/`, or a prose link anywhere: **re-point the href to the
  task's new path in `cancelled/`, and change nothing else on the line.**

  **A link is not a claim; it is a pointer.** `➡️ Moved to Sprint 2 — priority 7` is *historically
  true and stays exactly as written* — the status cell, the priority, the prose, all byte-identical.
  Only the href moves, because a pointer to a file that is no longer there is not history, it is rot.
  **This is a pointer repair, not a status update — never flip a `➡️ Moved` row to `⛔ Cancelled`.**

- **A hit in `ai-agents/knowledge-base/`** — an ADR or a report back-linking the brief that spawned it.
  **Re-point the href to the new path in `cancelled/`, and change nothing else on the line.** Identical
  treatment to a closed sprint plan, and for the identical reason: **a historical record's *claims* are
  frozen; its *links* are not.** An ADR that says "this was decided while task 42 was open" stays
  exactly as written — only the href moves. **Never** edit an ADR's prose, status, date, or decision
  text from this skill; if the surrounding sentence has become factually wrong, that is an ADR
  amendment and belongs to the architect, so **flag it in the report** instead.

  ⚠️ **Cancellation makes this sharper than completion does.** A knowledge-base record may cite this
  brief as the *reason* for a decision. Cancelling the task does **not** retract the ADR, and this
  skill must not imply that it does — repair the pointer, flag the tension, decide nothing.

- **A hit in `ai-agents/reviews/`, `plans/`, or `worklogs/`** — same rule: re-point the href, change
  nothing else. These are task-keyed records of what happened, not statements about where a file lives.

- **The moved brief's OWN outbound links** — the reciprocal case, and the one most easily missed. The
  brief you just moved has left `backlog/`, so any link *it* makes to a **sibling** brief
  (`](./other-task.md)`, or a bare `](other-task.md)`) no longer resolves from `cancelled/`. Re-point
  those to where the sibling actually is — usually `](../backlog/other-task.md)`.

  Briefs cross-link each other, so **one move breaks links in both directions**: inbound (handled
  above) *and* outbound (here). Fixing only the inbound half leaves the move half-done.

Make the **minimal** edit that flips the status accurately. Do not restructure tables or rewrite
descriptions beyond removing a fragment that is now false and adding the reason.

> **Yes, this writes into `ai-agents/sprints/done/`.** That is deliberate and owner-ruled: a closed
> sprint plan's *claims* are frozen, but its *links* stay live. Repair the href; touch nothing else.

**Now do this regardless of how many references step 4 found — even zero.** Since task 67 every brief
should have a row *somewhere* — a sprint plan, or the unranked `backlog.md` board — so **zero
references is now itself worth reporting**, not the expected case for unsprinted work. A hand-filed
brief may still have none. Either way, this step applies:

- **The moved brief's OWN `## Status` field** — the single line immediately below the `## Status`
  heading in the file you just moved into `cancelled/`. Set that line to the **full canonical marker**
  — `⛔ Cancelled (YYYY-MM-DD) — <reason>`, or the agent-closed form you resolved above — using **the
  exact same date and reason** you just wrote
  into the board (or, if step 4 found no board row at all, the same date and reason you are recording
  in this run's report). Use this **regardless of what the line previously held.** The brief must read
  the same marker the board reads (where a board exists); a bare `⛔ Cancelled` with no date/reason in
  the brief is nonconformant with the vocabulary. Touch only that one line — nothing else under the
  heading. If the value legitimately spans more than one line, that is outside this skill's authority to
  guess at — flag it in the report instead of partially rewriting it.

  This applies even if the line already *looks* like a cancelled marker with some other date/reason —
  step 1 already confirmed the file was **not** in `cancelled/` before you got here, so any such marker
  predates this run (stale hand-edit or old drift, not a prior pass of this same invocation) and must be
  overwritten to match this run, not preserved. **Idempotency comes from step 1, not from preserving
  old content here:** a genuine re-run means pointing this skill at the file's new `cancelled/` path,
  which step 1 already stops on ("already in `cancelled/` — nothing to do") before this bullet is ever
  reached — so a true re-run never touches this field at all, let alone twice.

  - **No `## Status` heading at all?** Do not invent one. Leave the heading absent and flag it in the
    report (step 8). If a board row was updated, use the exact wording `no ## Status field found in
    <brief> — board updated, brief header unchanged`. If step 4 found **no** board row either (the
    unsprinted case), do not claim "board updated" — say instead `no ## Status field found in <brief>
    — brief header unchanged (no sprint board reference existed to update)`. This is scoped to the
    `## Status` field alone — it does **not** exempt the brief from the outbound-link repair above; a
    status-less brief whose sibling links need re-pointing still gets that fix.

  This is the brief's *own* copy of its status, separate from whatever board update may have happened
  above. Where a board exists, both must be written and must carry the **same date and reason** — a
  brief reading a different reason than the board is exactly the nonconformance this fix must not
  introduce. Only the brief just moved is touched here — never a sweep repairing other briefs already
  sitting in `cancelled/`.

**Then prove it.** Resolve every relative markdown link in the files you touched **and** in the moved
brief. A move is not finished while a link it broke is still broken.

### 6. Flag downstream dependents — cancellation can orphan work
Unlike completion, cancelling a task can **break things that depended on it**. Surface (do **not**
auto-edit) anything now affected:
- Search for tasks/docs that name the cancelled task as a dependency — its basename in a
  **`## Depends on`** section, a `*(blocked: …)*` / `Depends …` annotation, a `Depends on` table
  column, or prose like "needs `<task>`".

  ```
  grep -rn --exclude-dir=wiki-vault "<file>.md\|<short task name>" ai-agents/
  ```

  **⚠️ This is the SECOND sweep in this skill, and it is the one most easily missed** — step 4's grep
  is the obvious one; this dependency search is a separate command that had the same too-narrow root
  set. Both were widened together. A dependency declared in an ADR, a design report, or a review
  ledger is exactly the kind of hit the old `tasks/ sprints/` pair could never see. Same `wiki-vault/`
  exclusion, same reason.

  #### ⚠️ Triage the results — the wider root set is much noisier, by design

  Measured on this repo, widening took a **basename** search from ~4 to ~17 hits, and a **short task
  name** search from ~381 to ~1527. The recall is the point; the volume is the cost. **Read it in this
  order, and do not skim** — skimming 1500 lines is how a real dependent gets missed, which is the
  failure this sweep exists to prevent:

  1. **Basename hits first (`<file>.md`).** Precise and few. These are near-certainly real references.
     Handle every one.
  2. **Then short-name hits, filtered to the ones that read as a dependency** — near `Depends on`,
     `blocked`, `needs`, `waits on`, or a task-table row. A short task name appearing in ordinary prose
     usually is not a dependency claim.
  3. **Historical records (`knowledge-base/`, `reviews/`, `plans/`, `worklogs/`) are usually
     narrative, not dependency.** An ADR mentioning the task is recording history, not declaring a
     block. Read them, but expect most to need no action beyond the href repair from step 4.

  **If the short-name search is too noisy to read honestly, say so in the report** and fall back to the
  basename results — an explicit "I triaged basenames only, short-name search returned N hits and was
  not exhaustively read" is a true statement the owner can act on. Silently skimming and implying full
  coverage is not.
- **List each dependent in the report** as "now affected — may need re-scoping or its own cancel,"
  so the owner can decide. Do not silently rewrite dependents; cancellation ripple is a judgment call.

### 7. Handle ambiguity — never paper over it
- **No reference found** in any sprint doc: complete the move, then **report that no sprint status row
  was found** so the owner knows nothing else changed.
- **Multiple references:** update **all** status markers and list each in the report.
- **`## Sprint` says a sprint, but that sprint plan has no matching row:** report the mismatch rather
  than inventing a row.
- If anything is genuinely unclear (e.g. two tasks share a near-identical name), stop and ask.

### 8. Report
Give a concise summary:
- **Moved:** `<old path>` → `ai-agents/tasks/cancelled/<file>.md`
- **Reason:** the one-line cancellation reason recorded.
- **Updated:** each doc touched and how (e.g. "`sprint-4.md` — status row → ⛔ Cancelled";
  "`<epic>.md` — T# slice → ⛔ Cancelled").
- **Brief's own status header:** state what happened to the moved brief's `## Status` field — set to
  the full marker you resolved (owner or agent-closed form), including flagging it if it overwrote a
  pre-existing, different cancelled-shaped marker (stale drift, not this run's own no-op) — or the
  missing-heading flag from above, using whichever of its two wordings applies (board updated, or no
  board reference existed). This runs even when step 4 found zero references — say so if it did. The
  owner should see this happened, not just infer it.
- **Re-pointed links:** every href repaired, and where — **including any closed plan under
  `sprints/done/`** (e.g. "`sprints/done/sprint-1.md:37` — href → `tasks/cancelled/`; status cell
  untouched"). A move that rewrote a closed sprint plan must be **visible in this report**, never a
  surprise found later by a link sweep. If none were re-pointed, say so.
- **Knowledge-base hits, called out separately** — list every href repaired under
  `ai-agents/knowledge-base/` on its own (e.g. "`knowledge-base/decisions/adr-029-….md:88` — href →
  `tasks/cancelled/`; ADR prose untouched"). These are edits to *historical records*, so they get the
  same distinct visibility as `sprints/done/` rather than being folded into a general count. Same for
  `reviews/`, `plans/`, and `worklogs/` hits. If there were none, say so.
- **Vault links NOT touched:** if the task seems likely to be referenced from `ai-agents/wiki-vault/`,
  say so and name it as **fkit-wiki's** repair — this skill deliberately does not sweep or edit the
  vault (ADR-005). Do not assert whether vault links actually rotted; this skill did not look.
- **Dependents flagged:** anything that depended on the cancelled task and may now need attention.
- **Other flags:** no sprint row found, mismatch, multiple matches, or a request to cancel a
  done task.
- Remind that **this skill** made no commit — it leaves the move + edits in the working tree. Do not claim
  the repository has uncommitted work, or that anything is or isn't committed — this skill has not
  checked, and the owner may have committed between turns. If commit state matters to the report, run
  `git status` first. (See
  [`conventions/evidence-before-assertion.md`](../../../ai-agents/knowledge-base/conventions/evidence-before-assertion.md).)

---

## Rules
- **Do not commit** anything (the project rule: commit only when the owner explicitly asks).
- Only ever move the task **into `cancelled/`** — this skill does not handle completion (`done/`).
- Always record a **reason**; surface **dependents**; keep edits minimal and accurate; surface
  anything uncertain instead of guessing.

## The status vocabulary

The canonical status set is documented in **`ai-agents/knowledge-base/conventions/task-status-vocabulary.md`**
— it is the source of truth, and this skill writes exactly one of its two cancelled values:

> **`⛔ Cancelled (YYYY-MM-DD) — <reason>`** (owner), or
> **`⛔ Cancelled (agent-closed — not owner-verified) (YYYY-MM-DD) — <reason>`** (any agent) — the date
> and the reason are **mandatory** in both forms, not optional decoration. A cancellation with no
> stated cause cannot be acted on by anyone but the person who wrote it.
>
> ⚠️ **The qualifier contains an em-dash of its own, so it does NOT satisfy the reason requirement.**
> `⛔ Cancelled (agent-closed — not owner-verified) (2026-07-19)` with nothing after it is **invalid**,
> and the dashboard's `cancelled-without-reason` lint cannot catch it. Write a real reason after a
> final ` — `.

**`Cancelled` is skill-gated, not owner-gated.** It may be set **only** by this skill — never by
hand-editing a file — but **any agent may run this skill** (ADR-025). Cancelling work is still a
judgment about whether it will ever be done; what changed is that an agent is now allowed to make that
judgment, not that the judgment got smaller.

⚠️ **The agent-closed marker is the entire residual mechanism, and it is unenforced.** No code path
checks it. **Apply it whenever you are not the owner.**

⚠️ **The marker does not show up in `/fkit-status`.** The dashboard matches the `⛔` prefix and
collapses every variant to plain `cancelled`, then filters the row off the open board. Known, accepted,
recorded in ADR-025's honesty clause — **not** a defect to file.

⚠️ **`cancelled/` is audited by nobody.** ADR-025 records this as the relaxation's sharpest cost: a
false `done` is caught when someone uses the feature, but a false `cancelled` may never be caught at
all. If you are an agent cancelling your own task, that asymmetry is working against the record.
