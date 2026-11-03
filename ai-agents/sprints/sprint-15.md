# Sprint 15 — Launcher defaults, update checks and test reliability

> ## 🔲 Backlog — 2026-10-30.
>
> **Scheduling only.** No sprint or task start is approved by this board's creation.
>
> **Authority — owner ruling, 2026-10-30, interactive `fkit_roles.fkit_ask_owner` form, relayed by `fkit-lead`.** Selected option and approved scheduling decision, verbatim:
> *"Adopt hardening plan (Recommended) — Create Sprint 15 as Backlog with 0540, 0537, 0520 in that order. Start no work; no other open tasks gain a wait on Sprint 15."*
>
> Recorded by a spawned `fkit-producer` with no owner channel. This records the owner's scheduling decision; it is not producer precedent for re-ranking.

## 🎯 The goal

**Use native runtime model/effort defaults, make launcher update checks silent and bounded, and make their tests reliable without leaking temporary folders.**

**Success:** 0540 proves cleanup on passing and failing runs without removing old folders; 0537 records its diagnosis and, if the cause is in the test, proves reliability under load without weakening the deadline contract; 0520 proves the update check never prompts over SSH while retaining the watchdog. Each task keeps its brief's verification requirements and approval gates. A launcher defect found by 0537 requires a separate owner-approved task before a fix is scoped or folded into this sprint.

**Additional success, owner request 2026-10-30:** 0548 retains the initial Claude/Codex choice, removes fkit model/effort selection, and makes direct/delegated roles follow native runtime defaults. Existing fkit model/effort fields become inert without resetting user configuration; saved runtime routing remains functional. Intended for the next release; live configured Claude/mixed compatibility remains unverified.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔲 Backlog | P1 | **Stop the test suite leaving `fkit-proj-*` temp folders behind** *(Owner-approved order, 2026-10-30. Depends on nothing; blocks nothing. No automatic deletion of old folders. Owner `fkit-coder`)* | [`0540-stop-the-test-suite-leaving-fkit-proj-temp-folders-behind`](../tasks/backlog/0540-stop-the-test-suite-leaving-fkit-proj-temp-folders-behind/brief.md) |
| 🔲 Backlog | P2 | **Make the launcher update-check stall test reliable when `npm test` runs on a loaded machine** *(Owner-approved order, 2026-10-30. Diagnose first; stop for separate owner approval if it is a launcher defect. Depends on nothing; blocks nothing. Owner `fkit-coder`)* | [`0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine`](../tasks/backlog/0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine/brief.md) |
| 🔲 Backlog | P3 | **Stop the update check's `git ls-remote` from prompting over ssh when git rewrites GitHub URLs** *(Owner-approved order, 2026-10-30. Depends on 0284, recorded `✅ Done (agent-closed — not owner-verified)` in Sprint 12. Custom-SSH trade-off goes to the owner at the plan gate. Blocks nothing. Owner `fkit-coder`)* | [`0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh`](../tasks/backlog/0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh/brief.md) |
| 🔲 Backlog | P4 | **Use native runtime model and effort defaults and retire fkit selectors** *(Owner-requested Sprint 15 addition for next release, 2026-10-30. Ignore legacy model/effort fields; preserve runtime routing and user preferences. Depends on nothing; blocks nothing. Owner-confirmed P4 after 0520, 2026-10-30. Owner `fkit-coder`)* | [`0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors`](../tasks/backlog/0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors/brief.md) |

## ⚠️ Notes for the driver

- **Start approval is still required.** The original ruling schedules three tasks; the dated addition below schedules 0548 as well. All four remain `🔲 Backlog`; start no work from these scheduling approvals.
- **Order only:** 0540 → 0537 → 0520. No new `Depends on:` links. The only existing hard dependency is 0520 → [0284](../tasks/done/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md), already agent-closed Done. No open task names any of these three as a dependency (checked 2026-10-30); no other open task gains a wait on Sprint 15.
- **0537 is investigation-first.** Preserve its stop-and-report gate for a launcher defect. A shipped-code fix needs separate owner approval; the test-only reliability task does not authorize it. Removing the real sleep from the existing timing tests is outside this scope.
- **0520's plan gate remains.** State which custom `core.sshCommand` / `GIT_SSH_COMMAND`, proxy, key or wrapper setups would change, and obtain the owner's ruling. Scheduling does not decide that trade-off.
- **ADR-057 remains binding:** [D2.1, D8 and D10](../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md). No new test file or prove-red case without the owner's individual approval, in any lane. Use existing test files; the old 0520 phrase “or a sibling” is not approval for a new file. New timing tests must not sleep for real. Default `npm test` stays within 2 minutes on an idle Mac, CI-enforced; 0537 must not make it slower.
- **0540 preserves existing folders.** Only folders owned by a test run are cleaned up; do not sweep old shared-temp folders.
- **Shared test file:** 0537 and 0520 both touch `test/update-banner.test.js`; the second task incorporates the first task's changes. This is an ordering consideration, not a new hard dependency.
- **Separate board-startup UX request:** still being clarified and diagnosed independently. It is outside this approved three-task scope; no task or priority is inferred here.

## Notes

- Created 2026-10-30 after checking that Sprint 15 was unused and no sprint was active. This board remains `🔲 Backlog`.
- Existing briefs retained in `tasks/backlog/`; only board membership and priorities are changed. Backlog rows retain moved pointers with destination priorities. Historical brief placement notes are superseded by their dated placement updates.
- No implementation, source or wiki writes, commit, push, starts, or terminal closures are authorized by this scheduling record.

## Addendum — task 0548 added out of band (2026-10-30)

- **Authority:** owner user-chat request, 2026-10-30, relayed by `fkit-lead`: keep the initial Claude/Codex choice, remove fkit project/per-agent model and effort selection, use native user defaults, and make existing fkit overrides ineffective. The owner explicitly requested the just-planned Sprint 15 and next release. Full verbatim request is in 0548's Context. Placement needs no repeated approval; this grants no start or release authority.
- **Scope:** one behavioral task, confirmed by a fresh read-only architect consult. UI-only removal would leave old settings active; engine-only removal would leave ineffective controls. Prefer ignoring legacy model/effort data over destructive reset. Preserve runtime choices and unrelated user preferences. The current ADR-061/0546 settings contract needs an owning architect's dated amendment during normal planning; historical records remain intact here.
- **Owner-confirmed priority — 2026-10-30, `fkit_roles.fkit_ask_owner`, interactive root session, relayed verbatim by `fkit-lead`:**
  > Keep P4 after 0520 (Recommended) — Preserve the approved three-task order, then simplify runtime settings. No dependency links or waits on other sprints change.
  This confirms the existing P4 placement; no re-ranking or producer precedent for re-ranking.
- **On merit this belongs directly below 0520**, because it is the next-release settings change after the already-approved launcher hardening order. Existing ranks are unchanged; this is not producer precedent for re-ranking.
- **Dependencies/knock-on:** 0548 depends on nothing and blocks nothing. No existing dependency is re-pointed, and no other open task gains a wait on Sprint 15. Shared launcher/tests may require sequencing; this adds no hard dependency.
- **Concurrent work boundary:** the separate board-startup coder owns `bin/fkit-board.mjs`, `docs/board.md`, `README.md` and `CHANGELOG.md` now. This filing touches none of them; later settings documentation/release-note edits must incorporate its completed delta. Board implementation remains outside 0548.
- **State and limits:** Sprint 15 stays `🔲 Backlog`, with no active sprint found at filing. No implementation, native-config edits, wiki writes, commits/pushes, starts or terminal moves. Live configured Claude/mixed compatibility remains unverified; 0548 defines contract checks and deferred native checks explicitly.
