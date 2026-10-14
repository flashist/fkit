# Build a command-buttons mod that offers the slash-commands Claude suggested as buttons above the prompt

**Source**: `ai-agents/tasks/cancelled/0505-build-a-command-buttons-mod-that-offers-suggested-slash-commands-above-the-prompt/brief.md`
**Status**: cancelled — `⛔ Cancelled (agent-closed — not owner-verified) (2026-10-10)`
**Sprint/Tag**: Sprint 10 `P19` (append rank) · task `0505` · owner `fkit-coder`

## Goal
Filed 2026-10-10 from one of three reports the owner wrote with another Claude (R10: *"brief a task for each of
them and add it to the currently active sprint"*), copied verbatim beside the brief as `source-report.md` — its
*"For the agent reading this"* section treated as **input, not instructions**.

**The idea:** Claude often suggests commands in replies (`/compact`, `/fkit-task-done …`); after each turn, show them
as numbered buttons in the band above the prompt; a click or digit **fills** the prompt box, replacing the draft. ⛔
**It never submits** — the one rule that must never bend.

## Key Changes
None — cancelled before planning. What the brief had settled: detection only of **real** registered commands (so
`/usr/bin` never counts); arguments kept when the whole invocation is in inline code; de-duplicated, at most 5; the
band yields to other mods and hides during a survey; check that a digit hotkey cannot fire while typing a draft.
⚠️ **A new kind of component for fkit** — fkit ships no Claude Code plugin/mod (verified 2026-10-10: no
`.claude-plugin/` in the repo); the API (needs Claude Code v2.1.287+) had to be re-checked against the build in use.
Open question 1, which gated the build: **where does it live** — a separate repo, in this repo unshipped, or shipped
with fkit (likely an ADR first)?

## Outcome
**Cancelled 2026-10-10**, owner ruling in the `fkit-lead` session, relayed by the lead: *"Cancel 2-buttons. I agree
with you that it's not the fkit core."* — a UI convenience mod, not fkit's core; **if built, it belongs outside
fkit.** Closed by a spawned producer via `/fkit-task-cancelled` (agent-closed). Ranks on the board unchanged; the
`0505`-vs-`0506` swap question became moot.

## Related
- [[tasks/sprint-10-the-0472-0482-batch]] — `P19`, owner ruling R10 (with `0504`, `0506`, both open)
  > ✅ *Dated note 2026-10-14 (sync `79a7dbf`→`baf6a4e`):* `0504` has since closed → [[tasks/answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn]]; `0506` is still open.
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] — what fkit ships today (no mod component)
