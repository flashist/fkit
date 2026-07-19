# fkit

**Layer**: shared
**Key files**: `claude/agents/fkit-*.md`, `claude/skills/fkit-*/SKILL.md`, `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, `install.sh`, `bin/release.mjs`

## Summary
fkit is a **team of seven role-scoped AI agents for software development** — producer, coder, reviewer, adversarial reviewer, architect, wiki librarian, and a "team room" lead — that a developer installs once and then runs inside their own project. It is **not an application**: no build step, no server, no database, no runtime state outside files, and no test suite.

> ⚠️ **An eighth role is decided but not built.** [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] (2026-07-19) authorizes a **tester** seat and **explicitly reverses** the owner's own *"seven roles, not breadth"* constraint. **Verified 2026-07-19: `claude/agents/` holds seven files** — no tester agent, skill, lockdown entry or launcher wiring exists, and the ADR sequences all of it behind an unfinished CI gate. **Seven is the tree; eight is the plan.** `PROJECT.md:8`, `:71-72`, `architecture.md:4`, `:82` and a hard-coded literal at `claude/fkit-claude-init.sh:847` still assert seven and are **now false** — an owner/producer follow-up, not the wiki's to fix.

The product thesis: AI coding assistants collapse product decisions, implementation, and review into one undifferentiated chat loop with **no separation of authority** — the same agent proposes a design, writes the code, and approves it. fkit's answer is a small team with **distinct authority**, coordinating over **files in git** rather than shared runtime state. This repository *is* the framework, and it dogfoods itself.

> **One runtime: Claude Code native + Codex** ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]). fkit formerly shipped on Omnigent; that runtime was **deleted in Sprint 2** — see [History](#history--fkit-formerly-ran-on-omnigent).

## Architecture

### The seven roles *(built; an eighth is authorized — see the note above)*
Each role is one file — `claude/agents/fkit-<role>.md`: YAML frontmatter (`name`, `description`, `tools`, `color`, `initialPrompt`) plus a system prompt. There is no shared base class; each prompt restates its own boundaries.

| Agent | Authority |
|---|---|
| `fkit-producer` | Product & sprint planning, task briefs. **No source writes.** Never moves task files. |
| `fkit-coder` | **Sole source-write authority.** Plan-gated (`EnterPlanMode` / `ExitPlanMode`). |
| `fkit-architect` | Design specs, ADRs, surveys. **Never implements; never writes the wiki.** |
| `fkit-reviewer` | Review-only; writes **only** under `ai-agents/reviews/`. |
| `fkit-adversarial-reviewer` | Findings only. **Structurally write-free — a leaf.** Runs on Codex. |
| `fkit-wiki` | **Exclusive write gateway** for `ai-agents/wiki-vault/`. A leaf. |
| `fkit-lead` | The **team room** (menu 7). Routes; **does no work** — a prompt contract since ADR-022 (its no-Write/Edit tool wall is gone). |

**The tool-allowlist posture was deliberately reversed on 2026-07-18** ([[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]], implemented by [[tasks/relax-tool-allowlists-except-adversarial-reviewer]]): the six Claude-side agents now carry **no `tools:` line at all** — they inherit every Claude Code tool (`WebSearch`, `LSP`, `AskUserQuestion`, …) — and role separation for them rests on **prompts + the skill hook**, accepted knowingly. **Exactly one structural tool wall remains, and it is deliberate: the adversarial reviewer's** (`Read, Grep, Glob, Bash, Skill` — no Write/Edit/Agent), which keeps *"the second opinion never touched the code it judges"* a structural fact at any spawn depth. *(The doc refresh, Sprint 2 task 58, is now **Done** — [[tasks/refresh-architecture-docs-for-tool-relaxation]]; verified 2026-07-19, the "strongest boundary in the system" language is gone from `architecture.md`, `PROJECT.md` and `CLAUDE.md`.)*

⚠️ **A tension worth naming, because the next ADR walks into it.** The one surviving tool wall exists because unrestricted tools were judged **unacceptable for one role** — yet [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] authorizes a tester whose entire justification is a **deliberately unhardened, network- and write-enabled envelope**, and declines to bound it. ADR-028 records this tension against itself rather than resolving it.

### The 24 skills
Skills (`claude/skills/fkit-*/SKILL.md`) are the durable, role-owned **procedures**; the agent prompts are the role's *character*. Every role-specific skill opens with a `⛔ Owner:` banner naming the one role allowed to run it. Only `fkit-query` carries no banner — it is universal by design.

| Owner | Skills |
|---|---|
| producer | `initiate-project`, `task-brief` *(renamed from `task-plan`, [[tasks/rename-task-plan-skill-to-task-brief]])*, `task-done`, `task-cancelled`, `status` |
| coder | `plan-task`, `process-review`, `process-stateful-review`, `task-ship-loop` *([[tasks/implement-task-ship-loop-skill]])* |
| architect | `survey-project`, `inspect`, `design-spec`, `evaluate-approach`, `record-decision` |
| reviewer | `review`, `stateful-review` |
| adversarial reviewer | `adversarial-review` |
| wiki | `wiki-ingest`, `wiki-lint`, `wiki-sync` |
| everyone | `team` (roster/signpost), `query` (read-only wiki reads) |
| the six Claude-side roles *(all but the adversarial reviewer)* | `open-questions-interview` — interview the owner on what this session left unanswered ([[tasks/add-open-questions-interview-skill-for-six-roles]]) · `dumb-down` — re-explain the last answer in plain language ([[tasks/add-dumb-down-skill-for-six-roles]]) |

**The adversarial reviewer is excluded from both new skills for a structural reason, not a preference:** it reviews on Codex under a restricted allowlist (ADR-022) and has **no owner channel**. This is the task-39 finding applied — *"all agents" excluding the second model is the structural reality.*

**Role→skill ownership is declared in exactly one place: `skills_for_role()`** — extracted into `claude/skills-for-role.sh` and read by both the launcher and the `PreToolUse` skill-ownership hook that now enforces it at any spawn depth ([[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]], [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]).

### Runtime topology — one process, one role, no orchestrator
There is no fkit daemon, no root agent, no session broker, no message bus. **Claude Code owns the session lifecycle**; fkit is a launcher and a set of prompts. Two roles at once means two terminal tabs — deliberately not automated. Role routing is an `if/else`: **no LLM sits in the path that decides which role you get.**

Sessions are **role-locked**, and cross-role work is a **consult**, never a role switch — see [[systems/role-locked-sessions]]. Install, the launcher, and self-update: [[systems/install-and-self-update]]. The Codex second opinion: [[systems/review-and-model-diversity]].

### Data model — everything is a file in git
There is no database. The **`ai-agents/` tree is the entire coordination state**: `knowledge-base/` (see [[systems/knowledge-base-structure]]), `sprints/`, `tasks/{backlog,done,cancelled}/`, `reviews/<task-id>.md`, and `wiki-vault/` (this wiki).

`reviews/<task-id>.md` is a **two-party ledger**, written by reviewer *and* coder. It is the loop-prevention memory: it carries decision state and **accepted residuals** across review rounds so settled tradeoffs are not re-litigated.

**Two more per-task, task-id-keyed record dirs are sanctioned** ([[decisions/adr-020-per-task-plan-and-worklog-artifacts]]), mirroring `reviews/` — written by the coder's autonomous ship-loop, git-tracked, retained by id, **not** moved by task-done and **not** wiki-ingested: `plans/<task-id>.md` (the owner-approved plan — the loop's autonomy boundary) and `worklogs/<task-id>.md` (the worklog + owner-decision log → finalized ready-for-done report). *(The loop is now **built and live** — [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]], implemented by [[tasks/implement-task-ship-loop-skill]].)*

Generated and gitignored per project: `.fkit/settings/<role>.json` (the skill lockdown), `.fkit/interview` + `.fkit/intake.md`, `.fkit/tmp/adversarial-prompt.md`, and the fkit-managed `.claude/agents/fkit-*.md` + `.claude/skills/fkit-*/` copies.

## Gotchas / Known Issues
- **Edit `claude/`, never `.claude/`.** `claude/fkit-claude-init.sh` does an `rm -f` + `cp` of the `fkit-*` agents and skills on **every single launch**. An edit made in `.claude/` is silently destroyed — no warning, no diff.
- **`prove-red.sh` now runs on every `npm test`** *(corrected 2026-07-19)* — ADR-026 Decision 4's gate shipped on 2026-07-18, though **the ADR itself, dated the next day, still says it hasn't**; see the LINT WARNING on [[systems/testing-and-verification]]. The mutation-testing-library question is **closed**: no library can mutate shell ([[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]). Still open: R2's **no-op-mutation** mode, which the gate does not catch.
- **Six fkit-authored files are drifted between the live tree and the shipped scaffold** — new projects receive stale copies of `ai-agents/README.md` and four conventions. A convention now governs this; the reconciliation and parity test are scoped, not built ([[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]).
- **Verification is partial, no longer absent.** *(Updated 2026-07-16.)* For most of fkit's life there was **zero** automated verification — the only check, `omnigent/validate-bundles.sh`, **died with the Omnigent removal**, and [[decisions/adr-003-ci-runs-validate-bundles]]'s CI never landed. **`claude/fkit-claude.sh` is now covered** by the launcher-contract suite (`npm test`) — the argv contract plus the hook-wiring shape; the **per-role skill matrix moved to `test/skill-ownership-hook.test.js`** when task 43 retired the session-scoped 7×21 `skillOverrides` matrix ([[decisions/adr-014-how-fkit-tests-itself]], [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]], [[systems/testing-and-verification]]). **`install.sh` still has none, and there is still no `.github/`** — so the `curl | sh` entry point, the highest-blast-radius file in the repo, remains unverified. **The risk is reduced, not closed.**
- **Single-vendor concentration is accepted, not a defect.** There is no fallback runtime. A finding of the form *"fkit only runs on one vendor's CLI"* is [[decisions/adr-009-claude-code-native-is-the-only-runtime]], not a bug.
- **`fkit --resume` is gone** *(fixed 2026-07-13; this page previously described the live bug).* The blanket unrecognized-arg passthrough silently resumed *any* session — a coder session included — under the **lead's** lockdown: *the user got their conversation back and their role taken away, with no warning.* Removed by [[tasks/remove-fkit-resume-passthrough]]; a stray arg with no named role is now a **usage error**, and the removal is **pinned by a test**.
- **No agent commits or pushes unprompted.** A **prompt rule in every agent definition — not a sandbox.** It is the one place fkit's boundaries depend entirely on instruction-following. **Reaffirmed, not amended, on 2026-07-18**: the owner considered an eighth agent (`fkit-git`) with an agent-invocable `commit-push` skill, briefly ruled for it, then reversed within the same session — an agent that pushes whatever is uncommitted, unattended, is the highest-risk surface for leaking secrets to a remote. **fkit will not gain a commit/push agent** ([[decisions/adr-023-fkit-git-agent-is-not-built]]). *(ADR-023's "the team stays seven" is **no longer current** — a different eighth role was authorized the next day by [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]]. **The commit/push ruling itself is untouched**; only the count claim moved.)*
- ⚠️ **fkit has two roles that READ code and zero that RUN it — every review is static.** The reviewer admits it in its own output vocabulary: `fkit-review/SKILL.md:113` emits **`(validation-gated)`** — *"I read this and it looks right, but somebody has to actually run it"* — and *"did you test it?"* is a pure **coder self-report** (`fkit-coder.md:112-113`). [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] rules to close this with a **tester seat holding sandbox authority**, over the architect's and producer's recommendation. **Nothing is built**, so the hole is open today.
- ⚠️ **The task movers are NO LONGER owner-only** *(changed 2026-07-18 — this reverses a universal hard rule)*. [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] lets **any spawned agent** run `/fkit-task-done` and `/fkit-task-cancelled`, **including the coder closing its own task**. The architect recommended keeping the gate; the owner ruled against that recommendation knowingly. **What replaced the guarantee is not an equivalent:** an agent-closed move is supposed to carry a distinct `(agent-closed — not owner-verified)` marker, but the marker is **prose written by the same agent that performs the move**, with **no code path able to enforce it**, and git carries no authenticated trace (agents cannot commit, so the owner authors the commit). **Prevention is removed, with a labelling convention in its place** — treat a green board row as unverified unless a human looked at it.
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
