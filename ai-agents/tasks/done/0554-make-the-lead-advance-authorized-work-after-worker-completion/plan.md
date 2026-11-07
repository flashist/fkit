

- **DRAFT — 0554 — Make the lead advance authorized work after worker completion.**
- **Product change:** changes delivered conductor and transport behavior. Architect/producer re-review, independent adversarial pass and coder finding check remain pending.
- Planning-only, instruction-enforced. Full-plan owner approval must precede Build.

1. **Fix the concrete source gaps.**

   `claude/agents/fkit-lead.md` already requires advancement. However, `claude/skills/fkit-sprint-ship-loop/SKILL.md` says the driver ends its turn “between relays” without clearly limiting that pause to an outstanding owner answer. Worker returns also lack a consistent completion checklist.

   Separately, `codex/server.mjs` treats exit-zero Codex workers with empty output as successful; the existing transport case expects this. These are confirmed source gaps, not proof of the reported session’s cause. Architect R0 found no ADR amendment prerequisite.

2. **Make completion consumption explicit.**

   Update the conductor section in `claude/agents/fkit-lead.md` and the worker templates, relay/idle wording, advance step and progress reporting in `claude/skills/fkit-sprint-ship-loop/SKILL.md`.

   After every bounded return, inspect the result and required artifacts, reconcile completed and outstanding work, then perform the next authorized action in the live turn. Progress messages and “What’s next?” footers create no approval gate.

   Templates request completed work, outstanding work, artifact paths, checks/results and decisions. Preserve `DONE`, `BLOCKED` and `NEEDS-DECISION` envelopes and carry prescribed reviewer/producer reports whole.

3. **Preserve recovery, status and allowance rules.**

   Verified completion advances to the next authorized unit. Producer closure must pass §4’s complete report/artifact cross-check before counting the task shipped or selecting newly eligible work.

   Empty, failed or partial returns require inspection of **every path named in the spawn**, wherever located. Exit status, a completion label or file existence alone proves nothing. If every required outcome landed and is verified, continue without duplicating the launch; missing verification remains outstanding.

   Nothing landed: retain the paired Backlog reset and run skip-set branch, surface the unresolved retry decision, and continue independent eligible work where allowed. Self-contained partial work retains paired Blocked status; torn work stays In progress and pauses for the owner.

   Preserve three no-progress verification cycles and existing review rules. The single producer retry applies **only when the folder never moved**, within surviving owner allowances. A moved folder with stale closure artifacts remains owner-only: preserve landed Done markers and existing stale-location Blocked handling.

   Carry explicit task/session allowances and spend between workers. Exhaustion permits no further launch; add no general retry allowance.

4. **Keep actual owner gates and independent scope.**

   Preserve plan/scope approval, unresolved judgments, torn state, degraded closure, cancellation and user stops. Rejected plans return to paired Backlog status and the run skip set; eligible independent work may continue.

   Missing owner-form capability retains explicit-question-and-wait fallback. Explanation requests, cancellation and silence grant no approval. Preserve exact approved-plan carry, fresh typed roles, independent reviews, producer-only movers and agent-closed markers.

   Keep **0555 — Use supported interactive owner questions with an explicit fallback** and **0556 — Give each independent owner decision its own selectable options** separate. Coordinate shared-file edits without absorbing their behavior or replacing other deltas.

5. **Checkpoint honestly at host limits.**

   Before a foreseeable pause, record board/goal, task ID plus canonical title, stage, approval provenance, artifact paths, outstanding decisions, allowances/spend, skip set, statuses and next authorized action.

   Use existing task evidence and driver reports at:

   `ai-agents/knowledge-base/reports/<YYYY-MM-DD>-lead-continuation-checkpoint-<run-id>.md`

   Each report captures one moment; later checkpoints use another filename. Preserve worklog/review section ownership. Checkpoints supply evidence, never renewed approval or a runtime cursor.

   Same-run restoration preserves spend and skip state. Later invocations retain existing orphaned-plan reapproval rules and surviving owner limits. If the host cannot resume, report **paused** and identify the actual action: an owner message in the existing session or an owner-started session supplied with the checkpoint. Abrupt loss may prevent saving; disclose missing state rather than reconstructing approval.

6. **Fix transport and deliver the contract.**

   In `codex/server.mjs`, classify empty/whitespace-only worker payloads as errors and provide the missing-response message. Preserve existing exit/runtime/model/error metadata.

   **Verbatim preservation applies after adapter processing:** retain nonblank post-adapter payloads, including available partial failure output, within existing output bounds. Preserve `codex/claude.mjs`’s blank-decoded-result rejection and sanitized failure reporting; promise no raw Claude failure forwarding. Add no prose-envelope parser or automatic relaunch.

   Update both runtime branches in `codex/materialize.mjs`: helpers return results to an awaiting live turn; they cannot start a later turn. Shell fallback callers inspect exit status and returned text themselves.

   Verify normal delivery of `.claude/agents/fkit-lead.md`, `.claude/skills/fkit-sprint-ship-loop/SKILL.md`, configured role instructions and `.agents/skills/fkit-sprint-ship-loop/SKILL.md` through disposable fixtures. Update `codex/README.md` and `CHANGELOG.md`. Preserve other deltas and native user configuration. No generated-copy hand edits, manifest, scheduler, hook enablement, settings changes, installation, self-restart/clear, commit or push.

7. **Verify within the owner’s deferral.**

   Extend only the existing `test/launcher-contract.test.js` case **“lead worker transport: exact data, full reports, errors, saved peer settings and topology”**: empty/whitespace successful exits become errors; nonblank and partial failure payloads remain intact; sequential requests produce no unsolicited launch.

   **New top-level cases: exactly 0. New permanent test files: 0. New prove-red cases: 0.** Return any genuinely unavoidable expansion to the owner.

   Run:

   ```sh
   node --test test/launcher-contract.test.js
   node --test --test-skip-pattern='^0284/(git-deadline|term-ignored|no-stray|reinstall-deadline|reinstall-timeout-not-run):|^fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$|^benchmark:' test/*.test.js test/board/*.test.js
   npm run test:prove-red
   git diff --check -- claude/agents/fkit-lead.md claude/skills/fkit-sprint-ship-loop/SKILL.md codex/server.mjs codex/materialize.mjs codex/README.md CHANGELOG.md test/launcher-contract.test.js
   ```

   This retains default globs, functional `0284/git-env`, launcher/owner-channel/delivery coverage and all four existing prove-red cases. **Coverage is filtered:** omitted groups are three banner cases, including stalled-check termination/escalation and watchdog cleanup; two reinstall cases, including download-failure/partial-script protection; the mixed board case’s stale-break cleanup/lock recovery; and the optional benchmark’s snapshot equivalence/access-count checks. Do not execute excluded cases to validate the filter. No deferred investigations, measurements or gates.

   The named transport case is Codex-specific. Existing **“configured delegation: fresh peers use their runtime, model and effort and report observed identity separately”** covers successful Claude decoding and observed-model metadata; Claude blank/failure variants remain unexecuted unless existing coverage actually exercises them.

   Record actual return→next-step and verified-close→next-task actions during authorized work separately from walkthroughs. Unexercised approval, partial-return, exhausted-cap, parking and unavailable-host scenarios stay unverified. Fixtures establish transport/delivery, not model obedience or host resumption.

