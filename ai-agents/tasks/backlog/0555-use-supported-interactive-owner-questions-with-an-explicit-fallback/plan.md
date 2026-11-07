

- **0555 — Use supported interactive owner questions with an explicit fallback:** product change; complete proposed plan remains **unapproved for implementation**.
- R0 architect/producer approved the frozen draft. This revision incorporates only the owner-accepted X1 correction; **not re-reviewed**. Planning restraint is instruction-enforced; no Codex plan-mode transition is claimed.

1. **Preserve the baseline and recorded authority.**

   Preserve frozen 0554 — Make the lead advance authorized work after worker completion evidence, before/after images and failed results. Existing live source deltas form the implementation baseline; after full-plan approval, apply only approved 0555 edits to those paths. Do not require shared source bytes to remain identical while changing them.

   The architect has already recorded the Codex-specific exception in `ai-agents/knowledge-base/decisions/adr-060-plan-review-on-by-default-in-coder-sessions-by-a-launcher-session-line-with-no-plan-review-opt-outs-provisional.md`. This satisfies the recording prerequisite only; source implementation remains pending. No further ADR edit is planned.

2. **Select the supported owner interface.**

   | Session/path | Action |
   |---|---|
   | Eligible Codex interactive root, exposed tool, negotiated form support | Use `fkit_roles.fkit_ask_owner`; await actual response |
   | Supported Claude interactive root | Use native `AskUserQuestion` |
   | Missing interface, unsupported client or failed delivery | State limitation; explicit fallback and waiting |
   | Headless/delegated worker or adversarial leaf | Return `NEEDS-DECISION`; never open owner forms |

   In `codex/server.mjs`, require eligibility **and** negotiated form support for advertisement; retain invocation guards against direct bypass. In `codex/owner-question.mjs`, validate declarations: preserve valid explicit-form and legacy empty-object capabilities; reject malformed and URL-only declarations. Capability proves request support, not automatic display.

   Preserve interfaces, arguments, `codex/fkit.mjs` mode/lineage/run identity and `codex/claude.mjs` native-owner selection. Add no capability API or host configuration.

3. **Separate delivery, answers and approval.**

   Distinguish capability, exposure, eligibility, request issuance/acceptance, queueing, observed presentation, actual answer and applicable approval. Add no invented presentation acknowledgment. Invocation markers, `{"accepted":true}`, queued notifications and unanswered displayed forms grant nothing. Unknown delivery remains unverified and the decision pending; do not repeatedly resubmit asynchronous requests.

   Fallback: “This session exposes no usable automatic owner dialogue. Decision: [exact scope]. Choices: [named alternatives and recommendation; standing explanation option]. Dependent work remains stopped until your answer.” Report uncertain delivery as uncertainty. Preserve `Explain more, then ask again` with description `Give me more context in simple terms, then re-ask the question.` Accept an applicable explicit prose answer without reopening for confirmation.

   Preserve ordinary selection without text, separate custom-text form, exact returned text, cancellation, decline, interruption, invalid/empty results, no default auto-submission and no same-turn re-ask after explanation requests. Bind approval to the unchanged decision/plan, quoted answer, date and actual channel. Interface approval never approves implementation.

4. **Implement accepted X1 without changing other triggers.**

   Add two canonical skills to the original scope:

   - `claude/skills/fkit-plan-task/SKILL.md`: qualify Workflow 0 and trigger (b). A **direct interactive Codex coder’s actual launcher ON line** enables review independently of owner-tool availability. Missing usable dialogue changes only the approval channel to fallback and waiting.
   - `claude/skills/fkit-task-ship-loop/SKILL.md`: qualify its inherited launcher-and-tool condition identically.

   Preserve regular Claude’s launcher-line **and native-tool** check. Preserve missing-line OFF, opt-outs, OFF precedence, ineffective quoted/file signals, spawned-driver switches, worker eligibility and session-only loop boundaries.

   In already-scoped `codex/materialize.mjs`, replace the existing tool-presence mapping with this explicit Codex distinction. Align already-scoped `codex/README.md`. No worker gains owner asking or the direct-session switch.

5. **Deliver canonical instructions and runtime counterparts.**

   Update these original surfaces:

   - `claude/scaffold/ai-agents/knowledge-base/conventions/asking-the-owner.md` and byte-identical `ai-agents/knowledge-base/conventions/asking-the-owner.md`: supported selection, delivery distinctions and fallback.
   - `claude/scaffold/universal-rules.md`: concise supported-interface/fallback pointer within the existing rules budget.
   - `claude/agents/fkit-lead.md` and `claude/skills/fkit-sprint-ship-loop/SKILL.md`: root selection and waiting at actual gates.
   - `claude/skills/fkit-open-questions-interview/SKILL.md`: only actual applicable answers settle decisions; preserve explanation semantics.
   - `codex/materialize.mjs`: startup text and both runtime bindings; replace unconditional presentation promises with request-and-observe wording.
   - `codex/README.md` and `CHANGELOG.md` Unreleased: combinations, fallback, bounded historical evidence and unmet live acceptance.

   Refresh only managed root `CLAUDE.md`/`AGENTS.md` blocks through `bash claude/fkit-claude-init.sh .`, preserving owner text. Regenerate `claude/structure-manifest.tsv`.

   Verify normal disposable initializer/materializer delivery into `.claude/agents/`, `.claude/skills/`, `.agents/skills/` and configured instructions; never hand-edit generated copies. Preserve additive consuming-project conventions; no heal, migration or global install.

6. **Extend existing coverage and inspect boundaries.**

   Extend only **“lead owner channel: synthetic decisions wait and preserve cancel, decline and explanation without launching workers”** in `test/launcher-contract.test.js`, using the real dispatcher subprocess.

   Cover eligible roots; headless/delegated/adversarial denial; supported/legacy/absent/malformed/URL-only capabilities; advertisement/direct-call guards; delivery errors, unanswered and acceptance-only responses; ordinary/custom answers; cancellation, decline, interruption, invalid/empty answers and late replies. Assert no worker launch before applicable caller action; preserve fixture settings bytes and existing single-field consent coverage.

   **New permanent test files: 0. New top-level cases: 0. New prove-red cases: 0.** Retain the existing four prove-red cases. Add no wording, mirror-certification or model-obedience tests.

   Statically inspect canonical and normally delivered instructions for ON/tool-present, ON/tool-absent, missing-line, opt-out, conflicting-lines and worker-driver branches. These checks establish instruction boundaries, not model compliance or live presentation.

7. **Run the approved checks after full-plan approval.**

   ```sh
   npm run generate:manifest
   node --test test/launcher-contract.test.js
   node --test --test-skip-pattern='^0284/(git-deadline|term-ignored|no-stray|reinstall-deadline|reinstall-timeout-not-run):|^fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$|^benchmark:' test/*.test.js test/board/*.test.js
   npm run test:prove-red
   git diff --check -- codex/server.mjs codex/owner-question.mjs codex/materialize.mjs codex/README.md claude/agents/fkit-lead.md claude/skills/fkit-sprint-ship-loop/SKILL.md claude/skills/fkit-open-questions-interview/SKILL.md claude/skills/fkit-plan-task/SKILL.md claude/skills/fkit-task-ship-loop/SKILL.md claude/scaffold/universal-rules.md claude/scaffold/ai-agents/knowledge-base/conventions/asking-the-owner.md ai-agents/knowledge-base/conventions/asking-the-owner.md claude/structure-manifest.tsv CLAUDE.md AGENTS.md CHANGELOG.md test/launcher-contract.test.js ai-agents/knowledge-base/decisions/adr-060-plan-review-on-by-default-in-coder-sessions-by-a-launcher-session-line-with-no-plan-review-opt-outs-provisional.md
   ```

   This retains standalone launcher checks, the **filtered functional suite**, and existing prove-red scope; it is not default `npm test`. Seven exclusions remain: three banner cases, two reinstall cases, mixed stale-break cleanup/lock recovery, and optional benchmark snapshot/access checks. Skip release tests because release tooling is unchanged. These are disclosed omissions, not deferred test work. Report every failure/unavailable check; add no timing investigation or gate.

8. **Retain the live acceptance boundary.**

   Only root-owned actual observation can establish automatically opened selectable choices **before owner interaction**, then ordinary submission and cancellation. Compare missing, queued and uncertain delivery truthfully. Fixtures cannot establish this; only the actual owner supplies applicable approval.

   **Automatic live-display acceptance remains unmet.** Fallback alone cannot pass it or permit quiet closure absent an actual owner acceptance change. No waiver is present. Claude/mixed live compatibility remains unverified.

   Keep 0556 — Give each independent owner decision its own selectable options assembly separate. No dependency, placement, rank, lifecycle, retry-budget, saved settings, hook, wiki, index, install, commit or push changes. No probes, process watching, configuration repair, activation shortcuts or agent-selected approval.

