# Sprint 1 — Ship the onboarding sequence

**Goal:** fkit's near-term goal (per intake) is *"a user-friendly startup sequence and a few agents
with dedicated skills."* The six agents already exist; this sprint closes the loop on the startup
sequence itself — verify it actually works end-to-end for a new user, lock in the reliability work
already touched, and scope (don't yet build) the next layer of hardening. Skill-set expansion is
explicitly deferred past this sprint (owner decision, 2026-07-09).

**Priority order this sprint** (owner-ranked): onboarding verification → consult-envelope doc →
CI tail task.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔲 Backlog | 1 | Verify onboarding flow end-to-end | [`verify-onboarding-flow-end-to-end.md`](../tasks/backlog/verify-onboarding-flow-end-to-end.md) |
| 🔲 Backlog | 2 | Document the consult-chain envelope | [`document-consult-chain-envelope.md`](../tasks/backlog/document-consult-chain-envelope.md) |
| 🔲 Backlog | 3 | Add CI: run validate-bundles.sh | [`add-ci-validate-bundles.md`](../tasks/backlog/add-ci-validate-bundles.md) |
| ✅ Done | 4 | Replace leftover placeholder text in CLAUDE.md / AGENTS.md | [`fix-claude-agents-md-placeholder-text.md`](../tasks/done/fix-claude-agents-md-placeholder-text.md) |
| 🔲 Backlog | 5 | Remove eager auto-spawn of fkit-adversarial-reviewer at session start | [`remove-adversarial-reviewer-eager-spawn.md`](../tasks/backlog/remove-adversarial-reviewer-eager-spawn.md) |
| 🔲 Backlog | 6 | Extend `initiate-project` to fill CLAUDE.md/AGENTS.md Project Overview | [`extend-initiate-project-fill-overview.md`](../tasks/backlog/extend-initiate-project-fill-overview.md) |
| 🔲 Backlog | 7 | Bake Architecture pointer into scaffold CLAUDE.md/AGENTS.md templates | [`bake-architecture-pointer-into-scaffold-templates.md`](../tasks/backlog/bake-architecture-pointer-into-scaffold-templates.md) |
| 🔲 Backlog | 8 (optional) | Fix stale agent-count docs + fresh-detection duplication | [`fix-agent-count-doc-drift-and-fresh-detection-dup.md`](../tasks/backlog/fix-agent-count-doc-drift-and-fresh-detection-dup.md) |
| 🔲 Backlog | 9 | Build `fkit reconnect` tooling for disconnected subagent runners | [`build-fkit-reconnect-tooling.md`](../tasks/backlog/build-fkit-reconnect-tooling.md) |
| 🔲 Backlog | 10 | Amend the subagent-disconnect incident doc with technical corrections | [`amend-subagent-disconnect-incident-doc.md`](../tasks/backlog/amend-subagent-disconnect-incident-doc.md) |
| 🔲 Backlog | 11 | Formalize knowledge-base folder structure, including `incidents/` | [`formalize-knowledge-base-incidents-folder.md`](../tasks/backlog/formalize-knowledge-base-incidents-folder.md) |

## Context

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

- Expanding or polishing the six agents' skill sets (owner: after onboarding is solid).
- `sandbox.write_paths` / structural enforcement of agent role boundaries (named risk in
  `architecture.md`, no timeline set yet).
- A `bin`-based `npx fkit` installer (deferred per ADR-001).

## Notes

No task in this sprint has been assigned an owner-agent session yet — these are backlog briefs ready
to be picked up. Nothing in this sprint has been committed to git; all initiation artifacts
(`PROJECT.md`, `architecture.md`, ADRs, this plan, the task briefs) are working-tree only pending
owner review.
