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
| 🔲 Backlog | 18 | Remove `fkit --resume` and the blanket arg-passthrough *(Omnigent scar tissue)* | [`remove-fkit-resume-passthrough.md`](../tasks/backlog/remove-fkit-resume-passthrough.md) |
| ✅ Done | 19 | Repair the knowledge-base paths in product source *(ADR-013 fallout)* | [`repair-knowledge-base-paths-in-product-source.md`](../tasks/done/repair-knowledge-base-paths-in-product-source.md) |
| 🔲 Backlog | 20 | Design a version-to-version migration mechanism *(**investigation first** — no implementation from the brief)* | [`design-version-to-version-migration-mechanism.md`](../tasks/backlog/design-version-to-version-migration-mechanism.md) |
| 🔲 Backlog | 21 | Repair the 6 broken task links in the closed Sprint 1 plan *(one-off cleanup — independent)* | [`repair-broken-links-in-closed-sprint-plans.md`](../tasks/backlog/repair-broken-links-in-closed-sprint-plans.md) |
| ✅ Done | 22 | Stop the task movers rotting links in closed sprint plans *(the recurrence — the real bug)* | [`harden-task-movers-against-closed-sprint-link-rot.md`](../tasks/done/harden-task-movers-against-closed-sprint-link-rot.md) |
| 🔲 Backlog | 23 | Add the launcher-contract test suite *(`node --test`, zero devDeps — **after 18**)* | [`add-launcher-contract-smoke-script.md`](../tasks/backlog/add-launcher-contract-smoke-script.md) |

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

## Open questions for the owner

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
   already-unsprinted [`add-e2e-smoke-script-for-fkit-itself.md`](../tasks/backlog/add-e2e-smoke-script-for-fkit-itself.md)** — deliberately **not**
   folded into task 22, where it would ship untested alongside the very change it exists to test.
   Flagged as a scoping question, not decided.
