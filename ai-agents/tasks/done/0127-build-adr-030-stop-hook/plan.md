# Plan (Rev 2) — Build the ADR-030 `Stop` hook, check A via a PreToolUse marker (task 0127)

## Context / why this revision

Rev 1 (approved, built, reviewed) shipped a working **check B** ("What's next?" enforcement) but its
**check A** ("a question asked in prose with no `AskUserQuestion` this turn") was found — model-diverse
review R1, reproduced — to **false-BLOCK turns that DID use `AskUserQuestion`**. Root cause: a `Stop`
payload has **no reliable signal** for "was AskUserQuestion used this turn"; the transcript scan I used
resets past the real call (`tool_result` is a `type:user` line), lags, and reads any non-JSONL file as a
confident "no tool." A `Stop` hook must **fail open** (ADR-030 Decision 6), so that path can't stay.

Owner + architect decision: **Path 2** — get the signal from a **`PreToolUse` hook on
`AskUserQuestion`** (the ADR-018 "extend the proven path"), which sees tool calls authoritatively.
**Verified (docs, high confidence): `PreToolUse` fires on `AskUserQuestion`**, it is not exempt (only
`EndConversation` is), and its payload carries `tool_name":"AskUserQuestion"`.

Outcome: check A gets a trustworthy suppressor, the false-block class is eliminated, and check A stays
alive per ADR-030 Decision 2. Also folds in the round-1 dispositions **R2** (fix fail-open) and **R3**
(tighten check A breadth to this plan).

## Mechanism

A `PreToolUse` hook writes a **turn-scoped marker** when `AskUserQuestion` is called; the `Stop` hook
**reads and consumes** it. Marker present = tool used this turn = **suppress check A**. Marker absent
**and** the marker infra is demonstrably working = check A may fire. Any doubt → suppress (fail open).

## Files

### 1. NEW `claude/askuserquestion-marker-hook.sh` — PreToolUse marker (records only, never blocks)
Sibling of `skill-ownership-hook.sh`, same jq-free `extract_top`. On stdin PreToolUse payload:
- `tool_name != "AskUserQuestion"` → allow (exit 0, do nothing). *(Defensive; matcher already scopes it.)*
- Extract `session_id` + `cwd`; validate `session_id` against a safe charset (reuse `is_identifier`
  pattern). Missing/unsafe → allow, write nothing (Stop will fail-open-suppress).
- `mkdir -p "$cwd/.fkit/state"` then `: > "$cwd/.fkit/state/askuq-$session_id"` (best-effort; any
  failure → allow silently).
- **Always exit 0 with no output** — a PreToolUse hook that recorded a marker must never deny a tool.

### 2. EDIT `claude/fkit-claude.sh` `build_settings()`
- Add a **second `PreToolUse` entry** (matcher `AskUserQuestion` → `askuserquestion-marker-hook.sh`)
  alongside the existing Skill entry. `Stop` key unchanged. So `PreToolUse` becomes a 2-element array.
- `mkdir -p "$proj/.fkit/state"` at launch (best-effort) so marker-absence is trustworthy from turn 1
  (dir-exists is the Stop hook's "infra ready" proxy). Mirror the existing `.fkit/settings` mkdir.

### 3. REWORK `claude/turn-completion-hook.sh`
- After field extraction, compute `marker="$cwd/.fkit/state/askuq-$session_id"`; record `had_marker`,
  then **delete it (consume)** — before any skip path, so it can never leak to the next turn.
- `marker_infra_ok` = `cwd` present **and** `session_id` safe **and** `"$cwd/.fkit/state"` dir exists.
- **Replace the transcript-based `asked_with_tool`** with: `asked_with_tool = had_marker OR NOT
  marker_infra_ok` (i.e. suppress check A whenever the tool was used *or* we can't trust the signal).
  Check A fires only when `marker_infra_ok AND NOT had_marker AND has_question`.
- Keep the transcript read **only** for the ship-loop skip (unchanged; its over-skip is fail-open-safe).
- **R2 fix:** divert to allow when `last_assistant_message` is absent, JSON `null`, or empty — tolerating
  `[[:space:]]*` after the colon (the gap the review found).
- **R3 fix:** check A's interrogative test becomes **line-based**: decode `\n`, strip `What's next?`,
  then a line **ending in `?`** that is **not** inside a ``` fence and **not** a `>` blockquote line.

### 4. Tests (ADR-014, `node --test`, zero devDeps)
- **NEW `test/askuserquestion-marker-hook.test.js`** — AskUserQuestion payload writes the marker at
  `$cwd/.fkit/state/askuq-<session>`; other tool → none; missing/unsafe session → none, no crash; always
  exit 0. `FKIT_ASKUQ_MARKER_HOOK` seam.
- **REWORK `test/turn-completion-hook.test.js`** — payloads gain `cwd`/`session_id`; a temp state dir +
  marker helper replace the transcript-AUQ fixtures. New cases: **the R1 regression** (marker present +
  prose question → allow); marker absent + infra ok → block; **infra absent → allow** (fail open);
  **marker is consumed** after a run; R2 (null/empty/spaced); R3 (fenced-only ? → allow, `>`-quoted ? →
  allow, line-ending ? → block, `## What's next?` heading doesn't fire A).
- **EDIT `test/launcher-contract.test.js`** — assertion 8 now expects **two** PreToolUse entries
  (Skill + AskUserQuestion), pins the marker-hook command + matcher, `Stop` still present (8b),
  both scripts exist (10), inline fallback carries all (11).
- **EDIT `test/prove-red.sh`** — keep the check-B mutation; add one proving the **R1-critical** path is
  load-bearing (mutate "marker present → suppress" so a marker no longer suppresses → the R1-regression
  test reds at its named assertion).

### 5. ADR-030 addendum — **architect work, not mine**
Path 2 corrects a *presupposition* ADR-030 stated (transcript can confirm no-tool), so it needs a
recorded **ADR-030 addendum** (mechanism = PreToolUse marker; marker lifetime = consume-on-read,
stale→dormant; the confidence rule). I will **flag this for the architect** (`fkit-record-decision`);
I do not write ADRs or the wiki.

## Verification
1. `node --test test/*.test.js` — new marker suite + reworked Stop suite + launcher-contract green.
2. `bash test/prove-red.sh` — hard gate passes; both named mutations red their named assertions.
3. Generate settings (`fkit` launch under the test harness) → `.fkit/settings/<role>.json` has two
   PreToolUse entries (Skill + AskUserQuestion) + the Stop entry; validate the JSON.
4. **Hand-verified, flagged loudly (ADR-012):** the live path — PreToolUse marker actually written on a
   real `AskUserQuestion` call, Stop actually suppressing/consuming — cannot be exercised by a spawned
   subagent or headless run (AskUserQuestion is absent there, ADR-021). The `node --test` suites cover
   all *script logic* against synthetic payloads + real marker files; the live wiring stays hand-verified
   and I will say so in the close-out, not claim it passed.
5. Re-run the model-diverse review (reviewer phase 2 / new round) against the reworked diff.

## Out of scope
- The prose half (task 0128) · task 0116 (this only unblocks it) · writing the ADR addendum (architect).
- No commit — working tree only.
