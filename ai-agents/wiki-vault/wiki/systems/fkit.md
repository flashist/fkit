# fkit

**Layer**: shared
**Key files**: `claude/agents/fkit-*.md`, `claude/skills/fkit-*/SKILL.md`, `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, `install.sh`, `bin/release.mjs`

## Summary
fkit is a **team of seven role-scoped AI agents for software development** — producer, coder, reviewer, adversarial reviewer, architect, wiki librarian, and an **orchestrating lead** — that a developer installs once and then runs inside their own project. It is **not an application**: no build step, no server, no database, no runtime state outside files, and no test suite.

> **"Team room" is retired project-wide** (owner ruling 2026-07-25) — the role's name is **`lead`**, and it is now **menu option 1**, not 7. See [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] and [[tasks/retire-team-room-in-docs-and-agent-definitions]].

> ⚠️ **An eighth role is decided but not built.** [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] (2026-07-19) authorizes a **tester** seat and **explicitly reverses** the owner's own *"seven roles, not breadth"* constraint. **Re-verified 2026-07-22: `claude/agents/` holds seven files** — no tester agent, skill, lockdown entry or launcher wiring exists, and the ADR sequences all of it behind an unfinished CI gate. **Seven is the tree; eight is the plan.** The canonical docs are now **corrected and consistent with this**: `architecture.md` frames "seven built, an eighth authorized-not-built" and cites ADRs to 030 ([[tasks/refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role]], task 82); `PROJECT.md:8,:72` were amended and the "not breadth" clause reversed ([[tasks/amend-project-brief-for-the-eighth-role]], task 83); and the launcher's role-count literal was **removed entirely** (task 81 Part D) so no count can go stale. Wiring the eighth role remains an owner/producer follow-up, not the wiki's.

The product thesis: AI coding assistants collapse product decisions, implementation, and review into one undifferentiated chat loop with **no separation of authority** — the same agent proposes a design, writes the code, and approves it. fkit's answer is a small team with **distinct authority**, coordinating over **files in git** rather than shared runtime state. This repository *is* the framework, and it dogfoods itself.

> **One runtime: Claude Code native + Codex** ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]). fkit formerly shipped on Omnigent; that runtime was **deleted in Sprint 2** — see [History](#history--fkit-formerly-ran-on-omnigent).

## Architecture

### The seven roles *(built; an eighth is authorized — see the note above)*
Each role is one file — `claude/agents/fkit-<role>.md`: YAML frontmatter (`name`, `description`, `tools`, `color`, `initialPrompt`) plus a system prompt. There is no shared base class; each prompt restates its own boundaries.

| Agent | Authority |
|---|---|
| `fkit-producer` | Product & sprint planning, task briefs. **No source writes.** **The only role that moves task files** — sole owner of `/fkit-task-done` and `/fkit-task-cancelled` since [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]. |
| `fkit-coder` | **Sole source-write authority.** Plan-gated (`EnterPlanMode` / `ExitPlanMode`). |
| `fkit-architect` | Design specs, ADRs, surveys. **Never implements; never writes the wiki.** |
| `fkit-reviewer` | Review-only; writes **only** the `review.md` ledger inside a task folder (formerly `ai-agents/reviews/`, absorbed by ADR-029). |
| `fkit-adversarial-reviewer` | Findings only. **Structurally write-free — a leaf.** Runs on Codex. |
| `fkit-wiki` | **Exclusive write gateway** for `ai-agents/wiki-vault/`. A leaf. |
| `fkit-lead` | The **lead + orchestrating conductor** — **menu option 1**. **Routes** ("who do I need?") **and drives**: spawns and sequences typed peers, holds the owner channel, relays owner decisions live. Owns `sprint-ship-loop`. **Writes no source, never reviews** — each role's work runs in its own fresh spawned context, so separation of authority holds. ⚠️ *This reverses the old "routes; does no work" contract* — [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]]. |

**The tool-allowlist posture was deliberately reversed on 2026-07-18** ([[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]], implemented by [[tasks/relax-tool-allowlists-except-adversarial-reviewer]]): the six Claude-side agents now carry **no `tools:` line at all** — they inherit every Claude Code tool (`WebSearch`, `LSP`, `AskUserQuestion`, …) — and role separation for them rests on **prompts + the skill hook**, accepted knowingly. **Exactly one structural tool wall remains, and it is deliberate: the adversarial reviewer's** (`Read, Grep, Glob, Bash, Skill` — no Write/Edit/Agent), which keeps *"the second opinion never touched the code it judges"* a structural fact at any spawn depth. *(The doc refresh, Sprint 2 task 58, is now **Done** — [[tasks/refresh-architecture-docs-for-tool-relaxation]]; verified 2026-07-19, the "strongest boundary in the system" language is gone from `architecture.md`, `PROJECT.md` and `CLAUDE.md`.)*

⚠️ **A tension worth naming, because the next ADR walks into it.** The one surviving tool wall exists because unrestricted tools were judged **unacceptable for one role** — yet [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] authorizes a tester whose entire justification is a **deliberately unhardened, network- and write-enabled envelope**, and declines to bound it. ADR-028 records this tension against itself rather than resolving it.

### The 25 skills
Skills (`claude/skills/fkit-*/SKILL.md`) are the durable, role-owned **procedures**; the agent prompts are the role's *character*. Every role-specific skill opens with a `⛔ Owner:` banner naming the one role allowed to run it. Only `fkit-query` carries no banner — it is universal by design. *(Count re-verified against the tree 2026-07-26: **25** skill dirs.)*

| Owner | Skills |
|---|---|
| lead | `sprint-ship-loop` — the sprint-scope conductor loop ([[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]], [[tasks/build-fkit-sprint-ship-loop-skill]], wired by [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]]) |
| producer | `initiate-project`, `task-brief` *(renamed from `task-plan`, [[tasks/rename-task-plan-skill-to-task-brief]])*, `task-done`, `task-cancelled` *(**producer-only again** since ADR-033)*, `status` |
| coder | `plan-task`, `process-review`, `process-stateful-review`, `task-ship-loop` *([[tasks/implement-task-ship-loop-skill]])* |
| architect | `survey-project`, `inspect`, `design-spec`, `evaluate-approach`, `record-decision` |
| reviewer | `review`, `stateful-review` |
| adversarial reviewer | `adversarial-review` |
| wiki | `wiki-ingest`, `wiki-lint`, `wiki-sync` |
| everyone | `team` (roster/signpost), `query` (read-only wiki reads) |
| the six Claude-side roles *(all but the adversarial reviewer)* | `open-questions-interview` — interview the owner on what this session left unanswered ([[tasks/add-open-questions-interview-skill-for-six-roles]]) · `dumb-down` — re-explain the last answer in plain language ([[tasks/add-dumb-down-skill-for-six-roles]]) |

**The adversarial reviewer is excluded from both new skills for a structural reason, not a preference:** it reviews on Codex under a restricted allowlist (ADR-022) and has **no owner channel**. This is the task-39 finding applied — *"all agents" excluding the second model is the structural reality.*

**Role→skill ownership is declared in exactly one place: `skills_for_role()`** — extracted into `claude/skills-for-role.sh` and read by both the launcher and the `PreToolUse` skill-ownership hook that now enforces it at any spawn depth ([[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]], [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]).

### Runtime topology — one process, one role, no orchestrator *daemon*
There is no fkit daemon, no root agent, no session broker, no message bus. **Claude Code owns the session lifecycle**; fkit is a launcher and a set of prompts. Two roles at once means two terminal tabs — deliberately not automated. Role routing is an `if/else`: **no LLM sits in the path that decides which role you get.**

> **The `fkit-lead` conductor is not a counter-example.** Since [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] lead can *drive* the team — but it is an ordinary **in-session agent** spawning typed peers via the Agent tool. A role that orchestrates introduces **no daemon, broker or bus**. Its flagship application is the lead-owned `fkit-sprint-ship-loop`, which ships a sprint by spawning bounded workers and relaying every owner decision live through the lead session ([[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]]).

**The hook layer is now four scripts** (`claude/*.sh`, wired by `build_settings()` and verified against the tree 2026-07-26): `skill-ownership-hook.sh` (`PreToolUse`, ADR-018 — the role lock), `turn-completion-hook.sh` (`Stop`, ADR-030 — the turn-completion contract), `askuserquestion-marker-hook.sh` (`PreToolUse` — the turn-scoped marker feeding the Stop hook's check A), and `shiploop-marker-hook.sh` (`UserPromptExpansion` — the authoritative ship-loop skip signal, [[tasks/transcript-independent-ship-loop-skip-signal]]).

Sessions are **role-locked**, and cross-role work is a **consult**, never a role switch — see [[systems/role-locked-sessions]]. Install, the launcher, and self-update: [[systems/install-and-self-update]]. The Codex second opinion: [[systems/review-and-model-diversity]].

### Data model — everything is a file in git
There is no database. The **`ai-agents/` tree is the entire coordination state**: `knowledge-base/` (see [[systems/knowledge-base-structure]]), `sprints/`, `tasks/{backlog,done,cancelled}/`, and `wiki-vault/` (this wiki).

**A task is a FOLDER, keyed by a permanent global ID** *(since [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]], migration shipped 2026-07-21 by [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]])*. The old shape — a task was one file, `tasks/<board>/<slug>.md`, with its plan, worklog and review ledger scattered across three *separate top-level directories* keyed by a slug that could change — **is gone.** Now:

```
ai-agents/tasks/<board>/<NNNN>-<slug>/
├── brief.md      REQUIRED — the task itself
├── plan.md       optional  — the owner-approved plan (ADR-020)
├── worklog.md    optional  — worklog + owner-decision log
├── review.md     optional  — the two-party review ledger
└── assets/       optional
```

- **`<NNNN>` is a permanent four-digit global ID** — `0001`…`9999`, zero-padded, allocated `1 + max` across all three boards, **never reused, never renumbered.** It fixes the old collision where Sprint 1 and Sprint 2 each had a "task 46": sprint-scoped priority was never a unique identifier. The ID also carries in an **`## ID` brief field**; the folder name is authoritative and `dashboard.sh` lints the two with an **`id-mismatch`** drift kind.
- **There is NO registry file.** The owner ruled against a stored index ([[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] Decision 8) — a third carrier that can drift. Authority is the folder name plus `## ID`; allocation is `1 + max` from the tree (one `ls`), lookup is one `grep`.
- **`review.md` is a two-party ledger**, written by reviewer *and* coder — the loop-prevention memory carrying decision state and **accepted residuals** across review rounds so settled tradeoffs are not re-litigated. It **lives inside the task folder now**; the old `reviews/<slug>.md` top-level directory no longer exists.
- **`plan.md` and `worklog.md`** are the coder ship-loop's artifacts ([[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — whose §6 folder end-state ADR-029 executes): git-tracked, **not** wiki-ingested. `plan.md` is the loop's autonomy boundary; `worklog.md` is the worklog + owner-decision log → the ready-for-done report. *(The loop is built and live — [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]], [[tasks/implement-task-ship-loop-skill]].)*
- **The movers now `git mv` the whole folder**, so a close carries the brief *and* its plan, worklog and ledger as one unit — the old shape moved the brief and orphaned the other three. **Only the producer may run them** (ADR-033 — see Gotchas).
- **`## Owner` is a mandatory brief field**, alongside `## ID` and `## Status` — exactly one fkit role, from a closed vocabulary of the **seven live roles** (`conventions/task-owner-vocabulary.md`; the not-yet-built eighth is explicitly **not** a valid owner). Positioned immediately after `## Status`, populated at creation by `fkit-task-brief`, and rendered by `dashboard.sh` as its own board column between Filename and Next step. Added by [[tasks/add-owner-field-to-brief-schema-and-task-brief-skill]], backfilled across 108 briefs by [[tasks/backfill-owner-field-into-existing-briefs]], rendered by [[tasks/render-owner-column-in-fkit-status]].
- **A brief's dependency has one canonical form**, `- **Depends on:** …` in `## Notes`, with nothing between the `**` and the label (`conventions/dependency-declaration-form.md`). Decoration there made the declaration invisible to `dashboard.sh`, which then rendered a false **`ready`** — hand-corrected for seven consecutive status runs. The parser now emits a LOUD `⟨derive: UNPARSEABLE — see brief⟩` instead of fabricating readiness ([[tasks/teach-dashboard-to-resolve-notes-dependencies]]).
- **The three absorbed top-level dirs — `ai-agents/reviews/`, `plans/`, `worklogs/` — are gone.** Two review ledgers were sprint-keyed, not task-keyed, and had no task folder to fold into; they moved to `ai-agents/sprints/reviews/`.
- **Consuming projects are not migrated** ([[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]], deferred) — [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] converges additively and cannot rewrite an existing project's old-layout tasks. That reconciliation is its own future task and ADR.

Generated and gitignored per project: `.fkit/settings/<role>.json` (the hook wiring), `.fkit/state/` (turn- and session-scoped hook markers — `askuq-<session_id>`, `shiploop-<session_id>`), `.fkit/interview` + `.fkit/intake.md`, `.fkit/tmp/adversarial-prompt.md`, and the fkit-managed `.claude/agents/fkit-*.md` + `.claude/skills/fkit-*/` copies.

## Gotchas / Known Issues
- **Edit `claude/`, never `.claude/`.** `claude/fkit-claude-init.sh` does an `rm -f` + `cp` of the `fkit-*` agents and skills on **every single launch**. An edit made in `.claude/` is silently destroyed — no warning, no diff.
- **`prove-red.sh` now runs on every `npm test`** *(corrected 2026-07-19)* — ADR-026 Decision 4's gate shipped on 2026-07-18, though **the ADR itself, dated the next day, still says it hasn't**; see the LINT WARNING on [[systems/testing-and-verification]]. The mutation-testing-library question is **closed**: no library can mutate shell ([[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]). Still open: R2's **no-op-mutation** mode, which the gate does not catch.
- **Dual-home parity is now BUILT, and ADR-027's premise about it was overruled** *(updated 2026-08-02; this line previously read "six fkit-authored files are drifted … the reconciliation and parity test are **scoped, not built**", which is no longer true).* The reconciliation ([[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]], task `0132`) and the mechanical test ([[tasks/build-dual-home-parity-test]], task `0133`) both landed 2026-08-01/02. ⚠️ **But the drifted scaffold `conventions/*` files were never "stale copies":** the sweep found five of the six are deliberate, de-fkit-ified **audience-adapted rewrites**, and the owner ruled 2026-08-01 (**Option B**) that audience-adapted is a legitimate **third kind** — **byte-aligning live → scaffold is rejected as a product regression**, because it would ship fkit's own incident narrative and 4 verified-broken relative links into every new project. **ADR-027 still says otherwise on disk**; amending it is task `0186`, **open**. Also newly on the record: **`decisions/` and `reports/` are outside the dual-homed surface — no ADR is ever a drift event.** The authoritative exception list is `test/dual-home-parity-exceptions.mjs` ([[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]).
- **Verification is partial, no longer absent.** *(Updated 2026-07-16.)* For most of fkit's life there was **zero** automated verification — the only check, `omnigent/validate-bundles.sh`, **died with the Omnigent removal**, and [[decisions/adr-003-ci-runs-validate-bundles]]'s CI never landed. **`claude/fkit-claude.sh` is now covered** by the launcher-contract suite (`npm test`) — the argv contract plus the hook-wiring shape; the **per-role skill matrix moved to `test/skill-ownership-hook.test.js`** when task 43 retired the session-scoped 7×21 `skillOverrides` matrix ([[decisions/adr-014-how-fkit-tests-itself]], [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]], [[systems/testing-and-verification]]). **`install.sh` still has none, and there is still no `.github/`** — so the `curl | sh` entry point, the highest-blast-radius file in the repo, remains unverified. **The risk is reduced, not closed.**
- **Single-vendor concentration is accepted, not a defect.** There is no fallback runtime. A finding of the form *"fkit only runs on one vendor's CLI"* is [[decisions/adr-009-claude-code-native-is-the-only-runtime]], not a bug.
- **`fkit --resume` is gone** *(fixed 2026-07-13; this page previously described the live bug).* The blanket unrecognized-arg passthrough silently resumed *any* session — a coder session included — under the **lead's** lockdown: *the user got their conversation back and their role taken away, with no warning.* Removed by [[tasks/remove-fkit-resume-passthrough]]; a stray arg with no named role is now a **usage error**, and the removal is **pinned by a test**.
- **No agent commits or pushes unprompted.** A **prompt rule in every agent definition — not a sandbox.** It is the one place fkit's boundaries depend entirely on instruction-following. **Reaffirmed, not amended, on 2026-07-18**: the owner considered an eighth agent (`fkit-git`) with an agent-invocable `commit-push` skill, briefly ruled for it, then reversed within the same session — an agent that pushes whatever is uncommitted, unattended, is the highest-risk surface for leaking secrets to a remote. **fkit will not gain a commit/push agent** ([[decisions/adr-023-fkit-git-agent-is-not-built]]). *(ADR-023's "the team stays seven" is **no longer current** — a different eighth role was authorized the next day by [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]]. **The commit/push ruling itself is untouched**; only the count claim moved.)*
- ⚠️ **fkit has two roles that READ code and zero that RUN it — every review is static.** The reviewer admits it in its own output vocabulary: `fkit-review/SKILL.md:113` emits **`(validation-gated)`** — *"I read this and it looks right, but somebody has to actually run it"* — and *"did you test it?"* is a pure **coder self-report** (`fkit-coder.md:112-113`). [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] rules to close this with a **tester seat holding sandbox authority**, over the architect's and producer's recommendation. **Nothing is built**, so the hole is open today.
- ⚠️ **The task movers are PRODUCER-ONLY — reversed twice, currently back to one role** *(ADR-025 opened them 2026-07-18; [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] closed them again 2026-07-23)*. **Only `fkit-producer` may run `/fkit-task-done` and `/fkit-task-cancelled`.** Every other role — wiki, coder, reviewer, architect, lead — **routes its closes through the producer** and closes nothing itself. Verified against the tree 2026-07-26: `claude/skills-for-role.sh` grants both movers to `producer` and to no other role.
  > **This one is structural, unlike ADR-025's.** The [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] `PreToolUse` hook **denies** a mover call from any non-producer identity **at any spawn depth**. *"A role cannot close its own task under its own identity"* is now a fact of the runtime, not prose. Landed by [[tasks/route-coder-ship-loop-close-to-producer]] → [[tasks/route-sprint-ship-loop-close-to-producer]] → [[tasks/revert-task-movers-to-producer-only]], in that order (rerouting the loops before removing the grant, or they would be hook-denied).
  > ⚠️ **It restores separation of the closing *identity*, NOT prevention.** ADR-025 established that *"spawn a producer and ask it to mark done"* is *"the doer marks its own work done with an extra hop"* — a spawned producer has no owner channel and its `⛔ Owner:` banner is advisory. **That is still true.** A determined doer can still spawn a producer to close. Read the marker accordingly; **do not "harden" past the ADR** — that residual is accepted and named.
  > ⚠️ **The marker still does not reach the board.** `dashboard.sh` matches the marker *prefix*, so `✅ Done (agent-closed — not owner-verified)` collapses to a plain `done`, is filtered off the open board, and counts in the roll-up as an ordinary close. **`/fkit-status` cannot tell you which closes were agent-performed, and nothing counts them.** Unchanged by ADR-033, and **amplified** by the sprint loop, which can turn a whole board green in one run ([[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]]). Accepted and recorded, **not a defect to file**.
  > ⚠️ **Both ship-loops now end at a producer hand-off, not a green board.** [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]'s §Decision 5 self-close is **amended away**; its plan gate is untouched. The coder's autonomy narrows and the orchestrator gains one producer-spawn per task — both stated as costs, not hidden.
  > ⚠️ **The wiki flags, it does not close.** [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] recommended the wiki self-close; the owner declined and made the rule universal instead. The wiki's completion signal is an explicit *"task N ready to close"* at the end of its report.
  > **A standing finding this reversal produced: a grep for one phrasing is not an inventory.** The `skills-for-role.sh` mirror checklist missed **four sites — three agent system prompts (`fkit-producer.md`, `fkit-coder.md`, `fkit-lead.md`) and the universal rules block (`claude/scaffold/universal-rules.md`)** — and the verification sweep had both a **path** gap and a **phrasing** gap, each shipping a real defect into the working tree. See [[tasks/revert-task-movers-to-producer-only]].
  > ✅ **Corrected 2026-08-02 — this line previously read *"missed **four system prompts** and the universal rules block"*, which counts FIVE sites and is wrong by one.** [[tasks/investigate-the-skill-ownership-fact-inventory-gap]] (task `0142`, report Part 7) recorded the discrepancy against the brief's and the sprint plan's *"three"* and **could not settle it**, because settling it looked like it needed the `0124` sweep its brief forbade, and `0124`'s folder has **no `worklog.md`**. It did not: `0124`'s **brief's own amendment history** is the primary record. **Three** is the count after the **first** scope amendment (2026-07-25); `fkit-lead.md` was added by the **third** the same day, found by task `0123`. An enumeration of every `claude/agents/fkit-*.md` path named anywhere in `0124`'s folder returns **exactly three** files. The error was most likely taking the brief's phrase *"a **fourth** system prompt"* — whose own count already included the rules block — and then adding the rules block again. ⚠️ **Residual:** if `0124`'s sweep found a site it never wrote into its brief, no record of it survives.
- **Two of the four known laundering paths are worth naming when reading any board:** the *confused optimist* (the coder genuinely believes it is done; **the normal failure, not an exotic one**) and an un-audited `cancelled/` — an agent that cannot finish a task can now make its own obligation disappear.
- **No secrets in any artifact.** Nothing fkit produces may carry a credential — all of it goes to git.

## History — fkit formerly ran on Omnigent
fkit originally shipped as [Omnigent](https://omnigent.ai) agent bundles under `omnigent/`. [[decisions/adr-008-claude-code-native-port-alongside-omnigent]] added the Claude Code native port **alongside** it (dual-runtime, hand-mirrored); [[decisions/adr-009-claude-code-native-is-the-only-runtime]] superseded that and made Claude Code native + Codex the **only** runtime. `omnigent/` was deleted in Sprint 2 ([[tasks/sprint-2-remove-omnigent]]).

This is recorded because it explains things that would otherwise look arbitrary: why four retired verbs (`omnigent`, `claude`, `reconnect`, `restart-team`) **fail loudly** rather than being silently dropped; why self-update notifies rather than auto-updates; and why ADR-008 is kept rather than deleted — it is the record of *why fkit left Omnigent*.

## Open questions
1. ~~**Does the `PreToolUse` hook payload expose the calling subagent's identity?**~~ **Answered: yes** — verified against the running Claude Code binary (`agent_type`/`agent_id`, at any spawn depth). The consult-path skill boundary is now **structurally enforced**, not advisory: [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]], implemented by [[tasks/implement-pretooluse-skill-ownership-hook]]. See [[systems/role-locked-sessions]].
2. ~~**What is the intended verification story?**~~ **Answered** by [[decisions/adr-014-how-fkit-tests-itself]]: a black-box process contract at the repo root, zero devDeps, never shipped to consumers. **What remains open is narrower** — `install.sh` e2e and a CI workflow are deferred to Sprint 3, and *"does a red suite gate `Done`?"* is still an owner call.
3. ~~**Is `fkit --resume` worth keeping at all?**~~ **Answered: no.** The owner ruled **removal**, rejecting both of the coder's proposed fixes (*persist the role* / *require a role*). The question is **closed** — do not reopen it, and do not build a replacement.
4. ~~**What is the consent model for the one destructive act still on the table** — clearing the `.fkit/` Omnigent orphans?~~ **Answered: announce-only** (owner, 2026-07-17), and the cleanup is now **Done** ([[tasks/remove-fkit-omnigent-orphan-residue]]). `.fkit/settings` is live lockdown state and must never be touched.

## Related
- [[systems/role-locked-sessions]]
- [[systems/install-and-self-update]]
- [[systems/review-and-model-diversity]]
- [[systems/knowledge-base-structure]]
- [[systems/testing-and-verification]]
- [[systems/launch-convergence-and-init]]
- [[systems/subagent-runner-connectivity]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]]
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]
- [[decisions/adr-023-fkit-git-agent-is-not-built]]
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]]
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]]
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — a **second** hook (`Stop`) decided 2026-07-19 to enforce interactive questions and a "What's next?" close. **Built 2026-07-23** (task 0127) — `claude/turn-completion-hook.sh` (`Stop`) + `claude/askuserquestion-marker-hook.sh` (`PreToolUse` marker) now in the tree; check A's signal comes from the marker, not the transcript (Addendum — 2026-07-23)
- [[tasks/implement-spawned-invocation-for-task-movers]]
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]]
- [[tasks/investigate-mutation-testing-library-adoption]]
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]]
- [[tasks/design-spawned-invocation-consent-model-for-task-movers]]
- [[tasks/refresh-architecture-docs-for-tool-relaxation]]
- [[tasks/add-open-questions-interview-skill-for-six-roles]]
- [[tasks/add-dumb-down-skill-for-six-roles]]
- [[tasks/add-speak-in-simple-terms-output-style]]
- [[tasks/restructure-coder-report-summary-then-interview]]
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]]
- [[tasks/report-backlog-board-in-fkit-status-on-request-only]]
- [[tasks/filter-fkit-status-board-to-open-tasks]]
- [[tasks/design-fkit-git-agent-and-consent-model]]
- [[tasks/implement-fkit-git-agent-and-commit-push]]
- [[tasks/design-ship-loop-timeout-auto-proceed]]
- [[tasks/implement-ship-loop-timeout-auto-proceed]]
- [[tasks/record-shared-instructions-reversal-adr]]
- [[tasks/relax-tool-allowlists-except-adversarial-reviewer]]
- [[tasks/implement-task-ship-loop-skill]]
- [[tasks/rename-task-plan-skill-to-task-brief]]
- [[tasks/remove-fkit-omnigent-orphan-residue]]
- [[tasks/implement-pretooluse-skill-ownership-hook]]
- [[tasks/converge-ai-agents-additively-on-launch]]
- [[tasks/add-no-secrets-rule-to-fkit-lead]]
- [[tasks/stop-agents-asserting-unchecked-repo-state]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
- [[decisions/adr-002-archive-pre-omnigent-design-docs]]
- [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[decisions/adr-001-package-json-stays-metadata-only]]
- [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]]
- [[decisions/adr-006-symlink-vendored-query-skill-not-copy]]
- [[decisions/adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill]]
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[tasks/add-ci-validate-bundles]]
- [[tasks/add-task-plan-skill-to-producer]]
- [[tasks/build-fkit-reconnect-tooling]]
- [[tasks/delete-omnigent-directory]]
- [[tasks/fix-claude-agents-md-placeholder-text]]
- [[tasks/give-every-agent-direct-wiki-query-access]]
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]]
- [[tasks/remove-adversarial-reviewer-eager-spawn]]
- [[tasks/restore-plan-mode-in-plan-task]]
- [[tasks/rewrite-docs-post-omnigent]]
- [[tasks/wiki-sync-post-omnigent]]
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — a task is a folder `tasks/<board>/<NNNN>-<slug>/` under a permanent global ID; `plans/`, `worklogs/` and `reviews/` absorbed. The largest structural change to this data model in the project's history — **migration shipped 2026-07-21** ([[tasks/migrate-tasks-to-folder-structure-and-update-tooling]]); *(this line previously still read "decided, not built" — corrected 2026-07-26)*
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — ⚠️ **lead becomes a conductor**; reverses ADR-010 §Decision 3. The plan gate on the orchestrated path is **prose, not a write-wall**
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the sprint-scope loop; live owner-relay, agent-closed by default
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — ⚠️ **the movers are producer-only again**, hook-enforced; reverses ADR-025
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] · [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] · [[tasks/build-fkit-sprint-ship-loop-skill]] · [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] · [[tasks/update-launcher-menu-help-for-conductor]] · [[tasks/amend-project-brief-for-lead-conductor]] · [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] · [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] — the lead-conductor chain
- [[tasks/route-coder-ship-loop-close-to-producer]] · [[tasks/route-sprint-ship-loop-close-to-producer]] · [[tasks/revert-task-movers-to-producer-only]] — the ADR-033 landing sequence
- [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] — the trigger for ADR-033
- [[tasks/add-owner-field-to-brief-schema-and-task-brief-skill]] · [[tasks/backfill-owner-field-into-existing-briefs]] · [[tasks/render-owner-column-in-fkit-status]] · [[tasks/teach-dashboard-to-resolve-notes-dependencies]] — the brief-schema + board cluster
- [[tasks/add-adr-030-prose-half-to-universal-rules]] · [[tasks/transcript-independent-ship-loop-skip-signal]] — the ADR-030 prose half, and the hook layer's fourth script
- [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] · [[tasks/retire-team-room-in-docs-and-agent-definitions]] — lead becomes menu 1; "team room" retired
- [[tasks/wiki-resync-eighth-role-after-source-docs-land]] — the resync whose premise was wrong, and the "an ADR is a dated record, not a status board" lesson
- [[tasks/decide-whether-fkit-needs-a-tester-agent]]
- [[tasks/design-task-folder-structure-and-id-scheme]]
- [[tasks/assign-global-task-ids-and-create-registry]]
- [[tasks/compress-universal-rules-output-style-section]] — task 79, the universal-rules compression
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — task 81, the mover KB-sweep fix + ADR-number guard
- [[tasks/repair-task-links-outside-the-wiki-after-migration]] — task 77, the post-migration doc-link repair
- [[tasks/wiki-sync-backlog-board-introduction]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/wiki-sync-dumb-down-skill]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/wiki-sync-filtered-fkit-status-board]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/wiki-sync-fkit-status-output-variant-removal]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/wiki-sync-open-questions-interview-skill]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/wiki-sync-task-plan-rename]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/repair-stale-adr-029-stop-hook-links-in-the-vault]] — task 80, the ADR-029/030 vault link repair
- [[tasks/wiki-sync-task-folder-migration]] — task 78, the post-migration vault re-description
- [[tasks/decide-whether-to-drop-the-numeric-prefix-from-task-folder-names]] — task 0102: the `<NNNN>-<slug>` folder model **re-examined and kept**; the priority cell is the number that changes
- [[tasks/wiki-ingest-lead-conductor-and-adrs-031-032]] — task 0117, which verified this page's conductor description rather than rewriting it
- [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] — `0141`, which corrected this page's "team room / menu 7" claims
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — **a mid-board insertion is NOT the owner-ruled re-rank exception** — forced by arithmetic, not policy
- [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]] — **the skill-ownership site inventory is a declared registry**, not a remembered checklist
- [[tasks/convert-skill-descriptions-to-block-scalars-and-guard]] — task `0136` — every skill `description:` to a `>-` block scalar, plus the repo's first `SKILL.md` frontmatter guard
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174` — the merit-ordering ruling; **the task that became its own proof case**
- [[tasks/reclaim-rules-block-budget-headroom]] — task `0130` — the rules-block compression pass, and the owner's ≥400 B standing headroom target
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — **ADR-037** — a skill rule binds a spawned worker unless the instruction relays a named owner ruling; the precedence ladder, complete, for the first time
- [[tasks/decide-whether-a-spawn-instruction-may-override-a-skill-rule]] — task `0158`, the investigation behind ADR-037
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162` — what *carry the approved plan verbatim* means: a **copy over a durable artifact**, never a recall over conversation state
- [[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] — task `0202` — the sprint driver now writes `<task-folder>/plan.md` at plan approval
