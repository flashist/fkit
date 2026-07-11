---
name: fkit-wiki-ingest
description: The wiki librarian's ingest procedure — add or update wiki pages in ai-agents/wiki-vault/ from a named source. Accepts a file path, a directory, or a keyword ('all tasks', 'knowledge-base', 'architecture'). The wiki role is the exclusive write gateway for the vault.
---

# Wiki Ingest — the wiki librarian's procedure

> ## ⛔ Owner: the **wiki** role
> This procedure **writes** `ai-agents/wiki-vault/`, and only the wiki role may do that. Execute it
> **only** if you are the wiki — running as the `fkit-wiki` agent or in a `fkit wiki` session.
>
> **Any other role: do not execute this.** Ask the librarian:
> ```
> @fkit-wiki Run your ingest procedure on <source>.
> ```
> (Wiki **reads** need no one's permission — any session may run `/fkit-query`.)

Add or update wiki pages from a named source.

**Argument:** `$ARGUMENTS` — a file path, glob, directory, or keyword (`all tasks` / `knowledge-base` /
`architecture`). If empty, ask what to ingest — don't guess.

## Steps

1. **Read the rulebook:** `ai-agents/wiki-vault/schema.md` — page types, templates, the required inline
   metadata fields, and the linking conventions you must enforce.
2. **Read the catalog:** `ai-agents/wiki-vault/index.md` — what pages already exist.
3. **Resolve what to ingest:**
   - a specific file path → that file
   - `all tasks` → everything in `ai-agents/tasks/backlog/` and `ai-agents/tasks/done/`
   - `knowledge-base` → everything in `ai-agents/knowledge-base/`
   - `architecture` → `CLAUDE.md` and the schema's domain reference
   - a directory path → all markdown files in it
4. **For each source file:**
   a. Read the source file fully.
   b. Determine which wiki page type it maps to (feature / system / decision / task).
   c. If a page for the topic exists, **update** it — incorporate new status, decisions, findings; do
      not remove content that is still accurate. If none exists, **create** it following the schema.md
      template.
   d. Add or update the one-line entry in `index.md` under the correct section.
   e. Add or update cross-links in related pages (**bidirectional** — if A links to B, B links to A).
5. **Log it.** Append to `ai-agents/wiki-vault/log.md`, using today's real date:
   ```
   ## YYYY-MM-DD — ingest
   - Ingested: `<source path>` → created/updated [[wiki/<path>]]
   ```
6. **Report:** N sources processed, M pages created, K pages updated, anything flagged.

## Hard rules

- **`schema.md` is ground truth** — match its templates and its inline **bold** metadata fields
  (`**Status**:`, `**Key files**:` — not YAML frontmatter). Never invent a page shape.
- **Never invent knowledge.** If a source doesn't say it, don't write it — flag the gap instead.
- **Write only inside `ai-agents/wiki-vault/`.** Everything else is input.
- No secrets in any page. **Never commit or push.**
