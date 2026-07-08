---
name: fkit-wiki-ingest
description: Ingest one or more sources into the project wiki at ai-agents/wiki-vault/. Use when asked to add, update, or sync wiki pages from source files, tasks, or knowledge-base documents. Accepts a file path, directory path, or keyword: 'all tasks', 'knowledge-base', 'architecture'.
---

# Wiki Ingest

Ingest one or more sources into the project wiki at `ai-agents/wiki-vault/`.

**Argument:** `$ARGUMENTS` — a file path, glob, or keyword like `all tasks` / `knowledge-base` / `architecture`.

## Instructions

1. Read `ai-agents/wiki-vault/schema.md` to understand page types, templates, and conventions.
2. Read `ai-agents/wiki-vault/index.md` to know what pages already exist.
3. Resolve what to ingest from the argument:
   - A specific file path → ingest that file
   - `all tasks` → ingest all files in `ai-agents/tasks/backlog/` and `ai-agents/tasks/done/`
   - `knowledge-base` → ingest all files in `ai-agents/knowledge-base/`
   - `architecture` → ingest `CLAUDE.md` and `ai-agents/wiki-vault/schema.md` domain reference
   - A directory path → ingest all markdown files in it
4. For each source file:
   a. Read the source file fully.
   b. Determine which wiki page type it maps to (feature / system / decision / task).
   c. Check if a wiki page already exists for this topic. If yes, update it. If no, create it following the template in schema.md.
   d. Add or update the one-line entry in `ai-agents/wiki-vault/index.md` under the correct section.
   e. Add or update cross-links in related pages (bidirectional).
5. After processing all sources, append a log entry to `ai-agents/wiki-vault/log.md`:
   ```
   ## YYYY-MM-DD — ingest
   - Ingested: `<source path>` → created/updated [[wiki/<path>]]
   ```
   Use today's date.
6. Report a summary: N sources processed, M pages created, K pages updated.
