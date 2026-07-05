---
name: "fkit-wiki-lint"
description: "Health-check the {{project_slug}} wiki at {{wiki_path}}/ and fix issues found. Use when asked to lint, validate, or health-check the wiki."
---

# Wiki Lint

Health-check the {{project_slug}} wiki at `{{wiki_path}}/` and fix issues found.

## Instructions

1. Read `{{wiki_path}}/schema.md` for the rules to enforce.
2. Read `{{wiki_path}}/index.md` to get a full list of all wiki pages.
3. Read every page listed in the index.
4. Check for the following issues and fix them:

   **Structural issues**
   - Pages missing required metadata fields as defined in schema.md (e.g. `**Status**:`, `**Key files**:`, `**Date**:` — inline bold fields, not YAML frontmatter)
   - Pages that don't follow the template from schema.md
   - Index entries that point to non-existent files (broken links)
   - Wiki pages that exist but are missing from `index.md`

   **Content issues**
   - Contradictions between pages (e.g., two pages describe the same system differently)
   - Stale claims: references to files or functions that no longer exist (verify with file search / grep)
   - Orphaned pages: pages with no cross-links in or out

   **Cross-reference issues**
   - One-way links: if A links to B, B should link back to A
   - Links to source files that have moved or been renamed

5. For each issue found: fix it directly (edit the wiki page), or flag it with a `> **LINT WARNING:**` blockquote if it requires human judgment.

6. After linting, append to `{{wiki_path}}/log.md`:
   ```
   ## YYYY-MM-DD — lint
   - Issues found: N
   - Issues fixed: M
   - Issues flagged for human review: K
   - <one-line summary of most significant issues>
   ```

7. Report a final summary to the user.
