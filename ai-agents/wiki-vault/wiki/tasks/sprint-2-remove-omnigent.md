# Sprint 2 — Remove Omnigent, land Claude-native as the only runtime

**Source**: `ai-agents/sprints/sprint-2.md`
**Status**: in-progress
**Sprint/Tag**: Sprint 2

## Goal
Execute the removal of the Omnigent runtime **end to end**: extract what the Claude flavor still depends on, build the one piece genuinely missing, rewrite the installer, delete `omnigent/`, and only *then* rewrite the docs and the wiki against the reality that's left.

Authorized by [[decisions/adr-009-claude-code-native-is-the-only-runtime]] and [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]].

**The sprint has grown far past its original scope — from 22 tasks to 73.** The removal itself finished early; **everything after task 22 is work the removal *uncovered*** — investigations that mostly concluded "build nothing", the defects they found on the way, and a set of skill-quality and coder-autonomy improvements the owner scoped as the runtime settled.

## Key Changes

### The one thing that must not be got wrong
**`omnigent/` was load-bearing.** The Claude flavor read its scaffold at runtime, the installer copied it, and `fkit update` routed through it. **Deleting it first would have broken the product three ways at once.** The sequence was **extract → build → rewrite → delete**, a genuine dependency chain. **Omnigent-side doc drift was deliberately not fixed** — its output would have been a deletion.

### The removal chain (tasks 1–5, all Done)
1. [[tasks/extract-scaffold-into-claude]] · 2. [[tasks/build-claude-self-update]] — **the only non-mechanical piece** · 3. [[tasks/make-codex-a-checked-prerequisite]] · 4. [[tasks/rewrite-installer-single-flavor]] — **the blast radius** · 5. [[tasks/delete-omnigent-directory]] — the payoff.

### Then: verify, document, tidy
- 6 [[tasks/reconcile-skill-ownership-source-of-truth]] → [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- 7 [[tasks/verify-onboarding-flow-end-to-end]] — **the release gate. PASSED.**
- 8 [[tasks/rewrite-docs-post-omnigent]] · 9 [[tasks/formalize-knowledge-base-incidents-folder]] → [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- 10 [[tasks/knowledge-base-hygiene-post-omnigent]] · 19 [[tasks/repair-knowledge-base-paths-in-product-source]] · 11 [[tasks/wiki-sync-post-omnigent]]

### Independent work carried alongside
- 12 [[tasks/bake-architecture-pointer-into-scaffold-templates]] · 13 [[tasks/extend-initiate-project-fill-overview]] · 14 [[tasks/add-task-plan-skill-to-producer]] · 15 [[tasks/enforce-task-status-vocabulary]] · 16 [[tasks/add-status-skill-to-producer]]
- 17 [[tasks/restore-plan-mode-in-plan-task]] — a **regression** repair · 18 [[tasks/remove-fkit-resume-passthrough]] — Omnigent scar tissue
- 21 [[tasks/repair-broken-links-in-closed-sprint-plans]] · 22 [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — the symptom and the recurrence

### Testing — fkit's first automated verification
- 23 [[tasks/add-launcher-contract-smoke-script]] → [[decisions/adr-014-how-fkit-tests-itself]]. **It immediately caught 33.**
- 24 [[tasks/stop-agents-asserting-unchecked-repo-state]] — a **false instruction in both movers, shipping to every project**
- 33 [[tasks/fix-headless-menu-guard-crash]] — **the suite's first catch**

### The migration investigation (20) and its implementation (25–28) — now Done
[[tasks/design-version-to-version-migration-mechanism]] → [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]. **The headline is not "build a migration mechanism"** — fkit already converges every project on every launch; `ai-agents/` was simply carved out of it, and **un-carving it *additively* is the fix.** Rejected and not to be reintroduced: any `migration-*.md` semver-walk, a per-project version cursor, a migration agent — *most fatally, a cursor cannot survive a `git clone`.*
- 25 [[tasks/fix-scaffold-knowledge-base-folders]] · 26 [[tasks/stop-init-failure-bricking-the-launcher]] · 27 [[tasks/refuse-init-on-weird-ai-agents-state]] · **28 [[tasks/converge-ai-agents-additively-on-launch]] — "the migration", now Done**, gated behind 26 + 27. Its opt-out lives in a tracked `ai-agents/.fkit-keep-out` (OQ4).

### The shared-instructions investigation (29) and its implementation (30–32)
[[tasks/add-shared-instructions-layer-for-all-agents]] → [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]. **The layer already exists and already ships** — what was broken is its *delivery*, on two paths. **Rejected by name:** `AGENTS-COMMON.md` + splice (cannot reach Codex), `--append-system-prompt` (session-only). 30 [[tasks/give-codex-the-universal-hard-rules]] · 31 [[tasks/merge-fkit-rules-block-into-existing-root-context-files]] · 32 [[tasks/add-no-secrets-rule-to-fkit-lead]].

### Mover header drift (34/35)
34 [[tasks/task-done-flips-brief-own-status-header]] · 35 [[tasks/task-cancelled-flips-brief-own-status-header]] — the movers now flip a moved brief's own `## Status` header, closing the board-vs-brief drift task 22 is a sibling of. The already-drifted briefs were backfilled by hand.

### The `/fkit-status` deterministic dashboard (40, 41)
40 [[tasks/design-deterministic-dashboard-for-fkit-status]] → [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]] · 41 [[tasks/build-deterministic-dashboard-script-for-fkit-status]] shipped `dashboard.sh` (fkit's **first shipped executable**), turning the roll-up from an LLM hand-count into a computed invariant. 38 [[tasks/add-full-board-switch-to-fkit-status]] added the `full` switch — **later reverted** by task 44 (below).

### The coder→reviewer skill-gate bug (42, 43)
A live bug — a coder spawning `@fkit-reviewer` failed because a subagent inherits the launching session's `skillOverrides`. 42 [[tasks/record-pretooluse-skill-gate-adr-amendment]] → [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] · 43 [[tasks/implement-pretooluse-skill-ownership-hook]] built the `PreToolUse` hook that keys enforcement on the **real caller at any spawn depth**, retiring `CONSULT_SKILLS` and extending ADR-010's structural claim to the consult path.

### One skill, one output (44, 45, 47, 48, 49)
The owner reverted the `full` switch — *"there should be 1 version of the output."* 47 [[tasks/record-one-skill-one-output-convention]] recorded the general rule (operands allowed, output variants forbidden); 44 [[tasks/remove-output-variants-from-fkit-status]] applied it, deleting the delta default and `full` together (the sprint-name operand survives). 48 [[tasks/ship-one-skill-one-output-convention-in-scaffold]] shipped the convention in the scaffold — the **fourth** live-vs-scaffold parity instance, spawning 49 [[tasks/investigate-dual-home-parity-live-vs-scaffold]] (the parity-cause investigation, **now Done** → ADR-027). 45 (the pre-filed wiki sync) remains backlog.

### The coder's autonomous ship-loop (52, 53)
52 [[tasks/design-task-ship-loop-skill]] — an owner-approved design for a coder skill that takes a task brief → done with minimal owner involvement → [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] + [[decisions/adr-020-per-task-plan-and-worklog-artifacts]]. 53 [[tasks/implement-task-ship-loop-skill]] built exactly that spec — skill live, hook suite green. Follow-ups from use: **59/60 cancelled** (timeout-auto-proceed — feasible, declined on cost, see below), **61 and 62 Done**. ⚠️ **ADR-019 sold the loop's autonomy on the strength of two human gates; [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] has since removed one of them** — the done-gate. The plan-gate is untouched and remains the one unremovable checkpoint.

### The `AskUserQuestion` seam and the tool-posture reversal (39, 54, 57, 58)
39 [[tasks/investigate-askuserquestion-availability-for-agents]] measured the session/consult seam (Claude Code 2.1.212: session works, consult `TOOL_ABSENT` 3/3) → [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] · 54 [[tasks/grant-askuserquestion-tool-to-six-claude-agents]] granted the tool to the six Claude-side agents. Then the audit's wider finding — capability tools excluded by **accident**, the `tools:` wall never a real sandbox — became [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]: 57 [[tasks/relax-tool-allowlists-except-adversarial-reviewer]] removed the six `tools:` lines entirely (54's grant survives by inheritance), leaving the adversarial reviewer's wall as **the sole structural tool restriction**. 58 [[tasks/refresh-architecture-docs-for-tool-relaxation]] — the architect-owned doc refresh — is now **Done**: the *"strongest boundary in the system"* language is gone from `architecture.md`, `PROJECT.md` and `CLAUDE.md` (verified 2026-07-19). ⚠️ **`architecture.md` is nonetheless behind again** — it cites ADRs only up to 022, so **023–028 are absent**, including the mover reversal and the eighth-role ruling that falsifies its own *"seven roles"* lines.

### The skill-name collision (50, 51)
50 [[tasks/rename-task-plan-skill-to-task-brief]] renamed the producer's `/fkit-task-plan` → `/fkit-task-brief` (the coder's `/fkit-plan-task` with the same two words swapped) — atomic across the skill dir, `skills-for-role.sh`, and the ADR-018 hook. 51 (its pre-filed wiki sync) remains backlog.

### The orphan cleanup (36) and the `fkit-git` question (55, 56) — the latter now closed
36 [[tasks/remove-fkit-omnigent-orphan-residue]] — the one destructive act, ruled **announce-only** — is Done. **55/56 are now Cancelled**: [[tasks/design-fkit-git-agent-and-consent-model]] collided head-on with the *"never commit"* universal hard rule, and the owner — after briefly ruling for a fully unattended commit/push — **reversed within the same session** on the accidental-secret-to-remote risk. → [[decisions/adr-023-fkit-git-agent-is-not-built]]; [[tasks/implement-fkit-git-agent-and-commit-push]] cancelled with its parent. **The hard rule is reaffirmed, not amended; the team stays seven.**

### The ship-loop timeout question (59, 60) — cancelled on cost, not feasibility
[[tasks/design-ship-loop-timeout-auto-proceed]] → [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]], [[tasks/implement-ship-loop-timeout-auto-proceed]] cancelled with it. **The investigation's first feasibility verdict was wrong** — it reasoned "not runtime-expressible" from `AskUserQuestion`'s schema and reproduced the exact *measure-the-binary* trap the brief warned of. **Corrected: a real AFK timeout exists** (2.1.214). The owner then declined the safe design **on cost** — a dedicated launch mode plus re-expressing the plan-gate and done-gate as plain waits, because the timer is session-global and user-scope. **The loop still blocks forever if the owner is away — accepted, unmitigated.**

### The task-mover gate, reversed (63, 64)
63 [[tasks/design-spawned-invocation-consent-model-for-task-movers]] (**Done**) → [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — **the sprint's one reversal of a universal hard rule.** Spawned agents may now run both movers, the coder may close its own task, and the architect's "keep it owner-only" recommendation was **declined by the owner knowingly**. The load-bearing finding: **no fabrication-resistant precondition exists in fkit** — every candidate (review ledger, worklog, sign-off, verdict) is writable by the requester, and the one authenticated signal (the hook's `agent_type`) answers *who is asking*, never *is this work done*. **Prevention is removed; an unenforced prose marker replaces it.**

64 [[tasks/implement-spawned-invocation-for-task-movers]] (**Done — agent-closed, not owner-verified**, 2026-07-19) built it, and **is itself the first use of the marker it shipped.** The mandatory adversarial pass earned its keep: it found the ADR **self-contradictory** — the hook's data source listed the movers under `producer` only, so Decision 2 *could not have taken effect* — and produced three owner-ruled amendments. `claude/skills-for-role.sh` now carries the movers for every role **except `fkit-adversarial-reviewer`** (deliberately excluded); `skill-ownership-hook.sh` is unchanged, so **no precondition check exists and nothing verifies work is done.** ⚠️ **The marker is invisible in `/fkit-status`** — the dashboard collapses it to a plain `Done` — accepted and recorded, not a defect. ⚠️ **The ship-loop now closes its own task**: ADR-019 sold that loop's autonomy on two human gates and **only the plan gate is left.**

### The `/fkit-status` board reshaped (65–69)
65 [[tasks/filter-fkit-status-board-to-open-tasks]] — the board now shows **open work only**, a **conscious reversal** of its own *"show the dead rows"* principle, with the roll-up line as the stated mitigation and drifted rows always rendering. It amended the `status-report-format` convention. 67 [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] gave unsprinted briefs a **real board** (`sprints/backlog.md` — the filename deliberately outside the `sprint-*.md` glob, which is the whole mechanism keeping it out of the default status run) and backfilled five orphaned briefs. 68 [[tasks/report-backlog-board-in-fkit-status-on-request-only]] made `Backlog` a **target selector** — conforming to one-skill-one-output, no reversal ADR needed. 66/69 (wiki syncs) are backlog.

### Two six-role skills and two output-style changes (61, 62, 70, 72)
70 [[tasks/add-open-questions-interview-skill-for-six-roles]] and 72 [[tasks/add-dumb-down-skill-for-six-roles]] — both registered for the six Claude-side roles, both excluding the Codex-run adversarial reviewer for the **structural** reason task 39 established. 62 [[tasks/add-speak-in-simple-terms-output-style]] — **its four-file premise was disproven at build time** and the owner ruled the one-file version. 61 [[tasks/restructure-coder-report-summary-then-interview]] — summary-first, interview-last, with the forced session/consult degrade. 71/73 (wiki syncs) are backlog.

### The two investigations that closed with "build nothing" (46, 49) — both now Done
46 [[tasks/investigate-mutation-testing-library-adoption]] → [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]: **no mutation-testing library can mutate shell**, so ADR-014's zero-devDeps principle was never actually in tension — there was no contender. The real defect was **gating** — and that half is now fixed: `prove-red.sh` runs on every `npm test` as of 2026-07-18, *before* the ADR that called it outstanding (see the LINT WARNING on [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]). 49 [[tasks/investigate-dual-home-parity-live-vs-scaffold]] → [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]: a convention plus a parity test for the **six** drifted dual-homed files, with the separate consuming-project drift decision **deliberately left deferred despite its re-raise trigger having fired.**

### The duplicate ADR task (37)
[[tasks/record-shared-instructions-reversal-adr]] — **cancelled as a duplicate.** Everything it asked for was already ADR-016, recorded four days before the task was scoped.

### Owner decisions taken during the sprint
- **Codex unreachable ⇒ a loudly-flagged partial, not a hard fail.** The flag is load-bearing.
- **`task-plan` decomposes to the smallest independently shippable unit** — the test is independent shippability, not size.
- **`package.json` stays, with its `scripts`** → [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]].
- **The convergence invariant, ratified:** *never write to a path that already exists.*
- **The `.fkit/` orphan-cleanup consent model → announce-only** (2026-07-17), unblocking task 36.

## Outcome
**62 done · 11 backlog · 5 cancelled — of 78.** *(Updated 2026-07-19 by sync: the sprint grew 73 → 78 with a new five-task **task-folder migration** cluster (74–78), and task **64** closed — **agent-closed, not owner-verified**. The earlier 2026-07-19 update recorded the owner closing 46, 49, 58 and 63, resolving the board-vs-record drift flag.)* Omnigent is gone; the release gate passed on a clean install; fkit has automated verification for the first time; Codex finally receives the universal hard rules; **"the migration" (additive convergence) landed**; the coder→reviewer consult path is structurally enforced; the coder's autonomous ship-loop is **built and live**; the `.fkit/` orphan residue is cleaned; the tool-allowlist posture was deliberately reversed (ADR-022) leaving one structural tool wall; the `/fkit-status` board now shows open work only and unsprinted briefs finally have a board; and two six-role skills landed.

**This batch is defined as much by what was decided NOT to build.** Five of the eleven new ADR-level outcomes are *"build nothing"* rulings — no git agent, no ship-loop timeout, no mutation-testing library, no reopening of the consuming-project drift decision, and no second copy of an ADR that already existed. Three of them are explicitly written as **tombstones** with re-raise bars, so the questions do not get re-run.

**Cancelled (5):** **37** the duplicate shared-instructions tombstone (already ADR-016); **55 / 56** the `fkit-git` agent (hard rule reaffirmed); **59 / 60** the ship-loop timeout (feasible, declined on cost).

**Still Backlog (11):** **45 / 51 / 66 / 69 / 71 / 73** — six pre-filed wiki syncs, **all substantively covered** by the 2026-07-19 syncs that recorded this batch; plus the **new task-folder migration cluster (74–78)** described below. Task **64** is no longer backlog — it is Done (agent-closed).

### New cluster — the task-folder migration (74–78), all Backlog

Scoped 2026-07-19: give tasks a folder structure and a **global task-ID scheme**, replacing the current flat `backlog/`/`done/`/`cancelled/` layout keyed by per-sprint priority numbers. 74 designs the structure and ID scheme (architect; **adversarial pass recommended**); 75 assigns global IDs to all **89** briefs and builds an ID registry (**no file moves — reversible by design**); 76 is the **atomic point of no return** — migrate all 89 tasks and update **13 tooling files**; 77 repairs ~110 task links in `reviews/` and `knowledge-base/`; 78 is the wiki sync (**~96 vault references plus a structural re-description** of how this wiki files tasks).

⚠️ **The board itself records that 74 "collides with task 64."** Task 64 has since shipped, so that collision is now a real one to resolve in 74's design rather than a scheduling note — **the design has not been done, so what the collision actually is has not been established here.** Flagged rather than guessed.

⚠️ **Task 78 will not be a routine sync.** It changes where every task brief lives, which is the `**Source**:` path on **every** task page in this vault, plus this wiki's own filing convention for tasks. **Scoped, not started.**

✅ **The board-vs-record drift flagged on 2026-07-19 is RESOLVED.** Tasks **46, 49 and 63** — each carrying a completed investigation with a recorded ADR while its row still read `🔲 Backlog` — were closed by the owner, along with **58**. The board and the knowledge base now agree.

⚠️ **A new instance of the same shape, on the Backlog board rather than this one:** `decide-whether-fkit-needs-a-tester-agent` still reads `🔲 Backlog` on `sprints/backlog.md`, but it has been **ruled on** — [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]], dated 2026-07-19, cites its evaluation report as evidence and answers all seven of its open questions. **The wiki role does not move task files;** the owner may want to close it. **This is the recurring pattern, not a one-off:** an investigation task's real output is an ADR, and recording the ADR does not close the row.

**Owner dispositions (2026-07-15) — all seven original open questions ruled** (OQ8 added later, ruled 2026-07-17 → "generalize", spawning task 47).

### The recurring lesson of this sprint
**Three false claims reached briefs without anyone running the command.** Both investigation reports lost claims to an adversarial Codex pass; a third — that `cp -R` writes through a dangling symlink *"outside the project"* — survived into task 27's brief and was caught only at implementation and review.

> **A behavioral claim about a shell builtin or coreutil is a claim to run, not to reason about** — and **a brief that says "confirm the bug is real" before anyone has is a brief that has already assumed its answer.**

Its sibling: **a count of a *semantic* rule cannot be established by grepping one of its phrasings.** Both are now standing rules in `conventions/evidence-before-assertion.md` ([[tasks/stop-agents-asserting-unchecked-repo-state]]).

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[systems/fkit]] · [[systems/install-and-self-update]] · [[systems/role-locked-sessions]] · [[systems/knowledge-base-structure]]
- [[systems/testing-and-verification]] · [[systems/launch-convergence-and-init]] · [[systems/review-and-model-diversity]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] · [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] · [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]] · [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] · [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[decisions/adr-014-how-fkit-tests-itself]] · [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] · [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] · [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] · [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] · [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] · [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] · [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]
- [[tasks/implement-spawned-invocation-for-task-movers]] — task 64: the hard-rule reversal built, and the sprint's first agent-closed row
- [[decisions/adr-029-stop-hook-enforces-turn-completion-contract]] — the second hook, decided 2026-07-19 (not yet built) and not carried by a numbered row on this board
- [[decisions/adr-023-fkit-git-agent-is-not-built]] · [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] · [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] · [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] · [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] · [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]]
- [[tasks/investigate-mutation-testing-library-adoption]] · [[tasks/investigate-dual-home-parity-live-vs-scaffold]] · [[tasks/design-spawned-invocation-consent-model-for-task-movers]] · [[tasks/refresh-architecture-docs-for-tool-relaxation]]
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] · [[tasks/report-backlog-board-in-fkit-status-on-request-only]] · [[tasks/filter-fkit-status-board-to-open-tasks]]
- [[tasks/add-open-questions-interview-skill-for-six-roles]] · [[tasks/add-dumb-down-skill-for-six-roles]] · [[tasks/add-speak-in-simple-terms-output-style]] · [[tasks/restructure-coder-report-summary-then-interview]]
- [[tasks/design-fkit-git-agent-and-consent-model]] · [[tasks/implement-fkit-git-agent-and-commit-push]] · [[tasks/design-ship-loop-timeout-auto-proceed]] · [[tasks/implement-ship-loop-timeout-auto-proceed]] · [[tasks/record-shared-instructions-reversal-adr]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/give-every-agent-direct-wiki-query-access]] · [[tasks/rollout-adr-004-fixed-consult-titles]] · [[tasks/add-e2e-smoke-script-for-fkit-itself]]
