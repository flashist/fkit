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
| 🔲 Backlog | 24 | Stop agents asserting repo state they never checked *(a false instruction in both task movers, shipping to every project)* | [`stop-agents-asserting-unchecked-repo-state.md`](../tasks/backlog/stop-agents-asserting-unchecked-repo-state.md) |
| ✅ Done | 25 | Fix the scaffold — ship the KB folders its own README promises *(defect; 100% of new projects)* | [`fix-scaffold-knowledge-base-folders.md`](../tasks/done/fix-scaffold-knowledge-base-folders.md) |
| ✅ Done | 26 | Stop an init failure from bricking the launcher *(pre-existing defect)* | [`stop-init-failure-bricking-the-launcher.md`](../tasks/done/stop-init-failure-bricking-the-launcher.md) |
| ✅ Done | 27 | Refuse init on a weird `ai-agents/` — symlink / file-where-dir *(live DoS + silent-skip bugs; the write-outside hazard is **prospective** — see the 2026-07-14 correction)* | [`refuse-init-on-weird-ai-agents-state.md`](../tasks/done/refuse-init-on-weird-ai-agents-state.md) |
| 🔲 Backlog | 28 | Make launch converge `ai-agents/` additively *(**"the migration"** — needs 26 + 27)* | [`converge-ai-agents-additively-on-launch.md`](../tasks/backlog/converge-ai-agents-additively-on-launch.md) |
| ✅ Done | 29 | Add a shared instructions layer that every fkit agent reads *(investigation — [findings rev 2](../knowledge-base/reports/2026-07-14-shared-instructions-layer.md); spawned 30–32)* | [`add-shared-instructions-layer-for-all-agents.md`](../tasks/done/add-shared-instructions-layer-for-all-agents.md) |
| ✅ Done | 30 | Give Codex the universal hard rules it has never had *(**live defect** — the required second model runs with no floor)* | [`give-codex-the-universal-hard-rules.md`](../tasks/done/give-codex-the-universal-hard-rules.md) |
| ✅ Done | 31 | Merge an fkit-managed rules block into an **existing** `CLAUDE.md`/`AGENTS.md` *(the brownfield hole; **idempotent or it grows the file forever**)* | [`merge-fkit-rules-block-into-existing-root-context-files.md`](../tasks/done/merge-fkit-rules-block-into-existing-root-context-files.md) |
| ✅ Done | 32 | Add the "no secrets" rule to `fkit-lead.md` *(the 1 of 7 missing it — one line)* | [`add-no-secrets-rule-to-fkit-lead.md`](../tasks/done/add-no-secrets-rule-to-fkit-lead.md) |
| ✅ Done | 33 | Fix the headless menu-guard crash — `[ -r /dev/tty ]` never tests openability *(launcher defect against task-23 assertion 7's contract)* | [`fix-headless-menu-guard-crash.md`](../tasks/done/fix-headless-menu-guard-crash.md) |

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
