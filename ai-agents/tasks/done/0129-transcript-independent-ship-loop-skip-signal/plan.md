# Plan — 0129: transcript-independent ship-loop skip signal (Lead A)

## Context

The ADR-030 Stop hook (`claude/turn-completion-hook.sh`, task 0127) decides "is this a ship-loop turn?"
by scanning `transcript_path` for the command marker (SKIP 3). That scan is fragile both ways: **R8
(over-skip)** — it matches the marker text wherever it appears as transcript *content* (file read,
tool_result, attachment), silently disabling the hook in most fkit-dev sessions; **R6 (under-skip)** —
a missing/lagging transcript fails to skip a real loop turn. This replaces the scan with an
**authoritative, transcript-independent** signal, fixing R8 + R6 + the R8 known-limitation test together,
for **both** loops.

**Lead A confirmed viable (doc-cited, very high confidence — verified via claude-code-guide):** Claude
Code's **`UserPromptExpansion`** hook fires **once** when a slash command is invoked (before command
logic), carrying `session_id`, `cwd`, `expansion_type` (`"slash_command"`), and an **authoritative
`command_name`** — set *only* for real invocations, never for the string appearing in prose/attachments.
`UserPromptSubmit`/`PreToolUse` do **not** carry it. So a `UserPromptExpansion` hook can write a marker
at invocation exactly like the AskUserQuestion PreToolUse marker (0127) — no transcript needed.

## Scope decision (surfaced per the brief): REPLACE the transcript scan, don't keep it as a fallback

Keeping the transcript scan as belt-and-braces would **re-introduce R8** (the scan is the sole source of
the content-collision). So SKIP 3 is **fully replaced** by the marker read, and the Stop hook stops
reading `transcript_path` at all (after 0127's R7 fix, SKIP 3 is its only transcript use). This is the
recommendation baked into the plan.

## Mechanism (mirrors the 0127 AskUserQuestion marker family)

A `UserPromptExpansion` hook writes `$cwd/.fkit/state/shiploop-<session_id>` when a ship-loop command is
invoked; the Stop hook's SKIP 3 reads that marker. The marker **persists for the session** (a ship-loop
session's whole point is the loop — same semantics the transcript marker had, minus the collision).
Keyed by `session_id`, so a fresh session (new id) has no marker → enforces normally; dead-session marker
files are inert (never matched by a new id).

## Files

### 1. NEW `claude/shiploop-marker-hook.sh` — UserPromptExpansion marker (records only, never blocks)
Sibling of `askuserquestion-marker-hook.sh`; same jq-free `extract_top` + `is_identifier`. On stdin:
- Require `expansion_type` == `slash_command` **and** `command_name` (leading `/` stripped) ∈
  {`fkit-task-ship-loop`, `fkit-sprint-ship-loop`} — else allow, write nothing. (Self-checks command_name
  rather than trusting the settings matcher, for robustness.)
- Validate `session_id` (safe charset) + `cwd` exists → `mkdir -p "$cwd/.fkit/state"` then
  `: > "$cwd/.fkit/state/shiploop-$session_id"`. Best-effort; any failure → allow silently.
- **Always exit 0, no stdout** (a UserPromptExpansion recorder must never block the command).

### 2. EDIT `claude/fkit-claude.sh` `build_settings()`
Add a **third hook event** — `UserPromptExpansion` → `shiploop-marker-hook.sh` — to the same
`{"hooks":{…}}` object (no matcher needed; the hook self-filters). `bash "$here/…"`, same form as the
others. `.fkit/state` mkdir already added by 0127.

### 3. EDIT `claude/turn-completion-hook.sh` — SKIP 3 rework
Replace the transcript-scan loop with a marker read:
```sh
[ -e "$cwd/.fkit/state/shiploop-$session_id" ] && allow   # a ship-loop turn (authoritative invocation)
```
Guarded like the askuq marker (`is_identifier "$session_id"`, cwd present). Remove the
`transcript_path` extraction + `cat` entirely (no longer used anywhere in the hook). Update SKIP-3
comments; delete the "match the `<command-name>` invocation marker" R7 note (superseded).

### 4. Tests (ADR-014, `node --test`, zero devDeps)
- **NEW `test/shiploop-marker-hook.test.js`** — ship-loop `command_name` + `slash_command` → writes
  marker; non-loop command → none; `expansion_type` ≠ slash_command → none; leading-`/` command_name
  handled; missing/unsafe session or cwd → none, no crash; always exit 0. `FKIT_SHIPLOOP_MARKER_HOOK` seam.
- **REWORK `test/turn-completion-hook.test.js`** — replace the transcript-based ship-loop skip tests with
  marker-based: marker present → allow (skip) for both loops; **R8 fix** — a transcript containing the
  marker *as content* no longer skips (there's no transcript scan) → block; **R6 fix** — marker present +
  no/absent transcript → still skips; marker absent + no footer → block (enforce). **Retire/flip** the
  `KNOWN-LIMITATION/R8` test (marker-as-content now enforces). Fail-open paths preserved.
- **EDIT `test/launcher-contract.test.js`** — assert the `UserPromptExpansion` hook is wired (command →
  `shiploop-marker-hook.sh`) in both the file and inline-fallback; script exists on disk.
- **EDIT `test/prove-red.sh`** — add a mutation (e.g. marker-read never matches, or the marker hook's
  command_name gate removed) reding a named new assertion; keep mutations 1–6.

## Verification
1. `node --test test/*.test.js` — new marker suite + reworked Stop suite + launcher-contract green.
2. `bash test/prove-red.sh` — hard gate passes; every mutation reds its named assertion.
3. Generated hooks JSON validates: PreToolUse (Skill + AskUserQuestion) + Stop + **UserPromptExpansion**.
4. **Hand-verified, flagged (ADR-012 / ADR-021):** the live path — a real `/fkit-task-ship-loop`
   invocation writing the marker, the Stop hook then skipping — can't be exercised headlessly. Suites
   cover all script logic + real marker files against synthetic payloads. I'll offer the owner the same
   live-verify recipe that caught R7 (invoke the loop; confirm `.fkit/state/shiploop-<id>` appears; a
   footer-less loop turn is NOT nudged; a normal session that only *reads* files with the marker text IS
   nudged — the R8 case).
5. Walk the brief's 7 verification steps.

## Residuals (expected, to disposition at review)
- Marker persists for the session (no explicit clear) — over-skip if a session continues non-loop work
  after the loop ends; fail-open-safe, and matches the old transcript-marker semantics.
- Dead-session marker files accumulate under `.fkit/state/` — inert (session-keyed); light cleanup optional.
- cwd-mismatch corner (mid-session cwd change) — same accepted residual as 0127's markers.

## Out of scope
0116/0127 stay closed (this hardens their shared seam). No commit — working tree only.
