---
name: fkit-wiki-sync
description: The wiki librarian's sync procedure — detect what changed under ai-agents/ since the last sync (via the .wiki-watermark commit SHA) and ingest only the delta. Optional argument — a date (YYYY-MM-DD) overriding the since-point, or 'force' to re-ingest everything. The wiki role is the exclusive write gateway for the vault.
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

**Keep:** `ai-agents/sprints/*.md`, `ai-agents/sprints/done/*.md`, `ai-agents/tasks/done/*.md`,
`ai-agents/tasks/cancelled/*.md`, `ai-agents/knowledge-base/*.md` (including `decisions/`).

**Skip:** `ai-agents/wiki-vault/**` (wiki output, not a source); `ai-agents/tasks/backlog/*.md` (not
done yet — a page would be premature); files only renamed, not modified.

If the filtered list is empty → report *"Wiki is up to date — no ingest-worthy changes since
`<since>`."* and stop.

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

## Hard rules

- **`schema.md` is ground truth.** **Never invent knowledge** — flag gaps.
- **Write only inside `ai-agents/wiki-vault/`** (the watermark lives there too).
- No secrets in any page. **Never commit or push.**
