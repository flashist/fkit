---
name: query
description: Answer a question about the project using the wiki at ai-agents/wiki-vault/. Use when asked to look something up in the wiki, find information about a feature or system, or answer a project question. Read-only — never creates or edits wiki pages.
---

# Wiki Query

Answer a question about the project using the wiki at `ai-agents/wiki-vault/`.

**Argument:** `$ARGUMENTS` — the question to answer.

## Instructions

1. Read `ai-agents/wiki-vault/index.md` to get a catalog of all available wiki pages.
2. Check staleness: if `ai-agents/wiki-vault/.wiki-watermark` exists, read the commit SHA it contains and run `git log <sha>..HEAD --oneline -- ai-agents/ ':!ai-agents/wiki-vault/'`, then count the matching commits. If the watermark file doesn't exist, skip this step silently (normal on a project that has never been synced). This is read-only — never write to `.wiki-watermark` or `log.md`, and never run `sync`'s full ingest logic, just this cheap existence-and-diff-count check.
3. Identify which wiki pages are most relevant to the question. Read them.
4. If any relevant page links to other pages via `[[wikilinks]]`, follow those links and read them too (max 2 hops).
5. If the wiki pages don't fully answer the question, read the original source files they reference (listed in each page's **Source files** or **Key files** field).
6. Compose a clear, cited answer:
   - Reference wiki pages as `[[wiki/path]]`
   - Reference source files as `src/...`
   - If step 2 found a nonzero commit count, append one caveat line: "Note: N commit(s) touched `ai-agents/` since the wiki was last synced (`<sha>`) — this answer may not reflect the latest changes. Consider asking fkit-wiki to run `sync`." If the count was zero, or the watermark file was absent, add no caveat line.
7. If the wiki is missing information needed to answer well, note the gap explicitly and suggest running the **ingest** skill on the relevant source.

> **Read-only**: Do not create wiki pages, update `index.md`, or append to `log.md` during a query. If the answer reveals something worth persisting, tell the owner and suggest running **ingest** explicitly.
