# Native OpenCode port — manual verification, 2026-11-11

The owner approved `test/opencode.test.js` and verification for this port, explicitly retaining
manual execution. No CI trigger, schedule, launch/setup hook or release test default was enabled.

The first-run provider interview was added after the checks below. Its new cases in the existing
`test/opencode.test.js` have **not run** under the owner's test pause. JavaScript/shell syntax and
diff-whitespace checks passed. Read-only inspection confirmed Codex `config/read` exposes model
and effort, and OpenCode's model catalog accepts `location[directory]` for project scoping. No
provider-authentication flow or model turn was run for this addition. The earlier pass counts below
describe the published `0.3.3-opencode.1` port, not this new interview.

## Checks

| Check | Result |
|---|---|
| `npm run test:opencode` | 7 passed, 0 failed |
| Final `npm test` | 958 tests: 957 passed, 1 skipped, 0 failed; 84.7 seconds |
| `npm run test:prove-red` | Passed: unmutated copies green; all four named mutations red |
| JavaScript/shell syntax and `git diff --check` | Passed |
| Native discovery on OpenCode v2.2.6 | Seven profiles, 28 FKit skills and 28 FKit commands |

The skipped test is the opt-in board performance benchmark (`FKIT_BOARD_BENCH=1`), not an OpenCode
contract. The focused suite covers project/JSONC preservation, symlink refusal, launcher option and
configuration handling, exact/fresh scaffold repair, model-evidence validation, and an installed
runtime initializing a consuming project without creating `.claude/` or requiring the Claude CLI.
The installer test supplies a local source archive and performs no download.

The first full-suite attempt encountered sandbox socket/process restrictions and Finder metadata
in the parity corpus. The corpus walker now excludes `.DS_Store` because it is OS metadata, not a
FKit-authored document. The final full suite ran with local socket/process access and passed.

## Live native behavior

Isolated fixtures exercised actual OpenCode sessions using the installed v2.2.6 CLI and available
free provider models. The native API, not model summaries alone, confirmed this completed chain:

| Role | Native session | Parent |
|---|---|---|
| lead | `ses_e36338823ffeCvsVjrOmErsfe0` | root |
| coder | `ses_e36334556ffeN4cUdnJQnqRZfH` | lead |
| reviewer | `ses_e36332929ffe2IaApSioBL0I1Q` | coder |
| hostile reviewer | `ses_e3632df00ffeI4pPMbll9ncsnF` | reviewer |

All three child records reported `succeeded`; the root CLI exited 0 with no error events. Native
records confirmed a completed `skill` call for `fkit-review` and the bundled evidence helper call.
The helper returned `distinct-runtime-models` for `opencode/big-pickle` and
`opencode/glm-5.3-flash-free`. The two review contexts found the deliberately incorrect arithmetic.

A same-role `/fkit-team` command stayed in its lead session, loaded its own skill and created no
child. The native question tool produced a real form; the verification harness answered the
explicitly test-only choice `Continue fixture`, which the lead relayed verbatim without granting
implementation authority. A subsequent attempted `fkit-review` load in that lead session returned
an actual `permission.rejected` error. No bypass or review was performed.

Project artifact modification checks found no writes to the fixture's `ai-agents/` or `.opencode/`
trees during the read-only runs; `sample.js` was unchanged. The verification root sessions were
archived after completion.

## Observed limits

- The first headless run produced usable native reviews and model evidence but exited 1 because it
  could not answer an optional Web Search activation prompt. The bounded fixture then disabled
  Web Search; production OpenCode settings were not changed.
- A later run hit the hostile model's free-usage limit. The reviewer exhausted its bounded retries,
  emitted `[NOT model-diverse — INCOMPLETE]` with a partial verdict, and did not authorize closure.
  A different available hostile model completed the final depth-three run.
- Runtime model IDs are not proof that custom/anonymous provider aliases use different upstream
  models. Choose known, distinct models for genuine model diversity; unavailable evidence remains
  a partial review. The helper separately verifies session parentage and reports only identity
  metadata, not message contents.
- These fixtures verify runtime wiring, permissions, evidence and decision transport. They do not
  certify consistent model judgment, review severity or summary fidelity. No live production
  implementation, ledger update or task closure was authorized or performed.

All verification commands were manual. Automatic test execution remains paused.

## Preview release channel

The owner selected `0.3.3-opencode.1` on `fkit-open-code`. The manual prerelease dry run with `--test`
passed the full suite (957 passed, one opt-in benchmark skipped) and all 35 release-tool checks.
The added checks cover preview counter increments, explicit versions, dry-run preservation,
refusal on stable branches, and push isolation even with global `push.followTags=true`.
GitHub prereleases are published with latest disabled. Stable installation and update refs stay
on main; preview users opt into fkit-open-code. This adds no automatic test execution.
