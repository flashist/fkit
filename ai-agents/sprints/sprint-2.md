# Sprint 2 — Remove Omnigent, land Claude-native as the only runtime

**Goal:** fkit is now a **Claude Code native + Codex** team, and only that. Sprint 2 executes the
removal of the Omnigent runtime end to end — extract what the Claude flavor still depends on, build
the one piece that's genuinely missing, rewrite the installer, delete `omnigent/`, and only *then*
rewrite the docs and the wiki against the reality that's left.

**Authorized by:** [ADR-009](../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md)
(Claude-native is the only runtime) and
[ADR-010](../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)
(role-locked sessions + skill lockdown).
**Technical sequence from:** [`2026-07-11-plan-omnigent-removal.md`](../knowledge-base/reports/2026-07-11-plan-omnigent-removal.md)
(fkit-architect). **Evidence:** [`2026-07-11-doc-drift-audit.md`](../knowledge-base/reports/2026-07-11-doc-drift-audit.md).

## ⚠️ The one thing that must not be got wrong

**`omnigent/` is load-bearing today.** The Claude flavor reads its scaffold at runtime, the installer
copies it, and `fkit update` routes through it. Deleting it first breaks the product three ways at
once.

The sequence is **extract → build → rewrite → delete**, and the phases are **genuinely ordered**.
Priority order below is not a preference — it is a dependency chain. **Task 5 (delete `omnigent/`) is
unsafe before tasks 1–4.**

The prize for holding the order: the docs (task 8) get written **once, against the post-removal
reality**, instead of correcting drift in files that are about to be `git rm`'d. **Do not fix
Omnigent-side doc drift** — its output would be a deletion.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| ✅ Done | 1 | Extract the shared scaffold into `claude/` *(Phase 0.1)* | [`extract-scaffold-into-claude.md`](../tasks/done/extract-scaffold-into-claude.md) |
| ✅ Done | 2 | Build self-update for the Claude path *(Phase 0.2)* | [`build-claude-self-update.md`](../tasks/done/build-claude-self-update.md) |
| ✅ Done | 3 | Make Codex a checked prerequisite *(Phase 0.3)* | [`make-codex-a-checked-prerequisite.md`](../tasks/done/make-codex-a-checked-prerequisite.md) |
| ✅ Done | 4 | Rewrite the installer for a single flavor *(Phase 1)* | [`rewrite-installer-single-flavor.md`](../tasks/done/rewrite-installer-single-flavor.md) |
| ✅ Done | 5 | Delete `omnigent/` *(Phase 2)* | [`delete-omnigent-directory.md`](../tasks/done/delete-omnigent-directory.md) |
| ✅ Done | 6 | Reconcile the skill-ownership source of truth *(Phase 3 — independent)* | [`reconcile-skill-ownership-source-of-truth.md`](../tasks/done/reconcile-skill-ownership-source-of-truth.md) |
| ✅ Done | 7 | Verify onboarding flow end-to-end *(the removal gate — PASSED, [evidence](../knowledge-base/reports/2026-07-12-onboarding-verification.md))* | [`verify-onboarding-flow-end-to-end.md`](../tasks/done/verify-onboarding-flow-end-to-end.md) |
| ✅ Done | 8 | Rewrite the docs against the post-removal reality *(Phase 4)* | [`rewrite-docs-post-omnigent.md`](../tasks/done/rewrite-docs-post-omnigent.md) |
| ✅ Done | 9 | Formalize the knowledge-base folder structure, incl. `incidents/` *(→ [ADR-013](../knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md))* | [`formalize-knowledge-base-incidents-folder.md`](../tasks/done/formalize-knowledge-base-incidents-folder.md) |
| ✅ Done | 10 | Knowledge-base hygiene after the removal *(Phase 5a)* | [`knowledge-base-hygiene-post-omnigent.md`](../tasks/done/knowledge-base-hygiene-post-omnigent.md) |
| ✅ Done | 11 | Wiki sync after the removal *(Phase 5b)* | [`wiki-sync-post-omnigent.md`](../tasks/done/wiki-sync-post-omnigent.md) |
| ✅ Done | 12 | Bake the Architecture pointer into the scaffold templates | [`bake-architecture-pointer-into-scaffold-templates.md`](../tasks/done/bake-architecture-pointer-into-scaffold-templates.md) |
| ✅ Done | 13 | Extend `initiate-project` to fill CLAUDE.md/AGENTS.md Project Overview | [`extend-initiate-project-fill-overview.md`](../tasks/done/extend-initiate-project-fill-overview.md) |
| ✅ Done | 14 | Add a `task-plan` skill to fkit-producer | [`add-task-plan-skill-to-producer.md`](../tasks/done/add-task-plan-skill-to-producer.md) |
| ✅ Done | 15 | Enforce the task status vocabulary in the source | [`enforce-task-status-vocabulary.md`](../tasks/done/enforce-task-status-vocabulary.md) |
| ✅ Done | 16 | Add a `status` skill to fkit-producer | [`add-status-skill-to-producer.md`](../tasks/done/add-status-skill-to-producer.md) |
| ✅ Done | 17 | Restore Claude Code plan mode in `/fkit-plan-task` *(regression — independent)* | [`restore-plan-mode-in-plan-task.md`](../tasks/done/restore-plan-mode-in-plan-task.md) |
| ✅ Done | 18 | Remove `fkit --resume` and the blanket arg-passthrough *(Omnigent scar tissue)* | [`remove-fkit-resume-passthrough.md`](../tasks/done/remove-fkit-resume-passthrough.md) |
| ✅ Done | 19 | Repair the knowledge-base paths in product source *(ADR-013 fallout)* | [`repair-knowledge-base-paths-in-product-source.md`](../tasks/done/repair-knowledge-base-paths-in-product-source.md) |
| ✅ Done | 20 | Design a version-to-version migration mechanism *(investigation — [findings](../knowledge-base/reports/2026-07-14-migration-mechanism.md); spawned 25–28)* | [`design-version-to-version-migration-mechanism.md`](../tasks/done/design-version-to-version-migration-mechanism.md) |
| ✅ Done | 21 | Repair the 6 broken task links in the closed Sprint 1 plan *(one-off cleanup)* | [`repair-broken-links-in-closed-sprint-plans.md`](../tasks/done/repair-broken-links-in-closed-sprint-plans.md) |
| ✅ Done | 22 | Stop the task movers rotting links in closed sprint plans *(the recurrence — the real bug)* | [`harden-task-movers-against-closed-sprint-link-rot.md`](../tasks/done/harden-task-movers-against-closed-sprint-link-rot.md) |
| ✅ Done | 23 | Add the launcher-contract test suite *(zero devDeps; **runner TBD** — [ADR-014](../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md))* | [`add-launcher-contract-smoke-script.md`](../tasks/done/add-launcher-contract-smoke-script.md) |
| ✅ Done | 24 | Stop agents asserting repo state they never checked *(a false instruction in both task movers, shipping to every project)* | [`stop-agents-asserting-unchecked-repo-state.md`](../tasks/done/stop-agents-asserting-unchecked-repo-state.md) |
| ✅ Done | 25 | Fix the scaffold — ship the KB folders its own README promises *(defect; 100% of new projects)* | [`fix-scaffold-knowledge-base-folders.md`](../tasks/done/fix-scaffold-knowledge-base-folders.md) |
| ✅ Done | 26 | Stop an init failure from bricking the launcher *(pre-existing defect)* | [`stop-init-failure-bricking-the-launcher.md`](../tasks/done/stop-init-failure-bricking-the-launcher.md) |
| ✅ Done | 27 | Refuse init on a weird `ai-agents/` — symlink / file-where-dir *(live DoS + silent-skip bugs; the write-outside hazard is **prospective** — see the 2026-07-14 correction)* | [`refuse-init-on-weird-ai-agents-state.md`](../tasks/done/refuse-init-on-weird-ai-agents-state.md) |
| ✅ Done | 28 | Make launch converge `ai-agents/` additively *(**"the migration"**)* | [`converge-ai-agents-additively-on-launch.md`](../tasks/done/converge-ai-agents-additively-on-launch.md) |
| ✅ Done | 29 | Add a shared instructions layer that every fkit agent reads *(investigation — [findings rev 2](../knowledge-base/reports/2026-07-14-shared-instructions-layer.md); spawned 30–32)* | [`add-shared-instructions-layer-for-all-agents.md`](../tasks/done/add-shared-instructions-layer-for-all-agents.md) |
| ✅ Done | 30 | Give Codex the universal hard rules it has never had *(**live defect** — the required second model runs with no floor)* | [`give-codex-the-universal-hard-rules.md`](../tasks/done/give-codex-the-universal-hard-rules.md) |
| ✅ Done | 31 | Merge an fkit-managed rules block into an **existing** `CLAUDE.md`/`AGENTS.md` *(the brownfield hole; **idempotent or it grows the file forever**)* | [`merge-fkit-rules-block-into-existing-root-context-files.md`](../tasks/done/merge-fkit-rules-block-into-existing-root-context-files.md) |
| ✅ Done | 32 | Add the "no secrets" rule to `fkit-lead.md` *(the 1 of 7 missing it — one line)* | [`add-no-secrets-rule-to-fkit-lead.md`](../tasks/done/add-no-secrets-rule-to-fkit-lead.md) |
| ✅ Done | 33 | Fix the headless menu-guard crash — `[ -r /dev/tty ]` never tests openability *(launcher defect against task-23 assertion 7's contract)* | [`fix-headless-menu-guard-crash.md`](../tasks/done/fix-headless-menu-guard-crash.md) |
| ✅ Done | 34 | Make `/fkit-task-done` flip the moved brief's own `## Status` header *(mover drift — sibling to task 22)* | [`task-done-flips-brief-own-status-header.md`](../tasks/done/task-done-flips-brief-own-status-header.md) |
| ✅ Done | 35 | Make `/fkit-task-cancelled` flip the moved brief's own `## Status` header *(same gap, `⛔ Cancelled` marker)* | [`task-cancelled-flips-brief-own-status-header.md`](../tasks/done/task-cancelled-flips-brief-own-status-header.md) |
| 🔲 Backlog | 36 | Remove the `.fkit/` Omnigent-orphan residue *(OQ5 resolved; the one destructive act — own owner gate; consent model ruled **announce-only** 2026-07-17 — unblocked)* | [`remove-fkit-omnigent-orphan-residue.md`](../tasks/backlog/remove-fkit-omnigent-orphan-residue.md) |
| 🔲 Backlog | 37 | Record a tombstone ADR for the shared-instructions reversal *(OQ6 resolved; owner: fkit-architect)* | [`record-shared-instructions-reversal-adr.md`](../tasks/backlog/record-shared-instructions-reversal-adr.md) |
| ✅ Done | 38 | Add a full-board switch (`full`) to `/fkit-status` *(skill-text only; owner: fkit-coder)* | [`add-full-board-switch-to-fkit-status.md`](../tasks/done/add-full-board-switch-to-fkit-status.md) |
| ✅ Done | 39 | Investigate making `AskUserQuestion` available to fkit agents *(investigation — [findings](../knowledge-base/reports/2026-07-17-askuserquestion-availability-for-agents.md); spawned [ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md); owner: fkit-architect)* | [`investigate-askuserquestion-availability-for-agents.md`](../tasks/done/investigate-askuserquestion-availability-for-agents.md) |
| ✅ Done | 40 | Design the deterministic dashboard generator for `/fkit-status` *(design — [spec](../knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md); spawned [ADR-017](../knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md))* | [`design-deterministic-dashboard-for-fkit-status.md`](../tasks/done/design-deterministic-dashboard-for-fkit-status.md) |
| ✅ Done | 41 | Build the deterministic dashboard script and wire it into `/fkit-status` *(owner: fkit-coder; [review](../reviews/build-deterministic-dashboard-script-for-fkit-status.md) closed-out, rounds 1–6, residuals recorded)* | [`build-deterministic-dashboard-script-for-fkit-status.md`](../tasks/done/build-deterministic-dashboard-script-for-fkit-status.md) |
| ✅ Done | 42 | Reopen ADR-012 Decisions 3 & 4 — record the `PreToolUse` skill-gate hook decision *(live bug fix, phase 1/2; owner: fkit-architect)* | [`record-pretooluse-skill-gate-adr-amendment.md`](../tasks/done/record-pretooluse-skill-gate-adr-amendment.md) |
| ✅ Done | 43 | Implement the `PreToolUse` skill-ownership gate (the hook-flip) *(owner: fkit-coder; [review](../reviews/implement-pretooluse-skill-ownership-hook.md))* | [`implement-pretooluse-skill-ownership-hook.md`](../tasks/done/implement-pretooluse-skill-ownership-hook.md) |
| 🔲 Backlog | 44 | Remove the output variants from `/fkit-status` — one skill, one output *(**reverts task 38**; skill-text only; owner: fkit-coder)* | [`remove-output-variants-from-fkit-status.md`](../tasks/backlog/remove-output-variants-from-fkit-status.md) |
| 🔲 Backlog | 45 | Wiki sync after the `/fkit-status` output-variant removal *(needs 44 — hard; owner: fkit-wiki)* | [`wiki-sync-fkit-status-output-variant-removal.md`](../tasks/backlog/wiki-sync-fkit-status-output-variant-removal.md) |
| 🔲 Backlog | 46 | Investigate adopting a proper mutation-testing library, replacing hand-rolled `prove-red.sh` *(investigation; owner: fkit-architect; spawned from task-43 review finding R2)* | [`investigate-mutation-testing-library-adoption.md`](../tasks/backlog/investigate-mutation-testing-library-adoption.md) |
| ✅ Done | 47 | Record the "one skill, one output" convention *(OQ8 resolved — generalize; document only; owner: fkit-architect → [`conventions/one-skill-one-output.md`](../knowledge-base/conventions/one-skill-one-output.md))* | [`record-one-skill-one-output-convention.md`](../tasks/done/record-one-skill-one-output-convention.md) |
| 🔲 Backlog | 48 | Ship the one-skill-one-output convention in the scaffold *(closes the 4th live-vs-scaffold instance; owner: fkit-coder; independent — does not wait for 49)* | [`ship-one-skill-one-output-convention-in-scaffold.md`](../tasks/backlog/ship-one-skill-one-output-convention-in-scaffold.md) |
| 🔲 Backlog | 49 | Investigate dual-home parity — dogfood `ai-agents/` vs `claude/scaffold/` *(investigation — gates all parity implementation; owner: fkit-architect)* | [`investigate-dual-home-parity-live-vs-scaffold.md`](../tasks/backlog/investigate-dual-home-parity-live-vs-scaffold.md) |
| 🔲 Backlog | 50 | Rename the producer's `fkit-task-plan` skill to `fkit-task-brief` *(name collision with the coder's `fkit-plan-task`; atomic — dir + `skills-for-role.sh` + hook together; owner: fkit-coder)* | [`rename-task-plan-skill-to-task-brief.md`](../tasks/backlog/rename-task-plan-skill-to-task-brief.md) |
| 🔲 Backlog | 51 | Wiki sync after the `task-plan` → `task-brief` rename *(needs 50 — hard; 8 vault pages; owner: fkit-wiki)* | [`wiki-sync-task-plan-rename.md`](../tasks/backlog/wiki-sync-task-plan-rename.md) |
| ✅ Done | 52 | Design the coder's `task-ship-loop` skill *(design — [spec, rev 3, owner-approved](../knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md); spawns ADR-019/ADR-020; owner: fkit-architect)* | [`design-task-ship-loop-skill.md`](../tasks/done/design-task-ship-loop-skill.md) |
| ✅ Done | 53 | Implement the `task-ship-loop` skill from the approved design *(owner: fkit-coder; skill live, registered for coder, hook suite green)* | [`implement-task-ship-loop-skill.md`](../tasks/done/implement-task-ship-loop-skill.md) |
| ✅ Done | 54 | Grant the `AskUserQuestion` tool to the six Claude-side agents *(implements [ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md) Decision 4 / task 39 findings; tool grant, not a skill; owner: fkit-coder)* | [`grant-askuserquestion-tool-to-six-claude-agents.md`](../tasks/done/grant-askuserquestion-tool-to-six-claude-agents.md) |
| 🔲 Backlog | 55 | Design the `fkit-git` agent + commit/push consent model *(design — **collides with the "never commit" hard rule**; owner present for the ruling; owner: fkit-architect)* | [`design-fkit-git-agent-and-consent-model.md`](../tasks/backlog/design-fkit-git-agent-and-consent-model.md) |
| 🔲 Backlog | 56 | Implement the `fkit-git` agent + `commit-push` skill from the approved design *(needs 55 incl. owner approval — hard; owner: fkit-coder)* | [`implement-fkit-git-agent-and-commit-push.md`](../tasks/backlog/implement-fkit-git-agent-and-commit-push.md) |

## Dependency graph

```
1. scaffold ──────┐
2. self-update ───┼──→ 4. installer ──→ 5. delete omnigent/ ──→ 7. VERIFY ──→ 8. docs ──┐
3. codex req ─────┘                                                                      │
                                                          9. kb structure ──→ 10. kb hygiene ──→ 11. wiki sync
6. skill-ownership SoT ──(independent; any time)

12. arch pointer ──(needs 1)
13. initiate-project overview ──(independent)
14. task-plan skill ──(independent)
18. remove --resume ──(needs 2 and 4: they fix the verb set it must not break)
```

## Where the risk actually is

1. **Task 4, `install.sh`** — the `curl | sh` entry point, and **the blast radius of this sprint**.
   Breaking it breaks *installation itself*, including the self-update path that would ship the fix.
   **Must be verified by installing from a branch ref into a clean `$HOME`** — reading the diff is not
   verification for this file.
2. **Task 2, self-update** — **the only non-mechanical piece of the removal.** New code, not a move,
   and it sits in the startup path of every `fkit` invocation. It is also a **live bug fix**: bare
   `fkit` already runs the Claude flavor, which has *no update logic at all* — so every user on the
   default path has been silently stuck on whatever version they installed.
3. **Ordering** — task 5 before task 1 breaks Claude init, the installer, and `fkit update` at once.

## Context

- **Tasks 1–11 execute the architect's removal plan**, one task per phase, in his sequence.
  Tasks 12–14 are the Sprint 1 survivors (see below), appended after the removal work.
- **Task 7 is the release gate.** Sprint 2 rips out a runtime, rewrites the installer, and adds code
  to every startup. Nothing is "done" until a clean install → `fkit` → role session → consult →
  review passes on a clean machine.
- **Task 11 (wiki sync) is genuinely last.** Syncing before the docs are rewritten just ingests the
  drift into the vault — and then it's wrong in *two* places, with the vault carrying the authority of
  "verified knowledge."

## Sprint 1 disposition — the survivors

The owner's instinct to reset Sprint 1 was **mostly** right, but a blanket cancel would have dropped
live work. Per the removal plan §E, of Sprint 1's 12 backlog tickets:

- **5 die with Omnigent** → cancelled: `add-ci-validate-bundles` (its script is deleted),
  `amend-subagent-disconnect-incident-doc` (an Omnigent incident),
  `document-consult-chain-envelope` (the Claude 2-hop envelope is now recorded in ADR-010),
  `fix-agent-count-doc-drift-and-fresh-detection-dup` (those files are deleted),
  `remove-adversarial-reviewer-eager-spawn` (`fkit-team` is deleted).
- **2 were already complete in code** (verified in the audit) → closed as **Done**, not cancelled:
  `give-every-agent-direct-wiki-query-access`, `rollout-adr-004-fixed-consult-titles`.
- **5 are runtime-independent and still live** → **carried into Sprint 2**:
  - `verify-onboarding-flow-end-to-end` — **reframed.** Its premise (`.fkit/run`) died; its intent
    became the sprint's release gate (task 7).
  - `bake-architecture-pointer-into-scaffold-templates` — **rescoped** from `omnigent/scaffold/` to
    `claude/scaffold/CLAUDE.md`, which still carries the placeholder (task 12).
  - `extend-initiate-project-fill-overview` — `/fkit-initiate-project` still exists, still has the
    gap (task 13).
  - `add-task-plan-skill-to-producer` — **a real gap today**: the producer has `initiate-project` /
    `task-done` / `task-cancelled` but **no procedure for writing a task brief** — the thing it is
    most asked to do (task 14).
  - `formalize-knowledge-base-incidents-folder` — runtime-independent, and **task 10 depends on it**
    (`history/` / `incidents/` conventions must be settled before the archive pass) (task 9).

## Not in this sprint (explicitly deferred)

- **Fixing Omnigent-side doc drift, stale counts, or the `install.sh:42` `chmod` bug** — all deleted,
  not fixed.
- **Path-level hook enforcement of role boundaries** — deferred hardening, per ADR-010 §Options.
- **Building `npx fkit` / a `bin` entry** — still deferred. But **ADR-001 itself is now decided and
  needs to be superseded** — see below. That ADR write-up is the only ADR-001 work in scope.

## Owner decisions (2026-07-11) — both blocking questions resolved

- **Task 3 — Codex unreachable ⇒ emit a loudly-flagged partial**, *not* a hard fail (owner ruled
  against the architect's preflight-fail recommendation). The preflight warns; it does not wall.
  **The flag is now load-bearing:** the `NOT model-diverse / incomplete` marker must be the first
  thing a reader sees, because a partial review that reads like a complete one is precisely the
  failure this guards against. **Task 3 is unblocked.**
- **Task 14 — `task-plan` decomposes.** Owner's rule: *"all tasks should be split into the smallest
  possible shippable tasks — if a part can be developed, tested and shipped separately, it's worth a
  sub-task. Sometimes the producer decides alone; sometimes they consult the architect to clarify the
  technical scope."* The test is **independent shippability**, not size. Splits must carry their
  dependency links, or the split has lost information. **Task 14 is unblocked** and its scope widened
  accordingly.

- **Owner decision — `package.json` stays, with its `scripts` (2026-07-11).** This **supersedes
  [ADR-001](../knowledge-base/decisions/adr-001-package-json-stays-metadata-only.md)**, which is now
  wrong on all three of its load-bearing points. Owner's rationale: `package.json` **is in active use**,
  it **provides the project's versioning**, and npm publication stays open **under a changed, scoped
  name** (e.g. `@flashist/fkit`).

  Why ADR-001 could not simply stand:
  1. **The npm name `fkit` is taken.** It belongs to `nullobject/fkit` — an unrelated JS
     functional-programming toolkit at v3.4.1. This project has never been published to npm and
     **cannot be** under that name. ADR-001's rationale for keeping `package.json` (*"the npm listing
     has discoverability value"*) describes a listing **that does not exist** — and `npx fkit` today
     fetches *someone else's library*. Hence the owner's scoped-name ruling.
  2. **The `scripts` block is release tooling, not install semantics.** `bin/release.mjs` bumps,
     commits, tags, and pushes; it explicitly *"makes no npm-registry publish"*. There is still no
     `bin` field, so ADR-001's *spirit* (no `npx` install surface yet) survives — only its literal
     "no scripts" prohibition breaks, on a use it never contemplated. **The scripts stay.**
  3. **⚠️ ADR-001 actively conflicted with Sprint 2 task 2.** It instructs *"stop bumping the
     `version`."* But `version` is the **git-tag version**, and the self-update built in task 2 works
     off `git ls-remote` against those tags. **Following ADR-001 as written would have broken the
     self-update this sprint is building.** Version bumping is load-bearing release infrastructure,
     not an inert npm artifact. **It continues.**

  **Action:** fkit-architect records a new ADR superseding ADR-001, via `/fkit-record-decision`.
  Keep ADR-001's file (honest numbering), mark it superseded. Note that `package.json`'s
  `description` and `keywords` still say "Omnigent" — that cleanup already belongs to **task 5**.

## Addendum — task 17 added out of band (2026-07-11)

**Task 17 (`restore-plan-mode-in-plan-task`) was added after the sprint was planned**, from a defect
fkit-coder diagnosed and confirmed today: `/fkit-plan-task` **no longer enters Claude Code's plan
mode**. The Claude-native port (`627d5ea`) copied the Omnigent-era *prose-only* planning contract —
a workaround for a harness that lacked the tools — back into the Claude flavor, **which has them**.
The gate is a promise, not a wall. `claude/agents/fkit-coder.md` also omits `EnterPlanMode` /
`ExitPlanMode` from its allowlist, so **both** the skill and the allowlist must be fixed or neither
works.

- **It is numbered 17 to avoid renumbering the owner's ranking, not because it is low.** It has **no
  dependency on tasks 1–16** and is **recommended as the first thing picked up** — it repairs the
  planning gate that the rest of this sprint, including the high-risk `install.sh` rewrite (task 4),
  will be planned through.
- **Owner decisions on it are already made** (no session-wide plan default, **no hooks** — ADR-010's
  deferral stands — **no ADR**, and the model-initiated nature of the gate is an accepted residual).
  They are recorded in the brief. **Do not reopen them.**

## Addendum — task 18 added out of band (2026-07-11)

**Task 18 (`remove-fkit-resume-passthrough`) was added after the sprint was planned**, on the owner's
ruling: *"create a task for removing the `fkit --resume` thing (it was created to work around the
limitations and bugs of omnigent)."* It is **the same class of work as tasks 1–5** — Omnigent scar
tissue, removed rather than fixed. `--resume` existed for Omnigent's durable-root session model and its
runner disconnect bugs; a Claude-native role session is just `claude --agent fkit-<role>`, so the problem
it worked around is gone.

- **It is a removal, not a repair.** fkit-coder's earlier triage offered *persist the role* vs *require a
  role*. **The owner rejected both.** That framing is **closed** — do not reopen it, and do not build a
  replacement feature.
- **What actually goes** is the **blanket unrecognized-arg passthrough** in `claude/fkit-claude.sh`, which
  is what routes `fkit --resume` into the `:190` "no role → lead" default and silently resumes any session,
  coder included, under **lead's** lockdown. Doc-only removal would leave that live.
- **Sequenced after tasks 2 and 4**, which between them decide the wrapper's argv surface and where
  `fkit update` lives — the verb set task 18 must not break isn't final until they land. Numbered 18 for
  **append-don't-renumber** discipline. If the coder is already in `fkit-claude.sh` for task 4, landing it
  in the same pass is fine.

## Addendum — tasks 21 and 22 added out of band (2026-07-13)

**A repo-wide link sweep run during task 10 surfaced a pre-existing defect out of task 10's scope:**
`ai-agents/sprints/done/sprint-1.md` carries **6 broken links** (5 distinct tasks). Each is a
`➡️ Moved to Sprint 2` row still pointing at `tasks/backlog/…` for a task that has since been
completed into `tasks/done/`. fkit-coder found it, correctly did not fix it, and escalated.

**The 6 links are the symptom; the recurrence is the bug.** `/fkit-task-done` and
`/fkit-task-cancelled` update the *active* sprint plan but never re-point inbound links in a *closed*
one — so **every future completion of a carried-over task breaks one more link** in an older plan.
Notably, `fkit-task-done/SKILL.md` step 4 **already greps `ai-agents/sprints/` recursively and finds
these rows**; step 5 simply has no instruction for them, because a `➡️ Moved` row has no status to
flip. The skill sees the reference and drops it.

**Split into two tasks on purpose**, per the owner's independent-shippability rule:
- **21** is the one-off cleanup — uncontroversial, shippable today, independent of everything.
- **22** is the process fix — and it is **`🚧 Blocked` on an owner ruling**, not on any other task.

**Landing only 21 buys nothing durable**: the links rot again on the next carried-over completion.

## Addendum — tasks 25–28 added out of band (2026-07-14): the migration investigation's implementation

**Task 20's investigation is complete and the owner has reviewed it.** Findings:
[`reports/2026-07-14-migration-mechanism.md`](../knowledge-base/reports/2026-07-14-migration-mechanism.md)
(rev 2 — rev 1 went through an adversarial Codex pass and **did not survive intact**; two factual claims
were false and the headline changed). Tasks 25–28 are the implementation the owner greenlit. Per the
brief, the producer scopes these **only after** the review gate — which has now passed.

**The headline is not "build a migration mechanism."** It is: **fkit already converges every project on
every launch; `ai-agents/` is simply carved out of it.** Un-carving it — **additively** — is the fix.
There is no migration mechanism, no version walk, and nothing new for a user to run.

**Explicitly rejected, and not to be reintroduced:** the owner's `migration-current.md` +
`migration-X.Y.Z.md` semver-walk idea, a per-project version cursor, and a migration agent. Rejected as
**premature, not wrong** — the owner has acknowledged this. The strongest reason: **a version cursor
cannot survive a `git clone`**, because `.fkit/` is gitignored (`fkit-claude-init.sh:137`) — so a fresh
clone would replay every migration against an already-migrated tree. Report §6.

### The invariant — owner-ratified, and the thing to protect

> **Launch-time convergence NEVER writes to a path that already exists. Create-if-absent only. No
> overwrite, no move, no delete — ever — inside a user's `ai-agents/`.**

Every safety property in this design is downstream of that one line, and so is its one accepted
limitation (below). **The owner has also ratified the report's §8 safety bar as REQUIRED, not
optional:** non-fatal failure, refuse-on-weird-state, announce-what-you-did, an opt-out, and the
`.gitkeep` rule.

### Sequencing — the dependency is real, not a preference

```
25. scaffold fix ────────(independent; ship today; fixes NEW projects)
26. non-fatal init ──┐
                     ├──→ 28. additive convergence  (fixes EXISTING projects — "the migration")
27. weird-state gate ┘
```

- **25 and 26 are independent, unblocked, ship-today bug fixes.** Neither waits on anything.
- **27 is also a live bug on its own merits** — on two of its three cases. A **dangling** symlink makes
  `[ -e ]` false, `cp -R` **refuses** with rc=1, and `set -euo pipefail` kills init (which, before task
  26, **bricked the launcher**) — a denial-of-service bug. A **file** where the directory belongs makes
  `[ -e ]` true, so init skips **silently, forever**, and fkit never says so. Its third case — a **live**
  symlink, which `cp -R` genuinely *does* write through — is **unreachable today** because init skips it,
  and **task 28 is precisely what makes it reachable**. It is split out of 28 rather than folded into it
  so the hazard and its mitigation don't ship in the same commit, where a reviewer cannot tell them apart.
- **28 must not land before 26 and 27.** It makes the unattended, every-launch, project-mutating code
  path *more capable*; doing that while it can still brick the launcher, or while nothing yet stops a
  per-path write from going through a symlink, is exactly backwards.
- **25 and 28 are complementary:** 25 fixes what **new** projects receive; 28 carries that fix into
  **existing** ones. Neither alone is sufficient.

### Accepted residuals — decided, not overlooked

- **Content drift is deferred — a deliberate owner decision.** A scaffold-authored file whose *contents*
  drifted (this repo's `ai-agents/README.md` already has, in **both** directions) is a path that
  **already exists** — so the invariant **forbids** convergence from fixing it. **The safety and the
  limitation are the same property.** The report §3 costs the design that would fix it (a shipped
  hash-manifest keyed on content *identity*, not version order). **Re-raise when a third fkit-authored
  file starts drifting** — not before.
- **A renamed folder gets you both.** Rename `sprints/` to `iterations/` and convergence recreates
  `sprints/` alongside it. No stateless mechanism can know a rename happened. **Inherent limit — must be
  disclosed in the docs, not discovered by a user.**
- **The re-raise trigger, and it fires early:** the moment someone **proposes** a change that would
  move, rename, or delete content inside a consuming project's `ai-agents/`, this decision is **void and
  returns to the owner**. It fires on the *proposal*, not the implementation — because by the time a
  destructive migration is *written*, the wrong hook has already been chosen. **It does not get dropped
  into `fkit-claude-init.sh` as a one-off. Ever.**

### Not scoped — deliberately

The report's §9 **`.fkit/` Omnigent-orphan cleanup** (`.fkit/agents/`, `.fkit/run`, `.fkit/team-session`,
`.omnigent/`) has **no task and is not in this sprint.** The owner did not greenlight it. It is the one
**destructive** act in the report — an `rm -rf` in a user's project, with no rollback — and the report's
own rev-1 deletion list **wrongly included `.fkit/settings`, which is live ADR-010 lockdown state
rewritten on every launch** (`fkit-claude.sh:257-268`). A reviewer trusting that table would have shipped
a delete of live state. **It needs its own owner decision on the consent model before it is scoped.** See
open question 5.

## Correction (2026-07-14) — task 27's stated rationale was wrong, and shipped that way

**As first written, this addendum and task 27's brief both asserted — as established fact — that a
*dangling* `ai-agents` symlink makes today's `cp -R` "write the scaffold through the link, to a path
outside the project": a live, present-day write-outside-the-project bug.** It is not true, on any
platform.

- **fkit-coder could not reproduce it** on macOS/BSD `cp`: it refuses (`File exists`), rc=1, nothing
  written outside the project.
- **fkit-reviewer settled the Linux question in a Debian container:** **GNU coreutils 9.1 `cp -R` also
  refuses** (`cannot overwrite non-directory`), rc=1, the outside path is **never created**. **BusyBox
  refuses too.** Codex confirmed from the GNU manual that the historical write-through behavior on this
  case occurs only under `POSIXLY_CORRECT`.

**No live write-outside-the-project bug ever shipped.** What is real is stated above and in the brief:
a **denial-of-service** bug on the dangling symlink (rc=1 → `set -euo pipefail` → dead init → bricked
launcher, pre-task-26), a **silent-skip-forever** bug on a file-where-the-directory-belongs, and a
**prospective** write-through on a *live* symlink that **task 28 is what arms**.

**How it got here, recorded rather than smoothed over:** the claim entered
[`reports/2026-07-14-migration-mechanism.md`](../knowledge-base/reports/2026-07-14-migration-mechanism.md),
was carried into task 27's brief by the producer **without independent verification**, and was caught
only at **implementation and review** — the second false claim to come out of that report's lineage
(rev 1 lost two others to an adversarial Codex pass). **We did not know all along.** The lesson is the
cheap one: *a behavioral claim about a shell builtin or coreutil is a claim to run, not to reason
about* — and a brief that says "confirm the bug is real" **before** anyone has is a brief that has
already assumed its answer.

**Task 27 itself is unaffected and stands.** It is implemented, verified, and correct; only its stated
rationale was wrong, and it has been replaced with the true one. *(fkit-architect is separately
correcting the same claim in the migration report and checking ADR-015.)*

## Addendum — tasks 30–32 added out of band (2026-07-14): the shared-instructions investigation's implementation

**Task 29's investigation is complete and the owner has reviewed it.** Findings:
[`reports/2026-07-14-shared-instructions-layer.md`](../knowledge-base/reports/2026-07-14-shared-instructions-layer.md)
(**rev 2** — rev 1 went through an adversarial Codex pass, 17 findings, and **its recommendation did not
survive**; rev 2 **reverses** it). Tasks 30–32 are the implementation the owner greenlit. Per the brief,
the producer scopes these **only after** the review gate — which has now passed.

**The headline is not "build a shared instructions layer."** It is: **the layer already exists and
already ships** — the *"Universal hard rules (every role, every session)"* block in
`claude/scaffold/CLAUDE.md:56-63`, proven **3/3** (Claude Code 2.1.208) to reach **both** a session and a
spawned consult. **What is broken is its delivery, on two paths.** Nothing new gets built.

**The owner's original need is already met, today, with zero code:** to give every fkit agent a standing
instruction, he writes it in `CLAUDE.md`.

### Rejected — by the owner, by name, and not to be reintroduced

- **`ai-agents/AGENTS-COMMON.md` and the agent-file splice** (rev 1's recommendation). It **structurally
  cannot reach Codex** — the adversarial skill builds its own prompt and Codex never reads
  `.claude/agents/`. A "shared layer for **all** agents" that excludes the second model is misnamed. It
  also **silently depended on parked task 28** (its stub ships inside `ai-agents/`). Report §4.
- **`claude --append-system-prompt`.** **Session-only.** Two independent experiment designs, **0/3 then
  0/2** into a spawned consult, with a within-subject control that stayed live. The tombstone matters:
  it is the obvious idea, and the next person to have it must find the grave, not the trap. Report §5.
- **The "seven files have drifted" motivation. It collapsed.** The rule is present in **6 of 7** agent
  files — not 2 of 7 as task 29's brief claimed. Three counts were published, all three wrong, all three
  from grepping one phrasing of a *semantic* rule. **Lesson: read the files.** The real case for this work
  is holes 1 and 2 below, not the drift.
- **A single edit point for the owner's own instructions** — the owner declined to pursue it on other
  grounds. No task.

### The two real holes — and hole 2 is the find

- **Hole 2 → task 30. `codex exec --sandbox read-only --cd "$PWD"` means the codex CLI natively reads
  root `AGENTS.md`** (init's own comment says so, `fkit-claude-init.sh:9-10`) — **and
  `claude/scaffold/AGENTS.md` contains ZERO universal hard rules.** So does this repo's. **The one model
  [ADR-009](../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md) *requires* for
  independent, model-diverse review runs with no "never commit", no "no secrets", no "don't write the
  wiki."** A live defect, near-free to fix, **fix it regardless of everything else.**
- **Hole 1 → task 31.** Init leaves an existing `CLAUDE.md` **as-is** (`:64-65`), so **every brownfield
  project — i.e. every project that already used Claude Code — has received none of fkit's rules, ever.**
  And fkit has **no channel to ship a correction through**. Fix: a **marker-delimited, fkit-managed,
  idempotent** block merged into both root files.

### ⚠️ Idempotency is the load-bearing requirement in task 31

**Init runs on every launch.** A merge that appends would grow the user's `CLAUDE.md` **without bound,
one block per launch**. The block must be **replace-in-place** — same content, same position, byte-identical
on re-run. The brief says so and its verification proves it: **run init 3×, get exactly one block and an
identical checksum.**

**Task 31 is also the first fkit code that writes into a file the user already owned**, unattended, every
launch. Hence: everything outside the markers is untouched forever, malformed states **refuse** rather than
guess, `[ -L ]` **before** `[ -e ]` (task 27's lesson, second seam), all-or-nothing via temp+`mv`, and
**silence when nothing changed**.

### Sequencing

```
30. codex gets the rules ──→ 31. idempotent merge into existing root files
    (independent; ship first)     (needs 30's canonical text; NOT blocked by parked task 28)

32. fkit-lead "no secrets" ──(independent; any time)
```

- **Task 31 does NOT depend on parked task 28 — confirmed.** `CLAUDE.md`/`AGENTS.md` are **project-root**
  files handled by init **step 2** (`:62-75`), a **different seam** from the all-or-nothing `ai-agents/`
  guard (`:55-56`) that 28 is about. **31 ships with 28 still parked.** *(This is exactly what killed the
  splice: its delivery ran through `ai-agents/`.)*
- **30 → 31 is a soft dependency**: 30 lands the canonical rules text that 31 hoists into a single source.
  It could be done in one pass, but 30 is a live defect with a ten-minute fix and should not wait behind a
  mechanism change. **Accepted churn:** 31 re-cuts ~8 lines that 30 wrote.

### Delivery: structural. Compliance: advisory. Full stop.

This makes the rules **arrive**. It does **not** make them **enforced**. There are **zero hooks** in this
repo; **all seven agents hold `Bash`** and five hold `Write`/`Edit`. A rule in a context file is **prose
asking an agent to behave**. Report §6 is the *only* claim level in the report, and the sprint will not
carry a stronger one — the "structural, not by instruction" overclaim is what ADR-012 had to retrofit onto
ADR-010, and it is not being repeated here.

### Explicitly out of scope

- **Stripping the duplicated rules out of the seven agent files.** Owner asked for **additive only**, and
  with the drift motivation collapsed it is moot.
- **Hooks / tool-level enforcement.** ADR-010's deferral stands.
- **Anything requiring parked task 28.**

## Addendum — task 33 added out of band (2026-07-15): a launcher defect the task-23 suite caught

**Task 33 (`fix-headless-menu-guard-crash`) was added after task 23's launcher-contract suite went
red.** On a no-role, no-args invocation of an **initiated** project with **no controlling terminal**
(piped / CI / detached), the launcher **crashed instead of defaulting to the team room.** The menu
guard gated on `[ -r /dev/tty ]`, which tests the device node's permission bits (`access()`), **not**
whether `open()` succeeds — and `/dev/tty` is world-`rw` on macOS/Linux, so it read TRUE with no
controlling terminal. The branch was entered, `exec 3</dev/tty` failed ENXIO under `set -eu`, and the
`role="lead"` default below was **never reached.** The lead default — the launcher's "piped/CI → safe
default" promise — was **dead code on any normal system.**

- **It is a defect against an EXISTING contract, not a decision.** `fkit-claude.sh:462-464` and **task
  23's assertion 7** both already settle initiated-headless → lead. **No ADR.** fkit-architect confirmed
  the `access()`-vs-`open()` cause (2026-07-15 consult).
- **Fix (applied in the working tree):** swap `[ -r /dev/tty ]` at `:426` for an openability probe
  `( exec 3</dev/tty ) 2>/dev/null`, which returns 0 only if `open()` genuinely succeeds. Verified:
  headless→lead (exit 0), interactive menu still opens on a real pty, fresh→producer unchanged. Task
  23's assertion 7 flipped from `todo` to enforcing and passes.
- **Numbered 33 for append-don't-renumber discipline, not because it is low.** Its **priority intent
  sits with the task-23/24/28 launcher cluster** — task 23 is what caught it, and 23's assertion 7 is
  only truly enforcing once this lands. **Depends on nothing**; **can co-land with task 18's launcher
  pass.**
- **Status is `🔲 Backlog` on purpose:** the fix is **uncommitted and not yet independently reviewed.**
  It is **not Done** — that is owner-gated via `/fkit-task-done` after review.
- **Scope boundary:** the **FRESH-project** headless case (producer vs lead) is **untouched** — it
  remains **task 23's reserved open question 1.**

## Addendum — tasks 34 and 35 added out of band (2026-07-15): the task movers leave brief headers stale

**A `/fkit-status` run on 2026-07-15 surfaced standing board-vs-brief drift produced by the movers
themselves.** `/fkit-task-done` and `/fkit-task-cancelled` flip the sprint-plan Status cell and move
the brief, but **neither updates the moved brief's own `## Status` field** — so a brief in `done/`
still reads `🔲 Backlog` internally while the board reads `✅ Done`. Visible right now on tasks **23,
30, 31, 32, 33** (closed by the current mover) plus two non-Sprint-2 leftovers
(`build-fkit-reconnect-tooling.md`, `fix-claude-agents-md-placeholder-text.md`).

**This is the same class as task 22** — a mover updating one record of a task's state and silently
leaving another stale. Fix philosophy is identical: make the mover write *every* place the state lives.

**Split into two on the owner's independent-shippability rule:**
- **34** fixes `/fkit-task-done` (`✅ Done`).
- **35** fixes `/fkit-task-cancelled` (`⛔ Cancelled (YYYY-MM-DD) — <reason>`, with the extra
  requirement of reproducing the mandatory date+reason faithfully).

Neither depends on the other; each closes drift on its own mover. They share a design (idempotent
header write, flag-don't-invent a missing section) and **can co-land in one pass.**

**Scope boundary — not a backfill.** These prevent *new* drift. Reconciling the five already-drifted
briefs (23, 30, 31, 32, 33) and the two leftovers is a separate manual concern via deliberate edit —
**not** an in-skill historical sweep.

**No scaffold copy exists.** The mover skills live only in `claude/skills/`, not under
`claude/scaffold/`, so the canonical sources are `claude/skills/fkit-task-done/SKILL.md` and
`claude/skills/fkit-task-cancelled/SKILL.md`; the `.claude/` copies are gitignored and init-regenerated.

**Numbered 34/35 for append-don't-renumber discipline.** Owner to confirm the ranking.

## Addendum — tasks 36 and 37, and one unsprinted task, added out of band (2026-07-15): open-question dispositions

The owner's 2026-07-15 rulings on the open questions (below) spawned three briefs:

- **Task 36 — `remove-fkit-omnigent-orphan-residue.md`** (OQ5). The migration report's §9 `.fkit/`
  cleanup: the **one destructive act** in the whole migration design (`rm -rf` in a user's project, no
  rollback). Deliberately **not** folded into the additive-convergence work (25–28), which never deletes.
  **Depends on task 28** (met), and was blocked on an owner ruling on the consent model — **ruled
  2026-07-17: announce-only** (owner is currently fkit's only user; Omnigent-scoped only, no precedent
  for future destructive operations). **Unblocked.** Exhaustive target list — `.fkit/agents/`,
  `.fkit/run`, `.fkit/team-session`, `.omnigent/`; **`.fkit/settings` is live lockdown state and must
  never be touched** (the rev-1 report named it for deletion — the mistake this task's reference-check
  gate exists to catch).
- **Task 37 — `record-shared-instructions-reversal-adr.md`** (OQ6). Tombstone ADR for the
  shared-instructions reversal; rejects `AGENTS-COMMON.md` (cannot reach Codex) and
  `--append-system-prompt` (session-only, `0/3`→`0/2` on Claude Code 2.1.208) **by name**, with the
  version pinned. **Owner: fkit-architect**, via `/fkit-record-decision`. Depends on nothing.
- **Unsprinted — `gate-read-side-symlink-hazard-in-init.md`** (OQ7). The read-side counterpart to task
  27's write-side symlink guard. **Latent** (no code reads through `ai-agents/` today); tracked
  independently, per the owner, so it is not lost while task 28 is parked. Filed unsprinted.

**Numbered 36/37 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — task 38 added out of band (2026-07-16): the full-board switch

**Task 38 (`add-full-board-switch-to-fkit-status`) was scoped unsprinted, then pulled into Sprint 2 by
the owner (2026-07-16).** It adds a reserved `full` keyword (aliases `all` / `board`) that forces
`/fkit-status` to render the complete step-4 dashboard even on a repeat call, overriding the step-5
delta default. **Skill-text only** — `claude/skills/fkit-status/SKILL.md`, no scaffold copy, no launcher
or product code, no new skill registration.

- **Owner: fkit-coder.** **Depends on: nothing** — independent of the mover-drift tasks (34, 35) and
  everything else in Sprint 2.
- **Numbered 38 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — task 39 added out of band (2026-07-16): the AskUserQuestion investigation

**Task 39 (`investigate-askuserquestion-availability-for-agents`) was scoped unsprinted from the
owner's ask — *"make the `AskUserQuestion` skill available for all agents"* — then pulled into Sprint 2
by the owner (2026-07-16).**

**It is an investigation, and deliberately not the grant.** Three things established while scoping make
the seven-line version premature:

- **`AskUserQuestion` is a Claude Code *tool*, not a skill.** fkit gates skills via `skills_for_role()`
  / `skillOverrides` ([ADR-010](../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md),
  [ADR-012](../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md))
  and **tools** via the `tools:` frontmatter in `claude/agents/fkit-*.md`. Verified 2026-07-16: it is in
  **none** of the seven allowlists and nowhere in `claude/` — **no agent can use it today.**
- **Session-vs-consult behavior is unmeasured, with expensive precedent.** `--append-system-prompt`
  looked obviously inheritable and was **session-only — 0/3, then 0/2** into a spawned consult
  ([report rev 2](../knowledge-base/reports/2026-07-14-shared-instructions-layer.md), Claude Code
  2.1.208). Same seam. Per
  [`evidence-before-assertion`](../knowledge-base/conventions/evidence-before-assertion.md) (task 24),
  **this is a claim to run, not to reason about.**
- **"All agents" may be structurally false.** `fkit-adversarial-reviewer` reviews on **Codex**, which has
  no `AskUserQuestion` — the same shape as the rejected `AGENTS-COMMON.md` (*"a shared layer for all
  agents that excludes the second model is misnamed"*).

**⚠️ It collides with a designed constraint, not an oversight.** `claude/agents/fkit-producer.md:44` and
`claude/agents/fkit-architect.md:38` both instruct a spawned consult to return an open question **in its
reply rather than asking**. Granting the tool would let a consult interrogate the owner mid-chain —
**a change to the consult model (the two-hop envelope), which is an owner decision, not a tool toggle.**

- **Owner: fkit-architect**, with the **owner present** for the consult-model call. **Depends on:
  nothing. Blocks: any implementation of the grant** — no implementation brief until findings are
  reviewed (the task-20 / task-29 pattern; both of those rev-1 recommendations died to an adversarial
  Codex pass, and this report is recommended for the same).
- **Numbered 39 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 40 and 41 added out of band (2026-07-16): the deterministic dashboard

**The owner's ask — a "deterministic layer" for `/fkit-status`:** a script that renders the step-4
dashboard, invoked by the skill so its output is shown, **replacing the prose dashboard-description**.
Beats 1–6 stay LLM-driven. Scoped unsprinted (2026-07-16), then pulled into Sprint 2 by the owner.

**Split design-then-implement on the architect's advice** (consult, 2026-07-16), because the runtime and
output contract were unsettled **owner-facing** decisions — building against them unsettled is what the
split exists to prevent.

**The feasibility split that drives both tasks:** row cells, roll-up counts, drift *facts*, and four of
the six Next-step shapes (`closed`, `dead`, `in Sprint N`, `waiting on owner`) are **deterministic**.
**`ready` vs `after N` is NOT** — the `Depends on:` line is free text, naming dependencies by number, by
phase name, and by filename slug. It is the one column the skill already flags as *"the easiest place to
start making things up."*

- **Task 40 — design. `✅ Done`**, closed by the owner via `/fkit-task-done`. Deliverables landed:
  [the spec](../knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md)
  (all six items ruled) and
  [**ADR-017**](../knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md).
  Decisions: output contract = **one run, two delimited sections** (`BOARD` verbatim + `FACTS` narrated
  from — so the board and beats 2/6 cannot disagree); `ready`/`after N` **stays LLM** with a sentinel
  for underived cells, and **`Depends on:` is not touched**; runtime **bash**; placement
  `claude/skills/fkit-status/dashboard.sh`, invoked **`bash <path>`, never `./<path>`** (the exec bit
  does not survive the ship chain — ADR-017); test **yes**, `node --test` at repo root.
- **Task 41 — implement + wire. `🔲 Backlog`, and now genuinely unblocked** — 40's spec is the contract
  it builds against. **Kept as one unit** (script + wiring): a script with no wiring buys nothing, and
  the wiring needs the script.

**Numbered 40/41 for append-don't-renumber discipline — contiguous and in dependency order. Owner to
confirm the ranking.**

## Addendum — tasks 42 and 43 added out of band (2026-07-16): the coder→reviewer skill-gate bug

**A live bug surfaced today during ordinary use of Sprint 2 workflow, not from a task in progress:**
fkit-coder spawning `@fkit-reviewer` to run a stateful review failed with `Error: Skill
fkit-stateful-review is disabled for model invocation in skillOverrides settings`. Traced across
three fkit-coder ↔ fkit-architect consults today to the same mechanism
[ADR-012](../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md)
already found once: a spawned subagent inherits the *launching* session's `skillOverrides`, not its
own role's. ADR-012 hand-patched one instance of this (producer → architect, `fkit-survey-project`,
via `CONSULT_SKILLS`); coder → reviewer is the same class, unpatched, and it will keep recurring for
any other role pair.

**This is not a new decision — it is ADR-012's own re-raise trigger, now confirmed met.** ADR-012
Decision 4's residual-risk clause says to reopen Decisions 3 and 4 together the moment the
`PreToolUse` hook payload is confirmed to expose the calling subagent's real identity *and* someone is
prepared to build the gate. Verified today, against the running Claude Code binary: the payload does
expose the real caller (`agent_type`/`agent_id`) at any spawn depth, and the design (**"the
hook-flip"**) is worked out — a `PreToolUse` hook on the `Skill` tool that denies by the invoker's
*actual* role (keyed on the existing `skills_for_role()` source of truth), replacing the
`skillOverrides`-based off-list and retiring `CONSULT_SKILLS` entirely. Full design detail is in
task 42's brief.

**Split design-then-implement, on the same pattern already used for tasks 40/41 and the
investigation-then-implementation tasks 20/29/39** — recording an ADR and building against it are
independently shippable, and the architect said the ADR amendment must land first:
- **Task 42 — record the ADR** (reopen ADR-012 Decisions 3 & 4). Owner: fkit-architect. Depends on
  nothing; the analysis is already done.
- **Task 43 — implement the hook**, retire the old off-list/`CONSULT_SKILLS` plumbing once the hook is
  verified, update the two docs ADR-012 flagged. Owner: fkit-coder. **Depends on task 42 — hard.**

**Priority intent, despite append-only numbering:** this is a live bug blocking the coder's ability to
consult the reviewer at all for a stateful review — **recommended as the next thing picked up**,
ahead of the remaining lower-urgency backlog (34–39, 41), the same way task 17 was prioritized out of
its append-order slot. Owner to confirm the ranking.

**Not in scope for either task:** the "prose-only, no hook" alternative — evaluated and rejected today
(defeatable by prompt injection; would retire ADR-010's structural claim rather than strengthen it).
Task 42 records that rejection so it isn't re-litigated.

## Addendum — tasks 44 and 45 added out of band (2026-07-16): one skill, one output — reverting task 38

**The owner ran `/fkit-status`, was told *"Board not re-rendered (delta default). Run `/fkit-status
full` for the complete 43-row board"*, and asked why they should have to.** Ruling (verbatim):

> *"I want to remove different versions of the skill, there should be 1 version of the output if I run
> the skill, no additional arguments. I guess it means that we need to remove `full` and make the
> full-run by default."*

**This reverts task 38, `✅ Done` and shipped earlier the same week.** Task 38's brief argues
persuasively *for* the switch. **It is stale for one reason worth recording:** the step-5 delta default
was designed when the board was **hand-built by the LLM** — re-rendering 43 rows meant re-deriving every
marker and risking the miscount `SKILL.md` warns about. **Task 41 made the board `bash dashboard.sh` —
deterministic and free — retiring half the delta default's justification.** What survived was terseness
alone, and that is the owner's call.

**⚠️ `full` and the delta default go together or not at all.** Removing the keyword while keeping the
delta would be **strictly worse than today** — no path to the full board at all. The delta default is
the thing; `full` is only the patch on it.

### Settled by the producer: the sprint-name argument **survives**

*"No additional arguments"* reads literally as also killing `/fkit-status Sprint 1`. **It does not.**
The owner glossed their own rule and **named only `full`**; a sprint name is not an output *variant*
but a different *subject*; and killing it makes `sprints/done/` **unreachable by any path** — the same
failure shape as removing `full` while keeping the delta. **Owner to confirm at review**; the brief does
not build the two-argument removal on spec.

### Sequencing

```
44. remove the variants (fkit-coder) ──→ 45. wiki sync (fkit-wiki)
    (depends on nothing; 41 already landed)   (hard dependency — syncing first ingests the drift)
```

- **44 depends on nothing.** Task 41 is its *precondition already met*, not a blocker.
- **45 is split out because only `fkit-wiki` may write the vault** (ADR-005) — 8 pages reference `full`.
  Task 11's lesson: sync **after** the change, or the vault carries the drift with the authority of
  verified knowledge.

### Not in scope — deliberately

- **The dated design report** (`reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md`,
  3 refs) and **task 38's brief in `tasks/done/`**. Both are **history and stay frozen** — true when
  written. Task 38 remains `✅ Done`; it *was* done.
- **A softer delta** ("delta unless much changed"). A conditional variant is the same defect rewearing
  the hat.

### The tombstone-ADR call: **no ADR** — and the producer's reasoning, so it can be overruled

**Recommendation: no ADR.** The precedent raised is task 37 (the shared-instructions tombstone), and
**it does not transfer.** Task 37 tombstones a **mechanism** — it rejects `AGENTS-COMMON.md` and
`--append-system-prompt` **by name**, both of which are the first thing a competent person reaches for
and one of which cost an adversarial review to undo. **Nothing technical was learned here.** The owner
changed their mind about terseness after task 41 changed the cost. This repo's ADRs record mechanism and
structure (runtime, lockdown, KB layout, the exec bit) — not a product preference about one skill's
output. The record is task 44's brief and this addendum, both naming task 38 so the trail is findable
from the reverted work; task 45 additionally requires the task-38 **wiki page to be marked reverted
rather than deleted**, which is where someone re-proposing the feature would actually look.

**The tradeoff, stated plainly:** a brief in `tasks/backlog/` and an addendum in a sprint plan that will
be archived to `sprints/done/` are **weaker records than an ADR**, and neither is where a person
proposing a feature looks first. If `full` gets re-proposed citing task 38, this call was wrong and an
ADR is one cheap architect task away. **See open question 8** — the generalizable principle may be
better recorded as a **convention** than an ADR, and that is the owner's to rule.

## Addendum — task 46 added out of band (2026-07-16): the mutation-testing-library question

**Task 46 (`investigate-mutation-testing-library-adoption`) was scoped from the owner's reaction to a
review finding, mid-implementation of task 43** — relayed by fkit-coder, not raised by the producer.
Round-1 stateful review of task 43 (`ai-agents/reviews/implement-pretooluse-skill-ownership-hook.md`,
finding **R2**) found `test/prove-red.sh` — the task-23 / [ADR-014](../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)
mutation-testing hard gate — silently broken by task 43's own refactor (a hardcoded path failing even
at the unmutated baseline, and a `sed` mutation target that had moved). **R2 itself is fixed and
verified inside task 43's scope** — task 46 is the forward-looking question the owner raised in
response to it, verbatim: *"it looks like we need to use a proper library for auto-tests, which handles
this specific type of tests 'testing negative cases'."*

**It is scoped as an investigation, not an implementation, on purpose** — same pattern as tasks
20/29/39/45(-adjacent): a library adoption here would have to reconcile with ADR-014's settled
zero-devDependencies stance (Decision 4) and its hard-coded-oracle principle (Decision 5), and whether
that tradeoff is worth it is an architecture call, not the producer's to make in the brief. **Owner:
fkit-architect.** Depends on nothing; does not block task 43 or anything else in Sprint 2.

**Numbered 46 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — task 47 added out of band (2026-07-17): OQ8 resolved — the convention

**The owner ruled OQ8: generalize.** *"One skill, one output"* is a standing rule for every fkit
skill, recorded as a `knowledge-base/conventions/` entry per the producer's recommendation — with the
owner's own qualification built in: **operands are not variants.** Skills that require arguments
(`/fkit-task-done <path>`, `/fkit-task-cancelled <path> <reason>`, `/fkit-status <sprint>`, stateful
review's docs) are untouched — an argument that selects *what the skill works on* is a parameter; one
that selects *what the same work looks like when reported* is the forbidden variant. Task 47 records
the rule, the litmus test, the honest history (`full` was correct when written; task 41 made it
wrong), and the escape hatch (a proposed variant goes to the owner, at proposal time).

- **Owner: fkit-architect.** Document only. **Depends on: nothing; does not block task 44** — task 44
  is the instance, 47 is the rule; shippable in either order.
- **Numbered 47 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 48 and 49 added out of band (2026-07-17): the dual-home parity gap

**Task 47's delivery surfaced the fourth instance of a recurring class:** the convention landed in the
live `ai-agents/knowledge-base/` but not in `claude/scaffold/ai-agents/` — so consuming projects would
never receive it. Prior instances, all fixed one-at-a-time without touching the cause:
`fix-scaffold-knowledge-base-folders`, `bake-architecture-pointer-into-scaffold-templates`,
`align-conventions-readme-enforcement-item-live-vs-scaffold`. The owner ruled the cause now gets
addressed: *"changes are applied both to the current dogfood version and to the version that will be
shipped to the end users."*

**Split on the independent-shippability rule, and deliberately NOT sequenced:**
- **Task 48** closes the current instance — copy the convention + index row into the scaffold, verify
  by clean-init and convergence check. Owner: fkit-coder. **Does not wait for 49.**
- **Task 49** is the investigation into the cause — enumerate the dual-home files, rule on a
  must-match manifest vs accepted drift, spec a process layer (`/fkit-task-plan` scoping check +
  convention entry) and a mechanical parity test under ADR-014's zero-devDeps constraint, and state
  whether the deferred content-drift decision's *"third drifting file"* re-raise trigger has fired.
  Owner: fkit-architect. **Investigation-first (the task-20/29/39 pattern): implementation briefs only
  after the owner reviews findings.** Known trap recorded in the brief: accepted drift exists
  (`ai-agents/README.md`, both directions, deliberate) — a naive parity check is red from birth.

**Numbered 48/49 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 50 and 51 added out of band (2026-07-17): the skill-name collision

**The owner's ask:** rename the producer's `/fkit-task-plan` to `/fkit-task-brief` — it is the coder's
`/fkit-plan-task` with **the same two words swapped**, for the opposite end of the task lifecycle.
The new name says what the skill produces: briefs.

**Split coder/wiki on ADR-005's write boundary, same as 44/45:**
- **Task 50 — the rename** (owner: fkit-coder). Deliberately **atomic**: the skill directory,
  `skills-for-role.sh` (the ownership source of truth), and the task-43 PreToolUse hook must flip
  together or the producer loses the skill mid-rename. Dual-home discipline applies — the two
  conventions files naming the skill change in **both** the live tree and the scaffold. Every
  `task-plan` grep hit must be read, not batch-replaced — half the vocabulary belongs to the coder's
  un-renamed skill. History (closed plans, done briefs, reports, this plan's frozen addenda) stays
  frozen.
- **Task 51 — wiki sync after** (owner: fkit-wiki; **needs 50 — hard**). 8 vault pages carry the old
  name; living pages get the new name, historical pages get the task-45 mark-don't-delete treatment.

**Numbered 50/51 for append-don't-renumber discipline — contiguous and in dependency order. Owner to
confirm the ranking.**

## Addendum — tasks 52 and 53 added out of band (2026-07-17): the coder's autonomous loop

**The owner's ask:** a coder skill (working name `task-ship-loop`) taking a task from brief to done
with minimal owner involvement — a 13-step loop sketch, with the owner's own caveats built in: the
sketch is **not final**, the coder/producer/architect refine it together, and **the owner approves
the steps before implementation**. That caveat *is* the design-then-implement split (the 40/41,
42/43 pattern):

- **Task 52 — design** (owner: fkit-architect, consults producer). Must resolve, as owner-facing
  proposals, the conflicts the record already shows: **step 13 vs the owner-invoked mover gate**
  (a consent-model decision), **"autonomous" vs the coder's own "owner present for plan and fix
  gates" contract** (a deliberate amendment, not drift), **sub-agents cannot ask the owner**
  (the task-39 seam — design within today's envelope or declare the dependency), and the **two-hop
  consult envelope**. Ends with a numbered loop the owner approves. Adversarial pass recommended
  (the 20/29 precedent).
- **Task 53 — implement** (owner: fkit-coder; **needs 52 including the approval — hard**). Skill dir,
  `skills-for-role.sh` registration, hook coverage, ADR-014 tests, dry-run on a real task. Its wiki
  sync is deliberately **not** pre-created — the design may rename or reshape the skill; scoped when
  53 lands.

**Numbered 52/53 for append-don't-renumber discipline — contiguous and in dependency order. Owner to
confirm the ranking.**

## Addendum — tasks 55 and 56 added out of band (2026-07-17): the `fkit-git` agent

*(Renumbered from 54/55 to 55/56 on 2026-07-17 to resolve a duplicate-priority-54 collision with the
concurrently-added `grant-askuserquestion` task, which keeps 54.)*

**The owner's ask:** a new agent `fkit-git` owning git work, with one skill `commit-push` (commit +
push all uncommitted changes, caller-supplied title/message), invocable by other agents.

**⚠️ Scoped design-first because it collides with a universal hard rule.** `CLAUDE.md:49`:
*"Never commit or push unless the owner explicitly asks."* An agent that commits **on another agent's
request** routes around that gate — a change to the meaning of the team's core safety guarantee, which
is an **owner decision, not an implementation detail** (the task-36 consent-model / task-52-D1
precedent). Two further conflicts the design must handle: the **seven→eight agent-count** ripple
(asserted verbatim in `CLAUDE.md`, `PROJECT.md`, wiki, README, launcher, `fkit-team`), and
**no-secrets-on-push** (an agent that blind-commits a dirty tree is the highest-risk secret-leak
surface).

- **Task 55 — design** (owner: fkit-architect, **owner present** for the consent ruling). Resolves the
  consent model (producer's steer: owner-only or explicit-relay, **not** a silent weakening of the hard
  rule), the commit-push contract (staging scope, forbidden force-push, failure/announce), the agent
  contract (tools, consult reachability, session-or-consult), and enumerates the count ripple. May
  require an ADR amending/scoping the hard rule. Ends with the owner's approval.
- **Task 56 — implement** (owner: fkit-coder; **needs 55 incl. approval — hard**). Agent file, skill,
  registration, hook coverage, count/roster updates, ADR-014 tests. Its wiki sync is deliberately not
  pre-created.

**Numbered 55/56. Owner to confirm the ranking.**

## Open questions for the owner

*(OQ8 resolved 2026-07-17 — ruled "generalize", spawning task 47. Original text kept below for the
record.)*

8. **Does *"one skill, one output"* generalize beyond `/fkit-status`?** The owner's ruling was about one
   skill, and tasks 44/45 treat it that way. But the sentence *"there should be 1 version of the output
   if I run the skill"* states a **principle that would constrain every fkit skill** — no output-variant
   arguments, anywhere, ever.
   **Producer's recommendation: if it generalizes, it is a `knowledge-base/conventions/` entry, not an
   ADR** — it is a standing rule about how skills are written, which is exactly what
   `task-status-vocabulary.md` and `evidence-before-assertion.md` are. **It also has more teeth than a
   tombstone would:** a convention stops the *next* `full` from being written, where an ADR only explains
   why this one died.
   **The tradeoff:** it is a rule written from a single instance. The honest counter is that a variant
   argument is sometimes right — `full` itself was defensible when the board was hand-built and
   expensive, and it stopped being defensible only when task 41 made it free. A blanket convention would
   have forbidden a decision that was **correct at the time**. **Not scoped; say the word and it becomes
   a brief.**

---

### Owner dispositions (2026-07-15) — all seven ruled

The owner ruled on all seven open questions below. Recorded here; the original text is kept for the record.

1. **OQ1 (npm reserve) — LEAVE IT for now.** No task; the scoped name is not held. Re-raisable any time.
2. **OQ2 (mover link policy) — DO THE REC: re-point the href, never the prose.** Ratifies what task 22
   already implemented; task 22's `✅ Done` stands. No new task.
3. **OQ3 (mechanical link checker) — NO.** Not pursued. No task.
4. **OQ4 (T28 opt-out location) — DO THE REC: a tracked `ai-agents/.fkit-keep-out`.** **Task 28 is
   unblocked** — its brief §4 is updated from recommendation to decided.
5. **OQ5 (`.fkit/` orphan cleanup) — DO THE REC: scoped as its own task with its own owner gate → task
   36** (`remove-fkit-omnigent-orphan-residue.md`), depends on 28, blocked on a consent-model ruling.
6. **OQ6 (tombstone ADR for the shared-instructions reversal) — DO THE REC → task 37**
   (`record-shared-instructions-reversal-adr.md`), owner: fkit-architect via `/fkit-record-decision`.
7. **OQ7 (read-side symlink hazard) — DO THE INDEPENDENT TASK** rather than fold it into task 28 →
   **unsprinted backlog** (`gate-read-side-symlink-hazard-in-init.md`).

---

1. **Reserve `@flashist/fkit` on npm now, or leave npm alone until there's something to publish?**
   Nothing in Sprint 2 depends on the answer — it only decides whether the name is held before
   someone else takes it, the way `fkit` already went.

2. **Task 22 — do the task movers repair inbound links repo-wide, or are closed sprint plans
   immutable historical records that may point at where a task *was*?** **Task 22 cannot start until
   this is answered.**
   **Producer's recommendation: re-point the href, never the prose.** A closed plan's *claims* are
   history and must stay frozen — `➡️ Moved to Sprint 2 — priority 7` is true forever. But a **link is
   not a claim, it is a pointer**, and a pointer to a file that isn't there is rot, not history.
   **The tradeoff:** the movers would then **write into `sprints/done/`**, a directory the project
   currently treats as never-touched. If "closed" means *byte-frozen*, the honest alternative is to
   accept the broken links by design — but that requires a permanent, unbounded `sprints/done/**`
   exclusion in any future link check, permanently blinding it over a directory that only grows.

3. **Should fkit own a mechanical link checker at all?** This repo has **no test suite and no link
   check** — this defect was found only because fkit-coder hand-rolled a sweep, and every verification
   step in tasks 21 and 22 is manual today. **Producer's position: worth doing, and its home is the
   already-unsprinted [`add-e2e-smoke-script-for-fkit-itself.md`](../tasks/cancelled/add-e2e-smoke-script-for-fkit-itself.md)** — deliberately **not**
   folded into task 22, where it would ship untested alongside the very change it exists to test.
   Flagged as a scoping question, not decided.

4. **Task 28 — where does the convergence opt-out live?** It is the one genuinely open design decision
   in tasks 25–28, and it is **the same trap that killed the version cursor**: `.fkit/` is **gitignored**,
   so an opt-out stored there **does not survive a `git clone`** — a teammate's launch would resurrect
   the `wiki-vault/` the owner deliberately deleted.
   **Producer's recommendation: a tracked opt-out file inside `ai-agents/`** (e.g.
   `ai-agents/.fkit-keep-out`), listing paths convergence must never create. It is committed, so it
   survives a clone and is shared with the team; it lives in the tree the user owns; and it records
   **intent**, not **progress**, so it is not a version cursor by the back door.
   **The tradeoff:** it puts an fkit-managed dotfile into the user's tracked history — a small,
   permanent surface the project has so far avoided. The honest alternative is *no opt-out at all*, and
   that one is not acceptable: it means a user who deleted a folder on purpose fights fkit about it on
   every launch, forever.

5. **The `.fkit/` Omnigent-orphan cleanup (report §9) — scope it, or leave it?** Not currently tasked;
   the owner did not greenlight it and the producer has not assumed it. It is the **one destructive act**
   in the report (`rm -rf` in a user's project, no rollback), and the report's own draft target list was
   **wrong once already** — it named `.fkit/settings`, which is **live** ADR-010 lockdown state. Dead
   residue really is sitting in this repo right now (`.fkit/agents/`, `.fkit/run`, `.fkit/team-session`,
   `.omnigent/` — all with zero references in current code).
   **Producer's recommendation: yes, but as its own task with its own owner gate**, and *after* 25–28
   land — because it needs a **consent model** (announce-only? ask once?), a **dry-run**, and the
   reference-check re-run as a hard gate. It is **not** an every-launch silent operation, and it should
   not be smuggled into the convergence pass, where it would inherit "runs unattended on every launch"
   from code that is *additive by invariant*. **Say the word and I'll write the brief.**

6. **Does the shared-instructions reversal get a tombstone ADR?** Not tasked — the owner has not ruled,
   and the producer has not assumed. **Producer's recommendation: yes, and it is cheap.** The reversal
   settles a mechanism question and **rejects two specific, obvious ideas by name**: `AGENTS-COMMON.md`
   (cannot reach Codex) and **`claude --append-system-prompt`** (session-only — **0/3, then 0/2**, into a
   spawned consult, on **Claude Code 2.1.208**). Both are the *first* thing a competent person reaches
   for. Rev 1 of the report reached for one of them and it cost an adversarial review to undo. A dated
   report is easy to miss; an ADR is where someone looks before proposing a mechanism.
   **The tradeoff:** it pins a **negative result against one harness version**. If Claude Code later makes
   `--append-system-prompt` inheritable, the ADR is a fossil that says "don't" about something that now
   works. Mitigation is the one rev 2 already models — **record the version in the ADR itself** — but the
   risk of a stale prohibition is real and is the reason this is a question, not a task.
   **Owner: fkit-architect, via `/fkit-record-decision`.** Say the word.

7. **The read-side symlink hazard — task, or a note on task 28?** Flagged, not assumed. Task 27 gated
   **writes** through a symlinked `ai-agents/` (`[ -L ]` at `fkit-claude-init.sh:40`); it did **not** gate
   **reads**. A future init step that *reads* `$dest/ai-agents/…` would read **through** the link and pull
   off-project content into fkit's own behavior. **Nothing does that today** — and the one design that
   would have (the rejected `AGENTS-COMMON.md` splice) is dead, which is why this is now latent rather
   than live. **Tasks 30–32 do not touch it:** they read from the **scaffold** and write to the **project
   root**. *(Task 31 has its own, different symlink exposure — a symlinked `CLAUDE.md` — and its brief
   gates that with `[ -L ]` explicitly.)*
   **Producer's recommendation: no task now.** A brief for a bug no code can reach is a brief that rots
   before it ships. **Its right home is task 28** — the next thing that will genuinely read and write
   per-path inside `ai-agents/`. **When 28 is unparked, this hazard goes into its brief as a requirement,
   not into a task of its own.** If you'd rather have it tracked independently so it cannot be lost with
   28, say so and I'll write it — that is the honest counter-argument, and it costs one brief.
