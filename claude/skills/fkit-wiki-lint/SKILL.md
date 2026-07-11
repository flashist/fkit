---
name: fkit-wiki-lint
description: The wiki librarian's lint procedure — health-check ai-agents/wiki-vault/ (broken links, stale claims, missing back-links, template drift), fix what's safe, and flag what needs judgment. The wiki role is the exclusive write gateway for the vault.
---

# Wiki Lint — the wiki librarian's procedure

> ## ⛔ Owner: the **wiki** role
> This procedure **writes** `ai-agents/wiki-vault/`, and only the wiki role may do that. Execute it
> **only** if you are the wiki — running as the `fkit-wiki` agent or in a `fkit wiki` session.
>
> **Any other role: do not execute this.** Ask the librarian:
> ```
> @fkit-wiki Run your lint procedure.
> ```

Health-check the whole wiki and fix what's safely fixable.

## Steps

1. **Read the rulebook:** `ai-agents/wiki-vault/schema.md` — the rules to enforce.
2. **Read the catalog:** `ai-agents/wiki-vault/index.md` — the full page list.
3. **Read every page** listed in the index.
4. **Check for these issues:**

   **Structural**
   - Pages missing required metadata fields per schema.md (`**Status**:`, `**Key files**:`,
     `**Date**:` — inline **bold** fields, not YAML frontmatter).
   - Pages that don't follow the schema.md template (template drift).
   - Index entries pointing at non-existent files (broken links).
   - Wiki pages that exist but are missing from `index.md`.

   **Content**
   - Contradictions between pages (two pages describing the same system differently).
   - Stale claims — references to files or functions that no longer exist (**verify with grep**).
   - Orphaned pages — no cross-links in or out.

   **Cross-reference**
   - One-way links: if A links to B, B must link back to A.
   - Links to source files that have moved or been renamed.

5. **For each issue:** fix it directly (edit the page), or — if it needs human judgment — flag it in
   place with a `> **LINT WARNING:**` blockquote.
6. **Log it.** Append to `ai-agents/wiki-vault/log.md`, using today's real date:
   ```
   ## YYYY-MM-DD — lint
   - Issues found: N
   - Issues fixed: M
   - Issues flagged for human review: K
   - <one-line summary of the most significant issues>
   ```
7. **Report** a final summary.

## Hard rules

- **`schema.md` is ground truth.** Never invent a page shape to make a page "pass".
- **Never invent knowledge** to fill a gap — flag it.
- **Write only inside `ai-agents/wiki-vault/`.** **Never commit or push.**
