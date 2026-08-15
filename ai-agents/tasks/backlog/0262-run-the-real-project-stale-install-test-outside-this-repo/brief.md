# Run the real-project stale-install test — exercise Sprint 4's structure-check capability outside this repo

## ID
0262

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

### Authority — an owner ruling, and it is a ruling to FILE, not to schedule

**Owner ruling, 2026-08-10**, given via `AskUserQuestion` in a live session — a selection from the
question's option list, **the option label is the verbatim text**: **"File a brief, leave on
backlog"**. The option description as presented to the owner, verbatim:

> *The intent gets a durable home so it can't be lost, but doesn't block Sprint 5 or the release. You
> pick it up when convenient.*

**⚠️ This task is deliberately unscheduled and it does NOT gate the release.** That is the substance
of the ruling, not an omission — it is filed to the **Backlog** board on purpose, and pulling it into
Sprint 5 would reverse the ruling rather than honor it. It answers
[Sprint 5](../../../sprints/done/sprint-5.md)'s **open question 1** (*"Was the stale-install test dropped,
or deferred?"*): **deferred, with a filed home.**

### Why it exists — a gate that was lifted, not met

The owner's ruling of **2026-08-08** (still readable, byte-identical, in
[`backlog.md`](../../../sprints/backlog.md)'s `## Notes`) held the whole release-hygiene cluster off
any sprint on two stated reasons, one of which was *"Sprint 5 gets scoped after the real-project
stale-install test reports."* On **2026-08-10** the owner **lifted that gate rather than satisfying
it**, because a downstream project filed a real defect against shipped code and the fix became the
priority.

**The consequence, stated plainly: nothing Sprint 4 shipped has ever been exercised outside this
repo.** [Sprint 4](../../../sprints/done/sprint-4.md) reads **8 of 8 `✅ Done`** and **every one of
those eight closes carries `(agent-closed — not owner-verified)`**. The whole structure-check and
consent-gated-repair capability (`0243`–`0248`) has only ever run against fixtures in its own
codebase. This task is the only planned thing that would change that.

> ## ⚠️ DATED CORRECTION 2026-08-14 — THE PARAGRAPH ABOVE IS FALSIFIED IN PART. It is left byte-identical.
>
> ⚠️ **FRAMING ONLY.** ⛔ **This task's scope, intent and deliverable are UNCHANGED** — all fifteen
> acceptance criteria, the field report, the honesty bound and the `[F]`/`[R]` tagging stand exactly as
> written. **No scope change, no status change, no re-rank, no file move.** Written by a spawned
> `fkit-producer` with no owner channel.
>
> ⛔⛔ **DO NOT READ THIS AS DISCHARGING THE TASK. The owner did not rule that, and this note does not.**
>
> ### What actually happened, and what it did NOT touch
>
> **On 2026-08-14 the owner updated to `v0.2.2` and ran `fkit` in a real consuming project
> (`geoconflict`).** Recorded, with the output quoted verbatim, in
> [`0303`](../0303-give-the-lead-a-trigger-for-the-structure-notice-so-it-can-offer-the-heal/brief.md)'s
> `## Provenance`. **The launch-time structure notice fired on 5 diverging paths:**
>
> ```
> ⚠ fkit: 5 path(s) diverge from what the installed fkit version ships (CLAUDE.md, AGENTS.md,
>   ai-agents/knowledge-base/conventions/README.md +2 more) — run /fkit-heal in a producer session
>   to see and repair; nothing was changed. Deliberate? List the path in ai-agents/.fkit-accepted-drift.
> ```
>
> ⭐ **That is a genuine, first-ever exercise of Sprint 4 work outside this repo**, and the sentence
> *"nothing Sprint 4 shipped has ever been exercised outside this repo"* is **no longer true as an
> absolute**. ⚠️ **It is also the narrowest possible slice of what this task exists to do.**
>
> ### ⛔ THE LEDGER, STATED PRECISELY — because "partly falsified" is exactly where a run over-claims
>
> **✅ EXERCISED by the `geoconflict` run:**
> - the **launch-time structure notice** — it fired, in a real project, on real drift;
> - that the notice **classifies and counts** (5 paths, three named plus *"+2 more"*);
> - that it is **non-mutating** — *"nothing was changed"*;
> - that it **routes** the reader to `/fkit-heal` in a producer session, and names the
>   `ai-agents/.fkit-accepted-drift` escape.
>
> **⛔ NOT EXERCISED — every one of these is still owed, and they are the bulk of this task:**
> - ⛔ **`/fkit-heal`'s CHECK phase** — no per-file verdicts were ever produced or captured;
> - ⛔⛔ **THE ENTIRE REPAIR LEG** — propose → `AskUserQuestion` consent → apply. **Nothing was
>   repaired, so criteria 8–14 are wholly untouched**, including dry-run/apply parity (8), the
>   **freshness refusal** (9, which the brief already says must be *deliberately staged*), the v1
>   boundary (10), ADR-005 non-writing under repair (11), the consent shape and no-persisted-consent
>   check (12), and per-path announce output (14);
> - ⛔ **`FKIT_CLEANUP_DRY_RUN=1`** — the orphan-cleanup dry run (procedure step 2) never ran;
> - ⛔ **The `fkit update` → **re-launch inside the project** sequence** and its
>   `• refreshed N agents … M skills …` line (procedure step 3, verification 4);
> - ⛔ **The four `git status --porcelain` readings** the report must carry (verification 2);
> - ⛔ **THE FIELD REPORT ITSELF** — the deliverable. **Nothing was written under
>   `ai-agents/knowledge-base/reports/`.**
>
> ⭐⭐ **So the `0245`/`0246` verification promise this task carries is NOT discharged.** Criteria
> **8–15 are the `0246` half and none of them was reached.** ⚠️ **The 2026-08-10 sentence *"Until this
> task actually runs, the promise is ASSIGNED, not met"* is STILL TRUE** — only its supporting sentence
> *"nothing Sprint 4 shipped has been exercised outside this repo"* has moved.
>
> ⛔ **The `(agent-closed — not owner-verified)` markers on all eight Sprint 4 rows are UNAFFECTED and
> stay on permanently.** Nothing in this note may be read as changing one.
>
> ### ⚠️ Two smaller facts that also moved
>
> - **`VERSION` reads `0.2.2`** (measured 2026-08-14). The target-project paragraph names *"already
>   running fkit `0.2.1`"* and *"any real consuming project on `0.2.x`"*. ✅ **The `0.2.x` criterion is
>   unaffected**; only the specific `0.2.1` figure is dated. ⛔ Re-measure at pickup.
> - ⭐ **`geoconflict` is now a candidate target in its own right** — it is already updated to `v0.2.2`,
>   already has real drift on 5 paths, and the owner already has the working directory. ⛔ **This is
>   input, NOT a selection**: the brief requires the run to **say which project was used**, and the
>   batching caution about a second ask of the downstream reporter is untouched.
>
> ⚠️ **Consequence for the `## What to build` procedure, stated because it is easy to get backwards:**
> a project already showing 5 diverging paths is the **drifted-untouched** case criterion 3 calls
> *"the criterion the whole test exists for"* — ⛔ **but only if the check phase is actually run and
> its verdicts captured.** A notice count is not a classification.
>
> ⛔ **Nothing else about this row changed.** `## Status` `🔲 Backlog`, `## Priority` `Unscheduled`,
> `## Sprint` `Backlog`, `## Owner` `fkit-producer` — all untouched. ⛔ **It stays deliberately
> unscheduled and is still not a release gate** (owner ruling 2026-08-10, *"File a brief, leave on
> backlog"*). No board row edited, nothing re-ranked (ADR-035), no mover run (ADR-033), nothing written
> under `ai-agents/wiki-vault/` (ADR-005), nothing committed.

### ✅ AMENDED 2026-08-10 — this task now CARRIES the `0245`/`0246` verification promise and DISCHARGES it

Everything above is left **byte-identical** and still true. This section records a **second owner
ruling of the same day**, given via `AskUserQuestion` in a live session — a selection from the
question's option list, **the option label is the verbatim text**: **"0262 replaces it — record that
(Recommended)"**. Option description as presented to the owner, verbatim:

> *The stale-install test on a real project exercises the same consent-gated repair path 0245/0246
> were closed against, arguably harder than a fixture check would. Record explicitly that 0262
> discharges the promise, so the record doesn't carry an open commitment nobody intends to meet.
> Consequence: 0245/0246 stay closed as agent-closed — not owner-verified, permanently.*

**What it settles.** The 2026-08-08 note's promise that the owner would *personally verify* `0245` and
`0246` is now **carried by this task**, and this task **discharges it on completion**. **No separate
personal owner verification of either is intended or owed.** The project record no longer holds an open
commitment nobody means to meet — which is the whole reason it is written down here.

**⚠️ It raises this task's stakes without changing a single one of its criteria.** The fifteen
acceptance criteria below are unchanged, and so is their honesty bound: a `[R]` criterion marked
*pass* on field evidence alone is still a false report, and *not exercised* is still a required
available verdict. **Discharging the promise means running this task honestly — not reporting fifteen
passes.**

**⛔ What this does NOT license, stated because the temptation is obvious:**

- ⛔ **`0245`'s and `0246`'s `(agent-closed — not owner-verified)` markers stay on, PERMANENTLY** — as
  do all eight Sprint 4 rows'. Completing this task does **not** retroactively make any of them
  owner-verified, and **nothing may be edited to suggest it does**.
  [Sprint 4](../../../sprints/done/sprint-4.md)'s banner forbids touching them; this ruling reinforces
  that in its own words.
- ⛔ **It does not schedule this task.** Discharging a promise is not scheduling it. This brief stays on
  the **Backlog** board, deliberately unscheduled, and **does not gate the release** — the same day's
  **"File a brief, leave on backlog"** ruling is unchanged. **Do not move it, do not rank it, do not
  pull it into Sprint 5.**
- ⛔ **It does not reopen `0245` or `0246`**, and moves neither file.

**⚠️ Until this task actually runs, the promise is ASSIGNED, not met.** Nothing Sprint 4 shipped has
been exercised outside this repo, and that is still true today.

### ⚠️ This is an OWNER-RUN verification, not agent work — and the tooling enforces it

`## Owner` reads `fkit-producer` because that is the accountable **seat** (the vocabulary admits only
roles — see
[`task-owner-vocabulary.md`](../../../knowledge-base/conventions/task-owner-vocabulary.md)), and
because `/fkit-heal` is a producer-owned skill. **The execution is the human owner's**, for two
reasons that are mechanical, not stylistic:

1. `/fkit-heal`'s repair phase collects consent through **one `AskUserQuestion`** and, per its own
   procedure, *"In a headless or background invocation, **stop after the check report**"*. A spawned
   agent structurally cannot complete the repair leg.
2. The test runs **in another repository on the owner's machine**. No agent in this repo has that
   working directory.

A background agent may prepare and report; it cannot discharge this task.

### An in-repo instance of the very failure this test targets — found 2026-08-10, while filing

`claude/agents/fkit-producer.md` (canonical) and `.claude/agents/fkit-producer.md` (the fkit-managed
copy) **disagree today, in this repo**. The canonical file describes `/fkit-heal` as carrying a
*"**consent-gated repair** of untouched-stale files"*; the copy still says it is *"report-only in
every branch: it repairs nothing until the consent-gated repair phase ships"*. `repair.sh` exists on
disk (`claude/skills/fkit-heal/repair.sh`), so **the copy is stale and states something false about
the tool a producer session is holding.**

That is exactly the gap
[`0253`](../../done/0253-state-the-per-project-relaunch-step-fkit-update-requires/brief.md) documents and
[`0255`](../../done/0255-decide-whether-claude-enters-the-structure-conformance-surface/brief.md) decides:
`.claude/` is refreshed **only on launch**, with **no diagnostic of any kind** when it is stale. It
is now observed, not hypothesized — and it is the strongest available argument for running this test
against a project that is not this one. **⛔ Do not "fix" it as part of this task** (see Out of
scope); it is evidence, and it belongs to `0253`/`0255`.

## What to build

**Deliverable: a written field report**, not code — what was run, what each phase reported, what was
approved, what actually changed, and every criterion below marked pass / fail / **not exercised**.
File it under `ai-agents/knowledge-base/reports/` per that directory's `YYYY-MM-DD-<slug>.md`
convention.

### The target project

**Recommended: the downstream project that filed the dashboard defect report** — a game, ~50 tasks,
already running fkit `0.2.1`, and already engaged with us in writing. Any real consuming project on
`0.2.x` that is not this repo satisfies the task. **Say which was used.** ⚠️ If it is the downstream
reporter, this is a **second** ask of the same third party alongside Sprint 5's pre-release naming
test (owner ruling of 2026-08-10, recorded in
[`0260`](../../done/0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md))
— **batch the two asks or sequence them deliberately; do not send them independently.**

### The procedure — known shape, in order

Line numbers below are **dated anchors of convenience, measured on this tree 2026-08-10**; the
durable anchors are the quoted code and behavior. Re-measure before relying on any of them.

1. **Stash or commit in the target project FIRST.** `claude/fkit-claude-init.sh:460` replaces the
   fkit rules block by `mv "$tmp" "$f"` — **all-or-nothing and with no backup of the previous
   file**. A dirty `CLAUDE.md`/`AGENTS.md` in the target project has nothing to fall back to. Record
   the target project's `git status --porcelain` **before** anything else runs; that reading is the
   baseline every later diff is measured against.
2. **First launch with `FKIT_CLEANUP_DRY_RUN=1`**, so the orphan cleanup announces its deletes
   instead of performing them. The gate is `claude/fkit-claude-init.sh:695`
   (`if [ "${FKIT_CLEANUP_DRY_RUN:-0}" = 1 ]; then dry=1; fi`). The four deletable paths are
   `claude/orphan-targets:23-26` — verified 2026-08-10 as exactly: `.fkit/agents`, `.fkit/run`,
   `.fkit/team-session`, `.omnigent`. **Record what the dry run said it would remove**, and decide
   deliberately whether to let it.
3. **`fkit update`, then re-launch INSIDE the project.** The update refreshes the **install share
   only**. A project's `.claude/` agents and skills are refreshed by `claude/fkit-claude-init.sh`
   (`:479-490`), which runs **only on launch**. Skipping the re-launch leaves the project on stale
   agents and skills with **no diagnostic** — the observed defect above. **Record the `• refreshed N
   agents → .claude/agents/, M skills → .claude/skills/` line the launch prints.**
4. **`/fkit-heal` in a producer session in that project** — check phase first, its per-file verdicts
   captured verbatim; then, if anything classifies `untouched-stale`, the propose → `AskUserQuestion`
   → apply legs. **Then `git diff` in the target project to confirm the applied set equals exactly
   what was approved** — no extra file, no missing file.

### The acceptance criteria — `0245` and `0246`'s own, carried here because nothing ever checked them

These are **not new criteria.** They are the verification steps
[`0245`](../../done/0245-build-the-producer-owned-structure-check-skill/brief.md) and
[`0246`](../../done/0246-build-the-consent-gated-repair-path-inside-the-check-skill/brief.md) were
closed against, agent-closed and never owner-verified. **Do not re-invent them; discharge them.**

**⚠️ Honesty bound, stated up front: most of these were written as in-repo fixture assertions. A
field test cannot cover all of them.** Each is tagged **[F]** — genuinely exercisable on a real
install — or **[R]** — an in-repo assertion a field run can only partially stand in for. **Marking a
`[R]` criterion "pass" on field evidence alone is a false report.** Mark it *not exercised*.

**From `0245` (the read-only check):**

1. **[R]** The skill exists under `claude/skills/`, owned by the **producer** in `skills_for_role()`;
   the ADR-018 hook test matrix covers it (producer allowed, at least one other role denied);
   `npm test` is green. **[F] field half:** `fkit-heal` is present in the target project's
   `.claude/skills/` **after** step 3's re-launch, and a producer session can invoke it.
2. **[F]** Run against a **conforming** state: the report says so and **no file is touched**
   (`git status --porcelain` unchanged from step 1's baseline).
3. **[F]** Drifted-untouched vs drifted-edited **classify differently** (`untouched-stale` vs
   `owner-edited`), driven by the manifest, with diffs shown for owner-edited. ⭐ **A real stale
   install IS the drifted-untouched case — this is the criterion the whole test exists for.**
4. **[F/R]** Marker cases on the target's own `CLAUDE.md`/`AGENTS.md`: malformed → refusal-to-classify
   reported; absent → owner-edited; block-only drift does not mark an untouched body edited, and vice
   versa. Field coverage depends on which shapes the target actually has — **report which were
   present and which were not exercised.**
5. **[R]** Safety-bar fixtures: symlink / wrong-type refused loudly; keep-out respected; chmod-000
   and CRLF variants behave per report §9. **[F] only if** the target genuinely contains such a path.
6. **[F]** Wiki-vault paths are existence-only; a nonconforming `schema.md` yields a report line
   routing to `fkit-wiki`; **nothing under `ai-agents/wiki-vault/` is written** (ADR-005).
7. **[F]** The check phase never prompts for or applies a repair — its own diff is empty.

**From `0246` (the consent-gated repair):**

8. **[F]** **Dry-run / apply parity:** the applied set is **exactly** the approved proposal — nothing
   more, nothing less — and each applied file still hash-matched the pre-state the proposal showed.
   *(This is step 4's `git diff` check.)*
9. **[F]** **Freshness refusal:** a file edited between consent and apply has that item **refused and
   reported**, never applied. Deliberately stage this in the field; it will not occur by itself.
10. **[F]** **v1 boundary:** an owner-edited file is never in the apply set (report-only with diff);
    nothing is moved, renamed, or deleted by any code path.
11. **[F]** **ADR-005:** a repair run against a nonconforming `wiki-vault/` writes **nothing** under
    it.
12. **[F]** **Consent shape:** approval is collected via `AskUserQuestion` with the enumerated
    per-file list and **diffs in view**; **no consent is persisted anywhere** — no file, no config, no
    env. Check the target project for any new state file after the run.
13. **[F/R]** **`CLAUDE.md`:** an untouched-stale body is replaced with markers and the current
    fkit-managed block preserved **byte-for-byte**; block-only drift triggers no repair; malformed
    markers are report-only.
14. **[F]** Per-path announce output states **what actually happened** for every item, including
    refused ones.
15. **[R]** `npm test` green; the launcher/init diff for the task is empty. In-repo only — **not
    exercisable in the field, mark it so.**

### ⛔ Out of scope

- ⛔ **No fix of anything the test finds.** A defect found here is **filed as a new brief**, not
  patched inside this task. The report is the deliverable.
- ⛔ **Do not repair the stale `.claude/agents/fkit-producer.md` copy noted above.** It is evidence
  for `0253`/`0255` and re-launching this repo would erase it before either task reads it.
- ⛔ **No `ai-agents/wiki-vault/` write** (ADR-005) — in this repo or the target's.
- ⛔ **No commit, no push**, here or in the target project.
- ⛔ **Do not pull this task into a sprint** without a fresh owner ruling — the 2026-08-10 ruling
  placed it on the Backlog deliberately.
- ⛔ No re-rank, no task-file move.

## Verification steps

1. A field report exists under `ai-agents/knowledge-base/reports/`, named per that directory's
   `YYYY-MM-DD-<slug>.md` convention, and it **names the target project and the fkit version it was
   running**.
2. It records the target project's `git status --porcelain` **baseline** (step 1) and its state after
   each of steps 2, 3 and 4 — four readings, not a summary.
3. It quotes the `FKIT_CLEANUP_DRY_RUN=1` run's announced deletions verbatim, and states whether any
   deletion was subsequently allowed.
4. It quotes the launch's `• refreshed N agents … M skills …` line, confirming step 3's re-launch
   actually happened.
5. It reproduces `/fkit-heal`'s **per-file check verdicts verbatim**, and the propose list and
   approved list **side by side** with the resulting `git diff --stat`.
6. **Every one of the fifteen criteria above carries an explicit `pass` / `fail` / `not exercised`
   verdict.** A criterion with no verdict fails this step. **A `[R]` criterion marked pass on field
   evidence alone also fails this step.**
7. Criterion 9 (freshness refusal) was **deliberately staged** — the report says how — or is marked
   `not exercised` with the reason.
8. `git status --porcelain` in **this** repo shows the report added and nothing else; nothing under
   `ai-agents/wiki-vault/`, `claude/`, or `test/`.
9. Every defect the test surfaces is listed with a proposed disposition, and the report says
   explicitly whether any of them changes the release decision.

## Notes

- **Depends on:** nothing. Everything it exercises is already on disk and shipped in `0.2.x`.
- **Blocks:** nothing.
- **⚠️ Deliberately unscheduled, by owner ruling 2026-08-10 — verbatim "File a brief, leave on
  backlog". It does NOT gate the release**, and nothing on [Sprint 5](../../../sprints/done/sprint-5.md)
  waits on it. Recorded here because "unscheduled" is this board's default and needs no note, while
  *"unscheduled on purpose, and not a release gate"* is information that lives nowhere else.
- **It also does not gate `0245`/`0246`.** Both are closed and archived; running this does not reopen
  them. It converts *"never checked"* into *"checked, here is what we found"* — which is a report,
  not a status change. **⛔ Do not touch either brief's `(agent-closed — not owner-verified)`
  marker** on the strength of this task; [Sprint 4](../../../sprints/done/sprint-4.md)'s banner
  forbids it, and only a mover skill invoked by the producer changes a close.
- **Answers Sprint 5's open question 1**, and is **adjacent to its open question 2** (*"Do `0245` and
  `0246` still get owner-verified?"*). ⚠️ **This task does not answer question 2** — a field report is
  not the personal verification the 2026-08-08 note described. If the owner wants that too, it is a
  separate decision.
  - **✅ AMENDED 2026-08-10 — that separate decision was TAKEN, and this bullet's last sentence no
    longer describes the state.** The bullet is left **byte-identical**. By a second owner ruling of
    the same day (verbatim option label **"0262 replaces it — record that (Recommended)"**, recorded in
    full in `## Context` above) **this task DISCHARGES the `0245`/`0246` verification promise on
    completion, and no separate personal owner verification is intended or owed.** The bullet stays
    right that a field report is **not** a personal verification — the ruling **accepts that
    substitution knowingly** rather than denying it. ⛔ The markers stay on **permanently**; ⛔ this task
    stays **unscheduled** and **not a release gate**.
- **Coordination, not a dependency:** if the target is the downstream reporter, batch with the
  Sprint 5 pre-release naming test (owner ruling 2026-08-10, recorded in `0260`'s Notes). ⚠️
  **Deliberately NOT a `Depends on` declaration** — neither gates the other, and a false label would
  render this row as blocked. Form per
  [`conventions/dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md).
- **Line-number citations are dated (2026-08-10) anchors of convenience**; the durable anchors are the
  quoted code and behavior.
  [`0171`](../0171-write-the-durable-citation-anchors-convention-page/brief.md) is the open task for
  the convention page.
- ⚠️ **This brief decays.** The `.claude/` staleness instance was measured 2026-08-10 and a single
  re-launch of this repo erases it. Re-measure before citing it.
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board; no sprint was named by the owner
  and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5).
- Filed 2026-08-10 by a spawned `fkit-producer` with no owner channel, on the owner's ruling of the
  same day.
