# Review — 0127

Task: ai-agents/tasks/done/0127-build-adr-030-stop-hook/brief.md
File(s) under review: claude/turn-completion-hook.sh (new); claude/fkit-claude.sh (build_settings);
test/turn-completion-hook.test.js (new); test/launcher-contract.test.js (Group B); test/prove-red.sh
Status: closed-out (Round 3 re-close — R7 fixed & owner-live-verified; R8 accepted as a bounded residual)

Reviewers run (Round 1): reviewer (Claude) pass + Codex adversarial pass via `codex exec` (codex-cli
0.144.4) — BOTH ran; full model-diversity coverage, no degradation. Transcript-structure facts confirmed
against the official Claude Code hooks/sessions docs via the claude-code-guide agent.

Verdict (Round 1): 🛑 Blocked — 2 confirmed fail-open-violating defects (1 high, 1 medium) + 1
owner-disposition divergence. Both defects are the exact re-raisable class ADR-030 names ("the hook
blocks a turn it should not have — a defect against Decisions 6–7, fix the hook").

Verdict (Round 2 — CLOSE-OUT): ✅ Ready to merge (validation-gated). R1/R2/R3 confirmed fixed for their
raised triggers. R4 (a narrowed residual of the R1 fail-open class) HARDENED per owner — `marker_infra_ok`
now requires the state dir to be writable, closing the dir-present-but-unwritable false-block in the safe
direction; the false "failed write → fails open" comment corrected; the remaining exotic mid-session
cwd-change corner recorded as an accepted residual. R5 and R6 accepted as bounded residuals (R6 with a
named producer follow-up for a transcript-independent ship-loop skip). Both reviewers ran (Codex 0.144.4 +
reviewer) — full model-diverse coverage, no degradation. No open confirmed defects. Automated gate:
`node --test test/*.test.js` → 493 pass / 0 fail; `bash test/prove-red.sh` → hard gate PASSED. Validation-
gate: the live session-scoped path stays hand-verified (ADR-012 / ADR-021 — AskUserQuestion absent
headlessly).

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | high   | claude/turn-completion-hook.sh:118-126 (also :81,:122) | Check A's AskUserQuestion detection via the transcript scan sets `asked_with_tool=0` **confidently** when it cannot actually confirm the tool's absence → **false BLOCK** (fail-open violation). Confirmed two ways: (a) a real AskUserQuestion call whose `tool_result` is a later `"type":"user"` line resets the awk "after last user line" window PAST the call; (b) a readable but unexpected-format transcript (e.g. `/etc/hosts`) yields a confident no-tool. Official docs additionally say the transcript file LAGS in-memory state and parsing it is unsupported/version-fragile, so even a well-formed transcript may not yet hold the current turn's call. The DID_ASK test fixture (test:71) omits the trailing `tool_result` user-line, so the passing suite does NOT exercise the real structure — coverage is overstated. |
| R2 | 1     | medium | claude/turn-completion-hook.sh:95-99 | The empty/absent-message allow-guard is format-fragile, so an empty / `null` / unanticipated-shape `last_assistant_message` slips past it and reaches Check B, which **blocks by default** (fail-open violation). The guard is a literal no-space substring `"last_assistant_message":""`; it does not handle a space after the colon, a literal JSON `null`, or a truncated payload that still contains the key. The extraction helpers tolerate `[[:space:]]*` around colons but this guard does not — internal inconsistency. Load-bearing trigger: a turn ending with no assistant text → `null`/empty → blocked. The suite's "malformed→allow" (test:167) and "empty→allow" (test:175) only cover the key-absent / no-space shapes, giving false confidence in the stated "every parse failure allows" invariant. |
| R3 | 1     | medium | claude/turn-completion-hook.sh:114,116 | Check A fires more broadly than the **approved plan** specified: plan §Check-A said "a line ENDING in `?`, outside code fences AND `>` block-quotes"; the implementation strips only triple-fenced spans (`:114`) then fires on ANY `?` anywhere (`:116`) — no line-ending anchor, no blockquote exclusion, inline-code and URL `?query` fire. These are ACCEPTED heuristic false positives per ADR-030 Consequences (bounded by block-once), so NOT a fail-open defect — but the shipped breadth exceeds what the owner approved, i.e. more (accepted) false blocks than the plan intended. Owner disposition: accept as-shipped, or tighten to the approved plan. |
| R4 | 2     | medium | claude/turn-completion-hook.sh:67-70,125-129 (+ askuserquestion-marker-hook.sh:16-19,51-52) | `marker_infra_ok` trusts "`$cwd/.fkit/state` exists" as proof the marker *could* have been recorded — but that dir is created by the **launcher** (`build_settings` mkdir), independently of whether the marker hook fired or could write. When the dir exists yet the marker WRITE fails (state dir present but unwritable), **or** the Stop cwd differs from the PreToolUse write cwd, then `marker_infra_ok=1` + `had_marker=0` → `asked_with_tool=0` → check A fires → **confident false BLOCK** — the exact R1 fail-open class, narrowed not eliminated. The marker-hook comment (:16-19) asserting "a failed write simply leaves no marker → Stop fails open" is FALSE in the dir-present/write-failed corner: Stop fails open only on dir ABSENCE, not on a failed write with the dir present. Trigger is narrow (degraded infra / mid-session cwd change) and impact is bounded by block-once, but it violates Decision 6 in the exact direction ADR-030 rates worst. Raised by both reviewers (Codex C1+C2, reviewer focus-2). |
| R5 | 2     | medium | claude/turn-completion-hook.sh:74-90 | Decision 7 names "other **non-interactive runs**" as a skip, but the only skips implemented are `stop_hook_active`, the adversarial reviewer, and the ship-loop transcript marker. A TOP-LEVEL headless run (`fkit <role> -p '…'`) emits a plain `Stop` event with no matching skip: check B demands a footer, and check A can demand `AskUserQuestion` (absent headlessly — ADR-021) → a spurious block. Escapable via block-once (self-heals; not an unescapable hang like a consult), and possibly **not detectable** from the Stop payload — so this is an owner disposition, not a clear defect: is a top-level headless run in-scope for the Decision-7 skip, and is it distinguishable from the payload? (Codex C4.) |
| R6 | 2     | low    | claude/turn-completion-hook.sh:81-90 | The ship-loop skip runs only when `transcript_path` is present AND readable, and it leans on the very transcript R1 moved check A OFF of ("lags in-memory state, version-fragile"). A missing/unreadable transcript — or transcript lag on an early ship-loop turn — means a real ship-loop turn is NOT skipped → false BLOCK. This meets the *Accepted-residual* re-raise condition ("Re-raise only if: it under-skips … a real ship-loop turn") verbatim, so it is surfaced not suppressed. But the trigger is degraded-only (a live session normally has a readable transcript), impact is bounded by block-once, and it is session-only; the transcript dependence is pre-existing and unchanged by this diff. (Codex C5.) |
| R8 | 3     | low    | claude/turn-completion-hook.sh:100-105 | **R7 is genuinely fixed for its raised trigger** (a bare `/fkit-…ship-loop` mention no longer skips — negative test + prove-red mutation 6 pin it; owner-live-verified). But the fix **narrows, does not eliminate**, the over-skip: SKIP 3 still does an **unstructured byte-substring** match on the whole transcript, so any transcript that carries the **literal** `<command-name>/fkit-…ship-loop</command-name>` text **as content** — a file read of the hook source / test / this very ledger (all contain it literally), a `tool_result`, an attachment, a pasted transcript excerpt — false-skips → hook silently disabled for that turn and every later turn in the session. **Reproduced** (both reviewers): feeding the hook's OWN source as `transcript_path` + a footer-less message → `allow` (should block). **Direction: over-skip / fail-open-safe — does NOT violate the ADR-030 Decision-6 fail-open invariant (never a false block).** Trigger is now uncommon for a **downstream consuming project** (its sessions don't read fkit's internals) but **common on the fkit-self / dogfooding repo** (sessions editing/reviewing these files — including this one). Same class as the accepted "over-match" residual, narrowed from bare-string to exact-markup. Untested over-skip shape: a non-command `tool_result`/attachment record carrying the COMPLETE marker (test:203/216 only cover a real invocation and a bare mention). Durable fix is transcript-independent — **task 0129** (Codex adds: Claude Code's `UserPromptExpansion` hook exposes an authoritative `command_name`). Raised by both reviewers. |

## Coder response

<!-- CODER-OWNED. The reviewer does not write here. -->

### Round 1 dispositions (post owner + architect decisions)

All three verified. R1+R2 are CORRECT fail-open defects; R3 is a CORRECT plan-divergence. Owner escalated
R1's mechanism to the architect; owner ruled **Path 2** (a PreToolUse `AskUserQuestion` marker replaces
the unreliable transcript scan) and **tighten R3 to the plan**. The check-A design changed, so the R1/R2/R3
`:line` references point at the now-replaced Round-1 code.

| # | Verdict | Action taken |
|---|---------|--------------|
| R1 | CORRECT — fixed (design change) | **Path 2.** Removed the transcript-based `asked_with_tool` entirely. Check A's "no AskUserQuestion this turn" now comes from a **PreToolUse marker**: new `claude/askuserquestion-marker-hook.sh` (matched on `AskUserQuestion`, verified to fire — docs) touches `$cwd/.fkit/state/askuq-<session_id>`; the Stop hook reads **and consumes** it. `asked_with_tool = marker-present OR NOT marker_infra_ok` → a turn that used the tool is never blocked, and an untrustworthy signal fails open. New test `A/R1 regression: marker present … -> allow` pins the exact returning defect; `prove-red.sh` mutation 4 proves it load-bearing. The docs-confirmed transcript-lag concern is now moot (no transcript read for check A). |
| R2 | CORRECT — fixed | Empty/`null`/absent message now diverts to `allow` **before** check B, tolerating `[[:space:]]*` after the colon (`grep -qE '"last_assistant_message"[[:space:]]*:[[:space:]]*(null|"")'` + key-absent guard). New tests: `R2: empty-string / JSON null / whitespace after the colon -> allow`. |
| R3 | CORRECT — fixed (tightened to plan) | Check A interrogative test is now **line-based**: a line **ending in `?`**, excluding ` ``` ` fenced lines, `>` blockquote lines, and any line carrying the `What's next?` heading. New tests: fenced-only `?` → allow, `>`-quoted `?` → allow, `## What's next?` heading → allow, a real prose `Should I ship it?` → block. |

**Re-verified after the rework:** `node --test test/*.test.js` → **491 pass / 0 fail**; `bash test/prove-red.sh` → **hard gate PASSED** (5 mutations, each reds its named assertion). Model-diverse Round 2 requested.

**Still hand-verified (ADR-012):** the live path — a real `AskUserQuestion` call writing the marker, the Stop actually blocking — cannot be exercised by automation (AskUserQuestion is absent headlessly, ADR-021). Suites cover all script logic + real marker files against synthetic payloads.

### Round 2 dispositions (post owner ruling)

R1/R2/R3 confirmed fixed. R4/R5/R6 dispositioned by the owner.

| # | Verdict | Action taken |
|---|---------|--------------|
| R4 | CORRECT — **hardened** (owner: harden + fix comment) | Added `[ -w "$cwd/.fkit/state" ]` to `marker_infra_ok` in `turn-completion-hook.sh`: an unwritable state dir ⇒ marker-absence untrustworthy ⇒ suppress check A (fail open). Closes the "dir exists but unwritable" false-block corner in the mandated direction. Fixed the false "failed write → fails open" comment in `askuserquestion-marker-hook.sh:16-23` (the safety lives in the Stop hook's writability check, stated so). New test `A/R4 … dir present but not writable -> allow` (root-guarded). **Accepted residual:** a mid-session cwd change between the PreToolUse write and the Stop read is not detectable here — genuinely exotic (see Accepted residuals). |
| R5 | PARTIALLY CORRECT — **accepted residual** (owner) | Top-level headless `-p` run has no skip. Accepted as bounded: the misfire self-heals via block-once (escapable), and a top-level headless run may not be distinguishable from the Stop payload. Recorded in Accepted residuals. |
| R6 | PARTIALLY CORRECT — **accepted residual + follow-up** (owner) | Ship-loop skip under-skips when the transcript is missing/unreadable/lagging. Accepted as bounded (block-once-bounded, session-only, pre-existing). **Follow-up named** (not filed by me — producer's job): give the ship-loop(s) a reliable, transcript-independent skip signal (e.g. the loop writing its own state marker); task 0116 builds on the same seam. |

**Low notes addressed:** whitespace-only message value `"   "` now also fails open (R2 guard extended to `(null|"[[:space:]]*")`) — new test added. The truncated-but-key-present payload is left as-is: the hook is jq-free by design (sibling-hook pattern) and cannot validate JSON well-formedness; per review it needs Claude Code to emit a truncated *local* Stop payload — negligible, and documented here rather than papered over.

**Re-verified after R4 harden:** `node --test test/*.test.js` → **493 pass / 0 fail**; `bash test/prove-red.sh` → **hard gate PASSED**.

### REOPENED — R7 (owner live-verify, 2026-07-23): SKIP 3 over-skip disabled the hook

**How it was found:** owner ran the live hand-verification (the step ADR-012 always left open). In a real
`fkit coder` session the Stop hook did **not** nudge a footer-less reply. Diagnosis (debug trace + a
sweep of every on-disk transcript): **SKIP 3 matched the *bare* command string `/fkit-task-ship-loop`
anywhere in the transcript** — including attachments, the sprint plan, skill lists, and ordinary
discussion. A session that never invoked a loop (0 `<command-name>` markers, but the bare string present
in attachments) was skipped → `allow` short-circuited **before check B** → the hook was **silently
disabled**. Fail-open-safe (never a false block) but it **did not enforce**. **Both prior review rounds
and the unit suite missed it — the suite only asserted "transcript *with* the marker → skip" and had no
negative test that a *mention* must NOT skip.** That gap is the root cause.

**Verdict:** CORRECT — real defect (a fail-open-direction miss that defeats the feature). Severity: it
disabled the hook in the majority of real fkit sessions.

**Fix applied:** SKIP 3 now matches the slash-command **invocation marker**
`<command-name>/fkit-…ship-loop</command-name>` (verified across on-disk transcripts: mention-only
sessions carry zero such markers; real invocations carry ≥1), not the bare string. Added the **missing
negative tests** (`NO-SKIP: a bare …ship-loop mention -> block`) for both loops, and prove-red
**mutation 6** (revert to bare string → the regression test reds) to make the fix load-bearing. Still
transcript-based and fragile (under-skips on a missing/lagging transcript — residual R6); **task 0129**
is the durable transcript-independent replacement.

**✅ LIVE-VERIFIED (the first time this component has been):** after the fix, in a real session the Stop
hook fired, blocked once with the check-B message, the model was forced to append "What's next?", and
block-once held (one block, subsequent stops suppressed via `stop_hook_active`). The `{"decision":"block"}`
route **is** honored by Claude Code. Re-verified suite: **496 pass / 0 fail**; prove-red **PASSED**.

### Round 3 disposition (post owner ruling)

- **R7 — fixed & owner-live-verified** (see the REOPENED section above). Closed.
- **R8 — ACCEPTED as a bounded residual** (owner). The substring scan over-skips when the *complete*
  `<command-name>…</command-name>` marker appears as transcript CONTENT (file read / tool_result /
  attachment / pasted excerpt). Fail-open-safe (never a false block); common on this dogfooding repo,
  rare downstream. Recorded in Accepted residuals; **real fix = task 0129** (transcript-independent
  signal; Codex lead: Claude Code's `UserPromptExpansion` exposes an authoritative `command_name`).
  **Owner pulled 0129 forward** (re-rank requested) because R8 leaves the hook non-enforcing in most
  fkit-self-maintenance sessions until then.
- **Known-limitation test added** — `KNOWN-LIMITATION/R8: the marker appearing as file/tool_result
  CONTENT still over-skips (0129 will fix)` documents current (over-skip) behaviour; it flips to a block
  when 0129 lands. Suite: **497 pass / 0 fail**; prove-red **PASSED**.

## Accepted residuals (shared, do-not-re-litigate)

- Check A heuristic false positives (rhetorical / quoted-back / in-code questions) — What: check A blocks
  on a positive `?`-detection even when the `?` is not a genuine owner question · Why (structural):
  ADR-030 Consequences accept this knowingly, bounded by block-once; a smarter judge was rejected (model
  call = large blast radius for a footer) · Re-raise only if: the block fires under UNCERTAINTY/ERROR
  rather than a confident detection (that is R1/R2, a Decisions 6–7 defect), OR agents start inventing
  next steps / the section becomes filler (reopen Decision 3–4).
- Check B searching the whole payload (not only the message) — What: "What's next?" is matched anywhere
  in the payload · Why (structural): the only free-text field is `last_assistant_message`; over-matching
  errs toward NOT blocking = the mandated safe direction (fail-open) · Re-raise only if: a non-message
  field could plausibly carry the literal heading and cause a false ALLOW that matters.
- Ship-loop skip over-matching — What: any transcript merely containing `/fkit-task-ship-loop` skips ·
  Why (structural): over-skip = not-block = ADR-030 Decision 6 safe direction; it is the extensible seam
  task 0116 extends · Re-raise only if: it under-skips (fails to skip a real ship-loop turn).
- `$here` not JSON-escaped/shell-quoted in the generated hook command (fkit-claude.sh) — What: an install
  path containing `"` or `$(...)` could break the settings JSON / substitute · Why (structural):
  PRE-EXISTING and identical for the ADR-018 PreToolUse hook this diff mirrors; `$here` is a trusted,
  operator-controlled, freshly-regenerated absolute path, not attacker input (design §5.1) · Re-raise
  only if: pursued as a SEPARATE hardening task against BOTH hooks — out of scope for 0127, which only
  mirrors the settled wiring pattern.
- Marker cwd-mismatch corner (R4 residual, post-harden) — What: after the R4 harden (`marker_infra_ok`
  now also requires `[ -w "$cwd/.fkit/state" ]`, closing the dir-present-but-unwritable false block), one
  corner remains: if the payload `cwd` at the PreToolUse marker write differs from the `cwd` at the Stop
  read AND the Stop-side dir exists and is writable, the marker is looked for in the wrong place →
  `marker_infra_ok=1` + `had_marker=0` → check A could false-block · Why (structural): both hooks key the
  marker by invocation-time `cwd`, which is not reconcilable from a single Stop payload; the trigger is
  genuinely exotic (a mid-session working-directory change between an AskUserQuestion call and turn end),
  bounded by block-once, and the writable-dir harden already closes the common degraded-infra vector ·
  Re-raise only if: the payload `cwd` is confirmed to change mid-session in practice (a real false block
  observed), OR a `cwd`-independent marker key becomes available.
- No skip for a top-level headless (`-p`) run (R5) — What: Decision 7 names "other non-interactive runs"
  as a skip, but a TOP-LEVEL `fkit <role> -p '…'` emits a plain `Stop` with no matching skip, so check B
  (and check A, demanding the headlessly-absent AskUserQuestion) can spuriously block · Why (structural):
  the misfire self-heals via block-once (escapable — unlike the unescapable consult case Decision 7 exists
  to prevent), and a top-level headless run is likely not distinguishable from the Stop payload, so there
  is no reliable signal to skip on · Re-raise only if: a reliable headless/`-p` signal appears in the Stop
  payload, OR the block is shown to be unescapable (not self-healed by block-once) in a headless run.
- Ship-loop under-skip on a missing/unreadable/lagging transcript (R6) — What: the ship-loop skip runs
  only when `transcript_path` is present AND readable and leans on the transcript R1 fled ("lags,
  version-fragile"); a missing/unreadable/lagging transcript means a real ship-loop turn is NOT skipped →
  false block · Why (structural): degraded-only (a live session normally has a readable transcript),
  block-once-bounded, session-only, and pre-existing/unchanged by this diff · Re-raise only if: the under-
  skip is observed on a normal (non-degraded) ship-loop turn · **Named follow-up (producer to file, not
  this task):** give the ship-loop(s) a reliable, transcript-INDEPENDENT skip signal (e.g. the loop
  writing its own state marker); task 0116 builds on the same seam.
- SKIP 3 over-skips on the literal marker as transcript CONTENT (R8, Round 3, owner-accepted) — What:
  R7 fixed the bare-string over-skip, but SKIP 3 still does an UNSTRUCTURED byte-substring match on the
  whole transcript (`turn-completion-hook.sh:100-105`), so a transcript that carries the COMPLETE
  `<command-name>/fkit-…ship-loop</command-name>` marker as ordinary CONTENT — a file read of the hook
  source / test / this ledger (all contain it literally), a `tool_result`, an attachment, or a pasted
  transcript excerpt — false-skips → the hook is silently non-enforcing for that turn and every later
  turn in the session (reproduced: feeding the hook's own source as `transcript_path` + a footer-less
  message → allow) · Why (structural): over-skip = not-block = ADR-030 Decision-6 fail-open SAFE
  direction (it CANNOT false-block); trigger is common on the fkit-self / dogfooding repo (sessions
  editing/reviewing these files) but rare for a downstream consuming project (whose sessions don't read
  fkit's internals); any substring match on raw transcript text inherits the content-collision, and a
  JSONL-structural match only mitigates while staying schema-fragile. Documented by the KNOWN-LIMITATION
  test (`KNOWN-LIMITATION/R8: … marker … as file/tool_result CONTENT still over-skips`), which flips to
  a block when the durable fix lands · Re-raise only if: it causes an UNDER-skip on a normal turn, OR it
  is observed to false-BLOCK (it cannot — over-skip only) · **Durable fix = task 0129** (owner pulled it
  forward): a transcript-INDEPENDENT invocation signal — the lead surfaced Claude Code's
  `UserPromptExpansion` hook, which exposes an authoritative `command_name`, as the robust source.
