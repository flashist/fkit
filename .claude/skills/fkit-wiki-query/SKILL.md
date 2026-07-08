---
name: fkit-wiki-query
description: "Answer a question about the nimbus project using the wiki at ai-agents/wiki-vault/. Use when asked to look something up in the wiki, find information about a feature or system, or answer a project question."
user-invocable: true
---
<!-- fkit:generated source=fkit-wiki-query version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# Wiki Query

Answer a question about the nimbus project using the wiki at `ai-agents/wiki-vault/`.

The question is whatever the user passed as the argument when invoking this skill.

## Instructions

1. Read `ai-agents/wiki-vault/index.md` to get a catalog of all available wiki pages.
2. Identify which wiki pages are most relevant to the question. Read them.
3. If any relevant page links to other pages via [[wikilinks]], follow those links and read them too (max 2 hops).
4. If the wiki pages don't fully answer the question, read the original source files they reference (listed in each page's **Source files** or **Key files** field).
5. Compose a clear, cited answer:
   - Reference wiki pages as [[wiki/path]]
   - Reference source files as `src/...`
6. If the wiki is missing information needed to answer well, note the gap explicitly and suggest running `/fkit-wiki-ingest` on the relevant source.

> **Read-only**: Do not create wiki pages, update `index.md`, or append to `log.md` during a query. If the answer reveals something worth persisting, tell the user and suggest running `/fkit-wiki-ingest` explicitly.
