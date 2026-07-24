# Give the fkit ship-loop(s) a transcript-independent skip signal for the ADR-030 Stop hook

## ID
0129

## Sprint
Sprint 2

## Priority
111

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

Follow-up surfaced and **owner-accepted** during task 0127's review — accepted residuals **R6** and
**R8** in
[`0127-build-adr-030-stop-hook/review.md`](../../done/0127-build-adr-030-stop-hook/review.md) (0127 is
re-closed in `done/`). **Owner pulled this
task forward** (2026-07-23) because R8 makes the shipped hook *effectively non-enforcing in this
dogfooding repo* until this lands — see below.

The ADR-030 `Stop` hook (`claude/turn-completion-hook.sh`, built by 0127) decides whether a
`/fkit-task-ship-loop` turn is a ship-loop turn by **scanning `transcript_path` for the command marker
text** (`for marker in '/fkit-task-ship-loop'` in the hook — "SKIP 3"). This is fragile in **both
directions**:

- **Under-skip (R6, low):** the scan is the one thing R1 moved check A *off* of, because the transcript
  "lags in-memory state and is version-fragile." When the transcript is **missing, unreadable, or
  lagging** on an early ship-loop turn, a **real** ship-loop turn is **not** skipped → a spurious block
  (bogus "What's next?" / interactive demand). Bounded: block-once-escapable, degraded-only,
  session-only.
- **Over-skip (R8, the reason this is now urgent):** the scan matches the bare command string **wherever
  it appears as transcript content** — a file read, a `tool_result`, an attachment, or a pasted excerpt
  — not just a real slash-command invocation. So the hook **silently disables itself** in any session
  whose transcript merely *contains* the marker text. **On this repo, most fkit-self-maintenance
  sessions read files containing the marker**, so the hook is effectively non-enforcing here until this
  fix lands. Accepted for 0127 as a bounded, **fail-open-safe** residual (over-skip = not-block = the
  mandated safe direction), but it defeats the hook's purpose in the dogfooding repo. **Downstream
  consuming projects are unaffected.**

This task replaces the fragile substring scan with an **authoritative, transcript-independent** signal
for a real ship-loop invocation — fixing R6, R8, and the R8 known-limitation test **together**.

**⚠️ Not a defect against a locked decision — a hardening.** ADR-030 Decision 6 (fail open) and the
skip design intent are unchanged; this makes the skip *signal* trustworthy (no false-skip on marker-as-
content, no false-block on a missing transcript) rather than altering what the hook decides.

## What to build

Give the ship-loop(s) a **transcript-independent** signal for a *real* slash-command invocation, so
the Stop hook no longer decides the skip by scanning `transcript_path` content. Two candidate
mechanisms — the coder's plan chooses (or combines) them:

- **Lead A — `UserPromptExpansion` hook `command_name` (surfaced by Codex during 0127 review; verify in
  planning).** Claude Code's `UserPromptExpansion` hook is reported to expose an **authoritative
  `command_name`** — a reliable signal that a real slash command was invoked, independent of transcript
  content. If confirmed, it replaces the fragile substring scan for **both** loops (`/fkit-task-ship-loop`
  and `/fkit-sprint-ship-loop`) and closes **R8, R6, and the R8 known-limitation test in one change**.
  **Verify against the Claude Code hooks docs during the plan** (e.g. consult `claude-code-guide`) —
  confirm the hook exists, fires on a real invocation, does not fire on marker-as-content, and what
  payload/timing the `Stop` hook can read the result from. Treat as a lead, not a settled fact.
- **Lead B — a ship-loop-written state marker** (the fallback if Lead A does not pan out). Reuse the
  **state-marker pattern 0127 already introduced** for the `AskUserQuestion` PreToolUse marker at
  `$cwd/.fkit/state/` — the ship-loop writes its own marker (e.g. a `ship-loop-<session_id>` file under
  `$cwd/.fkit/state/`) while it is driving, and the Stop hook reads **that marker** to decide the skip,
  **instead of / in addition to** the transcript scan.
- **Preserve fail-open (ADR-030 Decision 6).** The marker becomes an *additional* skip signal that can
  only ever *add* a skip (over-skip = not-block = the mandated safe direction). An unreadable/absent
  marker must never cause the hook to block a turn it would otherwise allow — mirror the
  `marker_infra_ok` writability reasoning 0127 landed for the AskUserQuestion marker (see R4 disposition
  and the "Marker cwd-mismatch corner" accepted residual in 0127's review).
- **Cover the marker lifetime**: when it is written (loop start), when it is cleared (loop end /
  turn end), and what a stale marker does — a stale ship-loop marker silently *disables* the footer
  enforcement, so its clearing must be as reliable as its writing. Document the marker and its lifetime
  the way 0127 documented the block-once marker.
- **Design decision for the coder's plan (surface to owner if it changes scope):** whether to *replace*
  the transcript scan with the marker, or keep the scan as a fallback belt-and-braces alongside the
  marker. Note the same `cwd`-keyed marker corner 0127 accepted (a mid-session cwd change between marker
  write and Stop read is not reconcilable from a single Stop payload).

## Verification steps

1. **R8 (over-skip) fixed:** a `Stop` turn whose transcript merely *contains* the marker text as
   content (a file read / `tool_result` / attachment / pasted excerpt) but had **no real ship-loop
   invocation** is **NOT** skipped — the hook enforces normally. Add `node --test` coverage (per
   ADR-014) with a synthetic payload carrying the marker as content but no invocation signal → **enforce**
   (do not skip). Replace / retire the existing "R8 known-limitation" test that pins the current
   over-skip.
2. **R6 (under-skip) fixed:** a *real* ship-loop turn is correctly skipped **when `transcript_path` is
   missing / unreadable / lagging** — the skip no longer depends on a readable transcript. Synthetic
   payload: real-invocation signal present, transcript absent/unreadable → **skip** (allow).
3. **Fail-open preserved (ADR-030 Decision 6):** an **absent / unreadable / unwritable** signal (marker
   or hook result) never causes a block the hook would otherwise not raise — every error path **fails
   open** (asserted), matching 0127's `marker_infra_ok` direction.
4. If **Lead B** (marker): the marker's write and clear points are exercised — a live/idle ship-loop
   turn writes it, loop/turn end clears it, and a stale marker's effect is documented and, where
   testable, asserted. If **Lead A** (`command_name`): the hook reads the authoritative signal and the
   docs-confirmed behaviour is recorded in the plan.
5. Both loops covered: `/fkit-task-ship-loop` **and** `/fkit-sprint-ship-loop` (per 0116) resolve
   through the same transcript-independent signal — no transcript-only skip remains for either.
6. `node --test test/*.test.js` passes; if the hook's red-gate harness (`test/prove-red.sh`) is
   extended, its new mutation reds the new skip assertion.
7. The live session-scoped path stays **hand-verified** (ADR-012 / ADR-021 — a real invocation and the
   Stop actually skipping cannot be fully exercised by a spawned/headless subagent); the suite covers
   all script logic against synthetic payloads (and real marker files, if Lead B).

## Notes

- **Owner:** fkit-coder.
- **Depends on:** 0127 (the Stop-hook build — reopened for its R7 fix and being re-closed; it provides
  the hook, its `$cwd/.fkit/state/` marker pattern, and the `for marker in '/fkit-task-ship-loop'` skip
  list this hardens). Do not start before 0127's rework has landed.
- **Blocks:** nothing.
- **Pulled forward (2026-07-23):** re-ranked to priority 111 (from 112) at the owner's direction —
  R8 makes the hook effectively non-enforcing in this repo until this lands.
- **Related — do not do blindly in isolation:** 0116 (backlog) extends the *same* skip list to add
  `/fkit-sprint-ship-loop`. This task makes the detection *robust* for BOTH loops. Coordinate: if 0116
  lands first it adds a second transcript-scanned entry that would inherit the same under-skip weakness;
  ideally the marker mechanism here covers `/fkit-sprint-ship-loop` too (the sprint loop writing an
  equivalent marker), so both loops share one transcript-independent signal. Whichever lands second
  should not re-introduce a transcript-only skip.
- **Scope decision surfaced for the owner** (see What to build): replace the transcript scan with the
  marker, or keep the scan as a fallback alongside it. Recorded, not resolved here — it shapes the
  coder's plan but does not block starting.
- No commit — leave any change in the working tree.
