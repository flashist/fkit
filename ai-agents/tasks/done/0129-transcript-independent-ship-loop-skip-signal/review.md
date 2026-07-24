# Review — 0129

Task: ai-agents/tasks/done/0129-transcript-independent-ship-loop-skip-signal/brief.md
File(s) under review: claude/shiploop-marker-hook.sh (new); claude/turn-completion-hook.sh (SKIP 3
rework, transcript read removed); claude/fkit-claude.sh (build_settings — UserPromptExpansion wiring);
test/shiploop-marker-hook.test.js (new); test/turn-completion-hook.test.js (ship-loop tests reworked);
test/launcher-contract.test.js (8c + inline + exists); test/prove-red.sh (mutation 6)
Status: closed-out

Reviewers run (Round 1): reviewer (Claude) pass + Codex adversarial pass via `codex exec` (codex-cli
0.144.4) — BOTH ran; full model-diversity coverage, no degradation.

Verdict (close-out): ✅ Ready to merge (validation-gated). R3 FIXED by the owner (prove-red mutation 7
+ `run_shiploop_marker_suite` + `0f` baseline — reviewer re-verified: hard gate PASSED with mutations
1–7; the writer's `command_name` self-filter, which IS the R8 fix, is now load-bearing). R1 and R2
owner-ruled ACCEPTED as bounded residuals (both safe-direction, never a false BLOCK — recorded below).
No open confirmed defects; the binding ADR-030 Decision-6 fail-open invariant is intact. Validation-gate:
the live path (a real invocation writing the marker + the Stop skip) stays hand-verified (ADR-012/ADR-021).

Verdict (Round 1): ⚠️ Changes requested — 3 low findings, NONE blocking. The binding invariant holds:
ADR-030 Decision 6 (fail-open) is intact — no path produces a false BLOCK. R8 is genuinely fixed (the
Stop hook reads NO transcript now; the marker file can only be created by the UserPromptExpansion hook on
a real invocation) and R6 is genuinely fixed (skip works with no transcript). Automated gate reproduced:
`node --test test/*.test.js` → 511 pass / 0 fail; `bash test/prove-red.sh` → hard gate PASSED (mutations
1–6 each red their named assertion). Live path (a real invocation writing the marker + the Stop skip)
stays hand-verified (ADR-012 / ADR-021). All three findings are safe-direction (over-skip / never-block)
or test-coverage — each is an owner disposition, not a correctness blocker.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | low | claude/shiploop-marker-hook.sh:64 | The marker write `: > "$cwd/.fkit/state/shiploop-$session_id"` follows a symlink and opens a FIFO. If that path is a pre-existing **symlink**, the target file is **truncated**; if it is a **FIFO**, `: >` blocks on open with no timeout (`2>/dev/null` silences only stderr, not the blocking open) → the UserPromptExpansion hook **hangs**, stalling command expansion. Records-only/never-block still holds for the *Stop* invariant (this hook never emits a block, so no false Stop-BLOCK), but a hang is a functional stall of the observed command. **Trigger is exotic:** needs write access to `$cwd/.fkit/state/` AND a symlink/FIFO planted at the exact `shiploop-<session_id>` name, and `session_id` is a fresh, non-predictable Claude-Code identifier. **Not 0129-specific** — the write idiom is byte-identical to the 0127 sibling `askuserquestion-marker-hook.sh:57`, which passed 0127 review; this diff mirrors it. Codex severity: medium; downgraded to low here on the exotic, non-predictable trigger. Fail-open invariant not violated. Raised by Codex. |
| R2 | 1 | low | claude/shiploop-marker-hook.sh:28-30,45,49 | `extract_top` matches the **first** `"key":"value"` anywhere in the payload (`grep -o … | head -1`), not the authoritative top-level value — so a nested `command_name`/`expansion_type` (e.g. a `"meta":{…}` sub-object) or a crafted `prompt` field carrying a literal `"command_name":"fkit-task-ship-loop"` that serializes *before* the real field can make a **non-loop** invocation write the ship-loop marker → the Stop hook is disabled for that (non-loop) session. **Direction: over-skip = never a false BLOCK = ADR-030 Decision-6 SAFE.** It does NOT re-open R8 as a false-block; it is the same jq-free-parsing content-collision class the 0127 residuals already accept, moved from the transcript to the payload, and in the safe direction only. The mirror case (a nested non-loop `command_name` before a real loop one → no marker → under-skip on a real loop turn) is block-once-escapable, bounded. So the R8 boundary is not *structurally* enforced by parsing, only by the (normally flat, Claude-Code-controlled) payload shape. Raised by Codex. |
| R3 | 1 | low | test/prove-red.sh:59-77,163-251 (and the absent `FKIT_SHIPLOOP_MARKER_HOOK` runner) | The new **authoritative writer** `shiploop-marker-hook.sh` — whose `command_name`/`expansion_type` self-filter IS the R8 fix — has **no prove-red mutation**. `FKIT_SHIPLOOP_MARKER_HOOK` appears 0 times in prove-red.sh; mutation 6 mutates the **reader** (`turn-completion-hook.sh`, marker-existence check) against a hand-placed marker, not the writer's gate. So the hard gate does not prove the writer's self-filter tests (shiploop-marker-hook.test.js) are load-bearing — a broken command_name/expansion_type gate would not necessarily red the gate. Contrast: the askuq sibling writer DOES have such a mutation (mutation 5, via `run_marker_hook_suite`). The plan (§4, prove-red) offered exactly this option ("or the marker hook's command_name gate removed") and the reader mutation was chosen instead. Tests themselves exist and pass (76/76 in the affected suites); this is a hard-gate coverage gap, not a code defect. Raised by Codex. |

## Coder response

<!-- CODER-OWNED. The reviewer does not write here. -->

### Round 1 dispositions

All three verified CORRECT; none is a fail-open violation (no false-BLOCK path). R8 + R6 confirmed fixed.

| # | Verdict | Action |
|---|---------|--------|
| R3 | CORRECT (test-coverage) — **FIXED** | Added `prove-red.sh` **mutation 7** (+ a `0f` baseline + `run_shiploop_marker_suite`): remove the marker hook's `command_name` gate → the `a NON-ship-loop command → writes nothing` test reds. The writer's self-filter — the R8 fix — is now load-bearing under the hard gate, matching the askuq sibling's mutation 5. Hard gate PASSED with mutations 1–7. |
| R1 | CORRECT (frontier) — **owner disposition** | Marker write `: > …/shiploop-$session_id` follows a symlink / hangs on a FIFO planted at the session-keyed path. Never a false Stop-BLOCK; exotic trigger. **Byte-identical to the shipped-and-accepted 0127 sibling** `askuserquestion-marker-hook.sh`. Recommend accept as residual (consistent with 0127) or a combined hardening follow-up over BOTH marker hooks. |
| R2 | CORRECT (frontier) — **owner disposition** | `extract_top` first-match could pick a nested/`prompt`-embedded `command_name` → a non-loop invocation writes the marker → **over-skip (never a false BLOCK — ADR-030-safe)**. Same jq-free content-collision class already accepted across the hooks, in the safe direction. Recommend accept as residual. |

## Accepted residuals (shared, do-not-re-litigate)

<!-- Carried forward from 0127 review.md — apply to this diff's shared seam; do not re-raise unless the
     stated condition is met. New 0129 dispositions to be added by the owner at close-out. -->
- Ship-loop marker persists for the session (no explicit clear) — What: after a loop ends, post-loop
  non-loop work in the same session is still skipped · Why (structural): over-skip = never-block = ADR-030
  Decision-6 safe direction; matches the old transcript-marker semantics · Re-raise only if: it causes an
  UNDER-skip on a normal turn OR a false BLOCK.
- Dead-session marker files accumulate under `.fkit/state/` — inert (session-keyed, never matched by a new
  id); cleanup optional · Re-raise only if: accumulation is shown to cause a real problem.
- Marker cwd-mismatch corner (mid-session `cwd` change between the invocation write and the Stop read) —
  bounded, block-once-escapable, genuinely exotic · Re-raise only if: a real mid-session `cwd` change is
  demonstrated OR it produces an unescapable block.
- `$here` not JSON-escaped/shell-quoted in the generated hook command (fkit-claude.sh) — pre-existing,
  trusted operator-controlled path; identical for every wired hook · Re-raise only if: pursued as a
  SEPARATE hardening task against ALL marker/lockdown hooks.

<!-- New 0129 dispositions (owner-ruled, Round-1 close-out) -->
- Marker write follows a symlink / hangs on a FIFO (R1) — What: `shiploop-marker-hook.sh:64`
  `: > "$cwd/.fkit/state/shiploop-$session_id"` follows a symlink (truncates the target) and blocks on
  open if the path is a FIFO (the UserPromptExpansion hook then hangs, stalling command expansion) · Why
  (structural): write-only and OFF the Stop path, so it can NEVER produce a false Stop-BLOCK (the ADR-030
  Decision-6 invariant is untouched); the trigger is exotic (needs write access to `.fkit/state/` AND a
  symlink/FIFO planted at the non-predictable `shiploop-<session_id>` name); and the write idiom is
  byte-identical to the shipped-and-accepted 0127 sibling `askuserquestion-marker-hook.sh:57` — owner
  declined a separate hardening task, consistency with 0127 wins · Re-raise only if: it is shown to cause
  a false BLOCK (it cannot — write-only, off the Stop path), OR a symlink/FIFO write is observed in
  practice.
- `extract_top` first-match can pick a nested/`prompt`-embedded `command_name` (R2) — What:
  `shiploop-marker-hook.sh:28-30` matches the first `"command_name":"…"` anywhere in the payload, so a
  nested (`"meta":{…}`) or `prompt`-embedded value that serializes before the authoritative field can make
  a NON-loop invocation write the ship-loop marker → the Stop hook is disabled for that (non-loop) session
  · Why (structural): over-skip = never a false BLOCK = ADR-030 Decision-6 SAFE direction; it does NOT
  re-open R8 as a false-block; same jq-free content-collision class already accepted across the hooks,
  moved from the transcript to the (normally flat, Claude-Code-controlled) payload · Re-raise only if: it
  produces a false BLOCK (it cannot — over-skip is fail-open-safe), OR Claude Code starts emitting
  non-flat payloads where a nested `command_name` routinely precedes the real one.

<!-- R3 was FIXED, not accepted — recorded in the Coder response section (prove-red mutation 7 +
     run_shiploop_marker_suite + 0f baseline; hard gate PASSED with mutations 1–7; the writer's
     command_name self-filter — the R8 fix — is now load-bearing). Reviewer re-verified. -->

