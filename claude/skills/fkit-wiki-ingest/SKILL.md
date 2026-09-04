---
name: fkit-wiki-ingest
description: >-
  The wiki librarian's ingest procedure — add or update wiki pages in ai-agents/wiki-vault/ from a
  named source. Accepts a file path, a directory, or a keyword ('all tasks', 'knowledge-base',
  'architecture'). The wiki role is the exclusive write gateway for the vault.
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
   - `all tasks` → every brief, i.e. `ai-agents/tasks/{backlog,done}/*/brief.md` (briefs only — since
     ADR-029 each task is a folder; do **not** ingest the sibling `plan.md` / `worklog.md` / `review.md`)
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
7. **Flag any completed tracked task — close nothing.**

   **The wiki closes nothing and moves no task file.** Since **ADR-033** the task movers
   (`/fkit-task-done`, `/fkit-task-cancelled`) are the **producer's alone** — the wiki does not hold
   them, and the ADR-018 hook denies a mover call from a wiki identity at any spawn depth. The wiki's
   completion signal is a **flag in this report**, and nothing else. (`log.md` is not a signal: no board
   tool reads it. That is exactly why `0078`'s vault work sat `🔄 In progress` on the board for a week.)

   **Which tasks to consider** — any tracked task this operation may have completed:
   - one the caller named when invoking this procedure; **and**
   - any brief under `ai-agents/tasks/backlog/*/brief.md` whose `## Owner` is `fkit-wiki` and whose
     `## Status` is not `✅ Done` — read each and apply the rule below.

   **The rule: is that brief's deliverable *this* vault work?** Three outcomes, and the third is the
   common one:
   - **Fully** → complete.
   - **In part, or this run served it and you cannot tell whether that finished it** → **partial**.
     Never resolve that doubt as complete.
   - **Unrelated to this run** → **say nothing about it at all.** Most considered briefs land here, and
     they produce no line. A brief is not "uncertain" merely because you read it: uncertainty means this
     run *touched* its deliverable and you cannot tell whether that completed it.

   **End the report with one line per task that came out complete or partial, in exactly this form:**
   - complete → `Task <NNNN>'s vault work is complete — ready to close`
   - partial or uncertain → `Task <NNNN>: partial — not ready to close`

   **`<NNNN>` is the task folder name's four-digit prefix** (equivalently the brief's `## ID`) — and the
   task's only identity. It is **never** the sprint
   board's rank / `P<n>` Priority cell, which is mutable and re-ranked; see
   `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`. It is also **never** a line
   number — write no `:NNN` coordinate in a flag. Substitute real values.

   **If that produced no lines at all**, write the single line `No tracked task completed by this run.`
   **Never invent a task to have something to flag.**

   These lines are the **last** thing in the report. A caller who summarizes this report **carries them
   verbatim** — a dropped flag is the whole bug this exists to fix.

   **Then stop.** Do not invoke a mover, do not edit the brief, do not touch the sprint plan, and do not
   spawn the producer to close it yourself. Routing the close is the **caller's** next move, not yours:
   resolve `<NNNN>` to its task folder — the single match for `ai-agents/tasks/*/<NNNN>-*/` — then
   `@fkit-producer Run /fkit-task-done on <that folder>/brief.md`. The flag carries the ID only; that one
   lookup is the caller's, and it is what stops the flag rotting when the folder moves boards.

## Hard rules

- **`schema.md` is ground truth** — match its templates and its inline **bold** metadata fields
  (`**Status**:`, `**Key files**:` — not YAML frontmatter). Never invent a page shape.
- **Never invent knowledge.** If a source doesn't say it, don't write it — flag the gap instead.
- **Write only inside `ai-agents/wiki-vault/`.** Everything else is input.
- **Close nothing.** The wiki does not hold the task movers (ADR-033) and never invokes one, never
  moves a task file, and never edits a brief or the sprint plan. It **flags**; the producer closes.
- No secrets in any page. **Never commit or push.**
