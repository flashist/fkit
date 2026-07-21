---
name: fkit-task-done
description: Mark a task complete — move its brief file into ai-agents/tasks/done/ and update the sprint plan (and parent epic, if any) so the task's status reads Done. Takes the path to the task file as its argument. Use when a task has been reviewed/verified and is finished.
---

# Task Done

> ## ⛔ Owner: the **producer** — but **any agent may invoke it**
> This is the fkit-producer's procedure and it lives in the producer's namespace. Since
> [ADR-025](../../../ai-agents/knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md)
> it is **not owner-only**: any spawned fkit role may run it, including the coder closing its own task.
> (The one exception is `fkit-adversarial-reviewer`, whose contract is findings-only.)
>
> **⚠️ If you are an agent and not the owner, you MUST write the agent-closed marker** — see
> *The status vocabulary* below. That marker is the only trace that no human checked this work.


Mark a finished task complete: move its brief into `ai-agents/tasks/done/` and update the sprint
documentation so its status reads **✅ Done**, everywhere the task is tracked.

**Argument:** `$ARGUMENTS` — the path to the task brief file (e.g.
`ai-agents/tasks/backlog/0042-add-export-endpoint/brief.md`). A bare filename
(`add-export-endpoint.md`) is also acceptable — resolve it under
`ai-agents/tasks/backlog/`.

> **Why this skill exists.** Task files are moved between `backlog/`, `done/`, and `cancelled/`
> **deliberately, after review** — never as a side effect of normal work. This skill is the *sanctioned*
> way to perform that move: it updates every place the task is tracked, so the board and the brief never
> drift apart. Invoking it is the signal that the task is genuinely complete.
>
> **What it no longer is: a gate.** It used to run only when the owner invoked it, and that was the
> whole anti-laundering protection — an agent that can mark its own work complete can quietly launder
> unfinished work into a green board. ADR-025 removed that protection **knowingly**. What replaces it is
> the `(agent-closed — not owner-verified)` marker, and **the marker is prose — nothing enforces it.**
> If you are an agent, applying it honestly is the entire safeguard, and it rests on you.

## Resolve the status value FIRST

Before any edit, decide which marker this run writes — **every `✅ Done` in the steps below means this
resolved value, not the literal string**:

| You are | Marker to write |
|---|---|
| The **owner**, invoking this in a session | `✅ Done` |
| **Any agent** — spawned, in a loop, or closing its own work | `✅ Done (agent-closed — not owner-verified)` |

**If you are unsure which you are, you are an agent.** The owner does not need to wonder.

---

## Steps — do these in order

### 1. Resolve and validate the input
- Resolve `$ARGUMENTS` to a real task **folder** — the brief path
  `ai-agents/tasks/<board>/<NNNN>-<slug>/brief.md`, or a bare folder name / slug, resolves to the
  folder (a bare name is looked up under `ai-agents/tasks/backlog/`, then the other boards).
- **Stop with a clear message if:**
  - the file does not exist, or
  - it is not under `ai-agents/tasks/`, or
  - it is already in `ai-agents/tasks/done/` (nothing to do — say so). **One exception: the
    owner-verification upgrade.** If you are the **owner** and the brief's `## Status` reads
    `✅ Done (agent-closed — not owner-verified)`, do **not** stop — continue, skipping the move (the
    file is already in place) and performing the status updates only, so the qualifier is cleared
    everywhere it appears. An agent hitting this case still stops: only the owner can upgrade. Or
  - it is in `ai-agents/tasks/cancelled/` (this skill is for completion, not cancellation — flag it).
- If `$ARGUMENTS` is empty, ask which task file to mark done. Do not guess.

### 2. Read the task file to learn its context
Capture, for use in later steps and the final report:
- The **H1 title**.
- The **`## Sprint`** field (e.g. `Sprint 4`, or `Backlog` for a task on the unranked `backlog.md` board).
- Whether it declares a **`## Parent / Epic`** (a path to an epic file) — if so, this is a child slice
  and the epic's own status table is one of the places to update.
- The **task-folder name** `<NNNN>-<slug>` (the brief is `<folder>/brief.md`). The folder name — not
  `brief.md`, which is the same for every task — is the token used to find references.

### 3. Move the task FOLDER to `done/`
Since ADR-029 a task is a **folder**, not a lone file. Move the whole folder (brief + any `plan.md` /
`worklog.md` / `review.md` / `assets/` inside it) with `git mv` so history is preserved:

```
git mv ai-agents/tasks/backlog/<NNNN>-<slug> ai-agents/tasks/done/<NNNN>-<slug>
```

(If the folder lives somewhere else under `ai-agents/tasks/`, move it from there.) **Do not commit** —
staging the move is enough; commits happen only when the owner explicitly asks.

### 4. Find every place the task is referenced
Search for the task's **folder name** `<NNNN>-<slug>` across everything under `ai-agents/` — status
boards *and* prose. Inbound links now point at `tasks/<board>/<NNNN>-<slug>/brief.md`, so the folder
name is the stable token (never grep `brief.md` — every task shares it):
- `ai-agents/sprints/*.md` (the sprint plans, and the unranked `backlog.md` board)
- **`ai-agents/sprints/done/*.md`** — **closed** sprint plans still *link* to tasks they carried over
- **`ai-agents/knowledge-base/`** — ADRs and reports routinely back-link the brief that spawned them
- **`ai-agents/tasks/`** itself — since ADR-029 the plans, worklogs and review ledgers live **inside**
  the task folders (`plan.md` / `worklog.md` / `review.md`), and briefs cross-link each other; the
  top-level `plans/` `worklogs/` `reviews/` directories no longer exist
- **`ai-agents/sprints/reviews/`** — sprint-keyed review ledgers may reference the task
- the parent epic file, if step 2 found a `## Parent / Epic`

```
grep -rn --exclude-dir=wiki-vault "<NNNN>-<slug>" ai-agents/
```

This grep is **recursive on purpose** — it reaches `sprints/done/`. Every hit it returns is handled in
step 5; **none is discarded.** A reference you found and did nothing about is a link you broke.

> **⚠️ Why the whole of `ai-agents/` and not a list of directories.** This sweep used to name
> `ai-agents/sprints/ ai-agents/tasks/` explicitly. That list was correct when written and **went
> stale**: `knowledge-base/` was never in it, and `plans/` + `worklogs/` did not yet exist (ADR-020
> added them). The movers therefore rotted links on every close, **by design**. Sweeping the parent
> directory with one named exclusion is self-maintaining — a new sibling directory is covered the day
> it appears, with nobody having to remember this file.
>
> ### ⛔ `wiki-vault/` is excluded deliberately — do NOT "fix" this
>
> **Only `fkit-wiki` writes `ai-agents/wiki-vault/`** ([ADR-005](../../../ai-agents/knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
> A mover that re-pointed a vault link would breach that boundary — so this sweep must not surface
> vault hits it has no authority to repair. **If a vault link rots when a task moves, that is the wiki
> role's repair to make**, via `/fkit-wiki-lint` or a sync. Say so in the report if it seems likely;
> never reach in and fix it.

### 5. Update each tracked location to "Done"
For every reference found in step 4:

- **Status-table row** (a `| … | <task> | <brief> |` line with a leading status cell): change the
  leading status marker to **`✅ Done`**. Use the same emoji/wording the table already uses for other
  done rows. If the row's description carries a now-stale note like `*(blocked: …)*` or
  `*(… next)*`, trim just that stale fragment — keep the rest of the description intact.
- **Epic slice table** (parent epic, child slices): set this slice's **Status** cell to `✅ Done`
  (mirror the existing done-row format, e.g. `✅ Done (PR #NN)` if a PR number is known; otherwise
  plain `✅ Done`). Update any prose "next slice" / ordering line in the epic that still points at the
  just-completed slice so it points at the genuinely-next one.
- **A `**Status:**` line** inside a task's own body section in the sprint plan: set it to `✅ Done`.
- **A *link* to the brief whose status must NOT change** — most often a `➡️ Moved to Sprint N` row in a
  **closed** plan under `ai-agents/sprints/done/`, or a prose link anywhere: **re-point the href to the
  task's new path in `done/`, and change nothing else on the line.**

  **A link is not a claim; it is a pointer.** `➡️ Moved to Sprint 2 — priority 7` is *historically
  true and stays exactly as written* — the status cell, the priority, the prose, all byte-identical.
  Only the href moves, because a pointer to a file that is no longer there is not history, it is rot.
  **This is a pointer repair, not a status update — never flip a `➡️ Moved` row to `✅ Done`.**

- **A hit in `ai-agents/knowledge-base/`** — an ADR or a report back-linking the brief that spawned it.
  **Re-point the href to the new path in `done/`, and change nothing else on the line.** Identical
  treatment to a closed sprint plan, and for the identical reason: **a historical record's *claims* are
  frozen; its *links* are not.** An ADR that says "this was decided while task 42 was open" stays
  exactly as written — only the href moves. **Never** edit an ADR's prose, status, date, or decision
  text from this skill; if the surrounding sentence has become factually wrong, that is an ADR
  amendment and belongs to the architect, so **flag it in the report** instead.

- **A hit in a sibling task folder's `plan.md`, `worklog.md` or `review.md`, or in
  `ai-agents/sprints/reviews/`** — same rule: re-point the href, change nothing else. Since ADR-029
  these task-keyed records live inside the task folders (the old top-level `reviews/` `plans/`
  `worklogs/` directories are gone); a sprint-keyed ledger lives in `sprints/reviews/`. They record
  what happened, not where a file lives.

- **The moved folder's OWN outbound links** — the reciprocal case, and the one most easily missed. The
  brief you just moved has left `backlog/`, so any link *it* (or its `plan.md`/`worklog.md`/`review.md`)
  makes to a **sibling** task no longer resolves from `done/`. A sibling link now targets another
  folder's brief — `](../<other-NNNN-slug>/brief.md)` from a peer on the same board, or
  `](../../backlog/<other-NNNN-slug>/brief.md)` across boards. Re-point to where the sibling actually
  is, minding the extra folder level the new layout adds to every relative depth.

  Briefs cross-link each other, so **one move breaks links in both directions**: inbound (handled
  above) *and* outbound (here). Fixing only the inbound half leaves the move half-done.

Make the **minimal** edit that flips the status accurately. Do not restructure tables or rewrite
descriptions beyond removing a fragment that is now false.

> **Yes, this writes into `ai-agents/sprints/done/`.** That is deliberate and owner-ruled: a closed
> sprint plan's *claims* are frozen, but its *links* stay live. Repair the href; touch nothing else.

**Now do this regardless of how many references step 4 found — even zero.** Since task 67 every brief
should have a row *somewhere* — a sprint plan, or the unranked `backlog.md` board — so **zero
references is now itself worth reporting**, not the expected case for unsprinted work. A hand-filed
brief may still have none. Either way, this step applies:

- **The moved brief's OWN `## Status` field** — the single line immediately below the `## Status`
  heading in the file you just moved into `done/`. Set that line to `✅ Done`, the same canonical
  marker the vocabulary defines (see below). Touch only that one line — nothing else under the heading.
  If the value legitimately spans more than one line, that is outside this skill's authority to guess
  at — flag it in the report instead of partially rewriting it.

  - **Already reads the marker you would write?** Leave it byte-identical — no second marker, no
    appended line. Re-running this skill on an already-done brief must be a no-op here.
  - **Already `✅ Done` and you are an agent?** No-op. **Never downgrade an owner-closed task to
    agent-closed** — the owner's verification is not yours to erase.
  - **Already `✅ Done (agent-closed — not owner-verified)` and you are the OWNER?** Replace it with
    plain `✅ Done` and say so in the report. A human has now checked the work, which is exactly what
    the qualifier said had not happened — this is the one legitimate upgrade path.
  - **Reads anything else** (`🔲 Backlog`, `🔄 In progress`, `🚧 Blocked — …`, etc.)? Replace it with
    `✅ Done`.
  - **No `## Status` heading at all?** Do not invent one. Leave the heading absent and flag it in the
    report (step 7). If a board row was updated, use the exact wording `no ## Status field found in
    <brief> — board updated, brief header unchanged`. If step 4 found **no** board row either (the
    unsprinted case), do not claim "board updated" — say instead `no ## Status field found in <brief>
    — brief header unchanged (no sprint board reference existed to update)`. This is scoped to the
    `## Status` field alone — it does **not** exempt the brief from the outbound-link repair above; a
    status-less brief whose sibling links need re-pointing still gets that fix.

  This is the brief's *own* copy of its status, separate from whatever board update may have happened
  above. Where a board exists, a brief that still reads `🔲 Backlog` internally while the board reads
  `✅ Done` is exactly the drift this skill exists to prevent. Only the brief just moved is touched
  here — never a sweep repairing other briefs already sitting in `done/`.

**Then prove it.** Resolve every relative markdown link in the files you touched **and** in the moved
brief. A move is not finished while a link it broke is still broken.

### 6. Handle ambiguity — never paper over it
- **No reference found** in any sprint doc: the task may be unsprinted / backlog-only. Complete the
  move, then **report that no sprint status row was found** so the owner knows nothing else changed.
- **Multiple references** (e.g. sprint plan + epic + `backlog.md`): update **all** of them and
  list each in the report.
- **`## Sprint` says a sprint, but that sprint plan has no matching row:** report the mismatch rather
  than inventing a row.
- If anything is genuinely unclear (e.g. two different tasks share a near-identical name), stop and
  ask rather than editing the wrong row.

### 7. Report
Give a concise summary:
- **Moved:** `<old folder>` → `ai-agents/tasks/done/<NNNN>-<slug>/`
- **Updated:** each doc touched and how (e.g. "`sprint-4.md` — status row → ✅ Done";
  "`refactor-auth-flow.md` — T4f slice → ✅ Done").
- **Brief's own status header:** state what happened to the moved brief's `## Status` field — set to
  `✅ Done`, already read `✅ Done` (no change needed), or the missing-heading flag from step 5, using
  whichever of its two wordings applies (board updated, or no board reference existed). This runs even
  when step 4 found zero references — say so if it did. The owner should see this happened, not just
  infer it.
- **Re-pointed links:** every href repaired, and where — **including any closed plan under
  `sprints/done/`** (e.g. "`sprints/done/sprint-1.md:37` — href → `tasks/done/`; status cell
  untouched"). A move that rewrote a closed sprint plan must be **visible in this report**, never a
  surprise found later by a link sweep. If none were re-pointed, say so.
- **Knowledge-base hits, called out separately** — list every href repaired under
  `ai-agents/knowledge-base/` on its own (e.g. "`knowledge-base/decisions/adr-029-….md:88` — href →
  `tasks/done/`; ADR prose untouched"). These are edits to *historical records*, so they get the same
  distinct visibility as `sprints/done/` rather than being folded into a general count. Same for
  `reviews/`, `plans/`, and `worklogs/` hits. If there were none, say so.
- **Vault links NOT touched:** if the task seems likely to be referenced from `ai-agents/wiki-vault/`,
  say so and name it as **fkit-wiki's** repair — this skill deliberately does not sweep or edit the
  vault (ADR-005). Do not assert whether vault links actually rotted; this skill did not look.
- **Flagged:** anything not auto-resolved (no sprint row found, mismatch, multiple matches).
- Remind that **this skill** made no commit — it leaves the move + edits in the working tree. Do not claim
  the repository has uncommitted work, or that anything is or isn't committed — this skill has not
  checked, and the owner may have committed between turns. If commit state matters to the report, run
  `git status` first. (See
  [`conventions/evidence-before-assertion.md`](../../../ai-agents/knowledge-base/conventions/evidence-before-assertion.md).)

---

## Rules
- **Do not commit** anything (the project rule: commit only when the owner explicitly asks).
- Only ever move the task **into `done/`** — this skill does not handle cancellation (`cancelled/`).
- Keep edits minimal and accurate; surface anything uncertain instead of guessing.

## The status vocabulary

The canonical status set is documented in **`ai-agents/knowledge-base/conventions/task-status-vocabulary.md`**
— it is the source of truth, and this skill writes exactly one value from it:

> **`✅ Done`** — or, when an agent performs the close,
> **`✅ Done (agent-closed — not owner-verified)`**. Nothing else. Not "Complete", not "Finished",
> not "✔️".

**`Done` is skill-gated, not owner-gated.** It may be set **only** by this skill — never by
hand-editing a file — but **any agent may run this skill** (ADR-025). The old owner-only gate was the
anti-laundering protection; it is gone, and nothing structural replaced it.

⚠️ **The agent-closed marker is the entire residual mechanism, and it is unenforced.** No code path
checks it. The same agent that would wrongly close a task is the agent deciding whether to label the
close — so the label is worth exactly what your honesty is worth. **Apply it whenever you are not the
owner.**

⚠️ **The marker does not show up in `/fkit-status`.** The dashboard matches the `✅` prefix and
collapses every variant to plain `done`, then filters the row off the open board. Distinguishing
agent-closed from owner-closed means opening the sprint plan or the brief. Known, accepted, recorded in
ADR-025's honesty clause — **not** a defect to file.
