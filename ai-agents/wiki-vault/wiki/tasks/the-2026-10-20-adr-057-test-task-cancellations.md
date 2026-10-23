# The 2026-10-20 ADR-057 test-task cancellations — eight open test tasks dropped, one decision task closed on its finding

**Source**: `ai-agents/tasks/cancelled/0037-extend-prove-red-to-reach-init/brief.md`, `ai-agents/tasks/cancelled/0152-guard-test-for-skill-md-h1-house-style/brief.md`, `ai-agents/tasks/cancelled/0214-wire-the-repaired-0210-guards-as-prove-red-mutations/brief.md`, `ai-agents/tasks/cancelled/0215-repair-the-prove-red-work-dir-package-json-landmine/brief.md`, `ai-agents/tasks/cancelled/0219-assert-the-400-b-free-budget-target-in-a-test/brief.md`, `ai-agents/tasks/cancelled/0406-build-the-no-board-row-check-in-the-test-suite-with-a-dated-two-task-allowlist/brief.md`, `ai-agents/tasks/cancelled/0503-re-measure-the-full-test-run-time-locally-and-on-ci-and-show-both-in-contributing/brief.md`, `ai-agents/tasks/cancelled/0522-stop-the-four-movers-telling-a-consuming-project-to-run-fkits-own-link-test/brief.md` (plus `0296`, closed done the same day)
**Status**: cancelled — each `⛔ Cancelled (agent-closed — not owner-verified) (2026-10-20)`
**Sprint/Tag**: Backlog board (seven) · Sprint 12 (`0503`) · executed 2026-10-20 by a spawned producer on owner rulings relayed by `fkit-lead`

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`). One page, because all eight have one cause — [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] — and were ruled at one gate (`0529`'s plan, per Sprint 13 ruling S4: *"After the ADR is signed"*).

## Goal
Apply ADR-057's knock-on: open tasks whose deliverable is a test or prove-red mutation the new fence forbids, or whose target code `0529` deleted, are cancelled through the normal mover with the agent-closed marker.

## Key Changes
| Task | What it was | Reason on the record |
|---|---|---|
| `0037` | Extend `prove-red.sh` to reach `fkit-claude-init.sh` | prove-red cut to four launcher/hook cases (§D3); no new mutation lane for init |
| `0152` | Guard test for the `SKILL.md` H1 house style | a test on `SKILL.md` wording is category 4 (§D1) |
| `0214` | Wire `0210`'s repaired R3/R4 guards as prove-red mutations | prove-red cut to four cases; no new mutations |
| `0215` | Repair prove-red's work-dir `package.json` landmine | its target machinery (`make_repo_copy()`, step `0i`, the node-based mutations) is gone. ⚠️ Residual: the empty `package.json` marker lines in `test/prove-red.sh` remain |
| `0219` | Assert the ≥ 400 B free rules-block budget target in a test | a new test on a prose target is category 4 and needs the owner's OK; `rules-block-budget` keeps only init's `RULES_MAX` guard |
| `0406` | Build the no-board-row check with a dated `0014`/`0004` allowlist | a repo-content check is outside §D1 with no §D7 exception |
| `0503` | Re-measure the full test run time, show both in CONTRIBUTING | superseded: `0530` re-measures after `0529`'s cut |
| `0522` | Stop the movers telling a consuming project to run fkit's own link test | superseded by §D6 (a): `0529` removed the instruction |

**Authority.** Six cite owner **Q4** at `0529`'s plan gate, 2026-10-20, verbatim *"Producer's proposals (Recommended)"*; `0215` cites owner ruling 4, *"Cancel (Recommended)"*; `0406` cites owner ruling 3, *"Cancel; close 0296 as accepted (Recommended)"*. All via `AskUserQuestion` in the live `fkit lead` session.

## Outcome
- **`0296` closed done, not cancelled** — on its 2026-09-18 finding (*two failure modes, the live one has stopped*), now **accepted with no mechanism**; its own gate (*"stay open until `0406` lands green"*) **re-ruled, not satisfied**. See [[tasks/decide-what-catches-a-task-brief-that-has-no-board-row]].
- **Accepted costs now on the record:** nothing catches a brief filed with no board row; prove-red cannot reach init (the init guards' red-first proofs stay manual); `SKILL.md` content stays largely untested; the ≥ 400 B headroom target stays a prose rule.
- **Not cancelled, by the record:** the test-comment cleanup units `0512`–`0515` stay open on the Backlog board.

## Related
- [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] — the cause
- [[tasks/the-test-scope-reset-tasks-0526-0530]] — `0529`'s plan gate, where they were ruled
- [[tasks/decide-what-catches-a-task-brief-that-has-no-board-row]] — `0296`, closed on its finding the same day
- [[tasks/fix-sprint-ship-loop-skill-owner-banner-format]] — `0120`, whose follow-up was `0152`
- [[tasks/specify-and-support-the-reverse-move-sprint-to-backlog]] — `0210`, whose two follow-ups were `0214` / `0215`
- [[tasks/repair-0177s-stale-cap-and-byte-figures]] — `0218`, which set out the ≥ 400 B headroom target (an owner ruling from `0130`) that `0219` would have tested
- [[tasks/gate-symlink-escape-in-init-intake-write]] — `0046`, whose manual red-first proof `0037` would have mechanized
- [[tasks/sprint-12-set-a-nine-backlog-tasks-goal-not-set]] — the board `0503` was cancelled from
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board the other seven left
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`, closing one-way links):* [[systems/testing-and-verification]] · [[tasks/sprint-13-reset-fkits-tests-to-shipped-script-behaviour]]
