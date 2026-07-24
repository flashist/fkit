# Worklog — 0129 Transcript-independent ship-loop skip signal

**Task:** `0129-transcript-independent-ship-loop-skip-signal` · **Owner:** fkit-coder · via
`/fkit-task-ship-loop`. Plan approved (see `plan.md`). Status → 🔄 In progress (brief + sprint row).

## Owner-decision log
- Plan approved (upfront gate). Scope decision **REPLACE the transcript scan** (not keep as fallback —
  a fallback re-introduces R8) baked into the approved plan.

## Grounding
- **Lead A verified viable, doc-cited (claude-code-guide, very high confidence):** `UserPromptExpansion`
  fires once on a slash-command invocation, carries `session_id`, `cwd`, `expansion_type:"slash_command"`,
  and an **authoritative `command_name`** (set only for real invocations, never prose/attachment content).
  `UserPromptSubmit`/`PreToolUse` don't carry it. So a UserPromptExpansion hook writes the marker, exactly
  like 0127's AskUserQuestion PreToolUse marker. Chosen over Lead B (a skill-prose-written marker, which
  is compliance-dependent per ADR-016 §6).

## Build (Lead A — REPLACE the transcript scan)
- **NEW `claude/shiploop-marker-hook.sh`** — UserPromptExpansion hook; writes
  `$cwd/.fkit/state/shiploop-<session_id>` when `expansion_type==slash_command` AND `command_name` ∈
  {`fkit-task-ship-loop`,`fkit-sprint-ship-loop`} (leading `/` stripped). Records-only, never blocks.
- **EDIT `claude/fkit-claude.sh`** — third hook event `UserPromptExpansion` → the marker hook (no
  matcher; self-filters). JSON validates: PreToolUse[Skill,AskUserQuestion] + Stop + UserPromptExpansion.
- **EDIT `claude/turn-completion-hook.sh`** — SKIP 3 now reads the shiploop marker
  (`[ -e "$cwd/.fkit/state/shiploop-$session_id" ]`); **transcript read removed entirely** (no
  `transcript_path`/`cat` anywhere). R8 structurally fixed (no content scan); R6 fixed (no transcript
  dependency).
- **Tests:** NEW `test/shiploop-marker-hook.test.js` (8); reworked ship-loop tests in
  `test/turn-completion-hook.test.js` (R8-FIXED, R6-FIXED, marker-skip, no-marker→enforce; retired the
  R8 known-limitation); launcher-contract 8c + inline + script-exists; prove-red mutation 6 replaced
  (disable marker read → the marker-skip test reds).
- **Smoke-verified** (python payloads): marker written on a loop invocation, not on a non-loop command;
  Stop skips with marker, enforces without.

### Autonomous decisions (obvious winners, in-plan)
- **REPLACE the transcript scan** (per approved plan) — keeping it as fallback re-introduces R8.
- Marker hook **self-filters on command_name + expansion_type** rather than trusting the settings matcher.

### Verification (pre-review)
- `node --test test/*.test.js` → **511 pass / 0 fail**.
- `bash test/prove-red.sh` → **hard gate PASSED** (mutations 1–6 each red their named assertion).
- `bash -n` clean on all three hooks; 3-event hooks JSON validates.

## Review — Round 1 (model-diverse: reviewer + Codex 0.144.4) → changes requested, all resolved
✅ **R8 + R6 genuinely fixed**; fail-open intact (no false-BLOCK path in either hook); path-traversal
blocked (`is_identifier`); leading-`/` strip opens no hole. 3 low findings:
- **R3 (test-coverage) — FIXED:** added prove-red **mutation 7** (+ `0f` baseline) so the marker hook's
  `command_name` gate (the R8 fix) is mutation-proven — matches the askuq sibling's mutation 5.
- **R1 (frontier) — accepted residual:** `: >` marker write follows symlink/FIFO; exotic; never a false
  BLOCK; byte-identical to the accepted 0127 sibling.
- **R2 (frontier) — accepted residual:** `extract_top` first-match could pick a nested `command_name` →
  over-skip (never a false BLOCK); same jq-free class accepted across the hooks.
- Owner accepted R1 + R2 as bounded residuals; ledger closed-out.

## Close-out evidence packet
- **Outcome:** the ship-loop skip is now **transcript-independent** (a `UserPromptExpansion` marker),
  fixing R8 (over-skip that disabled the hook in fkit-dev sessions) and R6 (under-skip on a missing
  transcript), for both loops. The Stop hook no longer reads the transcript at all.
- **Verification (final):** `node --test test/*.test.js` → **511 pass / 0 fail**; `bash test/prove-red.sh`
  → **hard gate PASSED** (mutations 1–7). 3-event hooks JSON validates.
- **Brief verification steps 1–7:** met (1 R8-fixed test; 2 R6-fixed test; 3 fail-open asserted; 4 Lead A
  recorded; 5 both loops via one marker; 6 suite + mutation 7; 7 live path hand-verified only).
- **Files:** NEW `claude/shiploop-marker-hook.sh`, `test/shiploop-marker-hook.test.js`; EDIT
  `claude/turn-completion-hook.sh` (SKIP 3 marker read, transcript removed), `claude/fkit-claude.sh`
  (3rd hook event), `test/turn-completion-hook.test.js`, `test/launcher-contract.test.js`,
  `test/prove-red.sh`.
- **Accepted residuals:** R1 (symlink/FIFO write), R2 (first-match key), marker-persists-for-session,
  dead-session marker files, cwd-mismatch corner — all fail-open-safe.
- **⚠️ Hand-verified only (ADR-012 / ADR-021):** a real `/fkit-task-ship-loop` invocation writing the
  marker + the Stop hook then skipping cannot be exercised headlessly. Owner offered the live-verify
  recipe; deferred (chose to close). Marker = agent-closed.
- **Commit state:** nothing committed; all edits in the working tree.
