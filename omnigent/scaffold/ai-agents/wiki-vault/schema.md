# Wiki Schema

This document defines the structure, conventions, and rules for this project’s wiki.
The LLM must follow this schema when creating or updating any wiki page.

---

## Directory Structure

```
wiki/
  features/    → Product features (user-facing capabilities and behaviors)
  systems/     → Technical systems (data layer, networking, background jobs, etc.)
  decisions/   → Architectural and product decisions (ADRs)
  tasks/       → Summaries of completed/in-progress tasks from ai-agents/tasks/
sources/       → Raw source files (symlinks or copies — LLM reads, never edits)
index.md       → Master catalog of all wiki pages (one line each)
log.md         → Append-only chronological activity log
schema.md      → This file
```

---

## Page Types & Templates

### Feature Page (`wiki/features/<slug>.md`)

```markdown
# <Feature Name>

**Status**: active | deprecated | planned
**Source files**: `src/...`

## Summary
One paragraph overview of what this feature does from a user's perspective.

## Implementation
How it works technically. Entry point, key classes, runtime behavior.

## Data Flow
How a request or action moves through the system to produce its effect.

## Related
- [[systems/...]]
- [[features/...]]
```

### System Page (`wiki/systems/<slug>.md`)

```markdown
# <System Name>

**Layer**: frontend | backend | shared
**Key files**: `src/...`

## Summary
What this system does and why it exists.

## Architecture
Components, data flow, key abstractions.

## Gotchas / Known Issues
Non-obvious behaviors, past bugs, performance notes.

## Related
- [[features/...]]
- [[systems/...]]
```

### Decision Page (`wiki/decisions/<slug>.md`)

```markdown
# <Decision Title>

**Date**: YYYY-MM-DD
**Status**: accepted | superseded | proposed

## Context
What problem or situation prompted this decision.

## Decision
What was decided.

## Consequences
Trade-offs, downstream effects, things to watch.

## Related
```

### Task Page (`wiki/tasks/<slug>.md`)

```markdown
# <Task Title>

**Source**: `ai-agents/tasks/.../filename.md`
**Status**: backlog | in-progress | done | cancelled
**Sprint/Tag**: ...

## Goal
What this task is trying to achieve.

## Key Changes
Files modified, patterns introduced, notable implementation choices.

## Outcome
Result, follow-up items, what was learned.

## Related
```

---

## Cross-Reference Rules

- Use Obsidian wiki-links: `[[systems/job-queue]]`, `[[features/user-auth]]`
- Always cross-link bidirectionally: if A links to B, B should link back to A
- Link to source files with backtick paths, not wiki-links: `` `src/server/app.ts` ``

---

## Index Conventions (`index.md`)

One line per page, grouped by category:

```
## Features
- [[features/user-auth]] — Sign-up, login, and session handling
- [[features/search]] — Full-text search over the catalog

## Systems
- [[systems/job-queue]] — Background job processing and retries
...
```

---

## Log Conventions (`log.md`)

Each entry:

```
## YYYY-MM-DD — <operation>
- Ingested: `sources/<file>` → created/updated [[wiki/...]]
- Query answered: "<question>" → filed as [[wiki/...]] (if valuable)
- Lint: found N issues, fixed M
```

---

## Source Ingestion Rules

1. Raw sources live in `sources/` or are referenced by path (never edited).
2. Prefer referencing project files by path over copying them.
3. When ingesting a task file, create a `wiki/tasks/<slug>.md` and update `index.md`.
4. When ingesting architecture/system docs, create or update the relevant `wiki/systems/` page.
5. Always append to `log.md` after any ingest or lint operation.
