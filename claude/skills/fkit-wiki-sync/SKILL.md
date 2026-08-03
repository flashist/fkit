---
name: fkit-wiki-sync
description: >-
  The wiki librarian's sync procedure — detect what changed under ai-agents/ since the last sync
  (via the .wiki-watermark commit SHA) and ingest only the delta. Optional argument — a date
  (YYYY-MM-DD) overriding the since-point, or 'force' to re-ingest everything. The wiki role is the
  exclusive write gateway for the vault.
---

# Wiki Sync — the wiki librarian's procedure

> ## ⛔ Owner: the **wiki** role
> This procedure **writes** `ai-agents/wiki-vault/` (including the watermark), and only the wiki role
> may do that. Execute it **only** if you are the wiki — running as the `fkit-wiki` agent or in a
> `fkit wiki` session.
>
> **Any other role: do not execute this.** Ask the librarian:
> ```
> @fkit-wiki Run your sync procedure.
> ```

Detect what changed under `ai-agents/` since the last sync and ingest **only the delta**.

**Argument:** `$ARGUMENTS` — optional. Either a date in `YYYY-MM-DD` format (overrides the
auto-detected since-point), or `force` (re-ingest all non-wiki `ai-agents/` sources).

## Step 1 — Determine the sync window

- **Date given** → use `git log --since="<date>"` in Step 2.
- **`force`** → skip git; list all eligible `ai-agents/` files.
- **Otherwise** → read `ai-agents/wiki-vault/.wiki-watermark` (the commit SHA written by the last
  successful sync):
  - **exists with a SHA** → use `git log <sha>..HEAD` — exact, picks up every commit since the last
    sync regardless of when it ran.
  - **missing** (first run or reset) → treat as `force`, so no history is missed.

## Step 2 — Find changed files

```
git log <sha>..HEAD --diff-filter=AMR --name-only --format="" -- ai-agents/ ':!ai-agents/wiki-vault/'
git log --since="<date>" --diff-filter=AMR --name-only --format="" -- ai-agents/ ':!ai-agents/wiki-vault/'
```
Deduplicate (a file may appear in several commits). That's the candidate list.

## Step 3 — Filter to ingest-worthy files

**Keep:** `ai-agents/sprints/*.md`, `ai-agents/sprints/done/*.md`, `ai-agents/sprints/reviews/*.md`,
the briefs of done/cancelled tasks `ai-agents/tasks/{done,cancelled}/*/brief.md`,
`ai-agents/knowledge-base/*.md` (including `decisions/`). Since ADR-029 a task is a **folder**; ingest
its `brief.md`, not the sibling `plan.md` / `worklog.md` / `review.md`.

**Skip:** `ai-agents/wiki-vault/**` (wiki output, not a source); `ai-agents/tasks/backlog/*/brief.md`
(not done yet — a page would be premature); the in-folder `plan.md` / `worklog.md` / `review.md`
(working artifacts, not sources); files only renamed, not modified.

If the filtered list is empty → report *"Wiki is up to date — no ingest-worthy changes since
`<since>`."*, then **skip Steps 4–8 and go straight to Step 9.** Do **not** stop here: an idle sync
still runs the flag step, so it still emits a flag line (normally the "no tracked task" line). Stopping
at this line instead is the exact path task 0108 arose from — six batched syncs whose completion was
never surfaced anywhere the board could see.

## Step 4 — Read the schema and index

Read `ai-agents/wiki-vault/schema.md` (templates and conventions) and `index.md` (existing pages).

## Step 5 — Ingest each changed file

Same mechanics as the **fkit-wiki-ingest** procedure: read the source fully; map it to a page type
(feature / system / decision / task); **update** an existing page (incorporate what changed; don't
remove what's still accurate) or **create** it from the schema template; update the `index.md` entry;
add/update **bidirectional** cross-links.

## Step 6 — Targeted lint on the changed pages only

For each page created or updated in Step 5: check that its wiki-links resolve to existing index
entries, and that linked pages link back. Fix any one-way links.

## Step 7 — Update the watermark and log

Run `git rev-parse HEAD` and write the SHA to `ai-agents/wiki-vault/.wiki-watermark` (overwrite, single
line) — the precise resume point for the next sync. Then append to `log.md`, using today's real date:

```
## YYYY-MM-DD — ingest
- Sync window: <watermark-sha-or-date> → HEAD (<new-sha>)
- Changed source files detected: N
- Ingested: `<path>` → created/updated [[wiki/<path>]]
  (one line per file processed)
- Skipped (already covered): <files skipped, with reason>
```

## Step 8 — Report

The sync window checked; N source files changed, M pages created, K pages updated; the pages touched;
anything needing human review (⚠️).

## Step 9 — Flag any completed tracked task — close nothing

**The wiki closes nothing and moves no task file.** Since **ADR-033** the task movers
(`/fkit-task-done`, `/fkit-task-cancelled`) are the **producer's alone** — the wiki does not hold
them, and the ADR-018 hook denies a mover call from a wiki identity at any spawn depth. The wiki's
completion signal is a **flag in this report**, and nothing else. (`log.md` is not a signal: no board
tool reads it. That is exactly why task 80's vault work sat `🔄 In progress` on the board for a week.)

**Which tasks to consider** — any tracked task this operation may have completed:
- one the caller named when invoking this procedure; **and**
- any brief under `ai-agents/tasks/backlog/*/brief.md` whose `## Owner` is `fkit-wiki` and whose
  `## Status` is not `✅ Done` — read each and apply the rule below.

**The rule: is that brief's deliverable *this* vault work?** Three outcomes, and the third is the
common one:
- **Fully** → complete.
- **In part, or this run served it and you cannot tell whether that finished it** → **partial**.
  Never resolve that doubt as complete.
- **Unrelated to this run** → **say nothing about it at all.** Most considered briefs land here, and
  they produce no line. A brief is not "uncertain" merely because you read it: uncertainty means this
  run *touched* its deliverable and you cannot tell whether that completed it.

**End the report with one line per task that came out complete or partial, in exactly this form:**
- complete → `Task <NNNN>'s vault work is complete — ready to close`
- partial or uncertain → `Task <NNNN>: partial — not ready to close`

**`<NNNN>` is the task folder name's four-digit prefix** (equivalently the brief's `## ID`) — and the
task's only identity. It is **never** the sprint
board's rank / `P<n>` Priority cell, which is mutable and re-ranked; see
`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`. It is also **never** a line
number — write no `:NNN` coordinate in a flag. Substitute real values.

**If that produced no lines at all**, write the single line `No tracked task completed by this run.`
**Never invent a task to have something to flag.**

These lines are the **last** thing in the report. A caller who summarizes this report **carries them
verbatim** — a dropped flag is the whole bug this exists to fix.

**Then stop.** Do not invoke a mover, do not edit the brief, do not touch the sprint plan, and do not
spawn the producer to close it yourself. Routing the close is the **caller's** next move, not yours:
`@fkit-producer Run /fkit-task-done on <brief path>`.

## Hard rules

- **`schema.md` is ground truth.** **Never invent knowledge** — flag gaps.
- **Write only inside `ai-agents/wiki-vault/`** (the watermark lives there too).
- **Close nothing.** The wiki does not hold the task movers (ADR-033) and never invokes one, never
  moves a task file, and never edits a brief or the sprint plan. It **flags**; the producer closes.
- No secrets in any page. **Never commit or push.**
