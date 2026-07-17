# fkit

**Layer**: shared
**Key files**: `claude/agents/fkit-*.md`, `claude/skills/fkit-*/SKILL.md`, `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, `install.sh`, `bin/release.mjs`

## Summary
fkit is a **team of seven role-scoped AI agents for software development** — producer, coder, reviewer, adversarial reviewer, architect, wiki librarian, and a "team room" lead — that a developer installs once and then runs inside their own project. It is **not an application**: no build step, no server, no database, no runtime state outside files, and no test suite.

The product thesis: AI coding assistants collapse product decisions, implementation, and review into one undifferentiated chat loop with **no separation of authority** — the same agent proposes a design, writes the code, and approves it. fkit's answer is a small team with **distinct authority**, coordinating over **files in git** rather than shared runtime state. This repository *is* the framework, and it dogfoods itself.

> **One runtime: Claude Code native + Codex** ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]). fkit formerly shipped on Omnigent; that runtime was **deleted in Sprint 2** — see [History](#history--fkit-formerly-ran-on-omnigent).

## Architecture

### The seven roles
Each role is one file — `claude/agents/fkit-<role>.md`: YAML frontmatter (`name`, `description`, `tools`, `color`, `initialPrompt`) plus a system prompt. There is no shared base class; each prompt restates its own boundaries.

| Agent | Authority |
|---|---|
| `fkit-producer` | Product & sprint planning, task briefs. **No source writes.** Never moves task files. |
| `fkit-coder` | **Sole source-write authority.** Plan-gated (`EnterPlanMode` / `ExitPlanMode`). |
| `fkit-architect` | Design specs, ADRs, surveys. **Never implements; never writes the wiki.** |
| `fkit-reviewer` | Review-only; writes **only** under `ai-agents/reviews/`. |
| `fkit-adversarial-reviewer` | Findings only. **Structurally write-free — a leaf.** Runs on Codex. |
| `fkit-wiki` | **Exclusive write gateway** for `ai-agents/wiki-vault/`. A leaf. |
| `fkit-lead` | The **team room** (menu 7). Routes; **does no work** — no Write/Edit. |

The **tool allowlist is harness-enforced** and is the strongest boundary in the system: the adversarial reviewer and the lead genuinely *cannot* write files. That is structural, not a request.

### The 21 skills
Skills (`claude/skills/fkit-*/SKILL.md`) are the durable, role-owned **procedures**; the agent prompts are the role's *character*. Every role-specific skill opens with a `⛔ Owner:` banner naming the one role allowed to run it. Only `fkit-query` carries no banner — it is universal by design.

| Owner | Skills |
|---|---|
| producer | `initiate-project`, `task-plan`, `task-done`, `task-cancelled`, `status` |
| coder | `plan-task`, `process-review`, `process-stateful-review` |
| architect | `survey-project`, `inspect`, `design-spec`, `evaluate-approach`, `record-decision` |
| reviewer | `review`, `stateful-review` |
| adversarial reviewer | `adversarial-review` |
| wiki | `wiki-ingest`, `wiki-lint`, `wiki-sync` |
| everyone | `team` (roster/signpost), `query` (read-only wiki reads) |

**Role→skill ownership is declared in exactly one place: `skills_for_role()`** — extracted into `claude/skills-for-role.sh` and read by both the launcher and the `PreToolUse` skill-ownership hook that now enforces it at any spawn depth ([[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]], [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]).

### Runtime topology — one process, one role, no orchestrator
There is no fkit daemon, no root agent, no session broker, no message bus. **Claude Code owns the session lifecycle**; fkit is a launcher and a set of prompts. Two roles at once means two terminal tabs — deliberately not automated. Role routing is an `if/else`: **no LLM sits in the path that decides which role you get.**

Sessions are **role-locked**, and cross-role work is a **consult**, never a role switch — see [[systems/role-locked-sessions]]. Install, the launcher, and self-update: [[systems/install-and-self-update]]. The Codex second opinion: [[systems/review-and-model-diversity]].

### Data model — everything is a file in git
There is no database. The **`ai-agents/` tree is the entire coordination state**: `knowledge-base/` (see [[systems/knowledge-base-structure]]), `sprints/`, `tasks/{backlog,done,cancelled}/`, `reviews/<task-id>.md`, and `wiki-vault/` (this wiki).

`reviews/<task-id>.md` is a **two-party ledger**, written by reviewer *and* coder. It is the loop-prevention memory: it carries decision state and **accepted residuals** across review rounds so settled tradeoffs are not re-litigated.

**Two more per-task, task-id-keyed record dirs are sanctioned** ([[decisions/adr-020-per-task-plan-and-worklog-artifacts]]), mirroring `reviews/` — written by the coder's autonomous ship-loop, git-tracked, retained by id, **not** moved by task-done and **not** wiki-ingested: `plans/<task-id>.md` (the owner-approved plan — the loop's autonomy boundary) and `worklogs/<task-id>.md` (the worklog + owner-decision log → finalized ready-for-done report). *(The loop itself is designed and owner-approved — [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — but not yet implemented; its skill is Sprint 2 task 53, backlog.)*

Generated and gitignored per project: `.fkit/settings/<role>.json` (the skill lockdown), `.fkit/interview` + `.fkit/intake.md`, `.fkit/tmp/adversarial-prompt.md`, and the fkit-managed `.claude/agents/fkit-*.md` + `.claude/skills/fkit-*/` copies.

## Gotchas / Known Issues
- **Edit `claude/`, never `.claude/`.** `claude/fkit-claude-init.sh` does an `rm -f` + `cp` of the `fkit-*` agents and skills on **every single launch**. An edit made in `.claude/` is silently destroyed — no warning, no diff.
- **Verification is partial, no longer absent.** *(Updated 2026-07-16.)* For most of fkit's life there was **zero** automated verification — the only check, `omnigent/validate-bundles.sh`, **died with the Omnigent removal**, and [[decisions/adr-003-ci-runs-validate-bundles]]'s CI never landed. **`claude/fkit-claude.sh` is now covered** by the launcher-contract suite (`npm test`) — the argv contract plus the 7×21 lockdown matrix ([[decisions/adr-014-how-fkit-tests-itself]], [[systems/testing-and-verification]]). **`install.sh` still has none, and there is still no `.github/`** — so the `curl | sh` entry point, the highest-blast-radius file in the repo, remains unverified. **The risk is reduced, not closed.**
- **Single-vendor concentration is accepted, not a defect.** There is no fallback runtime. A finding of the form *"fkit only runs on one vendor's CLI"* is [[decisions/adr-009-claude-code-native-is-the-only-runtime]], not a bug.
- **`fkit --resume` is gone** *(fixed 2026-07-13; this page previously described the live bug).* The blanket unrecognized-arg passthrough silently resumed *any* session — a coder session included — under the **lead's** lockdown: *the user got their conversation back and their role taken away, with no warning.* Removed by [[tasks/remove-fkit-resume-passthrough]]; a stray arg with no named role is now a **usage error**, and the removal is **pinned by a test**.
- **No agent commits or pushes unprompted.** A **prompt rule in every agent definition — not a sandbox.** It is the one place fkit's boundaries depend entirely on instruction-following.
- **No secrets in any artifact.** Nothing fkit produces may carry a credential — all of it goes to git.

## History — fkit formerly ran on Omnigent
fkit originally shipped as [Omnigent](https://omnigent.ai) agent bundles under `omnigent/`. [[decisions/adr-008-claude-code-native-port-alongside-omnigent]] added the Claude Code native port **alongside** it (dual-runtime, hand-mirrored); [[decisions/adr-009-claude-code-native-is-the-only-runtime]] superseded that and made Claude Code native + Codex the **only** runtime. `omnigent/` was deleted in Sprint 2 ([[tasks/sprint-2-remove-omnigent]]).

This is recorded because it explains things that would otherwise look arbitrary: why four retired verbs (`omnigent`, `claude`, `reconnect`, `restart-team`) **fail loudly** rather than being silently dropped; why self-update notifies rather than auto-updates; and why ADR-008 is kept rather than deleted — it is the record of *why fkit left Omnigent*.

## Open questions
1. ~~**Does the `PreToolUse` hook payload expose the calling subagent's identity?**~~ **Answered: yes** — verified against the running Claude Code binary (`agent_type`/`agent_id`, at any spawn depth). The consult-path skill boundary is now **structurally enforced**, not advisory: [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]], implemented by [[tasks/implement-pretooluse-skill-ownership-hook]]. See [[systems/role-locked-sessions]].
2. ~~**What is the intended verification story?**~~ **Answered** by [[decisions/adr-014-how-fkit-tests-itself]]: a black-box process contract at the repo root, zero devDeps, never shipped to consumers. **What remains open is narrower** — `install.sh` e2e and a CI workflow are deferred to Sprint 3, and *"does a red suite gate `Done`?"* is still an owner call.
3. ~~**Is `fkit --resume` worth keeping at all?**~~ **Answered: no.** The owner ruled **removal**, rejecting both of the coder's proposed fixes (*persist the role* / *require a role*). The question is **closed** — do not reopen it, and do not build a replacement.
4. ~~**What is the consent model for the one destructive act still on the table** — clearing the `.fkit/` Omnigent orphans?~~ **Answered: announce-only** (owner, 2026-07-17 — owner is currently fkit's only user; Omnigent-scoped, no precedent for future destructive ops). **Sprint 2 task 36 is unblocked** (still backlog). `.fkit/settings` is live lockdown state and must never be touched.

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
