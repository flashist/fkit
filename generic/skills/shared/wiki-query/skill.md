---
name: "wiki-query"
description: "Answer a question about the {{project_slug}} project using the wiki at {{wiki_path}}/. Use when asked to look something up in the wiki, find information about a feature or system, or answer a project question."
---

# Wiki Query

Answer a question about the {{project_slug}} project using the wiki at `{{wiki_path}}/`.

The question is whatever the user passed as the argument when invoking this skill.

## Instructions

1. Read `{{wiki_path}}/index.md` to get a catalog of all available wiki pages.
2. Identify which wiki pages are most relevant to the question. Read them.
3. If any relevant page links to other pages via [[wikilinks]], follow those links and read them too (max 2 hops).
4. If the wiki pages don't fully answer the question, read the original source files they reference (listed in each page's **Source files** or **Key files** field).
5. Compose a clear, cited answer:
   - Reference wiki pages as [[wiki/path]]
   - Reference source files as `src/...`
6. If the wiki is missing information needed to answer well, note the gap explicitly and suggest running `{{invoke}}wiki-ingest` on the relevant source.

> **Read-only**: Do not create wiki pages, update `index.md`, or append to `log.md` during a query. If the answer reveals something worth persisting, tell the user and suggest running `{{invoke}}wiki-ingest` explicitly.
