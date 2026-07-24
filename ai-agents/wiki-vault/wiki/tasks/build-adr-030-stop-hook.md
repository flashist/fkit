# Build the ADR-030 `Stop` hook — turn-completion contract enforcement

**Source**: `ai-agents/tasks/done/0127-build-adr-030-stop-hook/brief.md`
**Status**: done (agent-closed — not owner-verified)
**Sprint/Tag**: Sprint 2 · ID 0127 · priority 110

## Goal
Build the hook half of [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — a **second,
`Stop`, hook** that enforces two end-of-turn behaviours the coder's prompt already promises but does not
fire reliably: put questions to the owner **interactively** (`AskUserQuestion`), and close every reply
with a **"What's next?"** section. Straight implementation from the settled design
(`knowledge-base/reports/2026-07-19-design-turn-completion-hook.md`); **no new design decision.** The
**prose half** (Decision 8 / the ~430 B rules-block addition) is a separate task (0128), independently
shippable in either order.

## Key Changes
- **`claude/turn-completion-hook.sh`** (new, `Stop`) — two presence checks, no judgement: **check A**
  (interrogative content addressed to the owner **and** no `AskUserQuestion` this turn) and **check B**
  (no literal `What's next?` section). Blocks **at most once per turn** via Claude Code's built-in
  `stop_hook_active`; **fails open** on any error/parse-failure/uncertainty.
- **`claude/askuserquestion-marker-hook.sh`** (new, `PreToolUse`, `matcher:"AskUserQuestion"`) — the
  mechanism that makes check A's "no `AskUserQuestion` this turn" signal reliable. It touches a
  turn-scoped marker `$cwd/.fkit/state/askuq-<session_id>`; the `Stop` hook reads **and consumes** it.
  **This replaced an original transcript-scan approach** the review proved was a fail-open violation —
  see the ADR's *Addendum — 2026-07-23* and the R1 finding below.
- **`claude/fkit-claude.sh` (`build_settings()`)** — wired the `Stop` key alongside the existing
  `PreToolUse` in the one `{"hooks":{…}}` object, plus the second `PreToolUse` marker entry; matches the
  proven ADR-018 wiring exactly. Launcher pre-creates the `.fkit/state` dir.
- **Consult skip is structural** — the `Stop` hook registers on `Stop` **only, never `SubagentStop`**, so
  it never fires in a spawned consult where `AskUserQuestion` is absent (ADR-021). The unescapable-block
  hazard is closed by wiring, not runtime detection.
- **Tests** — `test/turn-completion-hook.test.js` (new) + `test/launcher-contract.test.js` Group B +
  `test/prove-red.sh` mutations. Final gate: `node --test test/*.test.js` → **493 pass / 0 fail**;
  `prove-red.sh` hard gate PASSED.

## Outcome
Shipped 2026-07-23, **agent-closed (not owner-verified)**, no commit. Passed a full model-diverse review
(reviewer Claude + Codex 0.144.4, **both ran, no degradation**) over two rounds:
- **R1 (high, fail-open):** the original transcript scan set "no tool used" **confidently** when it could
  not confirm it → confident **false BLOCK** of a turn that DID call the tool. Fixed by **Path 2** (the
  PreToolUse marker above) — the transcript is no longer read for check A.
- **R2 (medium, fail-open):** empty/`null`/whitespace final message slipped the allow-guard into check B
  (blocks by default). Fixed — such messages now divert to `allow` first, tolerating whitespace after the
  colon.
- **R3 (medium, plan divergence):** check A fired on any `?` anywhere. Tightened to a **line ending in
  `?`**, excluding fenced, `>`-blockquote, and the `What's next?` heading lines.
- **R4 (medium):** hardened — `marker_infra_ok` now also requires the state dir **writable**, closing the
  dir-present-but-unwritable false block in the fail-open direction.
- **R5, R6:** accepted bounded residuals. R6 carries a **named producer follow-up** (transcript-independent
  ship-loop skip; task 0116 extends the same seam). Full residual list with `Re-raise only if` conditions
  lives in the task folder's `review.md`.

**Still hand-verified (ADR-012 / ADR-021):** the live session path — a real `AskUserQuestion` writing the
marker, the `Stop` actually blocking — cannot be exercised by automation; suites cover all script logic +
real marker files against synthetic payloads. Unblocks task 0116.

## Related
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — the decision this builds, and its
  *Addendum — 2026-07-23* recording the check-A mechanism correction
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the
  proven `PreToolUse` hook path both new hooks extend
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why the consult skip is
  safety-critical, and why the live path stays hand-verified
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — why a spawned subagent
  cannot fully test a session-scoped hook
- [[systems/role-locked-sessions]] — the hook layer this adds two members to
- [[systems/testing-and-verification]] — the `node --test` + `prove-red.sh` suite this extended
