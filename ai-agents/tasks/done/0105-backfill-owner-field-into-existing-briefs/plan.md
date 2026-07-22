# Plan — Task 0105: backfill `## Owner` into all existing briefs

## Context
Task 0104 added `## Owner` to the brief schema so *new* briefs carry it. This task backfills the field
into **every brief that already exists**, so task 0106's render shows a real owner on every board row —
not just on post-0104 briefs. The value must be **derived, never guessed**: a wrong owner on a closed
task is a quietly false record (`evidence-before-assertion`). Where an owner can't be recovered, the
brief is **handed to the owner for assignment**, exactly as the ID-collision guard hands off rather
than inventing.

## Measured reality (re-measured 2026-07-22 — the snapshot the brief told me to re-derive)
- **108 briefs** across `backlog/` (10) · `done/` (87) · `cancelled/` (11). **0 currently have `## Owner`.**
- **83 recoverable** from the `## Notes` `**Owner: fkit-X**` line — validated against 0104's 7-role enum:
  **53 `fkit-coder` · 19 `fkit-architect` · 9 `fkit-wiki` · 2 `fkit-producer`**.
- **Zero disagreements** — where a brief has both a Notes owner and a sprint-2 board `owner:` cell, they
  agree in every case. (sprint-1/done and cancelled boards have no `owner:` cells at all.)
- **25 with NO recoverable owner** — no Notes owner line, and no board-row owner either → the
  **owner-assignment set** (listed below).

## Approach
1. **Build a deterministic backfill + validation script** (throwaway, run once — not shipped). It:
   - Re-derives the Notes owner per brief (strict: the role token right after `Owner:`, enum-validated).
   - Re-checks the 83/25 split and disagreements **at run time** (fail loudly if the split changed).
   - Inserts `## Owner\n<role>\n` in the schema position — **immediately before the first `## Context`
     heading** (which places it right after the `## Status` block, per 0104's skeleton).
   - Writes the 25 owner-assignment values **only from the owner-approved map** (below) — never inferred.
   - Asserts post-conditions: every brief has exactly one `## Owner`; every value is one of the 7 roles.
2. **Recoverable 83:** written from the Notes-derived value (mechanical).
3. **Unassigned 25:** written from the owner's assignment collected at this plan gate (see table).
4. **Redundant Notes `**Owner:**` line:** **leave as-is** (brief's lean) — it often carries extra
   context (e.g. *"fkit-coder — source under claude/"*), and the field is the source of truth regardless.
   Stated once in the worklog; applied uniformly.

## The 25 owner-assignment set — owner ratified the suggested map (2026-07-22)
**Owner decision at the plan gate:** *"Accept my suggestions."* The 25 are written from the suggested
map below, recorded in `worklog.md` as **agent-suggested, owner-ratified** (the assignment the brief
requires — an explicit owner sign-off, not a silent default). Any later correction is a one-line edit.

Suggested owner is **derived from each task's evident nature** and is **agent-suggested, not authoritative** —
confirm or correct any. Confidence flagged; the 3 **LOW** ones most warrant your eye.

| Brief | Title (evidence) | Suggested | Conf |
|---|---|---|---|
| cancelled/0002 | Add CI: run validate-bundles.sh | `fkit-coder` | high |
| done/0011 | Add a `status` skill to fkit-producer | `fkit-coder` | high |
| cancelled/0016 | Amend the subagent-disconnect **incident doc** | `fkit-architect` | **LOW** |
| done/0018 | Bake Architecture pointer into scaffold templates | `fkit-coder` | high |
| done/0019 | Build self-update for the Claude path | `fkit-coder` | high |
| done/0021 | Build `fkit reconnect` tooling | `fkit-coder` | high |
| done/0024 | **Decide** whether fkit needs an e2e-tester agent | `fkit-architect` | med |
| done/0025 | Delete `omnigent/` | `fkit-coder` | high |
| cancelled/0033 | **Document** the consult-chain envelope | `fkit-architect` | med |
| done/0034 | Enforce the task status vocabulary in source | `fkit-coder` | high |
| done/0035 | Extend `initiate-project` to fill Overview | `fkit-coder` | high |
| done/0038 | Extract the shared scaffold into `claude/` | `fkit-coder` | high |
| cancelled/0040 | Fix stale agent-count docs + fresh-detection dup | `fkit-coder` | high |
| done/0041 | Replace placeholder text in CLAUDE.md/AGENTS.md | `fkit-coder` | high |
| done/0044 | **Formalize** the knowledge-base folder structure | `fkit-architect` | med |
| done/0048 | Give every agent direct wiki-query access | `fkit-coder` | high |
| done/0059 | **Knowledge-base hygiene** after Omnigent removal | `fkit-architect` | **LOW** |
| done/0060 | Make Codex a checked prerequisite | `fkit-coder` | high |
| done/0063 | Reconcile the skill-ownership source of truth | `fkit-coder` | high |
| cancelled/0071 | Remove adversarial-reviewer eager auto-spawn | `fkit-coder` | high |
| done/0083 | **Rewrite the docs** post-Omnigent | `fkit-coder` | **LOW** |
| done/0084 | Rewrite the installer for a single flavor | `fkit-coder` | high |
| done/0085 | Roll out ADR-004 fixed consult titles | `fkit-coder` | high |
| done/0091 | Verify onboarding flow end-to-end | `fkit-coder` | med |
| done/0098 | Wiki sync after the Omnigent removal | `fkit-wiki` | high |

Suggested tally (all 25, incl. the 3 LOW): **19 coder · 5 architect · 1 wiki**. All are valid roles; none
is the not-yet-built eighth role.

## Scope guards (from the brief)
- **Touches only `ai-agents/tasks/`** — no source, no board rows, no `## Status` changes, no folder moves.
  Only the new `## Owner` line is added to each brief. (Plus this loop's own bookkeeping on 0105.)
- **Never write an unknown owner by inference** — the 25 come only from your approved map.

## Verification
1. `find … -name brief.md | wc -l` **==** `grep -rl '^## Owner' …/brief.md | wc -l` (108 == 108).
2. Every `## Owner` value ∈ the 7 roles; none is the eighth/tester. (grep + enum check.)
3. Each `## Owner` sits between `## Status` and `## Context` (position spot-check across boards).
4. The 25-list is recorded, dated, in `worklog.md`, and **every** value traces to your assignment — none inferred.
5. Disagreements: none found; re-asserted at run time.
6. `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` — no new drift (no `id-mismatch`).
7. `git status` shows changes confined to `ai-agents/tasks/*/*/brief.md` (+ 0105 loop artifacts).

## Commit
None — all edits left in the working tree; you commit.
