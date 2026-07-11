# Sprint 1 — Ship the onboarding sequence

> ## 🔒 CLOSED — 2026-07-11. Superseded by [Sprint 2](../sprint-2.md).
>
> Sprint 1 was entirely **Omnigent-path work** and has no awareness of
> [ADR-008](../knowledge-base/decisions/adr-008-claude-code-native-port-alongside-omnigent.md) /
> [ADR-009](../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md) /
> [ADR-010](../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md). The
> owner ruled (2026-07-11) that fkit drops Omnigent and goes Claude Code native only; most of this
> sprint's premise died with that decision.
>
> **This plan is kept, not deleted — it is the record of what was attempted.** Everything below is
> historical. Do not pick up work from this file; see [Sprint 2](../sprint-2.md).
>
> **Disposition of its 12 backlog tickets** (per the [removal plan §E](../knowledge-base/plan-omnigent-removal-2026-07-11.md)):
> **5 cancelled** (died with Omnigent) · **2 closed as Done** (already complete in code, verified by
> the doc-drift audit) · **5 carried into Sprint 2** (runtime-independent; two of them rescoped).
> A blanket cancel would have dropped live work — see Sprint 2 §"Sprint 1 disposition" for the
> per-ticket reasoning.

**Goal:** fkit's near-term goal (per intake) is *"a user-friendly startup sequence and a few agents
with dedicated skills."* The six agents already exist; this sprint closes the loop on the startup
sequence itself — verify it actually works end-to-end for a new user, lock in the reliability work
already touched, and scope (don't yet build) the next layer of hardening. Skill-set expansion is
back in scope for this sprint (owner reversal, 2026-07-10 — supersedes the 2026-07-09 deferral
decision below). More broadly: Sprint 1 is the first draft of fkit, and the owner expects its scope
to keep shifting as work on it surfaces new priorities — treat this plan as actively evolving, not
fixed.

**Priority order this sprint** (owner-ranked): onboarding verification → consult-envelope doc →
CI tail task.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| ➡️ Moved to [Sprint 2](../sprint-2.md) — priority 7 (reframed) | 1 | Verify onboarding flow end-to-end | [`verify-onboarding-flow-end-to-end.md`](../tasks/backlog/verify-onboarding-flow-end-to-end.md) |
| ⛔ Cancelled (2026-07-11) | 2 | Document the consult-chain envelope — the Claude 2-hop consult envelope is now recorded in ADR-010 | [`document-consult-chain-envelope.md`](../tasks/cancelled/document-consult-chain-envelope.md) |
| ⛔ Cancelled (2026-07-11) | 3 | Add CI: run validate-bundles.sh — `validate-bundles.sh` is deleted with Omnigent (ADR-009) | [`add-ci-validate-bundles.md`](../tasks/cancelled/add-ci-validate-bundles.md) |
| ✅ Done | 4 | Replace leftover placeholder text in CLAUDE.md / AGENTS.md | [`fix-claude-agents-md-placeholder-text.md`](../tasks/done/fix-claude-agents-md-placeholder-text.md) |
| ⛔ Cancelled (2026-07-11) | 5 | Remove eager auto-spawn of fkit-adversarial-reviewer at session start — `fkit-team` is deleted with Omnigent (ADR-009) | [`remove-adversarial-reviewer-eager-spawn.md`](../tasks/cancelled/remove-adversarial-reviewer-eager-spawn.md) |
| ➡️ Moved to [Sprint 2](../sprint-2.md) — priority 13 | 6 | Extend `initiate-project` to fill CLAUDE.md/AGENTS.md Project Overview | [`extend-initiate-project-fill-overview.md`](../tasks/backlog/extend-initiate-project-fill-overview.md) |
| ➡️ Moved to [Sprint 2](../sprint-2.md) — priority 12 (rescoped) | 7 | Bake Architecture pointer into scaffold CLAUDE.md/AGENTS.md templates | [`bake-architecture-pointer-into-scaffold-templates.md`](../tasks/backlog/bake-architecture-pointer-into-scaffold-templates.md) |
| ⛔ Cancelled (2026-07-11) | 8 (optional) | Fix stale agent-count docs + fresh-detection duplication — the drifted files are deleted, not fixed (ADR-009) | [`fix-agent-count-doc-drift-and-fresh-detection-dup.md`](../tasks/cancelled/fix-agent-count-doc-drift-and-fresh-detection-dup.md) |
| ✅ Done | 9 | Build `fkit reconnect` tooling for disconnected subagent runners | [`build-fkit-reconnect-tooling.md`](../tasks/done/build-fkit-reconnect-tooling.md) |
| ⛔ Cancelled (2026-07-11) | 10 | Amend the subagent-disconnect incident doc with technical corrections — an Omnigent-runner incident; doc archived to `history/` (ADR-009) | [`amend-subagent-disconnect-incident-doc.md`](../tasks/cancelled/amend-subagent-disconnect-incident-doc.md) |
| ➡️ Moved to [Sprint 2](../sprint-2.md) — priority 9 | 11 | Formalize knowledge-base folder structure, including `incidents/` | [`formalize-knowledge-base-incidents-folder.md`](../tasks/backlog/formalize-knowledge-base-incidents-folder.md) |
| ✅ Done | 12 | Roll out ADR-004: fixed, role-based titles for consult spawns | [`rollout-adr-004-fixed-consult-titles.md`](../tasks/done/rollout-adr-004-fixed-consult-titles.md) |
| ✅ Done | 13 | Give every fkit agent direct wiki-query access | [`give-every-agent-direct-wiki-query-access.md`](../tasks/done/give-every-agent-direct-wiki-query-access.md) |
| ➡️ Moved to [Sprint 2](../sprint-2.md) — priority 14 (scope widened) | 14 | Add a `task-plan` skill to fkit-producer | [`add-task-plan-skill-to-producer.md`](../tasks/backlog/add-task-plan-skill-to-producer.md) |

## Context

- **2026-07-10 skill-expansion-reversal addendum:** owner reversed the 2026-07-09 decision to defer
  skill-set expansion past Sprint 1 — it's back in scope. Rationale given: Sprint 1 is the first
  draft of fkit, and it's expected to be a chaotic, adaptive sprint where scope keeps shifting as the
  owner and agents learn what's needed, rather than a locked-scope sprint. No dedicated ADR or wiki
  decision page existed for the original deferral (checked via fkit-wiki; the only record was this
  plan's own text, now updated) — nothing else needs correcting for consistency. No skill-expansion
  task briefs exist yet; the owner has not yet specified which skills to add for which agents, so none
  are added to the Status table in this pass. Next step once the owner scopes specific
  skill-expansion work: write task briefs and slot them into the Status table above.
- **2026-07-10 first skill-expansion brief addendum:** owner scoped the first concrete
  skill-expansion item — a `task-plan` skill for fkit-producer itself, formalizing (into a
  `task-done`/`task-cancelled`-style skill) the create leg of the task lifecycle: take a task
  description, plan it into a properly-formatted brief, file it to `ai-agents/tasks/backlog/`, and
  slot it into a named sprint's Status table if one is mentioned, or leave it unsprinted
  (`Backlog (unsprinted)`) if not. Landed as priority 14 (appended after the owner's original 1–13
  ranking, flag for owner confirmation before treating as locked, same convention as priorities
  6–13). fkit-wiki confirmed this is genuinely greenfield — no prior ADR/wiki page named a
  `task-plan` skill or formalized producer skill-authoring beyond the three existing skills' own
  source precedent — and surfaced that `Backlog (unsprinted)` is already a `## Sprint` value the
  mover skills recognize but no live brief has ever used; this task will be the first to exercise
  that path. See [`add-task-plan-skill-to-producer.md`](../tasks/backlog/add-task-plan-skill-to-producer.md)
  for full scope, including one open question flagged for the owner before fkit-coder starts (does
  "plan the task" mean one brief in/one brief out, or something richer like sub-task breakdown).
- **2026-07-10 Agents-panel-noise addendum:** owner flagged Web UI panel clutter from ad hoc
  consult children (8+ one-off topic-titled sessions from a single producer↔architect
  conversation). Investigation (source-grounded against installed Omnigent 0.4.0) found neither
  `sys_session_close` nor `archived` actually declutters the panel — only reducing distinct titles
  created does. Landed as [`ADR-004`](../knowledge-base/decisions/adr-004-fixed-role-based-titles-for-consult-spawns.md)
  (fixed `<target-agent>-consult` titles, reused across topics), with task 12 as its rollout. While
  investigating a related idea (give every agent direct wiki-query access instead of spawning
  fkit-wiki per lookup — task 13), the investigation itself (a 2-hop producer→architect→fkit-wiki
  consult) hit a live, concrete instance of the exact reliability gap `document-consult-chain-envelope.md`
  (priority 2) exists to catch: a child leg completed cleanly but never woke its parent to relay the
  result, stalling silently until manually nudged, and recurring even after the nudge. That
  incident is itself supporting evidence for task 13, folded into its context. Flag for owner
  confirmation before treating priorities 12–13 as locked, per the same out-of-band-addition
  convention as priorities 6–11 above.
- **2026-07-10 incident addendum:** all six `fkit-team` teammate runners disconnected simultaneously
  and required manual CLI/API recovery — see
  [`ai-agents/knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md`](../knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md).
  fkit-architect confirmed the root causes (runner death, `sys_session_list`/`sys_agent_list`
  visibility, missing reconnect tool, non-TTY CLI crash) are all upstream Omnigent platform bugs, not
  fixable in this repo — those stay addressed to the Omnigent tech team via the incident doc itself.
  Tasks 9–11 (appended after the owner's original 1–8 ranking, flag for owner confirmation before
  treating as locked) cover what *is* actionable here: task 9 builds a client-side mitigation script
  so a repeat doesn't require rediscovering the recovery recipe by hand; task 10 folds in three small
  technical corrections the architect flagged in the incident doc itself; task 11 formalizes the
  knowledge-base folder structure (fkit-wiki confirmed no prior `incidents/`/`runbooks` convention
  existed) so `incidents/` doesn't accumulate inconsistent write-ups the way `decisions/` did before
  ADRs got a naming convention. Not folded into this addendum: filing the incident upstream with the
  Omnigent maintainers — that's an owner action (external repo/account), not a task any fkit agent can
  execute; the incident doc itself is already written to serve as that handoff input.
- **2026-07-10 addendum:** fkit-architect relayed six findings from a follow-up inspection +
  owner conversation. Three warranted new task briefs (priorities 6–8, appended after the owner's
  original 1–3 ranking, not inserted into it — flag for owner confirmation before treating as
  locked): tasks 6–7 close the *systemic* version of the recurrence behind task 4 (task 6 edits
  `initiate-project` itself so CLAUDE.md/AGENTS.md's Project Overview never goes stale again on
  future projects; task 7 bakes the Architecture pointer directly into the scaffold template, closing
  that half permanently with no process step needed at all). Task 8 is explicitly optional/cosmetic
  per the architect. The remaining three findings needed no new task: the consult-chain-envelope
  scope got sharper (no change to task 2's brief needed), `sandbox.write_paths` is already an explicit
  sprint deferral below, and `fkit.sh`'s self-update integrity gap is a forward-looking note only
  (already in `architecture.md`, revisit once fkit has real external users).
- **Note on task 5 / task 8 interaction:** task 5 (landed concurrently with this addendum, from a
  separate conversation) drops `adversarial-reviewer` from `fkit-team`'s standing roster, reducing the
  eagerly-spawned bootstrap set from six to five. If/when task 5 ships, the "six teammates" wording in
  `omnigent/fkit.sh` and `omnigent/README.md` (currently accurate) will need the same five/six update
  task 5's brief already applies to `fkit-team/config.yaml`. Not folded into task 8 now since task 5
  hasn't shipped yet — flagging so whoever picks up task 8 checks task 5's status first.

- This repo dogfoods fkit on itself; this producer session is the *first* run of
  `initiate-project`, which is now complete — `PROJECT.md` and `architecture.md` are written,
  three ADRs recorded (`ai-agents/knowledge-base/decisions/`).
- The owner flagged (2026-07-09) that several onboarding pieces have had recent fixes applied in a
  separate working session — a launch/tty fix, browser-open behavior, and the terminal intake
  script — but **none of it has been confirmed working end-to-end in a real terminal yet**. That
  confirmation is this sprint's top priority, not new feature work.
- Architecture survey flagged (and the owner then scoped down) a reliability question about deep
  multi-hop agent consultation under fully headless runs. Corrected framing: onboarding itself is
  interactive and only uses verified one-hop consults, so it is **not** blocked by this — but the
  envelope (what's verified vs. not) isn't written down anywhere yet, and should be before anyone
  builds a headless automation flow (e.g. CI-driven review chains) on top of it.
- `ai-agents/knowledge-base/decisions/adr-003-ci-runs-validate-bundles.md` decided CI is wanted;
  this sprint includes the implementation task.

## Not in this sprint (explicitly deferred)

- `sandbox.write_paths` / structural enforcement of agent role boundaries (named risk in
  `architecture.md`, no timeline set yet).
- A `bin`-based `npx fkit` installer (deferred per ADR-001).

## Notes

No task in this sprint has been assigned an owner-agent session yet — these are backlog briefs ready
to be picked up. Nothing in this sprint has been committed to git; all initiation artifacts
(`PROJECT.md`, `architecture.md`, ADRs, this plan, the task briefs) are working-tree only pending
owner review.
