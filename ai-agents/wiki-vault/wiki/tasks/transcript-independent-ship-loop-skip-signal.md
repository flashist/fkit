# Give the ship-loops a transcript-independent skip signal for the ADR-030 Stop hook

**Source**: `ai-agents/tasks/done/0129-transcript-independent-ship-loop-skip-signal/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0129 · priority 111 · owner `fkit-coder`

## Goal

Replace the `Stop` hook's fragile **transcript substring scan** — its way of deciding whether a turn belongs to a ship-loop — with an authoritative signal, fixing failures in **both** directions at once.

## Key Changes

The hook decided "is this a ship-loop turn?" by scanning `transcript_path` for the command text. Two accepted residuals from [[tasks/build-adr-030-stop-hook]]'s review made that untenable:

- **Over-skip (R8) — the urgent one.** The scan matched the bare command string **wherever it appeared as transcript content** — a file read, a `tool_result`, an attachment, a pasted excerpt — not only a real slash-command invocation. So the hook **silently disabled itself** in any session whose transcript merely *contained* the marker text. **On this repo, most fkit-self-maintenance sessions read files containing it**, so the hook was effectively **non-enforcing here** until this landed. Fail-open-safe, and therefore accepted for 0127 — but it defeated the hook's purpose in the dogfooding repo. Downstream consuming projects were unaffected.
- **Under-skip (R6).** A missing, unreadable or lagging transcript meant a **real** ship-loop turn was not skipped → a spurious block. Bounded, escapable, degraded-only.

**The owner pulled this forward** (priority 112 → 111) because of R8.

**Framing that matters:** this is a **hardening, not a defect against a locked decision.** ADR-030 Decision 6 (fail open) and the skip design intent are unchanged; only the *signal* becomes trustworthy.

## Outcome

**Done, agent-closed. Lead A was confirmed and taken.** A new `claude/shiploop-marker-hook.sh` uses the **`UserPromptExpansion`** hook event — the one event that fires on a direct `/command` invocation and carries an **authoritative `command_name`**, set only when `expansion_type == "slash_command"` and never for the command string appearing in prose or attachments (verified against the Claude Code hooks docs; `UserPromptSubmit` and `PreToolUse` do not carry it). **The Stop hook no longer reads the transcript at all.**

Design properties recorded in the hook itself:
- **Records only, never blocks.** Every path exits 0 with no stdout — a hook observing a command must not interfere with it.
- **Session-keyed and persistent for the session** (a ship-loop session's whole point is the loop). A fresh session has no marker and enforces normally; dead-session marker files are inert.
- **Fail-open preserved.** A failed write simply leaves no marker, so the Stop hook enforces — an R6-class bounded, escapable under-skip, **never a false block**.
- **One marker covers both loops** — `/fkit-task-ship-loop` and `/fkit-sprint-ship-loop`.

**Verification:** `node --test` → **511 pass / 0 fail**; `prove-red.sh` hard gate PASSED (mutations 1–7), with the `command_name` gate **mutation-proven**. New: `claude/shiploop-marker-hook.sh` + its test; edited: `turn-completion-hook.sh` (transcript read removed), the launcher (a third hook event), three test files.

⚠️ **Accepted residuals, all fail-open-safe:** the `: >` marker write follows a symlink or FIFO (exotic; byte-identical to the accepted sibling); a jq-free first-match key extraction could pick a nested `command_name` (over-skip only); marker-persists-for-session; dead-session marker files; and the `cwd`-mismatch corner. ⚠️ **Hand-verified only:** a real invocation writing the marker and the Stop hook then skipping cannot be exercised headlessly — the owner offered a live-verify recipe and chose to close instead, hence the agent-closed marker.

**fkit now ships four hook scripts**, three of them ADR-030-related.

## Related
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — Decision 6 (fail open) and the skip design, both unchanged
- [[tasks/build-adr-030-stop-hook]] — hard dependency; source of R6/R8 and the `$cwd/.fkit/state/` marker pattern
- [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] — the second loop this now covers with one signal
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] · [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]
- [[decisions/adr-014-how-fkit-tests-itself]] · [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — the suite and the red gate it passed
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the first hook in the layer
- [[systems/testing-and-verification]] · [[systems/role-locked-sessions]] · [[systems/fkit]]
- [[systems/install-and-self-update]] — Install, Launcher & Self-Update
