# Worklog — 0127 Build the ADR-030 `Stop` turn-completion hook

**Task:** `0127-build-adr-030-stop-hook` · **Owner:** fkit-coder · started via `/fkit-task-ship-loop`.
Plan approved 2026-07-23 (see `plan.md`). Status → 🔄 In progress (brief + sprint-2 row).

## Owner-decision log
- **Plan approved** (upfront gate). Owner rulings captured pre-plan: Check B = literal `What's next?`;
  checks universal (all roles); ship 0127 now.
- (Autonomous choices during build are logged below as they happen.)

## Build log
- Grounded: ADR-030, design report `2026-07-19-design-turn-completion-hook.md`, existing
  `skill-ownership-hook.sh` + `build_settings()` + test suites + `prove-red.sh`. Consulted
  claude-code-guide (hop 1) for authoritative `Stop`-hook payload facts — resolved the design's three
  coder-TODOs (see plan Context).

### Files changed
- **NEW `claude/turn-completion-hook.sh`** — the Stop hook. Fail-open always; `allow()`=exit 0 empty
  stdout, `block()`=`{"decision":"block","reason":"…"}` exit 0. Skips: `stop_hook_active` (block-once),
  `agent_type==fkit-adversarial-reviewer`, transcript ship-loop marker (extensible list). Check B exact
  (raw-payload substring, no truncation risk); check A heuristic (fenced/heading-excluded interrogative
  + transcript-confirmed no-AskUserQuestion, suppress on any uncertainty).
- **EDIT `claude/fkit-claude.sh`** `build_settings()` — second `Stop` key in the same `{"hooks":{…}}`
  object; no matcher; mirrors PreToolUse wiring (`bash "$here/…"`, inline fallback covered).
- **NEW `test/turn-completion-hook.test.js`** — 20 script-logic tests; `FKIT_TURN_COMPLETION_HOOK` seam.
- **EDIT `test/launcher-contract.test.js`** — Group B assertion 8b (Stop wired, no matcher, PreToolUse
  survives) + 10 (script exists) + 11 (inline fallback carries Stop).
- **EDIT `test/prove-red.sh`** — 0d baseline + mutation 3 (disable check B → named red).

### Autonomous decisions (obvious winners, in-plan)
- **Block-once via Claude Code's built-in `stop_hook_active`, not a marker file** — resolves design §7
  OQ3 with no stale-marker hazard. Verified via claude-code-guide.
- **Consult skip is structural (register Stop only, never SubagentStop)** — the safety-critical skip
  needs no `is_interactive_session()` heuristic.
- **Ship-loop skip via transcript command-marker scan** (the extensible seam 0116 extends). Flagged to
  owner at the plan gate; approved.

### Review round 1 — BLOCKING (model-diverse: reviewer + Codex 0.144.4)
Ledger: `review.md`. Findings: **R1 (high, CORRECT)** check A false-BLOCKs a turn that used
AskUserQuestion (transcript can't confirm no-tool: `tool_result` is a `type:user` line that resets the
scan; transcript lags; readable non-JSONL reads as confident no-tool) — reproduced by me. **R2 (medium,
CORRECT)** `null`/space-after-colon empty message slips the allow-guard → check B blocks — reproduced by
me. **R3 (medium, frontier)** check A fires on any `?`, broader than the approved plan.

### Owner decisions (round 1)
- **R1 / check A mechanism → ESCALATE TO ARCHITECT.** The plan assumed the transcript could confirm
  "no AskUserQuestion this turn"; it can't. New design question the plan didn't anticipate → owner
  directed a `@fkit-architect` consult; owner makes the final call (architect advises, not decides).
- **R3 breadth → tighten to the approved plan** (line-ending `?`, exclude fences + `>` quotes) **if**
  check A retains teeth (moot if the architect/owner land on check-A-dormant).
- **R2 → fix fail-open regardless** (obvious winner) — held until the check-A direction is settled, so
  all fixes land in one pass + one re-verify + one reviewer phase-2.
- **Status → 🚧 Blocked — awaiting decision: check A mechanism (architect consult in flight).**

### Architect consult (hop 1) — recommendation
- **Finding is decision-level, not implementation-level:** ADR-030 Decision 2A presupposed a mechanism
  ("detect no AskUserQuestion this turn") that has **no reliable signal** in a Stop hook's surfaces. The
  ADR anticipated check A being *lossy* (Decision 5), not *inert*. → owner's call, ADR-030 amendment.
- **Reject path 3** (fire on `last_assistant_message` alone) — blocks under uncertainty, violates
  Decision 6.
- **Recommend path 2 — a PreToolUse `AskUserQuestion` marker** (extend the proven ADR-018 path,
  §5.1): a PreToolUse hook matched on `AskUserQuestion` writes a turn-scoped marker; the Stop hook reads
  (and consumes) it → marker present = tool used = suppress check A. Dissolves all three false-block
  paths (no transcript parse, no window-reset, no lag). **Caveat: PreToolUse firing on AskUserQuestion
  is undocumented — must be empirically verified in a live session first.** Marker lifetime = design §7
  OQ3, now load-bearing; consume-on-read; stale marker fails toward dormant (safe).
- **Fallback path 1 (dormant check A)** only if path 2 fails verification — but it re-instates the
  prose-only option ADR-030 rejected for the owner's #1 complaint, so it needs a **substantive
  owner-signed amendment**, not a note.
- Architect owner-questions: (1) is complaint #1 worth path 2's added cross-hook blast radius, or ship
  check B now + defer check A? (2) if deferred, the 0128 prose clause becomes the *sole* carrier of
  "ask interactively" — owner should know. (3) if path 2 fails, ship dormant check-A code or omit it?

### Verification (pre-review)
- `node --test test/*.test.js` → **481 pass / 0 fail**.
- `bash test/prove-red.sh` → **hard gate PASSED**; mutation 3 reds the named check-B assertion.
- `bash -n` clean on both scripts; generated hooks JSON validates (PreToolUse + Stop, Stop matcher-less).

### Path-2 rework (post owner ruling) + Round-1 fixes
- **Verified gating fact (docs, high confidence):** PreToolUse **fires on AskUserQuestion** (explicitly
  listed; only EndConversation is exempt; payload carries `tool_name`). Path 2 is viable.
- **NEW `claude/askuserquestion-marker-hook.sh`** — PreToolUse marker (matcher AskUserQuestion),
  records-only/never-denies, writes `$cwd/.fkit/state/askuq-<session_id>`; unsafe/missing session or
  cwd → writes nothing (Stop then fails open).
- **EDIT `claude/fkit-claude.sh`** — second PreToolUse entry (AskUserQuestion → marker hook) alongside
  the Skill entry; `mkdir -p .fkit/state` at launch so marker-absence is trustworthy from turn 1.
- **REWORK `claude/turn-completion-hook.sh`** — check A now marker-based (read+consume; suppress on
  marker-present OR untrustworthy infra); transcript read kept ONLY for the ship-loop skip; **R2** guard
  fixed (null/empty/spaced → allow); **R3** interrogative now line-based (ending `?`, excl. fences +
  `>` quotes + heading).
- **Tests:** NEW `test/askuserquestion-marker-hook.test.js` (7); REWORKED
  `test/turn-completion-hook.test.js` (30, incl. the R1 regression); launcher-contract now asserts TWO
  PreToolUse entries + inline fallback; prove-red gains 0e baseline + mutations 4 (marker-suppress) & 5
  (marker tool-gate), each reds its named assertion.
- **Round-1 fixes recorded** in `review.md` Coder response (R1 fixed via path 2, R2 fixed, R3 tightened).

### Re-verification (post-rework)
- `node --test test/*.test.js` → **491 pass / 0 fail**.
- `bash test/prove-red.sh` → **hard gate PASSED**; mutations 1–5 each red their named assertions.
- Generated hooks JSON validates: PreToolUse = [Skill, AskUserQuestion], + Stop.

### Review round 2 — changes requested (model-diverse: reviewer + Codex 0.144.4), then dispositioned
R1/R2/R3 confirmed genuinely fixed. New: **R4 (medium, CORRECT)** marker fail-open gap — `marker_infra_ok`
trusted dir-exists, not writability, so unwritable-dir/cwd-change → false block (R1 class, narrowed).
**R5 (medium)** no headless-`-p` skip. **R6 (low)** ship-loop under-skip on unreadable transcript.
- **Owner dispositions:** R4 → **harden + fix comment**; R5 → **accept residual**; R6 → **accept residual
  + named follow-up**.
- **Applied:** R4 harden = `[ -w "$cwd/.fkit/state" ]` added to `marker_infra_ok` (unwritable ⇒ suppress
  check A / fail open); fixed the false comment in the marker hook; new root-guarded test `A/R4`.
  Whitespace-only message value now also fails open (low-note, obvious winner) + test.
- **Re-verified:** `node --test test/*.test.js` → **493 pass / 0 fail**; `bash test/prove-red.sh` → PASSED.
- Reviewer doing phase-2 (record accepted residuals + closeout) — in flight.

### Follow-ups flagged (not mine to do)
- **Ship-loop transcript-independent skip signal (R6):** give the ship-loop(s) a reliable skip signal
  (e.g. the loop writing its own state marker) so detection no longer depends on a readable transcript —
  producer to file; 0116 builds on the same seam.
- **ADR-030 addendum (architect / `fkit-record-decision`):** record that check A's "no AskUserQuestion
  this turn" is realized via a PreToolUse marker (Path 2), the marker lifetime (consume-on-read,
  stale→dormant), and the writability-gated fail-open confidence rule. Path 2 corrects a presupposition
  ADR-030 states, so until this lands the ADR text and the shipped code disagree.

---

## Close-out evidence packet

**Task:** `0127-build-adr-030-stop-hook` · **Owner:** fkit-coder · via `/fkit-task-ship-loop`.

**Outcome:** the ADR-030 `Stop` turn-completion hook is built (check B enforced; check A via a PreToolUse
`AskUserQuestion` marker — Path 2, owner+architect approved after the original transcript approach was
found to false-block). Model-diverse review closed out ✅ *Ready to merge (validation-gated)*.

**Problems encountered / how resolved:**
- The approved plan's check-A mechanism (transcript scan for "no AskUserQuestion this turn") was found
  in review (R1, reproduced) to **false-block turns that used the tool** — a Stop payload has no reliable
  no-tool signal. → Escalated to architect → owner ruled **Path 2** (PreToolUse marker).
- R2 (empty/null/blank message false-block) and R3 (check A too broad) fixed. R4 (marker fail-open gap on
  an unwritable state dir) hardened with a writability check.

**Lessons:** a Stop hook cannot infer prior tool use from its own payload or the (lagging) transcript;
the authoritative signal is a PreToolUse hook. Verify undocumented harness behaviour (PreToolUse fires
on AskUserQuestion) **before** committing to a design — it gated Path 2.

**Owner-decision log:** plan approved (rev 1) → R1 escalate-to-architect → **Path 2** + tighten R3 →
plan approved (rev 2) → R4 harden + R5 accept + R6 accept-with-follow-up. (No "obvious winner" made
silently while away that changed direction; the whitespace-only R2 low-note fix was the one obvious
winner, logged above.)

**Review ledger:** `review.md` · Verdict (R2 close-out): ✅ Ready to merge (validation-gated) ·
**Codex coverage: FULL** — both reviewer + Codex (0.144.4) ran in both rounds, no degradation.

**Verification evidence (from the run after the final code change):**
- `node --test test/*.test.js` → **493 pass / 0 fail**.
- `bash test/prove-red.sh` → **hard gate PASSED** (mutations 1–5 each red their named assertion).
- `bash -n` clean on both hook scripts; generated hooks JSON validates (2× PreToolUse + Stop).

**Brief `## Verification steps`, walked:**
1. `turn-completion-hook.sh` exists, Stop hook, presence checks A+B, no content judgement — **met**
   (check A mechanism is now a marker, still presence-only).
2. `build_settings()` emits `Stop` alongside `PreToolUse`; a launched session's settings carry them —
   **met** (now **two** PreToolUse entries [Skill, AskUserQuestion] + Stop; pinned by launcher-contract
   8/8b/10/11 and JSON-validated).
3. `node --test` asserts A fires/not, B fires/not, skips suppress, block-once, error paths fail open —
   **met** (marker suites 32 tests; full suite 493).
4. A spawned consult and a `/fkit-task-ship-loop` run are not blocked — **met** (consult: structural,
   Stop-only never SubagentStop; ship-loop: transcript command-marker skip). *Caveats: R5 top-level
   headless `-p` and R6 unreadable-transcript ship-loop turn are accepted bounded residuals.*
5. Task `0116` becomes actionable — **met** (`turn-completion-hook.sh` exists; the ship-loop skip is an
   extensible list — the exact seam 0116 extends).

**Files touched / change surface:**
- NEW `claude/turn-completion-hook.sh`, `claude/askuserquestion-marker-hook.sh`.
- EDIT `claude/fkit-claude.sh` (`build_settings`: 2nd PreToolUse entry + `.fkit/state` mkdir).
- NEW `test/askuserquestion-marker-hook.test.js`; EDIT `test/turn-completion-hook.test.js`,
  `test/launcher-contract.test.js`, `test/prove-red.sh`.
- Task artifacts: `plan.md`, `worklog.md`, `review.md` (this folder); `sprints/sprint-2.md` status row.

**Accepted residuals (owner-approved, in the ledger):** R4 exotic mid-session cwd-change corner · R5
headless `-p` no-skip · R6 ship-loop under-skip on unreadable transcript.

**⚠️ Hand-verified only (ADR-012 / ADR-021):** the LIVE session path — a real `AskUserQuestion` call
writing the marker, the Stop actually blocking/suppressing/consuming — **cannot be exercised by
automation** (AskUserQuestion is absent headlessly). Suites cover all script logic + real marker files
against synthetic payloads. **This has NOT been confirmed in a live `fkit` session.**

**Commit state:** nothing committed, nothing pushed — all edits (source, tests, plan/worklog/ledger,
sprint row) left in the working tree for the owner. `git status` shows the change surface above (plus the
unrelated `0128` folder from the producer).

**Not yet done (owner to route):** the ADR-030 addendum (architect) and the R6 follow-up brief
(producer). The close of `0127` is put to the owner (not self-closed) — see the session report.

---

## REOPENED (owner live-verify) — R7 over-skip defect, fixed & LIVE-VERIFIED

**Owner ran the live hand-verification (the step ADR-012 always left open) and it caught a real defect
that BOTH prior review rounds + the unit suite missed.**

- **R7 (CORRECT defect):** SKIP 3 matched the *bare* command string `/fkit-task-ship-loop` anywhere in
  the transcript (attachments, sprint plan, skill lists, discussion) → any session that merely *mentioned*
  a loop was skipped → `allow` before check B → **hook silently disabled**. Fail-open-safe but
  non-enforcing. Root cause: the suite only tested "marker present → skip", never "mention → must NOT
  skip". Diagnosed via a debug trace + a sweep of every on-disk transcript.
- **Fix:** SKIP 3 now matches the invocation marker `<command-name>/fkit-…ship-loop</command-name>`
  (mention-only sessions carry zero such markers). Added the missing **negative tests** (bare mention →
  block) for both loops + prove-red **mutation 6** (revert to bare string → regression test reds).
- **✅ LIVE-VERIFIED (first time for this component):** after the fix, in the owner's real session the
  Stop hook fired, blocked once with the check-B message, the model was forced to append "What's next?",
  and block-once held (`stop_hook_active`). The `{"decision":"block"}` route **is** honored by Claude Code.
- **Re-review (Round 3, model-diverse: reviewer + Codex 0.144.4):** ✅ Ready to merge. Found **R8** (low,
  fail-open-safe): the marker match still over-skips when the *complete* marker appears as transcript
  CONTENT (file read / tool_result / attachment) — common on this dogfooding repo, rare downstream.
  **Owner accepted R8** as a bounded residual + **added a known-limitation test** + **pulled task 0129
  forward** (the transcript-independent fix; Codex lead: `UserPromptExpansion` `command_name`).
- **Re-verified:** `node --test test/*.test.js` → **497 pass / 0 fail**; `bash test/prove-red.sh` →
  **hard gate PASSED** (mutations 1–6). Debug traces removed. Ledger closed-out (Round 3).
- **Close:** owner authorized re-close; since the owner live-verified check B, the honest marker is a
  judgment call at close time (see session report).
- **ADR-030 addendum (architect / `fkit-record-decision`):** record that check A's "no AskUserQuestion
  this turn" is realized via a PreToolUse marker (transcript unreliable), marker lifetime
  (consume-on-read, stale→dormant), and the fail-open confidence rule. Path 2 corrects a presupposition
  the ADR stated, so it needs recording — architect's job, not mine.
