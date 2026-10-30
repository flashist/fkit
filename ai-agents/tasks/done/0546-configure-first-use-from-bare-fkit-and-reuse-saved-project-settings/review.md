# Review — 0546-configure-first-use-from-bare-fkit-and-reuse-saved-project-settings

Task: ai-agents/tasks/done/0546-configure-first-use-from-bare-fkit-and-reuse-saved-project-settings/brief.md
File(s) under review: bin/fkit; codex/fkit.mjs; codex/settings.mjs; test/harness.mjs; test/launcher-contract.test.js; README.md; codex/README.md; CHANGELOG.md; ai-agents/knowledge-base/PROJECT.md; ai-agents/knowledge-base/architecture.md (current summary); ADR-061 additions; model-agnostic-sprint/{progress,HANDOFF,validation,local-acceptance}.md additions; task 0546 records; ai-agents/sprints/backlog.md task 0546 row.
Status: closed-out
Coverage: reasoning-only second opinion — round 1 primary ran two targeted public-process tests (1/1 each); fresh adversarial ran syntax and read-only Node recovery checks, but no behavioral tests.

## Reviewer findings

| # | Round | Sev | Location | Claim |
|---|-------|-----|----------|-------|

### Round 1 — 2026-10-30

Decision: ✅ Ready to merge — no open confirmed defects. Recommendation only; no commit, publication or task closure authorized by this verdict.

Primary and fresh adversarial passes both usable. Primary exact serving identity unavailable. Adversarial dispatcher reported runtime `codex`, model/requested `gpt-6.1-sol`, exit 0, no timeout or truncation; the pass itself could not establish its actual serving identity. Diversity unknown. A different model is recommended for a broader second opinion.

Primary execution:

- `node --test --test-name-pattern='bare first use: real terminal rejects' test/launcher-contract.test.js`: 1/1 passed, 1599.185417ms total; seven runtime inputs cover blank/invalid/cancel/EOF/SIGINT, no persistence/role and retry.
- `node --test --test-name-pattern='public dispatcher: legacy path does not invoke Node' test/launcher-contract.test.js`: 1/1 passed, 2608.139ms total; exercises fixture Node overwrite and checkout self-host dispatch.
- `node --version`: v24.13.0 before and after targeted tests. Read-only Python/tar comparison: host executable exactly equals cached v24.13.0 binary and is a regular file. `node-called` absent. `git diff --check` passed; ADR-061 diff +42/-0.

Adversarial execution: `sh -n bin/fkit`, individual `node --check` for codex/fkit.mjs, codex/settings.mjs, test/harness.mjs and test/launcher-contract.test.js, `node --version`, read-only Python byte comparison: all passed. No behavioral suite, edits, delegation, live CLI/account/model/auth/network call. Run prompt: `.fkit/tmp/consult-adversarial-reviewer-9546cc6d-5ca9-4d7b-99ee-ed299b7d6f27.md`.

[adversarial] Verbatim finding result:

> No significant issues found in task 0546’s bounded working-tree changes. Fixture Node wrapper is regular; restored host Node matches the cached v24.13.0 binary exactly; stray `node-called` marker is absent.

Verified against actual source: public chooser requires zero args and both terminal fds; marker is consumed before child launch; regular-file/containment checks precede settings reads; selected CLI version precedes persistence; configuration validation precedes one save confirmation; existing continuation and saved-setting bytes are retained. Test Node wrapper is a regular disposable file, not a symlink to the host executable. ADR correction preserves accepted lines and status; unrelated canonical roles/skills/hooks/installer/release tooling are outside the diff. Task approval, plan, plan-review, worklog and Backlog filing reviewed.

Coder evidence inspected, not re-executed here: focused 11/11 (23.879133792s); launcher 72/72 (59.621335792s), with later assertions covered by focused/default runs; npm 968 total/967 pass/0 fail/1 optional benchmark skip/40 suites (70.814633792s, below 120s); prove-red baselines 0b/0c green and M1/M2/M30/M31 red at named assertions, exit 0. Mutation process stopwatch uninstrumented; 260.953380s is a log span only. Supplemental unavailable-catalog exact-model public PTY check is coder-reported. Slow suites not repeated without a new concern.

History retained: BSD script/Node pipes failed before application entry; macOS now uses installed Python stdlib PTY and Linux retains util-linux script. Initial fixture Node symlink caused host executable overwrite; coder restored exact cached version, then used a fresh inode after macOS exit137. Failed runs are not green evidence. Current isolation and recovered bytes independently verified by both passes; no residual accepted for this incident.

Suggestions (not defects): none. Written key list found in CONTRIBUTING.md; missing tests outside it remain suggestions.

Re-litigates settled decisions (suppressed): none. ADR-061's approved bare-entry change and accepted local limits, including ADR-042 D2/task 0273, were not reopened.

Convergence: no novel defects or tradeoff dispositions. Recommend coder-owned clean disposition/ledger closeout through the standing ship-loop, then producer-only closure and cross-check. No new owner gate. Live Claude/mixed/API/account usability, complete native model workflows and Linux terminal execution remain unverified; hooks stay disabled. Release lane skipped because tooling unchanged; no new permanent test file/mutant or live certification.

Owner questions: none.

## Coder response

| # | Verdict | Defect / Frontier | Action | Status |
|---|---------|-------------------|--------|--------|

Round 1 clean disposition under the owner-approved task ship-loop: no finding rows to verify or fix; no code changed, no residual accepted, no suppressed finding. Read back both passes and checked the stated scope against source and final green evidence. Reviewer findings and Coverage unchanged. Convergence: closeout; producer handoff permitted after final evidence packet. Unattended review fixes / obvious-winner calls: none.

## Accepted residuals (shared, do-not-re-litigate)
