# Clean up fkit's existing code comments — the pilot, the launcher/init, and the heal/throughput units (`0507`, `0508`, `0510`)

**Source**: `ai-agents/tasks/done/0507-pilot-clean-up-code-comments-in-the-hook-scripts-and-skills-for-role/brief.md`, `ai-agents/tasks/done/0508-clean-up-code-comments-in-the-launcher-and-init-scripts/brief.md`, `ai-agents/tasks/done/0510-clean-up-code-comments-in-the-heal-scripts-and-the-throughput-counter/brief.md`
**Status**: done — all three `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 12 · `P5` (`0507`), `P7` (`0508`), `P6` (`0510`) · owner `fkit-coder` · built 2026-10-17 → 2026-10-19

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`). One page for the three units of a nine-unit series that shipped; worklogs, plans, reviews and plan-reviews read as evidence; trial logs `…/reports/2026-10-20-plan-review-trial-0507.md`, `-0508.md`, `-0510.md`. ⛔ **The other six units (`0509`, `0511`–`0515`) are open** on the Backlog board and are not ingested.

## Goal
Apply `0506`'s *"comment WHY, not WHAT"* rule to fkit's **existing** code comments — owner ruling 2026-10-14 (`0506` Q3), typed: *"#1, but create a brief for cleaning the old code."* Scope, owner-ruled: all **code** under `claude/` (top-level scripts and the executables inside skills), `bin/`, `test/` — **not** prompt prose in `SKILL.md` or agent files. Split into nine comments-only units by module (owner: *"Keep 9 briefs (Rec)"*); `0507` is the pilot that **sets the method** the other eight reuse.

## Key Changes
- **`0507` — pilot, hook scripts + `skills-for-role.sh` (7 files).** Comment lines **403 → 131**. Its worklog states the series method: **M1** where a reason goes, **M2** task / ADR / ruling tags, **M3** the comments-only proof, **M4** refinements to the brief's rules. Every unit runs six checks: V1 comments only, V2 tests, V3 count, V4 nothing lost, V5 inbound references, V6 rule followed. `skills-for-role.sh` keeps its 16-line mirror block (a V6 exception).
- **`0510` — heal `check.sh` / `repair.sh` + `throughput.mjs`.** **443 → 140**. Adds method note **M4k** (text fences). Its plan surfaced that `throughput.mjs` needs `node` while ADR-017 rule 3 allows shipped scripts `bash` only — filed as **`0525`** (open; owner *"File a backlog brief"*).
- **`0508` — `claude/fkit-claude.sh` + `claude/fkit-claude-init.sh`.** **875 → 229** (the launcher keeps a 20-line mirror block; init's count includes 10 heredoc data lines). Adds **M4l** — numbered section labels are anchors. Run after `0284` and `0334`, which edit the same launcher.

## Outcome
- **1,721 → 500 comment lines** across the 12 files (grep count of comment-shaped lines, shebang included).
- Each unit ran its V1–V6 checks on its own (comments only, tests green, count, nothing lost, inbound references, rule followed).
- ⚠️ `architecture.md`'s line cites into `claude/fkit-claude.sh` and `claude/fkit-claude-init.sh` were all re-pointed in this sync window (e.g. the menu `:687-737` → `:495-533`); **which task made that edit is not recorded in the files read here**, so it is not attributed to `0508`.

## Related
- [[tasks/add-a-why-not-what-code-comment-rule-and-remove-the-rules-that-contradict-it]] — `0506`, the rule and the ruling that spawned the series
- [[systems/knowledge-base-structure]] — `conventions/code-comments.md`, the thirteenth convention
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]] — rule 3, the `0525` question
- [[tasks/bound-the-update-checks-git-path-which-has-no-deadline-and-hangs]] · [[tasks/fix-the-launchers-symlink-blind-agents-fail-safe]] — the launcher edits `0508` ran after
- [[tasks/sprint-12-set-a-nine-backlog-tasks-goal-not-set]] — the board
