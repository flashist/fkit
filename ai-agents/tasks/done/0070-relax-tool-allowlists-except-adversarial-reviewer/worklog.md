# Worklog — Task 57: relax tool allowlists except adversarial reviewer

Task file: `ai-agents/tasks/backlog/relax-tool-allowlists-except-adversarial-reviewer.md`
Plan: `ai-agents/plans/relax-tool-allowlists-except-adversarial-reviewer.md` (owner-approved at plan gate)

## Owner-decision log
- **Plan gate (owner-approved):** mechanism = OMIT the `tools:` line (per ADR-022 + brief recommendation).

## Worklog
- P4 build: delete the `tools:` frontmatter line from the six agent files; keep adversarial reviewer intact.
- **Build note (self-caught defect):** my first edit pass matched a *leading* newline, which collapsed each
  description's last line into its `color:` line (e.g. `…decision.color: purple`) — malformed frontmatter.
  Caught it immediately in the P5 diff review, reverted the six via `git checkout`, and redid the deletion
  matching the `tools:` line **with the following `color:` line** → clean 1-line-per-file removal.
- P5 verify (evidence below).

## Files touched / change surface
- Six `claude/agents/fkit-{producer,coder,architect,reviewer,wiki,lead}.md` — one line removed each (the `tools:` line).
- `fkit-adversarial-reviewer.md` untouched. No prose, no `skills-for-role.sh`, no mirror tables.
- Loop artifacts (not deliverable): plan, worklog, status flips.

## Verification evidence (after final code change)
- `git diff --stat -- claude/agents/` → 6 files, **6 deletions, 0 insertions**; the only `-` lines are the six `tools:` lines (no prose, no color-join). Frontmatter clean: name → description → color → initialPrompt.
- `fkit-adversarial-reviewer.md` `tools: Read, Grep, Glob, Bash, Skill` **byte-intact**.
- `node --test` → **346 pass / 0 fail** — the ADR-018 skill-ownership hook suite is unaffected (it keys on `skills_for_role`, not agent `tools:`), confirming the **skill lockdown still holds** while tools opened.
- init into scratch → the six `.claude/agents/` copies carry **no** `tools:` line; adversarial reviewer's line regenerates intact.
- `git status` on `skills-for-role.sh`, `README.md`, `fkit-team/` → empty (untouched).
- **Caveat (loud):** the ADR's live spot-checks — a session agent invoking `WebSearch` (runs, not `TOOL_ABSENT`), and the coder still denied `/fkit-review` — need live `fkit <role>` sessions I can't run from this coder session (role lock). Mechanism verified via the frontmatter diff + hook suite + init regen; the live checks are owner/producer-run.

## Brief verification steps — walked
- ✅ six files have no `tools:` line.
- ✅ `git diff --stat` shows adversarial reviewer untouched.
- ⚠️ session spot-check (WebSearch runs) — owner-run (coder role lock).
- ✅ skill lockdown still holds (hook suite 346/0; the coder-can't-run-/fkit-review case is in the matrix).
- ✅ no `skills-for-role.sh` / mirror-table diff.
- ✅ init regeneration correct.
- ⚠️ `AskUserQuestion` still available in a session via inheritance — owner-run; ADR-021 harness fact (absent in consults) unchanged.

## Review (round 1) — ledger `ai-agents/reviews/relax-tool-allowlists-except-adversarial-reviewer.md`
- **Verdict:** ✅ 0 confirmed defects. **Codex coverage: FULL** — reviewer's own pass + Codex adversarial (codex-cli 0.144.4) both ran and converged clean. Codex independently proved surgery: `git show HEAD:<file> | sed '/^tools: /d'` byte-identical to each working file (×6); adversarial reviewer byte-identical to HEAD.
- All four scrutiny points confirmed: frontmatter well-formed in all six (**no trace of the reverted collapse bug**), adversarial reviewer byte-untouched, no prose edited (AskUserQuestion note present in all six), nothing else changed.
- **3 accepted residuals** recorded (ADR-022 consequences: five roles now prompt+hook-separated; the adversarial reviewer's line is the one deliberate wall; skill lockdown kept) — agreed, not disputed.
- No fix work → no re-verify cycle. Ledger clean.

## Owner-run validation carried to the done-gate (not review-round items)
- A `fkit <one-of-six>` session runs `WebSearch` (vs `TOOL_ABSENT`) — line removed ⇒ inheritance.
- The coder is still denied `/fkit-review` — skill lockdown holds (hook suite 346/0 supports it).
Static evidence strongly supports both; live confirmation is the owner's (coder role lock).

## Residuals / recommended follow-ups (named only)
- **Task 58** — architect-owned doc refresh (`architecture.md`/`PROJECT.md`/`CLAUDE.md`) describing this relaxed posture; soft-needs this task (now landed).
- Task 54 annotation ("mechanism superseded by 57") — an owner open question in the brief; not the loop's to act on.
- Wiki: only if a vault page enumerates per-agent `tools:` lines (fkit-wiki's path) — owner open question.

## Commit state
- **Not committed.** Working tree: six agent files (one `tools:` line removed each) + loop artifacts. The loop never commits — the owner commits.

## Status: 🔄 In progress — ready for the owner's done-gate
Complete and verified (mechanism + hook suite + init regen); the two live spot-checks are owner-run. `✅ Done` is owner-gated via `/fkit-task-done`.
