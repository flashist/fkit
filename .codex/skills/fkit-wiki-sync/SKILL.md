---
name: fkit-wiki-sync
description: "Sync the nimbus wiki at ai-agents/wiki-vault/ by detecting what changed in non-wiki ai-agents/ sources since the last ingest and ingesting only the delta. Use when asked to sync or update the wiki. Optional argument: a date (YYYY-MM-DD) to override the auto-detected since-date, or 'force' to re-ingest all non-wiki ai-agents sources."
---
<!-- fkit:generated source=fkit-wiki-sync version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# Wiki Sync

Sync the nimbus wiki at `ai-agents/wiki-vault/` by detecting what changed in non-wiki `ai-agents/` sources since the last ingest and ingesting only the delta.

The optional argument can be:
- A date in `YYYY-MM-DD` format to override the auto-detected since-date
- `force` to re-ingest all `ai-agents/` files

## Instructions

### Step 1 — Determine the sync window

If the argument contains a date (YYYY-MM-DD format), use `git log --since="<date>"` in Step 2.

If the argument is `force`, skip to Step 2 and list all files under `ai-agents/` except `ai-agents/wiki-vault/`.

Otherwise, check `ai-agents/wiki-vault/.wiki-watermark` for a commit SHA written by the previous successful sync:
- **If the file exists and contains a SHA:** use that SHA as the base in Step 2 (`git log <sha>..HEAD`). This is exact — it picks up every commit since the last sync regardless of when it ran.
- **If the file is missing (first run or reset):** treat this as `force` — skip git and list all eligible `ai-agents/` files so no history is missed.

### Step 2 — Find changed files

Run one of:
```
git log <sha>..HEAD --diff-filter=AMR --name-only --format="" -- ai-agents/ ':!ai-agents/wiki-vault/'   # watermark mode
git log --since="<date>" --diff-filter=AMR --name-only --format="" -- ai-agents/ ':!ai-agents/wiki-vault/'  # date-override mode
```

Or, for force / first-run: list all files under `ai-agents/` except `ai-agents/wiki-vault/`.

Deduplicate the results (a file may appear in multiple commits). This is the candidate list.

### Step 3 — Filter to ingest-worthy files

From the candidate list, keep only:
- `ai-agents/sprints/*.md` — sprint plan files (new sprints or updated sprint status)
- `ai-agents/sprints/done/*.md` — completed sprint files
- `ai-agents/tasks/done/*.md` — completed task briefs
- `ai-agents/tasks/cancelled/*.md` — cancelled tasks (check if already covered in `wiki/decisions/cancelled-tasks.md` before creating a new page)
- `ai-agents/knowledge-base/*.md` — investigation findings and reference documents

Skip:
- `ai-agents/wiki-vault/**` — wiki output, not an ingest source
- `ai-agents/tasks/backlog/*.md` — not yet done, wiki page premature
- Any file that is identical in content to what was already ingested (use git log to check if the file was only renamed, not modified)

If the filtered list is empty: report "Wiki is up to date — no ingest-worthy changes since <since-date>." and stop.

### Step 4 — Read the wiki schema and index

Read `ai-agents/wiki-vault/schema.md` for page templates and conventions.
Read `ai-agents/wiki-vault/index.md` to know what pages already exist.

### Step 5 — Ingest each changed file

For each file in the filtered list:

a. Read the source file fully.
b. Determine which wiki page type it maps to (feature / system / decision / task).
c. Check if a wiki page already exists for this topic.
   - **If yes:** update it — incorporate any new status, decisions, or findings. Do not remove content that is still accurate; add or correct only what changed.
   - **If no:** create it following the template in schema.md.
d. Update the one-line entry in `ai-agents/wiki-vault/index.md` (add if new, update description if changed).
e. Add or update cross-links in related pages (bidirectional).

### Step 6 — Targeted lint on changed pages only

For each page created or updated in Step 5:
- Check that all wiki-links in the page resolve to existing index entries
- Check that linked pages have a back-link to this page
- Fix any one-way links found

### Step 7 — Update watermark and log.md

Run `git rev-parse HEAD` and write the resulting SHA to `ai-agents/wiki-vault/.wiki-watermark` (overwrite, single line). This is the precise resume point for the next sync.

Append a single entry to `ai-agents/wiki-vault/log.md`:

```
## YYYY-MM-DD — ingest
- Sync window: <watermark-sha-or-date> → HEAD (<new-sha>)
- Changed source files detected: N
- Ingested: `<path>` → created/updated [[wiki/<path>]]
  (one line per file processed)
- Skipped (already covered): list any files skipped with reason
```

Use today's date.

### Step 8 — Report

Output a concise summary:
- Sync window (date range checked)
- N source files changed, M pages created, K pages updated
- List the pages touched
- Any issues that require human review (flag with ⚠️)
